#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LG-014 件 3：中枢 watchdog 裁决器（确定性，无 LLM；本地计划任务 5min 拉起）。

输入三件套（董事会令）：heartbeat.jsonl mtime + ledger-mirror.md mtime + board-journal.md mtime
（前两者为主判据/旁证采集；心跳年龄为主判据，镜像/记事本 mtime 作 evidence 旁证）。

判据（确定性）：
  心跳年龄   <30min → alive；30-60min → stale；>60min → silent
  心跳缺失   + transcript 停滞 >60min → unreachable；+ transcript 活跃 → pending（冷启动保护）
  水位       hub-waterlevel.py 输出 >=80% → pre_warning=true（critical>=90 同理透传）
  防抖       候选 level 需连续 2 周期一致才翻转生效（state 文件 .fade/hub/watchdog-state.json）

输出：stdout JSON {level: ok|pending|degraded|unreachable, pre_warning, metrics, evidence}
     + flag 文件 .fade/hub/watchdog-flag.json（每次覆写，供编排层消费）
退出码：ok/pending=0；degraded=1；unreachable=2。
生效 unreachable → 自动调同目录 recover-brief.py 生成 .fade/hub/recover-brief-latest.md
（件 5 "自动 provisional 重建"的机械锚：BRIEF 就绪供 spawn，重建体 provisional 转正仍归董事会——SOP 正身）。

py3.8 兼容（语法面）。自测：--self-test（夹具+防抖两周期）。
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
DEFAULT_HEARTBEAT = os.path.join(REPO_ROOT, ".fade", "hub", "heartbeat.jsonl")
DEFAULT_LEDGER_MIRROR = os.path.join(REPO_ROOT, ".fade", "hub-snapshots", "ledger-mirror.md")
DEFAULT_BOARD_JOURNAL = os.path.join(REPO_ROOT, ".fade", "hub-snapshots", "board-journal.md")
DEFAULT_STATE_FILE = os.path.join(REPO_ROOT, ".fade", "hub", "watchdog-state.json")
DEFAULT_FLAG_FILE = os.path.join(REPO_ROOT, ".fade", "hub", "watchdog-flag.json")
DEFAULT_BRIEF_OUT = os.path.join(REPO_ROOT, ".fade", "hub", "recover-brief-latest.md")
DEFAULT_PROJECTS_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "projects", "D--Code-ai-TriMetaverse"
)

DEGRADED_MIN = 30.0
UNREACHABLE_MIN = 60.0
DEBOUNCE_CYCLES = 2

LEVEL_RC = {"ok": 0, "pending": 0, "degraded": 1, "unreachable": 2}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def age_minutes(path: Optional[str], now_ts: float) -> Optional[float]:
    if not path or not os.path.isfile(path):
        return None
    return max(0.0, (now_ts - os.path.getmtime(path)) / 60.0)


def latest_transcript_age(projects_dir: str, now_ts: float) -> Optional[float]:
    if not os.path.isdir(projects_dir):
        return None
    best = -1.0
    for name in os.listdir(projects_dir):
        if not name.endswith(".jsonl"):
            continue
        try:
            m = os.path.getmtime(os.path.join(projects_dir, name))
        except OSError:
            continue
        if m > best:
            best = m
    if best < 0:
        return None
    return max(0.0, (now_ts - best) / 60.0)


def heartbeat_level(hb_age: Optional[float], tr_age: Optional[float]) -> str:
    """按董事会判据映射原始 level（防抖前的候选）。"""
    if hb_age is None:
        if tr_age is not None and tr_age > UNREACHABLE_MIN:
            return "unreachable"
        return "pending"
    if hb_age > UNREACHABLE_MIN:
        return "unreachable"
    if hb_age > DEGRADED_MIN:
        return "degraded"
    return "ok"


def load_state(path: str) -> Dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as fh:
            obj = json.load(fh)
        if isinstance(obj, dict):
            return obj
    except (OSError, ValueError):
        pass
    return {}


def save_state(path: str, state: Dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(state, fh, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def debounce(candidate: str, state_path: str) -> Dict[str, Any]:
    """连续 DEBOUNCE_CYCLES 周期同候选才翻转生效 level。"""
    state = load_state(state_path)
    effective = state.get("effective_level", "ok")
    prev_candidate = state.get("candidate_level", "")
    streak = int(state.get("streak", 0))
    if candidate == prev_candidate:
        streak += 1
    else:
        streak = 1
    transitioned = False
    if candidate != effective and streak >= DEBOUNCE_CYCLES:
        effective = candidate
        transitioned = True
    new_state = {
        "effective_level": effective,
        "candidate_level": candidate,
        "streak": streak,
        "updated_at": utc_now_iso(),
    }
    save_state(state_path, new_state)
    return {
        "effective_level": effective,
        "candidate_level": candidate,
        "streak": streak,
        "transitioned": transitioned,
        "recovering_from": state.get("effective_level", "ok"),
    }


def probe_waterlevel(projects_dir: str, window: int) -> Dict[str, Any]:
    """调件 1 探针；失败不阻塞 level 判定（waterlevel.error 标注）。"""
    script = os.path.join(SCRIPT_DIR, "hub-waterlevel.py")
    try:
        out = subprocess.run(
            [sys.executable, script, "--projects-dir", projects_dir,
             "--window", str(window), "--quiet"],
            capture_output=True, text=True, timeout=60,
        )
        line = out.stdout.strip().splitlines()[0] if out.stdout.strip() else ""
        data = json.loads(line)
        if isinstance(data, dict):
            return data
    except Exception as exc:  # noqa: BLE001 - 确定性降级
        return {"level": "unknown", "error": str(exc)}
    return {"level": "unknown"}


def maybe_recover_brief(level: str, brief_out: str, quiet: bool) -> Dict[str, Any]:
    """生效 unreachable → 自动生成 recover-brief（件 4）。失败标注不阻塞。"""
    if level != "unreachable":
        return {"triggered": False}
    script = os.path.join(SCRIPT_DIR, "recover-brief.py")
    if not os.path.isfile(script):
        return {"triggered": True, "error": "recover-brief.py missing"}
    try:
        out = subprocess.run(
            [sys.executable, script, "--out", brief_out],
            capture_output=True, text=True, timeout=60,
        )
        ok = out.returncode == 0 and os.path.isfile(brief_out)
        return {"triggered": True, "ok": ok, "brief": brief_out,
                "stderr": "" if ok else out.stderr[-200:]}
    except Exception as exc:  # noqa: BLE001
        return {"triggered": True, "error": str(exc)}


def evaluate(args: argparse.Namespace) -> Dict[str, Any]:
    now_ts = time.time()
    hb_age = age_minutes(args.heartbeat, now_ts)
    ledger_age = age_minutes(args.ledger_mirror, now_ts)
    journal_age = age_minutes(args.board_journal, now_ts)
    tr_age = latest_transcript_age(args.projects_dir, now_ts)
    candidate = heartbeat_level(hb_age, tr_age)
    debounced = debounce(candidate, args.state_file)

    water = probe_waterlevel(args.projects_dir, args.window)
    pre_warning = water.get("level") in ("warning", "critical")

    brief = maybe_recover_brief(debounced["effective_level"], args.brief_out, args.quiet)

    result = {
        "level": debounced["effective_level"],
        "pre_warning": pre_warning,
        "metrics": {
            "heartbeat_age_min": None if hb_age is None else round(hb_age, 1),
            "transcript_age_min": None if tr_age is None else round(tr_age, 1),
            "ledger_mirror_age_min": None if ledger_age is None else round(ledger_age, 1),
            "board_journal_age_min": None if journal_age is None else round(journal_age, 1),
            "debounce_streak": debounced["streak"],
            "debounce_candidate": debounced["candidate_level"],
            "transitioned": debounced["transitioned"],
            "waterlevel_level": water.get("level"),
            "waterlevel_pct": water.get("threshold_pct"),
            "waterlevel_tokens": water.get("token_count"),
        },
        "evidence": {
            "heartbeat_path": args.heartbeat,
            "heartbeat_exists": hb_age is not None,
            "ledger_mirror_path": args.ledger_mirror,
            "board_journal_path": args.board_journal,
            "state_file": args.state_file,
            "recover_brief": brief,
            "check_time": utc_now_iso(),
        },
    }
    return result


def emit_json(result: Dict[str, Any]) -> None:
    """stdout JSON 输出（pythonw 下 sys.stdout 为 None，判空守卫）。"""
    if sys.stdout is None:
        return
    try:
        print(json.dumps(result, ensure_ascii=False))
    except Exception:
        pass


def write_flag(flag_file: str, result: Dict[str, Any]) -> Dict[str, Any]:
    """flag 文件落盘（供编排层消费）；独立函数以便自测。"""
    flag = {
        "ts": result["evidence"]["check_time"],
        "level": result["level"],
        "pre_warning": result["pre_warning"],
        "need_rebuild": result["level"] == "unreachable",
        "notice": "",
        "metrics": result["metrics"],
    }
    if result["pre_warning"]:
        flag["notice"] = "waterlevel >=80%%: %s (%s%%)" % (
            result["metrics"]["waterlevel_level"], result["metrics"]["waterlevel_pct"])
    elif result["level"] == "unreachable":
        flag["notice"] = "hub unreachable (heartbeat silent, debounce confirmed); recover-brief generated"
    elif result["level"] == "degraded":
        flag["notice"] = "hub degraded (heartbeat stale 30-60min)"
    os.makedirs(os.path.dirname(flag_file), exist_ok=True)
    tmp = flag_file + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(flag, fh, ensure_ascii=False, indent=2)
    os.replace(tmp, flag_file)
    return flag


def self_test() -> int:
    import tempfile
    import time as time_mod

    cases = 0
    failed = 0

    def check(name: str, cond: bool) -> None:
        nonlocal cases, failed
        cases += 1
        if not cond:
            failed += 1
            print("FAIL %s" % name)
        else:
            print("PASS %s" % name)

    tmp = tempfile.mkdtemp(prefix="hub-watchdog-test-")
    now = time_mod.time()

    def make(path: str, age_min: float) -> str:
        full = os.path.join(tmp, path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w", encoding="utf-8") as fh:
            fh.write("{}\n")
        os.utime(full, (now - age_min * 60, now - age_min * 60))
        return full

    # 判据映射
    check("map-alive", heartbeat_level(10.0, None) == "ok")
    check("map-stale", heartbeat_level(45.0, None) == "degraded")
    check("map-silent", heartbeat_level(61.0, None) == "unreachable")
    check("map-missing-active-tr", heartbeat_level(None, 5.0) == "pending")
    check("map-missing-stale-tr", heartbeat_level(None, 61.0) == "unreachable")

    # 防抖：ok→degraded 单周期不翻转，双周期翻转
    state = os.path.join(tmp, "state.json")
    r1 = debounce("degraded", state)
    check("debounce-hold", r1["effective_level"] == "ok" and r1["streak"] == 1)
    r2 = debounce("degraded", state)
    check("debounce-flip", r2["effective_level"] == "degraded" and r2["transitioned"])
    # 回复单周期不翻转（防抖对称）
    r3 = debounce("ok", state)
    check("debounce-recover-hold", r3["effective_level"] == "degraded")
    r4 = debounce("ok", state)
    check("debounce-recover-flip", r4["effective_level"] == "ok")

    # 端到端 evaluate（注入夹具路径）：心跳新鲜 + 水位探针指空目录=unknown
    hb_fresh = make("hb.jsonl", 5.0)
    args = argparse.Namespace(
        heartbeat=hb_fresh,
        ledger_mirror=make("mirror.md", 30.0),
        board_journal=make("journal.md", 60.0),
        projects_dir=os.path.join(tmp, "no-projects"),
        state_file=os.path.join(tmp, "state2.json"),
        flag_file=os.path.join(tmp, "flag.json"),
        brief_out=os.path.join(tmp, "brief.md"),
        window=1000000,
        quiet=True,
    )
    result = evaluate(args)
    check("e2e-fresh-ok", result["level"] == "ok")
    check("e2e-metrics-hb", result["metrics"]["heartbeat_age_min"] is not None
          and result["metrics"]["heartbeat_age_min"] < 6.0)
    check("e2e-evidence", result["evidence"]["heartbeat_exists"] is True)
    flag = write_flag(args.flag_file, result)
    check("e2e-flag-written", flag.get("level") == "ok")
    with open(args.flag_file, "r", encoding="utf-8") as fh:
        flag_back = json.load(fh)
    check("e2e-flag-readable", flag_back.get("pre_warning") in (True, False))

    # 心跳停止（>60min）两周期 → unreachable 生效（recover-brief 缺失路径容错）
    hb_dead = make("hb-dead.jsonl", 70.0)
    args2 = argparse.Namespace(
        heartbeat=hb_dead,
        ledger_mirror=args.ledger_mirror,
        board_journal=args.board_journal,
        projects_dir=os.path.join(tmp, "no-projects"),
        state_file=os.path.join(tmp, "state3.json"),
        flag_file=os.path.join(tmp, "flag2.json"),
        brief_out=os.path.join(tmp, "brief2.md"),
        window=1000000,
        quiet=True,
    )
    e1 = evaluate(args2)
    e2 = evaluate(args2)
    check("e2e-dead-pending", e1["level"] in ("ok", "pending"))
    check("e2e-dead-unreachable", e2["level"] == "unreachable")

    print("self-test: %d/%d PASS" % (cases - failed, cases))
    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Hub watchdog adjudicator (LG-014 item 3)")
    parser.add_argument("--heartbeat", default=DEFAULT_HEARTBEAT)
    parser.add_argument("--ledger-mirror", default=DEFAULT_LEDGER_MIRROR)
    parser.add_argument("--board-journal", default=DEFAULT_BOARD_JOURNAL)
    parser.add_argument("--projects-dir", default=DEFAULT_PROJECTS_DIR)
    parser.add_argument("--state-file", default=DEFAULT_STATE_FILE)
    parser.add_argument("--flag-file", default=DEFAULT_FLAG_FILE)
    parser.add_argument("--brief-out", default=DEFAULT_BRIEF_OUT)
    parser.add_argument("--window", type=int, default=1000000)
    parser.add_argument("--quiet", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    result = evaluate(args)
    emit_json(result)
    flag = write_flag(args.flag_file, result)
    if not args.quiet and flag["notice"] and sys.stderr is not None:
        try:
            print(flag["notice"], file=sys.stderr)
        except Exception:
            pass
    return LEVEL_RC.get(result["level"], 0)


if __name__ == "__main__":
    sys.exit(main())

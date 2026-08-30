#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LG-014 件 1：中枢 token 水位探针（确定性，无 LLM）。

读 Claude Code 会话 transcript jsonl 尾部的 usage 累计，输出结构化水位 JSON。

数据边界（§2.7 探针原则）：只读 usage 数值与 model 名，不消费会话正文。

用法：
  python scripts/fade/hub-waterlevel.py                      # 默认探中枢 transcript 目录
  python scripts/fade/hub-waterlevel.py --window 1000000     # 显式上下文窗口
  python scripts/fade/hub-waterlevel.py --transcript <file>  # 指定单个 jsonl
  python scripts/fade/hub-waterlevel.py --self-test          # 内置自测

输出 JSON（stdout）：
  {level: "ok|warning|critical|unknown", token_count: N, threshold_pct: N,
   window: N, model: "...", transcript: "...", check_time: ISO8601Z}
退出码：ok=0 / warning=1 / critical=2 / unknown=3（watchdog 可感知）。

阈值：>=crit_pct(默认90)=critical；>=warn_pct(默认80)=warning；否则 ok。
py3.8 兼容（语法面），LG-014 立法锚：fade-007 spec §七 2026-08-30 行。
"""

import argparse
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

DEFAULT_PROJECTS_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "projects", "D--Code-ai-TriMetaverse"
)
DEFAULT_WINDOW = 1000000
TAIL_BYTES = 262144  # 尾部扫描窗口：最近一条 usage 行必在其内（单行消息可很大，留余量）


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def latest_transcript(projects_dir: str) -> Optional[str]:
    """projects 目录下 mtime 最新的 *.jsonl（中枢=最活跃会话）。"""
    if not os.path.isdir(projects_dir):
        return None
    best = None
    best_mtime = -1.0
    for name in os.listdir(projects_dir):
        if not name.endswith(".jsonl"):
            continue
        path = os.path.join(projects_dir, name)
        try:
            m = os.path.getmtime(path)
        except OSError:
            continue
        if m > best_mtime:
            best_mtime = m
            best = path
    return best


def read_tail(path: str, nbytes: int = TAIL_BYTES) -> Optional[bytes]:
    if not os.path.isfile(path):
        return None
    size = os.path.getsize(path)
    with open(path, "rb") as fh:
        if size > nbytes:
            fh.seek(size - nbytes)
        return fh.read()


def last_usage_entry(path: str) -> Optional[Dict[str, Any]]:
    """从尾部向前找最近一条带 usage 的 assistant 行，返回解析结果。"""
    tail = read_tail(path)
    if tail is None:
        return None
    lines = tail.splitlines()
    for raw in reversed(lines):
        if b'"usage"' not in raw:
            continue
        try:
            obj = json.loads(raw.decode("utf-8", errors="replace"))
        except ValueError:
            continue
        msg = obj.get("message")
        if not isinstance(msg, dict):
            continue
        usage = msg.get("usage")
        if not isinstance(usage, dict):
            continue
        if "input_tokens" not in usage and "output_tokens" not in usage:
            continue
        return {
            "model": msg.get("model", ""),
            "input_tokens": int(usage.get("input_tokens") or 0),
            "cache_creation_input_tokens": int(usage.get("cache_creation_input_tokens") or 0),
            "cache_read_input_tokens": int(usage.get("cache_read_input_tokens") or 0),
            "output_tokens": int(usage.get("output_tokens") or 0),
            "timestamp": obj.get("timestamp", ""),
        }
    return None


def classify(context_tokens: int, window: int, warn_pct: float, crit_pct: float) -> str:
    if window <= 0:
        return "unknown"
    pct = context_tokens * 100.0 / window
    if pct >= crit_pct:
        return "critical"
    if pct >= warn_pct:
        return "warning"
    return "ok"


def probe(transcript: str, window: int, warn_pct: float, crit_pct: float) -> Dict[str, Any]:
    entry = last_usage_entry(transcript)
    result = {
        "level": "unknown",
        "token_count": 0,
        "threshold_pct": 0.0,
        "window": window,
        "model": "",
        "transcript": transcript,
        "check_time": utc_now_iso(),
    }
    if entry is None:
        return result
    context = (
        entry["input_tokens"]
        + entry["cache_creation_input_tokens"]
        + entry["cache_read_input_tokens"]
        + entry["output_tokens"]
    )
    pct = round(context * 100.0 / window, 1) if window > 0 else 0.0
    result.update(
        {
            "level": classify(context, window, warn_pct, crit_pct),
            "token_count": context,
            "threshold_pct": pct,
            "model": entry["model"],
        }
    )
    return result


def self_test() -> int:
    """内置自测：夹具 jsonl + 解析/阈值/反向查找/退出码映射。"""
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

    tmp = tempfile.mkdtemp(prefix="hub-waterlevel-test-")
    lines: List[str] = []
    lines.append(json.dumps({"type": "user", "message": {"role": "user", "content": "hi"}}))
    lines.append(
        json.dumps(
            {
                "type": "assistant",
                "timestamp": "2026-08-30T10:00:00Z",
                "message": {
                    "model": "glm-5.3-flash[1m]",
                    "usage": {
                        "input_tokens": 1000,
                        "cache_creation_input_tokens": 200,
                        "cache_read_input_tokens": 300,
                        "output_tokens": 50,
                    },
                },
            }
        )
    )
    # 后续无 usage 行（探针须跳过、命中上一条）
    lines.append(json.dumps({"type": "user", "message": {"role": "user", "content": "more"}}))
    lines.append(json.dumps({"type": "summary", "summary": "no usage here"}))
    fixture = os.path.join(tmp, "session-fixture.jsonl")
    with open(fixture, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")

    entry = last_usage_entry(fixture)
    check("tail-usage-found", entry is not None)
    if entry is not None:
        total = (
            entry["input_tokens"]
            + entry["cache_creation_input_tokens"]
            + entry["cache_read_input_tokens"]
            + entry["output_tokens"]
        )
        check("usage-sum", total == 1550)
        check("model-captured", entry["model"] == "glm-5.3-flash[1m]")

    # 阈值边界：window=1000 → 155%=critical；window=2000 → 77.5%=ok
    check("classify-critical", classify(1550, 1000, 80.0, 90.0) == "critical")
    check("classify-ok", classify(1550, 2000, 80.0, 90.0) == "ok")
    check("classify-warning", classify(850, 1000, 80.0, 90.0) == "warning")
    check("classify-window-zero", classify(100, 0, 80.0, 90.0) == "unknown")

    result = probe(fixture, 2000, 80.0, 90.0)
    check("probe-level-ok", result["level"] == "ok")
    check("probe-count", result["token_count"] == 1550)

    empty = os.path.join(tmp, "empty.jsonl")
    open(empty, "w").close()
    check("empty-unknown", probe(empty, 1000, 80.0, 90.0)["level"] == "unknown")
    check("missing-unknown", probe(os.path.join(tmp, "nope.jsonl"), 1000, 80.0, 90.0)["level"] == "unknown")

    print("self-test: %d/%d PASS" % (cases - failed, cases))
    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Hub token waterlevel probe (LG-014 item 1)")
    parser.add_argument("--projects-dir", default=DEFAULT_PROJECTS_DIR)
    parser.add_argument("--transcript", default=None, help="explicit transcript jsonl path")
    parser.add_argument("--window", type=int, default=DEFAULT_WINDOW)
    parser.add_argument("--warn-pct", type=float, default=80.0)
    parser.add_argument("--crit-pct", type=float, default=90.0)
    parser.add_argument("--quiet", action="store_true", help="suppress stderr notes")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    transcript = args.transcript or latest_transcript(args.projects_dir)
    if transcript is None or not os.path.isfile(transcript):
        payload = {
            "level": "unknown",
            "token_count": 0,
            "threshold_pct": 0.0,
            "window": args.window,
            "model": "",
            "transcript": "",
            "check_time": utc_now_iso(),
        }
        print(json.dumps(payload, ensure_ascii=False))
        if not args.quiet:
            print("no transcript found under %s" % args.projects_dir, file=sys.stderr)
        return 3

    result = probe(transcript, args.window, args.warn_pct, args.crit_pct)
    print(json.dumps(result, ensure_ascii=False))
    return {"ok": 0, "warning": 1, "critical": 2}.get(result["level"], 3)


if __name__ == "__main__":
    sys.exit(main())

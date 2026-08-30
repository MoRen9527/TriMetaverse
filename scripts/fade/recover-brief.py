#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LG-014 件 4：recover-brief 生成器（爆溃恢复简报，确定性，无 LLM）。

输入六源路径（默认=fade-007 spec §五 恢复配方现行版，可参数覆盖）→
逐源机器校验（存在性/行数/sha1 前 12 位）→ 组装恢复 BRIEF 文本：
  代位声明（provisional 身份）＋六源清单表＋机器校验清单＋转正流程指针。

消费面：watchdog（件 3）unreachable 生效时自动生成 .fade/hub/recover-brief-latest.md；
董事会/编排层 spawn 重建体时直接粘贴本 BRIEF 进 spawn prompt（SOP 正身步骤 2）。

韧性原则：缺源不失败——BRIEF 照常生成，缺源行如实标注 missing（爆溃时源可能缺）。
退出码：全部必读源在位=0；有缺源=1（BRIEF 仍产出）。
py3.8 兼容（语法面）。自测：--self-test。
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))

# 六源（fade-007-context-reservoir-spec.md §五 双重故障恢复配方现行版）
DEFAULT_SOURCES = [
    ("S1", "CLAUDE.md 分权制节（自动加载）",
     os.path.join(REPO_ROOT, "CLAUDE.md")),
    ("S2a", "董事会记事本 board-journal.md（增量交付日志）",
     os.path.join(REPO_ROOT, ".fade", "hub-snapshots", "board-journal.md")),
    ("S2b", "台账镜像 ledger-mirror.md（挂账台账现势）",
     os.path.join(REPO_ROOT, ".fade", "hub-snapshots", "ledger-mirror.md")),
    ("S3", "全量基线快照 full-*.md（最近一份，工作记忆模板）",
     os.path.join(REPO_ROOT, ".fade", "hub-snapshots")),
    ("S4a", "FADE 协议规范 fade-protocol-spec.md",
     os.path.join(REPO_ROOT, "..", "TriCompany", "docs", "engineering", "fade-protocol-spec.md")),
    ("S4b", "FADE 实例登记册 fade-registry.md",
     os.path.join(REPO_ROOT, "..", "TriCompany", "docs", "engineering", "fade-registry.md")),
    ("S6", "周平面每日进度 daily-progress.md（第六源，FADE-001 扩维）",
     os.path.join(REPO_ROOT, "docs", "workflow", "operating-records", "2026-W35", "daily-progress.md")),
]
# S5（董事会转录 jsonl 挖矿）为目录探针，机器校验=目录存在与最新 jsonl
DEFAULT_TRANSCRIPT_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "projects", "D--Code-ai-TriMetaverse"
)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def latest_snapshot(snap_dir: str) -> Optional[str]:
    if not os.path.isdir(snap_dir):
        return None
    best, best_mtime = None, -1.0
    for name in os.listdir(snap_dir):
        if name.startswith("full-") and name.endswith(".md"):
            path = os.path.join(snap_dir, name)
            try:
                m = os.path.getmtime(path)
            except OSError:
                continue
            if m > best_mtime:
                best_mtime, best = m, path
    return best


def inspect(path: str) -> Dict[str, Any]:
    if path is None or not os.path.isfile(path):
        return {"exists": False, "lines": 0, "sha1_12": ""}
    try:
        with open(path, "rb") as fh:
            data = fh.read()
        return {
            "exists": True,
            "lines": data.count(b"\n") + (1 if data and not data.endswith(b"\n") else 0),
            "sha1_12": hashlib.sha1(data).hexdigest()[:12],
        }
    except OSError:
        return {"exists": False, "lines": 0, "sha1_12": ""}


def collect(sources: List, transcript_dir: str) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for sid, desc, path in sources:
        target = path
        if sid == "S3" and os.path.isdir(path):
            target = latest_snapshot(path) or path  # 目录在而无 full-* 时如实报目录
        info = inspect(target)
        rows.append({"id": sid, "desc": desc, "path": target or "", **info})
    # S5 转录挖矿源（目录探针）
    newest = None
    if os.path.isdir(transcript_dir):
        best_mtime = -1.0
        for name in os.listdir(transcript_dir):
            if not name.endswith(".jsonl"):
                continue
            full = os.path.join(transcript_dir, name)
            try:
                m = os.path.getmtime(full)
            except OSError:
                continue
            if m > best_mtime:
                best_mtime, newest = m, full
    rows.append({
        "id": "S5",
        "desc": "董事会转录 jsonl 挖矿（.claude/projects，/clear 不删盘）",
        "path": newest or transcript_dir,
        "exists": bool(os.path.isdir(transcript_dir)),
        "lines": 0,
        "sha1_12": "",
    })
    return rows


def render_brief(rows: List[Dict[str, Any]]) -> str:
    lines: List[str] = []
    lines.append("# 中枢恢复 BRIEF（recover-brief 自动生成）")
    lines.append("")
    lines.append("- 生成时刻：%s（UTC Z）" % utc_now_iso())
    lines.append("- 生成器：scripts/fade/recover-brief.py（LG-014 件 4，确定性无 LLM）")
    lines.append("- SOP 正身：docs/execution/fade-007-incident-sop.md（步骤 2 六源重建）")
    lines.append("")
    lines.append("## 代位声明")
    lines.append("")
    lines.append(
        "本 BRIEF 由 watchdog unreachable 裁决自动生成（或人工拉起）。持此 BRIEF 的重建体"
        "以 **provisional 身份**运行：日常任务执行与台账/记事本/每日进度维护不受限；"
        "立法类、终态签发类、不可逆操作须董事会逐件授权；**转正由董事会核验签发**"
        "（核验三件=台账复述全对+锚点 hash 核对+首件交付抽验）。"
    )
    lines.append("")
    lines.append("## 六源清单（按序重建，禁删减顺序）")
    lines.append("")
    lines.append("| # | 源 | 路径 | 在位 | 行数 | sha1-12 |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    for r in rows:
        lines.append("| %s | %s | `%s` | %s | %s | %s |" % (
            r["id"], r["desc"], r["path"],
            "YES" if r["exists"] else "**missing**",
            r["lines"] if r["exists"] else "-",
            r["sha1_12"] or "-",
        ))
    missing = [r["id"] for r in rows if not r["exists"]]
    lines.append("")
    if missing:
        lines.append("缺源：%s——按 SOP 步骤 2 校验点处理，缺源不阻断重建但须在状态条如实申报。" % "、".join(missing))
    else:
        lines.append("六源全在位（机器校验 PASS）。")
    lines.append("")
    lines.append("## 机器校验清单（重建体开工前逐项执行）")
    lines.append("")
    lines.append("1. `date '+%F %T +08'`——状态条首个动作，读数原样粘贴（M-001）")
    lines.append("2. 复述台账现役清单与未完事项（恢复完整性判据，转正前置）")
    lines.append("3. `python scripts/fade/hub-waterlevel.py`——水位探针自检（LG-014 件 1）")
    lines.append("4. 各源 sha1-12 与本 BRIEF 表格比对，漂移即申报（SOFT-DRIFT 留痕口径）")
    lines.append("5. 读 `docs/execution/fade-007-incident-sop.md` 全文（provisional 权力边界）")
    lines.append("")
    lines.append("## 恢复后动作")
    lines.append("")
    lines.append("- 状态条报董事会（含水位自估+末次活动时刻，M-001 延伸五条）")
    lines.append("- 台账/记事本照常维护并标注 provisional")
    lines.append("- 心跳恢复确认：`.fade/hub/heartbeat.jsonl` 恢复 append 后 watchdog 回 ok")
    lines.append("")
    return "\n".join(lines)


def self_test() -> int:
    import tempfile
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

    tmp = tempfile.mkdtemp(prefix="recover-brief-test-")
    # 夹具：两个在位源+一个 missing
    f1 = os.path.join(tmp, "a.md")
    with open(f1, "w", encoding="utf-8") as fh:
        fh.write("line1\nline2\n")
    rows = [
        {"id": "X1", "desc": "在位源", "path": f1, **inspect(f1)},
        {"id": "X2", "desc": "缺失源", "path": os.path.join(tmp, "gone.md"), **inspect(os.path.join(tmp, "gone.md"))},
    ]
    check("inspect-lines", rows[0]["lines"] == 2)
    check("inspect-sha1", len(rows[0]["sha1_12"]) == 12)
    check("inspect-missing", rows[1]["exists"] is False)

    brief = render_brief(rows)
    check("brief-has-declaration", "provisional" in brief)
    check("brief-has-missing", "**missing**" in brief)
    check("brief-has-table", "| X1 |" in brief and "| X2 |" in brief)
    check("brief-has-checklist", "机器校验清单" in brief)

    # latest_snapshot 选取
    snap_dir = os.path.join(tmp, "snaps")
    os.makedirs(snap_dir)
    old = os.path.join(snap_dir, "full-20260827T0000Z.md")
    new = os.path.join(snap_dir, "full-20260828T1510Z.md")
    for p in (old, new):
        with open(p, "w", encoding="utf-8") as fh:
            fh.write("snap\n")
    os.utime(old, (1000000, 1000000))
    check("latest-snapshot", latest_snapshot(snap_dir) == new)

    print("self-test: %d/%d PASS" % (cases - failed, cases))
    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Recover brief generator (LG-014 item 4)")
    parser.add_argument("--out", default=None, help="write brief to file (default: stdout)")
    parser.add_argument("--transcript-dir", default=DEFAULT_TRANSCRIPT_DIR)
    parser.add_argument("--quiet", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    rows = collect(DEFAULT_SOURCES, args.transcript_dir)
    brief = render_brief(rows)
    missing = [r["id"] for r in rows if not r["exists"]]

    if args.out:
        os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
        with open(args.out, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(brief)
        if not args.quiet:
            print("recover-brief written: %s (missing: %s)" % (
                args.out, "、".join(missing) if missing else "none"), file=sys.stderr)
    else:
        sys.stdout.write(brief)
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())

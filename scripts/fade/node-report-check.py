#!/usr/bin/env python3
"""node-report-check.py — §2.7 节点收口报告校验器（CPO/CTO 联审 F1 立法落地）

用法：
  node-report-check.py --tree-dir <树目录> --node <NODE-ID> [--node <NODE-ID> ...]
  node-report-check.py --tree-dir <树目录> --all --pending-from <tree-op.json>

校验项（十字段合同，ade-pattern-spec §2.7 v1.3.0）：
  1. 文件存在：reports/node-<NODE-ID>.md
  2. 结构化核心：报告内含 ```json fenced 块（或任意 ```json 块），
     满足十字段机器可校验核心（键集 ⊇ 核心九键，叙事字段可留散文）：
     nodeId, agent, startedAt, finishedAt, baselineCommit, trigger,
     actions[], artifacts[], gateResults
  3. 散文必备节：异常与处置 / 断点交接 / 使用依据（标题级匹配即可）

退出码：0=全部通过 | 2=缺失或字段不全（翻转前置门必须拦截）| 3=用法错误
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

CORE_KEYS = ["nodeId", "agent", "startedAt", "finishedAt", "baselineCommit",
             "trigger", "actions", "artifacts", "gateResults"]
PROSE_SECTIONS = ["异常与处置", "断点交接", "使用依据"]


def check_report(md: Path, node_id: str) -> tuple[bool, str]:
    if not md.is_file():
        return False, f"missing: {md.name}"
    text = md.read_text(encoding="utf-8", errors="replace")
    blocks = re.findall(r"```json\s*(\{.*?\})\s*```", text, re.S)
    core_ok, missing = False, []
    for b in blocks:
        try:
            obj = json.loads(b)
        except json.JSONDecodeError:
            continue
        keys = set(obj.keys())
        miss = [k for k in CORE_KEYS if k not in keys]
        if not miss:
            core_ok = True
            break
        missing = miss
    if not core_ok:
        return False, f"核心九键不全/无合法 ```json 块（缺：{missing or '全部'}）；散文节缺失：{[s for s in PROSE_SECTIONS if s not in text] or '无'}"
    prose_missing = [s for s in PROSE_SECTIONS if s not in text]
    if prose_missing:
        return False, f"散文必备节缺失：{prose_missing}"
    return True, "ok"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tree-dir", required=True)
    ap.add_argument("--node", action="append", default=[])
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--pending-from")
    a = ap.parse_args()
    tree = Path(a.tree_dir)
    nodes = list(a.node)
    if a.all:
        nodes = [n["nodeId"] for n in json.loads((tree / "tree-op.json").read_text(encoding="utf-8")).get("nodes", [])]
    if a.pending_from:
        d = json.loads(Path(a.pending_from).read_text(encoding="utf-8"))
        nodes = [n["nodeId"] for n in d.get("nodes", []) if n.get("status") == "done"]
    if not nodes:
        print("usage error: 需要 --node 或 --all/--pending-from", file=sys.stderr)
        return 3
    bad = []
    for n in nodes:
        ok, msg = check_report(tree / "reports" / f"node-{n}.md", n)
        print(f"[{'OK' if ok else 'FAIL'}] node-{n}: {msg}")
        if not ok:
            bad.append(n)
    print(f"RESULT: {'PASS' if not bad else 'FAIL'} ({len(nodes) - len(bad)}/{len(nodes)})")
    return 2 if bad else 0


if __name__ == "__main__":
    sys.exit(main())

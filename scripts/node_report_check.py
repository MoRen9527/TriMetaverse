# -*- coding: utf-8 -*-
"""node_report_check.py — FADE §2.7 节点报告结构校验器（状态翻转前置门）

法条正身: TriCompany/docs/engineering/fade-protocol-spec.md §2.7「执行与校验」
  - 置 done 前必须运行本器（exit≠0 不得翻转）；编排层收口对全部节点复跑（双门）
  - 报告内嵌 ```json fenced 块承载机读核心九键:
    nodeId / agent / startedAt / finishedAt / baselineCommit /
    trigger / actions / artifacts / gateResults
  - 协议管不变量，实例管载体：额外键（如 actionsTimeNote）不校不禁

用法:
  python scripts/node_report_check.py <report.md> [more.md ...]   # 单节点门
  python scripts/node_report_check.py --tree-dir <dir>             # 全目录门（编排层复跑）

退出码: 0=全部通过；1=任一报告不合格（明细见 stdout）；2=用法/输入错误
"""
import argparse
import json
import re
import sys
from datetime import datetime

try:  # GBK 控制台防御（中文输出不炸）
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass

REQUIRED_KEYS = [
    "nodeId", "agent", "startedAt", "finishedAt", "baselineCommit",
    "trigger", "actions", "artifacts", "gateResults",
]
ARRAY_KEYS = ["actions", "artifacts", "gateResults"]
TIMESTAMP_KEYS = ["startedAt", "finishedAt"]

JSON_FENCE_RE = re.compile(r"```json\s*(\{.*?\})\s*```", re.DOTALL)


def parse_iso_ts(value):
    """ISO 8601 时戳形态校验（Z 后缀 UTC 形与 +08:00 偏移形均合法）。"""
    if not isinstance(value, str) or not value:
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def check_report(path):
    """校验单份报告，返回 (ok: bool, problems: list[str])。零写面纯读。"""
    problems = []
    try:
        text = open(path, encoding="utf-8", errors="replace").read()
    except OSError as e:
        return False, ["read-failed: %s" % e]

    m = JSON_FENCE_RE.search(text)
    if not m:
        return False, ["no ```json fenced block found"]
    try:
        core = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        return False, ["json block not parseable: %s" % e]
    if not isinstance(core, dict):
        return False, ["json block is not an object"]

    for key in REQUIRED_KEYS:
        if key not in core:
            problems.append("missing key: %s" % key)
    for key in ARRAY_KEYS:
        if key in core and (not isinstance(core[key], list) or len(core[key]) == 0):
            problems.append("key %s must be a non-empty array" % key)
    for key in TIMESTAMP_KEYS:
        if key in core and not parse_iso_ts(core[key]):
            problems.append("key %s is not a valid ISO-8601 timestamp: %r" % (key, core[key]))
    if "nodeId" in core and (not isinstance(core["nodeId"], str) or not core["nodeId"].strip()):
        problems.append("key nodeId must be a non-empty string")

    return (len(problems) == 0), problems


def main():
    parser = argparse.ArgumentParser(
        prog="node_report_check.py",
        description="FADE §2.7 节点报告结构校验器（九键机读核心+双门前置门）",
    )
    parser.add_argument("reports", nargs="*", metavar="REPORT.md",
                        help="待校验的节点报告（.md）")
    parser.add_argument("--tree-dir", metavar="DIR", default=None,
                        help="扫该目录下全部 node-*.md（编排层收口复跑门）")
    args = parser.parse_args()

    paths = list(args.reports)
    if args.tree_dir:
        import glob
        import os
        pattern = os.path.join(args.tree_dir, "node-*.md")
        found = sorted(glob.glob(pattern))
        if not found:
            print("no node-*.md found under %s" % args.tree_dir)
            return 2
        paths.extend(found)
    if not paths:
        parser.print_usage()
        print("error: no reports given (positional or --tree-dir)", file=sys.stderr)
        return 2

    all_ok = True
    failed = 0
    for p in paths:
        ok, problems = check_report(p)
        label = "PASS" if ok else "FAIL"
        print("%s  %s" % (label, p))
        for prob in problems:
            print("    - %s" % prob)
        if not ok:
            failed += 1
            all_ok = False

    print("-- checked=%d failed=%d" % (len(paths), failed))
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())

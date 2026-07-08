# IPD Training Doc Sync Validator
# 用途：验证 IPD 培训文档中描述的功能是否与实际代码一致
# 运行：python TriMetaverse/scripts/sync_validator.py
# 用于检测培训文档与代码之间的 "计划中" vs "已实现" 缺口

import json
import os
import re
import sys
from pathlib import Path

def find_engine_functions(engine_path):
    """扫描 ipd_case_engine.py 中的所有函数名。"""
    funcs = set()
    pattern = re.compile(r'^def\s+(\w+)\s*\(')
    try:
        with open(engine_path, 'r', encoding='utf-8') as f:
            for line in f:
                m = pattern.match(line)
                if m:
                    funcs.add(m.group(1))
    except FileNotFoundError:
        print(f"  [WARN] Engine not found: {engine_path}")
    return funcs

def find_cli_commands(cli_path):
    """扫描 chief_of_staff_ipd_case.py 中的 argparse 子命令。"""
    commands = set()
    in_parser = False
    pattern = re.compile(r"add_parser\s*\(\s*['\"](\w[\w-]*)['\"]")
    try:
        with open(cli_path, 'r', encoding='utf-8') as f:
            for line in f:
                m = pattern.search(line)
                if m:
                    commands.add(m.group(1))
    except FileNotFoundError:
        print(f"  [WARN] CLI not found: {cli_path}")
    return commands

def scan_doc_planned(patterns, doc_path):
    """扫描文档中 [planned] 标记的数量。"""
    count = 0
    try:
        with open(doc_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        for pat in patterns:
            count += len(re.findall(pat, content))
    except FileNotFoundError:
        print(f"  [WARN] Doc not found: {doc_path}")
    return count

def main():
    tri_company = Path(os.environ.get(
        "TRICOMPANY_HOST_ASSETS",
        os.path.join(os.path.dirname(__file__), "..", "TriCompany-copilot-host-assets")
    ))
    engine_path = tri_company / "runtime" / "cognition" / "ipd_case_engine.py"
    cli_path = tri_company / "runtime" / "cognition" / "chief_of_staff_ipd_case.py"

    print("=== IPD Training Doc Sync Validator ===\n")

    # Step 1: Scan actual code
    print("[1] Scanning actual engine & CLI...")
    engine_funcs = find_engine_functions(engine_path)
    cli_cmds = find_cli_commands(cli_path)

    print(f"  Engine functions: {len(engine_funcs)}")
    print(f"  CLI commands: {len(cli_cmds)}")

    if cli_cmds:
        print(f"  CLI commands list: {sorted(cli_cmds)}")

    # Step 2: Check desired features
    desired_funcs = {
        'rollback_ipd_case': 'rollback 回退功能',
        'reopen_intake': 'reopen-intake 重开 intake 功能',
        'run_discovery_stage_automation': 'discovery 自动化功能',
        'run_intelligence_stage_automation': 'intelligence 自动化功能',
        'run_case_autopilot': 'autopilot 自动推进功能',
        'freeze_ipd_case': 'freeze 冻结功能',
        'unfreeze_ipd_case': 'unfreeze 解冻功能',
    }

    desired_cmds = {'rollback', 'reopen-intake', 'discovery', 'intelligence', 'autopilot', 'freeze', 'unfreeze'}

    print("\n[2] Checking desired features vs actual code...")

    missing_funcs = []
    for func, desc in desired_funcs.items():
        status = "MISSING (engine)" if func not in engine_funcs else "EXISTS"
        print(f"  {func}: {status}")
        if func not in engine_funcs:
            missing_funcs.append((func, desc))

    missing_cmds = []
    for cmd in desired_cmds:
        status = "MISSING (CLI)" if cmd not in cli_cmds else "EXISTS"
        print(f"  CLI '{cmd}': {status}")
        if cmd not in cli_cmds:
            missing_cmds.append(cmd)

    # Step 3: Scan docs for [planned]
    print("\n[3] Scanning docs for [planned] markers...")
    doc_dir = tri_company / "docs" / "training"
    overview_path = Path(os.path.join(os.path.dirname(__file__), "..", "docs", "ipd-document-system-overview.md"))

    planned_pattern = [r'\[planned\]']

    for doc_name in ["ipd-usage-guide.md", "ipd-cli-and-code-workflow-beginner-course.md", "IPD CASE术语.md"]:
        doc_path = doc_dir / doc_name
        count = scan_doc_planned(planned_pattern, doc_path)
        print(f"  {doc_name}: {count} [planned] markers")

    if overview_path.exists():
        count = scan_doc_planned(planned_pattern, overview_path)
        print(f"  ipd-document-system-overview.md: {count} [planned] markers")

    # Step 4: Summary / Exit Code
    print("\n[4] Summary:")
    if missing_funcs:
        print(f"  ENGINE MISSING ({len(missing_funcs)}):")
        for f, desc in missing_funcs:
            print(f"    - {f}: {desc}")
    if missing_cmds:
        print(f"  CLI MISSING ({len(missing_cmds)}):")
        for c in missing_cmds:
            print(f"    - {c}")

    if missing_funcs or missing_cmds:
        print("\n  VERDICT: Training docs describe aspirational features not yet in code.")
        print("  Expected — these are marked [planned] in docs.")
        print("  EXIT CODE: 2 (planned features not yet implemented)")
        sys.exit(2)
    else:
        print("\n  VERDICT: All features in code match docs. No gaps.")
        print("  EXIT CODE: 0 (fully in sync)")
        sys.exit(0)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""run-root.py — FADE 单 run 收口完整性基线（run root）计算器（LG-008 联审 CTO 案）

用法：
  --tree <dir>                 树目录（含 tree-op.json 与 reports/）
  --plan <path> [path...]      额外入根工件（仓库根相对路径，如任务说明书）
  --repo-root <dir>            仓库根（缺省从 --tree 向上找 .git）
  --out <path>                 输出快照（缺省 <tree>/reports/run-root.json）
  --recompute-reason <text>    补算/重算触发原因（非 Close 时点首算必填）
  --anchor <type=value>...     锚元数据（如 commit=c6f969de；记入 manifest，不入 Merkle）

规则（LG-008 2026-08-28 双席定案）：
  - 输入集=树目录内全部文件（tree-op.json + reports/**）+ --plan 显式工件；
    引用解析失败即 FAIL（exit 3，Close 时点门禁口径）
  - 跨仓评分卷宗不入根（CPO 边界声明）——以卷内引用+commit 锚定，记 anchors 元数据（不入 Merkle）
  - Merkle 口径：按 path 排序，逐件 "path\\0raw_sha256\\0lf_sha256" 串接后 sha256
    （canonical hash=_fadehash，与卷封同源）
  - root 计算时点钉死 Close CLI 点（新 run 纪律）；非 Close 时点产出=补算，五要合规：
    recomputed_at+触发原因+输入差说明+原根历史锚（永不覆盖——重算另档新文件）+basis manifest
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _fadehash import dual_sha256  # noqa: E402


def find_repo_root(start: Path) -> Path:
    cur = start.resolve()
    for cand in (cur, *cur.parents):
        if (cand / ".git").exists():
            return cand
    raise SystemExit(f"no .git upward from {start}")


def collect_tree_files(tree: Path) -> list[Path]:
    files = [tree / "tree-op.json"] if (tree / "tree-op.json").is_file() else []
    reports = tree / "reports"
    if reports.is_dir():
        files += sorted(
            p for p in reports.rglob("*")
            if p.is_file() and not p.name.startswith("run-root")
            # run-root 快照自排除：root 的根不含 root（防自引用；重算另档亦不入根）
        )
    return files


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tree", required=True)
    ap.add_argument("--plan", nargs="*", default=[])
    ap.add_argument("--repo-root")
    ap.add_argument("--out")
    ap.add_argument("--recompute-reason")
    ap.add_argument("--anchor", nargs="*", default=[])
    a = ap.parse_args()

    tree = Path(a.tree).resolve()
    if not tree.is_dir():
        print(f"FAIL: tree dir missing: {tree}", file=sys.stderr)
        return 3
    root_dir = Path(a.repo_root).resolve() if a.repo_root else find_repo_root(tree)

    files = collect_tree_files(tree)
    plan_resolved = []
    for raw in a.plan:
        p = root_dir / raw
        if not p.is_file():
            print(f"FAIL: 引用解析失败（Close 时点门禁口径）: {raw}", file=sys.stderr)
            return 3
        plan_resolved.append(p)
    if not files:
        print("FAIL: 树目录无 tree-op.json 且无 reports/——输入集为空", file=sys.stderr)
        return 3

    basis = []
    for p in sorted({*files, *plan_resolved}, key=lambda x: str(x)):
        raw, size, lf = dual_sha256(p)
        rel = str(p.resolve().relative_to(root_dir)).replace("\\", "/")
        basis.append({"path": rel, "sha256": raw, "bytes": size, "sha256_lf": lf})

    canon = "".join(f"{e['path']}\0{e['sha256']}\0{e['sha256_lf']}" for e in basis)
    run_root = hashlib.sha256(canon.encode("utf-8")).hexdigest()

    now = datetime.now(timezone.utc).isoformat()
    tree_id = tree.name
    tree_op_path = tree / "tree-op.json"
    if tree_op_path.is_file():
        try:
            tree_id = json.loads(tree_op_path.read_text(encoding="utf-8")).get("treeId") or tree_id
        except Exception:
            pass

    recompute = None
    if a.recompute_reason:
        recompute = {
            "recomputedAt": now,
            "reason": a.recompute_reason,
            "inputDiff": "首算即补算：Close CLI 时点未产出 root（retrospective §九 边界③），无先前输入集可比对",
            "originalRootAnchor": None,
            "appendOnlyNote": "原根历史锚=不存在（战役级 Merkle root 40ee6f8c… 系八树快照，非本 run root）；"
                              "本件为新档，不覆盖任何既有 root；后续重算须另档新文件（append-only）",
        }

    anchors = []
    for pair in a.anchor:
        if "=" in pair:
            t, v = pair.split("=", 1)
            anchors.append({"type": t, "value": v})
        else:
            anchors.append({"type": "note", "value": pair})

    snap = {
        "kind": "fade-run-root",
        "version": 1,
        "treeId": tree_id,
        "producedAt": None if recompute else now,
        "recomputedAt": recompute["recomputedAt"] if recompute else None,
        "recompute": recompute,
        "root": run_root,
        "algorithm": "sorted by path; per-file 'path\\0raw_sha256\\0lf_sha256' concatenated, sha256 "
                     "(canonical=_fadehash.dual_sha256, shared with seal-materials)",
        "basis": basis,
        "anchors": anchors,
    }

    out = Path(a.out).resolve() if a.out else tree / "reports" / "run-root.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snap, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"RUN-ROOT {run_root[:16]}…  basis={len(basis)} 件  -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

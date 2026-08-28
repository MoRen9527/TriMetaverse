#!/usr/bin/env python3
"""run-root.py — FADE 单 run 收口完整性基线（run root）计算器（LG-008 联审 CTO 案）

用法：
  --tree <dir>                 树目录（含 tree-op.json 与 reports/）
  --plan <path> [path...]      额外入根工件（仓库根相对路径，如任务说明书）
  --repo-root <dir>            仓库根（缺省从 --tree 向上找 .git）
  --out <path>                 输出快照（缺省 <tree>/reports/run-root.json）
  --recompute-reason <text>    首算=补算 provenance 原因；重算=本次重算原因（LG-008 验收令：重算时必填）
  --anchor <type=value>...     锚元数据（如 commit=c6f969de；记入 manifest，不入 Merkle）

规则（LG-008 2026-08-28 双席定案＋同日验收修复令）：
  - 输入集=树目录内全部文件（tree-op.json + reports/**，run-root 快照自排除防自引用）
    + --plan 显式工件；引用解析失败即 FAIL（exit 3，Close 时点门禁口径）
  - 跨仓评分卷宗不入根（CPO 边界声明）——以卷内引用+commit 锚定，记 anchors 元数据（不入 Merkle）
  - Merkle 口径：按 path 排序，逐件 "path\\0raw_sha256\\0lf_sha256" 串接后 sha256
    （canonical hash=_fadehash，与卷封同源）
  - root 计算时点钉死 Close CLI 点（新 run 纪律）
  - **append-only（验收修复令 Bug-1）**：输出文件已存在时不得覆盖——原 producedAt/initialRoot/
    全部 recompute_history 保留，新计算只追加 recompute_history 条目并更新现行 root 字段
  - **首算必填 producedAt（Bug-2）**：recompute 语义仅用于后续重算；首算即补算场景走
    initialProvenance（不冒用 recompute）
  - **显式 UTF-8（Bug-3）**：读写均 encoding="utf-8"
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
            # run-root 快照自排除：root 的根不含 root（防自引用；历史档亦不入根）
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

    out = Path(a.out).resolve() if a.out else tree / "reports" / "run-root.json"

    # ── append-only 读取门（Bug-1 修复）：既有快照解析失败即拒，绝不覆盖 ──
    existing = None
    if out.exists():
        try:
            existing = json.loads(out.read_text(encoding="utf-8"))
            if not isinstance(existing, dict) or "root" not in existing:
                raise ValueError("missing root field")
        except Exception:
            print("FAIL: 既有 root 快照解析失败——append-only 保护拒绝覆盖，请人工处置后重试",
                  file=sys.stderr)
            return 3

    anchors = []
    for pair in a.anchor:
        if "=" in pair:
            t, v = pair.split("=", 1)
            anchors.append({"type": t, "value": v})
        else:
            anchors.append({"type": "note", "value": pair})

    snap = {
        "kind": "fade-run-root",
        "version": 2,
        "treeId": tree_id,
        "producedAt": None,
        "initialRoot": None,
        "initialProvenance": None,
        "root": run_root,
        "algorithm": "sorted by path; per-file 'path\\0raw_sha256\\0lf_sha256' concatenated, sha256 "
                     "(canonical=_fadehash.dual_sha256, shared with seal-materials)",
        "recompute_history": [],
        "basis": basis,
        "anchors": anchors,
    }

    if existing is None:
        # ── 首次计算（Bug-2 修复）：producedAt 必填；recompute 块不再用于首算 ──
        snap["producedAt"] = now
        snap["initialRoot"] = run_root
        if a.recompute_reason:
            snap["initialProvenance"] = {
                "kind": "首算即补算（Close 时点未产出 root）",
                "reason": a.recompute_reason,
                "inputDiff": "首算即补算：无先前输入集可比对",
                "originalRootAnchor": None,
                "appendOnlyNote": "后续重算追加 recompute_history（同文件），原 root 历史锚永不覆盖",
            }
    else:
        # ── 重算：append-only 追加（Bug-1 修复），原 producedAt/initialRoot/历史全保留 ──
        prev_root = existing.get("root")
        prev_basis_n = len(existing.get("basis") or [])
        snap["producedAt"] = existing.get("producedAt") or existing.get("recomputedAt") or now
        snap["initialRoot"] = existing.get("initialRoot") or prev_root
        legacy_provenance = existing.get("initialProvenance") or existing.get("recompute")
        if legacy_provenance:
            snap["initialProvenance"] = legacy_provenance  # v1 旧档 recompute 块迁移保留
        history = existing.get("recompute_history") or []
        history.append({
            "recomputedAt": now,
            "reason": a.recompute_reason or "(未提供原因——重算必填 reason，验收修复令)",
            "prevRoot": prev_root,
            "newRoot": run_root,
            "inputDiff": f"basis {prev_basis_n}→{len(basis)} 件",
        })
        snap["recompute_history"] = history

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snap, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tag = "INIT" if existing is None else f"RECOMPUTE#{len(snap['recompute_history'])}"
    print(f"RUN-ROOT[{tag}] {run_root[:16]}…  basis={len(basis)} 件  -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

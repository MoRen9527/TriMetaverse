#!/usr/bin/env python3
"""seal-materials.py — FADE 卷封制材料指纹工具（协议见 fade-pipeline-design.md §九）

用法：
  --attach <tree-op.json> <path> [path...] [--role campaign-plan]
      计算各 path 的 sha256 并写入 tree-op.json 的 sourceMaterials 字段
      （已存在的同 path 条目视为违例拒绝——封卷只许一次）

  --verify <tree-op.json> [--repo-root <dir>]
      对树内 sourceMaterials 逐项重算对照，全部一致 exit 0；
      有漂移 exit 2 并打印逐项差异（供验卷/对卷两段与编排层调用）

  --manifest <path>...
      仅打印 manifest JSON（stdout），不改任何文件

说明：sha256 按文件字节计；path 为仓库根相对路径（--repo-root 缺省=
脚本所在仓根的上一级推理不可靠，请显式传或从 tree-op.json 同目录向上找 .git）。
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# Windows GBK 控制台兜底（D-09 同族教训）：中文+特殊符号输出不崩
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


def _sha256(p: Path) -> tuple[str, int, str]:
    """返回 (raw_sha256, bytes, lf_sha256)。lf 为行尾归一化(\r\n→\n)后 hash——
    SOFT-DRIFT 判据（联审 CTO-F6）：跨 Win/Unix 流转的行尾漂移不按材料
    污染处理，仅警告留痕。"""
    data = p.read_bytes()
    raw = hashlib.sha256(data).hexdigest()
    lf = hashlib.sha256(data.replace(b"\r\n", b"\n")).hexdigest()
    return raw, len(data), lf


def _find_repo_root(start: Path) -> Path:
    cur = start.resolve()
    if cur.is_file():
        cur = cur.parent
    for cand in (cur, *cur.parents):
        if (cand / ".git").exists():
            return cand
    raise SystemExit(f"no .git upward from {start}")


def cmd_attach(tree_file: Path, paths: list[str], role: str, repo_root: Path) -> int:
    d = json.loads(tree_file.read_text(encoding="utf-8"))
    if d.get("sourceMaterials"):
        print("REFUSE: sourceMaterials already sealed (封卷只许一次；重封需走 §9.3 裁决)",
              file=sys.stderr)
        return 3
    entries = []
    for raw in paths:
        p = repo_root / raw
        if not p.is_file():
            print(f"MISSING: {raw}", file=sys.stderr)
            return 3
        sha, size, sha_lf = _sha256(p)
        entries.append({"path": raw.replace("\\", "/"), "sha256": sha, "bytes": size,
                        "sha256_lf": sha_lf,
                        "role": role, "recordedAt": datetime.now(timezone.utc).isoformat()})
        print(f"sealed {sha[:12]}… (lf {sha_lf[:12]}…) {size:>7}B {raw}")
    d["sourceMaterials"] = entries
    tree_file.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"attached {len(entries)} entr(ies) -> {tree_file}")
    return 0


def cmd_verify(tree_file: Path, repo_root: Path) -> int:
    d = json.loads(tree_file.read_text(encoding="utf-8"))
    mats = d.get("sourceMaterials") or []
    if not mats:
        print("UNSEALED: 该树无 sourceMaterials 登记（卷封制前旧树）")
        return 1
    drift, soft = [], []
    for m in mats:
        p = repo_root / m["path"]
        if not p.is_file():
            drift.append((m["path"], "FILE MISSING", m["sha256"][:12]))
            continue
        sha, size, sha_lf = _sha256(p)
        if sha == m["sha256"]:
            continue
        if m.get("sha256_lf") and sha_lf == m["sha256_lf"]:
            soft.append((m["path"], f"raw {m['sha256'][:12]}…→{sha[:12]}…（仅行尾漂移）"))
            continue
        drift.append((m["path"], f"now={sha[:12]}… ({size}B)", f"sealed={m['sha256'][:12]}… ({m['bytes']}B)"))
    for path, note in soft:
        print(f"  ⚠ SOFT-DRIFT {path}: {note}——行尾级差异留痕，不触发 §9.3 污染裁决")
    if drift:
        print("DRIFT DETECTED——材料在封卷后被改动，走 §9.3 裁决前不得通过：")
        for path, now, sealed in drift:
            print(f"  ✗ {path}\n      {now}\n      {sealed}")
        return 2
    if soft:
        print(f"SEALED-INTACT(WITH SOFT-DRIFT): {len(mats)} 项语义一致，{len(soft)} 项行尾漂移已留痕")
        return 0
    print(f"SEALED-INTACT: {len(mats)} 材料全部与封卷一致 ✓")
    return 0


def cmd_manifest(paths: list[str], repo_root: Path) -> int:
    out = []
    for raw in paths:
        sha, size, sha_lf = _sha256(repo_root / raw)
        out.append({"path": raw.replace("\\", "/"), "sha256": sha, "bytes": size, "sha256_lf": sha_lf})
    print(json.dumps(out, ensure_ascii=False, indent=1))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--attach", metavar="TREE_JSON")
    ap.add_argument("--verify", metavar="TREE_JSON")
    ap.add_argument("--manifest", action="store_true")
    ap.add_argument("--role", default="campaign-plan")
    ap.add_argument("--repo-root")
    ap.add_argument("paths", nargs="*")
    a = ap.parse_args()

    anchor = a.attach or a.verify or (a.paths[0] if a.paths else ".")
    if a.repo_root:
        root = Path(a.repo_root).resolve()
    else:
        try:
            root = _find_repo_root(Path(anchor))
        except SystemExit:
            # 临时目录场景（冒烟/外部调用）：从当前工作目录再找一次
            root = _find_repo_root(Path.cwd())
        except Exception:
            root = _find_repo_root(Path.cwd())

    if a.attach:
        return cmd_attach(Path(a.attach), a.paths, a.role, root)
    if a.verify:
        return cmd_verify(Path(a.verify), root)
    if a.manifest:
        return cmd_manifest(a.paths, root)
    ap.print_help()
    return 3


if __name__ == "__main__":
    sys.exit(main())

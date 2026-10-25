# -*- coding: utf-8 -*-
"""doc-graph-scan.py — 文档引用图谱索引器（§3.4.1 层四自动知晓·机械反向索引）

用途：全仓扫 md 头部字段与正文路径引用，构建 docs/doc-graph.json（cites/citedBy/lastCommit）；
落卷时反查 --who-cites <path> 得知会清单。镜像件漂移检测（lastSyncedAt vs 真源 lastCommit）候窗挂巡检。

用法：
  python scripts/doc-graph-scan.py                 # 全量扫描，写 docs/doc-graph.json
  python scripts/doc-graph-scan.py --who-cites X   # 反查谁引用 X（读现有 graph）
豁免域（不作为扫描主体）：operating-records/、memory/、机器产物目录；被引用则照记。
"""
import json
import os
import re
import subprocess
import sys
from collections import defaultdict

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAPH_PATH = os.path.join(REPO, "docs", "doc-graph.json")
SKIP_PARTS = {"operating-records", "memory", "node_modules", ".git"}
REF_RE = re.compile(r"[A-Za-z0-9_\-.]+(?:/[A-Za-z0-9_\-.]+)+\.(?:md|json)")
EXTERNAL_PREFIXES = ("TriCompany/", "TriCompany-host-assets/", "TriCode/", "TriRLC/", "TriPilot/")


def list_md_files():
    out = []
    for dp, dns, fns in os.walk(os.path.join(REPO, "docs")):
        dns[:] = [d for d in dns if d not in SKIP_PARTS]
        for fn in fns:
            if fn.endswith(".md"):
                out.append(os.path.relpath(os.path.join(dp, fn), REPO).replace("\\", "/"))
    for fn in os.listdir(REPO):
        if fn.endswith(".md"):
            out.append(fn)
    return sorted(out)


def norm_ref(tok):
    tok = tok.replace("\\", "/").lstrip("./")
    return tok


def extract_refs(rel_path):
    """返回该文件引用到的仓内相对路径与外部路径。"""
    full = os.path.join(REPO, rel_path)
    try:
        text = open(full, encoding="utf-8", errors="replace").read()
    except OSError:
        return set(), set()
    internal, external = set(), set()
    for tok in REF_RE.findall(text):
        ref = norm_ref(tok)
        if ref == rel_path:
            continue
        if ref.startswith(EXTERNAL_PREFIXES):
            external.add(ref)
        elif os.path.exists(os.path.join(REPO, ref)):
            internal.add(ref)
    return internal, external


def last_commit_map(paths):
    """单次 git log 全历史解析：文件 -> 最新触及 commit 短 hash。"""
    m = {}
    try:
        log = subprocess.run(
            ["git", "log", "--name-only", "--pretty=format:@%h"],
            cwd=REPO, capture_output=True, text=True, encoding="utf-8", errors="replace",
            timeout=120,
        ).stdout
    except (subprocess.TimeoutExpired, OSError):
        return m
    cur = None
    for line in log.splitlines():
        line = line.strip()
        if line.startswith("@"):
            cur = line[1:]
        elif line and cur and line not in m:
            m[line.replace("\\", "/")] = cur
    return {p: m[p] for p in paths if p in m}


def scan():
    files = list_md_files()
    cites = {}
    ext = defaultdict(set)
    for f in files:
        i, e = extract_refs(f)
        cites[f] = sorted(i)
        if e:
            ext[f] = sorted(e)
    cited_by = defaultdict(list)
    for f, refs in cites.items():
        for r in refs:
            cited_by[r].append(f)
    lc = last_commit_map(files)
    graph = {
        "_meta": {
            "generatedBy": "scripts/doc-graph-scan.py",
            "spec": "docs/文档治理与真源文件系统.md §3.4.1 层四",
            "files": len(files),
        },
        "nodes": {
            f: {"cites": cites[f], "citedBy": sorted(cited_by.get(f, [])), "lastCommit": lc.get(f)}
            for f in files
        },
        "externalRefs": {f: sorted(s) for f, s in ext.items()},
    }
    with open(GRAPH_PATH, "w", encoding="utf-8") as fh:
        json.dump(graph, fh, ensure_ascii=False, indent=1, sort_keys=True)
    total_edges = sum(len(v["cites"]) for v in graph["nodes"].values())
    print("scan ok: files=%d internal_edges=%d external_files=%d -> %s"
          % (len(files), total_edges, len(ext), os.path.relpath(GRAPH_PATH, REPO)))


def who_cites(target):
    norm = target.replace("\\", "/")
    base = os.path.basename(norm)
    try:
        graph = json.load(open(GRAPH_PATH, encoding="utf-8"))
    except OSError:
        print("graph not found; run full scan first")
        return
    hits = []
    for f, node in graph["nodes"].items():
        if any(r == norm or r.endswith("/" + base) for r in node["cites"]):
            hits.append(f)
    print("who-cites %s: %d files" % (norm, len(hits)))
    for h in hits:
        print("  " + h)


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "--who-cites":
        who_cites(sys.argv[2])
    else:
        scan()

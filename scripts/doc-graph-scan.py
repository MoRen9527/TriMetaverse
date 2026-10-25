# -*- coding: utf-8 -*-
"""doc-graph-scan.py — 文档引用图谱索引器（§3.4.1 层四自动知晓·机械反向索引）

v2（2026-10-25 CTO 评审修复）：R1 中文路径支持（\\w 含 CJK）·R2 相对路径双试归一
（根相对优先·同目录兜底·normpath 越界丢弃）·R3 who-cites basename 兜底仅唯一命中启用·
_meta 增 generatedAt/repoHead·stdout 强制 UTF-8（GBK 控制台防御）。

用法：
  python scripts/doc-graph-scan.py                 # 全量扫描，写 docs/doc-graph.json
  python scripts/doc-graph-scan.py --who-cites X   # 反查谁引用 X（读现有 graph）
豁免域（不作为扫描主体）：operating-records/、memory/、机器产物目录；被引用则照记。
"""
import argparse
import json
import os
import re
import subprocess
import sys
from collections import defaultdict
from datetime import datetime

try:  # GBK 控制台防御（CTO 轻伤①）：中文输出不炸
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAPH_PATH = os.path.join(REPO, "docs", "doc-graph.json")
SKIP_PARTS = {"operating-records", "memory", "node_modules", ".git"}
# R1 修复：\w 默认 UNICODE（含 CJK），中文路径 token 可抓；尾标点剥离防「见 docs/x.md。」粘连
REF_RE = re.compile(r"[\w./\\-]+\.(?:md|json)", re.UNICODE)
TRAIL_PUNCT = ".,;:。，；：、"
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


def resolve_ref(tok, rel_path):
    """R2 修复：token→仓内相对路径。双试法：根相对优先，引用件同目录相对兜底；越界丢弃。"""
    tok = tok.replace("\\", "/").rstrip(TRAIL_PUNCT).lstrip("/")
    if not tok or tok == rel_path:
        return None
    for cand in (tok, re.sub(r"/\.\./", "/", "/" + tok).lstrip("/") if "/../" in "/" + tok + "/" else tok,
                 os.path.normpath(os.path.join(os.path.dirname(rel_path), tok)).replace("\\", "/")):
        cand = os.path.normpath(cand).replace("\\", "/") if cand else cand
        if not cand or cand.startswith(".."):
            continue  # 越界丢弃
        if cand == rel_path:
            return None
        if os.path.exists(os.path.join(REPO, cand)):
            return cand
    return None


def extract_refs(rel_path):
    """返回（仓内引用集，外部引用集）。"""
    full = os.path.join(REPO, rel_path)
    try:
        text = open(full, encoding="utf-8", errors="replace").read()
    except OSError:
        return set(), set()
    internal, external = set(), set()
    for m in REF_RE.findall(text):
        tok = m.rstrip(TRAIL_PUNCT)
        if tok.startswith(EXTERNAL_PREFIXES):
            external.add(tok)
            continue
        ref = resolve_ref(tok, rel_path)
        if ref:
            internal.add(ref)
    return internal, external


def last_commit_map(paths):
    """单次 git log 全历史解析：文件 -> 最新触及 commit 短 hash。失败返回 (空, 原因)。"""
    m = {}
    try:
        log = subprocess.run(
            ["git", "log", "--name-only", "--pretty=format:@%h"],
            cwd=REPO, capture_output=True, text=True, encoding="utf-8", errors="replace",
            timeout=120,
        ).stdout
    except (subprocess.TimeoutExpired, OSError) as e:
        return {}, "git-log-%s" % type(e).__name__  # 轻伤②分型：null 可归因
    cur = None
    for line in log.splitlines():
        line = line.strip()
        if line.startswith("@"):
            cur = line[1:]
        elif line and cur and line not in m:
            m[line.replace("\\", "/")] = cur
    return ({p: m[p] for p in paths if p in m}, "ok")


def repo_head():
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=REPO,
                              capture_output=True, text=True, encoding="utf-8",
                              timeout=15).stdout.strip() or None
    except (subprocess.TimeoutExpired, OSError):
        return None


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
    lc, lc_src = last_commit_map(files)
    graph = {
        "_meta": {
            "generatedBy": "scripts/doc-graph-scan.py",
            "spec": "docs/文档治理与真源文件系统.md §3.4.1 层四",
            "generatedAt": datetime.now().astimezone().isoformat(timespec="seconds"),
            "repoHead": repo_head(),
            "lastCommitSource": lc_src,
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
    print("scan ok: files=%d internal_edges=%d external_files=%d head=%s -> %s"
          % (len(files), total_edges, len(ext), graph["_meta"]["repoHead"],
             os.path.relpath(GRAPH_PATH, REPO)))


def who_cites(target):
    """R3 修复：精确路径命中为准；basename 兜底仅在唯一命中时启用并显式标注。"""
    norm = target.replace("\\", "/").strip("/")
    base = os.path.basename(norm)
    try:
        graph = json.load(open(GRAPH_PATH, encoding="utf-8"))
    except OSError:
        print("graph not found; run full scan first")
        return
    exact, loose = [], []
    has_dir = "/" in norm
    for f, node in graph["nodes"].items():
        for r in node["cites"]:
            if r == norm or (has_dir and r.endswith("/" + norm)):
                exact.append(f)  # 带目录路径=精确段匹配
                break
            elif not has_dir and (r.endswith("/" + norm) or r == norm):
                loose.append(f)  # 裸 basename 引用=兜底通道，走唯一性守卫
                break
    print("who-cites %s: exact=%d" % (norm, len(exact)))
    for h in exact:
        print("  " + h)
    loose_only = [f for f in loose if f not in exact]
    if loose_only:
        if len(loose_only) == 1:
            print("  + basename-match (unique fallback): " + loose_only[0])
        else:
            print("  ~ basename-match ambiguous, %d candidates not shown (R3 guard)" % len(loose_only))


def main():
    parser = argparse.ArgumentParser(
        prog="doc-graph-scan.py",
        description="文档引用图谱索引器（§3.4.1 层四·机械反向索引）",
    )
    parser.add_argument("--who-cites", metavar="PATH",
                        help="反查谁引用 PATH（读现有 docs/doc-graph.json，不重扫）")
    args = parser.parse_args()
    if args.who_cites:
        who_cites(args.who_cites)
    else:
        scan()


if __name__ == "__main__":
    main()

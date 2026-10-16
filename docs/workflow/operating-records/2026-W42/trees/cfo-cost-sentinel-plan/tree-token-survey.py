#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""tree-token-survey.py — 任务树 token 消耗一次性实勘脚本（成本监测哨·定值供料）

一次性用完即弃（D-55 对轨·不求常驻不养护）。方法论=trees/cfo-cost-sentinel-plan/cto-tech-support-20261016.md：
- 归属映射三级置信形（v1 用中锚=commit 链窗·高锚现役缺位·低锚兜底 unattributed）
- 两遍法：pass1 全 transcript 取活动窗筛交集 → pass2 仅交集文件全量 usage 聚合
- 输出规格（CFO 补注 a/b 合流）：P50/P90/P99/max + unattributed 占比 + 置信级列
"""
import json, glob, os, subprocess, sys
from datetime import datetime, timezone

REPO = r"D:/Code/ai/TriMetaverse"
PROJ_ROOT = r"C:/Users/jedih/.claude/projects"
RECORDS = os.path.join(REPO, "docs/workflow/operating-records")

# ── 样本配置：树名 → (周实例路径列表, 分型) —— 跨周同名树合并为一棵
SAMPLES = {
    # 探路型
    "duty-silence-probe-01":   (["2026-W40/trees/duty-silence-probe-01"], "探路"),
    "cto-8710-gate-audit-01":  (["2026-W40/trees/cto-8710-gate-audit-01"], "探路"),
    "rhy-401-key-audit":       (["2026-W40/trees/rhy-401-key-audit"], "探路"),
    "mc-link-verify-20261014": (["2026-W42/trees/mc-link-verify-20261014"], "探路"),
    "fuzzy-ts-gate-exempt":    (["2026-W42/trees/fuzzy-ts-gate-merge-exemption-20261014"], "探路"),
    # 批量型
    "bod-pipeline-batch-01":   (["2026-W40/trees/bod-pipeline-batch-01"], "批量"),
    "bod-pipeline-batch-09":   (["2026-W40/trees/bod-pipeline-batch-09"], "批量"),
    "bod-pipeline-batch-18":   (["2026-W40/trees/bod-pipeline-batch-18"], "批量"),
    "trimc-fleet-migration":   (["2026-W40/trees/trimc-root-to-fleet-migration-20261003"], "批量"),
    "maint-batch-3-4":         (["2026-W40/trees/maint-batch-3-4-20261003"], "批量"),
    # 长跑型
    "bod-tick":                (["2026-W41/trees/bod-tick", "2026-W42/trees/bod-tick"], "长跑"),
    "bod-watch":               (["2026-W41/trees/bod-watch"], "长跑"),
    "fullauto-loop":           (["2026-W38/trees/fullauto-loop", "2026-W39/trees/fullauto-loop"], "长跑"),
    "lg065-duty-seat-bc":      (["2026-W41/trees/lg065-duty-seat-bc-20261006"], "长跑"),
    "sg-duty-trial-20261009":  (["2026-W41/trees/sg-duty-trial-20261009"], "长跑"),
}

def ts_parse(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp() if s else None

def git_window(rel_paths):
    """树 commit 链窗：对树路径取全部 commit 时戳，窗=[min,max]。返回 None=树无 commit（纯卷面）。"""
    tss = []
    for rp in rel_paths:
        full = os.path.join(RECORDS, rp.replace("/", os.sep))
        try:
            out = subprocess.run(
                ["git", "log", "--format=%ct", "--", os.path.relpath(full, REPO).replace(os.sep, "/")],
                cwd=REPO, capture_output=True, text=True, timeout=30).stdout
            tss += [int(x) for x in out.split() if x.strip().isdigit()]
        except Exception:
            pass
    return (min(tss), max(tss)) if tss else None

def transcript_span(path):
    """pass1：读首行+尾行取活动窗。"""
    first = last = None
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                if '"timestamp"' in line:
                    try:
                        t = ts_parse(json.loads(line).get("timestamp"))
                    except Exception:
                        continue
                    if t:
                        if first is None: first = t
                        last = t
                        break
            if first is not None:
                with open(path, "rb") as fh2:
                    fh2.seek(max(0, os.path.getsize(path) - 65536))
                    for line in fh2.read().decode("utf-8", "replace").splitlines():
                        if '"timestamp"' in line:
                            try:
                                t = ts_parse(json.loads(line).get("timestamp"))
                            except Exception:
                                continue
                            if t: last = t
    except Exception:
        pass
    return (first, last)

def usage_totals(path, lo, hi):
    """pass2：全量聚合 usage 四项（metering protocol 口径·不折现金）。"""
    inp = cache_c = cache_r = out = 0
    n = 0
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            if '"usage"' not in line: continue
            try: rec = json.loads(line)
            except Exception: continue
            t = ts_parse(rec.get("timestamp"))
            if t is None or t < lo or t > hi: continue   # 窗内行才计入（长会话切段误差源·已注记）
            u = (rec.get("message") or {}).get("usage") or {}
            inp += u.get("input_tokens", 0) or 0
            cache_c += u.get("cache_creation_input_tokens", 0) or 0
            cache_r += u.get("cache_read_input_tokens", 0) or 0
            out += u.get("output_tokens", 0) or 0
            n += 1
    return dict(input=inp, cacheC=cache_c, cacheR=cache_r, output=out, turns=n,
                total=inp + cache_c + cache_r + out)

def main():
    # pass1：全 transcript 活动窗
    spans = {}
    for f in glob.glob(os.path.join(PROJ_ROOT, "*", "*.jsonl")):
        sp = transcript_span(f)
        if sp[0]: spans[f] = sp
    print(f"pass1: {len(spans)} transcripts spanned", file=sys.stderr)

    rows = []
    unattr_total = 0
    for name, (paths, typ) in SAMPLES.items():
        win = git_window(paths)
        if not win:
            rows.append(dict(tree=name, typ=typ, total=0, conf="无commit窗(跳过)", unattr_ratio=None))
            continue
        lo, hi = win
        cand = {f: sp for f, sp in spans.items()
                if sp[0] <= hi and (sp[1] or sp[0]) >= lo}          # 窗交集
        scored = []
        for f, sp in cand.items():
            ov = min(sp[1] or sp[0], hi) - max(sp[0], lo)
            if ov > 0: scored.append((ov, f))
        if not scored:
            rows.append(dict(tree=name, typ=typ, total=0, conf="无transcript交集(跳过)", unattr_ratio=None))
            continue
        scored.sort(reverse=True)
        # 主归属=窗内 usage>0 的最大交集者（交集最大但窗内零说话的件跳过——首轮 4 棵零读数根因）
        u = None
        n_main = len(scored)
        for _, f in scored[:8]:
            u_try = usage_totals(f, lo, hi)
            if u_try["total"] > 0 and (u is None or u_try["total"] > u["total"]):
                u = u_try
                main_f = f
        if u is None:
            rows.append(dict(tree=name, typ=typ, total=0, conf=f"重叠{n_main}件窗内全零(跳过)", unattr_ratio=None))
            continue
        conf = f"中(commit窗主锚·重叠{n_main}件·探top{min(8,n_main)})"
        rows.append(dict(tree=name, typ=typ, total=u["total"], input=u["input"],
                         cacheC=u["cacheC"], cacheR=u["cacheR"], output=u["output"],
                         turns=u["turns"], conf=conf, unattr_ratio=None,
                         main_file=os.path.basename(main_f)))
    # unattributed 占比：全样本窗内消耗 vs 主归属消耗（简化口径：全机 W38 后活跃 transcript 总耗为分母）
    all_windows = [w for w in (git_window(pt[0]) for pt in SAMPLES.values()) if w]
    all_lo = min(w[0] for w in all_windows)
    grand = 0
    for f, sp in spans.items():
        if sp[0] <= datetime.now(timezone.utc).timestamp() and (sp[1] or sp[0]) >= all_lo:
            grand += usage_totals(f, all_lo, datetime.now(timezone.utc).timestamp())["total"]
    sample_total = sum(r["total"] for r in rows)
    ua_ratio = 1 - sample_total / grand if grand else None

    # 分布出表
    def pct(vals, q):
        s = sorted(vals); i = max(0, min(len(s) - 1, int(q * len(s)))); return s[i]
    print("\n=== 逐树读数 ===")
    print(f"{'树':<26} {'型':<4} {'total':>12} {'input':>10} {'cacheC':>10} {'cacheR':>12} {'output':>8}  置信")
    for r in rows:
        print(f"{r['tree']:<26} {r['typ']:<4} {r['total']:>12,} {r.get('input',0):>10,} {r.get('cacheC',0):>10,} {r.get('cacheR',0):>12,} {r.get('output',0):>8,}  {r['conf']}")
    print("\n=== 分型分布（total）===")
    for typ in ("探路", "批量", "长跑"):
        vals = [r["total"] for r in rows if r["typ"] == typ and r["total"] > 0]
        if vals:
            print(f"{typ}: n={len(vals)} P50={pct(vals,.5):,} P90={pct(vals,.9):,} P99={pct(vals,.99):,} max={max(vals):,}")
    print(f"\n=== unattributed 占比（样本主归属 vs 全机窗内总耗）===")
    print(f"样本主归属合计={sample_total:,}  全机总耗={grand:,}  unattributed≈{ua_ratio*100:.1f}%" if ua_ratio is not None else "n/a")
    print("\n注：主归属仅取交集最大 transcript（副树并行误差源未计入·卷面已注记）；长跑型窗大·切段误差偏上一并知悉。")

if __name__ == "__main__":
    main()

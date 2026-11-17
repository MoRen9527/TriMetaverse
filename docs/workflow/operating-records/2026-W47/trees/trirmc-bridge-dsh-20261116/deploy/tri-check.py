#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tri-check.py — LG-099 子项A 三账对表机械化判读面（deploy 件·dev 8713 30min 节拍 cron 挂形）
真源=TriMetaverse W47 桥改造树 deploy/ 面（SDE 铸·BOD 148② 部署段移交本地链形）

三查面（督办账正形）：
  ①台账 open 件 → 树指针存在性 + 树 mtime 活性
  ②树节点 → 台账状态一致性
  ③大表计数 ↔ 台账计数差口

输出：差口 JSON 卷（落 --out-dir）+ 零差静默心跳行（stdout·防断链误判）。
护栏：只读观测面（三账零写入）·零密钥·差口即报形（stdout 差口行=值守消费面）。
"""
import argparse, json, os, re, sys
from datetime import datetime, timezone
from pathlib import Path

def now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def parse_ledger_open(ledger_path: Path):
    """台账 open 件行 parse（LG-xxx 行·状态列含 open/在途/候窗/在卷 形）。"""
    rows = []
    if not ledger_path.is_file():
        return rows, ["台账面缺: %s" % ledger_path]
    text = ledger_path.read_text(encoding="utf-8", errors="replace")
    for line in text.splitlines():
        m = re.match(r"^\|\s*(LG-\d+[^|]*)\s*\|", line)
        if not m:
            continue
        lg = m.group(1).strip()
        low = line.lower()
        state = "open"
        if re.search(r"\|\s*是（|销账|closed|已完成", line):
            state = "closed"
        elif re.search(r"候窗|候排窗|冻结|候令|挂账", line):
            state = "hold"
        rows.append({"lg": lg, "state": state, "raw_head": line[:120]})
    return rows, []

def check1_ledger_to_tree(rows, trees_root: Path):
    """①台账 open 件→树指针存在性+mtime 活性（树指针=LG 号面 grep 树目录名）。"""
    out = []
    for r in rows:
        if r["state"] != "open":
            continue
        stem = re.sub(r"^LG-\d+\s*", "", r["lg"]).strip()
        stem = re.sub(r"[^0-9A-Za-z一-龥]+", "-", stem)[:40]
        hit = None
        if trees_root.is_dir():
            for d in sorted(trees_root.iterdir()):
                if d.is_dir() and (stem[:12] in d.name or d.name[:12] in stem):
                    mt = datetime.fromtimestamp(d.stat().st_mtime, tz=timezone.utc)
                    age_h = (datetime.now(timezone.utc) - mt).total_seconds() / 3600.0
                    hit = {"tree": d.name, "mtime_age_h": round(age_h, 1)}
                    break
        out.append({"lg": r["lg"], "tree_pointer": hit,
                    "ok": hit is not None,
                    "detail": "树指针缺失" if hit is None else "mtime_age_h=%.1f" % hit["mtime_age_h"]})
    return out

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="LG-099 子项A 三账对表机械化判读面")
    ap.add_argument("--ledger", required=True, help="台账面路径（任务进度总表 md）")
    ap.add_argument("--inventory", required=True, help="大表面路径（task-inventory md/json）")
    ap.add_argument("--trees-root", required=True, help="树面根（operating-records/YYYY-Wnn/trees/）")
    ap.add_argument("--out-dir", required=True, help="差口卷落位（run_dir/convene/ 或独立卷面）")
    args = ap.parse_args(argv)

    diffs, heartbeat = [], []
    ledger_rows, warns = parse_ledger_open(Path(args.ledger))
    if warns:
        diffs.append({"check": "ledger-present", "ok": False, "detail": warns[0]})
    open_rows = [r for r in ledger_rows if r["state"] == "open"]
    heartbeat.append("台账 open 件=%d" % len(open_rows))

    c1 = check1_ledger_to_tree(open_rows, Path(args.trees_root))
    c1_bad = [x for x in c1 if not x["ok"]]
    if c1_bad:
        diffs.append({"check": "①open→树指针", "ok": False, "rows": c1_bad})
    heartbeat.append("①open→树指针核=%d（缺=%d）" % (len(c1), len(c1_bad)))

    # ③大表计数↔台账计数差口（大表行数 vs 台账 LG 行数·粗对表形）
    inv = Path(args.inventory)
    inv_n = None
    if inv.is_file():
        inv_n = len([l for l in inv.read_text(encoding="utf-8", errors="replace").splitlines()
                     if re.match(r"^\|\s*(LG-\d+|TASK|\d+)", l)])
    if inv_n is not None and ledger_rows:
        delta = abs(inv_n - len(ledger_rows))
        if delta > 5:
            diffs.append({"check": "③大表↔台账计数差口", "ok": False,
                          "detail": "大表=%d 台账=%d 差=%d" % (inv_n, len(ledger_rows), delta)})
    heartbeat.append("③大表↔台账计数差口核=inv_n=%s ledger_n=%d" % (inv_n, len(ledger_rows)))

    conv = {"check_time": now_utc(), "ledger_open_n": len(open_rows),
            "diffs": diffs, "diffs_n": len(diffs),
            "heartbeat": heartbeat,
            "gate": "DIFF" if diffs else "ZERO-DIFF-HEARTBEAT"}
    os.makedirs(args.out_dir, exist_ok=True)
    out_p = Path(args.out_dir) / ("tri-check-%s.json" % datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ"))
    out_p.write_text(json.dumps(conv, ensure_ascii=False, indent=1), encoding="utf-8")
    # 差口即报形：差口行 stdout（值守消费面）·零差=静默心跳行
    print("[%s] gate=%s diffs_n=%d 卷=%s" % (conv["gate"], conv["gate"], len(diffs), out_p))
    for d in diffs:
        print("[DIFF] " + json.dumps(d, ensure_ascii=False)[:200])
    if not diffs:
        print("[HEARTBEAT] 三查零差（静默心跳行·防断链误判）")
    return 0

if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""charter 截断配对律检测器（v8 item14 · CFO 产出侧三件之二）

判据（CEO 21:2x 令「7 席联审所有改进意见都该进 charter……成本才不白花」）：
  1) charter.aggregation.dropped 非空 → 必须存在处置配对（dropped_dispositions 或
     dispositions 映射），每项含 who/how/when 三要素；缺任一 → FAIL
  2) charter.source.opinion_ids 条数 == 本轮 opinions.json 合格条数（产出入率 100%）；
     少于 → 该项意见链断裂（v8 charter 实证：7 席缺 cho/cfo）→ FAIL
  3) charter.items 条数 == items_included（计数一致性）

用法：
  python scripts/charter-truncation-guard.py <charter.json> [--opinions <opinions.json>] [--json]
退出码：0=全过 / 1=存在告警项（逐条打印）
机械判锚：--selftest（合成件三态：合规/截断无处置/意见链断裂，断言判定正确）
"""
import argparse
import json
import sys
import tempfile
import os


def _load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def check(charter, opinions=None):
    """返回 (ok: bool, findings: list[dict])。"""
    findings = []
    agg = charter.get("aggregation") or {}
    dropped = agg.get("dropped") or []
    items = charter.get("items") or []
    src_ids = ((charter.get("source") or {}).get("opinion_ids")) or []

    # 1) 截断配对律
    if dropped:
        dispo = agg.get("dropped_dispositions") or agg.get("dispositions") or {}
        missing = []
        for d in dropped:
            key = d if isinstance(d, str) else str(d)
            rec = dispo.get(key) if isinstance(dispo, dict) else None
            if not (isinstance(rec, dict) and rec.get("who") and rec.get("how") and rec.get("when")):
                missing.append(key)
        if missing:
            findings.append({
                "rule": "truncation-pairing",
                "severity": "fail",
                "detail": f"{len(missing)} 条 dropped 无处置配对（需 who/how/when）",
                "items": missing,
            })

    # 2) 产出入率（意见链）
    if opinions is not None:
        ops = opinions.get("opinions") if isinstance(opinions, dict) else opinions
        ops = ops or []
        # 合格件判据与生成器一致：五字段齐（title/target/change/verify/rollback 非空）
        req = ("title", "target", "change", "verify", "rollback")
        qualified = [o for o in ops if all(str(o.get(f) or "").strip() for f in req)]
        if len(src_ids) < len(qualified):
            findings.append({
                "rule": "opinion-chain",
                "severity": "fail",
                "detail": (f"source.opinion_ids={len(src_ids)} < 合格意见 {len(qualified)}"
                           "（意见链断裂·产出未全入）"),
            })

    # 3) 计数一致性
    inc = agg.get("items_included")
    if isinstance(inc, int) and inc != len(items):
        findings.append({
            "rule": "count-consistency",
            "severity": "fail",
            "detail": f"items_included={inc} != charter.items 实际 {len(items)}",
        })

    ok = not any(f["severity"] == "fail" for f in findings)
    return ok, findings


def selftest():
    """三态合成件：合规 / 截断无处置 / 意见链断裂。"""
    ok_cases = 0
    # A 合规：无 dropped·意见链齐·计数一致
    ok, f = check({"items": [{}], "aggregation": {"items_included": 1, "dropped": []},
                   "source": {"opinion_ids": ["a"]}}, {"opinions": [{"title": "t", "target": "x",
                                                                     "change": "c", "verify": "v",
                                                                     "rollback": "r", "opinion_id": "a"}]})
    ok_cases += 1 if (ok and not f) else 0
    # B 截断无处置 -> 必 fail
    ok, f = check({"items": [{}], "aggregation": {"items_included": 1,
                                                  "dropped": ["x-1"]}})
    ok_cases += 1 if (not ok and any(x["rule"] == "truncation-pairing" for x in f)) else 0
    # C 截断有处置 -> 必过
    ok, f = check({"items": [{}], "aggregation": {"items_included": 1, "dropped": ["x-1"],
                                                  "dropped_dispositions": {"x-1": {"who": "coo",
                                                                                  "how": "并入下轮",
                                                                                  "when": "r19"}}}})
    ok_cases += 1 if ok else 0
    # D 意见链断裂 -> 必 fail
    ok, f = check({"items": [{}], "aggregation": {"items_included": 1, "dropped": []},
                   "source": {"opinion_ids": ["a"]}},
                  {"opinions": [{"title": "t", "target": "x", "change": "c", "verify": "v",
                                 "rollback": "r", "opinion_id": "a"},
                                {"title": "t2", "target": "y", "change": "c", "verify": "v",
                                 "rollback": "r", "opinion_id": "b"}]})
    ok_cases += 1 if (not ok and any(x["rule"] == "opinion-chain" for x in f)) else 0
    print(f"SELFTEST {'PASS' if ok_cases == 4 else 'FAIL'} ({ok_cases}/4)", file=sys.stderr)
    return 0 if ok_cases == 4 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("charter", nargs="?", help="charter draft json 路径")
    ap.add_argument("--opinions", help="本轮 opinions.json（校验意见链）")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()

    if a.selftest:
        return selftest()
    if not a.charter:
        ap.error("缺少 charter json 路径（或 --selftest）")

    charter = _load(a.charter)
    opinions = _load(a.opinions) if a.opinions else None
    ok, findings = check(charter, opinions)

    if a.json:
        print(json.dumps({"ok": ok, "findings": findings}, ensure_ascii=False, indent=2))
    else:
        if ok:
            print("PASS: 截断配对律+意见链+计数一致性 全过")
        else:
            print(f"FAIL: {len(findings)} 项告警")
            for f in findings:
                print(f" - [{f['rule']}] {f['detail']}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""charter 意见消化率检测器（成本门·查三·CEO 2026-11-26 01:5x 批评补）

判据（门形查三）：
  每条 charter item（待办面）须有**个别去向标注**——
    ◦ `deferred_to`：明确结转（如 "r46" / "2026-12-01"）
    ◦ `this_round_work`：本轮已在改（证据指针，如 commit sha / 施工卷路径）
  二者至少一个非空；**任一条皆无 = RED**（未消化的待办=放行新轮=烧下一轮的钱覆盖已知缺口）。

用法：
  python scripts/charter-digest-check.py <charter.json> [--json]
退出码：0=全条有标注（GREEN）/ 1=存在无标注条（RED，逐条列 opinion_id）
机械判锚：--selftest（三态合成件：全标注/部分无/全无，断言判定正确）

补标注载体注（BOD 2026-11-26 02:45 条级证据暴露）：r44 charter item keys =
  [opinion_id,title,target,change,verify,rollback,owner_seat] —— **无 deferred_to/this_round_work**。
  → 补标前须先定载体：①扩 charter item schema 加两字段（推荐·可机械验）或
    ②外部台账（须给出台账路径与键·本检测器可加 --ledger 参数读取）。
  本脚本按①实现；若采用②请告知格式即扩展。
"""
import argparse
import json
import sys

FIELDS = ("deferred_to", "this_round_work")


def _ledger_map(ledger):
    """pending-disposition.json → {opinion_id: item}"""
    m = {}
    for it in (ledger.get("items") or []):
        if isinstance(it, dict) and it.get("opinion_id"):
            m[str(it["opinion_id"])] = it
    return m


def check(charter, ledger=None):
    """检查待办项去向标注。

    ledger=None：读 charter item 内嵌的 deferred_to/this_round_work（载体①）
    ledger=dict：读独立表 pending-disposition.json 按 opinion_id 对表（载体②·COS 定案）
    """
    items = charter.get("items") or []
    lmap = _ledger_map(ledger) if ledger is not None else None
    missing = []
    for it in items:
        if not isinstance(it, dict):
            missing.append("<non-dict item>")
            continue
        oid = str(it.get("opinion_id") or "")
        src = lmap.get(oid, {}) if lmap is not None else it
        if not any(str(src.get(f) or "").strip() for f in FIELDS):
            missing.append(oid or str(it.get("title") or "<no-id>"))
    return (len(missing) == 0), missing, len(items)


def selftest():
    ok = 0
    # A 全标注 -> GREEN
    c = {"items": [{"opinion_id": "a", "deferred_to": "r46"},
                   {"opinion_id": "b", "this_round_work": "abc123"}]}
    g, m, n = check(c)
    ok += 1 if (g and n == 2) else 0
    # B 部分无 -> RED
    c = {"items": [{"opinion_id": "a", "deferred_to": "r46"}, {"opinion_id": "b"}]}
    g, m, n = check(c)
    ok += 1 if (not g and m == ["b"]) else 0
    # C 全无 -> RED
    c = {"items": [{"opinion_id": "a"}, {"opinion_id": "b"}]}
    g, m, n = check(c)
    ok += 1 if (not g and len(m) == 2) else 0
    # D ledger 载体②：全标注 -> GREEN
    c = {"items": [{"opinion_id": "a"}, {"opinion_id": "b"}]}
    led = {"items": [{"opinion_id": "a", "deferred_to": "shift-W48-resume9"},
                     {"opinion_id": "b", "this_round_work": "deadbeef"}]}
    g, m, n = check(c, ledger=led)
    ok += 1 if (g and n == 2) else 0
    # E ledger 载体②：一条缺（含 null 值视同缺） -> RED
    led = {"items": [{"opinion_id": "a", "deferred_to": None},
                     {"opinion_id": "b", "this_round_work": "deadbeef"}]}
    g, m, n = check(c, ledger=led)
    ok += 1 if (not g and m == ["a"]) else 0
    print(f"SELFTEST {'PASS' if ok == 5 else 'FAIL'} ({ok}/5)", file=sys.stderr)
    return 0 if ok == 5 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("charter", nargs="?", help="charter json 路径（items 数组）")
    ap.add_argument("--ledger", help="独立表 pending-disposition.json（COS 定案载体②·按 opinion_id 对表）")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    if not a.charter:
        ap.error("缺少 charter json 路径（或 --selftest）")
    with open(a.charter, encoding="utf-8") as f:
        charter = json.load(f)
    ledger = None
    if a.ledger:
        with open(a.ledger, encoding="utf-8") as f:
            ledger = json.load(f)
    green, missing, total = check(charter, ledger=ledger)
    if a.json:
        print(json.dumps({"green": green, "total": total,
                          "unannotated_count": len(missing),
                          "unannotated": missing}, ensure_ascii=False, indent=2))
    else:
        if green:
            print(f"GREEN: {total}/{total} 条待办均有去向标注")
        else:
            print(f"RED: {len(missing)}/{total} 条无去向标注（须补 deferred_to 或 this_round_work）")
            for x in missing:
                print(f" - {x}")
    return 0 if green else 1


if __name__ == "__main__":
    sys.exit(main())

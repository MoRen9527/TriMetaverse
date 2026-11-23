#!/usr/bin/env python3
"""CFO token 实测协议·cost-log 读数件（#8·token 实测协议照役）

口径（token 实测协议正身=memory token-metering-protocol）：
  - 读数源 = transcript usage 逐条汇总（Claude Code jsonl）
  - 窗级（日窗）+ turn 级（逐条 assistant usage）+ 缓存分列
  - **不折现金**（现金面以平台余额扣减为硬真值·折算不可靠=31.8× 偏差实证 2026-11-22）

机械判锚：
  - `--selftest`：对空数据输出零值且 exit 0（不报错）
  - `--day YYYY-MM-DD`：日窗汇总
  - `--runid <RID>`：runId 贯穿过滤（#16·transcript 内容含该 run id 的 session）
  - `--json`：机器可读（供上层记账面消费）

D-46：本脚本零值面打印（不输出任何 API key/凭据）；仅数值与路径。
"""
import argparse
import datetime
import glob
import json
import os
import sys

PROJECTS_DIR = os.path.join(os.path.expanduser("~"), ".claude", "projects")


def iter_usage(tpath, ts_from=None, ts_to=None):
    """逐行解析 transcript，产出 (ts, usage_dict)。

    bytes 级双层快筛（大 transcript 400MB+ 性能必需）：
      1) 行内须含 b'"usage"'  → 跳过纯文本/工具行（省 ~70% json 解析）
      2) 若给 ts_from 且其含日期前缀（前 10 字符形如 YYYY-MM-DD）→ 行内须含该日期字节串
         （timestamp 字段必含日期·跨日 session 文件的日窗精确过滤正形）
    口径注：**按 usage 记录 timestamp 过滤才是真日窗**——file mtime 筛 ≠ 内容日窗
    （session 文件跨多日延续·单文件 400MB+ 实证 2026-11-23）。
    """
    day_pref = None
    if ts_from and len(ts_from) >= 10 and ts_from[4] == "-" and ts_from[7] == "-":
        day_pref = ts_from[:10].encode()
    try:
        fh = open(tpath, "rb")
    except OSError:
        return
    with fh:
        for raw in fh:
            if b'"usage"' not in raw:
                continue
            if day_pref is not None and day_pref not in raw:
                continue
            try:
                d = json.loads(raw.decode("utf-8", "ignore"))
            except Exception:
                continue
            u = (d.get("message") or {}).get("usage") or d.get("usage")
            if not isinstance(u, dict):
                continue
            total = sum(u.get(k) or 0 for k in (
                "input_tokens", "output_tokens",
                "cache_read_input_tokens", "cache_creation_input_tokens"))
            if total <= 0:
                continue
            ts = d.get("timestamp") or ""
            if ts_from and ts and ts < ts_from:
                continue
            if ts_to and ts and ts > ts_to:
                continue
            yield ts, u


def summarize(paths, json_out=False, turn_level=False, ts_from=None, ts_to=None):
    agg = {
        "files": 0, "records": 0,
        "input_tokens": 0, "output_tokens": 0,
        "cache_read_input_tokens": 0, "cache_creation_input_tokens": 0,
    }
    turns = []
    for p in paths:
        agg["files"] += 1
        for ts, u in iter_usage(p, ts_from=ts_from, ts_to=ts_to):
            agg["records"] += 1
            for k in ("input_tokens", "output_tokens",
                      "cache_read_input_tokens", "cache_creation_input_tokens"):
                agg[k] += u.get(k) or 0
            if turn_level:
                turns.append({
                    "ts": ts,
                    "in": u.get("input_tokens") or 0,
                    "out": u.get("output_tokens") or 0,
                    "cache_read": u.get("cache_read_input_tokens") or 0,
                    "cache_create": u.get("cache_creation_input_tokens") or 0,
                })
    if json_out:
        out = dict(agg)
        if turn_level:
            out["turns"] = turns
        print(json.dumps(out, ensure_ascii=False, indent=2))
    else:
        print(f"files={agg['files']} records={agg['records']}")
        print(f"input={agg['input_tokens']} output={agg['output_tokens']} "
              f"cache_read={agg['cache_read_input_tokens']} "
              f"cache_create={agg['cache_creation_input_tokens']}")
        print("NOTE: no-cash-conversion (protocol discipline) — cash face = platform balance deduction (hard truth)")
    return agg


def health_scan(paths, ts_from=None, ts_to=None):
    """provider 健康度读数（429/500/502/503/retry 计数·COO 建议入拍报面三读数之一）。

    识别锚：transcript 行内 isApiErrorMessage=true 或内容含 'API Error'/'429'等（限错误消息对象）。
    """
    import re
    codes = {"429": 0, "500": 0, "502": 0, "503": 0, "other_err": 0, "retry_mentions": 0}
    day_pref = None
    if ts_from and len(ts_from) >= 10 and ts_from[4] == "-" and ts_from[7] == "-":
        day_pref = ts_from[:10].encode()
    for p in paths:
        try:
            fh = open(p, "rb")
        except OSError:
            continue
        with fh:
            for raw in fh:
                if b"API Error" not in raw and b"isApiErrorMessage" not in raw:
                    continue
                if day_pref is not None and day_pref not in raw:
                    continue
                hit = False
                for c in ("429", "500", "502", "503"):
                    if c.encode() in raw:
                        codes[c] += 1
                        hit = True
                        break
                if not hit:
                    codes["other_err"] += 1
                if b"retry" in raw.lower():
                    codes["retry_mentions"] += 1
    return codes


def selftest():
    """机械判锚：空数据零值 exit 0。"""
    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as fh:
        fh.write('{"message":{"usage":{"input_tokens":0,"output_tokens":0}}}\n')
        fh.write('{"not":"usage"}\n')
        tmp = fh.name
    try:
        agg = summarize([tmp], json_out=True)
        ok = agg["records"] == 0 and agg["input_tokens"] == 0
        print(f"SELFTEST {'PASS' if ok else 'FAIL'}", file=sys.stderr)
        return 0 if ok else 1
    finally:
        os.unlink(tmp)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", help="日窗 YYYY-MM-DD（默认今日）")
    ap.add_argument("--project", default="D--Code-ai-TriMetaverse",
                    help="projects 子目录名（默认本仓）")
    ap.add_argument("--runid", help="runId 过滤（全文流式匹配·大 transcript 较慢·建议以 --from/--to 代之）")
    ap.add_argument("--from", dest="ts_from", help="时间窗起（ISO·含界·如 2026-11-22T17:55:00Z）")
    ap.add_argument("--to", dest="ts_to", help="时间窗止（ISO·含界）")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--turns", action="store_true", help="含 turn 级明细")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--health", action="store_true", help="provider 健康度读数（429/500/502/503/retry 计数）")
    a = ap.parse_args()

    if a.selftest:
        return selftest()

    day = a.day or datetime.date.today().isoformat()
    d = datetime.date.fromisoformat(day)
    base = os.path.join(PROJECTS_DIR, a.project)
    paths = []
    for p in glob.glob(os.path.join(base, "*.jsonl")):
        m = datetime.date.fromtimestamp(os.path.getmtime(p))
        if m == d:
            paths.append(p)

    if a.runid:
        hits = []
        for p in paths:
            try:
                with open(p, encoding="utf-8", errors="ignore") as fh:
                    for line in fh:  # 流式早停：命中首行即收（防大 transcript 全文读超时）
                        if a.runid in line:
                            hits.append(p)
                            break
            except OSError:
                continue
        paths = hits
        print(f"runid={a.runid} matched_sessions={len(paths)}")

    if a.health:
        h = health_scan(sorted(paths), ts_from=a.ts_from, ts_to=a.ts_to)
        if a.json:
            print(json.dumps({"health": h}, ensure_ascii=False, indent=2))
        else:
            print("UNRELIABLE(word-freq heuristic): validated noise-prone 2026-11-23 — ctrl-window 429=29 with ZERO real error events; use seat-side session forensics instead")
            print("provider-health: " + " ".join(f"{k}={v}" for k, v in h.items()))
            print("NOTE: 429=concurrency-limit (official semantics, decoupled from balance) / 500-503=server-class / retry=retry mentions")
        return 0

    summarize(sorted(paths), json_out=a.json, turn_level=a.turns,
              ts_from=a.ts_from, ts_to=a.ts_to)
    return 0


if __name__ == "__main__":
    sys.exit(main())

import json, glob, os
from collections import defaultdict

# CFO 反省会定向回询①（CHO 2026-10-07 10:0x）：晚窗段拆分
# 晚窗段=北京 18:00-24:00+08 = UTC 10:00-16:00（ts[11:13] ∈ 10..15）
# 口径照旧：transcript usage 逐条汇总，去重键=(ts,in,cr,out)，窗 A 起（2026-09-30 20:44:33+08）
DIRS = [
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-board",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-ceo-chief-of-staff",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-full-stack-developer",
]
WA = '2026-09-30T12:44:33'
daily = defaultdict(int); evening = defaultdict(int); seats_eve = defaultdict(set); seats_day = defaultdict(set)
for d in DIRS:
    for f in glob.glob(os.path.join(d, '*.jsonl')):
        seat = None
        with open(f, encoding='utf-8', errors='ignore') as fh:
            for i, line in enumerate(fh):
                if i > 50: break
                if '"customTitle"' in line:
                    try: seat = json.loads(line).get('customTitle'); break
                    except Exception: pass
        seen = set()
        with open(f, encoding='utf-8', errors='ignore') as fh:
            for line in fh:
                if '"usage"' not in line: continue
                try: j = json.loads(line)
                except Exception: continue
                u = (j.get('message') or {}).get('usage') if isinstance(j.get('message'), dict) else None
                if not u: u = j.get('usage')
                ts = j.get('timestamp') or ''
                if not u or not ts or ts < WA: continue
                k = (ts, int(u.get('input_tokens') or 0), int(u.get('cache_read_input_tokens') or 0), int(u.get('output_tokens') or 0))
                if k in seen: continue
                seen.add(k)
                tot = int(u.get('input_tokens') or 0) + int(u.get('cache_creation_input_tokens') or 0) + int(u.get('cache_read_input_tokens') or 0) + int(u.get('output_tokens') or 0)
                day = ts[:10]
                daily[day] += tot; seats_day[day].add(seat or '?')
                if 10 <= int(ts[11:13]) < 16:
                    evening[day] += tot; seats_eve[day].add(seat or '?')
print('%-12s %14s %14s %7s %7s %5s' % ('day(UTC)', 'all_day', 'eve(18-24+08)', 'eve%', 'eve_h', 'day_h'))
for day in sorted(daily):
    pct = 100.0 * evening[day] / daily[day] if daily[day] else 0.0
    print('%-12s %14d %14d %6.1f%% %7d %5d' % (day, daily[day], evening[day], pct, len(seats_eve[day]), len(seats_day[day])))
tot_all = sum(daily.values()); tot_eve = sum(evening.values())
print('WINDOW: all=%d eve=%d eve_share=%.1f%%' % (tot_all, tot_eve, 100.0 * tot_eve / max(tot_all, 1)))

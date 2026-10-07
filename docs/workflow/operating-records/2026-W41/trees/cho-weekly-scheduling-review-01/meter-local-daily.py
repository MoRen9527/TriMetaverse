import json, glob, os
from collections import defaultdict

# 本机额度窗（A）日耗桶 + 每日活跃席位数（排工窗口形状证据）
DIRS = [
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-board",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-ceo-chief-of-staff",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-full-stack-developer",
]
WA = '2026-09-30T12:44:33'
daily = defaultdict(int); seats_day = defaultdict(set)
for d in DIRS:
    seat = None
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
                day = ts[:10]; daily[day] += tot; seats_day[day].add(seat or '?')
print('%-12s %14s %8s' % ('day(UTC)', 'tokens_allin', 'seats'))
for day in sorted(daily):
    print('%-12s %14d %8d' % (day, daily[day], len(seats_day[day])))
print('days=%d  avg/day=%.0f' % (len(daily), sum(daily.values()) / max(len(daily), 1)))

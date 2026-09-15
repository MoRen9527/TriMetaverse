import json, sys
from datetime import datetime, timedelta
rows = []  # (ts, in, cc, cr, out, src)
seen = set()
for line in open(sys.argv[1], encoding='utf-8', errors='ignore'):
    if '"usage"' not in line: continue
    try: j = json.loads(line)
    except Exception: continue
    u = (j.get('message') or {}).get('usage') if isinstance(j.get('message'), dict) else None
    if not u: u = j.get('usage')
    ts = j.get('timestamp') or ''
    if not u or not ts or ts < '2026-09-05': continue
    i, cc, cr, o = (int(u.get('input_tokens') or 0), int(u.get('cache_creation_input_tokens') or 0), int(u.get('cache_read_input_tokens') or 0), int(u.get('output_tokens') or 0))
    key = (ts, i, cr, o)
    if key in seen: continue
    seen.add(key)
    rows.append((ts, i, cc, cr, o, 'local'))
for line in open(sys.argv[2], encoding='utf-8', errors='ignore'):
    p = line.strip().split(',')
    if len(p) != 5: continue
    ts = p[0]; i, cc, cr, o = (int(x) for x in p[1:])
    key = (ts, i, cr, o)
    if key in seen: continue
    seen.add(key)
    rows.append((ts, i, cc, cr, o, 'sg'))
rows.sort()
tot = lambda r: r[1]+r[2]+r[3]+r[4]
allsum = sum(tot(r) for r in rows)
loc = sum(tot(r) for r in rows if r[5]=='local'); sg = sum(tot(r) for r in rows if r[5]=='sg')
print('merged rows=%d  total=%d  (local=%d sg=%d)' % (len(rows), allsum, loc, sg))
times = [datetime.strptime(r[0][:19], '%Y-%m-%dT%H:%M:%S') for r in rows]
wins = []; j0 = 0; cur = 0
for i2 in range(len(rows)):
    cur += tot(rows[i2])
    while times[i2] - times[j0] > timedelta(hours=5):
        cur -= tot(rows[j0]); j0 += 1
    wins.append((cur, j0, i2))
ws = sorted(wins, reverse=True)
w = ws[0]
sin = sum(tot(rows[k]) for k in range(w[1], w[2]+1))
sl = sum(tot(rows[k]) for k in range(w[1], w[2]+1) if rows[k][5]=='local')
ss = sin - sl
print('peak5h(merged)=%d  %s .. %s (UTC)' % (w[0], rows[w[1]][0][:19], rows[w[2]][0][:19]))
print('  in-peak: local=%d (%.1f%%)  sg=%d (%.1f%%)' % (sl, 100.0*sl/sin, ss, 100.0*ss/sin))
print('  backend-side estimate x0.584 = %d' % int(w[0]*0.584))
chosen = []
for w2 in ws:
    if all((times[w2[1]] - times[c[2]] > timedelta(hours=1)) or (times[c[1]] - times[w2[2]] > timedelta(hours=1)) for c in chosen):
        chosen.append(w2)
    if len(chosen) >= 5: break
print('top5 merged:')
for w3 in chosen:
    print('  %d  %s .. %s' % (w3[0], rows[w3[1]][0][:19], rows[w3[2]][0][:19]))

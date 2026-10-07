import json, glob, os
from collections import defaultdict

# CFO 排工反省会数据面·sg 面按席计量（跑在 sg 上，python3）
# 窗 A=额度对齐窗 2026-09-30 20:44:33 +08 起；窗 B=W41 2026-10-05 00:00 +08 起（时间戳均为 UTC 前缀比较）
WA = '2026-09-30T12:44:33'
WB = '2026-10-04T16:00:00'

def fam(m):
    m = (m or '').lower()
    if 'deepseek' in m: return 'ds'
    if 'glm' in m: return 'glm'
    return 'other' if m else 'na'

def head_meta(f):
    t = None; agent = None
    try:
        with open(f, encoding='utf-8', errors='ignore') as fh:
            for i, line in enumerate(fh):
                if i > 50: break
                if '"customTitle"' in line:
                    try: t = json.loads(line).get('customTitle') or t
                    except Exception: pass
                if '"agentName"' in line:
                    try: agent = json.loads(line).get('agentName') or agent
                    except Exception: pass
                if t and agent: break
    except Exception:
        pass
    return t, agent

agg = {}
files = glob.glob('/home/fleet/.claude/projects/**/*.jsonl', recursive=True)
for f in files:
    t, agent = head_meta(f)
    a = defaultdict(int); b = defaultdict(int); models = set(); hoursB = set(); lastA = ''; lastB = ''
    seen = set()
    try:
        fh = open(f, encoding='utf-8', errors='ignore')
    except Exception:
        continue
    with fh:
        for line in fh:
            if '"usage"' not in line: continue
            try: j = json.loads(line)
            except Exception: continue
            u = (j.get('message') or {}).get('usage') if isinstance(j.get('message'), dict) else None
            if not u: u = j.get('usage')
            ts = j.get('timestamp') or ''
            if not u or not ts: continue
            m = (j.get('message') or {}).get('model') if isinstance(j.get('message'), dict) else None
            models.add(m or 'na')
            k = (ts, int(u.get('input_tokens') or 0), int(u.get('cache_read_input_tokens') or 0), int(u.get('output_tokens') or 0))
            if k in seen: continue
            seen.add(k)
            i_ = int(u.get('input_tokens') or 0); cc = int(u.get('cache_creation_input_tokens') or 0)
            cr = int(u.get('cache_read_input_tokens') or 0); o = int(u.get('output_tokens') or 0)
            if ts >= WA:
                a['rows'] += 1; a[fam(m)] += i_ + cc + cr + o; a['in'] += i_; a['cr'] += cr; a['o'] += o
                if ts > lastA: lastA = ts
                if ts >= WB:
                    b['rows'] += 1; b['tot'] += i_ + cc + cr + o
                    hoursB.add(ts[:13])
                    if ts > lastB: lastB = ts
    if a['rows'] or b['rows']:
        agg[(t or agent or os.path.basename(f)[:-6]) + '|' + os.path.basename(f)[:8]] = dict(
            proj='/'.join(f.split('/')[4:6]), models=','.join(sorted(x or 'na' for x in models)),
            rowsA=a['rows'], glmA=a['glm'], dsA=a['ds'], othA=a['other'] + a['na'],
            inA=a['in'], crA=a['cr'], outA=a['o'], lastA=lastA,
            rowsB=b['rows'], totB=b['tot'], hoursB=len(hoursB), lastB=lastB)

tot = defaultdict(int)
print('%-24s %-28s %12s %12s %12s %6s %4s %19s' % ('seat', 'models', 'A_tot', 'A_glm', 'A_ds', 'hB', 'rowsB', 'lastA(UTC)'))
for k, v in sorted(agg.items(), key=lambda kv: -(kv[1]['glmA'] + kv[1]['dsA'] + kv[1]['othA'])):
    tA = v['glmA'] + v['dsA'] + v['othA']
    tot['A'] += tA; tot['glm'] += v['glmA']; tot['ds'] += v['dsA']; tot['oth'] += v['othA']
    tot['in'] += v['inA']; tot['cr'] += v['crA']; tot['o'] += v['outA']; tot['B'] += v['totB']; tot['rowsB'] += v['rowsB']
    print('%-24s %-28s %12d %12d %12d %6d %4d %19s' % (
        k.split('|')[0][:24], v['models'][:28], tA, v['glmA'], v['dsA'], v['hoursB'], v['rowsB'], v['lastA'][:19]))
print('files=%d  TOTAL A=%d (glm=%d ds=%d oth=%d)  B(W41)=%d rowsB=%d' % (len(files), tot['A'], tot['glm'], tot['ds'], tot['oth'], tot['B'], tot['rowsB']))
print('A cols: in=%d cr=%d out=%d' % (tot['in'], tot['cr'], tot['o']))

import json, glob, os
from collections import defaultdict

# CFO 排工反省会数据面·本机按席计量（2026-10-07）
# 口径：transcript usage 逐条汇总（token-metering 协议）；窗内去重键=(ts,in,cr,out)
# 窗 A=额度对齐窗 2026-09-30 20:44:33 +08 起（bigmodel v2 七天窗，重置日历 W39 闸5卷 b831145e）
# 窗 B=W41 日历周 2026-10-05 00:00 +08 起
DIRS = [
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-board",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-ceo-chief-of-staff",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-full-stack-developer",
]
WA = '2026-09-30T12:44:33'
WB = '2026-10-04T16:00:00'

def fam(m):
    m = (m or '').lower()
    if 'deepseek' in m: return 'ds'
    if 'glm' in m: return 'glm'
    return 'other' if m else 'na'

def head_meta(f):
    t = None; agent = None
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
    return t, agent

agg = {}
for d in DIRS:
    for f in glob.glob(os.path.join(d, '*.jsonl')):
        t, agent = head_meta(f)
        key = t or agent or os.path.basename(f)[:-6]
        a = defaultdict(int); b = defaultdict(int); models = set(); hoursB = set(); lastA = ''; lastB = ''
        seen = set()
        with open(f, encoding='utf-8', errors='ignore') as fh:
            for line in fh:
                if '"usage"' not in line: continue
                try: j = json.loads(line)
                except Exception: continue
                u = (j.get('message') or {}).get('usage') if isinstance(j.get('message'), dict) else None
                if not u: u = j.get('usage')
                ts = j.get('timestamp') or ''
                if not u or not ts: continue
                m = (j.get('message') or {}).get('model') if isinstance(j.get('message'), dict) else None
                if m: models.add(m)
                k = (ts, int(u.get('input_tokens') or 0), int(u.get('cache_read_input_tokens') or 0), int(u.get('output_tokens') or 0))
                if k in seen: continue
                seen.add(k)
                i_ = int(u.get('input_tokens') or 0); cc = int(u.get('cache_creation_input_tokens') or 0)
                cr = int(u.get('cache_read_input_tokens') or 0); o = int(u.get('output_tokens') or 0)
                if ts >= WA:
                    a['rows'] += 1; a['in'] += i_; a['cc'] += cc; a['cr'] += cr; a['o'] += o
                    a['f_' + fam(m)] += i_ + cc + cr + o
                    if ts > lastA: lastA = ts
                    if ts >= WB:
                        b['rows'] += 1; b['in'] += i_; b['cc'] += cc; b['cr'] += cr; b['o'] += o
                        hoursB.add(ts[:13])
                        if ts > lastB: lastB = ts
        if a['rows'] or b['rows']:
            agg[key + '|' + os.path.basename(f)[:8]] = dict(
                dir=os.path.basename(d).replace('D--Code-ai-TriMetaverse', 'TMV'), agent=agent, title=t,
                models=','.join(sorted(models)),
                rowsA=a['rows'], inA=a['in'], ccA=a['cc'], crA=a['cr'], outA=a['o'], lastA=lastA,
                glmA=a['f_glm'], dsA=a['f_ds'], othA=a['f_other'] + a['f_na'],
                rowsB=b['rows'], inB=b['in'], ccB=b['cc'], crB=b['cr'], outB=b['o'], lastB=lastB, hoursB=len(hoursB))

tot = defaultdict(int)
print('%-22s %-6s %13s %12s %12s %12s %13s %7s %5s %19s' % ('seat', 'dir', 'A_tot', 'A_glm', 'A_ds', 'A_oth', 'B_tot', 'hB', 'rowsB', 'lastA(UTC)'))
for k, v in sorted(agg.items(), key=lambda kv: -(kv[1]['inA'] + kv[1]['ccA'] + kv[1]['crA'] + kv[1]['outA'])):
    tA = v['inA'] + v['ccA'] + v['crA'] + v['outA']; tB = v['inB'] + v['ccB'] + v['crB'] + v['outB']
    tot['A'] += tA; tot['B'] += tB; tot['inA'] += v['inA']; tot['ccA'] += v['ccA']; tot['crA'] += v['crA']; tot['outA'] += v['outA']
    tot['glm'] += v['glmA']; tot['ds'] += v['dsA']; tot['oth'] += v['othA']; tot['rowsB'] += v['rowsB']
    print('%-22s %-6s %13d %12d %12d %12d %13d %7d %5d %19s' % (
        k.split('|')[0], v['dir'][-5:], tA, v['glmA'], v['dsA'], v['othA'], tB, v['hoursB'], v['rowsB'], v['lastA'][:19]))
print('TOTAL A=%d (glm=%d ds=%d oth=%d)  B(W41)=%d  rowsB=%d' % (tot['A'], tot['glm'], tot['ds'], tot['oth'], tot['B'], tot['rowsB']))
print('A cols: in=%d cc=%d cr=%d out=%d | cacheR share=%.1f%%' % (tot['inA'], tot['ccA'], tot['crA'], tot['outA'], 100.0 * tot['crA'] / max(tot['A'], 1)))

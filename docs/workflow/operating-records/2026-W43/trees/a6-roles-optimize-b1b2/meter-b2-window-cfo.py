# B2 窗毕 CFO 自耗读数扫描器（FADE-PERF-001 试点·窗包络分段）
# 口径: transcript usage 逐条汇总·UTC 时戳·原始 token 量纲不折现金·席内纵向禁跨席直比
# 窗包络: 2026-10-22 18:00:00 +0800 -> 2026-10-24 18:00:00 +0800 = UTC [10-22T10:00:00, 10-24T10:00:00)
# 验法: 本脚本落树可复勘；逐条去重键=(ts,in,cc,cr,out) 同 meter-local-daily.py 口径
import json, glob, os
from collections import defaultdict

DIRS = [
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-board",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-ceo-chief-of-staff",
    r"C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-full-stack-developer",
]
W0, W1 = '2026-10-22T10:00:00', '2026-10-24T10:00:00'  # UTC
MTIME_MIN = 1761052800  # 2025-10-21 ~ epoch guard: keep files touched in window era (2026-10-22+ = much larger; use loose floor)

# ---- pass 1: seat attribution (first 50 lines customTitle) ----
seat_of = {}
for d in DIRS:
    for f in glob.glob(os.path.join(d, '*.jsonl')):
        seat = None
        try:
            with open(f, encoding='utf-8', errors='ignore') as fh:
                for i, line in enumerate(fh):
                    if i > 50: break
                    if '"customTitle"' in line:
                        try:
                            seat = json.loads(line).get('customTitle')
                            break
                        except Exception:
                            pass
        except Exception:
            continue
        seat_of[f] = seat or '?'

cfo_files = [f for f, s in seat_of.items() if 'cfo' in (s or '').lower()]
print('=== CFO 席文件（customTitle 含 cfo，不区分大小写）: %d 个 ===' % len(cfo_files))
for f in cfo_files:
    print('  %s | %s' % (seat_of[f], os.path.basename(f)))

# ---- pass 2: B2 window usage, CFO files only ----
by_model = defaultdict(lambda: [0, 0, 0, 0])  # in, cc, cr, out
n_entries = 0
for f in cfo_files:
    seen = set()
    try:
        with open(f, encoding='utf-8', errors='ignore') as fh:
            for line in fh:
                if '"usage"' not in line: continue
                try: j = json.loads(line)
                except Exception: continue
                msg = j.get('message') if isinstance(j.get('message'), dict) else {}
                u = (msg or {}).get('usage') or j.get('usage')
                ts = j.get('timestamp') or ''
                if not u or not ts: continue
                if not (W0 <= ts[:19] < W1): continue
                i_ = int(u.get('input_tokens') or 0); cc = int(u.get('cache_creation_input_tokens') or 0)
                cr = int(u.get('cache_read_input_tokens') or 0); o_ = int(u.get('output_tokens') or 0)
                k = (ts, i_, cc, cr, o_)
                if k in seen: continue
                seen.add(k)
                model = (msg or {}).get('model') or j.get('model') or '?'
                m = by_model[model]; m[0] += i_; m[1] += cc; m[2] += cr; m[3] += o_
                n_entries += 1
    except Exception as e:
        print('  [read-skip] %s: %s' % (os.path.basename(f), e))

print('\n=== B2 窗包络内 CFO 席消耗（UTC %s ~ %s）·逐条去重后 %d 条 ===' % (W0, W1, n_entries))
print('%-40s %14s %12s %16s %12s %14s' % ('model', 'in', 'cacheC', 'cacheR', 'out', 'total'))
gt = [0, 0, 0, 0]
for model in sorted(by_model):
    i_, cc, cr, o_ = by_model[model]
    gt = [gt[0]+i_, gt[1]+cc, gt[2]+cr, gt[3]+o_]
    print('%-40s %14d %12d %16d %12d %14d' % (model, i_, cc, cr, o_, i_+cc+cr+o_))
print('%-40s %14d %12d %16d %12d %14d' % ('TOTAL(4 元键: CFO席/bigmodel/sg-glm-direct)', gt[0], gt[1], gt[2], gt[3], sum(gt)))

# ---- pass 3: anchor raw line (bounded: mtime recent, all dirs) ----
import time
now = time.time()
daily = defaultdict(int); seats_day = defaultdict(set)
for d in DIRS:
    for f in glob.glob(os.path.join(d, '*.jsonl')):
        try:
            if now - os.path.getmtime(f) > 6*86400: continue  # 近 6 天 mtime 界（有界快扫替代·全量扫超时候优化）
        except Exception:
            continue
        seat = seat_of.get(f, '?')
        seen = set()
        try:
            with open(f, encoding='utf-8', errors='ignore') as fh:
                for line in fh:
                    if '"usage"' not in line: continue
                    try: j = json.loads(line)
                    except Exception: continue
                    msg = j.get('message') if isinstance(j.get('message'), dict) else {}
                    u = (msg or {}).get('usage') or j.get('usage')
                    ts = j.get('timestamp') or ''
                    if not u or not ts or ts < '2026-10-22': continue
                    i_ = int(u.get('input_tokens') or 0); cc = int(u.get('cache_creation_input_tokens') or 0)
                    cr = int(u.get('cache_read_input_tokens') or 0); o_ = int(u.get('output_tokens') or 0)
                    k = (ts, i_, cc, cr, o_)
                    if k in seen: continue
                    seen.add(k)
                    daily[ts[:10]] += i_ + cc + cr + o_
                    seats_day[ts[:10]].add(seat)
        except Exception:
            continue
print('\n=== 近界日桶（UTC·近 6 天 mtime 界快扫·锚 ⑤ 替代形） ===')
print('%-12s %14s %8s' % ('day(UTC)', 'tokens_allin', 'seats'))
for day in sorted(daily):
    print('%-12s %14d %8d' % (day, daily[day], len(seats_day[day])))

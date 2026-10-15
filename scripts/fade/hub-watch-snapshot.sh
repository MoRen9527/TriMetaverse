#!/bin/bash
# hub-watch-snapshot v1 —— LG-082 件①试点（CEO 23:03 批·CTO 评估卷 d54b65f43 形态）
# 10min 节律拍中枢读数 → /srv/fleet/var/hub-watch/（非 git 区·bod-progress-snapshot 治理注继承）
# 判下沉=D-55 ①层程序判·armed 门形；告警走 TriMMC outbox 现役链；文案纯读数陈述零定性
# 判据修正（活体现探 2026-10-15）：m-duty-cos 箱 urgent 277/281=98.6% 常态化——绝对阈废弃，
#   主判据=unread 10min 增量≥5（armed 基线比对）；告警后基线前移防同波重复告警。
# 值面纪律 D-46：token 从 /srv/fleet/TriMMC/docker/.env 读入，零硬编码零打印。
set -u
DATA_DIR=/srv/fleet/var/hub-watch
ENVF=/srv/fleet/TriMMC/docker/.env
MAILBOX=/srv/fleet/TriMMC/notify-mailbox.json
WATCHLIST=/srv/fleet/TriMetaverse/docs/workflow/hub-state/watchlist.json
TS=$(date -u +%FT%TZ)
mkdir -p "$DATA_DIR"
python3.8 - "$TS" "$DATA_DIR" "$MAILBOX" "$WATCHLIST" "$ENVF" <<'PYEOF'
import json, os, sys, subprocess, urllib.request
ts, data_dir, mailbox, wl_path, envf = sys.argv[1:6]

def jload(p):
    try:
        return json.load(open(p))
    except Exception:
        return None

# ── ① mailbox 投影（元数据面·零 body 零 title）──
doc = jload(mailbox) or {}
letters = doc.get('letters', []) if isinstance(doc, dict) else []
seats = {}
for m in letters:
    s = m.get('target_seat', '?')
    e = seats.setdefault(s, {'unread': 0, 'urgent_unread': 0})
    if not m.get('read'):
        e['unread'] += 1
        if str(m.get('urgent', '')).lower() == 'urgent':
            e['urgent_unread'] += 1
total_unread = sum(e['unread'] for e in seats.values())
last = letters[-1] if letters else {}
snap = {
    'ts': ts,
    'mailbox': {
        'letters_total': len(letters),
        'unread_total': total_unread,
        'urgent_unread_total': sum(e['urgent_unread'] for e in seats.values()),
        'per_seat': seats,
        'latest_message_id': last.get('message_id'),
        'latest_received_at': last.get('received_at'),
    },
    'watchlist': {'count': len(jload(wl_path) or [])},
    'healthz': None,
    'git_heads': {},
}
# ── ② healthz ──
try:
    snap['healthz'] = json.load(urllib.request.urlopen('http://127.0.0.1:8712/healthz', timeout=5))
except Exception as e:
    snap['healthz'] = {'error': str(e)[:80]}
# ── ③ git 顶（短 hash）──
for name, rp in [('TriMetaverse', '/srv/fleet/TriMetaverse'), ('TriCompany', '/srv/fleet/TriCompany')]:
    try:
        snap['git_heads'][name] = subprocess.run(
            ['git', '-C', rp, 'rev-parse', '--short', 'HEAD'],
            capture_output=True, text=True, timeout=10).stdout.strip() or None
    except Exception:
        snap['git_heads'][name] = None
# ── ④ 落盘：jsonl 追加 + latest 原子覆盖（tmp+rename·outbox 同族正形）──
with open(os.path.join(data_dir, 'hub-snapshot.jsonl'), 'a') as f:
    f.write(json.dumps(snap, ensure_ascii=False) + '\n')
tmp = os.path.join(data_dir, '.latest.tmp')
with open(tmp, 'w') as f:
    json.dump(snap, f, ensure_ascii=False, indent=1)
os.replace(tmp, os.path.join(data_dir, 'latest.json'))

# ── ⑤ 判（D-55 ①层程序判·armed 门形）──
armed_f = os.path.join(data_dir, '.armed')
base_f = os.path.join(data_dir, 'baseline.json')
UNREAD_INC = 5
prev = jload(base_f) or {}
if not os.path.exists(armed_f):
    with open(base_f, 'w') as f:
        json.dump({'ts': ts, 'unread_total': total_unread}, f)
    with open(armed_f, 'w') as f:
        f.write(ts)
    print('armed: baseline set, no alert')
elif prev and total_unread - prev.get('unread_total', 0) >= UNREAD_INC:
    inc = total_unread - prev.get('unread_total', 0)
    tok = ''
    try:
        for line in open(envf):
            if line.startswith('TRIMC_INTERNAL_TOKEN='):
                tok = line.split('=', 1)[1].strip()
    except Exception:
        pass
    msg = {
        'source_seat': 'bod',  # 白名单权宜（daemon 席未入 source 册·候窗补录 'hub-watch' 照 trirlc-conn 先例）
        'target_daemon': 'trimlc',
        'target_seat': 'm-coo',
        'urgent': 'normal',
        'title': 'hub-watch: unread +%d/10min' % inc,
        'body': 'm-duty-cos 箱 unread %d->%d（增量判据>=%d·ts %s）——读数陈述非定性；'
                'BOD/COS 补读=/srv/fleet/var/hub-watch/latest.json' % (prev.get('unread_total', 0), total_unread, UNREAD_INC, ts),
    }
    req = urllib.request.Request(
        'http://127.0.0.1:8712/internal/v1/notify',
        data=json.dumps(msg).encode(),
        headers={'Content-Type': 'application/json', 'X-Internal-Token': tok})
    try:
        r = urllib.request.urlopen(req, timeout=5)
        print('alert posted:', r.status)
    except Exception as e:
        print('alert post failed:', str(e)[:100])
    with open(base_f, 'w') as f:
        json.dump({'ts': ts, 'unread_total': total_unread}, f)
else:
    print('ok unread_total=%d armed' % total_unread)
PYEOF
echo "$TS hub-watch run done"

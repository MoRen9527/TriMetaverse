import json, glob
seen = set()
out = []
for f in glob.glob('/home/fleet/.claude/projects/**/*.jsonl', recursive=True):
    for line in open(f, encoding='utf-8', errors='ignore'):
        if '"usage"' not in line: continue
        try: j = json.loads(line)
        except Exception: continue
        u = (j.get('message') or {}).get('usage') if isinstance(j.get('message'), dict) else None
        if not u: u = j.get('usage')
        ts = j.get('timestamp') or ''
        if not u or not ts or ts < '2026-09-05': continue
        key = (ts, int(u.get('input_tokens') or 0), int(u.get('cache_read_input_tokens') or 0), int(u.get('output_tokens') or 0))
        if key in seen: continue
        seen.add(key)
        out.append('%s,%d,%d,%d,%d' % (ts[:19], int(u.get('input_tokens') or 0), int(u.get('cache_creation_input_tokens') or 0), int(u.get('cache_read_input_tokens') or 0), int(u.get('output_tokens') or 0)))
out.sort()
print('\n'.join(out))

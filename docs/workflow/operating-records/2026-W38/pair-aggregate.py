# 13 席聚合：双源分叉段/hub 独有段/重复段
import sys, re
sys.stdout.reconfigure(encoding='utf-8')
raw = open('D:/Code/ai/TriMetaverse/docs/workflow/operating-records/2026-W38/.pair-raw.txt', encoding='utf-8').read()
blocks = raw.split('=' * 70)
seats = {}
i = 0
while i < len(blocks):
    b = blocks[i]
    m = re.search(r'SEAT: ([\w-]+)', b)
    if m:
        seat = m.group(1)
        seg_count = re.search(r'agents件段数=(\d+) hub件段数=(\d+)', blocks[i+1] if i+1 < len(blocks) else '')
        body = blocks[i+1] if i+1 < len(blocks) else ''
        seats[seat] = body
    i += 1

print(f"{'seat':<32} {'agents':>6} {'hub':>4} | 分叉段(agent-body=0) | hub独有段数")
print('-' * 100)
for seat, body in seats.items():
    m = re.search(r'agents件段数=(\d+) hub件段数=(\d+)', body)
    a_n, h_n_num = (m.group(1), m.group(2)) if m else ('?', '?')
    # 分叉段：行含 full-stack-developer=2 但 agent-body=0
    forks = []
    for line in body.split('\n'):
        if 'agent-body=0' in line and re.search(r'[\w-]+\d?=[1-9]', line.split('|')[1] if '|' in line else ''):
            t = re.search(r'## (.+?)\s+hub=', line)
            if t: forks.append(t.group(1).strip())
    # hub 独有段
    hub_lines = []
    in_hub = False
    for line in body.split('\n'):
        if 'hub 件独有段' in line: in_hub = True; continue
        if in_hub and line.strip().startswith('['):
            hub_lines.append(line.strip())
    print(f"{seat:<32} {a_n:>6} {h_n_num:>4} | {len(forks)} 段 {('(' + ', '.join(f[:14] for f in forks) + ')') if forks else ''}")
    # hub 独有段打印
    for hl in hub_lines:
        print(f"        HUB: {hl[:88]}")

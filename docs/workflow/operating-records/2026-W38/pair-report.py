# LG-035 一期③: 13对文件去重对照 — 段级素材生成（试点 2 席）
import re, subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')

TM = 'D:/Code/ai/TriMetaverse'
TC = 'D:/Code/ai/TriCompany/source-agents'

def sections(path):
    """Return [(title, start, end)] for ## sections."""
    lines = open(path, encoding='utf-8').read().split('\n')
    hs = [(i, l) for i, l in enumerate(lines) if l.startswith('## ')]
    out = []
    for idx, (i, l) in enumerate(hs):
        end = hs[idx+1][0]-1 if idx+1 < len(hs) else len(lines)-1
        out.append((l.strip(), i+1, end+1))
    return out, lines

def first_content(lines, s, e, n=2):
    """First non-empty, non-heading lines in range."""
    picked = []
    for i in range(s, min(e, len(lines))):
        t = lines[i].strip()
        if t and not t.startswith('#') and not t.startswith('>'):
            picked.append(t)
            if len(picked) >= n: break
    return picked

def probe(needles, files):
    """For each needle, count hits per file."""
    res = {}
    for f in files:
        try:
            txt = open(f, encoding='utf-8').read()
        except FileNotFoundError:
            res[f] = -1
            continue
        res[f] = sum(1 for n in needles if n[:24] and n[:24] in txt)
    return res

SEATS = ['ceo-chief-of-staff', 'chief-administrative-officer', 'chief-financial-officer',
         'chief-human-resources-officer', 'chief-marketing-officer', 'chief-operating-officer',
         'chief-product-officer', 'chief-technology-officer', 'customer-success-officer',
         'deployment-engineer', 'full-stack-developer', 'rd-trainer', 'senior-test-engineer']
for seat in SEATS:
    agents = f'{TM}/.claude/agents/{seat}.md'
    hub = f'{TM}/.claude/hub/{seat}.session.md'
    src_dir = f'{TC}/{seat}'
    print(f"\n{'='*70}\nSEAT: {seat}\n{'='*70}")
    a_secs, a_lines = sections(agents)
    h_secs, h_lines = sections(hub)
    h_titles = {t for t, _, _ in h_secs}
    src_files = [f'{src_dir}/agent-body.agent.md', f'{src_dir}/{seat}.agent.md',
                 f'{src_dir}/session-body.agent.md', f'{src_dir}/agent-frontmatter.agent.md']
    print(f"agents件段数={len(a_secs)} hub件段数={len(h_secs)}")
    print(f"\n--- agents 件段清单（含 hub 是否同现+源侧命中）---")
    for title, s, e in a_secs:
        needles = first_content(a_lines, s, e, 2)
        hits = probe(needles, src_files)
        hub_has = '✓' if title in h_titles else '✗'
        hitstr = ' '.join(f"{os.path.basename(f).split('.')[0]}={v}" for f, v in hits.items())
        print(f"  [{s:>3}-{e:>3}] {title[:38]:<40} hub={hub_has} | {hitstr}")
    print(f"\n--- hub 件独有段（不在 agents）---")
    a_titles = {t for t, _, _ in a_secs}
    for title, s, e in h_secs:
        if title not in a_titles:
            print(f"  [{s:>3}-{e:>3}] {title[:60]}")

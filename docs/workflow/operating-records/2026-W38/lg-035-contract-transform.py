#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LG-035 合同瘦身变换引擎（夜航窗执行件；裁定=W38/lg-035-contract-slim-ruling.md）

Steps（--step 选择；默认 dry-run 只打印，--execute 落盘）：
  TC-A  13 席 agent-body 内容收敛（35 缺段迁入+13 段差判向合并+序对齐 composite）
  TC-B  13 席 agent-frontmatter 填实（复合件 frontmatter 迁入）
  TC-C  前置核查迁移（agent-body 段→一行指针；原清单迁入 session-body 新节）
  TC-D  M-001 席内版删（CEO/CHO session-body「M-001，五字段」段删除）
  TC-E  manifest 切源 13 条（source→agent-body 路径）

用法：python lg-035-contract-transform.py --step TC-A [--execute]
"""
import argparse
import re
import sys
from pathlib import Path

SRC = Path('D:/Code/ai/TriCompany/source-agents')
SEATS = ['ceo-chief-of-staff', 'chief-administrative-officer', 'chief-financial-officer',
         'chief-human-resources-officer', 'chief-marketing-officer', 'chief-operating-officer',
         'chief-product-officer', 'chief-technology-officer', 'customer-success-officer',
         'deployment-engineer', 'full-stack-developer', 'rd-trainer', 'senior-test-engineer']
# Type C（composite 新刊胜，整体取 composite 版）：FSD/STE 核心职责（CodeGraph 第 8 条）
TYPE_C = {('full-stack-developer', '## 核心职责'), ('senior-test-engineer', '## 核心职责')}
SEC_RE = re.compile(r'(?m)^(## .+)$')


def split_fm(text: str):
    if text.startswith('---'):
        end = text.find('\n---', 3)
        return text[:end + 4], text[end + 4:]
    return '', text


def section_spans(body: str):
    """head -> (start, end)：start='## Head' 起，end=下一 '## ' 起或文末。"""
    matches = list(SEC_RE.finditer(body))
    spans = {}
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        spans[m.group(1).strip()] = (m.start(), end)
    return spans


def parse_sections(body: str):
    """Return list of (header, content) preserving order; content verbatim-ish (stripped)."""
    parts = SEC_RE.split(body)
    out = []
    i = 1
    while i < len(parts):
        head = parts[i].strip()
        content = (parts[i + 1] if i + 1 < len(parts) else '').strip('\n').strip()
        out.append((head, content))
        i += 2
    return out


def render_sections(sections):
    return '\n\n'.join(f'{h}\n\n{c}' if c else h for h, c in sections) + '\n'


def tc_a(seat: str, execute: bool):
    comp_p = SRC / seat / f'{seat}.agent.md'
    ab_p = SRC / seat / 'agent-body.agent.md'
    comp = comp_p.read_text(encoding='utf-8')
    ab = ab_p.read_text(encoding='utf-8')
    comp_fm, comp_body = split_fm(comp)
    ab_fm, ab_body = split_fm(ab)
    comp_spans = section_spans(comp_body)
    ab_spans = section_spans(ab_body)
    # composite 基底（含前导段+全段）→ A/B 型段逆序替换为 agent-body 原文段
    repl = [h for h in comp_spans if h in ab_spans and (seat, h) not in TYPE_C]
    ported = len([h for h in comp_spans if h not in ab_spans])
    type_c = len([h for h in comp_spans if h in ab_spans and (seat, h) in TYPE_C])
    merged_body = comp_body
    for head in reversed(repl):
        cs, ce = comp_spans[head]
        as_, ae = ab_spans[head]
        merged_body = merged_body[:cs] + ab_body[as_:ae] + merged_body[ce:]
    new_text = (ab_fm + '\n' if ab_fm else '') + merged_body
    if not new_text.endswith('\n'):
        new_text += '\n'
    changed = new_text != ab
    print(f'[TC-A] {seat}: ported={ported} replaced={len(repl)} typeC={type_c} changed={changed}')
    if execute and changed:
        ab_p.write_text(new_text, encoding='utf-8', newline='\n')


def tc_b(seat: str, execute: bool):
    comp = (SRC / seat / f'{seat}.agent.md').read_text(encoding='utf-8')
    fm, _ = split_fm(comp)
    af_p = SRC / seat / 'agent-frontmatter.agent.md'
    cur = af_p.read_text(encoding='utf-8')
    cur_fm, _ = split_fm(cur) if cur.strip() != '---' else ('', '')
    # 目标：取复合件 frontmatter 全块（含首尾 ---）
    fm_block = fm if fm.endswith('\n') else fm + '\n'
    changed = cur.replace('\r\n', '\n').strip() != fm_block.strip()
    print(f'[TC-B] {seat}: frontmatter_fill changed={changed}')
    if execute and changed:
        af_p.write_text(fm_block, encoding='utf-8', newline='\n')


def tc_c(seat: str, execute: bool):
    ab_p = SRC / seat / 'agent-body.agent.md'
    sb_p = SRC / seat / 'session-body.agent.md'
    ab = ab_p.read_text(encoding='utf-8')
    m = re.search(r'(?ms)^## 固定前置核查\n(.*?)(?=^## |\Z)', ab)
    if not m:
        print(f'[TC-C] {seat}: 固定前置核查 section NOT FOUND — skip'); return
    original = m.group(1).strip()
    if 'compass 手册' in original:
        print(f'[TC-C] {seat}: already migrated'); return
    pointer = '开工前按序核查清单 → 见 compass 手册〈开工前置核查〉节（真源文档路径与顺序随手册发布更新）。'
    new_ab = ab[:m.start(1)] + '\n\n' + pointer + '\n\n' + ab[m.end():]
    sb = sb_p.read_text(encoding='utf-8')
    add = f'\n## 开工前置核查\n\n{original}\n'
    print(f'[TC-C] {seat}: slim {len(original.splitlines())} lines → 1 line; session-body +{len(original.splitlines())} lines')
    if execute:
        ab_p.write_text(new_ab, encoding='utf-8', newline='\n')
        sb_p.write_text(sb.rstrip('\n') + '\n' + add, encoding='utf-8', newline='\n')


def tc_d(execute: bool):
    for seat in ['ceo-chief-of-staff', 'chief-human-resources-officer']:
        sb_p = SRC / seat / 'session-body.agent.md'
        sb = sb_p.read_text(encoding='utf-8')
        m = re.search(r'(?ms)^## 状态条机械合同（M-001，五字段）\n.*?(?=^## |\Z)', sb)
        if not m:
            print(f'[TC-D] {seat}: in-seat M-001 NOT FOUND — check'); continue
        new = sb[:m.start()] + sb[m.end():]
        print(f'[TC-D] {seat}: in-seat M-001 removed ({len(m.group(0).splitlines())} lines)')
        if execute:
            sb_p.write_text(new, encoding='utf-8', newline='\n')


def tc_e(execute: bool):
    import json
    mp = SRC / 'registries' / 'trimetaverse-live-agent-publish-manifest.json'
    m = json.loads(mp.read_text(encoding='utf-8'))
    n = 0
    for e in m.get('liveEntries', []):
        src = e.get('source', '')
        for seat in SEATS:
            if src.endswith(f'source-agents/{seat}/{seat}.agent.md'):
                e['source'] = f'TriCompany/source-agents/{seat}/agent-body.agent.md'
                n += 1
                print(f'[TC-E] {seat}: source → agent-body.agent.md')
    if execute and n:
        mp.write_text(json.dumps(m, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(f'[TC-E] total switched: {n}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--step', required=True, choices=['TC-A', 'TC-B', 'TC-C', 'TC-D', 'TC-E', 'ALL'])
    ap.add_argument('--execute', action='store_true')
    a = ap.parse_args()
    mode = 'EXECUTE' if a.execute else 'DRY-RUN'
    print(f'=== {a.step} [{mode}] ===')
    steps = ['TC-A', 'TC-B', 'TC-C', 'TC-D', 'TC-E'] if a.step == 'ALL' else [a.step]
    for s in steps:
        if s == 'TC-A':
            for seat in SEATS: tc_a(seat, a.execute)
        elif s == 'TC-B':
            for seat in SEATS: tc_b(seat, a.execute)
        elif s == 'TC-C':
            for seat in SEATS: tc_c(seat, a.execute)
        elif s == 'TC-D':
            tc_d(a.execute)
        elif s == 'TC-E':
            tc_e(a.execute)
    print('=== done ===')


if __name__ == '__main__':
    main()

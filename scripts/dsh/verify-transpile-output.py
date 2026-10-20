#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify-transpile-output.py · v1 — 转译产物独立对表核验
方法：从【产物文件】反向提取每席 prefix/suffix 文本 → 与【源侧独立重算】的段拼接文本逐席比对
      + 结构断言（13 preset id/persona 行计数/版本头注/insert 形）
独立重测精神：核验器不复用转译器的 emitter——反向解析产物文本为独立实现
"""
import hashlib
import importlib.util
import os
import re
import sys

# 转译器文件名含连字符（非合法模块名）→ importlib 按路径动态加载（main 仅 __main__ 执行·载入零副作用）
_spec = importlib.util.spec_from_file_location(
    "tdp", os.path.join(os.path.dirname(os.path.abspath(__file__)), "transpile-dsh-personas.py"))
_tdp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_tdp)
SEAT_MAP, parse_body, classify, join_segments = (_tdp.SEAT_MAP, _tdp.parse_body,
                                                 _tdp.classify, _tdp.join_segments)


def sha(t):
    return hashlib.sha256(t.encode("utf-8")).hexdigest()[:16]


def extract_block(lines, start, indent):
    """从 start 行（`key: |`）向下取 block literal 文本（缩进>indent 的行）。"""
    out = []
    for l in lines[start + 1:]:
        if l.strip() == "":
            out.append("")
            continue
        cur = len(l) - len(l.lstrip(" "))
        if cur < indent:
            break
        out.append(l[indent:])
    while out and out[-1] == "":
        out.pop()
    return "\n".join(out) + "\n"


def extract_seat(text, seat):
    """从产物文本反向提取该席 preset 的 (prefix, suffix)。"""
    m = re.search(r"^  - id: preset-%s\s*$" % re.escape(seat), text, re.M)
    if not m:
        raise AssertionError("产物中未见 preset-%s" % seat)
    seg = text[m.start():]
    nxt = re.search(r"^  - id: preset-", seg[10:], re.M)
    seg = seg[:nxt.start() + 10] if nxt else seg
    lines = seg.splitlines()
    pi = next(i for i, l in enumerate(lines) if l.startswith("            prefix: |"))
    si = next(i for i, l in enumerate(lines) if l.startswith("            suffix: |"))
    return extract_block(lines, pi, 14), extract_block(lines, si, 14)


def main():
    out_dir, source_root = sys.argv[1], sys.argv[2]
    text = open(os.path.join(out_dir, "cordis.patch.13seat.yml"), encoding="utf-8").read()

    # 结构断言
    assert text.startswith("# " + "=" * 68), "头注形异"
    assert "transpiler: v2" in text and "dsh: 0.2.0-rc.2" in text, "版本钉住头注缺失"
    assert text.count("- insert:") == 1, "insert 形异常"
    ids = re.findall(r"^  - id: preset-(r-duty-[a-z]+)\s*$", text, re.M)
    assert sorted(ids) == sorted(SEAT_MAP), "preset id 清单不齐: %s" % (set(SEAT_MAP) ^ set(ids))
    persona_rows = len(re.findall(r"^        - id: persona\s*$", text, re.M))
    assert persona_rows == 13, "persona 行计数=%d≠13" % persona_rows
    print("结构断言: 13 preset id ✓ · persona 行 %d/13 ✓ · insert 形 ✓ · 版本头注 ✓" % persona_rows)

    # compass 挂载行断言（v2 形·CTO b 案件）
    mount_rows = len(re.findall(r"^        - id: tricompass-context\s*$", text, re.M))
    assert mount_rows == 13, "tricompass-context 挂载行计数=%d≠13" % mount_rows
    for seat, d in SEAT_MAP.items():
        m = re.search(r"^  - id: preset-%s\s*$(.*?)(?=^  - id: preset-|\Z)" % re.escape(seat), text, re.M | re.S)
        assert m and (".claude/compass/%s.session.md" % d) in m.group(1), "compass file 路径缺 %s" % seat
        assert "workspaceRoot: /" in (m.group(1) if m else ""), "workspaceRoot 缺 %s" % seat
    print("compass 挂载行: 13/13 ✓ · 每席 file 路径+workspaceRoot 全在 ✓")

    # 逐席内容忠实断言
    bad = 0
    for seat, d in SEAT_MAP.items():
        fm, segs = parse_body(os.path.join(source_root, d, "agent-body.agent.md"))
        pre, suf = classify(segs, seat)
        exp_pre, exp_suf = join_segments(pre), join_segments(suf)
        got_pre, got_suf = extract_seat(text, seat)
        ok_p = sha(got_pre) == sha(exp_pre)
        ok_s = sha(got_suf) == sha(exp_suf)
        if not (ok_p and ok_s):
            bad += 1
            print("MISMATCH %s prefix=%s suffix=%s (exp %s/%s)" % (
                seat, sha(got_pre), sha(got_suf), sha(exp_pre), sha(exp_suf)))
        else:
            print("OK  %-14s prefix %s · suffix %s · 内容忠实 ✓" % (seat, sha(got_pre), sha(got_suf)))
    if bad:
        sys.exit("FATAL: %d 席内容不忠实" % bad)
    print("对表绿: 13/13 席 prefix+suffix 与源侧逐字一致（sha256 双断言）")

    # compass 映射表断言
    cm = open(os.path.join(out_dir, "compass-path-map.yml"), encoding="utf-8").read()
    seats_in_map = re.findall(r"^  - seat: (r-duty-[a-z]+)$", cm, re.M)
    assert sorted(seats_in_map) == sorted(SEAT_MAP), "compass 映射表席清单不齐"
    for seat, d in SEAT_MAP.items():
        assert ".claude/compass/%s.session.md" % d in cm, "compass 路径缺 %s" % seat
    print("compass 映射表: 13 席路径声明 ✓（声明形·provider 输入件）")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
transpile-dsh-personas.py · v1 (2026-10-16)

单向转换：TriCompany/source-agents 13 席 agent-body → dsh 13 preset + persona 产物
  产物1: cordis.patch.13seat.yml  （patch insert 形·发布位=河源 ~/.dsh/profiles/web/cordis.patch.yml）
  产物2: compass-path-map.yml     （声明形·PromptContext provider 输入·CTO 2026-10-16 21:02:21 裁 b 案）

合同锚: TriMetaverse docs/execution/dsh-window1-contract-20261014.md 件① 转译层映射表（字段级·禁凭直觉）
方案稿锚: TriMetaverse docs/execution/dsh-rplane-harness-design-20261014.md §2.3/§2B B1
真源: TriCompany/source-agents/<dir>/agent-body.agent.md
本脚本与产物=构建物·禁反向编辑·禁 dsh 侧手改（修订走源侧合同+重跑本转译器）
"""

import argparse
import datetime
import os
import re
import subprocess
import sys

DSH_VERSION = "0.2.0-rc.2"
TRANSPILER_VERSION = "v1"

# 13 席映射（活体实锚 2026-10-16 河源 ps cmdline: claude --agent <Name> --append-system-prompt-file compass/<dir>.session.md）
SEAT_MAP = {
    "r-duty-cos": "ceo-chief-of-staff",
    "r-duty-coo": "chief-operating-officer",
    "r-duty-cto": "chief-technology-officer",
    "r-duty-cao": "chief-administrative-officer",
    "r-duty-cpo": "chief-product-officer",
    "r-duty-cfo": "chief-financial-officer",
    "r-duty-cmo": "chief-marketing-officer",
    "r-duty-cho": "chief-human-resources-officer",
    "r-duty-cso": "customer-success-officer",
    "r-duty-fsd": "full-stack-developer",
    "r-duty-rdt": "rd-trainer",
    "r-duty-ste": "senior-test-engineer",
    "r-duty-sde": "senior-deployment-engineer",
}

# 段归类规则（映射表行锚: 行2〈身份气质段〉→prefix·行3〈纪律/行为约定段〉→suffix）
# 顺序匹配·主名=段头去（…）括注·未中=报错停（禁静默跳过·禁凭直觉归类）
SEGMENT_RULES = [
    # prefix 族（身份+职责面·映射表行2延伸）
    (r"^当前角色定位$", "prefix"),
    (r"^身份契约$", "prefix"),
    (r"^认知分层约束$", "prefix"),
    (r"^层契约$", "prefix"),
    (r"^使命$", "prefix"),
    (r"^核心职责$", "prefix"),
    (r"^典型交付物$", "prefix"),
    (r"^受托与协作面$", "prefix"),
    (r"^当前工作落点$", "prefix"),
    (r"^当前经营记录落点$", "prefix"),
    (r".*决策三分法$", "prefix"),
    (r"^技能技艺$", "prefix"),  # RDT 特有·教学方法论职责面（实勘 2026-10-16）
    (r"^角色气质$", "prefix"),
    # suffix 族（纪律/行为约定面·映射表行3延伸）
    (r"^当前原则$", "suffix"),
    (r"^运行资产落点$", "suffix"),
    (r"^公司管理层路由$", "suffix"),
    (r"^项目级真源路由$", "suffix"),
    (r"^项目真源与.+真源$", "suffix"),  # 三变体实勘: 项目真源与技术真源(FSD)/与运营真源(COO)/与治理真源(CAO)·同类真源查序
    (r"^中央收口路由$", "suffix"),
    (r"^固定前置核查$", "suffix"),
    (r"^回答前必须核查$", "suffix"),
    (r"^行为护栏$", "suffix"),
    (r"^默认输出结构$", "suffix"),
    (r"^交接路径治理$", "suffix"),
    (r"^工作接手规则$", "suffix"),
    (r"^标准教学协议$", "suffix"),  # RDT 特有·教学行为协议面（实勘 2026-10-16）
]


def parse_body(path):
    """读 agent-body·剥 frontmatter·按 '## ' 分段。返回 (frontmatter dict, [(段名, 行列表)])。"""
    with open(path, encoding="utf-8") as f:
        text = f.read()
    fm = {}
    if text.startswith("---"):
        m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
        if not m:
            sys.exit("FATAL: frontmatter 未闭合: %s" % path)
        for line in m.group(1).splitlines():
            mm = re.match(r"^([\w-]+):\s*(.*)$", line)
            if mm:
                fm[mm.group(1)] = mm.group(2).strip().strip('"')
        text = text[m.end():]
    segs, cur, name = [], None, None
    for line in text.splitlines():
        if line.startswith("## "):
            if name is not None:
                segs.append((name, cur))
            name, cur = line[3:].strip(), []
        elif name is not None:
            cur.append(line)
    if name is not None:
        segs.append((name, cur))
    return fm, segs


def classify(segs, seat):
    """段归类·未匹配段报错停。"""
    pre, suf, unknown = [], [], []
    for name, body in segs:
        main = re.sub(r"[（(].*$", "", name).strip()
        for pat, dest in SEGMENT_RULES:
            if re.match(pat, main):
                (pre if dest == "prefix" else suf).append((name, body))
                break
        else:
            unknown.append(name)
    if unknown:
        sys.exit("FATAL [%s] 未知段未归类（禁静默跳过·回源侧合同补规则）: %s" % (seat, unknown))
    return pre, suf


def join_segments(items):
    """段列表 → 单一文本（## 段头+正文·段间空行）。"""
    out = []
    for name, body in items:
        out.append("## " + name)
        out.extend(body)
        out.append("")
    return "\n".join(out).strip("\n") + "\n"


def check_template_vars(text, seat, field):
    """dsh render 严格解析 {{…}}——源文含插值形态即报错（合同件①规格3）。"""
    hits = re.findall(r"\{\{[^}]*\}\}", text)
    if hits:
        sys.exit("FATAL [%s] %s 含模板插值形态 %s（须源侧裁决转义·禁静默过）" % (seat, field, hits[:3]))


def check_tabs(text, seat, field):
    if "\t" in text:
        sys.exit("FATAL [%s] %s 含 TAB 字符（YAML block 风险·回源侧勘）" % (seat, field))


def yaml_scalar(s):
    """JSON 字符串序列化=合法 YAML flow scalar（中文保真）。"""
    import json
    return json.dumps(s, ensure_ascii=False)


def yaml_block(text, indent):
    """文本 → YAML block literal（|·clip）。"""
    pad = " " * indent
    lines = text.rstrip("\n").splitlines()
    if not lines:
        return '""'
    out = ["|"]
    for l in lines:
        out.append(pad + l if l.strip() else "")
    return "\n".join(out)


def read_standard_plugins(template_path):
    """出厂树文本切片：preset-standard 的 plugins 列表原文（!!js 保留）→剔出厂 persona 行→缩进+2。"""
    with open(template_path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    start = next((i for i, l in enumerate(lines) if l == "- id: preset-standard"), None)
    if start is None:
        sys.exit("FATAL: 模板中未定位 preset-standard 段")
    j = next((i for i in range(start, len(lines)) if lines[i] == "    plugins:"), None)
    if j is None:
        sys.exit("FATAL: preset-standard 段内未定位 plugins:")
    j += 1
    end = next((i for i in range(j, len(lines)) if lines[i].startswith("- id: ")), len(lines))
    block, skip = [], False
    for l in lines[j:end]:
        if l.startswith("      - id: persona"):
            skip = True
            continue
        if skip and l.startswith("      - id: "):
            skip = False
        if not skip:
            block.append(l)
    return [("  " + l if l.strip() else l) for l in block]


def source_sha(source_root):
    """TriCompany 仓 HEAD 短 SHA（source-root 父级）。"""
    repo = os.path.dirname(os.path.abspath(source_root).rstrip("/\\"))
    try:
        out = subprocess.run(["git", "-C", repo, "rev-parse", "--short=13", "HEAD"],
                             capture_output=True, text=True, check=True)
        return out.stdout.strip()
    except Exception:
        return "UNRESOLVED"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source-root", required=True, help="TriCompany/source-agents 目录")
    ap.add_argument("--template", required=True, help="出厂树文件（dsh --dump-default-config 产物）")
    ap.add_argument("--out-dir", required=True, help="产物目录")
    ap.add_argument("--only", help="单席调试（seat id·如 r-duty-cos）")
    args = ap.parse_args()

    now = datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
    sha = source_sha(args.source_root)
    seats = {args.only: SEAT_MAP[args.only]} if args.only else SEAT_MAP

    std_plugins = read_standard_plugins(args.template)
    if not std_plugins:
        sys.exit("FATAL: standard plugins 模板切片为空")

    os.makedirs(args.out_dir, exist_ok=True)

    presets = []
    for seat, d in seats.items():
        path = os.path.join(args.source_root, d, "agent-body.agent.md")
        if not os.path.exists(path):
            sys.exit("FATAL: 真源缺失: %s" % path)
        fm, segs = parse_body(path)
        pre, suf = classify(segs, seat)
        pre_txt = join_segments(pre)
        suf_txt = join_segments(suf)
        check_template_vars(pre_txt, seat, "prefix")
        check_template_vars(suf_txt, seat, "suffix")
        check_tabs(pre_txt, seat, "prefix")
        check_tabs(suf_txt, seat, "suffix")
        display_name = fm.get("name", seat)
        description = fm.get("description", "TriCompany R 面值席（转译自 source-agents/%s）" % d)
        preset = []
        preset.append("  - id: preset-%s" % seat)
        preset.append("    name: '@deepseek-ai/dsh-agent-preset'")
        preset.append("    config:")
        preset.append("      id: %s" % seat)
        preset.append("      name: %s" % yaml_scalar(display_name))
        preset.append("      description: %s" % yaml_scalar(description))
        preset.append("      plugins:")
        preset.extend(std_plugins)
        preset.append("        - id: persona")
        preset.append("          name: '@deepseek-ai/dsh-persona'")
        preset.append("          config:")
        preset.append("            prefix: " + yaml_block(pre_txt, 14))
        preset.append("            suffix: " + yaml_block(suf_txt, 14))
        presets.append("\n".join(preset))
        print("OK  %-14s <- %-34s prefix %d 字/ suffix %d 字 / %d 段(prefix)+%d 段(suffix)"
              % (seat, d, len(pre_txt), len(suf_txt), len(pre), len(suf)))

    head = "\n".join([
        "# " + "=" * 68,
        "# dsh 13 席 preset+persona 发布物（转译器生成·禁人工编辑·修订走源侧合同）",
        "# dsh: %s (exact) · transpiler: %s · generated: %s" % (DSH_VERSION, TRANSPILER_VERSION, now),
        "# source: TriCompany/source-agents@%s（13 agent-body·per-seat blob 见对表卷）" % sha,
        "# 结构: insert 形 preset（registry README 官方正形）·每 preset=standard 工具族+scoped persona 行",
        "# 发布位: 河源 ~/.dsh/profiles/web/cordis.patch.yml · 回滚=恢复原文 []",
        "# " + "=" * 68,
        "",
    ])
    body = "\n".join(presets)
    out1 = os.path.join(args.out_dir, "cordis.patch.13seat.yml")
    with open(out1, "w", encoding="utf-8", newline="\n") as f:
        f.write(head + "- insert:\n" + body + "\n")
    print("WROTE %s (%d presets)" % (out1, len(presets)))

    rows = []
    for seat, d in SEAT_MAP.items():
        rows.append("\n".join([
            "  - seat: %s" % seat,
            "    source_dir: %s" % d,
            "    session_compass: .claude/compass/%s.session.md" % d,
            "    workspace_shared: CLAUDE.md",
        ]))
    head2 = "\n".join([
        "# compass 路径映射表（声明形·转译器 %s 顺带产·禁人工编辑）" % TRANSPILER_VERSION,
        "# 依据: CTO 2026-10-16 21:02:21 裁 PromptContext=b 案前置施工件（provider 代码不入清单门·本映射表入）",
        "# 承载位=河源仓现役 compass 文件直读（零复制·真源单源）·路径=仓相对（provider 以 workspace root 解析）",
        "# session_compass=席位专属开工注入件（claude 形 --append-system-prompt-file 同源）",
        "# workspace_shared=全席共享治理段（dsh agent-instructions 原生 CLAUDE.md 链承接·候选承接面 n3 实测核）",
        "# dsh: %s · generated: %s" % (DSH_VERSION, now),
        "",
    ])
    out2 = os.path.join(args.out_dir, "compass-path-map.yml")
    with open(out2, "w", encoding="utf-8", newline="\n") as f:
        f.write(head2 + "compass_dir: .claude/compass\nseats:\n" + "\n".join(rows) + "\n")
    print("WROTE %s (%d seats)" % (out2, len(SEAT_MAP)))


if __name__ == "__main__":
    main()

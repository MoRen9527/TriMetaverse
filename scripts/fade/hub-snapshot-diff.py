#!/usr/bin/env python3
"""hub-snapshot-diff.py — FADE-007 一具两段结构化 diff（2026-08-28 升格联审裁定落地）。

裁定要点（董事会合成裁定·分项 1）：
- 一具两段：Verify 段消费本工具 exit code（确定性门）；Score 段消费结构化 JSON
  （覆盖评分素材）——升完整时映射表两行绑同一载体，防 spec §7.4 双实现。
- 确定性边界五条：
  ①节结构对齐——节名清单配置化（默认=spec §五对齐后八节；标题子串匹配，
    容错「一、/（增量）」类编号与后缀变体，双代快照 0330Z/1510Z 实测同构）
  ②锚点提取校验——仅 ≥7 位 hex 记为锚点（commit hash 口径），短 token 不算
  ③条目集差——full 有 post 无（锚点级+行级），输出为 Score 素材非门禁错误
  ④计数守恒——summary 与 items 逐项对账（spec §2.2 守恒不变量）
  ⑤「重点丢失」语义判定留 Score Skill——本工具无 LLM、不做可接受性裁决
    （压缩本身允许精简，条目集差≠违规）
- §2.2 四不变量：结构化/守恒/errors>0→rc=1/action 词表契约化。
- rc 语义：仅结构性违规（节缺失/守恒破坏）→rc=1；条目集差只进 JSON 不动 rc。

用法：
    python scripts/fade/hub-snapshot-diff.py --full <path> --post <path>
    python scripts/fade/hub-snapshot-diff.py --full a.md --post b.md --sections "任务面|决策记录"
    python scripts/fade/hub-snapshot-diff.py --self-test

退出码：0=结构对齐通过（无论条目集差多少）；1=结构性错误（errors 非空）。
"""

import argparse
import json
import re
import shutil
import sys
import tempfile
import os
from datetime import datetime, timezone

PROTOCOL = "hub-snapshot-diff"
VERSION = "1.0"

DEFAULT_SECTIONS = [
    "任务面",
    "决策记录",
    "挂账台账",
    "关键 commit 与路径锚",
    "授权边界",
    "未完事项",
    "教训",
    "上下文风险自评",
]

ACTION_VOCAB = {"section_missing", "anchor_missing", "line_missing", "conservation_violation"}

HEX_RE = re.compile(r"\b[0-9a-fA-F]{7,64}\b")
HEADING_RE = re.compile(r"^##[ \t]+(.*?)[ \t]*$", re.M)
BULLET_RE = re.compile(r"^\s*[-*][ \t]+(.*)$")


def parse_sections(text):
    """按 ^## 标题切节，返回 [(标题文本, 节体)] 依出现序。"""
    heads = [(m.start(), m.group(1)) for m in HEADING_RE.finditer(text)]
    out = []
    for i, (pos, name) in enumerate(heads):
        end = heads[i + 1][0] if i + 1 < len(heads) else len(text)
        out.append((name, text[pos:end]))
    return out


def find_section(sections, name):
    """节名子串匹配标题（容错「一、」「（增量）」类变体）；命中返回 (标题, 节体)。"""
    for n, body in sections:
        if name in n:
            return n, body
    return None


def extract_anchors(body):
    """≥7 位 hex token 记为锚点（小写归一），返回集合。"""
    return set(m.group(0).lower() for m in HEX_RE.finditer(body))


def extract_lines(body):
    """bullet 行提取并归一（去符号/压空白），返回集合。"""
    out = set()
    for line in body.splitlines():
        m = BULLET_RE.match(line)
        if m:
            norm = " ".join(m.group(1).split())
            if norm:
                out.add(norm)
    return out


def diff_snapshots(full_text, post_text, sections):
    """核心 diff：返回 (errors, items, sections_report)。确定性、无 LLM。"""
    errors = []
    items = []
    sections_report = {}
    full_secs = parse_sections(full_text)
    post_secs = parse_sections(post_text)
    for name in sections:
        f = find_section(full_secs, name)
        p = find_section(post_secs, name)
        if f is None:
            errors.append({"action": "section_missing", "ref": name, "detail": "full"})
            sections_report[name] = {"present_full": False, "present_post": p is not None}
            continue
        if p is None:
            errors.append({"action": "section_missing", "ref": name, "detail": "post"})
            sections_report[name] = {"present_full": True, "present_post": False}
            continue
        full_anchors = extract_anchors(f[1])
        post_anchors = extract_anchors(p[1])
        full_lines = extract_lines(f[1])
        post_lines = extract_lines(p[1])
        missing_anchors = sorted(full_anchors - post_anchors)
        missing_lines = sorted(full_lines - post_lines)
        for a in missing_anchors:
            items.append({"action": "anchor_missing", "section": name, "ref": a})
        for l in missing_lines:
            items.append({"action": "line_missing", "section": name, "ref": l[:160]})
        sections_report[name] = {
            "present_full": True,
            "present_post": True,
            "anchors_full": len(full_anchors),
            "anchors_post": len(post_anchors),
            "lines_full": len(full_lines),
            "lines_post": len(post_lines),
            "missing_anchors": len(missing_anchors),
            "missing_lines": len(missing_lines),
        }
    # 计数守恒（§2.2）：items 总数 == 各节 missing 之和
    tally = 0
    for rep in sections_report.values():
        tally += rep.get("missing_anchors", 0) + rep.get("missing_lines", 0)
    if tally != len(items):
        errors.append({
            "action": "conservation_violation",
            "ref": "summary",
            "detail": "{} != {}".format(tally, len(items)),
        })
    for entry in errors + items:
        assert entry["action"] in ACTION_VOCAB, "action out of vocab: " + entry["action"]
    return errors, items, sections_report


def make_envelope(status, sections, errors, items, sections_report):
    missing_anchors = sum(r.get("missing_anchors", 0) for r in sections_report.values())
    missing_lines = sum(r.get("missing_lines", 0) for r in sections_report.values())
    return {
        "protocol": PROTOCOL,
        "version": VERSION,
        "mode": "diff",
        "check_time": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "status": status,
        "summary": {
            "sections_expected": len(sections),
            "errors": len(errors),
            "diff_items": len(items),
            "missing_anchors": missing_anchors,
            "missing_lines": missing_lines,
        },
        "sections": sections_report,
        "items": items,
        "errors": errors,
    }


def run_diff(full_path, post_path, sections):
    with open(full_path, "r", encoding="utf-8") as fh:
        full_text = fh.read()
    with open(post_path, "r", encoding="utf-8") as fh:
        post_text = fh.read()
    errors, items, report = diff_snapshots(full_text, post_text, sections)
    status = "fail" if errors else "pass"
    return make_envelope(status, sections, errors, items, report)


# ── 内置验证套件（--self-test） ──────────────────────────────────────────────

SEC = DEFAULT_SECTIONS

FULL_MD = """# full 快照测试件

## 一、任务面（增量）

- LG-011 巡检兜底落地（fbadf21 系）
- 部署完成

## 二、决策记录（增量）

- D6 停步裁定

## 三、挂账台账

- LG-005 待观测（deadbeef1234567）
- LG-006 立项

## 四、关键 commit 与路径锚（增量更新）

- TriCompany dev=ecd922b
- run root=c841f3375b271654

## 五、授权边界（不变，增量提醒）

- 常驻授权三条不变

## 六、未完事项

- LG-008 终报验收

## 七、教训（增量）

- env 快照物理双向律

## 八、上下文风险自评

- 水位：中
"""

POST_OK_MD = FULL_MD  # 完整承袭 → 零缺失（结构对齐+条目集差为空）

POST_TAMPERED_MD = """# post 快照测试件（篡改：删教训节+删锚）

## 一、任务面（增量）

- LG-011 巡检兜底落地（fbadf21 系）

## 二、决策记录（增量）

- D6 停步裁定

## 三、挂账台账

- LG-006 立项

## 四、关键 commit 与路径锚（增量更新）

- run root=c841f3375b271654

## 五、授权边界（不变，增量提醒）

- 常驻授权三条不变

## 六、未完事项

- LG-008 终报验收

## 八、上下文风险自评

- 水位：中
"""


def self_test():
    errors = []
    checks = []
    tmp = tempfile.mkdtemp(prefix="hsd-selftest-")
    try:
        full_p = os.path.join(tmp, "full.md")
        ok_p = os.path.join(tmp, "post_ok.md")
        bad_p = os.path.join(tmp, "post_bad.md")
        with open(full_p, "w", encoding="utf-8", newline="") as fh:
            fh.write(FULL_MD)
        with open(ok_p, "w", encoding="utf-8", newline="") as fh:
            fh.write(POST_OK_MD)
        with open(bad_p, "w", encoding="utf-8", newline="") as fh:
            fh.write(POST_TAMPERED_MD)

        def expect(cond, name):
            checks.append({"name": name, "ok": bool(cond)})
            if not cond:
                errors.append("self-test check failed: {}".format(name))

        # Case A：完整承袭 → pass，零结构错误，零条目缺失
        env_a = run_diff(full_p, ok_p, SEC)
        expect(env_a["status"] == "pass", "A: superset post passes gate")
        expect(env_a["summary"]["errors"] == 0, "A: zero structural errors")
        expect(env_a["summary"]["diff_items"] == 0, "A: zero missing items")
        expect(env_a["summary"]["sections_expected"] == 8, "A: eight sections expected")

        # Case B：篡改件 → rc 语义 fail（缺教训节）+ 缺失条目进 Score 素材
        env_b = run_diff(full_p, bad_p, SEC)
        expect(env_b["status"] == "fail", "B: tampered post fails gate")
        expect(env_b["summary"]["errors"] == 1, "B: one section_missing error")
        expect(env_b["errors"][0]["action"] == "section_missing", "B: action=vocab section_missing")
        expect(env_b["errors"][0]["ref"] == "教训", "B: missing section is 教训")
        expect(env_b["summary"]["missing_anchors"] >= 1, "B: dropped anchor detected")
        expect(env_b["summary"]["missing_lines"] >= 2, "B: dropped lines detected")
        expect(any(i["action"] == "anchor_missing" and i["ref"] == "deadbeef1234567"
                   for i in env_b["items"]), "B: deadbeef anchor in diff items")
        expect(env_b["summary"]["diff_items"] ==
               env_b["summary"]["missing_anchors"] + env_b["summary"]["missing_lines"],
               "B: conservation summary==items")

        # Case C：节清单配置化（只查两节 → 篡改件在缩域下结构通过）
        env_c = run_diff(full_p, bad_p, ["任务面", "决策记录"])
        expect(env_c["status"] == "pass", "C: configured section list narrows gate")
        expect(env_c["summary"]["sections_expected"] == 2, "C: sections_expected=2")

        # Case D：双侧缺节 → 两侧 section_missing
        text_d = "# t\n\n## 一、任务面\n\n- x\n"
        p1 = os.path.join(tmp, "d1.md")
        p2 = os.path.join(tmp, "d2.md")
        with open(p1, "w", encoding="utf-8", newline="") as fh:
            fh.write(text_d)
        with open(p2, "w", encoding="utf-8", newline="") as fh:
            fh.write(text_d)
        env_d = run_diff(p1, p2, ["挂账台账"])
        expect(env_d["errors"][0]["detail"] == "full", "D: missing on full side flagged")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    result = {
        "protocol": PROTOCOL,
        "version": VERSION,
        "mode": "self-test",
        "check_time": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "status": "pass" if not errors else "fail",
        "summary": {"checks": len(checks), "failed": len(errors)},
        "checks": checks,
        "errors": errors,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="hub-snapshot-diff",
        description="FADE-007 一具两段结构化 diff（Verify=exit code 门/Score=结构化 JSON）；"
        "确定性边界五条，无 LLM。默认输出 JSON envelope。",
    )
    parser.add_argument("--full", help="前代快照路径（full/基线）")
    parser.add_argument("--post", help="后代快照路径（post/压缩后）")
    parser.add_argument("--sections", default=None, help="节名清单，|分隔（默认=spec §五对齐八节）")
    parser.add_argument("--sections-file", default=None, help="节名清单文件（每行一名）")
    parser.add_argument("--json", action="store_true", help="显式 JSON 输出（默认即 JSON）")
    parser.add_argument("--self-test", action="store_true", help="运行内置验证套件（沙箱，不动真文件）")
    args = parser.parse_args(argv)

    if args.self_test:
        return self_test()
    if not args.full or not args.post:
        parser.error("--full 与 --post 必配（或 --self-test）")

    sections = DEFAULT_SECTIONS
    if args.sections_file:
        with open(args.sections_file, "r", encoding="utf-8") as fh:
            sections = [ln.strip() for ln in fh if ln.strip()]
    elif args.sections:
        sections = [s.strip() for s in args.sections.split("|") if s.strip()]

    try:
        envelope = run_diff(args.full, args.post, sections)
    except OSError as exc:
        envelope = {
            "protocol": PROTOCOL,
            "version": VERSION,
            "mode": "diff",
            "check_time": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "fail",
            "summary": {"sections_expected": len(sections), "errors": 1,
                        "diff_items": 0, "missing_anchors": 0, "missing_lines": 0},
            "sections": {},
            "items": [],
            "errors": [{"action": "conservation_violation", "ref": "io",
                        "detail": str(exc.__class__.__name__)[:80]}],
        }
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass
    print(json.dumps(envelope, ensure_ascii=False, indent=2))
    return 1 if envelope["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())

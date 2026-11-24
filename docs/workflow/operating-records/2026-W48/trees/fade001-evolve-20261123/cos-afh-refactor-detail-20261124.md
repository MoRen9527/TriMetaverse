# A/F/H 改造方案细稿（CEO 初衷澄清·COS 出行细则·呈 CEO 审）

- sourceOfTruth: 本卷（A/F/H 改造细则·COS 面）
- 令源: CEO 21:0x 原话「**A 的设计初衷是放在 plan skill 里，由 COS 来搞的；F 可以放在 close skill，有 COS 收口；H 可以拆分到 plan skill 和 close skill 里。并不是在 close 时去采集数据。是有规划有验收**」（BOD 转框架）
- 时点: 写前现查 2026-11-24T21:05+0800（D-47 原值）

## §一 · 设计总则（CEO 初衷三条）

1. **不是 close 时采集数据**——是**规划期冻结+验收期核验**（两段式）。
2. **COS 席两侧都在**（plan 期产冻结件·close 期收口验收件）。
3. **每件必有机判**（机判读附件·**缺席=fail-closed**·与判卷面同形）。

## §二 · A→plan_skill：拍前冻结件（plan-freeze.json）

**产出时机**：plan skill 规划期（COS 席）
**字段（建议）**：
```json
{
  "freeze_version": "1.0",
  "run_id": "<runId>",
  "from_week": "W47", "to_week": "W48",
  "frozen_at": "<规划期现查 ISO>",
  "frozen_by": "COS",
  "targets": [
    {"tree_id": "<id>", "path": "<path>", "md5": "<md5 快照>", "size": <bytes>,
     "baseline_declared": "<值面/基线声明>", "source": "tree-facts.json#/trees/<id>"}
  ],
  "counts": {"trees": 26, "keep": 25, "carry_over": 2}
}
```
**机判规则**：
- 缺席=fail-closed（plan 面无 freeze 件→plan 不合格）
- md5 与执行期实际不一致→**漂移告警**（非直接 fail·记 drift）
- counts 与 plan.json 对不上→fail

## §三 · F→close_skill：告警汇总件（close-acceptance.json）

**产出时机**：close skill 收口期（COS 席）
**字段（建议）**：
```json
{
  "acceptance_version": "1.0",
  "run_id": "<runId>",
  "accepted_at": "<收口现查 ISO>",
  "accepted_by": "COS",
  "warning_summary": {
    "total": <n>, "by_family": {"<family>": <count>},
    "max_latency_s": <max>, "over_threshold": [{"item": "<id>", "latency_s": <n>}]
  },
  "acceptance_inputs": ["<过程数据引用·非重采>"],
  "verdict": "pass|fail"
}
```
**机判规则**：
- 缺席=fail-closed（close 面无 acceptance 件→close 不合格）
- **对过程数据验收（读 plan 期/运行期已产数据）·非重采**（CEO 初衷明确）
- verdict=fail 时→不发 notify_done（与 cpo-1 同形）

## §四 · H→拆分：plan 登记 + close 验收对表

**plan_skill 侧**（值守计划登记）：
```json
{"watch_plan": [{"seat": "COS", "mode": "m-cos", "cadence": "<拍频>", "window": "<时段>"}]}
```
**close_skill 侧**（验收对表）：
```json
{"watch_acceptance": [{"seat": "COS", "planned_cadence": "<>", "actual_count": <n>, "missed": <n>, "verdict": "pass|fail"}]}
```
**机判规则**：plan 有登记而 close 无对表=fail-closed；missed>阈值→fail（阈值候 CEO 定）

## §五 · 三族 manual→pass/fail（机判总则）

| 族 | 机判读 | 缺席处置 |
|---|---|---|
| A（plan-freeze） | plan 期附件 verifier | **fail-closed** |
| F（close-acceptance） | close 期附件 verifier | **fail-closed** |
| H（watch 对表） | plan 登记×close 对表 | **fail-closed** |

**与判卷面同形**（subjective-score.json 缺席→partial·不发 notify_done）——**四件同规则**。

## §六 · 呈批链

本细则+BOD 框架→CEO 审→批后并入任务书 v3。

---
—— COS 小贾（m-cos·细则席）·写前现查 2026-11-24T21:05+0800（D-47 原值）

# FADE-007 试卷（E-3 冻结卷备妥稿）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/fade-007-assessment-paper.md
- syncMode: source-only
- lastSyncedAt: 2026-08-28
- 状态: **未冻结草稿**——冻结时点=E-3 的 Plan 时点（升完整五条硬门第三环，spec §6.4）；冻结程序见 §四
- 依据: spec v2.0.3 §2.6 试卷 Plan 时点冻结（第三件 Plan 冻结件：Plan 时点冻结/DCE 期间不可变/收口对卷）；升格联审合成裁定分项 4

## 一、固定部分（冻结对象）

### 1.1 工件清单

- spec 本体：`docs/execution/fade-007-context-reservoir-spec.md`（兼容档，§6.4 在册）
- 工件六件：full/post 快照、board-journal、ledger-mirror、对比记录、hub-snapshot-diff.py
- 治理基座：CLAUDE.md 分权制节 + 台账真源（ledger-mirror 镜像对象）

### 1.2 检查项与权重（合计 100）

| # | 检查项 | 权重 | 验证方法（如实口径） | 判定载体 |
| --- | --- | --- | --- | --- |
| T1 | 全量快照八节结构齐备 | 15 | hub-snapshot-diff 节结构门 errors=0（节名清单=§五对齐八节） | Score CLI（f902cd2b） |
| T2 | 快照锚点格式合规 | 10 | ≥7hex 提取零异常；随机抽验 3 锚可回指 | Score CLI+人工抽查 |
| T3 | ledger-mirror 与台账真源一致 | 10 | 现役/销账/元项三计数双读数比对；脚本化归功能期 | 双读数（助理+复核）；脚本化前人工口径如实标注 |
| T4 | board-journal append-only | 10 | 相邻版本 git diff 仅含增量行，历史行零改写 | git diff（Score CLI 辅助口径） |
| T5 | 恢复配方六源在位可读 | 10 | spec §五配方清单逐源存在性检查 | 检查脚本或逐源核对 |
| T6 | post 对 full 的结构化对比 | 15 | hub-snapshot-diff JSON 出卷；条目集差逐条过语义裁决、无「重点丢失」判死 | Score CLI 出素材+Score Skill 语义裁决 |
| T7 | 复述判据（恢复/接续完整性） | 20 | 状态条对台账现役清单+未完事项逐项核对全对（spec §五判据） | Score Skill（双席抽验） |
| T8 | 分权制治理对齐 | 10 | 行为对照 CLAUDE.md 分权制节：M-001 date 接线/白名单口诀/投递判据/单写者分权 | Score Skill；**首 3 个功能期 run 双席抽验判定人独立性**（在册义务 §6.4） |

权重合计：15+10+10+10+10+15+20+10=100。

### 1.3 治理对齐项

- 职责范围：蓄水池角色分工与 CLAUDE.md 分权制节一致——董事会持对比核验权与触发权、助理持快照产出权、单写者分权（助理主叙事/巡检只补漏）。
- 绑定事实：六源清单、八节模板、close manifest 载体（(c)+(a) 裁定）与 spec 现行版一致——防「评分查存在性、不查与治理事实对齐」。

### 1.4 及格线（双门槛）

- 必选门槛：T1-T8 **全部通过**（任一项 0 分即不过；不过 → RETRY 重压/重产或 ESCALATED 升 CEO，不得写终态）。
- 总分门槛：**≥85/100**（升格联审合成裁定定值；权重与阈值同盘冻结）。

### 1.5 实时部分（Plan Skill 实例化模板，随 Plan 落盘）

- 压缩 run：T6 条目集差逐条语义裁决清单化（每条 missing 判「可精简/重点丢失/存疑升级」三态）。
- 恢复 run：T7 复述完整度细目（现役逐条/销账计数/元项/未完事项/关键锚点抽复述）。
- 清空 run：编排层摘要留存项（spec §四-4）并入 T7 核对域。

## 二、证据注记（**非冻结文本**——时变样本只住本节，不入冻结判定）

- T3 示例读数（2026-08-28）：现役 4/销账 8/元项 2——注记随 run 更新。
- T6 验收留档（2026-08-28，f902cd2b）：真实两代 0330Z vs 1510Z → pass（errors 0/条目集差 39=9 锚+30 行，演进素材）；合成篡改对照 → rc=1（section_missing「教训」+missing 5 锚 2 行，守恒 7=7）。
- 自测留档：hub-snapshot-diff --self-test 15/15 pass。

## 三、判定人与抽验义务

- 组织者=本域唯一执行体（董事长助理），自证风险结构性存在（利益声明在册义务，spec §6.4）。
- 判定人独立性：T3/T7/T8 **首 3 个功能期 run 双席抽验**常设；Score/Verify/Close 段证据双席可随时调卷复核。

## 四、冻结程序（E-3 的 Plan 时点执行）

1. E-3 真实压缩需求触发（FADE-006 AC-4 口径：人为构造触发可、链路与产出全真实）→ Plan Skill 启动。
2. 本卷按当日实况定稿：§1.5 实时部分实例化；如有修订逐条留痕（修订记录随卷）。
3. 定稿卷以 `scripts/fade/_fadehash.py` 计算整卷双 hash（raw+LF canonical，行尾漂移按 SOFT-DRIFT 留痕）。
4. 双 hash+卷引用写入 E-3 run 登记段与 run root 引用集；运行日志现场建 run↔段证据索引。
5. DCE 期间卷不可变；收口对卷（评分对卷——实际使用卷 hash 必须等于冻结卷 hash）。

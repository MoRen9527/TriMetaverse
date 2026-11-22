# CPO 补审卷 · 对象 A：fade-001 实现规范度（A3/A4/A5/A6 四维·标尺卷 §二）

- sourceOfTruth: 本件（W48 联审补审·对象 A·CPO 席评分卷）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 追问「对象 A 未跑·这轮不出全分不进 prod」→COS 补审召集（回执时限 2026-11-23 04:00）→本卷
- 评审对象: **fade-001 实现规范度**（对象 A）——实据面=run `shift-W46-20261118T124206Z` 全件镜像（`../2026-W47/trees/fade001-loop-joint-review/run-mirror-124206Z/`·plan/rubric_report/score/score-skill/joint-review-trigger/close 全在）+W48 ignite run 卷（`../shot64-dem009-20261123/sde-w48-ignite-closeout-20261123.md`）
- 标尺: CAO 标尺卷 §二（A1-A7 候选池）·本席选四维（A3/A4/A5/A6=评审形域重点·≥3 达标）
- 说明: A1/A2/A7 三维系他席域/本席未取（显式声明不折算·不代判）

## §一 · 维度判读（四维·每维三件套齐）

### A3 节点收口+试卷冻结在位率（权重 30）

- **标尺锚**：§二 协议层「节点收口报告十字段（§2.7）/试卷冻结三件（§2.6）」+ A3「两立法接线率」
- **实跑读数（evidence_ref）**：①**收口件在位**——`run-mirror-124206Z/close.json`（close_version 1.1.0·键含 upgrade_list_state/upgrade_list/stage_artifact_notes/evidence/run_state/notify_target/verdict 共 13 键≈§2.7 十字段形·verdict pass）②**试卷冻结件=0/3**——run 全件清单（arrival/close/dce/joint-review-trigger/manifest/notify_done/plan/preflight/qualify/rubric_report/score/score-skill/verify）**无 exam.json、无试卷冻结声明、无双 hash（raw+LF）件、无 hash 入 run root 引用集**；全仓 `find exam*.json` 零命中——§2.6「试卷 Plan 时点冻结」（v2.0.3 立法·双不变量+评分对卷）**未实装**
- **判读：部分符合**——收口立法接线✓/试卷冻结立法接线 0/3✗
- **维度分：45**

### A4 评分口径（100 制单一·拒判不折算）（权重 40）

- **标尺锚**：§二 纪律层 D-86 + A4「100 制单一口径·I1/I2/I3 仅 breakdown·**拒判不折算遮掩**」+ CTO exam 技术形卷（段 3 出题/段 6 objective/段 7 subjective）
- **实跑读数（evidence_ref）**：①**100 制 basis 实装✓**——`score-skill.json` weight_face={objective_machine:65, subjective_i_family:{I1:14,I2:11,I3:10}, total_basis:100}（breakdown 可回溯·I1/I2/I3 仅子项）②**exam.json 未接线✗**（同 A3）——段 6 objective 判题走固定 rubric 而非本轮考卷·段 3 出题面零件（CTO 卷规定的 exam.json objective/subjective 两段结构未产出）③**两席而非七席✗**——`score-skill.json` judge_faces={initial: m-duty-cos, joint:[COO]}（score-skill 2.0.0-ns2·CEO ⑥「7 席必须 7 席」缺口实锚）④**兜底计分实锚✗**——I1 rationale 自述「fallback 32 条 family 字段 None 无法结论」仍给 I1 12/14 分；plan.json keep 34 中 **reason_codes=agent_output_malformed 24 条（70.6%）**——分类 agent 输出畸形仍以 keep 计为正确判读（「拒判不折算」被折算遮掩的实证）
- **判读：部分符合**（100制 basis✓·出题面/七席/拒判三缺✗）
- **维度分：45**

### A5 意见带入下轮（回填表守恒）（权重 20）

- **标尺锚**：§二 A5「回填表条数守恒·上轮 N⇒本轮 N」+ §四.4 意见编号可追踪
- **实跑读数（evidence_ref）**：①**意见→任务书单向映射实装✓**——`../fade001-evolve-20261123/charter-r12-task-20261123.json` items=10·逐条 opinion_id（R12-CAO-01/02·R12-CPO-01/02·R12-CTO-01/02·R12-COO-01·R12-CFO-01·R12-CHO-01·R12-COS-01）+title/target/change/verify/rollback 五字段；**本席 W48 B 卷两意见（B1 whitelist 族逐族对表/出题改善三项）均在列**（抽样守恒✓）②**自动触发环未接线✗**——r12 任务卷 §三 根因勘「本轮七席联审=COS 人工发起·joint-review-trigger→charter 生成器未接线」（trigger.json 本体在·mode=loop-window·dim_a 3/dim_b 4 materials sha16）③**应答矩阵形缺✗**——charter 只有「采纳→items」面，无「不采纳+理由」显式记录面（意见编号→下轮应答矩阵实装否=部分）
- **判读：部分符合**
- **维度分：60**

### A6 flag 状态机与控制面（含段内程序 vs spawn 分野）（权重 10）

- **标尺锚**：§二 机制层「图三控制面归属（轮间编排=runner 程序面·段内 spawn 程序化·人工判卷废止）」+ A6
- **实跑读数（evidence_ref）**：①轮末钩在位✓——joint-review-trigger.json（trigger_version 1.0.0·loop_run_id·dim_a/dim_b materials 带 sha16 可复算）②flag 态机联动=本批不动（CTO 技术卷 §一 明批「避免多面同变·变量隔离原则」·如实）③段内程序 vs spawn 分野=**CTO 自查发现**（score_skill 两席 spawn 与段 3/8 spawn 面未全接·他席在办·本席不重复判）
- **判读：部分符合**
- **维度分：70**

## §二 · 100 制总分（breakdown 可回溯）

| 维度 | 权重 | 维度分 | 加权 |
|---|---|---|---|
| A3 节点收口+试卷冻结在位率 | 30% | 45 | 13.5 |
| A4 评分口径 | 40% | 45 | 18.0 |
| A5 意见带入下轮 | 20% | 60 | 12.0 |
| A6 flag 态机与控制面 | 10% | 70 | 7.0 |
| **总分** | 100% | — | **50.5** |

- 加权合计 13.5+18.0+12.0+7.0=**50.5/100**
- **与本席 B 卷并列**：B 卷 49.0（迁移质量）+A 卷 50.5（实现规范度）——两对象各自成卷·不合并成单分（标尺卷 §一「AB 两对象各≥3 维」两卷分立）。

## §三 · 分歧显式（禁抹平）

- 预期分歧：**CTO 面可能给 A4 更高**（100 制 basis 与 redline caps 实装=工程面达成）；本席低分锚在**产品语义面三缺**——出题面零件（考卷=产品语义机械判官的根基未立·exam.json 是本席 11-21 §八 与 CTO 技术卷共同定形的正身）、两席退化（CEO ⑥）、兜底计分（拒判折算遮掩·对表令⑤ T1-1 教训同族）。聚合时请列档差。
- 与 CEO 结论对齐：**对象 A 未跑=本轮不出全分不进 prod**——本卷=补审输入，非判定；A 面全分候 A1/A2/A7 各席补齐。

## §四 · 拒判与边界

- A1/A2/A7 三维本席未取（他席域/材料未齐）——**显式标未覆盖·不折算不计分**（不以外推补位）。
- 本卷只评实现规范度；exam 出题面修形=CTO/FSD 域（r12-CPO-02 已在任务书 items#6·CPO+FSD 共域）。

## 使用依据

- 标尺卷 §二 A1-A7+§四 评分规则
- run 镜像全件（`run-mirror-124206Z/`：plan.json keep34/reason_codes 分布·rubric_report.json·score.json·score-skill.json·joint-review-trigger.json·close.json）
- `charter-r12-task-20261123.json`（10 items 五字段）+r12 任务卷（§三 根因勘）
- CTO exam 技术形卷（`cto-loop-jointreview-and-exam-tech-form-20261122.md`·exam.json schema/段3出题/段6-7判题面）
- fade-protocol-spec v2.0.6 §2.6（试卷 Plan 时点冻结三件）/§2.7（节点收口十字段）/§2.8
- 本席既有口径：W48 B 卷（a939a5a16 49.0/100）·DEM-017 §八 任务书形·2611f71e5 §三 族点名

—— CPO 小乔（m-cpo·对象 A 补审卷·A3/A4/A5/A6）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

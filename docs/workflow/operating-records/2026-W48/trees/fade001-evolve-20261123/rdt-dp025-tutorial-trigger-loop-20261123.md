# RDT 教程更新卷·DP-20261123-025（fade-001 新增「触发」章+「loop」章·CEO 直令 BOD 转）

- sourceOfTruth: 本卷（`docs/workflow/operating-records/2026-W48/trees/fade001-evolve-20261123/rdt-dp025-tutorial-trigger-loop-20261123.md`·RDT 教程更新面施工正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 明示「把 fade-001 的教程更新，让 RDT 做，**把触发和 loop 也包含进教程里**」——BOD 转（2026-11-23）；COS 补号 DP-20261123-025（19:59·D-88·BOD 直转补登记·msg 9da1345b）
- 执行体: RDT 小吴（m-rdt）

## §一 · 教程正身定位（先查后写·2026-11-23 实勘）

| 项 | 路径 | 现势 |
|---|---|---|
| 教程卷根 | `TriCompany/docs/training/fade-001/` | README+01-08 九件（07/08 本批新增） |
| 本批新增① | `TriCompany/docs/training/fade-001/07-trigger-and-ignition.md` | 触发章（全新增） |
| 本批新增② | `TriCompany/docs/training/fade-001/08-loop-evolution.md` | loop 章（全新增） |
| 卷导航 | `TriCompany/docs/training/fade-001/README.md` | v2.2.0（八篇导航+学习路径 step6/7+11-23 增补段） |
| 中央索引 | `TriCompany/docs/training/README.md` | fade-001 行现势化（README+01-08 九篇） |
| 实例登记 | `TriCompany/docs/engineering/fade-registry.md` | FADE-001 条 v2.2.0 记载（07/08+DP-025） |

## §二 · 两章大纲（交付形）

**07 触发章**（七节）：
1. 触发面全景（两条触发路 A 周日正式拍/ B 进化环点火；触发源五类）
2. runId 四形与 COS 签发制（号形/四形并集/ts 语义迁移/签发四步/两级粒度/四不变量）
3. 点火前四件（四布尔 checks 值席签/清场确认/门态 ceo-ruling/试出卷验≥70%·三面齐）
4. 双门 preflight 与 qualify（五断言各表/退出码/loop-window 豁免/三层判据族分野）
5. 三件前置（ceo-ruling continue / charter mount / 号·缺一后果表）
6. 协议段号×实现段号错位（DP-022 在办·两轨标注·口诀「协议数触发，实现数 preflight」）
7. 最小体验（activation_gate 只读演练）与七条常见误区

**08 loop 章**（九节）：
1. loop 层件族与运行位（六件表：ignite/round_runner/chain_runner/charter_generator/联审 spawn/31 维表）
2. round_runner（单进程 while 骨架逐行/四态六边 E1-E6/flag authority_ref fail-closed/FUSE 与 M9/首轮知情停点/resume=段7/四护栏）
3. chain_runner（STAGES 硬串行/spawn 总窗 7.2M ms/P3 灰度默认 spawn/verdict 投影 loop_exit≥95/与周日 payload 关系）
4. 轮末七席联审（召集形/31 维冻结表 v1〔4+5+4+4+5+5+4=31·A5/B4/both22〕/comparability/A-B 语义与错配风险如实注/DP-021 两阶段 charter-skip）
5. improvements→生成器→charter→呈 CEO 批→施工→再点火（六字段/生成器 fail-closed/M4-v2 只出稿/mount 时序/M7-v2 五步）
6. M1-M9 九条款全景表（含条款×代码并存差异如实注）
7. 轮 vs 点火 vs 进化三词辨析（M6/M9 收敛语义）
8. W48 一日进化实录（loop 首跑→resume10 谱系·9 轮 6 红→resume9 全绿·五条教训）
9. 十条常见误区+自测（测试命令/口测三门/读卷练习）

## §三 · 对齐面（代码/纪律真源逐条实勘）

- 代码：`TriRMC/src/fade001/round_runner.ts`（465 行）·`chain_runner.ts`（260 行）·`charter_generator.ts`（188 行）·`scripts/fade001-ignite.ts`；`TriCompany/runtime/cognition/{activation_gate,preflight,qualify,loop_joint_review_spawn}.py`·`fade001-dimensions-v1.json`（31 维实读）
- 条款：M1-M9 正身 `w48-migration-joint-review-20261123/cos-loop-spec-gate-update-20261123.md`；runId 门号 `fade001-evolve-20261123/cos-runid-gate-cos-half-20261123.md`+`cto-runid-gate-form-20261123.md`；门件 SOP `TriCompany/docs/workflow/round-gate-sop-20261123.md`
- DP 谱系：DP-016 正则四形/DP-019 seat 治理/DP-020 拆分生成/DP-021 判级两阶段/DP-022 段号错位（在办）/DP-024 R10 批——全部逐条入教程（07 §二/§六·08 §二/§四/§八）
- 如实注三处：①M3-v2 双对象门槛×代码 flag 边 aggregate average 并存未对齐（08 §2.2）②M9「FUSE 仅 test」按态分支待对表（08 §2.3）③A/B 对象语义两套口径并存=潜在错配源（08 §4.4·CAO/CHO 示警·冻结窗统一候办）

## §四 · 约束遵行

- 教程线零触链：payload/jobs.json/daemon/链面脚本零触碰（纯文档面）
- 术语用协议正名：FADE/FADE-001/loop/runId/DP/ceo-ruling/charter/activation_gate/preflight/qualify/FUSE/comparability
- 历史冻结：01-06 既有叙事零改写（仅 README/01 增导航指针）；封存形三件只补头注（11-15 批已定形，本批不动）
- D-47：卷面时点锚=git commit 时戳；引用时点=date 现查原值

## §五 · 修订读数（本批）

- 新增：`07-trigger-and-ignition.md` + `08-loop-evolution.md`（两新件·行数见 commit diff）
- 修改：`fade-001/README.md`（v2.2.0+批注记+八篇导航+学习路径 step6/7+11-23 增补段）·`01-beginner-guide.md`（往下读加两行）·`docs/training/README.md`（中央索引行）·`docs/engineering/fade-registry.md`（FADE-001 条 v2.2.0）
- 卷锚：本批 commit（随批落链·`git log --oneline -1 -- docs/training/fade-001/` 可查）

## §六 · 候办/next_agent

- ①BOD/COS 验收：两章内容面（大纲+如实注三处）候阅；DP-025 销账候 receipt
- ②DP-022 对表卷：CTO/CAO 出卷后，07 §六 映射表随批对表（RDT 教程面义务）
- ③M3-v2×代码对齐卷/M9 按态分支：CTO 对齐后 08 §2.2/§2.3 差异注随批收敛
- ④A/B 口径冻结：冻结窗统一后 08 §4.4 随批正名
- ⑤后续协议/loop 条款升版：教程随批对表（长期义务·联动承诺照 11-15 批恢复兑现形）

## 使用依据

- 令源：CEO 直令（BOD 转）+COS DP-025 补号（19:59·台账 dispatch-ledger 第 88 行）
- 真源实勘（2026-11-23 本批逐件）：round_runner/chain_runner/charter_generator/fade001-ignite/activation_gate/preflight/qualify/loop_joint_review_spawn/fade001-dimensions-v1.json + M1-M9 卷/runId 双半卷/round-gate-sop/dispatch-ledger/W48 签发表/维度冻结卷/R10 呈批卷
- 纪律：D-46/D-47/D-88/D-86

—— RDT 小吴（m-rdt·DP-20261123-025 教程更新·教程线零触链）·卷面时点锚=git commit 时戳（零手打·D-47 正形）

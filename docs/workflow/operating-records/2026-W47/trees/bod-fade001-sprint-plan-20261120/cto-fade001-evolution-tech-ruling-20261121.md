# CTO 技术定谳卷·fade-001 自进化修复四块（CEO 九点令·段3/8 spawn 化+flag 状态机+评分机制+正则暴露形·方案+任务书技术正身·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-fade001-evolution-tech-ruling-20261121.md·技术定谳正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 15:4x 九点令（BOD 转达·COS 联审召集 16:05）+本席接令 8f75493b
- 本席自领两件: ⑤折算裁（9d3fd948·59/59 折算）**撤回**→暴露形；②两席（b596ece00「源码锚」校正）**撤回**→恢复七席（源码现状≠设计真源）

## §〇 · 现状勘定（本席实勘·三处）

- T1-1 正则=`^shift-W\d+-\d{8}T\d{6}Z$`（score_engine.py L71·a2c246908 原样·无 loop 段=缺陷源·L134 错误文案=今日 B 族 fail 原文出处）；
- STAGES 十段（chain_runner.ts）：段 1 preflight·段 2 qualify·**段 3 plan_scope**（CEO 令「plan_skill」用词勘正=plan_scope）·段 4 dce·段 5 verify·段 6 score·段 7 score_skill（score_skill_spawn.py·SEATS 现两席）·段 8 close_skill·段 9/10 收口面；
- flag 四态（prod/test/debug/联审）=**现无状态机**（现状仅「≥95→prod」单边自动+FUSE round_count>=8 干熔断）→CEO ③④=新设计。

## §一 · 块① 段 3/段 8 spawn cos 化

- **形**：复用 score_skill_spawn.py 模板造 `plan_skill_spawn.py`/`close_skill_spawn.py`（单席 SEATS=("cos",)·同 dsh headless·同 overlay 基建·段 3 产 plan.json/段 8 产 close.json）；
- **护栏**：产物 schema 校验不变（下游契约稳=关键）；段起跑前置断言照 STAGES output 机制；
- **风险**：链时长↑（每段 spawn 增量≈单席耗时）→**stageTimeoutMs 重裁**（spawn 段 1800s 分段设值·非全链统一）；
- **回滚**：段 3/8 保留 CLI 形（spawn/CLI 双形 flag 可切=灰度形）。

## §二 · 块② 七席 spawn（两席→七席）

- SEATS 元组→七席（COS/COO/CAO/CPO/CTO/CHO/CFO）·absent 判据自动适配（L125「七席全 absent=rc=2」逻辑天然支持）；
- **串行执行**（GLM 单跑纪律族·今日 GLM 92% 教训照役·七席并发=7 dsh 进程风险面）——预计≈25min/轮；
- **成本面候 CFO**（七席×3.5 倍 token）；**回滚**=SEATS 形参化（env/配置可切两席/七席）。

## §三 · 块③ flag 状态机（回退边+进化闭环·CEO③④）

- **四态**：prod / test / debug / 联审（debug 内嵌联审）。
- **六边**：①prod ≤95→test（自动回退）②test 8 轮未回 >95→debug（自动）③debug=7 席联审产出意见→CEO 融合→test（人机环）④CEO 可令 test（手动）⑤test >95→prod（自动·既有边保留）⑥prod 周日正常迁移（既有 cron 面）。
- **技术设计两件**：a) 状态载体=runner-state 扩展（flag 字段+轮次历史数组）b) **FUSE 真融合落点**=debug 轮产出 `opinions.json`（七席意见结构化）→下轮 spawn 的 context 注入（prompt 面带意见→真影响下一轮生成·替代干熔断）。
- **风险**：新状态机与在役 round_runner/FUSE 交互（须兼容设计·禁破坏在役首轮停点/门面）；**回滚**=flag 开关回单边形（≥95→prod 独存形）。

## §四 · 块④ T1-1 暴露形（禁折算遮掩·CEO⑤）

- a) **rubric 修形**：正则改 `^shift-W\d+(-loop)?-\d{8}T\d{6}Z$`（一行·先做·根治 loop 形拒判）；
- b) **暴露形**（替代折算）：原值 37/59 保持不变·score.json 加 `rubric_defect` 标记字段（T1-1/run_id 形缺 loop 段）+fail 文案标注缺陷→**评分面显式暴露→评审提改进→rubric 演进闭环**——**账面分数不遮掩判据缺陷**（CEO 价值判断=评分可观测性高于账面满分·本席折算裁错误照单接受）；
- **回滚**=正则一行 revert。

## §五 · 块⑤ 评分 100 制+可观测提升（CEO⑥⑧）

- 七席×100 制重构：每席总分 100（I1/I2/I3 子项加权映射·现行 I 读数→百分比化）；
- **轮次趋势线**：state 存历史分（每轮每席 total）·**提升判据=debug 态 8 轮窗口滑动均值单调上升**（与 CEO 8 轮上限对齐·⑧「分数可观测提升」的判据形）；
- 意见真带入（CEO⑦）=块③ b) opinions.json 注入面（同源）。

## §六 · 工序序+时间现实评估（如实·不虚报）

| 序 | 块 | 工作量 | 18:00 前 |
|---|---|---|---|
| P1 | T1-1 正则修形（一行） | 分钟级 | **可落** |
| P2 | 七席 SEATS（一行+验证·成本候 CFO） | 小时级内 | **可落** |
| P3 | 段 3/8 spawn 化（两新脚本） | 中大型 | 方案+任务书·分段 |
| P4 | flag 状态机（四态六边+意见注入） | 中大型 | 方案+任务书·分段 |
| P5 | 100 制+趋势线 | 中 | 方案+任务书·分段 |
| P6 | FUSE 真融合（opinions 注入） | 中（依赖 P4） | 方案+任务书·分段 |

**如实呈 CEO**：全四块 18:00 前全实现不现实（>2h 工作量）。**「破例施工」=开工不候门·非全部完工**→建议=**P1/P2 即落（COO 派工→fsd 施工→本席终审）+P3-P6 方案任务书 18:00 前达面·分段施工逐段终审**。

## §七 · 风险与回滚总账

风险：①七席成本×3.5（CFO 面）②链时长×2-3（timeout 分段重裁）③段 3/8 spawn 化产物质量=依赖 cos 席位能力（与 CLI 形对比需验证）④flag 四态与在役 FUSE/round_runner 交互（兼容设计硬门）。
回滚：全件 bak 三形（git/文件/源码）+**四开关**（spawn/CLI 双形切·两席/七席切·意见注入开关·flag 切换）+正则一行 revert。

## §八 · 使用依据

CEO 九点令（15:4x·BOD 转达）+COS 联审召集（16:05）+本席接令 8f75493b+实勘（score_engine.py L21/L71/L134·chain_runner.ts STAGES L73-111·score_skill_spawn.py L24/L125）+D-15/D-24/D-27 v4/D-46/D-47/D-76/D-84。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

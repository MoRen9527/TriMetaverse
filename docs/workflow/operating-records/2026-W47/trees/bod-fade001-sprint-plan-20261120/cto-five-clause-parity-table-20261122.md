# CTO 一页对表·CEO 五款目标形 vs 现实现差距（任务书合并材料·先不改码·2026-11-22）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-five-clause-parity-table-20261122.md·对表正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 完整澄清五款（BOD 转达·照录）+CEO 明令「**先不要着急改**」——本卷=任务书合并材料（COS 主笔·本席技术面随卷）·**零施工**

## §一 · 五款对表（目标形照录 vs 现实现 vs 差距落点）

| 款 | CEO 目标形（照录） | 现实现 | 差距+落点 |
|---|---|---|---|
| **① 段 3 plan skill** | 「段3 plan skill=spawn cos 主导（做任务书调动团队完成周迁移+**出主观题和客观题**）」 | `plan_scope.py`=纯 CLI（程序规划·零 spawn·无出题职能） | ①段 3 脚本 **CLI→spawn cos**（P3 的 `plan_skill_spawn.py` 已有·灰度 env `FADE_PLAN_SPAWN`——目标=默认 spawn 形）②**cos 职能面扩=新设计**：出任务书（调动团队完成周迁移）+**出主观题（供段 7 判）+出客观题（供段 6 判）**——题面内容设计=新件 |
| **② 段 7 score skill** | 「段7 score skill=spawn 两席（cos initial+coo joint）评判主观题考分（语义类程序无法判故需 agent）·客观题由段6 score_cli 程序判」 | **P2 已装七席 SEATS=错**·原两席=正形；段 6 score_cli 程序判客观=已如此 | **P2 回滚=SEATS 恢复 ("cos","coo")**（env `SCORE_SKILL_SEATS` 一键·零码面·**可即行**——本席勘定卷 43a6dfa08 已裁）·段 7 只判主观题 ✓ |
| **③ 段 8 close skill** | 「段8 close skill=spawn cos 收口」 | `close_skill.py`=纯 CLI 现役；P3 的 `close_skill_spawn.py` 已有（灰度 env `FADE_CLOSE_SPAWN`） | 默认形 flip（env→默认 spawn·小件） |
| **④ 段 10 后七席联审** | 「段10 结束后才是七席联审：两维度综合评价（**周工作平面迁移质量 + fade-001 本身工作质量**）→改进意见→**入下一轮 fade-001 代码和 skill 优化=自进化**」 | **无此段**——P4 的联审机制（opinions/钩子/生成器/挂载）**tie 在段 7 评分面（误装）** | **新建面=loop 尾段·七席联审（loop 层·fade-001 十段全毕后自动发起）**：a) **位置=整个 fade-001 十段全毕后·loop 层自动发起**（不在 fade 内·无「段 11」概念·fade 规范=十段标准完整）b) **P4 组件复用**（opinions 产出器/`tryCharterHook`/生成器/挂载 choreography——逻辑在·tie 位从「段 7 debug 态」移到「loop 尾段联审」）c) **两评价对象+每席维度=新设计**（见 §三）d) 产出 improvements→任务书→下轮代码/skill 优化（自进化闭环） |
| **⑤ 严禁混** | 「段7 两席与七席联审**不是一个阶段严禁搞混**」 | 混了（七席装段 7） | P2 回滚+段 11 独立=两机制分离（本席勘定卷 43a6dfa08 §二 两机制表） |

## §二 · 段 3/8 spawn 化落点（P3 存量对表）

- **已有存量**：`plan_skill_spawn.py`/`close_skill_spawn.py`（P3 已落·cos 单席·形照 score_skill_spawn 模板·灰度 env 面 `FADE_PLAN_SPAWN`/`FADE_CLOSE_SPAWN`·零默认变更）——**基建面齐**；
- **距目标差距**：①**默认 flip**（env→默认 spawn 形·两处一句改）②**段 3 职能面扩**（cos 出题：主观题+客观题生成·新 prompt 内容面）③close 收口语义照 CEO 款③（cos 收口·现缺=收口内容面可能需按目标扩·候联审段对接）。

## §三 · loop 尾段联审新建面（loop 层·层级分离注）

**层级分离（CEO 勘正）**：**fade 规范（十段·标准·十段即完整）/ loop 规范（轮编排+联审+进化）=两层分离**——七席联审属 **loop 层**（fade-001 十段全毕后自动发起）·**现阶段不设段 11**·未来把 loop 规范写入 fade 规范=后话。

1. **tie 位移**：P4 全套（flag 四态/opinions 注入/钩子/生成器/挂载）=逻辑保留·**触发位从「段 7 debug 态旁」移到「loop 尾段（十段全毕后自动发起）」**——loop 层轮编排末钩挂联审；
2. **评价结构（CEO 补充）**：**两评价对象**（周迁移质量 + **fade-001 本身工作质量**——**非改进意见面**〔改进意见=产出面·评价=输入面〕）× **每席各≥3 部门维度**（每席按本部门职能出 ≥3 评价维度·对两对象共同角度评价）+ 每席 100 制 + `improvements` 五字段（A/A3 位置效应经验迁移）；
3. **自进化环闭合**：improvements→任务书（生成器）→CEO/COS 批→挂载→下轮代码/skill 优化（现 P4 组件·tie 位移后即通）；
4. **A3 经济性**（77min/轮 2.4x）：联审=loop 尾段一次（非每轮多轮）→频率低·成本可接受（候 D vs A3 复盘对照）。

## §四 · 时序节点核对面（CEO 待验）

CEO 明示「完成后点火下一轮验：**时序节点是否全正确+分数是否提高=进化**」——核对面预告：
- **时序节点核**：段 3（spawn cos 出题）→段 6（score_cli 判客观）→段 7（两席判主观）→段 8（cos 收口）→段 10→**loop 尾段·七席联审（loop 层·十段全毕后自动发起）**——逐段 stages_run 顺序+产物真值+层界（fade 十段内/loop 层外）；
- **分数提高核**：轮次趋势线（P5 的 trend.jsonl·8 轮窗口）——联审改进→下轮分数升=进化判据。

## §五 · 使用依据

CEO 五款（BOD 转达照录）+本席勘定卷 43a6dfa08（两机制分离）+P2 卷（SEATS 七席实施面）+P3 卷（plan/close spawn 存量）+P4 卷（flag/钩子/生成器/挂载组件面）+A/A3 卷（位置效应+经济性）+D-15/D-24/D-27 v4/D-46/D-47/D-76/D-84。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

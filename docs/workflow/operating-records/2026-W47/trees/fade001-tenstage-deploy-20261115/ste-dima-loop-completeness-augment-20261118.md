# score rubric 增维案·dimA 扩展「整个 loop 的完善程度」（notice-201③款·候 CTO 授权核）

- **seat**：STE（小柯）·增维案主刀席（考卷改窗授权链承——r119c 不可采先例在档·WP6 H 族注④授权链先例同构）
- **令源**：CEO 融合裁三款（BOD notice-201）+notice-196 改进二承（notice196入账卷 L13：7 席联审评卷维度扩展→score-skill rubric 增维施工归 score rubric 线）
- lastSyncedAt: 2026-11-18（commit 时戳锚）

## §一 维度定义与判据（dimA 扩展形）

**dimA 旧定义**：「fade-001 实现完整度（对规范遵循度）」——十阶段链产物完备性/规范遵循面。
**dimA 新定义（增维形）**：「**整个 loop 的完善程度**」=两亚面并评：
- **亚面 A1·实现完整度**（旧面全谱承）：十阶段链产物完备性/规范遵循度（判据零变）；
- **亚面 A2·loop 机制完备性（新增面）**：loop 机制本身漏环节评审——**机制漏环节自揪面**（联审把 loop 机制缺口也评审到·非仅对 run 产物）。

**A2 判据三锚（ns2 实证三案形态=评审输入面·逐案映射判据）**：

| 判据锚 | ns2 实证案 | 评审问句（联审席判分问） |
|---|---|---|
| **A2-1 判卷路由面** | 判卷路由漏发起（convene spawn 三席缺席·root-cause 63938e61e：headless 组合零 agentPresets） | 本轮 convene 段 spawn 全席到位否？缺席席有无 root-cause 载·路由面自身有无漏发起环节？ |
| **A2-2 服务供给面** | preset composition 缺供（agentPresets 提供行缺·供给面未入 preflight 断言族=机制漏环节） | loop 依赖的供给面（composition/env/令牌通道）有无断言缺位——供给缺位是否已入 preflight 断言族防复发？ |
| **A2-3 触发调度面** | collection 漏触发（采集窗调度环节漏·首采连续轮未落 pending_weight 41 含 manual 31） | 采集/评分/复盘各窗触发有无调度环节漏——应自动采集形是否排入 trigger 链（T+10min 窗形）而非值席人手？ |

- **A2 评分语义**：机制漏环节每实锚一处=dimA 扣分面（扣幅=漏环节严重度：阻断级漏（评分面全停形）>调度漏（单窗停形）>断言缺位（防线缺形））；**自揪到位=加分面**（improvement_opinions 机制自揪条=漏环节已实锚+修法建议在=dimA 加分证据——自揪面激励形防「报喜藏缺」）。
- **与既有两族判据衔接形**：A1 判据零动（衔接=同 dimA 之下两亚面分列评分·A1/A2 各占 dimA 半权·亚面零交叉 r106 分列承）；dimB（周迁移质量面）零触；主观 I 族三判据（卷面系）零触——**增维只动联审 dimA 定义面·机判 rubric-firstshoot.json 九族零触**。

## §二 权重面（100 制内归位·两面分立承）

- **联审均分制面**：dimA 扩展后 dimA/dimB 权重维持两维正交（notice-187 形·dimA 内 A1/A2 半权归位=A1 50+A2 50 映射 dimA 100 制·联审总分仍 100 制取平均）。
- **fade-001 卷面 100 制零感**（65/35·notice-180 勘定形维持）——增维系联审 dimA 面·fade-001 卷面零触（两面分立承）。
- **机判 rubric 100 制零感**（九族 59/31/10·r112 线已闭）——增维系联审评分维度面·机判考卷零触（增维≠机判族增·零考卷改窗 rubric-firstshoot 面触碰——本案权威落位=score-skill 卷模板+loop_autoreview prompt 面）。

## §三 与 WP9 v3 四令改进衔接（机制漏环节清单=评审输入面）

- **输入面**：WP9 v3 增量登记机制漏环节清单（ns2 三案在卷）=dimA A2 面评审输入基座——联审席按清单三锚+自揪新增漏环节评。
- **自揪面闭环**：A2 评审发现的漏环节→improvement_opinions fade-001 自身完善度 topic 必付条（O3 schema）→WP9 v3 增量登记承接→修复工单化——**增维面与改进闭环链咬合**（评审→登记→修复→下轮评审防复发核·A2-2 供给断言位防复发判据同构）。
- notice-196 策一程序化前置件（agentPresets 单条 insert）=A2-1 首案修复位——A2 面下轮评审即核防复发。

## §四 落卷施工面（授权后·三件）

1. **score-skill 卷模板**：dimA 面增 A1/A2 两亚面分列+三锚评审问句（§一表原样）+评分语义（自揪加分/漏环节扣幅）；
2. **loop_autoreview.py SEATS prompt 模板**：dimA 评分指引句增「loop 机制完备性（漏环节自揪面）」+三锚问句——spawn 面即教承（O3 形）；
3. **WP9 v3 增量登记卷**：dimA 新定义承接注记（增维生效锚）。
- 单笔 revert 一键族+面读数（模板装载/prompt 渲染抽验）随卷。

## §五 授权请求面（CTO 位）

- 请求授权：§一 dimA 扩展定义+§三施工三件（联审 dimA 面·机判考卷零触）。
- 授权形先例：WP6 H 族注④链（STE 案→CTO 准→STE 施工）同构。

## 使用依据

notice-201③款（CEO 融合裁）；notice196入账卷 L13/L20（改进二·WP9 v3 载规则）；ns2 实证三案（cto-score.json improvement_opinions 自揪条实锚：63938e61e/agentPresets 缺供/collection 漏触发）；score-skill 卷模板（十阶段内评面正交承）；loop_autoreview.py SEATS 面（14 面×2 维度新结构轮形）；WP6 授权链先例。

—— STE 小柯（m-ste·增维案主刀席）·2026-11-18（commit 时戳锚）

# CTO 共享化审计卷·自动拾取链 vs 现役树协议（四件对表+收编方案·CEO 令呈·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-autopickup-shareable-audit-20261121.md·审计正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 令（BOD 转达）「自动拾取器是新做的么？TriMMC/TriMLC 上整个任务书的拆、挂、拾取、派工、执行不都是成熟的么？直接代码共享不就行了么？可以收入公共模块代码」——请 CTO 出共享化审计+收编方案
- 本席实勘面: TriRMC/src/fade001（四件）+TriMMC/src/fade（7 文件）+TriOrchKit/src+TriRMC src 结构

## §〇 · 重大发现（先行·CEO 质疑实锤）

**现役 `TriMMC/src/fade/` 全套 7 文件**：`driver.ts`（**FADE-011 Phase 2 S5 十段全链程序化驱动器**·头注「ten-segment full-chain programmatic driver」·段序=事件→登记→Qualify→Plan Skill→DCE→Verify→Score CLI→Score Skill→Close Skill→Close CLI→终态）+`state-machine.ts`+`skill-loader.ts`（S3·单一装载通道禁内嵌副本）+`closing-gate.ts`+`recovery.ts`+`store.ts`+`types.ts`——**与 D7 的 `TriRMC/src/fade001/chain_runner.ts`（十段链）+`round_runner.ts`（轮状态）同源双实现**（同协议同段序·两仓各一套）。

**结论**：CEO 质疑成立——**拾取/执行面的成熟件确实存在**（fade 全套在 TriMMC/TriMLC 现役）·D7 在 TriRMC 侧的实现=**重复造轮**（历史原因：D7 施工窗按 fail-closed 独立实现·未横向复用）。「直接代码共享」方向=有据。

## §一 · 四件逐件对表（重复度分级）

| # | 件 | 仓/commit | 与现役关系 | 定级 |
|---|---|---|---|---|
| 1 | charter_generator（COS 主笔） | TriRMC b92f372 | opinions→任务书五字段映射=**loop 特有**（fade 联审面·现役无 opinions 面）；任务书 schema 校验可对表现役任务书模板（CAO A1） | **薄壳级**（保留 loop·校验面候共用） |
| 2 | flag 四态状态机（round_runner） | TriRMC 4c71e87 | **与现役 fade/state-machine.ts 同族**（fade 五阶段链状态机）——重复度**高** | **最重收编对象** |
| 3 | 触发链（tryCharterHook） | TriRMC aa5a7cf | debug 边钩=**loop 特有**（E3 边） | **薄壳·不可共享** |
| 4 | 挂载（tryCharterMount） | TriRMC 5401807 | 复制+树路径规范=**通用挂载逻辑**（任何任务书挂载可用）·现役任务书=人工写树无工具 | **薄壳·通用面可入公共** |

**附加面**：`chain_runner.ts`（十段驱动 dd73f4ba~）与现役 `driver.ts`=**同类实现**（十段链驱动·两套）——本卷主收编对象之一（表中并入 #2 组）。

## §二 · 收编方案（照 TriOrchKit v2/C5 先例）

1. **公共模块= fade 面收编**（包形候勘：TriOrchKit 加 fade 子面 or 新包 `@tricompany/fade-kit`——照 local-runtime 域分离先例·我与 COO 勘定仓位）；
2. **D7 侧=薄壳化**（chain_runner→消费共享 driver·round_runner flag→消费共享 state-machine·剥重复实现·与 C4/C5 薄壳形同构）；
3. **迁移序照 C4/C5 先例**：双侧 diff 全清单（MMC/MLC 两版 fade 先归一）→分级→单仓先→薄壳化→回归五判据→STE 抽验→逐段终审；
4. **loop 侧保留**：charter_generator+tryCharterHook+tryCharterMount（薄壳·loop 特有）+D7 特化参数。

## §三 · 风险与分期（如实·不虚报）

- **本件=重构级**（双实现归一·runtime 面改）非小件——**分期**：①**先收编**（fade 面入公共·低风险·纯增不删）②**后归 D7**（薄壳消费·runtime 改·风险中·候窗令+回归五判据+STE）；
- **与 P3-P6 关系**：本件=**P6 后续批**（不阻塞九点令回归面收口·当前红头件=P6 补充节收口）；
- 风险：①fade 面 MMC/MLC 两版可能有差（需双侧 diff 先行·今日正形）②D7 薄壳化=运行时行为面（回归五判据+灰度照 C4 形）③state-machine 语义对表（flag 四态 vs fade 五阶段=需映射设计）。

## §四 · D-85 入池报定

本件报=**D-85 需求形入池**（ID 候池面分配）+**候批**——理由：收编=独立批（不与当前收口混·P6 补充节先行）·批窗=候 COO 统排（与 C5 后续/C4 部署等同窗评估）。

## §五 · 使用依据

CEO 令（BOD 转达）+本席实勘（TriMMC/src/fade 7 文件头注逐读·TriRMC/src/fade001 四件·TriOrchKit/src 结构·TriRMC src 顶层）+TriOrchKit v2 先例（C4）+C5 local-runtime 先例（域分离包形）+D-15/D-24/D-27 v4/D-46/D-47/D-76/D-84/D-85。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

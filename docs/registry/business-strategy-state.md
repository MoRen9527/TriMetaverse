# Business Strategy State

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/business-strategy-state.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

## 长期商业模式主线

当前文件是 TriMetaverse 中央 `BusinessStrategy` 工作层的本地真源，只维护当前总商业模式状态、默认经营实验和中央优先模块摘要；它不是 TriCompany 公司级 workflow 书面真源。

TriMetaverse 的长期商业模式主线保持为：

`内容入口 -> 参与转化 -> 服务变现 -> 生态回流`

这条主线以 `tmv-whitepaper.md` 和 `tricompany.md` 为真源，不在本文件内重新定义白皮书级概念。

## 当前默认经营实验

在没有新的人工确认前，当前默认经营实验采用 `tricompany.md` 中离收入最近的方向 A：

- `AI 内容运营与增长微服务`

这是一条用于跑通虚拟公司最小闭环的默认试点，不代表长期唯一方向。

## 当前优先模块

第一轮核心模块：

- `TriMetaverse`
- `TriMC`
- `Tristaciss`
- `TriLC`
- `TriPilot`
- `TriCode`
- `vscodium`
- `Triavatar`
- `TriAuto`
- `TriTest`

结构预留：

- `TriModel`
- `TriSkill`

首版占位：

- `TriMobile`
- `TriMem`
- `TriWeb4`
- `TriChain`

## 当前阶段基线

当前 agent 体系处于 `Phase 0 / Phase 1` 之间：

- 已开始建立中央 Strategy Registry 和根目录委派入口
- 目标是尽快让 `CEO总助 Agent`、`产品总裁 Agent`、`CFO Agent`、`CTO Agent` 围绕首轮试点跑通闭环

## 特别边界

- 虚拟公司是所有人格 Agent 与非人格 Agent 的经营和交互核心载体，不再单列第三主控基础设施语义。
- `TriMC` 是公司级云端实体，承载整个公司运行面：共享公司知识体系、运营公司业务、发放公司奖励、审计相关活动；托管无人值守工作流作为其运行切片。`TriLC` 作为分布式员工工位负责本地人机协作。
- `Tripilot`、`Tride` 与 `vscodium` 在产品能力域上共同属于 PC 端软件层，但 registry 实体保持独立。
- PC 端软件层既配合 `TriLC` 完成本地化任务与本地工具执行，也面向用户提供可直接使用的 PC 自动化、桌面工具和 `vibe coding` 入口。
- 当前 shadow 与正式接管都直接运行在 `copilot` 宿主上；正式切换通过 `TriModel` 配置实现。
- `TriSkill` 作为未来统一 skill 提供模块进入边界预留，但当前不视为首轮试点阻塞项。
- `core-agent` 只作为 `TriMC` 的历史 observability 迁移源，不进入首轮经营链。
- `Tristaciss` 的模块级委派入口先以 `CLAUDE.md` 派生 `AGENTS.md`，后续再由 `TristacissProductRegistry` 建立 README 基线。

## Sources

- `../../tmv-whitepaper.md`
- `../../tricompany.md`
- `../../project.md`
- `../workflow/tricompany-agent-roles.md`

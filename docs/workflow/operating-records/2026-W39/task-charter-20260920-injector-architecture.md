# 任务框架·注入器架构统一命题（CPO×CTO 联合续篇）

- sourceOfTruth: 本件=董事会命题书（CEO 2026-09-20 22:23 令结构化）
- syncMode: static
- lastSyncedAt: 2026-09-20 22:2x
- 上位令: CEO 22:23（TriRLC 有注入审计表，TriMLC 该对齐吧？TriMMC/TriRMC 也该有？还是四条注入管道、注入器单提共用模块？归谁或系统自动决策注入？CPO×CTO 联合出方案和意见）
- 前序: 认知资产审计联审（joint-plan edbd2e58+首落批）——本命题为其注入面架构延伸，同一双席组合续办
- 节奏: 照认知资产联审惯例（先方案后落实；本命题含实勘前置）

## 一、CEO 四问结构化

1. **对齐问**：TriRLC 有注入审计（knowledge_consumption），TriMLC 是否该对齐？
2. **服务域问**：TriMMC（M面服务域）/TriRMC（R面服务域）是否也该有？
3. **形态问**：还是四条注入管道各建？或**注入器单提为共用模块**（一份，各 daemon 调用）？
4. **决策权问**：注入与否归谁——归模块 owner？还是**系统自动决策**（按席位需求/profile 规则自动注入）？

## 二、BOD 预勘实锚（联审起点，可复核）

- 注入器四件：inject.ts（注入逻辑）/knowledge-db.ts（审计记账，knowledge_consumption 表现役）/metrics.ts（观测）/sync.ts（同步）——物理在 `TriRLC/src/knowledge-injector/`。
- 消费方三处（TriRLC 仓内）：session-initializer（**会话初始化注入=13 席喂食路径**）/contract-resolver/agent-runner（心跳 agent 运行）。
- **错位实锚**：13 席系 M 面班底，其会话喂食物理依赖 TriRLC（R 面本地域）仓组件——按双控制器定性（MLC=M面本地/RLC=R面本地），归属与服务对象错位。错位的深浅（TriMLC 是否有并行实现/TriRLC 组件是否被跨面复用）=联审实勘第一项。

## 三、联合命题

- **命题 A·实勘**：四 daemon（MLC/RLC/MMC/RMC）注入能力现状矩阵——谁有注入器/谁在喂谁/重复度/共享度（含 sg 侧 TriMMC 是否有注入面）。
- **命题 B·形态裁**：三案并评（各 daemon 内嵌 vs **共用模块单提** vs 中心注入服务）——判据含：单一真源/面隔离语义（M/R 面并行无退役）/维护成本/审计一致性。
- **命题 C·决策权**：注入触发归谁（席位自请/daemon 按 profile 自动/混合）——与 §12.6 派工同步前置、binding profile 体系衔接。
- **命题 D·审计对齐**：knowledge_consumption 表四端统一或集中（认知资产审计联审首落②改判的延伸——审计面不因四端分叉而碎）。
- **命题 E·衔接**：与 p2 消化管道、认知资产双腿、kernel 收编（候触发项）的衔接图。

## 四、产出与流程

1. 实勘件（命题 A）→方案件（命题 B-E，CPO 产品视角+CTO 技术视角双栏）→联合合流双签；
2. 落树 `trees/injector-architecture/`；呈 CEO 候批；
3. 接单认领即时回 BOD；实勘件时点双席商定。

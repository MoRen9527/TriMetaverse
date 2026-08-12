# 动态任务树协议 — TriMetaverse 项目实例

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/dynamic-task-tree-protocol.md (V0.5)
- syncMode: published-summary
- lastSyncedAt: 2026-08-12
- manifestEntry: project-source-doc-sync-manifest.json #dynamic-task-tree-protocol-summary

> 本文是 TriCompany 公司级协议在 TriMetaverse 项目的 published-summary。完整协议正文以 TriCompany 真源为准，本文件仅记录 TriMetaverse 项目的落位适配。

## 1. 协议概要

动态任务树是 TriCompany 的公司级组织编排协议（V0.5），定义：

- 公司角色与组织责任（CEO → CEOChiefOfStaff → 专业 owner → 执行节点 → 机器路由层）
- 树/节点数据模型（含 routedInput 交接引用、checkpoint 存档结构）
- 状态枚举与状态机（pending → in_progress → done | escalated）
- Git 触发交接机制（commit 即交接信号）
- 执行恢复机制（崩溃后从 checkpoint 幂等续跑）
- 多树并行调度（树间无共享可变状态，根节点统一调度）

## 2. TriMetaverse 项目适配

### 2.1 本地 adapter 路径

- 树实例：`docs/workflow/operating-records/<week>/trees/<treeId>/tree-op.json`
- 导出：`docs/workflow/tree-nodes-export.json`
- 校验：`scripts/validate-tree-status-enums.ps1`
- 导出：`scripts/export-tree-nodes.ps1`

### 2.2 当前项目角色映射

| 公司角色 | TriMetaverse 实例 |
| --- | --- |
| CEOChiefOfStaff（根节点） | 小贾（当前 .github binding 宿主） |
| CPO | 小乔 |
| CTO | 小狄（xiaodi-m2） |
| FullStackDeveloper | 小全（dev-xiaoquan） |
| TestEngineer | 小柯（test-xiaoke） |

### 2.3 当前树实例

| 树 | 周期 | 状态 |
| --- | --- | --- |
| w33-weekly-migration-ade | 2026-W33 | 已收口 |

## 3. 协议变更治理

- 协议本体变更走 TriCompany 真源 → CPO/CTO 联审 → 本文件追平 lastSyncedAt
- TriMetaverse 项目只能扩展 adapter 路径，不得在项目侧独立改写公司核心状态语义
- 新树创建由 CEOChiefOfStaff（小贾）根节点执行

## 4. 关联文档

- 真源：`TriCompany/docs/workflow/dynamic-task-tree-protocol.md` V0.5
- 发布清单：`TriCompany/.github/manifests/project-source-doc-sync-manifest.json`
- ADE 执行规范：`TriCompany/docs/engineering/ade-pattern-spec.md` v1.4
- 收口门禁：`docs/execution/trilc-capability-checklist.md` §五

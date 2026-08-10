# 动态任务树协议：TriMetaverse 项目摘要

版本：V0.4-summary
日期：2026-08-07
状态：TriCompany 公司协议的 TriMetaverse 项目实例摘要

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/dynamic-task-tree-protocol.md
- syncMode: published-summary
- sourceRevision: sha256:9a9b8ffe5b80f51cc32ca2e7c99397cb7bf943b3c771bf92aff3a2656af922cd
- lastSyncedAt: 2026-08-07

## 1. 项目定位

动态任务树属于 TriCompany 公司维度，用于跨项目复用员工路由、节点流转、升级与收口协议。完整协议由 [TriCompany 真源](../../../TriCompany/docs/workflow/dynamic-task-tree-protocol.md) 维护。

本文只记录 TriMetaverse 当前项目实例的落位、宿主适配和恢复入口，不在中央仓独立修改公司核心状态语义。

## 2. 当前项目角色

| 层级 | 当前角色 |
| --- | --- |
| 最终裁决 | CEO（磨人） |
| 组织编排与持树 | CEOChiefOfStaff（小贾） |
| 机器路由 | 当前 Copilot-host 默认 Agent；未来由 TriLC / TriMC 共享 runtime adapter 承接 |
| 专业 owner | CPO / CTO / CHO / CAO / CMO / COO / CFO |
| 执行节点 | 小全、小柯、小布、小吴、小成等执行岗位 |

机器路由层只检测并调用已有节点，不替代小贾创建组织节点或执行收口检查。

## 3. 当前状态合同

| 层级 | 有效枚举 |
| --- | --- |
| 树级 | `active / done / escalated` |
| 节点级 | `pending / in_progress / done / escalated` |

历史 `closed` 已废弃；节点历史状态 `active` 统一映射为 `in_progress`。

`next_agent = null` 时默认回到 `CEOChiefOfStaff` 做路由评估。执行节点应先尽力判断下一角色，不能把空路由作为默认结束方式。

## 4. TriMetaverse 项目落位

当前项目实例使用：

- 周索引：`docs/workflow/operating-records/<week>/OP-*.json`
- 树目录：`docs/workflow/operating-records/<week>/trees/<tree-id>/`
- 树定义：`tree-op.json`
- Git 恢复副本：`docs/workflow/tree-nodes-export.json`
- 导出校验：`scripts/export-tree-nodes.ps1 -Validate`
- 状态校验：`scripts/validate-tree-status-enums.ps1`

这些路径只属于 TriMetaverse adapter，不是未来所有项目必须复制的公司协议路径。

## 5. ADE 投影

公司协议 v0.4 允许 `tree_nodes` 投影以下可选字段：

```json
{
  "execution_protocol": "ade",
  "ade_run_id": "ade_...",
  "ade_profile": "runtime-owned-durable",
  "ade_terminal_status": "APPROVED",
  "ade_evidence_ref": "ade://runs/ade_.../close"
}
```

Trees 只记录谁负责、交付什么和 ADE 终态证据；ADE 内部 checkpoint、attempt、lease、signal 和阶段状态不进入 `tree_nodes`。

## 6. TriLC / TriMC 运行原则

TriLC 与 TriMC 应使用同一共享 Trees / ADE runtime 合同和状态机，只在本地域与服务域 adapter 上分化：

- TriLC：本地文件/Git/cron 触发、SQLite、本地 TUI、离线队列。
- TriMC：服务端 webhook/CI、PostgreSQL、服务端 Signal、集群 worker。
- 两域同步通过 `homeDomain / writeAuthority / version` 保持唯一写主，禁止双活写入。

## 7. 当前收口与恢复

每次完成节点或关闭树时，小贾至少检查：

1. `tree-op.json` 与周索引一致。
2. 状态枚举合法。
3. `done` 节点具有 `delivery`。
4. ADE 节点只有在 `ade_terminal_status=APPROVED` 时才能转 `done`。
5. Git 恢复副本已更新且可校验。

上下文丢失后，先从 runtime store 恢复；当前 Copilot-host runtime 不可用时，从 `tree-nodes-export.json` 重建并定位全部 `in_progress` 节点。涉及 ADE 的节点再查询其 canonical / authority run 状态，由 CEOChiefOfStaff 决定继续、回退、重新路由或升级。

## 8. 相关入口

- 公司协议：[TriCompany 动态任务树协议](../../../TriCompany/docs/workflow/dynamic-task-tree-protocol.md)
- ADE 规范：[TriCompany ADE 模式规范](../../../TriCompany/docs/engineering/ade-pattern-spec.md)
- ADE 完整蓝图：[TriCompany ADE 全生命周期实现蓝图](../../../TriCompany/docs/engineering/ade-full-lifecycle-implementation-plan.md)
- 当前恢复接口：[TriMC 恢复接口契约](trimc-recovery-interface.md)

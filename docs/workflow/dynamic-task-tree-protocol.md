# Dynamic Task Tree Protocol

> 版本：v0.3.1 | 建立：2026-07-17 | 修订：2026-07-21
> 关联树：TWF-001 / gov-tree-protocol-v2
> 
> **v0.3 变更摘要**：① 状态枚举统一（移除 closed，active→in_progress）② 新增总助路由兜底规则 ③ 新增执行节点尽力判断义务

## 角色

| 角色 | 谁 | 职责 |
|------|-----|------|
| 编排层 | CEO（磨人） | 手动切换 agent，执行节点工作，发出路由信号 |
| 机器编排层 | AGENTS.md（Copilot CLI 默认 agent） | 读树、检测 `in_progress` 节点、自动调用 employee agent、流转节点状态。不创建节点，不做收口检查 |
| 主 agent | 总助（小贾） | 持树、创建节点、记录状态、NULL 路由评估、收口检查、跨周迁移、ESCALATE 时延伸分支 |
| 执行节点 | CPO/CTO/CHO/... | 接收路由包，完成工作，建议下一节点 |

## 树结构

每棵任务树对应一个 OP nextAction，根节点为总助，叶节点为具体执行人。

数据模型：`task_trees` + `tree_nodes`（SQLite session 表），字段见下方。

## 信号协议

CEO 发出短信号，小贾接收后更新树状态。不回展开讨论，除非遇到 ESCALATE。

### 流转信号

```
CEO: "<当前节点> done → <下一节点>"
小贾: "📝 ✓ #<树ID>: <当前节点>→<下一节点>"
```

- 关当前节点（status=done），创建下一节点（status=in_progress），更新树 updated_at
- **路由兜底**：如 `next_agent = NULL` 或当前执行节点无法确定下一节点，默认路由到 `CEOChiefOfStaff`（小贾），由总助根据当前状态分派下一个岗位
- **执行节点义务**：执行节点在完成工作时，**应先尽力判断 next_agent**。只有在确实无法确定时（如跨模块边界不清晰、涉及多个候选岗位、需 CEO 裁决优先级），才允许留空。不应将 `next_agent = NULL` 作为懒惰默认

### 升级信号

```
CEO: "ESCALATE <树ID> <节点>: <原因>"
小贾: 展开讨论，延伸分支，可能回退/分叉/新增并行节点
```

### 查询信号

```
CEO: "<树ID> status"   → 返回树全貌
CEO: "trees"           → 返回所有活跃树列表
```

## 表结构

### task_trees

| 字段 | 说明 |
|------|------|
| id | 主键，对应 OP action ID 短名，如 'DA-004' |
| op_action_id | OP JSON 完整 ID，如 'NA-20260717-DA-004' |
| title | 任务树标题 |
| root_agent | 根节点 agent，默认 'CEOChiefOfStaff' |
| status | active / done / escalated |
| created_at / updated_at | 时间戳 |

### tree_nodes

| 字段 | 说明 |
|------|------|
| id | 主键，如 'DA-004-1' |
| tree_id | 外键 → task_trees.id |
| parent_node_id | 父节点 ID，根节点为 NULL |
| agent | 执行 agent 角色名 |
| action | 该节点要做什么 |
| status | pending / in_progress / done / escalated |
| delivery | 交付物描述（完成时填写） |
| next_agent | 建议的下一节点 agent |
| seq | 排序序号 |

## 状态枚举规范

| 层级 | 有效枚举 | 说明 |
|------|---------|------|
| 树级 (`task_trees.status`) | `active / done / escalated` | 树整体生命周期 |
| 节点级 (`tree_nodes.status`) | `pending / in_progress / done / escalated` | 节点工作流状态 |

**废弃枚举**：`closed` — 曾在 TWF-002 Phase 3-5 中使用，语义与 `done` 重叠。v0.3 起移除，存量已于 W29→W30 迁移中自然消除。`active` — v0.2 节点级枚举，v0.3 统一为 `in_progress`。

**校验**：`scripts/validate-tree-status-enums.ps1` 扫描所有 `tree-op.json`，报告不合规状态值。

## 持久化导出

由于 Copilot CLI SQLite session DB 不跨会话（§A.4 约束 4），每次修改 tree_nodes 后**必须立即**导出到 git 仓库：

```
小贾: SQL → docs/workflow/tree-nodes-export.json → git add + commit
```

TriMC 环境通过 API 层自动同步（§B.4.2），无需手动。校验脚本 `export-tree-nodes.ps1 -Validate` 可验证 JSON 格式与数据一致性。

## 收口检查清单

每次关闭一棵树或完成一个节点交付时，总助必须执行以下检查：

1. **SQL ↔ 物理目录一致性**：`task_trees` 中每棵活跃/已完成树，对应 `trees/<tree-id>/` 物理目录存在且含 `tree-op.json`
2. **状态枚举合规**：运行 `scripts/validate-tree-status-enums.ps1`，确认 0 issues
3. **tree-op.json 完整性**：每个 tree-op.json 包含 `objectType/objectId/treeId/title/status/nodes[]/metadata`
4. **周索引同步**：活跃树在周 OP JSON 的 `activeTrees[]` 中，已完成树在 `doneTrees[]` 中
5. **暂存 + 提交**：变更的 tree-op.json + 周 OP JSON → `git add` → `git commit`

> 示例：`小贾: "📋 收口检查 — validate-tree-status-enums: 8/8 OK, 5 trees 全部落地"`

## 恢复机制

上下文丢失后，小贾应：

1. 从 `docs/workflow/tree-nodes-export.json`（git 仓库持久化副本）重建所有活跃树
2. 如 SQLite 仍可用，交叉比对 JSON 与 SQL 找出差异
3. 找到所有 status='in_progress' 的节点 → 这些是当前中断点
3. 向 CEO 报告："以下树有活跃节点待恢复：..."
4. CEO 决定继续/回退/重新路由

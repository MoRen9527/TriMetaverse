# Dynamic Task Tree Protocol

> 版本：v0.2 | 建立：2026-07-17 | 试验阶段：Copilot-host 手动编排
> 关联树：TWF-001 — 任务动态树工作流与故障恢复机制（本协议 + session-crash-recovery-spec.md 合并交付）

## 角色

| 角色 | 谁 | 职责 |
|------|-----|------|
| 编排层 | CEO（磨人） | 手动切换 agent，执行节点工作，发出路由信号 |
| 主 agent | 总助（小贾） | 持树、记录状态、响应信号、ESCALATE 时延伸分支 |
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

- 关当前节点（status=done），创建下一节点（status=active），更新树 updated_at
- 如不指定下一节点，视为"等编排决定"

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
| status | pending / active / done / escalated |
| delivery | 交付物描述（完成时填写） |
| next_agent | 建议的下一节点 agent |
| seq | 排序序号 |

## 持久化导出

由于 Copilot CLI SQLite session DB 不跨会话（§A.4 约束 4），每次修改 tree_nodes 后**必须立即**导出到 git 仓库：

```
小贾: SQL → docs/workflow/tree-nodes-export.json → git add + commit
```

TriMC 环境通过 API 层自动同步（§B.4.2），无需手动。校验脚本 `export-tree-nodes.ps1 -Validate` 可验证 JSON 格式与数据一致性。

## 恢复机制

上下文丢失后，小贾应：

1. 从 `docs/workflow/tree-nodes-export.json`（git 仓库持久化副本）重建所有活跃树
2. 如 SQLite 仍可用，交叉比对 JSON 与 SQL 找出差异
3. 找到所有 status='active' 的节点 → 这些是当前中断点
3. 向 CEO 报告："以下树有活跃节点待恢复：..."
4. CEO 决定继续/回退/重新路由

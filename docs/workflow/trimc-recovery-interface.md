# TriMC 恢复接口契约（方案 B）
# TWF-001 §B | CTO 小狄 | 2026-07-17
# 本文件定义 TriMC（Claude Code 吸收链）端的恢复接口契约。
# 这是 CTO 对 TriMC 开发方的输入：TriMC 团队据此实现前置拦截 + 自动恢复。

---

## §B.1 概述

TriMC 作为上线环境 Runtime，在每次 agent 调用前执行**前置拦截器**。
若检测到不一致，根据严重级别触发：自动修复（LOW/MEDIUM）、挂起+通知 CEO（HIGH）、拒绝执行（CRITICAL）。

方案 B 不同于方案 A：
- **方案 A**：Copilot CLI 开发环境，事后检测 + 人工触发 Phase B 恢复
- **方案 B**：TriMC 上线环境，前置拦截 + 自动恢复策略

---

## §B.2 前置拦截器 API

### B.2.1 调用时机

```
[user input] → [pre-interceptor] → [agent invoke] → [post-interceptor] → [return]
```

| 时机 | 输入 | 输出 |
|------|------|------|
| `pre-invoke` | agent_role, user_message, tree_context | allow/deny, patch_context? |
| `pre-commit` | commit_diff, tree_node_id | allow/deny, amend_message? |
| `on-node-transition` | node_id, from_status, to_status | allow/deny, note? |

### B.2.2 拦截器输入 Schema

```jsonc
// POST /api/v1/twf/intercept
{
  "trigger": "pre-invoke",           // pre-invoke | pre-commit | on-node-transition
  "session": {
    "session_id": "uuid",
    "user": "jedih",
    "environment": "trimc-production"
  },
  "context": {
    "current_tree_id": "TWF-001",    // 当前任务树 ID
    "current_node_id": "TWF-001-2",  // 当前节点 ID
    "agent_role": "CTO",             // 当前 agent 角色
    "agent_name": "小狄"             // 当前 agent 名称
  },
  "payload": {                       // 按 trigger 类型不同
    "user_message": "...",
    "tree_nodes_snapshot": [...]
  }
}
```

### B.2.3 五维校验规则（§3 复刻）

拦截器内部执行以下五维比对，与 `validate-declarations.ps1` 逻辑一致：

| 维度 | 规则 | 严重级别 |
|------|------|----------|
| D1 code-state 路径→文件系统 | 每个 code-state.md 中声明的路径必须存在于文件系统 | CRITICAL |
| D2 product-state→code-state 对应 | 每个 product-state.md 中引用的模块必须在 code-state.md 中有对应条目 | HIGH |
| D3 OP done→git commit | 每个 status=done 的 nextAction 必须有对应 git commit（按 action.id 搜索） | MEDIUM |
| D4 tree_nodes done→delivery | 每个 status=done 的 tree_node 必须有 delivery 字段非空 | MEDIUM |
| D5 git working tree 脏状态 | 若有 uncommitted 变更且无 active tree_node 覆盖这些文件 | LOW |

### B.2.4 拦截器输出 Schema

```jsonc
// 前置拦截器响应
{
  "decision": "allow",          // allow | deny | patch
  "severity": "OK",             // OK | LOW | MEDIUM | HIGH | CRITICAL
  "violations": [
    {
      "dimension": "D1",
      "level": "CRITICAL",
      "path": "src/module/main.py",
      "expected": "file exists",
      "actual": "file not found",
      "action": "deny"
    }
  ],
  "patch_context": null,        // 若 decision=patch，提供修正后的上下文
  "recovery_suggestion": null   // 若 decision=deny，给出恢复建议
}
```

---

## §B.3 自动恢复策略

### B.3.1 恢复策略分级

| 严重级别 | 动作 | 说明 |
|----------|------|------|
| LOW (D5) | 自动创建 `auto-commit`（标记为 `[triMC:auto-restore]`） | 脏文件自动暂存提交 |
| MEDIUM (D3, D4) | 自动回写 tree_nodes / OP JSON | 用 git log 信息补全缺失的 delivery 或 status |
| HIGH (D2) | 挂起 + 通知 CEO + 创建 `unresolved-item` | 产品状态不一致需人工裁决 |
| CRITICAL (D1) | 拒绝执行 + 通知 CEO + CEOChiefOfStaff | 代码文件缺失需紧急排查 |

### B.3.2 自动修复 API

```jsonc
// POST /api/v1/twf/recover
{
  "violation_ids": ["uuid1", "uuid2"],
  "auto_fix_level": "MEDIUM",       // 只自动修复 ≤MEDIUM 级别
  "dry_run": false
}

// Response:
{
  "fixed": [
    {
      "violation_id": "uuid1",
      "dimension": "D3",
      "action_taken": "updated OP JSON status to done with commit hash",
      "commit_hash": "abc123"
    }
  ],
  "skipped": [
    {
      "violation_id": "uuid2",
      "dimension": "D2",
      "reason": "requires CPO review",
      "routed_to": "CPO"
    }
  ]
}
```

---

## §B.4 tree_nodes 导出 API

TriMC 运行时维护内存中的任务树状态。需提供导出端点供校验和恢复使用。

### B.4.1 导出

```jsonc
// GET /api/v1/twf/tree-nodes?tree_id=TWF-001
{
  "tree_id": "TWF-001",
  "exported_at": "2026-07-17T12:00:00Z",
  "nodes": [
    {
      "id": "TWF-001-0",
      "parent_node_id": null,
      "agent": "CEOChiefOfStaff",
      "title": "小贾",
      "action": "重命名任务树 + 修复引用",
      "status": "done",
      "delivery": "tree renamed DA-004→TWF-001; refs in spec+protocol updated",
      "started_at": "2026-07-17T...",
      "updated_at": "2026-07-17T..."
    }
  ],
  "edges": [
    {"from": "TWF-001-0", "to": "TWF-001-1", "type": "routes"}
  ]
}
```

### B.4.2 文件落地同步

TriMC 每次节点状态变更时，需同步写出 `docs/workflow/tree-nodes-export.json`（与方案 A 共享格式），确保 Copilot CLI 和 TriMC 使用一致的数据结构。

---

## §B.5 会话恢复信号

当 TriMC 检测到自身异常重启后：

1. 从 `tree-nodes-export.json` 恢复上次任务树状态
2. 扫描 `active` 节点 → 若超时 > 2h，标记为 `crashed`
3. 执行前置拦截器（§B.2）判定当前状态
4. 对 MEDIUM 以下自动修复（§B.3），HIGH 以上挂起等待 CEO

---

## §B.6 与方案 A 的共享组件

| 组件 | 方案 A (Copilot CLI) | 方案 B (TriMC) |
|------|---------------------|-----------------|
| 五维校验规则 | `validate-declarations.ps1` | §B.2.3（逻辑复刻） |
| 输出格式 | JSON（spec §4） | JSON（§B.2.4） |
| tree_nodes 格式 | `tree-nodes-export.json` | 同格式，§B.4 |
| 恢复策略分级 | 人工触发 | 自动触发 §B.3 |

---

## §B.7 依赖与前提

- TriMC 需实现 §B.2 前置拦截器，在每次 agent invoke 前执行
- TriMC 需维护内存树状态 + 同步写出 `tree-nodes-export.json`
- 五维规则变更需 CPO 更新 `session-crash-recovery-spec.md` §3，CTO 同步更新 `validate-declarations.ps1` 和本文档
- TriMC 开发方以本文档为接口契约，不可偏离；如有争议升级到 CTO

---

**版本**: v0.1 draft
**CTO 签署**: 小狄
**路由**: after CPO review → TriMC 开发团队

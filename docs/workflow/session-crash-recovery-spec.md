# Session Crash Recovery Spec

> 版本：v0.2 | 建立：2026-07-17 | Owner：CPO（小乔） | 下游实现：CTO（小狄）
> 关联树：TWF-001 — 任务动态树工作流与故障恢复机制（与 dynamic-task-tree-protocol.md 合并交付）
>
> **v0.2 变更**：拆分为两套独立方案 —— 方案 A（Copilot CLI 当前开发环境）和方案 B（TriMC 目标上线环境）。

---

## 总览：两套方案边界

| 维度 | 方案 A：Copilot CLI | 方案 B：TriMC |
|------|---------------------|---------------|
| **定位** | 开发期临时方案 | 吸收 Claude Code 设计后的永久方案 |
| **阶段** | 当前开发期 | 项目上线后 |
| **宿主控制力** | 寄生——无权修改消息管道 | 自有——完全控制消息持久化 |
| **检测时机** | 事后检测（session 文件、SQL、git） | 前置拦截 + 运行时心跳 |
| **恢复方式** | 人工触发，CEO 逐节点确认 | 程序化自动恢复（可配置策略） |
| **S1 检测** | 事后解析 session 日志 | 持久化前在管道内直接丢弃 |
| **共享组件** | §3 校验规则（声明 vs 实际）两方案通用 |

---

## 方案 A：Copilot CLI（当前开发环境）

### A.1 前提假设

- 运行在 Copilot CLI 宿主内，无法修改其消息持久化逻辑
- 可访问：session 文件、SQLite session DB、git、文件系统
- 会话崩溃后需**重新启动 Copilot CLI 会话**才能执行恢复
- 恢复流程由总助（小贾）在新会话中驱动

### A.2 触发条件

| 信号 | 检测方式 | 置信度 |
|------|----------|--------|
| **A-S1** — assistant 消息 content 为空 且 tool_calls 为空，但被持久化 | 解析 Copilot session 日志文件，扫描空消息模式 | 🔴 HIGH |
| **A-S2** — tree_nodes 中存在 status='active' 超过 2 小时无任何更新 | `SELECT * FROM tree_nodes WHERE status='active' AND updated_at < datetime('now', '-2 hours')` | 🟡 MEDIUM |
| **A-S3** — registry 声明 ✅ 的路径在文件系统不存在 | 校验脚本比对（见 §3） | 🔴 HIGH |
| **A-S4** — git working tree 有未跟踪/未提交变更，但对应 tree_node 已标记 done | `git status --short` + SQL 交叉检查 | 🟡 MEDIUM |
| **A-S5** — OP JSON 标记 done 但 tree_nodes 仍有 pending/active 子节点 | OP JSON status vs tree_nodes status 比对 | 🟡 MEDIUM |

### A.3 恢复 SOP（四阶段）

```
Phase A — 检测（新会话启动时运行）
  1. 读取 SQL tree_nodes WHERE status IN ('active','pending')
  2. 读取 OP JSON nextActions
  3. 扫描最近的 Copilot session 文件，检测 A-S1 模式
  4. 判定：有 active 节点 + (A-S1|A-S3) → 进入 Phase B
           有 active 节点 + 仅 (A-S2|A-S4|A-S5) → 报告 CEO，等待指令
           无 active 节点 → 正常，不触发

Phase B — 诊断
  1. 列出所有 status='active' 的节点
  2. 输出上下文快照：
     - 树 ID、节点 ID、agent、预期 action
     - git log --oneline -5
     - git status --short
     - 最近 checkpoint 文件内容摘要
  3. 比对 OP JSON action 声明 vs git 实际 vs checkpoint 实际

Phase C — 恢复（CEO 逐节点确认）
  1. CEO 审阅诊断报告，逐节点决定：
     CONTINUE / REDO / SKIP
  2. 总助执行：更新 tree_nodes + OP JSON + 路由信号

Phase D — 校验（恢复后）
  1. 运行 §3 声明vs实际校验脚本
  2. git status 确认干净
  3. 输出恢复报告
```

### A.4 Copilot CLI 特有约束

1. **S1 无法前置拦截**：Copilot 消息管道不可控，只能事后扫描 session 文件发现空消息
2. **恢复前需新会话**：崩溃后原 session 不可恢复，需在新会话中执行恢复流程
3. **checkpoint 文件为关键恢复锚点**：`C:\Users\jedih\.copilot\session-state\{session-id}\checkpoints\` 下的 checkpoint 文件记录中断前最后已知状态
4. **SQLite session DB 不跨会话**：每次新 Copilot 会话会重建 SQLite；tree_nodes 数据需落地到项目 git 仓库中持久化

---

## 方案 B：TriMC（目标上线环境）

### B.1 前提假设

- TriMC 吸收了 Claude Code 的 Agent 运行时设计，是自有宿主，完全控制消息管道
- 可在消息持久化前插入过滤逻辑（Claude Code 架构原生支持管道拦截）
- 可内建运行时心跳 + 健康检查（watchdog 机制）
- 恢复流程可程序化自动执行（无需人工启动新会话）
- 方案 A（Copilot CLI）为当前开发期临时方案；方案 B（TriMC）为吸收 Claude Code 后的永久方案

### B.2 触发条件

| 信号 | 检测方式 | 置信度 |
|------|----------|--------|
| **B-S1** — assistant 消息 content 为空 且 tool_calls 为空 | **前置拦截**：持久化前在管道内检测并丢弃，记录 incident 日志 | 🔴 HIGH |
| **B-S2** — tree_nodes 中存在 status='active' 超过 N 分钟无任何更新 | 运行时心跳定时器检查（N 可配置，默认 30min） | 🟡 MEDIUM |
| **B-S3** — registry 声明 ✅ 路径不存在 | 同 §3 校验脚本（共享） | 🔴 HIGH |
| **B-S4** — agent 工作线程无响应超过阈值 | 心跳超时检测（watchdog） | 🔴 HIGH |
| **B-S5** — git working tree 有未提交变更但 tree_node 已 done | git status + SQL 交叉检查（共享） | 🟡 MEDIUM |
| **B-S6** — OP JSON 与 tree_nodes 状态不一致 | 状态机一致性校验（共享） | 🟡 MEDIUM |

### B.3 前置过滤规则（TriMC 特有）

TriMC 在持久化 assistant 消息前强制执行：

```
IF message.content IS NULL OR EMPTY
   AND (message.tool_calls IS NULL OR EMPTY)
THEN
   DISCARD message           -- 不持久化
   LOG incident: {
     sessionId, agentId, timestamp,
     reason: "empty_assistant_message_filtered"
   }
   INCREMENT metric: tri_mc.filtered_empty_messages
END IF
```

> 此规则直接回应共学周报 §2.2 中的核心问题：「Agent 宿主是否应该在持久化前强制过滤既无 content 又无 tool_calls 的 assistant 消息？」—— 答案是 **是**，应在管道层前置拦截。

### B.4 恢复 SOP（三阶段，可自动执行）

```
Phase A — 检测（运行时自动）
  1. 心跳检测器周期性扫描 tree_nodes active 节点
  2. B-S1 由管道前置过滤触发 incident
  3. B-S4 由 watchdog 触发
  4. 任一 HIGH 信号 → 自动进入 Phase B
     MEDIUM 信号 → 通知运维频道，不自动恢复

Phase B — 诊断 + 恢复（程序化）
  1. 快照当前状态（tree_nodes + OP JSON + git head）
  2. 对每个 affected 节点按预设策略执行：
     - 策略 "retry"：重置为 pending，重新调度
     - 策略 "skip"：标记 done + incident 说明
     - 策略 "escalate"：暂停树，通知 CEO
  3. 策略由树定义时声明（tree 级默认 + node 级覆盖）

Phase C — 校验（恢复后自动）
  1. 运行 §3 校验脚本
  2. 确认状态一致性
  3. 输出恢复报告 + 指标增量
```

### B.5 TriMC 特有优势

1. **S1 零漏过**：前置过滤，根本不会持久化空消息
2. **自动恢复**：预设策略下无需人工介入即可重试/跳过
3. **watchdog**：B-S4 捕获 agent 线程假死，Copilot CLI 无法做到
4. **指标体系**：`tri_mc.filtered_empty_messages`、`tri_mc.recovery.retry_count` 等，可观测
5. **tree 级恢复策略**：创建树时声明恢复偏好，运行时自动执行

---

## 共享：§3 校验规则（两方案通用）

### 3.1 校验范围

| 源文件 | 校验内容 | 校验方式 |
|--------|----------|----------|
| `<模块>/docs/registry/code-state.md` | 标记 ✅/Phase X 的路径是否在文件系统中存在 | `Test-Path` / `os.path.exists` |
| `<模块>/docs/registry/product-state.md` | 标记 ✅ 的能力是否对应 code-state 中已实现 | 交叉比对 |
| OP JSON nextActions | status='done' 的项是否有对应 git commit | git log grep |
| SQL tree_nodes | status='done' 的节点是否有 delivery 字段 | SQL 查询 |
| git working tree | 是否有超过 24h 未提交的变更 | git status --short |

### 3.2 异常分级

| 级别 | 条件 | 动作 |
|------|------|------|
| 🔴 CRITICAL | code-state ✅ 但目录不存在 | 立即触发恢复流程 |
| 🟠 HIGH | product-state ✅ 但 code-state 无对应 | 标记产品缺口，路由 CPO 复查 |
| 🟡 MEDIUM | OP done 但 git 无 commit | 标记 OP 同步缺口，小贾修复 |
| 🟢 LOW | tree_node done 但 delivery 为空 | 补写 delivery 描述 |

### 3.3 校验频率

| 时机 | 方案 A | 方案 B |
|------|--------|--------|
| 会话/进程启动 | 新 Copilot 会话启动时运行 | TriMC agent 进程启动时运行 |
| 每次 git commit 前 | 快速检查（仅 🔴 CRITICAL） | 同左 |
| 周度平移前 | 全量运行 | 同左 |
| 运行时 | N/A（Copilot 无后台任务） | 心跳周期内运行轻量版 |

---

## 输出格式（两方案通用）

### 校验报告

```json
{
  "runAt": "ISO8601",
  "environment": "copilot-cli|trimc",
  "trigger": "startup|pre-commit|weekly|heartbeat",
  "results": {
    "critical": [{ "file": "...", "claim": "...", "actual": "...", "action": "..." }],
    "high": [...],
    "medium": [...],
    "low": [...]
  },
  "summary": "3 critical / 0 high / 2 medium / 1 low"
}
```

### 恢复报告

```json
{
  "recoveredAt": "ISO8601",
  "environment": "copilot-cli|trimc",
  "detectedBy": "A-S1|B-S4|...",
  "affectedTrees": ["DA-004"],
  "decisions": [
    { "nodeId": "DA-004-1", "decision": "CONTINUE|REDO|SKIP|RETRY", "reason": "..." }
  ],
  "postValidation": "PASS|FAIL",
  "gitHeadBefore": "abc123",
  "gitHeadAfter": "def456"
}
```

---

## 边界与限制

1. **范围**：覆盖 TriMetaverse + 同级模块（TriOPC、TriMC 等）
2. **方案 A 人工门禁**：Phase C 恢复决策始终需 CEO 确认
3. **方案 B 自动门禁**：仅 "retry" / "skip" 策略可自动执行；"escalate" 需人工
4. **SQLite 持久化（方案 A）**：tree_nodes 必须落地到 git 仓库文件，不能仅依赖 Copilot session SQLite
5. **版本**：v0.2，方案 B 为前瞻规格，随 TriMC 开发进度细化

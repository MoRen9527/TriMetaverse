# Session 同步问题 - 待澄清项

> 为小乔和小狄准备的补充信息，加速分析收口

## 给小狄（技术侧）的补充问题

### 1. Current Session 持久化策略

- Daemon 侧 `currentSessionId` 应该存在内存还是持久化到 sessions.db？
  - 内存：daemon 重启后丢失，需要重新选择 current session
  - 持久化：daemon 重启后恢复，但需要处理并发访问

### 2. Session 并发访问

- 两入口同时使用同一 session 时：
  - 消息写入顺序如何保证？
  - 是否需要锁机制？

### 3. TriPilot 首次连接判断

- 如何判断 TriPilot 是"首次连接"？
  - 连接时无 current session → 创建新 session
  - 还是每次连接都询问用户是否继续上一次会话？

### 4. Session 过期策略

- Current session 何时自动切换？
  - 按 session status（completed/interrupted/error）
  - 按时间（如 24 小时未活动）

## 给小乔（产品侧）的补充问题

### 1. 两入口使用场景

- 用户同时使用两个入口的真实场景是什么？
  - 面板调试 + 命令行交互？
  - 还是更多是"切换使用"而非"同时使用"？

### 2. Reset 后会话处理

- Reset 后用户期望：
  - 能查看 reset 前的对话历史？（归档）
  - 还是完全重新开始，不关心历史？（删除）

### 3. 初始化流程会话

- 初始化流程对话（selfcheck/assemble）：
  - 用户是否需要回溯这些对话？
  - 还是这些对话只是"临时工具性质"，不应进入历史？

### 4. Session 切换 UX

- 用户主动切换会话的场景：
  - 多任务并行？
  - 还是偶尔需要回看旧对话？

---

## 技术背景补充

### TriPilot 当前行为

- 每次提交任务都调用 `POST /internal/v1/tasks/submit`
- Daemon 生成新的 sessionId（格式 `sess_{timestamp36}_{random4}`）
- 返回 `{ sessionId, streamEndpoint }`

### trilc chat 当前行为

- 启动时不指定 session id（除非用 `--resume <id>`）
- Resume 时从 daemon 获取会话消息
- TUI 运行时不主动创建 session id

### Session Store 现有操作

- `createSession()` - 创建新会话
- `getSession()` - 获取会话
- `deleteSession()` - 删除会话
- `updateSessionStatus()` - 更新状态（active/completed/interrupted/error/expired）

### 现有 Session Status

- `'active'` - 活跃会话
- `'completed'` - 已完成
- `'interrupted'` - 中断
- `'error'` - 错误
- `'expired'` - 过期

---

## 待收口的决策点

| 决策点 | 选项 A | 选项 B | 负责人 |
|--------|--------|--------|--------|
| 两入口共享会话 vs 分历史 | 共享（方案 A） | 分历史（方案 C） | 小乔 |
| Reset 后会话处理 | 归档（方案 A） | 删除（方案 B） | 小乔 |
| 初始化会话可见性 | 进入历史（方案 A） | 隐藏（方案 B） | 小乔 |
| Current session 持久化 | 内存 | 持久化 | 小狄 |
| Session 并发访问 | 需要锁 | 无需锁（最后写入胜） | 小狄 |
| TriPilot 首次连接 | 自动复用 current | 询问用户 | 小乔 |
| Session 过期策略 | 按状态 | 按时间 | 小狄 |

---

生成时间：2026-08-16
生成者：小贾（CEO 总助）

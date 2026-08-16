# Session 管理设计文档

> **sourceOfTruth**: TriMetaverse/docs/execution/
> **syncMode**: design
> **lastSyncedAt**: 2026-08-16
> **owner**: 小贾（CEO 总助）
> **status**: drafting

## 一、背景

CEO 指令（2026-08-16 凌晨）：

> "我们是不是忘记考虑 session id 和对应的会话历史管理了——trilc chat 启动时的 session id 选择和 TriPilot 当前 session id 应该一致（id 相等）才能同步；trilc chat reset 也应该 reset 对应的 session id 才对。让小乔和小狄分析和完善 session 的创建和管理。这些在我们移植 claude code 2.1.88 时应该都是完整可用的。"

### 核心问题

1. **两入口 session id 不同步**：TriPilot 面板和 trilc chat 各自为政，用户在面板聊的上下文 chat 里看不到，反之亦然
2. **reset 不联动会话**：trilc chat reset 重置初始化链但旧会话历史还挂着新流程
3. **Claude Code 2.1.88 原生 session/resume 体系完整**（--resume <id>、会话历史、compact），移植面没接上

### 现状盘点（技术侧）

#### TriLC Session Store 完整实现

- **Schema v2**（`src/session-store/types.ts`）：
  - `SessionRecord`: id, status, model, systemPrompt, cwd, messageCount, createdAt, updatedAt, closedAt, title, syncStatus, lastSyncedAt, cloudSessionId
  - `SessionMessageRecord`: id, sessionId, seq, role, content, toolCalls, toolCallId, reasoningContent, createdAt

- **Sessions API**（`src/server/app.ts`）：
  - `POST /internal/v1/sessions` - 创建或追加消息到会话
  - `GET /internal/v1/sessions/{id}` - 获取单个会话及消息
  - `POST /internal/v1/sessions/{id}/fork` - fork 会话
  - `POST /internal/v1/sessions/recover` - 恢复会话
  - `SSE GET /internal/v1/sessions/{id}/stream` - SSE 流
  - `POST /internal/v1/sessions/{id}/cancel` - 取消会话
  - `GET /internal/v1/sessions` - 获取会话列表
  - `POST /internal/v1/sessions/{id}/compact` - 压缩会话

- **Session Store 操作**（`src/session-store/store.ts`）：
  - `createSession()`, `getSession()`, `deleteSession()`
  - `saveMessages()`, `getMessages()`, `getMessageCount()`
  - `updateSessionStatus()`, `updateSyncStatus()`
  - `expireOldSessions()`（cron session-reaper.ts）

#### Session ID 生成方式

- **TriPilot 端**：
  - 调用 `POST /internal/v1/tasks/submit`
  - Daemon 生成 session id：`sess_${timestamp36}_${random4}`（`app.ts:2490`）
  - 返回 `{ sessionId, streamEndpoint }`

- **trilc chat 端**：
  - 启动时不指定 session id（除非用 `--resume <id>`）
  - Resume 时从 daemon 获取会话消息
  - TUI 运行时不主动创建 session id

#### 问题根因分析

1. **两入口没有"当前 session"的概念**：
   - TriPilot 每次提交任务都生成新的 sessionId
   - trilc chat 启动时不生成 session id（除非 resume）
   - 没有共享的"当前活跃 session"指针

2. **reset 不联动会话**：
   - `POST /internal/v1/init/reset` 清理运行态文件和装配产物
   - **但不清理 session 相关数据**（`init-chain.ts:430`）
   - Session store 的 `deleteSession()` 函数存在但未被调用

3. **Claude Code 2.1.88 对照**：
   - 原生支持 `--resume <id>` 命令行参数
   - 会话列表、compact、自动恢复机制
   - 我们移植了 session store 和 API，但**没有建立"当前 session"的同步机制**

#### 初始化流程会话

- I2 已删除 `hb_company-onboarding_` auto-resume 分支（`cli.ts:520-548`）
- 初始化流程（selfcheck/assemble/link/sync/confirm）不感知 session
- 初始化相关的会话历史是否应该进入用户可见历史——产品侧待决策

## 二、产品口径（编排层按 CEO 意图收口，2026-08-16）

> CEO 指令已直接定调以下口径（「id 相等才能同步」+「reset 需单 session 粒度」补充），无需产品侧再决策；小乔后续可做体验细化。

1. **两入口共享「公司当前会话」**（CEO 明示：TriPilot 当前 session id 与 trilc chat 启动选择的 session id 相等才能同步）——按入口分历史（方案 C）出局。
2. **reset 粒度模型（CEO 补充 2026-08-16）**：
   - **链重置（全局）**：init reset（现 debug 功能）——重置初始化链 + 联动归档关联 session
   - **单会话重置（局部）**：reset 当前 session 对应的上下文（新会话/归档旧会话），不动链、不动其他会话
   - 组合语义：trilc chat reset = 当前会话重置 + 视链态可选联动；两入口一致
3. **reset 后旧会话**：归档（保留可查）而非删除——「无痕」口径应用于链/文件面，会话历史属用户资产默认保留。
4. **初始化流程会话**（selfcheck 探测/assemble 问答）：进 session 历史但打 system 标记（UI 可后续过滤），避免黑盒。

## 三、技术方案（小狄分析）

> 小狄（xiaodi-debug-reset）技术侧分析已完成（2026-08-16）

### 3.1 当前 Session 创建/存储/resume 完整链路

#### TriPilot 侧（VS Code 扩展）

- **Session 生成位置**：`src/chatHistory.ts:114`
- **格式**：`{timestamp}-{12字符hex}`
- **存储**：本地 JSONL 文件（`{sessionId}.jsonl`）
- **状态保存**：`state.historySessionId`

#### TriLC 侧（Daemon）

- **Session 生成位置**：`src/server/app.ts:1832`
- **格式**：`sess_{timestamp36}_{4字符随机}`
- **存储**：SQLite `sessions.db`
- **触发条件**：仅 Anthropic JSON 模式（stream=false）时自动保存

#### TrilcDirectClient（HTTP 客户端）

- **关键发现**：`src/trilcDirect/trilcClient.ts:215` 的 `streamChat()` 方法
- **问题**：请求体不包含 `sessionId` 字段
- **这是两入口 session id 不同步的根本原因**

### 3.2 Claude Code 2.1.88 对照分析

| 特性 | TriLC 实现状态 | 位置 |
|------|---------------|------|
| Session 存储 | ✅ 已实现 | `session-store/store.ts` |
| Session resume | ✅ 已实现 | `POST /internal/v1/sessions/recover` |
| 安全检查 | ✅ 已实现 | `session-store/safety-check.ts` |
| Compact | ✅ 已实现 | `POST /internal/v1/sessions/{id}/compact` |
| Fork | ✅ 已实现 | `POST /internal/v1/sessions/{id}/fork` |
| 中断检测 | ✅ 已实现 | `findInterruptedSessions()` |
| CLI `--resume` | ❌ 缺失 | - |
| Stream 模式自动生成 session | ❌ 缺失 | 仅 JSON 模式生成 |

### 3.3 三个缺口的技术根因

#### 缺口1：两入口 session id 不同步

**根本原因**：
1. TriPilot 和 TriLC 各自独立生成 sessionId（格式不同）
2. TrilcDirectClient.streamChat() 不传递 sessionId
3. TriLC 仅在 JSON 模式生成 sessionId，SSE 模式不生成

#### 缺口2：Reset 不联动会话

**根本原因**：
1. InitChain.reset() 清理面不包含 session（只清理运行态文件 + 装配产物）
2. Reset 端点不知道当前 session，无 session 清理逻辑

#### 缺口3：移植面没接上

**根本原因**：
1. Stream 模式不生成 session（主流使用方式无 session 记录）
2. 无 CLI --resume 等价物

### 3.4 并发访问与持久化策略

**当前实现**：
- TriLC：SQLite `sessions.db`（事务保护，内置写入锁）
- TriPilot：JSONL 文件持久化
- **无应用层显式锁**，依赖 SQLite 内置锁机制

**并发控制建议**：
- 方案A：增加应用层锁（如 `async-mutex` 包）
- 方案B：每个入口使用独立 session（产品口径决策）
- 方案C：增加 `last_write_at` 字段，检测冲突

### 3.5 最小改动路径（技术侧推荐）

#### 方案A：Session ID 同步（P0，推荐）

**改动点**：
1. TriLC `/v1/messages` 端点增加 `sessionId` 参数（带则复用，不带则生成新）
2. TrilcDirectClient.streamChat() 传递 sessionId
3. TriPilot 侧传递 historySessionId

**效果**：两入口共享同一个 sessionId，为 reset 联动打下基础

#### 方案B：Reset 联动 Session（P1）

**改动点**：
1. InitChain.reset() 增加 `includeSessions` 参数
2. Reset 端点支持参数传递
3. Session 清理逻辑（删除或归档）

**效果**：Reset 时可选择清理 session

#### 方案C：Stream 模式 Session 生成（P2）

**改动点**：
1. `/v1/messages` 端点统一生成 session（无论 stream=true/false）
2. 响应返回 sessionId（SSE 首个事件或 JSON 模式响应）

**效果**：Stream 模式也有 session 记录

### 3.6 技术缺口优先级

| 优先级 | 缺口 | 工作量 | 依赖 |
|--------|------|--------|------|
| P0 | Session ID 同步（方案A） | 中 | 无 |
| P1 | Reset 联动 Session（方案B） | 低 | P0 |
| P2 | Stream 模式 Session 生成（方案C） | 中 | 无 |

**建议实施顺序**：A → B → C

## 三B、架构原则（CEO 裁决，2026-08-16）

> 「TriPilot 和 trilc chat 都只是**入口**——原则上任一入口可创建 session，但 session 的**维护都由 daemon 维护**，这样才能随时从任一入口 reuse session id。」

- **Daemon 单一真相源**：session 生命周期（创建/存储/当前指针/resume/归档/过期）全部在 daemon（sessions.db + currentSessionId 指针）
- **入口皆薄**：任一入口只发三类请求——建新（不带 id）/ 复用当前（"use current" → daemon 返回 currentSessionId）/ 按 id resume（id 来自 daemon 会话列表）
- **任一入口随时 reuse**：currentSessionId 在 daemon，面板与 chat 天然同步；本地 session 状态（TriPilot 的 state.historySessionId + JSONL 历史）退位为缓存/迁移源，权威归 daemon
- **消息同源渲染分离**（CEO 确认 2026-08-16）：两入口从 daemon 拉同一 session 的同一消息流（sessions.db + SSE），按入口形态各自渲染——IDE 走 webview 卡片、CLI 走 TUI 文本；「同一对话、两种皮」
- **实时互通推论**：两入口可同时订阅同一 session 的 SSE（/internal/v1/sessions/{id}/stream）——一端发消息另一端实时可见（面板聊、终端看）
- 与既有契约一脉相承：W30 零本地执行、I1-I5 状态全归 daemon——session 域补齐同一原则

## 四、设计方案

> 根据小乔产品口径 + 小狄技术分析，收口方案...
>
> **（以下为技术侧草案，待产品口径确认后调整）**

### 4.1 两入口 Session ID 同步机制

**问题根因**（小狄技术分析）：
- TriPilot 和 TriLC 各自独立生成 sessionId（格式不同：`timestamp-hex` vs `sess_{timestamp36}_{random}`）
- TrilcDirectClient.streamChat() 不传递 sessionId
- TriLC 仅在 JSON 模式生成 sessionId，SSE 模式不生成

**可选方案**：

#### 方案 A：/v1/messages 端点接收 sessionId（推荐，小狄提出）

- **机制**：
  - TriLC `/v1/messages` 端点增加 `sessionId` 参数
  - 请求带 `sessionId` → 使用现有 session
  - 请求不带 `sessionId` → 生成新 session（现有逻辑）

- **改动点**：
  - `app.ts`: `/v1/messages` 端点接收 `sessionId` 参数
  - `TrilcDirectClient.streamChat()`: 传递 `args.sessionId`
  - `TriPilot`: 调用 `streamChat()` 时传递 `historySessionId`

- **优势**：
  - 最小改动（只动请求体，不动状态管理）
  - 两入口自然同步（共享同一个 sessionId）
  - 符合 Claude Code 2.1.88 的 session 传递机制

- **实施路径**：
  ```typescript
  // TriLC /v1/messages 端点
  if (body.sessionId) {
    const existing = sessionStore.getSession(body.sessionId);
    if (!existing) {
      // Session 不存在，返回错误或生成新 session（产品口径决策）
    }
    sessionId = body.sessionId;
  } else {
    sessionId = generateNewSessionId(); // 现有逻辑
  }
  ```

#### 方案 B：Daemon 侧 currentSessionId 指针（小贾草案）

- **机制**：Daemon 维护 `currentSessionId`（内存或持久化到 sessions.db）
  - TriPilot 首次连接时：无 current session → 创建新 session → 设为 current
  - TriPilot 后续提交：使用 current session id
  - trilc chat 启动：从 daemon 获取 current session id → resume

- **优势**：
  - 单一真相源（daemon 侧）
  - 两入口自然同步

- **劣势**：
  - 需要新增状态管理（`currentSessionId`）
  - 需要新增 `/set-current` 和 `/current` 端点
  - 比方案 A 复杂度更高

#### 方案 C：按入口分历史（不推荐）

- **机制**：TriPilot 和 trilc chat 各自维护独立的 session 历史

- **劣势**：
  - 违背 CEO "session id 应该一致才能同步"的预期
  - 用户体验割裂（面板聊的上下文 chat 里看不到）

**结论（CEO 裁决后收口）**：方案 A 的「sessionId 传递机制」+ 方案 B 的「daemon 侧 currentSessionId 单一真相源」**合并为 daemon 权威模型**——入口可创建（不带 id），daemon 维护全量与当前指针，任一入口随时按 id/current 复用。实施序不变（A 机制先行 → B 指针与 reset 联动 → C stream 补全）。

#### 技术实现要点（基于方案 A）

1. **Session 并发控制**：
   - SQLite 内置写入锁保护（已有）
   - 可选增加应用层锁（`async-mutex`）防止消息乱序

2. **Session 格式统一**：
   - 当前 TriPilot 用 `timestamp-hex`，TriLC 用 `sess_{timestamp36}_{random}`
   - 建议统一为 TriLC 格式（已有 session store 支持）

3. **Stream 模式 Session 生成**（P2 增强）：
   - 当前仅 JSON 模式生成 session
   - 统一为：无论 stream=true/false，都生成 sessionId

### 4.2 Reset 联动会话与 Reset 粒度模型

**CEO 补充需求（2026-08-16）**：
> "reset 是联动的，但是好像没有针对单独的一个 session。"

**解读**：reset 联动是期望行为，但需要**单 session 粒度**——`trilc chat reset` 应只重置**当前会话所对应的初始化面/上下文**，而不是全局一刀切（其他会话/历史不受牵连）。

#### 问题根因

- `POST /internal/v1/init/reset` 清理运行态文件和装配产物
- 但不清理 session 相关数据
- **缺失 reset 粒度模型**：全局链重置 vs 单会话重置语义边界模糊

#### Reset 粒度模型设计

| 操作类型 | 粒度 | 影响范围 | 命令/端点 |
|---------|------|----------|-----------|
| **全局链重置** | 链级别 | 所有会话的初始化面 | `trilc chat reset --global` |
| **单会话重置** | Session 级别 | 仅当前会话上下文 | `trilc chat reset`（默认） |
| **会话清理** | Session 级别 | 删除/归档会话历史 | `POST /internal/v1/sessions/{id}/cancel` |

**语义边界**：
- **全局链重置**（动链）：清理 `company/state.json` + `init-chain.json` + 所有装配产物
  - 影响：所有会话的初始化面（systemPrompt 中的装配内容）
  - 用途：公司完全重新开张
- **单会话重置**（动 session）：清理当前 session 的上下文（消息历史、模型配置）
  - 影响：仅当前会话，其他会话不受牵连
  - 用途：重新开始当前对话，但保留公司配置

#### 可选方案

##### 方案 A：单会话 Reset（推荐，符合 CEO 粒度需求）

- **机制**：`trilc chat reset` 默认为单会话重置
  - 清理当前 session 的消息历史
  - 重置 session 状态（active → reset）
  - 保留其他 session 和全局链状态

- **实现**：
  ```bash
  # 默认：单会话 reset
  trilc chat reset              # 只重置当前会话

  # 全局链 reset（显式标志）
  trilc chat reset --global     # 重置全局初始化链
  ```

- **优势**：
  - 符合 CEO "单 session 粒度" 需求
  - 用户意图清晰（重置对话 vs 重置公司）
  - 其他会话不受牵连

##### 方案 B：Reset 时归档旧会话（保守方案）

- **机制**：reset 时将当前 session 标记为 `archived` 状态
  - 新增 `SessionStatus = 'archived'`
  - 用户可在会话列表中查看归档历史
  - 归档会话可通过 `/recover` 端点恢复

- **优势**：
  - 防止数据丢失（用户可能想恢复 reset 前的对话）
  - 符合"归档"而非"删除"的用户心智

- **劣势**：
  - 不符合 CEO "单 session 粒度" 需求（仍然是全局操作）
  - 归档会话可能积累过多

##### 方案 C：全局 Reset 时清理所有会话（不推荐）

- **机制**：reset 时调用 `deleteSession()` 清理所有 session

- **劣势**：
  - 数据丢失风险（误操作无法恢复）
  - 违背 CEO "单 session 粒度" 需求
  - 用户可能不理解"重置 = 删除历史"

#### 组合操作表达

| 场景 | 操作组合 | 命令 |
|------|---------|------|
| 重新开始当前对话 | 单会话 reset | `trilc chat reset` |
| 重新开始当前对话 + 清空历史 | 单会话 reset + cancel | `trilc chat reset --clear` |
| 公司完全重新开张 | 全局链 reset + 清空所有会话 | `trilc chat reset --global --clear-all` |

**结论**：方案 A（单会话 Reset）为推荐方向，符合 CEO "单 session 粒度" 需求，待产品侧确认 CLI 命令设计。

### 4.3 初始化流程会话处理

**问题根因**：
- I2 已删除 `hb_company-onboarding_` auto-resume 分支
- 初始化流程（selfcheck/assemble/link/sync/confirm）不感知 session
- 初始化相关的会话历史是否应该进入用户可见历史——产品侧待决策

**可选方案**：

#### 方案 A：初始化会话进入历史（推荐）

- **机制**：初始化流程产生的对话也作为普通 session 存储和展示
  - selfcheck 探测结果 → assistant 消息存入 session
  - assemble 问答 → 存入 session
  - 用户可在会话列表中查看初始化历史

- **优势**：
  - 完整的用户对话历史
  - 用户可回溯"为什么公司配置是这样"
  - 符合"所有对话都值得记录"的心智

#### 方案 B：初始化会话隐藏

- **机制**：初始化流程产生的对话不进入用户可见历史
  - 特殊 session 标记（如 `hidden: true`）
  - 会话列表过滤隐藏 session

- **优势**：
  - 减少会话列表噪音
  - 初始化流程对话用户可能不关心

- **劣势**：
  - 用户无法回溯初始化决策
  - 不完整的历史记录

**结论**：方案 A（初始化会话进入历史）为推荐方向，待产品侧确认用户心智。

### 4.4 最小改动路径（基于小狄技术方案）

**模块改动清单**：

| 模块 | 改动点 | 优先级 | 风险 | 对应方案 |
|------|--------|--------|------|----------|
| `app.ts` `/v1/messages` | 接收 `sessionId` 参数（带则复用，不带则生成新） | P0 | 低 | 方案A |
| `trilcDirect/trilcClient.ts` | `streamChat()` 传递 `args.sessionId` | P0 | 低 | 方案A |
| TriPilot `chatHistory.ts` | 调用 `streamChat()` 时传递 `historySessionId` | P0 | 低 | 方案A |
| `cli.ts` | `trilc chat reset` 默认单会话 reset（`--global` 全局） | P1 | 中 | 方案B |
| `app.ts` `/v1/messages` | Stream 模式也生成 sessionId | P2 | 低 | 方案C |
| `session-store/types.ts` | 新增 `SessionStatus = 'reset'`（可选） | P2 | 低 | 方案B |

**门禁**：
- 单测覆盖：sessionId 参数传递、单会话 reset、并发访问
- 集成测试：两入口交替使用、reset 后会话状态
- 活体冒烟：CEO 机装后态（TRILC_DATA_DIR 显式隔离）

**实施建议**：
- P0 优先实现（Session ID 同步）
- P1 补充（Reset 粒度模型）
- P2 可选（Stream 模式 Session 生成）

## 五、实施任务包

### 5.1 技术任务（基于小狄方案）

| 任务 | 负责人 | 优先级 | 依赖 | 状态 |
|------|--------|--------|------|------|
| T1: app.ts /v1/messages 接收 sessionId 参数 | 小狄 | P0 | - | pending |
| T2: trilcClient.streamChat() 传递 sessionId | 小狄 | P0 | T1 | pending |
| T3: TriPilot chatHistory 传递 historySessionId | 小全 | P0 | T1 | pending |
| T4: cli.ts 单会话 reset（默认） | 小狄 | P1 | - | pending |
| T5: cli.ts 全局 reset（--global 标志） | 小狄 | P1 | T4 | pending |
| T6: Stream 模式 session 生成 | 小狄 | P2 | - | pending |
| T7: SessionStatus 新增 reset 状态（可选） | 小狄 | P2 | - | pending |

### 5.2 产品验证（等待小乔口径）

| 验证项 | 验收标准 | 负责人 | 状态 |
|--------|----------|--------|------|
| V1: 两入口同步会话 | TriPilot 面板聊天 → trilc chat 可见相同历史 | 小乔 | pending |
| V2: 单会话 reset | `trilc chat reset` 只重置当前会话，其他会话不受影响 | 小乔 | pending |
| V3: 全局 reset | `trilc chat reset --global` 重置全局链 | 小乔 | pending |
| V4: 初始化会话可见性 | 初始化流程对话是否进入会话历史 | 小乔 | pending |

## 六、门禁与验证

### 6.1 单测覆盖

- `currentSessionId` 并发访问竞争条件
- `archived` 状态转换（active → archived）
- `set-current` 端点幂等性
- `tasks/submit` 复用已有 session 逻辑

### 6.2 集成测试

- 两入口交替使用：TriPilot 发起 → trilc chat resume → TriPilot 继续
- Reset 后会话状态：归档标记 + 会话列表过滤 + recover 恢复
- 初始化流程会话：selfcheck/assemble 对话是否正确记录

### 6.3 活体冒烟

- CEO 机装后态（TRILC_DATA_DIR 显式隔离，r19 教训）
- 跨入口会话同步端到端验证

### 6.4 护栏

- **6.4 零改动延续**：session-initializer.ts 与 TriMC 同源文件 diff 零行
- **密钥纪律**：密钥只走 env/config 注入
- **白名单纪律**：装配落点路径白名单枚举（与 I2 对齐）

---

## 附录 A：Claude Code 2.1.88 对照分析

> 待小狄补充原生 session 模型特性对照...

### 已移植特性

- Session store（SQLite 持久化）
- Sessions API（CRUD + fork + recover + compact）
- `--resume <id>` 命令行参数
- 会话列表 UI

### 缺失特性

- "当前 session"概念（currentSessionId 指针）
- Reset 联动会话（archived 状态）
- 初始化流程会话感知

### 可复用原生特性

- Session compact 机制（已存在）
- Auto-resume 分支（I2 已删除，结构化 init 流程取代）

---

## 附录 B：术语表

| 术语 | 定义 |
|------|------|
| Session | 单次对话会话，包含消息历史、模型、systemPrompt 等元数据 |
| Session ID | 会话唯一标识，格式 `sess_{timestamp36}_{random4}` |
| Current Session | 当前活跃会话，两入口共享的"正在使用"的会话指针 |
| Archived Session | 已归档会话，reset 后的旧会话状态（不可追加，可查看） |
| Init Session | 初始化流程产生的会话（selfcheck/assemble/link/sync/confirm） |

---

## 变更记录

- 2026-08-16: 初始版本（小贾起草框架 + 技术侧草案）
- 2026-08-16: 补充方案 A/B/C 方向对比 + 最小改动路径 + 实施任务包
- 2026-08-16: 整合小狄技术分析（session 全链路 + CC 2.1.88 对照 + 最小改动路径）
- 2026-08-16: 新增 CEO 补充：reset 粒度模型（全局链重置 vs 单会话重置）

# TriLC Daemon / Heartbeat / Timer 三层 MVP 产品需求

版本：V0.1-DRAFT
日期：2026-07-31
作者：CPO 小乔（ChiefProductOfficer）
任务来源：小贾交办 ET-20260731-001，tree 节点 daemon-hb-1
状态：DRAFT，待 CEO 复核后升入 product-state.md

---

## 文档性质

- 本文件是 **Product Requirements Document（PRD）**，不是技术实现方案。
- 所有结论均为产品侧判断；技术可行性需 CTO 评估，商业边界需 CEO 确认。
- 每个模块给出明确结论，不在需求文档中停留在提问层面。

---

## 0. 现状基线（Before State）

在给出 MVP 定义之前，先明确当前 TriLC 三层的事实基线：

| 层 | 源文件 | 当前状态 | 成熟度 |
|---|--------|---------|--------|
| Daemon | `src/runtime/daemon.ts` | Bare skeleton：start/stop/submitTask/executeStep/planTask，无 OS 服务集成，无崩溃恢复 | thin |
| Heartbeat | `src/local-node/node.ts` | `heartbeat()` = `console.log` 一行 | empty |
| Heartbeat Wake | `src/server/app.ts:ConnectionManager` | 已吸收 openclaw 的 heartbeat-wake（优先级合并/250ms 窗口/retry cooldown/enable-disable），但**仅用于 TriMC 连接健康检查** | medium（但 scope 窄） |
| Timer/Cron | 无 | 零实现 | absent |
| CLI | `src/cli.ts` | 已有 start/stop/status/run/chat/install-regrun/uninstall-regrun | base |
| Session Store | `src/session-store/` | 已有 SQLite 持久化、recovery API、safety check | good |
| LocalBus | `src/localbus/bus.ts` | 已有 EventEmitter 事件总线 | good |

**关键判断**：三层几乎全是空壳，但底盘（CLI、session-store、localbus、ConnectionManager 的 heartbeat-wake）已具备基础，不需要从头重建。

---

## 1. 用户场景与 Persona

### Persona A：TriCade 桌面用户（端用户，P0）

**场景**：
- 安装 TriCade 后，希望 TriLC 开机自启，不需要每次手动启动终端和 CLI。
- 系统托盘常驻，右键可查看 daemon 状态、最近任务、退出。
- 关闭 IDE 后 agent 任务继续在后台跑，不因为窗口关闭而中断。
- 网络断开时仍可本地使用，网络恢复后自动同步到 TriMC。

**产品判断**：桌面用户是 TriLC 的核心价值承载体。开机自启 + 系统托盘是桌面产品的入场券，没有就没有"产品"。**P0**。

### Persona B：开发者/高级用户（Power User，P1）

**场景**：
- 每日上午 9 点自动触发代码审查 agent，检查昨夜 PR。
- 每周五下午 5 点自动生成周报草稿。
- 自定义定时 prompt："每 30 分钟检查一次构建状态，异常时通知我"。

**产品判断**：定时 Agent 是 TriLC 区别于纯聊天工具的核心差异化能力——"不只在对话中帮你，还能在你不在的时候帮你"。但首版 MVP 应先验证最简链路，再扩展自定义 prompt。**P1**。

### Persona C：TriMC 云端运维（运维视角，P1）

**场景**：
- 接收 TriLC 节点心跳，监控在线节点数、健康状态。
- 节点离线超过 N 分钟 → 告警。
- 节点恢复上线 → 事件重放（已有 replay 能力）。

**产品判断**：TriMC 云端运维当前不是首要用户（TriMC 本身还在向 host 推进），但 heartbeat 数据结构需预留云端消费接口，避免后续推倒重来。**P1**。

### Persona D：会话管理（基础设施，P0）

**场景**：
- TriLC 异常退出（进程 kill、断电）后，正在进行的会话自动保存为 `interrupted` 状态。
- 下次启动 TUI 时提示"检测到未完成的会话，是否恢复？"
- 30 天前的已完成/过期会话自动清理，释放磁盘空间。

**产品判断**：异常退出恢复已有 session-store 基础；过期清理是零实现但必要的运维底线。两者都应进 MVP。**P0**。

---

## 2. Heartbeat 层 MVP 需求

### 2.1 心跳粒度：单节点统一心跳

**结论：单节点统一心跳，而非 agent 级别心跳。**

原因：
1. TriLC 当前只有一个 daemon 进程、一个 LocalNode 实例。agent 级别心跳的前提是"多 agent 并行运行且各自有生命周期"，这不在 MVP 范围内。
2. 单节点心跳足以覆盖 Persona C 的运维监控需求（节点在线/离线）。
3. 未来若需要 agent 级别心跳（如"cron agent A 上次执行时间"），可作为 heartbeat 事件的 `subtype` 扩展，不需要架构级变更。

### 2.2 Heartbeat Events 类型定义

**结论：定义以下四类 heartbeat event，MVP 实现前三类。**

```yaml
HeartbeatEventType:
  - system_health       # 节点系统健康 (P0)
  - exec_completion     # agent 任务执行完成 (P0)
  - cron_completion     # 定时任务执行完成 (P1，依赖 Timer/Cron 层)
  - session_event       # 会话状态变更（interrupted/recovered/completed）(P0)
```

每个事件携带统一 payload 头：
- `nodeId`: 节点 ID
- `eventType`: 事件类型
- `timestamp`: ISO 8601
- `severity`: info | warn | error
- `payload`: 类型特定数据

**与 openclaw 的差异**：openclaw 的 heartbeat event 面向消息通道（sent/ok-empty/ok-token/skipped/failed），TriLC 面向的是节点生命周期和任务事件。两者模型不同，不应直接照抄。

### 2.3 Heartbeat Active Hours：需要，但 P1

**结论：MVP 不实现 active hours，P1 补上。**

原因：
1. MVP 的 heartbeat 主要用于内部监控和 TriMC 上报，不是面向用户的打扰性通知——不存在"用户睡觉时被吵醒"的问题。
2. Active hours 的正确实现依赖时区感知和用户配置 UI，复杂度不适合挤进 MVP。
3. 但需求本身是有效的——当未来 heartbeat 触发 agent 动作（如 cron 执行期间发通知），active hours 就是必要的。**作为 P1 需求明确写入**。

### 2.4 Heartbeat Visibility：双通道

**结论：TUI 状态栏 + TriMC Dashboard 双通道，但不是 MVP 同步上。**

| 通道 | MVP | 说明 |
|------|-----|------|
| TUI 状态栏 | **P0** | TUI 底部状态栏显示 daemon 运行状态 + 最近一次 heartbeat 结果（绿色/黄色/红色圆点） |
| TriMC Dashboard | **P1** | 当 TriMC 进入服务器部署后，dashboard 消费 heartbeat 事件展示节点列表和健康状态 |
| 系统托盘 tooltip | **P2** | 系统托盘 hover 显示"TriLC 运行中 | 上次心跳: 10 秒前" |

### 2.5 与现有 ConnectionManager 的关系：协作，不替换

**结论：ConnectionManager 保持现有职责，heartbeat-wake 机制提升为通用基础设施，TriMC 连接检查降级为一个 consumer。**

现状：ConnectionManager 独占 heartbeat-wake 机制（优先级合并、250ms 窗口、retry cooldown），且只服务于 TriMC 连接检查。

目标架构：
```
HeartbeatWake (通用基础设施，从 ConnectionManager 抽离)
    ├── Consumer 1: TriMC 连接健康检查 (ConnectionManager 保留)
    ├── Consumer 2: 节点系统健康 heartbeat (新增)
    ├── Consumer 3: 任务完成事件 heartbeat (新增)
    └── Consumer N: 未来扩展
```

**产品判断**：
- ConnectionManager 的 heartbeat-wake 代码**不重写**。它已经是吸收 openclaw 的成熟实现。
- 从产品角度，要求的是：heartbeat-wake 的优先级合并和 enable-disable 能力被**复用**，而非**独占**。
- 技术实现方式（抽离为独立模块 vs. ConnectionManager 提供通用 API）由 CTO 决定，产品侧不约束。

### 2.6 Heartbeat Wake 边界：提升为通用基础设施

**结论：APPROVE。heartbeat-wake 从"ConnectionManager 内部机制"提升为"TriLC 通用 heartbeat 调度基础设施"。**

具体边界：
- **通用部分**（提升）：优先级合并、coalesce 窗口、retry cooldown、enable/disable toggle、requestHeartbeatNow() API。
- **专用部分**（保留在 ConnectionManager）：TriMC 连接健康检查的具体逻辑、degraded/connected 状态机、事件重放触发。

---

## 3. Daemon 层 MVP 需求

### 3.1 OS 服务集成：Windows-only MVP，macOS/Linux P2

**结论：MVP 仅实现 Windows 平台。macOS/Linux 列入 P2。**

原因：
1. TriCade 桌面端的首发平台是 Windows（参考 output 目录下的 `TriMetaverse-Desktop-v0.1.0-windows`）。
2. CLI 已有 `install-regrun`（Registry Run 开机自启），无需 admin 权限，已验证可行。
3. `install-service`（nssm SYSTEM 服务）已因"无法访问用户 API Key + 端口冲突"被废弃，产品侧确认该决策——**不恢复 nssm 路径**。
4. macOS 的 launchd 和 Linux 的 systemd 集成需要平台特定的 plist/unit 文件生成和测试，属于 P2。

### 3.2 进程守护：崩溃自动重启，P1

**结论：MVP 不做自动重启守护。P1 补上。**

当前 CLI `start` 模式已经是 detached spawn + PID file + port-in-use guard，基础可用。

MVP 不做自动重启的原因：
1. 正确实现进程守护需要一个独立的 watchdog 进程（否则 daemon 自己崩溃时谁来做重启判断？），这引入了架构复杂度。
2. 当前阶段用户量极少，先让 daemon 足够稳定，再补 watchdog。
3. CLI 的 port-in-use guard 和 healthCheck 轮询已经能在多数场景下保障可用性。

P1 的重启策略定义：
- 指数退避：1s → 2s → 4s → 8s → 16s → 32s（max）
- 最大重试：5 次/10 分钟窗口
- 超过上限 → 停止重试，写入错误日志，TUI 显示"daemon 异常，请手动重启"

### 3.3 安装/卸载：手动 CLI，MVP 已有

**结论：当前 CLI 的 `install-regrun` / `uninstall-regrun` 已满足 MVP 需求，不需要额外工作。**

- `install-regrun`：注册到 `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`，用户登录时自动执行 `trilc start`。
- `uninstall-regrun`：移除注册表项。
- 不需要 MSI 安装包或图形化安装向导——MVP 阶段 CLI 足够了。

### 3.4 CLI 集成：已有，需补充 restart 命令

**结论：当前 CLI 已有 start/stop/status/run，补一个 `restart` 即可。**

```bash
trilc daemon start        # 已有（`trilc start`）
trilc daemon stop         # 已有（`trilc stop`）
trilc daemon status       # 已有（`trilc status`）
trilc daemon restart      # 新增：stop + start 原子操作
```

注意：当前 CLI 命令是 `trilc start`（无 `daemon` 子命令）。产品建议保持现有命令名称不变，只新增 `trilc restart`。

### 3.5 健康监控：暴露到 /healthz（已有）+ localbus event

**结论：健康状态通过两个通道暴露，均已有基础。**

| 通道 | 状态 | 说明 |
|------|------|------|
| HTTP `/healthz` | 已有 | 返回 `{ ok: true, service: "trilc", trimc: "connected"|"degraded" }` |
| localbus event | 已有 | `node:connected` / `node:degraded` / `node:local` 事件 |

MVP 需要补充的健康指标（追加到 `/healthz` 响应和 heartbeat event）：
- `uptime`: daemon 运行时长（秒）
- `activeTasks`: 当前活跃任务数
- `queueSize`: 事件队列待处理数
- `version`: agent-core 版本（已有）

---

## 4. Timer/Cron 层 MVP 需求

### 4.1 定时任务类型

**结论：MVP 支持 cron 表达式 + interval 两种模式。`at` 一次性任务列入 P2。**

| 类型 | MVP | 说明 |
|------|-----|------|
| Cron 表达式 | **P0** | 标准 5 字段 cron（分 时 日 月 周），如 `0 9 * * 1-5` 工作日 9 点 |
| Interval | **P0** | 简单间隔，如 `30m`、`2h`，作为 cron 的易用替代 |
| At 一次性 | **P2** | "明天下午 3 点提醒我开会"——需要在自然语言解析和定时器之间做桥接，复杂度高 |

### 4.2 定时 Agent 触发

**结论：定时任务触发预定义的 agent prompt，不支持自定义 workflow。**

MVP 模式：
1. 用户通过 TUI（或配置文件，见下）定义一个 cron job。
2. Cron job 到达触发时间 → daemon 构造一个 agent 执行请求。
3. 请求通过 `LocalNode.runAgent()` 执行（复用现有 agent loop）。
4. 执行结果通过 heartbeat event 上报。

MVP 支持的 agent 触发方式：
- **预定义 agent 类型**：`code_review`、`weekly_report`、`custom_prompt`
- **custom_prompt**：用户自由文本 prompt，由 agent 解释执行。
- **不支持的**：多 agent 编排、条件分支、错误重试策略（P2）。

### 4.3 Session Reaper：过期会话清理

**结论：P0。Session Reaper 是 MVP 的一部分——它是基础设施运维底线，不是可选功能。**

清理策略：

| 会话状态 | 保留时长 | 行为 |
|----------|---------|------|
| `completed` | 30 天 | 到期后删除会话记录和消息 |
| `interrupted` | 7 天 | 到期后删除（中断太久已无恢复价值） |
| `active` | 永不过期 | 不清理（可能仍在进行中） |
| `expired` | 立即清理 | 已标记为 expired 的记录在下次 reaper 运行时删除 |

Reaper 运行频率：每小时一次。作为 daemon 启动时自动注册的第一个 cron job。

### 4.4 任务持久化

**结论：SQLite 持久化，复用 session-store 的存储模式。**

- Cron job 定义存储在 `{dataDir}/cron.db` SQLite 数据库。
- Schema 包含：id、name、schedule（cron 或 interval）、agentType、prompt、enabled、createdAt、updatedAt、lastRunAt、lastRunStatus。
- 重启不丢失，daemon 启动时从 DB 加载所有 enabled jobs。

### 4.5 运行日志 + 失败告警

**结论：P1。MVP 完成基本日志记录；失败告警（TUI 通知 / TriMC 告警）P1。**

MVP 日志范围：
- 每次 cron 执行记录一行：时间、jobId、状态（success/failed/timeout）、耗时。
- 日志存储在 SQLite（`cron.db` 的 `execution_log` 表）。
- TUI 新增 `trilc cron log` 命令查看最近执行记录。

P1 告警：
- 连续 3 次失败 → localbus 发布 `cron:degraded` 事件 → TUI 状态栏告警。
- 未来 TriMC dashboard 可消费此事件做云端告警。

---

## 5. 平台优先级与 MVP 裁剪

### 5.1 P0 / P1 / P2 分层

#### P0：MVP 必做（当前 1-2 个迭代）

| 编号 | 功能 | 说明 |
|------|------|------|
| P0-1 | Heartbeat 事件系统 | system_health + exec_completion + session_event 三类事件；localbus 发布；TUI 状态栏可见 |
| P0-2 | Heartbeat Wake 通用化 | 从 ConnectionManager 提升为通用基础设施，保留现有 TriMC 连接检查作为一个 consumer |
| P0-3 | Daemon 健康指标 | uptime、activeTasks、queueSize 追加到 /healthz 和 heartbeat event |
| P0-4 | `trilc restart` CLI | 新增 restart 命令（stop + start 原子操作） |
| P0-5 | Cron 基础引擎 | cron 表达式 + interval 解析器；SQLite 持久化；启动时加载 |
| P0-6 | Session Reaper | 每小时清理过期会话（30d completed / 7d interrupted） |
| P0-7 | Session 自动保存与恢复提示 | 异常退出→自动标记 interrupted；下次启动 TUI 时提示恢复（已有 session-store API 基础） |
| P0-8 | 系统托盘（Windows） | 最小托盘：右键菜单（状态/退出）+ 左键打开 TUI。由 TriPilot 侧实现，TriLC 提供状态 API |

#### P1：次优先（后续迭代）

| 编号 | 功能 | 说明 |
|------|------|------|
| P1-1 | 进程守护（watchdog） | 独立 watchdog 进程，崩溃自动重启，指数退避 |
| P1-2 | Heartbeat Active Hours | 时区感知 + 可配置活跃时间段 |
| P1-3 | Cron 自定义 prompt | TUI 中新增 cron job 管理界面，支持用户编写自定义 prompt |
| P1-4 | Cron 执行日志与告警 | `trilc cron log` 命令；连续 3 次失败告警 |
| P1-5 | TriMC Dashboard 集成 | TriMC 消费 heartbeat 事件，展示节点列表和健康状态 |
| P1-6 | Cron 预定义 agent | code_review / weekly_report 两个预定义 agent prompt 模板 |

#### P2：不做/远期

| 编号 | 功能 | 说明 |
|------|------|------|
| P2-1 | macOS/Linux 平台 | launchd / systemd 集成 |
| P2-2 | At 一次性定时任务 | 自然语言 → 定时器桥接 |
| P2-3 | 多 agent cron 编排 | 条件分支、错误重试、agent 链 |
| P2-4 | 系统托盘 tooltip 状态 | "TriLC 运行中 | 上次心跳: 10 秒前" |

### 5.2 平台策略

**结论：Windows 优先。macOS/Linux 列为 P2。**

原因已在上文 3.1 说明。

### 5.3 MVP 验收标准

| 门禁 | 验收标准 |
|------|---------|
| G1 | Daemon `trilc start` → `/healthz` 返回健康状态（含 uptime/activeTasks/queueSize）|
| G2 | `trilc restart` 无报错完成 stop + start，daemon 状态恢复 healthy |
| G3 | 执行一次 agent 任务 → heartbeat event `exec_completion` 通过 localbus 发布 → TUI 状态栏可见 |
| G4 | Session Reaper 清理 1 条 expired 会话 → 数据库中该会话记录消失 |
| G5 | 异常 kill daemon → session 自动标记 interrupted → 重启 TUI → 恢复提示出现并可恢复 |
| G6 | 定义一个 interval=1m 的 cron job → 1 分钟后 agent 执行 → cron job 的 lastRunAt 更新 |
| G7 | `install-regrun` → 重启/登出登入 → TriLC 自动启动 |

---

## 6. 与现有 TriLC 模块的关系

### 6.1 LocalRuntimeDaemon 定位

**结论：保留并强化。LocalRuntimeDaemon 是三层 MVP 的总 orchestrator。**

改造方向：

```
LocalRuntimeDaemon (改造后)
├── HeartbeatScheduler    (新增) — 管理 heartbeat 事件发布周期
│   └── HeartbeatWake     (提升) — 通用优先级合并调度
├── CronScheduler         (新增) — 管理 cron job 的解析/触发
│   └── SessionReaper     (新增) — 首个内置 cron job
├── ConnectionManager     (保留) — TriMC 连接健康检查（降级为 heartbeat consumer）
├── LocalNode             (保留) — agent 执行入口
├── LocalPlanner          (保留) — 任务分解
└── TaskRuntime           (保留) — 任务状态追踪
```

- **不取代** LocalRuntimeDaemon：它已经是正确的抽象层次（本地运行时的生命周期管理者）。
- **强化**：在现有 start/stop/submitTask/executeStep 基础上，增加 heartbeat 和 cron 的子模块管理。
- **不合并**：不要把 ConnectionManager 的逻辑合并进 daemon——保持独立模块，通过 localbus 通信。

### 6.2 ConnectionManager 定位

**结论：保留专用职责，heartbeat-wake 通用部分提升。**

```
HeartbeatWake (独立模块)
    ├── 优先级合并 (action > default > interval > retry)
    ├── 250ms coalesce 窗口
    ├── retry cooldown (1s)
    ├── enable/disable toggle
    └── requestHeartbeatNow() API

ConnectionManager (保留)
    ├── 依赖 HeartbeatWake
    ├── TriMC 连接健康检查 (POST /internal/v1/heartbeat)
    ├── degraded/connected 状态机 (3 次失败→degraded, 2 次成功→connected)
    └── 事件重放触发 (degraded→connected 时 replay)
```

- **不替换** ConnectionManager：它的 TriMC 连接管理逻辑是成熟的、经过验证的。
- **协作**：HeartbeatWake 抽离后，ConnectionManager 和新的 HeartbeatScheduler 都是 HeartbeatWake 的 consumer。
- 技术实现上，HeartbeatWake 可能作为一个独立 class 或 ConnectionManager 暴露的通用 API。**具体方式由 CTO 决定。**

### 6.3 Session Store / LocalBus 定位

**Session Store：**
- **保留并依赖**。Session Reaper 直接使用 session-store 的 `listSessions()` + `deleteSession()` API。
- Session 自动保存已在 app.ts 中实现（每次 agent 调用结束时保存），不需产品侧新增需求。
- 恢复提示（Persona D）需要在 TUI 侧新增逻辑：启动时检查 `findInterruptedSessions()` → 如有则显示提示。

**LocalBus：**
- **保留并扩展事件类型**。新增 heartbeat 和 cron 事件类型到 `LocalBusEvent` union。
- 新增事件：
  ```typescript
  | { type: 'heartbeat:system_health'; nodeId: string; metrics: {...} }
  | { type: 'heartbeat:exec_completion'; taskId: string; durationMs: number }
  | { type: 'heartbeat:session_event'; sessionId: string; event: 'interrupted'|'recovered'|'completed' }
  | { type: 'cron:exec_completion'; jobId: string; status: 'success'|'failed' }
  | { type: 'cron:degraded'; jobId: string; consecutiveFailures: number }
  ```

---

## 附录 A：产品判断汇总

| 编号 | 判断 | 结论 |
|------|------|------|
| J1 | 心跳粒度 | 单节点统一心跳 |
| J2 | Active Hours | P1（MVP 不做） |
| J3 | 心跳可见性 | TUI 状态栏 P0 / TriMC Dashboard P1 / 托盘 tooltip P2 |
| J4 | Heartbeat Wake 边界 | 提升为通用基础设施，保留 ConnectionManager |
| J5 | OS 平台 | Windows-only MVP |
| J6 | 进程守护 | P1（MVP 不做自动重启） |
| J7 | 定时任务类型 | cron + interval P0 / at P2 |
| J8 | Session Reaper | P0（基础设施底线） |
| J9 | 任务持久化 | SQLite（复用 session-store 模式） |
| J10 | LocalRuntimeDaemon | 保留并强化为总 orchestrator |

## 附录 B：依赖与风险

### 跨模块依赖

| 依赖方 | 被依赖方 | 内容 | 方向 |
|--------|---------|------|------|
| TriLC daemon MVP | TriPilot | 系统托盘 UI + 开机自启调用 | TriPilot → TriLC |
| TriLC heartbeat MVP | TriMC | Heartbeat 消费端 API (`POST /internal/v1/heartbeat`) | TriLC → TriMC |
| TriLC cron MVP | agent-core | `LocalNode.runAgent()` 作为 cron 执行引擎 | TriLC internal |
| TriLC session reaper | session-store | SQLite 操作 API | TriLC internal |

### 风险

| 风险 | 影响 | 缓解 |
|------|------|------|
| ConnectionManager 重构引入回归 | TriMC 连接检查失效 → 离线 fallback 不触发 | 不重写 ConnectionManager，只抽离通用部分；CTO review 变更范围 |
| Cron 引擎复杂度被低估 | cron 表达式解析、时区处理、job 抢占等 corner case 多 | P0 只做最小 cron 子集（5 字段标准 cron + 简单 interval）；不处理时区 |
| 系统托盘跨进程通信不可靠 | TUI 显示的 daemon 状态与实际不一致 | 通过 HTTP /healthz 轮询获取真实状态，不依赖 IPC 缓存 |
| Session Reaper 误删活跃会话 | 用户正在进行的会话被清理 | Reaper 只清理 `completed`/`interrupted`/`expired` 状态；`active` 永不过期 |

## 附录 C：使用依据

本 PRD 基于以下源文件做出判断：

- `TriLC/src/runtime/daemon.ts` — LocalRuntimeDaemon 当前实现
- `TriLC/src/local-node/node.ts` — LocalNode 当前实现（含 heartbeat 空壳）
- `TriLC/src/server/app.ts` — ConnectionManager + heartbeat-wake 实现
- `TriLC/src/cli.ts` — CLI 命令现状
- `TriLC/src/session-store/types.ts` — Session 数据模型
- `TriLC/src/localbus/bus.ts` — LocalBus 事件类型
- `TriLC/docs/registry/product-state.md` — TriLC 产品定位
- `TriMetaverse/docs/registry/product-state.md` — 公司级产品状态与 Simplest Verifiable Model
- `vendor/openclaw/src/infra/heartbeat-runner.ts` — Heartbeat 调度参考
- `vendor/openclaw/src/infra/heartbeat-wake.ts` — Heartbeat Wake 参考实现
- `vendor/openclaw/src/infra/heartbeat-events.ts` — Heartbeat 事件系统参考
- `vendor/openclaw/src/infra/heartbeat-active-hours.ts` — Active Hours 参考
- `vendor/openclaw/src/agents/tools/cron-tool.ts` — Cron 工具参考
- `vendor/openclaw/src/signal/daemon.ts` — Daemon 进程守护参考

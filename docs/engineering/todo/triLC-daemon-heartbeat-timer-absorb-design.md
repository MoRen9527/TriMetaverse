# TriLC Daemon / Heartbeat / Timer 从 openclaw 吸收技术方案

> CTO 小狄 | 2026-07-31 | tree: daemon-hb-2 | ET-20260731-002
>
> 依据源:
> - `TriLC/vendor/openclaw/src/daemon/service.ts` (GatewayService 跨平台接口)
> - `TriLC/vendor/openclaw/src/infra/heartbeat-runner.ts` (HeartbeatRunner 调度器, 1200行)
> - `TriLC/vendor/openclaw/src/infra/heartbeat-wake.ts` (Wake 合并/优先级/重试, 273行)
> - `TriLC/vendor/openclaw/src/cron/service.ts` (CronService, 60行门面)
> - `TriLC/vendor/openclaw/src/cron/service/ops.ts, state.ts, store.ts, timer.ts`
> - `TriLC/src/runtime/daemon.ts` (LocalRuntimeDaemon bare skeleton)
> - `TriLC/src/local-node/node.ts` (LocalNode.heartbeat stub)
> - `TriLC/src/server/app.ts` (ConnectionManager 已部分吸收 heartbeat-wake)

---

## 1. 吸收策略总览

### 1.1 分类表

| 类别 | openclaw 源模块 | 处理策略 | 理由 |
|------|----------------|---------|------|
| **Port** | `infra/heartbeat-wake.ts` | 提取为独立 `TriLCHeartbeatWake`，ConnectionManager 重构为调用方 | 已在 ConnectionManager 内联实现了 ~60%；独立化后 HeartbeatRunner 也可复用；openclaw 的实现经过充分验证 |
| **Adapt** | `daemon/service.ts` + `schtasks.ts`/`launchd.ts`/`systemd.ts` | 简化适配为 `TriLCDaemonService`，去掉 Gateway/Node 双态 + profile 机制 | TriLC 不需要多 profile、不需要 Gateway vs Node 分离；只需单一 daemon 进程管理 |
| **Adapt** | `infra/heartbeat-runner.ts` | 大幅简化：去掉 agent 多实例、channel delivery、HEARTBEAT.md 文件 gating、reply payload 处理 | TriLC 只有一个本地 agent；心跳目标是执行定时任务触发，不是向消息通道发送摘要 |
| **Rewrite** | `cron/service.ts` + `cron/service/*.ts` | 保留 CronService 门面 + JSON 持久化模式 + 锁机制；替换 `croner` 做调度；去掉 isolated-agent、channel delivery、webhook | openclaw 的 cron 深度耦合消息通道和 agent 分发；TriLC 需要纯调度 + agent 触发 |
| **Skip** | `auto-reply/heartbeat*.ts`, `auto-reply/reply.ts` | 不吸收 | TriLC 不向通道发送心跳回复；心跳触发 agent 执行任务 |
| **Skip** | `channels/plugins/*`, `outbound/deliver.ts` | 不吸收 | TriLC 没有多通道架构 |
| **Skip** | `agents/agent-scope.ts`, `config/sessions.ts` | 不吸收 | TriLC 使用自己的 `contract-resolver` + `session-store` |
| **Skip** | `cron/isolated-agent/*` | 不吸收 | TriLC 没有 isolated agent session 模式 |
| **Skip** | `heartbeat-active-hours.ts`, `heartbeat-visibility.ts` | 不吸收 | MVP 不需要 active-hours 静默窗口 |

### 1.2 关键文件逐一评估

#### `daemon/service.ts` (225 行)
- **吸收价值**: 高 — GatewayService 接口和跨平台注册表模式是核心参考
- **吸收方式**: Adapt — 保留接口形状 (stage/install/uninstall/stop/restart/isLoaded/readCommand/readRuntime)，去掉 Gateway/Node 双态
- **关键设计点**:
  - `readGatewayServiceState` 从已安装的系统产物 (plist/unit/XML) 读取状态，而非依赖内存
  - start = restart，因为系统服务管理器内建 keepalive
  - `ignoreServiceWriteResult` — 写操作不抛异常，stage 只是写入不启用
  - `GATEWAY_SERVICE_REGISTRY` 按平台分发 (darwin/linux/win32)
- **需要修改**: 标签名改为 `ai.trilc.daemon`；去掉 `node-service.ts` wrapper 模式 (TriLC 不需要两个 service 类型)

#### `schtasks.ts` (Windows Scheduled Task, 完整实现)
- **吸收价值**: 高 — Windows 是 TriLC 一等平台
- **吸收方式**: Adapt — 保留 schtasks.exe CLI 调用模式，简化 XML
- **关键依赖**: `schtasks-exec.ts` (schtasks.exe spawn wrapper), `cmd-argv.ts` (Windows 命令行转义), `cmd-set.ts` (环境变量 SET 语法), `kill-tree.ts` (进程树清理)
- **TriLC 简化**: 去掉 `startup-fallback` (注册表 Run key 兜底), 去掉 `windows-install-roots` (不需要多安装根)
- **XML 模板**: openclaw 使用 `schtasks /Create /XML` 传入 XML 文件；TriLC 可复用此模式

#### `launchd.ts` (macOS LaunchAgent)
- **吸收价值**: 中 — macOS 是预期平台
- **吸收方式**: Adapt — 保留 plist 写入 + `launchctl bootstrap/bootout` 模式
- **关键依赖**: `launchd-plist.ts` (plist XML builder), `launchd-restart-handoff.ts` (detached restart 避免当前进程被杀)
- **TriLC 简化**: 单 label `ai.trilc.daemon`，无 legacy label 兼容

#### `systemd.ts` (Linux systemd user unit)
- **吸收价值**: 中 — Linux 是预期平台
- **吸收方式**: Adapt — 保留 unit 文件写入 + `systemctl --user` 模式
- **关键依赖**: `systemd-unit.ts` (unit 文件解析/渲染), `systemd-linger.ts` (linger 检测), `systemd-unavailable.ts` (不可用分类)
- **TriLC 简化**: 单 service name `trilc-daemon`，无 legacy name 兼容

#### `infra/heartbeat-wake.ts` (273 行) — 核心参考
- **吸收价值**: 极高 — 整个模块设计精炼且高度可复用
- **吸收方式**: Port — 保留完整结构，做以下适配:
  - 去掉 `agentId`/`sessionKey` 多目标键 → MVP 单 handler
  - 保留 `reason` 优先级 (retry < interval < default < action)
  - 保留 `DEFAULT_COALESCE_MS=250` / `DEFAULT_RETRY_MS=1000`
  - 保留 `setHeartbeatWakeHandler` 的 generation guard 模式
  - 保留 `requestHeartbeatNow` coalescing + timer 抢占逻辑
- **ConnectionManager 当前状态**: 已内联实现了约 60% 的功能 (WAKE_PRIORITY, PendingWake, _scheduleWake, _executeWake, requestHeartbeatNow, hasPendingWake, enable/disable toggle); 需要提取为独立模块

#### `infra/heartbeat-runner.ts` (1200 行)
- **吸收价值**: 高 (架构模式) / 低 (具体实现)
- **吸收方式**: Adapt — 保留 `HeartbeatRunner` 三态 (stopped/agents/timer) + `run` handler + `updateConfig` 模式；大幅简化 runHeartbeatOnce
- **TriLC 简化**: 不需要 per-agent heartbeat config；不需要 HEARTBEAT.md 文件读取；不需要 channel delivery；不需要 reply payload normalization；不需要 heartbeat dedup
- **保留**: agent state (interval/nextDue/lastRun) 调度循环；`requests-in-flight` skip + wake 层重试协作

#### `cron/service.ts` (60 行门面)
- **吸收价值**: 高 — 干净的门面模式
- **吸收方式**: Rewrite — 保留 `start/stop/status/list/add/update/remove/run/enqueueRun/getJob/wake` 方法签名；实现替换为 `croner`

#### `cron/service/state.ts` + `store.ts` + `timer.ts` + `ops.ts`
- **吸收价值**: 高 (模式) / 低 (具体依赖)
- **吸收方式**: Rewrite
  - `state.ts`: 保留 `CronServiceDeps` 依赖注入模式，替换 deps 内容为 TriLC 本地依赖 (localbus, agent-core)
  - `store.ts`: 保留 JSON 文件持久化 + mtime 检测 + `loadCronStore`/`saveCronStore` 模式
  - `timer.ts`: 保留 `armTimer`/`stopTimer`/`executeJobCoreWithTimeout`/`runMissedJobs` 模式；实现替换
  - `ops.ts`: 保留 `locked` 互斥模式
  - **`MAX_TIMER_DELAY_MS=60000`** 和 **`MIN_REFIRE_GAP_MS=2000`** 常量直接复用

### 1.3 依赖链分析

| 依赖 | 来源 | 保留/替换 | 说明 |
|------|------|----------|------|
| `croner` (npm) | openclaw 使用 `croner` 做 cron 表达式解析 | **保留** | MIT 协议, ~15KB, 支持标准 5/6 段 cron + 秒级 |
| `plugin-sdk/reply-payload` | openclaw 内部模块 | **跳过** | TriLC 不需要 reply payload 判断 |
| `agents/agent-scope` | openclaw 内部模块 | **替换** | TriLC 使用 `contract-resolver` |
| `config/sessions` | openclaw 内部模块 | **跳过** | TriLC 使用 `session-store` (SQLite) |
| `channels/plugins` | openclaw 内部模块 | **跳过** | TriLC 无多通道 |
| `auto-reply/*` | openclaw 内部模块 | **跳过** | TriLC 无消息回复 |
| `process/command-queue` | openclaw 内部模块 | **替换** | TriLC 使用 `localbus` 事件总线 |
| `@trimetaverse/agent-core` | TriLC 现役 | **保留** | agentLoop 入口 |
| `trimodel` | TriLC 现役 | **保留** | Message 类型 |
| `localbus` | TriLC 现役 | **保留** | publish/subscribe 事件总线 |
| `session-store` | TriLC 现役 | **保留** | SQLite 会话持久化 |

### 1.4 ESM 兼容性

- **现状**: TriLC 全部模块使用 ESM (`import`/`export`), `package.json` 声明 `"type": "module"`
- **openclaw vendor**: 同样 ESM, 使用 `.js` 扩展名的 import specifier
- **croner**: ESM + CJS 双格式, 支持 `import { Cron } from 'croner'`
- **结论**: 无兼容性阻塞; 直接使用 ESM import

---

## 2. Daemon 层技术方案

### 2.1 TriLCDaemonService 接口

```typescript
// src/daemon/service.ts

export interface TriLCDaemonServiceConfig {
  /** 服务显示名称, 默认 "TriLC Daemon" */
  label?: string;
  /** Node.js 可执行文件路径 (process.execPath) */
  nodeBin: string;
  /** TriLC CLI 入口脚本路径 */
  entryScript: string;
  /** 传递给 daemon 子进程的 CLI 参数 */
  programArgs: string[];
  /** 工作目录 */
  cwd: string;
  /** 额外环境变量 */
  env?: Record<string, string>;
  /** 数据目录 (用于 plist/unit/XML 的输出路径) */
  dataDir: string;
  /** 端口号 (用于 schtasks 的 XML 模板) */
  port: number;
}

export interface DaemonServiceState {
  installed: boolean;
  loaded: boolean;   // launchd: loaded; systemd: enabled; schtasks: registered
  running: boolean;
  label: string;
  command: { programArguments: string[]; workingDirectory?: string; environment?: Record<string, string> } | null;
  runtime: { status: "running" | "stopped" | "unknown"; pid?: number; uptimeMs?: number } | null;
}

export interface DaemonServiceStartResult {
  outcome: "started" | "scheduled" | "missing-install";
  state: DaemonServiceState;
}

export interface TriLCDaemonService {
  /** 生成服务配置文件 (plist/unit/XML) 但不启用, 用于预览/调试 */
  stage(config: TriLCDaemonServiceConfig): Promise<string>;  // 返回生成的文件路径
  /** 安装并启用服务 */
  install(config: TriLCDaemonServiceConfig): Promise<void>;
  /** 卸载并停用服务 */
  uninstall(config: TriLCDaemonServiceConfig): Promise<void>;
  /** 停止运行中的服务 (不卸载) */
  stop(config: TriLCDaemonServiceConfig): Promise<void>;
  /** 重启服务 */
  restart(config: TriLCDaemonServiceConfig): Promise<DaemonServiceStartResult>;
  /** 查询服务状态 */
  status(config: TriLCDaemonServiceConfig): Promise<DaemonServiceState>;
  /** 检查服务是否已启用 */
  isLoaded(config: TriLCDaemonServiceConfig): Promise<boolean>;
}
```

### 2.2 跨平台实现

#### Windows: schtasks XML 模板

```xml
<!-- 生成到 %APPDATA%/TriLC/daemon/task.xml -->
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>TriLC Daemon — local AI agent runtime</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
      <Delay>PT30S</Delay>  <!-- 登录后 30 秒启动, 避免启动风暴 -->
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <RunLevel>LeastPrivilege</RunLevel>
      <LogonType>InteractiveToken</LogonType>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>  <!-- 无限制 -->
    <RestartOnFailure>
      <Interval>PT1M</Interval>
      <Count>3</Count>
    </RestartOnFailure>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>C:\Program Files\nodejs\node.exe</Command>
      <Arguments>--enable-source-maps "D:\path\to\trilc\dist\cli.js" daemon --port=18710</Arguments>
      <WorkingDirectory>D:\path\to\trilc</WorkingDirectory>
    </Exec>
  </Actions>
</Task>
```

安装命令:
```
schtasks /Create /TN "TriLC Daemon" /XML "%APPDATA%\TriLC\daemon\task.xml" /F
```

查询状态:
```
schtasks /Query /TN "TriLC Daemon" /FO LIST /V
```

停止:
```
schtasks /End /TN "TriLC Daemon"
```

卸载:
```
schtasks /Delete /TN "TriLC Daemon" /F
```

#### macOS: launchd plist

```xml
<!-- ~/Library/LaunchAgents/ai.trilc.daemon.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>ai.trilc.daemon</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>--enable-source-maps</string>
    <string>/path/to/trilc/dist/cli.js</string>
    <string>daemon</string>
    <string>--port=18710</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/path/to/trilc</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/Users/x/Library/Logs/ai.trilc.daemon.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/x/Library/Logs/ai.trilc.daemon.err.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>TRILC_DATA_DIR</key>
    <string>/Users/x/Library/Application Support/TriLC</string>
  </dict>
</dict>
</plist>
```

管理命令:
```bash
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.trilc.daemon.plist   # install
launchctl bootout gui/$UID/ai.trilc.daemon                                     # uninstall
launchctl kickstart gui/$UID/ai.trilc.daemon                                   # restart
launchctl list | grep trilc                                                     # status
```

#### Linux: systemd user unit

```ini
# ~/.config/systemd/user/trilc-daemon.service
[Unit]
Description=TriLC Daemon — local AI agent runtime
After=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/node --enable-source-maps /path/to/trilc/dist/cli.js daemon --port=18710
WorkingDirectory=/path/to/trilc
Restart=on-failure
RestartSec=10
Environment=TRILC_DATA_DIR=%h/.local/share/TriLC

[Install]
WantedBy=default.target
```

管理命令:
```bash
systemctl --user daemon-reload                  # reload unit
systemctl --user enable trilc-daemon.service     # install
systemctl --user disable trilc-daemon.service    # uninstall
systemctl --user start trilc-daemon.service      # start
systemctl --user stop trilc-daemon.service       # stop
systemctl --user status trilc-daemon.service     # status
```

### 2.3 与 LocalRuntimeDaemon 的关系

**两者是不同层次的抽象，互补而非替代:**

| 维度 | `TriLCDaemonService` | `LocalRuntimeDaemon` |
|------|---------------------|---------------------|
| 职责 | OS 级服务生命周期管理 | 应用级 agent 运行时 |
| 管理对象 | schtasks/launchd/systemd 注册 | LocalNode + LocalPlanner + TaskRuntime |
| 使用场景 | CLI `trilc daemon install` / TUI 设置面板 | `createTriLCApp().start()` 内部 |
| 启动方式 | OS 在登录/启动时拉起进程 | 进程内模块初始化 |

**关系**: 并行。`TriLCDaemonService` 管理进程的存在性；`LocalRuntimeDaemon` 管理进程内的 agent 逻辑。进程入口 (`cli.ts daemon`) 在启动时调用 `TriLCDaemonService.status()` 确认自身是 daemon 模式，然后初始化 `LocalRuntimeDaemon` 并启动 HTTP server。

**当前 LocalRuntimeDaemon 需要保留**: 它是 `createTriLCApp` 中 `LocalNode` 的工厂和 task 管理器的所有者。daemon 层不替代它。

### 2.4 CLI 命令扩展

```
trilc daemon install          # 安装 OS 服务
trilc daemon uninstall        # 卸载 OS 服务
trilc daemon start            # 启动服务
trilc daemon stop             # 停止服务
trilc daemon restart          # 重启服务
trilc daemon status           # 查询状态 (JSON)
trilc daemon stage            # 预览配置文件 (dry-run)
```

### 2.5 /healthz 扩展

现有 `/healthz` 返回:
```json
{ "ok": true, "service": "trilc", "trimc": "connected" }
```

扩展后:
```json
{
  "ok": true,
  "service": "trilc",
  "trimc": "connected",
  "daemon": {
    "mode": "systemd",
    "uptimeSeconds": 3600,
    "heartbeat": { "enabled": true, "nextDueMs": 1722499200000 },
    "cron": { "enabled": true, "jobCount": 3 }
  }
}
```

---

## 3. Heartbeat 层技术方案 (关键决策)

### 3.1 选项对比

#### 选项 1: 提取 ConnectionManager wake → 独立 TriLCHeartbeatWake, 共用

```
                      ┌──────────────────────┐
                      │ TriLCHeartbeatWake    │
                      │  (独立模块)            │
                      │  - requestHeartbeatNow│
                      │  - setWakeHandler     │
                      │  - enable/disable     │
                      │  - coalescing/priority│
                      └──────┬───────────────┘
                             │ 共用
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ConnectionManager  HeartbeatRunner  CronService
     (健康检查触发)       (定时触发)       (cron job 触发)
```

**优点**:
- ConnectionManager 简化 (~100 行代码移出)
- 三个调用方共享 coalescing/priority/retry 逻辑
- 与 openclaw 的设计意图一致 (heartbeat-wake 就是独立模块)
- 后续添加新的 wake 触发源无需重复实现

**缺点**:
- 需要重构 ConnectionManager 中已稳定的 wake 代码
- 接口抽象多一层

#### 选项 2: ConnectionManager 保持独立, HeartbeatRunner 另起炉灶

**优点**:
- ConnectionManager 零改动, 风险最低
- 各自独立演进

**缺点**:
- 代码重复 (~100 行 coalescing/调度逻辑)
- 两个 wake 系统可能存在交互问题 (timer 竞争)
- HeartbeatRunner 需要重新实现 openclaw 已验证的 retry cooldown、timer 抢占模式

### 3.2 推荐: 选项 1

**明确推荐选项 1**。理由:

1. **ConnectionManager 的 wake 代码已经是"准独立"状态**: 它有一个完整的私有 wake 子系统 (`_scheduleWake`, `_executeWake`, `requestHeartbeatNow`, `hasPendingWake`, `setHeartbeatsEnabled`, `areHeartbeatsEnabled`)，提取为独立模块是自然的演进方向，不是凭空设计。

2. **HeartbeatRunner 必须依赖 wake 机制**: openclaw 的 HeartbeatRunner 设计就是通过 `setHeartbeatWakeHandler` 注册到 heartbeat-wake 的。如果没有共享的 wake 模块，HeartbeatRunner 需要重新发明 coalescing/retry cooldown/timer 抢占，而这些代码已经在 ConnectionManager 中经过验证。

3. **openclaw 架构验证**: openclaw 明确将 `heartbeat-wake.ts` 作为独立模块，`heartbeat-runner.ts` 和 cron service 都通过它来触发 heartbeat。这说明独立 wake 模块是成熟的设计模式。

4. **未来扩展性**: TriLC 后续可能有更多 wake 触发源 (如 CLI webhook, TUI 手动触发等)，独立模块避免了每个触发源都内联一份调度逻辑。

### 3.3 TriLCHeartbeatWake 接口

```typescript
// src/heartbeat/heartbeat-wake.ts

export type HeartbeatRunResult =
  | { status: "ran"; durationMs: number }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export type HeartbeatWakeHandler = (opts: {
  reason?: string;
  agentId?: string;       // 预留: 未来多 agent 支持
  sessionKey?: string;    // 预留: 未来 session 粒度触发
}) => Promise<HeartbeatRunResult>;

export interface TriLCHeartbeatWake {
  /** 注册 (或清除) wake handler。返回 disposer 函数。
   *  使用 generation guard 防止旧 handler 的 disposer 误清理新 handler。 */
  setWakeHandler(handler: HeartbeatWakeHandler | null): () => void;

  /** 请求立即执行 heartbeat。多次快速调用在 coalesceMs 内合并。
   *  高优先级 reason 抢占低优先级。 */
  requestHeartbeatNow(opts?: {
    reason?: string;        // "action" | "interval" | "default" | "retry"
    coalesceMs?: number;    // 默认 250ms
  }): void;

  /** 启用/禁用所有 heartbeat 触发 */
  setEnabled(enabled: boolean): void;

  /** 查询是否启用 */
  isEnabled(): boolean;

  /** 是否有待处理的 wake */
  hasPendingWake(): boolean;
}
```

**内部实现 (从 ConnectionManager 提取):**
- `WAKE_PRIORITY = { RETRY: 0, INTERVAL: 1, DEFAULT: 2, ACTION: 3 }` — 常量
- `PendingWake { reason, priority, requestedAt }` — 待处理唤醒
- `schedule(coalesceMs, kind)` — timer 调度 + 抢占
- `executeWake()` — 执行 handler + retry cooldown
- **去掉**: per-target key (`agentId::sessionKey`) — MVP 单 handler, 预留字段在接口中保留
- **去掉**: `queuePendingWakeReason` 的批量迭代 — MVP 单次执行

### 3.4 HeartbeatEventBus

TriLC 使用 `localbus` 作为事件总线。Heartbeat 层通过它发布生命周期事件:

```typescript
// 发布的事件类型 (扩展 localbus 已有的事件契约)
type HeartbeatEvent =
  | { type: "heartbeat:started"; reason: string }
  | { type: "heartbeat:completed"; result: HeartbeatRunResult; durationMs: number }
  | { type: "heartbeat:skipped"; reason: string }
  | { type: "heartbeat:failed"; error: string }
  | { type: "heartbeat:enabled"; enabled: boolean };
```

发布方式:
```typescript
import { publish } from "../localbus/bus.js";
publish({ type: "heartbeat:started", reason: "interval" });
```

### 3.5 TriLCHeartbeatRunner 接口

```typescript
// src/heartbeat/heartbeat-runner.ts

export interface HeartbeatAgentConfig {
  /** agent ID (从 contract-resolver 解析) */
  agentId: string;
  /** 心跳间隔 (ms) */
  intervalMs: number;
  /** 心跳提示词 (传给 agent-core agentLoop) */
  systemPrompt: string;
  /** 可选: 会话 key (用于 session-store 持久化) */
  sessionKey?: string;
}

export interface HeartbeatRunnerOptions {
  /** agent 列表 */
  agents: HeartbeatAgentConfig[];
  /** 自定义 runOnce 实现 (默认使用内置 agent-core 集成) */
  runOnce?: (agentId: string, systemPrompt: string, sessionKey?: string) => Promise<HeartbeatRunResult>;
}

export interface HeartbeatRunner {
  /** 启动调度循环 */
  start(): void;
  /** 停止调度循环, 清理 timer */
  stop(): void;
  /** 动态更新 agent 配置 (热重载) */
  updateAgents(agents: HeartbeatAgentConfig[]): void;
}

// 内部状态
interface HeartbeatAgentState {
  agentId: string;
  intervalMs: number;
  systemPrompt: string;
  sessionKey?: string;
  lastRunMs?: number;
  nextDueMs: number;
}
```

**核心调度逻辑** (简化自 openclaw):

```typescript
function startHeartbeatRunner(opts: HeartbeatRunnerOptions): HeartbeatRunner {
  const wake = createHeartbeatWake();  // 独立 wake 模块
  const state = {
    agents: new Map<string, HeartbeatAgentState>(),
    timer: null as NodeJS.Timeout | null,
    stopped: false,
  };

  // 计算下一个到期 agent 的时间并 arm timer
  const scheduleNext = () => {
    // ... 找到最小的 nextDueMs, arm setTimeout
    // 到期后调用 wake.requestHeartbeatNow({ reason: "interval" })
  };

  // 注册到 wake 模块
  const run: HeartbeatWakeHandler = async (params) => {
    for (const agent of state.agents.values()) {
      // 跳过未到期的 (interval 触发时)
      if (params.reason === "interval" && Date.now() < agent.nextDueMs) continue;

      const res = await opts.runOnce!(agent.agentId, agent.systemPrompt, agent.sessionKey);
      if (res.status === "skipped" && res.reason === "requests-in-flight") {
        // 不推进 schedule — wake 层会按 DEFAULT_RETRY_MS 重试
        return res;
      }
      agent.lastRunMs = Date.now();
      agent.nextDueMs = agent.lastRunMs + agent.intervalMs;
    }
    scheduleNext();
    return { status: "ran", durationMs: 0 };
  };

  const disposeWake = wake.setWakeHandler(run);

  return {
    start: () => { scheduleNext(); },
    stop: () => { disposeWake(); /* clear timer */ },
    updateAgents: (agents) => { /* 重建 state.agents, scheduleNext */ },
  };
}
```

### 3.6 与 agent-core 集成方式

```typescript
// src/heartbeat/agent-runner.ts
// HeartbeatRunner 的默认 runOnce 实现

import { agentLoop } from "@trimetaverse/agent-core";
import type { Message } from "trimodel";

export async function runHeartbeatAgentOnce(
  agentId: string,
  systemPrompt: string,
  sessionKey?: string,
): Promise<HeartbeatRunResult> {
  const startedAt = Date.now();
  const messages: Message[] = [{ role: "user", content: systemPrompt }];

  try {
    let hasOutput = false;
    for await (const event of agentLoop({
      model: "deepseek-v4-flash",  // heartbeat 使用 fast 模型, 降低成本
      systemPrompt: "You are a background task executor. Execute the given task concisely.",
      messages,
      maxTurns: 10,
      tier: "heartbeat",
      cwd: process.cwd(),
    })) {
      if (event.type === "content_delta" || event.type === "tool_call") {
        hasOutput = true;
      }
    }

    return {
      status: hasOutput ? "ran" : "skipped",
      reason: hasOutput ? undefined : "no-output",
      durationMs: Date.now() - startedAt,
    };
  } catch (err) {
    return {
      status: "failed",
      reason: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - startedAt,
    };
  }
}
```

**Session 持久化** (可选, Phase 2):
- 使用现有 `session-store` (SQLite) 保存 heartbeat agent 的执行记录
- 每次 heartbeat 创建新 session (类似 openclaw 的 `isolatedSession` 模式)
- 保留最近 N 条记录, 超出的由 `TriLCSessionReaper` 清理

---

## 4. Timer/Cron 层技术方案

### 4.1 TriLCCronService 接口

```typescript
// src/cron/service.ts

export type CronSchedule =
  | { kind: "every"; everyMs: number }
  | { kind: "cron"; expr: string; tz?: string }
  | { kind: "at"; at: string };  // ISO datetime 一次性

export interface CronJobCreate {
  id?: string;                    // 自动生成 UUID
  name: string;
  schedule: CronSchedule;
  systemPrompt: string;           // agent 执行时的 system prompt
  enabled?: boolean;              // 默认 true
  agentId?: string;               // 目标 agent, 默认 "claude"
  timeoutMs?: number;             // 默认 60_000
}

export interface CronJob extends CronJobCreate {
  id: string;
  enabled: boolean;
  state: "idle" | "running" | "failed";
  createdAt: string;              // ISO
  updatedAt: string;
  lastRunAt?: string;
  lastRunStatus?: "ok" | "error" | "skipped";
  nextRunAt?: string;
  runCount: number;
  errorCount: number;
}

export interface CronJobPatch {
  name?: string;
  schedule?: CronSchedule;
  systemPrompt?: string;
  enabled?: boolean;
  agentId?: string;
  timeoutMs?: number;
}

export interface CronServiceDeps {
  /** 当前时间 (可注入用于测试) */
  nowMs?: () => number;
  /** JSON 文件持久化路径 */
  storePath: string;
  /** cron 总开关 */
  cronEnabled: boolean;
  /** 触发 heartbeat */
  requestHeartbeatNow: (opts?: { reason?: string }) => void;
  /** session store 路径 (for reaper) */
  sessionStorePath?: string;
}

export interface CronService {
  start(): Promise<void>;
  stop(): void;
  status(): Promise<{ enabled: boolean; jobCount: number; nextRunAt?: string }>;
  list(opts?: { includeDisabled?: boolean }): Promise<CronJob[]>;
  add(input: CronJobCreate): Promise<CronJob>;
  update(id: string, patch: CronJobPatch): Promise<CronJob>;
  remove(id: string): Promise<void>;
  run(id: string, mode?: "due" | "force"): Promise<{ status: string; error?: string }>;
  getJob(id: string): CronJob | undefined;
  /** 唤醒 cron: now 立即执行到期 job; next-heartbeat 在下个 heartbeat 处理 */
  wake(opts: { mode: "now" | "next-heartbeat" }): void;
}
```

### 4.2 croner 集成方案

```typescript
// src/cron/scheduler.ts
import { Cron } from "croner";

export function parseCronSchedule(
  schedule: CronSchedule,
): { nextRunMs: () => number | null; pattern: string } {
  switch (schedule.kind) {
    case "every":
      return {
        nextRunMs: () => Date.now() + schedule.everyMs,
        pattern: `every ${schedule.everyMs}ms`,
      };
    case "at":
      return {
        nextRunMs: () => {
          const at = new Date(schedule.at).getTime();
          return at > Date.now() ? at : null;  // 过期的一次性任务不重复
        },
        pattern: `at ${schedule.at}`,
      };
    case "cron": {
      const cron = new Cron(schedule.expr, { timezone: schedule.tz });
      return {
        nextRunMs: () => {
          const next = cron.nextRun();
          return next ? next.getTime() : null;
        },
        pattern: `cron ${schedule.expr}`,
      };
    }
  }
}
```

### 4.3 JSON 文件持久化

```typescript
// src/cron/store.ts
// 复用 openclaw 的 JSON store 模式

import fs from "node:fs/promises";

export interface CronStoreFile {
  version: 1;
  jobs: CronJob[];
}

export async function loadCronStore(storePath: string): Promise<CronStoreFile> {
  try {
    const raw = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
    };
  } catch {
    return { version: 1, jobs: [] };
  }
}

export async function saveCronStore(storePath: string, store: CronStoreFile): Promise<void> {
  // 先写临时文件, 再 rename → 原子写入, 防止损坏
  const tmp = storePath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf-8");
  await fs.rename(tmp, storePath);
}
```

**文件位置**: `{dataDir}/cron-jobs.json`

### 4.4 内部调度循环

```typescript
// src/cron/timer.ts

const MAX_TIMER_DELAY_MS = 60_000;   // 最大 60s timer (复用 openclaw)
const MIN_REFIRE_GAP_MS = 2_000;     // 同 job 最小重发间隔 (复用 openclaw)

// armTimer: 找到所有 enabled job 中最近的 nextRunAt, arm setTimeout
// - 延迟 > MAX_TIMER_DELAY_MS 时截断为 MAX_TIMER_DELAY_MS (定期重算)
// - timer 到期后: 执行所有到期 job → 完成后重新 armTimer
// - 使用 locked (mutex) 防止并发执行

// runMissedJobs: 启动时执行所有错过的 job
// - 使用 stagger (DEFAULT_MISSED_JOB_STAGGER_MS = 5000) 分散执行
// - 最多 MAX_MISSED_JOBS_PER_RESTART = 5 个立即执行, 其余重新调度
```

### 4.5 TriLCSessionReaper

```typescript
// src/cron/session-reaper.ts

export interface SessionReaper {
  /** 清理过期的 cron run session */
  sweep(): Promise<number>;  // 返回清理数量
  /** 启动定时清理 (每 5 分钟) */
  start(intervalMs?: number): void;
  stop(): void;
}

// 实现:
// - 连接 session-store (SQLite)
// - 清理条件: sessionKey 以 "cron:" 开头, 且 createdAt 早于 retentionMs (默认 7 天)
// - 保留最近的 maxSessions (默认 100) 条记录
```

### 4.6 Agent 触发链路

```
Cron timer 到期
  → TriLCCronService._onTimer()
  → 对每个到期 job:
      1. 更新 job.state → "running"
      2. publish({ type: "cron:job-started", jobId })
      3. 调用 agentLoop({
           model: "deepseek-v4-flash",
           systemPrompt: job.systemPrompt,
           messages: [{ role: "user", content: `Execute scheduled task: ${job.name}` }],
           maxTurns: 15,
           tier: "cron",
           cwd: process.cwd(),
         })
      4. 等待结果
      5. 更新 job.state → "idle" / "failed"
      6. publish({ type: "cron:job-completed", jobId, status })
      7. 通过 session-store 持久化执行记录
```

---

## 5. 架构融入方案

### 5.1 目录结构

```
src/
├── daemon/
│   ├── service.ts            # TriLCDaemonService 接口 + resolveDaemonService()
│   ├── schtasks.ts           # Windows schtasks 实现
│   ├── launchd.ts            # macOS launchd 实现
│   ├── systemd.ts            # Linux systemd 实现
│   └── constants.ts          # 服务名/标签常量
├── heartbeat/
│   ├── heartbeat-wake.ts     # TriLCHeartbeatWake (从 ConnectionManager 提取)
│   ├── heartbeat-runner.ts   # TriLCHeartbeatRunner
│   └── agent-runner.ts       # 默认 runOnce — agent-core 集成
├── cron/
│   ├── service.ts            # TriLCCronService
│   ├── scheduler.ts          # croner 封装
│   ├── store.ts              # JSON 文件持久化
│   ├── timer.ts              # 调度循环 (armTimer/runMissedJobs)
│   ├── session-reaper.ts     # TriLCSessionReaper
│   └── types.ts              # CronJob, CronSchedule 等类型
├── server/
│   ├── app.ts                # 重构: ConnectionManager 使用 TriLCHeartbeatWake
│   └── ...
├── runtime/
│   └── daemon.ts             # LocalRuntimeDaemon (保留, 不修改)
└── cli.ts                    # 扩展: daemon 子命令
```

### 5.2 生命周期初始化顺序

```
1. 解析 CLI 参数 (cli.ts)
2. 确定运行模式 (交互 TUI / daemon 后台)
3. 如果 daemon 模式:
   a. 创建 TriLCDaemonService → status() 确认自身是 daemon
   b. 初始化 TriLCEnv (dataDir, port, trimc config...)
   c. 创建 TriLCHeartbeatWake (单例)
   d. 创建 ConnectionManager (注入 wake)
   e. 创建 TriLCHeartbeatRunner (注入 wake + agent-core)
   f. 创建 TriLCCronService (注入 wake + agent-core + session-store)
   g. 创建 SessionReaper (注入 session-store)
   h. 初始化 LocalRuntimeDaemon
   i. 启动 HTTP server (createTriLCApp)
   j. 启动 HeartbeatRunner.start()
   k. 启动 CronService.start()
   l. 启动 SessionReaper.start()
```

### 5.3 Graceful Shutdown 顺序

```
1. 收到 SIGTERM / SIGINT / POST /shutdown
2. 停止 SessionReaper
3. 停止 CronService (等待当前 job 完成, 最多 5s)
4. 停止 HeartbeatRunner
5. 禁用 HeartbeatWake (setEnabled(false))
6. 停止 ConnectionManager (stopHealthCheckLoop)
7. 停止 LocalRuntimeDaemon
8. 关闭 HTTP server (等待活跃连接 drain, 最多 10s)
9. 取消所有 shell 子进程 (cancelAllShellProcesses)
10. process.exit(0)
```

### 5.4 与现有模块的接口契约

| 模块 | 契约 | 备注 |
|------|------|------|
| `localbus` | `publish(event)` — heartbeat/cron 发布生命周期事件 | 已有 |
| `session-store` | `createSession()` / `saveMessages()` / `findInterruptedSessions()` | 已有, cron reaper 需要新增 `deleteOldSessions()` |
| `contract-resolver` | `listAgents()` — HeartbeatRunner 获取可用 agent 列表 | 已有 |
| `@trimetaverse/agent-core` | `agentLoop(opts)` — heartbeat/cron 触发 agent 执行 | 已有 |
| `ConnectionManager` | 重构为使用 `TriLCHeartbeatWake.setWakeHandler()` 替代内联 wake | 需修改 |
| `localbus` | `on("event")` — 监听 `heartbeat:*` / `cron:*` 事件 | 已有 |
| `event-queue` | `getQueueSize()` — HeartbeatRunner 检查是否有 inflight 请求 | 已有 |
| `mirror/pusher` | 接收 `heartbeat:*` / `cron:*` 事件用于任务镜像 | 不改 |

---

## 6. 实施路线图

### Phase 1: Heartbeat (W31-W32, 目标 2026-08-07)

**实现文件:**
- `src/heartbeat/heartbeat-wake.ts` — 从 ConnectionManager 提取独立模块
- `src/heartbeat/heartbeat-runner.ts` — 新建
- `src/heartbeat/agent-runner.ts` — 新建 (agent-core 集成)
- `src/server/app.ts` — 重构: ConnectionManager 改用 `TriLCHeartbeatWake`

**验收标准:**
1. `TriLCHeartbeatWake` 独立模块通过单元测试 (coalescing, priority, retry cooldown, timer 抢占, handler disposer generation guard)
2. `ConnectionManager` 重构后功能无回归 (健康检查、degredation 状态机、replay 逻辑正常工作)
3. `TriLCHeartbeatRunner` 可通过 `updateAgents()` 注入 agent 配置并按 interval 触发
4. Heartbeat 触发 `agentLoop` 并正确记录 session
5. `requests-in-flight` skip + wake 层 `DEFAULT_RETRY_MS` 重试协作正常

**风险:**
- ConnectionManager 重构可能引入回归 → 对策: 先写 `TriLCHeartbeatWake` 并全覆盖测试, 再重构 ConnectionManager
- agent-core agentLoop 在 heartbeat context 下的行为未知 → 对策: 先用简单 prompt 验证, 逐步增强

### Phase 2: Daemon (W32-W33, 目标 2026-08-14)

**实现文件:**
- `src/daemon/service.ts` — TriLCDaemonService 接口
- `src/daemon/schtasks.ts` — Windows 实现
- `src/daemon/launchd.ts` — macOS 实现
- `src/daemon/systemd.ts` — Linux 实现
- `src/daemon/constants.ts` — 标签常量
- `src/cli.ts` — 扩展 `daemon` 子命令
- `src/server/app.ts` — 扩展 `/healthz` 返回 daemon 状态

**验收标准:**
1. Windows: `trilc daemon install` → schtasks 注册成功, 重启后自动拉起
2. Windows: `trilc daemon uninstall` → schtasks 删除成功
3. Windows: `trilc daemon status` 返回正确 JSON 状态 (installed/loaded/running)
4. macOS/Linux: 对应 launchd/systemd 命令正常工作 (需对应环境)
5. `/healthz` 返回扩展字段

**风险:**
- Windows `schtasks /Create /XML` 在不同 Windows 版本的行为差异 → 对策: 不依赖 XML, 改用 `/SC ONLOGON /TN ... /TR ...` 命令行参数模式作为 fallback
- macOS `launchctl bootstrap` 需要用户登录 GUI session → 对策: 文档注明仅支持用户级 LaunchAgent

### Phase 3: Cron (W33-W34, 目标 2026-08-21)

**实现文件:**
- `src/cron/service.ts` — TriLCCronService
- `src/cron/scheduler.ts` — croner 封装
- `src/cron/store.ts` — JSON 持久化
- `src/cron/timer.ts` — 调度循环
- `src/cron/session-reaper.ts` — session 清理
- `src/cron/types.ts` — 类型定义

**验收标准:**
1. `cron add` 创建 job 后能按 cron 表达式准时触发
2. job 触发后执行 agentLoop 并持久化执行结果到 session-store
3. `cron list` 返回所有 job 及 lastRun/nextRun 信息
4. 启动时 `runMissedJobs` 不触发风暴 (stagger 5s + 最多 5 个)
5. JSON store 原子写入, 进程崩溃不损坏
6. SessionReaper 正确清理过期 session

**风险:**
- croner 与 Node.js timer 精度差异 → 对策: 接受秒级精度 (±1s), 不保证毫秒级
- agentLoop 超时处理 → 对策: Promise.race + AbortController, 超时后标记 job.failed
- JSON 文件并发写入 → 对策: locked (mutex) 确保单写, 写前先读确认 mtime 未变

---

## 7. 吸收注意事项

### 7.1 Vendor 快照不可修改

- `TriLC/vendor/openclaw/` 是只读参考源，**绝不写入或修改**
- 所有吸收产物放在 `TriLC/src/` 下的对应模块目录
- 引用 vendor 代码时用文件路径注释标注来源，不复制代码块到方案文档

### 7.2 ConnectionManager 兼容性

- **重构策略**: 先写新模块 → 测试通过 → 再改 ConnectionManager
- **不删除**: `recordSuccess()`, `recordFailure()`, `checkHealth()`, `startHealthCheckLoop()`, `stopHealthCheckLoop()` — 这些是 ConnectionManager 核心逻辑，不受 wake 提取影响
- **需修改**:
  - 删除内联的 `WAKE_PRIORITY`, `PendingWake`, `_scheduleWake`, `_executeWake` (约 100 行)
  - `requestHeartbeatNow()` 代理到 `TriLCHeartbeatWake.requestHeartbeatNow()`
  - `setHeartbeatsEnabled()` / `areHeartbeatsEnabled()` 代理到 wake 模块
  - `hasPendingWake()` 代理到 wake 模块
  - `stopHealthCheckLoop()` 中的 wake 清理代码改为 `wake.setWakeHandler(null)`
- **保持兼容**: ConnectionManager 的公开接口签名不变
- **测试覆盖**: 现有的 `createTriLCApp` 集成行为不应退化

### 7.3 代码风格一致性

- TypeScript strict mode, 无 `any` (除非 vendor 协议适配层)
- 文件命名: kebab-case (`heartbeat-wake.ts`), 类/接口: PascalCase (`TriLCHeartbeatWake`)
- 导入路径: 使用 `.js` 扩展名 (ESM 规范)
- 模块注释: `// ── Section Title ──` 风格 (与现有 TriLC 代码一致)
- 日志前缀: `[trilc:heartbeat]`, `[trilc:cron]`, `[trilc:daemon]` 格式
- 无 class 装饰器, 无依赖注入框架 — 使用简单的工厂函数 + 选项对象模式

### 7.4 测试策略

| 层 | 测试类型 | 覆盖目标 |
|-----|---------|---------|
| `heartbeat-wake.ts` | 纯单元测试 (vitest) | coalescing, priority 抢占, retry cooldown, timer 抢占, handler disposer generation guard, enable/disable toggle |
| `heartbeat-runner.ts` | 单元测试 + mock agentLoop | 调度循环, updateAgents 热重载, requests-in-flight 处理 |
| `cron/store.ts` | 单元测试 | JSON 读写, 原子写入, 损坏恢复 |
| `cron/timer.ts` | 单元测试 + mock time | armTimer/stopTimer, runMissedJobs stagger, MAX_TIMER_DELAY_MS 截断 |
| `cron/service.ts` | 集成测试 | add/list/update/remove/run CRUD 完整链路 |
| `daemon/service.ts` | 集成测试 (平台特定) | install/status/uninstall 在对应平台上验证 |
| `ConnectionManager` | 回归测试 | 重构后功能无退化 |

**测试文件位置**: 与源文件同目录 `*.test.ts` (如 `src/heartbeat/heartbeat-wake.test.ts`)

---

## 附录 A: 文件清单汇总

### 新建文件 (Phase 1-3)

```
TriLC/src/heartbeat/heartbeat-wake.ts
TriLC/src/heartbeat/heartbeat-wake.test.ts
TriLC/src/heartbeat/heartbeat-runner.ts
TriLC/src/heartbeat/heartbeat-runner.test.ts
TriLC/src/heartbeat/agent-runner.ts
TriLC/src/daemon/service.ts
TriLC/src/daemon/schtasks.ts
TriLC/src/daemon/launchd.ts
TriLC/src/daemon/systemd.ts
TriLC/src/daemon/constants.ts
TriLC/src/cron/service.ts
TriLC/src/cron/scheduler.ts
TriLC/src/cron/store.ts
TriLC/src/cron/store.test.ts
TriLC/src/cron/timer.ts
TriLC/src/cron/timer.test.ts
TriLC/src/cron/session-reaper.ts
TriLC/src/cron/types.ts
```

### 修改文件

```
TriLC/src/server/app.ts           # ConnectionManager 重构使用独立 wake
TriLC/src/cli.ts                   # 扩展 daemon 子命令
TriLC/src/server/app.ts           # /healthz 扩展
TriLC/package.json                 # 添加 croner 依赖
```

### 不改文件

```
TriLC/src/runtime/daemon.ts       # LocalRuntimeDaemon 保留
TriLC/src/local-node/node.ts      # LocalNode.heartbeat 保留 (仍被 LocalRuntimeDaemon 使用)
TriLC/vendor/openclaw/**/*        # 只读参考源
```

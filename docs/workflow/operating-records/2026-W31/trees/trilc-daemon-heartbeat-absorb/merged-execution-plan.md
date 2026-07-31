# TriLC Daemon / Heartbeat / Timer 吸收方案 — 合并执行计划

版本：V1.0-MERGED
日期：2026-07-31
作者：CEO Chief of Staff 小贾（daemon-hb-3 合流收口）
上游输入：
- CPO 小乔 `docs/product/todo/triLC-daemon-heartbeat-timer-mvp.md` (daemon-hb-1)
- CTO 小狄 `docs/engineering/todo/triLC-daemon-heartbeat-timer-absorb-design.md` (daemon-hb-2)

---

## 1. 裁决汇总表

CEO 视角对 CPO/CTO 五个分歧点的明确裁决。

| 编号 | 议题 | CPO 立场 | CTO 立场 | 裁决 | 理由 |
|------|------|---------|---------|------|------|
| **R1** | 心跳粒度 | 单节点统一心跳 | HeartbeatRunner 支持 per-agent 配置 | **APPROVE CPO 范围 + CTO 架构** | CTO 的 `HeartbeatAgentConfig[]` 架构可优雅降级为单 agent 模式（MVP 注入 1 个 config）。MVP 交付单节点心跳；但接口设计保留多 agent 扩展能力。不是真正冲突——CTO 的架构允许 CPO 的 MVP 范围。 |
| **R2** | 系统托盘归属 | TriPilot 侧实现 UI，TriLC 提供 `/healthz` API | 未涉及 | **APPROVE CPO** | 系统托盘已有独立树 `arch-trilc-tray`（CTO 在设计细化中）。本树定义 TriLC 侧 API 契约：`/healthz` 扩展字段为托盘轮询提供数据源。CTO 的缺位是合理分工，不构成分歧。 |
| **R3** | Session Reaper 优先级 | **P0**（基础设施底线，MVP 必须做） | Phase 3（Cron，W33-W34） | **APPROVE CPO** | Session Reaper 是运维底线，不是可选功能。TriLC session-store 已有 `expireOldSessions()` 基础；Reaper 只需一个 `setInterval` 定时器直接调用 store API，**不依赖 CronService**。放在 Phase 3 是将"会话清理"与"cron 调度引擎"错误耦合。Phase 1 独立实现，零额外依赖。 |
| **R4** | CLI 命令格式 | 保持现有 `trilc start/stop/status` + 新增 `restart` | 新增 `trilc daemon` 子命令组 | **APPROVE 双轨** | `trilc daemon install/uninstall/stage` 是 OS 级服务管理操作，语义上与前台 `start/stop/status` 不同层，独立子命令组合理。保留 `trilc start/stop/status/restart` 作为用户前台操作的简洁入口（alias 到 daemon 子命令或直接实现）。两者共存，不互斥。 |
| **R5** | Cron 优先级 | P0 cron engine（cron 表达式 + interval） | Cron 全部在 Phase 3 | **SPLIT：P0 重要性确认，Phase 2 交付** | CPO 对 cron 作为差异化能力的判断正确。但 cron engine 的 schedule → wake → agentLoop 链路依赖 Phase 1 的 HeartbeatWake 稳定。工程依赖决定它不能在 Phase 1 完成。Phase 2 交付 minimal cron engine（croner + SQLite 持久化 + 基本 agent 触发），Phase 3 交付完整 CronService（CRUD + CLI + 运行日志 + 失败告警）。 |

### 裁决之外的补充收敛

CPO 和 CTO 在以下点**事实一致**（无分歧，确认即可）：

| 编号 | 一致点 | 确认 |
|------|--------|------|
| C1 | HeartbeatWake 提升为独立模块，ConnectionManager 降级为 consumer | 双方 APPROVE，直接执行 |
| C2 | LocalRuntimeDaemon 保留，不替换 | 双方 APPROVE，直接执行 |
| C3 | croner npm 包做 cron 表达式解析 | 双方 APPROVE，直接执行 |
| C4 | localbus 作为 heartbeat/cron 事件发布通道 | 双方 APPROVE，直接执行 |
| C5 | vendor/openclaw 只读参考源，不修改 | 双方 APPROVE，直接执行 |
| C6 | Windows 平台 MVP 优先 | 双方 APPROVE，直接执行 |

### 需要微调的对齐点（非裁决，仅校准）

| 编号 | 事项 | CPO | CTO | 合并结论 |
|------|------|-----|-----|---------|
| A1 | Session Reaper 清理范围 | 全 session 类型（completed 30d / interrupted 7d / expired 立即） | cron: 前缀 session（7d，max 100） | 两者互补。Phase 1 实现 CPO 的通用 Session Reaper（全 session 类型）。Phase 3 在 CronService 中追加 CTO 的 cron-execution-session Reaper。 |
| A2 | Cron 持久化格式 | SQLite | JSON file | **APPROVE CPO** — SQLite。session-store 已验证 SQLite 模式，cron 复用同路径。JSON file 的原子写入和并发控制成本不低于 SQLite，且 TriLC 已有 SQLite 运行时依赖。 |
| A3 | 平台范围 | Windows-only MVP | 三平台设计均纳入 | 设计文档保留三平台接口（CTO 的 TriLCDaemonService 接口设计正确），Phase 2 仅实现 Windows schtasks。macOS/Linux 代码框架写入但标记 `@platform-deferred`，不阻塞 MVP。 |

---

## 2. 最终实施路线图

### Phase 1: Heartbeat 基础设施 + Session Reaper + 健康扩展（W31-W32，目标 2026-08-07）

**范围**：CPO P0-1, P0-2, P0-3, P0-4, P0-6, P0-7；CTO 的 heartbeat-wake 独立化 + heartbeat-runner。

#### 2.1.1 文件清单

**新建文件（TriLC/src/ 下）：**

```
src/heartbeat/heartbeat-wake.ts          # TriLCHeartbeatWake 独立模块（从 ConnectionManager 提取）
src/heartbeat/heartbeat-wake.test.ts     # 单元测试：coalescing / priority 抢占 / retry cooldown / timer 抢占 / handler disposer generation guard / enable-disable toggle
src/heartbeat/heartbeat-runner.ts        # TriLCHeartbeatRunner（per-agent config 架构，MVP 单 agent）
src/heartbeat/heartbeat-runner.test.ts   # 单元测试：调度循环 / updateAgents 热重载 / requests-in-flight 处理
src/heartbeat/agent-runner.ts            # 默认 runOnce 实现 — agent-core agentLoop 集成
src/cron/session-reaper.ts              # TriLCSessionReaper（setInterval 定时器，直接调用 session-store API）
src/cron/session-reaper.test.ts         # 单元测试：各状态清理策略 / 边界条件
```

**修改文件：**

```
src/server/app.ts                        # ConnectionManager 重构使用 TriLCHeartbeatWake；/healthz 扩展字段
src/localbus/bus.ts                      # 扩展 LocalBusEvent union：heartbeat:* / cron:* 事件类型
src/cli.ts                               # 新增 trilc restart 命令；新增 trilc daemon status（扩展 /healthz 展示）
src/session-store/store.ts               # 新增 deleteSession(id) 函数（Session Reaper 依赖）
```

**Phase 1 不涉及的文件（明确排除）：**

```
src/runtime/daemon.ts                    # LocalRuntimeDaemon 保留不修改
src/local-node/node.ts                   # LocalNode.heartbeat 保留不修改
src/daemon/                              # Phase 2
src/cron/service.ts, scheduler.ts, store.ts, timer.ts  # Phase 2/3
```

#### 2.1.2 关键接口签名

```typescript
// src/heartbeat/heartbeat-wake.ts
export type HeartbeatRunResult =
  | { status: "ran"; durationMs: number }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export type HeartbeatWakeHandler = (opts: {
  reason?: string;
  agentId?: string;       // 预留未来多 agent
  sessionKey?: string;    // 预留未来 session 粒度
}) => Promise<HeartbeatRunResult>;

export interface TriLCHeartbeatWake {
  setWakeHandler(handler: HeartbeatWakeHandler | null): () => void;  // 返回 disposer
  requestHeartbeatNow(opts?: { reason?: string; coalesceMs?: number }): void;
  setEnabled(enabled: boolean): void;
  isEnabled(): boolean;
  hasPendingWake(): boolean;
}

// src/heartbeat/heartbeat-runner.ts
export interface HeartbeatAgentConfig {
  agentId: string;
  intervalMs: number;
  systemPrompt: string;
  sessionKey?: string;
}

export interface HeartbeatRunner {
  start(): void;
  stop(): void;
  updateAgents(agents: HeartbeatAgentConfig[]): void;
}

// src/cron/session-reaper.ts
export interface SessionReaperConfig {
  completedRetentionDays: number;    // 默认 30
  interruptedRetentionDays: number;  // 默认 7
  sweepIntervalMs: number;           // 默认 3600000（1 小时）
}

export interface TriLCSessionReaper {
  sweep(): Promise<{ completed: number; interrupted: number; expired: number }>;
  start(): void;
  stop(): void;
}
```

#### 2.1.3 验收标准

| 门禁 | 标准 | 对应 CPO AC |
|------|------|------------|
| G1.1 | `TriLCHeartbeatWake` 独立模块全部单测通过（coalescing, priority 抢占, retry cooldown, timer 抢占, handler disposer generation guard, enable/disable toggle） | — |
| G1.2 | ConnectionManager 重构后功能无回归：健康检查、degradation 状态机、replay 逻辑正常 | — |
| G1.3 | `HeartbeatRunner.start()` → 按 interval 触发 agentLoop → 执行结果通过 localbus 发布 `heartbeat:exec_completion` | G3 |
| G1.4 | `trilc restart` 完成 stop+start 原子操作，daemon 状态恢复 healthy | G2 |
| G1.5 | `/healthz` 返回扩展字段：`uptime`, `activeTasks`, `queueSize`, `heartbeat.enabled`, `heartbeat.nextDueMs` | G1 |
| G1.6 | Session Reaper 清理 1 条 `expired` 会话 → 数据库中该会话记录消失 | G4 |
| G1.7 | 异常 kill daemon → session 自动标记 `interrupted` → 重启 TUI → `findInterruptedSessions()` 返回该会话 | G5 |
| G1.8 | `requests-in-flight` skip + wake 层 `DEFAULT_RETRY_MS` 重试协作正常 | — |

#### 2.1.4 时间线

- W31 周五 7/31: 合流评审完成（本节点 daemon-hb-3）
- W32 周一 8/3: Phase 1 开工，CTO 小狄主责 HeartbeatWake + HeartbeatRunner；FullStackDeveloper 小全负责 Session Reaper + /healthz + CLI
- W32 周四 8/6: Phase 1 代码冻结，TestEngineer 小柯执行验收
- W32 周五 8/7: Phase 1 验收通过 / 问题回归修复

---

### Phase 2: Minimal Cron Engine + Daemon OS 集成（W32-W33，目标 2026-08-14）

**范围**：CPO P0-5（cron 基础引擎），P0-8（系统托盘 API 契约）；CTO 的 daemon OS service（Windows schtasks 优先）+ cron scheduler。

#### 2.2.1 文件清单

**新建文件：**

```
src/daemon/service.ts                   # TriLCDaemonService 接口
src/daemon/schtasks.ts                  # Windows schtasks 实现（XML 模板 + schtasks.exe 命令封装）
src/daemon/launchd.ts                   # macOS 实现（代码框架，标记 @platform-deferred）
src/daemon/systemd.ts                   # Linux 实现（代码框架，标记 @platform-deferred）
src/daemon/constants.ts                 # 服务名 / 标签常量
src/cron/scheduler.ts                   # croner 封装（cron 表达式 + interval 解析）
src/cron/store.ts                       # SQLite 持久化（cron jobs CRUD）
src/cron/store.test.ts                  # 单元测试：CRUD / 启动加载 / schema migration
src/cron/types.ts                       # CronJob, CronSchedule, CronJobStatus 类型
```

**修改文件：**

```
src/cli.ts                              # 扩展 trilc daemon 子命令组：install / uninstall / stage / start / stop / status / restart
src/server/app.ts                       # /healthz 追加 daemon mode + cron 状态字段
package.json                            # 添加 croner 依赖
```

#### 2.2.2 关键接口签名

```typescript
// src/daemon/service.ts
export interface TriLCDaemonServiceConfig {
  label?: string;
  nodeBin: string;
  entryScript: string;
  programArgs: string[];
  cwd: string;
  env?: Record<string, string>;
  dataDir: string;
  port: number;
}

export interface DaemonServiceState {
  installed: boolean;
  loaded: boolean;
  running: boolean;
  label: string;
  command: { programArguments: string[]; workingDirectory?: string; environment?: Record<string, string> } | null;
  runtime: { status: "running" | "stopped" | "unknown"; pid?: number; uptimeMs?: number } | null;
}

export interface TriLCDaemonService {
  stage(config: TriLCDaemonServiceConfig): Promise<string>;
  install(config: TriLCDaemonServiceConfig): Promise<void>;
  uninstall(config: TriLCDaemonServiceConfig): Promise<void>;
  stop(config: TriLCDaemonServiceConfig): Promise<void>;
  restart(config: TriLCDaemonServiceConfig): Promise<DaemonServiceStartResult>;
  status(config: TriLCDaemonServiceConfig): Promise<DaemonServiceState>;
  isLoaded(config: TriLCDaemonServiceConfig): Promise<boolean>;
}

// src/cron/types.ts
export type CronSchedule =
  | { kind: "every"; everyMs: number }
  | { kind: "cron"; expr: string; tz?: string };

export interface CronJob {
  id: string;
  name: string;
  schedule: CronSchedule;
  systemPrompt: string;
  enabled: boolean;
  state: "idle" | "running" | "failed";
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  lastRunStatus?: "ok" | "error" | "skipped";
  nextRunAt?: string;
  runCount: number;
  errorCount: number;
}

export interface MinimalCronEngine {
  start(): Promise<void>;
  stop(): void;
  addJob(job: Omit<CronJob, "id" | "state" | "createdAt" | "updatedAt" | "runCount" | "errorCount">): Promise<CronJob>;
  removeJob(id: string): Promise<void>;
  listJobs(): Promise<CronJob[]>;
  getJob(id: string): CronJob | undefined;
}
```

#### 2.2.3 验收标准

| 门禁 | 标准 | 对应 CPO AC |
|------|------|------------|
| G2.1 | Windows: `trilc daemon install` → schtasks 注册成功；重启/登出登入后 TriLC 自动启动 | G7 |
| G2.2 | `trilc daemon status` 返回正确 JSON 状态（installed/loaded/running） | — |
| G2.3 | `trilc daemon uninstall` → schtasks 删除成功 | — |
| G2.4 | 定义一个 `interval=1m` 的 cron job → 1 分钟后 agent 执行 → job 的 `lastRunAt` 更新 | G6 |
| G2.5 | 定义一个 `0 9 * * 1-5` cron job → 工作日 9 点准时触发 | — |
| G2.6 | Cron jobs 存储在 SQLite `{dataDir}/cron.db` → daemon 重启后 jobs 不丢失 | — |
| G2.7 | `/healthz` 返回 `daemon.mode` + `cron.enabled` + `cron.jobCount` | — |

#### 2.2.4 时间线

- W32 周一 8/3: Phase 2 设计与 Phase 1 并行开工（cron engine + daemon service 与 heartbeat 独立，无冲突）
- W33 周三 8/12: Phase 2 代码冻结
- W33 周五 8/14: Phase 2 验收通过

---

### Phase 3: Full CronService + 剩余平台 + P1 项（W33-W34，目标 2026-08-21）

**范围**：CTO 的完整 CronService（CRUD + CLI + 运行日志 + 失败告警 + missed job staggering）+ macOS/Linux daemon 验收 + CPO P1 项。

#### 2.3.1 文件清单

**新建文件：**

```
src/cron/service.ts                     # TriLCCronService（完整 CRUD 门面）
src/cron/timer.ts                       # armTimer / stopTimer / runMissedJobs（复用 openclaw 常量）
src/cron/timer.test.ts                  # 单元测试：MAX_TIMER_DELAY_MS / MIN_REFIRE_GAP_MS / stagger
```

**修改文件：**

```
src/cron/store.ts                       # 扩展：job update/remove + atomic write + mtime 检测
src/cli.ts                              # 扩展 trilc cron 子命令组：add / list / update / remove / run / log
src/localbus/bus.ts                     # 扩展 cron:degraded 事件（连续 3 次失败告警）
```

#### 2.3.2 验收标准

| 门禁 | 标准 |
|------|------|
| G3.1 | `trilc cron add` 创建 job → `trilc cron list` 可见 → `trilc cron update` 修改 → `trilc cron remove` 删除 |
| G3.2 | `trilc cron run <id> --force` 立即强制执行 |
| G3.3 | `trilc cron log` 查看最近执行记录（success/failed/timeout + 耗时） |
| G3.4 | 启动时 `runMissedJobs` stagger 5s + 最多 5 个，不触发风暴 |
| G3.5 | 连续 3 次失败 → localbus 发布 `cron:degraded` → TUI 状态栏可见 |
| G3.6 | JSON store 原子写入（先写 tmp 再 rename），进程崩溃不损坏 |
| G3.7 | macOS `launchctl bootstrap` / Linux `systemctl --user enable` 验收（需对应环境） |

#### 2.3.3 时间线

- W33 周一 8/10: Phase 3 开工（与 Phase 2 收尾部分重叠）
- W34 周三 8/19: Phase 3 代码冻结
- W34 周五 8/21: Phase 3 验收通过，三层吸收方案全量交付

---

## 3. 跨模块依赖清单

### 3.1 TriLC 内部依赖

| 依赖方 | 被依赖方 | 接口 | Phase |
|--------|---------|------|-------|
| `src/heartbeat/heartbeat-wake.ts` | `src/server/app.ts` (ConnectionManager) | 从 CM 提取约 100 行 wake 代码；CM 改为 `wake.setWakeHandler()` | 1 |
| `src/heartbeat/heartbeat-runner.ts` | `src/heartbeat/heartbeat-wake.ts` | `wake.requestHeartbeatNow()` + `wake.setWakeHandler()` | 1 |
| `src/heartbeat/agent-runner.ts` | `@trimetaverse/agent-core` | `agentLoop(opts)` — heartbeat 触发 agent 执行 | 1 |
| `src/heartbeat/agent-runner.ts` | `src/session-store/` | `createSession()` + `saveMessages()` — 持久化 heartbeat 执行记录 | 1 |
| `src/cron/session-reaper.ts` | `src/session-store/` | `listSessions({status})` + `deleteSession(id)` — 按状态筛选并清理 | 1 |
| `src/cron/scheduler.ts` | `croner` (npm) | `new Cron(expr)` 解析 cron 表达式 | 2 |
| `src/cron/store.ts` | `better-sqlite3` (已有依赖) | SQLite 持久化 cron jobs | 2 |
| `src/cron/scheduler.ts` | `src/heartbeat/heartbeat-wake.ts` | `wake.requestHeartbeatNow({reason:"cron"})` — cron 触发 agent 执行 | 2 |
| `src/daemon/schtasks.ts` | `child_process` (Node.js) | `spawn("schtasks.exe", [...])` — Windows Task Scheduler 管理 | 2 |
| `src/cli.ts` | `src/daemon/service.ts` | `TriLCDaemonService.status/install/uninstall` | 2 |
| `src/cli.ts` | `src/cron/service.ts` | `CronService.add/list/update/remove/run` | 3 |

### 3.2 跨模块依赖（TriLC 对外的 API 契约）

| 依赖方（消费者） | TriLC 提供方 | 接口 | Phase | 备注 |
|-----------------|-------------|------|-------|------|
| TriPilot（系统托盘） | TriLC `/healthz` | `GET /healthz` → `{ ok, service, trimc, daemon: { mode, uptimeSeconds, heartbeat, cron } }` | 2 | 托盘通过 HTTP 轮询获取 daemon 状态；三色图标依据 `ok` + `trimc` 字段 |
| TriPilot（系统托盘） | TriLC `/v1/agent/status` | 预留：agent 运行时状态查询 | P2 | 非 MVP，接口设计阶段预留 |
| TriMC（云端运维） | TriLC heartbeat 上报 | `POST /internal/v1/heartbeat`（已有端点）扩展字段 | P1（Phase 3+） | CPO 的 TriMC Dashboard 集成列 P1；heartbeat 数据结构预留 `nodeId` + `metrics` 字段 |
| TriCade MSI 打包 | TriLC daemon 注册 | `trilc daemon install` CLI + schtasks XML | 2 | MSI 安装脚本调用 CLI 注册 daemon |

### 3.3 已有资产复用清单

| 已有资产 | 复用方式 | Phase |
|---------|---------|-------|
| `src/server/app.ts` ConnectionManager 内联 wake 代码 (~100 行) | 提取为 `src/heartbeat/heartbeat-wake.ts`，CM 改为 consumer | 1 |
| `src/session-store/store.ts` `expireOldSessions()` | Session Reaper 扩展：新增 `deleteSession()` + 按状态差异化保留策略 | 1 |
| `src/session-store/store.ts` `findInterruptedSessions()` | TUI 启动时调用，提示恢复 | 1（已有） |
| `src/localbus/bus.ts` EventEmitter | 扩展事件类型 union（`heartbeat:*` / `cron:*`） | 1 |
| `src/cli.ts` `start/stop/status` 命令 | 保留；新增 `restart` + `daemon` 子命令组 | 1/2 |
| `src/server/app.ts` `/healthz` 端点 | 扩展返回字段 | 1 |
| `vendor/openclaw/src/infra/heartbeat-wake.ts` (273 行) | Port：完整结构参考，去掉 multi-target key | 1 |
| `vendor/openclaw/src/infra/heartbeat-runner.ts` (1200 行) | Adapt：保留调度循环模式，大幅简化 | 1 |
| `vendor/openclaw/src/daemon/service.ts` (225 行) | Adapt：保留 GatewayService 接口形状 | 2 |
| `vendor/openclaw/src/daemon/schtasks.ts` | Adapt：保留 schtasks.exe CLI 调用 + XML 模板模式 | 2 |
| `vendor/openclaw/src/cron/service/ops.ts, state.ts, store.ts, timer.ts` | Rewrite：保留门面模式 + locked 互斥 + MAX_TIMER_DELAY_MS 常量 | 3 |

---

## 4. 风险登记表

| 编号 | 风险 | 概率 | 影响 | 缓解措施 | 负责人 | 触发条件 |
|------|------|------|------|---------|--------|---------|
| RK1 | ConnectionManager 重构引入回归：TriMC 连接检查失效 | 中 | 高 — 离线 fallback 不触发 | 先写 `TriLCHeartbeatWake` 并全覆盖测试；CM 重构仅限于代理调用，不修改 `recordSuccess/recordFailure/checkHealth` 核心逻辑 | CTO 小狄 | CM 重构后 health check loop 连续 3 次失败 |
| RK2 | Cron 引擎复杂度被低估：时区/夏令时/corner case | 中 | 中 — cron 表达式触发时间不准 | P0 不做时区感知；croner npm 包已在 openclaw 验证；接受秒级精度 | CTO 小狄 | cron job 触发偏差 > 5s |
| RK3 | Session Reaper 误删活跃会话 | 低 | 高 — 用户数据丢失 | Reaper 只清理 `completed`/`interrupted`/`expired` 状态；`active` 永不过期；先 mark expired 再 hard delete，保留 24h 软删除窗口 | FullStack 小全 | 用户报告会话消失 |
| RK4 | Windows schtasks XML 在不同版本行为差异 | 中 | 中 — 安装失败或 daemon 不启动 | Fallback: `/SC ONLOGON /TN ... /TR ...` 命令行参数模式（不用 XML）；Win10/Win11 双版本测试 | CTO 小狄 | `trilc daemon install` 返回非 0 |
| RK5 | agentLoop 在 heartbeat context 下行为未知（缺少用户交互） | 中 | 中 — heartbeat agent 无输出或超时 | 先用简单 prompt 验证（"输出当前时间"）；maxTurns 限制 10；fast model（deepseek-v4-flash）；Promise.race + AbortController 超时 | CTO 小狄 | heartbeat agent 连续 3 次无输出 |
| RK6 | `trilc restart` 原子性：stop 成功但 start 失败 → daemon 消失 | 低 | 中 — 需手动恢复 | restart 实现：先 start（port-in-use guard 自动处理旧进程），再 gentle stop 旧进程；若 start 失败则不 kill 旧进程 | CTO 小狄 | restart 后 /healthz 不可达 |
| RK7 | SQLite 并发写入：Session Reaper 与 cron store 同时写 | 低 | 低 — SQLite WAL 模式已启用 | Session Reaper 和 cron store 使用不同 db 文件（`sessions.db` vs `cron.db`）；同一 db 内依赖 SQLite 事务 | FullStack 小全 | SQLITE_BUSY 错误 |

---

## 5. 下一步 Action Items

| 编号 | 负责人 | 动作 | 交付物 | 截止 |
|------|--------|------|--------|------|
| ACT1 | CTO 小狄 | Phase 1 开工：`src/heartbeat/heartbeat-wake.ts` 独立模块 + 单测 | heartbeat-wake.ts + heartbeat-wake.test.ts | 2026-08-04 |
| ACT2 | CTO 小狄 | Phase 1 开工：`src/heartbeat/heartbeat-runner.ts` + `agent-runner.ts` | heartbeat-runner.ts + agent-runner.ts | 2026-08-05 |
| ACT3 | CTO 小狄 | Phase 1 重构：ConnectionManager 改用 TriLCHeartbeatWake | src/server/app.ts diff | 2026-08-05 |
| ACT4 | FullStack 小全 | Phase 1 开工：`src/cron/session-reaper.ts` + 单测 | session-reaper.ts + session-reaper.test.ts | 2026-08-04 |
| ACT5 | FullStack 小全 | Phase 1 开工：`/healthz` 扩展 + `trilc restart` CLI + localbus 事件类型扩展 | src/server/app.ts diff + src/cli.ts diff + src/localbus/bus.ts diff | 2026-08-05 |
| ACT6 | FullStack 小全 | Phase 1 开工：`src/session-store/store.ts` 新增 `deleteSession()` | store.ts diff | 2026-08-04 |
| ACT7 | TestEngineer 小柯 | Phase 1 验收：G1.1-G1.8 逐项验证 | 验收报告 | 2026-08-07 |
| ACT8 | CTO 小狄 | Phase 2 设计确认：`src/daemon/service.ts` 接口 + schtasks XML 模板 | daemon/service.ts + schtasks.ts 草案 | 2026-08-04 |
| ACT9 | CTO 小狄 | Phase 2 设计确认：`src/cron/scheduler.ts` + `store.ts` SQLite schema | cron/scheduler.ts + store.ts 草案 | 2026-08-05 |
| ACT10 | CEO Chief of Staff | 合流后更新：tree-op.json + W31 OP index 同步 | tree-op.json v1.1.0 + OP-202607-W31-001.json | 2026-07-31 |

---

## 附录 A：CPO/CTO 交付物评估

### CPO 产出质量评估

`docs/product/todo/triLC-daemon-heartbeat-timer-mvp.md`

- **完整性**：六个必答模块全覆盖；Persona 定义明确（A/B/C/D）；P0/P1/P2 分层清晰；7 个验收标准具体可测
- **决策清晰度**：每个判断给出明确结论（如"单节点统一心跳"、"Windows-only MVP"、"Session Reaper P0"），不留在提问层面
- **技术边界尊重**：多次标注"具体方式由 CTO 决定"，不越界做技术约束
- **风险意识**：4 个风险 + 缓解措施 + 跨模块依赖表
- **源文件依据**：附录 C 列出 15 个源文件，判断有据可查

**评级**：APPROVE，无需返修。

### CTO 产出质量评估

`docs/engineering/todo/triLC-daemon-heartbeat-timer-absorb-design.md`

- **技术深度**：吸收策略分类表（Port/Adapt/Rewrite/Skip）精确；8 个关键 openclaw 源文件逐一评估；依赖链分析完整
- **接口定义**：所有核心模块有 TypeScript 接口签名（TriLCDaemonService、TriLCHeartbeatWake、TriLCCronService）；生命周期初始化顺序明确
- **实施可行性**：目录结构具体到文件级；测试策略覆盖每层；吸收注意事项（vendor 不可修改、CM 兼容性、代码风格一致性）完整
- **跨平台设计**：三平台 XML/plist/unit 模板完整，包含管理命令
- **两个关键遗漏**：
  1. Session Reaper 放在 Phase 3 而非 P0（经裁决修正至 Phase 1）
  2. 未涉及与 TriPilot 系统托盘的 API 契约（经裁决补充 /healthz 扩展字段）

**评级**：APPROVE，需在 Phase 1 执行时吸纳本计划的 R3/R4/R5 裁决。Session Reaper 优先级和 Cron 持久化格式按本计划调整。

---

## 附录 B：裁决依据参考

- CPO PRD 附录 C 列出的 15 个源文件（已在本计划前置核查中复验）
- CTO 方案第 1.1 节吸收策略分类表
- TriLC `src/session-store/store.ts`: `expireOldSessions()` 已有基础（行 279-288）
- TriLC `src/session-store/types.ts`: `SessionStatus = 'active' | 'completed' | 'interrupted' | 'expired'`
- TriLC `src/server/app.ts`: ConnectionManager 内联 wake 代码约 100 行
- `vendor/openclaw/src/infra/heartbeat-wake.ts`: 273 行核心参考
- `vendor/openclaw/src/daemon/service.ts`: 225 行 GatewayService 接口参考

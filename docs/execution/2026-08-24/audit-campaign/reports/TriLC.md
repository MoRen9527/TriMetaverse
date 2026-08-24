# AC-LC 审计报告 — TriLC（TestEngineer 视角）

- 审计节点：AC-LC（audit-campaign-001）
- 角色：测试工程（TestEngineer）
- 目标仓：`/srv/fleet/TriLC`（只读审计）
- 日期：2026-08-25
- 计数：**P0=0，P1=4，P2=8**

## 概述

TriLC 四个焦点面（daemon 生命周期、HTTP+SSE agent loop、cron、session reaper）整体架构清晰：pidfile 原子写+所有权校验、reaper/cron 的 start/stop 幂等、gracefulStop 统一收口，均有可取之处。但生命周期"边界态"处理系统性薄弱：崩溃/强杀后的状态恢复缺失（cron job 永久卡死）、超时只是"放弃等待"而非真正取消、SSE 客户端断连不向 agent loop 传播中止、reaper 状态覆盖不全导致漏删。测试侧最突出缺口：cron 四个模块（service/scheduler/store/timer）零专项单测。

## 范围与方法

- 通读焦点面对应源码：`src/cron/{service,scheduler,timer,store,session-reaper}.ts`、`src/server/app.ts`（SSE 相关段）、`src/runtime/daemon.ts`、`src/pidfile.ts`、`src/session-store/{store,types}.ts`、`src/heartbeat/agent-runner.ts`、`src/index.ts` 关闭钩子段。
- 对照 `test/` 目录评估覆盖：Glob `test/**/*` 全列 + 定向 Glob `test/**/*cron*`。
- 全程只读，无 git 操作；发现均带 file:line 证据。

## 发现清单（P0 | P1 | P2）

### P0（安全/数据损坏/崩溃）

无。

### P1（功能缺陷或高风险设计）

- **P1-1 cron job 崩溃后永久卡死（state='running' 无恢复路径）**
  - 证据：`src/cron/timer.ts:126`（onTimerTick 过滤 `j.state === "running"`）、`src/cron/timer.ts:290`（runMissedJobs 同样跳过 running）；`src/cron/store.ts:333`（state 经 updateJobRun 持久化进 SQLite）；全仓 grep 无任何将 `running` 重置为 idle/failed 的启动恢复代码。
  - 影响：daemon 在任务执行中被强杀/崩溃后，该 job 永远不再被调度（静默停摆），且无告警日志。

- **P1-2 SSE 客户端断连不中止 agent loop**
  - 证据：`src/server/app.ts:1461-1472` 与 `app.ts:1585-1590` 两处 SSE 流直接 `for await (agentLoop)` 写响应，全程无 `req/res close` 监听、无 AbortSignal 传入 agentLoop；对比 `app.ts:1130-1135` interactive 会话路径是有 `res.on('close', ...)` 处理的。
  - 影响：客户端断开后 LLM 循环继续烧完所有 turn（token/算力浪费），并产生僵尸流；断线重连也无法终止旧执行。

- **P1-3 session reaper 状态覆盖不全（漏删）**
  - 证据：`src/cron/session-reaper.ts:17-21` SWEEP_SQL 仅清 `expired`/`completed`(30d)/`interrupted`(7d)；而 `src/session-store/types.ts:7` 定义状态含 `'error'`；另 `saveMessages` 中途崩溃会话停留在 `'active'`（`src/session-store/store.ts:221-226`），reaper 明确跳过 active。
  - 影响：error 状态会话与崩溃遗留的孤儿 active 会话永不回收，sessions/session_messages 表无界增长——reaper 的核心职责存在盲区。

- **P1-4 cron 超时是"假超时"+定时器泄漏**
  - 证据：`src/cron/timer.ts:273-282` `executeJobCoreWithTimeout` 用 `Promise.race`，超时的 setTimeout 从不 clearTimeout（job 正常完成也残留一个 10 分钟未 unref 定时器）；race 胜出后底层 `runHeartbeatAgent`（LLM 循环）继续运行无人取消，其结果被丢弃。
  - 影响：每次 job 运行泄漏至多 10 分钟的事件循环占用；超时任务实际仍在后台消耗资源并可能晚到写入 session store。

### P2（质量/可维护性）

- **P2-1 `every` 间隔换算失真且大间隔越界**：`src/cron/scheduler.ts:32-40` — Math.round 取整使 90s 变 2min、1.5h 变 2h；≥24h 时 hours=24 生成 `*/24 * * * *`，超出 hour 字段最大 23，依赖 croner 对非法步长的容忍度。影响：用户配置的周期与实际触发周期不符。
- **P2-2 runtime daemon 任务表无界增长**：`src/runtime/daemon.ts:22,51` — `tasks` Map 只有 set 无 delete，长期运行内存缓慢泄漏。影响：常驻进程内存单调上涨。
- **P2-3 executeCommand 不杀进程树、输出无上限缓冲**：`src/cron/timer.ts:245-253` — SIGKILL 只杀 shell 本身，`sh -c` 的孙进程成为孤儿；`out += d.toString()` 无大小上限。影响：超时命令留下孤儿进程、chatty 命令可撑大内存。
- **P2-4 execution_log 无限增长 + removeJob 非事务**：`src/cron/store.ts:234-243` 先删 log 再删 job 无 BEGIN/COMMIT 包裹；`store.ts:357-377` 日志只增不清理。影响：异常中断留下悬挂日志；DB 缓慢膨胀。
- **P2-5 JSON"备份"机制发散且不可恢复**：`src/cron/store.ts:315-353` updateJobRun 不调 saveCronStore()，cron.db.json 与 SQLite 内容发散；`store.ts:192-203` loadCronStore 导出后无任何调用方。影响：所谓原子备份实为陈旧快照，损坏时无法用它恢复。
- **P2-6 双重信号处理器竞争、gracefulStop 不清 PID 文件**：`src/server/app.ts:2870-2887` gracefulStop 末尾直接 `process.exit(0)` 且未调 unregisterPid；`src/index.ts:141-158` 另注册一套带 unregisterPid 的 SIGTERM/SIGINT 处理器。两套 handler 并存，exit(0) 可能抢在异步 unregisterPid 完成前退出。影响：停机后残留陈旧 pidfile（CLI 有端口探测兜底，故降为 P2）。
- **P2-7 executeStep 静默吞错**：`src/runtime/daemon.ts:78-80` `catch {}` 既不打日志也不区分错误类型。影响：任务失败原因丢失，排障时日志不可信。
- **P2-8 cron 全链路零专项测试**：Glob `test/**/*cron*` 为空；cron service/scheduler/store/timer 无任何直接单测（仅 `test/session-reaper.test.ts` 覆盖 reaper、`test/pidfile.test.ts`、`test/connection-manager.test.ts` 各自覆盖本面）。P1-1/P2-1 这类边界缺陷正是无回归网的表现。

## 质量总评

代码风格统一、注释充分、关键原语（pidfile 原子写、reaper 幂等启停、WAL+预编译语句）质量在线，且有 REQ 编号追溯意识。核心短板集中在"异常路径即无人负责"：崩溃恢复（P1-1）、协作式取消（P1-2/P1-4）、清理完整性（P1-3）三处系统性缺失；cron 作为四大支柱之一完全没有单元测试护栏，风险最高。建议优先级：先补 cron 启动恢复 + cron 单测骨架（成本最低收益最大），再做 SSE abort 传播与 reaper 状态补全。

## 未覆盖

- `src/server/app.ts` 共约 3200 行，本次仅精读 SSE/关闭/reaper 装配相关区段（400-430、700-790、1120-1145、1420-1630、2250-2340、2860-2905），鉴权、代理转发、interactive 会话管理未逐行审。
- agent-core（`@tricompany/agent-core`）内部为外部包，未审其事件流与资源管理。
- `src/daemon/watchdog.ts`、systemd/schtasks/launchd 安装面、event-queue、sync/mirror、TUI hooks（useSSE/useAnthropicSSE 的客户端重连逻辑）未读。
- 未运行任何测试或构建验证（只读约束+时间盒），所有结论基于静态阅读。

## 关键文件清单（实际读过）

- `/srv/fleet/TriLC/src/cron/service.ts`
- `/srv/fleet/TriLC/src/cron/timer.ts`
- `/srv/fleet/TriLC/src/cron/scheduler.ts`
- `/srv/fleet/TriLC/src/cron/store.ts`
- `/srv/fleet/TriLC/src/cron/session-reaper.ts`
- `/srv/fleet/TriLC/src/session-store/store.ts`（1-239 行）
- `/srv/fleet/TriLC/src/session-store/types.ts`（grep 定位）
- `/srv/fleet/TriLC/src/server/app.ts`（1420-1629、2860-2905 区段 + 定向 grep）
- `/srv/fleet/TriLC/src/runtime/daemon.ts`
- `/srv/fleet/TriLC/src/pidfile.ts`
- `/srv/fleet/TriLC/src/heartbeat/agent-runner.ts`
- `/srv/fleet/TriLC/src/index.ts`（grep 定位 141-158）
- `/srv/fleet/TriLC/test/`（目录清单 + `*cron*` 定向核对）

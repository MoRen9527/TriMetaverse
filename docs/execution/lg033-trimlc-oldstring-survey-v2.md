# TriMLC 输出面旧串清查清单（2026-09-08 深夜勘，LG-033 ①件附属·424 处分级）

## 分布概览

- src/cli.ts: 116 处
- src/company/init-assemble.ts: 6 处
- src/company/init-chain.ts: 6 处
- src/company/init-cli-flow.ts: 70 处
- src/company/init-first-collab.ts: 1 处
- src/company/init-selfcheck.ts: 1 处
- src/company/init-sync.ts: 13 处
- src/company/sync-bundle.ts: 3 处
- src/config/env.ts: 7 处
- src/config/key-cache.ts: 19 处
- src/config/trilc-profile.ts: 2 处
- src/cron/scheduler.ts: 1 处
- src/cron/service.ts: 1 处
- src/cron/session-reaper.ts: 1 处
- src/cron/store.ts: 1 处
- src/cron/timer.ts: 1 处
- src/daemon/constants.ts: 2 处
- src/daemon/launchd.ts: 4 处
- src/daemon/schtasks.ts: 3 处
- src/daemon/systemd.ts: 3 处
- src/daemon/watchdog.ts: 2 处
- src/heartbeat/agent-runner.ts: 2 处
- src/heartbeat/heartbeat-active-hours.ts: 2 处
- src/index.ts: 17 处
- src/local-node/node.ts: 2 处
- src/mcp/mcp-config.ts: 11 处
- src/paths.ts: 1 处
- src/planner/planner.ts: 1 处
- src/project/multi-project-router.test.ts: 1 处
- src/project/multi-project-router.ts: 1 处
- src/project/project-link.ts: 11 处
- src/project/project-registry.ts: 7 处
- src/project/weekly-plane-root.test.ts: 4 处
- src/project/weekly-plane-root.ts: 1 处
- src/runtime/daemon.ts: 4 处
- src/server/app.ts: 80 处
- src/services/permissions/PermissionStore.ts: 2 处
- src/session-store/types.ts: 1 处
- src/sync/sync-engine.ts: 1 处
- src/sync/types.ts: 1 处
- src/toolbus/bus.ts: 1 处
- src/tools/shell-exec.ts: 1 处
- src/trimc-auth.ts: 1 处
- src/tui/design-system/theme.ts: 1 处
- src/tui/hooks/useAnthropicSSE.ts: 1 处
- src/update/update-check.ts: 8 处

## 分级修正建议

### A 级（本窗已修）
- healthz service 字段 app.ts:1659 'trilc'→'trimlc' ✅

### B 级（breaking change 候批）
- cli.ts Usage 全节 trilc 命令名（运维脚本/文档全引用）
- cli.ts 各子命令描述行

### C 级（低优先候批）
- logger 前缀 [trilc:xxx]（内部观测非对外身份）
- app.ts:3 头注释（已随 healthz 修）

### D 级（不需修）
- 测试文件（随源码修正自然对齐）
- 类型文件（纯类型定义无输出面）

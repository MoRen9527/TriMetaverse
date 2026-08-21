# R1 现状盘点：TriMC 服务器形态与 agent-core 消费实证（2026-08-21）

分身：tmv-r1-trimc（Explore）｜状态：done｜性质：现状事实，非方案判断

## CEO 关键问题①答案：服务器端 claude code 有没有用到 agent-core

**没有。TriMC 存在两条平行的 agent 执行路径，驱动官方 claude code 的那条（session-bridge）零 agent-core 依赖；agent-core 只用在自研 agent loop 路径上。**

## 路径 A：官方 claude code CLI 桥（= CEO 所指"服务器端 claude code"）【实证】

`src/orchestration/session-bridge.ts`（193 行，M1 Phase-2）：

- spawn：execFile `claude --bg -n <employeeId> "<task>"`，正则解析 "backgrounded · id · name" 得 agentId（:88-115）
- list：`claude agents --json` → agentId↔sessionId↔name 注册表快照（:121-149）
- send：`claude -p --resume <sessionId> --fork-session "<msg>"`，120s 超时回收 stdout 为回复（:155-183）
- 降权纪律：root systemd 下 `runuser -u fleet`，HOME=/home/fleet，cwd 默认 /srv/fleet（:7-9, :70-82）
- import 面仅 `node:child_process` + `node:util`，**零 agent-core**
- HTTP 面：GET/POST `/internal/v1/agents`、POST `/internal/v1/agents/{id}/message`（`src/server/app.ts:120-237`），寻址三级 sessionId→agentId→name
- 会话生命周期归官方 claude（fleet 的 ~/.claude）；TriMC 只持内存快照 registrySnapshot（app.ts:61）
- 来源标注：docs/execution/server-fleet-m0.md §三.7（服务器实测 trimc.service systemd / fleet 属主）

## 路径 B：自研 agent loop（agent-core 消费方）【实证】

`src/agent-loop/loop.ts`：TriMC loop 是薄壳/DI 层，全部 while-loop/流式/错误恢复/工具分发在 agent-core 的 agentLoop，底层经 trimodel 直调模型 API（deepseek），不跑 claude CLI。HTTP 面：POST `/internal/v1/agent`（SSE/JSON，contract→pipeline 装配→loop，app.ts:411-517）。

## agent-core import 精确清单【实证】（8 文件）

| 文件 | import 项 | 性质 |
| --- | --- | --- |
| src/agent-loop/loop.ts | agentLoop（核心执行）、AgentEvent、AgentLoopDeps | 执行核心 |
| src/agent-loop/tools.ts | 工具注册 re-export、createProcessSupervisor | 工具面 |
| src/agent-loop/permissions.ts | tier 权限体系 re-export、getTierSummary | 权限面 |
| src/agent-loop/sub-agent/types.ts | type ProcessSupervisor | 仅类型 |
| src/cron/service.ts + routes.ts + command-handler.ts | JobExecutor + job-store + validateCronExpression + CronJob 类型 | cron 调度核心复用 |
| src/contracts/resolver.ts | loadContractV3、AgentContractV3 | 合同解析 |
| src/onboarding/session-initializer.ts | loadContractV3 | 员工会话装配 |
| src/cli.ts | type CronJobPatch | 仅类型 |

contracts 现状确认：resolver 是自有文件，但 r13-2 收敛后内部委托 agent-core loadContractV3（"自有壳 + agent-core 权威 schema"，非全自有解析）。
依赖真源：node_modules/@tricompany/agent-core → symlink TriCompany/packages/agent-core【实证】。TriMC/packages/agent-core 仅 dist 无 src，为残留构建产物【推断】。

## 自研不用 agent-core 的模块（吸收 Claude Code 设计的自有件）【实证】

context-builder（吸收 CC prompt.ts）、prompt-cache（吸收 CC 2.1.88 缓存标注，DeepSeek 自动前缀缓存）、tool-gater（tier+policy-gate 合成 canUseTool，经 AgentLoopDeps 注入）、permissions-engine（吸收 CC 2.1.88 vendor，简化 8 步管线）、sub-agent/（吸收 CC AgentTool，4 内置 agent + CLAUDE_TOOL_MAP 工具名映射）、soul-loader、memory-injector（吸收 CC memdir 四层记忆）。参考真源 vendor/claude-code（含 MISSING_INTERNALS.md）+ docs/engineering/claude-code-absorption/。

## 其他盘点事实

- **trimc 功能面**（src/ 23 顶层模块）：server（13 路由 691 行）、agent-loop、cron（对标 TriLC 契约的装配面）、task-controller（内存状态机）、mirror（内存 Map 镜像，MVP）、comm（TriLC 离线事件仲裁 winner-takes-last）、node-bridge（**offer 存根仅 console.log，未实装**）、orchestration（session-bridge + capability-router 三层匹配 + cost-controller 模型白名单 claude-4.5/gpt-5.1/gemini-3.0-pro）、pipeline（contract→soul→context→loop 装配）、config-sync（fleet bundle→applied.json 五维同步接收侧）、observability（PG timeline replay + benchmark gate）、policy-gate、heartbeat（**Python**：IPD case 心跳 + 小贾 session-resume hook，与 TS 主服务独立进程【推断】）
- **部署形态**：docker-compose（CARRY-004：trimc+postgres16，默认模型 deepseek-v4-pro/flash）、k8s/trimc、服务器 systemd trimc.service + fleet 降权、docs/ops/trimc-cron-plane-shift-runbook.md。STATE.md 自述"服务域 shadow / runtime 吸收主模块"
- **通信现状**：入向 HTTP——POST /internal/v1/heartbeat（TriLC 节点心跳）+ POST /internal/v1/events/replay（离线事件 replay→comm 仲裁）。env 预留 tristaciss(:8008)/openclawGateway(ws://8822)/vscodiumGlue(:8730) 三外部接线。**无 ssh/bridge 面【实证：全仓无 ssh 调用】。node-bridge 是空壳**
- **会话/agent 管理**：路径 A 会话归官方 claude 管理，TriMC 无生命周期控制（fork-session 副本语义发消息）；路径 B 仅内存 task 状态机 + 镜像；持久化仅 observability PG；上下文存储 memdir（TRIMC_MEMDIR）。多 agent 调度：capability-router 设计在册、实装程度浅【推断】
- **关键结构性事实（供 R4/R6）**：路径 A（claude CLI，不用 agent-core）与路径 B（agent-core 自研 loop）在代码层完全隔离、无互调【实证：session-bridge 不 import loop，app.ts 两路由独立】——"服务器 claude code 与 agent-core 体系脱节"的直接证据

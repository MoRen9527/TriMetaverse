# 编排层事实卷 · TriRMC 无头团队编排面与 agent-core 能力定界（源码活体现探）

- sourceOfTruth: 本卷（BOD 集散·源码事实核查卷·零判断零代裁）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: CEO 口谕 2026-11-19 21:43:47+0800（两问）+22:07:23+0800 落卷知会令
- 问源原文: 「TriRMC 那边都是无头的 agent，不像 M-SG 可以常驻会话，他的团队协作是不是需要一个额外的，比如我们 bod 或者他的 cos 来做编排才能形成 team 协作？还有我记得我们拿 claude code 2.1.88 改的 TriRMC 的 agent-core 本身就是有编排功能的吧，能用来领导无头团队么」
- 证据基座: 本地 TriRMC 克隆（`D:/Code/ai/TriRMC`·顶 e408da5·跟 R 侧线）＋`TriCompany/packages/agent-core@0.1.0` 源码静态面
- 性质注: 事实卷只录源码锚与读数；「是否采信/如何并入评估」归三席与 CEO
- 挪域勘正（CEO 2026-11-19 22:35:42 令）：本卷原落 fade001 树（随 notice-227 评估树），CEO 勘正=平台编排事实≠fade-001 进化实例·两域分开——挪独立树 trirmc-orchestration-fact-20261119/，挪域随 notice-230 知会值席转 CTO/CPO

## §一 · 问一答：无头团队协作需要编排面吗？

**需要——但 TriRMC 已内置编排层，不需外挂 BOD/COS 常驻会话当指挥。**

架构逻辑面：无头 agent=一次性执行体（无常驻上下文、互相不知对方存在），「谁派活/谁收活/谁管时序/谁处理失败」必须有一个编排面承担——但编排面不必然是 agent，可以是程序（daemon 内编排器）。

TriRMC 现役编排层=`src/orchestration/`（九模块·文件实锚 2026-08-25 落盘）：

| 模块 | 职能 | 接线状态 |
|---|---|---|
| session-bridge.ts (6389B) | 无头会话三件套原语（见 §二） | **已接线 app.ts 活面** |
| employee-scheduler.ts (3767B) | 任务五态机 queued→assigned→running→accepted/rejected→done（含 escalated）·transition/assign/escalate/isTimedOut·maxConcurrentTotal=20·超时 5min·重试 3 | 库件·未接线 |
| employee-registry.ts (3411B) | loadEmployeeRegistry 员工合同装载注册表 | 库件·未接线 |
| capability-router.ts (5354B) | route 能力路由 | 库件·未接线 |
| dispatch-proxy.ts (8821B) | dispatch/dispatchAsync 派发代理 | 库件·未接线 |
| cost-controller.ts (6186B) | estimateCost/checkBudget/getModelTierPolicy 成本护栏 | 库件·未接线 |
| types.ts/index.ts | 型面与 re-export 门面 | — |

- 接线证据：`src/server/app.ts` L23-26 import 四函数·消费点 L192（listAgents）/L235（buildRegistry）/L257（sendMessage）/L308（spawnSession）——四个 HTTP 编排端点活面；
- 未接线证据：employee-scheduler/capability-router/dispatch-proxy/cost-controller 四模块 `grep src/ --include='*.ts'` 零调用（仅 contracts 注释提及）——**设计齐、激活面只有 session-bridge**；
- 设计来源（源码注释原文）：「Source: TriMC/docs/engineering/employee-orchestration-design.md §3.3」（scheduler）·「来源：server-fleet-m0.md §三.7 / CTO M1 Phase-2 方案」（session-bridge）。

## §二 · session-bridge 三件套原语（源码锚）

驱动对象=**官方 claude CLI 后台会话**（fleet 账号降权 runuser·注释原文「triMC 以 root 跑 systemd 时，claude 子进程一律 runuser 到 fleet 账号」）：

| 原语 | 命令形（注释原文） | 返回 |
|---|---|---|
| spawnSession | `claude --bg -n <employeeId> "<task>"` | agentId（短 id·正则 `backgrounded·<id>·<name>` 解析） |
| listAgents | `claude agents --json` | agentId↔sessionId↔name 注册表快照（含 bg 与历史） |
| sendMessage | `claude -p --resume <sessionId> --fork-session "<msg>"` | 回复文本 |

- 注册表型面：AgentSession{agentId, sessionId(UUID), name, cwd, status, state, employeeId?, lastSeenAt}；
- **要点**：`--bg -n` 命名后台会话=河源侧原生具备「常驻命名会话」形态——并非只有 dsh 一次性 headless；注册表+跨会话送信（resume+fork-session）=「领导无头团队」的最小原语集。

## §三 · 问二答：agent-core 本体有编排功能吗？能领导无头团队吗？

**agent-core 本体不能领导无头团队（无团队面）——领导面在 daemon 编排层（§一§二）。**

- 包身份：`@tricompany/agent-core@0.1.0`（`TriCompany/packages/agent-core`·TriRMC 经 `file:../TriCompany/packages/agent-core` 链接）·描述原文「Shared agent-loop core for TriMC and TriLC — TriCompany company-dimension package」·TriRMC `src/agent-loop/loop.ts` 只做 DI 壳（「All while-loop logic, error recovery cascade, tool dispatch, permission gating, and streaming now live in agent-core. TriMC is just the DI layer」）；
- 血统核实：**按模块吸收自 Claude Code 2.1.88 vendor**——注释原文「CTO-003 P4T1: Absorbed from Claude Code 2.1.88 vendor」（permissions-engine 全族 5 文件：decision-pipeline/rule-parser/safety-check/types/index）·sub-agent spawn 注释「Absorbed from Claude Code's AgentTool (spawnAgent + runAgent)」——形态=模块吸收，**非整壳 fork**（CEO 记忆「2.1.88 改的」在吸收意义上属实）；
- agent-core src 结构六面：contracts（agent-contract）／message-guard／permissions-engine／process-supervisor／**scheduler**／sub-agent；
- 保留的编排面定界：
  - sub-agent spawnAgent：**同步 in-process async generator**（`for await (const event of spawnAgent(config))`）·TriRMC 侧同族注释原文「Tier 1 scope: Sync execution, **no Fork, no Worktree, no auto-background** (those are Tier 2+)」——`grep background|fork|worktree|team|SendMessage` 于 spawn.ts/types.ts **零命中**：无后台 agent、无跨会话发信、无 team 互信、跑完即归；
  - scheduler=cron-engine/backoff/stagger/heartbeat-policy/job-executor（注释「absorbed from openclaw」）——**任务调度基础设施，非多 agent 团队编排**；
- 结论行：agent-core=单循环内核＋同步子 agent＋任务调度；「领导无头团队」的三件套原语在 daemon 编排层 session-bridge（§二）·两层面勿混。

## §四 · 对自进化方案（notice-227 评估面）的含义

- 与 notice-226 loop 本体裁**同构**：编排=loop 本体程序（round_runner 调 session-bridge 端点 spawn→送信→收卷），agent 只留监督面——CEO「除 spawn 外都用程序」裁定在 TriRMC 侧有现成 API 承载面；
- TriRMC 做施工面自进化：编排骨架**现成，缺的是未接线五模块按需激活＋round_runner 落地**——不需外挂编排者；
- CTO 稳定性评估可并入的核查面（参考·采不采由 CTO 自定）：编排层激活度（五库件接线计划）＋session-bridge 端点实跑验证（spawn 成活率/降权纪律实跑/会话保活）。

## §五 · 边界如实标

1. 本卷=**源码静态面**（本地克隆·顶 e408da5 cron-alarm 勘修线·跟 R 侧同步）；河源**部署活体**（systemd 跑的 dist 版本、端点实跑稳定性）未探——ssh 正名 `R-HY-8.155.54.79` 已核（经 M-SG-47.245.122.61 跳板·首探别名错位已勘正）；
2. 「能否稳定领导无头团队」的动态面（spawn 成活率/会话保活/多轮连续）=CTO TriRMC 稳定性评估范围，本卷不代判；
3. `packages/agent-core`（TriRMC 仓内同名目录）=空目录零跟踪文件——agent-core 实体在 TriCompany 仓，两处勿混（拓扑断言先分仓）。

—— BOD（集散·源码事实核查·锚笔在案）·落卷时戳锚=commit %cI（零手打·D-47 零占位）

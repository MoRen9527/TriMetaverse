# R2 现状盘点：TriLC 功能面 + agent-core 包结构 + TriPilot/TriCade 连接与上下文可见性（2026-08-21）

分身：tmv-r2-trilc-core（Explore）｜状态：done｜盘点时刻 2026-08-21T14:54:32Z｜【实证】=文件可查 /【推断】=推断需核实

## 一、TriLC 功能面（D:/Code/ai/TriLC/）

【实证】src/ 顶层模块（30 目录 + 4 顶层文件）：
- server/ — HTTP+SSE 服务器本体（app.ts 单文件 4387 行，原生 node:http 无框架；anthropic-stream/openai-stream 双协议流；interactions 用户交互问答）
- daemon/ — OS 守护注册（schtasks/launchd/systemd/watchdog；Windows 任务名 "TriLC Daemon"）
- runtime/ — LocalRuntimeDaemon（agent-core 驱动的任务执行壳：node 心跳+planner 分解+TaskRuntime 状态机）
- cron/ — cron 引擎（croner + SQLite 持久化；session-reaper：completed 30d / interrupted 7d）
- heartbeat/ — 员工心跳会话（每员工跑 agentLoop 单周期，持久化 session-store）
- session-store/ — SQLite 会话存储（node:sqlite，schema v2：sessions + session_messages，含 cloud sync 字段）
- company/ — 开张链（init-chain 七态状态机 UNINITIALIZED→…→READY、init-assemble/sync/confirm/first-collab、staffing 岗位审批、session-initializer）
- knowledge-injector/ — knowledge.db 五层知识 boot 注入（非检索）
- project/ — 多项目隔离（multi-project-router：session/cron/key-cache 按 {projectRoot}/.tricompany-cognition/ 隔离；注册点 %LOCALAPPDATA%\trilc\project-registry.json）
- sync/ — TriLC→TriMC 会话云同步引擎（**死代码，两端未接线，见四**）
- mirror/ — TaskMirrorPusher（任务快照推 TriMC，事件驱动+30s 心跳兜底）
- event-queue/ — 离线事件队列（TriMC 不可达时暂存，重连 replay）
- localbus/ — 进程内类型化 EventEmitter（Phase 1 内存总线，Phase 2 计划 UDS/命名管道）
- local-node/ / planner/ / task-runtime/ / context-adapter/（空壳：声明 workspace/filesystem/terminal/browser 四能力）/ mcp/（MCP 客户端 stdio+SSE 工具代理）/ skills/ / services/（compact 压缩+PermissionStore）/ tools/（17 内置工具）/ tray/（C# WinForms）/ tui/（Ink）/ update/ / wallet-upgrade/ / config/（env+contract-resolver+key-cache/encryptor）/ contracts/ / utils/ + cli.ts（trilc 入口）

【实证】daemon 侦听与安全面：仅 127.0.0.1（app.ts:3726），默认 8711；**无 token/鉴权**（全仓无 Authorization 校验路径）——安全模型=只靠回环绑定。HTTP 路由约 50 条（手写 if-链）：/healthz、/v1/messages（Anthropic 协议）、/chat/completions（OpenAI 协议）、/internal/v1/agent、agents(±system-prompt)、sessions(±stream|cancel|fork|recover)、tasks/submit、cron CRUD、init/* 全链、staffing/*、projects/*、knowledge/metrics、interactions、mcp/servers、update、notifications。

## 二、agent-core 包结构（TriCompany/packages/agent-core/）

【实证】@tricompany/agent-core v0.1.0 "Shared agent-loop core for TriMC and TriLC"。依赖仅 4：croner/trimodel(file:)/yaml/zod。src/ 9 模块：
- loop.ts(686行) — agentLoop/runAgentLoop，AgentLoopDeps 依赖注入（context-builder/prompt-cache/tool-gater 缺省降级），模型层走 trimodel
- tools.ts(101行) — 工具注册表（具体工具留各仓实现）
- permissions.ts + permissions-engine/ — AgentTier 分层 + PermissionEngine 决策管线
- sub-agent/ — spawnAgent + 4 内置 agent（code_explorer/test_runner/file_processor/code_reviewer）
- contracts/ — AgentContractV3（loadContractV3，r13 收敛双域统一入口，只收 v3）
- message-guard/ / process-supervisor/ / scheduler/（cron 全家桶：engine/job-store/executor/backoff/stagger/heartbeat-policy）

【实证】TriLC 与 TriMC 均 file: 依赖 TriCompany/packages/agent-core（node_modules 双双 symlink 实测）；agent-core 本体源自 TriMC Phase 2 抽取；TriMC 仓内 packages/agent-core 仅 gitignored dist 残留（git ls-files 空，清理 commit 9111222/182de4d）。

**"以 agent-core 为核心的 daemon"现成 vs 缺口**：
- 【实证】现成：agent loop、工具注册、权限引擎、sub-agent、合同 v3、cron、进程监督、消息防护——"单 agent 会话执行"全部内核
- 【实证】缺（agent-core 内不存在，分散各仓或不存在）：HTTP/SSE daemon 抽象（两仓各自手写 app.ts）、会话存储（TriLC 有 SQLite，agent-core 无，TriMC 无）、上下文聚合（TriMC context-builder 是"单 agent 上下文装配"非"所有 agent 聚合"；agent-core ContextSources 仅注入接口类型）、多 agent 运行时注册表（各仓自有 resolver/registry）、**跨节点/跨 daemon 可见性（任何仓都不存在）**

## 三、TriPilot ↔ TriLC 连接现状

【实证】纯 HTTP+SSE（node:http），唯一配置 tripilot.trilcDirect.baseUrl 默认 http://127.0.0.1:8711；无发现机制（写死回环+固定端口）；无鉴权头。
【实证】能力面（TriLCClient.ts 422 行）：submitTask / streamSession（SSE 六事件）/ listSessions（本 daemon 全部会话）/ **recoverSession（拿回任意本地会话 session+messages 全量——"看本 daemon 历史上下文"已到消息级）** / cancelSession / listAgents（13+1 员工 + 4 builtin 含 decisionRights/tools/displayName）/ getAgentSystemPrompt（含知识注入后 prompt）/ staffing 三面 / checkHealth。
【实证】"看到所有 agent 上下文"现状 = **只限本机本 daemon**；跨 daemon（服务器）可见性 = 零（唯一 TriMC 感知是 /healthz 里 trimc:'connected'|'degraded' 单字段）。
【实证】TriCade 打包面：CI checkout 五仓+TriCompany 产 MSI+ZIP+vsix；install-tricade.ps1 部署 trilc + TriPilot 到 ~/.vscode-oss/extensions（VSCodium 宿主）；TriCompany/source-agents 合同随包拷进 trilc/contracts/。

## 四、跨机可见性现状

【实证】既有服务器↔本地面 4 条，**全部本地→服务器单向推送**，无一反向读取：
1. 心跳：POST TriMC /internal/v1/heartbeat（10s 间隔，connected/degraded 状态机）
2. 任务镜像：TaskMirrorPusher → POST /internal/v1/tasks/mirror（事件驱动+30s 兜底）；TriMC 有 GET /internal/v1/tasks 可读
3. 会话云同步（**死代码**）：sync/sync-engine.ts 完整实现（状态机+409 幂等+重试退避），目标 POST {trimcBaseUrl}/internal/v1/sessions/sync——但全仓无调用方 + TriMC 无接收端，**两端都没接，未运营**
4. 五维配置同步（走 git 不走 HTTP，见五）

【实证】安全模型不对称：TriMC 侦听 `server.listen(env.port)` 无 host 参数 = **绑 0.0.0.0**（默认 8710）；TriLC 只绑 127.0.0.1。
【实证】无任何 ssh/bridge 面存在（全仓无痕迹）；TriMC 侧 node-bridge/、comm/arbitration、observability PG 为服务器自有设施，与本地无互通面。

## 五、I4/I5 会话初始化器与五维同步

【实证】session-initializer 双端同构（TriLC src/company/ + TriMC src/onboarding/，注释互指"同构实现，互为 fallback"）：contract 加载 → 五件套装配（systemPrompt=soul+agent_body、decisionRights、toolControl、employeeInfo）→ workspaceRoot 创建+可写校验 → FADE-003 知识注入 → SessionConfig。TriMC 侧 r13-2 起合同解析统一走 agent-core loadContractV3。
【实证】五维 bundle schema（sync-bundle.ts 452 行）：company/model/keys/employees/project 五维，每维三态降级，schemaVersion 1；密钥纪律 SEC-20260813-001（递归拒绝 api_key 类字段、keys 维白名单、fingerprint=SHA-256(key).slice(0,8) 不落盘）；contentHash 五维语义哈希。
【实证】传输链：bundle → 写 TriCompany 仓（tmp→rename）→ git commit（固定身份 "TriLC Init Sync"）→ push 双远端（origin dev + sg-server dev）→ TriMC config-sync/apply.ts 由 cron 调起从服务器 fleet 工作树读 → schema 校验 → applied.json 版本比对 → 落地。**五维同步载体 = TriCompany git 仓本身**。
【实证】I5 = init-first-collab：POST /internal/v1/init/ready/first-collab，链态门 chainState=='ready' 否则 409。

## 附带观察

【实证→推断】CI 断链风险：build-tricade.yml:153 "Build TriMC agent-core" working-directory 仍指 TriMC/packages/agent-core，但 TriMC 仓已不跟踪 packages/（清理 commit 9111222）且 workflow 已单独 checkout TriCompany——该步骤在新 runner 上可能失败或为失效步骤；output/ 有 r15-r20 成功产物（近期构建可能走本地脚本）——需 CI 侧核实。

## CEO 问题 4 现状基线一句话

"本地 TriPilot 连 agent-core 为核心的 daemon 看本地所有 agent 上下文"——**本地侧已基本成立**（TriPilot↔TriLC 会话/agent/流全通，agent-core 就是该 daemon 执行内核）；"看到服务器的"——**现状为零**（单向推送 4 条面 + 会话同步两端未接线）。

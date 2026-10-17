# BOD 概念对齐卷 · agent-core daemon 形态 vs claude code runtime vs M 面 13 席 · 2026-10-17

- sourceOfTruth: 本卷（CEO 概念问询答复底稿·真源引注见文末）
- syncMode: static（问询答复留痕·决策输入件候 Sunday 评审并表）
- lastSyncedAt: 2026-10-17T15:20:39+08:00（date 现查·写前跑）
- 问源: CEO 15:16 亲问「R面agent-core是daemon形态具体含义/与claude code runtime及claude -n区别/是否剥离CLI壳的claude code内核/会话历史在哪管/13席支持么」

## 一·daemon 形态=「进程」与「agent 会话」解耦

| 形态 | 进程与会话关系 | 关了界面后 | 进程死了后 |
| --- | --- | --- | --- |
| claude code CLI（claude -n / claude --resume） | **一进程=一会话** | 进程还在跑（tmux 守着时）| agent 死——transcript 是档案非活体，--resume=新进程从档案重建（尸体复活式） |
| agent-core daemon（TriRLC 形） | **daemon 常驻进程，会话=daemon 内托管对象** | 会话在 daemon 里继续存在（历史状态热持），重连即 attach | daemon 停=会话停——所以配看门狗/heartbeat（scheduler+process-supervisor 现成件） |

TriRLC/src 目录实锚：runtime/daemon.ts + session-store/ + task-runtime + server——「detached local runtime」（与会话界面分离的运行时）即 CEO 所述设计意图的正身。

## 二·与 M 面 13 席形态异同（CEO 类比 80% 对·两处校准）

- 同：都达成「界面断了 agent 还在、进程死了能恢复」。
- 异①：M 面 13 席会话引擎=claude code 进程本身，看门狗拉起**新进程从 transcript/CLAUDE.md 重建**；agent-core=daemon 内对象常驻热持，**idle 零 API 成本·有事才推理**（CTO 答卷「免唤醒的正确打开」）。
- 异②：M 面 TriMLC 8713 daemon 只管机制层（cron/信箱）**不管会话**（会话在 tmux 里的 claude 进程，两个世界）；agent-core 形态 daemon 与会话是同一个世界（daemon 托管会话）。

## 三·「剥离 CLI 壳的 claude code 内核么？」——不是 claude code 剥的，是自家 TriMC 剥的

CTO 答卷 10-16 实锚（现探源码）：`@tricompany/agent-core` 0.1.0·4664 行 TS·loop.ts 头注「**Mirror of TriMC's agent-loop/loop.ts, extracted to agent-core for reuse by TriLC**」·依赖 trimodel（TriModel 统一模型层）·**零 claude code/agent-sdk 依赖**。角色定位≈「无头 claude code」，实现全自研，模型后端走 TriModel（可换·与 dsh 化同向）。

| agent-core 件 | ≈ claude code 对应件 | 缺口 |
| --- | --- | --- |
| loop.ts | 主 agent 循环 | 小 |
| tools.ts（118 行） | 内建工具系统+MCP+插件生态 | **大**（通用编码）/可控（判断力场景 6-8 件可枚举） |
| permissions-engine | permission modes/hooks | 小（骨架在规则面补） |
| scheduler+process-supervisor | （claude code 无此件） | ——daemon 底座正是「一直运行」承载 |
| context-builder/prompt-cache | auto-compact/prompt cache | 中（压缩策略自建） |
| sub-agent spawn（188 行） | Task/subagent | 骨架级 |

## 四·会话历史/transcript/用户系统

- 会话历史=TriRLC **session-store**（SQLite·node:sqlite·源码头注实锚）：sessions 表（id/model/system_prompt/cwd/status/云同步字段）+session_messages 表（有序全字段消息·含 reasoning_content）。
- agent-loop 每轮完成**自动整批落库**；中断恢复=检测 status='active' 无 close 事件的会话——「从上一次聊天记录恢复」读的是**自家 SQLite，不是 ~/.claude/projects transcript**。
- 用户系统：**无**——session 表无 user 字段，单租户自用形（TriMem=占位模块）。

## 五·agent-core 启动 13 席支持么

- **机制支持**：会话按 session_id 分区，13 席=13 个 session+13 份 system_prompt（按席注入）+各席 cwd——命名/会话/历史天然分开管。
- **现实差距**（CTO 答卷口径）：工具链缺口大（施工编码面）/技能体系无/长跑成熟度未证；判断力场景工具 6-8 件可控。
- **当下路标**：R 面 13 席现走 dsh（第三方 harness·10-17 接退中）；agent-core 承载=CTO 建议 **P3 勘验窗双案 A**（周-双周级工程量），双案实测读数后裁——非今天切换件。
- 引擎全景：claude code（M 面 13 席+BOD）/dsh（R 面 13 席新装·LG-087 v4）/agent-core（TriRLC 8711 现役底座）三套并存各就其位；接入协议同族（ACP），引擎不同。

## 真源引注

- CTO 答卷：trees/lg085-bod-cli-acp-review/cto-bod-judgment-plugin-agentcore-answer-20261016.md（四面对照表/免唤醒形态/P3 双案）
- 架构真源：docs/三元宇宙架构与模块说明.md §模块表（TriRLC=detached local runtime·RMC/RLC 共用 agent-core·§六师徒总纲）
- dsh 关系：docs/execution/dsh-rplane-harness-design-20261014.md §1.1（机制层/执行层分层·TriMLC+agent-core 对称参照）
- 源码实锚（10-17 15:1x 现探）：TriRLC/src/session-store/store.ts 头注+DDL；TriCompany/packages/agent-core/src/ 目录结构；core-agent/README（归档件·非现役·勿混引）

## 六·增补（15:31 CEO 追问）：scheduler 与 process-supervisor 具体用法（源码现探）

### scheduler 五件（agent-core/src/scheduler/·血统注=cron-engine/backoff/stagger 系 openclaw 吸收剥异）

| 件 | 职责 | 关键语义 |
| --- | --- | --- |
| cron-engine.ts | cron 表达式解析+下次运行计算 | croner 库·实例缓存 512·时区解析 |
| job-executor.ts | 调度循环：找到期 job→setTimeout→执行→重复 | tickMs 1s/maxTimerDelayMs 60s/**staleRunningMs 20min 孤儿检测**（daemon 崩溃重启中道的 job 清 running 态可再触发）·MVP 无启动补跑 |
| job-store.ts | job 持久化 | loadJobStore/patchJobState/saveJobStore |
| heartbeat-policy.ts | 判定执行结果投递 or 静默跳过 | shouldSkipDelivery「一切正常免投递」·stale 阈值默认 5min |
| backoff.ts + stagger.ts | 重试退避（1s 起/60s 顶/2x/±10% jitter）+整点错峰 | stagger 检测 top-of-hour「雷群」表达式→每 job 确定性错峰默认 5min |

### process-supervisor（agent-core/src/process-supervisor/）

- `createProcessSupervisor()`：**spawn({argv, cwd, timeoutMs, captureOutput, scopeKey, replaceExistingScope}) → ManagedRun**；`run.wait()` 返回 {exitCode, stdout, stderr, timedOut, durationMs}；`cancel(runId)`/`cancelScope(scopeKey)` 按 scope 批量取消（daemon 关停钩子用）。
- `createRunRegistry()`：内存 run 记录表·state 流转·exited 记录上限 2000 自动清。
- 超时两类：overall-timeout / no-output-timeout。

### TriRLC 现役消费实例（两处真用法）

1. **shell-exec.ts（agent 的 shell 工具）**：`supervisor.spawn({argv:['cmd','/c',command], cwd, timeoutMs, captureOutput:true, scopeKey:'trilc-shell'})`→wait()→截 10k 回；daemon 关停 `cancelAllShellProcesses()` 按 scope 全清——**agent 每次跑 shell 命令都经 supervisor 托管**（超时必杀·零孤儿进程）。
2. **cron/timer.ts（cron 面自持版·与 agent-core scheduler 同源亲戚）**：MAX_TIMER_DELAY_MS=60s 防 setTimeout 漂移/MIN_REFIRE_GAP_MS=2s 防自旋/resetStaleRunningJobs 开机复位陈旧 running（LG-064）+missed-job catchup（重启补跑·每次≤5 个·错峰 5s）+job timeout 10min+连续 3 败降级；job 触发经 runHeartbeatAgent 起会话跑 systemPrompt·消息落 session-store。

### 与「13 席」的接法注

scheduler/supervisor 擅长**短任务**（定时活+子进程托管）；13 席主力是**长会话**——长会话走 daemon 内 session 托管（session-store 面），scheduler 适合承载「定时唤醒某席干活」的触发层，二者组合而非互替。

### 增补真源

- TriCompany/packages/agent-core/src/scheduler/{cron-engine,job-executor,heartbeat-policy,backoff,stagger,job-store}.ts 头注+选项默认值（10-17 15:3x 现探）
- TriCompany/packages/agent-core/src/process-supervisor/{supervisor,registry}.ts；index.ts 导出面
- TriRLC/src/tools/shell-exec.ts L110-160（spawn 用例）·TriRLC/src/cron/timer.ts 头注+常量

## 七·增补二（16:39 CEO 追问）：血统谱系定谳+scope 概念

### 血统谱系（grep 全分布实证·三档姿势）

| 件 | 血统 | 证据（头注原文） |
| --- | --- | --- |
| cron-engine | **openclaw 直接吸收** | 「Absorbed from openclaw cron/schedule.ts, stripped of openclaw-specific delivery/session concepts」+croner 年回滚 workaround 亦吸收 |
| job-store | **吸收+简化** | 「Absorbed from openclaw cron/store.ts, simplified」 |
| backoff / stagger | **openclaw 直接吸收** | 「absorbed from openclaw infra/backoff.ts」/「absorbed from openclaw cron/stagger.ts」 |
| heartbeat-policy | **模式改适（非直接搬）** | 「TriMC-specific (not directly absorbed from openclaw, which ties heartbeat to channel delivery). The openclaw pattern is adapted to TriMC's agent-loop context」 |
| job-executor | **参考简化重写** | 「Much simpler than openclaw's cron/service/timer.ts」——裁五件（channel 投递/隔离 agent/session reaper/启动补跑/heartbeat-wake 协调）MVP |
| types.ts | 类型面剥异 | 「Clean types stripped of openclaw channel/delivery concepts」 |
| **process-supervisor** | **原生自写** | grep 全包 openclaw 零命中·node:child_process+crypto 原生 |
| **session-store（TriRLC）** | **自写** | grep 零命中·node:sqlite 原生（TriRLC 的 cron/timer.ts 才是「Pattern adapted from vendor/openclaw」） |

一句话：**scheduler 全族=openclaw 血统（吸收/简化/改适三档）·process-supervisor 与 session-store=自写件**。openclaw 血统进agent-core 时统一剥掉 channel/投递概念（openclaw 面向聊天渠道投递，TriMC 语境=agent 循环内消费）。

### scope（scopeKey）概念=进程的「责任域标签」

- spawn 时给子进程挂一个字符串标签（scopeKey，如 'trilc-shell'）；`cancelScope(tag)` 把同标签所有活跃进程一键全取消；`replaceExistingScope: true`=同标签新进程先顶掉旧进程（同类互斥）。
- 三个用途：①**按域回收**——daemon 关停钩子按标签一把全杀不留孤儿（TriRLC 实例：agent 跑的 shell 全挂 'trilc-shell'，关停 cancelScope 全清）②**同类互斥**——定时 job 每轮触发顶掉上轮没跑完的，防堆积并发③**审计分组**——registry 档案带标签，事后按类查询。
- 与 runId 的关系：runId=个人身份证（精确杀单个），scopeKey=部门（批量管理）——「谁起的进程划谁的责任域，关停按域回收不误杀别域」。

### 增补二真源

- grep "openclaw" agent-core/src 全分布（10-17 16:3x 现探·scheduler 六件命中/process-supervisor 零命中）；TriRLC session-store 零命中+cron/timer.ts L3 血统注；supervisor.ts imports 面

—— BOD 2026-10-17 16:39:53 +0800（date 现查·发毕重跑对表）

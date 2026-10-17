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

## 八·增补三（17:49 CEO 五连问）：openclaw 五大件详解+四面内核同源勘正+R 面 cos 现势

### 8.1 openclaw 被裁五大件·功能/场景/局限/未来

| 件 | openclaw 功能（源码实锚） | 咱们裁后现状 | 局限 | 未来 |
| --- | --- | --- | --- | --- |
| 渠道投递 delivery.ts | job 结果投递聊天渠道（测试名实证=WhatsApp 等多目标） | 无——结果只进信箱/日志 | 到不了手机聊天面，人工开箱看 | **投递器可插拔化**（信箱/localbus/TriPilot/IM adapter）——CEO「BOD 可接通聊天渠道」方向实证：BOD 转报链本质=「目标=CEO 直连会话」的投递实例，加回即催办/告警直达 CEO 手机 |
| 隔离 agent isolated-agent/ | 每 job 独立 agent 会话跑（独立上下文/模型/auth-profile 传播） | 每 job 单轮 systemPrompt 驱动 runHeartbeatAgent（session-store 各建 session） | 无持久 job 专属 agent 身份/多轮长任务形 | job 需多轮/专属人格时补隔离形 |
| session reaper session-reaper.ts | sweepCronRunSessions 清扫 cron 僵尸会话 | **agent-core 裁掉，TriRLC 消费侧自持补回**（src/cron/session-reaper.ts 在案） | —— | 分层范式确认：内核薄·运营归消费侧 |
| 启动补跑 startup catchup | 重启后补跑停机期错过 job | **同上**（TriRLC timer.ts 自持：每次≤5 个·错峰 5s） | —— | 同上 |
| 唤醒协调 heartbeat-wake | 心跳节拍与 cron 唤醒联动（timer.ts imports 实锚） | 简化——TriRLC 另有 power-follower/power-keepalive 自持电源面 | 无复杂联动策略 | 候电源/心跳联动需求出现再评估 |

裁剪逻辑一句话：openclaw=个人助理形态（渠道+人格+运营全家桶）；agent-core=抽薄内核（算次/存储/执行/退避/错峰），**学形不学耦合**。

### 8.2 四面内核同源勘正（CEO 直觉实证·架构文档旧口径张力）

package.json 实探（10-17 17:5x）：**TriMMC L26/TriMLC L24/TriRLC L26/TriRMC L26 全部 `file:../TriCompany/packages/agent-core` 同源依赖**——四面共享同一内核包。架构文档「MMC 元虚拟不自建会话管理与执行内核」系旧口径（宿主桥定位时代），现势=MMC 亦消费 agent-core（src/agent-loop/ 目录在案）——用途形态分野（MMC=机制面 job 执行消费/RLC=完整 harness 消费含 session-store/tools/tui）未深探候勘。
LC 对（MLC↔RLC）目录高度同构（姐妹 fork 演化）：RLC 多执行层件（letter-store/session-store/skills/task-runtime/toolbus/tools/tui/tray），MLC 多机制件（notify 等）。「一致」=同内核包+同构骨架，**非同一份代码**——fork 后各自分野（TriMMC/MLC/TriRLC cron 行为分野在案勿互套）。

### 8.3 replaceExistingScope 实例（催办定时器场景）

COS 催办 job 每 30min 一轮，单轮扫描+催办可能超 30min。无顶替：12:00 轮未毕，12:30 轮又起→双扫描并发→同一目标误催两次+patrol-log 双写交错。有顶替：12:30 轮 spawn 带 `replaceExistingScope:true`+`scopeKey:'cos-patrol'`→旧轮被 cancel 只留最新——**适用判据=只要最新一轮结果、旧轮半途已无意义**（扫描/同步/刷新类）。反例=备份类长任务（顶掉=数据缺失），须用跳过不顶替。TriRLC shell-exec 实锚=固定 scope 未开顶替（agent 交互命令条条必完，正确选择）。

### 8.4 R 面 r-duty-cos dsh 现势（17:12 COS 权威读数·非卡住系保底条款）

B 系 12/13 毕（12 席 dsh 接位+claude 形退役全绿）；**r-duty-cos 值席 claude 形刻意压后在役**——「值席最后退」保底条款（dsh 设计 §2B-B3：全 12 席接位毕才退值席·班组零失守）。门序四锚 Ⅰ✓Ⅱ✓（GUI 三席 PASS）Ⅲ✓·唯余锚Ⅳ稳态候 COO 门序令；门序令达→末退复验→cos 席退→dsh cos 顶位→B 系全窗收口→全就位定谳。设计如此（宁后不退），非故障非卡点。

## 九·增补四（18:14 CEO 七连问）：形制优劣+四面补件盘点+维护形态定谳

### 9.1 问题 1a：openclaw 形隔离 agent vs claude code 多 session 员工组

| 维度 | 隔离 agent（daemon 托管·agent-core 路线） | claude code 多 session 员工组（M 面 13 席现役） |
| --- | --- | --- |
| 专属持久人格 | **配置级**：每 agent 独立 system prompt+auth-profile+模型选择，配置持久在 daemon 侧——人格与进程彻底解耦，重启即恢复，daemon 死人格配置还在 | **文件级+进程级**：五件套/agents 文件定义人格（持久），但运行上下文在进程内——恢复=新进程从 transcript 重建（尸体复活式），热态（未 compact 的会话流）不可跨进程 |
| 多轮长任务 | job 触发→接上次会话续跑（跨触发记性），长任务天然形态 | 长会话本身是强项：工具生态全（skills/MCP/插件）、auto-compact、交互式纠偏 |
| 无人值守周期任务 | **核心强项**：scheduler 触发+会话延续+结果投递（渠道）三件一体 | 需外挂 daemon（TriMLC 拍信+看门狗+tmux）拼装达成 |
| 施工力/通用任务面 | 薄（agent-core tools 118 行·判断力场景 6-8 件可控） | 全（Bash/Edit/Web/技能生态全家桶） |
| 成本形态 | idle 零 API·有事才推理 | 同为有事才调 API；idle 占进程内存位 |

一句话定位：**隔离 agent=值班员/管家形**（轻量常驻+周期任务+渠道触达）；**claude code 席组=工匠形**（重型通用施工+交互导向）。非替代关系，分层互补——正因如此 CEO 问题 4 的「harness 管席组施工+agent-core 管常驻管理」是自然分工而非二选一。

R 面彩蛋注：TriRMC src 实探有 **soul-loader**（人格装载器）目录——R 面自研引擎已在为人格类 agent 预留装载位。

### 9.2 问题 1b：每 job 独立持久会话 vs 单轮临时 session

| 维度 | 每 job 独立持久会话（openclaw isolated-agent 形） | 单轮临时 session+外部 state（TriRLC 现役形） |
| --- | --- | --- |
| 记性 | 跨触发上下文延续（job 有记性：「昨天巡到哪」） | 零记性——连续性靠外部 state 文件接力 |
| 上下文成本 | 会话膨胀管理成本（历史越长越贵越钝·需 reaper/压缩配套） | 每轮干净冷启·零膨胀·成本恒定 |
| 状态污染 | 长会话新旧混杂风险（正是受控压缩教义针对面） | 天然免疫——每轮全新 |
| 实现复杂度 | 高（会话生命周期管理+reaper+云同步） | 低（session-store 建了即弃） |

TriRLC 实证：**b2 案=单轮+外部 state 全周期闭环成功**（b2-state.json 持久化 lastActivityEpoch，每轮读文件恢复判断）——「无记性」用结构化 state 文件补，还躲开会话污染，且状态可审计可 diff。选择判据：任务需「连续记忆且状态难 JSON 化」→持久会话；状态可结构化外置→单轮+state 文件（简单干净可审计）。

### 9.3 问题 2：session reaper 四面分布（实探 10-17 18:0x）

| daemon | reaper | 依据 |
| --- | --- | --- |
| TriRLC | **有**（消费侧自持补回） | src/cron/session-reaper.ts |
| TriMLC | **有**（姐妹 fork 同补） | src/cron/session-reaper.ts |
| TriMMC | 无 | src/cron/ 五文件（command-handler/index/routes/service/week-math）无 reaper |
| TriRMC | 无 | src/cron/ 与 MMC 同构·无 reaper |

缺席合理性：MMC/RMC 的 cron=**机制面 job 执行**（周平面/账本），不托管 agent 会话——无会话即无僵尸可收，reaper 缺席系职责域使然非遗漏。

### 9.4 问题 3：power-follower/keepalive 四面分布

| daemon | 电源/唤醒面 |
| --- | --- |
| TriRLC | power-follower/power-keepalive（自持） |
| TriMLC | **最全**：power-keepalive.ts+power-monitor.ts+heartbeat/heartbeat-wake.ts+heartbeat-active-hours.ts——连 openclaw 被裁的「唤醒协调」件都自持补了 |
| TriMMC | 无 TS power 系（heartbeat/=Python 遗留面 checker.py 系·另一套） |
| TriRMC | 无 |

分布规律：**件的分布跟着宿主环境走**——MLC/RLC=本地桌面宿主（睡眠/断电真实存在→需电源面）；MMC/RMC=服务域宿主（sg 机/河源机 7×24→无电源面需求）。环境适配非遗漏。

### 9.5 问题 6：agent-core 维护形态现势——CEO 所述形态即现状

- **共有功能→agent-core 包统一维护**：loop/tools/permissions/scheduler/supervisor/spawn/contracts——真源 `TriCompany/packages/agent-core/`，四面 `file:` 依赖共享（改包四面立受·无版本化灰度；前提=同构布局 `../TriCompany/` 相对路径）。
- **特有功能→各 daemon 自持**：RLC=执行层全家桶（session-store/tools/tui/tray/task-runtime/skills/toolbus）；MLC=机制面+电源面+notify；MMC=机制面+comm/config-sync/mirror（+Python heartbeat 遗留面）；RMC=服务域全家桶（soul-loader/task-controller/tool-gater/policy-gate/orchestration/pipeline/context-builder 等）。
- 结论：**CEO 提议形态=现状已如此**，无需改造；候补的是**治理显性化**——哪些功能够格进包（≥2 面消费）/谁审收口，候治理条款随评估工单并表。

### 9.6 问题 4/5/7 执行记录

- **问题 4【派工】**：agent-core 迁移评估工单已立（agentcore-migration-assessment-brief-20261017.md），SendMessage 派四席（m-cto=技术架构+移植路径+harness 对比/m-cpo=产品定位+路线图/m-cos=治理流程+流转面/m-coo=运营面+成本节律），产出挂 10-18 12:00 评审并表。
- **问题 5【批令·列入】**：DEM-006 素材正式增补列入 10-18 评审——投递器可插拔化（信箱/localbus/TriPilot/IM adapter）+催办定时器试运行首日数据（4 催 4 闭环零误催一空催）+毕报流向盲区改进候选；知会 m-cpo。
- **问题 7【批令·执行】**：架构文档「MMC 不自建内核」旧口径勘正——主仓 docs/三元宇宙架构与模块说明.md TriMMC 行加现势勘正注（surgical 单文件 commit·留痕不改史）。

—— BOD 2026-10-17 18:15:54 +0800（date 现查·写前跑）

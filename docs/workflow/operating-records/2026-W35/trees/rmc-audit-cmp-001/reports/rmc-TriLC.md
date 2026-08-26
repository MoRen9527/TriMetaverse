# rmc-TriLC.md — AC-R3 审计报告

<!-- 编排预置落点位（stub）。TestEngineer 子实例：先 Read 本文件，再以 Edit 用完整审计报告替换「审计正文」占位段及其上方「待填」标记，保留一级标题与本节点头结构；完成后向编排回报路径+行数+分级计数。禁止改动本注释行以上内容。 -->

## 节点头

- 节点：rmc-audit-cmp-001 / AC-R3
- tick：20260826T131800Z
- 审计范围：/srv/fleet/TriLC/src/server/app.ts + /srv/fleet/TriLC/src/config/ 全部 + /srv/fleet/TriLC/src/cron/ 全部（daemon HTTP 面质量与安全）
- 实例角色：TestEngineer（fresh 派工，一次一节点，禁复用）

## 总体评估

daemon HTTP 面的功能完成度高（协议兼容层、init 链路、cron、会话管理齐备），但安全姿态系统性缺失：整个 HTTP 面（含 /v1/messages、/internal/v1/*、/shutdown 共 40+ 端点）自 createServer 回调（app.ts:1419）到 404 出口（app.ts:3777）没有任何认证/鉴权检查，仅靠绑定 127.0.0.1（app.ts:3801）与无 Host/Origin 校验并存——后者使 localhost-only 服务具备被浏览器 DNS rebinding 远程驱动的经典可达性。执行面上，POST /internal/v1/cron/jobs 接受任意 command 字段并最终经 `/bin/sh -c` / `cmd.exe /d /s /c` 原样执行（app.ts:3402-3405 → timer.ts:221-245），POST /internal/v1/mcp/servers/add 直接以请求体 spawn 子进程（app.ts:3703-3710），任务流默认以 bypassPermissions 运行已注册 shell_exec 的 agentLoop（app.ts:4079 + :3040 + :1314）——无认证控制面叠加这三条通道构成单一 P0。另有 cron 调度状态机一处必然触发的永久卡死缺陷、全端点请求体无上限、任务流内存泄漏与装饰性 cancel 等 8 项 P1。密钥加密（AES-256-GCM）因固定盐+全可枚举机器指纹派生密钥，防护强度实为混淆级。门禁建议：认证层、Host 校验、默认权限模式收紧、cron command 白名单四项落地前，不应在有不可信本机进程共存或浏览器同机的环境启用 daemon。

## 发现清单

### P0

**P0-1 全 HTTP 面零认证，且暴露三条任意命令执行通道（cron command / MCP add / 默认 bypass 任务流），无 Host 校验使 localhost 面可被 DNS rebinding 远程触达**

- 位置：`server/app.ts:1419-3777`（createServer 回调全程无任何认证检查）、`:3801`（listen 仅绑 127.0.0.1，无 Host/Origin 校验；1911、2314、3265、3519 等处直接信任 req.headers.host 构造 URL）；三条执行通道：`:3402-3405`（POST /internal/v1/cron/jobs 将请求体整体 spread 进 addJob，command 字段无白名单）→ `cron/timer.ts:221-222`（job.command 分流）+ `:234-245`（spawn('/bin/sh' 或 'cmd.exe', ['-c' 或 '/d /s /c', command]) 原样执行）；`:3691-3710`（POST /internal/v1/mcp/servers/add 把 body.command/args/env 直传 connectServer 启动子进程）；`:4079`（_defaultPermissionMode 缺省 'bypassPermissions'）+ `:3040`（tasks/stream 以该模式跑 agentLoop）+ `:1314`（start 时注册 shell_exec 工具）；另 `:3600-3612`（POST /shutdown 无条件 process.exit(0)）
- 问题：任何本机进程无需凭据即可：(a) 提交 cron job 让 daemon 代为执行任意 shell 命令（含定时持久化）；(b) 提交 task 由 agent 在 bypassPermissions 下跑 shell；(c) 注册任意 command 的 MCP server；(d) 读取全部会话内容（GET /internal/v1/sessions/{id}）、(e) 一键杀死 daemon。因服务无任何 Host/Origin 校验，同机浏览器访问恶意页面经 DNS rebinding 可跨源读写上述全部端点——远程网页可读会话内容并借 task/cron 通道在本机执行命令、经 SSE 拿回输出。
- 触发场景：本机低权恶意进程（如被投毒的 npm 包）直接 curl 即得；或用户浏览器访问挂毒页面触发 rebinding（无需任何本机落地）。
- 修复建议：共享 token 认证中间件覆盖包括 /shutdown 在内的全部端点；校验 Host 头 ∈ {127.0.0.1:port, localhost:port} 防 rebinding；_defaultPermissionMode 缺省从 bypassPermissions 改为 default；cron command 通道增加显式开关+白名单，MCP add 收紧为配置文件驱动。

### P1

**P1-1 cron job 执行中崩溃后 state='running' 永久卡死，调度与补跑双双跳过，且 API 无法复位**

- 位置：`cron/timer.ts:143`（执行前置 running 并持久化）、`:126`（onTimerTick 过滤 state==='running'）、`:290`（runMissedJobs 同样过滤）；`cron/service.ts:90-102`（start() 无 stale-running 复位）；`cron/store.ts:315-353`（updateJobRun 仅 COALESCE 式更新）；`cron/types.ts:52-58`（CronJobPatch 无 state 字段——即使想手动复位也没有通道）
- 问题与触发：daemon 在某 job 执行中被杀（Windows 宿主 schtasks 重启、断电、SIGKILL）后重启，该 job 因 state='running' 被周期 tick 和启动补跑同时排除，从此静默停摆，无任何告警；唯一恢复手段是删除重建 job。
- 建议：start()/runMissedJobs 将非刚启动窗口内的 running 视为 stale 并复位为 failed/idle 再参与补跑；或为 PATCH 增加 state 受控复位。

**P1-2 全部端点请求体无大小上限——单请求内存耗尽 DoS**

- 位置：`server/app.ts:1521-1525、2033-2037、2288-2292、2460-2464、2682-2685、2888-2892、3392-3394` 等（所有 POST handler 统一 `for await (const chunk of req) chunks.push(chunk)` 无上限聚合成 Buffer）
- 问题与触发：任一本机进程（结合 P0-1 甚至远程 rebinding 页面）发送数 GB body 即可撑爆 daemon 内存；无 Content-Length 预检、无流式限制。
- 建议：统一 body 读取工具函数，强制上限（如 10MB）并在超限时 413。

**P1-3 taskStreams 只增不删：已完成任务永驻内存，pending 任务永不执行也永不回收**

- 位置：`server/app.ts:2942`（tasks/submit 时 set）、全文无任何 `taskStreams.delete`；`:3001`（仅当 SSE 客户端连接 stream 端点才置 running 并开始执行）
- 问题与触发：daemon 长期运行内存无界增长；healthz 的 activeTasks（1427-1429）与 GET /internal/v1/sessions 列表（3280-3293）随之膨胀；客户端 submit 后从不连接 /stream 的任务永久滞留 pending。
- 建议：终态回调中 delete 条目 + pending 超时回收；或改为有界 LRU。

**P1-4 cancel 端点不中止实际执行——已取消任务继续消耗 LLM token 与工具执行直至自然结束**

- 位置：`server/app.ts:3228-3258`（cancel 仅置 entry.status='cancelled' 与 DB interrupted）；stream 执行循环 `:3026-3219` 从不检查 entry.status，构造 AgentLoopOptions（`:3033-3045`）未接 AbortSignal
- 问题与触发：用户取消后任务表面 cancelled，实际模型调用与 shell 工具仍在后台跑完（最长 25 turns），费用与副作用照常发生，状态与事实背离。
- 建议：AbortController 注入 agentLoop（agent-core 已支持 signal，见 loop.ts:374 abort 检查），cancel 时触发 abort 并在事件循环内短路。

**P1-5 密钥加密强度名不符实：固定编译期盐 + 全可枚举机器指纹派生 AES 密钥**

- 位置：`config/key-encryptor.ts:15-18`（FIXED_SALT 硬编码）、`:20-26`（fingerprint = hostname:username:platform:arch，全部可枚举/社工可获）、`:28-31`（PBKDF2 输入即上述低熵串）；文件头 ：6 宣称“拷贝到他机不可解密”
- 问题与触发：keys.json 泄漏后，攻击者离线穷举 hostname+username 组合（常见命名空间极小）即可还原密钥，GCM 随之破解——防护实为混淆级；且 `:52-54` isEncryptedFormat 以首字节 ≠ '{' 判密文，带 BOM 的明文会被误判为密文解密失败导致整份缓存丢弃（key-cache.ts:79-88、96-100）。
- 建议：接入 OS 级凭据库（Windows DPAPI / keytar），或至少引入随机盐+安装期生成的高熵 secret 存于用户侧受保护存储。

**P1-6 客户端工具按请求注册进全局注册表且永不注销——并发请求互相污染，工具跨会话泄漏**

- 位置：`server/app.ts:2073-2080`（/v1/messages）、`:2489-2494`（/chat/completions）每次请求 registerTool 到全局注册表，响应结束不 unregister；`toolNames` 收集后从未使用（:2072、:2488）
- 问题与触发：两个并发请求各注册同名工具时后者覆盖前者（前一会话的模型拿到后者的 placeholder 实现）；先前请求注册的工具对所有后续会话持续可见可调，叠加工具执行委托占位返回（:2074-2078 返回 "delegated to client"），模型会把假结果当真执行成功继续推理。
- 建议：注册表下沉到请求作用域（配合 AC-R2 P1-1 的注册表改造），或在请求 finally 中逆注册；占位结果应在 systemPrompt 明示协议避免误导。

**P1-7 interactive 权限桥为进程级全局单例——并发交互请求共享 pending prompt 与 always-allow 记忆**

- 位置：`server/app.ts:2062-2065`（beginInteractiveSession/endInteractiveSession 无会话作用域）、`:680-697`（askPermissionViaTui 读 isAlwaysAllowed / 写 rememberAlwaysAllow，均为模块级全局态）
- 问题与触发：两个并发 interactive 请求时，A 的权限 prompt 可能被 B 的 answer 端点调用（POST /internal/v1/interactions/answer 按 id 匹配尚可，但 pending 快照单槽）抢答；A 会话对 shell_exec 选 "always" 后，B 会话（乃至后续所有会话直至重启）自动放行——权限记忆跨信任边界泄漏。
- 建议：interaction 状态与会话 id 绑定；always-allow 增加作用域与过期。

**P1-8 多个异步端点缺顶层异常兜底——未捕获 rejection 可致 Node 进程终止或请求悬挂**

- 位置：`server/app.ts:2751-2795`（fork：`:2780` JSON.parse(m.toolCalls) 对损坏存量数据抛错无 try）、`:2801-2881`（recover 主流程 getSession/getMessages 抛错无捕获）、`:3561-3565`（update/check await 外部 handler 无兜底）
- 问题与触发：createServer 的 async 回调一旦 reject，Node ≥15 默认行为是终止整个进程（比单请求 500 严重得多）；即便配置宽容也是 socket 永不响应。fork 一个含损坏 toolCalls JSON 的历史会话即可触发。
- 建议：createServer 回调整体包 try/catch 兜底 500；fork 的 JSON.parse 单独容错跳过坏行。

### P2

**P2-1** permission_mode 请求字段透传任意字符串（`server/app.ts:4169-4176`）：拼错的模式不会报错而是让全部模式分支（decision-pipeline.ts:102/114/121/127）都不命中、落入 default-deny（:136-142），整个会话所有工具被拒且原因难排查；应白名单化并 400 拒绝未知值。

**P2-2** isLocal 判定为恒假死代码（`server/app.ts:1235`）：`!A || B && !A` 第二支永假；且 env 默认 trimcBaseUrl 恒非空（`config/env.ts:160`），TriMC 未配置时 ConnectionManager 仍以 degraded 起跳并向 localhost:8710 发心跳——local 模式形同虚设。

**P2-3** 代理转发不看状态码计健康（`server/app.ts:2341-2346`）：TriMC 返回 500 也调 recordSuccess，连接状态与真实可用性脱节。

**P2-4** 内部错误消息裸回客户端（`server/app.ts:1470、1483、1512、1625、1708、1753、1769、1882、2724、3411、3658` 等）：err.message 常含绝对路径/SQL 细节，信息泄漏面大；建议统一映射为错误码+受控 message。

**P2-5** 会话与任务 ID 可预测（`server/app.ts:2245、2630、2704、2915`；`cron/store.ts:208`）：Date.now()+4 位 base36，ID 即唯一凭证的 GET /internal/v1/sessions/{id} 可被局部遍历；本地-only 缓解但建议 randomUUID。

**P2-6** every 间隔转 cron 步进语义失真（`cron/scheduler.ts:28-40`）：everyMs=90min → round(1.5)=2h（少跑）；7min → `*/7` 在 ：56→:00 仅隔 4 分钟（密拍）；间隔型监控任务漏拍/密拍，应以真实 interval 定时器实现或文档声明量化误差。

**P2-7** 双层超时竞速泄漏计时器且不取消底层执行（`cron/timer.ts:273-282`）：race 输出的 setTimeout 从不 clearTimeout；超时后 executeCommand 分支靠自身 kill（:246-251）尚可，runHeartbeatAgent 分支底层循环无人取消继续跑。

**P2-8** executeCommand 输出无界累积（`cron/timer.ts:242-243、252-253`）：10 分钟超时窗内高频输出命令（如 cat 大文件循环）可耗尽 daemon 内存；应截断累计或改流式丢弃。

**P2-9** 手动 runJob 与调度 tick 共享一把锁（`cron/timer.ts:118-137、355-360`）：长任务执行期间 POST /internal/v1/cron/jobs/{id}/run 挂起最长 10 分钟+，且后续到期 job 的补跑被整体推迟；建议手动运行走独立并发通道或快速失败 409。

**P2-10** key-cache 目录推导硬编码反斜杠（`config/key-cache.ts:56、121`）：`lastIndexOf('\\')` 在 Linux/macOS 返回 -1 → `substring(0,-1)` 为空串 → 目录创建与 chmod 700 全部跳过；dataDir 不存在时 keys.json 写入 ENOENT（仅 console.error），密钥缓存在非 Windows 平台静默不可持久化。应统一用 path.dirname。

**P2-11** 日志泄密面：sanitizeKey 向日志暴露 API key 前 5 字符（`config/key-cache.ts:200-203`，:330、:375 打印完整 sanitized 映射）；cron 命令错误信息携带 stdout/stderr 各 500 字符入库并可经 /internal/v1/cron/log 读取（`cron/timer.ts:250、267`）。

**P2-12** session reaper 时间戳比较依赖存储格式（`cron/session-reaper.ts:17-21`）：updated_at 与 sqlite `datetime('now','-N days')` 产出的 'YYYY-MM-DD HH:MM:SS' 做字符串比较，若 session-store 落盘为 ISO 带 'T' 格式，边界日行因 'T'(0x54)>' '(0x20) 删除滞后一天；双端格式契约无校验。

**P2-13** trilc-profile 配置体系与实际门禁脱节（`config/trilc-profile.ts:65-76` 默认 development 且 enableDebugEndpoints=true；maxConcurrentLoops/sessionInactivityTimeoutMs 等字段在 app.ts 全程未被消费；debug 门禁实际走 env.debugMode，`server/app.ts:1839`）——存在“生产 profile 已加固”的虚假安全感，实为死配置。

**P2-14** contract-resolver 热重载非原子（`config/contract-resolver.ts:128-145` 逐条 contracts.set，reload 中途读取方见半新半旧集合）；fs.watch 的 error 事件无监听（:347-354），watcher 异常会冒泡为未捕获异常。

## 发现计数表

| 级别 | 计数 |
| --- | --- |
| P0 | 1 |
| P1 | 8 |
| P2 | 14 |

## 测试判断与门禁评估

- 测试判断：FAIL（当前不建议在除“完全可信单用户本机”以外的任何环境启用 daemon HTTP 面）。P0-1 属可被利用级（本机横向 + DNS rebinding 远程两条路径），P1-1 属长期运行必然触发的调度静默死亡。
- 覆盖缺口说明：本次为静态逐行审计，未做动态利用验证（未实际发起 rebinding/命令注入 PoC）；跨仓行为仅定点核验了 agent-core 的 permissionMode 缺省（loop.ts:344-350）与决策管线模式分派/default-deny（decision-pipeline.ts:95-142），其余 agent-core 缺陷以 AC-R2 报告为准不在本报告重复计数。interactions.js、mcp-tool.js、session-store 等被调用方不在本次范围，其内部缺陷（若有）未计入。
- 使用依据：本报告全部结论基于上列 13 个范围内文件的完整 Read 证据（行号可复核），外加 3 个 agent-core 文件的定点核验 Read；未引用任何二手测试结论。

## 覆盖清单

| 文件 | 完整 Read | 备注 |
| --- | --- | --- |
| /srv/fleet/TriLC/src/server/app.ts | 是 | 4474 行，分 1-2045 / 2046-3345 / 3346-4474 三页连续读完 |
| /srv/fleet/TriLC/src/config/trilc-profile.ts | 是 | 77 行 |
| /srv/fleet/TriLC/src/config/key-encryptor.ts | 是 | 63 行 |
| /srv/fleet/TriLC/src/config/contract-resolver.ts | 是 | 379 行 |
| /srv/fleet/TriLC/src/config/env.ts | 是 | 174 行 |
| /srv/fleet/TriLC/src/config/key-cache.ts | 是 | 399 行 |
| /srv/fleet/TriLC/src/cron/service.ts | 是 | 169 行 |
| /srv/fleet/TriLC/src/cron/index.ts | 是 | 39 行 |
| /srv/fleet/TriLC/src/cron/session-reaper.ts | 是 | 82 行 |
| /srv/fleet/TriLC/src/cron/store.ts | 是 | 414 行 |
| /srv/fleet/TriLC/src/cron/types.ts | 是 | 77 行 |
| /srv/fleet/TriLC/src/cron/scheduler.ts | 是 | 67 行 |
| /srv/fleet/TriLC/src/cron/timer.ts | 是 | 361 行 |

范围外定点核验（仅为定级准确性，不计入发现）：/srv/fleet/TriCompany/packages/agent-core/src/loop.ts:330-374、permissions-engine/index.ts（全文）、permissions-engine/decision-pipeline.ts:95-225 及 230-439。

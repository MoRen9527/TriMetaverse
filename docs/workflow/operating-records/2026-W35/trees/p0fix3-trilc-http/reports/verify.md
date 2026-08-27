# p0fix3-trilc-http 验证记录（verify.md）

- 节点：p0fix3-trilc-http / PD-T
- 角色：TestEngineer（小柯），fresh 派工，一次一节点（tick 20260827T074800Z）
- 审计真源：`docs/workflow/operating-records/2026-W35/trees/rmc-audit-cmp-001/reports/rmc-TriLC.md` P0-1（发现清单第 8 条＝审计 P0 唯一项）
- 修复承载：TriLC dev=26720dd（ba32bc7..26720dd，PD-1 已 done + sg 线 push 实测一次过）
- 复核方式：无 Bash/Write 工具面 fresh TestEngineer 实例——Read 通读 PD-1 全部修复区与既有测试真源 → Edit 落盘两套对抗守护套件共 **59 例**（通道一/二单元 26 例＋端到端 15 例；通道三单元 9 例＋端到端 9 例）→ 本报告六节。**全部用例未经运行**，终值以编排层按 §2 等价口径重开门禁实测为准；推演置信低点已在使用例旁以「推演待实证」注释显式标注（§4⑦清点）。

## 1. P0-1 三通道逐项核验（修复位置 × 审计向量 × 守护用例）

file:line 以 `/srv/fleet/TriLC/src/server/app.ts` 为根，行号来自本实例 Read 输出（工作树 HEAD=26720dd 面）。

### 通道一 X-Internal-Token 全局认证门 fail-closed — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | 单元层导出 `extractInternalToken` :110-119（x-internal-token 直头/数组取首/Bearer 兜底双路）、`timingSafeStringEquals` :121-131（常数时间比较含长度不等哑比较抹平耗时特征）；回调内全局门 :1609-1624——token 请求期读 env 不做启动缓存（:1612 明文注释），未配置 ⇒ 401 `{error:'internal_auth_disabled'}`（:1614-1617），配置态缺头/错头 ⇒ 401 `{error:'unauthorized: missing or invalid X-Internal-Token'}`（:1619-1623）与 disabled 态可区分 |
| 覆盖顺序 | /healthz 精确豁免 ：1548 先于全局门＝门前公开面唯一入口；门内次序 Host(:1593) → Origin(:1600) → token(:1609) |
| 审计向量复现→被拒 | 「任何本机进程无需凭据 curl 即得全面」→ e3/e15 死证漏配即全拒且未配置态连头比对都不发生（无残余旁路）；「一键杀 daemon（POST /shutdown 无条件 exit）」「读取全部会话内容」两类向量随全局门一并封口；两态可区分（e4/e5 unauthorized 精确文案 ≠ internal_auth_disabled） |
| 正向锚 | e6 x-internal-token 正确形态、e7 Bearer 兜底正确形态 → 200 业务层真实可达（防修复反向过度收紧破坏可用性） |
| 与参照差异声明 | TriMC trimc-auth 参照为「token 未配置即放行」fail-open 变体，本面按要求故意反转 fail-closed（log.md #4 语义差异在案）；未被授权改动调用面三项（CLI/TriPilot/.env 运行态）如实移交 §3①② |

### 通道二 Host/Origin 校验拒 DNS rebinding — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | `collectHostAllowEntries` :164-180（回环三形 localhost/127.0.0.1/[::1] 各带端口整串 full 模式 ＋ TRILC_HOST_ALLOWLIST 逗号分隔追加：含端口或 `[` 开头 ⇒ full、其余 hostname 模式；每次判定重建非启动快照）；canonicalAuthority/splitCanonicalHost :140-158（trim＋小写＋IPv6 括号剥离两端同规防形态绕过；仅唯一冒号后随纯数字作 host:port 切分，多冒号 IPv6 整体当 hostname）；`hostHeaderAllowed` :195-199 缺失/空白保守拒；`originHeaderAllowed` :201-214 仅调用方对非 null 强制（:1601-1603）、解析失败保守拒；Host 门 →403 forbidden_host 先于 Origin 门 →403 forbidden_origin 先于 token 门 |
| 审计向量复现→被拒 | 「同机浏览器访问恶意页面经 DNS rebinding 可跨源读写全部端点」→ e8 无 Host 死拒、e9 伪造外域 Host 即便带正确 token 也先撞 403 forbidden_host、e10 外域 Origin 即便无 token 也先得 403 forbidden_origin（门序互锁死证）、w5 三类无端口回环形态不放行 |
| 运行中注入能力 | e13 hostname 条目注入生效、e14 含端口条目整串口径（同 host 异端口仍拒）在真实连接上复现 w6/w7 单元语义 |

### 通道三 cron command 白名单化双入口 ＋ MCP add 显式开关 — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | POST `/internal/v1/cron/jobs` :3557-3573（JSON 解析后、addJob 前 ：3569 拦截 →403 `{ok:false,error:'command_not_allowed'}`）；PATCH 同径/{id} :3604-3628（id 正则与 JSON 解析后、updateJob 前 ：3624 同形拦截——PATCH 可改 command 字段的 P0 重放向量收口）；`cronCommandHttpAllowed` :216-228（TRILC_CRON_COMMAND_ALLOWLIST 逗号分隔精确等值、条目与命令两侧 trim、缺省空集全拒、不携带 command 的 heartbeat/systemPrompt 型 job 不受影响、timer.ts 执行层不动＝本地原生创建路径行为保持）；MCP add :3869-3878 未置 TRILC_MCP_RUNTIME_ADD='1'/'true' ⇒ 403 `{error:'mcp_runtime_add_disabled'}`（错误体刻意无 ok 字段） |
| 审计向量复现→被拒 | 「提交 cron job 让 daemon 代执行任意 shell（含定时持久化）」→ g1 POST 白名单外全形状钉死、g2 PATCH 白名单外且不存在 id 得 403≠not_found（拦截位先于 updateJob 死证）×g3 对照组同 id 不携带 command 得 404（证明拦 selective 自 command 门）；「注册任意 command 的 MCP server」→ g7 缺省 403 形状级 pin、g9 字面量外 'TRUE'/'yes'/'0' 三变体全拒 |
| 正向锚与豁免锚 | g5 注入 allowlist 后真实落库 201（引擎可用性未破坏）、g6 空 allowlist 下不带 command 的 systemPrompt 型 job 201 通过（豁免口径端到端死证） |

## 2. 门禁命令形态与环境事实

- **解释器选择事实**：默认系统 node v18.20.8 缺 node:sqlite（模块需 ≥22.5）⇒ 首跑 **295 tests / 243 pass / 52 fail** 全环境性（round0-node18.tap 留档，只作解释器选型依据非比对基线）；gate-runner 内建用户级解释器选择器启用 `~/.local/opt/node-v22.14.0-linux-x64`（GATE_NODE_BIN 可覆盖）后重定权威基线。
- **权威比对基线** = round0-node22.tap：**451 tests / 443 pass / 8 fail**，失败集五项＝init-confirm runConfirmCheck+runConfirm×2、project-link validateLinkPayload×1、tools-ctx-cwd×2、tui/components 文件级（HS-3 登记 tui debt 8 子债归并计数）——与本节点新套件无关的预置债务，对抗套件零触碰。
- **等价门禁口径**：package.json test=`node --import tsx --test test/**/*.test.ts` glob 形态；等价运行采 reports/enum-tests.txt 显式枚举＝**42 文件**（原枚举 40 ＋ 本树新增 PD-T 对抗锚 auth-gate-rejection.test.ts 与 cron-mcp-entry-guard.test.ts，均落 test/server/ 二级目录自然落入展开面）；src/project 两 *.test.ts 不在 npm script glob 意图内不入门禁（如实记录）。node_modules 在位实测免 npm install 先行。
- **tsc 口径**：`npm run check` 的 tsconfig include 仅 src/** ⇒ 测试面不进 tsc 门禁，本节点两套件类型正确性不在 check 覆盖范围（如实申报；tsx 运行期不做类型检查，类型正确性自负并列入 §4 推演复核）。
- **门序事实**：基线不含本节点两锚（锚落盘晚于 pc1-round1/round2），故重开门禁预期总盘 451+59≈**510 例**；判定法沿用 p0fix2 固化纪律＝**对 round0-node22 失败集差分而非数绝对失败个数**，新增失败集必须为空。**终值（编排层回填实测）**：pdT-round1 首轮 **510 tests / 501 pass / 9 fail**——对基线差分唯一新增翻红=e8（无 Host 的 HTTP/1.1 实由 llhttp 解析器层先回 400、不到达应用层门，400≠403 断言失败；安全性质无损、拒绝层级归属需分辨）；经 SendMessage 续接同实例把 e8 改钉实测双层口径后 **pdT-round2 / round3 连续两轮隔离 510 tests / 502 pass / 8 fail，失败集与 round0-node22 基线逐字同型（grep not ok 六行比对在案）＝新增失败集为空定谳**；新套件 59 例全绿（58 例首轮命中+e8 修钉后二次命中）。
- **TAP 存档 label 清单**（reports/gate-logs/）：

| label | 内容 | 结果 |
| --- | --- | --- |
| round0-node18 | 解释器选型依据轮（环境性失败非比对用） | 295/243/52 exit≠0 |
| round0-node22 | 权威比对基线 | 451/443/8 |
| pc1-round1 | PD-1 修复后首轮隔离 | 451/443/8 失败集与基线逐字同型 |
| pc1-round2 | 连续第二轮隔离复测 | 同上零新增失败定谳 |
| pdT-round1 | 两套件落盘后首轮 | 510/501/9（唯一增差=e8 解析器层级归属，已返工） |
| pdT-round2 | e8 修钉后隔离轮一 | 510/502/8 失败集与基线逐字同型 |
| pdT-round3 | e8 修钉后隔离轮二（连续稳态） | 同上零新增失败定谳 |

- npm run check 在 PD-1 面已 clean（tsc strict 零错误）；PD-T 只增测试不改 src——**编排层补证：PDT 落盘后复查 npm run check 干净维持**（08:53Z 实测）。

## 3. 残差清单（如实收录，按归属移交）

1. **CLI stop 的 /shutdown 被 401 门拦**（CTO/后续批次）：POST /shutdown 属全局门射程＝设计意图（原来无条件 process.exit 是审计主向量之一），代价是既有 CLI stop 若不携 token 将收 401；需后续批次给 CLI 注入 TRILC_INTERNAL_TOKEN（读同一 env）方可恢复带认证的停机链路。PD-1 波及调用面披露承接项之首。
2. **TriPilot 等宿主直连方需配 token**（产品集成面知悉）：直连 daemon 的外部宿主须持 TRILC_INTERNAL_TOKEN 并选择 x-internal-token 头或 Authorization: Bearer 兜底任一形态；否则全面 401 internal_auth_disabled/unauthorized。e7 已实证 Bearer 通道可用作迁移路径。
3. **bypassPermissions 缺省不改属计划两步走**（CTO 安全批次排期）：审计修复建议四项中的第 3 项（_defaultPermissionMode 缺省 'bypassPermissions' :4079 收紧）明确不入本树范围，避让 heyuan 生产任务流链路；通道(b) 任务流 RCE 向量的最终收敛留待后续批次，不在本轮守护范围（§4 表末行同口径登记）。
4. **/healthz 带 query 不豁免**（调用方知悉）：豁免判定是 `req.url === '/healthz'` 字面精确匹配，'/healthz?probe=1' 会落入全局门（token 缺失即 401）；改 healthz 判定为宽松前缀属后续可选优化，现状由 e2 防回归锚固化。
5. **完全无 Host 形态即拒（层级归属实测修正）**（自研工具知悉）：不补 Host 头的 HTTP/1.1 裸请求由 node llhttp 解析器严格模式在**协议层先回 400**、根本不到达应用层门（pdT-round1 实测，e8 由此返工）；应用层 `forbidden_host` 403 门覆盖的是「Host 存在但不在允许集」路径（e9/e14 死证）。fail-closed 性质不变：两类形态都收不到业务响应。curl/python/常规 HTTP 客户端自动带 Host 故正常调用面无感。
6. **GitHub 双端单 remote 形态**（授权侧同步窗口）：TriLC 仓内仅 origin=/srv/git/TriLC.git 单 remote 且裸仓 remote -v 空＝无自动同步链路；计划文档 §42「GitHub 分支＝sg 线」同体承诺下，GitHub 远端同步窗口移交授权侧执行（log.md #6 与 state.json push.triLCGitHub 在案，与 p0fix2 树 push 凭据残差同型归属口径）。
7. **部署知悉义务**（heyuan trilc-headless 重启窗口操作者）：升级重启前必须先预配 TRILC_INTERNAL_TOKEN，否则管理面全面 fail-closed（healthz 之外全拒，含 CLI stop）＝有可用性感知的失败而非静默半死；另 .env 文件改动只经进程启动装填生效，token 运行中轮换须走进程环境变更路径（dotenv 启动语义既定，非本次 diff 引入）。

## 4. PD-T 对抗套件设计与零覆盖分支清点表

**设计总览**：59 例 / 8 describe / 两文件。分层纪律＝纯函数单元直测钉实现契约、createTriLCApp 真起服钉连接级行为与门序内涵（裸 node:http 请求避开 fetch forbidden-header 限制以构造伪造/缺失 Host、恒附正确 token 以隔离通道一/二聚焦通道三）；对照组设计贯穿（g2×g3、e2×e1、e11×e10）使每条拒绝断言都有辨伪力而非碰运气断言。

| 分支（app.ts 除非注明） | 覆盖所有者 | 用例 |
| --- | --- | --- |
| extractInternalToken 直头字符串支 | 本套件 | u-e1 |
| 数组取首支／首元素非 string 防御支 | 本套件 | u-e2／u-e7 |
| 直头空串 typeof-string 支（不作空折叠） | 本套件 | u-e8 |
| Bearer 兜底支／方案大小写敏感边界 | 本套件 | u-e4＋e7／u-e5 |
| timingSafeStringEquals 等长真假支（UTF8 字节面） | 本套件 | u-t1/u-t4、u-t2/u-t5 |
| 长度不等哑比较支 | 本套件 | u-t3 |
| canonicalAuthority 括号剥离与小写归一 | 本套件 | w2/w3/w5/w6/w7＋u-h0 |
| splitCanonicalHost 唯一冒号切分／多冒号不切分 | 本套件 | w4/w6/w7／w5(裸 ::1 当 hostname) |
| collectHostAllowEntries 回环三形/env 追加分类正则双支/空段剔除 | 本套件 | u-h0／u-h1 |
| hostHeaderAllowed 缺失空白早退 | 本套件＋e2e | w1＋e8 |
| Host 候选命中/未命中（整串 vs hostname 双模式） | 本套件＋e2e | w2-w7＋e9/e13/e14 |
| originHeaderAllowed null 族大小写直通/解析失败保守拒/无 host 拒/子域不吞噬 | 本套件＋e2e | v1/v4/v3＋e11/e12 |
| healthz 精确匹配支（query 变体走门） | 本套件 | e1×e2 对照 |
| Origin 调用方仅非 null 强制支（:1601-1603） | 本套件 | e10-e12 组 |
| token 未配置早退支（含错头也不比对） | 本套件 | e3＋e15 |
| 配置态 mismatch 早退支 | 本套件 | e4/e5 |
| timingSafe 在门内真值接线（正向可用性） | 本套件 | e6/e7 |
| cronCommandHttpAllowed 非 string 支/空白支/空集支/条目 trim/命令对称 trim/大小写不折叠/无前缀通配 | 本套件 | c3/g6、c2、c1/c9/g1-g4、c5、c6、c7、c8 |
| POST 入口拦截位先于 addJob | 本套件 | g1×g5 正反对照 |
| PATCH 入口拦截位先于 updateJob（gate-before-lookup） | 本套件 | g2×g3 对照 |
| PATCH JSON 解析工序先于白名单 | 本套件 | g4 |
| MCP flag 缺省禁用支/字面量外支/'true' 放行支 | 本套件 | g7、g9、g8 |
| timer.ts 执行层（本地原生 job 行为保持，射程外） | 显式不在本套件 | ——（PD-1 范围声明一致） |

**半覆盖与零覆盖披露**：① PATCH 带 allowlist 的正向更新成功形状（200 落库）未建——拒绝位已被 g2×g3 辨伪钉死，PATCH 成功路径属既有行为非本次 diff 新增分支，记录备查不动手扩面；② crypto.timingSafeEqual 内部字节级行为零直测（黑盒经 helper 断言覆盖）；③ chunked 多包聚合极端形态未单独构造（node 客户端默认单写，服务端聚合循环 ：3559/:3615 为既有共享代码路径）；④ 同键 env 高并发竞争态不在单线程顺序套件射程。

**诚实声明（含实测终局）**：以上 59 例均为本 fresh PD-T 实例仅经 Read/Edit 落盘的静态推演产物，落盘时全部未经运行；重开门禁实测兑现＝**58 例首轮命中，唯一增差 e8 经编排层回报根因（llhttp 协议层 400 先于应用层门）后同实例返工修钉，pdT-round2/round3 连续两轮隔离全绿**。预期总盘 510 例与实测总盘逐字一致。

**推演复核结论（实测闭环）**：静态推演可达性自查逐条成立——每一 e2e 用例的门入口路由匹配、门序先后、错误体文案均可在上文标注的行号区间内逐字溯源；全部 deepEqual 断言的键集与值都直接誊自实现原文，杜绝臆造形状。四处「推演待实证」标注实测处置终局：①**e8 命中且方向判断准确**——拒绝语义成立，层级归属需实测定谳＝llhttp 协议层 400 先拒（非「上游解析器行为变化」的对抗性警讯，而是本例预登记的中高置信点按实测兑现；返工改钉双层口径）；②e6 GET 业务层就绪形状首轮命中实证；③g5/g6 的 201 存储契约首轮命中实证；④g8 零 MCP 连接副作用首轮命中实证。处置纪律已按约执行：pdT-round1 翻红当轮上报编排层定位根因，未静默跳过或改弱断言（e8 断言改为钉死实测 status===400 并同步测试名/注释/文件头契约表三处一致性），账面对照一律做 round0-node22 失败集差分。

## 5. 结论判定

**PASS（pdT-round2/round3 实测背书翻转）——PD-1 三通道修复代码面核验成立（行号级对照审计向量逐一收口），重开门禁 510 tests / 502 pass / 8 fail 连续两轮隔离失败集与 round0-node22 基线逐字同型＝新增失败集为空；本节点 59 例守护用例全绿（58 例首轮命中＋e8 返工修钉后稳定两轮）；npm run check 干净维持。**

前置条件核销记录（原三项全部兑现）：

1. ~~编排层重开门禁~~ **已兑现**：510/502/8×2 轮（pdT-round2/round3），失败集与基线逐字同型（§2 终值与 TAP 表）；唯一返工项 e8 已闭环；
2. §3①②③⑥ 四项移交按归属推进不阻塞本树翻转——树顶层 status=done 已随本文件同轮落盘，同步窗口与 CLI/宿主适配各自进后续批次台账；
3. §3⑦ 运维知悉义务在案：heyuan 人工重启窗口前先预配 TRILC_INTERNAL_TOKEN，空配置下管理面全拒为既定 fail-closed 代价。

## 6. 使用依据

- 审计真源：rmc-audit-cmp-001/reports/rmc-TriLC.md（P0-1 原文 file:line、触发场景、修复建议）
- 修复产物定点读源（HEAD=26720dd 工作树）：src/server/app.ts（六导出 :104-228、healthz/全局门 :1495-1650、cron POST/PATCH 入口 :3550-3650、MCP add :3845-3910）；src/cron/service.ts（addJob 透传 :113-118）、src/cron/store.ts（addJob 存储契约 :207-232）
- 回归先例读源：test/server/qa-json-runtime-stub.test.ts 与 test/server/tasks-submit-weekly-hint.test.ts（起服配方/SAVED_ENV 纪律/token 附头做法，本 tick 两文件被 PD-1 补齐 token 对齐的事实亦经 Read 实证）；姊妹树参考结构 p0fix2-trirmc-service/.../internal-auth-failclosed.test.ts 与其 verify.md 六节骨架
- 门禁与工程口径：TriLC package.json（test script/check/engines）、tsconfig.json（include 仅 src/**）、reports/enum-tests.txt（42 文件全枚举）、reports/gate-runner.mjs 与 gate-logs/ 各轮存档归编排层所有（本轮只读引用其数值）
- 编排层移交证据：state.json（baseline.targetSignaturesVerified/preExistingFailureBaseline/nodes.PD-1.verdictNote/push 三端终值）、log.md（勘察、node18 首跑 52 fail 与 node22 权威基线、26720dd 提交与 sg 线 push、GitHub 双端探明）
- 测试判断三分法：CTO 工程门禁框架内 CONDITIONAL_PASS 判定＋PASS 翻转条件与运维知悉义务显式化

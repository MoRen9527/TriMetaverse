# STE 测试方案·P2 期（TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P2-EXEC-01·测试面）

- sourceOfTruth: 本件=STE P2 测试规划正身（承接 COO 拆派 BOD 11a52dbf/CEO 02:44 令）
- syncMode: static
- lastSyncedAt: 2026-09-28T18:5xZ（date 现查=2026-09-29 02:5x +0800）
- 施工席: STE 小柯（m-ste）；对表基座=P2 执行单 §一范围/§二锚 A1-A6/§三边界/LG-035 渲染验证门家族纪律

## 一、时点约束（CEO 改口令硬约束入卷）

- **A1+A5 执行时点=「TriModel 两域两面都改完再测」**（CEO 09-28 22:55 改口令）——非 UI 骨架一落位即测；即 P1+P2 全部落位后方启 A1 手测与 A5 全量。
- A4 渲染验证门=整体验收候 P1 收口后连续执行（单 §三）；手测面候正常工时（非作者手测需席在岗，不夜窗）。
- A2 断链态基料=COO 在 P1 sg 接入**切换前后**各留 UI/台账实照（候件，禁 mock 顶替）。

## 二、逐锚测试化（A1-A6）

### A1 四卡选项卡渲染+单页配置切换活体（非作者手测）

- **U1** 选项卡矩阵：四卡（mmc/mlc/rmc/rlc）tab 逐一点击×切换往返（4×3 路径对）——每卡渲染正确性+切换零残影（上卡 DOM 零残留断言）；判据=每卡卡面内容与 face 语义对表（mmc≠mlc 卡面内容串卡=FAIL）。
- **U2** 单页配置表单活体：各卡表单读写+保存+reload 保持（第四型完整周期照 LG-058 P0 W 族教训——保存动作/持久断言/周期完整三面都要真跑）。
- **U3** 特有差异面：各卡特有字段/动作面呈现与 CPO IA 方案对表。
- 手测纪律：非作者（本席未参与 FSD 实现）；灰度前三遍走查（LG-035）；走查快照泄敏感输入框防——api_key 输入框掩码面核（快照/截图内禁明文 key）。

#### A1 STE 独立手测读数·第一段（2026-09-29 10:3x-11:0x+0800，活体 3333/ui，HEAD=995c2f7+dist/ui 今晨构建；CTO 门审 dcbaa3b4 技术侧 PASS 后像素级面）

**U1 选项卡矩阵（独立 Playwright 走查脚本 /d/tmp/lg058/a1-u1-walkthrough.mjs，非抄 FSD 门族逻辑）**：

- 菜单 7 项渲染 ✓：当前生效（默认 active）/TriMLC·本机/TriRLC·本机/TriMMC·sg/TriRMC·河源/TriModel 策略卡/连接配置。
- 四卡逐一点击 ✓：每卡单面板可见（vis=[panel-card-{face}] 唯一），零多显。
- **切换往返 12 路径对全过 ✓ 零残影**（上卡 DOM 零残留断言；4×3 全对）。
- active 态一致 ✓（点击 mlc 后 .menu-btn.active 唯一=「TriMLC · 本机」）。
- console 零错误 ✓（console+pageerror 双监听）。
- **face 语义对表零串卡 ✓**：四卡副标/拉取源/特有面各不相同且语义正确——mlc=M 面·本地域·本机 8713／rlc=R 面·本地域·本机 8711（**寄居过渡**如实）／mmc=M 面·服务域·sg 8710（**8460 代理**如实）／rmc=R 面·服务域·河源 8712（**同机过渡位 3333+独立位候迁**如实）。

**U3 特有差异面走读 ✓（四卡特有面全呈现，候选区诚实非假按钮）**：

- mlc 卡特有：模板切换实按钮（本机 Claude Code settings 写入面/目的地模板/API 密钥/独立钥匙文件注入/预览变更/备份清单）——四卡唯一全功能卡（现役需求面）。
- rmc 卡特有：周平面迁移 cron 关联+域锚约束（卡密文域=创建机+用户，禁跨机复制——**A4 语义入 UI**）；CLI 对照行 `trirmc config pull|show|verify|cache`。
- mmc 卡特有：写入路由面（sg 模型写入走连接配置页 sg 栏+「前往连接配置」跨页导航）；LG-035 策略卡过渡位注记（trimmc-card.json）；CLI 对照行 `trimmc config` 族。
- rlc 卡特有：daemon 健康=8711 /healthz（态候接线）+寄居过渡形态说明；模板切换=候建态（与 mlc 实按钮差异化呈现）。
- **A3 矩阵 UI 侧对照行发现**：每卡「CLI 对照」区直书四面命令（页面上能做的事，命令行同样能做）——§5.2 底表的 UI 呈现面，与本席 CLI 半边矩阵合卷对表基座 ✓。
- 候建区诚实：rmc/rlc/mmc 的模板切换与备份回滚=「候建——入口随后续批次开通」文字态，非假按钮 ✓。
- 降级梯语义入 UI ✓：每卡「不可用时」区=降级链说明（自动用最近一次拉取缓存→再退出厂默认→服务恢复自动回卡面配置；写面拒绝如实提示稍后重试——§4.3 的 UI 呈现）。

**U2 连接态（第一段读数+候件面）**：

- 连接守卫人话 ✓：仅填 API 令牌点连接→「请填入 API 令牌与管理令牌」人话提示（守卫不落 localStorage）。
- S3 首启链源码在位 ✓：boot() 读 localStorage→有令牌拉数据→无令牌禁用+引导展开（源码注释直书）；renderConnState 三态渲染（idle 未连接/warn 缺少管理令牌（卡片功能不可用）/ok 已连接）。
- token 持久面：API 令牌自 channel cmd 就地提取（len-only 64 chars 值 withheld）填入；本席单 token 实跑未过守卫故 localStorage 未落——reload 回 idle 系正常渲染非缺陷。
- **候件：admin 管理令牌通道**——无凭据探测活体 server=401（**写面已启用实锤**，非 503 fail-closed disabled）；四面卡数据（managed 视图）全部需 admin 令牌（loadFaceCards 源码面），四卡在役态呈现核验（S1 对表）+真连接态 reload 保持链候 admin 通道到位后补跑（通道候 FSD/BOD 供，凭据分发面不擅掘同 F-1 ② 先例）。
- 诚实三态徽标源码面 ✓：faceBadge 注释直书三态=「已生效（在役）/待应用·失败（降级）/未配置·读取失败（断链候选，如实）」——A2 的 UI 呈现语义源码级在位。
- S6 人话映射 ✓：503→「管理写面未启用：请先在服务端配置管理令牌」/401→「令牌不正确或未填写」——零 HTTP 码/env 名入用户面。

**G1 全量读数·第一轮（无 UI_E2E env 基线，后台同构 npm test）**：

- **324 tests / 309 pass / 0 fail / 15 skipped / EXIT=0**（duration 249s≈4min09s——CTO 夜跑 7min 超时留白日兑现，白日无超时）。
- 与 P1 基线（324/309/0/15）零漂移 ✓ 与 FSD P2 完工卷读数同 ✓——G1 独立复现毕。
- 第二轮带 env 复跑（TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1，e9/e10/e12 真跑）在途候读数（CTO 已定性 10 挂=旧案结构漂移；本席复跑=独立确认同族读数+FSD 修案前基线留痕）。

**走查快照掩码面核（G3 前置）**：四卡截图（a1-shot-{face}.png）布局证据落 /d/tmp/lg058/——API 密钥输入框=placeholder 形态零明文 ✓；截图不入 git（含页面文本快照敏感面防）。

**A1 第一段结论**：U1/U3 本席独立复验 PASS（与 CTO 技术侧 PASS 互补不重复——本席=像素级走查+零残影断言+特有面语义）；U2 连接态深面候 admin 通道（候件不虚验）；发现零阻塞项。

#### A1/U2.2+S1 连接态深验读数（2026-09-29 11:1x+0800，admin 供料到位后即启；a1-u2b-managed-walkthrough.mjs 独立脚本）

**通道前置（T4 翻转）**：FSD 供料 TRIMODEL_ADMIN_TOKEN（落点 TriModel/.env，法面交付值零出机，COO len-only 复核一致）——curl `view=managed` Bearer admin → **200，四面全通**。双层三态全谱自此收口：T1 无凭据 managed→401 / T2 API_TOKEN managed→401（错误族拒）/ T3 API_TOKEN pull→200 / T4 ADMIN_TOKEN managed→200（四面）。FSD 择②理由备查（channel cmd=TriMLC 启动环境只载 TriMLC 消费键，admin 键入=跨 daemon 语义污染+真源分叉第二落点——TriModel .env 唯一真源）。

**U2.2 连接态真链路深验 ✓（全绿）**：

- **双 token 连接动作**：API 框+管理令牌框双填→conn-save→**conn-dot=ok** ✓（守卫双填语义活体复证）。
- **managed 拉取真请求实发 ×4**：page request 监听捕获 `/v1/config/cards/{face}?view=managed` 四发——**真浏览器→真 server→admin 头→managed 端点→四卡渲染全链活体实证**（R3 缺口的 UI↔server 真链路人工验证面就此补上；自动化守卫仍候件C，CTO 裁缓解≠达标口径维持）。
- **S1 对表 ✓**：UI 四卡 badge vs 后端 curl 基线逐卡一致——mmc badge=**待应用**↔后端 card_file_present:true；mlc/rmc/rlc badge=**未配置**↔后端 card_file_present:false×3（缺席→未配置徽标映射活体正确；后端 state 字段=null，badge 判定基于 present+state 组合语义，映射自洽）；四面 face 回显正确+ledger 面在（hasLedger:true×4）。
- **拉取动作真实性**：四面「上次拉取」时戳=本窗连接动作触发时刻（02:56-03:01Z 实拉），非陈旧缓存 ✓；拉取源特有描述四面各异如实（mmc=sg 出面走 8460 代理/mlc=keys 分发面/rmc=同机过渡位候迁注/rlc=寄居过渡）——与 U3 特有面走读同向。
- **reload 保持链全绿（第四型 managed 面人工验证 ✓）**：reload→conn-dot 仍 ok+四卡 badge 复读同值（待应用/未配置×3）——localStorage 双 token 保持+boot 链自动重拉+三态徽标复现全周期通。**注**：此=第四型（跨刷新持久）真链路活体面，CTO 裁件A（e12 修案）为自动化守卫位，本席人工面先行实证不替代。
- console 零错 ✓；截图 8 张（-managed 后缀）本地保留掩码面照旧。

### A2 诚实三态呈现核验（在役/降级/断链）

- **S1** 在役态：后台 card 正常态 vs UI 呈现对表（来源归因字段呈现）。
- **S2** 降级态：真实降级触发（后台拉取失败态）vs UI 呈现；**禁 mock**=断言链必须真实后台态驱动，前端态注入仅允许作对照面且须与真实态双验。
- **S3** 断链态：基料=sg P1 切换前后实照（COO 留档，候件）；UI 断链呈现 vs 实照对表；实照缺席=本锚不可验，如实报候件不虚验。
- 判据总则：三态呈现与 cache show 后台读数逐态对表（「诚实」=UI 态≠后台态即 FAIL，不问美观）。
- **S1 录位 ✓（2026-09-29 11:1x，详见 §A1/U2.2 段）**：UI 四卡在役态徽标 vs 后端读数对表一致（mmc 待应用↔present:true；三卡未配置↔present:false）——「未配置·读取失败」态活体正确呈现；降级态（S2）候真实拉取失败注入面（三卡缺席态已间接覆盖「未配置」呈现侧；「待应用·失败」降级态候注入缝，如实候件）；S3=sg 实照两半 CTO 五审点④已过，A2-P 终判归 CPO 验收窗（本席不重复）。

### A3 CLI/网页能力矩阵终对表（候 P1 CLI 落位）

- **C1** CTO §5.2 底表逐格终核：CLI 命令×网页能力矩阵每格实测（CLI 侧实跑+网页侧活体点验）；判据=每格「CLI 有/网页有/差异标注」三值如实，差异面显式标注归档。
- 测试侧辅助面：矩阵核验读数留痕（格 ID+实测时点+读数），供 CPO IA 对表与 CTO 门审引用。

#### C1 CLI 半边读数（夜窗实跑 2026-09-29 05:40-06:22+0800，date 现查 UTC 2026-09-28T21:40-22:21Z；COO 04:50 放行+04:59 启勘认可）

**四面×四命令实跑矩阵**（只读面；mmc 面=sg 值 P1 收口链锚引用，rmc 面=河源值读数卷锚引用）：

| CLI 命令\面 | mmc（sg TriMMC） | mlc（本机 TriMLC 8713） | rmc（河源 TriRMC 8712） | rlc（本机 TriRLC 8711） |
|---|---|---|---|---|
| `config show` | 候 sg 锚（P1 收口链） | **token 门拦**（401 人话报错，逐格实证） | ✓ 读数卷锚：face=rmc/source=tier2-cache-fresh（2e262c9d §三.6） | ✓ face=rlc/source=tier2-cache-fresh/cache fresh refresh=900s/providers(0) |
| `config pull` | 候 sg 锚 | token 门拦（同门实证） | ✓ 读数卷锚：切换后 config pull 实拉验证（三键掩码吻合） | ✓ OK(mode=model-relay)/source=tier1-card（dev daemon=定时刷新同构扰动） |
| `config verify` | 候 sg 锚 | token 门拦（同门实证） | ✓ 读数卷锚：HEALTHY（connectivity/credentials/decrypt 三 ok） | ✓ HEALTHY（decrypt: n/a, card_present: false——本机无卡预期态） |
| `config cache show` | 候 sg 锚 | token 门拦（同门实证） | TriRMC src/cli.ts case 归并同构（L490-491）；河源 cache show 单列读数未在卷 | ✓ 与 config show 同文输出（case 归并实现，见发现④） |

**矩阵发现项（呈 CTO 裁/CPO 对表，均非阻塞）**：

- **①CLI help 显示名残留**：TriMLC/TriRLC 两仓 dist/cli.js help 头均=「TriLC (Local Controller)」，default port 文案=8711——仓改名（TriLC→TriRLC 2026-08-31）未触 CLI 文案；两仓 package.json 同名 `trilc`。命名类，候 P2 术语排查（G2②）合并裁。
- **②同构 CLI 两面鉴权行为不一致**：8711（TriRLC）daemon 无 token 门放行 / 8713（TriMLC）daemon 启 token 门拦无凭据 CLI 通道（本席 CLI env 无 TRILC_INTERNAL_TOKEN）。CLI 侧 401 报错人话 ✓（且区分 internal_auth_disabled 与 token 不匹配两分支，src/cli.ts L780-782）。**佐证面**：BOD 哨验 04:4x 曾以带 token 通道实弹通过 8713 pull（N15 ③「8713 mlc pull 实弹 tier1-card」）——daemon 门活体正常，差异=CLI 通道凭据面非 daemon 故障。token 面属 P1 范围 5 候 M2 独立线——如实记录部署形态差，不判缺陷。
- **③pull 的 source 字段语义双轴疑**：8711 实跑 `config pull` 输出 `source: tier1-card` 与同行「card absent server-side; keys preserved」自相矛盾候选（同期 `config verify` 读数 `card_present: false`）。源码印证：show 渲染 `effectiveSource`（值面归因）+`lastAttribution`（末次拉取归因）两字段（L826-836），pull 渲染独立 `source` 字段（L789-790）——pull.source 疑=「本次拉取通道归因」非「生效值来源」，与 show 的值面归因同用 source 字段名=语义歧义。**同字段名双轴语义，呈 CTO 裁字段口径**；对 A2 诚实三态的影响：三命令并读方可还原完整态（通道活+空卡+缓存承载+relay 降级），单命令读数不构成「UI 态对表基座」。**→ CTO 已裁（c76a48f3，COO 07:0x 转达）：数据无矛盾，口径维持**——三字段三语义正交：source（pull）=动作归因、effectiveSource（show）=状态归因、attribution=失败码；「tier1-card 与 card absent 并存」=**模型维有源+凭据维无源的设计内形态**（实勘锚=refreshNow model-relay 分支 key-cache.ts L360-373 注释明写 card absent 非故障）。本席 A2 入场口径遵裁：按「模型维/凭据维两轴+动作/状态归因分离」对表，card absent 行=诚实三态「部分可用」正确呈现（非降级故障态）；字段禁改名（消费方已对表；易混点记档候 M3 文档面）。
- **④cache show 无独立降级梯视图**：`case 'show': case 'cache':` 归并实现（src/cli.ts L490-491 同构三仓）——`config cache show`=config show 别名，梯语义仅靠 show 输出的 cache 行（fresh/stale-grace(tier2.5)/expired）+source 字段承载；§5.2 矩阵行 5「降级梯检视=cache show」宣称与实装差距（四面三态链 card→last-known-good→local direct 无专门检视视图）。呈 CTO 裁：采认别名语义（矩阵行 5 改注）或增补梯视图（P2+）。**→ CTO 已裁（同卷 c76a48f3）：差异面标注归档=非阻塞缺口**（show 的 fresh/staleGrace/effectiveSource 已承载「当前梯位」要素）；A3 合卷第 5 行加注（与⑤补行一并归 STE 合卷时执行）；三仓 ladder 对齐列入候修清单，不排 P2 窗。
- **⑤CLI 独有命令在矩阵无行**：`config cache clear`（DELETE cache，写面）+`model` 族（§5.1 现役保留）在 §5.2 矩阵 6 功能项无对应行——差异面另一方向（CLI 多出能力）。本席未实跑 cache clear（写面零触碰）；矩阵终对表时增补「CLI 独有」差异行候 CPO IA 对表。**→ 合卷补行任务归 STE（CTO 裁②随附），候 sg 锚+网页侧点验齐后合卷时执行**。

**格读数细节留痕**：8711 面四命令实跑时点 2026-09-28T21:40-21:55Z 窗内；`config show`/`config cache show` 同毫秒 fetched=2026-09-28T21:50:23.536Z（同 daemon 同缓存读）；8713 面 status 活体=service:trimlc/pid 10348/healthz ok（daemon 在役，仅 CLI 通道被 token 门拦）；TriRMC 河源面不重触（读数卷锚引用，SDE 已实跑留痕）。

**F-1 交叉注记（COO 06:33 知会+FSD 实证归并，2026-09-29 06:3x 补）**：TriMLC CLI `DEFAULT_PORT=8711` 错指 rlc daemon（FSD 缺陷单 F-1）——本卷矩阵 mlc 列四格均系 `--port 8713` 显式指面实跑（token 门拦面），不受 F-1 影响；但 **mlc bin 不带 --port 的任何读数实达 rlc 面**（本席勘察期 TriMLC CLI 不带 port 的 config show 读数 face=rlc、与 TriRLC CLI 同毫秒同文即 F-1 同源实证）——F-1 裁修后 mlc bin 默认面格重测在窗队，8713 四格 token 通道复跑同窗队。候裁期间引用本卷者勿将 mlc bin 不带 port 读数误作 mlc 面读数。

**F-1 重测口径（CTO 裁③，c76a48f3 随卷，COO 07:0x 转达）**：F-1 裁修后重测三要件=①`cli status` 无 `--port` 打 8713（默认面指正）②`config` 族连通 ③TriRLC 零回归（8711 正确值不动）。三要件全过方闭 F-1 重测格。

**F-1 重测独立复验（STE 实跑 2026-09-29 08:00-08:03+0800，date 现查 UTC 2026-09-29T00:00:16Z；FSD 并批 832b266+daemon 新代 pid 5348 后）**：

- **要件① PASS**：TriMLC CLI `status` 无 `--port` 打 8713 ✓——pid 5348（新代活体）/port 8713/service trimlc/healthz ok，默认面指正实锤。
- **要件② 候通道（不虚验）**：`config show` 无 `--port` 已正确触达 8713（端口面 ✓）但被 token 门拦（401 人话报错同前）——新代 daemon 配置了 TRILC_INTERNAL_TOKEN（fail-closed 门，src/server/app.ts L1759-1772：未配置=internal_auth_disabled 全拒/配置后校验 X-Internal-Token；请求期读取支持运行中注入）。FSD 四读数全绿=其通道带 token；本席 token env 不可得且凭据分发面不擅掘——候 BOD 哨验同款带 token 通道（N15 先例）或 FSD 供 env 注入口径后补跑 face=mlc 翻正格。
- **要件③ PASS**：TriRLC CLI 零回归 ✓——`status` 无 `--port` 仍打 8711（pid 15708/service trirlc）；`config show` face=rlc/source=tier2-cache-fresh/providers(0) 正确值不动（fetched 2026-09-28T23:50:24Z 新周期刷新，语义零漂移）。
- **小结**：三要件 ①③ 独立复验 PASS；② 端口面 PASS+读数面候 token 通道；FSD 侧四读数全绿（COO 07:5x 知会 9d87a368）与本席 ①③ 复核同向，F-1 修复面（DEFAULT_PORT 8711→8713）实质成立，② 补格候通道不阻 F-1 闭合定性（CTO 裁③三要件语义=CLI 侧连通性，端口指正已独立实证）。

**CTO CLOSED 裁+② 补格兑现（2026-09-29 08:1x-08:2x+0800）**：CTO 08:07 闭合定性裁=**CLOSED 即时**（裁据三点：修复对象与验收域对齐且双源独立同向 / ②读数面 401=设计行为非缺陷——fail-closed 源码实勘+G10 期 token 通道实证互证，token 通道=凭据供给域不入 F-1 验收域 / 重测三主判据全过）。录卷照 CTO 原话：**①③独立过+②端口面过+CLOSED 即时**。

**② 补格兑现（候办销，FSD 通道口径执行）**：token 自 `trimlc-daemon-channel.cmd` 就地提取（len-only=64 chars，值 withheld 勿入证据件；env 单 shell 瞬态零残留）——

- **要件② 读数面 PASS（翻正格）**：`config show` → **face=mlc**/effective model GLM-5.3/source=tier2-cache-fresh/cache fresh（fetched 2026-09-29T00:03:32Z, refresh=900s）/providers(0)——**mlc bin 默认面读数自 face=rlc 翻正为 face=mlc**，F-1 缺陷翻转闭环。
- 8713 show 族第二格：`config cache show` → 与 show 同文（face=mlc）——发现④别名行为在 mlc 面同构复现（跨面一致性佐证）。
- pull/verify 格照 FSD 口径不跑（verify=台账流量候选，show 族已足闭合读数面格；pull=动作面 BOD N15 已实弹）。
- **三要件终态：①✓②✓③✓ 全过，F-1 CLOSED（CTO 08:07 裁）+② 补格增强证据兑现，候办销账。**

**CLI 半边结论**：矩阵宣称「4/4 daemon 覆盖」的四命令在 CLI 面**实现均在**（三仓 CLI config 族同构+mmc 面候 sg 锚），活体可达格 8711 全通、8713 全拦（token 门）、rmc/mmc 面锚引用；发现①-⑤如实入卷候裁。网页侧点验候正常工时，两半合卷后方成 C1 终对表。

### A4 渲染验证门全过（LG-035 家族，全项硬门）

- **R1** 非作者手测：=A1 全案（本席亲测留痕）。
- **R2** jsdom 首启链冒烟：首启→交互→**保存→reload→断言仍在**完整周期（第四型跨刷新持久，P0 W 族教训直引）；判据=全链绿且零控制台错误。
- **R3** 新端点真 HTTP 链路案：UI 消费的新端点（若有）必须真 HTTP 链路案覆盖——禁单测直调+jsdom mock 双盲（LG-035 第三次命中教训直引）；判据=新端点×真服务启动×断言响应契约。
- **R4** 结构升级型改动=UI 必检触发器：候 FSD 改动清单落位后逐项核触发器命中面。

#### R3/R4 独立核验录位（2026-09-29 10:5x+0800，date 现查 UTC 2026-09-29T02:58Z）

**R4 触发器命中核验 ✓**：P2 改动两笔（TriModel 仓 995c2f7+3e6ab37）——`ui/index.html` +439/-74（导航层 7 视图+hash 路由+面板互斥 hidden+单页面板重构）=**结构升级型**，LG-035 必检触发器**命中** ✓。必检面映射现状：非作者手测→A1 U1-U3 本席第一段已过+CTO 技术侧亲跑过；jsdom 首启链→ui-boot 17+ui-boot-connection 8 绿；真链路门族 E1-E8 gate 适配=gotoStrategy 导航步语义零变更（diff 实勘：只加导航点击+panel 显示等待，断言本体未动）+trimmc-card E12 代际勘锚（panel-card-mmc+TriMMC（sg）双锚意图保持）✓。触发器命中→必检执行=在轨。

**R3 独立核验发现：managed 新端点 UI↔server 真链路案缺失（新发现，候 CTO 裁）**：

- P2 新端点=**GET /v1/config/cards/<face>?view=managed**（3e6ab37，managed 视图只读面 additive）。三层覆盖现状实勘：
  1. 服务端单测（config-cards.test.ts +47 行）=in-process 直调，managed 分支/401/404/ledger 摘要逻辑有绿案 ✓；
  2. UI jsdom 族（ui-fourplane.test.ts 7 案，覆盖④）=**mock fetch**（beforeParse 替换 window.fetch 为 faceResponder 假响应），view=managed URL 形态断言+三态徽标渲染绿 ✓；
  3. **真浏览器↔真 server 全链路案=零覆盖** ✗——实勘 grep：ui.e2e.gate.test.ts / ui-e9-seam / ui-e10-reload / ui-e12-strategy-delete 四个真链路族对 `panel-card-*`/`view=managed`/`loadFaceCards` **零命中**（E1-E8 走策略卡+连接面，e9/e10/e12 走策略卡写入/删除/reload 链，全不触四卡 managed 消费）。
- **定性**：恰为 LG-035 第三次命中教训的字面形态（单测直调+jsdom mock 双盲→真链路缝 mock 掉）——生产 fetch 下的 URL 拼接/auth 头拼接/三态解析三处集成缝无绿案覆盖。**缺案非挂案**：0 fail 读数不暴露此面，CTO 五审点②「A4 渲染门 45/45 全绿」的 45 案各自真绿，本发现不推翻门审已过面——但 P2 执行单 A4 锚字面要求「真 HTTP 链路案（**新端点真链路**，禁单测直调+mock 双盲）」，managed 系新端点，**当前形态=A4 锚字面未满足项**。
- **缓解与闭环路径**（候裁不擅断）：①本席真浏览器活体手测候 admin 通道后补 managed 200 全链路人工验证面（真浏览器→真 server→admin 头→四卡渲染→三态徽标真实值）——人工验证=缓解面非绿案达标，如实标注；②正式达标路径=候 FSD 补自动化真链路案（E 族扩展或与 e12 修案同批，同批=一次重启两件省窗），判据=新端点×真服务启动×断言响应契约（本 R3 原判据行）。
- **上报**：随本录位即报 COO 转 CTO 候裁（门禁面发现非放行裁量——本席不裁 A4 过/不过，如实呈报候裁）。
- **CTO 裁词回执（6bf7a596，门审卷 §五 勘误补注落，COO 11:0x 转达）**：**裁②为准——件C 并入 CONDITIONAL PASS 条件族**（条件族两项=e12 修案+件C）；本席零命中断言 CTO 独立复核成立认承，门审自纠如实记档（当时核「在位且绿」未做覆盖面 grep 核对）——STE 第三刀补位=互检生效正名入卷。①本席活体验证=临时缓解加分项非达标替代（三集成缝守卫必须自动化持续在）；admin 供料到位早于件C 落地可先做缓解面不阻条件族。②件C 两案形态循 ui.e2e.gate 骨架：(a) 有令牌 managed×4 全链+三态徽标断言 (b) 错 token 401 诚实态；**测试自包含不候供料**（CTO 澄清：createServer 自配 env+UI 注入），纯测试面零重启——已扩批 FSD 下午窗与件A 并行。本席复验位：R2=件A 落后/R3=件C 落后独立复验照旧链。

#### Token 通道适配性实测（COO 即答指针执行，2026-09-29 11:0x+0800，date 现查 UTC 2026-09-29T03:01Z）

COO 即答=F-1 ② 先例口径（TRIMODEL_API_TOKEN 在 channel cmd 内自提取，键面适配性以 401→200 翻转实测为准，不合回 FSD 对键）。实测三态（值就地提取 len-only=64 chars withheld，env 单 shell 瞬态零残留）：

- **键面清单**：channel cmd 含 TRIMODEL_API_TOKEN ✓ / **TRIMODEL_ADMIN_TOKEN 缺席** ✗（其余 TRILC_*/TRIMC_* 通道键在位，与本测无关）。
- **源码实勘先行**（config-cards.ts L100-102+L60-62）：managed 视图（UI 四卡消费面，缺省 view）→`requireAdmin`=TRIMODEL_ADMIN_TOKEN（fail-closed）；pull 视图→TRIMODEL_API_TOKEN（keys 同族 bearer）。**双层鉴权设计两族 token 各管一面**。
- **T1 无凭据 managed → 401**：admin 已配置实锤复核 ✓（非 503 fail-closed disabled，与 U2 第一段探测同向）。
- **T2 API_TOKEN 打 managed → 401**：错误凭据族被正确拒绝——**API_TOKEN 不翻转 managed 面**，鉴权双层隔离活体实证 ✓。
- **T3 API_TOKEN 走 pull 视图 → 200 翻转成**：`{"object":"config.card-pull","face":"mlc","card_present":false,"entries":{},"default_model":"GLM-5.3","default_model_source":"policy","warnings":[]}`——**API_TOKEN 适配面=pull 视图确认**；附读数：mlc 卡本机缺席如实回显（card_present:false 零造数，「缺席不造数」活体佐证）+server 侧 pull 视图端到端真链路（真 server 活体+真 token+响应契约断言）实测通。
- **通道结论**：COO 指针键对 pull 面**适配**；managed 面（UI 四卡消费面）**不合**——按 COO 口径回 FSD 对键：UI 连接态深验（U2.2 四卡 managed 拉取+三态徽标真实值+S1 在役态对表）仍候 **TRIMODEL_ADMIN_TOKEN 供料**（channel cmd 无此键，供料面=FSD/BOD 裁量，本席不擅掘）。连接页双输入框语义与后端双层对表佐证：API 框↔pull 面/keys 族、管理令牌框↔probe/managed/写面（UI 源码 adminHeaders 与后端 requireAdmin 对上）。

### A5 全量测试族读数+四类排查

- **G1** TriModel 全量零新增：T-reg 同法（P1 期 ste-test-plan-p1.md §六），对平基线候 P1 落位后现勘递延（P2 落位后再递延一次）。
- **G2** 四类排查（LG-035）：①术语（结构词汇禁入 UI——「卡/face/域面」内部词不漏出）②命名（一致性与 CPO IA 方案对表）③布局（四卡矩阵+选项卡布局走查）④逻辑双路径（每交互正/反路径各一遍）。

#### G2① 术语扫描录位（2026-09-29 11:0x+0800，活体 3333 独立 Playwright 扫描，v2 禁词族）

- 方法：七视图逐面板 innerText 抓取（渲染面实证，注释天然排除），禁词族 12 模式（face/managed/panel-*/storage/JS 函数名/fail-closed/环境变量名/裸 HTTP 码/HTTP 头名/endpoint/`LG-\d{3}`/`*.json` 直书）——v1 扫出 face 后补 LG 编号+文件名两模式成 v2。
- **渲染面命中 4 处（2 视图）**：card-mmc 3 处（L358 特有面过渡注记句：`face`+`LG-035`+`trimmc-card.json` 同句三连）+strategy 1 处（L188 副标 div「LG-035 面 · 常态只读…」）；**title 悬停面补计 1 处**（L404 策略卡 title「LG-035 面 · 常态只读…」——innerText 扫描不覆盖 hover 态，源码实勘补计）。overview/mlc/rmc/rlc/connect 五视图零命中 ✓。
- **非漏出核实**：LG-036×1（L960）/LG-058×2（L64/L329）+L183/L758 注释全不渲染 ✓（grep 命中但 innerText 零命中互证）。
- **定性**：非阻塞性 UI 文案缺陷——功能零影响，术语纪律面违 G2①「结构词汇禁入 UI」判据。路由=CPO 术语裁决+候 FSD 随批修（L188/L358/L404 三行文本改动；本席建议面：「LG-035 面」→「过渡期标注 · 常态只读」，「本 face 卡文件现役=…」→「本卡配置文件现役=策略卡过渡位」——建议非裁决）。

#### G3 走查快照敏感面复核 ✓（2026-09-29 11:0x）

- a1-u1-readings.json+a1-u2-readings.json：`sk-`/`TRIMODEL_API_TOKEN=`/`Bearer ` 零命中；40+ 长串模式零命中——**证据件零明文** ✓。截图 8 张（四卡×普通/connected）本地保留不落仓（敏感面防扩散纪律）。token 值全程 len-only（64 chars withheld）。
- **G3** 走查快照敏感面复核：快照样本抽验零明文 key。

### A6 UI 独立 revert 锚

- **V1** revert 锚在位+可执行性走读：dist 锚策略（P0 A6 教训=单 commit revert 失效→dist 锚+dist.bak 补位）；判据=锚在位+回滚步骤走读过+补位文件在位断言（回滚实弹候 BOD 哨验，非作者纪律）。

## 三、边界与纪律

- 本席零生产写面；手测/走查候正常工时在岗窗（不夜窗）——规划/纸面工作夜窗可做。
- 候件态如实报：A2 实照基料/A3 P1 CLI 落位/A1+A5 两域两面改完——三候件任一缺席，对应锚「候件不虚验」。
- CEO 终验三项（真人掐表/删除复活/toast+A4 绿点）+A3 UI 确认=CEO 亲测面，本席族为预验非替代。
- 节点收口件照 LG-057；读数回 COO 汇 COS 照 P1 同链。
- 本树 node-status.jsonl self-register 起账，候 COS 并账。

## 使用依据

P2 执行单正身（wt/board 11a52dbf 全文）；LG-035 渲染验证门家族（记忆条四条：UI spec 实现态走查/UI 交付渲染验证门/第四型跨刷新持久/真 HTTP 链路）；P1 期测试规划（ste-test-plan-p1.md，T-reg 方法与基线递延链）；P0 期 W 族教训卷（ste-test-plan.md §十三）。

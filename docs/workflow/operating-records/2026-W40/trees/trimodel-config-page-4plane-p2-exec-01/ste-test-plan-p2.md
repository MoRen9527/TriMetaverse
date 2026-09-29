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

### A2 诚实三态呈现核验（在役/降级/断链）

- **S1** 在役态：后台 card 正常态 vs UI 呈现对表（来源归因字段呈现）。
- **S2** 降级态：真实降级触发（后台拉取失败态）vs UI 呈现；**禁 mock**=断言链必须真实后台态驱动，前端态注入仅允许作对照面且须与真实态双验。
- **S3** 断链态：基料=sg P1 切换前后实照（COO 留档，候件）；UI 断链呈现 vs 实照对表；实照缺席=本锚不可验，如实报候件不虚验。
- 判据总则：三态呈现与 cache show 后台读数逐态对表（「诚实」=UI 态≠后台态即 FAIL，不问美观）。

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

**CLI 半边结论**：矩阵宣称「4/4 daemon 覆盖」的四命令在 CLI 面**实现均在**（三仓 CLI config 族同构+mmc 面候 sg 锚），活体可达格 8711 全通、8713 全拦（token 门）、rmc/mmc 面锚引用；发现①-⑤如实入卷候裁。网页侧点验候正常工时，两半合卷后方成 C1 终对表。

### A4 渲染验证门全过（LG-035 家族，全项硬门）

- **R1** 非作者手测：=A1 全案（本席亲测留痕）。
- **R2** jsdom 首启链冒烟：首启→交互→**保存→reload→断言仍在**完整周期（第四型跨刷新持久，P0 W 族教训直引）；判据=全链绿且零控制台错误。
- **R3** 新端点真 HTTP 链路案：UI 消费的新端点（若有）必须真 HTTP 链路案覆盖——禁单测直调+jsdom mock 双盲（LG-035 第三次命中教训直引）；判据=新端点×真服务启动×断言响应契约。
- **R4** 结构升级型改动=UI 必检触发器：候 FSD 改动清单落位后逐项核触发器命中面。

### A5 全量测试族读数+四类排查

- **G1** TriModel 全量零新增：T-reg 同法（P1 期 ste-test-plan-p1.md §六），对平基线候 P1 落位后现勘递延（P2 落位后再递延一次）。
- **G2** 四类排查（LG-035）：①术语（结构词汇禁入 UI——「卡/face/域面」内部词不漏出）②命名（一致性与 CPO IA 方案对表）③布局（四卡矩阵+选项卡布局走查）④逻辑双路径（每交互正/反路径各一遍）。
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

# CTO 技术裁卷·sg card 施工 P3 红面三件裁+P1-P4 复核判读（值席增量段毕报 966a116e5 候裁承·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-p3-redface-ruling-20261121.md·裁卷正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 裁定对象: 值席 P1-P4 fsd 格式增量段毕报 966a116e5（P3 红面候裁三件+P1 异值档）——本席复核判读+技术裁
- 证据面: 毕报读数（P1 sha16 双对表/P2 双读全绿/P3 401+proxy 日志 rewrite 实锚/P4 mtime 00:13:08）+本席裁卷 3070753a9（核准③五护栏+承录④）+勘定卷 6d612b679（静态面）+fsd 总成卷 2121ac9d6（dist 漂移面先锚）

## §一 · P1-P4 复核判读（四锚分判）

| 锚 | 读数 | 判 |
|---|---|---|
| P1 | card 源 key sha16=84001b4942e6af15（R-HY 充值 key·len35）≠本机 .env 7c310041469d7d76（fsd 令文基准值）·基线 431a85a1 同源全等 | ✓ **异值档=事实记录非偏差**（§三判读）·零明文 D-46 ✓ |
| P2 | card JSON 读回 deepseek-flash + apply 派生 deepseek-flash（派生自 s-ds-carryover default 规则→e-deepseek-anthropic.model） | ✓ 双对表全绿·派生语义与裁卷 3070753a9 核准③形一致 |
| P3 | POST /v1/messages model=deepseek-flash → rc=401+proxy 日志 `rewrite deepseek-flash -> deepseek-v4-pro (schedule=fallback)` + /proxy/health key_configured=False 全路由 | ✗ **红面=缺件**——根因链定谳见 §二 |
| P4 | card mtime 2026-11-21 00:13:08.161607（P3∧P4 合一注·裁卷 3070753a9 P4 锚形裁注承录 ✓） | ✓ |

**完工=当前 P3 缺件态不注水承录 ✓**（值席毕报判读如实·卡面构造五步全绿与 daemon 消费面红面两分如实——好卷）。

## §二 · P3 红面根因链定谳（一源两红）

**根因=TriModel 运行 dist 旧形（非 4147bb8）proxy 消费面双门皆闭**：

1. **model 调度门闭**：运行 dist 无 deepseek-flash 在册条目→proxy model 调度层判未知→fallback 槽 rewrite 成 deepseek-v4-pro（`schedule=fallback, upstream=deepseek-anthropic` 日志实锚）——**v4-pro 经 fallback 槽引入非显式配置**（CEO 令面否决模型从槽位渗入·红面实质）；
2. **key 门闭**：运行 dist 缺 card 消费分支（源码 4147bb8 key-source.ts 系 per-call loadCard+decrypt——总成卷已锚）→proxy 只认 env DEEPSEEK_API_KEY→env 空→key_configured=False 全路由→上游 401；
3. **两红一源**：dist rebuild（形 2）一次消两门——与段二已证「PUT hydration 400（旧 dist 缺加密直供分支）」同根=**三红一源·dist 漂移面是唯一根因**（fsd 总成卷 §一③ 先锚·本卷活体闭环实证）。

## §三 · P1 异值档判读（承录·非偏差）

card 载 R-HY 已充值 key（84001b...）=**CEO 22:41 裁决①「DeepSeek 已充值」令面语义的正确落地**（充值 key 在 R-HY .env·TriRMC 切换线同源同把）——fsd 令文基准值（本机 .env 7c3100...）系令文起草时点值·非裁决①对象 key——**施工源选择对·异值档归档正形**。
处置注：本机 .env 旧 key（7c3100...）零触零废=形 3 窗二批 key 源勘定连带项（裁卷 3070753a9 §五②供给源二选一并勘 key 源面——观察注级）。

## §四 · 三件裁（值席候裁面·CTO/护栏域）

| # | 候裁面 | 裁 | 判据 |
|---|---|---|---|
| a | rewrite fallback 槽 v4-pro 消除 | **随 dist rebuild 同根消·非独立施工件** | dist 部署后 proxy deepseek-flash 在册→直发零 rewrite（fallback 槽零触）·零独立码面改 |
| b | TriModel dist rebuild+restart | **升=P3 补毕必需件（技术面可裁）** | 形 1「零重启先通」前提被消费面阻断（§二双门）——卡面构造全绿而 proxy 吃不到=最后一公里必须 dist 部署——**承录④修裁：形 2 从「候批可选」升「必需件」**（证据面更新非推翻·段一/段二已证 dist 漂移·本卷活体闭环） |
| c | key env or card 消费形 | **card 消费正形·env 面否** | 源码 4147bb8 key-source.ts per-call loadCard+decrypt=设计正形（key 不落 env·D-46 更优+card 单点治理）——dist 部署后 key_configured=True（card 面）·env 保持空零变化 |

**护栏语义注（b 件随令）**：TriModel server+proxy 双进程 systemd restart=派工单护栏「两 daemon 零重启」字面外第三进程（TriMMC/TriMLC 零触不变）——技术面可裁·窗位归 COO（D-76 C 层）。
**时机窗注（有利面）**：GLM 停工止损态（935 兑现·席组静默·fsd 节 2b 停手）=TriModel restart 瞬断窗**零实际损失窗**——COO 统排可即排·不必候 GLM 复工前贴线窗。

## §五 · rebuild 一次带三活（承录④码面捆注兑现形态修正）

dist rebuild+restart 一次带三活：①proxy deepseek-flash 在册直发（零 rewrite）②card 消费分支激活（key_configured=True）③PUT hydration 400 面消——先例形态=本席裁卷 3070753a9 裁①码面捆注（registry 补条目+兜底勘正与 rebuild 捆）**顺延兑现**：registry 补条目非 P3 红面必需（proxy 面直发不触 client registry）·维持候窗二批捆排不动。

## §六 · P3 补毕锚与链序

1. **施工面（候 COO 派令·值席/fsd 执行本席零代执）**：sg TriModel dist rebuild（源码 4147bb8）+server/proxy 双进程 systemd restart（systemd unit 正形·TriRLC 重启纪律族参照+三清护栏承）；
2. **P3 补毕锚**：复发一发 POST /v1/messages model=deepseek-flash → **rc=200∧回读 model=deepseek-flash 原样对表**（零 rewrite·红即停零二次硬试仍役）；
3. **四件齐后链序**：P1∧P2∧P3(补)∧P4 → STE 独立复核 → 本席终审 → COO 定谳 → 节 2b-4 续铸令释放；
4. **回滚锚**：卡面 bak 三份+write guard backup-first keep5 在位不动+GLM 条目零触（f8a6760c）+TriModel restart 前回滚锚=旧 dist 可回退位（rebuild 产物并列部署 or git 检出回退·值席窗内勘定一线·红即停）。

## §七 · v4-pro fallback 族第三处承录

TriRMC env（已切避）+TriMMC 兜底常量 L10（裁卷 3070753a9 裁②·候窗二批码面批）+**TriModel proxy rewrite fallback（本卷新实锚·第三处）**——第三处随 dist rebuild 同根消（§四 a 件）·前两处候窗二批不动——族谱三处两形全谱齐·零新增码面债。

## §八 · 使用依据

值席增量段毕报 966a116e5（P1-P4 读数+proxy 日志实锚）+值席五步毕报 35074d275（施工三件·BOD ㊿+969 采认）+本席裁卷 3070753a9（核准③/承录④/P4 锚形裁注）+勘定卷 6d612b679+fsd 总成卷 2121ac9d6（dist 漂移面/key-source.ts per-call 锚）+CEO ㊿+948 型号定谳+CEO 22:41 裁决①充值面（㊿+942）+TriModel key-source.ts/anthropic-proxy.ts 源码锚+D-15/D-24/D-27 v4/D-46/D-47/D-76 C 层。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

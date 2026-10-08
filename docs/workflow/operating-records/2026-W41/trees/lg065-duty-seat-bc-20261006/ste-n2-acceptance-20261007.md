# STE·N2 盯梢 daemon 落位验收卷（五锚·LG-065 段4 收口链第一环）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg065-duty-seat-bc-20261006/ste-n2-acceptance-20261007.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-07T11:42:55Z（19:42:55+0800，补验注记 append 当场 date 现查）
- 席位: STE 小柯（m-ste）· 非作者独立验收
- 令源: BOD N2 验收令（18:27 hook，五锚+FSD 毕报 09645364 为被验对象）
- 两刻制: **开工刻 2026-10-07T10:29:17Z（18:29:17+08）／毕报刻 2026-10-07T10:36:25Z（18:36:25+08，当场现查）**
- 被验对象: FSD 施工回执 09645364（77 行卷）+执行体 dev `%LOCALAPPDATA%\tri-watchdog-n2.ps1`（13776B，mtime 18:15:28）/sg `/usr/local/sbin/tri-watchdog-n2-sg.sh`（5955B root:root 755）
- 定形对照正身: cto-n2-scheme-review-20261006.md（06150d83，APPROVE 附条件四判据定形+两加固条件+互备红线）

## 〇、判读（先答）

**PASS——五锚全绿**，零阻塞项；异常单列三笔观察项如实列报（§六，均不阻塞）。FSD N2 施工读数卷 09645364 验收通过，段4 收口链第一环本席放行意见成立，候 BOD 终判。

## 一、锚①双侧自然轮独立复测 — PASS

| 面 | FSD 基线（10:20Z） | 本席独立轮 | 判 |
|---|---|---|---|
| dev 8713 job `cron_muxxy5w7_wbb7` | rc=2 last=10:20:00Z ok | **10:32:51Z OK all-dims**（seats-silence=0min open=-1 peer=3min）；job 值面 st=idle **rc=3** status=ok next=10:40:00Z | ✓ +1 轮滚动 |
| sg 8712 job `2608a629-7b47…` | 10:20:05Z OK (peer=4min) | **10:30:05Z OK all-dims (peer=10min)**（n2-sg.log 实读）；执行痕迹=TriMMC cron log `…10-30-05-429Z.log` exit 0（stdout 空=正常形，OK 行写本地 log L96 形勘定） | ✓ +1 轮滚动 |

- 双侧 peer 读数互闭合：sg 10:30:05 判 dev 章 peer=10min（dev 10:30 轮延迟未落时点）；dev 10:32:51 判 sg 章 peer=3min——双向章戳新鲜度互证。
- 8713 jobCount=**8**（7 原役+N2 新 job）；监听 pid=**3628**==pidfile（`~\.trimetaverse\trilc-8713.pid` val=3628，mtime 18:03:23）==FSD 冷起 pid 三点对平。
- **本席热区勘差自纠注记**：上午 LG-064 补测卷 §七「pidfile 未探得」系搜面漏 `.trimetaverse` 目录——pidfile 正形=USERPROFILE\.trimetaverse\trilc-8713.pid（按 port 分文件，CTO 09-18 裁修形吻合），勘差补正在此。

## 二、锚②四判据抽验（对照 CTO 定形逐条·代码面 L 行锚） — PASS

| 判据 | CTO 定形要点 | 脚本现形 | 判 |
|---|---|---|---|
| ①席位静默 | 双条件+状态源钉死机器可读+阈值分段+失败不假报 | L118-147：mtime（newest jsonl 全 projects 扫）+挂账台账中文数词解析双条件；阈值 30min（8-23 点）/90min（深夜）L38-39；解析失败=注记跳过（L145-146 honest skip） | ✓（段界差异注记 §六.3） |
| ②告警认领 | 认领=账本 ack 落笔或树 commit，禁 send-keys 应答（暗签禁令） | L187-211：认领=本地 n2-ack.txt 或 sg /var/lib/tri-watchdog/ack 含 id 行，**文件面 only**；L5-6/L188 注释显式「send-keys response NEVER counts as claim - dark-sign ban」；10min 无 ack→hop2 +m-cos+bod（L203-205）+ESCALATED 防重（L206-208） | ✓ |
| ③daemon 存活 | 三件套禁单 healthz+清单实勘枚举禁硬编码 | 8713：pidfile↔listener（L76-84）+healthz **带 X-Internal-Token**（L87，S2b 勘差照办；401=勘差注记口径 L75）+jobCount≥7 值面（L96）+degraded/cron-disabled（L94-95）；8711 listener+healthz（L100-109）；d3c `Get-ScheduledTask` 实勘枚举+**Ready\|Running 双放行**（L112-116，FSD 首火勘差笔 2 修实证） | ✓ |
| ④模型通道 | 日志面判读零新增调用+连续 N 次防抖+最小成本 | L149-172：rank2-5 transcript 尾 8KB 扫 API Error/rate_limit/overloaded（零新增调用）；连 2 轮防抖（mcHits≥2+mcPrev≥1）+rank1 跳过自指防护（L154） | ✓ |

- 加固条件①（8713 根治验收绿前置）：施工序=段2 术后（GO 17:39 三门含 8713 绿）✓ 顺序锚定成立。
- 加固条件②（lastRun 事实为主禁 nextRun 活信号）：自检段 L64 注释显式「judgment on heartbeat/lastRun facts, never nextRun rolling」；sg 侧同构 ✓。

## 三、锚③互备对章双向验证 — PASS

| 章 | 落点 | mtime（10:33:38Z 采） | 属主 |
|---|---|---|---|
| heartbeat-dev（dev push 落 sg） | sg:/var/lib/tri-watchdog/ | epoch 1791369177=**10:32:57Z** | fleet ✓ |
| heartbeat-sg（sg 本地写） | sg:/var/lib/tri-watchdog/ | epoch 1791369005=**10:30:05Z** | fleet ✓ |

- 双章 0-5min 级新鲜（采读时点），双向判读通；dev 本地章同步在位（LOCALAPPDATA\tri-watchdog-n2\heartbeat-dev 10:20→10:32 轮刷新）。
- 非循环红线对表：sg 写章=sg 本地文件面、dev 判读=ssh stat（跨链路 ✓）；dev 写章=ssh push 单向、sg 判读=sg 本地读（跨链路 ✓）——写入与判读无一侧同链互依赖，CTO 红线「互误判活」形态无成立路径。
- 互备过期窗=3×扫描周期=30min（L36 peerStaleMin）✓ CTO 定形值。

## 四、锚④技术债六项定性核对（面核非复测·如实标注） — PASS

| # | FSD 技术债 | 面核读数 | 核对 |
|---|---|---|---|
| 1 | sg d1 身份墙诚实降级 | sg 脚本 L4-6+L48-50 **双段注释=移除形降级**（duty tmux socket root 私有/fleet 不可达→席位静默归 dev 承载）；行为侧=10:08:55 tmux absent 一轮后修形，10:10:47 起零复发 | ✓ |
| 2 | 在办单解析脆弱性 | FSD 疑「瞬时锁」——本席新证据=10:20 与 10:32 两连轮 open=-1，失灵为持续态非瞬时（12min 跨度）；**→ 同日 BOD 快核补验勘正（§九）：根因=PS5.1 UTF-8 编码分叉（c65a0bb6 修毕三级终证+本席独立快验三连生产轮 open=14），生产哑火已根治**；dev 侧双条件守住了未假报（silence 未超阈值零告警影响） | ✓（形态更新→补验根治勘正） |
| 3 | notify JSON 注引 | **面核勘差：FSD §六.3 前半描述过保守**——payload 经 ConvertTo-Json（L47）实有转义；后半成立：send-keys 文本（L243）无显式 strip 单引号逻辑，靠 issue 源无引号约束 | ✓（勘差注记） |
| 4 | hop4=runbook 性质 | L205 hop2 报文内含 runbook 指引句（sg 物理独立位人工窗），非自动化段 ✓ | ✓ |
| 5 | launcher 备份候清 | bak-pre-n2-20261007T100135Z 在位（FSD 卷锚），候 CTO 验收毕清——本席验收毕即入清窗，清动作归 FSD/CTO 面 | ✓ |
| 6 | 8713 完成链断链知情条款 | CTO 卷 §二.2 知情在案+N2 dev job 兜底=对侧互备 30min 过期判读——设计自洽 ✓（今 kkorw 根治后 N2 job 为新潜在受害者候选同条款覆盖） | ✓ |

## 五、锚⑤hop1/hop2 真发未实测=N3 候项 — PASS（在卷确认）

- FSD §六.4「hop1/hop2 真发路径未实测（构造真发=扰值席，守节流纪律）——N3 兜底链实测 10-08 STE 窗覆盖」**在卷确认**；CTO §四 N3 锚补强两条（⑤a 互备非循环断言/⑤b 叫醒链降级触发实测）挂 N3。本验构造真发零执行 ✓。

## 六、异常单列与观察项（三笔·均不阻塞）

1. **dev↔sg 全链 ssh 单通道依赖**：dev 侧告警 token 获取（/proc environ）、章 push、peer 判读、notify 转发全走同一 ssh 通道——ssh 断→互备 peer 维度盲（peerAge=-1 grace note 形）+告警 ALERT-DEFERRED（L46 如实留 log）。CTO 定形未禁（链路唯一裁准自洽），但「互备通道=告警通道=同一 ssh」为架构级单点，如实入观察项候 CTO 域。
2. **dev 10:30 轮执行延迟 2.8min**（next=10:30:00Z→actual 10:32:51Z）：TriMLC executor tick 延迟形态，盯梢 job 10min 周期下实际间隔最长 ~12.8min，30min 互备窗富余充足——非缺陷注记（与 cronEngine 完成链断链家族不同签名：延迟后正常执行+状态回写 ok）。
3. **open=-1 持续态**（§四#2）：在办单解析失灵已跨 2 轮 12min+——「瞬时锁」假设弱化，候机器可读在办单源升格时一并勘（dev 侧 d1 双条件守住了，零告警影响）。**→ 补验勘正闭合（§九·c65a0bb6）**：根因=生产 allowlist 链 PS5.1 对 UTF-8 无 BOM 账本按 ANSI 读致中文数词乱码（双宿主分叉坑第二例），-Encoding UTF8 单 token 修毕，生产三连轮 open=14 根治；本观察项闭环，N3 起验收面读新卷。

## 七、质量门禁评估

N2 五锚全 PASS：双侧自然轮独立复测各 +1 轮滚动（dev rc=3/sg log +1 行）+四判据代码面逐条对照 CTO 定形有形+互备双章 fleet 属主双向新鲜+技术债六项全数面核定性与卷一致（三笔勘定注记如实）+N3 候项在卷。判读 **PASS** 呈 BOD——段4 收口链第一环本席放行意见成立，候 BOD 终判。

## 八、使用依据

- BOD N2 验收令（18:27 hook·五锚）；FSD 施工回执 09645364（被验对象）；cto-n2-scheme-review-20261006.md 06150d83（定形正身）
- 活体读数：8713 jobs API（X-Internal-Token 变量法）+Get-NetTCPConnection+pidfile 值面；sg 侧经 M-SG ssh 通道（BatchMode）：双章 stat+属主+执行体+TriMMC cron log（滤 command:/runAs token 行纪律）+n2-sg.log 实读+脚本 grep 段面核
- 代码面抽验：tri-watchdog-n2.ps1 全文 244 行+tri-watchdog-n2-sg.sh 关键段（token 值面零出机全程）

## 九、补验注记（BOD 快核单锚·锚④技术债 #2 状态刷新）

- 令源: BOD N2 验收补验令（2026-10-07 19:35+08·原五锚 PASS 不撤）；被勘对象=FSD 补正卷 c65a0bb6（§五.3 d1 根因+§六.2 勘正+§六.6 迟火抖动补记）
- **根因勘正**（以 c65a0bb6 为准）：d1 生产面 openItems 恒=-1 非「瞬时锁」——allowlist 生产链走 powershell 5.1，Get-Content 无 -Encoding 对 UTF-8 无 BOM 账本按 ANSI 读→中文数词乱码→正则不命中→恒 -1（d1「在办>0」告警腿生产哑火）；FSD 会话 DryRun 绿系 pwsh7 UTF-8 默认——**双宿主分叉型坑第二例**。修=L130 单 token `-Encoding UTF8`，三级终证（PS5.1 定点 parse 值=14／全脚本 DryRun／生产自然轮 open=14）
- **本席独立快验**（不依赖 FSD 读数）：①执行体现读 L130 `-Encoding UTF8` 在位；②n2.log 边界读数=11:20:00Z open=-1（修前末轮）→**11:26:12Z open=14（修后首火）**→**11:32:26Z open=14**→**11:40:00Z open=14**——三连生产轮边界清晰
- **定性勘正**：§四#2 与 §六.3「一回失灵疑瞬时锁」→**「生产哑火已根治」**随注；原五锚 PASS 不撤（读数真实，锚①②③⑤不受扰）遵裁
- 并档注记：本席观察项2 与 FSD §六.6 8713 迟火抖动三笔同源并档照旧（根治归件③ CTO 域）；COO 转达信（10-08 N3 窗拾取时 d1 项读新卷 c65a0bb6）收讫遵执
- **工作区事故如实注记**：本注记首笔 Edit 落盘后盘面被回写为 HEAD 形致首笔丢失（commit 报 working tree clean 矛盾即勘；时窗邻近 a54a94a8「merge: 收编并行笔（值席落盘防覆盖）」19:36:21+08，疑并行清场动作覆盖未卷改动，归因候值席面核；stash 无残留佐证）——本笔重落笔入库，内容与首笔同源

## 状态条（M-001）

- date 现查：2026-10-07T11:42:55Z（19:42:55+0800 Wednesday）
- 水位自估：低（BOD 快核补验毕落卷·毕即静默；N3 10-08 候令在册——hop1/hop2 实测+互备非循环断言两锚预载，d1 项读新卷 c65a0bb6）
- 末次活动：2026-10-07T11:42:55Z（补验落款现查时刻）

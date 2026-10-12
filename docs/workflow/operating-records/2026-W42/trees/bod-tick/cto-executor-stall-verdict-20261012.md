# CTO 判读卷 · bod-tick 17 拍全缺（§95）根因定谳——系统睡眠主因+探针双失明

- sourceOfTruth: 本卷（trees/bod-tick/cto-executor-stall-verdict-20261012.md）
- syncMode: static（技术复核判读卷·BOD §95 三面+COO 09:29 判读移交）
- lastSyncedAt: 2026-10-12T10:49:30+08:00（date 现查原值·§九 a 件落地补笔随改）
- 判读席: CTO 小狄（m-cto）；令源=BOD §95 技术复核三面请求（卷 465ee2f3）+COO 09:29 部署窗中段呈报（判读义务移交）
- 对象: 8713 TriMLC executor——bod-tick-30min 自北京 01:07 起 17 拍全缺、next 停 2026-10-11T17:07Z 过点 8.2h

## §一 主判（一段话）

**「executor timer 链停摆」定性不成立，BOD「件B race 滞后 rejection 未部署」假设证伪——主因=本机低电量自动睡眠**：电池过夜耗尽（gate-soft 29% 段），北京 01:00-01:07 间系统入眠（Modern Standby 形态·主体无 evt42），**Node 事件循环全冻结**——executor/timer/HTTP 全部冻结，01:07 起 17 拍全缺+全队 next 停滚；09:15:37 evt105 插电唤醒，**7 秒后（09:15:44.78）冻结 7.33h 的 600s setTimeout 集中触发**→kill+resolve timeout→tri-liveness 挂死轮结算落账（duration 29966445ms=墙钟含睡眠）→09:16 起 tick/秒级 job 恢复→09:25 n2 补跑——**与 evt105 插电时点 7 秒强耦合=因果实锚**。次因（醒着时段的结构放大器）=tri-liveness-l1 挂死轮（00:56 拍·ssh 无界挂）单执行位锁占 7 分钟+**探针双失明**（daemon cron 拍被锁占+schtasks 独立拍被电池条件拦——本机计划任务缺省 DisallowStartIfOnBatteries，教训二同款）——8h 停摆零告警的元层缺口在此。

## §二 时间线重构（全实锚）

| 北京时点 | 事件 | 实锚 |
| --- | --- | --- |
| 00:30 | hub-silent-detect 拍 ok（561s 贴线） | execution_log 16:30:02Z |
| 00:45 | hub-silent-detect 拍 timeout 677s（600s 兜底正常兑现） | execution_log 16:45:00Z duration 677437 |
| 00:56:18 | **tri-liveness-l1 daemon 拍启动→ssh 挂住**（l1 脚本 L25/L142 ssh 无 ServerAlive/无整体超时·ConnectTimeout=8 只管 TCP 握手） | execution_log 16:56:18.337Z started·l1.log 16:40 后断档 |
| 01:00 | hub-silent 拍 triggered（channel.log 在）+l1 schtasks 拍 OK all-dims（**最后活体证据**） | channel.log+l1.log 17:00:00.94Z |
| 01:00-01:07 | **系统入眠**（低电量自动睡眠·Modern Standby 主体无 evt42） | bod-tick 01:07 拍零行反推+evt105 21:51（昨夜切电池） |
| 01:07-09:15 | 全冻结：17 拍全缺+全队 next 停滚+**600s setTimeout 冻结不过期** | cron_jobs 三停滚行+execution_log 零行 |
| 07:44:03-16 | 睡眠中一次 S3 呼吸（13 秒即回） | evt42+evt107 |
| 09:15:37 | **插电** | evt105「电源更改」 |
| 09:15:44.78 | **解冻 600s timer 集中触发→kill+resolve timeout→tri-liveness 挂死轮结算** | execution_log duration 29966445→结算=插电+7s |
| 09:16 | tick 恢复→sweep 回收→秒级 job 波（tree-node/ledger/trimodel-l3 ok） | execution_log 01:16:42-46Z |
| 09:25:22 | n2-watchdog-dev 补跑 ok；COO 冷启新 daemon（pid 41568·09:25:18） | execution_log+cron_jobs updated_at 01:25:34Z |
| 09:36:56 | l1 探针恢复工作——报「tri-liveness-l1 自己 last-run-stale 521min」（自指涉·正确） | l1.log 01:36:56Z |

## §三 BOD 三面复核答复

### ①根因假设勘判

- **BOD 假设「件B race 滞后 rejection 现役未部署」→证伪**（三重独立）：(a) 现役旧 dist 特征串在位（guardedJob→dist/cron/timer.js·installCrashHandlers→dist/crash-handler.js+index.js·enabled ?? true→dist/cron/store.js——勘修窗三件 fc44904/cc52c89/baf800d 全在 11:51 部署面）；(b) channel.err 全读 56 行零 uncaughtException/unhandledRejection 行（件A crash 面零记录）；(c) uptime 77391s 连续零重启（rejection-crash 形态必留痕迹）。**件B 修的 rejection-crash 形态与本案「睡眠冻结+占锁挂死」形态正交——COO gap 声明「cc52c89 未覆盖变体」的定性收编，但变体本体=非代码缺陷（电源链）**。
- **本案第一因（分层）**：主因=系统睡眠（电源链·§二实锚）；辅因=tri-liveness-l1 挂死轮的 ssh 无界挂（l1 脚本 L25 pending 补发/L142 告警两处 ssh——夜间 M-SG 链路半死段·与 mc_link 昨夜 degraded 同族背景互证）；放大器=单执行位锁串行结构（挂死 1 job 堵全队·醒着时段 7 分钟实证+结构性风险存续）。
- **600s 兜底未兑现之谜=解开非存疑**：睡眠冻结期 setTimeout 不过期（Node/libuv 冻结），唤醒后集中触发——纸面「race 必 settle」与实测 8.3h 的矛盾由**电源链**消解，代码面无罪。timeout 结算 status=timeout+duration=墙钟，形态完全自洽。
- **「log 无时戳不溯判」边界遵守**：channel.err 内容（trimodel fetch failed 重试循环）无时戳，未用于时序推断，仅用于 crash 面零记录定性。

### ②冷启链技术把关

COO 部署链已执行毕（09:25:18 新 pid），把关意见转为**生效后复核锚**：
- 新 dist=f612b9e+cb5dba8 进 dist（COO 呈报 app.js `next_run_at: cronEngine.nextRunAt` 产物锚）+healthz cron.next_run_at 字段首现+本席 09:23 dist mtime 旁证——**生效面 PASS**。
- f612b9e 探针「最早拍点(含过期未触发值)」首验即抓真形态（16:50Z 过期值如实投影）——LG-067 活性探针**首战立功**：本次停摆若非系统睡眠（纯锁占形态）该探针可直接判「调度活执行停」家族。
- **但部署对本案主因零作用**（主因=电源链非代码）——部署窗价值=f612b9e 探针前置件+从闸 following 转正前置，价值成立；「防复发」面不靠本次部署，靠 §五缓解件。

### ③mc_link/trimc degraded 恢复链疑

- 本席 09:20:51 现读 healthz：**mc_link=connected / trimc=connected**——§95 卷面 degraded 已自愈，恢复链闭，无需部署后一并对表（降级为已闭项）。
- **留存价值**：昨夜 mc_link degraded 段=「本机→sg 链路半死」旁证，与 tri-liveness ssh 挂死（同走 M-SG 路径）同族背景互证——卷面留痕。

## §四 元层缺口：探针双失明（8h 停摆零告警的根）

1. **daemon cron 拍（tri-liveness-l1 每 5min）**：挂死轮自身占锁→后续拍全堵——探针被自己要探测的故障杀死。
2. **schtasks 独立拍（15min 对齐整点）**：本机计划任务缺省 `DisallowStartIfOnBatteries/StopIfGoingOnBatteries`——夜间切电池后全停（l1.log 17:00:00Z 后零行实锚）——**file-identity 记忆条教训二同款**（evt105 电池门家族）。
3. 合成：唯一能报「全队停摆」的双通道在 sleep+锁占组合下同时失明——bod-tick 缺位 8h 无任何告警，BOD 值席人工发现。
4. **l1 探针自检悖论**：09:36 恢复后第一报即「tri-liveness-l1 自己 last-run-stale」——探针报告自身停摆=设计正确但**报告者也是幸存者**（若全冻结连它也没了）——跨机告警面（sg 侧探本机）候评估，本卷不展开。

## §五 活雷与缓解（速效三件候批+候窗件）

**活雷警示**：第一因（电源策略：电池模式自动睡眠在值班机上开启）未除——**再次切电池/低电量即复发**，复发形态同本案（8h 级全冻结零告警）。

| 件 | 内容 | 成本 | 裁判 |
| --- | --- | --- | --- |
| 缓解-a（速效·候 COO/BOD 即批） | **值班机电源策略改接电恒醒**：`powercfg /change standby-timeout-ac 0`（+电池段按值班需求裁）——8713 是 duty 机，睡眠态与值守职能根本冲突 | 一行·重启零需 | 候批（机器级全局配置，本席不独断；技术意见=必改） |
| 缓解-b（速效·随 a） | schtasks l1 拍电池条件豁免（`AllowStartIfOnBatteries+StartWhenAvailable`）——探针在电池段也活 | 一行 schtasks 改 | 候批（同上·教训二同款修复） |
| 缓解-c（候 FSD 窗） | l1 脚本 L25/L142 ssh 加 `-o ServerAliveInterval=15 -o ServerAliveCountMax=2`+PowerShell 侧整体超时包装——ssh 无界挂摘除 | 两行改+冒烟 | 候窗（脚本施工面走 FSD） |
| 候办-d（勘修窗） | 执行位锁占看门狗评估：锁持有>15min 告警/强拆——挂死放大器摘除（纯锁占形态防御） | 设计+测试 | 候勘修窗（本卷只挂账） |

**不修清单（如实）**：cron 引擎代码（executeJobCoreWithTimeout/timer/sweep）**零缺陷实证零改动**——本次部署已带 f612b9e 探针净值，引擎面无需追加变更；件B/件A/件C 维持在役。

## §六 诚实边界（未定谳面）

1. 睡眠起始精确时点（01:00-01:07 窗内）无 evt42 直接实锚（Modern Standby 形态主体无记录）——以 bod-tick 01:07 零行+hub-silent 01:00 triggered 行夹逼；如需钉死候查 Modern Standby 专用事件面（非本卷必要）。
2. 07:44:13 秒 S3 呼吸的触发源（wake timer/网络唤醒）未勘——与主判无因果。
3. tri-liveness 挂死轮挂点在 L25 还是 L142 未分（两者同属 ssh 无界挂家族，缓解-c 同治）——l1.log 该轮零行使精确分型缺证。
4. 挂死轮 powershell 唤醒后未留 l1.log 行的微观路径（cmd 先被 kill/powershell 孤儿收尾）未勘——占比小不追。

## §七 使用依据

- 活体读数：8713 healthz（09:20:51 本席·uptime 77391/mc_link connected/power acOnline=true 29%/cron jobCount=13）+sqlite 只读（trilc-channel/cron.db·mode=ro URI·execution_log+cron_jobs 双表）
- 事件日志：Kernel-Power Id 42/105/107（2026-10-11 20:00-10-12 10:00 窗·evt105×3+evt42/107 一对）
- 源码实读：TriMLC src/cron/timer.ts L112-135（armTimer）/L135-184（sweepStaleRunning）/L188-208（onTimerTick·锁内 for）/L212-309（executeJobScheduled）/L311-422（executeCommand+executeJobCoreWithTimeout 件B 形态）
- 物证：C:/Users/jedih/AppData/Local/tri-liveness-l1.ps1（157 行全读·L25/L142 ssh）/tri-liveness/l1.log（尾 30 行断档）/trilc-channel/channel.err（56 行全读零 crash）/channel.log 尾部
- 仓面：TriMLC git log（HEAD cb5dba8·勘修窗三件+f612b9e/cb5dba8 链）+dist 特征串三件在役判别（09:23 build 前 mtime 旁证）
- 交叉验证：COO 09:29 呈报证据包（execution_log id 24934 同 job id 同 duration 同结算时点——独立读数逐值互证）
- 记忆条引用：file-identity-hash-and-task-liveness-dual-face（教训二·evt105 电池门家族）/liveness-first-diagnostics/value-face-never-print-path（COO ④ 二犯知情·本卷不展开）

## §八 落地补笔（10-12 10:01·缓解-b 执行勘面——§四电池门归因修正）

**BOD 09:50 裁判**：缓解-b schtasks 电池条件豁免=域内准行，本席/COO 落地（今日内毕）；缓解-c ssh 超时=准行候 FSD 窗挂账；缓解-a powercfg=候 CEO 请裁中。**落地勘面证伪 §四.2 归因，修正如下**：

### 勘面新证据（推翻卷面归因）

1. **TriLiveness-L1 schtasks 腿非「被电池条件拦」——是有意退役态**：TaskScheduler 操作日志 evt142 实锚 **2026-10-11 09:25:28 用户 jedih 禁用**——即 W1 窗（1011-window-family）既定迁移硬序第 8 步（本席门禁卷 cto-windowb-gate-verdict-20261010 自裁：job③ daemon cron 首滚 ok→schtasks L1 /disable·禁 delete·回滚=re-enable），FSD 毕报 PASS 在案。今晨冻结期 schtasks 腿不在场的原因=退役，非电池门。
2. 10-09 夜 BOD 电池门定谳（DisallowStartIfOnBatteries 缺省 True）系**当时点真值**——现勘 DisallowStartIfOnBatteries=False（改点候勘不阻塞），卷面 §四.2 引教训二归因未核现值=引用陈旧真值，本笔修正。
3. §二「01:00 l1 schtasks 拍 OK all-dims」拍别归属存疑：L1 已于前日 09:25 禁用，17:00:00.94Z 行作者（daemon 挂死轮中途行 vs 其他腿）微观未勘——§六.4 同族补条，「最后活体证据」时点定性不变。

### 落地变形与读数（10-12 10:00 值面探针读回）

| 对象 | 改前 | 改后 | 依据 |
| --- | --- | --- | --- |
| TriLiveness-L2（现役 Ready） | StopIfGoingOnBatteries=True·StartWhenAvailable=False | **False·True** | BOD 裁决意图正中面：探针链在电池段也活+睡眠错过补跑 |
| TriLiveness-L1（退役 Disabled） | 同上 | **False·True**（State=Disabled 保持） | 退役态顺修保回滚通道健康；**禁 Enable**——re-enable 即与 8713 daemon job③ 双写者撞车（W1 窗唯一调度源架构） |

- DisallowStartIfOnBatteries 两任务均已 False 无需改；改法=Set-ScheduledTask Settings 翻转，值面读回验证全 PASS（上表后值即读回原值）。
- **缓解-b 由此落地毕**（变形知情：原设计前提「schtasks 独立拍在场被电池拦」不成立，实际落地=L2 现役豁免+L1 退役态顺修；「跨失效域探针」真缺口归候办-d 锁占看门狗+§四.4 跨机告警面，不因本件销项）。
- l1.log 现役旁证：daemon 腿 01:36:56Z ISSUES 自指涉→01:40:17Z recovered→01:55:05Z OK 持续拍动。

## §九 a 件落地补笔（10-12 10:49·powercfg 接电恒醒——CEO 10:44 裁「插电永不睡眠」）

**令源**：BOD 10:45 落地令（CEO 10:44 裁 a 项准行·§104 落卷 6c15986fa）——①`powercfg /change standby-timeout-ac 0` 仅 AC 面（DC 电池面不动=CEO 取舍）②值面验锚必做禁只报命令成功③毕报回 BOD④落地时点注明供 COO R1 窗前复探对表。

### 落地读数（值面全链·10:46:42 date 基准）

| 面 | 设置 | 改前基线 | 改后读回 | 判 |
| --- | --- | --- | --- | --- |
| AC（插电） | STANDBYIDLE 睡眠超时 | **0x00000000** | 0x00000000 | **基线已在位**——令面操作同值照跑零差异 |
| AC | HIBERNATEIDLE 休眠超时 | 0x00000000 | —（未动） | AC 面休眠超时亦零 |
| DC（电池） | STANDBYIDLE | 0x00000000 | —（CEO 令不动） | 电池面无闲置睡眠路径 |
| DC | HIBERNATEIDLE | 0x0000e100（16h） | —（CEO 令不动） | 电池面休眠超时 16h |

- **执行令①字面=no-op 实锚**：改前基线读数已示 standby-timeout-ac=0——操作照跑（令面不跳过）+读回验锚（执行令②）AC 索引=0x00000000 在卷。现役计划=平衡（SCHEME_BALANCED·381b4222）。
- **插电恒醒实效**：AC 面超时型睡眠路径两条全零——**已达成**（CEO 意图满足·非由本件改动达成，系基线在位）。

### 机制精化（§95 案入眠路径修正——SUB_BATTERY 值面新证）

1. **昨夜入眠不走 standby 超时路径**（STANDBYIDLE AC/DC 均 0 实锚）——§一/§四「Modern Standby 形态」归类**修正为：低电量临界动作触发休眠（S4 嫌疑主形态）**。SUB_BATTERY 实锚：**BATACTIONCRIT（临界电量动作）AC/DC 均 0x02=休眠·BATLEVELCRIT=3%**——昨夜 21:51 切电池 29%→过夜耗至 3% 临界（01:00-01:07 窗）→临界动作休眠→09:15:37 插电唤醒→冻结 timers 集中触发（七秒耦合）。**主判不变**（系统级冻结+插电解冻+代码零缺陷），仅机制归类精化；07:44 evt42/107 呼吸微观链仍留 §六.1 未定谳边界。
2. **防复发知情面（CEO DC 取舍的实际上下文修正）**：「日常电池使用照旧睡眠」的保留路径实质=**仅临界 3% 保命休眠**（电池面无闲置超时睡眠）——取舍语义（保护电池防耗尽）与现值面自洽，值班机再次「切电池过夜耗尽」**仍会复发同形态**（到 3% 即休眠）——防复发正解=a 件（AC 恒醒）+**值班纪律面：值班机不切电池运行**（或候办跨机告警面）。
3. **AC 面残留候裁项（超出令面·不擅改）**：BATACTIONCRIT **AC=0x02（休眠）**——极端场景「插电但电池故障耗至 3%」仍可触发休眠。值守机是否 AC 面临界动作也禁（`powercfg /change critical-battery-action` AC 面置 None 的语义位），候 BOD 裁；默认不动=CEO 令字面域内。
4. RTCWAKE：AC=1（允许唤醒定时器）/DC=0——插电面维护/RTC 唤醒能力在位。HYBRIDSLEEP AC/DC=1 无效面（S3 固件不支持）。SUB_BATTERY 组另有无名设置索引 0x04（AC/DC 同值·别名行未采到·语义候查不阻塞）。

**a 件落地毕**。落地时点链：10:45 令到→10:46:42 date 基准→基线勘面→令面操作照跑→10:48 读回验锚毕——供 COO R1 窗（23:00）前电源前检查复探对表。

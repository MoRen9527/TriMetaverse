# CTO 判读卷 · bod-tick 17 拍全缺（§95）根因定谳——系统睡眠主因+探针双失明

- sourceOfTruth: 本卷（trees/bod-tick/cto-executor-stall-verdict-20261012.md）
- syncMode: static（技术复核判读卷·BOD §95 三面+COO 09:29 判读移交）
- lastSyncedAt: 2026-10-12T09:45:35+08:00（date 现查原值）
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

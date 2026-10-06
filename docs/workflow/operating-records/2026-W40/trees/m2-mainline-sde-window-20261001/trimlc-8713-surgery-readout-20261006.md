# TriMLC 8713 根治包手术 · SDE 施工读数卷（§四.1/§四.2/§四.3+收口断言毕）

- sourceOfTruth: 本件（8713 手术施工读数正身；方案卷=同目录 trimlc-8713-fix-proposal-1p-20261006.md，CTO 放行 10:42+18:2x 回执「§四序照案打头，术后读数照三件套+首切锚」）
- syncMode: static
- lastSyncedAt: 2026-10-06T19:25:30+08:00（date 现查原样粘贴）
- 施工席: SDE 小布（m-sde）；施工窗=2026-10-06 18:27-18:48；硬门=全过（见 §六）

## 一、序① 8711 正形拉起者追查（破案）+序①A 提权验证

### 1.1 破案定谳：8711 昨晚拉起者=`\TriRLC Daemon` LogonTrigger 任务

证据链（全部原样读数）：

| # | 读数 | 来源 |
| --- | --- | --- |
| 1 | trirlc-watchdog.log 尾行=10-05T17:46:05 DOWN(fail 1/3)→reviving + 17:51:02 recovered；**19:50 窗零行** | `%LOCALAPPDATA%\trirlc-watchdog\watchdog.log` |
| 2 | watchdog 跑点族秒位 :02±（17:46:05/17:51:02 推 5min 周期）→**19:50:31 非跑点**=watchdog 通道排除 | 同上推演 |
| 3 | `\TriRLC Daemon` 任务：**LogonTrigger**/jedih/InteractiveToken/LeastPrivilege/Task To Run=`trirlc-daemon.cmd`/RegDate 2026-08-14/Last Run 10-06 09:04:45 Result 0 | schtasks /v + 任务 XML |
| 4 | trirlc-daemon.ps1：node pin=`C:\nvm4w\nodejs\node.exe`+`cli.js start --port 8711`（daemonize 后中间进程退出） | 脚本全文（ASCII-pure，D-15 注释在册） |
| 5 | System log：**19:49:26 Id=1074** MoNotificationUx.exe 代表 jedih 发起重启（操作系统: Service Pack **计划内**）+19:49:41 Id=6006 日志服务停 | Get-WinEvent System |
| 6 | 机器 **LastBootUpTime=2026-10-05 19:49:52**；console jedih ID=1 Active 至今 | Win32_OperatingSystem/qwinsta |
| 7 | 8711 pid 16500 起 19:50:31/pidfile 写 19:50:35(+4s)/CmdLine=`C:\nvm4w\nodejs\node.exe ...dist\index.js`（nvm4w 形）/父 14956 已死 | 前窗勘验在案 |

时序闭环：19:49:26 WU 计划内重启（jedih 确认）→19:49:52 开机→jedih console 登录→**19:50:31 LogonTrigger 触发 TriRLC Daemon 任务**→cmd→ps1(nvm4w pin)→cli.js start→16500 起（父 daemonizer 退出=父已死形态吻合）→19:50:35 pidfile。

**判读（CTO 核③语义精确化）**：「正确拉起模板已实证存在」成立，**模板=`\TriRLC Daemon` LogonTrigger 任务**；但拉起窗=「重启+登录」窗非无人窗——模板不覆盖 jedih 未登录窗。23980 破案钥匙面：**TriMLC 侧无对应 LogonTrigger Daemon 任务**（本机任务全景：Seat-Watchdog/TriHubWatchdog/TriMLC-Watchdog/TriModel-Watchdog(Disabled)/TriRLC Daemon/TriRLC-Watchdog 六项，TriRLC 独有 Daemon 任务）。

### 1.2 8713 缺位一夜根因面定谳（ archaeology 付产品）

- TriMLC-Watchdog log（`trilc-channel\watchdog.log`）尾行=10-05T17:47:05 DOWN→reviving+17:52:03 recovered，**此后至 10-06 全天零行**。8713 down 中每跑点必写 DOWN 行（跑点族 :02/:07/... 分位）→19:52-10:05 窗全空=**TriMLC-Watchdog 任务该窗停摆实证**（非 stand-down 锁死——up 自愈路径在 v1 即有）
- 结论：昨晚登录窗 8711 有 LogonTrigger 拉起、8713 零通道（无 Daemon 任务+watchdog 停摆）=一夜缺位。**watchdog 任务停摆根因候 admin 窗**（TaskScheduler Operational log 未启用=根堵点，启用候 admin 窗）

### 1.3 序①A systemprofile 落点提权验证

`Test-Path C:\WINDOWS\System32\config\systemprofile\.trimetaverse` → Access denied（非提权面存在性不可判）——**候 admin 窗**，如实挂起不硬造。

## 二、序② l2-scan 解卡施工（护栏形全程）

### 2.1 S0 前置自检 ✓

- token 进程内加载（掩码 len=64 head=5064 tail=ef86，值零回显零落盘）；jobs API HTTP 200
- **jobCount=7 全景**：trimodel-l2-scan **running**（卡态在案）/trimodel-l3-remind idle/plane-shift-local-align idle/tree-node-patrol idle/ledger-watchlist-patrol idle/hub-silent-detect running（后排除）/joint-review-demand-pool idle+disabled
- store 备份在位：`%LOCALAPPDATA%\trilc-channel-backup-20261006\`（cron.db 1482752B+shm+wal+json 四件齐）

### 2.2 施工时序（原样读数）

| 步 | 时刻 | 动作 | 读数 |
| --- | --- | --- | --- |
| S1 | 18:34:12 | TriMLC-Watchdog **Disable**（护栏） | Status: Disabled ✓ |
| S2a | 18:34:27 | POST /shutdown（带 token 正途） | HTTP 200 → pid 31800 退+port 8713 释放 @18:34:30（**3s 优雅退**） |
| S2b | 18:34:42 | channel.cmd 冷启（复活链同款形） | healthz 200 @18:34:45（boot 3s）；**listen pid=1604==pidfile ✓**；proc=node 起 18:34:42 |
| S3 | 18:35+ | 三件套自验收 | healthz ok:true/cron jobCount=7 **degraded:false** consecutiveFailures:0/mc_link connected/trimc connected/uptime 20s |
| S4 | 18:44:38 | TriMLC-Watchdog **Enable**（§四.3 改造毕后） | Status: Ready/Next Run 18:47:00 |

### 2.3 l2-scan 卡态定性（归位候 FSD 件③）

- patch 前值面全档：state=running/nextRunAt=**2026-10-05T09:44Z（过期 25h）**/lastRunAt=09:42Z lastRunStatus=**ok**/errorCount=17/runCount=5661/schedule=every 2min
- **因果链闭环**：10-05 17:44 轮进 running（updatedAt 实锚）→ 8713 于 17:47 前窗死亡（watchdog DOWN 行实证窗）→ running 态 store 持久 → 10:05/18:34 两轮 boot 均读回卡态（boot 清扫=FSD 件③未施工，方案卷「重启即清」预期**不成立**，如实勘正）
- **PATCH state=idle 实证无效**：PATCH HTTP 200 ok:true 但响应体+GET 均 state=running（重放取证一致）；无 catch-up 触发（updatedAt 冻结 patch 时刻、零轮转写、无 spawn 子进程）
- **机理勘正（FSD 白盒根因 18:50 到达，勘补留痕）**：本席初判「引擎运行中守卫拒改态」**机理归因有误**——真因=**state 根本不在 CronJobPatch 可写清单**（types.ts L55 起：name/schedule/systemPrompt/command/roleId/enabled 等，state 不在），载荷 state 键被静默忽略→200+原态回显（「200 接受」=处理器 ok:true 非状态变更）。force 亦不通：timer.ts runJobNow L366 running 检查**先于** force 判定（force 只豁免 enabled 检查）。state=running 时 API 零写路径
- **归位正形（FSD 供）**：daemon-down 窗直接 SQL——stop → `UPDATE cron_jobs SET state='idle' WHERE id='<l2-scan-id>'`（sqlite3 CLI 正常处理 WAL）→ 冷启（boot loadAll 全新读→idle）。**禁** daemon 活着时外部 SQL 改（内存缓存看不到：WAL 写不 bump 主 db mtime+loadAll no-op——FSD 10-06 TriRLC 白盒同签名实证）；备选 DELETE+重建不推荐（级联删 execution_log+换 id）
- **外部零归位通道定谳（维持）**：API 零写路径+boot 不清+store 持久 → l2-scan 归位候 FSD 件③根治（boot 清扫）或下个 8713 合法重启窗并批 SQL 归位（本卷卡态=两路天然验收样例）；不阻本窗硬门（调度推进面实证见 §五）；**不再连轴重启**（b14 首切观察窗稳定性读数优先，本席裁量）
- hub-silent-detect 排除卡嫌：updatedAt 18:33:42=旧进程死前正常归位（短周期 job 抽样恰逢执行中）

### 2.4 b14 首切实锚（CTO 观察锚①）

pid 1604 起 18:34:42 > 今晨 TriCode dist 部署时点 + sg/TriMLC node_modules/@trimetaverse/tricode SYMLINK 活连（b14 卷 §一实证）→ **8713 现役进程已消费 0.2.1-wave3**（进程面证据=启动时刻+活连形态；内存无旧代码残留可能）。

### 2.5 FSD 件④ channel.cmd 新版实跑首证（计划外兑现）

FSD 18:33:25 落新版（TRILC_DATA_DIR 字面化+USERPROFILE pin，bak-20261006T183325）→ 本席 18:34:42 冷启**吃到的即新版**（时戳对表 18:33:25<18:34:42）→ boot 3s+三件套全过=**件④实跑首证绿**。已回执 FSD（18:38）。

## 三、序③ watchdog.ps1 v2 改造（三探+登录守卫+90s 自验）

### 3.1 设计（方案卷 §四.3 授权面内）

- **三探 AND 判活**：①healthz 200（5s 超时）②pidfile 对验（`~/.trimetaverse/trilc-8713.pid`==8713 LISTEN pid）③store 活性（jobs API 带 token；**jobCount=0 中性过**，异常/超时/token 缺=败——方案卷 §一语义）
- **登录守卫 fail-closed**：revive 前 qwinsta 扫 console/rdp 会话 jedih+Win32_ComputerSystem.UserName 双探；探不到/失败=**不 revive+`[ALERT-GUARD]` 行**
- **revive 后 90s 自验**：healthz 轮询（5s 间隔），OK/FAIL 行落 log
- stand-down 语义保持（3 连败 ALERT；up 自愈 v1 即有，保持）；stop-flag 尊重保持；token 进程内读 channel.cmd set 行，零 log 零输出
- **全 ASCII**（正文 0 非 ASCII 字节实锚）+UTF-8 BOM（D-09）+PSParser 零错+PS 5.1 兼容（launch vbs=powershell.exe 5.1）

### 3.2 备份与版本锚

- 改前备份：`%LOCALAPPDATA%\trimlc-watchdog.ps1.bak-pre-v2-20261006T184100`（sha256 头 30DC7F1160BE，与原件哈希一致断言 ✓）
- 回滚通道：copy bak→watchdog.ps1 即回 v1 行为（单探 healthz）

### 3.3 冒烟矩阵（探针副本法，revive 行替换抑制防撞 port；副本已删）

| 形 | 副本 | 断言 | 结果 |
| --- | --- | --- | --- |
| up 形 | smoke | exit 0+log 零新增 | ✓ 静默 |
| up 自愈 | 真 v2（cntF=2 预置） | recovered 行+cntF 清+exit 0 | ✓ 自愈路径实证 |
| 错位形（探2败） | smoke（pidfile 临时移走） | DOWN(fail 1/3)行+guard 过+revive 抑制标记 | ✓ 判活+守卫主体正确 |
| 无人形（guard 败） | smoke-closed（会话探强制空） | **[ALERT-GUARD]**+fail 2/3+exit 1+零 revive | ✓ fail-closed 拦死实证 |

- v2 在岗自然轮实证：**18:47:01 任务跑 Last Result 0+log 零新增**（up 静默）——v2 首自然执行 ✓
- **语义差注记（如实）**：smoke 副本 revive 抑制后 self-check 段照跑→8713 真活→写「self-check OK」伪行；生产真 DOWN 场景 self-check 正确 FAIL。边缘态：「daemon 活+pidfile 错位」时 v2 判 DOWN→revive 撞 port→新进程 EADDRINUSE 崩退自净（channel.cmd 纯拉起无 stop 面，v1 5661 轮行为史佐证无持久损害）——方案卷三探 AND 权威口径内（store-blind 假活红线优先），接受并注记
- 冒烟段 log 行自识：18:43:10 DOWN/18:43:15 self-check OK/18:44:08 ALERT-GUARD/18:44:25 recovered 四行为冒烟产物（时间窗+上下文可辨，append-only 留档）

## 四、§四.5 收口断言

| 项 | 读数 | 判 |
| --- | --- | --- |
| 三件套（术后） | healthz ok:true+pid 1604==pidfile+jobs API 200 jobCount=7 | ✓ |
| b14 首切锚 | pid 1604 起 18:34:42>dist 部署，0.2.1-wave3 进程面兑现 | ✓ |
| watchdog 三探冒烟 | §三.3 矩阵三形全绿（错位形模拟经探针副本） | ✓ |
| watchdog 在岗 | 18:47:01 自然轮 Result 0 零误行 | ✓ |
| l2-scan 归位 | PATCH 守卫拒实证→候 FSD 件③（外部零通道定谳） | △ 如实挂起 |
| 全 7 job 推进 | tree-node-patrol up=18:47:18/hub-silent-detect 18:47:16/ledger-watchlist 18:45:00（boot 后多轮推进）；l3-remind 18:30（周期内在档）；plane-shift/joint-review 长周期或 disabled 正常态 | ✓ |
| 回滚方案态 | store 备份四件+watchdog v1 bak+channel.cmd FSD bak 三层在位未动 | ✓ |

**手术窗硬门全过，验收绿达成（l2-scan 归位单项挂起候 FSD 件③，方案卷已预载该项候窗语义）。**

## 五、观察项（不阻门）

1. watchdog 任务 10-05 19:50 后停摆根因候 admin 窗（TaskScheduler Operational log 未启用=根堵点；启用+复验候 admin 窗，涉 UAC 交互需人在位）
2. **TriMLC Daemon LogonTrigger 任务缺失**（对照 TriRLC 模板实证）=候批新件：登录窗自拉支柱补齐——**CTO 裁 A 18:52 APPROVE 即窗，执行态见 §七（候提权完成）**
3. l2-scan 归位候 FSD 件③或下个 8713 合法重启窗并批 SQL 归位（正形见 §二.3 勘补段）；件③施工时本卷 §二.3 卡态=验收样例；TriMLC boot 清扫家族性缺失 FSD 已报 CTO 候排（TriRLC 侧 resetStaleRunningJobs 03b3220 今日已落可对抄）
4. cron PATCH 响应体含 command 字段全量回显（API 面改进候 FSD）；本窗两笔命令行头 50 字符入 transcript（低敏非钥值，如实注记）
5. 序①A systemprofile 提权验证候 admin 窗（与观察项 1 同窗并办）
6. 8711 面零触碰红线全程遵守（TriRLC-Watchdog 未 Disable、8711 进程/pidfile/脚本零动作，只读勘验）

## 六、使用依据

- 方案卷 trimlc-8713-fix-proposal-1p-20261006.md（§四施工序+§五风险回滚，CTO 放行 10:42+18:2x 回执）
- CTO 知会 18:1x（首切观察锚+8711 考古零部署约束）；COO 触发链 18:2x（验收绿直达+22:30 兜底红线）
- FSD 件④知会 18:36（channel.cmd 新版时戳对表）；实勘读数全原样（本卷 §一-§四）
- 纪律：D-04 时刻现查/D-09 BOM+冒烟/D-17 零拓扑擅动/8711 零触碰/token 掩码/禁裸杀（/shutdown 正途）

## 七、裁 A 执行勘补（2026-10-06 18:52-18:59 增补）

CTO 三裁 18:52 到达（卷 851382a9）：A=即窗注册 LogonTrigger 任务（三约束：禁手动 run/验证=query 在册+下次自然登录窗实测/语义注记入卷）；B=候 admin 窗并办（TaskScheduler Operational log 启用+systemprofile 提权验证）；C=korw 本态冻结保留禁手工强改 store，8713 下次冷起窗真刀验收（前提=FSD 段2 前补 TriMLC 侧 resetStaleRunningJobs 移植，已令）。另 CTO 18:5x 采准信：勘正采认+排程采准（三得时点三席咬合）+b14 首切稳定性裁量确认。

### 7.1 裁 A 非提权注册面三通道全拒（终读数）

| 通道 | 读数 | 时刻 |
| --- | --- | --- |
| `schtasks /create /sc onlogon /ru jedih /rl limited` | **ERROR: Access is denied** | 18:53:22 |
| `Register-ScheduledTask -Xml`（对抄 XML，根夹） | 拒绝访问 | 18:55 |
| COM `RegisterTaskDefinition`（`\TriCompany` 子夹，flag 6+InteractiveToken 3） | **0x80070005 E_ACCESSDENIED** | 18:57 |
| COM `CreateFolder("\TriCompany")` | **成功**（建夹放行、注册不放行=加固面边界实证） | 18:57 |

- **定性**：本机 Win11 新版 TaskScheduler 加固面=**任务注册全提权域**（含子夹；LogonTrigger 非提权零通道）。旁证：`\TriRLC Daemon` RegDate 2026-08-14=提权时代注册产物。本会话 Medium Mandatory Level 实证（非提权）
- **对抄 XML 构造毕**：仅 URI/Date/Command 三点异于模板，Principal（jedih/InteractiveToken/LeastPrivilege）+Settings（含 ExecutionTimeLimit PT72H——TriRLC 先例 daemonize 父退形态不触及）逐项原抄

### 7.2 HOLD 依护栏+预置（本席裁量，候裁）

- **UAC 提权不单方面触发**：提权确认门=人在位（jedih console Active 实证在位但不知情），单方面弹 UAC=惊扰+2min 超时风险——依「提权面零擅动」护栏转 HOLD，候 CTO 裁执行通道
- **预置提权注册脚本**：`C:\Users\jedih\AppData\Local\trimlc-daemon-logon-task-register.ps1`——对抄 XML 内嵌+根夹注册+三点 query 断言+**anti-run 内建**（零 /run 零 Start-ScheduledTask）；BOM ✓+PSParser 0 错 ✓（parse-only，未执行）
- `\TriCompany` 子夹留置（空夹无害；root 对抄注册优先，子夹为 fallback 候选落点）

### 7.3 两路执行通道候裁（CTO/COO）→ **已裁（COO 19:03 裁定，CTO 通道裁 19:0x 卷 91b35acd 收悉）**

1. ~~UAC 当面即窗~~ **今晚不排**（CTO 四理由；应急备选保留：8713 再缺位或 BOD/CEO 明示即补，UAC 材料随令即成）
2. **并入明日 admin 窗=已定窗位**：**2026-10-07（周二）18:00 黄金段头**，估 15-30min；并办序=①TaskScheduler Operational log 启用→②systemprofile 提权验证→③TriMLC Daemon LogonTrigger 注册（§7.2 预置脚本，扩三件并办版）；前提=宿主 jedih 在位 UAC 当面确认——**18:00 前本席探在位态**（qwinsta/CSU 机器面+问 BOD 动线），在位即发不在位同窗内顺延；与 N2 施工（FSD 主车道）不同资源面并行无碍

### 7.4 三约束遵守态

- ①禁手动 run：全程零 run 触发（脚本 anti-run 断言在位）；②验证=query 在册三点（脚本内置）+下次自然登录窗实测（候窗）；③语义精确化注记=本段+§一.1 判读在案（**模板覆盖「重启+登录」窗非无人窗**——无人窗守卫=watchdog v2 登录守卫 fail-closed 互补，双层拼图闭合）
- 裁 B/C 知悉态：B 候窗（两路候裁 7.3-2）；C korw 冻结遵守（本席零 store 手工触碰；8713 下次冷起窗三得=件③移植生效+SQL 归位+korw 真刀，候 FSD 移植毕+段2 触发链）

### 7.5 段2 交接 dist 对表勘验（FSD 毕信 19:06 交接项，本席 19:07 read-only 现勘）

| 项 | 读数 |
| --- | --- |
| 仓向双证 | `D:\Code\ai\TriMLC` origin=github.com/MoRen9527/TriMLC.git ✓（非 TriRLC，跨仓防混） |
| 本地顶 | **03c6197**（boot recovery sweep TriMLC 移植——残留 running 归位 idle 先于补跑，l2-scan 永卡族根治，LG-064 §八裁决②）与 FSD 报一致 |
| 触及面 | src/cron/{service+store+timer}.ts+test/cron-boot-recovery.test.ts 96 行，共 136 insertions |
| src 侧符号 | resetStaleRunningJobs 在 service/store/timer 三文件在位+timer.ts L34 接口声明 ✓ |
| **dist 现态** | mtime=**10-04 03:05**（旧 build）+resetStaleRunningJobs **零命中**=移植码未带出实证 |
| **下窗施工项（钉死）** | **8713 冷起前必 `npm run build`**——同窗一次带出 03c6197（件③移植）+2b1709d（updateJobRun saveCronStore 补刷，行为锚测试两例）；现役 pid 1604 跑 10-04 dist，两笔均在冷起窗生效 |
| 段2 毕读数（FSD 报，本席转记） | 8711 pid 33280 LISTEN==pidfile+healthz 200+heartbeat 已跑；stop 段修②活体证据（实报 unavailable 不谎报）；8711 cron store 0 jobs→boot sweep no-op；锚1/2/3 齐（锚3 token ACL 有 CodexSandboxUsers(RX) 继承条目候 CTO，主面达标未擅动） |

### 7.6 明日双窗序排定+8713 合流冷起窗施工预案（COO 19:09 排定，CTO 19:1x 知会同口径）

**双窗串行**：①18:00 admin 提权窗（§7.3-2，17:50 自挂提醒 6651f5ce）→②**8713 合流冷起窗紧随（估 18:20-19:00，本席车道）**→③N2 施工 19:30 后 FSD 车道（双窗毕+8713 稳定在役后方交）。

**冷起窗施工序预案（护栏形，照今晚 18:34 先例+build 前置优化）**：

| 步 | 动作 | 自检/回滚锚 |
| --- | --- | --- |
| S0 | 三件套基线读数+**store 备份刷新**（当日态新目录）+**dist 备份**（10-04 现役 dist 改名留 bak=回滚锚） | 备份文件在位断言 |
| S1 | TriMLC-Watchdog **Disable**（护栏） | Status: Disabled |
| S2a | **在役先 `npm run build`**（TriMLC 仓，零影响——在役进程不消费新 dist；build 炸=中止窗零损，8713 照旧在役） | build exit 0+dist 新 mtime+resetStaleRunningJobs 命中 |
| S2b | POST /shutdown（token 正途） | port 8713 释放 |
| S2c | **冷启**（新 dist 即刻生效）——**S2c 前不做 SQL**（治标步改兜底，见双分支） | healthz 200+listen==pidfile |
| S2d | **korw 归位双分支**（COO 治标令 19:20 并入+CTO 裁 C 真刀验收的调和序）：**分支 A（主）**：冷启后读 korw state——boot sweep（03c6197）自动归位 idle=**真刀验收达成**，SQL 跳过；**分支 B（兜底）**：sweep 未归位（03c6197 缺陷实证）→POST /shutdown 二次→停机态 sqlite3 `UPDATE cron_jobs SET state='idle' WHERE id='cron_muh6shv0_korw'`（**state 单字段最小写面，nextRunAt 禁抹不碰**——过期值保留，冷启后调度器 catch-up 立即补跑+自算刷新 nextRun=COO「重算」终态由调度器达成零手算误差）→再冷启 | 分支 A：state=idle 且零 SQL 写面；分支 B：SQL 回读 idle |
| S4 | **korw 归位读数四件（毕报带）**：①state=idle 落地 ②nextRunAt 合理（调度器自算非冻结值）③**首滚验证**（补跑一轮正常收尾，非再挂）④saveCronStore 补刷（2b1709d）值面抽查 | jobs API 值面+三件套全绿 |

**双分支序设计理由（报备 COO/CTO）**：SQL 治标前置与 CTO 裁 C「korw 本态=件③验收样例真刀」互斥（同一样本二选一）——sweep 优先=保全 CTO 真刀活体样本；sweep 失败时 SQL 兜底=COO 治标终态保证（state=idle 必达）。最坏路径=两次停机（down 窗仍分钟级内，黄金窗无碍）；分支 A 路径 down 窗=单次冷启。若 sweep 归位成功，sweep 行为实证+ korw catch-up 首滚=一次冷起双验收。
| S5 | TriMLC-Watchdog **Enable** | Status: Ready+下轮自然执行零误行 |
| 毕报 | 三件套读数→COO+CTO | 卷收口段 |

- daemon-down 窗压至 S2b-S3（SQL+boot 秒级）——build 前置于 shutdown 前=down 窗最短化（FSD「冷起前须 build」口径的执行序精确化，语义不变）
- 2b1709d 同窗带出（updateJobRun 尾补 saveCronStore，行为锚测试两例在 03c6197 同顶）
- 回滚三层：store 备份+10-04 dist bak+watchdog v1 bak（今晚 §四 回滚方案态延续）
- **STE 回归读数互引（19:1x，卷 2ef063b9→b2ebb06f 采录入卷）**：调度器本体 6/7 job 健康滚动+korw 卡态独立复确认（state=running/updatedAt 10:39:54Z 被动 touch 未解卡=PATCH 零写路径旁证，与 §二.3 勘补互证）。STE 建议「PATCH state→idle」**不可行已勘正回执**（可写清单白盒+本席两轮 PATCH 实证+force 先后序三重堵死——STE 三重全采，「键存在≠值面生效」家族候 CAO 并档）；korw 冻结=CTO 裁 C 明令今晚零动作（STE ②遵令确认）。**补测触发点锁定（STE ③对表）**：明晚冷起窗毕本席毕报直达 STE=开跑信号，锚2/3/5 补测走 19:00-19:30 窗缝，五锚终态随卷直达 COO+BOD。STE 增量：挂死根因侧读数（stub.log 末行 10-03 09:42+08→10-05 09:42Z 执行无 log=早期挂死未退出，为何挂死候 STE 窗另查，与卡态残留两层分立）；degraded per-job max 掩蔽案例+1（候办维持，TriMMC 形对齐）

# TriMLC 8713 根治包手术 · SDE 施工读数卷（§四.1/§四.2/§四.3+收口断言毕）

- sourceOfTruth: 本件（8713 手术施工读数正身；方案卷=同目录 trimlc-8713-fix-proposal-1p-20261006.md，CTO 放行 10:42+18:2x 回执「§四序照案打头，术后读数照三件套+首切锚」）
- syncMode: static
- lastSyncedAt: 2026-10-06T18:48:17+08:00（date 现查原样粘贴）
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
- **PATCH state=idle 实证被拒**：PATCH HTTP 200 ok:true 但响应体+GET 均 state=running（重放取证一致）——**引擎运行中守卫拒改态，返回 ok+原态**；无 catch-up 触发（updatedAt 冻结 patch 时刻、零轮转写、无 spawn 子进程）
- **外部零归位通道定谳**：PATCH 守卫拒+boot 不清+store 持久 → l2-scan 归位候 FSD 件③根治（boot 清扫即根治此态，本卷卡态=件③施工验收天然样例）；不阻本窗硬门（调度推进面实证见 §五）
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
2. **TriMLC Daemon LogonTrigger 任务缺失**（对照 TriRLC 模板实证）=候批新件：登录窗自拉支柱补齐——涉新增拉起面（D-17 敏感面），**候 CTO 裁**，本席不擅动
3. l2-scan 归位候 FSD 件③；件③施工时本卷 §二.3 卡态=验收样例
4. cron PATCH 响应体含 command 字段全量回显（API 面改进候 FSD）；本窗两笔命令行头 50 字符入 transcript（低敏非钥值，如实注记）
5. 序①A systemprofile 提权验证候 admin 窗（与观察项 1 同窗并办）
6. 8711 面零触碰红线全程遵守（TriRLC-Watchdog 未 Disable、8711 进程/pidfile/脚本零动作，只读勘验）

## 六、使用依据

- 方案卷 trimlc-8713-fix-proposal-1p-20261006.md（§四施工序+§五风险回滚，CTO 放行 10:42+18:2x 回执）
- CTO 知会 18:1x（首切观察锚+8711 考古零部署约束）；COO 触发链 18:2x（验收绿直达+22:30 兜底红线）
- FSD 件④知会 18:36（channel.cmd 新版时戳对表）；实勘读数全原样（本卷 §一-§四）
- 纪律：D-04 时刻现查/D-09 BOM+冒烟/D-17 零拓扑擅动/8711 零触碰/token 掩码/禁裸杀（/shutdown 正途）

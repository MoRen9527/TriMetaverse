# FSD 毕报 · 本机段 TriMLC 8713 S4U 换形（10-11 深夜窗令·BOD 22:44 窗提前·10-09 夜执行）

- sourceOfTruth: 本件（trees/1011-nightly-window/fsd-s4u-migration-report-20261009.md）
- syncMode: static（毕报卷·落盘即锚）
- lastSyncedAt: 2026-10-09T15:20:06Z（date 现查原值 23:20:06+08）
- 执行位: FSD 小全（m-fsd）
- 令源链: 窗令正身=coo-window-order-20261011-nightly.md @a54741ef（本机段=S4U 换形·门 H1-H4）+治理稿 trimlc-daemon-hardening-plan-20261009.md @6141a459（§二两入口合一·§四回滚姿态）；BOD 22:44 窗提前令（10-09 22:30 开窗·窗偏 13 分）+BOD 22:52 转呈 CEO 裁 A 案（RunAs+人工 UAC 确认链）
- 窗况: 22:30 开窗→22:3x 注册权限四路径全断→停+报候裁→22:52 CEO 裁 A→智力活前置+RunAs 授权链→REGISTER_OK→22:55:56 任务拉起→H1/H3 全绿→23:20 毕报落盘。权限断点与裁 A 授权全程随程报 BOD 在案。

## 一、结论

**本机段 S4U 换形毕：注册-拉起-H1/H3 双门全绿·毕报五实锚全齐（§二）。H2 待机专项未跑（BOD 22:52 已示意另约窗·维持撤单）·H4 7 天自然观察挂账（10-18 巡检·窗令 §四）。H2 候窗位=10-11（周日）22:30 原窗位（§八）。**

## 二、毕报五实锚（BOD 22:52 清单逐项）

| # | 实锚 | 读数 |
|---|---|---|
| 1 | S4U 任务注册态 | Register-ScheduledTask 'TriMLC Daemon' OK·register-result.txt=`REGISTER_OK LogonType=S4U State=Running`·现读：State=Running·LastRun=2026/10/9 22:55:56·LastTaskResult=267009（0x41301=SCHED_S_TASK_RUNNING 实例运行中·正常态）·XML 回读（Export-ScheduledTask）=LogonType S4U+ExecutionTimeLimit PT0S+Boot/Logon 双触发器在位+**DisallowStartIfOnBatteries=false+StopIfGoingOnBatteries=false**（电池态可启动可续跑——本夜电池态下持续运行实证） |
| 2 | daemon 新 pid | **17936**·pidfile==listen pid==进程表 三面对表一致·**SessionId=0**（S4U 非交互会话——console 生命周期绑定根治实锚：旧 InteractiveToken 形态 daemon 与 console 同生共死，新形态无控制台面可杀） |
| 3 | 进程起点 | StartTime 属性从交互会话读 session-0 进程不可读（**属性访问伪影·非进程缺失**：Get-Process 实返对象 node/17936/session=0；同形 node 22588 亦 session=0 读空·session=1 进程全部可读·模式一致）→双旁证钉起点：healthz uptime=1138s @23:15:05.7Z（进程原点≈22:56:07）+任务 LastRun=22:55:56（差 11s=进程初始化时滞）互洽——**起点=22:55:56→22:56:07 窗钉死** |
| 4 | H1 读数 | healthz 23:15:05Z 原文：ok=true·mc_link=connected·trimc=connected·uptime=1138s·cron jobCount=**10**（换形前活体同值=照旧·字面 8 系窗令编排时点陈旧·BOD 22:52 已勘认）·degraded=false·consecutiveFailures=0·activeTasks=0·queueSize=0·sessionReaper enabled·mode=schtasks；重启瞬态 degraded ~25s 自愈（挂载窗同款形态） |
| 5 | H3 读数 | 探针 P1-P4 照命令单（cto-notify-probe-command-card-20261009.md）执行·probeA+probeB **双 200=PASS**·notifyFailures 恒 **0**（重启前后读数均 0）·探针通知落 bod 信箱各一笔=预期产物 |

## 三、backup 锚（回滚姿态全程在挂·未触发）

六件齐 @`%LOCALAPPDATA%\trimlc-s4u-migration-20261009\`：TriMLC-Daemon.task.xml.bak（旧任务 XML）/trimlc-watchdog.ps1.bak/trimlc-watchdog-launch.vbs.bak/TriMLC-Daemon.task.s4u.xml（新 XML 留档）/s4u-register.ps1（elevated 注册脚本留档）/register-result.txt。回滚路径=旧 XML 重注册+重启（治理稿 §四）。

## 四、执行链纪要（权限断点与 CEO 裁 A）

- 四路径全断实锚（22:3x·证据读数随程报 BOD 在案）：schtasks /np 讨密码后拒·COM Schedule.Service RegisterTaskDefinition(LogonType=S4U)=E_ACCESSDENIED·Start-Process -Verb RunAs 无人值守挂死险（ConsentPromptBehaviorAdmin=5+SecureDesktop）不采用·WinRM 回环服务未运行——**停+报候裁不滑步**。
- CEO 裁 A（22:52）：智力活前置（S4U XML 定点构造+最小 elevated 注册脚本）→RunAs -PassThru 触发→CEO 安全桌面 UAC 确认→register-result.txt 轮询收读 REGISTER_OK→Start-ScheduledTask 拉起→双门验证。全程零权限面绕行·零越权·UAC 提升走人工确认通道。

## 五、代码变更

- 系统形态施工件 6 件（§三目录内·施工件=S4U XML+s4u-register.ps1）——**TriCompany/TriMetaverse 仓内零代码变更**（本窗为系统形态治理·非代码积木交付）。
- **watchdog.ps1 零改动**：L87 revive 行（Start-Process cmd /c channel.cmd）原样——「两入口合一」后半（改 Start-ScheduledTask）**未做·候裁**（随 H2 窗 10-11 收口或单独续窗·改前备份已在位）。改后语义=revive 走任务拉起（S4U 形态·无 console）替代直接进程拉起。

## 六、自测与活体复验（毕报时点补强）

- H1 PASS（§二.4）·H3 PASS（§二.5）·H2 未跑（另约窗）·H4 挂账 10-18。
- **TriMLC-Watchdog 恢复在位**：State=Ready·LastRun=23:17:01 rc=0·NextRun=23:22:00（PT5M 周期复跑）——施工窗停-禁-启管控链（Stop no-op 实证→Disable 断触发→施工→Enable 恢复）毕·且对 S4U daemon 探活通过零误 revive（单一监听 17936 未被扰动·零 EADDRINUSE）。
- 邻域零误伤对表：TriRLC-Watchdog/TriHubWatchdog/Seat-Watchdog 各自 Ready 周期正常（非本窗域未触碰）·TriModel-Watchdog Disabled 系 10-03 既存态（LastRun 10-03）非本窗产物。

## 七、随程发现与候裁项（零动刀·如实呈）

1. **l1/l2 电池盲区（本夜新发现·与 S4U 独立·已 23:15/23:16 急呈 BOD+COO）**：TriLiveness-L1/L2 双任务 DisallowStartIfOnBatteries=True+StopIfGoingOnBatteries=True（默认电池条件）·AC 断于 ~21:40-21:45 窗（推断锚：L1 最后成功跑 21:40:01/事件日志其后零事件/NextRun 在排/机器醒着排除睡眠）→电池态下 liveness 触发全静默跳过=**存活监测整体熄灯且无自警**（21:40→23:15 实证 95min 静默零告警）。误报 ALERT-SENT 链 21:40 后零发=事实止损达成（l2 停摆副产）。候裁候选：①允许电池启动 ②电池切换自警 ③维持现状定性——**BOD 23:20 裁①照办（②不做·③不采·COO 排程建议随裁词归档）**：l1/l2 双任务 DisallowStartIfOnBatteries→false 已执行毕（23:24·Set-ScheduledTask 一行 Settings 变更·自席位权限零提权·StopIfGoingOnBatteries 未动=裁词字面照办）·回读三面验证（旗值 False×2+触发器 PT5M/PT10M 完整+Action wscript→vbs 链完整+State Ready/NextRun 顺延）·回滚锚=改回 true。**值面验证点=23:25:00 L1 触发/23:30:00 L2 触发**（电池态下应真跑出 l1.log/l2.log 新行——结果候补呈报本卷）。
2. jobCount=10 vs 字面 8：编排陈旧·BOD 22:52 已勘认（§二.4 在案）。
3. watchdog L87 revive 行改造未做（§五·候裁随 H2 窗）。
4. Q3.1 运行行陈旧（sg duty-night-patrol.py L49/L194 持续探死端口·LG-066 段2 在案残留）：候 BOD 裁（改行后续窗或 DNP_SG_URL env 过渡）。
5. l1 判定面旧拓扑 latch：l1-statefile 按旧拓扑持续 ALERT-NEEDED（现 l2 中继静默后无出口）——窗后扫尾批在案项·候 N3 毕同步收。
6. 电池序列：57%（22:4x）→45→44-45 稳态→38（23:11）→36-37%（23:15）·持续放电·AC 断点推断 ~21:40-45·25% 兜底线令五持续在挂（安全底线优先于窗锚·触线即停报）。

## 八、H2 候窗位

**10-11（周日）22:30 原窗位**（窗令 §二预排位）：S4U 已毕·H2 待机专项单独跑（~30min：23:35 预告→待机→恢复断言四件：pid 存活+watchdog 零 DOWN+隧道 keeper 自愈+18710 可达）·候 BOD 裁。

## 使用依据

- 窗令正身 coo-window-order-20261011-nightly.md @a54741ef（H1-H4 门·§三施工纪律·§四毕报链）·治理稿 trimlc-daemon-hardening-plan-20261009.md @6141a459（§二两入口合一·§四回滚姿态）
- BOD 22:44 窗提前令·BOD 22:52 CEO 裁 A 案授权令（毕报实锚清单五项）
- 活体读数（本卷时点）：healthz 原文 23:15:05Z·Export-ScheduledTask XML 回读·Get-ScheduledTaskInfo/Settings·Win32_Battery·TaskScheduler 事件日志（Microsoft-Windows-TaskScheduler/Operational·21:30 起窗 30 事件全录）

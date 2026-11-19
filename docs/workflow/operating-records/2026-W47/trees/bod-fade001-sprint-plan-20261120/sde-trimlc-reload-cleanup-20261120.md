# SDE TriMLC fddb630 装载重启窗+信箱 cleanup 真跑毕报（COS 两令承·B7 N3 毕后窗·快毕节律）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/sde-trimlc-reload-cleanup-20261120.md·装载+cleanup 毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS TriMLC 装载+cleanup 真跑令（N3 毕后窗·两段护栏）+COS 补强令（技术顺序注①②③④·cto 复核卷 54189048a APPROVE 采认）+CTO N4 判读卷 b3c92f510（知悉面）
- 判定: **段①TriMLC 8713 重启窗=毕（fddb630 dist 装载·pid 三证 35728·cron 三查全绿·watchdog Ready）·段②cleanup 真跑=毕（markRead ok=1769 失败=0·余 unread=166=设计语义数学闭合）·段③443 补推=毕（fddb630 三面 hash 全等）**

## §一 · 技术顺序注合规自检（COS 补强令①）

真跑前置=daemon 先重启装载 fddb630（abort 防御+cap500 生效）→后真跑——**本席执行序天然合规**：重启窗冷启 06:36:54+08（新 daemon 35728 在役）→真跑 06:40+ 全程 fddb630 daemon 面承写——旧 daemon 零真跑触碰。dry-run 复测前置照役 ✓（4201 vs 预期 4186·+15=0.4% 非大偏差）。TriRMC（heyuan）D-46 轮换窗=ns8 收官后窗不动承录知悉 ✓（本席 TriMLC 面与 heyuan 面两机独立零冲突）。

## §二 · 段①TriMLC 重启窗（DCE 步序·fddb630 dist 装载）

| 步 | 动作 | 读数 | 判 |
|---|---|---|---|
| 0 | 预检 | TriMLC 仓 HEAD=**fddb630**（R6 hook 修复三件·工作区净）·dist/cli.js 06:21 新铸（hook 三件码面 slice(0,20) 降序主修断言命中）·hook 三件 dist 面=fsd 铸毕 | ✓ |
| 1 | 快照四件 | notify-mailbox.json(4383480)+cron.db(9895936)+sessions.db(1286144)+fade.db(184320)→`C:\Users\jedih\AppData\Local\trilc-channel-snapshot-ns8fix-20261120\`·合 **15749880B**（R6-b 14MB 同量级形） | ✓（勘正注①） |
| 2 | watchdog Disable | Disable-ScheduledTask 'TriMLC-Watchdog'→State=**Disabled** | ✓ |
| 3 | pid 三证（停前） | pidfile 20764==netstat 8713==CIM node.exe（created 11-20 04:59:00=R6-b 冷启件·uptime 连续） | ✓ |
| 4 | /shutdown | 首发零头=**401**（internal token 门在——src 面旧读零门=运行版 auth 中间件加门·如实注）→token 变量读入带 `X-Internal-Token` 重发=**200** shutting down | ✓（勘正注②） |
| 5 | port FREE | 8713 零 LISTEN·pidfile 死值残留（writePid 冷启覆盖语义·非阻塞） | ✓ |
| 6 | 冷启 | Start-ScheduledTask 'TriMLC Daemon'→**pid 三证 35728**（pidfile==netstat==CIM node.exe created 06:36:54·uptime 重置）+healthz **200**（uptime=11s·mc_link connected·trimc connected·cron jobCount=18 degraded=false failures=0·heartbeat/sessionReaper enabled） | ✓ |
| 7 | cron 三查 | 18==18·missing=0（degraded=false）·next_run_at=22:37:00Z 在·consecutiveFailures=0 | ✓ |
| 8 | watchdog Enable | State=**Ready** | ✓ |

勘正注①：快照首做 1 字节假快照（PowerShell 引号拼接错）——自检拦住·Join-Path 形重做真快照在位后……shutdown 前置才满足（假快照零带停·纪律遵行）。mailbox 正身勘定=D:/Code/ai/TriMLC/notify-mailbox.json（仓根·非 dataDir——TRIMC_NOTIFY_MAILBOX 缺省形码面承）。勘正注②：/shutdown 401 面=token 门——token 值面零回显（D-46·变量读入 ${#TOKEN}=64 断言形）。

## §三 · 段②cleanup 两段护栏兑付（COS 令四项读数）

**dry-run 前置（零写）**：窗口=24h 截止 2026-11-18T22:37:34Z·全箱 5125·未读 4201（vs 令预期 ~4186·+15=0.4% 对表过）·**超窗未读=4035**（窗内保留 166）——停回勘判据未触。

**真跑三段合流（幂等语义全程）**：
1. 首跑：**env 遗传旧 token 401 全败**（ok=0 失败=4035——机理=shell env TRILC_INTERNAL_TOKEN=旧值≠.cmd 新值 MISMATCH 实锚·daemon 06:36 冷启装载新 token）——零标读·勘正=cmd 侧 token 显式注入重跑（探针先证：cmd token 打端点=404 形（件不在箱假 id）=端点+token+方法全对）。
2. 勘正跑：4035 件批量推进中被本机 Bash 4min 超时杀（已标读 ~2266·幂等断点安全）——改 Start-Process 独立进程形续跑。
3. 续跑：超窗余量 **1769 件**重扫（=4035−2266 数学吻合）→**markRead ok=1769 失败=0**毕（PID 20600·06:43:23-06:46+08）。

**四项读数（COS 令④）**：①dry 件数=4035（超窗未读·4201 unread 对表面）②真跑件数=4035 标读全达成（2266+1769 合流·失败零）③归档件数=改前快照 notify-mailbox.json 4383480B 全量 5125 件保全在位 ④余 unread=**166**（=4201−4035 **数学精确闭合**·by_seat bod 114/m-cos 31/m-coo 11/m-cto 6/m-cao 4·全 24h 窗内新件=设计语义精确态）。

## §四 · 段③TriMLC push 443 断窗补推（趁通道通先推·序调整如实注）

- 本地 ahead 3（fddb630+498f058+d62976e）behind 0——origin 双 pushurl+sg-server 三面推：478ae65..**fddb630** dev->dev ✓·sg-server=up-to-date（同机别名形）。
- **ls-remote 双验**：origin=fddb6303f129…==sg-server==本地 HEAD **三 hash 全等** ✓。
- 序调整注：COS 令序=重启窗→cleanup→补推——本席趁 443/通道现通先推（通道抖动族时效窗·推=纯 git 面零涉 daemon）→再重启窗→cleanup——通道时效优先·零风险增量·如实注。

## §五 · 护栏遵守

D-46 全程（token 值面零回显·变量读入+长度断言形）✓｜D-47（落款=date 现查原值）✓｜pid 三证双向（停前 20764/启后 35728）✓｜假快照零带停（勘正重做后……shutdown）✓｜daemon 禁裸杀（/shutdown 优雅停·token 门）✓｜cron 现役件零直改（三查只读）✓｜写面收敛 daemon 单进程（markRead 端点形·零文件直写）✓｜重试纪律（首跑 401=env 错位勘正非盲重试·超时杀=幂等断点续跑非风暴）✓｜B7 主链零触（TriMLC 8713 面≠TriRMC 8710 面·两机两 daemon 独立）✓。

## §六 · 使用依据

- COS TriMLC 装载+cleanup 真跑令（两段护栏+N3 毕后窗时序）+COS 补强令（技术顺序注①②③④·cto 复核卷 54189048a APPROVE）
- fddb630（R6 hook 修复三件·降序 20 主修+注入即标读+存量清理 cap500·cto 铸面卷 cdda4386a）+scripts/notify-mailbox-cleanup.cjs 码面（RETENTION_HOURS=24 缺省/markRead 端点形/幂等语义/TRILC_NOTIFY_CLEANUP_DRYRUN=1 dry 面）
- R6-b 重启序先例（sde-r6-dualprobe 卷 §一·精简序）+trilc-daemon-restart-discipline（pidfile 权威路径/.cmd 拉起两步）
- 活体：TriMLC 仓 fddb630+dist/cli.js 06:21 新铸+8713 healthz 200（uptime=11s·cron 18 jobs）+cleanup-run2.log 全程+notify-mailbox.json 值面
- CTO N4 判读卷 b3c92f510（知悉面·N5 承录候面）+D-24/D-29（无窗直启禁令·Start-ScheduledTask 形）/D-46/D-47

## §七 · 债 6 定谳互证与结论修正注记（CTO 判读回承·ccb267159 同源）

- CTO 判读回（写前现查 2026-11-19T22:58:11Z）采认本卷三段毕报，并**债 6 生产面实证定谳升级：债 6 真形=token 配对错位（非缺席）**——本卷 §三.1「shell env 旧值≠.cmd 新值 MISMATCH」与 CTO 活体探针（真 message_id 单发→401→delta=0·by_seat bod=114 双读数吻合）**同机理互证**：daemon 06:36 冷启装载新 token 后，全部存量长驻会话 hook=静默 401 降级（标读不生效·同批 20 件跨拍重复注入实证）。
- **结论修正**：本席双报「TriMLC hook 三件现役就绪」表述修正为——**铸面三件首用环境=新会话形就绪·存量会话=401 降级形**（降级可容三兜底=cap500+24h 保留+cleanup 幂等可重跑·sprint 内可容·CTO 定谳面承）。
- 勘修窗正解方向承录知悉（候令面）：token 文件单值源（daemon 与 hook 同源读·根除重启换 token 断配对族）+user env setx 新值快修过渡（新会话即生效·存量会话重启窗收口）——本席执行面候召。

—— SDE 小布（m-sde·TriMLC 装载+cleanup 两段收口+债 6 修正注记·N5 候面+域勘窗两裁定遵行态）·写前现查 2026-11-19T23:01:37Z（+8=2026-11-20 07:01:37·date 现查原值·D-47 正形）

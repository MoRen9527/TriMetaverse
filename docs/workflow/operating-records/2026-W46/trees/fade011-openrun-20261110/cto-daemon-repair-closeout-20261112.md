# TriMLC 8713 勘修窗施工毕报 · 修复②族三件落地（8fa3b97）

- sourceOfTruth: 本件（勘修窗毕报·窗令 d6d9a4ed 的施工收口卷）
- syncMode: static（施工毕读数锚·效果验证面候窗实测）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: 设计单 2f0d58d58→窗令（d6d9a4ed·本席自掌施工）→组审插队（b5ef6f5ce SLA 内交付毕）→B 态首拍验收 PASS→本窗施工→本毕报

## §一 根因判定录（源码勘读定谳·设计单预设的两处修正）

- **窗口性故障机理（勘定）**：睡眠恢复窗系统高载下 powershell.exe 冷启+Add-Type csc 编译持续超 20s 外层超时→连败 3 次→告警。恒定性排除=11-11 同日 62% 读成功实证。修复①（2026-11-06 勘修窗·CIM job 化防 wmiprvse 停摆）已覆盖另一机理——本窗修复②面向睡眠恢复窗新机理，不重叠。
- **设计单预设修正一（dedup 挂点层）**：设计单预设 dedup=daemon 侧同 key 窗内去重。源码勘读定谳=**缺口两面**：daemon 侧「失效段」定义过短（读成功即全复位 L552-553→抖动窗内每 3 连败段重发一告警）+传播层（M-SG NOTIFY/hook 注入层重复投递——8712→8713 落箱段与 hook 重放面）。本件修 daemon 侧（时间窗+稳定窗双保险）；**传播层缺口归 MMC 8712 面**（r44 信链落箱缺口已在账）——hook 注入重放面今晨 5+ 面重复到达实锚，候 MMC 勘修窗。
- **设计单预设修正二（拍缺主因族对表）**：BOD 附注勘正（宿主睡眠/整机重启=拍缺主因·daemon timer 自身失灵仅 21:07 一笔）与本窗实勘一致——uptime≈14h 对表 LastBoot 11-11 21:46 实锤；本窗三件不涉拍缺主因面（读数链韧化+告警降噪），daemon timer 面零改动（设计使然）。

## §二 三件落地（TriMLC 8fa3b97·dev 双通道推毕 ls-remote 验真顶=8fa3b97）

| # | 件 | 实现 | 生产语义 |
|---|---|---|---|
| 1 | 读数链韧化 | 外层超时 20s→45s（defaultReadPower 缺省参·deps.readPower 值绑定零调用点触面） | 睡眠恢复窗冷启窗容忍 2.25× |
| 2 | 读失败退避=读抑制合一 | nextReadAt 门控（60s→2×递增→封顶 5min·成功复位）；tick 节律与 wake 补报线不受抑制（跳拍仅 read 面） | 连败窗读降频=告警源头减负 |
| 3 | 失败告警 dedup | 时间窗 30min（窗内至多 1 条·**复位不清窗锚**——清零即被稳定窗短路形同虚设·实现中勘定修正）+稳定窗复位（连 3 拍读成功才重臂） | 30min 窗内至多 1 条失败告警 |
- 参数面四注入（readBackoffBaseMs/readBackoffMaxMs/failAlarmDedupMs/readRecoveryStableTicks）：生产零传=缺省新语义；单测 0/小值=旧语义路径或专测新语义——新旧行为双锚在测。
- **专测两案**：退避门（失败 1 拍即退避·read 不触实证 readCount 冻结=1+退避过期恢复 lastReadAt 复活）；时间窗（稳定复位后窗内再触发不重发·窗过期放行再警=漏报面最小化）。
- **实现中勘定修正一例（本席自查）**：初版稳定窗复位清 lastFailAlarmAt=0——时间窗被稳定窗短路（抖动窗 3 连成功几乎必达成→dedup 退化纯稳定窗）——修正=复位不清窗锚，30min 窗独立兜底。专测第二案即此病灶的回归锚（窗内挡+过期放行双断言）。

## §三 测试门与重启链全序读数

- **测试门**：tsc --noEmit 绿；power-gate **32/32**（基线 30+新增 2）；全量 **801 pass/5 fail=基线同族既有**（git stash 基线对照独立验：基线 5 fail=改动后 5 fail 同数量同族——replay-flow/e1-healthz/FADE-ASSESS-005 族/tui components，与 power-monitor 零接触面·既有失败如实标注不阻塞本件）；build RC=0。
- **重启链全序**（照纪律册正形）：watchdog Disable（TriMLC-Watchdog）→/shutdown 200（token 门·变量读入零回显）→port FREE 实证→schtasks 冷起（TriMLC Daemon）→pid 对表（7308→**29540**·node.exe）→watchdog Enable——全序单窗毕零异常。
- **完工四断言**（窗令承诺面）：
  1. healthz 绿：ok=true·mc_link=connected·trimc=connected（冷起 warm-up 87s 内自愈）
  2. pid 对表：新 pid 29540≠旧 7308·node.exe 进程名对表 ✓
  3. fade011 job 值面三查：enabled=true·nextRunAt=2026-11-12T19:30Z（未来时值）·lastRunStatus=ok（今晨拍 01:41Z 在账 runCount=11）——**投影字段名勘误注**：TriMLC jobs 面=nextRunAt（ISO）非 nextRunAtMs，首查 None 系投影名误猜非值缺失（值面复验定谳）
  4. powerMonitor 读数恢复探针：冷起后 6s 内首读完成（98%·readFailures=0·lastReadAt=03:45:44Z 新鲜）→87s 复验 60s 节律正常（lastReadAt=03:46:45Z）
- 完工锚=2026-11-12T03:47:10Z（date 现查原值）。

## §四 遗留面与效果验证窗

- **效果验证候窗**：修复②族面向「睡眠恢复窗」场景——真实效果验证候下一睡眠恢复窗实测（读数链不告警+退避节律日志面）；当前窗口读数本就正常（98%·readFailures=0），生产现势=新代码无行为差异窗。
- **传播层 dedup（MMC 8712 面）**：NOTIFY 转发链/hook 注入重放面缺口不在本件——随 r44 信链落箱缺口一并归 MMC 勘修窗（COO 督办列项已在账）。
- cron 瞬断窗知情面：值席 COS 已预知会（「cron 拍瞬断+NOTIFY 短暂静默=窗内预期面」）——实际瞬断窗≈40s（03:44:49 shutdown→03:45:41 healthz 绿）零拍撞窗。

## 使用依据

TriMLC power-monitor.ts 源码勘读（L176-295/L426-652 全段+常量段）/8fa3b97 commit/dev 双通道推+ls-remote 验真/power-gate 32/32+全量 801/5+stash 基线对照/重启链全序读数（healthz 三探+netstat pid 对表+fade011 job JSON 投影）/设计单 2f0d58d58/窗令 d6d9a4ed/BOD 附注拍缺主因族勘正（LastBoot 11-11 21:46）/COS 回执（值守知情窗面）。

—— CTO 小狄（m-cto·勘修窗毕报），2026-11-12 11:47 CST（写前现查 2026-11-12T03:47:10Z=11:47:10+08 原值）

# E1-5 机理裁定（CTO·8713 调度面静默停摆=Modern Standby 冻结族）

- sourceOfTruth: 本卷（E1-5 机理定谳+修复形三面正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COS 机理裁决路由 2026-11-05T09:44:30+0800（bod 09:37 活体五组转诊）
- 裁定席: CTO 小狄·本席独立勘定五组（cron.db 直查/healthz 活体/daemon 日志/Windows 事件日志/TriMLC 源码面）·零复用转述读数

## 一 · 机理定谳（证据链全锚）

**E1-5=Windows Modern Standby（Adaptive Connected Standby）DAM 定时器冻结族——非 daemon 缺陷·非 keep-awake 失效。**

时间线（Kernel-Power 事件日志与本席 cron.db 直查**逐秒对表**）：

| 时刻（+08） | 事件 | 证据锚 |
|---|---|---|
| 08:59:00 | exec log 最后一笔 ok（cron_muk3951d） | cron.db execution_log 直查 |
| 08:59:21-41 | 短唤醒→电源更改→**进入新型待机（Id 506）** | Kernel-Power 事件日志 |
| 08:59:41-09:31 | Modern Standby 段一（Adaptive Connected Standby·Id 172） | 同上 |
| 09:31:04 | 再进入待机 | 同上 |
| 09:35:57 | **电源更改（Id 105=接电）**→退出待机 | 同上·与 COS 09:44 battery=100% 接电链吻合 |
| 09:37:02 | **退出新型待机（Id 507）稳定醒** | 同上·与 TriMLC lastWakeSeenAt=01:37:02Z **逐秒同** |
| 09:37:12 | cron 恢复首拍 ok·**duration 87353ms（正常 1.1s）** | cron.db 直查 |
| 09:38:39-09:49 | 积压补跑+正常化（次笔 175474ms 膨胀=DAM 节流尾态） | cron.db 直查 |

- **冻结窗 68 分钟**（00:59:00Z→01:37:12Z execution_log 零写入）——期间连 LG-069 闸的 skipped 记账都没有=非闸停·真冻结
- **keep-awake engaged 实锤**：daemon 日志 `power-keepalive: engaged (ES_CONTINUOUS|ES_SYSTEM_REQUIRED, prev=0x80000000)` 现役链正常生效——**ES_SYSTEM_REQUIRED 挡得住系统空闲睡眠·挡不住 Adaptive Connected Standby 的自适应进入**（Windows 11 自适应形态=使用习惯+电源状态预测驱动·非纯空闲计时器·对 ES flag 约束弱；低电 DC 供电态更甚）
- 假说排除留痕：「power 读 hang 卡共享链」被源码否定（`shouldDispatchNewJobs () => !isPowerGateHard()`=纯内存快照读·app.ts:1482·无子进程调用）

## 二 · 触发链

昨晚未接电+LG-069 低电消耗链（闸告警在拍·COS 03:48 探仍未接电）→08:59:41 电池供电态系统自适应待机→DAM 冻结全部 timer（cron tick/power 读循环）→今晨 09:35:57 接电→09:37:02 醒→环自愈恢复。

**定性=电源生命周期事件·根因=值守机角色（7×24 自动化）与笔记本电源态的冲突·非代码缺陷。**

## 三 · 修复形三面

### A 面·电源纪律（即办·面域=值守纪律）
值守机接电=角色要求（8711+8713 双 daemon+多席常驻宿主）。**LG-069 前置告警档建议**：现役 hard 闸 <20%——但待机冻结风险在中等电量（Adaptive Standby）即存在·建议增前置档 **<50% 且未接电→升级告警值守面（COS/BOD）**·候 FSD 窗小改（TriMLC power-monitor 告警链）。

### B 面·宿主电源策略（呈用户知情面·本席不单边改宿主配置）
根治=Windows 电源策略面把 DC（电池）态睡眠禁用（settings/powercfg）——**宿主机电源策略属用户配置域·本席只建议不擅改**：建议用户将「使用电池电源时」睡眠设为「从不」或接电运行值守段。此项随本卷呈 COS 转知情用户。

### C 面·wake 补跑增强（候 FSD 窗·TriMLC 小件）
wake 事件已捕获（powerMonitor lastWakeSeenAt）——现役 runMissedJobs=启动补跑·wake 非启动。建议 **wake 事件→触发一轮 due 检查+stale reclaim**（防下回待机段积压 job 滞留）。候 FSD 窗·与 A 面同窗批处理。

## 四 · 附验收·LG-092 案②施工（本席顺带全验）

SDE 凌晨 04:01-04:02 施工**落地实锤**（在我 03:51 裁达后 ~10 分钟·施工形全对裁）：
- `fade-daily-sweep.local.mjs` 入仓（commit 870ebeb74）——**本席 diff 实勘=bf414156d 源形正身·零漂移**（仅增头注防呆两行「禁 sg 化覆盖本文件·sg 形=兄弟文件」=超裁形增值·好形态）
- job command 已改指副本（cron.db 直查 id=cron_mw1rdhym_7pwt·command=node …local.mjs）
- sg 形兄弟文件零触碰（Nov 4 17:52 mtime 未动）✓
- 04:02:53 启动补跑=ok（真跑非 dry·等价覆盖「手动触发一发」要件）✓
- ALLOWLIST 面：job 改动成功且在跑=实践通过（TriMLC 白名单形态若有亦已过）——SDE 毕报形式面候补（实质已验）
- next_run=2026-11-05T19:30:00Z=11-06 03:30+08 ✓ 复核锚在位·**LG-092 死线要件达成（提前 ~23h）**

## 五 · 使用依据

- cron.db 直查（$LOCALAPPDATA\trilc-channel\cron.db·DATA_DIR 对启动链勘定）
- Windows Kernel-Power 事件日志（Get-WinEvent 08:30-10:00 窗）
- TriMLC 源码：timer.ts（withLock/onTimerTick/LG-069 单点闸）·power-keepalive.ts（LG-088 a 件）·server/app.ts:1482（闸 wiring）
- daemon 日志（channel.log·keepalive engaged 行）
- COS 路由信+bod 09:37 活体五组（转述读数与本席直查差异处以直查为准）

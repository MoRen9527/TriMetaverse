# SDE 毕报卷 · E1-5 A/C 修复（双小件派工件 2·COS 16:35 裁乙连办件）

- sourceOfTruth: 本卷（SDE 施工毕报正身·TriMLC commit 603e282+部署面读数全锚）
- syncMode: closeout-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COO 双小件派工 2026-11-05T16:27（COS 16:26:53 径裁）·定谳正身=同目录 cto-ruling.md（dcfbbb142·修复形三面之 A/C）
- 状态: A/C 双面毕（代码+测试+build+受控重启链+进程内生效探针）·B 面不涉（宿主电源策略=呈用户知情面·零触碰）

## §一 · 施工读数（A/C 双面）

**A 面·LG-069 前置告警档**（power-monitor.ts）：
- `PowerGateConfig` 增 `advisoryTrigger: 50` + `advisoryRecover: 55`（滞回缓冲防抖）
- tick read 成功段增前置档判定：`<50% 且未接电`→`dispatchNotify(level=normal, seats=[m-cos, m-coo, bod], title=[LG-069 前置档] 电量<50% 未接电·待机冻结风险)`——一次/电量段（`advisoryAlarmSent` 标志）；重臂=接电或回升 ≥55；50-54 区间持警不重复
- **告警非闸**：软硬闸语义零变化（soft 30/hard 20·派发面不动）——纯值守告警档

**C 面·wake 恢复立即 tick**（power-monitor.ts+cron/timer.ts+cron/service.ts+server/app.ts 四点接线）：
- `PowerMonitorDeps.onWakeRecovery?: (seg) => void`——达标 wake 段（≥5min·POWER_WAKE_MIN_DURATION_MS）报告时调用（调用点 try/catch 兜·不炸 tick）
- `onTimerTick` 导出（cron/timer.ts·幂等 withLock+locked 早退不变）
- `CronService.wakeRecoveryTick()`（cron/service.ts）：未启动=静默跳过；异常=日志不抛（双兜面）
- app.ts 装配：`onWakeRecovery: () => { void cronEngine.wakeRecoveryTick() }`（cronEngine L1457 与 powerMonitor L4868 同作用域链）——**Modern Standby 冻结段积压 job 醒后即时 due 检查+stale reclaim·不等 armTimer 节拍到岗**

## §二 · 验证链读数（全量·零新增红）

| 面 | 读数 | 基线对表 |
|---|---|---|
| power-gate.test.ts | **30/30**（基线 24+新增 6：A 族三例+C 族三例·状态驱动形消 tick 竞态） | STE 复跑 24/24 对平+6 ✓ |
| wake-events.test.ts | **12/12** | 基线对平 ✓ |
| cron 八文件 | **39/39**（boot-recovery/healthz-nextrun/role-gating/skipped-degraded/stale-reclaim/store-backup-sync/store-nextrun/timeout-race） | service/timer 改动直接面全绿 ✓ |
| fade 全家（10 文件） | **99/99 RC=0** | STE 基线 99/99 对平·零新增红 ✓ |
| tsc --noEmit | 我四文件零错误；TS2307 若干=既有符号链接依赖面（@tricompany/agent-core 等·如实归因非本窗引入） | 既有形态维持 |

**测试新增 6 例**：A 族=<50% DC 警一次/持警不重复+接电重臂可再警+回升 ≥55 重臂（50-54 持警）+AC 零警+无电池零警；C 族=达标段回调恰一次携带段（首拍基线吸收零调）+短段零回调+回调 throw 不炸 tick（读面照常推进）。

## §三 · 环境修复面（施工中勘定·如实记档）

测试首跑 ERR_MODULE_NOT_FOUND 链勘定：`@tricompany/agent-core` → `trimodel`（TriModel）→ `croner` 三层 dist/依赖面缺——**三仓构建产物/依赖装配面退化**（STE 今晨复跑时链通·窗内退化时点未勘）。修复三步全零版本变更：①`TriModel npm run build`（dist/src/index.js 重建）②`agent-core npm run build`（dist/index.js 重建·余类型面 TS 错=@types 链·不挡运行）③`agent-core npm install`（按 package-lock 补装 croner/yaml/zod——package.json 零改动）。修复后链通·全谱绿。

## §四 · 部署收口（受控重启链七步·P3 第四链/10-11 勘修窗同口径）

| 步 | 动作 | 读数 |
|---|---|---|
| 1 | wd 计划任务名勘定+Disable | **TriMLC-Watchdog**（案②零命中系查询方式伪影·PowerShell Get-ScheduledTask 直命中）→Disabled ✓ |
| 2 | token 门 POST /shutdown | `{"ok":true}` HTTP 200（token shell 变量·值面零回显） |
| 3 | port FREE 显式验 | GREP_RC=1=8713 FREE 确证 |
| 4 | 计划任务冷启 | `Start-ScheduledTask 'TriMLC Daemon'`（action=trimlc-daemon-channel.cmd=新 env 通道 ✓） |
| 5 | pid 对表 | listener pid=**35404**（≠旧 13652=重启真发生·kernel 级 Get-NetTCPConnection 权威形） |
| 6 | wd Enable | Ready ✓ |
| 7 | healthz+E1-5 探针 | HTTP 200 ok:true·uptime=19 新实例·power 快照全字段（100% AC·gate none·readFailures 0）；**channel.log 尾行=`power gate monitor started (60s interval, LG-069, E1-5 A/C build)`**=进程内生效终判据 ✓ |

**零触碰面**：cron job 17 只全谱零变化·ALLOWLIST 零变化·fade011-daily-sweep 保自动（明晨 03:30 复核拍不受扰·next_run_at=08:53:00Z 读数时在挂高频 job 正常滚动）。

## §五 · 生效验证窗口（如实标注·非漏项）

- **单测面已直证 A/C 行为**（30/30·mock 注入形）
- **部署面直证窗口=自然拍**：A 面=下次 DC<50% 窗（现机 100% 接电·不造态）；C 面=下次 ≥5min 睡眠段（今晨 E1-5 实证 13.3min 形在卷）——触发时 channel.log 出 `wake recovery: triggering immediate due-check + stale-reclaim tick` 行+`advisory alarm` 行（观察随日报）。基线吸收机制活体实证：healthz `lastWakeSeenAt=08:50:40Z` 首拍吸收零误报（`lastWakeReport: null`）✓

## §六 · 推送与挂账

- **TriMLC commit 603e282**（五文件·280+/2-）——github 顶推讫（ls-remote 双验 603e28200 ✓）
- **sg 通道 rejected（unable to migrate objects）=T5 既述形态**（「sg 停 S1·本地权威位零丢失」CTO 总毕报 §四 注记+1 笔积压）——候 root 归位族挂账（与 sg 8712 drop-in 三键同族·非本席即办）·维持候窗
- B 面（宿主电源策略 DC 睡眠禁用）=呈用户知情面·本席零触碰（CTO 定谳 §三.B）

## §七 · 使用依据

- E1-5 定谳卷 cto-ruling.md（dcfbbb142·§三 修复形三面）·CTO 总毕报 §六.2（升急采认）·COO 双小件派工令 16:27·COS 裁乙谳语 16:35（件 2 照旧施工）
- power-monitor.ts/cron/timer.ts/cron/service.ts/server/app.ts 现役件实勘（tick 主体/armTimer/onTimerTick/CronService 接口/装配段全读）
- 重启链 SOP（TriMLC 勘修窗 2026-10-11 记忆+P3 第四链先例 ba734bf6e）·D-03 daemon 重启纪律·D-46 值面零回显

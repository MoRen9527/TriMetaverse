# SDE 前置勘验卷 · LG-069 合并窗序0 8713 重启令（HOLD→B 变体候令态）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/sde-restart-precheck-20261014.md）
- syncMode: static（勘验留档卷·COO 08:27 令「前置勘验卷留档」承接）
- lastSyncedAt: 2026-10-14 08:29:30+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；令源=COO 直达派工（M-004·08:19:33 现戳）→HOLD 回询（08:25:47）→COO B 变体裁复（08:27:48）

## 令文与触发链

- 令：8713 TriMLC 短重启（~5min 停摆·窗位 08:35-10:35），触发=FSD 前置件落码毕信号；毕锚（原令字面）=重启后 healthz power 段 lastReadAt 字段在位；实操序=10-11 勘修窗先例。
- **B 变体定谳（COO 08:27:48）**：毕锚面 healthz 保持不改（裁据=窗计划卷 §2.2「从闸轮询面=healthz 免鉴权只读·不共享 internal token·凭据面最小化」，从闸 staleness 判定消费面钉死 healthz.power；/internal/v1/power 系鉴权面非消费面）；成立时序=三步毕（FSD 落码 powerHealthz() 挑拣面加 lastReadAt 行+单测 → dist build → SDE 重启毕）方验毕锚；本次重启目的=加载 FSD 新码（非 44a0206）。

## HOLD 三读数（2026-10-14 08:2x 前置勘验·零写面）

| # | 项 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | 现役进程代际 | pid 24628（pidfile `~/.trimetaverse/trilc-8713.pid`=listen pid 双面对平）起点=2026-10-13 18:01:00（CIM Win32_Process CreationDate 实锚）> dist build 10-13 16:13 | 现役已加载 44a0206 批 dist |
| 2 | 毕锚实质面（lastReadAt 投影） | `/internal/v1/power`（X-Internal-Token 门·token shell 变量零回显）活体响应含 `"lastReadAt":"2026-10-14T00:24:43.607Z"`（60s tick 滚动中·snapshot() 九字段透传） | 投影已生效（鉴权面） |
| 3 | 毕锚字面面（healthz power 段） | healthz 主投影 `powerHealthz()` 系显式八字段挑拣形（percent/percentRaw/percentCim/acOnline/gate/batteryPresent/readFailures/notifyFailures）·源码无 lastReadAt；顶笔 44a0206 单文件 power-monitor.ts·工作区 untracked 全为备份件零源码笔 | **healthz 无该字段系 FSD 未落码现势**（B 裁澄清·非毕锚矛盾） |

- 反转归因如实录：初判「现役已是新码→重启系重复执行」经 COO B 裁勘正——44a0206 与 FSD 待落笔是**两批码**；读数①②恰证 44a0206 批已生效，与「候 FSD 新码重启」不矛盾。

## 候令态备料（信号到即动·窗内）

- 代码面核对（信号到后先验）：TriMLC 仓新 commit（powerHealthz() 加 lastReadAt 行+单测）→ dist build mtime>commit → dist/server/app.js powerHealthz 行 grep lastReadAt 值面在位。
- 重启实操序（10-11 先例两度）：①schtasks Change TriMLC-Watchdog Disable（**PowerShell 跑·Git Bash schtasks 吃 MSYS 路径转换**）→②POST /shutdown 根路径（token shell 变量零回显；401≠路径存在教训在案）→③Get-NetTCPConnection 验 8713 port FREE→④`schtasks /run "TriMLC Daemon"` 冷启→⑤healthz uptime 重置+pid/CIM 对表（listen pid==pidfile）→⑥watchdog Enable。毕锚=healthz power 段 lastReadAt 在位。
- 回滚锚：重启前现役 pid 24628/起点 18:01:00 已录（本卷读数①）；dist 当前版若需回退=schtasks 冷启加载旧 dist 面（dist-bak-pre-20261011-window 备份族在 TriMLC 仓根）。

## 执行段（信号到→窗内毕·2026-10-14 08:35-08:37）

- **信号验证段四查全绿**（08:29-08:33）：顶笔 55e1305（08:26:45「fix(power): LG-069 二期前置件——healthz power 段补 lastReadAt 投影（一行+双相单测）」·m-fsd 08:28:57 毕信号）；src/dist 工作区净；dist md5 双对表独立算——server/app.js=189700a3b94b934ded9a0246470cf83e、index.js=3a2d86439bd08822fc5614b9d7d80be1 逐字合 FSD 报值；powerHealthz L1139 值面 grep `lastReadAt: p.lastReadAt` 在位（L1137 注记=CTO 二期稿 §2.2 裁据3 承接）。
- **重启前基线**（08:29:51）：uptime=52129·healthz power 八字段无 lastReadAt（待换形态）·jobCount=13；watchdog 任务名实勘=`TriMLC-Watchdog`（Ready）·冷启任务=`TriMLC Daemon`。
- **七步链全绿**：

| 步 | 动作 | 读数 | 自检 |
| --- | --- | --- | --- |
| 1 | Disable-ScheduledTask TriMLC-Watchdog | 08:35 窗准点 | State=Disabled ✓ |
| 2 | POST /shutdown 根路径（token 零回显） | 200 {"ok":true,"message":"shutting down"} | ✓ |
| 3 | port FREE 轮询 | 08:35:22 poll#1 即空 | ✓ |
| 4 | Start-ScheduledTask TriMLC Daemon | State=Running | ✓ |
| 5 | healthz 轮询+pid 对表 | UP 08:35:35（poll#1）uptime=7；pidfile=listen=**6456** ✓；mc_link/trimc 冷启瞬态 degraded→8s 后双 connected | ✓ |
| 6 | **毕锚终验**（62s 防抖窗） | **healthz power.lastReadAt 在位且滚动**：首读 00:35:30.769Z→00:36:28.691Z（60s tick 实证非快照）·九字段 has-anchor=True·cron jobCount=13 degraded=false next_run 正常滚 | **达成 ✓** |
| 7 | Enable-ScheduledTask TriMLC-Watchdog | State=Ready；watchdog.log 尾条停 10-11（本窗零触发=护栏旁证） | ✓ |

- 停摆实测≈32s（port FREE 08:35:22→healthz UP 08:35:35·预算 5min）；开链 08:35:03→毕锚终验毕 08:37:3x 窗内毕（止损 10:35 富余）；8711 零触碰 ✓。
- 毕报双发：m-fsd（4915efd9）+COO（c9b78b59）·落款 08:38:00/08:38:12 现查原值·发后对表 08:38:21 通过。

## 使用依据

- COO 派工令（08:19:33）+HOLD 裁复 B 变体（08:27:48）；窗计划卷 coo-window-plan-20261014.md §2.2（消费面裁据）
- 活体勘验：healthz（免鉴权面）/internal/v1/power（token 门·零回显）/CIM Win32_Process 24628/TriMLC 仓 git show 44a0206+dist 值面 grep
- 记忆条：trimlc-repair-window-20261011（实操序+schtasks MSYS 坑+401≠路径存在）/value-face-never-print-path（启动器脱敏前置取段层）/daemon-plane-locality-matrix（8713=TriMLC 本机）

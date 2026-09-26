# 执行卷·白天窗电池门翻位×2+幽灵参存量修复 — watchdog-battery-gate-01

- sourceOfTruth: 本件=FSD 施工执行卷（随做随写；派工正身=dispatch-battery-gate.md @ 2514d173）
- syncMode: working
- lastSyncedAt: 2026-09-26T08:35Z 起
- 施工席: FSD 小全（m-fsd）

## 第一步·先例对表（动工前，BOD 令序）

- 文档面先例留痕检索：W38/W39 树全扫「电池/Battery/Batteries/供电/电源」——incident-sde-settings-01 命中为「锚电池」（断言组同词异物，非本件对象）；**TriModel-Watchdog 电池门翻位无文档面留痕**。
- **活体先例对表（以实勘为准）**：schtasks /query /xml 三任务现态——

| 任务 | DisallowStartIfOnBatteries | StopIfGoingOnBatteries | 拉起链形态 |
|---|---|---|---|
| TriModel-Watchdog（参照=已翻位） | **false** | **false** | wscript.exe → .fade\trimodel-watchdog.vbs |
| Seat-Watchdog（单件①） | true | true | wscript.exe → .fade\seat-watchdog.vbs |
| TriRLC-Watchdog（单件②） | true | true | wscript.exe → trirlc-watchdog-launch.vbs |

- **枢纽预判证实**：电池门=计划任务两条件位，翻位=true→false（TriModel-Watchdog 活体即翻位后形态）。

## 单件① Seat-Watchdog

### 实勘现态

- 任务存在性：EXISTS；电池条件位 true/true（待翻）。
- 拉起链逐跳勘验：
  - 跳1 `.fade/seat-watchdog.vbs`：`WScript.Shell.Run "powershell -ExecutionPolicy Bypass -File ""...seat-watchdog.ps1""", 0, False`——干净形态，无 Start-Process 幽灵参族。
  - 跳2 `.fade/seat-watchdog.ps1`：拉起用 `Start-Process wt.exe -ArgumentList @(...)`（L65 Bootstrap/L70 watchdog 双路）——显式 exe+ArgumentList=干净形态。
- **幽灵参存量勘验结论：本链零幽灵参，修形义务=零动作**（redline 幽灵参形态=`Start-Process -FilePath <.cmd>` ShellExecute 族，本链不涉及）。
- 真源约束注记：vbs/ps1 头部「generated from TriCompany/scripts/ops — 禁直写（sync.ps1 单向维护）」——本件零修形故无冲突；翻位动的是 Task Scheduler 条件位（非文件面），不经 sync.ps1 域。

### 回滚锚（施工前快照）

- 任务定义 XML 导出：`schtasks /query /tn Seat-Watchdog /xml` → 本树 `rollback-seat-watchdog.xml`（翻位前形态）。
- 回滚路径：条件位回 true/true=重导本 XML `schtasks /create /tn Seat-Watchdog /xml rollback-seat-watchdog.xml /f`。

### 施工读数（2026-09-26T08:1x-08:2xZ 段）

- 回滚锚：`rollback-seat-watchdog.xml` 落树，SHA256=31A978C9E7E37AF76D46E9FFBFFBB79BAC6B7D7C51304C7B589CF4DE7BCE30A8（翻位前形态，回滚=schtasks /create /tn Seat-Watchdog /xml 本件 /f）。
- dry-run：BEFORE DisallowStartIfOnBatteries=True / StopIfGoingOnBatteries=True。
- **翻位实弹**：Set-ScheduledTask → AFTER 双 False；任务定义 XML 重读 `DisallowStartIfOnBatteries=false / StopIfGoingOnBatteries=false`（位面真值断言 PASS）。
- AC 态手动触发（Start-ScheduledTask）：日志 `16:11:09 | 全部 12 席在位，零动作`——判定面工作正常；旁证：16:01:05 `Watchdog: 已拉起 1 席（最小化）`=拉起链 5 分钟前自然实弹工作过一次（本职拉起读数）。
- **插拔实弹注记（如实报）**：物理拔电超出本席（AI 席）可达面。等效证据链已就位：①配置位 XML false/false 直接断言（位面真值）②DC（电池）睡眠策略=0x1c20=7200s=2h（插拔短窗零睡眠风险，安全前提在案）③TriModel-Watchdog 同位活体运行多日佐证位语义。真插拔触发读数候 BOD 手补一条（离电态 Start-ScheduledTask + seat-watchdog.log 尾行）。
- 供电形态现勘：Win32_Battery.BatteryStatus=2（AC 在线）、PowerOnline=True——本机为带电池设备，条件位现实意义成立（电源瞬断/离电场景保活链不停）。
- 幽灵参修形：零动作（实勘结论见上）。

### 单件① 验毕判定

- 条件位翻位 PASS + 拉起链形态干净（零幽灵参）+ 判定面/拉起链活体读数在案 + 回滚锚可执行 → **单件① 验毕**（真插拔候补注记不阻验毕：位面断言已直接命中令面目标「条件位生效」）。

## 单件② TriRLC-Watchdog

### 实勘现态

- 任务存在性：EXISTS；电池条件位 true/true（待翻）。
- 拉起链逐跳勘验：
  - 跳1 `trirlc-watchdog-launch.vbs`：`WScript.Shell.Run "powershell.exe -NoProfile ... -File ""...trirlc-watchdog.ps1"""`——干净形态。
  - 跳2 `trirlc-watchdog.ps1` L29：`Start-Process -FilePath "C:\nvm4w\nodejs\node.exe" -ArgumentList "D:\Code\ai\TriRLC\dist\index.js" -WorkingDirectory "D:\Code\ai\TriRLC" -WindowStyle Hidden`——**FilePath=node.exe 直接可执行文件，非 `.cmd` ShellExecute 族**（redline 幽灵参形态=ShellExecute 对 .cmd 走 cmd.exe /c 包装产生双引号嵌套+尾参；.exe 直启无 cmd 包装）→ **非幽灵参形态，修形判零动作候裁**。附注：改为显式 cmd.exe /c 包装反引入一层 cmd 进程+env 继承面=负优化，本席判不修，如实落卷候 CTO 采认。
- **8711 现役读数**（pid 验对纪律）：listen pid=35812，cmdline=`C:\nvm4w\nodejs\node.exe D:\Code\ai\TriRLC\dist\index.js`——干净 node 直启形态活体。
- **复活链同日自然实弹读数**（watchdog.log）：`15:47:52 DOWN (fail 1/3) -> reviving TriRLC 8711` → `15:51:02 recovered; fail counter reset`——**全链 DOWN→reviving→recovered 今天已自然发生**，现役 35812 即拉起体；复活验证读数已在案，本窗不再杀 daemon 复验（「不动 daemon 本体」最小动静+同日实弹读数=验证满足，比波④ 手动 kill 更零打扰）。
- pidfile 注记（如实）：`~/.trimetaverse/` 仅 trilc.pid=7496（TriMLC 8713 体）；TriRLC 8711 无独立 pidfile 分文件——「pidfile 按 port 分文件」裁修（09-18 教训条）实勘未见落地，stop 权威路径的 pid 验对语义候勘（本窗未执行 8711 stop，不受影响；候办观察项录档）。

### 回滚锚（施工前快照）

- `rollback-trirlc-watchdog.xml` 落树，SHA256=D4D40DA1DF93572A89FF8EDE0AF067D0404D34C02BF13E2707CE1A014715E6C5；回滚=schtasks /create /tn TriRLC-Watchdog /xml 本件 /f。

### 施工读数

- dry-run：BEFORE Disallow=True / StopIfGoing=True。
- **翻位实弹**：Set-ScheduledTask → AFTER 双 False；任务定义 XML 重读双 false（位面真值断言 PASS）。
- healthz 留痕：施工后 8711=200 / 8713=200（施工前健康证明=同日复活链 recovered 15:51:02+现役 listen pid 读数在案）。
- 手动触发：LastRunTime=16:14:16，LastTaskResult=0（up 分支静默 exit 0=判定面跑通）。
- 插拔实弹：同单件① 注记（物理动作超本席可达面；位面 XML 断言+DC 睡眠 2h 安全前提+TriModel 同位活体佐证三证据链在案，真插拔候 BOD 手补）。

### 单件② 验毕判定

- 条件位翻位 PASS + 拉起链非幽灵参形态实勘定性（修形零动作候裁）+ 同日自然复活链全链读数 + healthz 双 200 + 回滚锚可执行 → **单件② 验毕**。

## 全窗收口读数（BOD 哨回执用）

1. **条件位终态**：TriModel-Watchdog / Seat-Watchdog / TriRLC-Watchdog 三任务 `DisallowStartIfOnBatteries=false` + `StopIfGoingOnBatteries=false` 全量断言（XML 面逐任务读数）。
2. **daemon 面零扰动**：8713 healthz 200（TriMLC pid=7496 未触）/ 8711 healthz 200（TriRLC pid=35812 未触）；13 席位运行面零动作（watchdog 判定「全部 12 席在位」+seat-watchdog 零拉起新增）。
3. **幽灵参修形**：两链实勘均非 `.cmd` ShellExecute 幽灵参族（Seat=wt.exe ArgumentList / TriRLC=node.exe 直启）——修形零动作，定性候 CTO 采认（修形条款前提不成立，以实勘为准随报）。
4. **回滚锚**：两份 XML 落树（31A978C9… / D4D40DA1…），回滚路径可执行。
5. **真插拔实弹候补**：物理动作超本席可达面，三证据链等效在案，候 BOD 手补一条读数（非阻塞）。
6. **观察项录档**：TriRLC 8711 pidfile 分文件未见落地（候勘）；Seat-Watchdog 16:01:05 自然拉起 1 席读数（本职动作，非本窗扰动）。

- 施工窗：2026-09-26T08:1x-08:2xZ（16:1x-16:2x +0800），单件串行，留痕零交叉。

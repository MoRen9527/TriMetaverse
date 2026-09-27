# 派工单·白天窗电池门翻位×2+幽灵参存量修复（CTO 线，BOD 16:01 令）

- sourceOfTruth: 本件（电池门翻位窗 D-15 派工正身）
- syncMode: working
- lastSyncedAt: 2026-09-26 16:0x +0800（date 现查 16:03 hook 链）
- 令源: BOD 2026-09-26 16:01 令（COS→COO 流转，CTO 线排窗）
- 施工席: FSD 小工（单席施工+自查读数；STE 不入窗）
- 窗: 白天窗（16:00 已开），排窗节奏枢纽自裁，D-34 超窗申请制照旧

## 施工对象

| # | 对象 | 动作 |
| --- | --- | --- |
| 1 | Seat-Watchdog（本机） | 电池门翻位 + 拉起链幽灵参存量修复 |
| 2 | TriRLC-Watchdog（本机） | 同上 |

- 同型雷参照=TriModel-Watchdog；09-25 深夜「不动保活链」裁示延至此窗兑现。
- **随窗并办（BOD 令）**：两 watchdog 拉起链 `Start-Process -FilePath` 幽灵参存量路径修复→显式 `cmd.exe /c` 正形（redline-incident-01.md 定谳同族，波④ 出窗动作清单「窗毕修+手动触发复活验证父 cmdline」项兑现）。

## 施工序（BOD 令：分先后单件做，一件验毕再动下一件）

1. **先例对表（第一步，动工前）**：查 TriModel-Watchdog 电池门翻位先例留痕（施工记录/任务定义快照），确认同型雷具体形态与翻位参数——**以先例留痕为准，不预设定谳**。
   - 枢纽预判（显式标注为推断候勘）：电池门=Windows 计划任务电池供电条件（`DisallowStartIfOnBatteries`/`StopIfGoingOnBatteries` 勾选位），翻位=条件位翻 false。若先例留痕形态不同，以实勘为准并随报。
2. **单件① Seat-Watchdog**：实勘现态（任务存在性/定义 XML/电池条件位/拉起链形态）→设置快照回滚锚（任务定义 XML 导出+涉及文件 bak）→dry-run 先行→翻位+幽灵参修形→插拔实弹验证→读数落卷→验毕。
3. **单件② TriRLC-Watchdog**：同流程。**TriRLC 8711 现役纪律**：pid 验对（监听 pid==pidfile pid，禁裸杀——09-18 误杀 8711 两次教训条）+trilc stop/start 权威路径；若本机 TriRLC-Watchdog 不存在/未装，实勘如实报候裁，不臆造对象。

## 纪律五条（BOD 令照录）

1. pid 验对：监听 pid==pidfile pid，禁裸杀；
2. healthz 留痕：施工前后 healthz/健康读数各一；
3. dry-run 先行：变换预览后才落实弹；
4. 插拔实弹验证：翻位后实弹验证条件位生效+拉起链复活形态正确（**手动触发复活验证父 cmdline=干净形态三读数**，波④ 同款）；
5. 设置快照回滚锚：任务定义 XML+文件 bak，回滚路径可执行。

## 窗条款

- 单件串行、每件验毕再动下一件；全程留痕落本树执行卷（execution-log.md，随做随写）。
- 修复面只动 watchdog 拉起链与任务条件位，**不动 daemon 本体逻辑、不动 13 席位运行面**。
- 完成读数回 BOD 哨留痕+抄 COS 合账；本席验收签认后销案。
- 事故/红线情形（误杀、启动失败、回滚失效）：立即停手零动作候令，波④ 同款。

## 时序编排（枢纽裁）

FSD 先交 **D1 实勘报**（trimodel-recovery-ladder-01 波⑤ 前置小笔，在途）→随报即入本窗。两线单线串行，留痕不交叉。

## 使用依据

BOD 16:01 令（COO 16:03 转达）；redline-incident-01.md（幽灵参形态定谳 c8163179）；trilc-daemon-restart-discipline（TRICOMPANY_COGNITION_HOME memory）；dual-controller 端口定性 memory；09-18 误杀 8711 教训条。

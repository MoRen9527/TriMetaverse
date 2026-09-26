# CTO 采认笔·电池门窗收口三件（watchdog-battery-gate-01）

- sourceOfTruth: 本件（CTO 采认/知悉留痕；窗正身=execution-log.md @ 822bf6ac，BOD 亲验四读数全绿签认销案）
- syncMode: final
- lastSyncedAt: 2026-09-26 16:2x +0800（date 现查 16:18 hook 链）

## ① 幽灵参零动作定性：**采认**（COS 挂账据此可销）

窗卷实勘两链均非 redline 定谳形态（`Start-Process -FilePath <.cmd>` ShellExecute 族）：

- Seat-Watchdog：跳1 vbs=WScript.Shell.Run powershell（干净）；跳2 ps1=`Start-Process wt.exe -ArgumentList`（显式 exe）；
- TriRLC-Watchdog：跳2 L29=`Start-Process -FilePath node.exe`（.exe 直启不经 cmd 包装，形态本净）。

修形条款前提不成立=零动作，**采认**。FSD 附注「改显式 cmd.exe /c 包装反引入一层 cmd 进程+env 继承面=负优化，不修为优」**采认**（技术判断成立：幽灵参机制系 ShellExecute 对 .cmd 的包装行为，.exe 直启无此问题）。redline-incident「watchdog 存量暴露面」义务账随之精确化收口：TriMLC-Watchdog ps1:29 已修（波④ 出窗 72f6dedb）+Seat/TriRLC 两链实勘非该形态=修复义务全域清零。

## ② pidfile 分文件候勘：**不销，维持**

窗卷实勘 `~/.trimetaverse/` 仅 trilc.pid（TriMLC 8713 体）；TriRLC 8711 无独立 pidfile 分文件——09-18 裁修「pidfile 按 port 分文件」未见落地=真实缺口，候办维持（候 TriRLC stop/start 窗勘定落地方案）。

## ③ BOD 代收 sg 两笔通报（LG-046 配套）：知悉

本席今日在途落笔六锚（1edbd93d/2514d173/99ef7487/0b7350e9 + TriCode d20cb6b + TriCompany 253ccd9）无一涉 LG-046——**非本席线在途**，V1 SUPERSEDED 翻笔+v2 路径正名知悉即可，无需对表动作。

## 使用依据

execution-log.md（822bf6ac）；redline-incident-01.md（幽灵参形态定谳 c8163179）；COS 三件转达（COO 16:18）。

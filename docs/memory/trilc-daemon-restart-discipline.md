---
name: trilc-daemon-restart-discipline
description: TriLC daemon 重启走 trilc stop/start 权威路径禁裸杀；双 daemon 主机 stop 前必验监听 pid==pidfile pid（2026-09-18 误杀事故+CTO 规范）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-09-17T18:55:52.191Z
---

2026-08-15 CEO 手测期间：编排层多次用 `Stop-Process -Id <LISTENING PID>` + `.cmd` 拉起的方式重启 TriLC daemon，出现「以为换了进程实际没换」的混乱（CLI 的 cmdStart 基于 pidfile 判 already running → 新进程静默退出，旧进程继续服务旧代码；healthz uptime 与进程 CreationDate 对不上，排查耗时三轮）。

**Why:** cli.js start 的已运行判定走 pidfile；裸杀 LISTENING PID 不清 pidfile，且 kill 时机/目标错位会造成 pidfile 指向与真实监听进程不一致，新旧进程身份混乱，CEO 侧看到「补丁没生效」假象。

**How to apply:** 重启 TriLC daemon 一律两步：① `node "C:\Program Files\TriCade\trilc\dist\cli.js" stop --port 8711`（graceful 清 pidfile，输出 stopped pid= 确认）② `trilc-daemon.cmd` 拉起（env 注入面在 .cmd 里——纯 ASCII，见 [[trilc-daemon-cmd-ascii]]）。验证新进程：healthz uptime 应为小值 + 进程 CreationDate 匹配。装后态扩展部署位 = `~/.vscode-oss/extensions/local.tripilot-chat-<version>`（VSCodium 用户级优先；版本号必须 bump，manifest 缓存按 id+version）。

2026-08-18 事故 reinforcing：TriPilot 修复打了 UAC 补丁到 `C:\Program Files\TriCade\extensions\` 的内置副本——**完全无效**，实际生效的是 `~/.vscode-oss` 用户级副本（0.0.11），CEO Reload Window 后仍见旧缺陷，白白消耗一轮复测。教训：**改 TriPilot 装后态 = 只改 ~/.vscode-oss + bump 版本 + 更新 extensions.json 条目**；Program Files 副本是死副本，除非走正式 MSI 重装。另外 UAC 弹窗在 CEO 不看屏幕时会被拒/超时，用户级目录方案无需 UAC，优先走。

2026-09-18 LG-036 部署事故+CTO 裁决（pidfile 结构性缺陷实锤）：本机 8711(TriRLC)/8713(TriMLC) 双 daemon **共享 `~/.trimetaverse/trilc.pid` 单文件**（paths.ts:13，无端口命名空间）——`trilc stop --port 8713` 两次读到 TriRLC 注册的 pid（15492/8480）并 SIGTERM **误杀 8711**，均经 `Start-ScheduledTask "TriRLC Daemon"` 权威路径恢复。**CTO 裁修**（FSD 件）：pidfile 按 port 分文件（`trilc-<port>.pid`）+读后验监听一致性。**修复落盘前临时规避即刻生效（DE 操作注记）**：任何 stop 前必验「监听 pid==pidfile pid」（Get-NetTCPConnection -LocalPort <port> 定点核对），不一致即停手报告。

补充正身：① 非提权会话杀不动提权 daemon（Stop-Process/schtasks /RU SYSTEM 均 Access denied）——优雅停正身=对 daemon 自身 `POST /shutdown` 带 `TRILC_INTERNAL_TOKEN` 门 token（旧版 app.js /shutdown 端点 401→带 token 200→process.exit(0)，零权限解决）。② 裸 `.cmd` 拉起前若旧进程未清 pidfile，新版 CLI start 会误判 already running 静默退出——拉起后必须 healthz uptime 小值+新 pid 实证。③ 8711 复活进程启动时会向共享 pidfile 注册覆盖——多 daemon 主机上恢复动作与 stop 动作要错时序执行（先停后拉、后复活被误停方）。

2026-09-18 修复落地跟进（CTO 接线）：TriRLC `09980b8`（pidFileFor(port) 分文件+verifyPortPidConsistency 一致性门+legacy 兼容）/TriMLC merge `450a286` 已收官，**但现役两 daemon 尚未载新码**——过渡窗口期（`~/.trimetaverse/` 零 pidfile 实勘 02:55）：**禁用 CLI stop**（pidfile 缺失 fallback=port lookup+SIGTERM 兜底，错位风险残留），stop 正身=TriRLC 走 `Start-ScheduledTask` 生态权威路径 / TriMLC 走 token 门 `POST /shutdown`。新码生效后自动写 `trilc-<port>.pid` 窗口闭合。验收集=docs/workflow/operating-records/2026-W38/pidfile-fix-verify-checklist.md（四案回归），窗口评估=并入下次部署窗不专门起停。

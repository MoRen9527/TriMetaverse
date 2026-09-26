# FSD 演练窗红线破事故勘验记录 — TASK-TRIMODEL-RECOVERY-LADDER-01

- sourceOfTruth: 本件=FSD 席勘验记录（CTO 勘验令五项清单响应；事故定责候枢纽裁）；派工=CTO 勘验令 2026-09-26 12:50 +0800
- syncMode: static
- lastSyncedAt: 2026-09-26T05:25Z
- 席位: FSD 小全（m-fsd）

## 事故概述

2026-09-26 12:32:48 +0800：restore-direct 经 cron 链写真活体 `~/.claude/settings.json`（hash d7a565ca≠基线 491F…78B2）——restore 进程 env 无钉位（drill 产物零产生+写入值用真 legacy 钥）。STE 停臂全停，回滚由 STE 执行。

## 五项勘验（全程只读）

### ① 第二刀启动方式对质

- 实际命令：`Start-Process -FilePath "$env:LOCALAPPDATA\trimlc-daemon-channel.cmd" -WindowStyle Hidden`
- 29844 父进程 CommandLine 实证：`cmd.exe /c ""C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd" "`——启动即落钉位文件，无第二启动路径。

### ② 启动链指向比对

- watchdog 链：`C:\Users\jedih\AppData\Local\trimlc-watchdog.ps1:29` → 同一路径 `$env:LOCALAPPDATA\trimlc-daemon-channel.cmd`。
- 多份拷贝：LOCALAPPDATA/TriMLC/.fade/trimlc-channel/.claude 五位置全扫仅一份（3159B，mtime 11:48:08=第二刀 Edit）。**改的=启动读的=同一份**。

### ③ daemon 进程 env 实勘（决定性）

- 手段：NtQueryInformationProcess + ReadProcessMemory PEB 直读（OpenProcess 0x0410 只读；ProcessParameters+0x80 → Environment，+0x3F0 size，Unicode 解码，128 变量全量）。
- **四钉位键全部 ABSENT**：`TRIMODEL_CLAUDE_SETTINGS` / `TRIMODEL_DEPLOY_KEY` / `TRIMODEL_AUDIT_LOG` / `TRIMODEL_L2_FLAG`。
- 在位：`TRILC_PORT=8713`、`TRILC_CRON_COMMAND_ALLOWLIST`（stub+l3 两项）、`Path=…;C:\nvm4w\nodejs`（发现-A guard 生效）。
- 剖面：钉位块前（L4）与块后（allowlist/guard）的行全部生效，唯独块内 L19-22 四条 set 未生效。

### ④ channel cmd 结构勘验

- 无 setlocal/endlocal、无 start 调用；钉位 set 行在 node 启动行之前同进程直 exec——结构无传代断裂面。
- 字节面：无 BOM、CRLF、UTF-8 编码，L17-18 中文 rem 行。

## 根因定谳

**L17-18 中文 rem 行在 cmd.exe GBK 解码下，行尾字节（「。」=E3 80 82 尾字节 0x82，落 GBK 双字节首字节区）吞并 CR → 行边界破坏 → 紧随的 L19-22 四条钉位 set 行被吞**。

同族坑项目源码早有明文：TriMLC `src/daemon/schtasks.ts:53-54`「em-dash 在 GBK cmd.exe 下尾字节解析破坏 rem 行 → 下一行被吞。**rem 行严禁非 ASCII**」——本席写 DRILL WINDOW 注释时未执行该纪律。

## 完整事故链

1. 两刀 DRILL WINDOW 注释均用中文全角（违规明文纪律）。
2. GBK 吞行 → 四条 set 未执行 → daemon env 四键 ABSENT（PEB 实证）。
3. cron runner `TriMLC src/cron/timer.ts:284` `spawn(shell, shellArgs, { cwd, windowsHide: true })` **无 env 参数=全量继承 daemon env** → stub env 同 ABSENT。
4. 发现-A 修复后 node 可达 → 12:32:48 stub 首次真正执行 restore-direct → DEPLOY_KEY ABSENT → CoreIO 缺省解析回退真 legacy 钥 → 写真活体 settings.json；CLAUDE_SETTINGS/AUDIT_LOG 同 ABSENT → drill 产物零产生（CTO 手里三读数全部闭环）。
5. 第一刀窗内四键推定同 ABSENT（同构块），但 F2 八连败在 node 可达层即失败、未跑到读 env 阶段——缺陷被发现-A 遮蔽至第二刀显形（同构推定，当时未做 PEB 勘验，如实标注）。

## 操作面责任如实录

注释写法违反项目明文纪律（rem 行严禁非 ASCII），两刀同缺陷，根因在本席操作面。修复候裁方向：钉位块与全部注释改纯 ASCII（或钉位 set 行前移至任何非 ASCII rem 之前）+「cmd/ps1 非 ASCII rem」入交付自检项。

## 使用依据

- CTO 勘验令（五项清单）2026-09-26 12:50 +0800；勘验实测读数如上（PEB 直读/Win32_Process/Get-NetTCPConnection/字节面读，零写零 kill）。

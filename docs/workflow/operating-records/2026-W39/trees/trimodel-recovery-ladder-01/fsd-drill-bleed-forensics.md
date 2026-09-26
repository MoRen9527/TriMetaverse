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

> **勘正（2026-09-26T06:1xZ，第三刀后）：本段原 GBK 吞行定谳作废**——第三刀纯 ASCII 化后第一次重启（20584）四键仍 ABSENT（反例一）；同内容文件沙箱复刻（node 行换 env dump）四键全 PRESENT（反例二）。文件与 cmd 解析双双无罪。原文留痕如下，真根因见下段。

~~L17-18 中文 rem 行在 cmd.exe GBK 解码下，行尾字节（「。」=E3 80 82 尾字节 0x82，落 GBK 双字节首字节区）吞并 CR → 行边界破坏 → 紧随的 L19-22 四条钉位 set 行被吞。同族坑项目源码早有明文：TriMLC `src/daemon/schtasks.ts:53-54`「rem 行严禁非 ASCII」——本席写 DRILL WINDOW 注释时未执行该纪律。~~
（非 ASCII rem 纪律本身仍成立且已由第三刀落实；只是它不是本次事故根因。）

### 勘正后真根因：Start-Process ShellExecute 幽灵尾参形态

- **假形态（事故形态）**：`Start-Process -FilePath <.cmd>` → 父 cmdline=`cmd.exe /c ""C:\...\trimlc-daemon-channel.cmd" "`（双引号嵌套+**尾部幽灵空参数**）——四键 ABSENT 实测三次（29844/20584，+45972 同形态推定）。
- **真形态（修复形态）**：`Start-Process -FilePath cmd.exe -ArgumentList '/c','"path"'` → 父 cmdline=`"C:\WINDOWS\System32\cmd.exe" /c "C:\...\trimlc-daemon-channel.cmd"`（干净单参）——33328 四键全 PRESENT（PEB 实证）。
- 同一文件、同一解释器、两种调用形态两种结果；失效剖面=DRILL WINDOW 整块（L16-24）而块前块后行全活，cmd 精确解析机制未定谳（候后续勘/裁入册）。
- 证据链：沙箱复刻 dump（同一文件四键 PRESENT）/ PEB 直读（假形态 ABSENT×2、真形态 PRESENT×1）/ 父 cmdline 对照。

### 工程教训（三刀串）

文件面读数会过、沙箱单测会过，唯有**进程面 PEB 实勘**抓真凶——CTO 新条款（进窗必附 PEB 四键 present）为对的上颚，首刀执行即抓出修复无效。

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

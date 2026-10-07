# LG-065 段2 · 8713 合流冷起手术读数卷（2026-10-07）

- sourceOfTruth: 本件（SDE 面手术执行读数正身；上游=COO 开窗令 16:49 CEO 亲令开窗+昨日卷 trimlc-8713-surgery-readout-20261006.md §7.8/7.9 工序正身）
- syncMode: static
- lastSyncedAt: 2026-10-07T08:59:30Z（date 现查 16:59:30+0800）
- 执行席: SDE 小布（m-sde）；窗令=LG-065 段2 17:10-18:00（定标 10-06 同工序实绩 48min，上界=BOD 框）
- 工序全款: S0 三件套基线+双备份→S1 watchdog Disable→S2a build→S2b shutdown→S2c 冷启→S2d korw 真刀→S4 归位四读数→S5 watchdog Enable

## 段1 GO 刻（前置件，16:49-16:58）

三件全绿（RunAs+CEO UAC 确认，输出落盘 %LOCALAPPDATA%\trimlc-admin3item-out.txt）：

| 件 | 读数 | 判 |
| --- | --- | --- |
| item1 TaskScheduler Operational log | enabled false→**true**（wevtutil before/after 双读） | ✓ |
| item2 systemprofile 探针（只读） | `...\systemprofile\.trimetaverse` **exists=True**；dir=True | ✓ B 裁牵引面实锚 |
| item3 `\TriMLC Daemon` 注册 | REGISTER-OK；独立四点补验：Status=Ready／TaskToRun=trimlc-daemon-channel.cmd 正身／RunAs=jedih LeastPrivilege InteractiveToken／At logon | ✓ |

- anti-run guard：零 /run 零 StartScheduledTask（脚本尾自证段在位）；真触发=下个自然 logon 窗（CTO 裁 A）
- 勘差注记：脚本内置 3-point assert 段空输出（admin 上下文流问题）——独立补验成立，不影响判读
- GO 刻报两发（COO d7d091cd+BOD c6a1c281，16:5x）

## S0 基线六件（只读预采 16:57-16:59，写面 17:10 后）

| # | 项 | 读数 |
| --- | --- | --- |
| 1 | 8713 healthz | ok／service trimlc／uptime 80574s（10-06 18:34 起）／cron jobCount=7／degraded=false |
| 2 | 监听 pid | **1604**（created 10-06 18:34:42，node dist/index.js，parent=cmd /c trimlc-daemon-channel.cmd） |
| 3 | S1 对象勘验 | **TriMLC-Watchdog=ScheduledTask**（One Time+Minute 重复，Status Ready，Last Run 16:57:01／Next 17:02:00，wscript+trimlc-watchdog-launch.vbs 无窗形，RunAs jedih）——S1=`schtasks /change /tn TriMLC-Watchdog /disable` |
| 4 | TriMLC 仓顶 | **6f832a1**（三笔钉死段验证过：6f832a1 顶+03c6197+2b1709d 全在最近 4 笔） |
| 5 | dist 旧 build 锚 | cli.js mtime **Oct 4 03:05**（S2a build 前基线） |
| 6 | store 落位+korw | DATA_DIR pin=`%LOCALAPPDATA%\trilc-channel`；cron.db jobCount=7 与 healthz 对平；**korw cron_muh6shv0_ko 在册 enabled=on，next_run_at=2026-10-05T09:44:00.000Z（过去时刻冻结态=挂死实锚）** |

- channel.cmd 键名面盘点（值零回显）：TRILC_DATA_DIR/TRIMC_INTERNAL_TOKEN/TRILC_INTERNAL_TOKEN/TRILC_CRON_COMMAND_ALLOWLIST 等 20 键在位——S2b shutdown token 门源确认
- 旧提醒链拆除（16:54）：8711 job cron_muxj3q29_2utj DELETE 200（首次 404 系请求少 /internal/v1 前缀勘差即纠）+会话 cron 6569f870 删——17:50 误触发面清零

## 段2 执行（17:10 开窗后续写）

（执行中逐段补）

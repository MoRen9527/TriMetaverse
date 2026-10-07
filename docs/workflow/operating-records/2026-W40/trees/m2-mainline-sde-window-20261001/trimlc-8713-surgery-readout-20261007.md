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

## 段2 执行读数（17:10:03 开窗，全序毕 ~17:12:30，用时 ~2.5min vs 定标 48min）

| 步 | 动作 | 读数 | 判 |
| --- | --- | --- | --- |
| S0 | store 三件+dist 双备份 | 锚=`20261007T091014Z`（cron.db+wal+shm+dist.bak-pre-surgery2-*） | ✓ |
| S1 | watchdog Disable | schtasks SUCCESS+query **Disabled** | ✓ |
| S2a | npm run build（仓顶 6f832a1） | exit=0，09:10:34Z→09:10:43Z（9s）；dist 新锚 mtime Oct 7 17:10；**build 时点锚=2026-10-07T09:10:43Z** | ✓ |
| S2b | POST /shutdown | **首发 401 即停**（裸 POST 无门形系源码 L4275 旧读，现役进程带 X-Internal-Token 门）；勘因修正带 token 重发=**200 {"ok":true}**；锚1：8713 端口空+pid 1604 exited | ✓ |
| S2c | 冷启 channel.cmd（用户身份分离，无提权） | healthz 200 uptime=4s、**新 pid=31796**、jobCount=7 store 完整带出 | ✓ |
| S2d | korw 真刀（boot sweep 优先） | **state=idle**（泄漏归位）+**last_run_at=09:11:31.160Z status=ok**（boot 补跑执行成功）+**next_run_at=09:12:00Z 恢复滚动**（120s every 档）；updated_at=09:11:31.679Z=sweep 动作时点；run_count=5662。**根治包验收过，SQL 兜底分支未触发** | ✓ |
| S4 | 归位四读数 | ①healthz 二读 trimc=**connected**（mc_link 恢复）②pid 31796 created=**17:11:29.742+08 ＞ build 17:10:43**（完工判据 PASS，差 46.7s）③store jobCount=7 对平 ④korw idle/ok/滚动 | ✓ |
| S5 | watchdog Enable | schtasks SUCCESS+Status **Ready**+Next Run 17:17:00（恢复巡检） | ✓ |

- S2b 勘差注记：TriMLC /shutdown 门形=**X-Internal-Token header**（源码 src/server/app.ts L4275 现顶代码为无门形，现役旧 build 行为带门——版本差行为分叉，token 门随新 build 带出后的行为候观察）；TriRLC 家族 Authorization Bearer 形不同，勿互套
- 12min 复读锚：korw 滚动持续性复读候 17:24（last_run 推进+next_run 滚动+state=idle 三点）
- **17:24 复读毕（验收完整闭环）**：korw state=idle／last_run=09:24:00.021Z ok／**run_count 5662→5668（+6 轮滚动）**／next_run=09:26:00Z 持续滚；其余 5 enabled job 零连坐（全 idle/ok/next_run 正常滚动）；healthz 终读 connected/uptime 759s/degraded=false——根治包验收 PASS
- CTO 认收+归项（17:2x）：段2 全绿认收；/shutdown 门形版本差=低危技术债非事故，**归 S3 TriRLC/TriMLC 维护波并项**（8711 F-3 修复窗顺带补形）；鉴权门形四 daemon 碎片化（RLC=Bearer/MLC=X-Internal-Token/RMC 双收/MMC 候勘）升 S3 判据卷「鉴权门形统一标准」条（基准候选=TriRMC 双收形）——SDE 面知悉待命

## 段2 收口

- **最终状态：全序 S0-S5 七步全绿，零回滚零阻塞**
- smoke：healthz 200 ok（三读：冷启 4s/30s/终态 connected）
- 完工判据：ExecMainStart（17:11:29.742+08）＞ build 时点（17:10:43Z+08）✓
- 回滚方案状态：store 三件+dist 备份在位未动用（bak-pre-surgery2-20261007T091014Z），保留至观察窗毕
- korw 挂死（10-05 冻结态）**根治闭环**：boot sweep 归位+补跑 ok+调度滚动恢复

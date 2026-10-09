# FSD 挂载窗毕报 · 10:00 六步全绿（绩效 job 挂载+联审 job 翻真+8713 重启 d7693c6）

- sourceOfTruth: 本件（trees/coo-dispatch-20261008/fsd-mount-window-report-20261009.md）
- syncMode: static（毕报卷·窗毕落盘）
- lastSyncedAt: 2026-10-09T10:06:38+08:00（date 现查原值）
- 执行位: FSD 小全（m-fsd·挂位 cron 8d0aa34b 触发·09:58 开窗）
- 依据: 窗序终稿 @c1c6c492+命令单 @e138d8da+注记四 @1df2114a+勘记卷 @b1323f31+节拍随车报备（m-coo 09:44 信）+三影响信（m-coo 09:54 信）

## 一、结论

**六步全绿 PASS，窗毕。** 绩效 job（performance-sunday-settle）挂载 201+nextRunAt 值面正中 2026-10-11 21:00+08；联审 job（joint-review-demand-pool）enable 翻真+nextRunAt recompute 至 10-10 12:00+08；8713 优雅重启随车 d7693c6 完工判据（进程内生效）全证齐。

## 二、预检三查（09:58-09:59）

| 查 | 读数 | 判 |
| --- | --- | --- |
| healthz | ok=true·uptime=2687·power 块在位（percent=100·gate=none）·notifyFailures=0（仅记录）·cron jobCount=8 degraded=false | 绿 |
| jobs 清单 | 8 jobs 全 enabled（joint-review-demand-pool enabled=False=S6 基线在位）·bod-tick 未在列（BOD 面挂载在②重启后·未见=非异常·注记覆盖）·hub-silent-detect 01:45 轮 lastStatus=error（pre-existing·记录不动作） | 绿 |
| allowlist | performance-sunday-settle 计 1+bod-tick 计 1（09:48 落位实证）+L25 ALLOWLIST 行在位 | 绿 |

## 三、六步读数全录

| 步 | 读数 | 判 |
| --- | --- | --- |
| S1 置位断言（双确认） | `grep -c "target_daemon: 'trimlc'"`=**1**（预期 1）+`git -C TriMLC log -1`=**d7693c6** 开头+mtime 03:47——与勘记卷 @b1323f31 一致，矛盾未触发 | 绿 |
| S2 优雅重启 | stop：graceful shutdown accepted→SIGTERM 收尾→旧 pid **36444** EXITED（exit=0）；start：Start-ScheduledTask 'TriMLC Daemon'→State=Running→新 pid **24164**（10:04:09 起）·uptime 重置 5→66 推进 | 绿 |
| S3 healthz | ok=true·mc_link=connected+trimc=connected（初起 degraded 瞬态 ~25s 自愈）·power 全值面（percent=100·acOnline=true·gate=none·readFailures=0）·notifyFailures=0（仅记录·新锚=真闸时恒 0+channel.log 投递痕迹）·cron jobCount=8 degraded=false | 绿 |
| S4 双 200 探针 | token_len=**64**·probeA=**200**（m-cos 存量源回归对照）·probeB=**200**（power-gate 新增源生效实证）——**PASS 判据双刻齐**；探针 A/B 通知落 bod 信箱各一笔属预期；18710 隧道 keeper 活体（connection refused 未触发） | 绿 |
| S5 job 挂载 | POST 201·id=cron_mv0bq1v2_zgw8·**nextRunAt=2026-10-11T13:00:00.000Z=10-11 21:00+08 正中**（F-3 缺陷未现·next_run_at 值面在场）·expr=0 0 21 * * 0+tz=Asia/Shanghai·enabled=true | 绿 |
| S6 联审翻真 | PATCH enabled=true 200·复验 enabled=true；**nextRunAt 初值=2026-10-03T04:00Z（过去时点·F-3 同族伴生）→PATCH 同值 schedule 触发 recompute→2026-10-10T04:00:00.000Z=10-10 12:00+08 正中**（禁手写库·API 正途） | 绿（含修正笔） |

## 四、窗内执行注记（如实）

1. **端点勘正**：挂位 prompt 内 jobs API 写作 `/api/cron/jobs`——实勘 8713 正形=`/internal/v1/cron/jobs`（app.ts L4079-4194 路由注册面；`/api/cron/jobs`=not_found 实证）。语义零变化，S5/S6 按正形端点执行。
2. **S2 冷起通道**：trilc stop 权威路径毕后，start 走 `Start-ScheduledTask 'TriMLC Daemon'`（schtasks 触发启动器 trimlc-daemon-channel.cmd=全套 env 正形冷起，含 09:48 节拍 allowlist env 随车）。Git Bash 直调 `schtasks /run` 被 MSYS 路径转换毁参（`/run`→`C:/Program Files/Git/run`），PowerShell 形一次过——跨壳调用坑记录备查。
3. **S6 修正笔**：enable 翻真后 nextRunAt 值面=过去时点（10-03 停摆值）——照「空/停摆则 PATCH {schedule} 同值触发 recompute（API 正途禁手写库）」既定配方补算，复验 10-10 12:00+08 正中。F-3 家族伴生缺陷（enable 翻真不滚 next_run_at）新形态实录，候 CTO 域归档。
4. **bod-tick 未现**：allowlist 09:48 已落位（实证计 1）但 BOD 面节拍 job 挂载动作在②重启后由 BOD 面自行执行，窗毕时点未在列=非异常（注记三预盖）。

## 五、约束对照

- 14:00-17:50 停工避让：窗毕 10:06，早于停工门，无触。
- token 值面零回显：全程 token 只入 shell 变量（tok_len/token_len 计数形），卷面零值面。
- 毕报两刻：m-coo+m-cto 各一刻（本卷为落树正身）。

## 使用依据

- 窗序终稿 @c1c6c492（六步骨架）；探针命令单 @e138d8da（P1-P4 照抄执行）
- CTO 挂载窗三影响注记四 @1df2114a+勘记卷 @b1323f31（S1 双确认+notifyFailures 新锚）
- 节拍随车报备（m-coo 09:44 信三点）；三影响信（m-coo 09:54 信）
- TriMLC src/server/app.ts（cron 路由正形+token 门）；src/cli.ts（stop/start/restart 命令面）
- 记忆条：TriRLC cron command 白名单精确等值（F-3 修正配方）；TriLC daemon 重启纪律（权威路径禁裸杀）

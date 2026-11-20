# SDE WO-RW1 件②供给面毕+件④只读勘毕报（批 2/批 3·零写面遵令·恢复面候裁）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/sde-rw1-batch23-readings-20261120.md·件②+件④读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 执行席: SDE 小布（m-sde）；令源=COO WO-RW1 开工激活令（§六 增补令·cba2079bc·台账 636·落款 10:18:40+08）
- 判定: **件②债 1/6 供给面=毕（token 单值源文件+setx 双件+继承验证绿）·件④只读勘=毕（keeper 17028 成因定性+weekly-plane-shift error 实锚·零写面遵令）——恢复面=写面候裁**

## §一 · 件②债 1/6 供给面毕读数（即启段·D-46 全程）

| 件 | 动作 | 读数 | 判 |
|---|---|---|---|
| 债 6-① | token 单值源文件创建 | `%LOCALAPPDATA%\trilc-channel\internal-token`=**64B 纯值**（无尾换行）·ACL 收权（inheritance:r+仅当前用户 F）·值源=.cmd 现役 TRILC_INTERNAL_TOKEN（regex 提取·长度断言 64 过） | ✓ |
| 债 6-② | setx 过渡 | `setx TRILC_INTERNAL_TOKEN`（user env）rc=0·User env 读回长度=**64**·文件 vs User env 一致=**True** | ✓ |
| 债 6-③ | 新进程继承验证 | 新起 powershell 进程读 Process 级 env：TOKEN 长度=**64**+PORT=**8713**——新会话即生效实证（CTO 承录语义兑现）·存量会话=重启窗收口（候批 1 窗） | ✓ |
| 债 1 | port 缺省供给面 | `setx TRILC_PORT 8713` rc=0（显式化·hook/cleanup 脚本面 env 缺省 fallback 依赖自此卸）·现役 port=8713 与缺省一致零错位 | ✓ |
| 勘定注 | .cmd 现形 | TRILC_INTERNAL_TOKEN 内嵌字面值单点（64hex·.cmd 中部 set 行）=断配对根源形态承录；**单值源完全形=daemon .cmd 改 set /p 读文件形+hook 端文件 fallback（码面候选）——候批 1 唯一窗兑现（改 .cmd 前置三清=batch-offset-misalignment 家族教训·零提前动手）** | 注 |

D-46 全程：值面零回显（regex 变量提取+长度断言形·零 print 值）✓。

## §二 · 件④-1 keeper 旧残留 17028 成因勘（只读·取证到顶）

**链路定谳**：
1. PID 17028=**sg-trimc-tunnel keeper 进程**（tunnel.log L37478：2026-11-11T14:16:11Z keeper start·while 循环每 60s 探 18710→sg 8712 隧道）。
2. **死亡窗=2026-11-20 04:32:27–04:33:27+08**（末行 46384「tunnel alive (http 401)」后零新行·log LastWrite 04:32:27）——此后**零 start 行=死而不复**（历史 9 次 start=9-30 起死亡-登录复活常态形·本次首破）。
3. **现役影响面（升级非旧残留）**：18710 **零 LISTEN**（隧道 ssh 同死+keeper 缺位=零自动重连）→**TriMLC healthz mc_link=degraded·trimc=degraded**（uptime_s=13753≈06:36 冷启后 M 面链降级 6h+·TRIMC_BASE_URL=127.0.0.1:18710 断）。
4. **复活链断点**：HKCU Run[sg-trimc-tunnel] 键**在**（wscript tunnel-keeper.vbs）——但宿主 **LastBootUpTime=11-11 21:46 零重启**（TriRLC 8711 pid 10768 started 11-11 21:59 连续在役 9 天=同窗活体反证）→Run 键（登录触发形）稳态运行期**无覆盖**；TriLiveness-L1=**Disabled**（LastRun 10-11）+L2=stub——巡检复活链亦缺位。04:35:56 trilc-wake-tunnel-keeper 任务触发（TaskScheduler 100→129→201 rc=0 同秒完）=**单任务触发非会话事件**（无 6005/7001/TS-LocalSessionManager 事件=零登录零重启）。
5. **死因定性（置信标注）**：零崩溃记录（Application 1-3 级零）·零重启零注销·tri-liveness 链停用——**进程外部静默终止（元凶无痕·候选=手动 Stop-Process/未知清理链）或 PS 终止级异常（零日志面）**——置信中；4096 VBScriptDeprecationAlert（04:32:01）=背景噪音排除（30 天 3286 条日均 100+）。**设计缺口=keeper 常驻死亡无看护（仅登录拉起单点）**。

**恢复正形（候裁·零写面遵令未动）**：①即启=wscript vbs 形拉起 keeper→隧道重连→mc_link 复绿探针（完工判据=变更值面）②中期=keeper 复活机制设计（schtasks 常驻形态/看护链·登录依赖去除）候令面。**止损评估：mc_link degraded=稳态断 6h+ 非恶化中·M 面通知/连接链降级影响面如实报 COS 候裁**。

## §三 · 件④-2 weekly-plane-shift error 只读勘（heyuan TriRMC 8710·零写面）

- **通道勘正**：R-HY 别名正名=`R-HY-8.155.54.79`（config 实勘）·token 正形=远端 `systemctl show -p MainPID` environ 读形（tri-liveness 脚本承·零文件路径猜读）。
- **job 现读数**（/internal/v1/cron/jobs·X-Internal-Token 变量形）：name=weekly-plane-shift·enabled=True·id=9c81c7ec…·state.lastRunStatus=**error**·lastRunAtMs=**2026-11-19T09:05:51Z**（+8=17:05:51·**62 拍同窗**·run_id shift-W46-20261119T090551Z 吻合）·nextRunAtMs=**2026-11-22T15:50:00Z**（+8=周日 23:50 窗）。
- **lastError 全文**：`command exited with code 2: From ssh://47.245.122.61/srv/git/TriCompany / * branch dev -> FETCH_HEAD`。
- **定谳材料（CTO 早判勘正注）**：fetch 段输出**正常完整**（「From ssh://…」+「* branch dev -> FETCH_HEAD」=fetch 本体成功列 ref）——**非网络抖动族直接证据**（早判概率面勘正如实注）；62 拍 run_dir 主流程全套在（N3 勘实证 plan/close/preflight/qualify/… 全套）=**拍面主流程成·rc=2=fetch 后段（收尾/trap/通知段概率高）**——精确失败点候 job 运行日志深勘（值席/CTO 域·**job 现役件禁直改护栏承**）。
- 本机对照注：TriMLC 8713 plane-shift-local-align=**ok 面**（runCount=13·重启窗后全绿）——两 daemon 两面独立（N1 卷 §三.3 error 载体=TriRMC 8710 勘正确认）。

## §四 · 护栏遵守

零写面遵令（keeper/weekly-plane-shift 两件纯只读·恢复面候裁未动）✓｜D-46（token 值面零回显·变量/长度断言形·两机两通道一致）✓｜D-47（落款=date 现查原值）✓｜机位活体现探（D-24·config 别名实勘+systemctl environ 正形）✓｜job 现役件禁直改 ✓｜止损评估回 COS 候裁（§二）✓｜token 文件 ACL 收权+纯值无尾换行（set /p 兼容形态预留）✓。

## §五 · 使用依据

- COO WO-RW1 派工单（03a774365）+§六 开工激活令（cba2079bc·台账 636）+COS N5 现态问询回执（0809ef33·在工面如实报）
- CTO R6-hook 门禁卷 54189048a（债 6 立项）+债 6 定谳卷 ccb267159（token 配对错位·单值源正解+setx 过渡承录）+N4 判读卷 b3c92f510
- 活体读数：tunnel.log 全程（L37478 start/L46384 末行）+HKCU Run 键+Get-NetTCPConnection 18710/8711+TriMLC 8713 healthz+TaskScheduler 事件（100/129/201）+Win32_OperatingSystem LastBootUpTime+heyuan jobs API（M-SG→R-HY 跳板·environ token 形）+tunnel-keeper.ps1/vbs 本体+tri-liveness 任务族
- 债 1/6 勘修正解=CTO 定谳方向（token 文件单值源+setx 过渡）·batch-offset-misalignment 家族教训（改 .cmd 前置三清·候批 1 窗）

—— SDE 小布（m-sde·WO-RW1 件②毕+件④只读勘毕·批 1 候 fsd 码面信号+批 2③候批 1 窗）·写前现查 2026-11-20T02:31:58Z（+8=2026-11-20 10:31:58·date 现查原值·D-47 正形）

# TriMLC 8713 错位 daemon 考古实锚卷（10-06，b14 窗前置采集）

- 执行: m-sde（SDE 小布）；令源=CTO 根治包接令（10:12）+考古扩围（10:20）
- 时点: 实锚现采 2026-10-06 10:0x-10:2x+08（各条 date 现查）
- 关联卷: hub-silent-detect-revival-readout-20261006.md（复活主线）；本卷=错位形成因考古+根治供料

## 一、错位形对照表（四 daemon 实证）

| pid | 起 | 死 | pidfile | store 视图 | 身份/会话 | 拉起链 |
| --- | --- | --- | --- | --- | --- | --- |
| 13756 | 10-04 03:07:55 | 10-05 ~17:43-47 | ✅写(jedih/.trimetaverse) | 7 jobs 正常 | jedih 会话 | watchdog revive（jedih/Interactive） |
| 23980 | 10-05 17:47-17:50 窗 | 10-05 19:50 重启 | ❌零写 | store-blind（17:47 后正 store 零写入） | 未锚 | **未破案**（见 §四） |
| 20140 | 10-05 19:51:43 | 10-06 10:04（我方正途退） | ❌零写 | GET[]+POST param4 绑定错 | Session 0+异 token（signal0 EPERM+Stop-Process 拒绝实锚） | **未破案**（见 §四） |
| 31800 | 10-06 10:05:19 | 在役 | ✅写 | 7 jobs 正常 | jedih 会话 | 我 Start-Process cmd /c channel.cmd |

错位形共同签名：**healthz 绿+pidfile 零写+store-blind**——「假活」三件套，watchdog 与 L1 全部被骗。

## 二、时间线（事件级实锚）

| 时刻(+08) | 事件 | 锚 |
| --- | --- | --- |
| 10-05 17:42:21 | l2-stub clear-flag 自愈（liveness recovered）——13756 时代最后正常尾 | trimodel-l2-stub.log |
| 10-05 17:43-17:47 | **13756 死亡窗**（死因未锚，channel.log 戛止 17:47） | watchdog.log 17:47:05 DOWN |
| 10-05 17:47:05 | TriMLC-Watchdog 判 DOWN→revive（cmd /c channel.cmd） | watchdog.log+ps1 源码 |
| 10-05 17:47-17:50 | **23980 顶 port（错位形 #1，无重启窗！）** | CTO L1 实锚 09:50:02Z listener=23980 |
| 10-05 17:52:03 | watchdog 探 healthz 绿（23980 服务）→**误判 recovered**（无自验盲区坐实） | watchdog.log |
| 10-05 19:49:26 | **Windows 更新计划内重启**（MoNotificationUx.exe 代表 jedih，「Service Pack (计划内)」0x80020010） | System Event 1074 |
| 10-05 19:50 | 全进程灭；8711（TriRLC 16500）重启并写 pidfile（正形态） | trilc-8711.pid mtime |
| 10-05 19:51:43 | **20140 起（错位形 #2，Session 0）** | Win32_Process CreationDate |
| 10-06 09:59 | BOD 派工复活；store 判定 7 jobs 全在（表名勘正 cron_jobs） | 本窗读数卷 |
| 10-06 10:04 | 带 X-Internal-Token POST /shutdown→20140 优雅退（trilc stop 假成功勘验后正途） | 复活卷 §二 |
| 10-06 10:05:19 | 31800 正形冷启（jedih 会话），jobs=7，pidfile 自注册恢复 | 复活卷 §三 |

## 三、已实锚缺陷清单（修复供料）

1. **stop 假成功双缺陷**（TriMLC src）：①`isProcessAlive`（pidfile.ts）`process.kill(pid,0)` catch-all 吞 EPERM→提权/异 token 进程误判死；②`gracefulShutdown`（cli.ts L380）不校验 HTTP 状态码（401 也算成功）。叠加效果：对错位形 stop 输出成功实则未停。
2. **watchdog 判活盲区**（trimlc-watchdog.ps1）：仅 healthz 200 即判活——无 pidfile 对验、无 store 活性校验。20140 假活 16h 未纠；23980 假活 2h 未纠。
3. **watchdog revive 无自验**：spawn 完即退，不验拉起产物身份（pidfile 写入+store 视图），可被顶 port 者骗成 recovered（17:52 误判实证）。
4. **l2-scan execution 链断裂**（cronEngine，daemon 级新缺陷）：10:05 补跑轮 triggered（channel.log L56603）后完成路径丢失——execution_log 无本轮记录（末条冻 10-05 17:42）、无 l2-stub powershell 子进程（15588 系自捕假阳性已排除）、state=running 卡死、引擎互斥永不重触发。execution_log 写入对他 job 正常（hub-silent/tree-node-patrol 本 boot 全在写）→非 schema 面。嫌疑：boot 补跑洪峰竞态/spawn error 事件未处理。业务影响≈零（flag 不存在秒退态），引擎缺陷普适风险=任何 command 型 job 撞上即永停。**与 TriMMC「调度活执行停」家族不同签名**（彼=nextRun 滚动+零日志+自愈；此=nextRun 冻结+不自愈）——TriMLC 特有新形态。
5. **channel.cmd env 未 pin 项**：TRILC_DATA_DIR 值面含 `%LOCALAPPDATA%` 展开（`set TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel`）+USERPROFILE/LOCALAPPDATA 不在 pin 清单（PATH/SystemRoot/SystemDrive/TEMP/TMP 已 pin）——异常 env 上下文拉起时 store 落点随 env 漂移=错位形 store-blind 的机制候选（落点未实证，见 §四.3）。

## 四、拉起者侦查（20140/23980）——排查终局与剩余候选

**已排空**（全量实证）：
- 计划任务全表：TriMLC/TriRLC/TriHub/Seat-Watchdog 全 jedih/Interactive；非 Interactive 全量=Microsoft 硬件族+OneDrive 系统件，零 TriMLC 面
- Windows 服务：Win32_Service PathName 匹配 TriMLC/TriRLC/trilc/node=零命中
- Startup 链：seat-boot.vbs→ops-seat-watchdog.ps1（只拉 wt.exe 席位会话）；TriHubWatchdog→hub-watchdog.py（纯监控裁决器，不拉 daemon）——两链均排除
- ServiceProfiles：NetworkService/LocalService 的 trilc-channel/.trimetaverse=Test-Path 干净 False
- TaskScheduler 操作日志：在役但零记录（不可用）

**剩余候选**：
1. 运行后自删的一次性任务（DeleteExpiredTaskAfterUse，无痕不可查）
2. Session 0/EPERM 读数复核（提权工具面）
3. **systemprofile store 落点提权验证**：`C:\Windows\System32\config\systemprofile\AppData\Local\trilc-channel` 与 `.trimetaverse` Test-Path=**Access denied（≠不存在，非提权不可判）**——若存在且 mtime 19:51+，则「SYSTEM 上下文跑 channel.cmd（%LOCALAPPDATA%=systemprofile）」实锤，20140 store 落点+错位机制一并破案
4. 23980 窗（17:47-17:50）：TriMLC-Watchdog revive（jedih）拉起失败/慢 vs 另一拉起者顶 port 的**竞争假设**——jedih Interactive 上下文 %LOCALAPPDATA% 正常则其产物应正形（13756/31800 先例），故 23980 高嫌疑=非 watchdog 产物；该窗登录态/竞争时序候 L1 日志与系统日志深挖

## 五、今晚 b14 窗工作包清单（契约：考古毕→方案报核→核毕施工）

1. 提权验证 systemprofile store 落点（§四.3，破案钥匙最后一块）
2. cronEngine 完成路径源码读（缺陷 4 定位）
3. 修复方案一页报 CTO 核（另文件：trimlc-8713-fix-proposal-1p-20261006.md 草稿已备）
4. l2-scan 解卡（随窗重启 daemon 清 running 态，一并施工）
5. 8711/TriRLC 拉起链同族盘点（已初盘：16500 正形态；TriRLC-Watchdog Principal=jedih/Interactive 同族——同险评估随卷）

## 六、使用依据

- CTO 根治包令（10:12）+扩围令（10:20）；BOD 复活令（09:3x）+认收（10:2x）
- 实勘源：trimlc-watchdog.ps1 全文、trimlc-daemon-channel.cmd 全文（token 掩码）、TriMLC src（pidfile.ts/cli.ts/app.ts）、cron.db/execution_log（node:sqlite readOnly）、channel.log、watchdog.log、trimodel-l2-stub.ps1+log、计划任务全表（Get-ScheduledTask Principal/LogonType）、Win32_Service、System Event 1074
- 纪律：键值掩码（token 零回显）；时刻现查；拓扑断言活体实证禁推定（Session 0/EPERM 双工具交叉锚）

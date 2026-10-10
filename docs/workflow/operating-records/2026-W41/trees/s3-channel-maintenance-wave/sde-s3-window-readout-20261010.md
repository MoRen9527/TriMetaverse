# SDE 施工毕报 · S3 通道维护波窗（2026-10-10）

- sourceOfTruth: 本卷（trees/s3-channel-maintenance-wave/sde-s3-window-readout-20261010.md）
- syncMode: static（施工毕报·终卷；实测读数全录，候 STE 锚对表→CTO 技术收口）
- lastSyncedAt: 2026-10-10T14:31:08+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；窗令=s3-window-order-20261010.md（BOD 12:18 认账生效）；判据真源=cto-s3-criteria-20261008.md @5e9110b4；对表形=ste-s3-anchor-checklist-20261010.md
- 窗框: 14:00-16:30｜段1 硬绿门 ≤15:15 ✓（~14:05 毕）｜段2 ≤16:15 ✓（14:31 施工毕）｜收口 ≤16:30 候毕报链
- 施工对象: TriRLC 8711（本机 dev·R 面本地域 daemon）

## 一、段1 硬绿门（全绿·~14:05 达成）

| 门 | 读数 |
| --- | --- |
| 修法编码 | 法 B：`src/cron/store.ts` addJob INSERT 后复用 updateJob schedule 分支同路 recompute（parseCronSchedule→nextRunMs→ISO/null），try/catch 坏 schedule 保持 NULL 走 boot sweep/PATCH 恢复。零新增 import（parseCronSchedule 文件头已有） |
| 新增边界单测 | test/cron-addjob-nextrun.test.ts **7/7 绿**（every 档/cron expr 档/disabled 补值/内存读回面/冷重开持久化/sqlite 值面直读防伪绿/坏 schedule NULL/PATCH 同值幂等） |
| 全量回归 | **707/707 pass，0 fail，零新增 fail**（施工前基线 700 pass 0 fail 先行对照跑留痕） |
| 59 例 P0 守护套件 | 单族复跑 **59/59 绿**——构成实勘=auth-gate-rejection.test.ts 41 例（token 门）+cron-mcp-entry-guard.test.ts 18 例（cron 白名单双入口）；判据卷未列构成，本席实勘定谳并录此 |
| check/build | 0 错 |

## 二、段2 施工序（时序如实录·含改道）

1. **可选加固**（C3 观测锚依赖）：app.ts listening 行后加 `console.log([trilc] data dir: ...)` 启动单行。
2. **备份锚先行**：trilc\+trirlc\ 两侧 cron store 族四件 → `%LOCALAPPDATA%\trilc\backup-s3-datadir-20261010T060633Z\`。
3. **优雅停旧进程**：stop 前监听 pid==pidfile pid 验讫（33280）→ 带 token POST /shutdown → 200 ok，pid 33280 gone，端口释放断言过。（勘注：cli.ts gracefulShutdown 裸 POST 不带 token 必 401→SIGTERM 兜底缺陷在案，本窗手工带 token 走正形。）
4. **C1 口径修正·新建链改道如实录**：本席按判据卷先新建了一条启动链（TRILC_DATA_DIR 显式+node 全路径）并冷启（pid 30296）；随后勘得 **既有正形链** `%LOCALAPPDATA%\trirlc\daemon\trirlc-daemon.ps1`（Sep 30 建）已显式 `TRILC_DATA_DIR=trirlc\` 一处+TRILC_ENV_FILE secrets 加载+TRIMC_BASE_URL+watchdog revive 目标——我链缺 ENV_FILE 面=拉起形不完整，按红线「宁可不拉不可拉错」：停 30296（200 ok）+删除新建链（git 未 commit 零残留）+经正形链重冷启。判据时（10-08 盘点）勘漏此链系盘点只看 trirlc\ 顶层未下探 daemon\ 子目录——如实注记。
5. **正形链冷启**：pid=**32492**，daemon.log 三行实锚：`[trilc] data dir: C:\Users\jedih\AppData\Local\trirlc`（C3）+`[trilc:cron] engine started with 0 jobs`（C4）+`ready`。
6. **A 区活体验收四步**（见 §三）。
7. **探针 job DELETE 清理**：A1 探针 job 删除 200，cron_jobs 空集+jobCount=0 基线复位，零残留。
8. **B 区探针四连+B5**（见 §四）+8711 存活复核 healthz 200。

## 三、A 区 · 缺口1 活体验收（四步全过）

| # | 实测读数 | 判 |
| --- | --- | --- |
| A1 | POST 新建 job（systemPrompt 形·every 2min）→ **201**，job id=`cron_mv20azzf_fo3n`（响应壳层 `{"ok":true,"job":{...}}`，id 在 job 内） | ✓ |
| A2 | sqlite 只读（node:sqlite readOnly）查 cron_jobs.next_run_at=**2026-10-10T06:24Z 非空** | ✓ |
| A3 | 双形触发实证：①next_run_at 06:22Z→06:24Z 滚动旁证 ②execution_log 增行 **id=448，status=ok，started_at=2026-10-10T06:22:00.010Z，duration_ms=3797** 正面实证（满足「禁 nextRunAt 滚动单独代触发」纪律——两形都有） | ✓ |
| A4 | PATCH `{schedule}` 同值 → 200，next_run_at **保持非空且重排**（幂等） | ✓ |

## 四、B 区 · 探针对表（四连全 401·零升级项）

| # | 探针 | 实测 | 判 |
| --- | --- | --- | --- |
| B1 | 8711 无 token POST /shutdown | **401** | 门在岗 ✓ |
| B2 | 8711 错 token POST /shutdown | **401** | ✓（真 token 停机探针按红线未发，挂下次正规服务重启窗） |
| B3 | 8713 错 token 同款 | **401** | ✓ |
| B4 | R-HY 8710（窗前一刻活体裁定=新位在役·healthz 200 jobCount=3，13:5x 现探）无 token GET /internal/v1/cron/jobs | **401** | 门形勘定闭环，非残面缺口 ✓ |
| B5 | sg loopback | 本机不可达，如实注记不判 | — |

- B 区判读总则核对：无任一 200 → 零升级项。

## 五、C 区 · DATA_DIR 归一六锚

| # | 实测 | 判 |
| --- | --- | --- |
| C1 | 显式 TRILC_DATA_DIR 恰一处=既有正形链 trirlc-daemon.ps1 L11（方向 A 归一**早在位非新 diff**）；改前备份锚在位（§二.2） | ✓（口径修正如实录） |
| C2 | 正形链冷启 healthz 绿；权威路径（token /shutdown 优雅停+ps1 冷启）；stop 前 pid 验有录 | ✓ |
| C3 | daemon.log 启动行 store 路径单一=trirlc\cron.db；trilc\ 侧 cron.db/-wal/-shm mtime 停滚（旧侧最新 10-07 16:55） | ✓ |
| C4 | jobCount=0+engine 0 jobs，空集基线保持，degraded=false | ✓ |
| C5 | **明确不做删除**：trilc\ 侧 cron store 四件原位保留（非清删）+另建备份目录——两态合规取「保留」态，如实录 | ✓（合规） |
| C6 | .env/keys.json 零接触（trilc-channel\keys.json.s3-backup 等含密遗产全程未动） | ✓ |

## 六、D 区 · 并窗分线勘验（单独记录·零处置）

**分线① PENDING-RESEND 投递通道（本机 14:30 现势）**：
- l1.log（%LOCALAPPDATA%\tri-liveness\l1.log）1645 行，mtime=2026-10-10 14:30:09+08 现役滚动。
- PENDING-RESEND fail (kept) **累计 571 笔，现役未自愈**：最新两笔=2026-10-10T03:40:03Z / 03:45:02Z（本地 11:40/11:45），5min 节奏持续。
- 末笔 ALERT-SENT 200 停在 **2026-10-07T09:05:01Z**——与 STE 锚卷 §七.5 时序注**逐字对平**；此后 fail 连续滚 3 天。
- 告警体：[L1/dev-win] trimlc liveness issues x1（korw job cron_muh6shv0 state=last-run-stale 快照滞留重发队列）。
- 归因候选（承 STE 卷 L142 注）：通道目标侧问题（首 fail 早于 8713 手术 build 锚 42s）——本席零处置，读数归 CTO。

**分线② sg TriMMC POST 403 共享通道（本机侧可勘面）**：
- 本机 trirlc-daemon.env TRIMC_INTERNAL_TOKEN 值面指纹：**len=64，tail4=`e075`**（sha8=d50a0760）。
- 对表 STE 锚卷（cto-final-acceptance §三.2）sg 面 token：len=64，tail4=**`4aa5`**。
- **两机 token 非同值**——共享通道 token 分发面漂移读数实锚；与本窗 mc_link degraded 读数（本机带 token 打 R-HY 8710 仍 401）同族互证。403 GET-POST 分叉本体在 sg 面不可本机勘——零处置归 CTO。

## 七、mc_link degraded 定性注记（既有非引入）

- 现象：8711 冷启后 mc_link=degraded。
- 考古铁证：`%LOCALAPPDATA%\trilc\connection-state.json`（旧进程遗留）`state: degraded, lastStateChange: 2026-10-06T11:04:13.765Z`——**degraded 早在本窗 4 天前已在**，非本窗引入。
- 勘因：postHeartbeat 带本机 envfile TRIMC_INTERNAL_TOKEN（len=64 sha8=d50a0760）POST R-HY 8710 heartbeat 仍 401=R-HY 不认本机侧 token。
- 归类：**R 面 token 分发漂移族**（与分线②、R-HY 401 pull_denied 挂账同根）——非本窗 scope，零施工修复，归 CTO 面。

## 八、E 区红线六条勾验（全清）

- [x] 窗内禁对 token /shutdown 真停探针——B1/B2 全无/错 token 形，真 token 真停挂下次正规服务重启窗
- [x] token 值面零回显——全程 len/sha8/tail4 掩形，本卷同守
- [x] 8711 重启走权威路径——token POST /shutdown 优雅停+正形 ps1 链冷启；stop 前监听 pid==pidfile pid 验讫有录；零裸杀零 taskkill
- [x] 备份锚先行——两侧 cron store 四件 @backup-s3-datadir-20261010T060633Z
- [x] 范围不爬升——sg TriMMC 8710 迁移评估零触碰；#3/#4 零施工；mc degraded 只勘不修；含密遗产零接触
- [x] 超锚即报——段1/段2 均提前达成（~14:05/14:31），零拖窗

## 九、SDE 判定自评建议（判定权归 STE/CTO）

- 主体：段1 全绿+A 区四步全过+B 区四连全 401+C 区 C1-C4/C6 全过+红线全清 → 按 STE 三分法映射落 **PASS 域候选**。
- 非阻塞项逐列（候 STE/CTO 采信）：①C1 系「既有正形链已在位」非新 diff（口径修正已录，附新建链改道过程如实注）②C5 取「保留不清删」态（合规两态之一）③mc degraded 与 D 区两分线=既有/异源面，不并入四缺口判定，归因归 CTO。

## 十、使用依据

- 窗令 s3-window-order-20261010.md（@dfe539a6 注记版）｜判据卷 cto-s3-criteria-20261008.md @5e9110b4
- STE 锚对表 ste-s3-anchor-checklist-20261010.md（A/B/C/D/E 区对表形）
- 分线锚卷：ste-8713-fix-window-regression-20261006.md §七.5（cron-liveness-alert-20261005 树内）+cto-final-acceptance-20261008.md §三.2
- 代码面：TriRLC src/cron/store.ts（法 B diff 在案）/test/cron-addjob-nextrun.test.ts（7 用例）/src/server/app.ts（观测行）
- 活体证据：daemon.log（trirlc\daemon\）/trirlc\cron.db（sqlite 只读）/tri-liveness\l1.log/trilc\connection-state.json（考古）
- 记忆条：trimc-mlc-addjob-divergence（A3 两形纪律）/trilc-daemon-restart-discipline（pid 验+权威路径）/trilc-cron-command-allowlist-exact-match（A1 走 systemPrompt 形）

——SDE 小布，毕报毕。毕报链：本卷 → STE 锚对表 → CTO 技术收口 → COO 督办收口。

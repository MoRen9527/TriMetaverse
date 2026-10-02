# FSD·维护批③④预勘卷（10-03 连夜窗·COO 03:3x 开工令）

- sourceOfTruth: 本件（维护批③④预勘正身；令源=COO 03:3x 连夜窗开工令，令源链=BOD #292 终验 PASS 03:29）
- syncMode: static（预勘三面毕：③同键异值证伪翻转+复测形定稿；④缺陷定性+一行修方案）
- lastSyncedAt: 2026-10-03T03:44+08:00（date 现查）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）

## 一、③车道预勘：8711「同键异值面」实勘证伪翻转

### 预勘链（六步实锚）

1. 8711 监听 pid=45040（09-30 04:01:04 起，cmdline=`node D:\Code\ai\TriRLC\dist\index.js`，父进程已退=schtasks 链）。
2. 启动链：`TriRLC Daemon` schtasks→`trirlc-daemon.cmd`（shim 5 行）→`trirlc-daemon.ps1`（三 pin：TRILC_DATA_DIR/TRIMC_BASE_URL=http://8.155.54.79:8710/TRILC_ENV_FILE）→`trirlc-daemon.env`（9 键，daemon 经 TRILC_ENV_FILE 自加载）。
3. **TRIMODEL_API_TOKEN 异值面证伪**：trirlc-daemon.env 持 a5cb..13a7（=修复窗 8713 清掉的旧值）——但 8711 消费方实勘=**本机 TriModel 3333**（ps1+env 零 TRILC_TRIMODEL_API_URL 注入→env.ts L165 默认 127.0.0.1:3333；本机 3333 活监听 pid 42616=`D:\Code\ai\TriModel` dist server，9-29 04:53 BOD 面起）。本机 TriModel `.env` 门令=**a5cb..13a7 同值**→**两端配对正确，零漂移**。活体验证：daemon.log `[trilc:keys] model relay refresh (card absent)` 持续出现（log mtime 03:34:26 活跃）。
4. **结论：同值两消费方，一配一对一漂**——8713 channel.cmd 的 a5cb 消费方=河源门面（3608..cee7）→漂移已修（修复窗）；8711 trirlc-daemon.env 的 a5cb 消费方=本机 3333 门（同值）→**配对正确，零修**。**若盲修成 3608 会当场打断 8711 keys fetch（3608≠本机 3333 门令→pull_denied）=制造新故障**。COO 令文「对齐方向以你卷勘验为准（权威面零改）」→勘验结论=8711 配置面零修，权威面零改成立。
5. **TRIMC 族异值证伪**：trirlc-daemon.env TRIMC_INTERNAL_TOKEN/TRIMC_NOTIFY_SG_TOKEN=d2cd..e075（≠channel.cmd 4842..4aa5）——但消费方拓扑实勘：TRIMC_BASE_URL=**河源 8710**（trirmc-mc，8711 活连接 ESTABLISHED 8.155.54.79:8710 唯一外联），河源 trirmc-mc unit 内联 `TRIRMC_INTERNAL_TOKEN=`**d2cd..e075 同值**（键名异 TRIMC/TRIRMC、值同）→**两端配对正确零漂移**。4842..4aa5 系 8713→sg TriMMC 链（sg unit 内联 4842 同值 ✓）。**两链各自配对，「10-02 工序 1' 漏网点」假设证伪**。
6. **③收敛=优雅停实弹复测单面**（COO 令文主体）：TriRLC 权威路径 `dist/cli.js stop --port 8711`（cli.ts L287 内建端口-pid 一致性门=pidfile 核验正形+L356 POST /shutdown+waitProcessExit 验证死；SIGTERM/SIGKILL fallback 非裸杀域）。

### ③复测形定稿（工序）

- 前置三断言：监听 pid==45040；进程活态+cmdline 对表；pidfile `~/.trimetaverse/trilc-8711.pid` 读数（PID_DIR=paths.ts L12 `~/.trimetaverse`，端口命名空间 trilc-8711.pid=09-18 CTO 裁修正形）。
- 优雅停：`node D:\Code\ai\TriRLC\dist\cli.js stop --port 8711`（内部链=verifyPortPidConsistency 门→POST /shutdown→验证死；门 token 面=8711 env 零 TRILC_INTERNAL_TOKEN 注入→gate fail-closed L1797 形态实证读数随卷）。
- 拉起：等 TriRLC-Watchdog schtasks 自然拉起（**5 分钟节奏实锚**：Next Run 03:46:00/Last 03:41:01，vbs→launch 链）；超时线=2 周期 10min；fallback 前置门=watchdog 状态确认（防双实例）。
- 生验锚：新 pid+8711 监听恢复+healthz+daemon.log keys fetch card absent 恢复（端到端=8711→本机 3333 keys 链）+pidfile 新读数==新监听 pid。

## 二、④车道预勘：updateJobRun 一行修定性

### 缺陷定位（TriMLC src/cron/store.ts）

- `updateJobRun`（L347-385）：UPDATE SQLite 后 refresh in-memory，**末尾缺 `saveCronStore()`**——对照 addJob（L258）/updateJob（L343）/removeJob（L269）三兄弟均收尾调用。
- `saveCronStore`（L188-199）=**JSON backup 面**（dbPath+".json"，tmp+rename 原子写）；`loadAll`（L169-183）**只读 SQLite**（loadCronStore JSON 读路径 src 内零调用，仅定义+导出）。
- **定性：备份一致性缺陷**（非调度实害）——SQLite 真值即时一致，.json 快照在 updateJobRun 路径（timer.ts L148/166/198/208/351/368/382/389/397 九调用点=每次 job 运行前后）不刷新→备份面随运行漂移陈旧。危害场景=cron.db 损坏时 .json 恢复丢最近运行态/外部工具读 .json 观测面见陈旧态。
- **一行修**：L384 `if (idx >= 0) jobs[idx] = rowToJob(row);` 后补 `saveCronStore();` 一行。
- cron state 卫生照会遵守：本修只增 backup 刷新，**零触碰 nextRunAtMs/next_run_at 语义**（COALESCE 保旧逻辑零动）；job state 手改禁抹 nextRunAtMs 纪律无交互。
- F-3 上下文实锚：F-3 Part A（INSERT 补 next_run_at，L228-247）+Part B（a66b3b2 self-heal）**均已入仓**；本④系独立缺陷非 F-3 残留。生效形态照 F-3 Part B 先例=**代码修入仓候 8713 冷起窗带出**（COO 03:3x 边界申明准裁：本窗不含 8713 生效重启）。
- TriMLC git 面：HEAD=a66b3b2，工作树仅 `?? scripts/digest-inbox.mjs`（untracked 非本窗对象勿触）→④diff 面干净。

## 三、额外发现（非本车道，列候升）

1. **deepseek-v4-flash 上游 401 族**（daemon.log 持续）：`[trimodel] deepseek-v4-flash failed (depth=2, reason: DeepSeek API error 401 ... key: ****c2e4 is invalid)`——8711 链上 deepseek 上游 key invalid（尾 c2e4≠trirlc-daemon.env DEEPSEEK_API_KEY 尾 6863，疑门面/转发链侧旧值）。与 b 项 GLM_API_KEY 双机缺件同族（上游 key 配置面族），候升 CFO/CEO 面。
2. keys.json/config-cache.json s3-backup 序列（8-15 起 13 件）——TriRLC key storage S2/S3 回滚备份堆积，候清理策略窗（非急）。

## 四、使用依据

- COO 03:3x 维护批③④连夜窗开工令+03:3x 边界申明准裁（④不含 8713 生效重启）
- 实勘：trirlc-daemon.{cmd,ps1,env} 键面/本机 3333 pid 42616 链/TriModel .env 指纹/河源 trirmc-mc unit+活体指纹/sg trimc unit+活体指纹/daemon.log card absent+401 族/8711 活连接 netstat/TriRLC paths.ts+pidfile.ts+cli.ts+app.ts gate+shutdown 段/schtasks TriRLC-Watchdog 全字段/TriMLC store.ts 全段+git 状态
- 关联纪律：trilc stop/start 权威路径（禁裸杀/pidfile 验对 09-18 CTO 裁修）；cron job state 卫生；值面零出机（指纹形）

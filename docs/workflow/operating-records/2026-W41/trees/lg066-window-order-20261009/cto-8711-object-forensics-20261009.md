# CTO 8711 对象定性三勘卷 · 本机 TriRLC 正身/河源伴生件/10-01 波次交叉（BOD 11:30 勘正令）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-8711-object-forensics-20261009.md）
- syncMode: final（三勘毕·候裁呈报）
- lastSyncedAt: 2026-10-09T11:35:40+08:00（date 现查原值）
- 令源: BOD 11:30 紧急勘正（CEO 11:27 勘定·三点令：稿撤资已办/河源伴生件定性/波次交叉勘清+困难点两问）
- 勘误自认: 本席 11:01-11:20 复活稿链=对象错位（「河源 TriRLC 8711」件③框架+形似证据强化+稿面自书「8711=本地域」矛盾未起疑）——教训条 object-assertion-before-confirm 实证二犯，随卷记

## 勘一 · 本机 TriRLC 8711 正身（活着·无复活需求·BOD 11:29 读数全数复核吻合）

| # | 面 | 读数 |
| --- | --- | --- |
| 1 | healthz 全值面 | ok=true·service=trilc·uptime 232003s≈64.4h（10-06 19:04:12 起）·**mc_link=degraded（mc_peer=trirmc=在案 R-HY 401 件活体现形）**·trimc=degraded·cron jobCount=0·heartbeat agentCount=1·sessionReaper enabled·daemon.mode=schtasks |
| 2 | 进程 | PID 33280·node.exe·**CommandLine=`node dist\index.js`（相对路径）**·起 2026-10-06 19:04:12·父进程 31068 已消失 |
| 3 | schtasks 双任务 | 「TriRLC Daemon」（LogonTrigger·jedih·LastResult 0·要运行=trirlc-daemon.cmd）+「TriRLC-Watchdog」（每分钟·vbs 包装·LastResult 0）——双任务 Ready 与 BOD 读数同 |
| 4 | watchdog.log | **10-06 零记录**（10-05 17:46 与 10-08 10:32 各一次 DOWN→revive→recovered）——19:04 起跑非 watchdog revive |
| 5 | jobs API 值面 | `{"ok":true,"jobs":[],"count":0}`——**store 真空实锚**（cron.db 主库 mtime 09-28 零变更·wal 10-07 残写非 job 写） |

### 困难点两问答

- **谁在 10-06 19:04 拉起**：**人工 `node dist\index.js` 直起**（CommandLine 相对路径形≠trirlc-daemon.ps1 链产物——ps1 用绝对路径 `D:\Code\ai\TriRLC\dist\cli.js start`·Set-Location 形；schtasks 链与 watchdog 均排除：任务上次运行显示 9:04:45 与进程不同刻+watchdog 当天零 DOWN）。旁证窗：8713 watchdog 10-06 18:43-18:44 两次 DOWN+**logon-guard fail-closed「no jedih session probeable」**→18:44:25 recovered——10-06 傍晚 jedih 会话经历不可探窗（重登/解锁事件），19:04:12 起跑落在会话恢复后 20 分钟窗。直证缺（父进程消失·无启动日志），定性=**会话事件窗内人工直起，非任务链非 watchdog**。
- **为何 cron jobCount=0**：**该 daemon 在本机的角色本就空载 cron**——8711 TriRLC 承载 heartbeat（agentCount=1）/sessionReaper/agent 任务面，cron job 面从未承载常驻 job（store 09-28 后零 job 写入）。10-04 夜周平面迁移 job 9c81c7ec=河源 TriRMC 侧 job，非本机 8711。非故障，如实报（若产品面需要本机 8711 承载 job=另立裁量，技术面零阻塞）。

### 结构观察项（如实列·候办非本卷处置）

- 目录分裂现役：启动器 %LOCALAPPDATA%\\trirlc\\（新名）vs store %LOCALAPPDATA%\\trilc\\（旧名）——cmd-batch-crlf 记忆条「分裂风险」实锚在案，对齐候办。
- 「TriRLC Daemon」schtasks=LogonTrigger 交互式（同 8713 console 生命周期族风险）——watchdog 现役兜底有效；根因级结构修（S4U 形）随 8713 结构修窗后评估并族。

## 勘二 · 河源 trilc-headless 定性（只勘不修·候裁呈报）

| 勘面 | 读数 | 判读 |
| --- | --- | --- |
| unit 定义 | Description=**TriRLC Headless Execution Node (R-side autonomy rmc-autonomy-001)**·After=trirmc.service·User=fleet·EnvironmentFile=/srv/fleet/TriLC/.env（含 TRIMC_BASE_URL/TRIMC_INTERNAL_TOKEN=配 TriRMC 面）·ExecStart=node dist/cli.js run --port 8711 | **服务域伴生件（TriRMC autonomy 链配套）非历史误装**——rmc-autonomy-001 编号直指 TriRMC 自主性实验配套 |
| journal 停机前行为 | heartbeat/reaper/cron 引擎连续+trimodel 调用（tmv-deepseek fallback 链）——headless agent 任务实跑形 | 不是空载误装，是真跑过 autonomy 任务的执行节点 |
| 启动源/版本 | 独立部署 /srv/fleet/TriLC（fleet 仓·git 顶 ff2f970 roster-gating 期）·dist 08-27·store=\\var\\lib\\trilc-headless（company/daemon/cron.db/event-queue.db 存档完整） | 独立实例非本机 8711 的部署副本 |

**归宿候裁三选**（技术面供事实·裁量归 BOD/BusinessStrategy 边界面）：①**恢复**（enable+start·TriRMC autonomy 面若仍需 headless 执行节点）②**正式退役**（保持 disabled+归档注记·autonomy 001 若已被 TriRMC 内建能力取代）③**迁移重构**（并入 TriRMC 面）。判据关键=TriRMC 现役有无 autonomy-001 消费需求——候 TriRMC owner 面确认后裁。窗位不急（disabled 态稳定·非占用资源）。

**与本机 TriRLC 命名关系**：「R 面**本地域** daemon」语义=本机 dev 侧（河源对端的本地控制面）；河源 trilc-headless=河源**服务域**伴生件。两实例同名同源（TriRLC 仓）不同机不同角色——「本地域」三字歧义=本次对象错位的根因地基，命名正名候办（trilc-headless 河源件可正名 trirlc-headless-sg 域不适用·候 CAO/命名义裁）。

## 勘三 · 10-01 波次与本机 TriRLC 交叉勘清

- 10-01 10:42:07 SIGTERM+disable=**纯河源侧操作**（河源 journal unit 级实锚）——与本机 TriRLC **零交叉**：本机 watchdog.log 10-01 无记录·本机进程史 10-06 起跳（10-06 前本机 8711 进程形态候考但与 10-01 波次无关联链）。
- 本机 TriRLC-Watchdog 10-05/10-08 两次 DOWN→revive=本机自有保活循环，与河源 10-01 波次无关。
- 「10-01 人工波次」影响域收敛=河源 trirmc+trilc-headless 两 unit（trirmc 已于 10-04 补跑恢复·trilc-headless 漏网至今=候裁面）。

## 勘误自认与教训（二犯实录）

对象错位三步链：①件③「河源 TriRLC 8711 死」框架本身含错（8711 正身在本机）→②本席 11:01 河源实勘发现形似件（unit 名含 trilc·端口配 8711）未做正身位断言即认领→③复活稿 §五 自书「8711=本地域（TriRLC）」与「河源复活对象」矛盾同页共存未起疑。BOD 认账链同盲（两席四眼未拦）·CEO 勘正兜住。教训条 object-assertion-before-confirm 增补第④问：**「正身现在哪台机上活着」活体断言先于历史考古**——考古发现的形似件不等于令文对象；矛盾证据（本地域字样 vs 河源对象）同页出现即停。

## 使用依据

- 本机活体现探 11:30-11:34：healthz/jobs API（token 经 trirlc-daemon.env 直取零回显）/schtasks 双任务详情/watchdog.log 双份（trirlc-watchdog+trilc-channel）/进程 pid+CommandLine+父链/trirlc-daemon.ps1+cmd/connection-state.json/cron.db mtime 面
- 河源实勘 11:01-11:05（前稿考古读数·归属判读随本卷勘正）：unit 定义/journalctl 15 行/.env 键名/store 目录面/git 顶
- BOD 11:30 勘正令+11:29 活体实勘读数；CEO 11:27 勘定
- 记忆条：dual-controller-ports-m-mlc-r-rlc（8711=R面**本地域**=本机——既有真源，本席失对表=根因）·trirlc 相关分裂/保活条

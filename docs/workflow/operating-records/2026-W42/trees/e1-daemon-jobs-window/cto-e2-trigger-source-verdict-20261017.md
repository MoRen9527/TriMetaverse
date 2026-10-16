# CTO 勘验卷 · E2 案② 触发源定性——VS Code 侧批量 spawn 49+ runner（python 泄漏案）· 2026-10-17

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/cto-e2-trigger-source-verdict-20261017.md）
- syncMode: static（勘验读数卷·零施工·毕报走 CTO→COO→COS→BOD）
- lastSyncedAt: 2026-10-17T02:52:16+08:00（date 现查原值·写前跑·D-47 正形 A）
- 令源: CEO 02:36:49 三裁②「E2 案②先行·触发源定性→定点治·不动 IDE 配置」（COS 02:37:45 流转）·charter-2026-W42-005 E2 行（COO 02:40 授号·施工位=CTO 面技术勘验·定点治方案候裁不动手）
- 前案: FSD 勘验卷 fsd-liveness-verdict-20261013.md（8777922bd·W41 python-leak-cleanup 树·巡杀循环零收敛实锚）

## §〇 结论一句话

**「批量 spawn 49+ runner」的触发源=我司自装巡杀 `\BOD-BlackFormatterLeakPatrol`（30min 节律）与 black-formatter 扩展「runner 池永不回收」设计的乘积：巡杀每轮杀死 server 全员（今晚 02:38:01 rc=0 实锚）→ 扩展宿主崩溃自愈 2 秒内重启 server → 新 server INITIALIZE 时按多根工作区逐 folder 池化 spawn `lsp_runner.py`（Black Formatter.log 02:38:16-24 逐 workspace 目击）→ runner 在 stdin 上永不退出、池条目到 server 死才回收 → 54 进程 21 秒落位。巡杀是泄漏代际的节拍器（无巡杀则数量静态、仅随 VS Code 会话级事件一代）；扩展池化不回收是生成器；「不动 IDE 配置」约束下的定点治=P 案巡杀谓词收窄（只杀 runner 留 server），一行改动、机制面已核安全。**

## §一 触发源三层链

| 层 | 角色 | 实锚 |
| --- | --- | --- |
| 生成器（泄漏本体） | 扩展 runner 池设计：server 每代 INITIALIZE 逐 workspace 池化 spawn runner·runner 服务完不退出·池条目 server 死才回收 | 源码三证（§二）·28 池条目算术自洽（§三） |
| 节拍器（代际节奏） | 我司 schtasks 巡杀 `\BOD-BlackFormatterLeakPatrol`：30min 杀 black-formatter 签名全部（server+runner 无差别）→ client 崩溃自愈重启 server → 新一代全量重建 | LastRun=**2026-10-17 02:38:01 rc=0** Next=03:08·动作=`wscript.exe …\python-leak-cleanup-20261009\patrol-launcher.vbs` |
| 今夜实锚（爆发窗口） | 巡杀 02:38:01 → server shim 02:38:03 重生 → 真身 02:38:04 → INITIALIZE 版本探测 02:38:05-24 → 54 进程 21 秒落位 | 进程直方图单桶 `02:38 x54`+Black Formatter.log 逐 workspace `black --version` 读数 |

触发源归属一句话：**外部节拍=巡杀兜底自身**（我司资产·非 IDE 事件·非 daemon 巡检链——8713 execution_log 02:31-02:48 窗 14 job 全 ok 零涉 python 面，排除法在案）；**内部生成器=扩展池化不回收**（ms-python.black-formatter-2026.6.0 捆绑件设计行为）。

## §二 机制源码三证（扩展捆绑件直读·2026.6.0）

1. **server 侧逐 workspace 版本探测**（`bundled/tool/lsp_server.py`）：INITIALIZE handler 调 `_update_workspace_settings_with_version_info`（L316-366）——对每个 workspace setting 跑 `_run_tool(["--version"])`（L323）；工作区解释器≠server 解释器时走 `jsonrpc.run_over_json_rpc`（L574/L657）=每 workspace 池 spawn 一个 runner。
2. **runner 永不主动退出**（`bundled/tool/lsp_runner.py` L41-45）：`RPC = JsonRpc(sys.stdin.buffer, sys.stdout.buffer); run_message_loop(RPC, run_module, RunResult)`——runner 是常驻 JSON-RPC 微服务，服务完一条继续等下一条，退出 solely 依赖 stdin EOF（server 死）。
3. **池化永不回收+死亡自愈**（`bundled/libs/vscode_common_python_lsp/jsonrpc.py`）：`ProcessManager._processes: dict[workspace→Popen]` 按 workspace 池化（L110）·`get_or_start_json_rpc`（L218-232）复用或 spawn·**无逐调用回收路径**（stop 仅在 server 退出 atexit L204 与显式 stop_process）；`_monitor_process`（L182-196）监视线程对进程死亡（含外部击杀）自动清池条目关管道——下次调用重 spawn 新 runner（**P 案健壮性依据·无死条目复用风险**）。

## §三 定量对表

- **54 = 2（server 对：shim 41108+真身 38296）+ 52（runner：28 池条目 × 各 1-2 进程——24 条目经 uv shim 中介成对·4 条目直接解释器：C:\Python312×2+TriMetaverse\.venv+TriStaciss\.venv）**。
- 28 池条目 = window1 多根工作区 folder 数（Black Formatter.log 版本探测序列 TriDev/TriGateway/TriModel/TriSkill/TriTraining/claude-code-2.1.88/TriCode/TriRLC/TriMMC/TriMetaverse-worktrees 等逐个 0.7-2s·累计 ≈28）——解释器多样性与各 folder 所选解释器一一对应。
- 时间线：02:38:01 巡杀→02:38:03 server shim→02:38:04 真身→02:38:05-24 版本探测→02:38:24 全员落位；本席 02:43:44 首测 54·02:47 复测 54（稳定态）。与 10-16 案（16:08:01 巡杀→3-23 秒复批 54）完全同构。
- FSD「批量触发型非持续繁殖型」定性**维持且机理化**：批=单代 INITIALIZE 全量池化；两代之间数量严格恒定（runner 无退出路径·20min 零增长实锚即此）。
- 内存占压：~1.5GB WS 常驻（10-16 读数 1544MB·今晚同量级·单进程 48-52MB 均匀无膨胀）。

## §四 定点治方案（候裁不动手·charter 边界）

| 案 | 内容 | 定性 |
| --- | --- | --- |
| **P 案（推荐·巡杀谓词收窄）** | cleanup-blackformatter-leak.ps1 谓词 `CommandLine -match 'black-formatter'` 增补排除 `-and $_.CommandLine -notmatch 'lsp_server\.py'`（targets+remain 两处同步）——**只杀 runner 留 server**：server 永生→client 零感知零重生代；runner 被杀→monitor 清池→有格式化请求时按需重 spawn 单条目→被下轮巡杀收走 | 改动面=我司自装 schtasks 脚本一行×2 处（board worktree 执行位+主仓真源位同步）——**零 IDE 配置触碰**·巡杀任务在册不撤（BOD 定·符合）·**正切「定点治」** |
| Q 案（远期治本·候松绑） | 上游扩展缺陷/设计（池不回收）：升级扩展/换 ruff-format/禁用——均涉 IDE 面 | 候 CEO IDE 面松绑后另议（FSD 卷候裁①同源承接） |
| 维持案（=E2 案③） | 现状 54 常驻 1.5GB WS 永续——非增长型纯资源占压 | 零成本零风险基线 |

**P 案技术要点**：①生效形态=下轮 03:08 轮即按新谓词跑（schtasks 每轮新起进程现读脚本·零重启面）；②稳态预期=低活动期 resident≈2 进程 ~57MB（vs 现役 1.5GB），活动期上限=2+2×活跃 workspace 数且 ≤30min 收走；③风险面=杀 runner 撞在途格式化→单次请求失败 client 重试即愈（black 无状态）·monitor 竞态已核自愈；④观测门=改后两轮巡杀（03:08/03:38）读数断言——server pid 不变+runner 零滞留+WS 总量降幅兑现；⑤回滚=谓词还原一行+下轮生效。

**候裁点**：①P 案准否（若准·03:08 轮即生效·过点则 03:38 轮·零急迫差）；②P 案不准则维持案基线知情；③Q 案候 IDE 面松绑另议；④LG-069 10-14「杀 lsp_server 父+30min 零复批」窗结果核对（见 §五）。

## §五 前案候裁面机制判读对表

- **FSD 卷候裁③「巡杀改杀 lsp_server 父进程断繁殖根」＝机制证伪**：杀 server 或其父（扩展宿主 utility 8400）→ language client 崩溃自愈重启 → 新 INITIALIZE 全量重建 28 池——与巡杀现状同款零收敛（10-16「杀 54→77 秒复批 54」实锚即此机理）。「断繁殖根」断不了：繁殖根在 client 自愈语义+池化设计，不在某个进程。
- **LG-069 COO 窗计划（10-14 09:10-09:50「杀父+30min 零复批」）**：机制面预判=同款零收敛（杀 exthost→VS Code 重建扩展宿主→秒-分钟级重生代）。是否已施/实测读数本卷**不掌握不臆断**——若实测「零复批」成立则本席机制判读需勘修，候核对（宁缺勿造）。
- **FSD 卷候裁①（扩展升级/禁用/换 ruff-format）**＝本卷 Q 案承接——涉 IDE 面，候松绑。

## §六 观察注

- 其余 4 窗（10-13 同批起）exthost 无 black-formatter server 在册（无 py workspace 或 client 未激活/早亡——不臆断·观察注）；全部 runner 挂 window1 单 server 下。
- 巡杀脚本体（执行位原文已读）：谓词行+7 天日志轮转+回卷报告——P 案只动谓词·其余面不动。
- 8713 cron 14 job 与本次爆发零关联（02:31-02:48 execution_log 全 ok·bod-tick 02:37 轮 19.4s 探针性质）——**daemon 巡检链排除**，触发源不在我司 daemon 面。

## 使用依据

- 活体取证（02:43-02:52 本席现查）：Win32_Process python 全量+父链回溯+创建直方图（双时点 54/54 稳定）
- schtasks：`\BOD-BlackFormatterLeakPatrol` Get-ScheduledTask/Info（LastRun 02:38:01 rc=0·Next 03:08·动作指向 board worktree patrol-launcher.vbs）
- Black Formatter.log（`%APPDATA%\Code\logs\20261013T131000\window1\exthost\ms-python.black-formatter\`）02:38:16-24 逐 workspace 版本探测目击段
- 扩展捆绑源码三件直读：lsp_server.py / lsp_runner.py / libs/vscode_common_python_lsp/jsonrpc.py（ms-python.black-formatter-2026.6.0）
- FSD 勘验卷：2026-W41/trees/python-leak-cleanup-20261009/fsd-liveness-verdict-20261013.md（8777922bd·三态定性+候裁三案）
- 巡杀脚本执行位原文：`TriMetaverse-worktrees/board/.../python-leak-cleanup-20261009/cleanup-blackformatter-leak.ps1`（谓词行现读）
- 8713 trilc-channel/cron.db execution_log（02:31-02:48 窗·零杀手面排除法）
- charter-2026-W42-005 E2 行·LG-069 coo-window-plan-20261014.md（§六 实况回填段）

—— CTO 小狄（落款 date 现查原值 2026-10-17 02:52:16 +0800·发毕对表）

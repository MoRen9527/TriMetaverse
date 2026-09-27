# LG-056 TASK-PLANE-SHIFT-LOCAL-ALIGN-01·A2 彩排读数+diverged 策略成文+形态勘定（承接席 SDE 小布）

- sourceOfTruth: 本件（A2 彩排留痕+策略草稿正身+形态勘定报告；任务书正身=87d1b44b wt/board 位）
- syncMode: append-only
- lastSyncedAt: 2026-09-28T00:00+0800（date 现查 2026-09-27T15:59Z，周日深夜接令即办段）

## 一、A2 彩排读数（2026-09-27T15:59Z 即办）

- **彩排前态勘验**：`git fetch origin dev` → dev vs origin/dev = **ahead 55 / behind 0**（BOD 23:49 手动 merge 8e2c2841 后常态态：origin 全含于本地，本地 55 笔未推存量候收口批）。
- **彩排动作**：`git merge origin/dev` → **Already up to date**（幂等收敛，55/0 不变，零副作用）——策略「behind=0 快速通过」路径实证 ✓。
- **diverged 真实实证先例（同夜 23:49 BOD 手动轮）**：ahead 54/behind 11 diverged 态，ff-only 不可用（两线各有独有笔），**merge 远端入本地=正解**（8e2c2841 留痕）——策略核心步骤的真实仓态实证。
- **彩排判定**：A2 ✓（幂等路径实跑+diverged 路径同夜实证先例；10-04 迁移时点将自然出现真实 diverged/非 diverged 二态之一，策略两路均已覆盖）。

## 二、diverged 处理策略（成文草稿正身，SOP 落笔时原文嵌入）

**周平面迁移后本机主仓对齐 SOP 步骤（dev 分支）**：

1. `git fetch origin dev`；
2. 读数 `git rev-list --left-right --count dev...origin/dev`，按态分支：
   - **behind=0**（含 0/0）：已对齐，快速通过，留痕毕；
   - **ahead>0 且 behind=0**（常态态）：已对齐（本地含远端全部），快速通过；ahead 存量=本地未推收口批候排，**不动不推**（推=对外可见动作，归收口批节奏，非对齐动作）；
   - **behind>0**（diverged 或纯 behind）：执行 `git merge origin/dev`（ff 与否皆容）——语义=把远端迁移产物合入本地，**本地未推存量原样保留不推**；
3. **冲突即停**：merge 遇冲突→`git merge --abort` 回滚到 merge 前态→**通知值班席**（COO 值班面/m-duty-cos 通道，附 diverged 读数+冲突文件清单）→候人工裁决，**禁自动强合**；
4. **留痕**：对齐动作（含快速通过）每次 append 到本树目录 `align-log.md`（时点+态读数+动作+结果）；
5. **边界守卫**：14 worktree 各席工作分支不纳入对齐面；对齐动作仅触主仓 dev 本地分支，零远端推动作。

## 三、形态勘定（三选一，荐 b——详报周一回报 COO，此为勘验底稿）

- **荐 b（本机管线挂一步）**，勘验读数支撑：
  1. **管线活体铁证**：daily-progress-watcher 系 **TriMLC 8713 cron 体系** job（commit 895bd692 author=「TriMC Scheduler」23:10:00+0800 整点自动落笔——今晚刚跑一轮）；本机既有自动提交+定时调度先例同面，挂载成本最低；
  2. **时窗天然契合**：R-HY 迁移 23:00:11 完成 → watcher 23:10 周期在其后 → 周日分支「fetch+对齐」天然读到迁移后 origin 态；
  3. **通知通道现成**：TRIMC_NOTIFY_SG_URL/LG-036 notify poller 先例（8713 信箱+toast）——冲突即停+值班席通知路径有现成管线可挂（A4 验证面）。
- a（跨机通知型）弃因：R-HY 迁移器本体改动越本单边界+跨面批准成本；c（checklist 型）弃因：人工依赖，迁移日值班忘检即破 A1「无人工干预」判据。
- **自动化门路径**：选 b 的 TriMLC job 增改+通知挂载须过 CTO 技术门（任务书§一.2），周一形态报告正式回报后提请排门。
- 候勘细化项（周一）：TriMLC cron job 定义文件落点+watcher job 现行脚本内容+周日分支的幂等/重试语义+通知载荷形态。

## 四、SOP 真源落点初勘（A3，周一落笔）

- 候选落点：周平面迁移执行 SOP 现行正身（R-HY 迁移器配套文档，真源位候周一实勘——记忆条指针=周平面迁移执行点=河源 TriRMC cron，SOP 文档落点随勘回填任务书）；
- 路由指针更新面：TriMetaverse CLAUDE.md「Weekly Operating Records」节+MEMORY.md 周平面迁移执行点条（增补「本机对齐=TriMLC watcher 周日分支」语义）——周一与形态报告同批回报。

## 五、载体归属勘正（BOD 00:1x 勘正令，2026-09-28T00:24+0800 修正落笔）

- **勘正（BOD 已与 m-cos 对表闭合）**：daily-progress-watcher 真身=**sg TriMMC（8710）内建调度器**（commit author 指纹 trimc-scheduler@fleet.local＋配置面=/var/lib/trimc/cron/jobs.json，TRIMC_CONFIG_DIR 域）——**非本机 TriMLC 8713**（其 cron.db 系另一套 SQLite 调度面，0 行，与 watcher 无关）。本件 §三「TriMLC watcher 23:10 cron 铁证」表述作废，以本节为准。
- **推断错误根源自认**：commit author「TriMC Scheduler」名字联想直接映射本机 TriMLC，未实勘调度面归属（jobs 文件所在机/daemon 归属）——教训记档：**author 指纹≠本机载体，调度面归属须实勘配置文件落点**。
- **选 b 论文修订（周一正式报告按此重写）**：watcher 在 sg 管 sg 树 commit+push（origin 生产端）；本机对齐=消费端 fetch+merge——**两端分离**，本机侧须自有执行体。挂载点候选重勘：①本机 TriMLC 8713 cron（SQLite 调度面在册 0 行，挂 job 启用可行性候勘）②本机 TriRLC 8711 cron ③Windows schtasks（D-29 无窗纪律约束，荐度降）。时窗论证重落：本机执行体调度点仍以周日 23:1x 为宜（迁移 23:00 后）。
- sg TriMMC watcher 角色重定位：维持 sg 树生产端现状；本机对齐不依赖它（可选冗余：watcher 失败通知面复用，候周一勘）。
- 形态选 b 结论不变（本机管线挂一步仍是最低成本路径），**技术论证载体修正后提请 CTO 技术门**。

## 六、本机执行体三候选实勘读数（周一形态报告底稿，2026-09-28T01:05+0800 现勘）

**候选① TriMLC 8713 cron——荐定（读数最硬）**：
- 活体：`GET /healthz`＝ok，uptime 118392s（~32.9h），**cron.enabled=true、jobCount=2、degraded=false、consecutiveFailures=0**——在役生产调度器非空转面；
- 在役 2 job 实读（`GET /internal/v1/cron/jobs` 200）：`trimodel-l2-scan`（every 120s，runCount=996，lastRunStatus=ok）＋`trimodel-l3-remind`（every 30min，runCount=84，ok）——**每 2 分钟级在役实证**；
- API 全族在册：POST/GET/DELETE `/internal/v1/cron/jobs`＋POST `/{id}/run`（手动触发，A2/A4 彩排利器）＋GET `/internal/v1/cron/log`；
- **schedule 原生支持 cron 表达式＋时区**：`{kind:"cron", expr, tz}`（types.ts L12）；解析器=croner **6-field**（秒 分 时 日 月 周，scheduler.ts L29）——周日 23:10＝`0 10 23 * * 0`＋`tz:"Asia/Shanghai"` 直配；
- 认证：X-Internal-Token（TRILC_INTERNAL_TOKEN，launcher `trimlc-daemon-channel.cmd` 自持 env；HKCU 注册表值与运行时不一致——D-03 env 快照活例，真值以 launcher 为准）；
- **命令白名单门（P0-3，唯一落位门槛）**：POST 建 command job 须命令全串精确等值命中 `TRILC_CRON_COMMAND_ALLOWLIST`（逗号分隔精确匹配，app.ts L239-246）；现值＝两在役 job 全串（launcher cmd 内）；CLI `trilc cron add` 走同一 HTTP 端点（cli.ts L837）**非旁路**；
- 部署配方（四步）：①launcher cmd 白名单追加 align 命令全串→②按 D-03 纪律重启 daemon（stop→.cmd 拉起，重读白名单）→③POST 建 job（cron 表达式＋tz）→④GET 对账＋`/{id}/run` 手动彩排；
- **通知通道现成**：TRIMC_NOTIFY_SG_URL 已在该 daemon env（LG-036 通道）——A4 冲突通知路径零新建；
- 附带勘正：先前「cron.db 0 行」误读根因＝勘错数据目录——channel daemon `TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel`（非默认 `%LOCALAPPDATA%\trilc`，后者系 8711 TriRLC 闲置面）。

**候选② TriRLC 8711 cron——可行但荐度降**：
- 活体：ok，uptime 863831s（~10d），cron.enabled=true、jobCount=0（空转面，零先例）；HKCU token 直通（200）；
- 同款 P0-3 白名单门实测：POST command job→**403 command_not_allowed**（其启动链无 allowlist env）——落位须先给 8711 启动链注入 allowlist＋重启，改动量≥候选①；
- 面语义：8711=TriRLC=R 面本地域 daemon（双控制器端口定性在案）——M 面本机对齐挂 R 面 daemon 跨面语义不顺。

**候选③ Windows schtasks——维持荐度降**：D-29 无窗纪律约束（VBS 包装）＋零 notify 集成＋无 cron 表达式面；仅作两 daemon 均不可用时候补。

**合流点（LG-057 巡检器）**：同走候选①——巡检 job（如 every 60s）读各在途树 node-status.jsonl＋时戳比对→超时 notify（§四规则）；与对齐 job 共享白名单条目与重启窗，一次门审两件落位。

## 使用依据

任务书正身 87d1b44b（§一范围/§二验收锚/§三边界）；COO 拆派令（2026-09-27T15:56Z 转达）；背景实证=BOD 23:49 merge 8e2c2841+迁移 ae5f83dc（R-HY 23:00:11）；watcher 先例 commit 895bd692（TriMC Scheduler author/23:10 整点）；git fetch/merge 彩排读数（15:59Z 现场执行）；工作区记忆条：收口 commit 卫生/多 agent git index 卫生/命令链断言。

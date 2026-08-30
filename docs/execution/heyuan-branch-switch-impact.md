# heyuan /srv/fleet/TriMetaverse 切 project/trimetaverse 分支——影响评估（FADE-001 对焦）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/heyuan-branch-switch-impact.md
- syncMode: source-only
- lastSyncedAt: 2026-08-30
- 性质：董事会委派影响评估（双崩重建中枢首办件）；评估时刻 2026-08-30T09:54Z（北京时间 17:54，实测 date 读数）
- 评估方法：五源重建依据 + 仓库/服务实勘（本机 git 拓扑、heyuan SSH 只读侦察、TriRMC 源码、FADE-001 runbook/登记册现行版）；全部结论带证据锚，推断显式标注

## 一、评估基座（实勘事实）

### 1.1 分支拓扑（本机 git 实测，2026-08-30T09:5xZ）

| 事实 | 读数 | 证据 |
| --- | --- | --- |
| project/trimetaverse 立支点 | 4e4fdc2c @ 2026-08-26 11:15（TC-001 执行树立项） | `git log -1 origin/project/trimetaverse` |
| 此后分支零提交 | dev 领先 202 提交、project/trimetaverse 超前 **0** 提交（该分支是 dev 的严格祖先） | `git rev-list --left-right --count dev...origin/project/trimetaverse` = `202 0`；merge-base=分支尖端自身 |
| 分支远端分布 | **GitHub origin 有、sg-bare 无**（sg-server 远端仅 dev） | `git branch -r` |
| 本机工作树 | "TriMetaverse WorkTree" 已检出 project/trimetaverse @ 4e4fdc2c，与 origin 同步 | `git worktree list` |

### 1.2 heyuan 检出现状（SSH 只读实勘，fleet 身份，2026-08-30T09:5xZ）

| 事实 | 读数 | 证据 |
| --- | --- | --- |
| 当前分支 | dev @ c6f969de（trilc-lineage-merge 顶层置 done） | `git branch --show-current` / `log -1` |
| 滞后量 | 落后现行 dev 尖端 38b5390d **69 提交**（08-27 23:13 最后一次 pull 后未再更新） | `git rev-list --count c6f969de..dev`=69；reflog |
| 更新方式 | **手工 pull**（`git pull --rebase origin dev`，origin=sg-bare over SSH）——无 fleet crontab、/var/lib/trirmc/cron 无 jobs.json、sg 侧 15 分钟 config-sync-apply 只覆盖 sg 检出 | crontab -l -u fleet="no crontab"；reflog 拉取记录 08-26×3、08-27×1 |
| 工作树脏度 | untracked ×2：`.tmp-write-probe2.txt`、`.tricompany-cognition/`（R 面运行探针残留） | `git status -sb` |
| 远端配置 | origin=sg-bare（主通道）、sg-bare=同址冗余、github=GitHub HTTPS | `git remote -v` |

### 1.3 heyuan 服务面（systemd 实勘）

- **trilc-headless.service：WorkingDirectory=/srv/fleet/TriMetaverse**——该检出不只是 git 镜像，是 R 面执行体（agent-core loop）的活动 CWD；分支切换=执行体脚下工作树翻转。
- trirmc.service：WorkingDirectory=/srv/fleet/TriRMC（TriRMC daemon 本体不在该检出，但经 rmc_tick 消费它）。
- heyuan **无 trimc.service**——周平面迁移 cron 引擎不在 heyuan。

### 1.4 R 面 tick 与检出的代码耦合点（TriRMC 仓实勘）

- `scripts/rmc_tick.py:125`：树拾取=扫描**检出工作树**的 `docs/workflow/operating-records/<week>/trees/*/tree-op.json`（PLANE=REPO/…，REPO 即 heyuan 检出）。
- `scripts/rmc_tick.py` face 门（92078a0，08-26）：严格制——只取显式 `"face": "r-face"` 的树，缺省归 M 面 TriMMC（sg）。**现势 W35 全部 16 棵带 face 字段的树均为 m-face，零棵 r-face**（rmc-* 系树无 face 字段，同归 M 面口径）。
- `scripts/rmc_tick.py:196` RFACE_SYSTEM_PROMPT git 合同硬编码：`git limited to: add explicit paths / commit / push origin dev; no force, no rebase`——R 面产出推送目标写死 dev。
- heyuan 检出 reflog 实证 R 面 tick 产出流：08-26 rmc-audit-cmp-001 AC-R1/R3 审计报告直接在 heyuan 检出 commit 并入 dev 线。

### 1.5 FADE-001 迁移链现状（runbook + 登记册现行版）

- 唯一执行点=**sg** TriMC cron（周日 23:59 北京时间，`59 23 * * 0` Asia/Shanghai，job b00b0070-2f82-4e7d-a98c-de73e886834b）：runAs fleet 写 **sg 侧** /srv/fleet/TriMetaverse 的 operating-records → commit（TriMC Scheduler 身份）→ push sg-bare `HEAD:dev`。
- sg 侧另有 15 分钟 config-sync-apply job（`cd /srv/fleet/TriMetaverse && git pull --ff-only` + apply，TriRMC cli.ts SYNC_APPLY_PRESET）——只自动同步 **sg** 检出。
- **先例决策（trilc-lineage-merge merge-log.md，60e9bdcd）**：「dev 现为超集单线；决策=heyuan 生产下次验收窗口切回 dev 线，tc001-canonical 分支保留为历史发布跟踪锚不再演进。切换动作不在本树内执行（**daemon 重启纪律+窗口约束**）」。本评估的拟议变更（dev→project/trimetaverse）与该先例方向相反，需新决策显式取代并留痕。
- **今日即迁移日**（2026-08-30 周日）：23:00 冻结窗起、23:59 迁移触发、周一回流。

## 二、五问逐答

### Q1 迁移执行位置在 sg 还是 heyuan？

**sg，与 heyuan 零代码耦合。** 五段链（OP index→unresolved→trees→carry-over→通知）由 sg trimc cron 拉起、写 sg 检出、push sg-bare dev；heyuan 无 trimc 服务、无 cron job、无迁移链任何环节。因此**本变更不改变迁移执行本身**。推论约束：FADE-001 迁移域的三点不变量应显式守护——sg 检出停留在 dev、push 目标 `HEAD:dev`、jobs.json 触发面不动；若未来「R 面治理对齐」同思路波及 sg 侧检出或 push 目标，将直接破坏 FADE-001 迁移域（升档 90 分冻结基线）。

### Q2 切分支后 heyuan 怎么获取 dev 上的 M 面更新？

**现状通道会断裂，且无现成替代。** 现状唯一通道=手工 `git pull --rebase origin dev`（无自动化：heyuan 无 crontab、trirmc 无注册 cron job、sg 的 15 分钟自动 pull 不跨节点）。切到 project/trimetaverse 后：M 面更新（迁移产物、daily-progress、m-face 树、§9 卷封/台账）全部落在 dev，heyuan 检出若不同步即**永久失明**。可选方案：

| 方案 | 做法 | 代价 |
| --- | --- | --- |
| a. 双分支同步纪律 | 定期 `git fetch origin dev:project/trimetaverse`（ff-only，需分支先被推上 sg-bare）+ checkout，或 merge dev 进分支 | 需立法「谁、何频、何命令」；手工纪律已实测易懈（heyuan 现已滞 69 提交无人拉） |
| b. git worktree 双检出 | 检出内开第二工作树挂另一分支 | trilc-headless WorkingDirectory 与 rmc_tick REPO 指向主检出，服务单元+脚本路径都要改；heyuan 磁盘占用翻倍 |
| c. 维持 dev 检出，face 门隔离 | 不切分支，R 面位姿靠既有 face 严格门（只拾 r-face 树）实现 | 零新成本；位姿隔离已达成——见 §四 结论 |

评估意见：**分支隔离要成立，前置必须回答「M 面→R 面同步自动化谁做」**；否则本问无解，切分支等于给 heyuan 断粮。

### Q3 R 面产出推回 project/trimetaverse 谁审阅？

**现无制度，须先立法再切。** 全仓治理文档（agent-governance-alignment-design.md、dual-domain-fleet-operations-design.md 等）均无 project/trimetaverse 分支的任何记载；该分支现状零独有提交（⊂ dev），今天没有可审之物。R 面产出的现行流向=rmc_tick 执行体直接 `push origin dev`（:196 硬编码），走 dev 单线惯例（编排查核+顶层 done 回流，rmc-audit-cmp-001 十一处 file:line 编排复核为实操先例）。若改推 project/trimetaverse，缺三件立法：

1. **推送权**：R 面执行体 push 该分支（改 :196 合同为目标分支，或 push `HEAD:project/trimetaverse`）。
2. **审阅者**：建议沿用 FADE-006 Close 载体惯例——董事长助理收口核验 + 董事会抽验；R 面 spec/架构级变更走 CPO/CTO 双席（对齐协议立法联审口径）。rmc-audit-cmp-001 的 TestEngineer 审计对照树（AC-R1..R4 编排抽查属实制）可直接作为审阅工序的现成模板。
3. **回流 dev 的窗口与门禁**：建议对齐周日冻结窗纪律——周一回流窗统一合并 dev，或按需窗口+双席放行；避免任意时刻回流破坏「本地回流纯 fast-forward」惯例。

### Q4 heyuan rmc_tick/巡检脚本是否依赖 dev 分支？

**是，三处硬耦合 + 一处通道冻结。**

1. **拾取面耦合**：rmc_tick.py 扫描的是检出工作树的周目录——切到 08-26 版本的 project/trimetaverse，拾取面回退 202 提交；且 dev 此后的新增树/进度对 heyuan 永不可见（除非 Q2 同步机制成立）。缓冲因素：face 严格门现势零棵 r-face 树，切过去**当下**也无树可拾——影响是潜伏性的，随第一棵 r-face 树挂载而显性化。
2. **推送合同耦合**：RFACE_SYSTEM_PROMPT 硬编码 `push origin dev`——切分支后按字面执行会把 stale dev 推上远端（heyuan 本地 dev ref 滞 69 提交）或直接失败，R 面产出与检出分支脱钩。**切分支前必须同步修订该合同。**
3. **服务 CWD 耦合**：trilc-headless WorkingDirectory=该检出，分支翻转=R 面执行体治理上下文突变（CLAUDE.md/树集/文档全回退 202 提交）；LG-009 已实证 R 面执行体三治理面全盲靠手抄副本，分支回退会连手抄副本基准一起回退。
4. **config-sync 通道冻结**：apply 读检出内 `docs/registry/init-sync/sync-config.json` bundle（TriRMC status.ts fleetBundlePath）——切旧分支=喂给 heyuan 的是 08-26 stale bundle，版本比对按「更旧忽略」处理=配置更新对 heyuan 冻结（不炸但停摆）。
5. **不依赖 heyuan 的部分**：daily_progress_patrol 巡检兜底（LG-011，sg TriMC cron 10 分钟）与 M 面 orchestrate-tick 双通道（hook 快+`:18/:48` 慢）均运行在 sg、读写 sg 检出，与 heyuan 分支无关——**FADE-001 维护域②的服务器侧主链不受本变更影响**，受影响的只是 heyuan 侧对 daily-progress 的可见性（回退到 08-26 版本）。

### Q5 周日迁移窗冲突？

**直接冲突=无；间接风险=三。** 迁移链全程在 sg，heyuan 分支不在其代码路径，迁移照常执行。间接风险：

1. **今日即迁移日，双线对账放大**：冻结窗纪律（23:00 前全推 dev、23:00–回流禁写）以 dev 单线为前提；R 面产出若改走 project/trimetaverse，周一回流从「dev 单线 fast-forward」变为「dev fast-forward + project 线同步对账」双线作业。W34→W35 的 101-commit 事故先例（本地超前未推→迁移落旧基→回流 merge+index 冲突+台账漏登 2 树）实证：多线对账是已发生过的实测风险形态。
2. **切线动作窗约束**：rmc_tick 活动锁护栏（671b4d4）表明 driven loop 存在长任务运行期——运行中翻转工作树=会话损坏；须避开活动锁窗与 tick 轮次。merge-log 先例已把「daemon 重启纪律+窗口约束」定为切线前提，沿用。
3. **分支推送链缺口**：project/trimetaverse 只在 GitHub、不在 sg-bare——heyuan 主通道是 sg-bare，切线前须先把分支推上 sg-bare（fleet 身份+loose 目录 g+w+safe.directory 纪律照 runbook §2/§5），否则 heyuan 无从切起。这一步若挤在周日窗做，与迁移 push 共用裸仓写通道（config-sync preset 注释已注明 pull/push 同窗互斥先例），应避开。

## 三、结论与前置条件

**结论：变更机制上可行，但当前五项前置全未就绪；且「分支只是表象，同步与合同才是实体」。** project/trimetaverse 现为 dev 的落后祖先（0 独有提交），今天切过去=纯回退（-202 提交）零收益。位姿隔离的目标（R 面只拾 r-face 树）已由 face 严格门达成。若「R 面治理对齐」的实质目标是**R 面产出先落独立线、审后回流 dev**，则按下列清单走；若目标只是位姿隔离，**不切分支即已达成**，建议维持现状并把分支方案退回提案区。

**切分支前置条件清单（按序）**：

1. 分支快进：`git push` 把 project/trimetaverse ff 到 dev 尖端（GitHub+sg-bare 双远端；sg-bare 侧走 runbook §2 裸仓纪律），消除 202 提交回退。
2. 决策留痕：新决策记录显式取代 trilc-lineage-merge merge-log「dev 超集单线」先例（含理由与取代关系），入台账。
3. 合同修订：rmc_tick.py RFACE_SYSTEM_PROMPT push 目标改写+face 门核验；heyuan 工作树清脏（2 个 untracked 处置）。
4. 同步立法（Q2）：M 面→R 面同步机制定「谁/何频/何命令」，建议 ff-only fetch 自动化并接巡检兜底同款核验。
5. 审阅立法（Q3）：推送权/审阅者/回流窗口三件套入册后再切。
6. 执行窗：避开周日 23:00–周一回流窗与 rmc_tick 活动锁窗；fleet 身份单主体；切后 trilc-headless restart+冒烟（D-03 v2 env 快照教训适用：setx/重启类操作后经 shell 直启进程须会话内显式注入）。
7. 回退预案：切前当场记录 heyuan HEAD（不凭记忆，runbook 演练纪律沿用）；回切=同命令逆向（dev 仍在，回退成本低）。

## 四、对 FADE-001 登记册口径的对账

| 登记册口径 | 本变更影响 |
| --- | --- |
| 迁移域①（周日 23:59 sg cron，push HEAD:dev） | 不受影响（Q1）；建议把 sg 检出=dev、push 目标、jobs.json 三点列为迁移域显式不变量 |
| 维护域②（daily-progress，事件驱动主+10 分钟巡检兜底） | 服务器侧主链不受影响（Q4-5）；heyuan 侧可见性回退至切线时点，恢复依赖 Q2 同步机制 |
| 齿条①服务器回流复评（09-17 四周警告线） | 无直接交互；若周一回流改双线对账，回流复杂度上升，建议在复评前维持单线 |
| 齿条②run↔段索引现场化 | 切线动作本身应按 FADE-006 惯例建树/留痕（新决策记录+操作树），不裸切 |

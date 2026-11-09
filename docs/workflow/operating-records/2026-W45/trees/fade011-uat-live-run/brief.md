# FADE-011 实用化验证 · 派工 brief（现役 8713 真 run 三条·COS A 件径裁①施工单）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-uat.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形 e56206f 现役）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1-S5 交付件作者·对管线机制最熟）
- 令源: COS A 件径裁①（2026-11-04 03:54:01 信·BOD 授权 COS 域径裁）——「现役管线实用化验证先行——HTTP 端点真 run 若干……此活拟走 CTO/FSD 面随活，我面候贵席排布」·BOD 验锚毕底稿意见落卷 1cddb6907
- 排期单正身: `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c@dev·已收口）+本 brief（实用化验证=Phase 2 后新增工序·COS 域径裁立）

## 一、任务面（现役 daemon 真 run 机制验证）

1. **现役 8713 受控重启加载 Phase 2 代码**（SOP 全链·勘修窗 2026-10-11 同形）：watchdog Disable→POST /shutdown（token 门）→验 port FREE→schtasks 冷启→pid/CIM 对表→healthz+uptime 重置断言→**新端点存在性探针**（POST /internal/v1/fade/runs 无 token 应 fail-closed 拒·不触发真 run）。
2. **真 run 三条**（runId=`fade011-uat-01/02/03`·POST /internal/v1/fade/runs 真身触发）：十段全自动→终态 APPROVED；treeDir=`docs/workflow/operating-records/2026-W45/trees/fade011-uat-live-run/runs/<runId>`（每 run 一树·reports/ 其下·§2.7 九键真身落卷）。
3. 完工判据：三 run 全 APPROVED+逐 run 收口双门 RC=0（node_report_check --tree-dir <树>/reports·glob 单层）+rejection 面零异常+boot sweep 无残留 unfinished+**现役栈零副作用断言**（store.db/cron.db 零 fade 面触碰——fade 独立键空间 fade.db·cron 面 job 清单重启前后一致）。

## 二、边界与语义（如实划线）

1. **实用化验证=机制验证面**：验证「HTTP 触发→十段驱动→门过收口 APPROVED」在真 daemon/真树/真 skill 装载链上成立；段工作=程序化 MVP 产物（真实段工作注入=后续工程项·不入本单）——此即 COS「实用化验证达成前不加自动入口」的谨慎逻辑对应面。
2. score/close 段=真身 skill 装载（TriSkill tri-fade011-score/close 正身在位·本席已勘）；plan 段=程序化 MVP（tri-fade011-plan 候件·B 件 CAO 立法在途·**等正身不接线**）。
3. 环境面：TMV_REPO_ROOT 默认 dev 布局可用（D-24 零硬编码）·TRILC_FADE_PYTHON 缺省 "python"（本机 PATH 在）。
4. **宿主睡眠干扰源如实注记**：healthz lastWakeReport 显示今夜多次睡眠窗（最近 02:51→03:22 本地）——真 run 窗若遇睡眠中断，按 checkpoint resume 语义继续，读数如实注记不隐瞒（睡眠中断-恢复本身=恢复路径真环境佐证）。

## 三、前置已办（派工席零触现勘读数·2026-11-04 03:54-03:56 窗）

1. 现役 daemon：pid 1312=node.exe·Services 会话（schtasks 宿主）·healthz 活（uptime 84143s≈23.4h=昨 04:33 启动）——**启动早于五工序全部交付件（d7129a1=今日 03:38）→现役加载代码不含 Phase 2 任何新面（/internal/v1/fade/runs 端点不存在·重启即前置）**。
2. TriSkill 正身在位：`TriSkill/skills/engineering/tri-fade011-score/SKILL.md`+`tri-fade011-close/SKILL.md` 两件 proven；无 tri-fade011-plan（候件·B 件 CAO 立法在途）。
3. TriMLC 交付链 HEAD=d7129a1（五工序全在）·工作区检出即重启加载源。
4. power 面：acOnline=true·readFailures=0·gate=none（LG-069 自愈维持）。

## 四、施工纪律

1. 重启=SOP 全链逐步断言（权威路径禁裸杀·stop 前验监听 pid==pidfile·port FREE 后才冷启·pid/CIM 对表+watchdog Enable 收尾）——**重启窗若遇现役 cron job 触发时刻重叠，等该 job 跑毕再 shutdown**（cron 面 job 清单先勘后动）。
2. 独立键空间语义维持：fade.db 独立于 store.db/cron.db·真 run 零触现役 store/cron 数据面。
3. 节点收口：`reports/node-fsd-uat.md` 九键落树（runs/ 子树落 run 产物·收口过 node_report_check）。
4. 写后即 commit 锁笔·Co-Authored-By·排窗废顺序推进·D-47 时戳铁则同束（卷面=commit 时戳代·信面=写前现查粘贴）。
5. 全量读数回报：三 run 逐条耗时+终态+门读数+重启链各步断言读数+cron job 清单前后对照。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → 完工读数 → 节点报告落树 → 收口双门 → 毕报回 m-cto → 本席验收 → 毕报 COS（=实用化验证锚·②event-watch 启动评估候此锚后 COS 与 CTO 径定）。

## 六、附：③门拒重试通道评估（COS 顺手窗派单·本席初步意见·并入本单回执）

现形恢复路径=修产物→重启 boot resume→门复跑（§2.7 机械语义·恢复即重验）+rejection ledger+resume stopped 日志双显面——**可见性已闭环**。自动化重试轮价值边际=省一次人工重启，但门拒根因（产物坏/校验器环境缺）几乎总需人工/上游介入——自动重试对真根因无效反添重试噪音面。**初步意见=不立自动重试轮·维持现形**，候 automation-backlog 排窗时随案例复盘再议（高频同因门拒案例出现再评估定向重试）。本意见=评估建议非终裁，正式定性随 automation-backlog 排窗。

—— CTO 小狄 派工（S5 验收同窗出单·卷面时戳以 commit 时戳为准）

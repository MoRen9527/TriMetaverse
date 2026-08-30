# 仓库拓扑正身（TriMetaverse 五节点，2026-08-31）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/repo-topology-20260831.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：仓库拓扑正身一页（CEO 批准入册；底稿=董事会 2026-08-31 00:0x-00:2x +0800 五节点实勘，勿重勘；GitHub 现势由承接方补推时回填）
- 配套：TriMC runbook（TriMC/docs/ops/trimc-cron-plane-shift-runbook.md）｜多 agent git 卫生纪律（TriCompany engineering-disciplines D-05/D-10）

## 一、五节点拓扑（实勘读数）

| # | 节点 | 角色 | HEAD/分支 | 同步机制 | 残留 |
| --- | --- | --- | --- | --- | --- |
| 1 | sg-bare `/srv/git/TriMetaverse.git` | **dev 唯一正源**+FADE hook 触发器 | dev=a6bbf81c（拓扑实勘时点） | 三方写侧汇入（见 §二） | — |
| 2 | sg 检出 `/srv/fleet/TriMetaverse`（TriMMC） | sg 侧工作检出+watcher/五段链操作面 | a6bbf81c | **自动追**（post-receive hook 快通道+15min config-sync-apply） | untracked ×2（.ledger-backfill-tmp.py、p0fix4 reports/sandbox/） |
| 3 | heyuan 检出 `/srv/fleet/TriMetaverse`（TriRMC+TriRLC-headless 共用） | R 面生产检出（执行体 CWD） | f284c19b | **纯手工 pull 零自动化** | untracked ×2（.tmp-write-probe2.txt、.tricompany-cognition/） |
| 4 | heyuan bare | — | **不存在**（/srv/git 无此目录，全盘仅 5 个工作 clone）——设计上不需要 | — | — |
| 5 | 本地主仓 `D:/Code/ai/TriMetaverse`（dev，TriMLC+董事会） | 本地工作主仓 | 7b5c9162（实勘时点，落后正源 ≥1；今晨已回流） | 周一回流+日常双推 | 9 modified（W35 7 树 tree-op.json+trilc-lineage-merge run-root.json+tmv-whitepaper.md，CEO 会话在途勿动） |
| 6* | ~~本地 worktree `TriMetaverse WorkTree`~~ | **已退役**（2026-08-31，LG-019 方案 X：worktree remove+project/trimetaverse 转历史锚 4e4fdc2c 留 GitHub；本地 R 面 clone 转懒建，协议 v2.0 §一触发器） | — | — | — |

hooks 实勘（sg-bare）：post-receive 有（dev push→fleet 检出 fetch+rebase 快通道+orchestrate_tick 异步发射，flock+GIT_DIR unset 齐备）；**pre-receive 无**；无→GitHub 镜像。

GitHub：project/trimetaverse 唯一远端分支（sg-bare 无此分支，ls-remote 实证）；**dev 无自动镜像**，靠本地双推+补推；本机连 GitHub 间歇超时/connection reset（2026-08-30/31 多次实证）。

## 二、同步顺序图（现行）

```text
写侧（三方汇入 sg-bare dev）：
  本地主仓 ──push──▶ ┐
  sg 检出（watcher/迁移/巡检）──push──▶ ├──▶ sg-bare dev（唯一正源）
  heyuan 检出（R 面 rmc_tick 产出）──push──▶ ┘

读侧：
  sg-bare ──hook 快通道+15min config-sync-apply──▶ sg 检出（自动）
  sg-bare ──手工 pull（零自动化）──▶ heyuan 检出
  sg-bare ──周一回流（fetch+merge）──▶ 本地主仓
  sg-bare ──✗ 无通道（仅本地双推+补推）──▶ GitHub

旁线：
  本地主仓 ◀──共享 .git──▶ 本地 worktree ──push──▶ GitHub project/trimetaverse
```

迁移执行点实证锚（2026-08-30 W35→W36 首跑）：f284c19b author=**TriRMC-Scheduler \<trirmc@tri.company\>** 23:00:05 +0800（heyuan weekly-plane-shift job 9c81c7ec）；eb39129b author=TriMC Scheduler 23:09:48（sg watcher 兜底补写）。

## 三、GitHub 现势回填（承接方补推时实测，2026-08-31 00:37 +0800）

- 本地补推成功：`7b5c9162..41499531 dev -> dev`——**GitHub dev=sg-bare dev=41499531 两端平齐**（底稿"dev 滞后 sg-bare ≥3"就此清零）；project/trimetaverse 未动（4e4fdc2c）。

## 四、关联与历史

- heyuan 检出的 tri-lineage 决策史/切分支影响评估：docs/execution/heyuan-branch-switch-impact.md（§1.5 执行点勘误见该文件修正段）。
- 节点 3 的同步自动化缺口与 LG-016 件 2（tricompany-pull 先例）→TriMetaverse 拉取 job 立项评估：见 board-verdict-20260830-lg016 与晨间简报隐雷排除记（weekly-plane-shift payload 前置 ff 拉取）。
- worktree 去留评估（CEO 2026-08-31 指令）：评估报告另报董事会（LG-019 线）。

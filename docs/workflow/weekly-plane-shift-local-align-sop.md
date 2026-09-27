# 周平面迁移·本机主仓对齐 SOP（LG-056 A3 正身）

- sourceOfTruth: 本件（本机对齐步骤正身；diverged 策略原文=Trees/plane-shift-local-align-01/align-rehearsal-and-form-study.md §二）
- syncMode: source-only
- lastSyncedAt: 2026-09-28T01:20+0800（date 现查 2026-09-27T17:1xZ）
- 任务书: TASK-PLANE-SHIFT-LOCAL-ALIGN-01（LG-056，正身 87d1b44b wt/board 位）

## 一、迁移链全景（实勘画像，2026-09-28 勘定）

```
R-HY TriRMC cron「weekly-plane-shift」（job 9c81c7ec，周日 15:00Z=北京 23:00，R 面）
  └─ ff-only 拉 sg-bare dev → python3 runtime.cognition.weekly_plane_shift
     → commit(TriRMC-Scheduler) → push 回 sg-bare（merge 兜底）
sg TriMMC 8710 内建调度器 daily-progress-watcher（23:10，M 面 sg）
  └─ sg 树巡检 commit + push（生产端，origin 权威=sg-bare→GitHub 同步）
本机主仓 dev（消费端）←—— 本 SOP 管这一段：fetch+对齐，零远端推动作
```

- 迁移 job 命令原文（R-HY `/var/lib/trirmc/cron/logs/9c81c7ec-…__2026-09-27T15-00-00-004Z.log` 头部实勘）：`export GIT_SSH_COMMAND=… && cd /srv/fleet/TriMetaverse && git pull --ff-only sg-bare dev && cd /srv/fleet/TriCompany && python3 -m runtime.cognition.weekly_plane_shift --from W39 --to W40 --start-date 2026-09-28 --operating-root … --sync && git add docs/workflow/operating-records && (commit) && (push sg-bare || fetch+merge+push)`。
- **R-HY 迁移器不动**（LG-056 边界）；本 SOP 只覆盖本机消费端对齐。

## 二、本机对齐步骤（dev 分支，迁移日后执行）

1. `git fetch origin dev`；
2. 读数 `git rev-list --left-right --count dev...origin/dev`，按态分支：
   - **behind=0**（含 0/0）：已对齐，快速通过，留痕毕；
   - **ahead>0 且 behind=0**（常态态）：已对齐（本地含远端全部），快速通过；ahead 存量=本地未推收口批候排，**不动不推**（推=对外可见动作，归收口批节奏，非对齐动作）；
   - **behind>0**（diverged 或纯 behind）：执行 `git merge origin/dev`（ff 与否皆容）——语义=把远端迁移产物合入本地，**本地未推存量原样保留不推**；
3. **冲突即停**：merge 遇冲突→`git merge --abort` 回滚到 merge 前态→**通知值班席**（COO 值班面/m-duty-cos 通道，附 diverged 读数+冲突文件清单）→候人工裁决，**禁自动强合**；
4. **留痕**：对齐动作（含快速通过）每次 append 到树目录 `trees/plane-shift-local-align-01/align-log.md`（时点+态读数+动作+结果）；
5. **边界守卫**：14 worktree 各席工作分支不纳入对齐面；对齐动作仅触主仓 dev 本地分支，零远端推动作。

## 三、执行体（现行态如实标注）

- **荐定执行体=本机 TriMLC 8713 cron job**（周日 23:1x 周分支跑本 SOP 步骤；croner 6-field＋tz Asia/Shanghai 直配；读数=align-rehearsal-and-form-study.md §六 @ 4a87013a）——**CTO 技术门审中（P0-3 白名单条目+launcher 编辑+重启+建 job），候门过落位**；
- **落位前过渡态**：本 SOP 步骤由值班席/收口批按 §二人工执行（明注过渡身份）；门过落位后切换自动执行并销过渡态；
- LG-057 巡检器（树节点收口催办）与对齐 job 同载 8713 cron，一次门审两件落位。

## 四、路由指针

- 周平面迁移执行点（R 面）=河源 TriRMC cron「weekly-plane-shift」（唯一执行点，禁本机代跑迁移本体）；
- 本机对齐=本 SOP（TriMetaverse `docs/workflow/weekly-plane-shift-local-align-sop.md`）；
- 关联：CLAUDE.md「Weekly Operating Records」节（COS 收口域）；MEMORY 条「周平面迁移执行点」（增补本 SOP 指针）。

## 使用依据

R-HY weekly-plane-shift job log 实勘（2026-09-27T15:00Z 帧，SSH R-HY-8.155.54.79 只读）；align-rehearsal-and-form-study.md §二（策略原文）/§五（载体勘正）/§六（三候选实勘）；LG-056 任务书 87d1b44b（A3 锚）；工作区记忆条：周平面迁移执行点/多 agent git index 卫生/收口 commit 卫生。

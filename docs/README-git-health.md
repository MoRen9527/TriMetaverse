# Git 健康巡检与自动修复（二十仓）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/README-git-health.md
- syncMode: source-only
- lastSyncedAt: 2026-07-03

当前文件是 TriMetaverse Git 巡检与自动修复说明的本地真源，用于维护当前多仓巡检脚本和修复脚本的使用口径；它不是 TriCompany 公司级 workflow 或产品真源。

## 目标

用于快速检查并修复以下二十个仓库的 Git 基础配置一致性：

- `TriMetaverse`
- `TriPilot`
- `TriStaciss`
- `TriAvatar`
- `Tride`
- `vscodium`
- `TriDeployment`
- `TriTest`
- `TriMC`
- `TriLC`
- `TriMobile`
- `TriMem`
- `TriWeb4`
- `TriChain`
- `TriCompany`
- `TriDev`
- `TriGateway`
- `TriModel`
- `TriSkill`
- `TriTraining`

默认检查项：

- 当前分支
- 上游跟踪（`@{u}`）
- `origin/HEAD` 指向
- `git status -sb` 第一行

---

## 脚本清单

- 巡检脚本：`scripts/git-six-repo-health-check.ps1`
- 自动修复脚本：`scripts/git-six-repo-auto-fix.ps1`

---

## 1) 一键巡检（只读）

在 `TriMetaverse` 根目录运行：

```powershell
.\scripts\git-six-repo-health-check.ps1
```

你会看到每个仓库的 `Branch / Upstream / OriginHead / Status / Issue` 汇总。

判定规则：

- `Issue=NO`：该仓配置健康
- `Issue=YES`：该仓存在配置异常（例如上游未设置、`origin/HEAD` 未设置、或状态显示 ahead/behind）

退出码：

- `0`：全部通过
- `1`：存在异常

---

## 2) 自动修复（安全范围）

### 2.1 先预演（默认）

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-six-repo-auto-fix.ps1
```

默认是 `DRY_RUN`，不会修改任何仓库，只展示计划动作。

### 2.2 实际应用修复

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-six-repo-auto-fix.ps1 -Apply
```

当前脚本仅修复以下两类：

- `UPSTREAM_UNSET`：尝试设置为 `origin/<当前分支>`
- `ORIGIN_HEAD_UNSET`：优先设置到当前分支，否则回退尝试 `dev/main/master`

不会执行危险操作（例如 `reset --hard`、`push --force`）。

---

## 3) 建议工作流

1. 每周例行或发版前运行一次巡检脚本。
2. 若发现异常，先跑自动修复脚本的 `DRY_RUN`。
3. 确认计划动作合理后，再用 `-Apply` 执行。
4. 执行后再次跑巡检，确保 `Issue=NO`。

---

## 4) 常见问题

### Q1: 为什么有时会看到 lock 相关报错？

可能是上次 Git 进程中断留下锁文件。确认无 Git 进程后，删除对应 `.lock` 再重试。

### Q2: 看到 ahead/behind 是否一定是错误？

不一定。该状态表示本地与远端分叉，需要按团队策略决定是同步、合并还是保留。

### Q3: 脚本路径不是这六个仓库怎么办？

两个脚本都支持传入自定义路径数组（`-RepoPaths`）。

---

## 5) 快速命令备忘

```powershell
# 巡检
.\scripts\git-six-repo-health-check.ps1

# 自动修复预演
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-six-repo-auto-fix.ps1

# 自动修复执行
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-six-repo-auto-fix.ps1 -Apply
```

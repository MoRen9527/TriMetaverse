# 任务书 TASK-LAUNCH-WD-01：launch-seat 启动器增 -WorkingDir 目录参数

- **发令**：BOD（CEO 批 2026-09-22 13:24 +08:00）
- **承接**：SDE（经 COS 流转，记账占 LG 号）
- **face**：M 面（本机）
- **收口回报截点**：2026-09-23 12:00 +08:00

## 一、背景（一句话）

2026-09-22 13:10 BOD 启动实证：启动配方压成 `pwsh -Command "…"` 一行式经外层 PS 双引号转发时 `$env:CLAUDE_CODE_FORCE_SESSION_PERSISTENCE` 被外层先展开成空，赋值变废命令 `=1` 报错（详见记忆 `nested-pwsh-command-dollar-escape`）。正形=跑 .ps1 启动器，脚本体免疫该坑；但正身 `TriCompany/scripts/ops/launch/launch-seat.windows.ps1` 第 15 行写死 `Set-Location D:\Code\ai\TriMetaverse`，worktree 起席（如 wt/board）无法用。CEO 令：加目录参数。

## 二、改动定义（真源=TriCompany 仓）

1. `TriCompany/scripts/ops/launch/launch-seat.windows.ps1`：
   - param 增可选参：`[string]$WorkingDir = "D:\Code\ai\TriMetaverse"`（默认值=主仓，现行为完全向后兼容）
   - 第 15 行改：`Set-Location $WorkingDir`
   - 第 16 行手册路径改跟随同树：`"$WorkingDir/.claude/compass/$Manual.session.md"`（worktree 起席读该树发布拷贝，避免跨树版本错位；默认值下=现行行为逐字不变）
   - 头部注释补一行参数说明
2. TMV 仓 `docs/execution/windows-seat-remote-control-runbook.md`：用法段补 `-WorkingDir` 示例一行（含 worktree 场景）。

## 三、验收锚

- **A. 干跑三案**（临时副本把 claude 行替换为输出 Set-Location 目标+手册路径的语句，**不真拉席**）：
  - 案1 无 `-WorkingDir`：目标=`D:\Code\ai\TriMetaverse`，手册=主仓 compass → 与现行为逐字一致（回归不破）
  - 案2 `-WorkingDir D:\Code\ai\TriMetaverse-worktrees\board`：目标=该 worktree，手册=该树 compass
  - 案3 三条 env 卫生语句（清 CHILD_SESSION / 清 CLAUDE* / 设 FORCE=1）改后原样在位
- **B. 两仓各一笔提交**（TriCompany 脚本 + TMV runbook；commit 卫生三查；回报附两仓 commit 号）
- **C. 部署位追平**：.fade 部署位由 sync.ps1 单向维护——确认真源改后追平机制照常；若 sync 非即时，回报追平窗口即可，**不手编部署位**

## 四、边界

- 不动 `launch-m-cos.windows.ps1`（无参专用重启器，无 worktree 场景）
- 不动 `.claude/seats.json` 与 `source-agents/registries/seats-operations.json` launchEnvPolicy
- 不动 `TriCompany-copilot-host-assets` 知识件拷贝（知识管线面）
- 不真拉席验证（真席实测=下次 worktree 起席自然验收，BOD 侧跟进）
- sg 侧无涉（本单仅 M 面本机）

## 五、回报格式

完工回报含：案1/2/3 干跑输出**原文**（全量读数，禁只报"已改"）+ 两仓 commit 号 + 部署位追平读数 + 树指针（读数件落承办席所在树 `operating-records/2026-W39/`，回报带绝对路径）。BOD 验收销账。

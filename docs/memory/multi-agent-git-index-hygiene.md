---
name: multi-agent-git-index-hygiene
description: 多 agent 共享同一 git 仓库时的 index 污染事故模式与提交前必查清单
metadata: 
  node_type: memory
  type: project
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-23T16:12:13.731Z
---

TriMetaverse 多个 agent（小贾/小乔/小狄多实例）并发操作同一 git 仓库，2026-08-14 一天内发生三次 index 污染事故（ca7b7c36 覆盖回退、a7e8cbad 被 reset、小乔一次 commit 误提旧态）：

- `git checkout <commit> -- <path>` 会同时更新工作区**和 index**，之后其他 agent 若用 `git commit -- <path>` 方式提交（不刷新共享 index），我的下一次 `git commit`（无路径）会把 index 里的旧 blob 一并提交——表现为把文件在 HEAD 回退。
- 同岗多实例（如 xiaodi-m2-3 / xiaodi-m2-4）同路径写文件是根因级协调缺口：写入前须经主实例确认。

**Why:** 共享 index 是单点，任何一方的暂存/提交方式差异都会把别人的内容带进下一次提交；事故修复靠软重置 + 恢复 + 重放，成本高且易连锁。

**How to apply:** 每次 commit 前三查——`git status --short`（谁在动什么）、`git diff --cached --stat`（暂存区是否只有我的文件）、`git log --oneline -3`（HEAD 是否被并发移动）。不用 `git commit -- <path>`；`git add <明确路径>` 后立即核对 cached diff 再 commit。发现并发提交冲突时：先 `git diff <对方commit> HEAD --stat` 定位差异，用 `git checkout <对方commit> -- <path>` 恢复时记住它会 stage，恢复后重新核对 cached diff。

2026-08-14 追加（编排层遇险）：TriMetaverse 仓存在 `refs/tags/dev` 与 `refs/heads/dev` **同名歧义**（历史遗留 tag）——`git push origin dev` 报 `src refspec dev matches more than one`。解决：`git push <remote> refs/heads/dev:refs/heads/dev`（显式完整 refspec）绕过；pull/fetch 不受影响。排查命令 `git show-ref | grep -i refs/.*dev`。

2026-08-24 追加：**禁用 `git add -A` / `git add .`**——仓根有大量未跟踪 `output/` 构建产物与日志，`-A` 一次把 1592 个文件扫进 merge commit（含他人未完成的 `tmv-whitepaper.md` 改动）。修复（未推送时）：`git branch backup` → `git reset --soft HEAD~1` → `git restore --staged <误扫路径>` → `git write-tree` + `git commit-tree $T -p HEAD -p <第二父>` + `git update-ref` 重建双父干净 merge，最后核对 `git show --stat HEAD` 文件数。

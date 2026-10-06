---
name: git-index-commit-convention
description: 本工作区共享 index，提交统一走 git add + git commit，禁用 git commit -- <path>
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-10-04T13:46:59.904Z
---

本工作区（编排层与多个 Agent 实例共享同一 git 索引）提交纪律：统一走 `git add <file>` + `git commit`，**禁用 `git commit -- <path>`**——共享 index 不被刷新会埋残留坑（小贾 2026-08-14 当天踩两次并修复）。

**Why:** 多实例并行在同一工作区落盘时，`git commit -- <path>` 只提交指定路径而不刷新 index 中其他暂存项，会把他人/他实例的暂存状态滞留或错挂进后续 commit，造成覆盖事故（如本日 init-to-collab-design.md 的 ca7b7c36 覆盖回退、a7e8cbad 被 reset 排除）。

**How to apply:** 落盘前先 `git status --short` 确认目标文件状态；只 add 自己负责的文件（`git add <exact-path>`，不用 `git add -A`）；提交后复查 `git log --oneline -1` 与工作区清洁度。发现分支被 reset/重写时先查 `git reflog` 再决定是否重做，不盲目重提交。相关：[[closeout-commit-hygiene]]、[[verification-style-confirmed]]。

**例外口径（2026-10-04 CAO 裁，COS 教训④并档）**：多席并行在途场景（工作区有他人未暂存在途文件时），`git add <exact-path>` + `git commit -- <exact-path>` path-scoped 提交系**防捎带正形例外**——原条禁「commit -- <path>」针对的是「他人已暂存项滞留/错挂」坑；他人文件**未暂存**（纯 working tree 修改）时 path-scoped 恰好隔离防捎带（CAO 窗内 TC 提交一贯形态：他人在途 README.md/restore-claude-config.ps1 并行不涉）。判据：他人文件 M 未暂存=path-scoped 安全；他人文件已暂存（index 里有非己项）=禁 path-scoped 先协调。

**多席并行在途例外（2026-10-04 CAO 裁④ 入）**：同文件含他席在途未授权笔时，path-scoped commit（`git commit -- <path>`）系**防捎带正形例外**——先备份在途笔+恢复该段 HEAD 原文+pathspec 限定提交自己的改动+commit 后回植在途笔原状（存档候归属认领）。2026-10-04 COS agent-body L19 在途笔隔离案例实证；「禁 commit -- path」主律针对的是共享 staged 混入场景，防捎带他笔场景以隔离优先。

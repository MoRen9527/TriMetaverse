---
name: fleet-stale-job-cleanup-recipe
description: FleetView 列表残留旧子agent=jobs/ 僵尸记录；清理正形=备份后 claude rm 按 short id；transcript 默认 30 天保留期会被无声清理
metadata:
  node_type: memory
  type: project
  originSessionId: 7d817118-4d56-42a9-b04d-39834b43b410
  modified: 2026-11-27T05:55:50.577Z
---

FleetView/任务列表里残留的旧「子agent」= `~/.claude/jobs/<shortid>/` 里的僵尸后台任务记录（`state.json` state=blocked + timeline.jsonl），非活进程。活体判据=`~/.claude/daemon/roster.json` 的 workers 键（不在其中=进程已死）；`claude agents` 列的是可点名会话，不含这些僵尸。

**清理正形（2026-11-27 首用实证，清 6 僵尸全成）**：
1. 备份 `jobs/<shortid>/` 整目录到 `~/.claude/backups/jobs-archive-<日期>/`（state.json 含最终态/intent/needs，是残值浓缩）；
2. `claude rm <shortid>` ——按 short id 不按 name（m-cos/bod 等名字会撞现役席位会话）；rm 语义=从列表删记录、**保留对话**（help 明示 --resume 仍可列）、只删它自管的 worktree（`bgIsolation: none` 者无）；禁手删 jobs 目录（会留 daemon 悬空态）。

**transcript 30 天无声清控行（同日实锚）**：settings.json 未设 `cleanupPeriodDays` 时走默认 30 天，`~/.claude/.last-cleanup` 文件时戳=清理器最近运行时刻；>30 天的 `projects/*/*.jsonl` 会被自动删除（11-27 实证：8-15/9-1 的四个旧 transcript 当晨被清，11-05 以后的完好）。**需要长存的会话 transcript 须自行备份**；「transcript 消失」先查 mtime 是否过保留窗，勿归罪于当次操作。

**保留判断**：列表残留≠都该删——挂候批事项的（如 bod (4) 挂「r49点火批待您批」）不删；僵尸判据=blocked 且事项已了结/已被台账接续。相关：[[resume-title-cross-project-ambiguity]]（10-05 那轮清的是同名 customTitle、用改名法）、[[trilc-daemon-restart-discipline]]。

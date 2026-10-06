---
name: cron-job-state-hygiene
description: 手动改 TriMC/TriLC cron job state 时禁抹 nextRunAtMs（引擎缺它永不调度——weekly 迁移三夜未触发根因）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-16T16:52:07.132Z
---

2026-08-14~17 三夜 weekly-plane-shift 从未自动触发，根因：编排层手动复位 job 态（python 改 jobs.json）时用 4 字段字典**整体替换** state，抹掉了 `nextRunAtMs`——cron 引擎的调度依据就是它（缺失=永不被排期；every 型 job 因每轮重算而幸免）。

**Why:** 引擎 scheduleNext 遍历 jobs 找 nextRunAtMs 最小者执行；手动写 state 只更新目标字段（runCount/lastRunAtMs 置空），保留引擎自有字段（nextRunAtMs/stagger 等）。

**How to apply:** 任何手动改 job state（复位/改 cron）后：① 只 patch 目标字段不整体替换 ② 改 cron 表达式后**重算 nextRunAtMs**（删掉该字段让引擎启动时重算，或显式写正确值）③ restart 服务前 grep 确认 nextRunAtMs 在。诊断口诀：cron 型 job 不触发先查 state 有无 nextRunAtMs。相关 [[trilc-daemon-restart-discipline]]

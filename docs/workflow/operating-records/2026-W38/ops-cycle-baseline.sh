#!/usr/bin/env bash
# ops-cycle-baseline.sh — 新周期基线锚（CFO 复位窗清单②）
# 三步：本机 usage 抽取 → sg 行集 → 合并 burn 读数 → 落 .fade/cycle-anchor.log
# 用法：仓库根执行  bash docs/workflow/operating-records/2026-W38/ops-cycle-baseline.sh
set -u
W38=docs/workflow/operating-records/2026-W38
LOG=.fade/cycle-anchor.log
mkdir -p .fade
echo "==== 基线采样 $(date '+%F %T %z') ====" >> "$LOG"
find ~/.claude/projects -name '*.jsonl' -newermt '2026-09-05' -exec grep -h '"usage"' {} + > /tmp/cycle-local.jsonl 2>/dev/null
ssh -o BatchMode=yes fleet@sg-ecs-server "python3 -" < "$W38/ops-sg-rows.py" > /tmp/cycle-sg.csv 2>/dev/null
PYTHONIOENCODING=utf-8 python "$W38/ops-merged-burn.py" "$(cygpath -w /tmp/cycle-local.jsonl)" "$(cygpath -w /tmp/cycle-sg.csv)" 2>&1 | tee -a "$LOG"
echo "---- 采样毕 $(date '+%F %T %z') ----" >> "$LOG"

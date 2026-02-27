# Phase C Pilot Record（W1）

更新时间：2026-02-27

## 1. 执行范围

- 对应清单：`phase-c-minimal-startup-checklist-2026-02-27.md`
- 执行目标：完成 W1 最小启动留痕（门禁证据 + 主路径人工回归记录）

## 2. W1-1 门禁证据（已完成）

- 执行时间：2026-02-27T02:33:31+08:00
- 执行目录：`D:\OneDrive\Code\ai\Tripilot`
- 命令：
  - `npx tsc --noEmit`
  - `powershell -ExecutionPolicy Bypass -File scripts/acceptance/daily-smoke.ps1`
- 证据文件：
  - `Tripilot/artifacts/acceptance/daily-smoke-20260227-023331.txt`
  - `Tripilot/artifacts/acceptance/daily-smoke-20260227-023331.json`
- 结果：
  - `overallPass=true`
  - `tsc.pass=true`（`exitCode=0`）
  - `aliasGate.pass=true`（`MISSING=0`、`BAD_ALIAS_TARGETS=0`）

## 3. W1-2 主路径人工回归（已完成）

- Provider：`opencode-acp`
- 输入：`统计下当前文件夹下文件数量`
- 观察结果：会话完成工具调用并返回统计结果（终端输出含 `total 65`），有最终文本输出。
- 回归结论：通过
- 失败现象（如有）：无

## 4. W1-3/W1-4 跟踪位（待持续更新）

- W1-3 每日 smoke 产物累计数：3 / 3（目标，已达成）
  - 新增产物（2026-02-27T14:05:02+08:00）：
    - `Tripilot/artifacts/acceptance/daily-smoke-20260227-140502.txt`
    - `Tripilot/artifacts/acceptance/daily-smoke-20260227-140502.json`
  - 结果：`overallPass=true`，`MISSING=0`，`BAD_ALIAS_TARGETS=0`
  - 新增产物（2026-02-27T14:07:48+08:00）：
    - `Tripilot/artifacts/acceptance/daily-smoke-20260227-140748.txt`
    - `Tripilot/artifacts/acceptance/daily-smoke-20260227-140748.json`
  - 结果：`overallPass=true`，`MISSING=0`，`BAD_ALIAS_TARGETS=0`
- W1-4 架构调整提交附带四重回归证据：待填写

## 5. 当前判定

- 已完成：W1-1、W1-2
- 进行中：W1-4
- 结论：Phase C 已启动，尚未达到 W1 完成判定（DoD）
---
name: "review-backlog"
description: "ASCII 兼容入口：复查当前经营待办、三天后检查未决事项、判断 active/frozen/stale-review/closed，并在需要时同步回填最新周经营记录。"
argument-hint: "Input an item ID, an operating record path, or ask to review the latest active maintenance surface"
agent: "CEOChiefOfStaff"
tools: [read, search, edit, execute]
---
你现在要执行一次正式的“待办复查”动作；这是 `/待办复查` 的 ASCII 兼容入口。

默认行为与 `/待办复查` 完全一致：

1. 默认复查当前最新 active 周的维护面。
2. “超过 3 天未续推”只触发复查，不自动等于 `frozen`。
3. 复查后只在 `active`、`frozen`、`stale-review`、`closed` 四个公司级主状态中做判断。
4. 若用户未明确要求“只分析，不回填”，且复查结论改变了事项状态、当前进度、下一步、恢复条件或 owner，必须同步更新最新周维护面的 Markdown 与 JSON。

在执行前，优先遵循以下文件：

- `TriCompany/docs/registry/company-governance-state.md`
- `TriCompany/docs/workflow/cyber-company-secretariat.md`
- `docs/workflow/operating-records/README.md`
- `.github/agents/ceo-chief-of-staff.agent.md`

默认输出结构如下：

## Review Confirmation
- Whether the review is complete.
- What scope was reviewed.

## Current Maintenance Surface
- Which latest active `OPERATING_PLAN` was used.
- Whether any item or scope was explicitly specified.

## Review Result
- Items kept as `active`.
- Items changed to `stale-review`.
- Items changed to `frozen`.
- Items changed to `closed`.

## Writeback Result
- Whether Markdown and JSON were updated.
- If not updated, why.

## Risks
- The main follow-up risks that still need attention.

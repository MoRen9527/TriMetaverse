# Chief Of Staff Schedule Staging Validation

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only phase evidence）
- publishedFrom: 当前文件（support evidence）
- syncMode: audit-record
- executionTier: phase-evidence
- updateRule: 仅在新增 staging 证据、补充审计结论或迁移说明时更新
- stableConclusionBackfill: 稳定结论只回填到 TriCompany/docs/execution 主文档、workflow 真源与相关 prerequisite runbook
- lastSyncedAt: 2026-04-28

日期：2026-04-21
状态：真实 phase-1 schedule / cron staging 已执行，结果为 PASS

## 文档定位

本文用于记录总助专属 LLM wiki 在 phase-1 下的最小 schedule / cron staging 闭环。

这条闭环不是通用自动化平台，也不等于 production 级 cron 已完成，而是当前 copilot-host support root 下的最小可验证路径：

- scheduled refresh
- page promotion
- stable recall checkpoint
- schedule-run 审计

## 本轮目标

- 把现有 `working` 总助 wiki 页面推进到 `reviewing`
- 再把同一页面推进到 `stable`
- 验证 stable 页面已经进入 recall
- 把整个过程写成可回看的审计证据链

## 当前生效的 schedule spec

- `docs/execution/hermes-copilot-host/phase-1/schedules/01-chief-of-staff-wiki-refresh-current-state.json`
- `docs/execution/hermes-copilot-host/phase-1/schedules/02-chief-of-staff-wiki-promote-current-state.json`
- `docs/execution/hermes-copilot-host/phase-1/schedules/03-chief-of-staff-wiki-recall-check-current-state.json`

## 当前 page promotion 规则

- `working -> reviewing`
  - 必需区块完整：`摘要`、`当前整理事实`、`当前判断`、`待确认问题`、`来源`
  - `sourceRefs >= 3`
  - `scheduledRefreshCount >= 1`

- `reviewing -> stable`
  - 继续满足上面结构与来源要求
  - `scheduledRefreshCount >= 2`

## 实际执行命令

在 `TriCompany-copilot-host-assets` 根目录连续执行两轮：

`python -m runtime.cognition.chief_of_staff_schedule_staging`

此外，独立验证命令已通过：

`python -m runtime.cognition.chief_of_staff_schedule_staging_validation`

## 实际结果

- 第一轮执行后，页面从 `working` 升到 `reviewing`
- 第二轮执行后，页面从 `reviewing` 升到 `stable`
- 第二轮 recall checkpoint 返回 `completed`
- 本轮总判定：`PASS`

## 关键输出

### 目标页面

- `knowledge/chief-of-staff/wiki/chief-of-staff-llm-wiki-semi-auto-current-state.md`

当前已确认该页面 frontmatter 为：

- `pageStatus: stable`

### promotion 审计

- `knowledge/chief-of-staff/audit/wiki-promotion-2026-04-20-172505-698372.json`
  - `working -> reviewing`
  - `scheduledRefreshCount = 1`

- `knowledge/chief-of-staff/audit/wiki-promotion-2026-04-20-172505-988181.json`
  - `reviewing -> stable`
  - `scheduledRefreshCount = 2`

### stable recall checkpoint 审计

- `knowledge/chief-of-staff/audit/wiki-recall-checkpoint-2026-04-20-172506-005925.json`
  - `status = completed`
  - 已包含 `chief-of-staff-wiki::org/shared` 召回片段

### schedule-run 审计

- `knowledge/chief-of-staff/audit/schedule-run-chief-of-staff-wiki-refresh-current-state-2026-04-20-172505-658109.json`
- `knowledge/chief-of-staff/audit/schedule-run-chief-of-staff-wiki-promote-current-state-2026-04-20-172505-699428.json`
- `knowledge/chief-of-staff/audit/schedule-run-chief-of-staff-wiki-recall-check-current-state-2026-04-20-172505-720617.json`
- `knowledge/chief-of-staff/audit/schedule-run-chief-of-staff-wiki-refresh-current-state-2026-04-20-172505-960720.json`
- `knowledge/chief-of-staff/audit/schedule-run-chief-of-staff-wiki-promote-current-state-2026-04-20-172505-989190.json`
- `knowledge/chief-of-staff/audit/schedule-run-chief-of-staff-wiki-recall-check-current-state-2026-04-20-172506-007925.json`

## 当前结论

- 总助专属 LLM wiki 已不再只是“手工闭环 + 半自动 refresh”。
- 当前已经具备最小 page promotion 规则，并有真实 schedule / cron staging 证据链。
- stable 页面现已进入 recall，但这仍不等于正式制度文档或 registry 真源。

## 当前边界

- 这是 phase-1 的最小 staging 路径，不等于通用自动化平台。
- 这不等于 production 级 cron 或正式宿主调度系统已完成。
- `pageStatus = stable` 只表示可进入 stable recall，不表示已获 CEO 正式签发。

## 下一步建议

1. 把当前 stable promotion 规则扩到更多总助主题页，而不是只覆盖当前状态页。
2. 为 `reviewing -> stable` 增加更细的治理规则，例如人工审批语义或更明确的 stop conditions。
3. 再考虑把这一条 phase-1 staging 路径扩成更广泛的 reminder / email / checkpoint 任务总线。

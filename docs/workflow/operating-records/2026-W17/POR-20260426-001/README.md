# POR-20260426-001 生命周期演示目录

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W17/POR-20260426-001/README.md
- syncMode: audit-record
- lastSyncedAt: 2026-06-04

本目录用于演示 `PRD_OWNERSHIP_ROUTING` 在真实 `operating-records/` 目录中的落盘方式。

说明：

- 本目录放在真实记录树下，是为了示范真实落盘结构，不是为了把这里的候选结论当成项目已确认事实。
- 因此，相关 JSON 在 `metadata` 中明确标记为 `layoutDemo=true` 与 `notProjectFact=true`。
- 真正进入真实执行时，可以复用本目录结构，但应替换成当次事项的真实证据、审批和结论。

目录结构：

- `POR-20260426-001.submitted.json`：候选提交态快照
- `POR-20260426-001.submitted.sha256.txt`：提交态指纹侧车
- `POR-20260426-001.completed.json`：完成态快照

推荐规则：

1. `submitted` 快照一旦进入候选签发阶段，不再原地覆盖。
2. 如对象后续完成，应新增 `completed` 快照，而不是回写覆盖 `submitted` 快照。
3. 若中间经历更多状态，可继续按 `objectId.<status>.json` 追加快照。

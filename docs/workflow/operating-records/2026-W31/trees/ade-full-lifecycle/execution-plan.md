# ADE 全生命周期周工作平面执行计划

版本：V1.0
日期：2026-08-07
状态：完整方案 FREEZE；范围确认进行中；实施未启动

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W31/trees/ade-full-lifecycle/execution-plan.md
- syncMode: audit-record
- lastSyncedAt: 2026-08-07

## 1. 当前结论

- 完整 ADE 全生命周期目标保留。
- CPO / CTO 已完成 TriLC 实码审计。
- 完整 ADE、双域同步和 Trees projector 当前 `FREEZE`。
- 当前仅允许记录任务并请求 CEO 确认 Phase -1、Phase 0-2 local-first 范围。
- 未完成范围确认和 P0 前，不创建完整 ADE TriDev run，不写成已开工。

## 2. 当前基线

| 项目 | 当前事实 |
| --- | --- |
| 项目真源同步 DCE | `source_publish_check --project-docs` 已实现，43/43 tests |
| TriLC 类型检查 | `npm run check` 通过 |
| TriLC 全量测试 | 197 tests / 195 pass / 2 TUI fail |
| TriLC ADE runtime | 未实现 |
| TriMC ADE runtime | 未实现 |
| Trees v0.4 | 公司协议已建立；项目 runtime projector 未实现 |
| 当前 ADE run | 不存在；本树是组织任务计划，不是 ADE run |

## 3. 任务计划

| 阶段 | 当前状态 | 核心产物 | 硬门禁 |
| --- | --- | --- | --- |
| 范围确认 | `in_progress` | CEO 对 Phase -1、Phase 0-2 的范围裁决 | 未确认不得开工 |
| Phase -1 | `pending` | TriLC P0 权限、Agent API、cron、event producer、测试、Trees validator 修复 | typecheck/tests 全绿；生产链证据 |
| Phase 0 | `pending` | `agent-core` ADE contracts、schema、状态机和测试向量 | 非法转换、重复事件、旧 epoch 全拦截 |
| Phase 1 | `pending` | 共享 orchestrator、Skill runner、DCE registry、Close finalizer、recovery policy | Close Skill 前不能终态 |
| Phase 2 | `pending` | TriLC SQLite 单定义 durable MVP | DCE 前后 kill 均恢复且不重复副作用 |
| Phase 3 | `pending` | TriMC PostgreSQL service parity | SQLite/PostgreSQL conformance |
| Phase 4 | `pending` | 双域 authority sync | 网络分区无双写；旧 epoch 拒绝 |
| Phase 5 | `pending` | Trees projector 与项目 adapter | APPROVED 才能投影 node done |
| Phase 6 | `pending` | backup/restore、DLQ、metrics、chaos、部署回滚 | 生产恢复矩阵全绿 |

## 4. 相关真源

1. `TriCompany/docs/engineering/ade-pattern-spec.md`
2. `TriCompany/docs/engineering/ade-lifecycle-industry-review.md`
3. `TriCompany/docs/engineering/ade-full-lifecycle-implementation-plan.md`
4. `TriCompany/docs/engineering/ade-trilc-current-gap-assessment.md`
5. `TriCompany/docs/engineering/trilc-trimc-runtime-parity.md`
6. `TriCompany/docs/workflow/dynamic-task-tree-protocol.md`
7. `TriCompany/docs/workflow/project-source-document-sync-ade.md`
8. `TriMetaverse/docs/workflow/dynamic-task-tree-protocol.md`（项目摘要）

## 5. 当前阻塞

- CEO 首期范围未确认。
- TriLC P0 未关闭。
- Trees v0.4 CAO 治理补签未完成。
- 完整 ADE TriDev run 未创建。

## 6. 更新纪律

- 每个阶段只有在真实代码、测试、运行或部署证据存在时才能转 `done`。
- 阶段获批后，由 CEOChiefOfStaff 创建对应实施子树；本主树只维护阶段 Gate。
- ADE 内部状态不写入 tree node；未来只通过 `ade_run_id` 和终态 evidence 投影。
- 当前节点固定为 `ade-life-1`，直到 CEO 范围裁决完成。

# core-agent 到 TriMC 迁移清单

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/core-agent-to-trimc-migration-checklist.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

## 1. 迁移结论

core-agent 不应整体视为 TriMC 主控本体。

更准确的定位是：

- core-agent 是服务域 observability and replay 子系统脚手架。
- TriMC 是服务域主控本体。
- 因此应采用“能力吸收”而不是“仓库整体替代”。

## 2. 建议迁入 TriMC 的模块

优先迁入：

- `observabilityMapper.js` -> `TriMC/src/observability/mapper.ts`
- `timelineReplayApi.js` -> `TriMC/src/observability/timelineReplayApi.ts`
- `postgresClient.js` -> `TriMC/src/observability/postgresClient.ts`
- `timelineReplaySqlStores.js` -> `TriMC/src/observability/timelineReplaySqlStores.ts`
- `timelineReplaySqlRuntime.js` -> `TriMC/src/observability/runtime.ts`

后续再迁：

- contract samples
- benchmark summary
- weekly report template
- acceptance and benchmark scripts
- test suites

## 3. 不建议直接迁入 TriMC 主控核心的内容

以下内容不应误判成主控核心：

- observability event mapping
- timeline query
- replay start or stop
- SQL event store baseline

这些是 TriMC 的支撑子系统，不是任务编排、节点调度、审批门禁本身。

## 4. TriMC 内的建议落位

- `src/task-controller/` 继续放任务状态机和编排
- `src/node-bridge/` 继续放节点派发和 OpenClaw 桥接
- `src/policy-gate/` 继续放审批与风险门禁
- `src/observability/` 放 core-agent 迁入的事件映射、timeline、replay、sql runtime

## 5. 迁移顺序

1. 先迁 observability 运行时骨架
2. 再迁 SQL store 和 postgres client
3. 再迁 contract sample 和 benchmark 脚本
4. 最后迁测试并重命名环境变量前缀

## 6. 环境变量重命名建议

从：

- `CORE_AGENT_DATABASE_URL`
- `CORE_AGENT_EVENTS_TABLE`
- `CORE_AGENT_REPLAY_TABLE`

改为：

- `TRIMC_DATABASE_URL`
- `TRIMC_EVENTS_TABLE`
- `TRIMC_REPLAY_TABLE`

## 7. 仓库策略建议

建议短期内：

- 保留 `core-agent` 作为实验和 benchmark 仓库
- 在 TriMC 中吸收稳定能力

建议中期：

- TriMC 成为生产主路径
- core-agent 只保留原型验证和性能验收职责

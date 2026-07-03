# SQL Migration And Index Strategy

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/contracts/sql-migration-index-strategy.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse SQL 迁移与索引策略的本地协议真源，用于定义迁移顺序、索引策略和数据生命周期约束；它不是 TriCompany 公司级 workflow 或产品真源。

## 1. Migration Order

建议按下面顺序执行：

1. 先执行 [001_tristaciss_platform_init.sql](migrations/001_tristaciss_platform_init.sql)
2. 再执行 [002_trimc_controller_init.sql](migrations/002_trimc_controller_init.sql)

原因：

- TriStaciss 先提供模型转接和任务入口能力。
- TriMC 再接管节点、执行、审计、收益真相源。
- 入口先落库，有利于后续回放和补偿。

## 2. TriStaciss 索引策略

核心目标：

- 让 tag plus modelTag 路由查询稳定命中。
- 让 requestId、traceId 和 ingressId 能快速回溯。
- 让任务入口列表页按状态和时间查询稳定。

关键索引：

- tmv_model_route(tag, model_tag)
- tmv_model_route(provider_account_id, enabled, priority)
- tmv_api_request_log(request_id)
- tmv_api_request_log(trace_id)
- tmv_task_ingress(status, created_at desc)
- tmv_task_ingress(creator_user_id, created_at desc)
- tmv_user_ingress_log(trace_id, created_at desc)

## 3. TriMC 索引策略

核心目标：

- 快速找到可调度节点。
- 快速定位某任务的 offer、execution、artifact。
- 快速回查审计和奖励流水。

关键索引：

- tmv_node_registry(state, active_flag, consent_status)
- tmv_node_registry(owner_user_id)
- tmv_node_lease(status, lease_expires_at)
- tmv_task(status, created_at desc)
- tmv_task(creator_user_id, created_at desc)
- tmv_task_offer(target_node_id, offer_status, offered_at desc)
- tmv_task_execution(task_id, node_id)
- tmv_task_execution(execution_status, updated_at desc)
- tmv_audit_event(aggregate_type, aggregate_id, created_at desc)
- tmv_reward_ledger(subject_type, subject_id, created_at desc)

## 4. 后续迁移建议

阶段 2 以后，建议拆出增量迁移：

1. 节点信誉与评分表
2. 服务域主控租约与选主历史表
3. 用户钱包多链绑定表
4. 结算批次明细表
5. 大体积审计归档表 or 分区表

## 5. 数据生命周期建议

- tmv_api_request_log 和 tmv_audit_event 建议按月归档。
- tmv_task_artifact 只存索引，不存大对象正文。
- tmv_reward_ledger 和 tmv_settlement_batch 作为财务类数据，优先保留长期历史。

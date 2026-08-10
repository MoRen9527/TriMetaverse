<!-- markdownlint-disable MD032 -->

# Observability Event Mapping v1 对齐报告（R02）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/contracts/observability-event-mapping-v1-alignment-R02.md
- syncMode: audit-record
- lastSyncedAt: 2026-06-04

更新时间：2026-03-01
执行轮次：R02
对齐对象：
- 契约文档：`docs/contracts/observability-event-mapping.md`
- 样例包：`d:/Code/ai/TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)/samples/observability-event-samples.v1.json`
- 映射实现：`d:/Code/ai/TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)/src/observabilityMapper.js`

---

## 1) 结论摘要

- 结论：`字段级对齐通过`（统一模型必需字段已全部满足）。
- 结论：`核心事件覆盖满足 DoD`（样例包覆盖 >= 8 类核心事件，当前为 10+ 类含 fallback）。
- 结论：`契约口径已收敛`（第 3 节枚举与第 4 节映射规则已对齐）。

---

## 2) 字段级对照（统一事件模型）

统一模型字段：
- `schemaVersion` ✅
- `eventId` ✅
- `traceId` ✅
- `sessionId` ✅
- `timestamp` ✅
- `source` ✅（gateway/serverbus/localbus/eventstore）
- `eventType` ✅
- `actor` ✅（type/id）
- `status` ✅
- `severity` ✅
- `payload` ✅
- `links` ✅（parentEventId/relatedToolCallId）

说明：样例包 11 条事件均具备上述字段。

---

## 3) 事件映射覆盖对照

已覆盖（样例包中出现）：
- `session.state.changed`
- `tool.call.started`
- `tool.call.finished`
- `approval.requested`
- `subagent.spawned`
- `subagent.finished`
- `message.chunk`
- `message.final`
- `replay.state.changed`
- `error`

当前样例包已覆盖：
- `approval.resolved`（来自 `approval.request.resolved`）

---

## 4) Gap 与处理建议（收敛结果）

### Gap-01（契约文档内部不一致）

现象：
- 第 3 节统一模型 `eventType` 枚举未包含 `replay.state.changed` 和 `approval.resolved`。
- 第 4 节映射规则明确出现了：
  - `replay.started/replay.finished -> replay.state.changed`
  - `approval.request.resolved -> approval.resolved`

影响：
- 已消除（文档第 3 节枚举已更新）。

处理结果：
- 已采用建议 A：第 3 节 `eventType` 已加入 `replay.state.changed|approval.resolved`。
- 同时样例包已补齐 `approval.request.resolved -> approval.resolved`，实现/契约/样例三者一致。

---

## 5) R02 执行结论（#17 维度）

- #17 样例包生成与字段级对照已完成。
- 契约文档口径已收敛，且 `approval.resolved` 样例已补齐。
- 当前可进入下一步：推进 #18 与 Phase3 可视化接入，不再受 #17 契约阻塞。

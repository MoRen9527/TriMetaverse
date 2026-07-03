# Observability Event Mapping Contract（VibeCraft-inspired）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/contracts/observability-event-mapping.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse observability 事件映射协议的本地真源，用于定义统一事件模型与映射规则；它不是 TriCompany 公司级 workflow 或产品真源。

更新时间：2026-03-01

## 1. 目标与边界

- 目标：将 `Gateway`、`ToolBus`、`EventStore` 的审计事件映射为统一的 3D 场景/时间线事件模型。
- 目标：支持 `实时态势`、`时间线回放`、`子代理可视化`、`培训复盘`。
- 边界：Observability 只读消费事件，不直接触发工具执行，不绕过审批与策略。

---

## 2. 数据流

1. 事件源产生原始审计事件（Server/Local）。
2. `Observability Bridge` 订阅并规范化事件。
3. 规范化事件写入 `eventstore`（可选缓存）并推送至 `3D Agent Observatory UI`。
4. UI 按 session / trace 渲染 scene、timeline、subagent 关系。

---

## 3. 统一事件模型

```json
{
  "schemaVersion": "v1",
  "eventId": "evt_01...",
  "traceId": "trc_01...",
  "sessionId": "ses_01...",
  "timestamp": "2026-02-27T12:34:56.789Z",
  "source": "gateway|serverbus|localbus|eventstore",
  "eventType": "session.state.changed|tool.call.started|tool.call.finished|approval.requested|approval.resolved|subagent.spawned|subagent.finished|message.chunk|message.final|replay.state.changed|error",
  "actor": {
    "type": "user|agent|subagent|system",
    "id": "agent.main"
  },
  "status": "idle|working|waiting|blocked|done|failed",
  "severity": "info|warn|error",
  "payload": {},
  "links": {
    "parentEventId": "evt_parent",
    "relatedToolCallId": "tool_123"
  }
}
```

---

## 4. 源事件映射规则

## 4.1 Gateway

- `session.opened` -> `session.state.changed(status=working)`
- `session.closed` -> `session.state.changed(status=done)`
- `message.stream.chunk` -> `message.chunk`
- `message.stream.final` -> `message.final`

## 4.2 Server/Local ToolBus

- `tool.call.requested` -> `tool.call.started`
- `tool.call.succeeded` -> `tool.call.finished(status=done)`
- `tool.call.failed` -> `tool.call.finished(status=failed,severity=error)`
- `approval.request.created` -> `approval.requested(status=waiting)`
- `approval.request.resolved` -> `approval.resolved`

## 4.3 Agent Loop / Subagent

- `subagent.spawn` -> `subagent.spawned`
- `subagent.complete` -> `subagent.finished(status=done)`
- `subagent.error` -> `subagent.finished(status=failed,severity=error)`

## 4.4 EventStore Replay

- `replay.started` -> `replay.state.changed(status=working)`
- `replay.finished` -> `replay.state.changed(status=done)`

---

## 5. UI 渲染约束

- Scene 仅展示当前 session 的最新状态快照。
- Timeline 必须按 `timestamp,eventId` 稳定排序。
- Subagent 关系通过 `links.parentEventId` 构建树。
- Error 事件默认高亮，且可跳转原始审计记录。

---

## 6. 幂等与一致性

- 幂等键：`eventId`。
- 重放去重：同一 `eventId` 重复到达时只保留第一条，累计 `duplicateCount`。
- 乱序容忍：允许延迟窗口 `<= 5s`；超窗事件仍入库但标记 `late=true`。

---

## 7. 安全与权限

- Observability UI 不提供工具执行入口。
- 默认脱敏字段：token、apiKey、cookie、authorization。
- 跨租户隔离：查询必须带 `tenantId`，服务端二次校验。

---

## 8. 验收（DoD）

- 能从审计源稳定映射至少 8 类核心事件。
- 单会话回放与在线视图一致性 >= 99%。
- 断线重连后 10 秒内恢复最新场景状态。

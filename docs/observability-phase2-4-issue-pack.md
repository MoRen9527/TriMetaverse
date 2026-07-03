<!-- markdownlint-disable MD022 MD024 MD031 MD032 -->

# Observability（VibeCraft-inspired）Phase 2/3/4 Issue 包

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/observability-phase2-4-issue-pack.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse observability Phase 2/3/4 issue 包的本地真源，用于维护当前阶段的 issue 文本包与执行拆解；它不是 TriCompany 公司级 workflow 或产品真源。

更新时间：2026-02-27
依赖文档：
- `docs/refactor-master-plan-socialfi-TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)-tristaciss.md`
- `docs/vibecraft-integration-3d-agent.md`
- `docs/contracts/observability-event-mapping.md`

---

## Epic O2（Phase 2）

### Title
`[Epic][Phase2][Observability] 事件桥接与基础时间线上线`

### Labels
`type: epic`, `area: observability`, `priority: P1`, `stage: dev`

### Body
```md
## 目标
完成 Observability Bridge 最小落地，将审计事件转为统一模型并驱动基础 timeline。

## 子任务
- [ ] O2-1 实现 bridge 事件适配器（gateway/serverbus/localbus）
- [ ] O2-2 落地 v1 映射契约校验
- [ ] O2-3 实现 timeline API（按 session/trace 查询）
- [ ] O2-4 构建基础 UI 时间线（无 3D 场景）

## DoD
- [ ] 8 类核心事件映射成功
- [ ] timeline 查询稳定，排序正确
- [ ] 审计字段脱敏规则生效
```

---

## Issue O2-1

### Title
`[Phase2][Bridge] 实现审计事件 -> 统一观测事件适配器`

### Labels
`type: task`, `area: observability`, `priority: P1`, `stage: dev`

### Body
```md
## 任务
- [ ] 订阅 gateway/serverbus/localbus 事件源
- [ ] 输出统一字段：eventId/traceId/sessionId/eventType/status
- [ ] 增加 late-event 与 duplicate 标记

## 验收
- 单会话下事件丢失率 < 0.5%
```

---

## Issue O2-2

### Title
`[Phase2][Contract] 接入 observability-event-mapping v1 契约校验`

### Labels
`type: task`, `area: contracts`, `priority: P1`, `stage: dev`

### Body
```md
## 任务
- [ ] 按 `docs/contracts/observability-event-mapping.md` 做 schema 校验
- [ ] 对不合法事件打审计告警并隔离

## 验收
- 非法事件不进入主 timeline
```

---

## Issue O2-3

### Title
`[Phase2][API] 提供 timeline/replay 查询接口（session/trace）`

### Labels
`type: task`, `area: api`, `priority: P1`, `stage: dev`

### Body
```md
## 任务
- [ ] 提供按 sessionId 查询时间线
- [ ] 提供按 traceId 过滤与分页
- [ ] 提供 replay 启停接口

## 验收
- P95 查询延迟满足目标（由团队填充阈值）
```

---

## Epic O3（Phase 3）

### Title
`[Epic][Phase3][Observability] 3D 场景与子代理可视化接入`

### Labels
`type: epic`, `area: observability`, `priority: P1`, `stage: dev`

### Body
```md
## 目标
将统一事件驱动到 3D 场景，展示主代理与子代理状态、工具调用和审批等待。

## 子任务
- [ ] O3-1 3D scene 状态机（idle/working/waiting/failed）
- [ ] O3-2 subagent 关系树渲染
- [ ] O3-3 approval/tool call 高亮联动
- [ ] O3-4 回放控制（play/pause/scrub）

## DoD
- [ ] 线上态与回放态渲染一致性 >= 99%
- [ ] 子代理链路可追溯到父事件
```

---

## Issue O3-2

### Title
`[Phase3][UI] 子代理关系树与事件跳转`

### Labels
`type: task`, `area: ui`, `priority: P1`, `stage: dev`

### Body
```md
## 任务
- [ ] 按 parentEventId 构建子代理树
- [ ] 支持从树节点跳转 timeline 定位事件
- [ ] 错误节点默认高亮

## 验收
- 任一子代理节点 1 次点击可定位到对应事件
```

---

## Epic O4（Phase 4）

### Title
`[Epic][Phase4][Observability] 培训复盘与运维可解释收口`

### Labels
`type: epic`, `area: observability`, `priority: P1`, `stage: harden`

### Body
```md
## 目标
形成可培训、可复盘、可运维的解释闭环，并纳入生产值守手册。

## 子任务
- [ ] O4-1 会话复盘模板（输入->决策->工具->结果）
- [ ] O4-2 异常会话自动聚类与标签
- [ ] O4-3 runbook 接入 observability 排障步骤
- [ ] O4-4 可靠性与容量基线测试

## DoD
- [ ] 值守手册可独立完成一次故障复盘
- [ ] 关键视图 7x24 稳定可用
```

---

## 建议执行顺序

1. O2-1 -> O2-2 -> O2-3
2. O3-1/O3-2 并行，O3-3/O3-4 收口
3. O4-1/O4-3 先行，O4-2/O4-4 增强

---

## 建议标签集

- `type: epic|task`
- `area: observability|contracts|api|ui`
- `priority: P1`
- `stage: dev|harden`

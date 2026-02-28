# 3D 模块策略：VibeCraft + AgentSims（统一模块，双子模式）

更新时间：2026-02-28
相关参考：
- `reference/vibecraft/`（pinned `8278a4b`）
- `reference/AgentSims/`（pinned `52b3adb`）
总框架基线：`docs/architecture-overall-unified.mmd`

---

## 1. 结论（先给决策）

采用 **一个 3D 模块**，内部拆成 **两个子模式**，而不是两套独立系统：

1. `Ops Observatory Mode`（VibeCraft-inspired）
   - 面向：线上运行维护 / 可解释回放
   - 重点：session 状态、tool timeline、subagent 可视化、异常定位

2. `Simulation Training/Eval Mode`（AgentSims-inspired）
  - 面向：任务仿真 / AI 培训 / 评估实验
  - 重点：Tick 循环、agent plan-act-use-critic 链、评测问答与得分

两种模式共享同一事件底座（eventstore + observability bridge），仅在 UI 与指标层分视图。

---

## 2. 为什么不拆成两个独立 3D 系统

- 若拆两套：会出现双采集、双存储、双权限、双回放语义，维护成本高。
- 统一底座可保证“同一会话”在运维与培训两个视角下可一致追踪。
- 你当前架构已经有 ToolBus + 审计链，天然适合挂统一观测桥，不需要重复造轮子。

---

## 3. 能力映射（来源 -> 我们模块）

### 3.1 VibeCraft 提供

- hooks 事件流、会话状态、子代理可视化、timeline/replay
- 映射到：`Ops Observatory Mode`

### 3.2 AgentSims 提供

- 仿真小镇 Tick 驱动、plan/act/use/critic 循环、评估任务机制
- 映射到：`Simulation Training/Eval Mode`

---

## 4. 统一事件底座建议

统一事件模型建议包含：

- `eventType`: `session|tool|approval|subagent|sim.tick|sim.eval|error`
- `status`: `idle|working|waiting|done|failed`
- `trace/session`: `traceId`, `sessionId`, `simRunId`
- `links`: `parentEventId`, `relatedToolCallId`

其中：

- `sim.*` 事件仅在训练/评测模式强展示；
- `tool/session` 事件在两模式共享展示。

---

## 5. 实施顺序（建议）

1. 先落地统一 bridge 与 schema（不做重 UI）
2. 先上线 Ops 模式（可直接服务维护）
3. 再接入 Simulation Training/Eval 模式（Tick/评估面板）
4. 最后做培训回放模板（案例库 + 讲解层）

---

## 6. 风险与防线

- 风险：仿真高频事件冲击线上观测性能
  - 防线：bridge 分流 + 采样 + 限流队列
- 风险：仿真数据与真实会话混淆
  - 防线：强制 `mode=ops|sim` + `simRunId` 隔离
- 风险：UI 过度耦合业务执行
  - 防线：观测层只读，不提供绕过 ToolBus 的执行入口

---

## 7. 与当前文档关系

- 总体架构：`docs/architecture-overall-unified.mmd`
- 主计划映射：`docs/refactor-master-plan-socialfi-core-agent-tristaciss.md`
- Vibecraft 专题：`docs/vibecraft-integration-3d-agent.md`
- 本文档：补充“VibeCraft + AgentSims 的组合决策与实施边界”。

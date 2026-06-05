# Vibecraft 融合方案（面向 3D Agent 可观测、培训、可解释维护）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/vibecraft-integration-3d-agent.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

更新时间：2026-02-27
参考项目：`reference/vibecraft`（Nearcyan/vibecraft，pinned: `8278a4b`）

框架基线：整体架构以 `docs/architecture-overall-unified.mmd` 为唯一真源；本文件是 observability 融合专题拆解。

---

## 1. 为什么引入 Vibecraft 能力

Vibecraft 的可复用价值不在“Claude 专用壳”，而在三类基础能力：

1. **实时会话状态观测**：`idle/working/waiting/offline` + 当前工具 + 事件时间线。  
2. **3D 语义可视化**：工具行为映射到空间工位（可解释“AI 正在做什么”）。  
3. **多会话/子代理管理**：主代理与 subagent 的并行关系可视、可回放、可定位。  

对应我们现状：
- 你已有 `Server/Local` 双域、`ToolBus` 强制、副作用审计。  
- 缺的是“面向人（培训/运维）的可解释观测层”。  

---

## 2. 与现有三层架构的映射

### 2.1 现有三层（不变）

- `SocialFi`：渠道接入与回包。  
- `Core-Agent`：会话编排与执行主控。  
- `TriStaciss`：唯一 LLM 出口。  

### 2.2 新增观测层（新增）

新增 **VibeCraft-inspired Observability**，由两部分构成：

1. **Observability Bridge（Server）**  
   - 输入：`gateway/serverbus/localbus/eventstore` 事件流。  
   - 处理：把底层审计事件归一化为“3D 场景事件模型”。  
   - 输出：给本地 UI 的实时推送与历史回放 API。  

2. **3D Agent Observatory UI（Local）**  
   - 展示：会话区、状态灯、工具轨迹、子代理拓扑、时间线。  
   - 交互：过滤、定位、回放、异常追踪。  
   - 目标：培训演示 + 线上排障 + 运维交接。

   3. **Display/Approval Sync Hub（Server）**  
      - 目标：统一承载显示态与审批态，保证服务侧三端一致。  
      - 三端范围：`Webview UI`、`APP/小程序`、`Web 前端（avatar-react）`。  
      - 同步方式：版本化状态 + 流式推送（WebSocket/Stream），以服务侧为单一真源。  
      - 本地策略：本地侧遵循“尽量一致”，允许短暂延迟，最终与服务侧对齐。

> 关键原则：**不把业务逻辑放进 3D UI**，UI 只消费审计和状态，不反向改写主控决策。

---

## 3. 事件模型拆解（从 Vibecraft 到本项目）

Vibecraft 常见事件（如 pre/post tool、stop、prompt、permission）可映射为我们统一事件面：

- `pre_tool_use` -> `ToolCallEnvelope.started`  
- `post_tool_use` -> `ToolCallEnvelope.finished`  
- `permission_prompt/resolved` -> `ApprovalRequest` + `AuditEnvelope`  
- `session_update` -> `SessionEnvelope.stateChanged`  
- `stop` -> `SessionEnvelope.stopped`（区分 `Safe` / `Force`）

建议新增一份映射契约：
- `docs/contracts/observability-event-mapping.md`

---

## 4. 对 AI 培训与可维护性的直接增益

1. **培训**：新人能看到“提示词 -> 工具调用 -> 结果”的完整路径。  
2. **可解释**：失败点可定位到“哪一步、哪工具、哪次审批”。  
3. **可维护**：通过回放与时间线对比，复盘回归问题和策略漂移。  
4. **可运营**：多会话健康态统一面板，便于值守与交接班。

---

## 5. 实施分期（最小可落地）

### Phase A（1 周）观测骨架
- 建 `Observability Bridge`（只接 `eventstore` 回放 + 实时订阅）。
- 打通最小 UI：会话列表、状态、工具时间线。

### Phase B（1-2 周）3D 可解释视图
- 增加工位映射（Read/Edit/Bash/Web/Task/Todo）。
- 增加子代理可视化、异常高亮、注意力机制。

### Phase C（1 周）培训与运维模式
- 增加回放模式（按 sessionId / traceId / 时间窗）。
- 增加“培训解说层”（关键步骤注释、错误原因标签）。

---

## 6. 风险与约束

1. **隐私与数据最小化**：默认只传摘要，不传敏感全文。  
2. **性能开销**：Bridge 做采样与聚合，避免高频事件拖慢主链路。  
3. **一致性**：以 `eventstore` 为真相源，UI 本地状态可丢可重建。  
4. **边界清晰**：观测层不能绕过 ToolBus 或审批链。
5. **三端一致性**：显示态与审批态以服务侧 Hub 为准，避免端侧各自维护真相源。
6. **本地最终一致**：本地 Webview 允许短暂缓存/离线态，但必须可重放并回到服务侧版本。

---

## 7. 建议新增任务（可直接转 Issue）

1. `[Observability] 建立 Bridge 事件归一化管道`  
2. `[Observability] 定义 3D 场景事件契约（tool/session/subagent）`  
3. `[3D Agent UI] 会话状态+时间线 MVP`  
4. `[3D Agent UI] 子代理可视化与异常高亮`  
5. `[Training] 回放与讲解模式（session replay）`

---

## 8. 结论

`vibecraft` 适合作为我们“**可观测 + 可解释 + 可培训**”能力的参考基座。  
建议采用“**Bridge（服务端）+ Observatory UI（本地）**”双组件接入方式，嵌入现有双域架构，不改变 `SocialFi / Core-Agent / TriStaciss` 主职责边界。
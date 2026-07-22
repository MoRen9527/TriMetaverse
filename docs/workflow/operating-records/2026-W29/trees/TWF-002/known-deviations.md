# TriCade 已知偏差清单 (Known Deviations)

> **版本**：TriCade v0.1.0  
> **日期**：2026-07-19  
> **状态**：W29 阶段性交付附带文档  
> **上游裁决**：CPO Q1-Q6 裁决（2026-07-19），Q5 FREEZE — W29 TriCade 收口 + W30 架构修正

---

TriCade 是 PC 端四模块（TriPilot + TriLC + TriCode + VSCodium）的首个集成交付物。以下偏差是**已知且已登记**的技术债务，将在 W30 架构修正中系统性消除。

| # | 偏差 | 架构文档要求 | 当前行为 | 影响 | W30 修正目标 |
|---|------|------------|---------|------|-------------|
| **D1** | **TriPilot 本地执行工具调用** | TriPilot 零执行能力，全部委托 TriLC（Q1） | `extension.ts` L5995：`executeToolCall()` 在 VS Code 扩展进程内本地执行 | 关闭 IDE = 工具调用中断、安全策略不可控 | 移除 `executeToolCall()`，工具调用请求全量通过 `POST /tasks/submit` 发 TriLC |
| **D2** | **IDE 关闭 = 任务终止** | TriLC daemon 管理任务生命周期，IDE/CLI 关闭不终止（Q1+Q4） | 任务生命周期绑定 VS Code 扩展进程，关闭 IDE 即杀死所有运行中任务 | 长任务不可靠，用户体验差 | TriLC daemon 接管 `submitTask()`，TriPilot 只做显示+交互 |
| **D3** | **TriPilot↔TriLC 协议仅覆盖 LLM streaming** | SSE + HTTP 分层协议 5 端点（Q2） | 仅 Anthropic SSE `/v1/messages` 用于 LLM 流；无任务提交、会话列表、取消端点 | 工具调用状态不可追踪，会话不可管理 | 新增 4 端点（tasks/submit、sessions、sessions/{id}/stream、sessions/{id}/cancel） |
| **D4** | **TriCode 为 TriPilot 直接依赖** | TriCode 为 TriLC 研发子工具，TriPilot 不感知（Q3） | `tricodeBridge.ts` 面向 CLI，未入 webview 路径；但旧语义"TriPilot 插件"残留 | 架构不清洁，入口层不应感知 adapter 选择 | 移除 `tricodeBridge.ts`，TriCode 接口改为 TriLC daemon 子进程调用 |
| **D5** | **无会话自动恢复** | IDE 重启时自动重连活跃会话（Q4） | 无自动重连；关闭 IDE 后会话状态丢失 | 用户需手动重建上下文 | 实现 `GET /sessions` + `POST /sessions/recover` 自动重连流程 |
| **D6** | **TriPilot 持有直接 API 调用** | TriPilot 不持有任何 API Key 或直接调用模型端点（Q2） | `runTrilcDirectRequest()` 直连 Anthropic SSE | API Key 暴露面扩大 | 所有 LLM 调用通过 TriLC 代理，TriPilot 零 API Key |
| **D7** | **无跨节点任务状态同步** | TriLC 上报 TriMC 统一状态中心（Q6） | 无 TriLC→TriMC 任务镜像 | 移动端/Web 入口不可见本地任务 | W30 P1：实现 `POST /internal/v1/tasks/mirror` |

---

## 不影响交付的说明

- 以上偏差不阻止 TriCade 作为**可演示交付物**使用。TriPilot webview → TriLC LLM streaming → Anthropic 模型响应的基本链路完全可用。
- TriCade 的 MSI 打包、VSCodium 扩展加载、TriPilot 聊天 UI 均正常工作。
- 偏差修复不改变外部 API 契约，用户侧升级无感知。

---

**文档维护**：CTO（小狄）  
**下次审查**：W30 架构修正启动时对照此清单逐项关闭

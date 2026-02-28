# 总重构计划（SocialFi + Core-Agent + Tristaciss）

更新时间：2026-02-27

基于：
- `arch-storage-migration.md`（双域执行、ToolBus 强制、审批与审计、存储生命周期）
- `architecture-overall-unified.mmd`（整体框架唯一真源）
- `architecture-socialfi-core-agent-tristaciss.md`（目标模块映射）

框架约束：
- 文档与评审均以 `docs/architecture-overall-unified.mmd` 为整体框架基线。
- 其他图（含模块图/专题图）均为派生视图，不得与总图语义冲突。

---

## 1. 重构目标与边界

### 1.1 目标

1. 将渠道接入能力收敛为独立 `SocialFi` 模块（Telegram/Discord/Slack 等）。
2. 以 `Kode-Agent` 为参考重写 24x7 主控，形成 `Core-Agent` 模块（Gateway/Runner/Loop）。
3. 将模型调用统一收敛至 `Tristaciss`（唯一 LLM API 出口）。
4. 保持 `Server domain / Local domain` 双域架构，继续执行 ToolBus 强制与全链路审计。
5. 在不破坏现有门禁与协作流程的前提下完成可回滚迁移。
6. 新增统一 3D 观测层：`VibeCraft-inspired`（运维观测）+ `AgentSims-inspired`（任务仿真监控），共享同一事件底座，支持 AI 培训与可解释维护。

### 1.2 非目标（本阶段不做）

- 不做一次性全量重写，不中断现有生产链路。
- 不引入未经审批的新发布通道和新账号体系。
- 不改变现有 Git 治理基线（多仓 + 元仓 + 巡检脚本）。

---

## 2. 目标架构映射（最终态）

## 2.1 模块映射

- `You + channel adapter` → `SocialFi`
- `Gateway Server + Session Router + Lane Queue + Agent Runner + Agentic Loop` → `Core-Agent`
- `LLM API / Provider Routing / Streaming/Fallback` → `Tristaciss`
- `Audit/ToolBus/Simulation events -> 3D scene/timeline/replay/monitor` → `Observability（VibeCraft + AgentSims inspired）`

## 2.2 模块职责

### SocialFi（新增，同级目录）

- 负责：渠道协议适配、消息标准化、附件提取、身份映射、渠道回包。
- 不负责：模型路由、会话编排、工具执行策略。

### Core-Agent（新增，同级目录）

- 负责：会话入口与路由、并发队列、Prompt 构建、History/Context Guard、Agentic Loop、Tool 调度。
- 依赖：`Tristaciss` 提供统一 LLM 能力；Server/Local ToolBus 执行副作用工具。

### Tristaciss（现有）

- 负责：统一鉴权、模型路由、限流、流式输出、fallback、provider 管理。
- 不感知：渠道私有协议与前端 UI 状态。

---

## 3. 仓库与目录落位

按“与 `Tripilot` 同级”执行：

- `TriMetaverse/socialFi/`（新）
- `TriMetaverse/core-agent/`（新）
- `Tristaciss/`（复用现有仓）
- `Tripilot/`（复用现有作为本地执行/桥接与工具链入口）

参考代码（已纳入）：

- `reference/openclaw/`
- `reference/Kode-Agent/`
- `reference/vibecraft/`
- `reference/AgentSims/`

---

## 4. 分阶段执行计划（Phase 0 ~ Phase 4）

## Phase 0：基线冻结与契约定义（1 周）

### 目标

- 冻结现状能力边界，先定接口再迁移实现。

### 任务

1. 定义统一事件契约（`MessageEnvelope` / `SessionEnvelope` / `ToolCallEnvelope` / `AuditEnvelope`）。
2. 定义 `Core-Agent -> Tristaciss` 的 LLM 调用契约（请求/流式响应/错误码/fallback 语义）。
3. 定义 `SocialFi -> Core-Agent` 的输入契约与 `Core-Agent -> SocialFi` 的回包契约。
4. 对齐审批与 lease 语义：`Safe Stop` / `Force Stop` / `leaderEpoch` fencing。

### 交付物

- `docs/contracts/*.md`（新增）
- `docs/architecture-overall-unified.mmd`（已完成）

### 门禁（DoD）

- 契约评审通过（至少 1 次跨仓评审记录）。

---

## Phase 1：Core-Agent 最小可运行骨架（2 周）

### 目标

- 先让主控跑起来，具备最小“收消息 -> 路由 -> 调 LLM -> 回文本”的闭环。

### 任务

1. 创建 `core-agent` 项目骨架：
   - `gateway/`
   - `router-queue/`
   - `runner/`
   - `runtime/`
2. 接入最小 Agentic Loop（仅文本、无复杂工具链）。
3. 接入 `Tristaciss` 作为唯一 LLM 出口（禁直连 provider）。
4. 接入 `AuditEvent` 基础写入（请求/响应/错误）。

### 交付物

- `core-agent` MVP（CLI/API 可触发会话）
- 最小联调脚本（单会话 smoke）

### 门禁（DoD）

- 单会话端到端成功率 >= 95%（测试集）
- 无直连 provider 违规调用

---

## Phase 2：SocialFi 接入与多渠道回包（2 周）

### 目标

- 将渠道能力从现有流程中剥离，形成独立模块并接入 Core-Agent。

### 任务

1. 建立 `socialFi` 骨架：
   - `adapters/telegram`
   - `adapters/discord`
   - `normalizer/`
   - `response-adapter/`
2. 实现 `channel -> normalized event -> core-agent` 链路。
3. 实现 `core-agent -> stream chunks -> channel` 回包链路。
4. 先上线一个主渠道（建议 Telegram），Discord 次级跟进。

### 交付物

- `socialFi` MVP（至少 1 渠道）
- 渠道消息与附件样例回归集

### 门禁（DoD）

- 渠道到主控延迟 P95 在目标范围内
- 附件提取准确率达到验收阈值

---

## Phase 3：ToolBus 深度整合 + 双域执行（2~3 周）

### 目标

- 完成“控制面与执行面分离”，并保证副作用调用全部走 ToolBus。

### 任务

1. `Core-Agent` 执行链路强制经由 ToolBus（Server/Local）。
2. 接入 `capability lease` + `ApprovalRequest`（first-wins）。
3. 打通 `Safe Stop` / `Force Stop` 与 lease 撤销。
4. 打通服务器热存 -> 本地/NAS 迁移回执链路。

### 交付物

- ToolBus 强制策略清单
- 审批扇出与幂等回执实现
- 迁移流水线 MVP（RequestMigration/ConfirmMigration）

### 门禁（DoD）

- 高影响动作全部可追溯（审计覆盖率 100%）
- Force Stop 后后续副作用调用被拒绝

---

## Phase 4：高可用与生产收口（2 周）

### 目标

- 达到 7x24 稳态运行，具备主备切换能力与可运维性。

### 任务

1. 实现 Orchestrator Active-Standby（lease + epoch fencing）。
2. 增加故障演练：主挂接管、网络抖动、队列积压。
3. 完成三端（Webview/App/CLI）状态一致性校验。
4. 出具 runbook、值守手册、回滚手册。

### 交付物

- HA 设计与演练报告
- 运维手册与应急手册

### 门禁（DoD）

- 故障切换演练通过
- 核心链路无阻断上线

---

## 5. 跨仓任务分配建议

### TriMetaverse（元仓）

- 维护总体架构图、阶段计划、契约文档、runbook、参考索引。

### socialFi（新）

- 渠道接入、标准化、回包、社交事件总线。

### core-agent（新）

- Gateway/Runner/Loop/Queue/Tool Runtime 主控实现。

### Tristaciss（现有）

- LLM API 能力统一、provider 管理、可观测与 fallback。

### Tripilot（现有）

- 本地执行载体、工具链桥接、开发态验证入口。

---

## 6. 质量门禁（沿用 + 新增）

## 6.1 沿用门禁（必须继续）

- `npx tsc --noEmit` 通过。
- alias 门禁：`MISSING=0`、`BAD_ALIAS_TARGETS=0`。
- smoke：`scripts/acceptance/daily-smoke.ps1` 产出证据。
- 主路径：`opencode-acp` 端到端可用。

## 6.2 新增门禁（本次重构）

- LLM 访问仅经 Tristaciss。
- 副作用调用仅经 ToolBus。
- 审批事件幂等且可审计。
- 渠道断线可恢复（重连后状态一致）。

---

## 7. 风险与对策

1. **模块边界漂移**：通过契约先行 + 代码 owner 审核避免串层。
2. **迁移期间双栈复杂度高**：采用“旧链路保留 + 新链路灰度 + 可回滚”。
3. **多渠道状态一致性难**：统一 source-of-truth 在 Orchestrator。
4. **高可用脑裂风险**：lease + leaderEpoch + ToolBus fencing 硬约束。
5. **执行安全风险**：高影响动作强制审批，默认最小权限。

---

## 8. 回滚策略（按阶段）

- Phase 1/2：开关回退到旧入口（保留旧路由）。
- Phase 3：ToolBus 策略支持灰度回退（但审计不可关闭）。
- Phase 4：HA 切换失败时回退单主模式并冻结变更窗口。

回滚原则：
- 回滚不清理审计；
- 回滚后需追加一条 `Incident + Recovery` 记录。

---

## 9. 时间线（建议）

- Phase 0：第 1 周
- Phase 1：第 2-3 周
- Phase 2：第 4-5 周
- Phase 3：第 6-8 周
- Phase 4：第 9-10 周

总计建议：约 10 周（可并行压缩至 8 周，前提是并行团队到位）。

---

## 10. 立即启动清单（本周）

1. 建立 `socialFi/` 与 `core-agent/` 仓位与初始化 README。
2. 输出 4 份核心契约草案（message/session/toolcall/audit）。
3. 打通 `core-agent -> Tristaciss` 最小调用闭环。
4. 选择 Telegram 作为 SocialFi 首接渠道。
5. 开第一个里程碑 Issue：`Phase 0 契约冻结 + Phase 1 MVP`。

---

## 11. 验收标准（总体验收）

满足以下条件即视为重构阶段完成：

- A1：`SocialFi` 与 `Core-Agent`、`Tristaciss` 三层职责清晰且代码边界稳定。
- A2：主链路（渠道消息 -> 主控 -> LLM -> 回包）稳定运行并有审计证据。
- A3：副作用调用全部经 ToolBus 且审批/lease 有效生效。
- A4：Server/Local 双域协同 + 存储迁移链路可用。
- A5：HA 演练通过，具备 7x24 值守能力。

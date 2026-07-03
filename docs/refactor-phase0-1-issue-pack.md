<!-- markdownlint-disable MD022 MD024 MD031 -->

# Phase 0/1 Issue 文本包（可直接粘贴）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/refactor-phase0-1-issue-pack.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse Phase 0/1 重构 issue 文本包的本地真源，用于维护当前阶段的 Epic 和任务拆解文本；它不是 TriCompany 公司级 workflow 或产品真源。

更新时间：2026-02-27  
对应主计划：`docs/refactor-master-plan-socialfi-TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)-tristaciss.md`

---

## 使用方式（5 分钟开工）

1. 先创建 1 张 Epic（Phase 0），再创建其子任务。  
2. 创建 1 张 Epic（Phase 1），再创建其子任务。  
3. 每个 Issue 直接复制本文件对应区块到 GitHub New Issue。  
4. 推荐标签：`type:*` + `area:*` + `priority:*` + `stage:*`。  

---

## Epic A（Phase 0）

### Title
`[Epic][Phase0] 契约先行：冻结边界并完成跨仓接口定义`

### Labels
`type: epic`, `area: architecture`, `priority: P0`, `stage: plan`

### Body
```md
## 背景
根据总重构计划，Phase 0 目标是先定契约再迁移实现，避免模块边界漂移与返工。

## 范围
- Message / Session / ToolCall / Audit 四类事件契约
- TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) -> TriStaciss 调用契约
- SocialFi <-> TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 输入/回包契约
- Safe Stop / Force Stop + lease/fencing 语义对齐

## 子任务
- [ ] P0-1 定义四类基础 Envelope
- [ ] P0-2 定义 TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) -> TriStaciss LLM API 契约
- [ ] P0-3 定义 SocialFi <-> TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 通信契约
- [ ] P0-4 定义停止语义与 lease/fencing 约束

## DoD
- [ ] `docs/contracts/*.md` 初稿齐备
- [ ] 至少一次跨仓评审结论已记录
- [ ] 契约中包含错误码、幂等、审计字段

## 验收标准
- 契约文档可被实现团队直接编码，无关键字段歧义。
```

---

## Issue P0-1

### Title
`[Phase0][Contract] 定义 Message/Session/ToolCall/Audit 四类 Envelope`

### Labels
`type: task`, `area: contracts`, `priority: P0`, `stage: design`

### Body
```md
## 目标
定义统一基础事件模型，作为跨模块唯一交换格式。

## 交付物
- `docs/contracts/message-envelope.md`
- `docs/contracts/session-envelope.md`
- `docs/contracts/toolcall-envelope.md`
- `docs/contracts/audit-envelope.md`

## 任务清单
- [ ] 定义必填字段（id、ts、source、traceId、tenant/session）
- [ ] 定义扩展字段（metadata、attachments、policyContext）
- [ ] 定义版本策略（schemaVersion + 兼容规则）
- [ ] 定义示例 payload（request/response/error）

## DoD
- [ ] 四份文档均含“字段表 + JSON 示例 + 兼容规则”
- [ ] 字段命名在四文档间保持一致

## 验收
- 架构评审可通过该文档直接生成 TypeScript 类型。
```

---

## Issue P0-2

### Title
`[Phase0][Contract] 定义 TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) -> TriStaciss LLM 调用契约`

### Labels
`type: task`, `area: tristaciss`, `priority: P0`, `stage: design`

### Body
```md
## 目标
收敛 LLM 调用到 TriStaciss，禁止核心链路直连 provider。

## 交付物
- `docs/contracts/TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)-to-tristaciss.md`

## 任务清单
- [ ] 定义请求体（模型、消息、上下文、工具声明）
- [ ] 定义流式响应分片结构（chunk/end/error）
- [ ] 定义错误码与 fallback 语义
- [ ] 定义超时、重试、幂等键约定

## DoD
- [ ] 明确“唯一 LLM API 出口”为 TriStaciss
- [ ] 文档中有失败场景示例（限流、provider 不可用、超时）

## 验收
- 评审中可明确判定“何种调用属于违规直连 provider”。
```

---

## Issue P0-3

### Title
`[Phase0][Contract] 定义 SocialFi <-> TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 输入与回包契约`

### Labels
`type: task`, `area: socialfi`, `priority: P0`, `stage: design`

### Body
```md
## 目标
统一渠道消息标准化输入与回包输出，支撑多平台一致行为。

## 交付物
- `docs/contracts/socialfi-TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)-io.md`

## 任务清单
- [ ] 定义标准化输入（文本、附件、用户身份、渠道上下文）
- [ ] 定义输出分片（文本块、状态块、附件回执）
- [ ] 定义渠道能力差异映射（如 Markdown/富文本）
- [ ] 定义重放与去重策略

## DoD
- [ ] 至少含 Telegram、Discord 两个示例映射
- [ ] 明确附件提取和失败回退字段

## 验收
- 同一语义消息在两个渠道可映射为统一标准输入。
```

---

## Issue P0-4

### Title
`[Phase0][Policy] 定义 Safe Stop / Force Stop 与 lease-fencing 语义`

### Labels
`type: task`, `area: orchestration`, `priority: P0`, `stage: design`

### Body
```md
## 目标
建立停止与授权撤销的一致行为，避免高风险场景下副作用失控。

## 交付物
- `docs/contracts/stop-and-lease-semantics.md`

## 任务清单
- [ ] Safe Stop 行为：停止接新任务 + 可收敛任务 checkpoint
- [ ] Force Stop 行为：立即撤销 lease + 拒绝后续副作用调用
- [ ] leaderEpoch/fencing 与 ToolBus 校验规则
- [ ] 审计事件字段（谁触发、何时触发、影响范围）

## DoD
- [ ] 包含状态机图或状态转移表
- [ ] 包含至少 3 个异常场景处理（网络抖动/重复命令/滞后回执）

## 验收
- 评审通过后可直接作为 ToolBus 拦截实现依据。
```

---

## Epic B（Phase 1）

### Title
`[Epic][Phase1] TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) MVP：单会话最小闭环`

### Labels
`type: epic`, `area: TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)`, `priority: P0`, `stage: dev`

### Body
```md
## 背景
Phase 1 聚焦“收消息 -> 路由 -> 调 LLM -> 回文本”的最小闭环，不引入复杂工具链。

## 范围
- TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 项目骨架
- 最小 Agentic Loop（文本）
- TriStaciss 唯一调用出口
- 基础 AuditEvent 写入

## 子任务
- [ ] P1-1 创建 TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 项目骨架
- [ ] P1-2 实现 Gateway/Router/Queue 最小链路
- [ ] P1-3 接入 TriStaciss 流式调用
- [ ] P1-4 接入最小审计与 smoke 脚本

## DoD
- [ ] 单会话 E2E 成功率 >= 95%
- [ ] 不存在 provider 直连
- [ ] 请求/响应/错误均有审计记录

## 验收标准
- CLI/API 任一路径可完成单轮会话并返回文本。
```

---

## Issue P1-1

### Title
`[Phase1][TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)] 初始化项目骨架（gateway/router-queue/runner/runtime）`

### Labels
`type: task`, `area: TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)`, `priority: P0`, `stage: dev`

### Body
```md
## 目标
创建最小可运行工程结构，确保后续模块能并行开发。

## 任务清单
- [ ] 初始化 `TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)/` 项目与基础脚本
- [ ] 建立目录：`gateway/`、`router-queue/`、`runner/`、`runtime/`
- [ ] 提供统一配置加载（env + config）
- [ ] 提供最小启动命令（dev/run）

## DoD
- [ ] 本地可启动无报错
- [ ] 目录结构与主计划一致
- [ ] README 记录启动方式

## 验收
- 执行启动命令后服务可监听健康端点。
```

---

## Issue P1-2

### Title
`[Phase1][TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)] 实现 Gateway -> Router/Queue -> Runner 最小链路`

### Labels
`type: task`, `area: TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃)`, `priority: P0`, `stage: dev`

### Body
```md
## 目标
打通不含复杂工具执行的最小请求链路。

## 任务清单
- [ ] Gateway 接收标准化请求并分配 sessionId
- [ ] Router 按会话与策略选择队列
- [ ] Queue 保证同会话串行执行
- [ ] Runner 调用最小 Loop 并返回文本

## DoD
- [ ] 同会话请求顺序可保证
- [ ] 异常返回统一错误结构
- [ ] traceId 全链路透传

## 验收
- 3 轮连续请求不乱序，且都可返回。
```

---

## Issue P1-3

### Title
`[Phase1][TriStaciss] 接入统一 LLM 出口（流式 + fallback 语义）`

### Labels
`type: task`, `area: tristaciss`, `priority: P0`, `stage: dev`

### Body
```md
## 目标
TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 仅通过 TriStaciss 完成模型调用与流式响应。

## 任务清单
- [ ] 实现 TriStaciss 客户端适配层
- [ ] 接入流式 chunk 聚合与结束信号处理
- [ ] 接入错误码映射与 fallback 路径
- [ ] 增加“禁止直连 provider”守卫检查

## DoD
- [ ] 直连 provider 调用在代码扫描中为 0
- [ ] 流式输出可正确收敛到最终文本

## 验收
- provider 不可用时可命中 fallback 并返回受控错误。
```

---

## Issue P1-4

### Title
`[Phase1][Observability] 接入最小 AuditEvent 与单会话 smoke`

### Labels
`type: task`, `area: observability`, `priority: P0`, `stage: test`

### Body
```md
## 目标
为 MVP 链路补齐最小可追溯与可验证能力。

## 任务清单
- [ ] 对请求/响应/错误写入 AuditEvent
- [ ] 产出单会话 smoke 脚本（固定输入集）
- [ ] 统计 E2E 成功率并输出结果
- [ ] 记录失败样本与错误分类

## DoD
- [ ] 每次 smoke 有可保存证据（日志/报告）
- [ ] 成功率 >= 95%

## 验收
- 连续执行 smoke 两次，结果稳定且可复现。
```

---

## 建议里程碑与顺序

- Milestone：`Refactor-Phase0-Contracts`  
  - `P0-1` → `P0-2` → `P0-3` → `P0-4`
- Milestone：`Refactor-Phase1-CoreAgent-MVP`  
  - `P1-1` → `P1-2` + `P1-3`（并行）→ `P1-4`

---

## 建议分配（可调整）

- 架构/契约 owner：`TriMetaverse` 维护者
- `P1-1/P1-2`：TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) 工程 owner
- `P1-3`：TriStaciss owner
- `P1-4`：测试/可观测 owner

---

## 备注

- 本文件只覆盖 Phase 0/1，可在同一格式下继续扩展 Phase 2~4。
- 若你愿意，我可以下一步直接生成“Phase 2/3/4 Issue 包 + 建议标签批量创建命令”。

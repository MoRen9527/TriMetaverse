# CPO 产品判断：Copilot-host → TriMC 迭代策略的规格桥接模型

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W28/CPO-20260709-001-spec-bridge-model.md
- syncMode: audit-record
- lastSyncedAt: 2026-07-09
- owner: ChiefProductOfficer
- relatesTo: ITEM-20260709-001（Copilot-host vs TriMC 迭代策略选择）

---

## 产品判断

**不选边，建桥。**

Copilot-host 的"对话循环 + 总助调度"和 TriMC 的"任务队列 + NodeBridge 自动化"是两套运行时，不是一个"升级"关系。强行二选一会吃掉不该吃的成本——过早切 TriMC 会被 v0.1.0 成熟度拖死；死守 copilot-host 会让自动化永远停在手工阶段。

**核心判断：在当前阶段（Phase 0/1 之间），两轨制本身不是问题，缺乏统一规格层才是问题。**

我的方案不是保留两轨制，而是建立一套 **agent 规格定义层**——作为产品侧的统一真源，copilot-host 和 TriMC 各自消费同一份规格，各自在自己的运行时内解释执行。规格层是桥，不是翻译器。

### 为什么规格桥接优于"验证→吸收→自动化"

| | 两轨翻译模型（当前） | 规格桥接模型（建议） |
|---|---|---|
| 产品定义 | 散文式 agent.md，两轨各自解读 | 结构化规格，单一定义 |
| 验证成本 | copilot-host 验证通过 → 人工翻译为 TriMC 格式 | copilot-host 验证的是"规格是否对"，验证通过即规格固化 |
| 迁移成本 | 每新增一个能力需双写、双验 | 新增能力只需更新规格，两轨各自实现消费层 |
| 风险敞口 | 翻译错误在 copilot-host 侧不可见，到 TriMC 才暴露 | 规格本身是验证对象，两轨行为差异可对账 |

---

## MVP 定义

### 产品名称
**Agent Spec Bridge（agent 规格桥接层）** — 暂定代号，不作为最终产品名。

### 边界
- **在界内**：定义 agent 的结构化规格格式、字段语义、验证规则、版本管理。产出为可供 copilot-host 和 TriMC 各自消费的规格文档/数据文件。
- **在界外**：copilot-host 侧如何执行规格、TriMC 侧如何解释规格——这些是各运行时的实现细节，不属于产品层。

### 最小可交付物（Phase 1）
1. **Agent 契约格式 v1**：六要素（身份、职责、决策权、协作者、工具、输入输出）的结构化 schema，含字段定义、必填/可选、tool risk-level 分层。
2. **现有 5 核心 agent 规格迁移**：CEOChiefOfStaff、CPO、CTO、BusinessStrategy、RAndDTrainer 的当前 agent.md 转写为结构化规格。
3. **双轨消费验证**：copilot-host 侧加载规格并验证行为一致性；TriMC 侧（v0.1.0）至少完成规格解析能力。

### 验证指标
- 现有 5 agent 的行为在双轨下对同一输入产生等价输出（允许格式差异，不允许逻辑偏差）。
- 新增第 6 个 agent 时，只需写一份规格，两轨自动可用，不再需要人工翻译。

---

## 依赖检查

| 依赖 | 当前成熟度 | 是否阻塞 | 说明 |
|------|-----------|----------|------|
| TriMC v0.1.0 | 低（刚启动） | **否** | 规格层先定义、先验证，TriMC 消费能力可滞后一个版本。copilot-host 侧先跑通规格验证闭环，TriMC 侧在 v0.2.0 接入。 |
| copilot-host agent 体系 | 中（5 核心 agent 已运行） | 否 | 当前散文式 agent.md 需要转写为结构化格式，但不需要改变 agent 行为。 |
| CTO agent 契约方案 | 口头讨论阶段 | **是（短期）** | CTO 需出六要素 schema 初稿，否则规格格式无法定稿。 |
| TriDev IPD 流水线 | 低（Phase 2 计划中） | 否 | 规格桥接模型不依赖 TriDev，但 TriDev 接入后可自动消费规格做 agent 合规检查。 |
| 模块 registry 体系 | 中 | 否 | 规格桥接层本身就是一种新的 registry 类型，可并行推进。 |

---

## 风险与升级

| 风险 | 等级 | 缓解措施 | 升级条件 |
|------|------|----------|----------|
| CTO 不出 schema 初稿 | 中 | 已明确 due 7/12。若逾期，规格桥接退化为概念空转，建议 CEO 介入优先级推动。 | 7/14 仍无 schema 初稿 |
| 规格定义过度工程化 | 中 | MVP 先锁 5 agent + 六要素，不做"通用 agent DSL"。有 5 个够用了再扩展。 | 设计中出现"通用 agent 描述语言"需求 |
| TriMC 消费能力不足 | 高 | 规格层先跑 copilot-host 侧，TriMC 侧延期到 v0.2.0。不影响 copilot-host 阶段的迭代效率。 | TriMC v0.2.0 仍无法解析规格 |
| 两轨行为差异无法对账 | 中 | 验证指标明确为"等价输出"（非相同输出）。建立差异记录表，逐项标注是格式差异还是逻辑偏差。 | 核心 agent（总助/CPO/CTO）出现无法解释的逻辑偏差 |

### 升级路径
- 产品侧无法决策的技术风险 → 升级至 CTO
- 资源/优先级冲突 → 升级至 CEOChiefOfStaff
- 策略方向变更 → 升级至真人 CEO

---

## 使用依据

| 依据 | 来源 | 具体引用 |
|------|------|----------|
| 商业模式主线 | BusinessStrategy | 当前 Phase 0/1 之间，默认经营实验 = AI 内容运营与增长微服务 |
| 模块优先级 | business-strategy-state.md | TriMC 在第一轮核心模块 |
| 产品治理边界 | product-state.md | TriMetaverse 维护总商业模式、模块映射、registry 治理规则 |
| 架构约束 | 三元宇宙架构与模块说明.md | TriMC = 统一运行面，copilot-host = 当前过渡载体 |
| CTO 技术判断 | ITEM-20260708-001 | Phase 1 = TriMC 自身就绪，Phase 2 = agent 格式桥接 + TriDev 接入 |
| CEO 决策方向 | ITEM-20260709-001 | 要求评估两轨制必要性，不在 copilot-host 和 TriMC 之间做非此即彼选择 |

---

## 后续动作

1. **CTO** → 7/12 前出 agent 契约六要素 schema 初稿（含 tools 分层）
2. **CPO** → schema 定稿后 3 天内完成 5 核心 agent 规格转写第一版
3. **CEOChiefOfStaff** → 将规格桥接模型纳入 W28 经营记录 #8 的书面结论
4. **CEO** → 确认规格桥接模型作为正式迭代策略，批准 Phase 1 MVP 范围

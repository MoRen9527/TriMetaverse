# 虚拟公司标准交接对象

## 1. 目标

本文件把 `cyber-company-agent-roles.md` 中的关键协作对象收敛为可复用的标准交接对象，避免虚拟公司后续继续依赖模糊自然语言流转任务。

本文件解决三类问题：

1. 各 Role Agent 之间到底传什么对象。
2. 对象最小必填字段是什么。
3. 哪些对象属于可自动流转，哪些对象必须升级审批。

## 2. 适用范围

- `BoardOversight`
- `CEOChiefOfStaff`
- `ChiefMarketingOfficer`
- `ChiefSalesOfficer`
- `ChiefProductOfficer`
- `ChiefFinancialOfficer`
- `ChiefHumanResourcesOfficer`
- `ChiefTechnologyOfficer`
- `ChiefOperatingOfficer`

这些对象不是替代 `PhaseResult` 的主流程对象，而是补足虚拟公司经营层的日常协作对象。

## 3. 统一设计原则

### 3.1 统一 Envelope

所有交接对象都应先满足 `cyber-company-handoff-envelope.schema.json` 的基础结构。

### 3.2 先少后多

一期只固定最小高频对象，不追求一次性覆盖所有会议纪要和衍生表单。

### 3.3 事实优先

对象中的模块、进度、预算、交付能力都必须能回溯到 `BusinessStrategy` 或模块级 Registry。

### 3.4 升级清晰

对象必须能明确表示：

- 是否可自动推进
- 是否需要审批
- 是否已经触发升级

### 3.5 分支型对象的 docs bootstrap 约定

- 当经营对象的 `workflowRefs` 已明确绑定某个 PRD 分支，且该对象会直接驱动、阻断、评估或对外承诺 `DESIGNING -> ASSURANCE` 之间的执行时，应优先使用 `docsInitializationRequirements` 与 `docsBootstrapRefs` 描述 `模块五层文档协同系统` 的前置条件与引用入口。
- 这两个字段的目的不是复制 docs 内容，而是把“该分支是否已经完成最小 docs 初始化、引用哪份目录样板或真源”显式带进经营对象，避免只有 `branchId` 却无法判断 docs readiness。
- `ENGINEERING_TASK`、`MVP_DEFINITION`、`BUDGET_CHECK`、`SALES_PROGRESS`、`OPERATING_REVIEW` 当前已采用这套约定。
- 若对象中的 `branchId` 只是功能、技能、调度或宿主试运行分支标识，而不是 PRD 分支本身，则不默认强制要求这两个字段；只有当该对象也直接治理 docs-backed 的实现链时，才追加采用。
- `docsBootstrapRefs` 默认优先引用模块 source docs、中央治理摘要、machine-readable manifest 或 source-side SOP；只有在确实需要 host 特有的 published-copy、phase-evidence、operator-runbook 或 archive-index 时，才补 support bundle 路径，并同时说明引用原因。

## 4. 对象总表

| 对象类型 | 中文名 | 主要产生者 | 主要消费者 | 用途 |
| --- | --- | --- | --- | --- |
| `BOARD_DIRECTIVE` | 目标令 | `BoardOversight` / CEO | `CEOChiefOfStaff` | 定义阶段目标、边界和预算约束 |
| `OPERATING_PLAN` | 经营计划单 | `CEOChiefOfStaff` | 全部执行层角色 | 定义周 / 月经营主线和里程碑 |
| `DEMAND_INTAKE` | 需求输入单 | `ChiefMarketingOfficer` | `ChiefProductOfficer` | 传递市场机会、需求信号和渠道证据 |
| `MVP_DEFINITION` | MVP 定义单 | `ChiefProductOfficer` | `ChiefTechnologyOfficer`、`ChiefSalesOfficer`、`ChiefOperatingOfficer` | 收敛产品边界、验证目标和定价假设 |
| `BUDGET_CHECK` | 预算校验单 | `ChiefFinancialOfficer` | CEO、`CEOChiefOfStaff`、`ChiefTechnologyOfficer`、`ChiefOperatingOfficer` | 判断是否可做、能做多久、何时熔断 |
| `ENGINEERING_TASK` | 研发任务单 | `ChiefTechnologyOfficer` | 技术执行链 | 拆解实现、测试、发布和回滚要求 |
| `SALES_PROGRESS` | 销售推进单 | `ChiefSalesOfficer` | `CEOChiefOfStaff`、`ChiefFinancialOfficer`、`ChiefOperatingOfficer`、`ChiefProductOfficer` | 同步线索、报价、成交和回款进展 |
| `RISK_ESCALATION` | 风险升级单 | 任意 Role Agent | CEO、`BoardOversight`、`CEOChiefOfStaff` | 触发异常处理、冻结或升级 |
| `OPERATING_REVIEW` | 经营复盘单 | `ChiefOperatingOfficer` / `CEOChiefOfStaff` | 全部经营层 | 记录结果、偏差、纠偏和下一轮优化 |
| `CENTRAL_REGISTRY_CLOSEOUT` | 中央 registry 收口单 | `CEOChiefOfStaff` | `BusinessStrategy`、模块 `BusinessStrategyRegistry`、模块 `Product Registry`、模块 `Code Registry`、`CompanyGovernanceRegistry`、中央 registry | 组织跨模块事实收口、回写计划和升级项 |
| `PRD_OWNERSHIP_ROUTING` | PRD 归属路由请求单 | 执行者 / 秘书处 / `CEOChiefOfStaff` | `ChiefProductOfficer` | 在 PRD 归属未明时，请求确认模块设计、归属模块 / 项目、目标仓与目标 docs 落位；`CEOChiefOfStaff` 只负责公司级任务分派与升级 |
| `RESPONSIBILITY_HANDOFF` | 岗位职责交接单 | `ChiefHumanResourcesOfficer` / `CEOChiefOfStaff` | `CEOChiefOfStaff`、接手岗位、`CompanyGovernanceRegistry` | 把岗位启用、职责移交、acting owner 切换和 completion tracking 收敛成标准交接对象 |
| `SKILL_SPEC` | 技能规范单 | `CEOChiefOfStaff` / `ChiefTechnologyOfficer` | `CEOChiefOfStaff`、`ChiefTechnologyOfficer`、Code Registry、后续执行器 | 定义可复用技能的触发条件、执行步骤、门禁和可用宿主 |
| `SCHEDULE_SPEC` | 调度规范单 | `CEOChiefOfStaff` / `ChiefOperatingOfficer` / `ChiefTechnologyOfficer` | `CEOChiefOfStaff`、`ChiefOperatingOfficer`、后续 cron / 调度执行器 | 定义对已批准技能的定时触发、宿主、审计和失败策略 |

## 5. 基础 Envelope 字段

所有对象都应具备以下字段。

| 字段 | 含义 |
| --- | --- |
| `objectType` | 对象类型 |
| `objectId` | 对象唯一编号 |
| `title` | 简明标题 |
| `status` | 当前状态：`draft` / `submitted` / `approved` / `rejected` / `in-progress` / `blocked` / `completed` |
| `priority` | 优先级：`low` / `medium` / `high` / `critical` |
| `ownerRole` | 主要责任角色 |
| `createdAt` | 创建时间 |
| `updatedAt` | 最近更新时间 |
| `timebox` | 时间窗口：周、月、上线窗或截止时间 |
| `summary` | 当前对象摘要 |
| `relatedModules` | 关联模块列表 |
| `dependsOn` | 依赖对象或前置条件 |
| `evidence` | 事实来源、Registry 或数据引用 |
| `nextActions` | 下一步动作列表 |
| `approvals` | 审批链或授权状态 |
| `workflowRefs` | 与研发 `PhaseResult`、`runId`、`branchId` 的桥接引用 |
| `payload` | 当前对象的专属业务字段 |
| `metadata` | 扩展字段 |

## 6. 各对象最小字段

### 6.1 `BOARD_DIRECTIVE`

`payload` 建议字段：

- `goalVersion`
- `businessTarget`
- `budgetGuardrail`
- `strategicBoundary`
- `effectiveFrom`
- `effectiveTo`
- `issuedBy`

最小用途：把董事会目标、预算边界和禁止越权范围下发给经营层。

### 6.2 `OPERATING_PLAN`

`payload` 建议字段：

- `planScope`：`weekly` / `monthly`
- `milestones`
- `workstreams`
- `blockedItems`
- `escalationRules`
- `kpis`

最小用途：让 `CEOChiefOfStaff` 能把战略目标转译成可执行节奏。

### 6.3 `DEMAND_INTAKE`

`payload` 建议字段：

- `signalSource`
- `targetAudience`
- `problemStatement`
- `urgency`
- `conversionHypothesis`
- `channelEvidence`

最小用途：让市场信号进入产品判断，而不是停留在内容层。

### 6.4 `MVP_DEFINITION`

`payload` 建议字段：

- `mvpVersion`
- `userProblem`
- `scopeIn`
- `scopeOut`
- `pricingHypothesis`
- `validationMetrics`
- `deliveryExpectation`
- `docsInitializationRequirements`（当 MVP 直接驱动 PRD 分支启动时）
- `docsBootstrapRefs`（当需引用 `模块五层文档协同系统` 样板或模块 docs 真源时）

最小用途：把需求池收敛为销售可讲、技术可做、运营可推进的最小版本。

### 6.5 `BUDGET_CHECK`

`payload` 建议字段：

- `budgetWindow`
- `fixedCostEstimate`
- `variableCostEstimate`
- `runwayImpact`
- `guardrails`
- `stopConditions`
- `assumptions`
- `docsInitializationRequirements`（当预算判断依赖分支 docs 初始化范围时）
- `docsBootstrapRefs`（当需引用样板、目录基线或已存在 docs 真源时）

最小用途：对任何产品推进、技术实现或节奏扩大做预算约束。

### 6.6 `ENGINEERING_TASK`

`payload` 建议字段：

- `implementationScope`
- `taskBreakdown`
- `testRequirements`
- `releaseRequirements`
- `rollbackPlan`
- `technicalRisks`
- `docsInitializationRequirements`（当对象用于 PRD 分支启动或首次实现落地时）
- `docsBootstrapRefs`（当对象需要引用 `模块五层文档协同系统` 样板或已存在 docs 真源时）

最小用途：把 MVP 定义单转成技术执行链的工作对象。

### 6.7 `SALES_PROGRESS`

`payload` 建议字段：

- `pipelineStage`
- `customerSegment`
- `offerVersion`
- `quoteRange`
- `expectedRevenue`
- `paymentRisk`
- `followUpAt`
- `docsInitializationRequirements`（当对外承诺依赖分支 docs readiness 时）
- `docsBootstrapRefs`（当销售话术需回连 docs 样板或模块真源时）

最小用途：同步成交节奏、报价风险和回款状态。

### 6.8 `RISK_ESCALATION`

`payload` 建议字段：

- `riskCategory`
- `riskSeverity`
- `impactScope`
- `triggerCondition`
- `freezeRequired`
- `escalateTo`
- `mitigationOptions`

最小用途：统一高风险事项的升级和冻结入口。

### 6.9 `OPERATING_REVIEW`

`payload` 建议字段：

- `reviewWindow`
- `targetVsActual`
- `wins`
- `misses`
- `rootCauses`
- `corrections`
- `nextCycleInput`
- `docsInitializationRequirements`（当复盘需要明确 docs 落位是否达标时）
- `docsBootstrapRefs`（当复盘需引用样板或模块 docs 真源时）

最小用途：把复盘结果变成下一轮经营计划的输入，而不是停留在总结层。

### 6.10 `CENTRAL_REGISTRY_CLOSEOUT`

`payload` 建议字段：

- `closeoutSubject`
- `triggerReason`
- `candidateModules`
- `knownChanges`
- `openQuestions`
- `scopeDecision`
- `registryFindings`
- `writebackPlan`
- `auditNotes`
- `closeoutDecision`

最小用途：把一次跨模块 registry 收口从自由文本升级为结构化对象，明确参与范围、各 registry 返回、正式回写计划和升级项。

### 6.11 `PRD_OWNERSHIP_ROUTING`

`payload` 建议字段：

- `prdRef`
- `requestReason`
- `candidateModules`
- `candidateRoots`
- `currentEvidence`
- `blockingImpact`
- `requestedDecisionBy`
- `routingDecision`
- `targetModuleOrProject`
- `targetRepoRoot`
- `targetDocsRoot`
- `moduleDesignDecision`
- `requiredEscalations`

最小用途：在 PRD 已形成但归属模块 / 项目、目标仓或目标 `docs/` 根仍不明确时，先冻结 docs bootstrap，并把“谁来判断归属”转成标准对象流。

当前阶段使用规则：

- 主受理角色是 `ChiefProductOfficer`。
- `CEOChiefOfStaff` 可以整理零散输入并承担公司级任务分派、排程、催办、升级与收口，但不再代替产品侧做模块设计与归属判断。
- `ChiefProductOfficer` 负责核查产品真源、必要时询问 `BusinessStrategy`，并返回当前可执行的产品路由结论。
- 在 `routingDecision` 未形成前，不得直接建立 `模块五层文档协同系统` 目录。

岗位 / 交接治理规则：

- 当 `PRD_OWNERSHIP_ROUTING` 的结论进一步触发岗位 / 职责交接、handoff checklist 或 completion tracking 时，流程设计与完成度监督由 `ChiefHumanResourcesOfficer` 主责。
- `ChiefHumanResourcesOfficer` 的启用应先从 `TriCompany` 源侧岗位 / 员工定义开始，沿用源侧五件套、support object、shadow gate / validation、live binding、governance 回填这条既有链路。
- 在 `ChiefHumanResourcesOfficer` 尚未独立上岗前，上述交接治理仍由 `CEOChiefOfStaff` 临时代管。

#### `ChiefProductOfficer` -> `ChiefTechnologyOfficer` 接手条件

- `ChiefProductOfficer` 的归属结论已经形成。
- 当前问题已从“归属谁”转为“如何在已确认模块中技术落地”。
- 产品范围、预算约束和冻结条件已经明确，不需要 CTO 代替产品侧判断模块归属。
- 期望输出是 `ENGINEERING_TASK`、技术 readiness 结论或 docs 初始化任务拆解。
- 若模块归属、中央边界或长期模块设计仍未稳定，则不得切给 `ChiefTechnologyOfficer`。

### 6.12 `RESPONSIBILITY_HANDOFF`

`payload` 建议字段：

- `handoffSubject`
- `handoffCategory`
- `previousOwner`
- `incomingOwner`
- `actingOwner`
- `scope`
- `sourceOfTruthFiles`
- `supportAssets`
- `completionTrackingStatus`
- `acceptanceCriteria`
- `nextAction`
- `blocker`
- `escalations`
- `notes`

最小用途：把岗位启用、职责移交、acting owner 切换和 completion tracking 从自由文本升级成标准交接对象，避免只改一份职责说明却没有 machine-readable handoff 记录。

当前阶段使用规则：

- 设计 owner 默认是 `ChiefHumanResourcesOfficer`；在其尚未独立上岗前，由 `CEOChiefOfStaff` 代执行。
- envelope 的 `status` 仍使用虚拟公司统一状态；更细粒度的交接进度统一写入 `payload.completionTrackingStatus`。
- 若当前只完成 source-side 定义而 live 未绑定，`payload.scope` 必须显式写成 `source-side-not-live` 或等价表述，不得写成已 live 完成。
- 若交接事项触及中央边界变化、正式宿主切换或模块长期边界调整，必须升级到 `BusinessStrategy` 或 CEO 裁决。
- 若当前输入还只是自然语言，可先使用 `responsibility-handoff-intake-template.md` 补齐最小字段，再整理成正式 JSON 对象。

### 6.13 `SKILL_SPEC`

`payload` 建议字段：

- `skillName`
- `skillVersion`
- `triggerPatterns`
- `preconditions`
- `executionSteps`
- `successEvidence`
- `failureGuards`
- `allowedHosts`
- `reviewGate`

最小用途：把一次已经证明有效的复杂任务经验收敛成可复用技能，但仍保留审阅门禁，不直接等同自动执行授权。

### 6.14 `SCHEDULE_SPEC`

`payload` 建议字段：

- `targetType`
- `targetRef`
- `targetVersion`
- `scheduleType`
- `scheduleExpression`
- `executionHost`
- `approvalGate`
- `deliveryChannel`
- `deliveryTarget`
- `failurePolicy`
- `auditRequired`
- `enabled`
- `concurrencyPolicy`
- `stopConditions`

最小用途：为技能执行、提醒、邮件、检查点回放等已定义定时任务建立统一调度对象，明确何时触发、在哪个宿主执行、如何投递结果，以及失败时如何冻结或升级。

## 7. 状态与审批规则

### 7.1 通用状态

- `draft`：对象刚创建，尚未进入正式流转
- `submitted`：已提交给下游或审批方
- `approved`：已获批准，可进入执行
- `rejected`：被驳回，需要重做
- `in-progress`：已进入执行或跟踪
- `blocked`：被风险、预算或依赖阻断
- `completed`：对象目标已完成

### 7.2 默认审批要求

| 对象类型 | 默认审批要求 |
| --- | --- |
| `BOARD_DIRECTIVE` | CEO 或董事会目标输入已明确后生效 |
| `OPERATING_PLAN` | 默认由 `CEOChiefOfStaff` 发布；重大节奏变化需 CEO 确认 |
| `DEMAND_INTAKE` | 默认无需审批，可直接进入产品判断 |
| `MVP_DEFINITION` | 涉及立项时需 CEO 批准 |
| `BUDGET_CHECK` | 作为校验对象本身无需审批，但可触发预算冻结 |
| `ENGINEERING_TASK` | 重大成本或高风险技术路径需升级 |
| `SALES_PROGRESS` | 常规更新无需审批；价格例外需升级 |
| `RISK_ESCALATION` | 一经触发即进入升级流程 |
| `OPERATING_REVIEW` | 默认无需审批，但重大偏航应附带升级建议 |
| `CENTRAL_REGISTRY_CLOSEOUT` | 默认由 `CEOChiefOfStaff` 发起；涉及中央边界变化或正式回写时需用户明确要求“记录 / 更新 / 收口” |
| `PRD_OWNERSHIP_ROUTING` | 当前默认提交给 `ChiefProductOfficer`；`CEOChiefOfStaff` 只做公司级任务分派与升级；涉及中央边界变化时需先升级 `BusinessStrategy` |
| `RESPONSIBILITY_HANDOFF` | 默认由 `ChiefHumanResourcesOfficer` 设计；在其未独立上岗前由 `CEOChiefOfStaff` 代执行；涉及中央边界、正式宿主切换或长期岗位重构时需升级 |

## 8. 最小流转链

一期建议先固定以下最小经营流：

1. `BOARD_DIRECTIVE`
2. `OPERATING_PLAN`
3. `DEMAND_INTAKE`
4. `MVP_DEFINITION`
5. `BUDGET_CHECK`
6. `ENGINEERING_TASK`
7. `SALES_PROGRESS`
8. `RISK_ESCALATION`（如触发）
9. `OPERATING_REVIEW`

`CENTRAL_REGISTRY_CLOSEOUT` 属于按需补充对象，不要求每轮经营循环都出现；只有涉及跨模块事实 fan-in 和 registry 回写时才发起。

`PRD_OWNERSHIP_ROUTING` 也属于按需补充对象；只有当 PRD 归属未明、docs bootstrap 无法安全启动时才发起。它通常位于 `MVP_DEFINITION` 之前。

`RESPONSIBILITY_HANDOFF` 同样属于按需补充对象；只有当岗位启用、职责移交、acting owner 切换或 completion tracking 需要被结构化跟踪时才发起。

## 9. 与主流程资产的关系

- 这些对象不替代 `PhaseResult`。
- `PhaseResult` 解决的是产品研发主流程的阶段结果。
- 本文件解决的是虚拟公司经营层 Agent 之间的日常经营对象流转。
- 两者当前已可通过 `workflowRefs`、`runId`、`branchId` 与 `phaseResultRef` 建立统一引用。
- `phaseResultRef` 的稳定目录规范见：`../runs/README.md`

经营对象到研发阶段的标准桥接规范见：

- `cyber-company-phase-link.schema.json`
- `cyber-company-phase-bridge.md`

## 10. 模板目录

常用对象的可直接填写样板放在：

- `handoff-templates/board-directive.example.json`
- `handoff-templates/operating-plan.example.json`
- `handoff-templates/demand-intake.example.json`
- `handoff-templates/mvp-definition.example.json`
- `handoff-templates/budget-check.example.json`
- `handoff-templates/engineering-task.example.json`
- `handoff-templates/sales-progress.example.json`
- `handoff-templates/risk-escalation.example.json`
- `handoff-templates/operating-review.example.json`
- `handoff-templates/central-registry-closeout.example.json`
- `handoff-templates/prd-ownership-routing.example.json`

## 11. 已落地独立 Schema

当前已为高频且风险较高的对象补充独立 schema：

- `operating-plan.schema.json`
- `budget-check.schema.json`
- `demand-intake.schema.json`
- `mvp-definition.schema.json`
- `engineering-task.schema.json`
- `sales-progress.schema.json`
- `operating-review.schema.json`
- `risk-escalation.schema.json`
- `central-registry-closeout.schema.json`
- `prd-ownership-routing.schema.json`

## 12. 当前使用者与成熟度

当前这些虚拟公司 JSON 交接对象，实际上有三类使用者：

- `Role Agent` / 智能体：这是当前最直接的使用者。对象的首要用途，是让 `CEOChiefOfStaff`、`ChiefProductOfficer`、`ChiefTechnologyOfficer` 等角色之间用标准对象交接，而不是只靠口头描述。
- 工作流 / 文档机制：这是当前最稳定的承载层。经营主工作流、运行手册、桥接规范和 operating records 用这些对象组织 intake、handoff、审批和对 `PhaseResult` 的引用。
- 程序 / 工具：这是当前“部分已用、尚未完全落地”的层。JSON Schema、`handoff-templates/` 和 `operating-cycle-example/` 已经让这些对象可以被机器校验、被工具读取，也便于后续自动化，但仓库里还没有证据表明已经存在一个统一的生产级程序，把所有经营对象端到端自动调度起来。

因此，当前最准确的说法是：这些 JSON 对象现在主要由“智能体 + 工作流文档体系”在使用，并已经具备“程序可校验、可被未来自动化接入”的结构基础，但还不应写成“已有完整统一 runtime 在全面消费它们”。

## 13. 当前结论

到这一步，TriMetaverse 虚拟公司已经不只是“有角色定义”，而是具备了第一版标准交接对象目录。

下一步最自然的是：

1. 让研发工作流的真实宿主按 `docs/runs/` 稳定目录规范自动落盘
1. 视需要补 `BOARD_DIRECTIVE` 等非高频对象的独立 schema
1. 让结构化 run 样例继续演进为真实执行记录

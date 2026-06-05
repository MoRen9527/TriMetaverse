# PRD 归属路由 Intake 模板

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/prd-ownership-routing-intake-template.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

本模板用于在 PRD 归属模块 / 项目、目标仓或目标 `docs/` 根不明确时，发起一次标准 `PRD_OWNERSHIP_ROUTING` 请求。

它不是正式记录本身，也不替代 `handoff-templates/prd-ownership-routing.example.json`。
它的用途是先把自然语言请求整理成统一字段，再由当前产品侧、公司级协调侧或后续技术侧接手。

快捷入口：如需直接交给 `ChiefProductOfficer` 受理，可使用 `.github/prompts/PRD归属路由.prompt.md`。

## 1. 当前阶段发起方式

当前阶段默认先提交给 `ChiefProductOfficer`。

如当前输入还只是零散自然语言，可先由秘书处或 `CEOChiefOfStaff` 协助补齐字段，但产品归属判断仍由 `ChiefProductOfficer` 输出。

适用条件：

- 不确定 PRD 属于既有模块、TriMetaverse 项目根，还是一个新模块。
- 不确定目标仓、目标 `docs/` 根或执行层 `workstream` 命名。
- 不确定当前问题该先走产品侧、公司级协调侧还是技术侧。

### 当前阶段建议最小文本

```md
对象类型：PRD_OWNERSHIP_ROUTING
当前阶段受理人：ChiefProductOfficer
公司级协调人：CEOChiefOfStaff

PRD 引用：
请求原因：
候选模块：
候选落位仓：
当前证据：
若不先裁决会阻断什么：
期望何时给出结论：

我当前需要的是：
- 归属模块 / 项目判断
- 目标仓判断
- 目标 docs 根判断
- 是否需要升级到 BusinessStrategy
```

## 2. 公司级协调与交接治理边界

- `ChiefProductOfficer` 当前已主责 `PRD_OWNERSHIP_ROUTING` 的产品归属判断。
- `CEOChiefOfStaff` 只负责公司级任务分派、排程、催办、升级与跨域收口，不再代替产品侧做模块设计和归属判断。
- 若事项进一步进入岗位 / 职责交接、handoff checklist 或 completion tracking，则转由 `ChiefHumanResourcesOfficer` 主责治理。
- `ChiefHumanResourcesOfficer` 的启用应先从 `TriCompany` 源侧开始，沿用岗位 / 员工定义、源侧五件套、support object、shadow gate / validation、live binding、governance 回填这条既有链路。

## 3. 技术侧接手方式

`ChiefTechnologyOfficer` 不是用来替代产品侧做模块归属判断，而是在归属结论已明确之后接手技术落地。

只有以下问题已经回答清楚，才适合切给 `ChiefTechnologyOfficer`：

- 属于哪个模块 / 项目。
- 落在哪个仓、哪个 `docs/` 根。
- 是否还需要升级 `BusinessStrategy`。

### 技术侧建议最小文本

```md
对象类型：PRD_OWNERSHIP_ROUTING（技术接手阶段）
技术侧受理人：ChiefTechnologyOfficer

已确认归属结论：
已确认目标仓：
已确认 docs 根：
当前需要 CTO 回答的问题：
- execution workstream 命名
- docs 初始化任务拆解
- 工程入口与测试 / 发布前置条件
- 是否转成 ENGINEERING_TASK
```

## 4. 与结构化对象的对应关系

将上面的文本整理成正式 JSON 对象时，至少应映射到这些字段：

- `prdRef`
- `requestReason`
- `candidateModules`
- `candidateRoots`
- `currentEvidence`
- `blockingImpact`
- `requestedDecisionBy`

如已经拿到结论，再补：

- `routingDecision`
- `targetModuleOrProject`
- `targetRepoRoot`
- `targetDocsRoot`
- `moduleDesignDecision`
- `docsLandingDecision`
- `requiredEscalations`

结构化样板见：

- `handoff-templates/prd-ownership-routing.example.json`
- `prd-ownership-routing.schema.json`
- `workflow-runbook.md`

# WorkflowEngine Runbook

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/workflow-runbook.md
- syncMode: source-only
- lastSyncedAt: 2026-06-03

## 0. 统一词汇规范

当前文件是 TriMetaverse 研发工作流运行手册的本地真源，只负责运行前检查、阶段门禁、回流处理和执行自检步骤；它不是 TriCompany 公司级 workflow 书面真源。

- 统一词汇源：`docs/workflow/terminology.md`（本节为执行摘要，详细定义以该文件为准）。
- CODING 阶段标准产物名称固定为“产品实施总结”。
- “产品实施文档”“实施产物”“产品实现文档”均视为非标准别名，执行与门禁记录一律使用“产品实施总结”。
- `INTELLIGENCE` 之后各 PRD 分支的标准落地系统固定称为 `模块六层文档协同系统`，即 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/`。
- PRD 分支的 docs bootstrap 前必须先拿到归属路由结论；当前阶段由 `ChiefProductOfficer` 主责模块设计与归属方案，`CEOChiefOfStaff` 只负责公司级任务分派、升级与收口。当前工作区根仓不自动等于 docs 落点。
- 文档执行“严格模式”：正式章节禁止使用非标准别名（详见 `docs/workflow/terminology.md` 的 Strict Mode）。

### 0.1 术语变更记录（changelog）

- 2026-04-26：将 PRD 分支的标准文档落地系统正式命名为“模块六层文档协同系统”，并要求运行前校验最小 docs 初始化。
- 2026-04-26：补充 PRD 归属路由 gate，要求在建立最小 docs 入口前当前先询问 `CEOChiefOfStaff`，未来由 `ChiefProductOfficer` 主责模块设计与归属方案。
- 2026-05-20：根据当前 live 上岗状态，把 `PRD_OWNERSHIP_ROUTING` 的产品归属判断切换为 `ChiefProductOfficer` 主责；`CEOChiefOfStaff` 退回公司级任务分派、催办、升级与收口。
- 影响范围：`project.md`、`docs/workflow/project-repo-document-baseline.md`、`docs/workflow/phase-io-matrix.md`、`docs/workflow/review-release-chain.md`、`docs/workflow/workflow-engine-spec.md`、本运行手册。
- 变更目的：把 PRD 分支初始化要求从口头约定升级为运行前检查与执行步骤的一部分。
- 2026-03-04：将 CODING 阶段主产物标准名统一为“产品实施总结”。
- 影响范围：`project.md`、`tmv-whitepaper.md`、`docs/workflow/review-release-chain.md`、`docs/workflow/phase-io-matrix.md`、`docs/workflow/workflow-engine-spec.md`、本运行手册。
- 变更目的：消除同义词漂移，确保主因果链与阶段输出命名一致，提升执行审计可追溯性。

## 1. 运行前检查

- `tmv-whitepaper.md` 存在
- `docs/prd/` 已初始化
- `project.md` 与 `workflow-engine-config.yaml` 一致
- 门禁规则文件可解析
- 每个待执行 PRD 已拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，并已确认目标落位仓与目标 `docs/` 根
- 若存在待执行 PRD 分支，则对应模块的 `模块六层文档协同系统` 最小入口已建立

### 1.1 提交前术语一致性检查清单

- 主因果链产物命名与 `docs/workflow/terminology.md` 完全一致。
- CODING 阶段主产物使用“产品实施总结”，不使用“产品实施文档/实施产物/产品实现文档”。
- 主链后续产物名称固定为：单元测试报告、集成测试报告、红队扫描报告、QA报告、部署手册、Assurance报告、交付验收报告。
- 若出现历史别名，仅允许在解释性语句中出现，不可作为阶段主产物名。

### 1.2 自动检查建议命令（文档自检）

- 检查历史别名是否作为正式产物名残留：`rg "产品实施文档|实施产物|产品实现文档" .`
- 检查主链关键产物名是否存在：`rg "产品实施总结|单元测试报告|集成测试报告|红队扫描报告|QA报告|部署手册|Assurance报告|交付验收报告" docs/workflow project.md tmv-whitepaper.md`
- 提交前建议核对术语源：`docs/workflow/terminology.md`

## 2. 标准运行步骤

1. 生成本轮 `run-id`
2. 加载配置
3. 执行 `DISCOVERY`，提交人工审核；仅审核通过后由审核人签发 `WP-v*`（首次需有版本号，非首次需版本变更）
4. 执行 `INTELLIGENCE`，提交人工审核；仅审核通过后由审核人签发 PRD 版本（如 `PRD001-v1.0.0`，首次需有版本号，非首次需版本变更）
5. 基于审核通过的 PRD 创建/更新分支
   - 因果链要求：`DISCOVERY` 产出白皮书（商业需求上游），`INTELLIGENCE` 产出 PRD/原型/用户故事，分支从 `DESIGNING` 启动。
   - 分支初始化要求：先拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，并在该落位点校验和建立 `模块六层文档协同系统` 的最小入口，之后才允许该分支正式进入 `DESIGNING`。
   - 目录样板：可直接参考 `prd-branch-minimal-directory-template.md`。
6. 检查增量触发：
   - `DISCOVERY` 白皮书更新 -> 刷新 `INTELLIGENCE`
   - `INTELLIGENCE` 更新并新增/变更 PRD -> 立即注册新分支
   - 分支启动阶段固定为 `DESIGNING`
7. 从 `docs/prd/` 与 PRD 注册表枚举“已审核且有版本号（非首次需版本已变更）”的 PRD，创建/更新分支流水线
8. 每个分支执行：`DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`
9. 全部分支通过后执行统一 `DELIVERY`
10. 生成 `workflow-summary.md`

## 3. 阶段门禁职责

- `CODING`：编码与单元级正确性闸门，失败回流 `DESIGNING`。
- `VERIFY-INTEGRATION`：系统测试闸门，失败回流 `CODING`。
- `REDTEAM`：对抗性审查闸门（攻击面/滥用路径/可利用性），失败回流实现与集成链路。
- `QA`：非对抗质量评分闸门（阈值默认 80），失败按问题类型回流实现/测试/红队。
- `ASSURANCE`：发布前最终放行闸门，覆盖漏洞/压力/安全/回归。

## 4. 阻断处理

### CODING 阻断

- 回流 DESIGNING 修复
- 重新执行 CODING

### VERIFY-INTEGRATION 阻断

- 回流 CODING
- 重新执行 VERIFY-INTEGRATION

### REDTEAM 阻断

- 记录 critical 问题
- 回流 CODING 或 VERIFY-INTEGRATION 修复
- 重新执行 REDTEAM

### QA 阻断

- 若分数不足，回流 CODING 或 VERIFY-INTEGRATION
- 若问题来自对抗风险项，先回流 REDTEAM

### ASSURANCE 阻断

- 漏洞问题：回流 DEPLOYMENT
- 压力问题：回流 QA（指标与容量调整）
- 安全问题：回流 REDTEAM/DEPLOYMENT
- 回归问题：回流 DELIVERY 或 QA

## 5. 最小产物清单

- `docs/runs/<run-id>/DISCOVERY.phase-result.json`（含 `prdDelta`）
- `docs/runs/<run-id>/INTELLIGENCE.phase-result.json`（含 PRD 版本与 `prdDelta`）
- `docs/runs/<run-id>/<branch-id>/DESIGNING.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/CODING.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/VERIFY-INTEGRATION.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/REDTEAM.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/QA.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/DEPLOYMENT.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/ASSURANCE.phase-result.json`
- `docs/runs/<run-id>/workflow-summary.md`
- `docs/runs/<run-id>/delivery-manifest.json`
- `docs/runs/<run-id>/delivery-report.md`
- `docs/runs/<run-id>/artifacts/release.zip`

路径与命名的正式规范见：`../runs/README.md`

## 5.1 PRD 分支最小 docs 初始化

- 对新模块或首次进入分支执行的模块，PRD 审核通过后的第一动作应是询问当前阶段 `ChiefProductOfficer`；`CEOChiefOfStaff` 只负责公司级任务分派、催办、升级与收口，而不是直接替产品侧判断模块设计、归属方案与目标落位点。
- 归属解析完成后，应在目标落位点补齐 `模块六层文档协同系统` 的最小入口。
- 若 PRD 描述的是既有模块能力，则最小入口应补在该模块根；若描述的是新模块，则应先建立新模块根；只有项目根自身范围，才应补在当前项目根 `docs/`。
- 推荐直接参考 `prd-branch-minimal-directory-template.md` 创建目录和占位文件。
- 最低要求不是“把内容一次写满”，而是先保证后续 `DESIGNING -> ASSURANCE` 的产物在正确落位点上有稳定落位与引用入口。

## 5.2 PRD 归属路由请求

当 PRD 已审核，或已明确会驱动 docs bootstrap，但以下任一情况成立时，必须先发起一次标准 `PRD_OWNERSHIP_ROUTING` 请求，而不是直接创建目录、补写五层 docs 或默认落在当前仓根：

- 候选归属模块不止一个。
- 不确定应落在既有模块、TriMetaverse 项目根，还是一个新模块。
- 目标仓、目标 `docs/` 根或执行层 `workstream` 命名尚未确定。
- 归属判断可能改变既有模块边界、中央层范围或长期模块设计。

当前阶段的标准流程：

1. 发起人使用 `PRD_OWNERSHIP_ROUTING` 对象向 `ChiefProductOfficer` 提交请求；如输入仍是零散自然语言，可由秘书处或 `CEOChiefOfStaff` 先补齐字段，但不代替产品侧做归属判断。
2. 请求至少包含：`prdRef`、`requestReason`、`candidateModules`、`candidateRoots`、`currentEvidence`、`blockingImpact`、`requestedDecisionBy`。
3. `ChiefProductOfficer` 核查项目真源、模块产品真源和相关 registry；如涉及新的长期主模块、中央边界或模块边界变化，再先询问 `BusinessStrategy`。
4. `ChiefProductOfficer` 返回最小路由结论：`routingDecision`、`targetModuleOrProject`、`targetRepoRoot`、`targetDocsRoot`、`moduleDesignDecision`、`docsLandingDecision`、`requiredEscalations`。
5. `CEOChiefOfStaff` 基于产品侧结论承担公司级任务分派、排程、催办、升级与收口，不再重复做模块设计与归属判断。
6. 在这份路由结论形成前，PRD 分支不得进入 docs bootstrap、最小目录初始化或执行层落盘。

补充边界：

- `PRD_OWNERSHIP_ROUTING` 只解决“归属谁、落哪里、谁来接”的问题，不默认等于 `CENTRAL_REGISTRY_CLOSEOUT`。
- 只有在已经触发跨模块正式事实回写、中央边界收口或治理层同步时，才升级进入 `CENTRAL_REGISTRY_CLOSEOUT`。
- 若路由结论进一步触发岗位 / 职责交接、handoff checklist 或 completion tracking，流程设计与完成度监督由 `ChiefHumanResourcesOfficer` 主责；在其尚未独立上岗前，由 `CEOChiefOfStaff` 临时代管。
- `ChiefHumanResourcesOfficer` 或其他新增固定员工的启用，应先走 `TriCompany` 源侧岗位 / 员工定义、源侧五件套、support object、shadow gate / validation、live binding、governance 回填，而不是直接在 live 宿主宣称到岗。

### 5.2.1 `ChiefProductOfficer` 主受理前提

- `ChiefProductOfficer` 已在当前 Copilot-host live 阶段上岗，且源侧岗位定义已经建立。
- 当前问题的核心仍是模块设计、产品边界、归属模块 / 项目或目标 docs 落位，而不是具体实现拆解。
- 产品真源、模块成熟度和商业边界证据已足以支撑产品判断。
- 期望输出是 `ownershipDecision`、`moduleDesignDecision`、`docsLandingDecision`，并可能继续形成 `MVP_DEFINITION`。
- 若仍触及中央战略、长期模块边界或正式宿主范围，则先由 `BusinessStrategy` 做范围裁决，再由 `ChiefProductOfficer` 形成产品侧结论。

### 5.2.2 `ChiefProductOfficer` -> `ChiefTechnologyOfficer` 接手条件

只有在以下条件同时满足时，`PRD_OWNERSHIP_ROUTING` 才应从产品侧切到技术侧：

- `ChiefProductOfficer` 的归属结论已经形成，目标模块 / 项目与目标 docs 落位已确认。
- 当前问题已从“归属谁”转为“在已确认模块中如何技术落地”，例如执行层 `workstream` 命名、工程入口、测试 / 发布前置条件、docs 初始化任务拆解。
- 产品范围、预算约束和冻结条件已经明确，不需要 CTO 代替产品侧重做模块归属判断。
- 期望输出已经转成技术对象，例如 `ENGINEERING_TASK`、技术 readiness 结论或最小 docs 初始化任务拆解。
- 若模块归属、中央边界或长期模块设计仍未稳定，则不得切给 `ChiefTechnologyOfficer`，而应继续停留在 `ChiefProductOfficer` / `BusinessStrategy` 路径。

### 5.2.3 公司级协调与交接治理边界

- `CEOChiefOfStaff` 只负责公司级任务分派、排程、催办、升级与跨域收口，不再代替产品侧做 PRD 归属判断。
- `ChiefHumanResourcesOfficer` 主责跨岗位职责交接流程设计、handoff checklist 与完成度监督；当前未独立上岗前，相关治理仍由 `CEOChiefOfStaff` 临时代管。

## 6. 实验模式说明

- 全自动 10 Agent 模式仅用于流程实验
- 生产交付建议使用“研发工作流 + 子 Agent 并行”模式

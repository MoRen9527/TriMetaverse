# WorkflowEngine 规范（TriMetaverse）

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/integrated-product-development-flow.md
- publishedFrom: TriCompany/docs/workflow/integrated-product-development-flow.md
- syncMode: published-summary
- publishTier: release-side-summary
- lastSyncedAt: 2026-06-03

## 0. 统一词汇规范

- 统一词汇源：`docs/workflow/terminology.md`（本节为摘要，详细定义以该文件为准）。
- CODING 阶段标准产物名称固定为“产品实施总结”。
- “产品实施文档”“实施产物”“产品实现文档”均视为非标准别名，后续文档与门禁描述一律使用“产品实施总结”。
- `INTELLIGENCE` 之后各 PRD 分支的标准落地系统固定称为 `模块六层文档协同系统`，即 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/`。
- `branchId` 是通用分支标识，不默认等同于 PRD 分支；只有当它实际指向由 `INTELLIGENCE` 审核签发后产出的 PRD 分支时，才适用 `模块六层文档协同系统` 的最小初始化与 docs bootstrap 硬门禁。
- PRD 分支的 docs bootstrap 必须先拿到归属路由结论；当前阶段由 `ChiefProductOfficer` 主责模块设计与归属方案，`CEOChiefOfStaff` 只负责公司级任务分派、升级与收口。既有模块能力落在对应模块根，新模块先建新模块根，只有项目根自身范围才允许落在当前项目根 `docs/`。
- 文档执行“严格模式”：正式章节禁止使用非标准别名（详见 `docs/workflow/terminology.md` 的 Strict Mode）。

### 0.1 术语变更记录（changelog）

- 2026-04-26：将 PRD 分支的标准文档落地系统正式命名为“模块六层文档协同系统”，并要求 WorkflowEngine 在分支初始化时同步建立最小 docs 入口。
- 2026-04-26：首次补充 PRD 归属路由 gate，避免执行者自行拍板或把当前仓根 docs 误当成默认落点；该规则已在 2026-05-20 按当前 live 上岗状态收敛为 `ChiefProductOfficer` 主责、`CEOChiefOfStaff` 做公司级协调。
- 2026-05-20：根据当前 live 上岗状态，将 PRD 产品归属判断切换为 `ChiefProductOfficer` 主责；`CEOChiefOfStaff` 退回公司级任务分派、催办、升级与收口。
- 2026-04-26：补充 `branchId` 的通用语义，明确 skill、schedule、宿主试运行等对象中的 `branchId` 不默认等同于 PRD 分支，避免误把所有 branch-aware 对象都纳入 PRD docs bootstrap 规则。
- 影响范围：`project.md`、`docs/workflow/project-repo-document-baseline.md`、`docs/workflow/phase-io-matrix.md`、`docs/workflow/review-release-chain.md`、本规范文档、`docs/workflow/workflow-runbook.md`。
- 变更目的：确保 PRD 分支的真源、执行证据、状态回写与流程机制有统一落位，不再散落在临时记录中。
- 2026-03-04：将 CODING 阶段主产物标准名统一为“产品实施总结”。
- 影响范围：`project.md`、`tmv-whitepaper.md`、`docs/workflow/review-release-chain.md`、`docs/workflow/phase-io-matrix.md`、本规范文档。
- 变更目的：消除同义词漂移，确保主因果链与阶段输出命名一致，提升门禁审计可追溯性。

## 1. 目标

将 `project.md` 中定义的 10 阶段流程变为可执行编排规范，确保：

- 阶段顺序可控（串行）
- 阶段内任务可并行（子 Agent）
- 门禁可判定（VERIFY/REDTEAM/QA/ASSURANCE）
- 失败可回流（带重试与阻断）
- INTELLIGENCE 后可按 PRD 分叉执行子流水线
- 支持 DISCOVERY/INTELLIGENCE 的内容增量传导与 INTELLIGENCE 的 PRD 决策产出
- 支持 DISCOVERY -> INTELLIGENCE -> DESIGNING 顺序审核发布链（必须人工审核通过，且满足“首次有版本号/非首次版本号变更”）
- 支持 PRD 分支通过 `模块六层文档协同系统` 统一落地，并让各阶段产物默认进入对应 docs 层
- 明确因果链：白皮书（项目级） -> PRD（产品级） -> 设计规格（Spec，设计级） -> 产品实施总结（实施级） -> 单元测试报告（单元测试级） -> 集成测试报告（测试级） -> 红队扫描报告（安全测试级） -> QA报告（质量评估级） -> 部署手册（发布级） -> Assurance报告（保障级） -> 交付验收报告（交付级）
- 支持“流程优化 -> 验证桩验证 -> 公司级 IPD 基线更新 -> 新实例自动复用”的闭环；优化结果默认回写公司基线，而不是只沉淀在某个单独实例中

## 1.1 基线与实例的治理关系

- `TriCompany/docs/workflow/integrated-product-development-flow.md` 负责赛博公司 IPD 流程真源；它定义公司级 IPD 流程、阶段 contract、门禁和发布链。
- `TriCompany/runtime/cognition/ipd_case_engine.py` 与相关 validation 负责公司侧可执行基线；它承接 TriCompany 的书面流程真源，形成可运行的 automation contract。
- `TriMetaverse/docs/workflow/*.md` 在该主题下只承担发布侧摘要、跨模块对齐、制度镜像或 registry 协调，不是赛博公司 IPD 的主真源。
- 各 `IPD-*` case / run / proving-ground instance 只是基线的消费面和验证面，不是流程真源。
- 因此，流程优化一旦在验证桩验证通过，默认动作应是先更新 TriCompany 的书面流程真源与公司侧可执行基线，再让后续新创建的 IPD 实例自动继承；TriMetaverse 只在需要发布侧同步时再追平摘要或制度镜像。
- 只有特殊旧实例、已冻结实例或历史回放实例，才允许按差异做手动合入或人工补丁；该类回写不得替代基线更新。

## 2. 核心对象

### Phase

- DISCOVERY
- INTELLIGENCE
- DESIGNING
- CODING
- VERIFY-INTEGRATION
- REDTEAM
- QA
- DEPLOYMENT
- ASSURANCE
- DELIVERY

### PRDBranch

- 由 INTELLIGENCE 产出的每个 PRD 形成一个独立分支（`branchId`）
- 每个分支按固定顺序执行：DESIGNING → CODING → VERIFY-INTEGRATION → REDTEAM → QA → DEPLOYMENT → ASSURANCE
- 每个分支在进入 `DESIGNING` 前，必须先拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，并在该结论对应的目标模块或项目根下完成 `模块六层文档协同系统` 的最小初始化，至少保证对应模块已具备产品、技术、执行、registry、workflow、training 六层 docs 入口
- 分支之间允许并行，分支内部严格串行
- 对 `SKILL_SPEC`、`SCHEDULE_SPEC` 或宿主试运行对象里的 `branchId`，除非它们实际绑定某个 PRD 分支并直接治理 docs-backed 的实现链，否则不按本节的 `PRDBranch` 初始化规则处理

### PRDDelta

- 记录每阶段新增/更新/归档的 PRD 变化集合
- 用于触发下游增量刷新与新分支创建
- 由 `PhaseResult.prdDelta` 持久化

### PhaseState

- pending
- running
- blocked
- failed
- completed

### PhaseResult

按 `phase-result.schema.json` 统一结构输出。

### GateDecision

- pass
- block
- skip

### ReviewDecision

- draft
- submitted
- approved
- rejected

## 3. 研发工作流执行算法（简化）

1. 读取 `workflow-engine-config.yaml`
2. 按 `phases` 顺序遍历执行
3. 执行 `DISCOVERY`
4. 校验 `DISCOVERY.review.status=approved`，且版本由人工审核签发并满足 `review.isInitialRelease=true` 或 `review.versionChanged=true`（`WP-v*`），否则阻断
5. 执行 `INTELLIGENCE`
6. 校验 `INTELLIGENCE.review.status=approved`，且版本由人工审核签发并满足 `review.isInitialRelease=true` 或 `review.versionChanged=true`（`PRD*-v*`，PRD 版本），否则阻断
7. 执行 `DESIGNING`
8. 校验 `DESIGNING` 所需输入（PRD/原型）完整性与设计产出一致性，不满足则阻断
9. 若 `DISCOVERY` 检测到白皮书增量（`whitepaperChanged=true`）：仅触发 `INTELLIGENCE` 内容增量刷新
10. 若 `INTELLIGENCE` 检测到需求增量（`intelligenceChanged=true`）：更新 PRD 注册表并创建/更新 `PRDBranch[]`
11. 仅在 `INTELLIGENCE` 判定并产出 PRD 增量（含手工新增）时，允许新增分支
12. 创建或更新分支时，先向当前阶段 `ChiefProductOfficer` 请求归属路由；`CEOChiefOfStaff` 只负责公司级任务协调。若涉及新的长期主模块或边界变化，先经 `BusinessStrategy` 做范围裁决
13. 若尚未形成当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，立即阻断分支初始化
14. 在已确认的目标落位点上，校验并补齐 `模块六层文档协同系统` 的最小 docs 入口；若未完成，则阻断分支初始化
15. 从最新 PRD 注册表枚举可执行分支并启动
16. 对每个 PRD 分支并行执行子流水线（分支内部串行）
17. 每阶段执行统一流程：分派主执行 Agent，按 `parallelInPhase` 分配子 Agent 并行子任务，汇总并生成 `PhaseResult`，执行门禁判定
18. 单分支门禁通过则进入该分支下一阶段
19. 单分支门禁阻断则该分支回流修复
20. 全部分支 `ASSURANCE` 通过后，研发工作流进入统一 `DELIVERY`

## 3.1 增量触发规则（简化版）

- `DISCOVERY -> downstream`：白皮书更新后，仅向下刷新 `INTELLIGENCE` 内容，不在本阶段决定是否产出 PRD。
- `INTELLIGENCE decision`：由 INTELLIGENCE 基于需求分析决定是否新增/更新 PRD；新增后先拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，并完成分支最小 docs 初始化，再进入 DESIGNING。
- `DESIGNING -> downstream`：设计变更只影响对应 PRD 分支后续阶段（CODING 及之后）。
- 新增 PRD 只触发新增分支；已通过分支保持状态不变，除非被显式标记受影响。

## 3.2 顺序审核发布链（硬门禁）

- `DISCOVERY`：白皮书必须人工审核通过后签发 `WP-v*`；首次要求存在版本号，非首次要求版本号变更，才允许进入 `INTELLIGENCE`。
- `INTELLIGENCE`：需求产物必须人工审核通过后签发 PRD 版本（如 `PRD001-v1.0.0`）；首次要求存在版本号，非首次要求版本号变更；仅满足该条件的 PRD 可创建分支。
- `PRDBranch init`：PRD 已审核后，必须先拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，并在已确认落位点完成 `模块六层文档协同系统` 的最小落位；若该结论未形成，则不得视为正式进入 `DESIGNING`。
- `DESIGNING`：必须基于已审核 PRD 与原型推进，并产出完整设计资产，才允许进入 `CODING`。
- 任一阶段审核未通过、缺少版本号、或非首次但版本未变更，研发工作流抛出 `QualityGateError` 并阻断后续阶段。

## 3.3 流程优化与基线回写规则

- `WORKFLOW-*` 类 case 可用于流程优化实验，不直接等同于产品交付主线。
- `PLATFORM-*` proving-ground case 可用于实例级验证，证明某项流程优化已经能跑出真实 stage output、signoff、release version 与 evidence。
- 一旦验证通过，必须先更新公司级 IPD 基线：
  - 书面真源层：`TriCompany/docs/workflow/integrated-product-development-flow.md` 及相关 TriCompany workflow 文档
  - 公司执行层：`TriCompany/runtime/cognition/ipd_case_engine.py` 及相关 validation contract
  - 发布侧同步层：仅在需要对外发布或跨模块对齐时，再同步 `TriMetaverse/docs/workflow/*.md`
- 新创建的 IPD 实例默认直接继承更新后的基线，不再单独手工吸收相同优化。
- 对已存在且仍需继续推进的旧实例，可按需要人工判断是否补齐基线差异；这属于历史实例迁移问题，不改变“基线先更新”的默认顺序。

## 4. 门禁规则

### CODING

- 存在阻断级编码或单元测试失败时，立即 `block`

### VERIFY-INTEGRATION

- 存在阻断级集成测试失败时，立即 `block`

### REDTEAM

- 若存在 `critical`，立即 `block`
- 仅针对对抗性风险（攻击面、滥用路径、可利用性）

### QA

- 默认阈值 80
- 可通过参数覆盖阈值
- 可配置允许跳过（实验模式）
- 仅对非对抗质量维度评分（文档/代码质量/性能基线/测试完整度）

### ASSURANCE

- 必须包含：漏洞、压力、安全三类报告，可选附加系统级回归测试。
- 任一高危/严重项触发 `block`
- 定位为发布前最终放行闸门，不替代 REDTEAM 对抗审查

## 5. 异常模型

- `QualityGateError`：门禁失败
- `ArtifactMissingError`：必需产物缺失
- `DeploymentInvalidError`：部署资产校验失败

## 6. 回流策略

- CODING 阻断：回流 DESIGNING
- VERIFY-INTEGRATION 阻断：回流 CODING（由失败类型决定）
- REDTEAM 阻断：回流 CODING 或 VERIFY-INTEGRATION（由风险来源决定）
- QA 阻断：回流 CODING、VERIFY-INTEGRATION 或 REDTEAM（由问题类型决定）
- DEPLOYMENT 阻断：回流 CODING 或 QA（由问题类型决定）
- DELIVERY 阻断：回流 DEPLOYMENT
- ASSURANCE 阻断：回流 QA 或 DEPLOYMENT（由问题类别决定）

## 7. 分支聚合规则

- `any branch blocked`：研发工作流状态为 `blocked`，但允许其他分支继续执行。
- `any branch failed`：研发工作流状态为 `failed`，需人工确认后重试。
- `all branches assurance passed`：允许生成统一交付物并进入发布候选。
- `delivery` 只执行一次，输入为所有分支已通过的产物集合。
- `new prd introduced`：仅新增分支进入执行，其他分支按影响分析决定是否补跑。

## 8. 证据留存

每阶段至少保留：

- PhaseResult JSON
- 关键产物路径
- 门禁判定结果
- 错误与回流说明

标准输出目录：`docs/runs/<run-id>/`

稳定布局约定：

- `docs/runs/<run-id>/DISCOVERY.phase-result.json`
- `docs/runs/<run-id>/INTELLIGENCE.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/DESIGNING.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/CODING.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/VERIFY-INTEGRATION.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/REDTEAM.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/QA.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/DEPLOYMENT.phase-result.json`
- `docs/runs/<run-id>/<branch-id>/ASSURANCE.phase-result.json`
- `docs/runs/<run-id>/DELIVERY.phase-result.json`
- `docs/runs/<run-id>/workflow-summary.md`

详细目录规范见：`../runs/README.md`

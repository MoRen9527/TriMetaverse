# WorkflowEngine Assets

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/README.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-03

本目录提�?`project.md` 的可执行化资产，用于 `TriMC` 统一运行面串行推�?10 阶段研发流程，并支持阶段内子 Agent 并行�?

当前文件是 TriMetaverse workflow 目录的本地索引真源，只负责说明当前目录下的协议、模板、样例、审计与发布侧摘要资产如何分工。它不是 TriCompany 公司级 workflow 书面主真源，也不替代具体子页面各自声明的 source / summary / audit 边界。

## 目录治理规则

当前 `TriMetaverse/docs/workflow/` 下的页面，默认只允许落入以下三类：

1. `source-only` 本地协议 / 模板 / 索引 / 运行手册真源：用于维护 `TriMetaverse` 自己的 workflow 协议、schema 配套说明、模板、样例、runbook、术语、图示和执行清单。
2. `release-side-summary` 发布侧摘要：用于镜像 `TriCompany` 的公司级 workflow、岗位规则、秘书处机制、host-assets 治理摘要或其他已在 `TriCompany` 有明确源侧真源的页面。
3. `audit-record` 审计 / 经营记录：用于维护 operating records、phase evidence、baseline、archive 索引和其他真实执行留痕。

不再使用 `central-summary` 作为默认文档定位。若某页本质属于公司级制度、岗位规则或 source-side workflow 真源，应优先回到 `TriCompany`；若某页本质属于 `TriMetaverse` 自己的协议、模板、样例或运行说明，则应直接标记为本地真源，而不是伪装成“中央真源摘要页”。

## 真源判断顺序

新增或改写 `workflow` 文档时，默认按以下顺序判断：

1. 先判断该内容是否已经在 `TriCompany/docs/workflow/`、`TriCompany/docs/engineering/`、`TriCompany/docs/registry/` 或对应 runtime / manifest 中有明确 source-side 真源。
2. 若已存在明确 TriCompany 真源，则当前页只保留发布侧摘要、跨模块引用、镜像说明或中央执行视角，不再自称公司级主真源。
3. 若不存在 TriCompany 单一真源，但页面本身属于 `TriMetaverse` 的 workflow 协议、运行手册、模板、样例、图示、迁移表、清单或索引，则当前页直接作为本地真源维护。
4. 若页面记录的是 operating record、phase evidence、baseline、archive 或当前宿主执行证据，则归入审计层，而不是公司级书面真源。

## 维护禁则

- 不要把 `TriMetaverse/docs/workflow/` 重新写成 `TriCompany` 公司级 workflow 书面主真源。
- 不要为了“统一口径”硬把本地协议页伪造出一个并不存在的 `TriCompany` 单一真源。
- 不要把模板、样例、runbook、PR 文案、迁移对照表或目录索引继续标成 `central-summary`。
- 不要把 support root 物理路径写成公司级 workflow 的默认真源入口；涉及 published-copy、host object、support payload 时，优先回指 `TriCompany` 源侧规则与 manifest。

当前阶段，研发工作流先由 `copilot chat` 试运行；�?`TriMetaverse V1 正式上线切换阶段`，通过 `TriModel` 接入�?`TriMC` 为核心的正式运行面。`Tride` 保留�?PC 端软件的开发工具层，不再作为切换后的正式宿主�?

当前执行模型：`DISCOVERY -> INTELLIGENCE` 主线完成后，按每�?PRD 分叉执行子流水线（`DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`），最后汇总到统一 `DELIVERY`�?

## 文件清单

- `wsdd-v1.md`：方法论总览（最小术�?+ 流程�?+ 一页清单）
- `phase-io-matrix.md`�?0阶段输入/判断/输出/回流矩阵
- `workflow-engine-spec.md`：研发工作流引擎规范（状态机、门禁、回流）
- `workflow-engine-config.example.yaml`：流程配置样�?
- `workflow-host-integration.md`：研发工作流宿主自动落盘规范
- `workflow-host-run-state.schema.json`：宿�?run-state 结构
- `workflow-host-review-state.schema.json`：宿�?review-state 结构
- `tride-model-adoption-checklist.md`：PC 端开发工具接入改造清单
- `workflow-run-metadata.schema.json`：run 元信息结�?
- `phase-result.schema.json`：阶段结果统一结构
- `quality-gates.schema.json`：门禁规则结�?
- `../runs/README.md`：真实执行记录与稳定 `PhaseResult` 产物目录规范
- `tricompany-handoff-objects.md`：赛博公司经营层标准交接对象目录
- `tricompany-handoff-envelope.schema.json`：赛博公司交接对象基础结构
- `tricompany-phase-link.schema.json`：经营对象到研发阶段的桥接引用结�?
- `tricompany-phase-bridge.md`：经营对象与 `PhaseResult` 的桥接规范，�?branch-aware 对象�?docs bootstrap 约定
- `board-directive.schema.json`：目标令结构
- `operating-plan.schema.json`：经营计划单结构
- `budget-check.schema.json`：预算校验单结构
- `demand-intake.schema.json`：需求输入单结构
- `mvp-definition.schema.json`：MVP 定义单结�?
- `engineering-task.schema.json`：研发任务单结构
- `sales-progress.schema.json`：销售推进单结构
- `operating-review.schema.json`：经营复盘单结构
- `risk-escalation.schema.json`：风险升级单结构
- `central-registry-closeout.schema.json`：中�?registry 收口单结�?
- `prd-ownership-routing.schema.json`：PRD 归属路由请求单结�?
- `responsibility-handoff.schema.json`：岗位职责交接单结构
- `prd-ownership-routing-intake-template.md`：PRD 归属路由的自然语言 intake 模板
- `responsibility-handoff-intake-template.md`：岗位职责交接的自然语言 intake 模板
- `handoff-templates/`：赛博公司经营层交接对象填写样板
- `tricompany-operating-workflow.md`：赛博公司经营主工作流骨�?
- `central-registry-closeout-workflow.md`：中�?registry 收口工作流与四层记忆映射
- `../../.github/prompts/中央收口输出模板.prompt.md`：`CEOChiefOfStaff` 的中央收口最终回复模板，与中央收�?prompt �?closeout JSON 样板对齐
- `module-registry-baseline-rollout-plan.md`：中�?registry 先行、模块逐仓摸底、教程化产物与长期续跑计�?
- `tricompany-secretariat.md`：赛博公司秘书处机制与会议文档治理规�?
- `operating-cycle-example/`：赛博公司经营主工作流首轮样例包
- `operating-records/`：赛博公司经营层真实执行记录目录（与样例目录分开�?
- `workflow-runbook.md`：运行与故障处理手册
- `layer-callgraph.md`：分层图与调用关�?
- `prd-branch-delivery-checklist.md`：PRD 分叉执行落地清单
- `prd-branch-minimal-directory-template.md`：PRD 分支最小目录样板，可直接用于新模块初始�?`模块六层文档协同系统`
- `review-release-chain.md`：顺序审核发布链（硬门禁�?
- `waterfall-migration-mapping.md`：旧阶段名到新阶段名迁移对照�?
- `pr-description-waterfall-alignment.md`：瀑布对齐修正 PR 描述模板
  - 快速入口：使用该文件顶部“最终直接使用版（推荐）”中�?PR 标题/首句/Commit/Squash 文案
- `pr-final-ready.md`：最终发布文案纯净版（可直接粘贴）

## 引用纪律

- `handoff-templates/` �?`operating-cycle-example/` 只作为结构样板、演示对象或 workflow companion asset 使用，不能单独当作项目事实、正式经营记录或模块已确认结论引用�?
- 涉及当前 TriCompany 宿主治理、published-copy、runbook �?phase 证据时，默认先回 `TriCompany/` 真源、`TriCompany/.github/manifests/tricompany-published-copy-manifest.json` �?`tricompany-copilot-host-assets-governance.md`；只有确实需�?operator-runbook、phase-evidence、archive-index 或已发布 support 副本时，才补 `TriCompany-copilot-host-assets/**` 路径�?
- 若要组织中央 registry 收口，优先按 `central-registry-closeout-workflow.md` �?source-first 规则组装证据，而不是直接把 support root 物理路径写成默认入口�?

## 使用顺序

1. �?`workflow-engine-config.example.yaml` 定义本轮流程参数
2. 执行阶段时输�?`PhaseResult` 并校�?`phase-result.schema.json`
3. 门禁判定�?`quality-gates.schema.json`
4. 出现阻断时按 `workflow-runbook.md` 回流处理
5. 若要组织中央 registry 收口，先�?`central-registry-closeout-workflow.md` �?`handoff-templates/central-registry-closeout.example.json`，最终回复再对齐 `../../.github/prompts/中央收口输出模板.prompt.md`
6. �?PRD 归属未明、docs bootstrap 无法安全启动，先�?`workflow-runbook.md`、`prd-ownership-routing-intake-template.md` �?`handoff-templates/prd-ownership-routing.example.json`
7. 若要直接向总助发起自然语言归属路由请求，可使用 `../../.github/prompts/PRD归属路由.prompt.md`
8. 若岗位启用、职责移交或 acting owner 切换需要结构化跟踪，先�?`responsibility-handoff-intake-template.md`、`handoff-templates/responsibility-handoff.example.json` �?`TriCompany/docs/workflow/chief-human-resources-officer-handoff-governance.md`

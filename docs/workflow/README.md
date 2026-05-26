# WorkflowEngine Assets

本目录提供 `project.md` 的可执行化资产，用于 `TriMC` 统一运行面串行推进 10 阶段研发流程，并支持阶段内子 Agent 并行。

当前阶段，研发工作流先由 `copilot chat` 试运行；到 `TriMetaverse V1 正式上线切换阶段`，通过 `TriHost` 接入以 `TriMC` 为核心的正式运行面。`Tride` 保留为 PC 端软件的开发工具层，不再作为切换后的正式宿主。

当前执行模型：`DISCOVERY -> INTELLIGENCE` 主线完成后，按每个 PRD 分叉执行子流水线（`DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`），最后汇总到统一 `DELIVERY`。

## 文件清单

- `wsdd-v1.md`：方法论总览（最小术语 + 流程图 + 一页清单）
- `phase-io-matrix.md`：10阶段输入/判断/输出/回流矩阵
- `workflow-engine-spec.md`：研发工作流引擎规范（状态机、门禁、回流）
- `workflow-engine-config.example.yaml`：流程配置样例
- `workflow-host-integration.md`：研发工作流宿主自动落盘规范
- `workflow-host-run-state.schema.json`：宿主 run-state 结构
- `workflow-host-review-state.schema.json`：宿主 review-state 结构
- `tride-host-adoption-checklist.md`：PC 端开发工具接入改造清单（历史文件名保留）
- `workflow-run-metadata.schema.json`：run 元信息结构
- `phase-result.schema.json`：阶段结果统一结构
- `quality-gates.schema.json`：门禁规则结构
- `../runs/README.md`：真实执行记录与稳定 `PhaseResult` 产物目录规范
- `cyber-company-handoff-objects.md`：虚拟公司经营层标准交接对象目录
- `cyber-company-handoff-envelope.schema.json`：虚拟公司交接对象基础结构
- `cyber-company-phase-link.schema.json`：经营对象到研发阶段的桥接引用结构
- `cyber-company-phase-bridge.md`：经营对象与 `PhaseResult` 的桥接规范，含 branch-aware 对象的 docs bootstrap 约定
- `board-directive.schema.json`：目标令结构
- `operating-plan.schema.json`：经营计划单结构
- `budget-check.schema.json`：预算校验单结构
- `demand-intake.schema.json`：需求输入单结构
- `mvp-definition.schema.json`：MVP 定义单结构
- `engineering-task.schema.json`：研发任务单结构
- `sales-progress.schema.json`：销售推进单结构
- `operating-review.schema.json`：经营复盘单结构
- `risk-escalation.schema.json`：风险升级单结构
- `central-registry-closeout.schema.json`：中央 registry 收口单结构
- `prd-ownership-routing.schema.json`：PRD 归属路由请求单结构
- `responsibility-handoff.schema.json`：岗位职责交接单结构
- `prd-ownership-routing-intake-template.md`：PRD 归属路由的自然语言 intake 模板
- `responsibility-handoff-intake-template.md`：岗位职责交接的自然语言 intake 模板
- `handoff-templates/`：虚拟公司经营层交接对象填写样板
- `cyber-company-operating-workflow.md`：虚拟公司经营主工作流骨架
- `central-registry-closeout-workflow.md`：中央 registry 收口工作流与四层记忆映射
- `../../.github/prompts/中央收口输出模板.prompt.md`：`CEOChiefOfStaff` 的中央收口最终回复模板，与中央收口 prompt 和 closeout JSON 样板对齐
- `module-registry-baseline-rollout-plan.md`：中央 registry 先行、模块逐仓摸底、教程化产物与长期续跑计划
- `cyber-company-secretariat.md`：虚拟公司秘书处机制与会议文档治理规则
- `operating-cycle-example/`：虚拟公司经营主工作流首轮样例包
- `operating-records/`：虚拟公司经营层真实执行记录目录（与样例目录分开）
- `workflow-runbook.md`：运行与故障处理手册
- `layer-callgraph.md`：分层图与调用关系
- `prd-branch-delivery-checklist.md`：PRD 分叉执行落地清单
- `prd-branch-minimal-directory-template.md`：PRD 分支最小目录样板，可直接用于新模块初始化 `模块五层文档协同系统`
- `review-release-chain.md`：顺序审核发布链（硬门禁）
- `waterfall-migration-mapping.md`：旧阶段名到新阶段名迁移对照表
- `pr-description-waterfall-alignment.md`：瀑布对齐修正 PR 描述模板
  - 快速入口：使用该文件顶部“最终直接使用版（推荐）”中的 PR 标题/首句/Commit/Squash 文案
- `pr-final-ready.md`：最终发布文案纯净版（可直接粘贴）

## 引用纪律

- `handoff-templates/` 与 `operating-cycle-example/` 只作为结构样板、演示对象或 workflow companion asset 使用，不能单独当作项目事实、正式经营记录或模块已确认结论引用。
- 涉及当前 TriCompany 宿主治理、published-copy、runbook 或 phase 证据时，默认先回 `TriCompany/` 真源、`TriCompany/.github/manifests/tricompany-published-copy-manifest.json` 与 `tricompany-copilot-host-assets-governance.md`；只有确实需要 operator-runbook、phase-evidence、archive-index 或已发布 support 副本时，才补 `TriCompany-copilot-host-assets/**` 路径。
- 若要组织中央 registry 收口，优先按 `central-registry-closeout-workflow.md` 的 source-first 规则组装证据，而不是直接把 support root 物理路径写成默认入口。

## 使用顺序

1. 按 `workflow-engine-config.example.yaml` 定义本轮流程参数
2. 执行阶段时输出 `PhaseResult` 并校验 `phase-result.schema.json`
3. 门禁判定按 `quality-gates.schema.json`
4. 出现阻断时按 `workflow-runbook.md` 回流处理
5. 若要组织中央 registry 收口，先看 `central-registry-closeout-workflow.md` 与 `handoff-templates/central-registry-closeout.example.json`，最终回复再对齐 `../../.github/prompts/中央收口输出模板.prompt.md`
6. 若 PRD 归属未明、docs bootstrap 无法安全启动，先看 `workflow-runbook.md`、`prd-ownership-routing-intake-template.md` 与 `handoff-templates/prd-ownership-routing.example.json`
7. 若要直接向总助发起自然语言归属路由请求，可使用 `../../.github/prompts/PRD归属路由.prompt.md`
8. 若岗位启用、职责移交或 acting owner 切换需要结构化跟踪，先看 `responsibility-handoff-intake-template.md`、`handoff-templates/responsibility-handoff.example.json` 与 `TriCompany/docs/workflow/chief-human-resources-officer-handoff-governance.md`

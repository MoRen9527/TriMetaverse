# TriMetaverse Company Governance State

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/company-governance-state.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

## Registry Overview

- 当前文件是 TriMetaverse 中央 `CompanyGovernanceRegistry` 工作层的本地真源，只维护中央治理摘要、owner 分工状态和公司治理登记；它不是 TriCompany 公司级 workflow 书面真源。

- `CompanyGovernanceRegistry` 是 TriMetaverse 的公司治理资料 registry。
- 它负责维护组织结构、岗位边界、CHO/CAO 边界、行政制度、秘书处机制、会议文档治理、agent 发布纪律和相关归属状态。
- 它不是产品事实 registry，也不替代白皮书、公司组织真源或 workflow 文档。

## Current Scope

- 维护 CAO / 公司治理职责范围与资料归属，并区分 CHO 的人力资源、岗位启用和职责交接治理范围。
- 维护秘书处机制、会议制度、纪要归档和会后回填规则的当前状态。
- 维护岗位地图、招聘 / 试岗规则、角色评分卡、组织制度和文档治理规则。
- 维护各岗位入职前的 JD 基线要求，以及当前哪些岗位已经具备明确岗位职责。
- 维护 agent discovery 发布纪律：中央级 agent 与模块级 registry agent 必须有明确 canonical source、唯一 discoverable target 和退役记录。
- 维护跨模块 `模块六层文档协同系统` 的治理基线，明确新模块默认采用 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/` 六层结构，并允许低成熟模块先以占位文件接入。

## Current Ownership

- 本节是 TriMetaverse 工程侧实施摘要；registry owner 分工的源侧规则落在 `../../../TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md`、`../../../TriCompany/docs/registry/product-state.md`、`../../../TriCompany/docs/registry/code-state.md` 与 `../../../TriCompany/docs/workflow/chief-administrative-officer-role.md`。
- 秘书处职能归 CAO（Chief Administrative Officer，行政管理总裁）管理。
- 人力资源、岗位启用、职责交接、handoff checklist 和 completion tracking 归 CHO（Chief Human Resources Officer）侧管理。
- 模块级 `ProductRegistry` 归 CPO（Chief Product Officer，小乔）管理，负责产品事实、用户价值、PRD 归属、能力边界、成熟度与产品状态维护。
- 模块级 `CodeRegistry` 归 CTO（Chief Technology Officer，小狄）管理，负责代码事实、CodeGraph 摘要、技术风险、实现边界、仓库健康与工程门禁维护。
- 中央 `CompanyGovernanceRegistry` 归 CAO 管理，负责公司治理事实、组织制度、岗位边界、秘书处机制和会议治理资料维护。
- 当前 CAO 已在 Copilot-host live 阶段上岗并接管秘书处日常机制、会议制度、纪要归档和行政治理资料归属；当前 CHO 已在 Copilot-host live 阶段上岗并接管职责交接治理执行责任。
- `CEOChiefOfStaff` 保留公司级任务分派、协调、催办、升级与收口职责，不再长期代管 CPO / CTO / CAO / CHO 的 owner 职责；涉及产品、技术或治理 registry 的事项应先路由给对应负责人。
- 真实会议记录仍归入 `docs/workflow/operating-records/`，由秘书处机制负责组织与归档。

## Current Progress

- 已将秘书处机制从 `CEOChiefOfStaff` 的 agent 本体中抽离，落入公司级 workflow 文档。
- 已确认这类组织与制度资料不应由 `TriMetaverseProductRegistry` 维护。
- 已建立首版公司治理资料 registry，用于承接秘书处和组织制度相关资料。
- 已确认后续所有岗位正式入职前必须先具备明确 JD；当前先为 `CEOChiefOfStaff` 补入 JD 风格岗位职责。
- 已确认 TriCompany 的 docs 六层结构适合作为跨模块 `模块六层文档协同系统` 的默认结构；对新模块和低成熟模块，可先建占位文件，再逐步补齐内容。
- 已安排 `ChiefProductOfficer` 与 `ChiefTechnologyOfficer` 在当前 Copilot-host live 阶段上岗：两者沿用既有 `TriMetaverse/.github` live entry，并补齐 TriCompany 源侧五件套、role / employee support object payload 与 manifest 登记；该状态不代表 TriMC 正式宿主切换或完整授权矩阵完成。
- 已确认 `PRD_OWNERSHIP_ROUTING` 的产品归属判断在当前阶段由已上岗的 `ChiefProductOfficer` 主责；`CEOChiefOfStaff` 保留公司级任务分派、催办、升级与收口职责，不再代替产品侧做 PRD 归属判断。
- 已确认跨岗位 / 跨负责人交接流程的设计与完成度监督由当前已上岗的 `ChiefHumanResourcesOfficer` 主责；`CEOChiefOfStaff` 保留公司级协调、催办、升级与收口职责。
- 已确认 `ChiefHumanResourcesOfficer` 或其他新增固定员工的启用，应先从 `TriCompany` 源侧岗位 / 员工定义、源侧五件套、support object、shadow gate / validation、live binding、governance 回填这条链路启动，不得绕过源侧流程直接宣称 live 到岗。
- 已按源侧发布链路启用 `ChiefHumanResourcesOfficer`、`ChiefAdministrativeOfficer` 与 `RAndDTrainer` 当前 Copilot-host live 入口；该状态不代表 TriMC 正式宿主切换或完整授权矩阵生产化。
- 已确认模块级 `BusinessStrategyRegistry`、`ProductRegistry`、`CodeRegistry` 的目标归属是对应模块 `.github/agents/`；迁移时必须先合并中央口径，再移除 `TriMetaverse/.github/agents/` 下同名 discoverable 文件，确保多 root workspace 中单一 discovery。
- 已从 TriCompany 源侧发布并确认 registry 经营 owner 分工：`ProductRegistry` 由 CPO 小乔管理，`CodeRegistry` 由 CTO 小狄管理，中央 `CompanyGovernanceRegistry` 由 CAO 管理；`CEOChiefOfStaff` 只负责路由、协调、催办、升级与中央收口。
- 已启动模块 registry agent 迁移 pilot：`TriAvatar`、`TriStaciss`、`TriMC`、`Tride`、`TriPilot`、`TriDeployment`、`TriTest`、`TriLC`、`TriWeb4`、`TriChain`、`TriMobile`、`TriMem`、`TriDev`、`vscodium`、`TriCompany` 的 `BusinessStrategyRegistry`、`ProductRegistry`、`CodeRegistry` 已以各自模块 `.github/agents/` 为 canonical live entry。

## Bug And Gap State

- CAO / 行政管理侧已进入当前 Copilot-host live 阶段，后续还需要继续补齐秘书处、会议治理、行政流程和治理文档归属模板。
- CHO / 人力资源侧已进入当前 Copilot-host live 阶段并接管职责交接和 staffing governance 执行责任，后续还需要补齐更多交接样例、验收记录和授权矩阵细化。
- 迁移后中央 discovery 仅保留 `CompanyGovernanceRegistry` 与 `TriMetaverse` registry 三件套；`TriCompany/.github/source-agents/` 仍是源侧发布与员工五件套区域，`TriCompany/.github/agents/` 可作为 TriCompany 模块 live discovery 存在，但不得混放 source-agent 草稿或未发布五件套。
- 当前秘书处日常机制与行政治理资料归属已移交 CAO；当前交接治理责任已移交 CHO。
- CPO / CTO 已完成当前 live 上岗绑定，但首轮产品 / 技术接管判断、授权矩阵细化和岗位运行节律仍需继续补证。

## Sources

- `../../tricompany.md`
- `../workflow/tricompany-agent-roles.md`
- `../workflow/tricompany-secretariat.md`
- `../workflow/operating-records/README.md`
- `../../../TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md`
- `../../../TriCompany/docs/workflow/chief-administrative-officer-role.md`
- `../../../TriCompany/docs/registry/product-state.md`
- `../../../TriCompany/docs/registry/code-state.md`

# TriMetaverse Company Governance State

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/company-governance-state.md
- syncMode: source-only
- lastSyncedAt: 2026-07-14T00:33:00+08:00

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
- 维护 `Employee Capability Standard Contract`，定义所有员工的 10 项通用能力条目和管理岗附加项，通过 contract clause 固化宿主迁移保障。

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
- ⚠️ **上岗审批门（2026-07-14 CEO 确认）**：新员工上岗必须以 CHO（Chief Human Resources Officer）审批为正式上岗前提。完成源侧五件套 + contract + binding profile 后，必须经 CHO 审核通过并签字（在 governance records 中落档），方可激活 live agent.md 入口。任何岗位（含 CEOChiefOfStaff、CPO、CTO）不得绕过 CHO 直接启用新员工。此规则修正此前 TestEngineer 上岗流程（已完成但缺少 CHO 审批节点），后续所有新员工一律补齐。
- 已按源侧发布链路启用 `ChiefHumanResourcesOfficer`、`ChiefAdministrativeOfficer` 与 `RAndDTrainer` 当前 Copilot-host live 入口；该状态不代表 TriMC 正式宿主切换或完整授权矩阵生产化。
- 已确认模块级 `BusinessStrategyRegistry`、`ProductRegistry`、`CodeRegistry` 的目标归属是对应模块 `.github/agents/`；迁移时必须先合并中央口径，再移除 `TriMetaverse/.github/agents/` 下同名 discoverable 文件，确保多 root workspace 中单一 discovery。
- 已从 TriCompany 源侧发布并确认 registry 经营 owner 分工：`ProductRegistry` 由 CPO 小乔管理，`CodeRegistry` 由 CTO 小狄管理，中央 `CompanyGovernanceRegistry` 由 CAO 管理；`CEOChiefOfStaff` 只负责路由、协调、催办、升级与中央收口。
- 已记录 CEO 正式名称为「磨人」（2026-07-14，CEO 本人确认）。该名称作为公司治理基础事实写入本 registry，5 个 C-level 合同（CAO/CFO/CHRO/CMO/COO）维持「待命名」。源侧 soul.md 名称字段已同步。
- 已完成 RAndDTrainer（小吴）contract 补齐与 CHO 上岗审批（2026-07-14）：CEO 确认岗位边界为「专属研发的培训人员」。路径治理规则（固定前置核查 item 0 + 工作接手规则）已写入 contract instructions；contract 覆盖专家岗 10 项通用能力条目（9/9 + 路径治理），binding profile（status: generated-staging）与 live entry（TriMetaverse/.github/agents/rd-trainer.agent.md）链路完整。岗位名称：小吴，源侧 employeeId：rd-trainer。
- 已启动模块 registry agent 迁移 pilot：`TriAvatar`、`TriStaciss`、`TriMC`、`Tride`、`TriPilot`、`TriDeployment`、`TriTest`、`TriLC`、`TriWeb4`、`TriChain`、`TriMobile`、`TriMem`、`TriDev`、`vscodium`、`TriCompany` 的 `BusinessStrategyRegistry`、`ProductRegistry`、`CodeRegistry` 已以各自模块 `.github/agents/` 为 canonical live entry。
- 已按源侧发布链路启用 `TestEngineer`（小柯）当前 Copilot-host live 入口：源侧五件套（soul/memory/colleagues/social/agent.md）齐备、`TestEngineer.contract.yaml` 落档、live `.agent.md` 生效、TriCompany binding profile 与 host-object-manifest 登记完成。岗位主责：跨模块测试设计、自动化测试执行、测试框架选型与测试门禁维护。该状态不代表 TriMC 正式宿主切换。
- 已完成全 agent 归属路由阀门治理（2026-07-14）：15 个 `.agent.md` 全部增加 `归属路由阀门` 规则（前置核查 0.5 或等价约束节），明确五大禁止域映射。根因修复：此前 CTO 仅声明"不替代某些岗位"但未列出完整禁止域清单，导致 W28→W29 周度平移时越界执行经营记录。治理防重复机制：`docs/workflow/operating-records/README.md` 周度平移节已标注"本步骤仅限 CEOChiefOfStaff 执行"，形成文档层约束。
- 已完成宿主对象生成编排层设计与代码注册（2026-07-14，CTO-002 完整交付）：
  - 设计文档：`TriCompany/docs/engineering/host-object-generation-design.md`（COPY/SYMLINK/GENERATE 三条路径、5-Gate Pipeline、版本策略）和 `TriMC/docs/engineering/employee-orchestration-design.md`（运行时 Agent 派发编排层）
  - Phase A 代码注册：TestEngineer + FullStackDeveloper `HostObjectSetDefinition` 写入 `runtime/cognition/host_object_generation.py`，`DECLARED_HOST_OBJECT_SETS` 9→11，`EMPLOYEE_GENERATORS` 补全 CMO/COO/CFO 缺口 7→13
  - CLI 验证：`--employee test-engineer`、`--employee full-stack-developer`、`--employee all` 全部通过；publish 流水线验证通过
  - BLOCK-003（员工编排层未设计）已解除
- 已记录经营记录周目录定位硬规则（2026-07-17 CEO 指令）：定位当前 active 周时，必须先列 `operating-records/` 子目录 → 逐目录检查各周 JSON 的 `metadata.latestActiveWeek` 字段 → 仅进入标记为 `true` 的周目录。禁止按日期推算或以惯性跳入任意周目录。此规则同步写入 `CEOChiefOfStaff` 编排文档 §4.10，作为收口审核的硬前置步骤。
- 已记录发布侧同步后置硬规则（2026-07-17 CEO 指令）：修改 TriCompany 源侧文档后，必须反向搜索 `TriMetaverse/docs/` 下 `sourceOfTruth` 指针指向该文件的所有 `published-summary` / `published-copy` 副本，同轮追平并更新 `lastSyncedAt`。禁止以「文档真源统一在 TriCompany/docs/」为由跳过——该口径仅覆盖 `copilot-host-assets` 路径。此规则同步写入 `CEOChiefOfStaff` 编排文档 §4.11。
- 已记录跨 Agent 路由包发送标准操作（2026-07-17 CEO 指令"收口成固定操作"）：CEOChiefOfStaff 向其他 Agent 发送正式 `ENGINEERING_TASK` 时，必须走三件套——路由包（`ET-*.json`）+ 收件箱（`inbox_entries`）+ 发送摘要（`📨` 块格式）。写入 `CEOChiefOfStaff` 编排文档 §4.12。

## Employee Capability Standard Contract

### Purpose

本节定义 TriCompany 所有员工的通用能力条目合约（Engineer Capability Contract），作为 source-agents 五件套的基准约束。每个员工岗位的 source-agent 必须覆盖以下 10 项能力条目，管理岗另加 `中央收口路由` 和 `决策三分法`。

### 通用能力条目（10+2）

| # | 能力项 | 适用 | 演化说明 |
|---|---|---|---|
| 1 | **认知分层约束** | 全员 | soul/memory/colleagues/social 四层契约；统一格式，各岗不混写 |
| 2 | **使命** | 全员 | 工程岗写项目交付使命；产品岗写产品交付使命；技术岗写技术交付使命 |
| 3 | **核心职责** | 全员 | 5-8 条可执行职责；禁止抽象空话 |
| 4 | **当前工作落点** | 全员 | 文档落点路径清单；不同 agent 各自落点不同但格式统一 |
| 5 | **真源系统** | 全员 | 项目真源→产品真源→技术真源；说明真源顺序和交叉引用规则 |
| 6 | **固定前置核查** | 全员 | 含工作路径核查 item 0；核查顺序 5-6 条 |
| 7 | **工作接手规则** | 全员 | 路径核查、修正流程、已知同级模块路径列表、版本差标注 |
| 8 | **行为护栏** | 全员 | 禁止退化成客服；禁止编造未验证事实；禁止在错误路径叠加工作 |
| 9 | **默认输出结构** | 全员 | 3-5 个输出节；管理岗含分诊/路由/收口输出骨架 |
| 10 | **决策三分法** | 管理岗 | APPROVE / FREEZE / ESCALATE + 各条件定义 |
| 11 | **中央收口路由** | 管理岗 | 收口 owner 分工、路由规则、升级链路 |

### 管理岗 vs 专家岗

| 差异点 | 管理岗（CEOChiefOfStaff/CPO/CTO/CAO/CHO/CFO/CMO/COO） | 专家岗（RAndDTrainer） |
|---|---|---|
| 决策权限 | 有决策三分法 | 无独立决策权限，交管理岗裁量 |
| 中央收口 | 有中央收口路由分工 | 无收口 owner 职责 |
| 输出结构 | 含分诊/路由/收口骨架 | 教学协议/技能技艺 |
| 行为护栏 | 含决策边界和升级条件 | 含培训质量护栏 |

### 能力验证 Check

使用以下 checklist 核验任一员工 source-agent 是否覆盖完整：

- [ ] 认知分层约束：四层文件存在（soul/memory/colleagues/social）
- [ ] 使命：可执行、可验证、不超过 4 条
- [ ] 核心职责：5-8 条具体职责
- [ ] 当前工作落点：路径清单，含待初始化标记
- [ ] 真源系统：真源顺序 + 交叉引用
- [ ] 固定前置核查：含 item 0 工作路径核查
- [ ] 工作接手规则：含路径修正流程 + 已知同级模块路径
- [ ] 行为护栏：含禁止退化条款 + 路径核查条款
- [ ] 默认输出结构：3-5 个输出节
- [ ] 决策三分法（管理岗）：APPROVE/FREEZE/ESCALATE 条件定义
- [ ] 中央收口路由（管理岗）：收口 owner + 路由 + 升级链路

### Current Coverage

| 员工 | 能力覆盖率 | 缺口 |
|---|---|---|
| CEOChiefOfStaff | 100% (11/11) | — |
| CPO | 100% (11/11) | — |
| CTO | 100% (11/11) | — |
| CAO | 100% (11/11) | — |
| CHO | 100% (11/11) | — |
| CFO | 100% (11/11) | — |
| CMO | 100% (11/11) | — |
| COO | 100% (11/11) | — |
| RAndDTrainer | 100% (9/9 专家岗) | — |
| TestEngineer | 100% (9/9 专家岗) | — |
| FullStackDeveloper | 100% (9/9 专家岗) | — |

### 宿主迁移保障

- 能力条目合约独立于宿主特定格式（`.agent.md`、`.prompt.md`），在宿主切换时由 contract resolver 解析重建。
- 路径治理规则（固定前置核查 item 0 + 工作接手规则）通过 contract clause 固化，确保跨宿主迁移后不丢失。
- 四层记忆文件（soul/memory/colleagues/social）通过 source-agents 五件套携带，不依赖宿主运行时。

- CAO / 行政管理侧已进入当前 Copilot-host live 阶段，后续还需要继续补齐秘书处、会议治理、行政流程和治理文档归属模板。
- CHO / 人力资源侧已进入当前 Copilot-host live 阶段并接管职责交接和 staffing governance 执行责任，后续还需要补齐更多交接样例、验收记录和授权矩阵细化。
- 迁移后中央 discovery 仅保留 `CompanyGovernanceRegistry` 与 `TriMetaverse` registry 三件套；`TriCompany/.github/source-agents/` 仍是源侧发布与员工五件套区域，`TriCompany/.github/agents/` 可作为 TriCompany 模块 live discovery 存在，但不得混放 source-agent 草稿或未发布五件套。
- 当前秘书处日常机制与行政治理资料归属已移交 CAO；当前交接治理责任已移交 CHO。
- CPO / CTO 已完成当前 live 上岗绑定，但首轮产品 / 技术接管判断、授权矩阵细化和岗位运行节律仍需继续补证。

## Agent Contract-Based Migration Approach

### Permanent Governance Record

- 为应对宿主切换（如 Copilot Chat → Claude Code → TriMC 正式宿主）时 agent 能力可能丢失的风险，采用 **agent contract-based migration approach**：
  - 所有 Role Agent 的核心能力、核查规则、行为护栏、决策权限均以 `<AgentID>.contract.yaml` 形式固化在 `TriCompany/docs/registry/`。
  - Contract 文件采用双轨消费：copilot-host 侧加载验证语义一致性；TriMC v0.2.0 contract resolver 解析注册。
  - 宿主迁移时，新宿主解析 contract 的 `instructions`、`decision_rights`、`tools`、`io_contract` 即可重建 agent 能力骨架，不再依赖 `.agent.md` 或 `.prompt.md` 这类宿主特定格式。
- 路径治理规则（固定前置核查 item 0 与交接路径治理）已写入所有核心岗位的 contract，确保跨宿主迁移后路径核查能力不丢失。

### Contract Files

| Contract | Agent | 路径治理 |
|---|---|---|
| `TriCompany/docs/registry/CEOChiefOfStaff.contract.yaml` | 小贾 (CEO总助) | ✅ 固定前置核查 item 0 + 交接路径治理 |
| `TriCompany/docs/registry/ChiefProductOfficer.contract.yaml` | 小乔 (CPO) | ✅ 固定前置核查 item 0 + 行为护栏 |
| `TriCompany/docs/registry/ChiefTechnologyOfficer.contract.yaml` | 小狄 (CTO) | ✅ 固定前置核查 item 0 + 行为护栏 |
| `TriCompany/docs/registry/RAndDTrainer.contract.yaml` | 小吴（专属研发培训师） | ✅ 固定前置核查 item 0 + 工作接手规则 |
| `TriCompany/docs/registry/TestEngineer.contract.yaml` | 小柯 (TestEngineer) | ✅ 固定前置核查 item 0 + 行为护栏 |
| `TriCompany/docs/registry/FullStackDeveloper.contract.yaml` | 小全 (FullStackDeveloper) | ✅ 固定前置核查 item 0 + 行为护栏 |

### Secretariat Cross-Reference

- 秘书处文档 `TriCompany/docs/workflow/cyber-company-secretariat.md` 已记录 agent contract 机制在 `CompanyGovernanceRegistry` 中的永久落点。
- 涉及岗位交接、宿主迁移或 agent 能力审计时，先查 `CompanyGovernanceRegistry` 的 `Agent Contract-Based Migration Approach` 节。

## Sources

- `../../tricompany.md`
- `../workflow/tricompany-agent-roles.md`
- `../workflow/tricompany-secretariat.md`
- `../workflow/operating-records/README.md`
- `../../../TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md`
- `../../../TriCompany/docs/workflow/chief-administrative-officer-role.md`
- `../../../TriCompany/docs/registry/product-state.md`
- `../../../TriCompany/docs/registry/code-state.md`

# TriMetaverse Project Workflow（TriMC 运行面版）

版本：v0.1

日期：2026-03-03

目标：以 TriMetaverse 为实验场，完成一整套基于 Copilot + VS Code 的自动化工程交付流程。

---

## 1. 总体原则

- 全流程采用“主线阶段串行、PRD 分支并行或先后进行、分支内串行”的编排方式。
- 由 `TriMC` 统一运行面推进 10 个阶段，具体执行采用主执行 Agent + 子 Agent 协作，而不再单列 `Development Main Controller`。
- 每阶段必须定义输入、输出、质量门禁、失败回流。
- 主链与阶段产物命名统一以 `docs/workflow/terminology.md` 为准（单一词汇源）。
- 文档执行“严格模式”：正式章节禁止使用非标准别名（仅术语表、变更记录、自检命令可出现历史别名）。
- 对开发型产品项目，项目级十阶段默认作为 canonical 流程主线，由 `TriDev` 承接 phase engine、门禁推进、版本签发与分支执行承接；`TriCompany` 负责组织 CEO / 总助 / CMO / COO / CFO / CPO / CTO 等员工在各阶段参与、补齐资料、形成可签核的版本化 gate package。
- `INTELLIGENCE` 之后每个已审核 PRD 分支，统一通过其归属模块或归属项目的 `模块六层文档协同系统` 落地；在 docs bootstrap 前必须先拿到 PRD 归属路由结论，不得把当前工作区根仓默认当成 docs 落点。当前阶段该路由由 `CEOChiefOfStaff` 组织，未来 `ChiefProductOfficer` 正式上岗后转为由其主责模块设计与归属方案。十阶段负责流程推进和门禁，该系统负责承接分支真源、执行记录、状态回写、流程机制和培训导读。
- 支持两种执行形态：
  - 形态 A：主控 + 子 Agent 并行协作（推荐）
  - 形态 B：10 Agent 全自动流水执行（实验模式）

### 1.1 提交前术语自检建议命令

- 检查历史别名是否残留：`rg "产品实施文档|实施产物|产品实现文档" .`
- 检查主链关键产物名是否齐全：`rg "产品实施总结|单元测试报告|集成测试报告|红队扫描报告|QA报告|部署手册|Assurance报告|交付验收报告" docs/workflow project.md tmv-whitepaper.md`
- 术语权威源核对：`docs/workflow/terminology.md`
- PR 快速入口：`docs/workflow/pr-description-waterfall-alignment.md`（优先使用文件顶部“最终直接使用版（推荐）”）

### 1.2 宿主边界说明

- 研发工作流属于 `TriMC` 统一运行面中的研发执行切片，不再单列 `Development Main Controller` 标准名。
- 当前阶段由 `copilot chat` 承载 shadow 与当前阶段正式接管，必要时可扩到 `copilot cli`。
- 到 `TriMetaverse V1 正式上线切换阶段`，正式切换通过 `TriHost` 的宿主适配与配置完成，而 `TriMC` 继续作为 agent 运行和交互核心。
- `Tride` 不再作为切换后的正式宿主；它与 `TriPilot`、`vscodium` 和 CLI 工具一起构成 PC 端软件层。该层一方面配合 `TriLC` 承接本地化任务与部分服务域下发任务，另一方面也作为用户可直接使用的本地自动化与 `vibe coding` 工具面存在。

---

## 2. 角色模型

### 2.1 研发工作流编排层

职责：

- 维护阶段状态机（PhaseState）
- 执行阶段顺序与门禁判定
- 管理中断、回滚、重试、恢复
- 汇总阶段结果并产出全局报告

当前运行模式：在当前阶段由 `copilot chat` 承载研发工作流语义，必要时可扩到 `copilot cli`；到 `TriMetaverse V1 正式上线切换阶段`，通过 `TriHost` 把同一套输出契约接入以 `TriMC` 为核心的正式运行面。当前无需新增独立主控进程。

### 2.2 Phase Agents（阶段执行体）

每个阶段由一个主执行 Agent 负责，可按任务拆分多个子 Agent 并行处理。

### 2.3 Subagents（并行协作）

用途：

- 文档整理并行
- 代码扫描并行
- 测试任务并行
- 风险分析并行

约束：

- 子 Agent 不直接跨阶段推进；只能在当前阶段内工作。
- 阶段是否完成由主控统一判定。

---

## 3. 十阶段主线 + 分支流程（瀑布对齐）

当前项目真源口径进一步统一为：

- 对开发型产品项目，`IPD` 不再被理解为一条独立于十阶段之外的第二套流程。
- 更准确地说，`IPD` 是赛博公司围绕项目级十阶段的员工参与、资料组织、门禁完善和书面核签机制。
- `TriDev` 负责十阶段 phase engine 本身；`TriCompany` 负责控制哪些员工在什么阶段参与、提交什么资料、形成什么版本化 gate package，并由总助 / CEO 决定是否放行下一阶段。
- 当前 TriCompany source-side runtime 已开始按 `DISCOVERY -> INTELLIGENCE -> DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE -> DELIVERY` 提供一比一的 ten-phase case line，并把公司员工参与、资料与核签要求挂到各 phase；当前仍未完成 PRD 分叉并行、多分支 delivery 聚合、独立 phase package schema 族和完整岗位 adapter。

## Phase 1 - DISCOVERY（需求前准备）

目标：沉淀需求阶段所需的上游业务文档。
输入：项目基线资料与上下文。

当前在 TriCompany IPD 的教学与运行口径里，`DISCOVERY` 通常由 CEO、CEOChiefOfStaff、CMO 共同参与：CEO 提供方向与边界，总助负责任务澄清、真源草稿整理与路由，CMO 补充市场 raw 材料、机会线索和参考链接。

输出：

- 项目白皮书（对应商业需求文档）
- Discovery 真源草稿与 raw evidence pack
- Discovery 结构化上下文

通过条件：白皮书仅在人工审核通过后由审核人签发版本号（`WP-v*`）。阶段推进必须满足：首次发布存在版本号，或非首次发布时版本号已变更，方可进入 INTELLIGENCE。

## Phase 2 - INTELLIGENCE（需求阶段）

目标：完成需求分析与需求文档化，把 Discovery 阶段沉淀的 raw 材料整理成结构化需求资料，形成可分叉执行的 PRD 输入。
输入：Discovery 输出（白皮书、商业需求文档、真源草稿、raw evidence pack）、市场与用户补充资料（可选）、项目章程（可选）。

当前在 TriCompany IPD 的教学与运行口径里，`INTELLIGENCE` 并不意味着 CPO 单线程从零写 PRD；而是 CEO、CEOChiefOfStaff、CMO 继续参与资料梳理，把 raw notes、参考链接、机会线索整理成更结构化、可引用的输入包，再由 CPO 正式消费这些资料并做产品收口。

输出：

- 结构化需求资料包（将 raw notes、参考链接、机会线索整理为可引用输入）
- 产品需求文档（PRD，版本化）
- 线框图 / 原型图
- 用户故事地图
- 需求证据包（reference、调研摘要、可信度标注）

通过条件：PRD 与原型、用户故事一致；仅在人工审核通过后签发 PRD 版本（如 `PRD001-v1.0.0`）。阶段推进必须满足：首次发布存在版本号，或非首次发布时版本号已变更，方可进入 DESIGNING。

## 分叉规则（INTELLIGENCE 之后）

- INTELLIGENCE 产出的每个已审核 PRD，独立分叉一条执行链路：
  `DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`
- DISCOVERY 负责上游内容传导、真源草稿与 raw evidence pack 沉淀；是否新增 PRD 由 INTELLIGENCE 决定。
- 当前实验首分支为 `PRD001基础平台.md`，先完成该分支设计、编码、测试与发布验证。
- INTELLIGENCE 新增 PRD 必须先完成审核并赋予 PRD 版本号（如 `PRD001-v1.0.0`），再允许创建分支。
- 分支之间并行执行或先后执行，分支内部串行执行。
- 只回流失败分支，不阻塞已通过分支。
- 当全部 PRD 分支通过 `ASSURANCE` 后，统一进入 `DELIVERY` 聚合交付。

### 分叉承接规则（模块六层文档协同系统）

- `模块六层文档协同系统` 由 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/` 构成，是 PRD 分支进入 `DESIGNING` 之后的标准落地面。
- 这套系统不是十阶段主线的替代品，而是十阶段在模块仓内的具体文档与执行实现面；两者关系应理解为“主线定义流程，六层系统承接流程产物”。
- 在创建任何 PRD 分支的 docs bootstrap 前，必须先拿到该 PRD 的归属路由结论与目标落位仓：当前阶段由 `CEOChiefOfStaff` 组织路由到正确真源并形成结论；未来 `ChiefProductOfficer` 正式上岗后，由其主责模块设计、归属方案与目标落位定义。若描述的是既有模块能力，则落在对应模块根下；若描述的是 TriMetaverse 自身项目级 / 中央层能力，才允许落在 `TriMetaverse/docs/`；若描述的是尚未存在的新模块，则应先建立与现有模块同级的新模块根，再在其下初始化六层结构。
- 如涉及新的长期主模块、既有模块边界变化或中央层范围争议，当前阶段总助应先询问 `BusinessStrategy` 做范围裁决，再继续形成落位结论。
- 若尚未形成总助路由结论，或未来尚未形成 `ChiefProductOfficer` 的模块设计 / 归属结论，则分支初始化必须阻断，不能因为当前打开的是某个工作区根仓就默认把样板建在该仓的 `docs/` 下。
- 对接关系如下：
  - `docs/product/`：承接该 PRD 分支的范围、需求、原型映射、产品路线和产品状态。
  - `docs/engineering/`：承接 `DESIGNING` 阶段的 Spec、技术方案、技术路线和技术状态，并为 `CODING` 提供直接输入。
  - `docs/execution/<prd-or-workstream>/<phase>/`：承接分支执行证据；标准 `phase` 应与主线保持一致，优先使用 `designing`、`coding`、`verify-integration`、`redteam`、`qa`、`deployment`、`assurance`。
  - `docs/registry/`：承接分支稳定结论对模块 business / product / code 状态的回写。
  - `docs/workflow/`：承接分支所需的 handoff、rollout、迁移、编排和治理机制。
  - `docs/training/`：承接岗位、模块、代码和流程导读，确保新成员和新人 agent 能按真源学习。
- 优化要求如下：
  - PRD 一经审核通过并拿到当前阶段 `CEOChiefOfStaff` 的路由结论，或未来拿到 `ChiefProductOfficer` 的模块设计 / 归属结论，就应在目标落位点同步创建或更新这六层入口，避免分支推进后产物继续散落在聊天、临时文件或单独脚本里。
  - `DESIGNING` 完成门禁前，至少应形成 `docs/engineering/DESIGN.md` 和对应执行层计划入口；否则不应进入 `CODING`。
  - `VERIFY-INTEGRATION` 及其后的阶段除产出测试、发布和保障结果外，还应同步更新产品 / 技术状态与 registry 收口，避免“执行已经发生，但模块真源没有跟上”。

## Phase 3 - DESIGNING（设计阶段）

目标：基于 PRD 产出“如何做”的设计文档。
输入：PRD、原型图。
输出：

- 系统架构设计文档
- 技术方案选型报告
- 高层模块划分图
- 数据库概念模型
- 详细设计文档（Spec）
- 接口 API 文档

通过条件：设计文档与 PRD 一致，设计资产完整可供编码阶段直接使用。

## Phase 4 - CODING（编码阶段，合并原编码与单元验证阶段）

目标：依据 Spec 与接口文档完成实现及单元级验证。
输入：详细设计文档（Spec）、接口 API 文档、UI 设计稿。
输出：

- 可运行的源代码
- 单元测试代码与执行结果
- 代码注释
- 模块集成文档
- 产品实施总结

门禁：存在阻断级编码、单测问题时，立即中止后续阶段。

## Phase 5 - VERIFY-INTEGRATION（测试阶段）

目标：依据 PRD 与 Spec 执行系统级测试验证。
输入：PRD、详细设计文档（Spec）、测试计划、测试用例。
输出：

- 测试报告
- 集成测试报告
- 缺陷清单
- 自动化测试脚本
- 质量评估报告

门禁：存在阻断级测试失败时，立即中止后续阶段。

## Phase 6 - REDTEAM

目标：执行对抗性审查，识别可被利用的高风险问题。
输入：VERIFY-INTEGRATION 通过产物。
输出：

- 红队扫描报告
- 红队报告（攻击面、滥用路径、安全与架构对抗）
- 严重问题清单（含分级）

门禁：存在 critical 问题时，主控抛出 QualityGateError，立即中止后续阶段。

## Phase 7 - QA

目标：执行非对抗质量评估与统一评分门禁。
输入：REDTEAM 修复后的产物。
输出：

- QA 报告
- 质量评分报告（文档、安全、性能、测试、代码质量）
- 综合得分与通过结论

门禁：默认阈值 80 分；支持覆盖阈值与跳过开关（仅实验场景允许）。

## Phase 8 - DEPLOYMENT（发布阶段）

目标：依据测试结果完成发布与部署交付。
输入：测试报告、PRD、部署清单、运维手册。
输出：

- 已上线可运行系统
- 发布说明
- 用户手册
- 生产环境部署文档（含部署手册）
- CI/CD 配置（GitHub Actions / GitLab CI / Jenkins / Azure DevOps / Bitbucket）
- Dockerfile / docker-compose
- Kubernetes manifests（deployment / service / ingress / configmap / secret）

通过条件：发布资产可通过基础校验，部署结果可追溯。

## Phase 9 - ASSURANCE（发布后保障验证）

目标：每个 PRD 分支在发布后执行专项保障测试。
输入：对应 PRD 分支的发布产物与环境。
输出：

- Assurance 报告
- 服务器漏洞测试报告
- 业务压力测试报告
- 安全测试报告
- 回归测试报告
- 放行 / 回退结论

门禁：任何阻断级问题均只回流到该 PRD 分支上游阶段修复。

## Phase 10 - DELIVERY（主线聚合交付）

目标：聚合全部通过 ASSURANCE 的 PRD 分支产物，形成统一交付包。
输入：所有 PRD 分支的通过产物。
输出：

- 交付验收报告
- delivery-manifest.json
- delivery-report.md
- 版本包 zip 压缩包

通过条件：全部分支通过且必需交付项齐全、可审计、可追溯。

---

## 4. 执行模式

### 模式 A：主控 + 子 Agent 并行（推荐）

- 阶段串行推进
- 每阶段内部并行拆分
- 更可控，便于审计与干预

### 模式 B：10 Agent 全自动（实验）

- 各阶段执行体自动接力（10 阶段）
- 由主控只做状态和门禁判断
- 适合自动化成熟后压测流程稳定性

---

## 5. 主控状态机（简化）

状态：

- pending
- running
- blocked
- failed
- completed

关键异常：

- QualityGateError（红队、QA、专项测试门禁失败）
- ArtifactMissingError（交付必需文件缺失）
- DeploymentInvalidError（部署配置无效）

---

## 6. 阶段结果标准（PhaseResult）

每阶段统一返回：

- phase
- status
- startTime / endTime / duration
- qualityScore
- artifacts[]
- errors[]
- summary

主控汇总后产出全流程报告。

---

## 7. TriMetaverse 实验范围

本实验重点：

1. 建立可复用的主控编排方法
2. 沉淀 Copilot + VS Code 自动化工具配置
3. 验证“从需求到交付再到专项测试”的全链路可执行性

阶段目标：先在 TriMetaverse 跑通，再按模板复制到其他仓库。

---

## 8. 治理要求

- 文档更新必须遵循：白皮书 -> PRD -> 架构设计 -> 实施计划 -> 测试计划
- 任何阶段通过结论必须有证据文件
- 任何门禁放行必须可追溯

---

## 9. 实施资产入口

为将本流程从“描述”转为“可执行”，主控 Agent 统一使用以下资产：

- `docs/workflow/wsdd-v1.md`
- `docs/workflow/workflow-engine-spec.md`
- `docs/workflow/workflow-engine-config.example.yaml`
- `docs/workflow/phase-result.schema.json`
- `docs/workflow/quality-gates.schema.json`
- `docs/workflow/workflow-runbook.md`

建议：运行前先复制 `workflow-engine-config.example.yaml` 为本地 `workflow-engine-config.yaml`，再按 runbook 执行。

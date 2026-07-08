# TriMetaverse Product State

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/product-state.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

## Module Overview

- 当前文件是 `TriMetaverse` 模块自身 `Product Registry` 工作层的本地真源，只维护 TriMetaverse 的产品职责、产品边界和中央发布面状态；它不是 TriCompany 公司级 workflow 书面真源。

- `TriMetaverse` 是整个三元宇宙的中央战略仓、总 workflow、总白皮书、项目级真源约束和赛博公司实施落地侧的中央发布面。
- 它不是首轮产品交付 runtime，也不直接替代 `TriCompany` 决定赛博公司实施规则；赛博公司规则、岗位规则和 registry 规则先在 TriCompany source 侧形成，再按发布规则同步到中央摘要层。

## Current Product Scope

- 维护总商业模式、阶段门禁、项目级真源约束、模块映射和工作流规范。
- 维护 `TriMC` 统一运行面、赛博公司经营载体、`TriModel` Provider/Model 配置层与 PC 端软件层的中央产品边界。
- 接收并发布由 `TriCompany` source 侧稳定输出的赛博公司岗位设计、总助体验、记忆治理、registry 治理和会议治理摘要。
- 维护各项目代码仓库的产品侧文档基线，包括 `PROJECT.md`、`REQUIREMENTS.md`、产品版 `ROADMAP.md` 与产品版 `STATE.md` 的归属和边界。
- 维护各项目代码仓库的 `模块六层文档协同系统` 基线，要求新模块默认建立 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/` 六层目录，并允许低成熟模块先用占位文件标记待初始化。
- 维护模块级 `Product Registry` 的文档治理规则：每个模块的产品登记层应从业务角度拆分维护多份文档，分别承接不同业务切面、能力边界、阶段状态和用户价值说明，而不是把所有产品事实堆进单一总文档。
- 维护模块级教学文档的端到端表达规则：各业务线文档必须写清模块内端到端链路中的输入生产者是谁、输出消费者是谁；如果不是数据业务流，也要写清等同或类似的输入方、处理方、输出方与消费方关系。
- 为 `BusinessStrategy` 提供中央事实基础。

## Current Progress

- 已具备较完整的白皮书、workflow、cyber-company 和阶段相关文档。
- 已建立中央 `BusinessStrategy` agent 与首批 registry 工作层。
- 已将中央运行与宿主边界统一收口为 `TriMC` 统一运行面、赛博公司经营载体、`TriModel` 宿主适配层，以及 `TriPilot + Tride + vscodium + CLI` 的 PC 端软件层。
- 已将 `TriSkill` 纳入中央边界预留，但当前仍明确标注为待初始化模块。
- 已把 `CEOChiefOfStaff` 的人格、JD、秘书处边界和首版简化记忆管理纳入持续设计收口范围。
- 已为公司级会议流程补充“开始会议 / 结束会议”专用 prompt 命令，作为总助与秘书处配套的会议入口。
- 已为 `CEOChiefOfStaff` 补充工作协作档案与社交档案，用于分别记录工作层和闲聊社交层的人与事，提升长期共事与日常互动的自然度和连续性。
- 已收口各项目代码仓库的文档基线：`PROJECT.md` 与 `REQUIREMENTS.md` 归产品侧，`ROADMAP.md` 与 `STATE.md` 分产品版和技术版两套，技术设计单独用 `DESIGN.md` 承接。
- 已把 TriCompany 现行的 `docs/engineering/`、`docs/execution/`、`docs/product/`、`docs/registry/`、`docs/workflow/`、`docs/training/` 六层结构评估为可推广的 `模块六层文档协同系统` 默认结构，并要求后续新模块至少先建占位入口。
- 已把模块级 `Product Registry` 的后续治理口径明确为“按业务切面拆文档、保持教学级可读性”，以便产品、运营和新加入成员能快速理解模块业务结构与能力边界。
- 已把模块级教学文档的端到端要求纳入中央产品侧治理：后续各模块业务文档都应补清输入生产者、输出消费者以及模块内关键环节的接力关系。

## Bug And Gap State

- 根目录缺少稳定的模块级 README 基线。
- 文档和模块实际实现之间仍存在成熟度差异，需要各模块 registry 持续回写事实。
- 总助记忆管理目前仍是手工简化版；待 CTO 与 CPO 上岗后，还需要把它进一步产品化和工程化。
- `docs/workflow/handoff-templates/*.example.json` 与 `docs/workflow/operating-cycle-example/*.sample.json` 当前只可视为样板或演示对象，不能单独当作中央产品事实、正式经营结论或模块已确认边界；凡做产品侧摘要时，必须回连白皮书、workflow 真源、operating-records 或模块 registry 真源。

## Cross-Module Dependencies

- 依赖所有模块提供本地事实，以支撑中央商业模式映射。
- 重点依赖 `TriMC`、`TriPilot`、`Tride`、`vscodium`、`TriStaciss`、`TriLC`、`TriAvatar`、`TriDeployment`、`TriTest` 的模块资料。
- 对 `TriModel` 与 `TriSkill` 当前仍以占位边界跟踪为主，待真实模块资料出现后再升级为常规依赖。

## Architecture State

- 当前以文档、流程和策略规范为主，不承担主要业务代码执行。
- 当前中央登记层要求所有运行边界统一映射为：`TriMC` 负责运行面，赛博公司负责经营载体，`TriModel` 负责宿主适配，`Tride/TriPilot/vscodium` 归于 PC 端软件层。

## Sources

- `../../tmv-whitepaper.md`
- `../../project.md`
- `../../tricompany.md`
- `../workflow/tricompany-agent-roles.md`
- `../workflow/tricompany-secretariat.md`
- `../workflow/agent-taxonomy.md`
- `../workflow/project-repo-document-baseline.md`

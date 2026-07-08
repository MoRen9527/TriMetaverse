# 模块六层文档协同系统（模块 / 项目根文档基线）

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/integrated-product-development-flow.md
- syncMode: published-summary
- lastSyncedAt: 2026-06-15

## 1. 目标

本基线用于约束三元宇宙各模块根或项目根在产品层、技术层、执行层、registry 层、workflow 层和 training 层应维护哪些核心文档，以及这些文档分别由谁负责、写什么、为什么存在。

当前文件在该主题下只承担 TriMetaverse 发布侧摘要职责。当前阶段与赛博公司 IPD 直接相关的 docs bootstrap、PRD 归属解析与 `模块六层文档协同系统` 落位规则，以 TriCompany 的 [integrated-product-development-flow.md](../../../TriCompany/docs/workflow/integrated-product-development-flow.md) 为书面真源；本页用于发布侧摘要、模块对齐和跨仓引用，不作为公司级 IPD 主真源。

本基线的项目标准专用术语为 `模块六层文档协同系统`。

目标只有一个：

- 让项目介绍、具体需求、技术设计、计划、执行过程和落实状态跟随项目代码仓库一起实时更新，不再散落在聊天、临时笔记或过期文档里。

## 2. 总体判断

- `PROJECT.md` 归产品侧维护，不单独再做技术版。
- `REQUIREMENTS.md` 归产品侧维护，不单独再做技术版。
- `ROADMAP.md` 需要产品版和技术版两份，因为产品路线和工程交付路线不是同一件事。
- `STATE.md` 需要产品版和技术版两份，因为产品状态和技术状态的更新节奏、关注点和结论不同。
- 技术设计不能挤进 `PROJECT.md` 或 `REQUIREMENTS.md`，应单独设 `DESIGN.md`，由技术侧维护。
- GSD 执行层的 `PLAN.md`、`SUMMARY.md`、`VERIFICATION.md` 属于执行过程资产，不替代上层的产品和技术基线文档。
- 各模块代码仓库的 `docs/` 不应只分产品、技术和执行三层；还应把 `registry`、`workflow` 和 `training` 一起纳入默认文档资产基线。
- 对低成熟或待初始化模块，允许先用占位文件标记 `待初始化`、`待定义` 或 `待补齐`，但目录和核心文件入口应先建立，避免后续文档继续散落。

### 2.1 强制前置判断：PRD 归属解析

- 任何 PRD 的 docs bootstrap、最小目录初始化或执行层落位动作之前，必须先拿到该 PRD 的归属路由结论，以及它对应的目标落位仓与 `docs/` 根。
- 当前阶段，模块设计与归属判断不由执行者自行拍板，而应先询问 `ChiefProductOfficer`；`CEOChiefOfStaff` 只负责公司级任务分派、催办、升级与收口，必要时再协助升级 `BusinessStrategy` 做范围裁决。
- 操作上，当前阶段应先提交一次标准 `PRD_OWNERSHIP_ROUTING` 请求给 `ChiefProductOfficer`；若当前输入仍是零散自然语言，可由秘书处或 `CEOChiefOfStaff` 协助整理，但不替代产品侧形成模块设计 / 归属结论。
- 若 PRD 描述的是既有模块能力，则应落在该模块自己的根目录下，例如描述 `TriMC` 能力的 PRD，应落在 `TriMC/docs/`，而不是默认落在 `TriMetaverse/docs/`。
- 只有当 PRD 明确描述当前项目根自身的能力时，才允许把六层结构落在当前项目根的 `docs/` 下；当前工作区根仓或中央仓身份，本身不构成默认落位依据。
- 若 PRD 实际定义的是尚未存在的新模块，则应先建立与现有模块同级的新模块根，再在新模块根下初始化六层结构，而不是把它暂挂到某个无关项目的 `docs/` 下。
- 若当前阶段尚未形成 `ChiefProductOfficer` 的模块设计 / 归属结论，则必须阻断 docs bootstrap，直到归属解析完成。

## 3. 建议目录约定

每个已确定目标落位点的模块根或项目根，统一采用以下结构：

- `docs/product/`：产品侧文档
- `docs/engineering/`：技术侧文档
- `docs/execution/<workstream>/`：按子项目、Epic、Feature 或业务域拆开的执行层文档
- `docs/registry/`：模块 business / product / code 状态登记与索引文档
- `docs/workflow/`：模块内部工作流、迁移、编排、交接与机制文档
- `docs/training/`：岗位、模块、代码、流程和使用方式的培训与导读文档

其中 `workstream` 可以是用户系统、支付系统、管理后台、推荐系统、数据分析面板，也可以是某个独立 Epic / Feature。

这里的“目标落位点”不是“当前正打开的仓库”，而是经过当前阶段 `ChiefProductOfficer` 模块设计 / 归属判断后确认的模块根或项目根；`CEOChiefOfStaff` 只负责公司级任务协调与升级。

### 3.1 为什么技术目录统一命名为 `engineering`

- `engineering` 覆盖的不只是“技术说明”或“代码笔记”，而是总体设计、实现顺序、依赖准备、测试与发布准备、质量和交付工程等完整工程面。
- 与 `product`、`execution` 并列时，`engineering` 更清楚地表达“产品负责回答做什么和为什么，engineering 负责回答准备怎么做和为什么这样做，execution 负责回答阶段里实际做了什么和验证结果是什么”。
- 对 `Code Registry` 来说，维护对象也不只是源码树本身，而是与源码同等级的工程设计、交付路线和技术状态；因此用 `engineering` 比 `tech` 或 `code` 更准确。

### 3.2 最低占位要求

对新模块、低成熟模块或首次被 PRD 分支接入的目标模块，建议在创建仓库、确认落位点或首次接入中央 registry 时，就先建立以下最低文档资产：

- `docs/product/PROJECT.md`
- `docs/product/REQUIREMENTS.md`
- `docs/product/ROADMAP.md`
- `docs/product/STATE.md`
- `docs/engineering/DESIGN.md`
- `docs/engineering/ROADMAP.md`
- `docs/engineering/STATE.md`
- `docs/execution/README.md`
- `docs/registry/README.md`
- `docs/registry/business-state.md`
- `docs/registry/product-state.md`
- `docs/registry/code-state.md`
- `docs/workflow/README.md`
- `docs/training/README.md`

其中：

- `docs/execution/README.md` 用来解释 workstream / phase 的分层方式；真正进入执行后，再补 `PLAN.md`、`SUMMARY.md`、`VERIFICATION.md`。
- `docs/workflow/README.md` 用来承接本模块自己的流程、迁移、协同、运行或治理文档索引；即使暂时没有细分机制，也应先保留入口。
- 对待初始化模块，上述文件允许只写一段简短占位，例如“当前待初始化，本文件用于后续补齐 `<主题>` 真源”。
- 若目标模块尚不存在，则“最低占位要求”的第一步不是在当前仓根创建 `docs/`，而是先建立正确的新模块根，再在其下补齐这些入口。

### 3.3 与 PRD 分支的衔接方式

- `模块六层文档协同系统` 是 `INTELLIGENCE` 产出并审核通过 PRD 之后，各 PRD 分支进入 `DESIGNING` 到 `ASSURANCE` 的标准落地面。
- 它不替代十阶段主线；十阶段解决“流程和门禁怎么走”，`模块六层文档协同系统` 解决“分支产物、执行证据、培训导读和收口应该落在哪里”。
- “落在哪里”的第一判断不是当前仓是否方便修改，而是当前阶段 `ChiefProductOfficer` 模块设计给出的归属结论；既有模块落既有模块，新模块先建新模块根，只有项目根自身范围才落当前项目根 `docs/`。
- 推荐对接关系如下：
  - `docs/product/`：持续承接 PRD 范围、需求、产品路线和产品状态。
  - `docs/engineering/`：承接 `DESIGNING` 的 Spec、技术设计、技术路线和技术状态。
  - `docs/execution/<prd-or-workstream>/<phase>/`：承接 `DESIGNING`、`CODING`、`VERIFY-INTEGRATION`、`REDTEAM`、`QA`、`DEPLOYMENT`、`ASSURANCE` 的阶段计划、总结和验证记录。
  - `docs/registry/`：承接分支形成稳定结论后的模块事实回写。
  - `docs/workflow/`：承接分支内部 handoff、迁移、编排、运行和治理机制。
  - `docs/training/`：承接 onboarding、使用说明、流程导读和面向执行者的培训材料。
- 这意味着六层系统和 PRD 分支不是“平行两套东西”，而是“PRD 分支在完成归属解析后默认使用的文档与收口骨架”。

## 4. 文档归属矩阵

### 4.1 产品侧文档

#### `docs/product/PROJECT.md`

- 归属：产品 registry
- 目的：定义“这是什么项目，为谁而做，边界在哪里”
- 核心内容：
  - 项目名称与定位
  - 目标用户 / 用户画像入口
  - 核心业务目标与价值
  - 当前范围、不做什么、边界条件
  - 关联模块、关键依赖、外部约束
  - 关联需求、路线图、状态文档入口
- 不应承载：详细技术设计、逐阶段执行日志、实现细节

#### `docs/product/REQUIREMENTS.md`

- 归属：产品 registry
- 目的：定义“要做什么，做到什么算完成”
- 核心内容：
  - 需求背景与触发原因
  - 用户场景与核心流程
  - 功能需求清单
  - 业务规则与约束
  - 非功能要求中的产品约束部分
  - 验收口径、成功指标、待确认问题
  - 与各子项目 / Epic / Feature 的映射
- 不应承载：底层架构图、实现方案细节、代码分层设计

#### `docs/product/ROADMAP.md`

- 归属：产品 registry
- 目的：定义“先做什么、后做什么、为什么这样排”
- 核心内容：
  - 版本节奏与阶段目标
  - Epic / Feature 的优先级
  - 业务价值与用户价值排序
  - 关键依赖、上线窗口、范围裁剪原则
  - 与技术路线的协同点和外部承诺边界
- 不应承载：具体实现任务拆解、代码重构计划、底层交付排期细节

#### `docs/product/STATE.md`

- 归属：产品 registry
- 目的：回答“产品当前处于什么状态、变了什么、还有什么没定”
- 核心内容：
  - 当前产品阶段
  - 已确认范围 / 变更中的范围
  - 已完成、进行中、待决策事项
  - 产品风险、依赖、阻塞
  - 需求变更记录摘要
  - 与技术状态、执行状态的差异提醒

### 4.2 技术侧文档

#### `docs/engineering/DESIGN.md`

- 归属：代码 registry
- 目的：定义“准备怎么做，以及为什么这样做”
- 核心内容：
  - 总体架构与关键模块
  - 数据结构、接口、事件流或状态流
  - 技术选型与约束
  - 关键 trade-off
  - 与需求和版本范围的映射
  - 待确认技术问题与风险
- 不应承载：产品价值叙事、版本优先级判断、业务目标定义

#### `docs/engineering/ROADMAP.md`

- 归属：代码 registry
- 目的：定义“技术上按什么顺序交付、治理和收敛”
- 核心内容：
  - 实施波次和里程碑
  - 技术依赖、前置条件、基础设施准备
  - 重构、迁移、债务清理、性能或稳定性工作
  - 测试、发布、回滚和验收准备
  - 与产品路线图的对齐关系

#### `docs/engineering/STATE.md`

- 归属：代码 registry
- 目的：回答“技术实现现在做到哪、卡在哪、质量怎么样”
- 核心内容：
  - 当前实现阶段
  - 已完成、进行中、阻塞项
  - 当前技术风险、质量风险、已知债务
  - 测试 / 验证 / 发布准备度
  - 与产品状态不一致的地方

  ### 4.3 Registry 侧文档

  #### `docs/registry/README.md`

  - 归属：模块 registry 体系
  - 目的：说明本模块 registry 层有哪些状态文档、各自负责什么、真源优先级是什么

  #### `docs/registry/business-state.md`

  - 归属：`<Module>BusinessStrategyRegistry`
  - 目的：记录模块商业定位、默认职责、边界和阶段口径

  #### `docs/registry/product-state.md`

  - 归属：`<Module>ProductRegistry`
  - 目的：记录模块产品事实、成熟度、依赖和待确认项

  #### `docs/registry/code-state.md`

  - 归属：`<Module>CodeRegistry`
  - 目的：记录模块代码结构、实现范围、质量风险和技术侧缺口

  说明：`business-state.md` 是同模块 `product-state.md` 和 `code-state.md` 的业务上游约束；对低成熟模块，也应先占位而不是完全缺席。

  ### 4.4 Workflow 侧文档

  #### `docs/workflow/README.md`

  - 归属：模块级流程 / 机制文档索引
  - 目的：为本模块内部的迁移、编排、运行、交接、会议或治理文档提供稳定入口
  - 最低要求：即使模块当前尚未形成复杂 workflow，也应保留 `README.md` 说明“当前有哪些流程真源、哪些待补齐”

## 5. GSD 执行层文档

执行层文档建议放在：

- `docs/execution/<workstream>/<phase>/PLAN.md`
- `docs/execution/<workstream>/<phase>/SUMMARY.md`
- `docs/execution/<workstream>/<phase>/VERIFICATION.md`

这里的 `phase` 在 TriMetaverse 十阶段主线下，应优先直接对齐 PRD 分支的标准阶段目录：`designing`、`coding`、`verify-integration`、`redteam`、`qa`、`deployment`、`assurance`。

如果某个模块内部还需要 `discuss`、`plan`、`execute`、`verify`、`ship` 之类更细的执行节奏，应作为上述标准 `phase` 下的二级目录或附加结构存在，而不应替代主线阶段名。

### `PLAN.md`

- 目的：说明该阶段准备做什么、边界是什么、依赖是什么
- 关注点：输入、输出、负责人、风险、前置条件、验收方式

### `SUMMARY.md`

- 目的：说明该阶段实际做了什么、有哪些偏差、遗留了什么
- 关注点：完成情况、偏差、未完成项、产物链接、后续动作

### `VERIFICATION.md`

- 目的：说明该阶段结果是否被验证通过
- 关注点：验证项、验证结果、问题清单、是否允许进入下一阶段

执行层文档由工程执行主控或对应 workstream owner 维护，但必须显式引用上层的 `PROJECT.md`、`REQUIREMENTS.md`、`DESIGN.md`、`ROADMAP.md` 和 `STATE.md`，避免阶段文档脱离真源。

## 6. 更新规则

- 只要项目范围、需求、优先级、依赖或版本计划变化，产品侧文档必须同步更新。
- 只要设计方案、实现顺序、技术风险、质量状态或发布准备度变化，技术侧文档必须同步更新。
- 只要模块商业定位、产品事实、代码结构或治理边界形成稳定结论，`docs/registry/` 对应文档必须同步更新。
- 只要模块内部形成了可复用的迁移、编排、交接、运行或治理流程，`docs/workflow/` 必须建立稳定入口，而不是继续散落在聊天或临时记录里。
- 只要某个 workstream 进入或离开一个 GSD 阶段，对应阶段目录下的 `PLAN.md`、`SUMMARY.md`、`VERIFICATION.md` 就必须同步更新。
- 如果代码或实现已经变化，但文档未变，registry 应将其视为失配并报告。
- 如果文档缺失、过期或相互冲突，registry 应输出 `待确认`，并指出缺失的是产品真源、技术真源还是执行层产物。

## 7. Registry 责任分工

- 产品 registry 负责校验并维护 `docs/product/PROJECT.md`、`docs/product/REQUIREMENTS.md`、`docs/product/ROADMAP.md`、`docs/product/STATE.md`。
- 代码 registry 负责校验并维护 `docs/engineering/DESIGN.md`、`docs/engineering/ROADMAP.md`、`docs/engineering/STATE.md`。
- `BusinessStrategyRegistry` 负责校验并维护 `docs/registry/business-state.md` 的定位、边界与阶段口径。
- `ProductRegistry` 与 `CodeRegistry` 共同维护 `docs/registry/product-state.md` 与 `docs/registry/code-state.md` 和 `docs/registry/README.md` 的索引一致性。
- 相关 owner 应维护 `docs/workflow/README.md` 与模块内部流程文档入口；涉及组织制度、秘书处或治理文档归属时，还应受中央 `CompanyGovernanceRegistry` 约束。
- 两类 registry 都应检查执行层文档是否引用了正确的上层真源，并在真源失配时发出提醒。

## 8. 一句话收口

- 项目介绍和需求归产品。
- 设计归技术工程层。
- 路线图和状态分产品版、技术版两套。
- `registry` 承接模块事实登记，`workflow` 承接模块流程与机制入口。
- 阶段计划、阶段总结、阶段验证归执行层，但必须挂靠上层真源。

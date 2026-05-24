# TriMetaverse Agent Taxonomy

## 1. 目标

本文件定义三元宇宙 agent 体系的顶层分类，用来区分：

- 哪些 agent 负责事实与资料
- 哪些 agent 负责经营判断与执行推进
- 不同 agent 之间应该如何委派，避免角色混乱

## 2. 两大类 Agent

### 2.1 Registry Agents

`Registry Agents` 是无人格资料中枢，只处理事实、状态、索引、边界和记忆。

它们的共同约束：

- 不扮演岗位人格
- 不自行定义总体战略
- 不把猜测写成事实
- 只有在明确收到“记录 / 更新”指令时才改写登记文档

#### 子类

1. `Strategy Registry`
   - 负责总商业模式、当前实验、跨模块边界、阶段与商业目标映射
   - 当前中央实例：`BusinessStrategy`
2. `Product Registry`
   - 负责模块产品定位、当前进度、bug 进度、项目进度、跨模块依赖、架构状态
   - 统一命名：`<Module>ProductRegistry`
3. `Code Registry`
   - 负责模块代码结构、代码健康、代码变动、git 健康、仓库地图、质量风险
   - 统一命名：`<Module>CodeRegistry`
4. `Company Governance Registry`
   - 负责公司治理、人力行政、秘书处机制、组织制度、岗位边界、招聘试岗规则和相关文档治理事实
   - 当前中央实例：`CompanyGovernanceRegistry`

### 2.2 Role Agents

`Role Agents` 是虚拟公司的岗位执行体，可以具有角色语气和人格化表达，但必须绑定 registry 真源。

它们的共同约束：

- 不绕过 registry 自行发明事实
- 不直接覆盖中央战略边界
- 必须说明自己引用了哪类 registry 或真源文档
- 必须读取与当前事项相关的最新经营对象、registry 和记忆差异，不能只靠上一轮对话印象推进
- 产品和技术类角色必须维护 git、本地仓库与 worktree 的基本秩序，不能放任版本状态失控

#### 当前现实启用顺序

- 第 0 步：CEO 与 `CEOChiefOfStaff` 先完成项目全同步，先把经营主线、风险、资料和节奏跑起来
- 第 1 步：`ChiefOperatingOfficer` 进入，负责把周计划、上线窗口、复盘节奏与跨岗编排跑起来
- 第 2 步：`ChiefProductOfficer`、`ChiefFinancialOfficer`、`ChiefTechnologyOfficer` 进入，形成产品、预算、技术三道硬门禁

#### 最小闭环角色

- `CEOChiefOfStaff`（`CEO总助 Agent`）
- `ChiefOperatingOfficer`（`运营 Agent`）
- `ChiefProductOfficer`（`产品总裁 Agent`）
- `ChiefFinancialOfficer`（`CFO Agent`）
- `ChiefTechnologyOfficer`（`CTO Agent`）

#### 后续扩展角色

- `ChiefMarketingOfficer`（`市场 Agent`）
- `ChiefSalesOfficer`（`销售 Agent`）
- `BoardOversight`（`董事会监督 Agent`）
- `ChiefHumanResourcesOfficer`（`CHO / 人力资源 Agent`）
- `ChiefAdministrativeOfficer`（`CAO / 行政管理 Agent`，待源侧定义）

## 3. 基本委派规则

1. 总商业模式、当前实验、模块边界问题，先问 `BusinessStrategy`。
2. 模块产品事实问题，优先问对应模块的 `Product Registry`。
3. 模块代码事实问题，优先问对应模块的 `Code Registry`。
4. 组织、人力、秘书处、会议制度和文档归属问题，优先问 `CompanyGovernanceRegistry`。
5. `Role Agents` 在做计划、预算、实施和复盘前，必须先读取相关 registry。
6. 跨模块事实收口默认由 `CEOChiefOfStaff` 发起“中央 registry 收口”；若边界、优先级或参与模块不清，先问 `BusinessStrategy`，再并行路由对应 registry。
7. `BusinessStrategy` 负责判范围和中央边界，不默认代替各模块 registry 执行逐项收口。
8. 低成熟模块没有足够事实时，registry 必须返回“待初始化”，不能假装已经可用。
9. 当前阶段的默认推进顺序是“CEO 与总助同步 -> 运营排节奏 -> 产品、预算、技术形成最小闭环 -> 再扩更多岗位”。
10. 任何角色若没有结构化记忆、经营对象或 registry 依据，默认只能返回“待确认”，不能假装自己知道当前状态。

## 4. 模块覆盖原则

首版要求所有模块都纳入 registry 覆盖，但成熟度分层：

- 第一批填实：`TriMetaverse`、`Tristaciss`、`Tride`、`Tripilot`、`Triavatar`、`Trideployment`、`TriTest`
- 第二批填实：`TriMC`、`TriLC`、`vscodium`
- 首版占位：`TriMobile`、`TriMem`、`TriWeb4`、`TriChain`
- 历史参考源：`core-agent`

## 5. 当前建议上线顺序

### Phase 0

- `BusinessStrategy`
- `TriMetaverse/AGENTS.md`
- 各关键根目录的薄委派 `AGENTS.md`

### Phase 1

- CEO 与 `CEOChiefOfStaff` 完成项目全同步
- 第一轮试点所需模块的完整 `Product Registry` 与 `Code Registry`

### Phase 2

- `ChiefOperatingOfficer`
- 周经营计划、复盘节奏、上线窗口编排开始稳定运行

### Phase 3

- `ChiefProductOfficer`
- `ChiefFinancialOfficer`
- `ChiefTechnologyOfficer`
- 自动化研发、旧代码修复、新代码交付、预算门禁开始围绕运营计划闭环

### Phase 4

- 服务域 / 本地域 / 身份 / 链上相关模块的完整 registry

### Phase 5

- `ChiefMarketingOfficer`、`ChiefSalesOfficer`、`BoardOversight`、`ChiefHumanResourcesOfficer` 等增长与治理角色

# 虚拟公司经营主工作流（TriMetaverse）

## 1. 目标

本文件把 `cyber-company.md` 中的“公司自动运转流程”下沉为可执行的经营主工作流，用来回答三个问题：

1. 虚拟公司每一轮经营循环按什么顺序推进。
1. 每一步由哪个 Role Agent 主责，交接什么对象。
1. 哪些地方允许自动推进，哪些地方必须升级或冻结。

本文件面向的是经营层工作流，不替代产品研发 10 阶段主流程。

## 2. 上游真源与依赖

本工作流以以下资产为真源和依赖：

1. `BusinessStrategy`
1. `cyber-company.md`
1. `cyber-company-agent-roles.md`
1. `cyber-company-handoff-objects.md`
1. `cyber-company-handoff-envelope.schema.json`
1. 模块级 `BusinessStrategyRegistry`、`Product Registry` 和 `Code Registry`，以及公司级 `CompanyGovernanceRegistry`
1. TriCompany 源侧 registry owner 分工：`../../../TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md`、`../../../TriCompany/docs/registry/product-state.md`、`../../../TriCompany/docs/registry/code-state.md` 与 `../../../TriCompany/docs/workflow/chief-administrative-officer-role.md`
1. 研发主流程资产：`workflow-engine-spec.md`、`phase-result.schema.json`、`quality-gates.schema.json`

## 2.1 宿主边界说明

- 当前虚拟公司经营主工作流先由 `copilot chat` 完成验证并承载当前阶段正式接管，必要时可扩到 `copilot cli`。
- 到 `TriMetaverse V1 正式上线切换阶段`，本经营主工作流通过 `TriHost` 切到以 `TriMC` 为核心的服务域运行面；`TriMC` 仍需独立经历“源码 -> shadow test -> 正式接管”。
- 首版上线后的平滑过渡期，允许 `copilot chat` 版虚拟公司与 `TriMC` 运行面的正式形态并行运行一段时间。
- 本经营主工作流会消费研发主流程结果，但不再把研发流程写成独立主控；研发工作流同样属于 `TriMC` 统一运行面中的一个执行切片。
- 当前本地正式接管不等于 `TriMC` 正式宿主切换。
- 在 `TriMC` 尚未进入正式宿主切换前，如需落 skill、定时任务或复杂任务自动化能力，当前应先在 `copilot chat` 宿主完成试运行验证与最后一跳可用闭环；该结论只代表当前承载，不代表 `copilot chat` 等同于 `TriMC`。

## 2.2 统一运行语义说明

- 虚拟公司是所有人格 Agent 与非人格 Agent 的经营和交互核心载体。
- `TriMC` 是统一的 agent runtime 和 interaction core，负责 runtime、planner、context 整理、tools 编排与模型调用协同。
- 当前阶段虚拟公司的 shadow 与当前阶段正式接管都先由 `copilot chat` 承载，必要时可扩到 `copilot cli`；到 `TriMetaverse V1 正式上线切换阶段`，再通过 `TriHost` 完成宿主切换。
- `Tripilot`、`Tride`、`vscodium` 与 CLI 共同构成 PC 端软件层；该层既配合 `TriLC` 完成本地化任务与部分服务域下发任务，也面向用户提供可直接使用的桌面自动化、PC 软件自动化与 `vibe coding` 工具入口。
- CEO 总助仍是当前阶段的日常总调度中心，但它属于经营执行角色，不等于宿主或基础设施主控。
- `TriSkill` 是未来统一 skill 提供模块；在模块真正落地前，本工作流仍以当前宿主上的最小可用闭环为准。

## 3. 基本原则

### 3.1 战略先行

- 所有经营动作先服从 `BusinessStrategy`。
- 若当前商业实验、模块边界或阶段目标不清，工作流不得假装可推进。

### 3.2 Registry 约束

- Role Agents 不得绕过 Registry 自行发明模块成熟度、产品能力或代码 readiness。
- 被标记为 `待初始化` 的模块，默认不能作为现役交付依赖进入执行链。

### 3.3 预算前置

- 任何扩大范围、增加成本、承诺交付的动作，都应经过 `BUDGET_CHECK`。
- 预算不成立时，默认先缩范围，再考虑暂停，而不是硬推执行。

### 3.4 低风险自动，高风险升级

- 低风险事项允许由 `CEOChiefOfStaff` 和各职能角色在既定边界内推进。
- 重大预算、重大品牌承诺、重大交付风险、重大方向切换，必须升级。

### 3.5 当前现实推进原则

- 当前重点不是一次性健全全自动虚拟公司，而是先把 CEO 与 `CEOChiefOfStaff` 的经营同步中枢跑顺。
- 当前经营节奏应先由 `CEOChiefOfStaff` 与 `ChiefOperatingOfficer` 拉起来，再推动产品、预算、技术闭环围绕上线目标协同。
- `ChiefOperatingOfficer` 负责排节奏、催协同、控窗口，但不能覆盖 `ChiefProductOfficer`、`ChiefFinancialOfficer`、`ChiefTechnologyOfficer` 的硬门禁。
- 当前阶段的默认目标是尽快形成可收费版本、尽快上线一版、尽快进入小闭环盈利，而不是先把岗位和自动化做满。

### 3.6 记忆与版本控制纪律

- 所有经营角色都必须使用结构化经营对象、registry 和记忆记录变化，禁止只靠会话上下文维持状态。
- 产品与技术相关动作在进入排期、实施、修复和发布前，必须读取相关模块的 `Product Registry` 与 `Code Registry`。
- 组织、人力、秘书处和制度文档相关动作在进入会议治理、扩招或岗位调整前，必须读取 `CompanyGovernanceRegistry`。
- registry owner 分工按 TriCompany 源侧规则固定为：`ProductRegistry` 由 CPO 小乔管理，`CodeRegistry` 由 CTO 小狄管理，中央 `CompanyGovernanceRegistry` 由 CAO 管理；`CEOChiefOfStaff` 负责路由、协调、催办、升级和中央收口，不长期代管具体 registry owner 职责。
- 产品与技术负责人必须维护 git、本地仓库和 worktree 的基本秩序，确保版本、分支、修复线和交付线可追踪。

## 4. 主循环状态

建议将一轮经营循环抽象为以下状态：

1. `directive-ready`
1. `plan-ready`
1. `demand-ready`
1. `scope-ready`
1. `budget-cleared`
1. `delivery-in-flight`
1. `go-to-market-running`
1. `review-ready`
1. `next-cycle-ready`

这些状态通过标准交接对象衔接，而不是通过自由文本口头传递。

## 5. 一级经营主流程

| 步骤 | 主责角色 | 输入 | 输出对象 | 通过条件 | 阻断条件 |
| --- | --- | --- | --- | --- | --- |
| 1. 目标下达 | `BoardOversight` / CEO | 当前战略、预算边界、经营目标 | `BOARD_DIRECTIVE` | 目标、边界、预算约束明确 | 目标冲突、战略未确认 |
| 2. 经营计划转译 | `CEOChiefOfStaff` | `BOARD_DIRECTIVE`、模块 Registry、当前记忆与未完成事项 | `OPERATING_PLAN` | 责任人、里程碑、节奏和升级规则明确 | 无法分派责任、关键依赖缺失 |
| 3. 市场信号采集 | `ChiefMarketingOfficer` | 当前实验、入口边界、市场信号 | `DEMAND_INTAKE` | 目标用户、问题和渠道证据明确 | 仅有空泛想法，无实际信号 |
| 4. 产品收敛 | `ChiefProductOfficer` | `DEMAND_INTAKE`、模块成熟度、成本约束 | `MVP_DEFINITION` | 范围内外、验证指标、定价假设明确 | 需求冲突、范围失控、模块不支撑 |
| 5. 预算校验 | `ChiefFinancialOfficer` | `MVP_DEFINITION`、成本与收入假设 | `BUDGET_CHECK` | 在预算约束内可推进 | 预算不成立、runway 风险过高 |
| 6. 技术交付决策 | `ChiefTechnologyOfficer` | `MVP_DEFINITION`、`BUDGET_CHECK`、模块 Code Registry | `ENGINEERING_TASK` | 技术路径、测试要求、发布要求明确 | 技术风险过高、测试或发布条件缺失 |
| 7. 上线与转化编排 | `ChiefOperatingOfficer`、`ChiefMarketingOfficer`、`ChiefSalesOfficer` | `ENGINEERING_TASK`、`OPERATING_PLAN`、渠道与销售状态 | `SALES_PROGRESS`，必要时 `RISK_ESCALATION` | 上线窗口、渠道动作、销售跟进已协同 | 上线 readiness 不足、协同失效、成交风险激增 |
| 8. 复盘回流 | `ChiefOperatingOfficer` / `CEOChiefOfStaff` | `SALES_PROGRESS`、成本与利润结果、风险记录 | `OPERATING_REVIEW` | 偏差、根因、纠偏和下一轮输入明确 | 数据缺失、无法形成下一轮动作 |
| 9. 新一轮启动 | `BoardOversight`、CEO、`CEOChiefOfStaff` | `OPERATING_REVIEW` | 下一轮 `BOARD_DIRECTIVE` 或计划调整 | 新目标或纠偏方向明确 | 重大偏航未处理 |

## 6. 关键门禁

| 门禁 | 主责角色 | 通过条件 | 未通过动作 |
| --- | --- | --- | --- |
| 战略门禁 | `BoardOversight` / `BusinessStrategy` | 当前实验、模块边界、优先级清晰 | 返回 `待确认`，不得推进 |
| 模块成熟度门禁 | 对应 Registry | 关键依赖模块不是纯占位，或已明确只做规划 | 缩范围、替换依赖或冻结 |
| 预算门禁 | `ChiefFinancialOfficer` | 成本、runway、熔断条件可接受 | 输出 `BUDGET_CHECK` 阻断或缩范围建议 |
| 交付门禁 | `ChiefTechnologyOfficer` | 技术路径、测试、回滚和发布路径明确 | 不进入上线编排 |
| 承诺门禁 | `ChiefSalesOfficer` / `CEOChiefOfStaff` | 对外承诺与当前交付能力一致 | 收窄报价或升级 CEO |
| 风险门禁 | 任意 Role Agent | 无高风险未处理项 | 产出 `RISK_ESCALATION` 并冻结相关动作 |
| 周期关闭门禁 | `ChiefOperatingOfficer` / `CEOChiefOfStaff` | 结果、偏差、纠偏动作可形成闭环 | 不得开启下一轮扩张 |

## 7. 与研发 10 阶段主流程的衔接

经营主工作流和研发主流程的关系如下：

| 经营对象 | 对研发主流程的作用 |
| --- | --- |
| `BOARD_DIRECTIVE` | 为当前轮产品探索提供优先级、预算和边界约束 |
| `OPERATING_PLAN` | 为本轮 DISCOVERY / INTELLIGENCE 提供经营目标和时间窗口 |
| `DEMAND_INTAKE` | 作为需求信号输入，支撑 DISCOVERY / INTELLIGENCE 的问题定义 |
| `MVP_DEFINITION` | 约束 INTELLIGENCE / DESIGNING 的范围和验证目标 |
| `BUDGET_CHECK` | 决定是否进入实现、是否缩范围、是否冻结 |
| `ENGINEERING_TASK` | 为 CODING 到 ASSURANCE 阶段提供技术执行对象 |
| `SALES_PROGRESS` | 为 DELIVERY 后的商业判断提供市场和收入信号 |
| `OPERATING_REVIEW` | 吸收 `PhaseResult`、销售结果、成本结果，形成下一轮经营输入 |

换言之：

- 研发主流程回答“怎么把东西做出来并交付”。
- 经营主工作流回答“为什么做这一轮、做完后是否值得继续”。

经营对象若要引用具体研发执行轮次和阶段，应使用：

- `cyber-company-phase-link.schema.json`
- `cyber-company-phase-bridge.md`

## 8. 无 CEO 模式

当 CEO 不在线时，工作流按以下规则降级运行：

1. `CEOChiefOfStaff` 自动接管常规经营编排。
1. `ChiefFinancialOfficer` 自动执行预算预警和熔断判断。
1. `ChiefOperatingOfficer` 维持节奏，不让循环停摆。
1. `ChiefMarketingOfficer`、`ChiefSalesOfficer`、`ChiefProductOfficer`、`ChiefTechnologyOfficer` 仅在已批准边界内继续执行。
1. 超出授权矩阵的事项一律进入 `RISK_ESCALATION` 或待人工确认队列。

## 9. 每层节奏

### 9.1 每日节奏

- 渠道、线索、任务、异常数据同步
- 低风险事项推进
- 风险即时升级
- `CEOChiefOfStaff` 当日确认 CEO 日程、重大事项队列和到期未闭环事项
- 重大事项必须当日确认是否继续推进、冻结或升级

### 9.2 每周节奏

- `OPERATING_PLAN` 更新
- `SALES_PROGRESS` 汇总
- 经营偏差检查
- 复盘和纠偏进入下周计划
- `CEOChiefOfStaff` 主持 CEO 周会，输出会议纪要、责任人、截止时间与未决事项
- 超过 7 天未闭环的事项必须进入周会优先议程

### 9.3 每月节奏

- `BOARD_DIRECTIVE` 刷新或确认
- 预算和盈亏检视
- 是否延续当前实验路线的判断
- `CEOChiefOfStaff` 主持月度经营复盘，核对商业模式、组织结构、预算姿态与下月主线

## 9.4 重大事项时限

- 影响上线、收入、预算、人员、交付或品牌的重大事项，必须在当个工作日进入总助跟踪队列。
- 重大事项必须在 24 小时内给出明确的下一步动作、冻结或升级结论。
- 跨角色重大事项若 48 小时未闭环，默认升级给 CEO 或对应最终责任人。
- 超过 7 个自然日未闭环的重大事项，必须进入 `OPERATING_REVIEW` 或周会重点复盘。

## 10. 一轮最小产物

一期建议每轮经营最少留存以下对象：

1. `BOARD_DIRECTIVE`
1. `OPERATING_PLAN`
1. `MVP_DEFINITION`
1. `BUDGET_CHECK`
1. `ENGINEERING_TASK` 或明确的冻结结论
1. `SALES_PROGRESS`
1. `OPERATING_REVIEW`

若过程出现异常，还应补充：

1. `RISK_ESCALATION`

## 11. 模板入口

可直接从以下样板开始填写：

- `handoff-templates/board-directive.example.json`
- `handoff-templates/operating-plan.example.json`
- `handoff-templates/demand-intake.example.json`
- `handoff-templates/mvp-definition.example.json`
- `handoff-templates/budget-check.example.json`
- `handoff-templates/engineering-task.example.json`
- `handoff-templates/sales-progress.example.json`
- `handoff-templates/risk-escalation.example.json`
- `handoff-templates/operating-review.example.json`
- `handoff-templates/skill-spec.example.json`
- `handoff-templates/schedule-spec.example.json`

## 12. 运行样例入口

若要查看一条完整的首轮经营链样例，可直接阅读：

- `operating-cycle-example/README.md`

该样例基于当前默认经营实验 `AI 内容运营与增长微服务`，但只用于演示对象流转，不代表真实经营记录。

## 13. 当前结论

到这一步，TriMetaverse 虚拟公司已经具备：

- 角色网络
- 标准交接对象
- 对象样板
- 第一版经营主工作流骨架
- 首轮经营链运行样例

下一步最自然的是：

1. 先把 CEO 与 `CEOChiefOfStaff` 的真实经营同步、周计划与纠偏节奏跑顺
1. 再让 `ChiefOperatingOfficer`、`ChiefProductOfficer`、`ChiefFinancialOfficer`、`ChiefTechnologyOfficer` 围绕首版上线形成最小闭环
1. 最后再继续扩展其余经营对象 schema 与更高阶自动化能力

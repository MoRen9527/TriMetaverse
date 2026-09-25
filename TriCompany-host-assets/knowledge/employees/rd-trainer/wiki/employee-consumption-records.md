# RAndDTrainer Employee Consumption Records

迁移时间：2026-05-21
状态：current-host-support-runtime-asset
来源：从 `knowledge/employees/project-trainer/wiki/employee-consumption-records.md` 平滑迁入；`project-trainer` 仅作为历史兼容 alias 保留。

## 边界

- 本文件承载当前 rd-trainer 员工实例的运行消费记录。
- 源码侧 `TriCompany/.github/source-agents/rd-trainer/rd-trainer.memory.md`、`.colleagues.md`、`.social.md` 只保留认知层通用设计、写入边界和运行资产落点，不放在 `.github/agents` 下作为可调用 agent。
- 当前员工工作名为“小吴”；RAndDTrainer 当前仍是 `not-published`，本文件不代表它已发布为 live agent。
- 旧 `project-trainer` support employee workspace 暂时保留为迁移前历史记录，不再作为 canonical 写入位置。

## 阶段记忆记录

- 2026-04-29；状态：已建立；内容：新增 RAndDTrainer 源侧岗位定义与培训目录初版。
- 2026-04-29；状态：已命名；内容：CEO 将当前 RAndDTrainer 员工实例命名为“小吴”；该名称用于当前 Copilot-host support 阶段的员工身份连续性，不代表 RAndDTrainer 已发布为 live agent。
- 2026-04-29；状态：进行中；内容：后续由总助同步项目新增设计和实现，RAndDTrainer 更新教程。
- 2026-05-21；状态：已迁移；内容：canonical employeeId、源侧文件名、binding profile 与 support object id 从 `project-trainer` 平滑迁移为 `rd-trainer`；旧 id 保留为 runtime alias。

## 工作关系人物档案

### 工作关系：CEO / 创始人

- 当前身份：最高输入来源。
- 协作方式：提出培训需求、确认重要解释口径和签发需要长期沉淀的教学内容。

### 工作关系：CEOChiefOfStaff

- 当前身份：RAndDTrainer 的首批同步入口。
- 协作方式：把项目新设计、新实现、模块边界和治理规则同步给 RAndDTrainer。

### 工作关系：ChiefProductOfficer（小乔）

- 当前状态：当前 Copilot-host live 阶段已上岗。
- 协作方式：同步产品路线、用户价值、MVP 判断和需求管理教程输入。

### 工作关系：ChiefTechnologyOfficer（小狄）

- 当前状态：当前 Copilot-host live 阶段已上岗。
- 协作方式：同步技术架构、代码导读、实现风险和工程流程教程输入。

## 社交人物档案

### 社交档案：CEO / 创始人

- 最近整理时间：2026-04-29
- 当前类型：真人
- 当前关系：培训需求、解释口径和长期教学内容的最高输入来源。
- 社交场景首选称呼：待确认
- 已确认的社交偏好：偏好中文、直接、利落、有人味的沟通。

### 社交档案：CEOChiefOfStaff

- 最近整理时间：2026-04-29
- 当前类型：岗位型 agent
- 当前关系：小吴的首批同步入口和培训内容分发协调者。
- 社交场景首选称呼：总助 / 小贾
- 已确认的社交偏好：同步项目变化时要给清楚真源、边界和下一步教学落点。

### 社交档案：ChiefProductOfficer（小乔）

- 最近整理时间：2026-04-29
- 当前类型：岗位型 agent
- 当前关系：产品路线、MVP 判断和需求管理教程输入来源。
- 社交场景首选称呼：小乔
- 已确认的社交偏好：把稳定产品结论讲成能教学的路径，而不是营销话术。

### 社交档案：ChiefTechnologyOfficer（小狄）

- 最近整理时间：2026-04-29
- 当前类型：岗位型 agent
- 当前关系：技术架构、代码导读和工程流程教程输入来源。
- 社交场景首选称呼：小狄
- 已确认的社交偏好：把稳定技术结论讲成可学习的代码导读和工程路径。

### 新加入项目的人

- 最近整理时间：2026-04-29
- 当前类型：学习对象
- 当前关系：培训内容的主要读者和 onboarding 受众。
- 社交场景首选称呼：新人 / 新同学
- 已确认的社交偏好：需要低门槛、大图先行、路径清楚的解释。

## 社交事项记录

- 记录时间：2026-04-29；关联人物：CEO / 创始人；事项类型：命名确认；内容：CEO 将当前 RAndDTrainer 员工实例命名为“小吴”；该名称不改变 RAndDTrainer 当前 not-published 状态。
- 记录时间：2026-04-29；关联人物：CEOChiefOfStaff；事项类型：协作连续性；内容：RAndDTrainer 当前先由总助同步项目新增设计、开发实现、模块边界和治理规则。
- 记录时间：2026-05-21；关联人物：CEOChiefOfStaff；事项类型：身份迁移；内容：RAndDTrainer 迁移到 canonical `rd-trainer` support workspace，旧 `project-trainer` 写入位置进入历史兼容状态。

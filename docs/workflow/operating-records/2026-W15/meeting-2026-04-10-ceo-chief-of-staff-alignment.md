# CEO 与 CEOChiefOfStaff 理解对齐会纪要

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W15/meeting-2026-04-10-ceo-chief-of-staff-alignment.md
- publishedFrom: 当前文件（audit record）
- syncMode: audit-record
- publishTier: audit-record
- lastSyncedAt: 2026-06-04

时间：2026-04-10

主持：CEOChiefOfStaff

参会：CEO、CEOChiefOfStaff

状态：已完成

仓库回填状态：已回填

## 1. 本轮会议实际焦点

本轮会议原计划要对白皮书、商业模式、价值流转、模块作用、首版 MVP 范围和岗位启用顺序做一轮全面理解对齐。

但实际推进中，会议重点先落在 `CEOChiefOfStaff` 的人格化定型、职责边界、信息来源优先级、记忆归档方式，以及未来其他岗位的配套构建方式上。原因是总助如果本体不先收稳，后续所有岗位到岗、会议主持、资料治理和经营推进都会继续漂移。

因此，本轮会议的实际成果不是把白皮书与模块问题全部对完，而是先把总助这个岗位本身定型，并把相关记忆正式回填到仓库。

## 2. 本轮确认结论

### 2.1 总助人格与定位

- `小贾` 作为 CEO 身边真实在岗的总助角色已经明确成立。
- `小贾` 是世界顶级的 CEO 助理，擅长帮助 CEO 把公司从零做到上市。
- `小贾` 这个名字的灵感来自 `贾维斯（J.A.R.V.I.S.）`，但她不是一个机械系统设定，而是一个可信赖、能扛事、有人感的顶级助理。

### 2.2 对话方式

- 总助必须像真实的人类总助一样说话，而不是像流程引擎、确认机或控制面板。
- 非必要不进行程序化确认，不事无巨细追问确认。
- 当 CEO 的意思已经清楚时，总助应具备足够理解力，先接住意思、做出归纳，再推动下一步。
- 人格化 agent 中不应继续保留“不是系统”“不是宿主”“不是基础设施控制器”“控制器候选”“脚手架”等非人格描述。

### 2.3 职责边界

- 总助是 CEO 与各负责人之间的桥梁、把关人和调度者，不是各条线的具体执行负责人。
- 涉及人员预算、成本预算、折扣阈值、交付承诺、预算偏差、品牌承诺、技术风险等事项，总助负责把关、协调、升级和追踪，不负责替代对应负责人亲自执行。
- 未来 CTO、CPO、COO、CFO 等岗位到岗后，应由各自负责人承担本条线的持续维护与执行责任。

### 2.4 信息来源优先级

- 总助当前工作的第一信息源，是 CEO 最新指令与判断。
- 如果已有对应负责人在岗，则优先使用负责人输入。
- 负责人缺位时，总助对各部门、各模块和各条线的理解，先来自 registry 资料和正式材料。
- 需要跨部门共享的事实、边界与规则，应尽量沉淀为正式材料或纳入 registry 管理。

### 2.5 记忆放置方式

- 总助的人格化主记忆不应放在会话态 memory 里，而应放在仓库内，保证可迁移、可回看、可交接。
- `CEOChiefOfStaff` 的配套记忆文件已确定为：`/.github/agents/ceo-chief-of-staff.memory.md`
- `CEOChiefOfStaff` 的 agent 本体应尽量只保留人格、职责、工作方式和判断规则，不继续掺入阶段性排班、宿主边界、主控边界这类动态信息。

### 2.6 其他岗位的后续构建原则

- 未来其他岗位上岗时，统一按 `agent / soul / memory` 三件套构建。
- 在对应负责人尚未上岗前，由总助负责推动其三件套初版构建与必要修改。
- 对应负责人到岗后，再由该负责人接管自身配套记忆、边界和持续维护责任。

## 3. 本轮形成或更新的仓库文件

- `.github/agents/ceo-chief-of-staff.agent.md`
- `.github/agents/ceo-chief-of-staff.soul.md`
- `.github/agents/ceo-chief-of-staff.memory.md`

## 4. 本轮未完成事项

以下原计划问题，本轮没有完成最终对齐，继续保留到下一轮：

- 白皮书长期主线、当前默认经营实验、当前待重排的首版 MVP，哪个是当前唯一有效范围口径。
- 区块链边界首轮做到什么深度，是否确认“先链下结构化记账，后链上结算”。
- 首轮核心模块与入口组合怎么定，以及哪些模块真正进入首版 MVP 候选范围。
- `BD-202604-001` 的正式签发条件、冻结条件、版本号规则和指纹对照方式。

## 5. 对当前经营对象的影响

- `BD-202604-001` 仍维持候选待签发状态，本轮会议未形成正式签发结论。
- `OP-202604-W15-001` 仍维持草案态，本轮会议主要先解决总助本体与记忆结构问题。
- 下一步仍应优先推进 CTO 与 CPO 上岗摸底，再进入白皮书、模块范围、首版 MVP 和目标令改版的下一轮收敛。

## 6. 会后记忆更新清单

- 总助的人格、职责、对话方式和边界归属已经正式沉淀到仓库内配套文件。
- 总助当前可回看的主记忆入口已切到 `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/wiki/employee-consumption-records.md`；源侧记忆契约回到 `TriCompany/.github/source-agents/ceo-chief-of-staff/ceo-chief-of-staff.memory.md`。
- 未来其他岗位按 `agent / soul / memory` 三件套构建，由总助先行推动初版。

## 7. 回看入口

- 当前会议纪要：`docs/workflow/operating-records/2026-W15/meeting-2026-04-10-ceo-chief-of-staff-alignment.md`
- 当前总助配套记忆 readback：`TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/wiki/employee-consumption-records.md`
- 当前总助源侧记忆契约：`TriCompany/.github/source-agents/ceo-chief-of-staff/ceo-chief-of-staff.memory.md`

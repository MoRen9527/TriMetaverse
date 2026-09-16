# B4 扫尾批7 · CSO source-agents 五席联审 · CAO 席意见

- **席位**：CAO（ChiefAdministrativeOfficer，小行）
- **date 现查**：2026-09-16T15:11:10Z（人读轨 2026-09-16 23:11:10 +08；本任务开工首动作现查，读数原样粘贴）
- **M4 零改动声明**：本席本次为审读位（审零改动），未对靶标 8 件做任何写入或修改；本席全部落盘仅本意见件一处。
- **独立性声明**：本席未读其他四席任何意见稿，席间零交换；对照基准仅 CAO 本席同构源件与在册真源文档；读面压缩令已遵（跨批对照仅命中族名+一句话，未读先例原文与本席既往稿）；盘面实勘仅 ls/find 只读验证。
- **依据链**：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律（分歧挂起候裁清单化／保留权候 CEO／冻结件豁免标注）· D-13 通信名址规程 · D-04 报时纪律 · LG-023 跨仓路径纪律
- **批号**：B4-sweep-b7
- **靶标**：`/srv/fleet/TriCompany/source-agents/customer-success-officer/` 全 8 件（412 行；colleagues-social 合并件=模板破例首例）

## 表态总览

| # | 文件 | 级别 | 意见摘要 |
|---|------|------|----------|
| 1 | agent-body.agent.md | 建议 | 决策三分法 PASS/ESCALATE/FORBIDDEN 非家族标准款；customer-feedback/ 落点未标待初始化 |
| 2 | agent-frontmatter.agent.md | PASS | 无意见（description 投影一致） |
| 3 | customer-success-officer.agent.md | 建议 | 冻结锚缺失（族名沿判）；本件无残渣（同族最干净） |
| 4 | customer-success-officer.contract.yaml | 挂起 | paths 双键同指合并件、拆域抽取语义未定义（候裁群 D）；reports_to=COO（候裁群 C 侧证）；换代窗沿判 |
| 5 | colleagues-social.agent.md | 建议 | social 域契约空洞化（任务书预感坐实）；命名日期锚缺位 |
| 6 | memory.agent.md | 建议 | 旧 assets 包落点整包不存在（实勘坐实）；结构薄版缺两节 |
| 7 | session-body.agent.md | 建议 | 上报线=COO（候裁群 C 侧证）；三分法复刻段随动；自实勘申报为最佳实践 |
| 8 | soul.agent.md | 建议 | 薄版未完成态：缺名行锚+缺三节；角色气质与 agent-body 逐字一致（唯一无双写漂移席） |

分布：PASS 1 · 建议 6 · 挂起 1（共 8 件）。**CSO 命名一致性通过**：「小成」在 agent-body/contract/session-body/colleagues-social 四处一致，无 E2 分裂（仅 soul 缺锚行，格式建议）。

## 逐件意见

### 1. agent-body.agent.md — 建议

- **意见①（本批实质发现）**：「决策三分法」为 PASS/ESCALATE/FORBIDDEN 三档——非家族标准款 APPROVE/FREEZE/ESCALATE：缺 FREEZE 档（客户条款变更等候确认场景在 contract.freeze 有、三分法无承载），FORBIDDEN 档实为护栏内容（与行为护栏部分同旨）。修改建议：对齐家族三分法（APPROVE/FREEZE/ESCALATE），FORBIDDEN 条目归行为护栏；session-body 复刻段（第 34 行）随动。验收锚=三分法三档与家族 decision_rights approve/freeze/escalate 对齐。
- **意见②（悬空落点标注案·execution/ 系第 4 例）**：第 53 行「客户反馈：`TriCompany/docs/execution/customer-feedback/`」经本席 ls 实勘不存在且未标「（待初始化）」——同件第 52 行 customer-state.md 已标，同节口径不一；且本件 session-body 第 36 行已自实勘申报两者均不存在（互证坐实）。修改建议：补「（待初始化）」。验收锚=不存在落点带标注。
- **同构核对通过项**：默认输出结构节齐备 ✓；无宿主阶段时点陈述 ✓；核心职责 7 条全正向无禁止项混入（同族最净）✓；回答前必须核查+固定前置核查（compass 简化）双节 ✓。

### 2. agent-frontmatter.agent.md — PASS

无意见。name/description/user-invocable 齐备；description 与发布面适用场景文案逐字一致（description 投影制核对通过）。

### 3. customer-success-officer.agent.md — 建议

- **意见（族名沿判）**：退役头注缺冻结时点锚（冻结件豁免标注原则已符，时点锚缺）。验收锚=头注含可核查时点/commit 锚。
- **通过项**：本件与 agent-body 逐节同文且**无编辑残渣**（无重复条目、无连续空行）——同族退役件中最干净，残渣批量清理时本件仅需补锚一行。

### 4. customer-success-officer.contract.yaml — 挂起

- **挂起①（候裁群 D·本批核心·任务书点名项）**：`paths` 第 17-18 行 `colleagues:` 与 `social:` **双键同指** `colleagues-social.agent.md`。文件在、键值链通（无断链），但**两域拆分抽取语义未定义**：渲染管线按域取键时同一件被两域重复注入（域分离失效），或按文件去重时 social 域混入 colleagues 汇报关系内容（跨域污染）——合并件内部亦无可抽取的域分节锚。「模板破例首例」只合并了文件、未配套抽取规则。候裁 owner=CHO 门（五件套增量验收）+宿主发布流程核对：二选一——定义合并件拆域抽取规则（如域分节锚+按段抽取），或回退分件。验收锚=paths 双键取值与渲染抽取行为一致且两域内容互不污染。
- **建议①（沿判换代窗一揽子）**：`runtime_baseline` 旧三字段未换代；`tools` 含 `runtime_equivalent: openclaw:*` 3 处；**缺 `instructions` 节**（家族合同均有）；io_contract inputs 仅 2 项（与 agent-body 核查链 5 项不同步）。随换代批一并核对。验收锚=与 CAO 换代口径同构核对单通过。
- **建议②（轻）**：`peers` 值用小写 agent-id（chief-marketing-officer），家族他席合同均用大驼峰（ChiefProductOfficer）——格式随名址批统一。
- **候裁群 C 侧证**：`reports_to: chief-operating-officer`（第 48 行）——CSO 侧汇报线证据第 3 处（合同面），见群 C。
- **通过项**：`display_name: 小成` 有正式名 ✓；responsibilities 全正向 ✓。

### 5. colleagues-social.agent.md — 建议

- **意见①（任务书预感坐实·两域合写影响）**：合并件 23 行中 social 域仅第 20-23 行 3 行概述——**social 域契约空洞化**：无社交定位、无写入边界声明（「源码侧只保留通用规则，不写具体称呼/流水」）、无层契约（current-host consumption data 定性）、无晋升规则——四项在家族 social 件均为标准结构，合并后全部缺位；colleagues 域侧尚完整（汇报/协作/社交连续性声明）。两域合写不能以 social 域减配为代价。修改建议：合并件内补 social 域最小契约节（社交定位+写入边界+晋升规则三行即可），或出示模板破例裁决依据证明 3 行即定稿口径。验收锚=social 域边界声明在件可抽。
- **意见②**：工作名锚缺位——CSO 命名「小成」散见 agent-body/contract/session-body，但**无一处载命名日期锚**（他席 social 件均载「CEO 正式命名，2026-08-01」款）。修改建议：随 social 域补节补「工作名：小成（CEO 正式命名，<日期>）」锚行，日期从命名台账补。验收锚=命名锚含日期。
- **意见③（族名沿判）**：名址格式混用（「CMO 小敏（chief-marketing-officer）」全格式 vs「小贾」裸别名），与 D-13 全表对表统一。
- **候裁群 C 侧证**：第 5 行「汇报给：COO 小营」——CSO 侧第 2 处，见群 C。

### 6. memory.agent.md — 建议

- **意见①（悬空落点标注案·实勘坐实）**：第 17 行「客户成功记忆：`TriCompany-copilot-host-assets/knowledge/employees/customer-success-officer/`」经本席 ls 实勘——**`TriCompany-copilot-host-assets/` 整包不存在**（旧支撑包已废/未挂载），落点悬空；且本件为同族唯一**缺 `TRICOMPANY_COGNITION_HOME` 私域落点**的 memory 件（家族口径落点缺位）。修改建议：改指 runtime cognition 私域（`TRICOMPANY_COGNITION_HOME` 下员工实例目录，家族口径）。验收锚=落点实盘可达且与家族口径一致。
- **意见②（结构薄版）**：仅 18 行，缺「当前原则」「层契约」两节（家族 memory 件五节结构对比）。修改建议：补两节（节律现势不入件/运行态分层原则+认知层契约正身声明），或出示 CSO 简版豁免依据。验收锚=结构齐或豁免依据在册。
- **通过项**：写入边界三条（隐私/未验证推断/不替代 CRM）内容质量好 ✓。

### 7. session-body.agent.md — 建议

- **意见①（候裁群 C 侧证）**：第 8 行「上报线=COO」——CSO 侧第 4 处，见群 C。
- **意见②（随动）**：第 34 行决策三分法复刻段随 agent-body 意见 1① 联动改（PASS/FREEZE/ESCALATE 对齐后同步）。
- **意见③（族名沿判·轻）**：无正身完成条款（头注状态标注本身详尽：Wave 2+spawn 源由 M-004 残留①+CHO 定谳时点，同族最佳之列）；定稿后补完成态标记。
- **通过项（本批亮点·六批落点纪律最佳实践）**：第 36 行「客户真源现状（实勘 2026-09-04 如实申报）：customer-state.md 与 customer-feedback/ 均未初始化（不存在）……禁编造满意度/续费率/案例……两真源初始化后回填本节指针」——自实勘申报+禁编造条款+回填承诺三合一；本席今日实勘复核**申报仍准** ✓。域路由指针「实勘在位，失联路径不入册」原则 ✓；`business-state.md` 指针经本席实勘**实盘有效** ✓。

### 8. soul.agent.md — 建议

- **意见①（薄版未完成态）**：仅 13 行——无「名字：小成」锚行（家族 soul 首节标准款；CSO 命名四处一致但身份正身层反而无锚，含命名日期亦无处可查）、无「当前原则」节、无「运行资产落点」节、无「层契约」节——家族 soul 结构（人格设定+四节）缺其四。修改建议：补齐家族结构（锚行+三节），或出示 CSO 简版豁免依据。验收锚=soul 含命名锚行（含日期）+层契约声明。
- **通过项**：「角色气质」4 条与 agent-body 同文节**逐字一致**——八批审读中唯一 soul/agent-body 气质无双写漂移席 ✓。

## 观察注记（不计意见，不要求本批处理）

- **候裁群 C（跨批强化·原批2 群2）**：CSO→COO 汇报线本批新增 4 处 CSO 侧一致证据（agent-body 第 16 行、colleagues-social 第 5 行、contract `reports_to`、session-body 第 8 行）vs COO contract `supervises: []` 1 处——证据面 4:1，指向 COO contract 漏登记 `supervises: [CustomerSuccessOfficer]`；仍候 CHO 组织架构真源核对后二选一修正。
- **跨批勘误线索（CPO 侧）**：本席今日实勘 `TriCompany/docs/registry/business-state.md` **存在**、`business-strategy-state.md` **不存在**——CSO session-body 指针用前 者（有效）；凭本席上下文记忆，CPO session-body 商业边界指针用的是后者（疑似文件名错）。供 CPO 席/CHO 门核对，不在本靶标内处置。
- **跨批命中族（一句话级）**：E2 命名追平群——CSO **不在群内**（小成四处一致）；paths 候裁群 B——CSO 因合并件破例另行构成群 D（抽取语义），与「缺 session_body 登记族」并行；execution/ 悬空落点系——第 4 例（customer-feedback/）；名址格式族、冻结锚族、runtime_baseline 换代窗族——均命中沿判。
- **薄版件族观察**：CSO 认知层三件（soul 13 行/memory 18 行/colleagues-social 23 行）均为 8 月老批次薄版，与 Sep 14-15 新批次身份件（agent-body 等）成熟度断层明显——建议 CHO 门将「CSO 认知层三件结构补齐」立为五件套增量验收候办项（本席已按件列意见，此处记族观察）。

## 挂起候裁清单（汇总）

| 群 | 挂起项 | 涉及件 | 候裁 owner | 裁决路径 |
|----|--------|--------|-----------|----------|
| C | CSO→COO 汇报线：CSO 侧 4 处一致自认 vs COO contract `supervises: []`（原批2 群2，本批强化至 4:1） | COO contract ＋ CSO 四件（侧证） | CHO（staffing governance） | 核对组织架构真源后修正 COO contract 登记或 CSO 侧汇报表述 |
| D | contract paths 双键同指合并件、两域拆分抽取语义未定义（模板破例首例配套缺失） | contract ＋ colleagues-social | CHO 门（五件套增量验收）＋ 宿主发布流程核对 | 定义合并件拆域抽取规则（域分节锚）或回退分件，二选一 |

本席保留权：以上全部意见保留权候 CEO；审读位不代裁、不改件。

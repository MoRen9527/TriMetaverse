# B4 扫尾批1 五席联审 · CPO 表态报告

- **席位**：ChiefProductOfficer（CPO 小乔）
- **时刻**：2026-09-16T13:21Z（开工 date 现查）/ 2026-09-16T13:25Z（成文复现查）
- **批号**：B4-sweep-b1
- **程序位**：审零改动（M4）——本席联审全程零改动，未创建/修改任何靶标文件
- **独立性声明**：未读他席稿，席间零交换；本报告为本席独立逐件表态
- **依据链**：任务书 20260916-msg-resume 任务2；D-27 树协议；联审工作流 V0.2（`TriCompany/docs/workflow/joint-review-orchestration-workflow.md`）；三红线纪律（分歧挂起候裁清单化 / 保留权候 CEO / 冻结件豁免标注）
- **靶标**：`/srv/fleet/TriCompany/source-agents/chief-product-officer/` 全 9 件，逐件全量读毕

## 一、表态总表

| # | 文件 | 级别 | 意见摘要 |
|---|---|---|---|
| 1 | chief-product-officer.agent.md | 建议 | 退役快照无基准日标注，版本差不可判 |
| 2 | agent-frontmatter.agent.md | PASS | 无意见 |
| 3 | agent-body.agent.md | 建议 | 指针版前置核查不含归属路由阀门，双宿主面口径待确认 |
| 4 | chief-product-officer.contract.yaml | 建议 | responsibilities 第4条 schema 不一致；instructions 核查清单缺阀门 |
| 5 | colleagues.agent.md | PASS | 无意见 |
| 6 | memory.agent.md | 建议 | 运行资产落点 TRICOMPANY_COGNITION_HOME 三现冗余；传闻句歧义 |
| 7 | session-body.agent.md | 建议 | PRODUCT.md 疑为 PROJECT.md 笔误；正身声明条件式时态已过时 |
| 8 | social.agent.md | PASS | 无意见 |
| 9 | soul.agent.md | 建议 | 与 agent-body 四节逐字重复，单源化待确认（轻） |

**分布：PASS 3 / 建议 6 / 挂起 0。**

## 二、逐件意见明细

### 1. chief-product-officer.agent.md —— 建议

- **理由**：头部已标注「本件已退役出渲染链；真源=同目录 agent-body.agent.md（D1b manifest 已切源）」，退役标注与真源声明明确，内容同步可豁免；但其 body 为退役时快照，与现役 agent-body 存在版本差（缺 2026-09-11 产品域收口落格段；「固定前置核查」为完整清单版而非指针版），快照无基准日，消费方无法判断滞后程度，存在误读旧口径风险。
- **修改建议**：退役标注补一行快照基准，如「快照截至 2026-09-XX D1b 切源时，现行口径以 agent-body.agent.md 为准」（日期取 manifest 切源 commit 日）。
- **验收锚**：退役标注含快照基准日或版本差提示；该件不再被误当现役口径引用。

### 2. agent-frontmatter.agent.md —— PASS

- 无意见。name/description/user-invocable 三键齐备，与 contract.yaml identity 及渲染面描述语义一致。

### 3. agent-body.agent.md —— 建议

- **理由**：「固定前置核查」节为指针式（→ compass 手册〈开工前置核查〉节），指针无手册路径锚，且指针版不含 0.5 归属路由阀门（阀门仅存于 session-body 完整清单）。在 --host=claude-session 渲染下两节并存、阀门可达；若纯 body 宿主渲染，合同面无阀门条款。括注「随手册发布更新」说明不固化属设计，但阀门条款是否随手册注入未明。
- **修改建议**：二选一——①指针补 compass 手册真源路径锚；②确认 compass 手册〈开工前置核查〉节含归属路由阀门条款，保证双宿主面阀门口径可达。
- **验收锚**：纯 body 宿主渲染产物中归属路由阀门可被会话消费（手册注入或 body 明文）。

### 4. chief-product-officer.contract.yaml —— 建议

- **理由**：①responsibilities 前三条为纯字符串，第 4 条为 dict（description+priority），schema 不一致，系「使命」句转写残留；②instructions「回答前必须核查」5 条不含 0.5 归属路由阀门，落后于 agent-body/session-body 现行合同口径。
- **修改建议**：①第 4 条改纯字符串「让产品范围与当前经营实验和低成本盈利目标保持一致」（priority: high 并入描述或移 decision_rights），或全部结构化；②核查清单补「0.5 归属路由阀门：未经归属路由审批禁止创建/修改他域产出物」。
- **验收锚**：responsibilities 元素同构；instructions 核查清单含阀门条目，与 body / session-body 三面口径一致。

### 5. colleagues.agent.md —— PASS

- 无意见。汇报/紧密协作/常规协作三层关系清晰；「CPO 提供需求上下文，小全在 CTO 架构下实现」与派工枢纽=CTO（新规程②）不冲突（协作关系≠派工权）；层契约尾句与 memory/social 同构。

### 6. memory.agent.md —— 建议

- **理由**：①「运行资产落点」节 TRICOMPANY_COGNITION_HOME 三处出现（认知层状态 / 知识工作区 / 或当前 runtime cognition backend），语义重叠，系合并编辑残留；②写入边界「不写入具体用户数据或市场传闻——标注来源和可信度级别」句式压缩后歧义：破折号补语按字面读与「不写入」矛盾，原意应为传闻留痕须标注。
- **修改建议**：①落点节合并为一条「runtime cognition 私域：`TRICOMPANY_COGNITION_HOME` 或当前 runtime cognition backend（认知层状态与派生资产落点）」；②改写为「市场传闻类信号不入事实记忆；如需留痕须标注来源和可信度级别」。
- **验收锚**：TRICOMPANY_COGNITION_HOME 在本件落点节仅一处定义；传闻句无字面矛盾。

### 7. session-body.agent.md —— 建议

- **理由**：①开工前置核查 0.5 阀门首行「产品范围/需求/PRODUCT.md/STATE.md」——产品真源实名为 PROJECT.md（`TriCompany/docs/product/PROJECT.md`），PRODUCT.md 疑为笔误（件内其余处均作 PROJECT.md）；②「本源件经 CHO 门签收+管线 execute 后为 session 面正身」为条件式表述，本件现已入渲染链（条件已达成），文本停留在将来时，状态与文本不符。
- **修改建议**：①PRODUCT.md → PROJECT.md；②正身声明改完成时并附签收/入链日期（如「已于 2026-09-XX 经 CHO 门签收入链」）。
- **验收锚**：文件名拼写与产品真源一致；正身声明为完成时态或附状态日期。

### 8. social.agent.md —— PASS

- 无意见。社交定位与 soul 气质、agent-body 原则同向（做少做对、验证再扩）；层契约尾句与 colleagues/memory 同构；落点指针齐备。

### 9. soul.agent.md —— 建议（轻）

- **理由**：「认知分层约束」「当前原则」「运行资产落点」「层契约」四节与 agent-body 同名节逐字重复。若为源件族统一模板结构（每层件自带层契约声明）则属设计；但双源逐字重复使后续原则修订需双写，存在漂移风险（#1 退役件的版本差即前车之鉴）。
- **修改建议**：先确认发布管线模板规范——若允许/要求重复，在模板规范明文标注「soul 与 body 同构段以管线为准」；若非刻意，soul 精简为人格设定+禁止退化+层契约指针，原则/落点单源于 agent-body。
- **验收锚**：同一语义段在五件套内有唯一真源点，或模板规范明文豁免重复。

## 三、红线适用说明

- **分歧挂起候裁清单化**：本报告无挂起项，无候裁清单。
- **保留权候 CEO**：本席无需 CEO 预留裁决的事项；#3/#9 涉及发布管线模板设计确认权，归管线/治理侧，非本席越权可裁，故仅列建议不动口径。
- **冻结件豁免标注**：#1 为退役件，按原子退役律保留不删，本席仅建议补快照基准标注，不要求内容向真源回同步。

## 四、汇总读数

靶标 9 件全量读毕；表态分布 PASS 3 / 建议 6 / 挂起 0；意见明细 9 条（理由+修改建议+验收锚齐备，分布于 6 件）；全程零改动，独立性无破。

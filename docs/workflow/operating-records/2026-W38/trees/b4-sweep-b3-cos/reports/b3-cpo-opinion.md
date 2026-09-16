# B4 扫尾批3 五席联审 · CPO 表态报告（靶标=COS 席）

- **席位**：ChiefProductOfficer（CPO 小乔）
- **时刻**：2026-09-16T14:07Z（开工 date 现查）
- **批号**：B4-sweep-b3
- **程序位**：审零改动（M4）——本席联审全程零改动，未创建/修改任何靶标文件
- **独立性声明**：未读他席联审稿，席间零交换；本报告为本席对 COS 席源件九件的独立逐件表态
- **依据链**：任务书 20260916-msg-resume 任务2；D-27 树协议；联审工作流 V0.2（`TriCompany/docs/workflow/joint-review-orchestration-workflow.md`）；三红线纪律（分歧挂起候裁清单化 / 保留权候 CEO / 冻结件豁免标注）；批1/2 共识基线作跨批对照（同族沿判向不重复展开）
- **靶标**：`/srv/fleet/TriCompany/source-agents/ceo-chief-of-staff/` 全 9 件（623 行），逐件全量读毕

## 〇、跨批对照（正面确认先行）

- **⑦ 改排席间互洽**：COS body 收口督办段（保留分派权/升级权/台账销账变更权+汇总呈报半环，催办随迁 COO）与 COO body/memory 督办段（不握分派/升级/销账，销账唯 COS）权界互锁、口径互洽——三席四件无矛盾，正面确认。
- **命名三面一致**：soul「名字：小贾」=contract `display_name: 小贾`=social「小贾（2026-07-01 上岗）」——对照批2 COO 席四件工作名分裂，COS 为正样例。
- **收口督办接口记忆**（memory）与 body ⑦ 改排段同构，落笔及时。

## 一、表态总表

| # | 文件 | 级别 | 意见摘要 |
|---|---|---|---|
| 1 | ceo-chief-of-staff.agent.md | 建议 | 退役快照无基准日（批1/2 判向沿判）；快照 name=TriCompanyCEOChiefOfStaff 与现役 name 漂移作注 |
| 2 | agent-frontmatter.agent.md | PASS | 无意见 |
| 3 | agent-body.agent.md | 建议 | 指针化损耗高于 CPO 面：完整清单 9.5 条含 FADE 协议正身核查，compass 手册承接风险 |
| 4 | ceo-chief-of-staff.contract.yaml | 建议 | responsibilities dict 残留（沿判）；商业阈值硬编码双源风险；TriMC 旧名；peers 缺 COO；核查清单缺阀门与 FADE 条 |
| 5 | colleagues.agent.md | 建议（轻） | COO 条目缺督办读数接口（批2 #5 判向沿判）；镜像一致性正面确认 |
| 6 | memory.agent.md | 建议 | TRICOMPANY_COGNITION_HOME 三现+私域变量混入共享审计行（批1 #6 判向沿判+特有）；授权矩阵文件名同件两名 |
| 7 | session-body.agent.md | 建议 | fade-pipeline-design 路径两处拼写差；前置核查清单三处两版本（批2 判向沿判） |
| 8 | social.agent.md | PASS | 无意见 |
| 9 | soul.agent.md | 建议 | 四节与 body 逐字重复（批1/2 判向沿判）；命名一致为正面 |

**分布：PASS 2 / 建议 7 / 挂起 0。**

## 二、逐件意见明细

### 1. ceo-chief-of-staff.agent.md（退役件）—— 建议

- **理由**：头部退役标注与真源声明明确，内容同步豁免（批1/2 判向）；本件特有注记：快照 frontmatter `name: TriCompanyCEOChiefOfStaff` 与现役正身 `name: CEOChiefOfStaff` 漂移，佐证快照年代久（先于 name 规范化），另缺 ⑦ 改排收口督办段、「固定前置核查」为指针化前完整 9 条版。
- **修改建议**：退役标注补快照基准日+「现行口径以 agent-body 为准」（沿批1 #1 处方）；name 漂移随基准日注一并留痕即可，无需改退役件内容。
- **验收锚**：退役标注含快照基准；不被误当现役口径引用。

### 2. agent-frontmatter.agent.md —— PASS

- 无意见。与 body frontmatter 逐字一致，description 现势（含 shadow-test 收口、Hermes 融合等现役场景）。

### 3. agent-body.agent.md —— 建议

- **理由**：「固定前置核查」=指针版（→ compass 手册），与批1 CPO #3 同判向；本席沿判并加 COS 特有增量：指针化前的完整清单（存于退役件与 session-body）达 9.5 条，含 0.5 归属路由阀门、4.5 FADE 协议正身三路径+勘误史注记，内容密度显著高于 CPO 面 5 条——若 compass 手册未完整承接 4.5 条，纯 body 宿主面丢失协议核查纪律（「凡涉协议、纪律、流程的任务以现行版本为准，禁凭记忆口径」），损耗等级高于一般核查清单。
- **修改建议**：确认 compass 手册〈开工前置核查〉节完整承接 0.5 阀门+4.5 FADE 协议核查条（含三正身路径与勘误史注记）；或在 body 指针处附「4.5 条正身清单见 session-body/登记册」二级锚。
- **验收锚**：纯 body 宿主渲染面中 FADE 协议核查纪律可达；阀门条款可达（批1 #3 验收锚同）。

### 4. ceo-chief-of-staff.contract.yaml —— 建议

- **理由**：①responsibilities 第 6 条 dict 残留（description+priority）——批1 #4 同族，沿判向（contract version 3.1 仍留此残留）；②decision_rights approve/freeze/escalate 内嵌大量具体商业阈值（折扣 5%/15%、账期 30 天、预算偏差 5%/15%、一次性支出 20/100 USD、recurring 10 USD/月、缓冲 3 工作日）——阈值正身应为授权矩阵（memory 自引 `authorization-matrix.md`），contract 硬编码数值构成双源，矩阵修订后 contract 必然滞后漂移；③io_contract `ipd_heartbeat.source: TriMC/src/heartbeat/cli.py` 用旧名 TriMC（退役件 body 与 session-body 均已用 TriMMC 新名，2026-09 改名）；④peers 仅 CPO/CTO，缺 COO——colleagues「紧密协作：公司级经营节奏由 COO 和 CEOChiefOfStaff 共同维护」（批2 #4 判向：peers 应含最紧密协作方）；⑤instructions 固定前置核查 8 条：无 0.5 阀门、无 4.5 FADE 条，落后于退役件/session-body 所载完整版（批1 #4 判向沿判+本席特有 FADE 缺项）。
- **修改建议**：①responsibilities 同构化（沿批1 #4 处方）；②阈值改「按授权矩阵现行版执行」或注矩阵版本锚，数值单源化；③source 随迁 TriMMC（或注兼容过渡）；④peers 补 ChiefOperatingOfficer；⑤核查清单与完整版对齐（至少补 0.5 阀门与 4.5 条指针）。
- **验收锚**：responsibilities 同构；阈值唯一真源=授权矩阵；无 TriMC 旧名残留（或标注过渡）；peers 含 COO；核查清单含阀门。

### 5. colleagues.agent.md —— 建议（轻）

- **理由**：①「紧密协作·COO 小营」条目仅载周经营记录收口/跨周平移分工，未载 ⑦ 改排后 COS 侧接口——body/memory 已明「fan-in 前收 COO 督办读数（时限达成/逾期/升级建议）」，colleagues 协作层缺位（批2 #5 同族判向：两席对称缺位，一并修）；②**跨席镜像正面确认**：本条与 COO 席 colleagues 小贾条目主客互换逐字同构，两侧无冲突。
- **修改建议**：COO 条目补一句「收口督办：本席 fan-in 呈报前收 COO 督办读数；销账权留本席」。
- **验收锚**：colleagues 与 body ⑦ 改排段 COS↔COO 接口可互查（两席同事一次修齐）。

### 6. memory.agent.md —— 建议

- **理由**：①运行资产落点节 TRICOMPANY_COGNITION_HOME 三现（line 21/26/28）——批1 #6 同族沿判；本件特有加重：line 29「共享/审计运行态：`TRICOMPANY_COGNITION_HOME` 或 `.tricompany-cognition/org/shared.md`…」把员工**私域**变量与 org 级**共享/审计**面并列作「或」选择，语义错误（body 明文共享/审计=org 两文件，私域非共享面），非单纯冗余；②授权矩阵同件两名：line 7「`authorization-matrix.md`」（短名无路径）vs line 24「`docs/workflow/ceo-chief-of-staff-authorization-matrix.md`」（全名带路径）——若同一文件则短名为误写，若两文件则需消歧。
- **修改建议**：①落点节 TRICOMPANY_COGNITION_HOME 单条化；line 29 删私域变量，改「共享/审计运行态：`.tricompany-cognition/org/shared.md`、`.tricompany-cognition/org/audit.md`」（与 body 对齐）；②授权矩阵统一全名带路径（确认实际文件名后短名处随改）。
- **验收锚**：私域/共享两类落点不再混写；授权矩阵引用全九件唯一拼写。

### 7. session-body.agent.md —— 建议

- **理由**：①FADE SOP 伴读件路径两处拼写差：line 8 作 `docs/execution/2026-08-26/fade-pipeline-design.md`（带日期子目录），line 39（4.5 条）作 `fade-pipeline-design`（无子目录）——同件两写，实勘者易撞路径；②开工前置核查三处两版本：本件完整版（0.5+1..9.5）与 body 指针版、contract 8 条旧版并存——批2 #7 判向沿判（清单唯一真源点化），本席加注：三版本中 contract 版最旧，对齐时应以本件完整版为基准。
- **修改建议**：①两处统一（以实勘路径为准，建议保留带子目录全路径）；②沿批2 #7 处方：本件「开工前置核查」为清单正身，body 指针二级锚化，contract 对齐。
- **验收锚**：SOP 伴读件路径全件唯一拼写；清单在 COS 九件内唯一定义点+两处指针同锚。

### 8. social.agent.md —— PASS

- 无意见。工作名小贾与 soul/contract 一致；「让信息流动，让决策有据」定位与 body 原则同向；层契约齐备。

### 9. soul.agent.md —— 建议

- **理由**：「认知分层约束」「当前原则」「运行资产落点」「层契约」四节与 body 同名节逐字重复——批1/2 #9 同族，沿判向不再展开（双写漂移风险+模板规范确认+单源化处方同前）。命名面（名字：小贾）三处一致，正面。
- **修改建议**：沿批1 #9 处方（模板规范明文豁免或 soul 单源化）。
- **验收锚**：同构段唯一真源点或模板明文豁免。

## 三、红线适用说明

- **分歧挂起候裁清单化**：无挂起项，无候裁清单。
- **保留权候 CEO**：contract decision_rights 之商业阈值（折扣/预算/支出上限）如涉授权矩阵改版或阈值本身废立，归 COS/CEO 权限，本席仅就「双源漂移风险」表态，不裁阈值数值——此保留权在此明示。
- **冻结件豁免标注**：#1 退役件按原子退役律保留不删，仅建议补快照基准标注（含 name 漂移注），不要求内容向真源回同步。

## 四、汇总读数

靶标 COS 席 9 件（623 行）全量读毕；表态分布 PASS 2 / 建议 7 / 挂起 0；意见明细 13 条（理由+修改建议+验收锚齐备，分布 7 件）；跨批沿判向 7 处（退役快照、responsibilities dict、TRICOMPANY_COGNITION_HOME 冗余、soul/body 重复、peers 缺紧密协作方、清单多版本、colleagues 督办接口缺位）已标注不重复展开；本席新发现 COS 特有 5 项（FADE 指针化损耗、商业阈值硬编码双源、TriMC 旧名、授权矩阵同件两名、SOP 路径拼写差）；正面确认 3 项（⑦ 改排 COS/COO 互洽、命名三面一致、督办接口记忆同构）；全程零改动，独立性无破。

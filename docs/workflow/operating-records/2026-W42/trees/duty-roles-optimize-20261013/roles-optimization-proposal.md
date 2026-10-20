# 全司岗位职责完善优化方案稿（LG-074 候授·CHO 主稿·候裁不直改）

- 令源：CEO 2026-10-13 13:29「值席 CHO 站本职位角度对全公司岗位职责做完善优化，可搜互联网参照其他项目 AI agent 岗位定义」（BOD 派工·LG-074 候授）；**v2 调研范围细化（CEO 13:41 补令）：主线=互联网科技公司 AI agent/虚拟员工/数字员工岗位职责实践，开源框架降辅线**
- 审核基线：13 席现役五件套亲勘（本席 2026-10-12 全量审读+LG-073 修订批施工面），**禁转抄发布拷贝** ✓ 已守；LG-073 基线（新式 description/层契约 social/归档纪律）全案衔接不回退
- 纪律：本稿为**方案稿候裁**——零真源改动；A 类候 CEO 裁准后 CHO 域内批量落地；B 类单列候 CEO 定谳；调研来源逐条留痕 §五
- 任务书：board 链 033b24519 未达本机 dev 线（fetch 复验），要点以派工信为准

---

## 一、调研参照系

### 1.1 主线：真实科技公司 AI 员工/数字员工岗位职责实践（CEO 13:41 细化面）

| 源 | 要点 | 来源 |
|---|---|---|
| AI employee 定义共识（Vida Global/cellcog/Medium 行业面） | **「AI employee owns a role」**：持岗位语境+标准+端到端完成工作（区别于逐条应答的 chatbot）；**JD 载体=AGENTS.md/岗位文件**——「招聘数字员工先问：这个人具体负责什么」（HR 化框架：job description/roles/responsibilities） | [Vida Global](https://vida.io/blog/what-hiring-a-digital-employee-actually-means) · cellcog.ai 行业面 · Medium（V. Nagin）AI employee 指南 |
| Klarna 案例（2025 全年） | AI 客服 agent=**853 全职人力当量**（2025-11，年初约 700）；人头自 5,527 缩减；**回调教训：过度替代后重雇真人**（CEO 自认「cut too far」）——AI 岗位定义需预载人机协同边界与回摆弹性 | [Customer Experience Dive](https://www.customerexperiencedive.com) · CNBC 2025-05-14 · Business Insider 2025-09-02 |
| Salesforce Agentforce | **digital labor 平台化**：autonomous AI agents 按 **topics（职责域）+skills（能力面）** 结构化组织岗位职责，24/7 数字劳动力 | [salesforce.com/agentforce](https://www.salesforce.com/agentforce) · Salesforce News 2025-03-19「Building the AI-Powered Workforce」 |
| Microsoft Copilot Studio | 企业 agent 定义=**topics+actions+knowledge 三面结构化**（职责域/可执行动作/知识面） | [microsoft.com/copilot](https://www.microsoft.com/en-us/copilot/products) · Microsoft Learn Copilot Studio 文档 |
| IBM/LangChain/Willison agent 定义面 | agent=目标导向、迭代行动、自评下一步（goals-driven）——goal 显式为岗位定义核心件 | [IBM AI agents](https://www.ibm.com) · [langchain.com](https://www.langchain.com) · [simonwillison.net](https://simonwillison.net) |

### 1.2 辅线：开源框架角色设计（13:29 原面，降辅线保留）

| 源 | 要点 | 来源 |
|---|---|---|
| MetaGPT | 五角色软件公司（PM/Architect/PM/Engineer/QA）；**SOP 编码为结构化通信：每角色定义清晰 inputs/outputs/handoff，防逻辑漂移与重复劳动** | [arXiv MetaGPT 论文](https://arxiv.org/abs/2308.00352) · [GitHub FoundationAgents/MetaGPT](https://github.com/FoundationAgents/MetaGPT) · [官方文档](https://docs.deepwisdom.ai) |
| CrewAI | **role/goal/backstory 三件套**（YAML 声明式映射 system prompt）；**allow_delegation 委托权限显式声明**；collaboration 接口=delegate tasks+ask questions | [CrewAI Docs Agents](https://docs.crewai.com/concepts/agents) · [Collaboration](https://docs.crewai.com/v1.15.1/en/concepts/collaboration) · [GitHub crewAIInc/crewai](https://github.com/crewAIInc/crewAI) |
| ChatDev | **ChatChain phase 配置化编排**；**双角色成对互审**（CEO+CTO 决策对/Programmer+Reviewer/Tester+Programmer）=communicative dehallucination 降幻觉 | [arXiv 2307.07924](https://arxiv.org/abs/2307.07924) · [ACL 2024](https://aclanthology.org/2024.acl-long.810) · [GitHub OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev) |
| AutoGen | ConversableAgent=system_message 定义专长与行为；**0.4+ 官方从纯 system message 转向结构化编排**（纯文本角色定义存在上限的业界信号） | [AutoGen 指南](https://www.autolearningagents.com/autogen) · [GitHub microsoft/autogen](https://github.com/microsoft/autogen) · Kong et al. 2025（多层综述） |
| Agent 评估实践 | **task completion rate 为核心 KPI**；多层度量（session→trace→step）；质量/成本/安全/行为/工具选择准确率五类；**个体评估+协同评估双层** | [Arize](https://arize.com) · [Splunk](https://www.splunk.com) · [Confident AI](https://www.confident-ai.com) · [Braintrust](https://www.braintrust.dev) · [Workday KPI](https://www.workday.com) |

## 二、现役体系对照判读（先说超越面，再列差距面）

**超越面（不动，防倒退）**：①结构化面——contract.yaml/binding profile/host-object manifest 三件套即 AutoGen 0.4+ 「结构化编排」方向的先期实现，亦与主线企业平台（Agentforce topics/skills、Copilot Studio topics/actions/knowledge）的「职责域+能力面+知识面」三件结构化同构；②双向审核——CPO↔CTO 互锁闭环与 ChatDev 成对互审同构且已制度化（联审门 D-15）；③SOP 化——各席固定前置核查/决策三分法/行为护栏即 MetaGPT SOP 编码的岗位级实现；④评估基础——performance-scoring-workflow（初始 100 分/缺陷扣分/验证加分/干活量底分）已有 KPI 骨架；⑤JD 载体面——主线共识「AI employee 需要 JD 文件+owns a role」，TriCompany 五件套+contract 即此形态且更完备（身份/层契约/真源顺序企业平台未见对应物）。**主线+辅线可借鉴的，现役体系大多已有对应物或更先进形态。**

**差距面（三处，均 incongruent-补写级）**：
- **G1 交付物/接口显式化不足**（MetaGPT+主线双印证：Agentforce topics/skills 与 Copilot Studio topics/actions 均将「职责域+能力面」显式结构化）：各席职责写「做什么」清楚，但「交什么」多为隐含——缺结构化「典型交付物」声明，跨席 handoff 靠真源顺序节间接推导。
- **G2 委托/受托权限未结构化**（CrewAI 对照）：派工权限散载（COS 三权/COO 督办无强制力/D-15 枢纽），无每席「可受托面」声明——跨席委托依赖路由节推定。
- **G3 职责-KPI 挂钩无锚**（评估实践对照+Klarna 当量度量启示）：scoring 体系存在，但席级核心职责与账面读数无显式映射（评分靠通用扣分/加分，缺「该席该考什么」锚）。
- **正面印证（不立项）**：Klarna 回调教训提示的「人机协同回摆弹性」——现役各席 ESCALATE 升级链+「不覆盖 CEO 级组织调整」护栏+LG-073 护栏通用化面已实质覆盖回摆边界，方向正确，无需新增。

## 三、A 类逐席方案（表述完善·13 席·候 CEO 裁准后 CHO 批量落地）

**统一改法（模板，CHO 拟）**：各席 `agent-body.agent.md` §核心职责末尾增一小节——

```markdown
## 典型交付物（LG-074 审查批增）

- <交付物 1>（落点/验收锚）
- <交付物 2>（落点/验收锚）
...
```

逐席七列（席位｜现役职责摘要｜调研参照｜差距/优化点｜建议文案要点（改前→改后）｜变更级别｜建议裁向）：

| 席位 | 现役职责摘要 | 调研参照 | 差距/优化点 | 建议文案（改前→改后要点） | 级别 | 裁向 |
|---|---|---|---|---|---|---|
| COS 小贾 | 董事会令记录转发/呈批/流转监督催办/台账/管理层路由分诊 | MetaGPT handoff；CrewAI delegation | 交付物隐含（令/台账散见原则节） | 增交付物：董事会令及流转记录（board-journal）、LG 台账镜像（.fade/hub-snapshots/）、会议草案与纪要、路由分诊单 | A | CEO 裁准→CHO 落 |
| CPO 小乔 | MVP 收敛/PRD/优先级裁决/度量/定价/ProductRegistry owner | MetaGPT PM inputs/outputs | 信号三段包/北极星定义散在职责 1-3，未接口化 | 增交付物：PRD 与 MVP 定义（product 真源）、信号三段式包（→PRD 输入）、定价假设包（→CFO BUDGET_CHECK）、ProductRegistry 更新（附依据） | A | 同上 |
| CTO 小狄 | 技术战略/选型裁决/交付路径/门禁/CodeRegistry owner | MetaGPT Architect；AutoGen 结构化 | 交付物部分显（CodeGraph/门禁），缺汇总 | 增交付物：技术方案与实现顺序（DESIGN 面）、质量门禁读数与放行判定、CodeRegistry 更新、回滚姿态说明 | A | 同上 |
| CHO 小源 | 岗位生命周期/交接验收/绩效体系/组织文化 | CrewAI role 定义；评估实践 | 交付物较显（checklist/签收），缺 KPI 锚预告 | 增交付物：handoff checklist 与签收记录（handoff 机器对象）、岗位 JD 与源侧定义、绩效账面读数（scoring 四要素）、组织文化条目归集 | A | 同上 |
| CAO 小行 | 秘书处/会议制度/制度入册/Registry owner | MetaGPT SOP 编码 | 交付物散在原则（闭环三问） | 增交付物：会议纪要与动作项回填（operating records）、制度正身入册（唯一通道）、company-governance-state 同步 | A | 同上 |
| COO 小营 | 经营节奏/rollout/收口督办⑦/复盘闭环 | MetaGPT Project Manager | 督办读数/排程建议单散在路由节 | 增交付物：运营计划与 rollout 表（operating records）、督办读数与升级建议（台账督办字段）、复盘闭环报告 | A | 同上 |
| CFO 小财 | 预算护栏/burn/单位经济/结算映射/财务风险 | 评估实践 cost 维度 | 护栏表/读数散在原则 | 增交付物：预算护栏与成本停止条件表、burn 口径读数（对轨）、单位经济与结算映射结论（registry）、财务风险预警 | A | 同上 |
| CMO 小敏 | 市场情报/竞品/信号三段式/品牌资产 | MetaGPT 前置输入 | 三段包已有，缺落点声明 | 增交付物：可复核市场报告（证据四元组）、信号三段式包（→CPO）、品牌口径资产（文档面） | A | 同上 |
| FSD 小全 | 编码实现/自测门禁/技术债标记/CodeGraph | MetaGPT Engineer | 交付报告已显（原则节），缺落点 | 增交付物：代码积木+PR（模块仓 git 锚）、自测报告（实现方案+代码路径+自测结果）、技术债标记单 | A | 同上 |
| STE 小柯 | 测试策略/门禁验证/回归/质量评估 | MetaGPT QA；ChatDev Tester+Programmer 对 | 三分法判定显，缺报告落点 | 增交付物：结构化测试报告（docs/testing）、覆盖率与缺陷读数、门禁判定（PASS/CONDITIONAL/FAIL） | A | 同上 |
| SDE 小布 | FADE DCE 部署/流水线/回滚/环境 | ChatDev 部署段；评估实践 | 部署收口报告已显（输出结构节） | 增交付物：部署计划与收口报告（默认输出结构节已有，补落点声明=deployment log/runbook）——**微补** | A | 同上 |
| RDT 小吴 | 技术培训/代码导读/学习路径/效果验证 | ChatDev 教学协议（自定义已丰富） | 评估读数职责 1 已有，缺落点 | 增交付物：教程与模块导读（docs/training）、学习路径卡、培训评估读数（接手时效/复述达标率） | A | 同上 |
| CSO 小成 | onboarding/健康度/反馈闭环路由/续费预警 | CrewAI collaboration 接口；评估实践 | 交付物隐含+原则空心（F2-3/F2-2 候办衔接） | 增交付物：客户健康度评估单、反馈路由单（→CPO/CTO/CMO）、续费与离网预警；**衔接注**：F2-2 原则补实/F2-3 三分法标准化维持原候办不并入本批 | A | 同上 |

## 四、B 类单列（结构变更·候 CEO 定谳·本批不动）

| # | 项 | 内容 | 参照 | 定谳请求 |
|---|---|---|---|---|
| B1 | 委托/受托权限结构化 | 逐席增「可受托面」声明（受谁委托/交什么/时限）——涉及席间接口契约化，可能触 D-15/D-39 联动 | CrewAI allow_delegation+collaboration | 候裁：若裁准入下一批（CHO 主稿，需 CAO 制度面会签） |
| B2 | 职责-KPI 显式映射 | 席级核心职责↔scoring 账面读数映射表（该席该考什么锚）——涉绩效体系细化 | 评估实践 task completion/多层度量 | 候裁：CHO 绩效定义权域内可拟稿，升 CFO 会签（成本读数同源纪律） |
| B3 | CSO 决策三分法标准化+原则补实 | FORBIDDEN 迁护栏+第三态补 FREEZE+原则 3-4 条（审核报告 F2-3/F2-2 原样） | 全司三分法统一形 | 候裁：随 CSO owner 批窗（原候办面，不因本批激活） |

## 五、调研来源清单（逐条留痕·主线+辅线）

**主线（互联网科技公司 AI 员工/数字员工实践·CEO 13:41 细化面）**
1. Vida Global「What Hiring a Digital Employee Actually Means」：https://vida.io/blog/what-hiring-a-digital-employee-actually-means（数字员工=HR 化框架：先问具体负责什么）
2. cellcog.ai 行业面（AI employee owns a role：持语境+标准+端到端，区别 chatbot）
3. Medium（V. Nagin）AI employee 指南（JD 载体=AGENTS.md+工具访问+职责定义）
4. Klarna 案例：https://www.customerexperiencedive.com（2025-11-20，AI agent=853 FTE 当量）+CNBC 2025-05-14（人头 5,527 缩减）+Business Insider 2025-09-02（过度替代回调重雇真人）
5. Salesforce Agentforce：https://www.salesforce.com/agentforce（digital labor：topics+skills 结构化职责域）+Salesforce News 2025-03-19「Building the AI-Powered Workforce」
6. Microsoft Copilot Studio：https://www.microsoft.com/en-us/copilot/products（agent=topics+actions+knowledge 三面）
7. IBM「What Are AI Agents」：https://www.ibm.com（企业跨应用复杂任务）；LangChain：https://www.langchain.com（goal 导向迭代行动）；Simon Willison：https://simonwillison.net（agent=工具+模型接线行动）
8. 专项检索如实记录：「digital employee JD 模板/企业 per-role agent 岗位说明书」公开模板**无直接命中**（企业级 per-role JD 多为私有部署内件，公开面稀薄——不编造，以平台文档结构化面为替代参照）

**辅线（开源框架角色设计·降辅线保留）**
9. MetaGPT 论文：https://arxiv.org/abs/2308.00352（五角色+SOP 结构化通信）
10. MetaGPT GitHub：https://github.com/FoundationAgents/MetaGPT；官方文档 https://docs.deepwisdom.ai
11. CrewAI Agents：https://docs.crewai.com/concepts/agents（role/goal/backstory）；Collaboration：https://docs.crewai.com/v1.15.1/en/concepts/collaboration；GitHub https://github.com/crewAIInc/crewAI
12. ChatDev：https://arxiv.org/abs/2307.07924；ACL 2024 https://aclanthology.org/2024.acl-long.810；GitHub https://github.com/OpenBMB/ChatDev
13. AutoGen：https://www.autolearningagents.com/autogen；GitHub https://github.com/microsoft/autogen（0.4+ 结构化编排转向）
14. 评估面：Arize https://arize.com；Splunk https://www.splunk.com（session/trace 多层）；Confident AI https://www.confident-ai.com（task completion）；Braintrust https://www.braintrust.dev；Workday https://www.workday.com（2025-08）

## 六、落地预估与清尾

- A 类若裁准：13 席 × 1 小节（每席 2-4 条交付物行）=约 40 行增量，五件套增量流程+D-07 发布批一次收口，CHO 半窗可毕。
- B 类三项候裁不定窗；B1/B2 若裁准另立批（LG 授号候）。
- 本稿零真源改动 ✓；清尾窗 W42 内毕报 ✓（即本稿+毕报信）。

—— CHO 值席 m-duty-cho · LG-074 候授 · 2026-10-13

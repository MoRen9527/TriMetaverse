# BB-1 CPO 席独立意见（B3/B4 打样批联审）

> 席位=CPO（m-duty-cpo 常驻席 M-004 直达）·时点 2026-09-14
> 程序位：审=只出意见零改动（本报告文件为唯一写触点）；独立性：未读 bb1-cos/cto/cao/bs 任何他席稿。

## 一、依据链

1. 任务书任务3：`docs/workflow/operating-records/2026-W37/task-charter-20260914-nightshift01.md`（B3/B4 打样批·树协议回归首航）。
2. 联审工作流 V0.2：`TriCompany/docs/workflow/joint-review-orchestration-workflow.md`——§5 派工六要素：意见三要素=意见+理由+修改建议+验收锚（本报告按此执行）；§7 改动通道（CLAUDE.md→FADE-002；source-agents→D-07）；§2 红线三态。
3. LG-034 晨报：`docs/workflow/operating-records/2026-W37/lg-034-morning-report-20260911.md`（B3=project-sources 2 件排轮；渲染债零存量随批维护条款④6）。
4. B2 批 COO summary：`docs/workflow/operating-records/2026-W37/lg-034-b2-coo-summary.md` §一.10「CPO 三问落点」——CLAUDE.md:60 定性修正（「design document」→「TriCompany 中央摘要（宪章真源=TriCompany/tricompany.md）」）rides B3 批。
5. 对表参照（口径基准）：`TriCompany/tricompany.md`（实勘：自述「TriCompany — 赛博公司宪章 V1.0」；§三员工体系 13 人名册；§五宿主=Copilot-host live/TriMC 切换为独立里程碑）。
6. 靶标实勘：B3 两件（claude-md 真源 105 行/agents-md 真源 88 行）+B4 两目录 Glob 实勘各 9 件，9+9=18 与任务书相符，无差额。

## 二、总评

B3 两件入口文档的信息架构方向正确（路由指针化、真源声明前置），B4 两席五件套同构骨架完整、认知分层契约与写入边界齐整。但三簇问题反复指向同一产品语义根因：**五件套是「一份岗位语义的多个视图」（壳/身/契/soul/social 各承载一个入口），模板同构而增量维护未跟齐，导致不同入口读到不同答案**——CAO 工作名三处两口径（身份层漏回填）、CAO 治理真源三件两定性（副本/真源方向混乱）、CTO 壳/身/契三处内容漂移（派生同步机制失效信号）。新人视角判据：拿到任一单件能否直接回答「这个岗是谁、管什么、不管什么、先查哪里」——本批 20 件中有 3 件在该判据下会给出与他件矛盾的答案。

**表态分布**：PASS × 6（6 件均为无意见）/ 建议 × 14 / 挂起 × 0（整件级；子项挂起候裁 3 项，见 §六）。

## 三、逐件表格（B3 × 2 + B4 × 18）

### B3（project-sources 真源两件）

| 文件 | 意见摘要 | 表态 |
| --- | --- | --- |
| `TriCompany/docs/project-sources/trimetaverse-claude-md.md`（105 行） | ①行 60「TriCompany design document」定性未落 B2 修正主张（见 §五 终版措辞）；②Key documents 清单（行 58-62）缺 `docs/project.md`（B2 已迁入并换代为项目总述真源）与白皮书 `docs/tmv-whitepaper.md`（商业真源）条目——新员工第一入口拿不到项目真源与商业真源指针；③行 103-104 `## Common Commands` 节内容行与 `## File Conventions` 标题间缺空行（markdownlint MD022 形态）；④行 15/69「13 AI employees」与 CAO session-body 引 D-13「15 席正名全表」数字口径差（挂起候裁③）。 | 建议 |
| `TriCompany/docs/project-sources/trimetaverse-agents-md.md`（88 行） | ①行 41-48「Source Of Truth Order」（文档族优先序：白皮书→project→tricompany→…）与 CLAUDE.md 行 88-95 同名节「Source of Truth Order」（源侧→发布副本→运行态→transcripts）是两套不同语义——同名节跨件两口径，建议本件侧加适用域注记或改名「文档真源优先序」；②行 54-58 Update Discipline「registry 文档仅在用户明确要求或总助收口时才允许修改」与员工源侧五件套「把稳定结论回写 registry」职责存在张力——两件适用域不同（Copilot 宿主会话面 vs 员工源侧面），建议补一句适用域注记防跨面误用；③行 71-77 agent 映射枚举仅 5 类（CPO/CTO/FSD/STE/COS），建议补「全景见 D-13 名址全表」指针防「公司只有 5 类 agent」误读。 | 建议 |

### B4（source-agents/chief-technology-officer × 9）

| 文件 | 意见摘要 | 表态 |
| --- | --- | --- |
| `agent-body.agent.md` | 核心职责 6 条，缺入口壳与 contract 均承载的「CodeGraph 默认先使用」条（壳为 7 条）——正身与壳职责清单不同步（详见重点意见④）；另多处标题前缺空行（格式，markdownlint）。 | 建议 |
| `agent-frontmatter.agent.md` | 空 frontmatter 结构占位件，无意见。 | PASS（无意见） |
| `chief-technology-officer.agent.md`（入口壳） | 含 CodeGraph 职责条（7 条）而 body 正身无（6 条）；contract instructions 另有两条壳/身均无的独有条目——三处漂移方向不明，见重点意见④。 | 建议 |
| `chief-technology-officer.contract.yaml` | ①`supervises: []` 与 colleagues 层「小全/小柯/小吴/小布向 CTO 报告」矛盾，且涉授权矩阵裁决（挂起候裁①）；②tools 四处 `runtime_equivalent: openclaw:*` 代号在五件套其余件与入口文档链均未出现，出处待核（挂起候裁②）；③execute scope `TriMC/src/` 未随 2026-09 TriMC→TriMMC 改名换代（对比 CLAUDE.md 行 28 新风）；④instructions 缺 body 的 0.5 归属路由阀门条（并入重点意见④）。 | 建议 |
| `colleagues.agent.md` | 管理关系「监督四人」与 contract 空集、B3 agents-md 行 78「当前阶段：小全、小柯归属 CTO」两人口径三处不一（挂起候裁①）；其余协作叙事（与 CPO 最小闭环、FD/ST 派工枢纽）清晰准确。 | 建议 |
| `memory.agent.md` | 运行资产落点列「DESIGN.md、STATE.md、ROADMAP.md」与 body 技术真源「DESIGN.md、metacognition-architecture.md」两套列举——`docs/engineering/` 下 STATE/ROADMAP 存在性建议按 D-18 缺席/存在三诚实核实后统一。 | 建议 |
| `session-body.agent.md` | D 类域知识族命令族为 Windows 本地开发/分发语境（trilc daemon install=Windows 计划任务、PowerShell 脚本），与 M 面 sg Linux 运营语境并存——建议加适用面标注防语境误用。 | 建议 |
| `social.agent.md` | 身份定位与对外表述规则（门禁读数为准/未过门禁不称已交付）清晰，与 body 无冲突，无意见。 | PASS（无意见） |
| `soul.agent.md` | 气质/禁止退化三条（production-ready/宿主阶段/测试回滚边界）清晰；「当前原则/运行资产落点/层契约」三节与壳同文重复属模板拼装形态，建议在渲染债维护中定一份定义源防手工漂移（轻）。 | 建议（轻） |

### B4（source-agents/chief-administrative-officer × 9）

| 文件 | 意见摘要 | 表态 |
| --- | --- | --- |
| `agent-body.agent.md` | 「当前工作落点/治理真源顺序」以 `TriMetaverse/docs/registry/company-governance-state.md` 为真源顺序首项，与本席 session-body「真源=TriCompany 侧；TriMetaverse 侧为字节级副本」定性矛盾（重点意见②）；归属路由阀门嵌于角色定位节内（CTO 侧为编号 0.5 独立条目），同构模板两席形态不一（轻）。 | 建议 |
| `agent-frontmatter.agent.md` | 空 frontmatter 结构占位件，无意见。 | PASS（无意见） |
| `chief-administrative-officer.agent.md`（入口壳） | 缺开场白身份段——对照 CTO 壳有「你是…CTO/工作名小狄/binding profile 声明」三句，本壳直接从「## 当前角色定位」开始，新会话加载后拿不到「你是谁」身份句（重点意见①后半）。 | 建议 |
| `chief-administrative-officer.contract.yaml` | ①`display_name: 待命名` 与 social 层「工作名：小行（CEO 正式命名 2026-08-01）」及宪章 §三名册（小行=CAO）矛盾——命名事实已发生，身份层未回填（重点意见①）；②instructions 用 `>` 折叠标量（CTO 侧用 `|` 块标量），折叠后行结构语义丢失，建议改 `|` 对齐 CTO；③peers=[CHO, COO] 缺 COS（小贾），与 colleagues 紧密协作清单（CHO、小贾）不一致。 | 建议 |
| `colleagues.agent.md` | 汇报关系（CEO 本人，经小贾协调日常管理）、CHO/CAO 边界、与 CPO/CTO 的行政规范协作叙事清晰；仅 peers 对表问题在 contract 侧登记（见上行③），本件无独立修改意见。 | PASS（无意见） |
| `memory.agent.md` | ①行 18「公司治理真源：TriMetaverse/docs/registry/company-governance-state.md」与 session-body 副本定性矛盾（并入重点意见②）；②行政流程记录落点 `TriCompany/docs/execution/administrative-records/` 存在性建议按 D-18 核实。 | 建议 |
| `session-body.agent.md` | 名址对位/时刻现查/前置核查/接手规则四条基线清晰，且行 7/25 是三件中唯一明确定性「真源=TriCompany 侧、TriMetaverse 侧=字节级副本」的——本件为真源方向追平的对表基准，无修改意见。 | PASS（无意见） |
| `social.agent.md` | 工作名「小行（CEO 正式命名，2026-08-01）」记载清晰，是命名事实源——矛盾不在本件，待回填的是 soul/contract（重点意见①），本件无修改意见。 | PASS（无意见） |
| `soul.agent.md` | 行 3「名字：待命名」为漏改——同批 social 与宪章 §三均证命名已发生（小行），建议回填（重点意见①）；其余气质/原则/层契约与壳同文重复同 CTO 侧轻注记。 | 建议 |

## 四、重点意见（≤5 条，按工作流 §5 三要素）

### 重点意见① CAO 岗位身份三处两口径：「待命名」vs 已命名「小行」（含入口壳缺开场白）

- **意见**：CAO 三件身份口径不一——soul 行 3「名字：待命名」、contract `display_name: 待命名`，而 social 行 5「工作名：小行（CEO 正式命名，2026-08-01）」；同席入口壳缺 CTO 同构的开场白身份段（你是谁/工作名/binding profile 声明三句全无）。
- **理由**：「这个岗是谁」是五件套第一产品语义。新员工或宿主按壳/soul 加载得到「待命名」（误判岗位空缺），按 social/宪章 §三名册（V1.0，2026-08-01，CAO=小行）得到「小行」——命名事实已有双重记载，身份层未回填属事实回填而非新命名授权；CTO 同构件（soul/contract 均=小狄）证明这是漏改而非模板差异。触发 D-18 诚实原则与 B2 起「防双真源错觉」纪律。
- **修改建议**：soul 行 3 与 contract `display_name` 回填「小行」；CAO 壳补 CTO 同构开场白段（你是 TriCompany 当前阶段已上岗的 ChiefAdministrativeOfficer/工作名小行/binding profile 声明）。改动走 D-07 source_publish_check --publish-agents，定性小修。
- **验收锚**：soul/contract/social/壳四处工作名读数一致（小行）；date 现查留痕；发布后 hash 一致。

### 重点意见② CAO 治理真源方向性：三件两定性（真源在侧哪边）

- **意见**：CAO body（治理真源顺序首项）与 memory（行 18）均以 `TriMetaverse/docs/registry/company-governance-state.md` 为真源，而 session-body 行 7/25 明确定性「真源=`TriCompany/docs/registry/company-governance-state.md`；TriMetaverse 侧为字节级副本，本席同步」。
- **理由**：真源方向性是文档推导链的第一语义（本席 B2 批主张的入口→真源方向性）。按 body/memory 指引，读者会把字节级副本当真源直接修改，触发双写与 hash 漂移；同批三件两种定性=同构断裂，新人无法判断哪个是权威。此为 CAO 域内部自证矛盾（session-body 已给正确答案），无需外部裁决。
- **修改建议**：body「当前工作落点/治理真源顺序」与 memory「运行资产落点」的治理真源条统一改为：真源=`TriCompany/docs/registry/company-governance-state.md`，TriMetaverse 侧标注「字节级副本（本席同步）」，与 session-body 追平。
- **验收锚**：三件治理真源定性读数一致；跨仓路径表述符合 D-14 审计根声明。

### 重点意见③ CTO 管理跨度三处三口径（挂起候裁①）

- **意见**：CTO「管谁」三处三口径——contract `supervises: []`（空集）；colleagues「小全/小柯/小吴/小布向 CTO 报告」（四人）；B3 agents-md 行 78「当前阶段：小全、小柯归属 CTO」（两人）。
- **理由**：管理跨度是岗位定位核心语义（「管什么、不管什么」含「管谁」）。三口径并存使新人/宿主无法判断 CTO 现役管理面；其裁决依据=授权矩阵（CompanyGovernanceRegistry 域），不属产品语义层可定，本席不裁对错，按红线挂起候裁并要求裁后三处追平。
- **修改建议**：候 CompanyGovernanceRegistry/授权矩阵裁现役监督名单：若授权矩阵无小吴/小布条目，则 colleagues「管理关系」收敛为协作关系表述、B3 枚举句维持；若有，则 contract `supervises` 补齐。三处以授权矩阵条目号为唯一对表基准。
- **验收锚**：contract.supervises、colleagues 管理关系、agents-md 归属句三处一致，出处=授权矩阵条目号随改动留痕。

### 重点意见④ CTO 壳/身/契三处内容漂移：派生同步机制失效信号

- **意见**：CTO 入口壳核心职责 7 条（含「CodeGraph 默认先使用」）vs body 正身 6 条（无）；contract instructions 独有两条壳/身均无的条目（「旧 Development/Task/Autonomy Main Controller 仅作历史术语」「发布/迁移时序统一使用 TriMetaverse V1 正式上线切换阶段」）且缺 body 的 0.5 归属路由阀门条；body/壳标题空行格式亦不一。
- **理由**：入口壳若系派生加载壳（D-07：live entry 系派生壳，改动走源侧发布通道），下次 publish 可能以 body 覆盖回 6 条，CodeGraph 行为指引丢失；若壳系手工件则形成双真源错觉。漂移方向不明=壳/身同步机制失效信号；LG-034 晨报④6 已立「渲染债零存量随批维护」纪律，本条即 B4 批应归零的渲染债。
- **修改建议**：先核实壳的派生性（D-07 通道+host-object manifest）；以 body 为正身补 CodeGraph 职责条（或实勘确认壳内容为最新后回写 body）；contract instructions 增补归属路由阀门条并补齐两条独有条目的 body 侧出处或收敛；同构核对 CAO 侧壳/身/契（CAO 侧为「instructions 独有交接路径治理条」同病）。
- **验收锚**：body/壳职责条数一致；instructions 与 body 条目差=0 或差异项带出处注记；发布 hash 一致；本批渲染债归零读数随批登记。

### 重点意见⑤ B3 行 60 定性修正落位（对应 §五 特别登记面）

- **意见**：`docs/tricompany.md` — TriCompany design document——B2 批修正主张未落位（B2 登记时明确 rides B3 批）。
- **理由**：「design document」与该件 B2 换代后实际身份（中央摘要+宪章指针双身份）不符，误导文档推导链起点——读者会按「设计文档」预期去找技术设计内容，而该件实为经营载体总述摘要面。
- **修改建议**：按 §五 终版措辞整行替换；走真源改+FADE-002 管线发布，禁直改项目侧。
- **验收锚**：真源行替换 diff=一处；FADE-002 管线发布后项目侧副本与真源字节一致。

## 五、特别登记面（必答）：B3 行 60 终版建议措辞

**复核结论**：B3 `trimetaverse-claude-md.md:60` 现表述仍为：

```
- `docs/tricompany.md` — TriCompany design document
```

B2 批修正主张未落位。实勘对表补充一个 B2 时点未细化的事实：`TriCompany/tricompany.md` 自述头为「TriCompany — 赛博公司宪章 V1.0」（宪章正身），TMV `docs/tricompany.md` 为其摘要同步面（B2 双身份元信息=宪章指针+摘要同步源）。故「中央摘要」定性成立，且宪章真源指针必须带上以防双真源错觉。

**终版建议措辞（可直接替换的完整行文案）**：

```
- `docs/tricompany.md` — TriCompany 中央摘要（宪章真源=`TriCompany/tricompany.md`；历史附录为归档件，不作现行口径）
```

措辞依据三点：①「中央摘要」与 B2 改写后该件自述身份（双身份元信息）及晨报大白话口径（公司简介摘要）一致；②宪章真源指针=防双真源错觉（CAO③ B2 经验），且与行内 TMV 相对路径 `docs/tricompany.md` 形成「摘要面→宪章真源」的正确推导方向；③「历史附录为归档件，不作现行口径」与 B2 已执行的附录防误引指引行同口径，仅入口前置防误引，不触碰「附录外移/拆出」候 CEO 挂起项。通道：真源改+FADE-002 管线发布。

## 六、挂起与候裁清单

1. **挂起候裁①**：CTO 管理跨度三口径（contract.supervises 空集/colleagues 四人/agents-md 两人）——候 CompanyGovernanceRegistry/授权矩阵裁现役监督名单，裁后三处追平（治理域，非产品语义可定）。
2. **挂起候裁②**：CTO contract `runtime_equivalent: openclaw:*` 代号出处（五件套其余件与入口文档链均未见该代号）——候 CTO/结构域核实现役性：若为历史宿主代号则换代或注记，若现役则入口文档链补一次对表说明。
3. **挂起候裁③**：员工数口径 13（宪章 §三/CLAUDE.md 行 15/69「13 employees」）vs 15 席正名全表（CAO session-body 引 D-13）——候 CAO 按 D-13 名址宪法对表，出入口文档注记（席与员工的差额口径说明）。
4. **候 CEO 事项**：无——本批 20 件未触碰 CEO 保留权面；B2 批五项挂起（CPO 主责句/write master/附录外移/lowercase 孤儿件/MVP 主链口径）不在本批靶标，本报告未触碰。
5. **历史冻结件/附录豁免件**：本批 20 件中无（B3 两件为现役真源件，B4 18 件为现役源侧件）。

—— CPO 小乔（m-duty-cpo 常驻席），2026-09-14，BB-1 B3/B4 打样批联审独立意见完稿

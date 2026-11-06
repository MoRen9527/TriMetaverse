# 件4 随动·源侧五件套逐席改版排程单 v1.0（CHO 席）

- sourceOfTruth: 本件（件4 staffing 排程单正身·候 COS 对表收口后随铸册窗一并呈 BOD）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 定谳令（意见㊿+280·2026-11-06 09:43:21——「件4 议题② 席别新定位确认（headcount 零变更·CHO 排程启动）…件7 铸册窗即开=…+CHO staffing 五件套逐席改版排程（件4 随动）」）+COS 知会（2026-11-06T09:45:17+0800 落款·排程单回执知会 COS）
- 编制依据: 汇总卷 §八候定谳清单第 4/7 条（TMV 684b9508c）+㊿+280 定谳令全文（draft-ceo-bod-session-20261102.md L2213-2219）+圆桌 13 席总判表 CHO 意见（议题②⑤⑥三问）
- 实勘锚: `TriCompany/docs/registry/employee-roster.json` v1.1.0（rosterDate 2026-10-20·totalEmployees=14·全 live）+`TriCompany/source-agents/` 14 席目录实勘（2026-11-06T01:52Z）+validator 实跑通过（employee_source_kit.py validate --employee-id chief-human-resources-officer）

## §一 · 排程对象（roster 在册 14 席·headcount 零变更）

| # | employeeId（roster） | source-agents 目录 | 席别 | 批次 |
|---|---|---|---|---|
| 1 | ceo-chief-of-staff | ceo-chief-of-staff | COS 小贾 | A（C-level） |
| 2 | chief-operating-officer | chief-operating-officer | COO 小营 | A |
| 3 | chief-technology-officer | chief-technology-officer | CTO 小狄 | A |
| 4 | chief-product-officer | chief-product-officer | CPO 小乔 | A |
| 5 | chief-human-resources-officer | chief-human-resources-officer | CHO 小源 | A |
| 6 | chief-administrative-officer | chief-administrative-officer | CAO 小行 | A |
| 7 | chief-financial-officer | chief-financial-officer | CFO 小财 | A |
| 8 | chief-marketing-officer | chief-marketing-officer | CMO 小敏 | A |
| 9 | full-stack-developer | full-stack-developer | FSD 小全 | B（执行/职能） |
| 10 | senior-test-engineer | senior-test-engineer | STE 小柯 | B |
| 11 | rd-trainer | rd-trainer | RDT 小吴 | B |
| 12 | customer-success-officer | customer-success-officer | CSO 小成 | B |
| 13 | deployment-engineer | **senior-deployment-engineer**（目录名与 roster id 有差·勘定注记） | DE 小布 | B |
| 14 | product-manager | product-manager | PM 小案 | B |

- 对象口径注记：排程对象=roster v1.1.0 在册 14 席（全 live·实勘非推定）——圆桌总判表 13 席系讨论席口径（组织者 COS 席列于表外）·绩效结算表 13 席系结算口径——**结算表 13 vs roster 14 席位差（PM 是否入绩效结算）系本单编制实勘新发现·候 11-08 结算窗 CHO 对表项**（§五登记·不阻塞本排程）。
- headcount 零变更定性（件4 定谳原文）：本排程系**班次拓扑重定义+席位职能改版**·非扩编——14 席编制不动·双班组形态为席内职责面重构。

## §二 · 改版内容对照（三件定谳为改版语义源）

1. **件2 席别新定位**（定谳采纳）：本地域席=设计+审核测试发布+会议协商三段职能；服务域席（duty 位）=任务书执行班。逐席改版核心=各席 agent-body 〈当前角色定位〉/〈核心职责〉/〈当前工作落点〉节按席别新定位重写本席语义。
2. **件5 FADE 实例生命周期三段框架**（定谳采纳）：孵化（本地）→运行（服务域）→审核（本地）——涉实例运行职责的席位（CTO/SDE/COS 值班面为主）工作落点节补生命周期三段职责句。
3. **件6 风险四族护栏班组合同要件**（定谳采纳）：班组合同要件入双班组协作面条款——涉班组协作席位（duty 位互备面·COO 派工面）补护栏要件句。

禁改面（CHO 划定·防改版越界）：soul 层身份气质不动；层契约节不动；机械合同引用（M-001/D-47 指针）不动；渲染管线常量与发布纪律不动——改版仅涉岗位语义面（角色定位/职责/工作落点/协作条款）。

## §三 · 工序六步（六环验收律适用）

| 步 | 工序 | owner | 交付物 | 验收锚 |
|---|---|---|---|---|
| G1 | 改版施工指引出卷（逐席改动清单+口径要点+禁改面+模板句式） | CHO | staffing-redesign-guide 件（本树） | 指引落卷 commit |
| G2 | 逐席自改自家源侧五件套（岗位语义 owner=席本身·agent-body 为主+涉改扩展件 memory/colleagues/session-body 随改） | 14 席各自 | 各席源侧 diff | 每席自报改动清单+diff 面 |
| G3 | 逐席验收：validator 读数+语义终门（改版载席位真实语义·禁模板桩）+六环对表（source→support→binding→live→manifest→治理回填） | CHO | 逐席验收签收单（附验证锚） | validator PASS+六环逐环实核记录 |
| G4 | 渲染管线重渲发布（live 面：`.claude/agents/`+`.github/agents/` 发布拷贝同步换代+host-object manifest 对表） | CHO 督·管线执行 | 发布拷贝 diff+manifest 换代记录 | live discovery 实核（两宿主位新语义在位） |
| G5 | 治理回填：roster/company-governance-state/employee-roster 对表+handoff 机器对象登记（双班组班次拓扑入册） | CHO | 回填 commit+台账行 | 治理面三处对表读数 |
| G6 | 全批毕=铸册窗收口对表+呈 BOD（随件7 D-73 铸条一并） | CHO→COS→BOD | 收口毕报 | BOD 采认回执 |

## §四 · 批次与节奏（排窗废止纪律下·顺序推进有活就干）

- **A 批（C-level 8 席）先行**：治理主体席先定（双班组治理语义自上而下传导）——G2 施工随毕随交·CHO 验收随到随验；CHO 自席改版与 G1 指引同批自办（施工指引出卷即自改自验首例）。
- **B 批（执行/职能 6 席）随批**：A 批验收过半即发 B 批施工令（经 COS 派工链 D-27）——B 批参照 A 批已验收先例形施工（降歧义）。
- **试岗挂接**（CHO 圆桌议题②意见·定谳采纳范围候 CAO 铸条收）：改版+验收毕=双班组形态试岗基座·试岗观察期一周级（班次拓扑实战运转验证）→试岗毕正式入册（roster 换版注记）。
- **同窗对表**：件7 铸册窗（D-73 铸条+会议段节勘·CAO 面）与本排程 G5 治理回填同窗对表——CHO 五件套增量与铸册窗收口一并呈 BOD（COS 知会信口径）。

## §五 · 风险与待确认

1. **结算表 13 vs roster 14 席位差**（实勘新发现）：绩效结算表口径 13 席（W41-W45 沿用·无 PM）与 roster v1.1.0 14 席（含 PM live）不一致——PM 入册（10-20）后是否纳入绩效结算候 11-08 结算窗 CHO 对表定谳（若定入·PM 补立账骨架）。
2. **DE 目录名差**：roster id=deployment-engineer vs source-agents 目录=senior-deployment-engineer——历史命名沿革（正名制下不改写·映射承载）·G5 回填时对表注记。
3. **非员工席源面**（board/business-strategy/registries 三目录）不在本排程对象内（非员工五件套·headcount 零变更语境）——board 源面若涉双班组条款增补候 CAO/CEO 面另行排程。
4. **duty 位实例覆盖**：sg 值班位（m-duty-*）live 面随 G4 重渲换代——sg 侧同步窗候 COO/值席协调（避施工并行窗互踩·R4 先例同形）。

## §六 · 使用依据

- 定谳令原文：`2026-W45/trees/file-family-maintenance/draft-ceo-bod-session-20261102.md` L2213-2219（意见㊿+280）
- 汇总卷：`.../board-gov-proposal-roundtable-20261105/cos-roundtable-summary-20261105.md`（TMV 684b9508c·§八第 4/7 条）
- roster 实勘：`TriCompany/docs/registry/employee-roster.json` v1.1.0（14 席全 live·2026-11-06T01:52Z 读）
- 源面实勘：`TriCompany/source-agents/` 14 席目录+CHO 席八件清单（agent-body/frontmatter/简介/contract/colleagues/memory/session-body/social）
- validator 现态：实跑 PASS（CHO 席样本·2026-11-06T01:52Z）
- COS 知会信：2026-11-06T09:45:17+0800 落款（排程单回执知会形态）

—— CHO 小源 · 排程单 v1.0 落卷（写前现查 2026-11-06T01:52:27Z·回执知会 COS·铸册窗收口一并呈 BOD）

# LG-034 阶段 1 首件组审·CPO 席意见稿（归档）

- sourceOfTruth: m-cpo 会话消息逐字归档（COO 收稿 2026-09-10 23:57+0800，签发 23:56:31+0800）
- syncMode: frozen（联审证据件）
- 独立性声明（原稿自带）: 独立实读出稿（靶标 74 行全文+同级族 6 件+CEO 输入件+两仓实勘），全程零文件改动

## 原文

◆总判断表态：同意「项目维度商业模式统筹+模块功能边界+治理配合」三支柱重定义。理由：现件自称「中央 Strategy Registry」（:7），职责以收口判范围为主（:15/:52-55），商业模式判断仅 :13 一行，定位重心确属错位；白皮书 v1.0（CEO 2026-08-22 签发）才是商业模式真源，agent 应为「解释+路由」而非持有。边界保障：business-strategy.contract.yaml:40 forbidden「产品功能优先级排序」必须在改写中原样保留——「统筹商业模式」不得吸走产品优先级裁决（本席收口域）。建议职责一改为三：①商业模式解释与一致性核查（对表白皮书）②模块功能与边界路由（对表架构说明+各模块 registry）③治理配合（对表 CGR）。锚：改写稿含三支柱+产品优先级禁入条款；contract responsibilities/decision_rights 同步。

◆①白皮书归位：支持收归 TriMetaverse/docs/，落点建议 docs/ 根（与三元宇宙架构与模块说明.md、文档治理与真源文件系统.md 并列），不埋 docs/product/（白皮书覆盖商业模式+通证经济+路线图，超产品面，埋入将与 PRD 层级混淆）。理由：根目录实勘 32 个 .md，大量历史件（phase-b/c 2026-02 runbooks、tride-opencode 迁移 runbook、三元宇宙价值流动_old.md 等）——仅移白皮书不解决根目录污染；引用面实勘两仓 ≥41 文件（TriMetaverse 30+上限截断、TriCompany 11），移动非单文件操作。建议：移 docs/tmv-whitepaper.md，根目录其余 md 同批出取舍清单单独拿审；移动批含活引用全量同步（历史 operating-records 按冻结律豁免不动）。锚：移动 commit 留痕+全仓 grep 活引用清零（历史档豁免列明）+各席 session-body 指针族行同步（我域内自办）。

◆②CGR 拆件+模块 registry 四件套：支持，附两前提。理由：source-agents/registries/ 实勘平铺 52 个单文件 agent（含 CompanyGovernanceRegistry.agent.md），与 business-strategy 的 per-folder 五件套并存=同族两代结构真源歧义；平铺族含死名模块前缀件（Tride×3/TriMC×3/TriLC×3+TrideProductRegistry 孤件）=⑤a 叙事过时的席位面镜像。建议：a) CGR 升 per-folder 拆 body/frontmatter/contract.yaml；b) registries/ 平铺族整体出处置方案（退役归档 or 逐个迁移），死名件优先；c) 四件套 owner 写明——product-state owner=CPO 域、code-state owner=CTO 域、business-state owner=BSR 域、readme=模块 owner，无 owner 等于无主。锚：CGR 五件套落盘+发布管线渲染通过；四件套模板含 owner 字段；死名件处置清单留痕。注：结构裁决权在 CHO/CGR+CAO 发布管线，本席出产品侧事实与 owner 主张。

◆③标准 docs 件套：支持；docs/ 实勘已具雏形（contracts/engineering/execution/prd/product/registry/runs/testing/training/workflow 全在），本条实为既成事实补立法。三组边界必须成文否则三处漂移：a) product/ vs prd/ vs registry/（我域，定义稿：product=产品真源 PROJECT/REQUIREMENTS/STATE；prd=单需求 PRD 件；registry/product-state=产品事实现势投影——本席可出）；b) runs vs workflow/operating-records（模块级运行记录 vs 公司级经营记录 COS 收口域，禁混写）；c) training/testing/engineering 归 RAndDTrainer/STE/CTO 域定义。锚：CGR 件套规范含每件「功能+边界+owner+收口域」四行定义。

◆④description 过时清理（联审裁三项裁决）：五处全部清理。裁决——
·「赛博公司经营载体」：有条件保留（改措辞）。归商业模式成立面：TriCompany 载体是当前商业实验的组织形态（13 席 AI 员工产能结构=低成本盈利假设的载体），商业模式与经营载体不可分；不成立面：其治理规则/岗位边界归 CGR。建议措辞「赛博公司经营载体（TriCompany）作为当前商业实验的组织形态」+边界句指向 CGR。若 CEO 裁「项目维度」纯化则整项移入总判断配合条款——两案均可，倾向前者。
·「TriModel Provider/Model 配置层」：移除。配置层是运行/技术面事实，非商业模式要素；残余商业相关性仅「宿主与入口叙事一致性核查」，作边界注记不独立成项。
·「入口策略」：移除或移交产品面。现役入口=TriPilot（IDE）+trilc chat（CLI），入口已是产品面事实描述非战略待裁项；旧词源出 copilot→TriMC 迁移期，叙事已亡。若保留则改写为「用户入口面叙事一致性」路由 CPO 域。
·「TriMC 统一运行面」「正式上线切换阶段」：无争议移除。补强：白皮书修订 1（2026-08-22）已完成 TriMC→TriMMC 换轨——商业真源已在新口径，agent description 落后于自己依据的真源。锚：description 两处同改（agent-body.agent.md:3+contract.yaml:10），改写稿不含 TriMC/入口策略/切换阶段字样，逐条留痕引本意见。

◆⑤运行宿主基线（联审核实）逐项：
·a：可证部分支持——TriMMC/TriRLC 改名成立（CLAUDE.md workspace layout+白皮书修订 1 双证）；TriMLC/TriRMC 见白皮书修订说明但 CLAUDE.md Module Workspace Layout 未列对应目录，存在性待 CTO 面；runtime=M面 CC+R面 agent-core 系 CEO 自标待确认，改写稿不得写成定论。
·b：无产品面反证，从 CTO/COO 核实结果。
·c：TriModel=类 CC Switch 仅理解用不入文档——同意该纪律；Tride→TriCode 更名：产品面证据支持，裁可。
·d：若「orchestration 仅在 MC 层、TriCode 不承担主要开发工具」裁定成立——注意 CLAUDE.md 自身仍写 TriCode="Shared code runtime and orchestration"，须列入⑤e 清查清单同步修；TriCade=TriRLC 层与 CLAUDE.md 相容。
·e：shadow/正式接管叙事已亡——产品面实证：contract.yaml:84-87 runtime_baseline（host: copilot-host / tri_mc_status: planned / tri_mc_migration_ready: false）为现役合同件残留此叙事的最硬样本；CLAUDE.md「.github/agents/（Copilot-host entry）」句亦残留。同意记入 CGR 并多文档清查。
·f：V1=M面+R面最小 MVP 成熟点——支持作为 V1 定义方向，但按本席纪律 MVP 须附边界+验证指标：「成熟点」需可验收判据清单（哪些面进 V1、发布 readiness 判据、与 CTO 联审），发布前 CEO 确认挂钩同意。锚：改写稿基线节逐条对表本审核实结论；待确认项不带定论语气；contract.yaml runtime_baseline 同步改写。

◆⑥project.md+信息源清单：同意整体改写留痕（或单独拿审）、移 docs/ 与①同批。理由：根目录 project.md 与 README.md、trimetaverse.md、tmv-whitepaper.md 四件并存讲项目故事——产品叙事唯一真源应收敛到白皮书，project.md 建议改写为短导航/索引件或并入；tricompany.md 同理（TriCompany 源侧自有真源，根目录版易漂移）。信息源清单缺 CLAUDE.md 属实，且缺根目录 AGENTS.md，两者均随宿主路径入仓，CGR 登记同意；补核：清单内 :45-46 引用的 tricompany-agent-roles.md 与 central-registry-closeout-workflow.md 实勘均在（无死链免改），但 :42-44 三个根路径未注明属 TriMetaverse 仓，改写补仓前缀。锚：project.md 处置方案单独拿审留痕；清单含 CLAUDE.md/AGENTS.md 并注明宿主随附属性；CGR 建宿主随附文件登记册。

◆⑦中央收口改排（联审裁）：有条件支持。COO 管节奏+CGR 执行制度+BusinessStrategy 退回纯商业判断，三权分层合理；现 :15/:52-55 判范围职责本质是收口编排，归 COO/CGR 更顺。条件两条：a) 产品/工程收口 owner 判定事实职责不入中央排程（product-state owner=CPO、code-state owner=CTO 不变）；b) contract.yaml decision_rights（approve 含 registry 参与范围裁定/中央边界裁决）随改写同步，否则合同与 body 打架。锚：新路由矩阵三方署名+owner 不变条款；contract decision_rights 同步。

◆⑧更新策略 fade 自动化：支持方向，附一道闸。理由：现 :17/:57-59「用户明确要求才更新」已证伪——本次组审即该策略失灵实证（description 携带已亡叙事数月）；模块管理 agent 实勘件名=source-agents/registries/TriCompany.agent.md（非令文所写 tricompany.agent.md，⑧落点注意），走 fade 符合管线架构。闸门=事实回填自动化、裁决面人工门：名称/路径/状态类事实回填 fade 自动+commit 留痕；商业模式表述/模块边界/优先级类裁决性内容不得被自动更新静默改写（联审/CEO 门照旧，D-15 适用项不豁免）。contract.yaml tools.edit（scope docs/registry/、requires_approval:true）需配新条款区分两类写入。锚：新更新策略含「事实回填/裁决面」二分条款；fade 更新留痕字段；contract 同步。

◆独立发现（3 条）：
1. 双真源歧义：BusinessStrategy 同时存在于 source-agents/business-strategy/（五件套）与 source-agents/registries/business-strategy.agent.md（平铺单件，grep 亦引白皮书）——改写必须先裁决哪处为真源并处置另一处。归 CHO/CGR 处置，本席提示风险。
2. contract.yaml:52 tools 含 `search`（runtime_equivalent: openclaw:search:grep），非 Claude Code 原生工具名，发布管线映射待工程面核（CTO 域，仅提示）。
3. registries/ 平铺矩阵死名模块 registry 件 ≥10 个，是旧叙事活跃传播面，②处置方案应覆盖。

◆使用依据：靶标全 74 行；同级族 6 件；CEO 意见输入件；TriMetaverse 根目录 32 md、docs/、docs/workflow/、source-agents/registries/ 52 件实勘清单；tmv-whitepaper.md 头 40 行；项目 CLAUDE.md；两仓 tmv-whitepaper 引用面 grep 实勘。
◆M4 声明：全程仅 Read/Glob/Grep/ls，零文件改动。

——CPO 席（m-cpo 小乔），签发 2026-09-10 23:56:31+0800

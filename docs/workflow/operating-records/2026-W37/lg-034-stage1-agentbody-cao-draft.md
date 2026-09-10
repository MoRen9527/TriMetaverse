# LG-034 阶段 1 首件组审·CAO 席意见稿（归档）

- sourceOfTruth: m-cao 会话消息逐字归档（COO 收稿 2026-09-10 23:50+0800，签发 23:49+0800）
- syncMode: frozen（联审证据件）
- 独立性声明（原稿自带）: 独立实读出稿，未参考任何他席稿；全程零文件改动

## 原文

【实读与合规声明】实读面：靶标全件 74 行；CEO 意见原文件；同级族 7 件清单（Glob 实勘）；company-governance-state.md；host-object-publish-flow.md；engineering-disciplines.md（D-07/13/14/16/18/21/22）；TriMetaverse/docs/文档治理与真源文件系统.md（L1-120 实读）。检索注记：tmv-whitepaper 引用面扫描根=两仓 **/*.md glob，命中 TriMetaverse 48 件+TriCompany 11 件。

【总判断回应】支持「非人格 agent 不应有 colleagues/soul/social 人格件」及职责三项表述。理由：CLAUDE.md「Agent Architecture」明载 Registry Agents=非人格数据枢纽；同级族实勘确含四件人格件——五件套模板错配；三项主职责与靶标 L11-18/L50-55 同向，第三项所据文档治理与真源文件系统.md 实存（TriMetaverse/docs/，V0.2）。修改建议：人格件删除走 D-07 发布通道+live publish manifest 对表，禁手删了事；「非人格 registry agent 源侧结构标准」成文并入②。验收锚：同级族目录 diff+manifest 同步记录。

【①白皮书归位】支持收归，但必须作「真源迁移切片」一次闭环，随迁三件套（活体引用改写+registry 登记+信息源清单同步）；根级不留同文副本。理由：白皮书系真源优先级第 1 位，该表按根相对路径书写（文档治理文件 §1 表 L23）——移动即改锚；引用面实勘两仓 59 件命中：活体真源/指针面+历史冻结件（operating-records 若干——历史叙事冻结不改写）+派生渲染面（.claude/agents、.github/agents——禁手改，随源侧管线再生）。修改建议：git mv 至 docs/（建议与三元宇宙架构与模块说明.md 同层）+活体引用逐件改写+§1 表行更新+靶标 L42 信息源清单同步（与 body 改写切片合并执行防二次断层）；根级如需入口留一行指针件（D-16 指针形态合法），禁同文副本；范围注记：根级另有 tmv-phase-1-execution-plan.md、arch-storage-migration.md 散件——本条只裁白皮书，散件候另批防蔓延。验收锚：旧路径全仓 grep 复扫活体面清零+registry 迁移登记行+根/新址命中各一。

【②registry 独立文件夹+拆分+模块 registry 四件套】支持三项全部，各附通道与边界条件。理由：现状勘定 CompanyGovernanceRegistry.agent.md 系 registries/ 平铺单件（Glob 实勘 51 项：50 件 .agent.md+1 件 live publish manifest json）；拆分形态与 business-strategy/ 先例同构，契合 D-07 三层语义与 D-16 三面渲染；registry 四件套已半事实化——靶标 L27 已按「business-state 校验 product/code state」在用。修改建议：①「非人格 registry agent 源侧结构标准」成文（host-object-publish-flow 新节或 governance-state 新节）：<registry-id>/ 三件组、无五件套、字段归属写明（name/description/tools 骨架归 frontmatter 件，防双处维护）；②迁移走 host-object-publish-flow §3.1 同构门禁：唯一 discovery 入口保持、live publish manifest 更新、旧平铺件退役；③四件套登记入 governance-state「模块标配」节，定位=docs/registry/ 内层标准、不替代六件套（计数关系写明）；④governance-state 来源节路径随迁改；⑤范围注记：registries/ 平铺约 50 件，建议本切片只立标准+CGR 首迁，全量迁移另排防跨度过大。验收锚：manifest 对表 diff+旧路径 grep 清零+模块标配文本修订+标准文本含字段归属段。

【③各模块 docs 标准件套（十件）】支持规范化；四件「联审裁」逐件出裁决性意见；标准须对表两处既有「六件/六层」定义防第三平行真源；建议分级标配防空架。理由：既有定义两处——governance-state「模块标配」六件套（L149，占位模块也硬性 L152）+文档治理文件 §3.2 六层协同系统（L89-102）；新件与既有件有定义重叠风险（prd↔product、testing↔engineering、runs↔workflow+operating-records）；全员硬标配十件将批量产空目录。修改建议（裁决性意见）：contract=模块对外契约/接口承诺件，CTO+CPO 双域会签——裁「立」；prd=单版本需求正本、归 CPO，与 product 件分界=product 系产品事实登记面、prd 系需求正本——裁「立」，分界必须入标准文本（TriMetaverse 已有 docs/prd/ 先例）；testing=测试策略/门禁记录、归 CTO/STE，与 engineering 分界=engineering 系技术真源、testing 系验证面——裁「立」；runs=倾向裁「不立独立件」——运行记录已有两处承载（公司级 operating-records 周面+host-object-publish-flow §3 动态数据不入源侧纪律），模块级 runs 须显式划清与两者边界方可立，否则三处记录打架——候 CEO 终裁。分级标配：六件套维持全员硬标配，contract/prd/testing=现役模块按实质承接时立、占位模块豁免；标准唯一真源落 governance-state 模块标配节，文档治理文件 §3.2 加注区分语境不改写（防双源）。验收锚：模块标配修订 diff 含每新件一行定义+runs 裁决记录。

【④description 过时清理】支持清理；附通道提示与三处联审裁逐处表态。description 系 spawn 面发现文本（D-16 裁②），改动走源侧→D-07 管线，禁直改发布面。联审裁表态：「赛博公司经营载体」=TriCompany 经营载体概念，可留但主语必须限定 TriCompany 载体、不得修饰 TriMetaverse 商业模式整体；「TriModel Provider/Model 配置层」=归商业模式叙述牵强（TriModel 实际定位系模型 key/Provider 切换层），建议自 description 移除、如需保留归 body 基线段；「入口策略」=两仓真源面未见定义锚，建议裁删。三者终裁权在 CEO/内容 owner。验收锚：改后 description 与⑤e 基线逐词对表+发布面 hash 更新留痕。

【⑤运行宿主基线（联审核实）】逐项治理面核实——⑤a/⑤c/⑤e 有治理真源可证或可承办；⑤b/⑤d/⑤f 本席不可独立证实，如实标注候对应席。
- ⑤a：服务域/本地域划分与模块命名权威对照表四行叙事名一致（governance-state 对照表 L194-197）；「TriMC 已不存在」建议精确为「叙事面退役、物理兼容名冻结」（对照表 2026-08-31 CEO 终态裁决）；runtime=M面 CC+R面 agent-core——无运行面实证，维持待确认。
- ⑤b：技术/商业事实面，候技术席，无立场。
- ⑤c：Tride 更名 TriCode——命名事实方向有旁证（CLAUDE.md workspace 表；registries/ 亦存 Tride* 系 registry agent 三件待随迁处置）；裁过后由本席承办对照表增行（对照表维护 owner=CAO、变更须 CEO 联动）；「TriModel=类 CC Switch」不入文档，遵办。
- ⑤d：技术事实面，候技术席核实。
- ⑤e：shadow/正式接管/copilot chat 过时——治理面可证：靶标 L32-38+L3 即旧叙事集中带，CEO 判断与文件现状互证成立；「记入 CGR+多文档清扫」支持——建议立「存量过时叙事清扫」专项：先 registry 登记裁定口径，后多文档扫描改写（守 D-14 审计根声明+历史冻结件豁免）。注记：文档治理与真源文件系统.md §2.1 工作区布局（L47-70）亦系旧名集中带（TriMC/TriLC/Tride/TriModel/TriSkill/TriGateway/TriTraining/TriDeployment 系），且该件 lastSyncedAt=2026-07-03 早于 quad-migration——应入清扫清单首批。
- ⑤f：商业面候 CEO 自裁，无立场。
验收锚：对照表增行 diff（⑤c）+registry 叙事裁定登记行（⑤e）+清扫清单含命中数（⑤e）。

【⑥真源管理通道】支持立「随宿主添加文件登记通道」——系既有 manifest 族的真缺口；登记形态挂既有 GID 三环收口不另起册；project.md/tricompany.md 改写单独拿审。理由：现有登记面三件覆盖对象载荷与 live agent，skills/hooks/prompts/settings 类宿主散件无登记义务——靶标 L40-48 信息源清单七项无 CLAUDE.md 即症状本体；CLAUDE.md 已有真源+管线（GID-05/FADE-002），登记应指向既有索引（GID 三环收口），另起登记册即双登记；文档治理与真源文件系统.md 系「汇总索引非独立真源」（L13 自述）——通道规则主笔面须择一（governance-state 或该文件），防双源。修改建议：①登记义务成文：宿主面新增/变更文件须 CGR 登记，形态=GID 条目；②「提醒员工检查更新」落法=登记同步出指针行+受影响席位清单，催办走 COS 台账；③信息源清单补 CLAUDE.md 及其真源指针（随 body 改写切片）；④project.md 整体改写与「是否移入 docs/」单独拿审，tricompany.md 同。验收锚：登记通道文本入册+信息源清单 diff+project.md 拿审排期挂账。

【⑦中央收口归属（联审裁）】方向可行，但系 owner 矩阵级变更，须走矩阵修订程序，且与 COS 现行职责的边界必须显式改写不得含糊。理由：现行真源两处明载 COS 收口职责——governance-state L15「CEOChiefOfStaff 只负责路由、协调、催办、升级和中央收口」+Current Ownership 表「公司级任务分派、协调、催办与升级=COS」；收口管理权移交 COO=矩阵变更，该文件自定程序=「先改本节，再同步 github-repo-governance.md §8」（L32）；涉岗位职责变动归 CHO handoff 链（L31）。registry 执行面无争议。修改建议：①先裁「管理」动词边界——建议定义=「收口督办与节奏管理」，分派权/升级权是否随迁逐项列明；②COS 保留面写明（升级链、董事会通道不断；L15 与矩阵行与 host-object-publish-flow 补充治理段 L63 三处同步改写防双源矛盾）；③矩阵修订三件套：governance-state+github-repo-governance.md §8+CHO 岗位职责面核对；④COO 承载面=现役 m-coo 会话（在册可承载）。验收锚：矩阵三处 diff+CHO 核对记录+「管理」定义入册。

【⑧更新策略（fade 自动更新）】支持去人工明示依赖的方向，但须分层白名单+逐真源入 FADE 条目，禁 ad-hoc 直写；本条修订系双真源同步（靶标 L57-60+文档治理文件 §3.3 L114）。理由：现行人工门双处载明，单改靶标即双源漂移；源侧自动改写无限定将撞两道既有纪律：制度文本人工确认门（秘书处 §7+D-16）与动态数据不入源侧（host-object-publish-flow §3）；「走对应 fade」=管线化前提——FADE-002 先例=每真源一双条目在册，无条目的自动更新=审计断链。修改建议：①自动更新分级白名单：登记类/state 类/指针行类=可自动（commit+attribution 留痕）；制度/叙述/契约类=仍须 owner 确认门；②拟自动更新真源逐件入 FADE 条目，无条目不自动；③「小赛」触发面成立，写入权限随白名单；④验收含负路径断言（越权自动写应被拦）。验收锚：白名单文本入册+FADE 条目对表清单+负路径测试记录。

【独立发现】
1. 同级族人格件删除前建议抽验是否含应迁运行态内容（source kit validator 禁运行消费记录入五件套；有则先迁 support/runtime 再删，host-object-publish-flow §3 纪律）。
2. registries/ 名册含旧名系：TriMC*/TriLC*/Tride* 系 registry agent 三件组×3，与⑤c⑤e 裁决联动——处置应入对照表/清扫清单（不扩本切片，登记候办）。
3. 文档治理与真源文件系统.md lastSyncedAt=2026-07-03 且 §2.1 系旧名集中带——建议列入阶段 1 后续靶标候选。

【无意见维度明示】①-⑧ 八条均有意见；⑤b/⑤d/⑤f 三个子项无立场、如实标注「不可独立证实」。

——CAO 席（m-cao），签发 2026-09-10 23:49+0800

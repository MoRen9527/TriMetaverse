# LG-034 阶段 1 首件组审·CTO 席意见稿（归档）

- sourceOfTruth: m-cto 会话消息逐字归档（COO 收稿 2026-09-10 23:45+0800，签发 23:44+0800）
- syncMode: frozen（联审证据件）
- 独立性声明（原稿自带）: 独立实读出稿，全程零文件改动；行号基准=靶标件实读版 74 行

## 原文

【总判断表态】同意 CEO 总判断：本件为非人格 registry 型 agent，body 无人格内容✓；职责定位与 2026-08-21 三元宇宙重定义注记（模块说明 L89 双系统注记）一致✓。

①【tmv-whitepaper 收归 docs/】可收归，非阻塞项。收归 docs/ 更符合「项目级文档入 docs/」收敛方向，工程面是纯引用链平移。修改建议：迁 docs/tmv-whitepaper.md + 同窗更新引用清单（靶标件 L23/L42、CLAUDE.md Registry Routing、模块说明 L89、记忆面指针）；验收锚：全仓 grep 'tmv-whitepaper' 引用面清零旧路径+渲染管线零硬编码路径断言。若裁收归，原根位置不留转发文件（避免双真源）。

②【CompanyGovernanceRegistry 独立文件夹+拆件；模块 registry 四件套】技术面支持。独立事实补充——员工席 13 族已是「独立文件夹+拆件」，registry 族现平铺单文件（内联 frontmatter、无 contract.yaml）。拆齐=渲染管线输入 schema 统一，低风险结构收敛。但拆件须先修现存结构缺陷（独立发现 A：agent-frontmatter.agent.md 空壳）。修改建议：CGR 建独立文件夹+七件套对齐员工族 schema；四件套=把现役实践（TriCompany/docs/registry、TriMLC/docs/registry/code-state.md 均已在役）升格为 schema 标准，支持。验收锚：渲染链 --host 双向渲染产物 diff 零漂移+contract.yaml 校验门全绿+四件套落位清单。

③【模块 docs 标准件套】方向支持；「联审裁」三项交联审。技术面边界提醒：engineering 与 execution 分域须钉死——TriMetaverse docs/execution/=设计/执行文档，TriCompany docs/engineering/=技术真源/协议正身；标准件套若在「模块 docs」下另设 engineering/ 会造第二技术真源，建议写明「engineering 真源唯一落点=TriCompany/docs/engineering/，模块 docs/ 内不设 engineering 或仅放指针」。验收锚：件套规范稿含分域条款+各模块现有 docs 目录对表差异清单。

④【description 过时清理】同意清理，修改面比表面大——过时串三处复制：body L3 frontmatter、business-strategy.contract.yaml identity.description、registries/business-strategy.agent.md L3（三处逐字同串），须三处同批否则渲染产物漂移。a)「TriMC 统一运行面」同意删除；b)「赛博公司经营载体」（联审裁）——该串与 L33 同源，若裁删 L33 需同批评估；c)「TriModel Provider/Model 配置层」建议保留但改准：TriModel 实际=模型 Provider/Model 路由与配置层（实证：TriMLC 模型注册表 19 模型/tm-local token/本地 server+sg 部署），作为商业模式输入（成本/供给面）可留 description；d)「入口策略」无现行对应语义，建议删（现役入口=TriPilot IDE+trilc chat CLI+CC 交互会话）；e)「正式上线切换阶段」同意删（L37 同病）。验收锚：三处同串 diff 一致+渲染产物 description 三面对表一致。

⑤【运行宿主基线】（本席焦点，逐项核实结论）
a. 服务域/本地域划分=核实成立（模块说明 L69/L70+双系统注记 L89）。本机实探佐证：TriRLC=127.0.0.1:8711、TriMLC=127.0.0.1:8713、TriMMC=sg 47.245.122.61:8710（healthz ok）。「runtime 应为 M面 claude code runtime+R面 agent-core」——待确认项核实结论：成立（M面=CC 会话运行实证；R面=模块说明 L69「与 TriRLC 共用自研内核 agent-core」明文）。
b. M面 TriMMC、R面 TriRMC 仍有主控含义=核实成立（Meta Controller 元虚拟主控/Reality Main Controller，2026-08-21 重定义登记明载）。靶标 L32「使用 TriMC 作为标准名称」须改写为 M/R 双面主控基线——全件最大过时源。
c. TriModel 定位=同意 CEO 理解句不入文档；Tride 已废弃更名 TriCode=核实成立（CLAUDE.md 正身；Tride/ 本地目录为遗留面）。「原为 LC glue 层、现仅给 RLC 面用户多一选择」与 L35「Tride 负责开发工具与 orchestration 底座」矛盾——L35 须随批改写。
d. 逐项表态：TriPilot+TriCode+trilc chat+VSCodium=TriCade(PC 端)=TriRLC 层=成立；主开发=agent-core=成立（TriPilot/trilc chat 仅入口）；「orchestration 仅在 MC 层」=表述过强，建议修正为「主控编排归 MC 层（M面 TriMMC/R面 TriRMC），本地执行生命周期编排归 TriRLC 本域」（按模块说明 L70，TriRLC 本域承载 planner/tool bus/本地执行生命周期）；宿主切换仅在 M面经 fade 渲染=核实成立。
e. shadow/正式接管过时=核实成立（L36 原文即该旧叙事）。「记入 CompanyGovernanceRegistry」同意，补充独立证据：TriRMC/README.md 本地仓仍以「# TriMC」开头且载 copilot-host shadow 叙事——建议与靶标件同批登记 CGR 过时叙事清单；copilot chat 入口不存在、现 IDE=TriPilot/CLI=trilc chat=核实成立。
f. V1=M面+R面最小 MVP 成熟点：技术面同意作为目标口径候选；「成熟点」判定权在 CEO/BS，建议发布 readiness 另走 TriDev 门禁读数后再钉措辞（护栏：未验证实现不写 production-ready）。
L30-38 整节建议按上述整体重写而非逐句补丁——每一行都建立在 08-21 重定义前叙事上。

⑥【信息源优先级】L40-48 缺 CLAUDE.md=属实，且还缺「三元宇宙架构与模块说明.md」（CEO 总判断钦定的模块边界依据）——两件同批补入。CLAUDE.md 建议标注「宿主随批渲染产物，变更走 fade 窗+CGR 记录」（落点=CGR 记录项+巡检面提醒，不新增常驻进程）。project.md/tricompany.md 改写留痕或单独拿审：无技术异议，注意 L23 约束句与 L42-44 清单引用须随改写同批。

⑦【中央收口交 COO 管理、CGR 执行】（联审裁）原则可裁，附边界保留——技术收口面（code-state 事实、工程门禁、发布 readiness）须保留 CTO owner 终审/会签位，CGR 做流程执行与登记收口。理由：registry 技术事实准确性需要 owner 责任闭环，纯流程收口无技术会签会出现「流程全绿、事实漂移」。验收锚：收口流程稿含技术项会签节点定义。

⑧【fade 自动更新链】工程面可行，建议两段式。现役基础：FADE 管线+hook 快通道/cron 慢通道+face 路由在役，D 侦测段已有巡检兜底实证（今日 7911d152）。建议：阶段 1=模块管理 agent 走 fade 只开「过时检出→生成修正单→派工归属席确认后落盘」，真源级文件仍守人工明示门；阶段 2=低风险类（版本号/路径/日期/引用平移）给直写白名单+validate 门禁+回滚稿。风险：无门禁直写真源=失控写面；归属路由阀门（L28）必须作为自动链前置闸。验收锚：阶段 1 修正单样例走通全链+直写白名单清单文档化+每次自动写留 fade 回声审计。

【frontmatter/yaml 技术规范面】
1. `tools: [read, search, edit]`（L4）非宿主标准工具名（CC frontmatter 工具名为 Read/Glob/Grep/Edit 等驼峰实名，search 不是工具名）；registries/ 同族同病。须对表渲染管线确认消费/转换行为后统一。
2. L14 模块映射表残留旧名：Tride（已更名 TriCode）、Tripilot（正名 TriPilot）、vscodium（大小写）——随⑤/④批同修。
3. L25「不要把 core-agent 当作现役服务域主控」条款=现行有效纪律，建议保留。

【独立发现】
A. business-strategy/agent-frontmatter.agent.md 为空壳文件（全文仅 `---` 两行），而 contract.yaml paths.agent_frontmatter 指向它、实际 frontmatter 内联于 body L1-6——契约路径悬空+双源歧义，②拆件时一并修。
B. description 过时串三处复制（见④）——建议组审裁定「单一真源落点」（建议=contract.yaml identity.description 为源，body frontmatter 渲染生成）。
C. TriRMC/README.md 旧叙事（见⑤e）——CGR 过时叙事清单候选。

【SLA】00:09+0800 前送达✓。全程只读，零文件改动。

——CTO 席（m-cto 小狄），签发 2026-09-10 23:44+0800

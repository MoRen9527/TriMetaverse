# LG-034 阶段 1 首件组审·BusinessStrategy(spawn) 意见归档件

- sourceOfTruth: 本件=BusinessStrategy spawn 执行者的意见落盘归档（M-004 残留场景③，CEO 批准）
- syncMode: archived（一次性实验归档件，意见评审期间由 spawn 执行者填写，其后冻结）
- lastSyncedAt: 2026-09-10T23:37+0800（COO 创建骨架）
- 靶标: `TriCompany/source-agents/business-strategy/agent-body.agent.md`（74 行）
- CEO 意见输入件: `docs/workflow/operating-records/2026-W37/lg-034-stage1-agentbody-ceo-input.md`
- 关联: LG-034 台账（COS 主控）；SLA=即时反馈/标准 2026-09-11 00:09+0800/特殊最长 00:39+0800

## BusinessStrategy spawn 意见

### 总判断（一条）

靶标须重写级修订而非词句修补：agent-body「当前运行与宿主基线」节（L30–38）7 条中 5 条携带失效口径（TriMC 标准名／Tride=orchestration 底座／shadow+copilot 宿主／正式上线切换阶段／TriModel 宿主切换层），frontmatter description 与 contract.yaml（description 逐字同文；runtime_baseline: host: copilot-host + tri_mc_status: planned）同源污染。CEO 总判断成立：本席=非人格 registry 席位，职责=统筹项目维度商业模式（真源 tmv-whitepaper.md）+模块功能与边界（真源 docs/三元宇宙架构与模块说明.md 及各模块 docs/registry）+与 CompanyGovernanceRegistry 配合治理规则与文件真源管理。商业职责面在新 M/R 面架构下仍然成立，席位无需撤销，须按新口径重写。证伪性审视另发现 CEO 未点名的硬伤一处（见证伪节第 1 条）：本席 L35 含与白皮书直接矛盾的架构断言。

### 对 CEO ① 的意见（主焦点）：tmv-whitepaper.md 收归 docs/

- 意见：支持收归 `TriMetaverse/docs/`，建议保持文件名不变（`docs/tmv-whitepaper.md`），定位=项目级商业与架构总真源，非普通 docs 件。
- 理由：白皮书是本席信息源优先级第 1 位，现居仓库根与入口件混居，真源层级不可见；docs/ 内已有 `三元宇宙架构与模块说明.md` 按 §3.1 引用它，同层利于引用稳定；根目录宜留给入口件（CLAUDE.md/README 类）。
- 风险（证伪性补充）：迁移破坏既有引用——已证实引用面至少 4 处（本席 agent-body L23/L42、项目 CLAUDE.md、三元宇宙架构与模块说明.md §3.1、操作记忆索引「白皮书在根」条）；全仓精确计数本 spawn 无内容检索工具，待确认。
- 修改建议：git mv+修正记录留痕+引用面同步扫改；根是否留 stub 指针由 CompanyGovernanceRegistry 裁（文档治理归其，本席只确认商业真源身份与内容边界不变）。
- 验收锚：`docs/tmv-whitepaper.md` 在档且带元信息头；全仓引用零断链（或 stub 覆盖）；本席信息源优先级 #1 路径同步。

### 对 CEO ② 的意见：CompanyGovernanceRegistry 独立拆件+模块 registry 四件套

- 意见：支持。本席以同级族实证自证：business-strategy/ 7 件中 soul/colleagues/social/memory 4 件全为「空模板/待定义」占位（实读为证），实质仅 agent-body+contract.yaml+agent-frontmatter 三件——非人格 registry 席位不需要人格件。
- 理由：CompanyGovernanceRegistry 现居 source-agents/registries/ 单文件，与人格岗位（文件夹多件套）混层，结构语义不清；空壳人格件徒增发布渲染与维护面。
- 修改建议：registry 族与中央非人格席位统一收缩为三件套（body/frontmatter/contract.yaml），人格岗位保留多件套；模块侧 registry 四件套（business-state/code-state/product-state/readme）支持——business-state.md 已是本席 body L27 约束的校验基线，四件套化即结构化。
- 验收锚：CompanyGovernanceRegistry 独立文件夹+三件套在档；非人格席位空壳人格件移除或标 deprecated；至少一个模块试点四件套。

### 对 CEO ③ 的意见：模块 docs 标准件套

- 意见：支持 CompanyGovernanceRegistry 牵头规范；contract/prd/testing/runs 四项标「联审裁」合理（天然跨域）。件套功能边界按归属路由阀门分配：registry/ 归商业校验链（本席用 business-state 先行校验 product/code-state）、product/ 归 CPO、engineering+execution 归 CTO、workflow/training 归治理与工程纪律。
- 理由：件套标准=治理规范权，归治理域；本席只对 registry/ 件（商业定位面）有直接边界裁决权。
- 修改建议：件套清单须与模块说明 §4 已有「六层文档」口径（产品/工程/registry/workflow/execution/training）对齐后增量，避免两套清单漂移；registry/ 最小四件含 business-state.md 并写明校验次序。
- 验收锚：CompanyGovernanceRegistry 出件套规范文档；清单与六层口径映射表在档；registry/ 件定义含 business-state.md 校验次序。

### 对 CEO ④ 的意见（主焦点·联审裁）：description 五词逐词裁决

- 「TriMC 统一运行面」——删。TriMC 已换轨消亡（2026-08-21 TriMMC/TriRLC 换轨，2026-09 兼容收编），运行面口径改 M/R 双面。
- 「赛博公司经营载体」——拆裁：保留「赛博公司（TriCompany）模块商业定位与边界」（TriCompany=白皮书 §3.3.1 L2 身份商业层模块，其商业角色是正经商业模式问题）；删除「经营/交互载体」运行语义（归 COS 运营与治理域，非商业策略）。
- 「TriModel Provider/Model 配置层」——改写保留为「TriModel 模块边界（Provider/Model 统一配置层）」：TriModel 是服务域成员（§3.3.1 L0 服务域），模块边界归本席，但 description 应锚定模块边界视角而非配置技术细节；「类 CC Switch」类比按 CEO 标注不入档，本席同意。
- 「入口策略」——改写为「入口层与三端入口形态」保留：白皮书 §1.5 三端协同（TriAvatar Web／TriPilot+TriRLC PC 端／TriMobile 移动端）是标准商业命题，现词太泛易误读为流量运营。
- 「正式上线切换阶段」——删。叙事源自 copilot→TriMC 切换（已死）；替代口径候 ⑤f 定（「TriMetaverse V1（M面+R面最小 MVP 成熟点）」须 CEO 确认），确认前删而不补。
- 联动：description 末句「中央 registry 收口时判断下一步该查哪个 registry」随 ⑦ 定谳同步改语义（首站判断→商业边界被调参与）。
- 验收锚：新 description 零含 TriMC/shadow/切换阶段/copilot 宿主字样；五词处置逐条入档；赛博公司/TriModel/入口三处改写经联审会签。

### 对 CEO ⑤ 的意见（主焦点）：运行宿主基线商业模式面口径

- a. 支持且可销「待确认」：白皮书 §3.1 证实——元虚拟最小实现=TriMMC+TriMLC（宿主 claude code，可整体替换），元现实最小实现=TriRMC+TriRLC（共用自研内核 agent-core）；LG-031 四格矩阵（远端 M=TriMMC／远端 R=TriRMC／本地 R=TriRLC／本地 M=TriMLC）即「服务域=TriMMC+TriRMC、本地域=TriMLC+TriRLC」。runtime=M面 claude code runtime+R面 agent-core 成立。
- b. 支持：TriMMC=Meta Main Controller 元虚拟主控、TriRMC=Reality Main Controller 元现实主控，主控语义在档（白皮书 §3.1+模块说明 §4）。
- c. 支持：Tride→TriCode 更名有真源（模块说明 §5：TriDeployment→TriAuto、Tride→TriCode 历史名）；「类 CC Switch」仅理解用不入档，商业口径维持「Provider/Model 统一配置层（多 provider 适配/模型路由/fallback 链）」。
- d. 支持方向，补一处实然/应然切分：TriCade=TriRLC 层 PC 端打包成立（白皮书 §1.5+项目 CLAUDE.md 桌面分发束定义）；TriPilot/trilc chat=IDE/CLI 入口、TriCode=glue 不承担主开发工具，与模块说明 §4 一致；「主开发=agent-core」须按白皮书 LG-031 两层区分入档——实然=当前主研发试验仍在 M面 claude code 宿主，agent-core 为 R面建设中内核；应然=agent-core 自持生产面承接主开发。不以应然充实然。orchestration 仅在 MC 层：证实（本席 L35 旧文即反例，见证伪节）。
- e. 支持并自认：本席 L36「shadow 与正式接管统一按 copilot 宿主表述」即 CEO 所指未更新叙事的活体样本，删。新口径：IDE 入口=TriPilot、CLI 入口=trilc chat，无 shadow/接管二态。公司多文档同类叙事清理台账归 CompanyGovernanceRegistry，本席只确认商业口径。
- f. 支持：V1=M面+R面最小 MVP 成熟点与白皮书 LG-031「实然层=最小 MVP」同构，非新造口径；发布确认留 CEO，本席列为 V1 gate 商业定位核对项。
- 验收锚：body「当前运行与宿主基线」节重写后逐条可回溯 §3.1/§3.3.1/LG-031/LG-033 条目号；「主开发」表述含实然/应然标注；零 TriMC 现役/shadow/copilot 宿主字样。

### 对 CEO ⑥ 的意见：信息源优先级

- 意见：支持 project.md/tricompany.md 单独拿审改写留痕；改写完成前本席信息源清单 #2/#3 加过时警示注记或临时降权——本席每次引用都在传播其口径，不注记即失真（自证：本席 body L43 列 project.md 为第 2 真源）。CLAUDE.md 纳入信息源清单并归 CompanyGovernanceRegistry 登记：支持——CLAUDE.md 是随宿主渲染的入口件且含路由口径，失管即失真。project.md/tricompany.md 是否移入 docs/：倾向与 ① 同规则处理（真源归 docs/，根留入口件），随其单独拿审一并裁。
- 修改建议：信息源优先级重排建议=tmv-whitepaper（新路径）→ docs/三元宇宙架构与模块说明.md → CLAUDE.md → tricompany-agent-roles.md → central-registry-closeout-workflow.md（⑦ 后新版）→ docs/registry/* → 模块本地件；project.md/tricompany.md 改写后按新身份回列。
- 验收锚：⑥ 完成后信息源清单零过时未注记条目；CLAUDE.md 在 CompanyGovernanceRegistry 有登记条目。

### 对 CEO ⑦ 的意见（主焦点·联审裁）：中央收口归属

- 意见：支持「COO 管理、CompanyGovernanceRegistry 执行」。本席交出中央收口路由首站权，保留两条边界线。
- 理由：现行 workflow（实读，lastSyncedAt 2026-06-03）定的是「COS 发起+总助总收口+BS 范围门禁」——总助中枢时代产物，文件本身已过时（其 §5.2 段内仍写 TriMC）。中央收口=治理流程权，按归属路由阀门本应归治理域；本席此前身兼商业真源席与收口流程首站二职属权限混装，⑦ 为拨正。
- 保留边界线（证伪性补充，防矫枉过正）：1) 本席保留「商业边界被调参与席」——收口对象涉模块边界/商业定位/实验范围时 COO 调本席出边界意见（承现行 workflow §5.2 范围门禁的业务半边）；2) 模块说明 §2/§4「模块边界长期变化先咨询 BusinessStrategy、中央口径更新前不得既成事实」两条前置线不动——那是商业真源权，非收口流程权。
- 修改建议：⑦ 定谳后由 CompanyGovernanceRegistry 主笔重写 central-registry-closeout-workflow.md（治理文档归其执行），本席配合出商业边界条款；本席 body「中央收口路由规则」节同步改「被调参与席」语义。
- 验收锚：workflow 新版明确 COO 管/CompanyGovernanceRegistry 执行/BS 被调参与三层；本席 body 收口节与新 workflow 零冲突；模块说明 §2/§4 前置条款原样在档。

### 对 CEO ⑧ 的意见：更新策略

- 意见：支持方向，切两层：事实层自动更新+边界层保留闸门。
- 理由：fade 管线已有 face 字段面路由，registry 事实回填（状态数字/模块事实同步）由模块管理 agent（如 tricompany.agent.md）经 fade 自动化合理且降人工挂账；但模块边界/商业定位若同走自动化，将架空模块说明 §4「先更新中央 BusinessStrategy 口径再改模块级 registry」护栏，边界漂移无人守门。
- 修改建议：本席「更新策略」节改为：事实回填由模块管理 agent 经 fade 自动更新；商业定位/模块边界变化仍须先经 BusinessStrategy 口径更新（联审或 CEO 裁），fade 自动更新禁触碰边界条款。
- 验收锚：body 更新策略节两层表述在档；模块说明 §4 护栏条款未被自动化条款覆盖。

### 自身定义证伪性审视（含 CEO 未点名项）

1. 硬伤（CEO 未点名，本席自报）：body L35「`Tride` 负责开发工具与 orchestration 底座」——与白皮书 §3.3.1/模块说明 §4 直接矛盾（TriCode=glue 适配层，orchestration 仅在 MC 层，CEO ⑤d 亦证）。本席 body 含错误架构断言，基于本席的模块边界回答会继承该错误。修订=删除并按 glue 口径重写 TriCode 句。
2. body L32「使用 TriMC 作为 agent runtime 与 interaction core 的标准名称」——TriMC 已消亡（⑤a），删。
3. body L33 赛博公司载体条——按 ④ 第 2 词拆裁：保留模块定位语义、去运行载体语义。
4. body L34「TriModel 宿主适配与切换配置层」——「宿主切换」属已死叙事（宿主整体替换仅在 M面，且 TriModel 管 Provider/Model 不管宿主），改「Provider/Model 统一配置层」；同条「不再把 Tride 写成切换后的正式宿主」随 Tride 消亡失去指涉，整句重写。
5. body L35 PC 端软件层条——TriCode glue 口径重写后可保留入口层语义；「Tride」名换「TriCode」。
6. body L36 shadow/copilot 宿主条——⑤e 已认，删。
7. body L37 切换阶段里程碑条——④ 第 5 词已裁，删，候 ⑤f 新里程碑命名。
8. contract.yaml 同源污染（本席自扩靶标证据）：runtime_baseline 两字段 host: copilot-host、tri_mc_status: planned 均过时（copilot-host 练兵场时代+TriMC 非 planned 而是已换轨）；② 拆件通过则合同件同步修。
9. 证伪后仍站得住的保留项：非人格化语气约束、不编造约束、business-state 先行校验、归属路由阀门、body L38 旧三主控名历史映射（历史兼容语义仍需要）。

### 缺口（待确认）

- tmv-whitepaper.md 全仓引用精确计数：本 spawn 无内容检索工具，证实 4 处引用面，扫数待补（建议并入 CompanyGovernanceRegistry 迁移动作）。
- ⑤f V1 里程碑命名：待 CEO 确认后入档。
- ⑦ workflow 重写主笔与时机：本席意见=CompanyGovernanceRegistry，待 COO/CAO 会签。
- body 行级重写稿：本件只出意见与验收锚不代写（批前零执行约束）；重写稿候组审裁定后由 body 真源 owner 出。

——BS spawn 签发，2026-09-10 深夜（本 spawn 无 shell 工具未做 date 现查，时点据派工窗 23:38–00:09+0800 推定，精确分钟待确认）

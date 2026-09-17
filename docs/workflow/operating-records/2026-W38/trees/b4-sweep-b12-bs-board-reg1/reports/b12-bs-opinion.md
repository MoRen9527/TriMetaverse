# B4-sweep-b12 五席联审·BS 席独立意见件

- 席位：BusinessStrategy（BS，spawn 型出席；BOD 2026-09-16 裁定 BS 系非人格 registry agent、spawn 合规）
- 时点：2026-09-17T13:10Z（date 现查）
- 程序位：审·零改动（唯一写盘=本意见件；不 commit，提交归编排层）
- 独立性声明：本件为 BS 席独立出具。遵守读面压缩二级令——未读任何既往批次意见件/汇总件（含自家既往稿）；跨批基线仅按任务书所列族名对表，命中族只列族名+一句话。未采信任何其他席位的移交内容。
- 席位焦点：board 域定性首勘（本职）；商业定位与白皮书口径一致性；模块商业边界与商业侧名址；中央收口路由边界。
- 依据链：`docs/workflow/operating-records/2026-W38/task-charter-20260916-msg-resume.md` 任务2；D-27 树协议；联审工作流 V0.2；批号=B4-sweep-b12。
- 读面实测：三组 20 件全读，wc -l 逐件入下表；合计 1127 行（business-strategy 余 2 件 94 行 + board 全 3 件 86 行 + registries 字母序首 15 件 947 行，末件=TrideploymentCodeRegistry，与任务书端点一致）。

## 一、表态总表（20 件全量表态）

| # | 文件 | 行数 | 意见摘要 | 级别 |
|---|------|-----|---------|------|
| 1 | business-strategy/agent-frontmatter.agent.md | 7 | 投影制正样：description 与 contract identity.description 逐字一致，投影注记+禁独立编辑声明在位。 | PASS |
| 2 | business-strategy/business-strategy.contract.yaml | 87 | LG-034 切片1 换代正样（runtime_baseline 新字段+实然/应然注释与正文基线一致）；白皮书一致性核查职责、二分更新策略、forbidden 界面完备。一项叠床见重点意见3（approve[2] 措辞）。 | 建议 |
| 3 | board/agent-body.agent.md | 25 | 治理席定位、权柄四表摘要、记录义务自洽；三处小瑕：①"机器可读投影"与 contract"契约面"措辞未归一 ②摘要"必升 CEO：宿主切换"未携带 TriModel 规则内免批 carve-out，有误路由风险 ③"compass 手册"指针无实路径（自声明随手册发布更新，悬空为已知待定项；实测 .claude/compass 在位、compass-rename-plan.md 在档）。 | 建议 |
| 4 | board/agent-frontmatter.agent.md | 5 | description 与 contract identity.description 文本裂隙（适用场景式 vs 契约面定义式），且无投影注记；board 自称"照 BusinessStrategy 先例"，定稿时须落投影制。 | 建议 |
| 5 | board/board.contract.yaml | 56 | 定性首勘正样见重点意见1。初稿 D1 候 CEO 审姿态正确；权柄四表完备、例外三通道与禁区自洽、supervises=[] 不破坏员工组织图。候裁项：family=Registry 语义、version 3.0→3.1+interfaces 新增节（契约 schema 治理域，已正确自冻结候审）。 | 建议 |
| 6 | registries/CompanyGovernanceRegistry.agent.md | 72 | 收口口径、发布链纪律（source→support→binding→live→manifest→governance）、CHO/CAO 边界完备。名址失配实测：信息源 #2 `cyber-company.md` 全域无此件（现行=tricompany.md 系）；#3 `cyber-company-agent-roles.md` 无此件（现行=docs/workflow/tricompany-agent-roles.md，在位）。 | 建议 |
| 7 | registries/TriavatarBusinessStrategyRegistry.agent.md | 64 | 前台入口/与 Tristaciss 前后端分工、平台控制面排除约束，与中央商业口径一致。 | PASS |
| 8 | registries/TriavatarCodeRegistry.agent.md | 59 | 约束第1条反引号黏连（"`Triavatar`BusinessStrategyRegistry"）；默认输出结构缺"缺口"节（模板漂移）。 | 建议 |
| 9 | registries/TriavatarProductRegistry.agent.md | 58 | 同上两条（反引号黏连+缺缺口节）。 | 建议 |
| 10 | registries/TriChainBusinessStrategyRegistry.agent.md | 61 | "公链预留、不写成现役成熟公链"与中央商业口径一致。 | PASS |
| 11 | registries/TriChainCodeRegistry.agent.md | 56 | 反引号黏连+缺缺口节（模板族共性问题）。 | 建议 |
| 12 | registries/TriChainProductRegistry.agent.md | 56 | 反引号黏连+缺缺口节。 | 建议 |
| 13 | registries/TriCompany.agent.md | 111 | 同步链总控职责、同步范围表、manifest 纪律完备；禁止双活实测满足（TriMetaverse/.github/agents/ 无同名件）。反向命中 runtime_baseline 换代窗：职责6/约束"未来 Claude Code / TriMC 正式宿主适配""不得宣称已支持 Claude Code"停留旧宿主叙事——见重点意见2。 | 建议 |
| 14 | registries/TriCompanyBusinessStrategyRegistry.agent.md | 63 | "不写成中央战略仓或正式运行宿主"+经营编排孵化定位，与白皮书"TriCompany=商业实验组织形态"口径一致。 | PASS |
| 15 | registries/TriCompanyCodeRegistry.agent.md | 53 | 缺"中央收口返回口径"节（同批模块 registry 均有，TriCompany 侧两件均缺）；信息源引 cyber-company-secretariat.md（实测在位，属历史名沿用非死链）；owner 人格名（小狄）入无人格件可容（owner 参照）。 | 建议 |
| 16 | registries/TriCompanyProductRegistry.agent.md | 48 | 同缺"中央收口返回口径"节。 | 建议 |
| 17 | registries/TrideBusinessStrategyRegistry.agent.md | 62 | E2 命名族命中（原名 Tride 保留）；实测 sg 机无 `/srv/fleet/Tride/`（TriCode 在位），`../../Tride/*` 相对路径在本机为死链（dev 机在位性未测，待确认）。不重裁，按已裁方案回填。 | 建议 |
| 18 | registries/TrideCodeRegistry.agent.md | 63 | 同上死链项；另信息源把 `TriMetaverse/BusinessStrategy` 列 #7（其余件均列 #1），模板漂移。 | 建议 |
| 19 | registries/TrideploymentBusinessStrategyRegistry.agent.md | 62 | BS 焦点发现：以"部署、发布与 GitOps 友好交付模块"叙述商业作用，缺模块级定位降格约束——见重点意见4。实测 sg 机无 `/srv/fleet/Trideployment/`，路径死链同族。 | 建议 |
| 20 | registries/TrideploymentCodeRegistry.agent.md | 59 | 反引号黏连+死路径同族。 | 建议 |

分布：PASS 4 / 建议 16 / 挂起 0（建议中低危模板类 9 件、名址/换代/定位类 7 件）。

## 二、跨批基线命中族清单（仅族名+一句话）

- runtime_baseline 换代窗：business-strategy.contract.yaml 为换代正样（LG-034 切片1 注记）；TriCompany.agent.md 为反向命中（"未来 Claude Code/TriMC 宿主"旧叙事未换代）。
- description 投影制：business-strategy 前 2 件为投影制正样；board 前 2 件为反向命中（frontmatter/body description 与 contract identity.description 裂隙、无投影注记）。
- E2 命名（fact-backfill 案已裁）：Tride*Registry 2 件保留原名+registries 组整体单件 .agent.md 形态，均属已裁范畴，本批只对表不改判。
- execution 悬空标注群+反向撤注群：board agent-body"见 compass 手册"无实路径，为自声明待发布的悬空指针形态。
- P2 paths 群：business-strategy.contract.yaml 与 board.contract.yaml 的 `paths:` 节同为相对路径形制，归同族。
- 合并件群：本批 20 件未见确证命中。
- 名址精度群：CGR 两条 cyber-company 旧名址（全域无此件）、Tride/Trideployment 死路径（sg 实测）、TriMC 旧名未映射（TriCompany.agent.md）、Board 与 2026-05-22 已退役 board-oversight 名号复用需发布时勘界、bod/COS 等会话名号未附全称。

## 三、重点意见

### 1. board 域定性首勘（BS 焦点本职）

**定性判定**：board 域=治理席契约面——CEO 直连会话（bod）的机器可读投影，审批权唯一持有面+发令/验收/升级终审面。不是：①第 14 员工（reports_to CEO、peers/supervises 皆空，明确在 13 员工体系之外、之上）；②registry 数据中枢（无事实登记职能）；③独立"董事会代理"主体（权柄全部来自 CEO 常驻授权令，contract approve 注释自证）。

**边界判定**：
- 与 13 员工体系：对 COS/COO 仅流转与验收关系、非行政隶属（supervises=[]），禁区"以监督为名替 COO/员工席做专业判断"——不破坏员工组织图，自洽。
- 与 BusinessStrategy：board 持联审席位通道与升级终审，BS=商业边界被调参与席（spawn 型）；board 不做专业判断、BS 不做审批，无重叠。残余叠床见重点意见3。
- 与 CompanyGovernanceRegistry：CGR=治理制度/岗位边界/登记收口（数据面），board=审批/发令/验收（权柄面），分立清晰。缺口：board 域在 CGR `company-governance-state.md` 的登记位与双宿主发布位未定义（见候裁 e）。
- 与白皮书口径：board 3 件为纯治理机制文本，不含商业表述，与白皮书无冲突点。但 board 成文化属 TriCompany 商业实验组织形态的事实演进（白皮书/中央摘要载 13 员工口径），是否需补"board≠员工"注记归产品面核对，本批不代裁（见候裁 f）。

**佐证读数**：manifest 已为 board 建源→target 登记（kind=`registry-or-governance-agent`，target=`TriMetaverse/.github/agents/board.agent.md`，当前 target 位未落文件）——manifest 自身亦在 registry/governance 之间并列表述，印证 family 定名未定谳。

**理由**：BS 对模块边界与组织形态负有解释与一致性核查职责，board 域为原清单外新出现域，首勘归属本席。
**修改建议**：不改动（程序位=审）；定性结论随本件入联审，供 CEO 审 contract 时引用。
**验收锚**：board.contract.yaml 经 CEO 审定谳 family 归属与 schema 版本；CGR 登记位落档；发布收口时 Board 与退役 board-oversight 名号勘界留痕。

### 2. TriCompany.agent.md 宿主叙事换代（建议·中危）

**意见**：职责6"预留 host_adapter 接口用于未来 Claude Code / TriMC 正式宿主适配"与约束"不得宣称已支持 Claude Code 或 TriMC 正式宿主"停留在"Copilot-host 现役+Claude Code 未来"的旧宿主叙事。
**理由**：与 runtime_baseline 换代窗口径相悖——M 面 runtime=claude-code-runtime 已是实然·现役（business-strategy.contract.yaml runtime_baseline 正样可对照）；TriMC 为历史名（2026-09 改名 TriMMC），作"未来宿主"引用属名址+时态双误。该件是源侧→发布侧同步总控，宿主叙事失真会向发布链下游传播。
**修改建议**：按换代口径改写两条——Claude Code 改实然现役表述（或按发布工具链实际能力限定"发布链自动化同步面"与"运行时宿主"两个概念再表述）；TriMC 改 TriMMC 并加历史名映射注记；"Phase 1 仅 Copilot-host"限定到同步工具链能力，不外溢为宿主全景叙事。
**验收锚**：改写后与 business-strategy.contract.yaml runtime_baseline 四字段（m_plane/r_plane/service_domain/local_domain）逐项不冲突；历史名带【历史】类标注。

### 3. business-strategy.contract.yaml approve[2] 措辞收敛（建议·中危）

**意见**：decision_rights.approve 第3条"中央边界裁决（当模块级 business-state.md 与中央冲突时）"与同件 responsibilities"本席=商业边界被调参与席"、io_contract.outputs.boundary_verdict"CENTRAL_REGISTRY_CLOSEOUT 场景的参与范围裁定"存在叠床，且与 board 契约的"升级裁决终审"潜在越位混淆。
**理由**：BS 在中央收口的路由职责是判范围与边界（是否需要中央裁决、哪些 registry 参与），不是终审裁决主体；终审归 board/CEO 链。现措辞可被误读为商业席持终审权。
**修改建议**：approve[2] 收敛为"中央边界裁决的参与范围裁定（判是否需要裁决与哪些 registry 参与）"，或加受限语义注记与 boundary_verdict 对齐。
**验收锚**：approve 列表内无与 responsibilities/forbidden（"代替模块 registry 输出逐项事实"禁令同理延伸）相抵的措辞；与 board.contract.yaml escalate 终审项无语义重叠。

### 4. TrideploymentBusinessStrategyRegistry 定位降格约束补齐（建议·中危，BS 口径）

**意见**：该件以"部署、发布与 GitOps 友好交付模块的商业作用""上线阶段边界"叙述，属现役商业模块口径；中央现行口径为 Trideployment 仅作兼容资料入口。
**理由**：现约束仅"不把未生成或未验证的部署资产写成现役交付件"（资产层防编造），无模块级定位约束，存在把兼容资料入口升格为现役交付主线的表述风险；且实测 sg 机无 `/srv/fleet/Trideployment/` 目录。
**修改建议**：补一条模块级约束（如"Trideployment 定位=兼容资料入口，不作现役交付主线表述"），或在其 business-state.md 落降格注记后由本件引用；回填走事实回填 fade 链。
**验收锚**：约束段含模块级定位降格条目，与中央商业口径对表一致。

### 5. CompanyGovernanceRegistry 旧名址映射（建议·中危）

**意见**：信息源 #2 `cyber-company.md`、#3 `docs/workflow/cyber-company-agent-roles.md` 全域实测无此两件。
**理由**：现行真源=tricompany.md（源侧 `TriCompany/tricompany.md`+中央摘要 `TriMetaverse/docs/tricompany.md`）与 `TriMetaverse/docs/workflow/tricompany-agent-roles.md`（在位）；CGR 为收口登记执行席，其信息源首列失址会放大全链名址漂移。
**修改建议**：两条改指现行名址；cyber-company-secretariat.md（实测在位）可保留但建议加历史名注记。
**验收锚**：信息源优先级列表逐条可解析到在位文件。

## 四、挂起与候裁清单

**三红线核查**（①越权改写真源/裁决面绕明示门 ②编造事实/进度/市场架构结论 ③破坏中央边界或收口路由）：20 件逐一过表，命中 0 件——挂起 0。

**候裁清单**（均不属本审代裁范围）：
- a) board family=Registry 语义扩容（非人格技术形态族）vs 另立 Governance 族——契约 schema 治理域，contract 已自冻结，候 CEO 审定谳。
- b) board contract version 3.0→3.1 + `interfaces:` 新增节——同属 schema 治理域，候 CEO 审与 a) 一并定谳。
- c) TriCompany.agent.md 宿主叙事改写窗（重点意见2）——技术口径候 CTO 主签、商业口径 BS 附签，走裁决面人工明示门。
- d) Tride*/Trideployment* 原名与死路径回填——E2 fact-backfill 已裁方案的执行回填，归模块管理 agent fade 事实回填链，本批不改判。
- e) board 域在 CGR `company-governance-state.md` 登记位与双宿主发布位（.claude/agents/、.github/agents/ 是否收录 board；Board 与退役 board-oversight 名号勘界）——候 CGR 收口路由定。
- f) 白皮书/docs/tricompany.md 是否为 board 域补"治理席≠员工"组织形态注记——候产品面核对，BS 配合。
- g) registries 组模板族共性回填（反引号黏连 5 处、缺"缺口"节/缺"中央收口返回口径"节、信息源首位漂移 1 处）——低危事实回填，归 fade 链批量处理。

（本件完；BS 席零改动，唯一写盘=本件。）

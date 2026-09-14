# BB-1 COS 席独立意见（B3/B4 打样批联审）

> 席位=COS（spawn 代理出席——COS 无 sg 常驻席，发现已回报；夜航打样批）·时点 2026-09-14
> 程序位=审（零改动）·独立性=未读 reports/ 下其他席意见件（bb1-cto/cao/cpo/bs 四件未开启）
> 依据链=任务书 20260914-夜航01 任务3；D-27（`TriCompany/docs/workflow/engineering-disciplines.md`，候 CTO 会签注记在册）；LG-034 晨报 L49；联审工作流 V0.2
> 实勘注记：① claude-md 真源实读 106 物理行，与派工令靶标「105 行」差 1——疑 wc -l 尾行无换行口径差，如实标注不裁断；agents-md 真源 88 行吻合。② 本席无独立时钟工具，时点承派工令口径未二次现查（D-04 如实标注）。③ 审计根（D-14）=/srv/fleet/TriMetaverse 与 /srv/fleet/TriCompany；行号=2026-09-14 实读快照，「现势」判语均以本时点实读文件为锚。

## 表态总表（20 件）

| # | 文件 | 意见摘要 | 级别 |
| --- | --- | --- | --- |
| 1 | project-sources/trimetaverse-claude-md.md | 真源-活体内容一致（FADE-002 头注在位）；L60 定性修正如意（见特别登记面）；L103/L104「## File Conventions」标题前缺空行（MD022，markdownlint 自律面自违）；跨机路由节与布局节缺现势注（重点1） | 建议 |
| 2 | project-sources/trimetaverse-agents-md.md | 机器级规则 L74-75 键名系 D-13 v2 已退役名（重点2）；L88 instructions 引用跨仓无路径（重点2）；L17/L25 无路径引用实为 TMV 仓库根文件；L20 命名拼写与 L29 宪法不一致；路由优先序与 CLAUDE.md 一致 ✓ | 建议 |
| 3 | cto/soul.agent.md | 无意见——层契约齐（不载构建现势/验证读数）；D-15 与门禁哲学入当前原则，与气质相容 | PASS |
| 4 | cto/memory.agent.md | 无意见——落点实勘在册（engineering DESIGN/STATE/ROADMAP，2026-09-14 glob ✓）；「运行态不入身份层」清晰 | PASS |
| 5 | cto/colleagues.agent.md | 无意见——FD/ST 枢纽与 D-15 一致；括注目录名与 D-13 v2 勘误后一致。备查：contract peers 列 COS 而本件无 COS 协作行，轻微不对称随下次增量对表 | PASS |
| 6 | cto/social.agent.md | 无意见——「未过门禁不称已交付」对外表述规则清晰 | PASS |
| 7 | cto/agent-body.agent.md | L8-9 节头后双空行（MD012）；核心职责 6 条与 flat 7 条之差归挂起 G2 关联注记 | 建议 |
| 8 | cto/agent-frontmatter.agent.md | 空件（仅 --- 对）——两席同款=系统性形态而非孤例，归挂起 G1 | 挂起候裁 |
| 9 | cto/session-body.agent.md | 无意见——D 类域知识族首例齐备，自注「完整化随 LG-024 批 1 管线窗」如实。备查：命令族 Windows 形态，跨机执行按 D-24 机位断言自理，非本件缺陷 | PASS |
| 10 | cto/chief-technology-officer.agent.md | 核心职责第 7 条（CodeGraph）flat 有而 agent-body 无——组装源不明（手改派生面嫌疑 vs 注入常量未在册），归挂起 G2；双空行同 #7 | 挂起候裁 |
| 11 | cto/chief-technology-officer.contract.yaml | 三类共病（重点3）：runtime_baseline 段越层陈旧；io_contract business-strategy-state.md 仓根歧义；supervises=[] 与 colleagues「监督四员」冲突。execute scope `TriMC/src` 旧名=兼容面过渡口径（CLAUDE.md L28 同律），注记不列改 | 建议 |
| 12 | cao/soul.agent.md | 「名字：待命名」与 social「工作名：小行（CEO 正式命名，2026-08-01）」同席冲突，且 D-13 宪法表 CAO 别名=候补录（空缺）——三面不一，归挂起 G3 | 挂起候裁 |
| 13 | cao/memory.agent.md | L19 行政流程记录落点 `TriCompany/docs/execution/administrative-records/` 实盘不存在（两方法实勘 2026-09-14 零命中：execution 顶层清单+全仓 glob）=失联指针（D-18）；治理真源 TMV 侧 company-governance-state.md 副本实勘在册 ✓ | 建议 |
| 14 | cao/colleagues.agent.md | 无意见——CHO 边界/COS 协同/汇报线与 contract reports_to: CEO 一致 | PASS |
| 15 | cao/social.agent.md | 「工作名：小行」同 G3 案 | 挂起候裁 |
| 16 | cao/agent-body.agent.md | L126-127 双空行（MD012）；认知分层约束尾置段与 flat 去重形态归 G2 关联 | 建议 |
| 17 | cao/agent-frontmatter.agent.md | 空件同款，归 G1 | 挂起候裁 |
| 18 | cao/session-body.agent.md | 无意见——LG-024 前置增量收编形态清晰、指针两要素（目标面正名+真源路径）齐。备查：L5「15 席正名全表」与 D-13 标题「14 席」数字差系 BL 增设（2026-09-02）后纪律册标题未追平，非本件缺陷，候 CAO 纪律册维护窗顺手勘 | PASS |
| 19 | cao/chief-administrative-officer.agent.md | 与 CTO flat 不同构：缺开场 intro 段（含 binding-profile 指针句，CTO flat L7-11 有），归 G2 关联；L126-128 连续空行（MD012） | 建议 |
| 20 | cao/chief-administrative-officer.contract.yaml | runtime_baseline 越层陈旧同 CTO（重点3）；display_name「待命名」同 G3 关联；supervises=[CompanyGovernanceRegistry] 与 colleagues 未述监督关系——轻微不对称注记 | 建议 |

分布：PASS 7／建议 8／挂起候裁 5。

## 重点意见（5 条）

### 重点1｜CLAUDE.md 入口编排消费面三处小修（靶 #1）

- **意见**：① L60 定性修正如意（展开见特别登记面）；② 真源 L103→L104「## File Conventions」标题前缺空行；③ 跨机操作路由（M 面）节与 Module Workspace Layout 节缺现势注。
- **理由**：② 本文件自身把 markdownlint 立为 CAO 纪律册附录（D-16 迁入件真源），发布面自带 MD022 形态=自律面自违；③ D-24 三犯案实证跨机机位漂移是高频事故源——跨机节是编排入口唯一跨机路由条款，而现势是 sg 执行面=MMC 值席拾取（夜航01 任务书 face 行实录；m-duty-cos 名址在册〔D-13 前缀律〕但 sg 席位矩阵无 COS 常驻席实证），布局节又只呈现 dev 机 `D:/Code/ai/` 单机布局（本会话实勘 sg 机=/srv/fleet/ 兄弟目录）——后来 agent 消费需二次考古，且无现查锚。
- **修改建议**：真源 L60 按特别登记面文案改；L104 前补空行；跨机节末补现势注一行（值班位执行体现势=MMC 值席拾取，m-duty-cos 预留位）；布局节代码块后补多机注一行（各机工作区根不同：dev 机 D:/Code/ai/、sg 机 /srv/fleet/，跨机引用先 hostname 断言〔D-24〕）。
- **验收锚**：真源改后走 FADE-002 发布；机械判据（活体 CLAUDE.md）：`grep -c "design document"`=0；`grep -c "/srv/fleet"`≥1；「## File Conventions」前一行为空行；markdownlint 全绿。

### 重点2｜AGENTS.md 机器级规则三处引用/命名残差（靶 #2）

- **意见**：① 机器级规则 L74-75 路由键名 `FullStackDeveloper`/`TestEngineer` 系 D-13 v2 勘误（2026-09-03）退役名，现役 spawn 名=FSD/SeniorTestEngineer；② L88 `ceo-chief-of-staff.instructions.md` 无路径——实勘唯一定位在 `TriCompany/.github/instructions/`（TMV 全仓零命中，2026-09-14），TMV 语境直接消费失败；③ L17 `arch-storage-migration.md`、L25 `github-app-copilot-rollout-v1.md` 无路径（实勘均在 TMV 仓库根，非 docs/）；④ L20「Business Strategy Registry」拼写与 L29 `<Module>BusinessStrategyRegistry` 命名宪法不一致。
- **理由**：① 机器规则按节点 agent 字段自动调用（L71），键名过期→匹配失败走 fallback CEOChiefOfStaff（L77）——静默改道编排枢纽，是编排面最忌的无声降级（D-22「启用而错转」同族）；②③④ AGENTS.md 是 Copilot CLI 默认 agent 第一消费入口，无路径引用违 D-14 审计根声明精神，每次消费重付定位成本且易复制错根结论。
- **修改建议**：① 键名改 FSD/SeniorTestEngineer（与树数据现役值对表后定，必要时加大小写不敏感匹配注记）；② 补全 `../TriCompany/.github/instructions/ceo-chief-of-staff.instructions.md`；③ 补「仓库根」限定或相对路径；④ 统一为 `BusinessStrategyRegistry`。
- **验收锚**：真源改后 FADE-002 发布；机械判据（活体 AGENTS.md）：`grep -n "FullStackDeveloper|TestEngineer"` 仅历史注记或 0；instructions 引用行含 `../TriCompany/.github/instructions/` 前缀；两件无路径引用行含根限定词；L20 与 L29 拼写同串。

### 重点3｜contract v3 面三类共病，两席同款（靶 #11/#20）

- **意见**：① 两 contract 的 `runtime_baseline` 段（host: copilot-host／tri_mc_status: planned）与五件套层契约「宿主阶段事实由 binding profile 承载，不入源侧五件套」自相矛盾，且读数陈旧（现势=M 面 claude code runtime 实然现役、TriMMC 现役，tricompany.md §3 V1.1 实读）；② CTO contract io_contract source `docs/registry/business-strategy-state.md` 仓根歧义——TriCompany/docs/registry 实存 business-state.md（glob 2026-09-14），同名件仅 TMV 侧在册；③ CTO contract `supervises: []` 与 CTO colleagues「监督四员（小全/小柯/小吴/小布）」直接冲突（D-15 分派枢纽亦支撑监督关系在册）。
- **理由**：contract=信息真源（D-07 三层语义），真源内陈旧断言+层界自违会让「以 contract 对表」的审计动作得出反向结论；③ 类冲突=「真源打真源」，消费方无所适从，联审制度最忌。
- **修改建议**：① runtime_baseline 段删除或整体移交 binding profile（候结构标准 §3.2 对表定夺，语义变更走完整通道）；② source 补显式仓根（中央实验边界语义→`../TriMetaverse/docs/registry/business-strategy-state.md` 更贴合，候 CTO 定）或改指 TriCompany 侧 `docs/registry/business-state.md`；③ supervises 按 colleagues 对表补四员，或改枢纽语义注记与 D-15 同构。
- **验收锚**：`grep -c "runtime_baseline" source-agents/{chief-technology-officer,chief-administrative-officer}/*.contract.yaml`=0（或段内字段与 binding-profiles 现役值全等）；business-strategy 指针含显式仓根；CTO supervises 与 colleagues 管理关系清单逐员一致；改动走 `source_publish_check --publish-agents` hash 过。

### 重点4｜结构标准 §3.2 对表三项挂起：G1 空件／G2 组装差异（靶 #8/#10/#17/#19 关联）

- **意见**：三现象合并挂起候裁——G1：agent-frontmatter.agent.md 空件两席同款；G2：CTO flat 核心职责第 7 条（CodeGraph）在 flat 有、agent-body 无，组装源不明；G3'：CAO flat 缺 CTO flat 的开场 intro 段（L7-11 含 binding-profile 指针句）。
- **理由**：九件套结构系 B1 批新立（结构标准 §3.2，TriCompany 3dd9630），首批回归联审正应把「预期形态」钉死；三现象既可能是设计行为（frontmatter 单源化 contract／CodeGraph 系注入常量／intro 按 host 差异化），也可能是漂移（手改派生面违 D-16）——不裁定，后续 B4+ 约 136 件会把同一含糊复制放大。
- **修改建议**：候 CTO 席/结构标准 owner 出对表结论：G1 空件=占位预期还是缺陷；G2 第 7 条出处（常量注入在册化，或补入 agent-body）；G3' intro 是否组装强制项。裁定后源侧补齐+管线再生，派生面禁手改。
- **验收锚**：对表结论落档（`TriCompany/docs/engineering/agent-contract-v3-spec.md` 或 §3.2 增补）；`source_publish_check --publish-agents` 后 .claude/.github 两面与源侧 hash 一致；本批 18 件逐件「实存形态=对表预期形态」核对表零豁免。

### 重点5｜CAO 工作名三面不一（靶 #12/#15/#20 关联）

- **意见**：CAO soul「名字：待命名」+ contract display_name「待命名」vs social「工作名：小行（CEO 正式命名，2026-08-01）」vs D-13 宪法表「CAO 别名候补录（空缺候补）」——三处两种答案。
- **理由**：D-13 是 CEO 亲定命名宪法，别名入表=唯一合法名址登记位；social 单方记载 CEO 命名而宪法表空缺——要么 social 虚记（D-18 幻影真源形态），要么宪法表漏登（登记欠账），两者都必须清态；名址不清直接侵蚀 D-13 第 1 条「发件前 ListAgents 对名址」防伪链。
- **修改建议**：候 CEO 定谳「小行」命名存废（正式命名权=CEO 保留权面）；存则 D-13 宪法表 CAO 行补别名+soul/contract display_name 追平「小行」；废则 social 勘误+三面维持待命名。
- **验收锚**：D-13 宪法表 CAO 行、soul 名字字段、social 工作名字段、contract display_name 四处同值（「小行」或「待命名」二选一）；`grep -rn "小行" TriCompany/source-agents/chief-administrative-officer/` 与宪法表对表零矛盾。

## 特别登记面意见

- **事项**：CLAUDE.md:60「`docs/tricompany.md` — TriCompany design document」定性修正为「TriCompany 中央摘要（宪章真源=TriCompany/tricompany.md）」。
- **本席意见**：**同意，支持 rides B3 批执行。**
- **理由**：现势实读（2026-09-14，`/srv/fleet/TriMetaverse/docs/tricompany.md`）——该件自题「TriCompany 赛博公司中央摘要」V1.1，元信息双身份明载「宪章真源=../TriCompany/tricompany.md（V1.0，2026-08-01 生效）」，与拟改文案逐要素吻合；「design document」系 B2 迁移前旧态残差。宪章真源落点实勘在册：`/srv/fleet/TriCompany/tricompany.md`（repo 根，glob 命中）。
- **修改建议**：采纳拟议文案；建议指针形式与该摘要件 §1「真源分工」第 2 条同构（`../TriCompany/tricompany.md`），并与 FADE-002「tricompany-central-summary 条目 target 未随迁」候修项同窗过管线（同域一次发布窗，省一次渲染）。
- **验收锚**：真源改后 FADE-002 发布；活体 CLAUDE.md L60 含「中央摘要」与「TriCompany/tricompany.md」、不含「design document」（grep 判据）；与 docs/tricompany.md 头部双身份表述零冲突。
- **边界注记**：tricompany.md 附录外移/拆出（LG-034 挂起③）与本条无关，不动。

## 挂起与候裁清单

| 编号 | 事项 | 级别 | 候裁方 |
| --- | --- | --- | --- |
| G1 | agent-frontmatter.agent.md 空件两件（CTO/CAO） | 挂起候裁 | CTO 席/结构标准 §3.2 owner |
| G2 | flat 组装差异三项（CTO 第 7 条出处／CAO 缺 intro／源侧空行批量 MD012） | 挂起候裁 | CTO 席（管线组装规则） |
| G3 | CAO 工作名三面不一（soul/contract「待命名」vs social「小行」vs D-13 候补录） | **候 CEO**（命名存废=保留权面）→CAO/CHO 执行勘误 | CEO 定谳后单侧勘误 |
| G4 | contract runtime_baseline 段越层陈旧两件（删或移交 binding profile） | 挂起候裁 | 结构标准 owner+CTO/CAO |

- 红线①分歧项：G1/G2/G4 挂起候裁如上；红线②保留权事项：仅 G3 候 CEO，本批无其他新增保留权事项；红线③历史冻结/附录豁免：本批 20 件未触发豁免条款。
- 时点差如实标注：CLAUDE.md L69「(primary)」与 tricompany.md §3 现势口径（「两宿主位均为发布拷贝／write master 旧概念退役」，CEO 2026-09-11 晨报裁定追平——晨报 04:52 版曾列候裁，终审后已追平）语义兼容，无需再裁；可选小修把「(primary)」对齐「主力运行位（发布拷贝）」措辞。
- 备查（不属本批 20 件）：① LG-034 挂起④ 2 lowercase 孤儿件实勘仍在盘（.github/agents/ 下 company-governance-registry.agent.md、tri-metaverse-code-registry.agent.md 与 PascalCase 版并存，2026-09-14 glob），冻结维持候裁；② AGENTS.md L65 指针目标 ceo-chief-of-staff-maintenance-rules.md 在册 ✓，其 L12「live discovery=.github/agents」口径早于 .claude 主力位现势，候维护窗追平。

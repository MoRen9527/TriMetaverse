# B4 扫尾批1 五席联审 · CTO 席意见书（靶标=CPO source-agents 全 9 件）

- **席位**：CTO 小狄（chief-technology-officer）
- **date 现查**：2026-09-16T21:21:41+0800（会话开工现查，本席工作段内）
- **批号**：B4-sweep-b1
- **程序位**：审零改动（仅读靶标 + 写本席意见书，未触碰靶标目录任何文件）
- **M4 零改动声明**：本席对联审靶标 `/srv/fleet/TriCompany/source-agents/chief-product-officer/` 全 9 件零创建、零修改、零删除；本报告为唯一写入物。
- **独立性声明**：未读 reports/ 下任何他席稿，席间零交换；下表全部意见为 CTO 席独立表态。核验范围仅限公共结构面（binding profile、registry 真源、compass 手册）存在性核查，不含他席产出物。
- **依据链**：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律（分歧挂起候裁清单化 / 保留权候 CEO / 冻结件豁免标注）。

---

## 一、表态总表

| # | 文件 | 级别 | 意见摘要 |
|---|---|---|---|
| 1 | agent-frontmatter.agent.md | PASS | 三字段与 agent-body 同文，与 contract identity 一致，无意见 |
| 2 | agent-body.agent.md | PASS | 现役渲染源结构完整；五裁①落格在位；compass 指针经实锚验证不悬空 |
| 3 | chief-product-officer.agent.md（退役件） | 建议 | 退役标注缺退役批次/日期，可追溯性弱化；快照内容停旧版属退役语义 |
| 4 | chief-product-officer.contract.yaml | **挂起**+建议 | 挂起：io_contract source 指向 business-strategy-state.md 于 TriCompany 基座悬空（真源归属候裁）；建议：paths 六件与目录 9 件覆盖差、runtime_baseline.host 单值 vs 双宿主现势 |
| 5 | colleagues.agent.md | PASS | 与 CTO 席协作关系对称自洽，层契约清晰，无意见 |
| 6 | memory.agent.md | 建议 | 运行资产落点节 runtime cognition 私域条目双行重复且措辞不一 |
| 7 | session-body.agent.md | **挂起**+建议 | 挂起：真源指针族明写 TriCompany 前缀指向不存在的 business-strategy-state.md（与件4同根因）；建议：内联开工前置核查清单缺镜像真源注记（全席共性） |
| 8 | social.agent.md | PASS | 结构干净，命名历史有据，无意见 |
| 9 | soul.agent.md | PASS | 覆盖层复写节与 agent-body 同文属设计行为；逐节比对无漂移 |

**分布读数**：9 件 = PASS 5 · 建议 3（件 3/4/6，其中件 4 并挂起）· 挂起 1 项（同根因跨件 4/7，已清单化候裁）。

---

## 二、逐件意见详表

### 件1 · agent-frontmatter.agent.md — PASS

无意见。`name`/`description`/`user-invocable` 三字段与 agent-body 头部 frontmatter 逐字一致，`description` 触发词面（MVP 定义/产品优先级/版本规划/商业化路径）与 contract.yaml `identity.description` 同族。

### 件2 · agent-body.agent.md — PASS

现役渲染源（manifest 切源件），15 节结构完整。要点核验：

- 「中央收口路由」含 2026-09-11 CEO 晨报五裁①「产品域收口职责落格」段，与件6 memory「产品域收口记忆」、收口工作流 V0.2 表述同族，无版本差。
- 「固定前置核查」已指针化至 compass 手册——本席实锚验证：`TriMetaverse/.claude/compass/chief-product-officer.session.md` 存在且含 `## 开工前置核查` 节（L157），指针不悬空。
- 与 CTO 席接口（「共同形成产品范围、交付路径和质量门禁的最小闭环」「技术可行性争议与 CTO 联合裁决，无法一致升级 CEOChiefOfStaff」）与本席 agent-body 对称，双向无矛盾。

无修改建议。

### 件3 · chief-product-officer.agent.md（退役件）— 建议

**理由**：头部退役标注（「本件已退役出渲染链；真源=同目录 agent-body.agent.md（D1b manifest 已切源）」）已具备替代件指向，但缺退役动作的批次/日期标注。快照正文停在旧版（无五裁①落格段、前置核查为全量内联旧形态），属退役快照语义可接受；但后续溯源者无法从件内判断「停在哪一版、何时退役」。

**修改建议**：退役标注行内补退役批次/日期（如「retired 批次号/日期，D1b manifest 切源」）。属标注补强，非内容改动。

**验收锚**：件内退役标注含可追溯批次或日期字段；含替代件指向（已有，保持）。

### 件4 · chief-product-officer.contract.yaml — 挂起 + 建议

**挂起项（候裁清单见第三节 C-1）**：`io_contract.inputs` 中 `business_strategy.source: docs/registry/business-strategy-state.md`——同族条目 `product_registry.source`/`code_registry.source` 在 `TriCompany/docs/registry/` 基座下均实存，唯此条在 TriCompany 仓不存在；`business-strategy-state.md` 实存于 `TriMetaverse/docs/registry/`。仓库前缀错置或基座混用，二选一需真源归属裁决，非 CTO 联审单席可定。

**建议项 ①（paths 覆盖差）**：`paths` 注册六件套（soul/agent_body/agent_frontmatter/memory/colleagues/social），未含目录实存的 `session-body.agent.md` 与退役件。若 paths 承载渲染链输入语义，session-body 缺位将漏渲染；若仅承载六件套语义，则两件不入属设计行为——但该语义边界现无文档锚。

**修改建议 ①**：在 contract README 或渲染管线文档写明「contract.paths 与 D1b manifest 的职责边界」（一句话即可），或在 paths 内补 session-body 条目。

**验收锚 ①**：paths 与渲染链输入集合的一致性有明文职责说明，session-body 渲染来源可从 contract 或管线文档单链溯源。

**建议项 ②（runtime_baseline 单值）**：`runtime_baseline.host: copilot-host` 单值，与现势双宿主位（`.claude/agents/` 主力运行位 + `.github/agents/` Copilot-host 入口位，均发布拷贝）存在映射差；binding profile 存在（本席实锚验证 `.github/binding-profiles/chief-product-officer.json` 实存）但 contract 未引用。

**修改建议 ②**：`runtime_baseline` 节补 binding profile 路径引用，host 语义注明「宿主位枚举见 binding profile」。

**验收锚 ②**：contract 宿主字段与 binding profile 单向引用链成立，无双真源。

### 件5 · colleagues.agent.md — PASS

无意见。汇报线（CEO 直汇）、紧密协作（CTO/CMO）、常规协作（COO/CFO/FD/小贾）与 agent-body 职责面自洽；与 CTO 席相关段（「产品范围→技术可行性最小闭环」「定期对齐」）与本席 colleagues 面认知对称。层契约四条（current-host consumption data、岗位协议晋升路径、认知层契约正身）表述规范。

### 件6 · memory.agent.md — 建议

**理由**：「运行资产落点」节中 runtime cognition 私域出现两行：L20 `TRICOMPANY_COGNITION_HOME（认知层状态与派生资产落点）` 与 L27 `TRICOMPANY_COGNITION_HOME 或当前 runtime cognition backend`——同指一物、措辞不一（前者无路径限定、后者带 fallback 措辞），与同批 colleagues/social 件（单行泛指）不一致。另 L20-27 段内产品真源/registry/知识工作区/宿主绑定/私域混排，落点分组略散。

**修改建议**：私域条目去重为单行，措辞与 agent-body 对齐（带 `employee/chief-product-officer` 路径限定）；落点条目按「私域/真源/registry/绑定」分组。

**验收锚**：落点节无重复指称条目；私域措辞与 agent-body「运行资产落点」节同文。

### 件7 · session-body.agent.md — 挂起 + 建议

**挂起项（候裁清单见第三节 C-1，与件4同根因）**：「产品真源指针族」L25 明写 `TriCompany/docs/registry/business-strategy-state.md`——本席实锚验证该路径不存在（TriCompany 仓 registry 目录实存 `business-state.md`；`business-strategy-state.md` 在 TriMetaverse 仓）。session 面正身件携带悬空指针，CPO 恢复/开场场景按图索骥必落空，比 contract 内嵌摘要的悬空危害更直接。

**建议项（内联清单双真源）**：件内「开工前置核查」全量内联（0.5 归属路由阀门+1-5 条），与 agent-body 指针化形态并存。两处清单为同一内容双载体，未来清单变更需双点同步，存在漂移风险。注：本席 session-body 同构内联，此为**全席共性行动项**，不针对 CPO 单席，建议入管线窗统一处理。

**修改建议**：内联清单头部加一行镜像注记：「本节=compass 手册〈开工前置核查〉节的镜像，真源随手册发布更新」。

**验收锚**：内联清单与 compass 手册对应节的镜像关系有明文注记；变更同步责任可从注记溯源。

### 件8 · social.agent.md — PASS

无意见。工作名（小乔，2026-07-01 CEO 正式命名）与 contract `identity.display_name` 一致；社交定位（敏锐/克制/「做少做对，验证再扩」）与 soul 人格同族不重复；层契约边界清晰。

### 件9 · soul.agent.md — PASS

无意见。人格设定（气质/对话风格/禁止退化）为纯身份层内容；「认知分层约束/当前原则/运行资产落点/层契约」四节为覆盖层复写载体——本席逐节与 agent-body 比对，当前原则、运行资产落点、层契约均逐字一致，无漂移，属覆盖层机制设计行为。禁止退化三条（未验证需求包装成市场事实/战略裁决伪装产品判断/为显积极扩大 MVP）与行为护栏互补不冲突。

---

## 三、挂起候裁清单（三红线纪律·清单化）

### C-1 · business-strategy-state.md 仓库前缀错置（根因项，跨件4/件7）

- **事实**：CPO 两件引用 `TriCompany/docs/registry/business-strategy-state.md`（contract.io_contract 隐式基座 + session-body 显式 TriCompany 前缀）；该路径在 TriCompany 仓不存在。
- **实锚现状**：TriCompany 仓实存 `docs/registry/business-state.md`（自述 sourceOfTruth=本路径，TriCompany business registry 工作层，product/code-state 的业务上游约束）；TriMetaverse 仓实存 `docs/registry/business-strategy-state.md`（另有 module-map/evolution-log/boundaries 同族件）。
- **候裁问题**：CPO 件指针应指向①TriCompany 仓 `business-state.md`（仓内上游约束语义）还是②TriMetaverse 仓 `business-strategy-state.md`（中央 BusinessStrategy registry 语义），或两仓双真源分工需明文？
- **建议裁决方**：BusinessStrategy（真源归属主责）+ COS 中央收口；CTO 席保留权：改后路径的工程可达性复核候 CEO。
- **验收锚**：contract.io_contract 与 session-body 指针族改指裁决后实存路径；两件与两仓 registry 实况零悬空。
- **豁免标注**：无冻结件涉入；件7 session-body 为 LG-024 批 1 前置源件（CHO 门+管线 execute 前形态），若裁定改指针，建议随管线窗批量落地而非散改。

---

## 四、使用依据

- 靶标全 9 件：`/srv/fleet/TriCompany/source-agents/chief-product-officer/`（逐件全量读取）
- 公共结构面实锚核验：`TriCompany/.github/binding-profiles/chief-product-officer.json`、`TriCompany/docs/registry/`（business-state/code-state/product-state.md）、`TriCompany/docs/product/` 三件、`TriCompany/docs/engineering/DESIGN.md` 与 `governance-memory-index.md`、`TriMetaverse/.claude/compass/chief-product-officer.session.md`、`TriMetaverse/docs/registry/business-strategy-state.md`
- 依据链：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律

（CTO 席表态完毕，候五席汇总收口。）

# B4 扫尾批3 五席联审 · CTO 席意见书（靶标=COS source-agents 全 9 件）

- **席位**：CTO 小狄（chief-technology-officer）
- **date 现查**：2026-09-16T22:06:58+0800（会话开工现查，本席工作段内）
- **批号**：B4-sweep-b3
- **程序位**：审零改动（仅读靶标 + 写本席意见书，未触碰靶标目录任何文件）
- **M4 零改动声明**：本席对联审靶标 `/srv/fleet/TriCompany/source-agents/ceo-chief-of-staff/` 全 9 件零创建、零修改、零删除；本报告为唯一写入物。
- **独立性声明**：未读 reports/ 下任何他席稿，席间零交换；下表全部意见为 CTO 席独立表态。核验范围仅限公共结构面（role doc、授权矩阵、FADE 正身、binding profile、compass 手册、双仓 registry/workflow 目录、TriMC/TriMMC 盘面实况）存在性核查，不含他席产出物。
- **依据链**：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律；跨批对照基线=批1/2 共识四项（次批③ 2/13 校准窗 / E2 命名追平候 CEO / 悬空落点标注案 / compass live 全链 TriMC·PRODUCT.md 勘向），同族沿判向标注、不重复展开。

---

## 一、表态总表

| # | 文件 | 级别 | 意见摘要 |
|---|---|---|---|
| 1 | agent-frontmatter.agent.md | PASS | 与 agent-body 同文；历史实验词（shadow-test/Hermes）作触发词可达性保留，附注 |
| 2 | agent-body.agent.md | 建议 | ⑦改排随迁段权界完整；中央收口模板路径无仓前缀（实存件在 TriMetaverse 仓） |
| 3 | ceo-chief-of-staff.agent.md（退役件） | 建议 | 退役标注缺批次/日期（跨批共性沿判）；快照 frontmatter 旧名属旧态知情项；快照完整性正面 |
| 4 | ceo-chief-of-staff.contract.yaml | **挂起**+建议 | 挂起：ipd_heartbeat.source 旧名 TriMC（C-2 成员）；建议：v3.1 族内版本策略、decision_rights 缺⑦随迁条目（批2判向沿判）、operating_record.source 双仓含混 |
| 5 | colleagues.agent.md | 建议 | **「催办」职责残留 vs agent-body/memory ⑦ 改排新态——同席三件内部分裂（本批主发现）** |
| 6 | memory.agent.md | 建议 | 授权矩阵双名（L7 泛名悬空/L24 全名实存）；私域条目三行冗余（批1/2 加重版） |
| 7 | session-body.agent.md | **挂起**+建议 | 挂起：TriMMC 新名引用 sg 机悬空（C-2 成员）；建议：内联清单缺镜像注记（全席共性沿判） |
| 8 | social.agent.md | PASS | 小贾命名三面一致，结构干净，无意见 |
| 9 | soul.agent.md | PASS | 名字与 contract/social 一致（命名追平正面样板）；复写节零漂移 |

**分布读数**：9 件 = PASS 3 · 建议 6（件 4/7 并挂起）· 挂起 1 项（C-2 跨件 4/7，执行窗依赖型，见第三节）。

---

## 二、逐件意见详表

### 件1 · agent-frontmatter.agent.md — PASS

无意见。三字段与 agent-body 头部一致；`description` 触发词面含「Copilot 宿主 shadow-test 收口与正式接管协调、Hermes 融合」等历史实验词——作为场景触发词保留历史事项可达性，语义与 contract `identity.description`（总助/调度中枢）同族不冲突。附注不展开。

### 件2 · agent-body.agent.md — 建议

**正面核验**：

- L83 ⑦ 改排随迁段权界完整（本席保留 fan-in 呈报半环+分派权/升级权/台账销账变更权；收口督办/催办归 COO），与批2 COO 件镜像对称——两侧权界互补无重叠无真空，⑦ 落格质量正面样板。
- L33 M-001 状态条五字段机械合同在位（与 soul L41 双落格）。
- 指针化代表抽查通过：compass COS 件（`compass/ceo-chief-of-staff.session.md`）L161 含〈开工前置核查〉节且 L170 完整保留 4.5 FADE 现行版条——指针化未丢协议纪律约束。

**建议项（模板路径仓前缀含混）**：L82「默认对齐 `.github/prompts/中央收口输出模板.prompt.md`」无仓前缀——本席实锚验证：TriCompany 仓无此件，实存于 `TriMetaverse/.github/prompts/`。COS 件语境跨双仓常态（前置核查 2/8 条本就双仓穿梭），但无前缀的默认 TriCompany 基座读法落空。

**修改建议**：补 TriMetaverse 前缀或 `../` 相对路径（对齐 LG-023 跨仓路径纪律）。

**验收锚**：模板路径按所属仓前缀可达。

### 件3 · ceo-chief-of-staff.agent.md（退役件）— 建议

**理由 ①**：退役标注缺批次/日期——批1/2 共识沿判向，不重复展开论证。
**理由 ②（知情项，非缺陷）**：快照 frontmatter `name: TriCompanyCEOChiefOfStaff` 为退役前旧名（现役=CEOChiefOfStaff），属退役快照旧态语义，汇总方知情即可。
**正面**：快照完整性为三批最佳——全量前置核查（0.5 归属路由阀门+1-9 含 4.5 FADE 条与 9 IPD 条）随快照保留，历史约束可溯。

**修改建议**：随批1/2 同项一并补退役批次/日期。

**验收锚**：退役标注含可追溯批次或日期。

### 件4 · ceo-chief-of-staff.contract.yaml — 挂起 + 建议

**挂起项（C-2 成员，见第三节）**：L102 `ipd_heartbeat.source: TriMC/src/heartbeat/cli.py` 用旧名 TriMC。

**建议项 ①（族内版本策略）**：`contract.version: 3.1` vs 批1/2 CPO/COO 件 3.0——COS 件独走 3.1（decision_rights 含经营红线细则，推断为增量演化），族内版本号漂移无策略说明。随五字段换代窗一并统一或加版本差说明。

**验收锚 ①**：族内 contract version 策略有明文（统一或版本差注记）。

**建议项 ②（decision_rights 缺⑦随迁条目）**：agent-body/memory 已落⑦改排（督办迁 COO/保留三权/fan-in 前收 COO+CGR 读数），contract `decision_rights` 无对应条目——与批2 COO 件同构问题，判向沿批2（合同权界面与正身面同步），不重复展开。

**建议项 ③（operating_record.source 双仓含混）**：L96 `source: docs/workflow/operating-records/` 无仓前缀。本席实锚：**双仓并存**——TriCompany 侧目录存在但停 2026-W36（滞后面），TriMetaverse 侧为现行面（W38 活跃，daily-progress.md 在位）。agent-body L41 明写 TriMetaverse 前缀。无前缀引用在双仓并存现势下语义含混。

**修改建议 ③**：补 TriMetaverse 前缀；TriCompany 侧滞后目录建议另案清理或标注镜像性质（涉两仓经营记录面分工，超出本批靶标，移交汇总方）。

**验收锚 ③**：io_contract 经营记录 source 指向现行面所在仓；滞后面处置有归属。

**正面（值得记录）**：decision_rights 经营红线阈值与本席抽查的授权矩阵真源**逐字同构**——试单折扣 5%/15%、预算偏差 5%/15%、一次性支出 20/100 USD、recurring cost 10 USD/月，全部与 `ceo-chief-of-staff-authorization-matrix.md` L60/L82 一致。合同权面与授权矩阵真源的同步质量为三批最佳。

### 件5 · colleagues.agent.md — 建议（本批主发现）

**理由（同席三件内部分裂）**：L24「CEOChiefOfStaff 持有公司级协调、**催办**、升级与收口职责」——2026-09-11 ⑦ 改排后催办已随迁 COO：

- agent-body L83：「收口督办与节奏管理（**催办随迁**）已归 COO」——新态；
- memory L9：「收口督办/**催办**已迁 COO」——新态；
- colleagues L24：仍列「催办」——旧态残留。

同席三件两新一旧，第三方按 colleagues 件理解 COS 权界会与正身冲突；且 COO 侧已按新态运转（批2 件2/件6 已核）。

**修改建议**：L24 对齐⑦改排（删「催办」或改注「收口督办/催办已迁 COO（⑦ 改排），本席保留 fan-in 汇总呈报半环与分派/升级/销账三权」）。

**验收锚**：colleagues 管理关系行与 agent-body ⑦ 随迁段、memory 接口记忆三者同构，无催办职责残留。

### 件6 · memory.agent.md — 建议

**项 ①（授权矩阵双名）**：L7「当前版本由 `authorization-matrix.md` 定义」——本席实锚该泛名文件不存在；L24「`docs/workflow/ceo-chief-of-staff-authorization-matrix.md`」全名实存。同件内双名指同物，泛名悬空。

**修改建议 ①**：L7 对齐 L24 全名。

**验收锚 ①**：件内授权矩阵引用单名且实锚可达。

**项 ②（私域条目三行冗余）**：L21/L26/L28 三处 runtime cognition 私域条目（含 fallback 措辞变体）——批1/2 双行同构的加重版，跨批共性沿判去重向。另 L29「共享/审计运行态：TRICOMPANY_COGNITION_HOME 或 .tricompany-cognition/org/...」混措辞与 agent-body L42（固定 .tricompany-cognition/org/ 面）不一致，随去重一并统一。

**验收锚 ②**：落点节私域条目单行；共享/审计面措辞与 agent-body 一致。

### 件7 · session-body.agent.md — 挂起 + 建议

**挂起项（C-2 成员，见第三节）**：L44 前置核查 9 `python ../TriMMC/src/heartbeat/cli.py` 用新名 TriMMC——sg 机基座悬空。

**正面**：L8 FADE 正身勘误史在案（2026-09-01 首勘误误判经同日二次勘误恢复原引用，董事会批件）——勘误纪律与快照恢复链路正面样板；恢复五步次序（CLAUDE.md→journal/ledger→字典序 full-*→FADE 正身→周平面）机械可执行；「防打断条款」设计周全。

**建议项（内联清单镜像注记）**：开工前置核查全量内联（0.5-9 条），与 compass 手册双载体——全席共性沿判向（批1 立项），不重复展开。

### 件8 · social.agent.md — PASS

无意见。工作名小贾（CEO 正式命名 2026-07-01）与 contract `display_name`、soul 名字三面一致——**E2 命名追平基线在 COS 席零残留，为命名追平正面样板**（对照批2 COO 席三态分裂）。层契约边界清晰。

### 件9 · soul.agent.md — PASS

无意见。名字=小贾（命名追平成员）；人格设定（漂亮干练/总助而非流程按钮/禁止退化三条）为纯身份层；复写节（认知分层约束/当前原则/运行资产落点/层契约）与 agent-body 逐字一致零漂移，覆盖层机制合规。M-001 五字段在 soul L41 双落格，状态条合同冗余度合理（覆盖层保证恢复场景不丢合同）。

---

## 三、挂起候裁清单

### C-2 · TriMC/TriMMC 新旧名跨机分裂（根因项，跨件4/件7；执行窗依赖型挂起）

- **事实链**：contract L102 用旧名 `TriMC/src/heartbeat/cli.py`；session-body L44 与退役件 L97 用新名 `../TriMMC/src/heartbeat/cli.py`；compass COS live 件 L175 同新名（L18/L94 宿主名亦 TriMMC）。本席实锚（sg 机，D-24 机位=/srv/fleet/）：`/srv/fleet/TriMC` **实存**且 `src/heartbeat/cli.py` 在位；`/srv/fleet/TriMMC` **不存在**。dev 机布局（TriMetaverse CLAUDE.md）=TriMMC 新名（2026-09 改名，兼容面沿用旧名过渡）。**同席两件各锚一机，无一件双机实锚；compass live 链已全勘向新名，sg 盘面仍旧名。**
- **候裁问题**：①改名落 sg 的时点与兼容期口径；②agent 件引用名统一策略（统一新名+兼容注记，或双名+机位断言注记过渡）；③D-24 机位断言是否要求落 agent 件文本。
- **挂起性质**：非分歧型候裁——修复方向明确（统一新名 TriMMC），执行时点依赖改名落 sg 工程进度，本联审窗内不可即决，故挂起候执行窗。
- **裁决/执行方**：改名落 sg=CTO 域工程执行（本席主责，利益相关声明：候裁清单呈汇总方时建议由 COS 或 CEO 侧复核时点）；agent 件引用名统一时点=COS 确认。
- **验收锚**：TriMC/TriMMC 引用全链单名且双机（或断言注记后单机）实锚可达；sg 盘面目录名与 live 链口径一致。
- **豁免标注**：无冻结件涉入；退役件旧名引用随快照旧态豁免，不入统一范围。

## 四、批1/2 共识基线对照（任务书要求）

| 共识项 | 本批对照读数 |
|---|---|
| 次批③ 2/13 校准窗 | COS=1/13，窗口径适用，沿判不展开 |
| E2 命名追平候 CEO | **COS 席零残留**（小贾三面一致），命名追平正面样板 |
| 悬空落点标注案 | 本批新增 3 处：C-2 跨机名址分裂（挂起）、中央收口模板仓前缀（件2）、授权矩阵泛名（件6）——均按案标注/立案 |
| compass live 全链 TriMC·PRODUCT.md 勘向 | compass COS 件已全勘向 TriMMC 新名（L18/94/175 实锚抽查）；分裂点在 sg 盘面目录名——live 链✅/sg 盘面✗，坐实 C-2 |

## 五、使用依据

- 靶标全 9 件：`/srv/fleet/TriCompany/source-agents/ceo-chief-of-staff/`（623 行，逐件全量读取）
- 公共结构面实锚核验：`TriCompany/docs/workflow/`（chief-of-staff-rd-orchestration.md、cyber-company-secretariat.md、ceo-chief-of-staff-authorization-matrix.md 阈值抽查、operating-records/ 滞后面概貌）、`TriCompany/docs/engineering/fade-protocol-spec.md`+`fade-registry.md`、`TriCompany/.github/binding-profiles/ceo-chief-of-staff.json`、`TriMetaverse/.claude/compass/ceo-chief-of-staff.session.md`（4.5 条+TriMMC 勘向抽查）、`TriMetaverse/.github/prompts/中央收口输出模板.prompt.md`、`TriMetaverse/docs/workflow/operating-records/2026-W38/`（现行面）、`/srv/fleet/TriMC`+`/srv/fleet/TriMC/src/heartbeat/cli.py`（实存）与 `/srv/fleet/TriMMC`（不存在反证）
- 依据链：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律 · 批1/2 共识基线四项

（CTO 席表态完毕，候五席汇总收口。）

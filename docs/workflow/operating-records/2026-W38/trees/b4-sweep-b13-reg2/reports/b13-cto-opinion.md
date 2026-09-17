# B4-sweep-b13 · 五席联审 · CTO 席意见稿

- **席位**：CTO（小狄）
- **date 现查**：2026-09-18 00:24:56 CST (Friday)（本席会话首动作现查读数原样粘贴）
- **水位自估**：中
- **末次活动时刻**：2026-09-18 00:32:06+0800（transcript mtime 现查）
- **批号**：B4-sweep-b13（压缩二级令续 · 重启后冷建批 · 程序位=审零改动）
- **M4 零改动声明**：本席本批零改动。未修改任何 registry 件、未回写任何真源与登记层文档；唯一产出即本意见稿（写入 COS 派工指定 operating-records 路径，归属路由经 COS 派工授权，operating-records 收口权仍在 COS）。
- **独立性声明**：未读任何他席稿；未读既往批意见原文；未读自家既往稿（b12 及更早）。跨批基线仅按派工单所载族名+一句话使用，未回读先例。本批读数来源限于：20 件靶标原文、manifest JSON 全文、以及只读勘验命令（ls / diff / python json 校验 / 路径存在性检查）。
- **依据链**：
  1. 靶标 20 件原文：`TriCompany/source-agents/registries/` 字母序 16-35 位
  2. `trimetaverse-live-agent-publish-manifest.json` 全文 623 行（同目录，配置面审读）
  3. 勘验读数：JSON 程序校验（JSON_VALID / 71 liveEntries 分布）、`TriMetaverse/.github/agents/` 清单、TriMetaverse×3+CompanyGovernanceRegistry source==published diff 实测、sg 机位模块目录勘验、指称路径双 vantage 存在性实勘
  4. `TriMetaverse/CLAUDE.md`（模块布局与改名事实：TriLC→TriRLC 2026-08-31 改名、TriMC→TriMMC 2026-09 改名兼容过渡；cyber-company.md 归档口径、docs/tricompany.md 现行真源）
  5. 本席 session 面开工前置核查基线

## 逐件表态（20 件）

### 世代家族件（16 件，占位/前世代定性读数）

**16. TrideploymentProductRegistry.agent.md** — 短版制（投影式 description 无「适用场景」前缀、4 节输出）。反引号断裂命中（L27「不代替 \`Trideployment\`BusinessStrategyRegistry」）。占位/防夸约束齐备。定性：Trideployment 模块侧产品件，manifest 登记为 migrated-module-local-live-entry（模块侧 canonical），本件为中央源侧迁出后留存；sg 机位该模块目录缺位。**零改动确认**。

**17. TrideProductRegistry.agent.md** — 长版制（适用场景 description、5 节、7 信息源）。防夸约束佳（不写成 TriHost 替代层）。名址精度命中：`../../cyber-company.md` 死指称（双机位均缺位，现行口径=docs/tricompany.md，cyber-company.md 为历史归档件）。**零改动确认，死指称入候勘**。

**18. TriDevBusinessStrategyRegistry.agent.md** — 长版制。shadow test / 本地正式接管阶段语境。约束「不把 TriDev 写成当前优先开发主线或现役成熟流程系统」与本席 readiness 核查口径同向。sg 机位 TriDev 目录缺位，manifest migrated 指称在 sg 悬空（D-24 机位断言范畴）。**零改动确认**。

**19. TriDevCodeRegistry.agent.md** — 短版制。反引号断裂命中（L28）。占位强制标注约束在。**零改动确认**。

**20. TriDevProductRegistry.agent.md** — 短版制。反引号断裂命中（L28）。同构 19。**零改动确认**。

**21. TriLCBusinessStrategyRegistry.agent.md** — 长版制。TriLC=现 TriRLC 前世代名（2026-08-31 改名）。约束「不写成服务域主控或中央战略层」佳。description 协同对象含 TriMC 旧名，属兼容过渡期语义自洽。sg 机位 TriLC 目录+module-local 三件现存（旧名）。**零改动确认**。

**22. TriLCCodeRegistry.agent.md** — 长版制。结构指称 src/runtime|local-node|planner|toolbus|context-adapter|vendor——前世代骨架口径；TriRLC 现役口径=HTTP+SSE daemon/heartbeat/cron/session reaper（CLAUDE.md 与本席 session 面）。世代陈旧（结构级），防夸约束（不编造 git 健康/覆盖率）仍有效。**零改动确认，结构指称世代陈旧入候勘**。

**23. TriLCProductRegistry.agent.md** — 长版制。名址精度双命中：`../../project.md`（源侧缺位；现行=docs/project.md B2 换代真源）+ `../../cyber-company.md`（死指称）。约束「区分本地域控制器与桌面工具工作台」佳。**零改动确认，双死指称入候勘**。

**24. TriMCBusinessStrategyRegistry.agent.md** — 长版制。TriMC=现 TriMMC 前世代名（2026-09 改名，兼容面沿用旧名过渡）。统一运行面/interaction core 口径。约束「不与 core-agent 历史迁移源混写」与本席护栏同向。sg 机位 TriMC 目录+三件现存（旧名）。**零改动确认**。

**25. TriMCCodeRegistry.agent.md** — 长版制。observability 迁移、OpenClaw shadow、vendor/openclaw 指称=历史迁移世代代码面。约束「不把 core-agent 历史资产表述为现役实现」与 CLAUDE.md 行为护栏一致，是有效防线。**零改动确认**。

**26. TriMCProductRegistry.agent.md** — 长版制。约束「不写回旧服务域主控标准名，旧术语映射统一运行面」——件内自带术语换代防线，佳。名址精度命中：`../../cyber-company.md` 死指称。**零改动确认，死指称入候勘**。

**27. TriMemBusinessStrategyRegistry.agent.md** — 长版制。未来用户系统/身份层定位。防夸双门（不写成现役成熟用户系统；provider key 托管不算已确认现役职责）——本批最佳约束组之一。sg 机位目录缺位。**零改动确认**。

**28. TriMemCodeRegistry.agent.md** — 短版制。反引号断裂命中（L26）。3 信息源、无 closeout workflow 源。占位强制标注约束在。**零改动确认**。

**29. TriMemProductRegistry.agent.md** — 短版制。同构 28，反引号断裂命中（L26）。**零改动确认**。

**34. TriMobileBusinessStrategyRegistry.agent.md** — 长版制。未来移动端入口定位，与 Triavatar 入口协同。约束「不写成已实现成熟移动端模块」。sg 机位目录缺位。**零改动确认**。

**35. TriMobileCodeRegistry.agent.md** — 短版制。反引号断裂命中（L26）。同构 28/29。**零改动确认**。

### 活跃席件（3 件，全量核）

**30. TriMetaverseBusinessStrategyRegistry.agent.md** — 活跃席（manifest source-published-live-entry；发布侧 diff 实测 source==published）。中央/模块分层声明明确（L11：不等于中央 BusinessStrategy）。10 信息源中 docs/registry/business-state.md、business-strategy-state.md 等实勘存在；`cyber-company.md` 根相对指称死（双机位缺位）。**零改动确认，死指称入候勘**。

**31. TriMetaverseCodeRegistry.agent.md** — 活跃席、同步实测一致。本席最重度相关件。CodeGraph-First 节齐备（codegraph_status 先行、三例外、刷新提醒），与 CLAUDE.md CodeGraph 节同构。职责含 role-agent/registry 路由规则耐久变化回写判断与项目仓技术侧文档基线纪律（DESIGN/ROADMAP/STATE/PLAN/SUMMARY/VERIFICATION）。无世代陈旧命中，现役有效。**零改动确认**。

**33. TriMetaverseProductRegistry.agent.md** — 活跃席、同步实测一致。长版制 12 信息源。`../TriCompany/source-agents/...` 兄弟仓指称 sg 实测成立（/srv/fleet/TriCompany 存在）；`cyber-company.md` 死指称同 30。 TriCompany-copilot-host-assets 前缀路径与 manifest retiredEntries 归档路径自洽。**零改动确认，死指称入候勘**。

### 配置面件（1 件）

**32. trimetaverse-live-agent-publish-manifest.json** — 配置面全量审读（程序校验 JSON_VALID）。manifestId=trimetaverse-live-agent-discovery-publish-v0.1，date=2026-09-11，status=active。71 liveEntries：13 current-copilot-host-live（13 员工，全带 sessionBody）/ 6 source-published-live-entry（business-strategy、CompanyGovernanceRegistry、TriMetaverse×3、board）/ 45 migrated-module-local-live-entry（15 模块三件套，pilotModules 集合与 migrated 实集一致）/ 7 module-local-live-entry（TriCompany orchestrator 2026-07-24 三方 APPROVE 带 governanceRef；TriMLC×3、TriRMC×3 各带 2026-08-22 立项 note，自立项 module-local 无迁移语义）+2 retiredEntries（2026-05-22 归档留痕）。CTO 三验实测：①单发现规则合规——TriMetaverse/.github/agents 零中央模块 registry 残留；②同步——TriMetaverse×3+CompanyGovernanceRegistry source==published；③JSON 结构有效。候勘三项：(a) 发布面存在 kebab-case 别名件 company-governance-registry.agent.md、tri-metaverse-code-registry.agent.md，未见于 manifest liveEntries（manifest 覆盖外发布面文件）；(b) deployment-engineer 与 customer-success-officer 五件套并件变体（colleagues/social 同指 colleagues-social.agent.md）——合法变体但破坏五件套同构性；(c) sg 机位 TriDev/Tride/Trideployment/TriMobile/TriMem 目录缺位致对应 migrated 指称在 sg 悬空，TriRLC/TriMMC 新名目录亦缺位——跨机名址差归 D-24 机位断言，非 manifest 缺陷。**零改动确认**。

## 跨批基线族对表（族名+一句话，遵压缩二级令）

- **runtime_baseline 换代窗**（BS 正身）：本批 20 件零命中，该族不在本批靶标内现形。
- **description 投影制**（BS 正身）：本批 19 agent 件呈「13 长版（适用场景式）+ 6 短版（投影式）」两制并存；短版全部集中于 Code/Product 侧，呈「BS 长版、CP 短版」信息密度梯度。
- **owner 缺载族**（3-15 批仅 3 有）：本批 19 件 frontmatter 均 name/description/tools/user-invocable 四键，owner 键 0/19，延续缺载常态；manifest 条目自带 source/target 具 owner 语义不受此族影响。
- **反引号断裂族**：命中 5 件（16/19/20/28/35），均为短版件「不代替 \`X\`BusinessStrategyRegistry」句式，闭反引号与后词无隔致渲染粘连。
- **execution 标注群**：本批 20 件零命中（无 docs/execution/ 指称）。
- **P2 群**：本批 20 件零命中（无 P2 优先级标注）。
- **名址精度群**：本批重灾区——`cyber-company.md` 死指称坐实 5 件（17/23/26/30/33，双机位实勘均缺位）；`../../project.md` 死指称 1 件（23）；`../../docs/workflow/...` 系相对路径仅发布面 vantage 成立（源侧 TriCompany 下缺位，vantage 依赖坐实）。

## 技术判断

本批 20 件审读完毕，**零改动维持**。活跃三件+manifest 现役有效且三验实测全过（JSON 有效/单发现合规/发布同步一致）——发布纪律的机器可读正身是健康的。世代家族 16 件定性为迁出中央后的模块侧占位/前世代件：防夸约束在件、无越权表述、无补造进度，符合 registry 无人格件纪律；其世代陈旧（旧模块名、旧结构指称、死文档指称）属演进欠账而非现行缺陷，不构成本批必须修项。

## 风险与缓解

- 风险（低）：名址精度群死指称会在真源迁移后误导收口调用方查证方向。缓解：候勘清单移交后续批次或正身维护窗，由 owner 席位按归属路由处理，本批不动。
- 风险（低）：发布面 kebab-case 别名件与并件变体在 manifest 覆盖外，属发现面暗物质。缓解：候勘登记，建议 manifest 补录或清理时走 host-object-publish-flow。

## 发布姿态

本批零改动，无发布动作。候勘项共五类：①死指称 6 处（cyber-company.md×5、project.md×1）；②TriLCCodeRegistry 结构指称前世代；③kebab-case 别名件 2 枚未入 manifest；④五件套并件变体 2 枚；⑤名址 vantage 依赖与 sg 机位目录缺位（D-24 断言范畴）。均为 low-severity 演进项，不阻塞任何交付；处理时须经归属路由与发布管线，不走本批通道。

## 使用依据

TriCompany/source-agents/registries/ 16-35 位 20 件原文；trimetaverse-live-agent-publish-manifest.json 全文；TriMetaverse/CLAUDE.md（改名与归档口径）；本席只读勘验读数（ls/diff/python/存在性检查，命令与结果见独立性声明所列范围）。

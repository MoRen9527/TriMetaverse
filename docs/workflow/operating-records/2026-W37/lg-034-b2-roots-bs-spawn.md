# LG-034 B2 批（根两件）·BusinessStrategy(spawn) 意见归档件

- sourceOfTruth: 本件=B2 批 BusinessStrategy spawn 执行者意见落盘归档（M-004 残留场景③常态化，CEO 常驻授权令 2026-09-11 04:12+0800）
- syncMode: archived（spawn 执行者填写，其后冻结）
- lastSyncedAt: 2026-09-11T04:23+0800（COO 创建骨架）
- 批号: LG-034-B2（根两件：project.md + tricompany.md）
- SLA: 即时反馈/标准 2026-09-11 05:10+0800/特殊最长 05:40+0800；单批 cap 3000 万（CFO 核签件①）

## BusinessStrategy spawn 意见（待填）

撰写身份：TriCompany BusinessStrategy（商业真源席），spawn 独立实读，未参考他席稿。实读范围：两件靶标全文、`docs/tmv-whitepaper.md`（v1.0 修订 1b，CEO 2026-08-22 签发）、`docs/三元宇宙架构与模块说明.md`（V0.5）、`../TriCompany/tricompany.md`（宪章 V1.0）、`../TriCompany/docs/registry/business-state.md`、project.md §1.1/§9 全部引用资产存在性核验。

## 件一：project.md（根，17117B，v0.1，2026-03-03）

**P1｜文档身份与商业真源关系（主焦点）：project.md 不是、也不应作为商业真源；现行对它的真源级引用必须解除。**
- 意见：该文件实为十阶段研发工作流规范（标题「TriMetaverse Project Workflow（TriMC 运行面版）」），商业模型内容近乎为零——全文对商业面仅有 §7「实验范围」三点（主控编排方法 / Copilot+VS Code 工具配置 / 全链路可执行性，2026-03 口径）和 §1.1 检查命令中把 `docs/tmv-whitepaper.md` 当 rg 参数路径的间接提及（project.md:29），无任何「商业真源=白皮书」的显式声明。
- 理由：根 `tricompany.md` §1 真源分工第 1 条把 project.md 与白皮书并列为「总商业模式、模块边界和正式宿主裁决」真源（tricompany.md:22），这是错误的真源级升格；CLAUDE.md 已将其列入降权警示（改写窗中）。商业真源必须唯一收敛到 `docs/tmv-whitepaper.md`。
- 修改建议：改写后 project.md 定位为「项目总述/导览」——一句话定位 + 商业真源指针（docs/tmv-whitepaper.md）+ 模块边界指针（docs/三元宇宙架构与模块说明.md §4）+ 当前执行计划指针（docs/execution/v0.9.x-dual-track-tricompany-plan.md）；workflow 规范内容或迁 `docs/workflow/`、或保留但明确降为 workflow 索引。同步修改 tricompany.md §1 真源分工清单（见 T2）。
- 验收锚：改写后 project.md 内无商业模式表述段（§7 重写或删除）；含显式「商业真源=docs/tmv-whitepaper.md」指针行；tricompany.md §1 清单不再含 project.md。

**P2｜排期议题①「是否移入 docs/」：商业面不反对任一物理位置，位置属文件治理裁决——两案并列，候 CEO 拿审。**
- 意见：方案 A（推荐）=保留根位、改写为「项目总述」（CEO ⑥ 亦言「该文件应描述整个项目」，项目描述放根位有惯例合理性，引用破坏面最小）；方案 B=移入 docs/（若内容定位维持 workflow 规范体，则 docs/workflow/ 更符合落位惯例——参照「设计/执行文档落 docs/execution、workflow 资产落 docs/workflow」的既有分区）。
- 理由：本席管辖的是内容身份与真源关系，不是文件物理位置；但须提示约束：任何迁移必须同步全仓引用（CLAUDE.md 降权警示行、tricompany.md §1、以及各处按根路径引用它的命令与文档），否则产生第二处断链。
- 修改建议：CEO 拍板 A 或 B 后，迁移/改写单 commit 完成，commit message 标注 LG-034-B2。
- 验收锚：`rg -l "project\.md"` 命中文件在迁移后全部指向新路径或已更新；无孤儿引用。

**P3｜过时商业口径清点（project.md，本席域内部分）。**
- 意见：以下属商业/边界叙述面过时，改写时必须处理（其余命名/命令面过时项归 CGR/CTO 席意见，本席不重复展开）：
  1. §7「实验范围」三点（project.md:312-320）为 2026-03 实验叙事，与白皮书 §3.1 三层最小实现、`docs/execution/v0.9.x-dual-track-tricompany-plan.md` 现行执行计划脱节——重写或删除。
  2. §1.2 宿主边界说明（project.md:33-38）含「copilot chat 承载 shadow 与当前阶段正式接管」「TriPilot → TriLC 直连」「TriMC fallback」「Tride 不再作为切换后的正式宿主」——宿主现状叙事过时；且「TriMetaverse V1 正式上线切换阶段」的 V1 语义属中央战略保留权：改写稿不得在本文件自行定义 V1 触发条件，只可指针到白皮书 §8 路线图。宿主切换表述保留权语义不变、仅更名与指针化（TriMC→TriMMC、TriLC→TriRLC、Tride→TriCode，按白皮书修订 1 换轨注记）。
  3. 岗位状态过时：project.md:21/134/145 反复写「当前阶段由 CEOChiefOfStaff 组织，未来 ChiefProductOfficer 正式上岗后转由其主责」——CPO 已于 2026-08-01 随宪章 V1.0 上岗（宪章第三节 13 人名册），「未来上岗」句式全文退役。
- 理由：历史冻结豁免不适用于本件——project.md 以「当前版」自居（无归档标注），其过时商业叙事构成活性误导；这与 tricompany.md 附录（显式归档件）性质不同。
- 修改建议：改写以白皮书 §3.1/§3.3.1 与架构文档 §4 为唯一上游口径；退役句式列入改写稿头部的「修订说明·旧口径退役清单」。
- 验收锚：改写稿含旧口径退役清单节；`rg "未来 ChiefProductOfficer|copilot chat 承载|Tride" project.md` 零命中（兼容别名注记除外）。

**P4｜排期议题②「整体改写留痕的处置形态」：推荐「版本升级+修订说明段+单 commit」三件套，旧叙事以 git 历史为归档、不内联附录。**
- 意见：v0.1→v0.2（或直接 v1.0，候 CEO）；头部加「修订说明」段仿白皮书体例，逐条列出退役旧口径与对应新口径出处；整件单 commit 留痕。不采用 tricompany.md 式文内附录归档——project.md 旧内容以 git 历史为准即可，避免再次制造「正文+附录」的检索双源。
- 理由：留痕的目的是可追溯而非可检索旧叙事；白皮书修订 1/1a/1b 的头部修订说明体例已被验证可读。
- 修改建议：改写与 P2 位置裁决合并为同一 commit 序列执行。
- 验收锚：git log 可见单次改写 commit；改写稿头部有修订说明段且每条退役项带新口径出处链接。

**P5｜排期议题③「信息源优先级重排衔接」：改写稿必须建立信息源节并纳入 CLAUDE.md；CLAUDE.md 的登记义务归 CGR，本席配合。**
- 意见：同意 CEO ⑥——随宿主添加的文件（CLAUDE.md/AGENTS.md）必须进信息源清单。project.md 现无任何信息源清单；改写时按 CLAUDE.md 既有优先级序列建立：白皮书 → 架构文档 → CLAUDE.md → AGENTS.md → TriCompany workflow 文档 → registry；并在 CLAUDE.md 条目上注明「宿主随附渲染产物，变更走 fade 窗+CompanyGovernanceRegistry 登记提醒员工检查更新」。
- 理由：两件根文件的信息源口径若与 CLAUDE.md 优先级序列不一致，会产生第三套优先级叙事，违背真源唯一性。
- 修改建议：tricompany.md 改写时同样补齐（其现元信息块只有 sourceOfTruth/syncMode/sourceRevision/lastSyncedAt，无信息源优先级节）。
- 验收锚：两件改写稿各含信息源节，序列与 CLAUDE.md「Registry Routing/Source of Truth Order」一致且含 CLAUDE.md 条目。

**P6｜文档元信息头缺失：补 sourceOfTruth/syncMode/lastSyncedAt 三字段。**
- 意见：project.md 无文档同步元信息块，违反文档元信息头约定（§3.4 规范）。
- 修改建议：改写时补齐；syncMode 建议 source-only（项目总述自持）或 published-summary（若改写为白皮书的导览投影，须写明上游）。
- 验收锚：头部元信息块三字段齐全，且与 P1 确定的身份自洽。

**件一无意见维度**：project.md §1.1/§9 引用的 8 个 workflow 资产（terminology.md、wsdd-v1.md、workflow-engine-spec.md、workflow-engine-config.example.yaml、phase-result.schema.json、quality-gates.schema.json、workflow-runbook.md、pr-description-waterfall-alignment.md）经实盘核验全部存在于 `docs/workflow/`——无死链意见；§3 十阶段/IPD 定位表述与白皮书无直接冲突（IPD=员工参与核签机制、TriDev 承接 phase engine 的分权写法与架构文档 §4 TriDev/TriCompany 两行一致），流程细节归属 CPO/CTO 席，本席无意见。

## 件二：tricompany.md（根，44014B，V1.0 中央追平版，2026-08-07）

**T1｜双源关系断链（主焦点）：同步元信息名实错位，须重新登记；属事实回填，非裁决面。**
- 意见：元信息块声明 `sourceOfTruth: TriCompany/tricompany.md` + `sourceRevision: sha256:8d89…` + `lastSyncedAt: 2026-08-07`（tricompany.md:9-13），但源侧该文件现为「赛博公司宪章 V1.0」体（77 行，2026-08-01 生效，与摘要内容完全不同构）。且同一指针在 §1 第 2 条又承担「TriCompany 公司宪章」真源身份（tricompany.md:24）——一个指针、两种身份。无论 2026-08-07 同步时源文件是旧长文还是宪章，现行「摘要↔源」对应关系都无法成立：元信息不可信。
- 理由：CLAUDE.md 真源序规定 source-side wins、published copies follow；同步元信息失效时，读者无法判断摘要哪一段仍代表源侧现状——这正是「大量过时叙事」的结构性根因之一。本 spawn 会话无 shell 工具，sha256 现算留执行窗，但文档身份证据已足以定性行动。
- 修改建议：不改商业语义，只做登记修正——由 TriCompany 管理 agent（事实回填链）重算 sourceRevision、刷新 lastSyncedAt，并把「宪章指针」与「摘要同步源」拆为两条目（宪章指针指向宪章；同步源声明改为「按源侧宪章+product/code/employee registry 追平」或直接改为指针聚合，视 CGR 登记口径）。
- 验收锚：元信息块 sourceRevision 与源侧现文件实算一致；§1 内不存在同一指针双身份混用；改写稿 commit 留痕。

**T2｜§1 真源分工清单修正：移除 project.md，白皮书 docs/ 路径正确，架构文档角色写法正确。**
- 意见：§1 第 1 条「总商业模式、模块边界和正式宿主裁决：docs/tmv-whitepaper.md、project.md、docs/三元宇宙架构与模块说明.md 与中央 BusinessStrategy」中 project.md 须移除（理由同 P1）；白皮书路径写 `docs/tmv-whitepaper.md` 正确（已迁）；「中央 BusinessStrategy」作为裁决主体入列正确。
- 理由：与 CLAUDE.md 降权警示及本席信息源优先级对齐；真源分工清单是双源关系的总开关，此处不清，下游每节都会继续生产过时引用。
- 修改建议：第 1 条收敛为「docs/tmv-whitepaper.md + docs/三元宇宙架构与模块说明.md + 中央 BusinessStrategy」。
- 验收锚：改写后 `rg "project\.md" tricompany.md` 零命中（或仅存历史版本记录表中的文件名提及）。

**T3｜过时商业口径清点（现行部分 §1-§11，本席域内）。**
- 意见：四项须处理：
  1. §5.3「TriCompany 的正式模块地位仍待中央 BusinessStrategy 裁决」（tricompany.md:117）：**已过时**。白皮书 §3.3.1（v1.0 修订 1b，CEO 签发 2026-08-22）已把 TriCompany 列入三元模块商业映射表「身份商业层 L2 组织身份→L3，商业角色=公司架构+用户系统+区块链+OPC」（tmv-whitepaper.md:305-316）。本席以商业真源席身份明确：**商业叙事面对 TriCompany 的模块地位无待裁分歧**。该句应改写为「已按白皮书 §3.3.1 入表；正式模块 registry 收口状态以中央收口流程登记为准」。另注：源侧 `TriCompany/docs/registry/business-state.md`（lastSyncedAt 2026-06-04）仍写「是否升级为正式模块仍待确认」（business-state.md:28），属模块 registry 滞后于白皮书的事实回填欠账，走回填链，不在本批裁决。
  2. §3「当前宿主：Copilot-host live；Copilot-host 仍是当前 write master」（tricompany.md:51-52）：与 CLAUDE.md「Active runtime: `.claude/agents/` (primary), `.github/agents/` (Copilot-host entry)」存在时序差。**宿主现状判断属中央战略保留权，标注待确认候 CEO**——本席只指出两处口径不一致，不判定孰真；改写窗按 CEO 现行裁决更新，宿主切换语义（「Copilot-host live ≠ 正式宿主切换」边界声明）本身仍有效、保留。
  3. §3「当前 MVP 运行主链：TriMC -> TriModel -> TriStaciss -> Provider」（tricompany.md:54）：TriMC 命名过时（→TriMMC，白皮书修订 1 换轨）；主链是否仍为现行 MVP 表述未随 2026-09 实然（M面=claude code runtime，白皮书 §3.1 元虚拟最小实现）更新——改写时按白皮书 §3.1 重写，M/R 面实然/应然不混写。
  4. §10「下一步」三节（CPO/CTO/CEO总助任务清单，tricompany.md:192-210）为 2026-08-07 时点快照，多数已过时——归经营记录域（COS 面），改写时移入 operating-records 或删节，不随摘要正文长期滞留。
- 理由：均属「当前状态」类商业事实表述，过期即误导；其中第 1 项是本席职权内的直接定谳（白皮书已签发即为商业真源现状），第 2 项是保留权事项故挂起。
- 修改建议：四项全部进改写稿的「旧口径退役/更新清单」。
- 验收锚：`rg "待中央 BusinessStrategy 裁决|write master|TriMC ->" tricompany.md` 改写后仅存在于版本历史/退役清单节。

**T4｜附录 V0.1 设计稿（约 60% 篇幅）：历史冻结豁免，不改写；检索防误引建议一条。**
- 意见：附录（tricompany.md:222 起含 40 美元月成本、三条首发方向 A/B/C、销售总裁、DAO/股东会自动化等已退役商业口径）已有显式归档横幅「仅保留演进证据，不再参与当前标题和执行口径」，且 §9 退役清单逐条否认了这些口径（tricompany.md:180-190）——按红线标注**历史冻结豁免**，本席不要求改写或删除。唯一意见：附录占全文约 60%，是检索/引用误染的最大来源，建议在 §1 文档定位处加一行显式指引「附录为历史归档，任何检索、引用与 registry 回写不得以附录为现行口径来源」；是否将附录外移为独立归档件（如 docs/execution/archive/）属处置形态选择，标注候 CEO，默认不动。
- 理由：豁免的对象是内容，不是风险——「TriCompany 叙事」与白皮书 §3.3 的边界争议实务中大多来自旧稿被当现行口径引用，一行指引的成本远低于外移的引用修复面。
- 验收锚：§1 含附录防误引指引行；附录正文一字未改（diff 可验）。

**T5｜「TriCompany 叙事」与白皮书 §3.3 的边界（主焦点·定性）：叙事收口于经营载体身份，不重述商业模式。**
- 意见：白皮书 §3.3.1 给 TriCompany 的商业角色=身份商业层「公司架构」；其叙事正当边界=定义「谁来做、按什么标准做、如何参与和核签」（宪章第二节同口径）。根摘要现行部分基本守在此边界内（§1 真源分工已向白皮书分权、§2 边界声明明确「不替代 BusinessStrategy 做总体商业裁决」）；越界风险点只有两处且均已处置：§1 误列 project.md（T2 修正）、附录旧商业策略稿（T4 豁免+防误引）。**结论：收敛/分权方向正确，重复度问题集中在「当前状态」节（T3）而非「商业模型」节——摘要不重述白皮书商业模型，此结构保留。**
- 修改建议：改写时维持「总商业模式只指针不重述」原则，明确写入 §1。
- 验收锚：改写稿无商业模式复述段（愿景/通证/路线图等白皮书专有内容零重复），§1 含「不重述、只指针」原则句。

**T6｜无意见维度**：§2 边界声明五条（不含已列入 T3 的命名项）内容有效；§4 岗位/owner 表述与宪章 V1.0 一致（13 人名册、owner 矩阵无出入——红线项核验通过）；§8 公司级执行链与宪章第四节一致；§9 退役旧口径清单本身正确且应保留（它是本件少数「越新越好」的节）。

## 排期议题三点汇总表态（对应 CEO 议题①②③）

- ①移入 docs/：P2——两案并列，商业面不设否决，推荐方案 A（根位改写为项目总述），候 CEO 拍板。
- ②整体改写留痕处置形态：P4（project.md=版本升级+修订说明+单 commit，git 历史为归档）；T1/T3/T4（tricompany.md=登记修正+状态追平，附录豁免不动，另加防误引指引）。
- ③信息源优先级重排衔接：P5——两件改写稿建立与 CLAUDE.md 一致的信息源节，纳入 CLAUDE.md 条目并注记 CGR 登记义务；衔接顺序建议「先改 tricompany.md §1 真源清单（开关），再改 project.md（本体），后补两件信息源节（收尾）」，避免中间态出现第三套优先级。

## 红线标注汇总

- 裁决面分歧挂起不拍板：T3-2（宿主 write master 现状）待确认候 CEO；P2（project.md 物理位置）候 CEO；T4（附录是否外移）候 CEO。
- 保留权事项：正式宿主切换语义（T3-2/T3-3 中只更名不改语义）；V1 定义（P3-2——改写稿不得自行定义，指针白皮书 §8）；模块边界重定义（本批无新增边界变化主张，白皮书 §3.3.1 现状即为边界基线）。
- 历史冻结豁免：tricompany.md 附录 V0.1 设计稿（T4）。
- 本席职权内直接定谳一条：TriCompany 商业叙事面模块地位无待裁分歧（T3-1，依据白皮书 §3.3.1 已签发入表）。

——BS spawn 签发，2026-09-11 +0800（本 spawn 会话无 shell 现查分钟级时点，精确时点以本件 git commit 时间为准）

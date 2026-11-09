# recon-fsd-r1-tritraining-batch3 · R1 勘定卷（FSD 施工侧）

- sourceOfTruth: 本卷（R1 勘定正身·FSD 施工侧——呈 RDT 对表 + COO 三方锁值后进施工轮）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 写前现查读数: 2026-11-04T15:33:08Z（date -u 原值）
- 令源: COO R1 扩批令 2026-11-04T15:18:46Z（CEO 2230/2233 承接·两轮拆 10+3·护栏四条）+ RDT 勘十二对表要点单 2026-11-04T15:24:07Z（TC 17c071498·六件组工单+review 增补⑧⑨）
- 上游: 勘十卷 6edfa1356（扩批 R 域序）·勘七 9a73a35bf（批二工单源）·批二 e40c069（TriTraining 三件+course-graph·护栏锚承启）
- 圈定: 勘八池 13 件（护栏②·圈外零触碰）
- 纪律: 先勘后写（勘不到写待确认不硬引）·活体现勘读数随件留痕（勘十二⑧）·自报命中集必注 grep 口径（勘九承袭·护栏③）

## 一 · 活体现勘读数汇总（先勘后写·当次实勘全录）

| # | 勘项 | 读数 | 锚 |
|---|---|---|---|
| A1 | source-kit CLI 子命令面 | 三子命令 `{generate, validate, check-sync}` 在役；`check-sync --help` 三旗 `--source-root/--employee-id/--all` | `TriCompany/runtime/cognition/employee_source_kit.py` 真跑 |
| A2 | validate MVP | `--employee-id rd-trainer` RC=0 跑通（rd-trainer 在 source-agents/ 17 目录谱内在役） | 真跑 |
| A3 | host-publish CLI | `--support-root` help 直书 "Path to TriCompany-host-assets"；六符号族全在 `host_object_generation.py` | `--help` 真跑+实勘 |
| A4 | host-publish 聚焦验证 | 55 tests FAILED（failures=1）：`test_publishes_all_declared_employees` 期望谱硬编码 13 席 vs 实际 DECLARED 已含 product-manager（第 14 席）——**测试期望滞后债非课程命令坏（54/55 过）**；TC 仓测试债升 CTO 域·本席不擅修 | unittest 真跑 |
| A5 | `--host` 多宿主面 | `{copilot, claude, claude-session}` 三值活体在役（source_publish_check --publish-agents 面） | `--help` 真跑 |
| A6 | 路径存在性五断言 | ① `TriTraining-copilot-host-assets` **不存在**（断链坐实）② 协议正身 `TriCompany/docs/workflow/host-object-publish-flow.md` **在位** ③ `TriMetaverse/docs/training/tritraining/` **不存在**——中央聚合面现势=docs/training/ **顶层平铺**+tricompany/ 子目录 ④ `TriMetaverse/TriCompany-host-assets/TriTraining/` **不存在**——TriTraining 宿主侧零 published copy（支撑根顶层=README/_archive/host-object-manifest.json/knowledge/runtime）⑤ TMV 中央副本回链**已修**（sourceOfTruth→TriTraining/docs/training/·lastSyncedAt=2026-06-14 内容滞后=聚合面同步债·圈外） | ls/grep 真跑 |
| A7 | 样板 JSON | 四件在位（两系 × TriAvatar lesson page + TriStaciss lab submission） | Glob 实勘 |
| A8 | live entry 渲染化（beginners-guide §10 item3 三态确权） | **已落地**：liveEntry/hostEntries 双轨注释+`HOST_ENTRY_LIVE_STATUS="current-host-live"`+「统一发布管线从 manifest target 经宿主注册表渲染派生」 | `host_object_generation.py` L36-48/99-103 |
| A9 | lab-manual L67 调用链锚 | `source_kit_paths` L143 定义在役；`normalize_workspace_id` 经 `knowledge_workspace` import（L16）——调用链叙述成立零改 | grep 实勘 |
| A10 | source-kit 函数族零漂复核 | generate_employee_source_kit/validate_employee_source_kit/_render_source_kit 与课程叙述零漂 | 实勘承前窗 |

**grep 口径注**（护栏③）: 本卷 TriMC/TriLC 命中读数一律裸名词面（`TriMC|TriLC` 字面）；批二所用复合 named-drift 模式读数已在批二自报中注口径，不混用。

## 二 · 13 件逐件判定

| # | 件 | 行数 | 判定 | 漂移点 |
|---|---|---|---|---|
| 1 | employee-source-kit-cli-course.md | 118 | **改·轻** | L109/L115/L117-118「待下一批迁移」三处过时（八件已在册·A6⑤ 中央已回链）；check-sync 命令族缺载。validate MVP/函数族零漂（A10） |
| 2 | employee-source-kit-cli-lab-manual.md | 106 | **改·轻** | L52-56 --help 清单缺 `check-sync --help` 条；L67 调用链零改（A9 实锚成立） |
| 3 | employee-source-kit-cli-lesson-contract.md | 144 | **改·轻** | L116「main() 到 generate/validate 的调用链」缺 check-sync 同族一句；L137-138/L144 零漂 |
| 4 | employee-source-kit-cli-lab-contract.md | 130 | **零改动** | L42 同 rd-trainer id 零漂实证/L123 镜像路径零漂/L130 example.json 在位（A7）——轮内占位报判定 |
| 5 | employee-host-publish-pipeline-course.md | 124 | **改·轻** | L17「Copilot-host 阶段」宿主叙事过时（→双宿主现势·A5 活体锚）；L121-124「待迁移」过时；L55 unittest 三模块/L62 binding 落点零漂 |
| 6 | employee-host-publish-pipeline-lab-manual.md | 107 | **零改动** | L53-55 三 --help/L61 聚焦验证/L67 调用链全零漂（A4 读数如实注记不入正文——测试债非课程面）——轮内占位报判定 |
| 7 | employee-host-publish-pipeline-lesson-contract.md | 149 | **改·轻** | L143 `TriCompany-copilot-host-assets/docs/workflow/host-object-publish-flow.md` 断链（A6①）→改写 `TriCompany/docs/workflow/host-object-publish-flow.md`（A6② 在位）；L115-118/L137-142 零漂 |
| 8 | employee-host-publish-pipeline-lab-contract.md | 132 | **改·轻** | L126 同族断链（同 #7 目标）；step contracts/字段面零漂 |
| 9 | TriTraining 根 AGENTS.md | 33 | **改·候裁** | L32 纪律行引用两旧名（`TriMetaverse/docs/training/tritraining/` A6③ 断链 + `TriTraining-copilot-host-assets` A6① 断链）——禁写语义成立、路径叙述断链；L11-13 状态行「不开工写业务代码」零冲突（业务代码≠培训文档）判定不动 |
| 10 | TriTraining 根 README.md | 8 | **改·轻** | L6「待 CPO/CTO 联审确认」滞后 vs AGENTS.md L11「2026-07-17 CPO 产品定位完成」；「training 真源入口初始化」→现势在册规模（两系四件套+baseline+图谱+架构+cc-tutorial 四件） |
| 11 | tritraining-lesson-lab-contract-baseline.md | 177 | **维持+一处候裁轻笔** | 判据④三对表毕：纪律面（vs 根 AGENTS.md L31 三区分纪律）吻合+字段面/两段式执行/CodeGraph 规则零漂+件组①② contract 活体样本（结构字段对照）吻合——**「现役观察」维持**；唯 L32 中央路径 `TriMetaverse/docs/training/tritraining/` 断链（A6③）=一处轻笔候选（注记形 vs 正文现势化形·候 RDT 裁·倾向注记形——baseline 系合同基线件非叙事件） |
| 12 | training-pack-migration-plan.md | 37 | **定性处置·候裁** | 定性=**历史规划档**（L5「迁移已完成当前计划批次」·三批完结·L35 中央副本回链已修=A6⑤ 实锚）；漂移三点：L21/L36 旧宿主根名两处（A6①·宿主侧 published copy 至今未生成=A6④·L36 悬置项 CPO/CTO 评估未做）+L15/L20 中央路径断链（A6③）+无元信息头。处置两案候 RDT 裁：a) **历史档封存形**（补元信息头+as-of 注记「本件系已完成批次的历史规划档·路径/宿主名叙述系当时形态」·正文零改写——倾向·历史叙事冻结纪律）b) 轻改写形 |
| 13 | cc-tutorial/agent-core-v0.1.0/01-小白版.md | 111 | **零改动维持**（工单⑥预期达成） | TriMC 唯一命中=L8 勘误头 meta（批二已定性·合法引文除外）；两留置观察项入卷（§七·不擅改） |

**顺带面（不计池件）**: beginners-guide（批一已闭）§10 三项三态确权=**全「已落地」**——item1 多宿主统一渲染模型（A5 --host 三值）·item2 binding 派生化（BINDING_PROFILE_REL_DIR=".github/binding-profiles" 现役+host-object-manifest.json 在支撑根顶层=A6④ 旁证）·item3 live entry 渲染化（A8）——§10 三条 rewrite 现势化+活体锚随轮 2 施工。

## 三 · 工单草案（工单先出后改写·候三方锁值）

| 单号 | 件 | 工单内容 | 活体锚 |
|---|---|---|---|
| W1 | #1 source-kit-course | as-of 勘误头 append（D-28 形）：三处「待下一批迁移」现势化（八件在册+中央回链已修）+check-sync 命令族补载一段（三子命令面+check-sync 功能一句） | A1/A6⑤ |
| W2 | #2 source-kit-lab-manual | L52-56 --help 面增 `check-sync --help` 条；L67 零改（A9 成立） | A1/A9 |
| W3 | #3 source-kit-lesson-contract | L116 调用链面补 check-sync 同族一句 | A1 |
| W4 | #4 source-kit-lab-contract | 零改动判定件（轮内占位） | A7 |
| W5 | #5 host-publish-course | as-of 勘误头：L17 宿主叙事→双宿主现势（--host 三值活体锚）+L121-124 待迁移现势化 | A5/A6⑤ |
| W6 | #6 host-publish-lab-manual | 零改动判定件（轮内占位；A4 测试债注记入本卷不入正文） | A4 |
| W7 | #7 host-publish-lesson-contract | L143 断链路径改写→`TriCompany/docs/workflow/host-object-publish-flow.md` | A6①② |
| W8 | #8 host-publish-lab-contract | L126 同族断链改写（同 W7 目标） | A6①② |
| W9 | #9 根 AGENTS.md | L32 两旧名处置三案候裁：a) 改写现役名 b) as-of 注记 c) 禁写语义保留+路径改现役描述（「中央聚合面 `TriMetaverse/docs/training/`」+「宿主支撑根 `TriMetaverse/TriCompany-host-assets`」）——倾向 c；**纪径件措辞权归 RDT/CAO 面·候裁不擅改** | A6①③ |
| W10 | #10 根 README.md | L6 状态行现势化：CPO 定位完成（2026-07-17·AGENTS.md L11 承引）+两轨制+training 真源在册规模+Phase 1 L3 业务代码未开工如实 | AGENTS.md L11-13 |
| W11 | #11 baseline | 维持「现役观察」+L32 中央路径一处轻笔（注记形 vs 正文形候 RDT 裁） | A6③ |
| W12 | #12 migration-plan | 历史档定性处置两案候 RDT 裁（§二 #12 列明·倾向封存形） | A6①③④⑤ |
| W13 | #13 01-小白版 | 零改动维持+两留置观察项候 RDT 一眼裁（§七） | §二 #13 |
| W14 | beginners-guide §10 顺带 | 三项 rewrite 现势化+活体锚落笔（三项全「已落地」） | A5/A6④/A8 |

## 四 · 同形件归类（同根因批量认知）

1. **旧宿主根断链族**（根因=宿主资产位 TriTraining-copilot-host-assets → TriMetaverse/TriCompany-host-assets 迁移期叙事未跟）: #7 L143 + #8 L126 + #12 L21/L36 + #9 L32（纪律引用形）+ beginners-guide L11 回链表 manifest 行（**工单外留置**）。
2. **check-sync 缺载族**（根因=CLI 三子命令面演进后课程材料未随）: #1 + #2 + #3 三件（A1 读数共享）。
3. **迁移态叙述族**（根因=三批迁移已完结而「待迁移」叙述未收口）: #1 L109/L115/L117-118 + #5 L121-124。
4. **中央路径断链族**（根因=中央聚合面已平铺重组、tritraining/ 子目录形态消失）: #9 L32 + #11 L32 + #12 L15/L20（A6③）。

## 五 · 轮拆 10+3 提案（锁值请求面）

- **轮 1（10 件池）**: W1-W10（四件套系 8 件——其中 2 件零改动占位（W4/W6）——+根 AGENTS+根 README）。改动落笔件=8。
- **轮 2（3 件池）**: W11 baseline + W12 migration-plan（候裁案落定后执行）+ W13 01-小白版（零改动·判定记录）+ W14 §10 顺带面。
- **计数口径注**: 每轮上限 10 件按**池件**计（零改动占位件占池位不落笔）——候 COO 确认口径。
- 施工轮性能读数承诺: 随每轮毕报（重件/轻件分列·批二 42min 基线对表）。

## 六 · 勘定段性能读数

- 耗时: 令达 15:18:46Z → 卷落 ≈15min（落笔现查 2026-11-04T15:33:08Z·commit 时戳终锚）。
- 件数: 池件 13 全读毕 + 圈外参照 3（TMV 基准 03-链路 124 行/TMV 中央副本头 grep/根件组）。
- 活体命令组: 6 组（A1+A2/A3+A4/A5/A6 五断言/A7/A8+A9）。
- 重件/轻件分列: 重件=两 course 稿（118/124 行）+baseline（177 行）+beginners-guide §10 定点（241 行文件）；轻件=contracts/manuals 机械面对表（106-149 行）+四小件（37/111/33/8 行）。
- token 面: 本席无 transcript usage 读数口——如实申报，性能口径=耗时+件数+命令组数（COO 要件面如实注）。

## 七 · 留置观察项与候裁面

**留置观察项（不擅动·候选 R 域后续轮或专窗）**:
1. beginners-guide L11 回链表 manifest 行旧根（工单外）。
2. TMV 中央聚合面副本同步债（lastSyncedAt=2026-06-14·批一/批二内容未随刷——圈外件·候 RDT 定后续轮/刷新窗）。
3. host-publish 聚焦验证 1 failure（TC 仓测试期望谱滞后 product-manager 第 14 席——TC 测试债升 CTO 域候窗·不擅修·A4）。
4. TriTraining 宿主侧零 published copy + migration-plan L36 悬置项（CPO/CTO 评估未做·A6④）——事实入卷不裁。

**候裁面汇总（三方锁值请求）**:
- 候 RDT: W9 三案选型（倾向 c）·W11 轻笔形选型（倾向注记形）·W12 处置形选型（倾向封存形）·W13 两留置观察项裁（消费者枚举两家 vs 04 补笔③ 三家口径差=「package.json 硬锚消费者」vs「依赖方向叙事宿主」之别非矛盾；TriRMC「主控中心」描述词面属弱化=R 面河源服务域易与 sg M 面主控 TriMMC 混淆·白话语境可容忍）·W14 §10 rewrite 确认。
- 候 COO: 轮拆 10+3 锁值+零改动件占位计数口径确认。
- 施工当次实勘缺口: **无**（A9 已预关 source_kit_paths——先勘后写缺口全清）。

## 八 · 使用依据

- COO R1 扩批令 2026-11-04T15:18:46Z · RDT 勘十二对表要点单（TC 17c071498）·勘十卷 6edfa1356 · 勘七 9a73a35bf · 批二 e40c069
- 池件 13 全文直读（TriTraining/docs/training/ 8 系件+baseline+migration-plan·TriTraining/cc-tutorial/01-小白版·TriTraining 根 AGENTS.md+README.md）+ beginners-guide §10 段 + 批一闭面承前窗
- 活体现勘 A1-A10（TriCompany/runtime/cognition/ 真跑+grep·路径断言 ls/Glob·TMV 副本头 grep）
- 纪律: D-28（勘误头 append-only）·D-46（值面掩码——本卷无值面涉密）·D-47（卷面时戳=commit 时戳）·历史叙事冻结（truth-record 口径）

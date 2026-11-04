# recon-rdt-seg2-tritraining · 段二内容面细勘卷（TriTraining 过时勘定·RDT content owner）

- sourceOfTruth: 本卷（段二勘定·RDT 内容面细勘正身——与 FSD 机械对表卷 recon-fsd-seg2-tritraining.md 合卷用）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘席: RDT 小吴（COO 协同令 2026-11-04T12:27:38·FSD 协同信 12:29:45 接读）·施工=FSD·护栏锚已先置（FSD 勘三：回滚锚 8b3e4ec+范围圈定+review 关卡）
- 勘定判据（COO 令原文）: 版本面/命令面/链路面 vs 现役对表

## 勘一 · 范围与清点对表（与 FSD 勘一合卷）

- 本席全量清点三仓培训面：TriTraining 19 md（cc-tutorial 5＋docs/training 14）＋TriMetaverse/docs/training 24 md＋TriCompany/docs/training ~51 md。**首跑试跑范围=FSD 圈定 TriTraining 19**（回滚锚 8b3e4ec 圈定面）；双仓面勘定读数见勘五（后续批协调面，不入首跑）。
- FSD「employee-host-publish 系 6 件/employee-source-kit 系 5 件」计数勘正：md 实数 host-publish 5（含 08-19 beginners-guide）＋source-kit 4，另有 example json 4 件不计 md；14 md 总量与 FSD 一致。

## 勘二 · cc-tutorial 漂移实锚（比 FSD 勘二扩面：漂移笔数 2→9）

**指纹失效实锚（本席 12:33 现勘）**：`git rev-parse HEAD:packages/agent-core` = `dbd8d6201b70718d5d723733bc7a02bc15e2ad06` ≠ README 绑定表 `d90121d41f5f22c512ec73d01ccb6c7e89c30677`。本席 10-09 曾报「零漂移闭环」——该结论只验证了指纹记录内部自洽（绑定提交的树哈希=记录值），未验 HEAD 树；**现予勘正：漂移实锤，10-09 结论作废面以本卷为准**。

08-25 快照（3c3cee1b）后触及 packages/agent-core 实质提交共 **9 笔**（git log 直读）：

| commit | 日期 | 触面 | 教程受影响面 |
| --- | --- | --- | --- |
| bdb3a6a | 08-25 | TC-1 续跑注入（loop，默认关） | 03/04 loop 行为论断 |
| 70c0e9a | 08-26 | **maxTurns 默认 25→100** | 04 引文 `options.maxTurns ?? 25` 直接过时（实锚命中） |
| fabcbef | ~09 | P0-1/P0-3 路径边界+内容匹配修复 | 03/04 permissions 行为 |
| 14499e5 | ~09 | P0-2/P0-4 acceptEdits+spawn 透传；**loop 缺省 bypassPermissions→default（fail-open→fail-closed）** | 03/04 缺省模式论断 |
| 95d8713 | ~09 | 测试补录 | 行锚/测试引用 |
| e64aa4c | 09-02 | register() minTier | 03/04 registry 论断 |
| dae657c | 09-04 | **contract v3.1 fixture（valid-v31.contract.yaml）** | 04 合同版本面；README 真源节「合同 v3 规格」指针 |
| 2fb1292 | 10-02 21:25 | 合同 v3 Registry family 分支（+44/−6 agent-contract.ts） | 03/04 合同校验论断（FSD 已锚） |
| 1d52c20 | **author 10-09 10:35:15 / committed 10-14 10:49:01**（%ad/%cI 双日期字段分野·两读数皆机真值·12:43 对表定谳；本卷初勘指 FSD「误读」系己方误判·一并勘正） | scheduler cron stale 守卫+settle 兜底 | 04 scheduler 论断（sched 讨论面 35 处命中最高暴露） |

**关键定性**：漂移非首跑窗内新发生——10-02 勘误批（8b3e4ec）落笔时点前 6 笔已在，该批只修正名/图/外锚**未消化内容漂移**，且当时指纹表「最近实质提交 2026-08-25」已失真。cc-tutorial 判定=**部分漂（原地修正档）**，per README 自身「小漂移」规则。

### 逐件分级（cc-tutorial 5 件）

| 件 | 判定 | 实锚 |
| --- | --- | --- |
| README.md | 部分漂·**批一** | 指纹表重锚（目标：绑定提交→`1d52c20`，树哈希→`dbd8d620`，最近实质提交→2026-10-14T10:49:01+08:00（%cI 落地口径·勘误记录内附 author 10-09 10:35 分野注记一行防再撞），版本 0.1.0 不变；已验 `rev-parse 1d52c20:packages/agent-core`=`dbd8d620`）＋勘误执行记录续条 |
| 01-小白版 | 现役（观察） | TriMC×0·无行锚·概念面；全景图 10-02 已修 |
| 02-产品版 | 部分漂·**批一** | TriMC×5 全叙述（无源码引文，上下文逐条验过）；**语义级**：图节点「TriMC 现役主控→TriRMC 迁移中」系旧迁移弧线叙事，现役=四 daemon 矩阵并行（TriMMC/TriMLC/TriRMC/TriRLC），review 判据见勘四 |
| 03-代码引导版 | 部分漂偏重·批二 | TriMC×4·loop.ts 引文语境·scheduler×14·行锚族待复勘 |
| 04-代码复刻版 | 部分漂最重·批二主件 | `maxTurns ?? 25` 引文实锚、contract v3→v3.1、Registry family 新分支、defaultMode fail-closed 化、cron stale 守卫、TriMC×3（MIGRATION 蓝图引文按「引文除外」原则勘定） |

## 勘三 · docs/training 14 件分级（面扫：TriLC/TriMC/FADE/五件套/双宿主/binding 标记谱）

| 族 | 件 | 判定 | 依据 |
| --- | --- | --- | --- |
| host-publish 系 | chain-beginners-guide（08-19） | 部分漂轻·**批一** | 时锚最新+结构面含五件套/双宿主/binding 现役标记；正名欠账 TriMC×6+TriLC×2（宿主切换 doctrine 句，语境保语义） |
| host-publish 系 | course/lab-contract/lab-manual/lesson-contract（06-14） | 过时嫌疑重·批三 | 时锚早于 09-04 后管线全部演进（session-body 面/D 系合同/发布管线多轮）；四件零现役标记=缺新面；需内容级重勘非机械更新 |
| source-kit 系 | course/lab-contract/lab-manual/lesson-contract（06-14） | 过时嫌疑·批三 | 06-14 时锚；CLI 命令面对表现役 source-kit CLI 待勘；TC 仓 LearningToPractice/CLI 有 06-10 同族镜像 |
| tritraining 系 | ai-course-graph（06-14） | 部分漂·**批一** | 正名×3＋课程清单面 refresh 判据 |
| tritraining 系 | curriculum-architecture（06-14） | 部分漂·**批一** | 正名×4（模块枚举清单） |
| tritraining 系 | lesson-lab-contract-baseline（06-14） | 现役观察·批三 | 合同基线件·面扫零漂移标记；候 TriTraining AGENTS.md 对表 |
| 其他 | training-pack-migration-plan（06-14） | 过时/历史档候选·批三 | 计划件·迁移落地态候定性（定谳前不动） |
| 其他 | README（06-14） | 轻勘·批二 | 索引件·08-19 beginners-guide 入索引与否候勘 |

## 勘四 · 首批 N≤5 施工勘定提案（裁③·报备件）

**N=5**，选件判据=首跑验证机制为主：漂移点可名指（diff 可验证）/件小/moderate 风险/覆盖多类漂移（机械正名+指纹重锚+清单刷新+语义句）：

1. `cc-tutorial/agent-core-v0.1.0/README.md` — 指纹表重锚＋勘误执行记录续条（勘二目标值已验）
2. `cc-tutorial/agent-core-v0.1.0/02-产品版.md` — TriMC→TriMMC 正名×5＋迁移叙事 refram
3. `docs/training/tritraining-ai-course-graph.md` — 正名×3＋清单刷新
4. `docs/training/tritraining-trimetaverse-curriculum-architecture.md` — 正名×4
5. `docs/training/employee-host-publish-chain-beginners-guide.md` — 正名×8（doctrine 句语境保语义）

**review 关卡判据（本席 review 面验收线）**：
- 不许裸字符串替换掩盖语义漂移：02 图节点句/beginners-guide 宿主切换句必须按四 daemon 矩阵现势 refram，非 TriMC→TriMMC 直换了事（「TriMC 现役主控→TriRMC 迁移中」→「TriMMC=M面 sg 主控·与 TriMLC/TriRMC/TriRLC 四 daemon 并行」向）。
- 勘误 as-of 头必须随改写追加（D-28 时点纪律）；cc-tutorial 件同步续勘误执行记录。
- 引文除外原则延续：源码引文/蓝图引文/勘误记录 meta 文本不动。
- 改写产物只落工作区（FSD 护栏③）·diff 呈本席·PASS 后人工提交。

## 勘五 · 双仓镜像面注记（后续批·不入首跑圈定）

- TMV/docs/training 持 host-publish/source-kit/tritraining 同名族（06-14/15 时锚·「发布侧摘要」形）＋TC 仓 LearningToPractice/CLI 同族——**TriTraining 正身更新后镜像件需同波对齐**（批量小·候首跑机制验证毕随批二/三并窗）。
- TMV/TC 仓其余 ~75 件（tricompany 课程包 06-04 四件套/IPD 族 07-0x/FADE 总览 08-28 族/04-29 三件等）分级另卷（本席候办池·不入段二首跑）。

## 勘六 · 首跑 review 留痕（本席 review 关卡·裁③护栏③）

- review 时点：2026-11-04 12:49-12:5x（FSD 12:49:13 交件信·工作区 5 modified +29/−24 零意外件零 commit）
- **判据四条逐条 PASS**：①refram 非裸替换实锚=02 四处（双面表/§2 叙事/图节点/迁移语境条）按两面四 daemon 矩阵 refram+迁移叙事转演进档案口径（MIGRATION.md 指针保留档案化）；beginners-guide doctrine 句语义括注（「正式宿主切换=M 面 daemon 主控位变更事项」）+§8 误区表左格引述形保留加「历史词面」注=正确档案实践（改写引语内词面会伪造历史引文）②勘误 as-of 头五件全带（D-28）+README 勘误执行记录 2026-11-04 条（9 笔清单/重锚验证读数/双日期分野注记/批二顺延注记全在）③残留独立复验（本席 grep 五件全量）=命中全数定性勘误头 meta/引述形带档案注/10-02 历史勘误条，零漏勘零越界（FSD 残留断言独立复核吻合）④零 commit 维持·5 modified 对表
- **指纹表逐值独立对表 PASS**：绑定提交 `1d52c20ca3c617bee0e961ff5bc85393920d454e`/树哈希 `dbd8d6201b70718d5d723733bc7a02bc15e2ad06`/最近实质提交 2026-10-14T10:49:01+08:00（%cI 口径+分野注记）/包版本 0.1.0——与本席 12:33-12:43 独立验读全同值
- **候后续批登记（非 PASS 阻塞）**：①beginners-guide §10 三规划项现势对表=批三——§10 item 1「当前仍是拷贝式」疑部分过时（旁证：本席 session-body footer 即由统一发布管线 `--host=claude`/`--host=claude-session` 渲染生成；ade-consolidation-proposal.md :68 已载 --host 规格；**:5 状态行仍书「CEO 已采纳（2026-08-19）待分阶段执行」=proposal 自身账面滞后观察注·非培训域修面**）·确权候发布管线现勘后 rewrite；②ai-course-graph §8 图节点物态刷新=批二可选（勘误头注记形态首跑已成立·§8 正文只述挂接无存在性断言）；③03/04 批二主件照勘二 named-drift 表
- **首跑机制验证读数（裁③主判据）**：首过零 rework·零范围越界·零引文损·判据四条全过——自动更新机制首跑验证达成面成立

## 勘七 · 续跑批二勘定（COO 协同令 2026-11-04T22:14:52Z·勘定 owner·扩批 N 值供数）

**范围重定基（22:2x 实勘）**：TriTraining 仓现顶已非 8b3e4ec——SDE docs-maintenance 批 2/3/4b 并行施工毕（08cdb1f 规范头 6 件/7fffb25 版本行迁移 14 件 v0.x→1.0.0 四档规则/070f4de 跨仓索引改写 2 处）。本卷勘三中 docs/training 面三件候勘项已被 SDE 消化：断链已修（beginners-guide L44 改 `../../../TriMetaverse/...` 三级跨仓路径+「在 TriMetaverse 仓」注）、版本行已迁（1.0.0 起算·与备料卷建议一致）、索引已改写（README 挂 beginners-guide+D-47 形头）。**批二收敛=cc-tutorial 03/04 主件**（README 勘误记录顺延条款「四件套正文行为面增量批二细勘消化」的正身）＋ai-course-graph §8 图节点刷新（轻·可选）。

**扩批 N 值提案（候 FSD 施工勘定·报备入账）**：**N=3**（04+03+course-graph §8）。04 为重件——改写须 section-scoped（按下列工单逐节，禁全文重生成）。

### 04-代码复刻版 named-drift 工单（L 号=现卷行号）

| # | 位置 | 漂移点 | 现役真值（源码 diff 实锚） |
| --- | --- | --- | --- |
| 1 | L64 引文块 | `options.maxTurns ?? 25` | 70c0e9a（08-26）默认 25→100 |
| 2 | L84 | 「loop.ts:295 默认最多 25 轮」+默认权限模式句 | 锚顺移+25→100+缺省模式 `default` 化 |
| 3 | L278/L589 | 「缺省 bypassPermissions（loop.ts:340）」+已知缺口①「缺省权限面过宽」 | **14499e5 已修**（fail-open→fail-closed）——已知缺口项须改「已修复 as-of」态，锚 ：340 复勘 |
| 4 | L376/L402 引文区 | spawn config `?? 10`+contract schema `family: z.enum(['Role','Registry'])` 引文段 | 2fb1292（+44/−6）：PathsSchema Registry family 可缺+superRefine Role 分支强约束（io_contract Role 形 Required）——引文逐段对新 HEAD 复抄 |
| 5 | L389-430 §9 合同 v3 节 | 合同 v3→**v3.1**（dae657c valid-v31 fixture）+L426 引文串对新源复核 | 版本面更新 |
| 6 | L498 | executeJob `:127-169` 纪律叙述（跑完重 load freshJob 再写） | 1d52c20（+65）：stale 守卫+settle 兜底——叙述增补+锚复勘 |
| 7 | L533/L542/L545 | API 表锚（loop.ts:99-148 等）+AgentLoopOptions 字段清单 | bdb3a6a TC-1 `continueMaxRounds` 新增（04 现零命中=清单缺项）+锚族复勘 |
| 8 | L43 | TriMC→TriMMC 叙述（宿主枚举） | 四 daemon 矩阵正名 |
| 9 | L45 | MIGRATION.md:14 蓝图引文 | **引文除外不动**（同首跑档案化原则·可加演进档案括注） |

### 03-代码引导版 named-drift 工单

| # | 位置 | 漂移点 | 处置 |
| --- | --- | --- | --- |
| 1 | L52/L54/L55 | 锚 `loop.ts:292`/`job-executor.ts:32`/`agent-contract.ts:71`+`resolver.ts:48` | 三源文件 +38/+65/+55 行——锚族全量复勘 |
| 2 | L157 | 「裸调 agentLoop 默认 bypassPermissions（loop.ts:340）」 | 14499e5 已改 fail-closed——叙述反转+锚复勘 |
| 3 | L145 | `TRILC_PERMISSION_MODE`（缺省 bypassPermissions）+app.ts:1014-1053 锚 | TriRLC 仓侧行为——候勘 TriRLC 现源再定性（agent-core 改缺省≠app env 缺省必改·禁推定） |
| 4 | L100 | 「TriMC 连接正常时代理转发」+app.ts:2062 锚 | TriMC→TriMMC 正名+锚复勘 |
| 5 | L20/L48 | TriMC 残余两处（长行截断外待逐条定位） | 逐条定位：叙述正名/引文除外 |
| 6 | L139 | app.ts:1117-1153 healthz 锚 | TriRLC 仓侧锚候勘 |
| 7 | L128 | `maxTurns: 5` 示例调用值 | 用户设定值非默认值断言——验上下文后大概率不动 |

### review 关卡判据（批二承袭+增补）

首跑四条承袭（refram 非裸替换/勘误 as-of 头/引文除外/落工作区不提交）＋批二增补：**⑤行为面改写须逐条对应本工单系锚**——每处改动可指认「工单 #N」；**⑥引文块复抄须对新 HEAD 逐字**（agent-contract.ts/loop.ts/job-executor.ts 三文件现 HEAD 版本为准），禁凭记忆补代码；**⑦04 已知缺口清单项「缺省权限面过宽」改「已修复」态须附 commit 锚**（14499e5）。

## 勘八 · 批三池（候批二毕勘定·本卷界内预告）

1. host-publish 系 4 件（course/lab-contract/lab-manual/lesson-contract·06-14）——内容级重勘：09-04 后管线演进（session-body 面/D 系合同/双宿主渲染落地）逐件对表；SDE 已迁版本行+规范头，内容面未动。
2. source-kit 系 4 件（06-14）——CLI 命令面对表现役 source-kit CLI。
3. beginners-guide §10 三规划项现势对表（勘六登记·ADE proposal :5 状态行账面滞后旁证在卷）。
4. lesson-lab-contract-baseline——TriTraining AGENTS.md 对表（现役观察升格判定）。
5. training-pack-migration-plan——迁移落地态定性（历史档 vs 在役计划）。
6. cc-tutorial 01-小白版——勘三「现役（观察）」维持，批三顺带复核全景图与四 daemon 正名面（TriMC×0 面扫·预期零改动）。

## 勘十 · 扩批全量划界报备（CEO 2230 扩批令·COO 知会 2026-11-04T14:32:13Z 承接·22:3x 清点）

**令承接**：段二续跑扩批全量（全模块所有 docs·CPO 基座已判可启）。COO 节奏两条采认：①review 关卡不降档（逐件 review PASS 方 commit·不设抽样率·轮间 CTO 门禁抽验候其另裁）②每轮件数施工勘定建议上限 10 件/轮（候 FSD 共同确认报备）。

### 全量清点读数（22:33 一轮脚本·md 件数分桶）

| 仓/域 | 总数 | 排除面 | 活文档勘定圈 |
| --- | --- | --- | --- |
| TriMetaverse/docs | 2380 | operating-records 2052＋memory 镜像 117＋archive 24＋runs 7＝2200 | **~180**（execution 151·training 22·engineering 22·registry 14·product 8·contracts 6·prd 3·testing 2·security 2·root 7）＋workflow 制度件 ~62（非OR 66−archive 4） |
| TriCompany/docs | 241 | operating-records 3＋archive 4＋agile-improvement 20＋IPD stage-packages 10（历史件候选排除·候 FSD 勘定） | training 47·testing 37·engineering 37·execution 11·registry 6·product 4·project-sources 2·workflow 制度件 ~53（非OR 90−排除面 37）＝**~197** |
| TriTraining | 26 | — | 21＋cc-tutorial 5：首跑 5 已闭＋批二 3 在途＋**余 ~13**（勘八批三池 11＋根 AGENTS/README） |

勘定圈合计 **~490 件**（排除面 ~2240·历史叙事冻结/镜像/归档语义不入过时勘定圈——判据：operating-records=运行痕迹按发生周冻结；memory=随仓镜像只增面；archive=冻结即其存在意义；runs=运行证据卷）。

### 分层勘定形（防 490 件逐件细勘不可行）

- **机械层全扫（脚本·不算轮）**：元信息头三件套（sourceOfTruth/syncMode/lastSyncedAt）有/无＋版本行形态（D-67 三段式 vs 旧两段式/无）＋markdown 链接断链扫——一轮出全量读数供分级供数。SDE 批 2/3 已动 TriTraining/TriCompany 部分件，机械层扫面顺带出「已带新规范头件数」对表。
- **内容级勘定（分域轮形）**：承袭首跑判据三读数（版本面/命令面/链路面 vs 现役）——只对高风险件逐件（特征=有时锚早于相关模块演进/含 CLI·API 命令面/含跨仓链接）；低风险件（纯叙述·近期时锚）域内批量快勘。每轮 ≤10 件·逐件 review PASS 方 commit。
- **域序提案（候 FSD 施工勘定共同报备）**：R1=TriTraining 批三收尾（~13 件·勘八池）；R2=TC training 47；R3=TC engineering+testing 74；R4=TMV training+engineering 44；R5=TMV workflow 制度件 62；R6=TC workflow 制度件 53；R7=TMV registry+product+contracts+prd+testing+security+root 42；R8=TMV execution 151（最大域·候 R1-R7 节奏读数再分轮）；R9=registry 系 6+product 4+project-sources 2。interleaved：CTO 门禁抽验轮间位。

### 划界报备要点（候 COO/FSD 对表）

1. 「全模块所有 docs」按本表勘定圈口径执行——operating-records/memory/archive/runs 四类排除面不入圈（过时勘定语义不适用·若 CEO 令意含运行痕迹整理另立案）。
2. TriCompany workflow 制度件与 TMV workflow 制度件含纪律册/D 系/工作流 SOP——**规范头/版本号梳理与制度真源面交叉**：纪律册等件是否挂 D-67 版本行属制度域裁量，勘定卷只出读数·裁决面候 CAO/CTO 域（本席不出制度裁决）。
3. execution 151 件含 fade-spec 系与执行计划件——其中已被后续演进取代的旧 spec 是「过时」高发域，但历史执行件与活规范分界候域内逐件定性（R8 前置细分级）。

## 勘十一 · 机械层全扫描读数（勘十确认后开跑·22:3x-22:4x 两轮脚本·516 件零错误）

**扫描口径**：勘定圈 516 件（TMV 297/TC 195/TriTraining 24——cc-tutorial 03/04 在途改写态跳过·TriTraining docs 根 SDE 探针件 1 件标注排除不入圈）；每件读头 8 行判 sourceOfTruth/syncMode/lastSyncedAt 三件套＋全文前 4000 字符判版本行形态。TSV 全量=`/tmp/docs-scan.tsv`（会话临时面·读数要义落本节）。

### 域级读数表（full=三件套齐/partial=有部分/none=无头；v1xx=D-67 三段式/vold=旧两段式）

| 域 | n | full | partial | none | v1xx | vold | 分级供数要点 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC workflow（制度件） | 51 | 10 | 2 | 39 | 35 | 4 | none 大头·但 v1xx 35=版本行普及率高——补头为主 |
| TC training | 47 | 20 | 18 | 9 | 15 | 6 | R2 主域·vold 6 件待迁 D-67 |
| TC engineering | 37 | 11 | 2 | 24 | 15 | 5 | R3 半域·补头+vold 迁移 |
| TC testing | 37 | 26 | 0 | 11 | 0 | 0 | evidence 件为主（版本行全无·候「证据卷是否入圈」定性——与排除判据第四类同形） |
| TC execution/registry/product/project-sources | 23 | 5 | 9 | 9 | 4 | 0 | 量小随 R3 顺带 |
| TMV execution | 151 | 127 | 3 | 21 | 3 | 17 | R8 大域·full 率 84% 已高；2026-08-2x 历史执行档 ~33 件（vold 17 集中）候「活规范 vs 执行档」逐件定性 |
| TMV workflow（制度件） | 60 | 35 | 4 | 21 | 22 | 0 | R5 域·none 21 补头 |
| TMV training | 22 | 22 | 0 | 0 | 3 | 0 | full 率 100%·量轻 |
| TMV engineering/registry/contracts/prd/product/testing/security/root | 57 | 41 | 8 | 8 | 25 | 2 | R4/R7 域·零散补头 |
| TriTraining docs+cc-tutorial | 24 | 10 | 12 | 2 | 14 | 0 | v1xx 14 全（SDE 批 3 迁移毕）·partial 12=批 2 规范头只挂部分字段——补齐三件套归 SDE 梳理域 |
| **TOTAL** | **516** | **307** | **59** | **150** | **133** | **34** | vold 34 件=旧两段式待迁 D-67（SDE 梳理域供数） |

### 读数判读（供轮形分级）

1. **机械层缺口画像**：none 150 件=补规范头主工作面（TC workflow 制度件 39+TC engineering 24+TMV workflow 21 为主）；partial 59=补齐字段面。规范头补挂属 SDE 梳理域施工面，轮形勘定只出供数不越域施工。
2. **内容级勘定高危域不变**：机械层只测「形式面」，过时判定仍靠内容三读数——域序 R1-R9 维持，R2（TC training 47）起每轮 ≤10 件逐件走。
3. **TC testing evidence 21 件+TMV execution 历史档 33 件**=两类「证据/档案形」候选排除件（与四类排除判据第四类同形）——候 FSD 施工勘定归类对表，归类前留在圈内不预排。
4. **脚本伪影教训自领**：首轮 bash 逐件 spawn 超时（进程开销）→Python 单进程过；rel 拼接漏 `/` 致域串桶（TSV path 列坏·读数列完好）→重扫修复。两轮均为脚本面伪影非数据面，聚合以修复后轮为准。

## 勘九 · 批二 review 关卡全程留痕（N=3 三件·2026-11-04 23:0x-23:1x·终态）

**施工面**：FSD 三件落笔（04 +120/−73·03 +12/−11·course-graph §8.3 +8——后含补笔 +148/−88）·工作区态零 commit 呈 review；护栏 070f4de 在位；SDE 探针件未触碰。

**主体实勘（判据七条·独立验证非凭自报·23:0x 四轮命令面）**：
1. 残留终扫自跑（裸名 `grep TriMC|TriLC`）：course-graph 唯一命中=L10 meta ✓；03 命中=L8/L9 meta+L16 live（FSD 留置项 a）+L21 引文档案注（合法）；04 命中=L8/L9 meta+L46 MIGRATION 档案括注（合法）——TriMC live 残余仅 L16 一处。
2. 引文逐字七处抽验零差（判据⑥）：§2 agentLoop L301-307（含行尾 TC-001 注释）/§8 spawn L31-47 PA-2 注释块/§9 常量 :10-14+PathsSchema :27-34+resolver :61-68+主 schema :78-104 骨架标注形。
3. 锚族十五处吻合：agent-core 六锚（loop :304 `?? 100`·:355-361 `'default'`·AgentEvent 12 种 L160-172 含 continue_round·contract :78·resolver :49·job-executor :41）+TriRLC 四锚（HEAD 44b8a59·:1765-1791 env 旋钮·:5277-5279 backward-compat 原话·:2949 端点+:2978 `Proxy to TriMMC` 注释·:1875 healthz）+微锚五处（:384-388/:390-394/:532/:506-510 TC-1 起/contract L27-34）。行数之争采认 FSD（awk NR=719·wc 末行无 \n 假象定性）。
4. 判据⑤⑦③对表：每处系工单 #N 锚 ✓；§15 缺口①「已修复 as-of」附 14499e5+旧缺口存档括注 ✓；MIGRATION 蓝图引文除外+演进档案括注 ✓；§11.4 三层纪律+1d52c20 备码不部署诚实注 ✓；§17 基准行 2026-10-02 历史存档+批二复勘并注=演进档案形 ✓。
5. 工单 #3 两层面定性特别采认：daemon env 缺省 bypassPermissions vs 内核 'default' fail-closed——禁推定现勘执行到位（勘七工单预警点实锚）。

**三留置裁定=三补笔（review 裁定·零新事实全对齐文内既有口径）**：①03 L16 叙述正名 TriMMC ②course-graph §6.1 补两行成四件套 8 行口径（承引 §8.3 已现勘八件）③04 L606 mermaid 宿主标签补 TriMMC 成三家（L44 依赖方向段原文即三家枚举）。六处快验 PASS（23:1x·含 L20→L21 行号顺移披露并验自洽·diff stat +148/−88 对表吻合）。

**读数口径勘正两点（非质量缺陷）+FSD 自领闭环**：终扫模式口径披露义务（裸名 vs 复合 named-drift 模式——L670「命中」系 FSD 复合模式含 `687` 行数锚非 TriMC 字样·模式不同非读数矛盾·实质零漏网两侧一致）；「唯一命中」表述以实际命中集+grep 口径为准。下批自报必注模式。

**锁笔终态**：TriTraining **e40c069**（e40c0692a94487b01ae7bce301e0736f7ed84533·dev·070f4de..e40c069 双通道 push 双验吻合·message 带工单 16 条+补笔 3+review 双信链·SDE 探针件未入 add）。性能读数（COO 扩批令要件·FSD 侧）：开工锚 14:20:26Z→毕 42min 三件全谱含终扫+补笔；review 侧：主体实勘+补笔快验两阶段·独立命令面四轮。首跑零 rework 纪录批二延续（判据⑤⑥⑦自检+FSD 收口自获补笔 1·review 面零勘改单·三补笔系留置裁定非缺陷返工）。

## 使用依据

- FSD 机械对表卷 recon-fsd-seg2-tritraining.md（同树目录·三读数吸收；族计数勘正=FSD 采认（b3b9fc073）；1d52c20 日期初勘互指对方误读·终谳=%ad/%cI 双日期字段分野两皆机真值（FSD 驳回附双证促成本勘定））
- git 现勘：TriCompany HEAD agent-core 树哈希 dbd8d620/9 笔提交清单/1d52c20 重锚验证（12:33-12:36 三轮命令读数）
- 全量清点面扫读数（12:31-12:33 两轮 python 扫描·TriMC/TriLC 上下文逐条人工判读）
- COO 派工令 12:27:38·排期单 62241d6044 §段二·COS 四裁点 11:55:13

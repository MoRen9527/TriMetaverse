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

## 勘十二 · R1（TriTraining 批三收尾）对表要点单（COO 派令 b3079982 承接·RDT 勘定供数·FSD 施工勘定对表用）

**R1 性质辨析**：批二=源码漂移锚级 named-drift（引文逐字复抄）；**R1=内容级对表**（课程内容 vs 管线/CLI 现役演进）——工单形态=对表要点+判定判据+真源指引，非逐行 named-drift；**FSD 施工含活体现勘**（禁推定照行）。两轮拆（10+3）·新回滚锚 **e40c069**（070f4de 禁再用·COO 344 笔定谳）·自报必注 grep 模式口径（勘九承袭）。

### 件组 1：host-publish 系 4 件（course/lab-manual/lesson-contract/lab-contract·内容时锚 2026-06-14）

- 对表基准：`TriMetaverse/docs/training/tricompany/03-source-publish-live-链路.md`（同主题后出课程件·现役链路口径）＋01/02/04 邻件。
- 已知演进点清单（教程 6-14 时锚早于全部）：13 席 session-body 面（--host 渲染管线）·宿主双位发布拷贝（.claude/agents+.github/agents·真源=TriCompany/source-agents/）·D 系合同（D-47 信面落款/D-26 简介形）·binding profile 单点双宿主（宿主绑定层不入源侧五件套）。
- 判定判据：教程步骤 vs 现役 source-publish-live 链路逐段对表——**叙述形漂移改写/引文与历史蓝图档案化**（批二判据承袭）；lesson/lab contract 两件重点验「验收锚」与现役工件清单对表（appendix-a-工件清单与引用规则.md 可作对照）。

### 件组 2：source-kit 系 4 件（同构四件套）

- 对表对象：employee-source-kit CLI **现役命令面活体现勘**（CLI 真入口候 FSD 勘定——TC 根 package.json 无 bin 命中·禁按路径直觉推定入口·探到后在要点单回执补锚）。
- 判定判据：教程每条命令逐条跑 `--help` 对表（活体优先诊断法）——参数/子命令/输出形态漂移逐条列；跑不通的命令直接定性过时并给现役替形。

### 件组 3：beginners-guide §10 三规划项现势确权

- item1「当前仍是拷贝式发布」疑部分过时（勘六登记）：旁证=员工 session-body footer 系 `--host` 统一渲染管线活体+ade-consolidation-proposal :68 已载 --host 规格——**候 FSD 发布管线现勘后定性 rewrite**（部分过时=确权后改写非全翻）。
- item2/item3 同法确权：各规划项逐条判「已落地/部分落地/仍规划」三态+as-of 头记确权结论。

### 件组 4：lesson-lab-contract-baseline

- 对表对象：TriTraining 根 `AGENTS.md`（合同基线件的真源面）——判「现役观察」升格 or 维持：基线内容 vs 现役 lesson/lab contract 实件（R1 件组 1/2 的 contract 两件就是活体样本）对表。

### 件组 5：training-pack-migration-plan

- 定性判据：迁移落地态——training-pack 实际落位形态（TriTraining/docs/training/ 现目录即落地结果）vs 计划件叙述——定性「历史档（迁移已毕）」or「在役计划」·定性后归档注 or 保留现役。

### 件组 6：01-小白版复核（轻·预期零改动）

- 全景图+四 daemon 正名面（TriMC×0 预期·面扫 grep 裸名口径自报）；勘三「现役（观察）」维持或按复核读数调级。

### review 关卡承袭+R1 增补

批二七条承袭＋R1 增补：⑧活体现勘读数随件留痕（命令跑不通=如实记·禁「应该能跑」）；⑨两轮拆（10+3）每轮毕报独立 review·性能读数分轮累计（COO 344 笔③要件）。

## 勘十三 · R1 勘定卷对表裁定（FSD recon-fsd-r1-tritraining-batch3.md 8f67c5209 五项候裁·RDT 裁定正身）

**抽验读数（裁定前独立实勘六探·不凭信裁）**：V1 TMV docs/training/ 顶层平铺+tricompany/ 子目录=A6③ 坐实；V2 支撑根顶层=README/_archive/host-object-manifest.json/knowledge/runtime（无 TriTraining/）=A6④ 坐实；V3 `TriCompany/docs/workflow/host-object-publish-flow.md` 在位（22954B）=W7/W8 改写目标有效；V4 check-sync 子命令 employee_source_kit.py L1069/1105 在役=A1 坐实；V5 claude-session host 值 binding 生成校验面在役=A5 坐实；V6 source_kit_paths L143=A9 坐实。**六探零漂，勘定卷采认。**

**五项裁定**：
1. **W9=c 案**（禁写语义保留+路径改现役描述）：L32 原文实读=禁写纪律行挂两旧路径（`TriMetaverse/docs/training/tritraining/`+`TriTraining-copilot-host-assets`）——纪径件指涉对象必须活体可达（与 W11 同理：留死链=读者按图索骥踩坑）；c 案禁写语义原样保留、对象升为现役两真位（中央聚合面 `TriMetaverse/docs/training/`+宿主支撑根 `TriMetaverse/TriCompany-host-assets`），与 L31 三分辨行精确对齐（L31 说三分·L32 说禁把后两者写成前者）。b 注记形留死链弱；a 直接改写现役名亦可但不如 c 描述形稳（防现役位形态再演进重蹈断链）。措辞权=本席 content owner 域裁定；CAO 面如有异见走勘误头 revision 流程。
2. **W11=正文形优先+勘误头记一笔**（与 FSD 倾向相反）：baseline 系合同基线件——读者照件执行，L32 引用面属合同活体引用（非历史叙事），死链留正文=合同缺陷+补丁；正文形改写（与 W9 同款现役描述形）+批二判据②勘误头随改写已覆盖留痕。**判据式授权**：施工时若 L32 原文语境实为历史沿革叙述段（非引用句），退档案化括注形（判据③引文/蓝图除外）——以原文语境为准。
3. **W12=a 封存形**（采 FSD 倾向）：L5 三批完结+L35 回链已修=迁移叙事已终结；历史规划档路径/宿主名叙述=当时形态，改写反毁档案证据值（历史叙事冻结纪律）；A6④ 宿主侧零 published copy+L36 悬置项=「计划中未发生」的历史事实正是档案价值所在。施工要领：补元信息头三件套（syncMode 标 archived 形）+头注记一行（「本件系 training-pack 三批迁移已完结的历史规划档，路径与宿主名叙述系当时形态；宿主资产位现役=`TriMetaverse/TriCompany-host-assets`·中央聚合面现势=`TriMetaverse/docs/training/` 顶层平铺」）+正文零改写。与 W9/W11 不矛盾——分野=件性质（活体规则件修指涉 vs 已完结规划档冻结）。
4. **W13=零改动维持×2**：观察项1（消费者两家 vs 04 补笔③ 三家）——原文实勘 L108 消费者=package.json 硬锚面（TriRLC :24/TriRMC :26 两仓行锚）vs 04 mermaid=依赖方向宿主叙事（含 TriMMC），两口径各有所指非矛盾，FSD 定性采认，**不改**（硬锚面是事实真源、叙事面是全景图，小白版保简单是本职）。观察项2（L22 TriRMC「主控中心」）——FSD 风险定性采认成立（无面限定词·易与 sg M 面 TriMMC 混淆），但修复需引入部署面事实（河源 R 面服务域/与 TriMMC 分野）=内容补写非词面勘正，超出勘正/补笔判据（补笔=零新事实）；**本轮维持零改动**，留置候 01 后续复勘窗（R 域序或 cc-tutorial 专项），裁定记录在案。
5. **W14=确认 rewrite**（三项「已落地」确权 V2/V4/V5 独立验成立）：施工要领=「原规划 X → 现势已落地 Y（活体锚 Z）」演进保留形——§10 原规划段不抹除（规划→落地演进有档案价值·历史叙事冻结），逐项现势化+锚落笔，随轮 2。

**两笔升报（候 COO 排程·圈外）**：
- **中央副本同步债+缺件坐实**：V1 实勘 TMV docs/training/ 平铺面 employee-source-kit 仅 3 件（缺 cli-course.md·TriTraining 侧 4+4 vs 中央 4+3）+lastSyncedAt=2026-06-14 滞后——属 TMV training 域（≈R4 圈），候排后续轮或专窗。
- **A4 测试债升 CTO 域采认**：54/55 过·failure=测试期望硬编码 13 席 vs DECLARED 已含 product-manager 第 14 席=测试滞后债非课程命令坏——同意不入正文、升 CTO 域候窗。

**轮拆计数口径（候 COO 裁·本席意见）**：池件计合理（占位件占池位保 review 完整性）；W14 顺带面不计池件与 CEO 上限原意（review 负载控制）一致。裁定齐，候 COO 锁值后开施工轮。

## 勘十四 · R1-a 轮（轮 1·W1-W10）review 留痕（FSD 8 件 17 处 diff 实读·独立复测七探）

**实勘面**：圈定断言独立验（M×8 全目标件+HEAD=e40c069 ✓）·8 件 diff 逐件全读·残留/补载/新路径四组 grep 独立复测·check-sync 功能语义源码补验（L1105-1125：`check_component_synthetic_sync`+`sync_drift` 输出面=W1 功能句「组件-合成件同步检查/未跟即报」源码直译准确 ✓）。

**逐件判定**：W1 ✓（勘误头 append+命令族全景段活体锚）·W2 ✓（A9 复核读数入头形）·W3 ✓·W5 ✓（双宿主叙事 refram 括注形·判据①）·W9 ✓（c 案措辞照裁定①逐字）·W7/W8 **补笔一**·W10 **补笔二**·W4/W6 零改动占位（不在 diff ✓）。**主体形全 PASS·判据①②③⑤⑦⑧兑现**（演进保留注记形/as-of 头随改写/勘误头引述形残留/工单锚系/活体读数入头）。

**补笔一（必要·判据⑥忠实性）**：W7 L144+W8 L127 演进保留注记「原载 TriTraining-copilot-host-assets 旧宿主资产根」——原文字面两处均为 `TriCompany-copilot-host-assets/docs/workflow/host-object-publish-flow.md`（diff −行实锚）。演进保留形的全部价值在忠实，注记凭 A6① 名字写了原载=历史指涉失真。**改法**：两处注记「TriTraining-copilot-host-assets」→「TriCompany-copilot-host-assets」字面替换（其余不动）。

**补笔二（门面列举补全·零新事实）**：W10 README L6「training 真源已在 docs/training/ 在册（两系课程四件套 + 图谱 / 基线 / 架构 + cc-tutorial 四件）」漏列 beginners-guide（入门第一站·门面缺它最伤新人索骥）+training-pack-migration-plan（在册历史档）。**改法**：括注改「（两系课程件 + 图谱 / 基线 / 架构 / 迁移规划档 + 入门指南 + cc-tutorial 四件）」——FSD 勘一 14 md 清点在案为据。

**圈外补员（登记·裁定收录轮 2 顺带）**：docs/training/README.md **:27** 旧宿主根活引用（「宿主侧如需 published copy，应按真源发布链进入 `TriTraining-copilot-host-assets`」）——我全目录复测多出（FSD 断言 3 命中集 4 处=8 目标件口径·全目录口径 7 处）。系 FSD 勘定卷同形族第 1 族漏员+枢纽件（13 出边）。**裁定：收录轮 2 顺带**（一行改写现役描述形·与 W9 同款；改前现勘该件有无元信息头定勘误头形）。

**两点裁定记录（非缺陷）**：①W9/W10 根件无元信息头结构——判据②勘误头 append 不适用，留痕转移 commit 锚+勘定卷，认可此形；②FSD 自报断言 3 未注 grep 口径（勘九承袭纪律）——提醒：自报命中集必注范围（8 目标件 vs 全目录读数不同）。

**review 结论**：主体 PASS+补笔二处→**照批二形：FSD 补笔落笔毕呈快验，快验 PASS 后 commit 锁笔**（回滚锚承 e40c069）。性能读数入账：施工 ≈7min（八件轻件面·批二 42min 基线对表·轮 1 分列在册）。

**勘十四追记 · 补笔快验（K1-K12 十二探·条件 PASS）**：FSD 补笔毕呈快验（落款 16:01:21Z）含扩面披露（W7/W8 勘误头 L10 同步勘正·同件两名矛盾消除·方向采认）。K1 补笔一 diff 实读 ✓·K2 README L6 照裁定措辞 ✓·K3 零残留八件口径复测 RC=1 ✓·K4 净面 24+/15- 不变 ✓。**K5-K12 抓获退回面一处**：L10 扩面措辞「TriCompany-copilot-host-assets 已不存在」系假断言——K5 ls -d 三探该对象在 TMV 根存在·K7/K9 带尾斜杠 Not a directory·K10 git log --full-history 揭 LG-046 历史（1f9d505b1 物理正名+junction 别名→c4930f728 裁①旧名出册）·K12 PowerShell Get-Item 定形=22 字节普通文件（LinkType/Target 空·非链接非目录·出册残留物）；断链本身成立（K12 Test-Path 原文引用路径=False·K11 现役支撑根 TriCompany-host-assets 无 docs/ 子树=与 A6④ published copy 未生成自洽）。**定性：断链真·断因=LG-046 正名出册非根消失；「出册≠不存在」——积极断言须对新对象活体现勘，模板复用（「已不存在」消失类模板）越过事实边界=缺席断言未现勘变体**。退回改法（两件 L10 各一措辞）：「已不存在」→「系宿主资产根旧名（LG-046 正名出册·现役=TriCompany-host-assets）」，其余不动。教训由 FSD 自领入档；轮 2 顺带件（docs/training/README.md:27）两旧名并存史以 LG-046 正名口径落笔。

## 勘十五 · R1-b 轮（轮 2·池 6 件）review 留痕（FSD 勘定卷 f357cb120+工作区 diff 实读·独立复测）

**入关实勘**：勘定卷 recon-fsd-r2-round2.md 全读（TMV f357cb120）·TriTraining 工作区 diff 逐件全读（M×4+HEAD=c88f16f 回滚锚 ✓·p3-watch-probe untracked 他面物不动 ✓）·残留 grep 独立复测·新路径计数复测·01-小白版零 diff+L8 勘误头合法引述实锚。

**逐件判定（判据九条过·施工面全 PASS）**：W11 ✓ 正文形（P1 判据实锚「当前边界」引用句·勘误头 append+L32 现役描述改写 W9 同款·判据①②⑧兑现）·W12 ✓ 封存形（7 行纯头部插入·syncMode=archived·裁定③措辞逐字·正文零触碰实锚=判据③历史冻结）·W13 ✓ 零改动占位（零 diff 实锚）·W14 ✓ 演进保留形（节头如实化+引导句演进注记+items 1/2/3 各追加「【已落地·as-of 2026-11-05】」段带活体锚 A5/A6④/A8+「原文…系 2026-08-19 规划时点形态，现势以本注记为准」时点收尾·**items 4-6 零触碰+禁令对 4-6 全效保留原文**=判据①③⑧兑现·裁定⑤锁值面不越）·README:27 ✓（LG-046 正名口径+K5-K12「出册≠不存在」措辞照录·L26 零触碰纪律到位=P5 升报不擅动）。

**卷面读数勘正退回两笔（非施工缺陷·卷面誊写面·照轮 1 先例条件 PASS 形）**：
1. **diff 读数誊写失真（假读数家族新变体候选：git diff --stat 数字列语义误读）**：FSD 卷自报净面「25+/5-」+分件「W11 5+/2-·W14 11+/3-·README 2+/2-」vs 我实测 `git diff --stat` 总计行=**19+/6-**（分件：W11 3+/2-·W12 7+/0- ✓·W14 8+/3-·README 1+/1-）。根因=--stat 每行数字列系**变更行总数（insertions+deletions 之和）非 insertions 数**，graph 尾段系 deletions 形——FSD 把总数列抄作 insertions。施工本体零失真（19+/6- 全验合格），失真面=卷面读数誊写；COO 知会信转述同读数一并勘正。**改法**：卷 §二 diff 读数列与净面行照实测勘正（19+/6-·分件 3/7/8/1 四组）。教训候 D 系窗：git --stat 数字列语义误读=假读数家族第十五向候选（识别信号=分件加总≠总计行·正形=读 --stat 以总计行 insertions/deletions 括注值为准·分件行数字=变更总数另注）。
2. **自测组 4 口径失真（勘九教训复发·轻）**：「baseline/README 新现役写法计数正常」——baseline 计 `TriCompany-host-assets`=**0**（W11 改写面系 `docs/training/` 顶层平铺形，不含宿主根名；两现役名并存形系轮 1 W9 AGENTS.md 面）——grep 口径未注+断言面与改写面错位。改写本身无误（L33 实锚在位）。改法：组 4 断言分列两口径（README 计宿主根=1 ✓·baseline 计中央平铺形=1 ✓）。

**升报裁定两笔**：
1. **README L26 同族断链：收录·并入本轮补笔面**——A6③ 同族同根因（tritraining/ 子目录形态消亡），改法现成=W11 同款现役描述形：「不代替 `TriMetaverse/docs/training/` 中央聚合面（顶层平铺）」，勘误括注可依 W11 行内简形（「勘误 as-of 2026-11-05·A6③ 同款」一句即可·不必展开）。收录理由：勘十四已立圈外补员先例（L27 同件同行区块）·同族集中处理防三扫·一行笔零新事实。施工归 FSD 本轮补笔。
2. **W14 §10 item6 事实面过时：留置候后续窗·不扩本轮圈**——本轮池 6 件已封圈（护栏②）；item6 系裁定⑤锁值面外新事实面，且 gate 形升级后支撑面处半升级态（`source_publish_check --publish-agents` 已升 gate 形·`employee_host_publish` --execute 显式形未动）——改写前须活体重勘 --dry-run/--execute 现值域+gate 联动面，非一行笔可安全落。列勘十六/复勘窗候选（FSD 登记处置采认）。

**review 结论：条件 PASS**——施工面 4 件+README 全合格放行向；FSD 两笔卷面勘正+L26 补笔落笔毕呈快验（轮 1 K 系先例），快验 PASS 后 commit 锁笔（回滚锚 c88f16f）。性能读数入账（⑨分轮累计）：FSD 勘定 ≈6min+施工 ≈4min；RDT review ≈6min（16:27 入关→16:33 裁定毕·轮 1 基线 3min+L26 升报裁+读数失真勘验增量——如实注）。

**勘十五追记 · L 系快验（L1-L6 六探·PASS 放行锁笔）**：FSD 条件三件落笔毕呈快验（落款 08:33:53Z）·快验独立复测全绿——L1 README 补笔 diff 实读 ✓（L26 照裁措辞逐字「不代替 `TriMetaverse/docs/training/` 中央聚合面（顶层平铺）（勘误 as-of 2026-11-05·A6③ 同款——原 `tritraining/` 子目录形态已消亡）」+L27 勘十四形不动·两行替换形）·L2 勘定卷读数勘正实读 ✓（分件照改四组+净面 20+/7- 两值链并录〔19+/6- 补笔前+20+/7- 终值·「RDT 交叉验证」注记〕+--stat 数字列误读机理留痕入卷·FSD 同认领第十五向候选）·L3 组 4 两口径分列 ✓（README 宿主根=1·baseline 中央平铺形=1+混计机理注记）·L4 numstat 独立复验 ✓（README 2/2·beginners 8/3·migration 7/0·baseline 3/2=总计 20+/7- 自洽）·L5 残留复跑 FSD 侧零非法（L26/L27 括注引述=勘误行合法形·与 L1 diff 互证）·L6 圈定零触碰 ✓（M×4 不变+01-小白版零 diff+p3-watch-probe 他面物不动）。**快验 PASS→放行 TriTraining commit 锁笔**（回滚锚 c88f16f）→毕报直达 BOD+抄 COO。第十六向候选实锚随 FSD 卷锁笔一并定谳（教训两席同认领）。

## 勘十六 · 环 3 轮 3（R2 域首批切片·池 13 件）review 留痕（FSD 申报单 220ba36eb §五终态+TC 工作区 diff 实读·独立复测）

**入关实勘**：申报单终态表全读·TC 工作区 M×12 逐件 diff 全读（HEAD=a4b7894 回滚锚 ✓）·存在性断言独立复核（TriMMC runbook 在位 ✓——RDT 首探误探 TriCompany 仓内路径系探径错误自领·正确路径=独立仓 TriMMC）·组 2 残留独立扫描·numstat 加总对表（45+/10-=docs/training 10 件精确 ✓）。

**圈外在途三件对表（FSD §5.2 已申报+精确 pathspec 承诺 ✓）**：hub-ledger-governance.md 3+/1-（=LG-086 回填·CAO 裁 COS 施工在途笔）+package-lock.json 5+/1-（=agent-core 依赖面他席在途笔）+p3-watch-probe untracked——均非 FSD 施工物·**放行条件含逐路径精确 add·三件零触碰留原态（并行窗互踩族「在途未 commit 修改被批量 add 卷走」防线·显式立规）**。

**施工面逐件判定（12 件全 PASS）**：A 组封存形三件 ✓（fade-002/003/006 各 9+/0- 纯插入·W12 同形·archived+版本差注记自声明引用+现行版指针·裁定①照落）·fade-001 直笔 ✓（TriMC→TriMMC 两处+勘误行·TriMMC/docs/ops/runbook 存在性 RDT 独立验 ✓）·fade-007 ✓（spec 09-04 修订差异声明+CLAUDE.md 新教义上位口径+零改写）·fade-beginner-course/product-guide/code-deep-dive 勘误头形三件 ✓（基线 v2.0.0-3 vs 现势 v2.0.6 滞后声明+联动修订候排程·三件同构）·ipd 正文形+勘误头 ✓（「Copilot-host live 阶段」删+三宿主位现势）·ceo-demand ✓（L14 meta 勘误括注 LG-046·勘十四口径；**L22/L39 旧宿主根名系 §0 联审卷宗历史原文=判据③引文合法保留**·L14 全件声明已覆盖·零退回）·占位两件 fade-004/005 零 diff ✓·dir-allocation 零动笔候裁 ✓。

**组 2 口径提醒（记档非退回）**：FSD 组 2 自报零非法——ceo-demand L22/L39 两处命中未列定性清单（勘九口径未注复发形态·轻）——本次 RDT 代定性=合法保留；后续组 2 命中集必逐处列定性。

**裁定请托两笔**：
1. **dir-allocation=演进头注记形（a 案·强化版）**：实勘补关键事实——头部系**活件形**（sourceOfTruth=培训域正身·syncMode=write-time·元信息头三件套在位）且本件系**培训域路由指针正身现役制度件**（「两侧 training 目录分工以该件为准·冲突时回件」）——封存形不适用（域路由在指）·逐节改写超池面。施工形：头部**追加演进注记行**（件已有头不新造头）五要素——①tritraining/ 子目录形态消亡（中央聚合面现势=顶层平铺）②旧宿主根名 LG-046 正名声明（勘十四 K5-K12 措辞）③「候 CPO/CTO 评估」已决事实（TriTraining 真源产生面已成+CPO 定位完成 2026-07-17+宿主侧 published copy 未生成实勘在档）④现行分工指针确认（过时叙述以注记为准）⑤正文零改写。**升报一笔**：正文逐节现势化（3.6/3.7/5/6 节）候实质修订专窗——域路由指针件内容过时实质影响新人索骥·列排程面。
2. **fade-001-maintenance 圈外补员=收录**：L44/L352 两处 TriMC 旧路径断链实勘坐实（与 fade-001-deep-dive 同族同形）——同款两行改+勘误行（fade-001-deep-dive 行形直接复用·TriMMC runbook 存在性已独立验）。

**排程请托两笔回应（候 COO 对表）**：③课程三件 follow-spec 联动修订（v2.0.4-6 三版增量·实质更新面）→**列勘十六/复勘窗候选·建议环 4 联审后排实质修订专窗**（逐版对表非一行笔）；④ipd/ceo-course 命令面复勘→同窗候选·与③可并窗（同属 FADE 课程族修订窗·一次复勘两件）。

**review 结论：PASS+裁定两笔+放行条件显式**——FSD 落笔毕（dir-allocation 演进注记+fade-001-maintenance 补员改两笔）呈快验（L 系续编号）·快验 PASS 后**逐路径精确 add**（十二件+两补笔=14 路径·禁批量 add）锁笔→毕报直达 BOD+抄 COO。性能读数（⑨分轮累计）：FSD 勘定+施工面读数随其毕报；RDT review ≈12min（17:04 入关→17:16 判定毕·12 件+圈外定性+两裁定勘定面·如实注）。

## 使用依据

- FSD 机械对表卷 recon-fsd-seg2-tritraining.md（同树目录·三读数吸收；族计数勘正=FSD 采认（b3b9fc073）；1d52c20 日期初勘互指对方误读·终谳=%ad/%cI 双日期字段分野两皆机真值（FSD 驳回附双证促成本勘定））
- git 现勘：TriCompany HEAD agent-core 树哈希 dbd8d620/9 笔提交清单/1d52c20 重锚验证（12:33-12:36 三轮命令读数）
- 全量清点面扫读数（12:31-12:33 两轮 python 扫描·TriMC/TriLC 上下文逐条人工判读）
- COO 派工令 12:27:38·排期单 62241d6044 §段二·COS 四裁点 11:55:13

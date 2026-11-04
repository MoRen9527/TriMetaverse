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
| 1d52c20 | **10-09 10:35**（git 直读；FSD 卷书 10-14 系误读·勘正） | scheduler cron stale 守卫+settle 兜底 | 04 scheduler 论断（sched 讨论面 35 处命中最高暴露） |

**关键定性**：漂移非首跑窗内新发生——10-02 勘误批（8b3e4ec）落笔时点前 6 笔已在，该批只修正名/图/外锚**未消化内容漂移**，且当时指纹表「最近实质提交 2026-08-25」已失真。cc-tutorial 判定=**部分漂（原地修正档）**，per README 自身「小漂移」规则。

### 逐件分级（cc-tutorial 5 件）

| 件 | 判定 | 实锚 |
| --- | --- | --- |
| README.md | 部分漂·**批一** | 指纹表重锚（目标：绑定提交→`1d52c20`，树哈希→`dbd8d620`，最近实质提交→2026-10-09，版本 0.1.0 不变；已验 `rev-parse 1d52c20:packages/agent-core`=`dbd8d620`）＋勘误执行记录续条 |
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

## 使用依据

- FSD 机械对表卷 recon-fsd-seg2-tritraining.md（同树目录·三读数吸收+两处勘正：1d52c20 日期/族计数）
- git 现勘：TriCompany HEAD agent-core 树哈希 dbd8d620/9 笔提交清单/1d52c20 重锚验证（12:33-12:36 三轮命令读数）
- 全量清点面扫读数（12:31-12:33 两轮 python 扫描·TriMC/TriLC 上下文逐条人工判读）
- COO 派工令 12:27:38·排期单 62241d6044 §段二·COS 四裁点 11:55:13

# COS 派工回执台账 + 轮间门件台账（DEM-006 试点最小形·统一一处可查可催）

- sourceOfTruth: 本卷（派工/门件双台账统一正身·COS 值守面滚动维护）
- syncMode: rolling（原地滚动刷新·文件名周内不动）
- lastSyncedAt: 2026-11-23T08:31+0800（date 现查·DEM-006 试点首建）
- 令源: CEO 问「这类 COO 派工，COS 没有记账和催办机制么？」（BOD 实勘：派工→执行体→回执链无记账·DEM-006 定时器化已批未建·今日 3.5h 断点+值守断档实证）
- 形: 最小形（人肉版先跑·DEM-006 定时器化物化候建）——**今天就用起来**


> **〔DP 号制追认（2026-11-23 08:36·CEO 定谳后）〕** 本台账派工行一律以 **DP-YYYYMMDD-NNN** 挂号（规则卷 `dispatch-ledger-rules-20261123.md`）——今日追认五笔：DP-20261123-001（批1 864df4a6）/002（批3 a0e04d7c）/003（批4 02f3893e）/004（批5 6e618568 链）/005（BOD 值席批3 直投 08:29·BOD 自领绕过案）。**无 DP 号派单=不认（执行席可退回）**。

## §一 · 派工回执台账（每批派工一行：批号/执行体/msg_id/派发时点/回执时点/状态）

| 批号 | 内容 | 执行体 | msg_id/锚 | 派发时点 | 回执时点 | 状态 |
|---|---|---|---|---|---|---|
| D-11-22-01 | 任务书 v7 五段施工序（批1 SEATS回两席） | fsd/COO | 04e6df8a9 批卷 | 11-22 20:29 | — | 在COO批1（已连发） |
| D-11-22-02 | loop 尾段联审新建（CTO 定形→fsd 施工） | CTO→fsd | ce26401a9 定形卷 | 11-22 20:31 | — | 在COO批5 |
| D-11-22-03 | W46 门件 ceo-ruling（值席经 BOD 通道） | 值席/BOD | 961653b9 信 | 11-23 01:46 | 待 BOD 直投 08:29 后回 | 在途 |
| D-11-22-04 | CPO 四类活件补铸 | CPO | 40c2a383 信 | 11-23 03:02 | 03:05（fe668db4f） | **已回执** |
| D-11-22-05 | 迁移器根因修（族清单+top_level 逐项） | COO | a8afc3ba 信 | 11-23 03:08 | 03:06（卷达面） | **已回执** |
| D-11-22-06 | CTO check 脚本+B4 回补 | CTO | d4179828 信 | 11-23 03:09 | 842 承录 | **已回执** |
| D-11-23-01 | 联审召集（对象 B 六席） | 六席 | 03:00:49 六信 | 11-23 03:00 | 03:03-03:05 全齐 | **已回执**（五席+我） |
| D-11-23-02 | 补审召集（对象 A 六席） | 六席 | 03:08:29 六信 | 11-23 03:08 | 03:13-03:16 全齐 | **已回执**（全七席） |
| D-11-23-03 | r12 任务书（COS 代批→施工面） | CTO/COO/fsd | 6e618568 信 | 11-23 03:08 | 04:09 澄清 | **已回执**（#13 作废·批5解除） |
| D-11-23-04 | 值席 ignite 轮 ceo-ruling（continue） | 值席/BOD | e60bcd70 信 | 11-23 02:22 | 待回 | 在途 |
| D-11-23-05 | M3 双达标同步（COO/CTO） | COO/CTO | fb86977a/cdbb0e02 | 11-23 03:37 | 03:38（CTO 定形） | **已回执** |


**DP-009 回执**（08:43:23·三步首个完整实例 ✓）：DP-20261123-009=#16 runId 贯穿 round 层——派发 08:43:14→FSD（收件 4c43423d）·侧线并行不阻主链·验收=轮状态 runId 可读+链轮两层贯穿（CTO 规格 e9fb4dddc）。


**DP-010 取号**（08:45·D-88 正形）：DP-20261123-010=题面补丁施工（plan_skill_spawn exam 段引导改造·三式前缀+正反例+职责分野+出题自检）·执行体 FSD·依据 CTO 裁卷 7ea88607f §七（obj 可判率 0% 实锚 r11 skipped 6/6）·状态=取号候 CTO 附号发令。**点火门插「试出卷验 ≥70% 可判率」判据**（CTO 裁+我同意）。


**签发表首用闭环**（08:52:52·SDE 收件回执）：runId=`shift-W48-loop-20261123T005158Z` 登记生效（loop/W48/ts 00:51:58Z/DP-010/锚 56c756a83）——传参面实证 `fade001-ignite.ts L58 runId: req('run-id')` 必载→外部注入式；COO 派令 msg_id=3d6d3d70。**点火前置如实=未证**（试出卷验≥70%+批 3 毕两读数未达）→未触发·前置达面即点火+三口径随报。


**销账两笔**（08:58:58·FSD 抄送·回执双落）：
- **DP-20261123-009 已毕销账**：#16 runId 轮层贯穿（commit 5d0c581·TriRMC）——销账锚=5d0c581。
- **DP-20261123-010 已毕销账**：题面补丁（exam 段引导改造+试出卷验证）——commit 92cebe2（TriCompany·sg bare+R-HY 同步）·**试出卷可判率 6/6=100%（≥70% 达标）**·测试 3 passed——销账锚=92cebe2。
**点火前置现势**：试出卷验 ✅（100%）+批 3 毕（候）→**仅差批 3 达即点火**。


**点火 GO**（08:58:25·令 msg_id 7711c886 达 SDE·**CEO 自动推进授权首次行使**）：三条件全达（①试出卷验 6/6=100% ✓ ②批 3 毕〔BOD 面读数收讫〕③#6/#12 齐）·runId=shift-W48-loop-20261123T005158Z 已随令传参——**签发表首用兑现**。三口径读数候报（SDE 执行中+exam_objective 新段）。


**DP-011 取号**（09:09·D-88 三步正形）：DP-20261123-011=DEM-009 判据扩件（option② 双判据「job-state ok OR 周产物存在」·防每周一误报）·执行体 SDE（~25 行增量·边界=鲜度守卫 9 天/fail-closed/正常拍短路零变化）·窗口 nextRun 2026-11-30 前·**派发 09:09:17→SDE（20cd2333）·验证=两态活体（产物存在态不误报/normal 态短路）·候毕报**。**验证期实录**（SDE 09:10:31）：09:07:03 告警=扩件前单判据设计内真告警（既有行为）/09:09:51=**验证期 bug 误报（自领·已修 commit 70567f2·现测 rc=0 零告警）**——修复后双判据（job-state OR 周产物）·W48 产物在（to_week=W48/status=pass）→含 11-30 首跑应零告警静默。**DP-011 已毕销账**（70567f2 bare 顶·双判据扩件+验证四态全绿 T1 短路/T2 产物真读/T3 job-error+产物=True 核心路径/T4 双否+活体 rc=0——销账锚=70567f2·验收锚=11-30 首跑 exit 0 静默）。**告警销账行**（SDE 正式标注 09:11:26·CTO 验收通过）：`DEM-009 告警 09:09:51 件=验证期误报（SDE 自领 bug·70567f2 已修·非迁移异常）`；09:07:03 件=扩件前单判据设计内告警（既有判据行为·非新增故障）。


**点火起跑读数**（SDE 10:07:37·抄 COS）：起跑=**2026-11-23T02:05:37Z（10:05:37 CST）**·pid=**3084066**·run_dir=`/srv/fleet/TriRMC/fade001-runs/shift-W48-loop-20261123T005158Z`（preflight+qualify 已落）·**run-id=签发件 ✓**·checks 四布尔=签卷 cf436059f 原文注入·**ETA≈02:50Z（10:50 CST）→三口径随报**。前置两败根因=PYPATH/LOOP_WINDOW 环境缺（chain spawn 裸形）·三试补齐起跑成（COO 同步 7a81d660）。


**DP-012 取号**（10:12·D-88）：DP-20261123-012=chain_runner spawn env/cwd 整改（CTO 裁形：spawnSync 加 cwd:triCompanyRoot+env PYTHONPATH append·最小改 2 处·实证 6220331 L209）·执行体 FSD·**时机硬约束=本轮点火运行中禁改 TriRMC 代码/dist·本轮毕后下轮前落**·回归三件（argv 绝对性逐段核/活体验证/回滚锚 bak）·**发令毕（按窗）10:12:03→FSD（1814f628）·令含时机硬约束·SDE 同步**。**已毕销账**（CTO 验收通过 60 passed 0 fail·appendPyPath 正确·销账锚=CTO 验收卷）。根因=零 cwd 零 env→sys.path[0]=段脚本目录→import runtime.cognition 必 ModuleNotFoundError（今晨前置两败根因·SDE 环境补丁=临时绕过·本件根治）。


**DP-013 取号**（11:01·D-88）：DP-20261123-013=plan prompt 契约镜像件（CTO 裁三层：①disposition 四值枚举+反例 ②自纠层重试一次 ③根治=校验器反向提取全枚举列清单补 prompt）·执行体 FSD·新单号（一单一号）·**轮 3 起生效**（轮 2 段 5 rc=2）。背景=契约缺口同族三例（verdict/counts/disposition）·治族思路。**发令毕 11:01:14→FSD（04d23350）·面=TriCompany prompt 面（非 TriRMC 码·禁改约束不涉）·验收锚=轮 3 实跑段 5 过·**已毕销账**（复验五面全绿：structure_gate errors=0/reconcile ok/check_plan_baseline ok/自纠门 viol=0/exam 6/6=100%+首轮即合规·三 commit a30afd6/dfae936/eb3f2d8·167 passed——销账锚=复验卷）。


**resume 点火起跑**（SDE 11:35:03）：起跑=03:32:52Z（11:32:52 CST）·pid **3098499**·run-dir=`fade001-runs/shift-W48-resume-20261123T033142Z`·**run-id=签发件 ✓**（d80633b38）·preflight pass（exempted(loop)）·qualify 落·**ETA≈04:20Z（12:20 CST）**。**DP-012 净测通过**（不带 PYTHONPATH rc=0=根治兑现）；两发现=dist 未重建（SDE 补建）/LOOP_WINDOW 仍须 env（已带）。三口径+联审 A/B（新基线）随报。


**DP-015 取号**（12:23·D-88）：DP-20261123-015=verify 全量质量门升级（verify.py 段 5 增调 plan_scope._structure_gate 全量校验·现轻量断言 36 项全量门无人跑·FSD 架构发现）·执行体 FSD·面=TriCompany verify.py（与 DP-014 TriRMC 面不同仓不并单）·依据 CTO 裁 04:22。**已毕销账**（commit d7c2c08·TriCompany sg bare+R-HY 同步·负例红/正例绿双验·test_verify 33 passed·族 195 passed·VERIFY_VERSION 1.2.0——销账锚=d7c2c08）。
**DP-014 状态更新**：FSD 已落 1a0da7a（43/43·dist emit 候轮间守纪律）——归并确认（含 CTO 双修规格）·**落码毕候验收**（CTO 验→销账）。


**resume3 红停记**（CTO 13:30:17）：resume3 轮 1 红停=**段 3 900s ETIMEDOUT**（rounds_run=0·FUSE 未消耗）——根因候选①**外部验证并发干扰**（铁证在案·未清）；**点火前置硬条件=清场确认**（dsh/py/ignite 三零+瞬态 3115950 身份白·FSD 自证加急中）。**resume4 已签发**（shift-W48-resume4-20261123T053031Z·9377f25a4）候清场绿+COO 点火令。
**DP-016 正式取号**（14:16）：rubric 正则扩四形（score_engine L72·CPO 会签 2ceae9804·四形全纳 `^shift-W\d+(-loop|-ignite|-official|-resume\d*)?-\d{8}T\d{6}Z$`·四附条件照办·正例 5+负例双 W）·执行体 FSD·**已毕销账**（commit a7e40af·消费面四处全清单入 msg·测试 62 passed·CPO 四附条件全办——销账锚=a7e40af）；**原「段 3 超时面评估」候选另取号**（一单一号·候轮复现）。


**DP-019 取号**（16:00·最高优先）：seat 工具面治理（DP-016 定谳根治件）——根因链=**席自造产物→上下文爆涨→compaction 风暴(13-17次)→900s 截杀**（resume3/4/5 段3超时三实证）；规格三件（①产物只由 stage 写·席禁写 run_dir ②压缩上限>5 提前中断 ③spawn 超时预算评估）·执行体 FSD/SDE·**已毕销账**（TriCompany 16aeb93+TriRMC 5271eb5·sandbox cwd+prompt 四注禁写+**段3超时 900→300s**·②压缩上限 dsh 面无参改以①③防线·测试+5案18passed·chain18/18——销账锚=16aeb93+5271eb5·关键实证候=下次 resume 段3应2.5min级+compaction<5）。


**DP-020 毕销账**（16:20:10·FSD 抄送）：段 3 截断治理两件落——①拆分生成（plan-only/exam-only 两次 spawn·各半预算·exam 失败=空卷兜底非致命·回滚锚 FADE_PLAN_EXAM_SPLIT=0）②输出精简（两 prompt 注·单 JSON 直出禁长推理）·commit **7410866**（TC·双机同步）·plan 套 12 passed·族 203 passed**终销（16:59 CTO 判·关键实证达成）**：resume9 段 3 用时 **4.5min（<480s ✓）·六件齐落·compaction max=3（<5 ✓）**——验收锚①实现+测试✓／②段 3 绿✓／③token<16384 间接达成（绿=未截断·候解压复核）／④comparability=DP-017 锚非本单。**注「本单目标达成≠链稳定性证明」**（resume3-8 多红史·稳定性需后续多轮验证）。**状态勘正历史（16:40 CTO）**：**实现通过（a+b 对 plan 面实证）·关键实证（段 3 绿）未达·追补中**——resume7 实测：spawn1 plan-only=**57.5s ✓（拆分大胜）**·spawn2 exam 挂死>240s→300s 帽杀（exam 席工具探索 63 calls/读源码·非截断·**exam 面新因**）。**追补两件（DP-020 内不新号·FSD 已接）**：a) exam prompt 限定读取面（≤5件禁源码禁跑码限次）b) **结构缺陷修=子超时>父超时（exam spawn 900>stage 帽 300→改 min(spawn, stage_remaining)）**。


**DP-021/022/023 取号**（17:05·CEO 追问三件·BOD 核查三件均未修）：
- **DP-20261123-021**=判级/charter 顺序修正（round_runner.ts 实证：await runJointReviewHook 在 verdict==='loop_exit' 判级**之前**→双达标仍生成无用 charter；改法=钩子拆两步：联审先行产 A/B→判级→仅未达标才生成/挂 charter）·**机制本体项**（回呈 CEO 已由本问触发·COO 督办·CTO 定形+FSD 落码）·**已毕销账**（a08c0a5·JointGrade+computeJointGrade 单一源+two-phase skip留痕/attempted+守卫不动·round 47/47 0 fail——销账锚=a08c0a5·**resume10=首生效轮观察点：达标轮 charter-skip 留痕**）
- **DP-20261123-022**=段编号对齐勘正（协议段1=触发 vs 链实现 preflight=段1→CTO/CAO 出对表卷：协议段号↔实现段号映射+改注释/文档/规范·**不动行为只正名**）
- **DP-20261123-023**=R1/R2/R3 定名（源码 verify.py 无此命名·疑 reasons 编号→CTO 给定名入卷·防口头编号无定义）


**DP-017 追补毕销账**（17:47:26·CTO 验收）：1da5242（五字段+no-improvement 显式条·dimensions 不变）·本机 loop **11 passed** ✓·未动运行中进程照纪律——销账锚=1da5242。**轮面预期**：round2 联审若部署后起=本轮见 improvements·否则 round3 生效（如实档）。


**DP-024 取号**（19:52·R10 施工批·CEO 批讫 19:51:38）：9 items 分派——①先契约后施工→CTO ②exam 接线→CPO+FSD ③todo-list 族→CPO+FSD ④链稳定+failure_class→COO+FSD ⑤owner_seat 六字段→CHO+FSD ⑥消化率读数→CHO+FSD ⑦close 双字段→COS 自办 ⑧ceo_ruling 补→CFO/值席（11-29 前）⑨95 路线图→COO——**施工完+自测绿→直接点火**（CEO 令不需再呈报）·点火前四件照例·ETA 2-3h 各席并行。**FSD 回执（19:55:50）**：码面四件毕（todo-list 族 CPO-02/failure_class COO-01/owner_seat+消化率 CHO-01·02/close 双字段 COS-01）·三仓 commit TC 8e6d067+TriRMC 0411c05+TMV 87a56cc63·四套件 72 passed+charter TS 11 passed·CFO-01 经勘=值席流程非码面（转 COO SOP 执行面）。**待三非码面件**：CTO-01 契约卷/CPO-01 exam 接线/COO-02 95 路线图——候 COO 点火令（施工完点火·CEO 已批）。


**DP-025 补号**（19:59·D-88·BOD 直转补登记）：DP-20261123-025=fade-001 教程更新（CEO 直令 BOD 转 RDT）——新增「触发」章（段 1 触发面+DP-022 段号错位如实注）+「loop」章（M1-M9+DP-016/019/020/021 实现对齐）·执行体 RDT·**已毕销账**（TC **526fbc0**〔6 files +714/−6·sg 顶验真〕+TMV 施工卷 c63ff6a09〔76 行·sg 顶〕——07-trigger-and-ignition.md 280 行+08-loop-evolution.md 415 行+README v2.2.0——销账锚=526fbc0+c63ff6a09·三如实注转 CTO 对表·GitHub 两笔候网通窗）。


**DP-026 取号**（20:09·三如实注对表·DP-025 派生）：ⓐM3-v2 双对象门槛×代码 flag 边 aggregate average 未对齐→**CTO**｜ⓑM9 FUSE 仅 test 按态分支→**CTO**｜ⓒA/B 对象语义两套口径并存→**CAO/CHO 冻结窗统一**——CTO 主责 ⓐⓑ·CAO/CHO 协 ⓒ·状态=取号候各席对表卷。


**DP-027 取号**（20:14·P4 补件批·DP-026 ⓐⓑ 施工）：round_runner 同批两件——ⓐnextFlagEdge 双信号入参{avgA,avgB}（全 edge 双对象·单 side 废止·aggregate.average 降展示面）+ⓑM9 FUSE 按态收窄（test && round_count>=FUSE·debug 审批步节流·prod 不入 loop）——CTO 裁形（3e1125011 卷）+FSD 落码·**设计卷=trees/fade001-evolve-20261123/cto-dp028-parallel-joint-review-design-20261123.md（73964d6cd）**·**状态=挂起候融**（CEO 20:4x 裁「不着急，等任务书出来融合一起改」——暂缓落码·设计留卷·候下份 charter items 并入呈批；号 DP-028 已发不销）。


**DP-028 取号**（20:44·联审并行化·CEO 质询响应）：五件（各席独立产物 opinions-<seat>.json 写面隔离/聚合器唯一写 joint-review.json/run_dir 只读约定/并发 4+3 分批/env FADE_JOINT_PARALLEL=0 回退串行）·执行体 FSD·验收=7 席全落+31 维照验/27.5min→~10min 实测/429 降并发/串行回退可切·**设计卷=trees/fade001-evolve-20261123/cto-dp028-parallel-joint-review-design-20261123.md（73964d6cd）**·**状态=挂起候融**（CEO 20:4x 裁「不着急，等任务书出来融合一起改」——暂缓落码·设计留卷·候下份 charter items 并入呈批；号 DP-028 已发不销）。

## §二 · 轮间门件台账（ceo-ruling 落件跟踪）

| 轮 | 门件 | 目标位 | 落件执行 | 探针状态 | 复评时点 |
|---|---|---|---|---|---|
| W46 | ceo-ruling.json（terminate→改 continue） | `/var/lib/trirmc/cron/runs/shift-W46-.../` | 值席经 BOD 通道 | 待落 | 落件后 preflight 复跑 |
| W48 ignite | ceo-ruling.json（continue） | 同族路径 | 值席经 BOD 通道 | 待落（防 11-29 阻流） | 2026-11-29 前必验 |


## §二之二 · 进化环自动跟踪（M7 闭环·CEO 常驻令）

| 环次 | runId | A/B 出分 | ≤90? | 任务书代批 | 施工改造 | 点火 | 判级 |
|---|---|---|---|---|---|---|---|
| 环 1（loop 首跑） | shift-W48-loop-20261123T005158Z | A 49.49/B 52.38（参考） | 是 | charter-024923Z（COS 代批 ✓） | DP-012/013 修复毕 | 轮 2 段5 rc=2→resume 点火 | 候 |
| 环 1-resume | shift-W48-resume-20261123T033142Z | 候（ETA 12:20） | — | — | — | 执行中 | 候 |

**跟踪制**：每环五步（出分→代批→改造→点火→判级）逐格填·COS 值守每拍扫。

## §三 · 超时规则（人肉执行·DEM-006 试点）

1. **派工后 30min 无回执**→自动催办信至执行席+同步 COO/BOD（COS 值守每拍扫本台账）；
2. **门件类**=轮毕后 2h 内应落件（M5 SOP）·超时=升级 BOD；
3. **值守断档**（COS 值守面 >30min 无活动）=自报补位（互备 COS 覆盖）；
4. 每笔状态变更（在途→已回执）当场更新本表+台账一笔。

## §四 · 首批读数（本建时点）

- 派工在册 **11 笔**：已回执 7／在途 4（D-11-22-01/02/03、D-11-23-04）；
- 门件在册 **2 笔**（W46/W48 ignite·均待值席落件）；
- 今日断点案例回填：批 1-5 连发（COO 面）+值席批 3 BOD 直投 08:29 已入册（D-11-22-03）。

## §五 · 与既有台账分工

- 本台账=**过程面**（派工→回执链·可查可催）；
- COS 挂账台账（LG/M 系·open-items-ledger）=**结果面**（事项挂账→销账）；
- 两账互指：派工批号可被挂账笔引用·挂账销账时对表派工回执。

---
—— COS 小贾（m-cos·值守面）·写前现查 2026-11-23T08:31:25+0800（D-47 原值）

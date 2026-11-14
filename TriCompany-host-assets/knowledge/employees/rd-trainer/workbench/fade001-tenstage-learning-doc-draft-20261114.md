# FADE-001 十阶段改造学习教程（稿·大纲版）

- sourceOfTruth: 本件（RDT 知识工作区 workbench·学习面主笔文档稿）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 性质: 今日树（fade001-tenstage-review-20261114·charter 28bf42fdd）RDT 培训文档主笔产出稿——大纲版先落，主力段逐段填正文；完成版终落 TriCompany/docs/training/fade-001/ 候收口验收后转正
- 令源: CEO 三点令（2026-11-14 10:12·charter §二 RDT 行=学习面主笔令③触发器·写作逼出深读·学习面与质量面并重非赶工）
- 读者定位: 要接手 FADE-001 十阶段实现（runtime/cognition 新代码族 21 件+周日部署树段 1/2 触发器面）的研发新人

---

## §〇 材料锚清单（写作底本·每件当次实勘）

| 锚 | 路径/commit | 用途 |
|---|---|---|
| 协议十段正身 | TriCompany/docs/engineering/fade-protocol-spec.md §8.1（L421-451 链+恢复立法三款+CTO 批认注） | 十段职责定义真源 |
| 映射拆解卷 | TriMetaverse docs/workflow/operating-records/2026-W46/trees/fade001-ten-stage-mapping-20261112.md | L1-L7×F 系→十阶段归位总表+CEO 勘正（L4-L5 归前两段） |
| G1 双方案合成卷 | 同树 fade001-ten-stage-review/plan-synthesis.md（42d19aca2） | 裁决 A/B/C/D 定谳+七源合成叙事 |
| impl 终门 declaring | 同树 fade001-tenstage-impl-20261113/declaring-20261113.md（a4e1ed1cc） | G1-G4 段门链+段 6/9 注记+候件列+缺口列 |
| G2 施工 commit | TriCompany 6992f64（12 件 2264 行·段 3/5/6/8/9/10 骨架+六 test） | 逐段代码锚 |
| G3 施工 commit | TriCompany 173be2b（8 件+747/−16·段 4 dce_steps+段 5 扩形+段 7 rubric+段 8 五字段） | 逐段代码锚 |
| G4 集成 commit | TriCompany c458a17（test_tenstage_pipeline.py 219 行 2 案） | 最小闭环素材 |
| 现行域①教程族 | TriCompany/docs/training/fade-001/01-04（71c037c 拆分单域化后形态） | 衔接与差异对照（五步链→十段链演进） |
| 05 稿第一段 | TriCompany/docs/training/fade-001/05-trigger-chain-draft.md（308 行·触发链七层导读） | 段 1 触发面素材+十阶段骨架占位现势 |
| 域①现行代码 | TriCompany/runtime/cognition/weekly_plane_shift.py（328 行五步链） | 现状承载对照面 |
| 新代码族 | runtime/cognition/：plan_scope 405/verify 240+36/score_cli 116/score_rubric 191/close_skill 136+46/close_cli 98/notify_done 116/dce_steps 181+各 test（21 件） | 逐段深读对象 |

## §一 大的结果（为什么拆十段）

**一句话**：把「一条 bash 命令串一杆打死全链」的周迁移，改造成「十格各归其位、每格有闸有卷有终态」的 FADE 十阶段流水线——bash 只干第 1 格。

**改造前的痛**（映射卷 §一 CEO 定调解码）：旧形态 L1-L5 是一条 bash 命令串，把触发→执行→收尾全部塞进一拍。三个结构缺陷：①无阶段闸——L1-L5 的任何小问题（env 键错/路径错/git 撞车）都直接炸在业务本体（迁移器）上；②无准入资格——不检查"该不该跑/有没有资格跑"就开跑；③无范围分析——不判"迁什么不迁什么"，上周迁完还要一堆 agent 手动补准备。F4 事故（执行段 15 秒死）就是典型：分叉问题死在执行段，死得晚、死得哑。

**改造后的态**：十段各司其职，每段产物落卷（verdict 字段）+退出码闸（0 交棒/2 拦停）+run_id 全链贯穿。同样的问题死得更早、更响、死在正确阶段——F4 主解=预检上移到触发段（preflight），分叉在 preflight 就拦，迁移器根本不启动。

**当前位置**（impl declaring a4e1ed1cc·2026-11-13）：预演形全真达成——段 3/4/5/7/8/10 生产形深化+段 6/9 一次到位形+端到端集成 2 案，仓内 137 案全绿、389 门对 pre 基线零漂移；段 6 生产形真值（score_engine 实弹）候首拍；段 1/2 触发器面（bash 改形+preflight+qualify）=周日 11-15 部署树生产触点，今晚/今日树零生产触。

## §二 理论方法：FADE 十段协议与 FADE-001 映射

**协议真源**：`TriCompany/docs/engineering/fade-protocol-spec.md` §8.1 Runtime-owned durable 十段链：

```text
程序事件 → Runtime 登记去重锚定 run id → Agent Qualify → Plan Skill → DCE
→ Verify CLI（可选） → Score CLI → Score Skill → Close Skill → Close CLI → 终态
```

配套立法三款（§8.1 恢复策略·CTO 2026-11-04 批认具正身法条效力）：①幂等八段续跑（DETECTED/QUALIFYING/PLANNING/PLANNED/VERIFYING/SCORING/CLOSING/FINALIZING 重入零副作用）；②EXECUTING 是唯一改写工作区的段（DCE 重入即对已改物再改）→中断回退 CLOSING 收口核残证后终裁；③RETRY 是终态无出边——重试=同幂等键族登记**新 run 实例**。

**FADE-001 映射总表**（映射卷 §二·L1-L7×F 系归位）：

| 段 | 名 | 改造后承载 | 关键判据/锚 |
|---|---|---|---|
| 1 | 触发执行 | 定时触发+周算术（fromWeek/toWeek/startDate 参数定形+算周断言）+铸 run id+preflight 前置检查（含分叉预检） | F1/F6→告警闸；F4 主解；γ 主闸（算周断言） |
| 2 | Agent qualify | bash 载体资格（进程执行环境+8710 healthz 探针上移）+agent 到岗窗断言 | F2 到岗窗无断言→补 |
| 3 | plan skill | 纯业务面迁移范围分析（migrate/keep/carry_over 三分类·清单候审） | γ 二道闸 verify 对表 |
| 4 | DCE | 确定执行本体：pull→迁移器→commit→push 分段落卷；bash 只交棒 | F4 副解（段内自愈）；δ 缝隙 |
| 5 | verify cli | 迁移后验证独立成段：新周 index active+对表 plan 清单 | γ 二道闸 |
| 6 | score cli | score_engine 实弹跑分（三态路径分立） | F3（走件⑥改卷制）·J5-J7 灰度 |
| 7 | score skill | 考卷侧（八族八列·结构门） | 零改动遵行 |
| 8 | close skill | 复核+升级清单提取（五字段 spec） | 漏报护栏 |
| 9 | close cli | run 收口终态三态落 manifest | 死有名字 |
| 10 | 结论与动作 | 结论聚合+双向 notify+F 系登记销项 | ζ 成功通知不可达→闭合面 |

**读法一句话**：现状第 1 格吞掉了 1/4/5/8/10 五个格的活；改造=十格各归其位，bash 只干第 1 格。

**CEO 勘正段**（映射卷 §五·23:06 令）：L4 周算术=阶段 1 触发参数定形（算清本轮迁哪周+算周断言），L5 进程执行=阶段 2 载体资格——plan skill=纯业务面迁移范围分析，不碰 L4/L5。原表 L4 归 plan skill 系错位，已勘正。

**拓扑分界**（新人最容易混淆的一刀）：段 1/2=触发器面，落河源 TriRMC 生产面（bash payload 改形·周日部署树承载）；段 3-10=本仓 `runtime/cognition/` Python CLI 族（已落仓 21 件）。本仓集成案的段 1/2 产物（preflight.json/qualify.json）=上游交棒模拟卷。

## §三 最小闭环：端到端集成案先跑通

**新人第一站**：`TriCompany/runtime/cognition/test_tenstage_pipeline.py`（G4·c458a17·219 行 2 案）。跑法：

```bash
cd /d/Code/ai/TriCompany && python -m pytest runtime/cognition/test_tenstage_pipeline.py -v
```

**案 1 绿路链**（test_full_chain_green）：临时目录搭出 from 周（tree-a active+tree-b 空+OP index）→段 3→10 顺序跑八段全链→七件段产物（plan/dce/verify/score/close/manifest/notify_done.json）逐一断言→**T1-1 单测面预演：run_id 同串贯穿全部段产物**（生产面收口点=首拍·两层锚显标）。看点：①段 1/2 产物是手工放的模拟卷（preflight.json/qualify.json·verdict=pass）——本仓集成域外；②段 4 走 dry-run 默认（steps 渲染四步 pull/migrate/commit/push·rc=None·零生产触）；③段 6 用 mock 打点 probe_score_engine 返回 engine present（部署后形态预演·现役域实际是 engine_absent）；④段 9 六段产物齐+全 pass → manifest run_state=ok。

**案 2 负面拦截链**（test_fail_chain_upgrade_entry_and_alarm_route）：手工毒化 plan.json（verdict=fail）→段 5 verify 拦（**exit 2**·plan_baseline 毒化拦）→段 8 close 提取升级条目（**五字段值面断言**：run_id 同串/trigger=stage_artifact_fail/routing∈{候 COS,候 CEO}/evidence 段产物路径指针非零锚/state=open）→段 9 derive failed→段 10 失败告警路由（subject_prefix=失败告警+文案带 run_id·--dry-run-only 零发送）。

**两案各自防什么**：案 1 防链断（段间交棒/产物文件族/run_id 贯穿）；案 2 防**静默失败**（毒化输入必须被拦+升级条目必须如实提取+告警路由必须到达——「结构门绿≠零升级」：close rc=0 但升级清单非空是合法态，漏报才是毒）。

## §四 逐段原理拆解（每段实读代码后填·2026-11-14 深读实锚）

全族横切设计模式（读任何段前先记这八条，段间反复出现）：
1. **退出码同族**：0=交棒下段；2=拦（verdict=fail 落卷后停）——preflight/qualify/plan_scope/verify/score_cli 五 CLI 同族。
2. **哑卷防线**：段产物落卷失败→print 错误+return 2（七处同族）——宁拦不哑。
3. **替身禁令**：输入缺/坏/不可读=FAIL-EXPECTED，禁造空清单/空 dict 替身（替身会让下游断言假绿）。
4. **结构门写前自校验**：plan_scope/close_skill 两处——落卷前先 assert 自己产物的键族/一致性，毒化拦不写假卷。
5. **mtime 序取最新**：OP index 多件时取 mtime 最新禁字典序（妆容劫持防族规·plan_scope L213/verify L111/L138 三处）。
6. **stdout reconfigure 兜底**：非 UTF-8 宿主（GBK 炸实锚）输出面兜底（dce/verify/score_rubric/close_skill 四处）。
7. **run_id 全链主键**：七件段产物 JSON 各带 run_id 键——T1-1 断言同串贯穿。
8. **如实落卷纪律**：降级态/缺件态/未知态全部显式落卷不静默（dry_run 标注/absent note/render_only/unknown 降级）。

### 段 1 触发执行（触发器面·周日部署树承载·今日零触形态预览）

- **职责**：定时触发+算清本轮参数（fromWeek/toWeek/startDate=周算术+算周断言 γ 主闸）+铸 run id+preflight 前置检查（含分叉预检=F4 主解）。
- **代码落点**：河源 TriRMC bash payload 改形（生产触点面·周日部署树份额）——payload 从「pull+迁移器+commit+push 一杆」改为「preflight→铸 run id→交棒 FADE 流水线」。run id 形制正则 `^shift-W\d+-\d{8}T\d{6}Z$`（T1-1 断言·集成效验值 `shift-W47-20261116T000000Z` 同形）。
- **preflight 上移语义**：现 plan 前置断言四条（hostname/ff 断言/无进行中 git 操作/8710 healthz）住在迁移器 python 内部——跑不到就永远检不了；上移到触发段=bash 先跑 preflight 脚本，不过=这拍不执行+告警。
- **告警闸**（F1/F6 合并判据）：漏拍或败跑 N 分钟无 per-run 成功日志即告警；挂 job 级非 service 级（degraded 阈值 3 对周任务=3 周窗）。
- **误区**：把 bash 当全链执行器（旧形态根因）；算周用手算（集成案 L49 注「动态周锚禁手算」——ISO 周自洽用 isocalendar 推算）。

### 段 2 Agent qualify（触发器面·周日部署树承载）

- **职责**：进程执行环境资格断言（bash 载体形态/8710 healthz 探针上移）+agent 到岗窗断言（F2 补缺）。
- **产物**：qualify.json（五断言全过态字段·T1-2 断言对象——值面字段必读非仅存在性）。
- **接棒关系**：与 preflight「该不该跑」零重叠探针零复检；与 plan「迁什么」零重叠——各段探针零复检是映射卷定谳的分段原则。
- **误区**：以为 qualify 是 agent 人格审查——它审的是**执行载体资格**（进程环境），不是 AI agent 的判断力。

### 段 3 plan skill（本仓 plan_scope.py·405 行·G2 落仓）

- **职责**：判「迁什么不迁什么」——纯业务面迁移范围分析。语义锚（CPO 件 C）：**「这是一周的记录，还是这一周的活——记录随周封存·活随人带走」**。
- **三分类**：migrate=在途树（活随人带走·预演形零动手候审·生产形=index 元数据层搬家）；keep=全 close/记录面（原地封存·degrade 链终态=保守 keep）；carry_over=unresolved-items §1 CARRY 行（两形正则+状态去向三值 frozen/closed/pending_review）。
- **degrade 链分类器**（classify_dir L79-111）：①tree-op.json status（_KEEP_STATUS={done,closed,retired,cancelled}→keep；其余非空值→migrate）→②authorization.json expiry（未过期或解析败=保守在途 migrate·「过期判断不可得时不放行」）→③默认 keep（**漏迁毒于误封存**——verify 对表+carry_over 面+生产形候审三兜底）。
- **双向枚举断言**（bidirectional_check L182-199·STE 锚②）：M∪K=S 零遗漏∧M∩K=∅ 零重叠+**phantom 幽灵检测**（清单外条目也拦）——违即 exit 2。注意实现口径：断言域=from 周 trees/ 条目全集（目录+散文件混装形），carry_over 是 unresolved-items 的行、不进 trees 全集断言（文件缺失=合法空集·carry 面是迁移器 carry_over 步的域）。
- **替身禁令三向**（S51）：目录缺失/不可读/结构门毒化=exit 2 FAIL-EXPECTED——空 keep 全集形=最毒替身（双向断言会假绿）。
- **index_drift 旁证对表**（L205-225）：OP index 与实盘脱节是现势常态（W46 实锚 activeTrees=0 vs 实盘 20+）——旁证读数非分类基准，读败不拦。
- **周目录年段名**（_resolve_week_dir L258-276）：实盘形=`2026-W46`——start_date ISO 年推算+glob fallback，多命中=fail-closed 不猜。
- **实弹读数**：r2 pass migrate=2/keep=26/carry_over=2（G2 验收锚）。
- **验证**：`python -m pytest runtime/cognition/test_plan_scope.py -v`（409 行测试件）。
- **误区**：把 OP index 当真值基准（它只是旁证）；散文件当 migrate 候选（默认 keep 原地封存）。

### 段 4 DCE（本仓 dce_steps.py·181 行骨架+部署树窗精化·G3 落仓）

- **职责**：迁移本体确定性执行——段序编排（步骤表+rc_guard+每步读数落卷）。**dry-run 默认零生产触**；--execute=部署树生产 wiring 保留位。
- **段序四步**（DCE_STEPS L62-104）：pull（`git pull --ff-only`·并行窗互踩防线拒 diverge）→migrate（`python3 -m runtime.cognition.weekly_plane_shift --from … --to … --start-date … --operating-root … --sync`·迁移器 CLI 真身）→commit（精确 pathspec `docs/workflow/operating-records` 禁 -A 全仓+zero-diff 防线+vB 识别式消息形 `ops: weekly plane shift W<X>->W<Y> run=$RUN_ID`）→push（sg-bare HEAD:dev+断通道 fetch/merge 重试面·rc_guard=False 降级如实注）。
- **rc_guard 拦停段**（run_dce L152-172）：rc_guard=True 步 rc≠0→exit 2+failed_step+**break 后续步骤零执行**；push 步 rc_guard=False（降级不拦·如实注）。
- **零外溢判据三位**（OVERFLOW_CHECKS·aca95877c 原样）：week_dir_structure/carry_over_semantics/commit_message_shape——骨架态=口径位声明（checked=False），生产形真值对表候部署树授权窗。
- **全名消歧**（CTO 审面勘正在案）：weekly_plane_shift.py=CLI 入口（main+γ 闸）≠weekly_plane.py=库函数面（migrate_weekly_plane 实装）——引用带全名。
- **部署树窗精化三案**（2026-11-13·如实勘正史）：G3 骨架形 migrate 步传 `--plan-file` 系参数面错位（weekly_plane_shift argparse 不识→--execute 必 SystemExit(2)拦停段·**G4 集成案走 dry-run 渲染面故未暴露**）——本形照 argparse 实锚 L348-352 修正，--plan-file 保留为交棒锚记录位（值随 dce.json 落卷）。教训：dry-run 面只验渲染不验参数真跑，--execute 面的参数错位要靠部署树窗实走抓。
- **与域①五步链的关系**：域① weekly_plane_shift 内部五步（create/migrate/carry_over/validate/agent_close·幂等可重跑）是**迁移器本体**；段 4 是**包着迁移器的执行编排**——两层不混。
- **验证**：`python -m pytest runtime/cognition/test_dce_steps.py -v`（164 行·dry-run 渲染面+rc_guard 拦停案）。
- **误区**：把 dce_steps 当迁移器（它是编排壳）；在非部署窗传 --execute（零生产触铁律）。

### 段 5 verify（本仓 verify.py·276 行·G2 落仓+G3 扩形）

- **职责**：判「迁完验迁对」——以 plan.json 为基准面四断言。
- **四断言结构**（run_verify L165-218）：
  - A plan_baseline（check_plan_baseline L50-64）：plan verdict=pass+counts 与清单实长一致——**毒化 plan 不接棒**（轻量复验）。
  - B γ 归位（check_gamma L67-83）：start_date isocalendar 周号推算==to_week——数学面二道闸（现役 γ 闸 weekly_plane_shift L424-434 独立成段）；start_date 缺省=skip 不拦（如实注记）。
  - C 新周 index active（check_new_week_index L86-118）：to 周 OP index 可得+可解析+activeTrees 键在（结构面）——年段推算+glob fallback 与 plan_scope 同形。
  - D migrate_vs_index（check_migrate_against_index L121-159·**--strict 生产形**）：plan.migrate entries vs to 周 index 两落点并集（doneTreesFromPreviousWeek∪activeTrees·CTO 注一措辞精化·锚 weekly_plane.py L282-283/L208）逐项对表——items=[{entry,status:landed|missing}] 逐项读数，deficit 非空=exit 2。
- **strict 短路设计**（L194）：strict 对表只在前面全绿时才跑（`not errors` 门）——fail-fast；预演形默认 off（迁移器未真跑时对表必炸·--strict 留首拍实走路径）。
- **验证**：`python -m pytest runtime/cognition/test_verify.py -v`（319 行·含毒化 plan 拦/γ 不符/strict 对表赤字段）。
- **误区**：预演形跑 --strict（必炸·迁移器未真跑）；把 landed/missing 当三值（二值——landed=全集−missing 消费侧可推导）。

### 段 6 score cli（本仓 score_cli.py·117 行·G2 落仓·CTO 精化一）

- **职责**：判「跑完有没有分」——**三态路径分立**（9c-d6e636d 留痕）：
  - executed_ok：score_engine 实跑成功→exit 0·score.json 载读数。
  - executed_failed：引擎在但实跑抛异常/返回非 dict（契约面违规）→exit 2·非阻塞告警面（COS 单址）。
  - engine_absent：score_engine 模块不存在→exit 2·**J7 升级面仅限此路径**（部署面缺件≠引擎坏了——升级路由判据面分立防误升）。
  - （engine_broken_import：import 期非缺席异常→归入 executed_failed 非缺席路径。）
- **探测点**（probe_score_engine L31-39）：importlib 探测·缺席≠跑败——升级路由看 engine_state 分立。
- **生产形真值**：score_engine 实弹候首拍/部署树（J5-J7 灰度退出条件）——首拍默认态=engine_absent（如实落卷·不伪造分数）。
- **验证**：`python -m pytest runtime/cognition/test_score_cli.py -v`（81 行·三态路径各一案）。
- **误区**：把 engine_absent 当引擎故障升级（J7 仅缺席路径）；给骨架形编分数（如实落卷纪律——没有 engine 就没有 score 字段）。

### 段 7 score skill（本仓 score_rubric.py·192 行·G2/G3 落仓）

- **职责**：考卷面结构承载——**考卷侧零改动遵行**（八族内容不复制·复制=卷面漂移风险·改卷制=件⑥候选窗）。
- **结构门**（validate_rubric L119-143）：八列字段族（family_id/family_name/reading_point/collection_cmd/verdict_rule/weight/close_layer/special_clause）+族号 A-H 机械键唯一+权重合计=100 断言。
- **红灯定性上限**（_REDLINE_CAPS）：族 C 红=79 上限·族 G 红=59 上限——**红灯不因其他族高分洗白**。
- **F2 免评分母**（F2_ZERO_TRIGGER_FULL_SCORE）：零触发+标记正常=满分·不因无告警扣分（CPO 口径 2）。
- **T1 三断言候选注记位**（T1_CANDIDATE_NOTES L50-116）：a2c246908 原样零修订落位（T1-1 run 身份结构/T1-2 qualify 资格面/T1-3 告警链结构）——**落位≠改卷生效**（CPO 裁③钉子·生效动作锚施工验收毕时点）+零权重条款（断言级权重不入卷·违同值同源）+联合覆盖语义（T1-2 拦截态红+T1-3 触发分支接管·防把 T1-2 误读成任何形态必须 rc=0）。
- **产物形差异**：report 不落 run_dir（--out 缺省只打印）——结构门独立面，不产 run 级产物（与集成案 L122-126 tempfile 直调一致）。
- **验证**：`python -m pytest runtime/cognition/test_score_rubric.py -v`（112 行）。
- **误区**：以为本模块存考卷内容（只存结构+指针·内容真源=pm-firstshoot-reading-checklist-20261113.md）；把 T1 注记当已生效卷面（候施工验收毕生效）。

### 段 8 close skill（本仓 close_skill.py·171 行·G2 落仓+G3 精化二）

- **职责**：判「复盘在收口时自动发生」——扫段产物提取升级条目。
- **漏报护栏**（CTO 精化二·c5d6e636d 留痕）：close.json **必载 upgrade_list_state 键**显式二值（extracted=提取流程实跑过·含空清单合法态/not_extracted=骨架未提取）——缺键=结构门拦（**静默缺省=最毒漏报形：收口面看着干净实则没跑**）。
- **升级条目五字段 spec**（_mk_upgrade_entry L74-87）：run_id/stage+trigger（枚举：stage_artifact_fail|J7_score_engine_absent|artifact_unreadable）/routing（候 COS|候 CEO 二值·保守默认候 COS）/evidence（run id+段产物路径指针·**禁零锚升级条目**）/state（open|routed·默认 open）。
- **防蠕变划线**（D-39 对表承载）：清单=提取与承载不做裁决（裁=COS 域）——零裁决语义字段进 schema（**禁自动降级/自动销项**）。
- **扫描语义**（scan_stage_artifacts L36-71）：五件段产物（preflight/qualify/plan/verify/score）——缺件=如实 note 不拦；不可读=毒化族升级条目；verdict=fail→提取；score.json engine_absent→J7 前缀+专属 trigger。
- **同源复用**：run_state 字段复用 close_cli 的 derive_run_state/summarize_stages（零重复·两件同源一致——升级清单与终态判据不分叉）。
- **验证**：`python -m pytest runtime/cognition/test_close_skill.py -v`（149 行）。
- **误区**：把 close rc=0 当零问题（**结构门绿≠零升级**——升级清单非空是合法态·集成案 L196 注）；给 routing 写自动分诊逻辑（防蠕变划线禁）。

### 段 9 close cli（本仓 close_cli.py·99 行·G2 落仓）

- **职责**：判「每个 run 有终点」——run 终态三态字段落 manifest.json。
- **三态判**（derive_run_state L47-54）：ok=六段产物全在且 verdict 全 pass；failed=全在但有 fail（**死有名字**——哪段死·reasons 在各段卷内）；stale=缺件或不可读（悬空 run 面·**absent/unreadable 优先于 fail**——六段产物齐才得 ok/failed 真值）。
- **manifest 层=终点记录非闸**（L9-10）：不拦链不告警（告警面在前段+段 10）——如实汇总落卷即本职；任何 run_state 都是合法落卷（exit 0·只有落卷败=2）。
- **六段序**（_STAGE_ORDER）：preflight/qualify/plan/verify/score/close——arrival/cron 面不入此对表域。
- **验证**：`python -m pytest runtime/cognition/test_close_cli.py -v`（110 行·三态各案）。
- **误区**：把 manifest 当闸（它不拦链）；以为缺件会得 failed（缺件=stale——终态判据顺序 absent/unreadable→stale 最优先）。

### 段 10 结论与动作（本仓 notify_done.py·117 行·G2 落仓）

- **职责**：判「结论到达人」——ζ 缝隙闭合面：成功/失败双向 notify 路由。
- **三态路由映射**（_ROUTE L25-29）：ok→结论通知（COS 到达反馈·成功面）；failed→失败告警（**文案必带 run id**·PM 契约定谳·traceable）；stale→悬空 run 报告（如实告知）；未知态→如实降级 unknown 面（fail-closed 方向）。
- **best-effort 契约**（L54-70）：复用 P1 notify.py send_notification（永不抛）+兜底 except——**notify 本身永不拦**（exit 0 除非落卷败）；--dry-run-only=render_only 零发送（沙箱/演练面·生产 payload 不传）。
- **context_id=run_id**（L66）：PM 契约 run id 全链主键——通知可回溯到 run dir。
- **验证**：`python -m pytest runtime/cognition/test_notify_done.py -v`（118 行·三态路由+render_only 案）。
- **误区**：在演练时真发信（忘传 --dry-run-only）；把 notify 失败当 run 失败（best-effort·run 失败看 manifest.run_state）。

## §五 增量实现链：G1-G4 四段门施工史（每门解决上一版什么问题）

增量链主线：**骨架落形→生产形深化→全链贯通**——每门不是"多做一点"，是解决上一版暴露的一类问题。

| 门 | 锚 | 交付 | 解决上一版什么问题 |
|---|---|---|---|
| G1 | TMV 42d19aca2（plan-synthesis.md） | CTO/PM 双方案合成卷·裁决 A/B/C/D 定谳 | 双方案分叉：实现与部署两层窗怎么切（裁决 A）、预演形验到什么深度算数（裁决 B=落卷即验）、评分怎么定（裁决 C）、实弹读数哪来（裁决 D=先行批+增补两段式） |
| G2 | TC 6992f64（12 件 2264 行） | 六 CLI+六 test 一次到位形（段 3/6/7/8/9/10） | 链上五个"判"段无代码：plan_scope 判迁什么/score_cli 判有没有分/score_rubric 判怎么评/close_skill 判复盘收口/close_cli 判有终点/notify_done 判到达人——骨架先落，段 6/9 提前备毕（无独立深化份额·非缺工） |
| G3 | TC 173be2b（8 files +747/−16） | 段 4 dce_steps+段 5 verify 扩形+段 7/8 精化+三 test | 两个执行/验证段缺位：DCE 段序编排（dry-run 默认零生产触）+verify 四断言基准面；段 8 漏报护栏五字段精化 |
| G4 | TC c458a17+TMV 7b9cd50f2（test_tenstage_pipeline.py 219 行 2 案） | 端到端集成：绿路链+负面拦截链 | 单段绿≠链通：段间交棒真实性（run id 传递/段产物消费/哑卷拦截/静默失败捕获）零覆盖——集成案补上"链断在哪一格看得见" |

验收读数链：G2 75 案落绿（r2 实弹 migrate=2/keep=26/carry_over=2）→G3 135 案（STE 九面独立自采 PASS 28472443c）→G4 仓内 137 案全绿+389 门 post 438 案对 pre 基线@679ed67 五案同名零漂移零新引入（STE 独立复跑旁证）。

## §六 完整实现与生产级考虑

- **两层窗（裁决 A·主线定谳）**：11-13 今晚树=实现面零生产触全链闭环（预演形全真）；周日 11-15 23:50 首拍=部署+十阶段全链实走（生产形真值收口点·vB 判据族 8237d12af 有效至 payload 换形）。读代码时每段都有"预演形 vs 生产形"两条线——预演形全真指**链路形态**全真，不是生产数据真跑。
- **段 4 --execute 生产 wiring 保留位**：默认 dry-run 渲染面零触；真跑面（subprocess+shell）代码在、测试有、生产调用=部署树授权窗（payload vB→十阶段形 PATCH 授权·expiry=authorized_at+72h）。新人纪律：**非部署窗禁传 --execute**。
- **段 4 OVERFLOW_CHECKS 三判据**（aca95877c 原样）：week_dir_structure/carry_over_semantics/commit_message_shape——骨架态=口径位声明（checked=False 落卷），生产形真值对表候部署树授权窗实走。这是"如实落卷纪律"的典型：**没跑的检查声明没跑，不伪造 checked=True**。
- **段 6 生产形真值**：score_engine 实弹候首拍/部署树——首拍默认态=engine_absent（如实落卷）；J5-J7 灰度退出条件=部署树窗份额。
- **段 7 改卷生效**：T1 三断言候选注记落位≠改卷生效（CPO 裁③钉子·生效动作锚施工验收毕时点）——"填位"与"生效"两时点分开，是考卷治理的关键纪律。
- **段 1/2 触发器面周日部署**：payload vB→十阶段形换形（铸 run id 形制/preflight 上移/告警闸挂 job 级）+现役判据族换锚链——今日零触，形态预览见 §四段 1/2。
- **run id 身份贯穿**：`shift-W{week}-{YYYYMMDD}T{HHMMSS}Z` 正则形制（T1-1）——七段产物 JSON 各带 run_id 键，任何一段产物脱离 run id=哑卷。
- **评分框架（裁决 C）**：三档 80/60+八族权重 A10/B10/C15/D10/E10/F15/G20/H10=100；红灯上限 C79/G59 不洗白；F2 免评分母。
- **恢复立法三款**（协议 §8.1·CTO 2026-11-04 批认具正身法条效力）：幂等八段续跑/EXECUTING 唯一改写段回退 CLOSING/RETRY 终态无出边（重试=新 run 实例）——读 verify/close_cli 的"缺件=stale"判据时对照此法条。
- **回归门纪律**：每门收口必过 389 门（post 对 pre 基线零漂移零新引入）——"既有失败"定性禁转抄，须独立验。

## §七 事故与教训（施工真实翻车案·培训价值最高段）

- **案① --plan-file 参数面错位（段 4·G3 骨架形）**：骨架形 migrate 步给 weekly_plane_shift 传 `--plan-file`，其 argparse（实锚 L348-352）不识该参数——**--execute 必 SystemExit(2) 拦停段**。为何 G4 集成案没抓到：集成案走 dry-run 渲染面（只验模板渲染不验参数真跑）。修：照 argparse 实锚修正参数面，--plan-file 保留为 CLI 交棒锚记录位（值随 dce.json 落卷）。**教训：dry-run 面≠执行面——参数错位这类错要靠部署树窗实走抓；测试面设计时要想清"这一案到底验的是渲染还是执行"。**
- **案② 全名消歧（段 4）**：weekly_plane_shift.py=CLI 入口（main+γ 闸）≠weekly_plane.py=库函数面（migrate_weekly_plane 实装）——同名近形，引用不带全名=指错对象。CTO 审面勘正在案。
- **案③ commit pathspec 精确禁 -A（段 4 commit 步）**：`git add docs/workflow/operating-records` 精确 pathspec+zero-diff 防线（vB 原形）——W47 残留/仓内未跟踪件零卷入（SDE 实采实锚）。**教训：调度器代码里的 git add 一律精确 pathspec，-A 全仓面会把并行席位的裸工作区卷进自动 commit。**
- **案④ 哑卷防线七处同族**：落卷失败→print+return 2——**宁拦不哑**。反面教材=替身禁令：缺/坏输入造空清单替身，双向断言会假绿（S51：空 keep 全集形=最毒替身）。
- **F1-F6 发现族**（前置背景）：缺陷登记簿+改造候选池——F4 主解=预检上移（死得早死得响死在正确阶段）；F1/F6 合并=告警闸挂 job 级；三层教训 G1-G3 已转正（7da350710）。
- **段 3 实弹读数增补窗（裁决 D）**：G2 实弹 r2 读数=先行批；首拍后方案稿增补实弹锚（PM 建议采认增量窗）——两段式=预演形读数与生产形读数分开记账。

## §八 心智模型总结与接手任务清单

**核心心智一句话**：bash 只干第 1 格（触发），十格各归其位——每段一个问题、一件段产物、一个退出码族。

**十段问题链**（读任何段先问它答哪个问题）：
段 1 触发执行「该不该跑·算什么」→段 2 qualify「载体有资格吗」→段 3 plan「迁什么」→段 4 DCE「跑」→段 5 verify「迁对没」→段 6 score cli「有没有分」→段 7 score skill「怎么评」→段 8 close skill「复盘收口了没·有什么升级」→段 9 close cli「每个 run 有终点吗」→段 10 notify「结论到达人了吗」。

**全族横切八条**（§四开头列的退出码同族/哑卷防线/替身禁令/结构门自校验/mtime 取新/stdout 兜底/run_id 主键/如实落卷）——这八条是读仓内任何 FADE 段模块的"预装透镜"，也是自己写段模块的检查单。

**读码顺序**（新人第一周）：
1. 协议真源 `TriCompany/docs/engineering/fade-protocol-spec.md` §8.1（十段链+恢复三款）。
2. 映射卷 `operating-records/2026-W46/trees/fade001-ten-stage-mapping-20261112.md`（bash 现状↔十格映射+CEO 23:06 勘正）。
3. 集成案 `runtime/cognition/test_tenstage_pipeline.py`（2 案=绿路+负面，全链在 219 行里走一遍）。
4. 逐段模块：plan_scope→dce_steps→verify→close_cli→notify_done→score_cli→score_rubric→close_skill（判段在先·承载段在后）。

**自测命令族**（每步验证方式·**仓向=TriCompany 仓根**——段模块落 TriCompany/runtime/cognition/·在 TriMetaverse 仓跑=找不到文件。实勘：六件 75 passed in 1.87s·2026-11-14）：
```
python -m pytest runtime/cognition/test_tenstage_pipeline.py -v   # 全链 2 案
python -m pytest runtime/cognition/test_plan_scope.py -v          # 段 3
python -m pytest runtime/cognition/test_dce_steps.py -v           # 段 4
python -m pytest runtime/cognition/test_verify.py -v              # 段 5
python -m pytest runtime/cognition/test_close_cli.py -v           # 段 9
python -m pytest runtime/cognition/test_notify_done.py -v         # 段 10
```

**周日首拍观察点**（看懂首拍卷面要盯什么）：run id 是否同串贯穿七段产物（T1-1）→qualify.json 五断言值面（T1-2）→dce.json steps[] 各步 rc 与 failed_step→verify D 断言 landed/missing 逐项→score.json engine_state 三态如实→manifest.run_state 三态→升级条目五字段齐（run_id/stage+trigger/routing/evidence/state）→通知文案带 run id。

**接手任务清单**（从低危到高危）：
1. 文档面：本文档转正版维护（`TriCompany/docs/training/fade-001/`）——读卷面勘讫勘误。
2. 测试面：段模块单测补案（对照 STE 质量面 review 发现）。
3. 骨架代码面：段模块小修（FSD 审批·架构变更需 CTO）。
4. **生产触点面（新人禁触）**：payload 换形/--execute wiring/判据族换锚/daemon 面——一律候部署树授权窗，接手满第一周+导师陪跑后才分配。

**常见误区对照表**：

| 误区 | 正形 |
|---|---|
| 把 bash 当全链执行器 | bash 只干段 1（触发+参数+run id） |
| 把 dce_steps 当迁移器 | 它是编排壳；迁移器=weekly_plane_shift CLI（域①五步链在迁移器内部） |
| weekly_plane_shift 与 weekly_plane 混引 | 前者 CLI 入口·后者库函数面——引用带全名 |
| 预演形跑 --strict verify | 必炸（迁移器未真跑）——--strict 留首拍实走 |
| engine_absent 当引擎故障升级 | J7 升级面仅限缺席路径；跑败=executed_failed 非阻塞告警面 |
| close rc=0 当零问题 | 升级清单非空是合法态；漏报（缺 upgrade_list_state 键）才是毒 |
| 缺件 run 判 failed | 缺件/不可读=stale（六段产物齐才得 ok/failed 真值） |
| 把 manifest 当闸 | manifest=终点记录非闸（告警面在段 10） |
| T1 注记当已生效卷面 | 落位≠生效（CPO 裁③·候施工验收毕） |
| notify 失败当 run 失败 | best-effort 永不拦——run 失败看 manifest.run_state |

---

## 今日施工账（节律对表）

- 10:30-12:00 段：大纲版落卷毕（本件）——逐段骨架+素材锚清单全落，主力段零预写（占位纪律·候深读后填）。
- 13:00-18:00 段：逐段深读+正文填充毕——§一-§八全部正文填讫（§四十段逐段统一骨架+横切八条；§五增量链四门表+读数链；§六两层窗+十条生产级；§七案①-④教训；§八心智模型+读码序+自测命令族〔实勘 75 passed〕+首拍观察点+接手清单+误区对照表十行）。
- 18:00 前：深读发现汇总两栏（见树面触发记录更新版）。
- 零生产触铁律：本文档线只读代码+写 workbench 稿，payload/现役判据/jobs.json/daemon 零触（pytest 自测=仓内沙箱面·只读执行零写生产面）。

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

写作要点（占位·主力段填）：
- 现状痛：L5 bash 一条命令串把触发→执行→收尾一杆打死——无阶段闸、无准入资格、无范围分析，L1-L5 任何小问题直接炸在业务本体（周迁移本体）上。
- 目标态：十格各归其位，bash 只干第 1 格（触发器）；映射总表一句话=「现状第 1 格吞掉了 1/4/5/8/10 五个格的活」。
- 当前位置：预演形全真达成（十段骨架+段 3/4/5/7/8/10 生产形深化+137 案全绿·段 6 生产形真值候首拍）；段 1/2 触发器面=周日部署树生产触点。

## §二 理论方法：FADE 十段协议与 FADE-001 映射

写作要点（占位）：
- 协议真源链：§8.1 Runtime-owned durable 十段链（程序事件→登记锚定 run id→Qualify→Plan→DCE→Verify→Score CLI→Score Skill→Close Skill→Close CLI→终态）。
- 两 profile 正交+恢复立法三款（幂等八段续跑/EXECUTING 唯一改写段回退 CLOSING/RETRY 终态无出边）。
- FADE-001 映射总表（十行全录+读法）：段 1=触发执行（L1-L3+L4 周算术+铸 run id+preflight 上移）/段 2=Agent qualify（L5 载体资格）/段 3=plan skill（纯业务面范围分析）/段 4=DCE/段 5=verify cli/段 6=score cli/段 7=score skill/段 8=close skill/段 9=close cli/段 10=结论与动作。
- CEO 勘正段：L4 周算术=阶段 1 触发参数定形、L5 进程执行=阶段 2 载体资格（原表 L4 归 plan skill 不对·23:06 令）。

## §三 最小闭环：端到端集成案先跑通

写作要点（占位）：
- 新人第一站=test_tenstage_pipeline.py 2 案：绿路链（段 3→10 顺序八段全链·run_id 同串贯穿七段产物断言）+负面拦截链（毒化 plan→verify 拦 exit 2→close 升级条目五字段→derive failed→notify 失败告警路由）。
- 跑法+预期读数+两案各自防什么。

## §四 逐段原理拆解（主力段·每段实读代码后填）

每段统一骨架：职责一句话/入口与参数/核心对象/代码路径+行段/验证方式/常见误区/生产形差异。占位清单（主力段施工序）：
- 段 1 触发执行：bash 改形五要点（铸 run id 形制/preflight 上移/告警闸挂 job 级/F5 顺手修）——素材=映射卷 §三+05 稿第一段；代码=周日部署树（今日零触·写形态预览）。
- 段 2 Agent qualify：载体资格+到岗窗断言——素材=映射卷 §二行 2。
- 段 3 plan skill：plan_scope.py 405 行（三分类 migrate/keep/carry_over+双向枚举断言 M∪K∪C=S+替身禁令三向+周目录年段名实锚）——实弹读数 r2 pass migrate=2/keep=26/carry_over=2。
- 段 4 DCE：dce_steps.py 181 行（dry-run 默认零生产触+rc_guard 拦停段+OVERFLOW_CHECKS 三判据位）+域①五步链对照（weekly_plane_shift 328 行）。
- 段 5 verify：verify.py 240+36 行（γ 归位+plan 基准毒化拦+新周 index active 断言+--strict 生产形对表开关+per-item landed/missing 逐项读数扩形）。
- 段 6 score cli：score_cli.py 116 行（三态路径分立 executed_failed≠engine_absent·J7 升级面仅缺席路径）——生产形真值=score_engine 实弹候首拍（如实落卷形态）。
- 段 7 score skill：score_rubric.py 191 行（八列族/权重合计 100/红灯上限 C79-G59/F2 免评分母+T1 定谳填位 a2c246908 原样·候施工验收毕生效标注 CPO 裁③）。
- 段 8 close skill：close_skill.py 136+46 行（upgrade_list_state 显式二值禁静默缺省+COS 单址+run_state 同卷+升级条目五字段 spec run_id/stage+trigger 枚举/routing 候 COS/evidence 指针/state open·D-39 对表防蠕变划线）。
- 段 9 close cli：close_cli.py 98 行（run 终态 ok/failed/stale 三态 manifest 落卷+derive_run_state absent=stale 优先于 fail）。
- 段 10 结论与动作：notify_done.py 116 行（结论路由三态+告警文案必带 run id·PM 契约）。

## §五 增量实现链：G1-G4 四段门施工史

写作要点（占位）：G1 双方案合成（七源+裁决 A-D）→G2 六 CLI 骨架（75 案落绿）→G3 段 4/5/7/8 深化（135 案+STE 九面独立自采）→G4 端到端集成（137 案全绿+389 门零漂移）；每段门=解决上一版什么问题（G2 骨架落形→G3 生产形深化→G4 全链贯通）。

## §六 完整实现与生产级考虑

写作要点（占位）：两层窗裁决 A（实现面≠部署面）；段 6 生产形真值与 J5-J7 灰度退出条件；段 1/2 触发器面周日部署（payload vB→十阶段形授权窗换形·判据族换锚链）；run id 身份贯穿七段产物；评分三档 80/60+八族权重 A10/B10/C15/D10/E10/F15/G20/H10。

## §七 事故与教训

写作要点（占位）：F1-F6 发现族（缺陷登记簿+改造候选池·F4 主解=预检上移死得早死得响死在正确阶段）；三层教训 G1-G3 已转正（7da350710）；段 3 实弹读数增补窗（裁决 D·首拍后方案稿增补）。

## §八 心智模型总结与接手任务清单

写作要点（占位）：核心心智一句话=「bash 只干第 1 格，十格各归其位」；读码顺序（协议 §8.1→映射卷→集成案→plan_scope→dce_steps→verify→close_cli→notify_done）；自测命令族（pytest runtime/cognition/test_tenstage_pipeline.py 等）；周日首拍观察点（run id 贯穿/三态判定/升级条目五字段）；常见误区对照表。

---

## 今日施工账（节律对表）

- 10:30-12:00 段：大纲版落卷毕（本件）——逐段骨架+素材锚清单全落，主力段零预写（占位纪律·候深读后填）。
- 13:00-18:00 段：逐段深读+正文填充（§四十段为主·§三集成案次之）——每段实读代码后填，写不出=读不够，回代码再读。
- 18:00 前：深读发现汇总两栏（栏一仓内文档面今日可动/栏二生产触点面挂周日树零动）。
- 零生产触铁律：本文档线只读代码+写 workbench 稿，payload/现役判据/jobs.json/daemon 零触。

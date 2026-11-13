# FSD G2 段施工毕报 · 六件 CLI 骨架落仓落绿（FADE-001 十阶段实现面·今晚树）

- seat: FSD（小全·m-fsd）
- 令源: COO 拆树任务书 dispatch-plan-coo-20261113.md（§一 CTO/FSD 份额=技术方案主笔+实现·§三 G2 段=plan skill 方案+实现·门=预演形最小判据落卷即验）+CEO 17:26 大会组织令+COS 裁决 A/B
- 施工锚: TriCompany dev **6992f64**（12 件·2264 行·sg 通道 ls-remote 验真顶✓·github 通道攒批候收口窗）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

## §一 实现方案

六件 CLI 骨架（段 3/5/6/8/9/10 预演形·stdlib only·退出码 0/2 与 preflight/qualify 同族·每段产物 JSON 落 run dir=PM §二文件族）：

| 段 | 模块（正名） | 产物 | 三分类/断言核心 |
|---|---|---|---|
| 3 | plan_scope.py | plan.json | migrate/keep/carry_over 三分类（degrade 链 tree-op status→authorization expiry→默认 keep）+双向枚举断言 M∪K∪C=S∧两两交=∅+替身禁令三向+周目录年段名 `2026-W46` 实锚解析 |
| 5 | verify.py | verify.json | γ 归位（start_date isocalendar==to_week）+plan 基准毒化拦（counts=实长复验）+新周 index active 断言+`--strict` 生产形对表开关（首拍实走路径） |
| 6 | score_cli.py | score.json | **三态路径分立**：executed_ok/executed_failed（非缺席·COS 非阻塞面）/engine_absent（J7 升级面仅此路径）——CTO 精化一机械落地 |
| 8 | close_skill.py | close.json | **upgrade_list_state 显式二值**（extracted/not_extracted·结构门拦 None/空/别词）+notify_target=COS 单址+run_state 同卷（PM §二契约）+段产物 fail 提取升级条目（score engine_absent→J7 前缀）——CTO 精化二机械落地 |
| 9 | close_cli.py | manifest.json | run 终态三态 ok/failed/stale（缺件/不可读=stale·有 fail=failed·全 pass=ok）+六段 verdict 索引挂 run id |
| 10 | notify_done.py | notify_done.json | 结论路由三态（ok=结论通知/failed=失败告警/stale=悬空报告）+**告警文案必带 run id**（subject 嵌+context_id=run id 主键·PM §六契约案断言）——复用 notify.py `send_notification` best-effort 契约永不拦链 |

段 3/5/6/8/9/10 覆盖=实现面六段骨架齐；段 4（DCE=payload bash 段序编排面）与段 7（score skill 考卷面·候件⑥改卷制窗）候下批/部署树——如实挂账不硬凑（charter §二.4）。

## §二 代码变更

- TriCompany 仓新增 12 件（`runtime/cognition/`）：六 CLI+六 test_*.py·零改既有件（preflight/qualify/notify/weekly_plane* 全零触——今晚树铁律 vB 保持）。
- 命名契约对表（pm-tenstage-naming-contract §二/§四/§六/§七）：产物文件名族全对表；plan_scope 正名（§七 CTO 裁①）遵行；**§四妆容劫持防族规修正三处**——plan_scope.index_drift/verify.check_new_week_index/verify.check_migrate_against_index 原稿 `ops[-1]` 字典序取最新全改 **mtime 序**（`max(key=st_mtime)`）+陷阱案常备（字典序大 mtime 旧 broken 文件不劫持读数·负路径断言）。

## §三 自测结果

- **仓内 75/75 全绿**（`python -m unittest runtime.cognition.test_plan_scope runtime.cognition.test_verify runtime.cognition.test_score_cli runtime.cognition.test_close_skill runtime.cognition.test_close_cli runtime.cognition.test_notify_done`·显式模块指定形=STE 锚族原则 5 正形声明）。
- **389 门全量回归**：`discover -p "*_validation.py"`=**438 案·failures=5·skipped=1——与 pre-施工基线逐案同名零漂移零新引入**（既有五案：frontmatter parity/lg024/lg025/seats pipeline 两案——source-agents/发布面契约演进 vs 测试期望滞后族·候对表窗非本席域）。
- **plan_scope 实弹预演**（W46 实盘·`--start-date 2026-11-16`）：verdict=pass·migrate=2（fade001-phase1-build+mount-gate-build·authorization_active_or_unparsable 保守判——两树真在途）·keep=26（含散文件+日志族树）·carry_over=2（CARRY-20260728-004/006→frozen·与实盘 §1 现役区 grep 对表一致）·other_unresolved=15·bidirectional_ok=true。
- 沙箱迭代三轮实锚：①argparse.Namespace 形修（5 errors 同根）②unresolved=None 防御（NOT_FOUND 替身禁令案暴露）③**年段名实锚**（实弹第一跑全空清单→实盘周目录=`2026-W46` 带年段形→_resolve_week_dir 年段推算+glob fallback+多命中 fail-closed·第二跑 pass）。

## §四 技术债务标记

1. **段 4 DCE/段 7 score skill 未在本批**（如实挂账·非隐瞒）：段 4=payload bash 段序编排面候部署树（零生产触铁律）；段 7=考卷面候件⑥改卷制窗。
2. **close_skill scan_stage_artifacts 五段固定清单**（preflight/qualify/plan/verify/score）未含段 10 产物自身——close 段时点语义自洽（close 在 notify_done 前）·生产形扩 manifest 消费面候窗。
3. **verify --strict 对表域字段名**（doneTreesFromPreviousWeek/activeTrees 并集）以现役 migrate_weekly_plane 实装为准——骨架面已按白盒读数（weekly_plane.py L231-311）立形·首拍实走前候 CTO 对表复核。
4. **github push 通道断**（443 连不上·已知家族）——sg 通道已验真；github 攒批候收口窗补推。
5. plan_scope 散文件全 keep 判据=词面启发（无机械标记可判在途散文件）——verify 对表+候审三兜底在卷（技术协作稿 §二.8④·如实注记）。

## §五 段门自判（裁决 B 判据对表）

- G2 段门=「plan skill 预演形最小判据落卷即验」：plan_scope 落仓落绿+实弹 r2 pass+plan.json schema 断言面（结构门）+双向枚举+替身禁令——**判据面全过**。
- 本毕报=G2 段毕报（候 COO 段门验收）+六件骨架一并呈（G3 阶段 5/6/8/9/10 段骨架提前备毕——段间调紧令下候 G3 门即开不空转）。

## §六 使用依据

- COO 拆树任务书 dispatch-plan-coo-20261113.md（§一/§二/§三）+PM 定名契约卷 pm-tenstage-naming-contract-20261113.md（§一/§二/§四/§六/§七五节对表）
- CTO 三裁（裁① plan_scope 形/裁② 精化一精化二/裁决④）+COS 裁决 A/B+本席技术协作稿三件（7c21224b9/17c81720d/c5f951f4f·G1 合成卷 42d19aca2 在卷）
- 语义锚档面正身（PM §五直引钉子）：36bf14a1d 合成卷 L44「这是一周的记录，还是这一周的活」+STE 锚草案 d14f3f527
- 施工真源：TriCompany dev 6992f64（12 件）·pre/post 389 门基线对表读数（.fade/fsd-drafts/gate389-baseline.log/gate389-post.json.log 留档）

—— FSD 小全（m-fsd·G2 段施工毕报·写前现查 2026-11-13T11:07:28Z=19:07:28+08）·候 COO 段门验收·G3 门候令

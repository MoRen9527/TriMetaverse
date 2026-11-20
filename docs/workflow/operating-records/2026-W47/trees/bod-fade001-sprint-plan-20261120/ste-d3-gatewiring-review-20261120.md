# STE 收稿 review·D3 进化判据接线（TC 9b96ea3·层 2 COS 判决门+层 3 生产探针·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·STE review 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- review 对象: TriCompany dev **9b96ea3**（a0b5915..9b96ea3·5 create +719/-0·sg-server/dev 顶 ls-remote 承录）——cos_decision_gate.py(192)+cos_decision_probe.py(70)+gate_probe_production.py(110)+test_cos_decision_gate.py(218)+test_gate_probe_production.py(129)
- 勘验位: 本机 TriCompany 检出 c7ca148 分叉面**零触**——临时 detached worktree @9b96ea3（毕后 remove·零残留）

## §一 · 独立复跑读数（四门全项·实跑非转抄）

| 门 | 读数 | 判 |
|---|---|---|
| 新 28 案（14+14） | **28/28 OK 真rc=0**（仓根 `python -m unittest`·FSD 同跑法） | ✓ |
| 全树基线对表 | a0b5915 纯检出 **385 tests·3f+9e** vs 9b96ea3 含新件 **413 tests（+28）·3f+9e**——**12 红面 FAIL-SETS-IDENTICAL 逐案 diff 零差**（零新增红零消失红） | ✓ |
| 骨架树全绿 | TMV drafts cognition 面 **163 全绿 rc=0**（=D2 现役 146+D3 镜像 14+集成锚 3·+17 对表吻合） | ✓ |
| preflight 2 errors 预存 | RunPreflightExitCodesTest 两案在**纯检出 a0b5915 同报 2 errors**（基线预存集内·非本笔引入） | ✓ |

- 12 红归因抽验：SpawnGlmEnvTest 7 errors+PatchRunnerEndToEnd 1 error 2 fail+CliAdoptEndToEnd 1 fail（GLM env/settings+本机环境面）——与 FSD 毕报族归因总 12 对表吻合（族内一案摆位差：FSD「PatchRunner 1+convene_auto 3」vs 实测 PatchRunner 3 红+CliAdopt 1 红——总数与逐案集全等·族标签口径差非矛盾·如实注）。
- preflight fixture 归因抽验：`AttributeError: 'Namespace' object has no attribute 'prev_runs_root'`（run_preflight L464 消费面已落·make_args fixture 未跟·**基线预存实证**）——FSD 归因吻合，同意候 CTO 勘定窗（非本笔域零回卷）。

## §二 · 重点勘位①：preflight.py 现役件零触碰断言（独立复核成立）

- `git diff --name-status a0b5915 9b96ea3`＝**5 行全 A（create）·零 M 零 D**；
- preflight.py/test_preflight.py/weekly_plane_shift.py 三现役件 diff **0 行**；
- 全树红面逐案全等（12 集含 preflight 2 errors 基线预存）——「独立新件零集成·sg 现役周迁移链零行为变」主张**独立实证成立**（非转抄）。

## §三 · 重点勘位②：check_ceo_ruling 同构对表（逐面核）

| 同构面 | 基准（a0b5915 preflight.py） | 新件（cos_decision_gate.py） | 判 |
|---|---|---|---|
| 72h 阈值单值源 | L244 `_ESCALATE_AFTER_H = 72` | `from runtime.cognition.preflight import _ESCALATE_AFTER_H`（import 承·零复制） | ✓ |
| F2 空壳排除 | pf `st_size > 0`（ns4 首拍实锚注） | 同判据同构承 | ✓ |
| F3 完整轮 | `close.json` 在（ns4 第二拍实锚·残拍排除） | 同判据同构承 | ✓ |
| prev 时点基准 | pf mtime 排序（目录 mtime 不作基准注） | `candidates.sort()` 同构 | ✓ |
| 本轮自然排除 | 本轮 run_dir 零 pf 产物 | 同构 | ✓ |
| 72h 催办 | `_notify_blocking`+`TRICO_RULING_ESCALATE_TO`+never-raises except→`escalate_path_failed` | `_escalate_notify` 同形（failures 列表入 `escalate_notify_failures`·except 同形） | ✓ |
| 保守拦 | 坏卷/坏值→awaiting-ruling | 坏卷/坏值/键缺→awaiting-decision | ✓ |
| **有意差异面**（零漂移·毕报已注） | ceo-ruling.json/continue\|terminate/awaiting-ruling | cos-score.json/evolve\|hold/awaiting-decision+权属分立（hold≠job 停用） | ✓ 自语义面 |

## §四 · 重点勘位③：AND 投影合成规则判读（候 CTO 终审面·STE 意见）

施工形（判止>挂起>skip 中性>放行）与裁卷「AND 门并读」语义一致性判读：

1. **判止优先**（terminated/hold 任一→terminate）＝AND 下任一门否决即否决 ✓；**挂起次之**（awaiting-* 任一→absent）＝fail-closed「无裁决不进下轮」双向承 ✓；
2. **双 skip→absent**＝校准①映射承+首轮面=开轮令域注如实 ✓；
3. **skip 中性门+他门有效态→他门决定**＝可选 gate 向后兼容语义（与基准 skip 注 ok=True 同款）✓；
4. **continue∧evolve→continue**＝AND 正身 ✓；unknown 态/双门崩/import 缺→**全 absent 保守**（零放行默认）✓；
5. 层 3 自身零独立 72h 计时器+等待超时候升级=生产并发编排候窗（毕报 §五③如实注）——骨架同步形零阻，**承录不阻收**。

**STE 判读：合成规则与裁卷 AND 语义一致+保守方向全对（崩/缺/未知全不放行）——review 无异议，候 CTO 终审可准**（若裁变=投影段单点改·映射族 10 案白盒随勘·改动面可控）。

## §五 · 重点勘位④：cos-score.json 键名判读（候 CTO 终审面·STE 意见）

- 五键（eviction_decision/rationale/joint_review_avg_score/fade001_internal_score/decided_at）对 §一C 语义「eviction_decision+rationale+双分数引用」全谱 ✓；
- **跨域零冲突**：skill 卷（score_skill.json）白名单 ALLOWED 十键（average_score 等）与 cos-score.json 五键分域文件分键名——D2 双分数分立面不受扰（BANNED 历史禁键 cos_score/seven_seat_average 在 skill 卷零混挂面不变）；
- **消费弹性面**：check_cos_decision 只 .get 消费五键（皆容缺）——cos-score.json 落卷形（D4 COS 域产出件）其余键零依赖=向后兼容 ✓；
- **STE 判读：键名施工选定形无异议，候 CTO 终审**——落卷形（D4）与读卷形（本件）两域对表锚候 D4 窗实件核（骨架窗零实落卷件·如实注）。

## §六 · 微观察项（非阻塞·如实档）

1. `test_latest_prev_run_selected`/`test_current_run_dir_naturally_excluded` 依赖 `time.sleep(0.05)` mtime 分辨率——现代 FS ns/µs 精度下稳，粗粒度 FS 理论同 mtime 面（测试面非生产语义·观察注）；
2. `RUNS_ROOT_DEFAULT="/var/lib/trirmc/cron/runs"`=Linux 生产面缺省——TC 本机 Windows 直跑探针面落 skip（零真读）·测试全注入形零依赖 ✓ 非问题；
3. 双门 prev 各自独立解析（竞态窗=探测中 close 落卷极窄+保守方向任一挂起→absent）——观察注；
4. 施工中红即停自纠一笔（首形 awaiting/skip 同分支单门挂起误放行→拆分后 14/14）——**FSD 自纠实证与白盒 10 案映射族吻合**（挂起族/中性族拆分案齐）——红即停纪律正形留痕 ✓。

## §七 · 收稿结论

**收稿通过·review 无阻塞项**——层 2 四态+72h 单值源+F2/F3 同构+never-raises 全谱成立；层 3 AND 投影 fail-closed 双保险+审计 stderr 面成立；preflight 现役件零触碰独立实证；全树零新增红逐案全等；28 新案+163 骨架树全绿独立复跑同值。候裁面两件（AND 合成规则+键名）STE 无异议随卷呈 CTO 终审；preflight fixture 2 errors 债面独立复核归因实证·候 CTO 勘定窗。

## 使用依据

- FSD 毕报 fsd-d3-gate-wiring-closeout-20261120.md（f6413ea03）+交付锚 TC 9b96ea3（sg-server fetch 直读五件全文）
- cto-gate-interface-ruling-20261120（§二三层结构+校准五件·对表基准）+cto-round-programming-design-20261119 §一C（语义源）
- 仿形基准实读：a0b5915 preflight.py check_ceo_ruling 段（L244/L316-340·F2/F3 ns4 实锚注在链）
- 独立复跑 log：/tmp/d3-new-suite.log（28 OK）+/tmp/d3-full-9b96ea3.log（413·3f+9e）+/tmp/d3-full-a0b5915.log（385·3f+9e·FAIL-SETS-IDENTICAL diff 零差）+/tmp/d3-skeleton-full.log（163 OK）
- D2 两令 review 先例（967476225/b59de0eda·收稿 review 同构形）+D-46/D-47+零转抄独立复跑纪律

—— STE 小柯（m-ste·D3 收稿 review 窗·今晚轻量）·写前现查 〔commit 时戳锚·D-47 正形〕

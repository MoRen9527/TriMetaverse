# FSD 毕报·D7 接线段节 4——chain_runner 十段链段序驱动器+spawn 七席通道接装毕（50 案全绿·施工锚 cddfac2·2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T20:57:42Z（date 现查粘贴·+8=04:57:42·D-47 正形·双值并查新模板）
- 令面: COO 节 4 执行释放令（APPROVE 开工即行·spawn 七席+点火 IO+毕报·D7 复跑执行节正式开跑·935 止损线在役·首发红即停）
- 施工面: TriRMC worktree trmc-d7-wt-20261120·8885bbe 之上·src/fade001/chain_runner.ts 新建（~200 行）+test 白盒 13 案新增——**施工锚=cddfac2**（sg bare push 验真 ✓ 8885bbe..cddfac2 fast-forward·ssh 直读 bare dev 顶=cddfac2 双证·github 欠账族维持）
- **next_agent=COO**（毕报收+CTO 终审随卷请·745 先例形）

## 一·交付物正形（节 4 令面三件对表）

1. **spawn 七席通道接装**: chain_runner STAGES 段 7=score_skill_spawn.py **现役正形子进程调**（dsh headless CLI·7 席 spawn·score_skill_spawn.py _spawn_seat 先例承）——零另铸替身零复刻 spawn 内部判读（D-27 spawn 形定谳承录）；
2. **点火 IO 面**: round_runner（节 3 已铸形·8885bbe）`chainRunner: ChainRunner` 注入位=本件 `makeChainRunner()` 实现形——runner 引擎与链驱动两件分离·白盒注入换件面（D1 §三 IO 面承录形）；
3. **十段链段序驱动器**: STAGES 十段表（段名/CLI/产物/argv 白名单）+段 N+1 前置断言=段 N 落卷真值（硬串行禁跳段·D1 §四装配正形照铸）+rc_guard fail-closed+aggregate 白名单投影+resume 轮间真值断言。

## 二·STAGES 段序表（argv=各段 argparse 必载面·2026-11-21 TC 现役勘定）

| 段 | CLI | 产物 | 落卷形 | 特记 |
|---|---|---|---|---|
| 1 | preflight.py | preflight.json | stdout 重定向 | --from/--to/--start-date |
| 2 | qualify.py | qualify.json | stdout 重定向 | --run-dir |
| 3 | plan_scope.py | plan.json | 自落卷 | --run-dir/--run-id |
| 4 | dce_steps.py | dce.json | 自落卷 | --tmv-root/--plan-file；rc=3=halt_pending_ruling 候裁态关键词投影 |
| 5 | verify.py | verify.json | 自落卷 | --plan-file（段 3 交棒锚） |
| 6 | score_cli.py | score.json | 自落卷 | ScoreCLI 机械面 |
| 7 | score_skill_spawn.py | score-skill.json | 自落卷 | **spawn 七席段**（--spawn-timeout 缺省 900s 对表段超时） |
| 8 | close_skill.py | close.json | 自落卷 | verdict pass/fail 门面 |
| 9 | close_cli.py | manifest.json | 自落卷 | run 终态 ok/failed/stale |
| 10 | notify_done.py | notify_done.json | 自落卷 | 结论路由 |

- **payload vB→十阶段形 PATCH 如实注**: 本树零调用实勘（find 零命中 2026-11-21）=周日首拍前置授权窗候铸——**段序驱动承载位=TS chainRunner（本件）选定形候 CTO 终审注**（gate CLI 子进程先例形·preflight §一承）——CLI 本体零触零改零替身段。

## 三·verdict 投影面（三层判据族分野恪守）

- **真值源=cos-score.json**（D4 §一轮毕意见窗产物）——`joint_review_avg_score` 数值面：≥95（含边界）→verdict=loop_exit（EXIT2 sanctioned·唯一程序自动边）／<95→continue；
- **eviction_decision（evolve|hold 二值·cos_decision_gate.py L10/L62 现役勘定）零消费**=层 2 门域（gate 件/preflight 轮间门消费·runner 零复刻 gate 判读——三层分野同 round_runner 形）；
- cos-score 缺（首轮·意见窗未开）→manifest run_state=ok→continue（轮毕候意见窗正形）/failed|stale→ok=false+err（款三 fail-closed）；
- **对表项兑现**（COO 令③观察注）: 终态读数承载位=RunResult{ok, run_dir, aggregate{average, verdict}}+loop 引擎 final_state 双面——呈报载荷投影位=round_runner exit detail 白名单形（节 3 已铸·本件 aggregate 喂入衔接毕）。

## 四·白盒 13 案（全案 50=节 2b 24+节 3 13+节 4 13）

| 案 | 承载断言面 |
|---|---|
| CS-1 | 十段硬串行全跑序（stagesRun=段表序·manifest ok→continue·redirect 产物在） |
| CS-2 | 前置断言败停段（段 3 零落卷→段 4 断言败 fail-closed·零续跑） |
| CS-3 | redirect 族落卷=stdout 原文（win CRLF 平台行为如实档·行尾归一比对） |
| CS-4 | rc=2 fail 投影（段名+rc+stderr 尾入 err·零续段） |
| CS-5 | dce rc=3=halt_pending_ruling 候裁态投影（关键词入 err 裁决面可判读） |
| CS-6 | 95 线程序边含边界（avg=95→loop_exit/94→continue·cos-score 真值源+average 值面） |
| CS-7 | manifest 缺→段 10 起跑前置断言拦（投影双缺分支=不可达防御面如实注） |
| CS-8 | manifest run_state 非 ok→ok=false err 投影 |
| CS-9/9b | resume 面：resumeStage=7→段 1-6 真值断言+段 7 起五段跑序／段 5 产物缺→fail 零静默跳段 |
| CS-10/11 | CLI 缺 fail-closed／runDir 缺零起跑 |
| CS-12 | 段序表值面（十段名+产物名序+spawn 段=score_skill 接装面锚） |

- **施工纪律恪守**: 白盒一律 stub python 形——零真实 CLI 零真实 7 席 spawn 零真实迁移（GLM 轨单跑·D2 令 2 风险面承）——真实联审跑候接线窗值席面。

## 五·自测读数（full-regression 四件形）

1. `tsx --test test/fade001/chain_runner.test.ts` → **tests 13 / pass 13 / fail 0**（3.7s）；
2. **全套回归**: round_runner 37+chain_runner 13 → **tests 50 / pass 50 / fail 0 / cancelled 0**（12 suites）；
3. **定向 tsc strict**: src 两件+test 一件 → **rc=0 零红**（借道 typeRoots 同节 2b/3 形·worktree TS2688 环境面如实档维持）；
4. 既有失败族归因: 零既有红面（本两件全绿·无转抄项）。

## 六·过程红 5 笔如实档（全测试面·本体零回改）

1. makeEnv 零 mkdir runDir→预置写卷案 ENOENT 族（CS-6/9/9b）→修=makeEnv 内 recursive mkdir；
2. CS-10 双 tmp 根混用（makeEnv 根+stubAll 根错位）→修=单 stub 根贯通；
3. CS-7 案意图错位（manifest 缺=段 10 前置断言先拦·投影双缺分支链内不可达=防御面）→案改形+卷面如实注；
4. 绿基线 stub body 零 run_state 键→投影 schema 面 fail-closed 正确拦（**行为面旁证**：投影对卷 schema 严格）→修=close 段 body 对表 run_state=ok；
5. CS-3 win python stdout 文本模式 \n→\r\n（平台行为）→断言行尾归一+如实档。

## 七·红面与异常档

- 红面: **无**（50/50 全绿收口·935 止损线零触发·首发红即停条款于首跑 6 绿 7 红时点适用=定性读数补全后测试面自纠·零本体硬试）；
- 异常档一件: github 通道断窗持续——显式 sg URL push 双证验真照役（8885bbe..cddfac2+ssh 直读 bare 顶双证）·欠账族两仓并档维持。

## 八·后续链承录

- **节 4 收口=施工锚 cddfac2**——毕报落树达 COO→CTO 终审随卷请（745 先例形）——终审随卷请裁点: ①段序驱动承载位=TS chainRunner 选定形②eviction_decision 零消费（层 2 门域分野）③projection 双缺分支防御面定性；
- **真发活体段**（spawn 七席真跑+ns9 起跑执行毕报+首轮毕知情停点呈报 BOD 链）=候令形零抢跑（值席面真跑·GLM 读数对表·935 止损线盯守）；
- 双事件 AND 门候变更令挂账不变·GLM 凌晨窗轻量步进恪守（本节纯本机白盒零外呼零 daemon 触）。

## 九·使用依据

COO 节 4 执行释放令（spawn 七席+点火 IO+毕报）+D1 卷 §四装配正形+§六A resume 面+勘面卷 cto-d6d7 §三.4+preflight 卷节 4 分节+TC 现役 CLI 十件 argparse 面实勘（2026-11-21·preflight L515-536/qualify L225-233/plan_scope L1377-1384/dce L228-251/verify L269-273/score_cli L92-95/score_skill_spawn L130-133/close_skill L259-262/close_cli L135-138/notify_done L103-108）+cos_decision_gate.py L10/L62（eviction_decision 二值域勘定）+D4 卷 §一（cos-score 落卷位/原子写/防重）+§二（意见窗轮毕触发位）+score_skill_spawn.py 现役形（spawn 先例承）。

---
落卷=FSD 小全（m-fsd）·节 4 毕（04:57+8）·**next_agent=COO**（收报+CTO 终审随卷请）·施工锚 cddfac2 sg bare 在链双证·50/50 全绿+strict 零红·真发活体段候令形零抢跑·GLM 止损线在役

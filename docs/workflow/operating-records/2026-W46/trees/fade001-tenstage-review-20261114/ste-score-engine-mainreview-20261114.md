# STE 主审卷 · score_engine 测试面（CEO 11:45:54 直令链·CTO 主审知会 11:52 承接）

- **seat**：STE（小柯·m-ste）·测试面主审席（CTO 派工知会·施工=m-fsd 四笔）
- **任务链**：CEO 预演升级主令——score 引擎实弹今夜装配（engine_absent 预期态废止·原 J5-J7 灰度窗前拉）→ FSD 四笔施工（score_engine.py 新建/score_rubric 公开别名/test_score_cli 连带案修/test_score_engine 新建）→ 本席主审（判据面/边界条件/值面）→ CTO 终验收+装配窗
- **时间盒**：FSD 毕报候今晚 20:00 前 → 本席主审读数今晚随到随出 → 明 11-15 10:00 前全就绪
- **边界遵行**：零装配动作（R-HY 装配=生产触候授权件·本席全程源码/测试/卷面三域·零 daemon 零 jobs.json 零 payload 触）
- **裁词四条内化**（CTO 供参考遵行）：判卷正身=engine 消费 run_dir 段产物+考卷运行时读（零复制族文案）；机判/manual 两分如实标注（禁混写）；门不豁免（零豁免开关·预演时段窗红=读数保真）；engine 不外抛破链（降级族判定+reasons 载缺件）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

## §一 · 主审基座侦察（候审期实勘·现役三文件锚点）

| 面 | 现役形（侦察读数） | 主审锚点 |
|---|---|---|
| score_cli.py（117 行） | `probe_score_engine()` import `runtime.cognition.score_engine`→三态（present/engine_absent/engine_broken_import）；`run_score` 三态分立+契约面 L56-61 | **engine 入口契约硬锚**：`run_score(run_id=, run_dir=, from_week=, to_week=)` 全 kw 四参→返回 dict（非 dict=契约违规 executed_failed L63-65）——FSD 新 engine 入口签名须逐字对表 |
| score.json 字段族 | score_version/run_id/from_week/to_week/engine_state/check_time+score（ok 态）/verdict/reasons（败态） | 值面字段非仅存在性——主审逐字段值读（禁键存在性抽验） |
| test_score_cli.py（5 案） | absent_j7/ok/failed/non_dict/main 落卷——**案 5 `test_main_writes_score_json_engine_absent` 依赖「沙箱无 score_engine」前提** | **连带案修必然面**：engine 新建后案 5 前提崩塌（import 成功→executed 路径→absent 断言必红）——案修正形须保 absent 路径案（mock probe 形·J7 升级面路由判据防回退不能丢）+present 态全链补案 |
| rubric-firstshoot.json（八族） | weight A10/B10/C15/D10/E10/F15/G20/H10=100·_REDLINE_CAPS={C:79,G:59}·F2_ZERO_TRIGGER_FULL_SCORE=True·verdict_rule 首拍断言形 | engine 判卷消费考卷=运行时读本件（零复制族文案遵行）·预演线 B/H 如实记录形覆盖判纪律在卷（582 笔） |

## §二 · 主审判据框架（七族案型逐条·候毕报到逐条对照）

| # | 案型（CTO 清单） | 主审判据 | 判 |
|---|---|---|---|
| 1 | 逐族判据案 | 八族 verdict_rule 逐族实装对表（A 冻结基准/B 窗断言两线分形/C run id 三处同串+正则/D preflight 四断言/E qualify 五断言/F 告警时延+免评母/G 全链齐性/H 值守窗）——读数点与采集卷 §二 一致 | 候填 |
| 2 | 红灯 cap 两案 | C 族 score=79 → capped（非 80 直通）·G 族 score=59 → capped——`_REDLINE_CAPS` 消费值面对表 | 候填 |
| 3 | F2 免评案 | F2 零触发触发器→F 族满分（F2_ZERO_TRIGGER_FULL_SCORE=True 消费）·F2 触发态对照案 | 候填 |
| 4 | T1 三断言案 | run id 三处同串+正则匹配（a2c246908 定谳原样·T1-2 D+E 口径） | 候填 |
| 5 | 空 run_dir 降级案 | 段产物缺席→降级判定+reasons 载缺件（缺什么写什么·值面非仅布尔）+rc 面不外抛破链 | 候填 |
| 6 | 坏 json 降级案 | 段产物解析败→降级+reasons（解析错误名+文件名值面）·防 crash 外抛 | 候填 |
| 7 | rubric 缺席降级案 | 考卷缺席→降级+reasons+rc 面（缺席≠跑败·级别分立对表 CTO 裁词） | 候填 |
| 8 | CLI 真链集成案 | score_cli→真 engine（非 mock）全链：run_dir 段产物齐→executed_ok→score.json 值面落卷——mock 层（既有 5 案）与真链层（新案）两分如实标注 | 候填 |

## §三 · 门禁读数（独立复验承诺·FSD 毕报禁转抄）

- 仓内全量：候读（基线=144·FSD 四笔后=157+新增——**基线读数独立重跑**·双 pattern 形+log 落盘）
- validation 族：候读（基线=438 案 failures=5 skipped=1·五案名 frontmatter parity/lg024 test_6/lg025 test_1/seats pipeline 双案族——逐案对表零新引入）

## §四 · 主审读数（候 FSD 毕报填·零预写）

（候填——FSD 毕报到后逐条填·读数证据落盘 `.fade/ste-review-20261114/`）

## §五 · 缺陷清单（两栏分拣·候填）

（候填——发现如实挂账零遮掩·阻塞/非阻塞分类）

## §六 · 门禁判定（三分法·候 CTO 确认链）

（候填——PASS/CONDITIONAL_PASS/FAIL·本席不独立放行）

## §七 · 使用依据

- CEO 11:45:54 直令链+CTO 主审知会（11:52 承接·D-15 回执 c8e438dc）
- 现役基座：score_cli.py 117 行/test_score_cli.py 5 案/rubric-firstshoot.json 82 行（本卷 §一 侦察读数）
- 判据真源：采集卷 §二八族表（8a269e0fa+a5ec899db+db439f2cf）/T1 定谳 a2c246908/裁决 C 权重（42d19aca2）/两线消费纪律（582 笔 2d02e4a38）
- 本席既有卷：review 日主卷 08022f082 系（score_cli 三态+段 6 候实弹注记与本次废止令衔接）

—— STE 小柯（m-ste·测试面主审席）·写前现查 〔commit 时戳锚·D-47 增补款正形〕

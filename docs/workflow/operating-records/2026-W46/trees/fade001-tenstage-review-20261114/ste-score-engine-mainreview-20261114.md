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

## §四 · 主审读数（四笔实勘毕·2026-11-14 14:2x 段·非候毕报——四笔+registry 毕形已在链 12:08-12:15·CTO 验收 PASS 04:14:53Z 在 registry 回写 ddda8dcd）

- **四笔实勘**（diff 全读）：2905840 engine 361 行（契约/机判 manual 两分/归一化/保险丝 cap/链序裁决锚全在卷）+6171d3d 别名 +3 行（零删私有名·is 身份案钉）+18dca2e cli 案修 43 行（absent 案 mock 显式构造 ImportError 分支覆盖+真 engine 集成案 skipUnless 落仓自动激活·两层 verdict 分明断言）+004695b test 375 行 18 案。
- **18 案机械清点**=5（JudgePerFamily）+4（RedlineCap）+1（F2Manual）+3（T1）+3（Degradation）+1（GbkSafe）+1（NoHardcode）=18 与笔文一致；`def test_` grep 真值=18 双域一致。
- **判据框架八案型逐案对表**（§二逐条判）：逐族案 B 三断言形（窗内 pass/预演白天拍如实出红+reasons 载「预演」/正则破 fail）✓；红灯 cap：C79 用 mock 权重放大构造触发（真权重 C 红天花板 50/65=76.9<79 触发不到）+真权重边界另案 assertAlmostEqual(76.9)+caps_applied=[] 如实钉「cap 形备未触发非缺陷」+G59 真权重直触发（45/65=69.2→压 59.0）✓✓——**数学独立重算四点全过**（84.2→79.0/76.9/69.2→59.0/全绿 100.0/空 run_dir B 独立 10/65=15.4）；F2 案=F 族 manual score=null+collection_cmd 锚随行（F2 免评本体=考卷 special_clause 承载·engine 零改写=案面合理）✓；T1 三断言案全链面 ✓；降级三案（空 run_dir 结构化缺件/坏 json 坏卷载明/rubric 缺席全族 fail+rubric_loaded=False）✓；GBK payload 防回归三+1 场景全 encode("gbk") 不炸（实测坑钉·∈/∉ 禁入字符面）✓；REDLINE_CAPS `assertIs` 身份断言+值面 {C:79,G:59} 双层 ✓。
- **门禁读数（独立重跑·禁转抄）**：cognition 全量两轮——v3 176 OK（14:11:37 log mtime=ddda8dcd 面·落链前 11 秒）+v4 **181 OK 全绿**（14:1x·b350f9c 面真值=176+verify 增补五案精确自洽）——log 落盘 `.fade/ste-review-20261114/ste-cognition-gate-v3/v4-20261114.log`；validation 族 **438 案 failures=5 skipped=1 五案名与基线逐一同名零漂移**（ste-gate389-v3 log）。
- **读数差定谳（CTO 14:23 回执归因勘正·本席采认吸收）**：registry ddda8dcd 笔文「179全绿」vs 机械真值 176——**口径差非笔误**：179=全目录 smoke 口径（discover test_ 前缀 176+smoke_test.py 3 案=179·本席 grep 实锚 smoke_test.py=3 案验真·双真）——本席初勘「笔误」定性系 test_ 前缀 pathspec 单口径局限·勘误在案（CTO 验收卷 §九注记在卷闭合·registry 锚行已双口径并载）；FSD 337c546 笔文「176 全绿」=时点真值（176 案时代 test_ 前缀口径）自洽。案数声明家族定性维持（毕报用词不精确非数学错误）。

## §五 · 缺陷清单（两栏分拣·零阻塞·三条注记候 CTO 参考）

- **N1（非阻塞）**：engine run_dir=None 入口分支（L273→C/D/E/G 判据 AttributeError 降级）reasons=异常类名非缺件语义+测试零覆盖（GbkSafePayloadTest `rd or "D:/x"` 将 None 替换未真走 None 入口）——生产面不可达（CLI argparse 守+直跑探针 required）·纯防御分支·行为面 fail 正确不外抛。候裁：后补 None 入口案或 reasons 口径勘正。
- **N2（非阻塞·判读面知情项）**：真考卷权重下 C cap=79 为数学死保险丝（C 红天花板 76.9<79 恒不触发·测试已如实钉案）——值守判读表若引「C 红→79」语义需知情此边界；G cap=59 真权重有效（69.2>59 触发）。非缺陷（保险丝=上限防未来权重改语义）。
- **N3（非阻塞·观察项）**：E 五键（identity/run_dir/git_identity/alert_credentials/disk_free）双源机械对表案缺——test 消费 engine._QUALIFY_ASSERTION_KEYS 自构卷（engine 内自洽）·qualify.py 实装键漂移时 engine 不随=假红假绿风险——docstring L86 注「qualify.py L184-196 实锚」=人工锚非机械案——候选「双源对表断言」案型补位（本席 workbench 模式一适用场景）。
- 判据实装值对表正面确认：B 窗 23:50-23:59/C 正则 T1-1 原样/E 五键=与考卷定谳值一致（判据逻辑实装硬编码=机判必然形态·「零文案复制」承诺范围=族元数据文本运行时引用——manual reasons collection_cmd 原文引用在卷 ✓）。

## §六 · 门禁判定（三分法·候 CTO 确认链）

**CONDITIONAL_PASS**（候 CTO 确认）：契约面/裁词四条/归一化数学/cap 语义/链序裁决/降级面全对表零阻塞·18 案判据框架覆盖完整且数学边界如实钉·门禁 181 全绿+438 基线零漂移——CTO 已在 registry 回写验收 PASS（04:14:53Z），本席主审=独立复核读数供给面：**复核结论与 CTO 验收同向**，三条非阻塞注记（N1/N2/N3）供参考候裁量，零回退建议。

## §七 · 使用依据

- CEO 11:45:54 直令链+CTO 主审知会（11:52 承接·D-15 回执 c8e438dc）
- 现役基座：score_cli.py 117 行/test_score_cli.py 5 案/rubric-firstshoot.json 82 行（本卷 §一 侦察读数）
- 判据真源：采集卷 §二八族表（8a269e0fa+a5ec899db+db439f2cf）/T1 定谳 a2c246908/裁决 C 权重（42d19aca2）/两线消费纪律（582 笔 2d02e4a38）
- 本席既有卷：review 日主卷 08022f082 系（score_cli 三态+段 6 候实弹注记与本次废止令衔接）

—— STE 小柯（m-ste·测试面主审席）·写前现查 〔commit 时戳锚·D-47 增补款正形〕

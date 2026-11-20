# STE 收稿 review·D6 激活判据件（TC f5f664c·activation_gate 挡位边新铸+防死锁白名单机械面·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·STE review 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- review 对象: TriCompany dev **f5f664c**（b8218f8..f5f664c·2 create +420/-0·sg-server 顶验真承录·github 欠账族维持）——activation_gate.py(192)+test_activation_gate.py(228)
- 勘验位: 临时 detached worktree @f5f664c（毕后 remove 零残留·本机检出零触）

## §一 · 独立复跑读数（四门全项·实跑非转抄）

| 门 | 读数 | 判 |
|---|---|---|
| 新白盒 25 案 | **25/25 OK 真rc=0**（逐条判读 4+防死锁豁免钉 5+停点语义 3+放行令消费 3+宣告载荷 2+契约 4+never raises 2+零写面 2·案族清点对毕报构成式逐族吻合） | ✓ |
| 既有锚合并跑 | **102/102 OK**（新 25+close_cli 现役 11+D4 19+D5 19+D3 28——独立对数 66+11+25=102 ✓） | ✓ |
| 全树基线对表 | **476 tests·3f+9e**（451+25 数面自洽）——12 红面与 D5 基线（/tmp/d5-fails.txt）**diff 零差 FAIL-SETS-IDENTICAL**（零新增红零消失红·A2 判读基准同源成立） | ✓ |
| 骨架镜像双件 | **25/25 OK**（0.004s·gate 零 TC 依赖+test 只依赖 gate 单件——全镜像可跑通=D5 差异注独立验） | ✓ |

- 跑法注（诚实档）：全树对表=模块列表合并跑（29 个 test 模块 unittest 合并）非裸 `discover`——**裸 discover 对 TC runtime/（namespace 顶层·无 `__init__.py`·cognition 才是 regular 包）Ran 0 跳过整棵子树**（本窗实锚新知：unittest discover file-finder 不进 namespace 包·PEP420 导入面与 discover file-finder 面两分）——读数真值以模块列表合并跑为准（476·3f+9e 与 D5 log 形态同构）。

## §二 · 重点勘位①：铁律域零触碰独立断言（成立·非转抄）

- `git diff --name-status b8218f8 f5f664c`＝**两行全 A**（两新件·零 M 零 D）；
- 铁律域九件（close_cli/close_skill/test_close_cli/score_cli/score_engine+preflight/test_preflight/shift_notify/ceo_ruling_probe）diff **0 行**——「现役件零触碰+判读面零写面」双主张独立断言成立。

## §三 · 重点勘位②：零写面双断言独立验（成立）

1. **源码零文件 IO**：独立 grep（非转抄白盒 token 表）`open(|write_text|read_text|mkdir|os.replace|mkstemp|rglob`＝**0 命中**——源码唯一 import=json+argparse+`__future__`·纯函数实锚；
2. **tmp 前后零变化**：白盒 `test_no_filesystem_side_effect` 在合并跑 RC=0 内绿（四种调用形态前后 iterdir 全等断言）；
3. **第二方法交叉验证**：CLI 直跑探针（`python -m runtime.cognition.activation_gate --checks-json 'A3=false,first_round=true'`）＝**RC=0+gate=blocked+unmet 面正确**——fail-closed 方向活体实证（A3 未兑现→门闭零激活）。

## §四 · 重点勘位③：防死锁自指豁免=白名单机械面（成立·承载形候终审）

- 白盒五钉全绿（d6_done/activation_gate_done/d7_done/s5_window_done/bogus_key 五键 ValueError 拒）；
- 源码核：`_FORBIDDEN_TOKENS=("d6","d7","s5","activation_gate_done")`——白名单外键先查禁入 token（命中=专用错误消息）再通用白名单拒——**拒即显错非静默忽略·错误消息附白名单可诊断**——机械面零豁口正形；
- 零环独立核：合法白名单七键（A1-A4+三可选）逐键核禁入 token 零误伤；forbidden 子串匹配（k.lower() 含 d6/d7/s5）对白名单外普通键含子串被拒=保守方向可接受；
- **承载形=施工选定形注①候终审**（勘面卷 §二.2 只定豁免定谳未定机械承载形·毕报 §六.1 如实注）——STE 意见见 §八。

## §五 · 重点勘位④⑤：知情停点语义面+A3 单向引用（成立）

1. **停点语义**：first_round_complete=True→first_round_pending=stop（gate 仍 ready=挡位面与停点面分层正确）+authority_ref=None+note 含 CEO 候令面+brief 大白话拟稿四槽位（close_verdict/score_total/retry_count/exit_reading·零填=None）；round_reading 注入→槽位精确回填；无首轮→零停点面；
2. **放行令消费=令面非时面**：release_ref 在→released+ref 记录（放行一次非逐轮放行注在）；空串/空白→stop fail-closed；无 ref 而 release_ref 存在→零首轮零停点可解（ignored 案钉）；
3. **零 resume 分支零 runner 涉独立 grep**：源码 resume|runner 4 命中**全为 docstring 注记面**（D6/D7 分工如实注·消费位呈报链注）——零代码分支零 runner 逻辑=「执行面=D7 窗族随铸零夹带」主张独立实证；
4. **A3 单向引用零环**：A3 未兑现→blocked+detail 含「交点位」如实注（白盒钉）；D7 键出白名单拒（§四）=判据清单零反向依赖机械面——「D6=引用位读 D7 验证锚结论·单向引用非环」成立（采集位在调用面=件内零直接读 D7 产物·纯函数实锚）。

## §六 · fsd 红即停自纠定性独立勘（令面指定·成立）+镜像注定性独立勘（成立）

1. **红即停注**（毕报 §四.1：f-string 语法炸残留·smoke import 探针拦于首跑前·零白盒红）——**定性成立**：语法炸=施工笔误非接口语义问题；smoke import 探针=首跑前红即停先形（红面在 import 探针位·零白盒红如实注无夸大）·即停即纠零二次硬试留痕 ✓；
2. **镜像注定性**（本笔差异面 vs D5）：test import 链=gate 单件+stdlib 五件（inspect/json/tempfile/unittest/pathlib）——「双件全镜像可跑通」**注定性成立**（与 D5 差异注合理：D5 test 依赖 close_skill 现役件不可镜像·D6 双件全镜像 25/25 独立复跑同值实证）。

## §七 · 微观察项（非阻塞·如实档·零升审面）

1. **键为 `__str__` 炸对象**→str(key) 在契约段（try 外）raise RuntimeError 非 ValueError——契约面 fail-fast 域内（fail-fast 允许 raise）但异常类型语义面小口径·极奇异输入面（实际调用面=值席/runner 采集·键恒字串）——观察注；
2. **release_ref 非字串值=静默走 stop 分支**（毕报施工选定形注③已如实注）——fail-closed 方向安全（非字串不可能构成有效放行令·静默=保守停非误放行）；
3. **CLI stdout 中文 label 在 Windows console GBK 代码页显示乱码**（本窗探针实锚）——终端显示编码面非数据缺陷（ensure_ascii=False UTF-8 序列化正确·生产 Linux UTF-8 零扰·消费位=值席/runner 呈报链）——观察注；
4. **102 对数口径注**：令面引述构成式「66=D3 28+D4 19+D5 19+close_cli 11+新 25」为笔误——66 实际=D3+D4+D5 三件锚（勘面卷 §八原文「D3 28+D4 19+D5 19=66」）·毕报 §四.2 引用「=66 令面锚照承」正确——102=66+11+25 数面自洽非矛盾·如实档；
5. worktree 裸 `discover` namespace 顶层跳过面（§一跑法注）——D3/D4/D5 历史全树跑同为模块列表/等价形（log 形态 dots+Ran N 同构旁证）——方法论档非缺陷面。

## §八 · 施工选定形三注·STE 附意见（裁归 CTO 终审·零越席）

| 注 | STE 意见 |
|---|---|
| ①防死锁机械承载=白名单拒 ValueError（非静默忽略形） | 拒即显错+错误消息附白名单可诊断+白盒五钉互证=机械面零豁口正形——**无异议候准** |
| ②轮面可选键 schema 形（first_round_complete/release_ref/round_reading 三键名施工选定） | 键名与勘面卷 §三.4 first_round_pending 语义字段对称+release_ref=authority_ref 承 D1 §二 CEO 切换权同名面——**无异议候准** |
| ③release_ref 非字串值=静默走 stop 分支（非 ValueError——可选键宽契约形） | fail-closed 方向安全（误放行风险零·静默=保守停）；终审若裁硬拒 ValueError 形=单点改+白盒随勘（改动面极小）——**无异议候准** |

**差异面 vs 勘面卷定稿：未发现**（零写面/纯函数判读/停点语义/豁免机械面全谱对表吻合·D5 式降格差异零）——如实卷。

## §九 · 收稿结论

**收稿通过·review 无阻塞项**——挡位边纯函数判读（A1-A4 条目族+全兑现 ready+单条缺 fail-closed unmet 明细）+防死锁白名单机械面五钉+知情停点语义面（stop/released/fail-closed/槽位拟稿）+切换宣告载荷（知会非批门歧义消解承）+契约两分（ValueError fail-fast try 外+never raises try 内）+零写面双断言全谱成立；铁律域零触碰独立断言；四门读数独立复跑同值（25/25+102/102+476·3f+9e IDENTICAL+镜像 25/25）；CLI 直跑探针第二方法交叉验证；红即停自纠定性+镜像注定性两独立勘成立。三注候 CTO 终审（STE 三项无异议）；技术债维持（fixture 债/TMV github 欠账族/CLI console 编码显示面观察注）。

## 使用依据

- FSD 毕报 fsd-d6-activation-gate-closeout-20261120.md（TMV 5e233c3d1）+交付锚 TC f5f664c（sg-server fetch 两件全文直读）
- CTO 并勘卷 cto-d6d7-activation-ns9-survey-20261120.md（e88cbf86e·§一三层总纲+§二条目族/防死锁+§三停点机制+§四衔接定谳+§八白盒锚——件形照铸正身对表）
- D1 设计卷语义源（§二 flag CEO 权 fail-closed/§三知情停点四理由链承录）+D3/D4/D5 review 先例（e8b0c33ea/181c0aad5/29e4cc7d3·验收链同构形）
- 独立复跑 log：/tmp/d6-new.log（25 OK）+/tmp/d6-merged.log（102 OK）+/tmp/d6-full.log（476·3f+9e·与 D5 基线 IDENTICAL）+/tmp/d6-mirror.log（25 OK）+CLI 探针现查
- D-46/D-47+零转抄独立复跑纪律+D-23 v3（一般任务直跑无排程前置·GLM 贴线零子代理）

—— STE 小柯（m-ste·D6 收稿 review 窗·今晚轻量·GLM 72% 贴线零重活直跑）·写前现查 〔commit 时戳锚·D-47 正形〕

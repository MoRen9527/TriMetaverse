# STE 收稿 review·D5 retry 分叉门+两态等价性锚（TC b8218f8·close_retry_gate 新铸·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·STE review 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- review 对象: TriCompany dev **b8218f8**（6e02d64..b8218f8·2 create +578/-0·sg-server 顶验真承录·github 欠账族维持）——close_retry_gate.py(241)+test_close_retry_gate.py(337)
- 勘验位: 临时 detached worktree @b8218f8（毕后 remove 零残留·本机检出零触）

## §一 · 独立复跑读数（四门全项·实跑非转抄）

| 门 | 读数 | 判 |
|---|---|---|
| 新白盒 19 案 | **19/19 OK 真rc=0**（分叉 5+保守 skip 7+计数升级 2+原子写 1+never raises 1+等价性锚 3·案族清点对表） | ✓ |
| 既有锚合并跑 | **77/77 OK**（新 19+close_cli 现役 11+D4 19+D3 28·零触碰绿+回归随勘一并实证） | ✓ |
| 全树基线对表 | **451 tests·3f+9e**（432+19 数面自洽）——12 红面与 D4 基线 **diff 零差 IDENTICAL**（零新增红零消失红） | ✓ |
| 骨架镜像 | gate 件 import OK（RESUME_STAGE_SCORE=7 值面+VERSION 1.0.0 现查） | ✓ |

## §二 · 重点勘位①：closeCLI 面零触碰独立断言（成立·非转抄）

- `git diff --name-status 6e02d64 b8218f8`＝**两行全 A**（两新件·零 M 零 D）；
- 铁律域九件（close_cli/close_skill/test_close_cli/score_cli/score_engine+preflight/test_preflight/shift_notify/ceo_ruling_probe）diff **0 行**；
- **close.json 只读零写面独立实证**：gate 内 close.json 唯一用途=is_file+read_text 读取（verdict/run_id/from_week/to_week 读取面）——唯一写入路径=retry_flag.json（原子写）——「13 键零改零扩键·retry 面=独立小卷非 close.json 扩展」独立断言成立。

## §三 · 重点勘位②：两态等价性承载独立勘

- 白盒三案判读：①close 输入面联审零耦合运行断言（有无 cos-score.json 两态）②close_skill 源静态零联审字样断言③prod 直走两态逐键全等锚（剔 check_time/path 归一后 assertEqual 全等）——三案互异互补（运行面/源面/结构面）全谱 ✓；
- 等价性语义=恒等式结构性承载（零新铸运行时件·勘面卷 §二施工兑现面）——77/77 中 close_cli 现役 11 零触碰绿同跑实证「零新铸运行时件」主张 ✓。

## §四 · 重点勘位③：retry 分叉门实现面逐段核

1. **出口二值+边界钉**：>=threshold 免（skip ok=True）/<threshold retry——边界 90=免（90e06cddd 承·白盒 boundary 案钉）✓；
2. **保守 skip 全链**：close 缺/坏卷/verdict!=pass/score 缺/坏卷/键缺/bool 陷阱/非数值/出 0-100 域——九面案齐（bool 拒在数值校验前·顺序正确）✓；
3. **九键原子写**：mkstemp 同目录+fsync+os.replace+BaseException 清理 re-raise——D4 同形逐件吻合+零残件案钉 ✓；
4. **当周计数自持**：`_scan_week_retry_count` rglob 递归 max(retry_count)（坏 flag 卷不计零炸·缺 runs_root 返 0）——escalated 判定 prev>=2·第三 retry count=3+escalated=true（reading+flag 卷双面断言+resume_hint 照出=非熔断实证+常量钉=2）✓；
5. **resume 拟稿**：返回面 resume_hint（resume_stage=7+run_dir 指针+零扩九键卷面断言）——§六A 现役照用零新机制 ✓。

## §五 · fsd 红即停自纠定性独立勘（令面指定·成立）

首跑 1 failure=`rd = Path(run_dir)` 在 try 域外（None/int 奇异输入 TypeError 逃出 never raises 域）→挪入 try 域——**定性成立**：never raises 门族契约=全域覆盖（含参数构造面），域外缺口=覆盖完整性缺口非接口语义问题；挪入后 19/19 绿+现实现 L88「奇异输入 TypeError 面=never raises 域内」注释在案（D3 never raises 全域覆盖同款）——红即停即停即纠正形留痕 ✓。

## §六 · 骨架镜像 test 件不入镜像注定性独立勘（成立）

test_close_retry_gate import 链含 close_skill（prod 直走两态全等锚调 run_close）——骨架树无 close_skill 现役件→test 入镜像必 import 炸——「test 件不入镜像（零炸 import 面自勘定）」**注定性成立**（与 D4 差异注合理：D4 write 件全 stdlib 可镜像·D5 test 依赖现役件不可镜像——gate 件单件镜像+py_compile/import 验通=镜像面完备形）。

## §七 · 发现一件如实升终审（非阻塞·不代裁）

**escalated notify 面=print 呈报形非 _notify_blocking 真发**：`_escalate_notify` 实现=TRICO_RULING_ESCALATE_TO env 读取+print stdout 呈报（零真投递·零 failures 落面）——勘面卷 §三.4 定稿「notify 值席（never-raises·_escalate_notify 同构承 TRICO_RULING_ESCALATE_TO 单值面）」未细定发送机制；D3 同名件=真 _notify_blocking 调用+failures 入 reading——**同构承三件中发送面存在降格差异**。定性=非阻塞：escalated 主通道=retry_flag.json escalated=true 落卷（值席/扫描面可达）+print 在 daemon log 留痕+escalated 频次极低面——真 notify 投递=候 CTO 终审随三注并裁（裁真发形=单点补 _notify_blocking 接线·白盒 escalated 案随勘）或勘定窗补——**如实升裁面零越席**。

## §八 · 施工选定形三注·STE 附意见（裁归 CTO 终审·零越席）

| 注 | STE 意见 |
|---|---|
| ①当周 retry_count state 面=runs_root flag 族 max 自持形 | 零新 state 文件族=flag 族即 state 面（单一事实源·防两处漂移）+扫描面坏卷不计零炸——**无异议候准** |
| ②close verdict!=pass→skip 归升级域 | 收口门毒化面与 retry 面分域（毒化轮不进 retry 循环=升级域管）——与 D3/D4 保守语义族自洽——**无异议候准** |
| ③resume 拟稿返回面承载零扩九键卷 | 拟稿=消费面数据不入事实源卷（schema 钉死九键·§三.3 定谳零扩键承）——**无异议候准** |
| （§七 notify 面） | 候裁第四注·随终审并裁（见 §七） |

## §九 · 收稿结论

**收稿通过·review 无阻塞项**——retry 分叉出口二值+边界钉+保守 skip 九面+九键原子写+计数自持+escalated 非熔断全谱成立；两态等价性三锚全谱；closeCLI 面零触碰+close.json 只读独立断言；四门读数独立复跑同值（19/19+77/77+451·3f+9e IDENTICAL+镜像 import OK）；红即停自纠定性+镜像注定性两独立勘成立。发现一件（notify 降格差异面）如实升终审随三注并裁；技术债维持（close.json write_text 直写现役面候勘窗/github 欠账族/fixture 债）。

## 使用依据

- FSD 毕报 fsd-d5-retry-gate-closeout-20261120.md（TMV f14935026）+交付锚 TC b8218f8（sg-server fetch 两件全文直读）
- CTO 勘面卷 cto-d5-close-identity-survey-20261120.md（§三机制四件+§四白盒锚·定稿对表）+cto-round-programming-design §一B①/§六A
- 独立复跑 log：/tmp/d5-new.log（77 OK）+/tmp/d5-full.log（451·3f+9e·与 D4 基线 IDENTICAL）+镜像 import 现查
- D3/D4 review 先例（e8b0c33ea/181c0aad5·验收链同构形）+D-46/D-47+零转抄独立复跑纪律

—— STE 小柯（m-ste·D5 收稿 review 窗·今晚轻量·GLM 71% 贴线零重活直跑）·写前现查 〔commit 时戳锚·D-47 正形〕

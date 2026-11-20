# FSD 毕报·D5 retry 分叉门+两态等价性锚（TC b8218f8·close_retry_gate 新铸+零触碰铁律域五件·preflight 现役件零触碰）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T12:50:44Z（date 现查粘贴·+8=11-20 20:50·D-47 正形）
- 令面: COO 派工令 WO-D5-20261120 §四形 A 今晚启定谳（台账 712·bcb78bda7·20:43:32 达·双形判据兑现=勘面毕 6aacc6609 ∧ CFO 现读 71%<75%）·施工正身=CTO 勘面卷 6aacc6609 三范围照铸零改形
- 交付锚: **TriCompany dev b8218f8**（6e02d64..b8218f8·2 files +578·sg 通道 push 达仓·ls-remote 顶==local b8218f8fbb2bef7 全等 ✓）
- **next_agent=STE**（毕报承带→STE review→CTO 终审 APPROVE→D5 划项·D3/D4 验收链同构形）

## 一·开工前置勘定（零编造 readiness）

1. CTO 勘面卷 6aacc6609 全文读毕（73 行·§〇现役件面承录→§一 closeCLI 接口定谳→§二两态等价性恒等式→§三 retry 分叉机制四件→§四白盒锚全谱）——施工=照铸零改形。
2. 现役件活体直读（TC 6e02d64 非转抄）：close_cli.py 159 行（四签名 summarize_stages/derive_run_state/assert_close_contract/run_manifest+七段 _STAGE_ORDER）+close_skill.py 287 行（run_close/_STAGE_ARTIFACTS 六件扫描域/_structure_gate 九必载键/run_state 单值源 manifest 引用形）——**两态等价性现役天然成立活体实证：close 扫描域零联审卷（cos-score.json 不在 _STAGE_ARTIFACTS/evidence 域）=§二.1 输入面同一性实锚**。
3. 段号旁证实锚：close_skill docstring「阶段 8」+close_cli「阶段 9」→score=段 7（resume 拟稿段号承）·chain_runner 不在 TC 现役（§六A 消费位=loop 体候窗域·拟稿零链现役签名如实注）。

## 二·实现方案（勘面卷三范围照铸·施工选定形如实注）

- **范围①closeCLI 面=零触碰实证**：四件签名照守零改零新签名·close.json WP7 13 键零改零扩键（retry 面=独立 retry_flag.json 小卷）——git 变更实证=两新件零现役件（close_cli/close_skill/test_close_cli/score_cli/score_engine 铁律域五件+preflight 族零触碰）·close.json write_text 直写非原子注=候勘定窗候选件零趁 D5 改（勘面卷 §一.4 承录维持）。
- **范围②两态等价性=零新铸运行时件白盒承载**：现役已天然满足（§一.2 活体实证）——施工承载=白盒锚三案（运行面零耦合断言+close_skill 源静态零联审字样断言+prod 直走两态逐键全等锚——两 run_dir 有/无 cos-score.json·run_close 输出剔 check_time/path 归一后 assertEqual 全等=两态完全同一结构实证）。
- **范围③retry 分叉新铸 close_retry_gate.py**：check_retry_fork(run_dir, threshold=90)->dict（§三.2 照铸）——出口二值 retry|skip·内部分读取面=score.json "score" 键（§一.3 实锚）·**边界 90=免 retry**（<90 判据·90e06cddd 承白盒钉）·保守 skip 面（close 缺/verdict!=pass 收口门毒化=升级域管〔施工选定形如实注〕/score 缺坏键缺非数值 bool 陷阱出 0-100 域）·retry_flag.json 九键原子写（tmp+os.replace+fsync D4 §一.4.2 同形·零半卷零残件）·次数上限=当周 flag 族 max 自持（runs_root 递归扫描零新 state 文件族〔施工选定形候终审〕）·两 retry 后 escalated=true+notify 值席（TRICO_RULING_ESCALATE_TO 单值面 D3 _escalate_notify 同构·**如实呈报非熔断**零停工零 job 停用）·resume 拟稿=段 7 起重跑至 close（§六A 现役照用零新机制·拟稿在返回面 resume_hint 零扩九键卷面·消费位=loop 体候窗域）。

## 三·代码变更清单

| 件 | 面 |
|---|---|
| runtime/cognition/close_retry_gate.py | 新件·retry 分叉门（check_retry_fork+当周扫描+原子写+escalate notify+直跑 CLI 入口） |
| runtime/cognition/test_close_retry_gate.py | 新件·白盒 19 案（retry 分叉 9 族+保守 skip 7+等价性锚 3） |

骨架树镜像面（TMV/.fade/fsd-drafts/runtime/cognition/·gitignore 非交付锚·部署窗随迁）：close_retry_gate.py 单件镜像（py_compile+import 验通·resume_stage=7 面）——**test 件不入镜像如实注**（import close_skill 现役件·骨架树无=零炸 import 面自勘定·D4 先例形差异注）。

## 四·自测结果（门禁读数全项·全实跑非推演）

1. **retry 分叉白盒**：19/19 绿（≥90 免案/边界 90=免钉/<85.5 落 flag 九键精确案/自定义 threshold 案/resume 拟稿形案〔段 7+run_dir 指针+零扩键面断言〕/close 缺 skip/verdict fail skip/score 缺 skip/非数值族 skip/键缺 skip/出域 150 skip/坏卷 skip/计数自持案/两 retry escalated 案〔count=3+escalated=true+拟稿照出非熔断〕/原子写零残件案/never raises 奇异输入族案）。**红即停自纠一笔如实注**：首跑 1 failure——rd=Path(run_dir) 在 try 域外（None/int 奇异输入 TypeError 逃出 never raises 域）——挪入 try 域后 19/19 绿（D3 never raises 全域覆盖同款）。
2. **既有锚合并跑**：77/77 绿（D3 28+D4 19=47 照承+close_cli 现役 11 零触碰绿实证）。
3. **全树基线对表**：451 tests** failures=3 errors=9 与 D3/D4 基线逐数全等零新增红零消失红**（432+新 19=451 数面自洽）——既有红 12 族归因维持（SpawnGlm/PatchRunner/preflight fixture/CliAdopt·本机环境预存族）。
4. **骨架镜像验证**：gate 件 py_compile OK+import OK（resume_stage=7 值面）。
5. **等价性锚读数**：两态逐键全等实证（close_a==close_b 剔 check_time/path 归一）+close_skill 源文本零联审字样静态断言过+close 输出卷零联审键运行断言过。
6. **零活体触自证**：全变更=两新件（git create mode 实证）·铁律域五件+preflight 族零触碰·零进程触零 daemon 触。

## 五·护栏对表（COO 令四族+GLM 止损线）

1. 现役件零触碰：✓（§四.6 实证·铁律域较 D4 扩 close/score 族五件全零触）；
2. 红即停：✓（首跑 1 failure 即停即纠零二次硬试）；
3. GLM 75% 止损线联动：✓（零子代理直跑省用·施工 20:43 受令→20:50 毕=7 分钟量级·CFO 触线预测 22-24 点带前收口·水位候 CFO 现读数复核——毕不完带出零硬塞条款=本窗毕于窗内无带出）；
4. 技术面取舍候 CTO：施工选定形注三处（当周 state 面=flag 族自持形/close verdict!=pass=skip 归升级域/resume 拟稿返回面承载形）候终审·零越席裁定。

## 六·技术债务标记

1. **施工选定形三注候终审**（§五.4·裁面候定）：①当周 retry_count state 面=runs_root flag 族 max 自持（勘面卷只定「当周 state 面读+落卷自持」未定落点形态）②close verdict!=pass→skip（勘面卷伪码「close.json verdict」参与面未细定·归升级域施工落定）③resume 拟稿承载=返回面 resume_hint（不入九键卷·消费位候窗）——终审若裁变=单点改形白盒随勘。
2. **close.json write_text 直写非原子**（现役面·勘面卷 §一.4 候选件承录维持）：候勘定窗随勘零趁 D5 改。
3. **TMV github 欠账族维持**：f6413ea03+D4 毕报 75934c2e3——443 断窗（20:08 勘定维持）·窗开 ls-remote 验真批推。
4. **fixture 债维持**：test_preflight make_args 补参（D3 债单①·勘定窗候排）。
5. **worktree 收尾**：tc-d5-wt-20261120（毕报落树后 remove·D3/D4 先例同构）。

## 七·使用依据

- COO 派工令 WO-D5-20261120 §四（bcb78bda7·台账 712·形 A 今晚启+护栏四族）
- CTO 勘面卷 6aacc6609（§〇现役承录+§一接口定谳+§二两态等价性恒等式+§三 retry 四件+§四白盒锚——三范围照铸正身）
- cto-round-programming-design-20261119（§一B① retry 机制+90e06cddd 边界/§六A resume-stage/§八 prod 直走）
- 现役件活体直读：close_cli.py/close_skill.py（TC 6e02d64·签名照守+扫描域实锚+段号旁证）
- 本卷读数=实跑非推演（unittest 三门+push ls-remote 双证·现查 12:50:44Z）

---
落卷=FSD 小全（m-fsd）·D5 毕（20:50+8）·**next_agent=STE**（STE review→CTO 终审→划项）·零活体触维持（铁律域五件+preflight 零触碰）·GLM 止损线在役承（零子代理直跑·7 分钟量级窗内收口）

# FSD 毕报·D4 写面施工（TC 6e02d64a·write_cos_decision 综合裁判接口+读面配套勘修·preflight 现役件零触碰）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T12:04:23Z（date 现查粘贴·+8=11-20 20:04·D-47 正形）
- 令面: COO 派工令 WO-D4-20261120 §四（b7438ba62·台账 706·19:54:28 达·窗位判读=形 A 今晚启定谳）·施工正身=CTO 勘面卷 1e1fe02ec 三范围照铸零改形
- 交付锚: **TriCompany dev 6e02d64**（1487d29..6e02d64·4 files +386/-6·sg 通道 push 达仓·ls-remote 顶==local 6e02d64ae35748f4 全等 ✓）
- **next_agent=STE**（毕报承带→STE review→CTO 终审 APPROVE→D4 划项·D3 验收链同构形）

## 一·开工前置勘定（零编造 readiness）

1. CTO 勘面卷 1e1fe02ec 全文读毕（104 行·三范围定谳正身·§一.0 键名现形实证→§一.4 签名定谳→§二意见窗五面→§三白盒锚全谱在手）——施工=照铸零改形。
2. TMV fetch 勘新顶（b7438ba62 台账 706+勘面卷在链）·TC sg 顶勘定（1487d296f3=COO 收编 merge·含 D3 9b96ea3 IN-CHAIN）——worktree 形施工（tc-d4-wt-20261120 @ 1487d296f3 detached·D3 先例同构）。
3. 勘修位 grep 实锚：cos_decision_gate.py 两处 fade001_internal_score（L11 docstring+L136 scores face）——勘面卷 §一.3 勘修位表逐项吻合。
4. 近形消歧承录：cos_decision_audit.py（LG-074 两 COS 裁决合规审计件）与写面接口零涉零冲突（D3 毕报消歧承·本窗复核维持）。

## 二·实现方案（勘面卷三范围照铸·施工选定形如实注）

- **范围①·写面新件**=cos_decision_write.py：write_cos_decision 综合裁判接口（§一.4 签名逐字照铸）——**三定谳伴生语义全兑现**：①落卷位=本轮 run_dir/cos-score.json（写本轮非写 prev·本轮落卷→下轮本轮变 prev→链条闭合=防自吞判决正形）②原子写=tmpfile.mkstemp 同目录+os.replace（fsync·零半卷·炸后 tmp 清理）③防重默认拒覆写=decided 卷在（eviction_decision 有效二值）默认拒绝返 already_decided（判决=终局事件源零静默覆写）——勘正重判=显式 overwrite=True+勘正理由入 rationale（调用方义务·定谳语义）。decided_at None=函数内现查 UTC ISO8601（D-47 面同构）；二值域出域 ValueError（归一后校验 strip/lower）；空串/非数值校验（bool⊂int 陷阱同族钉）；never raises 运行面保守返 dict（门族同构承）。
- **范围②·意见窗机制**：勘面卷 §二机制面定谳在卷（触发位=轮毕 close 落→窗开→7 席评审卷→COS 综合评估→write 落卷→窗关→层 2 门下拍可判）——**码面候生产并发编排窗=零本窗施工面**（§二.4 意见窗零独立计时器定谳承·D3 校准③同形如实注）——写面接口本笔已备齐=意见窗落卷消费位。
- **范围③·读面配套勘修**（§一.3 三行随勘）：cos_decision_gate.py L136 scores 呈现面单行 fade001_internal_score→internal_score+L9-12 docstring 六键 schema 定谳形（键名通用化形 A·判定只消费 eviction_decision 零依赖承）+test_cos_decision_gate.py scores 呈现面案键名随勘（_score helper+test_evolve_ok 断言·判定面案零涉零动）。
- **施工选定形三注（候 CTO 终审·零越席裁定）**：①文件名=cos_decision_write.py（§一.4 只定接口名未定文件名）②校验两分=参数契约面 raise ValueError fail-fast（白盒锚「二值域出域 ValueError 案」定谳承）+运行面 never raises 保守返 dict（§一.4「never raises」承——两义并存施工落定）③覆写溯源=卷面 overwritten/previous_decided_at 两扩展键（§一.2 自由扩展区零依赖域·值席线 B-7 数据处置联动审计面）。

## 三·代码变更清单

| 件 | 面 |
|---|---|
| runtime/cognition/cos_decision_write.py | 新件·写面综合裁判接口（write_cos_decision+防重读卷 helper 两件） |
| runtime/cognition/test_cos_decision_write.py | 新件·白盒 19 案（原子写 schema 6+契约 ValueError 7+防重两态 4+never raises 2——勘面卷 §三锚族逐项承） |
| runtime/cognition/cos_decision_gate.py | 勘修·读面配套（L136 单行+docstring 六键形——§一.3 勘修位表承） |
| runtime/cognition/test_cos_decision_gate.py | 勘修·scores 呈现面案键名随勘（判定面案零涉） |

骨架树镜像面（TMV/.fade/fsd-drafts/runtime/cognition/·gitignore 非交付锚·部署窗随 score_skill 迁 TC）：write 两件镜像（write 件零 TC 依赖全 stdlib 可镜像·gate 件 import preflight 依赖故不入镜像=零炸 import 面）——镜像 19/19 绿实证。

## 四·自测结果（门禁读数全项·全实跑非推演）

1. **写面白盒**：19/19 绿（六键 schema 精确案/decided_at 两态/嵌套目录/int 接受/归一化案/出域 ValueError 族/空串族/非数值族/bool 陷阱案/校验失败零残卷案/防重默认拒原卷零变案/显式 overwrite 溯源案/坏卷可覆写案/非二值旧卷可覆写案/never raises 族）。**红即停自纠一笔如实注**：首跑 1 failure——「evolve 」误列出域循环（strip/lower 归一后=合法值·与归一接受案自相矛盾）——测试值设计错非接口 bug·移除后 19/19 绿。
2. **D3 回归随勘**：28/28 绿（gate 14+probe 14——勘修面随勘绿·判定面零漂移实证）。
3. **全树基线对表**：432 tests** failures=3 errors=9 与 D3 基线逐数全等零新增红零消失红**——红 12 族归因=SpawnGlmEnvTest 6e（GLM env/settings 本机无 token 环境面）+PatchRunnerEndToEnd 3（1e+2f·本机环境面）+preflight RunPreflightExitCodesTest 2e（fixture 预存不同步面·D3 债单①维持）+CliAdoptEndToEnd 1f（本机环境面）——全族既有非本笔引入。
4. **骨架镜像回归**：19/19 绿（0.281s·镜像面零漂移）。
5. **键名残留扫描**：worktree 全树 grep fade001_internal_score 零命中（六键新形全落·gate/test/write 三件一致）。
6. **零活体触自证**：全变更=worktree 文件面+push·preflight.py/test_preflight.py/shift_notify/ceo_ruling_probe 现役件零触碰（4 files 变更=两新两勘·git log 实证）·零进程触零 daemon 触。

## 五·护栏对表（COO 令四族+GLM 止损线）

1. 现役件零触碰：✓（§四.6 实证——preflight 现役件铁律域零顺手改·fixture 债维持勘定窗候排）；
2. 红即停：✓（白盒首跑 1 failure 即停即纠·零二次硬试）；
3. GLM 75% 止损线联动：✓（本窗零子代理直跑省用·施工直跑毕于现读数 70% 后约 10 分钟量级·毕时水位候 CFO 现读数复核——触线即停条款在役承）；
4. 值守位毕报链：✓（本卷=毕报落树+台账双通道·next_agent=STE·零抢审）。

## 六·技术债务标记

1. **施工选定形三注候终审**（§二·非债·裁面候定）：文件名/校验两分/覆写溯源键——终审若裁变=单点改形+白盒随勘（改动面极小）。
2. **fixture 债维持**：test_preflight make_args 补参（D3 债单①·勘定窗候排·本窗零顺手改承）。
3. **TMV github 欠账族维持**：f6413ea03（D3 毕报）+本卷——github 443 断窗族·窗开批推。
4. **意见窗码面候窗**：生产并发编排窗域（§二.4 定谳承·非债候窗项）。
5. **worktree 收尾**：tc-d4-wt-20261120（毕报落树后 remove·D3 先例同构）。

## 七·使用依据

- COO 派工令 WO-D4-20261120 §四（b7438ba62·台账 706·形 A 今晚启定谳+护栏四族）
- CTO 勘面卷 1e1fe02ec（§一.0-§一.4 键名/schema/勘修位/签名定谳+§二意见窗五面+§三白盒锚——三范围照铸正身）
- D3 毕报与验收链卷（fsd-d3-gate-wiring-closeout-20261120·STE e8b0c33ea/CTO ac33b8a32——五键名 APPROVE 附瑕疵候 D4 窗=本笔兑现位）
- cto-round-programming-design §一C（判决机制改形定谳·防自吞链条语义源）
- 本卷读数=实跑非推演（unittest 全量五门+push ls-remote 双证·现查 12:04:23Z）

---
落卷=FSD 小全（m-fsd）·D4 写面毕（20:04+8）·**next_agent=STE**（STE review→CTO 终审→划项）·零活体触维持（preflight 现役件零触碰）·GLM 止损线在役承（零子代理直跑省用·毕不完带出零硬塞条款=本窗毕于窗内无带出）

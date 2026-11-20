# FSD 毕报·D6 激活判据件（TC f5f664c·activation_gate 挡位边新铸+防死锁白名单机械面·现役件零触碰）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T13:35:49Z（date 现查粘贴·+8=11-20 21:35·D-47 正形）
- 令面: COO 施工令 WO-D6D7 形 A 今晚启（台账 718·13:31:05 落款·双形判据兑现=勘面毕 e88cbf86e ∧ CFO 现读 21:29:28 周窗 72%<75%）·施工正形=CTO 并勘卷 e88cbf86e §二.4 件形定谳照铸零改形
- 交付锚: **TriCompany dev f5f664c**（b8218f8..f5f664c·2 files +420·sg 通道 push 达仓·ls-remote 顶==local f5f664c861ba6a7 全等 ✓）
- **next_agent=STE**（毕报承带→STE review→CTO 终审 APPROVE→D6 划项·D3/D4/D5 验收链同构形）

## 一·开工前置勘定（零编造 readiness）

1. CTO 并勘卷 e88cbf86e 全文读毕（120 行·§一三层判据族总纲→§二激活判据条目族+防死锁豁免→§三首轮知情停点机制形→§四过渡期衔接→§五-§七 D7 勘定面→§八白盒锚）——D6 施工=§二.4 件形照铸·D7 面（runner/四护栏活体探针）零夹带如实注。
2. 三层分野对表承录：挡位边（本件）≠轮转边（D1 EXIT≥95）≠质量边（D5 retry<90）——两件零消费对方产物零分支交叠·判读面零 EXIT 逻辑（活体实锚）。
3. worktree 形施工 @ b8218f8（D5 交付顶·detached·D3/D4/D5 先例同构）。

## 二·实现方案（件形定谳照铸·施工选定形如实注）

- **判读面纯函数**：check_activation(checks: dict) -> dict——状态采集位在调用面（件内零跨仓读零文件读零写面·纯 stdlib）·**零写面双断言钉**（tmp 目录调用前后零变化+源码零文件 IO 字样静态断言——§八案族承）。
- **A1-A4 条目族判读**（§二.3）：A1 改造线锚（D1-D5 划项布尔）/A2 白盒面（零新增红基准·既有 12 红面 3f+9e 预存环境面禁全绿冒充如实定谳承）/A3 护栏面（四护栏常位锚齐·D7 共享读数单向引用非环——未齐=blocked+交点位如实注）/A4 语义面（等价性锚在卷+铁律零触）。出参=gate ready|blocked+items 逐条读数+unmet 明细 fail-closed。
- **防死锁自指豁免=白名单机械面**（§二.2 施工落定形·候终审注）：checks schema 白名单=A1-A4 必填+轮面可选三键（first_round_complete/release_ref/round_reading）——D6 自身毕/D7 毕/S5 毕条目键=出白名单 ValueError 拒（白名单拒即机械面零豁口·白盒钉五案）。
- **知情停点语义面**（§三·D6=语义面·执行面=runner 消费接线 D7 窗族随铸零夹带如实注）：first_round_complete=True→first_round_pending=stop 阻塞停（§三.1 四理由链承·放行一次非逐轮放行）+大白话载荷拟稿（候您一眼知情·§三.3 呈报面承）+round_reading 槽位（close_verdict/score_total/retry_count/exit_reading·零填=None 槽位）；放行令消费=令面非时面——release_ref（authority_ref CEO 一手令面）在→released+ref 记录·空串/缺席→stop fail-closed（无 ref 拒绝·§二 CEO 切换权同族）。
- **切换宣告载荷**（§四.3）：A1-A4 全兑现→switch_announce 载荷拟稿（notify_target=COO+nature=宣告知会非批门——§四.1「候 COO」歧义消解承·零码面分支）。
- **契约两分**（D4 同构承）：契约面 ValueError fail-fast（非 dict/白名单外键/必填键缺/条目值面非布尔——try 外）+运行面 never raises 保守 dict（try 内）。

## 三·代码变更清单

| 件 | 面 |
|---|---|
| runtime/cognition/activation_gate.py | 新件·挡位边激活判据件（check_activation+render_activation_payload 序列化面+直跑 CLI 入口） |
| runtime/cognition/test_activation_gate.py | 新件·白盒 25 案（勘面卷 §八案族逐项承） |

骨架树镜像面：activation_gate.py+test_activation_gate.py 双件镜像（gate 零 TC 依赖+test 只依赖 gate 单件——骨架跑通形·D5 差异注：D5 test 依赖 close_skill 现役件不入镜像·本笔双件全镜像 25/25 绿）。

## 四·自测结果（门禁读数全项·全实跑非推演）

1. **激活判据白盒**：25/25 绿首跑即清（逐条判读 4+全兑现/单条缺 fail-closed+防死锁豁免钉 5〔d6_done/activation_gate_done/d7_done/s5_window_done/bogus〕+停点语义 3+放行令消费 3+宣告载荷 2+契约 4+never raises 2+零写面 2）。**红即停自纠一笔如实注**：施工中 f-string 语法炸残留（契约段非法表达式·import 即炸级）——写后自纠于首跑前（smoke import 探针拦·零白盒红）。
2. **既有锚合并跑**：102/102 绿（D3 28+D4 19+D5 19=66 令面锚照承+close_cli 现役 11 零触碰实证+新 25）。
3. **全树基线对表**：476 tests** failures=3 errors=9 与 D3/D4/D5 基线逐数全等零新增红零消失红**（451+新 25=476 数面自洽·IDENTICAL 形=A2 判读基准同源）。
4. **骨架镜像回归**：25/25 绿（0.005s·双件零漂移）。
5. **零活体触自证**：全变更=两新件（git create mode 实证）·铁律域五件+preflight 族零触碰·判读面零写面（白盒零写面断言双钉）。

## 五·护栏对表（COO 令四族+GLM 止损线）

1. 现役件零触碰：✓（两新件实证·勘定窗三件零趁改维持）；
2. 红即停：✓（f-string 炸 smoke 拦即修·零二次硬试）；
3. GLM 75% 止损线联动：✓（零子代理直跑·受令 21:31→毕 21:35=4 分钟量级·D5 同族先例形·72% 现读下窗内收口·候 CFO 现读数复核——毕不完带出零硬塞条款=窗内毕无带出）；
4. 技术面取舍候 CTO：施工选定形注（防死锁=白名单 ValueError 机械面形·勘面卷只定豁免定谳未定机械承载形）候终审·零越席裁定。

## 六·技术债务标记

1. **施工选定形注候终审**：①防死锁机械承载=白名单拒 ValueError（非静默忽略形）②轮面可选键 schema 形（first_round_complete/release_ref/round_reading 三键名施工选定）③release_ref 非字串值=静默走 stop 分支（非 ValueError——可选键宽契约形）——终审若裁变=单点改形白盒随勘。
2. **resume 消费位/D7 面**：勘面卷 §七 定谳在卷·施工=D7 窗族（明晨窗）零夹带承——本件零 resume 分支零 runner 涉（活体实锚）。
3. **TMV github 欠账族维持**：f6413ea03+D4 毕报+D5 毕报——443 断窗维持·窗开批推。
4. **fixture 债维持**：test_preflight make_args 补参（勘定窗候排）。
5. **worktree 收尾**：tc-d6-wt-20261120（毕报落树后 remove）。

## 七·使用依据

- COO 施工令 WO-D6D7 形 A（台账 718·13:31:05 落款·护栏四族）
- CTO 并勘卷 e88cbf86e（§一三层总纲+§二条目族/防死锁+§三停点机制+§四衔接定谳+§八白盒锚——件形照铸正身）
- D1 设计卷（§一A③/§二 flag CEO 权 fail-closed/§五 S5/§八过渡期——判据语义源）
- D3/D4/D5 交付链（三层分野对表基座·IDENTICAL 判读形）
- 本卷读数=实跑非推演（unittest 四门+push ls-remote 双证·现查 13:35:49Z）

---
落卷=FSD 小全（m-fsd）·D6 毕（21:35+8）·**next_agent=STE**（review→CTO 终审→D6 划项）·零活体触维持（现役件零触碰+判读面零写面）·GLM 止损线在役承（零子代理·4 分钟量级窗内收口）

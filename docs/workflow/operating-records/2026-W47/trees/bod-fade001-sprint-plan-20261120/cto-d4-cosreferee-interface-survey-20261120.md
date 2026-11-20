# CTO D4 写面勘面卷（COS 综合裁判接口+轮间意见窗机制·WO-D4-20261120 §二/§四 勘面令兑现）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-d4-cosreferee-interface-survey-20261120.md·勘面正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令面受理: WO-D4-20261120 统排令 §二/§四（台账 704·8e848d6ea·BOD 催令在案）——勘面=施工硬前置（D2「勘毕才接线·零勘直工 FREEZE」同构·D4 写面新铸形适用）承
- 勘定基线: TC 检出 1487d29（=sg 顶全等·收编毕零分叉·merge-base 祖先链验真 YES）——读面门活体直读非转抄

## §一 · 勘面范围① COS 综合裁判接口定谳

### ①.0 读面消费键名现形实证（键名通用化裁定的实证基础）

`runtime/cognition/cos_decision_gate.py`（9b96ea3 族·D3 交付）活体直读：

- **判定键=`eviction_decision`**（L131：`str(score.get("eviction_decision","")).strip().lower()`→二值域 evolve|hold·非二值域→awaiting-decision 保守拦）——**判定只消费此一键**；
- `rationale`/`decided_at`=读数呈现面 .get 引用（L132-133）；
- 双分数键=`.get("joint_review_avg_score")`+`.get("fade001_internal_score")`（L134-137）——**纯 reading["scores"] 读数呈现面·零参与判定**（分数不进门判定逻辑·审计/观测用）。

**裁定含义**：键名通用化=零判定面风险（判定键通用·分数键改形只动读数呈现面两行 .get）。

### ①.1 键名通用化裁定谳（终审卷 ac33b8a32 原语兑现位）

**裁定：形 A（`internal_score` 通用键名+`instance` 字段）定谳**。五理由链：

1. 判定面零风险（①.0 实证：分数键零参与判定·通用化只动读数呈现面）；
2. instance 字段=卷面自描述（实例身份入卷 evidence 面·优于键名编码——审计可读性正向）；
3. 与 D2 同构：ceo-ruling.json 零实例嵌名（实例身份=runs_root 目录面承载·不入卷键名）——层 2 门族同构原则一以贯之；
4. 零存量迁移：落卷形未实落（D3 终审卷如实注「骨架窗零实件」）——写面本窗新铸直铸通用形·零改旧卷成本；
5. 读面配套勘修面极小（见 ①.3）。

**fade 系前缀约定化（形 B）与维持现状（形 C）弃裁**：形 B 只解决 fade 系嵌名非实例级（fade002 起复现）；形 C 门读 scores 呈现面按实例键名扩散（每实例一键名）——两形皆劣于形 A。

### ①.2 判决卷落卷格式定谳（六键 schema）

```json
{
  "eviction_decision": "evolve" | "hold",
  "rationale": "<COS 综合评估理由>",
  "joint_review_avg_score": <7 席联审均分>,
  "internal_score": <实例内部分>,
  "instance": "<实例名·如 fade001>",
  "decided_at": "<UTC ISO8601·COS 落卷时点>"
}
```

- 判定键 eviction_decision 二值域不动（读面四态判定的正身·零动）；
- `fade001_internal_score`→`internal_score`+`instance` 拆分（①.1 裁定兑现）；
- `joint_review_avg_score` 本就通用名零动；
- 其余键=写面自由扩展区（读面零依赖·STE review §五「落卷形其余键零依赖=向后兼容」承）。

### ①.3 读面配套勘修位（入 D4 施工批·随写面同窗兑现）

| 件 | 勘修面 | 性质 |
|---|---|---|
| cos_decision_gate.py L136 | `"fade001_internal_score"`→`"internal_score"`（scores 呈现面单行改） | D3 新件非现役件（本周交付·零铁律域）·写面定谳配套勘修 |
| cos_decision_gate.py L10-12 docstring | 真值源注释面键名随勘（六键新形） | 注释面 |
| test_cos_decision_gate.py | scores 呈现面案卷面键名随勘（判定面案零涉·eviction_decision 案不动） | 白盒随勘 |
| 勘修门 | 28/28 白盒绿+全树对表零新增红（413 族对表·D3 门同形） | 施工批自带门禁 |

### ①.4 写面接口签名定谳（新铸形·骨架零承形）

```python
def write_cos_decision(
    run_dir: str | Path,             # 目标轮 run_dir（本轮·轮毕后 COS 判决落卷位）
    eviction_decision: str,          # "evolve" | "hold"（二值域校验·出域 ValueError）
    rationale: str,                  # 综合评估理由（空串校验·零空卷）
    joint_review_avg_score: float,   # 7 席联审均分（数值校验）
    internal_score: float,           # 实例内部分（数值校验）
    instance: str,                   # 实例名（空串校验）
    decided_at: str | None = None,   # 落卷时点（None=函数内 date 现查 UTC ISO8601·显式传=勘正/重演面）
    overwrite: bool = False,         # 防重开关（默认 False）
) -> dict:                            # {ok, path, decided_at, ...}·never raises（异常保守返 dict·门族同构承）
```

三定谳伴生语义：

1. **落卷位=本轮 run_dir/cos-score.json**：读面 candidates[-1]（pf mtime 最新完整轮）=下轮开时的 prev——本轮落卷→下轮本轮变 prev→链条闭合 ✓（写本轮非写 prev·防自吞判决）；
2. **原子写**：tmp+`os.replace`（零半卷面——读面坏卷保守拦已兜底·写面自持原子=零制造坏卷）；
3. **防重默认拒覆写**：decided 卷在（eviction_decision 有效二值）→默认拒绝（判决=终局事件源·零静默覆写）——勘正重判=显式 `overwrite=True`+勘正理由并入 rationale（值席线 B-7 数据文件处置联动：覆写=硬候令形·主会话 COS 域执行同理零静默）。

## §二 · 勘面范围② 轮间意见窗机制定谳（五面）

1. **触发位**：轮毕（close.json 落卷）→意见窗开（COS 收集 7 席意见）→综合评估→cos-score.json 落卷（§一接口）→意见窗关——层 2 门下探测拍可判（skip→evolve 放行或 hold 判止或 absent 挂起）；
2. **意见形态**：7 席意见卷=skill 评审卷族正身（D2 已立·ALLOWED 十键·average_score 族）——意见窗=**收集汇总面零重造面**（COS 汇总引用评审卷·不新立意见格式——skill 卷=BANNED 键族护栏在役不变）；
3. **流转机制**：7 席评审卷（各席 run_dir 内）→COS 综合评估（joint_review_avg_score 汇总+internal_score 引用+rationale 综合）→write_cos_decision 落卷→round_runner 事件源双轨并读驱动下轮（§一C 定谳语义·零改）；
4. **等待/超时语义**（层 3 生产并发编排并勘兑现——D3 终审随卷残面④并入定谳）：意见窗自身**零独立计时器**（同构校准③承）——等待超时候升级语义**承轮级 gate**：骨架形=层 2 awaiting-decision 72h 升级催办正身（_ESCALATE_AFTER_H 单值源 import 零复制·已在役）即意见窗超时的现役承载面；生产并发编排形（候窗）引入真异步席位长跑→意见收集等待超时→escalated 呈报+verdict=fail（D3 毕报 §五③同款·**零造替身分铁律**）——机制面本卷定谳毕·码面候生产并发编排窗（零本窗施工面）；
5. **与层 2/层 3 衔接**：意见窗产出事件=层 2 门真值源（cos-score.json）；层 3 AND 投影双门并读不变（层 1 ceo-ruling+层 2 cos-score·终审 ac33b8a32 定谳承）——意见窗=轮级 gate 的语义上游·非新增门（零门数膨胀）。

## §三 · 勘面范围③ 白盒对表锚预告（FSD 施工输入面）

- **镜像族照承**：CeoRulingGateTest 10 案镜像族先例（D3 test_cos_decision_gate 同构形）——D4 写面白盒基线=原子写案+防重默认拒/显式 overwrite 案+六键 schema 校验案+二值域出域 ValueError 案+never raises 奇异输入族案（门族同构承）；
- **回归锚零漂移**：骨架 31 案回归锚零漂移（gate 裁决卷 §三既有锚承）+D3 28 案随勘绿（①.3 配套勘修面）；
- **施工护栏承**：骨架镜像面落 TMV drafts cognition 树（D3 先例同形）+score_skill.py 零触碰（skill 本体零改动纪律照承 D3）+preflight 现役件零触碰铁律（零涉面·写面独立新件）。

## §四 · 施工窗位判读输入面（归 COO 统排·本卷零判）

- 勘面毕（本卷）=施工硬前置条件兑现——**形 A 今晚（勘面毕∧GLM<75%）/形 B 候明晨 CFO 切换实锚**判读归 COO 统排域（B 层候令对象=本席主会话·统排=禁裁 C 层照 D-76 三层·本席零自判窗位）；
- D4 现势输入面承录：层 2 判决门读面已毕在位（9b96ea3 族·四态+AND 投影终审定谳）——写面（本卷定谳接口）与读面耦合点=判决卷格式（①.2 六键 schema+①.3 读面配套勘修）——写读两面对表锚齐·FSD 照勘面令施工零歧义面。

## §五 · 使用依据

WO-D4-20261120 统排令（m-coo 19:40 信·§二/§四·台账 704·8e848d6ea）；cos_decision_gate.py 活体直读（TC 检出 1487d29·9b96ea3 族在链·merge-base 祖先链验真）；cto-round-programming-design-20261119 §一C（语义源·L132 不投票制）；D3 终审卷 ac33b8a32（键名通用化原语+AND 定谳+残面④承）；STE review e8b0c33ea（§五消费弹性面）；值席线 D-76 三层（统排=禁裁 C 层·候令对象=本席主会话）；D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T11:47:41Z（+8=2026-11-20 19:47:41·date 现查原值·D-47 正形）

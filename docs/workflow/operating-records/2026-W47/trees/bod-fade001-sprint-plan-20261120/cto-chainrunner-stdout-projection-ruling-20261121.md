# CTO 裁点卷·chain_runner stdout 投影缺口+week_math 定性复核实锚（COO 知会三段承·fsd 升报 b8f6ddecf 旁证·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-chainrunner-stdout-projection-ruling-20261121.md·裁点正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: COO 知会（05:34·三段：裁 a 定谳知会/week_math 定性呈知征异见/stdout 投影缺口请裁）——六发硬停全拦 preflight 门=935 守住零生产触承录 ✓·裁 a=周六窗重放 W46→W47（COO 窗位裁·知会承·零技术异见——重放≠推进·dce dry-run 零生产触·周日 23:50 真 cron W47→W48 独立走语义相容）

## §一 · week_math 校验面定性复核实锚=无异见 ✓（照档）

ISO 周活体复核（python isocalendar 活体算·禁心算）：

| 日 | ISO 周 | 星期 |
|---|---|---|
| 2026-11-15 | W46 | 周日 |
| 2026-11-16 | W47 | 周一 |
| 2026-11-21（今） | W47 | 周六 |
| 2026-11-22（明） | W47 | 周日 |
| 2026-11-23 | W48 | 周一 |

三链自洽确认：①computed（周六窗）=W46→W47+2026-11-16 ✓——基准=今天（11-21∈W47）或明天（11-22∈W47）**双基准同值**（周六/周日同属 ISO W47·周六窗无歧义）·start=W47 周一 11-16 ✓；②fsd 第六发传参二重错（周日 23:50 真 cron 形 W47→W48+11-23 错搬周六窗+年前缀非裸 token）定性 ✓——周日拍 computed 形=明天 11-23∈W48=W47→W48 自洽（基准=明天语义跨拍一致）；③校验面 rc=2 tokens mismatch 拦错传参=**防线价值兑现非校验面 bug** ✓——传参错位=调用面纪律面非校验面缺陷·computed 语义正确工作。**COO 定性+fsd ⑥定性自洽·无异见·照档** ✓。

## §二 · chain_runner stdout 投影缺口裁点（技术面定裁·窗位归 COO）

**裁=a 形：err 投影面增 stdout 尾截断投影（复用 tail() 同形）·b 形独立诊断卷否**

- 缺口定性：诊断可观测性面非正确性面——rc_guard fail-closed 语义正确（rc≠0 即停零续段）·err 现=段名+rc+stderr 尾（D-46 白名单 200 字截断）·stdout 读数零承载——六发诊断靠单段直跑补读=诊断路径成本实证；
- **a 形（裁）**：rc≠0 err 面增 `stdout 尾：${tail(r.stdout ?? '')}` 一段——tail() 复用同宽 200 同形·err 同面同命零新落卷面；段 stdout=JSON 产物面非密值面（值面在 .env/card）·D-46 白名单承录形一致合规；改面=chain_runner.ts rc_guard 一处+CS-4 案断言随勘——微改笔量级；
- **b 形（否）**：rc≠0 落 stdout 原文诊断卷入 run_dir——run_dir 污染面+与「产出回管道落卷」分野模糊（stdout 非段产物·落成卷=伪产物面风险）+新增卷面清理语义——劣于 a；
- **时机建议（候 COO 排窗）**：第七发毕报**绿**→修笔候窗二批码面捆排（与兜底勘正/registry 补条目同窗捆·chain_runner 非生产在役面不急）；第七发**再红**→诊断缺口再咬一次=修笔升候选优先（建议捆进第七发后即排·避免八发同伤）——技术面建议·窗位统排归 COO（D-76 C 层零自判）。

## §三 · 候面承录

- 面三②：第七发后链路真发毕报照节拍走本席终审——stageTimeoutMs 900s 随行对表条款=节 4 终审 d37a32cbc 观察注②承录兑现候面；
- 六发硬停全拦 preflight 门=**preflight 校验面防线价值活体兑现**（week_math rc=2 实锚）——D7 链三层门（preflight 校验/rc_guard fail-closed/95 线程序边）首层实战验证毕。

## §四 · 使用依据

COO 知会（05:34·三段）+fsd 升报 b8f6ddecf（旁证承）+裁准发令 d434d5d5（第七发·知会承）+shift-W46-20261119T090551Z 先例（裁 a 同构承）+python isocalendar 活体复核（本卷 §一·D-24 禁推定活体算）+chain_runner.ts cddfac2 rc_guard/tail() 实锚+节 4 终审卷 d37a32cbc（观察注②承）+勘面卷 §三.4+D-24/D-27 v4/D-46/D-47/D-76 C 层。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

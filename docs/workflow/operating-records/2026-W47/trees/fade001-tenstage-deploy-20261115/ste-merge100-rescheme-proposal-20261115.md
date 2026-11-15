# rubric 并盘 100 改形方案卷（STE 施工面拟·候 CTO 门禁验收）

- **seat**：STE（小柯）·施工面方案拟席（令面「重排方案=你席施工面拟·CTO 门禁验收」）
- **令面定谳**（CEO 直令 16:23:35·COS 值席分诊线 1 投递）：①主观题卷即出（已另卷落正形）②I 族由独立附加分面改**并入总盘**·客观+主观=100·客观族权重重排（联审栏 C ③「独立附加分面」定形被本令推翻）
- **安全阀**：并盘改形+完整预演须安全过 **23:30 冻结闸**——过不了回 **61.5 形**（=现役机判 65 分制归一化读数形态·W46 预演读数锚 c472d6713「40/65 归一 61.5」）候 CEO 再裁不硬赶
- **首拍锚 23:50 零动**护栏维持；改链护栏（候裁点 a）随本令定谳解除
- lastSyncedAt: 卷面时戳锚=git commit 时戳（D-47 增补款正形）

## §一 现役结构实锚（写前现查）

- rubric-firstshoot.json=list 八族 A-H：权重 A10/B10/C15/D10/E10/F15/G20/H10=100；机判域 B/C/D/E/G=65（二值判·pass=weight/fail=0）·采集域 A/F/H=35（score=null 值席采集）
- score_engine.py：`MACHINE_FAMILIES=("B","C","D","E","G")`/`MANUAL_FAMILIES=("A","F","H")` 常量；总分=**机判域归一化百分制**（denom=机判权重动态求和·numer=pass 族权重和·L315-318）；REDLINE_CAPS={"C":79,"G":59}（score_rubric 引·总分面红灯上限·权重无关）
- 归一化理由（engine docstring L42-43）：manual 域不可机判→出分母防「总分天花板恒 65」读数误导

## §二 权重重排方案（客观族 100→90·腾位 I 族 10）

| 案 | 形 | 判 |
|---|---|---|
| **乙 v2（荐）** | A10→**9** B10→**9** C15→**13** D10→**9** E10→**9** F15→**13** G20→**19** H10→**9**（=90）+I10=**100** | 整数制维持；**G 只动 1 分**（红灯 cap59 锚定族最小扰）；C/F 各-2（原 15 双高分采集/机判族均摊）；机判域 65→**63**·采集域 35→**31** |
| 甲·等比 0.9 | A9/B9/C13.5/D9/E9/F13.5/G18/H9 | 引小数违现役全整数制·判卷/汇总精度面复杂化——不荐 |
| 丙·G 单族腾 10 | G20→10 | 迁移链核心族动幅 50%·红灯 cap59 锚定族重扰——不荐 |

- 三档 80/60（裁决 C）**零动**（总盘仍 100）；REDLINE_CAPS C79/G59 **零动**（总分面 cap 与族权重解耦——engine 实锚 L322-324 cap 只对 total 施）。
- 族语义注：扣分落在各族「扣权重」不改判据面（reading_point/collection_cmd/verdict_rule 全零动）——I 族判据面=主观题卷正形（已落另卷）。

## §三 engine 域切换施工面（并盘的数学语义改·CTO 验收重点）

**语义变化实言**：现役总分=机判域归一化（采集 35 出分母补偿）；并盘 100 后 I 族+采集域均入总盘，归一化补偿设计**失效**——改形=总分改**三域直加制**：

```
total = 客观域原值（机判 numer 63 制 + 采集域得分 31 制） + I 族判卷得分（10 制） = 满 100
```

- **改动点三处（score_engine.py）**：
  1. `SUBJECTIVE_FAMILIES = ("I",)` 新增族集常量；I 族判读=state "subjective"/score=null（判卷面 subjective-score.json 供·采集面 manual 语义不混用——三域四态：machine/manual/subjective）
  2. 总分段（L315-318）：归一化除法→直加制 `total = Σ机判得分 + Σ采集得分 + Σ主观得分`（采集/主观未判时点=分层输出，见 3）
  3. 输出面分层（先例=score 三层分立 W46 G5 形）：`total_score`（已判部分原值和）+`total_pending`（pending 族权重和）+`total_projection`（满盘 100 制投影=总分构成透明化）+`domain_breakdown{machine, collection, subjective}`
- **零动面**：_JUDGES 五判据函数/T1 三断言/判据逻辑/REDLINE cap 施用点/verdict 定性（fail 面不变）/score_cli 四参契约
- **61.5 语义交接注**：改形后「机判域全过」读数=63/90 客观域原值呈现（非归一化 100 制）——首拍判读表若引用归一化读数形态须随改（联动面 §四.3）；预演读数对照基线=本卷 §五

## §四 联动面清单（改形波及全谱·逐项有着落）

1. **rubric-firstshoot.json**：八族权重数字改（§二乙 v2）+I 族列追加（family_id=I/family_name=主观题族·判断与规划质量/reading_point=subjective-score.json 判卷卷面/collection_cmd=判卷规程三件套（主观题卷 §判卷规程原文）/verdict_rule=初判+联审+终判卷 COS 三段/weight=10/close_layer=评分汇总窗/special_clause=判卷锚原句挂判）——考卷单真源改一处
2. **score_engine.py**：§三三处
3. **首拍判读表 v2**：读数语义行随改（归一化 61.5 形→直加制构成读数）——CTO 验收后随施工批同改（表主=COS/值席面·本席出对表建议行）
4. **score_cli.py**：I 族采集/判卷命令位（subjective-score.json 落卷链接）——契约四参零动·命令面 +判卷位
5. **单测族**：engine 判卷单测（T1 断言族/18 案对表系）随直加制改预期读数——施工批含单测同步改（禁删断言凑绿·期望校正双件套教义：字面校准留痕+正道可达 happy path 证明例）
6. **采集卷判据面**：A/F/H 采集域判据零动（仅权重数字随 §二）

## §五 完整预演计划（23:30 冻结闸安全阀）

- **预演对象**：改形后链全量——①rubric JSON 加载（I 族列/权重 100 合计断言）②engine 直加制判卷（复用 W46 预演 run 产物形态造测试 run_dir·机判+pending 分层读数）③score_cli 契约回归④单测族全量绿
- **预演读数锚**：改形前现役链先跑基线读数（改形前快照·回退对照面）→改形后预演读数→两读数对表入卷
- **闸判定**：预演全绿+读数自洽=过闸；任一红=停手回 61.5 形（git revert 改形笔·首拍锚零动保障）候 CEO 再裁
- **倒排**：NOW 方案卷报 CTO 门禁验收→验收过即施工（卷面+engine+单测一批）→预演→**23:00 前预演毕**（留 30min 缓冲）→毕报值席转线 2/线 3 事件链→23:30 闸→23:50 首拍锚

## §六 回退锚

- 改形笔（rubric JSON+engine+单测+判读表建议行）独立 commit 单笔族——`git revert` 一键回 61.5 形；首拍锚 jobs.json nextRunAtMs 零触（改形零涉采集/调度链）

## §七 使用依据

- CEO 直令 16:23:35（COS 值席分诊线 1·D-81 形投递）；设计卷 v2（ste-subjective-rubric-design-20261115·§三甲案被本令推翻沿革留痕）
- 现役实锚：rubric-firstshoot.json 写前现查/score_engine.py L77-79+L288-352/score_rubric.py REDLINE_CAPS L40-43
- 61.5 形锚：W46 daily c472d6713（40/65 归一 61.5 预演读数）+349fa91ff（61.5 两分成立）
- 主观题卷正形=同目录 ste-subjective-exam-paper-20261115.md（α 形态判据/checklist/规程/锚文本体）
- 护栏：期望校正双件套教义（禁删断言凑绿）/D-47 时戳锚/23:50 首拍锚零动

—— STE 小柯（m-ste·施工面方案拟席）·写前现查 〔commit 时戳锚〕

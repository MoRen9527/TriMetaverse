# CTO 技术规格卷·维度冻结（度量稳定性根解①）实现形（2026-11-23）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-dimension-freeze-spec-20261123.md·维度冻结规格正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 两决定（BOD 1450「维度冻结已收」）+本席分析卷（ab-trend §五 根解优先序①）

## §一 · 问题回顾（为何冻结）

Jaccard 实测 a=0.0%/b=1.5%（resume4 vs resume2）——LLM 每轮自创维度名 ⇒ 跨轮分数不可比（尺子每轮换）。根解①=**维度冻结**（固定维度表·LLM 只打分）。

## §二 · 实现形（四件）

**① 维度表件（正身）**：`TriCompany/runtime/cognition/fade001-dimensions-v1.json`
```json
{"version":"1.0.0","seats":{
  "cos":{"dimensions":[{"id":"cos-1","name":"<维度名>","definition":"<判据定义>","object_scope":"both"}]},
  "coo":{...},"cao":{...},"cpo":{...},"cto":{...},"cho":{...},"cfo":{...}}}
```
- 每席 **3-5 维**（CEO 框定「每席按本部门职能出≥3 评价维度」）·object_scope∈{A|B|both}；
- 维度设计依据=各席**部门职能**（非 LLM 随机产出挑选）——本席出 cto 席维度草案，其余各席自定（归各席域·我出 schema）。

**② 联审 prompt 改**（loop_joint_review_spawn）：给「本席维度表（id+name+definition）」→ LLM **只对给定维度打分 1-100**·**禁自创维度**（越表=fail-closed）。

**③ 输出 schema 强校验**：`{seat, object, dimensions:[{dimension_id, name, score}]}`——dimension_id 必须在表内（不在=fail-closed 拒）；聚合照 mean-of-seat-means（不变）。

**④ 版本化与可比性**：表 version 入 joint-review.json（`dimension_table_version`）；**同版本 comparability 恒 1.0**（工具自动证实）；**v1→v2 变更**：历史分标版本·跨版本不混比（趋势图注断点）。

## §三 · 测试面（四案）

①表 schema 校验（七席全·每席≥3 维）②越表维度=fail-closed 拒 ③同表两轮 comparability=1.0 案 ④聚合值确定性（同输入同分）。

## §四 · 边界与交付序

- **主路径**：本规格→COS 取号→FSD/SDE 落码（v1 表先落 schema+prompt 改+校验·各席维度内容随后填）；
- **各席维度内容**=各席域（我出 cto 席草案+v1 表 schema；其余候各席填·填前用占位维度不放行联审）；
- **回滚**：prompt/schema 双开关（表缺失=回落旧形自创维度+comparability 照记）；
- **风险**：维度设计质量=v1 表一次成型难——**接受 v1 不完美**（先冻结再优化·版本化支持 v2）。

## §五 · 使用依据

CEO 两决定（BOD 1450）+本席分析卷 §五（Jaccard 定量证+优先序）+FSD 小函数（b146829/6189036 comparability 工具）+D15/D24/D27v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T06:21:13Z（+0800=14:21）〔commit 时戳锚·D-47 正形〕

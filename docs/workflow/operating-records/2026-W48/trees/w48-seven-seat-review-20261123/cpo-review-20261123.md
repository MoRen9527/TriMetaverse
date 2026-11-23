# CPO 七席联审卷 · 两对象（本地面·冻结维度表 v1·cpo 四维）

- sourceOfTruth: 本件（W48 七席联审·CPO 席意见卷）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 令（COO 召集 2026-11-23T10:02:10Z=18:02+08·催件 18:04+08·COS 18:45 出稿）→本卷
- 维度表: 冻结 v1（`TriCompany/runtime/cognition/fade001-dimensions-v1.json`·status=ready·七席 31 维齐）——本卷用 **cpo 四维**（cpo-1/2/3/4）

## §零 · 对象字母反差勘（先对齐再判·防聚合错位）

- 召集信字母：**A=周迁移完成质量／B=fade-001 对协议遵循**。
- 标尺卷（CAO）冻结字母：**A=fade-001 实现规范度／B=周工作平面迁移质量**——**两字母相反**。
- 本卷处置：**以名称判分为准，字母按召集信映射输出**（防聚合双计/错位）；cpo 四维 object_scope 亦按名称挂靠（cpo-2=B-老字母=迁移质量→本卷 A；cpo-3=A-老字母=实现规范度→本卷 B）。

## §一 · 对象 A（周迁移完成质量）三维判读（cpo-1/2/4）

| 维 | 判读三分 | 实跑读数（evidence_ref） | 分 |
|---|---|---|---|
| cpo-1 需求-实现对齐度 | 部分符合 | W48 ignite run（exit0·push50f1a3911）树面两分正确（keep26+carry2=28 对表）；但顶层活件族四类零去向→人工补铸（W45补课 0b1c6eb1a／W47补铸 5f8d7abb0／W48补铸 fe668db4f=三连）——需求兑现靠人工兜底 | 55 |
| cpo-2 需求承载完整性 | 部分符合 | 现态齐：W48 池首铸（13 条批注全承·DEM-018 续号·fe668db4f）+task-inventory 首铸（COS 02:22）+todo-list 派生在卷；扣分=恢复靠人工补铸非迁移器（族点名判据未入迁移器·r12-CPO-01 候落码） | 60 |
| cpo-4 产品语义可判性 | 不符 | exam.json 仍无（全仓 find 零命中·18:02 现查）——考卷未接线；plan 逐案标签有 reason_codes 但兜底率高（run-mirror-124206Z：keep34 中 agent_output_malformed 24=70.6%）；族点名未入判据 | 45 |

**对象 A 分**：mean(55,60,45)=**53.33/100**

## §二 · 对象 B（fade-001 协议遵循/实现度）三维判读（cpo-1/3/4）

| 维 | 判读三分 | 实跑读数（evidence_ref） | 分 |
|---|---|---|---|
| cpo-1 需求-实现对齐度 | 部分符合 | 协议段产物/门件基本遵循（manifest 全段 pass·close 13 键·负例 exit4 门未泄漏）；但段 3 出题（协议核心件）未接线=需求未兑现 | 50 |
| cpo-3 评审形有效性 | 部分符合 | 维度表冻结 ready 七席 31 维齐（comparability 1.0 路径）；意见→charter 映射✓（r12 10 items·R12-CPO-01/02 在列）；rubric 扩四形落码✓（DP-016 a7e40af·我 2ceae9804 会签）；扣分=exam 出题面零件·score_skill 默认仍两席（`_DEFAULT_SEATS=("cos","coo")` 现码）·应答矩阵形缺 | 55 |
| cpo-4 产品语义可判性 | 不符 | 同 A 侧：exam.json 零件·语义题面未机械化·兜底标签未与拒判分离 | 45 |

**对象 B 分**：mean(50,55,45)=**50.00/100**

## §三 · breakdown 与分歧显式

| 对象 | cpo-1 | cpo-2 | cpo-3 | cpo-4 | 席分 |
|---|---|---|---|---|---|
| A 迁移质量 | 55 | 60 | — | 45 | **53.33** |
| B 协议遵循 | 50 | — | 55 | 45 | **50.00** |

- **与已收六席对照（分歧显式）**：COS A62/B58·CTO A72/B72·coo A60/B55·CFO A76.75/B79.75·CHO A69/B80.6·CAO A63/B60——本席 A53.33/B50 为最低档（差 5-30 分）。**分歧根=分母口径**：他席按「run 执行质量+协议件在位」；本席按「产品语义兑现（需求承载/语义可判）」——冻结维度表正是为消解此差而设，本卷已全维引表内 id。**禁抹平**：聚合请保逐席明细。
- 与 CEO 方向定调对表：「完整迁移（不迁不该迁/不漏该迁/智能应对 todo-list）」——不漏该迁=族点名判据未入迁移器（连三实锚），本席扣分主锚；「7 席不要过度设计」——本卷维度=既有冻结表零新增设计。
- **拒判**：本卷零拒判；cpo-4 两对象同分=同一证据面（exam 缺位）如实并列不重复计。

## 使用依据

- 冻结维度表 v1（七席 31 维·status=ready·18:02 现查）·cpo 四维=本席 14:22 填入（6f6361f 链内）
- 本席两先卷：B=迁移质量 49.0（a939a5a16）／A=实现规范度 50.5（1ab4d64a5）——本卷=按冻结表重述并更新至现态（补铸 fe668db4f·regex 落码 a7e40af·维度表 ready）
- run 实据：W48 ignite（sde-w48-ignite-closeout-20261123.md·counts 6202b5aa6）·run-mirror-124206Z 全件（plan reason_codes/rubric_report/score-skill/close）
- 代码现查：score_skill_spawn `_DEFAULT_SEATS=("cos","coo")`·exam.json 全仓零命中（18:02）
- r12 charter（10 items·意见 ID 映射）

—— CPO 小乔（m-cpo·W48 七席联审·本地面）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

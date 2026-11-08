# N-D1 分辨结论正身 · FADE-001 十段升档：跨实例通用件 vs FADE 实例个性化件

> **卷态注（2026-11-05T10:2xZ）**：本卷=CPO 侧独立判据底稿（先于对审落卷）。CTO 侧结论正身=同目录 `nd1-generic-vs-instance-verdict.md`（判据同构、三态换实例测试法更完备）——**正身载体以 CTO 卷为准，双署在 CTO 卷落**；本卷降为判据溯源底稿，不另立正身（一物一卷纪律）。CPO 对审意见两则一小补已经值席转 CTO 合卷。

- **令源**：W45 任务书（包D N-D1·先决节点）· CEO 2026-11-05 15:02 四令直裁+15:04 增补令（令 4 原文：「plan skill 是针对不同 fade 实例做不同规划的 skill，让 cpo 和 cto 考虑哪些是通用的，哪些是 fade 个性化的，出题和评分等其他环节也是一样，需要考虑」）· 值席 18:00 拾取派工
- **任务书**：`charter-w45-carryover-fade001-upgrade.md`（§二包D N-D1）
- **date 现查**：2026-11-05T10:05Z（+8=18:05 CST，初稿立卷时点）
- **双署**：CPO 小乔（产品侧裁定=已签，见 §三）· CTO 小狄（技术侧裁定+正身形态终裁=候签，槽位见 §五/§六）
- **下游**：N-D2 考卷冻结依本卷执行 · FSD N-D3 接线依本卷施工 · 报经值席转

## 一、分辨判据（总纲一句话）

**换一个 FADE 实例时必须重做/重写的东西＝实例个性化件；一个实例到另一个实例原样复用的东西＝跨实例通用件（机制骨架·一套）。**

立法基础=spec §2.8 分层模型正身：「协议层管不变量与产物合同（通用），实例层管载体选择与段-实现映射表声明（个性化）」——本卷即该分层模型在 001 十段升档五环节上的逐段落地。

**防复用陷阱（charter 原话入法）**：001 的九题≠011 的题面，不可直接复用——题面复制＝「自改考卷」的慢毒形式（spec §2.6 设计思路 1 的反面），禁。

## 二、五环节分辨表

### 1. Plan Skill（规划环节）

| 列 | 内容 |
|---|---|
| **通用件（一套复用）** | ① Plan 段合同不变量（spec §2.8）：结构化计划＝任务树分解＋两类卷封（原材料/语义作业方案）＋试卷声明（第三件 Plan 时点冻结件）；三不变量=Plan 时点冻结/DCE 期间不可变/收口对卷。② 协同作业不变量（spec §2.8 v2.0.6）：主负责 agent 任务书与 COS 协铸＋拆树与 COO 协定，不单打。③ Plan Skill runner（§8.5 TriLC/TriMC 共享 Plan/Close/Score Skill runner 的通用执行面）。 |
| **FADE-001 个性化件** | 001 自己的规划内容模板：五段链序声明（OP index→unresolved→trees→carry-over→通知，T2 段序）、翻周窗时点（周日 23:00 Asia/Shanghai）、在办树点名清单产出步骤、D-24 机位断言+三端回流+ff 前置断言清单。**换 011/002/003 这些全部要换。** |

### 2. 出题（考卷环节）

| 列 | 内容 |
|---|---|
| **通用件（一套复用）** | ① 试卷结构合同：`fade-assessment-paper` 逐项 schema（id/item/weight/verification/carrier）＋试卷模板（`fade-assessment-paper-template.md`）。② 固定部分构成（spec §2.6）：§1.1 工件清单＋实例专属规范文档＋测试集（CLI 必做工作+验证方法）＋治理对齐项。③ 双门槛结构：必选项全过（Score CLI 判）＋总分达标（阈值实例自声明）——**结构不可免，取值个性化**。④ 冻结仪式通用骨架：Plan 时点冻结三不变量＋双 hash raw/LF canonical＋authority（照 FADE-001-paper-maintenance.json 先例，即 N-D2 要跑的同一套）。⑤ 出卷方法指引（§2.6 出卷方法）。 |
| **FADE-001 个性化件** | **题面本体**：T1-T9 九题的题目/权重/验证方法/载体（001-paper-plane-shift.json 1.1-draft 卷）；及格线阈值执行值；scoreable_run 定义（一次完整周迁移触发轮）。每实例自己出题，题面互不复制。 |

### 3. 评分（Score CLI / Score Skill 环节）

| 列 | 内容 |
|---|---|
| **通用件（一套复用）** | ① 两段机制骨架：Score CLI 覆盖检查（遗漏检测→omission/required_all_passed·确定性可复算）＋Score Skill 逐项语义评定（score+evidence_ref，评定维度含治理对齐/内容归属）＋合并评分 JSON 合同（item/score/max/evidence_ref/omission+总分）。② 双门槛判定器（必选项门+总分门，§2.6）。③ 评分 runner 通用骨架——**可对齐 FADE-011 立法机制复用**（charter N-D3 明示；011 状态机件位的 runner 是现役最近的标准件）。 |
| **FADE-001 个性化件** | 评分判定细则：T1-T9 每题判定落点（T4 查 shift-ade.json status/from_week/to_week、T7 树目录对表、T8 ledger 对表、T9 非空壳断言等）、每题 carrier 声明（agent 核验/Score Skill/git log/daily-progress）、总分阈值执行值。 |

### 4. Verify（校验环节）

| 列 | 内容 |
|---|---|
| **通用件（一套复用）** | ① Verify 段合同不变量（spec §2.8）：独立于执行者的**后置**校验（可选段）。② 段位边界通用规则：前置门禁属 Qualify 机械门与 DCE 开工验卷（卷封制），不属 Verify——防段位混淆。③ Verify CLI 形态的确定性证据报告合同（结构化+非零退出码拒绝路径，§2.2 协议不变量）。 |
| **FADE-001 个性化件** | 001 的回读断言集（=T7/T8/T9 机械化，charter N-D3）：在办树点名清单 100% 到位对表、LG 系周指针随迁可溯、新周文件实质非空壳；核验对象=operating-records 目录结构与台账载体。 |

### 5. Close（收口环节）

| 列 | 内容 |
|---|---|
| **通用件（一套复用）** | ① Close 段骨架（spec §2.5）：Close Skill 语义终裁（四态词 APPROVED/FROZEN/ESCALATED/RETRY）→Close CLI 终态门（裁决格式/证据引用/source revision/状态转换/权限校验，校验失败=CLOSE_REJECTED 拒绝路径）→终态持久化+审计落账。② 「被裁决会话不得自证终值」（v1.4.1 CTO-F7）。③ 终态词表与状态机共享合同（§8.3：终态词表/幂等键/source revision/重试预算/checkpoint/审计 schema）。 |
| **FADE-001 个性化件** | 001 的收口载体与判据：shift-ade.json 升 run 收口文件（写四态词+登记册台账行，废「push 即终态」）；三态业务判据细则（评分过双门槛=通过、可重试失败=RETRY、需人裁=ESCALATED）；runId=周号幂等键（一周一 run）特化。 |

## 三、CPO 侧裁定（产品验收判据面·已签）

1. **判据总纲**（§一）作为本卷与后续实例分辨的复用判据——产品验收视角：通用件保证「评分可比、仪式一致、防自改考卷」，个性化件保证「每实例考自己的职责」；两者缺一即降档（通用件缺=评分不可跨 run 可比，个性化件缺=考卷失效或张冠李戴）。
2. **题面面**：001 九题卷按 1.1-draft 现卷进 N-D2 冻结，不增题不改权——题面变更属新一轮出卷（Plan 时点冻结纪律），不在本包范围。
3. **及格线面**：阈值取值归 001 自声明（spec §2.6），本卷不代定；N-D2 冻结卷所载值即执行值。
4. **验证路径面**：通用骨架「一套成立」的完成口径=接线（N-D3）+实测（N-D5 首个完整十段 run 评分通过）——落卷≠完成（spec §2.8 细则 10 立法完成度正身），未接线段按纸面法清单纪律标注。

## 四、跨切面裁定（施工输入）

- **状态机承载面**：机制层（§8.3 统一状态机+终态词表+幂等键+恢复锚四不变量）＝通用件一套；**承载位（河源 TriRMC 现 cron 位 vs TriMLC 011 状态机件位）＝实例层实现绑定，归 CTO 按活体现探裁定（charter 禁推定口径）**——本席产品侧仅约束：承载位选定后入 001 段-实现映射表声明（§2.8 细则 2），并守唯一写主纪律（§8.5 homeDomain/writeAuthority）。
- **段-实现映射表**：001 升档入册时按 §2.8 细则 2 最小 schema 三字段（段名/载体类型与形态/不变量满足证据引用）声明，通用件引用本卷节号+spec 条款，个性化件引用 001 题面卷与计划模板。

## 五、CTO 侧裁定（候签槽位）

- 槽 1 · 正身形态终裁（charter 委任 CTO）：本卷以独立分辨卷形态落卷（本席建议理由=一次跑完窗内不动 spec 版本仪式；结论稳定后可循正常版本流程沉淀入 spec）——**候 CTO 确认或改裁 spec 增补节**。
- 槽 2 · 状态机承载位活体现探结论（河源 cron 位 vs TriMLC 011 件位）——候 CTO 裁。
- 槽 3 · 通用 runner 承载与技术骨架补充（Score runner 对齐 011 的接线形态、Verify CLI 载体、Qualify 机械谓词实现面）——候 CTO 裁。

## 六、双署栏

- **CPO 小乔**：产品侧裁定如 §三/§四，2026-11-05T10:0xZ 签（初稿立卷）。
- **CTO 小狄**：§五三槽裁定后签认——签认即本卷转正身，报值席转呈。

## 依据链

- spec：`TriCompany/docs/engineering/fade-protocol-spec.md` §1.1/§2.1/§2.5/§2.6/§2.8（分层模型·十段合同速写·细则 2/10）/§8.3/§8.5
- 001 题面卷：`TriCompany/docs/engineering/fade-papers/FADE-001-paper-plane-shift.json`（1.1-draft）
- 001 冻结先例：`fade-papers/FADE-001-paper-maintenance.json`（双 hash 仪式先例）
- registry：`fade-registry.md` FADE-001 节（ADE-only 死工作定性+补课三件）、FADE-011 立法机制（W45 fade011-* 树）
- 任务书：`charter-w45-carryover-fade001-upgrade.md` §二包D N-D1/N-D3、§四边界纪律

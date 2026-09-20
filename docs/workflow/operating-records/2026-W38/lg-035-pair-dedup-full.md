# LG-035 一期③ 13 对文件去重对照表（全量 13 席）

- sourceOfTruth: 本文件（一期③件·全量交付；试点版=lg-035-pair-dedup-pilot.md 同目录）
- syncMode: frozen（交付窗；CTO 合同瘦身 diff 消费件）
- lastSyncedAt: 2026-09-14T19:00+0800
- 派工源: CTO 13:36 派工 + BOD 18:0x 裁定（试点 2 席 20:30 前/13 对全量 23:30 前——**全量提前交付**）
- 对照对象: `.claude/agents/<seat>.md`（agents 件） × `.claude/hub/<seat>.session.md`（hub 手册件）
- 规程: 「先收割再切断」（收割面结论见 §五）

## 一、方法（五源定位）

每段首句全文检索：**①agent-body**（五件套源）/ **②复合件**`<seat>.agent.md` / **③session-body** / **④agent-frontmatter** / **⑤管线常量**（渲染标记+M-001 注入）+ **⑥manifest extraSections**（host 附加段注入）。判定四态：重复/面独有/应归位/收割项。

## 二、13 席总表

| 席 | agents 段 | hub 段 | 双源分叉段（agent-body 缺） | hub 独有段数 | M-001 双段 | 收割项 |
|---|---|---|---|---|---|---|
| ceo-chief-of-staff | 16 | 23 | 3（当前原则/运行资产落点/层契约） | 7 | **✓（应归位）** | 0 |
| chief-administrative-officer | 17 | 21 | 3（同上） | 4 | — | 0 |
| chief-financial-officer | 17 | 21 | 3（同上） | 4 | — | 0 |
| chief-human-resources-officer | 17 | 24 | 3（同上） | 7 | **✓（应归位）** | 0 |
| chief-marketing-officer | 17 | 21 | 3（同上） | 4 | — | 0 |
| chief-operating-officer | 17 | 21 | 3（同上） | 4 | — | 0 |
| chief-product-officer | 15 | 19 | 3（同上） | 4 | — | 0 |
| chief-technology-officer | 16 | 19 | 3（同上） | 3 | — | 0 |
| customer-success-officer | 13 | 17 | **1（角色气质）** | 4 | — | 0 |
| deployment-engineer | 10 | 14 | **1（角色气质）** | 4 | — | 0 |
| full-stack-developer | 15 | 19 | 3（同上） | 4 | — | 0 |
| rd-trainer | 15 | 19 | 3（同上） | 4 | — | 0 |
| senior-test-engineer | 15 | 19 | 3（同上） | 4 | — | 0 |

**共同格局**：agents 件全部段 hub 同现（body 面间全重复=渲染设计）；hub 独有段=注入段（M-001）+会话面段（session-body 源）。

## 三、共性发现（F1-F6）

**F1 双源分叉（13 席全中，35 段缺口）**：渲染件全部段可命中**复合件**，但五件套 `agent-body.agent.md` **缺段**：11 席缺 3 段（`当前原则`/`运行资产落点`/`层契约`）+2 席（CSO/DE）缺 1 段（`角色气质`）→ **当前渲染实际源=复合件，agent-body 为落后分叉**。
**F2 注入段（第三源）**：M-001 状态条合同=管线常量注入 13 席；manifest `extraSections`=CFO/CMO/COO 三席「默认输出结构」注入（3/70 条，实锚 manifest 字段）——**两者均非席内内容，属管线设计**。
**F3 M-001 双段（2 席，应归位）**：CEO 席 hub L131-137（D-04 真源投影，管线注入）与 L165-168（"五字段"席内版）同题并存；CHO 席 L135-141 与 L173-176 同构。→ **M-001 单源=管线注入**，席内版删（如有差异先收割回管线段——本批核两版：内容重叠，以管线版为准）。
**F4 会话段命名不统一（13 席各异）**：`通信正名与时刻纪律`（FSD/CMO/COO/CSO/DE）／`启动恢复`（CEO/CHO）／`开场基线`（CFO）／`恢复/开场基线`（CPO）／`会话面基线`（STE）／`CAO 会话开场基线`（CAO）／`周平面 OP 记录`（CEO 附段）——**同功能异名**，瘦身候选（候 CTO 裁收敛口径）。
**F5 frontmatter 三源**（试点已载）：`agent-frontmatter.agent.md`=空壳／复合件 frontmatter（tools 已删 4f36617）／渲染件输出（旧渲染残留 `tools: [Read, Glob, Edit]`）——随重渲窗对齐。
**F6 面间重复=设计必然**：body 全段两面同现（同身份双面渲染），非冗余垃圾；如瘦身须改管线（不在本表建议面）。

## 四、瘦身 diff 消费清单（CTO 直接消费）

| # | 靶 | 建议 diff 动作 | 证据 |
|---|---|---|---|
| D1 | 双源收敛 | `agent-body.agent.md` 补 F1 所缺段（11 席 ×3 段 + CSO/DE ×1 段），以 agent-body 为唯一真源；复合件退役或降为指针（方向候裁） | §二表+§三 F1（全 13 席渲染件命中复合件/agent-body 零命中） |
| D2 | M-001 应归位 | CEO/CHO 两席 session-body 席内 M-001 版删除（管线版为准） | §三 F3（行号实证） |
| D3 | 会话段命名收敛 | 13 席会话面段名统一（候裁口径；现 7 种异名） | §三 F4 |
| D4 | frontmatter 对齐 | agent-frontmatter 空壳处置（填实投影——business-strategy 已有先例 pattern）+渲染件旧 tools 残留随重渲自消 | §三 F5 |

## 五、收割面结论（「先收割再切断」）

**全 13 席收割面=零项**：渲染件（agents+hub）全部段均可溯源至 源侧四件 ／ 管线常量（渲染标记+M-001）／ manifest extraSections ／ session-body——**无"渲染件有而全源无"的手改残留**。
→ **切断前置已满足**：手工拷贝链（若有）可直接切断；无待收割修正丢失风险。
（复核纪律注：聚合初扫曾报 CFO/CMO/COO「默认输出结构」三处源侧零命中——人工复核+全仓溯源后归因 manifest extraSections 注入（非收割项），伪阳性已纠正——「grep 无命中≠未落盘」纪律执行在卷。）

## 六、工具与复现

- 段级扫描脚本：`pair-report.py`（段切分+首句五源命中计数，13 席一键复跑）；聚合：`pair-aggregate.py`；原始输出：`.pair-raw.txt`（同目录）。
- 复现命令：`python pair-report.py > .pair-raw.txt`（脚本内 SEATS=13 席）。

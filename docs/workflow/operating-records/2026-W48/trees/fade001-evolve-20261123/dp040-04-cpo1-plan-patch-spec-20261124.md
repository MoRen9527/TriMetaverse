# DP-040-04 · T6 cpo-1 三对齐 + plan patch 供料（SDE 代执行件）

- sourceOfTruth: 本件（cpo-1 施工供料·三对齐落定+patch spec+断言 spec）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: COO DP-040-04（T4 门开 2026-11-24T03:10:40+0800）→本卷·**零点火零施工**（本件=方案+patch 供料·写面归 SDE）

## §一 · 三对齐落定（COO 派工三件逐项）

### ① loose==9 vs 现盘 8（missing_declared 定形）

- **定形**：`index_assertions.w48_loose_files` = **实盘 8 文件**（`.shift-ade.json`/OP json/OP unresolved/`cfo-quota-daily-w48.md`/`company-demand-pool.md`/`daily-progress.md`/`task-inventory-20261123.md`/`todo-list-20261123.md`，本席 22:2x 实盘）；`.shift-ade.prev.json` 入**同级键** `w48_missing_declared: [".shift-ade.prev.json"]`（W47 有 W48 无）。
- **断言形改写**（替代 charter 原文「len==9」）：`len(w48_loose_files)==len(实盘根文件集)` 且 `set(实盘)==set(OP.topLevelSupplement.items)`；`w48_missing_declared==[".shift-ade.prev.json"]` 或候 migrator 落 prev 后清空。
- **铁律**：**勿造件凑数**（造 `.shift-ade.prev.json` 假件=数据事故）。

### ② R-HY 写面（SDE 代执行）

- target：`/srv/fleet/TriRMC/fade001-runs/shift-W48-resume12-20261123T151900Z/plan.json`
- 分工：**本席供 patch spec+数据块+断言脚本（本卷 §三/§四）→ SDE 在 R-HY 执行**：改前 copy 为 `plan.pre-cpo-r12.json`+sha256 → apply → 跑断言 → 回读数（sha 前后+断言输出）。本席不持 R-HY 写通道。
- rollback 照 charter：`cp plan.json plan.pre-cpo-r12.json` + sha256 留档；失败恢复不重跑评分不投递。

### ③ disposition「missing」vs 池面状态——真源优先级（钉死）

- **池面（company-demand-pool.md）= 需求状态真源**；**plan.requirement_trace = 派生视图**（只读投影，不反向改池）。
- 冲突处置：trace 的 disposition 由池行状态**映射生成**（映射表 §三），任何不一致=生成器 bug 而非池错；trace 不得出现池面未有的「adopted/rejected」新裁决。
- 语义：「missing」只用于**池内行在 trace 缺失**的情形（覆盖缺口），不得作为对池行的再裁决。

## §二 · 实盘计数对表（charter 起草窗漂移如实报）

| 项 | charter 原写 | 现盘实锚（2026-11-24 03:1x） | 处置 |
|---|---|---|---|
| 根文件 | 9 | 8 + prev 缺（missing_declared） | 断言改集合式（§一①） |
| 未决项 | 19 条 | 表行 25（含多表；提取规则=「## 现役区」表行·**规则为准不硬数**） | 断言用提取规则 |
| task-inventory | 8 行 | 表行 10（同上·规则提取） | 同上 |
| 池 DEM | 005~017 十三条 | 13 ✓ | 直接对表 |
| trees | 10 目录 | 12 目录 | 已按实盘落 OP（c77ed4a59） |

## §三 · disposition 映射表（池→trace·生成器规则）

| 池行状态特征 | disposition | dest/owner/reason/evidence_ref |
|---|---|---|
| 含「CEO 批（…进下周开发任务）」 | adopted | dest=下一步任务书（DP 编号候取）；owner=执行归属案席；reason=CEO 批；evidence=池行锚 |
| 含「CEO 令现在就做」 | adopted | dest=当前施工线（fade-001 进化）；owner=执行席；reason=即时令 |
| 含「结项归档」 | adopted（终态） | dest=归档；reason=结项 |
| 含「留档确认」 | adopted（留档） | dest=留档；reason=确认 |
| 含「执行中」 | adopted（执行中） | dest=进化线在跑；reason=CEO 直令 |
| 池内存在但 trace 无行 | **missing** | reason=覆盖缺口（生成器待修） |

- 本批 13 行全有 CEO 批注→**预期 disposition 全 adopted**（其中 015=结项/016=铸条/017=执行中）；`missing` 仅作兜底档。
- 5 条 carry 字段（dest/owner/first_review/exit_criteria）：**plan 侧现值本席不可读**——SDE 按「carry_over 逐项清单」（r12-COO-01 已入前批）填；本席供字段语义：dest=去向周/面·owner=承接席·first_review=首次复检时点（周末评审/周一晨检）·exit_criteria=退出口径（销项/转任务/归档）。
- staffing.raci：删 3 条 W48-only、保留 4 条 W47、34 条 agent_readings 对齐——**机械替换件，SDE 按 set 断言校验**。

## §四 · 断言 spec（SDE 在 R-HY 跑·python3）

1. `set(index_assertions.w48_loose_files)==set(实盘根文件 8)`；`w48_missing_declared==[".shift-ade.prev.json"]`。
2. `requirement_trace` 覆盖池 DEM-005~017 十三条（id 集合相等）；每行 disposition∈{adopted,deferred,rejected,missing} 且 reason 非空。
3. 未决项/task-inventory：**按提取规则**（`## 现役区` 表行）条数相等（不硬编码 19/8）；todo-list 每行有 disposition+reason。
4. carry 5/5 四字段非空（dest/owner/first_review/exit_criteria）。
5. `len(raci)==len(agent_readings)` 且 `set(raci.item_id)=={r.item_id for r in agent_readings}`。

## 使用依据

- COO DP-040-04 派工（03:10:40+0800）·charter c1919c88a（cpo-1 五字段全文）·本席 c77ed4a59（OP 键面+plan-index-assertions）
- 实盘核验：W48 根 8 文件/trees 12 目录（22:2x·23:0x 两度实查）·池 DEM-005~017 十三条（池面批注全带）

—— CPO 小乔（m-cpo·供料件·零施工）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

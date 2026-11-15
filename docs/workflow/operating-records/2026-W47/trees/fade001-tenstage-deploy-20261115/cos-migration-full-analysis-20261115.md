# COS 全量搬移分析清单·W46→W47（CEO 14:26:37 裁决②·联审 COS 域输入·plan 段 agent 化输入正形·G5 预演对表真值）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W47/trees/fade001-tenstage-deploy-20261115/cos-migration-full-analysis-20261115.md·搬移全量判断清单正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 修正令 14:21:28（620 笔）→三点裁决 14:26:37（623 笔·裁决②=「不只是需求大表的问题·让 COS 分析哪些该搬哪些不该搬」）→七席联审令 14:29:49（624 笔·本件=联审 COS 域输入+总结卷素材）
- 用途三重: ①plan 段 agent 化的输入正形（判断面输出样例+处置族枚举）②G5 新链预演的判断面对表真值③联审总结卷 COS 域素材
- 落款: 2026-11-15T14:38:37+0800（写前现查·D-47 正形）

## §〇 核心结论（一段话）

迁移器（现役 plan 段死脚本）真实白名单=**仅 OP json+unresolved-items 两件**（W47 预演产物实证+git 溯源）；W46 平面的 demand-pool/daily-progress/cfo-quota/scoring-ledger 全部系**各席手动补课/立卷产物非迁移器搬运**（git 首笔逐件实锚见 §三）——「需求大表缺失」非本周孤立缺口，系**多周连续断档被人工补课掩盖的家族缺口**；agent 化的正解=把「周期滚动族白名单+新周件模板+活树判定+一次性件留置」的人肉判断铸进链，处置族五分类见 §一。

## §一 处置族五分类（判断面输出 family 枚举·与 CTO 契约 {family,confidence,reasons} 兼容）

| family | 语义 | 迁移动作 |
|---|---|---|
| `carry_periodic` | 周期滚动件（每周必续） | 迁移器搬运+dst 头部刷新（Wxx 参数化） |
| `new_week_templated` | 新周新件（周后缀参数化·内容 owner 席立） | 迁移器产骨架或仅记 absent 预期态·内容面归 owner 席惯例线 |
| `weekly_selfbuild` | 周期自建树（tick/巡查/运行面） | 不迁·新周自建（预期态非缺口） |
| `active_tree_ongoing` | 跨周续作活树 | 不迁文件·挂账台账线跨周承接（未完树≤1~2 阈值·W43 §五） |
| `one_shot` | 一次性毕报/评审/定稿/法证卷 | 不迁·历史冻结·跨周引用走 git 可溯路径 |

## §二 顶层文件逐件判断（W46 7 件→W47）

| # | 件 | family | confidence | 判断 | reasons（锚） |
|---|---|---|---|---|---|
| 1 | company-demand-pool.md | carry_periodic | HIGH | **该迁·W47 现缺** | W41 起连续在位（MIG-W41-demandpool 核销定谳「模板平移已执行且在用」）；W45/W46 两跳均断档后补课（W46 补课批 0b1c6eb1a「迁移断档补课照 W45 先例」11-12 11:31 实锚）——补课链=迁移器缺口的多周人工掩盖；CEO 已实锚本拍缺失 |
| 2 | OP-202611-W47-001.json | carry_periodic | HIGH | 已迁✓保持态 | 预演产物在位（createdAt 10:50:38Z）；继承链/dependsOn/nextWeekRef 正确 |
| 3 | OP-*.unresolved-items.md | carry_periodic | HIGH | 已迁✓+头部缺口 | 唯一真迁移器产物（W46 件首笔 6860bf87b「ops: weekly plane shift」11-09 17:24）；LG-072 三节结构「只动现役区」已铸 runbook——**缺口=W47 件头部残留「W45 未决事项」字样+继承链停 W45（W42 起 5 连实锚家族）**——agent 化顺修项（dst 头部刷新：标题/真源路径/lastSyncedAt/继承链四字段） |
| 4 | daily-progress.md | carry_periodic | HIGH | **该迁/新周承接·W47 现缺** | **当前周判定锚**（判定规则=含 daily-progress 的最大周名目录——W47 无此件则 23:50 后当前周判定断锚）；W46 件首笔=11-09 17:37 duty-cos「承接段骨架」手动建（迁移器零搬运实锚） |
| 5 | cfo-quota-daily-w46.md | new_week_templated | HIGH | W47 版新建·原件留置 | W46 件=11-13 CFO 手动立卷先例（58c6469d7「立W46日报件」）；周后缀参数化——w47 版候 CFO 惯例线（迁移器只记预期态） |
| 6 | scoring-ledger-w46.md | new_week_templated | HIGH | W47 版新建·原件留置 | W46 件=11-13 CHO 手动立卷先例（9767d07b9「W46账面立卷」）；w47 版候 CHO 惯例线（首拍评分窗前立） |
| 7 | W45 一次性件族（audit-latest×2/task-inventory/project-weekly/handoff json/runbook） | one_shot | MEDIUM | 不迁·维持先例 | W45→W46 迁移即未搬（W46 顶层零命中=先例在卷）；audit-latest 型=按需刷新非周期硬迁；runbook 型 SOP 属 workflow/ 真源域——零动作 |

## §三 trees 逐条判断（W46 35 条目=26 目录+10 散文件收敛）

| # | 条目（族） | family | confidence | 判断 | reasons |
|---|---|---|---|---|---|
| 8 | fade001-tenstage-deploy-20261115 | active_tree_ongoing | HIGH | 已迁✓（复制非移动） | W47 面已建（预演迁移产物·施工/联审现役位）；W46 原树留置=「迁移产物标记预演态归档不销毁」条款正形（dispatch-plan §四载明）——两处并存系设计内非重复 |
| 9 | mount-gate-build-20261111 | active_tree_ongoing | MEDIUM | 不迁·挂账承接 | cf153 勘修跟踪挂账线活跃（值席巡查拍顺手修·毕报+回落读数候到岸对账）；跟踪承接=台账线+巡查线非文件搬迁——树本体留 W46 历史 |
| 10 | bod-tick | weekly_selfbuild | HIGH | 不迁·新周自建 | W40-W46 每周新目录先例；W47 位 23:50 后值守线自建（预期态非缺口） |
| 11 | cos-patrol-timer | weekly_selfbuild | HIGH | 不迁·新周自建 | W42-W46 每周先例；巡查周期产物 |
| 12 | fade011-ew-runs | weekly_selfbuild | MEDIUM | 不迁·新周自建 | W45 同名树先例=每周新目录滚动 |
| 13 | fsd-sleepgap-probe-20261115 | one_shot | HIGH | 不迁 | 毕报链全收口（台账 614/615/617 笔·CTO 裁决+CAO 定性+销线毕） |
| 14 | 评审卷族 12 树（authgate/cao-gate/tree-gate-review/fade001-cto-review-20261109/phase1-review/phase2-review/split-review/ten-stage-review/tenstage-review-20261114/migration-review-20261109/plane-shift-review-20261109/weekly-shift-review） | one_shot | HIGH | 不迁 | 评审呈批件=一次性产出·历史冻结 |
| 15 | 施工树族 3（fade001-phase1-build-20261114/phase2-build-20261113/tenstage-impl-20261113） | one_shot | HIGH | 不迁 | 施工毕报+验收链收口；跨周引用走 git 可溯 |
| 16 | agentcore-lockfile-forensics-20261113 | one_shot | HIGH | 不迁 | 法证卷一次性 |
| 17 | fade011-openrun-20261110 / mount-log / p3-watch-probe-removal / fade001-failsafe-window-p1 | one_shot/ongoing 混 | LOW | 不迁（默认）+候对表 | 后两树状态面未亲勘（候选未完线）——候台账对表定性；默认不迁·若有未完线=挂账承接非搬迁 |
| 18 | 散文件族 10 件（d39勘止毕报/d82毕报/firstshoot-scoring-weights/phase1-trigger-study/ten-stage-mapping/ten-stage-product-plan/lg语义条款册/首评分卷-20261109/mc-oprec-pathspec-dispatch/fade规范对表-ceo修正令） | one_shot | HIGH | 不迁·两件例外注记 | 全部=毕报/呈批/定稿/派工单记录零迁；**例外①首评分卷-20261109.md=首拍评分考卷资产**——评分窗跨周引用（路径引用不搬迁）；**例外②fade规范对表（CAO 489df7329）+mc-oprec 派工单=今晚施工/跟踪活跃输入**——联审卷与台账线引用承接 |

## §四 W47 现势缺口清单（预演实锚·本拍后处置预告）

1. **company-demand-pool.md 缺**——首拍毕若新链 plan 段仍未搬→**本席照 W45/W46 先例补课批**（承续平移·git 可溯）——判读表注记面候 CTO dive 锚更新统一承载。
2. **daily-progress.md 缺**——首拍毕本席建 W47 承接段骨架（当前周判定锚修复）。
3. cfo-quota-daily-w47 / scoring-ledger-w47 缺——知会 CFO/CHO 新周立卷惯例线（迁移器预期态·owner 席内容面）。
4. bod-tick / cos-patrol-timer W47 位缺——weekly_selfbuild 预期态非缺口。
5. W47 unresolved 头部残留（W45 字样）——本席照 a+ 过渡缓解先例手动刷正（候 agent 化顺修后链自刷新）。
6. **e 锚（CAO b74a6b24f 实锚并入）**：W47 OP json `latestActiveWeek=true`+W46=false 翻转系 10:50 run **真写真平面**所致（dry_run=False·非预演隔离形）——23:50 正式拍将二写同面（幂等性候裁=CTO 域·总结卷单列必裁项）；判读面注记：本清单 §二/§三 对 W47 现势的「预演产物」定性照读数如实——真写语义下 W47 现势=实态非沙箱。

## §五 plan 段判断面设计建议（给 CTO 设计对表）

1. **输入源勿依赖 activeTrees 字段**——W46/W47 OP json 该字段均空置（周索引维护长期缺口）·建议 plan agent 判断面输入=实扫周平面目录清单+顶层文件名族识别+（可选）台账现役清单——目录实在性优先于索引字段。
2. **处置族五分类**（§一表）作为 family 枚举起点——低置信条目保守 keep 树（与 CTO 护栏一致·误封存可补救误迁移不可逆）。
3. **周期滚动族白名单参数化**：demand-pool（同名平移）+unresolved（同名平移+头部刷新）+daily-progress（承接骨架或平移）+OP json 继承——周后缀族（cfo-quota/scoring-ledger）记 new_week_templated 预期态不搬运。
4. **头部刷新并案**：unresolved dst 头四字段刷新（W42 起 5 连实锚）并入 agent 化施工面顺修。
5. **自检步建议**（COO 联审卷意见并入）：迁移完备性面级对账步=搬后 dst 与本清单 §二/§三 判定对表（本件即对表真值）。

## §六 证据链汇总

- W47 预演产物实勘：OP json（activeTrees 空/latestActiveWeek=true）+unresolved（头部残留）——本席 14:3x 实勘读数。
- git 溯源（vB 链首笔）：demand-pool=0b1c6eb1a（11-12 补课批）/daily-progress=9ed2e30e2+c6a325f4f（11-12/11-09 手动）/cfo-quota=63b61ffd4+58c6469d7（11-13 手动立）/scoring-ledger=40f7f1587+9767d07b9（11-13 手动立）/unresolved=6860bf87b（11-09 17:24 ops 迁移产物）。
- W45 先例链：MIG-W41-demandpool 核销定谳（W42 清淤批）+「迁移断档补课照 W45 先例」承续语（0b1c6eb1a）。
- 周目录清单实勘：W46 顶层 7 件+35 树条目/W47 现势 3 件+1 树/W45 顶层 11 件——ls 实录。
- 联审卷交叉锚（随收随并）：COO 7dd759c69/CFO 6d84cd871/CPO 2611f71e5（需求大表=W44 断档→W45 补课先例第二次同类缺口·族级漏判读·语义锚 36bf14a1d L44「有卷无考」根因）/CAO b74a6b24f（十三锚·e 锚 dry_run=False 真写实锚并入本卷 §四.6）——本席清单与四卷交叉验证零冲突·互补增量（CPO 族级点名/CAO 留痕面/COO 三态标注/CFO 成本上界）。

—— COS 小贾（m-cos·搬移全量分析·两职之一交付）·写前现查 2026-11-15T14:38:37+0800（date 现查原值·D-47 正形）

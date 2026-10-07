# CPO 任务盘点卷 · 本地规整→服务域流水线（CEO 13:24 令，答任务书施工件①）

- sourceOfTruth: 本件（CPO 面盘点清单正身；COO 汇总卷取材件）
- syncMode: final
- lastSyncedAt: 2026-10-07T05:31:15Z（13:31+08 周三，date 现查制；接令 13:26）
- 盘点位: CPO 小乔（m-cpo）
- 打包件任务书: 同树 `task-charter-cpo-batcha-doc-cleanup.md`（face: server-executable）

## 盘点结论（大白话）

手头活筛完：**可服务域执行打包 1 件**（批 A 文档面清洗——出讲解件 v2+plan v3，纯文档活材料全齐），**留本地 3 件**（各有依赖理由如实注）。记忆条清洗项现查**零命中=空集**（docs/memory/ 与项目记忆均无「策略卡」旧名，如实记不硬造活）。

## 筛出件（打包上服务域）

### 件 1 · 批 A 文档面清洗卷（讲解件 v2 + plan v3 出新版）

- **性质**：文档卷产出类，自含打包型——材料（改名全表 19+7 处、新 IA 分区结构、兜底卡文案、禁改九处）全在 cpo-product-design.md §3/§4，执行=读旧版刷新名+按新叙事料重组落新版文件。
- **触发门（机判自含）**：批 A 已落断言=TriModel 仓 `ui/index.html` 三读数（`grep -c '无法连接配置服务'` = 9 且「策略卡」用户可见面零残留+导航 label 两处=新名）。触发门不满足即挂起候触发，不硬做——清洗刷的是已落新态，批 A 未落时做了必出纸面漂移。
- **范围（现查实证）**：v1=trimodel-ceo-product-walkthrough-20261005.md（W41 根）；plan v2=trimodel-product-plan-9items-20261006.md（W41 根，含 P2 三件方案稿）。旧版历史卷不动，新版落 trimodel-strategy-revamp-01 树内（落点裁定见任务书）。
- **为什么适合服务域**：零本机交互链依赖（读仓内文件+grep 断言+写新文件+commit）；sg 侧同仓可达；批 A 落地后触发门即可判。
- **任务书**：`task-charter-cpo-batcha-doc-cleanup.md`（face: server-executable，M1 映射 TriMMC/TriRMC 拾取）。

## 留本地件（注理由，不打包）

| 件 | 状态 | 留本地理由 |
| --- | --- | --- |
| LG-066 双卷对表终化 | 已排 10-09 晚窗，候 BOD 认账转 COO | 依赖 BOD 认账输入信号（非自含）；对表终化=COO 对我卷执行，我方供料已闭无执行活 |
| 批 B 四条施工协同（10-08 窗） | 供料毕（裁决卷 cfcc055b+验收锚四条+CTO 双裁 04f97398 齐） | 施工面=FSD/STE 本机 UI 域；我方已无执行活，集成时对表即可，不立打包件 |
| C 条 daemon 缺口修协同 | CTO 已认领（10-09 后维护波首窗，判据钉=null 清除×tier2 降级梯交互） | owner=CTO；过渡期诚实注随批 B 先上=诚实兜底无空窗，我方无尾活 |

另注：产品度量北极星选型（职责域定义权活）非「手头在跑活」且需与 CTO 交互链 workshop，不盘点入打包，候排期另批。

## grep 现查读数（13:31，清洗面全量定性）

「策略卡」全仓现查（排除已收口历史周 W3x/W40）命中 14 件，逐一定性：

| 定性 | 件 | 处置 |
| --- | --- | --- |
| **活文档要刷（2）** | trimodel-ceo-product-walkthrough-20261005.md；trimodel-product-plan-9items-20261006.md | 出 v2/v3 新版（件 1 范围） |
| 引用合法不改（11） | cpo-product-design.md（改名全表本体，旧名=对照素材）；cpo-charter-reconciliation.md；cto-tech-design.md；fsd-batcha-construction-map-20261007.md（批 A 在跑施工件）；task-charter.md（trimodel 树，含禁改九处对照）；task-charter-lg058-remediation-20261006.md；ste-walkthrough-readout-20261006.md；tree-plan.md；lg058-ceo-walkthrough-9items-20261006.md；stage1/stage2 脚本（2 件） | 旧名系引用/对照/历史叙事，动了反而毁对照面 |
| append-only 流水不改（1） | daily-progress.md | 历史行冻结，未来行自然写新名 |
| 记忆面 | docs/memory/ + 项目记忆：**零命中** | 空集，如实记 |

## 使用依据

- 任务书 task-charter.md @ a8db08b1（CEO 13:24 令，施工件①/②+验收锚 1）
- cpo-product-design.md §3.2/§3.3/§4（改名全表 19+7/新分区/兜底文案/禁改九处）
- cpo-charter-reconciliation.md 补差①（「历史卷不追改 vs 现役活文档要刷」二分正身）
- grep 现查读数（本卷上表，禁锚点推定教训恪守——全量扫后逐件定性）
- CTO 双裁卷 04f97398（留本地件理由③依据）

—— CPO 小乔，2026-10-07 13:31 +0800（盘点毕；打包件任务书同树随本卷 commit）

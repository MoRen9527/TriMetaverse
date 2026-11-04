# docs-maintenance · 批 4a 施工收口卷（r1 基座勘正+畸形条·SDE）

- sourceOfTruth: 本卷（4a 施工收口正身·两仓 commit 锚+复扫读数）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 批 4 五族裁（2026-11-04T09:17:19Z·「r1 基座勘正形 ≈36 条=准（4a 即开）」+「TMV training README L44 畸形链接 1 条勘正（活索引面·并入 4a 同法）」）

## 一 · 施工读数（两仓两 commit·10 件 32 处替换）

| 仓 | 件数 | 处数 | 形 |
|---|---|---|---|
| TriMetaverse | 7 | 25 | tricompany.md 14（](../TriCompany/ 12 处升级+L24 docs/ 前缀剥 2）+socialfi mmd 2（docs/ 前缀剥）+execution fade 跨仓 8（../../→../../../）+training README 畸形 1（URL 尾巴错粘截除） |
| TriCompany | 3 | 7 | fade-tutorial 1（补 docs 层）+backfill OP 4（../→../../../）+backfill runtime 2（../→../../） |
| 合计 | **10 件** | **32 处** | 全机械相对层级差·零语义变更 |

- 畸形条修形：`./01-为什么需要-../../../tricompany.md`（URL 编码错粘形·生成器 bug）→`./01-为什么需要-tricompany.md`（同目录真目标·同族 02-05 URL 编码形跟随）。

## 二 · 质量门（全绿）

- **修前逐条目标 exists 断言**=26 项全 OK（含 W24 两件/runtime 两 py/TC engineering 四件/TMV docs 根三件）。
- **dry→apply 两段**：dry 抓 4 错（「三元宇宙」错字×2+OP 条层级脑算错×2——我重犯批 3 `../../` 层级错·exists 断言闸拦获防落盘）——勘正毕方 apply。
- **修后全谱复扫**：r1 面**零残留**；LIVE 残面=79（r3 8 候裁+r4 3 不动+r2 面 27 候 4b+TC IPD 树 41=r5 出圈）。
- **施工事故留痕（自纠毕）**：apply 脚本同文件多规则 cache 未更新=后规则覆盖前规则（tricompany.md 3 规则只落 1 行·git diff 实锚抓获）——10 件 checkout 全回滚→cache 更新修复→干净重 apply（13 规则全落 10 件·diff stat 17+10 行对表）。
- 计数差异注记：先呈卷 r1 计 ≈36 条为约数·**施工实测=32 处**（tricompany.md 14 处含 L24 两处 docs/ 剥形·r2 面 training/README 实数 17 条非 14——4b 施工以全谱逐条为准）。

## 三 · 使用依据

- CTO 批 4 五族裁（09:17:19Z·r1 准+r4 畸形并入 4a）
- 扫描脚本 sde-batch4-linkscan.py（修前修后双跑读数）·4a 脚本 sde-batch4a-fix-r1.py（Temp·dry 报告在档）
- 两仓 git diff --stat 对表（TMV 7 件 17 行·TC 3 件 10+8 行）

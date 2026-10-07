# 任务书 · 批 A 文档面清洗（讲解件 v2 + plan v3 出新版）

- sourceOfTruth: 本件（trees/local-svc-pipeline-link-01/task-charter-cpo-batcha-doc-cleanup.md）
- syncMode: static
- lastSyncedAt: 2026-10-07T05:31:15Z（13:31+08，date 现查制）
- 立书位: CPO 小乔（产品域收口 owner；母令=CEO 13:24 令经任务书 task-charter.md @ a8db08b1 施工件②）
- **face: server-executable（M1 映射：TriMMC/TriRMC 服务域拾取执行；零本机交互链依赖）**
- 执行位: sg 值席 MMC 拾取（或其指派执行席）；死线=无硬死线（候触发门，批 A 落地即 eligible；建议首笔全链实证取此件）

## 任务一句话

批 A 改名落地后，把两份含旧页名的现役产品卷出刷新版（讲解件 v2+plan v3），旧版历史卷不动，纸面与实现零漂移。

## 材料指针（全部在仓，零外链）

| 材料 | 位置 |
| --- | --- |
| 改名全表 19 处用户可见+7 处注释级 | `trees/trimodel-strategy-revamp-01/cpo-product-design.md` §3.3 |
| 新 IA 分区结构（页顶状态行+三区+方案附属块） | 同卷 §3.2 |
| 兜底模型卡叙事/文案/三态语义 | 同卷 §4.2/§4.3 |
| 禁改九处清单（报错文案对照） | 同卷 §3.3 尾 |
| 讲解件 v1（刷写底稿） | `operating-records/2026-W41/trimodel-ceo-product-walkthrough-20261005.md` |
| plan v2/P2 三件方案稿（刷写底稿） | `operating-records/2026-W41/trimodel-product-plan-9items-20261006.md` |
| 历史卷不追改 vs 活文档要刷二分正身 | `trees/trimodel-strategy-revamp-01/cpo-charter-reconciliation.md` 补差① |

## 执行步骤

1. **触发门（机判，不满足即挂起不硬做）**：TriModel 仓 `ui/index.html` 三读数全绿才开工——
   - `grep -c '无法连接配置服务' ui/index.html` **= 9**（禁改九处原样在）
   - `grep '策略卡' ui/index.html` 用户可见文案零残留（JS 注释级除外，判定法同批 A 验收锚）
   - 导航 label 两处=「模型策略」「兜底模型」
2. **出讲解件 v2**：以 v1 为底稿——旧页名按改名全表刷新；IA 描述段按 §3.2 新分区结构重述；兜底语义段按 §4.2/§4.3 叙事料更新。落 `trees/trimodel-strategy-revamp-01/trimodel-ceo-product-walkthrough-v2-20261007.md`，头部标注 supersedes v1+改名依据（cpo-product-design.md+批 A 施工 commit 锚）。
3. **出 plan v3**：以 plan v2 卷为底稿，P2 三件方案稿与正文表述按改名全表刷新。落 `trees/trimodel-strategy-revamp-01/trimodel-product-plan-v3-20261007.md`，头部同上标注。
4. **记忆条清洗注记**：docs/memory/ 与项目记忆「策略卡」现查零命中（CPO 盘点卷 13:31 已核）——执行时复扫一次，仍零命中则在回流卷记「空集复核毕」即可，禁硬造编辑。
5. **回流**：两新文件+回流读数卷（挂本树 `cpo-batcha-cleanup-readout.md`）一并 commit 推 origin dev；回流卷带四步读数（触发门三读数原文/两新文件路径行数/验收锚 grep 读数/commit 锚）。

## 验收锚

- [ ] 触发门三读数原文落回流卷（挂起态则记挂起理由，零半笔）
- [ ] v2/v3 内「策略卡」「连接配置」零残留——**唯一合法形态=改名对照引用**（如「原『策略卡』正名为『模型策略』」对照行）；执行席逐处定性落回流卷（对照引用 N 处/残留 0 处断言）
- [ ] 关键概念在场断言：v2 含「诚实三态」「联席心智」「只发配置不传话」；v3 含 P2 三件方案稿名实俱在（刷名不删项）
- [ ] 旧版两文件零改动（git diff 断言=v1/v2 卷在本任务零触碰）
- [ ] 新名一致性：v2/v3 中页名表述与 cpo-product-design.md §3.3 定账逐字一致（「模型策略」「兜底模型」；禁写「策略页」「兜底页」变体）

## 边界与纪律

- 本件**只刷文档面**，不触 TriModel 仓任何代码/UI 文件；不触批 A 在跑施工件（fsd-batcha-construction-map 等 11 件引用合法面，清单见盘点卷 grep 定性表）。
- 旧版历史卷零触碰（git 可溯即可，不搬家不标注退役）。
- 落点裁定（CPO 预裁，执行席不再议）：v2/v3 落 trimodel-strategy-revamp-01 树内——讲解件当前消费者=公司内部联席面，非 TriModel 对外用户文档；产品面真源位迁移候后续另批（「不吸收对外发布形态」红线对齐）。
- 时点纪律：报时 date 现查原值粘贴；commit 尾 Co-Authored-By 尾注；树路径守周目录禁仓库根。
- v2/v3 内容判断遇歧义（改名全表未覆盖的表述）：按「名字只编码产品概念」原则就近对表 §3.2/§4 叙事料，存疑处回流卷列歧义清单候 CPO 判，禁自行造名。

## 使用依据

- 母令 task-charter.md @ a8db08b1（CEO 13:24 令）施工件②+验收锚 1/3/4
- cpo-inventory-20261007.md（盘点卷，本件筛出依据）
- cpo-product-design.md §3/§4（材料正身）
- cpo-charter-reconciliation.md 补差①（二分正身）

—— CPO 小乔，2026-10-07 13:31 +0800（打包毕，供 COO 投递 sg 值席拾取；触发门候批 A 落地 16:00 后自然 eligible）

# FSD 波⑤ D1 修复卷 — TASK-TRIMODEL-RECOVERY-LADDER-01

- sourceOfTruth: 本件=FSD 席波⑤ 修复卷（派工=dispatch-wave5.md @ 99ef7487；修复锚=TriModel bc72ea4）
- syncMode: static
- lastSyncedAt: 2026-09-26T08:30Z
- 席位: FSD 小全（m-fsd）

## 修复面（三笔，最小缺陷修复零重构）

TriModel 仓 `ui/index.html` @ **bc72ea4**（diff=+4/-1）：

1. **删除 handler 接线**（L1290）：`delete tcStrategies[id]` 后补 `tcDeletedStrategyIds.push(id)`——对齐 tcDeletedModelSets（L1013）/tcDeletedRules（L1091）同构形态。
2. **PUT body 补通道行**（L892）：`deleted_strategy_ids: tcDeletedStrategyIds`——三 deleted_* 通道齐形态第四行；服务端通道 0b4ed36 已通，本笔闭合端到端。
3. **hydrate 清空**（L1382）：`tcDeletedStrategyIds = []`——对齐三实体族 L1380-1381 形态（保存成功后经 L913 `loadTrimmc()` 间接清，双通道同路）。

### 防重复语义对表（CTO 令③ 差异如实记卷）

- 双通道既有形态=**无显式防重复**（UI 行删除后重复点删不可达；服务端 delete 幂等无害）——对齐不加料（零扩散原则）。STE 边界案「重复删除同 id」预期语义：前端通道允许重复 push→服务端循环 delete 幂等+filter 透传→结果正确（合理语义注记候选）。
- entries 通道清空位差异：tcDeleted 走保存成功后清（L910），三实体族走 hydrate 清（L1380-1382）——策略随三实体族（同族同构），差异在案。

## 冻结面零扩散核验（CTO 令④）

- git diff --stat=1 file +4/-1，三笔全在删除通道面；活动守卫/服务端面/他域零触碰。

## 自测读数（三面）

1. **diff 面核验**：终版 diff 恰三笔+`active_strategy_id` 重复断言=1。**拦截记录**：PUT 笔首刀曾生 `active_strategy_id` 重复行（Edit 拼装失误），diff 面核验拦截即修——「写完了」与「可以交付」差距实证，面核验门价值在案。
2. **全量测试**：`npm test` → **276 tests / 271 pass / 0 fail / 5 skipped**（94s；skip 5 与基线同形，零回归）。
3. **内嵌 js 语法**：提取 `<script>` 块 49795B → `node --check` **SYNTAX PASS**。

## 边界与移交

- jsdom 首启链冒烟+非作者手测门+「删除→保存→reload→断言消失」真 reload 周期=STE 回头测面（案表 12 案候实弹）；本席自测面已尽（ui 内嵌 js 无 ts 测试 harness，语法+回归+diff 三面自证）。
- 使用依据：dispatch-wave5.md（99ef7487）/fsd-wave5-d1-survey.md（b91e8340）/CTO 放行令；真源行号以实勘报为准。

# SDE 部署面设计件 · FADE-011 维护动作层接线（裁定四要件→部署面落位）

- sourceOfTruth: 本件（SDE 部署面设计正身·接口提案候 FSD 注入器对表·CTO 施工单排程面）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COO 线 2 派工（CEO 15:42:16 双线直令·②即刻开工）·裁定正身=本树 cto-wiring-ruling.md
- 分工对表: 裁定 §四「FSD 主（管线任务注入器/队列扫描）+SDE 部署面（cron 慢通道接线）」——本件=SDE 面+driver 扫队接口提案（FSD 消费）

## §一 · 通道形态勘定结论（现役触发面两道）

| 触发形 | 实体 | 现态 |
|---|---|---|
| event-watch（指纹触发） | TriMLC src/fade/watch.ts（立窗毕转现役·六门禁 PASS·fade 全家 95/95） | **fail-closed 未接配置**（8713 现役零 TRILC_FADE_WATCH_* env=零扫描零触发·端点探针 enabled:false 显面） |
| cron 慢通道（定时触发） | fade011-daily-sweep job（8713 cron_mw1rdhym_7pwt·03:30 北京）+scripts/fade/fade-daily-sweep.local.mjs | **现役保自动**（CEO 13:19 裁·案件②修复态·明晨 03:30 天然测试点勿扰） |

**接线落位定谳（裁定 §二②「fade-w cron 慢通道扫队」）**：扫队逻辑挂 **driver plan 段**（PLANNING worker 入口）——cron job 与触发链**零变化**（本窗纪律⑤不动现役 cron job ✓·白名单**零变化**：零新脚本零新 job——接线全部收在 daemon driver 代码面=FSD 主面·本席部署面=队列实体+schema+消费条款）。

## §二 · 队列实体落位（本窗已交付）

- **schema**：`docs/workflow/fade011-maintenance-queue.schema.json`（JSON Schema draft 2020-12·objectType=FADE011_MAINTENANCE_QUEUE_ITEM·id=mq-YYYYMMDD-NNNN）
- **队列**：`docs/workflow/fade011-maintenance-queue.jsonl`（一行一条目·JSON Lines·**起账零条目**=机制心跳照旧）
- **登记制四源**（裁定 §二①·schema source 枚举）：batch-order/patrol-finding/rdt-content/survey-output+manual-dispatch（显式派工令入口）
- **护栏接线**（裁定 §二④）：①单波 N≤5=消费面取 min(5, pending)（条款在 schema description·实现归 FSD 扫队面）②敏感面排除清单=schema 条件校验硬门（sensitiveArea=true ⟹ source=manual-dispatch+explicitOrderRef 必填·JSON Schema allOf/if-then 面机械拦截）③队列空=空跑自检照旧（零 pending=driver 现行为零变化）

## §三 · driver 扫队接口提案（候 FSD 注入器对表·CTO 施工单排程）

1. **扫队点**：driver.ts plan worker（PLANNING 段）入口——读 `docs/workflow/fade011-maintenance-queue.jsonl`→filter status=pending→取 min(5, N) 条→**plan.md 真任务化**（任务列表注入·title+targets 逐条）→认领写回（status=claimed+claimedByRunId+claimedAt）
2. **写纪律**：共享 JSON 账本写法纪律（load→filter→dump 全程解析·禁文本行插入）+原子写形（temp+os.replace——防 event-watch/cron 双触发源并发撕裂）
3. **零 pending 分支**：现行为零变化（程序化 plan.md 照旧=机制心跳）
4. **终态回写**：run 收口后 done/rejected 回写（close worker 或编排层候 FSD 定）
5. **失败语义**：扫队 IO 失败=段失败不静默（FadeDriverError 同族·裁定面禁替身）

## §四 · 端到端验证计划（毕报门禁要件·依赖序如实标注）

- **候 FSD 注入器施工毕**（CTO 施工单排程面）：真任务实例登记入队→受控触发一发→plan.md 含真任务→拆树派工→席位改件→门禁→收口全链读数+空跑回归读数（队列空时机制心跳不变）
- **本窗交付边界**：队列实体+schema+设计件+白名单勘定（零变化）+四树勘定收口+S5 技术债复核——端到端读数**候接口就位**（如实标注非漏项）

## §五 · 回滚形

- 队列文件/schema 删除即回退（driver 接线前零代码耦合）；driver 侧接线（FSD 面）回滚=该 commit revert；job/白名单本窗零变化零回滚面。

## §六 · 使用依据

- cto-wiring-ruling.md（§一~四全要件）·coo-dispatch-dual-line-v1.0.md（线 2 ②④③+纪律五条）
- 现役件实勘：watch.ts（320 行·立窗现役）/driver.ts（L162-219 plan worker S5.1 真身接线现形）/store.ts（event-watch 面）/app.ts（watch 挂载 fail-closed）
- 纪律：CEO 13:19 保自动裁+席位勿手动跑 fade011（fade011-manual-run-ceo-channel-only.md）·共享 JSON 账本写法·D-46 值面零回显

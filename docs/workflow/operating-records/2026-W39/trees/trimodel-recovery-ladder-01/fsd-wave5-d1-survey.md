# FSD 波⑤ 前置实勘报（D1 现状勘定+留存卡清点） — TASK-TRIMODEL-RECOVERY-LADDER-01

- sourceOfTruth: 本件=FSD 席实勘报（CTO 派 2026-09-26 16:0x，只读快勘；范围定性候 CTO 裁）
- syncMode: static
- lastSyncedAt: 2026-09-26T08:25Z
- 席位: FSD 小全（m-fsd）

## 一、D1 修复现状勘定

**总判：服务端通道已通，断点纯在前端两笔未修——「纯回头测」会直接 FAIL（删除→保存→reload→复活），范围定性材料指向「修复+测」。**

### ① 前端 ui/index.html（TriModel 仓）——断点所在

- **删除 handler（现势 L1285-1290，tcRenderStrategyTable 内）**：`[data-del].onclick` 现状=活动守卫+`delete tcStrategies[id]`+重渲+脏标记——**零 push**，与 LG-035 走查实锤一致，未修。
- **PUT body（现势 L881-895，tcSave）**：`deleted_entry_ids: tcDeleted`（L886）/`deleted_model_set_ids`（L888）/`deleted_rule_ids`（L890）三通道齐全，**唯独无 `deleted_strategy_ids` 行**——PUT 不带字段，未修。
- **孤儿声明（L460）**：`let tcDeletedStrategyIds = []; // D19：删除的策略 id` 全文件仅此一处（零 push 零消费）——声明位已预留，修复即接线。
- **行号漂移注记**：令文所引 L441/L719-733/L1123-1128 系走查时行号，v4 三实体落地后已漂移（现势 L441=wireEyeToggle/L719-733=tcBadge/tcRender/L1123-1128=规则窗行域）；策略删除真身行号如上。

### ② 服务端 src/api/trimmc-card.ts——通道已在位

- **L157-166**：`deleted_strategy_ids` 删除通道完整（数组校验→活动策略守卫 400「活动策略使用中，请先切换」→delete→声明字段保留）。
- L130 strategies 字典浅合并 upsert（`{ ...base.strategies, ...card.strategies }`）——前端删而不声明→服务端基座 id 复活=走查实锤机制确认。
- 同构参照：deleted_model_set_ids（L139-147）/deleted_rule_ids（L148-155）/deleted_entry_ids（L168-174）。

### ③ 修复笔溯源

- **`0b4ed36`「增补件5 PUT 合并段 strategies/active_strategy_id/deleted_strategy_ids 三透传+校验前置+三测试——D7 缺口补」=服务端通道修复笔**（增补件5 只修了服务端透传面）。
- 前端无 strategy 删除通道修复笔（git log -S 全查）；`d20c6a6`（层1 schema v4 三实体落地+接线 405 修复）为 v4 结构笔非删除通道笔。
- 模型层双保险：src/trimmc-card.ts L209-217 `deleteStrategy()`（活动守卫+delete+push deleted_strategy_ids，CLI/程序面）——服务端两面全通。

### ④ 范围定性建议（候 CTO 裁）

**修复+测**：前端两小笔（L1287 del handler 加 push+L890 后 PUT body 加 `deleted_strategy_ids: tcDeletedStrategyIds` 行，另核 hydrate/load 时 tcDeletedStrategyIds 重置位与其他 tcDeleted 系对齐）+测试必含「删除→保存→reload→断言消失」完整持久周期（第四型盲区教训）+jsdom 首启链+非作者手测门（CTO 纪律预置五条照录）。

## 二、「CEO-走查临时」留存卡清点

**总判：留存卡实为不存在——B6 留存前提已不成立，线⑤清理项实为空操作（候裁销项）。**

- **B6 条溯源**：`lg035-walkthrough-restart-01/ste-walkthrough-segment3-ceo-window-checklist.md` L32——删除步【移除·CEO 21:11 令】归恢复线⑤，「CEO-走查临时」窗内不删随线⑤清理。
- **卡面实读（trimmc-card.json，TriModel 根，git-ignored 无 git 历史）**：
  - 现役卡（v4，status.at=2026-09-14T14:16:37Z=北京 22:16）：唯一策略=`st_mu1bth1f66s5a2`「时段切换策略」（created 同刻）；无「CEO-走查临时」。
  - 迁移备份（`.migration-backup-20260914-2101/`，v2，北京 21:01）：唯一策略=`s-hourly`「时段切换策略」（created 09-14T16:00+08:00）；无「CEO-走查临时」。
- **两面+git 全历史（-S）均无「CEO-走查临时」**。标注推断（卡 ignored 无历史不可再溯源）：走查当晚 B4 保存未落卡（405 缺口时段）或落卡后被当晚急修链覆盖；v2→v4 迁移仅重映射 s-hourly→st_ 新 id。
- 观察项顺带：现役卡 status=pending 自 09-14 挂 12 天未翻 applied（D2 应用回写未走/常态待勘）——不阻本笔，候裁是否入候办。

## 使用依据

- CTO 派工令 2026-09-26 16:0x（D1 前置实勘三点+留存卡清点）；wave4-closeout.md L45（前置实勘笔条款）
- TriModel 仓：ui/index.html / src/api/trimmc-card.ts / src/trimmc-card.ts 实读；git log -S 溯源
- trimmc-card.json + .migration-backup-20260914-2101/trimmc-card.json 实读
- ste-walkthrough-segment3-ceo-window-checklist.md（B6 条）

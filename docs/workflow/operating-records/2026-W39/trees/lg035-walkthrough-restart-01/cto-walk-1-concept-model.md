# 走查段①·概念建模对照（TASK-LG035-WALKTHROUGH-RESTART-01）

- sourceOfTruth: 本件（走查树段①读数正身）
- syncMode: final
- lastSyncedAt: 2026-09-25 20:0x +0800（date 现查 19:59:32）
- 走查对象: TriModel 实现树 `d012e1e`（ui/index.html + src/trimmc-card.ts + src/api/trimmc-card.ts + src/policy.ts + src/api/routes.ts）
- 对照真源: CEO 定谳原文（2026-W37 `lg-035-cpo-redesign-trimodel-ui-v3-addendum5.md` L13/L23）

## CEO 定谳原文锚

- 「策略 = {命名, 针对一个或多个模型, 规则组合} 的命名实体；卡 = 策略库 + 当前策略指针；切换 = 选策略名」（addendum5 L13）
- 「切换=选名字，绝不选模型条目」（addendum5 L23）

## 逐要素对照读数

| CEO 定谳要素 | 实现锚 | 读数 |
| --- | --- | --- |
| 策略=命名实体 | `StrategyEntity = {name, purpose?, model_set_id, rule_ids, created_at, updated_at}`（trimmc-card.ts L11 类型注释+L128）；前端同构（index.html L1158-1162） | **✓ 落地**。有命名（name 必填校验 L1151）、有身份（id）、可被指向（active_strategy_id 指针/策略表单编辑/规则引用） |
| 针对一个或多个模型 | 策略经 `model_set_id` 引用模型集；模型集=`{name, entry_ids≥1}`（勾选条目的命名分组） | **✓ 落地（引用式间接达成）**。符合 v4 终稿「引用式」形态；UI 强制模型集必选（L1153「请选择模型集」） |
| 规则组合 | `rule_ids: string[]` 多选规则（时段/默认/额度三型，index.html L210 多选勾选列表） | **✓ 落地**。三型规则实体齐（层2 段C） |
| 卡=策略库+当前策略指针 | `card.strategies: Record<id, StrategyEntity>`（库）+ `card.active_strategy_id: string \| null`（指针）（trimmc-card.ts L128/L131） | **✓ 落地**。库+指针双结构清晰 |
| 切换=选名字（绝不选条目） | UI 唯一切换入口=「活动策略」区策略下拉（`tc-strategy-sel`，选项=策略名 L1056）+「切换至选中策略」按钮；引擎侧 `handleApplyStrategy` 按指针 id 取策略展开规则（api/trimmc-card.ts L241-248） | **✓ 落地，全链选名字**。条目只在「模型信息」区管理、模型集只做勾选分组、规则只引用条目——**零「直接选模型条目」的切换旁路**存在 |

## 指针持久链（第四型盲区关注位）

切换→本地指针（L1171-1177）→「保存卡片」PUT `active_strategy_id`（L730）→服务端落卡（api/trimmc-card.ts L131 条件合入）→reload 后 loadTrimmc hydrate 回显（L1215）——**保存→reload→断言仍在完整周期闭环**，I5 spec 验收语义在实现面成立。

## 段①结论

**概念建模对照 PASS**——CEO 定谳五要素全数落地，零违背，零「选条目」旁路。

一处非建模面注记：切换确认反馈文案用策略 **id**（`已切换至策略 st_xxx`，index.html L1176）而非策略名——「选名字」语义下用户面反馈应显名字（详见段②术语族 T2）。

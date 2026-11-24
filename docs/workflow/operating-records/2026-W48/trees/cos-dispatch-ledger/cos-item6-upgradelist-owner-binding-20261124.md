# item6·RESTORED-1 落实：upgrade_list 逐条绑定主责席与责任面

- sourceOfTruth: 本卷（v8 item6 落实·upgrade_list 11 条绑主责）
- 数据源: `/srv/fleet/TriRMC/fade001-runs/shift-W48-resume18-20261124T120128Z/close.json` `upgrade_list`（**实读 11 条·非 12——BOD 报「12」差 1·候其源核**）
- 时点: 写前现查 2026-11-24T23:02+0800（D-47 原值）

## 实读现状（缺口）

**11 条全部 `owner=None`/`accountable=None`**——**这正是 item6 要修的**（upgrade_list 缺陷逐条绑主责席+责任面）。

## 绑主责表（11 条·COS 初判·候各席确认）

| # | 缺陷要点（摘要） | 主责席（accountable） | 责任面 | 依据 |
|---|---|---|---|---|
| 1 | plan.json `run_id`/`hard_clock/run_id`/`resume_dedup/key` 空 | **CTO** | runtime 状态面 | run_id 统一属 item5 同域 |
| 2 | verify.json `run_id=''`/`strict_mode=false`；5 项 checks | **CTO** | verify 链 | item1 同域 |
| 3 | score.json `families[8]` I 族 weight=10/reasons I1 | **CPO** | 评分口径 | 评分语义属 CPO |
| 4 | plan.json `split` 计数（tree_total=26/active=9/one_shot=16）不一致 | **COO** | 编排计数 | 树拆分面 |
| 5 | plan.json `families` 38 项中 **16 项 owner 缺失** | **CHO** | 责任归属 | owner 字段=RACI 面 |
| 6 | plan.json `split` top_level_moves=3/keep=5 与实际不符 | **COO** | 编排计数 | 同 #4 |
| 7 | plan.json `agent_readings` 34/34 无 anchor_label/confidence | **CPO** | 读数证据形 | 评分证据面 |
| 8 | plan.json `rollback_order` 形 | **CTO** | 回滚面 | 技术面 |
| 9 | plan.json `index_assertions` backfill/loose 计数 | **COO** | 索引断言 | 编排面 |
| 10 | dce.json `overflow_checks/2`（commit_message_shape）checked 形 | **CTO** | dce 面 | 技术面 |
| 11 | cost-log 2 行 `cost_channel=unavailable`/balance 空 | **CFO** | 成本面 | 成本口径 |

## 落账

- **本卷即台账**（dispatch-ledger 树·item6 落实记录）
- **候各席确认**（初判可改·候复）+**COO 台账侧验收**（其面配合位）

---
—— COS 小贾（m-cos·item6 落实）·写前现查 2026-11-24T23:02+0800（D-47 原值）

## 台账侧验收（COO·2026-11-24T23:04:30）

**结论=通过（11 条初判接受）**·COO 面接 #4/#6/#9 三件（编排/计数/索引面=其域）。

**两点补（入卷）**：
1. **#4+#6 合并修**（均 split 计数体系·同源·分两件=一处改两处验）——**施工时合并一件**。
2. **#9 与 CPO `plan-index-assertions-w48.json` v0 模板衔接**（compare_rule 对齐·不另起）。

**格式**：9 列表=可（dispatch-ledger 无特定列义要求·卷即台账照录）。
**实读 11 非 12**：差 1 候 BOD 源核照录。

---
—— COS 小贾·验收段 写前现查 2026-11-24T23:06+0800

# CTO 栏 A 十项对表裁决卷·plan skill 链内化覆盖面（COS 总结卷 1db8365b9 对表应答）

- sourceOfTruth: 本卷（W47 树 fade001-tenstage-deploy-20261115·栏 A 对表裁决正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS 开闸令 14:47:37（CEO 14:46:56 批总结卷·G2 前移即启）——栏 A 十项对表确认请求
- 席位: CTO 小狄（m-cto·施工面 owner）

## §一 · 逐项对表终形

| # | 项 | 裁定 | 承载 |
|---|---|---|---|
| ① | 盘面实勘输入勿依赖 activeTrees | **采认+施工增补**：plan_scope 现役 S=trees/ 目录实扫已是盘面实勘形 ✓；**增补=顶层文件清单实扫进判断面**（现役 plan_scope 零覆盖顶层 7 件域——demand-pool/daily-progress 五连断档=COS §〇 实锚·白名单内化=agent 化正解核心）| 笔 1 扩 |
| ② | 五分类枚举+低置信保守 keep | **采认·投影规则裁**（见 §二）·低置信保守 keep ✓（护栏二既定）| 笔 1+笔 3 |
| ③ | carry_over 三标注（状态/去向/死信风险）| ✓ 已覆盖（联审附款三·笔 1）| 笔 1 |
| ④ | 慢道树数上界 >15→skipped_over_limit | ✓ 已覆盖（附款一）| 笔 1 |
| ⑤ | closeout 冲突机械门 | ✓ 已覆盖（附款二）| 笔 1 |
| ⑥ | 未完树阈值 ≤1~2 入判据 | **采认**：active_tree_ongoing 判定时未完树计数>2→reasons 如实记——**判据面非闸面**（不拦停·违 W43 §五 纪律=如实上报候裁）| 笔 1 prompt+笔 3 案 |
| ⑦ | 迁移完备性自检步=面级对账 | **采认·判读面承载零施工笔**：G5 新链预演拍 plan.json vs **COS 清单卷对表**（真值在链 1db8365b9 系）+首拍后 COS 终判既定——跨面对账=判读行为不写链（写链=外部文件耦合违契约冻结）| G5 判读表增行 |
| ⑧ | dst 头部刷新四字段并案顺修 | **采认·新增施工笔 5**：shift_carry_over 现役只刷 2 字段（继承自/平移日期·weekly_plane_shift.py L82-91 实锚）——扩**标题/真源路径/lastSyncedAt/继承链**四字段（COS 清单卷 §二.3 定义·W42 起 5 连实锚家族顺修·首拍后 W47 unresolved 头部即正确）| **笔 5 新增** |
| ⑨ | 段间 handoff 物理投递确认语义 | **既有机制已承载·零新增施工笔**：close 段 summarize_stages 三态（absent/unreadable/verdict·FSD 实勘①）+段产物缺席=下游 fail 拦停=物理投递确认的机器形+run_state 段序记录既有——首拍判读表增「段产物在场三态」读数行；显式 ack 机制=候首拍后窗（23:50 前不扩改链面）| 判读表增行 |
| ⑩ | e 锚幂等保护形 | ✓ **已裁**（af86f74e6 14:48:14·全链幂等内建·零增施工笔）| 已闭环 |

## §二 · 五分类→契约三族投影规则（契约冻结·下游零波及）

plan.json 三族契约（migrate[]/keep[]/carry_over[]）**冻结不动**·agent 判断面 family 值域=五枚举（COS 清单卷 §一）·agent_readings 载原值+投影后族：

| COS family | 投影 | 语义标注 |
|---|---|---|
| `carry_periodic` | **migrate** | 真周期滚动件（OP json/unresolved/demand-pool/daily-progress 族）——迁移器搬运面 |
| `new_week_templated` | keep | 标 `expected_absent@<to_week>`——迁移器记预期态**零产骨架零产文件**（首版形·产骨架候首拍后窗·COS §四.3 处置预期同向）|
| `weekly_selfbuild` | keep | 标 `selfbuild_expected`（新周自建预期态非缺口）|
| `active_tree_ongoing` | keep | 标 `ongoing_ledger_handover`（树文件不迁·挂账台账线跨周承接——未完树≤1~2 判据挂靠）|
| `one_shot` | keep | 标 `one_shot_frozen`（历史冻结·git 可溯）|

**投影后 migrate 面语义收敛**：树级 migrate≈零（35 trees 全 keep/ongoing/one_shot/selfbuild——COS §三 逐条判断同向）·真迁移面=**顶层 carry_periodic 文件族**——与 COS §〇「迁移器真实白名单=OP json+unresolved 两件·其余系人工补课掩盖」实锚闭环。

## §三 · 施工笔序增补（FSD 增补令随发）

- **笔 1 扩**：顶层文件清单实扫进 _collect_evidence+agent 判断输入（顶层 7 件枚举判定·carry_periodic 白名单族识别）+未完树计数判据+五分类枚举值域。
- **笔 5 新增**：shift_carry_over dst 头部刷新 2→4 字段+测试案（头部残留零回归钉=「W45 未决事项」字样断言零残留）。
- **G2 17:00 毕线影响如实评估**：增补两件≈+1h 施工量——FSD 毕一笔报一笔读数再校准；**T1 检查点（G2 失守）兜底形态不变**（gate 失守→如实报 COS「首拍照旧现链」候 CEO·不硬赶）。

## 使用依据

- COS 总结卷 1db8365b9 栏 A 十项+COS 清单卷 §一五分类表/§二.3 四字段/§〇白名单实锚/§三 35 trees 逐条/§四处置预告/§五设计建议
- weekly_plane_shift.py L82-91（现役 2 字段实锚）·plan_scope.py（trees/ 域实锚）
- 本席设计定稿卷 c691cf007+联审附款 c398d7b0b+e 锚裁决卷 af86f74e6

——CTO 小狄（m-cto）·写前现查 2026-11-15T06:50:01Z（+8=14:50:01·date 现查原值·D-47 正形）

# E1 催办跨会话存续方案稿（v0 草稿·候实勘补值面）·2026-10-15

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/org-flow-target-20261014/coo-e1-escalation-persistence-draft-20261015.md
- syncMode: living（v0 草稿·候 8713 cron 能力面实勘+候 COS 会签）
- lastSyncedAt: 2026-10-15T09:31:57+08:00（date 现查原值·D-47 正形 A）
- 令源: CEO 15:58 批六项立项（E1 轻项）·联合盘点卷 §七 COS 补位②（E1 催办跨会话存续方案稿=COO 出稿）

## 一、问题定性（为什么催办要跨会话存续）

- 现役催办链两弱点：①催办挂常驻会话活性——席静默/会话重启窗内催办停摆（TD-obs-1 keeper 半死窗 30min 无巡检发现=同构实证）；②催办触发靠人记时点——督办读数三型中「窗毕型」有提醒 job 候批承接，「主动型」周一晨——周中逾期件无自动触发面。
- 目标态：逾期件催办不依赖任何单会话在活——触发面落 8713 cron（机器侧·7×24）·投递面走 M-004 直达。

## 二、方案骨架（v0）

1. **触发面**：TriMLC 8713 cron job（读台账督办字段/白名单登记面 windows 段 endReminder→比对时点→产出催办事件）——与 CTO 提醒 job 同基座异域（窗提醒域 vs 督办催办域·job 分立不混装）。
2. **投递面**：催办事件落文件面（operating-records 周目录催办箱）+SendMessage 直达受催席（M-004）——双面投递防单通道丢失（「已发≠在链」教训：落卷直达+commit 通知）。
3. **读数面**：催办触发记录回写催办箱日志（不回写台账——台账督办字段回写权仍在 COS·本席限督办字段建议）。
4. **权界**：job 只产催办读数/提醒——不握分派权/升级权（⑦ 权界沿续·催办建议单对 COS 无强制力）。

## 三、候实勘项（值面补齐前不动工）

- ① 8713 cron command 白名单现行集与追加流程（教训：ALLOWLIST 精确全串比对·command 任何变更含路径迁移=必 403 须追加+重启）；
- ② job 侧读台账的路径权限与解析面（台账=TriMetaverse 仓文件·8713 宿主 TriMLC 仓——跨仓读权限形态）；
- ③ 提醒 job 稿（CTO·候 CEO 终审）批后形态——E1 job 复用其读面/状态文件正形，避免同基座两套解析器；
- ④ addJob 后三查（POST 201+next_run 值面+enabled=1——F-3 家族性教训）入施工毕锚。

## 四、边界护栏

- 值面纪律 D-46：job command/日志禁含 token 值面（tail 前滤 `^command:`/`^runAs`）。
- 排工形态 D-23 v3：job 施工=addJob 非重启=直跑（随提醒 job 批后同形态）。
- 与提醒 job 域界：窗提醒=白名单窗 endReminder（CTO 面·schema windows 段）；催办=督办逾期触发（COO 面·台账督办字段）——两 job 分立·schema 不共用实例。

## 五、候会签面

- 本席稿（v0）：小营 2026-10-15T09:31:57+08:00（date 现查原值）
- COS 会签位（候）——实勘毕转 v1 再请会签。

## 使用依据

- 联合盘点卷 §七 COS 补位②；CEO 15:58 批六项立项；教训条（TriMLC/TriRLC addJob 行为分野 F-3/8713 白名单精确等值/D-46 值面/「已发≠在链」）；CTO 提醒 job 稿 docs/execution/window-reminder-job-plan-20261014.md（同基座参照·候 CEO 终审）。

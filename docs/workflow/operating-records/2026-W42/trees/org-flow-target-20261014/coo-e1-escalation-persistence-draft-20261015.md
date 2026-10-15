# E1 催办跨会话存续方案稿（v1·实勘毕候会签）·2026-10-15

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/org-flow-target-20261014/coo-e1-escalation-persistence-draft-20261015.md
- syncMode: living（v1 实勘毕·候 COS 会签）
- lastSyncedAt: 2026-10-15T09:56:02+08:00（date 现查原值·D-47 正形 A）
- 令源: CEO 15:58 批六项立项（E1 轻项）·联合盘点卷 §七 COS 补位②（E1 催办跨会话存续方案稿=COO 出稿）

## 一、问题定性（为什么催办要跨会话存续）

- 现役催办链两弱点：①催办挂常驻会话活性——席静默/会话重启窗内催办停摆（TD-obs-1 keeper 半死窗 30min 无巡检发现=同构实证）；②催办触发靠人记时点——督办读数三型中「窗毕型」有提醒 job 候批承接，「主动型」周一晨——周中逾期件无自动触发面。
- 目标态：逾期件催办不依赖任何单会话在活——触发面落 8713 cron（机器侧·7×24）·投递面走 M-004 直达。

## 二、方案骨架（v0）

1. **触发面**：TriMLC 8713 cron job（读台账督办字段/白名单登记面 windows 段 endReminder→比对时点→产出催办事件）——与 CTO 提醒 job 同基座异域（窗提醒域 vs 督办催办域·job 分立不混装）。
2. **投递面**：催办事件落文件面（operating-records 周目录催办箱）+SendMessage 直达受催席（M-004）——双面投递防单通道丢失（「已发≠在链」教训：落卷直达+commit 通知）。
3. **读数面**：催办触发记录回写催办箱日志（不回写台账——台账督办字段回写权仍在 COS·本席限督办字段建议）。
4. **权界**：job 只产催办读数/提醒——不握分派权/升级权（⑦ 权界沿续·催办建议单对 COS 无强制力）。

## 三、实勘记录（v1·2026-10-15 09:52-09:56 本席活体+启动器直读）

- ① **白名单现行集=15 条**（`$LOCALAPPDATA/trimlc-daemon-channel.cmd` TRILC_CRON_COMMAND_ALLOWLIST 精确全串在案）——含 `window-dispatch-remind.mjs`（ops-local 位）=**提醒 job 步1 command 位免追加**；E1 job 若用新脚本位（如 `scripts/fade/coo-escalation-*.mjs`）须白名单追加+重启窗（D-23 白名单①类·教训：ALLOWLIST 变更=必追加+重启）；**E1 v1 设计取复用现有形态**（见 §五施程序）规避追加面。
- ② **跨仓读权限无障碍**（启动器实证）：8713 现役已直读 TriMetaverse 仓文件（TRIMC_NOTIFY_SEATS_FILE=D:\Code\ai\TriMetaverse\.claude\seats.json+白名单脚本全绝对路径指 TriMetaverse）——E1 job 读台账/白名单登记面同形态可行；DATA_DIR=$LOCALAPPDATA/trilc-channel（fork 前缀实证·非 trimlc-channel——探库先对 DATA_DIR 教训再证）。
- ③ 提醒 job 批后形态——**候 CEO 终审**（批后 E1 job 施工与其同窗对表读面/状态文件正形·本稿先行设计·施工候批）。
- ④ addJob 三查（POST 201+next_run 值面+enabled=1——F-3 家族性教训）入施工毕锚（§五）。

## 四、边界护栏

- 值面纪律 D-46：job command/日志禁含 token 值面（tail 前滤 `^command:`/`^runAs`）。
- 排工形态 D-23 v3：job 施工=addJob 非重启=直跑（随提醒 job 批后同形态）。
- 与提醒 job 域界：窗提醒=白名单窗 endReminder（CTO 面·schema windows 段）；催办=督办逾期触发（COO 面·台账督办字段）——两 job 分立·schema 不共用实例。

## 五、施程序与毕锚（v1）

1. **施工位**：脚本位取 `scripts/fade/` 新件（E1 专用催办扫描器·白名单追加+重启窗一笔——**或**候提醒 job 批后对表若其读面可复用则并入其 job 减一 job——批后对表定）。
2. **施工时机**：候提醒 job 步1 批后（CEO 终审）同窗对表施工——不抢批前窗。
3. **施工毕锚四查**：①addJob POST 201 ②next_run 值面非空（F-3 家族性：201≠会触发）③enabled=1 ④首轮触发后 channel.log 出现行（滤 token 后读）。
4. **回滚锚**：job 停用（enabled=0）即回旧态——催办面回 COS 催办链人工形态。

## 六、候会签面

- 本席稿（v1 实勘毕）：小营 2026-10-15T09:56:02+08:00（date 现查原值）
- COS 会签位（候）：按 A1 会签生效判据执行。

## 使用依据

- 联合盘点卷 §七 COS 补位②；CEO 15:58 批六项立项；教训条（TriMLC/TriRLC addJob 行为分野 F-3/8713 白名单精确等值/D-46 值面/「已发≠在链」）；CTO 提醒 job 稿 docs/execution/window-reminder-job-plan-20261014.md（同基座参照·候 CEO 终审）。

# SDE 64 拍终态读数+DEM-009 P1 cron 造件卷（exit 4 设计内态定谳·CTO 计数语义承录·P1 三查）

- sourceOfTruth: 本卷（trees/shot64-dem009-20261123/sde-shot64-readings-dem009-p1-20261123.md·64 拍读数+P1 造件正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=本席预守（拍前核 23:35/起跑核 00:05）+COO DEM-009 P1 派工（落款 2026-11-22T13:37:58Z·P1 照 23:50 后做）+CTO 判读回（exit 4 裁+计数语义裁）
- 判定: **64 拍=exit 4 awaiting-ruling 设计内态（非故障·W46 轮候裁 78.7h>72h fail-closed 不进 W48 轮）·供给面 supply-green/deepseek-flash 首验绿·DEM-009 P1 cron 造件成（201·nextRun=2026-11-23T01:00:00Z=今晨 09:00 CST·三查全绿）**

## §一 · 64 拍终态读数（2026-11-22T15:50:00Z 起跑）

- 起跑→13s 终：`runningAtMs=None`·`lastRunStatus=error`·consec **5→6**·runCount **64**·`nextRunAtMs=2026-11-29T15:50:00Z`（下周日）。
- **lastError 全文**：`command exited with code 4: [shift_notify_fail] exit=4 awaiting-ruling 挂起（设计内态·静默 log——零 SMTP·催办语义=轮间门 gate 72h 催办面单值源·F1 补丁形 B）`。
- **preflight.json 实锚**：prev_run=shift-W46-20261119T090551Z·`prev_run_age_h=78.7`·`escalated=true`·`escalate_notify_failures=[]`→**fail-closed 无裁决不进 W48 轮**（设计语义：cron 下窗再探）。
- **供给面**：`model_supply={ok:true, state=supply-green, model=deepseek-flash, delta_len=2}`——TriRMC 切 DS 后首个迁移供给面读数=绿。
- run dir：`shift-W47-20261122T155000Z`（manifest+preflight 两件）；pregate 23:40 首跑成（arrival+t10-inventory）。
- 兜底树面：W46/W47 `shift-fail-*=0`·`cos-urgent-mailbox=0`——exit 4 静默设计=非 fail 不产标记（P0 判据分野正面验证·CTO 判读回）。
- healthz：ok=true·cron jobCount=6（造件前）·degraded=true·consecutiveFailures=6。

## §二 · CTO 判读承录（exit 4 定谳+计数语义裁）

1. **exit 4=awaiting-ruling=设计内态确认**（非故障·不冒进）——P0 判据分野正面验证（段级 fail 才触发告警）。
2. **计数语义裁=exit 4 不应计入 consecutiveErrors（要改·小件候后续批）**：正形=exit 0=ok／**4=awaiting-ruling 独立态（不增不清计数）**／其他=error；理由=设计内态计入→degraded 假信号污染（监控红≠真红镜像）。**今晚如实档 consec=6 含设计内态·不虚报已修**；实现位=TriRMC cron 面或迁移器 exit 映射（需勘·后续批）。
3. 解除阻流=**W46 轮裁决（CEO/COS 域）**·超时升级机制工作正常（78.7h 触发 escalated）。

## §三 · DEM-009 P1 cron 造件（TriRMC 8710·addJob 热生效）

- **CREATE http=201**·id=`c8b5bee5-b2b6-4848-83aa-70cae74634b1`·name=**dem009-monday-migration-check**。
- **三查**：①id 落库 ✓（jobs_n 6→7）②`enabled=True`·cron=`0 9 * * 1`·tz=Asia/Shanghai·**nextRunUtc=2026-11-23T01:00:00Z（今晨 09:00 CST 首跑）** ③payload 键=[command,cwd]·**runAs 零命中** ✓·cmd_len=1648（内联 python·PYCHK 标记在位）。
- **ALLOWLIST 面**：TriRMC cron 面**无 command 白名单**（allowlist 仅 agent-loop 层·源面实证）→**纯 addJob API 热生效·零 daemon 重启**（COO 窗口约束天然满足）。
- **job 内容**：查 weekly-plane-shift 终态（lastRunStatus==ok 且 lastRunAt ≤8 天内=正常；否则异常）→异常经 `_notify_blocking`（dual-address SMTP·信到人）+上下文读数 → exit 9（告警已发）/exit 5（告警发不出）/exit 0（正常静默）。
- **首跑预告（如实档）**：现态 error/awaiting-ruling → 今晨 09:00 首跑**预计触发告警**（SMTP 至 COS·属设计功能：周迁移终态异常催办）——除非 W46 裁决+补跑在 09:00 前落定转 ok。

## §四 · 护栏遵守

只读核+授权写面（addJob=COO 派工件·零 daemon 重启·零 ALLOWLIST 追加）✓｜D-46（token 变量读入零回显·值面零打印）✓｜D-47（落款=date 现查原值）✓｜造件后三查（id/next_run/enabled+runAs 断言）✓｜P1 时序遵令（23:50 后做）✓｜深读预守提醒事后撤（诊断完成·CronDelete 90e94f8d）✓。

## §五 · 使用依据

- COO DEM-009 P1 派工（cron 三折纪律：ALLOWLIST/addJob API/禁 runAs/三查）+CTO 判读回（exit 4 裁+计数语义裁）+FSD 承录
- 活体：jobs API 两拍读数+journalctl 23:45-00:05 段+job log 全文（1518 行形）+preflight.json+run dir 清单+兜底树面 find+pregate run dir+POST 201 响应
- 派生卷：sde-wpshift-rc2-diagnosis-20261120.md（62 拍深勘谱）+sde-dem009-p0-rhy-deploy-20261122.md（P0 部署）
- D-24/D-46/D-47

## §六 · W48 补跑尝试与两裁留档（Sunday 门阻·裁=b 候 11-29）

- **补跑尝试（COO GO 后即刻·17:50Z）**：手工触发 POST .../run body force → ran=true·**exit 2 止于 preflight week_math 门**（`trigger day 2026-11-23 is not Sunday·时点挪动错周防线`·sunday_gate=enforced）·run_dir=shift-W47-20261122T175025Z·consec 6→7。
- **六项绿**：hostname/git_hygiene/healthz/diverge/**ceo_ruling=continue ✓**（件 sha=3a63befc 被门正确消费·carry_over 承接态）/model_supply=supply-green（deepseek-flash）。
- **旁路勘定**：`--loop-window`=周日门豁免旗（法源=CEO 23:55 令·进化循环轮），**help 明文「真实 cron 迁移禁带此旗」**→真迁移周一补跑**无合规旁路**·本席未擅带旗（边界纪律）。
- **两裁（同面）**：**COO 裁=b**（候 11-29 正式窗·sunday_gate 防线不破·赶首日窗不值破防线·ruling 件常驻 11-29 拍直接消费）；**CTO 裁=b+c·a 否**（a 技术驳三点=旗语义污染/门存在理由/需 CEO 改设计禁区成本高；c=gate 增 **manual-补跑 mode** 候后续批·设计要件=CEO 授权形+审计留痕+门语义分层）。
- **留档**：ruling 件 continue 在位（文件常驻·未消耗式读取）·job enabled·nextRun=11-29T15:50Z；W48 树本周不建（工作照做·todo 首验延 11-29 如实呈 CEO）。
- **教训（自领·CTO 承录入族谱）**：门类校验必取 `verdict`+`exit_code` 字段，**禁 tail 截断**（本拍初验只 tail 未见 verdict 行=假判；「截断伪影族」新面·与「监控绿≠任务活」「已修≠已传播」同深层读数面失真族）。

—— SDE 小布（m-sde·64 拍终态读数+exit 4 定谳承录+P1 cron 造件三查全绿+W48 补跑尝试/两裁留档）·写前现查 2026-11-22T17:52:12Z（+8=2026-11-23 01:52:12·date 现查原值·D-47 正形）

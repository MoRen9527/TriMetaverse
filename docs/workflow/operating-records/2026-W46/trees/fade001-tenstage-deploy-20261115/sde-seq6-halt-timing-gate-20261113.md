# SDE 序 6 HALT 勘定记录·时点错位硬约束（周五手动拍必被周日门禁段 1 拦停）

- sourceOfTruth: 本卷（fade001-tenstage-deploy-20261115 树·序 6 HALT 勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 触发: COS 序 6 触发令（22:30:34+08·序 5 换锚毕 e672f3f50）→本席开跑前置勘定发现硬约束→HALT 不跑
- 呈报: CTO 技术裁定+COO 节拍知会+COS 工序面/呈批链三封并发（发前现查 2026-11-13T14:37:53Z·发毕 14:38:27Z 对表平）

## §一 · 源码级三环实锚

1. **TriRMC token 替换（在役验证）**：`src/cron/command-handler.ts` handleCommandJob——spawn 前 `payload.command.replace(WEEK_TOKEN_RE, tokens)`·`computeWeekShiftTokens()` 按 now 算·**tomorrow 逻辑**（week-math.ts：toWeek=明日所在 ISO 周·fromWeek=toWeek−1·startDate=明日所在周周一）。dist 在役验证：`dist/src/cron/command-handler.js` L33-34 同逻辑·mtime=2026-11-13 17:02:38+08（phase2 勘修窗后重建）·ExecStart=node dist/src/index.js。手动 runJob 与 cron 拍同链路（service.ts runJob→handler）。
2. **TC preflight 周门禁（0f1fa1f 在役）**：`check_week_math`（preflight.py L90-112）——`is_sunday = today.isoweekday() == 7`·`ok = is_sunday and tokens_match`·非周日 reason=「trigger day … is not Sunday (tomorrow=Monday boundary violated — 时点挪动错周防线)」·**无 escape flag**（--skip-hostname/--no-diverge 均不涉周门禁）。
3. **门禁消费与链断形**：`run_preflight`（L219+）——reasons 非空→exit_code=2（diverge 优先=3）→payload 段 1 `|| RC=$?` 捕获→manifest 记 preflight_exit=2→`exit $RC`→set -e 链断→trap notify_fail 兜底→arrival 不落→runJob 捕获→lastRunStatus=error+ce+1。

## §二 · 活体读数（现算验证）

- `node dist/src/cron/week-math.js` 活体现算（时点锚=本席 HALT 呈报发前现查 2026-11-13T14:37:53Z 同窗·相对序=COS 触发令后呈报前）：`{"fromWeek":"W45","toWeek":"W46","startDate":"2026-11-09"}`——**非 W46→W47**。
- 周日拍对照推演：now=周日→tomorrow=周一→toWeek=W47·fromWeek=W46·startDate=2026-11-16+is_sunday=True+tokens 自然匹配→preflight 过闸→**十阶段全链可走**。
- 周日 23:50 cron 真拍同此形（真拍语义自洽——晚拍与白天窗预演同 token·不冲突）。

## §三 · HALT 判定与现势

- **HALT 正形**：今晚照跑=段 1 必拦停（零生产面扰动——preflight 只读断言·W46 现役树动前即拦）+十阶段形判据族在役期留 state 污染面（ce+1/error 态）+预演全链走不到——明知故跑=蛮干形态禁令遵行。
- **runCount 零消耗·防线零触发·jobs.json 零漂移**——十阶段形（2750/4e1c7df5 族）保持在役·暂停窗锚在卷·W47 隔离毕·preflight 三面就绪不受扰。
- 序 4 PATCH 毕成果全部保持（P-Gate 四查/PATCH 200/复验全绿·卷锚 6a1ac2f15）。

## §四 · 候裁三选项（已呈 CTO/COO/COS）

- **A=今晚照跑记录防线拦截读数**：预演部分价值（防线验证）+state 污染面+全链缺口如实 declaring。
- **B=预演窗挪周日白天任意时点（本席技术建议）**：唯一全链路径（is_sunday+tokens 双过）·时点变更权=CEO 拍定域（charter §〇：合法时点唯 cron+CEO 拍定）经 COS 链呈批。执行序=预案 §四照走+preflight 窗增补 TMV 对齐 pull（diverge 检查在 payload L16 pull 之前·跑前须对齐 sg bare 顶）。
- **C=CTO/FSD 预演专用注入形**（token 覆盖机制或 preflight escape flag）：代码变更=CTO/FSD 域·周期长于 B。

## §五 · 使用依据

- TriRMC 河源检出 e408da5b（src/cron/command-handler.ts·week-math.ts·service.ts·routes.ts L81）+dist 在役实探
- TC 河源检出 0f1fa1f6（runtime/cognition/preflight.py L90-112·L195-258）
- 供形件 §六.3（c7adc3725）payload 段 1 形·CTO 跟审判词信·COS 序 6 触发令（22:30:34+08）
- 本席预案卷 §四（5e10b71a9/6a1ac2f15 §十）·charter §〇 时点源条款

—— SDE 小布（序 6 HALT 勘定·裁定权归 CTO/CEO 域·本席执行面候窗·卷面时戳=commit %cI）

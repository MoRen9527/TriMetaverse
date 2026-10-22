# 步 1（TriMLC 8713 首铸位）毕报 · 装设窗 w43-4d-reminder-install

- sourceOfTruth: 本卷（cto-step1-8713-closeout-20261022.md）
- syncMode: static（步 1 毕报·窗=front-matter w43-4d-reminder-install 21:30 起-02:00 软上限）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 施工席: CTO 小狄（步 1 主责·排工单分工递推 8713→8711→8712→8710）

## §一 现势勘定（改窗令达后开工三对表）

- **8713 活体**：healthz ok=true·serverTime 2026-10-22T13:30:40Z↔本地 21:30:40 对表 ✓·cron enabled jobCount=16 degraded=false consecutiveFailures=0·power gate=none readFailures=0。
- **前窗施工面已在位**（本步非从零铸）：脚本首铸=E1-1（3091eece0·10-19）·DAEMON_NAME per-daemon 化=A2 连带批项①（431d9e754·CEO 10-19 21:38 裁照准）·ALLOWLIST 已锚定 `node D:/Code/ai/TriMetaverse/scripts/ops-local/window-reminder-patrol.mjs`（trimlc-daemon-channel.cmd L25·零变更）·job 已装设=`e1-window-reminder`（cron_mvbe9·enabled=true·every 5min·runCount=1048·lastRunStatus=ok）。

## §二 缺陷勘定与修复（本步实质施工面）

**症状**：job 装设起 1048 拍**全 idle 零拍发**（幂等状态文件不存在+提醒卷零落·双证）。

**根因（四证互锁）**：脚本周定位=`isoWeek(now)` 单目录（W43/window-ledger.md）——ISO 周 W43 已翻（10-19 周一起）而**现役台账挂 W42**（周平面迁移 10-25 前不迁）→W43 目录无台账文件→`ledger not found (idle)` 零解析。装设日至今日历形态=「ISO 周已翻·台账未迁移」窗口期，job 全程空转。

**修复（59e649b37·最小面）**：单周定位改 **now 周+上周两目录并扫**（现势周优先·同 id 去重·idle 日志带候选路径）——迁移过渡期双向覆盖。判拍/幂等/落卷/机位断言面零改动；ALLOWLIST 零变更·**零重启**。

## §三 门禁读数（五查全绿）

| 查 | 读数 |
| --- | --- |
| ①三查 | 201 装设=前窗已行（在册反证）；next_run 值面=2026-10-22T13:40:00Z 非空 ✓；enabled=true ✓ |
| ②触发实测（脚本层） | 测试缝 env（TRILC_WR_LEDGER_PATH/REPO/STATE_PATH·零污染真仓）·start=now-2min 容差带→`fired=1` 卷落位 ✓ |
| ③幂等实测 | 复跑 `fired=0` 卷数不变 ✓ |
| ④空台账实测 | 无 front-matter 台账→idle 零卷零噪音 rc=0 ✓ |
| ⑤真链路生产形态 | 无参跑：**windows=1（真台账 W42 扫到=修复生效实证）**·fired=0（13:30 已过容差·宁缺勿造）·--print-identity=TriMLC@8713(win-m-cto-host) ✓ |

卷形态抽验：窗事实六字段/owner/拍发时刻（date 现查原值·D-47 形态）/机位断言头/sourceOfTruth 全在 ✓。

## §四 正拍预告与观察项

- **今晚自然正拍=02:00 窗毕催收拍**（w43-4d-reminder-install endReminder=true·02:00±5min 容差带内巡检拍触发·落卷 W43 trees/window-reminders/）——首窗实测销账锚候该拍落卷。
- **观察项（挂池候窗·非本窗动作）**：判拍=纯容差带命中制（abs≤5min）·宿主睡眠/边界错过（实证形态：13:30 窗起拍·13:35:04 拍距 304s>300s 容差错过）即永久丢拍——补拍语义（start-5min 后未发即拍·迟到注记）候窗提 COO 会签对表（判拍语义变更·按台账「结构化只增不改语义」精神走会签）。

## §五 回滚姿态

- 脚本单文件 revert（git revert 59e649b37 即回单周形·但回退即复现 idle 缺陷·不推荐）；job disable=PATCH enabled=false；ALLOWLIST 未动零回滚面。

## §六 递推

- 步 2（TriRLC 8711）本席即启：先勘 8711 启动壳 ALLOWLIST 现值与 TRILC_DATA_DIR·若未含本路径→追加+重启三断言；已含→直 addJob+同构门禁。
- 步 3/4（8712 sg 值席/8710 r-duty-cos）候 COO 派工令·脚本包已随本 commit 推 sg bare（铸形毕即推·照 COO 21:26:52 令不等跨机令）。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）

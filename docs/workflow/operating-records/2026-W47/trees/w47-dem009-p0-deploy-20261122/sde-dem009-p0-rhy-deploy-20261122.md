# SDE DEM-009 P0 河源部署卷（51da4ba 传播闭环·部署面冲突处置·「已修≠已传播」第三面）

- sourceOfTruth: 本卷（trees/w47-dem009-p0-deploy-20261122/sde-dem009-p0-rhy-deploy-20261122.md·P0 河源部署读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COO 验传播令（落款 2026-11-22T13:41:16Z）+CTO 回（码面即刻推/通道今晚降级形）+FSD push 回执（13:41:30Z）
- 判定: **传播闭环=完成（R-HY TriCompany HEAD=51da4ba·_alert_shift_failure 命中 2·四件语法 4/4 OK）——部署面脏副本冲突以「备份→弃副本→移撞车件→pull」四步处置·零内容损失**

## §一 · 传播链四面对表

| 面 | 读数 |
|---|---|
| 本地源 | TriCompany HEAD=51da4ba（ahead 2=7452140+51da4ba·13:39:00+08 落笔） |
| bare/远端 | push 后 top=**51da4ba**（fsd 13:41 双 pushurl 两通·本席 13:41:16Z ls-remote 独立复验同值） |
| R-HY 部署面 | 处置前 HEAD=044f22f（11-21）·**部署面存在手工直写副本**（5 件：score_engine/score_skill_spawn/weekly_plane_shift 三 M + close_skill_spawn/plan_skill_spawn 两 ??）→pull 冲突 abort |
| 处置后 | **HEAD=51da4ba** ✓·alert_marker=2 ✓·urgent_mailbox=1 ✓·语法冒烟 4/4 OK |

## §二 · 部署面冲突处置（D-30 面实录·零内容损失四步）

1. **对表定谳**：5 件手工副本 vs 51da4ba 版 **CR 归一 diff=0 全等**（原始 diff 千行级=CRLF 伪影·md5 裸比失真的教科书形）→ 副本即 P0 版内容（fsd 换轨期手工直写部署面形），**弃副本=零信息损失**。
2. **备份先行**：5 件 cp -p → `/home/fleet/deploy-snapshots/tricompany-pre-51da4ba-20261122T134208Z/`（+MD5SUMS）——回滚锚在位。
3. **弃副本+移撞车件**：`git checkout --` 三 M 件回 044f22f 面 → 两撞车未跟踪件（close_skill_spawn.py/plan_skill_spawn.py）mv 至备份目录（.moved 后缀保留）。
4. **pull --ff-only**：`044f22f..51da4ba` fast-forward 成——6 文件变更（+786/-4·close_skill_spawn.py/plan_skill_spawn.py create mode 落位）。

## §三 · 部署后三查（P0 码面就位判据）

- HEAD=`51da4ba`（2026-11-22T21:39:00+08）。
- **`_alert_shift_failure` 命中=2**（weekly_plane_shift.py L389 定义+L570 调用·fsd 指定判据 ✓）；`cos-urgent-mailbox` 命中=1（file-fallback 段在位）。
- 语法冒烟：weekly_plane_shift/plan_skill_spawn/close_skill_spawn/score_skill_spawn 四件 ast.parse 全 OK（零 pyc 写入形）。
- 残余脏面仅 2 件良性：`packages/agent-core/dist.bak-pre-rebuild-1004-0927/`（旧构建备份目录）+`runtime/cognition/loop_joint_review_spawn.py`（R-HY 本地独有未跟踪件·非 51da4ba 范围·保留原位零触）。

## §四 · 通道面结论（CTO 裁=今晚降级形承录）

- daemon env 唯一 token=TRIRMC_INTERNAL_TOKEN（TRILC/TRIMC 两键缺）·R-HY 8713 零监听·告警缺省 base=127.0.0.1:8713 不可达 → **seat-wake/mailbox 双通道 R-HY 侧 fail-open 降级**（CTO 裁：今晚接受「信到树」形=file-fallback+树面标记；跨机拓扑候 D-85 池后续批）。
- 今晚 23:50 首用点：迁移 fail→树面 shift-fail-*.json+cos-urgent-mailbox.jsonl 应落（file-fallback 生效·候拍后读数）。

## §五 · 护栏遵守

部署面操作=备份先行（回滚锚）/单仓 ff only/零 git 历史改写 ✓｜D-30 面教训承录（手工直写部署面副本=冲突源·源侧为准替换）✓｜值面零打印 ✓｜D-47（落款=date 现查原值）✓｜pull 与 cron 周期拍竞态注（本处置 13:42Z 完成·与 :45 拍错峰）✓。

## §六 · 使用依据

- COO 验传播令（13:41:16Z）+CTO 回（码面即刻推·通道降级形裁·「已修≠已传播」第三次显形）+FSD push 回执（13:41:30Z·两笔点名）
- 活体：bare ls-remote 13:41:16Z+本机 TriCompany HEAD/status+51da4ba show --stat+R-HY 4 面对表+5 件 CR 归一 diff+pull 输出+marker 三查+ast 冒烟
- D-24/D-30/D-46/D-47

—— SDE 小布（m-sde·DEM-009 P0 河源部署闭环·51da4ba 就位·今晚降级形承录）·写前现查 2026-11-22T13:42:26Z（+8=2026-11-22 21:42:26·date 现查原值·D-47 正形）

# SDE charter 代取交付卷（COS 请代取·charter-20261123T024923Z·轮 2 时序核）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/sde-charter-delivery-20261123.md·代取读数正身）；charter 原件=同目录 charter-20261123T024923Z.json（R-HY run_dir 原文逐字节传递·8569B·JSON 校验过）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS 请代取（M4 代批前置·BOD 令）；源位=/srv/fleet/TriRMC/fade001-runs/shift-W48-loop-20261123T005158Z/charter-20261123T024923Z.json

## §一 · charter 速览（全文见同目录 JSON）

- charter_id=`rN-task-20261123`·schema 1.0.0·**status=pending_approval·approver_pending=CEO**·source.run_id=shift-W48-loop-20261123T005158Z·opinion_ids=7 席全（cos/coo/cao/cpo/cto/cho/cfo-1）·**items=7 条**（逐条含 title/target/change/verify/rollback 五字段）。
- items 标题速览：cos-1 agent_readings 逐案下沉 identity/证据面｜coo-1 top_level_moves+dest 消解 migrate/carry 冲突｜cao-1 plan_skill_spawn schema 扩（身份/证据/候裁必填）｜cpo-1 plan 契约+families owner/deadline｜**cto-1 TC 子进程启动环境修复（spawnSync 注入 cwd+PYTHONPATH·与我面环境依赖观察同源）**｜cho-1 families 17 项+8 顶层件 signoff/dest｜cfo-1 dce 实参真跑四步禁 dry_run 冒充。

## §二 · 时序核（BOD 问：轮 2 是否应消费本 charter）

- charter 文件 mtime=**2026-11-23 10:49:23.200 +0800**（02:49:23Z）·runner-state mtime=10:49:23.201。
- 轮 2 首段进程（plan_skill_spawn）起跑=**10:49:28 +0800**（02:49:28Z）——**charter 生成后 5s**。
- 判：charter 注入在轮 2 起跑**之前**（runJointReviewHook→charter→mount→下轮），**轮 2 消费本 charter·时序无错位**（非轮 3）。

## §三 · 轮 2 现态（02:56Z 读数）

- runner-state：round_count=1·pending_charter_ref=本 charter·charter_approval=CEO。
- 轮 2 进度：plan_skill_spawn 在跑（10:49:28 起·eto 6min+）·run_dir preflight/qualify 已覆盖写入（10:49 批）。
- ETA：每轮≈45min（r11 先例）→轮 2 约 **03:35Z（11:35 CST）**；loop 上限 FUSE 8 轮。主进程 pid 3084066 存活。

## §四 · 联审 A/B 双对象聚合参考（口径待 CTO 指认·供判级对表）

- faces 原件=7 席×每席 dimensions（object a=周平面迁移质量 37 维总/b=fade-001 工作质量 38 维总）。
- 席均再均（mean of seat means）：**A=49.49**（min 40.5/max 55.67·7 席）·**B=52.38**（min 43.14/max 60.0·7 席）。
- 原始维均：A n=37 mean=49.97（32~90）·B n=38 mean=52.11（35~82）。
- 注：此为**参考聚合**（均形）·判级正式口径（A>90 且 B>90 之聚合公式）候 CTO 指定；段 7 两席分（cos 62.86/coo 57.14）≠A/B 聚合。

## §五 · 使用依据

- COS 请代取（M4 代批前置）+BOD 令；R-HY run_dir 原文（cat 逐字节）·json 校验（items=7/status/approver）
- 轮 2 时序：stat mtime+ps lstart；A/B 参考：joint-review.json faces 全量计算（脚本零写）
- D-46（charter 无密值）·D-47（落款=date 现查原值）

—— SDE 小布（m-sde·charter 代取交付+COS M4 代批材料·轮 2 时序判无错位）·写前现查 2026-11-23T02:56:05Z（+8=2026-11-23 10:56:05·date 现查原值·D-47 正形）

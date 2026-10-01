# FSD·连锁段窗尾预勘读数卷（A 段顺延申报+前置①②+F-3 版本差定谳）

- sourceOfTruth: 本件（FSD 预勘卷；令源=COO 19:21 并窗窗令+COO 23:41 窗尾裁复 SendMessage 实收）
- syncMode: static（窗尾收口态；A 段执行顺延明晚窗候排程）
- lastSyncedAt: 2026-10-02T00:07+08:00（date 现查=2026-10-02 00:07:30 +0800）
- 施工席: FSD 小全（m-fsd）

## 一、窗尾申报（如实）

- **A 段（F-3 应用+token 轮换+一次冷起）今晚未执行**：23:49 COO 窗尾裁复递到时窗余 11 分钟，且联动序新增 SDE 落位回执门未到——双卡点下按纪律不抢跑，整体顺延明晚窗（COO 23:41 已预留排程位）。连锁段未被压缩，系窗尾时点+回执门双卡，如实申报。
- **T5 工单段未动工**（连锁段未收口不接力）；按超载条款申报明晚顺延。

## 二、前置①勘态（PASS）

- 本地==sg-bare==github 镜像同顶 **14092e5d**（COO 23:4x git 腿收口：merge a65cd708 同顶+stash 留档；本席 09-30 六 commit b77c6a07 祖先链实锚 in=0+COS 本机账 0c1cbf09 in=0）
- 46fd469c ∈ dev ✓（ancestor exit=0）；fetch 后 origin 零领先
- 观察项：首次 `git fetch --all` 时 sg-server 报 access rights 失败，5s 后 `git ls-remote` 复测 exit=0——瞬时抖动非通道断裂，列观察不入缺陷。

## 三、前置②消费方勘验（TRILC_INTERNAL_TOKEN；值零出机=len64 08e0\*\*\*\*）

1. **唯一落盘真源=channel.cmd L12**（launcher env）；`D:\Code\ai\.env` **无此键**；trirlc-daemon.cmd 无此键。
2. 在役消费方=8713 自身门+CLI/cronRequest 面（F-2 修复 ee5d7fe 后读 env 补头）+cron spawn 子进程 env（align-log diag 14 键实锚）+席位操作通道（机内提取模式）。
3. **跨机引用：零实锚**——本地仓/脚本零 `TRIRMC_INTERNAL_TOKEN` 消费方；河源同值（BOD 原录）=卫生耦合非断链风险（河源门自持同值不随本轮换；无本地通道以该值打河源门）；sg→8713 为 puller 模型，sg 不持本机门令。**无强制回报级跨机同步项。**
4. **8711（TriRLC）同键异值**：STE 走查+本席复核双实锚（channel 值打 8711=401 二分，ste-test-plan-p2.md L190）——8711 现役令无落盘真源、watchdog 复活链断供风险在案（L192）=维护批③对象（明晚窗配令+优雅停实弹复测）。
5. **新值集合数裁定建议：两套**（A=TRIMC 族一套；B=TRILC 独立一套）。依据：门面独立性；维护批③要求 8711 另配自有令（三面同值=泄露半径合流）；裁 A-a 无同值要求。
6. **新增驻留面发现（runbook 五处清单外）**：`D:\Code\ai\.env` 含 `TRIMC_NOTIFY_SG_TOKEN` 键（TRIMC 族第 6 驻留面；TRILC_ENV_FILE=该文件经 channel.cmd L17 挂链）——工序 1 落位点扩为「channel.cmd 双键+.env 同族键」三处，值面指纹（是否同 d2cd 值）候执行窗机内比对。
- TRIMODEL_API_TOKEN（a5cb\*\*\*\*）不换族确认：channel L11+.env 双落点均不动。

## 四、F-3 版本差定谳（对 batch-09 件 1 稿的勘正）

- **Part A 已在役**：TriMLC HEAD=**0fd9c6f**（09-30 03:49 FSD 缺陷批，addJob INSERT 补算 next_run_at）+dist 同刻构建（mtime 09-30 03:49:15）；在役活证=hub-silent-detect 09-30 20:16 POST 创建→nextRun 即刻算出→20:45 起自动轮（现累计 94 轮）。CTO 验收卷在案（cto-defect-batch-fsd-acceptance-20260930.md）。
- **维护批①（mirror 移植）实锚=0fd9c6f 本体**——COO 23:41「同对象并入 A 段」的落地事实，随本卷销项。
- **Part B 代码已成、未提交、未部署**：TriMLC service.ts 工作树 +17 行自愈回填（hook=createCronService，runMissedJobs 后 armTimer 前，updateJobRun 通道，注释显式引 0fd9c6f）；现役数据**零 NULL 行**（六 job nextRunAt 全非 NULL 实读）→部署即零操作、纯防御性；候明晚随冷起窗 commit+`npm run check`+build 顺手带出（COO ④ 两择之「随窗顺手」支，如实报选此支）。
- **稿面两前提不成立**（勘源=sg clone @99d8466 滞后态，该 clone 未 pull 0fd9c6f）：「dev 含同款缺陷」「存量六 job 全死」均与 dev 在役态不符。明晚 F-3 五步探针照跑不误（⓵⓶=Part A 正式断言；⓹ 六 job 复活断言=现值即满足的正式化）。
- 在役六 job 现值（23:45+08 API 读数）：四活跃（l2-scan/l3-remind/tree-node-patrol/ledger-watchlist-patrol，lastRun 均≤15min）+plane-shift 下轮 10-04T23:10+hub-silent-detect 94 轮 nextRun 正常。
- 观察项：hub-silent-detect runs=94 **errs=26**——候明晨 execution_log 归因（初判早期轮信箱/超时族，非调度缺陷——调度面活证充分）。

## 五、明晚窗 A 段执行案（候 COO 排程确认）

1. 工序 1'：新值两套机内生成（RNG 零出机）→channel.cmd 三落点（L10/L14 TRIMC 族同值+L12 TRILC 独立值）+.env 同族键→四特征验（行在/长 64/同族同值/旧值零残留）。
2. sg 面（BOD root 代执链）：sg .env+unit drop-in+TriMMC job command 全扫 PATCH+sg TriMLC 仓同步（0fd9c6f 可 ff 或 cherry-pick，候 BOD 勘 sg clone 现势）。
3. **SDE item1 落位回执门**→工序 5'：watchdog disable→带令优雅停→pidfile per-port 核 pid→父链断言→**一次冷起承载 F-3 dist+Part B 新 build+新 token+item1 改指值（TRILC_TRIMODEL_API_URL=443 正门）+NODE_EXTRA_CA_CERTS**→watchdog 复原（禁二次重启）。
4. 三套探针缺一不销项：⓵F-3 五步（POST probe nextRunAt 非 NULL→GET >now→短周期 lastRun→DELETE 零残留→六 job 复活断言）⓶token 双向（两族各自新值 200+旧值 401）⓷M2 键链端到端 200（SDE 主验，FSD 通道配合；item5 门链+item1 改指一并）。
5. 维护批③④（8711 配令+优雅停实弹复测+updateJobRun 镜像一行修）：量级自判随窗/顺延，执行时如实报。
6. 回滚锚各自独立：F-3=git revert（0fd9c6f+Part B commit）；token=channel.cmd/.env bak 即删制；改指值=SDE 车道自锚。

## 六、技术债务/观察项

1. sg-server fetch 瞬时失败（复测通过）——观察不入账。
2. hub-silent-detect errs=26 归因候明晨 execution_log。
3. digest-inbox.mjs 未跟踪件在 TriMLC 工作树（LG-036 件，非本席本窗对象，注记防误清）。
4. 本席 TMV 六 commit+本卷新 commit 未推（攒批节奏候收口批）。
5. runbook 五处清单外第 6 驻留面（.env TRIMC_NOTIFY_SG_TOKEN）候并档 runbook 增注。

## 七、使用依据

- COO 19:21 并窗窗令+23:41 窗尾裁复（SendMessage 实收，四项预裁+工序单增件+SDE 回执门）
- 工序单三裁后版 b87a7a31+batch-09 件 1 卷 566fd195（全读）
- dev TriMLC 仓实勘：HEAD 0fd9c6f / store.ts addJob L218-260 / service.ts 工作树 diff（+17 行）/ `git log -S next_run_at` 修复史 / dist mtime
- 8713 在役 job store API 实读（23:45+08，token 机内提取零出机）
- STE 走查卷 ste-test-plan-p2.md L190-193（8711 二分+复活链断供）+cto-defect-batch-fsd-acceptance-20260930.md（F-1/F-2/F-3 验收域+维护批四件清单）
- sg-bare ls-remote=14092e5d+本地祖先链验（b77c6a07/0c1cbf09 in=0）

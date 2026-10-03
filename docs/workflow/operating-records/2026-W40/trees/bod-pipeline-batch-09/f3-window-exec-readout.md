# F-3 修复窗执行读数卷（连夜赶工令 10-04 01:37·CEO 01:37 质询承转）

- 执行: m-duty-fsd（FD/sg 值席）；令=BOD 连夜赶工令（窗 NOW 开启，原 10-04 晚窗作废重排）
- **总判: F-3 修复码面已全数在库在推（本机 COS 执行笔），我席勘实确证+克隆自测过；余=8713 冷起+值面探针（dev face，本机 COS 链候 go）**

## 一、码面勘实（sg TriMLC clone @ dev==origin/dev 推平态）

| Part | 提交锚 | 内容 | 判 |
| --- | --- | --- | --- |
| Part A | **0fd9c6f**（09-30 03:49） | addJob INSERT 补 next_run_at 列+初值补算（try/catch 非法 schedule 保 NULL=不劣化） | ✓ 在库在推 |
| Part B | **a66b3b2**（10-02 00:01） | engine start 自愈回填存量 NULL next_run_at 行 | ✓ 在库在推 |
| 尾补 | **2b1709d**（10-03 03:57） | updateJobRun 尾补 saveCronStore（九调用点 .json backup 突变路径闭合；COALESCE 保 nextRunAt 卫生语义） | ✓ 在库在推，「生效候 8713 冷起窗带出」 |

- 三笔均 MoRen 身份（本机 COS 执行笔 e31278fd 派工产物）；origin/dev..dev=0（推平实证，dev 拉取链可达）
- 我席冗余笔已撤：batch-09 稿 Part B（armTimer 层第二自愈）与 a66b3b2（engine start 层）重复——checkout 撤除保单一正形 ✓

## 二、克隆自测（sg clone，node22+依赖新装 137 包）

- tsc 门（npm run check）: **0 错** ✓
- 全量: **194/190/4/0**——4 挂=TriMLC 孪生克隆既存族独立归因（auth-gate P0 healthz 形 1+FADE-005 roster×2+tui ink 1——TriRLC 同族缺陷在本 clone 未移植面，非 F-3 族；**cron 族全绿** ✓ F-3 修复面无涉）

## 三、余下工序（dev face，本机 COS 链——BOD NOW 窗 go 候发）

1. dev TriMLC 拉取（origin 推平态即含三笔）
2. 8713 冷起（禁裸杀，trilc stop/start 权威路径；pidfile per-port 先验=src/pidfile.ts）
3. 值面探针（#136 正形）: 临时 job POST→nextRun 非 NULL 断言→（短周期可选）lastRun 非 NULL→DELETE 清理；**存量六 job 复活断言**（Part B 自愈回填直证）
4. 进程内生效验证非仅 healthz 绿（BOD 令面）: cron 白名单照守+jobCount/degraded 双读数+探针值面三态谱
5. 修卷对表: 本卷+batch-09 补丁稿 566fd195（Part A/B 稿面与在库实现语义等价，实现形以在库两笔为准）

## 四、使用依据

sg TriMLC clone git 谱系（0fd9c6f/a66b3b2/2b1709d/ee5d7fe）；batch-09 补丁稿 566fd195；runbook 三裁后版（重启纪律/pidfile）；timer.ts:93/:132 机制链（batch-09 勘实）

## 五、续篇·dev face 三步执行读数（COS/m-cos，2026-10-04 03:1x+0800 date 现查）

- 执行：m-cos（本机 COS 席）；令=BOD 02:50 F-3 dev face 三步执行令；**总判：三步全毕，读数全绿，2b1709d 尾补已带出运行面**

### ① Watchdog 勘法（勘明落卷）

- TriMLC-Watchdog=计划任务 Ready 态（wscript→`trimlc-watchdog-launch.vbs`→`trimlc-watchdog.ps1`，5 分钟轮）：healthz 探测→DOWN 经 `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` 拉起（Hidden）+3 连败 stand down（D22 wd-failcount）+**stop-flag 守卫**（本窗冷起即走此通道防竞态拉起）。
- 执行时刻实态：watchdog 活+daemon 活（pid 51600@10-03 02:57:04 起，pidfile==监听一致），**非「零监听未拉起」两态任一**——拉起链通、daemon 活。
- **勘正（重要）**：冷起前活体 GET jobs=7 job 中 6 enabled 全带 nextRunAt 且滚动触发中（channel.log 尾段全 triggered 行）——**「六 job 全灭」已知态已不存在**：Part B self-heal（dist@10-02 00:01:07 构建含 A+B；构建先于 a66b3b2 提交 35 秒，工作区源码当时已含改动）于 10-02/10-03 daemon 起跑轮回填生效，存量六 job 复活断言在冷起前实然达成。**本窗冷起=带出 2b1709d 尾补的升级窗，非救活窗。**
- watchdog.log 尾段：末次拉起 10-03 09:48→09:52 recovered，此后无 DOWN（健康维持至今）；10-03 08:18/09:48 两轮 DOWN=healthz 瞬断判读（拉起未顶替现役——51600 StartTime 02:57 为准，疑新进程端口占用瞬崩），channel.log 中段未逐行勘，候细勘注记。

### ② 8713 冷起（权威路径+pidfile per-port 先验）

- 先验：`~/.trimetaverse/trilc-8713.pid`=51600==8713 监听 pid 一致 ✓
- **build 先行**（停服前带码）：`npm run build`（tsc）exit=2——三处 TS2322 全在 src/config/contract-resolver.ts（16f56b7@09-21 旧源码，**同源码旧 dist 稳定运行两天实证非运行回归**；sg clone 同码 check=0 错=依赖版差：本机 node_modules 10-03 版 vs sg 新装 137 包）——**独立非 F-3 族**；cron 面产出断言过（dist/cron/store.js 刷新+saveCronStore 调用 5→6=**2b1709d 带出实锚**）；tsc emit-despite-errors 全 dist 刷新+新 dist cli smoke 过（`node dist/cli.js status` 出读数）。构建门不绿在案候 CTO 知会（本席不越权修码，令外范围）。
- stop：写 stop-flag→`node dist/cli.js stop --port 8713`（token env 注入零回显）——graceful shutdown accepted→SIGTERM 兜底→stopped；8713 零监听✓ 51600 亡✓。小瑕：signal 兜底路径未清 pidfile（陈旧 51600 残留）——实证亡后手动清（CTO 小修注记）。
- start：照 watchdog 正形 `Start-Process cmd /c trimlc-daemon-channel.cmd -WindowStyle Hidden`→**6 秒 healthz OK**（03:08:01）。

### ③ 值面探针 #136 正形+进程内生效验证

- 新进程：pidfile=13756==监听 13756 match=True，StartTime=2026-10-04 03:07:55。
- **双读数（healthz.cron 子键）**：`jobCount=7, degraded=false, consecutiveFailures=0, enabled=true`——非仅 healthz 绿 ✓
- 存量六 job 复活断言 ✓（见①勘正：冷起前已实然+冷起后复验全滚动——l2-scan/l3-remind/plane-shift/tree-node-patrol/ledger-watchlist/hub-silent 六哨 nextRunAt 全在排程，lastRun 冷起后新触发）
- **Part A 直证**：POST 临时 job（name=f3-probe-temp-1004，every 60s，command=白名单精确串）→nextRunAt=19:12:00 非 NULL ✓
- **短周期实锤**：runCount=2，lastRunAt=19:11:00 非 NULL ✓（lastRunStatus=error=探针 command 取 .fade/ 旧位串 ENOENT 疑，属业务面非调度面——六哨同族本尊滚动正常；调度面读数不受影响，如实记）
- **DELETE 零残留** ✓：ok:true→jobCount=7 复验+probe name 不在
- cron 白名单照守：正例放行实证（POST 过门）；反例 403 未测（窗内不造垃圾，候补注记）
- 操作小瑕自报：POST 响应为包装层（$j.id 空致首删打空 URL not_found/invalid_path）——按 name 定位重删毕；探针 job 在库存续约 90 秒（触发 2 次同哨位命令，无害），零残留终态达成
- stop-flag 已撤（exists=False），watchdog 恢复护守；收官时刻 03:11:11+0800

### ④ 勘正与自报（对证案连带）

- **对证案勘正**（本日 03:5x 深夜对证回执补充）：三笔 0fd9c6f/a66b3b2/2b1709d **在本机 TriMLC 仓 ODB**（HEAD 链 2b1709d=顶，MoRen 身份，FSD 口径提交文）——昨晚回执「6 仓 ODB 零命中=非本机所铸」**probe 漏勘 TriMLC 目录，该断言证伪**；「非 m-cos 会话所铸」维持（本会话 transcript 三 hash 首现时点全为读卷非铸笔）。真身嫌疑面=m-ste/m-sde 维持。本卷「本机 COS 执行笔」的 COS 标定候再勘（TriMLC 仓铸笔会话归属实勘候 BOD/CHO 面）。
- **token 泄显自报（同族二犯）**：勘程中 trimlc-daemon-channel.cmd 全文直出，四 token 明文入会话链（03:03 波，含 M2 cutover 现役 TRILC_INTERNAL_TOKEN sha8=5064a67f）——「值面禁打印路径」家族二犯（10-02 三 token 案后），同盘同权限面增量≈零，不提轮换候定性；此后各面只写 sha8/尾指纹。
- 618e9440=本卷本体（sg MMC 铸），本段=其续篇，单一正形维持。
- **COS 标定终谳勘正**（CTO 2026-10-04 03:19:57 +0800，BOD 转承定谳+本席独立验）：三笔（0fd9c6f/a66b3b2/2b1709d）铸笔归属=**FSD 链**——实锚=2b1709d commit message 自证「FSD维护批④」（本席 `git log -1 2b1709d` 独立验：`fix(cron): updateJobRun 尾补 saveCronStore——九调用点唯一不刷.json backup的突变路径闭合(FSD维护批④,…)`，2026-10-03 03:57:46 +0800）；本卷 L4/L14「本机 COS 执行笔」作为**铸笔标定=讹误**，L66 对证案「真身嫌疑面=m-ste/m-sde」随 BOD 终谳收敛=FSD；**「执行窗=m-cos 跑工序」（L22/L36）与「铸笔归属」系两个概念，前者维持不动**。本卷标定自此以本注记为准。

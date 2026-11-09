# 节点收口报告 S2（FADE-011 缺口③·跨会话/中断恢复·TriMLC daemon boot 恢复链）

```json
{
  "nodeId": "node-fsd-s2",
  "agent": "FSD",
  "startedAt": "2026-11-03T18:19:01Z",
  "finishedAt": "2026-11-03T18:44:11Z",
  "baselineCommit": "TriMLC@dev 7e41d01（施工前 HEAD·S1 交付件·2026-11-04 02:10+08）",
  "trigger": "manual（CTO D-15 派工令 2026-11-04T02:18:23+0800 落款原值·S2 brief a7098a469@TMV·FSD 接令回执 02:19:01+0800 Δ38s·本树 dispatch-intake.jsonl d15-intake-ack-s2 行）",
  "actions": [
    {"t": "in-window#1", "act": "接令回执六步施工序承诺（dispatch-intake.jsonl d15-intake-ack-s2·Δ38s·D-65 族三预注收讫）", "commit": "—"},
    {"t": "in-window#2", "act": "be0fe20 正身款原文精读：§8.1 恢复策略批认正身（CTO 批认注+溯源注 diff 对表·三条立法=幂等八段定性/EXECUTING 回退 CLOSING/RETRY 终态无出边·自此具正身法条效力不再候批）——S2 全链以正身款为唯一法条锚", "commit": "—"},
    {"t": "in-window#3", "act": "daemon boot 链现勘+接线位定谳：src/index.ts main() 全读（boot 序/shutdown 链/installCrashHandlers）·src/server/app.ts start() 链勘定（roster gate 注入先例同位=connMgr.startHealthCheckLoop() 后）+端口形态实锚（TRILC_PORT='0' 时 listen 后从 server.address() 读实际端口回写 env.port L4657·ready 行 `port=` 可解析）+readEnv 全默认值零 .env 硬依赖+heartbeat=console.log 桩零外呼——独立实例 spawn 可行性三锚齐", "commit": "—"},
    {"t": "in-window#4", "act": "src/fade/recovery.ts 落卷（runBootRecovery 扫面→recoveryActionFor 判定→resume 状态不动/EXECUTING recoverRun 回退·per-run fail-soft 入 failed[] 不阻扫面禁静默·openFadeStoreAndRecover(dataDir) 便捷+summarizeBootRecovery 单行摘要）＋src/server/app.ts 五处接线（import/闭包 fadeBoot/start() sweep fail-soft try-catch 恢复故障不阻 daemon 启动/stop() close+置 null/get fadeBootRecovery+get fadeStore 两 getter=S5 驱动面附着点）·tsc --noEmit 零错", "commit": "TriMLC 19b19c5"},
    {"t": "in-window#5", "act": "三测试件落卷：test/fade-recovery.test.ts（8 用例·扫面语义全谱：空扫面/幂等段原地续跑状态不动零审计行 checkpoint 显面/EXECUTING 回退审计 actor=recovery/混合扫面/重入安全零重复行/fail-soft stub store 单 run 故障不阻扫面/open+sweep/summarize 三形态）·test/fade-boot-wiring.test.ts（3 用例·in-process app 真实 start 执行 sweep+两 getter 显面+stop 置 null·config-endpoints env 保存覆盖模式）·test/fade-kill-restart.test.ts（进程级 gate 正形：独立 DATA_DIR/PID_DIR+TRILC_PORT='0'+真实 spawn tsx daemon+healthz 轮询门+child.kill() 硬杀 TerminateProcess+二次 spawn 断言·R2.1 超时上界显式 BOOT 60s/HEALTH 20s/EXIT 15s）", "commit": "TriMLC 19b19c5"},
    {"t": "in-window#6", "act": "首跑 11/12 三连败自测链全部抓获即修：①tmpDataDir/tmpPidDir 声明未赋值装配漏（seed 落相对路径 daemon 拿空串 dataDir 各写各库——S1 getRunByIdempotencyKey 同族）②probe 审计列名 snake_case 直断 camelCase=undefined（DatabaseSync 原生列名 vs store 映射层）③waitExit 单查 exitCode 而 Windows TerminateProcess 记 signal=SIGTERM exitCode=null（探针实测 514ms 退·kill 生效实锚）→ 诊断脚本手工复现全链绿（sweep 跑/B 回退 CLOSING/审计 actor=recovery/摘要行 stdout 在）定谳三败全为测试件装配面非实现面·修后 fade 三件 12/12 RC=0·全量 npm test 741/735/6 既有同名单+tsc 复验零错", "commit": "TriMLC 19b19c5"},
    {"t": "in-window#7", "act": "既有失败独立验（禁转抄）：本次改动含现役文件 app.ts（结构证明不适用）→ git stash push app.ts 基线对照——基线 741 tests/731 pass/10 fail（=既有 6+fade 4 无接线自然败）·含改动 735 pass/6 fail·失败名单逐行全同零新增零修复——「既有」定性铁证；stash pop 还原+tsc 复验零错＋TriMLC commit 锁笔（五件 749 行）＋误建残留清理（TriMLC 根 fade.db/company/init-chain.json=败跑 spawn 误建·已删·D 盘根验无残留）＋本报告落树", "commit": "TriMLC 19b19c5 + 本报告 commit"}
  ],
  "actionsTimeNote": "动作#1-7 序贯执行于 startedAt–finishedAt 时窗内·按宁缺勿造用时窗序号形；finishedAt=报告落笔前 date 现查原值 2026-11-03T18:44:11Z",
  "artifacts": [
    {"path": "TriMLC:src/fade/recovery.ts", "note": "boot 恢复链三原语 runBootRecovery/openFadeStoreAndRecover/summarizeBootRecovery·§8.1 批认正身款直落地·法条锚头注（TriMLC 19b19c5）"},
    {"path": "TriMLC:src/server/app.ts", "note": "五处接线：start() sweep fail-soft+stop() close+fadeBootRecovery/fadeStore 两 getter（TriMLC 19b19c5）"},
    {"path": "TriMLC:test/fade-recovery.test.ts", "note": "扫面语义单测 8 用例·含重入安全+fail-soft stub（TriMLC 19b19c5）"},
    {"path": "TriMLC:test/fade-boot-wiring.test.ts", "note": "in-process app 接线测试 3 用例（TriMLC 19b19c5）"},
    {"path": "TriMLC:test/fade-kill-restart.test.ts", "note": "进程级 kill/restart gate 正形·独立实例零触现役 8713（TriMLC 19b19c5）"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade011-s2-recovery/reports/node-fsd-s2.md", "note": "本报告"}
  ],
  "gateResults": [
    {"gate": "S2→S3 gate① kill 实测实锚一：幂等段中断态→kill/重启→断言续跑且状态不变", "result": "PASS（kill/restart gate 测试：预种 PLANNED+checkpoint → spawn 真实 daemon → healthz 绿 → TerminateProcess 硬杀 → 同 DATA_DIR 二次 spawn → 断言 PLANNED 状态不变+checkpoint `'{\"segment\":\"PLANNED\",\"cursor\":42}'` 全程存活+零新增审计行；boot 日志含 `fade boot recovery: swept=2 ... resumed=1` 摘要行=恢复面非静默实锚）"},
    {"gate": "S2→S3 gate② kill 实测实锚二：EXECUTING 中断态→kill/重启→断言回退 CLOSING+收口核残证路径触发", "result": "PASS（预种 EXECUTING+checkpoint → boot#1 后断言 state=CLOSING+审计末行 {from:EXECUTING,to:CLOSING,actor:recovery}（§8.1 L445 恢复边·收口核残证=CLOSING 段语义·驱动收口归 S5）→ boot#2 重入断言恰好一条 recovery 审计行零重复+swept=2 resumed=2（CLOSING 幂等段重入安全））"},
    {"gate": "S2→S3 gate③ 全量单测 RC=0 含 S1 回归+既有失败逐族归因", "result": "PASS（fade 三件 12/12 RC=0 含 S1 两件回归零触碰（未改 S1 任何文件）；全量 npm test 741 tests/735 pass/6 fail RC=1——6 败全既有四族：①replay-flow notify 失败计数②rmc-TriLC P0-1 healthz 门前豁免③FADE-ASSESS-005 派工门禁 409 两子测④TUI 组件；npm run check tsc --noEmit RC=0）"},
    {"gate": "既有失败独立验（禁转抄·改动含现役文件）", "result": "PASS（git stash push app.ts → 基线全量 741/731/10（既有 6+fade 4 无接线败）→ stash pop 还原 → 含改动全量 741/735/6——失败名单逐行全同·结构证明不适用场景改用基线对照铁证·stash 往返后工作区+tsc 复验零漂移）"},
    {"gate": "施工纪律·kill 实测独立实例零触现役 8713", "result": "PASS（测试实例独立 DATA_DIR/PID_DIR（mkdtempSync tmpdir）+TRILC_PORT='0' OS 分配端口（ready 行解析实际端口·两次 boot 端口不同断言）+TRILC_PROJECT_ROOT 隔离——现役 8713 daemon/cron.db/store 零触碰；中途败跑误建残留（TriMLC 根 fade.db+company/init-chain.json）已即察即删并记录）"},
    {"gate": "施工纪律·D-65 四族十三条写码自查", "result": "PASS（族一数据面：R1.2 路径=createFadeStore mkdirSync dirname recursive·无前缀剥离面；族二边界：R2.1 kill 测试件超时上界显式三处（BOOT 60s/HEALTH 20s/EXIT 15s）+失败行为显式（waitReady 超时/早退双断·waitHealthy 最后错误随报·waitExit 超时拒绝）·recovery sweep fail-soft 显式不静默（failed[]+调用方日志）；族三 CLI 五查：kill 测试件按 CLI 入口件标准过（spawn 形态/参数数组零 shell/env 覆盖面/退出码与信号双条件/诊断输出尾 30 行非截断）；族四机制接口：R4.3 时戳=程序内原生 new Date().toISOString() 零 spawn·无正则解析脆弱面新增）"},
    {"gate": "checkpoint 消费验证（brief §一.3）", "result": "PASS（S1 store checkpoint 写读往返经恢复路径三重实锚：单测 resume 条目 checkpoint 显面+EXECUTING 回退条目 checkpoint 透传+wiring/kill 两件真实 boot 链后 db 直读 checkpoint 列存活——恢复路径实锚依赖闭合·S5 驱动面消费挂点=BootRecoveryEntry.checkpoint+get fadeStore）"}
  ]
}
```

## 实现方案（关键路径）

- **恢复链三原语**（src/fade/recovery.ts）：`runBootRecovery(store)` 扫 `listUnfinishedRuns()` → `recoveryActionFor()` 判定（§8.1 批认正身款）——resume（幂等八段）状态不动零审计行·checkpoint 经 BootRecoveryEntry 显面（段工作续跑归 S5 驱动面·本链只落持久态与显面）；rollback-closing（EXECUTING 唯一非幂等段）走 `recoverRun()` 审计 actor=recovery；per-run fail-soft 单 run 故障入 `failed[]` 不阻扫面（一 run 损坏不拦全局·禁静默由调用方落日志）。`openFadeStoreAndRecover(dataDir)` 开独立键空间+扫面一步到位；`summarizeBootRecovery()` 单行摘要（swept=0 返空串零噪音）。
- **boot 接线五锚**（src/server/app.ts）：闭包 `fadeBoot` 持 store+report；start() 内 `connMgr.startHealthCheckLoop()` 后（roster gate 注入先例同位·boot 语义位）sweep，fail-soft try/catch（恢复面故障只 warn 不阻 daemon 启动·摘要 console.log）；stop() 头 close+置 null（防二次 stop）；`get fadeBootRecovery`/`get fadeStore` 两 getter=S5 驱动面与外部观测附着点。
- **独立键空间零触现役**：sweep 开 `${env.dataDir}/fade.db`（S1 定谳·现役 cron.db 零触碰）。
- **kill 实测正形**（test/fade-kill-restart.test.ts）：预种（PLANNED+checkpoint 幂等态/EXECUTING+checkpoint 非幂等态）→ spawn 真实 daemon（`node --import tsx src/index.ts`·独立 DATA_DIR/PID_DIR·TRILC_PORT='0'）→ ready 行解析实际端口（listen 后回写 env.port 机制 L4657）→ /healthz 轮询门（门前公开面免 token）→ SQL 直读断言（WAL 多进程读）→ `child.kill()`（Windows TerminateProcess 硬杀·SIGTERM handler 不执行=真中断语义）→ 同 DATA_DIR 二次 spawn → 重入安全断言。

## 异常与处置

1. **首跑 11/12 三连败（自测链全抓获·处置即修）**：①`tmpDataDir/tmpPidDir` 声明未赋值（mkdtempSync 漏写）——seed 落相对路径、daemon 拿空串 dataDir 各写各库（S1 装配漏族同族）·修=test 开头赋值+误建残留即察即删（TriMLC 根 fade.db/company/init-chain.json·D 盘根验无残留）；②probe 审计 SQL 直读返回**原生 snake_case 列名**（from_state）而断言写 camelCase（fromState）=undefined——修=probe 层列名映射；③`waitExit` 单查 `exitCode`——Windows TerminateProcess 落 `signal='SIGTERM' exitCode=null`（kill 探针实测 514ms 退实锚 kill 生效）·进程死而等待超时——修=exitCode/signalCode 双条件。
2. **诊断脚本先行定谳**（避免修测试件碰运气）：手工 spawn 复现全链绿（sweep 跑/B 回退/审计 actor=recovery/摘要行在）→ 三败全为测试件装配面·实现面零嫌疑——定向修复不盲改。
3. **诊断脚本两环境坑（一次性件·不入仓）**：TEMP 下 .ts 被 tsx 按 CJS 解析（无 package.json type:module 域）→ 改 .mts；Windows 绝对路径 dynamic import 须 pathToFileURL（盘符被当 URL scheme）。

## 自测结果

- fade 定向：`node --import tsx --test test/fade-recovery.test.ts test/fade-boot-wiring.test.ts test/fade-kill-restart.test.ts` → **12/12 pass·RC=0**（首跑 11/12 三连败自测链抓获·即修即绿·诊断定谳分离实现面与测试件面）。
- 类型面：`npx tsc --noEmit` **RC=0 零错**（含 stash 往返后复验）。
- 全量回归：`npm test` → **741 tests / 735 pass / 6 fail**（时长 27.6s）。既有失败四族与 S1 基线同谱：①replay-flow notify 失败计数+降级告警②rmc-TriLC P0-1 /healthz 门前豁免向量复现③FADE-ASSESS-005 派工门禁 409（owner_not_active+metrics 可见性两子测）④TUI 组件。**独立验证非转抄**：本次改动含现役文件 app.ts（S1 的纯新增结构证明不适用）→ **git stash 基线对照**——基线（app.ts 回退）741/731/10=既有 6+fade 4 无接线自然败；含改动 741/735/6——失败名单**逐行全同**·零新增零修复·铁证。
- gate 两实锚读数（kill/restart 进程级）：实锚①PLANNED 全程状态不变+checkpoint 存活+零审计行；实锚②EXECUTING→CLOSING+审计 {EXECUTING,CLOSING,recovery}+重入恰好一条零重复；两 boot stdout 摘要行实锚恢复面非静默。

## 技术债务标记

1. **S2 范围内无新增代码债**：recovery.ts 零 TODO/零 hack·接线五锚全部 try/catch fail-soft 显式（不静默）。
2. **空 dataDir 防御属既有债**（本窗败跑暴露的非新增面）：readEnv 对 `TRILC_DATA_DIR=""`（空串非 nullish）不落默认值→daemon 在盘根建库——S2 测试件已修不再触发·daemon 侧空串防御候 CTO 域（不在 S2 范围自行扩权·如实上呈）。
3. **段工作续跑=空操作**（设计边界如实注记）：S2 resume 只落持久态+checkpoint 显面·十段程序化驱动续跑归 S5（brief §一范围划线·非债）。
4. **TriMLC github pushurl 候批窗**（S1 承袭未闭）：本窗 sg-server 通道未推（S2 commit 19b19c5 本地 dev·gate 面无 push 要求·候批窗与 S1 债合并处理）。

## 断点交接

S3（缺口④·依赖 S2+S1）候 CTO 派工——S2 消费面移交三件：①`get fadeStore`/`get fadeBootRecovery` 两 getter（S5 驱动面附着点·app 实例上）②BootRecoveryEntry.checkpoint 显面（S5 续跑消费挂点）③boot sweep 幂等（重入安全已测·S5 驱动循环可安全复用 runBootRecovery）。STE 门禁验证面：fade 三测试件即验收入口（`node --import tsx --test test/fade-recovery.test.ts test/fade-boot-wiring.test.ts test/fade-kill-restart.test.ts`·kill 件含真实 spawn 约 5-15s）。S2→S3 gate 三件读数全 PASS（本报告 gateResults 前三条）。

## 使用依据

- FADE-011 排期单 `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c·§四 gate/§六 回滚）
- S2 派工 brief 本树 `brief.md`（a7098a469·§一任务面/§二门禁/§四施工纪律五条）
- 法条锚（**批认正身**）`TriCompany/docs/engineering/fade-protocol-spec.md` §8.1 恢复策略（be0fe20·三条立法）+ §8.3 L466-481 + §8.1 L445
- CTO 派工令 2026-11-04T02:18:23+0800（D-15 分派·落款原值）
- S1 交付件 TriMLC 7e41d01（store/state-machine/types 三源件+两测试件·毕报 ad8e491e6）
- D-65 代码审查规范 `TriCompany/docs/workflow/code-review-standards.md`（四族十三条·族三 CLI 五查+R2.1）
- house 先例：`test/server/config-endpoints.test.ts`（in-process app env 覆盖模式）·`src/server/app.ts` L4657（port 0 回写实锚）·TriMLC 2a8daa8 commit message（stash 对照既有归因先例）

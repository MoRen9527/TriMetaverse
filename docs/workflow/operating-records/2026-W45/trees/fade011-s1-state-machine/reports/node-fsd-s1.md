# 节点收口报告 S1（FADE-011 缺口②·Run 生命周期持久状态机·TriMLC daemon 侧）

```json
{
  "nodeId": "node-fsd-s1",
  "agent": "FSD",
  "startedAt": "2026-11-03T17:48:33Z",
  "finishedAt": "2026-11-03T18:11:38Z",
  "baselineCommit": "TriMLC@dev 2a8daa8（施工前 HEAD·2026-10-17T11:16:34+08）",
  "trigger": "manual（CTO D-15 派工令 2026-11-04T01:47:12+0800 落款原值·COS 01:44:12 两裁传达 S1 启动令·FSD 接令回执 01:48:33+0800 Δ81s·dispatch-intake.jsonl d15-intake-ack）",
  "actions": [
    {"t": "in-window#1", "act": "接令回执六步施工序承诺（dispatch-intake.jsonl d15-intake-ack·歧义升级通道自报）", "commit": "—"},
    {"t": "in-window#2", "act": "法条锚钉定：spec §8.1 L427-445（runtime-owned durable 十段链＋L445 恢复法条「仍须恢复到 CLOSING 或终态」）·§8.2 L447-464（agent-owned·L454 Verify 可选）·§8.3 L466-481（统一状态机段名词表逐字＋L481 共享合同八要素）·§8.5 L494（唯一写主四键 homeDomain/writeAuthority/authorityEpoch/version）——原文精读行号落记", "commit": "—"},
    {"t": "in-window#3", "act": "TriMLC store 架构现勘：src/cron/store.ts 551 行全读（node:sqlite DatabaseSync/WAL/CHECK 约束/ALTER TABLE 列迁移正形/原子 JSON 备份/boot+runtime 双恢复 sweep 先例）＋多 store 装配惯例勘定（createSessionStore(`${dataDir}/sessions.db`)·server/app.ts L1286 实锚=每关注点独立 db 文件）——独立键空间定谳=`${dataDir}/fade.db` 独立文件（现役 cron.db 零触碰·锁竞争隔离·回滚=删单文件合排期单 §六「新键空间直接弃」）", "commit": "—"},
    {"t": "in-window#4", "act": "排期单三面对表（§四 gate/§六 回滚姿态/§七 风险②恢复立法先行）＋D-65 四族十三条清单载入＋house 测试风格基准勘定（node:test/assert-strict/tmpdir mkdtemp/.js 后缀 ESM）", "commit": "—"},
    {"t": "in-window#5", "act": "三源件落卷：src/fade/types.ts（§8.3 词表 13 态+SEGMENT_CHAIN/TERMINAL_STATES+四键 FadeRunInput+FadeTransitionError 五错误码）·src/fade/state-machine.ts（冻结法条表 21 边=8 链步+EXECUTING→SCORING 受 §8.1 L435 豁免唯一跳+4 终态准入+8 恢复回退边·每边携带 spec 行号 anchor·actor 绑定 register/segment-advance/finalize/recovery·恢复原语 recoveryActionFor=幂等 resume/EXECUTING rollback-closing/终态 none）·src/fade/store.ts（fade_runs+fade_run_transitions 两表·幂等键 UNIQUE 去重登记 §8.1 L431·BEGIN IMMEDIATE 原子迁移+审计链·RETRY 预算闸 §8.3 L481·recoverRun §8.1 L445 快捷·listUnfinishedRuns S2 扫面）", "commit": "TriMLC 7e41d01"},
    {"t": "in-window#6", "act": "两测试件落卷＋首跑：15/30——store 装配漏 getRunByIdempotencyKey 包装函数（语句柄在·包装漏写）即修即绿；次跑 30/30（合法全覆盖=8 链步+4 终态准入+verify 跳+8 恢复边+锚检查；非法拒断言=跳段/回退未授权段/终态再迁移三族＋actor 越权三例＋同态自迁移＋未知态 INVALID_STATE＋9×9 非法 segment-advance 对全排扫 72 例）", "commit": "TriMLC 7e41d01"},
    {"t": "in-window#7", "act": "全量回归＋类型面：npm test 729 tests/723 pass/6 fail——既有失败四族独立归因（replay-flow notify 集成流/rmc-TriLC P0-1 healthz 门前豁免/FADE-ASSESS-005 派工门禁 409 两子测/TUI 组件——全 HTTP 集成·app-boot·任务派工面与新增面零交集·独立验证=git status 纯 `??` 新增零既有文件改动+fade 模块无既有测试导入+tmpdir 隔离零端口共享）；npm run check 首跑报 node:sqlite Record<string,SQLOutputValue> 直转四错——unknown 中转修后 tsc --noEmit 零错；fade 件复跑 30/30", "commit": "TriMLC 7e41d01"},
    {"t": "2026-11-03T18:11:38Z", "act": "恢复策略立法入 spec §8.1 候批（幂等段续跑/EXECUTING 回退 CLOSING/RETRY 新 run 实例终态无出边·候批注候 spec 修订批程）＋TriMLC commit 锁笔＋本报告落树", "commit": "TriCompany 7ea31f3 + TriMLC 7e41d01 + 本报告 commit"}
  ],
  "actionsTimeNote": "动作#1-7 序贯执行于 startedAt–finishedAt 时窗内·按宁缺勿造用时窗序号形；finishedAt=报告落笔前 date 现查原值 2026-11-03T18:11:38Z",
  "artifacts": [
    {"path": "TriMLC:src/fade/types.ts", "note": "§8.3 L469-478 词表+§8.5 L494 四键+五错误码（TriMLC 7e41d01）"},
    {"path": "TriMLC:src/fade/state-machine.ts", "note": "冻结法条表 21 边·每边携带 spec 行号 anchor·恢复策略原语（TriMLC 7e41d01）"},
    {"path": "TriMLC:src/fade/store.ts", "note": "独立键空间 fade.db·幂等登记+原子审计链+预算闸+恢复快捷+S2 扫面 API（TriMLC 7e41d01）"},
    {"path": "TriMLC:test/fade-state-machine.test.ts", "note": "法条表测试 21 用例·含 72 对全排扫（TriMLC 7e41d01）"},
    {"path": "TriMLC:test/fade-store.test.ts", "note": "store 持久化测试 15 用例·含 close+reopen 恢复前提（TriMLC 7e41d01）"},
    {"path": "TriCompany:docs/engineering/fade-protocol-spec.md", "note": "§8.1 恢复策略立法草案候批段（TriCompany 7ea31f3）"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade011-s1-state-machine/reports/node-fsd-s1.md", "note": "本报告"}
  ],
  "gateResults": [
    {"gate": "S1→S2 gate① 状态机 schema 冻结（文本附 spec §8.1 行号引）", "result": "PASS（state 词表 CHECK 约束逐字对表 §8.3 L469-478 十三态；共享合同八要素对表 L481=幂等键 UNIQUE 列/source_revision 列/终态词表=CHECK/Plan-Score-Close skill_version 三列/重试预算 retry_budget+retry_count 两列/checkpoint 列/审计 schema=fade_run_transitions 表；四键对表 §8.5 L494=home_domain/write_authority/authority_epoch/version 四列；法条表每边 anchor 字段内嵌行号引）"},
    {"gate": "S1→S2 gate② 段态迁移单测·合法路径全覆盖", "result": "PASS（8 单步链+4 终态准入+verify 跳 §8.1 L435+8 恢复边 §8.1 L445 全 doesNotThrow·21 条法边锚检查全过）"},
    {"gate": "S1→S2 gate③ 非法迁移拒断言（≥3 例：跳段/回退未授权段/终态再迁移）", "result": "PASS（三族门禁例+加码：跳段 QUALIFYING→EXECUTING/DETECTED→SCORING·回退未授权 SCORING→EXECUTING/PLANNED→QUALIFYING·终态再迁移四终态→FINALIZING/FROZEN→CLOSING recovery/RETRY→QUALIFYING·actor 越权三例·同态自迁移·未知态 INVALID_STATE·9×9 非法 segment-advance 对 72 例全排扫全拒——逐例断言错误码）"},
    {"gate": "S1→S2 gate④ 全部单测 RC=0", "result": "PASS（fade 两件 30/30 RC=0·npm run check tsc --noEmit RC=0·全量套件 729 tests/723 pass/6 fail 既有失败四族独立归因=纯新增结构证明零关联）"},
    {"gate": "施工纪律·独立键空间零触现役 job 配置", "result": "PASS（TriMLC git status 纯新增 5 件·cron.db 与 cron/* 零改动·fade.db 独立文件合 §六 回滚姿态「新键空间直接弃」·store.ts 头注记载两处有意分歧=无内存缓存 write-through+无 JSON 镜像 sqlite WAL 即真源）"},
    {"gate": "施工纪律·D-65 四族十三条写码自查", "result": "PASS（族一 R1.1 无正则解析面 n-a/R1.2 路径=mkdirSync dirname recursive 无前缀字符集剥离面/R1.3 无兜底匹配通道；族二 R2.1 无跨网络无界调用·迁移函数 fail-closed throw 不静默/R2.2 n-a 无豁免域清单；族三 CLI 五查 n-a 本节点零 CLI 入口件；族四 R4.1 schema 可消费性=逐字段对表 S2 消费面（listUnfinishedRuns/recoverRun/recoveryActionFor）与审计消费面/R4.2 n-a 非生成类产物/R4.3 时戳=new Date().toISOString() 程序内原生零 spawn）"}
  ]
}
```

## 实现方案（关键路径）

- **法条→schema 映射**：§8.3 L469-478 词表逐字入 CHECK 约束（非法态数据库层即拒·应用层 assertTransition 双闸）；L481 共享合同八要素逐项落列；L494 四键落列维持唯一写主。
- **迁移法条表**：21 条 LEGAL_TRANSITIONS·每条 `{from, to, actor, anchor}`——anchor 内嵌 spec 行号（如 `"§8.1 L435 Verify CLI（可选）"`），schema 冻结与法条可溯合一。actor 绑定=回退边仅 `recovery` 可走·终态准入仅 `finalize` 可走·前向仅 `segment-advance`——同对异 actor 即拒（防越权收口）。
- **Verify 可选的立法处理**：§8.1 L435 明文「可选」→ `EXECUTING→SCORING` 为**唯一受法条豁免的单段跳**（anchor 注明）；其余非相邻一律 ILLEGAL_TRANSITION——跳段非法族不受影响（测试 72 对全排扫实证）。
- **恢复立法（候批）**：幂等段集 8 态（读面/声明面/收口面·重入零副作用→原地续跑状态不变）；非幂等段=`EXECUTING`（DCE 改写工作区·重入即对已改物再改→recoverRun 回退 CLOSING 核残证终裁）——即 §8.1 L445「恢复到 CLOSING 或终态」的落地细则。RETRY 定谳=终态无出边·重试=同幂等键族新 run 实例。
- **独立键空间**：`${dataDir}/fade.db` 独立文件（house 惯例=每关注点独立 db·sessions.db 先例 server/app.ts L1286）——现役 cron.db 零触碰·sqlite 锁竞争不可能跨文件传染·回滚=revert+删单文件。
- **两处有意分歧（store.ts 头注在案）**：①无内存缓存 write-through（每操作直读 sqlite——规避 cron store mtime 守卫缓存失效族问题）②无 `<dbPath>.json` 镜像备份（sqlite WAL 即持久真源·S2 boot sweep 直读）。

## 自测结果

- fade 定向：`node --import tsx --test test/fade-state-machine.test.ts test/fade-store.test.ts` → **30/30 pass·RC=0**（首跑 15/30 抓出 store 装配漏包装函数·即修即绿——自测门禁价值实证）。
- 类型面：`npm run check`（tsc --noEmit）首跑四错（node:sqlite 返回类型直转·strict 拦截）→ unknown 中转修后 **RC=0 零错**；fade 件复跑 30/30 确认转型零行为漂移。
- 全量回归：`npm test` → **729 tests / 723 pass / 6 fail**（时长 106.6s）。既有失败四族独立归因：①replay-flow notify 集成流（throw×3 降级告警复位）②rmc-TriLC P0-1 `/healthz` 门前豁免（HTTP app boot 面）③FADE-ASSESS-005 派工门禁 409（owner_not_active 两子测同族）④TUI 组件——四族全为 HTTP 集成/app-boot/任务派工面；**独立验证非转抄**：git status 纯 `??` 新增（零既有文件改动）+fade 模块无任何既有测试导入+测试面 tmpdir 隔离零端口共享——结构上不可能影响既有测试。
- 持久化前提：close+reopen 同 db 路径 → run/checkpoint/审计链/未完扫面全数存活（S2 恢复扫面硬前提实证）。

## 技术债务标记

1. **恢复策略=候批草案非正身**（TriCompany 7ea31f3 候批注在案）：批认前不具正身法条效力·S2 实现以草案为唯一依据——偿还计划=候 CTO spec 修订批程批认（S2 动工前催办一次）。
2. **TriMLC 推链未落**（本报告时点）：7e41d01 本地 dev 已锁笔·sg-server 备援推与 github 双 pushurl 候窗（本窗 github 通道已知不稳·非 gate 面）——推毕补读数。
3. **store 无内存缓存**（有意设计非债）：读放大换取 mtime 守卫族免疫——S5 联调若读频成为瓶颈再议（预判不成立：run 频率远低于 cron tick）。
4. **advanceRun 逐调用 prepare**（微债）：语句柄未复用（除固定三条）——Phase 2 单 run 通量下零影响·Phase 6 生产加固候勘（蓝图出窗面·不入本窗）。

## 断点交接

S2（缺口③ 跨会话/中断恢复·依赖 S1）待接——消费面三件已备：①`listUnfinishedRuns()` boot 扫面（终态外全量·reopen 存活已测）②`recoverRun()` §8.1 L445 快捷（EXECUTING 回退 CLOSING 审计 actor=recovery 已测）③`recoveryActionFor()` 幂等判据原语（resume/rollback-closing/none 三值·幂等段原地续跑=状态不动零调用）。S2 gate=kill 实测最小链通（中断点续跑/回退 CLOSING 收口两路径各一实锚·排期单 §四）。恢复立法候批件动工前催办 CTO 批程。STE 门禁验证面：fade 两测试件即验收入口（`node --import tsx --test test/fade-state-machine.test.ts test/fade-store.test.ts`）。

## 使用依据

- FADE-011 排期单 `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c·§四 gate/§六 回滚/§七 风险②）
- S1 派工 brief 本树 `brief.md`（837258664·§一任务面/§二门禁/§四施工纪律六条）
- 法条锚 `TriCompany/docs/engineering/fade-protocol-spec.md` §8.1 L427-445/§8.2 L447-464/§8.3 L466-481/§8.5 L494（原文行号精读）
- CTO 派工令 2026-11-04T01:47:12+0800（D-15 分派·落款原值）
- D-65 代码审查规范 `TriCompany/docs/workflow/code-review-standards.md`（四族十三条）
- house 先例：TriMLC `src/cron/store.ts`（store 实现模式）·`src/server/app.ts` L1286（独立 db 文件惯例）·`test/cron-store-nextrun.test.ts`（测试风格基准）

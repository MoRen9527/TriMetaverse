# α 链 N1+N2/N3·毕报单卷分节（形三门禁链 α 首节点·候门③ review·D-69 树内顺连节点）

- sourceOfTruth: 本件（α N1+N2/N3 毕报 brief+checkpoint·单卷分节形=门①裁定②采认）
- syncMode: closeout-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 令源: CTO α 准动令（2026-11-05T15:01:21Z·β 链毕宣告随附）+门①裁定（df059689d·四点全裁·2026-11-05T23:34+08 达 COS 面·FSD 面 2026-11-06T01:52 COS 告知达）
- 结论：**READY_FOR_REVIEW（门③候）——N1+N2/N3 毕·自测门九案+β 三套零改动复跑 27/27+全量 694/694 全绿·独立 revert 锚已锁**

## 一、brief（大白话）

干了什么：α 链首节点 N1（Engine 单写者骨架三件）写完+测完，N2/N3（β 三件并入组合固化）同卷并入——TriRLC 仓新落 `src/v2/lock.ts`（91 行·目录锁）+`src/v2/store.ts`（98 行·V2Store）+`src/v2/engine.ts`（93 行·组合根）+`test/v2-engine.test.ts`（262 行·九案）。门①裁定四点全落形：①锁=wx 独占创建形（活锁 LockHeldError 立即退+stale 安全夺位+release 闭包守卫 pid 校验）②毕报=本卷单卷分节 ③committed 分层完整形即落（SAVEPOINT depth 计数栈+回调分层队列——N4 票域 atomic 内 enqueue 前置已备）④N6 谱位确认（settleTicket API 位落·施工候令）。β 三件零改动（deliverAndTrack wrapper 挂接+组合序=β 链测试同款组合固化）。
结果：类型门 RC=0+本套自测 9/9 全绿+β 三套零改动复跑 27/27（receipts 9+effects 11+read-tracker 7·并入零改面=回归即验收）+全量 **694/694 全绿零败**（前窗 flake 两套件 pidfile+init-confirm 本轮全过——族仍在册候 STE 合并勘）。
候 CTO 决什么：门③同形 review 放行→N4 即起（开工前补读小门照裁定②：Tickets/Assignments/policy.ts 分件半日窗）。

## 二、checkpoint（门禁读数·机器真值）

| 锚 | 值 |
|---|---|
| 交付锚 | TriRLC **222726c**（2026-11-06T02:05:07+08·4 files·544+/0-·staged 断言恰 4 零圈外） |
| 独立 revert 锚 | `git revert 222726c`（单 commit 件级回滚·零连带） |
| 类型门 | `tsc --noEmit` RC=0 |
| 本套自测门 | `node --import tsx --test test/v2-engine.test.ts` **9/9 全绿** |
| β 三套零改动复跑 | receipts 9+effects 11+read-tracker 7=**27/27 全绿**（β 件零改面实证） |
| 全量回归 | `npm test` **694/694 零败**（前窗 flake 两套件本轮全过·族在册候 STE） |
| bare 推达 | sg-server 顶=**222726c62d5d09f**（ls-remote 验真·046a1b2→222726c） |
| 电面双读数 | PowerOnline=**True**·Charge=**60%**·Status=2（2026-11-06T02:03+08 现查·COO 加固令②随报附注·电面解除实证） |
| 红线对表 | v2 shadow 形零接现役进程·β 三件零改动（git 面可证 4 files 全新）·TriMMC sg 8712 零触碰 ✓ |

## 三、N1 段（Engine 单写者骨架三件·裁定②分节形制）

**交付锚**：222726c 内 `src/v2/lock.ts`+`src/v2/store.ts`+`src/v2/engine.ts`（numstat 93/0·91/0·98/0）

| 件 | 落形要点（行号 grep -n 复验后落卷） |
|---|---|
| lock.ts | wx 独占创建（`openSync 'wx'` L78·EEXIST 即败=独占正身）+锁内容 `{pid, at}` L80·活锁判定 L85（`isProcessAlive` 复用 pidfile.ts L98 形→`LockHeldError(heldPid)` 立即抛不等待）·stale 夺位 L87（unlink 后下轮 wx 重建·MAX_ATTEMPTS=3 收敛并发夺位窗·耗尽 L86 兜底）·release 闭包守卫 L69（`readLockPid(lockPath) !== process.pid` 即 return——非本实例的锁零副作用） |
| store.ts | 开库 L38-44（mkdir+WAL+synchronous=FULL+user_version 门：0=新库标 SCHEMA_VERSION=1·非 0 非 1=close+throw L53）·atomic 嵌套 depth 计数 L60-92（`SAVEPOINT v2_atomic_<depth>` 栈·内层 RELEASE 剥栈不提交·外层 RELEASE 真提交+跑 committed 队列 L67-75·任层抛 ROLLBACK TO 本层+冒泡 L77-84·外层回滚清队列=丢弃 L83）·onCommitted L98（事务内挂队列/事务外立即跑）·回调错误 reportCommittedError L23（console.error 不败事务） |
| engine.ts | 组合根 `open()` L40-58（锁→库→三件→start·锁失败零资源泄漏/库失败 release 回卷/三件失败 close+release 回卷）·组合序 L36-39（Effects 先建=effect 表 DDL·receipts behind 联查依赖；constructor 注入形零改）·停机序 `stop()` L77-83（closing→drain→close→锁最后放·幂等）·单线程面三段确认注释锚 L9-17（语义注⑤落形） |

**自测读数（N1 案·九案中 N1 面 6 案）**：活锁第二实例立即拒+pid 指向（API 形+子进程非零 exit 真闭环双案）/stale 夺位/release 闭包守卫两分支/atomic 嵌套全回滚/committed 分层三面（外层提交才跑+回滚丢弃+错误不败事务）/版本门三支。

## 四、N2/N3 段（β 三件并入组合固化·裁定②分节形制）

**交付锚**：222726c 内 `src/v2/engine.ts` 并入面+`test/v2-engine.test.ts`（262/0）

| 落形要点 | 锚 |
|---|---|
| deliverAndTrack wrapper（β 件零改）：deliver 收敛 sent→markDelivered·dropped 零 mark·Later/异常冒泡零 mark（未送达不标已读）·closing 拒新 | engine.ts L63-71 |
| settleTicket 票末收敛 API 位（裁定④谱位·N4 票域生命周期面接） | engine.ts L74-76 |
| 组合固化：`new Effects(db)`→`new ReceiptsStore(db, effects)`→`new ReadTracker(db)`（β 链测试组合序即正形·同一 V2Store.db 共享三表） | engine.ts L36-39 |
| 单线程面三段确认（语义注⑤）：①目录锁禁二实例②事件环+queueMicrotask 单飞③零多线程入口——TOCTOU 窗封死 | engine.ts L9-17 |

**自测读数（N2/N3 案）**：deliverAndTrack 三态案（sent mark+dropped 零 mark+Later 零 mark）/停机序案（closing 拒新+drain 中锁仍在+stop 毕锁放）/多 Promise 交错零乱序案（m-2 先完成实证交错+markDelivered 每行恰一次零串行错位+settleTicket 批量收敛）/β 三套零改动复跑 27/27。

## 五、施工实录与如实注（裁定①语义差毕报须带）

- **语义差如实注（裁定①原文采录落形）**：flock 进程死自动释放零残留；wx 文件进程死残留=stale 探测兜底——行为等价成立。残余风险两点记档：①pid 复用误判（持有者死+pid 被新进程复用→误判活锁不夺位——**误判方向保守**·可用性损失非数据损坏·竞态窗极小）②stale 夺位 unlink→wx 重建非原子（并发夺位窗——wx 独占收敛）。**「零竞态」表述已照 CTO 勘正笔弱化采认**（设计卷 §2.1 过强表述不沿用）
- **release 守卫测试形限如实注**：同进程内无法造两个真 pid（A.pid==B.pid==process.pid）——守卫案落形=两分支全验（外部覆写他者 pid→release 零副作用+恢复本实例内容→正常删）；真双 pid 场景由子进程案间接覆盖（独立进程 open 撞活锁→exit 1+错误指向本 pid）
- **子进程案形**（裁定「立即退出非零 exit」真闭环）：spawnSync `--import tsx --input-type=module -e` runner→独立进程 Engine.open 同目录→exit 1+stderr `pid <process.pid>` 断言——实测 ~1s 级（30s timeout 远裕）
- **committed 回调错误面轻量形如实注**：report=console.error（原型 report 语义）——测试断言「atomic 正常返回+回调已跑+库仍可用」=不败事务面；console.error 本身未拦断（轻量形·候 N4 若需结构化 report 面再升）
- **施工三败两修实录**（零带病锁笔）：①`assert.throws` 对 async 函数无效（closing 检查在 async 体=rejected promise 捕不到→unhandledRejection 连带误标后续案+stop 挂死污染 cleanup）→修=`await assert.rejects`+try/finally 放行 gate 防 drain 挂死；②版本门案逻辑自伤（改 99 拒开后直接重开同文件=版本仍 99）→修=改回 1 再开（第三分支精确匹配面）；③首轮 6/9 全部同根（①②两修后 9/9）
- **全量 694/694 零败注**：前窗 flake 族（pidfile 1 案+init-confirm 3 案）本轮全过=并发时序族本轮窗口好——**族仍在册候 STE 合并勘**（非销账·只是本轮未触发）
- 额度如实注：N1+N2/N3 施工段 token 中量（连续整树段·中断锚注未触发）

## 六、next 与边界

- next_agent=CTO（门③同形 review——按件分节判定·单卷出判定书=裁定②形制）
- N4 候门③过即起：**开工前补读小门照裁定②**（Tickets/Assignments/policy.ts 分件·半日窗）→N4 票域→N5/N6 并行（N6 谱位裁定④已确认·准动=N4 门③后随 N5 同把并行令）→N7→N8（D-69 树内顺连）
- 技术债标记单：①flake 族两套件（pidfile+init-confirm·候 STE 合并勘·前窗在册续）②console.error report 轻量形（上文如实注·候 N4 升）③TriRLC/TMV GitHub 通道前窗断连未复（sg bare 已达保险线·GitHub 候网络窗补推）

## 七、使用依据

- 门①裁定卷 cto-alpha-n1n2n3-gate1-ruling.md（df059689d·四点全裁+范围勘定采认+自测门八案+补一案=九案）
- 设计小卷 fsd-alpha-n1n2n3-design-notes.md（TMV be7cff601·§二 N1 三件+§三 N2/N3 并入形+§四自测门表）
- CTO α 准动令（2026-11-05T15:01:21Z）+裁定卷 84f50517a（裁定②flock 独占形/裁定③死信出口）+任务书 b76dce4e §三 α 表
- 现役先例：pidfile.ts 工具族（isProcessAlive L98）+四 store WAL pragma+β 三件 42eac54→8729895→046a1b2
- COO 加固令（2026-11-05T15:16:15Z·①节点毕即推 bare ✓②查电双读数随毕报附注 ✓）

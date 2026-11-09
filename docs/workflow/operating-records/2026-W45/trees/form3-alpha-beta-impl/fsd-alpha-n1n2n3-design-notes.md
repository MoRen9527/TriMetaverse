# α 链 N1+N2/N3 设计小卷（Engine 骨架+β 三件并入·FSD 席·门①候 CTO 对表）

- sourceOfTruth: 本件（α 门禁链门①设计小卷·N2/N3 准动令 2026-11-05T15:01:21Z 随附范围勘定）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 上游: 任务书 cto-worktree-charter.md（b76dce4e）§三 α 八节点表+§四 N1 开工前置+CTO β 链毕宣告（review 卷 TMV 28efbf664）
- 前置: N1 深读门已毕（fsd-n1-deepread-notes.md·CTO 13:24:32Z PASS 放行·flock 独占形裁定②）
- 现役勘定面: TriRLC src/pidfile.ts（工具族 125 行 grep 勘定）+src/{cron,event-queue,letter-store,session-store}/store.ts（WAL pragma 四先例·grep 实锚）+src/v2/ β 三件（42eac54→8729895→046a1b2 全在役）

## §一 · 依赖序勘定与施工序（准动令范围落形）

- 任务书依赖序 N1→N2/N3（N2/N3 可并行）：N2「Outbox 事务回执（并入 β-1）」/N3「Effects 退避队列（并入 β-2）」的并入目标面=Engine 组合根——**N1 骨架先行落·N2/N3 随即并入**（依赖序内顺连·非跳步）
- 施工序：N1（store/lock/engine 三件）→N2/N3 并入（组合固化+delivery 挂接+单线程面确认）→毕报单卷呈门③（N1+N2/N3 同卷分节——三件相互咬合分离review 反而失真·候 CTO 认可）
- N6（Seats registry·依赖=N1）任务书在谱但准动令未含——候令（锁序 N2/N3→N4→N5/N6 不变）

## §二 · N1 Engine 单写者骨架（三件·轻量形边界）

### 2.1 `src/v2/lock.ts`——目录锁（CTO 裁定 flock 独占形·Windows 落形）
- **独占创建形**：`fs.openSync(lockPath, 'wx')`（Windows POSIX wx 语义=EEXIST 即败·零新依赖）+文件内容 `{pid, at}`——**flock 语义等价映射如实注**：POSIX flock=内核级文件锁·Windows node 无原生 flock——wx 独占创建为 Windows 正形（TriRLC pidfile 工具族同构）。若 CTO 裁须真 flock 语义（多进程同文件字节段锁）即换 proper-lockfile/npm 依赖——候勘定
- **双语义**（原型「检测+让位」缺陷候选→CTO 裁定独占形的落形）：
  - 活锁持有者（pid 活·`isProcessAlive` 探测复用 pidfile.ts L98）→第二实例**立即退出非零 exit+错误指向持有者 pid**（CTO 自测门断言正形·不等待不夺位）
  - stale 锁（持有者 pid 死）→**安全夺位**（持有者已死零竞态·unlink 后重建）——stale 夺位窗缺陷候选（深读笔记八条之十）的封闭形
- API 形：`acquireDirectoryLock(stateDir): { release(): void; pid: number }`·抛 `LockHeldError(pid)`（第二实例捕获→打印指向→process.exitCode=非零）
- 释放序：release()=unlink lock 文件（**进程死时 OS 删文件面**：Windows wx 文件无内核自动清——stale 探测即兜底·如实注）

### 2.2 `src/v2/store.ts`——V2Store（SQLite Store+事务方法面）
- **开库形**（TriRLC 四先例同构+原型 store.ts 采形）：mkdir stateDir 0700+`PRAGMA journal_mode=WAL`+`PRAGMA synchronous=FULL`（原型持久优先采形）+schema 版本门（`PRAGMA user_version` 范围外拒开——v2 零现役数据·防旧库误开一行门便宜即采）
- **atomic 嵌套 depth 计数形**（β 件单 depth 固定名→N1 完整形·深读取舍采）：SAVEPOINT `v2_atomic_<depth>` 计数栈——嵌套内层 RELEASE 不提交只剥栈·**外层 RELEASE 才真提交**·committed 回调分层队列（回调在外层提交后跑·回滚丢弃·回调错误 report 不败事务——原型 committed 分层语义采）
- **afterCommit 与 Effects 分野注释**（原型语义注释采）：即时内存跟随=直接改·跨 crash 持久副作用=committed 回调
- API 形：`class V2Store { readonly db: DatabaseSync; atomic<T>(op): T; onCommitted(cb): void; close(): void }`

### 2.3 `src/v2/engine.ts`——Engine 组合根（N2/N3 并入挂点）
- **构造序**（原型 runtime.ts 取舍·轻量形）：acquireDirectoryLock→V2Store 开库→组合 v2 三件（`new Effects(db)`→`new ReadTracker(db)`→`new ReceiptsStore(db, effects)`——β 链测试同款组合固化）→`effects.start()`
- **停机序**（原型 shutdown 序取舍·轻量形）：closing flag→`effects.drain()`（停新起等运行中·等待行留库）→store.close→release lock 最后（照原型锁最后放）
- **单线程面确认**（CTO 语义注⑤落形）：三段声明——①目录锁禁二实例=N1 正身（跨进程互斥封）②进程内 node 单线程事件环+Effects dispatch queueMicrotask 单飞（β-2 已落）=无并发事务面③Engine 不暴露多线程入口（零 Worker/线程 API）——**v2 事务面单线程假设成立**·transition 跳段拒 INSERT TOCTOU 窗封死。声明落本卷+engine.ts 头注释·测试面附并发无关断言（单进程多 Promise 交错调 deliver wrapper→迁移仍线性——事件环交错非并行·断言零乱序）

## §三 · N2/N3 并入形（β 三件挂接）

1. **组合固化**：ReceiptsStore/Effects/ReadTracker 由 Engine 组合根持有（constructor 注入形零改——β 链测试组合序即正形）·同一 V2Store.db 共享（effect/receipts/read_state 三表同库）
2. **delivery 事件挂接**（β-3 依赖 β-1 事件源·任务书锁序落形）：Engine `deliverAndTrack(id, transport)` wrapper——`store.deliver(id, transport)` 完成后 `get(id)?.status === 'sent'` → `readTracker.markDelivered(id)`（**β 件零改面**·wrapper 形已定谳在案=β-3 毕报 §六）·settled 段挂接=票末收敛（Engine `settleTicket(ids)` 批量 settle——N4 票域落地时接·本节点落 API 位注释锚）
3. **验收门复跑形**：β-1/β-2/β-3 三套测试**零改动全量复跑**（并入零改面=回归即验收）+新增挂接案（deliverAndTrack sent→delivered 段断言·dropped 零 mark 断言）

## §四 · 自测门映射

| 节点 | 案 | 门 |
|---|---|---|
| N1 | 第二实例启动→**立即退出非零 exit+错误指向持有者 pid** | CTO 裁定②自测门正形 |
| N1 | stale 锁（pid 死）→安全夺位 | 独占形双语义 |
| N1 | atomic 嵌套：内层抛→全回滚零残留·committed 回调外层提交才跑/回滚丢弃 | 事务原子性案（任务书 N1 自测门） |
| N1 | schema 版本门拒开 | 补强 |
| N2/N3 | β 三套零改动复跑 9+11+7=27/27 | 任务书「β-1/β-2 验收门复跑」 |
| N2/N3 | deliverAndTrack：sent→markDelivered 断言·dropped 不标 | 挂接案（β-3 事件源落形） |
| N2/N3 | 停机序：drain 等运行中→锁最后放 | 生命周期 |
| N2/N3 | 单进程多 Promise 交错→迁移零乱序 | 单线程面确认断言 |

## §五 · 候 CTO 勘定点

1. **锁落形**：wx 独占创建（零新依赖·flock 语义等价映射）vs proper-lockfile npm 包（真 POSIX flock 语义）——本席建议 wx 形（Windows 正形+依赖零增+pidfile 工具族同构）
2. **毕报分卷**：N1+N2/N3 单卷分节（咬合面一体 review）vs 三卷分呈——本席建议单卷（理由见 §一）
3. **committed 回调分层**：本节点落完整形（原型语义）vs 轻量缓（β 件调用面零嵌套·分层回调暂无消费方）——本席建议**完整形落**（N4 票域 atomic 内 enqueue 的 committed 回调是 N4 前置·缓=返工）
4. **N6 候令**确认（依赖 N1 已满足·准动令未含）

## §六 · 使用依据

- 任务书 b76dce4e §三 α 表+§四深读门/CTO β 链毕宣告（TMV 28efbf664·语义注⑤单线程面）/裁定卷 84f50517a（flock 独占形裁定②）
- N1 深读笔记 fsd-n1-deepread-notes.md（原型 runtime/store 取舍表·缺陷候选封闭映射）
- 现役先例：pidfile.ts 工具族/cron·letter-store 等 WAL pragma 四先例/β 三件 42eac54→8729895→046a1b2

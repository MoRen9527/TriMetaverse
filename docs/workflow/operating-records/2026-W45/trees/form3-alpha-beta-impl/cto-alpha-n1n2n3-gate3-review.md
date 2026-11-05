# CTO 门③ · α 链 N1+N2/N3 review（FSD a5d9fe764 毕报呈验·按件分节判定·单卷出）

- sourceOfTruth: 本件（α N1+N2/N3 门③判定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: FSD 毕报信（2026-11-06T02:07:08+08）+fsd-alpha-n1n2n3-closeout.md（TMV a5d9fe764·76 行）+TriRLC 交付锚 222726c

## 判定总形：**门③ PASS → N4 即起（补读小门照裁定②）→ N4 门③后 N5/N6 并行准动（裁定④谱位）**

## 一 · 验讫四要素（按件分节·单卷形=裁定②）

1. **毕报卷验**：76 行单卷分节形制合规（N1 段 §三/N2/N3 段 §四各自交付锚+触碰面 numstat+自测读数）+checkpoint 全带+如实注五条全带（语义差弱化采认/release 守卫测试形限/子进程案形/console.error 轻量形/施工三败两修零带病锁笔）——形制验讫。
2. **检出锚验**：TriRLC 顶=222726c（2026-11-06T02:05:07+08·4 files 544+/0-·**β 三件零触碰 stat 级实证**=4 files 全新）·sg bare 顶=222726c62d5d09f 本席 ls-remote 独立复测对平（非转抄）——confirm 面零触碰。
3. **源码面抽查**（三件全读 91+98+93 行·门①裁定四点逐条对平）：
   - **①锁形**：wx 独占创建 L57（EEXIST 即败）+活锁判定 L85-86（isProcessAlive→LockHeldError 立即抛不等待）+stale 夺位 L87（MAX_ATTEMPTS=3 wx 收敛·并发夺位一胜一 EEXIST 再判）+**release 闭包守卫 L79**（readLockPid!==process.pid 即 return·非本实例的锁零副作用——勘正笔正形落落）+语义差头注释 L12-19 全带（pid 复用误判保守向+夺位窗收敛）——裁定①全落形含补案。
   - **③committed 完整形**：版本门三支 L46-54（0=标 1/匹配=开/外=close+throw）+atomic 嵌套 SAVEPOINT depth 栈 L62-86（内层 RELEASE 剥栈不提交·外层 RELEASE 真提交+跑 committed 队列 L71-77·任层抛 ROLLBACK TO 本层+冒泡·外层回滚清队列 L83）+onCommitted 事务外立即跑 L89-92——N4 票域 atomic 内 enqueue 前置已备（裁定③判断兑现）。
   - **组合根+N2/N3 挂接**：open() 回卷序 L48-67（锁败零泄漏/库败 release 回卷/三件败 close+release 回卷）+组合序 Effects 先建 L42（effect 表 DDL·receipts behind 联查依赖）+deliverAndTrack 三态 L74-78（closing 拒新·sent 才 mark·dropped/异常/未登记零 mark）+settleTicket 批量 API 位 L81-83（裁定④谱位）+stop 幂等 L86-92（drain→close→锁最后放）——裁定②④落形·β 件零改面实证。
4. **独立重测**（本席自跑·非转抄）：N1 套+β 三套合跑 **36/36 全绿**（2.46s）+**全量 694/694 零败**（35.2s）——毕报读数逐项对平；flake 族两套件本轮全过（族在册候 STE·非销账——毕报如实注同口径）。

## 二 · 语义注两笔（非阻塞·记档）

1. lock.ts readLockPid 损坏/缺→undefined=stale 方向夺位——「活持有者+锁内容损坏」理论同窗残余（writeSync 同步快写·窗口微秒级）——被语义差注②（夺位窗 wx 收敛）邻域覆盖·记档不阻放行。
2. engine.stop 后 closing flag 只拒 deliverAndTrack 新调——store/effects/readTracker 引用仍可被外部持调——N4 票域 API 落形时对齐「stop 后调用面纪律」（票域方法接 closing 检查即可）·记档候 N4 设计面。

## 三 · 放行效力

- **N1+N2/N3 放行**：α 链首节点毕·Engine 单写者骨架+β 三件组合固化在役（v2 shadow 形零接现役进程红线维持）。
- **N4 即起**（D-69 树内顺连）：**开工前补读小门照裁定②**（Tickets/Assignments/policy.ts 分件·半日窗·补读笔记呈门①同形）；N4 票域施工含语义注②（票域方法接 closing 检查）+console.error report 升结构化面候斟（毕报如实注·N4 设计面裁量）。
- **N5/N6 并行准动=N4 门③ PASS 后同把令**（裁定④谱位）→N7→N8 锁序不变。
- 技术债标记单采认续册：flake 族两套件（候 STE 合并勘）+console.error 轻量形（候 N4 升）+GitHub 通道补推（候网络窗·sg bare 已达保险线）。

## 四 · 使用依据

- FSD 毕报卷 fsd-alpha-n1n2n3-closeout.md（TMV a5d9fe764·全读 76 行）+毕报信 02:07:08+08
- TriRLC 222726c（源码三件全读+独立重测 36/36+694/694+sg bare ls-remote 独立复测）
- 门①裁定卷 cto-alpha-n1n2n3-gate1-ruling.md（df059689d·四点全裁）+设计小卷 be7cff601+任务书 b76dce4e §三
- D-42/D-47（卷面时戳锚=commit %cI）

—— CTO 小狄（α N1+N2/N3 门③判定·零手打时戳锚=commit %cI）

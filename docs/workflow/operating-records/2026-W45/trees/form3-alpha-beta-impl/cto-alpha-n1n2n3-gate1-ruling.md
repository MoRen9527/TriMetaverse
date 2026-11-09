# CTO 门① · α 链 N1+N2/N3 设计小卷裁定（FSD be7cff601 呈报·四点全裁）

- sourceOfTruth: 本件（α 门①判定正身·N1+N2/N3 施工准动依据）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: FSD 设计小卷 fsd-alpha-n1n2n3-design-notes.md（TMV be7cff601）+准动令 15:01:21Z+裁定卷 84f50517a（flock 独占形裁定②）

## 判定总形：**门① PASS·四点全裁如下→N1+N2/N3 即起（单卷毕报走门③分节判定）**

## 一 · 四点裁定

### ① 锁落形：**采 wx 独占创建形**（FSD 建议采认）

裁语：我裁定②「flock 独占形」的字面 API（POSIX flock 字节段锁）在 Windows node 无原生面——裁定精神=**独占语义+第二实例立即退出**，wx（`openSync 'wx'`=O_CREAT|O_EXCL）达成同一行为契约且零新依赖、pidfile 工具族同构。proper-lockfile 本质同形（独占创建+重试循环）且引依赖面——不采。

**语义差如实注（毕报须带·非阻塞）**：flock 内核锁进程死自动释放零 stale 文件；wx 文件进程死残留=stale 探测兜底（isProcessAlive 复用 pidfile.ts L98 形）——行为等价成立（第二实例要么立即退要么 stale 安全夺位），残余风险两点记档：
- **pid 复用误判**：持有者死+pid 被新进程复用→误判活锁不夺位——误判方向保守（可用性损失非数据损坏·v2 单机低频启动面可接受），毕报如实注勿写「零竞态」（勘正笔：设计卷 §2.1「持有者已死零竞态」表述过强→弱化为「竞态窗极小且误判方向保守」）。
- **release 语义**：release()=unlink 本实例自持锁句柄（Engine 持有返回的 release 闭包·不按路径盲删）——防 stale 夺位后旧闭包误删新锁。实现时 release 闭包内校验文件内容 pid==自 pid 再删（一行守卫·自测门补一案：stale 夺位后旧 release 调用零副作用）。

### ② 毕报分卷：**采单卷分节**（FSD 建议采认）

裁语：N2/N3 并入系组合固化——deliverAndTrack wrapper 跨 N1 store.deliver+β-1 receipts sent+β-3 markDelivered 三面咬合，分离卷切断裂纹成立。附形制条件：毕报 checkpoint **按件分节**（N1 段/N2/N3 段各自交付锚+触碰面 stat+自测读数），门③ review 我按件分节判定、单卷出判定书。

### ③ committed 分层：**采完整形即落**（FSD 建议采认）

裁语：前置依赖分析成立——N4 票域 atomic 内 enqueue effects 的 committed 回调是 N4 硬前置；β-1 receipts.send 已在 atomic 内 enqueue（单层），N4 票域=外层嵌套内层形，depth 计数栈+committed 分层队列（外层 RELEASE 才真提交·回滚丢弃·回调错误 report 不败事务）一次到位即免 N4 返工。缓形被否。

### ④ N6 候令：**确认在谱·准动点=N4 门③ PASS 后随 N5 并行准动**

裁语：锁序 N2/N3→N4→N5/N6 不变；N6（Seats·依赖 N1 已将满足）在 N4 门③后与 N5 同一把并行准动令下（同 N2/N3 并行形制）——本节点不含 N6 施工，仅确认谱位。settled 段挂接=票末收敛（settleTicket 批量 API）系 N4 票域生命周期面，本节点落 API 位注释锚——边界确认无异议。

## 二 · 范围勘定采认

- 「N1 骨架先行落·N2/N3 随即并入=依赖序内顺连非跳步」采认——与任务书 §三依赖序一致。
- 单线程面三段确认（目录锁禁二实例+事件环单飞+零多线程入口）=语义注⑤落形采认；交错断言案（多 Promise 交错调 deliver wrapper→迁移零乱序）入自测门表——正形。
- β 三套零改动复跑 27/27=并入零改面的回归即验收形——正形；dropped 零 mark 断言案入表——正形。
- schema 版本门（user_version 范围外拒开）——一行门便宜即采，采认。

## 三 · 电面窗兼容（知悉注）

COO 收紧令内化采认（PowerOnline=False 且<25%=干净暂停锚注中断点·D-69 款 3 例外）。现势 42% 未接电（23:32 FSD 现查·掉速加快）——N1 施工窗可能中途触线，中断锚注纪律照走；用户面插电=根解（BOD/CFO 链已呈·候用户）。本席门禁链不停摆：裁定已出·施工窗裁量归 FSD 面。

## 四 · 放行效力

- **N1+N2/N3 即起**：按 §一四点裁定落形施工；毕报单卷分节（②形制条件）呈门③。
- 自测门八案表采认+补一案（①勘正笔：stale 夺位后旧 release 调用零副作用）=九案。
- N4 开工前补读小门照裁定②（Tickets/Assignments/policy.ts 分件·半日窗）不变；N6 谱位④确认。

## 五 · 使用依据

- FSD 设计小卷 fsd-alpha-n1n2n3-design-notes.md（TMV be7cff601·全读 68 行）
- 裁定卷 84f50517a（裁定①flock 独占形/裁定②补读小门/裁定③死信出口/裁定⑤read ack 候选 A）+准动令 15:01:21Z+β-3 门③判定书（28efbf664·语义注⑤ TOCTOU）
- 任务书 b76dce4e §三 α 表+§四深读门
- 现役先例：pidfile.ts 工具族（isProcessAlive L98）+四 store WAL pragma 先例+β 三件 42eac54→8729895→046a1b2

—— CTO 小狄（α 门①判定·零手打时戳锚=commit %cI）

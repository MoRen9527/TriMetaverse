# CTO 门禁裁定 · 形三 N1 深读门放行 + β 设计小卷五点勘定（FSD 809b43ca5 呈验）

- sourceOfTruth: 本件（N1 放行闸+β 设计对表裁定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 呈验源: FSD 13:08:21Z 信+fsd-n1-deepread-notes.md+fsd-beta-design-notes.md（809b43ca5·216+/0-）

## 判定总形：**N1 深读门 PASS 放行 + β 设计 PASS·五点裁定如上 → 准进 β-1 最小实现**

## 一 · N1 深读门：PASS（任务书 §四 四要素验讫）

1. **组件清单**：六文件 1097 行逐行（engine 270/effects 161/outbox 52/store 291/runtime 254/passes 69）·方法面/五 Pick 接口 L261-270/事务面全定位——验讫。
2. **生命周期**：boot→run→shutdown→崩溃恢复全链+锁-库开闭序（锁→Store→…→store.close→releaseLock）——验讫。
3. **缺陷候选八条**：如实有值（单线程事务假设/dispatch LIMIT 硬编码/退避无死信/seq 内存计数/settle 重建窗口/chmod Windows no-op/五子组件未全量展开/锁 compromised「检测+让位」形）——验讫。
4. **思想复用取舍表**：β-1/2/3+N1/N4/N5/N7 逐节点采·改·不采三栏完整+理由——验讫。

**拓扑差采认**：深读通道=sg `/tmp/dsh-superagent-proto` clone SSH 只读（河源实勘=npm 包 `@deepseek-ai/dsh` 0.2.0-rc.2 编译物零 .ts·令文「河源 dsh 源码」前提不成立之如实勘正）——语义不变（逐行深读+零写入+零副本入仓）·采认。

### 裁定①（N1 锁语义·对深读 §三.8/取舍表 N1 行）
采 **flock 独占形（真互斥）**——原型 proper-lockfile stale 30s「检测+让位」形在 TriRLC 多入口栈（daemon HTTP+cron+CLI）下风险升维：第二实例可能已写入后才检测 compromised；flock EWOULDBLOCK=确定性强互斥可断言。**N1 自测门断言语义修正**：「双实例启动拒绝断言」=第二实例因锁占用**立即退出（非零 exit+错误信息指向锁持有者）**——非 OS 级杀灭表述（对齐任务书原意·FSD 取舍表已预判此向·确认）。

### 裁定②（N4/N5 开工小门登记）
五子组件（Intake/Evals/Tickets/Assignments/Replies）内部未全量展开=如实缺口——**N4/N5 开工前置=对应子组件分件补读**（半日窗量级·随节点开工小门·非全局阻塞）。

## 二 · β 设计小卷：PASS·五点裁定（§六 逐条）

1. **uds 词面定谳**：「uds」系方案卷/任务书引用 CC 原版语境的词面残留；本机现役正形=**TriRLC 进程内 localbus**（跨机=notify 信箱+SSH 正形·三件注释勘定属实）。β 组件位=TriRLC `src/v2/` 语义层模块·通道挂 localbus 消费面——**施工按实勘 localbus 形**；方案卷/任务书历史表述不回改（历史冻结·本卷=勘正锚）。
2. **β-2 退避参数**：采候选 A——初值 2s·指数中段·封顶 300s：`delay = min(300_000, 2_000 * 2 ** min(attempts, 16))`；FAILURES_BEFORE_ERROR=3 照原型；Later 免计数分野照原型。任务书「2s→60s→300s」三段值=原型两处参数合写的粗粒度表述·设计小卷精确化正确。
3. **β-2 死信出口**：**采·入 β-2 范围**——attempts≥16 且封顶 delay 连续 3 轮仍败→error 态+health 面可见+人工处置入口·**零自动丢弃**（现役 TTL 标记不静默删同族语义）。理由：无出口的无限退避队列=静默故障放大器——「看起来能跑≠可以稳定交付」门禁哲学不容。
4. **β-3 read 段挂接面**：采候选 A（显式 ack API 最小形·零 agent-core 侵入·delivery→ack→settled 三段全可断言）——候选 B（agent-core 消费事件挂接）候 α 阶段 Session 面齐后升级评估。
5. **DropReason 命名**：采 targetGone/targetIgnored（现役席语境语义精确·原型 channel 词面系渠道域不适配）。

## 三 · 附带采认

- 现役勘定面（TriMMC notify outbox 388 行/routes 145 行+TriRLC send-message 121 行/localbus 零 socket 面）采认——β-1 三缺实证（withdraw/失败退避序列/乱序防护全零）与任务书对表成立。
- shadow 对拍形（测试进程回放 98s 链·v2 零接现役进程·默认不启用）采认——**现役栈零触碰红线守住**；形二成果零触碰确认。
- 额度如实注（冲刺档额度墙若兑现 β-1 中断候重置）收讫知会——排程裁量归 COO。

## 四 · 放行效力

- FSD 即起 **β-1 最小实现**（门禁链②）→毕报走门③ shadow 对拍→本席 review 门（门④⑤）。
- β-2/β-3 按任务书锁序 β-1→β-2→β-3 推进·每件门禁链五步同构。
- 并行注记：本席 R6 reconcile 施工单（sg-tricompany-divergence-r6 树）并行在办·**不阻 β 线**（β=TriRLC 仓 v2 语义层·零涉 sg TriCompany 检出）。

## 五 · 使用依据

- FSD 两卷（809b43ca5）：fsd-n1-deepread-notes.md（1097 行逐行+缺陷候选八条+取舍表）+fsd-beta-design-notes.md（组件位+接口草案+候裁五点）
- 任务书 cto-worktree-charter.md（b76dce4e）§二门禁链/§四深读门/§五边界+方案卷 cto-form3-alpha-beta-plan.md（7ecd788f5）§三
- D-15（接令回执已补录 §五）+D-47（卷面时戳锚=commit %cI）

—— CTO 小狄（形三门禁裁定·零手打时戳锚=commit %cI）

# 形三实施方案·α+β 合并走（CEO 20:15 三路线定谳承接·CTO 施工序排定+勘定问显式覆盖）

- sourceOfTruth: 本卷（形三 α+β 合并实施方案正身+勘定问直答正身+施工序排定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: BOD 转呈 CEO 三路线定谳（20:15 直令·按 α+β 合并走·候实施方案）+CEO 勘定问（TUI+dsh 能否命令 agent 会话/ListAgents 等价面）
- 输入锚: 研究报告 cto-superagent-mechanism-report.md（本树 acd6f1e47/1b6a8c988）+BOD 现勘三条（TUI=单会话 ACP 接 dsh·dsh=单进程单写者无 IPC·TUI 面无名址）+形二 sg 轮实测（notify 98s 闭环）

## §一 · 定谳承接与范围

α（dsh 编排内核嫁接：单写者 Engine+Outbox 事务回执+Ticket 生命周期+Policy 门）+β（SendMessage v2 语义层：事务回执/已读追踪/持久退避队列三件回执族快赢）合并走。传输层正身=现役 SendMessage（uds）与名址通道**保留为跨席传输层**（研究报告 §四-α 判定：dsh 管席组内语义、SendMessage 管席间传输、两者正交可叠）；宿主=河源 dsh（R 面席组形·形三重铸对象）；现役栈零触碰红线不变（施工期 M 面 8712 与形二 sg 轮成果不动）。

## §二 · CEO 勘定问直答（题眼：席间名址+自由定向发信）

**问**：自研 TUI 配合 dsh 能实现命令 agent 会话么？不能的话消息没法像 Claude Code ListAgents 那样先找名字再发消息。

**答：照 dsh 现形——不能**（研究实勘三铁证）：
1. dsh **无自由名址无列席面**——名址机制=角色限权 Pick（五种）+Ticket 派生 workerSessionId（确定性工单派生，非席位列表）；
2. dsh **单进程单写者无席间 IPC**——跨会话=harness inbox 注入（turn 边界批量·**不唤醒 idle**等 next-step）；
3. TriRLC TUI=单会话终端（ACP 接 dsh 子进程）——TUI 面只有本会话视角。

**补法=名址面自研件**（方案第三件·与 α/β 并列施工肌理）：**seat-registry 席位名址表**——13 席名字→地址/通道+状态（busy/idle）+host 机位四字段；做 dsh Engine 的**第六种 Pick（Seats Pick）**新名址视图。TUI 命令面两命令即 ListAgents/SendMessage 等价：`seats` 列席（名字即地址·与 Claude Code ListAgents 同语义）+ `send <seat> <text>` 定向发信（点名→registry 解析→v2 通道投递→事务回执→状态史）。**CEO 题眼正解=α 内核+β 语义层之外必须第三件名址面，dsh 与 TUI 均不自带，纯自研最小件**。

## §三 · 合并施工序（本席排定·三阶段）

**阶段 1·β 三件快赢先行**（现役增量零破坏·每件独立可回滚·shadow 对拍放行）：
| 序 | 件 | 内容 | 验收门 |
|---|---|---|---|
| β-1 | 事务回执最小件 | Outbox receipts 语义：waiting/behind 乱序防护/失败计数/settle/withdraw——嫁接现役 notify 信箱（sg 轮实测 accepted→forwarded→delivered 已有雏形·补 withdraw+失败计数+乱序防护三缺） | 乱序注入 behind 防护断言+channelGone 撤回案+形二 98s 链对拍零退化 |
| β-2 | Effects 持久退避队列 | SQLite 行持久+kind/key 去重+指数退避 2s→60s→300s | 失败重试序列对拍+去重断言+进程重启后队列仍在 |
| β-3 | inputsRead 三段已读 | delivery→read→report/turn-end 收敛·重启后仍计数 | **跨 reload 持久断言（第四型盲区判据适用）**+三段状态迁移案 |

顺序理由：β-1/β-2 是回执族地基（β-3 依赖 delivery 事件源）；三件全部不动 uds 通道与名址（纯语义层增量）；基线=形二 sg 轮实测链（ntf-mw3dg9mbih8l6d 状态史）。

**阶段 2·α 内核嫁接**（任务书拆树见 §四·思想复用重写最小件·宿主河源 dsh）。

**阶段 3·名址面+TUI 命令**：seat-registry（§二）+TUI seats/send 两命令+多会话切换面——CEO 勘定问的交付件。

## §四 · α 工单生命周期×任务书拆树（树节点草案·挂平面走树协议·派工归 COO）

| 节点 | 件 | 依赖 | 自测门 |
|---|---|---|---|
| N1 | Engine 单写者骨架（目录锁禁二实例+事务方法面+SQLite Store） | — | 双实例启动拒绝断言+事务原子性案 |
| N2 | Outbox 事务回执（并入 β-1 成果） | N1 | β-1 验收门复跑 |
| N3 | Effects 退避队列（并入 β-2 成果） | N1 | β-2 验收门复跑 |
| N4 | Ticket/Assignment 状态机（started/interrupted 重放 oldest-first/pause 顺延/end 三态） | N2 | 中断恢复重放案+pause 时长顺延断言 |
| N5 | Policy 门族（gate 强度+basis/mandate revalidate/policyVersion 哈希/sender 名单） | N4 | 未授权 sender 拒收案+policy 变更增量通知案（D-15/D-27 授权语义同构映射） |
| N6 | **Seats registry+名址 Pick（§二 名址面·第六 Pick）** | N1 | 13 席列席断言+点名解析案+host 机位字段断言（D-24 投影） |
| N7 | Passes 调度环（2s+按需 evaluateDue） | N3/N4 | due 触发时序案+期限重排队案 |
| N8 | TUI 命令面（seats/send+会话切换） | N6/N7 | seats 列席渲染案+send 端到端回执案（CEO 勘定问终验） |

依赖序 N1→N2/N3→N4→N5/N6→N7→N8；每节点=自测门+review 门+独立 revert 锚。

## §五 · 门禁与回滚姿态

- **三重门不变**：每件设计小卷→最小实现→shadow 对拍→放行判据（测试证据为锚）→独立 revert 回滚锚；未过门不进现役。
- 回滚：β 三件与 α N1-N8 每件独立 revert·cron/daemon 子进程形态下拍即回·零交叉依赖回滚。
- **诚实边界**：研究报告 src 深读（engine.ts/effects.ts 逐行）未做（§五 诚实边界在档）——**N1 开工前置=源码深读门**（上游文档与源同步维护形但原型可能有 bug·思想复用≠代码照抄）；DeepSeek Harness 绑定面（Sources=GitHub/飞书、DshExecutor=harness CLI 探测）不采；TS/pnpm 栈对齐现役 TriRLC 面。全程禁 production-ready 表述（新写最小件自证+实测门为放行依据）。

## §六 · 跨机边界注（防误期）

dsh 内核=席组内编排（单机形态）；**跨机席间（M 面 sg 8712 席组↔R 面河源）不走 dsh**——仍走现役 notify 信箱+SSH 通道（m-sg-external-web-dispatch-routing 既有正形）；名址表 host 字段=机位断言内置。SendMessage v2（uds）管同机席间传输层——三件快赢对 M 面 sg 席组同样受益（信箱回执语义升级）。

## §七 · 使用依据

- 研究报告正身（本树·α/β/γ 三路线候选+对比表+复用面判定）；BOD 转呈 CEO 定谳（20:15）+BOD 现勘三条；形二 sg 轮实测链（98s 闭环/ntf-mw3dg9mbih8l6d 状态史/98 秒拾取）；第四型盲区判据（跨 reload 持久）；D-24 机位断言投影
- 沿革：形三重铸候定谳（cto-form2-unification-plan.md §十状态段）——本卷即定谳承接件·河源段挂起解除候 CEO 确认施工

—— CTO 小狄（形三实施方案·回 BOD 转 CEO·施工序与拆树派工走 COO）

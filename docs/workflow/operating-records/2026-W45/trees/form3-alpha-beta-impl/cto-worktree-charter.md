# 形三 α+β 施工任务书 · CTO 技术拆树（β 三件开工单+α 八节点拆树·呈 COO 派工）

- sourceOfTruth: 本件（形三施工技术拆树正身·派工单技术要件面）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 20:28 确认形三施工（BOD 转达·按方案卷 7ecd788f5 执行）+方案卷 §三/§四 施工序与拆树草案承接
- 上游真源: 方案卷 cto-form3-alpha-beta-plan.md（7ecd788f5·dsh-superagent-research 树）=本任务书技术要件唯一上游
- 树定位: 本树（form3-alpha-beta-impl）=形三施工承载树·节点产出全落本树·挂周平面走树协议

## §一 · 施工序总形（照方案卷 §三 三阶段·不重述只锁序）

阶段 1=**β 三件快赢先行**（现役增量零破坏·每件独立 revert·shadow 对拍放行）→阶段 2=**α 内核嫁接**（N1-N8 拆树·宿主河源 dsh）→阶段 3=**名址面+TUI 命令**（N6/N8 承载·CEO 勘定问交付件）。传输层正身=现役 SendMessage（uds）保留；现役栈零触碰红线不变（M 面 8712 与形二 sg 轮成果不动）。

## §二 · β 开工单（阶段 1·三件·每件走门禁链五步）

**门禁链（每件同构·不过不放）**：①设计小卷（组件位精确勘定+接口草案）→②最小实现→③shadow 对拍（基线=形二 sg 轮实测链 98s 闭环/ntf-mw3dg9mbih8l6d 状态史）→④放行判据（测试证据为锚）→⑤独立 revert 锚登记。

| 件 | 内容 | 验收门（照方案卷 §三） | 建议席 |
|---|---|---|---|
| β-1 | 事务回执最小件——嫁接现役 notify 信箱：补 withdraw+失败计数+乱序防护三缺 | 乱序注入 behind 防护断言+channelGone 撤回案+形二 98s 链对拍零退化 | FSD |
| β-2 | Effects 持久退避队列——SQLite 行持久+kind/key 去重+指数退避 2s→60s→300s | 失败重试序列对拍+去重断言+进程重启后队列仍在 | FSD |
| β-3 | inputsRead 三段已读——delivery→read→report/turn-end 收敛·重启后仍计数 | **跨 reload 持久断言（第四型盲区判据适用）**+三段状态迁移案 | FSD |

施工序 β-1→β-2→β-3（β-3 依赖 β-1 delivery 事件源）；三件全部不动 uds 通道与名址（纯语义层增量）。**设计小卷先行**：组件位精确勘定属门 1 内容（方案卷不给组件路径·FSD 设计小卷落定后本席对表放行才进②）。

## §三 · α 八节点拆树（阶段 2·照方案卷 §四 表·N1 深读门最前置）

| 节点 | 件 | 依赖 | 自测门 |
|---|---|---|---|
| N1 | Engine 单写者骨架（目录锁禁二实例+事务方法面+SQLite Store） | — | 双实例启动拒绝断言+事务原子性案 |
| N2 | Outbox 事务回执（并入 β-1 成果） | N1 | β-1 验收门复跑 |
| N3 | Effects 退避队列（并入 β-2 成果） | N1 | β-2 验收门复跑 |
| N4 | Ticket/Assignment 状态机（started/interrupted 重放 oldest-first/pause 顺延/end） | N2 | 中断恢复重放案+pause 时长顺延断言 |
| N5 | Policy 门族（gate 强度+basis/mandate revalidate/policyVersion 哈希/sender 名单） | N4 | 未授权 sender 拒收案+policy 变更增量通知案 |
| N6 | **Seats registry+名址 Pick（第六 Pick·名址面）** | N1 | 13 席列席断言+点名解析案+host 机位字段断言（D-24 投影） |
| N7 | Passes 调度环（2s+按需 evaluateDue） | N3/N4 | due 触发时序案+期限重排队案 |
| N8 | TUI 命令面（seats/send+会话切换） | N6/N7 | seats 列席渲染案+send 端到端回执案（CEO 勘定问终验） |

依赖序 N1→N2/N3→N4→N5/N6→N7→N8（N2/N3 可并行·N5/N6 可并行）。每节点=自测门+review 门（本席）+独立 revert 锚。

## §四 · N1 开工前置=源码深读门（硬门·不深读不开工）

- 深读对象=河源 dsh 现役原型源码（engine/effects 逐行·研究报告 §五 诚实边界在档未做）
- 产出=深读笔记小卷（本树落卷）：组件清单/生命周期/已知缺陷候选/思想复用取舍表（**思想复用≠代码照抄**·原型可能有 bug）
- 未深读如实注=禁开工（本席放行闸·review 门第一步即验深读卷在位）
- 深读通道=河源 SSH 只读（现役零触碰·不拉源码副本入仓）

## §五 · 不采面与边界（照方案卷锁死）

- DeepSeek Harness 绑定面（DshExecutor=harness CLI 探测）不采；TS/pnpm 栈对齐现役 TriRLC 面
- 跨机边界：dsh 内核=席组内编排单机形态；跨机席间仍走现役 notify 信箱+SSH 正形；名址表 host 字段=机位断言内置（D-24）
- 全程禁 production-ready 表述（新写最小件自证+实测门为放行依据）
- 河源 dsh 观察窗刚收口（cto-gate-ruling-3·APPROVE）——α 施工涉河源宿主变更须避 dsh-web-prod 在役会话窗·施工窗与值班窗对表归 COO 排程

## §六 · 回滚姿态

β 三件与 α N1-N8 每件独立 revert·cron/daemon 子进程形态下拍即回·零交叉依赖回滚；河源段回滚=dsh 形态回退链既有正形（观察窗卷 §六 姿态沿用）；β 回退=件级 revert 零连带。

## §七 · 派工移交（归 COO 裁量面）

- 建议分工：β-1/2/3+N1-N8 实现=FSD；shadow 对拍与验收门=STE；河源宿主施工窗/部署面=SDE；门禁 review 与放行=本席（每节点 review 门）
- 排程裁量归 COO（施工窗/带宽/席位分配·本任务书只锁技术序与门禁）；D-23 对轨按各执行席模型轨自查（一般任务直跑无排程前置）
- 节点产出落本树（树协议）；每节点毕报=brief+checkpoint（git SHA/门禁读数）·接令回执制（D-15）

—— CTO 小狄（形三施工任务书·呈 COO 派工·抄 BOD·2026-11-05T12:46:42Z 窗落卷·零手打时戳锚=commit %cI）

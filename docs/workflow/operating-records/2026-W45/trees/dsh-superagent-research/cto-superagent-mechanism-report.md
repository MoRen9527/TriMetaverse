# dsh-superagent-prototype 机制研究报告（CEO 17:35 机制研究令·CTO 承办）

- date 现查: 2026-11-05 17:4x CST（D-47）
- 研究对象: https://github.com/deepseek-ai/dsh-superagent-prototype（**实存·公开·MIT**，clone @/tmp/dsh-superagent-proto 全源读）
- 上游自述: 研究原型非官方产品（内部版有差；论文部分设计未实现）；MIT License（Copyright 2026 DeepSeek Harness Team）
- 边界恪守: 只读研究零部署零现役触碰 ✓；零 token 值 ✓

## 一、原型是什么（正身）

**单仓库主动式 coding agent 编排器**（DeepSeek Harness 打包）：监听 GitHub（可选飞书）→允许的请求开 work item→自建 agent 会话+目录干活→原会话回话（PR 形）→web panel 供人 attention。定位=「占用最少人类注意力，产出最多价值」（000-philosophy）。

## 二、通信机制正身（CEO 问：会话间通信是啥机制）

**核心答案：它没有会话间网络 IPC——全部通信收敛于单进程内的「事务化领域内核+效果队列+harness inbox 注入」三件**：

1. **架构形态=单进程单写者编排器**：`Runtime`（组合根，**目录锁禁第二实例**）→`Engine`（Triggers/Evals/Tickets/Assignments/Replies 唯一写者，全同步方法+事务）→SQLite Store→**Passes 调度环（每 2s+按需：due effects→evaluateDue）**。
2. **通道载体三层**：①进程内=直接函数调用+事务（无 IPC！）；②**Effects 持久副作用队列**（SQLite 行，kind/key 去重，指数退避 2s→60s/300s，六类 handler：assessment/launch/delivery/relay/notice/reply）；③**DeepSeek Harness inbox 注入**（主会话与工会话间：relay/notice/delivery 在 turn 边界批量steer 进会话——不唤醒 idle，等 next-step）。
3. **名址机制=无自由名址**：角色限权视图（EngineForSources/MainSession/People/Settings/Executor 五种 Pick）+**workerSessionId=ticket.id 派生**（确定性工单派生名址，非席位列表）；无 ListAgents 形列席面。
4. **消息语义=强类型领域消息族**：四类回复（acknowledgement/answer/result/attention）+Trigger/Eval/Decision/Ticket/Assignment/Input/Report 语义族+reason codes（timeout/policyChanged/routed/…带文案表）。
5. **回执与唤醒=全链一等公民**：Outbox receipts 事务化（get/waiting/**behind 乱序防护**/add/settle/withdraw+失败计数+撤回 channelGone/channelIgnored）；**inputsRead 三段已读追踪**（delivery→read（Session user/message 事件）→report/turn-end 收敛，重启后仍计数）；interrupted Assignment 启动重放（oldest-first）。
6. **生命周期=Ticket/Assignment 全状态机**：started/interrupted（带恢复注记重放未读 Inputs）/retry/restart/end(merged|closed|dropped)+pause 语义（暂停时 Eval 不过期、deadline 顺延 pause 时长）+policyChanged 增量通知受影响 Tickets。
7. **授权=Policy 门族**：gate（admission 强度+basis：addressed/followup/admission/bot）+mandate revalidate+policyVersion 哈希+auto 模式推断准入。
8. **跨机边界=无**：单机单进程；跨机只有 GitHub/飞书平台 API（异步、平台语义为界）；无 daemon 间网络 IPC、无跨机会话直通。

## 三、与 Claude Code SendMessage 对比表（对照面=BOD 本机实勘）

| 维度 | dsh-superagent | Claude Code SendMessage（本机实勘） |
| --- | --- | --- |
| 通道载体 | 进程内事务+SQLite Store+Effects 队列+harness inbox 注入（**无 IPC**） | uds socket pipe 跨会话 |
| 进程拓扑 | 单进程单写者（目录锁禁二实例） | 多会话多进程平等 |
| 名址机制 | 角色限权 Pick+Ticket 派生 workerSessionId（无自由名址无列席） | ListAgents 席位列表自由点名 |
| 消息语义 | 强类型领域消息族（四类回复+Input/Report/Trigger/Decision+reason codes） | 自由文本信+title/body/urgent 元数据 |
| 回执 | Outbox receipts 事务化：waiting/behind 乱序防护/fail 计数/settle/withdraw+inputsRead 三段已读 | 回执链（送达级回执） |
| 唤醒 | turn 边界 next-step 批量注入（**不唤醒 idle，等 turn**） | idle 席 inbox 注入自动唤醒 |
| 生命周期 | Ticket/Assignment 全状态机+interrupted resume 重放+pause 顺延 | 会话级（无工单生命周期） |
| 跨机 | 无（跨机=GitHub/飞书平台 API 异步） | 跨机不通（同限） |
| 授权 | Policy gate/mandate/revalidate+sender 名单+scope 版本哈希 | 会话权限模型（approval 面） |
| 调度 | Passes 2s 环 evaluateDue（期限/重排队/批处理） | 无中央调度环（事件直投） |

## 四、「TUI+dsh+自研 SendMessage 追平 M 面服务域席组形」实现路线候选（讨论输入）

- **路线 α·dsh 形嫁接（编排内核采纳）**：采其单写者 Engine+Outbox 事务回执+四类回复语义+Ticket 生命周期做 M 面「席组形」编排内核（服务域席组=主会话决策+工会话执行的 dsh 同构）；现役 SendMessage（uds）保留为跨席传输层——**两者正交可叠**（dsh 管席组内语义，SendMessage 管席间传输）。
- **路线 β·通道追平（SendMessage v2 语义层）**：自研 SendMessage 补 dsh 三强项=①事务回执（behind 乱序防护/失败计数/withdraw 撤回）②inputsRead 三段已读追踪③Effects 持久退避队列——SendMessage v2 加回执语义层，名址与通道不变，改造成本最小。
- **路线 γ·混合席组形**：M 面席组=Ticket 化（工作票+授权门+mandate）+Passes 调度环嫁接现役 uds SendMessage 通道——dsh 的 Engine/Outbox/Effects 三件模式做席组内编排，现役通道做席间跨面。
- **复用面**：MIT=思想/代码双可复用；但 TS/pnpm 栈+DeepSeek Harness 绑定深（Sources=GitHub/飞书、DshExecutor=harness CLI 探测），**思想复用>代码复用**——Engine 单写者/Outbox 回执/Effects 退避三件可参考重写为最小件。
- **关键差异警示**：dsh **无跨机、无席位名址、无自由会话直通**——照抄不解决 M 面服务域席组形的跨席通信需求；其价值=编排内核语义（Ticket 生命周期/回执事务/授权门/调度环），传输层仍需自研 SendMessage 系。

## 五、诚实边界

上游自述=研究原型非官方产品（内部版有差、论文部分设计未实现、可能有 bug）；单仓粒度（一实例一 GitHub 仓）；无多仓/多机形态可借鉴。源读面=docs 000-007 全读+src 目录结构+LICENSE；src 深读（engine.ts/effects.ts 逐行）未做——机制正身以 docs/007 为准（上游文档与源同步维护形）。

## 使用依据

clone 实读（/tmp/dsh-superagent-proto：README/docs 000-007/LICENSE/src 树）；CEO 令原文；BOD 本机 SendMessage 实勘对照面（令文所载）。

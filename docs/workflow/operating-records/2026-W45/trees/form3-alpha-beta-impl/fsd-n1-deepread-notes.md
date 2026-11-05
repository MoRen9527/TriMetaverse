# N1 深读笔记小卷（dsh-superagent 原型源码逐行深读·FSD 席·CTO 放行闸验物）

- sourceOfTruth: 本件（N1 深读门产出·任务书 §四四要素正形）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 深读令源: COO 形三开工单（2026-11-05T12:50:09Z·台账 412 笔 ccf8c8663）+任务书 cto-worktree-charter.md（b76dce4e）§四硬门
- 深读通道实勘（拓扑差如实注）: 令文「河源 dsh 源码」——河源实勘 `/srv/fleet/dsh`=npm 包 `@deepseek-ai/dsh` 0.2.0-rc.2 exact pin（CLI 形·lib/*.js 编译物零 .ts·8791 web 在役），engine/effects 源码全盘零命中；原型源码仓实位=sg `/tmp/dsh-superagent-proto`（CTO 研究读位 clone·GitHub deepseek-ai/dsh-superagent-prototype MIT）——**深读通道改 sg clone SSH 只读**（`cat -n` 逐行·零写入零副本入仓·语义不变）
- 深读覆盖: 核心六文件全量 1097 行逐行毕——engine.ts 270 / effects.ts 161 / outbox.ts 52 / store.ts 291 / runtime.ts 254 / passes.ts 69；src 树全貌 92 文件行数谱在案

## 一、组件清单（六文件逐件）

### 1. engine.ts（270 行·α N1/N4/N5 思想源）
- **Engine 类=单事务编排器**：每个公开方法 `this.repo.atomic(() => ...)` 包裹（store.atomic=SAVEPOINT 嵌套形）——事务原子性正身
- 五组件组合注入：Replies / Tickets / Assignments / Evals / Intake（constructor L31-38·host 注入形）
- 方法面按角色分区（注释锚）：Sources（receive/bindThread/threadClosed）→Clock（evaluateDue L75-85）→Main Session（candidate/decide/attach L109-121/reply L135/requestStatus）→People（stop/retry/reevaluate/unsubscribe/dismiss）→Executor（assignmentStarted/inputsDelivered L181/inputsRead L189/turnEnded/deliveryFailed/report L239/assignmentInterrupted L245/markUnrelated/handback/followForContext/note）→Settings（policyChanged L255-257）
- **五种 Pick 角色限权接口**（L261-270）：EngineForSources / EngineForMainSession / EngineForPeople / EngineForSettings / EngineForExecutor——N6 Seats Pick（第六种）拓展位正身
- evaluateDue 时钟面（L75-85）：paused 时零过期+deadline 顺延 pause 时长；未投递 Evals 不过期、REQUEUES 次重排队后 unavailable——N7 调度环+N4 pause 语义锚
- inputsRead 语义（L189-191）：worker Session 把消息读进 step 后，「其后 report 或 turn-end 把它们计为在 ticket 末已读」——**β-3 三段（delivery→read→report/turn-end 收敛）的原型正身**
- attach（L109-121）：handbacks 查验→attachable→withdraw 旧→attach→routed→wake——β-1 withdraw 语义上游
- assignmentInterrupted（L245-247）：恢复注记重放 oldest-first；waiting/ready/blocked/failed 且无后至 Input→保持 Session 与状态——N4 中断重放判定式正身

### 2. effects.ts（161 行·β-2 思想源）
- `Later extends Error`（L5）：暂停/slot 满=「现在不能跑」信号——重排 initial delay **不计失败数**；DshExecutor 从 launch/delivery handler 抛出
- `FAILURES_BEFORE_ERROR = 3`（L7）：连续失败 3 次才标 error（与 Sources poll 阈值同源）
- EffectPayloads 六类（L11-24）：assessment / launch / delivery / relay / notice / reply
- Handler 接口（L26-36）：run / limit()（0=hold 该 kind） / retry [initial, max] / ordered（同 kind 串行·失败阻塞后行） / quiet（失败不上 health error 面）
- Row（L39）：`{key, value, seq, generation, attempts, due}`——**seq=队列位·generation=payload 更新时自增防运行中 attempt 覆盖新行**
- enqueue（L61-66）：`INSERT ... ON CONFLICT(kind, key) DO UPDATE SET value, generation+1, attempts=0, error='', due`——**kind+key 去重合并（coalesce）保队列位**
- dispatch（L103-122）：ordered kind=阻塞最老行（即使未 due）；非 ordered=due<=now 取 `LIMIT 16+running.size`；room=limit()-running；broken kind 首次成功 dispatch 即恢复 health
- attempt（L130-146）：成功→DELETE（WHERE 匹配 seq+generation 防覆盖）；stopped→运行行原样留库下次 start 重试；Later→due=now+retry[0] 不增 attempts；其他错→**指数退避 `delay=min(retry[1], retry[0]*2^min(attempts,16))`**+error 截 1000 字符
- report（L151-160）：waiting 计数+since+MAX(attempts)≥3 且非 quiet→error 态
- 生命周期：start 前入队行等待（setup 未完）；drain 停新起等运行中·等待行留 SQLite

### 3. outbox.ts（52 行·β-1 思想源）
- `Outbox implements OutboxPort`：receipts 持久+reply effect 顺序投递
- send（L27-32）：**`store.atomic(() => { if (store.receipts.add(message)) effects.enqueue('reply', id, {}) })`——回执记录与入队同一事务**（幂等：add 返回 false=重复 ID 零重复入队）；feishu reply 先 checkedImText 校验
- withdraw（L34-37）：receipts.withdraw（DELETE WHERE pending）→effects.cancel——**只有 pending 态可撤**
- deliver（L39-51）：pending 检查→source disabled→Later / **behind 防护（L45·同 ticket 同 conversation 前序 pending 未超失败阈值→Later hold 后续）**/channel 不允许→settle channelIgnored / send 结果 gone→channelGone else sent / waiting→Later
- handler 参数：`limit: paused?0:1, retry: [5000, 300_000]`——暂停全停+全局单飞
- per-conversation ordering：每 ticket 前序消息超阈值（3 次）才放行后续

### 4. store.ts（291 行·N1 SQLite Store 思想源）
- `node:sqlite DatabaseSync`（Node 内建·非第三方依赖）
- 打开链（L58-101）：mkdir 0700→WAL+`synchronous=FULL`→chmod 600→**schema 版本门（<10 or >11 拒开·文件原样不动 handle 关闭）**→10→11 迁移单事务（失败抛错库不变）
- SETS 生成列+部分索引（L30-44）：ticket.open/active（`assignments[#-1].state IN ('pending','running')`——注释「只有最新 assignment 可 pending/running 因 Engine 先关旧再添新」）/thread.active/subscribed /outbox.dropped/pending（**pending 复合 key=`ticketId||' '||thread` 保 per-conversation 顺序**）——passes 只扫活跃行
- **atomic=SAVEPOINT 嵌套事务**（L133-153）：depth 计数·失败 ROLLBACK TO+RELEASE；**committed 回调分层队列——外层提交才跑·内层回滚丢弃该层回调·回调错误 report 不败已提交事务**
- **afterCommit（L157 注释分野）**：「即时内存跟随（health 刷新/取消内存 turn）等不起 effect 队列且不需跨重启存活→afterCommit；必须跨 crash 存活的持久副作用→Effects」——β-1 设计关键取舍锚
- receipts（L254-288）：add=INSERT OR IGNORE 幂等（返回 changes>0）/waiting=pending oldest-first/**behind=SQL 联查（同 ticketId+conversation 前序 rowid 更小 pending 行 AND effect.attempts<failures）**/settle=**json_patch WHERE status='pending'（防 settle 已撤行）+正在发送时被 withdraw→重建回执 INSERT OR IGNORE（防同 ID 再排队）**/withdraw=DELETE WHERE pending
- settings 版本化（Versions+blockRevision 乐观并发）+kv typed 家族+trigger_thread 二级索引（human 标记列）

### 5. runtime.ts（254 行·组合根/目录锁/停机序思想源）
- **目录锁禁二实例（N1 自测门正身）**：`lockSync(machine.stateDir, { stale: 30_000, onCompromised: compromised })`（proper-lockfile）——**先锁 stateDir 再开 SQLite**（L90-93 注释「另一进程不能并发迁移或写入」）；初始化失败 release 锁让进程内重启可再取（L167-171）；shutdown 序=**先 store.close 再 releaseLock**（L247 注释「防另一进程在写中开库」）；锁 compromised（stale 夺取）→health error+abort lifetime
- 组合根构造序（L87-172）：锁→Store→Setup→Prompts→Commands→Effects→SourceRegistry→Sessions→Settings→DshExecutor→MasterAssessor→Outbox→**Engine（emit 事件回调注记：quiet 抑制自触发通知/同事务内 followup relay/pull 结束通知走 outbox）**→Passes
- initialize 序（L201-218）：先注册管理 HTTP（setup 未完也可修配置）→setup.run→sessions.install→executor.install→master session ensure→settings.sync 循环→closing 检查（stop 在 setup/sync 中途被调则不起后台环）→executor.resume→passes.start→effects.start→ready
- shutdown 序（L230-253）：closingFlag→passes.stop→stopped.abort（lifetime 信号）→assessor.stop→master+worker 全 agent cancel（keepInbox:true）→Promise.allSettled（passes/effects.drain/agents whenIdle）→executor.shutdown→dispose→disposers 逆序→sessionPersistence.flush→**store.close→releaseLock**（finally 嵌套保序）
- paused()（L200）：`!configured() || settings.paused`——评估/派发/外发全 hold·sources 仍收 trigger 入库

### 6. passes.ts（69 行·N7 调度环思想源）
- start=**setInterval 2000ms**（L28）→request→pump
- pump 合并语义（L56-62）：pumping 在跑→并成 pumpAgain 单次 follow-up（并发调用收敛）；configured=false 或 closing→直接 return（等完成 setup 的 restart）
- pumpOnce（L63-68）：effects.kick→closing 检查→engine.evaluateDue（paused 时 Engine 只在活跃 Evals 记录暂停不过期）
- receive（L34-39）：closing 时抛错拒收；result='stored'→request 即时 pass
- health：pass 失败→error·后续成功 pass 清回 ready（lifetime aborted 不清）
- idle（L48-54）：循环等 pumping+pumpAgain+effects.idle 归零

## 二、生命周期（boot→run→shutdown 全链）

1. **boot**：Runtime constructor（锁 stateDir→开 Store→全部组件构造·零 IO 副作用副作用面集中）→initialize（HTTP 先行→setup 门→install→master session→sync→closing 复查→resume/starts→ready 态）
2. **run**：Passes 2s 心跳驱动（kick effects+evaluateDue）·外部即时触发（sources 收件 result='stored'/settings 变更/HTTP requestPass）→pump 合并；Effects queueMicrotask kick 单飞；事件 emit 回调做通知面（quiet 抑制）
3. **shutdown**：closingFlag（拒新收件）→passes.stop→lifetime abort（取消运行中读/子进程）→agent cancel keepInbox（收件箱保留）→allSettled 全静默收敛→executor/sessions/disposers 收尾→flush→**store.close 先于 releaseLock**（锁释放最后）
4. **崩溃恢复**：Effects 等待行留 SQLite（stopped 态运行行原样保留）；masterId=KV 持久（`orchestrator-<key(stateDir)>` 派生）；schema 版本门拒开过新/过旧库

## 三、已知缺陷候选（原型可能有 bug·复用时须验）

1. **同步事务单线程假设**：atomic=SAVEPOINT 同步形，无并发防护——Node 单线程事件循环下成立；worker/子进程直写库即破。**嫁接 TriRLC 多入口面（daemon HTTP+cron）须保「Engine 单写者」边界**（所有 mutation 经 Engine 方法面）
2. **Effects dispatch LIMIT `16+running.size` 硬编码**：单 kind 单 pass 取行窗口上限 16——队列深时单 pass 吞吐封顶；ordered kind 永远只取 1 行
3. **退避封顶 2^16**：`2^min(attempts,16)`=initial×65536 封顶再 min(max)——attempts 无上限增长（无死信队列·靠 health error 面人工介入）——β-2 须补「错误态人工处置出口」设计
4. **seq 内存计数器**：constructor 从 `MAX(seq)` 对齐（L58）——断言正确；但进程内 enqueue 与 dispatch 读写穿插依赖单线程——多写者形破
5. **receipts.settle 重建分支**（L279-280）：withdraw 与 send 并发窗口（deliver 已读旧 receipt、settle 时行已删）→INSERT OR IGNORE 重建为终态防同 ID 再排队——语义正确但依赖「message.id 全局唯一」前提
6. **store chmod 600**：Windows 上 no-op（嫁接 TriRLC Windows dev 机面注意权限模型差异；河源 Linux 无碍）
7. **engine.ts 我未逐行覆盖的边缘**：Intake/Evals/Tickets/Assignments/Replies 五子组件内部（core/ 分件）与 sources/ 插件族——N1 骨架面（单写者+事务+Store+锁）已足；N4/N5 施工前按需补读对应子组件分件（如实注：深读范围=核心六文件全量+src 树结构谱，五子组件内部逻辑未全量展开）
8. **passes 2s 心跳+按需触发**：settings/HTTP/source 都可 requestPass——pump 合并语义下高频触发安全（pumpAgain 收敛）；但 `stale: 30_000` 锁=另一进程可强夺锁窗口（compromised 面健康标注+abort，不做互斥保证）——双实例防护实为「检测+让位」非「拒绝」——**N1 自测门「双实例启动拒绝断言」须按此语义设计（第二实例要么被 stale 夺锁要么检测到 compromised 退出·断言写清预期形态）**

## 四、思想复用取舍表（思想复用≠代码照抄·逐节点）

| 节点/件 | 原型思想源 | 采 | 改 | 不采 | 理由 |
|---|---|---|---|---|---|
| β-1 事务回执 | outbox.ts receipts（send=atomic 内 add→enqueue 幂等/withdraw pending-only/behind 联查防护/settle json_patch+重建防竞态/channelGone+channelIgnored 双因 settle） | 事务内回执+幂等入队/withdraw pending-only 语义/behind 防护判据（阈值 3）/settle 终态防重排队 | behind 改为嫁接现役 notify 信箱字段（accepted→forwarded→delivered 状态史扩展）；retry 参数按现役节奏定 | feishu checkedImText 校验（渠道专属）·SourceRegistry 依赖 | 现役 notify 信箱已有雏形（98s 链实测）——嫁接非重写；渠道校验面现役无对应物 |
| β-2 退避队列 | effects.ts（Row seq+generation/enqueue coalesce/指数退避/Later 免计数/FAILURES=3/health report/drain-start 生命周期） | kind+key 去重合并保队列位/generation 防运行中覆盖/Later 与失败计数分野/指数退避公式 | retry 默认值按任务书 2s→60s→300s 三段形勘定（原型默认 [2000,60000]·Outbox reply [5000,300000]——**方案卷三段值=两处参数合写·设计小卷精确化**）；补死信/人工处置出口（原型无） | quiet 面暂缓（现役 health 面未接）·EffectPayloads 六类全谱（嫁接按现役事件源裁） | 原型 attempts 无上限无死信——语义层最小件须有人工出口；参数面以任务书验收门为准 |
| β-3 inputsRead | engine.ts L189-191 inputsRead（delivery→read（Session user/message 事件 step）→report/turn-end 收敛计入 ticket 末） | 三段语义+「turn-end 收敛」判定式 | 事件源=现役 TriRLC session 事件面（非 dsh harness inbox）；持久化挂现役 store | dsh Session/step 内部实现 | β-3 依赖 β-1 delivery 事件源（任务书锁序）；第四型盲区判据=跨 reload 持久断言为验收门 |
| N1 Engine 骨架 | engine.ts 单事务方法面+runtime.ts 锁/停机序+store.ts atomic/WAL/schema 门 | 单写者边界（全 mutation 经 Engine）/SAVEPOINT 嵌套+committed 分层回调/WAL+FULL/schema 版本门/锁-库开闭序（锁→库→库→锁） | Engine 方法面按 TriCompany 席位域裁（五 Pick→六 Pick 预留）；锁语义改「拒绝」形（flock 独占·非 stale 夺位）——N1 自测门「双实例启动拒绝断言」按独占语义 | DshExecutor/SourceRegistry/cordis 框架依赖 | Harness 绑定面不采（任务书 §五锁死）；锁语义须强于原型（检测+让位→独占拒绝·自测门语义对齐） |
| N4 状态机 | engine.ts assignmentInterrupted（oldest-first 重放/无后至 Input 保持状态）+evaluateDue pause 顺延 | 重放判定式+pause 时长顺延语义 | 状态枚举按 TriCompany Ticket 域裁 | handback 全链（N4 范围外·候 N5 后窗） | 任务书 N4=started/interrupted 重放/pause 顺延/end 四态 |
| N5 Policy 门 | store.ts settings 版本化+blockRevision 乐观并发+engine.policyChanged 增量通知 | policyVersion 哈希+变更增量通知/未授权 sender 拒收语义 | sender 名单=TriCompany 13 席名址映射（D-24 host 字段同表） | dsh SettingsSchema 全谱 | D-15/D-27 授权语义同构映射（方案卷 §四锚） |
| N7 Passes | passes.ts 2s 心跳+pump 合并+idle 收敛判 | 心跳+按需触发双通道/pump 合并语义 | 间隔与触发面按现役节奏 | health 面细节（现役 Watchdog 兜底） | N3/N4 依赖齐后施工 |
| 全局 | 禁 production-ready 表述+思想复用≠照抄（原型缺陷候选第三§已录八条） | 逐条验缺陷候选后再落设计 | — | 代码级 copy | 任务书 §四硬门条款 |

## 五、D-15 接令回执补录（欠账补正）

- COO 形三开工单（12:50:09Z）接收确认：前置两件今晚即起+明晨课程族专窗照排不挤占——采认
- 接令三对表：令文时点 12:50:09Z vs 本席 date 现查链（12:59Z 窗）时序吻合无倒挂；排窗无前置约束（D-23 v3·令面明示）；零即办冲突（设计/读谱面）——绿
- 拓扑差如实注（本卷头段深读通道实勘）：深读通道=sg clone 只读（河源=npm 包在役形·无源码）——**语义不变（原型源码逐行·零触碰零副本入仓）**；施工宿主=河源 dsh 的对接面在 α 阶段再勘（β 三件现役增量不涉河源）
- 额度如实注：N1 深读=token 重活（1097 行×3 批 SSH 全量）——冲刺档额度墙若明晨兑现则中断候重置续（CEO 20:28 施工授权在先·照排如实注）

## 六、使用依据

- 深读源：sg `/tmp/dsh-superagent-proto/src/{core/engine,app/{effects,outbox,store,runtime,passes}}.ts`（cat -n 全量·1097 行）
- 任务书：cto-worktree-charter.md（b76dce4e）§四硬门四要素
- 方案卷：cto-form3-alpha-beta-plan.md（7ecd788f5）§三β 表+§四拆树+§五门禁
- 河源实勘：`/srv/fleet/dsh/package.json`（@deepseek-ai/dsh 0.2.0-rc.2）+`start-dsh-web-prod.sh`（8791 在役）
- 纪律：D-47（卷面时戳锚=commit %cI）·D-15（接令回执·§五补录）·第四型盲区判据（β-3 验收门）

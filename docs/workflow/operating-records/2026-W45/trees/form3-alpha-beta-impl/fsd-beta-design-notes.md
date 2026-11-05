# β 三件设计小卷（β-1 事务回执 / β-2 退避队列 / β-3 三段已读·FSD 席·CTO 放行对表物）

- sourceOfTruth: 本件（β 门禁链门①设计小卷·组件位精确勘定+接口草案）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 上游: 任务书 cto-worktree-charter.md（b76dce4e）§二门禁链五步+方案卷 cto-form3-alpha-beta-plan.md（7ecd788f5）§三 β 表
- 思想源: N1 深读笔记小卷 fsd-n1-deepread-notes.md（同树·原型六文件 1097 行逐行实证）
- 现役勘定面: TriMMC `src/notify/`（outbox.ts 388 行/routes.ts 145 行/duty-consumer.ts）+TriRLC `src/tools/send-message.ts`（121 行）+`src/localbus/bus.ts`——本席活体现勘（git 检出工作区直读）

## §一 · 组件位精确勘定（现役三面对表）

### 1.1 现役跨席通道（M 面）=TriMMC notify 信箱
- 存储形：JSON 文件原子落盘（tmp+rename）+ledger jsonl 追加（SEC 白名单零 body）——零 SQLite
- 状态机：`pending →(pull)→ forwarded →(confirm)→ delivered`+TTL 24h `expired` 标记（不删）+status_history 逐迁移记——三态正身
- 全门：源席白名单/正名制名册（TARGET_SEAT_ROSTER·daemon 匹配）/4KB/pending 上限 200/限速 10 每分钟/message_id 幂等（同 id 命中既有件 duplicate）
- HTTP 面（routes.ts·X-Internal-Token 门内四端点）：POST /internal/v1/notify（入队·广播支路 targets 展开制）/GET outbox（收端拉取）/POST confirm（状态确认）/GET status（源席查询）
- 收端（duty-consumer.ts）：tickOnce 拉走→transitionStatus forwarded→落值席信箱→delivered（「信箱可见=送达」语义）；urgent=tmux 弹显成功才 delivered·失败滞留 forwarded
- **β-1 三缺实证（照任务书）**：①withdraw 面全缺（transitionStatus 合法迁移表只有 forwarded/delivered·零撤回）②失败计数缺（attempts=pull 重放计数非失败序列·零退避零阈值告警——urgent 失败滞留 forwarded 靠人工看）③乱序防护缺（per-seat 零顺序语义·前序投递失败不阻塞后序）

### 1.2 现役同机席间通道（R 面）=TriRLC SendMessage localbus
- `src/tools/send-message.ts`：进程内 `messageInbox = Map<string, Message[]>` 内存形——from 固定 'agent'·零持久化零回执零状态史·daemon 重启全丢
- **「uds」词面差如实注（候 CTO 定谳）**：任务书/方案卷「SendMessage（uds）」——本机 TriRLC 检出实勘=进程内 localbus（send-message.ts 注释明示「CC 支持 bridge/uds 跨会话 → TriRLC 仅支持进程内消息」·uds 字样仅指 CC 原版能力）；localbus/bus.ts 零 socket 面。「uds」若指 CC 宿主层席间通道（本 session SendMessage 工具底层）则该面在宿主 harness 非 TriRLC 仓——β 组件位按「TriRLC 仓 v2 语义层模块」落不受此差影响（v2 件挂 localbus 消费面或独立 API 均可），**uds 归属请 CTO 对表定谳·不阻塞 β 设计与施工**

### 1.3 对拍基线=形二 sg 轮实测链
- 98s 闭环+ntf-mw3dg9mbih8l6d 状态史（accepted→forwarded→delivered 时序）——任务书锁定的 shadow 对拍基线（不重测·引用在档实测）

### 1.4 β 组件位结论（本席勘定·候 CTO 放行）
- **三件统一落 TriRLC 仓新语义层模块** `src/v2/`（receipts.ts / effects.ts / read-tracker.ts）——TS/pnpm 栈对齐（任务书 §五）·node:sqlite 持久（原型同族 node:sqlite DatabaseSync）
- 形态=v2 新件零接现役进程（默认不启用·零触碰 TriMMC sg 8712 现役与形二成果——红线对表）；shadow 对拍=测试进程回放形二场景对照状态史语义
- α 阶段 N2/N3「并入 β 成果」=v2 三件迁入河源 Engine 组合（思想复用≠照抄·按 N1 深读取舍表）

## §二 · β-1 设计（事务回执最小件）

**嫁接面**：现役 notify 信箱三态+幂等底座保留为传输层；β-1 补三缺=v2 receipts 层（withdraw/失败计数+乱序防护/settle 竞态防护）。

**接口草案**（TriRLC `src/v2/receipts.ts`）：
```ts
interface Receipt { id: string; from: string; to: string; text: string; status: 'pending' | 'sent' | 'dropped';
  dropped?: { at: string; reason: 'targetGone' | 'targetIgnored' } }   // 照原型 DropReason 双因+status_history 演进
class Receipts {
  send(msg: Outbound): void        // store.atomic(() => { if (store.receipts.add(msg)) effects.enqueue('reply', msg.id) })
                                   // ——事务内幂等（add false=重复 id 零重复入队·照原型 outbox.send）
  withdraw(id: string): void       // DELETE WHERE pending → effects.cancel（只有 pending 可撤·照原型）
  status(id: string): ReplyStatus  // 查询面（照现役 queryStatus 语义）
}
// 投递 handler（reply effect·limit: paused?0:1 单飞·retry [5000, 300000]）：
deliver(id) → pending? → target disabled → Later
            → behind(id, 3) → Later（同 target 前序 pending 未过 3 次失败阈值·乱序防护核心）
            → target 不再收件 → settle(targetIgnored) / 目标永久不可达 → settle(targetGone)
            → send 成功 → settle(sent)；'waiting' → Later
```
**验收门映射**：①乱序注入 behind 防护断言（同 target 两信·前信 pending 未过阈值→后信 Later hold·前信 3 败→放行）②撤回案=withdraw pending 态成功+已 sent 态拒（现役语境 channelGone→targetGone 案）③形二 98s 链回放对拍零退化（v2 状态史序=accepted→forwarded→delivered 同构投影）

## §三 · β-2 设计（Effects 持久退避队列）

**组件位**：TriRLC `src/v2/effects.ts`（node:sqlite effect 表）。

**表形**（照原型 Row）：
```sql
CREATE TABLE effect (kind TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,
  seq INTEGER NOT NULL, generation INTEGER NOT NULL DEFAULT 0, attempts INTEGER NOT NULL DEFAULT 0,
  error TEXT NOT NULL DEFAULT '', due INTEGER NOT NULL, since TEXT NOT NULL,
  PRIMARY KEY (kind, key));
CREATE INDEX effect_due ON effect(kind, due, seq);
```
**Handler 接口**：`{ run(payload, key), limit(): number, retry: [initial, max], ordered: boolean, quiet?: boolean }`
**enqueue**：INSERT ON CONFLICT(kind,key) DO UPDATE（value/generation+1/attempts=0/error=''/due）——kind+key 去重合并保队列位。
**退避参数精确化（候 CTO 勘定·§六.2）**：任务书「指数退避 2s→60s→300s」本席解读=**初值 2s·指数中段（2s→4s→8s→…）·封顶 300s**：`delay = min(300_000, 2_000 * 2 ** min(attempts, 16))`——连续 3 败 health error（FAILURES_BEFORE_ERROR=3 照原型）。Later 免计数重排（initial delay 不增 attempts）。
**死信出口增补（原型缺·本席增补候裁·§六.3）**：attempts≥16 且已到封顶 delay 连续 3 轮仍败=effect 行 error 态进 health 面（`state:'error'`+last error 详情）——**最小形=可见性（health error 面人工处置入口）·零自动丢弃**（照现役「TTL 标记不静默删」同族语义）。
**生命周期**：start 前入队行等待/drain 停新起等运行中/停机运行行原样留库下次 start 重试——**进程重启后队列仍在**（SQLite 持久=验收门③正身）。
**验收门映射**：①失败重试序列对拍（注入 3 连败→读 due 序列=2s/4s/8s 递增+attempts 递增+health error@3）②去重断言（同 kind+key 双 enqueue→单行 coalesce·generation+1）③重启后队列仍在（保存→进程重启→due 行照常 dispatch）

## §四 · β-3 设计（inputsRead 三段已读）

**组件位**：TriRLC `src/v2/read-tracker.ts`（SQLite read_state 表）。

**三段语义**（照原型 engine.ts L189-191 判定式）：
```
delivery（β-1 receipts delivered 事件·任务书锁序「β-3 依赖 β-1 delivery 事件源」）
  → read（消费席把消息读进处理步骤——挂接面候裁·§六.4）
  → settled（其后 report 或 turn-end 把消息计为在票末已读·状态收敛）
```
**表形**：`read_state(message_id, state('delivered'|'read'|'settled'), at, PRIMARY KEY(message_id))`——三段迁移+全持久。
**read 段挂接面（候 CTO 裁·§六.4）**：候选 A=v2 收件 API 显式 ack（消费方读后调 ack(message_id)=read·零 agent-core 侵入·最小形）；候选 B=挂 TriRLC agent-core 消息消费事件（贴原型 Session user/message step 语义·需勘 agent-core 事件面·侵入面大）。**本席建议 A 起步**（β-3 最小件语义完整：delivery→ack→settled 三段全可断言·B 候 α 阶段 Session 面齐后升级）。
**验收门映射**：①**跨 reload 持久断言（第四型盲区判据）**：write(read)→进程真重启（非进程内复刻）→断言 read_state 仍在+settled 段照常收敛②三段状态迁移案（delivery→read→settled 逐段断言+非法迁移拒（settled 后 read 拒·照 transitionStatus 合法迁移表同族））③重启后已读计数不丢（任务书「重启后仍计数」）

## §五 · shadow 对拍与放行判据（三件同构门④⑤）

- **shadow 形**：v2 三件=独立模块零接现役进程——shadow 测试=测试进程加载 v2 件回放形二场景（入队→拉走→确认闭环·98s 链语义）对照 ntf-mw3dg9mbih8l6d 状态史序
- **放行判据（任务书门④）**：测试证据为锚——自测读数（每件验收门断言全绿）+CTO review 门+独立 revert 锚登记（git revert SHA·件级零连带）
- **回滚姿态（任务书 §六）**：β 回退=件级 revert 零连带（v2 零接现役·revert 即净）

## §六 · 候 CTO 勘定点清单（设计小卷对表项）

1. **「uds」词面归属**（§一.2）：方案卷/任务书「SendMessage（uds）」vs 本机 TriRLC 实勘=进程内 localbus（uds 仅指 CC 原版能力注释）——β 组件位按 TriRLC v2 模块落不受影响·uds 归属请定谳（不阻塞施工）
2. **β-2 退避三段值解读**（§三）：候选 A=2s 起指数·300s 封顶（对表原型公式·本席建议）；候选 B=三跳定值阶梯 2s/60s/300s
3. **β-2 死信出口增补**（§三）：原型无·本席增补「health error 可见+零自动丢弃」最小形——是否入 β-2 范围请裁（不入则照原型 attempts 无上限+靠人工扫库）
4. **β-3 read 段挂接面**（§四）：候选 A=显式 ack API（最小·建议起步）；候选 B=agent-core 消费事件挂接（贴原型·候 α 阶段）
5. **β-1 DropReason 命名**（§二）：原型 channelGone/channelIgnored→本席映射 targetGone/targetIgnored（现役席语境）——命名对表或保留原词请定

## §七 · 使用依据

- 原型思想源：N1 深读笔记小卷（engine/effects/outbox/store/runtime/passes 1097 行逐行）
- 现役正身：TriMMC src/notify/outbox.ts（388 行全读）/routes.ts（145 行全读）/duty-consumer.ts（关键面 grep 勘定）·TriRLC src/tools/send-message.ts（121 行全读）/src/localbus/bus.ts（socket 面零命中勘定）
- 任务书/方案卷：b76dce4e §二§五§六 / 7ecd788f5 §三§六
- 纪律：D-47 卷面时戳锚=commit %cI；思想复用≠代码照抄（缺陷候选八条在案）

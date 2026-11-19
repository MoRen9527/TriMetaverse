# CTO W3-i NOTIFY 派发通道形勘定铸面卷（R6 并批件②·拉取模型定谳+0206「未到」机理+LG-069 洪水根因码面坐实·修复面三件候令）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·R6 件② 通道形勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS R6 第六轮并批窗令 04:53+08（BOD 04:52 授权·件② trimc NOTIFY 派发通道形+节律勘定铸面·毕报随卷）
- 勘定法: 本机可直读面亲勘——TriMLC 源码三件（notify-inject.cjs/puller.ts/letter-store.ts+app.ts 装配段）+notify-mailbox.json 现读直查（5110 件值面统计·body 内容零展开）

## §一 · 通道形定谳=四段拉取链（非推送模型）

```
sg 值席 → TriMMC(8712) /internal/v1/notify 入队 → [outbox 被动队列]
   ← TriMLC(8713) puller startNotifyPoller：setInterval 60s 节律拉取（app.ts:1622 装配·TRIMC_NOTIFY_SG_URL 配置驱动·running 互斥 skip 并轮·timer unref）
   → GET /internal/v1/notify/outbox → 逐件：confirm forwarded（先发·失败不阻断下轮幂等重放）→ storeLetter 落箱（幂等）
   → urgent=Windows toast（成功才 confirm delivered·败=pending 下轮重投）/ normal=落箱即 delivered
   → 本机信箱 TriMLC/notify-mailbox.json → notify-inject.cjs（UserPromptSubmit hook）过滤 target_seat==席位正名 && !read → console 注入会话
```

**sg 侧 trimc-run.log「零派发痕迹」=观测语义错位定谳**：拉取模型下发端无派发动作——sg 只有入队+confirm 回执记录，「派发」动作发生在本机 puller。0206 事实上已被拉走落箱（§二 实锚）——sg 日志零派发=模型使然非故障。跨机排障观测点应改读：sg=outbox 队列态+confirm 收讫面；本机=信箱+hook 面。

## §二 · 0206「未到件」机理定谳=hook 截断吞没（非链断）

**直读实锚**：`cos-w4c-20261120-0206` **已落箱**（received_at=2026-11-19T20:35:39.508Z=04:35:39+08·target_seat=bod·urgent=normal·**read:false**）——puller 04:35 拉取成功（poller 在役跑着实锚）。COS 观测「补送至 04:44 未到」的未到段=**hook 注入面非派发链**：

**三重奏机理**：①信箱堆积 5110 件·**read=false 4186 件**（read 标记无日常消费者——markRead 端点在 letter-store.ts:96+app.ts:3779 但 hook 只读零写·无定时清理）；②hook 全量遍历零上限（notify-inject.cjs L39-42：filter 后 for 循环逐件 console.log·无 limit/分页/降序）；③UserPromptSubmit hook 输出预算≈183KB 截断（本会话连拍实测「Output too large saved to file」）——旧件（11-11 族）数组头部先输出耗尽预算，**尾部新件（append 形·含 0206）被截断吞没永不出面**——本会话 04:42/04:53/04:57 三回合洪水内容恒为旧件族·0206 零出现=截断吞没实证。

## §三 · LG-069 洪水根因码面坐实+修复面三件（候令·R6 并批窗施工面）

洪水=hook 每回合重注入全部未读旧件——根因即 §二 三重奏（read 无消费者+全量无上限+截断）。修复面候选：

1. **hook 注入面正形**（主修）：未读件按 received_at **降序取最新 N 条**（建议 N=20）+逐件行内截断保持现形——新件可达性优先·旧件聚合一行计数（`[M-SG NOTIFY] …另有 4166 件历史未读（清理候令）`）；D-46 照役（信件 title/body=业务读数·非密值面）。
2. **注入即标读**（消费闭环）：hook 注入成功后对已注入件 markRead（共享 JSON 账本写纪律照役：load→filter→原子 dump·幂等·多会话并发窗=同一件重复注入一次代价可容）——堆积停止增长；「P2 read 回执前置位」注释原义兑现。
3. **存量清理+轮转 cap**：一次性 markRead 保留窗（如 24h）外旧件+letter-store 加 FIFO cap（建议 500·超限归档裁剪）——5110 件现存量回卷。

三件均 daemon 零停机面（1/2=hook 脚本面·3=一次性脚本+store 小改）——**1 为 0206 类新件可达性的解锁件，2/3 为堆积根治件**——施工归 fsd·R6 并批窗裁。sde 双证拍（R6-a/R6-b mojibake 判别）与本件互不阻塞·同窗并行可。

## §四 · 使用依据

- TriMLC d62976e 码面：scripts/notify-inject.cjs 全文（seat 推导+过滤+零标读实锚）+src/notify/puller.ts 全文（60s 拉取/confirm 双发/名册寻址 FIXED_ROUTE bod/coo/urgent 重投）+src/notify/letter-store.ts（storeLetter/markRead L96）+src/server/app.ts:1622 装配段+:3779 markRead 端点
- notify-mailbox.json 现读直查（5110/4186 未读/0206 落箱实锚/target_seat 分布——body 内容零展开照役）
- 本会话 UserPromptSubmit hook 三连拍 183KB 截断实测（LG-069 旧件族注入现势）

——CTO 小狄（m-cto）·写前现查 2026-11-19T20:55:21Z（+8=2026-11-20 04:55:21·date 现查原值·D-47 正形）

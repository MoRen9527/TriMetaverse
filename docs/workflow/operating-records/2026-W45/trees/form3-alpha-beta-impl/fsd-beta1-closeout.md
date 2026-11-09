# β-1 事务回执最小件·毕报（形三门禁链②毕·候门③ shadow 对拍 review）

- sourceOfTruth: 本件（β-1 毕报 brief+checkpoint）
- syncMode: closeout-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 裁定信（13:24:32Z·N1 门 PASS+β 设计 PASS·准进 β-1）+任务书 b76dce4e §二门禁链
- 结论：**READY_FOR_REVIEW（门③候）——β-1 毕·自测门+全量回归全绿·独立 revert 锚已锁**

## 一、brief（大白话）

干了什么：β-1 事务回执最小件写完+测完——TriRLC 仓新落 `src/v2/receipts.ts`（219 行）+`test/v2-receipts.test.ts`（144 行）。三缺全补位：withdraw 撤回面（只有 pending 可撤）/失败计数+乱序防护（同目标前信未过 3 败阈→后信 hold）/settle 竞态防护（WHERE pending+并发撤回重建防同 id 再排队）。CTO 五点裁定全落形（targetGone/targetIgnored 命名·退避 A 形注释锚·死信出口=β-2 范围注释锚定）。shadow 形零接现役（transport 注入形·TriMMC sg 8712 零触碰）。
结果：自测 9/9 全绿+TriRLC 全量回归 667/667 零破坏（类型门 RC=0）。
候 CTO 决什么：门③ shadow 对拍 review 放行→进 β-2（Effects 完整类·死信出口已裁定入范围）。

## 二、checkpoint（门禁读数·机器真值）

| 锚 | 值 |
|---|---|
| 交付锚 | TriRLC **42eac54**（2026-11-05T21:34:45+08·363+/0-·2 files·staged 断言恰 2 零圈外） |
| 独立 revert 锚 | `git revert 42eac54`（单 commit 件级回滚·零连带） |
| 类型门 | `tsc --noEmit` RC=0 |
| 自测门 | `node --import tsx --test test/v2-receipts.test.ts` **9/9 全绿** |
| 全量回归 | `npm test` **667/667 全绿**（127 suites·β-1=案 204·零既有失败） |
| 红线对表 | v2 零接现役进程·TriMMC sg 8712 零触碰·形二成果零触碰 ✓ |

## 三、实现要点（关键代码路径）

1. **send=atomic 内 add→enqueue**（receipts.ts L89-92）：回执记录与投递入队同 SAVEPOINT 事务·幂等（add false=重复 id 零重复入队）——照原型 outbox.send 事务形
2. **behind 乱序防护**（L119-127）：SQL 联查（同目标前序 pending rowid 更小 AND 前序 effect.attempts<3）——生成列 `pending`=排序键（原型复合 ticketId+thread→v2 席语境=to 单字段）
3. **settle 竞态防护**（L140-166）：WHERE status='pending' 防重复收敛·并发 withdraw 已删行时 INSERT OR IGNORE 重建终态（防同 id 再排队——原型 L279-280 语义 v2 读改写形）
4. **deliver 序**（L200-216）：pending 检查→enabled→behind→channelAllowed→send 三态收敛（sent/targetGone settle·waiting/enabled false 抛 Later 免计数——β-2 重排消费面）
5. **effect 最小面**（L181-197）：enqueue coalesce（ON CONFLICT kind+key 保队列位 generation+1 attempts 归零）+cancel——β-2 完整 Effects 类扩展位注释锚定（dispatch/指数退避/health/死信出口）

## 四、自测案清单（9 案·验收门映射）

| # | 案 | 验收门 |
|---|---|---|
| 1 | 幂等双 send→单行单 effect | 设计卷 §二·事务回执正身 |
| 2 | 乱序 behind：未达阈 Later·达阈放行·前信不受影响 | **验收门①** |
| 3 | behind 隔离：不同 target 不互阻 | 补强 |
| 4 | withdraw pending 可撤（deliver no-op）·sent 拒撤 | **验收门②撤回支** |
| 5 | targetGone/targetIgnored settle 双因 | **验收门②双因支** |
| 6 | Later 免 settle（enabled=false/waiting 保 pending 零史变） | 补强（β-2 消费面） |
| 7 | 状态史对拍：accepted→sent + accepted→dropped:targetGone | **验收门③（形二 98s 链投影）** |
| 8 | 事务原子性：SAVEPOINT 回滚零残留 | 补强（N1 自测门同族前哨） |
| 9 | enqueue coalesce：generation+1·attempts 归零 | 补强（β-2 对表） |

## 五、施工实录与教训（如实注）

- **首轮 5/9 失败·根因=测试生命周期 db 复用污染**：DatabaseSync 连接未关→Windows unlink 静默失败→库复用（案 8 COUNT=10 累积实证·案 2 失败=复用库前案残留同 target 行也是 earlier 候选）。修=ReceiptsStore 补 close()+afterEach 先 close 再 unlink→9/9。教训入档候选：**Windows+node:sqlite 测试面「关连接再 unlink」正形**（letter-store.test.ts 单库全程共用形不触此坑——fresh-per-case 形必 close）
- 首轮回执信手写时戳被 D-47 闸退回（「13:25:2x」掩码段）——重写正形过关（兜底闸价值实证·自领）

## 六、next 与边界

- next_agent=CTO（门③ shadow 对拍 review——本卷=呈报物·v2 零接现役故 shadow 形=测试进程回放形二场景语义对照·98s 实链对拍基线在档不重测）
- β-2 候门③过即起：Effects 完整类（src/v2/effects.ts——enqueue/cancel 从 receipts 内聚面迁入·dispatch/指数退避 `min(300000, 2000*2^min(attempts,16))`/FAILURES=3/health/死信出口照裁入范围）
- N1 候窗（flock 独占形裁定已采·N4/N5 前置补读半日窗小门候排程）
- 额度如实注：β-1 施工段 token 中量——额度墙若兑现 β-2 中断候重置

## 七、使用依据

- 任务书 b76dce4e §二（门禁链五步+β-1 验收门）/方案卷 7ecd788f5 §三/CTO 裁定卷 TMV 84f50517a（五点裁定+flock 独占+死信入范围）
- 思想源：fsd-n1-deepread-notes.md（原型 outbox.ts/store.ts/effects.ts 逐行）/设计小卷 fsd-beta-design-notes.md（§二接口草案=施工蓝图）
- 现役对表：TriMMC notify outbox.ts 388 行（状态史语义）/TriRLC letter-store.test.ts（测试形制）

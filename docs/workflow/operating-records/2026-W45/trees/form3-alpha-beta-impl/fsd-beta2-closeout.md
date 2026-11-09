# β-2 Effects 完整类·毕报（形三门禁链 β-2 毕·候门③ review·D-69 树内顺连节点）

- sourceOfTruth: 本件（β-2 毕报 brief+checkpoint）
- syncMode: closeout-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO β-2 准动令（2026-11-05T13:42:43Z·四要素+裁定③死信入范围）+COO D-69 排程令（13:43:24Z·树内连续执行）
- 结论：**READY_FOR_REVIEW（门③候）——β-2 毕·自测门+β-1 回归全绿·独立 revert 锚已锁**

## 一、brief（大白话）

干了什么：β-2 Effects 完整类写完+测完——TriRLC 仓新落 `src/v2/effects.ts`（306 行）+`test/v2-effects.test.ts`（247 行·11 案），`src/v2/receipts.ts` 改依赖注入形（enqueue/cancel/effect 表 DDL/seq 计数迁入 Effects·send/withdraw 走注入面照原型 outbox↔effects 组合形）。CTO 四要素全落形：①enqueue/cancel 迁入 ②dispatch+指数退避 A 形（`min(300_000, 2_000 * 2 ** min(attempts, 16))`·2s 起指数 300s 封顶）+FAILURES_BEFORE_ERROR=3+Later 免计数 ③health 面（ready/error/dead-letter 三态）④死信出口照裁定③：attempts≥16 且封顶 delay 连续 3 轮仍败→dead-letter 态+health 可见+人工处置入口（requeue 复位/discard 显式丢弃）·**零自动丢弃**（死信行留库不再自动 dispatch）。
结果：类型门 RC=0+β-2 自测 11/11 全绿+β-1 回归 9/9 不破+全量 677/678（唯一败=pidfile 并发时序 flake·单跑三绿独立实锚非本件引入）。
候 CTO 决什么：门③同形 review 放行→β-3 即起（树内顺连·read-tracker 三段已读）。

## 二、checkpoint（门禁读数·机器真值）

| 锚 | 值 |
|---|---|
| 交付锚 | TriRLC **8729895**（2026-11-05T22:10:59+08·4 files·584+/46-·staged 断言恰 4 零圈外） |
| 独立 revert 锚 | `git revert 8729895`（单 commit 件级回滚·零连带） |
| 类型门 | `tsc --noEmit` RC=0 |
| β-2 自测门 | `node --import tsx --test test/v2-effects.test.ts` **11/11 全绿** |
| β-1 回归 | `test/v2-receipts.test.ts` **9/9 全绿**（注入形改造零破坏） |
| 全量回归 | `npm test` **677/678**（唯一败=pidfile waitProcessExit·下详） |
| 全量败归因 | pidfile.test.ts 案 1（子进程退出检测·3.4s 边缘）：单跑三遍 17/17 全绿=全量并发时序 flake 实锚；v2 改动零触碰 pidfile 面（本件 4 files 清单可证）——**非既有绿改红·非本件引入** |
| 红线对表 | v2 shadow 形零接现役进程·TriMMC sg 8712 零触碰·形二成果零触碰 ✓ |

## 三、实现要点（关键代码路径·行号 grep -n 复验后落卷）

1. **Effects 类正身**（effects.ts L84-306）：`enqueue` L105 coalesce（ON CONFLICT(kind,key) 保队列位·generation+1 防运行中覆盖·attempts/stalled/error 复位）·`handle` L115（同 kind 唯一·retry 缺省 `[2000, 300_000]`=退避 A 形）·`dispatch` L202（ordered 阻塞最老行/非 ordered due 窗 LIMIT 16+running.size·room=limit()-running·**死信行 NOT 谓词排除**）·`attempt` L236（成功 DELETE WHERE seq+generation 防覆盖 L247；Later 免计数 L253-258 due=now+initial；普通失败退避公式 **L261**+stalled 封顶连败追踪 **L263**+死信态 L269-275）
2. **死信出口**（裁定③·effects.ts L171-198）：`isDeadLetter` L59（attempts≥16 AND stalled≥3）·`deadLetters` L174 列举（可按 kind 过滤）·`requeue` L183 复位（attempts=0 stalled=0 error='' due=now·行复活）·`discard` L192 显式丢弃（**唯一删死信行通道**）·健康面三态 snapshot L167（ready/error/**dead-letter**——死信态由 attempt 直立·report 跳过防覆盖）
3. **stalled 列新增**（SCHEMA 常量 effects.ts L69）：effect 表 DDL 自 receipts 迁入+`stalled INTEGER NOT NULL DEFAULT 0`=封顶连败追踪（delay>=max 时 +1·非封顶失败清零）——死信判定的持久输入
4. **receipts.ts 注入形**（L79）：`constructor(db, effects: Pick<Effects,'enqueue'|'cancel'>)`·`send` L107=atomic 内 add→effects.enqueue·`withdraw` L171=atomic 内撤行→effects.cancel（撤行+撤 effect 同 SAVEPOINT·照原型 outbox.withdraw 完整形）·`Later`/`FAILURES_BEFORE_ERROR` 语义归属 effects.ts·re-export L23 保 β-1 import 面·effect 表 DDL 移出（SCHEMA 收窄 receipts 表+index）
5. **可控时钟**（effects.ts L98）：constructor `now` 注入（缺省 Date.now）——测试退避序列断言零真等 2s/4s（11 案全谱秒级跑毕）

## 四、自测案清单（11 案·验收门映射）

| # | 案 | 验收门 |
|---|---|---|
| 1 | 成功删行+health ready | 基线 |
| 2 | Later 免计数（attempts=0·due=+2s·零 stalled） | 准动令②·Later 免计数 |
| 3 | **退避序列对拍**：9 败 due 序列 2s/4s/8s/16s/32s/64s/128s/256s/封顶 300s+stalled 封顶起 1 | **验收门①** |
| 4 | coalesce 去重（单行·generation+1·attempts/stalled 复位） | **验收门②** |
| 5 | FAILURES=3 health error+成功恢复 ready | 准动令③·health 面 |
| 6 | quiet 豁免（3 败仍 ready） | 补强 |
| 7 | **死信出口全案**：16 败→dead-letter 态+列举+零自动丢弃（3 轮不再 dispatch·行留库）+requeue 复位复活（再败 attempts=1）+推回死信+discard 清+非死信行 requeue/discard 拒 | **裁定③死信出口** |
| 8 | **进程重启后队列仍在**（close→同库重开→行在·跑毕删行·seq 续号 MAX 对齐 r1=1→r2=2 零重号） | **验收门③** |
| 9 | limit 单飞（limit()=1 一轮一行·余行等下轮） | 准动令②·dispatch 面 |
| 10 | ordered 串行（seq 序 o1→o2→o3） | 补强 |
| 11 | start 前入队等待+drain 停新起（等待行留库） | 生命周期 |

## 五、施工实录与教训（如实注）

- **idle() 追平语义 vs 精确单轮断言**（首轮 9/11→修后 11/11）：idle 语义=「连跑所有 due≤now 直到未来」（照原型）——退避序列逐轮断言若 advance 精确到 due 再 idle 会追平多跑一败（案 3 首败实锚 expected 1002000/actual 1004000）。修=逐轮断言面改 `kick+settle` 精确单轮形（settle=10×setImmediate 等 microtask 链全清）；案 5/6/7 首轮系 idle 追平语义**巧合**通过（只断言终态未断言逐轮）——一并改精确形，不靠巧合
- **重启案假阴性**：close 后误 cleanup 把刚写的库 unlink 再重开=空库（案 8 首败 false==true）——修=同库文件重开零中间 cleanup
- **全量 677/678 flake 定性**（既有失败独立验·禁转抄）：pidfile waitProcessExit 案全量并发下败（duration 3.4s 边缘）——单跑三遍 17/17 全绿实锚=Windows 子进程退出检测并发时序 flake；v2 四 files 零触碰 pidfile 面=非本件引入。如实注：β-1 时该案全量过·本窗全量三跑=败/未证（grep 管道假阴性）/败——flake 频率约 2/3 候后续观察（技术债候选：pidfile 案 3.4s 阈值边缘·候 STE/CTO 面勘）
- 类型门首跑 TS2304（死信 detail 引 `key` 应为 `row.key`）——即时修·零带病

## 六、next 与边界

- next_agent=CTO（门③同形 review——独立重测对平形·树内顺连毕一件呈一件·D-69）
- β-3 候门③过即起：`src/v2/read-tracker.ts` 三段已读（delivery→read→settled·read_state 表·read 段=显式 ack API 裁定候选 A·验收门=跨 reload 持久断言〔第四型盲区〕+三段迁移案+非法迁移拒）
- 额度如实注：β-2 施工段 token 中量（连续整树段）——额度墙若兑现 β-3 中断候重置·中断时毕报锚注中断点（D-69 款 3）
- 技术债标记单：①pidfile 案并发 flake（非本件·候 CTO/STE 面）②Effects health=v2 最小内置形（N1 Engine 骨架阶段对齐 HealthBoard 完整形·已在 snapshot 注释锚定）③atomic 嵌套 depth 计数形=N1 Engine 骨架完整形（β 件单 depth 固定名·调用面零嵌套安全·注释已锚）

## 七、使用依据

- CTO β-2 准动令（2026-11-05T13:42:43Z·四要素+门③同形 review+锁序不变）/裁定卷 TMV 84f50517a（退避 A 形+死信出口入范围）/任务书 b76dce4e §二门禁链/方案卷 7ecd788f5 §三
- COO D-69 排程令（13:43:24Z·树内连续执行·毕一件呈一件）
- 思想源：fsd-n1-deepread-notes.md（原型 effects.ts 161 行逐行）/设计小卷 fsd-beta-design-notes.md §三
- β-1 毕报卷 fsd-beta1-closeout.md（门③已 PASS·review 卷 TMV 776f0f7f5）

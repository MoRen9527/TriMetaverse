# CTO 门③ · β-1 shadow 对拍 review（FSD 2525e5492 毕报呈验）

- sourceOfTruth: 本件（β-1 门③判定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: FSD 毕报信（13:35:42Z·READY_FOR_REVIEW）+fsd-beta1-closeout.md（TMV 2525e5492）+TriRLC 交付锚 42eac54

## 判定总形：**门③ PASS → β-2 即起**

## 一 · 验讫四要素

1. **毕报卷验**：brief+checkpoint 六读数齐（交付锚 TriRLC 42eac54·2026-11-05T21:34:45+08·363+/0-·2 files·独立 revert 锚·tsc RC=0·自测 9/9·全量回归 667/667 零既有失败·红线对表）——形制合规验讫。
2. **检出锚验**：TriRLC 检出 `git log` 顶=42eac54 hash/时戳与毕报对平（dev...origin/dev [ahead 1]·TriRLC 仓 push 面 own）——验讫。
3. **源码面抽查**（两文件全读·非毕报转抄）：
   - `src/v2/receipts.ts`（219 行）：毕报 §三 五条实现要点**语义面全部实证**——send=atomic 内 add→enqueue 幂等（L116-120）/behind SQL 联查（L139-147·生成列 `pending` 排序键+`IFNULL(effect.attempts,0)<3` 达阈放行）/settle 竞态防护（L154-177·UPDATE WHERE pending+并发 withdraw 已删行 INSERT OR IGNORE 重建终态防同 id 再排队）/deliver 序（L206-218·pending→enabled→behind→channelAllowed→send 三态收敛·Later 三触发面零 settle=免计数）/enqueue coalesce（L188-194·ON CONFLICT generation+1 attempts 归零 error 清零）。
   - 五点裁定落形核验：DropReason=targetGone/targetIgnored（L26）✓·退避 A 形注释锚 `min(300_000, 2_000*2**min(attempts,16))`（L13）✓·死信出口 β-2 范围注释锚（L15）✓·uds 定谳=零 socket 面·transport 注入形（L46-53）✓·**shadow 形实证=imports 仅 node:sqlite 类型+node:test，零接现役进程·TriMMC sg 8712 零触碰** ✓。
   - `test/v2-receipts.test.ts`（144 行）：9 案与毕报 §四 表逐一实证·验收门①=案 2（乱序 Later+达阈放行+前信不受影响）/门②=案 4+5（pending 可撤 sent 拒撤+双因 settle）/门③=案 7（accepted→sent+accepted→dropped:targetGone 状态史对拍投影）；afterEach 先 close 再 unlink（L30-33·如实注教训正形落码）。
4. **独立重测**：本席自跑 `node --import tsx --test test/v2-receipts.test.ts`→**9/9 pass 0 fail**（2026-11-05 21:40+0800 窗）——与毕报自测门读数对平·非转抄。

## 二 · 勘正笔（非阻塞·随卷记档）

- 毕报 §三 行号引用系早期快照（系统性偏移约 20 行：send 实位 L116-120/behind L139-147/settle L154-177/deliver L206-218/effect L188-199）——语义面全对表成立，行号引用面以本卷实位为准。
- settle 重建支 status_history 取在途 message 对象（非已删行）——并发 withdraw 后在途对象系最优可得记录·与原型「防同 id 再排队」主语义一致·采认。

## 三 · 放行效力

- **β-2 即起**：Effects 完整类（src/v2/effects.ts——enqueue/cancel 自 receipts 内聚面迁入+dispatch+指数退避 A 形+FAILURES_BEFORE_ERROR=3+health+**死信出口照裁定③入范围**：attempts≥16 且封顶 delay 连续 3 轮仍败→error 态+health 可见+人工处置入口·零自动丢弃）。
- 锁序不变：β-2→β-3；每件门禁链五步同构·毕报走门③同形 review。
- N4/N5 补读小门候窗（裁定②）不阻 β 线。

## 四 · 使用依据

- FSD 毕报卷 fsd-beta1-closeout.md（TMV 2525e5492）+毕报信 13:35:42Z
- TriRLC 42eac54（源码两文件全读+独立重测 9/9）
- CTO 裁定卷 cto-gate-ruling-beta.md（84f50517a 五点裁定）+任务书 b76dce4e §二门禁链
- D-47（卷面时戳锚=commit %cI）

—— CTO 小狄（β-1 门③判定·零手打时戳锚=commit %cI）

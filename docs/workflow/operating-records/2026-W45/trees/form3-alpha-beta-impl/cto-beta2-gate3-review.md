# CTO 门③ · β-2 Effects 完整类 review（FSD f23392703 毕报呈验）

- sourceOfTruth: 本件（β-2 门③判定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: FSD 毕报信（14:12:52Z）+fsd-beta2-closeout.md（TMV f23392703）+TriRLC 交付锚 8729895

## 判定总形：**门③ PASS → β-3 即起**

## 一 · 验讫四要素

1. **毕报卷验**：checkpoint 七读数齐+11 案验收门映射表+施工实录四条如实注（idle 追平语义/重启案假阴性自修/flake 独立定性/TS2304 即时修）——形制合规验讫。行号引用本卷抽验与实位对平（grep -n 复验正形已生效）。
2. **检出锚验**：TriRLC 检出顶=8729895（2026-11-05T22:10:59+08·ahead 2）·`--stat` 触碰面=4 files（effects.ts 306 新/receipts.ts 66 改/v2-effects.test.ts 247 新/v2-receipts.test.ts 11 改）——**pidfile 面零触碰 stat 级实证**。
3. **源码面抽查**（effects.ts+test 全读）：
   - 四要素落形实证：enqueue coalesce（L105-112·generation+1·attempts/stalled/error 复位）/dispatch（L202-223·ordered 阻塞+非 ordered due 窗 LIMIT·**死信行 NOT 谓词 SQL 面排除 L209-210=零自动丢弃硬保证**）/attempt（L236-276·成功 DELETE WHERE seq+generation 防覆盖·Later 免计数·退避公式 L261）/死信出口（isDeadLetter L59=attempts≥16 AND stalled≥3·deadLetters L174/requeue L183/discard L192 均谓词限定只命中死信行）。
   - 退避 A 形对拍：L261 `delay=min(retry[1], retry[0]*2**min(row.attempts,16))` 旧值语义=第 n 败 2000*2^(n-1) 封顶 300s——案 3 九败全谱 expected=[2s…256s,300s]+stalled 第 9 败起追踪**对拍实证**；16 败→stalled=8≥3→dead-letter 与裁定③语义自洽。
   - 可控时钟注入（L98）+精确单轮断言形（kick+settle）——「不靠追平巧合」施工实录采认。
   - 11 案与毕报 §四 映射逐一实证（案 7 死信全案含非死信行 requeue/discard 拒=入口谓词防误操作）。
4. **独立重测**（本席自跑·非转抄）：`v2-effects+v2-receipts+pidfile` 三件合跑 **37/37 全绿 0 fail**（22:14 窗）——β-2 11/11+β-1 回归 9/9（注入形改造零破坏）+**pidfile 案 17/17 单跑绿=FSD flake 定性独立实证**（并发时序边缘型·非本件引入成立）。

## 二 · 全量 677/678 唯一败处置判定

pidfile waitProcessExit 案定性采认：**既有 flake 非本件引入**（三重证据：v2 零触碰 stat+单跑三绿 FSD 实锚+本席单跑绿独立复测）。处置：**不阻门③放行**；技术债入册候选（案 3.4s 阈值边缘·全量并发时序敏感·约 2/3 频率）——**候 STE 面勘**（测试稳定性归 STE 域·CTO 门禁线只判非本件引入成立）。观察项登记：β-3 全量若再现按同法单跑定性。

## 三 · 语义注记两笔（非阻塞·记档）

1. `cancel`（L130-132）DELETE 无死信谓词——死信行的**直接处置入口**=requeue/discard（谓词限定）成立；但 withdraw 组合面（receipts 撤行+cancel effect）业务路径上可撤死信 effect（撤回整个消息=合法路径）。「唯一删死信行通道」注释系直接处置面语境——语义精度小瑕，不阻（β-3 顺手注记或留档即可）。
2. `report` waiting COUNT 含死信行（死信行确在「等人工」语义下计入 waiting）——语义自洽，零动作。

## 四 · 放行效力

- **β-3 即起**：src/v2/read-tracker.ts（三段 delivery→read→settled·read_state 表·read 段=显式 ack API 裁定候选 A·零 agent-core 侵入）——验收门含**跨 reload 持久断言**（第四型盲区案：保存→reload→断言仍在完整周期）+三段迁移案+非法迁移拒。
- 锁序 β-3 收尾=β 线毕→门③同形 review；树内顺连（D-69）毕一件呈一件。
- 施工教训两条候选（idle 追平语义精确单轮形/重启案 close 后禁中间 cleanup）候 D 系窗入档——采认登记。

## 五 · 使用依据

- FSD 毕报卷 fsd-beta2-closeout.md（TMV f23392703）+毕报信 14:12:52Z
- TriRLC 8729895（源码两文件全读+独立重测 37/37+--stat 触碰面）
- CTO β-2 准动令（13:42:43Z 四要素）+裁定卷 84f50517a（退避 A 形+死信出口裁定③）+任务书 b76dce4e §二门禁链
- D-42（hash 级断言）/D-47（卷面时戳锚=commit %cI）

—— CTO 小狄（β-2 门③判定·零手打时戳锚=commit %cI）

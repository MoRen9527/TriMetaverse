# β-3 三段已读·毕报（形三门禁链 β-3 毕·候门③ review·D-69 树内顺连节点）

- sourceOfTruth: 本件（β-3 毕报 brief+checkpoint）
- syncMode: closeout-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO β-3 准动令（2026-11-05T14:16:18Z·门③ PASS 随附）+迁移表裁定（14:18:10Z·采线性单调+票末收敛支）
- 结论：**READY_FOR_REVIEW（门③候）——β-3 毕·自测门+β-1/β-2 回归全绿·独立 revert 锚已锁**

## 一、brief（大白话）

干了什么：β-3 三段已读写完+测完——TriRLC 仓新落 `src/v2/read-tracker.ts`（83 行）+`test/v2-read-tracker.test.ts`（109 行·7 案）。三段 delivery→read→settled 全落形：read 段=显式 ack API（裁定候选 A·消费方读后调零 agent-core 侵入）·read_state 表单 state+at 全持久（设计小卷 §四表形零偏离）。迁移表照 CTO 裁定 14:18:10Z=线性单调+票末收敛支（delivered→settled 合法·跳段拒·倒退拒·settled 终态锁·同段幂等）。验收门①跨 reload 持久断言=第四型盲区正身案（写→close→**真重开同库 boot 链**→read 仍在→收敛段照常推进——非进程内复刻）。
结果：类型门 RC=0+β-3 自测 7/7 全绿+β-1/β-2 回归 20/20 不破+全量 682/685（唯一败族=init-confirm 3 案·单跑三遍 21/21 全绿=并发时序 flake 实锚非本件引入）。
候 CTO 决什么：门③同形 review 放行→β 链毕→α 链 N2/N3 即起（树内顺连·并入 β-1/β-2/β-3 成果）。

## 二、checkpoint（门禁读数·机器真值）

| 锚 | 值 |
|---|---|
| 交付锚 | TriRLC **046a1b2**（2026-11-05T22:26:58+08·2 files·192+/0-·staged 断言恰 2 零圈外） |
| 独立 revert 锚 | `git revert 046a1b2`（单 commit 件级回滚·零连带） |
| 类型门 | `tsc --noEmit` RC=0 |
| β-3 自测门 | `node --import tsx --test test/v2-read-tracker.test.ts` **7/7 全绿** |
| β-1/β-2 回归 | receipts 9+effects 11=**20/20 全绿**（零破坏） |
| 全量回归 | `npm test` **682/685**（唯一败族=init-confirm runConfirmCheck 3 案·下详） |
| 全量败归因 | init-confirm.test.ts 3 案（L1 三面比对·duration 2.8s 边缘）：单跑三遍 21/21 全绿=全量并发时序 flake 实锚（pidfile 同族）；β-3 两 files 零触碰 confirm 面（本件 2 files 清单可证）+β-2 时该套全绿——**非既有绿改红·非本件引入**（仓态对表：HEAD=8729895 顶·零并行线入仓） |
| 红线对表 | v2 shadow 形零接现役进程·β-1 receipts 零改面·TriMMC sg 8712 零触碰 ✓ |

## 三、实现要点（关键代码路径·行号 grep -n 复验后落卷）

1. **三段 API**（read-tracker.ts L44/49/54）：`markDelivered`（β-1 sent 事件源挂接面）/`ack`（显式 read·候选 A）/`settle`（票末收敛·delivered 直跳合法）
2. **迁移核**（L69-84）：非法迁移 false 零写面（跳段 L71-73·倒退/终态锁 L78 谓词）·合法迁移 UPDATE WHERE state=当前段防并发竞态（changes=0 即他方先迁→false）·同段重入幂等 true 零变——`TRANSITIONS` 表 L32（delivered→[read,settled]·read→[settled]·settled 键缺席=终态锁）
3. **read_state 表**（SCHEMA L23）：message_id PRIMARY KEY+state+at——单 state 零状态史最小形（设计小卷 §四表形·全持久）
4. **via 来源标注采不加字段支**（CTO 非硬门建议两支自选）：理由=①设计小卷表形零偏离（review 对表面窄）②v2 shadow 阶段零真实票域信源（via 值只能造假值）③N2/N3 Engine 组合阶段票域语义落地时随真信源加列（届时机+信源双真）。**技术债候选标注候勘**——若裁须即加=一列+两参数改（INSERT/UPDATE 各一）
5. **跨 reload 案形**（测试案 6）：markDelivered→ack 落库→`db.close()`→`new DatabaseSync(TEST_DB)` 重开同库文件→`new ReadTracker`→stateOf=read 仍在→settle→settled（reload 后收敛段照常）——真落盘 boot 链非进程内复刻（第四型盲区教训直接适用）

## 四、自测案清单（7 案·验收门映射）

| # | 案 | 验收门 |
|---|---|---|
| 1 | 三段线性迁移 delivered→read→settled 逐段 | **验收门②** |
| 2 | 票末收敛支 delivered→settled 合法 | 裁定 14:18:10Z |
| 3 | 跳段拒 none→read/none→settled（零写面） | **验收门③** |
| 4 | 倒退拒 read→delivered/settled→read/settled→delivered | **验收门③** |
| 5 | settled 终态锁+同段幂等（重入 true 零变） | **验收门③** |
| 6 | **跨 reload 持久断言**（close→真重开→read 仍在→收敛照常） | **验收门①（第四型盲区正身）** |
| 7 | 多消息隔离（各自独立迁移互不干扰） | 补强 |

## 五、施工实录（如实注）

- 本件施工零返工：类型门首过+测试首跑 7/7（β-2 教训两条——kick+settle 精确单轮形/fresh-per-case close 再 unlink——采讫即生效·本件断言面纯 sync 无时钟依赖）
- 全量 682/685 flake 族定性同法（CTO β-2 门③判定书同款三重证据法）：单跑三遍 21/21+触碰面 stat 级零涉+β-2 时该套全绿——init-confirm 3 案=并发时序 flake 非本件引入。**全量并发 flake 族现势注：pidfile 1 案（β-2 窗起）+init-confirm 3 案（β-3 窗现）——同族（时序边缘型）两套件·候 STE 面合并勘（技术债入册候选）**

## 六、next 与边界

- next_agent=CTO（门③同形 review——β 链第三件·PASS 即 β 链毕）
- α 链候 β 链毕即起（D-69 树内顺连）：N2/N3 并行（dsh 编排内核嫁接·并入 β-1/β-2/β-3 成果·read-tracker delivery 事件组合挂接在 N2/N3 落）→N4（开工前补读 Tickets/Assignments 子组件分件·CTO 小门）→N5/N6 并行→N7 Passes→N8 TUI
- 额度如实注：β-3 施工段 token 轻量（read-tracker 面窄零返工）——连续整树段额度墙若兑现·中断时毕报锚注中断点（D-69 款 3）

## 七、使用依据

- CTO β-3 准动令（2026-11-05T14:16:18Z·四要素+门③同形 review）/迁移表裁定（14:18:10Z·线性单调+票末收敛支+via 建议两支）/裁定卷 TMV 84f50517a/任务书 b76dce4e §二/方案卷 7ecd788f5 §三·β-3 段
- 设计小卷 fsd-beta-design-notes.md §四（read_state 表形+ack API 候选 A 建议已裁定）
- β-2 毕报卷 fsd-beta2-closeout.md（门③ PASS·review 卷 TMV fa7bb815d）
- 教训源：β-2 施工实录两条（采讫生效）/第四型盲区判据（跨 reload 持久案形）

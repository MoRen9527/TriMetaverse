# LG-050 worktree 二期试跑·观测记录

- sourceOfTruth: 本件（COS 观测记录，随试跑期增量追加；试跑窗 2026-09-25 08:00 起至 09-30 三计数验收）
- syncMode: incremental（逐例追加，不溯改）
- 观测者: COS（xiaojia-hub/m-cos）；树=parallel-mode-assessment（W39）
- 三计数口径（BOD 验收锚）：互吞／index.lock 撞锁／stale 动作

## 观测 #1（2026-09-25 09:1x+0800，BOD 转记令 09:3x）

**例型：共享工作副本+共享 index 的 commit 裹挟碰撞（两例同型，同晨连发）**

- **例 A（出册笔 c4930f728）**：COS 执行 LG-046 裁①出册时 `git add -A` 裹挟三件他席落盘未提交文档（fullauto-loop-synthesis-v1/v2.md＋task-charter-20260921-ade-legacy-sweep.md）入册，commit message 未列——归属记账漂移，mirror 补记留痕。
- **例 B（归并笔 3d23a056）**：m-sde 09:09 在主树 add 其当事人陈述件（sde-statement.md）未及独立 commit；COS 09:1x 归并链 `git add -A` 于共享 index 窗将其裹挟入归并笔——m-sde 自查 CONTENT-IDENTICAL 内容完整，留痕认账，不改写他线笔。
- **归型判读（COS 初判）**：三计数中「互吞」族的**轻症变体**——内容零丢失（收册完整）但 commit 归属混合（他席产出入动者 commit），事后需 mirror/留痕补记归属。与 index.lock 撞锁、stale 动作不同型。
- **根因**：多席共享同一工作副本+同一 index 时，任一席的 add/commit 时点窗都会扫走他席 staged/unstaged 件——共享副本下「落盘即 add 未即 commit」的窗口期即碰撞暴露面。
- **对 050 结论的意义**：这是 wt 二期（per-seat worktree）要解决的碰撞类型活例证——per-seat 副本下此类裹挟结构性消失。有价值数据点，非瑕疵（BOD 09:3x 转记令定性）。

## 观测 #0（背景注记）

COS 本席现役落位=主树 dev（复活续跑落位，非 wt 位）——按裁③（BOD 08:4x）计数按现役落位如实注记，不强切；本席观测均以主树 dev 位产生，如实标注观测位。

# CTO 口径注记卷·rounds_run/rounds_started/round_count 三字段语义（DP-037 复判落定·2026-11-24 10:4x）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-rounds-counting-note-20261124.md·三字段口径正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: BOD 复判问（round_count 停 8/rounds_run=0）→CTO+SDE 双实读（round_runner.ts L280-352）复判定谳·DP-037 从「bug 修复」降级为「口径注记」

## §一 · 三字段语义（定谳）

| 字段 | 语义 | 计数点 | 备注 |
|---|---|---|---|
| `rounds_run` | **完成「迭代推进」次数** | `round_runner.ts` L348（`rounds += 1`·循环末尾） | **fuse/awaiting/failed 在增量前退出=0·即使整轮跑完** |
| `rounds_started` | **轮首尝试数** | 进入轮即 +1（DP-037-t5 字段） | 与 rounds_run 之差=未完成推进轮数 |
| `state.round_count` | **跨点火累计已完成迭代** | 过门后 L348（`st.round_count += 1`） | **debug 挂起（absent return）不增** |

## §二 · 三轮实证（SDE 补强·可复验）

| 轮 | 态 | rounds_run/rounds_started | round_count | 说明 |
|---|---|---|---|---|
| resume12 | test·fuse | **0/1** | 入场 8 | **实跑完整 1 轮（plan_skill×1/close×1）但 0**——fuse 在迭代尾增量前触发 ⇒ **rounds_run=0 ≠ 没跑轮** |
| resume13 | failed（段 7） | 0/1 | 8 | 段 7 失败退出 |
| resume14 | debug absent | 0/1 | 停 8 | debug 挂起不迭代 |

## §三 · 复判结论（DP-037）

- **无 bug**：三字段均按设计（代码 L333-350 实读·CTO+SDE 双证）。
- **DP-037 处置**：**撤销「bug 修复」定性·降级为「口径注记」**——t5 的 `rounds_started` 字段**保留**（attempted vs completed 分离=可观测性增强·有效）。
- **本席自领**：此前将 rounds_run=0 判为「上报 bug」=误判（未核 `++` 在迭代路径·「推演未核实况」族）。

## §四 · 使用依据

BOD 复判问（round_count 停 8 实读）+SDE 三轮 exit 面实证+CTO/SDE 双实读 round_runner.ts L333-350+DP-037-t5（rounds_started 字段）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-24T02:41:09Z（+0800=11-24 10:41）〔commit 时戳锚·D-47 正形〕

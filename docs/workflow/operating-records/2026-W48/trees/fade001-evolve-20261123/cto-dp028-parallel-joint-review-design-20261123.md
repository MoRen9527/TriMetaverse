# CTO 设计卷·DP-028 联审并行化（供下份 charter 可施工 item·CEO 质询响应）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-dp028-parallel-joint-review-design-20261123.md·设计正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 质询（「读为主·产物可隔离·为何不能并行」·BOD 转）+BOD 核查要求独立设计卷+CEO 裁「等任务书融合一起改」（DP-028 挂起候融·本卷=items 素材）

## §一 · 文件形（产物 schema 与聚合）

**各席独立产物**：`<run_dir>/opinions-<seat>.json`（seat∈{cos,coo,cao,cpo,cto,cho,cfo}）
```json
{"schema_version":"2.1.0","seat":"<seat>","table_version":"1.0.0",
 "object_scores":{"a":<num>,"b":<num>},
 "dimensions":[{"dimension_id":"<表内id>","name":"...","score":<0-100>}],
 "improvements":[{"title":"...","target":"...","change":"...","verify":"...","rollback":"..."}],
 "generated_at":"<UTC ISO>"}
```
**聚合器**（loop_joint_review_spawn 尾部）：
- 输入=7 席产物文件（缺席=absent 照现语义·不阻断）；
- **合并序=固定 seat 序**（cos,coo,cao,cpo,cto,cho,cfo·确定性）；
- 输出=`joint-review.json`（2.0.0 形+`seat_means` 段照现·`table_version`/comparability 照现）——**聚合器唯一写者**（各席不写 joint-review）。

## §二 · 代码改点（loop_joint_review_spawn.py）

1. **批处理池**：`FADE_JOINT_PARALLEL` env（默认 1=并行形）→ 分批 `[0:4]`+`[4:7]`（3-4 席/批）；
2. **并发实现**：同批内各席 subprocess 并行起（异步 wait 全部·单席 cwd=sandbox 照 DP-019）；
3. **超时与重试**：单席超时照现（`spawn_timeout`·DP-020 追补的 budget 语义沿用）；**单席失败=该席 absent**（不阻同批他席·不阻聚合——照现 absent 语义）；
4. **聚合步**：两批毕→按固定序合并→joint-review.json（含 7 席/缺席记录）。

## §三 · run_dir 只读约定落法

- 各席 cwd=sandbox（DP-019 已落·写面天然隔离）；
- 读材料=绝对路径（d196de8 prompt 注已立）；
- **可选加固**：席产物落 sandbox 后由聚合器复制入 run_dir（**替代原「席直接写 run_dir」**·写面收敛唯一写者=聚合器）——推荐此形（**零席写 run_dir**·只读约定最强化）。

## §四 · 回退锚

- `FADE_JOINT_PARALLEL=0` → **串行旧形**（现形照跑·逐席 spawn）；
- 切换时点=下一轮起（tsx 直载=运行中轮不受影响）；
- 语义=并行/串行**等价产物**（同输入同聚合·差仅耗时）——回退零数据面差异。

## §五 · 验收判据（五件）

1. 7 席产物全落（`opinions-<seat>.json`×7·schema 合规）；
2. **31 维/table_version 照验**（聚合后 joint-review 与串行形同形）；
3. **耗时 27.5min→~10min 实测**（2 批×~4min+聚合·实际读数记）；
4. **429 零上升**（并发 3-4 << 2500 并发上限·CFO 面观察）；
5. 聚合确定性（同输入两次跑=同输出·合并序固定）。

## §六 · 风险与观察项

| 风险 | 缓解/观察 |
|---|---|
| R-HY 资源（CPU/内存 3-4 席并发） | 3-4 保守起步·实测可上调/下调 |
| provider 429（并发计数） | 红即降并发→回退 `FADE_JOINT_PARALLEL=0` |
| 单席失败（超时/异常） | absent 语义照现·不阻全批 |
| 聚合非确定性 | 固定 seat 序合并·两次同输入验收 |
| 与 M9 克制令 | **性能面非机制面**（不加层·回退常位·COS 注照录） |

## §七 · 使用依据

CEO 质询（20:43 BOD 转）+本席评估（dsh 并发=设计选择非限制·12 席并行先例）+DP-019（sandbox/只读）+DP-020（budget 语义）+DP-021（grade/guard）+COS DP-028 派工台账 line 97+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T12:44:52Z（+0800=20:44）〔commit 时戳锚·D-47 正形〕

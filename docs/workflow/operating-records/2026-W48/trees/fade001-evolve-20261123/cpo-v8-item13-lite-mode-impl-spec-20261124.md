# v8 item13 施工供料 · 态分档审-用配对（lite 直提模式）实现 spec

- sourceOfTruth: 本件（v8 item13 实现供料·候 v8 批后 FSD 落码）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 21:3x 勘正（prod=各席直提·条数不限）→框架 v1.4 §八（752ef9908）→v8 任务书 item13（COO 22:57 运维盘催）→本供料
- 关系: 设计正身=框架 v1.4 §八+自省卷；本卷=**落码供料**（判据/字段/断言/回滚·实现归 FSD）

## §一 · 模式切换判据（唯一开关点）

- 态源=round flag（`readFlag`：debug/test/prod）——**prod 且 A/B 达标态 → lite**；debug/test → full（现行为不变）。
- 切换点=**loop_joint_review_spawn 入口**（spawn 读态→选模式）；**不做轮中切换**（一轮一模式·落卷 mode 字段）。
- 高危差距出现（未实现/漂移）=轮内即报通道照旧（两模式共用·§八 判据不动）。

## §二 · 两模式形

| | full（debug/test·现行为零改） | lite（prod） |
|---|---|---|
| spawn | 七席全量（全维评分+锚面板+DCA 抽样） | 七席各一轻 prompt：**直提改进意见（条数不限·DCA 差距形优先）** |
| 产出 | opinions.json（全维） | `opinions-lite.json`：`{seat, items:[{claim, gap_type(未实现/漂移/改进), evidence_ref, fix, dimension_id?}]}` |
| 评分 | A/B 照算 | **不算新分**（无维分·不进聚合） |
| charter | 全納（v8 item12 律） | 直取（条数不限·全納） |

## §三 · 落卷字段（joint-review.json 增）

- `review_mode`: "full" | "lite"
- `opinions_total`: int（lite=直提条数合计）
- `consumption_ratio`: `charter_items / opinions_total`（charter 侧回填·双模式均有值）
- `tokens`: 可选（CFO 读数同源·按轮记）

## §四 · 断言（FSD 单测+实测）

1. **lite 无维分**：lite 产物含 dimensions/score 字段=fail-closed 拒（模式隔离）。
2. **双锚**：lite 每条 `claim`+`evidence_ref` 非空；缺=fail-closed。
3. **全納**：lite 意见→charter 全納（无截断·v8 item12 同律）。
4. **回归**：full 模式行为与现役一致（对比 resume12-14 产物形）。
5. **实测**：prod 态一轮 lite tokens 对比 full 同轮（CFO 读数·目标显著下降）。

## §五 · 回滚与边界

- 开关：`LOOP_JOINT_REVIEW_LITE=0` 强制 full（env·与 LOOP_JOINT_REVIEW 同族）。
- 边界：本件只定供料；loop_joint_review_spawn.py/round_runner.ts 落点与实现序=CTO/FSD 域；锚面板/DCA 在 lite 模式下**不跑**（降本主项）——DCA 抽样仅在 full 或专项轮。
- 与 v8 item8（判卷 fail-closed）/item12（charter 全納）互引：lite 产出的双锚校验复用 item8 的 fail-closed 形。

## 使用依据

- 框架 v1.4 §八（752ef9908·条数不限终形）·自省卷（2650f4aa9+752ef9908）·v8 onepage（item13 定义）·v8 已修五件（dry_run 穿门等·供模式隔离参照）

—— CPO 小乔（m-cpo·item13 供料）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

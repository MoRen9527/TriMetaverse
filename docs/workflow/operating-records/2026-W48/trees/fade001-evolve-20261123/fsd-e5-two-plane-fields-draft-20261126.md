# E5 两卷字段对照表（FSD 草案·候 CTO 定稿入 docs/engineering/）

- sourceOfTruth: 本件（草案·产出侧）；定稿正身归 CTO 技术真源面（docs/engineering/）
- syncMode: write-time

## 面 → 卷 → 归属字段（全列）

### score.json（生命周期 A·迁移质量闭环）
- `families`（A-H 族 state/score/weight/reasons）
- `rubric_file` / `rubric_version` / `rubric_sha256_16`
- `artifacts_manifest`（逐件 run_id/sha256_16/parse_ok/size）
- `regime_check`（单一 100 制）
- `counts_check`（三面 counts 同口径）
- `cost_attribution`（成本三面/stage/residual/channel_ok）
- `improvement_block_ref`（**指针桩**→joint 卷·E2）
- `cross_check`（E5 边界断言面）
- `machine/manual/subjective_domain_weight` / `total_*` / `domain_breakdown` / `redline_caps_applied` / `verdict` / `run_state` / `check_time`

### joint-review.json（闭环 B·进化）
- `faces`（七席 dimension ids + rationale）
- `seat_means` / `ab_columns`
- `improvement_block {repair, improvement_rate{per_dim,total_rate}, by_seat, params, threshold{min_rate,below,below_count,note}, below_threshold, below_threshold_dims}`
- `new_discoveries` / `inherited_pending` / `new_discoveries_anchor`
- `refill {items, missing, items_ok, carried_no_ref}` / `opinions_filtered_invalid`
- `low_dim_coverage` / `evidence_check` / `seat_source` / `anchor_dimensions(read_scope)`
- `review_mode` / `opinions_total` / `comparability`

## 边界规则（E5）
1. 两卷顶层键交集（meta 白名单 {schema_version, run_id, check_time, round, from_week, to_week} 外）须=∅。
2. 指针桩单侧：`improvement_block_ref` 仅 score；`improvement_block` 仅 joint。
3. 断言实现=`score_engine._cross_check_planes`（score.cross_check.key_overlap / pointer）。

—— FSD 小全（产出侧草案·定稿归 CTO）·时点=commit 戳

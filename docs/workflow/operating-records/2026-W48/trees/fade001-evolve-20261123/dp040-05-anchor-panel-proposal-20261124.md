# DP-040-05 · T7 锚维独立面板方案（CPO 侧·CTO 联合）

- sourceOfTruth: 本件（锚维独立面板设计·CPO 产品语义面供料·零施工）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: COO DP-040-05（T7·与 CTO 联合·2026-11-24T03:10:40+0800）→本卷
- 硬约束：**聚合不动**（DP-026ⓒ 冻结·mean-of-seat-means 不变）——锚分**不入主线聚合**；本件=我的 R8/R9/R10 意见落地形

## §一 · 面板 schema（joint-review 增 `anchor_dimensions`·并列不并入）

```json
{
  "anchor_dimensions": {
    "panel_version": "1.0.0",
    "anchor_set_id": "A1",            // 每 2 轮换锚 → A1/A2...
    "anchor_round_parity": 1,         // 轮次奇偶/计数（换锚锚点）
    "dimensions": [
      {"dimension_id": "anchor-1", "name": "留痕缺件计数", "anchor_basis": "缺件数/拒判数", "denominator": "类目清单 n"},
      {"dimension_id": "anchor-2", "name": "族点名缺族数", "anchor_basis": "族点名表缺族数", "denominator": "族清单 n"}
    ],
    "per_seat": [
      {"seat": "cpo", "scores": [{"dimension_id": "anchor-1", "score": 62}, {"dimension_id": "anchor-2", "score": 58}]}
    ],
    "readings": [
      {"dimension_id": "anchor-1", "mean": 60.5, "spread": 12, "spike_flag": false},
      {"dimension_id": "anchor-2", "mean": 55.0, "spread": 34, "spike_flag": true}
    ]
  }
}
```

- **位置**：与 `dim_a/dim_b` 并列（joint-review.json 顶层）；**不进 A/B 聚合**、不进 charter 阈值判定（hard constraint）。
- **per_seat**：七席各自独立给锚分（**禁互看**·与七席总分禁互看同规）。

## §二 · 三条规则（R8/R9/R10 落地形）

1. **R8 锚分独立评（防污染）**：锚分与主线分**同一卷分两次给**（先主线后锚），不得用主线分反推锚分；生成器校验=同一席两段分数不得逐位相同（全同=疑似复制→fail-closed 退回）。
2. **R9 spike 极差读（区分度防衰减）**：`spread = max(seat_scores)-min(seat_scores)`；**spread>30 → spike_flag=true** → 进校准议程（不是分数改正，是标尺漂移信号）；**轮间方差 vs 轮内方差** 记入 readings（锚饱和判据）。
3. **R10 每 2 轮换锚**：`anchor_set_id` 递增（A1→A2），锚维从**分母明确型候选池**轮换：留痕缺件计数／族点名缺族数／拒判计数／兜底率（`agent_output_malformed` 占比）／迁移成功率。换锚=版本事件留痕（同标尺版本锁口径·轮次边界变更）。

## §三 · 锚维选型判据（产品语义面·防形容词锚）

- 每条锚维须带 **①可数分母（denominator）②取值规则（怎么算分）③反例锚（什么情形=低分）** 三件；缺一件=不入选。
- 首选「计数类」（不可能饱和/不可模糊）；禁选「整体质量/制度完善度」类形容词锚（不同席理解不一致→spread 虚高不可判）。

## §四 · 与既有体系的关系

- **聚合不动**（DP-026ⓒ）：A/B 仍 mean-of-seat-means；锚面板=**旁路校准层**，读法=spread 趋势+跨轮方差，供 CAO/CHO 标尺校准与 CEO 看漂移。
- 与 E 族（冻结维度表 v1）关系：锚维**可跨席共评**（每席都评同一锚集）——这是 n={1:53}「无一维共评」缺陷的最小修复形（只加旁路面板，不改七席各自主维）。
- 与 D-90 下沉关系：锚分证据形=计数读数（各席可独立复算），不需读代码。

## 使用依据

- COO DP-040-05 派工·本席 DP-039 意见卷（99aa63daa §一 a1 共维锚修复三条=R8/R9/R10 源）
- CTO 核结构面卷 aa6722ea4（n={1:53} 无共评实证）·COO 判读卷（70-90 空带/标尺漂移三源）

—— CPO 小乔（m-cpo·供料件·候 CTO 联合定稿·零施工）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

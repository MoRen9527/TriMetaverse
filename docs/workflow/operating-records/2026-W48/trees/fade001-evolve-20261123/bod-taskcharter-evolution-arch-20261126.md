# 任务书·fade-001 进化架构正形与施工（CEO 2026-11-26 11:3x 定谳）

**令源**：CEO「**plan skill 是 fade-001 的计划，对应 fade-001 的评分是 cli 和 skill（cos+coo）、close skill 收口最后保障（cos）。任务书是 fade-001 进化的计划，对应 fade-001 的评分是 7 席联审，收口也是 cos 保障。有计划有评分，不可能改不好**」
**卷锚**：bod-taskcharter-evolution-arch-20261126.md

## §一 两套闭环（架构正形·核心）

### 闭环 A：fade-001 的工作（只做迁移·不做进化）
```
plan skill（COS 规划·只产迁移计划） → score cli/skill（COS+COO·只评迁移质量与完整度） → close skill（COS 收口·最后保障）
```
- **plan skill 禁含任何改进项/能力项**（只产迁移计划）；
- **score 只评「迁移质量和完整度」**——**禁含进化评价**（improvement_block/dual_track/repair_rate 等进化指标**从 score 移出**——归闭环 B 的联审面）；
- **close skill = COS 收口**（保障）。

### 闭环 B：fade-001 的进化（任务书驱动·外部修缮）
```
任务书（进化计划·CEO 批） → 7 席联审（进化评分） → COS 收口（保障）
```
- **任务书** = 进化计划（改进项的确定场所）；
- **7 席联审** = 进化评分（A/B 暴露量+改进率/双轨/修复率等进化指标全在这）；
- **COS 收口**（保障）。

## §二 施工项

| # | 项 | 内容 | 实施 |
|---|---|---|---|
| **E1** | **plan skill 确认无改进项** | 实读确认（CTO 已报 grep 零·复核后入册） | CTO |
| **E2** | **score 移除进化指标** | 将 `improvement_block`/`dual_track`/`repair_rate` 从 score.json 移出→归 7 席联审面（joint-review 增这些字段）；score 仅留迁移质量+完整度 | CTO |
| **E3** | **charter 改进项→独立进化任务书** | charter_generator 的 S3-1 能力项通道→迁至「进化任务书」卷（COS 树协议执行·fade-001 的 charter 只含迁移任务项） | CTO+COS |
| **E4** | **琐碎改进（今日积压）** | ①threshold 独立字段（联审面）②62 新发现归属确认（r48 charter 生成后核）③**点火前查零（授权面）** 已入 CFO 形 | CTO/CFO |
| **E5** | **两套闭环的落卷对应** | score.json（闭环 A·迁移）与 joint-review.json（闭环 B·进化）字段边界文档化·禁混 | CTO |

## §三 验收判据（COS 代批原则）

**COS 按 CEO 三原则完整性检查**：
1. **改进能不能促进 fade-001 的进化**（不是「补文件」类合规项）；
2. **提的改进能不能落实**（可执行·有责任席）；
3. **落实如何检验**（verify 可判）。
**不满足→打回改。**

## §四 施工时点

- **12:00 开始进化施工**（COS 代批后）。
- **点火前提**：CEO 批任务书（或 COS 代批后）——无批禁点火。

—— 架构正形任务书（BOD 2026-11-26 11:4x）

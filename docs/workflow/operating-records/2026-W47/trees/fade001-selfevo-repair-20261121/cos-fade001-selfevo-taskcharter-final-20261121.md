# 正式任务书（final）·fade-001 自进化修复施工（呈 CEO 批）

```yaml
# ── 头段·机械可读面（对表定形卷决议甲 schema·生成器 charter 同形）──
charter_id: r9-task-20261121
title: fade-001 自进化修复施工（CEO 九点令 P1-P6 收编定谳+运行面验收）
source:
  review_volume: docs/workflow/operating-records/2026-W47/trees/fade001-selfevo-repair-20261121/cos-consolidation-round2-charter-amendment-20261121.md
  archive_volume: docs/workflow/operating-records/2026-W47/trees/fade001-selfevo-repair-20261121/archive-closeout-20261121.md
  opinion_anchors: [六席两轮意见锚见归档卷 §一（14 件清单）]
  order: CEO 2026-11-21 15:4x 九点令 → CEO 六项全批准 → CEO 令「出正式任务书呈我批」
approval:
  approver: CEO          # debug 态→CEO 批（本批·评批分离照守·COS 不自批）
  approval_comment: ""   # 批语待填
  approval_time: ""      # 批准时刻待填
  status: pending_approval
pickup:
  route: trees/<week>/trees/fade001-evolve-<ts>/   # TriRMC cron executor 现役拾取面
  auto_dispatch: false   # 红线二：默认 false·CEO 批面显式赋予才 true（本件不自默）
target: TriRMC/src/fade001/ + TriMLC 消费面 + TriOrchKit 关联件
change: P1-P6 已毕回归面收编+运行面双窗口验收（详见正文 §二）
verify: 灰度步 A 四判据（详见正文 §四）
rollback: 四开关（spawn/CLI 双形·两席/七席·意见注入·flag 切换）+任务书 rollback 字段逐件（详见正文 §五）
```

- sourceOfTruth: 本卷（正式任务书 final 正身·COS 主笔）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47）
- 时点: 写前现查 2026-11-21T17:48:10+0800（D-47 原值·D-84 绝对时点）
- 呈批路径: 落卷→回执 BOD→BOD 转呈 CEO（COS 不自批·评批分离 D-86 §一款 6 照守）

## §一 · 范围

1. **CEO 九点令 P1-P6**（全部段位·回归面已毕收编）：
   - P1 T1-1 正则修形+rubric_defect 暴露字段（45e1817·CTO APPROVE）
   - P2 七席 SEATS+护栏四件（7f08864）
   - P3 段 3/8 spawn grayscale 切换（bb4f049·env FADE_PLAN_SPAWN/FADE_CLOSE_SPAWN 双开可切）
   - P4 flag 四态六边状态机+两字段+approver（cc61354 河源部署真相+fsd 四小件）
   - P5 100 制重构（七席×100·趋势线·聚合四件齐）
   - P6 意见注入机制（编号+应答矩阵+机械 catch 四件+FUSE 完整性）
2. **自动拾取全链**（四件齐）：生成器（b92f372）+状态机（4c71e87）+触发链（aa5a7cf）+挂载（5401807）。
3. **收编定谳**：D-86 铸条（TC@6214b95）+CEO 六项全批准+归档卷（archive-closeout-20261121.md）。
4. **对齐待处理**（本任务书不启动·登记候独立批）：TriMMC 对齐挂账。

## §二 · 施工面现状（如实·读数时点标注）

| 段 | 状态 | 锚 |
|---|---|---|
| P1 | 毕·CTO APPROVE（D8 折算根因消除） | 45e1817 |
| P2 | 施工毕·候 CTO 终审 | 7f08864 |
| P3 | 毕（spawn grayscale·缺省 CLI 不变） | bb4f049 |
| P4 | 毕（四态六边机骨架·河源部署真相） | cc61354/4c71e87 |
| P5/P6 | **COS 面最后读数=COO 全速在跑**（2026-11-21 17:2x）；BOD/CEO 面口径「回归面已毕」——以 COO 毕报为准（本件如实双注） | — |
| 生成器 | 毕·CTO APPROVE（9/9 白盒·双侧 66/66） | b92f372 |
| 触发链+挂载 | 毕（三不变式恪守·批准后分支·state APPROVED_CEO） | aa5a7cf/5401807 |

**运行面双窗口候**（CEO 请即办③口径）。

## §三 · 分工

| 位 | 职责 |
|---|---|
| 主刀 | fsd（TriRMC 源码面 P2-P6+钩子/挂载件） |
| 部署 | SDE（河源部署窗·DCE 规程） |
| 测试 | STE（门禁+契约回归） |
| 终审 | CTO（技术定谳+接口终审+门禁放行） |
| 统排 | COO（施工序/资源窗/并发仲裁） |
| 流程 | COS（任务书/生成器/台账/催办） |
| 预算 | CFO（成本三层护栏+读数） |

## §四 · 验收判据（灰度步 A·四判据）

1. **七席三读数**：每席 total_100/average/threshold 三读数全列（聚合四件齐·缺一无效）
2. **100 制**：每席 0-100 单一口径·全席达线制 ≥95 判 prod 边
3. **rubric_defect 端到端**：T1-1 拒判在评分面显式暴露（禁折算·59/59 案=首案判例）
4. **首件真用端到端**：自动拾取首件任务书（CEO 批）→挂载→拾取→施工→毕→点火=新一轮，全链真跑一次（含挂载面可见性验证）

## §五 · 护栏

1. **D-86 双批权**：debug 态→CEO 批／test·prod 态→COS 程序批准（形式三件）·必回呈六项·代批五要件·评批分离
2. **无人值守三硬护栏**（CHO 放行条件·未落卷不开闸）：回滚锚强制／fail-closed 保守默认／链面冻结窗
3. **成本三层**（CFO·先定后续观察调整）：L1 轮级 ≤1 CNY／L2 日级 ≤15 触线即停（在跑不中断）／L3 ≤8 轮/日·余额门自动链 <30 拾取时查
4. **两红线**：自动施工=源码+测试不碰不可逆面／auto_dispatch 默认 false 仅 CEO 批面显式（本件自动拾取路由字段已按 false 落）
5. **四护栏常位**：8 轮封顶／GLM 速率／token 值面禁进转报／D-47+D-84 时刻制

## §六 · 待处理件（不属本任务书施工面）

1. **收编独立批**：P5/P6 若有残余+运行面双窗口后续
2. **TriMMC 对齐挂账**：候独立批/窗
3. **E3 挂载 choreography 后续观察**：首件真用端到端验证后收口

## §七 · 状态列

`pending_approval`（候 CEO 批）——批准后按 §二/§四 施工与验收；驳回则回 COS 修订重呈。

---
—— COS 小贾（m-cos·任务书主笔）·写前现查 2026-11-21T17:48:10+0800（D-47 原值·D-84 绝对时点）·评批分离照守（批权=CEO）

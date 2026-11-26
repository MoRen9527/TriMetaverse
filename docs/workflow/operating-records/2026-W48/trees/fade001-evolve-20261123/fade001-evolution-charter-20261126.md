# FADE-001 进化总任务书（新格式首件·index 形·最全最新最权威）

```yaml
# ── frontmatter·机械可读面（按七席合议格式·2026-11-26 批）──
task_id: fade001-evolution-charter-20261126
title: FADE-001 周迁移工作流·进化总任务书
form: "index"                    # 复杂形态（跨多席/架构级/历史长）
complexity: "complex"
owner_seat: BOD                  # accountable（编撰者·事实来自各席已落卷）
backup_seat: COS                 # 代行者（收口保障）
responsibility_face: "评审"      # 本件=评审/规划面
depends_on: [r37-r48 已收口链, E1-E5 施工, rubric-v2.3.1, 任务书格式提案]

authorization:
  status: approved
  approver: CEO
  approver_quote: "批任务书格式提案，把FADE-001进化重新一份任务书，按新格式，要求最全最新最权威"
  approved_at: "2026-11-26T22:37+0800"
  scope: construction            # 本件=编撰任务书（非点火·r49 另候）

product_intent: "fade-001 是内部周迁移工作流·无外部用户面"
product_change: none             # 无产品变更（内部工具）
pricing_impact: none
prd_ref: null                    # CPO 三问全否→不要 PRD（无用户可感知变化）

tri_source_assertion:
  doc: 本卷（第七节·状态表）
  impl: "TriRMC/src/fade001/ + runtime/cognition/score_engine.py + rubric-firstshoot.json(v2.3.1)"
  semantics: "fade-001 只做迁移（闭环A）·进化由任务书+7 席联审驱动（闭环B）——两卷分离（two-plane-architecture-field-map.md）"

cost_gate:
  estimate: {in: 0, out: 0, cache_read: 0, cache_create: 0}   # 本件=编撰·无施工消耗
  stop_conditions: ["任务书内容与已落卷事实冲突→停·回查真源"]
  gate_required: false

verify:
  - "本节 §七 状态表的每行 commit 锚可 `git show` 验"
  - "§三 两套闭环的字段边界断言（score∩joint=∅）已有测试（fe24f3c 98 passed）"
  - "§六 待办的每项都指向已落卷（无悬空指针）"
rollback: "单文件·git revert（本件为规划件·无代码影响）"
deadline: "2026-11-27"
```

## §一 摘要（≤200 字）

fade-001 = 周迁移工作流（把工作记录/树卷从旧周迁到新周）。2026-11-26 定谳两套闭环：**闭环 A**（plan→score→close·只做迁移·只评迁移质量）与**闭环 B**（任务书→7 席联审→COS 收口·进化评价全在联审面）。当日完成 E1-E5 架构分离施工、rubric v2.3.0→v2.3.1（A 族=迁移完整性）、七席合议任务书格式（inline/index 两形态）。当前 r48 收口（93.0/7 席 A 40.86 B 40.49），r49 候 CEO 点火批。

## §二 索引

| 节 | 内容 | 正文位置 |
|---|---|---|
| §三 | 两套闭环（架构正形） | 本节直读 |
| §四 | 历史演化（7 份任务书） | 本节表 |
| §五 | 当前架构状态 | 本节表+`two-plane-architecture-field-map.md` |
| §六 | 待办清单 | 本节 |
| §七 | 证据锚表 | 本节 |

## §三 两套闭环（CEO 2026-11-26 11:3x 定谳）

```
闭环 A·fade-001 的工作（只做迁移·不做进化）
plan skill（COS 规划·只产迁移计划·禁含改进项）
  → score cli/skill（COS+COO·只评迁移质量与完整度·A-H 族+I 主观族）
  → close skill（COS 收口·最后保障）

闭环 B·fade-001 的进化（任务书驱动·外部修缮）
任务书（进化计划·CEO 批）
  → 7 席联审（进化评分·improvement_block/dual_track/repair_rate 全在这）
  → COS 收口（保障）
```

**字段边界**（E5 已施工·two-plane-architecture-field-map.md）：score.json = families/rubric/artifacts_manifest/cross_check（迁移质量）；joint-review.json = faces/seat_means/ab_columns/improvement_block/new_discoveries/inherited_pending/refill（进化）。

## §四 历史演化（7 份任务书·按时间）

| 时间 | 任务书 | 定性 | 状态 |
|---|---|---|---|
| 11-21 16:10 | COO 草案 | 起草 | 被 final 取代 |
| 11-21 17:52 | **COS final**（九点令 P1-P6） | 第一份正式·CEO 批 | 已完工 |
| 11-24 03:06 | COS v2 重构（七席意见整合） | 7 件主体+20 修复 | 已施工 |
| 11-25 09:30 | resume33 改进（66 条） | 联审改进 | 已施工 |
| 11-25 20:11 | r37 改进（80 条） | 联审改进 | 已施工 |
| 11-26 04:11 | 三问方案（第一/二/三问） | 修复方案 | 已施工 |
| 11-26 11:37 | **arch 卷**（两套闭环 E1-E5） | 架构正形·CEO 批 | **已完工** |

## §五 当前架构状态（2026-11-26 22:3x）

| 件 | 状态 | commit/锚 |
|---|---|---|
| **两套闭环** | 已施工（E1-E5 全过） | — |
| **score 移除进化指标** | 已落（迁 joint 面） | 2acaa2a |
| **charter 恒不含 capability** | 已落（evolution 独立件） | 4b75864 |
| **threshold 独立字段** | 已落 | 64dca6c |
| **字段级交叉断言** | 已落（score∩joint=∅） | 3d65b4a |
| **rubric v2.3.1** | A 族=迁移完整性（源件快照+双向对照·三面同源） | d5ac089/a8cc5f1/fe24f3c |
| **任务书格式提案** | 七席合议·CEO 批 | a1c53dd96 + 各席卷 |
| **rubric_defect 过渡标注** | 已落（旧轮不洗白不扣席） | d5ac089 |

**7 席联审最新读数**：r48 = A 40.86 / B 40.49·score 93.0（I 28/35·客观 65/65）。

## §六 待办清单

| # | 项 | 责任席 | 状态 |
|---|---|---|---|
| **T1** | **r49 点火** | SDE/CTO | **候 CEO 批**（铁律·无批不点火） |
| ~~T2~~ | ~~B-H 族逐个过~~ | — | **CEO 2026-11-26 22:49 令放弃·不再跟踪** |
| ~~T3~~ | ~~families 讨论续~~ | — | **同令放弃** |
| **T4** | 新格式落地：现有任务书体系按 inline/index 重写 | COS+各席 | 候选·CEO 令后 |
| **T5** | 62 条新发现归属确认（r48 charter 生成后核） | CTO | 待核 |

## §七 证据锚表（可 git show 验）

| 锚 | commit | 内容 |
|---|---|---|
| E1 四件 | ff5d2ab/e5a98bb | plan 确认/E3 断言形/62 锚/E5 交叉 |
| E2 核心 | 2acaa2a | score 移除进化→joint |
| E3 主体 | 4b75864 | charter 恒不含 capability |
| E4 | 64dca6c | threshold 独立 |
| E5 | 3d65b4a | 字段级交叉断言 |
| rubric v2.3.0 | d5ac089 | A 族=迁移完整性·采集改造 |
| `_collect_a` 修正 | a8cc5f1 | 源件快照+双向对照（BUG 修复） |
| rubric v2.3.1 | fe24f3c | 文本落地·三面同源·防漂移测试 |
| 格式提案 | a1c53dd96 | 七席合议汇总 |
| 双面架构文档 | 5403fff | two-plane-architecture-field-map.md |
| r48 收口 | shift-W48-resume48-20261126T031308Z | 93.0·A/B 40.86/40.49 |

——BOD 编撰（2026-11-26 22:40·按新格式·最全最新最权威）

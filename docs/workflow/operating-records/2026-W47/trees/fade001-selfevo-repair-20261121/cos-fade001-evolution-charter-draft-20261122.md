# 任务书草案·fade-001 自进化改造件（CEO 全模型勘正版·呈批）

```yaml
# ── 头段·机械可读面 ──
charter_id: r10-task-20261122
title: fade-001 自进化改造（CEO 全模型勘正五款落地·时序+节点+考卷+两阶段分立）
source:
  order: CEO 2026-11-22 全模型勘正（五款·照录精神一字不差并入本任务书）
  base_volume: docs/workflow/operating-records/2026-W47/trees/fade001-selfevo-repair-20261121/cos-consolidation-round2-charter-amendment-20261121.md
  prev_charter: cos-fade001-selfevo-taskcharter-final-20261121.md（r9-task·approved·auto_dispatch=true 已授予）
approval:
  approver: CEO
  approval_comment: ""      # 待 CEO 批
  approval_time: ""
  status: draft             # 草案（CEO 明令：先不改码·批后按本任务书修改进化）
pickup:
  route: trees/<week>/trees/fade001-evolve-<ts>/
  auto_dispatch: false      # 草案面不置·批后按 CEO 明示
target: TriRMC/src/fade001/（chain_runner/round_runner/score_skill_spawn/plan_skill_spawn/close_skill_spawn）+ 段 10 后七席联审新阶段
change: 五款勘正落地（详见 §一）+ 时序节点表（§二）+ 改动面（§三）
verify: 时序正确 + 分数提升（§四）
rollback: 按段回退（各段执行形 flag 开关照役·P2 SEATS 形参化 env 已有）
```

- sourceOfTruth: 本卷（进化改造件草案正身·COS 主笔·CTO 技术面随卷）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47）
- 时点: 写前现查 2026-11-22T19:58:10+0800（D-47 原值·D-84 绝对时点）
- 令源: CEO 全模型勘正（BOD 转达）——「先不要着急改·合并进任务书·一会 CEO 批任务书·批后直接按任务书修改进化·完成后再点火下一轮看时序和节点是否都正确+分数是否有提高——这叫进化」
- 挂起注记: **charter-20261122T091742Z 挂起不动**（CEO 明令）

## §一 · CEO 全模型勘正五款（照录·一字不差）

1. **段 3 plan skill = spawn cos 主导**：cos 做一个**任务书**来调动团队完成周迁移工作，**并出主观题和客观题**（考卷）；
2. **段 7 score skill = spawn 两席联审（cos initial + coo joint）= 评判主观题考分**——因文件语义改写类程序无法做/无法评，需 agent 来判；**客观题由段 6 score_cli 程序判**；
3. **段 8 close skill = spawn cos 收口**；
4. **段 10 结束后才是七席联审**——两维度综合评价打分：**①周工作平面迁移质量 ②fade-001 本身工作质量**——产出**改进意见**→**进入下一轮 fade-001 的代码和 skill 优化=自进化**；
5. **段 7（两席）与七席联审不是一个阶段·严禁搞混**。

## §二 · 时序节点表（目标态·十段+联审后置+下一轮）

| # | 节点 | 执行形 | 产物 | 判题面 |
|---|---|---|---|---|
| 1 | preflight | CLI | preflight.json | — |
| 2 | qualify | CLI | qualify.json | — |
| 3 | **plan_scope** | **spawn cos 主导** | plan.json + **任务书**（调动团队完成周迁移）+ **考卷（主观题+客观题）** | 出卷 |
| 4 | dce | CLI | dce.json | — |
| 5 | verify | CLI | verify.json | — |
| 6 | **score** | **CLI（score_cli 程序判）** | score.json | **客观题程序判** |
| 7 | **score_skill** | **spawn 两席联审（cos initial + coo joint）** | score-skill.json | **主观题 agent 判** |
| 8 | **close_skill** | **spawn cos 收口** | close.json | — |
| 9 | close | CLI | manifest.json | — |
| 10 | notify_done | CLI | notify_done.json | — |
| **10 后** | **七席联审（独立阶段）** | **spawn 七席**（COS/COO/CAO/CPO/CTO/CHO/CFO） | **opinions.json** | **两维度打分：①周工作平面迁移质量 ②fade-001 本身工作质量 → 改进意见** |
| **下一轮** | **按改进意见改 fade-001 代码+skill = 自进化** | — | 下一轮 r<N+1> | — |

**时序铁律三条**：①段 6（程序判客观题）与段 7（两席判主观题）分立不混；②**段 7 两席 ≠ 七席联审**（后者恒在段 10 结束之后·严禁搞混——CEO 第⑤款）；③七席联审产出改进意见=下一轮改造输入（自进化闭环）。

## §三 · 改动面（现势 → 目标态·批后按序改）

| 面 | 现势 | 目标态 | 备注 |
|---|---|---|---|
| 段 7 score_skill | SEATS 七席（P2 已改·7f08864） | **两席（cos initial + coo joint）** | P2 七席化方向勘正回两席·SEATS 形参化 env（SCORE_SKILL_SEATS）可切保留 |
| 段 3 plan_scope | spawn cos（bb4f049 灰度·现役产物 plan.json） | spawn cos **主导+产出任务书+考卷（主观题+客观题）** | 考卷形成新增件（CPO 卷 c875431b5 §八 A① 考卷分形成基准：既有 rubric 轮次实例化·出卷≠改卷·轮内锁卷） |
| 段 8 close_skill | spawn cos（bb4f049） | spawn cos 收口（维持） | 对齐确认即可 |
| 段 10 后 | **无七席联审阶段**（现七席跑在段 7） | **新增七席联审独立阶段**（两维度打分+改进意见→下一轮） | round_runner/chain_runner 新段或后置编排件·CTO 技术面定形 |
| 段 6 score | score_cli（客观题） | 维持（对齐确认） | — |

## §四 · 验收判据（CEO 明示双判据）

1. **时序和节点都正确**：十段+联审后置全链时序对表（段间衔接/执行形/考卷与判题对应/两阶段分立——按 §二表逐节点验）；
2. **分数有提高**：改造完成点火下一轮→与改造前基线比（七席联审两维度分+客观题分·`r<N>` vs `r<N+1>` 趋势）——**这叫进化**（CEO 原话）。

## §五 · 护栏与分工

- 护栏：D-86 双批权（本件 debug 链→CEO 批·COS 不自批）/三硬护栏/成本三层（L1 轮级 ≤1·L2 日级 ≤15 触线即停·L3 ≤8 轮/日）/两红线（源码+测试不碰不可逆面·auto_dispatch 默认 false）/四护栏常位。
- 分工：主笔 COS（本卷）｜技术面随卷 CTO（改动面定形+接口终审）｜主刀 fsd（码面）｜统排 COO（施工序）｜测试 STE（门禁）｜部署 SDE（如需）｜预算 CFO（成本读数）。
- **执行序（CEO 明令）**：先不改码 → 本草案呈 BOD 转 CEO 批 → 批后按任务书修改进化 → 完成后再点火下一轮验证（时序+分数）。

## §六 · CTO 技术面随卷位（占位·候 CTO 附卷）

- 段 7 七席→两席的 SEATS/判题接口回改面；
- 段 3 考卷产出 schema（主观题+客观题结构·与段 6/段 7 判题面接口）；
- 段 10 后七席联审阶段的段位落点（chain_runner 新段 vs 后置编排件）+opinions 产出形（与生成器五字段兼容面）；
- 各改动面回滚锚。

---
—— COS 小贾（m-cos·任务书草案主笔）·写前现查 2026-11-22T19:58:10+0800（D-47 原值·D-84 绝对时点）·评批分离照守（批权=CEO）

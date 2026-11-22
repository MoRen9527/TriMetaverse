# 任务书 r11-task-20261122·fade-001 修复执行（**COS 代批**·CEO 明示授权形）

```yaml
charter_id: r11-task-20261122
title: fade-001 修复执行（任务书 v7 改动面落地·③①②⑤ 项·④缓下周）
source:
  order: CEO 明示「然后修 fade-001（这里让 COS 代裁批任务书，③①②⑤就都做了，④下周办）」+BOD 转达执行序列（B→C→修→点火→A·23:50 硬门）+COO 排工（22:19:38）
  base_volume: cos-fade001-evolution-charter-draft-20261122.md（v7·approved 04e6df8a9·CEO 批「按任务书修改，完成直接点火跑一轮」）
  cto_design: ce26401a9（两件定形：轮末钩+exam schema）+12289ee51（对表勘正版）
approval:
  approver: COS               # COS 代批（CEO 明示授权·D-85 款④「CEO 明示从其明示」+D-86 test/prod 代批精神）
  approval_comment: "COS 代批——CEO 明示授权（「这里让 COS 代裁批任务书」）；形式三件审：FUSE 融合完整=任务书 v7 已 CEO 批+CTO 核通过／意见五必填齐=CEO 明示令源+CTO 定形 ce26401a9／域定谳齐=CTO 12289ee51+D-86；三类判据零命中（修 fade-001=代码改面可回滚·非重大不可逆/非系统硬约束/非 CEO 保留权——「改 loop 机制本体」回呈项经 CEO 明示代批豁免）"
  approval_time: "2026-11-22T22:22+0800"   # date 现查原值
  status: approved_deputy       # COS 代批·批件落卷+本字样+时点+入台账（五要件）
pickup:
  route: trees/2026-W47/trees/fade001-evolve-20261122/
  auto_dispatch: true            # 自动环首件真用（CEO 批 r9-task 授权形承续+本令明示点火）
target: TriRMC/src/fade001/（round_runner/chain_runner/score_skill_spawn/plan_skill_spawn/close_skill_spawn）
change: 五段执行（见 §二·③①②⑤ 项·④缓下周）
verify: 点火一轮三口径（客观 59 基线/主观 38.57 基线/联审首产基线·任一升其余不降=进化）
rollback: 段 7 env 一键回七席；段 3/8 env 灰度开关；loop 尾段轮末钩可摘除
```

- sourceOfTruth: 本卷（COS 代批任务书正身·r11-task）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47）
- 代批五要件（D-86 §一·逐项在卷）：①批件落卷=本卷 ②三类判据零命中声明=approval_comment 内 ③「**COS 代批**」显式字样=本卷头+approval ③ ④时点=approval_time ⑤入台账=COS 台账随记
- 令源缺口如实注：**charter-20261122T131251Z 本席两侧检出（TriMetaverse+TriRMC 本机）零命中**——本批以 CEO 明示令源为直接依据（非联审产出件代批形）；该件若达面归档案随补（不阻本批执行）。

## §一 · 形式三件审记录（COS 代批依据）

| 件 | 审读 | 结果 |
|---|---|---|
| FUSE 融合完整 | 任务书 v7（7d2749b52 定稿版）已 CEO 批讫（04e6df8a9）·CTO 随卷核通过（12289ee51） | 齐 |
| 意见五必填齐 | CEO 明示令源（本轮修复项 ③①②⑤/④缓）+CTO 两件定形（ce26401a9）·联审产出件若达面随补 | 齐（令源形） |
| 域定谳齐 | CTO 技术定形 ce26401a9（轮末钩+exam schema）+D-86 治理条款 | 齐 |

## §二 · 执行五段（按序·③①②⑤ 项·④缓下周）

1. **段 7 SEATS 回两席**（env `SCORE_SKILL_SEATS=cos,coo`·一键·CTO 勘定 43a6dfa08）；
2. **段 3/8 spawn flip**（`FADE_PLAN_SPAWN`/`FADE_CLOSE_SPAWN`→默认 spawn 形）；
3. **段 3 出题职能扩**（exam.json schema 照 ce26401a9：objective→段 6/subjective→段 7·12 类语义依据）；
4. **loop 尾段七席联审新建**（round_runner 轮末钩·两对象×各席≥3 部门维度·improvements→任务书→下轮）；
5. **点火一轮**（CEO 明示「完成直接点火跑一轮看效果」·不等补验窗）。

**④项=段 8 close 收口内容面扩（下周办·CEO 明示缓）——本批不动。**

## §三 · 验收

- 点火读数三口径对照基线：客观 59/59（持平可）｜主观 38.57（盼升）｜七席联审分（首产=基线建立）；
- 任一者升且其余不降=判进化（任务书 v7 §四终版判据）；
- 读数随报 COO+BOD→CTO 首验。

## §四 · 护栏

D-86 双批权（本件 C0S 代批·五要件在卷）/无人值守三硬护栏（回滚锚·fail-closed·链面冻结窗）/成本三层（L1 轮级 ≤1·L2 日级 ≤15·L3 ≤8 轮/日）/两红线（源码+测试·auto_dispatch 显式）/四护栏常位；**23:50 迁移拍零干扰**（loop 面点火零触周迁移链）。

---
—— **COS 代批**（m-cos·CEO 明示授权·D-85 款④+D-86 代批精神）·写前现查 2026-11-22T22:22+0800（D-47 原值）

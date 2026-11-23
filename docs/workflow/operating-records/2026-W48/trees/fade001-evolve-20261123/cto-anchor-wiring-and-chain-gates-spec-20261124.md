# CTO 规格卷·锚表接线 spec+chain 段门三件（2026-11-24 04:3x·CEO 批）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-anchor-wiring-and-chain-gates-spec-20261124.md·规格正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 04:3x「批锚表接线，charter 也批」（BOD 转）+BOD 核（prompt 零引用锚表实读·旧尺子）

## §一 · 锚表接线 spec（联审 prompt 加评分标尺段·SDE/FSD 落地）

`loop_joint_review_spawn.py` `_JOINT_PROMPT` 追加「评分标尺」段（原文骨架）：

```
评分标尺（六档区间+要件法·必守·anchor-table-v1）：
- 每维打分须对表落档：L1 0-29 结构性缺失（零要件）／L2 30-49 初步有但不完整／
  L3 50-69 基本可用（要件过半）／L4 70-84 要件齐／L5 85-94 要件齐+可复算实证锚／
  L6 95-100 标杆（L5+他席可复用或 CEO 批）
- rationale 须写明：①落档依据（该维要件的存在/缺失证据）②档位（L1-L6）③为何非上/下一档
- 要件未定义前的维度：按 L1/L2 从紧判（§5.6 规则·不虚高）
- score 须落在所报档区间内（如报 L4→score ∈[70,84]）；越区间=评分不合规
```

**验收**：prompt 段落+测试（既有 prompt 测试适配）+熔断面（越区间不阻断·记录非合规标记）。

## §二 · charter 1/2/5 三件（chain 段门 fail-closed 统一化·我域设计）

**三件同族=段门语义统一**（target=`TriRMC/src/fade001/chain_runner.ts`）：

1. **段 4（dce）fail-closed**：dce verdict≠pass → **return failed 止链**（禁入段 5+）；
2. **dce 红即停**：段 4 非 pass → **禁穿门到 verify/score/close/notify**（与 1 同一改点·语义强化：notify 也不触）；
3. **段门语义化**：**每段毕统一判**「pass→续／非 pass→止链+不 notify」——段门判定函数化（单一实现点·防散落判断）。

**设计要点**：a) 段门判定=runner 循环内统一（chain_runner.ts 段间）；b) 非 pass 的 exit 面带 `failed_stage` 字段（可诊断）；c) 既有 `STAGES` 顺序不动（判据加强非结构变）；d) 回退锚=env 开关（`FADE_CHAIN_GATE_STRICT=0` 回旧形·候批）。

## §三 · 验收+实证（BOD 建议采）

1. **白盒**：锚表接线=prompt 测试；chain 三件=fixture 段门测试（dce fail→止链/不 notify）。
2. **实证（BOD 建议）**：接线后用**同一 run-dir 材料**做「锚表版联审」冒烟（单席或 7 席小跑·不必整链）→对比分数落档分布（旧 vs 新尺子）——验证接线生效。
3. **毕报**：改点行号+测试读数+冒烟对比（落档分布）。

## §四 · 分工与派工

- **锚表接线（①）**：spec=本卷 §一·落地=SDE（同 A 件分工）·~40min；
- **chain 三件（②）**：设计=本卷 §二·落地=FSD·~1h（可与①并行）；
- **验收（③）**：CTO 面（白盒+实读+冒烟对比）；
- **派工取号**=COS 挂账（D-88）。

## §五 · 使用依据

CEO 批令（BOD 转 04:3x）+BOD 核（prompt 零引用实读）+anchor-table-v1（127 行·六档/§5.6）+charter-203018Z 5 items（1/2/5）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T20:37:00Z（+0800=11-24 04:37）〔commit 时戳锚·D-47 正形〕

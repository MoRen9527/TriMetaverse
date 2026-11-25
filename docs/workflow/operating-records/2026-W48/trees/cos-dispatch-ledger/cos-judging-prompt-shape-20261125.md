# I 族判卷 prompt 形面（COS 手工判卷模板·供 FSD 链内化）

- sourceOfTruth: 本卷（COS 手工判卷 prompt 完整形·供 FSD 写进 spawn prompt 常量）
- 令源: CTO 09:15「请供判卷 prompt 形面」（CEO 点出链完整性缺口：I 卷应段 7/8 段内出·非链外手工）
- 时点: 写前现查 2026-11-25T09:18+0800（D-47 原值）

## §一 · 判卷输入（三段）

1. **判卷对象**：`run_dir`（本轮 run）+ `run_id`（对表）+ 本周（W48）的「记录/活」全集。
2. **锚文**（判前必过·逐案挂判）：`36bf14a1d L44`「**这是一周的记录，还是这一周的活——记录随周封存·活随人带走**」。
3. **读什么卷**（按判据）：
   - **I1（域划界/判断质量）**：families 划分+RACI owner 映射+台账域界证据——读 `plan.json#/families`+`r12-item3-6-data-*.json`+`open-items-ledger.md` 相应笔
   - **I2（fast_path 活体）**：真跑路径证据——读 `run_dir/dce.json`（DCE_EXECUTE 形）+`ignite.log`+`manifest.json#/stages`
   - **I3（close evidence 完整）**：证据面件齐——读 `run_dir/collection-A.json`/`collection-F.json`/`collection-H.json`+`close.json`+`plan-freeze.json`

## §二 · 判分形（关键：分值分配·非各 0-10）

| 判据 | 满分（旧版 10 面） | 判法 |
|---|---|---|
| **I1** | **4** | 三域划界清晰+分布稳定（族 4 组划分合理）+双向一致（owner 与族名对表）→ 满分；缺一 → 按缺陷扣 |
| **I2** | **3** | DCE_EXECUTE=1 真跑（非 dry_run）+链活体路径连续 → 满分；dry_run-only → 扣 |
| **I3** | **3** | collection-A/F/H 三件齐+close.json 在+plan-freeze 在 → 满分；任一缺 → 扣（缺席暂挂 pending 非判 0） |

**新版（35 面）= 等比例换算**（10 面满分 → 35 面；engine 消费时按 weight 35 换算·本卷不预换算）。

## §三 · 输出（v3 契约形·已确认）

```json
{
  "score_version": "2.0.0",
  "run_id": "<runId>",
  "total": 10,
  "entries": [
    {"criterion": "I1", "score": 4, "rationale": "<判语+锚文判读+佐证卷>"},
    {"criterion": "I2", "score": 3, "rationale": "..."},
    {"criterion": "I3", "score": 3, "rationale": "..."}
  ],
  "judge_notes": {
    "anchor": "36bf14a1d L44 锚文原句",
    "case_readings": [{"case":"<案>","label":"活|记录","note":"<一句>"}],
    "dual_role_note": "初判值席=<席>·终判=COS·联审免（无 fail/边界/分歧案）",
    "weight_note": "I 族权重=35（CEO 65+35）"
  },
  "check_time": "<现查 ISO>"
}
```
**硬约束**：①**无 evidence_ref 键**（engine `(run_dir/ev).exists()` 须真路径·描述串=False→0 分——v3 教训）②rationale 必含锚文判读（记录/活 标签+一句理由）③criterion 固定 I1/I2/I3。

## §四 · 判卷人注意（链内化后 LLM 照形判）

1. **锚文判读先行**（每案先标「活/记录」再判分）
2. **缺件不判 0**：collection 缺→pending（待补）非 0（resume29 实证：partial 空值≠判 0）
3. **一人两角须留痕**（若初判/终判同席·judge_notes.dual_role_note 写明）
4. **权重面勿预换算**（10 面判→engine 按 35 换算·judge 不自行换算）

---
—— COS 小贾（m-cos·判卷席）·写前现查 2026-11-25T09:18+0800（D-47 原值）

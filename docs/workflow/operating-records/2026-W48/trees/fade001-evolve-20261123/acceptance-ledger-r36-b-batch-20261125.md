# 验收结账表·r36 任务书 B 批 41 条（2026-11-25 22:1x·CEO 追问补·CTO+CAO 联署）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/acceptance-ledger-r36-b-batch-20261125.md·摘要正身；明细=同名 .json）
- syncMode: write-time
- 承接: CEO 22:1x 追问「不止 29 条 fixed 吧，后面修那 46 条呢」（BOD 转）

## §一 · 范围与结论

- 源任务书：`bod-taskcharter-resume36-improvements-20261125.md`（df3e2d419）
- **B 批（B1-B5）实测 41 条**：**fixed 37 / dropped 2 / equivalent_note 2**
- 与 CEO「46 条」的差 5：**档一已落 5 条（非 B 修·在 32 档一内）**
- **两份结账表合计 29+41=70 条有状态**（账清核 75/75 的四档余 5=档一已落）

## §二 · B1-B5×状态

| 批 | commit | 条数 | 状态 |
|---|---|---|---|
| B1（T3c） | 50d3b55 | 9 | fixed 9 |
| B2（九条） | e44eeb8 | 9 | fixed 9 |
| B3（档二余4） | f2fabd6 | 4 | fixed 2 + equivalent_note 2（CPO10/CAO6） |
| B4（十条） | f294ead | 10 | fixed 7 + dropped 2（CAO5/CHO1） + fixed 1（CFO10） |
| B5（末批九） | 8b124f8 | 9 | fixed 9 |

**测试基座**：engine 60／close 34／enricher 20／loop 48／plan 53——全绿 EXIT=0。

## §三 · 逐条（opinion_id→批/状态）

全明细在 .json（41 条·每条 {batch, status, evidence(commit@sha 时点行号/测试名), verified_at}）。

## §四 · 联署与对表

- **CAO 联署**：候
- **BOD 对表**：候
- 意义：**r42 联审的 refill 若有第二份结账表=70 条有状态可见**（29+41·意见账真实下降）

## §五 · 备注

- **两处锚勘注**（沿用 COS 联署建议）：cpo-10 的七席机制真身=e0a2f32（非 4fccf51 contract 面）；cao-6 handoff vs 锚 2 面板=equivalent_note
- evidence 引法=commit@sha 时点行号（复核用 `git show <sha>:<path>`）

---
—— CTO 小狄（m-cto）·写前现查 date（D-47 正形）

# DP-041 铸条候选稿·CEO 批令机械可证形（送 CAO 裁·CEO 裁 B 定档）

- sourceOfTruth: 本卷（DP-041 铸条候选·COS 整理·CAO 裁）
- 令源: CEO 03:5x 裁「B」（档位收紧）·BOD 转达（2026-11-24T03:53）
- 时点: 写前现查 2026-11-24T03:58+0800（D-47 原值）

## §一 · 条旨

**CEO 批令的机械可证形**——批权不仅要有授权，还要有**可机械核验的授权凭据**，且凭据的产生渠道本身须自洽（本轮暴露：`charter_approval` 推进=挂载副产品·代码无批据校验·靠人信）。

## §二 · 档位（CEO 裁 B·收紧）

| 档 | 内容 | 位阶 |
|---|---|---|
| **放行必要** | **CEO 亲签 `ceo-charter-approval.json`**（`approved_by:"CEO"` + `signature_slot` 非空） | **必要条件** |
| 辅助证据 | §六 批件指针（**指向含 §六 的 commit**）+ SDE 实读原文 | 辅助 |

## §三 · 件形（七字段+校验四件）

**落位**：`<runs_root>/<prev_run_dir>/ceo-charter-approval.json`（与 continue 件同 run_dir·属主 fleet）

```json
{
  "charter_ref": "<任务书卷路径>",
  "charter_commit": "<含审批段的精确 commit>",
  "approved_by": "CEO",
  "approved_at": "<CEO 签署时点·现查 ISO>",
  "order_ref": "<CEO 签署令编号/BOD 转达锚>",
  "quote": "<CEO 原话照录>",
  "signature_slot": "<CEO 签名通道标识/名>"
}
```

**校验四件**（SDE 消费面读件判据）：①`approved_by=="CEO"` ②`approved_at` 非空非模糊 ③`charter_ref`/`charter_commit` 非空且指针指向含审批段的 commit ④`signature_slot` 非空。

## §四 · 三角分立（COS 不代批的机械形）

- **备模板/定落位/定校验** = COS
- **落件（写文件）** = BOD 凭 CEO 明示
- **签署（signature_slot 值）** = CEO 本体

## §五 · 代码侧配套（DP-041 施工面·候批）

`tryCharterMount`（round_runner.ts L446-462）**前置校验**：批据件在位且 `approved_by=="CEO"` 且校验四件过→方允许挂载推进 `charter_approval=APPROVED_CEO`——**机械闭环防靠人信**。

## §六 · 本轮案例（案由）

- resume13 点火（19:45:32Z）依据链=§六（99bdad325）+BOD 03:02 转达——**GO 判（a12f64d0·四依据）**
- **事后补签**（BOD 待 CEO「签」字落件·不回溯）
- **教训入条**：①指针精度（引落卷件须「文件+精确 commit+行/段」三件——本轮 COS 引 1024 笔非 1025 笔=自领）②落卷升格（无落卷口头二手不可证/带原话+时点+commit 落卷=可证）

## §七 · 呈 CAO 裁

条号候 CAO 定（D-95 候选）·**不冒充 CEO 令**（本卷=CEO 裁 B 的机械形整理·非新令源）。

---
—— COS 小贾（整理席）·写前现查 2026-11-24T03:58+0800（D-47 原值）

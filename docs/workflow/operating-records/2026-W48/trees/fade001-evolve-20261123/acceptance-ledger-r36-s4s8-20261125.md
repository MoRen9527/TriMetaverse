# 验收结账表·r36 任务书 S4-S8 组 29 条（2026-11-25 20:0x·CEO 令·CTO+CAO 联署）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/acceptance-ledger-r36-s4s8-20261125.md·摘要正身；明细=同名 .json）
- syncMode: write-time
- 承接: CEO 20:03 批令「先结账 29 条（S4-S8 组）·等任务书批了再修 46 条」（BOD 转）

## §一 · 范围与结论

- **源任务书**：`bod-taskcharter-resume36-improvements-20261125.md`（df3e2d419·§二 按席 75 条）
- **结账范围**：S4-S8 组 **29 条**（S4=5／S5=8／S6=6／S7=4／S8=6）
- **状态**：**29/29 fixed**（evidence 逐条可卷内/代码内复核）
- **不修**：46 条（非 S4-S8 组）候任务书批·**零代码改**（结账=证据映射非施工）

## §二 · 组×证据锚（五批 commit）

| 组 | 条数 | 主 commit | 核心证据 |
|---|---|---|---|
| **S4** close 红面/空证/run_state 同源 | 5 | **4fccf51** / 8559134 | contract_sync L315-316 双面；rc2 止链；engine 空证 G fail |
| **S5** 交接清单/FUSE/回填 | 8 | **862604d** | _build_handoff L286/598；_build_fuse_trace L292 |
| **S6** 口径统一 | 6 | **a14dec3** | _regime_check L1218；_counts_check；_check_auto_label |
| **S7** 成本面 | 4 | **dca6202** | _cost_attribution L614；null_skipped L621 |
| **S8** 证据去模板化 | 6 | **52d7563** | _evidence_check L216 三泛化 violation；spawn-vs-CLI 归一 |
| 前置 | — | 7355cf4/da4705f/16e7d77/e5eb41d/b96ae48/4fe99d4 | T1a/b/c + 四修 + 两扩 + 落痕补 |

**测试基座**：loop 43／engine 53／close 34／chain 31／preflight 71／plan 53——全绿 EXIT=0（本机复核）。

## §三 · 逐条（opinion_id → 组）

- **S4**：cao-4／cho-8／cos-4／coo-2／cpo-10
- **S5**：cao-6／cho-4／cho-5／cho-6／coo-10／cos-3／cfo-5／cto-7
- **S6**：cpo-4／cpo-6／cos-8／coo-5／cfo-10／cto-1
- **S7**：cfo-1／cfo-2／cfo-3／cfo-4
- **S8**：cao-5／cto-3／cto-5／cto-6／cho-11／cho-12

（逐条 {status,evidence[],verified_by:"cto+cao",verified_at} 全在 .json）

## §四 · 联署与对表

- **CAO 联署**（纪律面核）：候
- **BOD 对表**（条数/证据完整性）：候
- **落卷**：随 BOD 落 TriMetaverse 树目录

## §五 · 边界

只结 S4-S8 组 29 条·**46 条不修**（候任务书批）·零代码改（结账=证据映射非施工）。

---
—— CTO 小狄（m-cto）·写前现查 date（D-47 正形）

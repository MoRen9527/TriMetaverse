# LG-060 渲染链解冻复验链三步执行读数卷（COS 值席车道·BOD 05:23 起跑令）

- sourceOfTruth: 本件（复验链三步执行读数正身；承接 BOD 05:23 令转 CEO 05:23「拉到现在跑，不要等」）
- syncMode: final
- lastSyncedAt: 2026-10-04T21:37:16Z（date 现查 shell 注入原值零手打）
- 执行席: COS（m-cos 本机 dev 值席车道，LG-060 owner 已接）
- 结论速览: **三步全绿——①前置断言门绿（3K+0 残）②T5 三面干跑 derived_drift=0×3 全绿（零炉料无需实写）③LG-048/051 连带解窗读数在卷候 BOD 裁解**

## §一 前置断言门读数（源侧正名态）

门判据（batch-07 §四防复发件+WO-A 门量尺「2K+0 残」）：渲染位旧名 token=0+活护栏句旧形=0+TriMC 裸命中全合法历史面。

| 断言 | 量尺 | 读数 | 判 |
| --- | --- | --- | --- |
| LG-063 族旧名 `TriCompany-copilot-host-assets` | .claude/agents+.github/agents+.claude/compass+TriCompany/source-agents 四处 | **0/0/0/0** | ✓ |
| 活护栏句旧形「TriMC 正式宿主切换」 | 同上四处 | **0** | ✓ |
| TriMC 裸命中（`TriMC([^M]|$)`） | TMV 两面 | **6 命中=3 句族×2 面投影，全合法历史面** | ✓ |

6 命中明细勘性：business-strategy :33/:45（LG-040 历史护栏+【历史】别名条款，WO-A 基线 2K 原句）+chief-technology-officer :148（LG-040 单点护栏同句族，基线后新增合法件）——全部带历史限定语正形，零活护栏句旧形零现役化表述。**门判读：绿（现势=3K+0 残；K 面增量=CTO :148 LG-040 合法护栏，非回流）**。

## §二 T5 攒批抽验复跑读数（三面 dry-run，items[].action 权威口径）

| 面 | total | derived_identical | skipped_identical | **derived_drift** | errors | 判 |
| --- | --- | --- | --- | --- | --- | --- |
| claude | 19 | 19 | 0 | **0** | 0 | ✓ |
| copilot | 19 | 13 | 6 | **0** | 0 | ✓ |
| claude-session | 13 | 13 | 0 | **0** | 0 | ✓ |

- **drift 唯一权威=items[].action 统计**（runbook §四①恪守，未信顶层 summary）；三面 derived_drift=0=源↔渲完全一致稳定态。
- **零炉料判读**：dry-run 全 identical=渲染位已与源侧正名态一致（10-04 夜三并批炉 a4dd5064 后源侧正名面零未渲变更）——无 drift 即无实写对象，本步零写入零 commit（渲染位无变化可推）。
- copilot 面 skipped_identical=6 为拷贝语义件构成差异（非 drift 非错误），不涉门。

## §三 LG-048/051 连带解窗

- 两行候验判据=「渲染复核读数同 T5 链」（W41 大表行 18）——本卷 §二即该读数：三面 drift=0 全绿。
- 解窗动作权在 BOD：候 BOD 采读本卷裁 LG-048/051 解窗；两行随解窗可转毕候验收口批处置。

## §四 边界自检

- 本席操作零源侧写面 ✓（仅只读扫描+dry-run；dry-run 默认零写入）
- STE 独立复验未代跑 ✓（batch-14 形态=STE 义务，已捎请领）
- 他区零扰动：本操作仅新增本卷（W41 trees），渲染位零触碰 ✓
- 死线：今天 EOD——本卷 05:3x 落，大幅提前 ✓

## 使用依据

- BOD 05:23 起跑令（转 CEO「拉到现在跑，不要等」）
- CTO 条件卷 bod-pipeline-batch-13/cto-tc502-conditions-b14-cosign-20261004.md §二（复验链三步+owner 勘定）
- batch-07 技审裁决卷 §四（防复发前置断言裁）+lg059-060-fsd-exec-readout.md（WO-A 门量尺 2K+0 残读数形）
- 渲染管线正身：TriCompany/runtime/cognition/source_publish_check.py（三面 dry-run 配方照 render-pipeline-runbook §二）
- 10-04 夜三并批炉卷：2026-W40/trees/lg063-render-batch-20261004/cos-render-exec-readout-20261004.md（渲染位正名基线）

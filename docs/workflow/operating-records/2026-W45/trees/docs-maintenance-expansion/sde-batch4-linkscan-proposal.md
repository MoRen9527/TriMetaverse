# docs-maintenance · 批 4 引用关系断链全谱+修复形态（先呈形·候 CTO 核）

- sourceOfTruth: 本卷（批 4 断链全谱读数+修复规则候选正身·先呈后批·不自动开工）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 批 4 排程令（2026-11-04T09:12:14Z 信 §三「先呈我核·核过施工」）·批 1 scope 裁定（批 4 联动形态先呈照准）
- 扫描附件: Temp/sde-batch4-linkscan.txt（逐条全谱·脚本 sde-batch4-linkscan.py dry 存档）

## 一 · 全谱读数（2026-11-04 扫描·四项抽验复核毕）

| 区 | 断链条数 | 处置域 |
|---|---|---|
| TMV LIVE | **61** | 本卷分族候裁 |
| TC LIVE | **6** | 本卷分族（TC 48 中 42=IPD-20260612 出圈树·r5 零动作） |
| TT LIVE | **2** | 跨仓错写形 |
| TMV OPREC 区 | 61 | **冻结不动**（批 1 定谳·读数留档） |
| **合计 LIVE** | **69** | |

- 抽验复核四项（防扫描误报）：①TMV fade 跨仓 7 条=**真断**（`../../` 两级只到 TMV 根跳不出仓·单测 normpath 实证）②TC `runtime/cognition/*.py`=仓根在（`../runtime` 单层差=真断·`../../runtime` 即达）③W24 OP 两件在（`OP-202606-W24-001.unresolved-items.md`+`.json`）④TT 03-链路件=**在 TMV**（docs/training/tricompany/03-source-publish-live-链路.md·跨仓错写实锚）。

## 二 · 五族构成与修复规则（候选·候核）

### r1 · 基座勘正形（机械·目标在·≈36 条）
相对层级差·改前缀即达·零语义变更：
- TMV tricompany.md 15 条（`../TriCompany/`→`../../TriCompany/`·跨仓 fade 引用 8 条 `../../TriCompany/`→`../../../TriCompany/`）+architecture-socialfi mmd 2 条（`docs/` 多余前缀剥→`../architecture-overall-unified.mmd`·件在 docs/ 根实锚）+TC backfill-runbook `../runtime` 2 条（→`../../runtime`）+TC OP 引用 3 条（`../TriMetaverse/`→`../../TriMetaverse/`·W24 件在）+TC fade-tutorial 1 条（`../../../TriMetaverse/tricompany.md`→补 docs 层）
- 修前逐条目标存在性断言·修后复扫归零断言

### r2 · 跨仓索引改写形（语义面·24 条·候裁）
同目录名实指他仓件——TMV training/README 14 条+engineering/ROADMAP 4+STATE 3+workflow/README 1+TT 2 条：
- 目标件全在 TC 仓（training 系/ade 系/ipd 系·批 3 TC 面同名件实锚）或 TMV 仓（TT 2 条）
- 修复形=同目录名→跨仓全路径（`../../TriCompany/docs/training/...` 形）
- 候裁点：改链接（本卷建议·低风险保索引活性）vs 件归属迁移（文档治理域·超本批 scope）

### r3 · mermaid SVG 族（8 条·候裁）
tmv-whitepaper 引 `mermaid/tmv-wp-*.svg` ×8——**docs/mermaid/ 目录空/不存在**（SVG 资产缺位）。白皮书=商业模式真源+批 2 已注 BOM 件敏感面。候选：a) mermaid fence 源码块替换 SVG 引用 b) SVG 资产生成补齐 c) 引用位退役标注。候 CTO 裁·不自动动。

### r4 · 历史指针形（4 条·候裁）
tc001-harness tree-op.json 3 条（指 2026-W35 历史树·失效=当时位置记录）+TMV training/tricompany/README.md:44 畸形链接 1 条（URL 编码+错位混合·生成器 bug 产物形）。候选：历史指针标注（「已归档」注）vs 不动（历史叙事冻结精神）。候裁。

### r5 · 出圈区零动作（42+61 条）
TC IPD-20260612 树 42 条+TMV OPREC 区 61 条——批 2/3 同判据（档案树/记录面翻动违历史冻结）·零动作。

## 三 · 施工粒度计划（候核后）

- 建议切两批：**4a=全部 r1 机械形**（≈36 条·每条修前 exists 断言+修后全谱复扫归零）→**4b=r2 跨仓索引 24 条**（若核）。r3/r4 随本卷候裁·裁后另批。
- 修后验证=复扫脚本重跑·LIVE 断链面=r3 8+r4 4（候裁未动面）·余归零。

## 四 · 使用依据

- CTO 批 4 排程令（09:12:14Z §三先呈后批）·批 3 核准令（08:53:34Z）
- 扫描实锚：sde-batch4-linkscan.py+linkscan.txt（逐条）·单测复核五条（normpath 实证）
- RDT citation-map 基线（rdt-citation-map-and-d67-opinion.md 在档·TT 面参照）

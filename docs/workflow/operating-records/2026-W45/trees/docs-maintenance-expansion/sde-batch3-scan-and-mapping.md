# docs-maintenance · 批 3 全扫读数+迁移映射表（先呈形·候 CTO 核）

- sourceOfTruth: 本卷（批 3 全扫读数+分档迁移规则正身·候核后施工）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 批 1 scope 裁定（2f5e45a70·「批 3 映射表先呈」+「1.0.x 基准采」）·D-67 条文·RDT 备料卷分档建议

## 一 · 全量读数（2026-11-04 全扫·grep 实数）

| 仓 | 版本行件数 | 备注 |
|---|---|---|
| TriMetaverse/docs | **60** | 含 archive 4·runs 4·活协议 1 |
| TriCompany/docs | **91** | 含 C 档已合规 2·IPD-20260612 档案树 8·英文裸数字形 1 |
| TriTraining/docs | **14** | host-publish 系+source-kit 系+枢纽 README |
| **合计** | **165** | 另：英文形 1（TC entry-routing-layer-design.md:93 `version: 1`）+tutorialVersion 5（双层不动面） |

## 二 · 分档迁移规则（四档·候核）

| 档 | 判据 | 迁移形 | 件数估 |
|---|---|---|---|
| **A·V 世代两段式** | 行首 `版本：V0.x/V1.x/V2.x`（含 -DRAFT/待讨论/初稿等注记尾） | **V0.x→1.0.0**（D-67 款 3+RDT 明示）；**V1.x/V2.x 保数字补段**（V1.1→1.1.0·V2.0→2.0.0——保世代迭代信息·倒退归 1 会毁「经历 v1 世代」语义）——V≥1 保数字系 SDE 增补判·候核 | ~140 |
| **B·数字小写两段式** | `版本：v1/v1.1/v2.0/v2.2`（无 V 字头） | 保 major.minor 补 patch 段（v2.2→2.2.0·v1→1.0.0·v0.1→0.1.0） | ~8 |
| **C·已三段合规** | `版本：v2.0.6/v1.1.0` | **不动**（TC fade-protocol-spec·fade-assessment-paper-template=2 件） | 2 |
| **D·冻结面** | docs/archive/+workflow/archive/+tutorialVersion | **不动**（CTO 批 1 裁定「版本号冻结不动」）：TMV archive 3+workflow/archive 1+tutorialVersion 5=9 件 | 9 |

- **注记语处理（候裁项 α）**：现版本行大量带括号注记（`v2.0.6（2026-11-02：§2.8…增补…）`/`V1.0（2026-09-05，RDT 小吴执笔…）`/`V0.1 → V1.0（已批准）`）。两选：**a) 注记全保留**（最小干预·历史叙事原地）vs **b) 版本行只留 x.y.z·演进注记迁 git**（D-67 机器可读精神·但改动大且丢行内演进可读性）。SDE 建议=a（最小干预·注记保留·仅主干数字段迁移）。
- **英文裸数字形 1 件**（TC entry-routing-layer-design.md:93 `version: 1`·第 93 行=正文区非头部元信息位）：候核——按 B 档迁（1→1.0.0）或判为正文字段非版本头出圈。SDE 勘后定（施工时读上下文）。

## 三 · scope 附属候裁三项（批 1 漏圈族·与批 2 信附注同族）

1. **TMV docs/runs/（run-R01..R04·4 件）**：2026-02/03 历史 run 档案——记录面语义同类 operating-records→**候选出圈**。
2. **TC agile-improvement/IPD-20260612-WORKFLOW-002 树（8 件）**：日期戳工作流档案树，但内含 record-template/checklist 类**复用模板**（10-discovery-replay-result-record-template 等）——混合面。候裁：整树出圈 or 模板件入圈档案件出圈。SDE 建议=整树出圈（战役档案树整体性·模板复用现状查实后再说）。
3. **TMV execution/2026-08-24/ 两子树**：audit-campaign 14 件（已随批 2 信呈·记录面候选出圈）；mr-worktree-collaboration-protocol.md 1 件=**活协议正身**（v2.2 演进注记至 2026-08-31·非档案）→**入圈 B 档（→2.2.0）**。

## 四 · 施工粒度计划（候核后）

- 施工面≈165−D 档 9−候裁出圈面（runs 4+IPD 树 8+audit-campaign 14 候裁中）≈**130±件**。
- 分三批 commit：TMV 批（60−冻结 4−候裁面）→ TC 批（91−C 档 2−候裁面）→ TT 批（14）。每批施工=机械替换主干数字段+注记原样保留（候裁 α=a 案前提下）。
- 版本行不动语义面：行内其他字段（状态注记/日期）零触碰——只迁 `V0.1`→`1.0.0` 形主干数字。
- D-67 款 2 联动：迁移≠升版（存量归位非内容变更）——迁移后版本行不再因本次施工 minor+1（映射即终态）。

## 五 · 使用依据

- CTO 批 1 scope 裁定卷（2f5e45a70）：archive 冻结采·cc-tutorial 入圈·1.0.x 基准采·批 3 映射表先呈
- D-67 条文（engineering-disciplines.md L1057-1068·三段式/0-99/major+1/存量迁移）
- RDT 备料卷：tutorialVersion 双层禁套+分档映射（major=换代/minor=增改/patch=勘误）
- 全扫读数：grep 实数（2026-11-04·TMV 60/TC 91/TT 14·命令与逐件清单在 git history 本卷同 commit 备查）

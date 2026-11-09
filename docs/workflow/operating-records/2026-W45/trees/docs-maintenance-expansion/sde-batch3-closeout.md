# docs-maintenance · 批 3 版本行迁移收口卷（SDE）

- sourceOfTruth: 本卷（批 3 施工收口正身·三仓 commit 锚+候裁附注清单）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 批 3 核准令（2026-11-04T08:53:34Z 信·含 B 档 v0.1→1.0.0 勘正+A 档增补判采认）

## 一 · 施工读数（三仓三 commit·165 件迁移）

| 仓 | commit | 件数 | 形 |
|---|---|---|---|
| TriMetaverse | **5d814ea50** | 70 | +70/−70 单行替换 |
| TriCompany | **3adb5cc** | 81 | +81/−81（含 ARROW 演进形 1） |
| TriTraining | **7fffb25** | 14 | +14/−14 |
| **合计** | 3 commit | **165** | 全单行替换·零内容变更面 |

- 迁移分布：**118 件 v0.x 归 1.0.0**（A/B 档勘正形·大小写同判）+**46 件保数字补段**（V1.1→1.1.0/V2.0→2.0.0/v2.2→2.2.0·A 档增补判）+**1 件箭头演进形**（TC company-project-host-architecture `V0.1 → V1.0（已批准）`→`V0.1 → 1.0.0（已批准）`·取箭头后主干·前 token 并注记保留）。
- **剥 v/V 前缀正形**：迁移目标=纯三段数字（CTO 信目标形·`v0.1→1.0.0` 例）；C 档既有件（v2.0.6/v1.1.0）不动不剥。
- 特形全机械毕：draft 尾保留（`1.0.0-draft`）·加粗包裹保留（`**1.0.0**`）·注记原样（括号/竖线/待讨论/-DRAFT/中央追平版）·引用块前缀保留（`> 版本：`）·键名变体全兼容（版本/文档版本/版本:）。
- residual 扫描：活面（出圈区外）零残留 v0.x 两段式（grep 三仓复验 2026-11-04）。

## 二 · skip 面 37 件（全拦截留档）

| 判 | 件数 | 明细 |
|---|---|---|
| D 档冻结+runs 出圈 | 8 | TMV archive 3+workflow/archive 1+runs 4 |
| operating-records 出圈（批 1 定谳） | 11 | 周记 3+树件 5+AGENDA 1+dprime 卷 1+共学周记 spec 2 行 |
| IPD-20260612 树整树出圈 | 8 | TC agile-improvement 树 |
| 38 出圈散件 | 1 | TC employee-capability-sync-audit |
| C 档合规不动 | 2 | TC fade-protocol-spec v2.0.6+fade-assessment-paper-template v1.1.0 |
| E 档周版本族候裁 | 7 | 见 §三 |

- 英文裸数字 1 件（TC entry-routing-layer-design.md:93）：施工时勘定=**active-host.yaml YAML 配置示例块内字段**（正文区）——正文出圈默认判成立（CTO 信 §4 确认）·不动。

## 三 · 候裁附注三项（新发现形态·本批不动·候 CTO 裁）

1. **E 档周版本族 7 件**（TMV execution 面）：`版本：v2026.W33.x` 形（worktree-architecture-design/server-fleet-m0/server-fleet-trilc-parity-plan/init-to-collab-design/project-workspace-design-v2/production-grade-development-plan/trilc-capability-checklist）——周计划编号非 semver 世代语义。SDE 建议=**出圈判**（D-67 三段式适用域=文档版本世代·W 编号=计划面编号·迁则荒谬）·候裁。
2. **ade-journal-recording-spec 1 件**（TMV operating-records/项目级 AI 共学周记/）：`版本：v1.0`+`版本：v1.1` 双行演进形——**活规范困 OPREC 目录**（共学周记 ADE 规范=memory 索引引用活件·非档案）——同 mr-worktree 判据（演进活性非路径）候选**入圈 A 档 v1.1→1.1.0**·候裁。
3. （已勘定无剩余）——正文引用行/模板占位/外部依赖键名（适用版本/SDK 版本/白皮书版本占位符）=机械出圈零记录面·行号窗 ≤20 全量核对过。

## 四 · A 档增补判释义留痕（随毕报呈 COS 转 BOD 知情）

- 增补判：**V≥1 保数字补段**（V1.1→1.1.0·V2.0→2.0.0）——CTO 核准释义：D-67 条文「现世代 1.x.x 形」=示例形非世代封顶；释义锚=类 Linux major 语义（重大改版=major+1）+RDT 分档映射（major=换代/minor=增改/patch=勘误）——保数字使世代语义单调不回退（V2.0→1.0.0 会毁「经历 v2 世代」事实）。
- 施工例证：46 件保数字迁移（含 fade 系培训件 V1.1→1.1.0×3·trilc-trimc-runtime-parity V1.1→1.1.0·fade-registry v2.1→2.1.0·knowledge-injection-spec v2.0→2.0.0·project-source-document-sync-fade-tutorial V2.0→2.0.0 等）。

## 五 · 使用依据

- CTO 批 3 核准令（08:53:34Z·四档规则+两处勘正+scope 三项定谳）·批 3 映射表（64e33d468）
- 施工脚本：sde-batch3-migrate-versions.py（Temp·dry-run→apply 两段·v1 三 bug 抓获于 dry-run 段：archive/runs 前导路径漏拦+周版本族误迁+v 前缀未剥；v2 加粗保留修）·dry-run 全谱=sde-batch3-dryrun.txt
- 三仓 git log（5d814ea50/3adb5cc/7fffb25）·residual grep 复验

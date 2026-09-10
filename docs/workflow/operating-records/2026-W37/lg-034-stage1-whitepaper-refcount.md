# LG-034 阶段 1·切片 2a 白皮书引用面全量复数清单

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W37/lg-034-stage1-whitepaper-refcount.md
- syncMode: frozen-once（一次性清点件；迁移执行后由执行窗追加执行读数段，不改前段）
- lastSyncedAt: 2026-09-11T00:31+0800（CTO 小狄落盘）
- 派工依据: COO 切片 2a 令（签发 2026-09-11 00:25+0800）；CEO 批准令 00:21+0800 批次授权
- 扫描器: rg --glob '**/*.md'（排 node_modules/** 与 .git/**）；关键词 `tmv-whitepaper`
- 状态条: ①2026-09-11 00:28:50+0800 现查（星期五）②联审证据=本清单逐件表+双口径计数码 ③水位自估：中 ④点目录覆盖性=已覆盖（--hidden）⑤末次活动=落盘时刻

## 一、扫描口径与覆盖性（验收锚 M3）

- 范围=TriMetaverse + TriCompany 两仓 `**/*.md`（CAO 审计根声明口径）。
- **点开头目录覆盖性：已覆盖**。双口径对照：A（默认 rg，不含点开头目录）=**50 件**；B（`--hidden`，含 `.claude/` `.github/` 等）=**63 件**。差 13 件全部为点开头目录内派生渲染面（.claude/hub×3、.claude/agents×4、.github/agents×6）。
- 排除项如实声明：`node_modules/**`（vendored 依赖）与 `.git/**` 排除；非 .md 面（json/yaml 等）不入本口径（如实注记：仅 operating-records 下即另存在 4 件 json 命中：2026-05/2026-04 BD 纪要×2、W15 OP json、W34 tree-op.json——**未计入** 63，属 **/*.md 口径外）。
- 白皮书正身 `tmv-whitepaper.md`（TMV 仓库根）=迁移对象本身，不计入引用面。
- **CLAUDE.md 零命中**（TMV 根 CLAUDE.md 无白皮书引用）——本席组审稿①曾提及 CLAUDE.md 引用面，以本清单为准更正。

## 二、三分类汇总

| 分类 | 计数 | 判据 | 处置 |
| --- | --- | --- | --- |
| 活体真源/指针面（须改写） | **37**（TMV 27 + TriCompany 10） | 非 operating-records、非派生渲染面的在役文档与源侧 agent 定义 | 迁移执行窗随 `git mv 根→docs/` 同窗改写引用路径；source-agents 面走源侧改写→渲染链再生，禁直改发布面 |
| 历史冻结件（豁免不动） | **12** | `operating-records/` 系全部 .md 命中 | 豁免；历史叙事冻结原则 |
| 派生渲染面（禁手改随管线再生） | **13** + 资产系 1（见 §三.C 注） | `.claude/hub`、`.claude/agents`、`.github/agents` | 源侧改写后随渲染管线整体再生；禁手改（wave0 §二修正形态惯例） |
| 合计 | **63** | B 口径 | — |

## 三、逐件清单

### A. 活体真源/指针面（37 件，迁移执行窗改写）

拟改写动作统一缩写：**[P]**=引用路径平移（根→docs/，随 git mv 同窗）；**[P†]**=历史倾向活体件，候裁「随批平移或豁免」（不动叙事只裁路径）；**[S]**=TriCompany source-agents 源侧改写→随批渲染再生；**[X]**=LG-034 切片 1 靶标件，白皮书引用随切片 1 重写一并落，本迁移窗**不重复触碰**。

| # | 路径（仓内相对） | 动作 |
| --- | --- | --- |
| 1 | TriMetaverse/AGENTS.md | [P] |
| 2 | TriMetaverse/project.md | [P] |
| 3 | TriMetaverse/tricompany.md | [P] |
| 4 | TriMetaverse/arch-storage-migration.md | [P†] |
| 5 | TriMetaverse/tmv-phase-1-execution-plan.md | [P†] |
| 6 | TriMetaverse/docs/文档治理与真源文件系统.md | [P] |
| 7 | TriMetaverse/docs/三元宇宙架构与模块说明.md | [P]（L89 白皮书 §3.1 详引为高价值锚，迁移后路径必须同步） |
| 8 | TriMetaverse/docs/training/tricompany/README.md | [P] |
| 9 | TriMetaverse/docs/registry/business-strategy-state.md | [P] |
| 10 | TriMetaverse/docs/registry/business-strategy-module-map.md | [P] |
| 11 | TriMetaverse/docs/workflow/版本策略与经营记录分层.md | [P] |
| 12 | TriMetaverse/docs/workflow/workflow-runbook.md | [P] |
| 13 | TriMetaverse/docs/workflow/workflow-engine-spec.md | [P] |
| 14 | TriMetaverse/docs/workflow/terminology.md | [P] |
| 15 | TriMetaverse/docs/workflow/prd-branch-delivery-checklist.md | [P] |
| 16 | TriMetaverse/docs/workflow/pr-description-waterfall-alignment.md | [P] |
| 17 | TriMetaverse/docs/workflow/phase-io-matrix.md | [P] |
| 18 | TriMetaverse/docs/prd/README.md | [P] |
| 19 | TriMetaverse/docs/prd/PRD001基础平台.md | [P] |
| 20 | TriMetaverse/docs/prd/PRD-template.md | [P] |
| 21 | TriMetaverse/docs/execution/two-phase-architecture-roadmap.md | [P†] |
| 22 | TriMetaverse/docs/execution/tricade-implementation-playbook.md | [P] |
| 23 | TriMetaverse/docs/execution/tmv-fade-reading-map.md | [P] |
| 24 | TriMetaverse/docs/execution/repo-topology-20260831.md | [P†]（带日期拓扑快照） |
| 25 | TriMetaverse/docs/execution/2026-08-24/doc-versioning-governance-rules-draft.md | [P†] |
| 26 | TriMetaverse/docs/execution/2026-08-24/mmc-host-driver-design-draft.md | [P†] |
| 27 | TriCompany/source-agents/business-strategy/agent-body.agent.md | [X]（切片 1 靶标，L23/L42 随重写落；同族 contract.yaml description 同串随切片 1 三面同步，此处不另计件） |
| 28 | TriCompany/source-agents/registries/business-strategy.agent.md | [S] |
| 29 | TriCompany/source-agents/registries/TriMetaverseProductRegistry.agent.md | [S] |
| 30 | TriCompany/source-agents/registries/TriMetaverseBusinessStrategyRegistry.agent.md | [S] |
| 31 | TriCompany/source-agents/rd-trainer/session-body.agent.md | [S] |
| 32 | TriCompany/source-agents/chief-product-officer/session-body.agent.md | [S] |
| 33 | TriCompany/source-agents/ceo-chief-of-staff/ceo-chief-of-staff.agent.md | [S] |
| 34 | TriCompany/source-agents/ceo-chief-of-staff/agent-body.agent.md | [S] |
| 35 | TriCompany/docs/workflow/employee-standard-capabilities.md | [P] |
| 36 | TriCompany/docs/workflow/company-project-host-architecture.md | [P] |
| 37 | TriCompany/docs/project-sources/trimetaverse-agents-md.md | [P†]（project-sources 快照族） |

活体实计 **37 件文件**=#1-#37 逐件行；TMV 27 + TriCompany 10，两仓合计闭合。

### B. 历史冻结件（12 件，豁免）

| # | 路径 |
| --- | --- |
| 1 | operating-records/2026-W37/lg-034-stage1-agentbody-ceo-input.md |
| 2 | operating-records/2026-W37/lg-034-stage1-agentbody-cao-draft.md |
| 3 | operating-records/2026-W37/lg-034-stage1-agentbody-cpo-draft.md |
| 4 | operating-records/2026-W37/lg-034-stage1-agentbody-cto-draft.md |
| 5 | operating-records/2026-W37/lg-034-stage1-agentbody-bs-spawn.md |
| 6 | operating-records/2026-W36/daily-progress.md |
| 7 | operating-records/2026-W34/trees/tmv-minimal-restructure-analysis/R3-concept-naming-inventory.md |
| 8 | operating-records/2026-W34/trees/tmv-minimal-restructure-analysis/R5-concept-analysis.md |
| 9 | operating-records/2026-W34/trees/tmv-minimal-restructure-analysis/R9-vision-mapping.md |
| 10 | operating-records/2026-W31/cc-fidelity/cpo-bridge-eval.md |
| 11 | operating-records/2026-W29/cpo-product-routing-package.md |
| 12 | operating-records/2026-W29/OP-202607-W29-001.unresolved-items.md |

（路径前缀均=TriMetaverse/docs/workflow/）

### C. 派生渲染面（13 件 + 资产系 1 件注记，禁手改）

| # | 路径 | 系 |
| --- | --- | --- |
| 1 | TriMetaverse/.claude/hub/rd-trainer.session.md | .claude/hub |
| 2 | TriMetaverse/.claude/hub/ceo-chief-of-staff.session.md | .claude/hub |
| 3 | TriMetaverse/.claude/hub/chief-product-officer.session.md | .claude/hub |
| 4 | TriMetaverse/.claude/agents/ceo-chief-of-staff.md | .claude/agents |
| 5 | TriMetaverse/.claude/agents/business-strategy.md | .claude/agents |
| 6 | TriMetaverse/.claude/agents/TriMetaverseProductRegistry.md | .claude/agents |
| 7 | TriMetaverse/.claude/agents/TriMetaverseBusinessStrategyRegistry.md | .claude/agents |
| 8 | TriMetaverse/.github/agents/business-strategy.agent.md | .github/agents |
| 9 | TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md | .github/agents |
| 10 | TriMetaverse/.github/agents/tri-metaverse-product-registry.agent.md | .github/agents（小写变体与 #12 并存，命名残留另案） |
| 11 | TriMetaverse/.github/agents/tri-metaverse-business-strategy-registry.agent.md | .github/agents（同上） |
| 12 | TriMetaverse/.github/agents/TriMetaverseProductRegistry.agent.md | .github/agents |
| 13 | TriMetaverse/.github/agents/TriMetaverseBusinessStrategyRegistry.agent.md | .github/agents |
| 注 | TriMetaverse/TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/wiki/employee-consumption-records.md | copilot-host 发布资产系——非 .claude/.github 系但同属派生面，拟按渲染资产随源再生处理，owner 候 COS/渲染链窗确认 |

## 四、基线对照与差异归因

| 基线 | 读数 | 与本清单对照 | 归因 |
| --- | --- | --- | --- |
| CAO 59（48+11） | 我 A=50／B=63 | **TriCompany 侧 11 与 CAO 尾数 11 精确一致**（我 TC 非点目录命中=11）；CAO 首数 48 落在我 TMV 无点目录 39 与含点目录 52 之间 | 主因=**点目录覆盖口径差**（48 疑似含部分渲染面）+**同日快照时点差**（LG-034 五稿系当日落盘前后增减动）。建议：执行以本清单逐件表为基线，CAO 原始清单留档 diff 复核；差值不阻塞执行（执行窗再全量复验一遍 rg 即闭环） |
| CPO ≥41（30+截断+11） | 我 TMV 侧=39（无点）/52（有点） | 41<52，方向不矛盾 | **列举截断致下界**（CPO 自注「截断」），非口径冲突；+11 与 TC 侧同数 |
| BS spawn 确证 4 | — | 交叉点 | spawn 确证=BS 家族相关抽面（source-agents 2+registries 1+渲染面确证），**非全量口径**，作交叉验证点不作对照值 |

## 五、执行窗注意（候 COO 读数确认后另令）

1. 本段**只清点零改动**；`git mv tmv-whitepaper.md → docs/` + 活引用改写候另令（批次授权内，仅时序控制）。
2. 执行窗三步建议：①git mv 正身 ②[类活体 37 件]按 §三.A 动作列改写（[P†] 五件候裁随批/豁免）③rg 全量复验=根路径引用归零+docs/ 新路径命中数对表。
3. 渲染面 13+1 禁手改；source-agents [S] 件改写后必须走渲染链再生发布面，禁直改 .claude/.github。
4. **范围外联动项如实报备**：席侧行为记忆「真源核查纪律」（白皮书在根指针）在迁移执行后须同步更新（CTO 席自领，执行窗一并）；两仓 json/yaml 面白皮书引用不在 **/*.md 口径内，如需一并收口请 COO 增补口径另批。
5. 切片 1 靶标件（agent-body.agent.md）白皮书引用 L23/L42 已在切片 1 重写范围，迁移窗跳过防双重触碰（时序：切片 1 重写先行或同窗合并均可，跳过标记见 §三.A #27）。

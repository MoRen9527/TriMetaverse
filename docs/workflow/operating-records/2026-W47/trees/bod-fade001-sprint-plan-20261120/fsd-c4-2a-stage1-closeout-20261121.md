# FSD 毕报卷·C4 批 2a 段一（TriMMC sg 侧试收敛）——kit v2 扩容+薄壳切换·回归五判据全过（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T03:25:47Z（date 现查粘贴·+8=11:25:47·D-47 正形）
- 令面: COO C4 段一窗位令（03:08:10Z）+CTO 实现门令 §四+CTO 迁移形 B 裁（permissions 值面整体入 kit）
- **next_agent=COO+CTO 两面并行**（段一收口定谳+终审随卷）

## 一·施工面兑现（照 CTO 裁 form B 施工序）

### kit v2 扩容（TriOrchKit·sg）

- **src/permissions/index.ts**（新）：agent-core re-export 层（AgentTier/PermissionResult/TOOL_TIER_ALLOWLIST/filterToolsForTier/getTierToolCounts/canUseTool/getTierSummaryForTier alias）+ **TriMC-specific 值面**（TIER_DESCRIPTIONS/getToolNamesForTier/getTierSummary）——从 TriMMC agent-loop/permissions.ts 整体迁入（分叉债根治：TriMMC vs TriRMC diff 138 行实证）；
- **8 件入 kit**：context-builder/prompt-cache（index+cache-control）/policy-gate/tool-gater/task-controller/soul-loader/memory-injector/pipeline——imports 重写：permissions 路径→kit 内（3 处命中）、loop 类型→**structural projection**（pipeline/loop-types.ts 新增·KitAgentLoopOptions 10 字段全可选子集·双向 structural typing 兼容）、default-model 值 import→**ModelResolver 注入**（pipeline/model-resolver.ts 新增·pipeline 第二可选参）；
- **package.json**：exports 子路径 **9 新**（./permissions + 8 件·`(a) 追加零破现役`）+ trimodel devDep（type-only·file:../TriModel）；
- **src/index.ts**：permissions re-export（8 件走子路径不经根聚合——**TaskPriority 同名不同义消歧**：orchestration P0/P1/P2 vs task-controller low/normal/high/critical·TS2308 实锚）。

### TriMMC 消费切换（薄壳形·消费方路径零改）

- **9 文件薄壳化**：`export * from '@tricompany/orchestration-kit/<sub>'`（permissions/context-builder/prompt-cache×2/policy-gate/tool-gater/task-controller/soul-loader/memory-injector/pipeline）——批外消费方（agent-loop/loop ×3 件·server/app.ts ×2 件）import 路径全部零改；
- **server/app.ts 注入适配**：`assemblePipelineOptions(..., { resolveDefaultModel })` 第二参注入（消除双 resolve·复用既有 config-sync/index import 去重）。

## 二·回归绿判据五件（段一过门硬项·全过）

| # | 判据 | 读数 |
|---|---|---|
| 1 | kit build 绿 | **rc=0**（tsc·零错误·dist 十目录产物齐） |
| 2 | kit 全测试绿 | **69/69 pass**（11 suites·contract 族·现役 exports 零破实证） |
| 3 | TriMMC 全测试套件 | 724 tests·**677 pass·38 fail·6 cancelled·3 skipped**——**stash 基线对照逐位一致**（改动前 677/38/6/3 = 改动后同数字）→ **38 fail+6 cancelled=既有失败·与 C4 零关系**（归因证据=数字恒等） |
| 4 | TriMMC 活体零退化 | `/healthz`=**200**·pid 3315600 uptime **8h11m 连续**（施工全程零重启）·`/internal/v1/health`=401（gate 正常） |
| 5 | TS2307 族零新增 | TriMMC tsc `--noEmit` **rc=0 全绿**（零 TS2307 零其他类型错误） |

## 三·回滚锚三形（在位）

| 形 | 锚 |
|---|---|
| kit 独立 commit 段 | **3bebbab**（前序 2bb4d65·`git revert` 形） |
| TriMMC dist bak | `/srv/fleet/TriMMC/dist-bak-pre-c4-2a-20261121T031219Z` |
| 源码 bak（附加形） | 11 个 `.bak-c4-2a` 未跟踪在位 + TriMMC commit **7eb5a4b**（可 revert） |

**零部署恪守**：kit 变更生效绑消费方各自部署窗（TriMMC 运行 dist 未重建·daemon 仍旧 dist 运行）✓ 照 CTO「零部署」序。

## 四·process 如实档

1. **kit exports 快照**（段一毕报要件）：`.`·`./permissions`·`./context-builder`·`./prompt-cache`·`./policy-gate`·`./tool-gater`·`./task-controller`·`./soul-loader`·`./memory-injector`·`./pipeline`（10 条）；
2. **TS2308 消歧决策**：TaskPriority 冲突→8 件走 export subpath 不经根聚合（零改名·消费方零感知）；
3. **TriMMC commit 修正一笔**：首次 commit 误带历史 `src/cron/command-handler.ts.bak-obs-20261010`（pathspec 排除只覆盖 *.bak-c4-2a）→ `git rm --cached`+amend 修正（HEAD 归属先验=我笔·32d29f8→**7eb5a4b** 11 files 纯我的改动）；
4. 工具面险情：多源 scp 混写误建目录两处（model-resolver.ts//tmp 脚本）→清理重建；kit git identity 缺→`-c` 单次豁免。

## 五·段二预备与边界

- 段二（TriRMC 河源迁移）候窗：同形复制（kit 侧消费取件+薄壳）+河源通道勘定·**8710 重启类动作必排周日拍后（11-22 23:50 后）·零重启迁移不受限**——开工前报面核实（COO 令 §五）；
- TriRMC 侧 permissions.ts diff 138 行分叉=本次 kit 单点真源已根治（段二薄壳后两侧同源）；
- STE 契约卷 v2 增补（M1-M8 快照+注入冒烟）候 STE 面。

## 六·使用依据

COO 段一窗位令+CTO 实现门令 §四+CTO form B 裁+拆树令（8 件清单/回归五判据/回滚锚）+sg 现勘读数（8 件 imports/permissions 混合形/contracts 头注释差）+kit build/test+TriMMC tsc/test/stash 基线对照/活体探+commit/amend 读数。

---
落卷=FSD 小全（m-fsd）·C4 段一毕报（11:25+8）·**next_agent=COO+CTO**（收口定谳+终审）·回归五判据全过（38 fail=既有基线恒等）·回滚锚三形齐·零部署恪守·段二候窗


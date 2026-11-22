# 周平面迁移 · must_migrate 族清单与 top_level 逐项判定（根因修卷）

- sourceOfTruth: 本卷（docs/workflow/migration-must-migrate-families.md·迁移器根因修判据面正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: W48 迁移质量联审缺陷①②（top_level 8 语义未解释+carry-over 族清单根因修）——COS 转呈 2026-11-23 03:04 + CPO 补铸提请
- 落款: 写前现查 2026-11-22T19:05:42Z（+8=2026-11-23 03:05:42·D-47 正形）

## §一 · top_level 8 逐项清单（W47→W48 实勘判定）

**语义定锚**：`counts.top_level=8`=**迁移器评估的 W47 顶层项数**（W47 周目录 8 项·实勘 2026-11-23 03:05）——非「应迁项数」。

| # | W47 顶层项 | 族 | W48 去向（实勘 03:05） | 判定 |
|---|---|---|---|---|
| 1 | OP-202611-W47-001.json | 记录族 | W48 新建 OP-202611-W48-001.json（99KB）·W47 原留封存 | 符合（记录随周封存） |
| 2 | OP-202611-W47-001.unresolved-items.md | 记录族 | W48 新建 unresolved-items（16KB）·W47 原留 | 符合 |
| 3 | task-inventory-20261117.md | 记录族（大表） | W48 新建 task-inventory-20261123.md（承 W47 未完成 9 行+新增·02:27 补建） | 符合（首跑缺·后补建） |
| 4 | daily-progress.md | **活件族** | W48 daily-progress.md（**03:04 CPO 补铸 fe668db4f**） | **首跑缺→补铸**（根因：迁移器未覆盖活件族） |
| 5 | cfo-quota-daily-w47.md | **活件族** | W48 cfo-quota-daily-w48.md（03:04 补铸） | **首跑缺→补铸**（同因） |
| 6 | company-demand-pool.md | **活件族** | W48 company-demand-pool.md（03:04 补铸·40KB） | **首跑缺→补铸**（同因） |
| 7 | convene/ | **活件族（dir）** | W48 convene/（03:04 补铸） | **首跑缺→补铸**（同因） |
| 8 | trees/ | 树族 | keep 26 留 W47 + carry_over 2 + top_level 树 8（bidirectional_ok=true） | 符合（记录封存/活带走语义） |

**根因判读（三连实锚 W45 补课/W47 补铸/W48 补铸）**：迁移器**只覆盖记录族+树族**·**活件族（daily-progress/cfo-quota/demand-pool/convene）零覆盖**→每轮补铸。**根因修=must_migrate 族清单入迁移器判据**（§二）。

## §二 · must_migrate 族清单（B1 判据 A1·逐族对表）

| 族 | 成员（通配） | 迁移语义 | 必迁？ |
|---|---|---|---|
| **记录族** | `OP-2026xx-Wnn-001.json`／`*.unresolved-items.md`／`task-inventory-*.md`／`todo-list-*.md` | 随周封存（新周新建·旧周原留） | **是（新建形）** |
| **活件族** | `daily-progress.md`／`cfo-quota-daily-w*.md`／`company-demand-pool.md`／`convene/` | **活随人带走**（新周承接续写） | **是（承接形·本轮缺位根因）** |
| **树族** | `trees/**` | keep（记录封存·留旧周）／carry_over（跨周活任务树带走）／top_level（新树根） | **按判据分流** |
| **元数据** | `.shift-ade.json`（+`.prev`） | 滚动（新周新建·prev 留旧） | 是（机关面自动） |

**修器动作（技术面·CTO/SDE 落码）**：迁移器须按本表逐族对表——活件族=承接形（读旧周→写新周）·记录族=新建形·树族=三判据分流；**校验断言**=`--check` 增「活件族四项在新周全在」机械判据。

## §三 · carry-over 族与第 4 缺陷关联

1. **carry_over=2 明细**：候 SDE 卷细目精确（本席实勘目录层不可分辨）——**建议迁移器输出 carry_over 逐项清单**（名字+判定）入 `.shift-ade.json`（与 top_level 同形留痕）。
2. **第 4 缺陷（ignite 轮 ceo-ruling）**：本席轮间门督办 SOP 在录——**11-29 拍前值席落件（continue）**——挂账照役。

## §四 · 使用依据

W48 迁移质量联审（COS 聚合卷 f7f567b12·均分 73.49 判 evolve）；CPO 补铸卷 fe668db4f；SDE 补跑卷 6202b5aa6（counts 实锚）；实勘 W47/W48 顶层 2026-11-23 03:05；本席台账 964-966。

—— COO 小营（m-coo·根因修卷）·写前现查 2026-11-22T19:05:42Z（+8=2026-11-23 03:05:42·D-47 正形）

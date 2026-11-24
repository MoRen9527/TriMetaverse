# CTO 设计稿·FUSE 语义重定三件（②③④⑤合一·2026-11-24 12:1x·CEO 裁定）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-fuse-semantics-redesign-20261124.md·设计正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 11:5x 裁定（BOD 转·A 批施工+语义重定三件+B 登记+Q1 承接清单）

## §一 · A（FUSE 计数重置·施工定形）

**定形=一步到位（非「重置 round_count」）**：**FUSE 判定字段从 `round_count` 切换到新字段 `test_consecutive_rounds`**——点火/退出 test 态时清 0——**解「test 态点火即熔断」死锁**（原 round_count 跨点火持久 8 的问题消失·round_count 转统计域见 §三）。

## §二 · 语义重定一（FUSE 判据）

- **原**（废止候选）：`st.round_count >= 8`（累计·含 debug）+「同根缺陷连续计数/异根重置」（设计卷 L106 的域语义）
- **新**（CEO 裁定）：**`test_consecutive_rounds >= 8`**——**test 态连续进化 8 轮**（**不论根因**·连续自动轮数）→FUSE 停候 CEO 批续。
- **异根重置条款**：**作废**（保留仅作注释·不落码）。
- **目的对齐 CEO**：「自动进化提高分数进入 prod 态」——FUSE=防火上限（8 轮自动进化后强制人工 checkpoint）·非缺陷计数。

## §三 · 语义重定三（round_count 改统计域）

**两字段分离**：

| 字段 | 语义 | 重置 | 用途 |
|---|---|---|---|
| `round_count` | **累计运行轮次**（debug+test+prod 全算·含 resume 次数） | **永不重置** | 统计/成本/审计域 |
| `test_consecutive_rounds` | **test 态连续进化计数** | 退出 test 态/新点火清 0 | **FUSE 判据域**（§二） |

**B（分域两计数·test/prod 两计数不混）**：**在新语义下=不再需要**（round_count=统计域·test_consecutive=test 连续域——原「test/prod 分域」诉求被④的统计/判据分离覆盖）——**建议 B 撤销**（候 CEO 裁）。

## §四 · 语义重定二（态关系·自动进化路径）

**CEO 语义**：debug 与 test 都在进化（CEO 手动点火轮 vs 无人自动进化）·目的同=进 ≥95 prod；**prod 退化 ≤95 若能自动进化回 >95·不需回 debug**（CEO 手动=不得已兜底）。

**现盘核+设计**：
- **现盘已有**：DP-027 的 **E2（`bothLow`：A/B 双 ≤EXIT_GATE=95 → `auto fallback to test`）**——**prod 退化→test 自动回进=已落码** ✓
- **设计（对齐 CEO）**：**E2 保持**（prod 退化→test）→**test 态自动进化**（`test_consecutive_rounds` ≤8 内）→**若 A/B 双 >95 → EXIT2 自动→prod**——**完整自动路径** ✓；**debug 不作自动支路**（仅 CEO 手动兜底进入）——**现盘无「prod→debug」自动支路**（E2 只回 test）=符合 CEO 语义 ✓
- **须核（施工面）**：E2 的 flag 落盘（setFlag test）+`test_consecutive_rounds` 清零联动（回 test=连续计数重置，正确）。

## §五 · Q1 承接清单（CEO 问「承接哪些/为什么不用重建 runid」）

**一、carry_over 材料（从 run_dir 承接·跨轮不重建）**：
plan.json（承接树）/exam.json/score.json/score-skill.json/close.json/joint-review.json/opinions-<seat>×7/trend.jsonl/charter（pending）/structure-export-debt.json。
**作用**：进化连续性（企业记忆·避免每轮从零）。

**二、resume_stage**（state 字段）：续跑边——pending-retry 轮失败→下轮 `resumeStage=7`（从段 7 续跑·不重跑前 6 段）。

**三、state 字段**（`round-queue/state/runner-state.json`）：round_count / test_consecutive_rounds（新）/ run_id / fuse_marker / resume_stage / flag_state / flag_since_round / pending_charter_ref / ruling_consumed_ref。

**四、runId=每次点火新建**（COS 签发·四形 loop/ignite/official/resume）——**不承接**（新点火=新身份·供回执/审计/trend 关联）；**resumeN 形的 runId 标 `-resumeN-` 形**（表示「续跑自前轮」·但仍是新号）。**⇒ 「不用重建 runid」的正确理解=承接材料不含 runId（runId 每次新建·承接的是 run_dir 材料+state+resume_stage）**。

## §六 · 施工拆分（A 先行）

| 件 | 内容 | 面 |
|---|---|---|
| **A**（先行） | `test_consecutive_rounds` 字段+判定切换+清零逻辑+round_count 注释改统计域 | FSD |
| **B**（撤销候选） | 原分域两计数不落码（§三） | 候 CEO 裁 |
| **C**（E2 联动核） | E2→test 时 test_consecutive 清 0 验证 | FSD（并入 A） |

## §七 · 使用依据

CEO 裁定（BOD 转 12:08·A 批+语义重定三件+B 登记+Q1）+CTO 四件核证（BOD 63d81744·代码实读）+设计卷 cto-round-programming-design-20261119 L106+教程 08-loop（flag 四态）+DP-027（E2 代码）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-24T04:08:00Z（+0800=12:08）〔commit 时戳锚·D-47 正形〕

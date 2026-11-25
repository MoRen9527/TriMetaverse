# CTO 技术方案·§七 state 自动升降级机制（2026-11-25 20:1x·CEO 令）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-s7-state-autoevolution-design-20261125.md·§七 技术方案正身）
- syncMode: write-time
- 承接: CEO 20:1x 令「进 test 和 prod 需要程序判读自动升级，降级也是同理」+批评「为什么 CTO 这个没审出来」（BOD 转）

## §零 · 我面自领

S1-S8／批一批二批三全修「当轮产物」（plan/score/close/joint 面）——**state 生命周期（debug↔test↔prod 的自动判读与落卷）＝跨轮机制·无人审无机制**——**我面审实现正确性只覆盖了单轮产物·未覆盖 state 机**。CEO 批评成立。

## §一 · 判据源（进化轴·非验收轴）

**判据=A/B 联审分**（进化轴·7 席联审）——**非验收轴分数**（CEO 勘正：验收 93 分不催态；两轴分立 v2.1.0：验收轴分数不驱动进化）。
- 数据源：`score.json` 的 `A`/`B`（joint-review 的 seat_means 聚合）
- **优先**：本轮 A/B（review_mode=full）；lite 轮→沿用上轮 full 的 A/B（标注 `basis: prev-full`）

## §二 · 三态机 + 迁移表（显式）

| 迁移 | 判据 | 现有实现 |
|---|---|---|
| **debug→test**（升） | `A>90 && B>90` | 新（本轮方案） |
| **test→prod**（升） | `A>95 && B>95` | 新（本轮方案） |
| **prod→test**（降·退化） | `A<95 \|\| B<95` | **已有 E2 bothLow→auto fallback test**（扩：单侧跌破亦降） |
| **test→debug**（降·失败） | 连续 N 轮 fail（`consecutive_fail>=N`·N 以纪律册为准·建议 3） | 新 |
| **禁**：人工无卷改 state | state 每次变更须有 flag 卷（runner-state.flag_state + chain-journal 事件） | 新（断言） |

## §三 · 落点与流程

**落点=round_runner 轮末**（score 后置钩·现 E2 bothLow 判定处扩展）：
1. 读本轮 `score.json` 的 A/B（缺=不改态·标 `basis: unavailable`）
2. 按 §二 迁移表判目标态
3. 变更→`setFlag(目标态, st)`（**带卷面痕**：runner-state.flag_state + flag_since_round + chain-journal `{event:"state_transition", from, to, basis:[A,B], rule}`）
4. 不变更→落 `state_check` 注（A/B+规则+结论·可审计）

## §四 · 降级同理（CEO 语义）

- **prod 退化**：A/B 跌破 95→test（E2 已有·扩单侧）——**test 态再自动进化回 >95→prod**（E2 上行路=§二 的 test→prod 判据）
- **test 连续失败**：连续 N 轮 fail→debug（fuse/失败计数已有 `test_consecutive_rounds`/fail 面·复用）
- **debug**：不作自动升支路（CEO 手动兜底进入·现盘符合）

## §五 · 施工件与验收

- 件：round_runner 轮末钩（state_check+state_transition）+ 断言（无 flag 卷的 state 变更=violation）+ 测试（四迁移各 +1·既有 E2 回归）
- 验收：①A/B 91/91→test ②95→95 各 95→prod ③95→94→test ④连续 3 fail→debug ⑤人工改 state 无卷→violation
- **工时**：~1h（件）+ 测试 ~30min

## §六 · 使用依据

CEO 令（BOD 转 20:14）+§七 卷 fe2a6c959 + 协议 v2.1.0 两轴分立 + E2（DP-027 bothLow）+ FUSE（test_consecutive_rounds）+ D-15/D-24/D-27 v4/D-46/D-47。

---
—— CTO 小狄（m-cto）·写前现查 date（D-47 正形）

# CTO 根因卷·ceo-ruling 一纸多轮（debug 态自动放行）根因+修形设计（CEO 令 21:27）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-ruling-reconsume-rootcause-20261123.md·根因正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 明示「查根因，为什么 debug 态下一轮没 CEO 批就自动进第二轮，以后坚决卡死这类浪费 token 的行为，同时知会 CFO」（BOD 转）+BOD 初疑（勿冒认·根因卷须代码实证）

## §一 · 根因=一纸多轮（代码实证·BOD 假说①成立）

**代码实锚**（round_runner.ts `awaitCeoRuling`·bba27a0 态）：
```ts
const p = path.join(io.queueRoot, 'state', 'ceo-ruling.json');   // 单一固定路径
if (!existsSync(p)) return 'absent';
const vol = JSON.parse(readFileSync(p, 'utf8')) as { ruling?: string };
if (vol.ruling === 'continue' || vol.ruling === 'terminate') return vol.ruling;
return 'absent';
```

**缺陷三面**：
1. **单一固定路径·无 run/round 绑定**——任何 run 的任何轮读同一件；
2. **读后无消费标记**——文件常驻=每轮都读 continue；
3. **无 run_id 校验**——跨 run 也认（resume4 落件→resume5-10 全认）。

**实际链**：resume4 落的 continue（ref 6202b5aa6·07:32:37Z）常驻 → resume5/6/7/8/9/10 各轮末钩均读 continue → **debug 态轮轮自动放行、自动进下一轮**（无新 CEO 批）——**M4-v2 语义（每轮停「出稿→候 CEO 批」）被绕过**。

**命中的浪费**：resume9 轮 2/轮 3、resume10 轮 2 等=未批轮（CEO 面未审即跑）——token 成本计入浪费面（CFO 单列）。

## §二 · 修形设计（三绑+消费标记+fail-closed）

**`awaitCeoRuling(io, params, st)` 改形**：
1. **run_id 绑**：`vol.run_id && vol.run_id !== params.runId → absent`（跨 run 不认·resume4 件对 resume10=absent）；
2. **消费标记（一纸一轮）**：state 增 `ruling_consumed_ref`——读前核 `st.ruling_consumed_ref === vol.ref → absent`；读到有效 continue/terminate→**消费即写** `ruling_consumed_ref = vol.ref`+`at`（writeRunnerState）；
3. **round 绑（可选强化）**：`vol.round_count` 存在且 `< st.round_count → absent`（件只对该轮或之前有效）；
4. **fail-closed**：三绑任一不满足=absent=**挂起**（现形 exit:null·候裁决投递）——**绝不放行**。

**件 schema（ceo-ruling.json 增字段·向后兼容）**：`{ruling, ref, signed_at, run_id?, round_count?}`——**新件必带 run_id**（值席落件 SOP 加一条）。

## §三 · 防浪费护栏（④）

debug 态**新轮启动前**核「本轮专属 ruling 件」：`vol.run_id === params.runId && vol.ref !== st.ruling_consumed_ref`——缺失即**停**（不开跑·notify 面呈报候新批）。

## §四 · 落点

- **急修 or 候任务书**=CEO 定（修形=round_runner.ts 小改·与 DP-021 同文件·可并入下批）；
- 观察点：修复后 resume 轮=每轮需新 ruling 件（值席落件形照 11-29 SOP 变每轮一次）；
- **本卷=根因正身**（CEO 面裁急修时直接引）。

## §五 · 使用依据

CEO 明示（21:27 BOD 转）+BOD 初疑+round_runner bba27a0 实读+SDE 报（resume5「prev=ignite·continue 件常驻=多次有效」实证）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T13:28:00Z（+0800=21:28）〔commit 时戳锚·D-47 正形〕

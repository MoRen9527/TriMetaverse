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

## §六 · 勘正与新发现（SDE 两查读数·2026-11-23 21:31）

**①消费面勘正（本席自领）**：本卷 §一 指向 `awaitCeoRuling`（round_runner·queue-state 面）——**SDE 实读修正：实际消费面=preflight 的 `check_ceo_ruling`**（逐轮重读 **prev_run_dir** 的裁决件·**轮 1/轮 2 同件放行实证** preflight.json 断言 `{state:continue, prev_run_dir:shift-W48-ignite-...175743Z, ruling_ref:6202b5aa6, signed_at:2026-11-22T18:23:27Z}`·mtime 轮 1=19:57/轮 2=20:55:20）——awaitCeoRuling 仅 debug 旗分支且 queue-state **无该文件**。⇒ **根因组件=preflight·修形须两处**（check_ceo_ruling 主修+awaitCeoRuling 防御性同修·件 schema 增字段两处同认）。

**②新发现 A·自指解析缺陷**：check_ceo_ruling 现时只读复算→**prev 解析到自身 run dir**→awaiting-ruling ok=false（自排除仅靠「自身 preflight.json 空壳瞬间」·轮 1 毕后 close+pf 均存→**轮 3 若起将 exit 4 停链**）——修形加项：**prev 排除自身 run 的显式判据**。

**③新发现 B·ignite 目录消失**：`shift-W48-ignite-20261122T175743Z` 整目录不在盘（其 ceo-ruling.json 曾签 18:23:27Z 且被消费）——**须查 20:55-21:30 间何操作移除**（SDE 面读取期无损·本席面 m-cto 无删目录操作）——**候 COO 面查各席操作记录**（并发写面审计项）。

**④两件历史 continue 并存**：resume4 件（83B·signed 07:32:37Z）仍驻留——修形后历史件应标 consumed/归档（防误读）。

## §七 · 勘正二次（SDE 自我勘正两笔假读数·根因修正版·2026-11-23 21:33）

**⚠️ §六 A/B 两新发现=撤回**（SDE 自我勘正）：①「自指解析缺陷」**不存在**（其用错根（fade001-runs）复算得 self·**正确根复算**=正常解析 ignite 轮）；②「ignite 目录消失」**不成立**（目录**在** `/var/lib/trirmc/cron/runs/shift-W48-ignite-20261122T175743Z`·该轮=cron 面跑出·runs root 不同）。**本席自领**：消费 SDE 读数直接入卷未核源（「读数须核源」缺步·与「路径基准未先核默认值」同族）。

**根因修正版（定谳·以本条为准）**：
1. **preflight `--prev-runs-root` 默认=`/var/lib/trirmc/cron/runs`**（源码 L537·env `TRICO_PREV_RUNS_ROOT` 可覆·**非 fade001-runs**）；
2. 每轮 preflight 从该根解析**最新完整轮=ignite 轮** → 其 ceo-ruling（`{continue, 6202b5aa6, signed 2026-11-22T18:23:27Z}`）常驻 → **每轮 continue 放行·一纸多轮成立（机制确认）**；
3. resume4 份 continue（fade001-runs）=**沉睡不被任何 preflight 读取**（归档即可·非修形对象）；
4. **修形对象件=cron/runs 根的 ignite ceo-ruling**（DP-030 三绑/消费标记指向此件）。

**🔴派生紧急（CEO 裁面）**：continue 常驻 ⇒ **轮 3+ 会继续自动起直至 FUSE 8 轮**——CEO「放过轮 2」≠「只跑 2 轮」——**若仅需本轮毕=须 terminate 裁决（落 terminate 件于 cron/runs 根）或停进程（SIGTERM）·已紧急报 BOD 候 CEO 速裁**。

## §五 · 使用依据

CEO 明示（21:27 BOD 转）+BOD 初疑+round_runner bba27a0 实读+SDE 报（resume5「prev=ignite·continue 件常驻=多次有效」实证）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T13:28:00Z（+0800=21:28）〔commit 时戳锚·D-47 正形〕

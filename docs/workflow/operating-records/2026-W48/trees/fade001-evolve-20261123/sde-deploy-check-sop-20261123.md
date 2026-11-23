# SDE 施工毕报检查面增补（dist 同源项·CTO 裁采纳）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/sde-deploy-check-sop-20261123.md·毕报模板增补正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 裁（2026-11-23T03:35:17Z·「改 TriRMC src 必重建 dist+对表」入施工毕报检查面）

## 检查项（毕报模板一句）

> **凡改 TriRMC src（dist 为 gitignored 构建产物）——毕报必含 dist 同源三证：①`npm run build` rc=0 ②`grep <新符号> dist/**/*.js` 命中 ③`node --check` 通过 + 执行面 mtime < 点火/重启时刻对表。判据=n阶（符号级命中非 mtime 单信）。**

## 执行面精度注（2026-11-23 FSD 路径厘清承录）

> **fade001 点火链经 `tsx` 直跑 `scripts/fade001-ignite.ts`（TS 源）→运行面直接载 src 全量代码；`dist/` 供 daemon/打包消费面与四证留档。** 故「改 TriRMC src」的生效判据分两径：①tsx 直跑面=src 在位即生效（无需 dist）②daemon/打包面=必重建 dist。毕报检查仍按三证（build+grep+check）执行=双面齐；但不得以「dist 未重建」推断 tsx 面未生效（反之亦然）。

## 产物所有权纪律（CTO 裁·2026-11-23·同族=硬门签认必落卷的产品面）

> **链产物（run_dir/*.json：preflight/qualify/plan/dce/verify/score/close…）=链执行证据，任何独立验证禁覆写**；独立验证一律落**独立文件**（命名 `verify-strict-check.json` / `*-check.json` 类·带验证方标识）。理由=审计锚唯一性（覆盖后链证据失真）。**注**：verify.py 的 `strict_mode=bool(args.strict)`（CLI 旗唯一可达·源 L270）——`--strict` 独立验证与链段 5（无旗）产出形态不同（6 vs 5 checks），可按形态区分归属。

## 依据（DP-012 首验实例）

- 实例：7a125ab（spawn env/cwd 自足）在 HEAD，但 R-HY dist 停留 22:21 旧件（PYTHONPATH 0 命中）→ 若直接点火必复现 ModuleNotFoundError；SDE 面补建（build rc=0·dist 11:32:43·注入×4·node --check OK）后点火 11:32:52 通过（9s 差「侥幸合」——**正形=毕报即验 dist·非点火前补**）。
- 族谱：「已修≠已传播」第 4 face——gate worktree（995ba46e4 传播）→P0 码面（51da4ba push）→P0 通道（env/拓扑）→**dist 构建面（本条）**。同源判据与 6220331 立的「同源判据②」流程化同源。

## 遗留入账（候后续 DP·非本轮）

- **LOOP_WINDOW 内建候选**：DP-012 未涵盖（grep 零命中）——周日门豁免仍须 env `LOOP_WINDOW=1`；候选「内建默认或启动自检告警」（同 FADE_PLAN_SPAWN flip 族）·候评估。

—— SDE 小布（m-sde·毕报检查面增补·CTO 裁采纳）·写前现查 2026-11-23T03:40:28Z（+8=2026-11-23 11:40:28·date 现查原值·D-47 正形）

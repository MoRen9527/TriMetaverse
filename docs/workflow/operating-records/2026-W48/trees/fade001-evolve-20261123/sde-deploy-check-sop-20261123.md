# SDE 施工毕报检查面增补（dist 同源项·CTO 裁采纳）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/sde-deploy-check-sop-20261123.md·毕报模板增补正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 裁（2026-11-23T03:35:17Z·「改 TriRMC src 必重建 dist+对表」入施工毕报检查面）

## 检查项（毕报模板一句）

> **凡改 TriRMC src（dist 为 gitignored 构建产物）——毕报必含 dist 同源三证：①`npm run build` rc=0 ②`grep <新符号> dist/**/*.js` 命中 ③`node --check` 通过 + 执行面 mtime < 点火/重启时刻对表。判据=n阶（符号级命中非 mtime 单信）。**

## 装载语义双层（2026-11-23 CTO 纪律修正·改码面双面空闲窗硬要求）

> **①TriRMC TS 面 = ignite 起跑一次载**（tsx·起跑后不跟新）→ 改 TS 须新点火生效。
> **②TriCompany python 面 = 逐段/逐钩新进程载**（chain 每段 spawnSync python3·联审钩每轮新 python）→ **改 python 在跑链的后续段/后续钩即刻生效**——若改动有 bug 即在跑链后续段即崩（无隔离）。
> ⇒ **改码面链空闲窗 = 双面硬要求**（TriCompany 改动同样适用）；链跑中改 python 须改后即时冒烟（防未验改动被在跑链吃到）。实证：resume10 轮 2 钩吃到 3a4e592（pull 带入）。

## 点火放行判据 v2（DP-041·CEO 2026-11-24 裁 B 定档）

> **五件齐方可点火**：a) CTO 点火令（枢纽约）｜b) **CEO 批 = `ceo-charter-approval.json` 亲签件在位**（校验四件：`approved_by=="CEO"`／`approved_at` 非空非模糊／`charter_ref`+`commit` 非空／`signature_slot` 非空）——**§六 指针+实读降为辅助证据**（裁 B 前曾以「§六 指针+git show 实读」放行 resume13·不回溯）｜c) continue 三绑件落 prev 正身·未消费｜d) runId 经 COS 签发表｜e) 清场双零/480s/flag 门绿。
> **批件核证正形**：`git show <commit>:<path>` 一步见目标节号内容（工作树实读+另一相关 commit=伪锚·2026-11-23 自领）。
> **D-47**：落款时刻一律 date 现查原值粘贴·禁手写（2026-11-23 手写超前时点自领例）。

## 点火模板·采集/节律 env 四件（CTO 裁 2026-11-25·score 100 面）

> 点火形 env 固化四件（r12/v2 采集域）：`FADE_JOBS_JSON=/srv/fleet/TriRMC/data/cron/jobs.json`｜`FADE_OPERATING_ROOT=/srv/fleet/TriMetaverse/docs/workflow/operating-records`｜`FADE_WEEK=<2026-Wxx>`｜`FADE_PATROL_CADENCE=6m`（实际 patrol 拍频=6min·plan_enricher 默认 15m 待 c 治本）。缺任一=A/F/H 采集 na/fail（resume29 实证）。H 判「na→weight」亦记满，但**真判 pass 须 c（默认 6m→6 vs 6）或 f1bdbc1e 落**后验。
> **标准形补件（2026-11-25 r41 实测抓出·CTO SOP 22e0486e2 §一 增补候）**：『`sudo -E -u fleet` 保留 HOME=/root → 段 2 qualify 读 `/root/.trimetaverse/notify.json` → PermissionError』——**env 须补 `HOME=/home/fleet`**（或 `sudo -H`）。另 SMTP 二件=环境无源（find 零命中·历史链均无·notify file-fallback 正常）。
> **重跑两坑（2026-11-25 r41/r42 实测·CTO facd96f3e §四 同向）**：①**重跑一律新 run-id**——`check_ceo_ruling` **自排除 current run_dir**（DP-030·L312）⇒ 同 run-id 重跑时自身不入候选→prev 落更早完整轮→其 ruling 已消费→**awaiting rc=4**。②**残拍重签 round_count 须全局单调**——**T2a 单调门（L474-492）**：本件 round_count 须 ≥ 更早轮已签件 max ⇒ r41 v9=16 < r40 v10=17=**round-count-regression→rc=4**（修=撤旧件留痕备份·候件落最后成功轮正身）。
> **env 十一项（CEO 2026-11-26 值面·CTO SOP f046ce1d3）**：九项+**`IMPROVE_MIN_RATE=0.2`/`IMPROVE_K=0.5`**（score_engine L735-736 消费·improvement_block params 双值）。**`.env` 路线不可用**（/srv/fleet/TriCompany/.env 不存在且 ignite/token-run.sh 无 dotenv 加载面=假持久化·2026-11-26 实勘）——**一律走点火 env**；值面探针=读 chain 进程 /proc/<pid>/environ 断言两项+improvement_block.params 复核（0.2/0.5 非密可打印）。

## 链后六验点读法（CTO 裁 7391fac29·SDE 实测 r45 自领 2026-11-26）

> **六验点（seven=joint/refill 真值/ab 列/charter 只待办/final-summary/段 7 final）须等钩子终再读**——判据=**`close.json` mtime > `charter-*.json` mtime**（否则读的是段 8 旧面）。**慢段=cos_final_summary spawn（LLM 终版面 ~3.5min）**——r45 实锚：charter 19:11:02→close 写 19:14:36→backfill 尾随；19:12-19:13 读=慢段中误报「钩子没生效」（自领·同「批量 vs 单条」族）。慢段=必要成本（可接受），纪律=**等**.

## 点火模板·D-91 marker 面（DP-032 A 案·CTO 裁 2026-11-23）

> **点火命令必须带 env `TRI_CHAIN_MARKER=/srv/fleet/TriRMC/chain-running.marker`**（R-HY fleet 可写实位；缺省路径 `/srv/git/TriCompany.git/chain-running.marker` 在 R-HY=ENOENT 写失败→pre-receive 闸盲）。sg pre-receive 已探该位（T8 实测：fresh 拒/stale 放+warn）。缺省 env 时链跑=闸端不可见——**不得读作「跑中更新已受控」**。

## 读数基准纪律（2026-11-23 自领两笔假读数教训·CTO 同族自领）

> **断言「目录/文件不存在」「解析异常」前，必先核工具默认参数真源**（代码 argparse default/env 可覆面）——实锚：误以 fade001-runs 为 preflight prev-runs-root（真默认=`/var/lib/trirmc/cron/runs`·L537），产出「ignite 目录消失」「自指解析缺陷」两笔假读数。**同族（CTO 自领）：消费他人读数须核源**——转引读数前独立验源，非直录。
> **正形**：路径类断言三步=①读代码默认值（argparse default/env）②活体 glob/find 全盘 ③根因结论前复算（用正确根实跑只读复算）。

## 执行面精度注（2026-11-23 FSD 路径厘清承录）

> **fade001 点火链经 `tsx` 直跑 `scripts/fade001-ignite.ts`（TS 源）→运行面直接载 src 全量代码；`dist/` 供 daemon/打包消费面与四证留档。** 故「改 TriRMC src」的生效判据分两径：①tsx 直跑面=src 在位即生效（无需 dist）②daemon/打包面=必重建 dist。毕报检查仍按三证（build+grep+check）执行=双面齐；但不得以「dist 未重建」推断 tsx 面未生效（反之亦然）。

## 产物所有权纪律（CTO 裁·2026-11-23·同族=硬门签认必落卷的产品面）

> **链产物（run_dir/*.json：preflight/qualify/plan/dce/verify/score/close…）=链执行证据，任何独立验证禁覆写**；独立验证一律落**独立文件**（命名 `verify-strict-check.json` / `*-check.json` 类·带验证方标识）。理由=审计锚唯一性（覆盖后链证据失真）。**注**：verify.py 的 `strict_mode=bool(args.strict)`（CLI 旗唯一可达·源 L270）——`--strict` 独立验证与链段 5（无旗）产出形态不同（6 vs 5 checks），可按形态区分归属。
> **强化（CTO 裁 2026-11-23·resume3 段 3 红实锚后升级）**：**禁写活链 run_dir**（超出「禁覆盖 verify.json」）——链在跑期间任何外部进程/验证禁在该 run_dir 读写；外部验证一律**独立临时 run_dir/独立文件**。live 链被并发写入曾致段 3 ETIMEDOUT（13:24 外部件早于链段毕=时序互斥铁证）——干扰面=资源竞争+证据污染。

## 依据（DP-012 首验实例）

- 实例：7a125ab（spawn env/cwd 自足）在 HEAD，但 R-HY dist 停留 22:21 旧件（PYTHONPATH 0 命中）→ 若直接点火必复现 ModuleNotFoundError；SDE 面补建（build rc=0·dist 11:32:43·注入×4·node --check OK）后点火 11:32:52 通过（9s 差「侥幸合」——**正形=毕报即验 dist·非点火前补**）。
- 族谱：「已修≠已传播」第 4 face——gate worktree（995ba46e4 传播）→P0 码面（51da4ba push）→P0 通道（env/拓扑）→**dist 构建面（本条）**。同源判据与 6220331 立的「同源判据②」流程化同源。

## 遗留入账（候后续 DP·非本轮）

- **LOOP_WINDOW 内建候选**：DP-012 未涵盖（grep 零命中）——周日门豁免仍须 env `LOOP_WINDOW=1`；候选「内建默认或启动自检告警」（同 FADE_PLAN_SPAWN flip 族）·候评估。

—— SDE 小布（m-sde·毕报检查面增补·CTO 裁采纳）·写前现查 2026-11-23T03:40:28Z（+8=2026-11-23 11:40:28·date 现查原值·D-47 正形）

# SDE 周日拍前置核读数卷（11-22 23:50 W47→W48 拍前·job 级归因+executor 活核·CTO 条件式指示件）

- sourceOfTruth: 本卷（trees/w47-sunday-shot-preflight-20261121/sde-sunday-shot-preflight-readings-20261121.md·拍前核两件读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COO D-27 v4 派工（周日拍前置核两件·CTO 条件式指示·落款 2026-11-21T00:57:10Z/+8=08:57:10）
- 判定: **①连败面定址=weekly-plane-shift 本体（6 job 唯一 error·consecutiveErrors=5 唯一非零）——按 CTO 预告分岔=「weekly-plane-shift 本体→直接相关」支；附关键 nuance=5 连败实为 11-19 同日重试波（前有 rc=0 成功拍） ②executor 活核=活体实测通过（5min 拍完成行鲜度 2min 内+全部 6 job runAs 键零命中）③GLM 恢复后清零拍=无（该 job 自 11-19T09:05:51Z 后零新拍·连败冻结 5）**

## §一 · job 全清单（8710·6 job·活体 API 读数）

| # | job | enabled | cron (tz=Asia/Shanghai) | lastRunStatus | lastRunAt(UTC) | consec | nextRunAt(UTC) | runCount | runAs |
|---|---|---|---|---|---|---|---|---|---|
| 1 | e1b2-window-reminder-patrol-8710 | True | 间隔型（cron=None·5min 拍） | **ok** | 11-21T00:56:30Z | 0 | 11-21T01:01:31Z | 8476 | 无 |
| 2 | lg099-post-gate | True | `10 0 * * 1` | None（未跑） | — | 0 | 11-22T16:10:00Z | 0 | 无 |
| 3 | lg099-pre-gate | True | `40 23 * * 0` | None（未跑） | — | 0 | 11-22T15:40:00Z | 0 | 无 |
| 4 | rmc-orchestrate-tick | True | `17,47 * * * *` | **ok** | 11-21T00:52:00Z | 0 | 11-21T01:22:00Z | 4037 | 无 |
| 5 | tricompany-pull | True | `*/15 * * * *` | **ok** | 11-21T00:45:00Z | 0 | 11-21T01:00:00Z | 7579 | 无 |
| 6 | **weekly-plane-shift** | True | `50 23 * * 0` | **error** | **11-19T09:05:51Z** | **5** | **11-22T15:50:00Z** | 63 | 无 |

- **连败定址（判据①②）**：6 job 中唯一 error=**weekly-plane-shift 本体**·consecutiveErrors=**5** 唯一非零——非 spawn 族他 job（其余 5 job 全 ok/连续 0 失败）。
- **runAs 断言**：6 job 顶层+payload 皆 `runAs_key_present=False`（记忆正身「job 禁带 runAs」✓）。

## §二 · 连败时间序（cron 日志面·61 拍谱）

- **5 连败实拍**（11-19 UTC 同日重试波·五拍全 `[p1] score_skill_spawn rc=2`→RESULT exit 2）：06:54:45 / 06:55:54 / 06:58:19 / 07:52:54 / **09:05:51**（=lastRun·连败计数吻合）。
- **连败前史**（同为 11-19 日间拍）：00:14:38 **rc=0** ｜ 02:42:15 rc=2 ｜ 03:06:54 **rc=0** ｜ 04:29:08 **rc=0**——**同日内交替成败**=GLM 配额窗间歇性特征（非系统性坏态）。
- **按日 run 分布（61 拍全谱）**：每周日 1 拍定例（09-20/09-27/10-11/10-18/10-25/11-01/11-08 各 1）＋工作窗重试波（11-10:3、11-15(周日):19、11-16:5、11-18:14、11-19:9）——11-15 起为 W46 shift 连跑重试带（rc=0/rc=2/rc=4 混现·11-18 20:13 rc=4 另形）。
- **清零面**：连败 5 自 11-19T09:05:51Z 后**零新拍**（job 无再次启动·连败冻结在下一次运行前不可避免）——「GLM 恢复后成功拍清零」=**未发生（无拍可清）**；周日 11-22T15:50Z 拍=首个可翻转拍。

## §三 · executor 活核（非 healthz 面·活体实测）

- **完成行鲜度**（journal `[trimc:cron] job … run finished`）：e1b2 拍 08:46:30/08:51:30/**08:56:31 CST**（勘时点 08:5x·鲜度 ≤2min）·rmc-orchestrate-tick **08:52:00**·tricompany-pull **08:45:03**——**5min 拍逐拍连发在跑**=调度+执行面活体实证（daemon pid 2687790 内）。
- **日志面旁证**：/var/lib/trirmc/cron/logs 末 5 件 mtime 08:45–**08:56 CST** 逐拍落盘。
- **状态面旁证**：e1b2 lastRunAt=00:56:30Z→nextRunAt=01:01:31Z 推进正常；tricompany-pull nextRunAt=01:00:00Z 待拍。
- 判读：**executor 活=真**（连续完成行+落盘+指针推进三面同证·非 HTTP 200 单面）。

## §四 · GLM 恢复时间序（fallback 行小时桶·11-19 起）

- 11-19 17:00 CST 桶=**33 行**（62 拍窗供给异常峰）→ 11-19 18:00 起至今=**恒定 4 行/时**（11-21 08:00 桶=3 行·未满桶）——供给恢复稳态。
- 近 24h：`failed (depth` 失败行=**2**（均 deepseek-v4-flash 404 异族·非 GLM）·fallback 行=125（=15min refresh 节拍面+orchestrate-tick 调用面常态）。
- 判读：GLM 供给当前**无异常波**（对照 11-19 峰 8× 基线）。

## §五 · 对 CTO 预告分岔的读数供判

- CTO 分岔：「连败 job=spawn 族→周日拍预期不受影响；=weekly-plane-shift 本体→直接相关→前置必须先修」。
- **本勘定址=weekly-plane-shift 本体** → 落入「直接相关」支（判读归 CTO）。
- 供判 nuance 三点：①5 连败=11-19 同一日重试波（非 5 个周日连败），同日前段有 rc=0 成功拍 3 次；②failure 机理=score_skill_spawn 段 spawn 席缺席（GLM 配额窗·62 拍深勘卷定性），当前供给面已恢复（§四）；③周日排程拍历史谱每週在跑（§二 按日分布前段）——周日 11-22 拍能否过=取决于拍时供给面，连败计数本身不阻塞调度（enabled=True·nextRun 在）。
- 本席零动面：仅读数，前置动作（如有）候 CTO 定夺。

## §六 · 护栏遵守

只读零改（jobs API/journal/日志清单纯读）✓｜值面零打印（token 变量读入零回显·runAs 仅布尔·本地 64hex 闸 0）✓｜D-24 活体现探（executor 活=完成行实测非 healthz）✓｜R-HY 勿扰 ✓｜红即停（sg 限流 30s 单次重发纪律照役·本轮一次即通）✓｜D-47（落款=date 现查原值）✓。

## §七 · 使用依据

- COO D-27 v4 派工（周日拍前置核两件·CTO 条件式指示·判据①②③+护栏四款）
- 活体：8710 /internal/v1/cron/jobs 全量 6 job 状态面·journalctl -u trirmc（完成行+fallback 小时桶+失败行计数）·/var/lib/trirmc/cron/logs 清单（9c81c7ec 61 拍谱+RESULT 抽读）·日志 mtime
- 交叉件：sde-wpshift-rc2-diagnosis-20261120.md（62 拍深勘定性·score_skill_spawn 段+GLM 供给波）+sde-rhy-trirmc-trimodel-consumer-survey-20261121.md（8710 degraded 交叉锚）
- D-24/D-46/D-47

## §八 · 换轨连带收益核实（CTO 防护 1）+ 轻防护 grep 核读数（COO 定谳件）

**CTO 防护 1 答（一句）**：**走同一 headless profile overlay**——`score_skill_spawn._spawn_seat` L43-47：`dsh --profile headless --patch ${DSH_PRESET_OVERLAY:-/home/fleet/.dsh/patches/headless-agentpresets-overlay.yml}`，与 loop_autoreview L165-174 同源同缺省路径；daemon env `DSH_` 键数=**0**（无覆盖）→ 缺省路径生効。该 overlay 今日已换轨 deepseek-flash → **11-19 型 GLM 配额窗失败对 weekly-plane-shift spawn 阶段结构性消除（配置面成立）**。

**轻防护 grep 核（COO 定谳二·只读·实测 2026-11-21T01:04:21Z）**：
- overlay 三处：`deepseek-flash` 命中=**3**（L16 agent-default-model 行 / L23 llm models id / L33 llm-deepseek models id）·`glm-5.3` 残留=**0**·mtime=**2026-11-21 08:49:00 +0800**·1466B fleet:fleet。
- 换轨 diff 实锚（bak-fixglm→current）：`model: glm-5.3-flash → deepseek-flash` ×3 行（provider 行恒 deepseek-official）。
- **防回滚锚两件在位**：`.bak-fixd2-20261119`（672B·11-19 17:30=overlay 初落版）+`.bak-fixglm-20261121`（1453B·11-19 17:39=换轨前 GLM 版）。
- env 覆盖判据：`DSH_PRESET_OVERLAY` 未设（DSH_ 键 0）→ 防「env 覆盖静默回归」面 ✓。

**机理差记录（供判读）**：score_skill_spawn 的 `subprocess.run`（L51）**无 env= 传参**→不走 `read_glm_spawn_env`（仅 loop_autoreview L90-116 有：三键注入 DEEPSEEK_API_KEY/BASE_URL=GLM 端点/ANTHROPIC_MODEL=glm-5.3-flash 缺省）——11-19 期 spawn 后端=GLM（overlay 当时 glm-5.3-flash+dsh 自有 credentials 换装配对）→配额窗失败机理吻合；今 overlay=deepseek-flash → DS 轨。

**残面如实注**：①换轨落笔=今日 08:49（拍前 2 日余·非长期稳态观测）；②运行面首证=**今日 08:50-08:57 D7 复验 spawn 两席 GREEN**（同 overlay 文件+同 `dsh --profile headless --patch` 形·08:49 换轨后立即真跑成功）——CTO 承录回补正（初记「Sunday 首拍或候裁预验」）；经 score_skill_spawn.py 路径直证候第十发段 7 毕报（chain_runner 同路径调·零额外动作）·**预验 spawn 裁=不做**；③loop_autoreview 路径 env 注入面独立（TRICO_SPAWN_GLM=off 可关·第十发轨面另案不混）。

**防护 2 承录**：11-22 23:40 前 fallback 行密度基线核（4 行/时）+无 GLM 窗征兆 → 报 CTO/COO 判；拍后读数（成功/失败+consecutiveErrors 清零与否）达 COO+CTO（COO 定谳三）。

**修正注**（CTO 承录回·写前现查 2026-11-21T01:07:34Z）：残面②由 CTO 判读补正为「D7 复验 spawn 两席 GREEN（08:50-08:57·同 overlay）即运行面首证」·预验 spawn 裁=不做；机理差附注经 CTO 采纳入档；残面①③承录。防护 2/拍后读数照役不变。

—— SDE 小布（m-sde·周日拍前置核+换轨连带核实+轻防护核收口·CTO 承录回修正注·拍前监视/拍后读数两承）·写前现查 2026-11-21T01:07:34Z（+8=2026-11-21 09:07:34·date 现查原值·D-47 正形）

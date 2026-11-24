# SDE 工作卷·resume14-18 运维全程 + dce 真跑/overlay 两档（2026-11-24）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/sde-resume14-18-ops-log-20261124.md·SDE 面当日作业读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=CEO 批令（round3-5）+CTO 施工令/BOD 点火令/COS 转办（散见各信）

## §一 · 点火与链跑总表（2026-11-24 CST 面）

| 轮 | runId | 点火 | 结果 | 关键读数 |
|---|---|---|---|---|
| resume14 | shift-W48-resume14-20261123T200152Z | 04:10:48Z | debug 停（exit null） | 段 7 首验成功（A+B 修生效·无截断）·A/B 35.91/39.87（6 席·cfo absent）·comparability 1.0 |
| resume15 | shift-W48-resume15-20261123T203658Z | 17:11:42Z | **段 4 dce 门拒停**（P0 修复首验 ✓） | verdict=dry_run_not_executed→fail·不穿门 |
| resume16 | shift-W48-resume16-20261124T095130Z | 10:02:06Z | **段 4 dce 门拒停**（真跑首试） | **pull rc=0/migrate rc=2**→根因=**dce argv 缺 --start-date/--operating-root（空参）**·零半态 |
| resume17 | shift-W48-resume17-20261124T101118Z | 10:13:16Z | **段 7 停**（rc=2） | **dce 四步全绿（pass·0/0/0/0）·首份有效分数 G 19/19·total 59/100**；段 7 两席 **max-tokens 零输出**（prompt 条① reasoning-first 反作用） |
| resume18 | shift-W48-resume18-20261124T120128Z | 12:01:55Z | debug 停（exit null） | **dce 四步再全绿**·**段 7 cap 消失（DP-048 生效·scores I1:11/I2:8/I3:6）**·**A/B 41.78/43.84**·comparability 1.0（prev=resume14）·**exam 5/5 全过**·十段全毕=**第一份完整有效分数** |

## §二 · 关键修复与法定事实

- **DP-033-01**（c926646·dce 实检+verdict 三前提）·**P0 c3 双修**（TriRMC 423987c 段门读 inner score.verdict；TriCompany 57393fa engine→顶层 fail+rc=2）——resume15 实证。
- **DP-038/T4**：flag 缺省 debug+ensureFlagInit+preflight queue-root——flag 门 strict/debug 实证。
- **DP-042 A**（e151a1b prompt 五条）·**DP-048**（7bd43fa 条①改「直接输出 JSON·reasoning≤10 行·超 10 步直出」）——resume18 段 7 cap 消失实锚。
- **DP-047**（177b56f dce argv 补两参）——resume17 dce 四步全绿实锚。
- **FUSE 口径**（DP-037 撤销 bug·口径注记）：rounds_run=完成迭代数（resume12 实证整轮跑完仍 0）；round_count=跨点火累计（debug 挂起不增）。
- **flag 真因**：flag.json 从未存在→缺省 test（M9 FUSE 合法）→DP-038 改缺省 debug。

## §三 · dce 真跑面（首次全绿）

- resume17 dce：**pull rc=0／migrate rc=0／commit rc=0（`ffe47dee7 ops: weekly plane shift W47->W48 run=shift-W48-resume17…` 已 push 入史）／push rc=0**·overflow 全 checked·verdict=pass。
- 前置六项（CTO 出厂标准）：树清洁（含 rm --cached 16+1 件·9411a0527/f70c90c70）／冲突预检（W47↔W48 重叠 2=carry_over 设计内）／回滚锚 tag `pre-dce-resume16`（TMV 435f88a39·TC 802deff）／两面一致（判据「status 空+ff 可达」·pull 710 快进接受）／权限路径／时间窗——六项全✓定谳。

## §四 · overlay 两档（maxTokens）

- **65536**（备份 bak-pre-65536-20261124T121043Z）：**试验层先行**（copy→sed→冒烟 provider 接受 rc=0）→ 主件替换（4×65536）·主件冒烟 rc=0。
- **393216**（备份 bak-pre-384k-20261124T122202Z）：同法·试验层冒烟接受→**主件替换时点=联审毕信号（joint-review 20:22 落卷后）**→4×393216·YAML/冒烟全绿。
- 方法论（CTO 记入施工纪律）：**在跑链后续 spawn 即时读主 overlay**⇒overlay 类改动=试验层先行+主件择时（联审毕/链闲）替换。

## §五 · DP-043 八条标尺（生产首验真相）

- 席面：resume18 联审席原始输出 3/3 抽样 **rationale+【L2】档位齐**（标尺生效）。
- 聚合面：joint-review dims **0/53 rationale**——根因=**normalizer L430-431 白名单只留 {object,dimension,score,dimension_id}**（anchor L433-434 同）⇒ **DP-049 候选（候批修：白名单加 rationale·须先核 _validate_seat_scores 是否同丢）**。

## §六 · 待命面（2026-11-24 22:45 时点）

- idle 候令（末动作 20:30 charter-122210Z 交付 e435482ec）；待 COO 点名候件/DP-049 批/下轮点火令（resume19 备号候全毕）。

## §七 · 使用依据

- 各轮 run_dir 产物（preflight/dce/score/score-skill/joint-review/close/ignite.log）+session 事件（turn/end）+cost-log；overlay 备份件；tag/sha；charter 122210Z/203018Z 原文；commit 锚如上。
- D-24/D-46/D-47。

—— SDE 小布（m-sde·resume14-18 运维全程卷·dce 真跑首绿+overlay 两档+标尺真相）·写前现查 2026-11-24T14:46:00Z（+8=2026-11-24 22:46:00·date 现查原值·D-47 正形）

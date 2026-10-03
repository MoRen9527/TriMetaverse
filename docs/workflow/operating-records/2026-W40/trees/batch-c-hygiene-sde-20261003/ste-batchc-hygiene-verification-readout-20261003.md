# STE·SDE trimc 修窗卷验卷（readout-batch-c-hygiene.md §十一§十二 验；COO 15:2x 派）

- sourceOfTruth: 本件（修窗执行录+收口段 STE 验正身；对象=batch-c-hygiene-sde-20261003/readout-batch-c-hygiene.md §十一§十二，f62facaf）
- syncMode: static（四环+加验首轮 A/B 实证；orchestrate-tick 15:48 / clock-skew 15:19 前两轮+三 PATCH job 余两轮候补随卷补记）
- lastSyncedAt: 2026-10-03T07:36Z 窗（date 现查 15:36+0800）
- 验证席: STE 小柯（m-ste）；零转抄 ✓（sg 只读 SSH 全读数独立复得：jobs.json 值面/快照对表/首轮日志/healthz/双树 find；SDE 读数仅对表）

## 一、验面四环读数总表

| # | 验点 | 本席独立读数（15:24-15:33 +0800） | 判 |
| --- | --- | --- | --- |
| ①a | jobs.json 属主断言 | `/var/lib/trimc/cron/jobs.json` = **fleet:fleet 600**（mtime 15:25 活体写入面） | ✓ |
| ①b | jobCount:9+9 jobs 逐一在册 | healthz **jobCount:9**；jobs.json 9 id 全数（weekly-plane-shift/config-sync-apply/clock-skew-check/orchestrate-tick/daily-progress-watcher/github-reconcile/sg-watchlist-patrol/sg-8460-probe/bod-progress-report）全 enabled | ✓ |
| ①c | nextRunAtMs 9/9+死线 | **9/9 nextRunAtMs 在位**（近期排程 15:30-16:19+明日 weekly 全向前）；restart2 时点=ps lstart **15:16:47**（MainPID 3961889）∈15:3x 死线 | ✓ |
| ② | degraded 如实报面+归因判读 | 现态 healthz **degraded:true / consecutiveFailures 61→62**（config-sync 15:31 轮新败+1 持续涨实证）——SDE 未粉饰、失败族全入卷如实报 ✓；归因判读见 §二（非修窗引入成立+归因层一处勘正） | ✓* |
| ③ | notify 链端到端 | 本机 8713 healthz（15:24>restart2）：**mc_link:"connected" + trimc:"connected"** 独立复得 | ✓ |
| ④ | 双树 root 清零 | `find /var/lib/trimc -user root`=**0**；`find /srv/fleet -user root`=**0**（15:25，restart2 后 8 分钟=间隙窗已过仍 0/0） | ✓ |

*✓* 附一处卷面归因勘正（非阻塞，见 §二.2）。

## 二、runuser 缺口归因判读（验面②展开）

### 1. 修窗引入与否：非修窗引入，成立

- 15:03 T+0 快照（pre-window）实证：四 job runAs=**fleet** 早已在位、command 无 runuser（见 2）；root 期长史成功旁证=clock-skew runCount 965 / daily-progress 5155 / config-sync 4781 / weekly 10-01 ok——root 主进程下 runner 包装 runuser 降权合法故常态绿；fleet 身份修复后暴露。**缺口系身份修复暴露旧形态依赖，非本窗引入** ✓（与 SDE 判同，证据独立）。

### 2. 卷面归因层勘正（非阻塞，SDE 卷一处）：runuser 不在 command 字符串，真凶=payload.runAs+runner 包装层

- SDE 卷 §十二「四 job **command 字符串硬编码 runuser**（早期写死）」——**快照实证不成立**：15:03 快照四 job `cmdHasRunuser=false` 且 `runAs=fleet`；现 jobs.json 9 job command 全 clean（0/9 含 runuser 子串），而 15:16-15:19 各轮 stderr 实打 `runuser: may not be used by non-root users` → 唯一自洽解释=**runner 按 payload.runAs 包装 runuser**（command 层从未携带）。
- PATCH 实际形态（15:24:52 三 job updatedAt 同簇实证）=**清 payload.runAs**（clock-skew/orchestrate/daily-progress 三 job 现 runAs=undefined）；weekly-plane-shift/bod-progress-report/config-sync-apply 仍 runAs=fleet。
- 该勘正不改判定：修法方向正确（去降权包装=直跑即 fleet，原降权意图天然达成）、如实报面成立；建议 SDE 卷随勘一笔（或以本卷记录即闭）。

### 3. PATCH 首轮 A/B 天然对照（15:30/15:31 双轮实测，决定性）

| job | runAs | 首轮（patch 后） | 读数 | 判 |
| --- | --- | --- | --- | --- |
| daily-progress-watcher | undefined（已 patch） | 15:30:00 | **status=ok / 5120ms / exit 0 / stderr 空** | ✓ 生效直证 |
| config-sync-apply | fleet（未 patch，对照组） | 15:31:48 | status=error / **runuser 秒败 exit 1**（10ms）/ 连败 61→62 | ✓ 对照正中 |

- 同 runner 同机同窗，唯一变量=runAs 清除与否 → **runAs 字段=失败唯一变量的 A/B 实证成立**，patch 机制面闭合。
- 候补轮（随卷补记）：orchestrate-tick 15:48 / clock-skew-check 16:19（预测 ok）；**bod-progress-report nextRunAtMs 已过期**（catch-up 待触发）且 runAs=fleet 未 patch → **预测 runuser 败**（候触发实测）；config-sync-apply 系分叉冻结面持续败（既有观察面，候其归属窗裁）。

## 三、余项

- healthz consecutiveFailures 与 job 级 state.consecutiveFailures（读数 0）口径不同源——healthz=daemon 级连败面（62 持续涨），job 级字段恒 0 疑未接线/复位语义，观察项不改判定，候 SDE 注一笔。
- 环境面轻验按 COO 令执行（读数复核+日志抽验，未做全量重扫）。

## 四、判定

**四环 PASS+patch A/B 实证闭合**：三护栏全过、如实报面成立、notify 链活、双树 0/0；runuser 缺口=非修窗引入 ✓+真凶层勘正（runAs 字段）+三 job patch 首轮生效直证。修窗主体质量门过；候补轮三枚（15:48/16:19/bod-progress catch-up）随卷补记后本卷终版。

## 五、使用依据

- COO 15:2x 验派（验面四环+runuser 首轮抽验并入）；SDE 卷 f62facaf §十一§十二（对表）
- 实锚（sg 只读 SSH 三批 15:24-15:33）：healthz 8712 双轮 face/ps lstart/ss/jobs.json 值面（键名+布面，值面零出机）/15:03 快照对表/四 job state face/首轮日志掩码尾取（grep -vE "^command:|^runAs"）/双树 find；本机 8713 healthz link face
- 关联：roster 翻转件 CTO 定性 fcf9bf0a（测试假设过期，另卷勘正）；值面零出机+掩码纪律全程 ✓

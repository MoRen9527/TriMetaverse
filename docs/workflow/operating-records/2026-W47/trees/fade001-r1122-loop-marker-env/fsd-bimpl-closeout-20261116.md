# FSD r112② B 案施工毕报卷（TRICO_LOOP_MARKER_DIR env 名换装·三面实锚）

- sourceOfTruth: 本卷（trees/fade001-r1122-loop-marker-env/·毕报树面正身；快轨正身=毕报信）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-15T18:11:28Z（+8=2026-11-16 02:11:28·date 现查原值粘贴）
- 法源链: r112 三项裁定②（TMV 08a92306b）→COS 台账 658 裁 B 案（免 root 独立 env 名·域内径裁·D-39 三类过闸）→CTO env 名 02:05:12 确认 TRICO_LOOP_MARKER_DIR 照用→COS 开工令（台账 659·前置全齐）
- 施工范围: preflight marker 目录读入 env 名 TRIMC_CONFIG_DIR→TRICO_LOOP_MARKER_DIR（兜底 /var/lib/trimc 语义维持）+unit 注入+河源同步

## §〇 · 毕报总锚（三面实锚）

| 面 | 实锚 | 读数 |
|---|---|---|
| ①preflight 改读新名 | **TC 4a05c74f**（push 讫·ls-remote 验真 sg 顶=4a05c74f） | preflight.py L260 读入形+L254-258 契约注释；test_preflight 29/29+cognition 全量 240 OK（239+1 数学闭合）+validation 438/5/1 基线零漂 |
| ②unit 注入新名值面 | **R-HY drop-in `trirmc.service.d/trimc-loop-marker-dir.conf`** | `Environment=TRICO_LOOP_MARKER_DIR=/var/lib/trirmc`（fleet:fleet 实勘可写）；注入前活体探针三面零命中（unit 合成面/daemon 进程 env/TriRMC src+dist 全树）；restart 后 boot 稳窗 25s+二次防抖 10s 采读基线形稳定（storePath=data 形·jobCount=4·enabled·零 degraded·MainPID 2319222） |
| ③河源检出同步 | **R-HY TC 检出顶=4a05c74f** | fetch+ff-only 零冲突；真 preflight CLI 端到端（fleet 身份·真 healthz·真 hostname·--loop-window）**exit 0 verdict pass·week_math 四键值面全中**（mode=loop-window·sunday_gate=exempted(loop)·sunday_gate_note=real cron Sunday gate unchanged·loop_source=cli·run_dir_week_note 归属周注记）+hostname/healthz/git_hygiene 三断言全真过 |

## §一 · 施工链全序（照 week_math 先例）

1. **TC 施工**（4a05c74f·2 files +47/-5）：preflight.py 接缝注释段+读入行 env 名换装（旧名撞车实锚注释在码）；test 接缝案换名（sandbox=TRICO_LOOP_MARKER_DIR 指临时位）+**新增 env 名契约钉案** `test_marker_env_name_contract_no_legacy_read`（诱饵形：旧名位放 marker+新名指空目录→旧名零消费直证·周日门原样拒·防回退钉）。
2. **门禁三连全绿**：test_preflight 29/29（28+1）·cognition 全量 240 OK·validation 438/5/1 逐字同基线零漂（五案预存家族）。
3. **push 双通道**：github https 瞬断（已知家族）→ssh 侧通道推讫（699a62a..4a05c74）→ls-remote 验真顶逐字=4a05c74f。
4. **河源同步**：R-HY git fetch ssh 侧+ff-only→4a05c74f 零冲突。
5. **注入前活体探针（条件②遵行）**：三面零命中实证（面 A unit 合成面 grep -c=0/面 B daemon 进程 env=0/面 C TriRMC src+dist 全树零命中；面 C2=TriCompany 检出内新码 2 处在位=施工笔分域对）。
6. **unit 注入+restart+稳窗双防抖**：drop-in 注入（注释载法源链+护栏）→daemon-reload→restart→25s 稳窗+10s 二次防抖采读——**两读全基线形**（4 jobs·零 degraded）——与旧键施工 restart 的异常读数（0 jobs·storePath=/var/lib/trirmc 形）形成对照（见 §二）。
7. **进程内键探针**：/proc/PID/environ TRICO_LOOP_MARKER_DIR=1 ✓。
8. **端到端双探针**：fleet 身份 marker 写/读/删 OK（/var/lib/trirmc·继承链模拟形）+真 preflight CLI 全链 exit 0（§〇 表③）。

## §二 · 旧键撞车实锚链与快报勘正（如实载）

1. **撞车实锚**（unit 注入形·已撤）：首枪按 r112② 原文注入 TRIMC_CONFIG_DIR=/var/lib/trirmc→restart→journal+healthz 读数异常（store=/var/lib/trirmc/cron/jobs.json·jobCount=0）→即时撤笔留档（/root/trimc-config-dir.conf.withdrawn-r1122）+restart→基线复归。
2. **快报勘正（我面 02:05 快报定性修正）**：补勘文件面三证——/var/lib/trirmc/cron/ 下 **jobs.json 文件从未存在**（ls 实证仅 logs/+runs/）·data 形 /srv/fleet/TriRMC/data/cron/jobs.json **全程在役且两次 restart 均正常写**（mtime 02:00/02:03·4 jobs 配置面从未离开基线位）——**「store 迁位灾难」降级修正=boot 未稳窗假读数**（sleep 4 即采读·boot 早期 journal 按 configDir 形 log+healthz 未加载完即被采读）。**新定性：0 jobs=boot 窗假读数家族新实例·止损 restart 实为非必要（幂等无害）·基线全程未破**。机理残留（daemon boot 先 configDir 形后回 data 形两段序·TRIRMC_CONFIG_DIR unit 10-09 即有但基线 logPath 混搭形）=观察项候窗勘·不阻 gate。
3. **工序教训如实领（两笔）**：①施工前源码勘照做但勘的是**可能落后/分域的检出**（TriRMC 本机检出 grep 零命中旧键·活体行为分叉未先探针即施工）——活体优先诊断法执行差口·B 案施工已按条件②三面活体探针正形化偿还；②**boot 未稳窗读数禁作终态定性**（瞬态采读→假灾难定性→非必要 restart）——「防抖确认窗终态等待」纪律新实例，B 案施工已按 25s+10s 双防抖正形化偿还。

## §三 · 候验收后链

1. CTO 验收（本卷+TC 4a05c74f diff 亲勘·验收锚=三面实锚表+契约钉案词面）→STE 复验接力（COS 已排）→SDE 三跑触发不再候令。
2. CPO 候窗注记面（LOOP_WINDOW 裸名对齐）今夜不动已入账（COS 659 知会）。
3. 观察项移交：TriRMC cron store boot 两段序机理线（§二.2）·我面候窗勘或移交 SDE/值席面。

## 使用依据

- r112 三项裁定（08a92306b）·COS 台账 658 裁 B+659 开工令（附条件①②③）·CTO env 名确认 02:05:12（TRICO_LOOP_MARKER_DIR·命名对表=TRICO_PLAN_AGENT_ENDPOINT/TRICO_PREFLIGHT_EXPECTED_HOST 同域两先例）
- TC 仓 preflight.py/test_preflight.py 现勘（699a62a 并线形基线）·TriRMC src/config/env.ts+local-settings.ts 实勘（TRIRMC_CONFIG_DIR 消费面）·R-HY 活体四轮读数链（基线→旧键→止损→新键）
- 记忆锚族：活体优先诊断法/防抖确认窗终态定性/git 侧通道 push 先例/D-46 值面零回显/D-47 落款铁则/daemon 机位矩阵（R-HY=8710）

—— FSD 小全（m-fsd）·2026-11-15T18:11:28Z（+8=2026-11-16 02:11:28·date 现查原值·D-47 正形）

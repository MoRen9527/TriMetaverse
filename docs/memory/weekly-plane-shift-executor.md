---
name: weekly-plane-shift-executor
description: 周平面迁移唯一执行点在河源 TriRMC cron（周日 23:00 北京时间）；job 禁带 runAs；迁移窗冻结 sg watcher；本地 TriLC 旧 job 已删除；回流合并的冲突解法
metadata: 
  node_type: memory
  type: project
  originSessionId: 3ce184e6-6a9a-42ee-a7a4-8410d4fb6576
  modified: 2026-10-04T15:46:07.059Z
---

周工作平面迁移（周度平移）的**唯一正确执行点是 TriMC 服务器 cron**（sg-ecs-server，`/srv/fleet/TriMC`，job `b00b0070-2f82-4e7d-a98c-de73e886834b`，周日 23:59 北京时间——timezone `Asia/Shanghai`，`{fromWeek}/{toWeek}/{startDate}` 模板由 `computeWeekShiftTokens()` 动态注入，runbook：TriMC/docs/ops/trimc-cron-plane-shift-runbook.md）。2026-08-23（北京时间 23:59）首次自然触发成功：W34→W35 / start 2026-08-24 / pass。

**命名锚定（2026-08-24 quad-migration v1.0）**：服务器现役实例叙事面已更名 **TriMMC**（元虚拟主控，驱动 claude code 在 fleet 工作的壳）；兼容面物理路径/unit 名一律旧名照用（操作命令语境禁写新名）。权威 alias 表在 TriCompany/docs/registry/company-governance-state.md。勿把服务器现役实例与新规划的 TriRMC（元现实主控，独立服务 :8712）搞混。

本地 TriLC daemon 的同名旧 job `cron_mslsfgv1_ybgk`（2026-08-09 装，command 写死 `--from W32 --to W33 --start-date 2026-08-10`，TriMC 上线前的临时方案）已于 2026-08-24 经 CEO 批准**删除**（先禁用后 `DELETE /internal/v1/cron/jobs/{id}`，daemon 只剩 test-echo）——它每周日重放过期参数、fail、还会用 fail 记录**覆盖历史 `.shift-ade.json`**。

**Why:** 本地 job 与 TriMC job 双轨并存且本地参数永不过期更新，导致"日期计算错误"假象（实为参数写死）；迁移写权归服务器单主体，本地手跑只会污染工作区。

**How to apply:**
- 迁移问题先查服务器：`ssh sg-ecs-server "cat /var/lib/trimc/cron/jobs.json"` + `ls -t /var/lib/trimc/cron/logs/`；兜底手动触发 `cd /srv/fleet/TriMC && npx tsx src/cli.ts cron run b00b0070-2f82-4e7d-a98c-de73e886834b`（job ID 必须全量 UUID）。
- 回流（编排层职责）：本地 `git pull sg-server dev`（注意 `git pull` 不接受 `-m`，用 fetch+merge）。W34/W35 实证：**周 index JSON 常冲突**——本地周内增量（版本号/updatedBy/summary）vs 服务器 retire 字段；解法=本地内容 + 服务器 `lastUpdated`（retire 时间），其余闭合字段（status closed、latestActiveWeek false、nextWeekRef）自动合并已对。
- 回流后必查 `docs/workflow/operating-records/README.md` 的"当前最新 active 周"指针——迁移脚本不更新 README（SOP 第 9 步一直被跳过），2026-08-24 发现已陈旧 6 周停在 W29。
- 本地领先服务器未推的 commit 会让迁移 commit 落旧基、回流出 merge；push sg-server 需 CEO 放行（2026-08-24 一次被拒），事后处理合并即可。
- 时区口径（2026-08-24 CEO 定）：全系统=北京时间，IANA 名 `Asia/Shanghai`；TriMC 代码/测试/runbook 已统一（commit a0e2d21），服务器活 jobs.json 已手术修正。已知漂移：cli.ts 预设 `0 23` vs 现役 `59 23`；CLI `cron update` 缺 `--timezone` 且 `--cron` 会整体替换 schedule 丢 tz（跟进项）。关联 [[truth-record-amendment-policy]]（fail 记录覆盖历史 pass 记录的处置：回退恢复真源；历史文档 Singapore 字样按叙事冻结不改）。

**2026-10-04 夜迁移未跑事故+本机自动对齐落位（双实证）**：①CEO 21:43 裁迁移器=R-HY TriRMC cron job 9c81c7ec（周日 23:00），当晚 23:00 未跑——根因（BOD R-HY 三刀实锚）=TriRMC cron **executor 整体停摆**（三 job 全过期、store 末次写 10-01 10:45、HTTP 8710 活=服务活 executor 死；终版=trirmc.service 10-01 前后人工 stop+disabled 三日）。BOD 23:26 补跑（生产同路径）落地 d0552559（W41 三件 PASS）+重启修复（取证已留）；异常定性归 BOD→CEO。教训：HTTP 活≠executor 活，调度面健康核读必查 nextRun 过期数+store 写时点（[[liveness-first-diagnostics]]）。②**LG-056 本机自动对齐执行体落位实证**：TriMLC 8713 plane-shift job 机写 align-log merge ok，本机 dev 被机写 ff 至 bare 顶 8a34c720（COS 23:17 后仅 fetch 只读=非人为指纹）——「消费端 fetch+merge 不推」正形首次生产实跑，LG-056 自动化转现役（本机对齐不再依赖人工段）。

**2026-08-26 主责切换**：周平面迁移唯一执行体已切至**河源第二服务器 TriRMC**（8.155.54.79，trirmc.service，127.0.0.1:8712 loopback，job weekly-plane-shift 真 --sync 档；推送经部署密钥→sg-bare）。sg-server trimc 同名 job 已 disable（回滚=两侧 PATCH 翻转）。~~河源另驻 TriRLC headless 实例（rmc-autonomy-001，agent-core 执行面）——两套永续系统的 R 面生产拓扑成形~~。

**2026-10-01 河源 TriLC 退役（CEO 令 10:41，BOD 执行）**：上段「河源另驻 TriRLC headless」**失效**——CEO 裁「TriRLC 只留本机」，河源 trilc-headless.service（8711 loopback，服务名旧名 trilc 未随改名，rmc-autonomy-001 空转态）已 stop+disable+存档（卷=2026-W40/trees/rhy-trilc-retirement.md；回滚=enable+start 可逆）。河源现役对外面=8710 trirmc 唯一；2026-10-01 晨勘已实锚河源迁移主责亦回切 sg（见上段 2026-10-01 勘正），河源 TriRMC 面 cron disabled+0 job 退役态。

**2026-10-01 河源 trirmc.service（8712）退役+晨勘二次勘正（CEO 令 10:43，BOD 执行）**：①河源两 TriRMC unit 分野=`trirmc.service`（127.0.0.1:8712，挂 3 死 job）vs `trirmc-mc.service`（0.0.0.0:8710 对外=quadmig-2，**M2 主链用此**）——同晨 10:1x 勘「河源 cron disabled+0 job」**勘的是 8710 面**，8712 面实有 weekly-plane-shift（双跑残留，主责回切 sg 后从未跑过=歪打正着避免双跑污染）+rmc-orchestrate-tick+tricompany-pull 三 job 全 F-3 同款死态（hasNext False）——F-3 家族性缺陷（cron INSERT 缺 next_run_at）跨机实证，病毒面现收敛本机 TriMLC 8713 一處（河源份随退役消灭，sg TriMMC agent-core job-store=正形）。②trirmc.service 已 stop+disable+存档（卷=2026-W40/trees/rhy-trirmc-retirement.md；复役=enable+start，建议先裁 3 死 job）。③河源 3333 trimodel.service 在役候令（trirmc unit 内有 09-29 SDE P1 接线注记指向它，不在 8712 退役令范围）。

**2026-10-01 晨勘正（BOD 只读实勘，周平面迁移现役执行体回切 sg）**：①现役唯一在役=**sg TriMMC 8712 `weekly-plane-shift`（b00b0070-2f82…，enabled）**——batch-04 token 驻留扫卷（trees/bod-pipeline-batch-04/token-residency-rescan.md）9 job 清单第一位亲列，command 形态=`cd /srv/fleet/TriCompany && python3.8 -m runtime.cognition.weekly_plane_shift…`（河源 --sync 档形态迁回）；W39→W40（09-27 周日）迁移实绩自洽。②**河源 TriRMC cron 面=disabled+0 job**（healthz `cron.enabled:false,jobCount:0`；无 cron 配置键；root/fleet 系统 crontab 双空）——08-26「唯一执行体=河源」段**失效**；河源端口拓扑亦变：今晨实勘 8710=trirmc（0.0.0.0 对外，quad-migration quadmig-2）+8711=TriRLC loopback，**8712 无监听**。③勘证链：值席报 R-HY 8710 空回→BOD 直达河源反转勘（宿主健康绿）→系阿里云安全组 8710 未放行（公网自打不通+iptables 无拦）——sg→R-HY 跨机链路不通，M2 cutover 硬前提缺项候 CEO。回滚口径照旧：两侧 PATCH 翻转（现役若需回河源须先解 cron disabled+补 job）。

**2026-08-30 夜（董事会三修+冻结令，W35→W36 首跑前）**：①调度 23:59→**周日 23:00**（CEO 定：留补救窗，23:08 巡检兜底）；②**job payload 禁带 runAs**——trirmc.service 本身以 fleet 运行，runAs 走 runuser 必炸 "may not be used by non-root users"（rmc-orchestrate-tick 连错 248 实证；无 runAs=进程用户即 fleet，单身份不损）；③payload 前置 `cd /srv/fleet/TriMetaverse && git pull --ff-only sg-bare dev`——heyuan 无 TriMetaverse 拉取 job，clone 陈旧则 push non-FF 必拒；④迁移窗**冻结平面写入**=临时 disable sg daily-progress-watcher（唯一机器写入者），迁移验证通过后 PATCH enabled=true 解冻。⑤PATCH 经 /internal/v1/cron API（x-internal-token 在 systemctl cat 服务单元里）；applyJobPatch 对 payload 是整体替换，PATCH 时必须带完整新 payload。⑥同秒竞态消除（CEO 定）：sg daily-progress-watcher 槽位由 `*/10` 移至 `5,15,25,35,45,55`——22:55 末班先于迁移 23:00，增量被迁移 pull 吸收；周检齿条（LG-016 件 5）增"weekly-plane-shift lastRunStatus=ok"断言，迁移失败周一晨检即曝。

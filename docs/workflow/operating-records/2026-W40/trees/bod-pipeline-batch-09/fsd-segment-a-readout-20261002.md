# FSD·车道A连锁段施工读数卷（10-02 18-24 窗·分段落盘 全二段收口）

- sourceOfTruth: 本件（FSD 施工读数卷；令源=COO 17:58 窗令→COO 18:2x 勘正令→COS 18:2x 防坑要项→COO 18:3x F-4 处置裁复→BOD 18:5x root 链完工触发令+BOD 机位勘正令）
- syncMode: static（A 段全毕终态；T5 接力候 COO 排程）
- lastSyncedAt: 2026-10-02T19:00+08:00（date 现查=2026-10-02 18:59:15 +08:00）
- 施工席: FSD 小全（m-fsd）

## 一、窗令叙事正名（COO 18:2x 勘正令承接）

- 昨晚（10-01 夜）连锁段 dev 面五步已由 COS 执行席通道完工、00:5x BOD 验收 PASS 全录；本席 00:07「A 段顺延」申报系本车道视角属实（本席未动），全局顺延定谳系 COO 信息缺口，已双向勘正认账。
- 本席独立勘验与 COS 卷三重吻合：TriMLC HEAD=**a66b3b2**（F-3 Part B 自愈回填在库）+dist 构建 00:01:05+8713 daemon 00:51:42 起活（pid 17876，单代 cmd 壳 21424，无老壳残留）+L15 TRILC 0641 值在役——**今晚 Part B 零对象，销项如实注**。

## 二、工序1'（TRIMC 族轮换）完工读数

- 范围：channel.cmd L10 TRIMC_INTERNAL_TOKEN + L17 TRIMC_NOTIFY_SG_TOKEN 同值换新 + D:\Code\ai\.env TRIMC_NOTIFY_SG_TOKEN（第 6 驻留面）；TRILC 值（已由 SDE 落位在役）与 TRIMODEL_API_TOKEN 未触。
- 新值生成：.NET RNG 64-hex 机内，零出机。指纹：新 **4842**\*\*\*\*..\*\*\*\***4aa5** / 旧 **d2cd**\*\*\*\*..\*\*\*\***e075** 退役。
- **五验全绿**：
  1. 行在三处真（regex 定位回读）
  2. len64 全真
  3. 同族同值=三面逐字节等（L10=L17=env）
  4. 旧值零残留（双文件 Contains=false）+新值计数 ch=2/env=1 合约
  5. **cmd 实跑 set 生效探针 PASS**（COS 教训①采纳：临时副本剔 cd+node 运行行，cmd.exe 真解析，PROBE_A/B=4842 同值断言 True；TRILC 0641/TRILC_TRIMODEL_API_URL=https://8.155.54.79/NODE_EXTRA_CA_CERTS=leaf.pem 原样未触断言 True）
- CRLF 保真：channel.cmd 38:0、.env 137:0 与写前基线逐字节同构（LF 漂移零发生）。
- 回滚锚：channel.cmd.bak-pre-trimc-rot-20261002 + .env.bak-pre-trimc-rot-20261002 双件在位（bak 即删制，候探针毕删）。
- 在役影响：零（daemon env 冻结 00:51 代旧值，冷起才换新；mc_link 全程 connected）。

## 三、F-4 新缺陷定谳卷（候 CTO 批立，10-03 窗候选）

- **症状**：hub-silent-detect 自 00:51 冷起后停排 18h（日志末轮 00:37+08；runs 冻结 97）。
- **证据**：API 实读 state=running/enabled=true/nextRunAt=2026-10-01T16:30:00.000Z（陈旧）/lastRunAt=16:15:11.826Z/runs=97/errs=27；DB 面逐字段一致。
- **机理**：00:37+08 force-run 起跑置 state=running（runJobNow L368）→ daemon 00:51 被停于 run 中途 → state 冻结 running；boot 序列无 orphan 清理 → timer tick L131 与 runMissedJobs L335 双排除 → 永不可调度；armTimer L93 仍纳入（仅空转计时器，无崩溃）。
- **堵路面**：updateJob 字段白名单无 state（store.ts L285-334）；force-run 被 already-running 挡（L366）——API 面解冻不通。
- **运营解法（COO 裁准纳入冷起序）**：优雅停后冷起前，node:sqlite 单行 UPDATE state='idle'（daemon 停态无内存回写冲突）→ 冷起 boot catchup 见陈旧 nextRunAt 即补跑复活。零代码零二次重启。
- **双录锚（COO 加验，已录）**：UPDATE 前 API+DB 原值双录=state=running/next_run_at=2026-10-01T16:30:00.000Z/last_run_at=2026-10-01T16:15:11.826Z/run_count=97/error_count=27（id=cron_muo2mj6s_cco2）；回滚锚=原值可回写。
- **代码级修（不入今晚窗）**：boot 序列补 orphan running→idle 清理（runMissedJobs 前置一处），候 CTO 批立 F-4 缺陷单。
- **⓹ 探针判据严化（COO 裁准）**：六 job 断言=nextRunAt 非 NULL **且非陈旧**（fresh：>now-3600s）；解冻后 hub-silent-detect 须 fresh。

## 四、errs=26 归因破案（COO 裁收档）

- 全日志错误族计数=5 行 ERROR，全部=「notify failed: This operation was aborted（三钉② state NOT written）」；时段=09-30 21:01+08 与 10-01 21:37/21:54+08（sg 8712 迁移窗+隧道抖动族）；10-01 22:48+08（14:48Z）起 NOTIFIED 成功自愈。定性=迁移窗瞬时族，非调度缺陷。观察项销，归因本卷并档。

## 五、候链基线读数（冷起前现势）

- sg bare TriMLC dev tip=**a66b3b2**（=本地 HEAD；BOD root 链的 sg 侧 pull 源头已就绪，本席零推送动作）。
- 8711 异值断言基线：channel 0641 值打 8711 /internal/v1/cron/jobs → **401**（18:40:21+08；首测误用 /healthz 无令牌面得 200 系探针端点错误，/internal 复测 401 正判——token 家族分离维持，维护批③对象态未变）。
- 在役六 job：四活跃（l2-scan/l3-remind/tree-node-patrol/ledger-watchlist-patrol）每分钟正常轮（lastRun=10:30Z 读数，日志逐轮 ok）；plane-shift 下轮 10-04；hub-silent-detect=F-4 冻结态（解冻案候冷起）。
- TMV 树：本段写作时 local==bare==60452ef5（期间经 accec810 分叉自愈合流，COO 18:35 F-4 三裁记档在谱系内）。
- watchdog 现势：TriMLC-Watchdog Ready，5min 节律（18:27 轮 daemon 健康空过）；冷起序含 disable→复原双步。
- sg root 链：候 BOD 触发中（本席不抢 sg 面）；触发后按六阶段剧本执行（disable→带令优雅停→解冻→冷起→核 pid/pidfile/healthz→watchdog 复原→探针⓵⓷复验+⓹严化+⓶TRIMC 双向首验）。

## 六、第二段：冷起六阶段+探针全毕（sg root 链触发后，BOD 18:5x 令）

**触发与措辞矛盾注**：BOD 令文「sg 面，起非重启——trilc-8713.pid 现空」系机位错语（BOD 勘正令自认，归属 BOD）；冷起正身=本机 8713（F-4 cron.db+notify 验收+新值激活全指向本机面），照跑。sg TriMLC 起役不立单（备料态维持）。

- **阶段0 噪音窗取证**（18:54:21）：mc_link=**degraded**（在役旧值 env 打已轮换新 sg 门=401 重试中，预期内）；cron 面 degraded=False/jobCount=6。
- **阶段1 watchdog disable**（18:54:21）：Disabled，Next Run N/A 双验证 ✓。
- **阶段2 带令优雅停**（18:54:42）：POST /shutdown +X-Internal-Token（in-flight 0641 机内提取零出机）→**200**；node 17876+cmd 壳 21424 二十秒窗内干净退场，零残留断言 ✓。禁裸杀遵守。
- **阶段3 F-4 解冻**（18:54:58）：停态安全窗 node:sqlite 单行 UPDATE；PRE 原值第三录=running（与 API/DB 双录逐字段一致）；**UPDATE changes=1**；POST 回读 state=idle ✓。
- **阶段4/5 冷起+三验**（18:55:18）：Start-Process cmd /c channel.cmd（Hidden）唯一一次起；healthz ok+jobCount=6；**新 pid=50268←壳 52424 父链匹配（同秒 18:55:18 起，单代无老壳）**；pidfile ~/.trimetaverse/trilc-8713.pid=50268 与新 pid 同值 ✓。uptime=0 时 mc_link=degraded 系启动初态，45s 复测 **mc_link=connected+trimc=connected**（18:56:47）——新值链通，噪音窗散。
- **阶段6 watchdog 复原**（18:57:36）：Ready，下轮 19:02:00 ✓。
- **探针三套全绿（缺一不销项律闭合）**：
  - ⓵ F-3 五步：POST probe **201**+nextRunAt 非 NULL（Part A 直证）/GET gtNow=true/DELETE **200**+零残留；⓷ 端到端触发以在役四活跃 job 自然轮替代（lastRun 分钟级新鲜；draft 原文「可选加件」——allowlist exact-match 下临时 probe command 必拒，如实注）。
  - ⓹ 严化六 job fresh 断言：**全 true**（含 hub-silent-detect）。
  - **F-4 复活终证**：lastRun=10-02T10:55:20Z（**冷起后 2 秒 catchup 补跑**）、runs=97→**98**、state=idle、next fresh——运营解法全链闭环。
  - ⓶ TRIMC 族双向首验（经隧道 18710→sg 8712 门）：**新值 200/旧值 401** ✓（值零出机，旧值自 bak 机内读取）。
  - 8711 异值维持：冷起前基线 401（18:40:21，首测误用无令牌面 /healthz 得 200 系探针端点错误已勘，/internal 复测正判）+冷起后复测 **401**（18:59）双录 ✓。
  - **notify 端到端投递验收（BOD 点名归我段）**：试信 ntf-muqufn0olpwou5（root-chain-acceptance-probe）**18:56:20+08 落箱**（mailbox API total=474/unread 面活）——8712 出队→8713 poller 拉取→信箱落箱全链通，冷起后首轮即达。
- **bak 即删制闭合**（18:59:15）：探针全绿后 channel.cmd/.env 双 bak 退役删除 ✓。
- ⓷ M2 键链端到端 200（SDE 主验）：我段供料齐——TRILC_TRIMODEL_API_URL/NODE_EXTRA_CA_CERTS 随冷起在役+trimc=connected+mc_link connected；终验候 SDE 段。

## 七、使用依据

- COO 17:58:49 窗令（hook 18:17:43 递）+18:2x 勘正令+18:3x F-4 裁复+18:4x 回执确认（SendMessage 实收）
- COS 18:2x 防坑要项（CRLF 保真+cmd 实跑探针+壳代次勘验，实锚=昨晚 LF 漂移 8711 EADDRINUSE 事故）
- TriMLC 实勘：git log（a66b3b2/0fd9c6f 谱系）/src/cron/timer.ts 全文（L88-142 arm/tick、L203-220 throw 路径、L329-355 catchup）/store.ts L218-260（Part A 在库）L285-334（updateJob 白名单）/service.ts 特征串/dist mtime 00:01:05
- 在役 API 读数：/healthz、/internal/v1/cron/jobs、/internal/v1/cron/logs（门令机内提取零出机）
- cron.db 只读快照（node:sqlite DatabaseSync，同 daemon 通道）
- .fade/probe-logs/hub-silent-detect.log 全量错误族扫描（28838B）
- sg-server ls-remote=60452ef5 谱系核

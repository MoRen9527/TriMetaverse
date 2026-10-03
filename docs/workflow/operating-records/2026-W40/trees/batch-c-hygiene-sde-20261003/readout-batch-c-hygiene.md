# 批C 卫生族·SDE 毕报读数卷（BOD #300，sg 面 SSH 车道）

- 执行: m-sde（dev 机）→sg（M-SG-47.245.122.61，root SSH，写面仅限令内四小件）
- 时点: 全部读数 2026-10-03 08:02-08:2x+08 现采（date 现查锚；sg 侧读数均 sg 本地钟）
- 边界遵守: 本机 TriModel 围栏面（3333/仓面）零触碰；sg 树工作内容零改动（勘而不修）；链尾 STE 验→BOD 复核

## 一、②8710 无监听勘·定谳=预期形态非故障 ✅（修否候裁项：无需修）

- unit 态: trimc.service loaded **active running**（since 2026-10-02 18:50:23 CST，13h+，NRestarts=0，ExecMainStatus=0）
- 监听实锚: `127.0.0.1:8712` LISTEN（pid 3681229 node dist/src/index.js）——drop-in `port-bind.conf` 明文 `TRIMC_PORT=8712`+`TRIMC_HOST=127.0.0.1`
- 定谳: 8710=TriMMC 旧端口，09-30 8712 迁移窗（BOD #140 裁 A）后服务正名端口=8712（本机 18710 隧道对端即 sg 8712，10-02 晚探活 200 同源）——**8710 无监听=迁移后预期形态，非故障**
- healthz 值面（127.0.0.1:8712 现探）: HTTP 200 `ok:true / cron enabled:true jobCount:9 degraded:true consecutiveFailures:34`（勘验段 33→34 递增中）——degraded 归因见 §四
- **附发现（重要报备）**: trimc.service `User=` 空=systemd 默认 **root 身份跑主进程**（ExecStart=/usr/local/sbin/trimc-start.sh 内 `exec node` 直跑，TRIMC_RUNAS=fleet 仅 job 执行面 env）；同机 trimodel-config(3333)/trimodel-proxy(3334) 两 unit 主进程均 fleet 身份。修法方向=User=fleet drop-in，但动 unit 须 daemon-reload+重启 TriMC=触禁二次重启纪律+跨 10-02 18:50 冷起，**候 BOD/CTO 裁不擅动**

## 二、①晨勘四小件

### 1. sg bare gc（/srv/git/TriMetaverse.git，origin 权威）✅ 闭环

- 前读数: count 1054 松散 / in-pack 56021 / packs 28
- 执行: **fleet 身份**（`su - fleet -c git gc`——root 跑 gc 必留 root 属主 pack，09-30 教训规避）
- 首轮 gc 曝根因族铁证: 两松散对象 unlink Permission denied（fleet 删不动 root 属主对象）+bare 仓存量 root 属主 4 件（2 对象+2 父目录，历史 root push 遗留）
- 处置: 4 件 chown fleet:fleet→fleet 补收 gc（零 warning）→**终态 count 0 / packs 2 / in-pack 49026 / root 残留 0**（断言过）
- gc exit 0×2；in-pack 降幅（56021→49026）=unreachable 对象 prune（bare 无 reflog，BOD 19:25 已勘定性低危维护面，本窗授权收编）

### 2. sg 空文件清点 ✅ 63 个（只清点，删否候裁）

- 正常件族（~58）: .gitkeep 惯例件+W35/W36 门日志空 stderr（p0fix3-trilc-http/p0fix4-trimodel-stream trees）+quarantine 区 node_modules 空件（TriRMC-stale/TriLC.quarantine 隔离区）
- **可疑件候勘（3）**: `/srv/fleet/TriMetaverse/meta-recognition.md`、`meta-virtuality.md`、`meta-reality.md` 仓库根三文件 0 字节——是否预期空件候 content owner 勘定
- 删否候裁: 本令面=清点，零删除动作

### 3+4. 所有权面勘+W39 chown 归还 ✅

- 全 fleet 面 root 属主 **82 件**，分族五桶:
  - TriCode 族 20 件: src/trimodel-cli+test+presets+package.json+.git/HEAD+.git/refs/remotes/origin/dev（09-30 root store 教训实证面）
  - TriMC 族 ~45 件: notify 族源码/test+**.git 内部面**（refs/heads/dev、refs/stash、index、ORIG_HEAD+~30 松散对象）+notify-mailbox/outbox.json（活体写入面）+.env.bak-20261002Trootchain
  - TriMetaverse 4 件: W39 两件（已归还）+.fade/sg-watchlist-state.json+.fade/probe-logs（活体写入面，watchlist job root 跑所写，chown 会被活体覆写回 root，归还无意义）
  - TriMMC 6 件: notify-mailbox/outbox/ledger+docker/.env（活体敏感面）+两个 .env.bak
  - 杂项 2: /srv/fleet/STOP-NOTICE-20260925-1400.md、/srv/fleet/bin
- **W39 归还（令面内执行 ✅）**: OP-202609-W39-001.json+trees/ade-legacy-sweep/inventory-draft.md 两件 chown fleet:fleet（exit 0，目录本 fleet 属主）→复验 W39 root 计数=0
- **扩围候裁（80 件不动）**: TriCode/TriMC 源码族归还利于 fleet job 面，但 TriMC 根因=主进程 root 跑法（§一附发现）——先裁 unit User= 修法再清源，否则归还后照旧复发；活体写入面归还无意义。候 BOD 裁

## 三、degraded consecutiveFailures 33→34·归因链（勘毕候裁，未修）

- **job A=config-sync-apply**（cwd=/srv/fleet，timeout 600s，~5min 周期）: `git pull` **fatal: Not possible to fast-forward, aborting. exit 128**——连败计数源（33×5min≈2.75h 起于今晨）
- **job B=daily-progress 守护族**（d0f87756）: tmv_pull ok:false attempts:2 `cannot pull with rebase: You have unstaged changes`（内部失败但 exit 0 包装）
- sg TMV 树现态（fleet 视角只读勘）: HEAD=2ec7dfe4（BOD batch-15 复工令卷）vs origin/dev=a5679008（COO 批A/B 回执录账）**分叉态**；unstaged 大片 ` M .claude/agents/*.md`（13 席 agent 发布拷贝全 M，13+ 件）
- 归因: 分叉（双端各有独有提交）+unstaged（agents 渲染产物未收口）双挡——**修复属 sg 树工作内容面（解分叉方向/agents 收口归属），非我车道擅动，候 COO/CTO 裁**；本机对齐 SOP 冲突即停纪律同适用

## 四、观察项报备（非本令范围）

- **sg 钟快 ~20s**: 同轮区间法 LOCAL 08:11:23 → SG 08:11:43 → LOCAL2 08:11:45（∈[+18s,+22s]）；对照 R-HY 钟漂观察周稳定 ±1s 级——sg NTP 面候运维勘（时钟调整系系统面变更，不擅动）
- journal 面 5min 间隔 runuser fleet session 成对开闭=TriMC cron job 派生 fleet 会话痕迹，量级正常

## 五、自曝件（候定性）

- 勘 drop-in 时整文件 cat override.conf，TRIMC_INTERNAL_TOKEN 值面经工具输出回显会话链一次——**value-face-never-print-path 教训的"整文件 cat"变体**（打印路径预检含密缺失）。三未实锚：未出机/未入树/未入 git；该同值已随 10-02 channel.cmd 快照案在册（BOD 定性操作瑕疵、不提前轮换）。教训条候补"整文件 cat 前先 grep 键名清单"

## 六、候裁清单汇总（修否全候裁，零擅动）

1. 8710: **无需修**（预期形态，卷证）
2. config-sync-apply 连败: 解分叉+agents unstaged 收口归属——sg 树工作内容面，候 COO/CTO
3. trimc.service root 跑法: User=fleet drop-in 修法（动 unit=重启，禁二次重启纪律）——候 BOD/CTO
4. root 属主 80 件扩围归还: 建议随 3 修后清源——候 BOD
5. 空文件 63: 删否候裁；meta-*.md 三件 0 字节候 content owner 勘
6. sg 钟+20s: NTP 面候运维
7. 自曝件 §五: 候定性

## 七、收口补记（10:1x-10:2x 窗）+ #305 接令段

- **毕报卷 push 双端**: GitHub 成（a5679008..a75cfc58）；sg bare 首推被拒（objects/a3 Permission denied，remote rejected）——复勘反转：bare 现勘零异常（a3=fleet:fleet 2775 可写、非 fleet 属主 0 件），疑 gc2 后瞬时态/ssh 瞬断同源
- **复推读数交错（并发 push 竞态窗）**: 我方复推期间并行席（STE/CTO 维护批收口流）活跃推送，bare ref 回报混读——判定以 fetch 后 ancestry 断言为准：**a75cfc58 YES-ancestor 在 bare dev 线上 ✓**（经并行线通道到达），我方零重推零冲突零数据损
- **hook 撞脏实证（§三归因材料+1）**: bare post-receive hook auto-pull sg 工作树报 `cannot rebase: You have unstaged changes`——sg 树 unstaged agents 13+ 件在挡 hook 自动同步=树落后 bare（HEAD 2ec7dfe4 悬空分叉件+落后 6+ commits）——config-sync 连败根因机制面闭合，修否候 COO/CTO（不越界不动）
- **meta-*.md 三件勘定（⑤认领询材料）**: 本机同款 0 字节（2025-10-23 建仓件），git 历史仅 bootstrap 一笔（0a8127819 chore: bootstrap TriMetaverse meta-repo）=**bootstrap 骨架件非内容丢失**；认领询照发，认领不着窗尾删报（**双机同删对齐**：sg 删+本机删，防 push 回流复活）
- **#305 四件接领**:
  - ③ trimc.service User=fleet 准修——候 CTO 窗令，预案已备（见 §八）；禁二次重启纪律适用
  - ④ 80 件扩围归还——序随③，③窗内并批执行（含**序调正**：TriMC 活体写入面 notify-mailbox/outbox 等 chown 必须先于 restart，否则 fleet 进程启动即写 root 属主文件被拒）
  - ⑤ 认领询已启动（附 bootstrap 勘定材料）
  - ⑥ sg 钟+20s——知悉，候今日运维窗与 CTO 顺带校时
  - ⑦ 自曝件 BOD 定性认收讫；「整文件 cat 前先 grep 键名清单」候补转 CAO（COO 打包族）

## 八、③重启预案（候 CTO 窗令，备妥待命）

- 前置: CTO 窗令+时点核对（执行令时点交叉核对纪律）；禁二次重启语义=同一单元（trimc.service）本窗仅一次 restart
- 步1 job state 快照: 9 jobs 全态导出（含 nextRunAtMs 完整性断言——cron-job-state-hygiene：禁抹 nextRunAtMs），快照落 /root 或 /tmp 带 ts 文件名
- 步2 chown 归还先于 restart（④并批）: TriMC 活体写入面（notify-mailbox.json/notify-outbox.json/docker/.env 读面豁免仅需可读）+源码族+.git 内部面统一 chown fleet:fleet→find ! -user fleet 清零断言（bare 仓与活体写入面 sg-watchlist-state.json 不动——watchlist job root 跑态随③修后自然转 fleet）
- 步3 drop-in 落位: /etc/systemd/system/trimc.service.d/user-fleet.conf（[Service] User=fleet Group=fleet）——前置断言 trimc-start.sh 全链 fleet 可读（TriModel/.env 读 token 行+dist+node 可执行）
- 步4 daemon-reload+restart trimc（一次）
- 步5 完工判据（重启窗完工判据=进程内生效验证）: healthz 200 ok:true+**进程身份断言 ps -o user= -p MainPID=fleet**（值面探针，healthz 绿≠身份切换生效）+cron jobCount:9+notify 双文件新写入属主 fleet 断言
- 步6 观察: config-sync-apply 连败计数归零+watchlist job 续跑+degraded 转 false 候观察窗
- 回滚预案: drop-in 移除+daemon-reload+restart（回 root 形态）+job state 快照在案可回灌；触发条件=restart 后 healthz 非绿或主进程起败
- 风险注: fleet HOME/.trimmc 面依赖（duty-env source 链）——drop-in 现有 env-home.conf 已管 HOME，落位前 cat 断言

## 使用依据

- 令: COO→SDE 批C 卫生族令（BOD #300，2026-10-03 07:57；现戳 07:59:53 同窗无矛盾）+COO #305 执行面转知（10:0x，复核 PASS，③④⑤⑥⑦四件）
- 纪律: 确定性执行四步/09-30 root store 教训（gc 走 fleet 身份+root 操作后清点归还）/掩码纪律（日志 tail 前滤 command:/runAs 行）/活体优先（healthz 值面探针）/禁二次重启（unit 修法候裁不动）/机位断言活体现探（pid+ss 双锚）
- 实锚: /etc/systemd/system/trimc.service.d/{port-bind,override}.conf+/usr/local/sbin/trimc-start.sh+ss -tlnp+8712 healthz+git count-objects -v 前后对+find 三轮清单+/var/lib/trimc/cron/logs 抽样（滤密行）

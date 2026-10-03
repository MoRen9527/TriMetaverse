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
- **meta-*.md 终态（COO 10:4x 裁）**: 三件**留**——BS 实勘改定性（白皮书 tmv-whitepaper.md L1292-1294 待补清单明文点名三件+L1432-1444 参考基线在列，双删=断白皮书两处显式指针）；CPO 裁不认领（归属 BS 域白皮书概念延伸非产品域）；BS 挂账=候写非今日成稿。**删除窗取消，双删预案作废**
- **§三归因链处置终态（COO 10:4x）**: hook 撞脏+config-sync 分叉归并 #305 ② 不新立单——COO 组窗（12:00 联审后窗）一并配方处置，SDE 零触碰维持；push 竞态教训（并发推送窗判定一律 ancestry 断言）录账候 CAO 打包
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

## 九、修窗令正形对表（COO 拍板+CTO 窗定 293791ff，10:4x 令）

- 窗: **2026-10-03 15:00-15:3x**（30min+15:30-16:00 缓冲）；禁二次重启纪律=trimc.service 本窗仅一次 restart
- 工序收敛正形（CTO §四+本席 §八双席独立收敛同序）: unit drop-in（**User=fleet+HOME=/home/fleet 覆盖**，禁改原 unit/原 drop-in）→**数据面 chown 先行**→单次 restart→验收→find 清零断言
- 对表差异两点（回执挑明候勘正）:
  1. **root 属主计数口径差**: 本席 08:2x root 视角 `find /srv/fleet -user root`=82 件 vs 令面 14080 件（-R 全树口径）——**窗内 T+0 现勘重新计数对表**，数差如实报不硬收
  2. **执行面主张**: find -user root 精准 chown（仅动 root 件）达成同终态（root 清零断言）——`chown -R` 全树刷会把树内非 root 属主件（如 tristac 系 k3s 件）一并改写，误伤面大；若 CTO 明令 -R 全树则照做并先列非 root 件清单
- 验收锚正形: 主锚=**notify 链端到端非仅进程活**+ps 断言 MainPID=fleet；fallback=删 drop-in 还原（预案内动作非违例）
- ⑥校时同窗: **systemd-timesyncd 起**（chrony 不批零新依赖）——enable --now+timedatectl 断言+钟差收敛观察
- jobs.json 快照前置: 9 jobs 全态导出+nextRunAtMs 完整性断言（cron-job-state-hygiene）
- 观察注: config-sync 连败归零候分叉解（COO 12:00 后窗）后自然归零——窗内验证口径=job 派发执行正常+失败归因转为 ff 分叉族（权限族失败消除证据），非强求窗内归零

## 十、chown 口径收敛（CTO 11:4x 回·对表闭环）——两棵不同的树

- **口径差定谳**: 两边读数都对=两棵树。CTO 14080=`find /var/lib/trimc -user root`（TriMMC **数据面**：cron store/logs/config，root 跑 13h+ 写出，无 .git）；本席 82=`find /srv/fleet -user root`（git 操作污染面）。本席晨勘漏 /var/lib/trimc 树（只勘了 /srv/fleet）——CTO 补第二棵树
- **④域双树工序（CTO 正形+本席精准 chown 采纳）**:
  - 树 A /var/lib/trimc: 前置 T+0 **双计数对表**（总件数 vs root 件数——相等=全树 root 精准=-R 等价；不等=非 root 件异常面清单留痕单独报不动）→精准 chown `find /var/lib/trimc -user root -exec chown fleet:fleet {} +`→**必须在 restart 前**（数据面可写性）
  - 树 B /srv/fleet: 同款精准 chown 82 件+清零断言，与 restart 无序依赖，同窗顺带
  - 清零断言两树各自跑（`find <树> -user root | wc -l`=0）
- **间隙新增件注（本席补）**: 树 A chown 后至 restart 前，root 主进程仍续写（cron 5min 周期）——T+5 清零断言在 **restart 后**跑可捕获全部残留；若间隙新增件在，补一轮精准 chown 再断言（restart 后 fleet 进程新件=fleet，补一轮即稳收敛）

## 十一、修窗执行录（15:00-15:3x 窗，cron e0372e84 触发）

- 窗时点核对: 本地 date 现查 `2026-10-03 15:02:31 +0800`（原值粘贴）∈窗内开工；sg 钟 15:02:43 CST（同分钟对齐）

### T+0 现勘（15:02-15:03，全只读）

- 树A /var/lib/trimc: 总 14210 / root 14203 / 非 root 非 fleet 0——差值 7 件=fleet 属主件（合法目标身份非异常第三方），**精准 chown 正形通行**
- 树B /srv/fleet: root=80（vs 晨勘 82，差 2=今晨 W39 已归还，账实自洽）
- env-home.conf 键名清单=仅 HOME 单键现值 `/root`——证实 user-fleet.conf 必须带 HOME 覆盖（字典序 u 后载 ✓）
- jobs.json 快照 `/tmp/trimc-jobs-snapshot-20261003T150313.json`，9 jobs / nextRunAtMs 9/9 完整 ✓
- trimc-start.sh 四链 fleet 可读: SCRIPT/DIST/NODE/CWD 全 OK；TriModel/.env fleet 可读 ✓；/home/fleet fleet 可写 ✓

### T+1 双树精准 chown（15:04）

- 树A `find -user root -exec chown fleet:fleet {} +` 14203 件+树B 80 件→即时清零断言 0/0；活体写入面（jobs.json/notify-mailbox/outbox）fleet:fleet ✓

### T+2 drop-in 落位+预检拦截（15:05-15:07）

- user-fleet.conf 初版（User=fleet/Group=fleet/裸 HOME=/home/fleet）落位+daemon-reload
- **预检拦截一处缺陷**: systemctl show 合并视图 HOME 仍=/root 且 cat-config 无 user-fleet 的 HOME 行——实锚=裸 `HOME=` 非 [Service] 合法键被 systemd **静默忽略**（unknown key）；修正=`Environment=HOME=/home/fleet`；复验 cat-config 双 HOME 行按载入序 /root→/home/fleet（后值胜）✓。**未伤活体（restart 前抓到）**
- systemd-analyze verify trimc.service exit 0 唯一 warning=override.conf:1 assignment outside section（既有件非本窗引入，键名提取空疑特殊字符首行，本窗未动候令勘）
- DROPIN-PATHS 六 conf 全加载（含 override/user-fleet）

### T+3 单次 restart（15:06-15:08）+起败插曲

- restart 前终检: NRestarts=0+since 10-02 18:50=窗内首 restart 确认
- restart 后**起败**: activating/auto-restart，MainPID=0，healthz 000
- journal 真因一行: `trimc-start.sh: line 17: /tmp/trimc-run.log: Permission denied`——root 期 13h+ 遗留日志文件 root:root，fleet 首启 exec 前写日志被拒 exit 1
- 处置: /tmp 下 trimc 系 root 件三件（run.log 凶手 644+本席快照件 600+trimodel-surgery 旧目录 755）一并 chown fleet:fleet→**auto-restart 下一轮自愈成功**（journal 实锚 32 次失败循环后第一成功轮）——零我方二次 restart 动作

### T+4 验收（15:09-15:10）

- ps 断言: MainPID=3959407 **user=fleet** ✓；proc env 值面探针: USER=fleet/HOME=/home/fleet/TRIMC_PORT=8712/TRIMC_HOST=127.0.0.1/TRIMC_RUNAS=fleet 全对 ✓
- 监听: 127.0.0.1:8712 pid 3959407 ✓；healthz 200 `ok:true degraded:false consecutiveFailures:0`（连败清零 ✓）

### T+5 双树清零断言（15:10，restart 后跑捕获间隙件）

- 首断言非零（树A=2/树B=1）——定位=15:05:00 旧 root 进程 cron 5min 周期写**间隙新增件**（jobs.json+cron log+sg-watchlist-state.json，CTO §十间隙注预言正中）——补一轮精准 chown→**两树清零 0/0** ✓

### T+6 校时项定谳反转（15:11）

- 令面 systemd-timesyncd enable 失败: unit 文件不存在——但 timedatectl `NTP service: active / synchronized: yes`
- 实锚: **chronyd.service 在役自 2026-08-11 20:32（近两月）**，chronyc tracking: Stratum 3 / System time 0.000044s slow of NTP time——**sg 钟零漂移**
- **定谳: 晨勘 §四「sg 钟快 +20s」=测量假象**（同轮区间法 LOCAL→SG→LOCAL2 的 SSH 延迟不对称所致），非真漂移
- 处置: ⑥校时项**零动作收项**（chronyd 已覆盖 NTP 面，零新依赖满足令面「chrony 不批」；timesyncd 无需装）；§四晨勘结论候勘正

### 残留一件+报裁（15:1x，双报已达）

- healthz **jobCount:0（应 9）**: 源码级定谳=agent-core `dist/scheduler/job-store.js` L67-95 `loadJobStore()` 进程级 `memCache` 缓存——fleet 首启（15:06）时 jobs.json 尚 root:root 600（15:05 旧 root 进程写回的间隙件）→EACCES→`memCache={}` **永久固化**（`if (memCache)` 空对象 truthy；invalidateJobStoreCache 无运行时入口）；15:1x 补 chown 后不复愈
- 热修复路径全堵: API PATCH/addJob 均过污染缓存；addJob 会以空缓存为基 save=丢 9 jobs（禁用）
- **唯一修复=进程再 restart 一次**——与「本窗仅一次 restart」纪律冲突，报裁 COO（c6851db0）+CTO（df862a1d）：①特批窗内二次 restart 一次到位 ②窗收口候下窗载入
- fallback 未触发（healthz 绿+主进程活，不在触发面）
- 影响面注: jobCount:0 期间 sg cron 9 job 停摆（config-sync 本就分叉冻结面零新增损；watchlist 停=BOD 读数源暂缺）
- T+7 观察注记（config-sync 权限族失败消除证据）随 cron 载入后补取

## 十二、修窗收口（15:16-15:2x）——COO 裁①特批+CTO APPROVE 执行段

- **裁决链**: 报裁（COO c6851db0+CTO df862a1d）→COO 裁①特批护栏三条→CTO 独立验源码级定谳（零转抄）APPROVE+BOD 特批背书（COO 转达）
- **护栏①执行**: restart2 前 jobs.json 属主断言 `fleet:fleet 600`+FLEET-READABLE ✓（EACCES 根因面确认消除）
- **二次 restart（15:16:44，COO/CTO/BOD 三批特批内）**: active running MainPID=3961889 **user=fleet** ✓
- **完工锚读数（15:16:50+）**:
  - **healthz `jobCount:9`** ✓（污染清除值面探针过；date 现查 15:16:44 死线内）
  - **9 jobs 逐一在册**: weekly-plane-shift / config-sync-apply / clock-skew-check / orchestrate-tick / daily-progress-watcher / github-reconcile / sg-watchlist-patrol / sg-8460-probe / bod-progress-report——id 9 / nextRunAtMs 9 ✓
  - 进程 env 终态复验（新 pid）: USER=fleet / HOME=/home/fleet / TRIMC_PORT=8712 ✓；双树终断言 root 0/0 ✓
- **CTO 四锚对照**:
  1. jobCount:9 ✓
  2. degraded:false+连败零 **未达成**——归因见下（runuser 适配缺口），如实报
  3. notify 链端到端（二次 restart 后复验）✓: 本机 8713 healthz 15:17:19（>restart2 15:16:44）`mc_link:connected / trimc:connected`=poller↔终态进程拉取链活；watchlist job 15:16:48 exit 0 执行面佐证（BOD 读数源恢复）
  4. addJob 禁令全程维持 ✓（零 addJob/零 PATCH，store 未动）
- **锚②阻塞归因（新暴露适配缺口，非修窗引入）**: 四 job（config-sync-apply/clock-skew-check/orchestrate-tick/daily-progress-watcher）command 字符串**硬编码 runuser**（早期按「root 主进程+runuser 降权」形态写死）——fleet 主进程下 `runuser: may not be used by non-root users` 秒败 exit 1（四 log stderr 实锚；config-sync 连败 61 持续涨，其余三个单败）。**root 跑法下这些 job 表面正常（runuser 在 root 下合法降权）——缺口=身份修复暴露旧形态依赖**。github-reconcile errs=1（01-07 旧轮 exit 1 无 runuser 字样）=非同族既有观察面
- 成功面: weekly-plane-shift（5434ms exit 0）/sg-watchlist-patrol（exit 0）/sg-8460-probe 零败
- **候裁件（新增）**: 4 job command runuser 适配——修法建议=PATCH 四 job payload.command 去 runuser 段（直跑即 fleet=原降权意图天然达成；数据面+零重启+即生效，applyJobPatch 支持 payload 字段实锚）vs command-handler 代码层加「uid==target 直跑」分支（一劳永逸但涉代码+重编译+sg 树冻结面）。裁定权 CTO/COO，本窗零擅动
- fallback 全程未触发；修窗主体（③ User=fleet+④ root 归还+⑥校时反转收项）全达成，窗内主体耗时 ~15 分钟（15:02-15:17）

## §十三 勘记（2026-10-03 15:4x，COO 转达 STE 验+值面复锚；历史段冻结原文不动，本节勘正）

- **勘 §十二「锚②阻塞归因」表述**：「四 job command 字符串硬编码 runuser」**不成立**（STE 15:03 快照 cmdHasRunuser=false 实锚）——真凶=**payload.runAs 嵌套字段+runner 包装层**（command-handler.ts L85 `payload.runAs ? 'runuser' : shell`，runuser 包裹唯一判定点在 payload 键非 command 串）。stderr 的 runuser 报错系包装层生成命令所出，非 command 串含 runuser。
- **勘 §十二「候裁件」修法表述**：正形=**PATCH payload 去 runAs 键**（非「去 command runuser 段」）——已由 COO 裁 a 分批执行毕：三 job（clock-skew-check/orchestrate-tick/daily-progress-watcher）15:24:52 同簇 PATCH 200×3+回读断言 runAs 已除；config-sync-apply+weekly-plane-shift+bod-progress-report 候 16:00 组窗段。
- **A/B 天然对照进卷（STE 加验一锤+本席值面补强）**：daily-progress（patch 后）15:30 轮 ok/exit 0 vs config-sync（未 patch 对照）15:31 轮 runuser 败=runAs 唯一变量实证。本席补强：daily-progress 15:40Z…07:40Z PATCH 后首轮 log 值面三件套实锚=「runAs: (process user)」+零 stderr+`RESULT: exit code 0`（值面完工锚达成）。
- **注笔（计数口径）**：healthz `degraded/consecutiveFailures`（全局连败计数）与 job 级 state 计数**不同源**（后者恒 0）——两口径勿互套，故障归因以 log+state 双面为准。

## §十四 16:00 config-sync 组窗·SDE 执行录（2026-10-03 16:00 起，COO 主刀/SDE 执行位）

- 窗令: COO 16:00:10 组窗开场令（hook 现戳 16:00:31 收，延迟 21s 零矛盾）；护栏五条接领（④未裁禁动面/③只读先行/23:00 死线险情即报/禁重启 TriMMC 全走 API/时刻现查）
- 执行序: ①开场对表留档→②runAs 清三件 PATCH（config-sync-apply/bod-progress-report/weekly-plane-shift）→③WPS 写面只读预检→④config-sync ff 分叉收编（清点→报裁→裁后 rebase→hook 验证）→⑤bod 一致性→⑥两候办归台账

### ① 开场对表留档（先对表后动操作）

- 实锚一（BOD 节拍）: config-sync-apply job id `5a8e6eac` logs 路径族——BOD 节拍独立捕得 jobCount:9 对表一致
- 实锚二（SDE PATCH 执行记录）: 三 job（clock-skew-check/orchestrate-tick/daily-progress-watcher）15:24:52 同簇 PATCH 200×3+回读 runAs 已除+PATCH 后首轮值面两连绿（daily 07:40Z/orchestrate 07:48Z `runAs: (process user)`+零 stderr+exit 0）——**零 403**（TriMMC cron PATCH 面无白名单门实证）
- 实锚三（CTO 机位错认领笔）: TriMLC 8713 allowlist 门执行单作废认领（sg 四 job 驻留 TriMMC 8712 零白名单口径定谳）
- STE 验卷引用: 2ee7930d（修窗卷 STE 验四环 PASS+A/B 对照一锤）
- **SDE 补锚（trimc 树 PATCH 入口 grep，07:49:18Z 预采）**: `src/cron/routes.ts` L114-115 `PATCH /internal/v1/cron/jobs/{id}` 路由在位+`src/cron/service.ts` L151 `jobs[id] = applyJobPatch(job, patch)`；**src/cron 域零 ALLOWLIST 命中**（全 src grep 4 命中全在 agent-loop 面 tools.ts TRIMC_SHELL_ALLOWLIST/permissions.ts TOOL_TIER_ALLOWLIST=域外另一门，cron command 面零白名单维持——域限定词防「全 src 零 allowlist」误读）

### ② runAs 清三件 PATCH（16:01 执行，sg 8712 TriMMC API 面零重启）

| job | HTTP | hadRunAs→after | command sha8 | updatedAtMs |
| --- | --- | --- | --- | --- |
| config-sync-apply | 200 | True→None | 011e5e6a→011e5e6a 零变 | 1791014509049=08:01:49Z |
| bod-progress-report | 200 | True→None | d7e6a7f0→d7e6a7f0 零变 | 1791014508000=08:01:48Z |
| weekly-plane-shift | 200 | True→None | a74098a3→a74098a3 零变 | 1791014508004=08:01:48Z |

- 手法=同三 job 簇：PATCH {"payload": <去 runAs 全量>}；回读经进程内 API+command sha8 前后断言（零动 command 段实证）
- ⑤随②闭：bod-progress-report patch 毕=catch-up 预测败轮消（STE 预测面）；weekly-plane-shift 23:00 死线压力随 patch 消（今晚 23:00 触发轮即 patched 形态首跑）

### ③ WPS 写面只读预检复采（16:01，全绿零 chown 需求）

- TMV 树根 fleet:fleet 755/operating-records fleet:fleet 755/W40 fleet:fleet 775+fleet 写探针 W40-WRITE-OK
- sg bare refs/heads/dev+HEAD fleet:fleet 664；bare dev ref=64f12c97
- **结论：23:00 weekly-plane-shift 迁移写面通，零精准 chown 需求，直接可跑**

### ④ config-sync ff 分叉·现勘清点+分域收编方案（报裁中，裁前零动面）

- **形态定谳（ancestry 断言）**：merge-base=d2c8aeac；工作仓 HEAD=2ec7dfe4（领先 merge-base 1 提交，未推 bare）；origin/dev=64f12c97（领先 94 提交）——**真分叉非单纯落后**
- **脏件清点（git status 全列 50 项）**：30 M（.claude/agents 19+.github/agents 12 域）+6 M（operating-records 周平面）+7 D（ceo-review 3+trees 4）+7 ??（batch-16 任务书 4+batch-17 任务书+CEO review 2+task-charter .bak 1）
- **抽样判读**：board.md diff 方向=工作树缺 `user-invocable: true`+渲染尾注=**旧渲染拷贝**（HEAD 新版反超）；D 类抽样两件 bare 顶树 ls-tree 仍在=**删除孤立**；C 域断言=bare 94 件 grep 零「BOD复工令batch-15三件」同内容
- **五域收编方案（16:0x 报 COO 裁，裁前零动面）**：
  | 域 | 范围 | 推荐案 | 依据 |
  | --- | --- | --- | --- |
  | A | agents 发布拷贝 30 M | discard 恢复 HEAD 版 | 旧渲染拷贝零保留价值；真源=TriCompany source-agents 渲染管线 |
  | B1 | operating-records 6 M | 收编一笔提交 | 周平面在途产出真值 |
  | B2 | D 7 件 | 恢复（候案=收编删除须席位归属确认） | bare 顶树仍含抽样件=删除无收编依据 |
  | B3 | ?? 7 件 | 收编提交（.bak 候 BOD 定去留） | batch-16/17 任务书+CEO review=在途真值 |
  | C | 本地提交 2ec7dfe4 | (c1) rebase 保留推 bare（候案 c2=drop 若 bare 线 batch-15 链已覆盖） | bare 94 件无同内容断言 |
- **执行序（裁后）**：backup 指针（回滚锚）→B2 恢复→B1+B3 收编 commit→A 域 checkout→pull --rebase→推 bare→hook 活体验证（后续 push 零 cannot rebase 报错）

### ⑥ 两候办归台账（录账候 COO 转 CTO）

1. **方案 b（config-sync 代码层）**：command-handler 加「uid==target 直跑」分支——一劳永逸但涉代码+重编译+sg 树冻结面；现 PATCH 面已解 runAs 残留，方案 b 降级为候办归 CTO 台账勘
2. **allowlist 转发壳退役时点**：TriMLC（8713）转发壳（旧位 import 指针）须有退役时点——候 CTO 勘归并（三形态对表 TriMMC 零白名单已实证，转发壳退役条件面渐熟）

### ④ 收编执行录（16:05 裁后开工→16:22 毕；COO 三裁 R1×2+授权）

- **轮 1（16:06-16:07）**：backup 快照 `/srv/fleet/backup-pre-reconcile-20261003T080622Z`（47 件 908K cp 零错=**回滚锚**）→B2 恢复毕（D 残留 0）→B1+B3 收编 commit `7424e3cd`（13 件 154+/34-）→A 域 numstat 32 行全档（**全加<删零反例**，人工逐行断言；最大 15<27）→checkout A 域毕（残留 0）
- **清点口径勘（自纠）**：D 实 9 件非 7/agents 实 32 件非 30（首轮清点读数偏差，收编清单以 status 快照实锚为准）
- **轮 2 第一轮 rebase（16:06:57）**：pull --rebase onto bfdafcb9——49f132d1（复工令'）重放毕；收编 7424e3cd 撞 **4 文件冲突**挂起→**停手报裁**（护栏）→裁料实证：四件（workbench/op-assembly/task-inventory/node-status.jsonl）**sg 收编版⊆bare 版零独有增量**（workbench 零差/其余=旧简态，bare 详化超集含动态条 30-34 等）
- **R1 裁（COO 16:09:29）**：四件 --theirs 取 bare 顶版→执行毕→rebase continue 毕=2d80488b→push 被拒（bare 已前进）
- **车道交叠插曲+误归因勘正认领**：工作仓现 rebase 挂起（新冲突 workbench 单件）——我初判「COO 16:1x fetch --rebase 所留」=**误归因**（COO 全程未动 sg 工作仓；我把其预告推定成既成动作=拓扑断言禁由恢复源推定同族再犯自记）；**reflog 佐证=COO 假说成立：post-receive hook 自动 rebase**（16:17:4x 某席推 1dfa79b5 落 bare→hook 对工作仓 pull --rebase→onto 1dfa79b5 重放我两笔→16:18:00 rebase start+撞 workbench 挂起→hook 进程退完；reflog `rebase (start): checkout origin/dev` 命令形态+时点链吻合）
- **R1 延续（COO 16:20:26 授权）**：workbench --theirs 取 1dfa79b5 版→continue 毕=**a0f7cc13**（收编'）→porcelain=0→**push 成功 `1dfa79b5..a0f7cc13` exit 0+hook 全输出零报错**（前两笔均有 cannot rebase——**hook 活体验证锚 ✓ 工作仓已净 hook 正常**）
- **终态链（bare 顶=a0f7cc13）**：a0f7cc13 收编'→09d96bd1 复工令'→1dfa79b5 COS 大表→19514659 CPO 对表段→f1f59443 COO 组窗议程（对表材料：COO 本机四笔之一 f1f59443 已在 bare）

### ⑤ 三 job PATCH 后首轮触发读数 3/3（机位=sg 8712 TriMMC，值面三件套全绿）

| job | 首轮 | runAs | stderr | exit |
| --- | --- | --- | --- | --- |
| daily-progress-watcher | 07:40:00Z | (process user) | 零 | 0 |
| orchestrate-tick | 07:48:00Z | (process user) | 零 | 0 |
| clock-skew-check | 08:19:45Z | (process user) | 零 | 0 |

### ④/组窗验证锚两件

- **hook 报错消失 ✓**：收编毕 push exit 0+零 cannot rebase（活体）
- **consecutiveFailures 回落清零**：现值 65 仍涨（config-sync 下轮 08:31:49Z=PATCH 后首跑）——**候 08:31:49Z 轮回落验证，到点补勘**（job 级 state 无 fail 计数键唯 runCount=4785=COO ②笔口径注笔实证）

## §十五 收口补记（2026-10-03 16:3x，date 现查 08:37:06Z 锚；验证锚①读数+收编事故复盘+残留四件转裁）

### 验证锚①读数（08:3x 现勘，#332 线自收报）

- healthz：degraded=**false** + consecutiveFailures 高位回落至 **1**（残余 1=config-sync exit128 冻结面既有错形非身份层——COO 16:38 采认口径）
- config-sync PATCH 后首轮 08:31:49Z（log 5a8e6eac__08-31-49Z，滤 command 行取值面）：runAs:(process user) + 零 stderr + **exit 0**（outcome=no-op，bundle cdcaae60 already applied）——值面三件套全绿
- 锚全达成时点=候下轮绿后 cf 清零，自收报续（COO 16:38 裁）
- **自收报修订（17:1x 现勘，date 锚 09:1xZ）**：config-sync PATCH 后五轮全绿（08:01/08:16/08:31/08:46/09:01Z 均 runAs 正形+零 stderr+exit 0，ce=**0**）；cf=1 真凶=**github-reconcile**（job 级 ce=1，last 10-03T01:07Z，exit 1，443 阻塞族疑似）——源码定谳 cf 语义=max over jobs(state.consecutiveErrors)（service.ts getStatus），与 config-sync 无关；COO 16:38「残余 1=config-sync exit128」归因勘正；cf=1 挂至 github-reconcile 下轮成功（低频 job，443 恢复线）——degraded=false 健康面不受影响

### 收编事故复盘（COO 核对令回执三读数，16:38 裁收讫）

- 事故：a0f7cc13 收编 sg 工作区陈旧版 M 件→stopwork 冻结件今日段 44 行覆盖删除（COO 口径 48 行含段界计法差，diff 实测 44）
- 缺陷步=收编 add 前零值面对照：numstat 清点只覆盖 git 面；M 态判定基线=工作仓旧 HEAD——M≠含新内容，也可能是缺 bare 已有内容；fetch 缺位+add 直收=覆盖链。实证：`git diff bfdafcb9 a0f7cc13` 对该件=44 删 0 增；现顶 f151469c 对该件 53 行回补（COS 本机全文修复）
- hook 绿≠语义面：④锚「hook 零报错」实为 git 面锚（rebase/merge 成功+报错消失），内容面零覆盖——与「键存在性抽验≠值面验证」族并档候 CAO；本卷该锚表述不再引用为内容面验证
- 同族自查（bfdafcb9→f151469c 净变化逐件）：op-assembly-20261003 净删 44（**残留**，转 COS 修复）；seat-resume-auto-01/node-status.jsonl 净删 7 + bod-pipeline-batch-09/node-status.jsonl 净删 3（转 COS 认领）；task-inventory-20260930 净删 11（候合法迁移 COS 值面认领，1003 新台账 99 行新件在 bare）；daily-progress 净删 2（巡检下轮自然观察）；其余 10 件收编=纯新增正常形态零反例
- 护栏三条议定（组窗尾落纪要+CAO 入册族）：①活文档收编/回写前必 fetch 最新 ②回写覆盖风险护栏 ③M 件收编前必跑 `git diff <bare顶> -- <件>` 值面预检，净删除分量>0 即停手报 owner——通用判别式正身采纳（COO 16:38）

### 车道终态

- bare 顶 16:3x=f151469c（COO 插曲录账+修复线）；本机 dev 对齐 0/0；残留修复归 COS/owner，本席不再动 bare 面

## 使用依据

- 令: COO→SDE 批C 卫生族令（BOD #300，2026-10-03 07:57；现戳 07:59:53 同窗无矛盾）+COO #305 执行面转知（10:0x，复核 PASS，③④⑤⑥⑦四件）
- 纪律: 确定性执行四步/09-30 root store 教训（gc 走 fleet 身份+root 操作后清点归还）/掩码纪律（日志 tail 前滤 command:/runAs 行）/活体优先（healthz 值面探针）/禁二次重启（unit 修法候裁不动）/机位断言活体现探（pid+ss 双锚）
- 实锚: /etc/systemd/system/trimc.service.d/{port-bind,override}.conf+/usr/local/sbin/trimc-start.sh+ss -tlnp+8712 healthz+git count-objects -v 前后对+find 三轮清单+/var/lib/trimc/cron/logs 抽样（滤密行）

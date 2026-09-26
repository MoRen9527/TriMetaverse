# STE 波④ 执行日志（工作证据卷，随臂续写；终报另出）

- sourceOfTruth: 本件（波④ 执行过程证据卷；终态结论以终报正身为准）
- syncMode: working
- lastSyncedAt: 2026-09-26 08:0x +0800（date 现查 hook 链）
- 执行席: STE 小柯（m-ste）；派单=dispatch-wave4.md @ 7f1c62ed；方案正身=joint-plan.md 24ba1ccc
- 窗管理（CTO 四条款）: 进窗时点=候 FSD 钉位就位即记（F1 在窗外，不依赖钉位）；窗长上限 2h；出窗还原义务+三读数核验候 F2-F4 毕

## 前置核验读数（2026-09-26 07:2x-07:5x）

| 前置项 | 读数 | 判定 |
| --- | --- | --- |
| ① ⑹ L2 status 读数接线 | TriCode dist/trimodel-cli/env.js 含 TRIMODEL_L2_FLAG（mtime 07:19）；TriMLC dist/cli.js 含 l2FlagPath（07:23）；CLI 实测 `model status` 输出 `l2_flag = {"present":false}`（env 钉位形态）+version 0.2.0-wave3——**src 未提交（TriCode M×3+TriMLC M×1），已催 FSD** | ✅ 功能面绿 |
| ② cron job 实体 | GET /internal/v1/cron/jobs（token=daemon 启动 cmd，验讫）：trimodel-l2-scan everyMs=120000 enabled runCount=154；trimodel-l3-remind everyMs=1800000 enabled runCount=21；TRILC_CRON_COMMAND_ALLOWLIST 两串精确匹配在位；近 30 条执行全 ok | ✅ |
| ③ 沙箱钉位 | cron 链零钉位实锤：CronJob schema 无 env 字段+daemon 启动 cmd（trimlc-daemon-channel.cmd）env 无 TRIMODEL_CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG/L2_FLAG+stub 本体不设钉位；真 legacy 钥在位（~/.claude/settings.presets/.deploy-key 存在，per-provider .bigmodel 不存在）——现态落真 flag=读真钥写真活体（红线） | ⛔ 候 FSD 方案 A（CTO 已裁可+钉位清单五项） |

- CTO 裁可件：方案 A 采（daemon 启动 cmd 演练窗钉位+stop/start 纪律重启）；窗管理四条款（窗≤2h/出窗还原三读数/进窗知会+CEO 窗前必出窗/窗内真降级=意外实弹样本记读数）；钉位清单五项（PORT/ADMIN_TOKEN/CLAUDE_SETTINGS/AUDIT_LOG/DEPLOY_KEY 路径，转 FSD 落位核）；F1 先行裁可。

## F1 臂读数（kill 3333 → L1 重启实弹，2026-09-26）

基线（T0 前）：

- 3333 pid=16248（node，start 2026-09-22T11:41:19）；watchdog.log 尾行 `2026-09-26T07:51:35+08:00 revive attempt up=True rounds=0`（存量行，见观察-1）
- 真活体 settings.json hash=`491F33353D50F938B6B6DFD26CC8C7804500E10BE55AC52CAEBB6E633CD778B2` mtime=2026-09-25T04:09:35；flag 零落盘；唯一 keeper=TriModel-Watchdog 任务（无第二复活源）

断言表：

| 断言 | 读数 | 判定 |
| --- | --- | --- |
| 注入 kill | T0=2026-09-25T23:56:27.290Z（07:56:27 +0800）Stop-Process pid 16248；T0+2s 探活 FAIL（确认死） | ✓ |
| watchdog ≤70s 探活 fail→拉起 | 拉起行 `2026-09-26T07:57:01+08:00 revive attempt up=True rounds=0`——T0→拉起行=33.7s | ✓ ≤70s |
| health 200 恢复 | 2026-09-25T23:57:05.605Z（07:57:05 +0800）独立轮询 200——T0→up=38.3s | ✓ |
| log `revive attempt up=true` | 日志逐字在卷（上行） | ✓ |
| 进程重启=设计行为（L1 例外条款） | 新 pid=25208 start=2026-09-26T07:56:48（launch.cmd 链 `node dist\src\server.js` 拉起）；旧 16248 已终 | ✓ |
| L2 不误触发（首轮复活成功） | `.fade/trimodel-l2-flag` 零落盘（rounds=0<3） | ✓ |
| 真活体零接触 | POST hash 同基线逐字（`491F…78B2`），mtime 未动 | ✓ |

- health body 终态：`{"ok":true,"service":"trimodel","version":"0.1.0",...}`（service 身份字段在卷）。
- **观察-1（非本臂产物·存量）**：F1 前 07:51:35 有一条 revive 行（瞬时探活 fail 触发拉起，旧进程仍持 3333）——watchdog 拉起前不验端口持有者，重复拉起的新 node 会 EADDRINUSE 静默退出（探针仍见旧进程 up=True）。无害（fail-safe 方向），录档候 FSD 知悉；不阻本波。

## F2 臂读数（端口占位×3 轮 → L2 标记+cron 拾取+restore，2026-09-26 09:04-10:42）

注入技术线（三代迭代，如实记录）：

| 代 | 技术 | 结果 |
| --- | --- | --- |
| v1 | 普通 TcpListener 占 3333 | ✗ 被 node SO_REUSEADDR 二绑抢注（08:09:19 复活成功）——注入缺陷非产品缺陷 |
| v2 | ExclusiveAddressUse 独占+黑洞不 accept | ✗ PS5.1 IWR 对「可连不应答」-TimeoutSec 8 失控，一轮 probe 挂 ~35min（08:18:04→08:54:08）——观察-2 |
| v3 | 独占+accept 即关（快速失败） | ✓ L1 检测节律正常，本臂主注入（up 09:04:56，自限 09:25:08 释放） |

L1 检测+flag 链（✓）：

- T0''=2026-09-26T01:04:28Z（09:04:28 +0800）kill node pid 21544；09:04:56 squatter3 独占 3333（pid 40584，探针快速失败实证）
- rounds 节律：09:05:26 rounds=1（T0+58s）→每轮 3 败即写 flag，共六次 revive-exhausted 落盘：09:07:50 / 09:11:29 / 09:15:03 / 09:18:53 / 09:22:27 / 09:26:23；rounds 间隔均值 ~71s（60s 循环+8s 超时内+复探）
- 六次 flag 全部 reason=revive-exhausted detail=health down after 3 revive rounds（与 v3 watchdog 副本契约逐字一致）

cron 拾取链（✓ 拾取；✗ restore 执行——阻塞发现）：

- 拾取时延：flag#1 09:07:50→stub 首拾 09:08:07=**17s**；flag#2 09:11:29→09:11:48=19s；后续 flag 逐 tick 重试拾取（≤2min 节律）——cron 通道本身工作正常
- **restore 八连败（阻塞）**：09:08:07 / 09:11:48 / 09:14:59 / 09:18:37 / 09:21:22 / 09:24:20（revive-exhausted）+ 09:51:59 / 09:59:19（auth-dead，见发现-B）——`'node' 不是内部或外部命令` exit=1：**cron spawn 环境 PATH 无 node**，stub `cmd /c "node …"` 裸调必败；fail-closed 契约正确工作（八次全保留 flag 重试）
- 波③⑦ 接线成功样本（stub.log 05:53:56 restore-done exit=0）为桌面 PATH 上下文所跑——**接线验证环境盲区：桌面 PATH 有 node、daemon cron spawn PATH 无**
- drill-settings.json / drill-audit.log 从未产生——与 restore 未跑进 core 一致：**FSD 钉位在位但从未被触达验证**（restore 死在 node 解析层，env 键读不到）
- 双层探活自愈清 flag ✓：09:26:43（squatter 释放服务回后）clear-flag healthy；10:03:46（auth-dead 事件后）同

发现-B（非阻塞·机制观察·auth-dead 误报定性）：

- 09:50:10 `l2-flag reason=auth-dead detail=keys-unreachable`——非注入产物，意外实弹样本
- 定性：**keys 探针 8s 超时误报**。证据链：服务恢复后 watchdog 仍每 6-20min 出一轮 `revive attempt up=True rounds=0`（09:40:29/09:48:53/10:03:04/10:09:23/10:29:08/10:42:23）=probe 8s 线误判 down→拉起 node EADDRINUSE 静默死（观察-1 模式持续）→10s 复探撞上服务响应记 up=True；09:50:10 同源——health 200 过活分支后 keys 探针 8s 内未返回（服务慢响应）→连接层失败→auth-dead。现态 keys 探针 200 in 0.14s 带值（快照 10:2x）
- 影响：auth-dead 为跳 L1 直写 L2 的高权重信号，存在慢响应误报率；窗内真实记录，候 CTO/FSD 定改进（如 keys 探针重试二次确认）

出窗前快照（10:2x-10:4x）：

- 3333 listener pid=25784（node）；health 200；keys 200 五组键全带值（值面本卷不抄录，敏感掩码）；真活体 settings hash=`491F…78B2` 与基线逐字同、mtime 未动——**真活体零接触全程守住**
- 窗管理如实记：进窗 08:07，cap 10:07，F2 收证延至 ~10:45——**超窗 ~38min**（stub 八连败取证+log 全量回读耗时超预估），上报 CTO

## F2 臂小结（停臂候裁依据）

- 主注入链绿：L1 检测节律 / flag 落盘 / cron 拾取 / fail-closed 保留 / 自愈清理 / 真活体零接触 全 ✓
- **发现-A（阻塞·候 CTO 裁）**：L2 restore 经 daemon cron 通道功能不存在（spawn env PATH 无 node，八连实证）。修复归属 FSD（stub 显式 node 全路径或 PATH 补齐，同 launch.cmd PATH guard 模式）；修复前 F3/F4 链尾同踩此断点，硬走无验收价值
- 发现-B（非阻塞）：auth-dead 探针误报率实证一例（8s 超时线）
- 观察-2（非阻塞）：PS5.1 IWR -TimeoutSec 对「TCP 可连不应答/慢应答」失控（v2 黑洞 35min、v3 后 probe 误判循环）——L1 检测时延口径「≤70s」仅对 connect-refused 进程死成立

### 发现-A 根因实锤（10:3x 补勘）

- channel cmd L19-28：DRILL WINDOW 四钉位在位 ✓（CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG→Temp 沙箱、L2_FLAG→真 flag 路径）
- channel cmd L29-31：**PATH guard v2（2026-09-26 新加，FSD）**——`set PATH=C:\Windows\System32;C:\Windows;…\Wbem;…\WindowsPowerShell\v1.0` 瘦四段，**不含 C:\nvm4w\nodejs**。guard 修「daemon spawn(env-cwd) breaks」问题顺带钉瘦 PATH，漏 node 目录
- daemon（pid 45972）uptime 11018s→启动 ≈08:01:56 +0800（FSD 落钉位重启那次）——**瘦 PATH 自该刻起生效**
- 时间线自洽：波③ restore-done 成功样本 05:53:56 在 guard 引入前（daemon 旧 env 含桌面 PATH）；本波 08:02 重启后 09:08 首次 restore 即败，八连败全在瘦 PATH 窗内
- launch.cmd 拉起 TriModel 用 node 全路径（`C:\nvm4w\nodejs\node.exe`）故 L1 复活链不受 guard 影响；stub 裸调 `node` 独踩
- 修法建议（归属 FSD 裁）：PATH guard 行追加 `;C:\nvm4w\nodejs`，或 stub 改 node 全路径（一处改动任一即可，前者覆盖面更全）

### T2d 实弹改道（CTO 令「对照不等修复」候窗执行，11:1x-11:2x）

- 改道法：**USERPROFILE 沙箱 home 重定向**（env.ts L33/L51 homedir() 派生链全落沙箱；presets 数据源=defaultPresetsDir() 包内自洽 env.ts L82-88 不受影响）——原禁区（真 ~/.claude/settings.presets 布雷）解除，零生产钥目录接触
- 三案全 PASS（脚本 t2d-remap.ps1，沙箱 t2d-home-r2）：

| 案 | 断言 | 读数 | 判定 |
| --- | --- | --- | --- |
| T2d-r1 | per-provider 优先（.deploy-key.bigmodel 假钥 A + .deploy-key 假钥 B 并存） | exit=0，AUTH_TOKEN 值=A | ✓ PASS |
| T2d-r2 | 删 A → legacy 回落 | exit=0，AUTH_TOKEN 值=B | ✓ PASS |
| T2d-r3 | 双缺 → fail-closed | exit=1，`FAIL [DEPLOY_KEY_MISSING]`，报错勘验位=per-provider 路径（源序首位缺源） | ✓ PASS |

- 对照账更新：**20 实弹 PASS + 5 MAPPED + 0 FAIL**（T2d 出 MAPPED 入实弹；其余 MAPPED 不变，T4d 仍候 F3 实弹回填）
- 值面观察：DEPLOY_KEY_MISSING 报错引源序首位路径（勘验友好）；credentialGate 对两假钥（32 字符）放行正常

### 事故卷·F2 补验门三注：restore 写真活体（2026-09-26 12:27-12:33，红线破，全臂停）

### 注入迭代全记录（三注两败因，如实）

| 注次 | T0 | 结果 |
| --- | --- | --- |
| 一注 | 03:50:32.748Z kill 25784 | ✗ squatter3 启动即退（37ms，elapsed=0s）→3333 空窗→watchdog 11:51:06 拉 node 复活（pid 17828） |
| 二注 | 03:53:48.477Z kill 17828 | ✗ squatter4 持口后**被工具超时树杀连带**（注入命令 45s 超时被杀，Start-Process 子进程在 job object 内）→3333 空出→watchdog 拉起 node 16252（11:54:41 起，11:55:46 bind 成）→11:55:55 recovered |
| 三注 | 04:27:35.041Z kill 16252 | ✓ squatter4（pid 22928）up 12:27:37.766（tries=2，bind 重试环两窗皆立功），8s/38s 双查持口稳定 |

- 一注即退根因：bind 早于 node socket 清理窗完成（kill 后 ~2s bind 撞 AddressAlreadyInUse，v3 无 try-catch 连锁）；v3 首窗成功=kill→bind 间隔 28s（工具往返自然延迟）。修法=squatter4 bind 重试环（3s×40）✓ 两窗实证
- 二注树杀根因（**新方法论教训**）：Start-Process 长活注入器必须与工具命令脱钩——工具超时树杀连带灭注入器。修法=注入命令短平快即返（kill+Start 无等待）✓ 三注实证
- 二注敌情勘误：server.js L134 listen 无 error handler→EADDRINUSE 时 node 静默崩退（main().catch 接不到 listen error 事件）——无重试逻辑，敌人行为模型简化

### 三注链路读数（L1/L2 全绿至 restore，然后破线）

- T0''=12:27:35 → rounds=1 12:28:05 / rounds=2 12:29:16 / rounds=3 12:30:27（71s 节律与首窗一致）→flag 12:30:27 落盘 revive-exhausted（T0''+172s）
- cron 拾取→**12:32:48 restore-done exit=0**（stub.log：`OK [RESTORED] 兜底直连已写入…restored={base_url:open.bigmodel.cn/api/anthropic, model:glm-5.3-flash, keys_written:[ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_T…]`）——**发现-A 修复端到端实证 ✓**（flag→restore-done=2min21s）
- flag 12:32:48 restore 成功即清（stub 契约 ✓）

### 红线破读数

- **真活体 settings.json：hash d7a565ca…8967f≠基线 491F…78B2，mtime=12:32:55**（restore 后 7s）——**钉位未生效，restore 写了真活体**
- 写入值面：base_url=open.bigmodel.cn/api/anthropic+model=glm-5.3-flash+AUTH_TOKEN=真 legacy 钥（head 4cb055b683 len 49）+API_KEY 双载体同值（F-1 形态顺带实证）——**合法恢复配置，非垃圾**，但覆盖基线
- 备份在位：settings.json.bak-2026-09-26T04-32-55-927Z（2046B=基线大小）——回滚能力完整，core 备份先行门 ✓
- 真 .deploy-key 零接触（mtime 2026-09-25 23:40 不变）✓
- 钉位触达断言：drill-settings.json/drill-audit.log **零产生**（#5/#6 FAIL）+DEPLOY_KEY 钉位未达（写的是真钥非假钥）
- 根因方向：cmd 文件钉位在位（11:50 亲验）但 daemon env 无钉位；同链 PATH guard 却生效（node 可达）——强疑 FSD 第二刀 daemon 启动方式未走 channel cmd 正身，候 FSD 对质

### 根因定谳（FSD 勘验五项闭环，CTO 通报；本节落盘 2026-09-26T06:12Z 前后）

- **根因：channel cmd 两刀 DRILL 注释行含中文全角字符→cmd GBK 解码吞行→紧随的四条钉位 set 行被吞→daemon env 四键 ABSENT（PEB 直读 128 变量实证）→stub env 同 ABSENT→发现-A 修复后 node 可达，restore 首次真执行即走缺省真路径（写真活体）**
- 三读数全闭环：drill 产物零（CLAUDE_SETTINGS/AUDIT_LOG 未达）+写真活体真钥（DEPLOY_KEY 未达）+node 可达（PATH guard 纯 ASCII 行未被吞）
- **教训族新成员**：ps1 中文须 UTF-8 BOM 的姊妹坑——**cmd 批处理注释禁中文全角（GBK 解码吞行，且吞的是「下一行」级破坏）**；「键存在性抽验≠值面验证」再证：文件面在位（grep 命中）≠进程 env 到位（PEB 实勘）
- 定责三分已落树：FSD 主责如实自认/枢纽验收门 CTO 共担（只收文件面读数）/治理面纪律成文修正
- **窗条款增补（CTO）**：进窗知会必含 daemon 进程 env TRIMODEL_* PEB 实勘读数（新硬门）
- 振荡循环观察项挂候办（flag 重写节流/占口清除联动，波④ 收尾裁）

### 回滚后自转观察（STE 只读巡检 06:12:21Z / 14:12+08）

候第三刀期间只读巡检，三项基线复验 + 回滚后事件链溯源：

**基线三绿**：
- 真活体 hash=`491f…78b2` 基线 ✓（sha256sum 全量复算）；mtime=13:45:18.983+08 = 本席回滚 copy 留痕时刻吻合（非新写入）
- L2 flag 不存在 ✓（13:17:19 已清，其后 watchdog log 无新 l2-flag 行）
- squatter 已退 ✓（state 尾行 down 12:47:37 elapsed=1200s=**自限到期自然退出**，非 release flag 触发；release-3333.flag 12:48 touch 为冗余保险，留置不动——squatter4 启动首行自清）

**回滚后事件链（watchdog/stub 生产日志读数，全部自愈零真活体接触）**：
- 13:17:00 watchdog 写 l2-flag reason=auth-dead **detail=keys-unreachable**（3333 node 活着但 keys 探针不可达，单次）
- 13:17:19 cron 拾取→stub 双探全绿→clear-flag verdict=healthy（19s 闭环；daemon 四键仍 ABSENT 未修，但 stub 走 clear 分支未触 restore）
- 13:23-14:11 三次间歇探活失败（rounds 1-2，未到 3 轮阈值）：13:23:42/13:25:12→13:26:42 recovered；13:54:07→13:55:52 recovered；14:10:30→14:11:34 recovered。零 flag 零 restore
- **安全网论证**：回滚后 settings.json 内容==restore-direct 目标态（bigmodel 基线），即使误触发 restore 也判 ALREADY_SAME 零写入（振荡期已实证）——真活体现处收敛不动点

**发现-B 补证（挂账设计输入）**：watchdog 将 keys-unreachable（连接层失败）归入 auth-dead flag 路径——与 F2 期「auth-dead 8s 超时误报」同族；F3 误报率补厚读数直接设计输入：误报族=keys 不可达/超时均被归 auth-dead，恢复闭环判定存在域差（restore 写文件不作用于 env 键面）。

**结论**：全停期系统自转全部自愈，无需干预；零动作纪律维持正确。候第三刀知会。

1. 候 FSD 第三刀（注释全 ASCII+重启纪律+PEB 实勘四键 present 知会）
2. STE 独立复验 PEB 读数→进窗（窗计时随第三刀重起）
3. F2 补验门重跑（10 断言表仍有效）→F2 闭臂→F3（auth-dead 误报率补厚）→F4→F5→终报

- **F2 补验门 FAIL**（#1-#4 #7-#9 绿；#5/#6 FAIL；红线破一票否决）
- **F3/F4/F5 全停**（沙箱隔离前提不存在）；已上报 CTO 候裁：回滚授权+根因勘验分工
- 真活体现态 STE 零动作候令

### 第三刀进窗核验（STE 独立复验 06:2xZ，全绿）

- **PEB 独立复验（硬门自验，非转抄）**：pid 33328（netstat 8713 LISTENING 对表）total_vars=132；四钉位全 PRESENT 且路径与 channel cmd L20-23 逐字一致（CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG=%LOCALAPPDATA%\Temp\trimodel-drill-*、L2_FLAG=.fade\trimodel-l2-flag）；API_TOKEN len=64 a5cb***13a7 头尾与 L9 正身件吻合；TRILC_PORT=8713、CRON_COMMAND_ALLOWLIST=stub+toast 双命令精确匹配 L27；PATH_nodejs_present=True（发现-A 修复在位）
- 文件面：channel cmd 第三刀版全 ASCII（LC_ALL=C 扫描 VERIFIED）；DRILL 窗块 06:06Z 版；L32 留 GBK 教训注记行；L34 where node 哨兵在位
- 根因勘正采认：真凶=Start-Process ShellExecute 幽灵参形态（FSD 自翻案，CTO 勘正采认），非 GBK——GBK 定谳节按勘正降为「共现风险修正项」（文件面纯 ASCII 化保留为防再发纪律）
- 进窗基线：真活体 hash=491f…78b2 ✓；drill 产物零残留 ✓（初查 D:\tmp 误路径，已纠正为 %LOCALAPPDATA%\Temp 实路径复查）；drill 假钥在位（52B head=drill-sand）；daemon pid==33328 自检点 ✓（CTO 新增自检点：pid 变即停候 PEB 重验）；watchdog 复活形态风险在案（ps1:29 旧形态丢钉位）
- 窗计时：06:15:25Z 起 cap 至 08:15:25Z（14:15+0800 起）

### 执行序（CTO 令，随第三刀进窗）

1. F2 补验门重跑（10 断言表仍有效，#4/#5/#6 核心：restore-done + drill-settings/audit 首次产生 + hash 零变化）——hash 随臂随验
2. F2 闭臂→F3（刻意补厚 auth-dead 误报读数）→F4（30min 节律+toast 四要素）→F5
3. 异常即停上报不硬走；窗毕出窗义务照条款

### F2 补验门重跑（第三刀后，窗 06:15:25Z 起 cap 2h）

- 前置自检全绿：daemon pid==33328 / PEB 四钉位独立复验 PRESENT / hash 491f…78b2 / drill 产物零残留 / 假钥在位 / ASCII 复验过（见「第三刀进窗核验」节）
- **#1 注入 PASS**：14:35:12+08 kill pid=39292（Get-NetTCPConnection 实取 3333 LISTENING）+squatter4 启动（bind 重试环 3s×40 版），短平快即返零等待
- 监控挂起（Monitor 事件流，stub log 基线行数去重防旧 restore-done 误触发）：E1 flag 写出→E2 drill-settings 首次产生→E3 restore-done
- 事件流实测：E1 flag 06:38:27Z（watchdog log 实写 14:38:20+08）→E2 drill-settings 06:38:38Z（audit 实记 06:38:38.749Z）→E3 restore-done 06:38:48Z

**10 断言全表 PASS（06:42:32Z 定谳）**：

| # | 断言 | 读数 | 判定 |
|---|---|---|---|
| 1 | 注入占位 | 14:35:12 kill 39292+squatter4 up 14:35:42（tries=2，bind 重试环生效） | PASS |
| 2 | L1 三轮写 flag | 14:35:58 r1→14:37:09 r2→14:38:19 r3→14:38:20 l2-flag reason=revive-exhausted | PASS |
| 3 | cron 拾取 | flag 14:38:20+08 → CLI 完成（audit 06:38:38.7Z）≈19s | PASS |
| 4 | restore-done | 14:38:24+08 exit=0 note=flag-cleared-after-restore，restore-output=OK [RESTORED] 新建文件 | PASS（核心） |
| 5 | drill-settings 首次产生+值面 | 文件产生；AUTH_TOKEN==假钥 **True**（drill-sandbox-fake-key…DO-NOT-USE）；base_url=bigmodel 直连；11 键全模型族 | PASS（核心） |
| 6 | drill-audit 首次产生+零钥材料 | 145B；backup=new-file assert=pass keys=11；real_token_hits=0/fake_key_hits=0 | PASS（核心） |
| 7 | flag 清 | l2-flag 不存在 | PASS |
| 8 | 真活体 hash 零变化 | 491f…78b2 中段+终验双验一致 | PASS（红线） |
| 9 | 释占位复位 | release 14:40:46→squatter down 14:40:47（1s）；watchdog 14:41:59 up=True；3333 http=200 复活（新 pid 30096）；daemon pid 仍==33328 | PASS |
| 10 | 时延读数 | t0→flag=188s；flag→restore≈19s；全链≈209s（对比事故轮 8min+ 且破线）；释占→3333 复活≈73s | 读数在案 |

**观察项 O-3（新）**：stub log 行内时刻（14:38:24+08）早于 audit log CLI 完成时刻（06:38:38.749Z）约 14s 倒挂——时钟面/时间戳生成源待勘；核心断言由文件值面+audit 面+hash 面三独立面锚定不受影响。候选办。

**钉位触达实证定谳**：drill-settings/drill-audit 首次产生+值面假钥=TRIMODEL_CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG 三钉位已作用于 cron spawn 链（事故轮「应产生而从未产生」的对偶闭合）；restore 路由 drill 沙箱，真活体零接触。

**F2 补验门=PASS，F2 闭臂（14:42+08）**。接 F3。

## F3 臂读数（沙箱空钥 3334 副本 → auth-dead 跳 L1 直 L2，14:44-14:5x）

CTO F2 闭臂签认+F4 并行裁可（四边界）已接：F4 本体不省、仅借 F3 flag 期 toast 时戳序列算节律、样本来源分列、超窗有因报。

**注入件与键源链勘误（实测两迭代，如实）**：

| 迭代 | 设计 | 结果 |
| --- | --- | --- |
| v1 空钥 env | 清 TRIMODEL_* 后起副本 server（预期 keys 空值/401） | ✗ keys 200 带值——PEB 直证副本进程 env：API_TOKEN/ADMIN_TOKEN（.env 真值）被 import 链 dotenv 自载写回进程 env 块；card 键源同在。env 清空法不可达空钥态 |
| v2 错值 token | 显式设 TRIMODEL_API_TOKEN=错值（dotenv 不 override 已有进程 env）→探针带 .env 真值→401 | ✓ health=200+keys 401（keys_probe 同）→keys-401-auth-dead 分诊达成（joint-plan「401/空值」401 分支） |

- **机制勘误定性（键源链）**：TriModel server import 链存在 dotenv 自载（TriModel/.env 四键+疑似 D:\Code\ai\.env 的 TRILC_* 键同被载入）——「keys 探针读服务进程 env」的 env 是 dotenv 注入后的合成块，非启动继承原块；空钥态模拟必须走 token 错值/鉴权失败路径，键值清空不可达
- 副本 watchdog（f3-watchdog.ps1，派生生产 v3）：判定表三分支/轮计数/flag 契约逐字保留；差异仅环境参数（探针 3334/Mutex DrillF3/launch 抑制留痕/log 独立 f3-watchdog.log）——生产件零触碰
- 副本 server 3334：TRIMODEL_PORT=3334+错值 token，其余空——生产 server.js 原身（pid 39832→重起后新 pid）

**主断言读数**：

| 断言 | 读数 | 判定 |
| --- | --- | --- |
| SelfTest 分诊 | alive=False why=keys-401-auth-dead（探针带真 token→401） | ✓ |
| **跳 L1 直写 flag** | 14:50:22 副本起→14:50:24 l2-flag reason=auth-dead detail=keys-401-auth-dead——**2s 直写，log 零 revive attempt 行**（L1 轮次零触发实锤）；flag JSON 契约格式对表 ✓ | ✓ 主断言 |
| cron 拾取→stub 分诊 | 候监控（stub 探 3333 现势，预期 clear-flag healthy/restore 不执行=3333 中心语义实证） | 候读数 |
| 误报率补厚（发现-B 定量） | 3333 正常态 keys 探针 30 连发：alive=True ×30，**FALSE_COUNT=0/30**；时延 61-253ms 主体+1028ms×1+**22394ms×1（尾部 3.3%>8s 线）** | 读数在案 |

**发现-B 升级素材（O-4·探针超时线不可信）**：采样器 TimeoutSec=8 下出现 22.4s 才返回的成功响应——IWR TimeoutSec 失控族（观察-2 同机理）在生产探针路径实锤：慢响应时探针既可能 8s 超时误判死（发现-B 原形态），也可能失控挂 22s+ 才返回；3.3% 尾部延迟率≈潜在误报率上界。keys 探针重试二次确认+超时机制换实现（HttpClient 计时）候正式启用门禁并入。

**cron 拾取链实弹（14:53:27，预判反转如实记）**：

- STE 预判：stub 按 3333 现势（健康）走 clear-flag 分支，restore 不执行——**实测相反**：stub 跑了 restore（ALREADY_SAME exit=0 reason=auth-dead note=flag-cleared-after-restore）
- 根因实锤（O-5·新）：stub 探活（L33-49 写死 3333 双层）撞 **3333 周期性慢响应窗**——收臂批复验：health3333=FAIL（5s 败）+keys3333=200 耗时 **12535ms** 同批；生产 watchdog 同窗 14:54:34 up=False rounds=1→14:55:39 recovered 同源；采样批尾部样本 22394ms 同族——**3333 慢响应尾部 12-22s 实测，5-8s 探针超时线必撞**
- 影响面定性：误判→restore 提前触发。演练场景（flag 源=3334 副本）restore 落 ALREADY_SAME 零写入无害；生产语义 restore 本为「服务异常→恢复真活体」设计内动作（幂等+备份先行+五门+fail-closed）——**fail-safe 方向，非破线**；但「误报触发恢复率」非零（30 发 3.3% 尾部+stub 实弹 1 次）=发现-B 影响面自 L1 探针扩及 L2 stub 探活层（共享同一 8s 不可信超时机制）
- **发现-D 实弹定性（对 CTO 预案）**：恢复闭环以 3333 单例为中心——flag 源实例（演练模拟物 3334）的 auth-dead 态不在闭环内（副本恒 401 直至收臂被杀）。生产拓扑仅 3333 一个业务实例，flag 源必为 3333 自身探针——**「源实例不闭环」是演练域差非生产缺口**；真正生产风险=O-4/O-5 误报族。转 CPO 定性材料据此口径
- 副本 watchdog 循环形态读数：60s 节律 6 连写 auth-dead（14:50:24→14:55:36），幂等重写无害（flag 写/清循环与 F2 振荡同构，restore ALREADY_SAME 零写入兜底）

**O-3 定谳**：stub log 行内时刻=$ts（L16 脚本启动时刻）贯穿全部行——restore-output/done 行时刻=stub 启动时刻非写入时刻，14s「倒挂」即此；非时钟漂移非缓冲。候选办撤销，改记口径注记。

**F3 收臂净读数（14:56:39）**：副本 watchdog pid 48020 杀净；3334 server pid 28148 杀净；flag 零残留；3333 复位中（慢响应窗过后 recovered）。

**F3 臂判定：主断言全 ✓（跳 L1 直写/拾取/restore 链/flag 契约/误报率定量），闭臂（14:56+08）**。25/25 对照：T4d（备份轮换 keep=5）候 F4 手动 restore 实弹回填。接 F4。

## F4 臂读数（drill key 缺失 fail-closed + L3 toast 实弹 + 30min 节律，15:0x-）

CTO F3 签认+O-5 升级门禁主条+发现-D 下修半格（生产振荡语义：restore 写文件后运行中 3333 env 快照不重读→探针仍 auth-dead→flag 重写循环——恢复不达成的语义缺口，候收尾裁）已接。

**注入法定谳（先读源码挡险）**：defaultDeployKeyPath（env.js L37-52）——env 值 trim 非空即**路径直返**（不看文件存在性），文件缺失→读失败→fail-closed；回落 legacy 仅 env 值为空时。STE 初判「移文件会回落真 legacy 钥」系误读 T2d-r2 前提（r2 是 env 未设态）——源码对表后注入法安全：**重命名 drill key 文件**（可还原）。

F4 注入态（全真链）：重命名 drill key+squatter4 占位 3333→watchdog 三轮真实写 flag（revive-exhausted）→cron 拾取→stub restore→**DEPLOY_KEY_MISSING fail-closed exit=1**（flag 保留）→l3-remind tick（≤30min）+3333 探活败+flag 在→**toast 实弹**。toast 弹出条件勘务：l3-toast.ps1 双层探活失败+flag 在才弹（双绿=清 flag 安静退出）；l3-toast.log 历史仅 1 条 clear-flag（01:06 波③期），**toast-shown 从未实弹**。

### F4 预检与注入实录（15:08-15:13+08）

预检六项（15:08）：真活体 hash=`491F…78B2` 逐字基线 ✓；daemon pid==33328 自检点 ✓（cmd-match=TriMLC）；drill key 在位 ✓；flag 零残留 ✓；基线 stub=36/toast=1/wd=134 行在卷。

**环境活体观察（O-5 族又一实例，留卷）**：注入前 3333 health 8s 超时一次，25s 长超时重试=200@4017ms（慢尾非死，listener pid=30096 稳定）；生产 watchdog 日志 15:04:52 rounds=1→15:05:59 recovered→15:10:39 up=True rounds=0→15:12:05 up=False rounds=1——服务活着、探针撞慢尾、rounds 反复清零重计，与 F3 期生产同窗表现同源。rounds=1 环境先行风险已评估：任何先行 flag 撞上的也是 fail-closed 链（key 先移），断言不变。

**注入批 15:13:03Z**：drill key 重命名 `.f4-removed`（renamed=True，可还原）→kill 30096（SUCCESS）→squatter4 up（pid=48628，tries=2，exclusive，port_owner=powershell/48628）→health 拒连 ✓。

**l3-remind 相位读数（cron API `/internal/v1/cron/jobs`）**：name=trimodel-l3-remind，schedule.kind=every，**everyMs=1800000**（30min 定谳），enabled=true，runCount=36，errorCount=8（历史错误 8 次留观察），lastRun=07:01:08Z，**nextRun=07:30:00Z 自然 tick**——F4 toast 走自然调度链触发（非 force），因果态完整绑定。运行史（cron log）：07:01:08→06:30:14→06:00:01→05:31:57→05:01:12→04:30:07→04:00:30→03:31:35 全 status=ok——**节律证据=scheduler 历史 8 时点等间隔 ~30min+jobs 配置 everyMs=1800000 双源**；F3 期 flag 窗（06:50-06:56Z）内零 tick（最近 tick 06:30/07:00 均在窗外）与「F3 无 toast」互证。CTO 边界③标注：节律样本来源=**F4 期 scheduler 历史+配置**，F3 期=零样本（如实记）。

**E1 flag 写出 15:14:29+08**：`{"detail":"health down after 3 revive rounds","reason":"revive-exhausted","ts":"2026-09-26T15:14:29+08:00"}`——真实 watchdog 链（launch.vbs 真发+复探三轮），注入后 86s 达成（环境先行 rounds=1 加速归因，预判在卷）。候 E2 stub 拾取（l2-scan ≤2min）。

**E2 stub fail-closed 15:16:01+08（F4 核心断言闭环）**：
```
L2STUB | 2026-09-26T15:16:01+08:00 | action=restore-output | detail=FAIL [DEPLOY_KEY_MISSING] 独立钥文件未落位（C:\Users\jedih\AppData\Local\Temp\trimodel-drill-deploy-key.txt）。请先完成部署日供钥步骤，或改用手填密钥。 provider = bigmodel
L2STUB | 2026-09-26T15:16:01+08:00 | action=restore-failed | cmd=trimlc model restore-direct --provider bigmodel | exit=1 | reason=revive-exhausted | note=fail-closed-flag-kept-retry-next-run
```
断言三中：①**DEPLOY_KEY_MISSING fail-closed exit=1** ✓（detail 明指 drill 路径=env 钉位路径直返实锤，**未回落 legacy 真钥**——T2d-r2 回落路径在 env 钉位态下不可达，代码审读推论 15:0x 定谳获实弹印证）；②**零半写** ✓（drill-settings mtime=14:38:34 早于注入 33min+hash=A3C1C8A345DF… 未动——fail-closed 拒在钥读取阶段）；③**flag 保留** ✓（内容原样 15:14:29 版）。无 restore-done 红旗。

**新观察（O-6 候录）**：DEPLOY_KEY_MISSING 拒绝不落 drill-audit.log（audit 尾条仍=06:53:45Z F3 期 ALREADY_SAME）——presets 阶段拒绝早于 io-kernel audit 写点，fail-closed 唯一留痕=stub log 行。审计可见性缺口：L2 链失败若 stub log 丢失则无审计回溯。候办族=审计可见性（与发现-A stub log 单点同族），不阻本臂。

### F4 toast 实弹+收臂+T4d+F5 终卷（15:30-15:45+08）

**E3 toast 实弹 15:30:23+08（l3-toast 历史首弹）**：自然 tick 触发（nextRun=07:30:00Z，实际派发 15:30:23=23s 调度延迟），`L3TOAST | action=toast-shown | verdict=unhealthy health=False biz=False`——因果态完整绑定（flag 在盘+3333 双探皆败）。**文案四要素逐字**（l3-toast.ps1 L46-51 源码转录）：
1. `TriModel 配置服务自动恢复没有成功`
2. `您正在使用的 AI 服务不受影响；自动恢复已多次尝试未通过，需要您手动恢复一次`
3. `复制下面这条命令粘贴到 PowerShell 回车即可：powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Code\ai\TriCompany\scripts\ops\local\restore-claude-direct.ps1"`
4. `想先看现状，可运行：powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Code\ai\TriCompany\scripts\ops\local\restore-claude-direct.ps1" -UseKnownGood`

**截图环境限制（如实记）**：CopyFromScreen 两次捕获均纯黑帧（attempt2 像素探针 distinct=2 定谳，PNG f4-toast-screenshot-*.png 两件在卷）——显示态熄屏/锁屏环境限制，非捕获逻辑错。证据降级=toast-shown log 行（ps1 于 Show() 后自写）+源码四要素逐字+因果链时戳。视觉重弹候办：cron force-run（`POST /internal/v1/cron/jobs/cron_muh6vt2l_kkyo/run`）+显示就绪时补拍，注入态可复刻。

**fail-closed 重试耐久（15:16-15:34）**：stub **11 连 DEPLOY_KEY_MISSING**（~2min 节奏 15:16/15:18/15:20/15:22/15:24/15:26/15:28/15:30/15:32/15:34+15:16 首轮）全程 exit=1+flag 保留——`fail-closed-flag-kept-retry-next-run` 语义 18min 实弹耐久，较 F2 期 8 连失败族更长序列。

**自然恢复白赚实弹**：squatter 15:33:08 自限退场（elapsed=1201s 恰自限）→watchdog 15:33:35 launch.vbs 真复活 up=True（新 node pid=42764，health 200）——F4 注入态下真 L1 revive 完整走通。

**T4d 备份轮换 keep=5 实弹回填（stub 真链代执行，15:36:01）**：还 key+批 A 漂移（glm-5.3-flash→drift-f4-model 9 处+预置 5 旧 bak 错开 mtime 14:46→15:26）→stub 下一 tick 真刀恢复：`OK [RESTORED]`+restore-done+flag 清除；生真 bak（07-36-10-999Z@15:36:01）+**audit `assert=pass result=ok detail=keys=11 rotation_removed=1`**+**post bak count=5**（最旧 14-01 被轮换删 ✓）。批 B 手动 restore-direct=收敛二重验证（`ALREADY_SAME` idempotent-short-circuit audit 07:36:28 在案）。F5 status 侧写：`backups={"count":5,"keep":5,"sentinel":false}` 独立印证。

**新观察（O-7 候录）**：model status 探针 daemon-healthz 默认打 8711，遇 service=trirlc（双控制器语义 8711=TriRLC 合法在位）→PROBE_DEGRADED；`TRILC_PORT=8713` 注入后转 OK（daemon env 本有 8713，stub 链不受影响）——手动 shell 漏带 env 所致+默认端口对双控制器部署欠妥，候办级。

**F5 臂读数**：restore-direct 收敛（ALREADY_SAME）+status 双跑：首跑 PROBE_DEGRADED（O-7 根因=TRILC_PORT 缺省 8711）→修 port 重跑 **`OK [OK]`** exit=0：current=canonical（bigmodel·glm-5.3-flash）、daemon-healthz:8713 up healthz 200@63ms、backups 5/5 sentinel=false、presets count=2 deployed=[bigmodel] load_errors=[]。**L4 全绿闭环**。

### F4/F5 闭臂判定（15:45+08）

**F4 判定 PASS**：注入法推理链（env 直返→缺文件 fail-closed 不回落）获实弹全印证；toast 历史首弹因果态完整；30min 节律双源（everyMs=1800000+scheduler 史 8 时点等间隔）；真 L1 revive 白赚；T4d 实弹回填（stub 链 rotation_removed=1）。瑕疵面：截图纯黑帧（环境限制，降级证据三件套在卷）；O-6（key 缺失拒绝无 audit 留痕）；O-7（status 探针默认端口）。
**F5 判定 PASS**：status 全绿+收敛不动点+审计 idempotent 留痕。
**真活体红线终验**：hash=`491F…78B2` 逐字基线 ✓（五臂全程零接触守完）；flag 零残留；daemon pid==33328 全程稳。

**25/25 对照账更新**：T4d MAPPED→**实弹 PASS 回填**；T2d 代码映射+**F4 env 分支实弹印证**（缺文件 fail-closed 不回落 legacy）；现账=**21 实弹 PASS + 4 MAPPED 处置（T2b/T4b/T4c/T4e）+ T2d 映射+分支印证 + 0 FAIL**（计口径候 CTO 终验收）。

**T4d 备份轮换设计定谳（候 F4 收臂实弹）**：io-kernel.js L38-62 rotateBackups——prefix=`${path}.bak-`、mtime 降序、keep=`BACKUP_KEEP=5`（pure.js L17）、FROZEN-BACKUPS 哨兵豁免（防回滚锚自毁）。断言形：drill settings 同目录预置 5 旧 bak（错开 mtime）→漂移 restore 生第 6 份→轮换删最旧 1 份→post count==5+最旧被删+新 bak 在位。restore 命令=stub L64 同款 `node <trimlcCli> model restore-direct --provider bigmodel`，drill env 三钉位手动注入本席 shell（非 daemon 块）。

### 振荡循环与切断（12:36-12:48）

- restore 后 squatter4 仍占口（1200s 自限未到）→watchdog 每 3 轮重写 flag→cron restore **ALREADY_SAME 幂等短路**（exit=0 零写入）→清→再写：12:36:17/12:39:49/12:46:01 三轮振荡——**真活体零再写实锤**（双时点 hash 均 d7a565ca，mtime 恒 12:32:55）——core 幂等门实证 + 事前预判的「flag 振荡」形态真实发生（发现-D 挂账强化）
- STE 主动 touch release-3333.flag 切断：squatter4 down 12:47:37（elapsed=1200s 自限+release 双至）→watchdog 12:48:17 up=True rounds=0 复活（新 pid 39292）——系统恢复原态

### 回滚执行（CTO 事故令①授权，13:45 落地）

| 程序步 | 读数 | 判定 |
| --- | --- | --- |
| ① 预验（无人再动） | pre-mtime=2026-09-26 12:32:55.930547100（==事故写入时刻） | ✓ |
| ② copy bak-2026-09-26T04-32-55-927Z → settings.json | copy OK | ✓ |
| ③ 后验 | **post-hash=491F…78B2 基线逐字恢复**；size=2046；post-mtime=2026-09-26 13:45:18.983412000（copy 时刻留痕） | ✓ |

- 执行插曲留痕：PS 通道首试 143 超时未落盘（文件零损，mtime 未变），改 bash 通道完成——PS 工具当日三次 143 异常已录
- 回滚后现态：真活体=基线 ✓；3333 复活健康（pid 39292）；squatter/flag/release 零残留；**全停维持（新窗作废）**，候 FSD 勘验+根因定性

## 出窗还原核验（STE 独立验，2026-09-26 11:45 +0800）

FSD 第一刀（出窗+发现-A 修复合并，一次重启，daemon 新 pid=20004）毕，STE 独立核验读数（不转抄，独立复测）：

| 核验项 | 独立读数 | 判定 |
| --- | --- | --- |
| ① healthz | 200，service=trimlc，uptime 304s（反推启动 ≈11:40:47 +0800，与 FSD 重启时刻吻合） | ✓ |
| ② cron 拾取态 | 两 job enabled=true；l2-scan runCount=233 / l3-remind=29（与 FSD 报逐字一致=独立印证） | ✓ |
| ③ 钉位键零残留 | channel cmd grep `DRILL\|TRIMODEL_\|set PATH`：DRILL WINDOW 块零命中；TRIMODEL_ 仅 L9 TRIMODEL_API_TOKEN（LG-033 v3 正身件非钉位） | ✓ |
| ④ guard 修复面（加验） | PATH guard 行尾 `;C:\nvm4w\nodejs` 在位（L23） | ✓ |
| ⑤ 真活体 hash | `491F…78B2` 基线逐字同 | ✓ |
| ⑥ flag 残留 | 零（已自愈清态维持） | ✓ |

- 出窗态成立。修复的 restore 实弹验证（node 可达端到端）候新窗补验门 #4 断言承载——文件面哨兵（FSD 报 channel.log 'node unreachable' 0 行）与实弹双层。
- 候 CTO 新窗令→FSD 第二刀（重落四钉位→重启）→STE 进窗执行补验门断言表。

| # | 断言 | 预期读数 |
| --- | --- | --- |
| 1 | 注入 | kill 3333 node（T0 现查）+squatter3 独占 accept-close（复用 v3 验收脚本） |
| 2 | L1 三轮耗尽 | rounds=1/2/3（间隔 ~71s）→flag revive-exhausted 落盘 ≤4min |
| 3 | 拾取 | flag→stub 拾取 ≤2min+10s（cron tick 相位） |
| 4 | **restore-done（发现-A 修复实证）** | stub.log `action=restore-done exit=0` 本波首现——node 经 guard 修复后可达 |
| 5 | **drill-settings 首次产生（钉位触达实证）** | Temp\trimodel-drill-settings.json 产生：11 键族+值面断言 AUTH_TOKEN==Temp\trimodel-drill-deploy-key.txt 内容（沙箱假钥非真钥） |
| 6 | **drill-audit 首次产生** | Temp\trimodel-drill-audit.log AUDIT 行（who=trimlc-cmd）+零钥材料断言 |
| 7 | flag 清 | restore 成功后 flag 移除（stub 契约） |
| 8 | 真活体零接触 | settings.json hash==491F…78B2 基线逐字 |
| 9 | 释占位复位 | release-3333.flag→watchdog 复活→health 200（service=trimodel） |
| 10 | 时延读数 | 拾取时延/restore-done 时延两值入卷 |

- 通过判据：#4/#5/#6 为本补验门新增核心断言（F2 首跑不可达项）；任一不符→停臂上报不硬走。

## 25/25 对照（R1 首过完成，2026-09-26 08:0x-09:0x）

- 基线：ste-reverify-report.md（incident-sde-settings-01 树）25/25 @ f887b27，R5 终跑 110015。
- 重跑对象：`node D:\Code\ai\TriMLC\dist\cli.js model restore-direct`（core 路径=TriMLC bin 实链，与 stub 生产调用同形）。
- 沙箱根：`D:\tmp\ste-wave4\map25\`，逐案独立目录+逐案 env 钉位（CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG 三键全案钉沙箱；零触真钥目录）。
- **结论：19 直接重跑 PASS + 6 MAPPED 处置 + 0 FAIL**（对照表全文候终报；MAPPED 逐条 disposition 如下，一条不丢）：
- **【15:44+08 波④ 验收更新】CTO 五门全 PASS 签认（正身=wave4-acceptance.md @ 1f7c17ba）**。计口径终裁：**21 实弹+4 MAPPED（各附 disposition）+T2d 代码映射=25 条全账零丢零 FAIL**——MAPPED=形态迁移处置非跳过，防线继承铁律达成（波③ 门① 半闭项收口，退役前置条件达成）。toast 截图降级证据三件套接受；O-6/O-7 候办录档、O-3 口径注记、O-5 升正式启用门禁主条。白赚两笔（真 L1 revive+T4d 轮换实弹）正面记档。

## 出窗独立核验（STE 核验位，15:54:35+08 现查）

FSD 五步出窗报（删 DRILL 块/修 watchdog ps1:29 显式 cmd /c 形态/stop-start 重启/手动触发复活验证父 cmdline pid=7496 干净形态/三读数）到达后，本席独立复验三项（门禁独立：全自勘不转抄）：

| # | 核验项 | 独立读数 | 判定 |
| --- | --- | --- | --- |
| 1 | channel cmd 钉位零残留（文件面） | `set TRIMODEL_` 仅 1 行=API_TOKEN（正身件，掩码 a5cb****13a7）；DRILL 钉位 set 行=0；非 ASCII 字节=0 | ✓ |
| 2 | 新 daemon pid=7496 PEB 复验 | 128 变量（窗态 132−4 钉=128 算术互证）；TRIMODEL_CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG/L2_FLAG **全 ABSENT**；正身键全在位（TRILC_PORT=8713/TRIMODEL_API_TOKEN/ALLOWLIST 双命令/PATH nodejs ✓） | ✓ |
| 3 | 真活体 hash 基线 | `491F…78B2` 逐字吻合；daemon 7496 cmd-match=TriMLC；healthz 8713=200 | ✓ |

**三项全绿，核验毕报呈 CTO=波④ 全闭。** 现役 daemon=7496（watchdog 拉起体=修形后干净形态，父 cmdline 实证无幽灵尾参）。

**收尾清退（15:56+08）**：本席注入脚手架 4 件预置假 bak（14-02..14-05）删除——轮换证据已在卷（audit rotation_removed=1+post count 读数），脚手架非证据；drill 域余真 bak 1 件（07-36-10-999Z，restore 真产物留证）。新 daemon 7496 cron 台账独立旁证：l2-scan enabled runs=343 next=07:58Z / l3-remind enabled runs=37 next=08:00Z——与 FSD 读数（342/37）时差一致（l2-scan 其间再 tick 一轮），**梯子跨重启存活独立确认**。FSD 回执全闭确认收讫（七手流水线各自留案）。

| 案 | disposition |
| --- | --- |
| T2d（deploy-key 源序：per-provider→legacy） | CLI 不可实跑（默认落点在真 ~/.claude/settings.presets，实跑=真钥目录布雷，禁区）→代码审读映射（presets.ts readDeployKey fail-closed 源序 env→per-provider→legacy）+债注记 |
| T2b（同形注入防漏） | 形态演进映射：ps1 时代生成恒单键（API_KEY 形）→core 既有 API_KEY 载体同写同值消灭残留，候 CTO 认可映射 |
| T4b（verify-fail 自动回滚） | 债线映射：verify-fail 端到端不可注入（需 mock 文件系统竞态）；测套 five-gates.test.ts L159/L173 承载（WRITE_FAILED_ROLLED_BACK 断言在套） |
| T4c/T4e（写后 smoke） | 形态迁移：ps1 写时 smoke 特性未迁 core（core 五门=备份/键名/健康门/回读断言/掩码审计，smoke 由上层承接）——注记非缺陷 |
| T4d（备份轮换 keep=5） | **【实弹回填 15:36+08】**MAPPED→实弹 PASS：stub 真链 rotation_removed=1（audit assert=pass）+post count=5+最旧被删+F5 status count=5/keep=5 独立印证（详见 F4 终卷节） |
| T2d（deploy-key 源序：per-provider→legacy） | 代码审读映射保留；**【F4 env 分支实弹印证 15:16+08】**缺文件 fail-closed 不回落 legacy（11 连 DEPLOY_KEY_MISSING，detail 明指钉位路径）——源序映射+分支实弹双证 |
| T7a（坏 JSON 预设拒载） | 测套承载：presets.test.ts L39 断言在套，CLI 实跑与套断言同源 |

- exit 码形差异如实记：ps1 时代业务拒=exit 2→core 业务拒=exit 1（用法错=2）——对照表逐案标注，非缺陷系契约演进，候 CTO 知悉。
- 观察项：T5b UTF-8 无 BOM 断言在 core 由尾换行随原文件策略覆盖，读数绿。

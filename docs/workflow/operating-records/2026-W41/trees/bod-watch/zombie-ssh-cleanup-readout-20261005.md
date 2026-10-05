# 僵尸 ssh 清场三件施工读数卷（COS 值席窗牵头）

- sourceOfTruth: 本件（清场执行读数正身；修复正身=`docs/workflow/operating-records/2026-W38/ops-msg-alert-watch.ps1`）
- syncMode: final
- lastSyncedAt: 2026-10-05T02:42:09Z（+8=10:42:09，date 现查）
- 令链: CTO 10:32 盘点转 BOD 10:34 派令三件（①清 52 僵尸②源头加 -n③各席自查令转发；CTO 裁②优先）→本席值席窗牵头毕 10:42
- 结论速览: **三件全毕**——②源头两处 ssh 补 `-n`+修复版活体实证（10:40 计划任务新拉实例 15s 自然退+采样行落盘）；①清场 52 实例+52 僵尸 ssh+52 conhost 全清，红线 pid 52916（-N -L 18710 隧道）双断言完好；③12 席自查令已投（回执候收）；本机 ssh.exe 总数 53→2（=隧道+清后零挂死态）

## §一 勘验（清场前实锚）

- 僵尸面：本机 ssh.exe 53 条中 52 条挂死，两族签名精确在案——capture 族=`ssh -o ConnectTimeout=10 -o BatchMode=yes fleet@sg-ecs-server "tmux capture-pane -t m-duty-cos -p 2>/dev/null | tail -40"`；git log 族=`ssh ... "git -C /srv/fleet/TriMetaverse log -1 --format=%s"`。时间跨度 09-18 02:35:14 起（多实例最早）至今晨 07:23:41（最新）。
- 红线：pid 52916=`ssh -N -L 18710:127.0.0.1:8712 -o ServerAliveInterval=15…`（LG-064 L2 发报正形依赖），父=tunnel-keeper.ps1（pid 41196）——不入选不触碰。
- spawn 源链闭环：**计划任务 MSG-Alert**（State=Ready，action=`wscript.exe .fade/msg-alert-watch.vbs`，D-29 无窗正形）5 分钟班拉起 `ops-msg-alert-watch.ps1` 单轮采样→**L44（git log 采样）+L53（capture 采样）两处 ssh 均无 `-n`**→ssh 继承父链 stdin 句柄悬挂→powershell 等子进程→实例永驻堆积（52 实例×1 挂死 ssh 子=52 僵尸全对上）。挂死系**间歇性**（17 天约 4900 轮中 52 例，多数轮正常跑完——msg-alert.log 连续采样行为证），无 -n 的 stdin 等待为最大诱因。

## §二 件②源头修复（CTO 裁优先，先行）

- 改动：`ops-msg-alert-watch.ps1` L44/L53 两处 ssh 命令行补 `-n`（stdin 接 /dev/null，悬挂主诱因拔除；ConnectTimeout 原有保留）。改前并行线核查=该路径最近三笔（d17a5f0e 立项/6a47f802 盲区补/140e6346 乱码修）+工作区干净无在途。
- **修复版活体实证**：清场执行中 10:40:01 计划任务自然拉起新实例（竞态窗口撞上=意外收获）——其 ssh 子命令行已带 `-n`，完整跑完一轮采样（msg-alert.log 10:40:18 新行 TMV=501d8cb1 TC=0ab3854 blocked=False pending=4 alerts=0）后 **15 秒内自然退出**。修复行为实证闭环，非纸面推断。
- 后手候裁：若后续仍见零星悬挂，候选项=`-o ServerAliveInterval`（远端侧挂起防护），今未动候 CTO 裁（已随自查令捎带）。

## §三 件①清场执行（红线断言先行+杀后四断言）

- 杀列甄别口径：watch 实例=CommandLine 匹配 `ops-msg-alert-watch` 的 powershell；ssh 杀列=**只收两族精确签名匹配者**（`-N -L` 形不匹配天然排除红线）；conhost=watch 实例子进程。
- 预断言：pid 52916 存活且 CommandLine 含 `-N -L` ✓（失败即中止）。
- 执行：杀列 watch=52 + ssh=52 + conhost=52，`Stop-Process -Force` 批杀。
- 杀后四断言全绿：两族 ssh 残留=**0**；pid 52916 存活 ✓；tunnel-keeper（41196）存活 ✓；本机 ssh.exe 总数 53→**2**（=52916 隧道+清后复勘窗口期修复版实例的在跑 ssh，随后自然退）。清杀窗口竞态新拉实例经勘=修复版（带 -n），未误杀，留其自然退（即 §二活体实证本体）。
- 计划任务 MSG-Alert 未禁用：修复后自然复役，无需回滚开关。

## §四 件③各席自查令转发

- ListAgents 对名址后 SendMessage 投递 12 席（m-cho/m-cao/m-ste/m-sde/m-coo/m-rdt/m-cso/m-cmo/m-cfo/m-cto/m-fsd/m-cpo），令文=自查自家自动化面 ssh 调用、远程命令执行形态一律补 `-n`、`-N -L` 隧道形不涉、回执随常规报捎带不急。
- 投递回执：12/12 success（msg_id 全录于会话链）；回执内容候收，COS 汇总归档，不阻塞本卷。
- m-fsd 施工窗特别注记：轻令不扰 LG-064 施工，回执随毕报捎带。

## §五 边界与移交

- 施工域：本机进程面+ops-msg-alert-watch.ps1（W38 ops 树产物，CTO/BOD 派令授权域）——SG 面零操作、TriMLC/TriMMC daemon 零触碰、计划任务定义零改动。
- 候办：①12 席自查回执候收汇总（COS 归档）②零星悬挂候选项（ServerAliveInterval）候 CTO 裁③「ssh 多段命令拼接」家族既有候办并档点：本族根因（无 -n 继承 stdin）候 CAO 入册与既有 ssh 事故族并档。

## §六 扩勘扩修（§四 自查令回流带出的第二源头+真源面，11:08 毕）

- 回流线索：CAO 全机 230 计划任务枚举带出 **MSG-Work-Watch** 第二任务（与 MSG-Alert 并存）；COO 勘出 `.fade` 两旧件涉事形。
- 扩勘链全貌（本机 TriMetaverse 相关计划任务 6 个全景勘毕）：MSG-Alert→VBS→**W38 ops-msg-alert-watch.ps1（VBS 内容实证指向 W38 正身，§二修复位无误）**；MSG-Work-Watch→VBS→cmd→**W38 ops-msg-work-watch.sh L11 ssh 无 -n（第二 spawn 源）**；Notify-Poller/Seat-Watchdog/Sync-Alert/TriModel-Watchdog(Disabled) 四链脚本面零 ssh 干净。
- 真源面分叉实锚：TriCompany `scripts/ops/notify/msg-alert-watch.windows.ps1`（真源）**陈旧**——无 -n 且缺 140e6346 乱码修复（OutputEncoding 零命中）；re-sync 若从真源刷部署位会回退修复。notify-poller/notify-track/hourly-sync 三真源零 ssh 干净；work-watch.sh 无 TriCompany 真源（运行现场即真源）。
- 扩修六文件 18 处全补 `-n`（精确串 `ssh -o ConnectTimeout=`→`ssh -n -o ConnectTimeout=`，.NET 读写保 BOM 保行尾）：W38 work-watch.sh L11×1；TC 真源 alert-watch L48×1；.fade 死副本 alert-watch L49×1（防误用）；.fade bod-to-sg-dispatch.ps1×7+TC 真源 dispatch×7（**BOD 资产防误用保险，处置可裁**——今无进程引用疑退役，未删候 BOD 裁）；hourly-sync 真源零改动。
- 扩修验证：六文件改后 ssh 行含 -n 计数全对上（dispatch 8 行 ssh 含 1 注释=实质 7 全带）；**work-watch 活体双轮绿**（11:00:40 计划任务自然轮+11:08:30 手动 `--once` 轮，exit=0 通道畅通秒退）。
- 真源乱码修复差口（140e6346 未回灌真源）如实注记候 owner——超本令范围未动。

## §七 回执汇总（11 席收讫+CTO 配方裁）

- 11/12 席回执**零涉事**：cho（无自动化面）/cao（230 任务枚举+两仓 remote 全 git-transport 形）/cfo（ops-*.py 五脚本零 ssh）/cpo（产出面 grep 零命中，联审 cron 归 COO 域）/cso（无 cron 无脚本）/cmo（人工检索形态）/rdt（培训件两仓零 ssh）/sde（tunnel-keeper -N -L 豁免形+TriMLC cron 8 jobs no-ssh）/ste（rhy 探针落款 SDE 非本席资产）/coo（git URL 数据流形+knowledge 零命中）/cto（TriMLC-Watchdog 零 ssh+8713 cron git-fetch 形不悬挂——git 接管管道，52 僵尸零 git-fetch 形=实证）。余 m-fsd 施工窗随毕报捎带。
- **CTO 裁**：采纳 `-n -o ServerAliveInterval=15 -o ServerAliveCountMax=3` 三件套为远程执行形标准配方（-n 防 stdin 悬挂+ServerAlive 防 TCP 半开，正交），**LG-064 验收窗不追改**（FSD L2 巡检脚本在验收中，加参数触发重验），正形=验收毕后维护窗统一补齐+规则文档写配方；CTO 自挂验收判读条。

## §八 dispatch 裁答落办（BOD 11:1x 裁·11:13 执行）

- BOD 裁：**留档退役标注，不删**（-n 保险已足+git 可溯+防删后引用断裂）。
- 执行：本机 `.fade/bod-to-sg-dispatch.ps1` 文件头加一行注 `# RETIRED 2026-10-05·M-004 SendMessage 直达为现役·本件仅存档（BOD 裁 11:1x；防误用 -n 已补 7 处）`——闭环。sg 面无此件（未涉）。


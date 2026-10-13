# FSD 施工毕报：值守候令静默态豁免窗（A 辅落位+件③勘毕+件①候澄清）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-13T20:46:18Z（04:46:18+08·date 现查原值·04:45 拍补段版；首写 20:34:00Z 系预填造值 +47 秒·写完对表自查抓到即勘正在案）
- 施工位: FSD 小全（m-fsd）；令源链: BOD 带话 10-14 04:19（零指令性·设计面归本席裁）→BOD 收账 04:24（裁量归我·COO 排窗归链）→COO 排窗令 04:25（窗 04:40-06:10·三件·护栏四条）
- 状态条: ①date 现查 2026-10-13T20:33:13Z（首写 20:32:18Z 系前信读数复贴·勘正见 lastSyncedAt 注）②水位=中 ③联审证据=本件+commit 10393c34f/64689db4b+sg hook log 原文 ④末次活动=本件落盘

## 摘要

三件现势：**A 辅时段豁免=已落位**（10393c34f·sg 工作区 40 秒拾取实锚）；**件③sg 拾取链=勘毕**（hook 即时链真身+GitHub 镜像发现+今夜 sg 实例零发修正）；**件①拍文判据源=四向扑空候 BOD 澄清**（B 主正身候下窗）。施工提前量：预备勘 04:26-04:33 窗前完成，A 辅动笔约 04:33（窗位起点前 ~7 分钟·窗=止损边界非起跑枪，占用自窗无跨席影响——如实注记）。

## A 辅：值守候令静默态豁免（已毕）

- **实现**：新建 `scripts/fade/lib/quiet-hours.mjs`（`isQuietHours` 谓词·本地时 22:00-08:00·两实例宿主均 +08）+`hub-silent-detect.mjs` dispatch 循环头部豁免段（duty-escalate/idle-escalate 两 band→skipped 留痕 continue）。
- **语义**：豁免不发送**不写 state**——出豁免窗首轮即正常告警（无冷却残留）；anchor-error 不豁免（结构异常夜间也出声）；reminder 不豁免（灰度观察项·今夜实发主力是 idle-escalate，reminder 量小候评估）。
- **自测**：node --check 双文件 ✓；isQuietHours 真值表 8/8（03:00/07:59/22:00/00:00→true·08:00/12:00/21:59→false·now=true 吻合）；静默期实跑全脚本端到端 ✓（import/运行时零炸·该轮 alerts=0 全 healthy——**豁免分支未实触**，覆盖=谓词真值表+代码走查（continue 位于 state 写前）·如实标注）；生产验证锚=候 04:45 拍（若 alerts 出现→log 应出 quiet-hours suppressed 行）。
- **技术债标记**：①豁免时段 22-08 硬编码=粗粒度近似（B 主拍文判据落位后应让位）②豁免分支无自动化单测（dispatch 内联不可单独 import·候灰度评估定重构必要性）。

## 件③：sg 副本拾取链（勘毕）

- **真身=bare post-receive hook（FADE fast-path）**：push dev→hook 即时 `git -C /srv/fleet/TriMetaverse rebase origin/dev`（fleet 身份·dirty/conflict 时 skip 留痕不阻塞 push）+异步 tick 派发+**异步 GitHub 镜像 push**（dev→github·实测 64689db4b 镜像成功——TriMetaverse 的 GitHub 同步经此链自动覆盖）。
- **实测**：push 10393c34f/64689db4b（20:31:1x）→sg 工作区 20:31:34 tick dispatched+HEAD=64689db4b+quiet-hours.mjs 在位——**拾取延迟 ~40 秒**。兜底=crontab `40 * * * * worktree-guarded-ff.sh`（小时级保险）。
- **读数修正（灰度卷 290a3feb4 续勘节「今夜 6 通知/轮」补正）**：sg 侧今夜 log **零 duty-escalate**——今夜 BOD 收 3 例（43/73/103min）全系**本机实例**实锚；「每 30min 6 通知」=单实例（本机）读数非双机叠加。
- **附带发现（运维面·非本席窗）**：sg TriMMC 8710 healthz 空回疑 executor 停（TriRMC 10-04 同族先例）——sg 实例静默是否 8710 面问题候 M 面勘，已报 BOD。

## 件①：拍文判据源（四向扑空·候澄清）

BOD 第五例素材引「20:37:04 daemon 拍文 m-duty-cos=候令在案」——四向勘全未命中：①sg `.fade/seats/` 不存在（本机侧仅 10-02 手工拍件 cmo.session）②sg 侧 20:30-20:45 时锚改动文件零命中③`.fade`+`.trimmc` 全域「候令」关键词零命中④TriMMC 8710 healthz 空回。**B 主（拍文判据豁免）候 BOD 澄清拍文获取方式后下窗施工**；若拍文实为非落盘观测（tmux capture/healthz），则 B 主需另行设计信号面（候裁）——A 辅时段豁免在 B 主缺位期间承担值守候令豁免职责。

## 件①B 主：拍文判据正身（已毕·BOD 答询后窗内追落）

- **判据源钉死（BOD 答询 04:33）**：拍文真身=`docs/workflow/operating-records/<当 ISO 周目录>/trees/bod-tick/tick-latest.md`——**本机** TriMLC 8713 daemon 产出（:07/:37 双点）。我先时四向全勘 sg 侧=**机位错向**（TriMLC=本机 daemon·daemon 机位矩阵纪律又一实证——git status 未跟踪列表里就有 tick-latest.md 而未联想）。
- **实现**：新建 `scripts/fade/lib/duty-tick-signal.mjs`（ISO 周目录定位+⓪段解析）+hub-silent-detect 豁免段改 A 辅+B 主双判据并联。
- **新鲜度锚=内容节拍时戳非 mtime**：首行「节拍（daemon 版）YYYY-MM-DD HH:MM:SS」(+08) 判 ≤35min（拍节 30min+5min 缓冲）——sg 侧文件经 git checkout 不保源 mtime，mtime 断言两机行为分叉；内容时戳两机一致。
- **语义**：`allIdle`（⓪段「全席空闲」→idle-escalate 豁免·全席候令静默预期）／`dutyIdle`（`m-duty-cos=候令` OR 全空闲→duty-escalate 豁免·覆盖 sg 值席与本机值守 m-cos 两形态）。**fail-open**：拍文缺失/解析败/过时→不豁免照发（保守向：拍文断供时值守真失联不漏报·断供窗噪声回归为代价·灰度观察项）。
- **自测**：isoWeek 真值 4 例边界（10-14→W42·01-01→W01·01-04 周日→W01·12-31→W53 跨年周）+现役拍文信号真读（fresh/allIdle/dutyIdle 全 true）+stale(+40min→false)+miss(不存在根→read-failed)·其中一例首写期望错（01-05 周一误标「周日属前周」·函数对测试错·已辨正）；实跑端到端零炸（仍 alerts=0·**豁免分支未实触**——各席 transcript 活跃全 healthy·单元真值表+走查覆盖·生产验证候 04:45 拍如实报）。
- sg 拾取实锚：push 1665ad3b1→sg 工作区 ~45 秒内拾取+node --check 过。

## 04:45 拍生产验证（补段·实读）

- **新版生产链 ✓**：04:45:00.255 daemon 拍=新版首拍（1665ad3b1 豁免段在链）·round 2.25 秒完成·零炸零错（件④性能修复后持续形态）。
- **tick 信号语义真读 ✓**：04:37 拍⓪段「**非空闲·1 席在干活**——本地在干活：m-fsd」→allIdle=false·dutyIdle=true（m-duty-cos=候令在列）——拍文判据对施工态/值守态区分正确（本席施工中=非全空闲·条目告警应照发=正确行为）。
- **豁免分支未实触（如实）**：alerts=4 全部 **reminder 级**（各席 20:26 前后停止活动·19min>15min 阈）——reminder 不在豁免域（设计行为）照发 m-cos/m-coo/m-cto/m-cao；idle/duty-escalate 需 30min+ 静默未到线。豁免机制生产实触读数未取得——机制面证据链=单元真值表（quiet 8/8+isoWeek 4 例+拍文信号真读/stale/miss）+端到端零炸+语义走查；**首个自然实触窗=下个 30min+ 全席静默段**（候今晨收工后拍·灰度评估项）。
- **新观察项（候灰度评估）**：reminder 级夜间照发实锚（04:45 拍 4 条 nudge 出手）——「reminder 是否入豁免域」本窗裁量=不入（保守：reminder 是 15-30min 轻提醒·豁免或掩真早期异常）·候 BOD/COO 灰度周评估裁。

## 使用依据

- BOD 带话 10-14 04:19（值守候令静默态观察·零指令性）+BOD 收账 04:24（裁量归我·COO 排窗归链）+COO 排窗令 04:25（三件·护栏四条·06:10 硬止损）
- 灰度卷 290a3feb4 续勘节（设计三案裁量 B 主 A 辅+今夜实锚）+survey 卷全谱
- BOD 答询 04:33（拍文真身=本机 bod-tick/tick-latest.md·:07/:37 双点+「20:37:04」转引辨正在案）
- sg 面实勘：bare hooks/post-receive 原文+crontab+fade-hook.log+sg 工作区 git log（本窗 SSH 只读+git push 通道内）
- 本机实勘：hub-silent-detect.log（20:30 拍+实跑轮）+真值表自测输出
- commit 锚：10393c34f（A 辅）+1665ad3b1（B 主）+64689db4b（merge 四轮）·毕报卷 commit 随收口笔

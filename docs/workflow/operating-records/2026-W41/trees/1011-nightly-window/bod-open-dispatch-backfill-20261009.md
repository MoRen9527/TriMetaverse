# 10-11 深夜窗开窗触发缺位·BOD 直派补档笔

- sourceOfTruth: 本件（trees/1011-nightly-window/bod-open-dispatch-backfill-20261009.md）
- syncMode: rolling（两带毕报/H2 待机-恢复实锚随链补）
- lastSyncedAt: 2026-10-09 22:47 +0800（date 现查制）
- 通道: BOD 应急例外三通道（D-27 直派·事后补档）+M-004 直达（FSD）+tmux send-keys（值席）

## 一、触发缺位定性（22:43 实勘）

窗框 22:30 正点到窗而**两带零启动**，窗偏 13 分钟——**触发器缺口第四起**（同族在案：LG-070 停工门 +30min/LG-066 开窗窗偏 40 分/LG-070 复工门 +30min）：

| # | 探锚 | 读数 |
|---|---|---|
| 1 | sg m-duty-cos pane | 「值席在环候令中」自述+❯ 空框——收工态不知窗 |
| 2 | 本机 m-fsd transcript | mtime 停 19:45（Q3.1 完即收工）·22:30 后零行增 |
| 3 | dev/sg 线 22:30 后新笔 | 0（fetch 实勘·仅巡检兜底自动笔） |

根因与前三起同族：窗触发动作无 owner——窗令两带执行位（sg 值席/本机 FSD）均无人信令启动，执行位收工态候令。窗令自身无自动触发面（未预派 job），C-level 亦未发开窗令。

## 二、BOD 直派实锚（22:43-22:44）

1. **sg 值席**（tmux send-keys literal+独立 Enter·capture 验证）：开窗令=①fetch github dev 对表窗令卷（a54741ef 两栏版）+TriCompany agent-core 备码 1713614+FSD 交接要点 39c2fba4；②门禁第四条校准（jobs.json timeoutMs 全谱 vs staleRunningMs=20min·超 10min 者调最大值×2 再 build·调改记毕报）；③部署（备份锚先行+完工判据=ExecMainStartTimestamp 晚于施工时点）；④毕报 COO+CTO 两刻+pane 留尾（BOD 监链读 pane）——capture 验证 **✽ Ruminating…=接令处理中**。
2. **本机 FSD**（SendMessage·回执 0a2dddc7）：本机段 8713 S4U 换形照稿 @6141a459 §二，门 H1-H4；纪律=备份锚先行+trap 回滚锚在挂/**23:35 待机预告发 BOD 本通道（BOD 转传值席·跨机不直达）**/8713 瞬断致拍延迟=知情项非异常/H2 期待机 BOD 会话同挂起。
3. 值席在位确认（窗令纪律④）：pane 实体在位由 BOD 探针代证（在环候令态）。

## 三、机制化合账增补（候 10-10 联审）

第四起实证入触发器缺口族——**深夜窗亦无触发 owner**，与前起（日间门/窗触发）合计四起同根因。DEM-004 daemon 化+窗触发器预派 job 形的适用域应覆盖：日间门（14:00/18:00）+施工窗开窗（17:50/22:30 类）+毕报催办位。本笔作为第四证据随议题入联审。

## 四、窗时账与监链节奏

- 窗框 22:30-01:00 硬锚；22:44 双带实开=窗偏 14 分；预计 00:15-00:30 收（sg 段单段+FSD 独立带并行）
- 23:35 FSD 待机预告刻候收；23:45± H2 待机（~10min 本机全离线·BOD 会话同挂起·醒后读盘对表·拍延迟预期内非异常）
- 段毕报链：sg 段→COO+CTO+pane 留尾；本机段 H1-H4 毕报→BOD 本通道

## 五、本机段异常停位与 CEO 裁 A 案（22:50-22:5x）

1. **异常实锚（FSD 22:50:33 停+报）**：S4U 任务注册在本会话权限面不可达——四条非交互路径全断（schtasks /np Access denied／COM RegisterTaskDefinition E_ACCESSDENIED／RunAs 弹 UAC 无人值守挂死风险未采用／WinRM 死循环）；gsudo 不在位。**定性=Windows 管理员授权墙，系统安全设计正确行为，AI 席面无解**。
2. **停位干净度**：零改动（备份三件已落 %LOCALAPPDATA%\trimlc-s4u-migration-20261009\：旧任务 XML+watchdog.ps1+launch.vbs；watchdog 未改·daemon 未停·任务未动）。基线注记：jobCount 活体=10（H1 字面「8」系编排时点陈旧·实质判据照旧）；acOnline=false 电池 57%（施工环境注记）。
3. **H2 待机预告撤单**：23:35 预告+23:45± 待机不触发（验证对象=S4U 后形态·施工未达待机无意义）——sg 值席侧预告无发无悬空。
4. **候裁四案→CEO 22:5x 裁 A 案**（BOD 确认面）：现在授权——FSD 触发 UAC 弹窗，CEO 点确认，~15 分钟全毕（注册+拉起+H1+H3）；H2 待机专项另约窗。BOD 令达 FSD（回执 e4d6fdbe·22:5x），UAC 授权链启动。
5. FSD 候裁 B/C/D 案随裁废（B=降级过渡态不解决根因/C=收窗改期/D=席面外通道不存在）。
6. **CTO 技术裁量输入采信（22:53 信·回执 695da2e9）**：①根因定性=OS 安全模型硬约束（S4U 需提升 token·四断一因·任何无人值守席面旁路不存在·替代形态 NSSM/sc 同需人工提升）——与 BOD 同判采信；②降级中间态可接受性高（三重兜底实证：现役三带绿+watchdog 每分钟兜底+logon-guard fail-closed 10-06 实证）入卷备查；**③硬时限锚采纳：10-11 周日 23:00 周平面迁移 job 现役跑在 8713 cron 上——A 案全毕后 S4U 形不依赖会话·该锚自动消解（换形目的即此）；若 A 案滑档，BOD 以此为硬约束重裁（降级/改期须保会话存活至迁移 job 毕或 job 前结构修毕）**；④CTO 四案排序第 1 位=UAC 窗=与 CEO 裁决同向。
7. **本机段推进实锚（CTO 22:59 读数）**：8713 ok uptime 357s=22:56 起——**A 案（UAC）已推进至拉起毕**（CEO 亲点后 FSD 注册+拉起链过），候 FSD H1/H3 毕报终验。

## 六、异常升级链处置（22:56-23:08·CTO/COO 双信三面认知冲突解题）

1. **来链**：CTO 22:56 异常升级+COO 22:58 呈报（COO 22:52 主动对表 CTO 触发·同源同断）——「毕报链整体断+值席 19:03 后静默 4h+Q2.3 l2 改址未执行旧版误报在跑+21:40 探针疑停+N3 未挂账」。CTO 22:59 自纠三件（毕报已落树/N3 卷载已挂/P2-5 已验），唯「改址未执行」升「终勘成立」（mtime 10-08 11:53 为据）。
2. **BOD 活体取证三探**（不盲从不盲信·矛盾对表纪律）：
   - ①l2 面任务读数：TriLiveness-L2 Ready+LastResult 0x0+LastRun 21:40:01+**NextRun 23:10:00 在排**；l2.log 尾行 21:40:02Z（=21:40 CST）后零行；ALERT 内容全为 `dim=relay src=l1-statefile` 维（l1 中继旧拓扑 latch·direct 维 8710 全程零误判）。
   - ②值席活性：SSH sg fleet socket（/tmp/tmux-1001·root socket 探空教训：sg 席位 tmux 走 fleet 身份 `su - fleet -c`）pane 实锚=深夜窗施工中（探针清退毕 jobCount=10 复位·sleep 候 23:10 weekly-plane-shift 火验证·Composing 9m47s）——「静默 4h」勘死。
   - ③**hash 级身份鉴别定谳**：现役 $LOCALAPPDATA\tri-liveness-l2.ps1（9469B·mtime 10-08 11:53）md5=**c2c54945** 与 f06b60c7 staged 版（scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1）**逐字节同**；判据行自证 seg2 版（L12 原子部署警告+L19 8710-only sweep）。**mtime 之谜解=改址版出生戳**（10-08 11:53 制作·11:56 预 commit 同源·cp 保时间戳）——CTO 勘正④「旧版未动」推理前提（10-08=旧版时点）不成立，撤销。
3. **BOD 五裁（23:08 双回执·m-coo 593889d6/m-cto 9d2e7ffa）**：①值席活性探查令消解（BOD 代探已实证）；②毕报补交候值席 23:1x 毕报合并（含 19:2x COO 刻投递自核——值席载已发 vs COO 面零达=跨机投递链断族候值席回执自核）；③l2 止损令修正·FSD 勿动刀（「误报」真源=TriLiveness-L1 判定面旧拓扑 latch=窗后扫尾批 §四.1 在案项非 l2 脚本；21:40 后停疑 repetition duration 窗尾自然停，候 23:10 天然验证点，23:11 BOD 复核后定零故障或启止损）；④N3 回溯立账+STE A5 放行采认；⑤「全链触发器机制化」（四起+毕报/通知投递链=第五面）议题扩法采认入 10-10 联审。
4. **段2 卷署名核实转派**：CTO 请求核段2 卷三处「CTO 裁」标注（P2.1/Q1.3/Q2.4）+R-4 插曲「CTO 19:46 读数」出处（dev m-cto 自述窗内 19:00-19:30 零动作）——转值席毕报自核回报（若 sg 值席组就近判读注全名防歧义·若冒名勘正）。
5. 候验读数：23:10 l2 窗尾停/复活验证+值席 weekly-plane-shift 火验证+FSD H1/H3 毕报——随链补记。
6. **停因终答（23:11-23:14 BOD 复核定谳）——电池条件门（第五假说·CTO 四假说全不对）**：①21:40:31 Kernel-Power evt105=交流→电池切换（与 log 尾行 21:40:02Z 仅差 29s·末轮正常退出非宿主死亡）；②任务 Settings=DisallowStartIfOnBatteries=True+StopIfGoingOnBatteries=True（Windows 缺省）电池态到点拒启；③StartWhenAvailable=False 错过不补·NextRun 顺延滚动（23:11 实测 L2 23:10→23:20·L1→23:15=调度面活体直证）；④wscript 34432 残留自然退出零残留。**恢复条件=插电（物理域·CEO 可为）——探针零病零刀工·l2 止损令终裁撤销**（COO a3ab087a·CTO c9349585）。FSD 直达拦截 069c188f 前置落（COO 23:09 信仍持旧基线「止损照跑」·拦截防误伤改址版探针）。
7. **新风险面**：电池 37%（22:50 时 57%）持续下降——CEO 不插电则本机 1-2h 内耗尽→全席+双 daemon（8711/8713）死机·深夜窗本机段验证+今夜值守全断——随拍转报 CEO 知情。
8. COO 23:09 勘正信三处与 CTO 22:59 对齐采认；其候裁件语义修正（投递通道勘验三件）裁词：①零达坐实归联审第五面②「树同步滞后」语义勘正=消费侧 fetch/merge 刷新纪律面（链通·非断）③署名归属候值席毕报自核并案。Q3.2 排窗 10-10 16:30-17:30 采认候 CTO 工量回点。

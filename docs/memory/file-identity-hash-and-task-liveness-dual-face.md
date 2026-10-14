# 版本身份必 hash 级+任务活性必双面（2026-10-09 深夜三误判实证）

**教训一·版本身份判定（LG-066 勘卷四度反转）**：凭「现役 l2.ps1 mtime=10-08 未动+文件头 Do NOT deploy 注释」判「旧版在跑/改址未执行」，被 BOD md5 级证据推翻——现役文件与 staged 版**逐字节同**（md5 c2c54945/9469B），mtime 10-08=改址版**出生戳**（cp 保时间戳），「Do NOT deploy」注释行=新版自带的 staging 警示非旧版证据。
**正形**：文件/版本身份断言必 hash 级（md5/sha256 逐字节对表）；mtime 与文件自述注释均为弱旁证，禁作主判据——cp/checkout/发布链均可能保时间戳，注释行不随 cp 更新。

**教训二·任务活性判读（同窗·当晚二犯实证）**：单时点进程探针（wscript 零存活）判「宿主进程死亡未复活」——实为周期任务两轮间隙+电池条件门正常退出：evt105 21:40:31 交流→电池切换（末轮 21:40:02 正常跑完）+Windows 缺省 DisallowStartIfOnBatteries/StopIfGoingOnBatteries+StartWhenAvailable=False 错过不补·NextRun 顺延滚动。
**二犯（写入本条 8 分钟后）+三犯（12 分钟后·BOD 同踩并列）**：l2.log 23:30 滚零新行→判「L2 未跑/改面失败」——被 LastRun=23:30:01 Result=0x0 证伪（log 零行≠没跑）；随后采信 BOD「零行=零 issues 全绿」定谳入卷——12 分钟后 BOD 自撤（l2.log 23:30:07Z ALERT-SENT 200 已落盘·两人读零行系 **write 延迟读空窗**·notify 链路延迟行落盘更晚·l1 latch 未自解误报链照跑）。**log 行缺席在 write 延迟场景双向不可定谳**——既不能推没跑、也不能推零异常；正解=statefile 值面（issues 源头）或等下一轮 log 终态，单点 log 缺席禁作任何方向定谳。
**正形**：任务活性判读必多源——**调度面（LastRun/LastTaskResult/NextRun）为活性真值·statefile 值面为 issues 真值·log 面只作旁证且须防 write 延迟空窗**；进程面缺席≠任务死（周期任务间隙=正常形态）。Windows 电源链事件：**105=电源源切换**≠42=睡眠——勘电源因先扫 Kernel-Power 全族（evt105/42/107）禁单点 ID；两假说（睡眠证伪✓电池门漏勘✗）同窗并存=扫族不全的典型伤形。

**教训三·sg bare「unable to migrate objects to permanent storage」症状面（同夜闭案）**：fleet push 连拒此错，df/inode/权限/dmesg/hooks 全正常+fleet 身份 hash-object 写测通——根因=bare 库内 **44 项 root 属主残留**（含 objects/ed、objects/35 **子目录本身**+pack 三件套+refs/heads/board-live），fleet migrate rename 进 root 无组写目录=EACCES。潜伏雷：对象前缀不撞坏槽位则长期无症状，文档大笔撞中即爆。

**教训四·工作区有改动≠正在施工（2026-10-11 22:36 W1 窗催办实证·CTO 值窗审位错报）**：TriRLC 工作区三件改动（store.ts/app.ts/新测试）判「今晚施工痕迹/FSD 在工深潜」报 BOD——被 FSD transcript 取证（18:19 后零活动）+COO mtime 实勘（三件=10-10 下午遗留态）双面证伪，实为**前日遗留未提交先行稿**。错因两层同根：①单面定性（只看工作区态未查 mtime+transcript）；②矛盾信号放过（`git log 窗内零 commit` 读数在手，未与「有改动」对撞——零 commit+有改动=未提交施工**或**遗留笔二选一，必第二面分辨）。**正形**：施工活性判=工作区改动 mtime+席位 transcript 活动双面对表；「零 commit+有改动」组合出现即触发第二面分辨义务，禁择一较顺口的定性直报。门禁位/监督位错报实况的传染权重高于执行位自误——实况报前必过双面。
**教训五·uptime 连续≠进程醒着——「HTTP 活+调度停」的第三解释=系统睡眠（2026-10-12 §95 bod-tick 17 拍全缺实证·CTO 判读卷 d2dd450d9）**：bod-tick 01:07 起 17 拍全缺 8.2h，daemon uptime 21.5h 连续零重启、HTTP 面读数正常——纸面双层 600s race 必 settle 与实测 duration 29966s 矛盾，全部代码缺陷假设（件B 未部署/executor 停摆）三重证伪后，真因=**电池过夜耗尽→系统自动入眠（Modern Standby 主体无 evt42）→Node 事件循环全冻结（timer/executor/HTTP 全停）→09:15:37 evt105 插电唤醒→7 秒后冻结 7.33h 的 600s timer 集中触发结算**。process.uptime()=OS 时钟差，睡眠段照算——uptime 连续只证「没重启」不证「醒着」。
**正形**：机器级活性三查——①进程面（uptime/pid）②调度面（LastRun/nextRunAt 是否滚）③**宿主电源面（Kernel-Power evt42/105/107 全族）**；「调度停+进程活」矛盾信号出现即触发第三面分辨义务（教训四「零 commit+有改动」同构）。**evt42 零命中≠没睡**（Modern Standby/S0ix 不产 42——negation-claim「穷尽事件日志」的记录形态盲区）；插电/唤醒时点与结算时点的秒级耦合是最强因果锚。**探针双失明**：daemon cron 拍被挂死锁占+schtasks 独立拍被电池条件拦（教训二同款）——监控面设计须跨失效域（同一电源/同一锁域的探针会同时死）；l1 脚本 ssh 无 ServerAlive/无整体超时=无界外部调用挂死家族（ConnectTimeout 只管 TCP 握手）。

**修法（正向应用「sg 仓 root 残留」条）**：root 通道 `find <bare>/ -not -user fleet -exec chown fleet:fleet {} +`→`find -not -user fleet | wc -l`=0 验清零→重推过。写测探针成功≠migrate 通（前者建新 loose、后者 rename 进既有子目录——判别力不同勿互推）。

关联：manifest-identity-verification（「实盘未落」断言前必验文件身份·同族）·trirmc-独立仓/root 残留条·liveness-first-diagnostics（探活体但须探对层）·negation-claim-needs-exhaustive-event-log（「未发生」定性穷尽事件日志）。

## 索引行全量快照（2026-10-13 16:0x CAO 压缩施工·MEMORY.md 裁短前存档·细节权威位=本文件历史段+本快照）

- [版本身份必 hash 级+任务活性必双面](file-identity-hash-and-task-liveness-dual-face.md) — mtime+头注释判「旧版」被 md5 逐字节同推翻（cp 保出生戳·注释不随 cp 更新·身份断言必 hash 级）；单时点进程缺席≠任务死（周期任务间隙正常形·调度面 LastRun 才是活性真值·电源事件扫全族 105≠42）；**log 零行双向不可定谳**（write 延迟读空窗：既非没跑也非零异常·statefile 值面/等终态轮才是 issues 真值·当夜 BOD 与我先后同踩三犯实录）；**uptime 连续≠进程醒着（教训五·10-12 §95）**：睡眠冻结期 timer 不过期+evt105 插电与结算秒级耦合=最强因果锚·「调度停+进程活」矛盾=第三面（宿主电源面）分辨义务·evt42 零命中≠没睡（Modern Standby 无 42）·探针双失明（同电源/同锁域探针同时死）；sg bare「unable to migrate objects」=root 属主残留雷 44 项（objects 子目录本身可中雷·chown 归还清零·写测通≠migrate 通）——2026-10-09 LG-066 勘卷五度反转夜四案实证

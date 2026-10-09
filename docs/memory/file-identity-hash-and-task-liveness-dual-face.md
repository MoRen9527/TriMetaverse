# 版本身份必 hash 级+任务活性必双面（2026-10-09 深夜三误判实证）

**教训一·版本身份判定（LG-066 勘卷四度反转）**：凭「现役 l2.ps1 mtime=10-08 未动+文件头 Do NOT deploy 注释」判「旧版在跑/改址未执行」，被 BOD md5 级证据推翻——现役文件与 staged 版**逐字节同**（md5 c2c54945/9469B），mtime 10-08=改址版**出生戳**（cp 保时间戳），「Do NOT deploy」注释行=新版自带的 staging 警示非旧版证据。
**正形**：文件/版本身份断言必 hash 级（md5/sha256 逐字节对表）；mtime 与文件自述注释均为弱旁证，禁作主判据——cp/checkout/发布链均可能保时间戳，注释行不随 cp 更新。

**教训二·任务活性判读（同窗）**：单时点进程探针（wscript 零存活）判「宿主进程死亡未复活」——实为周期任务两轮间隙+电池条件门正常退出：evt105 21:40:31 交流→电池切换（末轮 21:40:02 正常跑完）+Windows 缺省 DisallowStartIfOnBatteries/StopIfGoingOnBatteries+StartWhenAvailable=False 错过不补·NextRun 顺延滚动。
**正形**：任务活性判读必双面——**调度面（NextRun 滚动/LastTaskResult）+进程面**；进程面缺席≠任务死（周期任务间隙=正常形态），调度面才是复活判据。Windows 电源链事件：**105=电源源切换**≠42=睡眠——勘电源因先扫 Kernel-Power 全族（evt105/42/107）禁单点 ID；两假说（睡眠证伪✓电池门漏勘✗）同窗并存=扫族不全的典型伤形。

**教训三·sg bare「unable to migrate objects to permanent storage」症状面（同夜闭案）**：fleet push 连拒此错，df/inode/权限/dmesg/hooks 全正常+fleet 身份 hash-object 写测通——根因=bare 库内 **44 项 root 属主残留**（含 objects/ed、objects/35 **子目录本身**+pack 三件套+refs/heads/board-live），fleet migrate rename 进 root 无组写目录=EACCES。潜伏雷：对象前缀不撞坏槽位则长期无症状，文档大笔撞中即爆。
**修法（正向应用「sg 仓 root 残留」条）**：root 通道 `find <bare>/ -not -user fleet -exec chown fleet:fleet {} +`→`find -not -user fleet | wc -l`=0 验清零→重推过。写测探针成功≠migrate 通（前者建新 loose、后者 rename 进既有子目录——判别力不同勿互推）。

关联：manifest-identity-verification（「实盘未落」断言前必验文件身份·同族）·trirmc-独立仓/root 残留条·liveness-first-diagnostics（探活体但须探对层）·negation-claim-needs-exhaustive-event-log（「未发生」定性穷尽事件日志）。

# 快照增强 bod-progress-snapshot v2 施工读数卷（COS 值席车道）

- sourceOfTruth: 本件（v2 施工执行读数正身；快照器运行正身=`/srv/fleet/bin/bod-progress-snapshot.sh`）
- syncMode: final
- lastSyncedAt: 2026-10-05T01:46:11Z（+8=09:46:11，date 现查）
- 令链: CEO 09:30「三否向前挪现在就干」→BOD 09:32 流转（快照增强现窗拆派·**施工席由本席裁定**）→本席值席车道施工毕 09:46
- 结论速览: **施工毕+调度复役毕**——v2 正身上机（95 行，v1 九行版备份在位），两轮冒烟绿（树扫描/计数传递/transcript 面/旗标面/容错注记五读数），job `bod-progress-report`（ae02593a）PATCH 200 enabled 翻真+nextRunAtMs 已排 02:15:21Z（30min 节律复役；原稿 01:55Z 系换算误已勘正）；**首次生产轮=02:15:21Z（北京 10:15:21）**

## §一 施工前实勘（范围裁定依据）

- 盘面无正身：四点增强单（28f5d95c）指向的「快照+urge 节律」实践**仅存在于 m-duty-cos 已清会话**——名册 13 席无 m-duty-cos、tmux 仅剩 default bash 面板、TriMC src 零 urge/peak_paused/MTWARN 代码化痕迹（grep 实勘）。九行旧脚本（写死 W40/bod-pipeline-batch-01 过期树+capture 单面板）系 09-30 批次临时产物非正身。
- 调度面：TriMMC job `ae02593a bod-progress-report`（every 30min）**占位空转**——enabled:false 自 10-02 起（历史 runCount=76、lastRun 10-02T01:20Z ok），payload.command 原配裸路径在位（首勘 GET 投影漏看嵌套 payload 键，PATCH 后勘明，非缺配）。
- 施工席裁定：**本席值席车道自揽**（依据=sg 面不跨机中转原则+正主 m-duty-cos 不在场+工程量小+值席先例充足；BOD 令明授裁定权；COO 面「候 owner 车道」注记与本裁定不冲突——即本席车道）。

## §二 v2 正身设计（四点单可做面全落）

- 落点三元：快照行=`当前周 trees/bod-watch/progress-snapshot.md`（git 工作区追加，commit 随收口批统一收不添齿轮）；状态面=`/srv/fleet/var/bod-progress/state.json`（跨轮指纹+旗标，非 git）；脚本=`/srv/fleet/bin/bod-progress-snapshot.sh`（v1 备份同目录 `.v1-bak-20261005`）。
- 扫描面：当前周（含 daily-progress.md 的最大周名目录）trees/ 逐树最新件+age 分钟；sg transcript 面=`/home/fleet/.claude/projects/*/*.jsonl` 聚合 max mtime。
- 四点①（mtime 交叉核）：✓ 骨架落位——sg transcript 面 age>60min→`⚠️疑似断点`+MTWARN 旗标。**席级归一映射候补**：现聚合面（fleet 位全体 jsonl），席→session UUID 映射清单候 sg 席复活后补配（seats 清单机制留位）。
- 四点②（停滞计数）：✓ 树指纹=latest+mtime 跨轮对比，同态计数递增，≥4 轮（2h）→快照行`〔进度停滞 N 轮〕`+STALL 旗标。transcript 跨机不可读局限照四点单原注不变（本机 dev 各席 transcript 不入 sg 扫描面）。
- 四点③（旗标双写）：✓ 快照行内联（`- 旗标: ...`行）+state.json `flags` 键（MTWARN-*/STALL-*）双写达成。
- 四点④（回归）：**如实降级**——urge/master/morning 三模+peak_paused/去重旗标/硬截点升级三功能盘面无正身（§一实勘），回归对象不存在；本卷回归=v2 冒烟（§三）+v1 备份可回滚。**三模链路重建属新范围候 BOD 裁**（m-duty-cos 会话复活窗另议），本施工不越界代立。

## §三 冒烟读数（两轮实证+复役断言）

| 项 | 读数 | 断言 |
|---|---|---|
| 语法门 | bash -n 零输出，95 行上机 | ✓ |
| 首轮 RUN | state.json 落盘：W41 两树 count=1 基线，flags={}, lastRun=01:44:42Z | ✓ |
| 次轮计数传递 | cron-liveness-alert/lg060-refix-chain count 1→**2**（latest+mtime 未变递增链通）；≥4 阈值标注与递增同径 | ✓ |
| 快照行四段 | 当前周树面清单+sg transcript 面（4min 前=活）+旗标行+值席 capture 容错注记（会话不在场跳过） | ✓ |
| PATCH 复役 | HTTP 200；API list enabled=True+store 双面一致；`state.nextRunAtMs=1791166521300`=02:15:21.300Z 已排（30min 节律）〔**勘正 10:05**：原稿误写 01:55:21.300Z——ms epoch 心算 UTC 错 20 分钟，正确值=PATCH 时刻 01:45:21.300Z+1800s 整，10:03 验证 turn 实勘 executor 面翻转勘明，禁推算家族新变体自报〕 | ✓ |
| 命令面事故自报 | 首次灌入链拼接错（cp 三参数吃掉管道→tr 空输入把目标写 0 字节，SYNTAX-OK 系空文件假绿）——即时勘破，v1 从会话在案全文还原备份后重灌（stdin 重定向挂 ssh 调用侧正形） | 已闭 |

## §四 边界自检

- 施工域：/srv/fleet/bin+var/bod-progress+TriMMC cron API——sg 值席车道既有先例域，零越界。
- 零敏感值：token 全程远端内流转（PATCH 断言只回显 enabled/cmd 布尔与路径面）。
- git 面零扰动：v2 快照行只追加工作区文件，本卷+首批快照行随本席收口 commit 一并落（不自动 commit 不添机器齿轮）。
- TriMMC 禁动面未触（weekly-plane-shift b00b0070 维持 disabled 裁停态未碰）。

## §五½ 首跑事故与修复（10:15 生产轮红→10:19 修复复验绿）

- 首跑实况（02:15:21.301Z，runCount 77）：**error Permission denied 双写面**（last-run.txt L14+progress-snapshot.md L95）——job 本体调度面全正常（到点即跑）。
- 根因：本席 ssh sg 为 **root 身份**，§三手动冒烟轮所建 `/srv/fleet/var/bod-progress/`+`trees/bod-watch/` 目录及 state.json/last-run.txt 全 root:root，fleet executor（trimc.service User=fleet）无写权。**正中既有教训**（root 操作 sg 面 root 属主遗留致 fleet job 连败案）：root 操作后必 find -user root 清点+chown 归还——本席冒烟环节漏做属主清点，候 CAO 并档。
- 修复（10:19）：`chown -R fleet:fleet` 两目录归还→`sudo -u fleet` 同身份复验跑 FLEET-RUN-OK（state/last-run 归 fleet uid 新写+快照新段落盘）。
- 意外收获：复验轮 capture 段实显 **m-duty-cos tmux 会话已复活**（值席会话重启，capture 容错分支生产首显）——名册仍 13 席无它，会话与名册注册态分离如实注记。
- 终验锚：02:45:21.326Z 下一生产轮（cron 10:47 一次性验证在挂）——fleet 身份复验绿+调度面正常，生产轮终确认预期绿。

## §五 移交与候办

- 首次生产轮 02:15:21Z（北京 10:15:21，10:03 验证 turn 勘正确认）；后续每 30min 一轮（02:45/03:15…）。停滞旗标生产显影最早=12 轮后（同态 6h）——本树 bod-watch 自身每轮刷新（快照行自指）永不停滞。
- 候办三：①四点④三模链路重建候 BOD 裁（新范围）②四点①席级 seats 映射清单候 sg 席复活补配③快照行 commit 节奏=随收口批（COO 面收口时顺带拾取，无需单列）。

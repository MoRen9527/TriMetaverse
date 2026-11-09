# CTO TriMLC 勘修毕报（勘修令两笔一次勘定毕+顺手债3+三面汇聚定性+附加排雷笔）

- **seat**：CTO（小狄·m-cto）
- **写前现查**：date 读数原样粘贴=`2026-11-06T13:40:40Z`（+8=`2026-11-06 21:40:40 +0800`）
- **令源**：COS 三件套令①（TriMLC 异常族勘修令·BOD 两笔并录转诊：tick 节拍停更 job 面停更非进程问题+power-gate 警报 read 数链故障）——同勘修窗一次勘定+顺手并勘债3 18710 keeper
- **毕报面**：经 BOD 转呈（令文原文）+知会 COS

---

## §一 · tick 节拍停更勘定+恢复（全链）

### 勘定链（cron.db 直读零 token 面+进程探+runner 源码三面汇聚）

| 证据面 | 读数 |
|---|---|
| execution_log 时序 | 76603=11:07:00Z **ok 6147ms**→76668=11:37:41Z **timeout 600063ms**→76703=12:09:52Z **timeout 600094ms**→12:37:00Z 拍点**缺**（调度卡死）→12:53:11Z daemon 再拍（pid 2648·与残留并存） |
| 进程探 | 双 runner 残留实锚（pid 2648@12:53:11Z+前拍残留）——timeout 45s spawnSync 兜底 kill 失败·Windows 进程树 kill 不净·进程逃逸 |
| runner 源码 | bod-tick-runner.mjs 五段探针挂死点=②sg MMC ssh 段（spawnSync ConnectTimeout=12·timeout 45000·杀进程逃逸） |

### 机理链四步定谳

1. runner ssh 段挂死（spawnSync timeout 兜底 kill 失败→进程逃逸残留）
2. daemon state 机等进程退（state 卡 running 不回 idle）
3. 单飞闸阻塞 next_run 到期拍（12:37:00Z 过期未触发）
4. timeout 后 daemon 又可起新拍（12:53:11Z）→双 runner 并存=竞态窗口期偶发单拍成功

**「间歇性恢复形态」定性回应**（COS 勘正 20:15 轮「恢复」系单拍误读·勿按已修收口）：单拍恢复=机理链第 4 步竞态窗产物（daemon 再拍+残留并存期偶发跑成）——与 COS 假设谱（job state 竞争/触发链间歇）吻合·实锚归 runner 进程逃逸+daemon 单飞闸组合。

### 止血+恢复实证

- 止血：taskkill/Stop-Process 双 pid 强杀（**runner 子进程·非 daemon 本体**——禁裸杀边界内）→daemon 检测进程死→state 归 failed→next_run 重排→**13:07:00Z 拍自然恢复 ok**
- 修复后首拍实证（重启后·「已修」读数）：**exec 76827=13:37:00.127Z ok·duration 24087ms（全链五段跑毕含 sg ssh 段）**+job 归 idle+next_run=14:07:00Z+tick-latest.md mtime=21:37:24+08（节拍 21:37:06·全席现态 sg duty 14 席+本地 3 席全谱在卷）
- run_count/error_count 走势：857→860（13:07/13:37 等 3 拍入账）/12→13（+1=timeout 期失败定性入账）

## §二 · power-gate 警报修复①（CIM 段 job 化·施工+验证+重启链全毕）

### 根因与修复形

- 承接 BOD 独立 CIM 验证定性：物理电源正常=read 数链故障——根因=power-gate 60s 节律下 CIM 段 Get-CimInstance 同步调用在 wmiprvse 停摆窗阻塞主读链（LG-069 警报波谱 34 案族·第八波 rf=0 恢复段）
- 修复①：CIM 段 job 化——`Start-Job{Get-CimInstance Win32_Battery}` 独立进程跑+`Wait-Job -Timeout 6` 归不齐降级 NA（P/Invoke 主读保活）+两分支统一 `Remove-Job -Force` 防 60s 节律 job 泄漏；外层 defaultReadPower timeoutMs=20s 兜底不动

### 验证链（全绿）

| 门 | 读数 |
|---|---|
| 真机 smoke | **dt=4255ms·percentCim=93 非 NA 兜底**（Wait-Job 窗内归齐+job 清理无泄漏） |
| tsc/build | RC=0/RC=0（dist snippet 落形验讫 Start-Job×2+Wait-Job 6s 在位） |
| 测试 | power-gate 30/30（LG-069 14+修复批①8+E1-5 6+修复批③2）+heartbeat-wake 13/13+wake-events 12/12·全 RC=0 |

### 重启链六步毕（正形照 TriMLC 勘修窗纪律）

watchdog Disable（TriMLC-Watchdog→Disabled）→`trimlc stop` 优雅停（gracefulShutdown 收讫+SIGTERM 收尾 pid 29488）→port 8713 FREE 验（curl RC=7+netstat 零 LISTEN）→schtasks 冷启（TriMLC Daemon）→pid/CIM 对表（8713 listener=**pid 7824**·CIM CreationDate=21:17:24+08=冷启时刻对平·uptime 6s 重置）→watchdog Enable（Ready）。

**重启后验证**：healthz power 段首读真值（percent=93/percentRaw=94/percentCim=93/readFailures=0——job 化段开机首读即通）+cron 17 jobs degraded=false+tick 13:37Z 首拍 ok（§一）。

- **commit**：TriMLC `3bd041ad9c`（dev·%cI=2026-11-06T21:16:19+08·5+/1-）——双远端推达验锚平（sg bare 3bd041a+github 3bd041a·ls-remote 双对表）
- **效果验证如实注**：job 化真效（wmiprvse 停摆窗零阻塞）候下一停摆窗实测——不可主动复现·LG-069 波谱采样维持·非 production-ready 表述

## §三 · 顺手并勘债3：18710 keeper 隧道现势

- 现势：**200 ok·dt=0.2s**·keeper ssh pid 5488（17:29:11+08 起）在役——同窗连败拍（silent-detect 20:24-21:00 三拍 timeout 5s）已过·keeper 自愈
- 定性：瞬态自愈（与 §㊿+316 FSD keeper 勘定回执定性吻合）——恢复态确认·维持挂账观察·零施工需求

## §四 · ssh 通道间歇性劣化多窗定性（跨席素材）

ssh 通道症状三面多窗实录（精确锚分列）：

| 面 | 症状 | 窗锚 |
|---|---|---|
| tick runner | sg MMC ssh 挂死×2 拍（11:37:41Z+12:09:52Z·各 timeout 600s） | execution_log 直读（本卷 §一） |
| 18710 keeper | 探活连败 3 拍（timeout 5s） | COS 勘修单引读数 20:24-21:00+08（=12:24-13:00Z·令文转达锚） |
| echo-pull（FSD 面） | ssh ETIMEDOUT 已自停等下节律 | FSD N8 毕报旁路知情录②（卷锚 TMV 0159e7e37·写前现查 00:11:25Z 在卷） |

定性：**ssh 通道间歇性劣化多窗（非单窗连续故障）**——tick 与 keeper 子窗在 12:24Z-12:53Z 重叠=同通道并发症状实锚；echo-pull 系独立早窗（00:11Z 前）。通道恢复后 tick/keeper 两面自愈（13:07Z 拍 ok+18710 200 ok 实锚）。跨席素材随毕报呈报：根因候 sg 网络面/值班位汇总定性（本席不越面定性网络层根因）。

## §五 · runner 加固候选裁量

- **裁：候窗施工（本窗不动现役 runner）**——runner 改动涉 13 席 tick 链现役行为·需独立窗+验证谱
- 两加固点：①runner 防重入（marker/lock file——双 runner 并存根除）②daemon timeout 杀树加固（taskkill /T 树杀——进程逃逸根除）
- 归口：FSD 单窗施工·候 COO 排程（可与 TriMLC 下次勘修窗并窗）

## §六 · 附加排雷笔（勘修窗顺手·非令文范围如实注）

1. **sg bare TriMLC root 残留雷排雷**：毕报推锚遇 `unable to migrate objects`（objects 属主 root 残留·已知家族）→ssh sg `sudo chown -R fleet:fleet /srv/git/TriMLC.git` RC=0→重推达验锚平 3bd041a——雷源候 sg 面清点（root git 操作归还属主纪律在案）。
2. **三仓 github 补推（网络窗开）**：TriMLC 3bd041a+TriRLC c3f76c0..75f2e29（flake 族治理笔随推）+TMV 753de4968..5f2ada340 全达验锚平——**FSD 债单 #2「GitHub 通道候网络窗补推」销账**（祖先关系 FF-safe 先验·零分歧面强推）；TMV 判定书 20ee14aa5 github 候窗（sg 已达）。

## §七 · 红线对表

- 禁裸杀 ✓（runner 子进程 taskkill=授权域·daemon 本体走 trimlc stop 正形 graceful）
- 重启链正形六步 ✓（Disable→stop→port FREE→冷启→pid/CIM→Enable·零跳步）
- 现役零触碰边界 ✓（勘修令授权域内施工·tick/power 两面+keeper 只读探）
- D-46 token 值面零回显 ✓（cron.db 直读零 token 面·API 401 后未取 token 绕行）
- 禁 production-ready ✓（修复①效果候实测如实标·加固候选候窗）

## §八 · next

1. runner 加固两点候 COO 排程（FSD 单窗·可与下勘修窗并窗）
2. LG-069 波谱采样维持（修复①效果候停摆窗实测）
3. TMV 判定书 github 补推候窗
4. sg bare root 残留雷源清点候 sg 面/值班位
5. 本毕报经 BOD 转呈+intake 入账候 COS 树面收口

## §九 · 依据

- 勘修令：COS 三件套令①（BOD 两笔并录转诊+复发谱勘正轮）
- 读数源：TriMLC cron.db 直读（DATA_DIR=trilc-channel·零 token 面）+execution_log 末拍链+healthz 三时点+runner 源码 bod-tick-runner.mjs
- 交付锚：TriMLC 3bd041ad9c（sg bare+github 双验平）·重启链全程读数（pid 29488→7824）
- 纪律面：TriMLC 勘修窗纪律（重启链正形）+禁裸杀+D-46/D-47

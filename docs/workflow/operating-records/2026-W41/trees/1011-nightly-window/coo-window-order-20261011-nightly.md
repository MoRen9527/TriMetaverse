# 三栏深夜窗令 · 10-11（周日）22:30-01:00 · sg TriMMC 修复 / R1 8711 复活 / 本机 8713 S4U 换形

- sourceOfTruth: 本件（trees/1011-nightly-window/coo-window-order-20261011-nightly.md）
- syncMode: static
- lastSyncedAt: 2026-10-09T11:20:51+08:00（date 现查原值·本席签发候 BOD 认账）
- 签发位: COO 小营（三栏分机分带排窗·BOD 11:19 三栏排窗令）
- 令源链: BOD 11:19 知会（三栏正式排窗候本席成稿·三方案稿均 BOD 认账态）→本席 11:2x 成稿→**生效条件=BOD 认账**
- 令源三稿: sg 段=TriCompany agent-core **@1713614**（sgB cron 两锚修复·READY_FOR_DEPLOY 备码态）+FSD 交接要点卷 @39c2fba4（部署窗门禁第四条）；R1 段=trirlc-8711-revival-plan-20261009.md **@22fd1090**（BOD 11:19 认账 final·稿面 syncMode 行候 CTO 勘 final）；本机段=trimlc-daemon-hardening-plan-20261009.md **@6141a459**（final·BOD 认账）

## 一、三栏总表

| 栏 | 对象 | 方案正形（窗令不重抄工序·值席/施工席照稿执行） | 执行位 | 门 | 回滚 |
|---|---|---|---|---|---|
| sg 段 | sg TriMMC 8712（loopback+隧道·裁 A 现役形态） | TriCompany agent-core **@1713614** 两锚修复部署（stale 守卫+settle 兜底·「调度活执行停」家族根治）+交接要点 @39c2fba4 | sg 值席 | **门禁第四条（部署前）**：jobs.json 现役 job timeoutMs 全谱 vs staleRunningMs=20min 校准——有超 10min 者当场调该最大值 ×2 再 build（误清机理注：合法长跑 runningAtMs 存活上限≈timeoutMs·阈值须留 ×2 slack） | 照 TriCompany 部署惯例回滚面 |
| R1 段 | 河源 trilc-headless.service（8711·死 8 天） | 复活方案稿 @22fd1090 §二：**enable+start 恢复性两步**（河源 root 通道·dist/unit/.env 全零改动） | sg 值席（sg 段毕后接续·同席串行） | V1-V4（V1 healthz+NRestarts=0/V2 store 存量对表如实记/V3 F-3 家族活体验证[临时 job POST→验 next_run_at→DELETE]/V4 72h 观察） | stop+disable 两步回死态（零残留） |
| 本机段 | 本机 TriMLC 8713（console 生命周期绑定根治） | 形态治理稿 @6141a459 §二：**两入口合一 S4U 换形**（schtasks 重注册+watchdog revive 改 Start-ScheduledTask·两文件链） | 本机 FSD（8713 域操作惯例位·SDE 备援） | H1-H4（H1 healthz+jobCount=8/H2 **待机-恢复存活专项=核心门**[pid 存活+watchdog 零 DOWN+隧道 keeper 自愈+18710 可达]/H3 双 200+notifyFailures 恒 0/H4 7 天自然观察） | 旧任务 XML+watchdog.ps1 备份→恢复旧定义+重启 |

## 二、窗位与分带时序

- **窗框：10-11（周日）22:30-01:00（硬锚）·预计 00:30 前收**。D-23 对轨：周日非工作日·14:00-18:00 禁排区不适用；窗位在 GLM 轨黄金段（18:00→次日 14:00·最优子段 18-24/0-9）。
- **分带并行**：sg 值席链（sg 段→R1 段串行·换段留 ~10min 机位切换缓冲）×本机 FSD 带（独立并行）。

| 时点 | sg 值席链 | 本机 FSD 带 |
|---|---|---|
| 22:30 | 开窗·sg 段门禁校准起 | 开窗·S4U 换形起（H1） |
| ~23:2x | sg 段毕报→换段 | H3 通知链回归 |
| ~23:3x | R1 段 enable+start（V1/V2/V3 顺跑） | 23:45± **H2 待机专项**（见预告条款） |
| ~00:1x | R1 段毕报 | H2 断言毕（pid/零 DOWN/keeper/18710） |
| ~00:30 | **窗收口毕报**（全绿） | 同 |

- **H2 待机预告条款**：本机段 23:45± 人为待机→恢复（~10min 本机全离线·本机席会话挂起）——FSD 提前 10min（23:35）预告 BOD+sg 值席；预告窗内 sg/R1 链异常=**停报等本机恢复勿候判**（悬空容忍 ~10min）。
- **硬约束注记**：①21:00 绩效首跑（8713 面 job·nextRun 10-11 21:00+08 已锚）→本机段窗位 22:30 起=首跑+读数验毕后 1h+ 缓冲；②8713 换形重启瞬断知会：bod-tick 节拍（7,37 半小时拍）当次拍延迟=BOD 面知情项非异常；③联审 job（nextRun 10-11 12:00+08）不在窗内零涉。

## 三、施工纪律（LG-066 族照带）

1. token 值面禁回显；命令面涉 token 一律 sed 提取形+长度断言。
2. 河源 root 操作后 find -user root 清点+chown 归还（R1 段 root 通道适用）。
3. F-3 家族纪律：8711 复活后任何新建 cron job（含 V3 探针临时 job）POST 201 后必验 next_run_at 值面，空则 PATCH {schedule} 同值 recompute（API 正途禁手写库）。
4. systemctl 实勘枚举按 ExecStart/WorkingDirectory 对表；完工判据=ExecMainStartTimestamp＞施工时点（active≠重启）。
5. 备份锚先行（R1 零改动免·本机段两文件备份 @6141a459 §四）；trap 回滚锚全程在挂。
6. 值席在位确认：开窗前 sg m-duty-cos 会话实体在位自查毕报本机席。

## 四、异常即报与毕报链

- 任一栏超窗内时点或门 fail→**停+报**（sg/R1 链→本机 COO/CTO；本机段→CTO+COO）不自动修不滑步；超窗框硬锚=窗收即报 BOD。
- 毕报链：各段毕报（sg/R1→COO+CTO 两刻；本机段→COO+CTO）→窗收口毕报 BOD→本席窗毕锚入 operating records。
- 观察窗挂账：V4 72h→**10-14 收口巡检**；H4 7 天→**10-18 收口巡检**（两挂账本席督办面）。

## 五、裁口与候办

- **V2 裁口（候 BOD 随令裁）**：8711 死 8 天过期 job 触发面归属——V2 门只做存量如实记（死期零写入·存量应=死前原样），过期 job 的触发/清理处置候 BOD 裁口，不阻 R1 施工。
- 8711 dist 升级候办（仓顶 ff2f970 漂移·build+重启）**不混本窗**·另排（@22fd1090 §二裁量）。
- H4/V4 巡检收口时点已锚 §四。

## 六、窗前清单

1. 三方案稿在位终态确认（@1713614 备码/@22fd1090 final/@6141a459 final）。
2. 值席在位确认（§三.6）。
3. BOD 认账本令（生效条件）。
4. V2 裁口随令裁毕（或注记「窗内占位候裁」）。
5. 本机 FSD 施工面就位确认（S4U 注册权限面·PowerShell 管理员域）。

## 使用依据

- BOD 11:19 三栏排窗令；TriCompany @1713614（sgB 两锚修复备码）；trirlc-8711-revival-plan @22fd1090；trimlc-daemon-hardening-plan @6141a459；FSD 交接要点 @39c2fba4；D-23 排程窗口指导表（周日窗位对轨）；LG-066 窗令族施工纪律惯例

# STE A5 段2 毕探读数卷（六件全款·本机窗段补探+R-HY/sg 远端探）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/ste-a5-seg2-probe-readings-20261009.md）
- syncMode: static（读数实录卷；判读与读数逐一对应 A5 探针单 @6b3e7568 v3 恢复正身形）
- lastSyncedAt: 2026-10-09T23:16:25+08:00（date 现查原值·勘注笔；原落卷笔 23:09:42）
- **勘正注记（23:16+08·BOD 23:15 终裁收编）**：本卷 P2-3 节两处归因推断（「l2 改址版未部署」+「wscript 进程死亡」互证语）被终裁定谳勘定推翻——真因=①电池条件门（探针零病）②l1 判定面旧拓扑 latch（l2 hash 定谳=改址版零刀工）；读数本体全款留档有效；勘正详情见 P2-3 节〔已勘正〕子条，原文留卷不删（历史层叠）。
- 执行席: STE 小柯（m-ste·本机窗段）；令源=COO 22:58:15 A5 段2 毕探放行令（+23:09:08 勘正信：P2-5 免重验照跑收敛——本席 23:0x 复探与 CTO 22:59 验毕双面互证 401✓ 零冲突）
- 探窗: 23:03-23:09 CST（放行令 22:58:15 即启）——**时点偏移如实注记**：晚于 v3 原预期 ≈20:30 约 2.5h，归因=毕报链断 4h（段2 毕 19:03:29 CST 由 CTO 活体勘钉死 d74fd9e4）；活体现势勘验判定有效（COO 令文原语义）。偏移对断言面影响评估：监听面/healthz/env 计数=稳态读数不因偏移失效；LOGSFRESH=90min 滚动窗读数（覆盖 21:39 后窗段）读数 yes=时效覆盖成立；ExecMainStartTimestamp 完工判据=与段2 毕时点逐字同值成立
- 段2 毕实证基线: 段2 已毕 19:03:29 CST（trirmc active·8710 在听·healthz 全绿·cron 三滚——CTO 勘卷 d74fd9e4 代毕报）；本卷读数=毕后 ≈4h 现势复验

## 一、六件读数实录

### P2-1 三判据① healthz@8710+监听面终态 — **绿**

| 读数 | 实测 | 预期 | 判 |
| --- | --- | --- | --- |
| ss 监听 | `0.0.0.0:8710` 行在；`:8712` 计数=**0**（空置断言成立）；`:3333` 行在 | 8710 在+8712 零行+3333 在 | ✓ |
| healthz@8710 | `{"ok":true,"service":"trirmc","mcLedger":"ok","cron":{"enabled":true,"jobCount":3,"degraded":false,"consecutiveFailures":0}}` | 全形同构（app.ts L116-142 实锚） | ✓ |
| 完工判据 | ExecMainStartTimestamp=`Fri 2026-10-09 19:03:29 CST` | ＞restart 时点（=段2 毕时点逐字同） | ✓ restart 生效实证（LG-058 教训族断言过） |

### P2-2 三判据③ cron 面 — **绿**

- LOGSFRESH=**yes**（/var/lib/trirmc/cron/logs 90min 新鲜度窗内滚动在）；cron 块四字段 enabled:true/degraded:false/consecutiveFailures:0 同 P2-1。
- 到点真触发确认照 A5 注记归 N3 72h 观察窗，不压本探窗。

### P2-3 三判据② l2 探针回对 — **红（l2 值席面自身两缺陷·非段2 施工缺陷）**

实测（23:0x 读 `%LOCALAPPDATA%\tri-liveness\`）：

- **探针停摆实证**：l2.log mtime=`2026-10-09 21:40:05`；尾部最后日志行 ts=`2026-10-09T13:40:02Z`（=21:40:02 CST）——**21:40 后零新滚动**（至读数时点 ≥1.5h）。与 CTO 终勘 d09828b9「l2 停因=21:40 wscript 进程死亡未复活」互证；l2-failcount=1 在档（熔断弱化候勘的日志侧实证读数）。
- **旧版误报实证**：停摆前滚动段（尾部 12 行覆盖 19:50-21:40 CST）全部为 `dim=relay host=R-HY` 警报：`unit=trirmc-mc state=inactive`（=段1 后预期态）+`unit=trirmc-8712 state=healthz-unreachable`（=段2 后预期态）被列为 issue——**旧版判读语义不认识 LG-066 后终态**=Q2.3 改址版未有效部署（CTO 勘卷「Q2.3 改址未执行」定性互证）。
- **判读**：A5 正形「本机 l2 跑改址版全链 OK all-hosts」**不成立**。归因分层=①l2 改址版未部署 ②l2 进程 21:40 死亡未复活（后者已立候勘案·四假说候勘——本席读数为其供日志侧实证：末滚时点 21:40:02Z+failcount=1）。**非段2 施工缺陷**：段2 终态五面读数全绿（P2-1/2/4/5/6）证明本体迁移面正确，8712 空置与 trirmc-mc inactive 均为施工预期终态，l2 警报内容与终态矛盾恰证 l2 判读面陈旧。
  - **〔已勘正〕归因终裁定谳（BOD 23:15 终裁·COO 23:15:30 收编回执转达）**：上条两处归因推断均被终裁勘定推翻——①停摆真因=**电池条件门**（evt105 交流→电池+任务缺省 DisallowStartIfOnBatteries=True+StartWhenAvailable=False；**探针零病**，CEO 插电自然复活——「wscript 死亡」假说族随终裁闭）；②误报真源=**l1 判定面旧拓扑 latch**（**非 l2 脚本**：现役 l2 经 hash 定谳=改址版本体零刀工——「Q2.3 改址版未部署」推断随终裁闭）。本席读数本体（末滚时点 21:40:02Z/mtime 21:40:05/failcount=1/误报内容逐项）**留档有效**（CTO 候勘案日志侧证据面）；l1 latch 扫尾在案项。教训：探针面读数实证与归因推断分层落卷——本笔原卷已分层（读数/归因两段），归因段引卷面定性转述时未独立验 hash 面，勘此存照。
- **纪律执行**：fail=停+报不自动修——本席不动 l2（不重启不代部署），如实落卷上报；l2 修复归 l2 值席面/候勘窗（CTO 四假说候勘案在册）。

### P2-4 四口终态（分位执行） — **绿（四口全量）**

| 口 | 位 | 实测 | 判 |
| --- | --- | --- | --- |
| R 8710 | R-HY trirmc | P2-1 顶（0.0.0.0 在听+healthz 全绿） | ✓ |
| M 8712 | sg 本机回环 TriMMC | healthz `ok:true`+`service:"trimmc"`+cron jobCount:10（稳定现役·裁 A 语义实证） | ✓ |
| R 8711 | 本机 dev TriRLC | healthz ok+`mc_peer:"trirmc"`+degraded（CTO 口径=链路通+token 门活双重证据，非 fail） | ✓ |
| M 8713 | 本机 dev TriMLC | healthz ok+`mc_link:"connected"`+cron jobCount:10 | ✓ |

（8713 power 面 acOnline=false/gate=none 如实注记，非本探判据。）

### P2-5 neg 复探（token 门在岗） — **绿**（与 CTO 22:59 验毕双面互证）

- neg body=`{"error":"unauthorized: missing or invalid X-Internal-Token"`+HTTP `401`（app.ts L156-158 实锚）——bind 0.0.0.0 后唯一安全控制在岗（N1 裁决关键断言）。
- 红线遵守：无 token 形止步，正确 token 形态未触发，零写面试打。

### P2-6 mcLedger 与「改动最小面」判读锚 — **绿**

- `TRIRMC_MC_DB_PATH=` 环境键计数=**0**（主 unit 无该键=DB 路径走代码默认 /var/lib/trirmc/mc-store.sqlite）；mcLedger=`"ok"`。
- 判读：两读数与窗前一致→**不补键**（改动最小面成立）；未见 DB 分裂实证。

## 二、STE 判读汇总

- **段2 施工面（P2-1/2/4/5/6 五件）=全绿**；完工判据（Timestamp＞restart 时点·19:03:29 逐字同值）成立；token 门在岗；空置断言（8712 零行）成立；改动最小面成立。
- **l2 面（P2-3）=红**，两归因均已在册候勘/候办（Q2.3 改址未执行+l2 21:40 进程死亡四假说候勘），本席供日志侧实证读数（末滚 21:40:02Z+failcount=1+误报内容与预期终态逐项对表）。
- 三分法：段2 施工面 **PASS**；整体六件=**CONDITIONAL**（P2-3 红为 l2 值席面独立缺陷，不遮段2 施工面，判定权归 CTO/COO——STE 面只供读数与绿/红判定，A5 §〇 分位声明）。
- **N3 72h 观察窗挂账照 v3 §八在册**（本席窗后挂账：河源 8712 空置并轨观察·10-12 晚毕后放归服务域池）——窗收口后落账。

## 三、注记

- jobCount=3 无段1 基线在手：基线在 sg 值席段1 盘点快照卷面——本席以 LOGSFRESH=yes+consecutiveFailures=0+degraded=false+CTO 勘卷「cron 三滚」互证 jobCount=3 为活体正常值；基线同值对表留值席卷面（如实分界防假覆盖）。
- 本席 23:0x 探针全款只读（ss/curl/systemctl show//proc environ 读/本地日志读），零写面零 sudo；token 值面零回显（计数与 401 码面止步）。
- 毕报链断 4h 异常本体（值席 19:03 后静默·毕报零产出）候 BOD 处置面非本卷范围；本卷=STE 探针面读数实录，为 COO 对表揭示与 CTO 勘卷提供段2 终态独立复验第二读数源。

## 四、使用依据

- A5 探针命令单 @6b3e7568（v3 恢复正身·f2000e57 勘回笔）
- COO 放行令 22:58:15+勘正信 23:09:08；窗令 v3（§三段2 锚/§八毕报链/§四 8712 空置并轨 N3 72h）
- CTO 勘卷 d74fd9e4（段2 毕 19:03:29 活体钉死）+终勘补记 d09828b9（l2 停因候勘案）；COO 收口跟踪卷 23c70988
- 代码实锚：TriRMC src/server/app.ts L116-142（healthz 全形）/L145-161（token 门 401）/src/config/env.ts L47（mcDbPath 默认）

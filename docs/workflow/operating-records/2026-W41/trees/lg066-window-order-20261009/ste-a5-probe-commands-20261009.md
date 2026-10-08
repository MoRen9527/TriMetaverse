# STE A5 探针命令单 · LG-066 STE 三探针 sg 值席可执行化（只读全形+预期值面）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/ste-a5-probe-commands-20261009.md）
- syncMode: static（命令单正形；预期值面全代码级实锚）
- lastSyncedAt: 2026-10-09T01:50:30+08:00（date 现查原值·凌晨段；CEO 01:46 全线停工令下落盘留痕件）
- 执行席: STE 小柯（m-ste）；令源=COO 排工令 01:42:54（接 BOD 01:34:40 知会·三齐条件③快核面）
- 消费位: sg duty 值席（窗内执行）；判读与毕报归 sg 值席转本机 COO/CTO
- 状态: **卷正形落位（v1.1 复工勘形）**；本席未跑窗内自验（照原序候窗），窗令流转面候 COO
- 勘形注记（复工自验 03:3x）：P1-4/P2-6 token/env 计数原 `<(...)` 进程替换形依赖远端 login shell=bash（dash 无进程替换）→改**管道形**（零嵌套零依赖，sh 兼容）；引号面复查=外层单引号内全双引号零单引号嵌套（ssh 转发安全）；`tr "\0"` 双引号形与 l2 现役 `'\0'` 单引号形在 GNU tr 等价（R-HY Linux 实证面）
- 丢笔复原注记：merge b006ef71（03:31:53 收编并行笔）曾将本卷倒退合并回 v1.0 形（勘形三处被另一分支线旧文本覆盖）——本席复原笔正向追加，v1.1 语义以本笔为准

## 〇、执行形与通用纪律

- **通道**：sg 值席本机执行 `ssh heyuan '<命令>'`（别名实锚=sg ~/.ssh/config heyuan，CTO 01:27 实勘通道；若别名漂移以 `grep -A2 -i heyuan ~/.ssh/config` 实探为准）——下文命令单均指「引号内命令在 R-HY 执行」。
- **全只读非特权**（CTO 动词索引 §三）：is-active/show、curl、find/stat、/proc/environ 读——fleet 身份直接执行**不挂 sudo**（挂了撞白名单拒绝=自造 fail）。
- **token 值面零回显**：token 存在性只验计数（`grep -c`），禁 echo/cat 全值——同 l2 Get-Token 读法纪律。
- **fail 行为**：任一读数不符预期=停+报本机席（不自动修不滑步）；禁窗内扩判据外动作（白名单/探针面同律）。
- **分位声明**：本单覆盖 sg 值席可达面（R-HY 全件+sg 本机 8712）；四口终态的**本机 dev 两件（8711 TriRLC/8713 TriMLC）+l2 全链判读（M-SG 段+debounce+18710 告警链）不在 sg 单**——归本机窗段 STE 补探+l2 值席面，如实分界防假覆盖。

## 一、段1 毕探（本体留 8712 全绿验收·STE 三探针=daemon 单点+cron 面+面路由回对）

### P1-1 daemon 单点与监听面

```bash
ssh heyuan 'ss -tln | grep -E ":(8710|8712|3333)" ; echo "---units---" ; for u in trirmc trirmc-mc; do echo "$u active=$(systemctl is-active $u 2>&1) enabled=$(systemctl is-enabled $u 2>&1)"; done ; systemctl show trirmc -p ExecMainStartTimestamp --value'
```

| 读数 | 段1 毕预期 | fail 判读 |
| --- | --- | --- |
| ss 监听 | `127.0.0.1:8712` 行在 + **`8710` 零行（消失断言）** + `:3333` 行在（TriModel 不相干面锚） | 8710 仍在=trirmc-mc 未净；8712 缺=本体被误动 |
| trirmc-mc 双态 | `active=inactive`；`enabled=disabled` **或 `not-found`**（unit 已移备份位后取值） | active=停用未达；nonLoaded 异形=升报 |
| trirmc 本体锚 | ExecMainStartTimestamp=**施工前原值不变**（段1 零触碰本体——Timestamp 变=本体被意外重启即 fail） | 与窗前基线对比，禁以 is-active 代 |

### P1-2 healthz 值面（8712）

```bash
ssh heyuan 'curl -s --max-time 4 http://127.0.0.1:8712/healthz'
```

预期 JSON 全形（代码实锚=TriRMC src/server/app.ts L116-142）：

```json
{"ok":true,"service":"trirmc","mcLedger":"ok","cron":{"enabled":true,"jobCount":<基线值>,"degraded":false,"consecutiveFailures":0}}
```

- 判读：`ok:true`+`service:"trirmc"` 逐字；`mcLedger:"ok"`（MC 台账 sqlite 打开成功=本体自持 store 面，不依赖 mc 面存活）；`cron.enabled:true`+`degraded:false`+`consecutiveFailures:0`（l2 同款断言）；`jobCount` 对段1 工序盘点快照基线（同值）。
- mcLedger 非 ok / degraded:true / jobCount 漂移=停+报（禁窗内猜因续跑）。

### P1-3 cron 面

```bash
ssh heyuan 'find /var/lib/trirmc/cron/logs -type f -newermt "-90 minutes" 2>/dev/null | head -1 | grep -q . && echo LOGSFRESH=yes || echo LOGSFRESH=no'
```

预期 `LOGSFRESH=yes`（l2 同款 90min 新鲜度）。

### P1-4 面路由回对与 token 门在岗（段1 语义=路由未断+门活）

```bash
ssh heyuan 'SF=$(ls -t /var/lib/tri-liveness/state-*.log 2>/dev/null | head -1); if [ -n "$SF" ]; then echo "STATEAGE=$(( ($(date +%s) - $(stat -c %Y $SF)) / 60 ))"; else echo STATE=absent; fi ; tr "\0" "\n" </proc/$(systemctl show -p MainPID --value trirmc)/environ | grep -c "^TRIRMC_INTERNAL_TOKEN=" ; curl -s -o /dev/null -w "%{http_code}\n" --max-time 4 http://127.0.0.1:8712/internal/v1/agents'
```

| 读数 | 预期 | fail 判读 |
| --- | --- | --- |
| STATEAGE | ≤15（l1 statefile 滚动中） | >15 或 absent=l1 断=升报（statefile-stale≠host down，如实传读数不臆断） |
| token 计数 | `1`（仅数字输出——零值面回显） | 0=门未配（届时 neg 读数会 200 fail-open——以计数为准升报，非探针错） |
| neg 401 | `401`（无 token GET /internal/v1/agents） | 200 且计数=1 才是门破；200 且计数=0=门未配（同上行） |

**段1 STE 判读汇总**：P1-1/P1-2/P1-3/P1-4 全绿 → 段2 资格（GO 断点供 FSD/CTO 判读，STE 面只供读数与绿/红判定）。

## 二、段2 毕探（迁 8710 原子切换后·restart 完成 ≥5min 内执行）

### P2-1 三判据① healthz@8710+监听面终态

```bash
ssh heyuan 'ss -tln | grep -E ":(8710|8712|3333)" ; curl -s --max-time 4 http://127.0.0.1:8710/healthz ; systemctl show trirmc -p ExecMainStartTimestamp --value ; ss -tln | grep -c ":8712" || true'
```

| 读数 | 段2 毕预期 | fail 判读 |
| --- | --- | --- |
| ss | `0.0.0.0:8710` 行在 + **`8712` 零行（空置断言·并轨 72h 观察窗）** + 3333 在 | 8712 仍听=切换未净/回滚未净 |
| healthz | 全形同 P1-2（ok/service/mcLedger:ok/cron 块四字段全同段1 基线） | 任一字段漂移=停+报 |
| 完工判据 | ExecMainStartTimestamp **＞restart 时点**（正形启用——段2 才有此断言，段1 是不变断言） | =原值=restart 未生效（active≠重启，LG-058 教训族） |

### P2-2 三判据③ cron 面

```bash
ssh heyuan 'curl -s --max-time 4 http://127.0.0.1:8710/healthz | grep -o "\"cron\":{[^}]*}" ; find /var/lib/trirmc/cron/logs -type f -newermt "-90 minutes" 2>/dev/null | head -1 | grep -q . && echo LOGSFRESH=yes || echo LOGSFRESH=no'
```

预期 `enabled:true`+`degraded:false`+`consecutiveFailures:0`+LOGSFRESH=yes。判读注记：5min 窗断「服务面绿+近期有滚动痕迹」；**到点真触发确认归 N3 72h 观察窗**（升格①语义），不压 5min 窗。

### P2-3 三判据② l2 探针回对（sg 侧单段等效）

sg 值席复刻 l2 R-HY 段读数行（P1-1 units+P2-1 hz+P1-3 LOGSFRESH+P1-4 STATEAGE 四组）——**判读正形=本机 l2 值席跑 `tri-liveness-l2.ps1`（段2 改址版部署后）全链 OK all-hosts**；sg 单段等效只断字段级同构，全链判定不在 sg 单（防假覆盖）。l2 版本锚=`scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1` 预 commit（段2 窗内 cp 覆盖，窗前禁部署）。

### P2-4 四口终态（分位执行）

| 口 | 位 | 探形 | 预期 |
| --- | --- | --- | --- |
| R 8710 | R-HY（本单 P2-1） | healthz+ss | ✓ 上行 |
| M 8712 | sg 本机回环 | `curl -s --max-time 4 http://127.0.0.1:8712/healthz`（TriMMC） | `ok:true`+cron 块同构（l2 M-SG 段同款断言现役实证） |
| R 8711 | 本机 dev | **sg 不可达——归本机窗段 STE 补探** | healthz `mc_peer` 读数现势如实（degraded=链路通+token 门活双重证据，CTO 口径非 fail） |
| M 8713 | 本机 dev | 同上分位 | healthz ok |

### P2-5 neg 复探（bind 0.0.0.0 后唯一安全控制在岗=N1 裁决关键断言）

```bash
ssh heyuan 'curl -s --max-time 4 http://127.0.0.1:8710/internal/v1/agents ; echo ; curl -s -o /dev/null -w "%{http_code}\n" --max-time 4 http://127.0.0.1:8710/internal/v1/agents'
```

预期 body 前缀 `{"error":"unauthorized: missing or invalid`+状态码 `401`（app.ts L156-158 实锚）。**红线：正确 token 形态禁触发**（无 token/错 token 两形止步；禁对任何写面端点带真 token 试打）。

### P2-6 mcLedger 与「改动最小面」判读锚（CTO 12:05 裁）

```bash
ssh heyuan 'tr "\0" "\n" </proc/$(systemctl show -p MainPID --value trirmc)/environ | grep -c "^TRIRMC_MC_DB_PATH=" ; curl -s --max-time 4 http://127.0.0.1:8710/healthz | grep -o "\"mcLedger\":\"[a-z]*\""'
```

预期：计数 `0`（主 unit 无该键=DB 路径走代码默认 /var/lib/trirmc/mc-store.sqlite=§九注记 2 现状）+`mcLedger:"ok"`。判读：两读数与窗前一致→**不补键**（改动最小面）；唯见 mcLedger 非 ok 或 DB 分裂实证（两 store 并存读写分叉）→如实报候 GO 断点裁（非本席判）。

**段2 STE 判读汇总**：P2-1..P2-6 全绿+本机 l2 全链绿+四口分位齐 → 段2 收口资格供 CTO。

## 三、回滚探（两层语义分形·防「回端口」误当「回架构」）

| 形 | 触发面 | STE 复探读数 | 预期终态 |
| --- | --- | --- | --- |
| **R-1 段2 回滚**（本体回 8712，mc 面保持段1 停用态） | 段2 三判据任一不达·人工判 | 8712 healthz 全形复绿（同 P1-2）+8710 零行+trirmc `enabled=enabled`+ExecMainStartTimestamp＞回滚 restart 时点+trirmc-mc 仍 inactive | **段1 后态还原**（8712 唯一 daemon 面·架构单单元方向不变） |
| **R-2 全窗回滚**（mc 复活，白名单 enable+start） | 段1 即败·窗止 | trirmc-mc `active=active`+`enabled=enabled`+ss=`0.0.0.0:8710`+`127.0.0.1:8712` 双行在+8712 healthz ok+本体 mcLedger ok | 施工前基线还原（任务书 N3+ 基线：8710=trirmc-mc·0.0.0.0／8712=trirmc·127.0.0.1／3333=TriModel·0.0.0.0） |

R-2 后 STATEAGE/LOGSFRESH 照 P1-3/P1-4 复探（l1 恢复滚动）。

## 四、使用依据

- 窗令 v2（§二段1 工序/§三三锚/§四窗序/§九注记 2·4·5 DB 键判读）+任务书（N3 验证面/N3+ 端口基线/N4 分段连环+升格①②③）
- CTO 动词索引 @e135f445（§三非特权注记/白名单边界）+CTO N1 APPROVE（二.2 bind 裁决+token 门=唯一安全控制/CPO 端到端口径=degraded 可达即达标）
- 代码实锚：TriRMC src/server/app.ts L116-142（healthz 全形）/L145-161（token 门 401 形与 fail-open-on-unset 行为）/src/config/env.ts L47（mcDbPath 默认）；l2 预 commit 版 R-HY 段读数行（tri-liveness-l2.post-lg066-seg2.ps1 L75-103）
- S5 走查活体探针族方法论（B verify/D 基线/E 400 拒/neg 401——零态变双证/值面零出机/fail-closed 负例三件移植）；S3 判据卷探针四连（TriRMC 只读一连+红线禁真停）
- 停工令注记：CEO 01:46 全线停工（电量保命）——本卷=进行中卷落盘留痕件；窗内自验未跑，复工后候 COO 派验，13:00 门前毕约束随复工令重算

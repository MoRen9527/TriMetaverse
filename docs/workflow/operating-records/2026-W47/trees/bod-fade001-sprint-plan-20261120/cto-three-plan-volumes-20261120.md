# CTO 三方案卷（观察面两新件勘定配方+node:sqlite 勘正分层方案·候 COO 排窗并批）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·三方案正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接源: COO 台账 662（ca66d5075e·三方案候排窗承接确认+并窗候选归并承录——与残面五件+bak 实体退役+mc_link token 窗同族归并）
- 预勘基: C3 毕报观察面两新件（807514ac5 §三）+431a85a1 定性卷残面（4917ba16f §三）——本卷预勘四实锚=本机检出实物读数（非推断·D-24）

## §〇 · 预勘实锚四条（本机检出实物·方案配方基）

| # | 实锚面 | 读数 | 方案面影响 |
|---|---|---|---|
| 1 | **TriMMC engines 声明面错误** | package.json `engines.node=">=18.20.0"` vs src/fade/store.ts L12 `import { DatabaseSync } from "node:sqlite"`——node:sqlite=**Node 22 系内置**（本机 v22.21.1 实证可用；sg 现役 v18.20.8 缺失） | 声明与码面需求不符——engines 勘正=零风险即刻项（§方案三·即刻层）；**esm 卷 engines 债实质化第二例**（kit 演进语法面第一例+TriMMC 自身码面本例） |
| 2 | **TriMMC store.ts API 同形面** | DatabaseSync 用面=标准 sqlite API 全谱（exec/prepare/get/all·store.ts 30 处引用+types.ts type 引·仅两文件） | better-sqlite3 API 同形（prepare/exec/run/all/get）——A1 替换=机械替换面工程量小（§方案三·短期层） |
| 3 | **TriRMC cron 结构面** | 注册聚合=src/cron/service.ts（degraded 聚合=`consecutiveFailures=max over jobs`·DEGRADED_THRESHOLD 门）+端点面=src/cron/routes.ts+job handler=src/cron/command-handler.ts（deterministic 默认 handler） | **TriRMC 无 cron command 白名单**（其 ALLOWLIST=agent-loop shell 工具面·与 TriRLC cron 白名单不同族）——连败归因树不套 TriRLC 族形（§方案二） |
| 4 | **本机 node 版本实锚** | 本机 node v22.21.1——TriMMC 本机冷启 store 面零 node:sqlite 坑 | 机位差实证（本机 22 通/sg 18 崩）——B 候选目标=sg node 升 22 LTS 系（22 系含 node:sqlite=本机实锚背书） |

## §一 · 方案一：TriMMC sg 托管形态勘定（systemd unit 建·宿主重启风险敞口收口）

**现状**：sg 8712 现役 pid 1491977=值席 restart 序 session 进程；`/etc/systemd/system/trimmc.service` 不存在（值席探 4 如实注④）——宿主重启/会话结束=进程丢失。**形态选型**：sg=Linux→**systemd unit 建=正解**（schtasks keeper=Windows 本机族形不可跨平台套用；河源 trirmc.service 同构参照在役）。

**施工序（值席/BOD root 窗·root【R】）**：
1. **探 0 前置（必做·防复发族）**：现役进程 environ 全谱勘【R】——`cat /proc/1491977/environ | tr '\0' '\n'`【R】字段名面带回（值面脱敏 D-46）——unit Environment 面=**现役 environ 复刻**（已知件：TRIMC_PORT=8712；候勘件：shim 注入形——NODE_OPTIONS/require 面若在必入 unit，防「unit 起来但 env 少一件」复发案①双因链）；
2. unit 文起草【R】：`/etc/systemd/system/trimmc.service`——骨架：`WorkingDirectory=/srv/fleet/TriMMC`+`ExecStart=/usr/bin/env node /srv/fleet/TriMMC/dist/src/index.js`（**实锚产物路径·路径坑防**——dist/index.js 不存在）+`Environment=TRIMC_PORT=8712`（显式·镜像坑防）+探 0 复刻件（shim 形/token 类走 `EnvironmentFile=-/srv/fleet/TriMMC/.env`·文件值零入 unit 正文）+`Restart=on-failure`+`RestartSec=5`+`User=fleet`（sg 属主正形）+`After=network.target`；
3. 迁移序：现役进程优雅停（POST /shutdown+token 门·TriRLC 重启纪律同族正形）→【R】`systemctl daemon-reload`→【R】`systemctl enable --now trimmc`；
4. **完工四判据**：`is-enabled`=enabled+`is-active`=active+`ss` 8712 LISTEN（pid 新值）+healthz `ok=true`+kit import 探针绿——毕报落树（pid/CIM 对表）。

**回滚姿态**：`systemctl disable --now trimmc`→手工冷启回置（TRIMC_PORT=8712 显式+shim 注入·现役同形）→unit 文移除——零码面零数据面改动=一键回滚。
**风险注**：迁移窗 8712 短暂停机（秒级）——**排窗避开在途链窗**（COO 统排时点裁量）；root 残留雷防（git 属主归还纪律照 sg 族例）。

## §二 · 方案二：TriRMC cron degraded 5 连败勘配方（job 级归因·现役异常优先级建议最高）

**现状**：TriRMC 8710 服务本体绿+healthz cron 面 `degraded=true consecutiveFailures=5`（聚合面=6 job 中最大连败 5）——组件级真异常·每 cron tick 在发生（非敞口型）。

**勘定探序**：
1. **探 0（本席本机·已毕随卷）**：cron 结构预勘（§〇实锚 3）——归因树不套 TriRLC 白名单族形；
2. **探 1（值席窗·零 root）**：cron job 级读数——healthz 全读数 JSON 原样带回（cron 面 job 清单+每 job consecutiveErrors/lastError 字段名面）+cron 管理端点形勘（`curl :8710/cron/jobs` 候选形·具体路由面=src/cron/routes.ts 实读为准）；
3. **探 2【R】**：`journalctl -u trirmc -n 100 --no-pager | grep -iE "cron|job|error"`——job 执行报错栈原文整段带回（勿截断）；
4. **探 3（本席本机·候窗）**：command-handler.ts 实读（handler 执行形/超时面/错误捕获）+job 注册 command 清单实读——归因判读基。

**判读→修法映射（探 1/2 读数回后本席落判）**：
| 形 | 判 | 修法 |
|---|---|---|
| command 指产物/脚本路径不存在 | 部署面缺件 | command 勘正或缺件补装（零码面） |
| command 执行超时/非零退 | 执行面环境差 | 按栈归因（依赖缺/env 差）勘环境 |
| job 注册 command 过时（旧拓扑残留） | 拓扑漂移 | job 注册面勘正（cron add/update 端点或 store 修） |
| 其他栈 | 原文带回本席裁决 | 值席零自裁 |

## §三 · 方案三：node:sqlite 码面勘正分层方案（shim 缓解在役·三层递进）

| 层 | 项 | 内容 | 风险/成本 | 建议 |
|---|---|---|---|---|
| **即刻** | engines 声明勘正 | TriMMC package.json `">=18.20.0"`→`">=22.5.0"`（node:sqlite 引入版·**22.5 数字存疑注：候勘窗现查 Node release notes 核**；22 系含面=本机 22.21.1 实锚背书）——声明面防误装锚 | 零运行面动·零风险 | **随本卷即执**（本席本机检出笔·随下窗 commit） |
| **短期 A1** | store 层 better-sqlite3 替换 | store.ts/types.ts 两文件机械替换（API 同形实锚 §〇2）+契约测试回归+sg 装载 prebuilt binary 可用性核（node 18+prebuilt 候勘） | 小窗工程量·native 依赖引入面 | 候 COO 排窗（小窗）——**shim 现役缓解面维持至 A1/B 任一落地** |
| **长期 B** | sg node 18→22 LTS 升级窗 | 根治面（engines 吻合）——sg 全局影响面=值席环境/BOD SSH 链/其他 sg 服务 node 行为回归面 | **基础设施级变更**——非 sprint 窗项 | 挂基础设施大窗候选（COO/BOD 级统排·全量回归门前置） |

**存疑注两件（如实）**：①node:sqlite 精确引入版本（22.5.0 experimental 说）候现查核——不影响即刻项方向（18 系必缺=sg 崩栈实锚·22 系必含=本机实锚）；②定性卷（4917ba16f）「Node 20+ 内置」表述随本卷勘正为「22 系内置（引入版候核）」——**升 20 不足以解坑**（若按 20 排升级窗仍崩）——排窗判读以本卷为准。

## §四 · 排窗建议（COO 统排裁量面·本席零代排）

- **优先级建议**：方案二（现役异常·每 tick 在发生）＞方案一（敞口型·宿主重启才触发）＞方案三 A1（shim 缓解在役）——方案三即刻项随本卷零窗落；
- **并窗候选**（COO 662 归并承录面）：方案一与 TriRMC unit 核验行（4917ba16f 残面 2）同窗（同 root 链·两 unit 一并勘）；方案二与 TriMLC mc_link degraded token 窗同窗候选（sg 面值席窗顺手件归并）；方案三 A1 与 TriMMC 码面窗归并候选；
- 各方案完工判据随卷 §一/§二/§三——毕报落树→本席验收。

## §五 · 使用依据

C3 毕报观察面（807514ac5 §三两新件）+431a85a1 定性卷残面（4917ba16f §三）+本机检出实物预勘四实锚（TriMMC 56dfc4a 检出 package.json/store.ts L12·L267-299+TriRMC 7126ddd 检出 cron 三文件+本机 node v22.21.1 现查）+值席 sg 读数卷（609480cc3·environ TRIMC_PORT 在位锚）+COO 台账 662（ca66d5075e）+esm 卷（3aab71f6c·engines 债第一例）+TriRLC 重启纪律记忆族（shutdown 正形链）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T06:25:22Z（+8=2026-11-20 14:25:22·date 现查原值·D-47 正形）

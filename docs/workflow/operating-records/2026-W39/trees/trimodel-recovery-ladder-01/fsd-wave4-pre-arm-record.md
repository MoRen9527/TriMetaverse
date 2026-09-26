# FSD 波④前置两小笔+演练窗钉位记录 — TASK-TRIMODEL-RECOVERY-LADDER-01

- sourceOfTruth: 本件=FSD 席波④前置作业记录（候 CTO 审+STE 臂毕出窗后补终态段）；派工=CTO 签认转文 7f1c62ed+钉位裁可文
- syncMode: static
- lastSyncedAt: 2026-09-26T00:10Z
- 席位: FSD 小全（m-fsd）

## 一、前置两小笔

### ① L2 标记态 status 读数接线（技术债⑹ 升格件）

- TriCode `7a8bd7b`：`TRIMODEL_L2_FLAG` env 键（L2_FLAG_ENV 常量）+`defaultL2FlagPath()` 缺省解析（env 未设=undefined=status 无 l2 段）+桶形导出；commands-cli.test.ts 补两态测（缺席 present:false/未注入无段）——58/58 全绿。
- 四仓注入 `l2FlagPath: defaultL2FlagPath()`：TriMLC `766c29d` / TriRLC `01659c6` / TriMMC `9500654` / TriRMC `3eb261e`。
- 两态三景实证（trimlc）：env+flag 在位→`l2_flag={"present":true,"content":...}`；env+flag 缺席→`{"present":false}`；env 未设→无 l2_flag 段。
- 四仓全测与波③基线逐项同零回归（599/594/5/0、644/639/5/0、602/597/4/1、566/561/4/1）。

### ② TRILC_PORT=8713 服务环境注入

- **实勘发现已在位**：daemon 启动 channel cmd（`C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd`）第 4 行 `set TRILC_PORT=8713`（LG-033 rebuild v3, 2026-09-08）——daemon 面注入由前线早已交付，本笔零动作闭环。
- 对位实证：daemon 同环境跑 `trimlc model status` → 探针 `daemon-healthz:8713 up=true`（CLI 探针读 TRILC_PORT 同键，波③探针修正的 env 契约生效）。

## 二、方案 A 演练窗钉位（CTO 裁可，STE 备臂勘验的 cron 链零钉位缺口修复）

### 落位序（stop/start 纪律全程）

1. pidfile 先验：`~/.trimetaverse/trilc.pid`=49704 == 8713 监听 pid（一致 ✓）
2. `cli.js stop --port 8713`（一致性门内置过；graceful shutdown accepted→SIGTERM 收尾）
3. channel cmd 加 `BEGIN/END DRILL WINDOW` 块四钉位（出窗还原义务写进显式注释）
4. `Start-Process` channel cmd 立即复活（不等 5min watchdog 窗）→ healthz 200 新 pid=45972 service=trimlc
5. cron job 账重启存活实证：trimodel-l2-scan enabled runCount 154→163（持续拾取）、trimodel-l3-remind enabled runCount=22——持久化账面，STE F2/F4 有实体可断

### 钉位清单五项核验（CTO 清单×CoreIO 实勘定键）

| CTO 清单项 | 实勘裁 | 落位 |
|---|---|---|
| TRIMODEL_PORT | CoreIO 无此键；探针端口键=TRILC_PORT 已在位（cmd 第 4 行） | 零动作（对位实证过） |
| TRIMODEL_ADMIN_TOKEN | CoreIO 无此键；stub 链无消费面（探活用 TRIMODEL_API_TOKEN，cmd 第 9 行已在位） | 不钉（钉=死键） |
| TRIMODEL_CLAUDE_SETTINGS | CoreIO 契约键 | `%LOCALAPPDATA%\Temp\trimodel-drill-settings.json` |
| TRIMODEL_AUDIT_LOG | CoreIO 契约键 | `%LOCALAPPDATA%\Temp\trimodel-drill-audit.log` |
| TRIMODEL_DEPLOY_KEY | CoreIO 契约键（真 legacy 钥隔离） | `%LOCALAPPDATA%\Temp\trimodel-drill-deploy-key.txt`（沙箱假钥 52B 预置，非 placeholder 过健康门） |
| （+）TRIMODEL_L2_FLAG | CoreIO 契约键（status 读数+演练态） | 真 flag 路径 `.fade\trimodel-l2-flag` |

### 复活链实勘（D22 守卫面）

计划任务 TriMLC-Watchdog（5min）→ `trimlc-watchdog-launch.vbs` → `trimlc-watchdog.ps1`（探 8713 healthz；down→Start-Process channel cmd 复活=复活体自带钉位，STE 判断证实；stop-flag 尊重+3 连败 stand down）。

## 三、出窗还原义务（CTO 条款：出窗还原比进窗重——显式步骤）

触发条件：STE F2/F3/F4 臂毕唤本席。

1. 删 channel cmd `BEGIN/END DRILL WINDOW` 整块
2. `cli.js stop --port 8713` → `Start-Process` channel cmd 复活
3. 出窗三读数核验：
   - channel cmd 无钉位块（diff=0 vs LG-033 v3 基线形态）
   - daemon env 无四钉位键（下轮 cron 拾取链读数验证/进程 env 断言）
   - 真活体 `~/.claude/settings.json` hash == 基线 `491f33353d50f938b6b6dfd26cc8c7804500e10be55ac52caebb6e633cd778b2`

风险知情：钉位态留现役=恢复梯盲化（真降级时 restore 写沙箱不救活体）——窗内节奏 STE 主控，臂毕即出窗。

## 四、现势与交接

- 发现-A 修复（CTO 裁 2b325f02）：guard PATH 尾追加 `;C:\nvm4w\nodejs`（nvm4w junction）+ where node 哨兵行——第一刀落位（出窗+修复合并一次重启 pid=20004，哨兵零触发），STE 独立加验在位。
- **第二刀毕，重进窗**（2026-09-26T03:49:14Z 新窗计时起点，cap 2h）：四钉位照第一刀形重落（CLAUDE_SETTINGS/DEPLOY_KEY 沙箱假钥/AUDIT_LOG/L2_FLAG 真路径）→ 重启纪律全程（pidfile==监听先验 20004）→ 新 pid=**29844** healthz 200，pidfile 已跟写。
- 进窗读数：where node 于 guard PATH 直证 `C:\nvm4w\nodejs\node.exe`（哨兵零触发）；cron 台账存活 l2-scan runCount=235 / l3-remind=29 双 enabled；healthz cron.jobCount=2 degraded=false。
- STE 面：进窗知会已投，F2 补验门开臂条件齐（F2→F3→F4→F5 接续）；本席窗内支撑待命（臂中缺陷修正即报候审）。
- 出窗义务（臂毕）：删 DRILL WINDOW 块→stop/start→三读数核验（钉位零残留/活体 hash 基线/cron 台账）——出窗还原比进窗重。
- 窗全闭（STE 五臂毕+终出窗）后本件补终态段（出窗三读数+daemon 回归读数）。

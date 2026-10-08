# FSD 毕报 · COO 单 1（LG-066 窗前清单 1/2/6）+ 单 2（LG-068 绩效脚本落位）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/coo-dispatch-20261008/fsd-preflight-and-settle-script-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T03:54:04Z（11:54+08 周四，date 现查）
- 执行席: FSD 小全（m-fsd）；依据=COO 排工单 2026-10-08 §二单 1/单 2+窗令 v2 §六+编排卷 @4932da6a §二/§三
- 状态条: 水位=中；末次活动=transcript mtime 11:54:04+08（现查）

## 一、单 1 · LG-066 窗前清单第 1/2/6 条 —— 三条全毕

### 第 1 条 · 文件级锚定位（CTO N1 注记①）

| 对象 | 现位 | 读数 |
| --- | --- | --- |
| trirlc-daemon.ps1 | `C:\Users\jedih\AppData\Local\trirlc\daemon\trirlc-daemon.ps1`（计划任务 TriRLC Daemon→trirlc-daemon.cmd 薄壳 L5→同目录 ps1） | **L11 `$env:TRIMC_BASE_URL = 'http://8.155.54.79:8710'` 本就指段2 终态——零改**。现态 degraded 系 401 token 面（N1 裁 6：合并毕 24h 内对齐，非本条范围） |
| tri-liveness-l2.ps1 | `C:\Users\jedih\AppData\Local\tri-liveness-l2.ps1`（计划任务 TriLiveness-L2→.vbs→本 ps1，每轮新进程=改文件零重启） | R-HY 段 L56（$rhCmd 双 unit 双口）/L66-78（hz 双判读块）；M-SG 段 L92（trimc=sg 正名）；改址对象=段2 同窗原子换 |

### 第 2 条 · R-HY EnvironmentFile 全量复核（systemctl cat 双 unit 实勘）

**trirmc 主 unit**（段2 改点+补点落版）：
- 现值：`TRIRMC_HOST=127.0.0.1` + `TRIRMC_PORT=8712`（主 unit 内联）+ `TRIRMC_CONFIG_DIR=/var/lib/trirmc` + `TRIRMC_INTERNAL_TOKEN=<set>` + MemoryMax=800M（mem.conf drop-in→600M）+ override.conf：`EnvironmentFile=/srv/fleet/trimodel-data/api-token.env` + `TRIRMC_TRIMODEL_API_URL=http://8.155.54.79:3333`
- **段2 改点**：HOST→`0.0.0.0`（N1 裁采 bind）+ PORT→`8710`，单点改两键
- **段2 补点（复核新发现）**：trirmc 主 unit 现无 `TRIRMC_MC_DB_PATH` 键——trirmc-mc 现值=`/var/lib/trirmc-mc/mc-store.sqlite`；段2 收敛时该指向归 LOC 候裁（本席只报事实，改不改候 CTO 窗内裁）
- 备份锚现成参照：override.conf 目录已有 `.bak-pre-publicnet-20261005T2320Z` 先例形

**trirmc-mc**（段1 stop/disable 对象，零改）：`TRIRMC_HOST=0.0.0.0`/`TRIRMC_PORT=8710`/`TRIRMC_CRON_ENABLED=false`/`TRIRMC_MC_DB_PATH=/var/lib/trirmc-mc/mc-store.sqlite`+同构 override.conf。

### 第 3 条（清单第 6 条）· l2 改址+trimc 勘正脚本预 commit

- **落位**：`TriMetaverse/scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1`（新建仓内管理位 scripts/ops-local/）
- **改动面（no-index diff 实证 27+/12-）**：①$rhCmd 单 unit（`for u in trirmc`）单口（`for p in 8710`）②hz8710 判读升本体形态（ok+cron.enabled+cron.degraded 三断言，标签 trirmc-mc-8710→trirmc-8710，退役「by-design never alert」注释——合并后活体即 cron face）③hz8712 判读块删除（口空置；循环空值 echo 不触 `1+` 正则，零误报）④头部版本块+部署注记（cp 覆盖运维位，每轮新进程零重启）
- **M-SG 段：UNTOUCHED**（diff hunk 止于段注释行，可执行行零变更）
- **自测**：Parser::ParseFile 0 错；no-index diff 逐 hunk 人工核
- **触发窗**：段2 窗内 cp 覆盖 `%LOCALAPPDATA%\tri-liveness-l2.ps1`（原子性=窗令 §四段2 工序行；窗前禁部署——头部已写死禁令）

### ⚠ 方案稿 #3 误定位发现（如实上报 COO+CTO）

方案稿称「l2.ps1 L92 `is-active trimc` 系 R-HY 悬空名，需勘正」——**实勘为误**：L92 是 M-SG 段 sg 机 unit 正名（l2 自身 L26/L38 也经 trimc 读 sg token，在役非悬空）；R-HY 段 L56 探的 trirmc/trirmc-mc 双名皆正。**照稿改 L92 会把 sg 探针改坏（恒误报 unreachable）**。正当残余=本卷 §一.3 改址四点（已在 staged 版全含）。方案稿后续修订候 COO/CTO 采信。

## 二、单 2 · LG-068 绩效结算脚本落位 —— 今日款全毕，挂载款排明日白窗

### 已毕（今日白窗款）

1. **脚本落位**：`TriMetaverse/scripts/fade/performance-sunday-settle.mjs`（照 joint-review-remind.mjs 三钉 contract 逐结构克隆）：
   - 三钉①：当周经营记录目录（`docs/workflow/operating-records/<ISO年>-Wnn/`）定位失败→异常形态 notify 照发（title 带「异常」+body 人工定位指引），never silent skip
   - 三钉②：STATE（`.fade/tmp/performance-sunday-settle-state.json`）只在 `sendNotify` resolve 且 `r.ok` 后写
   - 三钉③：appendLog/readState/writeState 全 catch+`main().then(exit 0).catch(记 log+exit 0)`，process exits 0 always
   - TARGETS=["bod"]（TriMMC 名册实证形态，先例同构）；notify 形态=编排卷 §三「绩效周日结算窗到」+W4x 周指针+两动作提醒+pipe 主道注记
   - 周号=ISO 周（自测四点：10-08→2026-W41✓/10-11 首跑→2026-W41✓/2026-12-28→2026-W53✓/2027-01-01→2026-W53✓，ISO 年随周走跨年不劈叉）
2. **白名单追加**：`%LOCALAPPDATA%\trimlc-daemon-channel.cmd` L25 尾追加 `,node D:/Code/ai/TriMetaverse/scripts/fade/performance-sunday-settle.mjs`（精确全串，与 job command 字段一字不差）。**CRLF 断言绿：CR=LF=39 全 CRLF、零 BOM、11 条（10+1）**
3. **自测**：`node --check` 0 错+skip 分支干跑实跑（state 预置今日→exit 0+日志落位+state 清理复原，零发送面）——import 链实跑验证即证 notify-sender 路径正

### 候明日白窗（10-09，候排窗——8713 重启避 LG-066 晚窗）

| # | 动作 | 判据 |
| --- | --- | --- |
| 1 | 8713 优雅重启（trilc stop/start 权威路径，禁裸杀；pidfile 对名址） | 重启后 healthz 绿+allowlist 11 条载入 |
| 2 | job 挂载 POST（name=performance-sunday-settle，schedule=`{kind:'cron',expr:'0 0 21 * * 0',tz:'Asia/Shanghai'}`，command=精确全串） | **nextRunAtMs 值面对表 2026-10-11 21:00+08**（allowlist POST 201≠会触发，空则 PATCH 同值 schedule 触发 recompute） |
| 3 | 步骤 2.5：joint-review-demand-pool job enable 翻真+nextRunAtMs 值面验证 | 并入挂载序 |

## 三、技术债务标记

- staged l2 版头部注记「Do NOT deploy before seg2」系文件级护栏非强制门——误部署防线=窗令 §四工序序（段2 内才动），候段2 施工单显式列步
- TRIRMC_MC_DB_PATH 收敛指向未定（§一.2 补点）——挂窗内候裁面
- 本机 TriModel 退役后 `scripts/ops-local/` 为首用新目录，布局候 TriMetaverseCodeRegistry 收口时归位

## 使用依据

- COO 排工单 dispatch-20261008.md §二单 1/单 2；窗令 v2 §四/§六；编排卷 coo-orchestration-20261007.md §二/§三
- joint-review-remind.mjs（三钉 contract 先例，123 行全文对表）；trimlc-daemon-channel.cmd L25 现役 10 条白名单
- trirlc-daemon.ps1/tri-liveness-l2.ps1 现役全文实读；R-HY systemctl cat trirmc/trirmc-mc 实勘读数
- 窗令 v2 §六.1 文件级锚定位条款+CTO N1 注记①；performance-scoring-workflow.md（正身）

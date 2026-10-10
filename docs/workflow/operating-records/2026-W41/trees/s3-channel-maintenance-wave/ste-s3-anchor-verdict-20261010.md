# STE 锚对表判定卷 · S3 通道维护波窗（对 SDE 毕报逐项独立验+三分法判定）

- sourceOfTruth: 本件（trees/s3-channel-maintenance-wave/ste-s3-anchor-verdict-20261010.md）
- syncMode: static（锚对表判定卷·终态；对表形=ste-s3-anchor-checklist-20261010.md @0ad1e9d2，实测列以本卷为验收留痕）
- lastSyncedAt: 2026-10-10T14:42:26+08:00（date 现查原值）
- 执行席: STE 小柯（m-ste）；对表对象=sde-s3-window-readout-20261010.md @95631ff9；并读=CTO 技术收口卷 cto-s3-technical-closeout-20261010.md @738d50eb（CTO 14:4x 信两处校正吸收）
- 判定方法: **既有定性禁转抄须独立验**——全项第二方法交叉验证（活体复探/sqlite 只读/日志独立读/P0 套件独立复跑四通道），关键锚逐项实录见 §一

## 〇、判定汇总

**PASS**（主体全绿·零阻塞项·零升级项）——段1 硬绿门+A 区四步+B 区四连+C 区六锚+E 区红线六条全过；非阻塞注记五项如实录（§五）不扣判定。与 CTO 收口判「主体 APPROVE 无保留项」合流；判定建议供毕报链终态（CTO 技术收口已毕→COO 督办收口）。

## 一、独立验读数实录（STE 第二方法·14:36-14:42 全款）

| # | 锚 | SDE 卷读数 | STE 独立验（第二方法） | 判 |
| --- | --- | --- | --- | --- |
| V1 | C4 空集基线 | jobCount=0+degraded=false | curl 8711 healthz：`ok:true/jobCount:0/degraded:false/consecutiveFailures:0/uptime:1385`（冷启时点反推 ≈14:13:59 与卷载 ~14:1x 合） | ✓ 对平 |
| V2 | B1 门面 | POST /shutdown 401 | **GET 同门面安全形**（`/internal/v1/agents` 无 token）→ **401**（同一全局门 app.ts L1777-1812 后链；零真停风险替代形·方法学注记见 §六.2） | ✓ 门在岗 |
| V3 | B3 8713 门 | 错 token 401 | GET `/internal/v1/agents` 无 token → **401** | ✓ |
| V4 | B4 R-HY 门形 | 无 token GET 401（窗前活体裁定 8710） | 本机直探 `http://8.155.54.79:8710/internal/v1/cron/jobs` 无 token → **401**（外部面独立复探） | ✓ 门形勘定闭环 |
| V5 | C3 store 单一 | daemon.log data dir=trirlc | grep daemon.log：data dir 行×2（L84954/84999·改道+正形两次冷启）**均 trirlc**；trilc\cron.db-wal mtime 仍 **10-07 16:55** 停滚（本席 stat 独立） | ✓ |
| V6 | C4 活体 db | cron_jobs 空集复位 | sqlite 只读 trirlc\cron.db：cron_jobs rows=**0**；trilc\cron.db（旧侧）同 0（无残留写入面） | ✓ |
| V7 | A3 触发实证 | execution_log id=448 status=ok 06:22:00.010Z 3797ms | **三重独立验**：①sqlite_sequence 残留 `execution_log seq=448`（结构级铁证·本席首探）②daemon.log `[trilc:heartbeat] agent=cron-cron_mv20azzf_fo3n completed in 3794ms`（≈3797 同滚窗）③SDE 卷 snapshot 行在档 | ✓ 双形实证采信 |
| V8 | A1/A4 活体旁证 | 201/PATCH 幂等（snapshot） | daemon.log：`job updated: s3-a1-nextrun-probe (cron_mv20azzf_fo3n)`（PATCH 旁证）+`job removed: cron_mv20azzf_fo3n`（清理实证） | ✓ |
| V9 | 段1 P0 门 | 59/59+全量 707/707 | **独立复跑** `node --import tsx --test test/server/auth-gate-rejection.test.ts test/server/cron-mcp-entry-guard.test.ts` → **# tests 59 / # pass 59 / # fail 0** | ✓ |
| V10 | D 分线① | 571 笔+尾笔 03:45:02Z | l1.log 独立读：PENDING-RESEND 计数 **571**+末笔 ALERT-SENT `2026-10-07T09:05:01.5962345Z` 微秒级逐字对平+尾笔 03:45:02Z（1646 行·mtime 14:35:05 现役滚动） | ✓ 读数对平·定性校正见 §三 |
| V11 | §七 mc degraded 考古 | connection-state 10-06 | cat connection-state.json：`state:"degraded"/lastStateChange:"2026-10-06T11:04:13.765Z"` **逐字对平** | ✓ 既有非引入 |
| V12 | C1 正形链 | ps1 L11 显式一处 | grep trirlc-daemon.ps1：`L10: $env:TRILC_DATA_DIR = Join-Path $env:LOCALAPPDATA 'trirlc'` 恰一处（**L10 非 L11·一行差微瑕如实注**） | ✓ |
| V13 | C6 含密零接触 | 全程未动 | trilc\ .env mtime **08-15**/keys.json **09-28**/keys.json.s3-backup×11 全 10-10 前 mtime | ✓ 零触碰 |

## 二、A/B/C 区对表判定（实测列）

- **A 区（缺口1 活体验收）**：A1 201 ✓／A2 next_run_at 非空 ✓（snapshot+V7 结构级）／A3 双形实证 ✓（V7 三重）／A4 幂等 ✓（V8）——**四步全过**；段1 硬绿门 59/59 独立复跑绿+全量 707/707 基线对照 ✓（V9）。
- **B 区（门形探针）**：B1/B2/B3/B4 全 401（V2/V3/V4+SDE 卷 B2 探读）——**四连全绿零升级项**；B5 sg loopback 本机不可达如实注记不判（「可带」非必带·合规）。
- **C 区（归一六锚）**：C1 ✓（V12·既有正形链在位口径修正如实录）／C2 ✓（权威路径+pid 验有录·daemon.log data dir 双行证）／C3 ✓（V5）／C4 ✓（V1/V6）／C5 保留态 ✓（两态合规取其一）／C6 ✓（V13）——**六锚全过**。

## 三、D 区 · 分线勘验（不混锚+CTO 校正①吸收）

- **分线① PENDING-RESEND**：V10 读数全对平；**「未自愈」定性按 CTO 收口卷 §二.2 校正改注**——最新 fail 笔 03:45:02Z 早于 FSD 修复毕（03:51:47Z DIAG 200+文件清+零 failcount）6 分钟，修复后队列空载静默=**正常形非通道死**；571 笔积压=ETS 缺陷历史证据归档保留。**本席 14:35 独立读数构成校正第三读数源**：571 计数+尾笔 03:45:02Z 在读时点不变（若 5min 节奏仍滚，14:35 应见 +20 余笔新 fail）——「5min 节奏持续」表述随校正收窄为「03:45 前节奏」，log 零新行=空载非死（log 零行双向不可定谳教训族）。
- **分线② sg TriMMC POST 403**：两机 token 尾纹（本机 e075≠sg 4aa5）分叉读数如实录——token 分发漂移族一案 CTO 面已立项（10-11 窗族），与四缺口判定解耦；本席零处置。
- 两分线均不并入四缺口判定（SDE 自评+CTO 采认+本席同判）。

## 四、E 区红线六条勾验（STE 复核）

- [x] 禁对 token /shutdown 真停探针——SDE B2 全无/错 token 形；本席 V2 亦取安全 GET 形（双席零红线触）
- [x] token 值面零回显——SDE 卷全 len/sha8/tail4 掩形；本卷同守（V10 尾纹只引既档形态）
- [x] 权威路径重启+pid 验（SDE §二.3 有录）
- [x] 备份锚先行（backup-s3-datadir-20261010T060633Z）
- [x] 范围不爬升（8710 迁移评估/#3/#4 零触碰）
- [x] 零拖窗（段1 ~14:05/段2 14:31 均提前达成）

## 五、非阻塞注记（如实录·不扣判定）

1. **C1 口径修正**：方向 A 归一系「既有正形链已在位」非新 diff（SDE 新建链改道过程如实录——「宁可不拉不可拉错」纪律正面样本）；判据时勘漏系盘点只看 trirlc\ 顶层未下探 daemon\ 子目录。
2. **C5 保留态**：trilc\ 侧 cron store 四件原位保留+备份目录另建（两态合规）。
3. **B5 不判**：sg loopback 本机不可达，如实注记（判据「可带」项）。
4. **L10/L11 微瑕**：SDE 卷 C1 行号 L11，本席 grep 实测 L10——一行差，不影响判定。
5. **A 区证据随清理自清**：见 §六.1。

## 六、方法论注记（验收纪律增量·供归档）

1. **DELETE 级联清 execution_log 行**：探针 job DELETE 后活体 db log 零行（V6/V7 双库实证），正面实证只存于清理前 snapshot+sqlite_sequence 残留——**活体验收锚的正面读数必须在清理动作前 snapshot 留卷**，依赖清理后活体复查会扑空（SDE snapshot 时序正确）；sequence 残留可作为「写入曾发生」的结构级旁证补位。
2. **GET 同门面安全形**：POST /shutdown 无 token 探针在 fail-open 态=真停风险；同全局门后链的非破坏端点（GET /internal/v1/agents）401 面可作门在岗的零风险等价验证（本席 V2 实证）——补勘窗可采用。
3. **sqlite_sequence 补位法**：log 行被级联清后，`SELECT * FROM sqlite_sequence` 残留值=写入历史结构级证据（V7 首用·可复用）。

## 七、使用依据

- SDE 毕报卷 sde-s3-window-readout-20261010.md @95631ff9（对表对象）
- CTO 技术收口卷 cto-s3-technical-closeout-20261010.md @738d50eb（§二.2 校正①吸收·判定合流）
- STE 锚对表预备件 ste-s3-anchor-checklist-20261010.md @0ad1e9d2（对表形）
- 判据卷 cto-s3-criteria-20261008.md @5e9110b4（判据真源）/窗令 s3-window-order-20261010.md（BOD 12:18 认账）
- 独立验通道：curl 活体探针×4（V1-V4）/sqlite 只读×2 库（V6/V7）/daemon.log+l1.log+connection-state.json 独立读（V5/V7/V8/V10/V11）/P0 套件独立复跑（V9）/ps1+含密遗产 mtime 勘验（V12/V13）
- 记忆条：negation-claim-needs-exhaustive-event-log（分线①校正同族）/truncation-artifact-false-reading（log 双向不可定谳）/trimc-mlc-addjob-divergence（A3 两形纪律）

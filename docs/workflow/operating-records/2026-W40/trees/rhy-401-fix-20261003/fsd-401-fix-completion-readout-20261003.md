# FSD·R-HY 401 修复窗施工毕读数卷（a 项 token 同步+b 项 sg 对照勘·10-03 凌晨窗）

- sourceOfTruth: 本件（FSD 修复窗施工卷；令源=COO 02:48 开工令，三门全过：BOD 复核件① PASS+修复窗放行、CTO 审定单 cto-401-fix-procedure-review-20261003.md 137L/b6e6db9f、Rider② CTO 裁卷 69L/3c0a2753）
- syncMode: static（a 项七步全毕主锚落位+观察期过；b 项四步毕=分支②）
- lastSyncedAt: 2026-10-03T03:14+08:00（date 现查 2026-10-02T19:13:47Z）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）
- 纪律执行: 零敏感值出机 ✓（全程指纹形 len+head4+tail4，管道取值零 cat/echo 全值）；零裸杀 ✓（优雅停+watchdog 自然拉起）；CRLF 三查 ✓；R-HY 门面权威值零改 ✓（方向恒=本机对齐权威）

## 一、a 项七步逐步读数（TriMLC 8713 token 同步）

| 步 | 内容 | 读数 | 判 |
| --- | --- | --- | --- |
| 0-1 | 监听 pid 断言 | 8713 监听 pid=22556（与审定单步 0 值+FSD 勘验卷值一致，零中途重启） | ✓ |
| 0-2 | watchdog 节奏勘 | schtasks 读数任务 Ready；**实测实为 5 分钟节奏**（02:52/02:57/03:02 三点实锚）——审定单「分钟级」系 02:02 读数（next=02:07）取样误读，观察窗按实测节奏执行 | ✓（勘正注） |
| 0-3 | 优雅停端点实勘 | TriMLC src/server/app.ts L4275 POST /shutdown（门=TRILC_INTERNAL_TOKEN L15 键在册） | ✓ |
| 1 | 备份 | `C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd.bak-20261003-0252`（3992B，全文件拷贝） | ✓ |
| 2 | 跨机管道取值 | R-HY `/srv/fleet/trimodel-data/api-token.env` L1 值段，cut+tr 管道直传零落会话；指纹断言 len=64 head4=[3608] tail4=[cee7] hex64 过 | ✓ |
| 3 | 行级替换保 CRLF | 行数组拆分→仅 L11 值段替换（regex 锚 `^set TRIMODEL_API_TOKEN=[0-9a-f]{64}$`）→拼回单次写（UTF-8 无 BOM）；**CR 基线 38→写后 38 差=0** | ✓ |
| 4 | 文件面四对表 | ①L11 指纹 len=64 3608..cee7（=权威值）②行数 38 不变 ③邻行零扰动：L10 TRIMC_INTERNAL_TOKEN 4842..4aa5、L17 TRIMC_NOTIFY_SG_TOKEN 4842..4aa5、L15 TRILC_INTERNAL_TOKEN 0641..5693 全原值 ④CR 复测=38 | ✓ |
| 5 | 剥启动行实跑探针 | 临时 cmd=L1-L36 原样+尾行 PowerShell 指纹行（只出 len/head4/tail4）；实跑 set 区可解析+TRIMODEL_API_TOKEN 指纹=3608..cee7 期望值；临时件即用即删 | ✓ |
| 6 | 优雅停+watchdog 自然拉起 | POST /shutdown→200；验证死（8713 监听消失，stop 时点 02:54:19）；watchdog 02:57:01 探活 DOWN fail 1/3→02:57:04 reviving（`trilc-channel\watchdog.log` 实锚，自然形态非 stand-down 非手动）；新 pid=51600，8713 监听恢复+healthz=200+启动 02:57:04＞stop 02:54:19 | ✓ |
| 7 | D-04 主锚 | **face-events.jsonl face=mlc pull `ok` ×2**：`2026-10-02T18:57:05.874Z`（新进程启动后 1 秒内首条）+`2026-10-02T18:57:33.708Z`；**denied-92 链终止**（最后 denied=18:49:26Z，修复后零新增） | ✓ |

### 三层完工锚

| 层 | 锚 | 读数 |
| --- | --- | --- |
| 辅锚 1 | healthz | 200（新 pid 51600）——必要不充分已申明 |
| 辅锚 2 | 文件面+探针面 | 步 4 四对表全过+步 5 探针指纹过 |
| **主锚（定谳）** | R-HY face-events mlc ok | **18:57:05.874Z + 18:57:33.708Z 两连 ok**（detail=`pull served, card absent`=门面正常应答） |
| 观察期 | 续看 1 poller 周期 | **过**：19:12:33.729Z 第三条 ok（=18:57:05.874Z+15min28s，poller 网格重启后重算周期，持续 ok 非偶发）；修复后零新增 denied，回滚点 B 不触发 |

### 探针纪律注（F-3 规避）

「临时 job POST」探针全程未用（TriMLC F-3 缺陷 INSERT 缺 next_run_at=恒假阴性，审定单 §一步 7 注遵守）；活性验证走 healthz+主锚 face-events 端到端真值。

### 回滚锚状态

- bak 件：`trimlc-daemon-channel.cmd.bak-20261003-0252`（3992B）——回滚点 A（步 5 前）未触发（一次通过）；回滚点 B（步 7 后 30min 观察）按现势不触发（主锚已过）。
- 清理时点登记：**完工+24h 观察期后清**（即 2026-10-04 03:00 后），候 COO 收口批或值席窗执行，避免 TriModel bak 族悬空重演。

### 「single cold start」约束注记（审定单 §五.9）

本窗重启系 10-02 M2 窗后**独立修复窗显式动作**（令源链：COO 02:48 开工令←BOD 复核放行←D-39 全域授权裁准；工序=CTO 审定单 b6e6db9f），非 M2 窗内二次重启；重启事实与令源链如实标注如上。

## 二、b 项 sg 对照勘四步读数（只读，GLM_API_KEY 值源分叉）

| 步 | 内容 | 读数 |
| --- | --- | --- |
| b1 | sg 门面进程活体 env 键名扫描 | sg **无 `trimodel.service`**（R-HY 形态门面 daemon 不存在）→形态转 unit 勘：sg TriModel 实为双 unit 形（LG-035 P3-sg）：`trimodel-config.service`（3333 Config Plane，pid 2518071，活体 env 零 key/token 族）+`trimodel-proxy.service`（3334 Rewrite Proxy，pid 3681236）；proxy 活体 env 键名面命中 GLM_API_KEY/DEEPSEEK_API_KEY/TRIMODEL_API_TOKEN/TRIMODEL_ADMIN_TOKEN/GLM_ANTHROPIC_BASE_URL |
| b2 | 配置文件面定位 | `EnvironmentFile=/srv/fleet/TriModel/.env`（override.conf 实锚）；键名面 6 键（NODE_ENV/TRIMODEL_ADMIN_TOKEN/TRIMODEL_API_TOKEN/GLM_ANTHROPIC_BASE_URL/DEEPSEEK_API_KEY/GLM_API_KEY）；**GLM_API_KEY L6 空值**（len=0）；mtime=2026-09-11 17:26:35(+0800) 后未动 |
| b1' | 活体值面复勘（补） | proxy 活体 GLM_API_KEY **len=0 空值**（b1 键名命中系空值键占位）；DEEPSEEK_API_KEY 同族 len=0；进程起 10-02 18:50:22 与文件 9-11 空值形一致（值源=该 .env 零疑）；对照位 TRIMODEL_API_TOKEN len=64 8bd5..74cb 有值 |
| b3 | 结论三分支 | **分支②成立：GLM_API_KEY 缺件系双机性**——R-HY 门面=键名零持有；sg proxy 面=键名在、值为空。两机形态不同构（R-HY api-token.env 无此键；sg TriModel/.env L6 有键空值） |
| b4 | 补齐写操作 | 本单不授权（审定单 §三.b4 另窗独立施工单）；值源=bigmodel key 台账/新申请候 CFO/CEO 面（CFO 闸），毕报标注即走 |

### b3 附录：形态勘误两笔（供补齐工序照实形修订）

1. sg 侧配置位参照修正：R-HY 门面用 `api-token.env`（unit EnvironmentFile 直挂）；sg proxy 用 `TriModel/.env`（drop-in override.conf 挂）——**补齐窗若落 sg 侧须照 drop-in 形**；落 R-HY 侧照 api-token.env 增行形（审定单 b4 原文形态不变）。
2. 空值键占位现象：`KEY=` 空值行经 systemd EnvironmentFile 注入后 /proc/environ 仍现键名（len=0）——**键名扫描有/无判据须补值面 len 断言**，否则假阳性（本勘 b1 即中此招，b1' 复勘纠正）。

## 三、Rider①② 落实注记

- **Rider①**（COO 发现项②）：triladder.ps1 a3 bak 存在性断言 Test-Path 前置至 JSON 校验前（bak 缺失报「bak 文件不存在」专文案，不再误报「JSON 校验失败」）——已落 `D:\Code\ai\TriCompany\scripts\ops\local\triladder.ps1`（在途未提交，随收口批）； rider 编辑限 triladder.ps1 遵守 ✓。
- **Rider②**（CTO 裁卷 3c0a2753 §四）：triladder.ps1 a1 shutdown 处头注一行补注「依赖 daemon 门 Bearer fallback；daemon 认证门收紧时须显式传 -TokenHeader X-Internal-Token」——仅注释，代码行为零动 ✓（在途未提交，随收口批）。
- restore-claude-config.ps1 在途 38 行 diff：零接触零卷入 ✓。

## 四、禁区遵守声明（审定单 §五九条逐条）

| # | 禁区 | 遵守 |
| --- | --- | --- |
| 1 | R-HY 门面权威值 3608..cee7 零改零轮换零触碰 | ✓ 本窗零触 R-HY 侧任何写面；方向=本机对齐权威 |
| 2 | 值面零出机 | ✓ 全程指纹形；步 2 管道取值零 cat/echo 全值；毕报/卷/commit 讯息零值面 |
| 3 | 禁裸杀 | ✓ 优雅停 POST /shutdown+令门；stop 前验 pid=22556 |
| 4 | CRLF 三查 | ✓ 写前测（CR=38）写后断（38，差=0）；无反常形态 |
| 5 | 禁直接 call 生产启动器 | ✓ 验证走剥启动行临时 cmd，即用即删 |
| 6 | b 项只读 | ✓ sg 对照勘零写面（SSH 读命令族全程） |
| 7 | 值源授权面 | ✓ GLM_API_KEY 未自行取值；分支②结论呈报候 CFO/CEO |
| 8 | TRIMC 族三 token 勿混淆 | ✓ 仅动 L11；L10/L17（4842..4aa5）/L15（0641..5693）四对表实证零扰动 |
| 9 | single cold start 尊重 | ✓ 重启事实+令源链显式标注（§一注记） |

## 五、技术债务标记

1. watchdog 节奏实勘（5min）与审定单「分钟级」读数差——系 02:02 单点取样误读，非审定单缺陷；建议节奏类断言一律取≥2 周期实测（候 CTO 审定单模板增量，本席不代改）。
2. b1 键名扫描假阳性坑（空值键占位）——已入本卷附录；候勘验工序族（值面 len 断言）归 CAO 册候条。
3. triladder.ps1 Rider①② 编辑在途未提交（工作树 M 态）——随 COO 收口批 commit；本席不自行提交（批内惯例）。
4. bak-0252 清理时点=完工+24h（2026-10-04 03:00 后）——候值席窗/收口批执行，本卷挂账。

## 六、使用依据

- COO 02:48 R-HY 401 修复窗开工令（三门全过）+Rider② 追加令（CTO 裁卷 3c0a2753）
- CTO 审定单 `trees/rhy-401-key-audit/cto-401-fix-procedure-review-20261003.md`（137L/b6e6db9f）：七步序+禁区九条+§七毕报要件
- FSD 勘验卷 `trees/rhy-401-key-audit/rhy-401-key-audit-readout-20261003.md`（69L/d262870c）：权威值指纹 3608..cee7/denied-92 时间线
- 实勘证据：R-HY face-events.jsonl mlc 行原文（ok ×2 时间戳）；TriMLC app.ts L4275/L1759；watchdog.log 02:57 读数；sg systemctl cat/unit 全文/两活体 /proc/environ 键名+值面指纹/TriModel/.env 键名+指纹/mtime

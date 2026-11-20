# RW1 窗 A TriRMC cron 5 连败勘定读数卷 · 值席 sg 面（BOD 663 窗 A 执行令·CTO 方案二 §二探序照卷）

- date 现查: 2026-11-20T14:33:xx+08→14:41:xx+08 探窗（写前现查落款=commit 对象时戳·D-47 正形）
- 值席: m-duty-cos（sg 面·河源通道=ssh heyuan·fleet 用户·零活体触零写面零重启）
- 令源: BOD 直投 663 窗 A 令+COO 台账 663 §十六统排（cd43b35e1）+CTO 三方案卷方案二正身（71a04f08f §二）
- 性质: 勘定读数卷（值席只报不裁·判读→修法映射裁定归 CTO·D-46 脱敏·栈整段带回勿截断）

## §一 · 探 1 cron job 级读数（零 root）

- **healthz 全读数 JSON 原样**：`{"ok":true,"service":"trirmc","mcLedger":"ok","storePath":"/srv/fleet/TriRMC/data/cron/jobs.json","logPath":"/var/lib/trirmc/cron/logs","cron":{"enabled":true,"jobCount":6,"degraded":true,"consecutiveFailures":5}}`
- **路由面实读**（src/cron/routes.ts）：`/internal/v1/cron/jobs` GET/POST＋`jobs/:id/run` POST＋`jobs/:id` PATCH/DELETE＋`/internal/v1/cron/log*` GET——管理端点形勘齐
- **GET /internal/v1/cron/jobs → 200**＋`GET /internal/v1/cron/status → 200 {running:true,degraded:true,consecutiveFailures:5,jobCount:6}`（token 零回显用法·D-46）
- **per-job 状态字段面（归因核心）**：

| job | consecutiveErrors | lastError | 判 |
|---|---|---|---|
| **weekly-plane-shift** | **5** | `command exited with code 2: From ssh://47.245.122.61/srv/git/TriCompany * branch dev -> FETCH_HEAD` | **5 连败唯一源** |
| rmc-orchestrate-tick / tricompany-pull / e1b2-window-reminder-patrol-8710 / lg099-pre-gate / lg099-post-gate | 0 | None | **全绿五 job** |

## §二 · 探 2【R】journalctl 栈＋job 日志族全文

- **journalctl fleet 面实测可达**（rc=0·非 root 排他——【R】标注降级为值席直读·如实注）：近拍=trimodel fallback chain active 3 nodes（deepseek-chat/deepseek-reasoner/glm-5.3-flash·api_key journal 面已掩码 sk-9f****）+cron run-finished 行（tricompany-pull/e1b2-patrol exit 0）
- **5 拍同败点确认**（9c81c7ec 日志族·昨日 11-19 06:54→09:05Z 五拍）：每拍末行同形——
  ```
  [p1] score_skill_spawn rc=2
  RESULT: exit code 2
  ```
- **末拍栈整段（09:05:51Z run=shift-W46-20261119T090551Z）**：
  - 主链前段全过：preflight→qualify→git pull（stderr=`From ssh://47.245.122.61/srv/git/TriCompany * branch dev -> FETCH_HEAD`·fetch 本身绿）→plan_scope→dce_steps→verify→score_cli→score_rubric 全毕
  - **败点=score_skill_spawn 段**：seats=["cos","coo"]·双席 faces **absent:true rc:1**（raw_out 空·err=tricompass-context 注册行序列·日志面截断于 `[tricompass-context] co`）→`absent_seats:["cos","coo"]`→job 退 rc=2
  - hard_order_gate ok:true score_verdict:pass（客观分先于主观分硬序闭合面正常）
  - trap 兜底实证：`[shift_notify_fail] chain-fail alert sent (dual-address blocking)`——告警链活体工作（T1-3 结构断言生产面正形）

## §三 · 归并件 sg 面并勘（mc_link=degraded token 族·顺手项）

- **TriMMC 8712 活体进程 environ：`TRIMC_INTERNAL_TOKEN=在位`**（值零回显·D-46——/proc/1491977/environ fleet 面实证）
- **定性反转如实报**：CTO 预读卷 §二候选「token 未注入族」**被读数修正**——token 已注入在役（值席修复窗 .env 注入承录）→mc_link=degraded 归因候选收窄至 **值匹配面/TriMLC 侧重试态**——候 CTO 方案一勘定窗（TriMMC 托管 unit 建窗）落判·值席零自裁

## §四 · 判读映射初判（读数对 CTO 映射表·裁定归 CTO）

| CTO 映射表行 | 读数对表 | 值席面判 |
|---|---|---|
| command 指产物/脚本路径不存在 | 脚本链跑通至 score_skill_spawn 段（preflight→score_rubric 全毕） | ✗ 不符 |
| command 执行超时/非零退（执行面环境差） | 双席 spawn absent rc=1（spawn 面·非脚本本体） | 部分（spawn 面环境差候选） |
| job 注册 command 过时（旧拓扑残留） | command=WP4 新修形在役（054826 修面注记在卷） | ✗ 不符 |
| **其他栈=原文带回本席裁决** | **score_skill_spawn 座席 spawn face（cos/coo absent rc=1→rc=2）** | ✓ **归此行·栈原文 §二 整段带回** |

- **degraded 定性修正（对 CTO 粘滞疑面假设）**：非粘滞残留——weekly-plane-shift 昨日五拍**实败**累计 consecutiveErrors=5（今日零触发·计数现势=真连败非历史粘滞）——聚合面=单 job 真连败·其余五 job 全绿

## §五 · 护栏对表

- 零触现役活体 ✓（TriRMC 2687790/TriMMC 1491977 全程零触零写）·探序异常即停候裁 ✓（无异常面）·D-46 ✓（token 值零回显·journal key 已掩码态承录）·栈整段带回 ✓（score_skill_spawn 段+trap 行全文）

—— 值席 COS（窗 A TriRMC cron 5 连败勘定读数卷·归转 CTO 定性+COO 台账·D-47 落款=commit 对象时戳）

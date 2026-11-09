# r-plane-eval-01 · 成熟度评估卷 · CFO 节（成本/预算护栏维度）

> 席位=CFO（小财）·r-duty-cfo [6bbc1e]
> 评估时刻=2026-11-04T13:32:06+08:00（date 现查）/ UTC 2026-11-04T05:32:06Z
> 状态条（M-001）：首读数 UTC 2026-11-04T05:32:06Z / CST 13:32:06+08 原样粘贴；水位自估=高；末次活动时刻=不可得→以签发时刻 2026-11-04T13:34:18+08 代之并标注
> 勘验方式=源码只读 grep/read（零写源码/配置/仓面；现役 8710 TriRMC/443 caddy/8791 dsh 零碰未触）

## 一、事实面（可追溯代码证据）

| # | 事实 | 证据路径 | 语义 |
|---|---|---|---|
| F1 | 流面 token 计量在：in/out tokens 双向捕获 | TriRLC `src/server/openai-stream.ts` L67 emitUsage / L85 / L120-128 / L279-280；`src/server/anthropic-stream.ts` L90 / L232 / L350-352 | OpenAI+Anthropic 双轨流内 usage chunk |
| F2 | 客户端 usage 结构在（可接收 token 数） | TriPilot `src/trilcDirect/trilcClient.ts` L122 / L138 / L152 | 8711 API 面→客户端透传通道 |
| F3 | usage 零持久化（无账本落盘） | grep usage × (write/append/save/jsonl/ledger/log) → 零命中（TriRLC src 全域） | 计量即焚：流内透传不留痕 |
| F4 | 零货币化换算（无 cost/price 换算语义） | grep cost/budget/spend 两仓 src → 仅注释与结构命名，无换算逻辑 | token≠金额，单位经济不可算 |
| F5 | 请求级限流在（频率语义，非预算护栏） | TriRLC `src/daemon/watchdog.ts` L171 checkRateLimit / L179 rateLimitExceeded | 护栏雏形 0.5 个：非金额/token 累计语义 |
| F6 | 单次输出上限默认 4096 | TriPilot `src/cli/tripilot-cli.ts` L348 | 单次截断语义，非累计预算 |
| F7 | GUI/webview 面零成本语义 | grep TriPilot `src/webview` usage/cost/token → 零命中 | 终端用户不可见消耗 |
| F8 | 8711 族=follower+tray/watchdog（healthz 免鉴权只读面） | TriRLC `src/power-follower.ts` L1-13（跟随 8713 主闸闸态）；`src/tray/DaemonChecker.cs` L28 | 8711 定位=从闸只读跟随面 |

## 二、成熟度评级（CFO 域五级框架：L0 隐形成本 → L1 可观测 → L2 有护栏 → L3 口径闭环 → L4 经营闭环）

| 评估对象 | 评级 | 判据（对 F 表） |
|---|---|---|
| TriPilot+TriRLC 命令行为（主） | **L1 可观测** | F1/F2 计量在链路；F3 零落盘、F4 零货币化、无预算护栏 |
| 8711 族 API 面 | **L1 可观测** | F2 usage 透传；F5 rate limit 骨架在但非预算语义 |
| TriPilot GUI（辅） | **L0.5（L1 边缘）** | F7 webview 零成本语义；底层 trilcClient 有 usage 结构未消费至 UI |

**总评：R 面本地域产品成本维度=L1（计量在、账本无、护栏无、口径无）。**

## 三、对轨 M 面（sg 面 TriRLC/TriPilot 现役形态）

- M 面现役治理面有：BUDGET_CHECK 门禁件族（七必填 schema）、COS 授权矩阵支出分级（一次性 >20≤100 / >100 USD；recurring ≤10 / >10 USD·月）、D-23 排窗、GLM/DS 双轨 burn 口径、累计>2 亿/单次>1 亿 token 升级 CEO 阈值机制（在案）。
- 判定：M 面优势=**程序性/流程护栏**（治理文件面），非产品内建（代码面）护栏；sg 面产品侧与 R 面同源，产品内建预算护栏同为缺位。
- 差距结论：**产品侧两面对同为 L1**；改进主战场=把治理面护栏语义下沉为产品能力——R 面可作先导落点，反哺 M 面。

## 四、假设透明（行为护栏遵行）

- 本卷**零金额结论**：勘验未发现任何货币成本数字与报价源，按「不编造」护栏只给框架与等级，不给虚假精确数。
- 模型单价=公开报价可后续配置化，本卷不引具体价目（报价源未现查，禁估读/外推）。
- F3/F4/F7 的「零命中」=grep 语义缺证，非穷尽证明；如后续发现新证据，以增量勘验为准。

## 使用依据

- 勘验对象：`/srv/fleet/TriRLC/src`（server/daemon/heartbeat/cron）、`/srv/fleet/TriPilot/src`（trilcDirect/cli/webview）——只读 grep+read，勘验时刻 2026-11-04T13:32-13:34+08。
- 框架参照：本席财务制度面（BUDGET_CHECK schema 七必填、COS 授权矩阵分级、CEO token 阈值机制在案口径）。
- 评估树协议：M 面 COO 派工件（树 id=r-plane-eval-01，2026-11-04T12:52:29+08）。

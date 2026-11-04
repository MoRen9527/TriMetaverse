# ew cron 改挂 TriMMC · CTO 回询卷（架构级勘定·候裁不擅动）

- sourceOfTruth: 本卷（fade011-ew 迁移拓扑回询正身·候 COS 转 CEO 裁示）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COS 两节并包路由令 2026-11-04T15:24:57+0800 节二（CEO 15:22 裁：凌晨 3:30 docs-maintenance 改挂 TriMMC sg 8712·现挂 8713 改位退役）
- 停回询触发因: 执行令与可行性冲突（令文预设今晚 8712 首触发可达·实勘不可达）——停回询不擅动

## 一 · 勘定实锚四向

1. **TriMMC 零 fade 栈**：`src/fade` 目录不存在·app.ts 零 fade 端点·零 watch.ts——fade 机制（run 驱动/状态机/closing-gate/skill-loader/fade.db）全在 TriMLC 8713 本机。TriMMC 现役面=agent-loop/cron/daemon/heartbeat/internal-token/memory-injector/mirror/node-bridge/notify 等。→ 令文「首触发以 8712 next_run 为准」的 8712 job **无可触发对象**：今晚 03:30（2026-11-04T19:30Z）前全迁技术不可达。
2. **fade 栈自含·移植可行但=多日代码窗（估 2-4 日）**：fade 模块外链全 node 内建（crypto/fs/path/sqlite）零 TriMLC 内部外链（利好移植）；移植清单=fade 模块文件组移植+TriMMC app.ts 端点挂接+sg fade.db 初始化部署+tri-skill/claude 面 sg 同构验证+脚本 sg 化适配+**记录面 git 同步链**（树落 /srv/fleet 检出→fleet commit→bare→本机 fetch 收编——真源单点维持·流转跳+1）。
3. **脚本适配面四处硬编码**（scripts/fade/fade-daily-sweep.mjs 63 行实锚）：CMD_FILE=本机启动器路径/OP_ROOT=本机 operating-records 树根/PORT=8713/token 正则=TRILC_INTERNAL_TOKEN。sg 侧对应：TriMMC token 键=`TRIMC_INTERNAL_TOKEN`（src/internal-token.ts L8/L21·旧名前缀在役）+8712+/srv/fleet 树根——适配面清晰·以端点存在为前提。
4. **TriMMC cron 形态**（实施前置知识）：addJob=嵌套 payload {command,cwd} 形（平铺 400）·无 ALLOWLIST 门——与 TriMLC 平铺+白名单异构·实施单细节面。

## 二 · 跨机通道面（观察方案可行性判据）

sg → 本机 8713：回环不可达（无反向 ssh 通道）→ **sg 侧「兜底观察 job」对本机 8713 run 状态无可观对象**——本席初拟「8712 03:35 兜底观察 job」方案经通道面勘定判伪·如实撤回。GitHub/bare 异步中转=触发意图可传但执行候本机 fetch·非实时触发语义·不合「凌晨窗一次自动勘定」语义。

**结论：sg 可建 job 的唯一前提=TriMMC 自持 fade 端点（即档 X 全迁）——无中间态。**

## 三 · 三档方案候裁

- **档 X（真终态·CEO 裁技术正身）**：fade 栈移植 TriMMC 全迁——毕后 8713 job 退役兑现·但 2-4 日代码窗·今晚首触发不可达（§一.1）。
- **档 Z'（推荐·分阶段）**：
  - 阶段一（今日·零代码零风险）=8713 主 job 保留照跑（**退役暂缓**）·11-05 03:30 首触发读数照现行两日观察窗（11-06 SDE 日报核对）+8712 今晚不建 job（§二判伪结论）。
  - 阶段二（候治理窗）=档 X 全迁实施单（移植+适配+验证窗）→毕后 8713 job 退役·兑现 CEO 终态。
  - 可选增项（候采否）：本机 sweep 脚本增「失败才 notify sg 8712 outbox（urgent 形）」告警链——脚本内容级改动（白名单 command 串不变·零重启）·代价=本机 launcher 增 sg token 一行（D-46 面·token 副本+1）。缺省不装（11-06 日报核对已覆盖发现面）。
- 档 Y（判伪列出备查）：触发层 sg+执行层跨机回打——通道/离线/时序三面全劣（§二）·不裁。

## 四 · 候裁点

1. **档 Z' 阶段一「8713 暂缓退役」=对 CEO 15:22 裁的时点偏离**——候 COS 转 CEO 裁示·不擅动。
2. 阶段二真迁治理窗排程候 COS/COO。
3. **候裁期默认（裁示到达前）=现状零改动**：8713 job 照现行 cron 自然触发（job cron_mw1rdhym_7pwt·enabled·next_run=2026-11-04T19:30Z=11-05 03:30+0800）·8712 不建 job——无改动=无风险·语义=维持现役服务连续性。

## 五 · watch.ts 缺陷注记随迁勘定答（令文问项）

TriMMC 零 watch.ts（§一.1 实锚）——watch 形态已退役·档 X 移植**不携 watch.ts**（无随迁对象）·缺陷注记维持 TriMLC 侧版本窗登记不变（防未来复用 watch 形态者重蹈）。

## 六 · 使用依据

- COS 两节并包路由令 2026-11-04T15:24:57+0800 节二原文（CEO 15:22 裁）
- TriMMC src/ 活体勘定（零 src/fade·internal-token.ts 键名实锚）·sg trimc.service/healthz 活体
- TriMLC src/fade/ 模块自含性勘定（外链全 node 内建·内互依赖四件）·scripts/fade/fade-daily-sweep.mjs 63 行全卷
- 停回询纪律·D-46·D-47·历史冻结纪律

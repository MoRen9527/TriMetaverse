# CTO 方案稿 · LG-088 缓解 a/b 件（电源链家族第二案·候 E1 裁示并窗）· 2026-10-17

- sourceOfTruth: 本卷（trees/bod-tick/cto-lg088-mitigation-plan-a-b-20261017.md）
- syncMode: plan（方案稿·候 CEO E1 裁示+COO 并件窗序·**零施工零预授权**——裁准后随 E1 8713 站并窗执行）
- lastSyncedAt: 2026-10-17T02:24:51+08:00（date 现查·写前跑）
- 令链: LG-088 勘验卷 4091c1cbc 缓解建议→COO 02:23 处置（a/b 候并 E1 后续窗·8713 站并件一次 restart 摊销·方案稿候稿）→本稿
- 定谳卷: 勘验卷 cto-lg088-tick-gap-attribution-20261017.md（睡眠家族第二案·BOD 口径勘正）

## 件 a · SetThreadExecutionState 进程级保活（治本）

### 落点与改动面

| 项 | 正形 |
| --- | --- |
| 改动对象 | TriMLC（8713）daemon 启动链——`src/index.ts` `main()` 启动段（L34 起·REQ-018 pidfile 注册同段邻位） |
| API | `SetThreadExecutionState(ES_CONTINUOUS \| ES_SYSTEM_REQUIRED)`（**kernel32.dll**·勘正 03:0x：本稿原注 kernelbase 系笔误——活体冒烟实证 kernelbase 无此导出「Cannot find function」实锚，正身导出位=kernel32）——**只阻系统睡眠·不阻熄屏**（值守机无 UI 需求·语义正切） |
| ffi 载体 | **koffi**（npm·预编译零 node-gyp·业界标准 ffi 库）——TriMLC 现役依赖零 ffi 面（package.json 勘过）·唯一新增依赖·版本施工时锁最新稳定（本稿不写死） |
| 生命周期 | 进程死请求**自动失效**（OS 层保证）——daemon 崩溃→睡眠保护消失→系统照常 idle 入眠（fail-safe 天然·不会「daemon 死了系统永不睡」）·可选 signal-exit（已在依赖）挂显式清除钩子作整洁性补 |
| 语义边界 | **保护性强制睡眠保留**：极端低电量等 OS 强制睡眠可越过请求（防电池耗尽烧机）——正常 idle 睡眠被阻·保护性睡眠放行——值守不断+电池保护两需求并存 |

### 语义对照（为何 a 优于 c）

- 10-12 缓解-a（powercfg AC=0）已生效但**对 Modern Standby 不完全**——本案 AC=0/DC=0 双 0 仍入眠实锚（CS 特有触发器面）——机器级设置（c 件）已被实证不可靠；
- a 件=进程显式电源请求·走 Power Manager 请求面（`powercfg /requests` 可见）——与 CS 触发器机制正交，是 Windows 官方为「常驻服务型进程」设计的正形通道。

### 施工与验证门

1. **restart 链照勘修窗实操序正身**（10-11 勘修窗卷）：TriMLC-Watchdog Disable→POST /shutdown→验 port FREE→schtasks 冷启→pid/CIM 对表→Watchdog Enable；
2. **完工判据=值面探针**：`powercfg /requests` 输出 SYSTEM 段现 TriMLC 进程行（请求可见=生效实锚·healthz 绿≠生效·值面纪律同族）；uptime 重置+pid 对表照勘修窗三断言；
3. koffi 加载失败/非 Windows 平台=降级跳过+log warn（不阻 daemon 启动——跨机部署面 TriRMC 河源同型未来套用时同款语义）；
4. 自然窗观察：下一夜电池态窗 tick 连续性（或施工面自选主动短睡测试——候施工时定）。

### 工程量与回滚

- 工程量：koffi 依赖+~10 行+restart 链=**小时级**；随 E1 8713 站并窗=一次 restart 摊销两件（COO 已对）。
- 回滚：单 commit revert+restart 链回滚；进程死自动失效=天然兜底（最坏情形=回到现役睡眠形态，无新增风险面）。

## 件 b · 入眠盲区补报（兜底·两形候选候裁）

**关键语义勘误（对 02:22 毕报「入眠事件订阅告警」的修正）**：daemon 与一切本机探针在宿主睡眠面前**共同冻结**——「入眠瞬间告警」不可靠（冻结抢跑·网络先瘫）；正形分两形：

| 形 | 机制 | 补盲真值 |
| --- | --- | --- |
| b1 本机·唤醒后补报 | daemon 解冻后读 eventlog 唤醒事件（Kernel-Power 566/AcDcBurst）→发现刚历睡眠窗→补发告警+缺口注记自动生成（对接 tick 缺拍段） | 唤醒后知情——值守链不再「醒来了也不知道睡过」 |
| **b2 跨机·sg 侧心跳超时监测（推荐）** | TriMMC（sg 8712）cron 加一条 job：本机 8713 healthz 心跳超时 N 分钟（候值：45-90min）→告警 COS/toast | **真补盲**：sg 不随本机睡眠冻结·是唯一不受宿主电源面影响的观察者——两案（10-12/10-16）若有 b2 早就告警 |

- b1 落点=TriMLC 代码面（随 a 同窗·同 restart 摊销）；b2 落点=TriMMC job 装设面（sg 侧·独立轻量件·不经 restart 链——**若 E1 递推含 8712 站则三件并窗**，否则 b2 单独轻量直跑件）。
- b2 判据注意：心跳超时≠daemon 死（也可能 daemon 活而宿主睡）——告警文带「疑宿主睡眠（家族两案先例）」分诊提示，处置按勘验卷家族知识走。

## 候裁点汇总（随 E1 裁示流转）

1. a 件并 E1 8713 站（COO 已建议·候 CEO 裁示确认）；
2. b 件形态：b1（随 a 同窗）+b2（sg 侧·独立件）——**b2 本席推荐做**（真补盲·跨机观察者唯此一家）；
3. b2 超时阈值（45/60/90min 候值·施工时按 TriMMC cron 间隔与误报容忍定）。

## 使用依据

- LG-088 勘验卷 4091c1cbc（家族第二案定谳+缓解三案建议）·10-12 前案 cto-executor-stall-verdict-20261012.md（缓解-a AC 段生效实证+双失明元层缺口正身）；
- TriMLC 源码勘点（02:24）：src/index.ts main() L34·package.json 依赖面（零 ffi·signal-exit 在役）·trimlc-daemon-channel.cmd 启动链；
- Windows 电源 API 语义：SetThreadExecutionState 官方通道（ES_CONTINUOUS|ES_SYSTEM_REQUIRED·进程死自动失效·保护性强制睡眠保留）。

—— CTO 小狄（落款 date 现查原值 2026-10-17 02:24:51 +0800·发毕对表）

# CTO 设计卷 · F 件 b1 唤醒补报修复（Kernel-Power 事件订阅线替代 tick 差值法）· 2026-10-17

- sourceOfTruth: 本卷（trees/lg089-concentrated-window-20261017/cto-f1-wake-event-subscription-design-20261017.md）
- syncMode: static（设计卷·施工候门禁序·CEO 11:00:25 两裁①·COS 流转 ce8452365）
- lastSyncedAt: 2026-10-17T11:03:11+08:00（date 现查写前跑·D-47）
- 令源: CEO 11:00:25 两裁①「F 件立项·Kernel-Power 506/507 事件订阅线替代 tick 差值法」·方向锚=A1 卷 1493488d6 §三

## §一 方向与论证核心

**tick 差值法（现役 c8aebf3）为何不可修复**：它测的是「观测者自身心跳间隔」（lastReadAt 拍间差）——观测者被冻结则测量载体消失（A1 卷今晨实证：醒后 100+ tick 应触发零触发·wake-gap=0）；观测者被部分唤醒（假说① DRIPS 维护窗 tick 被调度且 read 成功污染 lastReadAt）则测量被静默破坏。**测量载体与被测对象同一，观测面不可自证——结构性缺陷，无参数可调**。

**事件订阅线为何根本可靠**：Kernel-Power 506（入睡）/507（唤醒）由内核在睡眠边界瞬间写入事件日志 System 面——**OS 侧持久化事实源，不依赖本进程活着**。拉取式查询（wevtutil /rd:true 倒序拉历史）：即使本进程 tick 被 DRIPS 打散、延迟、甚至整段冻结，醒后任意一次成功查询都能读到完整睡眠史（506/507 时刻对）。**观测者只是读者——读者可以死，测量对象（事件日志）死不了**。DRIPS 维护唤醒窗不产生 507（今晨事件日志实证：三段完整 506/507 对，段间维护窗活动=Netwtw10 D3 行，无 507 噪声）——假说①在此线天然不成立。

## §二 机制设计

| 面 | 设计 |
| --- | --- |
| 查询面 | `wevtutil qe System /q:"*[System[Provider[@Name='Microsoft-Windows-Kernel-Power'] and (EventID=506 or EventID=507)]]" /c:10 /rd:true /f:xml` ——一次拉最近 10 条（506+507 混流倒序） |
| 节律 | **挂现役 60s tick 串行**（不新开 interval）——wevtutil ~200ms 量级，追加后 tick 总时长 ≤30s（read 20s 上限+查询 10s 上限）<<60s 节律，重入窗口不触及 |
| 配对算法 | 倒序流中取最近 507（唤醒）→其之前最近 506（入睡）=一段睡眠时刻对；507 无前置 506=缺对不判（冷启后无睡眠史形态，静默） |
| 阈值 | 507−506 > **POWER_WAKE_MIN_DURATION_MS（5min，沿用现役 5min 语义，常量更名）**才补报——浅睡段（今晨段① 2min57s）静默；64min/5min49s 段（段②③）报。常量值不变仅更名，diff 面可读 |
| 防重 | lastNotifiedWakeAt（内存，记已报 507 的 SystemTime）——仅报晚于它的 507；一段睡眠一个 507=天然一次/段 |
| **基线吸收** | 启动后首拍查询=只记 lastNotifiedWakeAt 不报——**防 restart 后重放历史睡眠段误报**（10-11 勘修窗实操序必 restart，本件生效窗自身就要 restart） |
| 补报内容 | 入睡/唤醒时刻对+时长（ISO 原值）——沿现役 dispatchNotify（level normal·seats m-cos·标题[LG-088] 唤醒补报）·分诊提示保留（冻结≠定谳睡眠——事件线时代此提示弱化但保留：休眠/现代待机混合形态仍分诊） |
| 权限面 | System 日志 Users 默认可读——**今晨 A1 勘验即非提升会话实读事件日志=权限面已实证**，零提权 |
| 平台 guard | process.platform==="win32" 才挂事件线；非 Windows 静默跳过（TriMLC 现役仅 Windows 部署，guard 为跨平台预留） |
| 失败面 | wevtutil spawn 失败/超时（10s 上限·沿 defaultReadPower spawn+timer kill 正形）→wakePollFailures 计数+log——**不接 urgent**（事件线=观测面，观测面缺失≠闸失效，闸有独立 read 失败告警面）；连续失败仅日志留痕 |
| snapshot 可见化 | PowerSnapshot 增三字段：lastWakeSeenAt/lastNotifiedWakeAt/wakePollFailures——healthz 可见（观测面自身可观测） |
| **编码面（待实证点·如实标）** | wevtutil 输出默认 UTF-16LE——Buffer 解码参数（utf16le vs /uni 参数关编）**候实施时实测定谳**，验收判据=XML 可解析（parseWakeEvents 单测用标准 UTF-8 文本夹具，编码面隔离在 spawn helper 层） |

## §三 改动落点（最小面·单文件）

- `src/power-monitor.ts`：
  1. tick() 头部 gap 检测段（L317-333·c8aebf3 全段）**删除**——替代非并存
  2. 新增 `defaultQueryWakeEvents(timeoutMs=10_000)` spawn helper（wevtutil·windowsHide·timer kill）
  3. 新增 `parseWakeEvents(xml): {sleepAt: string; wakeAt: string} | null` 纯函数（单测直驱）
  4. tick() 头部新增 `checkWakeupEvents()` 调用（串行 await·首拍基线·防重·阈值·dispatchNotify）
  5. 常量：POWER_WAKE_GAP_MS → POWER_WAKE_MIN_DURATION_MS（值不变）
  6. PowerSnapshot/PowerMonitorDeps 同步扩（deps 加 `queryWakeEvents?` 注入缝——沿 readPower 缝正形）
- 不动面：app.ts 装配零改（deps.notify 现役链直用）·cron/ALLOWLIST 零涉·健康检查端点字段自然透出

## §四 门禁序

1. **单测**（新增，parseWakeEvents+状态机族）：XML 解析（标准夹具）/507 缺对不判/时长阈值判定（4min59s 静默·5min01s 报）/防重（同 507 二跑不重报）/基线吸收（首拍只记不报）/平台 guard——六族
2. **现役回归**：power-gate 24/24 保持绿（b1 段删除不影响闸状态机族）
3. `npm run check` + `npm run build` RC=0
4. **活体边界（如实声明）**：可控触发真实睡眠不可行（不为验证人为睡眠宿主）——活体验收=生效 restart 后日志「wake monitor baseline absorbed」行+**首个自然睡眠段捕获**（今晨三案频率=白天自然捕获概率高）·首段自然捕获前状态=「单测绿+活体待验证」不称 production-ready
5. **回滚姿态**：revert 单 commit 即回 tick 差值法——如实注记：差值法本身今晨实证无效，回滚位非有效防线，回滚语义=回已知基线而非回有效防线

## §五 生效窗与运维

- 纯代码改动：门禁序毕后需一次 8713 restart 生效——**候 COO 排程独立窗**（白名单①类·10-11 六步实操序）；E1-1 提醒 job/ALLOWLIST 存态不受影响（restart 存态面已实证保留）
- 生效窗内完工锚预置：①build 产物时间戳对表 ②channel.log「power gate monitor started」新行+baseline absorbed 行 ③healthz snapshot 三新字段值面 ④回滚锚=revert commit SHA
- 与 E1-5（8711 restart 独立窗）互不摊销：不同 daemon 各自独立窗纪律不破

## §六 顺带候批增量（不并入本件·单列候裁）

- **wakeFromFreeze 心跳标记字段**（b2 料包 v2 依赖件）：checkWakeupEvents 捕获段后向心跳 payload 注入 recentWake 语义字段，sg 侧 b2 判据读到=「睡眠期预期中断」静默+清警——动 app.ts 心跳面，超本件最小面，**候 COO/COS 批增量**；批则随 F 件同窗 restart 摊销生效（零额外窗）

## 使用依据

- CEO 11:00:25 两裁①（COS 流转 ce8452365）·A1 卷 1493488d6 §一 1.3/§三
- 现役源码核：src/power-monitor.ts 全 426 行（11:02 现读·c8aebf3 b1 段 L317-333/lastReadAt L357/dispatchNotify L284/POWER_WAKE_GAP_MS L260）
- 事件日志实证：今晨三段 506/507 对（A1 卷 §一 1.1）·非提升会话可读实证（A1 勘验同会话）
- 待实证点如实标：wevtutil 编码参数（§二编码面行）

—— CTO 小狄（落款 date 现查原值 2026-10-17 11:03:11 +0800·发毕对表）

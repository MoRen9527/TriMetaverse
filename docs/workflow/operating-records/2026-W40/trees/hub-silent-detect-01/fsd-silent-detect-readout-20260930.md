# FSD·静默探测批施工读数（900s job + 共享 infra 三件 + allowlist 三串）

- sourceOfTruth: 本件（FSD 施工读数卷；令源=CTO 02:36 静默探测派工+裁定卷 §三/§八 @cto-bod-three-items-rm-verdict-20260929.md）
- syncMode: static（完工终态，候 CTO 验收）
- lastSyncedAt: 2026-09-30T18:3x+0800（date 现查=2026-09-30 18:35 +0800）
- 施工席: FSD 小全（m-fsd）

## 批件清单

| 件 | 落点 | 态 |
| --- | --- | --- |
| 共享件① notify-sender | `scripts/fade/lib/notify-sender.mjs` | ✅ 真火 200 |
| 共享件② tree-signals（三源读取器） | `scripts/fade/lib/tree-signals.mjs` | ✅ 单元+实弹双绿 |
| 共享件③ cron-allowlist（统一管理） | `scripts/fade/lib/cron-allowlist.mjs` | ✅ 合并幂等+校验 |
| 900s 探测本体 | `scripts/fade/hub-silent-detect.mjs` | ✅ 实弹 round healthy=2 alerts=0 |
| allowlist 三串注入 | `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` L19 | ✅ 5→8 串，--check 过 |
| 回滚锚 | 同目录 `*.bak-pre-silentdetect-20260930T1834+0800` | ✅ 3178B 重建快照 |

## 架构落位（对裁定卷 §三）

- **900s job=spawn 脚本形态**（§三底座「8713 cron spawn 容器现役形态不变」）：判定在脚本（与 ledger-watchlist-patrol 同构先例），发信走信箱双跳（channel case-a：POST TRIMC_NOTIFY_SG_URL/internal/v1/notify → sg 8710 信箱 → 值席/COS 消费转发），**零 pipe bridge**。
- **探测目标**：in-progress.json 非 closed 条目按 owner 席位展开 + 值席二跳（中枢 m-cos transcript 静默>30min → targets:['bod'] 直报）。
- **三源 OR 豁免**：①树 node-status.jsonl 尾行 ts ②树目录 git log 尾 commit ts ③席位 transcript mtime（首行 customTitle=opsName 名址映射，实勘 12+ 席全部命中；SDE 双名漂移 m-sde/m-dee 别名族并入，观察项）。任一源 15min 内新鲜=非 idle。
- **分级**：全静默>15min=reminder 级（发承办席自己 nudge）；>30min 且非 waiting-window=idle 升级 COS；waiting-window=结构性候办理由不升级；**空账=安全降级零告警**。
- **cooldown**：每节点每级别一轮一次（30min 窗），状态文件 `.fade/tmp/hub-silent-detect-state.json`（原子 tmp+rename）；节点恢复活跃自动清态。
- **三钉契约**：①锚核查失败出声（ledger 不可读/ git plumbing 失败→error 信+日志，禁静默跳过）②发信失败不置 notified（仅 sendNotify resolve 后写 cooldown 态）③解析失败不崩 job（逐条 try/catch+总 catch，恒 exit 0 防 spawn 容器重试风暴）。

## 自测三面（灰度前置）

1. **判定面实弹**：真账真跑一轮——`open=1 healthy=2 alerts=0`（F-3 条 FSD silent 0min + 值席 silent 1min，全绿零告警零误报）；execution_log 落 `.fade/probe-logs/hub-silent-detect.log`。
2. **信箱真火**：sendNotify 自测信一发 → **HTTP 200**（targets=m-fsd 自收，标注可忽略）。
3. **单元边界**：脏 owner 解析（`SDE（…）/COS（…）`→双席命中）、ts 变体（带/无时区）、substring 卫哨（HALFSD 不误中）、prose treePath 降级、allowlist 合并幂等/缺失flag——全 ok。

## allowlist 现值（8713 channel env）

- 5→8 串（幂等合并 lib 复用，追加三新串，旧 5 串未动）：
  - `node D:/Code/ai/TriMetaverse/scripts/fade/tree-node-patrol.mjs`（COS 串一，scripts/fade 真身化新路径）
  - `node D:/Code/ai/TriMetaverse/scripts/fade/ledger-watchlist-patrol.mjs`（COS 串二，同上）
  - `node D:/Code/ai/TriMetaverse/scripts/fade/hub-silent-detect.mjs`（第三串，FSD 定义，同风格）
- **旧 .fade 两串（tree-node-patrol/ledger-watchlist-patrol）暂留**：候 COS 双 job PATCH 完成确认后一并退役清理（债务标记：先删会致过渡期 force run 403）。
- 900s job 挂载参数（COS 重启后 PATCH 用）：schedule=`*/15`（900s），command=第三串，enabled=1。

## 候 CTO 追认项（→ 已追认终态，18:39 CTO 裁词回执）

1. **source_seat 身份选择**：sg 8710 notify 端源席白名单=MVP 硬编码（TriMMC `src/notify/outbox.ts` L65：m-duty-cos/bod/m-cos/m-coo），FSD 实名不在册。冒名个人席=通信伪造红线不碰。**取 `m-duty-cos` 值守系统信道身份**（机制位非个人席；body 内实名溯源=hub-silent-detect by FSD）。→ **CTO A 案追认**（18:39）：语义自洽+红线双守+B 案成本不成比例。
   - **护栏升约已落 lib 契约**（CTO 升约令）：`notify-sender.mjs` 机制位（m-duty-cos）发送**必带 `attribution` 实名溯源**，缺省 throw（fail-closed），溯源字段自动前缀 body。回归三绿：T1 机制位缺实名=throw ✓ / T2 带实名真火 200 ✓ / T3 个人席过护栏 ✓。
   - **B 案归宿**（CTO 裁）：列 TriMMC 通知面正形化候办（候未来 sg 维护窗随批，非独立开窗）——本卷记一笔在案。
2. **回滚锚为重建快照**：Copy-Item 静默失败产 0 字节死壳（已删）；改前态以「当前文件逆还原 allowlist 行」重建（3178B vs 原版 3173B，差 5B=行尾统一化，唯一被改行逐字还原，34 行数一致）。非逐字节克隆，功能等价。
3. **947 触发的 cooldown 粒度**：状态键=`<entry-id>|<level>`——同节点 reminder 升级 idle 时各自独立冷却窗（设计意图：升级不被 reminder 冷却吞）。

## 技术债务/观察项

1. SDE 席位名漂移：seats.json opsName=m-dee vs 实际 transcript m-sde（30MB 活跃在案）——别名族双兼容已入 tree-signals，根治候名址治理批。
2. 旧 .fade allowlist 两串退役清理（候 COS PATCH 确认后，同批或下一维护窗）。
3. transcript 名址扫描逐文件读首行（58 文件/轮）——900s 节律下开销可忽略；席位数增舱后如需优化再做 mtime 预筛。

## 使用依据

- 裁定卷 cto-bod-three-items-rm-verdict-20260929.md §三（静默探测架构）/§八（in-progress.json schema）
- CTO 02:36 静默探测派工令（四件+三钉+灰度第一周+首轮 execution_log 读数要求）
- COS 18:19 两串交付（byte-exact）+今夜对时序列（我 20:00 重启→COS probe-gate→PATCH）
- 构造先例：scripts/fade/ledger-watchlist-patrol.mjs（notify 契约/三钉模式/原子写回）、.fade/seat-watchdog.ps1（席位名址）、seats.json v2.0
- 实勘证据：in-progress.json 现值、node-status.jsonl 尾行、transcript customTitle 扫描（12 席命中）、sg 8710 403→200 信箱双态、channel cmd L19 现值

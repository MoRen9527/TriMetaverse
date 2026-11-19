# CTO R6-hook 修复三件门禁审查卷（fsd fddb630·APPROVE 两注记·债 6 立项·cleanup 真跑合规确认）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·R6 hook 三件门禁审正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 审查对象: fsd-r6hook-impl-20261120.md（f5bf0edbb）+TriMLC dev fddb630（5 文件+682/−11）——独立 code review 前置（本席 06:21 tick 直读 notify-inject.cjs 现文·先于毕报）
- 审查结论: **APPROVE（两注记非阻塞）**——三件铸面对表 cdda4386a ✓+升级面两处优于铸面原义采认·门禁读数面齐（17/17 真起服 e2e+858/5 基线同谱+tsc/build 双绿）

## §一 · 铸面对表（三件逐项）

| 件 | 铸面原义（cdda4386a §三） | fsd 落码 | 裁 |
|---|---|---|---|
| ① 降序取最新 N | 降序取 20+行内截断+旧件聚合一行 | INJECT_LIMIT env 缺省 20+sort received_at 降序+slice+200 截断+聚合行——**生效实锤=本会话 hook 聚合行已现** | ✓ 对表 |
| ② 注入即标读 | hook 侧 load→filter→原子 dump | **升级形采认**：POST daemon 端点=写面收敛 daemon 单进程同步段原子（hook 零直写文件——多进程读改写竞争族根除·优于 hook 侧 dump 原义）+失败静默下回合幂等+timeout 1500+agent:false 无 destroy 防 ECONNRESET | ✓ 采认升级 |
| ③ 存量清理+cap | 一次性 markRead 保留窗+storeLetter FIFO cap | cap500 落箱面裁最旧（**归档失败=零裁剪零删·数据保全优先**——好设计）+cleanup 脚本（dry-run/幂等 404 可重跑/fail-closed/并发 10 分批） | ✓ 对表+保全设计采认 |

- **随件出界修（app.ts markRead abort 防御）裁=合理配套**：件② timeout destroy 形→daemon `for await` ECONNRESET 崩级 rejection（毕报 §二.4 崩栈实锚）——不修则件② 的降级路径本身打崩 daemon——配套最小修一处正当；同族 POST 端点缺位=债②候勘修窗统一修 ✓（daemon 面最小化遵行）。

## §二 · 门禁读数面判定

- **17/17 新案全绿**（真起服+异步 spawn e2e——spawnSync 阻塞父进程事件循环=全案败真因勘定·调试链五层逐剥在卷）——**含标读真链路闭环**（§二.5 h5 案：runner env 展开序 bug 勘定后 hook 实打活体 daemon 标读成功=件② 端到端实测）+降序聚合/多席隔离/降级四形/幂等重跑/归档失败安全钉——覆盖面完整。
- **全量 858/5**：基线 5 fail 族逐字同谱零新增（863=846+17 全对上）✓。
- **tsc/build 双绿**+dist 产物 applyMailboxCap 命中实锚 ✓。

## §三 · 注记两项（非阻塞·如实入账）

1. **注记①（债 6 立项）·件② 生产面 token 供给未实勘**：毕报债 1 勘了 TRILC_PORT（user/machine env 双空→hook env 链不可达→缺省 8713 兜住）——**TRILC_INTERNAL_TOKEN 同族面未载实勘读数**：若同属启动器私有 env（hook 进程经 claude.exe→shell 会话继承·大概率不可达）→生产 hook TOKEN 空=件② 恒静默降级（标读永不发生）——影响评估：件① 主修不受影响（毕报原义）+**cap500 兜底=堆积封顶不失控**（daemon 落箱面·不依赖 hook token）+cleanup 真跑一次性清存量——**可接受上线态非阻塞**；正解=token+port 部署面供给统一勘定落位（settings hook env 前缀或启动器级 export）——**债 6 入勘修窗**（与债 1/债② 同窗裁量）。
   - **生产面实证补强（06:51·债 6 定谳升级）**：daemon 06:36 冷启装载 .cmd 新 token 后，本席会话 hook env 遗传旧值→markRead POST=**401**（活体探针·真 message_id 单发·delta=0·D-46 值面零回显只出 status/count 面）——与 sde 卷 §三.1 cleanup 首跑「shell env 旧值≠.cmd 新值 MISMATCH」401 全败同机理独立复现+by_seat bod=114 双读数吻合——**债 6 生产面真形=token 配对错位（非缺席形）**：全部存量长驻会话（13 席现役会话面）hook=静默 401 降级（标读不生效·同批 20 件跨拍重复注入=本席会话活体实证）；sprint 内降级可容（cap500+24h 保留窗+cleanup 幂等可重跑三兜底）；**勘修窗正解=token 文件单值源**（daemon 与 hook 同源读·根除「每次 daemon 重启换 token 即断配对」族）+user env setx 新值=快修过渡（新会话即生效·存量会话重启窗收口）。
2. **注记②·cleanup 真跑合规确认**：不可逆写面（无 unmarkRead）×全司信箱——候 COS 一令+真跑前活体 dry-run 复测前置（毕报 §六 执行面口径在）——**合规遵行确认**；真跑窗建议=随 daemon 重启窗（与 D-46 token 轮换顺手窗同族错峰·零双写面并发）。

## §四 · 债清单收记（勘修窗排程候选·本席裁量预告）

| 债 | 项 | 勘修窗裁定预告 |
|---|---|---|
| 1 | TRILC_PORT 缺省 8713（hook/cleanup 同形） | 与债 6 同窗（部署面供给统一勘定） |
| ② | app.ts 同族 POST 端点 abort 防御统一修 | **勘修窗首项候选**（崩级面·优先级最高） |
| 3 | hook lowercase 切段债 | 现役零触发·挂账观察 |
| 4 | cleanup 真跑 | 候 COS 令+dry-run 复测前置（§三注记②） |
| 5 | TriMLC push 443 断窗 | **已闭**（sde 段③补推·origin/sg-server/本地三 hash 全等 fddb630·sde-trimlc-reload-cleanup-20261120.md §四） |
| **6（本席新立）** | TRILC_INTERNAL_TOKEN hook env 链供给勘定落位 | 与债 1 同窗（§三注记①+**生产面实证 06:51=401 配对错位**·正解=token 文件单值源+user env 快修过渡） |

## §五 · 使用依据

fsd-r6hook-impl-20261120.md（f5bf0edbb）+TriMLC fddb630 码面（notify-inject.cjs 本席直读+cleanup/letter-store/app.ts 毕报载形）+本席铸面卷 cdda4386a（修复面三件正身）+e91ffbb36（A 段实锤·daemon 零改码义确认——app.ts 一处=hook 工单配套面非拍发链回改）+D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T06:25:43Z（+8=2026-11-20 06:25:43·date 现查原值·D-47 正形）

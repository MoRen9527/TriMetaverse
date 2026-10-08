# S3 通道维护波 · CTO 判据卷（8711 缺口族+门形统一翻案）

- sourceOfTruth: 本件（trees/s3-channel-maintenance-wave/cto-s3-criteria-20261008.md）
- syncMode: final（判据卷正身；施工判据以本件为验收锚源）
- lastSyncedAt: 2026-10-08T04:07:08Z（12:07:08+0800 周四，date 现查原值）
- 拟制席: CTO 小狄（m-cto）；令源=COO 排工卷单 3 附轻催（SDE 断点移交候判据卷）
- 消费方: COO（据此出 S3 窗令）+SDE（窗内施工判据）+STE（验收锚对表）

## 〇、摘要（大白话）

SDE 移交的 8711 三缺口，本席逐行读了 TriRLC/TriMLC 两仓源码后，图景大改：**四个缺口里真要动代码的只剩一个半**——①8711 新建 cron job 永不触发的 F-3 缺陷是真缺陷（实锤）；②「/shutdown 虚门」经考古翻案：源码顶早有全局鉴权门（8 月 27 日就进了），此前两条「无门」定性都是只看了端点局部没看全局门的误判——本席自己那条先犯，翻案自报；③鉴权门形统一收窄为「活体验锚+sg/R 面补勘」非补形施工；④DATA_DIR 分裂是配置归一小事。预估真施工 30 分钟级+探针验锚，建议 2 小时白窗打包。

## 一、现勘实锚（本席亲勘 2026-10-08 上午）

### 1.1 F-3+ 根因链（8711 新 job 永不调度·实锤闭合）

| 环节 | 锚 |
| --- | --- |
| INSERT 漏列 | TriRLC `src/cron/store.ts` L229-244：`INSERT INTO cron_jobs` 列清单**无 next_run_at**，VALUES 亦不含 |
| 读回为空 | store.ts L106：`nextRunAt: row.next_run_at ?? undefined` → 新 job nextRunAt=undefined |
| timer 过滤 | `src/cron/timer.ts` L95：`jobs.filter((j) => j.enabled && j.nextRunAt)`——**无 nextRunAt 的 job 被 timer 永久过滤** |
| PATCH 兜底在位 | store.ts L294-300：update（含 PATCH {schedule}）时 recompute nextRunAt——同值 PATCH 补值=已知 API 正途缓解，保持不动 |

结论：POST 201≠会触发成立，根因=INSERT 不算值+timer 双条件过滤，与 TriMLC F-3 同源缺陷家族（8713 侧 09-30 已修，8711 侧未修）。

### 1.2 门形考古与翻案（本席自报）

- **git 考古**：fail-closed 全局门引入 commit=`26720dd 08-27 16:22`（p0fix3 PD-1「全局 X-Internal-Token 门 fail-closed + Host/Origin 校验拒 rebinding」）——**同一 commit hash、同一时点在 TriRLC 与 TriMLC 双仓落地**（同源分形）。
- **TriRLC 源码顶**（8711）：全局门 app.ts L1777-1812，门序=`/healthz` 精确豁免 → Host 白名单 403 → Origin 白名单 403 → X-Internal-Token 401（**fail-closed：TRILC_INTERNAL_TOKEN 未配置即 401 `internal_auth_disabled`，非放行**；请求期读 token+timingSafeStringEquals 恒时比较）。`POST /shutdown`（L4570）在同链门后。
- **TriMLC 源码顶**（8713）：全局门 app.ts L1754-1787 与 8711 同构（TRIMC_INTERNAL_TOKEN 同形 fail-closed）。
- **翻案①（b14 注记 a·本席 10-06 裁）**：「app.ts L4573 零 token 实校=虚门」定性**撤销**——误因=只验 /shutdown handler 局部、漏验 L1777 全局门（局部读法盲区，本席首犯，自报）。时间线如实注：08-27 前的旧 build 运行时段 /shutdown 确无门（彼时虚门曾真）；08-27 后 build 起门已覆盖。
- **翻案②（LG-065 S2b 勘差注记·SDE）**：「源码现顶 L4275 无门形（版本差行为分叉）」定性**撤销**——同根误判第二例（8713 现顶 L1754 全局门在位；当时首发 401 恰是门行为实证非旧 build 遗产）。建议 COO/SDE 侧对 S2b 注记补勘误行。

### 1.3 DATA_DIR 解析序（8711 store 落位）

- `src/config/env.ts` L151：`dataDir = process.env.TRILC_DATA_DIR ?? %LOCALAPPDATA%/trilc`——**代码默认=trilc\**；cron store=`${dataDir}/cron.db`（service.ts L64）。
- 分裂风险实锚：ps1 链若显式设 `TRILC_DATA_DIR=...\trirlc\` → 双目录并存（trilc\ 与 trirlc\ 各有 cron.db 可能），记忆条 trilc-cron-command-allowlist 在案。

## 二、四缺口判据（逐项）

### 缺口1：8711 F-3+（真施工·本窗主件）

- **修法方向（二法任选，判据钉行为面）**：
  - 法 A=INSERT 前计算 nextRunAt 并写入列（新增 cron 表达式→时刻计算逻辑+边界单测）；
  - 法 B=INSERT 后立即走与 update 同路 recompute 补值（**复用 store.ts L294-300 现役代码路径，改动面最小，本席倾向 B**）。
- **段门判据**：新建 job 后 sqlite 只读查 `next_run_at` 值面非空（防漏写回归锚）；timer 加载集含新 job。
- **活体验收锚**：POST 新建 job（schedule=2 分钟后）→201→sqlite 查 next_run_at 非空→到点真实触发一次（state 变迁/RunLog 增行）→PATCH {schedule} 同值→next_run_at 保持非空且重排（幂等）。
- **回归门**：TriRLC 既有 P0 守护套件（59 例，含 token 门/cron 白名单双入口）全绿+全量零新增 fail。

### 缺口2：/shutdown 门形（施工面销案→活体验锚项）

- **源码面**：零施工（全局门已在，§1.2）。
- **窗内活体探针（只读安全二连）**：无 token POST /shutdown 期望 401；错 token 期望 401。
- **硬规定：窗内禁止「对 token 真停探针」**（防窗内自停 8711）——对 token 200 真停验证改挂下次正规服务重启窗顺带观察。
- **判读分支**：若探针返 200（非 401）→ 运行态 build 早于 08-27=部署落后缺口，修法=重建部署非改码，即窗内升级处理。
- **销案注记**：b14 注记 a 翻案行+S2b 勘误行随本卷入 S3 窗毕报（本席翻案责任已自报在案）。

### 缺口3：鉴权门形统一（残面收窄为验锚+补勘）

- **公司统一标准形（本席裁定）**=8711/8713 现形：fail-closed（未配置 token 全拒）+Host/Origin 白名单+恒时比较+请求期读 token。新 daemon 一律照此形，不允许「未配置即放行」兼容变体新增。
- **残面 1（sg TriMMC 8710）**：兼容变体（「未配置即放行」，8711 代码注释参照对象在案）→ **迁移评估项，不在本窗施工**。迁移前置=sg 调用面带 token 盘点（8460 代理链/值席通道/DE 通知链三方），全带后切 fail-closed；sg 勘验候 S3 窗内只读探针补一条（无 token GET 非 healthz 端点观察 401/200）或另排值席窗。
- **残面 2（TriRMC 8712·R-HY）**：门形未勘——S3 窗内一条只读探针补勘（同上形），读数入窗毕报定归属。
- **本机 8711/8713**：探针二连（缺口2 探针即覆盖 8711；8713 同款一条）确认运行态门行为与源码顶一致即闭。

### 缺口4：DATA_DIR 对齐（配置归一·小件）

- **窗前只读盘点**：`%LOCALAPPDATA%\trilc\cron.db` 与 `trirlc\` 下是否双 store 并存+各自 mtime/run_count——有分叉先定权威 store（数据新者为权威）再迁移，无分叉直接归一。
- **归一方向二选一**：A=ps1 链统一显式 `TRILC_DATA_DIR`（正名 trirlc\，改脚本）；B=删 ps1 显式设回代码默认 trilc\（改配置）。**本席倾向 A**（目录名与现役正名一致，代价=一处脚本 diff）。
- **可选加固（本窗顺带）**：启动日志打印 store 落位路径一行（可观测防再分裂）——~5 行小改，与缺口1 同窗。
- **验收锚**：归一后冷启 8711，healthz/日志读 store 路径单一+job 清单完整带出。

## 三、S3 窗令建议（三栏输入·候 COO 出令）

| 栏 | 内容 |
| --- | --- |
| 窗下限推算 | 缺口1 法 B 编码+单测 ~30min / 探针四连（8711×2+8713×1+8712×1）~15min / DATA_DIR 盘点+归一 ~20min / 全量回归 ~30min ≈ **95min → 建议 2h 白窗** |
| 段锚建议 | 候 COO 按候选窗（10-10+ 白窗）落；段间硬绿门：缺口1 全量回归绿后方可进探针段 |
| 超窗即报 | 照 M2 regime；探针出现 200 异常（门不在）即升级不滑窗 |

- **与两候选单并窗判定（本席定性）**：LG-069 403/PENDING-RESEND 系 sg TriMMC 共享通道面（token len=64 分叉），与本窗四缺口**不同源**——可并窗执行但**分线勘验**，一窗两线不混锚。

## 四、风险与缓解

1. **修法选择风险**：FSD 若偏好法 A，cron 表达式解析边界（DST/月界/时区）需单测覆盖，工作量上浮——窗令建议栏已按法 B 计。
2. **探针误自停**：窗内禁对 token /shutdown 探针（§缺口2 硬规定），带 token 探针只发 401 面错误 token。
3. **sg 面越窗风险**：8710 迁移评估涉跨机调用面，明确不在本窗——防窗令范围爬升。
4. **翻案连带**：b14 注记 a 与 S2b 两条定性撤销涉及既有卷面——窗毕报统一勘误注记，不逐卷回改（历史卷面留痕原则）。

## 使用依据

- TriRLC 源码亲勘：src/cron/store.ts（L34/L106/L229-244/L294-300）/src/cron/timer.ts（L95）/src/config/env.ts（L151）/src/server/app.ts（L1777-1812/L4570-4582）
- TriMLC 源码亲勘：src/server/app.ts（L1754-1787）
- git 考古：TriRLC/TriMLC 双仓 `26720dd 08-27 16:22`（p0fix3 PD-1 同批落地）；TriRLC 顶 5b3f2f7
- b14 消费面裁卷注记 a（batch-13/cto-b14-consumption-surface-ruling-20261006.md L34）；LG-065 coo-window-log-20261007.md L31（S2b 注记）
- s3-candidates-20261008.md 并表卷（本席判据范围+两候选单锚指针）；COO 排工卷单 3
- 记忆条：trimc-mlc-addjob-divergence（F-3 家族/PATCH 正途）/trilc-cron-command-allowlist-exact-match（store 落位/DATA_DIR 分裂）

# CTO 收口卷 · A1 窗实况=对象断言勘误+验收面实测（零施工·三件全绿）· 2026-10-19

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/cto-a1-acceptance-closeout-20261019.md）
- syncMode: static（A1 窗收口·毕报三送之 CTO 面·COO/COS 同文另送）
- lastSyncedAt: 2026-10-19T13:16:00Z（+8=21:16:00 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: CEO 21:00:28 照准（窗 21:00-22:00 本机 8711 独占·施工人=CTO 线）→BOD 21:01 派工令（任务书 ad310812d）→COO 21:06:08 窗内三裁
- 实况口径（COO 裁准行原文）：「对象断言勘误+验收面实测」

## §一 实况主线：对象断言与活体不符→停手回询→COO 三裁

**勘误事实**：任务书 §二 对象断言表记「TriRLC 8711=候部署（ALLOWLIST 追加+重启）」——本窗开工前置勘验（21:02-21:04）活体推翻：

| 勘验面 | 活体读数 | 推翻点 |
| --- | --- | --- |
| cron_jobs 表（`%LOCALAPPDATA%\trirlc\cron.db`） | e1-window-reminder job 在册（id=cron_mvbxayba_a4sa·every=300000·enabled=1） | 非「候注册」 |
| 运行计数 | run_count=418·error_count=0·created_at=2026-10-17T04:55:28Z（+8=12:55·段2 restart 窗注册） | 已健康运行 32h |
| ALLOWLIST | 命令串 `node D:/Code/ai/TriMetaverse/scripts/ops-local/window-reminder-patrol.mjs` 已过白名单（执行全 ok） | 非「候追加」 |
| env 分离 | 安装壳 `trirlc-daemon.ps1` L10 已设 `$env:TRILC_DATA_DIR=...trirlc` | 状态位已分离 |

**处置**：照「接令确认先做对象断言·错误框架经我确认=传染二传手」纪律**停手未动**（四步施工零执行·零 daemon 重启·零配置变更）——回询 COO。COO 21:06:08 三裁：①停手正形收记·任务书 §二系陈旧基线·勘误责任 COO 认领（基线核查缺口）②窗内改做验收面三件=准行（排程 owner 裁·零风险照 8713 首铸门禁同款）③DAEMON_NAME 硬编码改造挂账候批不入本窗。

**根因判读**：段2 restart 窗（10-17 12:55）8711 冷启时 job 已随 store 注册回活——任务书成稿早于段2 窗·§二对象断言未随段2 实况刷新=陈旧基线。（推断面：job created 时点与段2 restart 窗重合·复账可查段2 毕报。）

## §二 验收面三件读数（全绿·COO 准行口径）

### ① job 三查变体（F-3 家族性三查·8711 形）

| 查 | 读数 | 判 |
| --- | --- | --- |
| ①注册面 | cron_jobs 表 id=cron_mvbxayba_a4sa 在册（name=e1-window-reminder） | ✓ |
| ②next_run 值面 | 2026-10-19T13:10:00.000Z（+8=21:10·every 300s 自然节拍合理） | ✓ |
| ③enabled/state | enabled=1·state=idle | ✓ |
| 附 | run_count=419·error_count=0（32h 零错误） | ✓ |

### ② run 端点真链路触发实测（一次）

- 触发：`node D:/Code/ai/TriRLC/dist/cli.js cron run cron_mvbxayba_a4sa`（CLI 面免 token 值面触碰）
- 返回：`{"ok":true,"ran":true,"reason":"status=ok"}`——真链路执行成功
- 拍后对表：run_count 418→**419**·last_run=2026-10-19T13:07:26.335Z（+8=21:07:26）·status=ok·state=idle·next_run 未受扰动（13:10 自然节拍保持）
- execution_log 顶新增：id=867（'ok'·417ms·error=None）
- **空转零落卷契约验证**：当前拍（21:07）非提醒窗·W43 `window-reminders/` 无落卷目录——幂等空转零噪音✓

### ③ 既有 job 零差异断言（配置字段对表基线）

| 字段组 | 断言 | 判 |
| --- | --- | --- |
| 配置面：name/schedule_kind/schedule_value/schedule_tz/enabled/command/role_id | 与基线快照逐字段比对零差异 | **PASS** |
| 配置面：system_prompt | 前缀面未变（E1-5 8711 patrol job 契约文在位） | **PASS** |
| job 总数 | cron_jobs 1 行=基线 1 行（零新增零删除） | **PASS** |
| 运行态（预期内变化·除外项）：run_count/last_run_at/last_run_status/updated_at | ②实测所致·已分列注记非差异 | 预期内 |
| 运行态：next_run_at/state | 不变 | ✓ |

## §三 DAEMON_NAME 硬编码缺口（挂账候批·不入本窗）

- **缺口**：`scripts/ops-local/window-reminder-patrol.mjs` L17 `DAEMON_NAME='TriMLC@8713(win-m-cto-host)'` 硬编码——8711 拍时落卷/机位断言头将冒 8713 名义（空转故暂未显形）。
- **已就位面**：状态位无此患（8711 ps1 已设 TRILC_DATA_DIR=trirlc·状态文件已分离实勘✓）。
- **处置**：COO 裁挂账候 A2 改派稿连带批；per-daemon 化方案（参数化/env 感知·向后兼容 8713）**设计归 CTO 面**——候批期内本席出设计稿随 A2 改派稿上呈。

## §四 A1 清结态（预改写形·随 COO 174 笔落卷）

| daemon | 态 |
| --- | --- |
| 8713 TriMLC | 已现役（首铸窗在案） |
| 8711 TriRLC | 已现役（段2 restart 窗注册·本窗勘误+验收确认） |
| 8712 TriMMC（sg） | 真部署候排（A2 窗） |
| 8710 TriRMC（河源） | 真部署候排（A2 窗） |
| 脚本 per-daemon 化 | 挂账候批（A2 改派稿连带） |

## §五 门禁与合规注记

- 本窗零施工：零 ALLOWLIST 变更·零 daemon 重启·零配置写面——纯只读勘验+CLI run 触发（幂等 job 本职路径）。
- D-46 照守：探库只读模式（uri mode=ro）·token 值面零触碰零回显。
- 窗内值守知会（BOD 令）：8711 无重启故无拍报间隙——如实注：无间隙。

## §六 使用依据

- CEO 21:00:28 照准令（BOD 21:01 转派）·任务书 ad310812d（§二对象断言=被勘误面·§五护栏·§六验收门）
- COO 21:02 开工收记·21:06:08 窗内三裁（准行口径原文引用§一）
- 活体直读：`%LOCALAPPDATA%\trirlc\cron.db`（只读）·`trirlc-daemon.ps1` L10·`window-reminder-patrol.mjs` L14/L15/L17·TriRLC src/config/env.ts L155
- 纪律面：接令确认先做对象断言（三犯教训）·F-3 家族性三查·探库先对 DATA_DIR·D-46·D-47

—— CTO 小狄（落款 date 现查原值 2026-10-19 21:16:00 +0800·发毕对表）

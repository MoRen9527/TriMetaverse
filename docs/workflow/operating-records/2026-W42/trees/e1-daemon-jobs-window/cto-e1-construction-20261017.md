# CTO 施工卷 · E1-1/E1-3 段1 勘写（窗前备料态·生效候段2）· 2026-10-17

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/cto-e1-construction-20261017.md）
- syncMode: static（施工读数卷·生效面候 04:00± restart 窗——E1-6·毕报信链已走 COO/COS）
- lastSyncedAt: 2026-10-17T03:21:35+08:00（date 现查写前跑·D-47·03:25 手写预填已勘正为现查原值）
- 令源: charter-2026-W42-005 段1（CEO 02:36:49 三裁①·COO 02:40 charter）·BOD 03:07:25 裁定维持 04:00± 窗

## §一 E1-1 · 窗起提醒 job（8713 首铸·备料毕）

| 面 | 落点/读数 |
| --- | --- |
| 脚本 | `scripts/ops-local/window-reminder-patrol.mjs`（**3091eece0**·零依赖 .mjs·158 行） |
| 机制 | 读台账 front-matter windows（批后件③ schema 六字段轻解析·note 长行自然忽略）→窗起/窗毕 ±5min 容差判拍→落卷 `trees/window-reminders/`（§三模板）+幂等状态文件（DATA_DIR·7 天键保留） |
| 纪律对表 | 台账只读零回写（COO 唯一定笔位）·BJ 时区钉死（UTC+8 恒定）·空转零落卷·D-47 拍发落款=脚本内现查原值 |
| 测试缝 | `TRILC_WR_LEDGER_PATH/STATE_PATH/REPO` 三 env——拍发实测零污染真台账/真树 |
| 脚本层门禁四连 | ①空转=windows3 解析·fired0 零落卷 ✓ ②拍发=2 拍（start+end）·done 窗跳过 ✓ ③幂等=二跑 fired0 ✓ ④卷形态=§三 模板逐字段吻合 ✓（回滚门禁=daemon 侧 enabled=0 候窗验） |
| 测试插曲 | 首版落卷根未随测试缝——2 张 test 卷落真树即觉·真树清理+REPO env 缝补（本卷如实记） |
| ALLOWLIST 两笔 | 8713 cmd 第 17 条（`node …/window-reminder-patrol.mjs`·回滚=删一段）+8711 env 键 L13（回滚=删两行）——**生效面=各 daemon 冷启（HTTP 白名单 fail-closed·窗前 addJob 必 403）** |

## §二 E1-3 · b1 唤醒补报（TriMLC 代码面·备料毕）

| 面 | 落点/读数 |
| --- | --- |
| 改动 | `src/power-monitor.ts` tick() 头部冻结差值检测（**c8aebf3**·+20 行·常量 POWER_WAKE_GAP_MS=5min） |
| 机制 | tick 拍间差 >5min=系统级冻结（睡眠/休眠·interval 被冻结）恢复后首拍→补报 m-cos（dispatchNotify 现役链·失败计数族复用）——**一次/冻结段天然防重**（本拍尾 lastReadAt 更新即不再触发） |
| 误报形态（如实） | 检测链长冻结（read 连续失败段）恢复后首拍亦触发——文带分诊提示（冻结≠定谳睡眠·方案稿 b2 同款） |
| 门禁 | npm run check RC=0·build RC=0·power-gate 24/24 回归绿 |
| 设计取舍 | 冻结差值法替代方案稿原 eventlog 途径（Kernel-Power 566 解析）——语义等价且更根本（直接测冻结本身·零新依赖零权限面·挂现役 60s 循环）·方案稿原文勘注随本卷 |

## §三 E1-5 · 8711 段（授权前置毕·addJob 候独立窗）

- 勘实：8711 env（trirlc-daemon.env）**原无 ALLOWLIST 键**=空集 fail-closed（HTTP addJob 必 403）——非「追加」系「立键」（授权链=方案稿 §四 步2 明文·CEO 三裁①认方案）。
- 落笔：`TRILC_CRON_COMMAND_ALLOWLIST=node …/window-reminder-patrol.mjs`（L12-13·回滚=删两行）——生效面=8711 冷启。
- **8711 restart 窗不并今晚 8713 窗**（独立 daemon·一次一窗护栏不摊薄·COO 03:18 认）——addJob+三查+触发实测候独立窗（白名单①类·COO 窗位排程候办在记）。

## §四 E1-4 · b2 跨机料包（出卷毕·sg 值席施工位）

- e1b2-sg-mmc-heartbeat-watch-job-spec-20261017.md（**7bc56408b**）——job spec+判定模板+门禁五条+候勘四项（两挂点候 sg 活体勘钉·阈值 60min 候值首夜回填）·已转 COO 派 sg 值席。

## §五 段2 窗内清单（04:00±·候 COO 互证令）

restart 链（10-11 实操序：watchdog Disable→/shutdown→port FREE→schtasks 冷启→pid/CIM 对表→Enable）→完工锚五件（powercfg -ExpectPid 值面探针+channel.log engaged 行+uptime 重置+job 三查复验+engaged 断言）→E1-1 addJob+三查→触发实测（run 端点+幂等二拍）→03:38 巡杀轮读数顺收。回滚锚三层：TriMLC revert（4be06b3）/cmd 段删/env 键删——各自零门槛。

## 使用依据

- charter-2026-W42-005 拆树表·方案稿 window-reminder-job-plan-20261014.md（§四 步1/2 门禁原文）
- cto-lg088-mitigation-plan-a-b-20261017.md（件 a/b 落点表·kernel32 勘正随 18c4b587a）
- 脚本/单测门禁读数（本文 §一/§二 实录·03:0x-03:1x 现查）
- 8713 cmd/8711 env 现读（token 值面 D-46 脱敏·只动 ALLOWLIST 面）

—— CTO 小狄（落款 date 现查原值 2026-10-17 03:21:35 +0800·发毕对表）

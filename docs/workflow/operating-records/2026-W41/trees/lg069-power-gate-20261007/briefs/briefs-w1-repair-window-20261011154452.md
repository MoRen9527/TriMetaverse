# brief：FSD W1 补窗全窗（8711 修复+从闸合并窗）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-11T15:44:52Z（23:44:52+08·date 现查原值）
- 岗位: FSD 小全（m-fsd）；树: lg069-power-gate-20261007；协议: §4.2.3 FSD 模板
- 窗令: COO W1 窗令（14:23）→漏窗（14:27 候窗未设自唤醒锚）→BOD 补窗令（22:42 裁 a·即刻起·硬锚 00:10·附加条款三）

## 做了什么

五笔独立 commit 全落 TriRLC 仓（窗序件A→件C→件B→从闸+BOD 条款全兑现）：

| # | commit | 件 | 内容 |
| --- | --- | --- | --- |
| 0 | 5ce806e | 前置盘点 | 遗留笔续作认定锁笔（F-3 第一型 recompute 法 B·禁盲叠条款①） |
| 1 | 5874375 | 件A | crash handler（fc44904 同构）+7 例 |
| 2 | 6fbde65 | 件C | enabled ?? true 归一+类型面双改+2 例 |
| 3 | 130133a | 件B | race guardedJob 吸收（cc52c89 同构）+3 例 |
| 4 | 2e1e594 | 从闸 | power-follower 新模块+dispatch 谓词+healthz 四键+11 例 |

生效验证（BOD 条款③·重启窗完工判据值面探针）：watchdog Disable→POST /shutdown（token 门 401→trirlc-daemon.env 取 token 头一发过）→port FREE→ps1 注入 `TRILC_POWER_FOLLOW='1'`（PSParser OK·ASCII 纯）→schtasks 冷启→uptime 117849s→11s 重置→pid/CIM 对表（41596=node.exe dist/index.js）→**healthz.follower 四键齐：`{"state":"unknown","lastPollAt":"2026-10-11T15:02:13Z","lastGateSeen":null,"pollFailures":0}`**→watchdog 复原 Ready→crash.log 零基线。jobCount=0 零业务中断面。

## 为什么

- **读链定形**：TriRLC 无 TriMLC 的 shouldDispatchNewJobs（分叉早）——照 TriMLC 同构形补谓词透传链（timer deps→CronServiceDeps→app.ts 闭包），非自创接口。
- **staleness 传染口径**：8713 lastReadAt 投影明晨窗才落——未落窗期 lastReadAt 缺位→传染 unknown 放行态（稿 §五「裁不降级形」+COO 窗令「unknown 放行态上线」双源一致）——探针断言写 unknown 非 following，following 镜像终态候前置件落窗自动变活零返工。
- **生产留 ON 裁定**：窗令「上线」原文+回滚通道一行删（ps1 `TRILC_POWER_FOLLOW`）——bod-tick follow= 段今晚起从 absent 变 unknown=告警可见化提前生效（候批条③闭环面）。

## 遇到与解决

- shutdown 401（token 门）：未盲重试——env 文件键名面先行已勘（值面禁回显纪律），shell 读值进变量直入 header，一发过。
- `createMinimalCronEngine` tsc 报错：CronServiceDeps 未同步——透传链三文件同步改（timer/service/app），tsc 0 收口。
- 测试放行例走真 agent 链 3.4s：改 command job 截断（gate 放行后 executeCommand 立即回），11 例 1.3s 零模型调用。
- bash 嵌套 PowerShell 引号炸（pid/CIM 一刀）：换 PowerShell 工具直跑，对表 PASS。

## 代码变更摘要

- `src/power-follower.ts`（新建 260 行）：状态机纯函数（`transitionFollower`/`followerGateHard`/`followerHealthz`/`isStale` 导出供单测）+`startPowerFollower` poll 循环（AbortSignal.timeout 5s·gate 白名单防御·首拍即落定）+`unref` 常驻。
- `src/cron/timer.ts`：`CronTimerDeps.shouldDispatchNewJobs?`+executeJobCore 插点（shouldRunJob 后·command/agent 分支前）三行。
- `src/cron/service.ts`：`CronServiceDeps` 同名键+透传一行。
- `src/server/app.ts`：import+实例化（env 三枚门控）+deps 谓词注入+healthz `follower` 段+`stop()` 停链。
- `src/crash-handler.ts`（件A）+`index.ts` 挂接；`src/cron/store.ts`+`types.ts`（件C）；`timer.ts` race 修复（件B）。
- 启动链：`trirlc-daemon.ps1` 加 `$env:TRILC_POWER_FOLLOW='1'`（+2 行注释·ASCII 纯）。

## 遗留（§4.2.3 如实列）

- **staleness 活性验证候窗**：8713 lastReadAt 投影明晨落→follower.state 自动 unknown→following 镜像——活体锚①终态（following/hard 镜像）候下窗值面复验。
- **活体锚②③④候窗**：8713 闸置位→8711 dispatch skipped（reason=power_gate_hard）/8713 恢复自解/断 8713→holding 持有→×3 unknown——三者均需 8713 侧配合（今日 8713 禁触碰约束），候 CTO 排窗。状态机面已由 11 例纯函数单测覆盖。
- **catch-status fail 路径负向实测**：原 W1 窗并入项·BOD 补窗令未含·未做——候排（不擅扩窗）。
- **f612b9e 6 fail 注记面更正**：本窗实测 TriRLC 全量 495/495 零 fail——若该注记指 TriRLC 则与实测矛盾；注记笔在 TriMLC 仓 f612b9e（今日禁触碰仓），未动——候值席/CTO 勘定归属。
- **生产态运行观察项**：follower=unknown 放行态下 bod-tick 探针首拍（23:07/下整点）读数候收；告警行 `[trilc:follow] URGENT` 触发形=真实段退化才见（现零）。

## 使用依据

- CTO 稿 a00045f1（§2.2/§2.3/§四触面清单/§六门禁锚）·TriMLC 同构源 fc44904/cc52c89/baf800d（只读）
- COO W1 窗令（14:23）+BOD 补窗令（22:42·附加条款三）+BOD 知会（23:45·催毕报两线并行）
- 协议正身 V0.7 §4.2.3（brief 模板 FSD 差异化）/树协议 v3 §8.2（node-status.jsonl 载体）
- 实测读数：power-follower 11/11·全量 495/495 零 fail·tsc 0·healthz.follower 值面探针原值（上引）

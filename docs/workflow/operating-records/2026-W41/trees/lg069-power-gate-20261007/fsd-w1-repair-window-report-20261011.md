# FSD 毕报：W1 补窗（8711 修复+从闸合并窗）·READY_FOR_REVIEW

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-11T15:46:14Z（23:46:14+08·date 现查原值）
- 施工位: FSD 小全（m-fsd）；窗令链: COO W1（14:23）→漏窗认领→BOD 补窗令（22:42 裁 a）→BOD 知会（23:45 催毕报两线并行）
- 状态条: ①date 现查 2026-10-11T15:46:14Z ②水位=中 ③联审证据=本卷+node-status.jsonl 五行+briefs 全窗 brief ④末次活动=本卷落盘时点（15:46:14Z 现查）

## 大白话摘要（干了什么→结果→候什么）

干了什么：今晚把 8711 修复三件（崩溃保护/调度开关归一/超时竞争缺陷）加上二期从闸（8711 跟随 8713 主闸闸态）全部写完、测完，并按重启正形链重启 8711 验证了新代码真的在跑。
结果：五个提交全落仓，全量测试 495/495 全绿零失败，8711 已在新版本上运行，从闸四键观测面已变活（当前 state=unknown 放行态——这是设计内形态，8713 侧时间戳投影明晨落位后自动转正）。
候什么：①CTO 审查本窗五笔；②明晨 8713 部署窗落 lastReadAt 投影后从闸转 following 态；③三个活体终态验证（需 8713 侧配合）候窗排。

## 实现方案

照 CTO 稿 a00045f1 §四触面清单施工，窗序=件A→件C→件B→从闸+前置盘点先行（BOD 附加条款①）。关键路径与裁量：

1. **dispatch 谓词透传链**（TriRLC 无 TriMLC shouldDispatchNewJobs·分叉早）：照 TriMLC 同构形——`CronTimerDeps.shouldDispatchNewJobs?` → `CronServiceDeps` 同名透传 → app.ts 闭包注入。插点=shouldRunJob 之后 command/agent 分支之前（稿 §四.2 正则）。
2. **staleness 缺位传染**：lastReadAt==null/不可解析/超窗三态均判 stale→unknown——前置件未落窗期自动落 unknown 放行态（稿 §五 裁不降级形+COO 窗令预期形）。
3. **生产留 ON**：ps1 固化 `TRILC_POWER_FOLLOW='1'`（回滚=一行删/置 0）——「上线」原文+告警可见化（bod-tick follow 段 absent→unknown）今晚即生效。
4. **告警 v1 如实边界**（稿 §2.4）：本地日志 `[trilc:follow] URGENT` +healthz 可见化，零循环依赖；段首告一次（状态机 segmentAlerted 段语义）。

## 代码变更（五 commit·TriRLC 仓）

| commit | 件 | 触面 |
| --- | --- | --- |
| 5ce806e | 前置盘点（条款①） | 10-10 遗留笔续作认定锁笔：store recompute 法 B+app.ts 观测 log+7 例先行稿——未盲叠 |
| 5874375 | 件A | crash-handler.ts 新建（双 handler→crash.log JSON 行+exit(1)+TRILC_CRASH_LOG_ONLY 回滚）+index.ts 挂接+7 例 |
| 6fbde65 | 件C | store `?? true` 归一+types/timer 类型面双改（含 CronStoreLike 内联签名可选——交叉形坑避让）+2 例 |
| 130133a | 件B | guardedJob .catch 吸收滞后 rejection+3 例（process 层计数=0 核心断言） |
| 2e1e594 | 从闸 | power-follower.ts 新建（纯函数+poll+投影）+timer/service 谓词+app.ts 四触面+11 例 |

启动链：`trirlc-daemon.ps1` +3 行（TRILC_POWER_FOLLOW='1'+回滚注释·ASCII 纯·PSParser 过）。

## 自测结果

- **增量**：power-follower 11/11 绿（七形态+投影+isStale+dispatch 插点双例）·件A 7/7·件C 系 9/9·件B 3/3。
- **全量**：TriRLC `npx tsx --test test/*.test.ts` = **495/495 pass / 0 fail / 0 skip**（基线零回归）。
- **tsc --noEmit = 0**。
- **生效验证（条款③·值面探针非仅 commit）**：
  - 优雅停：POST /shutdown（token 门 401→env 取 token 头）→`{"ok":true}`→port FREE；
  - 冷启：schtasks TriRLC Daemon→uptime 117849s→11s 重置→pid/CIM 对表 41596=node.exe dist/index.js（新 dist）；
  - **值面探针**：`healthz.follower = {"state":"unknown","lastPollAt":"2026-10-11T15:02:13.071Z","lastGateSeen":null,"pollFailures":0}`——四键齐·unknown=8713 lastReadAt 未落窗期设计内放行态（pollFailures=0 证明 healthz 可达而投影缺位→staleness 传染机理与设计一致）；
  - watchdog 复原 Ready·crash.log 零基线（件A 健康面）·jobCount=0 零业务中断。

## 技术债务标记

1. **活体锚②③④未做**（8713 闸置位 skipped/恢复自解/断闸 holding→×3）——需 8713 侧配合，今日 8713 禁触碰约束在；状态机面已由纯函数单测覆盖，真实链路验证候 CTO 排窗。
2. **following 终态验证候窗**——8713 lastReadAt 投影明晨落位后复验 state=following 镜像（自动转正零返工设计）。
3. **catch-status fail 路径负向实测**——原 W1 并入项·补窗令未含·未做·候排（不擅扩窗）。
4. **f612b9e「6 fail」注记面归属待勘**——本窗 TriRLC 全量实测零 fail；注记笔在 TriMLC 仓（禁触碰仓）未动，候值席/CTO 勘定。
5. **follower=unknown 放行态观察窗**——真实退化段（8713 down）未发生过；`URGENT` 告警行与 holding→unknown 转移的实战表现=灰度观察项（bod-tick follow 段已可观测）。

## 使用依据

- CTO 稿 a00045f1（§2.2 轮询面/§2.3 状态机/§四 触面/§六 门禁锚）；TriMLC 同构源三 commit（只读）
- COO W1 窗令 14:23（窗序+unknown 放行态上线+8713 零触碰+§8.2 node-status）+BOD 补窗令 22:42（附加条款三）+BOD 知会 23:45
- 树协议 V0.7 §4.2.3（brief）+树协议 v3 §8.2（node-status.jsonl 载体）——五行已落同树
- 全窗 brief：`briefs/briefs-w1-repair-window-20261011154452.md`（§4.2.3 FSD 模板·遗留章节如实列）

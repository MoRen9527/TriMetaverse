# FSD LG-067 活性探针 healthz 升值面毕报（落码+单测·零部署）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-11T05:56:17Z（13:56:17+08·date 现查原值）
- 施工位: FSD 小全（m-fsd）
- 令源链: COO 13:34+08 窗毕拉单#1 排工令（LG-067 三组件之二·三字段 jobCount/degraded/next_run_at·今日只落码+单测禁重启窗）
- 交付锚: TriMLC 仓 commit f612b9e（dev 顶·3 files +88）
- 状态条: ①date 现查 2026-10-11T05:56:17Z ②水位=中（轻件已毕）③联审证据=本卷+f612b9e ④末次活动=本卷 lastSyncedAt

## 实现方案

healthz `.cron` 段现役已有 jobCount/degraded/consecutiveFailures 四键（app.ts L1739-1744）——升值面=补第三字段 **next_run_at**（最近未来拍点），探针据此判「调度活执行停」家族缺陷（拍点过期未滚=executor 停·healthz 假绿防御，2026-10-11 晨 8713 形 34h 僵活实证的对症硬门）。

- **service.ts**：`CronService` 接口加 `readonly nextRunAt: string | null`；实现走新导出纯函数 `computeNextRunAt(jobs)`——参与集合=enabled 且 nextRunAt 非空且可解析，取最早拍点（ISO 原值返回）；非法 ISO 静默排除（坏行不拖垮探针读数）；无→null。getter 与 jobCount 同构（store.listJobs() 同步），零 async 面。
- **app.ts**：healthz cron 段补一行 `next_run_at: cronEngine.nextRunAt`——字段名取 COO 令面字面（与 store sqlite 列名同形、探针消费契约对齐；面内其余键 camelCase，混形注释注明有意为之）。
- **纯函数导出**=白盒单测直喂 job 数组，零 stub（仓内无 service 级测试先例，此形态免建重 deps fixture）。

## 自测结果

| 项 | 读数 |
|---|---|
| 新单测（test/cron-healthz-nextrun.test.ts·6 用例：多 job 取最早/disabled 排除/空集 null/NULL 排除/非法 ISO 防御/混合现实形） | **6/6 绿** |
| 全量回归（npm test） | 674 测=基线 668+6 增量·668 pass·**6 fail 全既有**（下表） |
| tsc --noEmit 全仓 | exit 0（类型闭合·未产 dist=禁 build 合规） |

**6 既有 fail 逐族归因（stash 两轮对照独立验·禁转抄）**：基线全量（无我改动）同 6 fail 同名单——①REQ-018 daemon PID self-registration②integration/replay-flow③tui/components（此三族单文件跑亦 fail=稳定既有坏）④P0 通道一/二端到端全局门⑤⑥FADE-ASSESS-005×2（此三族单文件跑 pass·全量并发才 fail=既有环境型）。零新增 fail·与 cron/healthz 面无关，如实移交 CTO 门禁知悉（是否立修复单候 CTO 裁）。

## 技术债务标记

1. **dist 未重建未部署**（今日禁重启窗·COO 令）——11:51 CTO 勘修窗冷启的现役 dist 不含本字段；生效候 21:00 拍毕后小窗或明晨窗（候排）。部署时序=build+重启走 CTO 勘修窗同款正形（POST /shutdown→port FREE→/run+uptime 重置断言）。
2. **healthz 混形键名**（next_run_at vs 面内 camelCase）——有意为之（令面字面+store 列名同形）·候三组件之三探针实现时消费契约复核，若 CTO 判改 camelCase 是一行改动。
3. 6 既有 fail 见上表（非本单 scope·不越权修）。

## 并行合规

CTO 勘修窗三 commit（fc44904/cc52c89/baf800d）已收笔后本席开工；本单只动 src/cron/service.ts+src/server/app.ts（healthz 段）+新测试文件，src 面零重叠；未触 dist·未触 8713 进程（uptime 连续性=21:00 双语义验收基线保全）。

## CTO 门禁审结果（APPROVE·2026-10-11 14:05+08 审·本节 2026-10-11T06:08:13Z 补）

- **两裁决候审项裁下**：①healthz 键名 `next_run_at` **维持不换**（healthz 面 mc_link/mc_peer 蛇形先例+令面字面+store 列名同形三据；探针消费代码尚不存在=契约未冻结，现改名是最后廉价窗口但裁不改）；②纯函数导出形态 APPROVE（零 stub 白盒立先例·ReadonlyArray 最小面）。
- **注释勘已随落**：接口注释「最近未来拍点」→「最早拍点（含过期未触发值——正是本探针要抓的形态）」——实现语义=min(全部 enabled 非空可解析)含过期值，past-due 持续无执行增长=「调度活执行停」铁证（CTO 指出含过期值恰是探针最强信号）。TriMLC cb5dba8。
- **探针接线时序注**：此键随下个重启窗才活（dist 未构建）——探针消费面写码勿早于部署窗接线。

## 既有 6 fail 精确清单（STE 五族归因并批窗直取·2026-10-12 上午或 18:00 后窗）

| # | 测试文件 | 测试名 | 形态 |
|---|---|---|---|
| 1 | test/integration/pidfile-flow.test.ts | REQ-018 daemon PID self-registration | **CTO 窗基线绿/我窗红=差一例**·首嫌疑 11:51 重启关联环境耦合（pidfile 集成测试与活体 daemon/pidfile 环境耦合·两读数间恰有 CTO 勘修窗冷启）——**并入 STE 归因批窗复核·假设随卷移交** |
| 2 | test/integration/replay-flow.test.ts | 文件级 fail | 稳定坏（单文件亦红） |
| 3 | test/server/auth-gate-rejection.test.ts | P0 通道一/二端到端：createTriLCApp 真实 HTTP 全局门（rmc-TriLC.md P0-1 向量复现） | 环境型（单文件 pass·全量红） |
| 4 | test/server/roster-gating-http.test.ts | FADE-ASSESS-005 派工门禁 (tasks/submit ownerRoleId) | 环境型 |
| 5 | test/server/roster-gating-http.test.ts | FADE-ASSESS-005 可见性回归 (/agents contract 全量不改) | 环境型 |
| 6 | test/tui/components.test.ts | 文件级 fail | 稳定坏（单文件亦红） |

对表注：CTO 勘修窗 12:40 前基线=5（replay/auth-gate P0/roster×2/tui）——除 #1 外逐名对上；#1 差例处置=不扩今日 scope·并入 STE 并批窗（归因假设「重启关联环境耦合」随移交）。

## 使用依据

- COO 排工令 13:34+08（窗毕拉单#1）·需求池 DEM-003 v2 三组件清单（company-demand-pool.md L47）·CTO 三组件评估卷 5841c1fb
- 现役代码：TriMLC src/server/app.ts（healthz L1739-1744）·src/cron/service.ts（接口/getter/store 同步面）·测试式样 test/cron-store-nextrun.test.ts
- 纪律：全量读数回报（6 fail 逐族独立验）·stash 两轮对照禁转抄既有定性·写后即 commit 锁笔·禁 build/禁重启

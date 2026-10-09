# CTO 修复方案稿 · sgB TriMMC executor 停摆缺陷（立即修 2 项）

- sourceOfTruth: 本件（trees/sg-duty-trial-20261009/cto-sgb-fix-plan-20261009.md）
- syncMode: draft→final（候 BOD 认账后转 final·技术门判据随稿即裁面）
- lastSyncedAt: 2026-10-09T10:24:00+08:00（date 现查原值）
- 根因正身: 同目录 sgB-rootcause-report-20261009.md（m-duty-fsd 勘·BOD 认账）
- 窗位意向: 10-11 深夜窗族 **sg 段**（TriMMC 重启）·BOD 09:52 预排·正式排定走 COO 面

## 一、修复面定义（两锚互补·最小改动）

### 锚 1 · stale-runningAtMs 运行时守卫（executor tick 面）

- **位**：TriMMC 仓 agent-core `job-executor.ts:97` skip 门前置守卫。
- **逻辑**：tick 扫到 `job.state.runningAtMs !== null` 时，先判 stale——`now - runningAtMs > max(maxJobRuntime, job.timeoutMs) × 2` 即判 stale：清 runningAtMs（null·持久化）+warn 日志一行（job id/卡死时长/动作）→**清后本 tick 照常执行**（错过已 ≥2×timeout，不再加 cadence 延迟）。
- **语义**：补 service.ts:102「仅 start() 清」缺口=运行中卡死有运行时回收；正常跑（≤timeout 强制完成）永不触发（阈值 2×裕度防边界误杀）。

### 锚 2 · handler settle 完备性（异常路径兜底）

- **位**：`job-executor.ts` executeJob 完成路径（:159 清点）改 **try/finally 兜底**——finally 内若 runningAtMs 仍非 null（异常/spawn 同步 throw 路径漏清）→清+warn（幂等·正常完成路径零变化）。
- **配套**：`command-handler.ts` runWithTimeout 工厂同步 throw 形补 try/catch 转 reject（settle 完备）——精勘点在 FSD 实现时按现码形态落（报告列「spawn-settle 未做源码级 proof」·实现窗内先精勘后动手·精勘读数入毕报）。

**两锚关系**：锚 2=当场兜底（异常路径finally）；锚 1=兜底失效的最后防线（进程级/极端态·跨 tick 回收）。双层守卫·任一独立生效即防 66h 级停摆。

## 二、技术门判据（G1-G4·BOD 候裁面）

| 门 | 判据 | 验形 |
| --- | --- | --- |
| G1 | 单测新增 2 族全绿：①stale 回收族（构造 runningAtMs 超阈值 job+tick→断言清+执行+warn）②异常 settle 族（mock spawn 同步 throw→断言 finally 清+下 tick 可跑） | 测试读数贴毕报 |
| G2 | 既有全量测试无新增失败+build 零新增错误（sg TriMMC 既有 2 类型错零交集照旧如实归因） | 全量读数+错误族分布 grep |
| G3 | 重启三带全绿（BOD 08:15 同款）：jobs.json 备份（.manual-bak 现态参照）→jobs 存续值面验（10 job 无失）→executor 首轮滚动探痕迹 | 三带读数贴毕报 |
| G4 | 部署后 24h 观察窗：守卫 warn 零误杀（触发数=0 或触发皆附卡死实证）+无新停摆签名 | cron/logs warn 行巡检·10-12 收口 |

## 三、部署窗工序（10-11 深夜窗族 sg 段·值席施工）

1. **窗前（本席/FSD 面·窗前毕）**：改码+单测 G1/G2 绿→sg 仓分支 commit→毕报留痕。
2. **窗内（sg 值席）**：fetch 分支→build→G3 三带重启→healthz+首 tick 探→毕报。
3. **回滚姿态**：单仓单服务·`git revert` + build + restart 三步回滚链·回滚判据=G3 任一 fail 或窗内异常停报（不滑步）。
4. **观察**：G4 24h 窗·10-12 收口毕报。

## 四、排窗修/候批修裁量（本席意见·随稿呈）

| 项 | 裁量 |
| --- | --- |
| 排窗修 ①skip 埋点+停摆告警 | **认排窗**——本缺陷 66h 无告警暴露面的根治·并入 10-11 窗族同批改动可容（同文件族·增量小）；若窗容量紧则顺延不阻两锚 |
| 排窗修 ②空壳跑检出 | 认排窗·同上顺延规则（可观测化增量为辅·不阻主锚） |
| 候批 ①串行→并发化 | **维持候批·不入本窗**——单槽串行系停摆放大器属实，但并发化动 executor 核心语义（job 互作/资源竞争面），深夜窗不宜·本席立独立方案稿入技术债组合排程（LG-066 毕后评） |
| 候批 ②源内句形清理 | 随 LG-059 邻族候裁批照旧·不入本窗 |

## 使用依据

- sgB-rootcause-report-20261009.md（行级指针全引：job-executor.ts:97/:110-113/:131/:159·service.ts:102-107·cron-engine.ts:161·command-handler.ts:78/:136）
- BOD 09:52 认账信（窗位预排意向+候稿即裁）·BOD 09:38 转域件①
- BOD 08:15 令三带纪律（G3 同款）·8711 F-3 家族处置惯例（PATCH recompute 形旁证 API 正途）

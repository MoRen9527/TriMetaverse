# sgB 根因勘报告·TriMMC executor「调度活执行停」家族缺陷（只勘不修）

- 执行: m-duty-fsd（FD/sg 值席试水件二·SGB-1）；任务书=同目录 task-charter（BOD 10-09 01:03 批令）
- 勘面: /var/lib/trimc/cron/（jobs.json 现势+logs 18548 件全谱）/TriMMC src/cron 5 文件+agent-core scheduler 8 文件走读/10-01/10-02 实录对表
- 红线遵守: 只勘不修✓ 禁重启✓ 零 root 操作（全程 fleet 权限直读，无 chown 归还项）✓ 日志摘录全滤 `^command:^|^runAs:` ✓ token 值面零入卷 ✓

## 一、根因结论

**采样主案=job ae02593a「bod-progress-report」（30 分钟 cadence）**，停摆时间线全谱：

| 日 | 执行日志数 | 态 |
| --- | --- | --- |
| 09-30 | 17 | 上线首日（部分日） |
| 10-01 | 48 | 正常（30min×24h 满频） |
| 10-02 | **11** | 00:20→05:20 满频后**停**（末次=空壳跑：exit 0/无 stdout/无 stderr） |
| 10-03 | **0** | 停 |
| 10-04 | **0** | 停 |
| 10-05 | **44** | **02:15 复活**（首槽 02:15:21，非整点对齐=tick 重入时形） |
| 10-06→10-08 | 48/48/48 | 正常 |

**根因结论（证据最佳支撑形）**：401 池事件窗（10-01/10-02）内，该 job 的模型依赖链（daily-progress-watcher→TriModel 调用）与 executor 完成路径互作，致 **runningAtMs 置位后未清**（05:20 空壳跑的完成保存路径败/或 spawn error 未 settle 变体）——executor tick 的 `already-running` 过滤（job-executor.ts:97 `if (job.state.runningAtMs !== null) continue`）使**该 job 独享停摆**（他 job 无卡死照转=实录「调度面活着」观察本体）；**自愈=10-05 02:15 状态通路恢复后首 tick 重新入选**（伴随 TriModel 链复活窗：F-3 冷起 10-04/模型链恢复 10-05），非重启介入——与 service.ts:102 stale-run recovery「仅 start() 时清」设计互补：运行中卡死无运行时守卫=缺口本体。

**差异如实录**：任务书实录「nextRunAtMs 正常滚动」与本勘推定「该 job nextRunAtMs 冻结（rolling 仅完成路径写入，cron-engine 仅算初值不滚动=代码实锚 cron-engine.ts:161）」存在观察源解读差——当时观察者所见滚动值面或为他 job/或为 status 层推导值，候实录原始载体补勘对表。此差不动摇停摆机制主判（runningAtMs 卡死+already-running skip 两点均有代码与日志双证）。

## 二、证据链

### 2.1 代码位（行级指针）

| 位 | 机制 | 证据作用 |
| --- | --- | --- |
| agent-core job-executor.ts:97 | `if (job.state.runningAtMs !== null) continue` | **停摆执行门**：runningAtMs 卡死→该 job 每 tick 被跳 |
| job-executor.ts:110-113 | dueJobs **串行 await** executeJob | 单槽串行设计（非并行executor） |
| job-executor.ts:131 | mark `runningAtMs=startedAt`（先持久化） | 卡死态写入点 |
| job-executor.ts:159 | 完成时 `runningAtMs: null`（fresh store 回读后保存） | 清除唯二点之一——**保存败/异常路径无补偿即卡死** |
| TriMMC service.ts:102-107 | stale-run recovery **仅 start() 时**清 runningAtMs | 运行中卡死无守卫=缺口；daemon 重启=唯一内建清道（10-05 复活伴随态恢复的旁证通路） |
| TriMMC cron-engine.ts:161（agent-core） | cron-engine 仅算初值不滚动 nextRunAtMs | 滚动唯一写者=executor 完成路径（实录「滚动」源辨析见上） |
| TriMMC command-handler.ts:78/:136 | timeoutMs 强制（runWithTimeout settle 型）| handler 层有界——楔点排除项；spawn 同步 throw 路径的 settle 完备性=候精勘点 |

### 2.2 运行日志证据（全滤 token 行后取读）

- 10-02 末跑日志（05:20:07）：`job: bod-progress-report`／`timeoutMs: 600000`／`cwd: /srv/fleet`／stdout `(no stdout)`／stderr `(no stderr)`／`RESULT: exit code 0`——**401 窗内空壳跑**（协议成功/产出零=模型依赖降级形）
- 停摆窗零新增日志（10-02 午后至 10-05 02:15 前全空）=「执行期零日志」面
- 复活首日 10-05 02:15:21 起 44 档满频恢复=「过窗后恢复」面
- 对照组同窗健康：e7a37e66（353 档）/09112290（48 档）等他 job 全频照转=「调度面活着」观察本体

### 2.3 时间线对表

401 池事件窗（10-01/10-02，在案）→ 末跑 10-02 05:20 空壳 → 停摆 ≈66h → 10-05 02:15 复活（TriModel 链恢复窗后首 tick）。两形态（10-01/10-02 同签名）=同机制在不同 job/窗的复现：10-01 面（25541ebf 单档后离场件+55340a03 双频异常日）候补勘（本卷主勘 10-02 案，10-01 案机制同族置信）。

## 三、修复方案分级建议（不要求实施）

| 级 | 项 | 内容 |
| --- | --- | --- |
| **立即修** | runningAtMs 运行时守卫 | executor tick 内增 stale-runningAtMs 回收（如 runningAtMs 超 maxJobRuntime×N 即判 stale→清+warn），补 service.ts:102 仅-start-清的缺口 |
| **立即修** | handler settle 完备性 | runWithTimeout 补 spawn 同步 throw 的 settle 路径（防未 settle promise 楔串行环） |
| **排窗修** | executor 可观测性 | already-running skip 计数埋点（FADE-003 metrics 族）+停摆告警（job 连续 N tick 被跳即 NOTIFY）——本缺陷 66h 无告警的暴露面 |
| **排窗修** | 空壳跑检出 | exit 0+零输出+零产物形态的降级标记（401 窗类静默降级的可观测化） |
| **候批修** | 串行→并发化评估 | dueJobs 串行 await 的吞吐上限（多 job 同窗超时叠加放大停摆窗），候架构面裁 |
| **候批修** | 源内句形/binding 两代并存 | SDE :11 族（batch-14 观察注）同族清理，随 LG-059 邻族候裁批 |

## 四、试水自评（判断力型件如实项）

- 勘深止处：10-01 形态主案未展开（同族置信）；实录「滚动」观察源未回溯到原始载体；spawn-settle 完备性未做源码级 proof（列候精勘）
- 证据强项：停摆 job 全周时间线逐日谱+机制双点代码锚+401 窗对位+复活时形（02:15 非整点）互证

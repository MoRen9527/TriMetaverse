# S3 缺口4 窗前盘点 · 8711 DATA_DIR 双 store 并存面（CTO 批准先行·只读）

- sourceOfTruth: 本件（trees/s3-channel-maintenance-wave/sde-datadir-store-survey-20261008.md）
- syncMode: static
- lastSyncedAt: 2026-10-08T04:17:20Z（12:17:20+0800 周四，date 现查原值）
- 执行席: SDE 小布（m-sde）；令源=CTO 12:14 批准先行（判据卷 §缺口4 窗前只读盘点）；边界=sqlite 只读打开+禁启停 8711+禁任何写入迁移
- 判据锚: trees/s3-channel-maintenance-wave/cto-s3-criteria-20261008.md §缺口4

## 一、盘点读数（2026-10-08 12:14-12:17 +0800 窗内实勘）

### 1.1 双目录并存实锚（%LOCALAPPDATA% 下两套 db 全家俱在）

| 文件 | trilc\（代码默认） | trirlc\（ps1 链候选名） |
| --- | --- | --- |
| cron.db 主文件 | 24,576 B，mtime **Sep 28 00:59** | 61,440 B，mtime **Aug 29 14:00** |
| cron.db-wal | 20,632 B，mtime **Oct 7 16:55**（滚动中） | 4,124,152 B，mtime **Sep 3 10:41**（停写） |
| cron.db-shm | 32,768 B，Oct 6 19:04 | 32,768 B，Oct 5 19:50（勘验 touch 迹候选） |
| 目录内其余 | company/daemon/sessions/letters/event-queue 全套 | 同构全套+历史 s3-backup 系列 |

### 1.2 sqlite 只读值面（node:sqlite readOnly 打开，零写面）

| 值面 | trilc\cron.db | trirlc\cron.db |
| --- | --- | --- |
| cron_jobs 行数 | **0** | **0** |
| cron_jobs enabled/run_count | 全空（SUM=null/0） | 全空 |
| execution_log 行数 | **0**（cols=id,job_id,status,started_at,duration_ms,error_message） | **0**（同构） |
| 表清单 | cron_jobs,execution_log,sqlite_sequence | 同构 |

### 1.3 活体侧证（8711 healthz 只读 GET）

`{"ok":true,"service":"trilc",...,"cron":{"enabled":true,"jobCount":0,"degraded":false,...},"uptime":148287}`——**活体 jobCount=0 与 trilc\cron.db 只读读数对平**；trilc\ wal mtime 10-07 16:55 滚动=现役进程写面落位 trilc\ 实锚。

## 二、判读

1. **双 store 并存成立**（分裂风险实锚，判据卷 §1.3 预判证实）——trirlc\ 系历史残留（8 月末-9 月初活跃后 9-03 停写，4MB wal 系旧堆积）。
2. **零数据分叉**：两侧 cron_jobs/execution_log 全空——**归一无数据迁移需求**，纯配置面归一（判据卷「无分叉直接归一」分支命中）。
3. **现役权威 store=trilc\**（活体对平+wal 滚动双证）；方向 A（ps1 显式 TRILC_DATA_DIR=trirlc\）切换后旧 trilc\ 空库作废无数据损失，方向 B（删 ps1 设回默认）亦零数据代价——A/B 差口收敛为纯命名一致性，CTO 倾向 A 照旧候窗令。
4. 附带观察：trirlc\cron.db-shm mtime Oct 5 19:50 晚于其 wal（Sep 3）——只读打开 touch shm 迹候选（10-05 前后 korw 排查窗勘验在案），无数据面影响，如实录。

## 三、窗前清单② · 8711 现役 job 清单+nextRunAt 值面快照（COO 窗令清单项，12:22 补采）

- **job 清单=空集（0 job）**：trilc\cron.db cron_jobs 零行（§1.2）+8711 活体 healthz jobCount=0 双证（§1.3）
- healthz cron 段快照原样（12:15:40Z）：`{"enabled":true,"jobCount":0,"degraded":false,"consecutiveFailures":0}`
- **冷启后完整性对表锚**：10-10 窗内冷启后 jobCount 应保持 0+degraded=false（空集基线，无 job 丢失面——本波归一无 job 数据可失）
- 快照时点：2026-10-08T04:15:40Z（12:15:40+0800）；070 旧提醒链 job（cron_muxj3q29_2utj）已于 10-07 S0 拆除，现役零 job 态系预期

## 四、CTO 预核通过+窗内清理边界（12:21 预核信/12:27 边界信，卷面落定）

- CTO 独立抽验四点与卷面一致（非转抄）；窗内 DATA_DIR 段收窄=**纯 ps1 链配置归一+可选清理，零迁移零数据风险**（「有分叉先迁移」分支不触发）
- **清理边界（SDE 值面勘定）**：trirlc\ 非空壳——除 cron store 族外含 .env（5.4KB Aug 15）/keys.json+11 s3-backup/config-cache+5 s3-backup/company//daemon//letters+event-queue 全家；8713 channel TRILC_ENV_FILE 已值面核验**不指向 trirlc\**（布尔判定 False，值未回显）
- **窗内清理限定 cron store 族四件**（cron.db/-wal/-shm/cron.db.json）；.env/keys.json 系含密历史遗产，处置不属归一 scope，候专项裁量（删错零回滚面）

## 五、红线遵守

- 全程只读：ls/healthz GET/sqlite readOnly 三通道；零启动/重启 8711；零写入零迁移；token 值零触碰。

## 使用依据

- CTO 批准先行令（12:14，边界两条：只读纪律+读数报 CTO/COO，归一候窗令）
- 判据卷 cto-s3-criteria-20261008.md §缺口4/§1.3（DATA_DIR 解析序+盘点判据）
- 实勘读数：本卷 §一 原样

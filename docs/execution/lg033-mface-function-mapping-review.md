# M 面函数清单面归属对表评估（LG-033 watcher 实装位勘正 TriMLC 后）

- sourceOfTruth: TriMetaverse/docs/execution/lg033-mface-function-mapping-review.md
- syncMode: draft｜lastSyncedAt: 2026-09-08

## 对表原则

watcher 实装位勘正 TriMLC（提案件 §三之 5 裁定版）——M 面所需能力**照 TriMMC 移植先例走移植不走依赖**（TriRLC letters/ProcessSupervisor=R 面资产或 agent-core 参照件，M 面不依赖 TriRLC 仓）。逐件判三档：移植（TriRLC 件照 TriMMC 先例移）/新建（无参照件）/不需（TriMMC 在役或目标形态不含）。

## M 面函数清单逐件对表

| 函数/能力 | TriRLC 资产 | 判档 | M 面落法 |
| --- | --- | --- | --- |
| 文件监视（watcher） | 无（TriRLC 有 cron/session-reaper，无 inotify 模块） | **新建** | TriMLC 增 inotify/轮询 watch 模块（mtime+hash 双锚，LG-033 主审件方案） |
| 信件 API（letters/ledger 端点+ACL） | letter-store+endpoints+ACL 全套 | **移植** | 照 TriMMC 移植先例（ буква 全套源级移植） |
| ProcessSupervisor | agent-core run 型（参照件）+TriMMC 长驻扩展（b 窗 1 supervisor.ts 154 行） | **移植**（TriMMC b 窗 1 产物直接 M 面可用） | 长驻六态机+claude-runner 双件移 |
| 唤醒链（wake） | TriLCHeartbeatWake（250ms 合并+四级优先+action 抢占） | **移植** | 同先例 |
| cron | TriRMC/TriMMC 各自在役（河源 3 job/sg jobCount=3） | **不需** | TriMMC 在役 |
| session-reaper | TriRLC session-reaper | **移植** | 同先例 |
| 台账/额度接力 | TriModel relay.ts（f22990a） | **不需**（TriModel 层自持，M 面消费不经移植） | 消费端对接 |
| 安全边界（safety-check 路径边界） | e-fix 面（TriRMC 566 门） | **移植**（值班位 skip 档补偿件同源） | safety 层照移 |

## 汇总

移植 5 件（letters/Supervisor/wake/session-reaper/safety）+新建 1 件（文件监视）+不需 2 件（cron/台账层）——M 面函数清单对表毕，随批供排窗量化（移植 5 件≈2-3 窗 TriMMC 先例同款）。
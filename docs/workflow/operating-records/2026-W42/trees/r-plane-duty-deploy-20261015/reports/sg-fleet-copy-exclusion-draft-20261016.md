# SDE 预勘卷 · sg /srv/fleet/ 目录清单+rsync 排除表草案（COO 10:32:11 预勘任务·候 charter-002 定形）

- tree-id: —（charter 正卷树 reports/·原树续用）
- charter: charter-2026-W42-001
- syncMode: static（预勘草案卷·只读零写面 ✓）
- lastSyncedAt: 2026-10-16 10:36:00+08:00（date 现查原值随发）
- 执行席: SDE 小布（m-sde）

## sg /srv/fleet/ 全清单分级（10:34 只读勘验·33 项）

| 级 | 项（体积） | 性质 | 复制面 |
| --- | --- | --- | --- |
| 仓本体（要） | TriMetaverse 1008M·TriModel 124M·TriStaciss 116M·TriAvatar 97M·TriPilot 90M·TriRLC 89M·TriMLC 86M·TriMMC 84M·TriCompany 63M·TriCode 50M·TriRMC 2.6M·微仓 8 项（TriChain/TriDeployment/TriGateway/TriMEM/TriMobile/TriSkill/TriTest/TriTraining/TriWeb4 各 <1M） | git 仓/源 | **复制**（排除仓内 runtime 态） |
| 工具 | vscodium 40M·bin 32K | 工具 | 候 charter（R 面已有 node/python；vscodium 若 13 席不用可排） |
| runtime 活体态（排） | var/ 1.8M（bod-progress+hub-watch 账面）·TriMetaverse/.fade 96K（hub-snapshots）·各仓 node_modules/符号链接 | 活体态/可再生 | **排除** |
| 构建产物（排） | TriMetaverse/output/ **363M**（仓内最大头） | gitignore 可再生 | **排除** |
| 备份/隔离/历史（排） | TriLC.quarantine 84M·TriModel.quarantine 992K·backup 112K·backup-pre-reconcile 908K·incident-20260910 248K | 历史态 | **排除** |
| 一次性作业区（排） | lg058-upgrade 118M | 升级作业件 | **排除** |
| worktree/部署副本态（候裁） | TriRMC-s2-wt 72M·TriCompany-sgb-deploy 50M | 派生工作态 | 候 charter（R 面如需自建对应态非复制） |
| 河源自有 | dsh 519M 系**河源侧既有**（sg 面无此项）·TriModel.bak 63M 河源自有 | — | 无需复制 |

## rsync 排除表草案（候 charter-002 护栏定形）

```bash
--exclude 'var/'                     # runtime 账面（bod-progress/hub-watch）
--exclude '.fade/'                   # 中枢快照活体态
--exclude 'node_modules'             # 依赖可重建（含符号链接面）
--exclude 'output/'                  # 构建产物 363M 可再生（TriMetaverse 内）
--exclude '*quarantine*'             # 隔离区历史态
--exclude 'backup*'                  # 备份系
--exclude 'incident-*/'              # 事故存档
--exclude 'lg058-upgrade/'           # 一次性作业区 118M
# 候裁两项（charter 定）：
# TriRMC-s2-wt/          worktree 派生态
# TriCompany-sgb-deploy/ sg 专用部署副本
```

- 排除后净复制量估：1008-363-杂项 ≈ **~620M TriMetaverse+其余仓 ~570M ≈ 1.2G 级**（vs 全套 2.2G——省 ~45%）。
- 交接提示：dsh 519M 系河源自有（COO 信「sg 顶五仓含 dsh」与实勘差一——sg 面无 dsh 目录·如实记不纠偏）。

## 使用依据

- COO 10:32:11 收账信（预勘任务·排除项=runtime 态目录候 charter 定形）
- 活体读数：sg du -sh 全子目录+TriMetaverse 内层 du+var/dsh ls——2026-10-16 10:34 只读

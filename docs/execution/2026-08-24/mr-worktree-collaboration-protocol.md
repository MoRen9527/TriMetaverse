# M/R 面仓库协作协议（TriMetaverse 多实例拓扑）

版本：v2.0（2026-08-31：**单 dev 模型重构**——双分支模型退役，CEO 裁决采纳 LG-019 方案 X 两步式；v1.1 历史冻结留 git 档）
日期：2026-08-24（v1.0 立）/ 2026-08-27（v1.1 归属纠正）/ 2026-08-31（v2.0 单 dev 重构）
状态：当前工程规范

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/mr-worktree-collaboration-protocol.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 立法锚：LG-019（评估闭环 0f2418f6：底稿+双席意见书）+CEO 裁决（2026-08-31 01:0x，采方案 X 两步式）+树 lg019-retirement-v2

## 变更记录

- **v2.0（2026-08-31，单 dev 模型重构）**：① 双分支模型退役——project/trimetaverse 与 project/trimetaverse-staging 转历史锚（tc001-canonical 先例：保留不再演进），本地 WorkTree 移除；② R 面产出合同与生产实态对齐——`push origin dev`（rmc_tick 生产合同现行，v1.1 §四规则 1/§五步骤 4 与之矛盾的法条一并废止）；③ 本地 TriRLC worktree 形态改**懒建 clone**（触发器=首个本地 R 面能力立项过 §6.2 门禁，sg-bare 拉取对齐 heyuan 形态，C1-C6 参数随案）；④ 分叉预案入 §八（B1：push 被拒即停+升级 M 面）；⑤ §九清单重立基线；⑥ 时点现行化（迁移周日 23:00，heyuan 唯一执行点）。决策记录见树 lg019-retirement-v2。
- v1.1（2026-08-27）：R 面能力门禁（§6.2）生效——门禁通过前步骤 3/4 由 M 面执行。
- v1.0（2026-08-24）：初版双分支协作模型。

---

## 一、拓扑

```
sg-bare (sg-server /srv/git/TriMetaverse.git)   ← dev 唯一正源+post-receive hook（拓扑正身 repo-topology-20260831.md）
  ├─ 自动：sg 检出 /srv/fleet/TriMetaverse（TriMMC，hook 快通道+15min config-sync-apply）
  ├─ 自动：heyuan 检出 /srv/fleet/TriMetaverse（TriRMC+TriRLC-headless 共用 CWD；迁移/巡检/派工任务内 ff-only 拉取，常态手工）
  ├─ 回流：本地主仓 D:/Code/ai/TriMetaverse（TriMLC+董事会，周一回流+日常双推）
  └─ GitHub（无自动镜像；本地双推+补推，镜像/对账=LG-018）

本地 R 面 clone：懒建（触发器见 §五）——首个本地 R 面能力立项过 §6.2 门禁时自 sg-bare 拉取
  （origin=sg-bare 复用 ssh 别名与密钥、目录名不带空格如 D:/Code/ai/TriMetaverse-rmc、单分支 dev、
   不装构建依赖；勿从 GitHub clone——正源在 sg-bare 且 GitHub 通道间歇不稳）
```

**已退役**：本地 worktree `D:/Code/ai/TriMetaverse WorkTree`（2026-08-31 移除，project/trimetaverse 4e4fdc2c 留 GitHub 历史锚）；双分支模型（v1.1）整体废止。

## 二、分支模型（单 dev）

| 分支 | 用途 | 谁写 | 状态 |
| --- | --- | --- | --- |
| `dev` | 唯一演进主线（M 面+R 面产出经面路由门后同线） | M 面（人+CC 编排）+R 面执行体（face 门/合同约束，§五） | **active 唯一** |
| `project/trimetaverse` | 历史锚（4e4fdc2c，R 面双分支实验期存档） | 冻结 | **只读历史锚**（tc001-canonical 先例：保留不再演进） |
| `project/trimetaverse-staging` | — | — | **废止**（从未启用） |

分支退役先例：tc001-canonical（trilc-lineage-merge merge-log，60e9bdcd）——保留历史发布跟踪锚不再演进。

## 三、写入权矩阵（单 dev）

| 目录 | M 面 | R 面执行体（face 门内） | 说明 |
| --- | --- | --- | --- |
| docs/workflow/operating-records/ | ✅（周迁移/巡检/助理主叙事） | ✅ 仅限被拾取树的 `trees/{自己树ID}/` 子目录 | 其余只读（rmc_tick brief 铁律） |
| docs/execution/** | ✅ | ⚠️ 仅 trees/{自己树ID}/ 内 | |
| src/ / packages/ / scripts/ | ✅ | ❌（§6.2 门禁通过前） | 门禁通过后按 §6.2 解锁范围 |

## 四、周工作平面迁移协作

**原则**：迁移是**服务端单主体**操作，本地只消费结果。**现行唯一执行点=heyuan TriRMC cron**（job 9c81c7ec，2026-08-26 主责切换；W35→W36 首跑 PASS：f284c19b TriRMC-Scheduler 23:00:05 +0800）。

```
每周日 23:00 (Asia/Shanghai)   ← CEO 2026-08-30 定（23:59 历史时点冻结）
  heyuan weekly-plane-shift job：前置 TriMetaverse ff 拉取 → 五段链 --sync
    → commit（TriRMC-Scheduler）→ push sg-bare HEAD:dev
  23:08 巡检兜底（ok 解冻 sg watcher；error 修复+重跑）
周一早晨：本地主仓 fetch+merge sg-bare dev 回流（README active 周指针人工必查）

冻结窗口：周日 23:00–迁移验证通过，双方冻结 operating-records 写入
```

周一晨检断言（FADE-001 齿条③）：weekly-plane-shift lastRunStatus=ok 核验，非 ok 即迁移失败暴露口。

## 五、日常协作流程

### R 面任务执行（face 路由现行态）

- **面路由门（严格制）**：rmc_tick 只拾取显式 `face=r-face` 且 `domainRouting=server-executable` 的树；缺省树归 M 面（TriMMC/sg）。
- **门禁态（§6.2 通过前）**：步骤 3/4 由 M 面执行（CEO 2026-08-27 纠正条款继续有效）。
- **R 面产出合同（现行，与生产一致）**：R 面执行体在被拾取树范围内原子 commit + `push origin dev`（rmc_tick 生产合同；v1.1「R 面不直接 push dev/经 M 面合并」法条**废止**——双分支模型产物）；产出回流走 dev 单线（编排查核+顶层 done 惯例）。
- **漂移对齐纪律**：拉取一律 `git pull --ff-only`；派工前 pull 前置；派工留痕 HEAD sha（CTO-2 机器锚）；会话运行期禁 pull。
- **自动化 tripwire（三触发器任一命中即启动通道自动化评估）**：首棵 r-face 树挂载本地 / 30 天内 ≥2 次漂移致 push 拒绝 / LG-018 镜像通道落地。

### 分叉处置预案（§八强制行）

push 被拒（non-fast-forward）后 **ff-only 必失败且 agent 禁自救**（brief 禁 rebase/禁 force——禁得正确）：**即停+升级 M 面人工对账**（TriLC 28 commit 双线分叉人工合并先例）。禁止任何形态的 force/rebase 自愈。

## 六、五实例清单（现行值）

| 实例 | 工作检出 | 代码来源 | 执行引擎 | 推送到哪 |
| --- | --- | --- | --- | --- |
| TriMLC（本地 CC+董事会） | D:\Code\ai\TriMetaverse（dev 主仓） | sg-bare 回流 | claude code 宿主 | dev 双推（sg-bare+GitHub） |
| TriRLC（本地 daemon） | **无 TriMetaverse 检出**（CWD=C:\Users\jedih，TriLC 自身仓运行；懒建 clone 触发前不挂任何工作面） | — | agent-core 循环（现势零派工） | —（触发后：clone 内 push origin dev） |
| TriMMC（sg-server） | /srv/fleet/TriMetaverse | sg-bare 自动追 | claude code headless | sg-bare HEAD:dev |
| TriRMC（heyuan） | /srv/fleet/TriMetaverse | sg-bare（手工+任务内 ff-only 拉取） | 调度面+rmc_tick 派工 | sg-bare HEAD:dev |
| TriRLC（heyuan） | /srv/fleet/TriMetaverse（headless CWD） | 同上 | agent-core 循环 | dev（face 门+合同内） |

每实例独立 node_modules/构建产物/会话存储；代码经 git 从正源拉取保证一致。**同树单派工器原则**：树级互斥由锁/指纹承载（heyuan 本机文件），跨实例并发派工同树禁止（v2.0 预留法条，B5）。

### 6.2 R 面代码开发门禁（不变）

R 面（agent-core）通过 M 面能力对齐验收前不承担代码修改任务；门禁=CEO+CC 编排确认 agent-core 对齐 CC 核心能力（持续执行/上下文管理/工具可靠性）。

## 七、rebase / merge / PR

单 dev 模型下无双分支合并流；dev 内冲突按多 agent git 卫生纪律处理（统一 add+commit、共享 index 三查、D-05/D-10）。历史 rebase/PR 详解见 v1.1（git 档）。

## 八、异常处理

| 症状 | 处置 |
| --- | --- |
| push 被拒（non-fast-forward） | **即停+升级 M 面人工对账**；禁 force/rebase 自愈（分叉预案强制行） |
| ff-only pull 失败（diverged） | 同上，升级 M 面 |
| 检出滞后 | 常态手工 ff-only 拉取；任务内前置拉取兜底；tripwire 监控 |
| 懒建 clone 触发 | §一懒建参数执行+registry/daemon cmd 原子切换（C2 序）+冒烟 |

## 九、初始化/退役清单（v2.0 重立基线）

**已了结（v1.1 遗留清算）**：

- [x] WorkTree 存在且为合法 git worktree（→ 2026-08-31 移除退役）
- [x] WorkTree 追平 4e4fdc2c（退役时点与 origin 同步）
- [x] project/trimetaverse 分支推送远端备份（GitHub origin 4e4fdc2c 在册=历史锚达成）
- [x] TriRLC daemon cwd 现值实测（=C:\Users\jedih，从未指向 WorkTree——CPO 盲区条款闭环：退役对 daemon 零影响双证：schtasks WorkingDirectory 空+trilc-daemon.cmd cd 行）
- [x] heyuan 克隆与 sg-bare 同步确认（迁移 payload 前置 ff 拉取+tricompany-pull 先例；常态滞后由任务拉取收敛）

**懒建触发时执行（未触发不勾）**：

- [ ] 本地 R 面 clone 建立（§一参数）+ProjectRegistry/daemon cmd 原子切换+冒烟
- [ ] origin/sg-bare 同址冗余收敛（迁移 job payload remote 名统一后处置——LG-018 余项）
- [ ] GitHub dev tag 疑似项核验（WorkTree FETCH_HEAD 间接证据，退役清理顺带——留核）

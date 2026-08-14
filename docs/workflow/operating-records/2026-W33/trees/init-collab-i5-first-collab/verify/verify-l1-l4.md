# i5 verify：L1-L4 判定矩阵执行本（checklist 形态，非可执行程序）

> 树：init-collab-i5-first-collab（i5-2 小全准备，i5-3 小柯独立复采判定，i5-4 小狄终审）
> 依据：i5-1-20260814.md §一/§1.5 + i4-1-20260814.md §六（L1-L4 冻结契约）+ init-to-collab-design.md §7/§2.8
> 形态声明：命令清单 + 通过判据 + 证据留档位置。**不写可执行程序**——三端混合面（Windows 本地 + Linux 服务器 + HTTP 端点）程序化维护成本高于价值，且 I5 定位 = 执行/验收树非开发树。

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W33/trees/init-collab-i5-first-collab/verify/verify-l1-l4.md
- syncMode: source-only
- lastSyncedAt: 2026-08-14

## 0. 前置

| # | 前置项 | 检查命令 | 判据 |
| --- | --- | --- | --- |
| 0.1 | Phase D 已收口（i4-2 checkpoint 落盘，两仓 commit 齐） | 查 I4 tree-op.json | i4-2 status=done |
| 0.2 | CEO 机全链活体：chainState == ready | [HTTP] `curl -s http://127.0.0.1:8711/internal/v1/init/chain/status` | chainState=ready（SELFCHECK→…→CONFIRM 全过） |
| 0.3 | TriLC daemon 在跑 | [HTTP] `curl -s http://127.0.0.1:8711/healthz` | 200 |
| 0.4 | TRIMC_BASE_URL 指向服务器 TriMC；TRILC_DATA_DIR 显式隔离（活体实例） | 查 daemon env | 与 08-16 上午装后态一致 |
| 0.5 | 注册点已登记（I3 link 产物） | [本地] `Get-Content "$env:LOCALAPPDATA\trilc\project-registry.json"` | activeProjectKey/repoUrl/worktrees[] 非空 |

判定标注：**[本地]** = 本机执行（Windows，PowerShell/Git Bash）｜**[服务器]** = 编排层（小贾）ssh sg-ecs-server 执行｜**[HTTP]** = 端点调用。

证据落点：`verify/evidence/`（与执行本同树目录），命名 `<判定ID>.txt`；截图落 `verify/evidence/screenshots/`。

## 1. L1 注册同一性（协议层）

判定标准：三面 project key + repoUrl + worktree 路径短指纹（SHA-256 前 8 位）完全匹配；任一不匹配 = ERROR（错误仓/错误分支）。

| ID | 采集面 | 命令 | 通过判据 | 证据留档 |
| --- | --- | --- | --- | --- |
| L1-01 | 本地注册点 | [本地] `Get-Content "$env:LOCALAPPDATA\trilc\project-registry.json"` | 摘录 activeProjectKey/repoUrl/worktrees[] | evidence/L1-01-registry.txt |
| L1-02 | 本地 bundle project 维 | [本地] `Get-Content D:\Code\ai\TriMetaverse\docs\registry\init-sync\sync-config.json` | 摘录 project.projectKey/project.repoUrl/project.worktrees[]（路径短指纹） | evidence/L1-02-bundle-project.txt |
| L1-03 | TriMC status project 维 | [服务器] `ssh sg-ecs-server "curl -s http://127.0.0.1:8710/internal/v1/config/sync/status"` | 摘录 project 维（无 applied 或坏形状 = null 即 FAIL） | evidence/L1-03-trimc-status.txt |
| L1-04 | confirm/check l1 | [HTTP] `curl -s http://127.0.0.1:8711/internal/v1/init/confirm/check` | 摘录 l1.items | evidence/L1-04-check.txt |
| L1-05 | 判定 | 比对 L1-01/02/03/04 四摘录 | project key + repoUrl + worktree 路径短指纹三面完全匹配；任一不匹配 = ERROR | evidence/L1-05-verdict.txt |

短指纹复核（可选交叉验证，PowerShell）：`[System.BitConverter]::ToString([System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes("<worktreePath>"))).Replace("-","").ToLower().Substring(0,8)`

## 2. L2 版本一致性（协议层）

判定标准：本地 dev 主 checkout `git rev-parse HEAD` == bundle.project.devHead == status.fleetHead.commit。三值相等 PASS；不等 = 落后/领先诊断（ff 收敛提示）——**CONFIRM 时点判定**；迁移后「待回流」态见 §6（不是失败）。

| ID | 采集面 | 命令 | 通过判据 | 证据留档 |
| --- | --- | --- | --- | --- |
| L2-01 | 本地 HEAD | [本地] `git -C D:\Code\ai\TriMetaverse rev-parse HEAD` | 记录值 | evidence/L2-01-local-head.txt |
| L2-02 | bundle devHead | [本地] 同 L1-02 文件 project.devHead | 记录值 | 并入 evidence/L1-02 |
| L2-03 | fleet HEAD | [服务器] 同 L1-03 响应 fleetHead.commit | 记录值（fleetHead null = degraded 口径） | 并入 evidence/L1-03 |
| L2-04 | confirm/check l2 | [HTTP] 同 L1-04 响应 l2（localHead/bundleHead/fleetHead） | 记录值 | 并入 evidence/L1-04 |
| L2-05 | 项目 worktree HEAD（如有） | [本地] `git -C <worktreePath> rev-parse HEAD` | 与注册点 worktrees 对应分支一致（I3 link 口径） | evidence/L2-05-worktree-head.txt |
| L2-06 | 判定 | 比对 L2-01~04 | 三值相等 PASS；不等 = 落后/领先诊断，ff 收敛提示 | evidence/L2-06-verdict.txt |

## 3. L3 写读闭环（协议层）

判定标准：status.applied.bundleId == 本地 bundle 文件 bundleId。相等 = 正向链路实证（sync commit 即探针）；未 applied = 「未就绪」+ 重试（§6.8 前提）。

| ID | 采集面 | 命令 | 通过判据 | 证据留档 |
| --- | --- | --- | --- | --- |
| L3-01 | 本地 bundleId | [本地] 同 L1-02 文件 bundleId | 记录值 | 并入 evidence/L1-02 |
| L3-02 | 服务器 applied | [服务器] 同 L1-03 响应 applied.bundleId | 记录值（applied null = 未就绪） | 并入 evidence/L1-03 |
| L3-03 | confirm/check l3 | [HTTP] 同 L1-04 响应 l3（appliedBundleId/localBundleId） | 记录值 | 并入 evidence/L1-04 |
| L3-04 | 判定 | 比对 L3-01~03 | applied.bundleId == 本地 bundleId PASS；未 applied = 未就绪 + 重试 | evidence/L3-04-verdict.txt |

## 4. L4 反向闭环（协议层）

判定标准：由首个协同工作承载。Phase D 口径：check 响应 l4 = `{ status: "pending", note: "由首个协同工作承载" }`。

| ID | 采集面 | 命令 | 通过判据 | 证据留档 |
| --- | --- | --- | --- | --- |
| L4-01 | confirm/check l4 | [HTTP] 同 L1-04 响应 l4 | 返回 pending + 注记（Phase D 口径核对） | 并入 evidence/L1-04 |
| L4-02 | 实际 L4 判定 | 迁移 commit 三面可见 | **转 verify-trigger-20260816.md §2.2**（首个协同工作判定） | evidence/20260816/（触发验收留档） |

## 5. 呈现层验收（确认卡三态，两入口）

入口 = TriPilot 面板 + trilc chat。每项截图留档 `evidence/screenshots/`。

| ID | 验收项 | 执行 | 通过判据 |
| --- | --- | --- | --- |
| P-01 | 三元素同显 | 两入口各打开确认卡 | 各显示 repoUrl / project key / worktree 路径短指纹，与 check 响应 l1.items 一致 |
| P-02 | 短指纹防截断 | 比对呈现内容 | 路径呈现 = 8 位 SHA-256 指纹（computePathFingerprint），非全路径（§7.2） |
| P-03 | HEAD 一致性徽标 | 两入口观察 L2 渲染 | 绿一致 / 红差异（L2 结果渲染） |
| P-04 | 红差异注入测试 | [本地] ①备份注册点 ②改 worktree 路径（人为不一致）③重查 check ④观察两入口 | 红色差异提示列出（哪端/什么元素/期望值 vs 实际值）+ 诊断入口可达（重新登记 = I3 link 流程 / 重新同步 = sync/run）⑤恢复注册点并 diff 校验还原零差异 |
| P-05 | 未就绪态 | 隔离实例（TRILC_DATA_DIR 隔离 + TRIMC_BASE_URL 指向不可达 → remote null + degraded → readyForConfirm=false） | 两入口确认卡「未就绪」+ 先同步提示（§6.8）；参照 i4-3 隔离实例流程，证据 = check 响应 + 呈现截图 |

P-04 纪律：注入前备份 `project-registry.json`，测试后还原并 `diff` 零差异——注册点变更不得残留（门禁 5）。

## 6. 迁移后 L2 收敛步骤（协同稳态证明，§1.3 新增）

周日 23:00 迁移 commit 后 fleet HEAD 前移，本地未 pull 前 L2 三值不等——**不是失败，是「迁移 commit 待回流」态**。首个协同工作验收含收敛链：

| 步 | 动作 | 命令 | 通过判据 | 证据留档 |
| --- | --- | --- | --- | --- |
| R-01 | 迁移 commit 到裸仓 → fleet HEAD 前移（job 内自动） | [服务器] `ssh sg-ecs-server "git -C /srv/fleet/TriMetaverse rev-parse HEAD"` 比对触发前当场记录值 | fleet HEAD 前移到迁移 commit | evidence/20260816/fleet-head-after.txt |
| R-02 | 编排层本地 pull | [本地·编排层] `git -C D:\Code\ai\TriMetaverse pull sg-server dev` | 本地 HEAD 前移 → W34 产物可见（**L4 核心判定**） | evidence/20260816/local-pull.txt |
| R-03 | 建议 re-sync | [HTTP] `curl -s -X POST http://127.0.0.1:8711/internal/v1/init/sync/run -H "Content-Type: application/json" -d '{"entry":"i5-acceptance"}'` | 幂等重跑（§6.6「变更触发重新生成」语义内）→ bundle.devHead 更新 + push | evidence/20260816/resync.txt |
| R-04 | 三值再收敛 | [HTTP] 重查 confirm/check + [服务器] TriMC status | L2 三值重新收敛 + L3 applied 新 bundleId——三端在迁移后依然操作同一项目 | evidence/20260816/reconverge.txt |

## 7. 失败处理

- 任一判定行 FAIL → 该行证据留档 + 记录差异明细 → 不修改任何状态 → 报编排层按 runbook §5 三路径回退恢复表处置（迁移域回退 / 补采重判）。
- 本地 L1-L4 判定失败**不阻塞**周日 23:00 自然触发（迁移不依赖初始化，§8.2）。
- firstCollab 推进纪律：FAIL 时 firstCollab 不写 passed（pending→triggered→passed 合法转移，重放幂等——verify-trigger §3）。

## 8. 证据留档位置总表

| 域 | 位置 |
| --- | --- |
| 判定证据 | `verify/evidence/`（L 系/P 系/R 系 .txt） |
| 截图 | `verify/evidence/screenshots/` |
| 周日触发验收证据 | `verify/evidence/20260816/` |
| 执行记录 | 本执行本各表格行直接填写（判定人/复采人/结论/时间） |

执行分工：服务器侧证据采集 = 编排层（小贾）；本地侧命令清单 = 小全（本文件）；独立复采与判定 = 小柯（i5-3，每行复采后在表格行标注）；终审 = 小狄（i5-4）。

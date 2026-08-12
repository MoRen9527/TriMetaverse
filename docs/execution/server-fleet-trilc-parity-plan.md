# TriMC 部署服务器 + TriLC 追平能力计划

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/server-fleet-trilc-parity-plan.md
- syncMode: source-only
- lastSyncedAt: 2026-08-13

> 版本：v2026.W33.1
> 日期：2026-08-13
> 状态：正式版（CEO 审批签发）
> 适用范围：TriMC 服务器舰队 + TriLC 渐进追赶全链路（M0-M4）
> owner：小贾（CEOChiefOfStaff）
> 关联：TriCompany/docs/engineering/trilc-trimc-runtime-parity.md V1.1（架构决策源头）；docs/workflow/operating-records/2026-W33/project-ai-community-weekly-2026-W33.md 决策登记段（部署形态 + 里程碑定案）

## 一、计划缘起与谱系

本计划是 TriCompany「赛博公司运行面」的两条演进线汇合：

| 时间 | 事件 | 文档 |
| --- | --- | --- |
| 2026-08-07 | CPO/CTO 完成 TriLC/TriMC 共享 runtime parity 架构决策：共享 agent-core + 双域 adapter + 写权威合同 + parity gate | TriCompany/docs/engineering/trilc-trimc-runtime-parity.md V1.1 |
| 2026-08-11 | CEO 定案部署形态：WSL 路线归档，采用服务器舰队方案（服务器官方 claude + TriMC 编排）；TriLC 本地域渐进追赶 | W33 周记决策登记段 |
| 2026-08-11 | 里程碑门禁 M0-M4 成型：环境 → 试点 → 能力验证 → 独立资格 → 源码替换 | W33 周记决策登记段 |
| 2026-08-11 → | M0 执行（12/12 完成）→ M1 试点（阶段一+二完成）→ M2 能力验证（R1-R8 进行中） | server-fleet-m0.md + trilc-capability-checklist.md |

与 v0.9.x 双轨计划的并行关系：`docs/execution/v0.9.x-dual-track-tricompany-plan.md` 是安装版双轨互促 + TriCompany 独立化方案（v3，2026-08-04），无 M0-M4/服务器舰队引用——本计划是其延伸线之一，两计划并行不重复。

## 二、M0-M4 里程碑结构

| 里程碑 | 定义 | 状态 | 证据指针 |
| --- | --- | --- | --- |
| M0 环境 | 服务器裸仓 + 舰队工作克隆 + git 同步链路打通 | **done** | server-fleet-m0.md 12/12（2026-08-11） |
| M1 试点 | 服务器舰队跑通 task tree/周会自由对话；TriMC 编排 MVP 连通官方会话 | **done** | 周记 M1 段：阶段一（部署 + 对话实测）+ 阶段二（session-bridge + 3 端点 + dispatchAsync + task-controller 回写，MVP 门禁 5/5） |
| M2 能力验证期 | TriLC 在 TriMC 监督下按 checklist 逐项覆盖（真实研发任务驱动，不设固定时长） | **in_progress** | trilc-capability-checklist.md v2026.W33.11（12/33 项通过，详见 §三） |
| M3 独立资格 + 生产双跑 | 能力清单全勾 + 舰队审核通过 → 生产仓 TriLC + TriMC 互为 fallback | pending | — |
| M4 源码替换 | 自研跨会话层 + 功能覆盖验收 → 源码替换官方 claude | pending | — |

## 三、M2 子阶段（R1-R8 轮次登记）

| 轮次 | 内容 | 树 | 清单版本 | 状态 |
| --- | --- | --- | --- | --- |
| M2-R1 | C12/C13 模型路由与降级 | — | v2026.W33.3 | done |
| M2-R2 | C8/C9 权限模式 + 权限规则 | — | v2026.W33.4 | done |
| M2-R3 | C10 MCP server 接入 | — | v2026.W33.6 | done |
| M2-R4 | C1 会话 resume + C15 手动 compact | — | v2026.W33.7 | done |
| M2-R5 | C15v2 自动 compact + 2.4 超时 + 2.5 degraded | — | v2026.W33.8 | done |
| M2-R6 | 2.1/2.2 任务闭环跨域端到端 | — | v2026.W33.9 | done |
| M2-R7 | 3.1/3.2 工程门禁 | r7-eng-gate | v2026.W33.10 | done |
| M2-R8 | 1.1-1.5 基础执行域 | r8-base-exec | v2026.W33.11 | done |

注：R1-R6 无树承载（树协议 V0.6 自 R7 起生效）；R7/R8 起每轮以树承载并出 brief。

## 四、当前状态汇总

- M0：12/12 完成（服务器环境就绪）
- M1：阶段一+二完成（舰队对话 + 编排 MVP）
- M2：8 轮 done，12/33 能力项通过；剩余 21 项（3.3/3.4 + 4.x 跨模块域 + 5.x 生产链域 + 6.x 运营纪律域 + C2-C7/C11/C14/C16/C17 对标层）
- M3/M4：待 M2 全勾后启动

## 五、维护规则

- 更新人：CEOChiefOfStaff（M2 每轮收口后更新 §三/§四）
- 里程碑状态变更需 CEO 确认
- 本计划为计划级登记；各里程碑的执行清单/验证清单保持独立文档（server-fleet-m0.md / trilc-capability-checklist.md），本文件只做状态投影

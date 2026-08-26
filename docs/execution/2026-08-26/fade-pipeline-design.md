# FADE 标准执行管线设计 v1.0

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-26/fade-pipeline-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-26
- 文档版本: v1.0（CEO 需求："我们需要一个 fade 式的标准执行，自动可靠的跑这个流程"）

## 一、FADE 是什么

本地定计划 → 自动挂平面 → 服务端自动检测派工 → 自治执行 → 本地监控到收口的**全自动标准执行管线**。四个字母对应四步：

| 步 | 名 | 执行位 | 动作 |
| --- | --- | --- | --- |
| **F** | Forge 铸计划 | 本地 | CEO + 本地小贾定计划，落 `docs/execution/YYYY-MM-DD/<plan>-plan.md`；拆节点成树 `trees/<tree-id>/tree-op.json`（status=active、domainRouting=server-executable、每节点 agent+action） |
| **A** | Attach 挂平面 | 本地 | commit → push `sg-server/dev`（GitHub origin 同步镜像） |
| **D** | Detect 侦测派工 | sg-server | 快通道：sg-bare `post-receive` hook → fleet 工作树 pull → 立即跑 `orchestrate_tick`（异步）；慢通道兜底：既有 30 分钟 cron tick（13,43 分） |
| **E** | Execute & Echo 执行回声 | sg-server + 本地 | CC 编排会话按树执行（节点派工 fresh 子实例、先写后报、原子即提交、收口置 done）；本地 `fade-watch.ps1` 轮询 sg-bare 树状态，变化即报，done/blocked 终报 CEO |

## 二、触发拓扑

```
本地 TriMLC (小贾+CEO 定计划)
  │ F: plan.md + tree-op.json
  │ A: git push sg-server/dev  (镜像: push origin/dev → GitHub)
  ▼
sg-bare /srv/git/TriMetaverse.git
  │ post-receive hook (dev 分支更新)
  │   ├─ runuser fleet: /srv/fleet/TriMetaverse git pull --rebase
  │   └─ runuser fleet: nohup orchestrate_tick (异步，不阻塞 push)
  ▼
TriMMC (sg-server)
  │ D: 三重门评估 (status=active + server-executable + pending 无时间门)
  │    + 活动锁护栏 + 指纹边沿 + 预算双门 (15亿 token/日 + 1000元/月)
  │    + spawn CC 会话 (fleet HOME, GLM glm-5.3)
  ▼
CC 编排会话 (E)
  │ 按树执行: 节点 fresh 子实例 / 先写后报 / 原子即提交 / 收口 status=done
  │ push origin dev → sg-bare
  ▼
本地 fade-watch.ps1 (E 的回声侧)
  │ 轮询 sg-server/dev 树状态 (默认 60s)
  │ 变化→控制台+状态文件；done/blocked→终态退出；超时→超时报告
  ▼
CEO 收终报
```

## 三、组件清单

| 组件 | 位置 | 状态 | 说明 |
| --- | --- | --- | --- |
| 计划/树格式 | docs/execution/ + operating-records/trees/ | 既有 | tree-op.json 规范不变 |
| post-receive hook | /srv/git/TriMetaverse.git/hooks/post-receive | 本版新增 | dev 更新→pull+tick；flock 防并发；非 root 推送者直跑 |
| orchestrate_tick | TriCompany/runtime/cognition/ | 已修复 | time 导入 + 活动锁护栏（57 连败风暴根因修复，2026-08-26） |
| 30min cron tick | trimc cron orchestrate-tick | 既有 | 慢通道兜底；hook 失效时最迟 30 分钟接续 |
| fade-watch.ps1 | TriMetaverse/scripts/fade/fade-watch.ps1 | 本版新增 | 本地监控；-Once 单查模式可挂 trilc cron |
| 模型配置 | GLM glm-5.3 (bigmodel.cn) | 已切换 | 三端已部署并验证（sg CC 链路 + heyuan TriRLC 链路） |

## 四、可靠性设计

1. **双通道检测**：hook 快通道（秒级）+ cron 慢通道（30 分钟）互为备份；tick 内部活动锁护栏保证同一时刻单会话，双通道同时触发也只会 spawn 一次。
2. **push 不阻塞**：hook 内 tick 以 nohup 异步发射，push 延迟 <2s；hook 任何失败不影响 push 本身（git 层与触发层解耦）。
3. **进度不丢**：编排会话铁律"先写后报+原子即提交"，会话被回收只认已 commit 的进度；树文件是唯一状态真源。
4. **断点续执**：树节点 status 即断点；新 tick 只派 pending 节点（禁复用纪律）。
5. **预算硬门**：15 亿 token/日 + 1000 元/月双门，超限自动降级（仅影子+人工触发）。

## 五、边界与不做项（v1）

- v1 只触发 **M 面**（sg-server TriMMC）。R 面（heyuan TriRMC）仅承接周平面迁移生产任务，暂不接 FADE 触发。
- 本地监控 v1 为脚本形态（控制台+状态文件）；trilc push 通知受 NAT 方向限制（Q-F，服务器无法主动连本地），本地轮询方向天然绕开。
- 不改 trimc 服务面（零服务端点新增，hook 直接调 tick 进程，规避生产服务变更风险）。

## 六、验收标准（AC）

- AC-1：本地 push 含新树的 commit 后 ≤2 分钟，sg 侧 tick 被钩子触发（shadow-plane 有 hook tick 日志证据）。
- AC-2：CC 编排会话（GLM）spawn 并按树执行至收口，树顶层 status=done，收口 commit 已 push。
- AC-3：本地 fade-watch 全程捕获状态变化，done 后 ≤1 个轮询周期内终报。
- AC-4：慢通道兜底有效——hook 停用时，30 分钟 cron 仍能推进同一棵树。

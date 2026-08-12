# Trees 执行协议（Trees Execution Protocol）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/trees-execution-protocol.md
- syncMode: source-only
- lastSyncedAt: 2026-08-12

> 版本：v2026.W33.1
> 日期：2026-08-12
> 状态：正式版（CEO 确认签发）
> 适用范围：TriCompany 任务执行——M2 验证轮次起所有节点化工作流
> owner：小贾（CEOChiefOfStaff，根节点）/ 各节点执行 agent
> 关联：`docs/execution/trilc-capability-checklist.md` §五（收口门禁 + 树执行协议规则）；`docs/workflow/operating-records/2026-W33/trees/w33-weekly-migration-ade/tree-op.json`（协议前身实例）

## 一、背景与目标

Trees 从"记录型"升级为"执行型"协议：以 tree-op.json 为唯一事实源，git commit 为交接信号，节点 checkpoint 为存档点。与 ADE（Agent plans → Deterministic CLI executes → Agent closes）组合，解决三类问题：

1. **完成信号不可靠**（agent 消息通知系统性缺失）——改为 git 硬证据；
2. **多 agent 交接无结构**——节点链 + 路由任务显式传递；
3. **故障不可恢复**——存档读档式断点续跑。

## 二、tree-op.json Schema

```jsonc
{
  "treeId": "r7-task-loop",              // 树标识（恢复定位用）
  "title": "任务闭环验证",
  "source": "M2-R7",
  "week": "2026-W33",
  "status": "active",                    // active | done | failed
  "verdict": "",                         // 树完成时的判定
  "completedAt": "",
  "nodes": [
    {
      "nodeId": "r7-0",                  // 节点标识（存档点）
      "agent": "CEOChiefOfStaff",        // 执行 agent
      "status": "done",                  // pending → running → done | failed
      "action": "建树：动态规划节点链与交接顺序",
      "routedInput": "",                 // ★ 前节点 checkpoint 引用（首节点为空）
      "checkpoint": {                    // ★ 存档读档核心
        "progress": "节点已完成部分描述",
        "artifactCommit": "abc1234",     // 产物 git 证据
        "resumePoint": "断点位置描述"     // 崩溃后续跑起点
      }
    }
  ]
}
```

### 字段规则

| 字段 | 规则 |
| --- | --- |
| `status` | 状态机：`pending → running → done | failed`；禁止跳变（running 前必须 pending） |
| `routedInput` | 引用前节点 `nodeId`（如 `"r7-1:checkpoint"`）——交接输入，开工前必读 |
| `checkpoint.progress` | 每次状态变更同步更新（存档即提交） |
| `checkpoint.artifactCommit` | 产物必须有 git 证据；无产物节点可留空但需说明 |
| `checkpoint.resumePoint` | 节点内可续跑的位置描述——幂等续跑的依据 |

## 三、执行流程

```
① 建树（根节点小贾）：动态规划节点链 + 交接顺序 → 写 tree-op.json → commit
     —— commit 即开工信号（git 触发）
② 节点开工：读前一节点 checkpoint（routedInput）→ 自身 status: running → commit
③ 节点执行：完成任务 → 更新 status: done + checkpoint → commit
     —— commit 即交接信号（git 触发）
④ 下一节点重复 ②③
⑤ 树完成：全部 done → 根节点写 verdict + status: done → commit
```

## 四、多树并行

- 每树独立 `treeId` + 独立 tree-op.json（`trees/<treeId>/tree-op.json`）；
- 根节点（小贾）统一资源调度：多树并行时不重复分配同一 agent 到冲突节点；
- 树间无共享可变状态（共享只读资产如清单文档可并发读）。

## 五、故障恢复（存档读档）

```
崩溃发生（进程/会话/网络中断）
  → 按 treeId 找到 tree-op.json（git 永不丢）
  → 扫描 nodes：第一个 status=running 的节点 = 崩溃节点
  → 读该节点 checkpoint（progress / artifactCommit / resumePoint）
  → 从 resumePoint 幂等续跑（已存档进度不重做）
  → 更新 checkpoint → 交下一节点
```

**幂等要求**：节点执行必须可重入——已完成的子步骤可跳过或覆盖，禁止"重跑产生重复副作用"（重复 commit 用 amend/force-push 禁止，用新 commit + 说明）。

**失败处理**：节点 `failed` 时，根节点裁决：修后重跑（保留 checkpoint）或改路由（换节点/换 agent）。

## 六、与 ADE / 交付板 / TriMC 的接口

| 层 | 机制 |
| --- | --- |
| 交付板 | 节点状态 commit = 交付板信号（收口门禁 v2 的正式形态） |
| ADE | Agent plans（建树/规划）→ Deterministic CLI executes（节点执行）+ Agent closes（判定收口） |
| TriMC（中期） | cron/dispatch 直接读 tree-op.json 驱动节点调度；git 事件 = 节点变更触发 |
| 崩溃检测（中期） | 心跳/超时（TriLC 心跳机制复用）→ 标记 running 节点为可疑 → 恢复流程 |

## 七、维护规则

- 更新人：各节点执行 agent（自己节点的状态 + checkpoint，commit 即时）；根节点（verdict）；
- 协议变更：CEO 确认；schema 向后兼容（新字段可选，旧树实例不破坏）；
- 本协议自 M2-R7 起生效，所有节点化工作流必须走树承载。

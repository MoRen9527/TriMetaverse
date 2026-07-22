# S7 实施分步计划：TriMC 镜像端点 + 跨节点任务状态同步

> **作者**：小狄（CTO）  
> **日期**：2026-07-22  
> **版本**：v1.0  
> **上游设计**：CTO W30 架构修正技术设计 §7.2 S7（`w30-architecture-fix-design.md`）  
> **上游裁决**：CPO Q6 APPROVE — 6b 方案 A / 6c 事件驱动推送 + 30s 心跳兜底（`ruling.md` §6c）  
> **任务树**：`w30-s7-d7-mirror`，节点 `s7d7-1` in_progress  
> **next_agent**：FullStackDeveloper（s7d7-2）

---

## 1. 范围与交付物

### 1.1 本阶段范围

| 子系统 | 工作项 | 优先级 | 预估工作量 |
|--------|--------|--------|-----------|
| **TriMC** | 新增 `POST /internal/v1/tasks/mirror` 端点 | P1 | 2h |
| **TriMC** | 新增 `GET /internal/v1/tasks` 查询端点 | P1 | 1h |
| **TriMC** | MirrorTask 内存存储 + 状态模型 | P1 | 1.5h |
| **TriLC** | `TaskMirrorPusher` — 事件驱动状态推送到 TriMC | P1 | 2h |
| **TriLC** | 30s 心跳兜底 — 全量 active 任务推送 | P1 | 1h |
| **TriLC** | 离线标记 + 恢复全量推送 | P1 | 1h |
| **回归** | curl + 端到端验证 + D7 关闭 | P1 | 1.5h |

**总计预估**：~10h（不含 TriMC 部署）

### 1.2 不变项

- TriLC 本地功能（task submit / SSE stream / sessions）不受影响
- TriLC `ConnectionManager`（心跳 + 故障切换）复用，不新增 TCP 连接
- TriPilot / TriCode / VSCodium 无需变更
- TriMC 现有 `/internal/v1/tasks`（POST 占位）保留兼容

### 1.3 依赖确认

| 依赖 | 状态 | 说明 |
|------|------|------|
| S2（TriLC `/tasks/submit` + SSE） | ✅ 已就位 | `taskStreams` Map + TaskStreamEntry 状态模型可供 mirror 读取 |
| TriMC `/internal/v1/heartbeat` | ✅ 已就位 | 通信通道已验证：ConnectionManager → TriMC |
| TriLC `sessionStore` v2 云同步字段 | ✅ 已就位 | `syncStatus`/`lastSyncedAt`/`cloudSessionId` 可复用 |
| TriLC `localBus` 事件总线 | ✅ 已就位 | `task:queued`/`task:running`/`task:succeeded`/`task:failed` |

---

## 2. TriMC 侧实施：Mirror 端点 + 任务状态模型

### 2.1 新增文件

| 文件 | 职责 |
|------|------|
| `TriMC/src/mirror/types.ts` | MirrorTask + MirrorNode 类型定义 |
| `TriMC/src/mirror/store.ts` | MirrorStore — 内存任务镜像存储 + CRUD |
| (修改) `TriMC/src/server/app.ts` | 新增 2 路由 + 集成 MirrorStore |

### 2.2 任务状态模型

```typescript
// TriMC/src/mirror/types.ts

/** 镜像任务状态（CPO 6c 定义 + 扩展） */
export type MirrorTaskStatus =
  | 'pending'    // TriLC 已提交，尚未开始执行
  | 'running'    // TriLC 正在执行
  | 'success'    // 执行成功
  | 'failed'     // 执行失败
  | 'cancelled'  // 用户取消
  | 'unknown';   // TriLC 离线，状态未知

/** 单个镜像任务 */
export interface MirrorTask {
  taskId: string;           // TriLC sessionId（如 "sess_xxx"）
  nodeId: string;           // 来源 TriLC 节点（如 "trilc-win-jedih"）
  title: string;            // 任务标题（首条用户消息截断 ≤80 chars）
  status: MirrorTaskStatus;
  summary: string;          // 进度摘要（≤500 chars，CPO 6c 约束）
  updatedAt: string;        // ISO 8601，TriLC 最后上报时间
  lastSeenAt: string;       // ISO 8601，TriMC 最后收到该任务心跳的时间
  // 以下字段由 TriMC 服务端维护，不从 mirror payload 直接写入
  firstSeenAt: string;      // ISO 8601，TriMC 首次收到该任务的时间
  version: number;          // 单调递增，每次 mirror 更新 +1
}

/** mirror 端点请求体 */
export interface MirrorRequest {
  nodeId: string;
  tasks: Array<{
    taskId: string;
    title: string;
    status: MirrorTaskStatus;   // TriLC 侧只上报 pending/running/success/failed/cancelled
    summary: string;
    updatedAt: string;
  }>;
}

/** mirror 端点响应体 */
export interface MirrorResponse {
  ok: boolean;
  mirrored: number;         // 本次成功写入的任务数
}

/** GET /tasks 查询参数 */
export interface TaskQueryParams {
  nodeId?: string;          // 按节点过滤
  status?: MirrorTaskStatus;
  limit?: number;           // 默认 50
  offset?: number;          // 默认 0
}

/** GET /tasks 响应体 */
export interface TaskQueryResponse {
  tasks: MirrorTask[];
  total: number;
}
```

### 2.3 MirrorStore 实现规格

```typescript
// TriMC/src/mirror/store.ts

export class MirrorStore {
  private tasks = new Map<string, MirrorTask>();  // key = `${nodeId}:${taskId}`
  private versionCounter = 0;

  /**
   * 写入/更新一批镜像任务。
   * 规则：
   * - 新 taskId → 插入，firstSeenAt = now
   * - 已有 taskId → 只更新 status/summary/updatedAt/lastSeenAt，version+1
   * - 不允许 status 从 terminal 回退到非 terminal（CPO 6c: TriLC 是权威方，
   *   但 TriMC 做基本防御：如果现有状态是 success/failed/cancelled 且新状态
   *   是 running，记录 warning 但仍接受——因为可能是 TriLC 恢复后的全量推送）
   */
  mirror(nodeId: string, tasks: MirrorRequest['tasks']): number;

  /** 标记某节点所有任务为 unknown（TriLC 离线时调用） */
  markNodeUnknown(nodeId: string): number;

  /** 查询任务列表 */
  query(params: TaskQueryParams): TaskQueryResponse;

  /** 单任务查询 */
  getTask(nodeId: string, taskId: string): MirrorTask | undefined;

  /** 获取某节点所有活跃（非 terminal）任务，用于恢复后全量推送 */
  getActiveByNode(nodeId: string): MirrorTask[];
}
```

### 2.4 端点 API 契约（细化）

#### ⑥ POST /internal/v1/tasks/mirror

**用途**：TriLC daemon 向 TriMC 上报本地任务状态快照。

**请求**：
```json
{
  "nodeId": "trilc-win-jedih",
  "tasks": [
    {
      "taskId": "sess_lzq8k2_a3f4",
      "title": "重构 TriPilot 工具执行路径",
      "status": "running",
      "summary": "正在分析 extension.ts，步骤 3/6，已调用 read_file 工具",
      "updatedAt": "2026-07-22T10:02:30+08:00"
    },
    {
      "taskId": "sess_lzq7j1_b2e3",
      "title": "修复 TriLC 启动超时",
      "status": "success",
      "summary": "修复完成：调整了 daemon 初始化超时从 5s 到 30s",
      "updatedAt": "2026-07-22T09:45:00+08:00"
    }
  ]
}
```

**响应**：`200 OK`
```json
{
  "ok": true,
  "mirrored": 2
}
```

**错误响应**：
- `400` — body 非 JSON 或缺少 `nodeId`/`tasks`
- `400` — `tasks` 不是数组或为空
- `400` — 任一 task 缺少 `taskId`

**实现要点**：
- **幂等**：重复调用相同内容不产生副作用（version 不增加）
- **terminal 防御**：若已有状态为 `success`/`failed`/`cancelled` 且新状态为 `running`，接受但记录 warning（恢复全量推送场景）
- **summary 截断**：若超过 500 chars，截断并附加 `...`
- **异步轻量**：不做 DB 持久化（MVP 阶段，内存存储；后续可扩展 SQLite/PG）

#### GET /internal/v1/tasks

**用途**：统一任务状态查询，供所有入口调用。

**查询参数**：

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `nodeId` | string | — | 按 TriLC 节点过滤 |
| `status` | string | — | 按状态过滤（pending/running/success/failed/cancelled/unknown） |
| `limit` | int | 50 | 返回上限 |
| `offset` | int | 0 | 分页偏移 |

**示例**：`GET /internal/v1/tasks?status=running&limit=20`

**响应**：`200 OK`
```json
{
  "tasks": [
    {
      "taskId": "sess_lzq8k2_a3f4",
      "nodeId": "trilc-win-jedih",
      "title": "重构 TriPilot 工具执行路径",
      "status": "running",
      "summary": "正在分析 extension.ts，步骤 3/6",
      "updatedAt": "2026-07-22T10:02:30+08:00",
      "lastSeenAt": "2026-07-22T10:02:30+08:00",
      "firstSeenAt": "2026-07-22T10:00:00+08:00",
      "version": 5
    }
  ],
  "total": 1
}
```

**排序规则**：`updatedAt` 降序（最近更新的在前）

**实现要点**：
- 默认不返回 `unknown` 超过 1 小时的任务（可配置）
- 无认证（MVP 阶段，与现有 TriMC 端点一致）

### 2.5 TriMC app.ts 集成点

在 `TriMC/src/server/app.ts` 中添加（位于 `/internal/v1/heartbeat` 路由之后）：

```typescript
// ── POST /internal/v1/tasks/mirror ──
// S7: Receive task state snapshots from TriLC nodes.
// CPO Q6c + CTO §7.2 S7.
if (req.url === '/internal/v1/tasks/mirror' && req.method === 'POST') {
  // ① 读取 body → ② 校验 nodeId/tasks → ③ mirrorStore.mirror() → ④ 返回 {ok, mirrored}
}

// ── GET /internal/v1/tasks ──
// S7: Query unified task state across all TriLC nodes.
if (req.url?.startsWith('/internal/v1/tasks') && req.method === 'GET') {
  // ① 解析 query params → ② mirrorStore.query() → ③ 返回 {tasks, total}
}
```

---

## 3. TriLC 侧实施：状态变更事件 → 推送逻辑

### 3.1 架构概览

```
TriLC daemon
    │
    ├── POST /internal/v1/tasks/submit
    │       │ taskStreams.set(sessionId, entry)
    │       ▼
    │   localBus.publish({ type: 'task:queued', taskId })
    │       │
    │       ▼ (SSE stream 执行)
    │   entry.status → 'running'  →  localBus.publish({ type: 'task:running', taskId })
    │   entry.status → 'done'     →  localBus.publish({ type: 'task:succeeded', taskId })
    │   entry.status → 'error'    →  localBus.publish({ type: 'task:failed', taskId })
    │   entry.status → 'cancelled'→  localBus.publish({ type: 'task:cancelled', taskId })
    │
    └── TaskMirrorPusher (NEW)
            │
            ├── 订阅 localBus 事件
            │     task:queued/running/succeeded/failed/cancelled
            │     → buildMirrorPayload(taskId)
            │     → POST /internal/v1/tasks/mirror (event-driven push)
            │
            ├── 30s 心跳兜底
            │     → 遍历 taskStreams + sessionStore active
            │     → 全量 POST /internal/v1/tasks/mirror
            │
            └── 离线/恢复
                  degraded → 停止推送（TriMC 心跳超时后自动 mark unknown）
                  connected → 全量推送当前 active 任务
```

### 3.2 新增文件

| 文件 | 职责 |
|------|------|
| `TriLC/src/mirror/pusher.ts` | `TaskMirrorPusher` — 事件订阅 + HTTP 推送 + 心跳 |
| `TriLC/src/mirror/types.ts` | TriLC 侧 mirror 类型（复用 TriMC MirrorRequest 结构） |
| (修改) `TriLC/src/localbus/bus.ts` | 新增 `task:cancelled` 事件类型 |
| (修改) `TriLC/src/server/app.ts` | 集成 TaskMirrorPusher + 取消时发布事件 |

### 3.3 TaskMirrorPusher 设计

```typescript
// TriLC/src/mirror/pusher.ts

export class TaskMirrorPusher {
  private trimcBaseUrl: string;
  private nodeId: string;
  private mirrorInterval: NodeJS.Timeout | null = null;
  private enabled = true;

  constructor(
    trimcBaseUrl: string,
    nodeId: string,
    /** 获取当前所有活跃任务的快照 */
    private getActiveSnapshots: () => MirrorTaskSnapshot[],
  ) {
    this.trimcBaseUrl = trimcBaseUrl;
    this.nodeId = nodeId;
  }

  /**
   * 启动：订阅 localBus 事件 + 启动 30s 心跳
   */
  start(): void {
    // ① 订阅 localBus
    localBus.on('event', this.onLocalBusEvent);

    // ② 启动 30s 心跳（与 ConnectionManager 心跳错开 15s，避免同时压 TriMC）
    this.mirrorInterval = setInterval(() => this.heartbeatPush(), 30_000);
  }

  /**
   * 事件驱动推送：状态变更时立即推送单个任务
   */
  private onLocalBusEvent = (event: LocalBusEvent): void => {
    if (!this.enabled) return;
    if (!event.type.startsWith('task:')) return;

    const taskId = 'taskId' in event ? event.taskId : undefined;
    if (!taskId) return;

    // 构建单任务 mirror payload
    const snapshot = this.buildSnapshot(taskId);
    if (!snapshot) return;

    this.push([snapshot]);
  };

  /**
   * 心跳兜底：全量推送当前 active 任务
   */
  private async heartbeatPush(): Promise<void> {
    if (!this.enabled) return;
    const snapshots = this.getActiveSnapshots();
    if (snapshots.length === 0) return; // 无活跃任务，跳过
    await this.push(snapshots);
  }

  /**
   * HTTP POST to TriMC /internal/v1/tasks/mirror
   */
  private async push(tasks: MirrorTaskSnapshot[]): Promise<void> {
    try {
      const body = JSON.stringify({ nodeId: this.nodeId, tasks });
      // 复用 ConnectionManager 的 HTTP 请求模式
      // 超时 5s（mirror 非关键路径，不能阻塞 daemon）
      await postMirror(this.trimcBaseUrl, body, 5_000);
    } catch (err) {
      // 静默失败 — mirror 失败不影响本地功能（CPO 6c 设计原则）
      console.warn(`[trilc:mirror] push failed (${tasks.length} tasks):`,
        err instanceof Error ? err.message : String(err));
    }
  }

  /** 连接恢复时调用：全量推送 */
  onReconnected(): void {
    this.heartbeatPush();
  }

  /** 连接降级时调用：停止推送 */
  onDegraded(): void {
    // 不主动 mark unknown — TriMC 端通过心跳超时自行判断
    // 这样避免 degraded→connected 反复横跳导致状态抖动
  }

  stop(): void {
    this.enabled = false;
    localBus.off('event', this.onLocalBusEvent);
    if (this.mirrorInterval) {
      clearInterval(this.mirrorInterval);
      this.mirrorInterval = null;
    }
  }
}
```

### 3.4 TaskMirrorPusher 集成点

在 `TriLC/src/server/app.ts` 的 `createTriLCApp()` 中：

```typescript
// 在 ConnectionManager 初始化之后
const mirrorPusher = new TaskMirrorPusher(
  env.trimcBaseUrl,
  env.nodeId,
  () => getActiveSnapshots(taskStreams, sessionStore),
);

// 连接恢复 → 全量推送
connMgr.onRecovered(() => {
  resetConnectionId();
  connMgr._setConnectionId(connectionId);
  mirrorPusher.onReconnected();   // ← 新增
});

// 连接降级 → 暂停推送
// （在 ConnectionManager.recordFailure 中 publish({type:'node:degraded'}) 时触发）
localBus.on('event', (event) => {
  if (event.type === 'node:degraded') mirrorPusher.onDegraded();
});

// 启动 mirror pusher
mirrorPusher.start();
```

### 3.5 快照构建逻辑

```typescript
interface MirrorTaskSnapshot {
  taskId: string;
  title: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  summary: string;
  updatedAt: string;
}

function getActiveSnapshots(
  taskStreams: Map<string, TaskStreamEntry>,
  sessionStore: ReturnType<typeof createSessionStore>,
): MirrorTaskSnapshot[] {
  const snapshots: MirrorTaskSnapshot[] = [];

  // ① 从 taskStreams（内存中的活跃/近期任务）
  for (const [id, entry] of taskStreams) {
    snapshots.push({
      taskId: id,
      title: entry.message.slice(0, 80),
      status: mapStreamStatus(entry.status),
      summary: buildSummary(entry),
      updatedAt: new Date(entry.createdAt).toISOString(),
    });
  }

  // ② 从 sessionStore（持久化的 active/interrupted 会话，不在 taskStreams 中）
  const activeSessions = sessionStore.listSessions({ status: 'active', limit: 50 })
    .concat(sessionStore.listSessions({ status: 'interrupted', limit: 50 }));
  
  for (const s of activeSessions) {
    if (taskStreams.has(s.id)) continue; // 避免重复
    snapshots.push({
      taskId: s.id,
      title: s.title ?? 'Untitled',
      status: s.status === 'interrupted' ? 'failed' : 'running',
      summary: `${s.messageCount} messages`,
      updatedAt: s.updatedAt,
    });
  }

  return snapshots;
}

function mapStreamStatus(s: TaskStreamEntry['status']): MirrorTaskSnapshot['status'] {
  switch (s) {
    case 'pending':   return 'pending';
    case 'running':   return 'running';
    case 'done':      return 'success';
    case 'error':     return 'failed';
    case 'cancelled': return 'cancelled';
  }
}

function buildSummary(entry: TaskStreamEntry): string {
  if (entry.progress) {
    return `${entry.progress.description} (${entry.progress.step}/${entry.progress.totalSteps})`;
  }
  if (entry.status === 'done') return 'Task completed';
  if (entry.status === 'error') return 'Task failed';
  if (entry.status === 'cancelled') return 'Cancelled by user';
  return entry.message.slice(0, 200);
}
```

### 3.6 localBus 事件类型扩展

在 `TriLC/src/localbus/bus.ts` 中新增：

```typescript
export type LocalBusEvent =
  | { type: 'task:queued'; taskId: string }
  | { type: 'task:running'; taskId: string }
  | { type: 'task:succeeded'; taskId: string; result: unknown }
  | { type: 'task:failed'; taskId: string; error: string }
  | { type: 'task:cancelled'; taskId: string }           // ← 新增
  | { type: 'node:connected' }
  | { type: 'node:degraded' }
  | { type: 'node:local' }
  | { type: 'agent:event'; event: Record<string, unknown> };
```

**事件发布点**（在 `app.ts` 中补充）：

| 位置 | 事件 | 说明 |
|------|------|------|
| `POST /internal/v1/tasks/submit` → 创建 entry 后 | `publish({type:'task:queued', taskId: sessionId})` | ✅ 已有（需确认） |
| SSE stream → `entry.status = 'running'` | `publish({type:'task:running', taskId})` | 需补充 |
| SSE stream → `entry.status = 'done'` | `publish({type:'task:succeeded', taskId})` | 需补充 |
| SSE stream → `entry.status = 'error'` | `publish({type:'task:failed', taskId, error})` | 需补充 |
| `POST /sessions/{id}/cancel` → `entry.status = 'cancelled'` | `publish({type:'task:cancelled', taskId})` | 需补充 |

---

## 4. 离线处理与恢复策略

### 4.1 离线检测（TriMC 端）

TriMC 已有 `POST /internal/v1/heartbeat` 接收 TriLC 心跳。扩展逻辑：

- **心跳超时**：若某 `nodeId` 在 90s 内（3×30s 心跳周期）无 heartbeat → 将该节点所有任务标记为 `unknown`
- **实现**：在 MirrorStore 中新增 `checkNodeTimeout(nodeId, timeoutMs)` 方法，由 TriMC heartbeat handler 或定时器调用

```typescript
// TriMC/src/mirror/store.ts

/**
 * 标记超时节点所有非 terminal 任务为 unknown。
 * 由 heartbeat handler 在检测到节点超时时调用。
 */
markNodeUnknown(nodeId: string): number {
  let count = 0;
  for (const [key, task] of this.tasks) {
    if (task.nodeId === nodeId && !TERMINAL_STATUSES.has(task.status)) {
      task.status = 'unknown';
      task.updatedAt = new Date().toISOString();
      task.version++;
      count++;
    }
  }
  return count;
}
```

### 4.2 恢复全量推送（TriLC 端）

`ConnectionManager` 从 `degraded` → `connected` 时触发 `recoveryCallback`：

```typescript
// TriLC/src/server/app.ts (已有 onRecovered hook)
connMgr.onRecovered(() => {
  resetConnectionId();
  connMgr._setConnectionId(connectionId);
  mirrorPusher.onReconnected();   // ← 全量推送当前 active 任务
});
```

全量推送内容：taskStreams 中所有 active task + sessionStore 中 `active`/`interrupted` 会话。

### 4.3 状态一致性保证

| 场景 | 处理方式 |
|------|---------|
| TriLC 正常 → 状态变更事件 → 推送单任务 | 实时 |
| TriLC 正常 → 30s 无任何变更 | 心跳兜底全量推送 active 任务 |
| TriLC degraded → 停止推送 | TriMC 端心跳超时（90s）后标记 `unknown` |
| TriLC degraded → connected | 立即全量推送 current active 任务 |
| TriLC 崩溃 → 进程消失 | TriMC 端心跳超时 → `unknown` |
| TriLC 重启 → 新进程 | ConnectionManager 恢复 → 全量推送 |
| Mirror 网络瞬时故障 | 静默丢弃，下一轮心跳兜底 |
| TriLC 侧 task 被 GC（taskStreams.delete） | 心跳全量推送自然不再包含 → TriMC 端任务保持最后状态（不删除） |

---

## 5. 实施顺序

| 步骤 | 内容 | 模块 | 验证 | 预估 |
|------|------|------|------|------|
| **Step 1** | 创建 `TriMC/src/mirror/types.ts` + `store.ts` | TriMC | 单元测试：MirrorStore CRUD 逻辑 | 1.5h |
| **Step 2** | TriMC `POST /internal/v1/tasks/mirror` 端点 | TriMC | curl 验证：post → 200 + `{ok, mirrored}` | 1h |
| **Step 3** | TriMC `GET /internal/v1/tasks` 查询端点 | TriMC | curl 验证：带 query → 返回正确 tasks | 1h |
| **Step 4** | TriLC `TaskMirrorPusher` 核心实现 | TriLC | 单元测试：事件→payload→HTTP mock | 1.5h |
| **Step 5** | TriLC localBus 事件发布补充 + app.ts 集成 | TriLC | 手动触发 task submit → 观察 TriMC mirror 日志 | 1h |
| **Step 6** | 30s 心跳兜底 + 离线/恢复逻辑 | TriLC+TriMC | 停掉 TriLC → 等 90s → 确认 TriMC 标记 unknown → 启动 TriLC → 确认恢复 | 1.5h |
| **Step 7** | 端到端验证 + D7 关闭报告 | — | s7d7-3（TestEngineer 执行） | 1.5h |

### 依赖链

```
Step 1 ──→ Step 2 ──→ Step 3
                │
                ▼
Step 4 ──→ Step 5 ──→ Step 6 ──→ Step 7
```

Step 1-3（TriMC 侧）与 Step 4（TriLC pusher 核心）可并行。

---

## 6. 测试门禁

### 6.1 单元测试

| 模块 | 测试文件 | 关键用例 |
|------|---------|---------|
| TriMC | `test/mirror/store.test.ts` | insert→query→update→terminal defense→markUnknown |
| TriMC | `test/mirror/api.test.ts` | POST mirror: valid/invalid payload; GET tasks: filter/pagination |
| TriLC | `test/mirror/pusher.test.ts` | event→snapshot build; heartbeat push; HTTP mock |

### 6.2 集成测试（curl）

```bash
# ① TriMC mirror 端点 — 上报 2 个任务
curl -X POST http://localhost:PORT/internal/v1/tasks/mirror \
  -H "Content-Type: application/json" \
  -d '{"nodeId":"test-node","tasks":[{"taskId":"task-1","title":"Test task","status":"running","summary":"step 2/5","updatedAt":"2026-07-22T10:00:00+08:00"}]}'

# ② TriMC 查询 — 按状态过滤
curl "http://localhost:PORT/internal/v1/tasks?status=running"

# ③ TriLC → TriMC 端到端
# 启动 TriLC → POST /internal/v1/tasks/submit → 观察 TriMC mirror 日志
# → GET /internal/v1/tasks 确认任务出现

# ④ 离线 → 恢复
# 停掉 TriLC → 等 90s → GET /tasks 确认 status=unknown
# → 启动 TriLC → GET /tasks 确认 status 恢复为 running/success
```

### 6.3 端到端场景（s7d7-3 执行）

| 场景 | 验证点 |
|------|--------|
| PC 提交任务 → 移动端查看 | TriPilot submit → TriLC mirror → TriMC → 查询到任务 |
| 任务状态流转 | queued → running → success，全程 TriMC 可见 |
| 离线标记 | TriLC 停止 → 90s 后 TriMC 标记 unknown |
| 恢复全量推送 | TriLC 重启 → 立即在 TriMC 看到恢复后的任务状态 |

---

## 7. 风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| Mirror 推送阻塞 TriLC daemon 主循环 | 低 | 本地任务延迟 | 推送用独立 HTTP 请求（fire-and-forget），超时 5s，异常静默丢弃 |
| TriMC 内存无限增长（旧任务不清理） | 中 | OOM | MVP 阶段：超过 1000 条的 node 自动清理 terminal >24h 的记录；post-MVP 迁移到 SQLite |
| `unknown` 标记抖动（短暂网络波动） | 中 | 用户体验差 | 90s 超时（3×30s），比单次心跳丢失宽容 |
| localBus 事件在 `taskStreams.delete()` 后到达 | 低 | pusher 找不到 task → 跳过 | `buildSnapshot(taskId)` 返回 null 时静默跳过 |

---

## 8. D7 偏差关闭追踪清单

| 偏差 | 描述 | 关闭条件 | 验证方式 |
|------|------|---------|---------|
| **D1** | TriPilot 本地执行工具调用 | ✅ W29 已关闭（S3 完成） | — |
| **D2** | IDE 关闭 = 任务终止 | ✅ W29 已关闭（S2 完成） | — |
| **D3** | TriPilot↔TriLC 协议仅覆盖 LLM streaming | ✅ W29 已关闭（S2+S4 完成） | — |
| **D4** | TriCode 为 TriPilot 直接依赖 | ✅ W29 已关闭（S6 完成） | — |
| **D5** | 无会话自动恢复 | ✅ W29 已关闭（S5 完成） | — |
| **D6** | TriPilot 持有直接 API 调用 | ✅ W29 已关闭（S3 完成） | — |
| **D7** | 无跨节点任务状态同步 | ⏳ **本 S7 关闭** | ① TriMC mirror+query 端点 curl 通过 ② TriLC→TriMC E2E 通过 ③ 离线/恢复验证通过 |

**D7 关闭报告**将在 s7d7-3（TestEngineer）完成后产出，统一写入 `TWF-002/deviation-closeout.md`。

---

## 9. 交付物清单

| # | 交付物 | 路径 | 状态 |
|---|--------|------|------|
| 1 | 本实施计划 | `trees/w30-s7-d7-mirror/implementation-plan.md` | ✅ done |
| 2 | TriMC mirror types + store | `TriMC/src/mirror/` | → s7d7-2 |
| 3 | TriMC mirror + query 端点 | `TriMC/src/server/app.ts` | → s7d7-2 |
| 4 | TriLC TaskMirrorPusher | `TriLC/src/mirror/` | → s7d7-2 |
| 5 | TriLC localBus 事件扩展 | `TriLC/src/localbus/bus.ts` | → s7d7-2 |
| 6 | D7 关闭报告 | `TWF-002/deviation-closeout.md` | → s7d7-3 |

---

## 10. 决策记录

### 技术判断：APPROVE — 方案可行

- ✅ **TriMC 侧**：MirrorStore 内存存储 + 2 端点，工程简单，无新依赖
- ✅ **TriLC 侧**：复用现有 `localBus` + `ConnectionManager` + HTTP 模式，零新基础设施
- ✅ **通信**：心跳通道已存在（`/internal/v1/heartbeat`），mirror 复用到同一 TriMC URL
- ✅ **MVP 边界**：不涉及 DB 持久化、认证、复杂冲突解决，匹配 CPO 6c MVP 规格

### 交付计划
Step 1-3（TriMC）与 Step 4（TriLC Pusher）可并行，总串行时间约 6.5h + 验证 1.5h ≈ 8h。

### 风险与缓解
主要风险：mirror 推送失败影响本地功能 → 缓解：fire-and-forget + 5s 超时，失败静默丢弃。

### 发布姿态
- TriMC mirror 端点需在 TriMC 部署后可用
- TriLC mirror pusher 随 TriLC 重启生效
- 不影响现有任何功能（纯新增路径）

### 使用依据
- CPO Q6 裁决（`ruling.md` §6c）
- CTO W30 架构修正设计 §7.2 S7（`w30-architecture-fix-design.md`）
- TriMC `app.ts` 现有路由模式（heartbeat/events/replay）
- TriLC `app.ts` 现有 `taskStreams` Map + `ConnectionManager` + `localBus`
- TriLC `sessionStore` v2 schema（`syncStatus`/`lastSyncedAt`/`cloudSessionId`）
- TriLC `event-queue` 已有 `postHeartbeat`/`postReplay` HTTP 请求模式

---

**计划完成时间**：2026-07-22T16:45+08:00  
**下一步**：s7d7-2 — FullStackDeveloper 实施 TriMC mirror 端点 + TriLC TaskMirrorPusher  
**追踪**：更新 `tree-op.json` 节点 s7d7-1 → done

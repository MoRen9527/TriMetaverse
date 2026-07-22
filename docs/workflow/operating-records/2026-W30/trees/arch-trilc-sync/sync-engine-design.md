# CTO 实施设计：TriLC 会话云同步引擎（sync-engine）

> **作者**：小狄（CTO）  
> **日期**：2026-07-22  
> **版本**：v1.0  
> **上游设计**：`arch-trilc-daemon/technical-design.md` §6-§7  
> **任务树**：`arch-trilc-sync`，节点 `arch-trilc-sync-1`  
> **next_agent**：FullStackDeveloper（`arch-trilc-sync-2`）  
> **状态**：`APPROVE` — 技术可行，无 FREEZE 项，可交付实施

---

## 前置核查摘要

| # | 核查项 | 文件 | 关键发现 |
|---|--------|------|---------|
| 0 | 工作路径 | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-sync/` | ✅ 路径正确 |
| 0.5 | 归属路由 | CTO 设计域 | ✅ 技术实施规格，CTO 产出，归属正确 |
| 1 | 上游裁决 | `arch-trilc-daemon/technical-design.md` §6-§7 | ✅ CTO APPROVE，sync-engine 规格可供细化 |
| 2 | BusinessStrategy | `business-strategy-boundaries.md` L20-21 | TriLC = 本地主入口，TriMC = 云端 fallback；同步为 TriLC→TriMC 单向 |
| 3 | 技术真源 | `DESIGN.md` | TriMetaverse 侧发布摘要页；真源在 TriCompany source 侧 |
| 4 | Code Registry | TriLC `code-state.md` | session-store v2 已完成（sync_status/cloud_session_id 字段 + migration），37/37 tests PASS |
| 5 | 现有源码 | TriLC `src/session-store/store.ts` | `updateSyncStatus` / `markPendingSync` / `getPendingSyncSessions` / `getSessionByCloudId` 均已就位 |
| 6 | 现有源码 | TriLC `src/config/env.ts` | `nodeId` / `trimcBaseUrl` / `dataDir` 可通过 `readEnv()` 获取 |
| 7 | 现有源码 | TriLC `src/mirror/pusher.ts` | Task mirror 使用 `node:http`/`node:https` 直接请求，fire-and-forget 模式；sync-engine 应采用 `fetch` API（Node 22 内置） |
| 8 | 测试框架 | TriLC `package.json` | `node --import tsx --test test/**/*.test.ts` — Node 原生 test runner + tsx |
| 9 | 公司治理 | — | 不阻塞本设计 |

**关键发现**：
1. session-store 已在 `arch-trilc-daemon` 中落地 schema v2 migration（`sync_status`/`last_synced_at`/`cloud_session_id`/`title`）+ 索引 `idx_sessions_sync`。sync-engine 直接消费这些 API，无需进一步 schema 变更。
2. `src/mirror/` 是 task mirror（fire-and-forget），与 session sync（带重试+状态机）是正交模块，无冲突。
3. `env.ts` 已提供 `nodeId` 和 `trimcBaseUrl`，sync-engine 可直接注入依赖，无需新配置项。
4. Node 22 `fetch`（全局可用）替代 `node:http` 手动构建请求，代码量更少且自带 `AbortSignal.timeout()`。

---

## 1. 文件结构

### 1.1 新增文件

```
TriLC/
├── src/
│   └── sync/
│       ├── index.ts              # 公开导出 + SyncEngine 工厂函数
│       ├── types.ts              # 同步模块类型契约
│       ├── sync-engine.ts        # 核心同步引擎
│       ├── payload-builder.ts    # 构建 SyncRequest payload
│       └── retry.ts              # 退避重试逻辑
└── test/
    └── sync-engine.test.ts       # 单元测试（正常/409/503/超时/截断等）
```

### 1.2 不新增/不变更的文件

| 文件 | 原因 |
|------|------|
| `src/session-store/store.ts` | v2 schema + API 均已完备 |
| `src/session-store/types.ts` | `SyncStatus` 类型已定义 |
| `src/config/env.ts` | `nodeId` / `trimcBaseUrl` 已可用 |
| `src/mirror/` | task mirror 正交模块，不涉及 |

### 1.3 依赖关系

```
src/sync/sync-engine.ts
  ├── src/sync/types.ts             (SyncResult, SyncEntry)
  ├── src/sync/payload-builder.ts   (buildSyncPayload)
  ├── src/sync/retry.ts             (withRetry)
  ├── src/session-store/types.ts    (SessionRecord, SyncStatus)
  └── src/session-store/store.ts    (updateSyncStatus, getPendingSyncSessions, getMessages)

src/sync/index.ts
  ├── src/sync/sync-engine.ts       (createSyncEngine)
  └── src/sync/types.ts             (re-export)
```

---

## 2. 类型契约

### 2.1 `src/sync/types.ts`

```typescript
// ── TriLC Sync Engine Types ──
// Session cloud sync: TriLC → TriMC (Phase 1 single-direction)

/** 单次同步操作结果 */
export interface SyncResult {
  ok: boolean;
  cloudSessionId?: string;    // 成功时 TriMC 返回的云端 ID
  syncedMessageCount?: number; // 成功时同步消息数
  error?: string;              // 失败时的错误信息
  retried?: boolean;           // 是否经历了重试
}

/** 批量同步结果 */
export interface BatchSyncResult {
  total: number;
  synced: number;
  failed: number;
  results: Array<{ sessionId: string; ok: boolean; cloudSessionId?: string; error?: string }>;
}

/** 同步引擎配置 */
export interface SyncEngineConfig {
  /** TriMC base URL，如 "http://127.0.0.1:8710" */
  trimcBaseUrl: string;
  /** 本节点 ID */
  nodeId: string;
  /** 消息截断上限（默认 5000） */
  maxMessages?: number;
  /** 请求超时毫秒（默认 30000） */
  timeoutMs?: number;
  /** 重试退避序列（默认 [1000, 2000, 4000]） */
  retryBackoffs?: number[];
}

/** 默认配置 */
export const DEFAULT_SYNC_CONFIG: Required<SyncEngineConfig> = {
  trimcBaseUrl: 'http://127.0.0.1:8710',
  nodeId: 'trilc-unknown',
  maxMessages: 5000,
  timeoutMs: 30_000,
  retryBackoffs: [1000, 2000, 4000],
};

/**
 * 构建发送给 TriMC 的同步 payload。
 * nodeId + localSessionId 组成幂等键。
 */
export interface SyncRequestPayload {
  nodeId: string;
  syncType: 'full';                     // Phase 1 仅支持全量同步
  session: {
    localSessionId: string;
    title: string;
    status: string;                     // session status 枚举值
    createdAt: string;                  // ISO 8601
    updatedAt: string;
    messages: SyncMessagePayload[];
  };
  syncedAt: string;                     // ISO 8601
}

export interface SyncMessagePayload {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | null;
  timestamp: string;
  toolCalls?: Array<{
    toolName: string;
    input: Record<string, unknown>;
    output?: string;
    durationMs?: number;
  }> | null;
  toolCallId?: string | null;
}

/** TriMC 200 OK 响应 */
export interface SyncSuccessResponse {
  ok: true;
  cloudSessionId: string;
  localSessionId: string;
  syncedMessageCount: number;
  syncedAt: string;
}

/** TriMC 409 Conflict 响应（去重） */
export interface SyncConflictResponse {
  ok: false;
  error: 'duplicate_session';
  message: string;
  existingCloudSessionId: string;
}

/** TriMC 503 不可用响应 */
export interface SyncUnavailableResponse {
  ok: false;
  error: 'service_unavailable';
  message: string;
}

/** TriMC 错误响应联合类型 */
export type SyncErrorResponse = SyncConflictResponse | SyncUnavailableResponse | {
  ok: false;
  error: string;
  message: string;
};
```

---

## 3. 核心模块设计

### 3.1 `src/sync/payload-builder.ts` — 构建同步 Payload

```typescript
// 职责：将 SessionRecord + SessionMessageRecord[] 组装为 SyncRequestPayload
// 规则：
//   1. messages 截断到 maxMessages（默认 5000），超出时记录 warning
//   2. toolCalls 字段从 session_messages.tool_calls (JSON string) 反序列化
//   3. timestamp 使用消息的 created_at 字段

import type { SessionRecord, SessionMessageRecord } from '../session-store/types.js';
import type { SyncRequestPayload, SyncMessagePayload } from './types.js';

export function buildSyncPayload(
  session: SessionRecord,
  messages: SessionMessageRecord[],
  nodeId: string,
  maxMessages: number,
): {
  payload: SyncRequestPayload;
  truncated: boolean;
} {
  const truncated = messages.length > maxMessages;
  const sliced = truncated ? messages.slice(0, maxMessages) : messages;

  const messagePayloads: SyncMessagePayload[] = sliced.map((msg) => {
    const payload: SyncMessagePayload = {
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt,
    };

    if (msg.toolCalls) {
      try {
        const raw = JSON.parse(msg.toolCalls) as Array<{
          id: string;
          type: string;
          function: { name: string; arguments: string };
        }>;
        payload.toolCalls = raw.map((tc) => ({
          toolName: tc.function.name,
          input: (() => {
            try {
              return JSON.parse(tc.function.arguments) as Record<string, unknown>;
            } catch {
              return { raw: tc.function.arguments };
            }
          })(),
        }));
      } catch {
        // 解析失败，跳过 toolCalls
      }
    }

    if (msg.toolCallId) {
      payload.toolCallId = msg.toolCallId;
    }

    return payload;
  });

  return {
    payload: {
      nodeId,
      syncType: 'full',
      session: {
        localSessionId: session.id,
        title: session.title ?? '',
        status: session.status,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messages: messagePayloads,
      },
      syncedAt: new Date().toISOString(),
    },
    truncated,
  };
}
```

### 3.2 `src/sync/retry.ts` — 退避重试

```typescript
// 职责：对可重试的错误执行指数退避重试
// 重试判断规则：
//   - 网络错误（fetch 抛出）         → 重试
//   - 5xx（含 503）                  → 重试
//   - 4xx（除 409）                  → 不重试（客户端错误）
//   - 409 Conflict                   → 不重试（当作成功，由 sync-engine 处理）
//   - 413 Payload Too Large          → 不重试
//   - 超时（AbortError）             → 重试

import type { SyncRequestPayload, SyncErrorResponse } from './types.js';

export interface RetryConfig {
  backoffs: number[];   // 退避序列，如 [1000, 2000, 4000]
  timeoutMs: number;
}

export interface RetryAttempt {
  attempt: number;       // 从 1 开始
  delayMs: number;       // 本次尝试前的等待时间（第一次为 0）
}

/** 判断 HTTP 状态码是否可重试 */
export function isRetryable(status: number): boolean {
  // 5xx 可重试（服务器临时故障）
  if (status >= 500 && status < 600) return true;
  // 429 可重试（限流）
  if (status === 429) return true;
  // 4xx 不可重试（客户端错误，重试无意义）
  return false;
}

/** 判断是否是超时错误 */
export function isTimeoutError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

/**
 * 带重试的 fetch 包装。
 * 返回最后一次响应或抛出的错误。
 */
export async function fetchWithRetry(
  url: string,
  body: SyncRequestPayload,
  config: RetryConfig,
): Promise<{
  response: Response;
  retried: boolean;
}> {
  let lastError: unknown = null;
  let retried = false;

  for (let i = 0; i < config.backoffs.length + 1; i++) {
    // 非首次尝试：等待退避时间
    if (i > 0) {
      retried = true;
      const delayMs = config.backoffs[i - 1];
      await sleep(delayMs);
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.timeoutMs),
      });

      // 409 Conflict：直接返回（不当作错误）
      if (res.status === 409) {
        return { response: res, retried };
      }

      // 可重试错误：继续循环
      if (!res.ok && isRetryable(res.status)) {
        lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
        continue;
      }

      // 其他情况（2xx 或不可重试的 4xx/5xx）：直接返回
      return { response: res, retried };
    } catch (err) {
      // 网络错误或超时：重试
      lastError = err;
      continue;
    }
  }

  // 全部重试耗尽
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### 3.3 `src/sync/sync-engine.ts` — 核心引擎

```typescript
// 职责：
//   1. 单会话同步：syncSessionToTriMC()
//   2. 批量同步：syncPendingSessions()
//   3. 状态机门禁：sync_status 迁移 guard
//   4. 409 去重处理
//   5. 消息截断记录
//
// 状态机回顾（来自 arch-trilc-daemon §6.4）：
//   local ──(新消息)──→ pending ──(用户触发)──→ syncing ──(200)──→ synced
//                                                       ──(失败)──→ error
//   synced ──(新消息)──→ pending
//   error ──(用户手动重试)──→ pending

import type { SessionRecord } from '../session-store/types.js';
import type {
  SyncResult,
  BatchSyncResult,
  SyncEngineConfig,
  SyncRequestPayload,
  SyncSuccessResponse,
  SyncConflictResponse,
  SyncErrorResponse,
} from './types.js';
import { DEFAULT_SYNC_CONFIG } from './types.js';
import { buildSyncPayload } from './payload-builder.js';
import { fetchWithRetry, isTimeoutError } from './retry.js';

export interface SyncEngineDeps {
  /** session-store 实例（只需同步相关方法） */
  store: {
    getSession(id: string): SessionRecord | null;
    getMessages(sessionId: string): Array<{
      role: string;
      content: string | null;
      toolCalls: string | null;
      toolCallId: string | null;
      createdAt: string;
    }>;
    updateSyncStatus(
      id: string,
      syncStatus: string,
      cloudSessionId?: string | null,
    ): void;
    getPendingSyncSessions(limit?: number): SessionRecord[];
  };
  config: SyncEngineConfig;
}

/**
 * 单会话同步到 TriMC。
 *
 * 状态机门禁：
 *   - 仅接受 status 为 'pending' 或 'error' 的会话
 *   - 'syncing' 状态拒绝（已在同步中）
 *   - 'synced' 或 'local' 跳过（前者已同步，后者无新消息）
 *
 * 409 Conflict 处理：
 *   - TriMC 返回 409 → 说明 (nodeId, localSessionId) 已存在
 *   - 使用 existingCloudSessionId 标记本地会话为 'synced'
 *   - 返回 ok: true（视为成功）
 *
 * 重试策略（通过 fetchWithRetry）：
 *   - 网络错误 / 超时 / 5xx → 最多 3 次重试，退避 1s/2s/4s
 *   - 4xx（除 409）→ 不重试，直接标记 error
 *   - 全部重试耗尽 → 标记 error，返回 ok: false
 */
export async function syncSessionToTriMC(
  sessionId: string,
  deps: SyncEngineDeps,
): Promise<SyncResult> {
  // ── 1. 加载会话 + 状态机门禁 ──
  const session = deps.store.getSession(sessionId);
  if (!session) {
    return { ok: false, error: 'session_not_found' };
  }

  const currentStatus = session.syncStatus ?? 'local';

  // 已在同步中 → 拒绝
  if (currentStatus === 'syncing') {
    return { ok: false, error: 'already_syncing' };
  }

  // 不需要同步的状态
  if (currentStatus === 'local' || currentStatus === 'synced') {
    return { ok: true, cloudSessionId: session.cloudSessionId ?? undefined, syncedMessageCount: 0 };
  }

  // 只接受 pending 和 error（手动重试）
  if (currentStatus !== 'pending' && currentStatus !== 'error') {
    return { ok: false, error: `invalid_sync_status: ${currentStatus}` };
  }

  // ── 2. 标记为 syncing ──
  deps.store.updateSyncStatus(sessionId, 'syncing');

  // ── 3. 读取消息并构建 payload ──
  const messages = deps.store.getMessages(sessionId);
  const maxMessages = deps.config.maxMessages ?? DEFAULT_SYNC_CONFIG.maxMessages;
  const { payload, truncated } = buildSyncPayload(session, messages, deps.config.nodeId, maxMessages);

  if (truncated) {
    console.warn(
      `[sync-engine] session ${sessionId}: ${messages.length} messages truncated to ${maxMessages} for sync`,
    );
  }

  // ── 4. 发送 HTTP POST（带重试） ──
  const url = `${deps.config.trimcBaseUrl}/internal/v1/sessions/sync`;
  const timeoutMs = deps.config.timeoutMs ?? DEFAULT_SYNC_CONFIG.timeoutMs;
  const backoffs = deps.config.retryBackoffs ?? DEFAULT_SYNC_CONFIG.retryBackoffs;

  try {
    const { response, retried } = await fetchWithRetry(url, payload, {
      backoffs,
      timeoutMs,
    });

    // ── 5a. 409 Conflict：去重，视为成功 ──
    if (response.status === 409) {
      const data = (await response.json()) as SyncConflictResponse;
      deps.store.updateSyncStatus(sessionId, 'synced', data.existingCloudSessionId);
      return {
        ok: true,
        cloudSessionId: data.existingCloudSessionId,
        syncedMessageCount: messages.length,
        retried,
      };
    }

    // ── 5b. 200 OK：同步成功 ──
    if (response.ok) {
      const data = (await response.json()) as SyncSuccessResponse;
      deps.store.updateSyncStatus(sessionId, 'synced', data.cloudSessionId);
      return {
        ok: true,
        cloudSessionId: data.cloudSessionId,
        syncedMessageCount: data.syncedMessageCount,
        retried,
      };
    }

    // ── 5c. 其他 HTTP 错误（非可重试 4xx）──
    const errorBody = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    deps.store.updateSyncStatus(sessionId, 'error');
    return {
      ok: false,
      error: (errorBody as SyncErrorResponse).message || `HTTP ${response.status}`,
      retried,
    };
  } catch (err) {
    // ── 5d. 全部重试耗尽 / 不可重试错误 ──
    deps.store.updateSyncStatus(sessionId, 'error');
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      retried: true,
    };
  }
}

/**
 * 批量同步所有 pending 会话。
 * 用于用户手动触发"全部同步"或定时后台任务。
 */
export async function syncPendingSessions(
  deps: SyncEngineDeps,
  limit = 50,
): Promise<BatchSyncResult> {
  const pending = deps.store.getPendingSyncSessions(limit);

  const results: BatchSyncResult['results'] = [];
  let synced = 0;
  let failed = 0;

  // 顺序执行（避免并发压 TriMC）
  for (const session of pending) {
    const result = await syncSessionToTriMC(session.id, deps);
    results.push({
      sessionId: session.id,
      ok: result.ok,
      cloudSessionId: result.cloudSessionId,
      error: result.error,
    });
    if (result.ok) synced++;
    else failed++;
  }

  return { total: pending.length, synced, failed, results };
}
```

### 3.4 `src/sync/index.ts` — 公开导出

```typescript
// ── TriLC Sync Engine Index ──
// 会话云同步：TriLC → TriMC 单向推送（Phase 1）

export { syncSessionToTriMC, syncPendingSessions } from './sync-engine.js';
export type { SyncEngineDeps } from './sync-engine.js';
export { buildSyncPayload } from './payload-builder.js';
export { fetchWithRetry, isRetryable, isTimeoutError } from './retry.js';
export type { RetryConfig, RetryAttempt } from './retry.js';
export type {
  SyncResult,
  BatchSyncResult,
  SyncEngineConfig,
  SyncRequestPayload,
  SyncMessagePayload,
  SyncSuccessResponse,
  SyncConflictResponse,
  SyncUnavailableResponse,
  SyncErrorResponse,
} from './types.js';
export { DEFAULT_SYNC_CONFIG } from './types.js';
```

---

## 4. sync_status 状态机边界条件详表

### 4.1 合法迁移表

| 当前状态 | 触发事件 | 目标状态 | 条件 |
|----------|----------|----------|------|
| `local` | 新消息写入 `session_messages` | `pending` | `markPendingSync()` 触发，仅当当前状态为 `local` 或 `synced` |
| `synced` | 新消息写入 `session_messages` | `pending` | `markPendingSync()` 触发 |
| `pending` | `syncSessionToTriMC()` 调用 | `syncing` | 引擎第 2 步标记 |
| `syncing` | TriMC 返回 200 | `synced` | 附带 `cloudSessionId` + `lastSyncedAt` |
| `syncing` | TriMC 返回 409 | `synced` | 使用 `existingCloudSessionId` |
| `syncing` | 网络错误 / 5xx 耗尽 / 不可重试 4xx | `error` | — |
| `error` | 用户手动重试 → `syncSessionToTriMC()` | `syncing` | 引擎第 2 步标记 |

### 4.2 非法 / 拒绝情况

| 尝试 | 当前状态 | 行为 |
|------|----------|------|
| `syncSessionToTriMC()` | `syncing` | 返回 `{ ok: false, error: 'already_syncing' }`，不修改状态 |
| `syncSessionToTriMC()` | `local` | 返回 `{ ok: true, syncedMessageCount: 0 }`，跳过（无需同步的新会话） |
| `syncSessionToTriMC()` | `synced` | 返回 `{ ok: true }`，跳过（已同步且无新消息） |
| `markPendingSync()` | `pending` / `syncing` / `error` | SQL `WHERE sync_status IN ('local', 'synced')` 自动跳过 |

### 4.3 并发安全

- `syncSessionToTriMC()` 第一步检查当前状态，第二步立即标记 `syncing`。
- 这两个操作之间没有锁，但 Node.js 单线程事件循环保证了同步逻辑间不会被抢占。
- 同一 sessionId 的并发 `syncSessionToTriMC()` 调用：第二个调用会在第 1 步读到 `syncing` 并被拒绝。
- **不需要引入数据库锁**——单线程模型 + 状态机门禁已足够。

### 4.4 边界场景

| 场景 | 行为 |
|------|------|
| 会话在 `syncing` 期间产生新消息 | 新消息写入不影响 `syncStatus`；同步完成后状态变为 `synced`，需由 `markPendingSync()` 重新标记为 `pending`。当前 store 的 `saveMessages()` 不自动调用 `markPendingSync()`——**由调用方（如 agentLoop 完成时）负责触发**。 |
| 会话在 `syncing` 期间 TriLC 崩溃 | 重启后 `syncStatus` 仍为 `syncing`；`syncSessionToTriMC('syncing')` 会被拒绝。需要手动重置或通过守护逻辑（Phase 2）将超时的 `syncing` 回退到 `pending`。 |
| TriMC 返回 `existingCloudSessionId` 与本地不一致 | 以 TriMC 返回的 `existingCloudSessionId` 为准，覆盖本地 `cloudSessionId`。TriMC 是 idempotency key 的唯一裁决者。 |
| `pending` 会话在 HTTP 调用前被删除 | `getSession()` 返回 `null`，引擎返回 `session_not_found`。 |

---

## 5. 重试退避算法规范

### 5.1 退避序列

```
attempt 0: 立即请求（无等待）
attempt 1: 等待 1000ms 后请求
attempt 2: 等待 2000ms 后请求
attempt 3: 不重试（3 次 backoff → 共 1+3=4 次 HTTP 调用）
```

使用显式数组 `[1000, 2000, 4000]` 而非 `Math.pow(2, attempt) * 1000`，原因：
- 消除 JS 浮点精度风险（`Math.pow(2,1)*1000` 可能为 `2000.0000000000002`）
- 显式数组让 dev 和 reviewer 一眼看清退避序列，无需心算
- 配置可 override（如 CI 环境可改为 `[500, 1000, 2000]`）

### 5.2 重试判断矩阵

| 错误类型 | 重试？ | 理由 |
|----------|--------|------|
| 网络错误（`fetch` 抛 `TypeError`） | ✅ 重试 | 临时网络抖动 |
| 超时（`AbortError`） | ✅ 重试 | 可能 TriMC 负载高，给喘息时间 |
| HTTP 500-599 | ✅ 重试 | 服务器临时故障 |
| HTTP 429 | ✅ 重试 | 限流，退避后重试 |
| HTTP 413 | ❌ 不重试 | Payload 过大，重试无意义 |
| HTTP 409 | ❌ 不重试 | 去重场景，由引擎处理为成功 |
| HTTP 400、401、403、404 | ❌ 不重试 | 客户端错误，重试无意义 |
| DNS 解析失败 | ✅ 重试 | 网络恢复后可能成功 |

### 5.3 与 TaskMirrorPusher 的差异

| 维度 | TaskMirrorPusher | SyncEngine |
|------|------------------|------------|
| 失败策略 | fire-and-forget，静默丢弃 | 重试 + error 状态 + 面板提示 |
| 超时 | 5s | 30s |
| 重试 | 无 | 1s/2s/4s，最多 3 次 |
| 幂等性 | 无 | (nodeId, localSessionId) 唯一索引 |
| 数据一致性 | 最终一致 | 强一致（sync_status 状态机） |

---

## 6. TriMC 端点契约实施约束

### 6.1 请求格式（TriLC 发送）

```
POST {trimcBaseUrl}/internal/v1/sessions/sync
Content-Type: application/json
```

Request body 见 `SyncRequestPayload` 类型定义（§2.1）。

**关键约束：**
- `nodeId` + `session.localSessionId` 组成幂等键（TriMC 侧建立唯一索引）
- `messages` 数组长度 ≤ 5000（TriLC 侧在组装时截断）
- 请求体不大于 10MB（Node.js fetch 默认无 body size limit，TriLC 侧不额外校验——10MB 约对应 50,000+ 条消息，5000 条截断已天然保证）

### 6.2 响应处理（TriLC 解析）

| HTTP 状态码 | Response Body | TriLC 行为 |
|-------------|---------------|-----------|
| 200 | `SyncSuccessResponse` | 标记 `synced`，记录 `cloudSessionId` |
| 409 | `SyncConflictResponse` | 去重：标记 `synced`，使用 `existingCloudSessionId` |
| 503 | `SyncUnavailableResponse` | 重试（1s/2s/4s），耗尽后标记 `error` |
| 5xx | `{ ok: false }` | 同上 |
| 4xx（非 409） | `{ ok: false }` | 不重试，直接标记 `error` |
| 非 JSON 响应 | — | 标记 `error`，记录原始响应文本 |

### 6.3 超时与取消

- 使用 `AbortSignal.timeout(30_000)`，Node 22 `fetch` 原生支持。
- 超时后 fetch Promise reject 为 `AbortError`（`DOMException`，`name === 'AbortError'`）。
- 重试逻辑将 `AbortError` 视作可重试错误（见 §5.2）。

### 6.4 用户触发路径

```
TriPilot 会话面板 → 用户点击 ☁️⬆ 按钮
  → POST /internal/v1/sessions/:id/sync (TriLC HTTP API, 待 Tray 实现时新增)
  → syncSessionToTriMC(sessionId, deps)
  → 返回 SyncResult → TriPilot 更新 UI（☁️✅ / ⚠️）
```

> **注**：TriLC HTTP API 端点（`POST /internal/v1/sessions/:id/sync`）不在本设计范围内，由 `arch-trilc-tray` 或后续 UI 工作树实现。本设计只负责 sync-engine 核心能力。

---

## 7. 测试规格

### 7.1 测试文件

`test/sync-engine.test.ts` — Node 原生 test runner (`node --import tsx --test`)

### 7.2 测试用例

| # | 场景 | 输入 | 期望 |
|---|------|------|------|
| T01 | 正常同步 | pending session + 10 messages | `syncStatus='synced'`, `cloudSessionId` 不为空 |
| T02 | 409 去重 | TriMC 返回 409 | `syncStatus='synced'`, 使用 `existingCloudSessionId` |
| T03 | 503 重试成功 | TriMC 第一次 503，第二次 200 | `syncStatus='synced'`, `retried=true` |
| T04 | 全部重试耗尽 | TriMC 持续 503 × 4 次 | `syncStatus='error'`, `ok=false` |
| T05 | sync_status='syncing' 拒绝 | 当前为 syncing | `error='already_syncing'`，状态不变 |
| T06 | sync_status='local' 跳过 | 当前为 local | `ok=true`, `syncedMessageCount=0` |
| T07 | sync_status='synced' 跳过 | 当前为 synced | `ok=true`，状态不变 |
| T08 | 消息超 5000 截断 | 6000 messages | payload 只含 5000 条，`truncated=true` |
| T09 | 空消息列表 | 0 messages | `syncStatus='synced'`，`syncedMessageCount=0` |
| T10 | 会话不存在 | 无效 sessionId | `error='session_not_found'` |
| T11 | 网络超时重试 | AbortError → 重试 → 成功 | `syncStatus='synced'`, `retried=true` |
| T12 | 不可重试 4xx（400） | TriMC 返回 400 | 不重试，直接 `syncStatus='error'` |
| T13 | 批量同步（3 pending） | 3 个 pending session | `total=3`, `synced=3`, `failed=0` |
| T14 | 批量同步（部分失败） | 2 OK + 1 503 耗尽 | `total=3`, `synced=2`, `failed=1` |
| T15 | error 状态手动重试 | 当前 error | 接受 → `syncing` → `synced` |
| T16 | toolCalls 字段反序列化 | tool_calls JSON 解析 | `toolCalls` 数组格式正确 |
| T17 | toolCalls 字段解析失败 | 损坏的 JSON | 静默跳过 toolCalls，不崩溃 |

### 7.3 Mock 策略

- 使用 Node 原生 `mock` 模块 (`node:test` 的 `mock.method`) 模拟 `fetch`。
- 模拟 `store` 使用内存实现（部分 session-store 的 SQLite 行为用 mock 替代以加速测试）。
- 不需要启动实际 HTTP server。

---

## 8. 实施顺序与依赖

```
1. src/sync/types.ts          # 无依赖，纯类型
2. src/sync/retry.ts          # 无依赖，纯函数
3. src/sync/payload-builder.ts # 依赖 types.ts + session-store/types.ts
4. src/sync/sync-engine.ts    # 依赖 1-3 + session-store
5. src/sync/index.ts          # 依赖 1-4
6. test/sync-engine.test.ts   # 依赖全部
```

---

## 9. 风险与缓解

| 风险 | 可能性 | 影响 | 缓解 |
|------|--------|------|------|
| TriMC `/internal/v1/sessions/sync` 端点未就绪 | 中 | sync 按钮 disabled，无数据损失 | 已在 §7.1 标注"Phase 1 占位"，TriLC 侧 engines 先交付，UI 按钮按端点状态 enable/disable |
| `syncing` 状态残留（崩溃） | 低 | 会话永久停留在 syncing，无法重试 | Phase 1 接受此风险；Phase 2 可在 `createSessionStore` 启动时扫描 `sync_status='syncing' AND updated_at < 1 hour ago` 批量重置为 `error` |
| 大消息量导致 payload 过大 | 低 | 5000 条截断已保底，10MB 天然不触发 | 5000 条 × ~1KB/条 ≈ 5MB，安全 |
| `fetchWithRetry` 在 Node 20 不兼容（无全局 `fetch`） | 低 | 编译/运行时报错 | TriLC `package.json` 已声明 `engines.node >= 20.0.0`；但 `AbortSignal.timeout()` 是 Node 22 特性。Node 20 用户需 polyfill 或升级。**如果 Node 20 兼容是硬要求，需改用 `setTimeout` + `AbortController` 手动实现超时**。 |
| `markPendingSync()` 调用遗漏 | 中 | 新消息不触发 pending，会话永不同步 | 不在本模块解决——由调用方（agentLoop 完成回调 / TriPilot 消息保存后）负责。sync-engine 只消费 pending 状态。 |

---

## 10. 决策三分

| 决策 | 判定 |
|------|------|
| sync-engine 核心规格 | `APPROVE` — 上游设计 §6-§7 清晰，session-store API 已完备 |
| Node 22 全局 fetch 使用 | `APPROVE` — TriLC 已声明 `engines.node >= 20.0.0`；如需 Node 20 兼容则降级为 `node:http`（与 mirror 一致），但当前假设 Node 22 |
| schema migration | `APPROVE` — 已在 arch-trilc-daemon 完成，无需变更 |
| 并发锁 | `FREEZE` — 当前单线程模型足够；Phase 2 若引入 Worker Threads 则需补数据库锁 |
| TriMC 端点就绪时间 | `ESCALATE` — 端点由 TriMC 团队负责，不在本工作树范围 |

---

## 11. 使用依据

- `arch-trilc-daemon/technical-design.md` §6（会话持久化，L398-497）、§7（云同步 API，L501-657）
- TriLC `src/session-store/store.ts`（L60-69 migration、L109-118 prepared statements、L292-313 sync API）
- TriLC `src/session-store/types.ts`（L10 SyncStatus、L12-27 SessionRecord v2 fields）
- TriLC `src/config/env.ts`（L28 nodeId、L33 trimcBaseUrl）
- `business-strategy-boundaries.md` L20-21（TriLC 本地主入口定位）
- `arch-trilc-sync/tree-op.json`（节点定义 + next_agent 路由）

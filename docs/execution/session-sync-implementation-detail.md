# Session 同步实现细节草案

> 为小狄准备的实现参考，加速技术方案收口

## 一、Current Session 状态管理

### 1.1 内存版本（推荐 MVP）

```typescript
// app.ts 顶部
let currentSessionId: string | null = null;

// 获取当前 session
function getCurrentSessionId(): string | null {
  return currentSessionId;
}

// 设置当前 session
function setCurrentSessionId(sessionId: string): void {
  currentSessionId = sessionId;
}

// 清除当前 session
function clearCurrentSessionId(): void {
  currentSessionId = null;
}
```

**优势**：
- 实现简单，无需持久化
- Daemon 重启后自然清空，符合"重启 = 新会话"心智

**劣势**：
- Daemon 重启后丢失，需要重新选择
- 两入口依赖 daemon 持续运行

### 1.2 持久化版本（未来增强）

```typescript
// sessions.db 新增表
CREATE TABLE current_session (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  updated_at TEXT NOT NULL
);

// 单行存储当前 session
INSERT OR REPLACE INTO current_session (id, session_id, updated_at)
VALUES (1, ?, datetime('now'));
```

**优势**：
- Daemon 重启后恢复
- 跨重启会话连续性

**劣势**：
- 需要处理并发写入
- 增加复杂性

## 二、POST /internal/v1/sessions/set-current 端点

### 2.1 端点设计

```typescript
// app.ts
if (req.url === '/internal/v1/sessions/set-current' && req.method === 'POST') {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf-8');

  let body: { sessionId?: string } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'invalid_json' }));
    return;
  }

  if (!body.sessionId) {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'sessionId is required' }));
    return;
  }

  // 验证 session 存在
  const session = sessionStore.getSession(body.sessionId);
  if (!session) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'session_not_found' }));
    return;
  }

  // 设置当前 session
  setCurrentSessionId(body.sessionId);

  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    ok: true,
    currentSessionId: body.sessionId,
  }));
  return;
}
```

### 2.2 GET /internal/v1/sessions/current（查询端点）

```typescript
if (req.url === '/internal/v1/sessions/current' && req.method === 'GET') {
  const currentId = getCurrentSessionId();

  if (!currentId) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      currentSessionId: null,
    }));
    return;
  }

  const session = sessionStore.getSession(currentId);
  if (!session) {
    // Session 不存在，清除 currentSessionId
    clearCurrentSessionId();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      currentSessionId: null,
    }));
    return;
  }

  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    ok: true,
    currentSessionId: currentId,
    session,
  }));
  return;
}
```

## 三、tasks/submit 支持可选 sessionId

### 3.1 请求体扩展

```typescript
// 原有请求体
{
  message: string;
  conversationId?: string;
  systemPrompt?: string;
  context?: { files?: string[]; workspaceRoot?: string };
}

// 扩展后
{
  message: string;
  conversationId?: string;
  systemPrompt?: string;
  context?: { files?: string[]; workspaceRoot?: string };
  sessionId?: string;  // 新增：复用已有 session
}
```

### 3.2 实现逻辑

```typescript
// app.ts tasks/submit 端点
if (req.url === '/internal/v1/tasks/submit' && req.method === 'POST') {
  // ... 解析请求体 ...

  let sessionId: string;
  if (body.sessionId) {
    // 复用已有 session
    const existing = sessionStore.getSession(body.sessionId);
    if (!existing) {
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'session_not_found' }));
      return;
    }
    sessionId = body.sessionId;
  } else {
    // 创建新 session
    sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    sessionStore.createSession({
      id: sessionId,
      model: body.model ?? 'tmv-deepseek-v4-pro',
      systemPrompt: defaultSystemPrompt(),
      cwd: env.cwd,
      title: body.title,
    });
  }

  // 设置为当前 session
  setCurrentSessionId(sessionId);

  // ... 其余逻辑不变 ...
}
```

## 四、cli.ts 启动时获取 current session

### 4.1 实现逻辑

```typescript
// cli.ts chat 模式启动
// Step 5: 从 daemon 获取 current session
let currentSessionId: string | undefined;
try {
  const fetchUrl = `http://127.0.0.1:${port}/internal/v1/sessions/current`;
  const res = await fetch(fetchUrl);
  const json = await res.json() as { ok: boolean; currentSessionId?: string | null; session?: any };
  if (json.ok && json.currentSessionId) {
    currentSessionId = json.currentSessionId;
    console.log(`[trilc] resuming current session ${currentSessionId}`);
  }
} catch (err) {
  console.warn('[trilc] failed to fetch current session:', (err as Error).message);
}

// 如果有 current session，复用 resume 逻辑
if (currentSessionId && !resume) {
  resume = currentSessionId;
}

// ... 原有 resume 逻辑 ...
```

## 五、Archived 状态实现

### 5.1 扩展 SessionStatus

```typescript
// session-store/types.ts
export type SessionStatus = 'active' | 'completed' | 'interrupted' | 'error' | 'expired' | 'archived';
```

### 5.2 updateSessionStatus 支持 archived

```typescript
// session-store/store.ts
function updateSessionStatus(id: string, status: SessionStatus): boolean {
  const result = db.prepare('UPDATE sessions SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
  return Number(result.changes) > 0;
}
```

### 5.3 init/reset 调用 archived

```typescript
// init-chain.ts reset 函数末尾
async reset(opts: { includeProject?: boolean; workspaceRoot?: string }): Promise<{
  chainState: 'selfcheck';
  cleared: string[];
}> {
  // ... 现有清理逻辑 ...

  // 新增：归档所有活跃 session
  try {
    const sessions = sessionStore.listSessions();
    for (const session of sessions) {
      if (session.status === 'active') {
        sessionStore.updateSessionStatus(session.id, 'archived');
        cleared.push(`session:${session.id}`);
      }
    }
  } catch (err) {
    console.warn('[trilc:init] failed to archive sessions:', (err as Error).message);
  }

  // ... 其余逻辑不变 ...
}
```

## 六、TriPilot 侧改动

### 6.1 首次连接使用 current session

```typescript
// TriPilot TriLCClient.ts
async submitTask(req, signal) {
  // 首次连接时，尝试获取 current session
  if (!this.hasCurrentSession) {
    try {
      const currentRes = await this.jsonRequest('GET', '/internal/v1/sessions/current', null, signal);
      if (currentRes.ok && currentRes.currentSessionId) {
        req.sessionId = currentRes.currentSessionId;
        this.hasCurrentSession = true;
      }
    } catch (err) {
      console.warn('[TriPilot] failed to fetch current session:', err);
    }
  }

  const body = JSON.stringify(req);
  return this.jsonRequest('POST', '/internal/v1/tasks/submit', body, signal);
}
```

### 6.2 会话切换 UI（P2 可选）

```typescript
// TriPilot 会话列表面板
// 1. 调用 GET /internal/v1/sessions 获取会话列表
// 2. 显示会话列表（排除 archived）
// 3. 用户点击切换 → 调用 POST /internal/v1/sessions/set-current
// 4. 后续提交任务自动使用新 session
```

## 七、单测覆盖要点

### 7.1 Current Session 状态

- `setCurrentSessionId()` / `getCurrentSessionId()` / `clearCurrentSessionId()`
- 并发访问竞争条件

### 7.2 set-current 端点

- 正常设置（session 存在）
- Session 不存在（404）
- 无效请求体（400）

### 7.3 tasks/submit 复用 session

- 有 sessionId → 复用已有 session
- 无 sessionId → 创建新 session
- Session 不存在（404）

### 7.4 Archived 状态

- `updateSessionStatus(id, 'archived')`
- Reset 后所有 active session 归档
- 会话列表过滤 archived

---

生成时间：2026-08-16
生成者：小贾（CEO 总助）
状态：技术实现草案，待小狄确认后收口到设计方案

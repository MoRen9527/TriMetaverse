# W30 架构修正技术设计方案

> **作者**：小狄（CTO）  
> **日期**：2026-07-19  
> **版本**：v1.0  
> **上游裁决**：CPO Q1-Q6（`trees/cpo-pc-layer-escalation/ruling.md`）  
> **相关偏差**：`trees/TWF-002/known-deviations.md`（D1-D7）

---

## 1. 范围与目标

### 1.1 修正范围

本方案将 W29 发现的架构偏差（D1-D7）在 W30 系统性消除，实现 CPO Q1-Q6 裁定的目标架构：

```
入口层（多入口）
├── TriPilot（IDE）──┐
├── CLI ────────────┤
│                    ├──→ TriLC（daemon，本地中枢编排器）
│                    │       ├── 研发任务 → TriCode + opencode
│                    │       └── 非研发任务 → TriLC 自有 agentLoop
│                    │
├── TriMobile ──────┤       │  ▲
└── TriAvatar ──────┘       │  │ mirror
                 │          │  │
                 ▼          │  │
            TriMC ◄─────────┘  │
          （云端任务状态中心）   │
                 ▲              │
                 └── TriLC 上报 ┘
```

### 1.2 不变项

- VSCodium 打包流程不变
- TriLC daemon 核心（`submitTask()`, `TaskRuntime`）不变——**已就位**
- TriCode adapter registry（opencode/claude code/codex）不变
- TWF-001 崩溃 fallback（TriPilot→TriMC 路径）不变

### 1.3 改动范围

| 模块 | 改动类型 | 预估工作量 |
|------|---------|-----------|
| **TriPilot** | 重构（移除 + 新增） | 主要：extension.ts 工具执行路径重写 |
| **TriLC** | 扩展（新增端点 + daemon 增强） | 中等：5 端点 + 状态事件系统 |
| **TriCode** | 接口改造（面向调用方调整） | 轻量：新 export + CLI 模式 |
| **TriMC** | 新增（镜像端点 + 查询端点） | 轻量：2 端点 |

---

## 2. TriPilot 重构方案

### 2.1 移除清单

| 文件/区域 | 移除内容 | 理由 |
|-----------|---------|------|
| `extension.ts` L5884-6027 | `runTrilcDirectRequest()` 函数 | 包含直连 Anthropic SSE + 本地 `executeToolCall()` |
| `extension.ts` L5995 | `executeToolCall()` 调用 | 工具执行全部委托 TriLC |
| `extension.ts` tool registry | 本地工具白名单/注册逻辑 | 工具管理移至 TriLC tool bus |
| `src/tricodeBridge.ts` | 整文件 | TriPilot 不直接感知 TriCode（Q3） |
| API Key 持有 | `extension.ts` 中任何 environment/model key | Q2：TriPilot 零 API Key |

### 2.2 新增清单

| 组件 | 职责 | 协议 |
|------|------|------|
| `TriLCClient` | 统一的 TriLC HTTP+SSE 客户端 | 见 §3 |
| 自动重连逻辑 | IDE 启动→检测 daemon→`GET /sessions`→自动重连活跃会话 | Q4 |
| 会话列表 UI | 四色状态（🟢运行中/✅完成/❌失败/⏹️已取消） | Q4 |
| TriLC 状态指示器 | daemon 在线/离线/fallback TriMC | Q4 |
| 工具执行进度展示 | 接收 SSE 推送的 `tool_call` 事件，展示进度 | Q2 SSE |

### 2.3 重构后的数据流

```
用户输入消息
    │
    ▼
TriPilot webview
    │ POST /internal/v1/tasks/submit  { message, conversationId, context }
    ▼
TriLC daemon
    │ ① 判断是否为研发任务
    ├── 是 → TriCode.executeCodeTask()
    │         └── opencode → 返回结果
    │
    └── 否 → LocalRuntimeDaemon.submitTask()
              └── planner → agentLoop → 工具调用
    │
    ▼ (SSE stream)
    event: delta        → { content: "..." }
    event: tool_use     → { toolName, input }
    event: tool_result  → { toolName, output }
    event: task_done    → { status, summary }
    │
    ▼
TriPilot webview (只展示，零执行)
```

---

## 3. TriLC 协议扩展 — API 契约

### 3.1 端点清单

| # | 方法 | 路径 | 新增/已有 | 优先级 |
|---|------|------|----------|--------|
| ① | POST | `/internal/v1/tasks/submit` | **新增** | W30 P0 |
| ② | SSE | `/internal/v1/sessions/{id}/stream` | **新增** | W30 P0 |
| ③ | GET | `/internal/v1/sessions` | **新增** | W30 P1 |
| ④ | POST | `/internal/v1/sessions/{id}/cancel` | **新增** | W30 P1 |
| ⑤ | POST | `/internal/v1/sessions/recover` | ✅ 已有 | W30 P0（已就位） |
| ⑥ | POST | `/internal/v1/tasks/mirror` | **新增**（Q6） | W30 P1 |

### 3.2 端点详细规格

#### ① POST /internal/v1/tasks/submit

提交用户意图，返回 daemon 会话 ID + SSE 流端点。

**Request**:
```json
{
  "message": "帮我重构 TriPilot 的工具执行路径",
  "conversationId": "conv-abc123",
  "systemPrompt": "You are a coding assistant...",
  "context": {
    "files": ["src/extension.ts"],
    "workspaceRoot": "/path/to/TriPilot"
  }
}
```

**Response**: `201 Created`
```json
{
  "sessionId": "sess-xyz789",
  "streamEndpoint": "/internal/v1/sessions/sess-xyz789/stream",
  "status": "running"
}
```

**错误**:
- `400` — message 为空
- `503` — daemon 未就绪或所有 agent slot 已满

#### ② SSE GET /internal/v1/sessions/{id}/stream

实时推送 LLM 输出 + 工具调用状态。复用现有 Anthropic SSE 流模式，TriLC 转发 + 注入 `tool_use`/`tool_result` 事件。

**事件类型**:

| 事件 | 示例 | 说明 |
|------|------|------|
| `delta` | `{"content": "好的，让我先看一下..."}` | LLM 文本输出 |
| `tool_use` | `{"toolName": "read_file", "input": {"path": "src/extension.ts"}}` | TriLC 即将调用工具 |
| `tool_result` | `{"toolName": "read_file", "output": "import * as vscode...", "durationMs": 45}` | 工具调用完成 |
| `task_progress` | `{"step": 2, "totalSteps": 6, "description": "正在读取文件"}` | 任务进度（可选） |
| `task_done` | `{"status": "success", "summary": "重构完成，修改 3 个文件"}` | 任务结束 |
| `task_error` | `{"status": "failed", "error": "opencode 未安装"}` | 任务失败 |

**认证**：本地 localhost，无认证需求（127.0.0.1 绑定）。

#### ③ GET /internal/v1/sessions

**Query**: `?status=running&limit=20`

**Response**:
```json
{
  "sessions": [
    {
      "id": "sess-xyz789",
      "title": "重构 TriPilot 工具执行路径",
      "status": "running",
      "progress": { "step": 3, "totalSteps": 6, "description": "正在分析 extension.ts" },
      "createdAt": "2026-07-20T10:00:00+08:00",
      "updatedAt": "2026-07-20T10:02:30+08:00"
    },
    {
      "id": "sess-abc123",
      "title": "修复 TriLC 启动超时",
      "status": "done",
      "completedAt": "2026-07-20T09:45:00+08:00"
    }
  ],
  "total": 2
}
```

#### ④ POST /internal/v1/sessions/{id}/cancel

**Response**:
```json
{
  "ok": true,
  "sessionId": "sess-xyz789",
  "status": "cancelled"
}
```

**错误**: `404` — 会话不存在或已结束

#### ⑥ POST /internal/v1/tasks/mirror（Q6, TriLC → TriMC）

TriLC daemon 向 TriMC 上报本地任务状态快照。

**Request**:
```json
{
  "nodeId": "trilc-win-jedih",
  "tasks": [
    {
      "taskId": "sess-xyz789",
      "title": "重构 TriPilot 工具执行路径",
      "status": "running",
      "summary": "正在分析 extension.ts，步骤 3/6",
      "updatedAt": "2026-07-20T10:02:30+08:00"
    }
  ]
}
```

**Response**: `200 OK`
```json
{
  "ok": true,
  "mirrored": 1
}
```

**调用方式**: 事件驱动（状态变更时立即推送）+ 30s 心跳兜底。

---

## 4. TriCode 接口改造

### 4.1 当前状态

`@trimetaverse/tricode` 导出 `executeCodeTask(req)` 面向 CLI 调用（`tricodeBridge.ts`）。模块文档标注为"TriPilot 插件与 opencode 的 glue 层"。

### 4.2 改造目标

| 维度 | 当前 | 目标 |
|------|------|------|
| **调用方** | CLI（tricodeBridge.ts） | **TriLC daemon** |
| **包导出** | `executeCodeTask`, `listAvailableTools`, `getToolStatus` | 增加 `executeCodeTaskAsChild(detached)` |
| **子进程管理** | 无（调用方管理） | TriLC daemon 通过 `ProcessSupervisor` 管理 |
| **CLI 模式** | 独立 CLI 命令 | 保留 CLI 模式作为 fallback + 调试入口 |
| **public API** | 全部公开 | adapter registry 改为内部（Q3），只暴露 `executeCodeTask()` |

### 4.3 新增导出

```typescript
// 供 TriLC daemon 调用：以 detached 子进程方式运行
export async function executeCodeTaskDetached(
  req: CodeTaskRequest
): Promise<{ processId: string; streamEndpoint: string }>;

// 取消 detached 任务
export async function cancelCodeTask(processId: string): Promise<boolean>;
```

### 4.4 变更文件

| 文件 | 变更 |
|------|------|
| `src/index.ts` | 新增 `executeCodeTaskDetached`, `cancelCodeTask` |
| `src/tricodeBridge.ts` | **删除**（或改为 TriLC 侧 `src/code-runner.ts`） |
| `package.json` | description 从"VSCode bridge"改为"TriLC code adapter" |

---

## 5. 实施顺序

| 步骤 | 内容 | 依赖 | 验证方式 |
|------|------|------|---------|
| **S1** | TriLC 新增 ⑤ `/sessions/recover` 端点验证（已有，验证回归） | — | 已有 endpoint 测试 |
| **S2** | TriLC 新增 ① `POST /tasks/submit` + ② SSE `/sessions/{id}/stream` | S1 | curl + SSE 手动验证 |
| **S3** | TriPilot 移除 `executeToolCall()` + `runTrilcDirectRequest()`，新增 `TriLCClient` | S2 | TriPilot webview → TriLC 端到端 |
| **S4** | TriLC 新增 ③ `GET /sessions` + ④ `POST /sessions/{id}/cancel` | S2 | curl 验证 |
| **S5** | TriPilot 新增自动重连 + 会话列表四色 UI | S3+S4 | 关闭/重开 IDE 测试 |
| **S6** | TriCode 接口改造（面向 TriLC）+ TriLC daemon 集成 `executeCodeTaskDetached()` | S3 | TriLC → TriCode → opencode 链路 |
| **S7** | TriMC 新增 ⑥ `/tasks/mirror` + `GET /tasks`（Q6 P1） | S2 | curl + 移动端查询手动验证 |
| **S8** | TriCade 重新打包 + 偏差清单逐项关闭回归 | S1-S7 | 偏差 D1-D7 全部验证通过 |

---

## 6. 测试门禁

### 单元测试

| 模块 | 目标 | 关键测试 |
|------|------|---------|
| TriLC | 新增端点处理逻辑 | tasks/submit parse + validation, sessions list/filter, mirror payload build |
| TriPilot | TriLCClient 协议解析 | SSE event 解析（delta/tool_use/tool_result/task_done），HTTP 错误处理 |
| TriCode | detached 子进程管理 | executeCodeTaskDetached spawn + cancel, adapter selector unchanged |
| TriMC | mirror endpoint | POST /tasks/mirror payload validate, GET /tasks filter |

### 集成测试

| 场景 | 验证 |
|------|------|
| TriPilot → TriLC → LLM | 发送消息 → 获取流式响应 → 展示在 webview |
| TriPilot → TriLC → TriCode → opencode | 研发任务 → TriLC 判断 → TriCode 调用 opencode → 返回结果 |
| IDE 关闭/重开 | 关闭 IDE → 任务继续运行 → 重开 IDE → 自动重连 → 查看到进度 |
| TriLC 离线 → fallback | 关闭 TriLC → TriPilot 检测离线 → 显示 TWF-001 fallback 到 TriMC |
| 跨节点状态 | PC 提交任务 → TriLC 上报 TriMC → TriMobile 查询看到任务 |

### E2E 回归 (TriCade)

- MSI 打包后可安装
- TriPilot 扩展在 VSCodium 中可加载
- 聊天 UI 可输入+展示流式输出
- 已知偏差 D1-D7 逐项验证关闭

---

## 7. 风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| TriPilot 重构后 TriLC 不可用 | 中 | 用户无 LLM 能力 | TWF-001 fallback 路径保留不变（TriPilot→TriMC），作为回退 |
| SSE 协议复杂度过高 | 低 | 实现工期膨胀 | 复用现有 Anthropic SSE 解析器 + 注入事件，不从头造 |
| TriCode detached 模式 spawn 失败 | 中 | 研发任务不可用 | CLI 模式保留为 fallback；daemon 日志详细记录 spawn 错误 |
| 会话恢复数据不一致 | 低 | 用户看到过期状态 | 每次重连时全量查询 daemon 当前 Tasks map，不做增量 diff |
| TriLC→TriMC mirror 网络故障 | 中 | 移动端看到离线状态 | 离线时标记 unknown，心跳恢复后全量推送；不影响本地功能 |

---

## 8. 交付物清单

| # | 交付物 | 路径 | 优先级 |
|---|--------|------|--------|
| **D1** | TriCade 已知偏差清单 | `trees/TWF-002/known-deviations.md` | W29 P0 ✅ |
| **D2** | 本技术设计文档 | 本文件 | W29 P1 ✅ |
| **D3** | TriLC 5 端点实现 | `TriLC/src/server/app.ts` | W30 P0 |
| **D4** | TriPilot `TriLCClient` + 重构代码 | `TriPilot/src/` | W30 P0 |
| **D5** | TriCode 接口改造 | `TriCode/src/index.ts` | W30 P0 |
| **D6** | TriMC mirror + query 端点 | `TriMC/src/server/` | W30 P1 |
| **D7** | 偏差 D1-D7 关闭报告 | `trees/TWF-002/deviation-closeout.md` | W30 P2 |
| **D8** | 架构文档修正（§4 L66-70 更新） | `docs/三元宇宙架构与模块说明.md` | W30 P2 |

---

**设计完成时间**：2026-07-19  
**下一步**：S1 开工——TriLC `/tasks/submit` + SSE `/sessions/{id}/stream` 端点实现  
**追踪**：小贾纳入 OP JSON + W30 操作计划

# W30 架构修正 — 测试策略

> **作者**：小柯（TestEngineer）  
> **日期**：2026-07-19  
> **版本**：v1.0  
> **上游设计**：`trees/cpo-pc-layer-escalation/w30-architecture-fix-design.md` §6  
> **上游裁决**：`trees/cpo-pc-layer-escalation/ruling.md`（CPO Q1-Q6）  
> **偏差清单**：`trees/TWF-002/known-deviations.md`（D1-D7）  
> **实施序列**：S1-S8（设计文档 §5）

---

## 0. 前置核查摘要

| 核查项 | 文件 | 发现 |
|--------|------|------|
| 工作路径 | — | ✅ `trees/TWF-002/` |
| CEO 输入 | CPO 升级简报 | CEO 意图：TriLC 唯一中枢、TriPilot 零执行、TriCode 为 TriLC 子工具 |
| BusinessStrategy | `business-strategy-evolution-log.md` L55-68 | 2026-07-17：TriLC 升级为"本地人机协作主入口" |
| 设计文档 | `w30-architecture-fix-design.md` | S1-S8 序列、5 端点契约、测试门禁已定义 |
| 偏差清单 | `known-deviations.md` | D1-D7 逐项登记，W30 修正目标明确 |
| 代码现状 | TriLC app.ts / TriPilot extension.ts / TriCode index.ts | §0.1 基线快照 |

### 0.1 代码基线快照（Phase A 启动时）

| 模块 | 文件 | 关键现状 |
|------|------|---------|
| **TriLC** | `src/server/app.ts` | `POST /internal/v1/sessions/recover` ✅ 已有；`GET /internal/v1/sessions` ✅ 已有；`POST /internal/v1/agent` ✅ 已有；`POST /tasks/submit` ❌ 缺失；SSE `/sessions/{id}/stream` ❌ 缺失；`POST /sessions/{id}/cancel` ❌ 缺失 |
| **TriLC** | `src/runtime/daemon.ts` | `submitTask()`, `TaskRuntime`, `executeStep()` 已就位；daemon tasks Map 可用 |
| **TriPilot** | `src/extension.ts` | `executeToolCall()` L5992-6005 本地执行（D1）；`runTrilcDirectRequest()` L5884 直连 Anthropic SSE（D6）；工具调用在 VS Code 扩展进程内 |
| **TriPilot** | `src/tricodeBridge.ts` | 完整文件存在，import `@trimetaverse/tricode`（D4） |
| **TriCode** | `src/index.ts` | `executeCodeTask()`, `listAvailableTools()`, `getToolStatus()` 已导出；无 detached 模式 |
| **TriMC** | `src/server/app.ts` | `POST /chat`、`GET /healthz`、`GET /hello` 存在；无 `/tasks/mirror`、无 `/tasks` GET（D7） |

### 0.2 设计文档端点 vs 实现现状对照

| # | 设计端点 | TriLC 现状 | 优先级 |
|---|---------|-----------|--------|
| ① | `POST /internal/v1/tasks/submit` | ❌ 需新增 | W30 P0 |
| ② | SSE `/internal/v1/sessions/{id}/stream` | ❌ 需新增 | W30 P0 |
| ③ | `GET /internal/v1/sessions` | ✅ 已就位（需验证与设计一致） | W30 P1 |
| ④ | `POST /internal/v1/sessions/{id}/cancel` | ❌ 需新增 | W30 P1 |
| ⑤ | `POST /internal/v1/sessions/recover` | ✅ 已就位 | W30 P0 |
| ⑥ | `POST /internal/v1/tasks/mirror` | ❌ 需新增（TriLC→TriMC） | W30 P1 |

---

## 1. 测试范围与策略总览

### 1.1 测试分层

```
┌─────────────────────────────────────────────┐
│ E2E 回归 (TriCade)                           │
│  MSI 打包 → 安装 → 扩展加载 → 聊天 UI       │
├─────────────────────────────────────────────┤
│ 集成测试                                      │
│  5 条端到端链路 + 异常路径                    │
├─────────────────────────────────────────────┤
│ 单元测试                                      │
│  TriLC 端点 × 4、TriPilot TriLCClient × 3     │
│  TriCode detached × 2、TriMC mirror × 2      │
├─────────────────────────────────────────────┤
│ 偏差关闭验证                                   │
│  D1-D7 逐项代码审查 + 行为验证                │
└─────────────────────────────────────────────┘
```

### 1.2 测试执行时机

| 阶段 | 触发条件 | 执行内容 |
|------|---------|---------|
| **S1-S7 每步** | 小全完成对应实施步骤 | 该步骤的单元测试 + 手工冒烟 |
| **S8（最终）** | S1-S7 全部完成 | 全部集成测试 + E2E 回归 + D1-D7 偏差关闭 |
| **门禁** | CTO 要求放行前 | 全量回归，输出 `PASS / CONDITIONAL_PASS / FAIL` |

### 1.3 测试环境要求

| 环境要素 | 要求 |
|---------|------|
| **TriLC daemon** | 本地运行，端口默认 11434 |
| **TriPilot** | VSCodium 中加载，连接本地 TriLC |
| **TriCode** | opencode CLI 已安装且可用 |
| **TriMC** | 云端运行，TriLC 可网络可达 |
| **网络** | TriPilot↔TriLC 走 127.0.0.1；TriLC↔TriMC 走公网 |

---

## 2. 单元测试用例

### 2.1 TriLC 端点测试

#### UT-TLC-001: POST /internal/v1/tasks/submit — 正常提交

| 维度 | 内容 |
|------|------|
| **前置** | TriLC daemon 运行中；S2 实施完成 |
| **输入** | `{"message": "hello", "conversationId": "test-001", "context": {"workspaceRoot": "/tmp/test"}}` |
| **预期输出** | HTTP 201；body 含 `sessionId`、`streamEndpoint`、`status: "running"` |
| **验证点** | `sessionId` 格式非空字符串；`streamEndpoint` 为 `/internal/v1/sessions/{id}/stream`；daemon tasks Map 中可查到该 sessionId |

#### UT-TLC-002: POST /internal/v1/tasks/submit — message 为空

| 维度 | 内容 |
|------|------|
| **前置** | TriLC daemon 运行中 |
| **输入** | `{"message": "", "conversationId": "test-002"}` |
| **预期输出** | HTTP 400；body 含 error 信息 |
| **验证点** | 不创建 session；daemon tasks Map 无新增 |

#### UT-TLC-003: POST /internal/v1/tasks/submit — daemon 未就绪

| 维度 | 内容 |
|------|------|
| **前置** | TriLC 启动但 daemon 未调用 start() |
| **输入** | 正常 submit payload |
| **预期输出** | HTTP 503；body 含 daemon 不可用信息 |

#### UT-TLC-004: GET /internal/v1/sessions — 空列表

| 维度 | 内容 |
|------|------|
| **前置** | S4 完成（端点③ 规范化）；无活跃会话 |
| **输入** | `GET /internal/v1/sessions` |
| **预期输出** | HTTP 200；`{"ok": true, "count": 0, "sessions": []}` |

#### UT-TLC-005: GET /internal/v1/sessions — 按状态过滤

| 维度 | 内容 |
|------|------|
| **前置** | 至少有一个 running 和一个 completed 会话 |
| **输入** | `GET /internal/v1/sessions?status=running` |
| **预期输出** | HTTP 200；返回的 sessions 全部 status=running；不包括 completed 会话 |

#### UT-TLC-006: POST /internal/v1/sessions/{id}/cancel — 取消运行中任务

| 维度 | 内容 |
|------|------|
| **前置** | 存在运行中的 session |
| **输入** | `POST /internal/v1/sessions/{sessionId}/cancel` |
| **预期输出** | HTTP 200；`{"ok": true, "sessionId": "...", "status": "cancelled"}`；daemon 中该 task 状态变为 cancelled |

#### UT-TLC-007: POST /internal/v1/sessions/{id}/cancel — 会话不存在

| 维度 | 内容 |
|------|------|
| **前置** | 无此 sessionId |
| **输入** | `POST /internal/v1/sessions/nonexistent/cancel` |
| **预期输出** | HTTP 404 |

#### UT-TLC-008: POST /internal/v1/sessions/recover — 回归验证

| 维度 | 内容 |
|------|------|
| **前置** | 至少有一个 interrupted 会话（已有端点） |
| **输入** | `POST /internal/v1/sessions/recover`（空 body） |
| **预期输出** | HTTP 200；返回最近 interrupted session |
| **说明** | **回归测试**——此端点已有，W30 不应破坏 |

#### UT-TLC-009: SSE /internal/v1/sessions/{id}/stream — 事件类型覆盖

| 维度 | 内容 |
|------|------|
| **前置** | submit 一个 task 后获取 streamEndpoint |
| **输入** | `GET /internal/v1/sessions/{sessionId}/stream`（SSE 连接） |
| **预期输出** | 依次收到 `delta` →（可选 `tool_use` → `tool_result`）→ `task_done` 或 `task_error` |
| **验证点** | 每个 event 的 `data` 为合法 JSON；`task_done` 中 `status` 为 `"success"` 或 `"failed"` |

#### UT-TLC-010: POST /internal/v1/tasks/mirror — Payload 构造

| 维度 | 内容 |
|------|------|
| **前置** | S7 完成；TriLC 有 running task |
| **输入** | TriLC 自动调用 `POST /internal/v1/tasks/mirror`（事件驱动 + 心跳） |
| **预期输出** | HTTP 200；`{"ok": true, "mirrored": N}` |
| **验证点** | body 含 `nodeId`、`tasks[]`（每个 task 含 taskId/title/status/summary/updatedAt） |

---

### 2.2 TriPilot TriLCClient 测试

#### UT-TPT-001: TriLCClient 提交任务 — 正常响应解析

| 维度 | 内容 |
|------|------|
| **前置** | S3 完成；TriLCClient 已实现 |
| **输入** | mock HTTP 201 + body `{"sessionId": "sess-test", "streamEndpoint": "...", "status": "running"}` |
| **预期输出** | 解析成功，返回 `{ sessionId, streamEndpoint, status }` |
| **验证点** | 字段类型正确；streamEndpoint 提取正确 |

#### UT-TPT-002: TriLCClient SSE 事件解析

| 维度 | 内容 |
|------|------|
| **前置** | S3 完成 |
| **输入** | 模拟 SSE 流：`event: delta\ndata: {"content":"hello"}\n\n` `event: tool_use\ndata: {"toolName":"read_file",...}\n\n` `event: task_done\ndata: {"status":"success",...}\n\n` |
| **预期输出** | 依次回调 `onDelta("hello")`, `onToolUse({toolName:"read_file",...})`, `onTaskDone("success")` |
| **验证点** | 三种事件类型全部解析正确；delta 内容完整 |

#### UT-TPT-003: TriLCClient HTTP 错误处理

| 维度 | 内容 |
|------|------|
| **前置** | S3 完成 |
| **输入** | mock HTTP 400、503、连接拒绝 |
| **预期输出** | 对应抛出带类型信息的错误（400→BadRequest, 503→ServiceUnavailable, ECONNREFUSED→ConnectionError） |
| **验证点** | 错误类型可区分；错误信息包含原始状态码 |

---

### 2.3 TriCode detached 模式测试

#### UT-TCD-001: executeCodeTaskDetached — 正常 spawn

| 维度 | 内容 |
|------|------|
| **前置** | S6 完成；opencode 已安装 |
| **输入** | `executeCodeTaskDetached({ prompt: "say hello", cwd: "/tmp" })` |
| **预期输出** | 返回 `{ processId: string, streamEndpoint: string }`；子进程正在运行 |
| **验证点** | processId 可追踪；streamEndpoint 可连接 |

#### UT-TCD-002: cancelCodeTask — 取消 detached 任务

| 维度 | 内容 |
|------|------|
| **前置** | 有正在运行的 detached 任务 |
| **输入** | `cancelCodeTask(processId)` |
| **预期输出** | `true`；子进程已终止；streamEndpoint 不再推送事件 |

---

### 2.4 TriMC mirror 端点测试

#### UT-TMC-001: POST /internal/v1/tasks/mirror — 正常镜像

| 维度 | 内容 |
|------|------|
| **前置** | S7 完成；TriMC 运行中 |
| **输入** | `{"nodeId": "trilc-test", "tasks": [{"taskId": "t1", "title": "test", "status": "running", "summary": "...", "updatedAt": "2026-07-20T10:00:00+08:00"}]}` |
| **预期输出** | HTTP 200；`{"ok": true, "mirrored": 1}` |

#### UT-TMC-002: GET /tasks — 查询镜像任务

| 维度 | 内容 |
|------|------|
| **前置** | 已 mirror 至少一个 task |
| **输入** | `GET /tasks?nodeId=trilc-test` |
| **预期输出** | HTTP 200；返回该 node 的所有镜像任务 |

---

## 3. 集成测试用例

### 3.1 INT-001: TriPilot → TriLC → LLM streaming → webview

| 维度 | 内容 |
|------|------|
| **前置** | S1-S3 完成；TriPilot 加载 TriLCClient |
| **步骤** | ① 在 TriPilot webview 中输入"你好，请介绍一下自己" ② 观察 webview 展示 |
| **预期** | 消息发送成功（HTTP 201）；webview 实时展示流式 LLM 输出（delta 事件）；最终显示 task_done |
| **验证点** | 无本地 LLM 调用；全程通过 TriLC 代理；webview 零执行能力 |
| **门禁** | **阻塞性** — 不通过则整体 FAIL |

### 3.2 INT-002: TriPilot → TriLC → TriCode → opencode 研发链路

| 维度 | 内容 |
|------|------|
| **前置** | S3+S6 完成；opencode 已安装；TriLC daemon 集成了 executeCodeTaskDetached |
| **步骤** | ① 在 TriPilot 中输入"帮我读取当前项目的 package.json 并总结依赖" ② 等待响应 |
| **预期** | TriLC 判断为研发任务 → 调用 TriCode detached → opencode 执行 → 结果通过 SSE 返回 TriPilot webview |
| **验证点** | TriPilot 无直接 TriCode 引用；`tricodeBridge.ts` 已移除；链路经过 TriLC→TriCode |
| **门禁** | **阻塞性** — 不通过则整体 FAIL |

### 3.3 INT-003: IDE 关闭/重开 → 任务继续 → 自动重连

| 维度 | 内容 |
|------|------|
| **前置** | S4+S5 完成；TriLC daemon 运行中 |
| **步骤** | ① 在 TriPilot 中启动一个长任务（如"每 10 秒输出一次时间戳，共 5 次"） ② 等待第 2 次输出后关闭 VSCodium ③ 重新打开 VSCodium ④ 观察会话列表 |
| **预期** | 关闭 IDE 后 daemon 中 task 仍在 running；重开后自动展示四色状态列表；正在运行的会话自动重连，显示实时进度 |
| **验证点** | daemon tasks Map 中 task 不受 IDE 关闭影响；GET /sessions 返回 running 状态；SSE 自动重连成功 |
| **门禁** | **阻塞性** — D2+D5 的关闭验证 |

### 3.4 INT-004: TriLC 离线 → TriPilot fallback 到 TriMC

| 维度 | 内容 |
|------|------|
| **前置** | S5 完成；TWF-001 fallback 路径保留；TriMC 在线 |
| **步骤** | ① 确认 TriPilot 连接 TriLC 正常 ② 手动关闭 TriLC daemon ③ 在 TriPilot 中发送消息 ④ 观察 fallback 行为 |
| **预期** | TriPilot 检测到 TriLC 离线 → 状态指示器显示离线 → fallback 到 TriMC（TWF-001 路径）→ 消息通过 TriMC 返回 |
| **验证点** | 不崩溃、不卡死；fallback 路径可用；TriLC 恢复后自动切回 |
| **门禁** | **非阻塞** — 降级路径验证 |

### 3.5 INT-005: TriLC → TriMC mirror → TriMobile 查询

| 维度 | 内容 |
|------|------|
| **前置** | S7 完成；TriMC mirror 端点可用；TriMobile 可查询 |
| **步骤** | ① TriPilot 提交任务 → TriLC 处理 ② TriLC 上报 TriMC（POST /internal/v1/tasks/mirror） ③ 从 TriMobile 查询 PC 节点任务（GET /tasks） |
| **预期** | TriMC 收到镜像数据；TriMobile 可看到任务状态（四色） |
| **验证点** | mirror payload 完整；状态更新实时（事件驱动 + 30s 兜底） |
| **门禁** | **非阻塞（W30 P1）** |

---

## 4. 偏差关闭验证（D1-D7）

### 4.1 验证方法总览

| 偏差 | 验证类型 | 核心方法 | Pass 标准 |
|------|---------|---------|-----------|
| D1 本地工具执行 | 代码审查 | `grep executeToolCall TriPilot/src/extension.ts` | 零命中 |
| D2 IDE关闭=任务终止 | 行为测试 | INT-003 | daemon 中 task 不受 IDE 关闭影响 |
| D3 协议仅LLM | 端点测试 | `curl` 全部 5 端点 | ①②③④⑤ 全部可调用 |
| D4 TriCode直接依赖 | 代码审查 | `grep -r tricode TriPilot/src/`（排除 TriLCClient 正常引用） | 零 `@trimetaverse/tricode` import；零 `tricodeBridge.ts` |
| D5 无自动重连 | 行为测试 | INT-003 后半段 | 会话列表自动出现；活跃会话自动重连 |
| D6 API Key持有 | 代码审查 | `grep -E "ANTHROPIC|apiKey|API_KEY" TriPilot/src/extension.ts` | 零 hardcoded key；runTrilcDirectRequest 已移除 |
| D7 无跨节点同步 | 端点测试 | INT-005 | TriMC 可查询到 PC 节点任务 |

### 4.2 D1 详细验证步骤

```
# Step 1: 在 extension.ts 中搜索 executeToolCall
grep -n "executeToolCall" TriPilot/src/extension.ts

# Step 2: 验证函数定义已移除
# 预期: L9192 的 async function executeToolCall() 不存在

# Step 3: 验证调用点已移除
# 预期: L5995 的 result = await executeToolCall() 不存在

# Step 4: 扩展验证——搜索 extension.ts 中所有工具函数调用
grep -n "executeToolCall\|run_in_terminal\|apply_patch\|run_tests\|run_task" TriPilot/src/extension.ts
# 预期: 全部移除或改为通过 TriLCClient 委托
```

### 4.3 D4 详细验证步骤

```
# Step 1: 确认 tricodeBridge.ts 已删除
test ! -f TriPilot/src/tricodeBridge.ts || echo "FAIL: tricodeBridge.ts still exists"

# Step 2: 确认 TriPilot 无 @trimetaverse/tricode 直接引用
grep -r "@trimetaverse/tricode" TriPilot/src/ --include="*.ts"
# 预期: 零命中（TriLCClient 不引用 TriCode）

# Step 3: 确认 tripilot-cli.ts 不再引用 tricodeBridge
grep "tricodeBridge" TriPilot/src/cli/tripilot-cli.ts
# 预期: 零命中
```

### 4.4 D6 详细验证步骤

```
# Step 1: 搜索 extension.ts 中的 API key 模式
grep -n -E "(ANTHROPIC|apiKey|API_KEY|api-key|x-api-key)" TriPilot/src/extension.ts

# Step 2: 验证 runTrilcDirectRequest 已移除
grep -n "runTrilcDirectRequest" TriPilot/src/extension.ts
# 预期: 零命中

# Step 3: 验证 trilcClient.streamChat 直连已移除
grep -n "trilcClient.streamChat" TriPilot/src/extension.ts
# 预期: 零命中
```

---

## 5. E2E 回归测试（TriCade）

### 5.1 E2E-001: MSI 打包可安装

| 维度 | 内容 |
|------|------|
| **前置** | S8 TriCade 重新打包完成 |
| **步骤** | ① 运行 MSI 打包脚本 ② 在 Windows 上安装 MSI ③ 检查安装目录 |
| **预期** | MSI 打包成功；安装无报错；VSCodium 可启动 |
| **门禁** | **阻塞性** |

### 5.2 E2E-002: TriPilot 扩展可加载

| 维度 | 内容 |
|------|------|
| **前置** | E2E-001 通过 |
| **步骤** | ① 启动 VSCodium ② 查看扩展面板 ③ 确认 TriPilot 扩展已激活 |
| **预期** | TriPilot 扩展显示为已激活；无加载错误；状态栏显示 TriLC 连接指示器 |
| **门禁** | **阻塞性** |

### 5.3 E2E-003: 聊天 UI 正常

| 维度 | 内容 |
|------|------|
| **前置** | E2E-002 通过；TriLC daemon 运行中 |
| **步骤** | ① 打开 TriPilot 聊天面板 ② 输入消息 ③ 观察流式输出 |
| **预期** | 聊天 UI 可输入；流式输出正常展示；工具调用进度显示（如有）；四色状态会话列表可见 |
| **门禁** | **阻塞性** |

### 5.4 E2E-004: 偏差 D1-D7 全量关闭

| 维度 | 内容 |
|------|------|
| **前置** | S1-S7 全部完成 |
| **步骤** | 按 §4 逐项执行 D1-D7 关闭验证 |
| **预期** | 全部 7 项通过 |
| **门禁** | **阻塞性** — 任一项不通过即 FAIL |

---

## 6. 门禁裁决矩阵

### 6.1 门禁类型定义

| 级别 | 含义 | 行为 |
|------|------|------|
| **GATE_BLOCK** | 阻塞性门禁 | 不通过 → 整体 FAIL，禁止放行 |
| **GATE_WARN** | 非阻塞门禁 | 不通过 → CONDITIONAL_PASS，需 CTO 确认 |
| **GATE_INFO** | 信息性门禁 | 仅记录，不影响放行决策 |

### 6.2 测试→门禁映射

| 测试 | 门禁级别 | 对应偏差 |
|------|---------|---------|
| UT-TLC-001~003 (tasks/submit) | GATE_BLOCK | D3 |
| UT-TLC-004~005 (GET sessions) | GATE_BLOCK | D5 |
| UT-TLC-006~007 (cancel) | GATE_WARN | — |
| UT-TLC-008 (sessions/recover 回归) | GATE_WARN | — |
| UT-TLC-009 (SSE stream) | GATE_BLOCK | D3 |
| UT-TLC-010 (mirror) | GATE_INFO（W30 P1） | D7 |
| UT-TPT-001~003 (TriLCClient) | GATE_BLOCK | D1+D3+D6 |
| UT-TCD-001~002 (detached) | GATE_WARN | D4 |
| UT-TMC-001~002 (mirror) | GATE_INFO（W30 P1） | D7 |
| INT-001 (streaming 链路) | GATE_BLOCK | D1+D3+D6 |
| INT-002 (研发链路) | GATE_BLOCK | D4 |
| INT-003 (关闭/重开) | GATE_BLOCK | D2+D5 |
| INT-004 (fallback) | GATE_WARN | — |
| INT-005 (跨节点) | GATE_INFO（W30 P1） | D7 |
| E2E-001~003 (TriCade) | GATE_BLOCK | — |
| E2E-004 (D1-D7) | GATE_BLOCK | D1-D7 |

### 6.3 最终裁决规则

```
if any(GATE_BLOCK) == FAIL:
    → 整体 FAIL，建议拒收，返回 CTO 修复

elif any(GATE_WARN) == FAIL:
    → CONDITIONAL_PASS，列出 WARN 项，CTO 确认后放行

else:
    → PASS，全部门禁通过，建议放行
```

---

## 7. 测试执行 Checklist（Phase B 用）

### 7.1 S1-S4 每步冒烟

- [ ] S1: `curl -X POST http://127.0.0.1:11434/internal/v1/sessions/recover` → 200（已有端点回归）
- [ ] S2: `curl -X POST http://127.0.0.1:11434/internal/v1/tasks/submit -H "Content-Type: application/json" -d '{"message":"hello"}'` → 201 + sessionId
- [ ] S2: 连接 `GET /internal/v1/sessions/{id}/stream` → SSE 事件流
- [ ] S3: TriPilot webview → 消息发送 → 流式输出（S2 前置）
- [ ] S4: `curl -X POST http://127.0.0.1:11434/internal/v1/sessions/{id}/cancel` → 200

### 7.2 S5-S8 每步冒烟

- [ ] S5: 关闭 VSCodium → 检查 daemon 任务继续 → 重开 → 自动重连
- [ ] S6: 研发任务 → TriLC→TriCode→opencode 链路
- [ ] S7: `curl -X POST http://trimc/internal/v1/tasks/mirror ...` → 200
- [ ] S8: MSI 打包 → 安装 → 扩展加载 → UI 正常

### 7.3 D1-D7 逐项关闭

- [ ] D1: `grep executeToolCall TriPilot/src/extension.ts` → 零命中
- [ ] D2: 关闭 IDE → daemon 任务继续 → 验证通过
- [ ] D3: curl 5 端点全部可调用（①②③④⑤）
- [ ] D4: `grep -r tricode TriPilot/src/` → 零直接引用
- [ ] D5: 重开 IDE → 会话自动出现
- [ ] D6: `grep apiKey TriPilot/src/extension.ts` → 零命中
- [ ] D7: TriLC→TriMC mirror → TriMobile 可查询

---

## 8. 使用依据

| 依据 | 文件 |
|------|------|
| 技术设计 | `trees/cpo-pc-layer-escalation/w30-architecture-fix-design.md` |
| 产品裁决 | `trees/cpo-pc-layer-escalation/ruling.md` |
| 偏差清单 | `trees/TWF-002/known-deviations.md` |
| 实施序列 | 设计文档 §5（S1-S8） |
| 端点契约 | 设计文档 §3 |
| 测试门禁框架 | 设计文档 §6 |
| 代码基线 | TriLC `src/server/app.ts`、TriPilot `src/extension.ts`、TriCode `src/index.ts`、TriMC `src/server/app.ts` |
| 业务战略 | `business-strategy-evolution-log.md` L55-68 |

---

**下一步**：小全实施 S1-S8 完成后，进入 Phase B 执行本策略中的全部测试并产出 `deviation-closeout.md`。

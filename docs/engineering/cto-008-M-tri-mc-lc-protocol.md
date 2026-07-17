# CTO-008-M: TriMC ↔ TriLC 通信协议设计

> 版本：v1.0
> 日期：2026-07-17
> 作者：CTO（小狄）
> 依据：CPO 产品路由包裁决 #9-11、`docs/architecture-overall-unified.mmd`、TriMC `src/server/app.ts`

---

## 一、协议定位

本协议定义 **TriPilot/TriCode → TriMC → TriLC** 三层之间的通信契约，使得 **TriLC 作为 TriMC 的本地透明降级**，客户端无需感知当前连接到的是云端还是本地。

核心原则：**TriLC 暴露与 TriMC 完全相同的 HTTP API 面**，共享 `@trimetaverse/agent-core` 实现。

---

## 二、架构拓扑

```
┌──────────────────────────────────────────────────┐
│  PC 端 (Electron)                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ TriPilot │──│ TriCode  │──│ TriLC (本地)  │   │
│  │ VS Code  │  │ glue层   │  │ localhost:N   │   │
│  │ 插件     │  │          │  │               │   │
│  └──────────┘  └──────────┘  └──────┬────────┘   │
│                                     │             │
│                    连接策略:        │             │
│                    优先 → TriMC     │             │
│                    断线 → TriLC     │             │
└─────────────────────────────────────┼─────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                  │
              ┌─────▼─────┐   ┌──────▼──────┐   ┌──────▼──────┐
              │ TriMC #1  │   │ TriMC #2    │   │ TriMC #3    │
              │ (K8s Pod) │   │ (K8s Pod)   │   │ (K8s Pod)   │
              │ ┌───────┐ │   │ ┌────────┐  │   │ ┌────────┐  │
              │ │agent- │ │   │ │agent-  │  │   │ │agent-  │  │
              │ │core   │ │   │ │core    │  │   │ │core    │  │
              │ └───────┘ │   │ └────────┘  │   │ └────────┘  │
              └───────────┘   └─────────────┘   └─────────────┘
                    ▲                 ▲                  ▲
                    └─────────────────┴──────────────────┘
                            K8s Service (ClusterIP)
                            外部 Ingress / LB
```

---

## 三、API 兼容性契约

TriLC **必须**实现以下端点，签名与 TriMC 一致：

| 端点 | 方法 | TriMC 当前 | TriLC 实现 | 说明 |
|------|------|----------|----------|------|
| `/healthz` | GET | ✅ | ✅ 必须 | 健康检查，返回 `{"ok":true,"service":"trilc"}` |
| `/internal/v1/agent` | POST | ✅ SSE+JSON | ✅ 必须 | Agent 循环主端点 |
| `/internal/v1/chat` | POST | ✅ JSON | ⚪ 可选 | 简单对话（MVP 后加） |
| `/internal/v1/tasks` | POST | ✅ placeholder | ⚪ 可选 | 任务队列（Phase 2） |

### 3.1 `/healthz` 契约

```json
// Response 200
{ "ok": true, "service": "trilc" }
```

- TriPilot/TriCode 通过此端点判断连接可用性
- 间隔：每 5s 探测 TriMC，连续 3 次失败 → 切 TriLC
- 恢复：每 10s 探测 TriMC，连续 2 次成功 → 切回 TriMC

### 3.2 `/internal/v1/agent` 契约

请求体（与 TriMC 完全一致）：

```typescript
{
  model?: string;          // 默认 'deepseek-v4-pro'
  systemPrompt?: string;   // 系统提示词
  messages?: Message[];    // trimodel Message[] 格式
  maxTurns?: number;       // 默认 25
  contract?: AgentContract; // 可选，触发编排层流水线
  tier?: AgentTier;        // 'main' | 'subagent' | 'coordinator'
  cwd?: string;            // 工作目录
  permissionMode?: PermissionMode;
  permissionRules?: PermissionRule[];
}
```

响应模式（与 TriMC 一致）：

**SSE 流模式** (`?stream=true` 或 `Accept: text/event-stream`)：
```
event: loop_start
data: {"type":"loop_start","model":"deepseek-v4-pro",...}

event: content_delta
data: {"type":"content_delta","turn":1,"delta":"Hello"}

event: loop_end
data: {"type":"loop_end","reason":"done",...}

data: [DONE]
```

**JSON 模式**（默认）：
```json
{
  "ok": true,
  "turns": "completed",
  "events": [ /* AgentEvent[] */ ]
}
```

### 3.3 AgentEvent 类型

TriLC 使用 `@trimetaverse/agent-core` 导出的 `AgentEvent` union type，保证事件结构完全一致：

```typescript
// 核心事件类型（agent-core/src/loop.ts）
AgentEvent =
  | { type: 'loop_start'; model; turn; tier; availableTools; ... }
  | { type: 'request_start'; turn; model }
  | { type: 'content_delta'; turn; delta }
  | { type: 'assistant_message'; turn; content; tool_calls? }
  | { type: 'tool_call'; turn; id; name; arguments }
  | { type: 'tool_result'; turn; tool_call_id; content; is_error? }
  | { type: 'tool_blocked'; turn; tool_name; reason }
  | { type: 'loop_end'; reason; usageSummary? }
  | { type: 'cache_metrics'; metrics }
  | { type: 'recovery'; turn; tier; message }
  | { type: 'error'; message }
```

---

## 四、连接策略

### 4.1 TriCode Glue 层连接管理

```
┌──────────────────────────────────────────────────────┐
│                  TriCode ConnectionManager           │
│                                                      │
│  State Machine:                                      │
│                                                      │
│  ┌──────────┐    TriMC 健康     ┌──────────┐        │
│  │ CONNECTED├──────────────────►│ DEGRADED │        │
│  │ (TriMC)  │   连续3次失败      │          │        │
│  └────┬─────┘                   └────┬─────┘        │
│       │                              │               │
│       │ TriMC 恢复                   │ 切换 TriLC    │
│       │ 连续2次成功                   │               │
│       │                     ┌────────▼────────┐     │
│       └─────────────────────┤ LOCAL (TriLC)   │     │
│                             │ 本地运行中       │     │
│                             └────────┬────────┘     │
│                                      │               │
│                                      │ TriMC 恢复    │
│                                      │ 自动切回       │
│                                      │               │
│  TriMC endpoint: ${TRIMC_URL}/internal/v1/agent     │
│  TriLC endpoint: http://127.0.0.1:${TRILC_PORT}     │
│                    /internal/v1/agent                │
└──────────────────────────────────────────────────────┘
```

### 4.2 服务发现

| 环境 | TriMC 地址 | TriLC 地址 |
|------|---------|---------|
| 开发 | `http://localhost:PORT` | `http://127.0.0.1:PORT+1` |
| 生产 | `https://trimc.trimetaverse.io` (K8s Ingress → Service → Pods) | `http://127.0.0.1:${TRILC_PORT}` |
| K8s 内部 | `trimc-service.namespace.svc.cluster.local` | N/A |

### 4.3 健康检查算法

```typescript
// TriCode ConnectionManager 伪代码
class ConnectionManager {
  private active: 'trimc' | 'trilc' = 'trimc';
  private triMcFailures = 0;
  private triMcSuccesses = 0;

  async getAgentEndpoint(): Promise<string> {
    if (this.active === 'trimc') {
      const healthy = await this.healthCheck(this.trimcUrl);
      if (healthy) return this.trimcUrl;
      this.triMcFailures++;
      if (this.triMcFailures >= 3) {
        this.active = 'trilc';
        this.emit('fallback', { from: 'trimc', to: 'trilc' });
      }
    }
    // Always try TriMC in background
    if (this.active === 'trilc') {
      const triMcOk = await this.healthCheck(this.trimcUrl);
      if (triMcOk) {
        this.triMcSuccesses++;
        if (this.triMcSuccesses >= 2) {
          this.active = 'trimc';
          this.emit('restore', { to: 'trimc' });
        }
      } else {
        this.triMcSuccesses = 0;
      }
    }
    return this.active === 'trimc' ? this.trimcUrl : this.trilcUrl;
  }
}
```

---

## 五、TriLC 服务端实现约束

### 5.1 依赖

```json
{
  "@trimetaverse/agent-core": "file:../TriMC/packages/agent-core",
  "trimodel": "file:../TriModel"
}
```

### 5.2 服务器框架

- **不引入** Express / Fastify 等重型框架
- 使用 Node.js 原生 `http` 模块，与 TriMC 保持同构
- 默认端口：`env.TRILC_PORT ?? 0`（OS 分配 → 写入本地文件供 TriCode 发现）

### 5.3 agentLoop 集成

```typescript
import { agentLoop } from '@trimetaverse/agent-core';
// 使用 agent-core 导出的 agentLoop，与 TriMC 共享同一实现
// TriLC 不加载 pipeline（Soul Loader / Memory Injector / Context Builder 为可选）
// 本地模式下仅加载基础 tool registry
```

### 5.4 本地工具集

TriLC 本地模式工具集（Phase 1 MVP）：
- `read_file` / `write_file` / `edit_file`
- `shell_exec`（沙箱化）
- `list_directory` / `search_files`
- 不包含：子代理孵化、MCP 服务器

---

## 六、会话同步（Phase 2）

当前 Phase 1 不实现会话跨节点同步。TriMC↔TriLC 切换时：

- **TriMC→TriLC**：新会话从头开始（TriLC 无云端会话历史），显示提示"已切换到本地模式，新会话开始"
- **TriLC→TriMC**：本地会话不上传云端，用户在 TriMC 恢复后看到的是之前的云端会话历史
- **Phase 2**：考虑通过 TriMem 实现会话索引同步（只同步会话列表，不同步完整历史）

---

## 七、安全边界

| 层级 | TriMC (云端) | TriLC (本地) |
|------|----------|----------|
| 认证 | TriMem Token / JWT | 本地无认证（localhost only） |
| 授权 | PermissionEngine + tier + tool-gater | PermissionEngine + tier（默认 bypassPermissions） |
| TLS | K8s Ingress 终止 TLS | 无需（localhost） |
| 审计 | observability 全量记录 | 仅本地日志 |

---

## 八、实现优先级

| Phase | 内容 | 状态 |
|-------|------|------|
| **Phase 1 L0** | TriLC `/healthz` + `/internal/v1/agent` 基础实现 | ← 当前 |
| Phase 1 L1 | TriCode ConnectionManager（连接策略+健康检查） | 待 CTO-008-P |
| Phase 1 L2 | TriLC 本地工具集完善 | 待后续 |
| Phase 2 | 会话索引同步（TriMem） | 远期 |

---

## 九、真源引用

| 文档 | 说明 |
|------|------|
| `TriMC/src/server/app.ts` | TriMC HTTP API 实现参考 |
| `TriMC/packages/agent-core/src/loop.ts` | agentLoop 共享实现 |
| `TriMC/packages/agent-core/src/index.ts` | agent-core 公共导出 |
| `docs/architecture-overall-unified.mmd` | 架构全景图（PC端四合一 + K8s 三热备） |
| `docs/workflow/operating-records/2026-W29/cpo-product-routing-package.md` | CPO 裁决 #9-11 |

# 两阶段架构协作与 agent-core 下沉分析

---
sourceOfTruth: TriMetaverse/docs/execution/
syncMode: central
lastSyncedAt: 2026-08-16
---

## 一、两阶段划界（核心修正）

### 1.1 训练期（现在）

| 域 | TriMC | TriLC | 关系 |
|----|-------|-------|------|
| **能力** | 套壳 claude code（不走 agent-core） | 自研 agent-core（`@tricompany/agent-core`） | 教练/审核 |
| **Session** | claude code 原生 session | TriLC session-store | 独立维护 |
| **同步** | 无同步 | 单域 | 无镜像 |

**关键特征**：
- TriMC = claude code 套壳（Claude Code 2.1.88 原生能力）
- TriLC = 自研 agent-core（能力训练和验证）
- **非镜像、非热备**——教练/审核关系

### 1.2 生产期（目标态）

| 域 | TriMC | TriLC | 关系 |
|----|-------|-------|------|
| **能力** | 同跑 agent-core | 同跑 agent-core | 互为镜像 |
| **Session** | 共享 session-store | 共享 session-store | 同上下文 |
| **同步** | 双向同步 | 双向同步 | Active-Passive 热备 |

**关键特征**：
- 两侧同跑 agent-core（共享能力）
- TriMC 直接获得成熟能力
- 互为镜像（同上下文、单活、掉线顶上）

---

## 二、三面 × 两阶段矩阵架构协作图

### 2.1 三面定义

```
┌─────────────────────────────────────────────────────────────────┐
│                        三面舰队模型                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  本地生产域（Local Primary）                                      │
│  ┌──────────────┐                                                │
│  │ TriLC        │ ← @tricompany/agent-core（训练期自研）       │
│  │ sessions.db  │ ← 单域 session 管理                           │
│  └──────────────┘                                                │
│         │                                                         │
│         │ git push/pull（项目仓同步）                            │
│         ▼                                                         │
│  ┌──────────────┐                                                │
│  │ 项目仓       │                                                │
│  │ dev 分支     │                                                │
│  └──────────────┘                                                │
│                                                                  │
│  服务器域（Server Mirror）─ 训练期 = 教练/审核                   │
│  ┌──────────────┐                                                │
│  │ TriMC        │ ← claude code 套壳（训练期）                   │
│  │ sessions.db  │ ← claude code 原生 session                    │
│  └──────────────┘                                                │
│         │                                                         │
│         │ git push/pull（项目仓同步）                            │
│         ▼                                                         │
│  ┌──────────────┐                                                │
│  │ 项目仓       │                                                │
│  │ dev 分支     │                                                │
│  └──────────────┘                                                │
│                                                                  │
│  研发仓域（Dev Independent）                                      │
│  ┌──────────────┐                                                │
│  │ TriLC        │ ← 独立 agent-core 实例                        │
│  │ sessions.db  │ ← 独立 session 管理                           │
│  └──────────────┘                                                │
│         │                                                         │
│         │ git push/pull（独立研发）                              │
│         ▼                                                         │
│  ┌──────────────┐                                                │
│  │ 研发仓       │                                                │
│  │ dev 分支     │                                                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 两阶段矩阵

| 阶段 | 本地生产域 | 服务器域 | 研发仓域 | 关系 |
|------|-----------|---------|---------|------|
| **训练期** | TriLC 自研 agent-core | TriMC 套壳 claude code | TriLC 独立实例 | 教练/审核 |
| **生产期** | TriLC agent-core | TriMC agent-core | TriLC agent-core | 互为镜像 |

### 2.3 训练期协作关系（教练/审核）

```
┌─────────────────────────────────────────────────────────────────┐
│                    训练期协作关系（教练/审核）                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  本地 TriLC（学员）                     服务器 TriMC（教练）         │
│  ┌──────────────┐                    ┌──────────────┐           │
│  │ agent-core    │ ──能力验证───────► │ claude code  │           │
│  │ (自研)       │                    │ (套壳)       │           │
│  └──────────────┘                    └──────────────┘           │
│         ▲                                     │                  │
│         │                                     │                  │
│         │ 审核反馈                            │                  │
│         │                                     ▼                  │
│  ┌──────────────┐                    ┌──────────────┐           │
│  │ 能力调整     │ ◄───审核结果────── │ 审核结果     │           │
│  └──────────────┘                    └──────────────┘           │
│                                                                  │
│  协作内容：                                                       │
│  - TriLC 能力验证：agent-loop、权限、工具调用                    │
│  - TriMC 审核反馈：能力成熟度、稳定性、安全性                    │
│  - 成熟能力沉淀：从 TriLC 提取到共享 agent-core                  │
│  - 最终目标：生产期两侧同跑 agent-core                            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 生产期协作关系（互为镜像）

```
┌─────────────────────────────────────────────────────────────────┐
│                   生产期协作关系（互为镜像）                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  本地 TriLC（Active/Passive）          服务器 TriMC（Passive/Active）│
│  ┌──────────────┐                    ┌──────────────┐           │
│  │ agent-core   │ ◄───双向同步─────► │ agent-core   │           │
│  │ (共享)       │                    │ (共享)       │           │
│  └──────────────┘                    └──────────────┘           │
│         │                                     │                  │
│         │ 同上下文共享                        │                  │
│         │                                     │                  │
│  ┌──────────────┐                    ┌──────────────┐           │
│  │ sessions.db  │ ◄───session 同步──► │ sessions.db  │           │
│  └──────────────┘                    └──────────────┘           │
│                                                                  │
│  热备协议：                                                       │
│  - Active-Passive 切换协议                                       │
│  - 同上下文共享机制                                              │
│  - 单活判定规则                                                  │
│  - 掉线检测与顶上逻辑                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、agent-core 下沉清单

### 3.1 原则

**训练期 TriLC 能力成熟应沉淀在 agent-core（而非 TriLC 私有）**

### 3.2 现有能力分布审查

| 能力 | 当前位置 | 是否已下沉 | 状态 |
|------|---------|-----------|------|
| **Agent Loop** | `@tricompany/agent-core/src/loop.ts` | ✅ 已下沉 | TriLC 自研，训练期验证中 |
| **Tools Registry** | `@tricompany/agent-core/src/tools.ts` | ✅ 已下沉 | 注册抽象，具体工具在消费方 |
| **Permissions** | `@tricompany/agent-core/src/permissions.ts` | ✅ 已下沉 | Tier 体系 + 工具权限 |
| **Permission Engine** | `@tricompany/agent-core/src/permissions-engine/` | ✅ 已下沉 | 决策管道 + 规则解析 |
| **Sub-agent Spawn** | `@tricompany/agent-core/src/sub-agent/` | ✅ 已下沉 | 子代理生成 + 工具解析 |
| **Contracts v3.0** | `@tricompany/agent-core/src/contracts/` | ✅ 已下沉 | 合同解析 + 校验 |
| **Message Guard** | `@tricompany/agent-core/src/message-guard/` | ✅ 已下沉 | 消息验证 + 压缩 |
| **Process Supervisor** | `@tricompany/agent-core/src/process-supervisor/` | ✅ 已下沉 | 进程监督 + 注册表 |
| **Scheduler** | `@tricompany/agent-core/src/scheduler/` | ✅ 已下沉 | Cron engine + Job executor |
| **Session 管理** | `TriLC/session-store/` | ❌ 未下沉 | TriLC 私有 |
| **任务循环逻辑** | `@tricompany/agent-core/src/loop.ts` | ✅ 已下沉 | Agent Loop 核心 |
| **工具调用协议** | `@tricompany/agent-core/src/tools.ts` | ✅ 已下沉 | Registry 抽象 |
| **权限模式** | `@tricompany/agent-core/src/permissions-engine/` | ✅ 已下沉 | Permission Engine |
| **MCP 接入** | `TriLC/src/mcp/mcp-client.ts` | ❌ 未下沉 | TriLC 私有 |
| **模型路由** | `TriModel`（独立模块） | ✅ 独立模块 | 三方共享 |

### 3.3 需要下沉的能力（优先级排序）

| 优先级 | 能力 | 当前位置 | 下沉路径 | 理由 |
|--------|------|---------|---------|------|
| **P0** | Session 管理 | `TriLC/session-store/` | 提取到 `agent-core/src/session/` | 生产期需共享 session |
| **P1** | MCP 接入 | `TriLC/src/mcp/` | 提取到 `agent-core/src/mcp/` | MCP 是工具生态基础 |
| **P2** | 会话同步 | `TriLC/src/sync/` | 提取到 `agent-core/src/sync/` | 生产期双向同步必需 |
| **P3** | 权限规则 DSL | `agent-core/permissions-engine/` | 扩展 DSL 表达能力 | 覆盖更多场景 |

### 3.4 下沉路径

#### P0：Session 管理（生产期必需）

**当前状态**：
- `TriLC/session-store/`：SQLite sessions.db
- TriMC 使用 claude code 原生 session

**下沉目标**：
```typescript
// agent-core/src/session/store.ts
export function createSessionStore(dbPath: string): SessionStore

// agent-core/src/session/types.ts
export type SessionRecord = {...}
export type SessionMessageRecord = {...}
```

**下沉步骤**：
1. 从 `TriLC/session-store/` 提取核心接口
2. 移除 TriLC 特定逻辑（如 init-chain 关联）
3. 保持数据结构兼容（SessionRecord v2 schema）
4. TriMC 适配层：claude code session → SessionRecord

#### P1：MCP 接入（工具生态基础）

**当前状态**：
- `TriLC/src/mcp/mcp-client.ts`：MCP 客户端实现
- `TriLC/src/tools/mcp-tool.ts`：MCP 工具适配

**下沉目标**：
```typescript
// agent-core/src/mcp/client.ts
export function createMCPClient(config: MCPConfig): MCPClient

// agent-core/src/mcp/adapter.ts
export function adaptMCPToTool(mcp: MCPClient): ToolDefinition
```

**下沉步骤**：
1. 提取 MCP 客户端核心逻辑
2. 移除 TriLC 特定配置（如 trilc-profile）
3. 工具适配抽象化
4. TriMC 适配层：MCP → TriMC tool-gater

#### P2：会话同步（生产期双向同步）

**当前状态**：
- `TriLC/src/sync/sync-engine.ts`：单向同步（TriLC → TriMC）
- 无反向同步机制

**下沉目标**：
```typescript
// agent-core/src/sync/engine.ts
export function syncSessionToRemote(...): SyncResult
export function syncSessionFromRemote(...): SyncResult
export function detectBidirectionalConflict(...): ConflictReport
```

**下沉步骤**：
1. 扩展 sync-engine 为双向同步
2. 增加冲突检测机制
3. 抽象传输层（HTTP/gRPC）
4. TriMC/TriLC 各自适配层

---

## 四、热备协议草案（生产期）

### 4.1 关键要素

#### 4.1.1 Active-Passive 切换协议

**状态定义**：
```typescript
type NodeState = 'active' | 'passive' | 'standalone' | 'unknown'

type NodeInfo = {
  nodeId: string
  state: NodeState
  lastHeartbeatAt: string
  version: string
}
```

**切换条件**：
| 条件 | 触发切换 | 目标状态 |
|------|---------|---------|
| Active 掉线（>30s 无心跳） | Passive → Active | Passive 成为 Active |
| Active 恢复 | 协商解决 | 保留 Active 或降为 Passive |
| 网络分区 | 两者都认为对方掉线 | 都成为 Active（需人工介入） |

**切换流程**：
```
1. Passive 检测 Active 掉线（>30s 无心跳）
2. Passive 广播「我要成为 Active」
3. 等待 5s 看是否有反对
4. 无反对 → Passive 成为 Active
5. 有反对 → 两者都成为 Active（需人工介入）
```

#### 4.1.2 同上下文共享机制

**共享数据**：
```typescript
type SharedContext = {
  sessionStore: SessionStore  // 共享 session
  taskMirror: TaskMirror[]    // 共享任务状态
  configSync: ConfigBundle    // 共享配置（五维同步 bundle）
}
```

**共享机制**：
1. **Session 共享**：双向同步（见 P2）
2. **任务镜像**：TriLC TaskMirrorPusher 扩展为双向
3. **配置同步**：五维同步 bundle 扩展为实时推送

#### 4.1.3 单活判定规则

**判定条件**：
1. **心跳超时**：>30s 无心跳 → 判定为掉线
2. **版本号**：版本号不同 → 判定为不兼容
3. **人工干预**：两者都认为自己是 Active → 人工介入

**单活保证**：
```
1. Active 定期广播心跳（每 5s）
2. Passive 监听心跳
3. 超时（>30s）触发切换协议
4. 切换成功后广播新状态
```

#### 4.1.4 掉线检测与顶上逻辑

**检测机制**：
```typescript
// Passive 侧
setInterval(() => {
  const elapsed = now() - lastHeartbeatAt
  if (elapsed > 30000) {
    initiateActiveTakeover()
  }
}, 5000)
```

**顶上逻辑**：
```typescript
async function initiateActiveTakeover() {
  // 1. 广播「我要成为 Active」
  broadcast({ type: 'takeover-request', nodeId: myNodeId })
  
  // 2. 等待 5s 反对
  await sleep(5000)
  
  // 3. 检查是否有反对
  if (hasOpposition) {
    // 两者都成为 Active，需人工介入
    becomeActiveWithConflict()
  } else {
    // 成为 Active
    becomeActive()
  }
}
```

### 4.2 API 定义

#### 4.2.1 心跳 API

```
POST /internal/v1/heartbeat
{
  "nodeId": "local",
  "state": "active",
  "timestamp": "2026-08-16T10:00:00Z"
}
```

#### 4.2.2 状态查询 API

```
GET /internal/v1/cluster/state
→ 返回 {
     nodes: [
       { nodeId: "local", state: "active", lastHeartbeatAt: "..." },
       { nodeId: "server", state: "passive", lastHeartbeatAt: "..." }
     ]
   }
```

#### 4.2.3 切换 API

```
POST /internal/v1/cluster/become-active
{
  "nodeId": "local",
  "reason": "active-timeout"
}
```

---

## 五、现有设计的阶段改标注

### 5.1 M0-M4 里程碑重新定义

**修正前（混期）**：
- M3「生产双跑」→ 实为训练期教练/审核关系

**修正后**：

| 里程碑 | 阶段 | 定义 | 修正说明 |
|--------|------|------|---------|
| **M0** | 训练期 | 公司开业 | 无修正 |
| **M1** | 训练期 | 项目初始化 | 无修正 |
| **M2** | 训练期 | 与服务器域教练/审核 | **修正：非同步，教练/审核** |
| **M3** | 训练期 | TriLC 能力验证完成 | **修正：非双跑，能力验证** |
| **M4** | 生产期 | 两侧同跑 agent-core | **修正：生产期目标** |

### 5.2 Session 管理设计阶段标注

**修正前（混期）**：
- 双向同步设计 → 实为生产期目标

**修正后**：

| 设计内容 | 阶段 | 标注 |
|---------|------|------|
| 单域 session 管理（TriLC session-store） | 训练期 | 当前实现 |
| 双向 session 同步 | 生产期 | **【生产期】** 前置条件：agent-core 双侧 |
| SessionId 格式统一 | 生产期 | **【生产期】** 前置条件：共享 session-store |
| 冲突解决规则 | 生产期 | **【生产期】** 前置条件：双向同步 |

### 5.3 双域舰队设计阶段标注

**修正前（混期）**：
- 全文标注为生产期，但未明确训练期前提

**修正后**：

| 章节 | 阶段 | 标注 |
|------|------|------|
| 三面舰队模型 | 两阶段 | **【两阶段】** 训练期≠生产期 |
| 同步协议 | 生产期 | **【生产期】** 前置条件：agent-core 双侧 |
| 热备协议 | 生产期 | **【生产期】** 前置条件：agent-core 双侧 |
| 一致性校验 | 生产期 | **【生产期】** 前置条件：双向同步 |

### 5.4 docs/execution/dual-domain-fleet-operations-design.md 阶段标注

**需修正的混期内容**：

1. **文档开头**：增加阶段说明
```markdown
## 阶段说明

本文档描述的「双域舰队互为镜像模型」是**生产期目标态**。

**训练期（现在）**：
- TriMC = 套壳 claude code（不走 agent-core）
- TriLC = 自研 agent-core
- 关系 = 教练/审核（非镜像非热备）

**生产期（目标态）**：
- 两侧同跑 agent-core
- 关系 = 互为镜像（同上下文、单活、掉线顶上）
```

2. **同步协议章节**：标注「【生产期】」
3. **热备协议章节**：标注「【生产期】」
4. **分期实施章节**：调整为两阶段路径

---

## 六、两阶段总体架构与路线图

### 6.1 训练期路径（现在 → 生产期）

```
┌─────────────────────────────────────────────────────────────────┐
│                    训练期路径（6-12 个月）                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase T1: TriLC 能力验证（1-2 个月）                            │
│  ├── agent-loop 稳定性验证                                       │
│  ├── 权限体系完整性测试                                           │
│  ├── 工具调用协议验证                                             │
│  └── Session 管理完善                                             │
│                                                                  │
│  Phase T2: 能力下沉准备（2-3 个月）                              │
│  ├── Session 管理接口抽象                                         │
│  ├── MCP 接入标准化                                              │
│  ├── 权限规则 DSL 扩展                                            │
│  └── 会话同步协议设计                                             │
│                                                                  │
│  Phase T3: TriMC 适配准备（2-3 个月）                            │
│  ├── TriMC agent-core 接入层设计                                 │
│  ├── claude code session → SessionRecord 适配                   │
│  └── MCP → TriMC tool-gater 适配                                 │
│                                                                  │
│  Phase T4: 共享 agent-core 提取（2-3 个月）                       │
│  ├── @trimetaverse/agent-core 创建                               │
│  ├── Session/MCP/Sync 下沉                                        │
│  ├── TriMC/TriLC 适配层实现                                      │
│  └── 集成测试 + 性能验证                                         │
│                                                                  │
│  Phase T5: 生产期切换（1-2 个月）                                 │
│  ├── 两侧同跑 agent-core                                          │
│  ├── 热备协议实现                                                │
│  ├── 双向同步实现                                                │
│  └── 灰度发布 + 监控                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 生产期目标态

**关键特征**：
1. 两侧同跑 agent-core（共享能力）
2. 互为镜像（同上下文、单活、掉线顶上）
3. 双向同步（Session + Git）
4. 热备协议（Active-Passive 切换）

---

## 七、技术总结

### 7.1 关键决策修正

| 决策点 | 修正前 | 修正后 | 理由 |
|--------|--------|--------|------|
| 阶段划分 | 混期（当前就镜像） | 两阶段（训练期→生产期） | CEO 架构纠偏 |
| M3 定义 | 生产双跑 | TriLC 能力验证完成 | 训练期目标 |
| Session 同步 | 当前实现 | 生产期目标 | 前置条件未满足 |
| 热备协议 | 当前实现 | 生产期目标 | 前置条件未满足 |

### 7.2 待澄清问题

1. **训练期教练/审核机制**
   - TriMC 如何审核 TriLC 能力？
   - 审核结果如何反馈？
   - 能力成熟度判定标准？

2. **生产期切换时机**
   - 何时判断 TriLC 能力成熟？
   - 切换的验收标准？
   - 灰度发布策略？

3. **agent-core 下沉优先级**
   - P0（Session）是否必须在生产期前完成？
   - P1（MCP）/P2（Sync）是否可并行？

---

**方案版本**：v2.0.0（两阶段修正版）
**起草人**：小狄（CTO）
**日期**：2026-08-16
**状态**：等待 CEO 确认两阶段架构

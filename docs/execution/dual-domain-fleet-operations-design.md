# 双域舰队互为镜像模型技术方案设计

---
sourceOfTruth: TriMetaverse/docs/execution/
syncMode: central
lastSyncedAt: 2026-08-16
---

## 一、背景与目标

### 1.1 CEO 核心场景（六点）

1. 公司开业
2. 项目初始化（含周工作平面等标准治理体系）
3. 与服务器域舰队会话同步
4. 本地关机时段，服务器自动推进——舰队会话、周工作平面自动推进
5. 本地域开机，拉取项目和会话同步，完成一致性校验，继续同步工作
6. 本地研发仓也存在同样舰队，但会话应该可以独立维护

### 1.2 技术目标

- 建立三面舰队模型（本地生产域/服务器域/研发仓域）的同步机制
- 实现治理体系真源与授权自动推进
- 完成开机合并与一致性校验
- 与现有一切技术资产无缝衔接（M3/I1-I5/sync-engine/fleet 同步）

---

## 二、现有技术资产盘点

### 2.1 核心资产状态

| 资产 | 状态 | 能力 | 缺口 |
|------|------|------|------|
| **M3 双跑** | ✅ 运营中（2026-08-14） | TriLC/TriMC 互为 fallback | 无 |
| **I1-I5 初始化链** | ✅ 运营中 | 七态状态机 | 无 |
| **sync-engine** | ✅ 运营中 | TriLC → TriMC 单向 session 同步 | ❌ 缺反向同步 |
| **TaskMirrorPusher** | ✅ 运营中 | 任务状态事件推送到 TriMC | 无 |
| **五维同步 bundle** | ✅ 运营中 | company/model/keys/employees/project | ❌ 缺 sessions 维 |
| **session-store v2** | ✅ 运营中 | syncStatus/cloudSessionId/lastSyncedAt | ❌ 无双向冲突解决 |
| **周工作平面迁移** | ✅ 已实证 | Cron job 自动推进 | 无 |

### 2.2 sync-engine 分析

**现状**：
- 状态机：`local → pending → syncing → synced/error`
- 支持单会话同步和批量同步
- 有 409 dedup 处理

**缺口**：
- 仅支持 TriLC → TriMC 单向同步
- 无 TriMC → TriLC 反向同步机制
- 无双向冲突解决规则

### 2.3 五维同步 bundle 分析

**现状**：
- 五维：company / model / keys / employees / project
- Git 载体，commit + push 双远端
- 单维失败降级
- 密钥纪律（指纹，不存储密钥材料）

**缺口**：
- 缺少 sessions 维度
- 无双向同步能力

---

## 三、技术方案设计

### 3.1 同步协议

#### 3.1.1 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                        双域同步架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  本地生产域                          服务器域                    │
│  ┌──────────────┐                 ┌──────────────┐             │
│  │ TriLC        │                 │ TriMC        │             │
│  │ sessions.db  │◄───────────────►│ sessions.db  │             │
│  │              │   HTTP 双向     │              │             │
│  └──────────────┘                 └──────────────┘             │
│         │                                │                       │
│         │ git push/pull                 │ git push/pull         │
│         ▼                                ▼                       │
│  ┌──────────────┐                 ┌──────────────┐             │
│  │ 项目仓       │◄───────────────►│ 项目仓       │             │
│  │ dev 分支     │   双远端同步     │ dev 分支     │             │
│  └──────────────┘                 └──────────────┘             │
│                                                                  │
│  研发仓域（独立舰队，独立会话）                                  │
│  ┌──────────────┐                                              │
│  │ TriLC        │                                              │
│  │ sessions.db  │（独立维护）                                  │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.1.2 会话同步协议

**方案A：六维 bundle（推荐）**

将 sessions 作为第六维加入 bundle：

```json
{
  "schemaVersion": 1,
  "bundleId": "bundle_xxx",
  "generatedAt": "2026-08-16T10:00:00Z",
  "generatedBy": "trilc@local",
  "company": {...},
  "model": {...},
  "keys": {...},
  "employees": {...},
  "project": {...},
  "sessions": {
    "status": "synced" | "partial" | "unavailable",
    "count": 42,
    "latestUpdatedAt": "2026-08-16T09:55:00Z",
    "sessionIndex": [
      {
        "sessionId": "sess_xxx",
        "title": "...",
        "status": "active",
        "updatedAt": "2026-08-16T09:55:00Z",
        "messageCount": 15,
        "syncStatus": "synced"
      }
    ]
  }
}
```

**Session 同步（双向 HTTP）**：

```
本地 → 服务器：
  POST /internal/v1/sessions/sync
  Body: { sessionId, messages, syncType: 'full' | 'incremental' }

服务器 → 本地：
  POST /internal/v1/sessions/pull-since
  Body: { lastSyncAt, includeDeleted: true }
  Response: { sessions: [], hasMore: boolean }
```

#### 3.1.3 服务器离线期会话回流

**流程**：

```
本地开机 → 检查 lastSyncAt
  ↓
POST /internal/v1/sessions/pull-since { lastSyncAt: "2026-08-15T18:00:00Z" }
  ↓
服务器返回 { sessions: [...], hasMore: false }
  ↓
本地合并到 sessions.db（冲突标记，见 §3.2）
```

**关键技术点**：
- `lastSyncAt` 增量拉取（避免全量传输）
- `hasMore` 分页（大量会话场景）
- 冲突标记（见 §3.2 冲突解决）

#### 3.1.4 SessionId 格式统一

**建议格式**：
```
sess_{timestamp36}_{nodeId}_{random4}
```

- `timestamp36`：36 进制时间戳
- `nodeId`：节点标识（`local`/`server`/`dev`）
- `random4`：4 位随机字符

**示例**：
- `sess_lnh2q3_local_a1b2`（本地生成）
- `sess_lnh2q4_server_c3d4`（服务器生成）

---

### 3.2 冲突解决规则

#### 3.2.1 冲突检测规则

**三层检测机制**：

| 层级 | 检测方法 | 示例 |
|------|---------|------|
| **L1: 序列冲突** | 比较消息 seq | 本地有 seq=5，服务器也有 seq=5 |
| **L2: 时间戳冲突** | 比较 updatedAt | 同一 session，双方都修改了 |
| **L3: 内容冲突** | 比较内容 hash | 序列不同但内容相似 |

**检测触发时机**：
1. 本地 pull 会话时
2. 本地 push 会话时（服务器返回 409）

#### 3.2.2 冲突解决策略

**策略表（产品口径确认）**：

| 场景 | 策略 | 理由 |
|------|------|------|
| 周工作平面冲突 | **服务器优先** | 服务器离线期自动推进更权威 |
| 舰队会话冲突 | **服务器优先** | 服务器为主真源 |
| HEAD 冲突 | **用户选择** | Git 需手动合并 |
| Session 序列冲突 | **服务器优先 + 日志** | 序列单调性，服务器 seq 更新 |
| Session 内容冲突 | **用户选择** | 内容不同，需人工判断 |

**冲突解决 API**：

```
POST /internal/v1/sessions/resolve-conflict
{
  sessionId: string,
  localVersion: { seq: number, messages: [], updatedAt: string },
  remoteVersion: { seq: number, messages: [], updatedAt: string },
  strategy: 'remote' | 'local' | 'merge'
}
```

#### 3.2.3 冲突状态机

```
synced ──(检测到冲突)──→ conflicted
  │                          │
  │                          ├─(用户选择 remote)──→ synced(应用远程)
  │                          ├─(用户选择 local)──→ synced(应用本地)
  │                          └─(用户选择 merge)──→ synced(合并后)
```

---

### 3.3 授权清单机制

#### 3.3.1 服务器可离线自动推进的工作

**建议授权清单**：

| 工作类型 | 已实证 | 是否建议授权 | 技术风险 |
|---------|--------|-------------|---------|
| 周工作平面迁移 | ✅ | ✅ 建议 | 低 |
| 舰队会话推进 | ❌ | ⚠️ 需产品口径 | 中 |
| 项目状态更新 | ❌ | ⚠️ 需产品口径 | 中 |
| 员工 roster 同步 | ✅（五维） | ✅ 建议 | 低 |

**技术实现**：

```json
{
  "offlinePermissions": {
    "allowedTasks": {
      "weeklyPlaneMigration": true,
      "fleetSessionContinuation": false,  // 需产品口径
      "projectStatusUpdate": false         // 需产品口径
    },
    "maxOfflineDurationHours": 72,
    "requireUserConfirmation": false
  }
}
```

#### 3.3.2 授权清单存储/校验

**存储位置**：作为 bundle 新字段

```json
{
  "permissions": {
    "offlinePermissions": {...},
    "maxOfflineDurationHours": 72
  }
}
```

**校验机制**：
1. 服务器执行任务前检查授权清单
2. 本地 pull 时验证服务器是否超授权
3. 超授权任务标记为 `unauthorized`，需用户确认

#### 3.3.3 本地授权明确

**UI 交互流程**：

```
服务器请求执行「周工作平面迁移」
  ↓
本地弹出：「服务器请求执行 X，是否允许？」
  □ 总是允许此类任务
  [允许] [拒绝]
```

**授权持久化**：

```json
{
  "grantedPermissions": {
    "weeklyPlaneMigration": "always_allow",
    "fleetSessionContinuation": "ask"
  }
}
```

---

### 3.4 一致性校验面

#### 3.4.1 开机拉取同步后校验

**三层校验**：

| 层级 | 校验内容 | 失败处理 |
|------|---------|---------|
| **L1: HEAD 一致性** | 本地 HEAD == 服务器 applied HEAD | 呈现「HEAD 分歧」，用户选择 |
| **L2: Applied 一致性** | 本地 bundle hash == 服务器 bundle hash | 自动重新 pull bundle |
| **L3: Session 序一致性** | 本地 session seq == 服务器 session seq | 标记冲突，见 §3.2 |

#### 3.4.2 校验失败处理矩阵

| 失败类型 | 自动处理 | 用户介入 | 回滚 |
|---------|---------|---------|------|
| HEAD 分歧 | ❌ | ✅ 用户选择保留哪个 | 可选 |
| Applied 不一致 | ✅ 自动 pull | ❌ | ❌ |
| Session 序冲突 | ❌ | ✅ 用户选择策略 | 可选 |
| Session 内容冲突 | ❌ | ✅ 用户选择保留哪个 | 可选 |

**校验 API**：

```
POST /internal/v1/sync/verify-consistency
→ 返回 {
     headConsistent: boolean,
     appliedConsistent: boolean,
     sessionConflicts: [{ sessionId, localSeq, remoteSeq }]
   }
```

---

### 3.5 与现有一切衔接

#### 3.5.1 与 sync-engine 衔接

**扩展点**：

| 现有能力 | 扩展方向 |
|---------|---------|
| TriLC → TriMC 单向同步 | 新增 TriMC → TriLC 反向同步 |
| 状态机：local → pending → syncing → synced | 增加 conflicted 状态 |
| 409 dedup 处理 | 扩展为双向冲突检测 |

**新增函数**：

```typescript
// 反向同步（新增）
async function syncSessionFromTriMC(sessionId: string): Promise<SyncResult>

// 双向冲突检测（新增）
async function detectBidirectionalConflict(local: Session, remote: Session): Promise<ConflictReport>
```

#### 3.5.2 与五维同步衔接

**扩展方案**：

```typescript
// 现有五维
const DIM_KEYS = ['company', 'model', 'keys', 'employees', 'project'] as const;

// 扩展为六维
const DIM_KEYS_V2 = ['company', 'model', 'keys', 'employees', 'project', 'sessions'] as const;
```

**Bundle 结构扩展**：

```typescript
export interface BundleSessions {
  status: 'synced' | 'partial' | 'unavailable';
  count: number;
  latestUpdatedAt: string;
  sessionIndex: Array<{
    sessionId: string;
    title: string;
    status: string;
    updatedAt: string;
    messageCount: number;
    syncStatus: string;
  }>;
}

export interface SyncBundleV2 {
  // ... 现有字段
  sessions: BundleDim<BundleSessions>;
}
```

#### 3.5.3 与 M3 双跑衔接

**配合策略**：

| 场景 | 行为 |
|------|------|
| TriMC 不可达 | 使用本地会话（fallback） |
| TriMC 恢复 | 触发增量同步 |
| 同步期间降级 | 会话同步优先级高于 M3 fallback |

**降级保护**：

```typescript
// 同步失败时降级到本地模式
if (syncResult.ok === false) {
  console.warn('[sync] 降级到本地模式');
  useLocalSessions();
}
```

#### 3.5.4 与 session 设计衔接

**升级路径**：

| 现有能力 | 扩展方向 |
|---------|---------|
| 单域 session 同步 | 双域 session 同步 |
| SessionId 格式：`sess_{timestamp36}_{random}` | 扩展为：`sess_{timestamp36}_{nodeId}_{random}` |
| SessionRecord 字段 | 新增 `sourceNode`、`syncDirection` |
| 同步状态 | 扩展为：`local/pending/syncing/synced/error/conflicted/pulling` |

---

## 四、三面舰队模型

### 4.1 模型定义

```
┌─────────────────────────────────────────────────────────────────┐
│                        三面舰队模型                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  本地生产域（Primary）                    研发仓域（Dev）         │
│  ┌──────────────┐                      ┌──────────────┐        │
│  │ TriLC        │                      │ TriLC        │        │
│  │ sessions.db  │（独立维护）           │ sessions.db  │        │
│  └──────────────┘                      └──────────────┘        │
│         │                                      │               │
│         │ git push/pull                       │ git push/pull  │
│         ▼                                      ▼               │
│  ┌──────────────┐                      ┌──────────────┐        │
│  │ 项目仓       │                      │ 项目仓       │        │
│  │ dev 分支     │                      │ dev 分支     │        │
│  └──────────────┘                      └──────────────┘        │
│         │                                      │               │
│         └──────────────┬───────────────────────┘               │
│                        │                                       │
│                        ▼                                       │
│              ┌──────────────┐                                   │
│              │ 服务器域      │（Mirror + 主真源）                │
│              │ TriMC        │                                   │
│              │ sessions.db  │                                   │
│              └──────────────┘                                   │
│                        │                                       │
│                        ▼                                       │
│              ┌──────────────┐                                   │
│              │ 项目仓       │                                   │
│              │ dev 分支     │                                   │
│              └──────────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 域定义

| 域 | 角色 | Session 真源 | Git 真源 |
|----|------|-------------|---------|
| **本地生产域** | Primary（主工作域） | 本地 | 本地 + 服务器镜像 |
| **服务器域** | Mirror（镜像 + 推进） | 服务器（为主） + 本地镜像 | 服务器（为主） |
| **研发仓域** | Dev（独立） | 独立维护 | 独立维护 |

### 4.3 域间同步规则

| 方向 | 内容 | 频率 | 冲突策略 |
|------|------|------|---------|
| 本地 → 服务器 | Sessions + Git | 实时/增量 | 服务器优先 |
| 服务器 → 本地 | Sessions + Git | 开机/增量 | 服务器优先 |
| 研发仓 ↔ 本地/服务器 | Git only | 手动/按需 | 用户选择 |

---

## 五、技术风险评估与缓解

### 5.1 风险矩阵

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 双向同步死循环 | 中 | 高 | 增加序列号保护 + 超时机制 |
| 大量会话传输慢 | 中 | 中 | 增量拉取 + 分页 |
| 冲突解决复杂 | 高 | 中 | 先实现服务器优先策略，后续扩展 |
| 授权清单被绕过 | 低 | 高 | 服务器强制校验 + 审计日志 |
| 一致性校验失败 | 中 | 中 | 自动重试 + 用户介入兜底 |
| M3 降级期间同步失败 | 中 | 低 | 降级期间使用本地会话 |

### 5.2 关键风险缓解

#### 5.2.1 双向同步死循环

**缓解措施**：
1. 序列号保护：每次同步携带 `maxSeq`，拒绝接受小于等于 `maxSeq` 的更新
2. 超时机制：同步操作超时 30s 自动中断
3. 幂等键：`(nodeId, sessionId)` 组成幂等键，相同请求去重

#### 5.2.2 冲突解决复杂

**缓解措施**：
1. 分阶段实施：
   - Phase 1：服务器优先策略（简单）
   - Phase 2：增加用户选择（中等）
   - Phase 3：自动合并（复杂）
2. 冲突日志：所有冲突写入审计日志
3. 冲突预览：用户解决前可预览差异

#### 5.2.3 授权清单被绕过

**缓解措施**：
1. 服务器强制校验：任务执行前必须检查授权清单
2. 审计日志：所有离线任务写入日志
3. 本地验证：pull 时验证服务器是否超授权

---

## 六、分期实施建议

### 6.1 Phase 1：核心同步能力（P0）

**目标**：建立双向会话同步基础能力

**任务**：
1. 实现 `syncSessionFromTriMC()` 反向同步
2. 扩展 sync-engine 状态机（增加 `conflicted` 状态）
3. 实现 POST `/internal/v1/sessions/pull-since` 端点
4. SessionId 格式统一（增加 `nodeId`）

**验收标准**：
- 本地可 pull 服务器会话
- 服务器可 push 会话到本地
- 冲突检测正常工作

**工作量估计**：5-7 人日

### 6.2 Phase 2：冲突检测与解决（P1）

**目标**：建立完整的冲突检测与解决机制

**任务**：
1. 实现三层冲突检测（L1/L2/L3）
2. 实现服务器优先策略
3. 实现 POST `/internal/v1/sessions/resolve-conflict` 端点
4. 冲突日志记录

**验收标准**：
- 冲突检测准确率 > 95%
- 服务器优先策略正常工作
- 冲突日志完整记录

**工作量估计**：7-10 人日

### 6.3 Phase 3：授权清单机制（P2）

**目标**：建立服务器离线自动推进的授权机制

**任务**：
1. 实现授权清单存储（bundle 扩展）
2. 实现服务器校验逻辑
3. 实现本地授权确认 UI
4. 实现审计日志

**验收标准**：
- 授权清单正确生效
- 超授权任务被拦截
- 审计日志完整记录

**工作量估计**：5-7 人日

### 6.4 Phase 4：一致性校验面（P3）

**目标**：建立开机拉取同步后的一致性校验

**任务**：
1. 实现三层校验（L1/L2/L3）
2. 实现 POST `/internal/v1/sync/verify-consistency` 端点
3. 实现校验失败处理矩阵
4. 实现 HEAD 分歧 UI

**验收标准**：
- 一致性校验准确率 > 95%
- 校验失败正确处理
- 用户可正确解决 HEAD 分歧

**工作量估计**：7-10 人日

### 6.5 Phase 5：五维扩展到六维（P4）

**目标**：将 sessions 作为第六维加入 bundle

**任务**：
1. 扩展 sync-bundle.ts（增加 sessions 维）
2. 扩展 init-sync.ts（收集 sessions 元数据）
3. 扩展 bundle schema 版本
4. 向后兼容处理

**验收标准**：
- Bundle 正确包含 sessions 元数据
- 向后兼容 v1 bundle
- 同步流程正常工作

**工作量估计**：5-7 人日

### 6.6 Phase 6：与 M3 双跑衔接（P5）

**目标**：同步机制与 M3 双跑配合

**任务**：
1. 实现降级期间使用本地会话
2. 实现恢复后增量同步
3. 实现优先级控制
4. 实现降级保护逻辑

**验收标准**：
- 降级期间会话可用
- 恢复后同步正常
- 优先级控制正确

**工作量估计**：3-5 人日

---

## 七、技术接口定义

### 7.1 新增端点

#### 7.1.1 POST /internal/v1/sessions/pull-since

**请求**：
```json
{
  "lastSyncAt": "2026-08-15T18:00:00Z",
  "includeDeleted": true,
  "limit": 100
}
```

**响应**：
```json
{
  "ok": true,
  "sessions": [
    {
      "sessionId": "sess_xxx",
      "title": "...",
      "status": "active",
      "messages": [...],
      "updatedAt": "2026-08-16T09:55:00Z"
    }
  ],
  "hasMore": false,
  "lastSyncAt": "2026-08-16T10:00:00Z"
}
```

#### 7.1.2 POST /internal/v1/sessions/resolve-conflict

**请求**：
```json
{
  "sessionId": "sess_xxx",
  "localVersion": {
    "seq": 5,
    "messages": [...],
    "updatedAt": "2026-08-16T09:50:00Z"
  },
  "remoteVersion": {
    "seq": 5,
    "messages": [...],
    "updatedAt": "2026-08-16T09:55:00Z"
  },
  "strategy": "remote"
}
```

**响应**：
```json
{
  "ok": true,
  "appliedVersion": "remote",
  "mergedMessages": [...]
}
```

#### 7.1.3 POST /internal/v1/sync/verify-consistency

**请求**：
```json
{
  "verifyHead": true,
  "verifyApplied": true,
  "verifySessions": true
}
```

**响应**：
```json
{
  "ok": true,
  "headConsistent": true,
  "appliedConsistent": true,
  "sessionConflicts": [],
  "verifiedAt": "2026-08-16T10:00:00Z"
}
```

### 7.2 扩展端点

#### 7.2.1 POST /internal/v1/sessions/sync

**现有扩展**：
- 增加 `syncDirection` 字段（`push`/`pull`）
- 增加 `conflictDetection` 字段

---

## 八、技术总结

### 8.1 关键决策

| 决策点 | 裁决 | 理由 |
|--------|------|------|
| 同步协议 | 六维 bundle + HTTP 双向 | Bundle 做目录，HTTP 传内容 |
| SessionId 格式 | 增加 nodeId 前缀 | 区分来源，支持冲突检测 |
| 冲突策略 | 服务器优先（Phase 1） | 简单实现，后续扩展 |
| 授权清单 | bundle 新字段 | 复用现有机制 |
| 一致性校验 | 三层校验 | 逐层收敛，降低误报 |

### 8.2 技术可行性

| 模块 | 可行性 | 依赖 | 风险 |
|------|--------|------|------|
| 双向同步 | ✅ 可行 | sync-engine 扩展 | 冲突解决复杂 |
| 冲突检测 | ✅ 可行 | 序列号机制 | 准确率需验证 |
| 授权清单 | ✅ 可行 | bundle 扩展 | 被绕过风险 |
| 一致性校验 | ✅ 可行 | git/状态文件 | HEAD 分歧处理 |
| 三面舰队 | ✅ 可行 | 域定义清晰 | 研发仓独立维护 |

### 8.3 待产品口径确认

1. **服务器可离线自动推进的工作范围**
   - 舰队会话推进是否允许？
   - 项目状态更新是否允许？

2. **冲突解决策略用户交互设计**
   - 如何呈现冲突给用户？
   - 是否需要「预览差异」功能？

3. **授权清单默认策略**
   - 哪些任务默认允许？
   - 哪些任务必须用户确认？

4. **开机一致性体验**
   - 校验失败时如何呈现？
   - 是否需要「快速修复」按钮？

---

**方案版本**：v1.0.0
**起草人**：小狄（CTO）
**日期**：2026-08-16
**状态**：等待产品口径确认
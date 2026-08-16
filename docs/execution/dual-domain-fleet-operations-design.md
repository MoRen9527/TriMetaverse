# 双域舰队互为镜像模型设计文档

> **sourceOfTruth**: TriMetaverse/docs/execution/
> **syncMode**: design
> **lastSyncedAt**: 2026-08-16
> **owner**: 小贾（CEO 总助）
> **status**: drafting

## 一、背景

CEO 指令（2026-08-16）：

> "舰队指的是赛博公司所有成员组成的团队吧？其实这个团队在本地域和服务器域是互为镜像的吧。假设在本地：
> 1、公司开业
> 2、项目初始化（含周工作平面等标准治理体系）
> 3、与服务器域舰队会话同步
> 4、本地设备关机时段，服务器自动推进——舰队会话、周工作平面自动推进（本地域**确定/授权**服务器域可以自动推进的工作，比如周工作平面的迁移）
> 5、本地域开机，拉取项目和会话同步，完成一致性校验，继续同步工作
> 6、本地研发仓也存在同样舰队，但会话应该可以独立维护——有哪些需要同步（比如已经定了的周工作平面、项目各仓代码）"

### 核心场景（六点）

| 序号 | 场景 | 当前状态 | 缺口 |
|------|------|----------|------|
| 1 | 公司开业 | I1-I2 已完成（初始化链） | - |
| 2 | 项目初始化（含周工作平面） | I3-I4 已完成（注册点 + 五维同步） | - |
| 3 | 与服务器域舰队会话同步 | M3 双跑运营中 | 缺双向同步 |
| 4 | 本地关机时段服务器自动推进 | 周工作平面迁移已实证 | 需授权清单机制 |
| 5 | 开机拉取同步 + 一致性校验 | sync-engine 单向 | 需双向同步 + 校验面 |
| 6 | 研发仓舰队独立维护 | TriMetaverse .claude/agents | 需明确同步边界 |

### 三面舰队模型

| 域面 | 舰队载体 | 会话归属 | 真源/镜像关系 |
|------|---------|---------|---------------|
| **本地生产域** | TriCade 装后 contracts 舰队 | 会话真源本地 | 与服务器域互为镜像 |
| **服务器域** | fleet 舰队（TriMC） | 离线期自有会话 | 为主真源 |
| **研发仓域** | TriMetaverse .claude/agents 13 人 | 独立维护 | 仅 contracts 同步 |

---

## 二、现有技术资产盘点

| 资产 | 状态 | 能力 | 证据指针 |
|------|------|------|----------|
| **sync-engine** | ✅ 运营中（2026-08-14） | TriLC → TriMC 单向 session 同步 | `arch-trilc-sync/sync-engine-design.md` |
| **TaskMirrorPusher** | ✅ 运营中 | 任务状态事件推送到 TriMC | `mirror/pusher.ts` |
| **五维同步 bundle** | ✅ 运营中 | company/model/keys/employees/project | `i4-1-20260814.md` |
| **session-store v2** | ✅ 运营中 | syncStatus/cloudSessionId/lastSyncedAt | `session-store/types.ts` |
| **M3 双跑** | ✅ 运营中 | TriLC/TriMC 互为 fallback | `server-fleet-trilc-parity-plan.md` |
| **周工作平面迁移** | ✅ 已实证 | cron job 自动迁移 | `TriMC/src/cron/` |

**关键发现**：
- sync-engine 仅支持 TriLC → TriMC **单向**同步（Phase 1）
- 无 TriMC → TriLC 反向同步机制
- 无双向冲突解决规则
- 五维同步 bundle 已落地（git 载体 + applied 模型）

---

## 三、技术方案（小狄分析完成）

### 3.1 同步协议

#### 会话同步与五维同步 bundle 衔接

**建议架构**：
```
五维同步 bundle（git 载体）
  ├── company/model/keys/employees/project（现有五维）
  └── sessions（新增第六维，仅元数据）

Session 同步（双向 HTTP）
  ├── 本地 → 服务器：POST /internal/v1/sessions/sync（现有 sync-engine 扩展）
  └── 服务器 → 本地：PULL /internal/v1/sessions/pull-since { lastSyncAt }
```

**衔接方案（推荐方案A）**：
- Sessions 作为第六维加入 bundle（仅元数据：sessionId/title/status/updatedAt）
- 消息内容通过 HTTP API 同步（避免 bundle 过大）
- Bundle 只作为「会话目录」，消息内容按需拉取

#### 服务器离线期会话回流本地

**建议流程**：
```
本地开机 → POST /internal/v1/sessions/pull-since { lastSyncAt }
  → 服务器返回 { sessions: [], hasMore: boolean }
  → 本地合并到 sessions.db
```

**关键技术点**：
- `lastSyncAt` 增量拉取（避免全量传输）
- `hasMore` 分页（大量会话场景）
- 冲突标记（见 3.2）

#### 服务器舰队会话真源

**建议模型**：
- **服务器为主真源**（Source of Truth）
- **本地为镜像副本**（Mirror）
- **Session ID 格式统一**：`sess_{timestamp36}_{nodeId}_{random}`
  - `nodeId` 区分来源（服务器 vs 本地）

### 3.2 冲突解决规则

#### 三层检测

| 层级 | 检测方法 | 示例 |
|------|---------|------|
| **L1: 序列冲突** | 比较消息 seq | 本地有 seq=5，服务器也有 seq=5 |
| **L2: 时间戳冲突** | 比较 updatedAt | 同一 session，双方都修改了 |
| **L3: 内容冲突** | 比较内容 hash | 序列不同但内容相似 |

#### 冲突解决策略

| 场景 | 策略 | 理由 |
|------|------|------|
| 周工作平面冲突 | **服务器优先** | 服务器离线期自动推进更权威 |
| 舰队会话冲突 | **服务器优先** | 服务器为主真源 |
| HEAD 冲突 | **用户选择** | Git 需手动合并 |
| Session 序列冲突 | **服务器优先 + 日志** | 序列单调性，服务器 seq 更新 |

**冲突解决 API**：
```
POST /internal/v1/sessions/resolve-conflict
{
  sessionId: string,
  localVersion: { seq: number, messages: [] },
  remoteVersion: { seq: number, messages: [] },
  strategy: 'remote' | 'local' | 'merge'
}
```

### 3.3 授权清单机制

#### 服务器可离线自动推进的工作

**建议授权清单**：

| 工作类型 | 已实证 | 是否建议授权 |
|---------|--------|-------------|
| 周工作平面迁移 | ✅ | ✅ 建议 |
| 舰队会话推进 | ❌ | ⚠️ 需产品口径 |
| 项目状态更新 | ❌ | ⚠️ 需产品口径 |
| 员工 roster 同步 | ✅（五维） | ✅ 建议 |

**技术实现**：
```json
{
  "allowedOfflineTasks": {
    "weeklyPlaneMigration": true,
    "fleetSessionContinuation": false,  // 需产品口径
    "projectStatusUpdate": false       // 需产品口径
  },
  "maxOfflineDurationHours": 72
}
```

#### 授权清单存储/校验

**建议存储位置**（推荐方案A）：作为第六维加入 bundle
```json
{
  "permissions": {
    "allowedOfflineTasks": {...},
    "maxOfflineDurationHours": 72
  }
}
```

**校验机制**：
- 服务器执行任务前检查授权清单
- 本地 pull 时验证服务器是否超授权
- 超授权任务标记为 `unauthorized`，需用户确认

#### 本地授权确认

**建议 UI 交互**：
```
服务器请求执行「周工作平面迁移」
  ↓
本地弹出：「服务器请求执行 X，是否允许？」
  □ 总是允许此类任务
  [允许] [拒绝]
```

### 3.4 一致性校验面

#### 开机拉取同步后校验

**三层校验**：

| 层级 | 校验内容 | 失败处理 |
|------|---------|---------|
| **L1: HEAD 一致性** | 本地 HEAD == 服务器 applied HEAD | 呈现「HEAD 分歧」，用户选择 |
| **L2: Applied 一致性** | 本地 bundle hash == 服务器 bundle hash | 自动重新 pull bundle |
| **L3: Session 序一致性** | 本地 session seq == 服务器 session seq | 标记冲突，见 3.2 |

#### 校验失败处理

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

### 3.5 与现有资产衔接

#### 与 sync-engine 衔接

**建议扩展**：
- 现有：TriLC → TriMC 单向同步
- 扩展：
  - 新增 `syncSessionFromTriMC()` 函数（反向同步）
  - 新增 `双向 conflict detection` 逻辑
  - 状态机扩展：增加 `conflicted` 状态

#### 与五维同步衔接

**建议扩展**：
- 现有：五维（company/model/keys/employees/project）
- 扩展：
  - 新增第六维 `sessions`
  - Bundle 结构扩展：
    ```json
    {
      "sessions": {
        "status": "synced" | "partial" | "unavailable",
        "count": number,
        "latestUpdatedAt": string
      }
    }
    ```

#### 与 M3 双跑衔接

**建议配合**：
- Fallback 期间：
  - TriMC 不可达 → 使用本地会话
  - TriMC 恢复 → 触发增量同步
- 会话同步优先级低于 M3 fallback（保证可用性）

#### 与 session 设计衔接

**建议升级路径**：
- 现有：单域 session 同步
- 升级：
  - SessionId 格式统一：增加 `nodeId` 前缀
  - SessionRecord 扩展字段：`sourceNode`、`syncDirection`
  - 同步状态扩展：增加 `pulling`、`conflicted`

### 3.6 技术方案优先级

| 优先级 | 任务 | 工作量 | 依赖 |
|--------|------|--------|------|
| **P0** | Session 反向同步 API（pull-since） | 中 | 无 |
| **P1** | 冲突检测规则（三层检测） | 中 | P0 |
| **P2** | 授权清单机制（存储/校验/UI） | 低 | 无 |
| **P3** | 一致性校验面（三层校验 API） | 中 | P0+P1 |
| **P4** | 五维扩展到六维（bundle 扩展） | 中 | P0 |
| **P5** | 与 M3 双跑衔接（fallback 配合） | 低 | P0 |

### 3.7 技术风险与缓解

| 风险 | 缓解 |
|------|------|
| 双向同步死循环 | 增加序列号保护 + 超时机制 |
| 大量会话传输慢 | 增量拉取 + 分页 |
| 冲突解决复杂 | 先实现服务器优先策略，后续扩展 |
| 授权清单被绕过 | 服务器强制校验 + 审计日志 |

---

## 四、产品口径（小乔分析中）

> 等待小乔（xiaoquan-debug-reset）的产品体验分析...

### 待明确问题

#### 4.1 开机一致性体验

**用户看到什么**：
- 校验中（进度条？状态卡？）
- 有冲突（冲突列表？红绿灯？）
- 已同步（成功提示？自动继续工作？）
- 用户如何理解"双域互为镜像"？还是透明无感知？

#### 4.2 冲突心智

**冲突场景**：
- 本地和服务器都修改了周工作平面？
- 本地和服务器都推进了舰队会话？
- 用户如何选择保留哪一版？还是自动合并规则？

#### 4.3 授权清单的用户可控性

**服务器自动推进的工作**：
- 周工作平面迁移（已有实证）
- 还有哪些工作服务器可离线自动推进？
- 哪些必须本地执行（不可授权）？
- 用户如何配置授权清单？（UI？配置文件？）

#### 4.4 三面舰队模型

**三面关系**：
- 本地生产域（TriCade 装后 contracts 舰队）
- 服务器域（fleet 舰队）
- 研发仓域（TriMetaverse .claude/agents 13 人）

**会话归属**：
- 生产域会话真源本地？
- 服务器域离线期自有会话？
- 研发仓独立维护？

---

## 五、评估结论（待小乔口径确认后收口）

### 5.1 技术侧结论

**双域舰队互为镜像模型技术上可行**，需分阶段实施。

**建议实施顺序**：
1. **P0**：Session 反向同步 API（核心同步能力）
2. **P1**：冲突检测规则（三层检测）
3. **P2**：授权清单机制（存储/校验/UI）
4. **P3-P5**：一致性校验和扩展

### 5.2 分期实施建议

| 阶段 | 内容 | 优先级 | 状态 |
|------|------|--------|------|
| **Phase 1** | Session 反向同步 API | P0 | 待实施 |
| **Phase 2** | 冲突检测规则 | P1 | 待实施 |
| **Phase 3** | 授权清单机制 | P2 | 待实施 |
| **Phase 4** | 一致性校验面 | P3 | 待实施 |
| **Phase 5** | 五维扩展到六维 | P4 | 待实施 |
| **Phase 6** | 与 M3 双跑衔接 | P5 | 待实施 |

---

## 六、实施任务包（技术侧草案）

### 6.1 技术任务

| 任务 | 负责人 | 优先级 | 依赖 | 状态 |
|------|--------|--------|------|------|
| T1: Session 反向同步 API（pull-since） | 小狄 | P0 | - | pending |
| T2: 冲突检测规则（三层检测） | 小狄 | P1 | T1 | pending |
| T3: 授权清单存储/校验 | 小狄 | P2 | - | pending |
| T4: 授权清单 UI（本地授权确认） | 小全 | P2 | T3 | pending |
| T5: 一致性校验 API | 小狄 | P3 | T1+T2 | pending |
| T6: 五维扩展到六维 | 小狄 | P4 | T1 | pending |
| T7: 与 M3 双跑衔接 | 小狄 | P5 | T1 | pending |

### 6.2 产品验证（等待小乔口径）

| 验证项 | 验收标准 | 负责人 | 状态 |
|--------|----------|--------|------|
| V1: 开机一致性体验 | 校验状态呈现清晰 | 小乔 | pending |
| V2: 冲突解决 UX | 用户可理解冲突并选择 | 小乔 | pending |
| V3: 授权清单可控性 | 用户可配置授权 | 小乔 | pending |
| V4: 三面舰队边界 | 会话归属清晰 | 小乔 | pending |

---

## 附录 A：技术资产引用

| 资产 | 文档路径 | 状态 |
|------|---------|------|
| sync-engine 设计 | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-sync/sync-engine-design.md` | ✅ 运营中 |
| 五维同步 bundle | `docs/workflow/operating-records/2026-W33/trees/init-collab-i4-five-dim-sync/briefs/i4-1-20260814.md` | ✅ 运营中 |
| M3 双跑计划 | `docs/execution/server-fleet-trilc-parity-plan.md` | ✅ 运营中 |
| session 设计 | `docs/execution/session-management-design.md` | ✅ 设计完成 |

---

## 附录 B：术语表

| 术语 | 定义 |
|------|------|
| 三面舰队模型 | 本地生产域（TriCade 装后）/ 服务器域（fleet）/ 研发仓域（.claude/agents） |
| 五维同步 | company/model/keys/employees/project 五维配置同步 |
| 六维扩展 | 五维 + sessions（会话元数据） |
| 授权清单 | 本地授权服务器可离线自动推进的工作 |
| 双向同步 | TriLC ↔ TriMC 会话双向同步 |
| 一致性校验 | 开机拉取后三层校验（HEAD/Applied/Session） |

---

## 变更记录

- 2026-08-16: 初始版本（小贾起草框架 + 小狄技术分析）

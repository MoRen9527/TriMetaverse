# 分身派工技术方案

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/clone-dispatch-technical-plan.md
- syncMode: source-only
- lastSyncedAt: 2026-08-17
- status: drafting
- owner: 小狄（CTO）

> 版本：v1.0
> 日期：2026-08-17
> 背景：CEO 指令——分身派工方案技术侧分析

## 零、问题定义

**核心问题**：长会话、复杂任务可能导致"爆上下文"（token 溢出），需要分身派工机制。

**技术目标**：
1. 判定何时必须分身（爆上下文风险判定标准）
2. 分身如何与树节点对齐（分身粒度）
3. 分身 A 交付 → 分身 B 接收的握手协议（跨分身接续）
4. 分身生命周期管理（spawn/运行/交付/回收）
5. 资源占用与实测（内存/进程占用、回收机制）
6. 落点设计（编排层 + TriCompany 协同）

---

## 一、爆上下文风险判定标准

### 1.1 风险指标

| 指标 | 阈值建议 | 判定依据 | 测量方式 |
|------|----------|----------|----------|
| **工具调用次数** | ≥ 50 次/单节点 | 历史数据：i1-2 实现节点 35 次工具调用上下文健康；50 次留安全边际 | 节点 transcript 统计 |
| **预估轮次** | ≥ 10 轮/单节点 | 每轮平均 5 次工具调用 + 对话上下文 | 节点 action 描述复杂度 |
| **token 使用量** | ≥ 100K tokens/单节点 | 当前模型 150K tokens 上限，留 50K 安全边际 | 模型 API 计费统计 |
| **任务复杂度** | ≥ 3 个子任务/单节点 | 复杂度拆分后子任务独立性强 | 节点 action 分析 |
| **会话时长** | ≥ 30 分钟/单节点 | 长会话累积上下文风险 | 执行时长监控 |

### 1.2 历史事故复盘

| 事故 | 上下文使用 | 根因 | 教训 |
|------|------------|------|------|
| **W29 deepseek-v4-pro 压缩事故** | 长会话自动压缩阈值后返回 400 错误 | provider 压缩策略与上下文不兼容 | 长会话需分段处理 |
| **i1-2 实现节点** | 35 次工具调用，上下文健康 | 单节点复杂度适中，未爆上下文 | 50 次工具调用阈值合理 |
| **小全/小贾/小柯 常规节点** | 通常 < 20 次工具调用 | 简单节点单分身足够 | 轻量任务无需分身 |

### 1.3 判定阈值（建议）

**强制分身条件**（任一满足即必须分身）：
- 工具调用次数 ≥ 50
- 预估轮次 ≥ 10
- token 使用量 ≥ 100K

**建议分身条件**（满足即建议分身）：
- 任务复杂度 ≥ 3 个子任务
- 会话时长 ≥ 30 分钟
- 节点 action 描述含"多阶段"、"长流程"、"迭代"等关键词

---

## 二、分身粒度与树节点对齐

### 2.1 树节点结构（现有）

```json
{
  "treeId": "init-collab-i1-statemachine",
  "nodes": [
    {"nodeId": "i1-0", "agent": "CEOChiefOfStaff", "action": "建树", "checkpoint": {...}},
    {"nodeId": "i1-1", "agent": "ChiefTechnologyOfficer", "action": "技术拆解", "checkpoint": {...}},
    {"nodeId": "i1-2", "agent": "FullStackDeveloper", "action": "实现", "checkpoint": {...}},
    {"nodeId": "i1-3", "agent": "TestEngineer", "action": "独立验证", "checkpoint": {...}},
    {"nodeId": "i1-4", "agent": "ChiefTechnologyOfficer", "action": "验收终审", "checkpoint": {...}},
    {"nodeId": "i1-5", "agent": "CEOChiefOfStaff", "action": "收口", "checkpoint": {...}}
  ]
}
```

### 2.2 分身粒度策略

**策略一：每节点一分身（推荐）**
- 优点：与现有树节点结构完美对齐，无需修改协议
- 缺点：可能过于细碎（如 i1-0 仅建树，无需分身）
- 适用：MVP 阶段

**策略二：按复杂度动态分身**
- 优点：资源高效，轻量节点不分身
- 缺点：需修改树节点协议，增加复杂度判定逻辑
- 适用：高级阶段

**建议**：MVP 采用策略一（每节点一分身），未来演进到策略二。

### 2.3 节点边界 = 分身边界机制

**对齐规则**：
1. 每个 nodeId 对应一个分身实例
2. routedInput 机制：节点 N 读取节点 N-1 的 checkpoint 作为输入
3. checkpoint 写回：节点完成时写回自己的 checkpoint
4. Git 触发交接：节点完成 → commit → 下一节点可见（现有机制）

**冲突防护**：
- 节点文件范围锁：同一文件同一时刻只允许一个写者
- checkpoint 读写原子性：tmp → rename 原子写

---

## 三、跨分身接续机制

### 3.1 Checkpoint 传递协议

**Checkpoint 结构**（现有）：
```json
{
  "progress": "进度描述",
  "artifactCommit": "产物 commit SHA",
  "resumePoint": "下个分身入口指引",
  "backlog": "遗留事项（可选）"
}
```

**传递流程**：
```
分身 A（节点 N-1）完成
  ↓ 写 checkpoint
tree-op.json 节点 N-1.checkpoint 更新
  ↓ git commit
分身 B（节点 N）启动
  ↓ 读取 tree-op.json
分身 B 读取 routedInput = "节点 N-1:checkpoint"
  ↓ 解析 checkpoint
分身 B 获得完整上下文（progress/artifactCommit/resumePoint）
```

### 3.2 握手协议

**阶段一：分身 A 交付**
1. 分身 A 完成任务
2. 写入 checkpoint（progress/artifactCommit/resumePoint）
3. commit 到 git（Git 触发交接信号）
4. 终止进程

**阶段二：分身 B 接收**
1. 读取 tree-op.json
2. 解析 routedInput（前节点 checkpoint）
3. 验证 git commit 存在（完整性校验）
4. 从 resumePoint 开始执行

**失败处理**：
- checkpoint 读取失败 → 告警 + 人工介入
- git commit 不存在 → 告警 + 回退到前节点
- resumePoint 解析失败 → 告警 + 人工介入

### 3.3 状态保存与恢复

**状态保存**（分身 A）：
- 进度信息：checkpoint.progress（人类可读）
- 产物信息：checkpoint.artifactCommit（代码变更）
- 接续信息：checkpoint.resumePoint（下个分身入口）

**状态恢复**（分身 B）：
- 从 resumePoint 获得执行入口
- 从 artifactCommit 获得代码变更上下文
- 从 progress 获得进度上下文

**幂等性保证**：
- 同一 checkpoint 多次读取结果一致
- 崩溃恢复可从任意 checkpoint 重启

---

## 四、分身生命周期

### 4.1 Spawn（如何按岗位说明书造新分身）

**流程**：
1. 读取 tree-op.json 中节点定义
2. 提取 agent 字段（如 "ChiefTechnologyOfficer"）
3. 从 TriCompany 读取对应岗位说明书（`.claude/agents/chief-technology-officer.md`）
4. 按岗位说明书 spawn 新分身实例
5. 注入上下文（routedInput + 树节点元信息）

**技术实现**（编排层）：
```typescript
// 伪代码
function spawnClone(nodeId: string): CloneHandle {
  const node = readTreeNode(treeOpPath, nodeId);
  const role = node.agent;
  const contract = loadContract(role); // 从 TriCompany 读取
  const context = {
    routedInput: node.routedInput,
    treeId: treeOp.treeId,
    nodeId: nodeId,
    week: treeOp.week
  };
  return Agent.spawn(role, contract, context);
}
```

### 4.2 运行（独立进程、transcript 隔离）

**独立进程**：
- 每个分身独立进程（或独立会话）
- 进程间无共享可变状态
- 崩溃隔离：一分身崩溃不影响其他分身

**Transcript 隔离**：
- 每个 nodeId 对应一个独立 transcript
- 落点：`docs/workflow/operating-records/<week>/trees/<treeId>/briefs/<nodeId>-<timestamp>.md`
- 隔离好处：可并行执行、可独立回溯

### 4.3 交付（输出什么？如何确认完成？）

**输出**：
1. checkpoint：写入 tree-op.json 对应节点
2. brief：执行记录（transcript）
3. artifactCommit：代码变更 commit SHA

**完成确认**：
- checkpoint 非空
- brief 文件存在
- artifactCommit 有效（git cat-file 验证）
- 节点状态 = "done"

### 4.4 回收（进程终止、内存释放、文件清理）

**进程终止**：
- 分身完成任务后自然终止
- 超时回收：超过阈值（如 2 小时）强制终止

**内存释放**：
- 进程终止后自动释放（OS 层）
- 无需手动管理

**文件清理**：
- transcript 永久保留（审计需要）
- 临时文件自动清理（tmp 段）
- 无需手动干预

---

## 五、内存/进程占用与实测

### 5.1 现有实证

**三实例并行验证**（i1 树）：
- i1-2 小全实现（8711 实例）
- i1-3 小柯验证（8722/8723 隔离实例）
- live 8711（CEO 机）未扰动

**结论**：三实例并行可行，资源占用可控。

### 5.2 风险阈值（建议）

| 资源 | 单实例占用 | 3 实例 | 5 实例 | 风险阈值 |
|------|------------|--------|--------|----------|
| **内存** | ~500MB | ~1.5GB | ~2.5GB | 8 实例（~4GB） |
| **CPU** | 轻量 | 轻度 | 中度 | 10 实例 |
| **进程** | 1 | 3 | 5 | 20 进程 |

**建议**：MVP 限制 ≤ 5 并行分身，高级阶段可扩展。

### 5.3 回收机制

**主动回收**：
- 分身完成任务后立即终止
- 超时强制回收（如 2 小时）

**被动回收**：
- OS 进程监控（如 OOM 杀手）
- 定期清理僵尸进程

**监控指标**：
- 并行分身数
- 内存占用总量
- 进程存活时间

---

## 六、落点设计

### 6.1 编排层派工逻辑

**编排层职责**（小贾 / CEOChiefOfStaff）：
1. 树节点创建与维护
2. 分身 spawn 调度
3. checkpoint 传递协调
4. 节点状态更新（pending → in_progress → done）

**派工流程**：
```
编排层读取 tree-op.json
  ↓ 判定节点 N 需要分身
编排层调用 spawnClone(nodeId)
  ↓ 分身执行
分身完成 → 写 checkpoint
  ↓ 编排层验证
编排层更新节点状态为 "done"
  ↓ 触发下一节点
编排层 spawn 下一分身
```

### 6.2 TriCompany 岗位说明书扩展

**现有岗位说明书结构**：
```yaml
name: ChiefTechnologyOfficer
description: "适用场景：..."
tools: [Read, Glob, Grep, Write, Edit, Bash]
```

**需加分身条款**：
```yaml
cloneSettings:
  maxParallelInstances: 3  # 该岗位最大并行分身数
  timeout: 7200  # 超时时间（秒）
  resourceProfile: standard  # 资源配置（standard/heavy）
  handoverProtocol: checkpoint  # 交接协议
```

### 6.3 编排层与 TriCompany 协同

**协同规则**：
1. 编排层负责派工逻辑（when/who）
2. TriCompany 负责岗位定义（what/how）
3. 两者通过 agent 字段对接

**接口**：
- 编排层 → TriCompany：读取岗位说明书
- TriCompany → 编排层：提供分身配置（maxParallelInstances/timeout）

---

## 七、实现路径建议

### 7.1 MVP 阶段（W34）

**目标**：基础分身派工能力

**实现**：
1. 编排层手动派工（按现有树节点协议）
2. 每节点一分身（策略一）
3. checkpoint 传递机制复用现有 routedInput
4. 分身生命周期手动管理

**验收**：
- i1 树全链 6 节点分身执行成功
- checkpoint 传递无丢失
- 三实例并行验证通过

### 7.2 高级阶段（W35+）

**目标**：自动化分身派工

**实现**：
1. 爆上下文风险自动判定（阈值自动检测）
2. 动态分身粒度（策略二）
3. 自动回收机制（超时/资源监控）
4. TriCompany 岗位说明书扩展

**验收**：
- 自动判定准确率 ≥ 90%
- 资源占用可控（≤ 5 并行分身）
- 回收机制有效（无僵尸进程）

---

## 八、风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 分身数量失控 | 限制最大并行分身数（≤ 5） |
| checkpoint 传递失败 | git commit 完整性校验 + 失败告警 |
| 资源占用过高 | 资源监控 + 主动回收 |
| 分身间通信缺失 | checkpoint 作为唯一通信通道 |
| 岗位说明书不完整 | MVP 手动补全 + 高级阶段扩展 |

---

## 九、下一步行动

1. **与编排层对接**：确认派工逻辑实现方式（手动 vs 自动）
2. **TriCompany 扩展**：岗位说明书加分身条款
3. **MVP 验证**：i1 树全链分身执行验证
4. **资源监控**：内存/进程占用实测

---

> **变更记录**：
> - 2026-08-17：初始版本（小狄根据 CEO 指令创建）

# 分身派工协议 —— 组织 HC 机制

> **版本**: v0.3
> **日期**: 2026-08-22（v0.2: 2026-08-17）
> **状态**: 架构升级（CEO 方案级输入）；v0.3 增量＝分身调度前置（TMV-P1-6，新增 §十，v0.2 正文不动）
> **负责人**: 小贾（CEOChiefOfStaff）收口；小乔（产品）、小狄（技术）、CHO（人力）联合分析

## 文档定位

本协议定义 TriCompany **数字化员工（分身）的编制管理机制**——分身不再是编排层技术技巧，而是 TriCompany 正式组织行为。

**根问题**：长任务（3-5 小时）导致 transcript 膨胀，context 窗口耗尽，agent 无法继续工作。已发生三次实证事故（小全/小贾/小柯）。

**解决思路（CEO 方案）**：
- **岗位-员工分离**：md 岗位说明 = 组织结构（岗位职责）；分身实例 = 真正的员工（在岗者）
- **增员（spawn）= CHO 审批的 HC 编制流程**
- **裁撤（回收）= CHO 减员机制**
- **职责链**：小贾（需求判定+任务分拆）→ CHO（增员审批+编制管理）→ 编排层（执行 spawn/回收）

**组织设计第一原则落地**：分身是数字化员工，按员工生命周期管理，而非技术资源池。

---

## 一、架构升级（CEO 方案级输入）

### 1.1 从"技术协议"到"组织 HC 机制"

| 维度 | 原方案（技术协议）| 新方案（组织 HC 机制）|
|------|-----------------|-------------------|
| **分身定位** | 编排层技术技巧 | 数字化员工（在岗者）|
| **岗位说明** | 技术配置文件 | 组织结构（岗位职责）|
| **增员（spawn）** | 编排层直接执行 | CHO 审批的 HC 编制流程 |
| **裁撤（回收）** | 编排层自动回收 | CHO 减员机制 |
| **职责链** | 编排层单点负责 | 小贾 → CHO → 编排层 |
| **风险管控** | 技术阈值 | HC 总量控制 + 编制审计 |

### 1.2 岗位-员工分离

```
┌─────────────────────────────────────────────────────┐
│ 组织结构层（TriCompany 岗位说明书）                 │
├─────────────────────────────────────────────────────┤
│ • md 岗位说明 = JD（岗位职责）                      │
│ • contract.yaml = 决策权限/工具权限/IO 契约         │
│ • 五件套 = soul/agent-body/memory/colleagues/social │
│ • 固定资产：不随分身实例变化                       │
└─────────────────────────────────────────────────────┘
                    ↓ 按岗招聘
┌─────────────────────────────────────────────────────┐
│ 在岗员工层（分身实例）                              │
├─────────────────────────────────────────────────────┤
│ • 分身 A = 按 JD 创建的实例 1                       │
│ • 分身 B = 按 JD 创建的实例 2                       │
│ • 独立进程 + 空白 transcript                        │
│ • 流动资产：随任务创建/回收                         │
└─────────────────────────────────────────────────────┘
```

### 1.3 职责链

```
小贾（需求判定+任务分拆）
  ↓ 提交 CLONE_STAFFING_REQUEST
CHO（增员审批+编制管理）
  ↓ 回执 CLONE_STAFFING_APPROVAL
编排层（执行 spawn）
  ↓ 创建分身实例
小贾（通知分身已就绪）
  ↓
分身（执行任务）
  ↓ 完成后自然回收 / 超时裁撤
编排层/小贾
  ↓ 提交 CLONE_TERMINATION_REQUEST
CHO（裁撤审批）
  ↓ 回执 CLONE_TERMINATION_APPROVAL
编排层（执行回收）
```

### 1.4 与 trees 协议接续

| 概念 | 对应关系 |
|------|---------|
| 员工在岗 | 节点执行（分身执行 tree 节点）|
| 换人 | 节点边界（routedInput 传递 checkpoint）|
| 交接 | checkpoint 机制（progress/artifactCommit/resumePoint）|
| 离职 | 分身回收（裁撤）|

---

## 二、CHO 岗位职责增量

### 2.1 分身编制管理

| 条款 | 说明 |
|------|------|
| **编制审批** | 审批小贾提交的分身增员需求（依据：任务复杂度/资源阈值/HC 总量）|
| **编制总量控制** | 维护公司级分身编制上限（默认 ≤ 5 并行分身）|
| **编制分配** | 按岗位优先级分配 HC（CEOChiefOfStaff/CTO/CPO）|
| **编制回收审批** | 审批分身裁撤请求（依据：任务完成/超时/失败）|

### 2.2 与编排层接口

| 接口 | 说明 |
|------|------|
| **增员回执** | 审批通过后，回执编排层执行 spawn（内容：批准分身数/岗位/时长）|
| **减员回执** | 审批通过后，回执编排层执行回收（内容：裁撤分身编号/原因）|
| **编制状态同步** | 定期向编排层推送当前 HC 使用情况（分身数/编制上限/空闲编制）|

### 2.3 风险管控

| 风险 | 管控机制 |
|------|---------|
| 分身泛滥 | HC 总量上限 + 增员审批门槛 |
| 分身僵尸 | 超时自动回收（2h）+ 定期编制审计 |
| 资源耗尽 | 内存监控（单实例 >1GB 告警）+ 并发上限 |
| 编制失控 | 定期（周度）编制报告 + CEO 升级机制 |

### 2.4 岗位说明 md 修订建议

**chief-human-resources-officer.contract.yaml 新增**：
```yaml
responsibilities:
  - 维持分身编制（HC）总量控制与分配
  - 审批分身增员需求（spawn）与裁撤请求（回收）
  - 管理分身员工生命周期：增员/在岗/减员/裁撤
  - 定期审计分身编制使用情况与资源占用
```

**decision_rights 新增**：
```yaml
decision_rights:
  approve:
    - 分身增员需求（在 HC 总量上限内且符合岗位优先级）
    - 分身裁撤请求（任务完成/超时/失败）
  freeze:
    - 超出 HC 总量上限的增员需求
    - 编制使用不明确或资源占用异常的裁撤请求
  escalate:
    - 超出默认 HC 上限（>5 并行分身）的增员需求 → CEO
    - 分身编制失控或资源耗尽 → CEO + CTO
```

---

## 三、产品侧方案（小乔）

### 3.1 CEO 下任务的用户体验

**自动分身 vs 人工选择**：
- **推荐**：自动分身（编排层判定触发，CHO 审批）
- **理由**：CEO 不应承担技术决策负担
- **提示时机**：任务长度预估超过阈值（如 20 条以上）

**提示文案建议**：
```
⚠️ 任务较长（预估 XX 条），已申请增员（分身）
- 分身 A：[阶段1名称] 待 CHO 审批
- 分身 B：[阶段2名称] 待 CHO 审批
- 汇总入口：[链接]
```

### 3.2 分身可见性

**分身列表展示**：
- **形态**：编排层提供分身状态面板（OP 记录或单独视图）
- **字段**：分身编号 × 任务节点 × 状态（idle/running/done/error） × 当前产出路径
- **更新频率**：SSE 推送或轮询（15s）

**分身边界标识**：
- **规则**：按 tree-op.json 节点边界划分（一棵树 → 一批分身）
- **可见性**：节点名称 + 分身编号（例：节点"产品口径分析" → 分身 A-1、A-2）

### 3.3 "每次新任务启新分身不管满没满"口径利弊

**优点（空白账本）**：
- 零上下文负担：新分身无历史 transcript，token 利用率最大化
- 隔离性强：任务间互不干扰，失败不传染

**缺点（上下文延续性损失）**：
- 经验传递断裂：老分身「怎么做成」的知识无法自动继承
- checkpoint 依赖：需显式设计资产沉淀机制

**老分身经验传递方案**：
| 传递内容 | 传递方式 | 落点 |
|----------|----------|------|
| 纪律/规范 | 显式写入 TriCompany `.claude/agents/` | registry/公司治理文档 |
| 关键发现 | brief 模板化摘要 | `docs/execution/` 或树 brief |
| 工作流模式 | 可复用流程登记入 playbook | TriCompany runtime |

**结论**：优点大于缺点——空白账本符合「每次新任务干净重启」的 CEO 意图，经验传递通过显式资产沉淀机制解决（这是 TriCompany 存在的意义）。

### 3.4 分身失败处理

| 失败类型 | 处理方式 | CEO 可见性 |
|----------|----------|------------|
| 单个分身失败 | 其他分身继续，失败分身标记 error | 状态面板红色标记 |
| 全部失败 | 编排层告警 + 降级单分身重试 | 明确提示 + 重试入口 |
| 分身超时（>30min 无进展）| 自动终止 + 保留 transcript | 日志记录 + 复查入口 |

---

## 四、技术侧方案（小狄）

### 4.1 爆上下文风险判定标准

**强制分身条件**（任一满足即必须）：
- 工具调用 ≥ 50 次
- 预估轮次 ≥ 10 轮
- token 使用量 ≥ 100K

**建议分身条件**：
- 任务复杂度 ≥ 3 个子任务
- 会话时长 ≥ 30 分钟

**历史事故数据**：
- W29 deepseek-v4-pro 压缩事故（长会话）
- i1-2 实现节点 35 次工具调用上下文健康
- 小全/小贾/小柯 三次长任务事故

### 4.2 分身粒度与 trees 节点对齐

**策略一（推荐 MVP）**：每节点一分身
- 与现有树节点结构完美对齐
- 节点边界 = 分身边界
- routedInput 机制、checkpoint 读写、Git 触发交接

**策略二（高级阶段）**：按复杂度动态分身
- 资源高效
- 需更细粒度判定逻辑

### 4.3 跨分身接续机制

**Checkpoint 结构**：
```json
{
  "progress": "进度描述",
  "artifactCommit": "产物提交信息",
  "resumePoint": "接续入口（下一个节点的入口）",
  "backlog": "遗留事项"
}
```

**握手协议**：
1. 分身 A 交付：写 checkpoint + commit
2. 分身 B 接收：读取 routedInput + 验证完整性
3. 失败处理：告警 + 人工介入

### 4.4 分身生命周期

| 阶段 | 动作 | 说明 |
|------|------|------|
| **Spawn** | 读取 tree-op.json → 提取 agent 字段 → 从 TriCompany 读取岗位说明书 → 按 JD spawn | 独立进程 + 空白 transcript；需 CHO 审批 |
| **运行** | 独立进程、transcript 隔离（briefs/<nodeId>-<timestamp>.md）、崩溃隔离 | |
| **交付** | 输出 checkpoint + brief + artifactCommit | 完成确认 = checkpoint 非空 + brief 存在 + artifactCommit 有效 |
| **回收** | 任务完成后自然终止；超时回收（2 小时阈值）；需 CHO 裁撤审批 | OS 层内存自动释放 |

### 4.5 内存/进程占用与实测

**已验证数据**：
- 三实例并行已验证可行（i1-2 小全实现 + i1-3 小柯验证 + live 8711 未扰动）
- 单实例 ~500MB 内存，3 实例 ~1.5GB，5 实例 ~2.5GB

**风险阈值**：
- MVP 限制 ≤ 5 并行分身（CHO 编制总量控制）
- 高级阶段可扩展（需 CEO 审批）

### 4.6 落点设计

**编排层职责**：
- 树节点创建/维护
- 向 CHO 提交分身增员/裁撤请求
- 执行 CHO 批准的 spawn/回收
- checkpoint 传递协调
- 节点状态更新

**TriCompany 扩展**：
- 岗位说明书加分身条款（maxParallelInstances/timeout/resourceProfile/handoverProtocol）
- CHO contract 增加分身编制管理条款

**协同接口**：
- 小贾 → CHO：CLONE_STAFFING_REQUEST / CLONE_TERMINATION_REQUEST
- CHO → 编排层：CLONE_STAFFING_APPROVAL / CLONE_TERMINATION_APPROVAL
- 编排层 → TriCompany：读取岗位说明书
- 编排层 → CHO：推送资源占用报告

---

## 五、编排层经验资产收入 TriCompany 路径（小贾）

### 5.1 资产分类与当前落点

| 资产类型 | 当前落点 | 状态 |
|---------|---------|------|
| **会话记忆** | `C:/Users/jedih/.claude/projects/D--Code-ai-TriMetaverse/memory/*.md` | 分散在本地，部分已公司化 |
| **工程纪律** | `TriCompany/docs/workflow/engineering-disciplines.md` | ✅ 已落盘（D-01~D-05） |
| **编排流程** | `TriMetaverse/docs/workflow/chief-of-staff-rd-orchestration.md` | 📌 需同步源侧 |
| **任务包模板** | `TriMetaverse/docs/workflow/tricompany-handoff-objects.md` | 📌 需同步源侧 |
| **收稿三查流程** | 已嵌入 engineering-disciplines.md D-01 | ✅ 已落盘 |

### 5.2 收入路径矩阵

| 资产类型 | 收入路径 | 落点位置 | 维护责任 |
|---------|---------|---------|---------|
| **跨域通用纪律** | 会话记忆 → TriCompany 真源 | `TriCompany/docs/workflow/engineering-disciplines.md` | CAO（治理文档归属） |
| **岗位特定经验** | 会话记忆 → 岗位 memory | `TriCompany/source-agents/<岗位>/memory.agent.md` | 对应岗位 owner |
| **编排流程** | 发布副本 → 源侧同步 | `TriCompany/docs/workflow/*.md` | CEOChiefOfStaff |
| **任务包模板** | 发布副本 → 源侧同步 | `TriCompany/docs/workflow/handoff-objects.md` | CEOChiefOfStaff |
| **技能规范** | 已验证经验 → SKILL_SPEC | `TriCompany/docs/workflow/handoff-objects.md` + template | CEOChiefOfStaff/CTO |

### 5.3 知识工作区分层

```
┌─────────────────────────────────────────────────────┐
│ TriCompany 真源层（公司资产）                       │
├─────────────────────────────────────────────────────┤
│ • 工程纪律（三端通用）                              │
│ • 岗位说明书（五件套 + contract）                   │
│ • 编排流程文档                                      │
│ • 交接对象规范（handoff-objects）                   │
└─────────────────────────────────────────────────────┘
                    ↓ 引用路径
┌─────────────────────────────────────────────────────┐
│ 培训材料层（RAndDTrainer 维护）                     │
├─────────────────────────────────────────────────────┤
│ • 新人 onboarding 导读                              │
│ • 模块讲解                                          │
│ • 工程流程培训                                      │
└─────────────────────────────────────────────────────┘
                    ↓ 知识通道
┌─────────────────────────────────────────────────────┐
│ 运行时知识层（employee knowledge workspace）        │
├─────────────────────────────────────────────────────┤
│ • 岗位特定记忆（memory.agent.md）                    │
│ • 工作关系（colleagues.agent.md）                    │
│ • 阶段性工作记录                                    │
└─────────────────────────────────────────────────────┘
```

### 5.4 分身派工相关条款落点

| 条款类型 | 落点位置 | 更新方式 |
|---------|---------|---------|
| **分身判定标准** | 岗位 contract.yaml + agent-body | CTO/总助联合设计 |
| **分身接续机制** | 编排流程文档 + trees 协议 | CEOChiefOfStaff 维护 |
| **分身 HC 治理** | CHO contract.yaml + agent-body | CHO 维护 |
| **checkpoint 规范** | handoff-objects（新增 CLONE_CHECKPOINT 对象）| CEOChiefOfStaff |
| **分身生命周期** | 岗位 contract.yaml | 各岗位 owner |

---

## 六、实现路径

### 6.1 MVP 阶段（W34）

1. 小贾手动判定分身需求
2. 手动提交 CHO 审批——**MVP 不跳过**（CEO 裁决 2026-08-17：E2E 脚本固化为 CHO 审批链首演，验证机制本身）
3. 每节点一分身（策略一）
4. checkpoint 传递复用现有 routedInput
5. 分身生命周期手动管理

**验收**：i1 树全链 6 节点分身执行成功

### 6.2 高级阶段（W35+）

1. 自动判定分身需求（技术阈值）
2. CHO 自动审批（HC 总量内）
3. 动态分身粒度（策略二）
4. 自动回收机制
5. TriCompany 岗位说明书全面扩展

---

## 七、风险与回收机制

### 7.1 HC 总量控制

| 机制 | 说明 |
|------|------|
| **HC 上限** | 默认 ≤ 5 并行分身（CHO 维护）|
| **编制分配** | 按任务需求动态分配（CEO 裁决 2026-08-17：CHO 管总量，静态岗位表仅作示例）|
| **扩容审批** | 需升级 CEO |

### 7.2 超时自动回收

| 条件 | 动作 |
|------|------|
| 分身无进展 >2h | 自动终止 + 保留 transcript + CHO 更新编制台账 |
| 任务完成后 | 自然回收 + CHO 更新编制台账 |
| 失败后 | 等待 CHO 裁撤审批 |

### 7.3 定期审计

| 频率 | 内容 | 责任人 |
|------|------|--------|
| 周度 | 编制使用情况/资源占用/空闲编制 | CHO |
| 月度 | 分身效率评估/编制上限调整建议 | CHO + CEOChiefOfStaff |

---

## 八、文档落盘纪律（D-01）

- 本文档遵循 D-01 subagent 落盘纪律
- 先写文件、后总结
- 总结须带：文件路径 + 行数证据

**落盘证据**：
- 文件路径：`docs/execution/clone-dispatch-protocol.md`
- 行数：约 400 行（含本节）
- 状态：已落盘，待编排层提交

---

## 九、致谢

本协议由 CEO 方案级输入升格，小贾收口组织，小乔（产品）、小狄（技术）、CHO（人力）联合分析完成。

**架构设计**：岗位-员工分离原则落地；分身 = 数字化员工；增员/裁撤 = HC 机制。

---

## 十、placement 策略与执行面统一（v0.3 增量，2026-08-22）

> 本节为 TMV-P1-6 批产出（CTO 小狄），响应 CEO 重定义问题 ④ 后半（岗位说明书式分身调度）。v0.2 正文全部保留不动；本节是 §4.6 预留字段方向（maxParallelInstances/timeout/resourceProfile/handoverProtocol）的首个落地增量。规格性质——非实施决定；实施归 R6 1.5 三批（R6:88-96）。

### 文档同步元信息（v0.3 增量节）

- sourceOfTruth: TriMetaverse/docs/execution/clone-dispatch-protocol.md §十
- syncMode: source-only
- lastSyncedAt: 2026-08-22

### 10.1 裁决基线

- R4 §四方案 A 三件（R4:186-190）：contract placement 字段 / CLONE_STAFFING_REQUEST 增字段＋CHO 按域分账 / 双执行面统一接口＋服务器侧门禁补齐。
- R8 §1.3 裁决（R8:50-58）：四值不动，不细分 daemonLocal/podEdge；runtimeForm 归 resourceProfile 可选维度；either＝CHO 分账裁决，非自动负载均衡、非 k8s 调度语义。
- 决策三分法：**APPROVE**（字段规格层——走既有协议演进路径，非新机制；e2e-staffing 链路测试基座在案，R4:196）。

### 10.2 contract.yaml placement 策略字段

**字段定义**（岗位合同顶层，与 decision_rights/toolControl 同级）：

```yaml
placement:
  policy: preferLocal        # mainControllerOnly | preferServer | preferLocal | either
```

**域语义映射**（MVP）：`server` 域＝服务器执行面，当前映射 TriMMC session-bridge spawn（元虚拟 claude 会话面）；TriRMC 进程内会话执行面（R8:206 阶梯 0）落地后同属 server 域——执行面枚举可扩展，CHO 分账的 serverQuota 覆盖两者。`local` 域＝编排层本机执行面（现状，隐含 CEO 机器，R4:183）。

**四值语义**：

| 值 | 语义 | 落位裁决权 | 典型岗位画像 |
| --- | --- | --- | --- |
| mainControllerOnly | 仅主控（服务器）域可落位；本地落位申请一律拒绝 | CHO（无裁量，硬约束） | 7×24 常驻、公网面、服务器数据源、公司资产操作（R8:79-82 混合规则表） |
| preferServer | 优先服务器域；服务器编制满或不可用时可回退本地 | CHO（回退＝placement 变更，须重批） | 算力密集、与服务器协同面大 |
| preferLocal | 优先本地域（本地文件/IDE/宿主就近——任务-资源亲和矩阵 5/7 维占优，R8:39）；本地不可用回退服务器同理 | CHO（回退重批同上） | 写代码类、本地工作区操作（CEO 例举画像） |
| either | 无域偏好；CHO 按两域编制余额与成本域裁决落位 | CHO（分账裁决——R8:58：不是自动负载均衡，不是 k8s 调度语义） | 通用任务型岗位 |

**默认值**：`preferLocal`。存量合同未声明 placement 时行为不变——现状 spawn 执行面即编排层本机进程（R4:183），缺省值保持向后兼容；其余三值为显式 opt-in。

**校验规则**（fail-fast，对齐 AgentContractV3 只收 v3 的收敛先例）：

1. 枚举校验：仅接受四值；未知值 → 合同加载失败（不静默降级到默认值）。
2. 岗位级声明：placement 只出现在岗位 contract（JD 固定资产层，§1.2），不进分身实例运行参数——运行期改落位＝placement 变更，必须重走 CHO 审批（防 JD 被运行时架空；§四 方案 B 否决理由同源，R4:191）。
3. 正交性：placement 管资源域（服务器 vs 本地），runtimeForm 管执行形态（原生 vs 容器），互不蕴含（R8:52-56——JD 层不出现运行形态概念）。
4. 不透传基础设施层：placement 在 CHO 层消化，不映射 k8s nodeSelector/affinity（R8:200——业务语义不漏进基础设施层，CHO 保持编制单一真源）。

### 10.3 resourceProfile 可选维度：runtimeForm

**字段定义**（§4.6 resourceProfile 预留方向的首个子维度）：

```yaml
resourceProfile:
  runtimeForm: native        # native | container
```

- **默认 native**；MVP 仅 native 有执行面。
- **container 触发条件＝任务沙箱画像**（不受信代码、需隔离），不是域偏好（R8:56）——沙箱任务裁决走向服务器容器（compose/k8s 资产已在，R8:81），不落用户 PC。
- **校验**：枚举两值，合同层可前瞻声明；执行层无匹配执行面时 CHO **FREEZE**（编制裁决面拦截，而非合同加载失败）。本地容器形态（podEdge B2）MVP 不做、登记后置选项（R8:63、R8:82、R8:224）。

### 10.4 CLONE_STAFFING_REQUEST 增 placement 字段＋CHO 按域分账编制规则

**请求增字段**（小贾 → CHO）：

```yaml
placement: either            # 申请落位；缺省取岗位 JD 声明
```

**回执增字段**（CHO → 编排层）：

```yaml
grantedPlacement: server     # CHO 裁决后的实际落位域（local | server）
domainQuotaSnapshot:         # 审批时两域用量快照（审计用）
  local:  { used: 2, cap: 5 }
  server: { used: 1, cap: 3 }
```

**CHO 按域分账规则**（R4:188 原文语义：服务器编制与本地编制分上限——服务器资源是公司资产，本地是 CEO 机器，成本域不同）：

1. **两域分账**：localQuota / serverQuota 独立上限，CHO 维护台账；§2.1「默认 ≤5 并行分身」演进为按域各自上限。初始值建议 localQuota=5（保持现状）、serverQuota 由 CHO 会同 CEO 新设——**编制数值归 CHO 台账，不在本协议固化**（对齐 §7.1 CEO 裁决口径：CHO 管总量）。
2. **一致性前置**：申请 placement 不得违背 JD 的 mainControllerOnly 硬约束（违背 → CHO 直接拒绝，FREEZE）。
3. **计数规则**：每分身计入 grantedPlacement 域；跨域回退后计入回退域。
4. **校验规则**：mainControllerOnly 只校验 serverQuota；preferLocal/preferServer 校验首选域余额，回退校验回退域余额；either 由 CHO 综合两域余额与成本域裁决。
5. **超限处置**：超域上限 → **FREEZE**（对齐 CHO contract decision_rights freeze 条款，§2.4）；扩容 → escalate CEO（§2.4 escalate 条款同源）。
6. **审计**：审批回执落 grantedPlacement＋两域 before/after 用量（json 审计先例＝CHO-staffing-\<requestId\>.json，TriLC/src/company/staffing.ts:199-214）。

### 10.5 双 spawn 执行面统一接口＋服务器侧 roster 门禁补齐

**现状缺口**（R4:183、R4:264 风险 8）：spawn 执行面两处互不知晓——本地＝编排层进程（隐含本机）；服务器＝session-bridge spawn（R1，无 roster 门禁记载）。分身跑服务器若绕过名册决策面，gating 真源被架空（R4:189）。

**统一接口**（同请求/回执/审计 schema，平面无关——本地 spawn / bridge-1 服务器 spawn / 未来 TriRMC 进程内会话（R8:206）三执行面共用）：

```yaml
# SpawnRequest（编排层 → 任一执行面）
requestId: spawn_xxx
roleId: chief-technology-officer        # JD 引用（岗位固定资产层）
approvalRef: <CLONE_STAFFING_APPROVAL 的 requestId>   # 必填，审批链锚点
placement: server                       # = grantedPlacement（执行面核一致）
runtimeForm: native
taskRef: "<tree-id>/<nodeId> 或 OP 条目号"
maxDuration: 2h
requestedBy: ceo-chief-of-staff

# SpawnReceipt（执行面 → 编排层）
instanceId: <执行面侧实例标识>
plane: local | server                   # 亦作裁撤回收路由键（CLONE_TERMINATION 执行时定位执行面）
spawnedAt: <ISO 8601>
expiresAt: <超时裁撤阈值点，§7.2 2h 口径>
auditRef: <审计记录引用>

# AuditRecord（每执行面每次 spawn 必落）
requestType: CLONE_SPAWN_EXECUTION
approvalRef / plane / roleId / spawnedAt / taskRef
```

**服务器侧 roster 门禁补齐（风险 8 处置，硬要求）**——任何执行面 spawn 前强制**门禁三查**：

1. **凭证查**：approvalRef 有效（CHO 审批回执存在且 decision=approved）。roster 在岗校验（isRoleActive 单一真源，TriLC/src/company/staffing.ts:125-127；三处门禁共用语义 :7-11/:94-99）在 CHO 审批链内完成——审批即名册决策面，执行面不复制第二 roster 真源（R8:200 CHO 编制单一真源同族原则）。
2. **一致查**：请求 placement 与回执 grantedPlacement 一致；runtimeForm 有可用执行面。
3. **域额查**：grantedPlacement 域当前用量不超上限（以 CHO 审批时点 domainQuotaSnapshot 为准；执行面只拒绝、不裁决）。

- **实现形态**：MVP＝审批凭证随请求携带（SpawnRequest 必带 approvalRef，执行面可独立校验，无 roster 数据依赖——session-bridge 无需新增名册同步面）；执行面主动回查 roster（需名册查询面）列后置选项。
- **违例行为**：拒绝 spawn＋落审计记录（不静默——对齐 RosterGateResult error 语义，staffing.ts:101-106）。
- **归期**：与 bridge-1 统一执行面批联动（R6:94 第三批；期 3 交付物「服务器 spawn roster 门禁＋双执行面统一」，R6:245）。

### 10.6 v0.3 落盘证据（D-01）

- 文件路径：`docs/execution/clone-dispatch-protocol.md`（§十 增量，v0.2 正文 418 行不动）
- 行数：v0.3 增量 131 行（§十，:419-549）；全文档 549 行
- 状态：规格已落盘，待编排层提交；实施归 R6 1.5（期 1 placement＋CHO 分账两批，R6:227；期 3 门禁统一批，R6:245）

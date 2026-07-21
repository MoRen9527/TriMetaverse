# CPO 升级简报：PC 端四模块边界与协作关系重定义

**发起人**：小贾（CEO 总助）  
**升级类型**：`ESCALATE` — 触碰产品边界、模块协作协议与任务生命周期归属  
**日期**：2026-07-19  
**上游真源**：`docs/三元宇宙架构与模块说明.md` §4 模块表  
**状态**：待 CPO 裁决

---

## 1. 升级原因

对 TriPilot 实际运行时路径审计发现：**TriPilot webview 当前在 VS Code 扩展进程内本地执行工具调用**（`extension.ts` L5995 `executeToolCall()`），而不是将所有执行委托给 TriLC daemon。这导致关闭 IDE 会杀死正在运行的任务——与架构文档定义的"TriPilot 为显示/交互窗口、TriLC 为 detached local runtime"存在实质性偏差。

CEO 在审计过程中进一步明确了 PC 端四模块的正确协作关系（见 §3），需要 CPO 在以下层面做出正式裁决。

---

## 2. 当前偏差事实

| 项目 | 架构文档定义 | 实际运行时 | 偏差等级 |
|------|-------------|-----------|---------|
| TriPilot 工具执行 | 应委托 TriLC 执行 | `extension.ts` L5995 本地 `executeToolCall()` | **严重** |
| TriPilot↔TriLC 协议 | 应覆盖 LLM + 工具执行 | 仅 LLM streaming（Anthropic SSE `/v1/messages`） | **严重** |
| TriCode bridge | 应由 TriLC 调用 | `tricodeBridge.ts` 仅被 CLI 引用，未被 webview 路径导入 | **中等** |
| 任务生命周期 | TriLC daemon 保证 | VS Code 扩展进程生命周期（IDE 关 = 任务死） | **严重** |
| TriLC daemon | `runtime/daemon.ts` `submitTask()` 已实现 | 未被 TriPilot 调用 | **中等** |

**关键代码位置**：
- TriPilot `extension.ts` L5884-6027：`runTrilcDirectRequest()` 本地工具执行循环
- TriPilot `extension.ts` L5995：`result = await executeToolCall(toolName, toolInput, {...})` （偏差核心）
- TriLC `runtime/daemon.ts` L49：`submitTask()` — 已存在但未被连接的 daemon 任务提交入口
- TriLC `app.ts` L1098-1180：`POST /internal/v1/sessions/recover` — 已存在但未被使用的会话恢复端点

---

## 3. CEO 明确的架构意图（2026-07-19）

### 3.1 统一中枢模型

```
入口层（多入口）
├── TriPilot（IDE 入口）
├── CLI 入口
├── 未来：移动端入口（占位）
└── 未来：元宇宙入口（占位）
        │
        ▼
    ┌─────────┐
    │  TriLC  │  ← 唯一中枢编排器
    │ (daemon) │
    └────┬────┘
         │ 判断：是否为研发任务？
    ┌────┴────┐
    ▼         ▼
┌─────────┐  ┌──────────────────┐
│ TriCode │  │ TriLC 自有 loop  │
│+opencode│  │ · 工具调用       │
│+claude  │  │ · 运营编排       │
│  code   │  │ · 写代码（通用） │
│+codex   │  │ · 办公自动化     │
└─────────┘  └──────────────────┘
    │              │
    └──────┬───────┘
           │ 均由 TriLC daemon 管理生命周期
           │ IDE/CLI 关闭 ≠ 任务终止
           ▼
      TriPilot 重连 → 查看/继续会话
```

### 3.2 关键原则

1. **TriPilot 不直接感知 TriCode**。TriPilot 只与 TriLC 通信。TriCode 是 TriLC 调用的子工具。
2. **TriLC 是唯一中枢**。所有入口都先到 TriLC，由 TriLC 判断任务类型后分叉：
   - **研发任务** → TriLC 调用 TriCode + opencode / claude code / codex
   - **非研发任务** → TriLC 自有执行循环（工具调用、运营编排、甚至写代码）
3. **两条线都不随 IDE/CLI 关闭而终止**。TriLC daemon 管理所有子进程（包括 TriCode+opencode），IDE 只是显示窗口。
4. **两端最终合并**。当 TriLC 自有 loop 足够成熟后，TriCode 研发路径可退役，TriLC 统一处理所有任务类型。

### 3.3 模块边界修正

| 模块 | 当前文档定义 | CEO 意图修正 |
|------|-------------|-------------|
| **TriPilot** | "桌面聊天入口、本地域工具入口、本地控制与显示入口" | **不变**，但强调：只做显示+交互，零工具执行 |
| **TriLC** | "detached local runtime、planner、tool bus、本地执行生命周期" | **升级**：唯一中枢编排器，接收入口意图、任务分类、分叉路由、daemon 保证生命周期 |
| **TriCode** | "TriPilot 插件与 opencode 的 glue 适配层" | **修正**：TriLC 的子工具，不再定位于 TriPilot 插件；包装 opencode/claude code/codex 供 TriLC 调用 |
| **VSCodium** | "IDE 宿主基础设施" | **不变**，但需适配 TriPilot 作为纯窗口的新协议 |

---

## 4. 两条执行路径详细对比

| 维度 | TriCode 路径（研发） | TriLC 自有路径（运营） |
|------|---------------------|----------------------|
| **触发条件** | TriLC 判断为研发/编码任务 | TriLC 判断为非研发任务 |
| **执行引擎** | TriCode → opencode / claude code / codex | TriLC 自有 agent loop + tool bus |
| **适用场景** | 写代码、重构、调试、code review | 公司运营、办公自动化、流程编排、通用任务 |
| **目标用户** | TriCompany 研发员工 | TriCompany 全体员工（含非研发） |
| **生命周期** | TriLC daemon 管理，IDE 关闭不终止 | TriLC daemon 直接管理 |
| **会话恢复** | 通过 TriLC `POST /internal/v1/sessions/recover` | 通过 TriLC daemon 任务树 |
| **未来演进** | TriLC 成熟后可退役 | 最终统一路径 |

---

## 5. 需 CPO 裁决的五个问题

### Q1: TriPilot 的产品边界
TriPilot 是否应严格定义为"零执行能力的显示+交互窗口"？如果是，其产品 feature set 是否需要裁剪——移除所有工具执行相关的 UI 和状态管理？

### Q2: TriPilot↔TriLC 通信协议
当前 TriPilot 仅通过 Anthropic SSE 流获取 LLM 输出。新架构需要 TriPilot 将所有用户意图（含工具调用请求）发送给 TriLC，并从 TriLC 获取执行结果。这个协议应该如何定义？是扩展现有 SSE 通道还是新增 WebSocket/HTTP 端点？

### Q3: TriCode 的产品定位修正
当前 `三元宇宙架构与模块说明.md` 定义 TriCode 为"TriPilot 插件与 opencode 的 glue 适配层"。CEO 意图将其修正为"TriLC 调用的研发子工具"。产品层面：
- TriCode 是否保留"插件"语义？还是改为"TriLC 后端适配器"？
- TriCode 的 adapter registry（opencode/claude code/codex）是否需要对外暴露，还是仅作为 TriLC 内部实现细节？

### Q4: 会话恢复的产品体验
关闭并重新打开 IDE 后，TriPilot 应如何展示 daemon 中仍在运行的任务？
- 是自动重连并展示进度？
- 还是需要用户手动"恢复会话"？
- UI 上如何区分"正在 TriLC daemon 中运行的任务"和"已完成的历史会话"？

### Q5: W29 优先级
当前 W29 剩余时间内，是否需要立即启动架构修正？还是先将 TriCade（VSCodium+TriPilot+TriCode+TriLC 打包）作为"当前有偏差但可演示"的阶段性交付物收口，架构修正确认为 W30 优先任务？

---

## 6. 影响评估

| 影响域 | 描述 |
|--------|------|
| **TriPilot** | 需重构 extension.ts 工具执行路径，移除本地 executeToolCall()，改为全量委托 TriLC |
| **TriLC** | daemon 已具备基础设施（`submitTask()`、`/sessions/recover`），需新增 TriCode 子进程管理能力 |
| **TriCode** | 需修改模块定位文档（"TriPilot 插件" → "TriLC 子工具"），接口从面向 TriPilot 改为面向 TriLC |
| **VSCodium** | 需确保 TriPilot 在窗口关闭时正确断开（而非杀死 daemon 任务） |
| **TriCade 打包** | 当前打包逻辑不受影响，但产品描述需修正 |
| **三元宇宙架构文档** | §4 模块表中 TriCode 行需修正（L69），TriLC 行需补充"中枢编排"职责（L67） |

---

## 7. 参考文档

- `docs/三元宇宙架构与模块说明.md` §4（L62-85）：模块定义表
- `../TriPilot/src/extension.ts` L5884-6027：当前偏差实现
- `../TriLC/src/runtime/daemon.ts`：已存在的 daemon 基础设施
- `../TriLC/src/server/app.ts` L1098-1180：会话恢复端点
- `../TriCode/`：当前 @trimetaverse/tricode 包实现
- `../TriCompany/docs/engineering/entry-routing-layer-design.md`：CTO-008 入口路由设计（上游参考）
- `files/deep-audit-task-track-2026-07-17.md`：深度审计任务追踪

---

**下一步**：等待 CPO 对五个问题的裁决，裁决后由 CTO 制定技术实施方案，小贾负责追踪和收口。

---

## 裁决状态

| 字段 | 值 |
|------|-----|
| **裁决人** | 小乔（CPO） |
| **裁决日期** | 2026-07-19 |
| **节点状态** | ✅ done |
| **裁决文档** | `docs/workflow/operating-records/2026-W29/cpo-ruling-pc-layer-boundary.md` |
| **判决摘要** | Q1-Q4: APPROVE（TriPilot 零执行、分层协议、TriCode 子工具、自动重连）；Q5: FREEZE（W29 收口 TriCade+偏差文档，W30 架构修正 P1） |
| **next_agent** | **CTO（小狄）** — 需产出 W29 技术设计 + W30 架构修正实施方案 |
| **追踪** | 小贾（CEOChiefOfStaff）纳入 W29 OP JSON

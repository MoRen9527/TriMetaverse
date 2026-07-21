# CPO 正式裁决：PC 端四模块边界与协作关系重定义

**裁决人**：小乔（CPO）  
**裁决日期**：2026-07-19  
**裁决类型**：`APPROVE`（Q1-Q4, Q6）/ `FREEZE`（Q5）  
**触发升级**：`docs/workflow/operating-records/2026-W29/cpo-escalation-pc-layer-boundary.md`  
**任务树 ID**：`cpo-pc-layer-escalation`，节点 ID：`cpo-pc-1` + `cpo-pc-1a`  
**裁决状态**：✅ done（Q1-Q6 全部裁定）
**next_agent**：CTO（小狄）— 需基于本裁决制定 W29 技术设计 + W30 架构修正实施方案

---

## 前置核查摘要

按 CPO 固定前置核查顺序，裁决前已查阅以下真源：

| 序号 | 核查项 | 文件 | 关键发现 |
|------|--------|------|---------|
| 0 | 工作路径 | — | ✅ 路径正确：`docs/workflow/operating-records/2026-W29/` |
| 0.5 | 归属路由 | — | ✅ CPO 裁决域，未触碰 CTO/CEOChiefOfStaff/BusinessStrategy 独占域 |
| 1 | CEO 最新输入 | 升级简报 §3 | CEO 明确架构意图：TriLC 唯一中枢、TriPilot 零执行、TriCode 为子工具 |
| 2 | BusinessStrategy | `business-strategy-evolution-log.md` L55-68 | 2026-07-17：TriLC 升级为"本地人机协作主入口"，TriPilot 默认直连 TriLC |
| 3 | 产品真源 | `PROJECT.md` / `REQUIREMENTS.md` / `STATE.md` | TriMetaverse 侧均为发布摘要页；产品真源在 TriCompany source 侧 |
| 4 | Product Registry | `product-state.md` | 当前未触及 PC 端四模块的细化边界；架构文档 §4 为当前模块真源 |
| 5 | 公司治理 | `business-strategy-boundaries.md` L20 | TriLC：detached local runtime + planner + tool bus + 执行生命周期 |

**关键发现**：CEO 意图（2026-07-19 审计）与 BusinessStrategy 演进（2026-07-17）完全一致，不存在战略层面的冲突。当前偏差是**实现层偏差**，不是方向性错误。产品裁决的核心任务是把 CEO 意图转化为可执行的产品边界定义。

---

## Q1: TriPilot 的产品边界

### 裁决：`APPROVE` — 严格定义为"零执行能力的显示+交互窗口"

### 裁决理由

1. **架构文档一致**：`三元宇宙架构与模块说明.md` §4 L68 定义 TriPilot 为"桌面聊天入口、本地域工具入口、本地控制与显示入口；默认通过 TriLC 直接接入"。"入口"语义天然排斥本地执行。

2. **BusinessStrategy 一致**：2026-07-17 演进日志明确 TriLC 为"本地人机协作主入口"，TriPilot 为"默认直连 TriLC"的显示层。入口与主入口的分工——显示归显示、执行归执行——是设计本意。

3. **CEO 意图明确且无歧义**：TriPilot 只连 TriLC，不直接感知 TriCode。这是架构洁净度的底线。

4. **当前偏差的根因**：`extension.ts` L5995 的本地 `executeToolCall()` 是快速原型阶段的临时实现，不是有意为之的产品决策。

### 产品边界定义

| 维度 | 当前状态 | 修正后 |
|------|---------|--------|
| **核心职责** | 聊天入口 + 本地工具执行（偏差） | 纯显示 + 交互窗口 |
| **LLM 通信** | 直连 Anthropic SSE | 委托 TriLC 代理 |
| **工具执行** | `extension.ts` L5995 本地执行 | **禁止。全部委托 TriLC** |
| **会话管理** | VS Code 扩展进程内 | 委托 TriLC daemon |
| **TriCode 感知** | 间接/可选 | **禁止直接感知。只通过 TriLC** |
| **错误处理** | 本地 try-catch | 展示 TriLC 返回的状态 |

### Feature Set 裁剪清单

需从 TriPilot 移除的能力：

| 移除项 | 说明 |
|--------|------|
| `executeToolCall()` | 本地工具调用入口 — 替换为 TriLC 委托 |
| 工具执行状态机 | 当前 webview 中管理工具调用状态 — 替换为 TriLC 回传的状态展示 |
| 本地 tool registry | 工具白名单/注册 — 移至 TriLC tool bus |
| 直接 Anthropic API 调用 | 当前 `runTrilcDirectRequest()` 路径 — 替换为 TriLC 代理 |
| ACP 协议适配逻辑 | 如存在 — 移至 TriCode（由 TriLC 调用） |

需保留/新增的能力：

| 保留/新增项 | 说明 |
|-------------|------|
| 聊天 UI（输入+流式输出展示） | 核心交互界面，不变 |
| 会话列表（运行中/历史） | 展示 TriLC daemon 返回的会话状态 |
| 自动重连逻辑 | Q4 裁决：IDE 启动时自动查询 TriLC daemon → 重连活跃会话 |
| TriLC 状态指示器 | 显示 TriLC daemon 连接状态（在线/离线/崩溃→Fallback TriMC） |
| 工具执行进度展示 | 只展示 TriLC 推送的工具调用进度，不参与执行 |

### 裁决边界提醒

- TriPilot 的"本地域工具入口"语义**不应被删除**——它是入口，入口可以展示工具列表、触发工具意图，但工具本身由 TriLC 执行。"入口"≠"执行"。
- 崩溃时自动切换 TriMC 的 TWF-001 机制**保留**，这是 TriPilot 的唯一非 TriLC 通信路径，且仅用于 fallback。

---

## Q2: TriPilot↔TriLC 通信协议

### 裁决：`APPROVE` — 扩展现有 SSE + 新增 HTTP 端点（分层协议）

### 裁决理由

1. **SSE 是成熟的流式协议**：当前 Anthropic SSE 流模式已在 TriPilot ↔ TriLC 之间验证可用。流式 LLM 输出应继续使用 SSE。

2. **TriLC daemon 已有 HTTP 基础设施**：`daemon.ts` `submitTask()` 和 `app.ts` `/internal/v1/sessions/recover` 均为 HTTP 端点。这是可直接复用的资产。

3. **WebSocket 是可后置的优化**：WebSocket 提供双向实时通道，但当前阶段：
   - TriLC daemon 的 HTTP + SSE 组合已覆盖"提交→流式回传"需求
   - 新增 WebSocket server 的复杂度不值得在 W29/W30 引入
   - 可标记为"post-MVP 优化项"

### 协议分层设计

```
┌──────────────────────────────────────────────┐
│                 TriPilot (webview)            │
│                                               │
│  ① HTTP POST /internal/v1/tasks/submit       │
│     → 提交用户意图 + 上下文                   │
│                                               │
│  ② SSE /internal/v1/sessions/{id}/stream     │
│     → 接收 LLM 流式输出 + 工具调用状态推送    │
│                                               │
│  ③ HTTP GET /internal/v1/sessions            │
│     → 查询活跃/历史会话列表                   │
│                                               │
│  ④ HTTP POST /internal/v1/sessions/{id}/cancel│
│     → 取消运行中任务                          │
│                                               │
│  ⑤ HTTP POST /internal/v1/sessions/recover   │
│     → 重连已有会话（已有端点，Q4 使用）       │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│              TriLC daemon                     │
│                                               │
│  · submitTask()                         ✅ 已有 │
│  · POST /internal/v1/sessions/recover    ✅ 已有 │
│  · GET  /internal/v1/sessions            ⚠️ 需新增 │
│  · POST /internal/v1/tasks/submit        ⚠️ 需新增 │
│  · SSE  /internal/v1/sessions/{id}/stream ⚠️ 需新增 │
│  · POST /internal/v1/sessions/{id}/cancel ⚠️ 需新增 │
└──────────────────────────────────────────────┘
```

### 协议边界

| 协议层 | 用途 | 方向 | 优先级 |
|--------|------|------|--------|
| HTTP POST `/tasks/submit` | 提交任务（用户意图+上下文） | TriPilot → TriLC | W29 设计 / W30 实现 |
| SSE `/sessions/{id}/stream` | LLM 流式输出 + 工具调用状态 | TriLC → TriPilot | W29 设计 / W30 实现 |
| HTTP GET `/sessions` | 会话列表（活跃/历史） | TriPilot → TriLC | W30 实现 |
| HTTP POST `/sessions/{id}/cancel` | 取消任务 | TriPilot → TriLC | W30 实现 |
| WebSocket | 双向实时通道 | ↔ | Post-MVP（标注，不排期） |

### 裁决边界提醒

- 当前 Anthropic SSE 直连路径（`extension.ts` 中的 LLM 调用）应**全部改为通过 TriLC 代理**。TriPilot 不再持有任何 API Key 或直接调用任何模型端点。
- TriPilot → TriLC 的通信是本地 localhost 通信（`127.0.0.1` 或 Unix socket），不经过公网。
- TWF-001 崩溃 fallback 场景：TriPilot→TriMC 的协议路径保持现有的 SSE 模式不变；本次裁决不改变 TriMC fallback 路径。

---

## Q3: TriCode 的产品定位修正

### 裁决：`APPROVE` — 修正为"TriLC 调用的研发子工具适配器"

### 裁决理由

1. **CEO 意图明确**：TriCode 是 TriLC 的子工具，不是 TriPilot 的插件。这与"TriPilot 只连 TriLC"原则一致——如果 TriCode 是 TriPilot 的 glue 层，TriPilot 就必须感知 TriCode，违背 Q1 的零感知原则。

2. **BusinessStrategy 演进一致**：2026-07-17 日志 L67 定义 TriCode 为"PC 端本地编码工具，配合 TriLC 完成本地开发闭环"。这里没有"插件"语义。

3. **当前架构文档 §4 L69 需修正**：当前写为"TriPilot 插件与 opencode 的 glue 适配层"，这是旧架构残留。在三元宇宙总架构中，L50 已写明"TriCode 是 TriPilot 插件与本地工具链的 glue 适配层"，但这条与 CEO 意图和 BusinessStrategy 演进存在不一致。

### 产品定位修正

| 维度 | 旧定义 | 新定义 |
|------|--------|--------|
| **产品名称** | TriCode | TriCode（不变） |
| **核心语义** | "TriPilot 插件与 opencode 的 glue 层" | "TriLC 研发子工具适配器" |
| **调用方** | TriPilot（旧） | **TriLC（新）** |
| **产品形态** | VS Code 插件扩展（旧） | TriLC 管理的子进程适配器（新） |
| **公开接口** | 面向 TriPilot 扩展（旧） | 面向 TriLC daemon（新） |
| **ACP 协议** | TriPilot↔TriCode↔opencode（旧） | TriLC→TriCode→opencode（新） |
| **生命周期** | VS Code 扩展进程（旧） | TriLC daemon 子进程管理（新） |

### Adapter Registry 可见性裁决

| 组件 | 对外暴露？ | 说明 |
|------|-----------|------|
| `@trimetaverse/tricode` package | ✅ 公开 | 作为 TriLC 的依赖包，接口文档应面向 TriLC（不是 TriPilot） |
| Adapter Registry（opencode/claude code/codex） | ❌ 内部 | TriLC 根据任务类型自动选择 adapter；调用方（入口层）不感知 adapter 选择逻辑 |
| Adapter 选择规则 | ❌ 内部 | 由 TriLC daemon 的任务分类逻辑决定；不暴露给入口层 |
| Individual Adapter 配置 | 半内部 | TriLC 可读取/配置 adapter 参数；TriCode 的 `tricode.config.json` 是 TriLC ↔ TriCode 之间的内部契约 |

### 需要修正的文档清单

| 文件 | 修正内容 |
|------|---------|
| `docs/三元宇宙架构与模块说明.md` §4 L69 | TriCode 行："功能主旨"改为"TriLC 研发子工具适配器"；"期望能力"改为"包装 opencode/claude code/codex 供 TriLC 调用，提供 ACP 协议适配" |
| `docs/三元宇宙架构与模块说明.md` §3 L50 | "TriCode 是 TriPilot 插件与本地工具链的 glue 适配层" → "TriCode 是 TriLC 的研发子工具适配器，包装 opencode 等 CLI 供 TriLC 调用" |
| `docs/registry/business-strategy-boundaries.md` L18 | TriCode 行：移除"vibe coding 工具适配"的旧语义（如有），统一为"TriLC 子工具" |
| `docs/registry/business-strategy-module-map.md` L15 | TriCode 行：当前职责描述需从"CLI/runtime/SDK 与开发能力接入"修正为"TriLC 研发子工具适配器" |
| TriCode 模块内 `docs/product/` | 如有，需从"面向 TriPilot"改为"面向 TriLC" |

### 裁决边界提醒

- TriCode **不直接面向用户**。用户通过 TriPilot 输入意图，TriPilot 委托 TriLC，TriLC 判断为研发任务后才调用 TriCode。TriCode 不提供用户级 CLI 或独立 UI。
- TriCode 的 adapter registry 是 **TriLC 的内部实现细节**。入口层（TriPilot/CLI/未来移动端）不感知 TriCode 用哪个 adapter。
- 长期演进（CEO 路线图 L78）：TriLC 自有 loop 成熟后，TriCode 研发路径可退役。但当前阶段 TriCode 仍是必需的研发专用子工具。

---

## Q4: 会话恢复的产品体验

### 裁决：`APPROVE` — 自动重连 + 状态可视化区分

### 裁决理由

1. **"IDE 只是显示窗口"隐喻**：如果 TriLC daemon 管理任务生命周期，TriPilot 关闭只是关掉了一个显示窗口——任务在 daemon 中继续运行。用户重开 IDE 时，自然期望看到仍在运行的任务，就像重新打开一个终端窗口后 `tmux attach` 一样。

2. **TriLC 已有基础设施**：`POST /internal/v1/sessions/recover` 端点已存在。这是可以直接复用的产品路径。

3. **手动恢复增加认知负担**：如果让用户手动"恢复会话"，会增加一个步骤——这违背了"daemon 透明管理"的产品承诺。

4. **MVP 阶段优先简洁**：自动重连比手动恢复少一个决策点，用户体验更流畅。

### 产品体验定义

#### 启动流程

```
IDE 打开
  │
  ▼
TriPilot 激活
  │
  ├──→ ① 检测 TriLC daemon 是否运行
  │       ├── 运行中 → ②
  │       └── 未运行 → 尝试启动 daemon / 显示离线状态
  │
  ├──→ ② GET /internal/v1/sessions（查询活跃会话）
  │       ├── 有活跃会话 → ③
  │       └── 无活跃会话 → 显示空状态
  │
  └──→ ③ 自动重连活跃会话
          ├── 重新建立 SSE 流（接收实时输出）
          └── 展示当前进度
```

#### UI 状态区分

| 会话状态 | 视觉标识 | 交互行为 |
|---------|---------|---------|
| **运行中**（daemon 仍在执行） | 🟢 绿色脉冲指示器 + "运行中" 标签 + 实时进度 | 点击进入 → 查看实时输出流；可取消 |
| **已完成**（daemon 已结束） | ✅ 绿色勾 + 完成时间戳 | 点击进入 → 查看完整历史对话 |
| **已失败**（daemon 返回错误） | ❌ 红色叉 + 错误摘要 | 点击进入 → 查看错误详情 + 对话历史 |
| **已取消**（用户手动取消） | ⏹️ 灰色方块 + "已取消" 标签 | 点击进入 → 查看取消前的对话历史 |

#### 会话列表排序

```
┌─────────────────────────────────────────┐
│  会话列表                                │
│                                          │
│  🟢 重构 TriPilot 工具执行路径           │
│     进行中 · 2 分钟前 · 步骤 3/5         │
│                                          │
│  ✅ 修复 TriLC daemon 启动超时            │
│     已完成 · 15 分钟前                   │
│                                          │
│  ❌ 部署测试环境                          │
│     失败 · 1 小时前 · "端口冲突"          │
│                                          │
│  ✅ 更新 TriCode adapter registry        │
│     已完成 · 2 小时前                    │
└─────────────────────────────────────────┘
```

排序规则：运行中 > 失败 > 已完成（同类内按时间倒序）

### 异常场景处理

| 场景 | 预期行为 |
|------|---------|
| IDE 崩溃/强制关闭 | daemon 中任务继续运行。下次 IDE 启动时自动重连 |
| 用户主动关闭 IDE | daemon 中任务继续运行（除非用户先取消） |
| TriLC daemon 崩溃 | daemon 中任务丢失。TriPilot 显示"daemon 已断开"，尝试重新连接；标记可能丢失的会话 |
| 网络中断（如本机 localhost 不可达） | TriPilot 显示"连接中断"，定时重试 |
| 多 IDE 窗口同时打开 | 每个窗口独立查询 daemon 会话列表；同一会话不重复连接 |

### 裁决边界提醒

- 自动重连是**默认行为**，但用户仍应有**手动断开会话**的能力（关闭重连的 SSE 流，不取消 daemon 中的任务）。
- "已完成历史"会话应有**保留期限**——建议先在 TriLC daemon 中保留最近 50 条历史会话，超期自动归档。具体保留策略由 CTO 技术实现时确定。
- 用户关闭 IDE 前的"是否取消正在运行的任务"确认——**不需要**。这是 daemon 模型的核心价值：关闭 IDE 不影响任务。

---

## Q5: W29 优先级

### 裁决：`FREEZE` — 架构修正确认为 W30 Priority 1，W29 以 TriCade 交付收口

### 裁决理由

1. **W29 已近尾声**（2026-07-19，本周日），剩余时间不足以完成 TriPilot 重构 + TriLC 协议扩展 + TriCode 定位修正 + 集成测试。

2. **TriCade 打包已完成**（升级简报 §6 确认），MSI branding fix 已 closeout。TriCade 作为"PC 端四模块集成"的首个可交付物有演示价值。

3. **TriLC daemon 基础设施已就位**（`submitTask()`、`/sessions/recover`），W30 修正的核心工作量在 TriPilot 侧（移除本地执行）和协议层（新增端点），不是从零开始。

4. **架构偏差已文档化**。本裁决书本身就是偏差的正式记录，TriCade 交付时应附带偏差说明。

5. **CTO 需要设计窗口**：本裁决裁定的是产品边界，CTO 需要基于这些边界制定技术实施设计（通信协议细节、API 契约、重构顺序）。W29 剩余时间可以让 CTO 完成技术设计，W30 进入执行。

### W29 剩余工作

| 优先级 | 任务 | 负责人 | 状态 |
|--------|------|--------|------|
| P0 | TriCade W29 交付收口（附带偏差文档） | 小狄（CTO） | 待执行 |
| P1 | 基于本裁决的架构修正技术设计文档 | 小狄（CTO） | 待启动 |
| P2 | 本裁决涉及的四份架构/registry 文档修正 | 小乔（CPO） | 本裁决发布后启动 |
| P3 | TriCade 偏差说明文档 | 小贾（CEOChiefOfStaff） | 待收口 |

### W30 优先级排序

| 优先级 | 任务 | 依赖 |
|--------|------|------|
| **P0** | **PC 端四模块架构修正**（TriPilot 重构 + TriLC 协议扩展 + TriCode 定位修正） | 本裁决 + CTO 技术设计 |
| P1 | Session recovery UX 实现（Q4 裁决落地） | P0 中的协议扩展 |
| P2 | Adapter registry 内部化（TriCode 移除公开 registry） | P0 中的 TriCode 修正 |
| P3 | WebSocket 评估（post-MVP 标注，不排期） | — |

### 裁决边界提醒

- TriCade W29 交付时，必须在交付物中附带一份**已知偏差清单**（known deviations），明确标注：
  - TriPilot 当前本地执行工具调用（非 TriLC daemon 管理）
  - 关闭 IDE = 任务终止（非 daemon 生命周期）
  - TriPilot↔TriLC 协议仅覆盖 LLM streaming（非全任务委托）
- 这不是"accepting broken software"——这是**阶段性交付 + 技术债务显式登记**。

---

## 跨裁决影响汇总

### 需立即修改的中央文档（CPO 执行）

| 文件 | 修改内容 | 优先级 |
|------|---------|--------|
| `docs/三元宇宙架构与模块说明.md` §4 L67-70 | TriLC 行追加"中枢编排器"职责；TriCode 行改为"TriLC 研发子工具适配器" | P0 |
| `docs/三元宇宙架构与模块说明.md` §3 L50 | "TriCode 是 TriPilot 插件…" → "TriCode 是 TriLC 研发子工具适配器…" | P0 |
| `docs/registry/business-strategy-module-map.md` L15, L16 | TriCode 行职责修正；TriPilot 行明确"零执行能力" | P1 |
| `docs/registry/business-strategy-boundaries.md` L18-19 | TriCode/Tride 行修正 | P1 |

### 需 CTO 启动的工作项

1. **技术设计文档**：基于 Q1-Q4 裁决，制定 TriPilot 重构方案、TriLC 协议扩展 API 契约、TriCode adapter 接口变更
2. **W29 收口**：TriCade 交付 + 偏差文档
3. **W30 实施**：按本裁决 Q5 优先级顺序执行

### 需 CEOChiefOfStaff 收口的工作项

1. 将本裁决纳入 W29 操作记录（OP JSON）
2. 将架构修正纳入 W30 操作计划
3. 追踪 CTO 技术设计的产出时间
4. TriCade 偏差说明文档

---

## 裁决依据清单

| 文件 | 关键行/节 | 作用 |
|------|----------|------|
| `cpo-escalation-pc-layer-boundary.md` | 全文 | 升级简报，触发本裁决 |
| `docs/三元宇宙架构与模块说明.md` | §3 L42-52, §4 L62-85 | 模块定义与架构边界真源 |
| `docs/registry/business-strategy-evolution-log.md` | L55-68 | 2026-07-17 TriLC/TriMC 架构分层演进 |
| `docs/registry/business-strategy-boundaries.md` | L20-21, L44-45 | TriLC/TriPilot/PC 端软件层边界 |
| `docs/registry/business-strategy-state.md` | L27-40 | 第一轮核心模块清单 |
| `docs/registry/business-strategy-module-map.md` | L15-17, L22 | 模块成熟度与 registry 路由 |
| `docs/registry/product-state.md` | L27-36 | 中央产品侧现状（PC 端软件层已登记） |

---

**裁决完成时间**：2026-07-19T15:56+08:00（Q1-Q5）；2026-07-19T16:54+08:00（Q6）  
**下一步**：CTO（小狄）接收裁决 → 产出技术设计（Q1-Q5 W29交付 + Q6 W30 P1） → W29 收口 TriCade + W30 架构修正实施  
**追踪**：小贾（CEOChiefOfStaff）纳入 W29 OP JSON，节点 `cpo-pc-1` + `cpo-pc-1a` → done，next_agent → CTO


---

## Q6: 多入口路由归属与跨节点任务状态同步（待裁决 ⏳）

> **状态**：PENDING | **触发**：CEO 总助补充升级（2026-07-19）  
> **升级简报**：docs/workflow/operating-records/2026-W29/trees/cpo-pc-layer-escalation/escalation-brief-q6.md

### 问题

Q1-Q5 解决了 PC 端四模块内部边界，但遗留了跨入口层问题：TriPilot/CLI 连 TriLC（本地），TriMobile/TriAvatar 应连 TriMC（云端，无本地 daemon）。四种入口如何统一观察 TriLC + TriMC 两端任务状态？

### 待裁决子问题

**6a. 入口归属路由规则**：确认 TriPilot/CLI→TriLC，TriMobile/TriAvatar→TriMC。移动端用户如有本地执行需求如何处理？

**6b. 跨节点任务状态同步**：方案 A（TriLC 上报 TriMC 统一状态中心）、方案 B（入口多连聚合）、方案 C（分层职责，不求统一视图）

**6c. TriLC↔TriMC 任务镜像机制**：同步内容/频率/离线处理

### 前置核查（Q6 补充）

| 序号 | 核查项 | 文件 | 关键发现 |
|------|--------|------|---------|
| 0 | 工作路径 | — | ✅ `trees/cpo-pc-layer-escalation/` |
| 0.5 | 归属路由 | — | ✅ CPO 裁决域，涉及模块边界定义 |
| 1 | CEO 最新输入 | Q6 简报 | CEO 明确指出四种入口，PC 端走 TriLC，移动/Web 无本地 daemon |
| 2 | BusinessStrategy | `evolution-log.md` L55-68 | 2026-07-17：TriMC 保留"通知回传 TriMobile/TriAvatar"通道 |
| 3 | 产品真源 | §4 L66-67, L74, L79 | TriLC→TriMC 通信通道已保留；TriAvatar Web 入口已定义；TriMobile 占位 |
| 4 | CTO-008 | `entry-routing-layer-design.md` | Copilot-host ↔ TriMC 双轨路由已有成熟设计，可为 TriLC↔TriMC 镜像提供工程参考 |

**关键发现**：架构文档 §4 L67 已预留 TriMC→TriMobile/TriAvatar 通知通道，但反向（入口归属+状态同步）未定义。这是本次裁决要补充的缺口。

---

### CPO 裁决：Q6 — 多入口路由归属与跨节点任务状态同步

#### 6a: 入口归属路由规则 — `APPROVE`

**裁决**：确认以下入口归属，同时引入"就近连接 + 云端聚合"的双层模型。

| 入口 | 默认连接 | 连接方式 | 理由 |
|------|---------|---------|------|
| **TriPilot** | TriLC | 本地 localhost（Q2 协议） | PC 桌面，本地 daemon 可用 |
| **CLI** | TriLC | 本地 localhost | 同上 |
| **TriMobile** | **TriMC** | HTTPS/WSS | 移动端无本地 daemon，云端直连 |
| **TriAvatar** | **TriMC** | HTTPS/WSS | Web 浏览器，云端直连 |

**裁决边界提醒**：
- "本地执行需求"（如远程操控 PC）**不在当前 MVP 范围**。TriMobile↔TriLC 的远程操控涉及 NAT 穿透、安全认证和权限模型，是独立产品功能，不应捆绑到入口路由定义中。当该需求被提上产品路线图时，单独发起 CPO 裁决。
- 归属规则是"默认连接"而非"唯一连接"。PC 端入口在 TriLC 崩溃时仍走 TWF-001 fallback 到 TriMC。
- TriMobile/TriAvatar 的用户如果需要"看到本地任务"，通过 6b 的方案 A 实现，不需要入口层多连。

#### 6b: 跨节点任务状态同步 — `APPROVE`（方案 A：TriLC 上报 TriMC 统一状态中心）

**裁决**：采用**方案 A**。排除方案 B 和 C 的理由如下：

| 方案 | 裁决 | 理由 |
|------|------|------|
| **A：TriLC 上报 TriMC** | ✅ **采纳** | 架构清洁，单一状态中心，所有入口统一查询路径。TriLC→TriMC 通信通道已存在（§4 L67），零新基础设施 |
| **B：入口多连** | ❌ 排除 | TriMobile 直连 TriLC 需解决 NAT/认证/安全，MVP 阶段成本过高；入口层做聚合展示增加各入口复杂度，违背"入口是薄显示层"原则 |
| **C：分层职责** | ❌ 排除 | 用户场景验证：员工在 PC 提交长任务→出门→手机查看状态是合理刚需。分层可见性降低产品价值 |

**方案 A 的架构语义**：
- TriMC 是**任务状态中心**（task state hub），不是任务执行中心
- TriLC 是**本地执行器**（local executor），任务在本地跑，状态上报 TriMC
- 所有入口从 TriMC 查询统一的"我的任务"视图，无需感知任务实际跑在哪个 TriLC 节点
- 这个模型与 Q1-Q5 的裁决一致：TriPilot 零执行、TriLC 是编排中枢——现在只是把"跨节点可观测"加在 TriMC 上

#### 6c: TriLC↔TriMC 任务镜像机制 — `APPROVE`

**裁决**：定义以下镜像规格，具体技术实现由 CTO 设计。

| 维度 | 规格 | 说明 |
|------|------|------|
| **同步内容** | 任务 ID、标题、状态（pending/running/success/failed/cancelled）、进度摘要（如"步骤 3/5"）、最后更新时间 | MVP 阶段不同步完整日志，只同步状态快照+摘要（<500 chars） |
| **同步方式** | 事件驱动推送 + 定时心跳兜底 | 状态变更时推送到 TriMC（`POST /internal/v1/tasks/mirror`）；每 30s 心跳兜底（防止事件丢失） |
| **离线处理** | TriLC 离线时 TriMC 保留最后已知状态，标记 `status: unknown` + `lastSeenAt` | 不删除记录。TriPilot/TriMobile 显示为"离线/状态未知" |
| **任务生命周期** | TriLC daemon 为权威执行方，TriMC 为只读观察方 | TriMC 不驱动任务，不重试任务，不取消任务——只反映 TriLC 上报的状态 |
| **恢复策略** | TriLC 恢复后全量推送当前 active 任务状态 | 而非逐个比对——避免状态不一致的同步复杂度 |

**裁决边界提醒**：
- 这是一个**MVP 规格**。完整日志流、任务操控（取消/重试）从云端发起等高级功能属于 post-MVP。
- TriLC→TriMC 的镜像端点与现有 heartbeat（`app.ts` L161）可复用同一通信通道。
- 镜像机制不改变 W29 Q5 的 FREEZE 裁决：TriCade W29 收口 + 偏差文档优先，镜像实现在 W30 架构修正中作为 P1 项排入。

---

### Q6 裁决影响

#### 需追加到 CTO 技术设计的项

1. TriMC 新增 `POST /internal/v1/tasks/mirror` 端点（接收 TriLC 状态上报）
2. TriMC 新增 `GET /internal/v1/tasks` 端点（统一任务状态查询，供所有入口调用）
3. TriLC daemon `TaskRuntime` 增加状态变更事件 → 推送 TriMC 的逻辑
4. TriMC 任务状态模型设计（task_id、来源节点、状态快照、最后心跳时间）

#### 需修正的架构文档

| 文件 | 修正内容 | 优先级 |
|------|---------|--------|
| `docs/三元宇宙架构与模块说明.md` §4 L66 | TriMC 行追加"统一任务状态中心"职责 | P1（W30） |
| `docs/三元宇宙架构与模块说明.md` §4 L67 | TriLC 行追加"向 TriMC 上报本地任务状态" | P1（W30） |
| `docs/三元宇宙架构与模块说明.md` §4 L74 | TriAvatar 行明确"默认连接 TriMC" | P1（W30） |
| `docs/三元宇宙架构与模块说明.md` §4 L79 | TriMobile 行明确"默认连接 TriMC" | P1（W30） |

---

**Q6 裁决完成时间**：2026-07-19T16:54+08:00  
**整体裁决状态更新**：Q1-Q4 `APPROVE` / Q5 `FREEZE` / Q6 `APPROVE`  
**下一步**：CTO（小狄）— Q1-Q5 技术设计（W29） + Q6 入口路由+镜像机制（W30 P1）  
**追踪**：小贾（CEOChiefOfStaff）更新 OP JSON、tree-op.json、SQL 状态

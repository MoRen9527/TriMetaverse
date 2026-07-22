# CPO 产品设计裁决：TriLC 独立 daemon + 安装 UX + 多入口会话管理

**裁决人**：小乔（CPO）  
**裁决日期**：2026-07-22  
**裁决类型**：`APPROVE`（Q7-Q11 全部裁定）  
**触发输入**：CEO 架构意图升级——TriLC 独立 daemon、安装 UX、多入口会话管理  
**任务树 ID**：`arch-trilc-daemon`，节点 ID：`td-1`  
**裁决状态**：✅ done  
**next_agent**：CTO（小狄）——基于本裁决制定 W30 技术实施设计（追加到 `cpo-pc-layer-escalation/w30-architecture-fix-design.md`）

---

## 前置核查摘要

按 CPO 固定前置核查顺序，裁决前已查阅以下真源：

| 序号 | 核查项 | 文件 | 关键发现 |
|------|--------|------|---------|
| 0 | 工作路径 | — | ✅ 路径正确：`docs/workflow/operating-records/2026-W30/trees/arch-trilc-daemon/` |
| 0.5 | 归属路由 | — | ✅ CPO 裁决域（产品范围/UX 规格/MVP 边界），不触碰 CTO/CEOChiefOfStaff/BusinessStrategy 独占域 |
| 1 | CEO 最新输入 | 本次升级 | CEO 明确五个设计问题：安装 UX、会话管理 UI、同步协议、TriMobile 可见性、MVP 范围 |
| 2 | BusinessStrategy | `cpo-pc-layer-escalation/ruling.md` Q1-Q6 | Q6 已裁定：TriPilot/CLI→TriLC，TriMobile/Avatar→TriMC；方案 A（TriLC 上报 TriMC 统一状态中心）；事件驱动+30s 心跳镜像 |
| 3 | 产品真源 | `PROJECT.md` / `REQUIREMENTS.md` / `STATE.md` | TriMetaverse 侧均为发布摘要页；产品真源在 TriCompany source 侧 |
| 4 | Product Registry | TriLC `product-state.md`、TriMC `product-state.md`、TriCompany `product-state.md` | TriLC 已定义为"本地人机协作主入口，detached local runtime + planner + tool bus"；TriMC 已定义为"服务域主控骨架"；TriCade 已知偏差 D1-D7 已登记 |
| 5 | 公司治理 | `company-governance-state.md` | 模块标配、文档语言规则、员工工具权限策略均已在册；不阻塞本裁决 |

**关键发现**：
1. CEO 本次输入的"云按钮"会话同步与 Q6 的任务状态镜像**是互补关系，不是冲突关系**。Q6 镜像 = 机器自动上报轻量任务状态（500 字 summary）；云按钮 = 用户主动触发全量会话同步（metadata + 完整消息历史）。
2. 当前偏差 D2（IDE 关闭=任务终止）是本裁决要解决的根因之一——一旦 TriLC 成为独立 daemon，TriPilot 关闭不会带死任务，D2 自然消除。
3. TriLC `cli.ts` 已有 `start/stop/status` 命令和 detached spawn 能力，具备独立 daemon 化的工程技术基础。

---

## Q7: 安装 UX 规格

### 裁决：`APPROVE` — 双层注册模型（Windows Service 优先 + Registry Run 兜底）

### 7a. 安装 checkbox

| 维度 | 规格 | 说明 |
|------|------|------|
| **文案** | "将 TriLC 注册为系统服务（推荐）" | CEO 已指定，无需变更 |
| **默认状态** | ✅ **勾选**（推荐） | 独立 daemon 是 TriLC 的核心架构承诺，默认开启 |
| **位置** | TriCade MSI 安装向导的"选择组件"页面，作为独立 checkbox | 不与 VSCodium 组件捆绑 |
| **管理权限路径** | 注册为 **Windows Service**（`sc create TriLC`） | 需管理员权限；服务启动类型 = Automatic（Delayed Start） |
| **非管理员路径** | 注册到 **Registry Run**（`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`） | 无管理员权限时的 fallback；登录后自动启动 |
| **权限检测** | 安装程序检测当前用户权限，自动选择注册方式；管理员→Service，非管理员→RegRun + toast 提示"建议以管理员身份安装以获得系统服务级别" | |

### 7b. 安装后行为

| 触发时机 | 行为 |
|----------|------|
| MSI 安装完成 | TriLC daemon **立即启动**（如果 checkbox 勾选）；系统托盘图标出现 |
| 用户登录（RegRun 路径） | TriLC daemon 自动启动 |
| 系统启动（Service 路径） | 服务自动启动（Delayed Start，避免拖慢开机） |
| TriCade 卸载 | 停止并移除 Windows Service / Registry Run 条目；询问是否保留本地会话数据 |

### 7c. 系统托盘图标（System Tray）

| 维度 | 规格 | 说明 |
|------|------|------|
| **产品名称** | TriLC 托盘 | 独立于 TriCade/VSCodium 的系统托盘应用 |
| **视觉标识** | 🟢 绿色圆点 = 运行中 / 🔴 红色圆点 = 已停止/异常 / ⚪ 灰色 = 未安装/未启动 | 最小识别度——颜色+图标组合 |
| **右键菜单（Phase 1）** | ① TriLC 状态（运行中/已停止/异常）② 启动/停止 ③ 打开本地会话面板 ④ 退出 | 四项基本操作 |
| **左键点击** | 打开本地会话面板（或唤醒已有面板） | 快捷入口 |
| **通知** | Phase 1 仅限：daemon 异常退出时弹出系统通知 | 避免通知噪音，后期可扩展 |

### 7d. 裁决边界提醒

- 系统托盘图标是 TriLC 独立的 UI 进程，不受 TriCade/VSCodium 生命周期影响。
- 托盘图标本身不是"入口"——它只是守护进程的管理界面。聊天入口仍是 TriPilot webview。
- "打开本地会话面板"不绑定 IDE/编辑器——这是一个独立窗口，显示 TriLC 本地持久化的会话列表。
- macOS / Linux 的对应物（macOS LaunchAgent、Linux systemd user service）**标注为 post-MVP**，不进入当前 W30 范围。当前 MVP 仅覆盖 Windows。

---

## Q8: 会话管理 UI 规格

### 裁决：`APPROVE` — 双面板视图 + 三态云按钮 + 用户可选

### 8a. 面板结构

TriPilot webview 的会话管理页面采用 Tab 切换：

```
┌─────────────────────────────────────────────────┐
│  [本地会话 (3)]  │  [云端会话 (2)]  │  [+ 新建] │
├─────────────────────────────────────────────────┤
│                                                  │
│  🟢 重构 TriPilot 工具执行路径          ☁️✅    │
│     运行中 · 步骤 3/5 · 2 分钟前                 │
│                                                  │
│  ✅ 修复 TriLC daemon 启动超时           ☁️⬆    │
│     已完成 · 15 分钟前                           │
│                                                  │
│  ✅ 更新 TriCode adapter registry         ☁️    │
│     已完成 · 2 小时前                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 8b. 本地会话列表（"本地会话" Tab）

数据源：TriLC daemon `GET /internal/v1/sessions`（Q2 裁决的端点③）  
每会话展示：

| 字段 | 示例 | 来源 |
|------|------|------|
| 状态图标 | 🟢/✅/❌/⏹️ | `session.status`（Q4 裁决的四色状态） |
| 标题 | "重构 TriPilot 工具执行路径" | `session.title` |
| 进度（运行中时） | "步骤 3/5" | `session.progress` |
| 最后活动时间 | "2 分钟前" | `session.updatedAt` |
| 云同步按钮 | ☁️/☁️⬆/🔄/☁️✅ | 本地持久化同步状态 |

**点击行为**：进入会话 → 建立 SSE 流（运行中）/ 展示历史对话（已完成）

### 8c. 云端会话列表（"云端会话" Tab）

数据源：TriMC `GET /internal/v1/sessions`（Q6 裁决的查询端点，Phase 2 实现）  

**Phase 1 当前行为**：  
- Tab 可见但显示 **"云端会话暂不可用——TriMC 会话同步功能开发中"** 占位文案  
- 不阻塞本地会话功能  
- 产品上承诺后续可见"每周项目成员对话"等 TriMC 托管会话

**Phase 2 目标行为**（TriMC 就绪后）：  
- 展示 TriMC 上托管的会话：包括用户从本机云同步的会话、TriMC 云端无人值守工作流会话、项目成员共享会话  
- 云端会话**只读**（点击查看，不建立本地 SSE）；如需本地编辑，提供"下载到本地"操作

### 8d. 云同步按钮（Cloud Button）

**位置**：每条本地会话右侧

**三态规格**：

| 状态 | 图标 | 含义 | 触发条件 |
|------|------|------|---------|
| **未同步** | ☁️（轮廓） | 该会话从未同步到 TriMC | 新建会话，或从未点击过云按钮 |
| **待同步** | ☁️⬆（上箭头） | 本地有更新，云端版本落后 | 上次同步后又产生了新消息 |
| **同步中** | 🔄（旋转动画） | 正在传输到 TriMC | 用户刚点击云按钮，传输进行中 |
| **已同步** | ☁️✅（勾） | 本地与云端一致 | 同步完成且无新消息产生 |

**交互**：
- 点击云按钮 → 触发同步（Q9 协议）→ 按钮变为 🔄 → 完成后变为 ☁️✅
- 云按钮**不自动触发**——这是用户主动操作，除非用户在产品设置中开启"自动同步"开关（Phase 2）
- "待同步"状态在以下条件触发：同步后产生 ≥ 1 条新消息

### 8e. 裁决边界提醒

- "用户可选择本地/云端会话" = 两个 Tab 各自独立展示，用户自由切换，不做路由决策。**入口归属（TriPilot→TriLC）不影响会话来源选择**——用户可以查看 TriMC 上的云端会话，但新对话始终走 TriLC 本地 daemon。
- 本地会话列表的排序规则：**运行中 > 待同步 > 已完成**（同类内按时间倒序）——因为"待同步"是用户可能遗忘的操作，提升其视觉优先级。
- TriLC 独立的"本地会话面板"（系统托盘右键打开）与 TriPilot webview 的"本地会话 Tab"共用同一数据源（TriLC daemon `GET /sessions`），保证一致性。

---

## Q9: TriLC→TriMC 会话同步协议（云按钮触发）

### 裁决：`APPROVE` — 用户主动触发全量同步，递进于 Q6 自动镜像

### 9a. Q6 镜像 vs Q9 云同步——分层关系

| 维度 | Q6 镜像（自动） | Q9 云同步（手动） |
|------|----------------|-------------------|
| **触发方式** | 事件驱动 + 30s 心跳，自动执行 | 用户点击"云按钮"，手动触发 |
| **同步内容** | 任务状态快照（500 字 summary） | **完整会话**：metadata + 全量消息历史 |
| **目标** | 跨设备任务状态可观测（"手机上看 PC 任务进度"） | 跨设备会话可延续（"手机上继续 PC 上的对话"） |
| **产品语义** | 机器对机器的状态面，用户无需感知 | 用户主动的内容迁移操作 |
| **数据量** | 轻量（<500 chars/task） | 重量（可能数千条消息） |
| **在 TriMC 存储** | `tasks` 表（临时状态，可覆盖） | `sessions` + `messages` 表（持久化，可查询） |

**两者不冲突。Q6 保证基本可见性，Q9 提供完整可迁移性。**

### 9b. 同步协议规格

**端点**（TriMC 新增）：`POST /internal/v1/sessions/sync`

**Request**（TriLC → TriMC）：

```json
{
  "nodeId": "trilc-win-jedih",
  "syncType": "full",
  "session": {
    "localSessionId": "sess-xyz789",
    "title": "重构 TriPilot 工具执行路径",
    "status": "running",
    "createdAt": "2026-07-22T10:00:00+08:00",
    "updatedAt": "2026-07-22T10:15:30+08:00",
    "progress": {
      "step": 3,
      "totalSteps": 6,
      "description": "正在分析 extension.ts"
    },
    "messages": [
      {
        "role": "user",
        "content": "帮我重构 TriPilot 的工具执行路径",
        "timestamp": "2026-07-22T10:00:00+08:00"
      },
      {
        "role": "assistant",
        "content": "好的，让我先看一下 extension.ts 的当前实现...",
        "timestamp": "2026-07-22T10:00:05+08:00",
        "toolCalls": [
          {
            "toolName": "read_file",
            "input": { "path": "src/extension.ts" },
            "output": "import * as vscode...",
            "durationMs": 45
          }
        ]
      }
    ],
    "decisionLog": [
      "2026-07-22T10:02:00+08:00: 确认移除 executeToolCall()",
      "2026-07-22T10:10:00+08:00: 决策：采用 TriLCClient 替代旧路径"
    ]
  },
  "syncedAt": "2026-07-22T10:15:30+08:00"
}
```

**Response**：`200 OK`

```json
{
  "ok": true,
  "cloudSessionId": "cloud-sess-abc456",
  "localSessionId": "sess-xyz789",
  "syncedMessageCount": 12,
  "syncedAt": "2026-07-22T10:15:30+08:00"
}
```

**增量同步（Phase 2 优化）**：完整同步之后，后续云按钮可改为增量同步——只推送 `updatedAt > lastSyncedAt` 的新消息。Phase 1 为降低复杂度，使用全量覆盖（幂等）。

### 9c. 同步策略

| 维度 | 规格 | 说明 |
|------|------|------|
| **幂等性** | `localSessionId` 为去重键；重复同步同一会话覆盖旧数据 | 用户可多次点击云按钮 |
| **会话去重** | TriMC 端以 `(nodeId, localSessionId)` 为唯一键 | 同一 daemon+同一本地会话=同一云端记录 |
| **离线处理** | TriMC 不可达时，云按钮显示 ⚠️ 黄色警告 + toast "TriMC 云端不可达，请稍后重试"；本地会话数据不受影响 | 不阻塞本地功能 |
| **同步粒度** | 全量会话（metadata + messages + decision log） | Phase 1 不做增量 diff |
| **消息上限** | 单次同步 ≤ 5000 条消息 | 超出时截断 + 提示"近期消息已同步，完整历史请连接本地 daemon 查看" |

### 9d. 裁决边界提醒

- 云同步是**单向推送**（TriLC → TriMC）。反向（TriMC → TriLC，"下载云端会话到本地"）标注为 Phase 2 功能。
- 云同步**不改变本地会话的权威性**。TriLC daemon 始终是会话的 source of truth。TriMC 上的副本是镜像。
- 云同步与 Q6 镜像共用 TriMC 上的 `sessions` 存储，但 Q6 镜像写入的是 `tasks` 表（轻量状态），Q9 云同步写入 `sessions` + `messages` 表（完整内容）。两张表通过 `localSessionId` 关联。
- Phase 1 云按钮依赖 TriMC `POST /internal/v1/sessions/sync` 端点。该端点在 W30 CTO 技术设计中与 Q6 的 `POST /internal/v1/tasks/mirror` 端点一并设计。若 TriMC 端点未就绪，云按钮降级为可见但 **disabled**（灰显 + tooltip "TriMC 会话同步功能开发中"）。

---

## Q10: TriMobile/TriAvatar 用户能否看到 TriLC 本地会话

### 裁决：`APPROVE` — 维持 Q6 裁决，不做协议变更

### 裁决理由

1. **Q6 已覆盖基本可见性**：Q6 6b 裁定 TriLC 上报 TriMC 统一状态中心，TriMobile 查询 `GET /internal/v1/tasks` 即可看到 PC 端任务的**状态快照**（标题、进度、状态）。TriMobile 用户可以看到"有一项叫'重构 TriPilot 工具执行路径'的任务正在 PC 上运行，进度 3/5"。

2. **"不能看到本地会话"的语义是内容隔离**：CEO 所说"TriMobile 看不到 TriLC 本地会话"应理解为"不能直接浏览 TriLC daemon 上的完整对话内容"——这是正确的产品约束。两个理由：
   - **安全**：本地会话可能包含文件路径、环境变量、本地代码片段，不适合未经用户授权直接从云端穿透到本地 daemon。
   - **产品模型**：本地会话是私有工作空间。用户通过"云按钮"**显式选择**哪些会话需要跨设备延续，这提供了隐私控制。

3. **云同步是解耦层**：当用户点击云按钮将某个本地会话同步到 TriMC 后，该会话的云端副本（`cloud-sess-abc456`）对 TriMobile 可见。**用户的主动操作完成了"私有→共享"的转换**。

### 可见性矩阵

| 会话来源 | TriPilot/CLI（本地） | TriMobile/TriAvatar（云端） |
|----------|---------------------|---------------------------|
| **TriLC 本地会话（未同步）** | ✅ 完全可见 | ❌ 不可见 |
| **TriLC 本地会话（通过 Q6 镜像）** | ✅ 完全可见 | ⚠️ 仅任务状态快照（500 字 summary） |
| **TriLC 本地会话（通过云按钮已同步）** | ✅ 完全可见 | ✅ 云端副本可见（TriMC sessions） |
| **TriMC 云端会话** | ✅ Phase 2 可见（占位，当前不可用） | ✅ 完全可见 |

### 裁决边界提醒

- 此裁决**不创建新的 TriMobile↔TriLC 直连通道**。TriMobile 始终只连 TriMC。Q6 的归属路由规则不变。
- "TriMobile 用户如有本地执行需求"（如远程操控 PC）**不在当前 MVP 范围**——Q6 6a 已明确此结论，本裁决重申。
- 若未来需要 TriMobile 远程触发 PC 端操作，应通过 TriMC → TriLC 的云端通知通道（已预留，§4 L67），作为独立功能发起 CPO 裁决。

---

## Q11: MVP 范围——Phase 1 vs Phase 2

### 裁决：`APPROVE` — 三阶段递进

### 11a. Phase 1（W30-W31，当前）

| # | 功能 | 优先级 | 依赖 | 说明 |
|---|------|--------|------|------|
| **P1-1** | TriLC 独立 daemon 注册 | P0 | TriCade MSI 安装程序 | Windows Service / RegRun，二选一自动检测 |
| **P1-2** | 安装 UX（checkbox） | P0 | P1-1 | 默认勾选，文案 CEO 已指定 |
| **P1-3** | 系统托盘图标 | P0 | P1-1 | 状态指示 + 右键菜单四操作 |
| **P1-4** | 本地会话持久化存储 | P0 | TriLC session-store 扩展 | 替换当前内存存储为文件/SQLite 持久化 |
| **P1-5** | 本地会话列表 UI | P0 | P1-4 + TriLC `GET /sessions` | "本地会话" Tab（Q8 规格） |
| **P1-6** | 会话状态可视化 | P0 | P1-5 | 四色状态（Q4 裁决：🟢/✅/❌/⏹️） |
| **P1-7** | 云按钮（占位） | P1 | P1-5 | 按钮可见但 TriMC 未就绪时 disabled + tooltip |
| **P1-8** | 云端会话 Tab（占位） | P1 | P1-5 | Tab 可见 + 占位文案，不阻塞本地功能 |
| **P1-9** | 自动重连（IDE 重启） | P0 | P1-4 + TriLC `POST /sessions/recover` | Q4 裁决落地，本 Phase 终于可验证 |
| **P1-10** | TWF-001 fallback 保留 | P1 | — | TriPilot→TriMC fallback 路径不变（Q2 裁决保证） |

### 11b. Phase 2（TriMC 就绪后，W32+ 预估）

| # | 功能 | 前置条件 |
|---|------|---------|
| **P2-1** | TriMC `POST /internal/v1/sessions/sync` 端点 | TriMC 数据库 + API 层就绪 |
| **P2-2** | 云按钮完整功能（→ ☁️⬆ → 🔄 → ☁️✅） | P2-1 + TriLC 同步逻辑 |
| **P2-3** | 云端会话列表（真实数据） | P2-1 + TriMC `GET /sessions` |
| **P2-4** | 云端会话"下载到本地" | P2-1 |
| **P2-5** | 增量同步优化 | P2-2 验证稳定后 |
| **P2-6** | 自动同步开关（产品设置） | P2-2 |
| **P2-7** | TriMC 云端通知回传 TriLC | TriMC → TriLC 通道成熟 |
| **P2-8** | macOS LaunchAgent / Linux systemd | 跨平台 TriCade |

### 11c. Phase 3（Post-MVP，不排期）

| # | 功能 | 说明 |
|---|------|------|
| **P3-1** | 跨设备会话延续（手机上继续 PC 对话） | 依赖 P2-1 + P2-3 |
| **P3-2** | 高级系统托盘（通知、最近会话预览） | 用户反馈驱动 |
| **P3-3** | TriMobile 远程触发 PC 任务 | 需独立 CPO 裁决 |
| **P3-4** | TriMC 上按"项目/团队"共享会话 | 组织级会话管理 |

### 11d. 裁决边界提醒

- Phase 1 已包含的云按钮和云端会话 Tab 在 TriMC 端点未就绪时，以**可见但 disabled**（或占位文案）方式存在——不做"等 TriMC 好了再加 UI"的瀑布式等待。这样做的好处：① 用户知道这个功能存在；② 产品面完整；③ TriMC 端点就绪后只需解除 disabled 状态。
- Phase 1 的 P0 项是 TriLC 独立 daemon 化的**最小闭环**：安装→注册→后台运行→IDE 重开自动重连→会话不丢失。这是对 Q1（TriPilot 零执行）和 Q4（会话恢复）裁决的**可实现性验证**。
- 当前偏差 D2（IDE 关闭=任务终止）在本 Phase 完成后应标记为 **closed**。

---

## 跨裁决影响汇总

### 与已有裁决的一致性检查

| 已有裁决 | 影响 | 一致性 |
|----------|------|--------|
| Q1: TriPilot 零执行 | ✅ 不受影响；daemon 独立化进一步强化此裁决 | 一致 |
| Q2: SSE + HTTP 分层协议 | ✅ 不受影响；新增会话管理 UI 通过已有端点③④消费 | 一致 |
| Q3: TriCode 归 TriLC | ✅ 不受影响 | 一致 |
| Q4: 会话自动恢复 | ✅ **本裁决 P1-9 是实现 Q4 的关键里程碑** | 承接 |
| Q5: W29 FREEZE | ✅ 不受影响；本裁决属于 W30 新工作，不改变 W29 收口 | 一致 |
| Q6: 多入口路由+镜像 | ✅ **Q7-Q11 是 Q6 的用户面延伸**；Q6 管机器协议，Q9 管用户操作 | 互补 |

### 需 CTO 启动的工作项

1. **TriLC daemon 系统注册**：Windows Service 创建/移除脚本（`sc create/delete`）+ RegRun fallback
2. **系统托盘应用**：独立 Electron/Tauri 托盘进程，或复用现有 Node.js + `systray` 库
3. **会话持久化存储**：从内存 `Map` 迁移到文件（JSONL）或 SQLite
4. **TriLC daemon 独立生命周期**：与 TriPilot 进程解耦——daemon 不在 TriPilot 扩展进程内启动/停止
5. **TriMC 新增端点**：`POST /internal/v1/sessions/sync` + 对应的数据库 schema（Phase 2）
6. **TriCade MSI 安装程序改造**：添加 checkbox + Service/RegRun 注册逻辑
7. **技术设计更新**：在 `cpo-pc-layer-escalation/w30-architecture-fix-design.md` 追加本裁决的技术实施方案

### 需 CEOChiefOfStaff 收口的工作项

1. 将本裁决纳入 W30 操作记录 + 新建 `arch-trilc-daemon` 任务树
2. 更新 `TWF-002/known-deviations.md`：D2（IDE 关闭=任务终止）标注"W30 P1-9 修复中"
3. 追踪 CTO 技术设计补充的产出时间

### 需修正的文档

| 文件 | 修正内容 | 优先级 |
|------|---------|--------|
| TriLC `docs/registry/product-state.md` | 追加"独立 daemon + 系统托盘 + 会话持久化"到 Current Product Scope | P1（W30 实现后） |
| TriMC `docs/registry/product-state.md` | 追加"会话同步端点 `POST /internal/v1/sessions/sync`"到 Current Product Scope | P2（TriMC 就绪后） |
| `docs/三元宇宙架构与模块说明.md` §4 L67 | TriLC 行追加"独立系统 daemon，TriCade 安装注册，系统托盘管理" | P2 |
| `TWF-002/known-deviations.md` | D2 标注 W30 修复路径 | P0 |

---

## 裁决依据清单

| 文件 | 关键行/节 | 作用 |
|------|----------|------|
| CEO 本次升级输入 | 全文 | 五个设计问题，触发本裁决 |
| `cpo-pc-layer-escalation/ruling.md` | Q1-Q6 裁决全文 | 已有裁决基线，Q7-Q11 需与之保持一致 |
| `cpo-pc-layer-escalation/w30-architecture-fix-design.md` | 全文 | CTO 已有的 W30 技术设计，本裁决需追加到其中 |
| TriLC `docs/registry/product-state.md` | §Current Product Scope | TriLC 当前产品面定义 |
| TriMC `docs/registry/product-state.md` | §Current Product Scope | TriMC 当前能力面，用于判定 Phase 1/2 边界 |
| TriCompany `docs/registry/product-state.md` | §模块边界表 | 确认 PC 端四模块与 TriMC/TriMobile 的当前成熟度 |
| TriLC `src/cli.ts` | `cmdStart()` detached spawn | 已有 daemon 化工程技术基础 |
| `TWF-002/known-deviations.md` | D2 | 当前偏差：IDE 关闭=任务终止（本裁决 P1-9 修复） |

---

**裁决完成时间**：2026-07-22T15:09+08:00  
**整体裁决状态更新**：Q7-Q11 全部 `APPROVE`  
**下一步**：CTO（小狄）——基于本裁决更新 W30 技术设计，追加 TriLC 独立 daemon 化 + 系统托盘 + 会话持久化 + 安装 UX + 云按钮占位的实施方案  
**追踪**：小贾（CEOChiefOfStaff）创建 `arch-trilc-daemon` 任务树，节点 `td-1` → done，next_agent → CTO

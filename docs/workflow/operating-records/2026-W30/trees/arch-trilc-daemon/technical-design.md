# CTO 技术设计：TriLC 独立 Daemon + 安装 UX + 多入口会话管理

> **作者**：小狄（CTO）  
> **日期**：2026-07-22  
> **版本**：v1.0  
> **上游裁决**：CPO Q7-Q11（`ruling.md`）  
> **任务树**：`arch-trilc-daemon`，节点 `td-2`  
> **关联设计**：`cpo-pc-layer-escalation/w30-architecture-fix-design.md` v1.0  
> **状态**：`APPROVE` — 技术可行，无 FREEZE 项

---

## 前置核查摘要

| # | 核查项 | 文件 | 关键发现 |
|---|--------|------|---------|
| 0 | 工作路径 | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-daemon/` | ✅ 路径正确 |
| 0.5 | 归属路由 | CPO 裁决域 | ✅ Q7-Q11 为 CPO 产品裁决；本文件为 CTO 技术设计承接，归属正确 |
| 1 | CEO 最新输入 | 本次升级 | 五个设计问题：安装 UX、会话管理 UI、同步协议、TriMobile 可见性、MVP 范围 |
| 2 | BusinessStrategy | `business-strategy-boundaries.md` L20-21 | TriLC = 本地人机协作主入口，detached local runtime + planner + tool bus |
| 3 | 技术真源 | `DESIGN.md` / `STATE.md` | TriMetaverse 侧为发布摘要页；真源在 TriCompany source 侧 |
| 4 | Code Registry | `code-state.md` L39（CTO-008-M）、L40（CTO-008-P） | TriLC HTTP 服务器、ConnectionManager、Phase P0 打包脚本均已就位 |
| 5 | 模块 Code Registry | TriLC `src/session-store/store.ts`（SQLite DDL）、`src/cli.ts`（detached spawn） | 会话持久化 + CLI 生命周期管理已可用 |
| 6 | 公司治理 | — | 不阻塞本设计 |

**关键发现**：
1. TriLC SQLite session-store 使用 Node 22 内置 `node:sqlite`，已有 `sessions` + `session_messages` 两张表。云同步需追加 3 个字段，不涉及 schema 大改。
2. TriLC CLI 已有 `start/stop/status/run` + PID 文件管理，可直接作为 Windows Service 的 entry point。
3. 当前 daemon 生命周期绑定 TriPilot 进程（D2 偏差根因）。本设计通过 Service/RegRun 注册彻底解耦，D2 自然消除。

---

## 1. 架构总览

### 1.1 三层进程模型

```
┌──────────────────────────────────────────────────────────┐
│                    TriCade MSI 安装器                      │
│  ┌──────────────────────────────────────────────────────┐│
│  │ 选择组件页面                                         ││
│  │  ☑ VSCodium (便携版)                                 ││
│  │  ☑ TriPilot 扩展                                     ││
│  │  ☑ 将 TriLC 注册为系统服务（推荐）  ← 新增 checkbox  ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
         │
         │ 安装完成
         ▼
┌──────────────────────────────────────────────────────────┐
│  进程 1: TriLC Daemon (独立生命周期)                       │
│                                                            │
│  注册方式（二选一，自动检测）：                              │
│  ┌─────────────────────┐  ┌─────────────────────────┐     │
│  │ 管理员: Windows      │  │ 非管理员: RegRun         │     │
│  │ Service              │  │ HKCU\...\Run\TriLC      │     │
│  │ sc create TriLC      │  │ 登录时自动启动           │     │
│  │ start= delayed-auto  │  │                         │     │
│  └─────────┬───────────┘  └───────────┬─────────────┘     │
│            │                          │                    │
│            └──────────┬───────────────┘                    │
│                       ▼                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  TriLC HTTP Server (:8711)                            │ │
│  │  ┌──────────────┐ ┌────────────┐ ┌───────────────┐  │ │
│  │  │ Connection   │ │ session-   │ │ agentLoop()   │  │ │
│  │  │ Manager      │ │ store      │ │ (本地执行)    │  │ │
│  │  │ TriMC↔TriLC  │ │ SQLite     │ │               │  │ │
│  │  └──────────────┘ └────────────┘ └───────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
         │ HTTP localhost:8711
         ▼
┌──────────────────────────────────────────────────────────┐
│  进程 2: TriLC Tray (独立 UI 进程)                         │
│                                                            │
│  🟢 TriLC 运行中                                          │
│  ┌──────────────────────┐                                │
│  │ 右键菜单:             │                                │
│  │ ① TriLC 状态          │                                │
│  │ ② 启动 / 停止         │                                │
│  │ ③ 打开本地会话面板     │                                │
│  │ ④ 退出                │                                │
│  └──────────────────────┘                                │
└──────────────────────────────────────────────────────────┘
         │
         │ 独立于 TriCade/VSCodium
         ▼
┌──────────────────────────────────────────────────────────┐
│  进程 3: TriPilot (VSCodium 扩展，用户 IDE 入口)           │
│                                                            │
│  启动时: GET /healthz → 检测 daemon → 自动重连              │
│  聊天:   POST /internal/v1/tasks/submit → SSE stream       │
│  会话:   GET /internal/v1/sessions → 双 Tab UI             │
└──────────────────────────────────────────────────────────┘
```

### 1.2 与已有架构的关系

本设计是 `w30-architecture-fix-design.md` 的**追加层**，不改变其核心数据流（TriPilot→TriLC→TriCode/agentLoop）。新增内容：
- **部署层**：daemon 系统注册（Service/RegRun）+ 安装 UX
- **管理层**：系统托盘进程（独立于 TriCade）
- **持久化层**：session-store 云同步字段扩展
- **UI 层**：会话 Tab UI + 云按钮的 API 契约基础

---

## 2. Windows Service 注册

### 2.1 技术选型

| 方案 | 优点 | 缺点 | 判定 |
|------|------|------|------|
| `sc create`（原生） | 零依赖，Windows 内置，稳定 | 需手动处理错误码、权限检测 | ✅ **选择** |
| `node-windows` npm | 封装良好，有日志 | 额外依赖，维护滞后，与 ESM 兼容性差 | ❌ |
| PowerShell `New-Service` | 脚本简洁 | 需 PowerShell 运行时，跨进程调用复杂 | ❌ 作为 MSI CustomAction 考虑 |

**决策**：使用 `sc.exe` 通过 Node.js `child_process.exec`，由 TriLC CLI 新增 `install-service` / `uninstall-service` 命令封装。

### 2.2 CLI 命令扩展

```bash
# 安装为 Windows Service（需管理员）
trilc install-service [--name TriLC] [--displayName "TriMetaverse Local Controller"]

# 卸载 Windows Service
trilc uninstall-service [--name TriLC]
```

### 2.3 实现规格

```typescript
// src/cli.ts 新增函数

async function installService(name: string, displayName: string): Promise<void> {
  // 1. 权限检测
  const isAdmin = await checkAdminPrivilege();
  if (!isAdmin) {
    console.error('ERROR: 需要管理员权限才能注册 Windows Service');
    console.error('请以管理员身份运行，或将使用 Registry Run 注册（见 install-regrun）');
    process.exit(1);
  }

  // 2. 确定 node.exe 路径
  const nodePath = process.execPath;                        // Node.js 可执行文件
  const cliPath = resolve(__dirname, 'cli.js');             // 本 CLI 入口
  const binPath = `"${nodePath}" "${cliPath}" run`;        // Service 启动命令

  // 3. 创建服务
  // sc create TriLC binPath= "node \"C:\\...\\cli.js\" run" start= delayed-auto
  await exec(`sc create ${name} binPath= ${binPath} start= delayed-auto`);
  
  // 4. 设置描述
  // sc description TriLC "TriMetaverse Local Controller — AI-powered local agent daemon"
  await exec(`sc description ${name} "TriMetaverse Local Controller — AI-powered local agent daemon"`);

  // 5. 设置失败恢复（崩溃后自动重启）
  // sc failure TriLC reset= 86400 actions= restart/60000/restart/60000/restart/60000
  await exec(`sc failure ${name} reset= 86400 actions= restart/60000/restart/60000/restart/60000`);

  // 6. 启动服务
  await exec(`sc start ${name}`);

  console.log(`✅ TriLC Windows Service "${name}" 已安装并启动`);
}

async function uninstallService(name: string): Promise<void> {
  // 1. 停止服务
  try { await exec(`sc stop ${name}`); } catch { /* 可能已停止 */ }
  
  // 2. 删除服务
  await exec(`sc delete ${name}`);
  
  // 3. 清理 PID 文件
  await removePidFile();
  
  console.log(`✅ TriLC Windows Service "${name}" 已卸载`);
}
```

### 2.4 Service 配置明细

| 参数 | 值 | 说明 |
|------|---|------|
| `binPath` | `"{node.exe}" "{cli.js}" run` | 以 `run` 命令在前台运行（Service 需前台进程） |
| `start` | `delayed-auto` | 延迟自动启动，避免拖慢开机 |
| `failure reset` | `86400` (24h) | 失败计数器重置周期 |
| `failure actions` | `restart/60000` × 3 | 每次崩溃后 60s 自动重启，最多 3 次 |
| 依赖 | 无 | 不依赖其他 Windows Service |
| 账户 | `LocalSystem` | 默认，有完全本地权限 |

### 2.5 安全考量

- `LocalSystem` 账户运行，具有完整本地权限 → `shell_exec` 工具沙箱化在此层级无效，依赖 TriLC 内置 tool-gating。
- 后续 Phase 2 可考虑 `NetworkService` 降权账户，但需验证 `agentLoop` 的文件系统访问需求。
- Service 监听 `127.0.0.1:8711`，不暴露到外部网络。

---

## 3. Registry Run 兜底（非管理员路径）

### 3.1 技术方案

写入 Windows 注册表键：
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
  TriLC = REG_SZ: "C:\Program Files\nodejs\node.exe" "C:\Program Files\TriMetaverse\TriLC\dist\cli.js" run
```

### 3.2 CLI 命令扩展

```bash
# 注册到 Registry Run（无需管理员）
trilc install-regrun

# 从 Registry Run 移除
trilc uninstall-regrun
```

### 3.3 实现规格

```typescript
// src/cli.ts 新增函数

async function installRegRun(nodePath: string, cliPath: string): Promise<void> {
  // Windows 注册表操作
  const { exec } = await import('node:child_process');
  const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v TriLC /t REG_SZ /d "\\"${nodePath}\\" \\"${cliPath}\\" run" /f`;
  await exec(cmd);
  console.log('✅ TriLC 已注册到 Registry Run（登录时自动启动）');
}

async function uninstallRegRun(): Promise<void> {
  const { exec } = await import('node:child_process');
  await exec('reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v TriLC /f');
  console.log('✅ TriLC 已从 Registry Run 移除');
}
```

### 3.4 与 Service 的互斥

- `install-service` 和 `install-regrun` **互斥**：检测到已有另一种注册方式时提示用户先卸载。
- CLI `start` 命令（detached spawn）依然可用，作为临时/调试启动方式。

---

## 4. 系统托盘（System Tray）

### 4.1 技术选型

| 方案 | 体积 | 复杂度 | Windows原生 | 跨平台潜力 | 判定 |
|------|------|--------|------------|-----------|------|
| **C# WinForms tray** | ~100KB 编译 | 低 | ✅ 原生 | ❌ | ✅ **Phase 1 选择** |
| Electron tray | ~50MB | 中 | ✅ | ✅ | ❌ Phase 1 过重 |
| Tauri tray | ~3MB | 中 | ✅ | ✅ | ⏸ Phase 2 考虑 |
| Node.js `systray` | ~5MB | 高（native addon） | 需编译 | 有限 | ❌ 编译链复杂 |

**决策**：Phase 1 Windows MVP 使用 **C# WinForms NotifyIcon**，编译为单文件自包含 `.exe`（约 100KB）。Phase 2（跨平台）迁移至 Tauri tray。

### 4.2 进程架构

```
TriLC.Tray.exe (独立进程，与 daemon 通过 HTTP 通信)
│
├── 启动时：检查 daemon 是否运行 (GET http://127.0.0.1:8711/healthz)
│   ├── 是 → 🟢 绿色托盘
│   └── 否 → 🔴 红色托盘
│
├── 定时轮询（每 5s）：GET /healthz → 更新托盘颜色
│
├── 右键菜单：
│   ├── "TriLC 状态: ● 运行中" (不可点击，仅展示)
│   ├── ────────────── (分隔线)
│   ├── "启动 TriLC" / "停止 TriLC" (根据当前状态显示)
│   ├── "打开本地会话面板" → 打开 TriPilot webview 或独立面板
│   └── "退出" → 关闭托盘（不影响 daemon）
│
└── 左键点击 → "打开本地会话面板"
```

### 4.3 Tray 与 Daemon 通信协议

Tray 本身不启动/停止 daemon（由 Service/RegRun 管理层负责）。Tray 的通信接口：

| 操作 | HTTP 请求 | 说明 |
|------|----------|------|
| 检测状态 | `GET /healthz` | 返回 `{ ok, service, trimc }` |
| 启动 daemon | 无（由 Service 管理器负责） | Tray 调用 `sc start TriLC` 或 spawn |
| 停止 daemon | 无（由 Service 管理器负责） | Tray 调用 `sc stop TriLC` 或 `POST /internal/v1/shutdown` |
| 获取会话数 | `GET /internal/v1/sessions?status=running&limit=1` | 用于展示"X 个活跃会话" tooltip |

**关键设计原则**：Tray 是**只读状态展示 + 快捷入口**，不承载 daemon 生命周期管理。启动/停止由 Windows Service 管理器或 TriLC CLI 负责。Tray 中的"启动/停止"菜单项委托给 `sc start/stop` 或 `trilc start/stop`。

### 4.4 实现文件

```
TriLC/
├── src/
│   └── tray/
│       ├── Program.cs          # WinForms 入口，NotifyIcon 创建
│       ├── TrayIcon.cs         # 托盘图标管理（颜色切换、菜单构建）
│       ├── DaemonChecker.cs    # HTTP healthz 轮询
│       └── TriLC.Tray.csproj   # .NET 项目文件（net8.0-windows, PublishSingleFile）
├── scripts/
│   └── build-tray.ps1          # 编译脚本：dotnet publish → 输出单文件 exe
└── dist/
    └── TriLC.Tray.exe          # 编译产物（分发给 TriCade MSI）
```

### 4.5 托盘颜色定义

| 颜色 | 状态 | 触发条件 |
|------|------|---------|
| 🟢 绿色 | 运行中 | Daemon `/healthz` 返回 200 |
| 🔴 红色 | 已停止/异常 | `/healthz` 无响应或返回非 200 |
| ⚪ 灰色 | 未安装/未启动 | 初始状态，或 daemon 进程不存在 |

> **实现注**：颜色 + 图标组合——绿色圆点 icon、红色圆点 icon、灰色圆点 icon 作为三张独立 `.ico` 资源嵌入。

### 4.6 通知策略

Phase 1 仅触发一种通知：
- **Daemon 异常退出**：当 Tray 检测到 `/healthz` 从 200 → 无响应时，弹出 Windows 通知："TriLC 已停止运行。点击查看详情。"

---

## 5. TriPilot 自动重连机制

### 5.1 连接检查时序

```
TriPilot extension.ts activate()
    │
    ├─ 1. 检测 TriLC daemon
    │     GET http://127.0.0.1:8711/healthz
    │     ├─ 200 OK → daemon 在线
    │     │   ├─ 2. 查询活跃会话
    │     │   │   GET /internal/v1/sessions?status=running
    │     │   │   ├─ 有活跃会话 → 展示"恢复会话"对话框
    │     │   │   │   - "你有一个运行中的任务：重构 TriPilot 工具执行路径"
    │     │   │   │   - [恢复] [新建]
    │     │   │   └─ 无活跃会话 → 正常启动，展示空会话列表
    │     │   └─ 3. 初始化 TriLCClient
    │     │       - 建立 SSE 连接监听工具事件
    │     │       - 设置状态指示器为 🟢 "已连接 TriLC"
    │     │
    │     └─ 非 200 → daemon 离线
    │         ├─ 4. 尝试启动 daemon
    │         │   └─ 让用户选择：[启动 TriLC] [使用云端 TriMC] [稍后]
    │         └─ 5. Fallback 路径 (TWF-001 保留)
    │             └─ TriPilot → TriMC（如果用户选择云端）
    │
    └─ 持续健康检查（每 30s）
        GET /healthz → 更新状态指示器
```

### 5.2 实现接口

此逻辑在 TriPilot 侧 `TriLCClient`（W30 架构修正设计 §2.2）中实现，由 CTO-008-M ConnectionManager 的健康检查驱动。

**TriLC 侧无需新增端点**：已有 `/healthz` + `GET /internal/v1/sessions` 覆盖需求。

---

## 6. 会话持久化存储扩展

### 6.1 当前 Schema（已有，无需改动）

```sql
-- sessions 表（现有）
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'active',       -- 'active'|'completed'|'interrupted'|'expired'
  model TEXT NOT NULL,
  system_prompt TEXT NOT NULL DEFAULT '',
  cwd TEXT NOT NULL DEFAULT '',
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  closed_at TEXT
);

-- session_messages 表（现有）
CREATE TABLE session_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  role TEXT NOT NULL,                         -- 'user'|'assistant'|'system'|'tool'
  content TEXT,
  tool_calls TEXT,                            -- JSON-serialized
  tool_call_id TEXT,
  reasoning_content TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);
```

### 6.2 新增字段（云同步支持）

```sql
-- 追加到 sessions 表（migration）
ALTER TABLE sessions ADD COLUMN title TEXT;                      -- 会话标题（首条用户消息截取）
ALTER TABLE sessions ADD COLUMN sync_status TEXT DEFAULT 'local';-- 'local'|'pending'|'syncing'|'synced'|'error'
ALTER TABLE sessions ADD COLUMN last_synced_at TEXT;             -- 最后同步时间 ISO 8601
ALTER TABLE sessions ADD COLUMN cloud_session_id TEXT;           -- TriMC 返回的云端会话 ID
```

### 6.3 新增 DDL

```sql
-- migration 脚本（幂等）
-- 使用 PRAGMA user_version 追踪 schema version

-- v2: add cloud sync fields (2026-07-22)
ALTER TABLE sessions ADD COLUMN title TEXT;
ALTER TABLE sessions ADD COLUMN sync_status TEXT DEFAULT 'local';
ALTER TABLE sessions ADD COLUMN last_synced_at TEXT;
ALTER TABLE sessions ADD COLUMN cloud_session_id TEXT;

CREATE INDEX IF NOT EXISTS idx_sessions_sync ON sessions(sync_status, updated_at);
```

### 6.4 云同步状态机

```
                ┌─────────┐
    新建会话 ──→│  local  │
                └────┬────┘
                     │ 产生新消息（自动标记）
                     ▼
                ┌─────────┐
    用户可见 ◄──│ pending │  ← ☁️⬆ 云按钮显示
                └────┬────┘
                     │ 用户点击云按钮
                     ▼
                ┌─────────┐
    用户可见 ◄──│ syncing │  ← 🔄 旋转动画
                └────┬────┘
                     │ TriMC 返回 200
                     ▼
                ┌─────────┐
    用户可见 ◄──│ synced  │  ← ☁️✅ 已同步
                └────┬────┘
                     │ 产生新消息（自动标记）
                     ▼
                ┌─────────┐
    用户可见 ◄──│ pending │  ← ☁️⬆ 再次待同步
                └─────────┘

    任何 sync HTTP 调用失败 → 'error'
      按钮显示 ⚠️ + tooltip "同步失败：TriMC 不可达"
      用户可手动重试（点击云按钮）
```

### 6.5 TypeScript 类型扩展

```typescript
// src/session-store/types.ts 新增

export type SyncStatus = 'local' | 'pending' | 'syncing' | 'synced' | 'error';

export interface SessionRecord {
  // ... 现有字段保持不变 ...
  title?: string;                    // 新增
  syncStatus?: SyncStatus;           // 新增，默认 'local'
  lastSyncedAt?: string | null;      // 新增
  cloudSessionId?: string | null;    // 新增
}
```

### 6.6 Store 方法扩展

```typescript
// src/session-store/store.ts 新增方法

function updateSyncStatus(
  id: string,
  syncStatus: SyncStatus,
  cloudSessionId?: string,
): void {
  const lastSyncedAt = syncStatus === 'synced' ? new Date().toISOString() : null;
  db.prepare(`
    UPDATE sessions SET
      sync_status = ?, last_synced_at = ?, cloud_session_id = ?
    WHERE id = ?
  `).run(syncStatus, lastSyncedAt, cloudSessionId ?? null, id);
}

function getPendingSyncSessions(): SessionRecord[] {
  // 返回所有 sync_status = 'pending' 的会话
  const rows = db.prepare(`
    SELECT * FROM sessions WHERE sync_status = 'pending'
    ORDER BY updated_at DESC LIMIT 50
  `).all() as unknown as Record<string, unknown>[];
  return rows.map(rowToSession);
}
```

---

## 7. 云同步 API 端点契约

### 7.1 端点定义

**TriMC 侧新增**：`POST /internal/v1/sessions/sync`

> Phase 1 占位：TriMC 端点未就绪时，TriLC 云按钮 disabled。本文档定义完整的 API 契约供 TriMC 实施。

### 7.2 Request（TriLC → TriMC）

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

### 7.3 Response（TriMC → TriLC）

**200 OK**：
```json
{
  "ok": true,
  "cloudSessionId": "cloud-sess-abc456",
  "localSessionId": "sess-xyz789",
  "syncedMessageCount": 12,
  "syncedAt": "2026-07-22T10:15:30+08:00"
}
```

**409 Conflict**（去重——同一 localSessionId 已存在）：
```json
{
  "ok": false,
  "error": "duplicate_session",
  "message": "Session already synced",
  "existingCloudSessionId": "cloud-sess-abc456"
}
```

**503 Service Unavailable**：
```json
{
  "ok": false,
  "error": "service_unavailable",
  "message": "TriMC unable to accept session sync at this time"
}
```

### 7.4 契约约束

| 维度 | 约束 | 说明 |
|------|------|------|
| **幂等键** | `(nodeId, localSessionId)` | TriMC 端唯一索引 |
| **消息上限** | ≤ 5000 条 | 超出截断 + TriLC 提示 |
| **请求体上限** | 10MB | 超限拒绝（413），提示分片同步 |
| **超时** | 30s | 同步请求最长等待 |
| **重试** | 指数退避 1s/2s/4s，最多 3 次 | TriLC 侧实现 |
| **同步方向** | TriLC → TriMC 单向 | Phase 1 不实现反向下载 |

### 7.5 TriLC 侧同步逻辑

```typescript
// 新增 src/sync/sync-engine.ts

export async function syncSessionToTriMC(
  store: SessionStore,
  sessionId: string,
  trimcUrl: string,
  nodeId: string,
): Promise<SyncResult> {
  // 1. 检查 sync_status 是否已是 'syncing'
  const session = store.getSession(sessionId);
  if (session.syncStatus === 'syncing') {
    return { ok: false, error: 'already_syncing' };
  }

  // 2. 标记为 syncing
  store.updateSyncStatus(sessionId, 'syncing');

  // 3. 组装 payload
  const messages = store.getMessages(sessionId);
  if (messages.length > 5000) {
    // 截断 + 提示
    messages.length = 5000;
  }
  const payload = buildSyncPayload(session, messages, nodeId);

  // 4. 发送 HTTP POST（带重试）
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${trimcUrl}/internal/v1/sessions/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        store.updateSyncStatus(sessionId, 'synced', data.cloudSessionId);
        return { ok: true, cloudSessionId: data.cloudSessionId };
      }
      if (res.status === 409) {
        // 去重：标记为已同步
        store.updateSyncStatus(sessionId, 'synced', data.existingCloudSessionId);
        return { ok: true, cloudSessionId: data.existingCloudSessionId };
      }
      lastError = new Error(data.message || `HTTP ${res.status}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
    // 指数退避
    await sleep(Math.pow(2, attempt) * 1000);
  }

  // 5. 失败：标记为 error
  store.updateSyncStatus(sessionId, 'error');
  return { ok: false, error: lastError?.message };
}
```

---

## 8. TriCade MSI 安装 UX 实现

### 8.1 WiX 安装程序改造

TriCade 使用 WiX Toolset 构建 MSI。需要新增：
1. **自定义对话框**：含 checkbox "将 TriLC 注册为系统服务（推荐）"
2. **CustomAction**：安装完成后执行 TriLC 服务注册

### 8.2 WiX 源码片段（伪代码）

```xml
<!-- TriCade.wxs -->
<Fragment>
  <!-- 自定义对话框 -->
  <Dialog Id="TriLCDaemonDlg" Width="370" Height="270"
          Title="TriMetaverse TriCade Setup">
    <Control Id="TriLCCheckbox" Type="CheckBox"
             X="20" Y="100" Width="330" Height="18"
             Property="INSTALL_TRILC_SERVICE"
             CheckBoxValue="1"
             Text="将 TriLC 注册为系统服务（推荐）" />
    <Control Id="TriLCDesc" Type="Text"
             X="38" Y="120" Width="310" Height="32"
             Text="TriLC 是本地 AI 助手守护进程，注册为服务后将在系统启动时自动运行，确保 IDE 关闭后任务继续执行。" />
  </Dialog>
</Fragment>

<Fragment>
  <!-- CustomAction：安装完成后注册服务 -->
  <CustomAction Id="InstallTriLCService"
                FileKey="trilcCliExe"
                ExeCommand='install-service'
                Execute="deferred"
                Impersonate="no"
                Return="check" />

  <InstallExecuteSequence>
    <Custom Action="InstallTriLCService"
            After="InstallFiles">
      <!-- 仅当 checkbox 被勾选时执行 -->
      <![CDATA[INSTALL_TRILC_SERVICE = "1"]]>
    </Custom>
  </InstallExecuteSequence>
</Fragment>
```

### 8.3 权限检测 CustomAction

在 `InstallTriLCService` 之前，插入权限检测：

```xml
<!-- 检测是否为管理员安装 -->
<CustomAction Id="CheckAdminPrivilege"
              Script="vbscript">
  <![CDATA[
    Dim objShell
    Set objShell = CreateObject("Shell.Application")
    If Not objShell.IsRestricted("System") Then
      Session.Property("HAS_ADMIN") = "1"
    Else
      Session.Property("HAS_ADMIN") = "0"
    End If
  ]]>
</CustomAction>
```

如果 `HAS_ADMIN=1`，调用 `trilc.exe install-service`（写入 `sc create`）。  
如果 `HAS_ADMIN=0`，调用 `trilc.exe install-regrun` + toast 提示"建议以管理员身份安装以获得系统服务级别"。

### 8.4 安装后行为

```
MSI 安装完成
    │
    ├─ checkbox 已勾选
    │   ├─ 管理员 → sc create + sc start → daemon 立即运行
    │   └─ 非管理员 → reg add Run key → 提示重启或手动启动
    │
    └─ checkbox 未勾选
        └─ 不注册 daemon，用户可手动运行 trilc start
```

### 8.5 卸载时清理

```
MSI 卸载 CustomAction:
    ├─ sc stop TriLC (如果存在)
    ├─ sc delete TriLC (如果存在)
    ├─ reg delete HKCU\...\Run\TriLC (如果存在)
    ├─ 停止并移除 Tray 进程
    └─ 询问："是否保留本地会话数据？"
        ├─ 是 → 保留 %USERPROFILE%\.trimetaverse\tri-lc.db
        └─ 否 → 删除 SQLite 数据库
```

---

## 9. 实施顺序

### 9.1 与已有 S1-S8 的关系

本设计是 W30 架构修正（S1-S8）的**并行追加层**，不是替代。S1-S8 专注数据流（TriPilot→TriLC→TriCode），本设计专注部署与生命周期。

| 已有步骤 | 本设计步骤 | 关系 |
|----------|----------|------|
| S1-S4: TriLC 端点实现 | ✅ 不变 | 本设计依赖这些端点就位 |
| S5: TriPilot 自动重连 + 会话 UI | **增强** | 本设计 §5 提供健康检查时序，§6 提供持久化基础 |
| S6: TriCode 接口改造 | ✅ 不变 | 无影响 |
| S7: TriMC mirror 端点 | **补充** | 本设计 §7 定义 sync 端点契约 |
| S8: TriCade 打包 + 偏差关闭 | **增强** | 本设计 §8 提供 MSI 改造方案 |

### 9.2 新增实施步骤

| 步骤 | 内容 | 依赖 | 验证方式 | 预估工时 |
|------|------|------|---------|---------|
| **D1** | TriLC CLI 新增 `install-service` / `uninstall-service` / `install-regrun` / `uninstall-regrun` | 无 | 管理员终端 `trilc install-service` + `sc query TriLC` 验证 | 2h |
| **D2** | C# Tray 项目创建 + 编译脚本 | 无 | `dotnet publish` 生成单文件 exe，双击托盘出现 | 4h |
| **D3** | Tray ↔ Daemon HTTP 通信 | D2 + daemon 运行 | Tray 图标颜色随 daemon 启停变化 | 2h |
| **D4** | session-store schema migration + 云同步字段 | 无（已有 SQLite） | `PRAGMA table_info(sessions)` 确认新字段 | 1h |
| **D5** | session-store 新增 `updateSyncStatus` / `getPendingSyncSessions` | D4 | 单元测试覆盖状态机 | 1h |
| **D6** | 云同步引擎 `sync-engine.ts` | D5 | unit test mock TriMC response | 2h |
| **D7** | TriLC 新增 `POST /internal/v1/sessions/{id}/sync` 端点 | D6 | curl 触发同步 → 检查 SQLite sync_status 变化 | 1h |
| **D8** | TriLC 新增 `GET /internal/v1/sessions` 返回 syncStatus 字段 | D4 | curl 验证响应包含 `syncStatus` | 0.5h |
| **D9** | TriCade MSI: WiX 对话框 + CustomAction | D1 + TriCade 打包就绪 | MSI 安装 → checkbox 勾选 → 安装后 `sc query TriLC` | 4h |
| **D10** | 端到端验证：MSI 安装 → daemon 自动运行 → Tray 显示 → TriPilot 连接 | D1-D9 全部 | 全新 VM 安装 TriCade MSI → 全流程验证 | 2h |

### 9.3 综合时序

```
S1-S4 (已有 W30 P0) ────────┐
                             ├──→ S5 (TriPilot 重构) ──→ S6 (TriCode) ──→ S8 (回归)
D1-D5 (本设计 P0) ───────────┘
D6-D8 (本设计 P1) ───────────→ D9 (MSI) ──→ D10 (E2E)
D2-D3 (Tray) ────────────────┘
```

---

## 10. 测试门禁

### 10.1 单元测试

| 模块 | 目标 | 关键测试 |
|------|------|---------|
| TriLC CLI | `install-service` / `install-regrun` 命令 | 权限检测分支、`sc.exe` 调用参数正确性、注册表写入格式 |
| Tray | `DaemonChecker` HTTP 轮询 | `/healthz` 200 → 绿；超时 → 红；错误 → 红 |
| session-store | migration + sync 状态机 | `sync_status` 字段默认值、状态转换 local→pending→syncing→synced、error 恢复 |
| sync-engine | HTTP 同步逻辑 | 幂等去重（409）、超时处理、重试退避、截断逻辑 |

### 10.2 集成测试

| 场景 | 验证 |
|------|------|
| Service 安装 + 自启动 | `sc create` → 重启 → `sc query TriLC` 显示 RUNNING |
| RegRun 安装 + 自启动 | 写入注册表 → 登出再登入 → daemon 自动运行 |
| Tray 全生命周期 | 双击 Tray.exe → 🟢 daemon 在线 / 🔴 daemon 离线 → 右键菜单功能正常 |
| TriPilot 自动重连 | 打开 VSCodium → daemon 在线 → "恢复会话"对话框出现 |
| 卸载清理 | Service/RegRun 移除 → 会话数据保留/不保留 |

### 10.3 E2E 回归

在全新 Windows VM 上：
1. 安装 TriCade MSI（勾选 TriLC 服务）
2. 验证 `sc query TriLC` = RUNNING
3. 系统托盘出现 🟢 图标
4. 打开 VSCodium → TriPilot 检测到 daemon → 显示会话列表
5. 重启 Windows → daemon 自动启动 → Tray 自动出现 → TriPilot 自动重连
6. 卸载 TriCade → Service 移除 → 托盘退出 → 会话数据（按用户选择保留/删除）

---

## 11. 风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| `sc create` 在部分 Windows 版本行为差异 | 低 | Service 创建失败 | 兼容 Windows 10 1809+，在 `install-service` 中验证 `sc` 返回值并给出明确错误提示 |
| C# Tray 需要 .NET 8 运行时 | 中 | Tray 无法启动 | `dotnet publish` 使用 `--self-contained true` 模式，编译为单文件，无需额外运行时 |
| RegRun 注册表写入权限不足 | 低 | 非管理员安装后 daemon 不自动启动 | `install-regrun` 检测 `HKCU` 写入权限，失败时给出明确提示 |
| SQLite migration 与现有数据冲突 | 低 | 数据丢失 | migration 使用 `ALTER TABLE ADD COLUMN`（不重建表），默认值兼容现有行 |
| Tray 与 daemon 端口冲突 | 极低 | Tray 无法连接 | daemon 端口固定 8711，Tray 硬编码，无冲突路径 |
| TriCade MSI CustomAction 权限问题 | 中 | Service 注册失败 | CustomAction 使用 `Impersonate="no"` 以 SYSTEM 权限运行，避免用户权限不足 |

---

## 12. 交付物清单

| # | 交付物 | 路径 | 优先级 |
|---|--------|------|--------|
| **D1** | 本技术设计文档 | `trees/arch-trilc-daemon/technical-design.md` | W30 P0 ✅ |
| **D2** | TriLC CLI service/regrun 命令实现 | `TriLC/src/cli.ts` | W30 P0 |
| **D3** | C# Tray 项目 + 编译脚本 | `TriLC/src/tray/` | W30 P0 |
| **D4** | session-store migration + sync 字段 | `TriLC/src/session-store/store.ts` | W30 P0 |
| **D5** | 云同步引擎 | `TriLC/src/sync/sync-engine.ts` | W30 P1 |
| **D6** | TriLC sync 端点 | `TriLC/src/server/app.ts` | W30 P1 |
| **D7** | TriCade MSI WiX 改造 | TriCade 打包仓库 | W30 P1 |
| **D8** | 偏差 D2 关闭 | `TWF-002/known-deviations.md` | W30 P1 |

---

## 13. 决策记录

| 决策 ID | 议题 | 决定 | 依据 |
|---------|------|------|------|
| **CTO-009-1** | Windows Service 注册方式 | `sc create` via Node.js `child_process` | 零依赖，Windows 内置，CLI 命令封装 |
| **CTO-009-2** | 系统托盘技术 | C# WinForms NotifyIcon → 单文件自包含 exe | ~100KB，Windows 原生，Phase 2 迁移至 Tauri |
| **CTO-009-3** | Tray 生命周期管理 | Tray 只读状态 + 委托 `sc` 管理 | 分离展示与控制，避免 Tray 进程故障影响 daemon |
| **CTO-009-4** | 会话同步方向 | Phase 1 TriLC→TriMC 单向推送 | CPO Q9 裁决；反向下载标注 Phase 2 |
| **CTO-009-5** | 同步去重键 | `(nodeId, localSessionId)` | 同一 daemon + 同一本地会话 = 同一云端记录 |
| **CTO-009-6** | MSI 权限检测 | WiX CustomAction VBScript + 双路径 | 管理员→Service，非管理员→RegRun + toast |

---

## 14. 使用依据

| 文件 | 关键节 | 作用 |
|------|--------|------|
| `arch-trilc-daemon/ruling.md` | Q7-Q11 全文 | 上游 CPO 产品裁决 |
| `cpo-pc-layer-escalation/w30-architecture-fix-design.md` | §2-§5 | 数据流设计基础（TriPilot→TriLC→TriCode） |
| `cpo-pc-layer-escalation/ruling.md` | Q6（多入口路由+镜像） | 云同步与镜像的分层关系 |
| `cto-008-M-tri-mc-lc-protocol.md` | §4 连接策略 | ConnectionManager 健康检查算法 |
| `cto-008-P-pc-electron-packaging.md` | §2 Phase P0/P1 | 打包策略与三阶段渐进 |
| `business-strategy-boundaries.md` | L20-21 | TriLC = 本地人机协作主入口 |
| TriLC `src/session-store/store.ts` | 全文件 | 当前 SQLite schema DDL |
| TriLC `src/cli.ts` | 全文件 | 已有 `start/stop/status/run` + detached spawn + PID 管理 |
| TriLC `src/server/app.ts` | ConnectionManager | 已有 TriMC 健康检查状态机 |

---

**设计完成时间**：2026-07-22T15:12+08:00  
**决策状态**：6 项技术决策全部 `APPROVE`，无 `FREEZE` 项  
**下一步**：FullStackDeveloper 基于本设计实施 D1-D5（P0 优先级）  
**追踪**：小贾纳入 W30 active tree `arch-trilc-daemon`，节点 `td-2` → done，next_agent → FullStackDeveloper

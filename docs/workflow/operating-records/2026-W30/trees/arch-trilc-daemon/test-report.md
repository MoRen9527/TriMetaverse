# Test Report: arch-trilc-daemon td-4 — Daemon 注册 + 会话管理验证

**测试工程师**：小柯（TestEngineer）  
**测试日期**：2026-07-22  
**任务树**：`arch-trilc-daemon`，节点 `td-4`  
**依赖交付**：td-3 (FullStackDeveloper 小全) — TriLC `cli.ts` + `store.ts` + `types.ts`  
**上游裁决**：CPO Q7-Q11 全部 APPROVE（`ruling.md`）  
**测试门禁依据**：`technical-design.md` §10  

---

## 前置核查

| 序号 | 核查项 | 文件 | 结果 |
|------|--------|------|------|
| 0 | 工作路径 | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-daemon/` | ✅ 正确 |
| 0.5 | 归属路由 | 测试域（CTO 工程门禁框架内） | ✅ 未越界 |
| 1 | CTO/CEO 输入 | `technical-design.md` §10 | ✅ 已读取 |
| 2 | BusinessStrategy | 中央商业真源 | ✅ 模块边界无变更 |
| 3 | 代码 Registry | TriLC `src/cli.ts`, `session-store/store.ts`, `session-store/types.ts` | ✅ 已读取 |
| 4 | 已有测试 | TriLC `test/` 目录（28 个已有测试） | ✅ 全通过 |
| 5 | 代码编译 | `npx tsc --noEmit` | ⚠️ 初始失败，修复后通过 |

---

## 测试前发现的关键缺陷

### td-3 残余 Bug：`cli.ts` L445 解构缺失

- **位置**：`D:\Code\ai\TriLC\src\cli.ts` L445
- **问题**：`parseArgs()` 返回 `{ command, port, serviceName, displayName }`，但只解构了 `{ command, port }`，导致 switch case 中 `install-service` 和 `uninstall-service` 分支引用 `serviceName`/`displayName` 时报 TS2304
- **影响**：阻塞编译（3 个 TS2304 错误），td-3 修复了 switch case 但遗漏了解构
- **修复**：`const { command, port, serviceName, displayName } = parseArgs(...)` 
- **状态**：✅ 已修复，编译通过

### 设计-实现偏差：SyncStatus 默认值命名

| 维度 | 技术设计 §6.2/§6.5 | 实际实现 |
|------|-------------------|---------|
| 默认值名 | `'never'` | `'local'` |
| 类型定义 | `SyncStatus = 'never' \| 'pending' \| ...` | `SyncStatus = 'local' \| 'pending' \| ...` |
| DDL default | `sync_status TEXT DEFAULT 'never'` | `sync_status TEXT DEFAULT 'local'` |
| markPendingSync WHERE | 未明确定义 | `WHERE ... sync_status IN ('local', 'synced')` |

**评估**：语义等价（都表示"从未同步过"），但命名不一致会影响跨模块理解。建议 CTO 裁决：统一为 `'local'`（更准确地表达"仅本地存在"的语义）或回退为 `'never'`。

---

## §10.1 单元测试结果

### A. session-store — migration + sync 状态机

**测试文件**：`TriLC/test/session-store.test.ts`（新增 37 个测试）  
**运行命令**：`npx tsx --test test/session-store.test.ts`  
**结果**：✅ **37/37 PASS**

#### Schema & Migration（3 tests）
| # | 测试 | 结果 |
|---|------|------|
| 1 | 新数据库初始化后 schema v2 字段可用 | PASS |
| 2 | 重新打开数据库不丢失数据 | PASS |
| 3 | sessions + messages 表含完整字段（v2 云同步字段） | PASS |

#### Session CRUD（9 tests）
| # | 测试 | 结果 |
|---|------|------|
| 4 | `createSession` 返回完整 SessionRecord（含 v2 字段） | PASS |
| 5 | `getSession` 对不存在的 ID 返回 null | PASS |
| 6 | `getSession` 精确匹配，无交叉污染 | PASS |
| 7 | `listSessions` 按 updated_at DESC 排序 | PASS |
| 8 | `listSessions` 按 status 过滤 | PASS |
| 9 | `listSessions` 分页（limit/offset） | PASS |
| 10 | `updateSessionStatus` → completed 时 closedAt 自动设置 | PASS |
| 11 | `updateSessionStatus` → interrupted 时 closedAt 自动设置 | PASS |
| 12 | `updateSessionStatus` → active 时 closedAt 保持 null | PASS |

#### Sync Status State Machine（11 tests）⚠️ 核心门禁
| # | 测试 | 结果 |
|---|------|------|
| 13 | 新会话 `sync_status` 默认值 = `'local'` | PASS |
| 14 | 状态机 happy path: local → syncing → synced | PASS |
| 15 | 错误恢复: local → error → syncing → synced | PASS |
| 16 | `lastSyncedAt` 仅在 synced 时设置，其他状态为 null | PASS |
| 17 | `markPendingSync`: local → pending | PASS |
| 18 | `markPendingSync`: synced → pending | PASS |
| 19 | `markPendingSync`: syncing → **不转换**（保持在 syncing） | PASS |
| 20 | `markPendingSync`: error → **不转换**（保持在 error） | PASS |
| 21 | `getPendingSyncSessions` 仅返回 pending 状态 | PASS |
| 22 | `getPendingSyncSessions` 限制条数 | PASS |
| 23 | `getSessionByCloudId` 查找正确 / 不存在返回 null | PASS |

#### Message CRUD（5 tests）
| # | 测试 | 结果 |
|---|------|------|
| 24 | `saveMessages` 追加消息并分配顺序 seq | PASS |
| 25 | tool_calls 以 JSON 字符串正确保存/解析 | PASS |
| 26 | reasoning_content 保留（DeepSeek R1 兼容） | PASS |
| 27 | `getMessageCount` 准确计数 | PASS |
| 28 | 空 assistant 消息检测 → 自动标记 interrupted | PASS |

#### Recovery Helpers（5 tests）
| # | 测试 | 结果 |
|---|------|------|
| 29 | `findInterruptedSessions` 返回 active + interrupted | PASS |
| 30 | `getSessionSummary` 返回完整摘要 | PASS |
| 31 | `getSessionSummary` 不存在返回 null | PASS |
| 32 | `expireOldSessions` 标记过期 | PASS |
| 33 | `expireOldSessions` 不影响已完成会话 | PASS |

#### Edge Cases（4 tests）
| # | 测试 | 结果 |
|---|------|------|
| 34 | null content 消息正确处理 | PASS |
| 35 | tool message 保留 tool_call_id | PASS |
| 36 | 可选字段省略时使用默认值 | PASS |
| 37 | 无消息会话 getMessages 返回空数组 | PASS |

### B. TriLC CLI — daemon 注册命令

**状态**：⚠️ **PARTIAL（有限覆盖）**

由于 `install-service`/`install-regrun` 等命令依赖：
- Windows 管理员权限（`sc.exe` 调用）
- 注册表写入权限
- 实际系统状态变更

当前环境为开发工作站，执行这些命令会有副作用。已执行的验证：

| 验证项 | 方法 | 结果 |
|--------|------|------|
| `parseArgs` 正确解构 `serviceName`/`displayName` | 代码审查 + 编译验证 | ✅ 已修复（见前述缺陷） |
| switch 分支覆盖 8 个命令 | 代码审查 L448-482 | ✅ 完整 |
| 权限检测 `checkAdminPrivilege()` 逻辑 | 代码审查 L251-263 | ✅ 正确（`net session` 检测） |
| 平台检测 `platform() !== 'win32'` | 代码审查 L291, L355, L388, L423 | ✅ 正确 |
| 互斥检测 Service↔RegRun | 代码审查 L304, L394 | ✅ 正确 |
| `sc create` 参数格式 | 代码审查 L331 | ✅ `start= delayed-auto` |
| `sc failure` 恢复策略 | 代码审查 L339 | ✅ 3× 重启 60s 间隔 |
| `reg add` 格式 | 代码审查 L413 | ✅ 正确转义路径 |
| 卸载清理逻辑 | 代码审查 L354-383, L422-440 | ✅ 完整 |

**未能在当前环境执行的 CLI 测试**（标记为 SKIP）：
- 实际 `sc create` → `sc query` 端到端验证
- 实际 `reg add` → `reg query` 验证
- 管理员/非管理员分支实际运行

### C. Tray — DaemonChecker HTTP 轮询

**状态**：❌ **SKIP** — Tray 项目（C# WinForms）未在 TriLC 仓库中实现。技术设计 §9.2 标注 D2-D3 为独立实施步骤，当前交付物仅覆盖 D1（CLI）+ D4-D5（session-store）。

### D. sync-engine — HTTP 同步逻辑

**状态**：❌ **SKIP** — `TriLC/src/sync/` 目录不存在。技术设计 §9.2 标注 D6 为 P1 优先级（"云同步引擎"），当前 td-3 交付物未包含此模块。需后续实施。

**sync-engine 测试用例已就绪（可复用）**：
- 幂等去重（409 响应处理）— 待模块实现后添加
- 超时处理 + 重试退避（1s/2s/4s）— 待模块实现后添加
- 截断逻辑（5000 条消息上限）— 待模块实现后添加

---

## §10.2 集成测试结果

| 场景 | 状态 | 说明 |
|------|------|------|
| Service 安装 + 自启动 | ⚠️ SKIP | 需 Windows 管理员权限 + 实际系统状态变更 |
| RegRun 安装 + 自启动 | ⚠️ SKIP | 需 Windows 注册表写入 + 登出/登入验证 |
| Tray 全生命周期 | ❌ SKIP | Tray 模块未实现（D2-D3） |
| TriPilot 自动重连 | ❌ SKIP | 需 TriPilot 扩展 + daemon 运行环境 |
| 卸载清理 | ⚠️ SKIP | 需实际安装后的卸载验证 |

**说明**：集成测试项全部依赖真实 Windows 环境且有副作用（服务注册/注册表写入）。技术设计 §9.2 将这些列为 D9-D10 的验证步骤。建议在 TriCade MSI 打包就绪后一并执行。

---

## §10.3 E2E 回归测试结果

**状态**：❌ **SKIP** — 需要全新 Windows VM 安装 TriCade MSI。

E2E 场景（技术设计 §10.3）：
1. 安装 TriCade MSI → `sc query TriLC` = RUNNING
2. 系统托盘 🟢 图标
3. VSCodium → TriPilot 检测 daemon → 会话列表
4. 重启 → daemon 自动启动 → Tray 自动出现 → TriPilot 自动重连
5. 卸载 → Service 移除 → 会话数据保留/删除

---

## 已有测试回归

| 测试套件 | 测试数 | 结果 |
|----------|--------|------|
| AgentContractResolver | 1 | ✅ PASS |
| EventQueue | 11 | ✅ PASS |
| Replay integration (M.1+M.2+M.5) | 6 | ✅ PASS |
| TaskRuntime | 2 | ✅ PASS |
| LocalNode | 4 | ✅ PASS |
| LocalPlanner | 1 | ✅ PASS |
| LocalRuntimeDaemon | 3 | ✅ PASS |

**已有测试回归结果**：28/28 PASS，无回退。

---

## 汇总统计

| 分类 | 测试数 | PASS | FAIL | SKIP |
|------|--------|------|------|------|
| session-store 单元测试 | 37 | 37 | 0 | 0 |
| CLI 代码审查验证 | 8 | 8 | 0 | 0 |
| CLI 运行时测试 | 4 | 0 | 0 | 4 |
| Tray 单元测试 | 3 | 0 | 0 | 3 |
| sync-engine 单元测试 | 4 | 0 | 0 | 4 |
| §10.2 集成测试 | 5 | 0 | 0 | 5 |
| §10.3 E2E 测试 | 1 | 0 | 0 | 1 |
| 已有测试回归 | 28 | 28 | 0 | 0 |
| **总计** | **90** | **73** | **0** | **17** |

**通过率**：73/73 可执行测试 = **100%**  
**覆盖率**：73/90 总测试项 = **81.1%**（17 项因环境/模块未就绪 SKIP）

---

## 测试门禁评估

### 按 technical-design.md §10 门禁逐项判定

| 门禁项 | 要求 | 实际 | 判定 |
|--------|------|------|------|
| session-store migration 正确 | `sync_status` 默认值 + 状态机 | ✅ 37/37 PASS | **PASS** |
| CLI 命令参数正确性 | `sc.exe`/`reg` 参数格式 | ✅ 代码审查通过 | **CONDITIONAL_PASS** |
| compiler check | `tsc --noEmit` 零错误 | ✅ 通过（修复后） | **PASS** |
| 已有测试回归 | 28 测试全通过 | ✅ 28/28 PASS | **PASS** |
| sync-engine 单元测试 | 幂等/超时/重试覆盖 | ❌ 模块未实现 | **SKIP** |
| Tray 单元测试 | HTTP 轮询逻辑 | ❌ 模块未实现 | **SKIP** |

### 综合判定

**`CONDITIONAL_PASS`**

**理由**：
- 核心门禁项（session-store 状态机 + 已有回归 + 编译）全部 PASS
- 阻塞性缺陷（td-3 解构遗漏）已修复
- 非阻塞性偏差（SyncStatus 命名）已标注
- 17 个 SKIP 项均因模块未就绪或环境限制，非代码质量缺陷

**建议**：
1. CTO 裁决 SyncStatus 命名统一（`'local'` vs `'never'`）
2. sync-engine 模块就绪后追加 4 项单元测试（测试用例已设计）
3. Tray 模块就绪后追加 3 项单元测试
4. TriCade MSI 打包后执行 §10.2 集成测试 + §10.3 E2E
5. next_agent → CTO（小狄），携带本报告进入门禁裁决

---

## 使用依据

| 文件 | 关键节 | 用途 |
|------|--------|------|
| `technical-design.md` | §10 | 测试门禁定义 |
| `technical-design.md` | §6.2-§6.6 | session-store 预期行为 |
| `technical-design.md` | §5 | daemon 注册 + 健康检查预期 |
| `ruling.md` | Q7-Q11 | CPO 上游裁决 |
| TriLC `src/session-store/store.ts` | 全文 | 实际实现 |
| TriLC `src/session-store/types.ts` | 全文 | 类型定义 |
| TriLC `src/cli.ts` | L249-482 | daemon 注册命令实现 |
| TriLC `package.json` | scripts.test | 测试运行方式 |

---

## 产出物清单

| # | 文件 | 描述 |
|---|------|------|
| 1 | `TriLC/test/session-store.test.ts` | 新增 37 个 session-store 单元测试 |
| 2 | `tri-lc-daemon/test-report.md`（本文件） | 测试报告 |
| 3 | `TriLC/src/cli.ts` L445 | td-3 残余 bug 修复（解构补全） |

---

**报告完成时间**：2026-07-22T16:43+08:00  
**测试门禁**：`CONDITIONAL_PASS`  
**next_agent**：CTO（小狄）— 门禁裁决 + SyncStatus 命名统一裁决

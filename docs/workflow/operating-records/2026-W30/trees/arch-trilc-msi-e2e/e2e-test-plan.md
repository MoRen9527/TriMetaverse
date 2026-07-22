# E2E Test Plan: TriCade MSI 全流程 — 全新 VM 安装→daemon→Tray→重连→卸载

> **作者**：小狄（CTO）  
> **日期**：2026-07-22  
> **版本**：v1.0  
> **任务树**：`arch-trilc-msi-e2e`，节点 `arch-trilc-msi-e2e-1`  
> **next_agent**：TestEngineer（小柯）  
> **门禁依据**：`arch-trilc-daemon/technical-design.md` §8、§10  
> **状态**：`APPROVE` — 门禁标准已定义，移交 TestEngineer 执行

---

## 前置核查

| # | 核查项 | 来源 | 结果 |
|---|--------|------|------|
| 0 | 工作路径 | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-msi-e2e/` | ✅ 路径正确 |
| 0.5 | 归属路由 | CTO 技术域（测试方案、工程门禁） | ✅ 未越界；CPO 产品范围/PRD 无变更 |
| 1 | CEO 最新输入 | `tree-op.json` 根节点 | 从 arch-trilc-daemon td-5 CTO 裁决接收；阻塞正式发布 |
| 2 | BusinessStrategy | `code-state.md` L39-42 | TriLC = 本地人机协作主入口；模块边界无变更 |
| 3 | 技术真源 | `technical-design.md` §8（MSI UX）、§10（测试门禁） | ✅ 已读取 |
| 4 | Code Registry | `code-state.md` L42（arch-trilc-daemon 闭合） | ✅ 前置 D1-D5 已交付，65/65 单元测试全部通过 |
| 5 | 跨树依赖 | `tree-op.json` crossTreeDependsOn | arch-trilc-tray minStatus=done、arch-trilc-sync minStatus=done |
| 6 | 公司治理 | `company-governance-state.md` | 不阻塞 |

**关键发现**：
1. 本 E2E 是 arch-trilc-daemon 工作树的**收官验证**，阻塞 TriCade MSI 正式发布。
2. TD-4 测试报告标注 17 项 SKIP（均因模块未就绪/环境限制），本 E2E 将覆盖其中 5 项 §10.2 集成测试 + 1 项 §10.3 E2E。
3. 跨树依赖 `arch-trilc-tray` + `arch-trilc-sync` 必须 minStatus=done 后才可执行本方案——Tray 未就绪则步骤 3 无法验证；sync 未就绪则步骤 4（会话同步状态字段）验证受限。

---

## 1. 环境准备

### 1.1 虚拟机模板规格

| 维度 | 最低要求 | 推荐 | 说明 |
|------|---------|------|------|
| **OS** | Windows 10 22H2 (Pro/Ent) | Windows 11 23H2 (Pro/Ent) | 需支持 WiX MSI + Windows Service |
| **架构** | x64 | x64 | MSI 目标平台 |
| **RAM** | 4 GB | 8 GB | VSCodium + TriLC daemon + node 进程 |
| **磁盘** | 20 GB 空闲 | 40 GB 空闲 | MSI 安装 + SQLite 会话数据 + VSCodium 便携版 |
| **网络** | 可出站访问互联网 | — | TriLC healthz 自检无需外部网络；但 VSCodium 扩展下载需 GitHub/Open VSX Registry |
| **用户权限** | **管理员账户**（Service 路径） | — | 非管理员路径在步骤 1b 单独验证 |
| **虚拟化** | Hyper-V / VMware / VirtualBox 均可 | — | 需支持快照 |
| **UAC** | 默认设置 | — | 不要禁用 UAC（模拟真实用户环境） |
| **Windows Defender** | 默认设置 | — | 不要关闭（验证 MSI 不被拦截） |

### 1.2 预装软件

| 软件 | 版本 | 用途 | 备注 |
|------|------|------|------|
| **PowerShell 5.1+** | 系统内置 | 验证脚本执行 | 无需额外安装 |
| **Edge WebView2 Runtime** | 系统内置（Win 10 1809+） | VSCodium webview | 系统自带，无需安装 |

> **不预装的软件（由 MSI 提供）**：Node.js、VSCodium、TriPilot 扩展、TriLC daemon 均由 TriCade MSI 一步安装，不提前安装。

### 1.3 快照策略

| 快照 | 时机 | 用途 | 保留 |
|------|------|------|------|
| **S0: Clean OS** | VM 模板首次启动后 | 回滚基线——全新 Windows，无任何 TriCade 痕迹 | ✅ 永久 |
| **S1: Pre-Install** | MSI 文件拷贝到 VM 后、安装前 | 安装失败时回滚，无需重新拷贝 MSI | 测试通过后删除 |
| **S2: Post-Install** | 步骤 1-4 全部 PASS 后 | 步骤 5（重启）前保存已验证状态 | 测试通过后删除 |
| **S3: Post-Reboot** | 步骤 5 PASS 后、卸载前 | 验证重启后状态持久化 | 测试通过后删除 |

### 1.4 VM 创建清单（供 TestEngineer 执行前核对）

- [ ] 创建 VM，分配 4GB+ RAM、20GB+ 磁盘
- [ ] 安装 Windows 10/11 Pro/Ent，创建管理员账户
- [ ] 安装所有 Windows Update（确保 WebView2 Runtime 为最新）
- [ ] 禁用 Windows 自动休眠/睡眠（`powercfg /h off`，电源计划→从不睡眠）
- [ ] 创建 **S0: Clean OS** 快照
- [ ] 将 TriCade MSI 文件拷贝到 VM（通过共享文件夹/网络/USB）
- [ ] 创建 **S1: Pre-Install** 快照

---

## 2. E2E 验证清单（6 步）

### 步骤 1：全新 VM 安装 TriCade MSI（勾选 TriLC 服务）

#### 1a. 管理员 Service 路径（主路径）

| 维度 | 规格 |
|------|------|
| **前置条件** | S1: Pre-Install 快照已就位；管理员账户登录 |
| **操作** | 双击 TriCade MSI → 安装向导 → 在"选择组件"页面**勾选** "将 TriLC 注册为系统服务（推荐）" → 完成安装 |
| **关键观察点** | 安装向导中 checkbox 文案、默认状态（应为 ✅ 已勾选）、描述文本正确 |
| **安装后预期** | 安装完成，无报错对话框；TriLC daemon 自动启动 |

#### 验证命令

```powershell
# 1a-1: 验证 TriLC Windows Service 已注册
sc query TriLC

# 预期输出:
# SERVICE_NAME: TriLC
#         STATE              : 4  RUNNING
#         START_TYPE         : 2   AUTO_START (DELAYED)

# 1a-2: 验证 daemon HTTP 服务已启动
curl -s http://localhost:8711/healthz

# 预期输出: {"ok":true,"service":"trilc","trimc":"degraded"}
# 注意: trimc 为 "degraded" 是可以接受的——全新 VM 无 TriMC 连接

# 1a-3: 验证 TriLC 安装目录存在
Test-Path "${env:ProgramFiles}\TriCade\trilc.exe"

# 1a-4: 验证 session-store SQLite 数据库已初始化
Test-Path "${env:USERPROFILE}\.trimetaverse\sessions.db"

# 1a-5: 验证 sessions.db 含 v2 schema 字段
# （需要 sqlite3 CLI 工具，见 §1.2 补充工具）
```

#### 通过标准

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 1a-1 | `sc query TriLC` | STATE=4 RUNNING, START_TYPE=2 AUTO_START (DELAYED) | **PASS/FAIL** |
| 1a-2 | `/healthz` 200 | `{"ok":true,"service":"trilc"}` | **PASS/FAIL** |
| 1a-3 | 安装目录 | `trilc.exe` 存在 | **PASS/FAIL** |
| 1a-4 | SQLite 数据库 | `sessions.db` 存在 | **PASS/FAIL** |
| 1a-5 | Schema 版本 | `sync_status`、`lastSyncedAt`、`cloudSessionId` 字段存在 | **PASS/FAIL** |

> **证据要求**：每项截图 + 终端输出保存到 `e2e-evidence/step-1a/`

#### 1b. 非管理员 RegRun 路径（兜底路径）

| 维度 | 规格 |
|------|------|
| **前置条件** | 回滚到 S1: Pre-Install 快照；切换到**标准用户**账户（非管理员） |
| **操作** | 双击 TriCade MSI（右击→"以管理员身份运行"不可用）→ 安装过程检测到非管理员 → **toast 提示**"建议以管理员身份安装以获得系统服务级别" → checkbox 仍可勾选 → 完成安装 |
| **安装后预期** | toast 提示出现，RegRun 注册表写入，daemon 不立即启动（需登出再登入） |

```powershell
# 1b-1: 验证 Windows Service 不存在（非管理员无法创建）
sc query TriLC
# 预期: [SC] EnumQueryServicesStatus:OpenService FAILED 1060

# 1b-2: 验证 Registry Run 条目已写入
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" | Select-Object -ExpandProperty TriLC
# 预期: 包含 trilc.exe 完整路径

# 1b-3: toast 提示出现（人工观察截图）
```

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 1b-1 | Service 不存在 | `OpenService FAILED 1060` | **PASS/FAIL** |
| 1b-2 | RegRun 条目 | 存在，路径正确 | **PASS/FAIL** |
| 1b-3 | Toast 提示 | 出现，文案正确 | **PASS/FAIL** |
| 1b-4 | 登出→登入后 daemon 启动 | `curl localhost:8711/healthz` → 200 | **PASS/FAIL** |

> **证据要求**：每项截图 + 终端输出保存到 `e2e-evidence/step-1b/`

---

### 步骤 2：验证 daemon 自启动（`sc query TriLC` = RUNNING）

> **前提**：步骤 1a 已 PASS。回滚到 S2: Post-Install 快照（如已创建）或从步骤 1a 继续。

| 维度 | 规格 |
|------|------|
| **前置条件** | 步骤 1a 已完成，daemon 正在运行 |
| **覆盖场景** | Service 开机自启动、服务崩溃自动恢复、`net session` 权限检测逻辑 |

#### 2a. 服务基础状态

```powershell
# 2a-1: 服务详细状态
sc qc TriLC
# 预期输出:
#         START_TYPE         : 2   AUTO_START (DELAYED)
#         BINARY_PATH_NAME   : <trilc.exe 完整路径> run --port 8711
#         SERVICE_START_NAME : LocalSystem

# 2a-2: 服务恢复策略
sc qfailure TriLC
# 预期输出:
#         RESET_PERIOD       : 0 seconds
#         REBOOT_MESSAGE     :
#         COMMAND_LINE       :
#         FAILURE_ACTIONS    : Restart -- Delay = 60000 milliseconds.
#                              Restart -- Delay = 60000 milliseconds.
#                              Restart -- Delay = 60000 milliseconds.
```

#### 2b. 崩溃自动恢复

```powershell
# 2b-1: 人为杀进程 → 验证自动重启
$pid = (Get-CimInstance Win32_Service -Filter "Name='TriLC'").ProcessId
Stop-Process -Id $pid -Force
Start-Sleep -Seconds 10  # 等待服务恢复（60s 间隔 + 重试）
sc query TriLC
# 预期: STATE=4 RUNNING

# 2b-2: 健康检查恢复
Start-Sleep -Seconds 5
curl -s http://localhost:8711/healthz
# 预期: {"ok":true,"service":"trilc",...}
```

#### 2c. 权限检测验证

```powershell
# 2c-1: 管理员环境运行 install-service（应成功）
# 已在步骤 1a 完成，此处仅确认无报错
# 2c-2: 非管理员环境（步骤 1b 已验证）
```

#### 通过标准

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 2a-1 | 服务配置 | `START_TYPE=AUTO_START (DELAYED)`, `BINARY_PATH_NAME` 正确 | **PASS/FAIL** |
| 2a-2 | 失败恢复策略 | 3 次重启，间隔 60s | **PASS/FAIL** |
| 2b-1 | 崩溃自动恢复 | 杀进程后 70s 内恢复 RUNNING | **PASS/FAIL** |
| 2b-2 | 健康检查恢复 | `/healthz` 返回 200 | **PASS/FAIL** |

> **证据要求**：终端输出截图保存到 `e2e-evidence/step-2/`

---

### 步骤 3：验证系统托盘图标 🟢

> **前提**：跨树依赖 `arch-trilc-tray` minStatus=done 满足。

| 维度 | 规格 |
|------|------|
| **前置条件** | daemon 正在运行（步骤 2 已确认）；Tray 进程已由 MSI 安装并自启动 |
| **依赖交付** | `TriLC/src/tray/` 单文件自包含 exe（C# WinForms NotifyIcon，`dotnet publish --self-contained true`） |

#### 验证操作

```
3a. 观察系统托盘区域 → 🟢 TriLC 图标出现
3b. 右键点击图标 → 菜单包含：
    ① TriLC 状态（运行中/已停止/异常）
    ② 启动 / 停止
    ③ 打开本地会话面板
    ④ 退出
3c. 左键点击图标 → 打开/唤醒本地会话面板
3d. 点击"停止" → 图标变红 🔴 → daemon 停止（sc query TriLC=STOPPED）
3e. 点击"启动" → 图标恢复绿色 🟢 → daemon 启动（sc query TriLC=RUNNING）
3f. 终止 Tray 进程 → daemon 不受影响（仍 RUNNING）
3g. 重新启动 Tray → 恢复 🟢 状态
```

#### 通过标准

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 3a | 图标出现 | 系统托盘 🟢 可见 | **PASS/FAIL** |
| 3b | 右键菜单 | 4 项菜单均存在，点击有响应 | **PASS/FAIL** |
| 3c | 左键点击 | 打开/唤醒会话面板窗口 | **PASS/FAIL** |
| 3d | 停止 daemon | 图标变红；`sc query TriLC`=STOPPED | **PASS/FAIL** |
| 3e | 启动 daemon | 图标变绿；`sc query TriLC`=RUNNING | **PASS/FAIL** |
| 3f | 进程隔离 | 杀 Tray 后 daemon 不受影响 | **PASS/FAIL** |
| 3g | 重启恢复 | Tray 重启后正确显示 daemon 状态 | **PASS/FAIL** |

> **证据要求**：每步截图（含系统托盘区域 + 右键菜单展开状态）保存到 `e2e-evidence/step-3/`

---

### 步骤 4：验证 TriPilot 自动重连 + 会话列表

> **前提**：TriCade MSI 已安装 VSCodium + TriPilot 扩展。

| 维度 | 规格 |
|------|------|
| **前置条件** | daemon 正在运行，Tray 🟢；VSCodium 已由 MSI 安装到 `%ProgramFiles%\TriCade\vscodium\` |
| **重连机制** | TriPilot 启动时 `GET /healthz` → 检测 daemon → `GET /internal/v1/sessions` → 显示会话列表 |

#### 4a. HTTP API 验证（不依赖 VSCodium）

```powershell
# 4a-1: 健康检查
curl -s http://localhost:8711/healthz
# 预期: {"ok":true,"service":"trilc","trimc":"degraded"}

# 4a-2: 会话列表（初装应为空）
curl -s http://localhost:8711/internal/v1/sessions
# 预期: {"ok":true,"count":0,"sessions":[]}

# 4a-3: 模型列表可用
curl -s http://localhost:8711/v1/models
# 预期: {"data": [...]}
```

#### 4b. VSCodium + TriPilot 端到端

```
4b-1. 打开 VSCodium（从开始菜单 TriCade 快捷方式）
4b-2. 观察 TriPilot 侧边栏 → 检测到 daemon → 状态指示器显示 🟢 "Connected to TriLC"
4b-3. 会话面板显示会话列表（初装为空）
4b-4. 发送一条测试消息："Hello, who are you?"
4b-5. 等待回复 → 验证 SSE streaming 正常（字符逐字输出）
4b-6. 关闭 VSCodium → 会话出现在会话列表中（状态=interrupted）
4b-7. 重新打开 VSCodium → TriPilot 提示"检测到未完成的会话，是否恢复？"
4b-8. 恢复会话 → 历史消息完整显示
```

#### 通过标准

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 4a-1 | `/healthz` | 200 OK | **PASS/FAIL** |
| 4a-2 | `/internal/v1/sessions` | 返回会话列表（包含 syncStatus 字段） | **PASS/FAIL** |
| 4a-3 | `/v1/models` | 返回模型列表 | **PASS/FAIL** |
| 4b-2 | 状态指示器 | 🟢 "Connected to TriLC" | **PASS/FAIL** |
| 4b-5 | SSE streaming | 字符逐字输出，无中断 | **PASS/FAIL** |
| 4b-7 | 会话恢复提示 | 提示对话框出现 | **PASS/FAIL** |
| 4b-8 | 历史消息恢复 | 消息完整显示 | **PASS/FAIL** |

> **证据要求**：每步截图保存到 `e2e-evidence/step-4/`

---

### 步骤 5：重启 → daemon 自动启动 → Tray 自动出现 → TriPilot 自动重连

> **前提**：步骤 1-4 全部 PASS。创建 S2: Post-Install 快照。

| 维度 | 规格 |
|------|------|
| **前置条件** | 步骤 1-4 全部 PASS；至少有一条已完成的测试会话 |
| **操作** | 重启 Windows |

#### 验证序列

```powershell
# 重启后等待桌面加载完成（建议等待 60s 让 Delayed Start 服务完全启动）

# 5a: 验证 Service 自启动
sc query TriLC
# 预期: STATE=4 RUNNING

# 5b: 验证 daemon HTTP
curl -s http://localhost:8711/healthz
# 预期: {"ok":true,"service":"trilc","trimc":"degraded"}

# 5c: 验证会话数据持久化
curl -s http://localhost:8711/internal/v1/sessions
# 预期: count >= 1（重启前创建的会话仍在）
```

```
5d: 观察系统托盘 → 🟢 图标自动出现
5e: 打开 VSCodium → TriPilot 自动连接 → 会话列表显示重启前的会话
5f: 恢复任意历史会话 → 消息完整
```

#### 通过标准

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 5a | Service 自启动 | `sc query TriLC`=RUNNING（无需手动操作） | **PASS/FAIL** |
| 5b | HTTP 可用 | `/healthz` 200 | **PASS/FAIL** |
| 5c | 会话持久化 | 重启前会话仍存在 | **PASS/FAIL** |
| 5d | Tray 自启动 | 🟢 图标出现 | **PASS/FAIL** |
| 5e | TriPilot 自动重连 | 打开 VSCodium → 自动连接 | **PASS/FAIL** |
| 5f | 会话恢复 | 历史消息完整 | **PASS/FAIL** |

> **证据要求**：每步截图 + 终端输出保存到 `e2e-evidence/step-5/`
> **快照**：步骤 5 全部 PASS 后创建 **S3: Post-Reboot** 快照

---

### 步骤 6：卸载清理（Service 移除 + 注册表清理 + 文件残留检查）

| 维度 | 规格 |
|------|------|
| **前置条件** | 步骤 5 全部 PASS（或从 S3: Post-Reboot 快照开始） |
| **操作** | Windows 设置 → 应用 → TriCade → 卸载 |

#### 6a. 卸载中交互验证

```
6a-1. 卸载程序启动 → 显示确认对话框
6a-2. 卸载过程中 → "是否保留本地会话数据？"对话框出现
6a-3. 选择"是"（保留测试）
```

#### 6b. 卸载后清理验证

```powershell
# 6b-1: Service 已移除
sc query TriLC
# 预期: [SC] EnumQueryServicesStatus:OpenService FAILED 1060

# 6b-2: Registry Run 已移除（如有）
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty TriLC -ErrorAction SilentlyContinue
# 预期: $null

# 6b-3: daemon 进程已终止
Get-Process -Name "trilc" -ErrorAction SilentlyContinue
# 预期: 无进程

# 6b-4: Tray 进程已终止
Get-Process -Name "TriLC.Tray" -ErrorAction SilentlyContinue
# 预期: 无进程

# 6b-5: 安装目录已清理
Test-Path "${env:ProgramFiles}\TriCade"
# 预期: False（或目录为空/仅剩用户数据文件夹）

# 6b-6: 会话数据保留（用户选择"是"）
Test-Path "${env:USERPROFILE}\.trimetaverse\sessions.db"
# 预期: True（数据保留）
```

#### 6c. 重新安装验证（回归）

```powershell
# 6c-1: 再次安装 TriCade MSI
# 6c-2: 验证 Service 重新注册并启动
sc query TriLC
# 预期: STATE=4 RUNNING

# 6c-3: 验证保留的会话数据可读
curl -s http://localhost:8711/internal/v1/sessions
# 预期: 卸载前的会话仍在
```

#### 通过标准

| # | 验证项 | 预期 | 门禁 |
|---|--------|------|------|
| 6a-1 | 确认对话框 | 出现 | **PASS/FAIL** |
| 6a-2 | 会话保留询问 | "是否保留本地会话数据？"对话框出现 | **PASS/FAIL** |
| 6b-1 | Service 移除 | `sc query` 返回 1060 | **PASS/FAIL** |
| 6b-2 | RegRun 移除 | `$null` | **PASS/FAIL** |
| 6b-3 | daemon 进程终止 | 无 trilc 进程 | **PASS/FAIL** |
| 6b-4 | Tray 进程终止 | 无 TriLC.Tray 进程 | **PASS/FAIL** |
| 6b-5 | 安装目录清理 | 程序文件已移除 | **PASS/FAIL** |
| 6b-6 | 会话数据保留 | `sessions.db` 仍存在 | **PASS/FAIL** |
| 6b-c1 | 重新安装成功 | 安装无报错 | **PASS/FAIL** |
| 6b-c2 | 重新安装后 daemon 运行 | `sc query`=RUNNING | **PASS/FAIL** |
| 6b-c3 | 历史会话可恢复 | 卸载前会话仍存在 | **PASS/FAIL** |

> **证据要求**：每步截图 + 终端输出保存到 `e2e-evidence/step-6/`

---

## 3. 门禁标准

### 3.1 总门禁：全部 6 步 PASS 才放行

| 步骤 | 关键门禁项 | 子项数 | 必须全 PASS |
|------|-----------|--------|-------------|
| 步骤 1a | MSI 安装 + Service 注册 + HTTP 可用 + SQLite 初始化 | 5 | ✅ |
| 步骤 1b | 非管理员 RegRun 兜底 | 4 | ✅ |
| 步骤 2 | Service 自启动 + 崩溃恢复 | 4 | ✅ |
| 步骤 3 | Tray 图标 + 菜单 + 进程隔离 | 7 | ✅ |
| 步骤 4 | TriPilot 重连 + SSE streaming + 会话恢复 | 7 | ✅ |
| 步骤 5 | 重启后全链路恢复 | 6 | ✅ |
| 步骤 6 | 卸载清理 + 数据保留 + 重新安装 | 11 | ✅ |

**总计门禁项**：44 项。**门禁裁决：44/44 PASS → APPROVE。任何一项 FAIL → FREEZE。**

### 3.2 条件门禁（跨树依赖不满足时的降级判定）

| 条件 | 跳过步骤 | 门禁降级 |
|------|---------|---------|
| `arch-trilc-tray` 未 done | 跳过步骤 3（Tray 验证） | 步骤 3 标记 SKIP；其余 5 步仍须全部 PASS |
| `arch-trilc-sync` 未 done | 步骤 4 中 `syncStatus` 字段验证降级 | 4a-2 只验证 `sessions[]` 返回，不验证 `syncStatus` 字段存在 |

> 如果跨树依赖不满足，TestEngineer 应在执行前通知 CTO 并行推进依赖树。

### 3.3 不可降级的硬门禁

以下项在任何条件下都不能 SKIP，必须 PASS：

| 硬门禁 | 所属步骤 | 理由 |
|--------|---------|------|
| `sc query TriLC` = RUNNING | 步骤 1a-1, 2a-1, 5a | 独立 daemon 是核心架构承诺 |
| `/healthz` 返回 200 | 步骤 1a-2, 4a-1, 5b | daemon 基础功能 |
| Service 崩溃后自动恢复 | 步骤 2b-1 | 生产可用性基线 |
| 卸载后 Service 移除 | 步骤 6b-1 | 干净卸载 |
| 会话数据持久化（跨重启） | 步骤 5c | 用户数据安全基线 |
| 卸载后会话保留 | 步骤 6b-6 | 用户数据安全基线 |

---

## 4. 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **VM 性能不足**导致 daemon 启动超时 | 中 | 步骤 1-5 可能假阳性 FAIL | VM 分配 ≥4GB RAM；提高 healthz 等待超时到 30s |
| **MSI CustomAction 权限问题**（非 SYSTEM 上下文执行） | 中 | Service 注册失败 | 验证 `Impersonate="no"` 已在 WiX 中正确配置 |
| **Tray 进程崩溃**导致步骤 3 中断 | 低 | 步骤 3 部分 FAIL | Tray 独立于 daemon，重启 Tray 后继续；步骤 3f 验证进程隔离 |
| **VSCodium 扩展未加载**（网络策略/代理阻止） | 中 | 步骤 4b FAIL | 提前将 `.vsix` 文件预置到 VM；离线安装验证 |
| **Windows Update 自动重启**中断测试 | 低 | 测试中途 VM 重启 | 安装前暂停 Windows Update（`net stop wuauserv`）；S0 快照回滚 |
| **MSI 被杀毒软件拦截** | 低 | 安装失败 | 提交 MSI 到 VirusTotal 预扫描；测试中不关闭 Defender（验证真实环境行为） |
| **TriCade MSI 未就绪**（打包仓库未产出） | 高 | 全部步骤无法执行 | **硬阻塞**：D9（MSI WiX 改造）交付前本方案无法执行；TestEngineer 应确认交付状态 |
| **跨树依赖未 done**（tray / sync） | 中 | 步骤 3 / 步骤 4 部分受限 | 见 §3.2 条件门禁；TestEngineer 执行前检查依赖状态 |

---

## 5. 证据收集要求

### 5.1 目录结构

```
e2e-evidence/
├── step-1a/               # 管理员安装
│   ├── 01-msi-wizard.png
│   ├── 02-checkbox-checked.png
│   ├── 03-install-complete.png
│   ├── 04-sc-query-trilc.txt
│   ├── 05-curl-healthz.txt
│   ├── 06-install-dir.txt
│   ├── 07-sessions-db-exists.txt
│   └── 08-schema-v2.txt
├── step-1b/               # 非管理员安装
│   ├── 01-toast-notification.png
│   ├── 02-sc-query-fail.txt
│   ├── 03-regrun-entry.txt
│   └── 04-post-login-healthz.txt
├── step-2/                # daemon 自启动
│   ├── 01-sc-qc.txt
│   ├── 02-sc-qfailure.txt
│   ├── 03-kill-process.txt
│   └── 04-auto-recovery.txt
├── step-3/                # Tray
│   ├── 01-tray-icon-green.png
│   ├── 02-right-click-menu.png
│   ├── 03-left-click-panel.png
│   ├── 04-stop-daemon-red.png
│   ├── 05-start-daemon-green.png
│   ├── 06-kill-tray-daemon-ok.txt
│   └── 07-restart-tray-reconnect.png
├── step-4/                # TriPilot 重连
│   ├── 01-curl-healthz.txt
│   ├── 02-curl-sessions.txt
│   ├── 03-curl-models.txt
│   ├── 04-vscodium-tripilot-connected.png
│   ├── 05-test-message-sse.png
│   ├── 06-session-interrupted.png
│   ├── 07-recovery-prompt.png
│   └── 08-history-restored.png
├── step-5/                # 重启
│   ├── 01-sc-query-after-reboot.txt
│   ├── 02-curl-healthz-after-reboot.txt
│   ├── 03-curl-sessions-after-reboot.txt
│   ├── 04-tray-auto-start.png
│   ├── 05-tripilot-auto-reconnect.png
│   └── 06-session-restore.png
├── step-6/                # 卸载
│   ├── 01-uninstall-confirm.png
│   ├── 02-keep-sessions-prompt.png
│   ├── 03-sc-query-missing.txt
│   ├── 04-regrun-cleaned.txt
│   ├── 05-no-trilc-process.txt
│   ├── 06-no-tray-process.txt
│   ├── 07-install-dir-cleaned.txt
│   ├── 08-sessions-db-kept.txt
│   └── 09-reinstall/
│       ├── 01-reinstall-ok.png
│       ├── 02-sc-query-reinstalled.txt
│       └── 03-old-sessions-visible.txt
└── e2e-test-report.md     # 最终报告（含门禁 PASS/FAIL 判定）
```

### 5.2 证据质量标准

| 类型 | 要求 |
|------|------|
| **截图** | PNG 格式；包含完整窗口（含标题栏）；关键区域用红框标注 |
| **终端输出** | 完整命令 + 完整输出，保存为 `.txt` 文件 |
| **时间戳** | 每个步骤执行前执行 `Get-Date -Format "yyyy-MM-dd HH:mm:ss"` 并记录 |

### 5.3 日志收集

```powershell
# TriLC daemon 日志（如启用了日志文件）
# 收集 %USERPROFILE%\.trimetaverse\logs\ 下所有文件

# Windows Event Log 中 Service 相关事件
wevtutil qe System /c:50 /rd:true /f:text | Select-String -Pattern "TriLC" > e2e-evidence\eventlog-trilc.txt

# MSI 安装日志（如启用）
# msiexec /i TriCade.msi /l*v e2e-evidence\msi-install-log.txt
```

---

## 6. TestEngineer 执行说明

### 6.1 执行前检查清单

- [ ] 确认 `arch-trilc-tray` 树 status=done（否则步骤 3 降级）
- [ ] 确认 `arch-trilc-sync` 树 status=done（否则步骤 4 部分降级）
- [ ] 确认 TriCade MSI 文件可用（D9 交付物）
- [ ] 确认 VM 模板已按 §1 创建，S0 快照已就位
- [ ] 确认所有证据收集目录已创建

### 6.2 执行顺序

```
S0: Clean OS 快照
  → S1: Pre-Install 快照
    → 步骤 1a: 管理员安装
    → 步骤 2: daemon 自启动
  → 回滚到 S1
    → 步骤 1b: 非管理员安装（可选——优先级低于 1a）
  → 回滚到 S1 → 步骤 1a 重新执行
    → 步骤 3: Tray 验证
    → 步骤 4: TriPilot 重连
    → S2: Post-Install 快照
      → 步骤 5: 重启验证
      → S3: Post-Reboot 快照
        → 步骤 6: 卸载清理
        → 步骤 6c: 重新安装回归
```

### 6.3 报告模板

产出文件：`e2e-test-report.md`，格式参照 `arch-trilc-daemon/test-report.md` 结构：

```markdown
# E2E Test Report: TriCade MSI 全流程

## 执行环境
- VM: Windows 10/11 版本号
- MSI: TriCade 版本号 / commit
- 执行人: 小柯
- 执行时间: YYYY-MM-DD

## 前置核查
| # | 核查项 | 结果 |
|---|--------|------|
| ... | ... | ... |

## 步骤 1a: 管理员安装
| # | 验证项 | 预期 | 实际 | 判定 |
|---|--------|------|------|------|
| 1a-1 | sc query TriLC | RUNNING | RUNNING | PASS |

## 步骤 1b: 非管理员安装
...

## 步骤 2-6
...

## 门禁汇总
| 步骤 | PASS | FAIL | SKIP | 门禁 |
|------|------|------|------|------|
| 步骤 1a | 5 | 0 | 0 | PASS |
| ... | ... | ... | ... | ... |
| **总计** | **N** | **0** | **S** | **APPROVE / FREEZE** |

## 发现的问题
## 建议（如有）
## 使用依据
```

---

## 7. 使用依据

| 文件 | 关键节 | 用途 |
|------|--------|------|
| `arch-trilc-daemon/technical-design.md` | §8（MSI UX）、§10（测试门禁） | E2E 验证清单和门禁标准 |
| `arch-trilc-daemon/technical-design.md` | §1.1（三层进程模型）、§5（重连机制） | 架构预期行为 |
| `arch-trilc-daemon/ruling.md` | Q7（安装 UX）、Q8（会话管理 UI） | CPO 产品规格裁决 |
| `arch-trilc-daemon/test-report.md` | 全文 | 前置测试状态（65/65 PASS, 17 SKIP） |
| `tree-op.json` | crossTreeDependsOn | 跨树依赖 arch-trilc-tray + arch-trilc-sync |
| `code-state.md` | L42（arch-trilc-daemon 闭合） | D1-D5 交付确认 |
| TriLC `src/server/app.ts` | L591-601（/healthz）、L1587-1653（/internal/v1/sessions） | API 响应格式 |
| TriLC `src/cli.ts` | D1 命令实现 | daemon 注册命令参数 |
| TriLC `src/session-store/types.ts` | v2 schema | sessions.db 字段定义 |

---

**方案完成时间**：2026-07-22T18:31+08:00  
**next_agent**：TestEngineer（小柯）——按本方案执行 E2E 验证，产出 `e2e-test-report.md`  
**阻塞项**：D9（TriCade MSI WiX 改造）交付前不可执行；`arch-trilc-tray` + `arch-trilc-sync` done 前部分步骤受限

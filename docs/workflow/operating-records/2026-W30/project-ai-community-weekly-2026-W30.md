# 项目级 AI 共学周记 — 2026-W30

> 记录人：小贾（CEOChiefOfStaff）  
> 日期：2026-07-22

---

## 2.3 GPT-5.6-Sol vs DeepSeek：安装态心智模型差距

### 背景

W30 进行了大量 Agent 配置收敛工作：TriCompany 六件套、contract resolver、TriLC `/internal/v1/agents` 端点、TriPilot Phase 2 agent 页。全部代码在源码工作区验证通过后，打包 Bundle MSI 安装到 TriCade，却发现 Settings→Agents 始终显示"No TriCompany agents"。

### GPT-5.6-Sol 的排查路径（与 DeepSeek 对照）

| 步骤 | GPT-5.6-Sol 做了什么 | DeepSeek（Copilot CLI）做了什么 |
|------|---------------------|-------------------------------|
| 1 | **先确认运行环境**——检查进程是 VS Code 还是 TriCade | ❌ 未做。全程假设用户在 TriCade 里测试 |
| 2 | **哈希对比**——比较安装目录文件与源码仓库的 SHA256 | ❌ 未做。只比对了文件大小 |
| 3 | **MSI 元数据查询**——检查 Upgrade 表、ProductCode、注册表残留 | ❌ 未做。不知道有 7 条同版本残留 |
| 4 | **发现 npm symlinks 断裂**——`cp -r node_modules` 丢失了传递依赖（croner/zod/dotenv） | ❌ 未发现。反复重启 TriLC 报 ECONNREFUSED |
| 5 | **用 `npm install --install-links` 重建自包含依赖** | ❌ 未尝试 |
| 6 | **发现合同从未打进 Bundle**——contract resolver 在安装态找不到 `../TriCompany/` | ❌ 完全遗漏。全程在源码工作区测试，contract resolver 能找到 TriCompany |
| 7 | **修复 WiX 路径在 Git Bash 中的兼容性**——发现工具在根目录而非 bin/ | ❌ 未发现。此前使用的是 WiX 的 symlink（`build/windows/msi/bin`） |
| 8 | **同版本升级修复**——WXS 不允许 `1.126.04524` 覆盖 `1.126.04524`，改到 `1.126.04525` | ❌ 未发现。反复安装同一版本而不生效 |
| 9 | **安装态 daemon 端到端验证**——在独立端口 8712 启动，确认 12/12 agent + 12/12 prompt | ❌ 从未在安装态启动 TriLC 验证 |

### 根因分析

两个 AI 的核心差距不在代码能力，在**测试心智模型**：

- **DeepSeek（Copilot CLI）的工作模型**：源码工作区 → 编译 → 验证 API → 打包。所有验证都在开发环境做，"文件在源码里能跑 = 打包也能跑"。
- **GPT-5.6-Sol 的工作模型**：源码编译 → 构建 MSI → **在安装目录里启动 daemon** → 验证 12 agent → 确认后才放行。

DeepSeek 从未切换视角到"一个刚装完 MSI 的用户打开 TriCade 看到什么"。这就是合同资产未打包、npm 依赖断裂、MSI 重复安装不生效三个问题的共同根因。

### 教训

1. **打包后必须在安装态验证**——不能只 curl 源码工作区的 TriLC。应该在 `C:\Program Files\TriCade\resources\app\tools\trilc\` 里启动 daemon 做端到端测试。
2. **npm link 的包不能 `cp -r`**——开发环境里的符号链接在安装环境变成空壳。必须用 `npm install --install-links` 实体化依赖。
3. **MSI 升级规则要自测**——同版本覆盖不生效时，不应反复重装，应该读 WXS Upgrade 表确认版本范围。
4. **比较文件哈希，不只看大小**——大小可能偶然相同。

---

## 变更清单（GPT-5.6-Sol 代码级修改）

### `vscodium/build/windows/msi/build-bundle.sh`（+40 行）

- 新增 `TRICOMPANY_SOURCE_DIR` 等变量
- 新增 `tools/trilc/contracts` 目录 + 12 份合同复制
- `npm install --install-links` 替代 `cp -r node_modules`
- 新增 `node --input-type=module -e "await import(...)"` 门禁
- 合同数量为零时 `exit 1`
- WiX 路径兼容修复（`${WIX}/bin` → 自动检测根目录工具）

### `TriPilot/src/extension.ts`（大幅重构）

- 新增 `resolveTriLCControlCommand()` — 优先从 TriCade 内置路径发现 TriLC
- 新增 `TRICOMPANY_SOURCE_PATH` 自动发现（工作区 TriCompany 或 TriCade bundled contracts）
- 移除 `TOOL_SETS`、`ASK_STUDY_ALLOWED_*` 等旧硬编码
- auto-start 改为使用 `resolveTriLCControlCommand` 的健康检查闭环

---

**记录时间**：2026-07-23 20:00 CST  
**分类**：ai-tooling-comparison-observation  
**跟进**：将"安装态验证门禁"加入 TriCade 构建流程 checklist


### 2.4 TriCade 安装态连锁故障全链路复盘：Agent→模型路由→MSI 生命周期的四阶因果链

> **核心结论**：这不是一个孤立 bug，而是从 agent 发现、到模型路由、再到 MSI 安装/升级生命周期，四条链路逐层叠加的连锁故障。每层单独看都可修复，但叠加在一起形成了 `ui显示无agent → 部署到安装目录 → agent不回复 → 卸载回滚` 的死亡螺旋。理解这四条链路及其因果关系，对任何在 Windows 上做 Electron 应用 + 本地服务打包的 AI agent 都是必修课。

---

#### 第一阶段：Agents 为什么为空——从 UI 到进程启动的全链路

**现象**：TriCade 的 Settings → Agents 始终显示 "No TriCompany agents"，选择了小贾发送消息后没有回复。

**分层排查过程**：

1. **确认问题层级**：从 UI 文案反查到 Tripilot 在调用 `GET /internal/v1/agents`。直接 `curl localhost:8711` 发现端口无监听——说明不是 UI 渲染问题，是 TriLC daemon 根本没启动。

2. **追溯启动逻辑**：Tripilot 的 `resolveTriLCControlCommand()` 负责找到 TriLC CLI 并执行 `trilc start`。但它只在 PATH 和源码工作区查找，不知道 TriCade MSI 安装后的内置 CLI 路径 `resources/app/tools/trilc/`。

3. **发现假阳性日志**：旧代码启动 TriLC 时只记录"已发起 spawn"，没有检查子进程是否立即崩溃（如模块找不到），导致日志看起来成功，实际上 TriLC 从未真正运行。

4. **修复启动优先级**：`TriCade 内置 CLI > 源码工作区 > PATH`。并且启动后轮询 `/healthz` 直到 200 或超时，消除了假阳性。

5. **Agent 列表出来了但 prompt 为空**：启动后 `/internal/v1/agents` 返回 12 个 agent，但每个 agent 的 `hasSystemPrompt: false`。这是因为 contract resolver 加载 `.contract.yaml` 时，使用相对路径解析五件套（soul/memory/colleagues 等），而路径基准被错误地设置为 contract 所在目录而非 `source-agents` 根目录，形成重复路径段。

6. **补 endpoints**：Tripilot agent 页还会请求单个 agent 的 prompt：`/internal/v1/agents/{id}/system-prompt`，但 TriLC 未实现该端点。

**关键方法论**：
- 不要停在"列表出来了"，要继续验证每个 agent 的 prompt 是否真实可用
- 子进程启动需要检查 PID 存活和端口监听，不能只看 spawn 返回
- contract 资产的路径解析必须是构建时（build time）相对源根的绝对路径

---

#### 第二阶段：为什么源码能用，TriCade MSI 安装不能用——开发态与安装态的本质鸿沟

**核心概念（Windows 基础）**：

在理解这个阶段前，需要先区分两个概念：

| 概念 | 开发态（Dev） | 安装态（Prod） |
|------|-------------|---------------|
| 文件位置 | `D:\OneDrive\Code\ai\TriLC\` | `C:\Program Files\TriCade\resources\app\tools\trilc\` |
| 文件权限 | 用户完全可写 | SYSTEM/TrustedInstaller 所有，普通用户只读 |
| 依赖来源 | `node_modules` 含符号链接（symlink） | 必须是实体文件，无符号链接 |
| 环境变量 | 开发机全局可用（node、npm 等） | 仅 TriCade 内置 node.exe 可用 |
| 合同资产 | `../TriCompany/.github/source-agents/` | 必须打包进 `tools/trilc/contracts/` |

**三个缺口的具体表现和修复**：

1. **Tripilot 找不到 TriLC CLI**（已在第一阶段修复）：安装态没有全局 `trilc` 命令，必须使用 `vscode.env.appRoot` 推导 `tools/trilc/` 路径。

2. **contracts 未打包进 Bundle**：源码运行时 contract resolver 通过 `../TriCompany/` 找到合同，但 TriCade 安装目录中没有 TriCompany 仓库。修复：在构建脚本中将 12 个 contract-backed 角色目录复制到 `tools/trilc/contracts` 隔离目录。

3. **npm 依赖的符号链接陷阱**：
   - **背景知识**：当你在开发环境中执行 `npm link` 或在 monorepo 中使用 `file:../xxx` 依赖时，npm 会在 `node_modules` 中创建**符号链接**（symlink）而不是复制实体文件。Windows 的符号链接需要管理员权限或开发者模式，而且目录链接（Directory Junction）在复制时行为异常。
   - **实际故障**：某开发依赖使用 `file:../agent-core` 形式引用，`cp -r node_modules` 将它复制为符号链接的"壳"。离开源码目录后，这个壳指向的路径不存在，缺少 `croner`、`zod`、`dotenv` 等传递依赖。
   - **修复**：构建脚本改用 `npm install --install-links --omit=dev`，强制 npm 将符号链接解析为实体文件复制。之后增加 ESM import 门禁：`node --input-type=module -e "await import('@trimetaverse/agent-core')"`，在 staging 环境验证依赖完整后再打包。

**构建基础（编译与打包流程）**：

TriCade Bundle 的 MSI 构建分为三步，理解这个过程对排查问题至关重要：

```
1. 收集（Harvest）     →  2. 编译 Candle →  3. 链接 Light
   ┌──────────────┐       ┌──────────┐       ┌──────────┐
   │ heat.exe dir  │  →   │ candle   │  →   │ light    │
   │ C:\Temp\      │       │ .wxs →   │       │ .wixobj  │
   │ tricade-bundle│       │ .wixobj  │       │ → .msi   │
   └──────────────┘       └──────────┘       └──────────┘
```

- **heat.exe**：扫描目录生成 `.wxs`（WiX Source），记录每个文件的安装路径和 GUID
- **candle.exe**：把 `.wxs` 编译成 `.wixobj`（中间格式）
- **light.exe**：链接 `.wixobj` 生成 `.msi`，同时做 ICE（Internal Consistency Evaluator）校验

每次构建必须清空 staging 目录（`rm -rf C:\Temp\tricade-bundle`），否则上次构建的文件会悄悄进入本次 MSI。

---

#### 第三阶段：为什么 `degraded` 后小贾无响应——模型路由与 fallback 链的完整图景

**首先纠正一个关键误解**：

```text
[trilc:conn] degraded → will use local fallback
```

这行日志只表示 TriMC（公司云端，`localhost:8710`）不在线。TriLC 应该**自动切换为本地执行**，不应该导致聊天失败。`degraded` 是状态描述，不是故障根因。

**实际的五层故障链**：

```
用户选"小贾"发消息
  → Tripilot POST /internal/v1/tasks/submit
  → TriLC 任务端点使用 model='tmv-deepseek-v4-pro'（硬编码）
  → 模型路由到 'trimetaverse' provider → 需要 TriStaciss (127.0.0.1:8000)
  → TriStaciss 未启动 → 失败
  → fallback 到 'tmv-deepseek-chat' → 还是 TriStaciss → 又失败
  → fallback 到 'deepseek-chat' → agent-core 的 FALLBACK_MAP 不认识 → 返回默认值 'deepseek-chat'
  → trimodel 包的 listModels() 只注册了 4 个 tmv-* 模型，不包含 'deepseek-chat'
  → 抛出 "Unknown model: deepseek-chat"
  → TriLC 收到错误后先发送 task_error，又错误发送 task_done（伪成功）
  → Tripilot 收到 task_error 后只更新内部状态，不抛给用户
  → 用户看到：空回复
```

**关键概念：模型路由的 provider 机制**

在 TriModel 的架构中，每个模型名会路由到一个 provider：

```javascript
// TriModel client.ts 的模型注册表（简化）
{
  // tmv-* 模型 → trimetaverse provider → TriStaciss (localhost:8000)
  'tmv-deepseek-v4-pro':  { primary: 'trimetaverse', fallback: 'tmv-deepseek-chat' },
  'tmv-deepseek-chat':    { primary: 'trimetaverse', fallback: 'deepseek-chat' },
  
  // 直连模型 → 直接调用 DeepSeek API
  'deepseek-v4-pro':      { primary: 'deepseek-anthropic' },  // Anthropic 格式
  'deepseek-chat':        { primary: 'deepseek' },            // OpenAI 格式
}
```

`tmv-deepseek-v4-pro` 经过两次 fallback 后会抵达 `deepseek-chat`，但如果 `deepseek-chat` 不在 `listModels()` 中，客户端会直接拒绝。这就是"fallback 链断裂"——链路是通的，但最后一个节点的门禁不认。

**关键对照实验**：

- 使用同一安装态代码，不改变任何源码
- 把加密 key cache 中的 DeepSeek API Key 手动注入 ModelClient
- 直接调用 `deepseek-chat` → 立即返回 `OK`
- 证明：DeepSeek Key 有效、API 可达、网络正常，唯一问题是模型名未被注册

**修复**：

1. Key cache 初始化完成后，自动映射到 TriModel 的环境契约，让 `deepseek-chat` 等直连模型进入 `listModels()`
2. 任务端点不再硬编码 `tmv-*`，改用缓存中的默认模型
3. 出现终止错误后不再发送伪 `task_done`
4. Tripilot 将 `task_error` 抛入现有错误展示流程

**最终验证**：在 `trimc: degraded`、`127.0.0.1:8000` 无监听的情况下，真实 `tricade.exe` 返回了 `DEGRADED_FINAL_OK`。

**降级（degraded）的概念澄清**：

| 组件 | 降级含义 | 是否阻塞 |
|------|---------|---------|
| `[trilc:conn] degraded` | TriMC 云端不可达 | ❌ 不阻塞，自动切本地执行 |
| `[trimodel] model failed` | 模型 provider 不可达 | ⚠️ 如果有 fallback 则自动切换 |
| fallback 链断裂 | 最后节点不在模型列表 | ✅ **真正阻塞** |

---

#### 第四阶段：为什么 MSI 卸载和升级反复回滚——Windows Installer 的生命周期规则

**背景知识（Windows Installer 基础）**：

Windows MSI 安装的核心规则：

1. **ProductCode**：每个 MSI 必须有唯一 GUID。改变任何文件或逻辑都需要新 ProductCode。
2. **UpgradeCode**：同产品线共享。用于判断"这是同一款软件的升级"。
3. **版本号比较**：`1.126.04525 > 1.126.04524` → 允许升级。`0.2.0 < 1.126.0` → 被视为降级，会触发 `PreventDowngrading` 错误。
4. **RemoveExistingProducts**：升级时自动先卸载旧版。如果旧版卸载失败，整个升级事务回滚。
5. **Won't Overwrite 规则**：安装程序不会覆盖"unversioned but modified"的文件。如果用户手动修改过文件，MSI 会跳过而不报错。

**MSI 故障的完整因果链**：

```
旧 trilc.cmd（LF 行尾，Unix 格式）
  → Windows cmd.exe 无法正确解析（出现 'tlocal'、'EM' 等乱码）
  → 退出码 9009（"命令无法识别"）
  → MSI UninstallTriLCService 的 Return="check"
  → 卸载脚本失败 → 卸载返回 1603
  → RemoveExistingProducts 阶段失败 → 新包安装回滚
  → 用户看到"安装失败"但不知道是卸载阶段的事
```

**Windows 的一个容易被忽视的细节——行尾格式**：

| 格式 | 字符 | 适用系统 | 说明 |
|------|------|---------|------|
| LF (`\n`) | `0x0A` | Linux/macOS | Unix 标准 |
| CRLF (`\r\n`) | `0x0D 0x0A` | Windows | DOS/Windows 标准 |

`cmd.exe` 的批处理解析器在遇到 LF-only 文件时，会把多行内容拼接成一行但保留 LF 字符，导致命令名被截断或拼接。例如 `setlocal` 变成 `'tlocal'`。这是 Windows 平台最常见的脚本兼容性问题之一。

**其他 MSI 问题**：

1. **重复产品**：两个旧 `0.2.0` 包使用不同 ProductCode 但注册为同版本，Windows 注册表出现 7 条重复卸载条目。
2. **文件所有权混淆**：一个旧 Bundle 错误地把 Base 文件（`tricade.exe`）登记为自己的组件，卸载时删除了宿主程序。
3. **Won't Overwrite**：即使安装成功，旧 `extension.js` 因被标记为"已修改"而拒绝覆盖。

**修复**：

- wrapper 构建时用 PowerShell 强制转换 CRLF 并校验
- 服务卸载/注册改为 best-effort（`Return="ignore"`），失败不阻断 MSI
- 新增 `repair-tricade-bundle.ps1` 修复脚本
- 从旧全量 MSI 做 administrative extraction（`msiexec /a`），恢复被误删的 Base 文件
- 每次构建前确保 staging 是干净的：`rm -rf C:\Temp\tricade-bundle`

---

#### 跨阶段方法论总结

**人类经验（给用 AI 做项目的开发者）**：

1. **"接口返回 12 条"不等于 agent 可用**：必须验证 prompt 完整性、真实调用、错误处理。
2. **开发环境可运行 ≠ 安装态可运行**：从 Program Files 独立启动一次 daemon，这是最低门禁。
3. **正向测试只能证明能成功**：还需要负向测试——断开 TriStaciss、给错误的 key、删掉 contract——确认失败不会伪装成成功。
4. **MSI "安装成功"不等于文件已更新**：必须检查安装日志中的 `Won't Overwrite` 和 `ICE` 警告。
5. **Bundle 和 Base 必须有明确的文件所有权**：否则卸载 overlay 就删宿主。
6. **Windows 脚本的行尾格式是运行时契约**：LF 在 Linux 正常，在 cmd.exe 会炸。

**AI 自查清单（给后续 AI agent）**：

当面对类似"安装后功能不正常"的问题时，按以下顺序排查：

```
1. 确认进程是否真的启动了（PID + 端口监听，不要只看日志）
2. 比较安装目录文件与源码仓库的哈希（SHA256），确认是否真的部署了
3. 检查 node_modules 是否有符号链接断裂（npm ls --depth=0 看是否有 ENOENT）
4. 取一条完整数据流（用户输入 → API 调用 → 模型路由 → provider 选择 → API Key → 响应）逐一验证
5. 不要假设 degradd 是故障根因，继续跟踪执行路径
6. MSI 问题：先看事件日志（Application Log），再看注册表（HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall）
7. 构建脚本是否每次清空 staging？是否有文件从上次构建残留？
8. 脚本的行尾格式：在 Windows 上，所有 .bat/.cmd 文件必须是 CRLF
```


### 2.5 Windows 编译、构建与安装基础——给 AI agent 的操作系统知识补丁

> 以下是从本次故障中提炼的 Windows 操作系统基础知识，用于帮助 AI agent 在 Windows 环境下正确推理。

**进程与权限**：

- Windows 进程分为用户态（User）和管理员态（Admin/UAC）。`C:\Program Files` 下文件默认只读。
- `netstat -ano | findstr 8711` 或 PowerShell 的 `Get-NetTCPConnection` 可查端口占用。
- `taskkill /F /PID xxxx` 需要管理员权限才能杀其他用户的进程。
- 启动子进程时，子进程的环境变量继承自父进程。PowerShell 的 `Start-Process` 创建的子进程不自动继承 `$env:XXX`。

**符号链接（Symlink）与 Junction**：

- Windows 支持三种链接：符号链接（symlink，需管理员/开发者模式）、目录 Junction（不需要提权）、硬链接（仅文件，同卷）。
- `npm link` 和 monorepo 的 `file:` 依赖使用符号链接。复制整个 `node_modules` 时符号链接不会自动解引用。
- `cp -r` 在 WSL/Git Bash 中会保留符号链接；`robocopy /E` 会跳过；`xcopy /E` 传统上不支持。

**MSI 基础**：

- `.msi` 文件是数据库格式（OLE Structured Storage），可用 Orca 或 `dark.exe` 查看表结构。
- 关键表：`Feature`（功能组件）、`Component`（文件归属）、`File`（文件路径）、`Upgrade`（版本升级规则）、`CustomAction`（自定义脚本）、`InstallExecuteSequence`（安装步骤排序）。
- MSI 事务性：安装过程中任一步骤失败会触发回滚。
- 卸载日志位置：`%TEMP%\MSI*.LOG`。

**WiX Toolset**：

- WiX 是微软官方的 MSI 构建工具集。
- `heat.exe`：目录采集，自动生成 File/Component 条目
- `candle.exe`：编译 `.wxs` → `.wixobj`
- `light.exe`：链接 `.wixobj` → `.msi`，同时执行 ICE 校验
- WiX 变量通过 `-dVarName=value` 传入，在 `.wxs` 中用 `$(var.VarName)` 引用

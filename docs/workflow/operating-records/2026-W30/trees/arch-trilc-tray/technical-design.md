# CTO 技术设计：TriLC Windows 系统托盘实施规格

> **作者**：小狄（CTO）  
> **日期**：2026-07-22  
> **版本**：v1.0  
> **上游设计**：`arch-trilc-daemon/technical-design.md` §4  
> **任务树**：`arch-trilc-tray`，节点 `arch-trilc-tray-1`  
> **状态**：`APPROVE` — 技术可行，可交付实施

---

## 前置核查摘要

| # | 核查项 | 文件 | 关键发现 |
|---|--------|------|---------|
| 0 | 工作路径 | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-tray/` | ✅ 路径正确，与上游 arch-trilc-daemon 同级 |
| 0.5 | 归属路由 | CTO 技术设计域 | ✅ 代码位、构建规格、通信协议属 CTO 域 |
| 1 | CEO 最新输入 | 本次树 op | 细化 C# .NET 8 WinForms NotifyIcon 托盘实施规格 |
| 2 | BusinessStrategy | `business-strategy-boundaries.md` L20-21 | TriLC = 本地人机协作主入口；托盘为 TriLC 的管理层 UI |
| 3 | 技术真源 | `DESIGN.md` / `code-state.md` L42 | arch-trilc-daemon APPROVE 闭合，托盘为三条后续拆分树之一 |
| 4 | Code Registry | `code-state.md` L42 | daemon 独立 Service/RegRun 注册已完成；托盘是独立 UI 进程，与 daemon 仅 HTTP 通信 |
| 5 | 模块 Code Registry | TriLC `src/server/app.ts`（HTTP API）、`src/cli.ts`（CLI 生命周期） | `/healthz` 端点、`start/stop/status` CLI 命令均已就位 |
| 6 | 公司治理 | — | 不阻塞本设计 |

**关键发现**：
1. TriLC daemon 已有 `GET /healthz` 返回 `{ ok, service, trimc }`；托盘只需消费此端点。
2. TriLC CLI 已有 `start/stop/status` 命令；托盘中的"启动/停止"菜单项可委托给 CLI spawn。
3. 托盘与 daemon 的解耦方式（HTTP-only）意味着托盘崩溃不影响 daemon，daemon 崩溃可被托盘检测并通知。

---

## 1. 架构定位

### 1.1 托盘在三层进程模型中的位置

```
进程 1: TriLC Daemon (独立生命周期)
├── HTTP Server :8711
│   ├── GET  /healthz          ← 托盘轮询
│   ├── POST /internal/v1/shutdown
│   └── GET  /internal/v1/sessions
│
进程 2: TriLC.Tray.exe (本设计)   ← 独立 UI 进程
├── 轮询 /healthz（5s）
├── 三色图标切换
├── 右键菜单 + 桌面通知
└── 委托 CLI 启动/停止 daemon
│
进程 3: TriPilot (VSCodium 扩展)
└── 也消费 /healthz（30s 间隔）
```

### 1.2 关键设计原则（从上游继承）

- Tray 是**只读状态展示 + 快捷入口**，不承载 daemon 生命周期管理。
- Tray 与 daemon **仅通过 HTTP 通信**。
- Tray 关闭**不影响 daemon 运行**。
- Tray 中的"启动/停止"菜单项委托给 `trilc start` / `trilc stop`（spawn process）。

---

## 2. 项目骨架

### 2.1 文件结构与职责

```
TriLC/
└── src/
    └── tray/
        ├── TriLC.Tray.csproj      # .NET 项目文件（net8.0-windows, PublishSingleFile）
        ├── Program.cs             # 应用入口，Application.Run(ApplicationContext)
        ├── TrayApplicationContext.cs  # 托盘上下文：NotifyIcon 创建、生命周期管理
        ├── DaemonChecker.cs       # HTTP /healthz 轮询 + 状态机
        ├── MenuBuilder.cs         # 右键菜单构建与事件绑定
        ├── DaemonProcessManager.cs    # 委托 CLI spawn 启动/停止 daemon
        ├── NotificationManager.cs     # Windows 桌面通知管理
        └── Resources/
            ├── tri_green.ico      # 🟢 绿色托盘图标（运行中）
            ├── tri_red.ico        # 🔴 红色托盘图标（已停止）
            └── tri_gray.ico       # ⚪ 灰色托盘图标（未安装/未知）
```

### 2.2 .csproj 规格

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <UseWindowsForms>true</UseWindowsForms>
    <ApplicationIcon>Resources\tri_green.ico</ApplicationIcon>
    <PublishSingleFile>true</PublishSingleFile>
    <SelfContained>false</SelfContained>
    <PublishTrimmed>false</PublishTrimmed>
    <DebugType>none</DebugType>
    <AssemblyName>TriLC.Tray</AssemblyName>
    <RootNamespace>TriLC.Tray</RootNamespace>
    <Version>1.0.0</Version>
    <Description>TriMetaverse Local Controller — System Tray Indicator</Description>
  </PropertyGroup>

  <ItemGroup>
    <!-- 嵌入图标资源 -->
    <EmbeddedResource Include="Resources\tri_green.ico" />
    <EmbeddedResource Include="Resources\tri_red.ico" />
    <EmbeddedResource Include="Resources\tri_gray.ico" />
  </ItemGroup>

</Project>
```

**选型理由**（摘要）：
- `PublishSingleFile=true`：编译为单文件 .exe，部署零摩擦。
- `SelfContained=false`：依赖系统已安装的 .NET 8 runtime，体积 ~100KB。
- `UseWindowsForms=true`：NotifyIcon 不需要 WPF 重量级框架。
- `PublishTrimmed=false`：WinForms 对 trimming 兼容性差，贸然启用可能丢失 NotifyIcon 资源。

---

## 3. 三色图标资源规格

### 3.1 视觉规格

| 图标 | 状态 | 含义 | 颜色值 (RGB) | Hex |
|------|------|------|-------------|-----|
| 🟢 `tri_green.ico` | 运行中 | daemon `/healthz` 返回 200 OK | `#4CAF50` | (76, 175, 80) |
| 🔴 `tri_red.ico` | 已停止/异常 | `/healthz` 无响应或非 200 | `#F44336` | (244, 67, 54) |
| ⚪ `tri_gray.ico` | 未知/未安装 | 初始状态，或 daemon 进程不存在 | `#9E9E9E` | (158, 158, 158) |

### 3.2 .ico 文件制作方法

使用 PowerShell + .NET 内置 API 在构建时生成，避免手动制作/版本管理图片文件。`build-tray.ps1` 中嵌入 .ico 生成逻辑：

```powershell
# build-tray.ps1 内嵌

Add-Type -AssemblyName System.Drawing

function New-TriIcon {
    param([string]$HexColor, [string]$OutputPath)
    
    $color = [System.Drawing.ColorTranslator]::FromHtml($HexColor)
    $bitmap = New-Object System.Drawing.Bitmap(32, 32)
    
    # 画圆（带 2px 抗锯齿边距）
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = 'AntiAlias'
    $brush = New-Object System.Drawing.SolidBrush($color)
    $g.FillEllipse($brush, 3, 3, 26, 26)
    
    # 外圆 1px 描边（加深色）
    $darker = [System.Drawing.Color]::FromArgb(
        [Math]::Max(0, $color.R - 40),
        [Math]::Max(0, $color.G - 40),
        [Math]::Max(0, $color.B - 40)
    )
    $pen = New-Object System.Drawing.Pen($darker, 1.5)
    $g.DrawEllipse($pen, 3, 3, 26, 26)
    
    $g.Dispose()
    $brush.Dispose()
    $pen.Dispose()
    
    # 保存为 .ico（含 16×16, 32×32, 48×48 三种尺寸）
    $icon = [System.Drawing.Icon]::FromHandle($bitmap.GetHicon())
    $fs = [System.IO.File]::Create($OutputPath)
    $icon.Save($fs)
    $fs.Close()
    $icon.Dispose()
    $bitmap.Dispose()
}

New-TriIcon -HexColor "#4CAF50" -OutputPath "Resources\tri_green.ico"
New-TriIcon -HexColor "#F44336" -OutputPath "Resources\tri_red.ico"
New-TriIcon -HexColor "#9E9E9E" -OutputPath "Resources\tri_gray.ico"
```

**备选方案**：预置 3 个 .ico 文件直接嵌入 `TrayIconResources.resx`（构建脚本两种都支持）。

### 3.3 图标加载与切换

`TrayApplicationContext.cs`：

```csharp
// 从嵌入资源加载图标
private static Icon LoadIcon(string name)
{
    using var stream = Assembly.GetExecutingAssembly()
        .GetManifestResourceStream($"TriLC.Tray.Resources.{name}");
    return new Icon(stream);
}

// 状态切换
public void SetTrayState(DaemonState state)
{
    _notifyIcon.Icon = state switch
    {
        DaemonState.Running => _iconGreen,
        DaemonState.Stopped => _iconRed,
        DaemonState.Unknown => _iconGray,
        _ => _iconGray
    };
}
```

---

## 4. /healthz 轮询逻辑

### 4.1 轮询规格

| 参数 | 值 | 说明 |
|------|---|------|
| **间隔** | 5 秒 | `System.Windows.Forms.Timer.Interval = 5000` |
| **端点** | `GET http://127.0.0.1:8711/healthz` | TriLC daemon 健康检查 |
| **超时** | 3 秒 | `HttpClient.Timeout`，避免 UI 线程阻塞 |
| **重试** | 无（下一轮自动覆盖） | 单次失败 = 切换到红色，下轮 5s 后再试 |

**Interval 选型依据**：arch-trilc-daemon §4.2 指定"每 5s"。5s 在"用户感知延迟"与"合理 HTTP 开销"之间取得平衡。

### 4.2 响应契约

**200 OK（daemon 在线）**：
```json
{
  "ok": true,
  "service": "triLC",
  "trimc": "connected"
}
```

**非 200 / 超时 / 连接拒绝（daemon 离线）**：任意异常均视为离线。

**字段说明**：
- `ok`: 必须 `true` 才判定健康。
- `service`: 固定 `"triLC"`（托管服务标识）。
- `trimc`: `"connected"` | `"degraded"` | `"disconnected"`。当前 Phase 1 trayster 只消费 `ok` 字段做绿/红判断；`trimc` 字段预留给 Phase 2 扩展（如 Tooltip 显示 "TriMC 连接正常" / "TriMC 已降级"）。

### 4.3 状态机

```
                    ┌──────────┐
   应用启动 ──────→ │ Unknown  │ (gray)
                    └────┬─────┘
                         │ 首次 /healthz
              ┌──────────┼──────────┐
              ▼                     ▼
        ┌──────────┐         ┌──────────┐
        │ Running  │         │ Stopped  │
        │  (green) │         │  (red)   │
        └────┬─────┘         └────┬─────┘
             │   /healthz 200     │  /healthz 200
             │ ◄──────────────────┤
             │                    │
             │  /healthz 非200    │  /healthz 非200
             ├───────────────────►│ (不重复通知)
             │  + 弹通知          │
             │  (Running→Stopped  │
             │   首次触发通知)    │
             └────────────────────┘
```

### 4.4 实现骨架

`DaemonChecker.cs`：

```csharp
using System.Net.Http;
using System.Text.Json;
using System.Windows.Forms;

namespace TriLC.Tray;

public enum DaemonState { Unknown, Running, Stopped }

public class DaemonChecker : IDisposable
{
    private readonly HttpClient _http;
    private readonly System.Windows.Forms.Timer _timer;
    private DaemonState _currentState = DaemonState.Unknown;
    private bool _firstCheckDone;

    // 事件：状态变更（供 TrayApplicationContext 消费）
    public event Action<DaemonState, DaemonState>? StateChanged; // (old, new)

    public DaemonChecker()
    {
        _http = new HttpClient
        {
            BaseAddress = new Uri("http://127.0.0.1:8711"),
            Timeout = TimeSpan.FromSeconds(3)
        };

        _timer = new System.Windows.Forms.Timer
        {
            Interval = 5000,
            Enabled = false
        };
        _timer.Tick += async (_, _) => await CheckHealth();
    }

    public DaemonState CurrentState => _currentState;
    public bool IsFirstCheckDone => _firstCheckDone;

    public void Start()
    {
        _timer.Start();
        // 启动时立即执行一次检查（不等 5s）
        Task.Run(async () => await CheckHealth());
    }

    public void Stop() => _timer.Stop();

    private async Task CheckHealth()
    {
        var oldState = _currentState;
        DaemonState newState;

        try
        {
            var response = await _http.GetAsync("/healthz");
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);
                var ok = doc.RootElement.TryGetProperty("ok", out var okProp)
                    && okProp.GetBoolean();
                newState = ok ? DaemonState.Running : DaemonState.Stopped;
            }
            else
            {
                newState = DaemonState.Stopped;
            }
        }
        catch (Exception ex) when (ex is TaskCanceledException
            or HttpRequestException or JsonException)
        {
            newState = DaemonState.Stopped;
        }

        _firstCheckDone = true;

        if (oldState != newState)
        {
            _currentState = newState;
            StateChanged?.Invoke(oldState, newState);
        }
    }

    public void Dispose() => _http.Dispose();
}
```

### 4.5 边界情况处理

| 场景 | 行为 | 理由 |
|------|------|------|
| HTTP 超时（3s） | 判定 Stopped，不重试 | 下轮 5s 后自动覆盖 |
| 连接拒绝 | 判定 Stopped | daemon 未运行或已崩溃 |
| JSON 解析失败 | 判定 Stopped | 响应格式异常视为不健康 |
| `ok: false`（200 + body 含 `ok: false`） | 判定 Stopped | daemon 自报告不健康 |
| 托盘启动时 daemon 离线 | 红色图标 + 首轮后显示通知 | 用户感知 daemon 未运行 |

---

## 5. 右键菜单定义

### 5.1 完整菜单树

```
┌──────────────────────────────┐
│ TriLC 状态: ● 运行中          │  ← 不可点击，仅展示（_enabled = false）
├──────────────────────────────┤  ← Separator
│ 停止 TriLC                   │  ← 仅 Running 状态显示"停止"
│ 启动 TriLC                   │  ← 仅 Stopped/Unknown 状态显示"启动"
├──────────────────────────────┤  ← Separator
│ 打开本地会话面板              │  ← 打开浏览器 http://127.0.0.1:8711/panel
├──────────────────────────────┤  ← Separator
│ 关于 TriLC                   │  ← 版本信息对话框
│ 退出                         │  ← Application.Exit()
└──────────────────────────────┘
```

### 5.2 菜单项定义表

| 序号 | 菜单项 | 文本 | 启用条件 | 点击行为 |
|------|--------|------|---------|---------|
| 1 | 状态指示 | `"TriLC 状态: ● 运行中"` 或 `"TriLC 状态: ● 已停止"` | 始终禁用（`Enabled=false`） | 无 |
| - | 分隔线 | — | — | — |
| 2a | 停止 | `"停止 TriLC"` | `state == Running` | `trilc stop`（spawn CLI） |
| 2b | 启动 | `"启动 TriLC"` | `state != Running` | `trilc start`（spawn CLI） |
| - | 分隔线 | — | — | — |
| 3 | 会话面板 | `"打开本地会话面板"` | 始终启用 | `Process.Start("http://127.0.0.1:8711/panel")` |
| - | 分隔线 | — | — | — |
| 4 | 关于 | `"关于 TriLC"` | 始终启用 | MessageBox 显示版本 + 链接 |
| 5 | 退出 | `"退出"` | 始终启用 | 关闭托盘（不影响 daemon） |

### 5.3 左键单击

| 事件 | 行为 |
|------|------|
| 左键单击 | `"打开本地会话面板"`（与菜单项 #3 相同） |

### 5.4 Tooltip

```
hover 时显示:
  🟢 "TriLC — 运行中 | 3 个活跃会话"
  🔴 "TriLC — 已停止"
  ⚪ "TriLC — 正在检测..."
```

Tooltip 中活跃会话数通过 `GET /internal/v1/sessions?status=running&limit=1` 获取 `total` 字段（由 daemon 返回）。

### 5.5 实现骨架

`MenuBuilder.cs`：

```csharp
using System.Diagnostics;

namespace TriLC.Tray;

public class MenuBuilder
{
    private readonly NotifyIcon _notifyIcon;
    private readonly DaemonChecker _checker;
    private readonly DaemonProcessManager _processMgr;

    private ToolStripMenuItem? _statusItem;
    private ToolStripMenuItem? _startStopItem;

    public MenuBuilder(
        NotifyIcon notifyIcon,
        DaemonChecker checker,
        DaemonProcessManager processMgr)
    {
        _notifyIcon = notifyIcon;
        _checker = checker;
        _processMgr = processMgr;
    }

    public ContextMenuStrip Build()
    {
        var menu = new ContextMenuStrip();

        // ① 状态指示（不可点击）
        _statusItem = new ToolStripMenuItem("TriLC 状态: ● 检测中...")
        {
            Enabled = false
        };
        menu.Items.Add(_statusItem);
        menu.Items.Add(new ToolStripSeparator());

        // ② 启动/停止
        _startStopItem = new ToolStripMenuItem("启动 TriLC");
        _startStopItem.Click += async (_, _) => await OnStartStop();
        menu.Items.Add(_startStopItem);
        menu.Items.Add(new ToolStripSeparator());

        // ③ 打开会话面板
        var panelItem = new ToolStripMenuItem("打开本地会话面板");
        panelItem.Click += (_, _) =>
            Process.Start(new ProcessStartInfo
            {
                FileName = "http://127.0.0.1:8711/panel",
                UseShellExecute = true
            });
        menu.Items.Add(panelItem);
        menu.Items.Add(new ToolStripSeparator());

        // ④ 关于
        var aboutItem = new ToolStripMenuItem("关于 TriLC");
        aboutItem.Click += (_, _) =>
            MessageBox.Show(
                "TriLC Tray v1.0.0\n" +
                "TriMetaverse Local Controller\n" +
                "Windows System Tray Indicator\n\n" +
                "© 2026 TriMetaverse",
                "关于 TriLC",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        menu.Items.Add(aboutItem);

        // ⑤ 退出
        var exitItem = new ToolStripMenuItem("退出");
        exitItem.Click += (_, _) => Application.Exit();
        menu.Items.Add(exitItem);

        return menu;
    }

    public void RefreshState(DaemonState state)
    {
        if (_statusItem != null)
        {
            _statusItem.Text = state switch
            {
                DaemonState.Running  => "TriLC 状态: ● 运行中",
                DaemonState.Stopped  => "TriLC 状态: ● 已停止",
                DaemonState.Unknown  => "TriLC 状态: ● 检测中...",
                _                    => "TriLC 状态: ● 未知"
            };
        }

        if (_startStopItem != null)
        {
            if (state == DaemonState.Running)
            {
                _startStopItem.Text = "停止 TriLC";
                _startStopItem.Enabled = true;
            }
            else
            {
                _startStopItem.Text = "启动 TriLC";
                _startStopItem.Enabled = true;
            }
        }
    }

    private async Task OnStartStop()
    {
        if (_checker.CurrentState == DaemonState.Running)
        {
            await _processMgr.StopDaemon();
        }
        else
        {
            await _processMgr.StartDaemon();
        }
        // 下一轮 poll 自动更新状态
    }
}
```

---

## 6. Daemon 进程委托管理

### 6.1 技术方案

Tray 本身不承载 daemon 生命周期管理。但为方便用户，菜单中的"启动/停止"委托给 `trilc` CLI。

### 6.2 实现骨架

`DaemonProcessManager.cs`：

```csharp
using System.Diagnostics;

namespace TriLC.Tray;

public class DaemonProcessManager
{
    private readonly string _cliPath;

    /// <summary>
    /// 构造函数。
    /// </summary>
    /// <param name="cliPath">triLC CLI 入口路径，如 "D:\TriLC\dist\cli.js"</param>
    public DaemonProcessManager(string cliPath)
    {
        _cliPath = cliPath;
    }

    public async Task StartDaemon()
    {
        await RunCliCommand("start");
    }

    public async Task StopDaemon()
    {
        await RunCliCommand("stop");
    }

    private async Task RunCliCommand(string command)
    {
        var psi = new ProcessStartInfo
        {
            FileName = "node",
            Arguments = $"\"{_cliPath}\" {command}",
            CreateNoWindow = true,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };

        using var process = Process.Start(psi);
        if (process == null) return;

        // 不等待完成（避免阻塞 UI），但设置一个合理超时
        // Phase 1：直接 fire-and-forget，结果通过下轮 healthz 验证
        await Task.WhenAny(
            process.WaitForExitAsync(),
            Task.Delay(TimeSpan.FromSeconds(15))
        );

        if (!process.HasExited)
        {
            // 超时：进程可能卡住，不 kill（避免损坏 daemon 状态）
        }
    }

    /// <summary>
    /// 自动定位 CLI 路径（fallback 链）
    /// </summary>
    public static string? FindCliPath()
    {
        // 1. 环境变量 TRI_LC_CLI_PATH
        var envPath = Environment.GetEnvironmentVariable("TRI_LC_CLI_PATH");
        if (File.Exists(envPath)) return envPath;

        // 2. 与 daemon 同级的默认路径
        var trayDir = AppDomain.CurrentDomain.BaseDirectory;
        var siblingPath = Path.Combine(trayDir, "..", "triLC", "dist", "cli.js");
        if (File.Exists(siblingPath)) return Path.GetFullPath(siblingPath);

        // 3. 程序目录下的 trilc 子目录
        var localPath = Path.Combine(trayDir, "triLC", "dist", "cli.js");
        if (File.Exists(localPath)) return Path.GetFullPath(localPath);

        return null;  // 无法定位 → "启动"菜单项灰掉
    }
}
```

### 6.3 CLI 路径定位策略

| 优先级 | 来源 | 示例值 | Fallback 行为 |
|--------|------|--------|-------------|
| 1 | 环境变量 `TRI_LC_CLI_PATH` | `D:\TriLC\dist\cli.js` | 最优先 |
| 2 | 同级相对路径 | `..\triLC\dist\cli.js` | MSI 安装布局 |
| 3 | 本地子目录 | `.\triLC\dist\cli.js` | 便携/调试布局 |
| F | 无法定位 | — | "启动"菜单项灰色禁用 + tooltip "找不到 TriLC CLI" |

---

## 7. Daemon 异常退出通知

### 7.1 触发条件

当 `/healthz` 状态从 `Running` → `Stopped` 时，弹出 Windows Toast 通知。

### 7.2 防抖策略

| 条件 | 动作 |
|------|------|
| Running → Stopped | ✅ 弹出通知："TriLC 已停止运行。" |
| Stopped → Stopped（连续） | ❌ 不重复通知 |
| Unknown → Stopped（启动首轮） | ⚠️ 若启动首轮即 Stopped，也弹出通知（daemon 未运行） |
| Stopped → Running | ❌ 不弹通知（仅图标变绿） |
| 用户点击通知 | 打开事件查看器或 daemon 日志路径 |

### 7.3 通知内容

```
标题: TriLC
正文: TriLC 已停止运行。点击查看详情。
```

### 7.4 实现骨架

`NotificationManager.cs`：

```csharp
using System.Diagnostics;
using Microsoft.Toolkit.Uwp.Notifications;  // Phase 1 可选：简化版直接用 MessageBox
// 或使用 WinForms 内置 NotifyIcon.ShowBalloonTip()

namespace TriLC.Tray;

public class NotificationManager
{
    private readonly NotifyIcon _notifyIcon;
    private DaemonState _lastNotifiedState = DaemonState.Unknown;

    public NotificationManager(NotifyIcon notifyIcon)
    {
        _notifyIcon = notifyIcon;
    }

    public void OnStateChanged(DaemonState oldState, DaemonState newState)
    {
        // 只有在从 Running 变为 Stopped 时通知
        // 或者首轮检查即为 Stopped 时通知
        if (newState == DaemonState.Stopped
            && _lastNotifiedState != DaemonState.Stopped)
        {
            ShowStoppedNotification();
        }

        _lastNotifiedState = newState;
    }

    private void ShowStoppedNotification()
    {
        // 方法 A：使用 NotifyIcon.ShowBalloonTip（无需额外依赖，Phase 1 选择）
        _notifyIcon.ShowBalloonTip(
            timeout: 10000,  // 10 秒后自动消失
            tipTitle: "TriLC",
            tipText: "TriLC 已停止运行。\n右键托盘图标可尝试重新启动。",
            tipIcon: ToolTipIcon.Error);

        // 备选方法 B：使用 ToastContentBuilder（Windows 10+ 原生通知）
        // 优点：更现代、可交互、不依赖托盘存在
        // new ToastContentBuilder()
        //     .AddText("TriLC")
        //     .AddText("TriLC 已停止运行。点击查看详情。")
        //     .Show();
    }
}
```

### 7.5 备选：Windows 10+ Toast Notification（Phase 1.5）

如果需要在托盘隐藏时仍能显示通知，或需要"点击查看详情"交互：

```csharp
// 需 NuGet: Microsoft.Toolkit.Uwp.Notifications
using Microsoft.Toolkit.Uwp.Notifications;

private void ShowToastNotification()
{
    new ToastContentBuilder()
        .AddArgument("action", "viewLogs")
        .AddText("TriLC")
        .AddText("TriLC 已停止运行。")
        .AddButton(new ToastButton()
            .SetContent("查看详情")
            .AddArgument("action", "viewLogs")
            .SetBackgroundActivation())
        .Show();

    // 注册 Toast 激活回调
    ToastNotificationManagerCompat.OnActivated += toastArgs =>
    {
        // 打开 daemon 日志
        var logPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TriMetaverse", "TriLC", "daemon.log");
        if (File.Exists(logPath))
            Process.Start("notepad.exe", logPath);
    };
}
```

**Phase 1 决策：使用 `ShowBalloonTip`**（零额外依赖，WinForms 内置）。Phase 1.5 可升级为 Toast Notification。

---

## 8. TrayApplicationContext 组装

`TrayApplicationContext.cs`（完整组装入口）：

```csharp
using System.Reflection;

namespace TriLC.Tray;

public class TrayApplicationContext : ApplicationContext
{
    private readonly NotifyIcon _notifyIcon;
    private readonly DaemonChecker _checker;
    private readonly MenuBuilder _menuBuilder;
    private readonly NotificationManager _notifications;
    private readonly Icon _iconGreen, _iconRed, _iconGray;

    public TrayApplicationContext()
    {
        // 加载嵌入图标
        _iconGreen = LoadIcon("tri_green.ico");
        _iconRed   = LoadIcon("tri_red.ico");
        _iconGray  = LoadIcon("tri_gray.ico");

        // 初始化组件
        _notifyIcon = new NotifyIcon
        {
            Icon = _iconGray,
            Visible = true,
            Text = "TriLC — 正在检测..."
        };

        var cliPath = DaemonProcessManager.FindCliPath();
        var processMgr = new DaemonProcessManager(cliPath ?? "");
        _checker = new DaemonChecker();
        _menuBuilder = new MenuBuilder(_notifyIcon, _checker, processMgr);
        _notifications = new NotificationManager(_notifyIcon);

        // 构建菜单
        _notifyIcon.ContextMenuStrip = _menuBuilder.Build();

        // 左键单击 → 打开会话面板
        _notifyIcon.MouseClick += (_, e) =>
        {
            if (e.Button == MouseButtons.Left)
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "http://127.0.0.1:8711/panel",
                    UseShellExecute = true
                });
            }
        };

        // 订阅状态变更
        _checker.StateChanged += (oldState, newState) =>
        {
            // 在主线程更新 UI
            _notifyIcon?.BeginInvoke(() =>
            {
                SetTrayState(newState);
                _menuBuilder.RefreshState(newState);
                UpdateTooltip(newState);
            });

            // 通知管理（不计较线程）
            _notifications.OnStateChanged(oldState, newState);
        };

        // 启动轮询
        _checker.Start();

        // 退出时清理
        Application.ApplicationExit += (_, _) => Cleanup();
    }

    private void SetTrayState(DaemonState state)
    {
        _notifyIcon.Icon = state switch
        {
            DaemonState.Running => _iconGreen,
            DaemonState.Stopped => _iconRed,
            _                   => _iconGray
        };
    }

    private void UpdateTooltip(DaemonState state)
    {
        _notifyIcon.Text = state switch
        {
            DaemonState.Running => "TriLC — 运行中",
            DaemonState.Stopped => "TriLC — 已停止",
            _                   => "TriLC — 正在检测..."
        };
    }

    private void Cleanup()
    {
        _checker.Stop();
        _checker.Dispose();
        _notifyIcon.Dispose();
        _iconGreen.Dispose();
        _iconRed.Dispose();
        _iconGray.Dispose();
    }

    private static Icon LoadIcon(string name)
    {
        using var stream = Assembly.GetExecutingAssembly()
            .GetManifestResourceStream($"TriLC.Tray.Resources.{name}");
        return stream != null
            ? new Icon(stream)
            : SystemIcons.Application;  // fallback
    }
}
```

`Program.cs`：

```csharp
namespace TriLC.Tray;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        // 单实例检查（仅允许一个托盘实例）
        using var mutex = new Mutex(true, "TriLC.Tray.SingleInstance", out bool createdNew);
        if (!createdNew)
        {
            MessageBox.Show("TriLC Tray 已在运行中。", "TriLC Tray",
                MessageBoxButtons.OK, MessageBoxIcon.Information);
            return;
        }

        Application.Run(new TrayApplicationContext());
        GC.KeepAlive(mutex);
    }
}
```

---

## 9. 构建脚本

`TriLC/scripts/build-tray.ps1`：

```powershell
# build-tray.ps1 — 编译 TriLC.Tray.exe（单文件自包含）
param(
    [string]$Configuration = "Release",
    [string]$OutputDir = "$PSScriptRoot\..\dist"
)

$ErrorActionPreference = "Stop"
$trayDir = "$PSScriptRoot\..\src\tray"

# 1. 生成图标
Write-Host "[1/3] 生成图标资源..." -ForegroundColor Cyan
Add-Type -AssemblyName System.Drawing

$colors = @{
    "tri_green.ico" = "#4CAF50"
    "tri_red.ico"   = "#F44336"
    "tri_gray.ico"  = "#9E9E9E"
}

foreach ($name in $colors.Keys) {
    $hex = $colors[$name]
    $color = [System.Drawing.ColorTranslator]::FromHtml($hex)
    $bmp = New-Object System.Drawing.Bitmap(32, 32)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'

    $brush = New-Object System.Drawing.SolidBrush($color)
    $g.FillEllipse($brush, 3, 3, 26, 26)

    $darker = [System.Drawing.Color]::FromArgb(
        [Math]::Max(0, $color.R - 40),
        [Math]::Max(0, $color.G - 40),
        [Math]::Max(0, $color.B - 40))
    $pen = New-Object System.Drawing.Pen($darker, 1.5)
    $g.DrawEllipse($pen, 3, 3, 26, 26)

    $icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
    $outPath = "$trayDir\Resources\$name"
    New-Item -ItemType Directory -Force -Path (Split-Path $outPath) | Out-Null
    $fs = [System.IO.File]::Create($outPath)
    $icon.Save($fs)
    $fs.Close()

    $icon.Dispose(); $pen.Dispose(); $brush.Dispose(); $g.Dispose(); $bmp.Dispose()
    Write-Host "  ✓ $name"
}

# 2. 编译
Write-Host "[2/3] 编译 TriLC.Tray.exe..." -ForegroundColor Cyan
Push-Location $trayDir
dotnet publish -c $Configuration -r win-x64 `
    -p:PublishSingleFile=true `
    -p:SelfContained=false `
    -p:PublishTrimmed=false `
    -p:DebugType=none `
    -o "$OutputDir"
Pop-Location

# 3. 验证
Write-Host "[3/3] 验证..." -ForegroundColor Cyan
$exe = "$OutputDir\TriLC.Tray.exe"
if (Test-Path $exe) {
    $size = [math]::Round((Get-Item $exe).Length / 1KB, 1)
    Write-Host "  ✓ TriLC.Tray.exe ($size KB)" -ForegroundColor Green
} else {
    Write-Error "构建失败：未找到 TriLC.Tray.exe"
}
```

---

## 10. 错误处理矩阵

| 场景 | 托盘行为 | 用户体验 |
|------|---------|---------|
| daemon 未安装 | dotnet 启动正常，图标灰 → 红（首轮 healthz 失败） | 托盘正常，通知提醒 |
| CLI 无法定位 | "启动"菜单项灰掉 + tooltip | 用户需手动启动 daemon |
| CLI 启动超时 | 图标保持红色，下轮 healthz 验证 | 无额外错误弹出 |
| .NET 8 runtime 未安装 | 进程启动失败 | 用户需安装 .NET 8（由 MSI 保证前置条件） |
| 网络堆栈异常 | 所有 healthz 请求失败 → 红色图标 | 一次通知，不复弹 |
| 托盘自身崩溃 | daemon 不受影响 | 用户看不到托盘图标（需通过 MSI 修复/重装） |
| 双实例 | Mutex 拦截，提示"已在运行中" | 无副作用 |

---

## 11. 门禁清单（交付至 FullStackDeveloper 前）

| # | 门禁项 | 判定标准 | 状态 |
|---|--------|---------|------|
| G1 | 文件结构 | `TriLC/src/tray/` 下所有 .cs + .csproj + .ico 文件存在 | ⬜ |
| G2 | 编译通过 | `build-tray.ps1` 成功产出 `TriLC.Tray.exe`（<1MB） | ⬜ |
| G3 | 图标嵌入 | 三色 .ico 作为 `EmbeddedResource` 正确加载 | ⬜ |
| G4 | 轮询逻辑 | 5s 间隔 healthz 轮询，状态机正确（绿→红→绿） | ⬜ |
| G5 | 右键菜单 | 5 项菜单项（状态/启动停止/面板/关于/退出）功能正常 | ⬜ |
| G6 | 通知弹出 | Running→Stopped 首次弹通知，同态不复弹 | ⬜ |
| G7 | 托盘退出 | `Application.Exit()` 不影响 daemon 进程 | ⬜ |
| G8 | 单实例 | Mutex 有效阻止双开 | ⬜ |

---

## 12. 使用依据

| 依据 | 文件 | 位置 |
|------|------|------|
| 上游托盘 §4 | `arch-trilc-daemon/technical-design.md` | §4.1–§4.6 |
| 树 op 定义 | `arch-trilc-tray/tree-op.json` | `arch-trilc-tray-1` action |
| Daemon 接口 | TriLC `src/server/app.ts` | `/healthz` + `/internal/v1/sessions` |
| CLI 命令 | TriLC `src/cli.ts` | `start/stop/status` |
| 模块边界 | `business-strategy-boundaries.md` | L20–L21（TriLC = 本地主入口） |
| Code Registry | `code-state.md` | L42（daemon APPROVE 闭合） |

---

> **下一步**：`arch-trilc-tray-2`（FullStackDeveloper）按本设计生产 `TriLC/src/tray/*.cs` + `build-tray.ps1` + `dist/TriLC.Tray.exe`。

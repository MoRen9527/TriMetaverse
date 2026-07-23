# Copilot CLI 配置 DeepSeek BYOK 操作指南

> 适用版本：GitHub Copilot CLI ≥ 1.0.68  
> 适用系统：Windows / PowerShell 5.1+  
> 最后验证：2026-07-19
>
> **重要**：DeepSeek 官方要求 Copilot CLI 使用 Anthropic 兼容端点。不要使用 `openai + https://api.deepseek.com/v1`；该组合无法在 Copilot CLI 的工具调用链中完整回传 `reasoning_content`，长会话或压缩时会返回 HTTP 400。

## 前置条件

- 已安装 GitHub Copilot CLI（`copilot --version` 可正常输出）
- 已获取 DeepSeek API Key（从 [platform.deepseek.com](https://platform.deepseek.com) 获取）

> 如果 `copilot` 命令不存在，检查 VS Code 是否已安装 GitHub Copilot Chat 扩展，该扩展会自动安装 Copilot CLI。

---

## 第一步：设置环境变量

在 PowerShell 中执行以下命令（**将 `你的APIKey` 替换为真实 Key**）：

```powershell
# Provider 基础配置（必需）
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_BASE_URL', 'https://api.deepseek.com/anthropic', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_TYPE', 'anthropic', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_API_KEY', '你的APIKey', 'User')

# 模型配置（必需）
[Environment]::SetEnvironmentVariable('COPILOT_MODEL', 'deepseek-v4-pro', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_WIRE_MODEL', 'deepseek-v4-pro', 'User')

# Token 限制（DeepSeek 官方 Copilot CLI 推荐值）
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_PROMPT_TOKENS', '840000', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_OUTPUT_TOKENS', '128000', 'User')
```

### 环境变量说明

| 变量名 | 作用 | 是否必需 |
| --- | --- | --- |
| `COPILOT_PROVIDER_BASE_URL` | DeepSeek Anthropic 兼容端点，固定为 `https://api.deepseek.com/anthropic` | **必需**（有此变量才激活 BYOK） |
| `COPILOT_PROVIDER_TYPE` | Provider 类型，DeepSeek + Copilot CLI 必须使用 `anthropic` | **必需** |
| `COPILOT_PROVIDER_API_KEY` | DeepSeek API Key | **必需** |
| `COPILOT_MODEL` | 模型名（同时设置 model ID 和 wire model） | **必需** |
| `COPILOT_PROVIDER_WIRE_MODEL` | 发送给 API 的模型名 | 可选（默认取 `COPILOT_MODEL`） |
| `COPILOT_PROVIDER_MAX_PROMPT_TOKENS` | 最大提示 token 数，官方示例为 `840000` | 推荐（非内置模型需手动指定） |
| `COPILOT_PROVIDER_MAX_OUTPUT_TOKENS` | 最大输出 token 数，官方示例为 `128000` | 推荐（非内置模型需手动指定） |

### 为什么必须使用 Anthropic 格式

DeepSeek thinking 模式在工具调用轮次会返回 `reasoning_content`。按照 DeepSeek 官方协议，调用方必须在后续请求中完整回传该字段，否则 API 会返回 HTTP 400。

Copilot CLI 的 OpenAI Provider 当前不会完整保留并重放这条扩展字段，可能持久化出同时缺少有效 `content` 和 `tool_calls` 的 assistant 消息。DeepSeek 官方因此明确建议 Copilot CLI 改用 Anthropic Messages API；该格式把 thinking、`tool_use` 和 `tool_result` 表达为结构化 content blocks，不依赖 OpenAI 私有扩展字段的回传。

官方依据：

- [DeepSeek：Integrate with GitHub Copilot CLI](https://api-docs.deepseek.com/quick_start/agent_integrations/copilot_cli)
- [DeepSeek：Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode)
- [DeepSeek：Anthropic API](https://api-docs.deepseek.com/guides/anthropic_api)
- [GitHub：Using your own LLM models in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models)

### 从旧 OpenAI 配置迁移

已经配置过 `openai + /v1` 时，不需要更换 API Key，只需执行：

```powershell
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_TYPE', 'anthropic', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_BASE_URL', 'https://api.deepseek.com/anthropic', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_PROMPT_TOKENS', '840000', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_OUTPUT_TOKENS', '128000', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_WIRE_API', $null, 'User')
```

关闭所有正在运行的 Copilot CLI 会话并新开 PowerShell 终端。已经启动的进程不会自动继承修改后的用户级环境变量；包含旧 OpenAI 历史消息的损坏会话也不应继续恢复。

---

## 第二步：配置 PowerShell Profile（VS Code 集成终端专用）

VS Code 集成终端可能不会自动继承新写入的用户级环境变量。将以下内容追加到 PowerShell profile：

```powershell
# 查看 profile 路径
$PROFILE
```

在 profile 文件末尾添加：

```powershell
# Copilot CLI BYOK provider environment refresh
foreach ($name in @('COPILOT_PROVIDER_BASE_URL','COPILOT_PROVIDER_TYPE','COPILOT_PROVIDER_API_KEY','COPILOT_MODEL','COPILOT_PROVIDER_MODEL_ID','COPILOT_PROVIDER_WIRE_MODEL','COPILOT_PROVIDER_MAX_PROMPT_TOKENS','COPILOT_PROVIDER_MAX_OUTPUT_TOKENS')) {
    $value = [Environment]::GetEnvironmentVariable($name, 'User')
    if ($null -ne $value -and $value -ne '') {
        Set-Item -Path "Env:$name" -Value $value
    }
}
```

> 如果 profile 文件不存在，先执行 `New-Item -ItemType File -Path $PROFILE -Force`。

---

## 第三步：验证配置

### 3.1 加载 profile（新终端可跳过）

```powershell
. $PROFILE
```

### 3.2 检查环境变量

```powershell
$env:COPILOT_PROVIDER_BASE_URL
$env:COPILOT_PROVIDER_TYPE
$env:COPILOT_MODEL
```

预期输出：

```text
https://api.deepseek.com/anthropic
anthropic
deepseek-v4-pro
```

### 3.3 验证模型调用

```powershell
copilot -p "只回复当前使用的模型名。" --allow-all-tools --silent
```

预期输出包含 `deepseek-v4-pro`。

建议再做一次工具调用验证，确保不只是普通聊天可用：

```powershell
copilot --no-remote --no-remote-export --allow-tool=shell -p "必须调用 shell 工具执行 PowerShell 命令 Write-Output ANTHROPIC_TOOL_OK，确认工具输出后只回复 ANTHROPIC_FINAL_OK。不要读写任何文件。"
```

预期看到工具输出 `ANTHROPIC_TOOL_OK`，随后模型回复 `ANTHROPIC_FINAL_OK`，且命令退出码为 `0`。

如需核对运行协议，可查看最新 Copilot CLI 日志。关键行应包含：

```text
Using custom provider: type=anthropic, baseUrl=https://api.deepseek.com/anthropic
```

日志末尾仍可能显示内部默认字段 `wireApi=completions`；Anthropic Provider 下以 `type=anthropic` 和 `/anthropic` 端点为判断依据，不要据此误判为仍在使用 OpenAI Chat Completions。

### 3.4 启动交互模式

```powershell
copilot
```

---

## 常见问题

### Q: `/model` 显示 "No model is currently selected"

这是正常现象。`/model` 只列出 Copilot CLI 内置 catalog 模型，BYOK 自定义 provider 的模型不会出现在列表中。只要 `COPILOT_PROVIDER_BASE_URL` 已设置，实际请求就走 DeepSeek。

验证方法：

```powershell
copilot -p "只回复当前使用的模型名。" --allow-all-tools --silent
```

### Q: 提示 "Model xxx is not in the built-in catalog"

同样正常。非内置模型会使用默认 token 限制，建议设置 `COPILOT_PROVIDER_MAX_PROMPT_TOKENS` 和 `COPILOT_PROVIDER_MAX_OUTPUT_TOKENS` 消除此提示。

### Q: 如何切换模型

修改 `COPILOT_MODEL` 和 `COPILOT_PROVIDER_WIRE_MODEL`：

```powershell
# 例如切换到 deepseek-v4-flash
[Environment]::SetEnvironmentVariable('COPILOT_MODEL', 'deepseek-v4-flash', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_WIRE_MODEL', 'deepseek-v4-flash', 'User')
```

然后重开终端或执行 `. $PROFILE`。

### Q: 如何切回 GitHub Copilot 默认模型

删除 BYOK 环境变量：

```powershell
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_BASE_URL', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_TYPE', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_API_KEY', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_MODEL', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_WIRE_MODEL', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_PROMPT_TOKENS', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_OUTPUT_TOKENS', $null, 'User')
```

重开终端即可恢复。

---

## 一键脚本

将以下内容保存为 `setup-copilot-deepseek.ps1`：

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,
    [string]$Model = 'deepseek-v4-pro'
)

$vars = @{
    'COPILOT_PROVIDER_BASE_URL' = 'https://api.deepseek.com/anthropic'
    'COPILOT_PROVIDER_TYPE' = 'anthropic'
    'COPILOT_PROVIDER_API_KEY' = $ApiKey
    'COPILOT_MODEL' = $Model
    'COPILOT_PROVIDER_WIRE_MODEL' = $Model
    'COPILOT_PROVIDER_MAX_PROMPT_TOKENS' = '840000'
    'COPILOT_PROVIDER_MAX_OUTPUT_TOKENS' = '128000'
}

foreach ($kv in $vars.GetEnumerator()) {
    [Environment]::SetEnvironmentVariable($kv.Key, $kv.Value, 'User')
    Write-Host "Set $($kv.Key)" -ForegroundColor Green
}

Write-Host "`nDone. Restart your terminal and run: copilot" -ForegroundColor Cyan
```

使用方式：

```powershell
.\setup-copilot-deepseek.ps1 -ApiKey "你的APIKey"
# 或指定模型
.\setup-copilot-deepseek.ps1 -ApiKey "你的APIKey" -Model "deepseek-v4-flash"
```

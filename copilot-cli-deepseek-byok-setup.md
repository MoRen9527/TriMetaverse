# Copilot CLI 配置 DeepSeek BYOK 操作指南

> 适用版本：GitHub Copilot CLI ≥ 1.0.68  
> 适用系统：Windows / PowerShell 5.1+  
> 最后验证：2026-07-02

## 前置条件

- 已安装 GitHub Copilot CLI（`copilot --version` 可正常输出）
- 已获取 DeepSeek API Key（从 [platform.deepseek.com](https://platform.deepseek.com) 获取）

> 如果 `copilot` 命令不存在，检查 VS Code 是否已安装 GitHub Copilot Chat 扩展，该扩展会自动安装 Copilot CLI。

---

## 第一步：设置环境变量

在 PowerShell 中执行以下命令（**将 `你的APIKey` 替换为真实 Key**）：

```powershell
# Provider 基础配置（必需）
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_BASE_URL', 'https://api.deepseek.com/v1', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_TYPE', 'openai', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_API_KEY', '你的APIKey', 'User')

# 模型配置（必需）
[Environment]::SetEnvironmentVariable('COPILOT_MODEL', 'deepseek-v4-pro', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_WIRE_MODEL', 'deepseek-v4-pro', 'User')

# Token 限制（推荐，避免非内置模型使用默认值）
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_PROMPT_TOKENS', '64000', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_MAX_OUTPUT_TOKENS', '8192', 'User')
```

### 环境变量说明

| 变量名 | 作用 | 是否必需 |
|---|---|---|
| `COPILOT_PROVIDER_BASE_URL` | DeepSeek API 端点 | **必需**（有此变量才激活 BYOK） |
| `COPILOT_PROVIDER_TYPE` | Provider 类型，`openai` 适用于 OpenAI 兼容接口 | 可选（默认 `openai`） |
| `COPILOT_PROVIDER_API_KEY` | DeepSeek API Key | **必需** |
| `COPILOT_MODEL` | 模型名（同时设置 model ID 和 wire model） | **必需** |
| `COPILOT_PROVIDER_WIRE_MODEL` | 发送给 API 的模型名 | 可选（默认取 `COPILOT_MODEL`） |
| `COPILOT_PROVIDER_MAX_PROMPT_TOKENS` | 最大提示 token 数 | 推荐（非内置模型需手动指定） |
| `COPILOT_PROVIDER_MAX_OUTPUT_TOKENS` | 最大输出 token 数 | 推荐（非内置模型需手动指定） |

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
https://api.deepseek.com/v1
openai
deepseek-v4-pro
```

### 3.3 验证模型调用

```powershell
copilot -p "只回复当前使用的模型名。" --allow-all-tools --silent
```

预期输出包含 `deepseek-v4-pro`。

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
# 例如切换到 deepseek-chat
[Environment]::SetEnvironmentVariable('COPILOT_MODEL', 'deepseek-chat', 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_WIRE_MODEL', 'deepseek-chat', 'User')
```

然后重开终端或执行 `. $PROFILE`。

### Q: 如何切回 GitHub Copilot 默认模型

删除 BYOK 环境变量：

```powershell
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_BASE_URL', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_PROVIDER_API_KEY', $null, 'User')
[Environment]::SetEnvironmentVariable('COPILOT_MODEL', $null, 'User')
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
    'COPILOT_PROVIDER_BASE_URL' = 'https://api.deepseek.com/v1'
    'COPILOT_PROVIDER_TYPE' = 'openai'
    'COPILOT_PROVIDER_API_KEY' = $ApiKey
    'COPILOT_MODEL' = $Model
    'COPILOT_PROVIDER_WIRE_MODEL' = $Model
    'COPILOT_PROVIDER_MAX_PROMPT_TOKENS' = '64000'
    'COPILOT_PROVIDER_MAX_OUTPUT_TOKENS' = '8192'
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
.\setup-copilot-deepseek.ps1 -ApiKey "你的APIKey" -Model "deepseek-chat"
```
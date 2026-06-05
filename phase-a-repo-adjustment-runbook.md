# Phase A 仓库调整执行手册（Windows / PowerShell）

更新时间：2026-02-26

适用范围：
- `TriMetaverse`（元仓库，当前非 git）
- `TriPilot`（已有 git）
- `TriPilot/reference`（将迁入 TriMetaverse）
- `TriPilot/reference/vscode-copilot-chat`（当前为嵌套 git，目标 submodule）

---

## 0. 当前状态快照（已核对）

- `TriMetaverse`：非 git 仓库
- `TriPilot`：git 仓库（未检测到 remote）
- `TriStaciss`：git 仓库（`origin` 已配置）
- `Avatar-react`：非 git 仓库
- `Opentride`：非 git 仓库
- `vscodium`：git 仓库（`origin` 已配置）
- `TriPilot/reference/vscode-copilot-chat`：git 仓库（`origin` 指向微软上游）

---

## 1. 执行前准备（必须）

1) 关闭 VS Code 中正在占用 `TriPilot/reference` 的窗口。

2) 对关键目录做本地备份（建议）：

```powershell
$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
Copy-Item "d:/OneDrive/Code/ai/TriPilot/reference" "d:/OneDrive/Code/ai/TriPilot/reference.backup-$ts" -Recurse
```

3) 记录当前状态（留痕）：

```powershell
Get-Location
Test-Path "d:/OneDrive/Code/ai/TriMetaverse"
Test-Path "d:/OneDrive/Code/ai/TriPilot/reference"
```

---

## 2. 初始化 TriMetaverse 元仓库

```powershell
Set-Location "d:/OneDrive/Code/ai/TriMetaverse"
git init
git branch -M dev
```

> 远端仓库创建后再执行：

```powershell
git remote add origin <TriMetaverse-remote-url>
```

---

## 3. 迁移 reference 到 TriMetaverse

1) 移动目录：

```powershell
Move-Item "d:/OneDrive/Code/ai/TriPilot/reference" "d:/OneDrive/Code/ai/TriMetaverse/reference"
```

2) 验证迁移结果：

```powershell
Test-Path "d:/OneDrive/Code/ai/TriMetaverse/reference"
Test-Path "d:/OneDrive/Code/ai/TriPilot/reference"
Get-ChildItem "d:/OneDrive/Code/ai/TriMetaverse/reference"
```

3) （可选，过渡兼容）为 TriPilot 建立目录联接：

```powershell
cmd /c mklink /J "d:\OneDrive\Code\ai\TriPilot\reference" "d:\OneDrive\Code\ai\TriMetaverse\reference"
```

---

## 4. 规范化 vscode-copilot-chat（从嵌套 git 到 submodule）

> 目标：在 `TriMetaverse` 元仓库内，将 `reference/vscode-copilot-chat` 作为标准 submodule。

1) 先把现有目录临时挪走（避免与 `git submodule add` 冲突）：

```powershell
Move-Item "d:/OneDrive/Code/ai/TriMetaverse/reference/vscode-copilot-chat" "d:/OneDrive/Code/ai/TriMetaverse/reference/vscode-copilot-chat.local"
```

2) 添加 submodule：

```powershell
Set-Location "d:/OneDrive/Code/ai/TriMetaverse"
git submodule add https://github.com/microsoft/vscode-copilot-chat.git reference/vscode-copilot-chat
```

3) 若你需要保留 `.local` 里的特定本地改动，请先手工对比后再决定是否覆盖；通常参考仓不保留本地改动。

4) 清理临时目录（确认不需要后）：

```powershell
Remove-Item "d:/OneDrive/Code/ai/TriMetaverse/reference/vscode-copilot-chat.local" -Recurse -Force
```

---

## 5. 建立 reference 台账

在 `TriMetaverse/reference/REGISTRY.md` 记录：
- 名称
- 来源 URL
- License
- 用途（参考/对照）
- 负责人
- 更新频率

---

## 6. 首次提交（TriMetaverse）

```powershell
Set-Location "d:/OneDrive/Code/ai/TriMetaverse"
git add .
git status
```

确认无误后：

```powershell
git commit -m "chore(repo): bootstrap TriMetaverse meta-repo and reference submodules"
```

若远端已就绪：

```powershell
git push -u origin dev
```

---

## 7. 验收命令（Phase A）

```powershell
# A. TriMetaverse 已是 git 仓库
Set-Location "d:/OneDrive/Code/ai/TriMetaverse"
git rev-parse --is-inside-work-tree

# B. submodule 状态
git submodule status

# C. 目录可见性
Test-Path "d:/OneDrive/Code/ai/TriMetaverse/reference"
Test-Path "d:/OneDrive/Code/ai/TriMetaverse/reference/vscode-copilot-chat"

# D. TriPilot 兼容路径（若使用联接）
Test-Path "d:/OneDrive/Code/ai/TriPilot/reference"
```

---

## 8. 回滚方案

### 8.1 reference 迁移回滚

```powershell
Remove-Item "d:/OneDrive/Code/ai/TriPilot/reference" -Recurse -Force
Move-Item "d:/OneDrive/Code/ai/TriMetaverse/reference" "d:/OneDrive/Code/ai/TriPilot/reference"
```

### 8.2 submodule 回滚

```powershell
Set-Location "d:/OneDrive/Code/ai/TriMetaverse"
git submodule deinit -f reference/vscode-copilot-chat
git rm -f reference/vscode-copilot-chat
Remove-Item ".git/modules/reference/vscode-copilot-chat" -Recurse -Force
```

然后把 `.local` 目录移回原位。

---

## 9. Phase A 完成定义

- `TriMetaverse` 已初始化为 git 元仓库并推送到远端。
- `reference` 已迁移到 `TriMetaverse/reference`。
- `vscode-copilot-chat` 已标准化为 submodule。
- `reference/REGISTRY.md` 已建立并至少登记 1 个参考项目。
- 团队可通过 `git clone --recursive` 拉起同样结构。

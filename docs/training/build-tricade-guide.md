# TriCade Build Pipeline 教程

> 对应文件：`build-tricade.yml`  
> 讲解方式：总分总（总览 → 分段详解 → 总结）

---

## 总览（总）

`build-tricade.yml` 是 **TriCade 桌面端发行包的生产构建流水线**（GitHub Actions CI/CD）。

**一句话**：当有人打了一个 `v` 开头的 tag（如 `v1.0.0`），或手动触发时，GitHub 自动拉起一台 Windows 虚拟机，把四个仓库（TriMetaverse、TriLC、TriPilot、TriCode）的代码拉下来 → 编译 → 打包 → 组装成 ZIP → 发布到 GitHub Release。

整个流程分六大块：

| 块 | 行号 | 做了什么 |
|---|---|---|
| ① 触发器 | 14-29 | 什么时候跑？（打 tag `v*` 或手动触发） |
| ② 环境准备 | 34-79 | 在哪跑？拉哪些代码？装什么工具？ |
| ③ 编译构建 | 81-110 | 三个子项目逐个 `npm ci` + `tsc` 编译 |
| ④ 组装打包 | 112-175 | 把所有产物拼到一个目录，打成 ZIP |
| ⑤ 可选 MSI | 177-191 | 如果需要，还能生成 Windows 安装程序 |
| ⑥ 发布上线 | 193-233 | 上传产物 + 创建 GitHub Release |

---

## ① 触发器与 Job 骨架（行 1-40）

### 触发方式

| 触发方式 | 什么时候用 | 版本号来源 |
|---|---|---|
| `push: tags: v*` | 自动：打 `v1.0.0` 这种 tag 并 push | `github.ref_name`（即 tag 名本身） |
| `workflow_dispatch` | 手动：在 GitHub 网页上点按钮 | 手动填 `version`，不填就用 tag 名 |

```yaml
on:
  push:
    tags:
      - 'v*'              # 任何分支上 push v* 格式的 tag 都会触发，PR 不触发
  workflow_dispatch:
    inputs:
      version:            # 手动覆盖版本号
      build_msi:          # 手动勾选才打 MSI（默认 false）
```

### 关键设计决策

| 决策 | 选了什么 | 为什么 |
|---|---|---|
| 什么时候跑 | tag `v*` + 手动 | 版本驱动，也保留人工灵活性 |
| 需要什么权限 | `contents: write` | 要创建 Release |
| 在什么环境跑 | `windows-latest` | 产物是 Windows 桌面端 |
| 版本号怎么定 | 手动输入 > tag 名 | 手动优先，tag 兜底 |

### 内置变量

| 变量 | 含义 | 示例值 |
|---|---|---|
| `github.ref` | 完整引用路径 | `refs/tags/v1.0.0` |
| `github.ref_name` | 简短版——只取最后一段 | `v1.0.0` |
| `github.sha` | 当前 commit SHA | `abc1234...` |
| `github.repository_owner` | 仓库所有者 | GitHub 用户名 |

---

## ② 拉代码 + 编译构建（行 42-110）

### Checkout 四个仓库

```
GitHub Actions 虚拟机 (windows-latest)
├── TriMetaverse/   ← 自己（构建脚本），用 github.ref（完整引用防歧义）
├── TriLC/          ← 兄弟仓库，用 refs/tags/xxx（精确匹配 tag）
├── TriPilot/       ← 兄弟仓库，同上
└── TriCode/        ← 兄弟仓库，同上
```

**为什么 TriMetaverse 用 `github.ref`，兄弟仓库用 `refs/tags/xxx`？**
- 对自己：用完整路径（`refs/tags/v1.0.0`）防歧义——万一有同名分支，不会拉错
- 对兄弟：用精确 tag 引用（`refs/tags/${{ github.ref_name }}`），即使兄弟仓库里有人手滑建了同名分支也不会拉错

### 编译三件套

| 项目 | 命令 | 输出目录 | 特别说明 |
|---|---|---|---|
| TriCode | `npm ci` + `tsc --outDir dist` | `dist/` | 共享运行时，`strict: true` |
| TriLC | `npm ci` + `tsc --outDir dist` + `tsc --noEmit` | `dist/` | 多一步类型检查（历史代码渐进迁移） |
| TriPilot | `npm ci` + `tsc --outDir out` | `out/` | VS Code 扩展约定输出目录 |

### 常用命令速查

| 命令 | 全称 | 干什么 |
|---|---|---|
| `npm ci` | clean install | 按 `package-lock.json` 原样装依赖，CI 专用 |
| `npx tsc` | TypeScript Compiler | 把 `.ts` 编译成 `.js` |
| `--noEmit` | — | 只检查类型，不产出文件 |
| `vsce package` | VS Code Extension packager | 把扩展打成 `.vsix` 文件 |

### TriPilot 打包

```powershell
npx vsce package --no-dependencies --allow-missing-repository
$vsixFile = Get-ChildItem *.vsix | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

- `--no-dependencies`：跳过依赖检查（前面已 `npm ci`）
- `--allow-missing-repository`：允许 `package.json` 未填 repository 字段（内部项目不上商店）
- 排序取最新 `.vsix`：万一有多个，拿最新修改的

---

## ③ 组装 staging + 打 ZIP（行 112-175）

### Staging 目录结构

```
staging/TriCade-v1.0.0-windows/
├── extensions/
│   └── tripilot-chat-0.0.1/   ← .vsix 解压后的扩展
├── trilc/
│   ├── dist/                   ← TriLC 编译产物
│   ├── node_modules/           ← 运行时依赖
│   ├── package.json
│   └── version.json
├── tri-code/
│   ├── dist/                   ← TriCode 编译产物
│   ├── node_modules/           ← 运行时依赖
│   └── package.json
├── config/
│   └── settings.json           ← 全局配置（可选，缺失走默认值）
└── scripts/
    └── install.bat             ← 自动生成的一键安装脚本
```

### 硬依赖 vs 可选依赖

```powershell
# 硬依赖：拷贝后立即校验，失败就 exit 1（P1 级 Bug——产物不可用）
Copy-Item -Recurse -Force TriLC\node_modules "$staging\trilc\"
if (-not (Test-Path "$staging\trilc\node_modules")) {
  Write-Error "FATAL: TriLC node_modules copy failed"
  exit 1
}

# 可选依赖：不存在不报错（TriLC 有内置默认配置兜底）
Copy-Item -Force TriMetaverse\config\settings.json "$staging\config\" -ErrorAction SilentlyContinue
```

### 动态生成 install.bat

用 PowerShell here-string（`@"..."@`）动态生成安装脚本，`$env:VERSION` 会自动替换。生成内容示例：

```batch
@echo off
echo ========================================
echo  TriCade Desktop Installer v1.0.0
echo ========================================
echo [1/2] Installing TriPilot extension...
code --install-extension ".\extensions\tripilot-chat-0.0.1" --force
echo [2/2] Installation complete!
echo Start with: trilc daemon start
```

### 打 ZIP

```powershell
Compress-Archive -Force -Path "$env:STAGING_DIR\*" -DestinationPath "TriCade-$env:VERSION-windows.zip"
echo "zip_file=$zipFile" >> $env:GITHUB_OUTPUT   # 通过 step outputs 传递，linter 可验证
```

> 使用 `GITHUB_OUTPUT`（而非 `GITHUB_ENV`）是正规做法——step 之间传递数据，linter 能静态追踪。

---

## ④ 可选 MSI 安装程序（行 177-191）

### 触发条件

```yaml
if: inputs.build_msi == true || vars.BUILD_MSI == 'true'
```

| 触发方式 | 条件来源 | 怎么启用 |
|---|---|---|
| `workflow_dispatch`（手动） | `inputs.build_msi` | 手动勾选复选框 |
| `push: tags`（自动） | `vars.BUILD_MSI` | 仓库 Settings → Variables 设成 `true` |

### WiX 三件套

```
staging 目录 ──heat──→ TriCade-files.wxs ──candle──→ .wixobj ──light──→ .msi
   扫描              文件清单              编译             链接       安装包
```

| 工具 | 作用 | 输入 → 输出 |
|---|---|---|
| `heat.exe` | 收割（扫描目录生成文件清单） | 目录 → `.wxs` |
| `candle.exe` | 编译（源码 → 中间文件） | `.wxs` → `.wixobj` |
| `light.exe` | 链接（中间文件 → 安装包） | `.wixobj` → `.msi` |

- `tricade.wxs`：手写的主安装逻辑（UI、路径、注册表）
- `TriCade-files.wxs`：自动生成的文件清单

### MSI vs MSIX

| | MSI | MSIX |
|---|---|---|
| 运行方式 | 传统 Windows Installer（注册表写入） | 轻量容器化运行 |
| 卸载 | 可能留残留 | 完全干净 |
| 兼容性 | Win7+ 全支持 | Win10 1809+ |
| 当前方案 | ✅ 使用中 | 未实现 |

---

## ⑤ 发布上线（行 193-233）

### 上传产物

```yaml
- name: Upload ZIP artifact
  uses: actions/upload-artifact@v4
```

产物挂在 workflow run 下——即使 Release 创建失败也能去 Actions 页面手动下载。

### 创建 GitHub Release

```yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    tag_name: ${{ github.ref_name }}
    draft: false
    prerelease: ${{ contains(github.ref_name, '-rc') || contains(github.ref_name, '-beta') || contains(github.ref_name, '-alpha') }}
```

| Tag | 发布类型 |
|---|---|
| `v1.0.0` | 🟢 Latest Release |
| `v1.0.0-rc1` | 🟠 Pre-release |
| `v1.0.0-beta2` | 🟠 Pre-release |
| `v1.0.0-alpha` | 🟠 Pre-release |

---

## 总结（总）

### 完整数据流

```
git push --tags v1.0.0
        │
        ▼
    ① 触发器（push tags v* / 手动触发）
        │
        ▼
    ② 环境准备（windows-latest / Node 20 / checkout 4个仓库）
        │
        ▼
    ③ 编译构建（TriCode + TriLC + TriPilot → dist/ + .vsix）
        │
        ▼
    ④ 组装打包（staging/ → 拷贝 + 校验 → ZIP）
        │
        ▼
    ⑤ MSI（可选：heat → candle → light → .msi）
        │
        ▼
    ⑥ 发布（Upload artifact → GitHub Release）
```

### 实操指南

**场景 A：发开发测试版**
```bash
git checkout dev
git tag v1.0.0-beta1
git push origin v1.0.0-beta1
# → 自动触发，产出 Pre-release ZIP
```

**场景 B：发正式版**
```bash
git checkout main
git tag v1.0.0
git push origin v1.0.0
# → 自动触发，产出 Latest Release ZIP
```

**场景 C：手动触发（不打 tag）**
```
GitHub → Actions → Build TriCade → Run workflow
  - Branch: dev
  - version: v1.0.0-test（可选）
  - build_msi: ☑（可选）
```

**场景 D：需要 MSI 安装包**
```bash
# 方式 1：手动触发时勾选 build_msi
# 方式 2：仓库 Settings → Variables → 创建 BUILD_MSI=true
```

### 用户端使用

```
下载 ZIP → 解压 → 运行 scripts\install.bat → code --install-extension → 可用
```

---

## 相关文件

| 文件 | 用途 |
|---|---|
| `build-tricade.yml` | 构建流水线定义 |
| `TriMetaverse/installer/tricade.wxs` | WiX 主安装逻辑（手写） |
| `TriMetaverse/config/settings.json` | 全局默认配置 |

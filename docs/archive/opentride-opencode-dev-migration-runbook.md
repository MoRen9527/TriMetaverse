# Opentride → opencode-dev 迁移执行手册（可回滚）

更新时间：2026-02-27

## 1. 目标

- 将 `Opentride` 当前核心代码统一收口到 `opencode-dev/` 子目录。
- 为后续并行承载 `opencode` / `codex` / `claude-code` 提供清晰目录边界。
- 迁移过程可验证、可回滚，不破坏现有构建链路。

## 2. 迁移原则

- **最小移动**：仅做目录重定位，不在同批次引入功能改动。
- **先证据后切换**：先保留迁移前快照与验证结果，再做切换。
- **兼容窗口**：迁移后保留短期兼容（脚本/路径映射），再逐步清理。

## 3. 前置检查

在 `Opentride` 根目录执行：

```powershell
git status --short --branch
git rev-parse --abbrev-ref HEAD
```

通过标准：

- 工作区无未提交改动（或已明确纳入迁移提交）。
- 当前分支建议为 `dev`。

## 4. 执行步骤（MVP）

### Step A：创建迁移分支与快照标签

```powershell
git checkout -b chore/migrate-to-opencode-dev
$ts = Get-Date -Format "yyyyMMdd-HHmmss"
git tag "pre-opencode-dev-migration-$ts"
```

### Step B：目录下沉

目标动作：将根目录业务代码收口到 `opencode-dev/`。

建议先搬迁以下高价值目录（按实际仓库结构调整）：

- `apps/`
- `packages/`
- `sdks/`
- `script/`
- `docs/`（可选，若你希望保留在根目录则不移动）

示例（按需改路径）：

```powershell
New-Item -ItemType Directory -Force opencode-dev | Out-Null
Move-Item apps opencode-dev/
Move-Item packages opencode-dev/
Move-Item sdks opencode-dev/
Move-Item script opencode-dev/
```

### Step C：修正关键入口路径

需要检查并修正：

- `package.json` scripts（含 workspace 路径）
- `turbo.json` / `tsconfig.json` / 构建配置中的相对路径
- README 中启动命令
- VS Code tasks / CI 脚本中的 cwd

### Step D：兼容层（建议保留 1 个迭代）

- 在根目录保留短期兼容脚本，例如：
  - `npm run dev` 代理到 `opencode-dev/...`
  - 关键文档注明“代码已迁移到 `opencode-dev/`”

## 5. 验证清单

至少完成以下验证：

1. 依赖安装可运行（根目录兼容入口或新目录入口）。
2. 关键构建命令可运行（原主路径命令不报错）。
3. 关键开发命令可运行（例如 VS Code 扩展构建、核心 dev 命令）。
4. 文档路径引用无断链（README/脚本说明）。

记录模板：

```markdown
- 验证时间：
- 分支：
- 通过命令：
  - 
  - 
- 未通过项：
- 处理结论：
```

## 6. 提交与合并建议

- 提交拆分建议：
  1) 纯目录迁移提交（不混功能改动）
  2) 路径修正与兼容脚本提交
  3) 文档更新提交

- PR 标题建议：
  - `[Repo-Governance] migrate Opentride core into opencode-dev`

## 7. 回滚方案

若迁移后构建链路异常，可快速回滚：

```powershell
git reset --hard pre-opencode-dev-migration-<timestamp>
git clean -fd
```

或在 PR 维度执行 Revert。

## 8. 完成判定（DoD）

满足以下条目视为迁移完成：

- `opencode-dev/` 成为核心代码主承载目录。
- 关键构建/开发命令通过。
- 主文档（`arch-storage-migration.md`）与仓库 README 均已同步新目录策略。
- 回滚路径已验证可用。
# 分支与发布规范（一页版）

更新时间：2026-02-27

## 1. 目标

- 开发持续集成走 `dev`。
- 发布交付走 `release/*`（固定 tag 或 commit）。
- 紧急修复走 `hotfix/*`，修复后必须回合并到 `dev`。

## 2. 分支职责

- `dev`：开发/联调主线，可持续变化，不保证可复现。
- `release/*`：发布冻结线，只接收必要修复，保证可复现。
- `hotfix/*`：线上紧急修复短分支，完成后回灌。

## 3. 当前仓库策略

### Opentride

- 主开发线：`dev`（仓库默认分支也是 `dev`）。
- 发布建议：从 `dev` 的明确 commit 切 `release/*`。

建议命令：

```powershell
Set-Location 'D:\OneDrive\Code\ai\Opentride'
git checkout dev
git pull --ff-only origin dev
# 例：从已验证 commit 固定发布线
git checkout -B release/2026-02-27-c8da095 c8da095b2cbeab1ce352882a5a0acb47c5eed96e
git push -u origin release/2026-02-27-c8da095
```

### vscodium

- 主开发线：`dev`（当前已对齐 `origin/dev`）。
- 发布建议：优先从上游 tag 切 `release/*`（稳定可追溯）。

建议命令：

```powershell
Set-Location 'D:\OneDrive\Code\ai\vscodium'
git fetch --tags upstream --prune
# 例：从 tag 固定发布线
git checkout -B release/1.109.51242 refs/tags/1.109.51242
git push -u origin release/1.109.51242
```

## 4. 发布流程（最小闭环）

1. 在 `dev` 完成功能与验收。
2. 从 tag/commit 创建 `release/*`。
3. 在 `release/*` 仅做发布必要修复。
4. 发布完成后，将 `release/*` 变更回合并到 `dev`。

## 5. 紧急修复流程（hotfix）

1. 从当前生产基线（对应 `release/*`）切 `hotfix/*`。
2. 修复并发布。
3. `hotfix/*` 同步回 `release/*` 与 `dev`。

## 6. 命名规范

- `release/<版本号或日期-短SHA>`
- `hotfix/<日期-问题简称>`

示例：

- `release/1.109.51242`
- `release/2026-02-27-c8da095`
- `hotfix/2026-02-28-login-timeout`

## 7. 合并规则（建议）

- `dev -> release/*`：仅通过“切分支”建立，不直接长期双向同步。
- `release/* -> dev`：发布后回灌必须执行。
- `hotfix/* -> release/* + dev`：双回灌必须执行。

## 8. 禁止项

- 禁止直接从 `dev` 做生产发布。
- 禁止在发布窗口向 `release/*` 合入无关功能。
- 禁止只修 `release/*` 不回灌 `dev`。

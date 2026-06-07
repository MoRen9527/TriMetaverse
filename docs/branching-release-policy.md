# 分支与发布治理规范（现行版）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/branching-release-policy.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-06

更新时间：2026-06-06

## 1. 目标

- 保持当前多仓日常开发默认走 `dev` 的运行口径，不把未冻结的开发线直接当稳定真源。
- 为已进入真实交付、需要可发布 / 可回滚 / 可对外引用的成熟仓补 `main` 作为稳定基线。
- 继续使用 `release/*` 与 `hotfix/*` 收口发布和紧急修复，避免把发布窗口和日常集成混在一起。
- 停止把 `master` 当成现役稳定线，后续稳定分支统一收敛为 `main`。

## 2. 适用范围与名词边界

- 适用于当前 `TriMetaverse` 多仓工作区的仓库级 Git 分支治理。
- 本文所说的“分支”默认指 Git 分支，不等于 `TriDev` / workflow 文档里的 `PRD 分支`、`branchId` 或 phase branch。
- 本文所说的“稳定基线”指可用于发布、回滚、打 tag 或对外引用的受保护分支，不强制等于 GitHub 默认分支。

## 3. 分支职责

| 分支 | 职责 | 现行规则 |
| --- | --- | --- |
| `dev` | 日常开发 / 联调主线 | 默认开发线，普通功能、文档、重构、Issue 推进都先进入 `dev` |
| `main` | 成熟仓稳定基线 | 只在成熟仓启用；禁止直接日常开发；用于稳定引用、回滚、正式 tag |
| `release/*` | 发布候选 / 冻结线 | 从已验证的 `dev` commit 或上游 tag 切出；发布窗口内只收必要修复 |
| `hotfix/*` | 稳定基线紧急修复线 | 从当前稳定 / 生产基线切出；修复后必须回灌 |
| `feature/*` | 可选短分支 | 可由个人或单个 PR 临时使用，但默认目标仍是 `dev` |
| `master` | 历史兼容分支 | 不再承接新功能、发布或稳定语义；仅保留兼容历史时使用 |

## 4. 多仓分层策略

| 档位 | 仓库 | 当前模式 | 日常开发线 | 稳定线 | 当前要求 |
| --- | --- | --- | --- | --- | --- |
| A. 成熟仓 | `TriMetaverse`、`TriCompany`、`TriDev`、`TriPilot`、`TriStaciss`、`TriAvatar`、`TriMC`、`TriLC` | `main + dev` 双轨 | `dev` | `main` | 现在应补齐或启用 `main` 作为稳定基线；短期内默认分支仍可保留 `dev` |
| B. 过渡仓 | `Tride`、`TriDeployment`、`TriTest`、`vscodium` | `dev-first` 过渡 | `dev` | 暂不强制 | 继续走 `dev + release/*`；待稳定消费面形成后再引入 `main` |
| C. 占位仓 | `TriMobile`、`TriMem`、`TriWeb4`、`TriChain`、`TriGateway`、`TriHost`、`TriSkill` | `dev-only` | `dev` | 暂无 | 维持 `dev-only`；不要为待初始化仓提前维护双轨 |
| D. 历史迁移源 | `core-agent` | 冻结 | 不新增 | 不新增 | 不再投入新的分支治理精力；后续以 `TriMC` 为现役整合目标 |

## 5. 现行治理规则

### 5.1 日常开发

- 普通开发、联调、文档更新、Issue 推进默认都进 `dev`。
- 普通 PR 的默认目标分支是 `dev`。
- 不要求所有仓立即把 GitHub 默认分支从 `dev` 切到 `main`；先保证运行口径不乱，再逐仓补稳定线。

### 5.2 成熟仓（A 类）发布闭环

- 发布候选必须先从 `dev` 的已验证 commit 切 `release/*`。
- `release/*` 验证通过后，合入 `main` 形成稳定基线。
- 正式 tag 从 `main` 打，不从未冻结的 `dev` 打。
- 发布完成后，必须把发布线回灌到 `dev`。
- 最小闭环为：`dev -> release/* -> main -> dev`。

### 5.3 过渡仓（B 类）发布闭环

- 当前继续维持 `dev-first`，发布候选从 `dev` 的已验证 commit 或上游 tag 切 `release/*`。
- 在尚未引入 `main` 前，可继续从 `release/*` 或固定 commit / tag 形成发布基线。
- 发布完成后，仍必须把 `release/*` 回灌到 `dev`。
- 最小闭环为：`dev -> release/* -> dev`。

### 5.4 紧急修复（hotfix）

- A 类成熟仓：从 `main` 切 `hotfix/*`，修复后回到 `main`，再回灌 `dev`；若当前仍有活跃 `release/*`，还需补回该发布线。
- B / C 类无 `main` 仓：从当前有效生产基线或活跃 `release/*` 切 `hotfix/*`，修复后回灌到该稳定基线与 `dev`。
- 无论哪类仓，都禁止只修发布 / 稳定线而不回灌 `dev`。

### 5.5 `main` 保护规则

- `main` 只对 A 类成熟仓启用。
- `main` 禁止直接日常提交，默认只接受 `release/*` 或 `hotfix/*` 的合并结果。
- `main` 的职责是稳定真源，不是日常集成线。
- 在文档、CI、PR 模板仍大量写死 `dev` 的过渡期内，`main` 可以先不是 GitHub 默认分支。

### 5.6 `master` 退役规则

- `master` 不再承接新的功能开发、发布或稳定基线语义。
- 当前仍保留 `master` 的仓，只把它视为历史兼容分支。
- 后续若要统一稳定线命名，一律收敛到 `main`，不再新增新的 `master` 依赖。

## 6. 从 `dev-only` 升级到 `main + dev` 的条件

满足下列条件中的任意 2 到 3 条，就应把仓库从 `dev-only` 升级为 `main + dev`：

- 已有真实代码和可验证行为，不再只是 docs / 骨架占位。
- 需要对外给出“当前稳定版本”或被其他仓当作稳定依赖。
- 已出现发布、部署、验收、回滚或正式 tag 需求。
- CI / QA / release readiness 已开始作为真实门禁使用。
- 已需要区分“当前开发线”和“当前稳定真源”。

```powershell
Set-Location 'D:\OneDrive\Code\ai\TriMetaverse'
git checkout dev
git pull --ff-only origin dev
# 例：从已验证 commit 固定发布候选线
git checkout -B release/<yyyy-mm-dd-shortsha> <validated-commit>
git push -u origin release/<yyyy-mm-dd-shortsha>
```

## 7. 仓库级补充说明

### TriMetaverse / TriCompany / TriDev 等 A 类仓

- 当前建议先补 `main` 作为稳定基线，但短期内 GitHub 默认分支可以继续保留 `dev`。
- 这类仓后续的正式 tag 应从 `main` 打。
- 一旦补齐 `main`，发布闭环按 `dev -> release/* -> main -> dev` 执行。

### Tride

- 当前继续按 `dev-first` 运行。
- 发布建议：从 `dev` 的明确 commit 切 `release/*`。
- 等 SDK / extension / runtime 对外稳定依赖足够强时，再补 `main`。

建议命令：

```powershell
Set-Location 'D:\OneDrive\Code\ai\Tride'
git checkout dev
git pull --ff-only origin dev
git checkout -B release/<yyyy-mm-dd-shortsha> <validated-commit>
git push -u origin release/<yyyy-mm-dd-shortsha>
```

### vscodium

- 当前继续按 `dev-first` 运行。
- 发布建议：优先从上游 tag 切 `release/*`，保证与 upstream 对齐、可追溯。
- 现存 `master` 只保留历史兼容语义，不再作为现役稳定线。

建议命令：

```powershell
Set-Location 'D:\OneDrive\Code\ai\vscodium'
git fetch --tags upstream --prune
# 例：从 tag 固定发布线
git checkout -B release/1.109.51242 refs/tags/1.109.51242
git push -u origin release/1.109.51242
```

## 8. 合并方向

- `dev -> release/*`：通过切分支建立发布候选，不做长期双向同步。
- A 类成熟仓：`release/* -> main -> dev`。
- B / C 类无 `main` 仓：`release/* -> dev`。
- A 类成熟仓 hotfix：`hotfix/* -> main + dev`；若存在活跃 `release/*`，额外补回该发布线。
- B / C 类无 `main` 仓 hotfix：`hotfix/* -> 当前稳定基线 + dev`。

## 9. 禁止项

- 禁止直接从 `dev` 做正式生产发布。
- 禁止把所有仓一刀切改成 `main` 默认，而不区分仓库成熟度。
- 禁止在发布窗口向 `release/*` 合入无关新功能。
- 禁止只修稳定 / 发布线，不回灌 `dev`。
- 禁止继续把 `master` 写成现役稳定真源。

## 10. 最小执行口令

- `release/<版本号或日期-短SHA>`
- `hotfix/<日期-问题简称>`
- A 类成熟仓：`dev -> release/* -> main -> dev`
- B / C 类仓：`dev -> release/* -> dev`
- 紧急修复：`稳定基线 -> hotfix/* -> 稳定基线 + dev`

示例：

- `release/1.109.51242`
- `release/<yyyy-mm-dd-shortsha>`
- `hotfix/2026-02-28-login-timeout`

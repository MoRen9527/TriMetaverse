# scripts/hooks/ — LG-017/v2.1 sg-bare 写控 hook 正身镜像

- sourceOfTruth: 本目录（hook 脚本正身镜像位；服务器部署域=sg-bare /srv/git/TriMetaverse.git hooks/）
- syncMode: source
- 正身依据: V21-2 CTO 机制勘定记录 §三/§四/§六/§七（docs/workflow/operating-records/2026-W36/trees/lg017-v21-legislation/reports/v21-2-cto-mechanism.md）；协议 v2.1 ⑤ 懒激活三件套

## 件清单

| 件 | 用途 |
|---|---|
| `pre-receive-dev-control` | dev 写控 hook：邮箱允许单（deny-by-default，author+committer 双字段判）+anti-non-ff+禁删+staging 从宽闸+500 commit 扫描上限 fail-closed；拒因文案三类（V21-2 §六） |
| `post-receive-rface-tripwire` | R 面撞点观测 tripwire（只观测不拦截）：trirmc 双字段 commit 且 committer 时刻不在周日 23:00-23:59 +0800 → tripwire.log 旗标留痕 |
| `test-pre-receive-dev-control.sh` | fixture 自测驱动（V21-2 §四.6 六类+补充，14 用例）——**部署前置，全绿方可上线** |
| `README.md` | 本件：边界声明+部署注记 |

## ⚠️ 边界声明（V21-2 §七.5，防「已设防」误读）

- 本 hook **只辖** `TriMetaverse.git` 的 `refs/heads/dev`（写控+anti-non-ff+禁删）与 `refs/heads/staging`（anti-non-ff+禁删）。
- **tags 及其他 refs 本期不设防；TriMetaverse.git 之外的其他仓（TriRLC/TriCompany/TriRMC 等）不设防。**
- 入仓镜像 ≠ 部署 ≠ 激活：本批=正身镜像入仓走评审；**部署另令候窗**（懒激活三件套同批约束：建 staging 分支+rmc_tick 合同改写+hook 部署/tripwire，缺一不激活——协议 v2.1 ⑤）。

## 部署注记（候窗执行时）

1. 部署形态：`cp scripts/hooks/pre-receive-dev-control <bare>/hooks/pre-receive && chmod +x`；tripwire 与既有 post-receive（镜像段）**评审合并**（source 或追加调用），禁直接覆盖。
2. 部署前登机复核（V21-2 §八未验证项）：heyuan 检出 `git config user.email`=trirmc@tri.company、sg 检出=trimmc@tri.company 零变更断言；eb39129b 实际双字段复核。
3. 部署前置自测：`bash test-pre-receive-dev-control.sh` 全绿（PASS=N FAIL=0）。
4. 激活后首迁移窗（周日 23:00）=硬验收：迁移 commit 正常入 dev+tripwire 零误报留痕；异常即回滚（`chmod -x` 或 rm，秒级无需重启服务）。
5. 允许单变更=改正身内联表走评审+工程真源留痕（新 M 面写侧走允许单变更流程）。

## 回滚

`hooks/pre-receive` chmod -x 或 rm —— 秒级，无需重启任何服务（V21-2 §四.6）。

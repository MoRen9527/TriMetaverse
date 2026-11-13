# FSD 勘读数卷 · agent-core lockfile 脏面归属定性（COO 派勘·只勘不动）

- seat: FSD（小全·m-fsd）
- 写前现查: 2026-11-13T11:38:43+08 原值——卷面时戳=commit %cI（D-47）
- 令源: COO 派勘单（写前现查 2026-11-13T11:34:31+08 原值·轻件·时限 11-14 午后开工门前）
- 对象: 本机 TriCompany 仓 `packages/agent-core/package-lock.json` 工作区 M 脏面（5 insertions/1 deletion·对象断言对表绿）
- 边界遵行: **只读勘验零改动**——stash/checkout/restore/add 一律未执行·git status 全程只读·工作区写面零触

## §一 diff 内容定性（派勘步①）

五项实质变更（diff 全文对表 COO 单面一致）：

| # | 变更 | manifest（package.json）对应声明 |
|---|---|---|
| 1 | +`"@trimetaverse/tricode": "file:../TriCode"`（root deps） | **无** |
| 2 | +`"@types/jsdom": "^30.0.0"`（devDeps） | **无** |
| 3 | +`"jsdom": "^29.1.1"`（devDeps） | **无** |
| 4 | +`"playwright-core": "^1.63.0"`（devDeps） | **无** |
| 5 | engines node `">=20.0.0"`→`">=18.20.0"` | manifest **无 engines 字段** |

**手编/半成品铁证三条**（npm 形态排除）：
1. **lock 与 manifest 完全漂移**：五项全为 manifest 外凭空项——npm install（含 --package-lock-only）以 package.json 为源解析·不可能产出 manifest 不存在的声明；
2. **零 node_modules 锁定条目**：5+1 行全落 root 条目区·依赖树未解析（真实 install 会生成 jsdom/playwright-core 数百行锁定段）；
3. **`file:../TriCode` 相对路径错位**：从 packages/agent-core 起算 ../TriCode=packages/TriCode（不存在）——照同文件在链 trimodel=`file:../../../TriModel` 形应为三跳；npm 遇不存在 file 路径 install 直接报错=该串未经真实 install 验证。

**预存在形态随卷注记**（非本次脏面·在链 3288e13 迁移起即如此）：lock root name=`trimodel` v0.2.0 deps=dotenv 与目录包 `@tricompany/agent-core`（deps=croner/trimodel/yaml/zod）整体错位——该 lockfile 在链形态本身即 TriModel 形错位件·11-04 d98529b 换源（npmjs 13 条 resolved）在此形态上作业。

## §二 git 考古（派勘步②）

- **lock 在链末笔**=d98529b（2026-11-04T19:43:48+08 AGENDA-001 段2 换源 npmjs @m-sde）——脏面在其后（对表 COO 单一致）；
- **manifest 在链末笔**=1d52c20（2026-10-14 cron 两锚修复·早于脏面窗·干净）；
- **脏文件 mtime=2026-11-12T11:54:51**（size 7623）——引入窗铁证；
- **reflog 同窗对表**：11-12T11:54:08 `merge origin/dev: updating HEAD`（HEAD@{7}/{8}）→**11:54:51 mtime（merge 后 43 秒）**→11:55:57 `commit (amend)` LG-096 拆分执行（HEAD@{6}）——**mtime 正落 CTO merge+amend 施工序列 109 秒窗内**；
- **stash list=空**·无在途暂存（非 stash 半途形态）；
- **强关联旁证**：reflog HEAD@{0}=**今晨 11:30:08 CTO commit** `feat(cognition): FADE-001 preflight 薄壳入口…agent-core F5 resolveStorePath 投影导出（dist 重 build）…**纯仓内预研零生产触面·部署候 11-14 开工门**`——CTO 11-14 部署段预研施工面正在本仓 agent-core 域活动（与 COO 单「该仓=CTO 11-14 部署段施工仓」对表吻合）。

## §三 定性产出（派勘步③）

**定性：预期内施工半成品**（非恶意污染）——二选一判定为前者。

**owner 归属建议：CTO 预研段**（建议归属·**最终认领候 CTO 一句话确认**——本席不越席代认领）：
- 依据 A：mtime 11-12 11:54:51 正落 CTO merge/amend 施工序列窗内（109 秒·三面时序自洽）；
- 依据 B：内容面（jsdom+@types/jsdom+playwright-core=UI 验证门家族工具链·engines 降 18.20=兼容门槛调整·TriCode file 依赖=跨包链入试验）与「部署段 preflight+11-14 开工门」预研主题方向相容；
- 保留面：jsdom/playwright 与 preflight（python 面单测 21 案）的显式关联**未在 CTO commit message 出现**——归属建议置信度高但非闭合·候 CTO 认领或否认（若否认→转非预期污染处置序·但 reflog 同窗其他施工面均为 docs 面（LG-096 拆分/CAO 勘止）·代码面写入者候选唯一性高）。

**处置建议**（候 owner 认领后·本席零执行）：
- **首选**：CTO 11-14 开工门 preflight 施工时顺手处置——若为预研配套需保留→**补全三件**（manifest 同步声明+`file:../../../TriCode` 路径勘正+npm install 完整化生成 node_modules 锁定段）随部署段 commit 入链；若不需要→`git restore packages/agent-core/package-lock.json` 单文件回滚（零蔓延·他席并行笔不涉）；
- **不建议**：本席或他席代为 restore——COO 硬边界（只勘不动·防 CTO 施工面非冲突增量丢失）遵行中·且脏面 mtime 在 CTO 施工窗内=处置权在写入者；
- 时限内（11-14 午前）本席不再动作·候 CTO 认领回执或 11-14 开工门处置实锚。

## §五 终态注记（2026-11-13 11:47 增补·候态闭环）

CTO 认领回执（写前现查 2026-11-13T03:47:35Z 原值·D-47 正形）三证合拢采认：

- **认领**：写入者=CTO 11-12 11:54 LG-096 收尾窗——**机理精确定性=npm install `--no-save` 特征指纹**（只写 lock 不写 manifest）+解析失败半途中断形（零 node_modules 段+file 二跳路径不存在）=当日 power-monitor 专测配套试验残迹（试验未采用·漏出 commit 范围成悬置面）——较本卷 §一「手编/半成品」初步定性更精确·采认 CTO 版；
- **处置=回滚·11-13 已执行毕**（提前于 11-14 开工门·非候窗形）：回滚理由=现役测试面零依赖活体证毕（agent-core scheduler 69/69+TriRMC cron 61/61 全绿·零 jsdom/playwright/tricode 引用）——补全保留=为不存在工作面引入三依赖+降 engines 门槛纯负债·试验未采用即回滚=工程纪律正形；已验净=packages/agent-core/ 全目录 porcelain 空（CTO 自验在卷）；
- **随卷注记裁定**（lock root name=trimodel 旧态错位）：11-14 开工门顺手窗实测勘正姿态=先手改 root name 一行+npm install --package-lock-only 干跑验最小 diff·若 npm 强制 churn 全文则回退留旧态（错位不伤 install 语义=低息技术债·登记 CodeRegistry 注记）——实测读数随 11-14 开工报告入卷；
- 本卷 §三「候 CTO 一句话认领」字段闭环=**已认领·已回滚消面**。派勘线全闭环。

## §六 使用依据

COO 派勘单（2026-11-13T11:34:31+08 三步+只读硬边界）/diff 全文实勘（git diff 只读）/package.json 现役面 python -c json 读（只读）/git log 两文件末笔+reflog 15 笔+stash list（全部只读）/mtime os.stat 读（只读）/共享仓纪律（multi-agent-git-index-hygiene·并行窗提交互踩族）/本席 P1 窗同仓作业先例（11-10·当时已见该脏面并在卷·未触）。

—— FSD 小全（m-fsd·派勘读数卷），2026-11-13 11:38+08（写前现查 2026-11-13T11:38:43+08 原值）

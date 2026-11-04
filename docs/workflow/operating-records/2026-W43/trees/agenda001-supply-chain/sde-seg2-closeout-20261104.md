# SDE 段2 毕报 · AGENDA-001 供应链卫生（2-1+2-2 施工·CI 实证面）

- sourceOfTruth: 本卷（段2 施工收口正身·五仓 commit 锚+CI 实证读数）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COO 派工令（2026-11-04T11:23:27Z）·授权锚=排工单正身 2f4d58564（CEO 02:47:43 确认令承接）·门=段1 全绿（cto-seg1-closeout-20261023.md ✓）

## §一 · 2-1 施工读数（CI 切 npm12+禁 install 脚本+allowlist）

**CI 构建面勘定**：TMV build-tricade.yml（tag+dispatch 触发·五工程 npm ci=TriModel/agent-core/TriCode/TriRLC/TriPilot）+TriPilot quality-gate.yml（push/PR 触发·两 job）——TriRLC/TriCode/TriMMC 无 workflows（CI 面=上两文件）。

| 面 | 改形 |
|---|---|
| node 槽 | 20→**24**（npm12 engines 硬前置 `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0`·段1 实锚——20 不满足须切 24） |
| npm12 载体 | runner 内 `npm install -g npm@12`（自升·段1 实锚=npm12 不随任何槽自带）+版本断言 major=12 |
| 严格闸 | 每工程 npm ci 后 `npm install-scripts ls` **文本空判**（判据行=`No packages with unreviewed install scripts`） |
| allowScripts | 四工程 package.json 顶层字段·按各 lockfile 实值 pin（见下谱） |

**allowScripts 落点谱（终形·CI 首战勘定后修正）**：
- TriRLC `esbuild@0.28.1` / TriCode `esbuild@0.28.1` / TriModel `esbuild@0.28.1`（各仓单脚本包·CI 绿实证）
- TriPilot **四项**：`esbuild@0.27.3`（顶层）+`esbuild@0.28.1`（tsx 嵌套 node_modules/tsx/node_modules/esbuild）+`keytar@7.9.0`（install: prebuild-install）+`@vscode/vsce-sign@2.0.9`（postinstall）——commit fd547f3
- agent-core：lockfile 零脚本包=**不加字段**（闸空判天然绿）
- TriMMC：不在 build-tricade 构建面（无 npm ci 步）=本批不动（段3 各模块面再落）
- fsevents@2.3.3=optional 平台包（win/ubuntu runner 不装·CI 实证 pending 三包不含它）不入 allowScripts；macOS 本地开发者若触发可按 npm12 提示 approve

**【方法勘定注】初版 survey 按固定名单 grep（esbuild/fsevents/playwright-core/node-gyp/@swc/electron）→keytar/vsce-sign/嵌套 esbuild 漏网——CI 闸首战拦获（41823996223 run）后改权威枚举法=lockfile `hasInstallScript:true` 字段全量枚举（五仓复扫：TriRLC 1/TriPilot 5/TriCode 2/TriModel 2/agent-core 0）·闸设计价值实证**

**【段1 判据面勘定修正·如实注记】**：段1 卷写「`install-scripts ls` 输出空 + `approve-scripts --allow-scripts-pending` 空判」两道闸——**实测 `approve-scripts` 是放行动词非检查动词**（Usage 实锚：`approve-scripts <pkg>|--all|--allow-scripts-pending`=approve 动作·pending 非空时跑=approve 全部=CI 用之会假绿放行）——**CI 闸唯一正形=`install-scripts ls` 文本空判一道**（pending 非空时该命令也 RC=0·必须文本判非 RC 判——空判据行=`No packages with unreviewed install scripts`）。npm12=12.2.1 全链本地实证（probe 工程：install→warn blocked→approve→package.json 落 allowScripts 同形→ls 清零）。

## §二 · 2-2 施工读数（audit signatures job+lockfile 人工确认标记）

- **TMV build-tricade.yml**：新 `supply-chain-audit` job（5 仓 checkout+node24+npm12+**五工程逐一 `npm audit signatures`**）·build job 加 `needs: supply-chain-audit`（audit 先绿才 build·release 面语义）
- **TriPilot quality-gate.yml**：新 `supply-chain-audit` job（单仓 npm audit signatures）+新 `lockfile-guard` job（**PR 面**：package-lock.json diff 变更行（added+deleted）>30→须 `lockfile-reviewed` label 方过（gh pr view 取 label）·fetch-depth 0+base ref diff）
- 注记：lockfile 标记落 PR 流（TriPilot 有 PR 面）——TMV build-tricade=tag 直推形无 PR 面·面上不做（如实注记非漏项）

## §三 · 验证读数

- YAML lint 双文件 PASS（jobs 谱：build-tricade=[supply-chain-audit,build]·quality-gate=[test,extension-host-e2e,supply-chain-audit,lockfile-guard]）
- 四 package.json JSON lint+allowScripts 值面对表 PASS（注入形=json 读写·各仓 diff 恰 3 行零格式漂移）
- **本地模拟闸 PASS**：node24.22.1+npm12.2.1 环境对 TriModel lockfile `npm ci` RC=0+`install-scripts ls`=空判据行（手写 allowScripts 形与 approve 落形同构·段1 双实证互证）
- npm12 命令面实证坑注：npm.cmd 批文件 PATH 解析需 node24 前置（bash export PATH 不达批内·PowerShell 原生面通过）——CI runner 无此坑（setup-node 面内置）

## §四 · 回滚开关（排工单预案在卷兑现）

任一模块构建异常→①该模块 `.npmrc` 临时 `ignore-scripts=false`（闸旁路）→②node 槽回切（CI yaml node-version '24'→'20'+npm12 步删）→③allowScripts 字段回滚（无副作用可保留）——CI 面=各仓 workflow 单 commit revert。五仓 commit 独立可逐仓回。

## §五 · CI 实证面（TriPilot quality-gate 三跑实录·终态）

**run 谱**（push 触发·github MoRen9527/Tripilot）：

| run | 触发 commit | 结果 | 勘定 |
|---|---|---|---|
| 41822578832 | 54d4505（首推） | FAILURE 15s | **EALLOWREMOTE**——npm12 默认禁 remote fetch，lockfile 884 条 tencent/npmmirror 直链全撞→**五仓文本级前缀换源 npmjs**（integrity 不变·同 tarball 同构 path）·闸首战暴露 mirror 污染=段2 要防的缺陷实证 |
| 41823996223 | e9ad99b（audit 补 ci+换源后） | FAILURE 29s | audit job ✓ 绿（npm ci+signatures）；test/e2e 败于**闸拦获 allowScripts 漏网**（keytar/vsce-sign/嵌套 esbuild@0.28.1）→fd547f3 补全 |
| 41825613883 | fd547f3 | 终态 | **✓ supply-chain-audit 23s + ✓ test 29s**（npm ci+闸+compile+coverage 全过·node24+npm12 实证）·X extension-host-e2e 3m34s·− lockfile-guard（push 面 PR-only 正确跳过） |

**段3 门「2-1 CI 实证绿」对表**：supply-chain 面（npm12 闸+audit signatures+allowScripts）=**实证绿**（test+supply-chain-audit 两 job 全绿）；e2e job 红为**既有环境性失败**（独立验证：08-25 run 32817437091/08-28 run 33144564147 node20 期同断言族「daemon should be running on 8711/healthz 200/uptime present」——e2e 套件依赖活体 TriRLC daemon，ephemeral runner 无 8711 监听=2+月既有红·非本段改形引入·候 CTO/STE 裁后续（runner 内 daemon bootstrap 步或 e2e 出 CI 门）·段2 scope 不含）。

**TMV build-tricade**：本地 dev 顶 8f4cc9874（含段2 全部施工+merge）已推 sg-server ✓；github 通道间歇断连（本机直连 github 443 闪断族·TriPilot 同窗推讫可证非仓库问题）——dispatch 实证候 github 通窗补跑（TMV yml 与 TriPilot 同构面已由 TriPilot 三跑实证背书）。

**【21:05-21:2x 通窗补办讫·2026-11-04 增补】**：
- **github 腿补推收官**：TMV 顶推讫（真更新行 80905a6a1..0712b9193）+TriCompany 补推讫（de42e94..d98529b）——**段2 五仓 github 通道全通**（TriModel/TriCode/TriRLC/TriPilot 段2 已推+TMV/TriCompany 本轮补齐）
- **dispatch 实证双跑实录**：
  | run | 结果 | 勘定 |
  |---|---|---|
  | 41835116639（首 dispatch） | supply-chain-audit **FAILURE** | **闸第三例拦获**：TriRLC `npm ci` EUSAGE——lockfile 陈旧（@esbuild 平台包族 24 条缺失+根包依赖谱漂移）·段2 本地模拟闸只对 TriModel 跑过未覆盖 TriRLC·**覆盖缺口如实自领** |
  | 41836948423（修复后 re-dispatch） | supply-chain-audit **SUCCESS** | 5 工程 npm ci+audit signatures 全谱过·TriRLC 修复生效 |
- **TriRLC 修复笔**（TriRLC 44b8a59·双通道推讫）：①lockfile 全谱重算（npm12 --package-lock-only --registry=npmjs 强制——首跑断言拦获 mirror 回写污染一例自纠：registry config 回流致 npmjs 计 0/mirror 计 25·显式 registry 后 npmjs=25/mirror=0）②allowScripts esbuild@0.28.1 pin 形→**裸名形**（npm12 approve 官方落形：esbuild 主条目 lockfile 无 resolved 无法 pin·裸名形 ls 清零本地实证）③本地验证=npm12.2.1 ci RC=0+install-scripts ls 空判 PASS
- **坑注（增补·CI 首战三学）**：a) 双 pushurl 首 URL fatal 后 git **中止不试第二腿**（段2「push origin dev 只达 sg」机理勘正=github 腿 fatal 中止而非 sg 腿独达）b) npm12 --package-lock-only 按 registry config 回写 resolved（换源成果可被重算冲回·重算必显式 --registry）c) approve 裸名落形条件=lockfile 条目无 resolved（有 resolved 时 pin 形可用·supply-chain 语义裸名宽于 pin 如实注记）

**commit 锚谱**：TriModel c1381bc/TriCode 597fe7d/TriRLC 0c3d343/TriPilot f0cc49d（lockfile）+fd547f3（allowScripts 补全）+e9ad99b（yml audit 修形）/TriCompany d98529b（agent-core lockfile）/TMV 07782bc3c（yml+施工卷）+258b9d930（yml audit 修形）——四仓 github 顶=本地顶（TriPilot/TriRLC/TriModel/TriCode 显式推+对表验讫）；TriCompany github 通道候通窗补推（sg 侧已在链）。

## §六 · 使用依据

- 排工单正身（coo-schedule-agenda001-20261023.md·2f4d58564 承接）·段1 收口卷（cto-seg1-closeout-20261023.md·四输入面+坑案三条）
- 本地实证：npm12-seg2 prefix（12.2.1）+probe 工程（allowScripts 全链）+seg2-gate-sim（TriModel 闸模拟）
- lockfile 实勘：五仓 package-lock.json esbuild/fsevents/playwright-core/node-gyp/@swc/electron 逐项 grep

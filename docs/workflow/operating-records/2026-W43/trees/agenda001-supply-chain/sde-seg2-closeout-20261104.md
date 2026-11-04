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

**allowScripts 落点谱（修前 lockfile 逐仓实勘·版本分谱勿互串）**：
- TriRLC `esbuild@0.28.1` / TriPilot `esbuild@0.27.3` / TriCode `esbuild@0.28.1` / TriModel `esbuild@0.28.1`
- agent-core：lockfile 零 esbuild 零脚本包=**不加字段**（闸空判天然绿）
- TriMMC：不在 build-tricade 构建面（无 npm ci 步）=本批不动（段3 各模块面再落）
- 其余脚本包勘定：fsevents=optional 平台跳过（win/ubuntu runner 不装）·playwright-core 无 postinstall·node-gyp/@swc/electron 五工程 lockfile 零存在（段1 同勘互证）

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

## §五 · CI 实证面

- TriPilot quality-gate：push dev 自动触发——实证读数随毕报（候 Actions 绿）
- TMV build-tricade：workflow_dispatch 触发一发实证（inputs 默认·build_msi false）——候读数
- 段3 门「2-1 CI 实证绿」锚=本节读数（COO 派段3 前对表）

## §六 · 使用依据

- 排工单正身（coo-schedule-agenda001-20261023.md·2f4d58564 承接）·段1 收口卷（cto-seg1-closeout-20261023.md·四输入面+坑案三条）
- 本地实证：npm12-seg2 prefix（12.2.1）+probe 工程（allowScripts 全链）+seg2-gate-sim（TriModel 闸模拟）
- lockfile 实勘：五仓 package-lock.json esbuild/fsevents/playwright-core/node-gyp/@swc/electron 逐项 grep

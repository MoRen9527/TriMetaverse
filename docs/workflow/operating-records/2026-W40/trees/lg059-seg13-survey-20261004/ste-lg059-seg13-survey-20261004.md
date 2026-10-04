# STE·LG-059 段1/段3 勘明卷（BOD 组窗令件②；COO 18:2x 派，21:00 限）

- sourceOfTruth: 本件（段1/段3 剩余面勘明正身；施工面候 CTO 分派，本席零源侧写面）
- syncMode: static（勘明毕，毕报→COO 20:1x）
- lastSyncedAt: 2026-10-04T12:11:49Z（date 现查原值=20:11:49+0800）
- 执行席: STE 小柯（m-ste）；零转抄 ✓（两仓 git grep/ls-tree/git show/merge-base 现势独立复得；勘证半件 sweep（8749f37f，10-01）系**修复面前现势**仅作底册对表，不作现势引证）

## 一、令源与段口径

- BOD 组窗令件②（COO 18:2x 承转）：CEO「大表没完成的服务器往流水线上排」；段2=B 件已闭合（64f12c97）；段1/段3=两仓老测试旧路径修复+缺测试库两笔剩余面今夜勘明具体活；施工死线 10-05 EOD。
- 本卷口径：段1=两仓（TriRLC/TriMMC）老测试旧路径修复剩余面；段3=缺测试库（ink-testing-library 族）两笔剩余面。
- 边界：LG-059 范围=TriRLC/TriMMC 两仓（勘证半件扫描域同）；TriMLC 邻族另注不扩（§四）。

## 二、关键现势：TriRLC 双线分叉（勘明第一发现）

- 本地 dev = **ahead 8 / behind 5** vs origin/dev（origin=github+sg bare 双推面，18cd777… vs origin 顶）。
- **LG-059 修复面两笔全在 origin 线、不在本地 HEAD**（merge-base --is-ancestor 实证 NO）：
  - f45885e「fix(lg-059): TriRLC 仓旧名叙事面残留修复——525 行扫面改名/127 文件+36 行兼容面保留（batch-03 件 1）」
  - 6b845be「fix(lg-059-ink): 撤 ink-testing-library 测试链改自研适配件——components.test.ts 27 it() 全绿（batch-03 件 2·CTO 方案 A' V1-V4）」
- 本地 ahead8 = LG-058 N4 系列（c7414e3/bdf8e3e/1af0908/18cd777）+trimodel-wave4-pre+fade-010（**在途交付线**）。
- 本地线活体病：test/tui/components.test.ts **L8 裸 import 'ink-testing-library'**，node_modules 无包=ERR_MODULE_NOT_FOUND 形（LG-059 原病在本地线活体）；origin 线同文件已改 `./helpers/test-renderer.js`（方案 A' 落地实证，git show origin/dev 对读）。
- TriRLC docs/registry/test-state 既有条款「双线分叉窗不清，TriRLC 仓代码冻结」→ **收敛动作=解冻窗动作，CTO 令前置**。
- TriMMC 对照：本地=origin 对齐（无 ahead/behind），LG-059/060 修复面 bfbfcfe（888 行/120 文件）/7beac36（WO-C）/8ab3281（WO-D）/e6f7e98（WO-E）全 IN-HEAD ✓。

## 三、段1 具体活清单（每活：仓+路径+预估量）

| # | 仓 | 活 | 路径 | 预估量 | 归属/风险 |
|---|---|---|---|---|---|
| 1 | TriRLC | dev 双线收敛 | 本地 dev（ahead8/behind5） | 13 commit 整合+全量门复跑（229/229 基准）≈1-2h | **CTO 解冻令前置**；撞 LG-058 在途线须排窗；段3-TriRLC 随本活自然关门 |
| 2 | TriRLC | .github/agents 3 文件正名 | .github/agents/TriLC{Product,Code,BusinessStrategy}Registry.agent.md | 3 文件 git mv+frontmatter name+desc（27 处）≈0.5-1h | 宿主发现名变更→Copilot-host 对表+发布管线窗协调前置 |
| 3 | TriMMC | 测试书纪 1 行 | test/server/internal-auth.test.ts L3 | 1 行注释（createTriMCApp→createTriMMCApp；src 实名=app.ts:61 `createTriMMCApp` 实证）≈0.1h | 零风险机械活，今夜可开 |
| 4 | TriMMC | .github/agents 3 文件正名 | .github/agents/TriMC{...}Registry.agent.md | 3 文件 git mv+name 字段 3 处（desc 已正名 TriMMC）≈0.2-0.3h | 同活 2 风险注 |
| 5 | 两仓 | 挂窗族（不排死线） | TriRLC：src/tray/*.cs+scripts/build-tray.ps1（33）/src/cli.ts（10）/src/daemon/systemd.ts（3）=46 处；TriMMC：src/cli.ts 3+src/internal-token.ts 3+docker/Dockerfile 13+src/heartbeat/*.py 8（`python -m TriMC.src...`）+docs 7+README 1+code-state 1=36 处 | 口径登记零施工 | **CTO 143 行裁+batch-02/03 兼容面保留先例=与物理目录改名同窗原子切换**；死线清尾按「挂窗族不属余段施工面」口径对表 |
| 6 | TriRLC | test/scripts 残 10 处分类核 | test/tui 2+test/tools/tool-unit-tests.sh 2+test/server/auth-gate 2+test/env-fallback 2+scripts/e2e-staffing-repro.mts 3（origin 线现势） | ≈0.5h | 初判多数=合法引用（createTriLCApp=活函数名；env-fallback=故意旧路径输入用例）；随活 1 收敛后复扫终分类 |

## 四、段3 缺测试库两笔终态

- **TriRLC 笔：origin 线已闭**——6b845be 方案 A'（撤 ink-testing-library→自研 test-renderer 适配件；origin 线 tui import=helpers/test-renderer.js 实证；27 it() 绿）。本地线未继承，随活 1 收敛本地关门。
- **TriMMC 笔：缺装无对象实证**——三仓 `git log --all -S "ink-testing-library"` 零命中（TriMMC 历史从未装过）+TriMMC test 面零 import（无 tui 消费面）→ 候裁注记销项（原 sweep「缺」系与 TriRLC 并列扫出，实际无消费方；batch-02 lg060 卷「+ink+ink-testing-library」笔与三仓 committed 史不符，如实注存疑不采）。
- **邻族注（不扩 scope）**：TriMLC 本地线 test/tui/components.test.ts L8 同裸 import 形+包缺=批A 全量门 tui-components 既有谱系 fail 五族之一（10-03 批A 卷在档）。TriMLC 非本单两仓，候批B/维护窗 lane 认领防漏。

## 五、窗位建议（死线 10-05 EOD 可达性判定）

- **今夜 10-04 晚窗**（与 F-3 TriMLC addJob 修窗不同仓不冲突）：活 3（MMC 1 行）+活 4（MMC registry 3 文件）；活 2 若 CTO 圈宿主对表面可并入。
- **10-05 白窗**：活 1（TriRLC 收敛，CTO 解冻令前置）——段1-TriRLC 主体唯一闭合路径；活 6 复扫随批。
- 挂窗族（活 5）不排死线内（§三口径）。
- **判定预填：死线可达=条件三点**——①今夜机械两件落+②10-05 收敛窗开（CTO 令）+③挂窗族豁免口径对表；CTO 不裁收敛窗则段1-TriRLC 面如实报死线风险（冻结条款在先）。

## 六、勘误自领（假读数家族一笔）

本勘早轮 `grep -P`（Git Bash 无 -P 支持静默空输出）得 TriRLC「0 残留」假零——git grep 交叉核对抓回（真值本地线 466/origin 线 81 双态）。教训并入假读数家族：**工具能力断言先行，空输出≠零命中，双法交叉为锚**。

## 七、附：LG-058 走查窗状态（COO 附带问）

- 状态=**已毕非在途**：走查窗提前，卷=5275bb7e（10-04 01:44，四族零实锤+真链路全绿+reload 第四型保持链）；COS 大表 c6d39f7c9（03:20）录「LG-058 毕候验（STE 走查卷 5275bb7e+候 CEO 统一亲测终球）」。候验链在 COS/CEO 侧，本席无在途动作。

## 八、附：LG-060 复验义务接令（COO 20:1x 加令，并档）

- 10-05 真实施工对象=渲染链解冻复验链；本席名下=**独立复验义务（batch-14 形态）**：T5 渲染攒批抽验复跑的独立验段，旧名零回流=16 件 revert 案闭环判读；执行位=COS 值席车道复跑+本席独立复验+CTO 供源侧正名态前置断言门验收；死线 10-05 EOD。
- 与 LG-059 活 1（若同窗）共用法门（两仓 grep+渲染重放），排程不冲突。

## 九、使用依据

- 令源：BOD 组窗令件②（COO 18:2x 承转）+COO 20:1x LG-060 复验义务预置令
- 底册：trees/bod-pipeline-batch-01/lg059-legacy-path-sweep.md（8749f37f，修复前现势）；task-inventory-20260930.md LG-059 行（db31e5ad 10-04 08:09 组窗对表版）；coo-window-closeout-readout.md L24（258dafda）；CTO 技审裁决 lg059-060-techreview-verdict.md（WO-A~F 已毕+batch-14 本席 GREEN 卷在档）；TriRLC docs/registry/test-state（双线冻结条款）
- 现势实锚（本席 20:0x-20:11 独立复得）：TriRLC git status -sb（ahead8/behind5）/log --all -S/merge-base --is-ancestor/git grep 双线对比（466 vs 81）/ls-tree origin .github/agents/show origin tui import；TriMMC git log/status（对齐）/grep 40 处逐族/heartbeat+Dockerfile 逐行；三仓 package.json+node_modules+--all pickaxe
- 纪律注：git hands-off freeze 中（COO 整合广播前）——本卷落盘未提交，广播后随 fetch 对齐批 commit

## 十、施工毕态补记（COO 20:2x 开令，20:37 四环报毕）

- **活 3+活 4 毕**：TriMMC commit **581ea17**（4 files 4+/4- 正形：test 书纪 1 行+3 registry 正名 rename 96/97%）；目标测试 5/5 绿；ahead 1 未推（随广播批）。四环报→COO（msg 44a276bb）。
- 全量门现读数：625/596/28fail/1skip——28 fail=**单一根因族 token 门 401 前置拦截**（27×actual:401+期望 200/422/400 全先撞门；附锚 trimc:keys pull_denied 401 no cached config）=在册 R-HY 401 pull_denied 族本机镜像，既有环境态非代码回归；环境修复面候 SDE/CTO 车道。基准版本差：batch-14 476/473/0/3 系 HEAD=03fecb0 时点，其后四笔测试面 +161 行（476→625）。
- check 门 CHECK_EXIT=2 既有红 1 行：src/onboarding/session-initializer.ts(91,49) TS2345（paths.soul string|undefined→resolve；blame a95b9dfe 08-13；类型真源=agent-core `soul: ZodOptional` symlink 实时面）；修复面归 FSD/CTO。
- 施工事故自领：首笔 commit pathspec 只给新名路径→rename 配对断裂（3 create+193 insertions 异形态+旧名 staged D 两套并存）→status 矛盾信号抓回→amend 修正 581ea17 正形（三查过）。教训：**git commit -- pathspec 含 rename 必须同时含旧名+新名路径**，commit 后以 status D 残留为断言锚。
- 段1 剩余：活 2（TriRLC registry 正名，候 CTO 圈宿主对表面）+活 1（收敛，10-05 白窗候 CTO 解冻令）+活 6（复扫随①）。

## 十一、CTO 三裁笔录档+TriMMC 推平（COO 20:42 转达）

- **①解冻令 APPROVE+10-05 白窗**：本地 8 笔 CTO 逐笔勘明全真价值件零死基影；**主配方=merge（禁 reset --hard 硬对齐**，闸3 形仅适用死基影）；撞面预勘先导（以 8/5 现势预勘为准）；验收门=229 基准全量门绿+本地 8 笔零新增回归；**门绿前冻结读数纪律维持不外报**；收敛毕本地 push 推平归一。
- **②TriLC×3 正名=10-05 同窗并批 ≤3h**：TriRLC* 前缀 git mv+27 处为本地线基数；**动态基数条款**——origin f45885e 可能已部分处理，收敛后复扫实测为准；圈宿主对表面已解。
- **③段3-TriMMC 销项 COS 20:23 已准**（双锚=勘明卷；新需求走新项）。
- **TriMMC push 放行毕**：20:4x 双写推平（GitHub cf177f1..581ea17+sg bare 同达），本地=origin 归零。fetch 预检 origin/dev 无并行笔。
- 本席白窗活册：①收敛（merge 配方+预勘先导+229 门+8 笔零新增回归+读数纪律）→⑥复扫→②TriLC×3 正名并批（≤3h，复扫定基数）。

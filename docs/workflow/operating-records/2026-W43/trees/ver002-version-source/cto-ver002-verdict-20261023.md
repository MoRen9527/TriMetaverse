# CTO 勘定卷 · VER-20260806-002 TriRLC 版本双源分歧（CEO 01:30:54 提前令·即刻段）

- sourceOfTruth: 本卷（cto-ver002-verdict-20261023.md）
- syncMode: static（VER-002 勘定段产出·BOD 01:31 催办令·只读直跑零触运行态）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 施工席: CTO 小狄（勘定面·修复段候 pacing 界定顺序修）

## §一 双源现值与分叉溯源（三套版本语义实锚）

| 源 | 现值 | 性状 | git 溯源 |
| --- | --- | --- | --- |
| version.json | 1.0.0 | **手写冻结快照**·无生成机制（CI/scripts 零命中·非生成件） | 6cedc4b 08-05 钉死（修 healthz 旧值 bug 时手写）·近 2.5 月未动 |
| package.json | 0.9.0 | **活跃维护面** | 28f8696 09-26 wave3 正名随行走·常规开发流 |
| CI 打包命名 | calver（YYYY.M.D.N） | **独立第三制**·build-tricade.yml 自算（inputs.version 或 calver）·**两源皆不读** | TriMetaverse .github/workflows/build-tricade.yml L48-78 |

**分叉机理**：08-05 version.json 手写钉 1.0.0 为修 healthz 旧值·此后 package.json 随开发走 0.9.x——冻结快照 vs 活版本的账实分裂。BOD 01:28 活体实测（healthz 报 1.0.0）与代码链一致（§二①）。

## §二 三命中消费面逐一过（全谱·代码级）

1. **src/config/env.ts resolveVersion()（L125-150·config.version L178）**——链：`TRILC_VERSION env → version.json → 硬编码 '1.0.0'`。现役读数=1.0.0（version.json 在位）。**风险点：硬编码 fallback '1.0.0'=隐性第三真源**（version.json 删除后 daemon 面仍报 1.0.0·非真值）。
2. **src/update/update-check.ts readLocalVersion()（L60-92）**——链：`version.json(tricadeVersion 优先) → package.json → TRILC_VERSION env → '0.0.0'`。现役读数=1.0.0。**已原生支持 package.json 源**（链第二位·零新增路径）。
3. **src/server/app.ts L4446 /internal/v1/update/check（ACT2）**——消费面 2 的 HTTP 挂载（TriPilot 升级提示消费）·无独立读取实现。

**漂移根定性**：两处 resolver **各自独立实现且 fallback 链不一致**（硬编码 1.0.0 vs package.json→0.0.0）——任何单源化若只改一处即制造运行时分叉；此为结构性缺陷，非单点值错。

## §三 修复方向判定（勘定绿）

- **正解=package.json 唯一真源+version.json 废止**（较「转派生」更优）：
  - 依据①：CI 发布命名 calver 独立制·version.json 零下游生成依赖（§一勘定）。
  - 依据②：update-check.ts 原生支持 package.json 源——version.json 除名后自然落 0.9.0=真值。
  - 依据③：version.json 冻结快照性质（2.5 月未动）证明无存活消费语义。
- **修复面（最小）**：env.ts resolveVersion() 链改 `TRILC_VERSION env → package.json → '0.0.0'`（内联改·不动模块依赖方向；version.json git rm）——单文件 ~10 行。**结构性单函数化**（两 resolver 抽公共模块）挂候窗技术债（需勘 config↔update-check 依赖方向防环·非本件阻塞）。
- **重启语义声明（如实）**：源码面修复毕不触现役栈（8711/8713 零重启零触碰）；daemon 进程内 config.version 为启动时解析常量——**进程内旧读数（1.0.0）随下次自然重启刷新为 0.9.0**，过渡期错位=升级语义非缺陷；update/check 面（TriPilot 升级提示）行为随重启后 local version=0.9.0 相应变化（如实注·TriPilot 面候观察）。
- **门禁（修复段）**：tsc build 绿+env.ts 相关测试过+git rm 后 grep 全仓 version.json 消费零残留。

## §四 TriMLC/TriMMC 同型勘定

- **TriMLC**：=TriRLC 仓 M 面部署形态（同仓同码·trilc-channel DATA_DIR 形）——**一次修复双面自动同治**，无独立施工面。
- **TriMMC（独立仓·本席顺手勘）**：无 version.json·package.json 单源 0.1.0·src 零 version.json 消费——**无同型缺陷·干净**。

## §五 结论

勘定绿：分歧本体/漂移根/修复方向/修复面/门禁/同治面全清——**修复段可顺序执行（不需重启即修成立·pacing 照 BOD 01:31 界定）**。候令即修。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）

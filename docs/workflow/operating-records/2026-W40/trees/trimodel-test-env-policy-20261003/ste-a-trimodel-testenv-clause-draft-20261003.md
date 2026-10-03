# STE·A 件起草卷：TriModel 测试族执行环境条款（CAO 册条款草稿+README 测试节改写稿）

- sourceOfTruth: 本件（A 件起草卷；纯文本零执行面，不改任何配置/脚本/仓文件）
- syncMode: static（起草毕候 CAO 验；README 稿候 BOD 复核，节链接占位候 CTO B 件方案卷）
- lastSyncedAt: 2026-10-03T02:07:56Z（date 现查）
- 起草席: STE 小柯（m-ste）；令源=COO BOD #302（09:3x）：①CAO 册测试族条款草稿（铸句候 CAO 验）②TriModel 仓 README/贡献指南测试节改写草稿（候 CTO B 件方案卷落地后补节链接）；链=本起草卷→CAO 验→BOD 复核
- 批B③ 现势注：批B③ 归因卷已毕（b5c68843），动态复验候批A build，本件并行车道不叠载

## 一、令源三句与起草边界

CEO 令落档件三句（COO 转令口径）：

1. TriModel 全测试族（单测/集成/活体冒烟）执行环境=R 面；
2. M 面（本机 dev 机）禁跑 TriModel 测试族；
3. M 面定位=开发调试工作台（8713 GLM 直连通道保护）。

起草边界：本卷只铸条款句与 README 文案；铸句候 CAO 验，README 稿候 BOD 复核后由施工窗落仓，本席零仓动手。

## 二、①CAO 册条款草稿（铸句候 CAO 验）

**条款名（拟）：TriModel 测试族执行环境条款**

- **T1（适用域）**：本条款适用于 TriModel 仓全部测试族（工作副本含 M 面本机 dev 机与 R 面河源机；仓线拓扑权威立场不载于本条款——测试基线取线照 CTO R 面隔离方案卷拓扑注），包括：单元测试（`npm test`/`node --test` 形）、集成测试、活体冒烟（healthz/端到端探针类），以及为跑测试所必需的 build 置换与依赖重装动作。
- **T2（执行环境）**：TriModel 测试族执行位=R 面（河源机）；隔离形细则（目录/服务/端口/面隔离、施工序、验收锚）照 CTO〈R 面测试环境勘+隔离方案〉卷执行（`trees/rhy-test-env-isolation-20261003/cto-rhy-test-env-isolation-plan-20261003.md`，3532a1c5），本条款不重复载。
- **T3（M 面禁令）**：M 面（本机 dev 机）禁跑 TriModel 测试族。
- **T4（M 面定位）**：M 面 TriModel 工作副本定位=开发调试工作台——源码阅读、规格推演、单点断点调试可用；受保护对象=8713 GLM 直连通道（TriMLC 8713→本机 3333 keys 链）；凡涉 3333 起/停、build 产物置换、依赖重装类动作，一律不入 M 面（与测试族禁令同域）。
- **T5（只读例外）**：只读操作（git 读面/grep/源码阅读/边界盘点）不受本条款限制（与 2026-10-03 事故围栏「只读不受限」口径一致）。
- **T6（违例处置）**：误跑测试族=即报 BOD+CTO 双报，不自纠掩盖；违例按事故链处置并入复盘。

铸句注：T1-T6 为候验稿；条款名、编号体例、与 CAO 册既有条款族（如 D-29 Windows 计划任务无窗纪律形）的归并方式归 CAO 验面裁量，本席不坚持。

## 三、②README 测试节改写草稿（候 BOD 复核；仓文件零动手）

TriModel 仓无独立 CONTRIBUTING.md，贡献指引职能在 README（Scripts 表+Development 节）。改写点三处：

**改写点 1｜Scripts 表 `npm test` 行（现 L28）**，原：

```
| `npm test` | Run unit tests (Node.js native test runner) |
```

改为：

```
| `npm test` | Run unit tests (Node.js native test runner)。**执行环境=R 面（河源机）；M 面（本地 dev 机）禁跑测试族**——见下方「测试执行环境」节 |
```

**改写点 2｜Development 节后新增小节（插现 L90 CI 行之后）**：

```markdown
### 测试执行环境（2026-10-03 立）

- **TriModel 测试族（单测/集成/活体冒烟）一律在 R 面（河源机）执行**；M 面（本地 dev 机）
  为开发调试工作台，**禁跑测试族**（保护 8713 GLM 直连通道：TriMLC 8713 → 本机 3333 keys 链）。
- M 面允许：源码阅读、规格推演、单点断点调试；只读操作不受限。
- 涉 3333 起/停、build 产物置换、依赖重装的动作与测试族禁令同域，不入 M 面。
- R 面执行指引：CTO〈R 面测试环境勘+隔离方案〉（TriMetaverse `docs/workflow/operating-records/2026-W40/trees/rhy-test-env-isolation-20261003/cto-rhy-test-env-isolation-plan-20261003.md`）——目录/端口/施工序以该卷为准。
- 条款正身=CAO 册〈TriModel 测试族执行环境条款〉（TriCompany 治理面）；本节为工程侧摘要，铸句冲突以册条款为准。
```

**改写点 3（可选）｜Deployment (sg) 节首行域注（现 L104 前）**：

```
> 注：测试族执行环境=R 面（河源机），非 sg 部署面——本节仅涉部署验证，勿混测。
```

（防「sg=测试位」误读；去留候 BOD 复核裁。）

施工注：README 属 TriModel 仓文件，落窗建议=候 BOD 复核通过后与 CTO B 件方案卷（R 面执行指引）**同窗施工**，避免两窗两改+占位链接悬空；本席零仓动手 ✓。

## 四、背景与依据（铸句事实锚）

1. **事故链**：2026-10-03 凌晨 STE 复验中 PS 5.1 `Remove-Item -Recurse` 穿透 junction/symlink 灭 M 面 TriModel 本地仓（含 .git；sg bare 克隆恢复 161d0ca；T7 bak 族真损）——M 面仓副本操作风险面已实证（ste-maint34-verification-readout.md §二）。
2. **通道保护对象**：8713 GLM 直连通道=TriMLC 8713→本机 3333 keys 链（活体存续中，dist 文件面缺=重启即失败，围栏中）；M 面测试族若涉 3333 起停/置换即威胁该链。
3. **R 面权威位**：TriModel 运行权威位=河源（api-token.env 权威值面在 R-HY；401 修复窗「本机对齐权威」方向先例）。
4. README 现势锚位：L21-31 Scripts 表／L85-90 Development 节／L102-107 Deployment (sg) 节；无 CONTRIBUTING.md。

## 五、候验/候办清单

| # | 件 | 去向 |
| --- | --- | --- |
| 1 | T1-T6 铸句 | CAO 验（改铸权归 CAO） |
| 2 | README 三处改写稿 | BOD 复核→候 CTO B 件方案卷同窗施工（占位链接待补） |
| 3 | Deployment 节域注（可选） | BOD 复核裁去留 |
| 4 | 条款生效前 M 面历史测试跑痕是否需追溯声明 | 候 CAO 裁 |

## 六、使用依据

- COO BOD #302 起草令（09:3x）；令源链=CEO 令
- 事实锚：ste-maint34-verification-readout.md §二（事故专节）；BOD #297 围栏口径（只读不受限）；fsd-401-fix-completion-readout-20261003.md（R-HY 权威值面先例）；cto-p1-versionbase-verdict-20261003.md（3333 单向门态）；TriModel README.md 现势（只读实勘）

## 七、补记（COO 验收判据对表修订 2026-10-03 10:2x）

COO 收讫随办预告 CAO 验收判据，本卷对表自校并修订三处（T1/T2/README 改写点 2）：

| CAO 验收判据预告 | 对表 |
| --- | --- |
| 铸句合规 | T1-T6 规范句形 ✓ |
| 号位顺延 | 编号体例归 CAO 裁已声明（§二铸句注）✓ |
| 两草稿一致性+引用方向防双真源 | **补强**：README 改写点 2 增「条款正身=CAO 册，冲突以册为准」权威方向句；T2 增 CTO B 件卷细则指针（本条款不重复载）——引用方向=README→CAO 册（权威）、README/条款→CTO 卷（施工细则），三层单向无环 ✓ |
| README 节候 CTO B 件卷落地对表更实 | B 件卷已在库（3532a1c5），占位链接换实路径 ✓ |

修订记录：①T1 去「权威位=sg bare」钉位——仓线拓扑权属另案，CTO 卷拓扑注=github 线为 R-HY 生产行为可比基线，条款不载仓线权威立场（防与 CTO 卷双真源）；②T2 增 CTO 卷指针；③README 改写点 2 增两行。B 件卷一致性实读对表：硬边界五条（目录/服务/端口/面/GLM 稳态）与 T4「3333 起停/置换禁入 M 面」同域兼容无冲突 ✓；CTO 卷 B 件③验收锚已点名 STE 复验位（生产服务面零变化+硬边界五条逐条自查），本席候施工单到场。

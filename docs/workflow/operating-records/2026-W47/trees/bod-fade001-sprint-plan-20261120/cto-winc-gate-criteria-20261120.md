# CTO 窗 C-2 装载段开窗判据卷（判据先立·毕报对表过门·活体触窗门禁正身）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·窗 C-2 开窗判据正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COO §二十窗 C 两段统排（台账 671·3a84346be8·C-1 已派 FSD·C-2 装载段候本席裁开窗判据）
- 判据性质: 门禁前置（清晰门禁哲学）——C-1 毕报回后按本卷逐项对表=开窗裁决输入；全绿→本席放行令；任一红→FREEZE 候补段

## §一 · C-2 开窗判据（G1-G4·毕报对表硬项）

**G1 · FSD C-1 毕报前置硬项（五项全锚）**：
1. A1 替换面全量清单=30 处对表实锚+全库 grep 零残留 `node:sqlite` import（零遗漏实锚）；
2. better-sqlite3 依赖落装双实锚：TriMMC package.json dependencies 在位+**sg 面 node_modules better-sqlite3 在位**（native module 须 sg 面落装——npm install 执行面与平台绑定如实承录·本机装≠sg 可用）；
3. build 全绿：sg 面 `tsc -p tsconfig.json` 零错+`node --check dist` 族或等价烟测（毕报承录 rc 面）；
4. **engines 现查核断言毕**（COO C-1 派工承录项）：22.5 数字现查核（Node release notes 实锚）——**附 A1 形勘定面**：better-sqlite3 自身 engines 声明读数（其 package.json）+TriMMC 码面 18 兼容性勘定（除 node:sqlite 外零其他 22 系 API 依赖实锚 grep 面）——此读数定 **engines 终形裁定**（见 §二）；
5. 旧 dist 备份锚实锚：A1 build 替换前旧 dist 备份位承录（路径+文件数/大小旁证）——回滚锚可执行性硬前置（§四）。

**G2 · 开窗时点判据（三锚）**：
1. TriMMC cron 零冲突：jobCount=0 复验实锚在档→restart 对 cron 面零影响 ✓（随时窗可开）；
2. 值席窗 duty 班组对 8712 实时依赖面勘定（sg 席组作业中面——COO 统排窗选点·避免席组作业中段）；
3. TriRMC 面零触确认：TriRMC=河源 8710 口独立（窗 A 定谳 spawn 链向实锚）→C-2 restart 零触 TriRMC 面 ✓（结构性成立·非时点依赖）。

**G3 · 验收门（C-2 完工判据=六探）**：
| # | 探 | 过门判据 |
|---|---|---|
| 1 | unit is-active+MainPID | active+新 pid 实锚（restart 后 MainPID 更替旁证） |
| 2 | LISTEN 面 | 127.0.0.1:8712 在位 |
| 3 | healthz 业务面（公开 /healthz·勘正后基准） | 200 ok:true service=trimc |
| 4 | fail-closed 面 | 无 token /internal/v1/healthz=401 |
| 5 | **store 功能值面探针**（A1 核心验证） | 新 dist store 真走 better-sqlite3+功能正常——探针配方=FSD C-1 毕报承带（本席对表执行·零值面回显照 D-46） |
| 6 | mc_link 观察面 | TriMLC 侧 degraded 随 restart 后自愈与否如实录（token 值匹配面落判窗顺带观察·非过门硬项=观察项） |

**G4 · 回滚锚硬前置（活体触窗铁门）**：C-2 开窗前回滚锚两形在位可执行——①git revert C-1 笔（或 dist 备份回填）②unit 回旧 dist 备份位——回滚演练面零要求但**锚实锚性须毕报承录**（备份位存在+恢复命令形在卷）——「有回滚才动活体」原则；止损形=探③⑤任一红→立即回滚锚执行+止损毕报（COO 承录形采认·回滚毕=窗 C 冻结候再勘·零二次硬试）。

## §二 · engines 终形裁定框架（随 G1-4 读数落判·A1 债清真判据）

- 若 A1 后 TriMMC 码面 18 兼容全绿（G1-4 零其他 22 系 API）+better-sqlite3 engines 含 18 域→**engines 回落精确形**（≥18 系·sg v18.20.8 现役合规在役）=**债真清**（COO「C-2 毕=债清」对表成立形）；
- 若码面尚存其他 22 系 API 依赖→engines 维持 >=22.5.0+**方案三 B 项（sg node 22 LTS 大窗）回位候排**=债半清（A1 解 store 坑但 sg 面仍违 engines）——毕报如实承录候选清单一并带面；
- 回落施工=一行 patch（C-2 同窗或后窗顺手件·零新窗）。

## §三 · 开窗裁决形（C-1 毕报回后本席动作）

毕报对表 G1 五项→全绿+G2 时点锚→本席 **C-2 放行令**（开窗时点随 COO 统排）；任一红→**FREEZE 候补段**（缺项补齐重对表·零带病开窗）。放行令随卷承录=COO 派值席窗执行形（本席零代执照 D-27 v4/D-15）。

## §四 · 使用依据

COO §二十统排令信面（台账 671·3a84346be8·15:46+8）+三方案卷 §三 A1 正身（71a04f08f）+窗 B 复验追认卷（4683aa9b6·cron 零冲突实锚+六探基准形+端点勘正基准）+窗 A 定谳卷（787c43576·TriRMC 面零触结构性实锚）+TriMMC engines 勘正笔（b2852cf·22.5 存疑注承录）+门禁前置哲学（清晰门禁先立后过）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T07:48:56Z（+8=2026-11-20 15:48:56·date 现查原值·D-47 正形）

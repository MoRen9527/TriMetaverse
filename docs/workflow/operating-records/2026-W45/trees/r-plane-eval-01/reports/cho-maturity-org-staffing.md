# 成熟度评估卷·组织与人力面（r-plane-eval-01）

- 席位：r-duty-cho（CHO·小源）｜认领域：组织与人力面（R 面岗位配置与产品成熟度匹配度+班组协作/收口治理面）
- 时点：2026-11-04T05:41:54Z（13:41:54 CST·date 现查·写前跑）
- 方法：只读勘察（TriRLC/TriPilot 仓面+产品文档面）+ 本树运行实证观察（本席全程在场）——零写仓面/配置，现役 8710/443/8791 零碰 ✓

## 一、证据链（带锚·均为本席实读读数）

| # | 证据 | 锚 |
|---|---|---|
| E1 | TriRLC v0.9.0，bins=`trirlc`+`trilc`（新旧名双 alias，兼容面照旧） | `/srv/fleet/TriRLC/package.json` |
| E2 | README「Planned modules」七件（runtime/local-node/task-runtime/planner/toolbus/context-adapter/wallet-upgrade）**全部已在 src/ 实装**，且 src/ 实装面远超清单（daemon/cron/heartbeat/mcp/skills/sync/session-store/company/letter-store/mirror/tray/tools/server 等 30+ 目录）——README 滞后于实现 | `/srv/fleet/TriRLC/src/` 实测 vs `README.md` |
| E3 | 产品四件套骨架在位（PROJECT/REQUIREMENTS/ROADMAP/STATE），但 STATE/ROADMAP 为桩文（「本文件用于后续补齐」） | `/srv/fleet/TriRLC/docs/product/STATE.md`、`ROADMAP.md` |
| E4 | TriPilot v0.0.13，CLI bin=`tripilot` 在位，src/cli+extension+chat+mcp 模块齐，测试矩阵全（unit/integration/e2e:extension/coverage），copilot-direct 通道自标 experimental | `/srv/fleet/TriPilot/package.json`、`README.md`、`bin/` |
| E5 | R 面 13 席 2026-10-16（W42-002 窗）部署起席，2026-11-04 巡场问安全席在岗确认；本评估=起席后首次全席动员演练 | 董事会巡场令 2026-10-16+本树运行实录 |
| E6 | 本树协作治理运行实证：claims.md 直写→值席汇写制修正闭环（D-45 款4 教训同场内化）；收口三断言 checkpoint 设计；跨会话消息呈报协议；毕报两段式（文件落盘+毕报回签分离） | `claims.md` canonical+值席 13:40 收讫广播 |
| E7 | 宿主 agent 类型面结构变动：ProductManager（产品域执行层）新增可用；DeploymentEngineer 退役（SDE senior 面仍在） | R 面宿主 agent 类型清单 2026-11-04 现势 |

## 二、匹配度评估（核心组织判断）

**判断：R 面 staffing 结构领先于产品阶段约一个量级，属「组织面先行」形态；阶段合理性成立，但岗责密度不均已实证，长期需动态启用制对冲。**

1. **产品阶段定位（证据→结论）**：TriRLC 0.9.x=实现面厚/产品文档面薄（E2 实现 30+ 模块 vs E3 STATE/ROADMAP 桩文），处于「能力堆齐、产品叙事未收口」的建设后期；TriPilot 0.0.x+experimental 通道=早期迭代期（E4）。两产品合计判定：**建设期（TriRLC 后段/TriPilot 前段）**。
2. **13 席配置 vs 该阶段的匹配**：13 席全 C-level 9+执行层 4 结构，系建设期产品的「超配治理演练」形态。匹配度判定=**结构性合理、密度性超配**——合理性在于：TriCompany 实验的商业模式本身以治理运行反哺组织制度，R 面班组即 TriRLC/TriPilot 的真实负载与验收者（组织面即产品面的第一用户），staffing 先行有商业逻辑支撑；超配在于：今日实证轻域席与重域席落卷时长显著不均（8 席 13:34-13:38 快速落卷 vs fsd/sde 13:39 落盘候签）——常驻全席制下低密度域席位存在空转面。
3. **协作/收口治理面成熟度**：本树单场评估已跑通「认领→汇写→分席落卷→毕报回签→值席并卷→三断言收口」全链（E6），且出现一次规程缺陷（并发直写）**同场内**完成修正内化——治理面成熟度判定=**可用且自愈（迭代闭环实证）**，这是 R 面最成熟的一面。
4. **文档-实现漂移的组织风险**：E2+E3 漂移事实直接冲击接手性与培训传导（新人按 README 认知会低估实装面、按 STATE/ROADMAP 拿不到阶段目标）——此系组织知识传导面风险（与 rdt 域培训线交叉），本席按交接治理视角列风险，补齐排期归 CTO/产品域，不越域代决。

## 三、岗位面结构变动台账（我域登记）

- ProductManager（产品域执行层）类型**新增可用**——现为「类型可用、席位未启用」态；如启用须走岗位启用程序（JD+源侧定义+五件套链验收，CHO 收口），禁非正式增席。
- DeploymentEngineer **退役**（SeniorDeploymentEngineer 保留）——退役留台账，sde 域职责承接面无缺口（SDE 在岗实证）。

## 四、认领表完整性巡检读数（佐收口断言①）

- 值席 canonical 05:39Z 读数=12/13（缺 STE 认领）；13:40 广播同读数。本席终检读数将于毕报前复跑一次随毕报呈值席。

## 五、组织面成熟度定级（四档：桩/可用/成熟/自愈进化）

| 维度 | 定级 | 依据 |
|---|---|---|
| 岗位配置 vs 产品阶段匹配 | **可用（结构性合理·密度性超配）** | 本卷二.2 |
| 班组协作与收口治理 | **自愈进化** | 本卷二.3（缺陷同场内化实证） |
| 组织知识传导（文档-组织面） | **可用偏桩** | 本卷二.4（漂移风险在册） |
| 岗位启用/退役程序面 | **可用（程序在册·新类型待走链）** | 本卷三 |

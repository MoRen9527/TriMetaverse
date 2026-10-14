# dsh（deepseek harness）R 面服务域装设·架构方案稿

- sourceOfTruth: 本稿（docs/execution/dsh-rplane-harness-design-20261014.md）
- syncMode: static（单稿候批·批复后修订留痕）
- lastSyncedAt: 2026-10-14T08:09:56Z（date 现查·写前跑·修订窗 v3·真源对照）
- 令源: CEO 2026-10-14 15:36 裁差距清单③④方向；CEO 15:58 批+三修正；**CEO 16:04 令=dsh 资料以 github.com/deepseek-ai/deepseek-harness 真源为准·「agent 不要渲染错了」**
- 批令: CEO 15:58 批（①批+三修正·②窗排照稿两窗走·其他全批）·v3 照 16:04 真源令对照修正
- 呈批链: 本席→COS→CEO（差①新链·不经 BOD 中转）
- 差③④对锚: 差③=统一盘 R 面输入腿缺；差④=河源 SSH 通道 BOD 直操待退役归 R 面班组

## 〇、结论先行

- **总形态：并存分层**——TriRMC（8710）保持机制层（cron/信箱/账本），dsh 作执行层 harness 新装河源；非替代非包装。
- **班组形态：照 m-duty 同构降配**——一期值席 **r-duty-cos** 1 席起步（持河源 SSH·差④承接位·R 面班组首席=值席 COS·与 M 面 m-duty-cos 同构位型）·施工力候二期；**13 席岗位资产经转译层（五件套→dsh preset 正形）发布铺全员上岗路**（§2.3 v3 照真源重写）。
- **R 面经营域：R 面 COO 独立设位·与 M 面 COO 分域**（§2.4）——输入腿经 R 面 COO 域内收口对接 M 面统一盘。
- **输入腿：树协议为主+HTTP 便道**——r-duty-cos tick 回流·经 R 面 COO 收口入 COO 四面统一盘（差③销）。
- **通道权界：三级分权**——r-duty-cos 日常持有/BOD 保留紧急面/M 面不中转。
- **双 harness 治理：分域原则+接口合同先立后装+preview 期版本钉住**（v3 增——dsh 系 developer preview·兼容性破坏变更官方明示）。
- **分两窗走**：窗1=合同（含转译层规格+信箱适配件规格）+最小班组+两差销；窗2=施工力+观测对齐+密钥治理。

## 一、dsh 与 TriRMC 关系与装法（审点①）

### 1.1 关系定性：并存分层（机制层/执行层分离）

现役本地域拓扑对称参照：TriMLC（8713·机制层）+ agent-core（执行层 harness）——两 daemon 两职责，互不替代。

R 面对称落位：

| 层 | 河源现役 | dsh 装设后 |
| --- | --- | --- |
| 机制层 | TriRMC 8710（cron 3 job·mcLedger·healthz） | **职责零变更**——不因 dsh 装设动机制域 |
| 执行层 | （无——R 面现无班组 harness） | dsh 新装：R 面班组席位运行底座 |

- **不替代**：TriRMC 不是被替代对象（它本就不做 harness）。
- **不包装**：dsh 不是 TriRMC 的插件/子进程——独立装设·独立生命周期·经适配件与 TriRMC 协作（见 §五-2 新识别施工件）。
- **同宿主盲区注**：dsh 与 TriRMC 同宿主（河源机）——宿主级故障时双盲；跨面探针对补位属另一卡·本稿不重复处置。

### 1.2 装法（v3 照真源落细）

- **装设位**：河源机 `/srv/fleet/` 同构位（D-24 机位断言先勘后装）。
- **运行前置**：dsh 官方运行形态=`npx @deepseek-ai/dsh web`（Node.js 必需）——**装设前置勘验=河源机 Node.js 版本在 dsh 支持面**（版本要求候装设烟测前对官方 package.json engines 字段核）。
- **Web UI 绑定面纪律**：dsh Web UI 默认绑 `127.0.0.1:3080`（本地回环·官方默认形态）——**保持本地绑定禁改 0.0.0.0**（不暴露公网·与 §四 通道权界正交互补：跨面访问经 SSH 隧道由 r-duty-cos 本机操作或 M 面特批窗·不开公网直连）。
- **启动纪律**：应用启动只走 dsh profiles（**package bins/argv 逃逸禁止**——官方安全形态照守）。
- **模型配置**：TriModel 配置层原生承接——key-cache 键族已含 DEEPSEEK API_KEY+BASE_URL（TriCode key-cache.ts:446-464 现役）；MMC 域四级梯第四级常量保底=deepseek-v4-pro 已在域。dsh 模型卡照 glm-5.3 三端配置点位先例接 TriModel 卡面·选型登记入 TriCompany 技术选型登记（本席 owner 职责）。
- **装设烟测门**：TriRMC 信箱一来一回（8710 mailbox 投递→dsh 值席收→回执→TriRMC 记账·经适配件）+ healthz 三读数（ok/mcLedger/cron）前后对表零扰动。

## 二、dsh 班组形态（审点②）

### 2.1 与 m-duty 班组同构性：同构降配·非全量复制

- **同构项**：值席制（D-27 执行层标准）·信箱接令·树协议落卷·毕报制。
- **降配项**：一期**不复制 13 席编制**——最小形态起步（岗位资产转译发布另见 §2.3）：

| 席位 | 一期（窗1） | 二期（窗2） |
| --- | --- | --- |
| 值席（**r-duty-cos**·R 面班组首席=值席 COS） | **1 席**——河源 SSH 日常持有+窗况/施工力读数回流+信箱接令 | 轮值制（≥2 席对轮·消单点） |
| 施工力 | 0（河源施工暂走 BOD 特批 SSH 或候二期） | 候裁增编（FSD/STE 型 1-2 席·视 R 面施工量） |

- **席位正名（CEO 修正一）**：通信名 **`r-duty-cos`**——R 面班组首席=值席 COS·**与 M 面 m-duty-cos 同构位型**。
- **席位定义面**：R 面班组走轻量五件套（source-agents/ 下新增 r-plane-duty/——五要素齐备；**入报到制适用域**·上线即到 CAO 处报到）。

### 2.3 13 席岗位资产渲染发布·dsh 正形（CEO 修正二+16:04 真源令·v3 重写）

> **CEO「agent 不要渲染错了」关切位**——dsh 的 agent 角色组合**不是** claude code 的 `.claude/agents/` 文件拷贝形态。真源验证（gh API 直读·2026-10-14·本席独立复验一致）：dsh 正形=**agent-preset 包+persona 包+system-prompt 组装瀑布**。转译层是施工关键件。

**dsh 正形三件（真源）**：

| dsh 资产 | 真源位 | 承接的源侧资产 |
| --- | --- | --- |
| **agent-preset 包** | packages/preset/agent-preset（Cordis YAML·声明 Agent 子插件组合：id/plugins/name·多 preset session 选一·定义 eager 加载） | 五件套的「岗位+工具面」——席位插件组合声明 |
| **persona 包** | packages/preset/persona（人格包） | soul 覆盖层+身份气质面 |
| **system-prompt 组装** | system-prompt/assemble waterfall（agent-lifecycle.md） | agent-body/session-body/contract 正文→system prompt 组装链 |

**转译层规格（窗1 合同序1 关键件）**：

1. **映射表逐项铸**：源侧五件套（contract/frontmatter/agent-body/session-body/compass）→ dsh 三件资产的字段级映射（哪段进 preset YAML 的 plugins 声明·哪段进 persona·哪段进 system-prompt waterfall 哪一层）——**逐项铸表·禁凭直觉渲染**（CEO 令正解）；
2. **运营语义差异入合同**：dsh preset「编辑只影响随后创建的 Agent」——席位定义热更新**不 retrofit 活体会话**（与 claude code 行为差异·值席纪律条：改席位定义后需重建会话才生效·防「改了没生效」误判）；
3. **compass 承接位候深勘**：compass（罗盘/导航面）在 dsh 侧的对应注入形态（资源注入/文档挂载/上下文种子）——候窗1 施工前对文档站 deepseek-harness.github.io 深勘后钉死映射；
4. **发布管线归属**：转译器=新施工件（源侧资产→dsh 资产单向转换·真源仍=`TriCompany/source-agents/` 侧·dsh 侧=发布拷贝纪律照旧「禁人工编辑·修订走源侧合同」）；R 面发布位清单与命名规范并入窗1 合同。

### 2.4 R 面经营域设位·R 面 COO 独立（CEO 修正三）

- **R 面有自己的 COO·不要跟 M 面搞混**——R 面 COO 独立设位·与 M 面 COO **分域**。
- **输入腿链形**：r-duty-cos 生产读数→**R 面 COO 域内收口**→对接 M 面四面统一盘。
- 设位时点：窗1 内随 r-duty-cos 上线后候裁（走 CHO 岗位流程·本稿只立架构位型）。

## 三、输入腿回流接口形态（审点③·差③销位）

### 3.1 谁报/经谁/频率

| 要素 | 定案建议 |
| --- | --- |
| 谁报 | **r-duty-cos**——读数生产位 |
| 经谁 | **树协议为主**（TriRMC 侧落卷→git 同步→M 面可读·现役先例=夜航01/周平面迁移）；**HTTP 直推为急件便道**（退役时点条款照 TriRLC 转发壳先例）；**域内收口=R 面 COO** |
| 频率 | 定时 tick 30min+事件驱动即时报 |
| 对接面 | COO 四面统一盘 R 面列（跨面对接位=R 面 COO）——读数最小集：窗况/施工力/daemon 健康/在办一行 |

### 3.2 接口合同要点

- 读数报文格式固定（树卷模板+D-47 落款纪律）；机位断言头必带（D-24）；
- **dsh schedule 四工具原生对接**（真源：schedule_create/list/update/delete·五字段 cron+显式 IANA 时区原生·standard/cordis/ptc preset 提供）——tick 定时任务用 dsh schedule 原生面（**时区显式 Asia/Shanghai·禁依赖宿主默认时区**）；
- 断链豁免：河源→GitHub 通道故障 tick 缺拍不告警（恢复补报）；连续 4 tick 缺拍（2h）升级 M 面值席信箱。

## 四、河源通道权界与权限分级（审点④·差④销位）

### 4.1 三级分权

| 主体 | 权界 |
| --- | --- |
| **r-duty-cos（R 面班组首席·值席 COS）** | 河源 SSH **日常持有者**——日常操作/施工/daemon 运维/TriRMC 观测；差④正解承接位 |
| **BOD** | 直操**退役**（差④销）——保留**紧急回滚协调权**：紧急窗特批直操或令 r-duty-cos 执行·操作留痕入账 |
| **M 面（本机/sg）** | **不经 SSH 中转河源操作**——跨面交互走树协议/信箱 |

### 4.2 root 与密钥治理（候 CHO/安全会签项·窗2 落）

- 现状：root 单账号·密钥 BOD 持有（R-HY-key.pem）。
- 建议：①窗1 过渡期=现密钥 BOD 暂持+特批代开·窗2=r-duty-cos 换发专用操作密钥（独立 key pair·权限面候裁：独立操作账号+受限 sudo 优于 root 直用）②root 密钥轮换与持有权移交走安全审查（CAO+CHO 两会签）③退役即清点：旧密钥 access 面撤销候裁。
- **dsh ssh 包原生支持注**（真源：SSH execution providers）——r-duty-cos 的河源操作面可经 dsh ssh 包承载（持久终端 terminal 包配套）——工具面在 harness 域内·权限边界仍照本节三级分权（工具承载≠权限放宽）。

## 五、与 agent-core 双 harness 并存的架构治理（审点⑤）

1. **分域原则**：本地域（M 面）=agent-core（claude 2.1.88 移植版·现役不动）；R 面服务域=dsh（deepseek 系）。判据=该面模型可用性/成本/合规——**不搞全公司单一 harness**。
2. **接口合同先立后装·v3 照 dsh 原生面对表重写**：

| 同构项 | v2 假定 | v3 真源对表 | 施工形态 |
| --- | --- | --- | --- |
| ①信箱协议 | dsh 有等价面 | **dsh 无 TriRMC mailbox 协议原生面** | **新施工件：TriRMC mailbox↔dsh 适配件**（8710 mailbox 投递→dsh 侧入口转译·回执反向——烟测门主体·窗1 合同规格件） |
| ②树协议读写 | 通用文件面 | dsh fs 包+terminal 包可承载 | git 操作经 terminal/fs 面·落卷纪律入值席手册 |
| ③cron 等价面 | session-only 对齐 | **dsh schedule 四工具原生**（五字段 cron+IANA 时区） | 原生用·时区显式 Asia/Shanghai |
| ④生命周期面 | 复活名址避坑 | **dsh durable sessions 原生**（packages/session 持久会话） | **session-only 丢失问题 dsh 侧原生解**——启用持久会话+复活名址注册仍保留（跨 harness 一致纪律） |
| ⑤跨席消息面 | SendMessage 等价 | dsh subagent+acp 包（acp=automation-only） | 值席跨席消息经适配件树协议；acp 自动化入口候深勘（窗2 观测/自动化域） |

3. **模型配置统一面**：两会话面模型键位统一走 TriModel 卡面——dsh 不自建模型配置旁路；deepseek 模型卡照 presets 真源字段入卡。
4. **版本钉住与升级治理（v3 增·preview 期硬条款）**：
   - dsh 现状=**developer preview·公共 API pre-stable·官方明示「THERE WILL BE COMPATIBILITY-BREAKING CHANGES」**（README 原文·本席独立复验）；
   - **版本钉住：装设钉 exact 版本号（禁 ^/~ 浮动·package.json/lock 全钉）**；
   - 升级走独立窗门=**同构清单逐项回归**（每次升级跑 §五-2 表五项+烟测门·全过才换版）；
   - 两 harness 升级窗互斥（防同窗双 harness 同变）；选型登记与版本现势归本席维护；
   - dsh 版本跟进节奏候裁：preview 期**不追新**（钉安全版本·候 stable 或关键修复才动）——跟进窗口建议月度评估一次（并入本席技术趋势雷达线·不新增固定成本项）。
5. **preset 选型建议（v3 增）**：dsh 预置四 preset（standard/cordis/ptc/minimal·agent-preset-registry 持默认选择）——一期 r-duty-cos 轻职场景建议 **minimal 起步**（基础面够用+减攻击面·schedule 不在 minimal 须并 ptc/standard 候验——preset 能力矩阵窗1 合同核死后钉）·standard 候施工力增编再升。
6. **观测对齐**：dsh 班组活性纳入探针族——窗2 落（照卡④同款条款）。

## 六、窗排建议与门禁（候 COO 排程）

### 窗1（两差销窗·建议首批）

| 序 | 件 | 门禁 |
| --- | --- | --- |
| 1 | 接口合同定稿（§五-2 同构清单+**信箱适配件规格**+**转译层映射表**+§3.2 报文模板+preset 能力矩阵核死） | 本席+R 面 COO 会签 |
| 2 | dsh 装设河源（Node 前置勘验+exact 版本钉住+Web UI 本地绑定）+TriModel deepseek 卡接入 | 装设烟测门（信箱一来一回经适配件+healthz 对表） |
| 3 | r-duty-cos 上线报到（轻量五件套+转译发布+报到制） | 同构清单逐项过+CAO 处报到回执 |
| 4 | 输入腿首回流 | 首份 tick 读数卷 M 面可读+COO 统一盘 R 面列出数 |
| 5 | 通道权界迁移（差④） | BOD 直操退役时点入账+旧密钥 access 面处置候裁项挂账 |

### 窗2（增编与治理窗·候窗1 毕读数）

- 施工力增编候裁·观测对齐（探针 dim）·密钥治理落地·轮值制消单点·R 面 COO 设位编制候裁·acp 自动化域深勘。

### 回滚姿态

- dsh 侧独立于 TriRMC 机制域——回滚=停 dsh 班组+TriRMC 零扰动（healthz 对表证）；
- 通道回滚=河源操作临返 BOD 直操（差④暂重开·入账留痕·候 r-duty-cos 恢复再迁）；
- 模型侧回滚=deepseek 卡停用返四级梯常量保底（零新码）；
- dsh 版本回滚=exact pin 回退上一钉住版（lock 文件在·可重现装设）。

## 七、风险表（v3 增 1 项）

| 风险 | 定级 | 缓解 |
| --- | --- | --- |
| **dsh preview 期破坏性变更**（官方明示） | **中高** | exact 版本钉住+升级门=同构清单回归+不追新节奏（月度评估）——三重对冲 |
| 转译层渲染错误（CEO 关切位·agent 渲染错=席位行为面走样） | 中 | 逐项映射表铸死+烟测门含席位行为抽验（r-duty-cos 上线首日报到+读数回流即行为验证）+真源侧单源发布禁 dsh 侧手改 |
| TriRMC mailbox 适配件（新施工件·原稿未识别） | 中 | 窗1 合同先行规格化+烟测门主体·规模可控（协议面窄：投递/回执/记账三操作） |
| deepseek 模型能力边界 vs 值席工作适配度 | 中 | 一期轻职+窗1 读数验证后再议增编 |
| dsh 席位单点（一期 1 席+SSH 持有单点） | 中 | 窗2 轮值制；窗1 期内 BOD 紧急面兜底 |
| 跨网通道依赖（河源→GitHub） | 低 | 现役通道复用·断链豁免+缺拍升级 |
| 同宿主盲区（dsh 与 TriRMC 同冻结） | 低 | l2 已有 dev 探 R 面向·跨面探针对候立卡统筹 |
| 双 harness 接口漂移 | 中 | 同构清单验收门+升级窗互斥+选型登记现势维护 |

## 八、批注段（修订留痕）

- **v1**（b55a0eddd·15:41）：初稿五审点。
- **v2**（a12296f2c·15:59）：CEO 15:58 批三修正照改（r-duty-cos 正名/§2.3 渲染发布/§2.4 R 面 COO 独立）。
- **v3**（本轮·16:09）：CEO 16:04 真源令对照修正——
  - 真源验证：gh API 直读 deepseek-ai/deepseek-harness（本席独立复验·与 BOD 16:07 转述一致）——基本盘（MIT/249k stars/10-09 推送）+README preview 原文+packages/preset 三包（agent-preset/persona/agent-preset-registry）实锚；
  - §2.3 重写：渲染发布正形=agent-preset 包+persona 包+system-prompt waterfall——**转译层规格=窗1 合同关键件**（逐项映射表铸死·compass 承接位候深勘）；
  - §1.2 落细：Node.js 前置勘验+Web UI 127.0.0.1 绑定禁改公网+bins/argv 逃逸禁止；
  - §五-2 同构清单五项照 dsh 原生面对表重写——**新识别施工件：TriRMC mailbox↔dsh 适配件**（v2 假定 dsh 自带等价面·真源证实无——信箱协议是 TriCompany 私有面）+schedule 四工具原生+durable sessions 原生解 session-only+ssh 包工具承载注；
  - §五-4 版本钉住硬条款（preview 期）+§五-5 preset 选型建议（minimal 起步）；
  - §七 风险表+2（preview 破坏变更中高/转译层渲染错误中·适配件中）。
- **过程注记（如实）**：v2 首轮 Edit 曾遭 COO 侧推链 v4 对齐步 reset --hard 打掉（COO 16:08 认领·v5 已根治改 merge --ff-only）——v2 经全量 Write 重放锁笔；v3 同款全量 Write+写后即 commit。

## 使用依据

- CEO 15:36 裁批+15:58 批令三修正+16:04 真源令（BOD 16:07:42 转达资料包）
- **真源验证（本席独立）**：gh API repos/deepseek-ai/deepseek-harness（repo 元数据/README/packages 列表·2026-10-14）——与 BOD 转述一致
- TriModel 配置层现势：key-cache.ts:446-464 DEEPSEEK 键族·MMC 四级梯常量 deepseek-v4-pro·presets 现役 glm-5.3-flash（本席摸底卷）
- 河源活体读数：8710 healthz 三采（本日勘测卷）
- 现役先例族：夜航01/周平面迁移（树协议跨面）·TriRLC 转发壳退役条款·席位复活名址缺口先例·报到制联审方案
- 分权制正身：CLAUDE.md 跨机操作路由·D-24/D-27/D-39/M-004

—— 落款（date 现查）: 2026-10-14 16:09:56 +0800（CTO 小狄·v3 真源对照修订窗）

# CTO 技术裁卷·TriModel 拓扑 BS 方向裁配套（C3 域勘基准分形+灾备验证频度+债①+分诊两项·2026-11-21）

- sourceOfTruth: 本卷（trees/trimodel-dual-model-supply-20261118/cto-trimodel-topology-tech-ruling-20261121.md·技术裁量正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: BS 方向裁卷 52bddc46c（带条件支持切本机·C1-C5）+COS 转呈（08:45:25+08·三项归我域+两项分诊）
- 范围: 技术实现与验收判据面（BS 明文：技术实施与验收判据归 CTO·切换窗定谳归 COO）

## §一 · C3 双模型域勘基准分形修订形态（裁）

**基准=「同域供给」**（BS 已定·技术面落形）——四域供给形分形表（域勘序 2 的技术输入）：

| 域 | 供给实例位 | 消费方 | 凭据形 | 灾备路径 | 双模型可达判据 |
|---|---|---|---|---|---|
| M 面本地域（本机） | TriModel 本机 3333（**已建成在役**） | TriMLC 8713 | card v4 本机域 AES-256-GCM（7c31 源·本机根 .env） | R-HY https://8.155.54.79（保留·验证频度见 §二） | 同卡双 provider_entry（deepseek+glm·schema v4 多条目现成）+策略 default |
| 服务域（sg） | sg TriModel（域内供给照旧） | TriMMC 8712 | sg 域内加密（mmc face card 现役形） | 照各域既有 | 同形 |
| R 面（河源） | 域内 TriModel（角色由集中主供给降灾备） | TriRMC 8710 / R 面消费 | 域内加密 | M 面本地域反指（互备） | 候 R 面域勘 |
| 本机 R 面腿（TriRLC 8711） | **指向本机 3333=同域原则自然结果（已自然发生·实证）** | TriRLC 自身 | 本机 3333 auth 面（face token/配置勘定） | 同域无跨机面 | 同卡双 entry 可达 |

- **序 2 补法**：不回溯补写旧稿（旧主形「四域共享 sg 单实例」基于旧事实）——**按现势重出域勘卷**：以上表为技术形基准+变更记录段（旧主形→同域基准的分形修订说明·含 M2 切流事实订正）。产出=COO 主刀拆树序 2 运营面+本表技术面，**切换窗毕后出**（避免与切换窗并行漂移·切换后现势即定稿基线）。
- **TriRLC 实证锚**：fsd 卷 42041801b 附「rlc face pull 探入 denied（00:36:57 TriRLC 周期 pull 触及本机新 3333·安全门正常拦）」——**TriRLC 已自然指向本机 3333**=同域原则实证落地，残余仅 auth 面配置（非拓扑决策）。
- **凭据面成本对表**（BS C3 末句要求）：域内形凭据成本**不超**集中形——域内=key 本机域加密零跨机分发（每域自带加密域）；集中形=M2 后河源持 key（跨机面已存在）。如实报：域内形成本更低。

## §二 · C5② R-HY 灾备验证频度/形态（裁）

- **形态**：单发只读探针（GET `/v1/config/cards/mlc?view=pull` 或 `/healthz`·rc+card_present 对表·零生成零成本·不换指不重启）——灾备可达性证明=「能 pull 到」，**不验 key 值有效性**（灾备 key 面独立·值面主比禁做·D-46）；
- **频度三锚**：①**切换窗毕首验**（基线锚·C5 双锚之一）②**随周平面巡检周验一次**（复用既有巡检节拍·零新增调度成本）③**异动触发重验**——R-HY 侧变更/网络面变更/**self-signed leaf（NODE_EXTRA_CA_CERTS）到期前 30 日必验**（证书到期=灾备静默腐烂风险·此条为硬触发）。
- **纪律**：探针红面→如实报 COO+本席（灾备腐烂=风险升级信号·不静默）；自动 cadence 落位候 COO 排（或并入既有巡检脚本）。
- **灾备卡文档化**（BS C1「文档化灾备路径」）：切换窗毕产出灾备卡 = 路径（URL/CA 面）+回滚序（双值复原+重启）+本验证判据+key 面说明——落树。

## §三 · 债① effectiveModel 技术裁（BS §七候裁件·裁=是·必同窗解）

- **answer**：债①**影响**切本机后 P2 值面——`server.ts L92` card-default 注册面只读 mmc 单卡，mlc 卡 default_model 不进 pull 投影（apply 后 pull 仍 env-default）。**不修则切了端点 P2 仍不可达**。
- **裁**：主案 D（`GET /v1/config/cards/{face}?view=pull` 的 default_model 投影按 URL face 解析该卡·config-cards.ts 面·face 上下文在请求内）+备案 B（env `TRIMODEL_DEFAULT_FACE` 实例级·若模型调用链非 pull 面也需）·方案 C（优先级链）否。**与切换窗四件套同窗一次改面**（COO 已定捆排）。
- **P2 可达性全链**：端点切本机（四件套）+债① D 修形+key 上游有效（已验双绿：.env sha16=7c310041469d7d76=P1 逐位·api.deepseek.com/models rc=200 在册 deepseek-flash/v4-pro）——三件齐 P2 可达。
- **切换窗不阻塞于双键化**：四件套严格序（L11 漏切即 401 事故族·四件套回退序成熟有先例）即可开工；双键化/链配置化=根治候选候铸件族统排窗偿（本席 ef9e700ee「前置建议」在此精化——非切换窗阻塞件）。

## §四 · 分诊两项（归属裁）

1. **TriRLC 供给形未预设** → **属我域（技术实现形）**·裁=同域原则自然结果（指向本机 3333·§一表已列）——非新拓扑决策；残余=auth 面配置勘定（face token/配置位·小件候域勘序 2 或切换窗后）。实证锚=TriRLC 已在周期 pull 本机 3333（探入 denied 是 auth 门非拓扑错）。
2. **GLM 凭据按域配给形态** → **技术实现面我域**（商业目标「每域双模型可达零节流」已由 BS 定）·裁=**同卡多 provider_entry 形**（TriModel card schema v4 原生支持 provider_entries 多条目·每域自加密域内 GLM entry+策略规则）——双模型域内互备技术形现成·零架构新增；glm entry 施工候域勘序 2 细化（本机 mlc 卡加 GLM entry=一处施工·凭据源候勘）。

## §五 · 使用依据

BS 方向裁卷 52bddc46c §三/§四C1-C5/§六/§七+COS 转呈（08:45:25+08）+本席裁卷 ef9e700ee/815b7fa63+fsd 卷 42041801b（读数承）+M2 令 §一二四+10-03 卷 cto-p1-versionbase-verdict（四件套/回退序/单键双链）+notice-174 双模型线+TriModel card schema v4（provider_entries 多条目·fsd 第一拍卷 §三.1）+D-15/D-24/D-27 v4/D-46/D-47/D-76。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

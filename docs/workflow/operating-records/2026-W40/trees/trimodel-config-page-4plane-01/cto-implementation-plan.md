# CTO 实施方案件·LG-058 TASK-TRIMODEL-CONFIG-PAGE-4PLANE-01（四域面信息卡重构·技术面）

- sourceOfTruth: 本件（CTO 实施方案正身；任务书正身=08b588e0 wt/board 位；D-15 枢纽方案留痕）
- syncMode: working（候 CPO 功能项清单对表→三方一致→BOD/CEO 合审）
- lastSyncedAt: 2026-09-28 04:2x +0800（date 现查 04:05 hook 链；正常工时承接，接令回执 69cbaa7c→m-coo）
- 承接边界确认：本单=规划+方案，**不动现役生产配置**（R-HY card/本机 card/sg 三断链照旧走 M2 候修清单）；daemon 本体架构不动；TriModel 服务端 API 面扩展=架构级改动，**实施前过本席门审**（任务书 §四）

## §0 技术判断总览

- **卡面引擎已单套在役，四卡=泛化非新建**：TriModel 卡面（trimmc-card v4：三实体模型/逐条 AES-256-GCM 域锚加密/pending-applied-failed 状态机/ADMIN token fail-closed）系成熟能力——四卡方案=把单卡引擎**参数化出 face 维度**（mmc/mlc/rmc/rlc），不是写四份复制。改动重心在 TriModel 服务端卡面泛化+四 daemon 接入，daemon 本体架构零动。
- **降级梯三层机制已有两块现成件**：TriRLC/TriMLC 的 key-cache（拉取+本地重加密落盘+15 分钟刷新+24h 过期）=tier1/tier2 机制本体（R-HY 问7 先例在役）；tier3（env/出厂默认）=现行 fallback 链。方案=机制泛化为 config-cache（keys+default_model+policy 摘要），四域面同构铺开。
- **最大设计张力=MMC/RMC 双源层级**：服务域二 daemon 现行 fleet config-sync 三级解析（env TRIMC_DEFAULT_MODEL > applied bundle > 常量兜底）与 TriModel 卡面拉取是**两个独立配置源**——本方案裁：TriModel 卡拉取插队 tier1，fleet bundle 顺延 tier2，显式层级合并防双 tier2 竞争；**该层级语义候 CPO 对表确认**（默认模型指谁=产品决策，技术面不自裁，与 fallback 收敛裁定同纪律）。
- **分期交付**：P0 卡面泛化+本地域接入（MLC/RLC）→ P1 服务域接入（MMC/RMC）+降级梯全域同构+R-HY 纠正迁移 → P2 UI 左选项卡重构（CPO IA 为准）+CLI 完整矩阵。每期独立可回滚，独立门审。

## §一 现势实勘底图（2026-09-28 04:0x 本席 HEAD 实勘，方案全部立于此）

### 1.1 TriModel 服务端配置 API 面现状（routes.ts 全族）

| 端点 | 方法 | 鉴权 | 语义 |
|---|---|---|---|
| /v1/config/keys | GET | Bearer TRIMODEL_API_TOKEN | 分发面（客户端拉键直连 provider，明文回显=设计本性，本席 09-27 已裁定性） |
| /v1/config/keys/refresh | POST | admin | 键缓存强制刷新 |
| /v1/config/keys/secure | PUT | — | **RETIRED（410）**，LG-035 S5 |
| /v1/config/keys/secure/status | GET | Bearer | 掩码尾 4 只读 |
| /v1/config/policy | GET/PUT | GET 无鉴权 loopback/PUT 同 | 策略文档读改 |
| /v1/config/trimmc-card | GET/PUT | **ADMIN token fail-closed（未配=503）** | 卡读（UI 面掩码）/写（save⇒status 重置 pending） |
| /v1/config/trimmc-card/status | PUT | admin | 应用方回写 applied\|failed |
| /v1/config/trimmc-card/apply | POST | admin | 卡面应用（server 内） |
| /v1/config/runtime-info | GET | 无鉴权只读（loopback 先例） | UI 数据源 |
| /v1/config/claude-fallback/* | 7 端点族 | 读无鉴权/写 admin fail-closed | 连接配置页（templates/preview/backups/rollback/inject-key/restore+sg 转发） |

配置生效语义基线（§五 任务书给定+本席 09-27 实勘吻合）：评估序=窗口命中→卡 default_model→env 出厂默认（policy.ts L33/L61-62）；getter 现读盘**零重启**（server.ts L92）——四域面对齐的设计基线，**本方案不改此语义**。

### 1.2 卡面引擎现状（trimmc-card.ts，CARD_VERSION=4）

- 存储：TriModel 仓根 `trimmc-card.json`（gitignored）；schema v4 三实体（provider_entries/model_sets/rules/strategies）+active_strategy_id+default_model 派生缓存。
- 加密：逐条目 AES-256-GCM，**域锚四元组**（hostname:username:platform:arch）——at-rest 永远密文；明文仅在 GET 响应内解密存在（UI 不消费 key 字段）。
- 状态机：save⇒pending → apply → 应用方回写 applied|failed+COS write-back 通道。
- 门：卡面全族 ADMIN token fail-closed（TRIMODEL_ADMIN_TOKEN 未配=503，**门不豁免哲学落地先例**）。

### 1.3 四域面 daemon 现行配置消费矩阵（实勘）

| 域面 | 仓/CLI 正名（旧别名过渡期） | 现役部署位 | 现行配置源 | 现接 TriModel 面 | CLI 配置命令现状 |
|---|---|---|---|---|---|
| **TriMMC**（M·服务域） | TriMMC 仓，`trimmc`（trimc） | sg 8710 | fleet config-sync 三级：env TRIMC_DEFAULT_MODEL > applied bundle model.defaultModel > 常量兜底（deepseek-v4-pro） | **未接**（sg card 缺失=M2 候修⑤断链之一） | `config-sync add/list/run/log/status/update/remove`（fleet 维，非卡面） |
| **TriMLC**（M·本地域） | TriMLC 仓，`trimlc`（trilc） | 本机 8713 | key-cache（拉 /v1/config/keys）+env | keys 分发面 ✓ | `model` 命令在役；无 config 族 |
| **TriRMC**（R·服务域） | TriRMC 仓，`trirmc`（trimc） | 河源服务位 | 同 TriMMC（fleet config-sync 三级，结构与 MMC 同构） | **未接** | 同 TriMMC（config-sync 族） |
| **TriRLC**（R·本地域） | TriRLC 仓，`trirlc`（trilc） | 河源 8711+本机 8711 | key-cache（拉 /v1/config/keys，S2 AES+PBKDF2 域指纹落盘，15min 刷新 stagger，24h 过期）+env | keys 分发面 ✓（**降级梯先例本体**，R-HY 问7） | 无 config 族 |

### 1.4 UI 现状（ui/index.html 1396 行单页）

- 现有栏位：「本机（TriMLC 域）」（L99）+「TriMMC（sg）」（L124）+【TriMMC 信息】主卡（L140-142，S1 主位/S2 唯一交互/S4 只写待应用/D7 脏追踪）+连接配置区（claude-fallback 族）。
- **错误形态坐实**：TriMMC 卡现被用作 R-HY 本地配置的承载（R-HY TriModel 3333 实例的 trimmc-card.json 装着 R-HY 本地域配置）——CEO 纠偏对象。
- D13 注记（L248）：「本机策略折叠区已删除（CEO 裁）：本页单语义化=TriMMC 卡纯度；**本机直生效语义归位 TriRLC 卡四卡规划**」——四卡方向 UI 侧早有预留，本方案兑现该预留。

## §二 要素① 四卡后端支撑

### 2.1 域面注册设计：静态 face registry（MVP 不做动态注册协议）

- TriModel 服务端新增常量 face registry：`FACES = { mmc, mlc, rmc, rlc }`，每 face 元组={face_id, 显示名, 卡文件名 `<face>-card.json`, 部署位语义（两面×两域矩阵）}。
- **注册=声明式非协议式**：四 face 系已知静态集合，daemon 侧「注册」=拉取时呈 face_id+凭据，server 校验 face 在册+凭据绑定→记录拉取台账。不引入动态注册协议（四卡规模下零收益，复杂度负资产）。
- **拉取台账（face pull ledger）**：每 face 记录 {last_pull_at, last_pull_from(loopback/remote), last_pull_result, applied_state}——UI 卡徽章（未配置/待应用/已应用/拉取失败）的数据源，产品级可见性。台账落 `TRIMODEL_DATA_DIR/face-ledger.json`（读盘零重启语义同族）。

### 2.2 配置拉取 API 面：单引擎参数化泛化

- **端点设计（荐）**：泛化族 `/v1/config/cards/{face}`（GET 拉取/PUT 写/admin）+`/v1/config/cards/{face}/status`（应用方回写）+`/v1/config/cards/{face}/apply`。现行 `/v1/config/trimmc-card*` 全族**保留为 face=mmc 别名过渡**（正名过渡期纪律同族：旧名单行弃用引导不阻塞，M3 版本移除）——UI/既有消费方零破坏。
- **GET 拉取响应两档**：`?view=managed`（UI 面：掩码+状态+台账，现行语义）与 `?view=pull`（daemon 面：server 域内解密后的**受控载荷**=provider_entries 键值+default_model+策略摘要，见 §三传输语义）。
- **face 校验守卫**：{face} 不在册=404（防枚举语义与 GET 面现役口径一致）；在册但凭据不绑定=401 fail-closed。
- 实现量级：卡面引擎（加密/校验/状态机/apply）**零改**，新增=face 参数路由+registry 常量+pull 视图+台账，预计服务端新增 ≤400 行+测试族。**架构级（API 面扩展）——实施前过本席门审，本方案件即门审材料底稿。**

### 2.3 鉴权边界：双层制沿用，face 绑定新增

- **写面（UI/COS）**：TRIMODEL_ADMIN_TOKEN fail-closed——现行卡面语义原样，四卡同门。
- **拉取面（daemon）**：TRIMODEL_API_TOKEN（与 keys GET 同族）+**face 绑定**：server 侧 `TRIMODEL_FACE_TOKENS`（可选 env，格式 `mmc=<tok>,mlc=<tok>...`）；未配置绑定=api-token 通配（过渡态）；已配置=精确绑定（收敛态）。**分阶段不一次到位**：P0 通配（改动最小），P1 收敛绑定（与 M2 应用层 token 候修同族节奏）。
- **与 M2 候修联动对表**：①读面细门——M2 候修清单的读面收紧项与本方案 pull 视图鉴权同窗落（本方案不抢 M2 范围，标注依赖）；②M2 候修⑤ sg 断链三合一修复路径（键空值/dotenv dist/card 缺失，机内 PUT 零重启）——本方案**保留机内 PUT 零重启语义**（getter 读盘零重启不动），修复路径兼容性成立；③本方案不改 keys 分发面现状（分发收敛挂账 M2+ 代理化路线，本席 09-27 裁定原样）。

## §三 要素② 域锚四元组约束下的跨机拉取设计

### 3.1 不变量三条（第一约束展开）

1. **at-rest 密文的域=创建它的机器+用户**：卡文件里每条 `api_key_encrypted` 只能被其创建域（hostname:username:platform:arch）解开——跨机/跨用户互解不开（R-HY 治愈案+sg 断链双实证，任务书 §五）。
2. **禁跨机复制 card 文件**：任何「把 A 机 trimmc-card.json 拷到 B 机」的路径=必产 undecryptable 废卡，设计上堵死——**拉取流永不传输 at-rest 密文文件，只传输 server 解密后的受控载荷**。
3. **消费机的持久化密文必须在消费机域内创建**：daemon 拿到拉取载荷后落盘（last-known-good cache）时用**本机 key-encryptor**（PBKDF2 域指纹，key-cache S2 机制现成）重加密——R-HY 域内重加密治愈案=本不变量的在役先例。

### 3.2 拉取→本地重加密时序（四域面同构）

```
daemon(TriX)                    TriModel(同机 3333)
   │  GET /v1/config/cards/{face}?view=pull
   │  Authorization: Bearer <api-token|face-token>
   │──────────────────────────────→│ server 域内解密卡条目（同机同用户=可解）
   │                               │ 校验 face 凭据绑定+落拉取台账
   │←──────200 受控载荷(JSON)──────│ （明文仅存于响应生命周期，不落 server 盘明文）
   │ 本机 key-encryptor 重加密→config-cache 落盘（tier2 载体）
   │ 立即生效读数（生效模型/键来源归因）→ 回写 /status applied|failed（既有通道泛化）
```

### 3.3 失败语义：fail-closed 落梯不悬空

- 拉取失败（网络/401/404/超时）→ **不阻塞本地运行**（R-HY 问7 口径）→ 落 tier2 last-known-good；
- cache 解密失败（域不匹配——被跨机复制过的 cache）→ **视为无效丢弃**，直落 tier3（env/出厂默认）+告警读数——**绝不静默用他域密文猜**；
- 应用方回写 failed 时附归因码（pull_denied/decrypt_failed/apply_rejected），UI 徽章与台账同显。

### 3.4 与 M2 候修② 成文对表

「跨机/跨用户身份域核验」已入 M2 门审清单（本席 09-27 裁定）——本方案 §3.2 时序+§3.3 失败语义=该核验条款在四卡拉取流的**设计级落地**；实施执行单的验收读数含「域核验步」固定项（与部署验收读数固定项候选合流）。

## §四 要素③ 降级梯四域面铺开

### 4.1 三层梯同构定义

| 层 | 语义 | 载体 | 生效延迟 |
|---|---|---|---|
| tier1 拉取 | TriModel 卡面 pull（face 凭据） | 周期刷新（15min stagger 沿 key-cache 节奏）+CLI 手动 `config pull` | 秒级 |
| tier2 最近已知好 | 本机 config-cache（域内重加密落盘） | key-cache S2 机制泛化：keys+default_model+策略摘要+{fetchedAt, expiresAt=24h} | 立即（本地盘） |
| tier3 本地直连 | env 键/出厂默认模型 | env 链（域内 .env 收敛后形态，M2 候修边界收敛不回退） | 立即 |

判梯序=tier1 可用→tier1；tier1 败→tier2 未过期→tier2；tier2 败/过期/域不匹配→tier3+告警。**四域面同构=同判梯序+同归因码+同台账形态，仅 face 参数与部署位不同。**

### 4.2 先例对表（不重造轮子声明）

- **TriRLC key-cache=全梯机制本体**：拉取+域内重加密+24h 过期+15min 刷新已全部在役——tier1/2=该机制从「keys 单维」泛化为「config 多维」，代码量级小笔；TriMLC 同构 fork 同步泛化。
- **R-HY 问7 服务域梯=失败语义先例**：拉取失败不阻塞本地运行——§4.1 判梯序直接沿用其口径。
- **TriMMC/TriRMC 服务域**：tier3=现行 fleet config-sync 兜底链原样保留（零回归面），tier1 新增 TriModel 卡拉取，tier2=新增 config-cache。

### 4.3 MMC/RMC 双源层级合并裁（本方案最大张力点，显式呈裁）

- 现状：服务域二 daemon 的 default_model 解析=fleet config-sync 三级（env>bundle>常量）。新增 TriModel 卡拉取后若不裁层级，将出现「TriModel 卡」与「fleet bundle」两个 tier2 竞争——双真源=配置漂移温床。
- **本席裁**：合并后解析序=`env 显式覆盖（最高，运维逃生门）> TriModel 卡面（tier1，活配置）> fleet bundle（tier2，基座配置）> 常量兜底（tier3）`。理由：卡面=活配置管理面（网页/CLI 可改可审计），bundle=基座分发面（随 TriCompany 仓走，低频）——活配置压基座、显式压活配置，语义单调无环。
- **候 CPO 对表项**：默认模型语义指谁（卡面 default_model vs bundle model.defaultModel 的产品定位差异）——与 fallback 常量收敛裁定（CPO 对表前置）同窗对表，**技术面不独行**。env 逃生门保持最高=运维兜底不因产品层改动失效。

### 4.4 四域面×三层×配置维全矩阵

| 域面 | tier1 拉取位 | tier2 cache 位 | tier3 | keys | default_model | 策略面（卡三实体） |
|---|---|---|---|---|---|---|
| TriMLC | 本机 TriModel 3333 | 本机 config-cache | env | ✓ | ✓ | ✓（mlc 卡） |
| TriRLC | 同机 TriModel 3333（河源/本机各自实例） | 同机 config-cache | env | ✓ | ✓ | ✓（rlc 卡） |
| TriMMC | sg TriModel 3333 | sg config-cache | env>bundle>常量（现行链尾段保留） | ✓ | ✓ | ✓（mmc 卡，回归本职） |
| TriRMC | 河源 TriModel 3333 | 河源 config-cache | 同上同构 | ✓ | ✓ | ✓（rmc 卡） |

## §五 要素④ CLI 配置命令升级方案

### 5.1 目标命令族（四 daemon 同构，正名 bin 挂族、旧别名随过渡期策略）

| 命令 | 语义 | 对应 API |
|---|---|---|
| `config pull` | 手动拉取+即时生效+回写 status+输出生效读数（来源归因：card/cache/env） | GET cards/{face}?view=pull + PUT status |
| `config show` | 显示现效配置+**来源归因**（哪层梯在生效）+台账末次拉取读数 | 本地解析链（零网络） |
| `config verify` | 连通+凭据+解密健康三查（拉取试跑不落盘），回滚前/部署后体检用 | GET 试拉 |
| `config cache show/clear` | last-known-good 检视/清除（清=强制回 tier1/tier3 验证梯语义） | 本地盘 |

- TriMLC 现役 `model` 命令保留（`trimlc model` 既有语义），config 族为**并列新增**不替换；TriMMC/RMC 现役 `config-sync` 族（fleet 维）**原样保留**——卡面 config 族与 fleet 维命名空间分离，不混义。
- CLI 走 HTTP 端点与网页同源（TriRLC cli.ts 同端点先例，非旁路）——**能力对齐=同一 API 面两个消费端**，网页能改的 CLI 能查能拉，CLI 能拉的网页能看到台账。

### 5.2 能力矩阵（功能项↔API↔CLI 三方对表底表，候 CPO 功能项清单对表）

| 配置功能项（技术面命名，候 CPO 对表） | 网页（四卡 UI） | API | CLI | 四 daemon 覆盖 |
|---|---|---|---|---|
| 查看现效配置+来源归因 | 卡详情面板 | GET view=managed + 台账 | `config show` | 4/4 |
| 修改条目/模型集/规则/策略 | 卡编辑（S4 只写待应用） | PUT cards/{face} | —（写面归网页/管理面，CLI 不开写——最小授权面） | 网页 4 卡 |
| 应用+结果回写 | 应用按钮+徽章 | apply+PUT status | `config pull`（拉取即生效语义） | 4/4 |
| 手动拉取/生效 | 刷新按钮 | GET view=pull | `config pull` | 4/4 |
| 健康体检 | 徽章+台账 | GET 试拉 | `config verify` | 4/4 |
| 降级梯检视 | 台账面板 | ledger | `config cache show` | 4/4 |

**差异显式标注（候对表）**：①CLI 不开卡写面（写=网页/管理 token 面）——若 CPO 功能项要求 CLI 写，需增 face 写凭据面，授权链另议；②「应用」语义双通道（网页 apply=server 内应用；daemon pull=拉取即本地生效+回写）——两通道同 status 台账，CPO 对表 UI 呈现口径。

## §六 要素⑤ 现存错误用途纠正路径（R-HY 本地配置迁出 TriMMC 卡）

### 6.1 错误形态定性

R-HY TriModel 3333 实例的 `trimmc-card.json` 现承载 R-HY **本地域**（TriRLC）配置——卡 face 语义错位（mmc 卡装 rlc 域配置）。本机/sg 实例卡面与 R-HY 三断链照旧走 M2 候修清单，**本迁移不触生产写面**——本节为实施执行单的预研方案。

### 6.2 迁移方案（server 域内流转，零跨机复制）

1. **预检**：R-HY 机上读 trimmc-card.json→server 域内解密验证（同机同用户=可解；解不开=域已被破坏，先治愈后迁移）；snapshot 全卡 JSON 留档（迁移前锚点）。
2. **映射**：卡内条目按域归属分拣——本地域配置（R-HY TriRLC 消费的条目/策略）→ 新建 **rlc 卡**（`trirlc-card.json`，同引擎 pending 态写入）；真属 TriMMC 域的条目（若有）→ mmc 卡；无法归属条目→呈报不擅断。
3. **切换**：rlc 卡 apply→TriRLC `config pull` 实拉验证（生效读数+来源归因=card）→观察窗（≥1 个 key-cache 刷新周期）。
4. **回滚锚**：旧 trimmc-card.json **改名 `.bak-<ts>` 原位保留不删**（唯一性后缀纪律同族）+反向迁移脚本（bak→原名+回写 status）——回滚=一次 rename+一次 apply，分钟级。
5. **UI 侧**：R-HY 实例配置页的 TriMMC 卡呈现随卡面泛化（face 参数化）自然消解——网页按 face 渲染各自卡，错误挂载面不复存在。

### 6.3 验收锚（迁移执行单用）

- TriRLC on R-HY `config show` 来源归因=card（rlc 卡）；旧卡 bak 在位可回滚；mmc 卡在 R-HY 实例呈空白待配置态（本职语义）；全程零跨机文件复制（时序留痕）。

## §七 实施排程建议+依赖图

### 7.1 分期（每期独立门审+独立回滚，正常工时节奏）

| 期 | 内容 | 门 | 回滚 |
|---|---|---|---|
| **P0** 卡面泛化+本地域接入 | TriModel face registry+泛化端点族（trimmc-card 别名保留）+pull 视图+台账；TriMLC/TriRLC config-cache 泛化+CLI config 族 | 架构级门审（本席）+测试族（API 族+cache 泛化单测） | 泛化层为纯新增，别名保留=老路径原样，revert 单 commit |
| **P1** 服务域接入+全域降级梯+R-HY 纠正迁移 | MMC/RMC tier1 卡拉取+层级合并（§4.3 裁决落地）+face token 绑定收敛；§六迁移执行 | 同上+迁移预检报告审 | 层级合并 env 逃生门兜底；迁移 §6.2④ 回滚锚 |
| **P2** UI 重构+矩阵收尾 | 左选项卡+右侧单页（CPO IA 方案为准）；CLI/网页能力矩阵终对表 | UI 交付渲染验证门（LG-035 家族纪律：非作者手测+首启链冒烟+真 HTTP 链路案） | UI 独立 revert |

### 7.2 依赖图

```
CPO 产品规划件（功能项清单）
   └→ 三方对表（功能项↔API↔CLI，本件 §5.2 底表）→ BOD/CEO 合审 → 立执行单
        ├→ P0 TriModel 卡面泛化 ──→ 门审 ─→ MLC/RLC 接入 ─┐
        ├→ P1 MMC/RMC 接入（依赖 P0 泛化面）+ R-HY 迁移 ──┼→ P2 UI（依赖 CPO IA+P0 API 面）
        └→ M2 cutover（独立线）：读面细门/应用层 token/键分发收敛
             └─ 联动：pull 鉴权 P1 收敛与 M2 token 面同窗；§4.3 层级对表与 fallback 收敛 CPO 对表同窗
```

- **与 M2 的先后关系**：M2 执行单照旧推进不候本单；本单 P0 不依赖 M2（鉴权过渡态通配），P1 收敛项**候 M2 token 面定形后同窗**（防两次改鉴权）。
- **先边界后值纪律联动**：M2 候修的 dotenv 越仓界收敛应先于或独立于本单 tier3 依赖 env 的形态定稿——新 face 卡不继承越仓界读盘。

## §八 风险与缓解

| # | 风险 | 缓解 |
|---|---|---|
| R1 | 卡面泛化引入回归伤现役 trimmc-card 消费方 | 别名全保留+现役 GET/PUT 语义零改；测试族含既有卡面回归用例 |
| R2 | 双源层级（卡面/bundle）配置漂移 | §4.3 显式层级裁+env 逃生门+config show 来源归因（漂移可见） |
| R3 | 域锚跨机误用复发 | §三不变量+拉取流内建域核验+失败 fail-closed 落梯+域核验入验收固定项 |
| R4 | R-HY 迁移丢配置 | snapshot+bak 回滚锚+观察窗+分钟级反向回滚 |
| R5 | 拉取通道扩大明文键暴露面 | 受控载荷仅响应生命周期+loopback 同机传输+face 凭据；分发收敛维持 M2+ 代理化路线（本席 09-27 裁定原样） |
| R6 | 四 daemon 各写一套梯实现漂移 | 同构=机制单源（key-cache 泛化件共享设计，TriMLC/TriRLC 已同构 fork；MMC/RMC config-sync 结构同构）+四域面同判梯序+CLI 同命令族 |

## §九 门审预告（任务书 §四 命令面）

TriModel 服务端 API 面扩展=架构级改动——**实施执行单开工前过本席门审**，门审材料=执行单 diff+本件 §二/§三 设计符合性对表+测试族读数。daemon 侧接入（非架构级）走常规门审窗。

## 使用依据

任务书正身 08b588e0（§五 五条技术事实直接引用：域锚四元组/sg 断链三合一/评估序 policy.ts L33 L61-62+server.ts L92/R-HY 问7 梯先例/白皮书对表归 CPO 件）；本席 HEAD 实勘（2026-09-28 04:0x）：TriModel routes.ts/trimmc-card.ts/ui/index.html/TriRLC config/key-cache.ts+env.ts+cli.ts/TriMLC 同构面+cli.ts model 命令/TriMMC+TriRMC config-sync 族+default-model.ts 三级解析/四仓 package.json bin；本席既裁在卷（model-fallback-sweep-01 cto-triage-verdict.md：keys 分发面定性/域锚四元组裁 A/M2 候修清单）；COO 拆派令（04:05，接令回执 69cbaa7c）。

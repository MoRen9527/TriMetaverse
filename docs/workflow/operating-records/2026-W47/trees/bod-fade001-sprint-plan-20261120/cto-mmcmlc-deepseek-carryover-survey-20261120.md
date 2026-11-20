# CTO 勘定卷·MMC/MLC GLM 耗尽承接技术形·段一静态勘（LG-097 承接线·关键路径升级承·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-mmcmlc-deepseek-carryover-survey-20261120.md·勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令面承录: COO 台账 736（GLM 76% 越线判停·935 止损兑现·承接形关键路径升级=D7 复跑前置·fsd 候切两路）——本卷=段一静态勘（零窗依赖·源码读面零活体触）；**段二活体现探+切换施工=候 COO 派窗**（D-24 禁推定·执行=值席/fsd 本席零代执）
- 勘定对象: TriMLC（本机 8713·M 面本地域主控）+TriMMC（sg 8712·M 面服务域主控）GLM 轨→DeepSeek 轨承接技术形
- 勘定性质注: 源码面=本机仓副本静态读（TriMLC `/d/Code/ai/TriMLC`·TriMMC `/d/Code/ai/TriMMC`·TriModel `/d/Code/ai/TriModel`·triodel 经 node_modules 符号链接互证）；**sg 现役部署副本与 daemon 进程面=段二活体现探对表**（仓面↔部署面漂移可能如实注）

## §〇 · 核心定谳（一句话版）

**MMC/MLC 的模型供给链走 TriModel 统一配置层（face card pull 形）——切换单点=TriModel 配置面两张 card（mlc face+mmc face）·daemon 侧=热载拉取零重启（vs TriRMC 重启冷载形·同族不同形）·两 daemon 源码面零 GLM 硬编码（零改形）**——TriRMC 勘铸卷（41175a614）的「key 配置位三候选+重启冷载」形对 MMC/MLC **不适用**，本卷另立形。

## §一 · 供给链架构定谳（静态勘实锚链）

```
TriMLC(8711 语义位·本机) ──┐
                          ├─ key-cache 周期 pull ──→ TriModel 配置面 ──→ 上游 provider
TriMMC(sg 8712) ──────────┘   /v1/config/cards/{face}?view=pull      (card=JSON 文件)
```

- **daemon 侧 key-cache**（TriMLC `src/config/key-cache.ts` 819 行·TriMMC 同构 824 行）：face 身份随仓固定（TriMLC=`FACE_ID='mlc'`·TriMMC=`FACE_ID='mmc'`·`TRIMODEL_FACE_ID` env 覆写位·key-cache.ts L68/L72 实锚）；端点参数化=`TRIMODEL_API_URL` env；拉取=LG-058 config 多维卡面 pull（keys+default_model+strategy 三维·L2-4 注实锚）；
- **TriModel 配置面**（`/d/Code/ai/TriModel`）：card=JSON 文件（`faceCardPath(face)`·原子写 tmp+rename·config-cards.ts L332/L385 实锚）+face 台账（card-faces.ts·readFaceLedger/updateFaceLedger/appendFaceEvent）+模板面（cardTemplatesDir）；
- **env 注入闭环**：daemon 拉新后 `applyKeyCacheToEnvironment` 把 `default_model` 注入 `env.TRIMODEL_DEFAULT_MODEL`（TriMLC key-cache.ts L463 实锚）——配置→运行时的落地位；
- **TriModel 型号目录**（model-catalog.ts L11-14）：`deepseek-flash`/`deepseek-v4-pro`/`GLM-5.3-Flash`/`GLM-5.3`/TMV 五族在册——**CEO 定谳型号 deepseek-flash 目录现成**（㊿+948 承）。

## §二 · 载形定谳：热载（非重启冷载）

| 面 | 读数 | 锚 |
|---|---|---|
| 刷新周期 | `KEY_REFRESH_INTERVAL_S_DEFAULT=15*60`（15 分钟·server card `refresh_interval_s` 可覆写） | TriMLC key-cache.ts L212 |
| 缓存 TTL | `KEY_CACHE_TTL_MS=24h`；过期仍可用（TK-017-fix：TriModel 离线时 expired cache 作 fallback） | L211/L419 |
| 刷新通知 | `_refreshTimer`+`onKeyCacheUpdated` callback 注册面（缓存刷新即回调） | L219/L277 |
| env 落地 | applyKeyCacheToEnvironment 注入 TRIMODEL_DEFAULT_MODEL（刷新时更新） | L463 |

**定谳=热载**：TriModel card 改毕→daemon 侧 ≤15 分钟自动拉新生效（refresh_interval_s 现值=段二 card 值面读数）——**TriRMC 卷 §二「重启冷载保守形」不适用 MMC/MLC**；段二现探例外位=若活体发现启动时一次性读取面残留（如 spawn 链 env 快照时机），届时勘定补重启兜底位（§六）。

## §三 · 切换技术形（施工面三件·段二窗内定谳执行）

1. **TriModel 两 card 更新**（唯一施工主件）：`mlc` face card+`mmc` face card 各自 `keys`（DeepSeek key 载入）+`default_model=deepseek-flash`（CEO ㊿+948 定谳对表）+`strategy` 节——card API 面（PUT `/v1/config/cards/{face}` 或直接 card 文件面·段二按现役运维形定谳）；
2. **deepseek-flash 路由承载位**（段二定谳·静态面三实锚）：anthropic-proxy.ts L41 `matchModels: ['deepseek-flash', 'deepseek-v4-pro']`（Anthropic 兼容代理面**有**承载）·providers/deepseek.ts L11 `models: ['deepseek-v4-pro','deepseek-v4-flash']`（provider direct 面**无**该名·default 兜底=deepseek-v4-flash）·client.ts registry **无** `'deepseek-flash'` 条目（别名机制先例=deepseek-chat/reasoner→v4-flash 透明升级·L51-54）——**段二判读位：deepseek-flash 请求路由进哪链（anthropic-proxy 代理链 or provider direct 链）+上游真实 ID 映射**；施工候选=client.ts registry 补条目 or anthropic-proxy 映射已覆盖（源码读+一发真探定谳）；
3. **兜底常量裁点**（低风险如实注）：TriMMC key-cache 兜底常量=`deepseek-v4-pro`（TriMMC key-cache.ts L10 注实锚）vs CEO 定谳=deepseek-flash——default_model 从 card 拉到=兜底不触发·零行为差；兜底常量是否随定谳勘正=段二顺手窗裁点（TriMLC 兜底常量现值未勘=段二读数位）。

**GLM fallback 预埋注（有利面）**：client.ts L131 GLM 族 registry 条目 fallback=`providers.has('deepseek-anthropic') ? 'deepseek-v4-pro' : 'deepseek-v4-flash'`——GLM→DeepSeek 的 fallback 链在 TriModel registry 层已预埋（deepseek provider 在册即活）——GLM 耗尽感知/自动接管形=段二 strategy 面判读位（policy.ts）。

## §四 · 值面探针形（四探·段二窗内活体·D-46 合规）

| 探 | 面 | 合规形 |
|---|---|---|
| P1 key 指纹 | DeepSeek key 载入验证（两 card 各一） | sha 前 16 对表·零明文零落卷 |
| P2 default_model 值面 | card 值+daemon env 注入值双面=`deepseek-flash` 对表 | 非密值面可出 |
| P3 活体一发真探 | 最小请求真发（两 daemon 各一走真链路） | provider/model 值面回读+rc 面 |
| **P4 热载刷新读数（MMC/MLC 特有）** | cache `fetchedAt/expiresAt` 刷新时戳+`onKeyCacheUpdated` 触发读数 | ≤15min 生效锚·时戳现查粘贴 |

**完工判据=P1∧P2∧P3∧P4 四件齐**（healthz 零豁免·P4=热载形专属生效锚）。

## §五 · 段二活体现探清单（候 COO 派窗·D-24 禁推定）

1. TriModel 现役部署位两问：本机 3333 在役读数（TriMLC 默认 apiUrl=127.0.0.1:3333）+TriMMC(sg) `TRIMODEL_API_URL` 端点值面（sg 连 sg 本机 TriModel or 跨机指本机=现探定谳）；
2. 两 card 现值读数：GLM key 指纹+default_model 现值+strategy 现值+refresh_interval_s 现值；
3. deepseek-flash 路由链活体定谳（§三.2 三实锚的对表+一发真探）；
4. TriMLC 兜底常量现值读数（TriMMC=v4-pro 已实锚）；
5. GLM 耗尽感知/strategy 面：policy.ts fallback 链形+card strategy 节形——GLM 耗尽时自动接管 vs 手动切 card=段二判读（影响「耗尽前切」vs「耗尽后自动」的执行时机设计）；
6. sg 现役部署副本与本机仓副本的版本对表（仓面勘定结论→sg 部署面适用性断言·commit 差=漂移如实档）。

## §六 · 风险与回滚

- **回滚锚**：两 card 改前 JSON bak（文件面 bak·原子写先例）——回滚=恢复 card 原值+daemon 侧 ≤15min 拉回（P4 同探复验）·GLM key 保留 card 面不清除=双 provider 共存·**零不可逆**；
- **风险面**：①deepseek-flash 路由若段二定谳需 registry 补条目=TriModel 码面微改（新 commit+TriModel 侧重启窗——量级小·段二勘定后定）②热载生效窗 ≤15min 内双 model 并行瞬态（card 改毕到 daemon 拉新间·旧 GLM 请求仍走 GLM——GLM 已耗尽时=请求失败窗·可接受或 daemon 重启提速——段二定谳）③TriModel 本身单点（两 daemon 供给汇聚面）——TriModel 健康在役=段二探针前置项；
- **兜底位**：热载不生效→daemon 重启（冷载兜底·TriRLC 重启纪律族参照·段二勘定启动器位后才可执行）。

## §七 · 使用依据

COO 台账 736 判停知会+承接形关键路径升级（TC dev fc2c60817）；TriRMC 切 DeepSeek 勘铸卷 41175a614+范围钉 9b4c5386a（同族参照·本卷差异面另立形）；段一静态勘源码锚：TriMLC `src/config/env.ts`（trimodelApiUrl/env 文件候选链）+`src/config/key-cache.ts`（face=mlc/pull 形/15min/24h TTL/env 注入 L463）+TriMMC `src/config/env.ts`（defaultModel 三级解析）+`src/config/key-cache.ts`（face=mmc/兜底 v4-pro L10）+TriModel `src/api/config-cards.ts`（card JSON 文件/原子写/face API）+`src/client.ts`（registry/GLM fallback 预埋 L131/别名先例）+`src/anthropic-proxy.ts`（matchModels L41）+`src/providers/deepseek.ts`（models 清单 L11）+`src/model-catalog.ts`（五族在册）；TriMLC node_modules/trimodel 符号链接=/d/Code/ai/TriModel 互证；CEO 型号定谳 ㊿+948（deepseek-flash 统一）；D-24/D-27 v4/D-46/D-47/D-76 C 层（窗位归 COO）；LG-097 承接线候面挂账（本卷=勘定毕达·候派窗）。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕

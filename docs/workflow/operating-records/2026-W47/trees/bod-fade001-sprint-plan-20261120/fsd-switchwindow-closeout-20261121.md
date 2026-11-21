# FSD 毕报卷·切换窗（TriModel 本机供给侧切换）——三段全毕·C5 双锚齐·P2 值面达成（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T01:24:55Z（date 现查粘贴·+8=09:24:55·D-47 正形）
- 令面: COO 切换窗开工令（ab9fcd0e 三段序）+中段闸门（CTO 债①D 三注：不可换序+探针判据）
- **next_agent=COO**（切换窗收口定谳）+CTO（含一条 shutdown 门勘正）

## 一·前段（admin token 轮换+TriModel 重启+3333 验收）

- **硬编码副本清点先行**：活跃消费面=local-server-bootstrap.mjs（读文件）+TriModel src（读 env）·%LOCALAPPDATA% 根面零副本·.fade 四文件历史档——零其他活跃副本；
- token 轮换：old-sha16=eff86aef4c3c3d84 → **new-sha16=150be645fcda8177**（600 保全）；
- TriModel 重启 pid 26768→9632·3333 LISTENING·healthz ok；
- **3333 验收双面**：新 token managed=**200** / 伪旧 token=**401**（轮换真发生）·pull 面=200（API token 不受 admin 轮换影响）。

## 二·中段（三键同窗单冷启）

### ②-1 债①D 修形（CTO 主案 D·先于 8713 段·不可换序照行）

- `config-cards.ts` 新增 `effectiveModelForFace(face)`：quota/policy 二层原样（全局评估序）·card-default 层替换为 face 卡派生（`loadCard(faceCardPath(face))`）·env-default 兜底；pull 处 L130 改调用；
- **tsc --noEmit rc=0 + rebuild（tsc emit+copy-ui）rc=0**——**一次 rebuild 覆盖四件**（client.ts registry+config.ts:60+policy.ts:57+config-cards.ts 债①D·CTO 注三兑现）；
- TriModel 再启 pid=**17920**；
- **闸门探针（CTO 判据·原样粘贴）**：`GET /v1/config/cards/mlc?view=pull` → `{"card_present": true, "default_model": "deepseek-flash", "default_model_source": "card-default"}`——**P2 值面达成·该探针过才动 wrapper（照 CTO 闸门）**。

### ②-2 8713 wrapper 三键（脚本化·值面零命令行·CRLF 50=50 保全）

| 键 | 改动 | 说明 |
|---|---|---|
| L14 TRILC_TRIMODEL_API_URL | `https://8.155.54.79` → **`http://127.0.0.1:3333`** | 端点切本机 |
| L16 TRILC_INTERNAL_TOKEN | 轮换（new-sha16=**b6f72424d7a72ade**） | API token 轮换捆窗 |
| L12 TRIMODEL_API_TOKEN | **不动** | **行号勘正**：CTO/COO 令面「L11」实为 L12；本机 TriModel bootstrap 读 daemon cmd 同值=**天然匹配零变更**（设计消除漏切 401 风险·CTO 已认同） |
| L11 TRIMC_INTERNAL_TOKEN / L15·L17·L18 | 不动 | scope 钉=出站 TriMMC 族不动 |

- bak：`trimlc-daemon-channel.cmd.bak-switchwin-20261121` 在位。

### ②-3 8713 重启（shutdown→FREE→起→三断言）

- **shutdown 门勘正（重要·技术事实）**：`POST /shutdown` **实测受 internal gate 保护**（无 token=401 `unauthorized: missing or invalid X-Internal-Token`·L1957 body）——此前本席与 CTO 的「零 token」判读=读码段（L4798-4806）未覆盖前置全局 gate=**判读错误·本卷勘正**；正形=用当前进程 env 的旧 token（bak 提取）调 shutdown 成功 `{"ok":true,"message":"shutting down"}`；
- port FREE 验证 ✓（零 LISTENING）→ schtasks `\TriMLC Daemon` 起；
- **三断言全过**：①新 pid=**32228**（原 35576）②**uptime=5 重置**（原 81446）③新 token config/show=**200** / 旧 token=**401**（轮换生效）。

## 三·后段 C5 双锚验收（kit import/业务探针级·非 healthz）

### 锚 1：本地消费活体读数（四项）

1. **config verify**（新 token）：`{"ok":true,"connectivity":"ok","credentials":"ok","decryptHealth":"ok","cardPresent":true,"defaultModel":"deepseek-flash","providers":1,"refreshIntervalS":900,"message":"connectivity+credentials+decrypt all healthy"}`——**card absent→present·decrypt 健康·default 值面=deepseek-flash**；
2. **config show**：`effectiveModel:deepseek-flash`·`effectiveSource:tier2-cache-fresh`·`providerCount:1·providers:["deepseek"]`·**`strategy:{"id":"st-default","name":"default","rule_ids":["rule-default"]}`**（本机卡策略摘要拉到）；
3. **周期热载实证**（daemon.log 原样）：`[trilc:keys] refreshed config: { deepseek: { api_key: 'sk-01****' } }`——周期 pull 本机 card 成功+**真 key 注入 env**（sanitize 形）；
4. **registry 铸笔生效实证**（daemon.log 原样）：`[trilc:model] registry check: 12 models (deepseek-chat, deepseek-reasoner, deepseek-v4-pro, deepseek-v4-flash, deepseek-flash, …), fallback chain ok`——**deepseek-flash 在 registry·fallback chain 通**（本轮两笔铸笔的 registry 面活体验证）。

### 锚 2：R-HY 灾备可达双验

- `https://8.155.54.79/health` → **http=200**（1.89s）；
- `https://8.155.54.79/v1/models` → **http=200**（0.20s）——河源灾备路径完整可达。

### 回滚锚

- **一行回滚**：L14 改回 `https://8.155.54.79` + 8713 重启（bak 与正形均在档）；L16 轮换值已在位（双 token 可用=旧值 bak 留档）。

## 四·如实注

1. selfcheck（`POST /internal/v1/init/selfcheck/run` → 202 runId=sc_mwpq4uzh_tzyn）异步在跑·日志 `chain resumed: selfcheck（断点续跑）` 多次未见终态行——**不阻塞 C5 判据**（已用上述四项活体读数达成·selfcheck 作为补充真探候其自然完成）；
2. C4 研发期形态限定照役：本卷零「生产部署/产品级本地域发行版」定性；
3. 消费如实档：selfcheck 一次触发（LLM 探针）+ TriModel 三次重启（前段 1 次+债①D 生效 1 次+检查面）+ 8713 一次冷启。

## 五·使用依据

COO 开工令 ab9fcd0e+中段闸门令+CTO 债①D 三注+config-cards.ts/trimmc-card.ts/server.ts 源码+tsc/rebuild 读数+pull 探针读数+daemon channel.log 活体行+8713 healthz/netstat/schtasks 读数+R-HY 双端点读数+bak 双件。

---
落卷=FSD 小全（m-fsd）·切换窗三段毕报（09:24+8）·**next_agent=COO**（收口定谳）+CTO（shutdown 门勘正一条）·C5 双锚齐·P2 值面达成（deepseek-flash/card-default）·registry 铸笔活体验证·周期热载真 key 注入·回滚一行在档·935 在役


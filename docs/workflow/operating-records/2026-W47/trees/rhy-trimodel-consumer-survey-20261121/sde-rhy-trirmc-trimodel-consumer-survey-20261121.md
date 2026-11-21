# SDE R-HY TriRMC 消费面读数勘定卷（TriModel 消费路径现势·CTO 判据三查·只读零改）

- sourceOfTruth: 本卷（trees/rhy-trimodel-consumer-survey-20261121/sde-rhy-trirmc-trimodel-consumer-survey-20261121.md·TriModel 消费面勘定读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COO D-27 v4 派工（m-coo·COS 转达 CTO 缺口第六项派工权·落款 2026-11-21T00:50:14Z/+8=08:50:14）
- 判定: **三查读齐全（①键面活体含非密值+密键长度形态断言·零值面 ②pull 周期三链 15min 现势全绿 ③消费指向=R-HY 本机 3333 trimodel.service·R 面域内消费面）——异常两项如实档（env 面 openrouter 值与 key-cache 生效值分叉·8710 cron degraded=true 系 weekly-plane-shift 既有连败），无阻断项**

## §一 · CTO 判据①：wrapper/env 面 TriModel 键活体读数（D-24 逐位实证·D-46 键名形）

**Unit 面**（systemctl cat trirmc）：
- `User=fleet`·`WorkingDirectory=/srv/fleet/TriRMC`·`ExecStart=/usr/bin/node dist/src/index.js`（cmdline 无内嵌键值）。
- `EnvironmentFile=/srv/fleet/trimodel-data/api-token.env`（-rw------- fleet·968B·mtime 11-19 15:56 CST·旁有 .bak-pre-envmodel-20261119 15:48=env-model 迁移件）。
- Unit Environment 键（值段掩码）: TRIRMC_HOST / TRIRMC_PORT / TRIRMC_CONFIG_DIR / TRIRMC_INTERNAL_TOKEN / HOME / TRIRMC_TRIMODEL_API_URL / PATH / TRICO_LOOP_MARKER_DIR。

**env 文件键名面**（仅键名零值面）: ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL / TRIMODEL_ADMIN_TOKEN / TRIMODEL_API_TOKEN / TRIMODEL_FALLBACK_CHAIN / TRIRMC_ALARM_ENABLED / TRIRMC_ALARM_SMTP_FROM / TRIRMC_ALARM_SMTP_HOST / TRIRMC_ALARM_SMTP_PASS / TRIRMC_ALARM_SMTP_PORT / TRIRMC_ALARM_SMTP_TO / TRIRMC_ALARM_SMTP_USER / TRIRMC_DEFAULT_MODEL。

**Runtime 生效 environ（MainPID 2687790·TriModel 族键名）**: ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL / TRIMODEL_ADMIN_TOKEN / TRIMODEL_API_TOKEN / TRIMODEL_FALLBACK_CHAIN / TRIRMC_DEFAULT_MODEL / TRIRMC_INTERNAL_TOKEN / TRIRMC_TRIMODEL_API_URL。

**非密值读数（拓扑面）**：
| 键 | 值 |
|---|---|
| TRIRMC_HOST / TRIRMC_PORT | 0.0.0.0 / 8710 |
| TRIRMC_CONFIG_DIR / TRICO_LOOP_MARKER_DIR | /var/lib/trirmc / /var/lib/trirmc |
| **TRIRMC_TRIMODEL_API_URL** | **http://8.155.54.79:3333**（R-HY 本机 TriModel 实例） |
| ANTHROPIC_BASE_URL（environ 初始值） | https://openrouter.ai/api（**注意=被 key-cache 15min 刷新覆盖·见 §四-1**） |
| TRIRMC_DEFAULT_MODEL | glm-5.3-flash |
| TRIMODEL_FALLBACK_CHAIN | deepseek-chat@deepseek,deepseek-reasoner@deepseek,glm-5.3-flash@anthropic |

**密键形态断言（零值面·仅长度/形态）**: TRIMODEL_API_TOKEN len=64 hex64 ｜ TRIMODEL_ADMIN_TOKEN len=64 hex64 ｜ TRIRMC_INTERNAL_TOKEN len=64 hex64 ｜ ANTHROPIC_API_KEY len=73 nonhex（第三方 key 格式·非 hex 族）。

## §二 · CTO 判据②：pull 周期行为 log 面（三链 15min 现势）

1. **tricompany-pull cron 周期行**：schedule=`*/15 * * * *` tz=Asia/Shanghai·enabled=True·lastRunStatus=**ok**·consecutiveErrors=0·runCount=**7579**·末拍 11-21T00:45Z（08:45 CST）log 装填行=`Already up to date.`+`RESULT: exit code 0`。整点 :00/:15/:30/:45 逐拍全在（journal 直读 25 连拍）。
2. **key-cache refresh 间隔行**：源面实锚 `dist/src/config/key-cache.js:176 KEY_REFRESH_INTERVAL_S_DEFAULT = 15 * 60`（server 侧 refresh_interval_s 可覆盖·L283/L309）·TTL=24h（L175）·`setInterval` 驱动（L521）·journal `[trirmc:keys] refreshed config` 11-20 00:00 起 **131 行**=15min 节拍吻合·时点尾 10=06:28:18→08:43:18 逐 15min（:28/:43/:58/:13 相位）。
3. **TriModel 侧 card 写周期**：/srv/fleet/trimodel-data/trirmc-card.json.bak-* 逐 15min 落（07:43/07:58/08:13/08:28/08:43·后缀=写者 pid 2405427+序号 414-418）·face-ledger `rmc.last_pull_at=2026-11-21T00:43:18.660Z` 与 keys refresh :43:18 **同秒吻合**=pull→apply 链实证（last_pull_from=remote·last_pull_result=ok·applied_state=applied·applied_tier=1）。
4. **旁量**：近 36h `fallback chain active` 133 行=spawn 波相关（62 拍深勘同源面·非常态）。

## §三 · CTO 判据③：消费用途面（指向哪个 TriModel 实例·服务哪个域内消费面）

- **实例身份**：**R-HY 本机 trimodel.service**——0.0.0.0:**3333** LISTEN·pid **2405427**·`/usr/bin/node dist/src/server.js`·cgroup=/system.slice/trimodel.service·started **2026-11-17 01:49:42 CST**·active。伴生 `127.0.0.1:3334`=TriModel proxy-server（pid 2405435·/srv/fleet/TriModel/dist/src/proxy-server.js）。
- **TriRMC 消费指向**：TRIRMC_TRIMODEL_API_URL=http://8.155.54.79:3333（同机回环外地址面）——TriRMC daemon 经 key-cache 拉取该实例下发的 keys/card 后装配 env（key-cache.js:405 `env.ANTHROPIC_BASE_URL = anthropic.base_url`）。
- **服务域内消费面**：face-ledger 两面——`rmc`（remote pull·ok·applied·tier1·local_config 落 /var/lib/trirmc/settings.json version_applied=5·applied_at 2026-10-06T23:17:23Z）+`mlc`（loopback pull·ok·applied_state=null·last_pull_at 2026-11-21T00:45:23Z）。即 R 面域内消费（R-HY 席组 spawn 会话/agent loop，journal `[trimodel-client] chat/STREAM model=glm-5.3-flash` 实证）+ MLC 面 loopback 拉取面。
- **card 结构面**（键名形）：machine{name}·status{at,state,tier}·local_config{items,updated_at,version}·provider_entries 三条（e-deepseek-anthropic / e-glm-anthropic / e-glm-flash-anthropic）·model_sets 1 组（ms_mu1bth1g8229dm）·strategies active=st_mujth2j65nch·version=4·default_model=None·connection{name}。
- **连接态**：3333/3334 勘时点零 established 长连（按需请求形·非常连池）。
- **旁注（非消费面·如实档）**：R-HY 监听另有 relay3.js:18790、dsh web:8791/8792、proxy.mjs:8682 等，与 TriModel 消费路径无关，未深勘。

## §四 · 异常与观察项（判读面·如实档）

1. **env 面 ANTHROPIC_BASE_URL=openrouter.ai/api vs key-cache 生效值=open.bigmodel.cn/api/anthropic（08:43:18 块实读）**——env 值系初始快照，每 15min 被 key-cache pull-apply 覆盖（key-cache.js:405 显式覆写）。**实际生效面=key-cache（bigmodel）**；env 面 openrouter 值=陈旧/过渡残值。风险面：key-cache 拉取失败时回退 env 面=会打到 openrouter（未验证可用性）——非本令改面，如实报候 CTO 判读。
2. **8710 healthz degraded=true·consecutiveFailures=5**——载体=weekly-plane-shift 五连败（本席 62 拍深勘卷已定性：score_skill_spawn 段·GLM 供给异常波·翻转候拍 11-22 周日窗）——非新增异常·交叉吻合。
3. tricompany-pull runCount=7579 累积正常·consecutiveErrors=0——周期链健康。
4. D-46 闸：本卷全读数本地 64hex 命中计数=**0**（五采集件逐件断言）·密键仅长度/形态面。

## §五 · 护栏遵守

只读零改（unit/env/process/journal/jobs API/文件清单纯读·R-HY 零写面）✓｜红即停（sg 跳板一次 kex reset=限流瞬态→等 30s 单次重发即通·零硬试风暴）✓｜D-24 活体现探（unit→env 文件→runtime environ 三层逐位·禁默认值推定）✓｜D-46 键名形+长度形态断言+本地 64hex 零命中闸 ✓｜D-47（落款=date 现查原值）✓｜R-HY 生产面零扰 ✓｜非切换窗阻塞件（另线勘·未挤段 7/切换窗）✓。

## §六 · 使用依据

- COO D-27 v4 派工（m-coo·COS 转达 CTO 缺口第六项·判据三查+护栏五款）
- 活体读数：systemctl cat/show trirmc·/proc/2687790/{environ,cmdline}·api-token.env 键名·journalctl -u trirmc 11-20 起·jobs API（tricompany-pull）·cron log 装填行·trimodel-data 目录清单·face-ledger.json·trirmc-card.json 结构·ss -tlnp/established·8710 healthz
- 机制源：/srv/fleet/TriRMC/dist/src/config/key-cache.js（L175/L176/L283/L309/L521/L575/L405）
- 交叉件：sde-wpshift-rc2-diagnosis-20261120.md（62 拍深勘·degraded 载体定性）
- D-24/D-46/D-47

—— SDE 小布（m-sde·R-HY TriRMC 消费面勘定收口·三查读齐·异常两项如实档候 CTO 判读）·写前现查 2026-11-21T00:54:33Z（+8=2026-11-21 08:54:33·date 现查原值·D-47 正形）

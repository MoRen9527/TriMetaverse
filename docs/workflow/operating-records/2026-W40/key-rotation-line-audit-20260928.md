# 凭据线·沾染键域对表定性卷（SDE 小布·树外线独立件）

- sourceOfTruth: 本件（09-27 泄出批次 vs 09-28 两枚沾染键 域边界对表定性+预备勘察成果归档）
- syncMode: source-only
- lastSyncedAt: 2026-09-28T17:26:11+0800（date 现查）
- 令链: CEO 17:21 终裁（BOD 转/COS 17:23 流转/m-coo 17:2x 令修三项）——两枚不构成实质沾染不轮换+候钥令撤+勘察转对表用途
- 边界: 本件系 P0 树外线独立件，不占 trimodel-config-page-4plane-p0-exec-01 树账节点流；键值全程掩码（len+尾4），零全值回显

## 一、令修回执

1. **候钥令撤** ✓：m-coo 17:0x「候钥预备→钥到即轮」令即止，无钥可候。**零实改声明**：接令至本笔全程勘察面只读（卡密文解出仅取尾4/env 键名级+mtime/源码实勘/transcript 尾4 只计数），无任何写入路径实改动作。
2. **预备勘察成果** ✓ 不白费：转对表定性依据（§二）+归档备 09-27 枚（异键）轮换在途时的执行配方（§四）。
3. **掩码纪律维持** ✓：CTO「预勘面零回显」教训不因终裁降格豁免——本卷通篇 len+尾4 形态。

## 二、对表定性结论：**异键**（令文③分支二）

| 线 | 键 | 载体面 | 沾染路径 | 处置 |
| --- | --- | --- | --- | --- |
| 09-28 今日两枚 | glm 系尾 `tn5y`（len49） | TriModel 卡密文面 provider_entries（e-glm-anthropic + e-glm-flash-anthropic 同键双 entry） | FSD 预勘 GET admin 面 entries_decrypted 段打印（p0 树 cto-preaudit-findings.md §三） | **按本裁不轮换，销项** |
| 09-28 今日两枚 | deepseek 系尾 `26f3`（len35） | TriModel 卡密文面（e-deepseek-anthropic） | 同上 | **按本裁不轮换，销项** |
| **09-27 泄出枚** | deepseek 系尾 **`f738`**（len35） | **D:/Code/ai/.env `DEEPSEEK_API_KEY`**（env 面，非卡） | 合法 GET `/v1/config/keys` 分发面（W39 cto-triage-verdict.md §三） | **异键——不受本裁影响**；轮换在途态候 CEO/BOD 面确认（§三） |

## 三、定性证据链（结构性铁证为主，transcript 计数为弱信号仅列不采）

1. **分发面供 env 键非卡键**（keys.js readKeys L34-65 实勘）：GET `/v1/config/keys` 逐位读 `process.env.DEEPSEEK_API_KEY`/`ANTHROPIC_API_KEY`/`OPENAI_API_KEY`/`TRIMODEL_TRIMETAVERSE_API_KEY`——**零卡源**；卡密文仅 admin 面 GET trimmc-card（entries_decrypted）可达。
2. **09-27 时点供值=f738**：`D:/Code/ai/.env` mtime=**2026-09-18 00:40**（09-27 之后未变过）→ 09-27 GET 响应 deepseek 位即现值 f738。
3. **glm 键无分发面泄出路径**：.env 无 ANTHROPIC/GLM 系键（唯一异族键 OPENAI_API_KEY 尾 `TL1p`）→ 09-27 分发面响应不可能含 glm 键 → glm 沾染唯卡面路径=今日 FSD 预勘，与 09-27 批次无交集。
4. **09-27 时点卡态旁证**（bak-20260927-2325-pre-fullflash 解出比对）：卡 deepseek 位当日已=26f3——26f3 早于今日在卡，但 09-27 泄出路径（分发面）不经卡，非同枚。
5. 弱信号（不采为主证）：09-27 sweep 会话 transcript（0612be9f）尾4 计数 f738×4/26f3×2/tn5y×0——纯十六进制尾4（26f3/f738）易撞 commit hash/密文 base64 子串，双向皆可能假阳/假阴，故仅列备查。
6. 同机异键边界补录（掩码全图，防将来误轮）：HKCU\Environment `GLM_API_KEY` 尾 `VRyY`（≠tn5y 异键）；.env `DEEPSEEK_API_KEY` 尾 `f738`（=09-27 枚）；.env `OPENAI_API_KEY` 尾 `TL1p`（异族）；settings.json/trilc-local.env 无 glm/deepseek 系键。

## 四、预备勘察成果归档（转 f738 线在途钥到时的执行配方）

**落存点位全图（f738 枚）**：唯一本机落存位=`D:/Code/ai/.env` `DEEPSEEK_API_KEY`（行级单键）；经 dotenv 上扫（TriModel config.ts 三级向上扫描 L10-12）入 server 进程 env；分发面即取即供（server 重启载新值后响应自动换新，无第二缓存层）。

**配方三步（就位态，候钥到触发）**：
1. **平台重发钥**（CEO/BOD 面）→ 钥到（掩码交接）；
2. **新钥写入**：.env 备份（copy 带 `bak-pre-rot-<ts>` 后缀）→ 行级替换 `DEEPSEEK_API_KEY` 值（保留行内其余格式，CRLF 铁律照 D-09 同族纪律）→ TriModel server 重启生效（D-03 两步纪律：stop 验父 cmd 链消亡→拉起，本机 09-28 凌晨「cmd 父进程复活机制」破案直接适用）；重启前现 pid 验活、重启后 healthz+GET /v1/config/keys 掩码抽验尾4=新值；
3. **旧钥作废断言**：平台吊销旧键后，curl deepseek 官方端点携旧键（掩码引用、响应只记 status）——期望 **401**；同时 GET /v1/config/keys 确认分发面已供新值（尾4 比对）。

**备查归档（卡密文面写通道勘定成果，供卡键将来轮换复用）**：卡写面=PUT `/v1/config/trimmc-card`（Bearer TRIMODEL_ADMIN_TOKEN）——D7 合并语义（脏条目 upsert 非整卡回写）+明文 `api_key` 服务端水合加密（buildEntry→AES-256-GCM/PBKDF2 机器指纹派生，本机自加密自解）+status→pending；加密机制无外部 master key（机器指纹绑定，跨机密文不可解）。**glm 键注意**：一卡两 entry 同键（e-glm-anthropic+e-glm-flash-anthropic），轮换须双写。

## 五、f738 线候办态（如实标注，不擅自启）

- 09-27 裁定卷原裁「已沾 key 轮换：建议执行，归 BOD/CEO 面执行或授权 SDE 轮换（轮换即办）」；
- 本席现态：**配方就位、候 CEO/BOD 面确认在途态**（平台是否已重发钥本机不可断言）；确认在途且钥到→按 §四配方即轮（授权链按 09-27 裁定原文补认）；确认不在途→本卷归档即闭，候排窗。

## 使用依据

keys.js（dist/src/api/keys.js L34-65 readKeys env 源实勘）/trimmc-card.js+api/trimmc-card.js（卡写面+水合语义）/security/key-encryptor.js（AES-256-GCM+PBKDF2 机器指纹）/config.ts L10-12（dotenv 上扫）/掩码扫描 D:/tmp/lg057/mask-scan-keys.mjs（留档可复跑）/W39 cto-triage-verdict.md §三（09-27 泄出路径+原裁）/W40 p0 树 cto-preaudit-findings.md §三（今日两枚发现源）/GLM 四面点位图（docs/execution/2026-08-27/glm-model-deployment-map.md）。

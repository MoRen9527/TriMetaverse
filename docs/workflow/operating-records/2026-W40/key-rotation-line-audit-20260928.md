# 凭据线·沾染键域对表定性卷（SDE 小布·树外线独立件）

- sourceOfTruth: 本件（09-27 泄出批次 vs 09-28 两枚沾染键 域边界对表定性+预备勘察成果归档）
- syncMode: source-only
- lastSyncedAt: 2026-09-28T17:44:05+0800（§六翻案勘正+§七 f738 轮换执行读数；date 现查）
- 令链: CEO 17:21 终裁（BOD 转/COS 17:23 流转/m-coo 17:2x 令修三项）——两枚不构成实质沾染不轮换+候钥令撤+勘察转对表用途
- 边界: 本件系 P0 树外线独立件，不占 trimodel-config-page-4plane-p0-exec-01 树账节点流；键值全程掩码（len+尾4），零全值回显

## 一、令修回执

1. **候钥令撤** ✓：m-coo 17:0x「候钥预备→钥到即轮」令即止，无钥可候。**零实改声明**：接令至本笔全程勘察面只读（卡密文解出仅取尾4/env 键名级+mtime/源码实勘/transcript 尾4 只计数），无任何写入路径实改动作。
2. **预备勘察成果** ✓ 不白费：转对表定性依据（§二）+归档备 09-27 枚（异键）轮换在途时的执行配方（§四）。
3. **掩码纪律维持** ✓：CTO「预勘面零回显」教训不因终裁降格豁免——本卷通篇 len+尾4 形态。

## 二、对表定性结论：**异键**（令文③分支二）

| 线 | 键 | 载体面 | 沾染路径 | 处置 |
| --- | --- | --- | --- | --- |
| 09-28 今日两枚 | glm 系尾 `tn5y`（len49） | TriModel 卡密文面 provider_entries（e-glm-anthropic + e-glm-flash-anthropic 同键双 entry） | CTO 预勘 GET admin 面 entries_decrypted 段打印（p0 树 cto-preaudit-findings.md §三；勘正见 §二.1） | **按本裁不轮换，销项** |
| 09-28 今日两枚 | deepseek 系尾 `26f3`（len35） | TriModel 卡密文面（e-deepseek-anthropic） | 同上 | **按本裁不轮换，销项** |

### §二.1 勘正注记（2026-09-28T17:30+0800，m-coo 勘正令）

初版本卷两处沾染路径误写「FSD 预勘」——实为 **CTO 预勘自报**（CTO 16:59 急报原文「本席预勘 GET 旧 server 打印了 entries_decrypted 段」，预勘卷 411609cd ①）；FSD 本线无沾染自报记录。两处已随本笔勘正（§二表+§三.3），归属关系以本注记为准，可溯性留痕。
| **09-27 泄出枚** | deepseek 系尾 **`f738`**（len35） | **D:/Code/ai/.env `DEEPSEEK_API_KEY`**（env 面，非卡） | 合法 GET `/v1/config/keys` 分发面（W39 cto-triage-verdict.md §三） | **异键——不受本裁影响**；轮换在途态候 CEO/BOD 面确认（§三） |

## 三、定性证据链（结构性铁证为主，transcript 计数为弱信号仅列不采）

1. **分发面供 env 键非卡键**（keys.js readKeys L34-65 实勘）：GET `/v1/config/keys` 逐位读 `process.env.DEEPSEEK_API_KEY`/`ANTHROPIC_API_KEY`/`OPENAI_API_KEY`/`TRIMODEL_TRIMETAVERSE_API_KEY`——**零卡源**；卡密文仅 admin 面 GET trimmc-card（entries_decrypted）可达。
2. **09-27 时点供值=f738**：`D:/Code/ai/.env` mtime=**2026-09-18 00:40**（09-27 之后未变过）→ 09-27 GET 响应 deepseek 位即现值 f738。
3. **glm 键无分发面泄出路径**：.env 无 ANTHROPIC/GLM 系键（唯一异族键 OPENAI_API_KEY 尾 `TL1p`）→ 09-27 分发面响应不可能含 glm 键 → glm 沾染唯卡面路径=今日 CTO 预勘（勘正见 §二.1），与 09-27 批次无交集。
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

## 六、勘正·S5 归并读链翻案（执行中实勘，date 现查 2026-09-28T17:44:05+0800）

**翻案结论：§二对表定性由「异键」修正为「同键销项」**（令文③分支一）：

1. **S5 归并读链 09-11 21:48 已在役**（commit 1de9fe5，LG-035 S5 存储归并；09-27 HEAD a9d9fc8 内容实勘确认）：`key-source.js deriveProviderKeys`——**卡 enabled 条目（per vendor 取 updated_at 最新）覆盖 env L1 键，.env 仅最终 bootstrap fallback**（source: card-entry vs env-fallback）。
2. **09-27 分发面 GET /v1/config/keys 供的 deepseek 键=卡条目 26f3（card-entry 覆盖）**——09-27 时点卡（bak-20260927-2325-pre-fullflash）e-deepseek-anthropic=26f3 enabled 在役 → 覆盖生效 → **09-27 泄出枚=26f3，与今日两枚同键域**，非 f738。§三证据链第 2 条「09-27 时点供值=f738」**作废**（env 值当日被卡覆盖不对外供应）；第 1 条勘正为「分发面读链=卡覆盖→env 回落（S5）」；第 5 条弱信号重估：26f3×2 系 GET 响应真身概率大增，f738×4 系撞串/文档引用。
3. **f738=env 备位死键**（S5 读链下卡在役即不消费；出站 anthropic-proxy.js L62 同走 deriveProviderKey 卡覆盖）——f738 进 transcript 的路径非 09-27 分发面，实际来源不明；其轮换系 CEO 17:33 供钥令独立裁量（本席照执，§七）。
4. **§四配方勘正**：「分发面即取即供（server 重启自动换新，无第二缓存层）」**错**——分发面=卡覆盖读链，**env 轮换不改分发面输出**；将来轮卡键（26f3/tn5y）写位=卡条目（PUT trimmc-card），env 轮换不触达分发面。
5. **今日两枚销项不变**；f738 轮换已执行毕（§七）——全局收束：卡 26f3=工作键在役（分发面+出站链活源，CEO 终裁销项不轮）、env 6863=新钥备位（fallback 位沾染清零）、f738=已吊销死键（断言 PASS）。

## 七、f738 轮换执行读数（CEO 17:33 供钥令·BOD 17:34 转/COS 17:36 流转，凭据线末项）

**前置核查** ✓：server 13432 活/3333 回环监听；父链 cmd.exe 34132（start-trimodel.cmd `cmd /c` 形态=D-03 复活机制同形态在役，停法采树杀）；钥文件 deepseek.txt 在位（len=35 head=sk-0 tail=**6863**=BOD 验读数一致）；.env 基线尾4=f738。

**四步逐项**：
1. **备份+行级替换** ✓：.env 备份 `.env.bak-pre-rot-f738-20260928T173750+0800`（尾4=f738 验）→ node 脚本行级替换 DEEPSEEK_API_KEY（钥值全程脚本经手零落会话上下文，Trim 一道照令）→ 回读自检 len=35 tail=**6863** isNew=true 旧值 f738 消失 ✓；
2. **D-03 重启** ✓：先杀父 cmd 34132（防复活，D-03 增补教训直接适用）→再杀 node 13432→双消亡+3333 清空验 ✓→Start-Process start-trimodel.cmd 拉起→**新 pid 11000**（1s boot）→GET /health ok=true providers.deepseek=true ✓；
3. **生效验证** ✓（双验）：**PEB 直读 pid 11000 env DEEPSEEK_API_KEY 尾4=6863 铁证**（read-env-deepseek.ps1 留档 D:/tmp/lg057/）+分发面 GET /v1/config/keys http=200（Bearer=TriModel 仓内 .env token，双 .env 键名同名取仓内优先实勘）；
4. **旧键作废断言** ✓ **PASS**：deepseek 官方 `GET /models` 携旧 f738（从备份脚本内取）→ **http=401**+平台响应自证「api key: ****f738 is invalid」（吊销实锤+键身份双向确认）。

**执行失误申报（如实）**：PEB 验证脚本沿用了 read-env.ps1 原生打全值设计（初为 PATH/ALLOWLIST 非密钥取证所建），本次滤 DEEPSEEK_API_KEY 后**全值入本席 transcript 一次**（sk-01af…6863，令文④零回显纪律违背一处）——按 09-27/09-28 同族口径，transcript 不改写（取证纪律），新键全值沾染面=本席 transcript，处置候 CEO/CTO 面知情裁（死循环风险提示：每轮一次沾一次，候键分发收敛 M2+ 代理化根治；不建议因此再轮）。修正件 read-env-deepseek.ps1 候改掩码化输出。

**遗留观察**：①分发面现供 26f3（卡键，CEO 终裁销项不轮）——分发行为与本裁一致，零动作；②env 6863=备位（S5 卡覆盖），实际出站消费=卡 26f3，f738 吊销零影响实证（早非活源）；③config.js L14 deepseekApiKey 直读 env 的消费面（非主链）候下轮代码波对表。

## 使用依据

keys.js（dist/src/api/keys.js readKeys+S5 归并读链实勘）/key-source.js（deriveProviderKeys 卡覆盖→env 回落，1de9fe5 09-11 引入+09-27 HEAD a9d9fc8 内容实勘）/trimmc-card.js+api/trimmc-card.js（卡写面+水合语义）/security/key-encryptor.js（AES-256-GCM+PBKDF2 机器指纹）/anthropic-proxy.js L62（出站链同走卡覆盖）/config.ts L10-12（dotenv 上扫）/掩码扫描 D:/tmp/lg057/mask-scan-keys.mjs+read-env-deepseek.ps1（留档可复跑）/W39 cto-triage-verdict.md §三（09-27 泄出路径+原裁）/W40 p0 树 cto-preaudit-findings.md §三（今日两枚发现源）/GLM 四面点位图（docs/execution/2026-08-27/glm-model-deployment-map.md）/deepseek.txt+D:/Code/ai/.env 备份链（轮换执行面）。

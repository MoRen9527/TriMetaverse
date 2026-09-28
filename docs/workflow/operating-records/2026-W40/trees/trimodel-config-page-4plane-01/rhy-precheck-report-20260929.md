# R-HY rmc 卡纠正迁移·预检报告（SDE 小布·范围 3+部署面）

- sourceOfTruth: 本件（R-HY 面 read-only 预检实测读数+映射分拣纸面+SOR 成文；切换步执行之前置门审件）
- syncMode: source-only
- lastSyncedAt: 2026-09-29T02:31+0800（date 现查 UTC=2026-09-28T18:31:10Z）
- 令链: CEO 02:10 显式令（预检先行·切换候窗·read-only 授权）→ COO 02:14 拆派（wt/board 231fca65，范围 3 §六五步+部署面）→ COO 裁复准执行口径（实建卡并入切换步同候双门）
- 边界: 本席执行部署与迁移；发布 readiness 裁决归 CTO；本报告为切换步前置门审件，**未执行任何写面动作**（唯一写面=snapshot 留档新增件，令文授权动作）；键值全程掩码（len+head4+tail4），零全值回显零出机

## 一、执行口径（COO 裁复确认，显式折叠形态）

- **映射段=纸面化**：条目归属分拣表+建卡载荷草案（零写入）——见 §六。
- **实建卡（trirmc-card.json pending 写入）并入切换步**，同候双门（CTO 门审过+CEO 知悉窗）。技术依据=P0 实证卡读链现读不问 status（pending 仅 UI 标记），建卡即有 TriRMC 下轮 pull 拉取生效风险，非无副作用写面；令面依据=CEO 02:05 授权原文「预检只读动作」。
- 切换后观察窗≥1 个 key-cache 刷新周期（900s）。

## 二、R-HY 面全景勘定（read-only 实测，2026-09-28T18:20-18:30Z 四通道九批）

**通道**：`ssh root@8.155.54.79`（~/.ssh/config 在册 `R-HY-8.155.54.79`+河源-key.pem；首试 fleet@ 系用户名错位非通道缺）。机位断言 PASS：hostname=iZf8ziw57ydktu77fsld9yZ（阿里云 cn-heyuan ECS）。

**进程全景**（ss+ps 双面）：

| 端口 | pid | uptime | cwd | 定性 |
| --- | --- | --- | --- | --- |
| 3333 | 1604847 | 1d6h | /srv/fleet/TriModel | **TriModel config plane**（server.js） |
| 8710 | 1304282 | 7d9h | /srv/fleet/TriRMC | **TriRMC-MC**（0.0.0.0 对外门面；cron disabled；CONFIG_DIR=/var/lib/trirmc-mc） |
| 8712 | 907705 | 15d19h | /srv/fleet/TriRMC | **TriRMC 域面干活实例**（127.0.0.1；cron enabled jobCount=3；CONFIG_DIR=/var/lib/trirmc）——rmc 卡消费主实例候选 |
| 8711 | 907707 | 15d19h | /srv/fleet/TriMetaverse | **老 TriLC**（trilc-headless.service）——遗留实例，范围 3 不涉，注记 |

四进程属主全=fleet；**全部 systemd unit 形态**（PPID=1 系 systemd 非孤儿——与 dev 机 3333 孤儿态本质不同）。

## 三、TriModel 河源实例勘定

1. **HEAD=bc72ea4**（LG-053 波⑤策略删除复活缺陷根治；git status 干净）——**早于 LG-058 P0 泛化**。
2. **泛化能力勘定=无**：dist/src/api/ 仅 trimmc-card 固定名四路由（GET/PUT/PUT status/POST apply），**无 `/v1/config/cards/{face}` 泛化卡面端点**。
3. env 形态：systemd unit 内联+EnvironmentFile=/srv/fleet/trimodel-data/api-token.env；TRIMODEL_CARD_FILE=/srv/fleet/trimodel-data/trimmc-card.json 显式在役；.env 文件不存在（Unit 内联形态，09-04 先例同款防误判）。
4. unit：trimodel.service（User=fleet / ExecStart=node dist/src/server.js / Restart=always RestartSec=3）；unit 变更留痕先例在位（trimodel.service.bak-20260927-pre-adminenv）。

## 四、主卡勘定（/srv/fleet/trimodel-data/trimmc-card.json，md5=bac279a613f3800df73f64944621dd57）

- top 结构：v4 全键族（provider_entries/model_sets/rules/strategies/active_strategy_id/status/reserved…）。
- 条目掩码面（3 条，密文只出 len）：
  - e-glm-anthropic: glm / GLM-5.3 / enabled / enc_len=104 / upd 2026-09-27T11:58:49Z
  - e-deepseek-anthropic: deepseek / deepseek-flash / enabled / enc_len=84 / upd 2026-09-27T11:58:49Z
  - e-glm-flash-anthropic: glm / GLM-5.3-Flash / enabled / enc_len=104 / upd 2026-09-27T12:42:19Z
- 策略实体：model_sets×1 / rules×3 / strategies×2（active=st_mujth2j65nch）。
- **machine.name=TABLET-0BGCRCP5（dev 本机机名）**+connection.name=「本机」（中文）+status=pending@2026-09-27T12:51:22Z——**系 09-27 flash 批自 dev 机复制产物**（bak 两份同日时点互证：bak-20260927-pre-flash=2 条目版 09-14 链、bak-apply-20260927T125946Z=3 条目版）。
- **snapshot 留档毕 ✓**（令文授权写面，零触原卡）：`/srv/fleet/trimodel-data/snapshots/snapshot-pre-rmc-migration-20260928T182642Z.json`，md5 与原卡双向一致。

## 五、加密域实测（§6.2①核心判定——含一次翻案实录）

1. **首测（root 身份，机内跑同构解密脚本）=三条件目全 UNDECRYPTABLE**（GCM auth fail）。
2. **翻案**：进程属主验证=fleet；key-encryptor.js L21 指纹实锚=`hostname:username:platform:arch`（**含 username**）——root 实测身份错位≠卡损坏。
3. **复测（su fleet，server 同用户）=三条件目全 DECRYPTABLE**：e-glm-anthropic len=49 head=f17f tail=7d6v / e-deepseek-anthropic len=35 head=sk-9 tail=26f3 / e-glm-flash-anthropic len=49 head=f17f tail=7d6v（全掩码）。
4. **§6.2① 分支判定=「同机同用户=可解」**——无「域已被破坏先治愈」前置，迁移照五步走。
5. **分发面活体闭环**（GET /v1/config/keys 机内 curl 掩码化）：anthropic len=73 head=sk-o tail=2004（openrouter，=env ANTHROPIC_API_KEY fallback）/ glm len=49 head=f17f tail=7d6v / deepseek len=35 head=sk-9 tail=26f3——glm/deepseek 与卡条目掩码逐一吻合=**card-entry 实供实锤**（TriModel 进程 env 无 DEEPSEEK/GLM 系键，deriveProviderKeys 卡覆盖链在役）；与 key-source.js fail-safe 语义（decrypt 失败→env fallback）全链自洽。
6. 键值对表注记：河源 glm=f17f ≠ 本机卡 glm=tn5y（09-28 对表卷）≠ sg 卡 glm=1c61（M2 候修⑤读数）——**三机三键**形态，M2 键收敛大背景对表素材，非本单阻塞项；deepseek 26f3 河源=本机同键（09-27 同源复制互证）。

## 六、映射分拣表+建卡载荷草案（纸面·零写入——COO 裁复折叠形态）

**归属分拣表**：

| 条目/实体 | 归属判定 | 处置（切换步载荷形态） |
| --- | --- | --- |
| e-glm-anthropic（f17f） | TriRMC 域面（河源出站消费键） | → trirmc-card.json **密文搬运**（api_key_encrypted 原样） |
| e-deepseek-anthropic（26f3） | 同上 | → 密文搬运 |
| e-glm-flash-anthropic（f17f） | 同上 | → 密文搬运 |
| model_sets(1)/rules(3)/strategies(2)+active | 策略实体归属两案**呈报不擅断**：案A=全量随卡搬运（server 端 schema 同构，整卡 JSON 换 face 即可）；案B=仅键条目迁移，策略实体候河源 UI 重配——**候 CTO 门审裁** |
| machine.name=TABLET-0BGCRCP5 / connection.name=本机 | 元数据错位（dev 语义残留） | rmc 卡建卡时 machine 语义候选呈报（河源 hostname vs 留空 vs face display 语义对齐）——候 CTO 门审裁 |
| 无法归属条目 | **无**（三键+策略实体全可归 TriRMC 域，§6.2② 呈报分支零触发） |

**密文搬运可行性依据（源码级）**：本机 TriModel HEAD e9938cc `dist/src/api/config-cards.js` L3「现役 trimmc-card handler（cardPath opt 注入）——merge/删除通道/校验单源」=PUT 泛化卡复用 trimmc-card D7 水合语义（「对象+api_key_encrypted→原样保留（密文搬运）」）+§五.3 同机同用户可解实锤（fleet 指纹不变→搬运后解密照常）→**建卡载荷走密文搬运形态，零明文经手**。

**face 合法性源码实锚**：card-faces.js FACES 在册四面含 `rmc: {display:'TriRMC（R·服务域·河源）', card_file:'trirmc-card.json', plane:'service', domain:'R'}`——face 注册表本身即河源语义，rmc 卡=在册正名位。faceCardPath=resolve(TRIMODEL_CARDS_DIR || cwd, 'trirmc-card.json')。

## 七、切换步硬前置判定（部署面·本席承接域）

1. **TriModel 河源升级 P0 泛化版**（bc72ea4→LG-058 系）：无泛化端点则 rmc 卡建了无端点可读——版本锚候 CTO 门审裁（本机 HEAD e9938cc 同源候选）。升级自检含 **TRIMODEL_CARDS_DIR/TRIMODEL_CARD_FILE 双路径语义并存勘验**（faceCardPath 默认 cwd=仓根，现役卡在 trimodel-data——unit 须显式 TRIMODEL_CARDS_DIR=/srv/fleet/trimodel-data 防卡路径漂移；boot migrateLegacyDistCard 迁移链行为候部署窗实测）。
2. **TriRMC 河源升级 P0 版**（a459491[09-04 LG-032]→LG-058 系）：现 CLI 能力面=`cron|config-sync` 两族，**无 config show/pull**；config-sync=本地 fleet 五维 bundle apply 面（apply.js L61 env 名映射），非 TriModel HTTP 拉取——TriRMC config pull 能力=LG-058 P1 范围 2（河源 RMC 接入）承接面。**依赖序：范围 2 升级部署在先，范围 3 卡迁移在后**。
3. TRIMODEL_FACE_TOKENS 候配置面：P0 过渡态未配置=api-token 通配（config-cards.js L48-57 实锚）；face token 精确绑定=M2 收敛（P1 范围 5）——过渡态可用，报告如实注记。
4. 8712 cron jobCount=3 在役（明细候勘：cron store=mc-store.sqlite，定义件不在文件系统，CLI token 面候切换步窗勘明）——**sync-apply 类 job 若在役，建卡即拉取的生效风险面扩大**（实建卡并入切换步候双门口径的技术依据之一）。

## 八、SOR 拉起令（成文章节——CTO 门审审点，双机分形）

**R-HY 机（systemd 形态，Restart=always 自拉活，非孤儿）**：
- TriModel：`systemctl restart trimodel.service`（unit 实锚：User=fleet / ExecStart=/usr/bin/node dist/src/server.js / WorkingDirectory=/srv/fleet/TriModel / RestartSec=3）
- TriRMC 双实例：`systemctl restart trirmc.service trirmc-mc.service`（各自 unit 在役）

**dev 机（对照，CTO 补注 078f0cf7 正形）**：TriModel 3333 现役孤儿态（停后不自拉）——拉起令=TriModel 仓根 `node dist\src\server.js`（现役同形态）照 TriRLC 重启纪律族。

**三层回滚序（河源分支，照 CTO 补注 078f0cf7 映射）**：
1. **主案·目录级还原（分钟级）**：升级部署前置 `cp -a dist dist.bak-pre-rmc-<ts>`（TriModel/TriRMC 各一）→回滚=`rm -rf dist && mv dist.bak-pre-rmc-<ts> dist && systemctl restart <unit>`。
2. **校验案**：git revert+npm run build（不担时限）。
3. **有效性断言=活体三查**（进程活着≠回滚成功）：①`/healthz` 200 全绿（3333/8710/8712）；②卡面读链活体（升级后 `GET /v1/config/cards/mmc?view=managed` 200）；③分发面供键掩码比对不变（f17f/26f3/2004 三键掩码逐一吻合=升级零扰动断言）。

**回滚锚现状**：主卡改名 .bak-<ts> 原位保留（A2 锚）+反向迁移脚本=bak→原名+回写 status（§6.2④），切换步执行时成文。

## 九、验收锚现状基线对表

| 锚 | 现状基线（预检实测） | 切换步验证点 |
| --- | --- | --- |
| A1 rmc 卡来源归因 | TriRMC 无 config show 能力（旧版） | 升级后 config show attribution=rmc 卡 |
| A2 旧卡 .bak 原位保留+反向脚本 | 主卡 md5=bac279a6…+bak×2 在位 | 切换时改名 .bak-<ts>+脚本成文 |
| A3 mmc 卡空白待配置态 | 现主卡实承载三键+策略实体 | **依赖链分析呈报**：mmc 空白后 GET /v1/config/keys 分发面读 mmc 卡→glm/deepseek 键消失→回落 env（env 无此二键）→分发面残缺——**分发面消费方与 A3 空白态的兼容性候 CTO 门审判**（本席不擅断） |
| A4 零跨机文件复制时序留痕 | 预检全程零复制（唯一写面=snapshot 机内留档件） | 切换步照续（密文搬运载荷机内构造，键值零出机） |

## 十、观察项（不阻塞）

1. **root vs fleet 指纹错位教训**：首测 UNDECRYPTABLE 差点误判「域已被破坏」——活体优先诊断法兑现（先验进程属主+指纹派生代码，再复测同用户），预检方法论留档。
2. 老 TriLC 8711（trilc-headless.service）遗留在役——范围外，候 R 面退役裁示。
3. trirmc*.service unit 文件内 TRIRMC_INTERNAL_TOKEN 明文（d2cd…075 系 mc 面跨机共享值与 dev 机 8711 launcher 同值；08e0…78a1 系 8712 本地域值）——河源现役配置惯例，报告引用掩码，入 transcript 已有 G10 launcher 同族先例。
4. TriModel 河源 HEAD 分发面 default_model=deepseek-v4-pro（旧注册名；本机 O-R3-1 修后=tmv-* 对齐）——升级后自然消解候验证。
5. triModel unit bak-20260927-pre-adminenv 留痕先例——升级部署照此形态留 unit bak。

## 十一、预检收口

- 预检段状态：**完成**（九批 read-only 实测，四通道零写面除 snapshot 授权留档件）。
- §6.2 五步进度：①预检=本报告；②映射=§六分拣表+载荷草案（纸面毕）；③切换（rmc 卡 apply→TriRMC config pull 实拉验证→观察窗≥900s）与④回滚锚成文、⑤UI 侧消解=**候双门（CTO 门审+CEO 知悉窗）**。
- 本席无写面动作申报：全程 read-only；唯二机内动作=snapshot cp（令文授权）+md5 双验。

## 十二、门审裁决补注（2026-09-29 02:38+0800 回写；CTO 门审 01e9e3c8·COO 跟排转知）

**门审结果：四项全 PASS+切换就绪 CONDITIONAL READY。**

### 三裁要点（对前文形态的修正，以本节为准）

- **ⓒ 建卡形态=新增复制，主卡保留不动**：切换步 rmc 建卡=trirmc-card.json 新增件（自主卡复制条目非移动），**主卡 trimmc-card.json 零触碰**——修正 §六分拣表处置列与 §八回滚锚主案（原「主卡改名 .bak-<ts>」不再执行）；A3 mmc 卡空白态问题**剥离归 M2 另窗另单**（§九 A3 行依赖链分析归档候 M2 引用），切换步不再涉分发面兼容性判断。回滚锚随 ⓒ 简化：反向迁移=新建 rmc 卡改名/移除+主卡原样在位（主卡自始未动）。
- **ⓐ 策略实体=案A 全量搬运**（§六两案候裁闭合），护栏=策略链活体三验（切换步执行面：strategies/rules/model_sets 计数对表+active_strategy_id 一致+TriRMC 侧 apply/pull 载荷内策略实体可见性）。
- **ⓑ machine 写河源实锚正名**（§六元数据候裁闭合）：rmc 卡 machine.name=河源实锚（hostname=iZf8ziw57ydktu77fsld9yZ 或 fleet 惯例正名，切换步建卡载荷落定时定稿）。

### 执行链更新（红线条修订后=单前置候命态）

> **红线条修订（2026-09-29 02:43+0800 CEO 显式令，BOD 02:44 转/COO 跟排）**：切换步执行要件修订——**CTO 门审过后即可执行，免 CEO 知悉窗**（CEO 原话「不用我点头直接切就行」录档）。双候变单候；切换执行读数照常汇 COS **事后知悉**（事后通报非事前审批）；异常即停回报照纪律。

1. **前置（唯一）**：FSD 范围 2 河源落位绿锚（候定，非本席域）——到位即排升级窗+切换步连窗执行。
2. **升级窗要件**：TriModel 河源升级版本锚=**e9938cc**+**强制钉 `TRIMODEL_DISABLE_BOOT_MIGRATIONS=1`**（CTO 加钉理由：不钉则升级首启 boot 迁移触主卡——与 ⓒ 主卡零触碰红线直接挂钩；systemd 面落位=unit `Environment=` 行追加或 drop-in override，照 unit bak 留痕先例）。升级与切换可同窗连做。
3. ~~前置③ CEO 知悉窗~~（02:43 显式令撤销，录档）。

本席候命态：**单候 FSD 落位绿锚**；升级窗 SOR（§八 systemd 形态已成文+本节强钉增补）按卷执行；观察窗≥900s 照准；回滚锚三查照 A6 补注（dist 目录还原主案+活体断言「进程活着≠回滚成功」）。

## 使用依据

- 令文：CEO 02:10 显式令（预检先行）；COO 02:14 拆派（231fca65 范围 3 §六五步+部署面+A1-A4 锚）；COO 裁复（执行口径折叠形态显式写入）；CTO 补注 078f0cf7（SOR 三层回滚序+成文拉起令=门审审点）；CTO 实现计划 §六（cto-implementation-plan.md L176-192 五步+6.3 锚）。
- R-HY 盘面实锚：/srv/fleet/TriModel（HEAD bc72ea4+dist/src/api/routes.js 四路由）/srv/fleet/TriRMC（HEAD a459491+dist/src/cli.js 能力面+config-sync/*）/srv/fleet/trimodel-data/trimmc-card.json（md5 bac279a6…+snapshot）/etc/systemd/system/{trimodel,trirmc,trirmc-mc,trilc-headless}.service /proc/<pid>/environ 键名级。
- 源码实锚：本机 TriModel HEAD e9938cc dist/src/api/config-cards.js（泛化端点族+pull 鉴权+水合复用语义）+dist/src/card-faces.js（FACES 四面+faceCardPath）；TriModel dist/src/security/key-encryptor.js L21（指纹=hostname:username:platform:arch）+dist/src/key-source.js（fail-safe env fallback）。
- 方法论：活体优先诊断法（LG-035 教训条）/掩码纪律（len+head4+tail4）/manifest 身份验证（md5 双向）/D-04 时刻现查/D-24 机位断言。

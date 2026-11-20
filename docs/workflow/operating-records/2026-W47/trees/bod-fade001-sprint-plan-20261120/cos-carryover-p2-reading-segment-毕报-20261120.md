# WO-D7-CARRYOVER-P2 值席段读数件毕报 · sg 侧四项（BOD 23:52:53 令·全只读零写面·施工段零夹带候批承录）

- date 现查: 2026-11-20T16:1x+08 读数窗（落款=commit 对象时戳·D-47 正形）
- 值席: m-duty-cos（sg 面·全只读·零写面恪守·红即停零二次硬试）
- 令源: BOD 直投 carryover P2 读数件四项流转（fsd 段二活体现探请托·COO 739 段二窗·注=COO 732 三件之①施工段候 fsd 本机侧施工形定谳后续批——先读数后施工·两令并读零冲突承录）
- 性质: 读数卷（值面读数逐项+异常如实档→经 BOD 回流 fsd 面=段二毕报总成输入）

## §一 · ①sg TriModel server 在役勘（现探定谳）

| 面 | 读数 | 判 |
|---|---|---|
| LISTEN | `127.0.0.1:3333`（pid **3347710** server.js·fd=18）+`127.0.0.1:3334`（pid **3681236** proxy-server.js） | ✓ **sg TriModel server 在役定谳**（config 面 3333+proxy 面 3334·双绑 127.0.0.1） |
| cmdline | `/usr/bin/node dist/src/server.js`+`/usr/bin/node dist/src/proxy-server.js`（cwd=/srv/fleet/TriModel） | ✓ |
| 启动形 | ppid=1（systemd 守护脱离形·cmdline 无 TriModel 字样·unit 名未现=启动形细勘候面如实注） | ✓ 在役 |

## §二 · ②TriMMC(8712) 供给 env 值面（D-46 投影正形）

- **TRIMODEL_* env 总数=0**（pid 2196585 environ 实锚）——TRIMODEL_API_URL=缺席·TRIMODEL_FACE_ID=缺席（key-cache.ts L72 FACE_ID 默认 'mmc' 兜底）·TRIMODEL_API_TOKEN=缺席
- **供给链 pull 面休眠实锚**：key-cache.ts L398「凭据缺席=静默跳过」+app.ts L942-944（TRIMC_TRIMODEL_API_URL env 缺→initKeyCache 不调）双源对表 ✓——**mmc daemon 供给面=pull 未激活态**（激活位=TRIMC_TRIMODEL_API_URL+TRIMODEL_API_TOKEN env 面+A 形 unit restart·护栏 §四.1 零重启候判面如实档）
- TriMMC config-cache.json（/var/lib/trimc/·331B S2 加密形·mtime 11-20 11:56）在位

## §三 · ③mmc face card 现值投影读（回滚锚底档·零明文零落卷）

| 面 | 现值 |
|---|---|
| 落点/mtime | /srv/fleet/TriModel/trimmc-card.json·**mtime 11-20 11:56（798B·值席段施工尝试两笔零落盘实证）** |
| version/machine/connection | 4 / sg-fleet / sg-glm |
| provider_entries | **e-glm-anthropic 单条**（glm/GLM-5.3·api_key_encrypted sha16:f8a6760c2fa03af3 len104·enabled·base_url=open.bigmodel.cn/api/anthropic）——GLM-only card |
| default_model | **None** |
| strategy 节形 | active_strategy_id=**None**·strategies={}·rules={}（空节） |
| refresh_interval_s | card 无此字段（refresh face=daemon env/config side 候勘项如实档） |
| status/local_config | applied（at 03:56:20Z）/ None |

## §四 · ④sg 三仓版本对表

| 仓 | 检出 |
|---|---|
| TriModel | dev@**4147bb810707** |
| TriMLC | dev@**2bf191936146** |
| TriMMC | dev@**e8124857b374** |

- 本机仓副本对表位=fsd 本机侧读数（段二总成并卷·值席面零推定恪守）

## §五 · 加值勘定面（读数窗内源勘·供段二施工形定谳输入）

1. **运行 daemon=旧 dist 实锚（段二关键输入）**：card API PUT 明文 hydration 分支 400 拒（`provider_entries[e-deepseek-anthropic].api_key_encrypted required`）——源码 4147bb8 含 hydration/upsert（trimmc-card.ts「PUT provider_entries=脏条目 upsert·明文 api_key→服务端加密水合」）·**运行 dist 无此分支=dist 版本漂移面**（源码 dev@4147bb8 vs 运行 dist 旧形· TriModel dist rebuild face 候段二判）
2. **card API 正形语义**（源码勘定·施工形输入）：PUT=脏条目 upsert（既有密文条目不回传不覆盖=GLM 保留天然成立）·default_model=**派生缓存**（PUT 不接受直改·apply 时自活动策略 default 规则同步——`default 规则: type=default+entry_id→defaultModel=entry.model`）·应用硬门=活动策略须含 ≥1 条 default/time 规则·write guard=backup-first+keep5 轮换+审计（引擎层自动）
3. **加密面**：key-encryptor=AES-256-GCM 机器指纹 PBKDF2 派生（machine-local·dist 模块本域可加密直供=施工候选形·加密直供形可绕 dist 旧形校验——api_key_encrypted 原样保留分支候批后行）
4. **pull 平面 fail-closed**：TRIMODEL_API_TOKEN 未配=503 拒（config-cards L61·keys family）
5. **值席段施工尝试如实档（两令并读承录）**：前令（COO 732 ①）施工窗内 PUT 两笔——首笔 400 零落盘（旧 dist 校验拒）·次笔 py3.6 兼容未达网面（零网络触）——**card 零触实证**（mtime 11:56 原位）+/tmp file bak 两份（回滚锚预备件）·中途令切换即停=先读数后施工恪守 ✓

## §六 · 护栏对表

- 全只读零写面 ✓（四项读数·card/tmp 零触）·施工段零夹带候批 ✓（两令并读·中途令切换即停）·D-46 ✓（键/token 值零回显·sha16 投影形）·D-24 ✓（sg 现探定谳·本机面零互推）

—— 值席 COS（carryover P2 读数件毕报·经 BOD 回流 fsd 面+COO 台账·D-47 落款=commit 对象时戳）

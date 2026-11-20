# FSD 毕报卷·窗二批第一拍（勘定+草料三小件）——timer 判读+在役化形勘定+card 草料·第二拍前提三缺口新识别（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T23:57:30Z（date 现查粘贴·+8=07:57:30·D-47 正形）
- 令面: COO 窗二批两拍制定谳令（23:49:32Z·第一拍即行零候=勘定+草料三小件·零启动零改动）——**本卷=第一拍毕报轻量落树**
- 施工面: 纯只读勘定+草料（源码读+log 现查+活体只读探针）——**零启动零改动零落盘零解密恪守 ✓**
- **next_agent=COO**（第二拍候 10:00 CFO 拍读数二次定谳·本卷=前提总账随卷）

## 一·件① TriMLC pull timer 存续性活体判读——判定=**未装填态（三证）·「15min 自愈」不成立**

1. **源码门控铁锚**：key-cache.ts L545-548 `if (_keyCache) { startRefreshTimer(...) }`——装填前提=**boot 时 cache 非空**；本机 boot 时 config-cache.json/keys.json 双零+pull 127.0.0.1:3333 拒连 → `_keyCache=null` → **timer 零装填**；
2. **补装填路径零**：startRefreshTimer 唯一调用点=initKeyCache L547（全文件实勘）——refreshNow 手动拉成功也**不**装填 timer（doRefresh 零装填逻辑）；
3. **daemon.log 活体双证**：全程零 `[trilc:keys] refresh timer:` 装填行+零周期 `refresh failed:` 行（timer 在役则每 15min 必打失败行·零行=死）；boot 行旧版词面（`no cached keys and fetch failed — chat disabled`=本机 dist 版本差旁证·勘定项④承）。

**判定**：TriModel 在役化后 TriMLC **不会** 15min 内自动 pull——纯等待零效果。**零重启全链通修正形（候裁）**：手动触发面=`POST /internal/v1/config/pull`（daemon 进程内 refreshNow→与周期刷新同路径 doRefresh·即时拉+env apply+status 回写·源码注释铁锚「全部在 daemon 进程内执行」app.ts L1964-1967）——但本机活体探针被 **8713 internal token 门拦**（TRIMC_INTERNAL_TOKEN 401——.env 三候选全零键+schtasks 零在役名+cmd wrapper 父链 cmdline 权限面不可读=**token 配置位不明**）→ 手动 pull 面第二拍前置=internal token 配置位勘定。拉成功后残余两面：timer 持续零装填（后续 card 变更需再手动 pull·周期热载复原=daemon 重启 cache 在位 boot 形·或码面小改 refreshNow 成功后补装填候裁）+deepseek-flash 供给=CTO 裁① registry 铸笔在案。

## 二·件② TriModel 在役化形勘定——零启动零改动全收口

| 面 | 读数 |
|---|---|
| 启动器位 | scripts/start-trimodel.cmd=`node dist\src\server.js` 前台直启+log append——**cmd 直启=黑窗族（D-29 覆盖）+窗口关=进程死（非守护）** |
| dist/deps | dist/src/server.js 在位 ✓+node_modules 在位 ✓（编译物现役·起得来的形） |
| 端口/HOST | TRIMODEL_PORT ?? 3333（server.ts L20）·TRIMODEL_HOST ?? '127.0.0.1'（L19·loopback 绑定跨机零暴露 ✓） |
| 仓形态 | **零 git 仓**（文件副本·版本身份 hash 级对表 sg 4147bb8 候第二拍·勘定项②承） |
| **凭据供给缺口（新实锚）** | **TriModel/.env 零文件+keys.enc 零文件**——server 自身上游凭据双零（config.ts 缺省 deepseekApiKey=''）；sg keys.enc 跨机不可移植铁锚（secure-keys.ts hostname() 指纹派生·跨机=GCM auth failure decrypt_failed）→ **本机在役化施工必须先立凭据供给形**（本机域内 keys.enc 重加密生成 or .env 直配·第二拍勘定项）——否则 server 起=零凭据空壳 |
| 同源链 | TriMLC node_modules/trimodel → symlink → /d/Code/ai/TriModel（同机源码直链实锚·client registry 与 server catalog 同源） |
| 第二拍启动形候 | D-29 无窗纪律（VBS 包装/schtasks）+daemon 纪律备形（新启动非重启·权威路径禁裸杀·优雅停备而不用）——候 COO 裁 |

## 三·件③ card 新建形草料预备——零落盘零解密恪守

1. **schema v4 全形**（trimmc-card.ts L4-15）：version:4+machine{name}+connection{name}+provider_entries{id:{provider,model,api_key_encrypted,enabled,updated_at,base_url?}}+model_sets{id:{name,entry_ids}}+rules{id:{name,type:'time'|'default'|'quota',enabled}}+strategies{id:{name,model_set_id,rule_ids}}+active_strategy_id+default_model?（派生缓存·真源=规则实体）；
2. **落点**：trimlc-card.json @ `TRIMODEL_CARDS_DIR ?? cwd 基座`（card-faces.ts L62-65·启动 cwd=TriModel 根→卡落根）；
3. **key 载入形**：api_key_encrypted=base64(AES-256-GCM 本机域内加密)——**sg 密文不可移植铁锚**（hostname 指纹 PBKDF2·跨机复制=decrypt_failed 丢弃 key-cache.ts L164-172 同族）→ 本机 card key 必须本机域内生成；
4. **PUT 面**：`PUT /v1/config/cards/mlc`（requireAdmin=TRIMODEL_ADMIN_TOKEN）→ preSaveCardGuard（isCatalogModel 官方五名校验——**deepseek-flash 在册 L11 ✓ 守卫可过**）+saveCard 原子写（tmp+rename）；
5. **default_model=PUT 不接受直改**（CTO 核准③源码对表 ✓）：真源=rules{type:'default'}→strategy→active_strategy_id→apply 派生缓存同步——草料形=四实体全建（entry+model_set+default 规则+strategy+active 指针）；
6. **pull 面闭环**：GET `?view=pull`（requirePullAuth=face token 绑定）→ server 域内解密→明文受控载荷（解不开条目跳过+warnings）→ TriMLC 本机重加密落 config-cache.json（S2 域内）；
7. **P1 指纹验形**：sha16 递归滤·值面禁打印——本卷全零值面零明文零解密 ✓。

## 四·第二拍施工前提总账（候 COO 10:00 拍后二次定谳随卷）

1. TriModel 自身凭据供给形（.env/keys.enc 双零+跨机不可移植——新识别·最高前）；2. 8713 internal token 配置位勘定（手动 pull 触发面前置）；3. TriMLC client registry deepseek-flash 铸笔（CTO 裁①在案码面）+timer 补装填码面小改（周期热载复原形·候裁零自领）。**全量 vs 最小面按 CFO 读数裁时此总账=工作量底档**。

## 五·护栏照役与消费档

零启动零改动零落盘零解密全程恪守 ✓（探针=8713 show/verify 只读+被 token 门拦即停零重试）·TriRMC 面零触·daemon 2687790 勿扰·935 在役·GLM 消费轻量如实档（源码读五文件+log 现查+探针一回）。

## 六·使用依据

COO 窗二批两拍制定谳令（23:49:32Z）+TriMLC key-cache.ts L545-568/L647-673 实勘+server/app.ts L1803-1806/L1964-1995 接线+daemon.log 活体现查+TriModel server.ts L19-20/L139+card-faces.ts FACES+trimmc-card.ts schema v4+secure-keys.ts hostname 指纹+model-catalog.ts L11+config.ts L53-60+start-trimodel.cmd 全文+fs 零 .env/keys.enc 现查。

---
落卷=FSD 小全（m-fsd）·窗二批第一拍毕报（07:57+8）·**next_agent=COO**（第二拍候 10:00 拍二次定谳·前提三缺口随卷）·timer 未装填三证实锚·凭据供给缺口新识别·零启动零改动零解密恪守·935 在役

# sg TriMMC 接入切换执行读数卷（SDE 小布·LG-058 P1 sg 面）

- sourceOfTruth: 本件（sg TriMMC 接入切换窗：TriModel 升级收尾+TriMMC cutover+tier1 接线+观察窗）
- syncMode: source-only
- lastSyncedAt: 2026-09-29T04:33+0800（date 现查 UTC=2026-09-28T20:32:14Z 终验批；观察窗终验全绿窗闭=§十）
- 令链: BOD 03:37 排期令（引 CEO 02:43「不用我点头直接切就行」+02:44 令链，生产写面切换免事前点头）→COO 03:48 排窗核可（四裁录案）→COO 04:02 窗触发信号正式达（FSD 实照毕）→04:05 启窗
- 窗时点: 2026-09-29T04:05+0800 启，连窗执行
- 边界: 本席执行部署与切换；键值全程掩码零出机；动作全程留痕（unit bak/bak 链/face-events 台账/回执链）
- 切前基线: FSD evidence-sg-preswitch/（树内 8 件，04:02 毕）+本席预勘四批（03:39-03:46，零写入）

## 一、窗计划与触发链

- 三阶段：A=TriModel sg 升级收尾（8de8fe7 build+restart 双 unit）→B=TriMMC cutover（99ed6d0 build+start.sh 指向切换+tier1 注入）→C=观察窗≥900s+终验+收口。
- COO 四裁：①cutover 形态归 SDE 技术裁量（FSD 信号=时点信号）②矛盾现态活体优先重勘即报 ③收口读数带 sg 卡面结构原文（键值掩码）供 BOD 判读 ④预勘纪律照办。
- 硬前置互证（FSD 实照×本席预勘）：sg TriModel 进程 09-16 启动至今未重启（ActiveEnterTimestamp=09-16 02:51/02:33 实锚），内存旧代无 cards 路由（404 活体）——阶段 A 即此对症。

## 二、切前基线（预勘四批关键读数）

1. TriModel sg：HEAD=8de8fe7（FSD 实照波已带），**dist 陈旧**（泛化件缺位+server.js mtime=Sep 16 02:33）；双 unit（trimodel-config 3333+trimodel-proxy 3334）User=fleet
2. TriMMC 新名仓：HEAD=99ed6d0=origin/dev（=FSD P1 范围 1「sg TriMMC 域面接入——config-cache 泛化 mmc 面+§4.3 层级合并」本体），dist 缺席+docker/.env 缺席
3. **现役 8710=旧名 TriMC 仓**（trimc.service→/usr/local/sbin/trimc-start.sh→cd TriMC，root 身份，无 tier1 接线）
4. sg 主卡：/srv/fleet/TriModel/trimmc-card.json md5=6587c69d…（**切换前基线 md5**），canonical 同构单条目简化卡（entries=1 glm/实体 0-0-0/machine=sg-fleet/connection=sg-glm/status=pending）
5. 属主全 fleet:fleet+fleet 可写仓根；TriModel/.env 含 TRIMODEL_API_TOKEN（fleet 644）

## 三、阶段 A：TriModel 升级收尾（04:04-04:12）

1. dist 备份 ✓：dist.bak-pre-sgswitch-20260928T200511Z（888K）
2. **build 假红自纠链（三段）**：首 build exit=2（test/ 文件 TS7006×3，但泛化件已产出——不放行）→判 node_modules 陈旧（09-16 代）→备份 node_modules（61M）+fleet 身份 npm install（43 包，exit 0）→再 build 露真因 **TS2307 `@trimetaverse/tricode/trimodel-cli`**（河源 TriRMC 同族）→勘 sg TriCode HEAD=1c7bdee 无 trimodel-cli，**origin 指向 sg 本地 bare（陈旧）**→本机主推 TriCode dev（1c7bdee..a3893ba，GitHub+sg bare 双位 ff）→sg fetch+checkout **d20cb6b**（河源对平锚）+TriCode build 绿（dist/trimodel-cli/index.js+d.ts 产出）→TriModel 重 build **exit=0**（四件产物 04:11 新鲜 fleet 属主）
3. 卡形态兼容性预断言 ✓（COO 四裁④）：临时副本+新 dist loadCard——1 条目 machine=sg-fleet+FACES 四面（mmc/mlc/rmc/rlc）全注册，零触真卡
4. 强钉三 env ✓：双 unit drop-in override.conf（DISABLE_BOOT_MIGRATIONS=1+CARDS_DIR/DATA_DIR=/srv/fleet/TriModel 显式）+unit bak×2（bak-20260928T201233Z）
5. restart ✓：双 unit 新 pid（2518071/2518072）active；boot 日志 **card migration: already-canonical**（强钉+canonical 双证，与河源同形）+listening 3333/3334
6. 活体断言 ✓：旧 trimmc-card 路由 401（在）+**泛化 cards/mmc+cards/rmc 双 401（404 消失=新代路由上线实锚）**+proxy 3334 fleet 新 pid+主卡 md5=6587c69d…（阶段 A 零触碰）

## 四、阶段 B：TriMMC cutover（04:13-04:17）

1. B1-B3 ✓：TriMMC HEAD=99ed6d0 干净+fleet npm install（117 包+tricode symlink→d20cb6b）+build **exit=0**（cli.js/index.js/app.js 三件 04:13 fleet 属主）
2. B4 env 形态复制 ✓：TriMC docker/.env→TriMMC（md5 对等 82fc1acf…双同+chmod reference）
3. **mailbox 连续性搬运 ✓**：duty-consumer L112 实锚 mailbox=cwd 相对→cp -p TriMC/notify-mailbox.json（3549B）→TriMMC 根（原件留位）
4. B5 start.sh cutover ✓：bak=trimc-start.sh.bak-20260928T201527Z（文件头回滚注记带实 TS，先例同形）→新文=cd TriMMC+tier1 精准注入（`TRIMC_TRIMODEL_API_URL`=127.0.0.1:3333+`TRIMODEL_API_TOKEN` 自 TriModel/.env grep 抽取 quote-adaptive 剥引号——不整源 .env 防 DEEPSEEK_API_KEY 等键值覆盖）+bash -n 语法门
5. B6 restart ✓：旧 pid 1406906→新 pid **2519160**，cwd=/srv/fleet/TriMMC 实锚，8710 监听，boot **pulled fresh config (1 providers)**+refresh timer 900s+cron 6 jobs degraded=false+duty consumer seats=m-duty-cos 在役+healthz ok
6. **A1 锚 sg 版核心读数 ✓**：CLI `config show`（face=mmc，SHOW_EXIT=0）——effective model=**GLM-5.3 source=tier2-cache-fresh**/cache fetched 20:16:08Z/providers(1) glm/**ladder=card-fresh**（env 逃生门>卡面>fleet bundle>常量）
7. face-events 台账激活 ✓：mmc pull ok（entries=1 from=loopback）+write guarded（自动备份）+status write-back applied——DATA_DIR 钉位生效

## 五、卡面结构原文（COO 裁③呈报，键值掩码）

```json
{
  "version": "1",
  "provider_entries": { "<entry-id>": { "provider": "glm", "model": "GLM-5.3", "enabled": true, "api_key_encrypted": "<MASKED len=见掩码面 head4+tail4 制>", "updated_at": "…" } },
  "model_sets": {}, "rules": {}, "strategies": {},
  "active_strategy_id": null,
  "machine": { "name": "sg-fleet" },
  "connection": { "name": "sg-glm" },
  "default_model": null,
  "status": { "state": "applied", "at": "2026-09-28T20:16:08.331Z" }
}
```
（形态：单条目 glm 简化卡；实体三区空；键值面全掩码。切换前 state=pending，接入写回后 applied。）

## 六、偏差申报：sg 主卡 status 写回（候 BOD 判读确认）

- **读数**：主卡 md5 6587c69d…→422a1d98…（切换中变更）。
- **定性**：mmc face 卡=主卡本体（身份折叠，河源 rmc 面=独立卡故主卡可零触碰；sg mmc 面接入语义 inherent）——TriMMC 拉取应用后按 face 生命周期对卡写回 status（pending→applied）。
- **结构 diff 断言 ✓**：备份 vs 现行**唯一变更=.status.at 时戳**（键值/条目/实体/策略/machine/connection 全等——write-guard 备份 bak-2 实证）。
- **备份链完整 ✓**：写守卫自动产备份，**bak-1（201528Z）md5=6587c69d…=切换前基线内容锚断言 OK**；回滚=还原 bak-1+撤 TRIMC_TRIMODEL_API_URL 即回切换前态。
- **语义申报**：此后每 900s 刷新轮均伴随 status.at 写回（md5 随轮换、内容面恒定）——零触碰语义在 sg 面转为「**内容恒定+status 活性**」，候 BOD/CTO 判读确认此语义承接。

## 七、异常与自纠实录（五项）

1. **build 假红不放行**：exit=2（test TS7006）但产物在——整链断言纪律不放行，追因=node_modules 陈旧（09-16 代），install 对齐后露真因
2. **TS2307→TriCode 双层陈旧**：sg TriCode HEAD 旧+origin 指 sg 本地 bare（亦旧）——本机主推（GitHub+sg bare 双位）后 sg fetch 即得 d20cb6b
3. **败 build 清 dist**：tsc 败跑清空 dist/server.js——在跑进程内存态无碍；纪律兑现=绿门前零 restart（dist.bak 在位双保险）
4. **令面矛盾活体裁决**：COO 令面「盘面 03:40 已重构建」实为 TriMMC src mtime 张冠李戴——本席 04:04 实勘 dist 仍旧代（COO 裁②活体优先适用），自建
5. **outbox 隐件**：notify-outbox.json 系 .gitignore 件（git status 不可见），325 条/366KB 历史留 TriMC 根未搬运（新侧已自建空件不覆盖）——见 §九观察项

## 八、回滚锚（窗前定案+现役在位）

- TriModel：dist.bak-pre-sgswitch-20260928T200511Z+node_modules.bak-pre-sgswitch+unit bak×2（201233Z）+override 撤除+restart
- TriCode：HEAD 回 1c7bdee+TriModel 重 build（TriCode 变更=checkout 切换零推送外溢）
- 8710 cutover：**trimc-start.sh.bak-20260928T201527Z 还原+restart（秒级回旧名 TriMC 仓现役形）**；TriMMC 侧纯新增件零生产存量
- 主卡：bak-201528Z-1（=6587c69d 基线）还原+撤 tier1 注入两 env 即回
- 有效性断言：活体三查（进程活着≠回滚成功）

## 九、观察项（不阻塞，候裁/候办）

1. **outbox 历史归档**：325 条/366KB 留 TriMC 根（新侧自建空件）——归档搬运/退役候 COO/BOD 裁
2. **主卡 md5 轮换语义**：每 900s status.at 写回致 md5 轮换（内容恒定）——候 §六 判读确认
3. TriCode sg HEAD=detached d20cb6b（河源同形）——候对平策略统一裁示
4. npm EBADENGINE（node v18.20.8 vs 包 engines 期望）——警告级，现役稳定运行
5. TriMC 旧仓 notify-mailbox.json 原件留位（双份并存防丢，TriMMC 侧为现役）

## 十、观察窗终验（04:32:14+0800，全绿窗闭）

1. **900s 第二轮刷新成功 ✓**：`refreshed config` 双轮在录（首拉 20:15:27Z→refresh 20:16:08Z→**20:31:08Z** 恰 900s）；CLI 复验 cache fetched **20:31:08.230Z**（=第二轮时戳同拍）
2. **config show 复验 ✓**：face=mmc/effective GLM-5.3/**source=tier2-cache-fresh 持续**/providers(1)/ladder=card-fresh，SHOW_EXIT=0；**config verify HEALTHY**（connectivity/credentials/decrypt 三 ok，VERIFY_EXIT=0）——A1 锚 sg 版终态稳定
3. 三 unit active ✓（trimc+trimodel-config+trimodel-proxy）+trimc healthz ok（cron 6 jobs degraded=false）
4. face-events 台账 10 行 ✓：第二轮 write guarded（bak-3 轮转）+applied+pull ok 全绿
5. **主卡结构恒定断言 ✓**：现行 vs 最新备份 diff=**仅 .status.at**（内容面跨轮恒定——§六 语义实证）
6. duty notify consumer 在役 ✓（seats=m-duty-cos）

**观察窗判定：PASS——sg TriMMC 接入切换收口，窗闭。**

## 使用依据

- 令文：BOD 03:37 排期令+COO 03:48 核可四裁+COO 04:02 触发令；授权链=CEO 02:43/02:44 显式令
- 基线：FSD evidence-sg-preswitch/（8 件）+本席预勘四批（03:39-03:46）
- 源码实锚：TriMMC src/server/app.ts L763-779（TRIMC_TRIMODEL_API_URL 接线）+src/notify/duty-consumer.ts L112（mailbox cwd 相对）；TriModel card-faces.js（FACES/dataDir）
- 盘面实锚：/srv/fleet/{TriModel,TriCode,TriMMC}/+trimc-start.sh（bak-201527Z）/etc/systemd/system/trimodel-{config,proxy}.service.d/override.conf+unit bak×2/dist.bak+node_modules.bak/trimmc-card.json.bak 链（-1=基线锚）
- 纪律：D-03/D-04/D-24/命令链整链断言/掩码纪律/活体优先/河源窗教训兑现（fleet 身份 build/TriCode 对平锚）

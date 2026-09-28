# R-HY rmc 卡纠正迁移·升级+切换执行读数卷（SDE 小布·范围 3+部署面）

- sourceOfTruth: 本件（P1 河源链连窗执行读数：TriModel 升级窗+切换步+TriRMC 升级窗+观察窗）
- syncMode: source-only
- lastSyncedAt: 2026-09-29T03:28+0800（date 现查 UTC=2026-09-28T19:26:27Z 终验批；观察窗终验读数=§八，全绿窗闭）
- 令链: COO 开窗令 02:53（FSD 范围 2 绿锚 496613b 02:51 达）→授权链=CEO 02:10+02:43 显式令（免知悉窗）+CTO 门审 01e9e3c8 四项 PASS+CONDITIONAL READY
- 窗时点: 2026-09-29T02:55+0800 启，连窗执行
- 边界: 本席执行部署与迁移；键值全程掩码零出机；迁移动作全程留痕（回执 id+审计行）

## 一、窗计划与部署管道

- 三阶段：A=TriModel 河源升级（锚 8de8fe7+强钉三 env）→B=切换步（rmc 建卡）+TriRMC 升级（锚 496613b）→C=观察窗≥900s+收口。
- **部署锚取舍申报**：TriModel 门审锚=e9938cc，实际部署锚=**dev 顶 8de8fe7**（=e9938cc+候修①「PUT 无 provider_entries 载荷 500→400 人话拒」CTO 已裁修复落地）——e9938cc⊂8de8fe7 无内容偏差，读数显式申报候门审面事后核。
- 管道：本机 push 双落（TriRMC `8427dfc..496613b`+TriModel `6fa5dbc..8de8fe7`，remote pushurl=sg bare+GitHub 双位）→河源 git fetch origin 双锚到手（河源两仓 origin=GitHub 直连）。

## 二、阶段 A：TriModel 河源升级（02:55-02:58）

1. dist 备份 ✓：`dist.bak-pre-rmc-20260928T185606Z`（回滚锚主案）
2. checkout 8de8fe7 ✓（detached 同现役形态）+npm run build exit=0 ✓
3. unit 强钉 ✓（drop-in override.conf+unit bak=trimodel.service.bak-20260929-pre-rmc 留痕先例）：`TRIMODEL_DISABLE_BOOT_MIGRATIONS=1`（CTO 加钉防 boot 迁移触主卡）+`TRIMODEL_CARDS_DIR=/srv/fleet/trimodel-data`+`TRIMODEL_DATA_DIR=/srv/fleet/trimodel-data`（第三键=窗内自纠增补，见 §六.2）
4. restart ✓：新 pid=1669514，active；boot 日志=`card migration: already-canonical`（迁移链零动作=强钉+canonical 判定双证）+listening 3333
5. 活体三查 ✓：①healthz ok ②卡面读链=mmc managed 视图三条件目全可读 ③分发面零扰动（glm f17f/deepseek 26f3/anthropic 2004 三键掩码逐一吻合）
6. rmc face 在册性 ✓：GET cards/rmc 空白卡形态 200（machine 默认=河源 hostname——ⓑ 引擎语义）

## 三、阶段 B：切换步（02:59-03:04）

1. **rmc 建卡 ✓（PUT 引擎面三发，见 §六自纠）**：载荷=主卡三条件目（api_key_encrypted 密文原样搬运）+model_sets(1)/rules(3)/strategies(2)+active_strategy_id+machine.name=iZf8ziw57ydktu77fsld9yZ（ⓑ 河源实锚）+connection.name=河源（正名语义）→PUT `/v1/config/cards/rmc` → `{ok:true, status:pending}`
2. managed 视图回读 ✓：present=true/machine=河源实锚/connection=河源/三条目/1-3-2/active=st_mujth2j65nch/pending
3. **pull 视图 ✓（域内解密端到端）**：三键掩码 f17f/26f3/f17f 逐一吻合（同机同用户可解预检判定的切换步兑现）；载荷含 strategy 摘要（id+rule_ids 可见）
4. TriRMC 河源升级 ✓：dist.bak-pre-rmc-20260928T190000Z 备份→checkout 496613b→build（自纠见 §六.3）→双 unit restart（8712 域面+8710 mc 门面）
5. tier1 接线 ✓：双 unit drop-in `EnvironmentFile=/srv/fleet/trimodel-data/api-token.env`（单一真源引用零值复制）+`TRIRMC_TRIMODEL_API_URL=http://127.0.0.1:3333`（app.ts L825 键名正形）→boot 日志双实例 `pulled fresh config (2 providers)`（glm+deepseek 两 vendor=卡三条件目派生语义）+refresh timer 900s
6. **A1 锚核心读数 ✓**：8712 `config show` face=rmc/effective model=deepseek-v4-pro **source=tier2-cache-fresh**/cache fresh（fetched 19:04:01Z expires+24h refresh=900s）/providers(2)/ladder(§4.3)=card-fresh（卡面入梯：env 逃生门>卡面>bundle>常量）；`config verify` **HEALTHY**（connectivity/credentials/decrypt 三 ok）
7. **三裁要点落地全验 ✓**：ⓐ 策略链三验（计数 1/3/2 对表+active 一致+pull 载荷 strategy 可见）ⓑ machine=河源实锚+connection=河源 ⓒ 主卡 md5=bac279a6…全程不变（零触碰终断言）

## 四、验收锚对表（A1-A4）

| 锚 | 判定 | 证据 |
| --- | --- | --- |
| A1 rmc 卡来源归因 | ✓ | config show source=tier2-cache-fresh+ladder card-fresh+pull 面三键吻合 |
| A2 旧卡保留+可回滚 | ✓（形态升级） | ⓒ 裁定=主卡零触碰自始（md5 全程不变）——反向迁移=移除 trirmc-card.json+TriRMC env 撤钉即回（比 rename 更简）；主卡自始未动 |
| A3 mmc 卡空白待配置态 | 剥离归 M2 | ⓒ 裁定剥离，本窗不涉（主卡保留承载现役分发面） |
| A4 零跨机文件复制 | ✓ | 全程 SSH+机内构造（载荷 python3 机内生成零落盘零出机）；git fetch 系代码管道非数据复制 |

## 五、观察窗与收口

- 观察窗：切换核心完成 03:04+900s→03:19 到期，终验读数见 §八。
- 窗内服务连续性：TriModel restart 窗 ~3s+TriRMC 双 restart ~4s；8710 公网门面短窗重启（mc ledger 客户端重连语义，候观察窗确认）。

## 六、异常与自纠实录（三项）

1. **build 假绿（命令链教训再现）**：TriRMC 首 build `| tail -4` 管道吃掉 tsc exit code（BUILD_EXIT=0 假读数），实际 `Cannot find module '@trimetaverse/tricode/trimodel-cli'`——**且 restart 已拉旧 dist**（读数险些失真）。自纠=`set -o pipefail` 整链断言+dist 产物 mtime/存在断言。在册教训「命令链断言失败须断整链」二次兑现。
2. **face-events EACCES**：rmc 卡 PUT 二发 `failed to persist: EACCES '/srv/fleet/TriModel/face-events.jsonl'`——根因=faceEventsPath=dataDir()+face-events.jsonl，dataDir()=TRIMODEL_DATA_DIR env||cwd，河源 unit 未钉→落仓根；叠加仓根 root 属主（本窗 root checkout/build 所致）fleet 不可写。自纠=drop-in 追加 `TRIMODEL_DATA_DIR=/srv/fleet/trimodel-data`（台账与卡同域语义正形）+restart+三发即成。PUT 一发另见 validateCard 拒（connection.name 必填）——守卫正常工作零写入。
3. **tier1 拉取未触发**：TriRMC 新版 config show 初读 cache none/last fetch -——根因=app.ts L825 `TRIRMC_TRIMODEL_API_URL` 未设=卡面 tier1 关闭（设计内降级：env/bundle 梯照常）。自纠=双 unit drop-in 补钉（§三.5）→pulled fresh。
4. **既有注记（非本窗引入）**：主卡 trimmc-card.json 属主=root（09-27 flash 批复制产物）在 fleet 700 目录内——server 读无碍（644），但 UI 编辑 mmc 卡走 PUT 会 EACCES——候 CTO 面裁（chown fleet 属主=主卡触碰面，ⓒ 红线下本席不动）。

## 七、回滚锚（窗前定案+现役在位）

- TriModel：`dist.bak-pre-rmc-20260928T185606Z`+git bc72ea4 回退点+override.conf 移除+daemon-reload+restart
- TriRMC：`dist.bak-pre-rmc-20260928T190000Z`+git a459491 回退点+双 override 移除+restart
- rmc 卡：trirmc-card.json 新增件 rm 即回+face-events 台账行留痕
- 主卡：自始零触碰（md5 全程 bac279a6…实证）——**反向迁移主案零动作**
- 有效性断言：活体三查（进程活着≠回滚成功）

## 八、观察窗终验（03:26-03:28，全绿窗闭）

终验批（03:26:27+0800 时点，河源 SSH 只读探针）：

1. **900s 第二轮刷新双实例成功 ✓**：8712 `refreshed config` 03:04:01→**03:19:01**；8710 同 03:04:32→**03:19:32**（journalctl 实锚，间隔恰 900s；窗内 error/warn 零命中）——定时刷新链稳定在役
2. 三 unit active ✓（trimodel/trirmc/trirmc-mc）+healthz 双 daemon ok（8712 cron 3 jobs degraded=false+mcLedger ok；8710 mcLedger ok）
3. **config show 复验 ✓**：source=**tier2-cache-fresh** 持续/cache fetched **19:19:01.820Z**（=第二轮时戳同拍）/providers(2)/ladder=card-fresh；**config verify HEALTHY**（connectivity/credentials/decrypt 三 ok，SHOW/VERIFY exit 双 0）——A1 锚终态稳定
4. **主卡 md5 零触碰终断言 ✓**：`bac279a613f3800df73f64944621dd57`（窗前/建卡后/终验三时点全等——ⓒ 裁定贯穿全窗兑现）
5. **rmc 卡生命周期闭环 ✓**：daemon 拉取应用后自动写回 status=**applied**（face-events 19:19:01+19:19:32 双写回 ok；managed 复读 state=applied at 19:19:32.372Z）——pending→applied 全链自动完成；写回轮转备份 5 件在位（.bak-190349Z/190402Z/190432Z/191901Z/191932Z）
6. face-events 窗内全 ok 零异常行（pull served entries=3 skipped=0 from=loopback）
7. 探针缺陷注记（非服务异常）：首轮 config show/verify 拒因 SSH shell 未注入 TRIRMC_INTERNAL_TOKEN（CLI↔daemon 鉴权面）；补针机内定位注入（值零回显，源=/etc/systemd/system/trirmc.service）后双绿

**观察窗判定：PASS——切换步收口，窗闭。**

## 使用依据

- 令文：COO 开窗令 02:53+窗情问询 03:04（回复 4fc8ccac）；授权链 CEO 02:10/02:43+CTO 门审 01e9e3c8+预检报告卷（rhy-precheck-report-20260929.md 含 §十二门审补注）。
- 源码实锚：TriModel card-faces.js（dataDir/faceEventsPath/FACES）/config-cards.js（pull 鉴权+水合复用）；TriRMC src/server/app.ts L815-846（tier1 接线）+src/config/key-cache.ts（FACE_ID/TRIMODEL_API_URL 参数化）。
- 盘面实锚：/srv/fleet/trimodel-data/{trirmc-card.json,face-events.jsonl,api-token.env}（fleet 属主）/etc/systemd/system/{trimodel,trirmc,trirmc-mc}.service.d/override.conf（三强钉）/var/lib/trirmc/config-cache.json/双 dist.bak-pre-rmc-*。
- 纪律：D-03 重启（systemd 形态）/D-04 时刻现查/D-24 机位断言/命令链整链断言/掩码纪律/迁移动作留痕（face-events 2 行+回执链）。

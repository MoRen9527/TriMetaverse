# E1-4 b2 精施工毕报 · sg 8712 心跳超时监测 job（spec 7bc56408b 精施工形）

- 拾取: e1b2-sg-mmc-heartbeat-watch-job-spec-20261017.md @7bc56408b（git log 验 hash 在位先于拾取）；date 现查 2026-10-17 03:2x+08（D-47）
- 承接: 首铸形（毕报-sg-e14-e15-20261017.md）经本 spec 精施工**超替**——python 观察者 disable 留档（id a5c7c6f6·enabled=false·name 注 superseded）·spec 正形 job 上役

## job 三查（读数原样）

- name=`e1-b2-8713-heartbeat-watch`·schedule=`{kind:"every",everyMs:900000}`（15min·与阈值 3 拍容忍）
- **三查：http=201 ＋ enabled=True ＋ nextRunAtMs=1792179492458**（id=4e6719fa-7612-465f-a29f-12a6f2c8e876）
- command=`node /srv/fleet/TriMetaverse/scripts/ops-local/e1-b2-heartbeat-watch.mjs`（/srv/fleet/ 布局 D-24 断言✓·/usr/bin/node v18.20.8 实跑）

## 候勘清单四项答纳

1. **挂点A 心跳数据面（勘钉毕）**：TriMLC 最后心跳时刻查询面**无活体 API/store 面**（mirror/nodes・mirror/status・heartbeat/status 全 404＋nodeHeartbeats=内存 Map〔store.ts 实勘〕＋18710 隧道不在 sg 侧〔ss 零命中〕三排他）——**钉定=TriMMC daemon 日志 mirror 行流**（TABLET-* 节点心跳经隧道达 8712 /internal/v1/heartbeat 落日志=真事件流·非推定；跨 run offset+last_activity_epoch 持久累计 gap）。观测账活体双读数在卷（02:59:10 silence=0.0／03:04:26 silence=5.3）。
2. **挂点B 告警出向面（勘钉毕）**：TriMMC notify API **POST /internal/v1/notify 存在且 200 通**（token 门内）——schema 六字段全必填＋**target_daemon 与目标席名册强制配对**（勘定=bod↔trimlc／m-duty-cos↔trimmc·probe 实测四钉）；源席=m-duty-cos 基建道（§149 代发链常态化）＋落卷 fallback 双写（window-reminders/）。
3. **TriMMC cron 白名单（勘毕=无此面）**：src/cron 零 ALLOWLIST 命中＋python3 job 注册即实跑先例（e14/e15）——spec「ALLOWLIST 追加+重启族」系 **TriRLC 面**（8711 现役）·TriMMC 免·node command 直生效。
4. **阈值 60min 首夜观测回填（观测窗开启）**：观测期告警卷带候选值标；观测账=heartbeat-observer-observations.log（python 代形首两读数 02:59/03:04 在档）＋mjs job 态面（gap 序列随 15min tick 累积）——**误报/漏报读数首夜回填后报 BOD 调定**。

## 门禁五条对照

1. 三查✓（201/True/1792179492458 原样上）
2. 触发实测（正常态）✓：手动一拍 gap=0min 零告警空转 exit0
3. 超时态实测✓（**禁构造假心跳恪守**——零停生产值守·零假心跳注入；超时态=state 回拨模拟〔测试架首笔秒/ms 单位错自领勘正〕）：ALERT gap=61min **notify_api=200**＋落卷✓
4. 回滚✓：job disable 零门槛（PATCH enabled=false 200 形·同前证）
5. D-24✓：TriMMC@sg(8712) 逐字·/srv/fleet/ 布局现勘

## 施工勘定四笔随卷

1. notify schema **target_daemon 全必填＋席-daemon 名册强制配对**（bod↔trimlc/m-duty-cos↔trimmc 实测钉·mjs 已照钉）；
2. pair-probe 测试信三封＋probe 两封入箱（测试噪音如实自领·候清理面）；
3. /var/lib/trimc DATA_DIR root 属主不可写（state 迁 ~/.trilc·G-5 族观察项随线）；
4. 首铸形 python 观察者 disable 留档（superseded 注·不删）。

—— sg 值席 COS，2026-10-17 03:2x +0800（毕报链：值席→COO→COS→BOD·候勘清单四项答纳随卷）

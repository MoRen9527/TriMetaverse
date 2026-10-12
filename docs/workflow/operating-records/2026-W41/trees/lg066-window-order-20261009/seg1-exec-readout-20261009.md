# LG-066 v3 窗 · 段1 执行卷（合并留 8712·sg 值席）

- 执行位: sg duty 值席（m-duty-cos，BOD 直派窗令 v3 正身）；施工正形=A3/A4 @84b5f9cc＋A5 @6b3e7568
- TS0=**2026-10-09T10:55:16Z**（+8=18:55:16，G-6 锚）；段1 锚 ≤19:45 达标（毕探毕 19:0x）
- 施工通道=G-3 形②（ssh heyuan 别名；形①直连 publickey 拒=预期，未动用形③）
- 红线恪守：token 值面零回显（P0.5 Environment 读数掩形）/零 root 操作/零重启本体/白名单出集即停备而未用

## P0-P6 步骤读数（全表零 fail）

| 步 | 读数 | 判 |
|---|---|---|
| P0.1 | TS0=2026-10-09T10:55:16Z | ✓ |
| P0.2 | 形① direct=publickey 拒（预期）→形② heyuan 别名 OK（iZf8ziw57ydktu77fsld9yZ） | ✓ |
| P0.3 | trirmc=active／trirmc-mc=active（双活基线） | ✓ |
| P0.4 | 8712 healthz：ok:true/service:trirmc/mcLedger:ok/cron enabled:true jobCount=3 degraded:false | ✓ |
| P0.5 | 基线 MainPID=**2064924**／ExecMainStartTimestamp=**Tue 2026-10-06 13:46:38 CST**／Environment=HOST 127.0.0.1+PORT 8712+CONFIG_DIR /var/lib/trirmc+TOKEN `<set>`+TRIMODEL_API_URL …:3333（掩形）；**TRIRMC_MC_DB_PATH 无命中**=MC-1 现值锚 | ✓ |
| P0.6 | ss：127.0.0.1:8712（本体）＋0.0.0.0:8710（mc 面基线形） | ✓ |
| P1.1/1.2 | sudo -n cp 双 unit→.bak-lg066 exit=0（白名单首验过） | ✓ |
| P1.3 | 双 .bak 在位（1623B＋553B，root 属主=systemd 目录本态非本席 root 操作） | ✓ |
| P1.4 | tar `~/lg066-backup/dropin-and-datadirs-20261009T185617Z.tar.gz` **5523 条**零错 | ✓ |
| P2.1 | **diff-exit=1 有差＝仅 updated_at 一行**（trirmc 2026-10-06T23:17:23.715Z vs trirmc-mc 23:11:47.670Z；语义字段零差；时点形合 10-07 r5 回滚段双 unit 落盘在案事件）——**照「禁静默择一」候 COO/CTO 窗内裁（GO-1 闸），毕报双刻已发** | 候裁 |
| P2.2 | python3 只读盘点（sqlite3 CLI R-HY 缺位，车辆替换如实注）：mc 库=heartbeats 203183/events 14/task_results 3；本体库=156923/0/0；mtime 均窗前 | ✓ |
| P3.1-3.4 | stop exit=0＋disable Removed ✓＋inactive/disabled ✓＋checkpoint (0,71,71) | ✓ |
| P4.1 | **前置断言过**（sudo -n -l 计数=15 行整＋施工方向 mv 条在位=X1 落地实证）→mv exit=0 | ✓ |
| P4.2/4.3 | daemon-reload exit=0／unit-files grep trirmc-mc 零命中（drop-in 孤儿原地保留=裁 2 正形） | ✓ |
| P5.1/5.2 | curl 8710 exit=7 空响应（口暗）＋ss 8710 零命中 | ✓ |
| P6.1-6.3 | healthz 全形同基线（jobCount=3）／**PID+TS 与 P0.5 逐字同=本体零触碰**／cron log 10:15:00Z 滚动活 | ✓ |

## A5 段1 毕探四件（全绿）

- P1-1：ss 8710 零行＋8712 行在＋3333 锚在；trirmc active/enabled；trirmc-mc inactive/**not-found**（unit 移位后取值=预期形）；Timestamp 原值不变 ✓
- P1-2：healthz 全形逐字（mcLedger:ok/cron 四字段同基线）✓
- P1-3：LOGSFRESH=yes ✓
- P1-4：STATEAGE=4（≤15）＋token 计数=1＋neg GET /internal/v1/agents=**401**（门在岗）✓

## MC 判读锚现值（GO 面用）

- MC-1：主 unit 无 MC_DB_PATH 键 → 段2 不补键（改动最小面）。
- MC-2：窗内复核 mc 库行数 203183/14/3 与 P2.2 基线**零变**；mtime 推进系本席 P3.4 checkpoint 自致（如实注）——无外部新写入，不立项。
- MC-3：触发条件（mtime 推进＋行数变化＞0＋内容分叉）不满足（行数零变）。不立项。
- MC-4：候段2 后复验。

## 段1 判读（A4 前置）

- GO-1：P0-P6 全表零 fail——**唯 P2.1 候裁项未闭**（双刻请裁已发 19:0x，候 COO/CTO 窗内裁）。
- GO-2：trirmc-mc 三残留断言零命中 ✓（P4.3 零命中＋P5.1 口暗＋P5.2 零 ss）。
- GO-3：本体三探针绿 ✓（P6.1/6.2/6.3）。
- **GO 判读候 P2.1 裁定落定后行**（段锚 ≤20:00；未裁=NO-GO 照规则不滑步）。

## 白名单值面抽验（§九.8 值席自查）

sudo -n -l＝**15 行整**（stop/disable/enable/start trirmc-mc＋stop/start/restart trirmc＋daemon-reload＋cp×2＋mv 回滚向×2＋tee×2＋**mv 施工向 trirmc-mc→.bak**）——与窗令 §一.3 十五行枚举逐条对表合。

—— sg 值席 COS，2026-10-09 19:0x +0800（段1 卷落树 P6.4；毕报两刻已发）

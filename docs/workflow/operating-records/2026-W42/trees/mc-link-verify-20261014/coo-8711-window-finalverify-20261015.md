# COO 终验卷 · 8711 obs 出向启用窗（w42-8711-notify-enable）·2026-10-15

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/mc-link-verify-20261014/coo-8711-window-finalverify-20261015.md
- syncMode: static（终验卷·窗毕收口）
- lastSyncedAt: 2026-10-15T09:49:42+08:00（date 现查原值·D-47 正形 A）
- 链: TD-obs-1 勘误改判（10-14 22:04·案 C 维持）→BOD 晨令②留白名单①窗→窗令 09:12（M-004 直达 SDE 抄 CTO/COS）→SDE 窗前自裁我三项全认（09:22）→窗准点 09:39:59 开链→SDE 毕报 09:45:35（@5810eab09）→**COO 终验（本卷·独立复探非转抄）**

## 终验读数（SDE 组合证四件+本席独立复探·双源对平）

| 锚 | SDE 读数 | 本席独立复探（09:49:10） | 判 |
| --- | --- | --- | --- |
| ①env file 值面对 | URL→`http://127.0.0.1:18710`·token md5h=ebfb2736 对平 8713 | 指针式认（值面 D-46 不复显·以②进程内证为实锚） | ✓ |
| ②同款载入复演 | daemon 同款 parser 逐字复刻·REPLAY OK=boot 必然同值 | （进程内证·以③活体计数面为交叉验证） | ✓ |
| ③新 uptime 段计数面 | mc 段七字段在位·notifyFailures=0/alarmSent=false 全零基线·65s 防抖终读同形·totalFailures 归零（前段累计 12 录档在卷） | healthz 直读：`mc`段 totalFailures=0/notifyFailures=0/alarmSent=false/degradedFailures=0/lastFailureAt=null——与 SDE 同形；`mc_link:connected·mc_peer:trirmc·trimc:connected` | ✓ |
| ④出向链活探针 | 18710 错 token 门探针 HTTP=401/0.16s=应用层鉴权响应·穿隧道达 sg 8712 门 | （SDE 窗内实证·链活直接证据） | ✓ |
| 三断言 | pid listen=22900==pidfile·CIM start=09:40:38·uptime 重置·watchdog Enable Ready | uptime=510 对表 CIM start（09:49:10−09:40:38=512s·2s 采样窗内对平）；serverTime 与本地时对平零漂移；daemon mode=schtasks | ✓ |
| 停摆 | ≈10s（预算 18s 内·止损富余） | 窗准点开链 09:39:59·09:42 终验毕 | ✓ |

## 终验结论

- **窗毕·销**——组合证四件全绿+本席独立复探双源对平·**「进程内生效验证非 healthz 绿」锚实质达成**（②载入复演+③活体计数面合证 boot 同值）。零回滚·零加码（窗内不制造出向·真实出向候 degraded 触发·CTO 条件形态照办）。
- 毕报链：本卷+SDE 毕报卷（5810eab09）经 COS 链呈——卡③收口附树指针（mc-link-verify-20261014 树·窗管何时干树管怎么记）。

## 卡③定谳（TD-obs-1 案 B 落地收口）

- 本窗毕=**TD-obs-1 案 B 落地毕**：8711（TriRLC）obs 出向启用——trirlc-daemon.env NOTIFY URL 改 18710 keeper 隧道形+token 对齐 8713；至此 **8711/8713 双 daemon 出向均 18710 隧道形**，卡③「链路修复」闭环。
- 链路修复闭环≠通道零观察：notifyFailures 真实出向尚未发生（零触发态如实记）——候自然触发读数入观察池⑨沿续（8713 notifyFailures=3 候自然回零同族）。

## 观察池联动

- ⑥ sg 8713 白名单补录 'trirlc-conn'——**窗毕即激活候办**（sg 面·转 BOD/值席 MMC 执行·本席不跨机操作）。
- 卡④ dim-4 24h 观察窗：totalFailures 本窗归零重计=新段起点 09:40——24h 读数锚候 CTO 复核对表（原锚 21:35 与新段起点关系随复核定性）。
- FUZZY-TS merge 豁免真仓活验锚（CTO 09:40:55 请托·COS 转）——观察池新增条（台账笔随）。

## 使用依据

- SDE 毕报卷 sde-8711-obs-enable-window-20261015.md（5810eab09·窗前勘验四发现/死值来历链/停摆/pid 代际 23780→22900 全录）；本席 healthz 直读读数（09:49:10）；窗令 09:12（护栏 CTO 终验锚）；SDE 窗前自裁三项全认回执（09:22:38）；D-47 落款对表（SDE 前信 09:24:xx 预填误自纠 09:22:24——对表抓着如实记·正形）。

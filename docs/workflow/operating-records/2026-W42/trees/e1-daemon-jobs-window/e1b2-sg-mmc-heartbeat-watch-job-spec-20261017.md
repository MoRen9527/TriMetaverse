# E1-4 · b2 跨机心跳超时监测 job 料包（sg 8712 TriMMC·sg 值席施工）· 2026-10-17

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/e1b2-sg-mmc-heartbeat-watch-job-spec-20261017.md）
- syncMode: spec（料包卷·施工位=sg 值席·M 面路由不经本席跨机）
- lastSyncedAt: 2026-10-17T03:20:00+08:00（date 现查写前跑·D-47）
- 令源: charter-2026-W42-005 E1-4 行（COO 02:40 授号·「阈值 45/60/90min 候施工定·首夜观测回填勿先验拍」）·方案稿 cto-lg088-mitigation-plan-a-b-20261017.md 件 b2（真补盲=sg 不随本机睡眠冻结·唯一不受宿主电源面影响观察者）
- 家族依据: 10-12 案 8h 停摆零告警+10-16 案 2h16m 停摆零告警——两案若有 b2 早就告警

## 〇 机制判读（候 sg 活体勘钉死·禁推定）

- 心跳源=TriMLC（本机 8713）→TriMC 链路心跳（现役：8713 healthz mc_link=connected 读数族·经 18710 隧道到 sg 8712）——**8712 侧心跳数据的存储/查询面本席未活体勘**（TriMMC store 位/DATA_DIR/API 面），料包只给判定逻辑模板，两挂点（心跳数据面/告警出向面）候 sg 值席现勘钉死后落脚本。
- 判据纪律：**心跳超时≠daemon 死**（也可能 daemon 活而宿主睡——家族两案正是后者）——告警文必须带分诊提示。

## 一 job spec

| 项 | 值 |
| --- | --- |
| 站 | sg 8712 TriMMC（M 面服务域） |
| job name | `e1-b2-8713-heartbeat-watch` |
| schedule | `{kind:"every", everyMs:900000}`（15min 巡检·与阈值关系=3 拍容忍） |
| command | `node /srv/fleet/TriMetaverse/scripts/ops-local/e1-b2-heartbeat-watch.mjs`（**路径候 sg 值席按 /srv/fleet/ 实布局断言 D-24**·TriMMC cron 白名单纪律对表——ALLOWLIST 追加+重启族·sg 8712 现役白名单面先例=trirlc-conn 补录案） |
| 阈值 | **首夜 60min 候值**（45/60/90 三候值取中·误报容忍=15min×3 拍；首夜观测回填后窗后调定——勿先验拍） |
| 幂等 | 告警态记 job 侧本地文件（DATA_DIR 下）·恢复拍（心跳回归）发一次 recovered |

## 二 判定逻辑模板（脚本骨架·挂点候钉）

```javascript
// e1-b2-heartbeat-watch.mjs —— 挂点A/B 候 sg 值席活体勘钉死
// A: 心跳数据面——8712 store/HTTP 的 TriMLC 最后心跳时刻（现勘：TriMMC node registry/heartbeat 面）
// B: 告警出向面——sg 侧现役告警通道（现勘：TriMMC notify 链/toast/mailbox·零通道则落卷+值席巡检拾取 tick 同构）
// 判定: gap = now - lastHeartbeatAt; gap > 60min && 未告警态 → 告警（文带分诊提示）+记态
//       gap ≤ 60min && 告警态 → recovered 拍 + 清态
// 告警文模板: "[E1-4 b2] 8713 心跳超时 <gap>min（阈值 60）——疑宿主睡眠（家族两案 10-12/10-16 先例）/
//             或 daemon 死/隧道断——分诊: 8713 healthz 不可达即宿主面；sg 值席勿盲目重启对端"
```

## 三 门禁（sg 值席施工照走）

1. TriMMC addJob 三查=201+next_run 值面+enabled=1（F-3 家族性·POST 201≠会触发）；
2. 触发实测：run 端点手动一拍（正常态=零告警零落卷空转）；
3. 超时态实测：候值观测首夜自然验证（勿构造假心跳停——本机 8713 是生产值守·禁为测试停心跳）；
4. 回滚=job disable（enabled=0）零门槛；
5. D-24 机位断言头：TriMMC@sg(8712) 逐字·路径 /srv/fleet/ 布局现勘。

## 四 边界与候勘清单（sg 值席答纳后随施工毕报回传）

- [ ] 挂点 A：TriMLC 最后心跳时刻的查询面（API 端点 or store 表·现勘钉）
- [ ] 挂点 B：sg 告警出向通道（现役 notify/toast 面勘定·零则落卷形态）
- [ ] TriMMC cron 白名单现值与追加链（command 条目生效面）
- [ ] 阈值首夜观测初值回填（60min 候值下的误报/漏报读数）

## 使用依据

- charter-2026-W42-005 E1-4 行原文·方案稿 件 b2 行（两案「若有 b2 早就告警」原文）
- LG-088 勘验卷 4091c1cbc（家族第二案）·10-12 前案卷（双失明元层缺口正身）
- 8712 白名单补录案先例（deploy 目录分裂假绿二勘卷 13f227846·施工时路径断言教训在案）

—— CTO 小狄（落款 date 现查原值 2026-10-17 03:20:00 +0800·发毕对表）

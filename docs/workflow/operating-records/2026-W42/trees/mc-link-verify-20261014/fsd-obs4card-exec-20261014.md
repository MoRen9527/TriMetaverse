# FSD 施工毕报 · 可观测性四卡勘修窗（8711 侧）·2026-10-14

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W42/trees/mc-link-verify-20261014/fsd-obs4card-exec-20261014.md）
- syncMode: static（单窗毕报）
- lastSyncedAt: 2026-10-14T13:31:52Z（date 现查原值·UtcNow 正形·毕报终版）
- 令源: COO 14:00:03 窗令（21:00-22:45·CEO 13:5x 批）·STE 20:56 基线信（HEAD=2e1e594·730/730 fail 0）
- 施工位: FSD 小全（m-fsd）——序 0 三卡+序 1 卡④·序 4 活体锚施工面

## 一、交付清单（四卡全毕）

| 卡 | commit/落点 | 内容 | 自测 |
| --- | --- | --- | --- |
| ① | TriRLC dev `ee59619` | postHeartbeat 失败分类日志：六型（auth-rejected/endpoint-missing/http-N/business-reject/bad-body/network-N/timeout）+ISO 时戳+settled 守卫防迟发事件双打 | 新单测 7 例真 http server 四态·全 pass |
| ② | TriRLC dev `7aa5799` | mc 失败计数投影：totalFailures 生命周期无条件累计（degraded 态也计——23h 盲区缺口正面修复）+lastFailureAt/Class+healthz 嵌套 mc 段 | 新单测 4 例·全 pass |
| ③ | TriRLC dev `d9a6254` | degraded 告警：sg notify 出向（env 两键·x-internal-token+5s 超时）+防抖 2 拍+恢复重置+notify 失败计数回滚重试 | 新单测 8 例·全 pass |
| ④ | `%LOCALAPPDATA%\tri-liveness-l1.ps1` | dim-4：8711 healthz ok:true+mc_link!=degraded 双断言·issues 进现役 $issues 链零新出向 | 干跑 OK all-dims+三态分支验证+备份对比 removed=0/added=15 纯 additive |

- 三卡共 `npm run check` tsc 零错·合计 19/19 pass（卡① 7+卡② 4+卡③ 8）。
- `npm run build` exit=0·dist 21:17:49 落·新代码断言 3 hits 在位（mcProbe/degraded alarm/healthz 投影）。

## 二、关键实现点

- **卡②无条件累计**：现役 consecutiveFailures 仅 connected 态计数且入 degraded 即清零——degraded 持续期失败不可观测（23h≈1400 次失败的投影面缺口另一半）。totalFailures 两态都计。
- **卡③ elif 不双计**：转 degraded 的那次失败计入 connected 分支（failThreshold=3），degradedFailures 从转入后起计——degraded 态 2 拍达告警阈值（照 l1 探针 debounce 同款）。
- **卡③失败重试**：notify 拒/异常→notifyFailures 计数+回滚 mcAlarmSent 允许下拍重试（自然退避=心跳 60s~5min 一拍）——防洪水与告警可靠性兼得。
- **卡③禁用面**：TRIMC_NOTIFY_SG_URL 未配置→notifyPost 不注入→告警零行为零炸（现役生产 env 未配=禁用面·候 sg 白名单补录窗启用）。
- **告警文本零敏感**（D-46 同守）：payload 只含 seat 名/状态/计数/ISO 时戳/分类串——单测含零敏感断言（无 token 字样/无 URL 形态）。
- **卡④纯 additive**：removed=0·added=15（头注释 4+dim4 段 11）——既有三 dim 结构零动。

## 三、白名单风险（随卷呈 BOD·跨机 sg 面）

卡③出向 payload `source_seat='trirlc-conn'` 系 TriMLC notify 白名单新面孔——首发可能 403 拒（照 TriMLC 勘修批④先例：先落码·白名单另窗补录）。403 会落 mc.notifyFailures 计数可观测不阻塞。**sg 面 SSH 补录跨机归 BOD**（COO 14:05 收账已认领此路径）——候窗毕毕报带出实际形态。

## 四、执行链读数（全齐）

- **SDE 重启回执（序 2·21:22:08）**：链全绿——watchdog Disabled→pid 31240 对表→/shutdown 200（token 变量化）→port FREE 21:20:10→schtasks 冷启 UP 21:20:28→watchdog Enabled Ready；三断言全绿（uptime 36876→7 重置+pid 32576==pidfile+CIM 对表+日志旁证）；毕锚=healthz mc 段投影在位 `{"link":"connected","totalFailures":0,...7 字段全零基线}`；停摆 ≈18s。
- **STE 终拍（序 3·21:22x）PASS**：全量 **749/749 fail 0 EXIT=0**（=基线 730+新增 19 精确合缝）·三新文件定点 19/19·顶三笔 hash 与毕清单逐字吻合·基座 2e1e594 未动·porcelain 0；卷锚 4707390（docs/testing/obs4cards-window-gate-final-20261014.md·主仓 dev）。
- **活体锚注入窗（序 4·21:24-21:32 我施工）四件全销**：见 §五。
- 卡④ 24h 观察窗：挂账（dim=mc 在列读数并卷候 CTO 复核——本窗干跑 2 次 OK all-dims 实锚）。

## 五、活体锚注入窗施工实录（序 4·21:24-21:32）

**施工形态（实测修正版）**：原设计 env 文件注入被 launcher 遮蔽（`trirlc-daemon.ps1` L11 硬编码 `TRIMC_BASE_URL='http://8.155.54.79:8710'` 进程 env 优先·env 文件 append 无效——第一轮重启后 totalFailures=0 照 connected 抓获）——修正为 ps1 值面注入（备份 hash D694BF9AC6BA→拒连口 `127.0.0.1:9`→PSParser 0 错）。

**三轮重启链**（正形全链·watchdog disable→pid 对表→/shutdown token 变量化→port FREE→schtasks 冷启→UP→enable）：
- R1 21:25:37 UP（pid 31260·env 注入无效轮——读数归零证伪·转化为 launcher 遮蔽发现）
- R2 21:27:52 UP（pid 31472·ps1 注入态）
- R3 21:29:57 UP（pid 23780·ps1 还原态·hash 对表 D694BF9AC6BA ✓）

**四件销项断言读数**：
1. **分类日志落形 ✓**：`[trilc:conn] 2026-10-14T13:28:31.381Z heartbeat failed: network-ECONNREFUSED`（连发型）+`timeout (5000ms)`（R3 后首拍瞬态·未达 3 拍阈值不转 degraded——阈值语义同窗活体再证）。
2. **计数投影 ✓**：degraded 峰值 `totalFailures=7`+`lastFailureClass=network-ECONNREFUSED`+`lastFailureAt` ISO 在位；恢复后生命周期重计（重启清零→首拍 timeout 计 1——connected 态失败也计=无条件累计活体再证）。
3. **degraded 告警链 ✓（带注记）**：`degradedFailures=4` 累计+`alarmSent=false`+`notifyFailures=3`——告警**真发**（TRIMC_NOTIFY_SG_URL 已在 env 非禁用面）但出向**连接级不通**（`degraded alarm notify error (will retry): fetch failed`/`This operation was aborted` 5s 超时）→失败回滚每拍重试形态活体实证（非白名单 403——是更前面的连接失败）；「告警成功一次后静默」语义活体未达（通道不通永不到成功态）·单测已实证该形（mock notify 成功→calls=1 后不重复）。
4. **恢复重置 ✓**：`[trilc:conn] recovered → connected`+终读 `mc_link=connected`+`degradedFailures=0`（照 TriMLC recovered 重置形）。
- 卡④ 终态：l1 干跑 OK all-dims（13:31:49·dim=mc 探 8711 connected 在列）。

## 六、新发现与技术债标记（识别即标记）

1. **【TD-obs-1·候 sg 面勘修】卡③告警出向通道不通**：TRIMC_NOTIFY_SG_URL 对端连接级失败（fetch failed/abort——非白名单 403·白名单问题在通道修通后才轮到）。投影面已照亮（mc.notifyFailures 计数可观测=本窗可观测性目标本身达成）。偿还路径：sg 面 SSH 勘 URL 对端活体（跨机归 BOD）→通道修通后白名单补录（source_seat='trirlc-conn'）→24h 观察窗并卷。
2. **【注记·非债】launcher 硬编码遮蔽面**：TRIMC_BASE_URL 系 ps1 L11 硬编码（非 env 文件键）——env 文件同键不生效。今窗如实记录形态；是否收编进 env 文件（launcher 只留 TRILC_ENV_FILE 指针）候 CTO 裁（涉启动链形态·本席不擅动）。
3. 注入窗期间 COS/BOD 已知会（合成告警预告·真故障判别=窗后 mc_link 仍 degraded——终态 connected 判据已销）。

## 七、复 STE 问（非门禁项·21:23 来信）

问：卡② mc-projection 4 例与卡③ 8 例是否有依赖 8711 重启后 healthz 才可真验的形态？
答：**单测面零依赖**——19 例全用真 http server（127.0.0.1 随机口+mock notifyPost），逻辑面自成闭环；活体锚段补验的是「投影面在活体 daemon 生效」（healthz mc 段 7 字段在位+三轮重启链读数·见 §五）——两面互证已齐。

## 使用依据

- COO 窗令 14:00:03+窗方案稿（coo-observability-window-plan-20261014.md）；CTO 卡④判语 14:08 转达；STE 基线信 20:56；窗前预备毕报（设计定形）；TriMLC power 段同构参照（readFailures/dispatchNotify/healthz 投影 9 字段形）；D-46 值面纪律；D-23 窗对轨（21:00-22:45 黄金位）。

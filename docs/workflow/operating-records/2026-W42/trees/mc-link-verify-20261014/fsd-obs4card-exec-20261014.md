# FSD 施工毕报 · 可观测性四卡勘修窗（8711 侧）·2026-10-14

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W42/trees/mc-link-verify-20261014/fsd-obs4card-exec-20261014.md）
- syncMode: static（单窗毕报）
- lastSyncedAt: 2026-10-14T13:18:31Z（date 现查原值·UtcNow 正形）
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

## 四、执行链读数（候填）

- SDE 重启回执：候（派工已发 21:18:31·毕锚=healthz mc 段投影在位）。
- STE 终拍读数：候（毕信号已发 21:18:31·全量预期 749/749 fail 0=既有 730 不增不减+新增 19 全过）。
- 活体锚终验（序 4）：候 SDE 重启毕后施工——受控失败注入窗设计见 §五。
- 卡④ 24h 观察窗：候挂账（dim=mc 在列读数并卷候 CTO 复核）。

## 五、活体锚终验施工设计（序 4·候 SDE 回执后执行）

窗令序 4 三件销的施工形态：生产 env 受控注入窗（~10min·双重启链正形）：

1. `trirlc-daemon.env` 备份+hash 记录（D-46：token 变量化零回显）；
2. TRIMC_BASE_URL→`http://127.0.0.1:9`（拒连口）→重启链→3 拍后 degraded；
3. 断言：daemon 日志分类行（`heartbeat failed: network-ECONNREFUSED`）+healthz `mc.totalFailures≥1`+`mc.lastFailureClass` 在位+degraded 2 拍后 `mc.degradedFailures≥2`（告警禁用面·mcAlarmSent 停 false 如实——真发链候白名单窗）；
4. env 备份回写+hash 对表→重启链→恢复 connected+`mc.degradedFailures=0` 重置断言。

风险对冲：备份+hash 对表+终验 mc_link=connected 对表（防 23h 案重演·令②四步链同款纪律）。

## 使用依据

- COO 窗令 14:00:03+窗方案稿（coo-observability-window-plan-20261014.md）；CTO 卡④判语 14:08 转达；STE 基线信 20:56；窗前预备毕报（设计定形）；TriMLC power 段同构参照（readFailures/dispatchNotify/healthz 投影 9 字段形）；D-46 值面纪律；D-23 窗对轨（21:00-22:45 黄金位）。

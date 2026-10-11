# CTO 勘修窗提案 · 两案并勘（executor 停摆家族根因 + 43480 死因面）

- sourceOfTruth: 本件（trees/1011-window-family/cto-repair-window-proposal-20261011.md）
- syncMode: static（修复窗提案·候 BOD 排窗）
- lastSyncedAt: 2026-10-11T02:07:07Z（10:07:07+08·date 现查原值）
- 提案席: CTO 小狄（m-cto）；令源链=BOD 09:58 族线三案并单裁明认收（勘读毕提案到 BOD 排窗·D-39 域内）+BOD 10:05 认收（两案并勘维持·提案到即排窗）
- 提案判: **修复窗成立，两案并勘一案修复包**——勘读段主体（源码面）已完成，增量锚=store.ts enabled 缺省位（本件 §一.4 新补）

## 一、勘读段结论汇总（源码面·已完成）

1. **TriMLC timer.ts 状态机四路径勘毕**（读毕全卷 493 行）：scheduled 正常路径（state running 写入 L234→结算映射 L251）／timeout 路径（Promise.race 600s·L398-413·status→lastRunStatus="error"+state="failed"）／catch 路径／boot sweep（陈旧 running→idle 开机归位）。「跳槽」语义=timeout 结算后 next() 自结算时刻起算下一匹配（L283-287）＝设计语义。
2. **根治包 d38a3eae（sweepStaleRunning）dist 在役实勘**：运行期 stale-running 对账（判据 state==='running' AND now−updatedAt>10min+120s·onTimerTick 锁内最前挂载·armTimer ≤60s 节拍驱动·TRIMLC_CRON_STALE_RECLAIM=0 回滚通道）——timer.js 4 命中/store.js 2 命中。真 stale 有兜底。
3. **零全局崩溃 handler 实锚**：src/index.ts+src/daemon/ uncaughtException/unhandledRejection **零命中**＝任何异步未捕获异常即 node 默认静默 crash（无日志无优雅退出）——43480 死因 BOD 三向中「独立崩溃」向**源码面成立**；executor 停摆 H2 向（unhandledRejection 打断 tick 链）同获支撑。
4. **F-3 第三型源码锚（本件新补）**：`src/cron/store.ts` L246-252 addJob INSERT **显式传 `input.enabled ? 1 : 0`**——payload 缺 enabled（undefined）→0；schema L28 `DEFAULT 1` 被 INSERT 显式列值绕过＝缺省 False 根因在 INSERT 层非 schema 层。`src/server/app.ts` L4099-4101 路由展开 body 未补 enabled 缺省。**修法候选**：addJob 入口 `enabled ?? true` 归一（最小面·向后兼容）——候窗并入。
5. **家族形态学（三形态三签名，勿互套）**：TriMMC executor 家族（nextRun 滚动+零日志+延迟自愈）／TriMLC 完成链断裂（nextRun 冻结+不自愈·10-06 l2-scan 单案在册）／8713 形 executor 停摆（healthz 假绿+38min 拍丢+l1 真告警）。

## 二、两案并勘内容

### 案一：executor 停摆家族根因勘+修
- **现象在册**：TriRMC R-HY 10-01 停摆／TriMMC sg 10-02 job ae02593a 停 68.8h／TriMLC 8713 形 10-11（01:15Z l1 真告警 bod-tick next-run-stale 38min·09:07 拍丢·healthz 假绿·重启顺带修复）。
- **根因候选**（勘读段支撑度标注）：
  - H1 完成链断裂同根（spawn error 事件未处理/boot 补跑洪峰竞态→state=running 泄漏+引擎互斥永不重触发）——与 8713 形疑同根（BOD 疑同根定性在案）；sweepStaleRunning 在役后真 stale 已有兜底，若仍停摆则 H1 弱化、H2 升。
  - H2 onTimerTick 循环被 unhandledRejection 打断+零 handler 静默僵活（healthz 假绿机理自洽——进程活着 HTTP 面绿、executor 面 dead）。
  - H3 TriMMC 侧 executor.tick() 语义另勘（跨仓独立）。
- **修复包候定**（按依赖序）：
  1. **全局崩溃 handler**（uncaughtException/unhandledRejection→结构化日志+受控 exit(1) 交 watchdog 拉起）——治静默 crash+死因可锚（**并治案二不可锚面**）。最小面：src/index.ts 入口+daemon 启动链。
  2. **完成链断裂修复**（spawn error 事件归位+boot 补跑竞态护栏）——10-06 方案门已核增 FSD scope，随本窗落。
  3. **F-3 第三型补丁**：addJob `enabled ?? true` 归一（§一.4 锚）——三行级最小改，随窗并落。
  4. degraded 对齐 per-job max（TriMLC 全局计数器掩蔽面·候办 P2）——窗内资源允许则并，不允许顺延不阻塞。
  5. sweepStaleRunning 验证项（已在役，本窗回归验证非新件）。

### 案二：43480 死因面
- **三向收窄终态**：独立崩溃向源码面成立（零 handler 实锚）；收工探针波及向候修复窗时序对表一并排除；98s 死亡窗无日志锚＝**不可锚面由修复包#1 崩溃 handler 落日志机制性解决**。
- 43480 本体死因**不再单独追勘**（业务损害≈零已收口：零拍丢+98s+watchdog 兜住）——随案一修复包落「死因可锚」防线，下不为例。

## 三、实现顺序（修复窗内）

| # | 步 | 执行位 | 门禁 |
|---|---|---|---|
| 1 | 全局崩溃 handler（src/index.ts+daemon 链） | FSD | node --check+单测；handler 注入断言（测试进程内 throw/unhandledRejection→日志行+exit 断言） |
| 2 | 完成链断裂修复（spawn error 归位+竞态护栏） | FSD | 10-06 方案门 scope 内；l2-scan 单案回归用例 |
| 3 | F-3 补丁（enabled ?? true）+三查门验证 | FSD | 新建验证 job 走三查（201+next_run_at 非空+enabled=1·双路）；验毕 DELETE |
| 4 | dist 构建+重启窗 | FSD | **锚A 三断言**（uptime 重置+pid/CIM created 对表+watchdog.log 旁证）+**executor 滚拍断言（新）**：execution_log 连续 2 拍 ok 方认完工——「healthz 绿≠executor 活」实证面升级 |
| 5 | 观察窗 24h | 值班面 | l1 探针+execution_log 滚拍连续性+崩溃日志面零非预期行 |
| 6 | TriRLC 8711 同构面回流评估 | 本席裁 | 崩溃 handler/F-3 补丁/完成链修复三件 8711 侧在位性——候下窗（与 8711 F-3 修复窗并族） |

## 四、回滚姿态

- 修复包三件独立 commit 可单独 revert；崩溃 handler 为包裹性代码零行为变更（只增日志+退出路径）；watchdog 兜底不变＝任何修复引入异常的最终兜底在。
- channel.cmd/store 面**零触碰**（本窗纯代码窗·数据面零迁移）。
- TriMLC_CRON_STALE_RECLAIM=0 环境变量＝sweep 行为级回滚通道（已建，在役）。

## 五、窗位建议

- TriMLC 源→dist 构建链一次重启生效，窗位=日间低负载窗（避开 18:00 job②/21:00 绩效 job 拍点，建议 13:00-17:00 区间或 20:00 前）；重启窗需同步知会 l1 探针面（Disabled 窗口同栏 B 备选窗方案）。
- 8711 回流窗与本窗**分仓可并行**（不同 repo 不同 daemon），建议并批不同窗或连排——排窗权归 BOD。

## 六、依据

- BOD 09:58 族线三案并单裁明认收+10:05 认收信；COO 09:43 收口回点三件移交
- 终裁卷 cto-windowb-gate-verdict-20261011.md（§二 pid 归因/§五.6 勘读段产出）
- TriMLC 源码：src/cron/timer.ts（493 行读毕）/scheduler.ts/store.ts L218-252/server/app.ts L4099
- 记忆条：trimc-mlc-addjob-divergence（家族三形态）/trilc-daemon-restart-discipline（/end 不可靠）
- 根治包 d38a3eae（sweepStaleRunning）dist 在役实勘

——CTO 小狄，修复窗提案毕，候 BOD 排窗（D-39 域内）。

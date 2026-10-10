# STE 锚对表预备件 · S3 通道维护波窗（判据→预期值面→三分法映射·SDE 毕报前预落）

- sourceOfTruth: 本件（trees/s3-channel-maintenance-wave/ste-s3-anchor-checklist-20261010.md）
- syncMode: static（锚对表预备件；实测列待 SDE 毕报卷到后逐项填充，判定随填随出）
- lastSyncedAt: 2026-10-10T13:52:18+08:00（date 现查原值·窗前自醒 13:50:38 后预备笔）
- 执行席: STE 小柯（m-ste）；令源=窗令 s3-window-order-20261010.md（BOD 12:18 认账生效）毕报链「STE 验收锚对表」环节；判据真源=cto-s3-criteria-20261008.md @5e9110b4（栏④指针·本件不转抄判据正文，只做对表形转换）
- 窗框: 10-10 周六 14:00-16:30；段1 硬绿门 ≤15:15；段2 锚 ≤16:15；收口锚 ≤16:30
- 待办触发: SDE 施工毕报卷落卷（预计 16:30 前后）→ 本席逐项对表出三分法判定 → CTO 技术收口

## 〇、窗前现势基线（对表参照·均实证在案）

| 项 | 现势读数 | 锚 |
| --- | --- | --- |
| TriRMC 探针对象 | **预期=R-HY 8710 新位**（LG-066 段2 毕 19:03:29 CST 五绿·8712 空置在 N3 观察窗 10-12 19:03）；候选单 #4 勘注（10-09 10:41「段2 取消」）已被 10-09 晚勘回 v3+段2 执行毕推翻——窗前一刻活体 curl 三态确认归 SDE（D-24 禁推定） | ste-a5-seg2-probe-readings-20261009.md @d5cde19a |
| 8711 现役基线 | job 清单=**空集**（store 零行+jobCount=0 双证）；冷启后对表锚=保持 0+degraded=false | sde-datadir-store-survey §三 |
| 双 store 面态 | trilc\（现役权威·wal 滚动）+trirlc\（历史残留）并存但**零数据分叉**（两侧 cron_jobs/execution_log 全空）→ 归一走「无分叉直接归一」轻量分支 | sde-datadir-store-survey §一/§二 |
| 归一方向 | A=ps1 链显式 TRILC_DATA_DIR=trirlc\（一处脚本 diff）；窗内动作=纯归一+可选清理 cron store 族四件（cron.db/-wal/-shm/cron.db.json）；**含密遗产（.env/keys.json）零接触** | 窗令 §十.1+CTO 12:30 收敛信 |
| 修法 | **法 B**（INSERT 后复用 update 同路 recompute 补值·store.ts L294-300 现役路径）确认毕零争论面 | 窗令 §十.3 |
| 8711 门形源码顶 | fail-closed 全局门 26720dd 08-27 双仓同批在位；运行态活体验锚=本窗探针面 | 判据卷 §1.2 |

## 一、A 区 · 缺口1 活体验收锚四步（段2 域·冷启新 build 后）

| # | 步 | 预期值面 | STE 判 |
| --- | --- | --- | --- |
| A1 | POST 新建 job（schedule=2 分钟后） | HTTP **201** | 201 ✓ |
| A2 | sqlite 只读查 next_run_at | **非空**（法 B recompute 补值生效·防漏写回归锚） | 空=FAIL（F-3 未修净） |
| A3 | 到点真实触发一次 | state 变迁 **或** RunLog 增行（两形任一即证·禁以 nextRunAt 滚动单独代触发——trimc-mlc-addjob-divergence「调度活执行停」家族教训） | 无触发实证=FAIL |
| A4 | PATCH {schedule} 同值 | next_run_at **保持非空且重排**（幂等） | 丢失/不变=FAIL |

- **回归门（段1 硬绿门 ≤15:15）**：TriRLC P0 守护套件 **59 例全绿**+全量**零新增 fail**——不过则窗止于段1 即报 BOD，A 区不执行（判据卷 §三硬绿门）。
- STE 对表附加断言：A1 建的 job 在 A4 后是否清理/残留——毕报须如实注记终态（残留 job 不阻塞判定但须在卷，防观察面遗留）。

## 二、B 区 · 探针四连对表（8711×2+8713×1+TriRMC×1）

| # | 探针 | 预期 | 判读分支 |
| --- | --- | --- | --- |
| B1 | 8711 无 token POST /shutdown | **401**（fail-closed 全局门在岗） | 200=运行态 build 早于 08-27（部署落后）→ **即升级不滑窗** |
| B2 | 8711 错 token POST /shutdown | **401** | 同上；错误 token 形态禁用真 token（红线） |
| B3 | 8713 错 token 同款一连 | **401**（TRIMC 门同构） | 200=升级项 |
| B4 | TriRMC 现役位无 token GET 非 healthz 端点（对象窗前一刻活体裁定·现势预期 R-HY 8710） | **401**=门形勘定闭环（读数入窗毕报定归属） | 200=TriRMC 残面门形缺口实锚（非本窗施工·入候选清单归因面） |

- 可选第五连：sg TriMMC（现势预期 sg 本机 **8712**·M 面 loopback）无 token GET 非 healthz 观察——窗令施工纪律 4「可带」，读到几算几，残面 1 迁移评估不在本窗。
- 判读总则：B 区任一返 200 → 窗令栏③「即升级不滑窗」生效，本席对表即标 **升级项** 上报，不留毕报后处理。

## 三、C 区 · 缺口4 DATA_DIR 归一验收锚

| # | 锚 | 预期值面 | STE 判 |
| --- | --- | --- | --- |
| C1 | ps1 链 diff | 恰显式 `TRILC_DATA_DIR` 一处（方向 A·trirlc\ 正名）；改前备份锚在位 | 多处漂移/无备份=CONDITIONAL 起评 |
| C2 | 归一后冷启 8711 | healthz 绿（trilc stop/start 权威路径·stop 前监听 pid==pidfile pid 验讫有录） | 裸杀迹/无 pid 验=如实标 |
| C3 | store 落位单一 | 日志读 store 路径**单一**（trirlc\cron.db）+trilc\ 侧不再被写（mtime 停滚） | 双写并存=FAIL |
| C4 | job 清单完整带出 | **空集基线保持**：jobCount=0+degraded=false（§三快照锚） | 基线漂移=升报 |
| C5 | 可选清理 | cron store 族四件清理毕或明确不做——两态均合规，如实录（不做不扣判定） | — |
| C6 | 含密遗产 | .env/keys.json **零接触**（候专项裁量面） | 有触碰=FAIL（越 scope 红线） |

## 四、D 区 · 并窗分线勘验（不混锚）

- 分线对象：①PENDING-RESEND 投递通道 fail kept（勘验锚=ste-8713-fix-window-regression-20261006.md §七.5 时序注+§八 终局注记）②sg TriMMC POST 403 共享通道缺陷（勘验锚=cto-final-acceptance-20261008.md §三.2 三要素：403 定性/GET-POST 同 token 分叉/token len=64 tail=4aa5 一致）。
- 边界：与四缺口**不同源分线**（判据卷 §三定性）——分线读数单独记录单独判定，**不并入 A/B/C 区判定**；两线同源则一修双销、异源则分修，判定归 CTO。
- **本席 PENDING-RESEND 通道勘验零处置权**：只对表读数（403 分叉/token 长度比对等）不代施工不代修，分线结论供 CTO 归因。

## 五、E 区 · 安全红线核对表（窗毕逐条勾验）

- [ ] 窗内**禁对 token /shutdown 真停探针**（防自停 8711）——对 token 200 真停验证挂下次正规服务重启窗（判据卷 §四.2）
- [ ] token 值面零回显（毕报卷内 token 全掩形）
- [ ] 8711 重启走 trilc stop/start 权威路径，禁裸杀；stop 前验监听 pid==pidfile pid
- [ ] 备份锚先行（cron store+ps1 链改前备份在位）
- [ ] sg TriMMC 8710 迁移评估不在本窗（防范围爬升）；#3 TriModel 面不入窗（CTO 裁后窗）；#4 一钥双用候审非确认入窗
- [ ] 超锚时点即报 BOD 不静默拖窗（M2 regime）

## 六、三分法映射（本席判定规则）

- **PASS**：段1 硬绿门过（59 例全绿+零新增）+A 区四步全过+B 区四连全 401+C 区 C1-C4/C6 全过+红线核对全清。
- **CONDITIONAL_PASS**：主体过但有非阻塞项（C5 未做/残留 job 未清/B4 对象为 8712 旧位/分线勘验读数待归因不阻塞四缺口）——逐项列明候 CTO 确认。
- **FAIL**：段1 门不过／A 区任一步断／B 区任一返 200（升级项）／C3 双写并存／C6 含密遗产被触碰／任一红线破。
- 判定权分界：STE 面只出对表读数与三分法判定建议；技术归因与收口归 CTO（判据卷 owner），督办收口归 COO。

## 七、实测列（SDE 毕报卷到后填充）

- 待填：A1-A4／B1-B4(+B5)／C1-C6 逐项实测值+毕报卷 hash 指针——随填随出区判，毕报链照窗令（STE 锚对表→CTO 技术收口）。

## 使用依据

- 窗令 s3-window-order-20261010.md（四栏制·BOD 12:18 认账生效；§十窗前三件实锚注记 @dfe539a6）
- 判据卷 cto-s3-criteria-20261008.md @5e9110b4（§二四缺口判据/§三三栏/§四风险——判据真源，本件只做对表形转换不转抄正文）
- sde-datadir-store-survey-20261008.md（盘点卷·§三空集基线）
- s3-candidates-20261008.md（两候选单分线勘验锚指针+§四窗前一刻对象裁定勘注）
- ste-a5-seg2-probe-readings-20261009.md @d5cde19a（TriRMC 现势基线：8710 在役/8712 空置·N3 观察窗在册）
- 记忆条：trimc-mlc-addjob-divergence（nextRunAt 滚动禁单独作活信号）／trilc-daemon-restart-discipline（stop 前 pid 验）／trilc-cron-command-allowlist-exact-match（store 落位）

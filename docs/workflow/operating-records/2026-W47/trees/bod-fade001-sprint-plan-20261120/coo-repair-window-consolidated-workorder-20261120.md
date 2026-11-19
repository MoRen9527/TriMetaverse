# COO 勘修窗并批统排派工单（WO-RW1-20261120·非 sprint 收官窗项·开工条件=09:00 收官窗毕·2026-11-20）

- sourceOfTruth: 本单（trees/bod-fade001-sprint-plan-20261120/coo-repair-window-consolidated-workorder-20261120.md·勘修窗统排派工单正身·树协议 face 路由拾取）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 派工单号: **WO-RW1-20261120**
- **开工条件（显式防误拾）**：**sprint 收官窗（→09:00）毕后开工**——事件驱动=BOD plan-list 终态报 CEO 毕（冲刺机制承录）——09:00 前零拾取零施工（COS 交单承录「sprint 收官窗 COO 面零新派项」同向）
- 令源: COS 交单 07:17（D-27 v4 链·台账 769·33295ef442）+CTO C2 尾项排工令（cto-c2-tail-dispatch-20261120.md·0ba8e3959·分期裁=双侧接线+C3 门不入 sprint 收官窗）+CTO R6-hook 门禁卷 54189048a+勘修窗候选债清单（审查卷 §四）+m-cto 06:37 信 ③④ 段
- 落款: 写前现查 2026-11-20T07:18:22+0800（D-47 正形）

## §一 · 排程定谳（勘修窗=09:00 后晨窗·并批三族）

- 勘修窗=晨窗形态·零时点门（09:00 收官毕事件触发）·三批并行度=批 1 先行·批 2 候批 1 重启窗·批 3 随窗轻量。
- CTO 排序意见承录（COS 交单随单）：**债② abort 防御=勘修窗首项候选**·之后接线与债 1/6 部署面供给可并窗。

## §二 · 并批拆树（批 1-3）

| 批 | 内容 | owner | 开工条件 | 门禁/验证 |
|---|---|---|---|---|
| **批 1（首项）** | 债② TriMLC 同族端点 abort 防御（码面勘修·TriMLC 债 3 项之核心）→**TriMLC 重启装载 fddb630**（重启照正形链：watchdog Disable→/shutdown→port FREE→冷启→pid/CIM 对表→Enable） | CTO 域+fsd（码面）·sde（重启窗执行） | 09:00 收官毕 | 码面白盒+重启后值面探针（非 healthz·完工判据=变更值面） |
| **批 2（并窗·候批 1 重启窗）** | ①**令 3 双侧消费面接线**（TriMMC package.json 改 @tricompany/orchestration-kit 依赖+活体重启窗兑现·fsd TriMMC 面+TriRMC 同形河源窗·值席/执行线）——**高风险面：现役 daemon 依赖变更·重启窗内做·回滚锚=package.json revert·裁据=半接线态比未接线更差（CTO 分期裁承·不入 sprint 收官窗）** ②债 1 port 缺省+债 6 TRILC_INTERNAL_TOKEN 单值源根治+setx 过渡 ③R6-hook cleanup 真跑（**前置=批 1 重启装载毕**·旧 daemon 无 abort 防御=真跑并发写面崩险位·m-cto ③承） | fsd（TriMMC 面）+sde（重启窗+供给面）+值席线（TriRMC 河源窗） | 批 1 重启装载毕 | 接线活体读数（双侧消费面对表）+cleanup 真跑读数+token 供给值面勘（D-46 脱敏形） |
| **批 3（随窗轻量）** | weekly-plane-shift error 只读勘+keeper 旧残留 17028 成因勘+债 5 push 补推+C2 P1 演进清单（timeout/幂等守卫/错误类型化+fsd k4 dispatch 计数器）+fsd 债 k1/k2/k5 | 各域随窗（SDE 只读勘+fsd 演进清单） | 09:00 收官毕·随窗穿插 | 只读勘=零写面·毕报落树；演进清单=fsd 窗内自排·CTO 门禁 |

- C3 P1 验收门（四仓活体对表+md5 复验+family 过滤断言案活体跑）=**C 线验收件·候 C2 施工毕触发**（CTO 分期裁承·不入勘修窗并批——C2 施工现役在工·验收窗随施工毕另落）。

## §三 · owner 对表与护栏四族（件6 班组合同要件）

owner 分工照上表（批 1=CTO 域+fsd+sde 重启窗／批 2=fsd+sde+值席线／批 3=各域随窗·COS=催办跟踪+台账闭环／本席=统排+督办读数随到随记）。

1. **触面限定**：勘修窗触面=各批载明面（TriMLC 码面+重启窗/TriMMC+TriRMC 接线面/供给面 token）——**零触 sprint 收官窗在途面**（N5 终形段/C2 P1 施工现役/C3 候面）·零触 sg 现役资产（MMC 8712/web 8791）·TriMLC/TriMMC 重启照正形链·**TriMLC 重启窗=批 1 内唯一窗（cleanup 真跑前置+债 2 装载一并兑现·防双重启窗）**。
2. **回滚锚**：package.json revert（令 3 接线）·码面单笔族 revert（债 2/债 1/债 6）·重启回滚锚=现役 daemon 基线（重启前 pid/config dump 留档）。
3. **止损线**：两法受阻挂账收笔零恋战·止损评估读数回 COS 候裁·勘修窗零赶工（sprint 收官窗纪律同构）。
4. **值守位**：各批 owner 自守+COS 督办线随行+BOD 值守（09:00 后转值守态）+本席督办读数随到随记台账。

## §四 · 督办线与收口读数

- 收口读数链：批 1 毕报（码面+重启值面探针）→批 2 接线活体读数+cleanup 真跑读数→批 3 随窗毕报——随到随记台账。
- C3 P1 验收门另落（候 C2 毕·COS 域随线）。
- 本席不代划项（勘修窗项归 COS 台账闭环域·本席督办字段随记）。

## §五 · 使用依据

COS 交单 07:17（D-27 v4 链·台账 769·33295ef442）；CTO C2 尾项排工令 0ba8e3959（分期裁+令 3 高风险面裁据）；CTO R6-hook 门禁卷 54189048a（债 6 立项+cleanup 前置顺序注）；m-cto 06:37 信 ③④（TriMLC 重启前置+勘修窗债清单候统排）；件6 班组合同要件；D-27 v4/D-39；TriMLC 勘修窗实操序先例（trimlc-repair-window-20261011·重启链正形）；D-24/D-46/D-47。

—— COO 小营（m-coo·勘修窗并批统排派工单 WO-RW1-20261120）·写前现查 2026-11-20T07:18:22+0800（D-47 正形）

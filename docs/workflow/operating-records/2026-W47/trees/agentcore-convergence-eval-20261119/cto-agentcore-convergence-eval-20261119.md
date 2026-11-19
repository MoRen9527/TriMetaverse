# agent-core 共性收敛评估卷（notice-231 款二·CTO 双席评估·独立树·平台架构域）

- date 现查: 2026-11-19 23:0x CST（D-47）
- 评估人: CTO 小狄（双席落树·CPO 并行面=产品语义侧·独立树承 CEO 22:35 挪域原则——平台架构域不混 fade001 实例域）
- 评估形: 四仓源码活体现探（TriRLC/TriMLC/TriRMC heyuan+TriMMC sg·模块清单+编排层 md5 对比）——深勘注=模块名/hash 级（逐文件 diff 候细勘窗）

## §一 盘点面（四仓源码活体）

| 仓 | 模块数 | 结构定性 |
|---|---|---|
| TriRLC（heyuan·R 面本地） | 35 | local 域族 |
| TriMLC（heyuan·M 面本地） | 34 | **RLC 孪生**（近同族差 1-3 件） |
| TriRMC（heyuan·R 面服务） | 24 | service 域族 |
| TriMMC（sg·M 面服务） | 28 | **RMC 孪生**（RMC+daemon/fade/internal-token/notify 四件） |

- **双孪生结构发现**：service 孪生（MMC/RMC）共名件 11+（agent-loop/comm/context-builder/memory-injector/orchestration/pipeline/policy-gate/prompt-cache/soul-loader/task-controller/tool-gater）；local 孪生（RLC/MLC）共名件 20+（company/event-queue/localbus/session-store/task-runtime/toolbus/sync/services/skills/tray/wallet-upgrade…）；跨域 infra-common（cron/heartbeat/mirror/contracts/config）四仓全持。

## §二 编排层漂移孪生实锚（收敛核心案）

**MMC/RMC 编排层=九文件名全同·内容全 DIFF**（md5 六对实测全 DIFF：session-bridge/dispatch-proxy/employee-registry/employee-scheduler/capability-router/cost-controller）——**漂移孪生**=复制后分仓各自演化·单侧 bug 修复不互通=双仓维护成本×2+漂移风险现役态。此=收敛需求的核心实证案（非理论需求）。

## §三 共性功能归集矩阵（收敛荐面）

| 功能域 | 现役载体 | 跨仓重复 | 收敛荐 |
|---|---|---|---|
| agent loop 引擎 | @tricompany/agent-core | 已共用 | **已收敛先例 ✓**（形态承录） |
| 模型客户端 | trimodel（TriModel 仓） | 已共用 | 已收敛先例 ✓ |
| **编排九件** | MMC/RMC 漂移孪生 | 9/9 双仓全漂移 | **荐收敛·P1 案**（独立包形见 §四） |
| loop 配套族 | MMC/RMC 共名（context-builder/prompt-cache/policy-gate/tool-gater/task-controller/soul-loader/memory-injector/pipeline） | 高（diff 候勘） | 荐勘后收敛·P2 |
| local 域族 | RLC/MLC 孪生族（session-store/task-runtime/toolbus/sync/services…） | 高 | 荐收敛·P3（local 域库件·包形候勘） |
| infra-common | 四仓各持（cron/heartbeat/mirror/notify/observability） | 4/4 | 荐收敛·P2/P3 |
| daemon 专有 | 各仓专有（server/gateway/tray/tui/fade/wallet-upgrade/authz…） | — | **不收敛**（宿主面非共性） |

## §四 收敛判据与包形荐

- **判据四条**：≥2 仓使用／agent 域语义（非宿主传输面）／无 daemon 专有耦合／漂移成本>收敛成本（漂移孪生实证=判据④活体）；
- **包形荐=两包形**：@tricompany/agent-core=**agent 运行时原语**（loop 引擎+会话原语——现役定位扩容）；**@tricompany/orchestration-kit=编排语义件**（编排九件收敛位·独立版本独立回滚——零强扭进 agent-core）；
- **风险面**：收敛=跨仓大重构（接口对齐/版本化/双侧回归）——**分批形强制**（P1 编排九件→P2 配套/infra→P3 local 族；每批=单仓试收敛→回归绿→他仓迁移）；b 案直切形态下=跨仓协同工程（sg M-SG+R-HY 双侧·修 E 护栏联动·候 COO 排）。

## §五 与 notice-226 loop 本体关系

loop 本体（轮间推进语义）× orchestration-kit（会话原语/编排件）=**互补分层**（notice-229 采认段同构注承）——loop 引擎消费 orchestration-kit 原语为 spawn/送信承载面（S2 候勘注联动）。

## §六 建议结论（候裁面）

1. **收敛成立**（漂移孪生实证·判据四条全过）——非理论需求系现役维护成本实态；
2. **起步=P1 编排九件两包形**（orchestration-kit 独立包·MMC/RMC 双侧试收敛）；
3. **款三顺序锁承录**：上轮第 6 问激活面=候本评估毕再决定（本卷即=评估毕呈报·激活时点/形态决策依赖解除面候 CEO/COO 令）；ns9 不走+b 案直切不变 ✓。
4. CPO 并行面汇流=席位体验侧收敛判据（本卷=技术架构侧）。

## 使用依据

四仓源码活体清单（TriRLC 35/TriMLC 34/TriRMC 24/TriMMC 28·ls 实锚）；编排九件 md6 对比实锚（全 DIFF）；bod-agentcore 事实卷（trirmc-orchestration-fact 树 Source 锚）；notice-231 款二/款三；notice-229 采认段；D-24/D-46/D-47。

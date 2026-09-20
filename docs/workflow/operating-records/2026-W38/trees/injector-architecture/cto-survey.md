# 注入器架构统一·命题 A 实勘件（CTO 技术域）

- sourceOfTruth: 本件（四 daemon 注入能力现状矩阵；命题 B-E 方案件的实勘基线）
- syncMode: draft（实勘件）
- lastSyncedAt: 2026-09-20T22:2x+0800（date 现查 22:24:59，本回合执行）
- 实勘法: 四仓源码 grep+两仓同构件逐文件 diff+语义甄别（本回合三组）

---

## 〇、四 daemon 注入能力现状矩阵

| daemon | 知识注入器 | 喂食对象 | 形态判定 |
| --- | --- | --- | --- |
| **TriMLC**（M 面本地 8713） | **有**——四件全同构（inject/knowledge-db/metrics/sync） | 13 席 M 面会话（session-initializer/contract-resolver/agent-runner 三消费方） | 并行复制体 A |
| **TriRLC**（R 面本地 8711） | **有**——同四件（认定为原件/或互为复制，diff=0 无法判先后） | R 面 agent 心跳运行（agent-runner） | 并行复制体 B |
| **TriMMC**（M 面服务域） | **无知识注入面**——grep inject 命中=DI 术语（AgentLoopDeps「injected into agentLoop」非知识注入）；knowledge 命中=Python 心跳检查器非注入 | —（配置分发/代理面，无会话喂食职责） | 无（现状合理） |
| **TriRMC**（R 面服务域） | 本地无仓，N/A（按 sg 部署副本口径，服务域控制器无注入职责推定，候 R 面线确认） | — | N/A |

## 一、错位深浅改判（对 BOD 预勘的关键修正）

**BOD 预勘「M 面班底喂食管道住在 R 面本地域仓里，归属错位坐实」——实勘**不成立**：TriMLC 仓内有**自己的完整四件**（`TriMLC/src/knowledge-injector/`），13 席 M 面喂食走 TriMLC 自有复制体，不跨面复用 TriRLC 件。面隔离语义未破。

**真问题换位=同构双复制体的单一真源缺失**：
- 两仓四件本回合逐文件 diff=**0（逐字节同源）**——今天的零漂移是复制时的状态；
- 漂移风险=进行时：两仓 app.ts 复制体 5+5 红同族（认知层联审已登记的既有债）即为同模式先例——**改一边不改另一边，diff=0 随时破**；
- 且无同步机制（无 pipeline 对账/无共享包引用）——纯靠人肉记忆双改。

**服务域空格（新发现）**：sg 侧 13 席会话（tmux 活席）当前**无知识注入**——TriMMC 无注入面+sg 无 TriMLC 等价物。是缺口（服务域席位不吃认知资产）还是合理（服务域会话形态不同）——命题 C 决策权/产品面裁，本件如实呈现。

## 二、复用/共享度补充读数

- 知识 DB 位：两仓各自 `getKnowledgeDbPath`（multi-project-router 按 projectRoot 路由）——DB 按**项目实例**分库，非共库；同构代码+分库实例=「同一套逻辑跑两个世界」。
- consumption 审计：两仓各自的 knowledge.db 内 knowledge_consumption 表（首落② 判「现役已覆盖」按各自实例成立）——**审计面已天然按 daemon 分片**，命题 D 的「四端统一或集中」实为「两活跃端（MLC/RLC）+两无端」的形态。
- sg TriMMC 的 Python 心跳 checker 与注入器无关（语义甄别排除）。

## 三、给命题 B-E 的实勘输入

- **B（形态三案）**：现状=第四种形态「同构复制体」已在运行（各 daemon 内嵌的特例：零漂移复制）——三案并评须先解释为何现状不可持续（漂移风险+双维护）再裁去向；
- **C（决策权）**：现役触发=消费方三处主动调用（会话初始化必注+心跳按需）——已是「系统按调用点自动」，无席位自请通道；
- **D（审计对齐）**：两活跃端分库审计已对称（同构件+同表结构）——统一问题=查询聚合面（跨库两查询→一查询），非结构改造；
- **E（衔接）**：injector sync.ts 直读源侧 source-agents（认知层线已背书零渲染副本）；knowledge.db 的 .tricompany-cognition 落点=运行腿（双腿裁定兼容）；kernel 收编候触发项与本命题共用「运行需求触发」里程碑。

## 四、使用依据

命题书 task-charter-20260920-injector-architecture+BOD 预勘；本回合实勘（四仓 grep+diff=0 逐文件+TriMMC 语义甄别+multi-project-router 分库路径）。

# CTO / CPO Review 后的优化方向

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/tricompany/05-cto-cpo-review-后的优化方向.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

## 1. 这份升级清单解决什么问题

写 training 文档时最容易犯的错误，是把“已经有的东西”与“接下来准备做的东西”混写。  
因此本章专门把 CTO / CPO 的 review 结果整理成升级清单，让团队知道：

- 当前最该强调什么；
- 还不能夸大什么；
- 下一阶段该往哪里补。

## 2. CPO 视角：先做可卖、可管、可复盘的小闭环

CPO 给 training 的核心要求可以总结为三句：

1. `TriCompany` 要被讲成 **TriMetaverse 在元现实层的最小经营载体**，而不是抽象未来公司概念。
2. 当前目标是 **先跑小盈利闭环**，不是先追求“大而全”。
3. 员工体系、发布链和治理链的价值，要落到 **更快试点、更低协调成本、更清楚责任边界** 上。

所以产品侧优化方向主要有四条：

- 把当前商业实验说得更清楚：先围绕小而真实的付费闭环持续验证。
- 把岗位引入逻辑说得更清楚：每新增一个岗位，都要回答它解决了哪一个经营瓶颈。
- 把 training、workflow、registry 与实际试点节奏联动起来，不让培训包脱离当前业务。
- 在未来版本里形成更清楚的岗位价值视图：每个岗位对收入、成本、交付、质量分别贡献什么。

## 3. CTO 视角：把 source -> publish -> live -> runtime 继续做硬

CTO 对 training 的关注点更偏工程纪律，尤其强调四件事：

1. **source -> publish -> live 链必须显式**，不能让 support bundle 或 live 入口被误当真源。
2. **当前 Copilot-host 本地手动版阶段与未来 TriMC 服务器正式版上线必须严格区分**。
3. **validation、manifest、binding、runtime namespace、audit** 这些机器层对象必须持续增强。
4. 现有总助样板很重要，但不能让整个系统长期压在总助单点上。

因此技术侧升级方向主要包括：

- 让更多岗位具备完整 source kit scaffold、validator 与 binding profile 链。
- 让更多岗位具备类似总助的 wiki spec / page spec / audit / workbench 体系。
- 让 support bundle 更接近单向发布物，减少 source 与 support 双写感。
- 让 `TriModel` 与未来 `TriMC` 服务器正式版的上线条件更明确、更可验证。
- 让 handoff checklist、completion tracking、owner signoff、host readiness 等门禁更标准化。

## 4. 当前最值得推进的几项升级

结合 CPO 与 CTO 的共同意见，最值得优先推进的升级可以归纳成下面六项：

| 优先级 | 升级项 | 目的 |
| --- | --- | --- |
| P0 | 继续压实 source-first 纪律 | 防止 support bundle 和 live 入口变第二真源 |
| P0 | 扩展员工统一发布链到更多岗位 | 降低总助单点压力，形成可复制 onboarding 模板 |
| P1 | 强化 handoff / completion tracking | 让岗位变动与交接更可工程化 |
| P1 | 扩展 wiki schema/spec 体系 | 让更多岗位具备可编译、可审计、可审批的知识页面 |
| P1 | 增强 host validation 与 readiness | 为未来 TriMC / TriModel 正式切换准备更硬的门禁 |
| P2 | 把经营指标与岗位运行证据进一步联动 | 让岗位价值、成本与业务结果可被持续评估 |

## 5. 当前态与目标态再强调一次

### 当前态

- 重点是让最小经营闭环真的跑起来。
- 岗位体系在渐进启用，不是一次性铺满。
- 当前宿主是 `Copilot-host`，而不是正式的 `TriMC` 运行面。
- training 讲义的任务是帮助接手，不是宣告系统已经成熟。

### 目标态

- `TriMC` 完成自身正式接管，`TriModel` 接管宿主切换。
- 更多岗位拥有标准 source kit、binding、workspace、wiki spec 与 audit 体系。
- 更多交接、审批、运营与交付动作具备结构化证据和自动门禁。
- TriCompany 从“最小经营闭环”继续长成“接近全自动运行的 AI 治理公司”。

## 6. 本章小结

如果把本章压缩成一句话，就是：**CPO 要求 TriCompany 先证明自己是一个能赚钱、能交付、能复盘的经营载体；CTO 要求这套经营载体的岗位、发布、宿主与审计链都足够硬，能为未来 TriMC 服务器正式版和更强自动化留出清晰升级路径。**  
这两条要求叠加起来，正好定义了 TriCompany 下一阶段该怎么继续长。

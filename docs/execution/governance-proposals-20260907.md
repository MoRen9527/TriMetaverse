# 治理提案集 20260907：文件夹职能 / M-R 面拉取范围 / FADE 治理与知识管线

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/governance-proposals-20260907.md
- syncMode: source-only
- lastSyncedAt: 2026-09-07

**状态：候审草案**（RDT 小吴整理成稿，2026-09-07；CEO 席直入多点定调的成文化。路由=COS 收口→**CAO 汇报 CEO 审批**；提案 B 另标 COS/CPO/CTO/CAO 四席联审；提案 C schema 段候 CTO/CPO。本件不动真源不实施。）

---

## 提案 A：任务方案生命周期与文件夹职能划分

**CEO 定调**：非跨模块任务方案放模块内（如 TriCompany）；未成熟方案与成熟任务分开落位；成熟后挂周工作平面被自动拾取；跨模块任务才进 TriMetaverse/docs。

### 现状惯例（实勘）

| 位置 | 现行职能 | 例证 |
| --- | --- | --- |
| `<模块>/docs/engineering/` | 模块**技术真源**（协议/登记册/纪律/试卷） | fade-protocol-spec、fade-registry、fade-papers |
| `TriMetaverse/docs/execution/` | 设计/执行文档（成熟方案书、评估件、勘定书） | lg-028 review、lg030 勘定书、BL 草案 |
| `TriMetaverse/docs/workflow/` | 工作流协议+周平面 operating-records | dynamic-task-tree-protocol、2026-W37 |
| `TriMetaverse/docs/`（根） | 中央面：training 聚合、registry、跨模块治理 | github-repo-governance、training |
| `<模块>/docs/workflow/` | 模块工作流真源 | TriCompany sync-ade 规范、hub-ledger-governance |

### 提案：任务方案四级生命周期

```text
①草案（未成熟）   → <模块>/docs/engineering/task-drafts/（模块内任务）
                    TriMetaverse/docs/execution/（跨模块任务）
        ↓ 方案成熟（评审过）
②执行方案（批准） → <模块>/docs/execution/（模块内）
                    TriMetaverse/docs/execution/（跨模块）
        ↓ CEO 批准拆树
③挂平面（可拾取） → 周平面 trees/<id>/tree-op.json（FADE-006 三重门拾取）
        ↓ 执行收官
④归档/真源化      → 事实进 registry/协议正身；历史叙事冻结
```

**待裁点**：a1. engineering 下是否设 `task-drafts/` 子区（技术真源与未成熟方案分居，防混淆——本席倾向设，样本=task-20260907-TriCompany-event-watch.md 现暂平铺 engineering，候裁后归位）；a2. 任务书命名规范（现例 `task-YYYYMMDD-<Module>-<slug>.md` 是否定版）；a3. "成熟"判定标准谁签（域 owner 还是 CEO）。

---

## 提案 B：M/R 面环境分级与拉取范围清单化

**CEO 定调**：R 面原来拉整仓，应改为只拉取（1）可进入生产成熟态的模块/文件夹（如 TriMetaverse 的 docs/execution、docs/workflow/operating-records）+（2）生产运行必需的非成熟模块/文件（TriCompany 代码、docs 一部分、source-agents 全部、TriModel、TriRMC、TriRLC、TriMMC、TriMLC 等）。R 面 MC 与 LC 操作**同一拉取范围**的各仓。定位：**M 面=dev 环境，R 面=pre（预发布）环境，prd（生产）环境未建**。核心治理目标：成熟文档落 R 面、不成熟留 M 面，防污染防垃圾。

### 现状（实勘）

- R 面拉取现役=整仓 clone/pull（heyuan tricompany-pull 15min cron job fba9d2c7 为已注册样本）；R 面 MC+LC 各自面对仓库，无统一范围约束。
- 拉取范围无清单化载体——"R 面该有哪些东西"目前靠惯例不靠登记。

### 提案：拉取范围清单（pull-scope manifest）+ 环境分级立法

1. **环境分级入册**：M=dev / R=pre / prd=规划中——入 whitepaper 拓扑节+LG-031 M/R 矩阵注记。
2. **每仓一份拉取范围清单**（仓 × 路径 × 成熟度 × 必要性 四字段），真源落中央（候选：TriMetaverse/docs/registry/ 或 docs/execution 定版后迁 registry），R 面 MC/LC 拉取行为=清单投影（sparse-checkout 或脚本过滤，机制候 CTO）。
3. **成熟度判定与升降级**：文件夹从"不成熟（M-only）"升"成熟（R 可见）"走评审（域 owner 签+CAO 登记+r 面生效读数）；降级同理。防重叠防垃圾=每次新增路径必须答"R 面为什么需要它"。
4. **docs 标准子文件/文件夹重审**：CEO 定调 COS/CPO/CTO/CAO 四席共同参与——重申既有"docs 必须的标准子件"治理（github-repo-governance 系），清理无用文件夹与功能重叠，产出**标准目录宪法**。

**待裁点**：b1. 清单 schema 定稿与真源落点；b2. 拉取机制选型（sparse-checkout / 脚本过滤 / 分仓）；b3. 巡检断言（R 面实盘=清单投影的核对法，齿条同款）；b4. 违反清单的拉取如何告警；b5. 四席联审排期。

---

## 提案 C：FADE 治理归属 + inbox→schema→wiki 知识管线

**CEO 定调**：FADE 实例=公司办公流程的标准化形态，可跨部门自动协作，**归 COS 制定、管理、维护**；COS 负责总结工作经验。建立 LLM wiki 全套进化：

```text
工作经验总结
  → TriCompany-copilot-host-assets/knowledge/employee/ceo-chief-of-staff/inbox/（收件箱）
  → 【schema 层规则处理】（候 CTO/CPO 设计）
  → …/knowledge/employee/ceo-chief-of-staff/wiki/（标准化知识库）
  → 沉淀为 FADE 实例提案（标准化流程候选）
  → CEO 通过 → 进任务书文件夹（落点 COS 定；候选=提案 A 的 task-drafts 区）
  → 多轮讨论修订 → CEO 正式批准 → docs/execution/
  → 挂周平面 → 自动拾取执行 → 成为标准 FADE 实例
```

**要点**：这是把"经验→提案→批准→实例"的全链路管道化——每一段有明确落点、明确的处理者（inbox 靠 COS 总结/schema 靠规则/提案靠 CEO 批/实例靠 FADE-006 拾取），自动化流水线随实例积累越来越厚。

**待裁点**：c1. schema 层规则设计（输入形态/输出契约/质量门——候 CTO/CPO 方案先行）；c2. inbox 写入边界（谁可写、去重、防垃圾）；c3. wiki 面与 governance-memory-index（LG-016 件 1）的关系（互补 or 合并）；c4. 任务书文件夹落点 CEO 授权 COS 定（候选=提案 A 的 engineering/task-drafts）；c5. 提案→批准→execution 的状态流转登记载体。

---

## 三提案的共同治理原则（提炼）

1. **每一份文档/任务/知识都有唯一落点和明确生命周期**——"它在哪"=“它处于哪个阶段”。
2. **成熟度是显式状态不是感觉**——草案/批准/在役由评审动作定义，不由存放位置暗示（位置只是状态的投影）。
3. **环境分级=可见性治理**——dev（M）全量、pre（R）清单化投影、prd（未建）最小集；污染防护靠清单+断言不靠自觉。
4. **自动化流水线的每一段都要有 owner、有审计、有终态**——这正是 FADE 哲学在公司知识层的应用。

## 使用依据

- CEO 席直入定调原文：2026-09-07 多点（任务书命名与落点意向/M-R 拉取范围与 dev-pre-prd 分级/四席重审 docs 标准/FADE 归 COS+inbox-schema-wiki 管线全链描述）——终端原文在卷，候 BOD 补录
- 现状实勘：本席 2026-09-05..07 教程与治理件工作底稿（fade-002/001 四版、勘误域草案、LG-030/031 台账锚）
- 体例：候审草案（同 fade-doc-drift-candidate-draft.md 先例）

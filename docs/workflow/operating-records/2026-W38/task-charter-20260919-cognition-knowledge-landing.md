# 任务书·认知层落点归一联审（CPO×CTO）

- sourceOfTruth: 本件=董事会任务书（联审派工凭据）
- syncMode: static
- lastSyncedAt: 2026-09-19
- 上位令: CEO 2026-09-19 00:43（「让 CPO 和 CTO 联审给方案」+历史背景四条交代）
- 派工席: Board（BOD）
- 承接席: CPO（产品域主笔）× CTO（技术域主笔）联审，产出**一件合流方案**

## 一、CEO 历史背景交代（原意转达，四条）

1. `TriCompany-copilot-host-assets/` 是当初 **Copilot 宿主的运行态空间**；`vendor/` 吸收了 hermes 的记忆特性，**以后可能还要继续吸收**。
2. `knowledge/` 挺适合做**员工学习**——inbox 放学习资料 → 制定 schema → 吸收变为自己的 wiki。**这个我们放入过设计**（=hermes-gov-p2 三席包，2026-09-14 定稿候终批）。如果放入 `.tricompany-cognition` 合适的话，可以放。
3. **knowledge 不是员工通信的 inbox**。通信可以在设计或沿用现在的，**区别好命名**。
4. **员工源侧的五件套包括 soul 和 social，落点也在这部分——请核实**。

## 二、BOD 预勘验事实包（2026-09-19 00:44-00:5x 实勘，联审以此为起点，可复核）

### 2.1 五件套核实结果：**属实**

- 源侧构成：`TriCompany/source-agents/<席>/` 每席 9 文件，其中 contract.yaml `paths` 显式登记 6 项：soul / agent-body / agent-frontmatter / memory / colleagues / social（13 席齐，board/registries/business-strategy 无人格五件套）。
- soul = 身份气质覆盖层（hermes-gov-p2 已定性：远承 hermes SOUL.md 身份种子模式）。
- memory/colleagues/social = 认知层契约件，**只定义契约+写入边界+运行资产落点**（contract.yaml「认知分层约束」原文）。

### 2.2 落点声明断裂点（联审核心命题的实锚）

- COO 例（13 席同构）：`memory.agent.md` 与 `social.agent.md` 的「运行资产落点」均声明 = **`TRICOMPANY_COGNITION_HOME`（即 .tricompany-cognition）或当前 runtime cognition backend**；员工实例资产 = 「runtime cognition 私域下 `<席>/` 员工实例目录」。
- 但实盘：`TriCompany/.tricompany-cognition/`（3 文件，停 07-14）与 `TriCompany-copilot-host-assets/.tricompany-cognition/`（3 文件，停 04-20）**均为死残留**；org/shared.md 已被 CPO 09-14 定性「日志垃圾桶」。
- **活体知识工作区实际在** `TriCompany-copilot-host-assets/knowledge/employees/<席>/`（15 目录），且**四区骨架已建**：inbox/（含 source-template.md）＋ wiki/（含 page-specs.json + page-template.md + employee-consumption-records.md）＋ workbench/ ＋ audit/——**这正是 hermes-gov-p2 员工层管道的落地骨架**。
- 结论：**契约声明指向 .tricompany-cognition，现实活体在 knowledge/——双轨断裂**。

### 2.3 已有设计基线（不得推翻，只做衔接）

`hermes-gov-p2-summary.md`（2026-W38，三席定稿候 CEO 终批）：

- 消化管道四段：①接入 inbox → ②消化 digest-rules.yaml+daemon（shallow 零 LLM）→ ③结构化输出（编译五段）→ ④wiki 对接（注入页）。
- 两轨分层：公司层（hub 改名续用）＋员工层（inbox→schema→wiki，1× 注入成本）。
- org/shared 重定义「全员该会什么」＋知识分发三层（核心/可选/目录）。
- 验收锚六条已立（org/shared 分层/reject 日志/escalate 汇审计/promotion 人工门/消化不在热路径/体积预算门）。
- vendor/reference/hermes-agent-memory = 上游参考实现（async prefetch 八项演化已对比）。

### 2.4 命名撞车现状（三处 inbox 三个概念）

| 路径 | 实际概念 | 状态 |
|---|---|---|
| `knowledge/employees/<席>/inbox/` | **学习资料入口**（管道①接入段） | 有设计（p2） |
| TriMLC 8713 信箱 | **跨面通信信箱**（LG-036 notify 链） | 现役 |
| `TriCompany-copilot-host-assets/employees/<席>/inbox/` | 一次性 runbook **派送**落点（DE 孤例） | 无设计，撞名撞层 |

### 2.5 死层清单（联审须给处置定案）

- 两处 `.tricompany-cognition/` 死残留（4 月/7 月两代）。
- `TriCompany-copilot-host-assets/runtime/cognition/` 30 个 Python 脚本（COS 早期自动化，最新停 06-11）。
- `TriCompany-copilot-host-assets/employees/` 顶层派送目录（DE 孤例）。
- 注意：`TriCompany/runtime/cognition/source_publish_check_validation.py` 是**活的**（五件套 grep 命中），勿误伤。

## 三、联审命题（方案必须逐条给定案）

1. **落点归一**：`TRICOMPANY_COGNITION_HOME` 与 `knowledge/employees/` 收敛为单一真源。CEO 已给方向提示（knowledge 若放入 .tricompany-cognition 合适则放）——两案并评：A=knowledge 迁入 cognition home；B=契约追平 knowledge 实体落点。给出推荐案+理由+迁移/追平工程路径。
2. **五件套落点收口**：memory/colleagues/social 三契约件的「运行资产落点」声明改为与定案一致（13 席批量）；soul 覆盖层语义不动。
3. **命名区分规范**：学习入口 vs 通信信箱 vs 派送落点三概念命名定案（含 8713 信箱是否正名）；员工通信通道沿用 LG-036 或并入设计的取舍。
4. **死层处置**：2.5 清单逐项定案（归档/删除/收编），红线=不丢有效数据、不制造第三真源。
5. **与 hermes-gov-p2 衔接声明**：定案须逐条对照 p2 已定稿设计与六验收锚，写明兼容/修订点；p2 转正身时本方案并入。

## 四、边界

- 不推翻 hermes-gov-p2 已定稿设计（衔接不翻案；确需修订处显式标注候 CEO）。
- 单一真源红线：去重不得制造第三真源（p2 五节 CPO 定谳沿用）。
- 发布管线卫生：五件套批量改走源侧→发布管线，禁手工拷贝改（p2 五节顺序：先收割再切断）。
- 本联审为**方案件**非执行件：不动实盘结构，产出方案候 CEO 终批。

## 五、验收锚

1. 方案件一件合流（CPO 产品语义 × CTO 技术实现双栏咬合，照 p2 八节表格形态）。
2. 五命题逐条有定案+理由+反案权衡。
3. 迁移/追平工程路径有步骤、有回滚锚、有量级估计。
4. 命名对照表一张（概念/新名/旧名/迁移动作）。
5. 与 p2 兼容声明逐条对照。
6. 落盘 W38 周平面，路径回执 BOD。

## 六、时点

- 派工：2026-09-19 00:5x
- 回执时限：CPO/CTO 各自 2026-09-19 内先回**接单认领**；合流方案件时点由双席商定后回报 BOD（CEO 在眠，勿催更勿越级）。

# 四模块迁移变更说明书：TriMMC / TriMLC / TriRMC / TriRLC

## 文档元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/quad-migration-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-24
- 文档版本: v0.1-draft（多轮制定中）
- 状态: `draft —— 待小乔×小狄三审评估（Q1）后升版`

## 一、授权与决策记录

CEO 2026-08-24 指令（本说明书的唯一授权来源）：

1. 大调整内容：sg-server 的 TriMC 迁移变更为 **TriMMC**；本地研发仓承载 **TriMLC**；原 TriLC 变更为 **TriRLC**；按原 TriMC 规划实现 **TriRMC**，与 TriRLC 共享 agent-core。
2. 目标系统：**TriMMC+TriMLC = 虚拟演练重放（教练系统）**；**TriRMC+TriRLC = 自研落地系统**，从演练重放获取经验、降低试错成本。
3. 螺旋机制：以项目仓库为元认知，实现元认知 → 元虚拟 → 元现实 → 元认知的螺旋上升式改进。
4. 本轮裁决四点：
   - ① 命名口径从白皮书（TriMLC=驻留本地的控制器组件；研发仓本身是元认知载体，**不改名**）
   - ② 先改叙事面；若混淆风险高则优先改 sg-server 侧——**交小乔×小狄三审评估定序**
   - ③ 旧 TriMC 源码复制一份移植给 TriRMC（本质大致相同）；sg-server TriMC 按使命改造为**驱动 claude code 在 fleet 工作的壳**（可优先做，测试周迁移面并稳定之=第一优先），同步设计 M↔R 通信桥梁
   - ④ bridge 形态（或更合适形态）由小狄×小乔裁定

白皮书依据（v1.0 已签发，08-22）：§0 修订说明（模块名换轨）、§3.1 双系统对定义、附录 B 词条（TriMMC/TriMLC/TriRMC/TriRLC/agent-core）、L1 路线图行。**本说明书不发明新语义，只把在册定义落成工程步骤。**

## 二、目标拓扑与映射表

### 2.1 四模块映射

| 旧名 | 新名 | 层 | 角色 | 物理载体现位 | 本轮变更性质 |
| --- | --- | --- | --- | --- | --- |
| TriMC | **TriMMC** | 元虚拟·主控 | 驱动成熟宿主（claude code）在 fleet 工作的壳 | sg-server：/srv/git/TriMC.git + /srv/fleet/TriMC + systemd trimc | 使命改造（scheduler 职能迁出给 TriRMC）+ 叙事面更名 |
| （新增） | **TriMLC** | 元虚拟·本地腿 | 承载本地研发仓宿主；FADE 灌员工定义入宿主；实验成果落盘元认知仓 | D:/Code/ai/TriMLC（W34 已立项，近空仓） | P1-4 收尾：四件套 + FADE claude 宿主激活声明 |
| TriLC | **TriRLC** | 元现实·本地控制器 | 会话持久化/调度/cron/心跳/审计自持（agent-core） | D:/Code/ai/TriLC | 叙事面换轨；现有 daemon 能力即 R 侧职责清单，功能基本已具备 |
| （新增） | **TriRMC** | 元现实·主控 | 必须自持的生产面：稳定执行/无人值守/权限审计/跨节点协同（agent-core） | D:/Code/ai/TriRMC（W34 已立项，近空仓） | 复制 TriMC 源码移植 + 与 TriRLC 共享 agent-core 改造 |

### 2.2 三层螺旋（机制确认）

```
        ┌──────────── 元认知（项目代码仓，不改名）────────────┐
        │  经验沉淀 ← 回流校准                                 ▲
        ▼                                                      │
  元虚拟 TriMMC+TriMLC ──演练重放──▶ 元现实 TriRMC+TriRLC ────┘
   宿主可整体替换(当前claude code)      自研内核 agent-core 自持
   试错免费（教练系统）        经验注入/降低试错成本    生产落地
```

- 元虚拟对刻意**不自建**会话/loop/上下文（用宿主原生能力）；只做两件事：灌人（FADE 发布线）+ 落盘（成果进元认知仓）。
- 元现实对**全部自持**（agent-core）；两对共享的只有合同（五件套）与经验资产，不含执行内核。

## 三、防混纪律（CEO 点名风险，最高优先级条款）

五个近名（TriMC/TriMMC/TriMLC/TriRMC/TriRLC）并存过渡期，执行以下硬规则：

1. **alias 表头强制**：凡涉及四模块的文档，文首必须带本文 §2.1 映射表的引用或副本。
2. **首现标注**：过渡期新名首次出现必须括注旧名（如"TriMMC（原 TriMC）"）；反之指旧生产实例时写"现役 TriMC（将改称 TriMMC）"。
3. **兼容面冻结**：bin 名/npm 名/CI workflow/远端仓名/systemd unit 名**一律不动**（白皮书条款："换轨限于叙事面，兼容面沿用旧名过渡"）。周迁移 cron 命令路径 `/srv/fleet/TriMC` 属兼容面，物理路径冻结至物理迁移窗口。
4. **语境锚定**：叙述"服务器现役生产"默认指旧 TriMC 实例；叙述"M 对教练系统"才用 TriMMC。含糊场合禁用裸名。
5. **待评审项 Q1**：叙事面先行 vs sg-server 物理名先改——小乔×小狄三审评估定序（见 §七）。

## 四、工作分解（分阶段）

### Phase 1（第一优先，CEO 定）：TriMMC 壳改造

- **使命**：sg-server TriMC 改造为驱动 claude code 在 fleet 工作的宿主壳。
- **范围**：
  - a. 周迁移面稳定测试（第一优先中的第一）：现役五段链确定性脚本保持生产主路径；壳驱动的 agent 化迁移作为影子路径试跑，稳定前不切换（双跑判据见 §五）。
  - b. 宿主驱动面设计：输入材料=`TriCompany/docs/engineering/claude-code-spawn-resume-context-innovation-record.md`（spawn/resume/context 三机制 + auto-compact 盲区实证）+ `reference/claude-code-2.1.88/` 源码。
  - c. M↔R 通信桥梁设计同步启动（形态由小狄×小乔裁：bridge 或其他；候选语义=白皮书"原通信协议成果沉淀为桥面"+ 训练流程三角环）。
- **明确不做**（Phase 1 边界）：不自建会话管理（白皮书红线）；不动现役 cron 生产链路；不改兼容面。

### Phase 2：TriRMC 移植

- 复制旧 TriMC 源码 → D:/Code/ai/TriRMC 仓（本质大致相同，CEO 定）。
- 改造点：身份/命名换轨；与 TriRLC 的 agent-core 共享核对（旧 TriMC 已复用 agent-core scheduler，r1-2 起步即同核——移植主要是解耦 TriMC 特有的 M 侧职能残留）。
- 部署形态（Q2 待小狄定）：sg-server 第二服务？端口/数据目录/runbook 独立。

### Phase 3：TriRLC 叙事面换轨

- TriLC daemon 文档面/注册表面更名 TriRLC；bin/npm 兼容面不动。
- 功能差距盘点：对照白皮书 R 侧职责清单（会话持久化/cron/心跳/审计自持）——现状基本具备，缺口列清单即可，预计无大改。

### Phase 4：TriMLC 立项收尾

- 树节点 TMV-P1-4 pending 项：仓+四件套（contract/agent-body/registry/发布条目）+ FADE claude 宿主激活声明 + 命名锚定落册；无 daemon 侦听面（R4 裁决）。
- ⚠️ 前置核对：TMV-P1-4 在树文件标 pending、commit e7813a89 标 done——两处矛盾先查清再动（真源可修口径）。

### 全局贯穿件

- 命名锚定落册：CompanyGovernanceRegistry / 各仓 code-state 同步 alias 表（CAO 协同）。
- 白皮书工作区未提交修订（并行线已在用新名）收口归位。

## 五、双跑与切换判据（周迁移不能断）

| 面 | 生产主路径 | 影子路径 | 切换判据（草案，待细化） |
| --- | --- | --- | --- |
| 周平面迁移 | 确定性五段链脚本（python3.8 cron） | TriMMC 壳驱动的 agent 化迁移 | 连续 N 周 shadow 结果与主路径逐字段一致 + CTO 终审 |
| 服务器控制面 | 现役 trimc 服务 | TriRMC 服务 | TriRMC 全功能对等 + 双跑观察期 + CEO 放行 |
| 退役 | —— | —— | 旧 TriMC scheduler 职能迁空且 TriRMC 稳定运行 ≥2 周后，TriMC 身份退役为纯 TriMMC 壳 |

## 六、风险面

1. **五名混淆**（最高）：§三 纪律缓解；Q1 定序进一步降低。
2. **生产连续性**：周迁移/config-sync 是唯一无人值守公司流程，任何服务器侧变更过冻结窗口设计（周日 23:00 前）。
3. **范围蔓延**：Phase 1 明确不做清单防"顺手把 M 对做成自研内核"——那是否定白皮书红线的方向性错误。
4. **记录冲突**：TMV-P1-4 树/commit 两态矛盾，动 TriMLC 前必查。

## 七、评审与裁决记录

| 轮次 | 评审人 | 范围 | 结论 | 时间 |
| --- | --- | --- | --- | --- |
| Q1 | 小乔（产品面）+小狄（技术面）三审 | §三.5 叙事面 vs 服务器侧先改的定序 + 全文 | 待评 | —— |
| Q2 | 小狄 | TriRMC 部署形态 | 待评 | —— |
| Q3 | 小狄×小乔 | M↔R 桥梁形态（bridge or other） | 待评 | —— |
| 终批 | CEO | 全文发布确认 | 待批 | —— |

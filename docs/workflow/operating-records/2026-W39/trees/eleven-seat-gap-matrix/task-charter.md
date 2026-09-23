# 任务书：11 席高维全查·缺口矩阵草稿（eleven-seat-gap-matrix）

- sourceOfTruth: 本件（W39 树·11 席高维全查任务书正身；自含打包，sg 值席零上下文可执行）
- syncMode: 规格面冻结；状态面随节点 append 注记
- lastSyncedAt: 2026-09-23T23:14:06+0800
- 令源: BOD 派工令（CEO 2026-09-23 23:11+0800 批）；编排链=cos→coo→sg 值席（V2 新链）
- 执行位: sg 值席（m-duty-cos，夜航形态）
- 截点: 2026-09-24 09:00+0800 前（夜航段）
- 完成定义: 11/11 矩阵草稿落树 commit + 回执 BOD（抄 COO/COS）

## A. 任务（机械段：纯提取零评价）

对 11 席各读两件——**正名件+孪生件同读**——提取四段：

1. description 原文
2. 使命原文
3. 核心职责逐条
4. 角色定位要点（≤3 行）

### 11 席↔正名件路径映射（TriCompany 仓；sg 面 `ls TriCompany/source-agents/` 实盘复核后用）

| 席 | source-agents 目录 |
|----|--------------------|
| cos | ceo-chief-of-staff |
| coo | chief-operating-officer |
| cfo | chief-financial-officer |
| cho | chief-human-resources-officer |
| cmo | chief-marketing-officer |
| cso | customer-success-officer |
| cao | chief-administrative-officer |
| fsd | full-stack-developer |
| rdt | rd-trainer |
| ste | senior-test-engineer |
| sde | senior-deployment-engineer |

- 正名件=`TriCompany/source-agents/<目录>/agent-body.agent.md`
- 孪生件=TriMetaverse 仓发布面（`.claude/agents/` 下同名族文件；sg 面 ls 实盘为准）
- 同读规则：正文以正名件为准；孪生件与正名件差异如实注记（不发评价）

## B. 对标框架清单（BOD 供料，全文照录；逐项打标：在位/部分/全缺）

- **cos**：经营中枢调度/信息流治理/决策支持体系/跨部门协调/危机响应/知识管理
- **coo**：经营节律与运营体系/流程优化/交付运营/运营度量/跨部门执行协同
- **cfo**：财务战略与资本规划/预算成本治理/收入模型货币化分析/风险管理/合规/利益方关系
- **cho**：人才战略与梯队/组织文化设计/绩效管理体系/学习发展/员工关系与激励
- **cmo**：市场战略定位/品牌资产/增长引擎/内容传播矩阵/竞争情报
- **cso**：客户成功战略/健康度体系/续费扩张引擎/客户声音闭环/生命周期管理
- **cao**：公司治理体系/制度资产/流程标准化/知识档案管理/会议决策机制
- **fsd**：全栈技术深度/架构实现/代码质量方法论/技术债意识/跨栈学习力
- **rdt**：培训体系设计/知识课程化/技术传导效能/学习路径/评估反馈
- **ste**：质量战略门禁体系/测试自动化策略/缺陷预防/度量驱动质量/回归风险治理
- **sde**：部署自动化/环境即代码/发布工程/基础设施可靠性/回滚恢复工程

## C. 产出规格

- 产出件：`docs/workflow/operating-records/2026-W39/trees/eleven-seat-gap-matrix/gap-matrix-draft.md`（sg 树 dev 落盘）
- 每席一节：四段提取原文 + 逐域打标表（域/打标〔在位|部分|全缺〕/原文依据一句）+ 缺口一句话
- **边界：sg 面 only 机械对照不裁决**——打标只挂原文依据，判断与裁决回 BOD 复核
- commit 纪律：产出件落树 commit（sg 树 dev；署名 duty-cos），推双远端；D-29 逐节点留痕

## D. 执行注记（sg 面）

- 本任务书自含打包；树拾取=git fetch 后读本件
- 与 LG-046 迁移批并行不欠账（机械管线与分析活不冲突，BOD 令原文）
- 截点前未毕须中途回执进度（催办归 COS——唯一催办枢纽）
- 回执对象：BOD（判断裁决复核）+抄 COO/COS

## E. 节点留痕（执行席 append）

- 2026-09-23 23:14+0800 | COS | 任务书落树（本机 wt 分支 5c500149 基线上新建），派工单随发 COO 转 sg 值席

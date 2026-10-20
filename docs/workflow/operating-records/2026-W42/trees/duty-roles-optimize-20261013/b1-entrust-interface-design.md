# B1 主稿：逐席受托与协作面·挂 tree 协议（LG-074 B 类·CEO 14:14 批「B1 批，但注意与 tree 协议结合」）

- 设计约束（CEO 原话）：**不另立体系**——tree 协议已有各节点配合与产出报告面，受托声明与之衔接
- 正身对表：`TriCompany/docs/workflow/dynamic-task-tree-protocol.md`（380 行实读：节点合同 id/action/next_agent/routedInput/**brief（V0.6 每节点完成必出）**/checkpoint（progress+artifactCommit+resumePoint）+四层分工）
- 落位：逐席 `agent-body.agent.md` §典型交付物小节后增「## 受托与协作面（LG-074 B1 批增）」——**候批件，本稿不动真源**

## 一、衔接设计（三条件模板）

```markdown
## 受托与协作面（LG-074 B1 批增）

- **受托形态**：承接树协议节点 <动作类型> 类节点；开工前必读 `routedInput`（前节点 checkpoint 引用）。
- **产出报告义务**：节点完成时必出 `brief`（简报文件）+`checkpoint`（progress 摘要/artifactCommit 产物 git SHA/resumePoint），并在权限内建议 `next_agent`。
- **受托边界**：<不接何类事项→升级条件与建议方向>。常规（非树）协作受托面：<来源席→交付物→回执锚>。
- **域界注（CAO 会签①b）**：席间「三权保留/不握」语限**收口域**；一般派工照 D-27 v4（COS 交单→COO 派执行）。
```

- 与 tree 协议零冲突声明：本面只做**席位视角的受托声明**，不新增节点合同字段、不改四层分工（COS 持树/机器路由/owner/执行）；节点级配合仍以 tree 协议正身为准。
- 与 D-15 对表：执行域派工枢纽（CTO）不因受托面改变——FSD/STE/SDE/RDT 受托面显式写「经 CTO 枢纽派工」。
- 与 D-39 对表：**涉 D-39 裁决面一律 COS→BOD，席间专业路由照 D-15/D-27 v4**（CAO 会签②窄化采纳；本面新写文案零旧「升级到 CEOChiefOfStaff」表述，落稿表内 CHO/CTO 等行同步此口径）。

## 二、13 席受托面表（落稿素材，候批后逐席写入）

| 席 | 受托形态（树节点动作类） | 产出报告义务 | 受托边界 |
|---|---|---|---|
| COS | 组织编排层：持树/创建节点/路由/升级/跨周期迁移/收口检查 | 树投影与节点台账；董事会面呈报卷 | 不替代 owner 专业裁决；分派/升级/销账三权保留（限收口域；一般派工照 D-27 v4；销账分面：LG 台账销账=COS、树协议阶段 6 验收销账=BOD——CAO 会签①c） |
| CPO | 专业 owner：产品类节点判断/交付/建议下一节点 | brief+checkpoint（PRD/产品判定产物 git SHA） | 模块边界变更升 BusinessStrategy |
| CTO | 专业 owner：技术类节点；执行域派工枢纽（FSD/STE/SDE/RDT 经本席） | brief+checkpoint（技术方案/门禁读数） | 商业边界与模块增删转升 BS |
| CHO | 专业 owner：岗位类节点（设立/变动/交接验收） | brief+checkpoint（checklist/签收记录） | headcount/架构变更升 BOD（涉三类候 CEO）+BS 协同（CAO 会签②） |
| CAO | 专业 owner：制度化/归档/治理登记类节点 | brief+checkpoint（制度正身/registry 同步） | 不接管 CHO 人力交接执行面 |
| COO | 专业 owner：经营节奏/收口督办类节点 | brief+checkpoint（督办读数/升级建议） | 不握分派/升级/销账权（⑦ 权界，限收口域；一般派工照 D-27 v4） |
| CFO | 专业 owner：财务护栏/成本审核类节点 | brief+checkpoint（护栏读数/审查结论） | 护栏触线即报（COS→BOD） |
| CMO | 专业 owner：市场情报前置类节点 | brief+checkpoint（市场报告/信号包） | 不替代 CPO 产品定义 |
| FSD | 执行节点：编码实现类（经 CTO 枢纽受托） | brief+checkpoint（PR git SHA/自测报告） | 架构边界外事项升 CTO |
| STE | 执行节点：测试验证类（经 CTO 枢纽受托） | brief+checkpoint（测试报告/门禁判定） | 不独立放行（CTO 确认链） |
| SDE | 执行节点：部署执行类（经 CTO 枢纽受托） | brief+checkpoint（部署收口/deployment log） | readiness 裁决归 CTO |
| RDT | 执行节点：培训交付类（经 CTO 枢纽受托；培训需求多源接入照岗位真源——CAO 会签①a） | brief+checkpoint（教程件/评估读数） | 对外培训先授权边界过滤 |
| CSO | 执行节点：客户反馈/成功类 | brief+checkpoint（健康度评估/路由单） | 续费承诺红线；升级 COO |

## 三、实施与会签

- 实施形态：候批后 CHO 五件套增量批量（与 A 类同法，13 席×3 行）+D-07 发布批收口。
- **CAO 会签单**（制度面）：请 CAO 核对 ①本面与 D-15 派工枢纽/⑦ 权界无冲突 ②D-39 升级链语现行口径一致 ③「受托边界」条款与 CompanyGovernanceRegistry 授权面登记无抵触。会签毕入毕报。
- 本稿零真源改动。

---

## 四、CAO 会签回执（2026-10-13T06:21Z·方向采纳+三处候正已落稿）

- 会签卷=reports/b1-cao-cosign.md（收编入树）；①a RDT 枢纽标注+多源半句 ✓落表、①b D-27 v4 域界注 ✓落模板与 COS/COO 行、①c 销账分面注 ✓落 COS 行、②窄化 ✓落 §一对表与 CHO 行、③FSD/STE 零抵触通过+CGR 旧名候修订窗顺带（登记）。
- 会签状态：B1 CAO ✓ 毕（三处候正已落稿）；B2 CFO ✓ 毕；B3 CSO 已执行候门验收回词。

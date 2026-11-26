# 任务书格式提案（七席合议 + CEO 两原则与补充）·呈 CEO 批

- sourceOfTruth: 本卷（七席议案汇总正身·BOD 主笔）
- 合议来源: cpо 81a1e4775 / cho efc4b74c0 / cos 卷 / cto a938daa1 / cfo 2ffc58475 / cao 2152da67d / coo 卷（七席各卷在树）
- 令源: CEO 2026-11-26 22:3x 两原则 + 22:41 补充（CTO 选技术架构+技术实现方案）
- 时点: 写前现查 2026-11-26T22:45+0800（D-47）

## §一 · CEO 原则（本提案的总纲）

1. **任务不复杂** → 任务书内定完整 schema（产品方案+技术实现都在任务书里）；
2. **任务复杂** → 任务书=索引和摘要·另出完整 PRD 和技术方案（含技术架构和实施方案）。

## §二 · 两形态（七席一致）

| 形态 | 形态字段 | 结构 |
|---|---|---|
| **inline（简单）** | `form: "inline"` | 完整 schema 内嵌：每 item 含 `product_design`+`tech_design` 两段 |
| **index（复杂）** | `form: "index"` | 索引+摘要（`summary≤200 字`）+ `index[{section,file,lines}]`·并列 `prd-<ts>.md`+`techplan-<ts>.md` |

**CAO 定形**：两形态**同一命名** `charter-<ISOts>.json`·**靠 `form` 字段区分·不靠文件名猜**（D-92 老坑）。

## §三 · 复杂度判定（四段链·判据取 OR 集）

**判定链（COO 四段+CAO 判错纪律）**：
`CPO+CTO 联判 → COS 复核（可否拆）→ CEO 终裁`（CEO 批时确认·批即认形）

**判据（任一命中即 complex）**：
- **产品面（CPO）**：用户可感知变化／新能力或新场景／价值交换变化（定价/打包/额度）；
- **技术面（CTO）**：跨模块（≥2 模块接口/契约）／架构级（数据模型/持久化格式/**判据或 rubric 定义**/协议）／风险面（不可逆/生产写入/权限凭证/迁移）；
- **组织面（CHO/COO）**：跨席≥3／含岗位·编制·授权变更／含不可逆·点火·门禁变更（D-39 三类）；
- **成本面（CFO/COO）**：预估>4h（≈1 席日）／轮次>2／跨仓。

**默认 simple·防复杂度膨胀**；**complex 无 PRD=fail-closed 拒收**（COO）。
**判错不对称（CAO）**：简单误判为复杂=轻；**复杂误判为简单=重**（schema 塞不下必生悬空·施工后发现强制补 PRD/techplan 并回填·不许硬塞）。
**机械辅助可·终判归人**（启发式 items>8/跨 item depends_on/单 item 字段>12·D-98 原则）。

## §四 · schema 字段合议（简单形最小集·复杂形=最小集+索引指针）

**地基（全员必备·CFO）**：
```yaml
authorization:
  status: approved | pending_approval
  approver: CEO | <CEO明示代批人>
  approver_quote: "<原话逐字·禁转述>"
  approved_at: <ISO>
  scope: ignition | construction | result_approval   # 今日歧义机械解
# 查零判据=approved ∧ scope==ignition ∧ approver==CEO；代批限 construction/result_approval·ignition 仅 CEO
```

**三面同源（CTO+CAO）**：
```yaml
tri_source_assertion: {doc: <锚>, impl: <path/函数+测试锚>, semantics: <判据一句>}
# CAO three_face 三件：文本面/实现面（机械可检）/语义面（归人判·显式标「待人工确认」）
# 引用不存在=校验失败·fail-closed 非警告
```

**责任席（CHO）**：`owner_seat`（唯一·accountable）／`backup_seat`（代行者不得对 owner 自维行使 A）／`responsibility_face`（迁移/评审/批权/值席/岗位）／`depends_on`；五件套只指针不内嵌。

**产品面（CPO）**：`product_intent`／`observable_acceptance`／`prd_ref`／`product_change(none|minor|major)`／`pricing_impact`——**不写 product_change=默认有产品变更**（反形警示）。

**执行面（COS+COO）**：`task_id/title/goal/complexity/plan(3-5 步)/deliverables[{path,acceptance_anchor}]/verify/rollback/deadline` + 编排扩展（执行序/批次/盯办席/复杂度标签头部单值）。

**成本面（CFO）**：`cost_gate{estimate{in,out,cache_read,cache_create},stop_conditions,gate_required}`——**预估编制方给·CFO 只判合理性**。

## §五 · CTO 职责（CEO 22:41 补充·复杂形态）

**有 PRD 时·CTO 产出两件**：
1. **技术架构选型**（架构决策·选型理由·被否选项）；
2. **技术实现方案**（含测试计划/回滚方案/风险面）。

**技术方案必含**（CTO）：测试计划（单测/集成/回归/门禁矩阵）／回滚方案（数据/状态/外部依赖三面+回滚验证方法）／风险面。
任务书侧只留 **验收门清单+`techplan_ref` 指针**（不复制细节·防双源漂移）。

## §六 · 验证铁律（全员）

- **verify 须机器可跑**（可执行命令+期望读数+EXIT 断言三项齐·**禁「人工确认/看情况」**）；
- **验收锚批时写定**（禁事后补）；
- **引用可验**（指实现/文件/函数的引用必带锚·不存在=fail-closed）；
- **语义面归人**（机械只报它真能验的·不冒充·CAO 方法注）。

## §七 · 收口分形（COS）

| 形 | verify | rollback |
|---|---|---|
| inline | 单层（deliverables 逐件存在+内容断言·jq/grep） | 单文件 bak+sha256 |
| index | 分层三件（索引完整性+sha16 对表／PRD 总纲逐条／techplan 完成度） | 树级快照（tar/git revert） |

## §八 · 七席卷索引

cpо 81a1e4775／cho efc4b74c0／cos 卷（树）／cto a938daa1／cfo 2ffc58475／cao 2152da67d／coo 卷（树·PROPOSAL_IN_REMOTE）

——BOD 合议汇总（2026-11-26 22:45）

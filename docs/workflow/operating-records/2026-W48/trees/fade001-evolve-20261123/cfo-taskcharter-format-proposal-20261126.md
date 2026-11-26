# CFO 席·任务书格式建议（成本门+授权面视角）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cfo-taskcharter-format-proposal-20261126.md）
- 令源：CEO 今日两原则（简单=内定完整 schema／复杂=索引摘要+另出 PRD 技术方案）·BOD 转令 7 席联审
- 落款：见卷末（D-47 现查）

## 一 · 查零（授权面）字段——**简单/复杂两种形态都必须有**（一票否决位）

**根因（今日 12:18 查零首战 RED 实录）**：CEO 令「12:00 施工·跑完呈我批」**缺少授权范围枚举** → 两解（点火授权 vs 做好准备等批）→ 我只能 fail-closed 判 RED。**授权歧义必须由 schema 机械堵死·不能靠人解读。**

**建议 schema（必填·两形态共通）**：
```yaml
authorization:
  status: approved | pending_approval      # 枚举·禁第三值（缺=treat as pending）
  approver: CEO | <CEO 明示代批人>          # 仅 CEO 可批 ignition
  approver_quote: "<原话逐字>"              # 禁转述（转述丢语境=今日歧义之源之一）
  approved_at: <ISO8601>
  scope: ignition | construction | result_approval   # ★关键新增
```

**`scope` 的语义（今日歧义的机械解）**：
- `ignition` = **授权点火**（含施工·成本门查零唯一放行值）
- `construction` = **只授权施工准备**·点火须另批
- `result_approval` = 只授权结果验收

**成本门查零判据（机械）**：`status==approved AND scope==ignition AND approver==CEO` → 三项齐才放行；任一不满足 = RED（不看查一至查四）。

**代批边界建议**：COS 代批**限于 `construction`/`result_approval`**；`ignition` 仅 CEO（若 CEO 明示授权代批 ignition·须在 `approver_quote` 里逐字写明）。

## 二 · 成本门字段（建议入 schema·编制方填·CFO 审）

```yaml
cost_gate:
  estimate: {in: N, out: N, cache_read: N, cache_create: 0}   # token 四分列预估（不折现）
  stop_conditions: ["<条件1>", "<条件2>"]                      # 触即停条款
  gate_required: true                                          # 点火前须 CFO 绿色回执
```

**为什么入 schema 而非任务书外**：成本门的输入是「预估」·**预估必须在编制时给**（事后给=失去约束意义）。**关键分离=编制方（CPO/CTO）给预估·CFO 判合理性**——不让被审方给自己定预算。

## 三 · 复杂度判定的成本面建议（初始阈值·可调）

**判据（满足任一 = 复杂）**：涉及席数 >3 ／ 预估工时 >4h ／ 预估轮次 >2（含验证轮）／ 跨模块或跨仓改动。

**成本面论证（两个方向都亏）**：
- **简单任务用复杂形态** = 文档开销 > 任务本身成本（如 E1-E5 40min 的活写完整 PRD+技术方案=纯浪费）
- **复杂任务用简单形态** = schema 装不下 → 返工（返工成本 ≫ 文档成本）
- **分界点建议**：**预估工时 >4h 或席数 >3** 走复杂形态·否则简单形态——**4h 的依据**=今日 E1-E5 实测（复杂形态编制约 40min 级）·若任务本身 <4h 则文档占比 >17%=不划算。

**另建议（省成本直取形）**：简单形态任务若**预估 <1h 且单席**，允许「任务书=一句话 + authorization 结构化五项」极简形——**授权面绝不可省·其余可省**。

## 四 · 三句话总结（呈 CEO）

1. **授权面字段是任务书的「地基」**——简单/复杂都要·且必须有 `scope` 枚举（今日歧义无法再用文字解读方式蒙混）。
2. **成本门字段是「钢筋」**——预估由编制方给·CFO 只判合理性·停止条件必填。
3. **复杂度判定的唯一目的=让文档成本与任务规模匹配**——不是为了分类好看·是为了不错配成本。

—— CFO 小财（m-cfo·任务书格式建议）
〔落款 2026-11-26 22:32:13 +0800 现查〕

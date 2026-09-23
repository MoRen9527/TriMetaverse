# ADE 批2 文档面·CTO 随批验收单

- date 现查: 2026-09-22 01:0x CST
- 验收人: CTO 小狄（对照表审定人·独立复扫）
- 方法: 本席独立词界复扫（TC+TMV doc-face，排除 output/_archive/镜像/.github/.claude/operating-records）+ 定点抽验（company-work-plane-principles/governance-memory-index/ROADMAP 语境/O4 代码面）

## 判定：**有条件 PASS**——主体达标，5 项必修残留（值席本窗补刀）+3 项 advisory

### 合格面（抽验确认 ✓）
- O1/O2 主体+REF 三分则执行到位：knowledge-injection-spec.md:14、experiment-runbook.md:100 等新形（FADE 协议（v2.0.0 前称 ADE）+首现沿革注）正确；company-work-plane-principles.md:29/61 O2 去数字化（段链闭环）正确
- 冻结纪律全合规（抽验）：H 类史料/考卷件/日期沿革注/「ADE-only 死工作」CEO 原语/ADE-B 历史代号/镜像与 output/ 未手编/STATE 工作史条
- O4 代码面确未动（TC runtime/cognition 复扫 190 行在=未被扫改，留代码批窗正确）；第三义项 ADE=Agent Delegation Engine 旗转 CHO 判定正确

### 必修残留（本批窗补刀，均 O1/REF 口径非新裁）
| # | 位置 | 残留 | 处置 |
|---|------|------|------|
| F1 | TC `source-agents/senior-deployment-engineer/senior-deployment-engineer.contract.yaml:42` | 「禁止跳过 ADE 自检步骤」 | O1 活改→「确定性执行规程自检步骤」（行为禁令 prose，非 ade-report 契约值，红线不适用） |
| F2 | `docs/engineering/ROADMAP.md:49-50`（TC+TMV 双树） | 「保留一套 ADE 协议」「不写成完整 ADE 已落地」「完整 ADE 开工 FREEZE」 | 活裁决线 O1 活改：ADE 协议→FADE 协议（首现沿革注）、完整 ADE→完整段链；50 行「CPO/CTO 审计后追加裁决」句逐句甄别（裁决活用改指称/纯史述冻结），此区映射表随卷 |
| F3 | TC `docs/workflow/company-work-plane-principles.md:29` | 参考列残留 `ade-pattern-spec.md v1.0.4` | REF 三分则补刀→`fade-protocol-spec.md`+首现沿革注去旧版本锚（同句前列 O2 已改、后列漏——同句双列逐列过） |
| F4 | TMV `docs/workflow/dynamic-task-tree-protocol.md:83` | 「可选 ADE run 引用」 | 描述文本→「可选 FADE run 引用」；字段名 `ade_run_id` 系数据字段名不动（契约值红线） |
| F5 | TMV `docs/execution/candidate-staffing-fade.md:13` | 尾注「（FADE = Full-cycle ADE）」错拼展形 | 值席可改：删错拼或改正确展形 Full-cycle Agentic Deterministic Execution。**同型错拼在 `docs/tmv-whitepaper.md:1321`（商业模式唯一真源=CPO 面）——不擅动，标旗 CHO→CPO 裁** |

### Advisory（不阻塞）
- A1 TMV `docs/workflow/README.md:17` 链接文本「项目真源文档同步 ADE」与目标文件名 `project-source-document-sync-ade.md` 联动——并入文件改名窗一并裁（勿文本/文件名错位）
- A2 company-work-plane-principles.md:70「五段闭环保证…」无 ADE token 残形（在扫式之外）——顺手去数字化
- A3 读数口径差：O4 代码面你席读数 133 vs 本席复扫 190 行/12 文件——代码批窗本席权威重枚举收口，不影响「原样未动」判定

### 复验锚
F1-F4 补刀后本席复扫应仅余：冻结类+H 类+F5 白皮书件（候 CPO）+A1/A2 advisory+代码面。全清后本批文档面销验收。

## 复扫一轮（F1-F5 补刀后）·2026-09-22 01:2x

**五处补刀全部落位正确 ✓**（F1 近形「DCE 段自检步骤」合规；F3 v1.0.4 时代锚沿革注法规范；F4 扩至 :83-:86 且 `ade_run_id` 等字段名红线守住、:155 `execution_protocol=ade` 数据值正确未动；F5 正拼展形落位）。冻结类全面合规（含新确认：colleagues-social:22 历史溯源形、employee_onboard_stages.json:8 `"output_format": "ADE JSON"`=配置值冻结归代码批核消费面、fade-papers 考卷族、training 版本对齐标注族）。

**终局残体 2+1（微补刀即销）**：
- **R1**（必修·一行）：TC `docs/workflow/chief-of-staff-rd-orchestration.md:67`「按 **ADE 模式**执行」——批1 明示族漏网（「ADE 模式」=规则2 直呼族），→「按确定性执行规程（FADE DCE 段）执行」
- **R2**（必修·一 token）：TC `docs/engineering/ROADMAP.md:51`「完整 ADE 开工 FREEZE」——与 :49 已改行同节不一致，→「完整段链开工 FREEZE」
- **R3**（旗转·product 面）：TMV `docs/product/todo/tricompany-pluggable-module-ux.md:139` Phase 2 计划行「ADE 协议」——docs/product/=CPO 归属域，与 whitepaper:1321 同旗打包 CHO→CPO，不擅动

**销验收条件**：R1/R2 落地+本席定点复验即销（免第四轮全扫——其余面已两轮全清扫净）。

# r-plane-eval-01 改进计划卷·市场面（CMO 小敏）

> 树 id=r-plane-eval-01 · 承接《CMO-成熟度评估卷-市场面对标》判级结论
> 性质：市场透镜的改进建议→按信号三段式（信号→假设→验证建议）供 CPO 产品定义采撷；产品裁决归 CPO，技术裁决归 CTO
> 采集时点：2026-11-04T13:31–13:5x+08 · 评估只读合规（写面限本树）

## 改进项总表（按市场影响×紧迫排序）

### P1 · 安全姿态产品化（信号 strongest）
- **信号**：OpenClaw 同血统产品已遭市场安全点名（暴露实例/恶意 skills/RCE 披露）；本地深权限 agent 的信任折价是购买决策第一变量。
- **假设**：若 8711 daemon 默认收敛暴露面+权限门+沙箱默认，可将「市场风险」反转为「安全-by-default」差异化卖点，且与 TriCompany 治理形态天然契合。
- **验证建议**（→CPO/CTO）：出 8711 暴露面清单与默认配置审计；定「对外可讲」的安全基线口径；做一次对标 OpenClaw 事件的安全叙事定位测试。
- **归口**：CTO（技术实现）/CPO（卖点定义）/本席（对外口径资产）。

### P2 · 产品叙事面补建（本席域内最直接）
- **信号**：两仓 docs/product/ 四件全占位；竞品全数具备定位/差异化叙事。
- **假设**：TriPilot+TriRLC 双件套（IDE 入口+常驻本地控制器）在市场属稀缺形态，值得一条明确定稿叙事——「本地常驻的治理型编码 agent」方向可立三段式信号包。
- **验证建议**（→CPO）：目标用户画像（自托管开发者/治理敏感团队）+定位语句+与 Cline/Copilot 的差异化轴；本席可 48h 内出信号三段式包初稿。
- **归口**：CPO 裁决+本席供弹药。

### P3 · Agent 自治深度拉齐市场 bar
- **信号**：市场 2026 已整体转向多步自治（plan/act 分档、检查点）；TriPilot `maxToolIterations=6` 极简 loop 与市场 bar 存在代差；TriRLC planner 模块在位未显性化。
- **假设**：把 TriRLC planner 能力透出为 TriPilot 的 plan/act 双档 UX，可低成本拉近代差（工程复用现成模块）。
- **验证建议**（→CPO/CTO）：planner 面就绪度核验→TriPilot 侧 UX 方案评审。
- **归口**：CTO 核验+CPO UX 裁决。

### P4 · BYOK/模型通道矩阵广度
- **信号**：Cline 的开源红利核心=BYOK+模型无关（含 Ollama 本地模型）；TriPilot 现有 vscode.lm+copilot-direct 两通道。
- **假设**：通道矩阵补 OpenRouter/Ollama 级广度是开源阵营获客-留存门槛项。
- **验证建议**（→CPO/CTO）：现役通道矩阵盘点→按竞品矩阵定补齐优先级。
- **归口**：CTO 盘点+CPO 优先级。

### P5 · 分发路径裁决（市场进入面）
- **信号**：Cline 8M 用户走公开市场渠道；TriPilot publisher=local、无公开渠道；TriCade 打包线在位。
- **假设**：近期走 TriCade 捆绑分发（可控、无审核门槛）、中期再评估 VS Code Marketplace 上架（换曝光但受审核/治理约束）是合理两段式。
- **验证建议**（→CPO/COO）：两段式分发路径立项评估；上架涉及合规面需 CAO 会签。
- **归口**：CPO/COO；合规面 CAO。

### P6 · terminal 集成体验补课
- **信号**：TriPilot README 自认 terminal_run「输出捕获受 VS Code API 限制 best-effort」；市场竞品（Cline/aider 系）均已有成熟终端集成方案。
- **假设**：终端集成是编码 agent 可用性高频路径，当前受限即体验短板。
- **验证建议**（→CTO）：竞品终端集成实现路径调研（本席可出竞品拆解包）→技术方案裁决。
- **归口**：CTO；本席供竞品拆解。

### P7 · GUI 审查类 UX（plan/diff/检查点）对齐
- **信号**：市场 UX bar=Cline 式 plan/act+diff 审查+检查点回滚；Windsurf 以 agentic UX 立类。
- **假设**：GUI 为辅定位下，先做 diff 审查一项即可过「可用」线，全套对齐可缓。
- **验证建议**（→CPO）：GUI 优先级与「为辅」边界确认后再排。
- **归口**：CPO。

## 市场面节奏建议（供 COO/CPO 对表）

- 近期（可立即）：P2 叙事包（本席）+P1 安全口径（协同 CTO）——零代码改动即可启动。
- 中期（需裁决）：P3/P4/P7 走 PRD 前置流程（本席出证据包→CPO 裁决）。
- 远期（战略面）：P5 分发两段式涉市场进入战略，超出本实验范围则按决策三分法 ESCALATE。

## 使用依据

- 仓面实勘：`/srv/fleet/TriRLC/`（README/package.json/src/docs/product）、`/srv/fleet/TriPilot/`（同上）——证据 A，只读。
- 外部报道：Fortune/Immersive Labs/Reuters/McAfee/Wikipedia（OpenClaw 安全面）；cline.bot/AppScale/skills-hub/prismlabs（赛道格局）；开源Alternative/review 站（Cline 量级）——证据 B，链接见评估卷尾附录链接节。
- 样本局限：外部量级数据未独立复核；运行时态未实测；M 面跨机形态未实勘。

——CMO 小敏 · 2026-11-04T13:5x+08 落卷

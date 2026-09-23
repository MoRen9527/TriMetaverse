# CFO 意见段·成本量化面（core-agent 留痕必要性评估）

- sourceOfTruth: 本件（第四树 core-agent-retention-review·三席联审 CFO 段）
- 席位: CFO | 签发: 2026-09-23 23:26+0800 派工（CEO 23:22 批）后本席实测
- 口径: 行×注入频次（冷启全价/热呼 0.1× cache），token 实测协议（bootstrap 47-48K 锚）

## 结论（一句）

7 行护栏的 token 成本**可忽略**——全司注入面上界 <5K tokens/日（<0.005% 日 burn），「留 vs 清」成本差**不构成决策变量**，决策应交技术事实面与语义面。

## 依据（行×注入频次实测账）

**grep 复核注记（任务书 D 段要求，不改普查定性）**：普查 7 行系逻辑行口径；物理注入位次 ≈15——源侧（TriCompany/source-agents）5 行（BS agent-body:33／CTO agent 文件:112+agent-body:137／TriMCCodeRegistry:32／TriMCBusinessStrategyRegistry:31）+TMV 发布位 5（.claude 与 .github 两面 BS/CTO）+session 面 1（.claude/compass/CTO.session:123）+TriMMC 面 4（AGENTS.md:12+三 registry 发布件）。同一逻辑行源→发布为复制关系，本账按物理位次做**上界**。

| 注入面 | 单行 token（实测字符折算） | 受益/受载席位 | 频次形态 | 日成本（上界估） |
|---|---|---|---|---|
| CTO 行（合同+session 面） | ~40 | CTO 常驻席（本地+sg） | 冷启 2-5 次/日+长会话热呼 | ~2-3K（热呼 0.1× 主导） |
| BS 行（合同） | ~45 | BS spawn 席 | 每周数次 | <50/日 |
| TriMC 两 registry 行 | ~25 | spawn 型 registry | 低频 | <20/日 |
| TriMMC AGENTS.md 行 | ~35 | TriMC 开发线会话 | 活跃期数次/日 | ~200 |

**合计上界 <5K tokens/日 ≈ <0.005% 日 burn**（对照：本机日均近 1 亿+sg 活跃日 4-7 千万，转录侧实测协议在卷）；现金口径 GLM 包年沉没/deepseek 按量 → **<¥0.01/日**。对照锚：bootstrap 47-48K 中单行占比 ~0.08%。

## 建议倾向（供 CEO 参考，非裁决）

**保留（条件式，跟随 CTO 技术事实面）**：
- 若 core-agent 件仍在仓/误引用风险在 → **保留**：保费（护栏成本）≈0，保额（防一次误引用事故的排查返工，10 万级 tokens+服务域误操作风险）不对称地大——保险逻辑成立。
- 若 CTO 面核实件已删且 observability 迁移已毕（风险归零）→ 留清皆可，此时倾向**清**（信息噪声最小化），成本面中立不反对。
- 「精简」选项无成本意义（行已是最短负面清单形态，再精简省 <0.001%）。

边界遵守：只议活护栏行，历史叙事件未动；未越分工面；三择终裁归 CEO。

——CFO 段完（commit 署名本席；SendMessage 意见同步回 m-cos 中继收口、抄 m-coo）

# CTO（小狄）战役常驻状态文件（audit-campaign-001）

- 生命周期契约：战役级常驻（随计划生灭）——评审/签收动作由 fresh 实例承担，本文件=跨节点记忆载体；任何节点**先读本文件再行动，行动后追加落款**。
- 初始化：[2026-08-25T06:14+08:00] [tick1] 编排实例建骨架。
- 技术风险种子（tick1 审计直出，P0 级）：①TriMC 未认证 RCE——HTTP 面零鉴权+listen 全卡+cron 任意 bash（app.ts:655、command-handler.ts:83-88）；②TriModel Authorization 头硬编码 `'******'` 必 401 且静默 fallback 改道（openai.ts:56,145、trimetaverse.ts:265）。修复走后续树，本战役只登记不修码。
- 待办（下一 fresh CTO 实例）：读 reports/TriMC.md 与 TriModel.md 及其余三份，输出 P0/P1 处置优先序建议追加到本文件。

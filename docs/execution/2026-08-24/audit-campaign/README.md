# audit-campaign-001 战役目录 README

## 一、战役目标

audit-campaign-001 是一次自治能力实弹测试：按 `../autonomy-audit-campaign-plan.md`（CEO 2026-08-25 授权），由 sg-server 侧编排会话（小贾）在 CEO 全程零参与的约束下，自主完成模型验证、六模块代码审计（TriMC/TriLC/TriPilot/TriCode/TriModel/TriMetaverse，发现按 P0/P1/P2 分级并带 file:line 证据，只读审计不修码）、生命周期测试矩阵（tick 轨编排 / 战役级常驻 C-level / 树轨 fresh 实例）与 8 点时间门验证，实测 TriMMC 编排循环"计划 push 后自主拆树、派工、收口、跨 tick 续跑"的持续自治能力；三类升级事件（重大不可逆/CEO 保留权/系统硬约束）除外。

## 二、目录结构

| 路径 | 性质 |
| --- | --- |
| `state.json` | 进度真源——各节点状态与战役进度的唯一权威载体，随每 tick 落盘 |
| `log.md` | append-only 战役日志——逐条追加，不改写历史，记录决策、验证结论与增员实录 |
| `reports/` | 六模块审计报告及附属产出——如 `TriLC.md`、`TriMetaverse.md`、`TriPilot.md`（环境受限事实报告）、导读索引 `exec-20260824-index.md` 等 |

## 三、当前进行中状态

**本战役正在进行中（in-progress）**：Step0 模型验证已通过（stealth/ox-alpha 经 OpenRouter），六模块审计五路并行推进中（TriPilot 因源码不在 sg-server 已作受限记录结案），生命周期测试矩阵持续执行。本目录内容随 tick 演进，以 `state.json` 与 `log.md` 为准。

# OpenClaw Vendor Baseline

## 来源

- Reference: `TriMetaverse/reference/openclaw-v2026.3.28/`
- 冻结日期: 2026-07-07
- 冻结范围: cron service + heartbeat infra（最小心跳吸收所需）

## 吸收原则

本目录是上游代码的冻结基线，保持原貌。TriMC 真实实现在 `TriMC/src/` 中，基于 vendor 理解后重写为 Python，不直接修改 vendor 内文件。

## 包含文件

| 源路径 | 用途 |
|--------|------|
| `src/infra/heartbeat-events.ts` | 事件发射器模式（emit/on/getLast） |
| `src/infra/heartbeat-runner.ts` | 心跳编排器（完整生产实现，80+ 依赖） |
| `src/infra/heartbeat-summary.ts` | 心跳间隔/启用状态解析 |
| `src/cron/service.ts` | CronService facade（start/stop/list/add/run） |
| `docs/automation/cron-vs-heartbeat.md` | 设计决策文档 |

## 后续渐进式吸收

- Agent harness 设计
- 服务器端主控
- Hermes 集群调度
- Claude Code harness 能力

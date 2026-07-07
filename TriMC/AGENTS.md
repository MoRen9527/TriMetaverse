# TriMC Agent 入口

## 模块角色

TriMC 是统一 agent runtime 与 interaction core。当前阶段为 shadow 基线 + 最小心跳吸收。

## 当前能力

| 能力 | 状态 | 说明 |
|------|------|------|
| Heartbeat checker | 实现中 | IPD case 卡点扫描 |
| Cron scheduler | 排除 | Phase 1 不需要 |
| Agent harness | 待吸收 | OpenClaw harness 设计 |
| 多通道投递 | 排除 | 暂无社交通道需求 |

## 相关 Registry

- BusinessStrategyRegistry：待初始化（使用 `docs/三元宇宙架构与模块说明.md` §4 作为临时真源）
- ProductRegistry：待初始化
- CodeRegistry：待初始化

## 吸收原则

1. `reference/openclaw` → `vendor/openclaw`（冻结，保持上游原貌）
2. 只吸收最小功能实现，渐进式扩展
3. Python 实现（对接 TriCompany IPD case engine）
4. 手动编排，方便调试

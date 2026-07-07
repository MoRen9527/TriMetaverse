# TriMC — 统一 Agent Runtime 与 Interaction Core

## 模块定位

TriMC 是三元宇宙的统一 agent runtime 与 interaction core，负责 runtime、planner、context 整理、tools 编排、模型调用、服务域执行与研发工作流运行切片。

## 当前状态

**Phase 1：shadow 基线 + 最小心跳吸收**

- Shadow 基线：`TriMC/vendor/openclaw/`（OpenClaw 核心冻结副本）
- 正在吸收：心跳/定时任务、agent harness、服务器端主控设计
- 当前阶段目标：最小版 IPD case 心跳检测闭环（手动编排，不依赖 cron 定时器）

## 架构表位置

见 `docs/三元宇宙架构与模块说明.md` §4 模块表 `TriMC` 行。

## 吸收链

```
reference/openclaw-v2026.3.28  →  TriMC/vendor/openclaw  →  TriMC/src/
    (只读参考)                       (冻结基线)                (真实实现)
```

## 目录结构

```
TriMC/
├── README.md              ← 你在这里
├── AGENTS.md              ← 模块 agent 入口
├── vendor/openclaw/       ← OpenClaw 冻结基线（上游原貌）
│   └── src/
│       ├── cron/service.ts
│       └── infra/
│           ├── heartbeat-runner.ts
│           ├── heartbeat-events.ts
│           └── heartbeat-summary.ts
└── src/
    └── heartbeat/         ← Python 心跳实现（对接 IPD case engine）
        ├── __init__.py
        ├── checker.py
        └── models.py
```

## 最小闭环范围（Phase 1）

- [x] 模块骨架创建
- [x] Vendor 冻结（openclaw 心跳/cron 源码）
- [ ] IPD case 心跳扫描器
- [ ] 小贾 session resume 集成
- [ ] Stuck case 检测与报告

## 排除项（Phase 1 不做）

- Cron 表达式解析与定时调度
- 多通道投递（WhatsApp/Telegram 等）
- 隔离会话执行
- Webhook 推送
- 持久化 job store
- 正式生产级 heartbeat 配置体系

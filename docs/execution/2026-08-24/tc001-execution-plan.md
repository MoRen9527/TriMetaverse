# TC-001 执行计划（持久版）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/tc001-execution-plan.md
- syncMode: source-only
- lastSyncedAt: 2026-08-26
- 文档版本: v1.0
- 功能规格: [tc001-harness-scaffolding-func-spec.md](tc001-harness-scaffolding-func-spec.md) v1.0

## 一、任务概述

实现 agent-core 执行持续性三机制（FR-1 task_plan 注入 / FR-2 end_turn 判定 / FR-3 进度 reminder），使 R 面执行体具备与 CC 宿主对等的持续执行能力。

## 二、实施节点与状态

| 节点 | 内容 | 状态 | 对应树 |
| --- | --- | --- | --- |
| S1-a | trilc app.ts：task_plan 解析 + systemPrompt 注入 + continueOnIncomplete 参数 | ✅ done | tc001-tc-s1 |
| S1-b | rmc_tick.py：prev_summary 桥接 + continue_on_incomplete 启用 | ✅ done | tc001-tc-rmc-integration |
| S1-c | TriModel anthropic.ts：出站消息规范化（TC-4b） | ✅ done | fc0d6d8 |
| S1-d | **待做**：heyuan TriLC 重编译部署（使 S1-a 生效） | ⏳ | — |
| S1-e | **待做**：RA-3 重跑验收 | ⏳ | — |

## 三、每节点的完整上下文（供任何 fresh 会话接续）

### S1-a 已完成详情
- 修改文件：`TriLC/src/server/app.ts`
- 新增变量：taskPlan / continueOnIncomplete / incompleteCheckPrompt / taskPlanBlock
- systemPrompt 构造改为 `(parsed.system || defaultSystemPrompt()) + taskPlanBlock`
- continuePrompt 改为 FR-2 自查提示（当 continueOnIncomplete=true 时覆盖通用 prompt）

### S1-b 已完成详情
- 修改文件：`TriRMC/scripts/rmc_tick.py`
- 新增字段：continue_on_incomplete=true / fallback_model=cfg.model
- 新增逻辑：driven round 间 prev_summary 桥接（上轮 out 尾部传给下轮）

### S1-c 已完成详情
- 修改文件：`TriModel/src/providers/anthropic.ts`
- 新增函数：toAnthropicConversation（OpenAI→Anthropic 消息规范化）
- 覆盖 chat() 和 stream() 两条路径的请求体构造

### S1-d 待做步骤
```bash
# 在 sg-server 或 heyuan 上执行
cd /srv/fleet/TriLC && npm run build && systemctl restart trilc-headless
```

### S1-e 待做步骤
```bash
# 清锁后触发 tick，观察 FR-1/FR-2 是否生效
cd /srv/fleet/TriRMC && python3 scripts/rmc_tick.py --force
# 验收：审计报告产出 + 树 status=done
```

## 四、关键决策记录

1. 出站消息规范化放 TriModel provider 层而非 agent-core 循环层——因为规范化是 provider 协议问题不是循环逻辑问题
2. 内核续跑注入放 loop.ts 而非 trilc 处理器层——因为需要访问 state.messages 全上下文
3. rmc_tick 外循环保留作为保险——内核续跑处理单会话内多轮，外循环处理跨会话续跑

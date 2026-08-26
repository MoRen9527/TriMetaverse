# TC-001 功能需求规格书：agent-core 执行持续性三机制

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/tc001-harness-scaffolding-func-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-26
- 文档版本: v1.0-draft（TC-001 拆树输入）
- 授权: CEO 2026-08-26 指令「现在就写成正式功能需求文档」

## 一、背景与实证

### 1.1 发现源

rmc-autonomy-001 RA-2 实验中，R 面执行体（ox-alpha via agent-core 裸循环）在六模块审计任务中出现系统性早停：模型深度读源码（64 文件/9.7k 行/16869 token），但**从不切换到写报告阶段**。

### 1.2 对照实验数据

| 变量 | M 面(CC 宿主) | R 面(agent-core) |
| --- | --- | --- |
| 同一模型 | stealth/ox-alpha | stealth/ox-alpha |
| 读源码深度 | ✅ 充分 | ✅ 同等充分 |
| 写报告产出 | ✅ 完成 | ❌ 从不启动 |
| 工具执行 | ✅ 正常 | ✅ 正常 |
| 持续轮次 | 数百轮不停手 | 1-3 轮即收工 |

### 1.3 已排除的假设

| 假设 | 排除依据 |
| --- | --- |
| 模型能力不足 | 同一模型在 CC 内可数百轮持续 |
| 提示词不够强化 | system 人设+CRITICAL 条款+maxTokens 32K 均未压住 |
| 基础设施缺陷 | 管线全通（工具执行/推送/权限均正常）|
| maxTurns 太低 | 提升 25→100 后仍同模式 |

### 1.4 根因定位

CC 宿主的持续性来自**三个 harness 层机制**，它们不在循环内部而是宿主在每轮工具结果回喂时注入的外部信号：

| 机制 | CC 做法 | agent-core 现状 |
| --- | --- | --- |
| todo-list 注入 | 每轮后把当前任务清单+进度状态注入上下文 | 无——模型不知道自己该做什么和做到哪了 |
| end_turn 判定纪律 | end_turn 时检查是否真正完成（而非只返回文本）| 无——end_turn 即 loop_end done |
| 进度 reminder | 定期注入「你还剩 X 轮」「你的任务是 Y」 | 无——模型没有外部进度锚点 |

## 二、功能需求

### FR-1 todo-list 进度追踪注入

**描述**：trilc /v1/messages 处理器维护一个 per-request 的任务清单状态。当请求携带 `task_plan` 字段（结构化数组）时，处理器在每轮工具结果回喂前将当前清单状态注入为一条 system-role 追加消息。

**接口定义**：

```json
// POST /v1/messages body 新增可选字段
{
  "task_plan": {
    "items": [
      {"id": "1", "description": "审计 TriMC cron 模块", "status": "done"},
      {"id": "2", "description": "写审计报告", "status": "in_progress"}
    ],
    "currentFocus": "2"
  },
  "continue_max_rounds": 4,
  "continue_prompt": "..."
}
```

**行为规则**：
- 每轮 agentLoop 结束后（收到 assistant_message 且无 tool_calls 或有 tool_results），检查 task_plan 中是否有 status 变化
- 将更新后的 task_plan 序列化为追加消息：`[SYSTEM: Task progress — completed: {done items} | in progress: {current} | remaining: {pending items}. Continue with the next incomplete item.]`
- 该消息以 user role 注入 internalMessages，与 continuePrompt 合并或独立
- 当 task_plan 全部 done 时不再注入（让模型自然结束）

**验收判据**：
- 设置 task_plan 后，模型在多轮中能正确引用已完成项和待做项
- 不设置 task_plan 时零行为变化

### FR-2 end_turn 判定纪律

**描述**：当模型返回 end_turn（无 tool_calls）且调用方配置了 `continue_on_incomplete` 参数时，trilc 处理器不立即返回结果给调用方，而是向模型注入一条判定消息：「你结束了回合但任务可能尚未完成。请自查：你的所有交付物是否已创建？所有 commit 是否已推送？如果未完成，继续执行。如果确实完成，回复 DONE。」

**接口定义**：

```json
{
  "continue_on_incomplete": true,
  "incomplete_check_prompt": "自定义检查提示（可选）"
}
```

**行为规则**：
- 仅在 `continue_on_incomplete === true` 且模型 stop_reason 为 `end_turn` 时触发
- 每次注入消耗一个 turnCount
- 如果模型回复包含 "DONE"（精确匹配），则正常返回结果给调用方
- 否则视为继续执行的开始，进入下一轮 agentLoop
- 最大判定次数 = `continue_max_rounds` 共享上限

**验收判据**：
- 模型尝试提前收工时被自动拦截并被要求继续
- 任务真正完成后模型回复 DONE → 正常返回

### FR-3 进度 reminder 注入

**描述**：每 N 轮（默认 10 轮）自动注入一条进度锚点消息，提醒模型当前任务目标、已完成步骤数、剩余轮次预算。

**接口定义**：

```json
{
  "progress_reminder_interval": 10,
  "progress_reminder_template": "自定义模板（可选）"
}
```

**默认行为**：
```
[PROGRESS REMINDER] Turn {turnCount}/{maxTurns}. Your original task is still active.
Completed steps this session: {count of tool executions}.
If you have gathered enough information, transition to writing your output now.
If not, focus on the most critical remaining information gaps.
```

**验收判据**：
- 长会话中模型不会因为上下文膨胀而遗忘原始任务目标
- reminder 注入不影响正常短任务的模型行为（< interval 时零注入）

### FR-4 出站消息规范化（已实现✅）

TriModel anthropic provider 的 `toAnthropicConversation` 函数：
- OpenAI 形态 tool 角色转 Anthropic 合法结构
- 并行 tool_result 合并为单 user 消息
- 空文本块剥离
- 状态机：draft→validated→consumed/deprecated

**状态**：✅ 已实现已部署（TriModel fc0d6d8），本轮验证通过

## 三、非功能需求

| 约束 | 说明 |
| --- | --- |
| 向后兼容 | 所有可能字段缺省时零行为变化 |
| 性能 | 注入消息不增加 API 调用次数（仅修改消息内容） |
| 安全 | task_plan 内容不脱离 trilc 进程内存；不持久化到磁盘 |
| 可测试 | 每个 FR 有独立的单元测试场景 |

## 四、拆树（已落地）

| 树节点 | 内容 | 对应 FR | 预估工作量 |
| --- | --- | --- | --- |
| [tc001-harness-scaffold HS-1](../../../workflow/operating-records/2026-W35/trees/tc001-harness-scaffold/tree-op.json) | FR-1+FR-2：trilc 处理器改造（task_plan 解析+end_turn 判定+消息注入） | FR-1,FR-2 | 1-2 天 |
| [tc001-harness-scaffold HS-2](../../../workflow/operating-records/2026-W35/trees/tc001-harness-scaffold/tree-op.json) | FR-3：进度 reminder + rmc_tick 发送端适配（task_plan 构建） | FR-3 | 半天 |
| [tc001-harness-scaffold HS-3](../../../workflow/operating-records/2026-W35/trees/tc001-harness-scaffold/tree-op.json) | 单元测试 + 集成验证（含 RA-3 重跑） | 全部 | 1 天 |

## 五、成功指标

| 指标 | 目标 | 当前基线 |
| --- | --- | --- |
| V1 无人值守自治率 | M2 周 ≥80% | 0%（无法自主完成） |
| V2 冻结项误执行 | =0 | 无历史事故 |
| V3 域外接单 | =0 | 无历史事故 |
| V7 审计报告产出率 | R 面 ≥ M 面 ×80% | 0%（从未产出） |

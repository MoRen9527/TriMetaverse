# 目标重构架构图（SocialFi / Core-Agent / Tristaciss）

> 本图是“模块视图（局部视图）”。整体框架以 [docs/architecture-overall-unified.mmd](docs/architecture-overall-unified.mmd) 为唯一真源（Single Source of Truth）。

```mermaid
flowchart LR
    U[用户\nTelegram / Discord / Slack 等]

    subgraph S[SocialFi 模块]
      SA[Channel Adapters\n标准化消息 / 附件提取 / 身份映射]
      SE[Social Event Bus\n入站事件]
      SR[Response Adapter\n分渠道回包 / 流式分片]
    end

    subgraph C[Core-Agent 模块（24x7 主控，基于 Kode-Agent 重写）]
      G[Gateway Server / Coordinator\n会话入口与路由]
      Q[Session Router + Lane Queue\n并发控制 / 会话隔离]
      R[Agent Runner\nModel Resolver / Prompt Builder\nHistory Loader / Context Guard]
      L[Agentic Loop\nLLM响应 -> 工具调用 -> 执行 -> 汇总]
      T[Tool Runtime\nTool A / B / C / D]
    end

    subgraph T3[Tristaciss（LLM API 平台）]
      API[LLM Gateway API\n统一鉴权 / 路由 / 限流 / 观测]
      PM[Provider Manager\nDeepSeek / GLM / OpenRouter 等]
      ST[Streaming + Fallback\n流式输出 / 失败回退]
    end

    U --> SA
    SA --> SE
    SE --> G
    G --> Q --> R --> L
    L --> API
    API --> PM --> ST
    ST --> L
    L --> T
    L --> SR
    SR --> U

    O1[openclaw 参考\nGateway / Agent Runner / Agentic Loop] -.映射参考.-> C
    O2[Kode-Agent 参考\nClaude Code兼容执行主控] -.主控重写参考.-> C
```

## 说明

- 解释、评审与实施时，优先以 [docs/architecture-overall-unified.mmd](docs/architecture-overall-unified.mmd) 为总框架；本文件用于三层职责讲解。
- `SocialFi` 只负责渠道接入与响应适配，不承载模型调度逻辑。
- `Core-Agent` 负责会话编排、工具执行和代理循环，是 24x7 主控核心。
- `Tristaciss` 是唯一 LLM 出口，统一模型接入、策略与可观测能力。
- 引入统一 3D 观测层：`VibeCraft-inspired` 负责运维观测（会话/工具/回放），`AgentSims-inspired` 负责任务仿真训练与评测（Tick/评估/实验）；两者在同一模块内以不同模式呈现，避免双系统分裂。

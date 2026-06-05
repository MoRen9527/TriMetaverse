# TriStaciss OpenAI 兼容 API 契约草案

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/contracts/tristaciss-openai-compatible-api-contract.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

## 1. 目标

TriStaciss 作为三元宇宙统一模型 API 转接平台，对客户端暴露 OpenAI 兼容接口，同时支持额外的路由字段和任务辅助字段。

设计目标：

- 对普通客户端保持 OpenAI API 兼容。
- 对 TriMetaverse 客户端增加 tag、modelTag、workspace、policy、taskHint 等扩展字段。
- 不向客户端暴露真实上游 provider key。
- 支持普通模型调用和任务型请求两种路径。

## 2. 认证

请求头：

```http
Authorization: Bearer <tmv_api_key>
Content-Type: application/json
X-TMV-Client: tripilot|triavatar|app|system
X-TMV-Trace-Id: <uuid>
```

说明：

- tmv_api_key 是 TriStaciss 发放的平台代理 key。
- TriStaciss 内部再映射到 provider_account 和上游 provider credential。

## 3. 兼容端点

### 3.1 POST /v1/chat/completions

兼容 OpenAI Chat Completions，请求体在标准字段之外扩展以下字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| model | string | 否 | 兼容 OpenAI 标准字段；可为空，由 tag and modelTag 决定 |
| messages | array | 是 | 标准消息数组 |
| stream | boolean | 否 | 标准流式开关 |
| temperature | number | 否 | 标准采样参数 |
| max_tokens | integer | 否 | 标准最大输出 |
| tag | string | 否 | 业务路由标签，例如 coding.fast、analysis.deep、avatar.chat |
| modelTag | string | 否 | 模型层标签，例如 premium、cheap、vision、longctx |
| workspace | object | 否 | 工作空间上下文，如 workspaceId、repo、branch、language |
| policy | object | 否 | 风控与审批策略，例如 requireApproval、riskLevel、dataClass |
| taskHint | object | 否 | 任务提示，例如 taskType、syncMode、expectedArtifacts |
| routeMeta | object | 否 | 额外路由元数据，例如 region、tenant、latencyClass |
| userMeta | object | 否 | 用户上下文，例如 userId、teamId、sessionId |

示例：

```json
{
  "model": "auto",
  "messages": [
    {"role": "system", "content": "你是代码助手"},
    {"role": "user", "content": "帮我分析这个仓库的构建错误"}
  ],
  "stream": true,
  "tag": "coding.analysis",
  "modelTag": "longctx",
  "workspace": {
    "workspaceId": "ws_001",
    "repo": "TriPilot",
    "branch": "dev"
  },
  "policy": {
    "requireApproval": false,
    "riskLevel": "medium"
  },
  "taskHint": {
    "taskType": "interactive_chat",
    "syncMode": "sync"
  },
  "userMeta": {
    "userId": "usr_123",
    "sessionId": "sess_456"
  }
}
```

成功响应在标准 OpenAI 格式基础上增加 tmv 字段：

```json
{
  "id": "chatcmpl_xxx",
  "object": "chat.completion",
  "created": 1770000000,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "已完成分析"},
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  },
  "tmv": {
    "requestId": "req_001",
    "resolvedTag": "coding.analysis",
    "resolvedModelTag": "longctx",
    "resolvedProvider": "deepseek",
    "resolvedModel": "deepseek-chat",
    "routePolicy": "weighted_primary",
    "taskAccepted": false
  }
}
```

### 3.2 POST /v1/responses

兼容 OpenAI Responses API，同样支持 tag、modelTag、workspace、policy、taskHint、routeMeta、userMeta。

建议：

- 新客户端优先走 /v1/responses。
- 旧客户端和第三方 SDK 兼容走 /v1/chat/completions。

### 3.3 GET /v1/models

返回对外可见模型列表，同时附带 TriMetaverse 标签元信息。

响应示例：

```json
{
  "object": "list",
  "data": [
    {
      "id": "tmv-auto-coding",
      "object": "model",
      "owned_by": "trimetaverse",
      "tmv": {
        "tag": "coding.default",
        "modelTags": ["cheap", "longctx"],
        "providerCandidates": ["deepseek", "openrouter"],
        "visibility": "public"
      }
    }
  ]
}
```

## 4. 任务型请求约定

当 taskHint.taskType 属于以下类型时，TriStaciss 不应直接把请求当普通模型调用结束，而应进入任务入口逻辑：

- async_agent_task
- workflow_task
- node_execution_task
- evaluation_task
- scheduled_task

判定逻辑建议：

1. 若 taskHint.taskType 命中任务类型，则进入任务入口。
2. 若 policy.requireApproval 为 true，则进入审批态。
3. 若 syncMode 为 async，则返回受理响应而不是最终模型文本。

异步受理响应示例：

```json
{
  "id": "taskreq_001",
  "object": "tmv.task.accepted",
  "created": 1770000000,
  "status": "accepted",
  "tmv": {
    "requestId": "req_002",
    "ingressId": "ing_001",
    "controllerTarget": "trimc-main",
    "taskType": "node_execution_task",
    "approvalStatus": "not_required"
  }
}
```

## 5. 路由决策顺序

TriStaciss 的 provider 路由建议遵守以下优先级：

1. 显式 routeMeta.provider 固定路由
2. tag plus modelTag 的策略路由
3. 租户级策略路由
4. 默认候选池权重路由
5. 熔断后的降级候选路由

## 6. 错误响应

统一兼容 OpenAI error 结构：

```json
{
  "error": {
    "message": "No available route for tag coding.analysis and modelTag longctx",
    "type": "route_not_found",
    "param": "tag",
    "code": "tmv_route_not_found"
  }
}
```

建议错误码：

- tmv_route_not_found
- tmv_provider_quota_exceeded
- tmv_policy_blocked
- tmv_task_requires_approval
- tmv_controller_unavailable
- tmv_invalid_tag_binding

## 7. 服务端落库映射

该接口建议落到以下表：

- tmv_provider_account
- tmv_model_route
- tmv_api_request_log
- tmv_task_ingress
- tmv_task_ingress_event

## 8. 版本建议

建议使用以下版本约定：

- 对外路径仍为 /v1/*
- TriMetaverse 扩展语义通过 tmv 字段和扩展请求字段体现
- 如需破坏兼容，新增 /v2/*，不要复用旧字段做语义反转

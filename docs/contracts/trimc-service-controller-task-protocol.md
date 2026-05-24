# Tristaciss 到 TriMC Service Controller 任务协议草案

## 1. 目标

该协议定义 Tristaciss 作为任务入口网关，如何把任务投递给 TriMC Service Controller。

设计原则：

- Tristaciss 负责接单、校验、审计、路由初判。
- TriMC 负责任务编排、节点调度、执行桥接、回执汇总。
- 协议优先采用内部 HTTP API 加回调事件，必要时再辅以 WebSocket 订阅。

## 2. 通信角色

| 角色 | 职责 |
| --- | --- |
| Tristaciss | 任务入口、模型路由、审批前置、请求审计 |
| TriMC | Service Controller、任务状态机、节点调度、执行回执聚合 |
| TriLC | 本地域执行体、节点、Planner、ToolBus |

## 3. 内部鉴权

请求头：

```http
Authorization: Bearer <internal_service_token>
X-TMV-Trace-Id: <uuid>
X-TMV-Source: tristaciss
X-TMV-Signature: <hmac>
```

## 4. 任务投递接口

### 4.1 POST /internal/v1/tasks

Tristaciss 把任务正式投递给 TriMC。

请求体：

```json
{
  "ingressId": "ing_001",
  "requestId": "req_001",
  "taskType": "node_execution_task",
  "sourceClient": "tripilot",
  "creator": {
    "userId": "usr_123",
    "teamId": "team_001"
  },
  "routing": {
    "tag": "coding.build",
    "modelTag": "cheap",
    "resolvedProvider": "deepseek",
    "resolvedModel": "deepseek-chat"
  },
  "policy": {
    "requireApproval": false,
    "riskLevel": "medium",
    "dataClass": "workspace_private"
  },
  "workspace": {
    "workspaceId": "ws_001",
    "repo": "Tripilot",
    "branch": "dev"
  },
  "execution": {
    "mode": "async",
    "preferredDomain": "local",
    "requiresWorkspaceAccess": true,
    "requiresNodeConsent": true
  },
  "payload": {
    "prompt": "修复构建错误并给出说明",
    "artifacts": [],
    "extra": {}
  }
}
```

同步受理响应：

```json
{
  "taskId": "task_001",
  "controller": "trimc-main",
  "status": "accepted",
  "queueStatus": "queued",
  "acceptedAt": "2026-03-27T10:00:00Z"
}
```

### 4.2 GET /internal/v1/tasks/{taskId}

Tristaciss 查询 TriMC 的任务状态。

响应示例：

```json
{
  "taskId": "task_001",
  "status": "running",
  "phase": "dispatching_to_trilc",
  "assignedNodeId": "node_001",
  "approvalStatus": "approved",
  "updatedAt": "2026-03-27T10:02:00Z"
}
```

### 4.3 POST /internal/v1/tasks/{taskId}/cancel

Tristaciss 发起取消请求。

### 4.4 POST /internal/v1/tasks/{taskId}/approval

Tristaciss 把用户审批结果回传给 TriMC。

请求示例：

```json
{
  "action": "approve",
  "actorId": "usr_123",
  "comment": "允许执行本地终端命令"
}
```

## 5. 回调接口

TriMC 应回调 Tristaciss，避免 Tristaciss 仅靠轮询追状态。

### 5.1 POST /internal/v1/controller-callbacks/task-status

回调体：

```json
{
  "taskId": "task_001",
  "ingressId": "ing_001",
  "status": "running",
  "phase": "local_execution",
  "nodeId": "node_001",
  "message": "TriLC accepted task",
  "occurredAt": "2026-03-27T10:03:00Z"
}
```

### 5.2 POST /internal/v1/controller-callbacks/task-result

回调体：

```json
{
  "taskId": "task_001",
  "ingressId": "ing_001",
  "status": "succeeded",
  "summary": "构建修复完成",
  "summaryHash": "sha256:xxx",
  "artifacts": [
    {
      "artifactType": "patch",
      "uri": "s3://tmv/task_001/patch.diff",
      "hash": "sha256:aaa"
    }
  ],
  "rewardDraft": {
    "nodeReward": "12.5",
    "userAttribution": "1.0"
  },
  "occurredAt": "2026-03-27T10:10:00Z"
}
```

### 5.3 POST /internal/v1/controller-callbacks/task-audit

TriMC 回传关键审计事件。

## 6. 任务状态机

建议状态：

- accepted
- awaiting_approval
- queued
- routing
- dispatching
- running
- verifying
- succeeded
- failed
- cancelled
- timeout

建议 phase：

- ingress_validated
- controller_accepted
- waiting_policy_gate
- selecting_node
- dispatching_to_trilc
- local_execution
- service_execution
- collecting_artifacts
- verification
- settlement_pending

## 7. TriMC 到 TriLC 的核心事件

虽然本文件聚焦 Tristaciss 到 TriMC，但建议顺手固定 TriMC 内部事件名，并把确认、高危拦截、隐私保护纳入状态机：

- tmv.task.offer
- tmv.task.accept
- tmv.task.progress
- tmv.task.artifact.commit
- tmv.task.result.submit
- tmv.task.verify.request
- tmv.task.verify.result
- tmv.node.heartbeat
- tmv.node.capability.update

## 8. 失败与重试策略

建议：

1. Tristaciss 投递 TriMC 失败时，记录 ingress 失败事件并允许幂等重投。
2. TriMC 接单后生成 taskId，后续所有重复投递以 ingressId 去重。
3. TriLC 离线时，TriMC 应保留待派发队列，而不是立即失败。
4. 审批超时由 TriMC 驱动状态转为 timeout or cancelled。

## 9. 幂等键

建议幂等键：

- 请求幂等键：requestId
- 入口幂等键：ingressId
- 主控任务键：taskId
- 执行键：executionId

## 10. 落库映射

Tristaciss：

- tmv_task_ingress
- tmv_task_ingress_event

TriMC：

- tmv_task
- tmv_task_offer
- tmv_task_execution
- tmv_audit_event
- tmv_verification_result
- tmv_reward_ledger

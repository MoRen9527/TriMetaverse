# CPO 产品评估：CC bridgeMain vs TriMetaverse 双域体系

评估人：CPO 小乔
日期：2026-07-30
依据：bridgeMain.ts (2999行) 源码全文审读 + 双域白皮书图3-3/3-6 + openclaw 双域融合方案 + product-state.md (Simplest Verifiable Model)
关联：[[../2026-W31/cc-fidelity/p10-architecture]] CTO 已确认 bridgeMain 与终端输入无关

---

## 1. 产品定位匹配度：LOW

### 1.1 表面重叠（不构成移植价值）

| 维度 | bridgeMain | TriLC 本地域 | 表面重合？ | 实质重合？ |
|------|-----------|-------------|-----------|-----------|
| 节点注册 | `registerWorker()` → Anthropic API | 钱包绑定 + 共识平面节点登记 | 是 | **否** |
| 任务接收 | `pollForWork()` → 云端队列拉取 | Gateway WebSocket 推送 + Planner 自治 | 是 | **否** |
| 子进程执行 | `spawner.spawn()` → 子 Claude 进程 | Local ToolBus → Worker 分发 | 是 | 部分 |
| 心跳保活 | `heartbeatActiveWorkItems()` | 长连接 keepalive | 是 | **否** |
| 结果上报 | `stopWork()` → API 回调 | 证据上传 + 链上结算 | 是 | **否** |
| 会话管理 | activeSessions Map + worktree 隔离 | 任务空间 + 本地归档 | 是 | **否** |

**结论**：register→poll→spawn→execute→report 是分布式执行的通用模式，不是 bridgeMain 的独特资产。六个维度的**实质实现机制完全不同**，不存在可复用的核心逻辑。

### 1.2 根本架构分歧

bridgeMain 的本质是 **Anthropic 云服务的私有代理客户端（thin client for centralized SaaS）**：

- **身份模型**：Anthropic OAuth → JWT session ingress token → `registerWorker()`
- **信任模型**：用户一次性同意 `remoteDialogSeen` → 云端获得对本机的无限任务下发权
- **调度方向**：**纯被动** —— 本地只 poll，不发起、不路由、不裁决
- **结算模型**：无 —— 云端按订阅计费，与本地节点贡献无关
- **平台依赖**：强绑定 Anthropic API / Datadog / GrowthBook / Redis XAUTOCLAIM

TriLC 本地域的本质是 **去中心化任务网络中的主权执行节点（sovereign node in P2P network）**：

- **身份模型**：钱包绑定 → 节点登记 → 角色授予 → 能量积分
- **信任模型**：链上身份锚定 + 节点信誉 + 零知识证明 + 显式同意
- **调度方向**：**双工** —— 接收服务域任务，同时本地 Planner 保留执行自治权
- **结算模型**：贡献记账 → 链上确权 → 能量积分 → 价值回流
- **平台依赖**：TriMC Gateway / 共识平面 / TriChain / TriStaciss

**2975/2999 行（99.2%）是 Anthropic 专属基础设施代码，对 TriMetaverse 零价值。**

### 1.3 唯一可参考的 24 行

bridgeMain 中可抽象为通用子进程生命周期管理的部分位于 `safeSpawn()` 函数和 `onSessionDone()` 回调链（~300行逻辑），其核心模式可提炼为：

```
spawn → track(handle, workId, startTime) → handle.done.then(onSessionDone)
  → cleanup: stopWork → removeWorktree → archiveSession
```

但即使这 300 行，其中 90% 的 cleanup 逻辑（`stopWorkWithRetry`、`archiveSession`、`deregisterEnvironment`、`bridgePointer`）仍然直接调用 Anthropic API。真正语言无关的通用模式不到 **24 行**：

```typescript
// 唯一可抽象的通用子进程生命周期骨架
function safeSpawn(spawner, opts, dir): Handle | string {
  try { return spawner.spawn(opts, dir) }
  catch (err) { return errorMessage(err) }
}
```

---

## 2. 最小可用场景：不移植 bridgeMain

### 2.1 产品判断：FREEZE

bridgeMain 不满足 TriLC 本地域的最小可用场景需求，原因：

1. **没有钱包绑定即没有节点身份** —— bridgeMain 的 OAuth 模型无法替代钱包+链上身份
2. **没有 Planner 就没有本地自治** —— bridgeMain 是纯被动执行，TriLC 需要本地拆解+状态判断+失败重规划
3. **没有证据链就没有结算** —— bridgeMain 只有 analytics events，TriLC 需要工件索引+执行摘要+验证回执+链上存证
4. **没有双态升级就没有渐进参与** —— bridgeMain 只有"开/关"二态，TriLC 需要"客户端态→节点态"升级路径

### 2.2 对 TriLC 本地域"节点化升级"的产品化路径

不搬 bridgeMain，而是用 TriLC 自己的架构实现本地域节点化：

| 阶段 | 产品能力 | 实现路径 | bridgeMain 相关性 |
|------|---------|---------|------------------|
| L0 客户端态 | CLI chat / TUI 交互 | **已完成**（TriLC 当前） | 无 |
| L0 客户端态 | 会话持久化 + 上下文管理 | /compact、/init 等 A 级移植 | 无 |
| L1 节点注册 | 钱包绑定 + TriMem 用户主档 | TriMem API 对接 | 无 |
| L1 节点注册 | 共识平面节点登记 | TriMC Gateway 协议（已有 OpenClaw 基线） | 无 |
| L2 任务接收 | WebSocket 长连接 + 任务队列 | TriMC Gateway WebSocket（已设计） | 无 |
| L2 任务执行 | Planner + ToolBus + Worker | TriLC 自研（已设计） | 无 |
| L3 证据结算 | 工件上传 + 链上存证 | TriChain + TriStaciss 对接 | 无 |

**bridgeMain 在整个路径中的产品贡献为零。** 它不加速任何阶段，也不降低任何风险。

### 2.3 唯一值得提取的产品元知识

bridgeMain 作为"远程执行守护进程"的产品设计中有 3 个**元知识**值得 TriLC 本地域参考（不是代码移植，是产品设计参考）：

1. **capacity wake 信号机制**（lines ~194, ~467）：当 session 结束时立即唤醒 at-capacity 等待，而不是死等下一个 poll interval。TriLC 的本地任务队列需要类似的"资源释放即唤醒"信号。

2. **系统休眠检测**（lines ~1273-1290）：通过检测 poll 间隔远超 backoff cap 来识别 OS 休眠/唤醒，重置错误预算而非累积退避。TriLC 的长连接保活需要相同的休眠感知逻辑。

3. **优雅关闭的两阶段超时**（lines ~1451-1463）：SIGTERM → 等 grace period → SIGKILL。TriLC 的 Worker 生命周期需要相同模式。

这三项是**产品设计洞察**，不是代码移植。TriLC 应在自己的架构语境中实现等价机制。

---

## 3. 产品风险

### 风险 1 (HIGH)：远程执行权限模型完全不兼容

bridgeMain 的权限模型是 **"用户运行一次即永久授权云端推送任意任务"**：

- `remoteDialogSeen` flag 是一次性的，之后云端可以在用户不在场时派发 session
- `--permission-mode` 只是传给子 Claude 进程的权限模式，不限制云端**下发什么任务**
- 没有任务审查、没有执行前确认、没有权限分级

TriMetaverse 白皮书要求的是：
- 钱包绑定 = 显式登记为可调度节点
- 本地 Planner 保留任务拒绝/重规划权
- Policy Gate 在服务域和本地域各有一层
- 高风险操作需额外确认

**若把 bridgeMain 的权限模型带入 TriLC，会制造一个"只要开了钱包就能被远程任意执行"的攻击面，直接违反白皮书安全模型。** 这不是可修补的差异，而是产品哲学的根分歧。

### 风险 2 (MEDIUM)：bridgeMain 的 cloud dependency 会污染 TriLC 架构

bridgeMain 2999 行代码中有大量硬编码的 Anthropic 专属依赖：
- `checkGate_CACHED_OR_BLOCKING('tengu_ccr_bridge_multi_session')` — GrowthBook feature flag
- `logEvent('tengu_bridge_*')` — 1P analytics + Datadog
- `api.pollForWork()` / `api.acknowledgeWork()` / `api.stopWork()` — Anthropic Bridge API
- `registerWorker()` — CCR v2 worker registration
- `getBridgeAccessToken()` — OAuth token chain

即使"只提取通用部分"，这些依赖已经深度交织在核心轮询循环中，提取成本远超重写成本。CTO 小狄已在 P10 架构评估中确认 bridgeMain "与键盘输入/IME 零相关，完全不需要移植" —— 相同判断适用于产品层面。

### 风险 3 (MEDIUM)：移植会制造错误的"进度幻觉"

如果对 bridgeMain 做选择性移植，会在 TriLC 的产品路线图上制造一个虚假的"远程执行已就绪"信号。实际上：
- bridgeMain 的 session 模型是 SaaS 订阅制（一个用户多个 session），TriLC 是 P2P 任务制（一个节点承接多个用户的任务）
- bridgeMain 的 worktree 隔离依赖 git，TriLC 需要跨平台沙盒
- bridgeMain 的无状态守护进程模型与 TriLC 的有状态 Planner 模型冲突

---

## 4. 决策

### 产品判断：FREEZE

**bridgeMain.ts 不做任何移植。** 原因：

1. 99.2% 代码是 Anthropic 云服务专属胶水，对 TriMetaverse 零价值
2. 剩余 0.8% 的通用子进程管理模式不值得提取——24 行代码，自行实现成本低于适配成本
3. 权限模型与 TriMetaverse 白皮书安全模型根本冲突
4. 云依赖会污染 TriLC 的 P2P 架构纯度
5. CTO 侧已确认 bridgeMain 与当前 TriLC 输入层移植无任何关系

### 可以提取的产品元知识（非代码）

| 元知识 | 来源 | TriLC 应用场景 |
|--------|------|---------------|
| capacity wake 信号 | bridgeMain lines 194/467 | TriLC 本地任务队列的资源释放通知 |
| OS 休眠检测 + 错误预算重置 | bridgeMain lines 1273-1290 | TriLC 长连接 keepalive 的休眠感知 |
| 两阶段优雅关闭 | bridgeMain lines 1451-1463 | TriLC Worker 生命周期管理 |

这三项应在 TriLC 的 `docs/product/` 或模块级 `product-state.md` 中标注为产品需求，由 CTO 在 TriLC 架构中自行实现，不走 bridgeMain 代码移植路径。

### TriLC 本地域"节点化升级"的正确产品路径

| 优先级 | 事项 | 依赖 | 与 bridgeMain 关系 |
|--------|------|------|-------------------|
| P0 | TriMem 用户注册 + 钱包绑定 | TriMem API | 无 |
| P0 | TriMC Gateway WebSocket 接入 | TriMC (OpenClaw 基线) | 无 |
| P1 | 节点登记 + 角色申请 | 共识平面 | 无 |
| P1 | Planner + ToolBus + Worker 最小闭环 | TriLC 自研 | 无 |
| P2 | 任务接收 → 执行 → 证据上传 | TriMC + TriChain | 无 |
| P3 | 能量积分 + 链上结算 | TriChain + TriStaciss | 无 |

---

## 5. 使用依据

| 依据 | 路径 |
|------|------|
| bridgeMain.ts 源码 (2999行) | `reference/claude-code-2.1.88/src/bridge/bridgeMain.ts` |
| bridgeMain types + workSecret | `reference/claude-code-2.1.88/src/bridge/types.ts`, `workSecret.ts` |
| 白皮书 图3-3 双域架构 | `tmv-whitepaper.md` |
| 白皮书 图3-6 任务时序 | `tmv-whitepaper.md` |
| OpenClaw 双域融合方案 | `docs/openclaw-trimetaverse-dual-domain-integration-plan.md` |
| TriMC Shadow Phase-0 | `docs/trimc-shadow-phase-0-plan.md` |
| 产品真源 (Simplest Verifiable Model + 模块边界) | `docs/registry/product-state.md` |
| 商业战略边界 | `docs/registry/business-state.md` |
| CTO P10 架构评估 (bridgeMain 已确认与输入无关) | `docs/workflow/operating-records/2026-W31/cc-fidelity/p10-architecture.md` |
| CC feature spec 基线 | `docs/workflow/operating-records/2026-W31/cc-fidelity/cc-feature-spec.md` |

---

## 评估签名

- **评估人**：CPO 小乔 (ChiefProductOfficer)
- **决策**：FREEZE — bridgeMain.ts 不做任何代码移植
- **可提取资产**：3 项产品元知识（非代码），建议进入 TriLC 产品需求池
- **下一动作**：无。本评估闭环，不产生新的跨模块依赖

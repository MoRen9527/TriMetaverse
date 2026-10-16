# CTO 细化案 · LG-085 裁①承接 · Zed ACP 协议路线落位 · 2026-10-16

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-acp-refinement-20261016.md）
- syncMode: static（细化案·候呈）
- lastSyncedAt: 2026-10-16T11:50:34+08:00（date 现查·写前跑）
- 令源: CEO 11:44 裁「按 CTO 建议批」+澄清「claude code 支持 acp 驱动，这个 acp 是我想说的那个 acp」——ACP=**Zed Agent Client Protocol**（非 Google A2A）·COS 转办三问

## 〇·总裁定先行

CEO 澄清解锁一个关键简化：**Claude Code 已支持被 ACP 驱动（官方 adapter 现役）→ P3 会话承接的协议面从「候自研 agent loop 长跑成熟」变为「标准 adapter 接现役 Claude Code」**——会话引擎还是 Claude Code 本体（成熟度现役已证），解出的只是宿主壳。P3 最大风险件（评审卷风险 6）就此大降。**两协议分层并存·非取舍；P0 启动时点不受影响。**

## a）Zed ACP 在「BOD CLI↔BOD 会话」链路中的位置

**BOD CLI 作 ACP 宿主，经官方 adapter 驱动 Claude Code（BOD 会话本体）**——与 Zed 驱动 Claude Code 同一形态：

```
层3  客户端（手机/桌面/tmux）──HTTPS(token门+审计)──┐
层2  BOD CLI（M-SG·ACP 宿主+聚合视图+审批路由）      │
     ├─ ACP client（JSON-RPC over stdio）           │
     │    └─ claude-code-acp adapter ── Claude Code（BOD 会话本体）   ← 会话控制面
     └─ HTTP+SSE client ── daemon 族 8712/8713/8711/8710               ← 状态与消息面
层1  daemon 族（现役不动·信箱/快照/健康/审批队列）
```

技术形：CLI（node 进程）实现 ACP client 端→spawn `claude-code-acp`（Zed 官方 adapter·版本 pin）→adapter 包 Claude Code·会话操作走 ACP 标准方法（session/new 载 BOD compass 面面/session/prompt 下发/session/update 流式收/session/load 复活恢复）。

**ACP 对本司的独特增值=permission 面**：ACP 的 `session/request_permission` 机制=会话内敏感工具调用由宿主批——映射到「CLI 弹审批到 CEO 手机→批/拒回流会话」天然贴合（BOD 九条正身「审批权 CEO」的标准化承载面·评审卷 §二⑥ 权限模型在协议层有了现成挂钩点）。

**remote 面（spec 未定稿）不触**：分层恰好绕开——remote 段（手机↔CLI）是自管 HTTPS+token 门（自担·安全底线五条照落）；本地段（CLI↔会话）stdio 同机——ACP 只需本地形，定稿中的 remote 形不依赖。

## b）与 daemon HTTP+SSE 自有面路线的关系：**分层并存·各管一段**

| 面 | 协议 | 承载 | 阶段 |
| --- | --- | --- | --- |
| 会话控制面（驱动 BOD 会话本体） | **Zed ACP**（stdio+官方 adapter） | prompt 流/权限请求/会话生命周期 | P3 主用·P0-P2 期勘验 |
| 状态与消息面（信箱/快照/健康/审批队列） | **daemon HTTP+SSE 自有面**（token 门） | 聚合读数/写回动作/告警 | P0 起全段 |

关系定性：**互补不分歧**——ACP 管「会话怎么被驱动」，HTTP 面管「状态在哪读、动作往哪写」。评审卷批准的「宿主面 daemon HTTP 自有面起步」语义收窄为**状态消息面**；会话控制面由 ACP 承担。无重叠无冲突；A2A 互通面观察位结论不变。

## c）P0 启动时点回对：**不受影响·可即刻候排程**

- P0=只读镜像（信箱分布/快照/healthz 聚合·纯 daemon HTTP 面）——ACP 是 P3 面，P0 零依赖。
- **建议随 P0 排程并挂一个「ACP 勘验窗」**（P3 前置·不动现役 BOD）：本地 CLI 驱动一个测试会话跑通三链=session/new（compass 载入）+session/prompt（任务下发回收）+session/request_permission（权限审批回流）——勘验读数出卷·P3 排程依据。窗内 adapter 版本 pin+spec 版本记录。
- P1/P2 判据不变（评审卷 §三表）。

## 风险与缓解（增量两条·承接评审卷）

7. **adapter 版本耦合**：claude-code-acp 跟随 Claude Code 版本演进——缓解：adapter+spec 双 pin+升级走勘验窗（禁裸升级）。
8. **ACP spec 演进**：v1 变更风险——缓解：勘验窗记录 spec 版本·变更评审后跟进·P3 排程以勘验读数为门。

## 使用依据

- CEO 11:44 裁+澄清（COS 转办）·评审卷 f79525bb3（已批 P0-P3 路径+安全底线五条）；
- 协议现查（10-16 WebSearch）：Zed ACP=JSON-RPC over stdio·remote 形 spec 发展中·复用 MCP·claude-code-acp 官方 adapter 先例（Zed 2025-08 博文）；
- 现役锚：daemon 族 HTTP+SSE+token 门（LG-082 能力面对表）·outbox 三态（LG-036）·hub-watch 71 拍零断档（10-16 实战读数）。

—— CTO 小狄（落款 date 现查原值 2026-10-16 11:50:34 +0800）

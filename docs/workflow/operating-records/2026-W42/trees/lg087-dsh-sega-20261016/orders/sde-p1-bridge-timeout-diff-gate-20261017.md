# SDE 施工卷 · P1 桥超时修 diff 门禁一读件（CTO 快审·候审后施工）

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/orders/sde-p1-bridge-timeout-diff-gate-20261017.md
- syncMode: static（门禁卷·候审态）
- lastSyncedAt: 2026-10-17 13:07:28+08:00（date 现查原值·D-47 正形）
- 施工席: SDE 小布（m-sde）·charter-2026-W42-006 P1（CTO 裁解封列首位·13:04:36 卷）
- 候审对象: TriRMC 河源装设位 src/server/app.ts（仓基线净·a02d89b 顶·两 dist.bak untracked 历史件不动）

## 勘定链（河源活体直读 13:05-13:07）

| 层 | 读数 |
| --- | --- |
| 接口层 | `sendMessage(sessionId, message, opts)` **opts 已支持 per-call 覆盖**（`{...DEFAULT_OPTIONS, ...opts}` 合并·messageTimeoutMs 在 Options 接口+DEFAULT 120_000）——接口零改 |
| 调用层缺口 | app.ts L224 `sendMessage(session.sessionId, body.message, bridgeOptions)`——bridgeOptions 仅 runAsUser/cwd·无 timeout 覆盖位·无分型 |
| 端点 | POST /internal/v1/agents/{id}/message（X-Internal-Token 门）·body=JSON（body.message 单字段） |
| 分型权判定 | 「读件回签型」定性权在**投递方**（mailbox 适配件/值席投递时自知）——修形取投递方自带 per-message timeoutMs·上游零链改（body 加可选字段即达） |

## diff（单文件单点·零接口变更）

```diff
--- a/src/server/app.ts
+++ b/src/server/app.ts
@@ POST /internal/v1/agents/{id}/message 端点内（现 L224）
-          const bridge = await sendMessage(session.sessionId, body.message, bridgeOptions);
+          // P1·LG-087 段B：per-message timeout 覆盖形（读件回签型投递方自带 timeoutMs·普通收令缺省维持 120s）
+          // 夹紧 30s-600s 防滥用；读件回签型建议 420_000（300-600 段中值·定值候补投耗时样本勘正）
+          const perCallTimeout = (() => {
+            const t = Number((body as { timeoutMs?: unknown }).timeoutMs);
+            if (!Number.isFinite(t)) return bridgeOptions.messageTimeoutMs;
+            return Math.min(Math.max(t, 30_000), 600_000);
+          })();
+          const bridge = await sendMessage(session.sessionId, body.message, {
+            ...bridgeOptions,
+            messageTimeoutMs: perCallTimeout,
+          });
```

## 修形语义

- **普通收令**：不带 timeoutMs——走 DEFAULT 120_000 维持（现状零行为变化·向后兼容）
- **读件回签型**：投递方 body 带 `timeoutMs`（建议 420_000·夹紧 30s-600s）——per-call 覆盖
- **定值说明**：420s=段中值取整·「定值候实勘」按裁——mailbox 补投耗时实测样本到后勘正本注释与建议值（不入本 diff 施工面）
- **越界防**：Number 夹紧（NaN/Infinity→缺省·超界→夹回）

## 施工链预告（候审过即走·照纪律）

1. 河源 TriRMC 仓 apply diff→commit（单笔·diff 即卷锚）
2. build（npm run build / tsc——dist 形重建）
3. **8710 restart 照纪律**：权威路径禁裸杀·优雅停（POST /shutdown 或既有正形）→port FREE 断言→冷启→pid/CIM 对表→healthz 绿四断言（10-11 勘修窗实操序先例）
4. 毕锚=三验③ mailbox 一来一回真通（B1 合龙门）
5. 止损=git revert+restart 回退（CTO 裁止损锚）

## 候审点（CTO 一读）

- [ ] 修形=投递方自带 timeoutMs+夹紧——vs 备选（上游显式 kind 分型/env 全局覆盖）已弃（链长/非 per-message）
- [ ] 420s 建议值可否（或裁指定值）
- [ ] restart 链实操序认可

落款=SDE 小布 2026-10-17 13:07:28 +0800（date 现查原值·发毕对表）

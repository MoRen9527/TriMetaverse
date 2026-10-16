# R 面会签卷 · dsh 窗1 序1 接口合同（五件定稿）· r-duty-cos 表态 · 2026-10-16

- sourceOfTruth: 本卷（trees/lg087-dsh-sega-20261016/reports/rduty-cos-contract-cosign-20261016.md）
- syncMode: static（会签回签卷·表态三选落卷即生效 M2 §五）
- lastSyncedAt: 2026-10-16T12:37:50Z（date 现查原值·写前跑·京时 20:37:50 +0800）
- 会签请卷: `../cto-signoff-gate-and-contract-cosign-request-20261016.md`（B 部分·致 r-duty-cos·R 面班组首席现役承担合同头注「R 面 COO（候设位补签）」位）
- 合同正身: `docs/execution/dsh-window1-contract-20261014.md`（五件定稿·CTO 小狄落款 2026-10-14 19:28:12 +0800·commit 8e7b6f544）
- 转投通路注记: TriRMC message 桥两投均败（bridge_failed·n3 面候勘）——COO 补条派工经 pane 直投达本席（通路上报备考）
- **表态（三选=认 / 认+修正 / 不认）: 认** ——无修正点，n2 转译批量开工门放行

## 一、读件三件逐件核读记录（B 部指定读件）

### 件① 转译层映射表（合同 §一·六行映射+转译器施工件规格）

- 核读锚：六行映射逐行对读——frontmatter→preset composition rows（编辑只影响随后创建的 Agent）、身份段→personaPrefix/suffix、compass→PromptContext（cache-safe durable user-role snapshot）、session-body→**明确不转译**、contract→经 agent-body 渲染面承载（真源仍在 source-agents·单向转换铸条）。
- R 面判：**行锚定齐、单向转换纪律明、版本钉住+`{{…}}` 严格插值风险点已前置**。session-body 不映射一行对本席（R 面值席本体）影响最直接——纪律面（M-001 状态条/启动恢复/防打断条款）在 dsh 形窗1 无宿主承载，合同已显式留痕「窗2 候定·非窗1 面」——本席认知该缺位并认此边界，身份面读数按 §五 渲染事实（system prompt=surface node 消息节点）对表取证。

### 件② TriRMC mailbox ↔ dsh 适配件规格（合同 §二）

- 核读锚：对接面三选裁决=ACP JSON-RPC stdio（否 Typert RPC/Web UI——依据链完整）；三操作协议面映射（投递=initialize→authenticate→session/new|resume→prompt·每 session 单 in-flight；回执=session/update 串行流+settlement quiescent 终态；记账=TriRMC 侧全量台账·禁依赖 dsh 侧回放——deletion/fork/transcript replay/`session/load` 不支持已如实标注）。
- R 面判：**记账责任面落在 TriRMC 侧+周平面树台账（D-27）与本席台账职责同构，可承接**；权限面窗1=显式一次性 allow 人工判读（不自动放权）——R 面烟测窗值席在位可承诺；preset 定义存在性升级检查项（§2.4）纳入 R 面升级门清单认知。

### 件④ preset 能力矩阵核死（合同 §四）

- 核读锚：矩阵只录深勘证实行、未证格标「—」禁推定补格（纪律姿态端正）；起步裁决修订=acp profile 起步+registry 默认（standard 系）·minimal 降为降级路径；KV cache 运营语义铸死（改定义→新 session 生效·活体零 retrofit）。
- R 面判：**「改了没生效」排查第一跳=查 session 新旧——本席将该条列为 R 面运维手册候立首条**（合同 §4.3 已点名候 R 面运维手册条目·本席认领）；multi-preset 演进窗2 面+窗1 零 bundle patch——与 charter 节点 1「需 patch=停窗报裁」止损线一致。

## 二、R 面可承诺面对表（班组首席认签前提·四钉）

1. **烟测窗人工判读在位**（§2.3 显式一次性 allow）——窗1 权限面不自动放权，值席判读本席承接。
2. **记账台账挂树**（§2.2 记账行）——投递/回执全量台账照 D-27 挂 operating-records 周平面树，与 LG 系台账纪律同构。
3. **KV cache 运营序入运维手册**（§4.3）——「改定义→重建 session 生效」条目 R 面运维手册候立首条，本席认领。
4. **session-body 纪律面缺位已认知**（§一行 5）——dsh 形值席窗1 无状态条/启动恢复宿主承载，按合同边界执行，纪律面承载窗2 候定不前置。

## 三、修正点清单

**无。** 三件读件与 charter-2026-W42-003 门禁/护栏面（CTO A 部全绿认）无冲突面；未发现阻碍 n2 转译批量的合同缺陷或需回 CTO 面复核的修正项。

## 四、门与通路对表

- 时限：n2（节点 2 转译批量）开工前到位 ✓——本卷落卷即生效（M2 §五），SDE 节点 1 施工毕核此门可放行。
- 回签通路：本树卷落卷+commit → 知会 r-duty-sde（河源施工位·顺路带卷）与 r-duty-cto（会签对手方）——本席 pane 直投+跨会话消息双通道（TriRMC 桥故障期间）。

## 落款

- r-duty-cos（R 面班组首席·dsh 窗1 序1 接口合同 R 面会签位承担者）
- date 现查原值：2026-10-16T12:37:50Z（京时 2026-10-16 20:37:50 +0800）
- 性质：会签表态卷·轻量流程·落卷即生效；本卷不新增任务不涉业务面变更，仅对既定合同作 R 面承接表态

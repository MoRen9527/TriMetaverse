# Claude 宿主 binding-profiles/manifest 缺口 · CPO 审核意见（产品必要性+形态）

- sourceOfTruth: 本件（CPO 半部；联合审核与 CTO 半部合流）
- syncMode: static
- lastSyncedAt: 2026-09-18T22:55+0800
- 实勘: 13 席 profiles 全量 grep+chief-product-officer.json 全读+两 manifest grep（读数见 §一）

---

## 一、实勘读数（先于判定）

| # | 事实 | 读数 |
|---|---|---|
| F1 | 13/13 profiles 含 `hostEntries` 且有 `"host": "claude"` 位（agents+session-body 双入口） | **claude 等价物已部分存在**（单文件双宿主方向已 13/13 就位） |
| F2 | 13/13 `status`/`hostStage` 仍=`current-copilot-host-live` | 席级阶段字段全体陈旧（CLAUDE.md 明示 .claude=主力运行位） |
| F3 | `liveEntry` 主字段仍指 `.github/agents/`（copilot 位）；claude 位只在次级 hostEntries | 主指针偏置 |
| F4 | `supportObjects` 全指 `TriCompany-copilot-host-assets/knowledge/` | claude 宿主支持面（.claude/hub session-body、.tricompany-cognition 运行时、repo 真源指针）未登记 |
| F5 | generation manifest 与 published-copy manifest **grep claude/.claude 零命中** | 两 manifest 不记录 .claude 发布物=发布面登记盲区 |

## 二、问①判定：设计缺口（方向对、追平未完成的「半缺口」）

- **不是合理差异**：双宿主已是常驻现实（.claude=主力运行位，13 席），宿主绑定层（四层能力模型的 Layer 3「当前以什么身份在哪个宿主运行」）必须按宿主如实——现在 claude 宿主的阶段/入口事实要么陈旧（F2）要么缺席（F4/F5）。
- **也不是从零缺口**：hostEntries 13/13 已立——方向（单文件双宿主）正确且过半，缺的是语义追平与 manifest 登记。
- 实害实证：本席 session-body 现述「live 入口…由 `.github/binding-profiles/` 承载」——claude 会话引用 copilot 宿主 profile 作绑定权威=层属错位正在被消费。

## 三、问②形态：**不做镜像树，做三件收尾**（单真源原则）

**否决项**：另建 `.claude/binding-profiles/` 镜像树——一席位两份 profile=第二真源，违反 LG-034 B1 去重红线（两宿主发布拷贝已足够对称，绑定事实必须单点）。

**收尾三件**：
1. **schema 语义追平 v0.2（13 席）**：a) `hostStage`/`status` → 主力位表述（如 `primary_host:"claude"`+每宿主 status，最小改法=hostStage 更新）；b) `liveEntry` 主指针改 claude 位（copilot 保留于 hostEntries）；c) `supportObjects` 分层如实——宿主资产知识层（copilot-assets 实况保留）+宿主无关运行时（.tricompany-cognition）+claude 支持面（.claude/hub session-body）——**不虚造不存在的 claude-assets 树**。
2. **manifest 盲区补登**：generation/published-copy 两 manifest 增 claude 发布记录（.claude/agents 13 件+.claude/hub session bodies）——B1-⑥「宿主随附文件须登记」纪律的机制面落点。
3. `governedBy` 补 claude 发布域依据（FADE-002 管线）。

## 四、验收锚

1. 审计问「某席在 claude 宿主的 live 入口/阶段/支持面」→ profile 单点可答，零借 copilot 字段。
2. 13/13 无孤立的 `current-copilot-host-live` 残留（该词仅可存于 copilot 条目内部语境）。
3. 两 manifest claude 记录非零（13 agents+session bodies 数量对表）。
4. session-body 渲染指针随窗校准（本席 body「由 .github profile 承载 live 入口」句改双宿主表述——借位引用消失）。

## 五、域分工建议

schema 追平与 manifest 补登=数据/机制面（CTO 半部+生成管线）；名册联动（display_name 已有 91 行先例）归 CHO；归档规范归 CAO。本件=产品判定与形态原则+验收锚。

# CPO 产品优先级裁决：TriModel Phase 2 — 8 项 CONDITIONAL_PASS 排序

**裁决人**：小乔（CPO）  
**日期**：2026-07-22  
**任务树**：`cpo-trimodel-phase2`  
**节点**：`cpo-trimodel-phase2-1`  
**裁决类型**：**APPROVE — Phase 2 范围确认，附优先级排序与 W31-W32 kickoff 窗口**

---

## 前置核查摘要

| 核查项 | 结果 |
|--------|------|
| 工作路径核查（0） | ✅ `trees/cpo-trimodel-phase2/` 在中央 workflow 下，正确 |
| 归属路由阀门（0.5） | ✅ 产品优先级、MVP 范围、kickoff 窗口均属 CPO 裁决域 |
| CEO / 用户最新输入 | ✅ 小贾发起子树，明确要求 8 项 CONDITIONAL_PASS 排序 + Phase 2 范围确认 |
| BusinessStrategy | ✅ TriModel 为 **结构预留（P2）**，但 TriLC 升级为本地主入口，TriModel 配置平面 Phase 1 已就绪。本次不触碰总商业模式。 |
| PRODUCT.md / REQUIREMENTS.md / STATE.md | ✅ 均为 published-summary，无额外约束 |
| TriModel product-state.md | ✅ Phase 1 配置平面已登记；三层密钥标准化；TriLC 消费者已确认。Bug/Gap 列表覆盖全部 8 项。 |
| TriModel code-state.md | ✅ v0.2.0，Quality Risks 6 项 + Phase 2 Backlog 8 项已登记 |
| 中央 code-state.md | ✅ Phase 1 放行里程碑已登记（2026-07-22） |
| CTO 终裁 | ✅ 8 项 CONDITIONAL_PASS = 零 BLOCKER，全部转入 Phase 2 |
| 偏差关闭报告 | ✅ 88/88 验证：80 PASS + 8 CONDITIONAL_PASS |
| CompanyGovernanceRegistry | 不涉及（本次无岗位/授权/秘书处变更） |

---

## 1. Phase 2 范围确认

### 1.1 范围基线

Phase 2 承接以下来源的全部待办项：

| 来源 | 数量 | 包含项 |
|------|------|--------|
| Phase 1 偏差关闭 — CONDITIONAL_PASS | 8 项 | TM-REG-001, TM-R-003, TK-011, TK-017, TK-022, TK-023, TP-S-005+006, SK-008 |
| TriModel code-state.md — Quality Risks | 6 项 | 单 provider, 无 lint, 无 CI, fallback 递归, 无 streaming, 文档脱节 |
| **合并去重后** | **8 项** | 如下表 |

### 1.2 8 项最终清单（去重合并后）

| # | ID | 简述 | 来源 |
|---|----|------|------|
| 1 | TM-REG-001 | `readConfig` 测试隔离（`.env` 污染） | Phase 1 COND_PASS |
| 2 | TM-GAP-PROVIDER | 多 provider 支持（Anthropic / OpenAI） | Code Risk #1 |
| 3 | TM-GAP-LINT | ESLint / Prettier 配置 | Code Risk #2 |
| 4 | TM-GAP-CI | GitHub Actions CI pipeline | Code Risk #3 |
| 5 | TM-GAP-FALLBACK | fallback 链递归风险（`v4-pro→chat→v4-pro`） | Code Risk #4 |
| 6 | TM-GAP-STREAM | 流式传输（SSE） | Code Risk #5 |
| 7 | TM-GAP-AGENTS | AGENTS.md / README.md 文档脱节 | Code Risk #6 |
| 8 | **TM-GAP-S2** | **Key S2 AES-256-GCM 加密 + 机器指纹派生密钥** | TK-022 + TK-023 + SK-008 合并 |

> **吸收说明**：以下 4 项 CONDITIONAL_PASS 被吸收进上述 8 项，不单独开 track：
> - **TK-011**（`onKeyCacheUpdated` 回调）→ 并入 TM-GAP-FALLBACK（fallback 链修复时同批补充）
> - **TK-017**（缓存过期 chat 禁用恢复）→ 并入 TM-GAP-FALLBACK（同属容错路径优化）
> - **TM-R-003**（`POST /refresh` 不重读 env var）→ 并入 TM-GAP-S2（Secret Manager 实现时一并解决）
> - **TP-S-005+006**（`visibleModelIds` 未迁移 globalState）→ P3 挂起，Phase 2 末端顺手改，不单独排期

---

## 2. 产品优先级排序

排序依据：**用户可感知价值 × 工程基础杠杆 × 安全风险暴露面 × 延迟成本**。

### 排序结果

| 优先级 | 排名 | ID | 产品理由 | 建议窗口 |
|--------|------|----|----------|----------|
| **P0** | 1 | **TM-GAP-CI** | **基础设施门禁**。无 CI = 每一项后续变更都靠人工回归，Phase 2 所有改动缺乏自动化安全网。先建 CI，后续 7 项全受益。 | W31 Week 1 |
| **P0** | 2 | **TM-GAP-LINT** | **代码质量护栏**。零运行时依赖的小改动，与 CI 同批上线即可形成门禁闭环（lint → CI fail）。杠杆极高。 | W31 Week 1 |
| **P1** | 3 | **TM-GAP-STREAM** | **用户直接可感的 UX 提升**。TriPilot chat 无流式 = 用户看空白等完整响应。所有主流 AI chat 产品以 SSE streaming 为基线预期。**产品竞争力项**。 | W31 Week 2 |
| **P1** | 4 | **TM-GAP-FALLBACK** | **可靠性修复**。`deepseek-v4-pro → deepseek-chat → deepseek-v4-pro` 形成闭环，两个模型同时不可用时 chat 直接抛错。**用户会撞到**。附带给 TK-011 + TK-017。 | W31 Week 2 |
| **P1** | 5 | **TM-GAP-PROVIDER** | **供应链去风险**。当前仅 DeepSeek 单 provider = 单点故障。多 provider 是产品从 "DeepSeek 专用库" 走向 "模型接入统一层" 的关键一步。但当前 DeepSeek 工作正常，优先级略低于容错修复。 | W32 Week 1 |
| **P2** | 6 | **TM-GAP-S2** | **安全升级**。S3（600 权限 + 127.0.0.1）对 Phase 1 本机场景足够，但 Key 落盘明文 = 本机被入侵后所有 Key 暴露。S2 AES-256-GCM + 机器指纹 = 即使 Key 文件泄露也无法在其他机器解密。**安全债务，越早还越好**。附带给 TM-R-003。 | W32 Week 1–2 |
| **P2** | 7 | **TM-REG-001** | **测试卫生**。预存问题，不影响生产行为。CI 就绪后顺手修，不需要独立排期。 | W32 Week 2 |
| **P3** | 8 | **TM-GAP-AGENTS** | **文档债务**。AGENTS.md / README.md 仍标"待初始化"，与 v0.2.0 现实脱节。影响新开发者上手，但不阻塞功能。Phase 2 末端更新。 | W32 末期 / 溢出到 W33 |

### 排序逻辑

```
           ┌─────────────────────────────────────┐
           │   P0: 工程基础 (先建安全网)          │
           │   CI → LINT                          │
           │   理由：后续 6 项全部依赖 CI 验证    │
           ├─────────────────────────────────────┤
           │   P1: 用户价值 (直接可感)            │
           │   STREAM → FALLBACK → PROVIDER       │
           │   理由：用户每天用的功能优先修       │
           ├─────────────────────────────────────┤
           │   P2: 安全硬化 (纵深防御)            │
           │   S2 → REG-001                       │
           │   理由：S3 够用但不够好；测试顺手修  │
           ├─────────────────────────────────────┤
           │   P3: 文档补债                        │
           │   AGENTS                              │
           │   理由：不影响功能，末端消化          │
           └─────────────────────────────────────┘
```

---

## 3. 依赖检查

| 被依赖项 | 依赖方 | 成熟度评估 |
|----------|--------|-----------|
| TriModel 仓库（v0.2.0） | 全部 8 项 | ✅ Phase 1 代码已合入 main，R1 待 ImplementationEngineer 最终合并执行 |
| TriLC 仓库（Key 缓存） | TM-GAP-FALLBACK（TK-011, TK-017） | ✅ Key 缓存模块已就绪，改动面小 |
| TriPilot 仓库（extension.ts） | TM-GAP-STREAM（chat handler） | ✅ TriPilot chat 架构已支持流式扩展 |
| GitHub Actions 可用性 | TM-GAP-CI | ✅ TriMetaverse org 已有多仓库 Actions 先例 |
| Node.js `node:crypto` | TM-GAP-S2（AES-256-GCM + 指纹） | ✅ Node.js 内置，零外部依赖 |
| `events` 模块 | TM-GAP-STREAM（SSE） | ✅ Node.js 内置 |

**无外部阻塞依赖。Phase 2 全部 8 项可以在三仓库现有基础上独立实施。**

---

## 4. Kickoff 窗口建议

### 4.1 推荐窗口：**W31–W32（2026-07-27 ~ 2026-08-09）**

| 窗口 | 内容 | 关键产出 |
|------|------|----------|
| **W30 剩余（7/22–7/26）** | R1 合入 + R2 Registry 回写 + R4 CPO 产品验收 | Phase 1 正式闭合 |
| **W31 Week 1（7/27–7/30）** | P0 冲刺：CI + ESLint 上线 | Phase 2 基础设施就绪 |
| **W31 Week 2（7/31–8/2）** | P1 前半：STREAM + FALLBACK | 用户可感的两项核心改进 |
| **W32 Week 1（8/3–8/6）** | P1 后半：PROVIDER 多路支持 | 供应链去风险 |
| **W32 Week 2（8/7–8/9）** | P2 收尾：S2 加密 + REG-001 + AGENTS | 安全升级 + 测试修复 + 文档同步 |

### 4.2 前置条件（Phase 2 kickoff 门禁）

| # | 门禁项 | 执行人 | 状态 |
|---|--------|--------|------|
| G1 | TriModel/TriLC/TriPilot 三仓库 R1 合入 main | ImplementationEngineer（小全） | ⏳ 待执行 |
| G2 | Step R2 Registry 回写（code-state.md × 3 + product-state.md + 架构文档） | CTO（小狄） + CPO（小乔 R2.5） | ⏳ 待执行 |
| G3 | Phase 1 最终产品验收（R4.1–R4.3） | CPO（小乔） | ⏳ 待执行 |
| G4 | Phase 2 tree-op cpo-trimodel-phase2 节点 0→1 流转 | CEOChiefOfStaff（小贾） | ⏳ 待 CPO 本裁决完成后流转 |

**判定**：门禁 G1–G3 预计 W30 内可完成，W31 kickoff 可行。若 G1 因网络/合并冲突延迟，不晚于 W32 仍可 kickoff。

---

## 5. 风险与升级

| 风险 | 评级 | 缓解 | 升级条件 |
|------|------|------|----------|
| R1 合入延迟（小全网络/合并冲突） | 低 | 改动均为新增文件/独立函数，冲突面小。若延迟 > 3 天，Phase 2 kickoff 顺延至 W32。 | 延迟 > 5 天 → 升级到 CEOChiefOfStaff |
| P0 CI 配置复杂度超预期 | 低 | 单 Node.js 项目，`npm test` + `npm run build` 即可成 pipeline。各模块独立 workflow。 | CI 搭建超 3 天 → 升级到 CTO 裁量 scope cut |
| STREAM + PROVIDER 同时改造成冲突 | 中 | STREAM 改 chat handler 路径，PROVIDER 改 provider 注册表——改动面正交。按 P0→P1→P2 串行排期避免并行冲突。 | 正交性被打破 → 升级到 CTO 联合裁决 |
| S2 加密引入 Key 不可读回归 | 中 | 实施前 CTO 技术方案需包含迁移策略（Phase 1 S3 Key → 首次启动 AES 加密重写）。CPO 要求在 CTO 技术方案中明确回滚路径。 | 无迁移策略 → FREEZE S2，先做其他项 |
| 8 项全部按时完成难度 | 中 | P3（AGENTS）可溢出到 W33。7 项核心在 W31-W32 完成即算 Phase 2 PASS。 | 3 项以上延迟 → 升级到 CEOChiefOfStaff 重新评估 Phase 2 范围 |

---

## 6. 产品判断总结

```
APPROVE — Phase 2 范围确认，P0→P1→P2→P3 四级排序，W31-W32 kickoff。

核心理由：
1. Phase 1 零 BLOCKER 放行，8 项 CONDITIONAL_PASS + 6 项 Quality Risks 合并为 8 项可执行 track
2. P0（CI+LINT）= 先建安全网，后续所有改动有自动化验证
3. P1（STREAM+FALLBACK+PROVIDER）= 用户每天用的功能优先
4. P2（S2+REG）= 安全纵深防御 + 顺手修测试
5. P3（AGENTS）= 末端消化，不阻塞交付
6. 全部 8 项无外部依赖，三仓库现有基础可独立实施
```

---

## 7. next_agent

| Agent | 行动 | 依赖 |
|-------|------|------|
| **ChiefTechnologyOfficer（小狄）** | cpo-trimodel-phase2-2：Phase 2 技术方案设计。基于本 CPO 优先级排序，逐项产出技术方案：CI pipeline（GitHub Actions）、ESLint 配置、流式 SSE 传输、fallback 链修复、Provider 多路支持（Anthropic+OpenAI+本地模型路由）、Key S2 AES-256-GCM 加密 + 机器指纹派生密钥。产出 `phase2-technical-design.md`。**特别要求**：S2 加密技术方案必须包含 Phase 1 S3 → S2 的 Key 迁移策略与回滚路径。 | 本裁决 |

---

## 8. 使用依据

| 依据 | 路径 | 版本/状态 |
|------|------|-----------|
| CTO 终裁 | `trees/cpo-trimodel-deployment/cto-final-ruling.md` | 2026-07-22 |
| 偏差关闭报告 | `trees/cpo-trimodel-deployment/deviation-closeout.md` | 2026-07-21 |
| CPO 裁决（部署模型） | `trees/cpo-trimodel-deployment/ruling.md` | cpo-trimodel-1 + 1b |
| CTO 技术方案 | `trees/cpo-trimodel-deployment/technical-design.md` | cpo-trimodel-2b |
| 树定义 | `trees/cpo-trimodel-phase2/tree-op.json` | v0.1.0 |
| BusinessStrategy | `docs/registry/business-strategy-state.md` | 2026-06-04 |
| 边界 Registry | `docs/registry/business-strategy-boundaries.md` | 2026-07-13 |
| 中央 Code Registry | `docs/registry/code-state.md` | 2026-07-22 |
| 中央 Product Registry | `docs/registry/product-state.md` | 2026-07-10 |
| TriModel Product Registry | `../TriModel/docs/registry/product-state.md` | Phase 1 已登记 |
| TriModel Code Registry | `../TriModel/docs/registry/code-state.md` | v0.2.0, 2026-07-22 |
| CompanyGovernanceRegistry | `docs/registry/company-governance-state.md` | 2026-07-14 |

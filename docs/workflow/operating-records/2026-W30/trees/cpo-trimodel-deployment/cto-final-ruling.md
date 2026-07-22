# CTO 技术终裁：TriModel 配置平面 Phase 1 最终实施决策

**裁决人**：小狄（CTO）  
**日期**：2026-07-22  
**任务树**：`cpo-trimodel-deployment`  
**节点**：`cpo-trimodel-4`（CTO 终裁）  
**裁决类型**：**APPROVE — 条件放行**

---

## 前置核查摘要

| 核查项 | 结果 |
|--------|------|
| 工作路径核查（0） | ✅ 树目录 `trees/cpo-trimodel-deployment/` 正确 |
| 归属路由阀门（0.5） | ✅ 技术终裁属于 CTO 裁决域 |
| CEO / 用户最新输入 | ✅ 双轨验证完成，等待 CTO 终裁 |
| BusinessStrategy | ✅ TriModel = P2 结构预留，本次不触碰模块优先级 |
| 工程真源 | ✅ `DESIGN.md` 发布侧摘要，无额外约束 |
| 中央 Code Registry | ✅ 无冲突；TriLC daemon 已于 W30 闭合 |
| CPO 裁决 | ✅ Q1–Q4 + 附录A 全部 APPROVE；架构修正：纯配置平面 |
| CTO 技术方案 | ✅ `technical-design.md`（修正版），Step 1–4 + 2b 完整 |
| Phase A 测试策略 | ✅ 5 层 × 88 用例设计 |
| Phase B 偏差关闭 | ✅ 88/88 验证：80 PASS + 8 CONDITIONAL_PASS，零 BLOCKER/CRITICAL/MAJOR |
| CompanyGovernanceRegistry | 不涉及（本次无岗位/授权/秘书处变更） |

---

## 1. 放行裁决：**APPROVE — 条件放行 Phase 1**

### 1.1 裁决

```
Phase 1 放行。
8 项 CONDITIONAL_PASS 全部登记为 Phase 2 待办事项，
不阻塞当前交付。
```

### 1.2 逐层门禁复核

| 层级 | 用例数 | PASS | COND_PASS | FAIL/BLOCKER | 裁决 |
|------|--------|------|-----------|-------------|------|
| **L1** TriModel API | 22 | 21 | 1 (TM-REG-001, TM-R-003) | **0** | ✅ PASS |
| **L2** TriLC HTTP 化 | 9 | 9 | 0 | **0** | ✅ PASS |
| **L2b** TriLC Key 缓存 | 23 | 18 | 5 (TK-011/017/022/023) | **0** | ✅ PASS |
| **L3** TriPilot UI | 14 | 12 | 2 (TP-S-005/006) | **0** | ✅ PASS |
| **L4** Key 安全 | 11 | 10 | 1 (SK-008) | **0** | ✅ PASS |
| **L5** 离线容错 | 9 | 9 | 0 | **0** | ✅ PASS |
| **回归** TriLC | 27 | 27 | 0 | **0** | ✅ PASS |
| **回归** TriModel | 14 | 13 | 1 (预存) | **0** | ✅ PASS |
| **总计** | — | — | — | **0 BLOCKER** | ✅ **放行** |

### 1.3 8 项 CONDITIONAL_PASS 定级与处置

| # | ID | 简述 | CTO 定级 | Phase 2 处置 |
|---|----|------|---------|-------------|
| 1 | TM-REG-001 | `readConfig` 预存测试期望空 Key，`.env` 已配置真实 Key | **遗留问题**（非本次引入） | 修复测试：允许 `.env` 注入值 |
| 2 | TM-R-003 | `POST /refresh` 不主动重读 env var | **可接受**（Phase 1 env var 不变） | Phase 2 Secret Manager 实现真正重载 |
| 3 | TK-011 | 缺 `onKeyCacheUpdated()` 显式通知回调 | **可接受**（引用更新即热生效） | Phase 2 补充事件通知 |
| 4 | TK-017 | 缓存过期后 chat 禁用需等下次刷新恢复 | **可接受**（24h TTL >> 15min 刷新） | 可考虑过期时触发立即刷新 |
| 5 | TK-022 | S2 AES-256-GCM 加密未实施 | **Phase 2**（S3 600 权限已满足 MVP） | Phase 2 实施 |
| 6 | TK-023 | 机器指纹派生密钥未实施 | **Phase 2** | Phase 2 实施 |
| 7 | TP-S-005/006 | `visibleModelIds` 未迁移到 globalState | **P1 deferred**（workspace config 正常工作） | Phase 2 迁移 |
| 8 | SK-008 | S2 加密未实施（同 TK-022） | **Phase 2** | Phase 2 实施 |

**判定**：8 项全部为 Phase 2 范畴的未完成功能或预存问题，零项构成 Phase 1 交付阻塞。

---

## 2. 实施拆解 Step

> ⚠️ **重要前提**：Step 1–4 + Step 2b 的代码实施已由 ImplementationEngineer 完成，并通过 TestEngineer 双轨验证。以下步骤聚焦于**正式发布与 Registry 回写**。

### Step R1: 合并与代码冻结（P0，即刻）

| # | 行动 | 执行人 | 产出 |
|---|------|--------|------|
| R1.1 | TriModel 仓库：`src/server.ts` + `src/api/` 分支合入 main | ImplementationEngineer | 合入 PR |
| R1.2 | TriLC 仓库：`key-cache.ts` + `getAvailableModels()` async 改造合入 main | ImplementationEngineer | 合入 PR |
| R1.3 | TriPilot 仓库：`defaultModelSelect` + `setDefaultModel` + globalState 合入 main | ImplementationEngineer | 合入 PR |
| R1.4 | 三仓库 `npm test` 最终确认无回归 | TestEngineer | 回归报告 |
| R1.5 | TriModel `package.json` 版本号 bump（建议 `0.2.0`，反映 API server 新增能力） | CTO | version bump |

### Step R2: Registry 回写（P0，合入后）

| # | 行动 | 执行人 | 产出 |
|---|------|--------|------|
| R2.1 | 更新 `TriModel/docs/registry/code-state.md`：登记 API server 端点、新文件结构、版本号 | CTO | 更新后 registry |
| R2.2 | 更新 `TriLC/docs/registry/code-state.md`：登记 Key 缓存模块、HTTP 优先逻辑、env var 变更 | CTO | 更新后 registry |
| R2.3 | 更新 `TriPilot/docs/registry/code-state.md`：登记 defaultModelSelect UI、globalState 迁移 | CTO | 更新后 registry |
| R2.4 | 更新 `docs/三元宇宙架构与模块说明.md` §4：TriModel 消费者从 "TriMC 与 TriCode" 扩展为 "TriMC、TriLC 与 TriCode"；标注 TriModel 已从 "待初始化" 升级为 "配置平面 API 服务（Phase 1 就绪）" | CTO | 架构文档更新 |
| R2.5 | 更新 `TriModel/docs/registry/product-state.md`：Cross-Module Dependencies 加入 TriLC 为消费者 | CPO（通知后由 CTO 协助） | 产品状态更新 |
| R2.6 | 更新 `TriMetaverse/docs/registry/code-state.md`：Key Milestones 新增 TriModel 配置平面 Phase 1 里程碑 | CTO | 中央 registry 更新 |

### Step R3: Phase 2 待办事项登记（P1）

| # | 行动 | 执行人 |
|---|------|--------|
| R3.1 | 将 8 项 CONDITIONAL_PASS + Phase 2 deferred items（S2 加密、Key 池、Secret Manager）登记为 Phase 2 backlog | CTO → CPO 联合 |
| R3.2 | 确认 Phase 2 kickoff 时间窗口（建议 W31–W32） | CPO + CTO |

### Step R4: TriPilot 最终用户验收（P0，合入后）

| # | 行动 | 执行人 |
|---|------|--------|
| R4.1 | Settings → Models 页：默认模型下拉显示 + 选择 + 持久化 | CPO（产品验收） |
| R4.2 | Chat 界面模型下拉：仅显示启用模型 + 切换仅影响当前会话 | CPO（产品验收） |
| R4.3 | TriLC 离线场景：chat 降级提示文案审核 | CPO |

---

## 3. 风险与缓解

| 风险 | 评级 | 缓解 |
|------|------|------|
| 合并冲突（三仓库并行改造） | 低 | 改造均为新增文件/独立函数，冲突面小 |
| TriPilot UI 回归（globalState 迁移引入） | 低 | P1 迁移有向后兼容逻辑，首次读取自动从 workspace config 迁移 |
| Key 缓存 expire 后 chat 不可用（24h 窗口） | 低 | 24h TTL 远长于 15min 刷新，正常不触发；触发后下次刷新自动恢复 |
| S3（600 权限）vs S2（加密）的安全差距 | 中（Phase 2 范畴） | Phase 1 仅监听 127.0.0.1，Key 不离开本机；Phase 2 升级到 S2 |
| 合并后 npm publish 遗漏 | 低 | TriModel 新增 scripts，`package.json` files 字段需确认包含 `dist/src/api/` |

---

## 4. 发布姿态

| 维度 | 姿态 |
|------|------|
| **Phase 1 就绪条件** | Step R1（合并 + 测试）全部通过，R4（CPO 验收）通过 |
| **回滚路径** | TriModel API 关闭 → TriLC 自动 fallback 到 library + 本地缓存 Key → chat 不受影响（24h 窗口内） |
| **API 契约冻结** | `GET /v1/models`、`GET /v1/config/keys` 在 Phase 1 发布后冻结，后续仅向后兼容扩展 |
| **不可回滚点** | 无——library fallback + Key 文件缓存提供完整的降级路径 |
| **发布顺序建议** | TriModel（服务端）→ TriLC（消费端）→ TriPilot（UI 端）。TriModel 先上线可验证 API server 稳定性，TriLC 再切换 HTTP 优先模式，TriPilot 最后接线 UI |

---

## 5. next_agent 建议

| 优先级 | Agent | 行动 | 依赖 |
|--------|-------|------|------|
| **P0** | **ImplementationEngineer（小全）** | Step R1.1–R1.3：三仓库合并 + 最终回归确认 | 本裁决 |
| **P0** | **CTO（小狄）** | Step R2.1–R2.6：Registry 回写 | R1 完成 |
| **P0** | **CPO（小乔）** | Step R4.1–R4.3：产品验收 + R2.5 product-state 更新 | R1 完成 |
| **P1** | **CPO + CTO 联合** | Step R3：Phase 2 backlog 登记 + kickoff 时间窗口确认 | R2 完成 |
| **P2** | **CEOChiefOfStaff（小贾）** | 树闭合：`cpo-trimodel-deployment` 标记 done | R1–R4 全部完成 |

---

## 6. 使用依据

| 依据 | 路径 | 版本/状态 |
|------|------|-----------|
| Phase A 测试策略 | `trees/cpo-trimodel-deployment/test-strategy.md` | cpo-trimodel-3 |
| Phase B 偏差关闭 | `trees/cpo-trimodel-deployment/deviation-closeout.md` | cpo-trimodel-3b |
| CTO 技术方案 | `trees/cpo-trimodel-deployment/technical-design.md` | cpo-trimodel-2b（修正版） |
| CPO 裁决 | `trees/cpo-trimodel-deployment/ruling.md` | cpo-trimodel-1 + 1b |
| 升级简报 | `trees/cpo-trimodel-deployment/escalation-brief.md` | cpo-trimodel-0 |
| 树定义 | `trees/cpo-trimodel-deployment/tree-op.json` | v0.6.0 |
| BusinessStrategy | `docs/registry/business-strategy-state.md` | 2026-06-04 |
| 中央 Code Registry | `docs/registry/code-state.md` | 2026-07-22 |
| 工程真源 | `docs/engineering/DESIGN.md` | 2026-06-03 |

# LG-026 设计加篇：M/R 双 daemon 组长能力三路线评估（D-15 轻量联审 CTO 主笔）

- sourceOfTruth: TriMetaverse/docs/execution/lg026-mface-leader-capability-routes.md
- syncMode: source-only
- lastSyncedAt: 2026-09-02
- 性质：CEO 新需求触发（M/R 两 daemon 均需业务组）——CTO 主笔技术评估 + COS 合成，候 BOD 裁；不抢 P4 主线
- 需求事实：letters 全套（letter-store/sweeper/endpoints/lead-tools+agent-core minTier）只在 TriRLC 仓已全链 PASS（三期验收 2026-09-02）；TriMLC 仓停在通道 Profile（未含 letters）
- 附加约束：M 面组长 in-process 需通道 Profile 宿主 501 **第二次注册制解锁**（LG-020 附则 + trimlc-channel-daemon-spec §8.6 先例同构，第二张附则 M 面版+治理三件套同构）

## 一、三路线评估

### 路线 a：letters/组长能力抽 TriCode 共享库

- **机制**：letter-store/lead-tools/sweeper/端点注册段从 TriRLC 抽包 TriCode（共享运行时定位，CLAUDE.md 模块说明），双 daemon 依赖共享包。先例=agent-core 共享化（TriCompany/packages/agent-core，TriRLC 消费 minTier 即本役 P2-B3）。
- **优点**：单一真源零同步税；M/R 双消费方+远期 TriMMC 服务器侧（P4 fallback 副本）自然扩展；与「同库 profile 防 fork」立法精神同向。
- **成本/风险**：首期最大——letter-store 与 TriRLC app.ts 端点段耦合需解耦库化；TriCode 包版本发布链+双仓依赖升级；回归面大（好在本役测试全绿基线+ST 验收链可直接复用）。**时机敏感**：P4 fallback 将动 letters 周边面（sync/leader heartbeat/转正），P4 演进期抽库=P4 变更向双消费方扩散，抽早了返工税。
- **工作量**：首期 3-5 天（FD+ST 全链）；建议时机=P4 收口后 letters 稳定期。

### 路线 b：TriMLC 仓间 cherry-pick 同步

- **机制**：TriRLC letters 提交序列 cherry-pick 至 TriMLC。
- **优点**：首期最快（0.5-1 天）。
- **成本/风险**：**长期同步税**——LG-026 仍在演进（P4 未做、组长 live 未上），每笔 letters 变更双仓 pick、冲突面随时间单调涨；漏 pick=行为分叉=最难查的缺陷类；与 LG-020 形态立法①「同库 profile 防 fork」精神**直接相悖**。
- **工作量**：首期小，长期税重且递增。**技术面不推荐**。

### 路线 c：TriMLC 转发员模式

- **机制**：TriMLC 不建 letters 副本——M 面信件经转发薄层转投 R 面组长信箱（直调 R 面 letters API 或经 TriMC 中转托管）；M 面组长延后。
- **优点**：零重复建设；首期小-中（转发层+离线暂存语义 1-2 天）；组长能力集中已 PASS 的 R 面（台账集中审计单信箱）；M 面组长解锁的立法成本（第二次附则）延后到业务真需要时。
- **成本/风险**：M 面寄信可用性依赖 R 面 daemon 在线——本地 R 面睡眠段缺口由 P4 fallback 拓扑补（TriMC 中转+服务器副本，拓扑本就为此设计）；跨机转发延迟（L3 急件语义需在转发层保持 priority 透传）。
- **工作量**：1-2 天。

## 二、推荐（CTO 案，候 BOD）

**分阶段合成：短期 c（转发员）+ 中期 a（TriCode 共享库终局）；b 不取。**

- **短期（即时）**：c 路线让 M 面「有信路」——M 面组长业务分工/件量尚未实证（CPO 域业务面知会点），先以最小成本通邮路，组长能力集中在已验收的 R 面；
- **中期（P4 收口后）**：letters 稳定期做 a 抽 TriCode——此时 M 面需求若已实证（件量/分工），二次解锁 M 面组长（第二张附则）直接消费共享库，抽取风险最低；
- **b 案排除理由**：同步税递增+防 fork 立法相悖，任何期都不建议。

## 三、工作量对比

| 路线 | 首期 | 长期税 | M 面组长能力 | 立法相容 |
| --- | --- | --- | --- | --- |
| a 抽 TriCode | 3-5 天 | 零 | 完整（需二次解锁附则） | ✅ 同向 |
| b cherry-pick | 0.5-1 天 | 递增重税 | 完整副本 | ❌ 相悖 |
| c 转发员 | 1-2 天 | 低 | 延后（信路先通） | ✅ 中性 |

## 四、使用依据

- 需求与实测事实=COS 派单转录（2026-09-02）+本役 P1-P3 验收链（letters 套件 TriRLC 在位实证）
- 防 fork 立法=trimlc-channel-daemon-spec §二.1；二次解锁约束=§8.6 先例+本篇附加约束
- agent-core 共享先例=TriCompany/docs/registry/code-state.md（2026-09-02 minTier 条目）
- CPO 域知会点：M/R 面组长业务分工与件量口径（涉产品面时 CPO 主答，本篇技术评估不含）

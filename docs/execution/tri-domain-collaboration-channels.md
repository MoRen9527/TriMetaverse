# 三端协作通道设计

> **sourceOfTruth**: TriMetaverse/docs/execution/
> **syncMode**: design
> **lastSyncedAt**: 2026-08-17
> **owner**: 小狄（CTO）
> **status**: drafting

## 一、背景与目标

### 1.1 CEO 最高优先级任务（W34首任务）

CEO指令（2026-08-17）：
> 你负责**三端团队协作模型与通信通道规则**的技术设计（小柯并行主笔测试用例矩阵，小乔并行出产品口径，编排层汇总）。

### 1.2 设计范围

1. **三端团队潜在冲突清单与协作方式**
   - 本地研发仓团队（claude code subagent 13人——当前实际运行面）
   - TriLC合约团队（contracts + /agents API）
   - 服务域TriMC舰队（套壳harness——待建）
   - 三支「同构13人」团队的职责边界、协作接口、冲突场景

2. **通信通道与规则**
   - 现有通道盘点
   - 缺口识别
   - 规则设计（通道选型矩阵、优先级与降级、幂等与防重）

3. **与元宇宙纲领对齐**（two-phase-architecture-roadmap.md §〇B）
   - 元现实（TriLC）/元虚拟（TriMC重放审核分流）/元认知（研发仓修差）
   - 本次E2E挖缺陷即首个三元宇宙迭代

### 1.3 已登记冲突项起点（OP 2.54.0）

CEO观察（2026-08-16 22:2x）：
> 装配落点.claude/agents与worktree内Claude Code子代理定义冲突——①装配白名单写.claude/agents/<roleId>.md无preserved保护（同名文件直接覆盖风险，实锤）②双源歧义：Claude Code从目录读子代理vs TriPilot从TriLC合同读（/agents API）——同名agent两处定义两套体系 ③修法方向：装配落点迁daemon contracts目录（合同单源）或全量preserved保护+双源标记。

---

## 二、三端团队定义与职责边界

### 2.1 三面舰队模型（训练期v2.1）

| 域面 | 团队构成 | 运行载体 | 职责边界 | 协作关系 |
|------|----------|----------|----------|----------|
| **本地研发仓** | claude code subagent 13人 | `D:/Code/ai/TriMetaverse/.claude/agents/` | 元认知——修复认知差距（bug = 元现实与元虚拟的认知差距）；全工作区代码修改 | 医生角色：接收项目系统级bug修复请求 |
| **TriLC合约团队** | contracts + /agents API 13人 | `../TriLC/contracts/` + `/agents API` | 元现实引擎——直接执行现实任务+验证；会话态员工装配与执行 | 被训练者：在审核下工作，能力沉淀agent-core |
| **TriMC舰队** | 套壳claude code harness 13人（待建） | `../TriMC/`（套壳先进harness） | 元虚拟——审核拦截+指导正确；任务重放验证；审核分流 | 领导+教练：审核TriLC输出，拦截问题/指导正确 |

### 2.2 三端同构性说明

**同构13人**：三面舰队均包含同一套13名TriCompany员工
- C-level：CEOChiefOfStaff（小贾）、ChiefProductOfficer（小乔）、ChiefTechnologyOfficer（小狄）
- 执行层：FullStackDeveloper（小全）、TestEngineer（小柯）、DeploymentEngineer（小全）、RAndDTrainer（小吴）等
- 治理层：CompanyGovernanceRegistry、TriMetaverseCodeRegistry等

**异构运行载体**：
- 本地研发仓：Claude Code本地subagent spawn机制
- TriLC：contracts目录 + /agents API（装配端点）
- TriMC：套壳先进harness（随官方版本随时更新）

### 2.3 训练期协作模型（三角循环v2.1）

```
医生（研发仓）→ 发现缺陷（全工作区）→ 修复源码 → 回归验证
                    ↓
领导+教练（TriMC）→ 审核TriLC输出 → 拦截问题/指导正确 → 编排任务/纠偏
                    ↓
被训练者（TriLC）→ 在审核下工作 → 缺陷由医生治 → 能力沉淀agent-core
```

**关键特征**：
- TriMC分叉：不走agent-core，去驱动套壳claude code
- TriLC自研：基于agent-core，能力成熟后下沉
- 两域关系：审核和教练关系（TriMC审核TriLC输出，TriMC教练TriLC）
- 不互为镜像：不同上下文，不同agent同时生效
- 三角色闭环：医生治疗全栈缺陷，教练审核把关，被训练者沉淀能力

---

## 三、潜在冲突清单与协作方式

### 3.1 冲突分类矩阵

| 冲突类别 | 冲突点 | 影响面 | 当前状态 | 解决方向 |
|----------|--------|--------|----------|----------|
| **双源歧义** | 同名agent两处定义（研发仓.claude/agents vs TriLC contracts） | 装配时版本不一致 | 实锤冲突 | 单源化 |
| **装配覆盖** | .claude/agents无preserved保护，同名文件直接覆盖 | 数据丢失风险 | 已发现问题 | 迁移落点/preserved保护 |
| **能力差异** | 三端能力清单不同步（训练期TriLC能力不完整） | 任务派发失败 | 训练期特征 | 能力差距发现机制 |
| **会话隔离** | 研发仓会话独立维护，与TriLC/TriMC舰队会话互不干扰 | 治理产物同步 | 设计预期 | 独立维护正确态 |
| **版本漂移** | 三端agent定义版本不同步 | 行为不一致 | 需治理机制 | 版本同步机制 |

### 3.2 冲突A：双源歧义（OP 2.54.0）

**问题描述**：
```
本地研发仓：D:/Code/ai/TriMetaverse/.claude/agents/<roleId>.md
TriLC合约：  ../TriLC/contracts/<roleId>.md + /agents API
```

**影响**：
1. Claude Code从目录读子代理 vs TriPilot从TriLC合同读（/agents API）
2. 同名agent两处定义两套体系
3. 装配白名单写.claude/agents/无preserved保护，同名文件直接覆盖

**解决方向对比**：

| 方案 | 描述 | 优势 | 劣势 | 推荐度 |
|------|------|------|------|--------|
| **A1：落点迁移** | 装配落点从.claude/agents迁移到daemon contracts目录 | 合同单源，彻底消除歧义 | 需改装配端点路径；破坏研发仓本地subagent直接使用 | ⭐⭐⭐⭐ |
| **A2：全量preserved保护** | .claude/agents全量preserved字段保护 | 研发仓本地subagent继续可用 | 仍有双源，维护两套定义；preserved语义复杂 | ⭐⭐ |
| **A3：双源标记** | 两处定义都标记source（local/contract），运行时选源 | 明确区分用途 | 复杂度增加；仍需维护两套 | ⭐⭐⭐ |
| **A4：装配白名单扩展** | 白名单枚举保护，禁止同名覆盖 | 最小改动 | 治标不治本；白名单维护成本 | ⭐ |

**推荐方案**：A1（落点迁移）+ A4（装配白名单扩展）组合
- 落点迁移到contracts目录实现单源化
- 白名单扩展作为补充护栏
- 研发仓本地subagent通过symlink或新路径保留（如.claude/dev-agents/）

### 3.3 冲突B：能力差异（训练盲区漏洞）

**CEO发现（2026-08-16）**：
> TriLC没有的能力→想不到发起；TriMC有能力→收不到这类任务（任务是TriLC发起的）；研发仓→收不到修复需求——缺失能力三不通永远无法被发现。

**解决方向**：
1. **能力基准建设**（技术侧）：TriMC（套壳harness）能力基准diff TriLC能力清单
2. **反向任务流**（技术侧）：TriMC反向下发测试任务到TriLC
3. **差距看板**（产品侧）：差距分级、优先级、商业价值关联
4. **双向融合**（系统）：两流融合——TriLC发起的forward流 + TriMC发起的reverse流

**协作流设计**：
```
TriMC能力基准 → diff TriLC能力清单 → 发现缺失
                         ↓
              反向下发测试任务（可挂周工作平面）
                         ↓
              TriLC执行测试 → 确认缺失
                         ↓
              派研发仓修复 → 沉淀agent-core → 能力收敛
```

### 3.4 冲突C：会话隔离（正确态设计）

**设计预期**（双域舰队设计§4.1）：
```
研发仓域（独立舰队，独立会话）
  TriLC sessions.db（独立维护）
```

**协作方式**：
- 研发仓会话独立维护，与TriLC/TriMC舰队会话互不干扰
- 治理产物（周平面/各仓代码）通过git同步
- 会话真源各自独立，无需双向同步

**接口设计**：
- 本地研发仓会话：claude code本地subagent spawn机制
- TriLC会话：sessions.db + SSE
- TriMC会话：待建设的套壳harness会话机制

---

## 四、通信通道与规则

### 4.1 现有通道盘点

| 通道 | 起点 → 终点 | 协议 | 用途 | 状态 |
|------|-------------|------|------|------|
| **claude code subagent spawn** | 研发仓 → 研发仓subagent | 内存IPC | 本地subagent派发与通信 | ✅运营中 |
| **SendMessage** | agent → agent（同一session） | Claude Code机制 | Agent间协作消息 | ✅运营中 |
| **daemon HTTP/SSE** | TriPilot/TriLC CLI → TriLC Daemon | HTTP+SSE | 任务提交/会话流/工具调用 | ✅运营中 |
| **/agents API** | TriPilot → TriLC contracts | HTTP | 获取员工合同定义 | ✅运营中 |
| **session-bridge** | TriMC → TriLC | HTTP+dispatchAsync | 会话桥接与任务派发 | ✅运营中 |
| **ssh+cron API+git** | 本地 → TriMC（服务域） | SSH/Git | 运维级服务器操作 | ✅运营中 |
| **sync-engine** | TriLC → TriMC | HTTP | 单向session同步 | ✅运营中（仅单向） |
| **五维bundle** | 本地 → TriMC | Git Bundle | company/model/keys/employees/project | ✅运营中 |

### 4.2 通道缺口识别

| 缺口 | 影响 | 优先级 | 候选方案 |
|------|------|--------|----------|
| **编排层→服务域舰队会话级派单** | 训练流程v2.1的TriMC侧C-level审核承载 | P0 | session-bridge扩展 / 新建dispatchAsync端点 |
| **TriMC→TriLC反向同步** | 服务域离线期会话回流 | P1 | sync-engine扩展反向同步 |
| **能力差距发现通道** | 训练盲区漏洞修复 | P1 | TriMC主动下发测试任务 |
| **双向冲突解决** | 双域session同步冲突 | P2 | sync-engine冲突状态机扩展 |

### 4.3 通道选型矩阵

| 动作类型 | 推荐通道 | 备选通道 | 降级方案 | 理由 |
|----------|----------|----------|----------|------|
| **研发仓内部协作** | SendMessage | - | 直接写入memory文件 | 同session零延迟 |
| **TriPilot→TriLC任务** | /v1/messages (SSE) | /internal/v1/tasks/submit | CLI直接调用 | SSE流式返回，体验最佳 |
| **TriLC→TriMC执行回传** | TaskMirrorPusher (HTTP) | sync-engine | 存本地等联网 | 事件推送，幂等安全 |
| **TriMC→TriLC任务派发** | session-bridge (dispatchAsync) | SSH+cron | - | 会话级派单，编排层必备 |
| **研发仓→TriMC git同步** | Git push/pull | - | - | 治理产物真源 |
| **五维配置同步** | Git bundle + cron apply | - | 手动bundle | 幂等原子，审计友好 |
| **服务域离线推进** | cron job + git bundle | - | - | 自动化，可审计 |
| **能力差距下发** | TriMC→TriLC HTTP端点（新建） | - | 挂周工作平面 | 训练期专属 |

### 4.4 优先级与降级规则

**优先级层次**（从高到低）：
1. **安全层**：密钥保护、preserved字段保护、白名单纪律
2. **核心层**：agent-core能力、session连续性、git真源
3. **编排层**：任务派发、审核分流、能力差距发现
4. **同步层**：session同步、五维同步、git同步
5. **观测层**：审计日志、时间线回溯、性能监控

**降级策略**：
| 场景 | 降级动作 | 恢复条件 |
|------|----------|----------|
| TriMC不可达 | 使用本地会话（fallback）+ 存队列 | TriMC恢复后批量发送 |
| 同步失败 | 降级到本地模式，标记syncStatus='error' | 下次同步成功后清除 |
| 装配失败 | 回滚到上一个稳定版本 | 人工介入修复 |
| 任务派发失败 | 重试3次，失败后转人工 | 人工确认后重派 |

### 4.5 幂等与防重

**幂等设计**：
- Git操作：基于commit SHA的幂等（重复push同一SHA无效果）
- Bundle应用：基于bundleId的幂等（重复apply同一bundle检测already_exists）
- Session同步：基于(seq, sessionId)的幂等键
- 任务派发：基于taskId的幂等

**防重设计**：
- sync-engine 409去重：相同sessionId+seq的同步请求被拒绝
- Cron任务：state.nextRunAtMs保护（手动复位抹除该字段导致永不调度——已登记纪律）
- Agent spawn：同一session内同一agentId只spawn一次

---

## 五、与元宇宙纲领对齐

### 5.1 三元宇宙定位（two-phase-architecture-roadmap.md §〇B）

| 域 | 元宇宙定位 | 职责 | 通信通道映射 |
| --- | --- | --- | --- |
| **TriLC（本地域）** | **元现实引擎**（雏形）=「真实部署、规则执行」 | 直接执行现实任务+验证 | daemon HTTP/SSE、/agents API、session-bridge |
| **TriMC（服务域）** | **元虚拟** =「仿真沙盒/可复现实验与回放/评测与反馈」 | 任务重放验证；审核验证与分流 | session-bridge扩展、反向同步、能力差距下发 |
| **本地研发仓** | **元认知引擎** =「知识生产、任务编排、评测与反馈」 | 修复认知差距——bug的本质=元现实与元虚拟的认知差距 | SendMessage、git、本地subagent spawn |

### 5.2 训练循环本质=认知差距闭合回路

```
元现实执行（TriLC）→ 元虚拟重放分流（TriMC）
                                ↓
                    优化回路 / 元认知修差（研发仓）
                                ↓
                          元现实再执行（TriLC）
```

**通信通道支撑**：
1. 元现实→元虚拟：TaskMirrorPusher + sync-engine（单向）
2. 元虚拟→元认知：项目系统级bug走git（医生修复）
3. 元虚拟→元现实：发回重做（非系统级）
4. 元认知→元现实：agent-core能力下沉（发布流）

### 5.3 本次E2E挖缺陷=首个三元宇宙迭代

**迭代目标**：
1. 挖三端协作缺陷（能力差距/冲突/通道缺口）
2. 完善协作模型（修正双源歧义/能力差距发现机制）
3. 验证通信规则（幂等/降级/防重）

**验证指标**：
- 缺陷发现率：三端交叉验证发现独有缺陷数
- 修复闭环率：发现缺陷→修复→验证的闭环比例
- 能力收敛度：TriLC能力与TriMC能力基准的差距缩小

---

## 六、技术实施建议

### 6.1 分阶段实施

**Phase 1：冲突A解决（双源歧义）- P0**
- 落点迁移：装配落点从.claude/agents迁移到contracts目录
- 白名单扩展：枚举保护，禁止同名覆盖
- 研发仓本地subagent保留路径（.claude/dev-agents/）

**Phase 2：缺口1通道建设（编排层→服务域舰队会话级派单）- P0**
- session-bridge扩展：dispatchAsync端点完善
- TriMC侧C-level审核承载
- 与训练流程v2.1对齐

**Phase 3：冲突B解决（能力差异）- P1**
- 能力基准建设：TriMC能力基准diff TriLC能力清单
- 反向任务流：TriMC反向下发测试任务
- 双向融合循环

**Phase 4：缺口2通道建设（TriMC→TriLC反向同步）- P1**
- sync-engine扩展：反向同步能力
- 冲突状态机扩展
- 服务域离线期会话回流

**Phase 5：观测与验证 - P2**
- 审计日志完善
- 一致性校验面
- E2E测试矩阵

### 6.2 门禁与验证

**单测覆盖**：
- 装配白名单枚举逻辑
- session-bridge dispatchAsync幂等性
- sync-engine反向同步冲突检测
- 能力基准diff算法

**集成测试**：
- 三端协作E2E：研发仓→TriLC→TriMC
- 双源歧义防护：同名覆盖拒绝
- 能力差距发现：反向任务下发
- 服务域离线回流：会话同步恢复

**活体冒烟**：
- CEO机装后态验证
- 三端独立运行验证
- 通道降级验证

---

## 七、待产品口径确认

### 7.1 冲突A解决方向产品确认
- 落点迁移后研发仓本地subagent使用体验
- 白名单枚举维护成本
- .claude/dev-agents/路径命名

### 7.2 能力差距分级产品口径
- 差距分级标准（critical/high/medium/low）
- 优先级判定规则
- 商业价值关联方式

### 7.3 降级体验产品口径
- TriMC不可达时的用户提示
- 降级期间功能范围说明
- 恢复后的同步提示

### 7.4 E2E测试矩阵产品口径
- 测试场景优先级
- 验收指标定义
- 缺陷分级标准

---

## 八、总结

### 8.1 三端协作模型核心结论

1. **三端同构13人，异构运行载体**：职责边界清晰，协作关系明确
2. **双源歧义必须单源化**：推荐落点迁移到contracts目录
3. **能力差距需主动发现**：TriMC能力基准diff + 反向任务流
4. **会话隔离是正确态**：研发仓会话独立维护，无需双向同步

### 8.2 通信通道核心结论

1. **现有通道足够，缺扩展**：主要缺口是编排层→服务域舰队会话级派单
2. **通道选型清晰**：按动作类型映射到推荐通道
3. **优先级层次明确**：安全层 > 核心层 > 编排层 > 同步层 > 观测层
4. **幂等防重机制完备**：基于SHA/bundleId/seq/taskId的幂等键

### 8.3 与元宇宙纲领对齐

1. **三元宇宙定位精确映射**：元现实/元虚拟/元认知对应三端职责
2. **训练循环本质=认知差距闭合**：通信通道支撑闭环流转
3. **本次E2E挖缺陷=首个三元宇宙迭代**：验证迭代机制

---

**版本**：v1.0.0
**起草人**：小狄（CTO）
**日期**：2026-08-17
**状态**：待产品口径确认

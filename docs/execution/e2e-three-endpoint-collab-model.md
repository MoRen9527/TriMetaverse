# E2E 测试：三端协作模型与通信通道规则（技术面）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/e2e-three-endpoint-collab-model.md
- syncMode: source-only
- lastSyncedAt: 2026-08-17
- status: drafting
- owner: 小狄（CTO）

> 版本：v1.0
> 日期：2026-08-17
> 背景：CEO 指令（W34 首任务最高优先级）——设计深度 E2E 测试方案，充分测试三端协同与两入口轮换同步情况
> 关联：小乔（CPO）测试用例矩阵 × 小狄（CTO）技术面设计

## 零、设计目标与范围

### 0.1 E2E 测试目标

**核心验证**：本地研发仓 × TriMC × TriLC 三端能否正确协同操作同一项目，在两入口（TriPilot 面板 / trilc chat CLI）轮换时状态一致。

**验收口径**：初始化到协同全链路（SELFCHECK → ONBOARDING → PROJECT-LINK → SYNC → CONFIRM → READY）通过后，周平面平移测试（W33→W34）作为第一个协同工作跑通。

### 0.2 三端定义（技术口径）

| 端 | 物理位置 | 技术形态 | Git 形态 | 写权 |
|------|----------|----------|----------|------|
| **本地研发仓** | `D:/Code/ai/TriMetaverse` | dev 主 checkout | dev 分支 | ✅ 写 dev（唯一写主体） |
| **TriCade/TriLC** | 用户 worktree（任意路径） | TriLC daemon 会话面 | project/<key> worktree | 例外写走 PR |
| **TriMC** | `/srv/fleet/TriMetaverse` | 服务器 Meta Controller | dev 克隆（ff-only） | 只读 |

### 0.3 设计范围（技术面）

1. **三端协作模型**：协作机制、git 链一致性与竞态处理、五维同步各维失败注入场景
2. **通信通道与规则**：装配落点冲突（.claude/agents 与 agent 合约）、两入口一致性
3. **冲突解决协议**：同名 agent 两处定义的优先级、装配覆盖风险应对机制

---

## 一、三端协作契约模型

### 1.1 总体架构：单状态机 + 两入口瘦客户端

```
┌─────────────────────────────────────────────────────────────────┐
│                        三端协作模型                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  本地研发仓 (写主体)          TriMC (只读)      TriCade/TriLC     │
│  ┌──────────────┐           ┌──────────────┐   ┌──────────────┐ │
│  │ D:/Code/ai/ │◄──────────►│ /srv/fleet/  │◄──┤ worktree     │ │
│  │ TriMetaverse│   git链    │ TriMetaverse  │   │ (任意路径)   │ │
│  │ dev checkout│           │ dev clone     │   │ project/<key>│ │
│  └──────────────┘           └──────────────┘   └──────────────┘ │
│         ▲                            ▲                 ▲           │
│         │ git push/pull             │ ff pull         │           │
│         │                            │                 │           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │               trilc daemon 持久状态机                      │ │
│  │  UNINITIALIZED → SELFCHECK → ONBOARDING → PROJECT-LINK    │ │
│  │    → SYNC → CONFIRM → READY                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│         ▲                            ▲                 ▲           │
│         │ SSE 事件流                 │                 │           │
│  ┌──────────────┐           ┌──────────────┐   ┌──────────────┐ │
│  │ TriPilot     │           │ TriPilot     │   │ trilc chat   │ │
│  │ 面板渲染     │           │ 面板渲染     │   │ CLI 渲染     │ │
│  └──────────────┘           └──────────────┘   └──────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**关键契约**：
- **状态机真源**：trilc daemon 侧持久状态机，两入口只发指令 + 收 SSE 进度/状态
- **零本地执行**：TriPilot/TriLC 不本地执行（W30 契约同构），所有执行由 daemon 承载
- **单写主体**：dev 分支只由研发仓写，生产面/舰队面只读
- **ff-only 同步**：只读面一律 ff-only，不做 merge/rebase 类非线性操作

### 1.2 状态机定义（初始化链路）

| 状态 | 含义 | 入口条件 | 出口条件 |
|------|------|----------|----------|
| UNINITIALIZED | 未初始化 | TriCade 启动 | SELFCHECK 通过 |
| SELFCHECK | 安装态自检 | daemon healthz + TriModel 3333 可达 | 诊断卡通过 |
| ONBOARDING | 公司开张与员工开业 | 用户交互完成 | 装配骨架落盘 |
| PROJECT-LINK | 项目 worktree 建立认领 | worktree add/claim 完成 | 注册点登记 |
| SYNC | 五维同步 TriMC | bundle commit/push 成功 | TriMC applied |
| CONFIRM | 协同确认三方比对 | L1-L4 校验通过 | 三端同源验证 |
| READY | 可协同 | CONFIRM 通过 | 周平面平移测试可触发 |

### 1.3 两入口一致性规则

**规则一：状态真源单一**
- 初始化进度、阶段状态、错误信息全部由 daemon 状态机承载
- TriPilot 面板与 trilc chat 都是只读投影 + 指令发起方，不各自维护流程状态

**规则二：入口差异仅在渲染层**
- TriPilot 面板 = 结构化向导（进度条 + 阶段卡 + 表单）
- trilc chat = 对话叙事（同一状态机经 chat 对话呈现）
- 状态机与执行体唯一

**规则三：中途切换入口不丢进度**
- 任一入口推进到新阶段，另一入口下次交互时读到同一阶段
- chat 里开张到一半 → 打开面板 → 从同一断点继续

**规则四：冲突防护**
- 同一状态机同一时刻只接受一个入口的写指令
- daemon 状态机单执行体 + 指令串行化
- 另一入口显示「正在另一入口操作中」

---

## 二、通信通道与规则

### 2.1 git 链一致性模型

**双远端同步链路**：

```
本地研发仓（dev 分支）
  ↓ push origin
github.com/MoRen9527/TriMetaverse（PR 备份面）
  ↓ push sg-server
sg-server:/srv/git/TriMetaverse.git（裸仓，中转）
  ↓ ff pull
/srv/fleet/TriMetaverse（舰队面，只读）
```

**TriMC 侧应用**：
- cron job `config-sync-apply`：读 bundle → 版本比对 → 应用到 `TRIMC_CONFIG_DIR/init-sync/`
- `GET /internal/v1/config/sync/status`：applied bundleId、fleet HEAD、各维度摘要

### 2.2 五维同步协议（git 载体）

| 维度 | 内容 | 来源（本地真源） | 同步方式 |
|------|------|------------------|----------|
| 模型 | 模型目录 + default_model + provider 链 | TriModel `/v1/models` + keys 响应 | bundle.model |
| key | 配置面 + 指纹（不含材料） | TriModel `/v1/config/keys` | bundle.keys |
| 员工 | 开业员工名单 + 合同源 commit | company/state.json + TriCompany git | bundle.employees |
| 公司 | state / companyName / ceoName | company/state.json | bundle.company |
| 项目 | activeProjectKey + worktree 清单 | project-registry.json | bundle.project |

**bundle 落点**：`docs/registry/init-sync/sync-config.json`

**同步时机**：
- P1 完成（公司维）→ 中间 bundle
- P2 完成（项目维）→ 中间 bundle
- P3 完成（模型/key 维）→ 中间 bundle
- P4 统一生成最终 bundle → 一次性 commit/push

### 2.3 协同确认：三端同源比对

**分层验证（L1-L4）**：

| 层 | 验证内容 | 方法 | 通过标准 |
|---|----------|------|----------|
| L1 | 项目身份一致 | project key + repoUrl + worktree 路径三元素比对 | 完全匹配 |
| L2 | 版本一致 | local dev HEAD == bundle.devHead == fleet HEAD | 三值相等或 ff 收敛可达 |
| L3 | 写读闭环（正向） | bundle commit → push → applied 回读 | applied bundleId == 本地 bundleId |
| L4 | 写读闭环（反向） | 周平面迁移 commit 可见 | W33→W34 产物三端可见 |

---

## 三、冲突检测与解决协议

### 3.1 装配落点冲突（.claude/agents 与 agent 合约）

**问题描述**：TriCade worktree 的 `.claude/agents/` 与 TriCompany `source-agents/` 可能出现同名 agent 两处定义。

**冲突场景**：

| 场景 | 位置 | 冲突类型 | 影响 |
|------|------|----------|------|
| 装配覆盖 | onboarding 写 `.claude/agents/` | 覆盖 worktree 内已存在定义 | 装配误删本地修改 |
| 合约漂移 | TriCompany 合同更新后未同步 | worktree 内定义过期 | 行为不一致 |
| 多源装配 | 两入口同时装配同一 agent | 写冲突 | 状态机竞态 |

**解决协议**：

| 决议 | 规则 | 技术实现 |
|------|------|----------|
| **装配优先级** | source-agents 为唯一真源，`.claude/agents/` 为投影 | 装配端点检测冲突 → 拒绝写入 + 提示先同步 TriCompany |
| **原子装配** | 装配动作使用 Write 工具原子完成 | 端点内验证 → 写入 → 回读确认 |
| **冲突检测** | 同名 agent 存在时进行内容比对 | SHA-256 hash 比对，差异拒绝写入 |
| **回滚机制** | 装配失败时回退到装配前状态 | tmp → rename 原子写 + 失败清理 |

### 3.2 git 链竞态处理

**竞态场景**：

| 场景 | 并发操作 | 冲突类型 | 后果 |
|------|----------|----------|------|
| push 期间 pull | 本地 push → 裸仓 ← 舰队 pull | 远程 HEAD 漂移 | push 失败需 rebase |
| bundle 生成期间 commit | bundle 写入 ← 用户 commit | bundle 内容过期 | 同步失败需重生成 |
| 双端写 dev | 研发仓 commit ← TriMC 侧写 | 违反单写主体 | git 身份纪律违规阻断 |

**解决协议**：

| 决议 | 技术实现 |
|------|----------|
| **身份单一纪律** | git 操作固定单一身份，禁多身份混用 |
| **push 重试机制** | push 失败 → ff pull → 重试，最多 3 次 |
| **bundle 幂等性** | bundleId + generatedAt 单调版本，同 bundleId = no-op |
| **写权护栏** | TriMC 侧 fleet 单身份，本地侧 operating-records 只读 |

### 3.3 双入口指令竞态

**护栏机制**：

```
daemon 状态机单执行体
  ↓ 指令串行化
同一状态机互斥锁
  ↓ 指令队列
FIFO 处理，另一入口显示「正在另一入口操作中」
```

**实现要点**：
- daemon 侧指令队列锁（mutex）
- SSE 事件通知另一入口忙碌状态
- 指令去重（同指令重复提交 = no-op）

---

## 四、失败注入场景设计

### 4.1 五维同步各维失败注入

| 维度 | 失败注入点 | 注入方法 | 预期行为 | 验证点 |
|------|------------|----------|----------|--------|
| 模型 | TriModel 3333 不可达 | 停止 TriModel 服务 | 降级继续，标「待补」 | SELFCHECK 诊断卡 |
| key | 认证失败（token 错） | 篡改 TRIMODEL_API_TOKEN | 阻塞提示，初始化暂停 | ONBOARDING 阻塞 |
| key | 条目缺失 | keys 面删除某 provider | 逐 provider 降级 | SYNC 阶段不阻塞 |
| 员工 | TriCompany 仓滞后 | 不 pull TriCompany | bundle 校验失败 + 触发 pull | SYNC 阶段告警 |
| 公司 | state.json 损坏 | 篡改 state.json | 装配端点拒绝 + 提示修复 | ONBOARDING 阶段阻断 |
| 项目 | worktree 路径冲突 | 创建同名 worktree | PROJECT-LINK 阶段拒绝 | 项目面初始化失败 |
| 同步链 | push 失败（网络/身份） | 断网 / 篡改 git 身份 | sync-pending 挂起 + 重试 | SYNC 阶段重试机制 |
| 同步链 | TriMC HTTP 不可达 | 停止 TriMC 服务 | 降级为「本地 push 成功 + 人工确认」 | CONFIRM 降级路径 |

### 4.2 git 链失败注入

| 场景 | 注入方法 | 预期行为 | 验证点 |
|------|----------|----------|--------|
| 远端 HEAD 漂移 | 在 push 期间外力 commit | push 失败 → ff pull → 重试 | L2 版本一致校验 |
| 裸仓不可达 | 停止 sg-server | push 失败 → sync-pending | L3 写读闭环失败 |
| 舰队 pull 失败 | 篡改 fleet 身份 | TriMC 读不到最新 bundle | status 端点异常 |
| 身份冲突 | 多身份混用操作 | git 身份纪律违规阻断 | 阻断 + 诊断提示 |

### 4.3 双入口竞态失败注入

| 场景 | 注入方法 | 预期行为 | 验证点 |
|------|----------|----------|--------|
| 同时操作同一阶段 | 两入口同时发指令 | 其中一个显示「正在另一入口操作中」 | 指令队列锁生效 |
| 状态机状态漂移 | 直接篡改状态文件 | SSE 事件通知 + 状态不一致检测 | 状态校验失败 |
| 指令重复提交 | 同指令快速重发 | 去重机制 = no-op | 幂等性验证 |

---

## 五、可测场景与验证点

### 5.1 E2E 验证链路

**主链路**：

```
1. SELFCHECK
   - daemon healthz ✓
   - TriModel 3333 可达 ✓
   - TriPilot 可用 ✓
   → 诊断卡通过

2. ONBOARDING
   - CEO 名输入 ✓
   - 员工选择（≥5 人）✓
   - 装配骨架落盘 ✓
   - `.claude/agents/` 生成 ✓
   - `company/state.json` 更新 ✓

3. PROJECT-LINK
   - 项目源选择（本地仓 / GitHub 链接）✓
   - worktree 建立/认领 ✓
   - 注册点登记 ✓
   - project-registry.json 更新 ✓

4. SYNC
   - bundle 生成 ✓
   - commit/push 成功 ✓
   - TriMC applied ✓
   - status 端点回读 ✓

5. CONFIRM
   - L1: 项目身份一致 ✓
   - L2: 版本一致 ✓
   - L3: 写读闭环（正向）✓
   - L4: 写读闭环（反向）✓

6. READY
   - 周平面平移测试（W33→W34）✓
   - 三端可见同一周平面 ✓
```

### 5.2 两入口轮换验证

**验证步骤**：

1. TriPilot 完成阶段 1-2（SELFCHECK → ONBOARDING）
2. 切换到 trilc chat，验证状态同步（从断点继续）
3. trilc chat 完成阶段 3（PROJECT-LINK）
4. 切换回 TriPilot，验证状态同步（从断点继续）
5. TriPilot 完成阶段 4-5（SYNC → CONFIRM）
6. trilc chat 验证最终状态（READY）

**验证点**：
- 状态快照一致（状态文件比对 + 事件序号单调）
- 无重复提问
- 阶段入口来源正确

### 5.3 装配冲突验证

**场景 A：装配覆盖**
1. 在 worktree 内手动修改某 agent 定义
2. 触发 onboarding 装配同名 agent
3. 验证：冲突检测 → 拒绝写入 + 提示先同步

**场景 B：合约漂移**
1. 更新 TriCompany source-agents 某合同
2. 不同步 worktree 内定义
3. 验证：行为不一致检测 → 提示同步

**场景 C：双入口竞态**
1. TriPilot 与 trilc chat 同时装配同一 agent
2. 验证：指令队列锁生效 → 其中一个等待

---

## 六、技术风险与缓解

| 风险 | 缓解措施 | 验证方式 |
|------|----------|----------|
| 装配覆盖本地修改 | 冲突检测 + 拒绝写入 | E2E 场景 A |
| git 链竞态 | 身份单一纪律 + push 重试 | git 链失败注入 |
| 双入口指令竞态 | 指令队列锁 + 去重 | 双入口轮换验证 |
| 五维同步泄密 | key 维只同步配置面 + 指纹 | bundle schema 校验 |
| 状态机状态漂移 | SSE 事件通知 + 状态校验 | 状态文件篡改测试 |
| TriMC HTTP 不可达 | 降级路径（人工确认） | 停止 TriMC 服务测试 |

---

## 七、与测试用例矩阵对接

### 7.1 技术验证点映射

| 小乔用例分类 | 对应技术验证点 | 技术文档章节 |
|-------------|----------------|-------------|
| 开业+项目初始化深度用例 | 状态机 §1.2 + ONBOARDING/PROJECT-LINK | §一.2 + §四 |
| 三端协同用例 | 协同确认 L1-L4 + 五维同步 | §二.2/2.3 |
| 两入口轮换同步用例 | 两入口一致性规则 §1.3 | §一.3 + §五.2 |
| 三端团队冲突用例 | 冲突解决协议 §三 + 失败注入 §四 | §三 + §四 |

### 7.2 共同验收口径

**全链通过标准**：
1. 初始化状态机 7 态全部通过（UNINITIALIZED → READY）
2. 两入口轮换无状态漂移
3. L1-L4 校验全部通过
4. 周平面平移测试（W33→W34）三端可见
5. 失败注入场景按预期降级/重试

**阻塞缺陷定义**：
- 状态机无法推进
- 两入口状态不一致
- 装配覆盖本地修改未检测
- L1-L4 校验失败
- 周平面平移不可见

---

## 八、下一步行动

### 8.1 与小乔协同

1. 小乔完成测试用例矩阵后，我验证技术验证点覆盖率
2. E2E 测试执行时，我负责技术面诊断（git 链/状态机/通信协议）
3. 发现技术问题时，我提供修复方案并更新本设计

### 8.2 实施排期

- W34：完成技术设计文档（本文）
- W34：配合小乔执行 E2E 测试
- W35：根据测试结果迭代设计

---

> **变更记录**：
> - 2026-08-17：初始版本（小狄根据 CEO 指令创建）

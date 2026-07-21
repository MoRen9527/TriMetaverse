# CPO 裁决：TriModel 部署模型与多端接入方案

**裁决人**：小乔（CPO）  
**日期**：2026-07-20  
**任务树**：`cpo-trimodel-deployment`  
**节点**：`cpo-trimodel-1`  
**裁决类型**：APPROVE（附带条件）  

---

## 前置核查摘要

| 核查项 | 结果 |
|--------|------|
| 工作路径核查（0） | ✅ `trees/cpo-trimodel-deployment/` 在 TriMetaverse 中央 workflow 下，正确 |
| 归属路由阀门（0.5） | ✅ 产品范围/部署模型属于 CPO 裁决域 |
| CEO 输入 | ✅ 小贾简报完整阅读，CEO 倾向**明确**（独立 API 服务） |
| BusinessStrategy | ✅ 已核查 `business-strategy-state.md` + `business-strategy-evolution-log.md`：TriModel 为结构预留（P2 基础设施），但 TriLC 已升级为本地主入口，本次裁决不触碰总商业模式 |
| PROJECT / REQUIREMENTS / STATE | ✅ 已核查，均为发布侧摘要，无额外约束 |
| TriModel product-state | ✅ 已核查：14/14 tests，npm library 完整，三层密钥模型已标准化 |
| TriLC product-state + 代码 | ✅ 已核查：`/v1/models` 端点已有，先调 trimodel 后 fallback 硬编码列表 |
| 架构文档 §4 L71 | ✅ 确认 TriModel 当前标注为"待初始化/待接入"，需更新消费者列表 |

---

## Q1: TriModel 部署模型 — APPROVE（方案 A：独立 API 服务）

### 裁决：**方案 A（独立 API 服务）**，分两阶段落地。

### 理由

1. **CEO 意图明确**："TriModel 单独部署到服务器，PC/移动/元宇宙端通过 API 读取配置"——该方向符合经营实验阶段从 npm library 到产品化部署的合理演变。

2. **当前 npm library 模式的硬伤**：
   - Key 靠 `.env` 文件，不是产品级规范动作（CEO 已明确指出）
   - TriCade 安装后 TriModel 不在打包中，终端用户无模型可用——这是产品体验 bug，不是技术取舍
   - 每端各自 import 编译，Key 散布在消费端环境变量中，违背 TriModel 三层密钥模型"Key 池自管"的设计原则

3. **架构一致性**：独立 API 服务使 TriModel 从"被 import 的 npm 包"进化为"被调用的服务"，与 TriMC（云端实体）、TriStaciss（API 调用平台）形成统一的"服务层"架构语言，而非在服务层中夹一个 library 模式的异类。

4. **关键约束条件**：独立 API 服务上线前，**npm library 模式必须保留作为本地 dev 模式和 fallback**。理由：
   - TriLC 本地域模式下不能强依赖外部服务可用性
   - 单元测试和本地开发仍需 library 模式零部署体验
   - 过渡期需 library + API 双轨共存，API 就绪后再逐步削减 library 的消费面

### 两阶段落地计划

| 阶段 | 形态 | 适用场景 | 时间窗口 |
|------|------|----------|----------|
| **Phase 1（当前→API 就绪）** | npm library（主）+ API 服务（并行建设） | library 给 TriLC 本地模式 + dev/test；API 服务建设期 | 即刻起，至 API 服务通过 integration test |
| **Phase 2（API 就绪后）** | API 服务（主）+ npm library（本地 dev/fallback 保留） | 所有产品端（TriPilot/TriCade/TriMobile/TriAvatar）→ API 服务；dev 和 TriLC 本地模式可走 library | API 服务上线 + 1 sprint 切换 |

### 否决方案 B 的原因

方案 B（npm library 每端编译，纯现状）违背 CEO 意图，无法解决 TriCade 不打包 TriModel 的产品 bug，Key 散布问题无解。

### 不选方案 C（混合）的原因

方案 C（library + admin API）的"admin API"语义模糊，容易造成两种形态边界不清。我们的策略是 Phase 1 = 混合（建设阶段的事实），Phase 2 = API 主 + library 辅（产品化目标），比永久"混合"更清晰。

---

## Q2: TriLC 消费者定位 — APPROVE

### 裁决：TriLC **确认作为 TriModel 消费者**，TriPilot → TriLC `/v1/models` → TriModel 为**模型发现统一路径**。架构文档 §4 L71 消费者列表需补入 TriLC。

### 理由

1. **代码事实支持**：TriLC 已通过 `import { createModelClient } from 'trimodel'` 调用 `_modelClient.listModels()`，并通过 `/v1/models`（Anthropic 格式）和 `/models`（OpenAI 格式）对外暴露。这个链路在代码层面已存在，本次裁决是对既定架构的产品确认。

2. **架构合理性**：
   - TriLC 是本地人机协作主入口（BusinessStrategy 2026-07-17：`TriLC 升级为本地人机协作主入口`），模型发现走 TriLC 符合 TriPilot"默认直连 TriLC"的顶层设计
   - TriLC 已有 1 分钟缓存（`MODEL_CACHE_TTL_MS = 60_000`），减少对 TriModel 的重复调用
   - fallback 机制完整：TriModel 不可用时，TriLC 回退到硬编码模型列表，不会阻断 TriPilot 启动

3. **对 Q1 的影响**：Q1 裁定 TriModel 独立 API 服务后，TriLC 的 `getAvailableModels()` 应从 import library 改为 HTTP 调用 TriModel API。Phase 1 过渡期保留 library 调用作为 API 不可用时的 fallback。

### 需更新内容

| 文件 | 更新项 |
|------|--------|
| `docs/三元宇宙架构与模块说明.md` §4 L71 | TriModel 消费者从"TriMC 与 TriCode"扩展为"TriMC、TriLC 与 TriCode" |
| `TriModel/docs/registry/product-state.md` Cross-Module Dependencies | 加入 TriLC 作为消费者 |
| `TriLC/docs/registry/product-state.md` Cross-Module Dependencies | 加入 TriModel 作为依赖（已有 `/v1/models` 事实，只是未登记） |

---

## Q3: TriPilot 模型 UI 产品规格 — APPROVE（附带条件）

### 裁决：确认以下产品规格。

### 核心规格

```
┌────────────────────────────────────────────────┐
│  TriPilot Settings → Models 页面               │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ 模型列表（数据源：TriLC /v1/models）     │  │
│  │                                          │  │
│  │ ☑ deepseek-v4-pro   [DeepSeek V4 Pro]   │  │
│  │ ☑ deepseek-chat     [DeepSeek Chat]     │  │
│  │ ☐ deepseek-reasoner [DeepSeek Reasoner] │  │
│  │ ☑ deepseek-v4-flash [DeepSeek V4 Flash] │  │
│  │                                          │  │
│  │ 当前默认模型：DeepSeek V4 Pro    [▼]     │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Chat 界面"模型"下拉（每个会话独立）           │
│  ┌──────────────────────────────────────────┐  │
│  │ 模型：DeepSeek V4 Pro              [▼]   │  │
│  │   ├─ DeepSeek V4 Pro                    │  │
│  │   ├─ DeepSeek Chat                      │  │
│  │   ├─ DeepSeek V4 Flash                  │  │
│  │   └─ DeepSeek Reasoner                  │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### 详细规格

1. **Settings → Models 页**：
   - 显示完整模型列表（从 TriLC `/v1/models` 拉取，非硬编码）
   - 每个模型有启用/禁用开关（disabled 的模型不在 Chat 下拉中出现）
   - "默认模型"下拉选择器——选择新会话的默认模型
   - 模型列表刷新按钮（手动触发重拉 `/v1/models`）
   - 首次打开页面时自动加载；后续缓存 1 分钟（与 TriLC 缓存 TTL 一致）

2. **Chat 界面模型下拉**：
   - 仅显示 Settings 中启用的模型
   - 下拉位置：当前"模型"标签旁（extension.ts 中已有占位）
   - 切换模型仅影响当前会话，不改变全局默认模型
   - 下拉旁显示当前模型的小标签（如 "DeepSeek V4 Pro"）

3. **数据流**：
   - TriPilot → TriLC `GET /v1/models` → TriModel `listModels()` → 模型 registry
   - 模型列表在 TriLC 端缓存 1 分钟
   - TriPilot 端启动时拉一次，之后按需刷新

### 条件

- Q1 独立 API 部署上线前，Chat 模型选择**可先基于 library 模式下的 model list 实现**
- Q1 API 部署后，数据源改为 HTTP API，但 TriPilot 对接接口不变（仍走 TriLC `/v1/models`）
- 本规格不包含 model 参数传递到实际 chat 请求的完整链路（该部分由 CTO 在 Q3 技术方案中细化）

---

## Q4: Key 管理演进 — APPROVE

### 裁决：分两阶段演进，与 Q1 部署模型阶段对齐。

### 当前状态

TriModel Key 管理三层模型（2026-07-15 CPO APPROVE）：
- L1：`DEEPSEEK_API_KEY` 等直连 Key，存于 TriModel `.env`
- L2：`TRIMODEL_TRIMETAVERSE_API_KEY`，存于 TriModel `.env`
- L3：TriStaciss 内部真实 Key，对 TriModel 不可见

### Phase 1：独立 API 服务建设期（当前 → API 上线）

| 措施 | 说明 |
|------|------|
| **`.env` → 服务端环境变量** | TriModel API 服务部署时，Key 从 `.env` 文件迁移到服务端环境变量（如 systemd EnvironmentFile / Docker env / k8s Secret） |
| **`.env` 保留给 dev 模式** | TriModel package 内的 `.env` 保留，给本地 dev 和 TriLC library 模式使用；服务端不依赖 `.env` 文件 |
| **API 端点不暴露 Key** | TriModel API 对外只暴露模型列表和调用接口，Key 从不出现在 API 响应中 |
| **`.env.example` 作为契约文档** | 保持现状——声明"需要哪些 env var"，不含真实 Key |

### Phase 2：正式产品化（API 稳定运行后）

| 措施 | 说明 |
|------|------|
| **Secret Manager 接入** | 将 Key 从服务端环境变量迁移到 Secret Manager。具体选型（AWS Secrets Manager / HashiCorp Vault / 简单加密配置文件）由 CTO 在技术方案中评估并裁决 |
| **Key 轮换机制** | Secret Manager 支持 Key 轮换 + 审计日志 |
| **配额与限流** | **仅适用于 TriMetaverse 自有 provider**（L2：用户选择 provider=TriMetaverse 时，由 TriStaciss 后端统一管理配额和限流）。用户自配 Key（L1：DeepSeek 等直连 provider）由用户自己和模型提供商管理，TriMetaverse 无权也无责进行配额控制 |
| **`.env` 彻底退出产品路径** | dev 模式保留 `.env`，但产品化链路（多端用户）不涉及 `.env` |

### 分阶段理由

- Phase 1 的"服务端环境变量"是独立部署的最小可行 Key 管理方案，不引入额外基础设施，不阻塞上线节奏
- Phase 2 的 Secret Manager 需要 CTO 评估运维复杂度和选型、CFO 评估成本，不适合在本次裁决中定死具体方案
- 配额与限流：用户自配 Key 场景下 TriMetaverse 无权管理；仅 L2（TriMetaverse provider）由 TriStaciss 后端负责。TriModel 服务本身不做限流
- 两层演进路径与 Q1 的 Phase 1/Phase 2 对齐，保持一致节奏

---

## 总依赖检查

| 依赖 | 当前成熟度 | 阻塞风险 |
|------|-----------|---------|
| TriModel 代码（14/14 tests） | ✅ 可工作 | 无 |
| TriLC `/v1/models` 端点 | ✅ 已有，含 fallback | 无 |
| TriPilot Settings→Models UI（L2474） | ⚠️ 占位 | 需接线，但非部署阻塞 |
| TriPilot Chat 模型选择 | ❌ 未实现 | 需 CTO 评估工作量后排出 |
| TriModel 独立 API 化 | ❌ 未启动 | **本次裁决的核心 action** |
| Key → Secret Manager | ❌ 未启动 | Phase 2，不阻塞 Phase 1 |

---

## 风险与升级

| 风险 | 严重度 | 处置 |
|------|--------|------|
| TriModel API 服务开发周期超过 2 个 sprint，阻塞 TriCade 打包 | 中 | Phase 1 library fallback 提供缓冲带；API 未就绪前 TriLC 继续 library 模式 |
| Secret Manager 选型不当导致运维成本过高 | 低（Phase 2） | 由 CTO 在技术方案中评估并裁决；CPO 不强制选型 |
| TriPilot Chat 模型选择接线工作量超过预期 | 低 | 接线不阻塞 API 部署；可以先上 Settings→Models 页 |
| 跨模块边界：TriModel 消费者从"TriMC + TriCode"扩展为"TriMC + TriLC + TriCode"——需确认是否与 BusinessStrategy 的模块优先级冲突 | 低 | TriLC 已是第一轮核心模块；增加 TriModel 消费者身份不改变模块优先级 |

---

## 使用依据

| 依据 | 路径 |
|------|------|
| 升级简报 | `trees/cpo-trimodel-deployment/escalation-brief.md` |
| CEO 意图 | 简报 §1.2（独立 API 服务部署，Key 不应靠 .env） |
| 架构文档 | `docs/三元宇宙架构与模块说明.md` §4 L71 |
| BusinessStrategy 状态 | `docs/registry/business-strategy-state.md` |
| BusinessStrategy 演化日志 | `docs/registry/business-strategy-evolution-log.md`（2026-07-17 TriLC 升级） |
| TriModel 产品状态 | `../TriModel/docs/registry/product-state.md` |
| TriModel 代码 | `../TriModel/src/config.ts`, `../TriModel/src/client.ts`, `../TriModel/src/index.ts` |
| TriLC 产品状态 | `../TriLC/docs/registry/product-state.md` |
| TriLC 代码 | `../TriLC/src/server/app.ts`（`getAvailableModels()`, `/v1/models`, `/models`） |
| 中央产品状态 | `docs/registry/product-state.md`（CARRY-005 D4 多 provider 裁定） |

---

## 下一步

- **next_agent**: `ChiefTechnologyOfficer`（小狄）
- **action**: 制定 TriModel 部署技术方案 + 多端接入 API 契约 + TriPilot 模型 UI 接线方案
- **节点**: `cpo-trimodel-2`
- **本节点**: `cpo-trimodel-1` → **done**

---

# 附录A：配置平面架构修正裁决

**裁决人**：小乔（CPO）  
**日期**：2026-07-20  
**任务树**：`cpo-trimodel-deployment`  
**节点**：`cpo-trimodel-1b`  
**裁决类型**：APPROVE（修正原 Q1 裁决 + 新增 Q5-Q8 裁决）  
**触发**：CEO 架构修正（escalation-brief.md §附录A，2026-07-20 22:30）

---

## 前置核查摘要（增量）

除原裁决 §前置核查摘要外，新增核查：

| 核查项 | 结果 |
|--------|------|
| CEO 架构修正原文 | ✅ escalation-brief.md §附录A 完整阅读 |
| CTO 技术方案 | ✅ `technical-design.md` 基于旧代理模型设计，含 `/v1/chat/completions` + SSE streaming，需按本修正重做 |
| TriModel product-state（最新） | ✅ 三层密钥模型已标准化；`ModelClient.chat()` + `stream()` 是 library 内部能力，**不暴露为 HTTP 端点** |
| BusinessStrategy state | ✅ TriModel 为结构预留（P2 基础设施），不触碰模块优先级 |
| TriLC 架构定位 | ✅ 2026-07-17 升级为本地人机协作主入口；TriPilot 默认直连 TriLC |
| Simplest Verifiable Model | ✅ `TriMC → TriModel（路由）→ TriStaciss（计费）→ Provider` — 此处的"路由"在配置平面模型下应理解为"配置路由"（决定用哪个模型/Key），而非"流量路由"（代理转发） |

---

## A.1 原 Q1 裁决补充修正 — APPROVE（修正）

### 裁决

原 Q1 裁决（独立 API 服务）**维持 APPROVE**，但补充关键架构修正：

**TriModel API 服务 = 配置分发服务，不代理业务流量。**

### 修正详情

| 维度 | 原 Q1 裁决（CTO 理解） | 修正后（CEO 架构修正 + CPO 裁决） |
|------|----------------------|----------------------------------|
| TriModel 角色 | API 代理网关 | **纯配置分发层** |
| 业务流量路径 | 端 → TriModel → Provider | **端 → Provider（直连）** |
| API 端点 | `/v1/models` + `/v1/chat/completions` + SSE streaming | **仅保留配置类端点**：`/health`、`/v1/models`、**新增 Key 分发端点** |
| TriModel 离线影响 | 全部不可用 | **各端仍正常工作**（Key 已缓存） |
| Key 传输 | 不传输（TriModel 自己持有并使用） | **启动时拉取 + 定时刷新**；Key 离开 TriModel 后本地加密存储 |

### 对 CTO 技术方案的影响

CTO `technical-design.md` 中以下部分需**废弃或重新设计**：

| CTO 方案章节 | 处置 | 原因 |
|-------------|------|------|
| §1.3 `POST /v1/chat/completions` | **删除** | 配置平面不代理业务流量 |
| §1.3 SSE streaming 端点 | **删除** | 同上；streaming 由各端直连 Provider |
| §1.3 `src/api/chat.ts` | **删除** | 不存在 chat 代理端点 |
| §1.1 Serverless 不可行理由 "有状态 Key pool + 长连接 SSE" | **作废** | 无 SSE 长连接；配置分发是无状态短连接 |
| §1.2 `src/server.ts` + `src/api/` | **重新设计** | 只保留 health + models，新增 Key 分发 |
| §2 TriLC 消费端改造 | **保留但简化** | TriLC 仍通过 API 拉取模型列表，但不再做 chat 代理路由 |
| §1.4 环境变量 | **保留 + 扩展** | 新增 Key 池相关配置 |

---

## A.2 Key 分发策略 — APPROVE（启动时全量拉取 + 定时刷新）

### 裁决：**方案 A（启动时全量拉取 + 定时刷新）**

```
┌──────────────────────────────────────────────────┐
│  四端启动流程                                      │
│                                                   │
│  1. 启动 → 认证 → GET /v1/config/keys             │
│  2. 收到完整 Key 列表 → 本地加密存储              │
│  3. 后台定时器：每 15 分钟 GET /v1/config/keys    │
│  4. Key 变更时热更新，无需重启                     │
└──────────────────────────────────────────────────┘
```

### 理由

1. **Key 体量极小**：当前 L1 直连 Key（DeepSeek等）最多 3-5 个字符串，L2 TriMetaverse Key 1 个。全量拉取的消息体 < 1KB，无带宽顾虑。
2. **预加载消除延迟**：用户首次发起 chat 时 Key 已就绪，零等待。按需拉取会在首次使用引入 200-500ms 延迟。
3. **定时刷新支持热轮换**：Key 可做到 15 分钟内全网生效，无需用户手动重启或重新登录。
4. **15 分钟刷新周期**：在 Key 轮换及时性和 TriModel 负载之间取得平衡。配置分发层是低 QPS 服务（每端每 15 分钟 1 次），无负载顾虑。

### 否决按需拉取的理由

按需拉取（方案 B）：每次新会话首次调用时拉取 → 增加首次响应延迟；且 Key 过期时需等待网络往返，体验更差。

---

## A.3 缓存与离线容错 — APPROVE

### 裁决

```
┌──────────────────────────────────────────────────┐
│  本地 Key 存储策略                                 │
│                                                   │
│  • 存储位置：本地持久化存储                        │
│    - PC 端：操作系统 keychain 或加密本地文件       │
│    - 移动端：Keychain (iOS) / EncryptedSharedPref  │
│    - CLI：~/.trilc/keys.json (600 权限)            │
│  • 缓存 TTL：24 小时                               │
│  • 刷新周期：15 分钟                               │
│  • 刷新失败：继续使用缓存，静默降级                │
│  • 无缓存 + TriModel 不可达：chat 功能不可用       │
│    但非模型功能（本地操作、文件管理）正常运行       │
└──────────────────────────────────────────────────┘
```

### 容错矩阵

| 场景 | 行为 | 用户感知 |
|------|------|----------|
| 启动时 TriModel 可达 | 拉取全量 Key → 缓存 → 正常 | 无感知 |
| 启动时 TriModel 不可达，有缓存 | 使用缓存 Key → 标记 stale | 无感知（静默）；后台持续重试 |
| 启动时 TriModel 不可达，无缓存 | 阻止 chat 功能；非模型功能正常 | "模型服务暂不可用，请检查网络后重试" |
| 定时刷新失败 | 继续使用缓存 Key → 延长至下次刷新 | 无感知 |
| 缓存 Key 已过期（>24h）+ TriModel 不可达 | 同"无缓存 + 不可达" | 同上 |

### 理由

1. **24 小时缓存 TTL** 远长于 15 分钟刷新周期——正常情况下缓存永远不会过期，只在 TriModel 长时间宕机后才触发。
2. **持久化存储而非内存**：Key 不应每次启动重新拉取（冷启动必须有网络）——与 CEO "启动时拉取" 看似矛盾，但我们的实现是"首次启动拉取 → 持久化 → 后续启动优先读缓存 → 后台异步刷新"。这是"启动时拉取"的务实实现。
3. **非模型功能可用**：TriModel 离线时，TriPilot 仍可做本地文件编辑、搜索、命令执行等。这是配置平面优于代理平面的核心 UX 优势。

---

## A.4 并发 Key 冲突 — APPROVE（Phase 1 理论风险，Phase 2 Key 池缓解）

### 裁决

**确认为真实风险，但当前阶段不阻塞。分两阶段处置。**

### 风险分析

| Provider | 典型免费/低价 Key 限制 | 四端并发风险 |
|----------|----------------------|-------------|
| DeepSeek | 500 RPM / 1M TPM（个人 Key） | **中**：PC+移动同时高频率使用可触发 |
| OpenAI | 500 RPM / 200K TPM（Tier 1） | **中**：同上 |
| Claude | 50 RPM / 40K TPM（Usage Tier 1） | **高**：Claude 限制最严格，双端并发即可触发 |

**但当前四端并发高频率使用的概率低**：TriAvatar 当前为静态头像（不频繁调用模型），TriMobile 尚未开发，CLI 使用频率远低于 TriPilot。Phase 1 实际并发场景为 1-2 端。

### Phase 1 处置（当前）

| 措施 | 说明 |
|------|------|
| **单 Key 模式** | TriModel 配置层分发同一个 Key 给各端 |
| **预埋 Key 池 schema** | API 设计预留多 Key 返回结构，不阻塞后续扩展 |
| **不做中央限流** | 配置平面不应做业务流量控制；限流是 Provider 侧的职责 |
| **端侧友好降级** | 收到 429（Rate Limit）时自动退避 + 用户友好提示 |

### Phase 2 升级（API 稳定后，约 2-3 sprint）

| 措施 | 说明 |
|------|------|
| **Key 池机制** | TriModel 配置层支持每个 provider 配置多个 Key（`DEEPSEEK_API_KEY_1`, `_2`… 或 JSON array） |
| **分配策略** | 客户端启动时从池中轮询/随机分配；同一客户端在同一次会话内固定使用同一 Key |
| **池耗尽告警** | Key 池所有 Key 被分配完 → TriModel 返回 429 → 客户端退避重试 |
| **Provider 侧监控** | 各端上报 429 事件到 TriModel → 用于评估 Key 池扩容需求 |

### 理由

- Phase 1 四端实际并发概率低，单 Key 够用
- Key 池需额外运维（购买/管理多个 Key），增加月度成本——需 CFO 评估（CFO 尚未上岗，不应阻塞当前交付）
- API 设计预埋 Key 池结构确保 Phase 2 平滑升级

---

## A.5 配置平面 API 契约（新增端点）

### 裁决：TriModel API 应包含以下端点（仅配置类）

```
TriModel API（配置平面）

GET  /health                  → 服务健康状态 + provider 可用性
GET  /v1/models               → 模型列表（含 display_name、capabilities）
GET  /v1/config/keys          → ★ 新增：Key 分发端点（认证后返回）
POST /v1/config/keys/refresh  → ★ 新增：手动强制刷新（admin/运维用）
```

### `GET /v1/config/keys` 设计

```
Request:
  需认证（见 §A.6）

Response 200:
{
  "object": "config.keys",
  "keys": {
    "deepseek": {
      "api_key": "sk-xxxx",
      "base_url": "https://api.deepseek.com/v1"
    },
    "openai": {
      "api_key": "sk-yyyy"
    },
    "trimetaverse": {
      "api_key": "tmv-sk-xxxx",
      "base_url": "http://127.0.0.1:8000/v1"
    }
  },
  "default_model": "deepseek-v4-pro",
  "refresh_interval_s": 900,
  "expires_at": "2026-07-21T12:00:00Z"
}
```

- `keys` 字段按 provider 分组，便于各端按需提取
- `default_model` 告知各端默认使用哪个模型
- `refresh_interval_s` 允许 TriModel 服务端动态调整刷新周期
- `expires_at` 告知客户端这些 Key 的有效截止时间

### 端点安全（Phase 1 最小可行）

| 措施 | 说明 |
|------|------|
| **服务端绑定 127.0.0.1** | Phase 1 TriModel 仅监听本地回环地址（`127.0.0.1:3333`），不暴露到公网 |
| **简单 API Token** | `TRIMODEL_API_TOKEN` 环境变量，客户端在 `Authorization: Bearer <token>` 中传递 |
| **TLS 非强制** | Phase 1 本地回环不强制 TLS；Phase 2 公网部署时强制 |

---

## A.6 总依赖检查（增量）

| 依赖 | 当前成熟度 | 本次修正影响 |
|------|-----------|------------|
| TriModel library `ModelClient` | ✅ 14/14 tests | 保留为本地 dev + TriLC fallback（不变） |
| TriModel HTTP server（CTO 方案） | ⚠️ 基于代理模型 | **需重做**：删除 chat 代理端点，新增 Key 分发端点 |
| TriLC `getAvailableModels()` | ✅ 已有 HTTP + library 双轨 | 保留：API 拉模型列表逻辑不变 |
| TriLC 作为 Key 分发消费者 | ❌ 未实现 | **新增**：TriLC 需新增 Key 拉取 + 本地缓存逻辑 |
| TriPilot Settings→Models UI | ⚠️ 占位 | 不变 |
| 四端 Key 本地缓存 | ❌ 未实现 | **新增**：需统一 Key 缓存 strategy |
| Key 池机制 | ❌ 未设计 | Phase 2，不阻塞 Phase 1 |

---

## A.7 风险与升级（增量）

| 风险 | 严重度 | 处置 |
|------|--------|------|
| CTO 方案 §1.3 chat 代理端点已完整设计，删除 + 重做增加返工 | 中 | 不可避免；代理模型是方向性错误，越早修正代价越小 |
| 四端 Key 缓存实现不一致导致安全漏洞（Key 明文泄露） | 高 | CTO 需制定统一 Key 存储规范（keychain / encrypted file）；CPO 要求 CTO 在技术方案中单独成章 |
| API Token 认证过于简单，Phase 2 需重新设计 | 低 | Phase 1 只需本地回环 + 简单 Bearer token；Phase 2 公网部署时由 CTO 重新评估 |
| Key 池需额外 API Key 购买成本 | 低（Phase 2） | 待 CFO 上岗后评估；当前 Phase 1 单 Key 模式不产生新成本 |
| `Simplest Verifiable Model` 中 TriModel 标注为"路由"可能产生歧义 | 低 | 建议后续更新为"配置路由"以区分"流量路由"；不在本次裁决中修改（跨 BusinessStrategy 域） |

---

## A.8 使用依据（增量）

| 依据 | 路径 |
|------|------|
| CEO 架构修正 | `escalation-brief.md` §附录A |
| 原 Q1 裁决 | `ruling.md` §Q1 |
| CTO 技术方案（旧代理模型） | `technical-design.md`（需修订） |
| TriModel 三层密钥模型 | `../TriModel/docs/registry/product-state.md` §API Key Architecture |
| BusinessStrategy 模块优先级 | `docs/registry/business-strategy-state.md`（TriModel = 结构预留 P2） |
| TriLC 架构定位 | `docs/registry/business-strategy-evolution-log.md`（2026-07-17） |
| Simplest Verifiable Model | `TriCompany/docs/registry/product-state.md` §Simplest Verifiable Model |

---

## A.9 下一步

- **next_agent**: `ChiefTechnologyOfficer`（小狄）
- **action**: 基于配置平面架构修正，重新制定 TriModel 部署技术方案：
  1. 删除 `POST /v1/chat/completions` + SSE streaming 代理端点
  2. 新增 `GET /v1/config/keys` Key 分发端点（含认证）
  3. 制定四端统一的 Key 本地缓存 + 安全存储规范
  4. 更新 TriLC `getAvailableModels()` 的 Key 获取路径（API 拉取 → 本地缓存 → Provider 直连）
  5. TriPilot 模型 UI 接线方案（不变，仍走 TriLC `/v1/models`）
  6. Phase 1 不实现 Key 池，但 API schema 预留多 Key 结构
- **节点**: `cpo-trimodel-2b`
- **本节点**: `cpo-trimodel-1b` → **done**

# CPO 升级：TriModel 部署模型与多端接入方案

**发起人**：小贾（CEO 总助）  
**升级类型**：`ESCALATE` — 产品设计决策  
**日期**：2026-07-20  
**所属树**：`cpo-trimodel-deployment`  
**触发场景**：TriCade 安装后发现模型显示"claude4 sonnet"——TriModel 未集成到 TriCade，模型配置链路不通。CEO 提出独立服务部署方案。

---

## 1. 问题

### 1.1 当前状态

| 层 | 现状 | 问题 |
|----|------|------|
| TriModel | 可工作的 TypeScript npm library（14/14 tests） | 作为 npm 包被 import，未独立部署；Key 靠 `.env` 文件 |
| TriLC | `import { createModelClient } from 'trimodel'` | TriModel 不在 TriCade 打包中，fallback 到硬编码模型列表 |
| TriPilot | Settings→Models UI 有占位（L2474），Chat 模型选择有空位 | 数据源未切换；仍走 `vscode.lm` Copilot 模型 |
| TriCade | 用户安装后无 DeepSeek 模型可用 | 需要环境变量 `DEEPSEEK_API_KEY`——非产品规范行为 |

### 1.2 CEO 核心意图

> "TriModel 单独部署到服务器，PC/移动/元宇宙端通过 API 读取配置。TriPilot→TriLC→TriModel 读模型配置，在 TriPilot Settings→Models 显示，可在 Chat 界面模型处选择。设环境变量不是正式产品的规范动作。"

---

## 2. 真源核查

### 2.1 架构文档

| 文件 | 关键行 | 内容 | 与 CEO 意图的差距 |
|------|--------|------|-----------------|
| `三元宇宙架构与模块说明.md` §4 | L71 | TriModel = "Provider/Model 统一配置层，为 TriMC 与 TriCode 提供模型接入点。当前待初始化 / 待接入" | ① 代码已存在但文档未更新 ② 消费者缺 TriLC ③ 无部署模型定义 |
| `TriModel/docs/registry/product-state.md` | L45-70 | 三层密钥模型：L1 直连 Key / L2 TriStaciss / L3 TriStaciss 内部。Key 自管于 TriModel `.env` | 设计原则正确（独立模块自管 Key），但仅适合 dev 阶段 |

### 2.2 BusinessStrategy

| 文件 | 关键点 |
|------|--------|
| `business-strategy-evolution-log.md` | 2026-07-17：TriLC 升级为主入口，"人机协作场景由 TriLC + TriPilot + TriCode + vscodium 承担" |
| `business-strategy-state.md` | TriModel 在第一轮核心模块清单中（L36），但 maturity 标记为 P2（基础设施） |

### 2.3 当前代码事实

- TriModel: `src/index.ts` 导出 `createModelClient()`，`src/providers/deepseek.ts` 完整实现
- TriLC: `src/server/app.ts` `getAvailableModels()` → 先调 `trimodel`，失败则用硬编码列表
- TriPilot: `extension.ts` L2395 `trilcClient.listModels()` 读取模型，L2474 `<div id="modelList">` 渲染 UI
- 模型列表在 Settings 页面显示，但 Chat 界面模型选择下拉未接线

---

## 3. 建议方案

### 3.1 部署模型：独立 API 服务（CEO 倾向）

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────┐
│TriPilot │   │TriMobile│   │TriAvatar│   │CLI       │
│(PC IDE) │   │(移动端) │   │(Web 3D) │   │(终端)    │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬─────┘
     │             │             │             │
     ▼             ▼             ▼             │
┌─────────┐   ┌──────────────────────┐         │
│ TriLC   │   │  TriMC (云端)        │         │
│ (本地)  │   │  GET /v1/models ◄────┼─────────┘
└────┬────┘   └──────────┬───────────┘
     │                   │
     │   GET /v1/models   │
     └─────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  TriModel Service   │  ← 独立部署
    │  GET /v1/models     │
    │  POST /v1/chat      │
    │  Key: Secret Manager │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  DeepSeek / Claude  │
    │  / OpenAI API       │
    └─────────────────────┘
```

### 3.2 与当前 npm library 模式的关系

| 模式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **npm library**（当前） | 本地 dev、单元测试 | 零部署，TriLC import 即可 | Key 靠 `.env`，不适合多端 |
| **独立 API 服务**（建议） | 产品化、多端共享 | 统一管理 Key/配额/审计，多端零配置 | 需运维基础设施 |
| **混合** | 过渡阶段 | library 模式保留给本地 dev；API 服务给生产 | 双轨维护成本 |

---

## 4. 需 CPO 裁决的问题

### Q1: TriModel 部署模型

TriModel 应以何种形态存在？

| 方案 | 描述 |
|------|------|
| **A: 独立 API 服务**（CEO 倾向） | 单独部署到服务器，PC/移动/Web 端通过 HTTP API 读取模型配置和调用 |
| **B: npm library 每端编译**（现状） | 作为 npm 包安装到各模块，每个模块自己管理 TriModel 实例 |
| **C: 混合（library + admin API）** | library 给本地 dev/CLI 用；admin API 给多端共享配置和 Key 管理 |

### Q2: TriLC 是否应作为 TriModel 消费者对外暴露模型？

TriLC 已有 `/v1/models` 端点。TriPilot → TriLC `/v1/models` → TriModel。是否确认此链路为模型发现的统一路径？

### Q3: TriPilot Chat 界面模型选择功能的产品规格？

- Settings→Models 页：显示模型列表 + 开关启用
- Chat 界面"模型"下拉：选择当前会话使用的模型
- 模型列表数据源：TriLC `/v1/models`（后端驱动，非硬编码）

确认此产品规格？

### Q4: Key 管理在独立服务模式下如何演进？

当前 TriModel `.env` 自管 Key（`DEEPSEEK_API_KEY`）。独立部署后，Key 应从环境变量迁移到 Secret Manager（如 AWS Secrets Manager / HashiCorp Vault / 简单的 encrypted config）。Key 管理策略应如何分阶段落地？

---

## 5. 上游依赖

| 依赖 | 状态 |
|------|------|
| TriModel 代码（14/14 tests） | ✅ 已就绪 |
| TriLC `/v1/models` 端点 | ✅ 已有 |
| TriPilot Settings→Models UI | ⚠️ 占位，需接线 |
| TriPilot Chat 模型选择 | ❌ 未实现 |
| TriModel 独立部署基础设施 | ❌ 未启动 |

---

## 6. 期望输出

请 CPO 对 Q1-Q4 做出书面裁决。裁决后路由 CTO 制定 TriModel 部署技术方案 + 多端接入 API 契约 + TriPilot 模型 UI 接线方案。

**裁决写入**：`trees/cpo-trimodel-deployment/ruling.md`

---

## 附录 A：CEO 架构修正（2026-07-20 22:30）

### 修正要点

**TriModel 应只存在配置平面，不应存在业务平面。**

原 Q1 裁决"独立 API 服务"语义有歧义——容易理解为 TriModel 作为代理网关，所有调用经过它。CEO 澄清：

- 配置平面（TriModel 唯一职责）：存储模型列表 + API Key，四端启动时/定时拉取 Key 配置，Key 本地缓存（TriModel 离线时各端仍可工作）
- 业务平面（四端直接调用）：TriPilot/TriMobile/TriAvatar/CLI 拿到 Key 后直调 DeepSeek/Claude/OpenAI，不经过 TriModel 代理

### 与原方案的差异

| 维度 | 原方案 | CEO 修正 |
|------|--------|---------|
| TriModel 角色 | API 代理网关 | 纯配置分发层 |
| 模型调用路径 | 端 -> TriModel -> Provider | 端 -> Provider（直连） |
| TriModel 离线 | 全部不可用 | 各端仍正常工作（Key 已缓存） |
| Key 传输 | 实时请求 | 启动时拉取 + 定时刷新 |

### 新风险：并发 Key 冲突

四端如果同时用同一个 Key 调模型，可能触发 Provider 限流甚至封号。

需 CPO + CTO 联合评估：
1. 这是配置平面模型下的真实风险还是理论风险？
2. 缓解方案：Key 池轮换？本地调用频率限制？Provider 侧监控？
3. 是否需要在 TriModel 配置层加入使用策略？


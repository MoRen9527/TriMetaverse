# TriModel 配置平面改造 — 测试策略

**作者**：小柯（TestEngineer）
**日期**：2026-07-21
**任务树**：`cpo-trimodel-deployment`
**节点**：`cpo-trimodel-3`（测试策略）
**依赖设计**：`technical-design.md`（CTO 小狄，cpo-trimodel-2b，修正版 §6–§8）
**依赖裁决**：`ruling.md`（CPO 小乔，cpo-trimodel-1 + cpo-trimodel-1b 附录A）

---

## 前置核查摘要

| 核查项 | 结果 |
|--------|------|
| 工作路径核查（0） | ✅ 产出写入 `trees/cpo-trimodel-deployment/test-strategy.md`，与 design/ruling/escalation 同级，正确 |
| 归属路由阀门（0.5） | ✅ 测试策略属于 TestEngineer + CTO 联合域，不越界到经营记录或产品裁决 |
| CTO 最新输入 | ✅ `technical-design.md` cpo-trimodel-2b（修正版），完整阅读 §1–§9 + Step 1–4 验收门禁 |
| CPO 裁决 | ✅ `ruling.md` cpo-trimodel-1 + cpo-trimodel-1b §附录A，配置平面架构修正全部 APPROVE |
| BusinessStrategy | ✅ `business-strategy-state.md`：TriModel P2 基础设施，TriLC 本地主入口，本次不触碰优先级 |
| 工程真源 | ✅ `docs/registry/code-state.md` — 发布侧摘要，无额外约束 |
| TriModel 代码 | ✅ `package.json` 14/14 tests 当前全部通过；`src/` 目录无 `server.ts`/`api/`（待 Step 1 创建）；library 模式 `ModelClient` + `listModels()` + `chat()` + `stream()` 完整 |
| TriLC 代码 | ✅ `src/server/app.ts`：`/v1/models` + `/models` 端点已有，同步 `getAvailableModels()`；`src/config/` 仅含 `env.ts`，无 `key-cache.ts`（待 Step 2b 创建） |
| TriPilot 代码 | ✅ Settings→Models UI 已有动态渲染 + 开关 + 搜索 + 刷新（`settings.js` L195–247）；Chat 模型选择 `buildTrilcDirectLmModels()` 已有过滤 + 下拉；**默认模型下拉缺失**（待 Step 3 新增） |

---

## 1. 测试范围总览

### 1.1 被测系统架构（配置平面修正后）

```
┌──────────┐  ①GET /v1/config/keys   ┌──────────────┐
│  TriLC   │◄───────────────────────│  TriModel     │
│  (本地)   │  Authorization: Bearer   │  (配置平面)    │
│          │────────────────────────►│              │
│ Key缓存   │  ②加密写盘 (~/.trilc/)    │  Key 来自     │
│ 24h TTL  │                         │  环境变量     │
└────┬─────┘                         └──────────────┘
     │
     │ ③端直连 Provider（不经 TriModel）
     ▼
┌──────────┐
│ Provider │  DeepSeek / OpenAI / Claude / TriMetaverse
│ (外部)    │
└──────────┘

★ TriModel 不在业务流量路径上
```

### 1.2 测试层级矩阵

| 层级 | 覆盖范围 | 测试类型 | 阶段 |
|------|---------|---------|------|
| L1 — 单元测试 | TriModel API server 各 handler（health/models/keys/refresh） | 自动化 | Phase A + B |
| L2 — 集成测试 | TriLC ↔ TriModel API 全链路（模型列表 + Key 拉取） | 自动化 | Phase A + B |
| L3 — 系统测试 | TriPilot → TriLC → TriModel → Provider 端到端 | 手动/半自动 | Phase B |
| L4 — 安全测试 | Key 不泄露到日志、存储加密、认证拦截 | 手动 + 自动化 | Phase A + B |
| L5 — 容错测试 | TriModel 离线、缓存过期、网络中断 | 自动化 + 手动 | Phase B |

### 1.3 被测模块与文件映射

| Step | 模块 | 新增/修改文件 | 测试文件落点 |
|------|------|-------------|-------------|
| Step 1 | TriModel | `src/server.ts`、`src/api/health.ts`、`src/api/models.ts`、`src/api/keys.ts`、`src/api/routes.ts` | `TriModel/test/api/` ★新增 |
| Step 2 | TriLC | `src/server/app.ts`（改 `getAvailableModels` async）、`src/config/env.ts`（加 env var） | `TriLC/test/server/` ★新增 |
| Step 2b | TriLC | `src/config/key-cache.ts` ★新建、`src/server/app.ts`（chat handler 改直连 Provider） | `TriLC/test/config/` ★新增 |
| Step 3 | TriPilot | `media/settings.js`（默认模型下拉）、`src/extension.ts`（globalState 存储） | 手动 UI 验证 + `TriPilot/tests/` |
| Step 4 | TriPilot | 现有代码验证（`buildTrilcDirectLmModels` + `lmModels` 下拉） | 手动 UI 验证 |

---

## 2. L1 — TriModel API 服务端单元测试

### 2.1 测试文件：`TriModel/test/api/server.test.ts` ★新增

#### 2.1.1 `GET /health`

| ID | 用例 | 输入 | 期望输出 | 对应验收门禁 |
|----|------|------|---------|------------|
| TM-H-001 | 正常启动返回 200 | 配置完整（`DEEPSEEK_API_KEY` 已设） | `200 { ok: true, service: "trimodel", version: "0.1.0", providers: { deepseek: true, trimetaverse: false } }` | ✅ Step 1 第 1 项 |
| TM-H-002 | 未配置 Key 时 provider 状态为 false | `DEEPSEEK_API_KEY` 未设 | `200 { providers: { deepseek: false } }` | ✅ Step 1 第 7 项 |
| TM-H-003 | 响应不含任何 Key 信息 | 任意配置 | body 中不出现 `api_key`、`sk-`、`Bearer` | 安全基线 |
| TM-H-004 | 响应格式一致（JSON + Content-Type） | 任意配置 | `Content-Type: application/json` | 契约一致性 |

#### 2.1.2 `GET /v1/models`

| ID | 用例 | 输入 | 期望输出 | 对应验收门禁 |
|----|------|------|---------|------------|
| TM-M-001 | 正常返回模型列表 | 配置完整 | `200 { object: "list", data: [...] }` 含 4 个 DeepSeek 模型 | ✅ Step 1 第 2 项 |
| TM-M-002 | 每个模型含必要字段 | — | 每个 `data[i]` 含 `id`/`object`/`display_name`/`provider`/`capabilities`/`created` | 契约完整性 |
| TM-M-003 | capabilities 推断正确 | `deepseek-v4-pro` → `reasoning: true`；`deepseek-reasoner` → `reasoning: true`；`deepseek-v4-flash` → 标记 fast | `capabilities.chat` 均为 `true` | 模型元数据准确性 |
| TM-M-004 | 响应格式向后兼容 OpenAI `/v1/models` | — | `object: "list"` + `data: [{ id, object: "model", created }]` | OpenAI 兼容性 |
| TM-M-005 | 无认证拦截（公开端点） | 不带 `Authorization` header | `200`（非 401） | 公开端点 |
| TM-M-006 | 未配置 Key 时仍可返回模型列表 | `DEEPSEEK_API_KEY` 未设 | `200` + 模型列表正常（`listModels()` 从代码推断，不依赖 Key） | 容错 |
| TM-M-007 | `display_name` 非空且非纯 ID | — | 每个模型的 `display_name` 不等于 `id`，是人类可读名称 | UX 质量 |

#### 2.1.3 `GET /v1/config/keys`

| ID | 用例 | 输入 | 期望输出 | 对应验收门禁 |
|----|------|------|---------|------------|
| TM-K-001 | 认证通过返回 Key 列表 | `Authorization: Bearer <TRIMODEL_API_TOKEN>` | `200 { object: "config.keys", keys: { deepseek: { api_key, base_url } }, default_model, refresh_interval_s, expires_at }` | ✅ Step 1 第 3 项 |
| TM-K-002 | 无 Authorization header → 401 | 不带 header | `401 { error: "unauthorized" }` | ✅ Step 1 第 4 项 |
| TM-K-003 | 错误 Token → 401 | `Authorization: Bearer wrong-token` | `401 { error: "unauthorized" }` | 认证安全性 |
| TM-K-004 | Token 为空字符串 → 401 | `Authorization: Bearer ` | `401` | 边界条件 |
| TM-K-005 | `keys` 按 provider 分组 | 多个 provider Key 已配 | `keys.deepseek.api_key`、`keys.openai.api_key` 等独立字段 | 契约格式 |
| TM-K-006 | 响应含 `default_model` | — | `default_model` 非空字符串，与 `TRIMODEL_DEFAULT_MODEL` 一致 | 配置一致性 |
| TM-K-007 | 响应含 `refresh_interval_s` | — | `refresh_interval_s` = `TRIMODEL_KEY_REFRESH_INTERVAL_S` 或默认 900 | 动态刷新周期 |
| TM-K-008 | 响应含 `expires_at` | — | ISO 8601 格式，≈ 当前时间 + 24h | TTL 协商 |
| TM-K-009 | 不返回 L3 Key（TriStaciss 内部 Key） | `TRIMODEL_TRIMETAVERSE_API_KEY` 存在 | `keys` 中不含 L3 provider 的 Key（L3 对 TriModel 不可见） | 三层密钥模型 |
| TM-K-010 | 未配置 `TRIMODEL_API_TOKEN` 时所有 `/v1/config/*` 返回 401 | 服务端 `TRIMODEL_API_TOKEN` 为空 | `401`（保护模式——不配置则不暴露 Key） | ✅ 安全门禁 |

#### 2.1.4 `POST /v1/config/keys/refresh`

| ID | 用例 | 输入 | 期望输出 | 对应验收门禁 |
|----|------|------|---------|------------|
| TM-R-001 | admin 强制刷新成功 | `Authorization: Bearer <TRIMODEL_API_TOKEN>` | `200 { ok: true, refreshed_at: "<ISO 8601>", message: "..." }` | ✅ Step 1 第 5 项 |
| TM-R-002 | 无认证 → 401 | 不带 header | `401` | 认证安全性 |
| TM-R-003 | 刷新后 Key 缓存实际更新 | 修改环境变量 → `POST /refresh` → `GET /v1/config/keys` | 新值生效 | Key 热重载 |
| TM-R-004 | 仅接受 POST 方法 | `GET /v1/config/keys/refresh` | `405 Method Not Allowed` | HTTP 方法约束 |

#### 2.1.5 废弃端点验证

| ID | 用例 | 输入 | 期望输出 | 对应验收门禁 |
|----|------|------|---------|------------|
| TM-D-001 | `POST /v1/chat/completions` 不存在 | POST 请求 | `404` | ✅ Step 1 第 6 项 |
| TM-D-002 | 任何 SSE streaming 路径不存在 | — | 无 streaming 相关端点 | 废弃确认 |

#### 2.1.6 回归验证

| ID | 用例 | 输入 | 期望输出 | 对应验收门禁 |
|----|------|------|---------|------------|
| TM-REG-001 | library 模式不受影响 | `npm test`（现有 14 tests） | 14/14 pass | ✅ Step 1 第 8 项 |
| TM-REG-002 | `createModelClient()` 导入不变 | `import { createModelClient } from 'trimodel'` | 正常导入，签名不变 | 向后兼容 |

---

## 3. L2 — TriLC 消费端集成测试

### 3.1 测试文件：`TriLC/test/server/models-api.test.ts` ★新增

#### 3.1.1 `getAvailableModels()` HTTP 优先 + fallback

| ID | 用例 | 前置条件 | 期望结果 | 对应验收门禁 |
|----|------|---------|---------|------------|
| TL-M-001 | HTTP 优先：API 在线时走 HTTP | TriModel API 在线 | 返回与 TriModel `/v1/models` 一致的模型列表 | ✅ Step 2 第 1 项 |
| TL-M-002 | Library fallback：API 离线时走 library | TriModel API 离线，library 可用 | 返回 `createModelClient().listModels()` 结果 | ✅ Step 2 第 2 项 |
| TL-M-003 | 硬编码 fallback：API + library 均不可用 | API 离线 + library 不可用 | 返回硬编码 3 模型（deepseek-v4-pro / chat / reasoner） | ✅ Step 2 第 3 项 |
| TL-M-004 | 缓存 60s：短时间内多次调用只触发一次上游 | 连续 3 次调用 `/v1/models`（间隔 < 60s） | 第 1 次触发 HTTP/fallback；第 2、3 次走缓存，无上游请求 | ✅ Step 2 第 4 项 |
| TL-M-005 | 缓存过期后重新拉取 | 等待 > 60s 再调 | 重新触发上游请求 | 缓存 TTL |
| TL-M-006 | 函数改为 async 签名 | `await getAvailableModels()` | 返回 `ModelInfo[]`；调用处（L520、L900）正常 await | Step 2 编译验证 |
| TL-M-007 | `TRILC_TRIMODEL_API_URL` 默认值 | 不设 env var | 使用 `http://127.0.0.1:3333` | 默认配置 |
| TL-M-008 | 自定义 `TRILC_TRIMODEL_API_URL` | 设为 `http://other-host:9999` | 向该 URL 发送请求 | 配置覆盖 |

#### 3.1.2 现有测试回归

| ID | 用例 | 对应验收门禁 |
|----|------|------------|
| TL-REG-001 | `npm test` 无回归 | ✅ Step 2 第 5 项 |

---

## 4. L2b — TriLC Key 缓存 + 持久化测试

### 4.1 测试文件：`TriLC/test/config/key-cache.test.ts` ★新增

#### 4.1.1 Key 拉取与持久化

| ID | 用例 | 前置条件 | 期望结果 | 对应验收门禁 |
|----|------|---------|---------|------------|
| TK-001 | 首次启动 + TriModel 可达 → 拉取并持久化 | TriModel API 在线，`~/.trilc/keys.json` 不存在 | 拉取全量 Key → 创建 `keys.json`（加密或 600 权限）→ 内存缓存就绪 | ✅ Step 2b 第 1 项 |
| TK-002 | 拉取的 Key 格式完整 | API 返回标准格式 | 缓存含 `keys.deepseek.api_key`、`keys.deepseek.base_url`、`defaultModel`、`refreshIntervalS`、`fetchedAt`、`expiresAt` | 契约完整性 |
| TK-003 | 持久化文件路径正确 | `TRILC_HOME` 未设 | `~/.trilc/keys.json`（Windows: `%LOCALAPPDATA%/trilc/keys.json`） | 路径规范 |
| TK-004 | `TRILC_HOME` 自定义路径 | 设为 `/custom/path` | `/custom/path/keys.json` | 配置覆盖 |
| TK-005 | 启动时 API 返回 5xx → 尝试读本地缓存 | API 返回 500，缓存文件存在且未过期 | 静默使用缓存 Key；`chat` 功能正常 | 容错 |
| TK-006 | 首次启动 + API 不可达 + 无缓存 → chat 禁用 | API 离线，无缓存文件 | `initKeyCache()` 返回 null → chat 功能标记为不可用 → 返回友好错误 | ✅ Step 2b 第 3 项 |
| TK-007 | API 拉取超时（>5s）→ 不阻塞启动 | API 响应超过 5s | 5s 超时 → fallback 到缓存或 null；启动不挂起 | 启动不阻塞 |
| TK-008 | 二次启动 + API 不可达 + 缓存有效 → 静默使用缓存 | 重启 TriLC，API 离线，缓存 < 24h | 读本地缓存 → chat 功能正常；后台持续重试拉取 | ✅ Step 2b 第 2 项 |

#### 4.1.2 定时刷新

| ID | 用例 | 前置条件 | 期望结果 | 对应验收门禁 |
|----|------|---------|---------|------------|
| TK-009 | 15 分钟定时刷新触发 | TriModel API 在线，等待 > 15min | 新 Key 写入缓存 → 热生效（无需重启） | ✅ Step 2b 第 4 项 |
| TK-010 | 刷新失败 → 静默降级 | 刷新时 API 离线 | 继续使用现有缓存 Key；日志 warn 但不 panic | 静默降级 |
| TK-011 | 刷新成功 + Key 变更 → 通知路由 | 刷新后 `defaultModel` 或 Key 变化 | `onKeyCacheUpdated(cache)` 被调用 → 运行中的 chat handler 使用新 Key | Key 热更新 |
| TK-012 | `refresh_interval_s` 从服务端响应动态获取 | API 返回 `refresh_interval_s: 600`（10min） | 客户端使用 600s 而非默认 900s | 服务端动态控制 |

#### 4.1.3 Stagger 随机偏移

| ID | 用例 | 前置条件 | 期望结果 | 对应验收门禁 |
|----|------|---------|---------|------------|
| TK-013 | 首次刷新时间在 0–60s 内随机 | 启动后检查首次 `setTimeout` delay | delay ∈ [0, 60000] ms | ✅ Step 2b 第 5 项 |
| TK-014 | 多次启动的 stagger 不总是相同 | 连续启动 3 次，记录首次刷新时间 | 3 次的首次刷新时间不完全相同（概率 > 99%） | 随机性验证 |
| TK-015 | Stagger 仅影响首次刷新 | 首次刷新后，后续按固定 interval（非随机） | 第 2、3、4 次刷新间隔 = `refresh_interval_s * 1000` ms | 不累积随机偏移 |

#### 4.1.4 TTL 过期

| ID | 用例 | 前置条件 | 期望结果 |
|----|------|---------|---------|
| TK-016 | 缓存 < 24h → 直接使用 | `Date.now() < cache.expiresAt` | 不触发强制重拉 |
| TK-017 | 缓存 > 24h → 触发强制重拉 | `Date.now() >= cache.expiresAt` | 触发 API 拉取；拉取成功则更新缓存；拉取失败 → chat 禁用 |
| TK-018 | `expires_at` 从服务端响应获取 | API 返回 `expires_at: "2026-07-22T12:00:00Z"` | 客户端 `expiresAt` = 该时间的 Unix ms 值，不超过 `fetchedAt + 24h`（客户端侧二次校验） |

#### 4.1.5 加密存储（Phase 1 S3 → Phase 2 S2）

| ID | 用例 | 前置条件 | 期望结果 |
|----|------|---------|---------|
| TK-019 | Phase 1 S3：`keys.json` 权限 600 | 文件创建后 | Unix：`stat` 显示 `600`（仅 owner rw）；Windows：仅当前用户可读写 |
| TK-020 | Phase 1 S3：目录权限 700 | `~/.trilc/` | Unix：`stat` 显示 `700`（仅 owner rwx）|
| TK-021 | Phase 1 代码结构预留 `KeyStorage` 接口 | `key-cache.ts` 源码 | 包含 `interface KeyStorage { read(): Promise<KeyCache>; write(cache: KeyCache): Promise<void> }` |
| TK-022 | (Phase 2) S2 加密：文件不以明文保存 Key | 加密实现就绪时 | `keys.json` 内容为密文；直接 `cat` 不泄露 Key |
| TK-023 | (Phase 2) S2 加密：密钥由机器指纹派生 | — | 不同机器的 `keys.json` 互相不可解密 |

---

## 5. L3 — TriPilot 模型 UI 端到端验证

### 5.1 Settings → Models 页面

| ID | 用例 | 前置条件 | 期望结果 | 对应验收门禁 |
|----|------|---------|---------|------------|
| TP-S-001 | 默认模型下拉出现 | Step 3 实施完成 | Settings→Models 页底部出现 `<select id="defaultModelSelect">`，标题"默认模型" | ✅ Step 3 第 1 项 |
| TP-S-002 | 下拉仅显示已启用模型 | Settings 中启用 deepseek-chat + deepseek-v4-pro；禁用 deepseek-reasoner | 下拉含前 2 个，不含 deepseek-reasoner | ✅ Step 3 第 2 项 |
| TP-S-003 | 选择默认模型后重启保持 | 选择 deepseek-v4-pro 为默认 → 重启 TriPilot → 打开 Settings | 默认模型仍为 deepseek-v4-pro | ✅ Step 3 第 3 项 |
| TP-S-004 | 新会话使用默认模型 | 默认模型设为 deepseek-v4-pro → 创建新 Chat | Chat 初始模型为 deepseek-v4-pro | ✅ Step 3 第 4 项 |
| TP-S-005 | 旧 workspace config 自动迁移到 globalState | `globalState('tripilot.visibleModelIds')` 为空，`workspace.getConfiguration` 有值 | 首次读取时自动迁移 → globalState 写入 | ✅ Step 3 第 5 项（P1） |
| TP-S-006 | 迁移后不再依赖 workspace config | 迁移完成后修改 workspace config | 不再读取 workspace config；以 globalState 为准 | 数据源切换 |
| TP-S-007 | `defaultModelId` 存储到 globalState | 选择默认模型 | `globalState.get('tripilot.defaultModelId')` 返回所选模型 ID | 存储位置对齐 |
| TP-S-008 | 未选择默认模型时的 fallback | `defaultModelId` 为空 | 使用 `selectedModelId` 或首个可用模型 | 边界条件 |

### 5.2 Chat 模型下拉

| ID | 用例 | 前置条件 | 期望结果 | 对应验收门禁 |
|----|------|---------|---------|------------|
| TP-C-001 | 下拉仅显示已启用模型 | Settings 启用 A、B，禁用 C | Chat 下拉含 A、B，不含 C | ✅ Step 4 第 1 项 |
| TP-C-002 | 切换模型仅影响当前会话 | Chat A 选 deepseek-v4-pro；Chat B 选 deepseek-chat | 各自独立，互不影响 | ✅ Step 4 第 2 项 |
| TP-C-003 | 新会话默认使用 Settings 默认模型 | Settings 默认模型 = deepseek-v4-pro | 新 Chat 初始选 deepseek-v4-pro | ✅ Step 4 第 3 项 |
| TP-C-004 | 模型列表刷新按钮可用 | 点击刷新 | 重新请求 TriLC `/v1/models` → 下拉更新 | 刷新功能 |
| TP-C-005 | 搜索过滤可用 | 输入 "v4" | 仅显示含 "v4" 的模型 | 搜索功能 |
| TP-C-006 | 拉取失败时降级（使用缓存列表） | TriLC 离线 | 使用上次缓存的模型列表；不崩溃 | 容错 |

---

## 6. L4 — Key 安全测试

### 6.1 日志安全

| ID | 用例 | 检查方法 | 期望结果 |
|----|------|---------|---------|
| SK-001 | TriModel server 日志不含 Key | 启动 server，检查 stdout/stderr | 无 `sk-*`、`api_key` 明文出现在日志 |
| SK-002 | TriLC Key 缓存对象序列化时脱敏 | `console.log(keyCache)` / `JSON.stringify(keyCache)` | Key 字段显示为 `sk-****` 或被完全省略 |
| SK-003 | Error message 不含 Key | Key 相关操作抛异常 | Error.message 不含 Key 原文 |
| SK-004 | TriPilot 不将 Key 写入 VS Code Output Channel | 打开 TriPilot Output | 无 Key 明文 |

### 6.2 存储安全

| ID | 用例 | 检查方法 | 期望结果 |
|----|------|---------|---------|
| SK-005 | `~/.trilc/keys.json` 权限 | `stat` 或 Windows ACL | 600 / 仅当前用户可读写 |
| SK-006 | `~/.trilc/` 目录权限 | `stat` | 700 |
| SK-007 | TriPilot Key 不落盘为独立文件 | 搜索 `%APPDATA%/Code/User/globalStorage` | Key 在 VS Code globalState 内（由 VS Code 管理加密），无明显 `keys.json` |
| SK-008 | (Phase 2) 加密文件无法直接读取 | 直接 `cat keys.json` 或用文本编辑器打开 | 密文，不可读 |

### 6.3 网络传输安全

| ID | 用例 | 检查方法 | 期望结果 |
|----|------|---------|---------|
| SK-009 | Phase 1 仅监听 127.0.0.1 | `netstat -an` 或 `ss -tlnp` | `TRIMODEL_PORT`（默认 3333）仅绑定 `127.0.0.1`，非 `0.0.0.0` |
| SK-010 | 外网无法访问 `/v1/config/keys` | 从其他机器 `curl http://<host-ip>:3333/v1/config/keys` | 连接被拒绝或超时（非 401/200） |
| SK-011 | `Authorization` header 不记录到 access log | 请求 `/v1/config/keys`，检查 server 日志 | 日志不包含 `Bearer <token>` 原文 |

---

## 7. L5 — 离线容错测试

### 7.1 TriModel 完全离线

| ID | 用例 | 前置条件 | 期望结果 |
|----|------|---------|---------|
| TO-001 | TriModel 离线 + 有缓存 → TriLC chat 正常 | TriLC 有有效缓存（Key + 模型列表）→ 停止 TriModel | TriLC chat 直连 Provider，正常工作 |
| TO-002 | TriModel 离线 + 有缓存 → TriPilot chat 正常 | TriPilot 有有效缓存 → 停止 TriModel | TriPilot chat 直连 Provider，正常工作 |
| TO-003 | TriModel 离线 + 无缓存 → chat 禁用但非模型功能可用 | 清空所有缓存 → 停止 TriModel → 启动 TriLC | chat 返回"模型服务暂不可用"；本地文件操作、命令执行正常 |
| TO-004 | TriModel 离线 + 缓存 TTL 过期（>24h） | 缓存 expiredAt 已过 → 停止 TriModel | 等同于无缓存场景（TO-003） |
| TO-005 | TriModel 恢复后自动重连 | TriModel 离线 → 缓存有效 → TriModel 重新上线 | 下次定时刷新（≤15min）自动拉取最新 Key + 模型列表 |

### 7.2 网络中断

| ID | 用例 | 前置条件 | 期望结果 |
|----|------|---------|---------|
| TO-006 | 刷新期间网络短暂中断 | 定时刷新触发时断网 < 刷新间隔 | 刷新失败 → 使用缓存 → 下次刷新重试成功 |
| TO-007 | 持续网络中断 > 24h | 缓存 TTL 过期 + 仍不可达 | chat 禁用 |

### 7.3 Provider 限流

| ID | 用例 | 前置条件 | 期望结果 |
|----|------|---------|---------|
| TO-008 | 收到 Provider 429 → 自动退避 | Provider 返回 429 | 端侧指数退避（1s → 2s → 4s → 8s，max 30s）+ 用户友好提示 |
| TO-009 | 退避期间其他功能正常 | 正在退避 | 模型切换、设置修改、本地操作不受影响 |

---

## 8. 测试门禁判断标准

### 8.1 Phase A 出口标准（策略阶段）

- [ ] 所有用例已明确 ID、前置条件、输入、期望输出、对应验收门禁
- [ ] 覆盖 5 个测试层级、全部 4 个 Step 的验收门禁
- [ ] CTO 已审阅并确认策略范围无遗漏

### 8.2 Phase B 出口标准（验证阶段）

- [ ] TriModel API server：TM-H/M/K/R/D/REG 全部 PASS 或 CONDITIONAL_PASS
- [ ] TriLC models HTTP 化：TL-M 全部 PASS；TL-REG PASS（零回归）
- [ ] TriLC Key 缓存：TK-001–TK-023 PASS（Phase 2 加密项标记为 CONDITIONAL_PASS 或 DEFERRED）
- [ ] TriPilot UI：TP-S + TP-C 全部 PASS
- [ ] Key 安全：SK-001–SK-011 全部 PASS
- [ ] 离线容错：TO-001–TO-009 全部 PASS
- [ ] 阻塞性缺陷 = 0

### 8.3 缺陷分级

| 级别 | 定义 | 举列 | 处置 |
|------|------|------|------|
| **BLOCKER** | 阻碍核心功能交付 | `/v1/config/keys` 无认证返回 Key；TriModel 宕机导致 TriPilot 完全不可用 | **拒收**，上报 CTO |
| **CRITICAL** | Key 安全漏洞或数据泄露 | Key 明文出现在日志；`keys.json` 无权限保护且可被其他用户读取 | **拒收**，立即修复 |
| **MAJOR** | 功能不符合设计规格 | 默认模型选择不持久化；刷新周期硬编码忽略服务端动态值 | CONDITIONAL_PASS，需 CTO 确认 |
| **MINOR** | 非阻塞性偏差 | Stagger 偏移偶尔超出 60s；display_name 回退到 id | PASS，记录技术债 |
| **NICE_TO_HAVE** | UX 优化项 | 刷新时无 loading spinner；无 Key 池预埋 schema（Phase 1 不需要） | PASS，排入 backlog |

---

## 9. 偏差报告模板（Phase B 输出用）

```markdown
## TriModel 配置平面改造 — Phase B 偏差报告

**执行人**：小柯（TestEngineer）
**日期**：YYYY-MM-DD
**测试节点**：cpo-trimodel-3b

### 执行摘要
- 总用例数：N
- PASS: n1
- CONDITIONAL_PASS: n2
- FAIL: n3
- BLOCKER: n4
- CRITICAL: n5

### 偏差清单

| ID | 级别 | 预期 | 实际 | 影响 | 建议 |
|----|------|------|------|------|------|

### 阻塞性问题

（如有 BLOCKER 或 CRITICAL → 立即上报 CTO）

### 门禁判断

- **TriModel API**: PASS / CONDITIONAL_PASS / FAIL
- **TriLC Key 缓存**: PASS / CONDITIONAL_PASS / FAIL
- **TriPilot UI**: PASS / CONDITIONAL_PASS / FAIL
- **Key 安全**: PASS / CONDITIONAL_PASS / FAIL
- **离线容错**: PASS / CONDITIONAL_PASS / FAIL

### 整体门禁评估

- [ ] 放行 / [ ] 有条件放行 / [ ] 拒收

### 依据溯源

- 设计文档：`technical-design.md` (cpo-trimodel-2b)
- 裁决文档：`ruling.md` (cpo-trimodel-1 + 1b)
- 测试策略：本文档 (cpo-trimodel-3)
- 代码 registry: `TriModel/docs/registry/code-state.md` / `TriLC/docs/registry/code-state.md`
```

---

## 10. 使用依据

| 依据 | 路径 | 版本 |
|------|------|------|
| CTO 技术方案（修正版） | `trees/cpo-trimodel-deployment/technical-design.md` | cpo-trimodel-2b（2026-07-20 22:41） |
| CPO 裁决 | `trees/cpo-trimodel-deployment/ruling.md` | cpo-trimodel-1 + cpo-trimodel-1b §附录A |
| CEO 升级简报 | `trees/cpo-trimodel-deployment/escalation-brief.md` + §附录A |
| 任务树操作计划 | `trees/cpo-trimodel-deployment/tree-op.json` | v0.3.0 |
| 中央 BusinessStrategy | `docs/registry/business-strategy-state.md` | 2026-06-04 |
| 中央 Code State | `docs/registry/code-state.md` | 2026-07-14 |
| TriModel 现役代码 | `../TriModel/src/` + `../TriModel/package.json`（14/14 tests） | — |
| TriLC 现役代码 | `../TriLC/src/server/app.ts` + `../TriLC/src/config/env.ts` | — |
| TriPilot 现役代码 | `../TriPilot/src/extension.ts` + `../TriPilot/media/settings.js` | — |

---

## 下一步

- **next_agent**: `ChiefTechnologyOfficer`（小狄）— 审阅测试策略
- **action**: CTO 确认策略范围 → 小全执行 Step 1-4 实施 → Phase B 验证
- **节点**: `cpo-trimodel-3` → CTO 审阅后 → `cpo-trimodel-3b`（Phase B 验证）

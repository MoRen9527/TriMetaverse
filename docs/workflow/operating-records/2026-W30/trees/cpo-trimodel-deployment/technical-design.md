# TriModel 部署技术方案 + 多端接入 API 契约 + TriPilot 模型 UI 接线

**作者**：小狄（CTO）  
**日期**：2026-07-20（§6–§8 修正于 2026-07-20 22:41，基于 CPO 附录A `cpo-trimodel-1b`）  
**任务树**：`cpo-trimodel-deployment`  
**节点**：`cpo-trimodel-2b`（修正版）  
**裁决类型**：APPROVE（Phase 1 即刻执行，Phase 2 待 API 稳定后触发）

> ⚠️ **架构修正通知**：§1–§5 的原始版本基于"代理网关"模型编写（TriModel 代理流量 → Provider）。  
> CPO 于 2026-07-20 `cpo-trimodel-1b`（附录A）裁决纠偏为**纯配置平面**：端直连 Provider，TriModel 只分发 Key + 模型列表。  
> **请以 §6–§8 为新真源，§1–§5 中与 `POST /v1/chat/completions` / SSE streaming 相关的部分已 DISCONTINUED。**

---

## 前置核查摘要

| 核查项 | 结果 |
|--------|------|
| 工作路径核查（0） | ✅ 产出写入 `trees/cpo-trimodel-deployment/technical-design.md`，正确 |
| 归属路由阀门（0.5） | ✅ 技术方案属于 CTO 裁决域 |
| CPO 裁决 | ✅ 完整阅读 `ruling.md`，Q1-Q4 全部 APPROVE |
| BusinessStrategy | ✅ 已核查：TriModel P2 基础设施，TriLC 本地主入口，本次不触碰模块优先级 |
| 工程真源 | ✅ `docs/engineering/DESIGN.md` 当前为发布侧摘要页，不构成额外约束 |
| TriModel 代码 | ✅ 14/14 tests，`ModelClient` + `listModels()` + `chat()` + `stream()` 完整可用 |
| TriModel config | ✅ `.env.example` 已有完整六项 env var 契约 |
| TriLC 代码 | ✅ `/v1/models` + `/models` 端点已有，`getAvailableModels()` 含 60s 缓存 + fallback |
| TriPilot 代码 | ✅ Settings→Models 页面（`settings.js` L195-247）已有动态渲染+开关+搜索+刷新；Chat 模型选择（`buildTrilcDirectLmModels()`）已有过滤逻辑+下拉 |

---

## 1. TriModel API 服务化方案（Phase 1）

### 1.1 部署架构决策

| 选项 | 评估 | 
|------|------|
| Node.js native `http` | ✅ **选定**。与 TriLC 同质（native `http`），零额外依赖，运维最简单 |
| Express | ❌ 增加依赖，MVP 阶段不必要 |
| Fastify | ❌ 增加依赖，MVP 阶段不必要 |
| Docker | 可选（Phase 1 不强制，但提供 `Dockerfile` 作为运维友好入口） |
| Serverless | ❌ 不适合：TriModel 是长连接 SSE streaming + 有状态 Key pool |

**部署形式**：独立 Node.js 进程，驻留在 TriModel 仓库内，通过 `src/server.ts` 入口启动。

### 1.2 仓库结构变更

> ⚠️ 已按 CPO 附录A 修正：`chat.ts` 废弃，新增 `keys.ts`（Key 分发端点）。

```
TriModel/
├── src/
│   ├── index.ts          # 不变：library 入口（createModelClient, ModelClient, 类型导出）
│   ├── client.ts         # 不变
│   ├── config.ts         # 不变
│   ├── types.ts          # 不变
│   ├── usage.ts          # 不变
│   ├── providers/
│   │   ├── deepseek.ts   # 不变
│   │   └── trimetaverse.ts# 不变
│   ├── server.ts         # ★ 新增（修正版）：HTTP server 入口（仅配置类端点）
│   └── api/
│       ├── routes.ts     # ★ 新增：路由分发
│       ├── health.ts     # ★ 新增：GET /health
│       ├── models.ts     # ★ 新增：GET /v1/models（HTTP 化 listModels）
│       ├── keys.ts       # ★ 新增：GET /v1/config/keys + POST /v1/config/keys/refresh
│       └── chat.ts       # ❌ DISCONTINUED（CPO 附录A：配置平面不代理业务流量）
├── package.json           # 新增 scripts: "serve", "start:server"
├── Dockerfile             # ★ 新增（Phase 1 optional）
├── .env.example           # 不变（作为契约文档）
└── .env                   # gitignored，本地 dev 用
```

### 1.3 API 端点设计

#### `GET /health`

```
Response 200:
{
  "ok": true,
  "service": "trimodel",
  "version": "0.1.0",
  "providers": {
    "deepseek": true,
    "trimetaverse": false
  }
}
```

- 调用 `ModelClient.healthCheck()` 获取各 provider 状态
- 不含任何 Key 信息

#### `GET /v1/models`

```
Response 200:
{
  "object": "list",
  "data": [
    {
      "id": "deepseek-v4-pro",
      "object": "model",
      "display_name": "DeepSeek V4 Pro",
      "provider": "deepseek",
      "capabilities": {
        "chat": true,
        "streaming": true,
        "tools": true,
        "reasoning": true
      },
      "created": 1735689600
    },
    {
      "id": "deepseek-chat",
      ...
    },
    ...
  ]
}
```

- 调用 `ModelClient.listModels()` 获取所有模型 ID
- 为每个模型附加 `display_name`、`provider`、`capabilities`
- `capabilities` 基于模型 ID 推断（`deepseek-reasoner` → `reasoning: true`；`deepseek-v4-flash` → 标记 fast）
- 响应格式兼容 OpenAI `/v1/models` 且扩展了 `display_name` 和 `capabilities` 字段
- TriLC `/v1/models`（Anthropic 格式）和 `/models`（OpenAI 格式）继续自行做格式转换，TriModel API 不需要同时提供两种格式

#### `POST /v1/chat/completions` — ❌ DISCONTINUED

> **CPO 附录A裁定**：配置平面不代理业务流量。端 → Provider 直连，不经过 TriModel。
> 该端点、SSE streaming 及 `src/api/chat.ts` **全部废弃**。详见 §6 配置平面架构修正。

<details>
<summary>原始设计（仅供参考，不再实施）</summary>

原设计为 OpenAI Chat Completions API 兼容格式的代理端点，含非流式 JSON 响应和 SSE streaming。底层复用 `ModelClient.chat()` 和 `ModelClient.stream()`。

</details>

---

#### `GET /v1/config/keys` — ★ 新增（配置平面核心端点）

```
Request:
  Authorization: Bearer <TRIMODEL_API_TOKEN>

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

- `keys` 字段按 provider 分组，与三层密钥模型（L1 直连 / L2 TriMetaverse / L3 不可见）对应
- `default_model` 告知各端新会话默认使用哪个模型
- `refresh_interval_s` 允许 TriModel 服务端动态调整刷新周期（默认 900s = 15min）
- `expires_at` 告知客户端这些 Key 的有效截止时间；过期后强制重新拉取
- 需认证：Phase 1 使用 `TRIMODEL_API_TOKEN` 环境变量，客户端在 `Authorization: Bearer` 中传递
- 响应中不含 L3 Key（TriStaciss 内部 Key 对 TriModel 不可见）

#### `POST /v1/config/keys/refresh` — ★ 新增（手动强制刷新）

```
Request:
  Authorization: Bearer <TRIMODEL_API_TOKEN>

Response 200:
{
  "ok": true,
  "refreshed_at": "2026-07-20T14:45:00Z",
  "message": "Key cache refreshed; clients will receive updated keys on next pull"
}
```

- admin/运维用端点：强制 TriModel 重新加载 Key（从环境变量或 Secret Manager）
- 客户端在下一次 15 分钟定时刷新时自动获取新 Key
- 无需客户端主动调用此端点

### 1.4 服务端环境变量

与 `.env.example` 完全一致，但通过服务端环境变量注入（非 `.env` 文件）：

| 变量名 | 必须 | 默认值 | 说明 |
|--------|------|--------|------|
| `DEEPSEEK_API_KEY` | 是 | — | L1 直连 Key（sk-* 格式）。★ 修正：配置平面分发用，非代理用 |
| `DEEPSEEK_BASE_URL` | 否 | `https://api.deepseek.com/v1` | DeepSeek API 地址 |
| `TRIMODEL_TRIMETAVERSE_API_KEY` | 否 | `tmv-sk-dev-default` | L2 TriMetaverse provider Key |
| `TRIMODEL_TRISTACISS_BASE_URL` | 否 | `http://127.0.0.1:8000/v1` | TriStaciss API 地址 |
| `TRIMODEL_PRIMARY_PROVIDER` | 否 | `deepseek` | 主 provider |
| `TRIMODEL_DEFAULT_MODEL` | 否 | `deepseek-chat` | 默认模型 |
| `TRIMODEL_FALLBACK_MODEL` | 否 | `deepseek-chat` | fallback 模型 |
| `TRIMODEL_REQUEST_TIMEOUT_MS` | 否 | `60000` | 请求超时 ms |
| `TRIMODEL_PORT` | 否 | `3333` | HTTP 监听端口 |
| `TRIMODEL_HOST` | 否 | `127.0.0.1` | 监听地址 |
| `TRIMODEL_API_TOKEN` | 是（Phase 1） | — | **★ 新增**：API 认证 Token，用于 `GET /v1/config/keys` 的 `Authorization: Bearer` |
| `TRIMODEL_KEY_REFRESH_INTERVAL_S` | 否 | `900` | **★ 新增**：Key 服务端刷新间隔（秒），写入 `refresh_interval_s` 响应字段 |

**Key 安全策略（修正版）**：
- 服务端：环境变量注入（systemd `EnvironmentFile` / Docker `--env` / k8s `Secret` → env）
- API 端点不暴露 Key：`/v1/models` 和 `/health` 响应不含任何 Key 信息
- **`/v1/config/keys` 会传输 Key**：必须通过 `TRIMODEL_API_TOKEN` 认证；Phase 1 仅监听 `127.0.0.1`，不暴露到公网
- `.env` 文件保留给本地 dev 模式（`tsx src/server.ts` 时走 `dotenv` 自动加载）
- `.env.example` 作为契约文档，声明所有需要的 env var
- ★ 修正：不再有 `chat/completions` 端点的 Key 使用场景——Key 分发给各端后，各端直连 Provider

### 1.5 启动与部署

```bash
# 本地 dev
npm run serve          # tsx src/server.ts（读 .env）

# 生产构建
npm run build          # tsc → dist/
npm run start:server   # node dist/src/server.js（读环境变量）

# Docker（optional Phase 1）
docker build -t trimodel:0.1.0 .
docker run -e DEEPSEEK_API_KEY=sk-xxx -p 3333:3333 trimodel:0.1.0
```

### 1.6 `src/server.ts` 架构概要（修正版）

```
server.ts
  → createModelClient(readConfig())  // 复用 library，同一个 ModelClient 实例
  → http.createServer(handleRequest)
     → GET  /health                  → healthCheck() → 200 JSON
     → GET  /v1/models               → listModels() → 200 JSON（含 capabilities）
     → GET  /v1/config/keys          → readKeys() → 200 JSON（需认证：Authorization: Bearer）
     → POST /v1/config/keys/refresh  → refreshKeys() → 200 JSON（admin 强制刷新）
```

- 单 `ModelClient` 实例，服务启动时初始化一次，全生命周期复用
- `readKeys()` 从环境变量读取所有 provider Key，组装为 §1.3 中定义的 `config.keys` 响应格式
- `refreshKeys()` 重新读取环境变量（或 Secret Manager），更新内存中的 Key 缓存
- ★ 废弃：`POST /v1/chat/completions` 和 SSE streaming 不再存在——业务流量不经 TriModel
- `readConfig()` 从环境变量读取（服务端环境）或 `.env`（dev 模式） — 与 library 的 `config.ts` 行为完全一致
- 错误处理：未配置 Key → `/health` 返回 `providers: { deepseek: false }`
- Key 分发端点：未配置 `TRIMODEL_API_TOKEN` → 所有 `/v1/config/*` 返回 401

---

## 2. TriLC 消费端改造

### 2.1 当前状态

```typescript
// TriLC/src/server/app.ts L1657-1684
function getAvailableModels(): ModelInfo[] {
  if (_modelCache && _modelCache.expiresAt > Date.now()) return _modelCache.models;
  try {
    if (!_modelClient) _modelClient = createModelClient();
    const modelIds = _modelClient.listModels();
    // ... build ModelInfo[], cache 60s
  } catch {
    // Fallback: hardcoded list
  }
}
```

当前直接 import library → `createModelClient()` → `listModels()`。

### 2.2 Phase 1 改造方案：HTTP 优先 + library fallback

```typescript
// 新增配置
const TRIMODEL_API_URL = process.env.TRILC_TRIMODEL_API_URL ?? 'http://127.0.0.1:3333';

async function fetchModelsFromApi(): Promise<ModelInfo[]> {
  const res = await fetch(`${TRIMODEL_API_URL}/v1/models`, {
    signal: AbortSignal.timeout(5000), // 5s timeout
  });
  if (!res.ok) throw new Error(`TriModel API ${res.status}`);
  const json = await res.json();
  return (json.data as any[]).map((m) => ({
    id: m.id,
    displayName: m.display_name ?? m.id,
    createdAt: String(m.created ? new Date(m.created * 1000).toISOString().slice(0, 10) : '2025-01-01'),
  }));
}

function getAvailableModels(): ModelInfo[] {
  // Return cached models if still valid
  if (_modelCache && _modelCache.expiresAt > Date.now()) {
    return _modelCache.models;
  }

  // Phase 1: Try HTTP first
  try {
    const models = await fetchModelsFromApi();  // ← 异步调用
    _modelCache = { models, expiresAt: Date.now() + MODEL_CACHE_TTL_MS };
    return models;
  } catch (apiErr) {
    console.warn(`[trilc] TriModel API unreachable (${apiErr}), falling back to library`);
  }

  // Fallback: direct library import
  try {
    if (!_modelClient) _modelClient = createModelClient();
    const modelIds = _modelClient.listModels();
    const models: ModelInfo[] = modelIds.map((id) => ({
      id,
      displayName: id,
      createdAt: '2025-01-01',
    }));
    _modelCache = { models, expiresAt: Date.now() + MODEL_CACHE_TTL_MS };
    return models;
  } catch {
    if (_modelCache) return _modelCache.models;
    return [
      { id: 'deepseek-v4-pro', displayName: 'DeepSeek V4 Pro', createdAt: '2025-01-01' },
      { id: 'deepseek-chat', displayName: 'DeepSeek Chat', createdAt: '2024-01-01' },
      { id: 'deepseek-reasoner', displayName: 'DeepSeek Reasoner', createdAt: '2025-01-01' },
    ];
  }
}
```

**关键决策**：`getAvailableModels()` 当前是同步函数。改造为 HTTP 调用后需要变成 async。

**影响评估**：
- 两个调用点（`/v1/models` L520 和 `/models` L900）都在 HTTP handler 的 async 上下文中 → 改动安全，只需 `await getAvailableModels()`
- 缓存 60s 保持不变
- `TRILC_TRIMODEL_API_URL` 默认 `http://127.0.0.1:3333`，Phase 1 本地部署时无需额外配置

### 2.3 `/v1/models` 和 `/models` 端点 — 不变

TriLC 的 `/v1/models`（Anthropic 格式）和 `/models`（OpenAI 格式）端点不做变更，它们内部调用 `getAvailableModels()` 后自行格式化响应。

### 2.4 ★ 新增：TriLC Key 拉取与本地持久化缓存（CPO 附录A 新增）

TriLC 从配置平面拉取后，各端**直连 Provider**，不再经过 TriLC 代理 chat 流量。TriLC 需新增 Key 消费逻辑。

#### 2.4.1 Key 拉取流程

```typescript
// TriLC 新增文件: src/config/key-cache.ts

interface KeyCache {
  keys: Record<string, { api_key: string; base_url?: string }>;
  defaultModel: string;
  refreshIntervalS: number;
  fetchedAt: number;        // unix ms
  expiresAt: number;        // fetchedAt + 24h
}

const KEY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;   // 24 小时
const KEY_REFRESH_INTERVAL_MS = 15 * 60 * 1000;  // 15 分钟（可与服务端 refresh_interval_s 协商）
const KEY_CACHE_FILE = path.join(
  process.env.TRILC_HOME ?? path.join(os.homedir(), '.trilc'),
  'keys.json'
);

// ★ 启动时：读缓存 → 异步拉取 → 持久化
async function initKeyCache(): Promise<KeyCache> {
  // 1. 先读本地缓存（如果有）
  let cache: KeyCache | null = readKeyCacheFromDisk();
  
  // 2. 异步尝试从 TriModel API 拉取（启动时不阻塞）
  try {
    const fresh = await fetchKeysFromApi();
    cache = { ...fresh, fetchedAt: Date.now(), expiresAt: Date.now() + KEY_CACHE_TTL_MS };
    writeKeyCacheToDisk(cache);
  } catch (err) {
    console.warn(`[trilc] Key fetch failed on startup: ${err}`);
    // 继续使用本地缓存
  }
  
  // 3. 如果无缓存且拉取失败 → Key 不可用，chat 功能禁用
  if (!cache) {
    console.error('[trilc] No key cache available — chat disabled');
    return null;
  }
  
  // 4. 启动后台定时刷新器
  startKeyRefreshTimer(cache.refreshIntervalS);
  
  return cache;
}

// ★ 后台定时刷新 + 启动时间随机偏移（stagger）
function startKeyRefreshTimer(intervalS: number) {
  // Stagger: 随机偏移 0–60s，避免惊群
  const initialDelay = Math.floor(Math.random() * 60) * 1000;
  setTimeout(() => {
    setInterval(async () => {
      try {
        const fresh = await fetchKeysFromApi();
        const cache = { ...fresh, fetchedAt: Date.now(), expiresAt: Date.now() + KEY_CACHE_TTL_MS };
        writeKeyCacheToDisk(cache);
        // Key 热更新：如果 defaultModel 或 Key 变化，通知正在运行的路由
        onKeyCacheUpdated(cache);
      } catch (err) {
        console.warn(`[trilc] Key refresh failed (will retry in ${intervalS}s): ${err}`);
        // 静默降级：继续使用现有缓存
      }
    }, intervalS * 1000);
  }, initialDelay);
}
```

#### 2.4.2 容错矩阵

| 场景 | 行为 | 用户感知 |
|------|------|----------|
| 启动时 TriModel 可达 | 拉取全量 Key → 缓存 → 正常 | 无感知 |
| 启动时 TriModel 不可达，有缓存 | 使用缓存 Key → 标记 stale | 无感知（静默）；后台持续重试 |
| 启动时 TriModel 不可达，无缓存 | 阻止 chat 功能；非模型功能正常 | "模型服务暂不可用，请检查网络后重试" |
| 定时刷新失败 | 继续使用缓存 Key → 延长至下次刷新 | 无感知 |
| 缓存 Key 已过期（>24h）+ TriModel 不可达 | 同"无缓存 + 不可达" | 同上 |

#### 2.4.3 Key 使用方式（端直连 Provider）

```typescript
// TriLC 调用 Provider 时：使用本地缓存的 Key，直连，不经 TriModel
async function callProvider(modelId: string, messages: Message[]) {
  const keyCache = getKeyCache();  // 从 key-cache.ts 获取当前 Key
  const modelProvider = resolveProvider(modelId);  // 从模型 ID 推断 provider（如 'deepseek'）
  const keyInfo = keyCache?.keys[modelProvider];
  if (!keyInfo) throw new Error(`No key for provider ${modelProvider}`);
  
  // 直连 Provider，不走 TriModel 代理
  const response = await fetch(`${keyInfo.base_url ?? 'https://api.deepseek.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${keyInfo.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: modelId, messages, stream: false }),
  });
  return response.json();
}
```

### 2.5 Phase 2（API 稳定后）

- 将 `TRILC_TRIMODEL_API_URL` 默认值改为生产 TriModel API 地址
- library fallback 保留给 `TRILC_TRIMODEL_API_URL` 不可用时的降级路径
- `createModelClient()` 的 import 保留（dev 模式 + fallback）
- TriLC 完全不再代理 chat 流量到 TriModel——各端直连 Provider

---

## 3. TriPilot 模型 UI 接线方案

### 3.1 现状评估

TriPilot 的模型 UI 基础设施**已相当完善**，大部分 CPO Q3 规格已经在现有代码中工作：

| CPO Q3 规格 | 当前状态 | 差距 |
|-------------|---------|------|
| 模型列表（从 TriLC /v1/models 拉取） | ✅ `getAllModelsForSettings()` L2376 → `trilcClient.listModels()` L2395 → TriLC /v1/models | 无 |
| 复选框开关（启用/禁用） | ✅ `settings.js` L227-235，已有 toggle switch + `toggleModel` 消息 | 无 |
| 搜索/过滤 | ✅ `settings.js` L195-199 | 无 |
| 刷新按钮 | ✅ `settings.js` L618 `#refresh` | 无 |
| Chat 模型下拉（仅显示启用模型） | ✅ `buildTrilcDirectLmModels()` L2871 按 `visibleModelIds` 过滤 → `lmModels` 消息 → Chat webview | 无 |
| 切换仅影响当前会话 | ✅ `selectedModelId` 已绑定到 chat state（L5682） | 无 |
| **默认模型下拉** | ❌ 缺失 | **需新增** |
| 存储到 globalState（CPO 裁定） | ⚠️ `visibleModelIds` 存 `workspace.getConfiguration`；`selectedModelId` 存 `globalState` | 存储位置对齐 |

### 3.2 需要新增：Settings→Models 默认模型下拉

**位置**：`settings.js` 的 `render()` 函数，在模型列表下方追加默认模型选择器。

**UI 结构**：
```html
<div class="section">
  <div class="sectionTitle">默认模型</div>
  <select id="defaultModelSelect">
    <!-- 仅显示已启用的模型 -->
    <option value="deepseek-v4-pro">DeepSeek V4 Pro</option>
    <option value="deepseek-chat" selected>DeepSeek Chat</option>
  </select>
  <div class="hint">新对话将默认使用此模型。可在 Chat 界面中随时切换。</div>
</div>
```

**数据流**：
```
[Settings webview]
  defaultModelSelect.onchange
    → vscode.postMessage({ type: 'setDefaultModel', id: selectedValue })

[extension.ts — TripilotSettingsPanel]
  case 'setDefaultModel':
    → this.context.globalState.update('tripilot.defaultModelId', msg.id)
    → 不需要回传（Chat 端独立读取 globalState）

[extension.ts — ChatHost]
  → 读 globalState.get('tripilot.defaultModelId') 作为新会话的初始模型
  → 已有 `selectedModelId` 初始化逻辑（L2764），替换其 fallback 为 defaultModelId
```

**需要修改的文件**：
1. `TriPilot/media/settings.js` — 新增 `defaultModelSelect` 渲染 + `setDefaultModel` 消息发送
2. `TriPilot/src/extension.ts` — 
   - `TripilotSettingsPanel`: 新增 `setDefaultModel` 消息处理
   - `ChatHostManager`: `selectedModelId` 初始化时优先读 `defaultModelId`（L2764 附近）
   - `init`/`update` 消息中传入 `defaultModelId`

### 3.3 存储位置对齐（CPO Q3 裁定）

CPO 裁定：启用/禁用状态 + 默认模型 → 均存 `globalState`。

当前事实：
- `visibleModelIds`（启用/禁用）→ `workspace.getConfiguration('tripilot')`（L1914-1931）
- `selectedModelId` → `globalState.get('tripilot.selectedModelId')`（L2764）
- `defaultModelId` → 尚未实现

**CTO 技术判断**：`workspace.getConfiguration` 与 `globalState` 在 VS Code 中的差异：

| | `globalState` | `workspace.getConfiguration` (Global) |
|---|---|---|
| 持久化 | Extension storage (JSON file) | VS Code settings.json |
| 跨机器同步 | ❌ 不会 | ✅ 通过 Settings Sync |
| 用户可手动编辑 | ❌ 不会 | ✅ 可编辑 settings.json |

`visibleModelIds` 是否应该跨机器同步？当前 TriPilot 已使用 `workspace.getConfiguration`，如果改到 `globalState`，用户在不同机器上需要重新配置可见模型列表。但反过来，`visibleModelIds` 与本地 TriLC 提供的模型列表强相关（不同机器可能有不同 TriLC 配置），不同步反而是合理默认。

**裁决**：**遵循 CPO 裁定**，将 `visibleModelIds` 从 `workspace.getConfiguration` 迁移到 `globalState`。但保留 `workspace.getConfiguration` 作为向后兼容的初始化来源（如果 `globalState` 为空且 `workspace.getConfiguration` 有值，则迁移一次）。

迁移策略：
```typescript
// 首次读取时迁移
private getVisibleModelIds(): string[] {
  const fromGlobal = this.context.globalState.get<string[]>('tripilot.visibleModelIds');
  if (fromGlobal) return fromGlobal;
  
  // 向后兼容：从 workspace config 迁移到 globalState
  const fromConfig = vscode.workspace.getConfiguration('tripilot').get<string[]>('visibleModelIds', []) ?? [];
  const ids = fromConfig.map(s => String(s).trim()).filter(Boolean);
  if (ids.length) {
    this.context.globalState.update('tripilot.visibleModelIds', ids);
  }
  return ids;
}
```

### 3.4 Chat 模型下拉 — 无需改动

现有代码已经满足 CPO Q3 规格：
- `buildTrilcDirectLmModels()` L2871：按 `visibleModelIds` 过滤
- `refreshModelsAndPost()` L5790：拉取模型列表 → post `lmModels`
- Chat webview 接收 `lmModels` 消息后渲染模型下拉
- `selectedModelId` 绑定到当前会话，切换不影响全局

### 3.5 实施清单

| # | 文件 | 改动 | 优先级 |
|---|------|------|--------|
| 3.5.1 | `settings.js` | `render()` 底部追加默认模型下拉（`<select id="defaultModelSelect">`），onchange 发 `setDefaultModel` | P0 |
| 3.5.2 | `extension.ts` SettingsPanel | 新增 `case 'setDefaultModel'` → `globalState.update('tripilot.defaultModelId', id)` | P0 |
| 3.5.3 | `extension.ts` SettingsPanel | `init`/`update` 消息中增加 `defaultModelId` 字段 | P0 |
| 3.5.4 | `extension.ts` ChatHostManager | `selectedModelId` 初始化（L2764）优先读 `defaultModelId` | P0 |
| 3.5.5 | `extension.ts` SettingsPanel | `getVisibleModelIds()` 迁移到 `globalState`（含向后兼容迁移逻辑） | P1 |
| 3.5.6 | `settings.js` | `defaultModelSelect` 选项仅显示已启用模型，选择为空时显示提示 | P1 |

---

## 4. 实施顺序

### Step 1: TriModel 配置平面 API server（修正版）

> ⚠️ 已按 CPO 附录A 修正：删除 chat 代理端点，新增 Key 分发端点。

| 文件 | 操作 | 
|------|------|
| `TriModel/src/server.ts` | 创建：HTTP server 入口，绑定 `createModelClient(readConfig())`（仅配置平面） |
| `TriModel/src/api/health.ts` | 创建：`GET /health` handler |
| `TriModel/src/api/models.ts` | 创建：`GET /v1/models` handler（含 capabilities 推断） |
| `TriModel/src/api/keys.ts` | ★ 创建：`GET /v1/config/keys` + `POST /v1/config/keys/refresh` handler |
| `TriModel/src/api/routes.ts` | 创建：路由分发（health + models + keys，无 chat） |
| `~TriModel/src/api/chat.ts~` | ❌ 不创建（已废弃，CPO 附录A） |
| `TriModel/package.json` | 修改：新增 `"serve": "tsx src/server.ts"`, `"start:server": "node dist/src/server.js"` |
| `TriModel/Dockerfile` | 创建：（optional Phase 1） |
| `TriModel/.env.example` | 修改：新增 `TRIMODEL_API_TOKEN` 注释（契约文档） |

**验收门禁**：
- [ ] `npm run serve` 启动后 `curl http://127.0.0.1:3333/health` 返回 200
- [ ] `curl http://127.0.0.1:3333/v1/models` 返回模型列表（4 个 DeepSeek 模型）
- [ ] ★ `curl -H 'Authorization: Bearer test-token' http://127.0.0.1:3333/v1/config/keys` 返回 Key 列表 JSON（格式见 §1.3）
- [ ] ★ 无 `Authorization` header → `/v1/config/keys` 返回 401
- [ ] ★ `POST /v1/config/keys/refresh`（admin）→ 200
- [ ] `~curl -X POST /v1/chat/completions~` ❌ 此端点不存在 → 404
- [ ] 不配置 `DEEPSEEK_API_KEY` → `/health` 返回 `deepseek: false`
- [ ] `npm test` 14/14 tests 无回归（library 模式不受影响）

### Step 2: TriLC `getAvailableModels()` HTTP 化 + fallback

| 文件 | 操作 |
|------|------|
| `TriLC/src/server/app.ts` | 修改 `getAvailableModels()`：HTTP 优先 → library fallback；改为 async |
| `TriLC/src/server/app.ts` | 修改 `/v1/models` L520 和 `/models` L900：`await getAvailableModels()` |
| `TriLC/src/config/env.ts` | 新增 `TRILC_TRIMODEL_API_URL` env var（默认 `http://127.0.0.1:3333`） |

**验收门禁**：
- [ ] TriModel API 在线时：`getAvailableModels()` 走 HTTP，返回与 TriModel API 一致的模型列表
- [ ] TriModel API 离线时：`getAvailableModels()` 自动 fallback 到 library `createModelClient().listModels()`
- [ ] TriModel API + library 均不可用时：fallback 到硬编码列表
- [ ] 缓存 60s 正常：短时间内多次调用 `/v1/models` 只触发一次上游请求
- [ ] TriLC `npm test` 无回归（如有相关测试）

### ★ Step 2b: TriLC Key 拉取 + 本地持久化缓存（新增）

| 文件 | 操作 |
|------|------|
| `TriLC/src/config/key-cache.ts` | ★ 新建：Key 缓存模块（拉取 API → 加密写盘 → 内存缓存 → 定时刷新） |
| `TriLC/src/config/env.ts` | 新增 `TRILC_HOME` env var（默认 `~/.trilc`） |
| `TriLC/src/server/app.ts` | 启动时调用 `initKeyCache()`，chat handler 改为直连 Provider（不代理到 TriModel） |

**验收门禁**：
- [ ] 首次启动 + TriModel 可达 → 拉取 Key → `~/.trilc/keys.json` 创建（加密或 600 权限）
- [ ] 二次启动 + TriModel 不可达 + 缓存有效 → 静默使用缓存 Key
- [ ] 首次启动 + TriModel 不可达 + 无缓存 → chat 功能禁用，返回友好错误
- [ ] 后台 15 分钟刷新 → Key 更新后热生效（无需重启 TriLC）
- [ ] ★ 启动时刷新时间有随机偏移（stagger 0–60s），避免四端惊群

### Step 3: TriPilot Settings→Models UI 接线

按 §3.5 实施清单 3.5.1–3.5.4（P0）+ 3.5.5–3.5.6（P1）。

**验收门禁**：
- [ ] Settings→Models 页底部出现"默认模型"下拉选择器
- [ ] 下拉仅显示已启用模型
- [ ] 选择默认模型后，重启 TriPilot，设置保持
- [ ] 未选择默认模型的新会话使用设置的默认模型
- [ ] P1：`visibleModelIds` 迁移到 `globalState`，旧 workspace config 自动迁移

### Step 4: TriPilot Chat 模型选择下拉

**无需新增代码**（现有 `lmModels` + `selectedModelId` 机制已覆盖），仅做验证：

**验收门禁**：
- [ ] Chat 界面模型下拉仅显示 Settings 中启用的模型
- [ ] 切换模型仅影响当前会话，不改变 Settings 中的默认模型
- [ ] 新会话默认使用 Settings 中设置的默认模型

---

## 5. 风险与缓解

| 风险 | 严重度 | 缓解 |
|------|--------|------|
| TriModel API server 无法处理高并发（单进程 Node.js） | 低（MVP 阶段用户量小） | **★ 修正**：配置平面是低 QPS 服务（每端每 15 分钟 1 次 Key 拉取），单进程完全足够。Phase 2 可加 `cluster` 模块或容器化多副本 |
| TriLC `getAvailableModels()` 改为 async 带来调用链改动 | 低 | 两个调用点（L520, L900）已在 async handler 中，改动安全 |
| TriPilot `visibleModelIds` 迁移到 globalState 时数据丢失 | 低 | 向后兼容迁移逻辑：首次读取时自动从 workspace config 迁移 |
| Chat 模型切换的 model 参数未传递到实际 API 调用 | 中 | 需要验证 `executeViaTriLCClient()` 路径中 `selectedModelId` 是否正确传递到 TriLC → **★ 修正**：不再经过 TriLC→TriModel 代理，改为各端直连 Provider。需验证 modelId 正确传递到 Provider API |
| TriModel API server 未经过压力测试 | 低 | MVP 阶段先上线，通过 TriTest 做 smoke test；压力测试排入 Phase 2 |
| **★ 新增**：四端 Key 缓存实现不一致导致安全漏洞（Key 明文泄露） | **高** | CTO 制定统一 Key 存储规范（见 §7.4），要求各端实现加密或 OS 原生安全存储 |
| **★ 新增**：Key 经网络传输时被中间人窃取 | 中 | Phase 1 仅监听 `127.0.0.1`，Key 不离开本机；Phase 2 公网部署时强制 TLS |
| **★ 新增**：启动时四端同时拉取 Key 造成惊群效应 | 低 | Stagger 随机偏移 0–60s（见 §2.4.1 + §8.3），Key 体量 < 1KB，不会成为瓶颈 |
| **★ 新增**：缓存 Key 泄露后攻击者直连 Provider 滥用 | 中 | Key 缓存文件加密存储 + 600 权限；Phase 2 可考虑短期 Key + 自动轮换 |

---

## 6. 配置平面架构修正（CPO 附录A 落实）

### 6.1 架构变更概览

CPO 于 `cpo-trimodel-1b`（2026-07-20 附录A）裁决：**TriModel API 服务 = 配置分发服务，不代理业务流量。**

| 维度 | 原设计（代理模型，§1–§5 原始版） | 修正后（配置平面，本 §6–§8） |
|------|-------------------------------|---------------------------|
| TriModel 角色 | API 代理网关 | **纯配置分发层** |
| 业务流量路径 | 端 → TriModel → Provider | **端 → Provider（直连）** |
| API 端点 | `/v1/models` + `/v1/chat/completions` + SSE streaming | **仅配置类**：`/health`、`/v1/models`、`/v1/config/keys`、`/v1/config/keys/refresh` |
| TriModel 离线影响 | 全部不可用 | **各端仍正常工作**（Key 已缓存，直连 Provider） |
| Key 传输 | 不传输（TriModel 自己持有并使用） | **启动时拉取 + 15 分钟定时刷新**；Key 离开 TriModel 后本地加密存储 |
| Serverless 适配 | 不可行（有状态 Key pool + 长连接 SSE） | **可行**（无状态短连接，配置分发 QPS 极低） |

### 6.2 废弃项清单

| CTO 原方案章节 | 处置 | 原因 |
|---------------|------|------|
| §1.3 `POST /v1/chat/completions` | **废弃** | 配置平面不代理业务流量 |
| §1.3 SSE streaming 端点 | **废弃** | 同上；streaming 由各端直连 Provider |
| §1.3 `src/api/chat.ts` | **不创建** | 不存在 chat 代理端点 |
| §1.1 Serverless 不可行理由"有状态 Key pool + 长连接 SSE" | **作废** | 无 SSE 长连接；配置分发是无状态短连接 |
| §4 Step 1 `chat.ts` 验收门禁 | **已移除** | 替换为 `keys.ts` 验收门禁 |
| §9（原 §6）API 契约冻结含 `POST /v1/chat/completions` | **已修正** | 改为 `GET /v1/config/keys` |

### 6.3 数据流图（修正后）

```
┌─────────────────────────────────────────────────────────────────┐
│  配置平面数据流（修正后）                                          │
│                                                                  │
│  ┌──────────┐    ① GET /v1/config/keys      ┌──────────────┐   │
│  │  TriLC   │◄─────────────────────────────│  TriModel     │   │
│  │  (本地)   │    Authorization: Bearer      │  (配置平面)   │   │
│  │          │──────────────────────────────►│              │   │
│  │ Key缓存   │    ② 加密写盘 (~/.trilc/)      │  Key 来自     │   │
│  │ 24h TTL  │                               │  环境变量     │   │
│  └────┬─────┘                               └──────────────┘   │
│       │                                                        │
│       │ ③ 端直连 Provider（不经 TriModel）                       │
│       ▼                                                        │
│  ┌──────────┐                                                   │
│  │ Provider │  DeepSeek / OpenAI / Claude / TriMetaverse       │
│  │ (外部)    │                                                   │
│  └──────────┘                                                   │
│                                                                  │
│  ★ TriModel 不在业务流量路径上（不在 ③ 的链路上）                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Key 分发方案

### 7.1 设计原则

1. **启动时全量拉取**：各端启动时立即从 TriModel 拉取所有 provider 的 Key（< 1KB），用户首次 chat 零延迟
2. **定时刷新**：后台每 15 分钟拉取一次，Key 变更热生效，无需用户重启
3. **本地持久化**：Key 不可只存内存——设备重启后不应强制依赖网络
4. **加密存储**：Key 落盘必须加密或使用 OS 原生安全存储，不可明文
5. **离线容错**：TriModel 不可达时使用缓存 Key；缓存过期（>24h）+ TriModel 不可达 → chat 功能降级

### 7.2 TriModel 侧：`GET /v1/config/keys`

完整契约见 **§1.3**。

关键设计决策：

| 决策 | 选项 | 裁定 |
|------|------|------|
| Key 返回格式 | 按 provider 分组 vs 扁平列表 | **按 provider 分组**（`keys.deepseek.api_key`），便于各端按需提取 |
| 是否返回 base_url | 是 vs 否 | **是**——不同 provider base_url 不同，且 Phase 2 Key 池可能引用不同 endpoint |
| 刷新周期如何通知 | 静态 15min vs 服务端动态告知 | **服务端动态告知**（`refresh_interval_s` 字段），允许运维调整而不改客户端代码 |
| Phase 1 是否预埋 Key 池 schema | 单 Key vs 预埋数组 | **预埋数组 schema**（见 §8.4），但 Phase 1 实际只返回一个 Key |

### 7.3 消费端：TriLC Key 拉取实现

完整设计见 **§2.4**。

关键参数：

| 参数 | 值 | 说明 |
|------|-----|------|
| 拉取时机 | 启动时 + 每 15 分钟 | 对齐 `refresh_interval_s` |
| 缓存 TTL | 24 小时 | 超过后强制重新拉取，拉取失败则 chat 禁用 |
| 启动 stagger | 随机 0–60s | 避免四端同时启动时的惊群效应 |
| API 超时 | 5s | `AbortSignal.timeout(5000)` |
| 拉取失败策略 | 静默降级，使用缓存 | 不阻塞启动，后台持续重试 |

### 7.4 统一 Key 存储规范（CPO 要求单独成章）

#### 7.4.1 安全分级

| 安全等级 | 适用端 | 存储要求 |
|----------|--------|----------|
| **S1 — OS 原生安全** | PC 桌面端（TriPilot/Electron）、移动端 | 使用 OS keychain / Keychain (iOS) / EncryptedSharedPreferences (Android)。Key 不落盘为普通文件 |
| **S2 — 加密文件** | CLI（TriLC）、CI/CD runner | 文件落盘但 **必须加密**（AES-256-GCM），密钥由机器指纹派生（hostname + OS user SID + 固定 salt） |
| **S3 — 600 权限明文** | 本地 dev 环境（仅限 dev Key） | 文件系统权限 `600`（仅 owner 可读写），目录 `700`。**禁止用于生产 Key** |

#### 7.4.2 存储路径规范

| 端 | 路径 | 权限 |
|-----|------|------|
| TriLC (CLI) | `$TRILC_HOME/keys.json`（默认 `~/.trilc/keys.json`） | 加密文件（S2）+ 目录 700 |
| TriPilot (VS Code ext) | VS Code `globalState`（由 VS Code 管理加密）或 OS keychain（S1） | 由 VS Code / OS 保证 |
| TriMobile (Flutter) | `flutter_secure_storage` → iOS Keychain / Android EncryptedSharedPreferences | S1 |
| TriCade (Electron) | `electron-safeStorage` → OS keychain | S1 |

#### 7.4.3 加密方案（S2 级别）

```
加密算法：AES-256-GCM
密钥派生：PBKDF2(hostname + username_sid + fixed_salt, iterations=100000, keylen=32)
IV：随机生成，写入文件头部（前 12 字节）
认证标签：GCM 自动附加

文件格式：
[12 bytes IV][encrypted payload][16 bytes GCM auth tag]

不存储派生密钥——每次读写时重新派生。
```

**Phase 1 简化**：Phase 1 TriLC 可先以 **S3（600 权限明文）** 实现，但代码结构预留加密抽象层（`interface KeyStorage { read(): Promise<KeyCache>; write(cache: KeyCache): Promise<void> }`），Phase 2 切换到 S2 加密无需改动调用方。

#### 7.4.4 内存安全

| 措施 | 说明 |
|------|------|
| 不暴露到日志 | `console.log(keyCache)` 必须脱敏——打码 Key（`sk-****`） |
| 不序列化到 error message | `Error` 对象中不包含 Key 原文 |
| GC 前不主动清零 | Node.js 无可靠内存清零 API；Phase 2 评估 `Buffer.allocUnsafe` + `fill(0)` |
| 进程 core dump 保护 | Phase 2 考虑启动时设置 `--no-console-log` 等 flags 禁止 core dump 含 Key |

### 7.5 跨端一致性检查清单

| # | 检查项 | TriLC | TriPilot | TriCade | TriMobile |
|---|--------|-------|----------|---------|-----------|
| 1 | 启动时从 TriModel 拉取 Key | ✅ | ✅ | ✅ | ✅ |
| 2 | 15 分钟定时刷新 + stagger 随机偏移 | ✅ | ✅ | ✅ | ✅ |
| 3 | 本地持久化缓存（非纯内存） | ✅ | ✅ | ✅ | ✅ |
| 4 | Key 缓存加密或 OS 原生安全 | ✅（S2） | ✅（S1） | ✅（S1） | ✅（S1） |
| 5 | 24h TTL + 过期后强制重拉 | ✅ | ✅ | ✅ | ✅ |
| 6 | TriModel 不可达时使用缓存 Key | ✅ | ✅ | ✅ | ✅ |
| 7 | 无缓存 + TriModel 不可达 → chat 禁用 | ✅ | ✅ | ✅ | ✅ |
| 8 | 收到 429（Rate Limit）→ 自动退避 + 提示 | ✅ | ✅ | ✅ | ✅ |
| 9 | Key 不写入日志/error message | ✅ | ✅ | ✅ | ✅ |

---

## 8. Key 并发冲突评估

### 8.1 风险本质

**问题**：四端（TriLC、TriPilot、TriCade、TriMobile）同时使用**同一个** Provider Key 直连，可能触发 Provider 的 Rate Limit（RPM/TPM 限制），导致部分请求被拒绝（429）。

关键判断：**这是真实风险，但 Phase 1 实际触发概率低，不阻塞交付。**

### 8.2 风险评级矩阵

| Provider | 典型限制（个人/免费 Key） | 四端全部高频率并发 | 实际触发概率（Phase 1） | 风险评级 |
|----------|------------------------|-------------------|----------------------|---------|
| **DeepSeek** | 500 RPM / 1M TPM | PC+移动同时高频率使用可触发 | 低：当前仅 TriPilot 高频使用；TriMobile 未开发；TriLC CLI 低频；TriCade 占位 | **中**（理论）× **低**（实际） |
| **OpenAI** | 500 RPM / 200K TPM（Tier 1） | 同上 | 极低：当前不依赖 OpenAI Key | **低** |
| **Claude (Anthropic)** | 50 RPM / 40K TPM（Usage Tier 1） | **双端并发即可触发** | 极低：当前不依赖 Claude Key | **高**（理论）× **极低**（实际） |

**结论**：
- DeepSeek（当前实际使用的 provider）：Phase 1 实际并发场景 ≈ 1–2 端，远低于 500 RPM 门槛
- 风险从"需要立即解决"降级为"Phase 2 通过 Key 池机制解决"

### 8.3 Phase 1 缓解措施

| 措施 | 实现位置 | 效果 |
|------|----------|------|
| **启动时间随机偏移（stagger）** | §2.4.1 `startKeyRefreshTimer()` | 避免四端同时启动时同时拉取 Key（惊群效应缓解——但不是 Key 使用的限流） |
| **Key 使用限流（端侧）** | 各端 chat handler | 收到 429 后自动指数退避（1s → 2s → 4s → 8s，max 30s），不无限重试 |
| **友好降级提示** | 各端 UI / CLI | 429 → "模型请求过于频繁，请稍后重试"（非技术错误堆栈） |
| **不做中央限流** | — | 配置平面不应做业务流量控制；限流是 Provider 侧的职责。TriModel 不做 RPM 追踪 |
| **预埋 Key 池 schema** | §1.3 `GET /v1/config/keys` | API 响应结构预留 `keys` 对象可扩展为数组（见 §8.4），Phase 2 无需改 API 契约 |

**Phase 1 不采取的措施及理由**：

| 不采取 | 理由 |
|--------|------|
| 中央 Rate Limiter | 配置平面不应追踪业务调用频次——那是 Provider 的职责。中央限流器引入单点和复杂度，且需要各端上报调用量（违背纯配置平面定位） |
| 多 Key 购买 | 需 CFO 评估成本（CFO 尚未上岗），增加月度固定支出 |
| 按端分配不同 Key | 与 Key pool 方案语义重叠，Phase 1 单 Key 模式够用 |

### 8.4 Phase 2 Key 池 schema（预埋设计）

当前 `GET /v1/config/keys` 返回每个 provider 一个 Key：

```json
{
  "keys": {
    "deepseek": { "api_key": "sk-xxxx", "base_url": "..." }
  }
}
```

**Phase 2 升级**：将 `api_key` 扩展为数组，consumer 随机选择：

```json
{
  "keys": {
    "deepseek": {
      "api_keys": [
        { "api_key": "sk-pool-1", "base_url": "https://api.deepseek.com/v1", "quota_remaining_pct": 80 },
        { "api_key": "sk-pool-2", "base_url": "https://api.deepseek.com/v1", "quota_remaining_pct": 45 },
        { "api_key": "sk-pool-3", "base_url": "https://api.deepseek.com/v1", "quota_remaining_pct": 95 }
      ],
      "selection_strategy": "weighted_random"  // "random" | "round_robin" | "weighted_random"
    }
  }
}
```

**消费者逻辑（Phase 2）**：

```typescript
function selectKey(providerKeys: KeyInfo[]): KeyInfo {
  // 过滤出 quota > 10% 的 Key
  const available = providerKeys.filter(k => (k.quota_remaining_pct ?? 100) > 10);
  if (available.length === 0) throw new Error('All keys exhausted');
  
  // 加权随机：quota 越高的 Key 越容易被选中
  const totalWeight = available.reduce((sum, k) => sum + (k.quota_remaining_pct ?? 100), 0);
  let rand = Math.random() * totalWeight;
  for (const k of available) {
    rand -= (k.quota_remaining_pct ?? 100);
    if (rand <= 0) return k;
  }
  return available[0];
}
```

**同一会话内 Key 固定**：消费者在一次会话（进程生命周期或用户登录 session）内使用同一个 Key，避免 model conversation context 因 Key 切换而丢失。

### 8.5 Key 池运维注意事项（Phase 2）

| 事项 | 说明 |
|------|------|
| Key 来源 | 需额外购买/申请多个 Provider API Key（如 3 个 DeepSeek Key） |
| 成本评估 | 待 CFO 上岗后评估；每个额外 Key 产生独立月度费用 |
| Key 轮换 | TriModel admin 通过 `POST /v1/config/keys/refresh` 触发服务端重载；消费者在下次 15 分钟刷新时自动获得新 Key 列表 |
| 池耗尽告警 | TriModel 监控所有 Key 的 quota 状态；当所有 Key `quota_remaining_pct < 20%` 时告警运维 |
| Provider 侧监控 | 各端上报 429 事件到 TriModel（可选 telemetry），用于评估 Key 池扩容需求 |

### 8.6 并发冲突风险总结

```
Phase 1（当前 → API 就绪）
  ├── 单 Key 模式（DeepSeek × 1）
  ├── 实际并发：1–2 端（TriPilot + 偶发 CLI）
  ├── DeepSeek 限制：500 RPM → 远未触及
  ├── 缓解：stagger 启动 + 端侧 429 退避 + 友好提示
  └── 风险评估：低 → APPROVE 不阻塞交付

Phase 2（API 稳定后，约 2–3 sprint）
  ├── Key 池模式（DeepSeek × 3–5）
  ├── 加权随机分配 + 会话内固定
  ├── 需要 CFO 评估成本
  └── 风险评估：待 Key 池上线后重新评估
```

---

## 9. 发布姿态

- **Phase 1 就绪标志**：Step 1–4 + Step 2b 全部验收门禁通过
- **回滚姿态**：
  - TriModel API → 关闭服务即可，TriLC 自动 fallback 到 library（模型列表）+ 本地缓存 Key（chat）；TriPilot 无影响（仍通过 TriLC 获取模型和 Key）
  - TriLC HTTP 优先改造 → 若 API 不可用自动降级，不构成单点
  - TriPilot UI → VS Code 扩展更新即可回滚旧版
  - **★ 配置平面回滚优势**：即便 TriModel 完全宕机，各端本地缓存 Key 在 24h TTL 内仍可直连 Provider，chat 功能不受影响
- **API 契约冻结**：`GET /v1/models` 和 `GET /v1/config/keys` 的请求/响应格式在 Phase 1 上线后冻结，后续仅做向后兼容扩展。`POST /v1/config/keys/refresh` 为 admin 端点，契约可随 Phase 2 演进

---

## 10. 使用依据

| 依据 | 路径 |
|------|------|
| CPO 裁决（初始） | `trees/cpo-trimodel-deployment/ruling.md` §Q1–Q4 |
| CPO 附录A 架构修正 | `trees/cpo-trimodel-deployment/ruling.md` §附录A（`cpo-trimodel-1b`） |
| TriModel 代码 | `../TriModel/src/{client.ts, config.ts, types.ts, index.ts}` |
| TriModel 产品状态 | `../TriModel/docs/registry/product-state.md`（三层密钥模型） |
| TriModel .env.example | `../TriModel/.env.example` |
| TriLC 代码 | `../TriLC/src/server/app.ts` (L517-531, L897-910, L1653-1684) |
| TriPilot 代码 | `../TriPilot/src/extension.ts` (L1914-1952, L2376-2422, L2871-2918, L5790-5836) |
| TriPilot settings.js | `../TriPilot/media/settings.js` (L195-247, L548-618) |
| BusinessStrategy | `docs/registry/business-strategy-state.md` |
| 架构文档 | `docs/三元宇宙架构与模块说明.md` §4 |
| 中央产品状态 | `docs/registry/product-state.md`（CARRY-005 D4 多 provider 裁定；API Key 三层架构标准化） |

---

**节点 `cpo-trimodel-2b` → done**（2026-07-20 22:41）

<details>
<summary>修正摘要</summary>

- §6：配置平面架构修正 — 从代理模型纠正为纯配置分发层
- §7：Key 分发方案 — `GET /v1/config/keys` + TriLC 拉取 + 统一存储规范（含加密、跨端一致性矩阵）
- §8：并发冲突评估 — Phase 1 实际风险低（1–2 端、远低于 500 RPM），Phase 2 Key 池预埋
- §1–§5 与 chat 代理相关的部分已标记 DISCONTINUED
- §4 Step 1 改为配置平面 API，新增 Step 2b（Key 拉取 + 缓存）
- §5 风险矩阵增加 4 项配置平面特有风险
- §9 发布姿态修正（回滚优势、API 契约冻结范围）
- §10 使用依据补入 CPO 附录A、三层密钥模型、中央产品状态

</details>

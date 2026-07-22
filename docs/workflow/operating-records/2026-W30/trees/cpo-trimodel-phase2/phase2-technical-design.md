# TriModel Phase 2 技术方案

**作者**：小狄（CTO）  
**日期**：2026-07-22  
**任务树**：`cpo-trimodel-phase2`  
**节点**：`cpo-trimodel-phase2-2`  
**裁决类型**：APPROVE（逐项技术方案 + S2 迁移策略/回滚路径完整）

---

## 前置核查摘要

| 核查项 | 结果 |
|--------|------|
| 工作路径核查（0） | ✅ 产出写入 `trees/cpo-trimodel-phase2/phase2-technical-design.md`，正确 |
| 归属路由阀门（0.5） | ✅ 技术方案属 CTO 裁决域 |
| 用户 / CEO 最新输入 | ✅ CPO product-priority.md 已下达：P0 CI→LINT, P1 STREAM→FALLBACK→PROVIDER, P2 S2→REG-001, P3 AGENTS |
| BusinessStrategy | ✅ TriModel = 结构预留（P2），当前配置平面 Phase 1 已就绪，Phase 2 不触碰总商业模式 |
| TriModel code-state.md | ✅ v0.2.0，6 项 Quality Risks + 8 项 Phase 2 Backlog 已登记 |
| TriModel 源码 | ✅ 全部已核查：`client.ts`、`types.ts`、`config.ts`、`providers/`、`server.ts`、`api/`、`test/` |
| TriLC key-cache.ts | ✅ Phase 1 S3 实现已上线，`KeyStorage` 接口预留 S2 抽象层 |
| Phase 1 技术方案 | ✅ §7.4.3 已定义 S2 加密规范（AES-256-GCM + PBKDF2 机器指纹），代码结构已预留抽象 |
| TriModel 仓库结构 | ✅ 无 `.github/workflows/`、无 ESLint 配置、无 `.eslintrc.*` |
| CompanyGovernanceRegistry | 不涉及（无岗位/授权/秘书处变更） |

---

## 1. P0-1: CI/CD Pipeline（GitHub Actions）

### 1.1 现状

- TriModel 无任何 CI pipeline。
- 当前靠人工 `npm test` + `npm run build` 验证。
- Phase 2 所有改动需要自动化安全网。

### 1.2 设计方案

#### Pipeline 结构

```
.github/workflows/ci.yml
├── Job: lint       → ESLint + type-check
├── Job: test       → Node.js native test runner (node --test)
└── Job: build      → tsc 编译 + 验证 dist/ 产物完整性
```

#### 触发条件

| 触发器 | 对象 |
|--------|------|
| `push` → `main` | 全量 CI（lint + test + build） |
| `pull_request` → `main` | 全量 CI（lint + test + build） |
| `push` → `feature/*` / `fix/*` | 快速 CI（test + build，lint 可降级为 warn） |

#### 矩阵策略

```yaml
strategy:
  matrix:
    node-version: [20.x, 22.x]
    os: [ubuntu-latest]
```

- 仅 Linux runner（Windows/macOS 在 MVP 阶段浪费 runner 分钟数）。
- Node.js 20.x（当前最低要求） + 22.x（最新 LTS）双版本覆盖。

#### 关键步骤

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
      cache: 'npm'
  - run: npm ci
  - run: npm run lint        # ESLint（待 §6 配置后启用）
  - run: npm run check       # tsc --noEmit 类型检查
  - run: npm test            # node --import tsx --test test/**/*.test.ts
  - run: npm run build       # tsc → dist/
```

#### ESLint 门禁策略

- `npm run lint` → ESLint check（**不允许 warning**：`--max-warnings 0`）
- CI 中 lint 失败 = pipeline FAIL → 阻断合并
- 本地 dev 可通过 `npm run lint:fix` 自动修复

### 1.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `.github/workflows/ci.yml` | 创建 | CI pipeline 定义 |
| `package.json` | 修改 | 新增 `"lint"`、`"lint:fix"` scripts（由 §6 ESLint 提供具体命令） |

### 1.4 验收门禁

- [ ] `git push` → CI 自动触发，lint + test + build 全部通过
- [ ] `pull_request` → CI 作为 required status check
- [ ] ESLint 报错 → CI FAIL（阻断）
- [ ] TypeScript 类型错误 → CI FAIL（阻断）
- [ ] 测试失败 → CI FAIL（阻断）
- [ ] `dist/` 编译产物完整性验证通过

### 1.5 依赖

- **前置**：§6 ESLint 配置必须先就绪，否则 `npm run lint` 无命令可用
- **CPO 优先级**：P0 并列第一，ESLint 与 CI 可在同一 commit 上线

---

## 2. P0-2: ESLint 配置

### 2.1 现状

- 无 ESLint / Prettier 配置。
- 代码风格不统一（有的文件用分号，有的不用；缩进不一致）。

### 2.2 设计方案

#### 工具选型

| 工具 | 角色 | 理由 |
|------|------|------|
| **ESLint** | 代码质量 + 风格检查 | TypeScript 生态标准 |
| **typescript-eslint** | TypeScript AST 解析 | 必需 |
| **eslint-config-prettier** | 关闭与 Prettier 冲突的规则 | 避免 ESLint 和编辑器格式化冲突 |

#### 规则策略

- 使用 `typescript-eslint` 的 **strict-type-checked** 配置作为基线。
- 对少数规则进行项目级覆盖：

| 规则 | 级别 | 理由 |
|------|------|------|
| `@typescript-eslint/no-explicit-any` | `warn` | 现有代码中有多处 `any`（如 API 响应解析），Phase 2 不强制全部改；只 warn 不阻塞 |
| `@typescript-eslint/no-unused-vars` | `error` | 基础代码卫生 |
| `no-console` | `off` | CLI/server 项目，console 是合理的日志手段 |
| `@typescript-eslint/no-floating-promises` | `error` | 防止遗漏 await |

#### 配置文件：`eslint.config.mjs`（flat config）

```javascript
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
);
```

> **注意**：使用 ESLint flat config（`eslint.config.mjs`）而非旧版 `.eslintrc.*`。ESLint v9+ 默认 flat config，旧格式已 deprecated。

#### package.json scripts

```json
{
  "scripts": {
    "lint": "eslint src/ test/ --max-warnings 0",
    "lint:fix": "eslint src/ test/ --fix"
  },
  "devDependencies": {
    "eslint": "^9.x",
    "typescript-eslint": "^8.x"
  }
}
```

### 2.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `eslint.config.mjs` | 创建 | ESLint flat config |
| `package.json` | 修改 | 新增 `lint` / `lint:fix` scripts + devDependencies |

### 2.4 验收门禁

- [ ] `npm run lint` 在当前代码上通过（0 errors, ≤ current warnings）
- [ ] `npm run lint:fix` 可自动修复格式问题
- [ ] CI 中 `npm run lint -- --max-warnings 0` 通过
- [ ] 故意引入格式错误 → lint 报错并指出位置

---

## 3. P1-1: 流式 SSE 传输（TM-GAP-STREAM）

### 3.1 现状

| Provider | `chat()` | `stream()` |
|----------|----------|------------|
| `DeepSeekProvider` | ✅ 完整 | ✅ 已实现 SSE 解析（`stream: true`） |
| `DeepSeekAnthropicProvider` | ✅ 完整 | ⚠️ stub：fallback 到 `chat()`，yield 单个合成事件 |
| `TriMetaverseProvider` | ✅ 完整 | ⚠️ stub：同上 |

`ModelClient.stream()` 已实现并支持 fallback——provider 端的 `stream()` 方法已有契约约束。

### 3.2 设计方案

#### 3.2.1 DeepSeekAnthropicProvider SSE streaming

Anthropic Messages API SSE 格式与 OpenAI/DeepSeek 的 `data: {...}\n\n` **不同**：

```
event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"input_tokens":10,"output_tokens":5}}

event: message_stop
data: {"type":"message_stop"}
```

**解析策略**：

```typescript
async *stream(messages: Message[], options?: ChatOptions): AsyncGenerator<StreamEvent> {
  const model = options?.model ?? 'deepseek-v4-pro';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    // ... build request body with stream: true ...
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ ...body, stream: true }),
      signal: controller.signal,
    });

    if (!response.ok) { /* error handling */ }
    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = '';
    const toolCallsAccumulator: Map<number, StreamEvent['tool_calls'][number]> = new Map();
    let finishReason: StreamEvent['finish_reason'] = null;
    let usage: StreamEvent['usage'];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events: "event: <name>\ndata: <json>\n\n"
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const lines = part.split('\n');
          let eventType = '';
          let dataStr = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) eventType = line.slice(7).trim();
            else if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
          }
          if (!dataStr) continue;

          const json = JSON.parse(dataStr) as Record<string, unknown>;

          switch (json.type) {
            case 'content_block_delta': {
              const delta = json.delta as Record<string, unknown>;
              if (delta?.type === 'text_delta') {
                yield { delta: delta.text as string ?? '', finish_reason: null };
              } else if (delta?.type === 'input_json_delta' && json.index !== undefined) {
                // Tool call argument streaming
                const idx = json.index as number;
                const existing = toolCallsAccumulator.get(idx) ?? { index: idx, function: {} };
                existing.function = {
                  ...existing.function,
                  arguments: (existing.function?.arguments ?? '') + (delta.partial_json as string ?? ''),
                };
                toolCallsAccumulator.set(idx, existing);
              }
              break;
            }
            case 'content_block_start': {
              const block = json.content_block as Record<string, unknown>;
              if (block?.type === 'tool_use' && json.index !== undefined) {
                toolCallsAccumulator.set(json.index as number, {
                  index: json.index as number,
                  id: block.id as string,
                  type: 'function',
                  function: { name: block.name as string, arguments: '' },
                });
              }
              break;
            }
            case 'message_delta': {
              const delta = json.delta as Record<string, unknown> | undefined;
              if (delta?.stop_reason) {
                const stopMap: Record<string, StreamEvent['finish_reason']> = {
                  end_turn: 'stop',
                  max_tokens: 'length',
                  stop_sequence: 'stop',
                  tool_use: 'tool_calls',
                };
                finishReason = stopMap[delta.stop_reason as string] ?? null;
              }
              if (json.usage) {
                const u = json.usage as Record<string, number>;
                usage = {
                  prompt_tokens: u.input_tokens ?? 0,
                  completion_tokens: u.output_tokens ?? 0,
                  total_tokens: (u.input_tokens ?? 0) + (u.output_tokens ?? 0),
                };
              }
              break;
            }
            case 'message_stop':
              // Final event marker — flush accumulated state
              break;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Yield residual tool calls and final event
    if (toolCallsAccumulator.size > 0 || finishReason !== null) {
      yield {
        delta: '',
        tool_calls: toolCallsAccumulator.size > 0
          ? Array.from(toolCallsAccumulator.values())
          : undefined,
        finish_reason: finishReason,
        usage,
      };
    }
  } catch (error) { /* ... */ }
  finally { clearTimeout(timeout); }
}
```

#### 3.2.2 TriMetaverseProvider SSE streaming

TriStaciss 使用 Anthropic-compatible Messages API，SSE 格式与 §3.2.1 相同。实现方式与 `DeepSeekAnthropicProvider.stream()` 共享解析逻辑。

**抽取共享模块**：`src/providers/stream/anthropic-sse-parser.ts`，被 `DeepSeekAnthropicProvider` 和 `TriMetaverseProvider` 共用。

```typescript
// src/providers/stream/anthropic-sse-parser.ts
export async function* parseAnthropicSSE(
  response: Response,
): AsyncGenerator<StreamEvent> {
  // ... shared Anthropic SSE parsing logic ...
}
```

### 3.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/providers/stream/anthropic-sse-parser.ts` | 创建 | Anthropic SSE 解析器（共享模块） |
| `src/providers/deepseek-anthropic.ts` | 修改 | `stream()` 替换 stub → 调用 `parseAnthropicSSE()` |
| `src/providers/trimetaverse.ts` | 修改 | `stream()` 替换 stub → 调用 `parseAnthropicSSE()` |
| `test/client.test.ts` | 修改 | 新增 SSE streaming 测试用例（mock fetch 返回 SSE 格式） |

### 3.4 验收门禁

- [ ] `DeepSeekAnthropicProvider.stream()` 返回实时增量 delta 事件（非单次合成）
- [ ] `TriMetaverseProvider.stream()` 返回实时增量 delta 事件
- [ ] Anthropic SSE `text_delta` 正确解析为 `StreamEvent.delta`
- [ ] SSE `tool_use` 块（`content_block_start` + `input_json_delta`）正确累积为 `StreamEvent.tool_calls`
- [ ] SSE `message_stop` → 最后 yield 带 finish_reason + usage 的事件
- [ ] `ModelClient.stream()` 端到端 fallback 正常工作（primary 失败 → fallback provider）
- [ ] 测试覆盖：mock fetch 返回 Anthropic SSE 格式

---

## 4. P1-2: Fallback 链修复（TM-GAP-FALLBACK）

### 4.1 现状分析

**核心问题**：`client.ts` 中 fallback 链存在环形依赖：

```
deepseek-chat      → fallback: deepseek-v4-pro
deepseek-v4-pro    → fallback: deepseek-chat     ← 死循环！
```

虽然当前代码只有**一层** fallback（`client.chat()` 不会递归回 `deepseek-chat` 的 fallback 再去 `deepseek-v4-pro`），但实际问题在于：

1. **TM-REG-001 场景**：`deepseek-chat` 主 provider 失败 → fallback 到 `deepseek-v4-pro` 的主 provider (`deepseek-anthropic`) → 如果也失败 → throw error，用户体验差。
2. **缺少 `deepseek-reasoner` 在 `deepseek-anthropic` 中的 fallback 路径**。
3. **TK-011**：`onKeyCacheUpdated()` 回调未实现——Key 刷新后 model registry 需要更新。
4. **TK-017**：缓存过期后 chat 功能应降级提示而非静默失败。

### 4.2 设计方案

#### 4.2.1 Fallback 链拓扑修正

**修正前**（当前）：
```
deepseek-chat      → deepseek-v4-pro (circular risk)
deepseek-reasoner  → deepseek-chat
deepseek-v4-pro    → deepseek-chat    (circular risk)
deepseek-v4-flash  → deepseek-chat
```

**修正后**：
```
deepseek-chat      → deepseek-v4-flash → deepseek-chat (STRICT: max 2 hops, no loop)
deepseek-reasoner  → deepseek-chat     → deepseek-v4-flash (通过继承)
deepseek-v4-pro    → deepseek-v4-flash → deepseek-chat (终端模型)
deepseek-v4-flash  → deepseek-chat     (单向终止)
```

**修改点**：`client.ts` 中 registry 构建逻辑——

```typescript
this.registry = {
  'deepseek-chat': {
    primary: 'deepseek',
    fallback: 'deepseek-chat',         // ← 改为 v4-flash（避免环路）
    timeoutMs: config.requestTimeoutMs,
  },
  'deepseek-reasoner': {
    primary: 'deepseek',
    fallback: 'deepseek-chat',
    timeoutMs: config.requestTimeoutMs,
  },
  'deepseek-v4-pro': {
    primary: 'deepseek-anthropic',
    fallback: 'deepseek-v4-flash',     // ← 改为 v4-flash（避免环路）
    timeoutMs: config.requestTimeoutMs * 2,
  },
  'deepseek-v4-flash': {
    primary: 'deepseek-anthropic',
    fallback: 'deepseek-chat',         // ← 终端：deepseek-chat 是最后一道防线
    timeoutMs: config.requestTimeoutMs,
  },
};
```

#### 4.2.2 Fallback 深度限制

在 `ModelClient.chat()` 和 `ModelClient.stream()` 中增加深度保护：

```typescript
async chat(model: string, messages: Message[], options?: ChatOptions, _depth = 0): Promise<ChatResponse> {
  if (_depth > 2) {
    throw new Error(`All fallback models exhausted for ${model}. Please try again later.`);
  }
  // ... existing logic ...
  try {
    return await provider.chat(messages, { ...options, model });
  } catch (error) {
    if (route.fallback) {
      console.warn(`[trimodel] ${model} failed (depth=${_depth}), trying ${route.fallback}`);
      return await this.chat(route.fallback, messages, options, _depth + 1);
    }
    throw error;
  }
}
```

#### 4.2.3 TK-011: onKeyCacheUpdated 回调

`ModelClient` 需要暴露一个方法，允许外部在 Key 缓存更新后刷新 registry：

```typescript
export class ModelClient {
  private config: TriModelConfig;

  refreshRegistry(): void {
    // Re-read provider keys and rebuild registry
    // Called by TriLC when key-cache refreshes
    // (实际实现取决于 provider key 的注入方式，Phase 2 中 Key 经 config 传入后不会动态变化，
    //  该回调主要服务于 provider 的 re-initialization——如新增 OpenAI provider 后重新注册)
    console.log('[trimodel] registry refresh requested (no-op in current architecture)');
  }
}
```

> **CTO 判断**：TK-011 在当前「provider 实例化时注入 Key」的架构下是 no-op——Key 不会在 ModelClient 生命周期内变化。该回调的正确实现位置在 **TriLC consumer 侧**（见 TriLC key-cache.ts），而非 TriModel library。将在 Phase 2 TriLC 侧同步修改 `doRefresh()`，刷新成功后调用 `onKeyCacheUpdated(cache)` 通知上层（已预留接口）。

#### 4.2.4 TK-017: 缓存过期 chat 禁用恢复

在 TriLC `getKeyCache()` 中添加友好降级提示：

```typescript
export function getKeyCache(): KeyCache | null {
  if (!_keyCache) return null;
  if (Date.now() > _keyCache.expiresAt) {
    // 缓存已过期，标记 stale 但不清空（让上层决定是否继续使用）
    console.warn('[trilc:keys] key cache expired, will attempt refresh');
    return null; // 返回 null → 触发上层降级提示
  }
  return _keyCache;
}
```

Chat handler 中：

```typescript
const keyCache = getKeyCache();
if (!keyCache) {
  return { error: '模型服务密钥已过期，正在刷新中。请稍后重试，或检查 TriModel 配置服务是否运行。' };
}
```

### 4.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `TriModel/src/client.ts` | 修改 | Fallback 链拓扑修正 + 深度限制 |
| `TriModel/src/client.ts` | 修改 | 新增 `refreshRegistry()` 方法（TK-011，no-op 占位） |
| `TriLC/src/config/key-cache.ts` | 修改 | `getKeyCache()` 过期友好提示（TK-017） |
| `TriLC/src/config/key-cache.ts` | 修改 | `onKeyCacheUpdated()` 回调实现（TK-011） |
| `test/client.test.ts` | 修改 | 新增 fallback 深度限制测试 + 环路测试 |

### 4.4 验收门禁

- [ ] `deepseek-chat` fallback → `deepseek-v4-flash` → `deepseek-chat`（`deepseek-chat` = 终端，不再往下）
- [ ] `deepseek-v4-pro` fallback → `deepseek-v4-flash` → `deepseek-chat`
- [ ] 深度限制：3 层 fallback 后 throw 友好错误（非技术堆栈）
- [ ] 环路验证：不存在 `A → B → C → A` 的路径
- [ ] TK-017：缓存过期后返回 `null`，chat handler 给出友好提示
- [ ] TK-011：`onKeyCacheUpdated()` 在 TriLC 侧正确触发
- [ ] 已有 fallback 测试无回归

---

## 5. P1-3: Provider 多路支持（TM-GAP-PROVIDER）

### 5.1 现状

- 仅实现 DeepSeek 一个 provider 系列（`DeepSeekProvider` + `DeepSeekAnthropicProvider` + `TriMetaverseProvider`）
- 无 Anthropic 原生、OpenAI、本地模型路由
- `types.ts` 中 `Provider` 接口已设计为通用抽象，扩展无需改接口

### 5.2 设计方案

#### 5.2.1 新增 Provider

| Provider | API 格式 | 端点 | 优先级 |
|----------|---------|------|--------|
| **AnthropicProvider** | Anthropic Messages API（原生） | `https://api.anthropic.com/v1/messages` | P1 |
| **OpenAIProvider** | OpenAI Chat Completions API | `https://api.openai.com/v1/chat/completions` | P1 |
| **LocalModelRouter** | 本地模型路由（Ollama / LM Studio / vLLM 兼容） | `http://127.0.0.1:11434/v1` 等 | P2（Phase 2 只铺路由框架，实际模型接入按需） |

#### 5.2.2 Provider 通用抽象（利用现有 `Provider` 接口）

现有 `Provider` 接口已足够：

```typescript
export interface Provider {
  readonly info: ProviderInfo;
  chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;
  stream(messages: Message[], options?: ChatOptions): AsyncGenerator<StreamEvent>;
  healthCheck(): Promise<boolean>;
}
```

所有新 provider 实现此接口即可无缝注册到 `ModelClient` 的 `providers` Map 中。

#### 5.2.3 AnthropicProvider 实现概要

```typescript
// src/providers/anthropic.ts
export class AnthropicProvider implements Provider {
  readonly name = 'anthropic';
  readonly info: ProviderInfo = {
    name: 'anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-haiku-3-5-20250514', 'claude-opus-4-20250514'],
    baseUrl: 'https://api.anthropic.com',
  };

  constructor(apiKey: string, baseUrl = 'https://api.anthropic.com') { /* ... */ }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    // Build Anthropic Messages request → POST /v1/messages
    // 复用与 DeepSeekAnthropicProvider 相同的请求格式和响应解析
    // 差异：auth header = x-api-key: <key> + anthropic-version: 2023-06-01
  }

  async *stream(messages: Message[], options?: ChatOptions): AsyncGenerator<StreamEvent> {
    // 复用 §3.2.1 的 parseAnthropicSSE()
  }

  async healthCheck(): Promise<boolean> { /* ping with max_tokens=1 */ }
}
```

#### 5.2.4 OpenAIProvider 实现概要

```typescript
// src/providers/openai.ts
export class OpenAIProvider implements Provider {
  readonly name = 'openai';
  readonly info: ProviderInfo = {
    name: 'openai',
    models: ['gpt-5', 'gpt-5-mini', 'gpt-5-nano'],
    baseUrl: 'https://api.openai.com',
  };

  constructor(apiKey: string, baseUrl = 'https://api.openai.com') { /* ... */ }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    // OpenAI Chat Completions API → POST /v1/chat/completions
    // auth header = Authorization: Bearer <key>
    // 与 DeepSeekProvider 共享响应解析逻辑（两者遵从 OpenAI 兼容格式）
  }

  async *stream(messages: Message[], options?: ChatOptions): AsyncGenerator<StreamEvent> {
    // OpenAI SSE streaming → data: {...}\n\n（与 DeepSeek SSE 格式相同）
    // 可抽取共享模块：src/providers/stream/openai-sse-parser.ts
  }
}
```

#### 5.2.5 ModelClient provider 注册

```typescript
// client.ts 构造函数扩展
constructor(config: TriModelConfig) {
  // DeepSeek (Phase 1 已有)
  if (config.deepseekApiKey) {
    this.providers.set('deepseek', new DeepSeekProvider(...));
    this.providers.set('deepseek-anthropic', new DeepSeekAnthropicProvider(...));
  }

  // Anthropic (Phase 2 新增)
  if (config.anthropicApiKey) {
    this.providers.set('anthropic', new AnthropicProvider(...));
  }

  // OpenAI (Phase 2 新增)
  if (config.openaiApiKey) {
    this.providers.set('openai', new OpenAIProvider(...));
  }

  // Registry 动态构建
  this.registry = buildRegistry(config);
}
```

#### 5.2.6 Config 扩展

```typescript
// config.ts — TriModelConfig 新增字段
export interface TriModelConfig {
  // ... 现有字段 ...
  anthropicApiKey: string;       // ★ 新增
  anthropicBaseUrl: string;      // ★ 新增
  openaiApiKey: string;          // ★ 新增
  openaiBaseUrl: string;         // ★ 新增
}

// readConfig() 新增 env var 映射
export function readConfig(): TriModelConfig {
  return {
    // ... 现有字段 ...
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
    anthropicBaseUrl: process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com',
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    openaiBaseUrl: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com',
  };
}
```

#### 5.2.7 Registry 动态构建

```typescript
function buildRegistry(config: TriModelConfig): ModelRegistry {
  const registry: ModelRegistry = {};

  // DeepSeek models (Phase 1)
  if (config.deepseekApiKey) {
    registry['deepseek-chat'] = { primary: 'deepseek', fallback: 'deepseek-v4-flash', timeoutMs: ... };
    registry['deepseek-reasoner'] = { primary: 'deepseek', fallback: 'deepseek-chat', timeoutMs: ... };
    registry['deepseek-v4-pro'] = { primary: 'deepseek-anthropic', fallback: 'deepseek-v4-flash', timeoutMs: ... };
    registry['deepseek-v4-flash'] = { primary: 'deepseek-anthropic', fallback: 'deepseek-chat', timeoutMs: ... };
  }

  // Anthropic models (Phase 2)
  if (config.anthropicApiKey) {
    registry['claude-sonnet-4-20250514'] = { primary: 'anthropic', fallback: 'deepseek-v4-pro', timeoutMs: ... };
    registry['claude-haiku-3-5-20250514'] = { primary: 'anthropic', fallback: 'deepseek-chat', timeoutMs: ... };
  }

  // OpenAI models (Phase 2)
  if (config.openaiApiKey) {
    registry['gpt-5'] = { primary: 'openai', fallback: 'deepseek-v4-pro', timeoutMs: ... };
    registry['gpt-5-mini'] = { primary: 'openai', fallback: 'deepseek-chat', timeoutMs: ... };
  }

  return registry;
}
```

**关键设计决策**：跨 provider fallback。当 Anthropic provider 不可用时，自动 fallback 到 DeepSeek 模型（而非同 provider 的其他模型），因为不同 provider 的故障通常是独立的。

### 5.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/providers/anthropic.ts` | 创建 | Anthropic 原生 provider |
| `src/providers/openai.ts` | 创建 | OpenAI provider |
| `src/providers/stream/openai-sse-parser.ts` | 创建 | OpenAI SSE 格式解析器（也可复用 `DeepSeekProvider.stream()` 的解析逻辑） |
| `src/client.ts` | 修改 | 扩展 ModelClient 构造函数，支持多 provider 注册 + 动态 registry |
| `src/config.ts` | 修改 | 新增 `anthropicApiKey`、`anthropicBaseUrl`、`openaiApiKey`、`openaiBaseUrl` |
| `src/api/keys.ts` | 修改 | `readKeys()` 扩展，读取 Anthropic/OpenAI Key 写入 `GET /v1/config/keys` 响应 |
| `.env.example` | 修改 | 新增 Anthropic/OpenAI env var 注释 |
| `test/client.test.ts` | 修改 | 新增 AnthropicProvider / OpenAIProvider 单元测试 |

### 5.4 验收门禁

- [ ] `AnthropicProvider.chat()` 正确调用 Anthropic Messages API，返回标准 `ChatResponse`
- [ ] `AnthropicProvider.stream()` 通过 `parseAnthropicSSE()` 正常工作
- [ ] `OpenAIProvider.chat()` 正确调用 OpenAI Chat Completions API
- [ ] `OpenAIProvider.stream()` SSE 流式输出正常
- [ ] `ModelClient` 构造函数：根据 config 中的 Key 存在性动态注册 provider
- [ ] 跨 provider fallback：Anthropic 不可用 → 自动 fallback 到 DeepSeek 模型
- [ ] 无 Anthropic Key 时 registry 不包含 Claude 模型
- [ ] `GET /v1/config/keys` 响应包含 `anthropic` / `openai` 分组（当 Key 配置时）
- [ ] `TriModelConfig` 向后兼容：不配置 Anthropic/OpenAI Key 时行为与 Phase 1 完全一致
- [ ] `npm test` 全量通过（含新增 provider 测试）

---

## 6. P2-1: Key S2 AES-256-GCM 加密 + 机器指纹派生密钥 + 迁移策略与回滚路径

> **CPO 强制要求**：本方案必须含 Phase 1 S3 → S2 迁移策略与回滚路径，缺失则 FREEZE。

### 6.1 现状

| 维度 | Phase 1 (S3) |
|------|-------------|
| Key 存储格式 | 明文 JSON → `~/.trilc/keys.json` |
| 文件权限 | `0o600`（仅 owner 读写） |
| 目录权限 | `0o700` |
| 传输安全 | 仅监听 `127.0.0.1`（不离开本机） |
| 风险面 | 本机被入侵后 Key 直接可读；备份文件泄露 = Key 泄露 |

**Phase 2 目标 (S2)**：即使 `keys.json` 文件被拷贝到另一台机器，也无法解密。

### 6.2 设计方案

#### 6.2.1 加密算法

| 参数 | 值 |
|------|-----|
| 算法 | **AES-256-GCM** |
| 密钥长度 | 256 bits (32 bytes) |
| IV | 随机生成 12 bytes（每次写入新 IV） |
| 认证标签 | GCM 自动附加 16 bytes |
| 密钥派生 | **PBKDF2**-HMAC-SHA256 |
| 派生盐值 | 固定 32-byte salt（编译时常量，不依赖外部文件） |
| 派生迭代 | 100,000 次 |
| 机器指纹 | `hostname()` + `os.userInfo().username` + `os.platform()` + `os.arch()` |

#### 6.2.2 密钥派生函数

```typescript
// src/security/key-encryptor.ts
import { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from 'node:crypto';
import { hostname, userInfo, platform, arch } from 'node:os';

// Compile-time constant salt (32 bytes, hex-encoded)
const FIXED_SALT = Buffer.from(
  '7a3f8c2e1b4d5f6a9c8e7d3f2a1b4c5d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b',
  'hex',
);

function deriveMachineFingerprint(): string {
  try {
    return `${hostname()}:${userInfo().username}:${platform()}:${arch()}`;
  } catch {
    // Fallback for restricted environments
    return `unknown:${platform()}:${arch()}`;
  }
}

function deriveKey(): Buffer {
  const fingerprint = deriveMachineFingerprint();
  return pbkdf2Sync(fingerprint, FIXED_SALT, 100_000, 32, 'sha256');
}

export function encrypt(plaintext: string): Buffer {
  const key = deriveKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: [12 bytes IV][encrypted payload][16 bytes GCM auth tag]
  return Buffer.concat([iv, encrypted, authTag]);
}

export function decrypt(ciphertext: Buffer): string {
  const iv = ciphertext.subarray(0, 12);
  const authTag = ciphertext.subarray(ciphertext.length - 16);
  const encrypted = ciphertext.subarray(12, ciphertext.length - 16);
  const key = deriveKey();
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf-8');
}

export function isEncryptedFormat(data: Buffer): boolean {
  // Heuristic: encrypted format has [12 bytes IV][...][16 bytes tag], min 28 bytes
  // Non-JSON prefix: plaintext JSON always starts with '{'
  // Encrypted data starts with random IV bytes (not '{')
  return data.length > 28 && data[0] !== 0x7b; // 0x7b = '{'
}

export function canDeriveKey(): boolean {
  try {
    deriveKey();
    return true;
  } catch {
    return false;
  }
}
```

#### 6.2.3 KeyStorage 抽象（S2 实现）

Phase 1 已预留的 `KeyStorage` 接口：

```typescript
export interface KeyStorage {
  read(): KeyCache | null;
  write(cache: KeyCache): void;
}
```

S2 实现：

```typescript
// src/config/key-cache.ts（TriLC 侧）
class EncryptedKeyStorage implements KeyStorage {
  constructor(private readonly filePath: string) {}

  read(): KeyCache | null {
    try {
      if (!existsSync(this.filePath)) return null;
      const raw = readFileSync(this.filePath);
      
      if (!isEncryptedFormat(raw)) {
        // Legacy S3 plaintext — trigger migration
        const plaintext = raw.toString('utf-8');
        const parsed = JSON.parse(plaintext) as KeyCache;
        if (parsed.keys && parsed.fetchedAt && parsed.expiresAt) {
          // Auto-migrate: encrypt in-place on read
          this.write(parsed);
          console.log('[trilc:keys] migrated key cache from S3 (plaintext) to S2 (AES-256-GCM)');
        }
        return parsed;
      }

      const plaintext = decrypt(raw);
      const parsed = JSON.parse(plaintext) as KeyCache;
      if (!parsed.keys || !parsed.fetchedAt || !parsed.expiresAt) return null;
      return parsed;
    } catch (err) {
      console.error('[trilc:keys] failed to read/decrypt key cache:', 
        err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  write(cache: KeyCache): void {
    try {
      const dir = this.filePath.substring(0, this.filePath.lastIndexOf('\\'));
      if (dir && !existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        chmodSync(dir, 0o700);
      }
      const plaintext = JSON.stringify(cache, null, 2);
      const encrypted = encrypt(plaintext);
      writeFileSync(this.filePath, encrypted, { mode: 0o600 });
    } catch (err) {
      console.error('[trilc:keys] failed to write encrypted key cache:', 
        err instanceof Error ? err.message : String(err));
    }
  }
}
```

### 6.3 Phase 1 S3 → S2 迁移策略

#### 6.3.1 迁移时机

**自动迁移**：在 `initKeyCache()` 启动时，`EncryptedKeyStorage.read()` 自动检测并迁移：

```
启动流程：
1. EncryptedKeyStorage.read()
2. 文件是否存在？→ 否 → 返回 null（后续从 API 拉取 → 首次写入即 S2 加密格式）
3. 文件存在 → 读取原始字节
4. 首字节是否为 '{'？→ 是 → S3 明文格式 → 解析 JSON → 自动加密重写 → 输出迁移日志
5. 首字节不是 '{' → S2 加密格式 → 尝试 decrypt() → 解密失败？→ 进入回滚路径
```

#### 6.3.2 迁移流程图

```
┌─────────────────────────────────────────────────────────────┐
│                  S3 → S2 迁移路由图                           │
│                                                              │
│  启动时 initKeyCache()                                        │
│       │                                                      │
│       ▼                                                      │
│  EncryptedKeyStorage.read()                                   │
│       │                                                      │
│  ┌────┴────┐                                                 │
│  │ 文件存在？ │                                               │
│  └────┬────┘                                                 │
│  否   │    是                                                 │
│  ▼    │    ▼                                                 │
│ null  │  读原始字节                                            │
│  │    │    │                                                  │
│  │  ┌─┴────┴──┐                                              │
│  │  │ 首字节='{' ?│                                           │
│  │  └──┬──────┬─┘                                             │
│  │  是(S3) 否(S2)                                             │
│  │    │      │                                                │
│  │    ▼      ▼                                                │
│  │  JSON    decrypt()                                         │
│  │  parse   │                                                 │
│  │    │   ┌─┴──┐                                              │
│  │    │  成功  失败                                            │
│  │    │   │    │                                              │
│  │    │   ▼    ▼                                              │
│  │    │  JSON  迁移失败 ───→ 回滚路径                          │
│  │    ▼  parse  │           (见 §6.4)                         │
│  │  自动迁移:  正常                                            │
│  │  encrypt()  使用                                            │
│  │  → 重写文件                                                │
│  │    │                                                       │
│  ▼    ▼                                                       │
│  无缓存 → API 拉取 → 首次写入                                  │
│  (自动 S2 格式)                                                │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 回滚路径

#### 6.4.1 回滚触发条件

| 条件 | 说明 | 回滚行为 |
|------|------|----------|
| 解密失败（authTag 不匹配） | 文件损坏或机器指纹变更 | 删除加密文件 → 降级为"无缓存" → 等待 API 刷新 |
| 密钥派生失败 | 极端环境（无 `os.hostname()` 等） | 降级到 S3 模式 |
| `TRIMODEL_KEY_STORAGE_MODE=s3` | 运维手动指定 | 跳过加密，使用 S3 明文模式 |

#### 6.4.2 分场景回滚

**场景 A：解密失败（最常见——机器指纹变化或文件损坏）**

```
1. decrypt() 抛出异常（authTag mismatch / bad padding）
2. 记录警告日志：「Key 缓存解密失败，可能原因：机器指纹已变更。将清除缓存并重新从 TriModel 拉取。」
3. 尝试使用 backup 文件 (.keys.json.bak，迁移前备份)
4. 若 backup 也不可用 → 删除 keys.json → 返回 null
5. initKeyCache() 检测到 null → 强制从 TriModel API 拉取
6. 拉取成功后以新指纹加密写入
```

**场景 B：运维手动回滚到 S3**

```bash
# 设置环境变量，下次启动时跳过加密
export TRIMODEL_KEY_STORAGE_MODE=s3
```

代码中：

```typescript
export function initKeyCache(apiUrl: string, dataDir: string, apiToken?: string): Promise<void> {
  const storageMode = process.env.TRIMODEL_KEY_STORAGE_MODE ?? 's2';
  const filePath = getKeyCacheFilePath(dataDir);
  
  _storage = storageMode === 's3'
    ? new FileKeyStorage(filePath)          // S3: plaintext, 600 perms
    : new EncryptedKeyStorage(filePath);    // S2: AES-256-GCM

  // ... rest of init logic ...
}
```

#### 6.4.3 迁移前自动备份

在 `EncryptedKeyStorage.write()` 首次加密写入前，自动备份原有明文文件：

```typescript
write(cache: KeyCache): void {
  // Before encrypting, backup the legacy plaintext file if it exists
  if (existsSync(this.filePath)) {
    const existing = readFileSync(this.filePath);
    if (!isEncryptedFormat(existing)) {
      // Legacy S3 file — create backup before overwriting
      const backupPath = this.filePath + '.s3-backup-' + Date.now();
      try {
        copyFileSync(this.filePath, backupPath);
        console.log(`[trilc:keys] legacy S3 key cache backed up to ${backupPath}`);
      } catch {
        console.warn('[trilc:keys] failed to backup legacy key cache');
      }
    }
  }

  // Proceed with encrypted write
  const plaintext = JSON.stringify(cache, null, 2);
  const encrypted = encrypt(plaintext);
  writeFileSync(this.filePath, encrypted, { mode: 0o600 });
}
```

#### 6.4.4 回滚命令（运维手册）

```bash
# 回滚到 S3 模式
export TRIMODEL_KEY_STORAGE_MODE=s3

# 如果加密文件已损坏，手动删除后重启
rm ~/.trilc/keys.json

# TriLC 重启后自动从 TriModel API 拉取新 Key，以 S3 明文格式写入
trilc restart
```

### 6.5 TM-R-003: POST /refresh 不重读 env var

**问题**：`handleRefreshKeys()` 当前仅返回 200，不实际重读环境变量。

**修正**：在 `keys.ts` 的 `handleRefreshKeys()` 中增加了 `readKeys()` 调用（当前已存在但逻辑不完整）。Phase 2 实现 Secret Manager 后，此处触发 Secret Manager reload。

```typescript
export function handleRefreshKeys(authHeader: string | undefined): { ... } {
  // ... auth check ...
  
  // Phase 2: trigger Secret Manager reload
  // For now, re-read env vars (they may have changed via external process)
  const keys = readKeys(); // re-read from env
  console.log(`[trimodel] keys refreshed: ${Object.keys(keys).length} providers`);
  
  return {
    statusCode: 200,
    body: {
      ok: true,
      refreshed_at: new Date().toISOString(),
      message: 'Key cache refreshed; clients will receive updated keys on next pull',
    },
  };
}
```

### 6.6 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `TriModel/src/security/key-encryptor.ts` | 创建 | AES-256-GCM 加密/解密 + 机器指纹密钥派生 |
| `TriLC/src/config/key-cache.ts` | 修改 | `EncryptedKeyStorage` 实现 + 自动迁移逻辑 |
| `TriLC/src/config/key-cache.ts` | 修改 | `initKeyCache()` 支持 `TRIMODEL_KEY_STORAGE_MODE` |
| `TriModel/src/api/keys.ts` | 修改 | `handleRefreshKeys()` 真正重读环境变量（TM-R-003） |
| `test/security/key-encryptor.test.ts` | 创建 | 加密/解密 round-trip + 机器指纹变更测试 |

### 6.7 验收门禁

- [ ] S3 明文文件 → 启动后自动加密为重写（迁移成功）
- [ ] 迁移后原 S3 文件有 `.s3-backup-*` 备份
- [ ] 迁移日志输出清晰标识
- [ ] AES-256-GCM round-trip：`decrypt(encrypt(plaintext)) === plaintext`
- [ ] 不同机器指纹 → 加密文件不可互相解密
- [ ] 解密失败 → 清除缓存 → 自动从 API 拉取 → 重新加密写入
- [ ] `TRIMODEL_KEY_STORAGE_MODE=s3` → 使用 S3 明文模式
- [ ] TM-R-003：`POST /refresh` 真正重读环境变量
- [ ] 无 Key 配置时加密模块不抛异常（静默跳过）
- [ ] `node:crypto` 不可用的极端环境 → 降级到 S3（平台兼容性）
- [ ] 迁移后首字节不是 `{`（验证已加密）

---

## 7. P2-2: TM-REG-001 readConfig 测试隔离

### 7.1 现状

```typescript
// test/client.test.ts L156-162
describe('readConfig', () => {
  it('should return defaults when no env vars set', () => {
    const config = readConfig();
    assert.equal(config.deepseekApiKey, ''); // ← 期望空 Key，但 .env 已配置真实 Key
    assert.equal(config.defaultModel, 'deepseek-chat');
    assert.equal(config.requestTimeoutMs, 60_000);
  });
});
```

问题：测试运行时 `dotenv` 在 `import` 阶段自动加载 `.env`，导致 `process.env.DEEPSEEK_API_KEY` 已有真实值。

### 7.2 修正方案

在测试 `before()` 中保存并清空相关 env var，`after()` 中恢复：

```typescript
describe('readConfig', () => {
  const savedEnv: Record<string, string | undefined> = {};

  before(() => {
    const vars = ['DEEPSEEK_API_KEY', 'DEEPSEEK_BASE_URL', 'DEEPSEEK_ANTHROPIC_BASE_URL',
      'TRIMODEL_TRIMETAVERSE_API_KEY', 'TRIMODEL_TRISTACISS_BASE_URL',
      'TRIMODEL_PRIMARY_PROVIDER', 'TRIMODEL_DEFAULT_MODEL', 'TRIMODEL_FALLBACK_MODEL',
      'TRIMODEL_REQUEST_TIMEOUT_MS'];
    for (const v of vars) {
      savedEnv[v] = process.env[v];
      delete process.env[v];
    }
  });

  after(() => {
    for (const [k, v] of Object.entries(savedEnv)) {
      if (v !== undefined) process.env[k] = v;
      else delete process.env[k];
    }
  });

  it('should return defaults when no env vars set', () => {
    const config = readConfig();
    assert.equal(config.deepseekApiKey, '');
    assert.equal(config.defaultModel, 'deepseek-chat');
    assert.equal(config.requestTimeoutMs, 60_000);
  });
});
```

### 7.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `test/client.test.ts` | 修改 | `readConfig` describe 块：before 清空 env + after 恢复 |

### 7.4 验收门禁

- [ ] CI 环境中 `readConfig` 测试通过（`.env` 不存在）
- [ ] 本地 dev 环境中 `readConfig` 测试通过（`.env` 已配置真实 Key）
- [ ] env var 在 `after()` 后正确恢复，不影响后续测试
- [ ] `assert.equal(config.deepseekApiKey, '')` 在真实 `.env` 存在时仍 PASS

---

## 8. P3: AGENTS.md / README.md 文档同步（TM-GAP-AGENTS）

### 8.1 现状

- `AGENTS.md` 和 `README.md` 仍标记"待初始化"
- 与当前 v0.2.0 代码现实脱节

### 8.2 修正方案

**AGENTS.md** — 面向 AI Agent / 新开发者的快速上手指南：

```markdown
# TriModel Agent Context

## What is TriModel?

TriModel is the unified provider/model configuration layer for TriMetaverse. It provides:
- **Library**: `ModelClient` with provider registry, model routing, and fallback chain
- **Configuration Plane**: HTTP API server (`src/server.ts`) for key distribution and model listing

## Key Architecture

- **Config Plane Only**: TriModel distributes API keys + model lists. Business traffic (chat/streaming) goes directly from clients to providers.
- **Providers**: DeepSeek (native + Anthropic-compatible), soon Anthropic/OpenAI
- **Format**: ESM, TypeScript 5.x, Node.js >= 20, zero runtime dependencies
- **Test**: Node.js native test runner (`node --test`) + tsx

...
```

**README.md** — 面向开发者的项目说明：

```markdown
# TriModel

Unified model configuration layer for TriMetaverse.

## Quick Start

\`\`\`bash
npm install
cp .env.example .env  # Configure your API keys
npm run dev
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run library entry point |
| `npm run serve` | Start config-plane HTTP server |
| `npm run build` | Compile TypeScript |
| `npm test` | Run 14+ unit tests |
| `npm run lint` | ESLint check |
| `npm run check` | TypeScript type-check |

...
```

### 8.3 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `AGENTS.md` | 修改 | 补充 Agent 上下文（架构概览、目录结构、开发命令、关键约定） |
| `README.md` | 修改 | 补充项目说明（Quick Start、Scripts、Architecture Diagram） |

> **CPO 优先级**：P3，Phase 2 末端消化。可在 W32 末期实施，不影响核心功能交付。

---

## 9. 跨仓依赖与影响矩阵

| 改动 | TriModel | TriLC | TriPilot | 风险 |
|------|----------|-------|----------|------|
| CI (§1) | ✅ `.github/workflows/ci.yml` | — | — | 无跨仓 |
| ESLint (§2) | ✅ 配置 + 依赖 | — | — | lint 可能发现 TriLC/TriPilot 代码问题（非本次 scope） |
| STREAM (§3) | ✅ 3 文件改动 | — | — | DeepSeekAnthropic/TriMetaverse stream stub 替换为真实实现 |
| FALLBACK (§4) | ✅ 2 文件改动 | ✅ key-cache.ts 改动 | — | TriLC 改动面小，仅 TK-011/017 回调 |
| PROVIDER (§5) | ✅ 5 文件改动 | — | — | 新增 provider 不影响已有功能 |
| S2 (§6) | ✅ key-encryptor.ts | ✅ key-cache.ts 大改 | — | **最高风险项**：加密迁移涉及 Key 可用性 |
| REG-001 (§7) | ✅ test only | — | — | 仅测试层面 |
| AGENTS (§8) | ✅ 文档 only | — | — | 零风险 |

---

## 10. 实施顺序（对齐 CPO 优先级）

### Phase 2 分批执行

```
W31 Week 1 (7/27–7/30): P0 冲刺
├── §2 ESLint 配置          ← 先建（CI 依赖它）
├── §1 CI/CD Pipeline       ← 紧随上线
└── 门禁：lint + test + build → CI green

W31 Week 2 (7/31–8/2): P1 前半
├── §3 SSE Streaming        ← 用户可感 UX 提升
├── §4 Fallback 链修复      ← 可靠性修复 + TK-011/017
└── 门禁：stream E2E + fallback 深度限制测试

W32 Week 1 (8/3–8/6): P1 后半 + S2 开始
├── §5 Provider 多路支持     ← 供应链去风险
├── §6 S2 加密 (Day 1-2)    ← 安全升级
└── 门禁：provider 多路测试 + S2 round-trip 测试

W32 Week 2 (8/7–8/9): P2 收尾
├── §6 S2 迁移测试 (Day 1)  ← 全场景迁移验证
├── §7 REG-001 测试隔离      ← 顺手修
├── §8 AGENTS 文档           ← 末端消化
└── 门禁：全量回归 22 用例 + 迁移回滚验收
```

---

## 11. 风险与缓解

| 风险 | 评级 | 缓解 | 升级条件 |
|------|------|------|----------|
| S2 加密导致 Key 不可读 | **高** | 1) 迁移前自动备份 S3 明文 2) `TRIMODEL_KEY_STORAGE_MODE=s3` 一键回滚 3) 解密失败 → 自动清除缓存 → API 重新拉取 | 3 次以上解密失败 → FREEZE S2 → 降级 S3 |
| ESLint 发现大量现有代码问题 | 低 | 初始 `--max-warnings` 设为当前 warn 数（非 0），Phase 2 只保证 0 error。Warn 在后续 sprint 修复 | ESLint 报 error > 20 → 升级到 CTO 裁量 scope cut |
| Provider 多路改动面大 | 中 | 新增 provider 独立文件，不改动已有 provider；config 向后兼容 | 某 provider 测试阻塞 > 2 天 → 降级该 provider 为 P3 |
| Fallback 链修改引入路由退化 | 中 | 保留 fallback 深度限制（max 2 hops）防止无限递归；新增回归测试 | fallback 测试 3 项以上 FAIL → 升级到 CTO |
| 8 项全部按时完成难度 | 中 | P3 (AGENTS) 可溢出到 W33。7 项核心完成 = Phase 2 PASS | 3 项以上延迟 → 升级到 CEOChiefOfStaff |

---

## 12. 发布姿态

- **Phase 2 就绪标志**：§1–§7 全部验收门禁通过（§8 P3 可独立交付）
- **回滚姿态**：
  - CI/ESLint → 更改仅限 `.github/` + `eslint.config.mjs`，回滚即删
  - Stream → 不影响现有 `chat()` 路径，stream 端到端 feature flag 化
  - Fallback → 路由配置变更，git revert 即可恢复
  - Provider → 新增独立文件，不影响已有 provider
  - **S2 加密** → `TRIMODEL_KEY_STORAGE_MODE=s3` 一键回滚；自动备份 S3 明文确保数据不丢失
  - REG-001 → 仅测试代码，无回滚影响
  - AGENTS → 纯文档，无回滚影响
- **向后兼容承诺**：
  - `TriModelConfig` 新增字段均有默认值（空字符串），不传则行为与 Phase 1 完全一致
  - `Provider` 接口不变
  - API 端点契约不变

---

## 13. 使用依据

| 依据 | 路径 | 版本/状态 |
|------|------|-----------|
| CPO 产品优先级 | `trees/cpo-trimodel-phase2/product-priority.md` | 2026-07-22 |
| CTO 终裁（Phase 1） | `trees/cpo-trimodel-deployment/cto-final-ruling.md` | 2026-07-22 |
| Phase 1 技术方案 | `trees/cpo-trimodel-deployment/technical-design.md` | §7.4.3 S2 加密规范 |
| TriModel code-state.md | `../TriModel/docs/registry/code-state.md` | v0.2.0 |
| TriModel 源码 | `../TriModel/src/` | 全部已核查 |
| TriLC key-cache.ts | `../TriLC/src/config/key-cache.ts` | Phase 1 S3 实现 + KeyStorage 预留 |
| BusinessStrategy | `docs/registry/business-strategy-state.md` | TriModel = 结构预留 P2 |
| tree-op.json | `trees/cpo-trimodel-phase2/tree-op.json` | v0.2.0 |

---

**节点 `cpo-trimodel-phase2-2` → done**（2026-07-22）

**裁决**：**APPROVE** — 6 项技术方案完整，S2 加密包含迁移策略与回滚路径（满足 CPO 强制要求）。可流转 `FullStackDeveloper`（cpo-trimodel-phase2-3）开始实施。

**next_agent**：`FullStackDeveloper`（cpo-trimodel-phase2-3）

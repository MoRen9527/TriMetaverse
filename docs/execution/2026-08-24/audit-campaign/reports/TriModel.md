# TriModel 审计报告（audit-campaign-001 / AC-MODEL）

- 审计节点：AC-MODEL（角色 = CTO 安全视角，fresh 单次实例）
- 日期：2026-08-25
- 目标仓：`/srv/fleet/TriModel`（全程只读，未修改任何被审文件）

## 一、概述

TriModel 是模型接入层：对内提供配置面 HTTP 服务（server.ts，默认 127.0.0.1:3333）分发 provider 密钥（GET /v1/config/keys），对外作为客户端库经各 provider 适配器直连上游。审计焦点为配置面与 API key 分发设计安全。

核心结论：
1. **P0**：OpenAIProvider 全部请求与 TriMetaverse 流式请求的 Authorization 头被硬编码为字符串 `'******'`，上线即必然 401，属崩溃级缺陷；叠加静默 fallback 后流量会悄然改道其他 provider。
2. **P1 集中在密钥分发面设计**：单共享令牌即可一次性取走所有上游明文密钥，无 per-client 密钥、无撤销、无强制轮换；expires_at 语义错误；存在硬编码默认凭据回退。
3. 密钥加密模块（AES-256-GCM 本体正确）但 KDF 用低熵机器指纹 + 固定盐，且当前是未被引用的死代码。
4. 无密钥直接写日志的实据（src 内 console 输出均只含计数/模型名）；服务端 500 返回通用错误，未泄漏内部信息。

## 二、范围与方法

- 方法：通读 src/ 全部主要 ts 文件 + test/ 两份测试，对照 `.env.example` 列敏感项清单；grep 全 src 核查日志输出与 encryptor 引用情况。
- 敏感项清单（`.env.example`）：`DEEPSEEK_API_KEY`、`ANTHROPIC_API_KEY`（注释态）、`OPENAI_API_KEY`（注释态）、`GLM_API_KEY`（注释态）、`TRIMODEL_TRIMETAVERSE_API_KEY`（示例值即 `tmv-sk-dev-default`）、`TRIMODEL_API_TOKEN`（配置面鉴权令牌）。`.env.example` 明示 .env 应 gitignore（该文件第 3 行）；本次未验证 git 历史与实际部署环境（只读约束+时间盒）。
- 架构事实：业务聊天流量不过 TriModel 服务器，客户端从配置面取 key 后直连 provider（server.ts:2-5 注释）；因此配置面一旦失守等于上游全部密钥失守。

## 三、发现清单

### P0（安全 / 数据损坏 / 崩溃）

- **P0-1 Authorization 头硬编码为 `'******'`，OpenAI 通道整体与 TriMetaverse 流式通道必然而非偶发地鉴权失败**
  - 证据：`src/providers/openai.ts:56`、`src/providers/openai.ts:145`（chat 与 stream 两处均为 `Authorization: \`******\``）；`src/providers/trimetaverse.ts:265`（stream 同样写死，而同文件 chat 在 129 行正确使用 `` `Bearer ${this.apiKey}` ``）。对比正常实现：deepseek.ts:48,136、anthropic.ts:80,191、deepseek-anthropic.ts:70,173。
  - 影响：凡走这两条路径的请求 100% 被 401 拒绝；若为发布前脱敏产物，说明缺一道"脱敏后必须可编译可运行"的门禁；且配合 client.ts 的静默 fallback，本应发给 OpenAI 的流量会无声改道 DeepSeek，形成"数据流向偏离用户选择"的次生问题。

### P1（功能缺陷或高风险设计）

- **P1-1 配置面用单一共享令牌一次性分发所有上游明文密钥，无 per-client 凭证、无撤销、无轮换强制**
  - 证据：`src/api/keys.ts:24`（进程级单令牌 `TRIMODEL_API_TOKEN`）、`src/api/keys.ts:38-78`（readKeys 把 deepseek/anthropic/openai/trimetaverse 全部明文打包）、`src/api/keys.ts:97-107`（一次 200 响应返回全部 api_key）。
  - 影响：任一持有该共享令牌的消费方（或令牌泄露）即等同泄露全部上游真实密钥；无按客户端吊销能力，事故时只能全局换令牌。

- **P1-2 `expires_at` 硬编码为 now+24h，与 `refresh_interval_s`（默认 900s）语义脱节**
  - 证据：`src/api/keys.ts:28-31`（`computeExpiresAt(_unused)` 参数显式弃用，固定 +24h）、`src/api/keys.ts:104-105`（响应同时下发两者）。
  - 影响：客户端会据 expires_at 把密钥缓存最长 24 小时，服务器侧 15 分钟一轮换即出现批量陈旧密钥失败，轮换机制形同虚设。

- **P1-3 硬编码默认凭据回退 `tmv-sk-dev-default`**
  - 证据：`src/config.ts:53`（`trimetaverseApiKey: process.env.TRIMODEL_TRIMETAVERSE_API_KEY ?? 'tmv-sk-dev-default'`）、`.env.example:32` 同值。
  - 影响：环境变量缺失时不报错而是静默使用一个人尽可知的公共开发凭据去调 TriStaciss，若平台侧未封禁该 key 即构成未授权消费/冒用风险。

- **P1-4 任意错误（含 4xx 业务/鉴权错误）都触发静默跨 provider fallback**
  - 证据：`src/client.ts:164-172`（catch 后只要 route.fallback 存在即重试，不区分错误类型）、`src/client.ts:198-211`（stream 同型）。
  - 影响：401（密钥失效）/400（参数错）也被吞掉改道其他厂商模型——调用方拿到的回答来自其未选择的 provider（数据出域边界漂移），且根因被掩盖、计量归属失真。

- **P1-5 key-encryptor 的 KDF 为低熵机器指纹 + 编译期固定盐，抗"换机"不抗"知情人"，且当前为无引用死代码**
  - 证据：`src/security/key-encryptor.ts:16-19`（FIXED_SALT 硬编码于源码）、`src/security/key-encryptor.ts:25-40`（PBKDF2 口令 = hostname:username:platform:arch，均可枚举/猜测）；grep 全 src 无任何 import 该模块。
  - 影响：AES-256-GCM 与随机 IV 本身正确，但口令熵近乎为零，拿到 keys.json + 知道主机元数据即可离线解密，"加密落盘"实为混淆；现未接线故暂无实际暴露面，但按注释属 Phase 2 拟启用件，启用前必须重设计（外部 KMS/口令）。

- **P1-6 `/health` 无鉴权即向全部已配 provider 发起真实计费调用**
  - 证据：`src/api/routes.ts:23-26`（/health 无任何鉴权检查）、`src/api/health.ts:11-22`（healthCheck 遍历所有 provider）、各 provider `healthCheck()` 实发 `chat([{role:'user',content:'ping'}])`（如 `src/providers/deepseek.ts:158-167`）。
  - 影响：任何能触达端口者可零成本放大产生上游计费请求（成本放大器/慢端点 DoS：串行等待每个 provider 超时）；健康探测不应有计费副作用。

### P2（质量 / 可维护性）

- **P2-1 全部 provider 将上游错误响应体原文拼进 Error message 透传**
  - 证据：`src/providers/deepseek.ts:54-57`、`src/providers/anthropic.ts:87-90,198-201`、`src/providers/deepseek-anthropic.ts:77-80,180-183`、`src/providers/openai.ts:62-65,151-154`、`src/providers/trimetaverse.ts:135-140,271-274`。
  - 影响：上游 body 可能含账号/配额/内部拓扑信息（TriStaciss 场景尤甚），未经脱敏进入调用方日志与 UI；建议归一化为状态码+安全摘要。

- **P2-2 配置面令牌使用非常数时间比较**
  - 证据：`src/api/keys.ts:90`、`src/api/keys.ts:119`（`authHeader !== expectedBearer`）。
  - 影响：理论计时侧信道；本服务默认仅绑 127.0.0.1 故风险低，但应换 `timingSafeEqual` 以备监听面扩大。

- **P2-3 注册表的 timeoutMs 与 ChatOptions 超时均未生效，provider 内各自硬编码**
  - 证据：`src/client.ts:23,30` 等 registry 配置 timeoutMs，但各 provider 硬编码 60s/120s（`src/providers/deepseek.ts:23,111`、`src/providers/anthropic.ts:35,151` 等），ChatOptions 亦无超时字段传递。
  - 影响：配置看似可控实则无效，长/短超时策略无法统一调整；另 trimetaverse.chat 缺 AbortError 归一化 catch（trimetaverse.ts:41-197），超时会以原始 DOMException 冒出，行为与其他 provider 不一致。

- **P2-4 小缺陷集合**
  - `src/security/key-encryptor.ts:76-78`：最小合法密文恰为 28 字节（12 IV+16 tag），`length > 28` 应为 `>= 28`，边界误判；
  - `src/api/health.ts:16`：`ok: true` 恒真，即使全部 provider 探测失败仍报健康；
  - `src/api/models.ts:47-51`：inferProvider 对 claude/gpt 模型返回 `'unknown'`，capabilities 全部推断而非真实声明；
  - `src/config.ts:10-12`：dotenv 逐级向上尝试三层目录加载 .env，可能意外吞入无关父目录配置。

- **P2-5 测试缺口使 P0 得以存活**
  - 证据：`test/client.test.ts:27-44,260-295` mock fetch 只断言 URL/响应体，从不校验请求头 Authorization；`/v1/config/*` 两个 handler 与 key-encryptor 零测试覆盖。
  - 影响：`******` 这类一行断言即可拦住的鉴权回归无门禁；配置面（本仓最高价值攻击面）完全在测试盲区。

## 四、质量总评

代码组织清晰、类型完整、SSE 解析与 fallback 深度限制等细节有真实打磨，服务端错误处理（通用 500、不回显内部错误）符合安全习惯，src 内未见密钥写日志。但**配置面与密钥分发这一核心卖点恰好是安全最薄弱处**：单令牌换全部明文密钥、过期语义失真、默认凭据回退，加上 `******` 这一 P0 表明缺少"改动后可运行"的最小门禁与鉴权头断言测试。就 CTO 视角：当前形态适合 dev 内环；作为对外分发密钥的配置面前，必须先收口 P0-1、P1-1/2/3，并把密钥分发改为短时效、per-client、可吊销的凭证模型。

## 五、未覆盖

- `src/types.ts`、`src/providers/stream/anthropic-sse-parser.ts` 未逐行通读（前者纯类型定义，后者与已读的 openai-sse-parser 同构，风险评级低）。
- 实际运行验证（启动 server、curl 各端点）、git 历史中是否曾提交过真实密钥、`.gitignore` 是否确实覆盖 `.env`、TriStaciss 平台侧对 `tmv-sk-dev-default` 的实际处置——均在只读+时间盒约束外。
- package.json scripts、README/AGENTS.md 文档与代码一致性未核对。

## 附：实际读过的关键文件

- `/srv/fleet/TriModel/src/api/keys.ts`
- `/srv/fleet/TriModel/src/api/routes.ts`
- `/srv/fleet/TriModel/src/api/models.ts`
- `/srv/fleet/TriModel/src/api/health.ts`
- `/srv/fleet/TriModel/src/server.ts`
- `/srv/fleet/TriModel/src/config.ts`
- `/srv/fleet/TriModel/src/client.ts`
- `/srv/fleet/TriModel/src/index.ts`
- `/srv/fleet/TriModel/src/usage.ts`
- `/srv/fleet/TriModel/src/security/key-encryptor.ts`
- `/srv/fleet/TriModel/src/providers/deepseek.ts`
- `/srv/fleet/TriModel/src/providers/deepseek-anthropic.ts`
- `/srv/fleet/TriModel/src/providers/anthropic.ts`
- `/srv/fleet/TriModel/src/providers/openai.ts`
- `/srv/fleet/TriModel/src/providers/trimetaverse.ts`
- `/srv/fleet/TriModel/src/providers/stream/openai-sse-parser.ts`
- `/srv/fleet/TriModel/.env.example`
- `/srv/fleet/TriModel/test/client.test.ts`
- `/srv/fleet/TriModel/test/usage.test.ts`

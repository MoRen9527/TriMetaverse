# CTO 评估卷 · D' 插件化形制可行性+两形四向对比+窗位建议 · 2026-10-20

- sourceOfTruth: 本卷（trees/rhy-seat-smoke/cto-dprime-plugin-vs-standalone-assessment-20261020.md）
- syncMode: static（评估卷·只评估零施工·BOD 2026-10-20 10:14 派令·CEO 10:12 D' 立项裁）
- lastSyncedAt: 2026-10-20T02:19:29Z（+8=10:19:29 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: CEO 10:12 D' 立项+附问「dsh 是插件化的架构，我们的 tui 是否可以做成插件？」→BOD 派令（插件化先答+两形四向对比+施工时段约束+窗位建议稿）

## §一 结论先行

1. **插件化：机制可行，本席不荐作首选**——dsh bundle=「cordis DI 容器插件包+patch 声明式挂载」（一等设计·out-of-tree plugin 官方概念在案），TUI 包装成插件 profile 包无机制障碍；但 bundle 契约（cordis ~4.0.4 peer+patch schema）**未承诺稳定**，0.2.x 演进每版回归利息，人日 +1~1.5。
2. **比插件化更重要的改道发现：D' 协议面应从 SDK 改道 ACP**——`dsh --profile acp`=**标准 ACP v1 协议**（@agentclientprotocol/sdk·Zed 生态标准·非 dsh 私有）+dsh 扩展方法含 **`session/list`+`session/resume`（persisted session 恢复·log restored 不重放旧更新）**——P0 红只杀了 SDK 形，**ACP 形原生 resume**。若 resume 对 web 建段适用（P0' 探针点·未定谳），**D' 从「新会话形」升级回「同段续聊形」=v2 令全目标复活**。
3. 窗位建议+施工段空闲时段编排见 §五。

## §二 插件化形制勘验实锚（河源只读·-J sg）

| 件 | 实锚 | 含义 |
| --- | --- | --- |
| bundle 包形 | dsh-acp-app/package.json：`"dsh": {"bundle": {"patch": "./cordis.patch.yml"}}` | bundle=npm 包+一个 patch yml·主入口 lib/index.js（cordis 插件模块） |
| 挂载语法 | cordis.patch.yml 全文：`insert: - {id, name, inject, config}`+`- id: X / config:` 改配置+`disabled: true` | 声明式插件组合·name 指 npm 包·依赖注入 |
| 部署哲学 | acp-app README：「A deployment selects a different complete composition **through profile bundles and patch files, not another app bin**」 | 官方明示组合正身=profile+patch·第三方插件一等面 |
| out-of-tree | app-boot L571/L139：「pnpm settings out-of-tree plugins need. Existing files are never touched」·「Detected structurally, not with instanceof: an out-of-tree plugin brings…」 | 树外插件=官方支持概念·pnpm workspace 由 dsh 自管 |
| plugin add | app-boot L974 报错原文=profile 缺失时指引 `dsh plugin --profile <name> add <package>` | 机制在·13 席部署=`add` 一条命令+`dsh --profile tui` 启动 |
| stdout 约束 | acp-app README：「Stdout belongs to ACP」·「User plugins can violate stdout purity」 | **per-profile 约束非全局**——tui profile 的 stdout 本该是终端渲染·对 TUI 插件形不构成障碍 |
| tty 面 | acp-app startup latch 先例（app-owned zero-option command provider）+官方 README「`dsh --profile tui`（assuming the tui profile is installed）」 | cordis 容器内起终端渲染循环无机制障碍·官方预期第三方装 TUI 正身即此形 |
| 待施工期勘 | `add <package>` 本地路径/tarball 接受形未定谳（npm registry 名实测 404·pnpm workspace 形制下 file: 协议大概率支持） | 部署脚本前勘一次·0.1 人日内 |

## §三 ACP 改道发现（本卷最重要增量）

- **协议标准性**：dsh-acp 基于 `@agentclientprotocol/sdk`（ACP v1·Zed 生态标准协议）——非 dsh 私有协议，客户端生态/文档/一致性测试（「keyless control-surface conformance test drives the real profile through the public ACP SDK」）在案。
- **resume 契约**（README 方法表+dsh-acp/lib/types/session.d.ts L21-54 实锚）：
  - `session/list`：persisted resumable root sessions newest-first 分页+可选 cwd 过滤（physical-directory identity）；
  - `session/resume`：persisted inactive session·canonical workspace 验证后合成·**log restored without replaying old updates**；
  - `AcpSession.resume(ctx, {sessionId, cwd, mcpServers, agentOptions, fallbackSelection, signal, notify})` 静态构造·Restore a persisted Agent。
- **对 D' 含义**：SDK 形 known-id 拒挂（P0 红）vs ACP 形 persisted session 恢复——两 profile 对 resume 是设计分野。**P0 已证库结构同构**（web/SDK 会话同一持久化根）——`session/list` 语义不区分创建方，web 段 resumable **概率高但未定谳**。
- **P0' 探针点（唯一未定谳）**：ACP 形 `session/resume` 挂 web 建段（同 P0 段 B 源 64a715c5）——绿=D' 同段续聊形达成（v2 令全目标）；红=新会话形 fallback（D' 原定义）。隔离法同 P0（隔离 HOME·零现役触碰·0.5 人日）。
- **诚实约束点**：resume 不重放旧更新事件——TUI 显示历史须自读 transcript（v4 zstd 信封只读渲染·轻量）或 v1 先「续挂+新交互」历史回看交 dsh web——两案择一随主线定，读面工作量含在人日估算内。

## §四 两形四向对比

| 维 | 插件包形（cordis bundle·TriRLC Ink 包装） | 独立进程形（TriRLC Ink bin·spawn dsh --profile acp） |
| --- | --- | --- |
| **工作量** | 5.5-7 人日（D' 基线+契约适配 1-1.5：包形制+patch+部署脚本） | **4-5 人日**（P0' 绿前提·含 §三 历史读面择案） |
| **风险** | bundle 契约未承诺稳定（cordis peer+patch schema）·0.2.x 每版回归利息·官方 tui 发布后同位直接冲突 | 走 ACP v1 标准面（稳定承诺+一致性测试背书）·官方 tui 发布后平行品·同库平滑切换（P0 证同构） |
| **部署面** | `dsh plugin --profile tui add <pkg>` 一条命令/席·极简 | TriRLC bin+spawn 包装脚本/席·中（13 席一次性脚本化后无实质差） |
| **升级面** | 每版跟 dsh 回归（契约利息持续） | 自主节奏·ACP v1 协议演进独立于 dsh 版本 |

**本席建议：独立进程形（TriRLC Ink 接 ACP 协议面）**——标准协议面>内部契约面·省 1.5+ 人日·部署面优势经 13 席一次性脚本化后不实质。插件形留观察项：若官方 bundle 契约文档化+稳定承诺（0.3+?）→再评估迁移，届时同库零迁移成本照旧。

## §五 窗位建议稿（D-39 制·BOD 转呈 CEO 确认）+施工时段编排

- **前置**：A2 收口（错峰序维持·r-duty 班组不双线）。
- **P0' 探针（0.5 人日）**：**可与 A2 并行**（零依赖零现役触碰）——建议 **今 18:00 后空闲段执行**（真实 DeepSeek 调用面·高峰=工作日 9-12/14-18 价格双倍·CEO 时段约束照守；探针调用分钟级）。
- **主线（探针绿后·4-5 人日·独立进程形）**：
  - 代码/组件/适配 hook 段=零模型调用（假事件流单测）——工作日任意段可施；
  - 端到端联调+渲染走查=真实调用面——**排空闲段集中**（工作日 12-14 午休/18:00 后+周末·预计占联调段大半）;
  - 若窗内必落高峰段（联调收尾时点约束）→过 CFO 质疑报警面（理由预填：收口联调连续性需求·调用分钟级）。
- **窗位建议**：P0' 今 18 后先行→探针绿则**本周末（10-24/25）开主线窗**·下周内收口——BOD 转呈 CEO 确认。
- 边界照旧：现役栈零触碰·D-46 零值面·隔离法施工。

## §六 使用依据

- BOD 派令 2026-10-20 10:14:05（插件化先答+两形对比+时段约束+窗位稿）·CEO 10:12 D' 立项+附问原文
- 河源只读勘实锚：dsh-acp-app/package.json+README.md 全文+cordis.patch.yml 全文·dsh-acp/README.md 方法表（L64-68）·dsh-acp/lib/types/session.d.ts（L1-70）·dsh-app-boot/lib/index.js（L571/974/139 out-of-tree 与 plugin add 指引）
- 前卷承接：cto-p0-probe-closeout-20261020.md（§三 五点机制增量·库同构实证）·cto-d-tui-feasibility-assessment-20261019.md（§三 人日基线）
- 边界声明：本评估零施工零模型调用（只读勘+写卷）·现役栈零触碰·D-46 零值面

—— CTO 小狄（落款 date 现查原值 2026-10-20 10:19:29 +0800·发毕对表）

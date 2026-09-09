# Wave 0 改名残留清查评估件（收口版）

- sourceOfTruth: TriMetaverse/docs/execution/wave0-rename-residue-assessment-20260909.md
- syncMode: source-only｜lastSyncedAt: 2026-09-09
- 性质：**评估件收口**（COS 面；分类完成=CEO 问询承诺件今夜窗兑现；修正路线归各 owner，本件只定级与路由）
- 改名族谱：TriMC→TriMMC／TriLC→TriRLC（2026-08-31）／数据目录 trilc→trirlc（2026-09-01 执行案 .fade/hub/wave0-plan.md）／healthz 串（已修）／duty 叙事
- 方法：六面有界重扫（2026-09-09 19:5x+08 实测）+TriMLC 面引 20b78b67 清查清单 v2（424 处 B/C/D 三级已分，本件不重做）

## 一、六面分类总表

| 面 | 扫描范围 | 命中 | 级别 | 处置路由 |
| --- | --- | --- | --- | --- |
| A·TMV docs | docs/**/*.md | 363 文件 | **D 冻结为主**：历史记录/契约存档/决策叙事占绝对多数（历史叙事冻结原则不修）；其中活技术文档逐件甄别 | 长期低优逐窗消化（不阻塞收口）；活文档甄别候各 owner 顺手件 |
| B·TC docs/.claude | docs/+.claude/ | 47 文件 | **D 冻结为主**（ade 族/fae 论文/历史 spec 同 A） | 同 A 长期低优 |
| C·发布面 | TMV .github/.claude | 7 文件 | **B 活面候修**（详见 §二——源侧同源，修正在 TC source-agents 走渲染链，禁直改发布面） | 源侧修正单→CTO/FSD 渲染链窗 |
| D·本机数据目录 | AppData/Local 四目录 | **四目录并存** | **C 口径分裂**（详见 §三） | 工程窗统一口径+孤儿清理 |
| E·sg 侧 | /home/fleet 值位工作区 | .trilc+​.trimmc 混用 | **C 新生残留**（详见 §四） | 值班位工程窗随下一窗 |
| F·TriMLC 输出面 | （20b78b67 清单 v2） | 424 处 B/C/D 三级已分 | 引用不重做 | 按 20b78b67 既有分级路线走 |

## 二、C 面活候修清单（B 级，源侧修正单）

1. `TriCompany/source-agents/chief-technology-officer/session-body.agent.md`——「### TriLC daemon（本地控制器）」节头（发布面 .claude/hub/cto.session.md L138 同源实测）→ TriRLC。
2. `TriCompany/source-agents/full-stack-developer/full-stack-developer.agent.md`+`soul.agent.md`——「代码真源面：TriMetaverse/TriLC/TriPilot/TriCode」模块名行 → TriRLC（发布面 hub/FSD.session.md L29 实测同源）。
3. `TriCompany/source-agents/business-strategy/agent-body.agent.md`+`registries/business-strategy.agent.md`——模块映射列表「TriMC、TriLC」（发布面双 agents 文件 L14 实测同源）→ 按现行名 TriMMC、TriRLC。
4. `TriCompany/source-agents/registries/TrideProductRegistry.agent.md`——同族串（面内一并过）。
- **修正形态**：源侧五件套修正→渲染管线重渲→发布面随批（CLAUDE.md 真源序：源侧 wins）；禁直改 .claude/.github 发布件（下批渲染即回退）。
- `TMV .claude/plans/trilc-ime-fix.md`：陈旧计划件（C 级无害）——候删或归档，随下批清。
- `TMV .claude/settings.local.json` L7 `Read(//d/Code/ai/TriLC/dist/**)`：陈旧权限路径（模块仓已改名，路径死链；C 级无害）——候权限面顺手清。

## 三、D 面数据目录口径分裂（C 级，工程窗件）

- 实测四目录并存：`trirlc`（8711 现役，cmd set TRILC_DATA_DIR 指此 ✓）／`trilc`（**重生态**——代码侧默认派生 'trilc' 未灭，某进程仍在写；09-01 mv 后复发）／`trilc-channel`（8713 现役，v3 cmd 字节级重建用此名）／`trimlc-channel`（09-01 改名产物，现疑似孤儿）。
- 判读：**8713 通道 cmd v3 与 09-01 改名案口径相逆**（v3 用 trilc-channel，09-01 案定 trimlc-channel）——两代方案打架，非简单漏改。
- 处置路线（工程窗三步）：①勘定 trimlc-channel 孤儿性（数据新旧比对）②口径裁决：统一到 trimlc-channel（随 09-01 案）或承认 trilc-channel 现役（随 v3 令）——**裁决归 CTO**（两案均其手笔）③孤儿目录清+代码侧默认派生 'trilc' 根治（src/cli.ts 硬编码，根治候 TriRLC 工程窗）。
- 风险注记：8713 现役数据在 trilc-channel（uptime 连续 6h+ 的 daemon 正用），**动目录必随 daemon 停起窗**——勿热改。

## 四、E 面 sg 侧新生残留（C 级）

- `/home/fleet/.trilc/`（值位巡检脚本+日志落此，cron 行指向之——**今晨试点新生**，旧名目录在 sg 复活）与 `/home/fleet/.trimmc/`（duty-env 真路径，FSD 勘正版）混用。
- 处置路线：值位工作区口径统一（建议 .trimmc 单根：脚本/日志迁 .trimmc+cron 行随改+旧目录清）——随值班位下一工程窗（勿热改：cron 在役，迁移动 cron 窗口期）。

## 五、收口判据与后续

- 本件收口=六面扫毕+分类定级+路由挂出（B 活面修正单/D 口径裁决/E 统一方案三项挂出）；**修正实施不属本件**（各 owner 窗执行）。
- B 级修正单候 CTO/FSD 渲染链窗（预计一窗可毕）；D 口径裁决候 CTO 裁；E 随值班位窗；A/B 冻结面长期低优不设限期。
- 状态条：①2026-09-09 19:5x+08 现查（UTC 11:5xZ）②联审证据=六面扫数在卷 ③水位自估：中 ④— ⑤签发时刻代之。

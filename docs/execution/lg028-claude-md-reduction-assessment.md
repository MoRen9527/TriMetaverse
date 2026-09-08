# LG-028 CLAUDE.md 减法窗评估+迁移方案稿（D-16 裁点 a 实施；分段闸批 2-3 窗事项·本轮评估+方案稿，实施候 BOD 核后另批）

- sourceOfTruth: TriMetaverse/docs/execution/lg028-claude-md-reduction-assessment.md
- syncMode: source-only｜lastSyncedAt: 2026-09-04
- 依据：BOD 放行令（CEO 亲签「放行」）；D-16 裁点 a 收敛清单；CPO 主审三问判域法+裁点 a 逐项；CAO 正面判据草案
- 边界：**本轮=评估+迁移方案稿（改前/改后对照），不改 CLAUDE.md 真源/发布面任何字节**；实施候稿呈 BOD 核后另批
- 评估对象：TriCompany/docs/project-sources/trimetaverse-claude-md.md（真源，124 行；发布面 TriMetaverse/CLAUDE.md 125 行 FADE-002 字节发布同步）

## 一、改前现状（真源节结构 10 节全列）

| # | 节 | 行 | D-16 判 | 迁出目标面 |
| --- | --- | --- | --- | --- |
| 1 | Project Overview | 7-17 | **留·改造**（结构正身；L17 v0.9.x 句迁出） | —/v0.9.x→BusinessStrategy 面 |
| 2 | Module Workspace Layout | 19-31 | **留·改造**（结构正身；L28 `TriMC/ ← Meta Controller` 系 LG-021 前旧名，改 TriMMC 双名并书） | — |
| 3 | 董事会/董事长助理分权制 | 33-40 | **留·改造**（去自指改第三人称；语义真源=GID-08a 授权矩阵+合同，只改叙述人称不改语义——LG-031 CHO 专项已过） | — |
| 4 | Registry Routing | 42-56 | **留**（查事实导航=CLAUDE.md 该干的事） | — |
| 5 | Agent Architecture | 58-63 | **留**（结构正身） | — |
| 6 | CodeGraph Usage | 65-80 | **留·压缩**（环境能力描述；表保留正文压缩） | — |
| 7 | Source of Truth Order | 82-89 | **留**（真源顺序=路由导航正身） | — |
| 8 | Weekly Operating Records | 91-96 | **迁出**→COS 面（operating-records 面，经营记录收口域=COS 主责） | COS session 面+留一行路由指针 |
| 9 | Common Commands | 98-117 | **迁出**→CTO 面（session 域知识族；daemon/healthz/CI/安装=TriRLC 工程细节） | CTO session 面+留一行路由指针 |
| 10 | File Conventions | 119-124 | **迁出**→CAO 纪律册（engineering-disciplines.md 附录；公司写作纪律非项目结构） | CAO 纪律册+留一行路由指针 |

**分权制段去自指改造对照（CEO 已认可方向，LG-031 CHO 专项同向）**：
- 改前（现役）：「**本会话（CEO 直连）= 董事会**：接收指令…」「**董事长助理小贾**（常驻中枢…）：**董事会发出的一切指令交其执行**…」
- 改后（第三人称结构陈述）：「**董事会**（CEO 直连会话）：接收指令、投递执行、转呈交付、紧急回滚协调——其余一切任务性工作默认投递常驻中枢执行。」「**董事长助理**（常驻中枢，xiaojia-hub）：董事会发出的一切指令交其执行；持有完整工作上下文，维护挂账台账…」——**只改叙述人称不改分权制语义**（语义真源=GID-08a 授权矩阵+岗位合同，LG-031 CHO 专项裁）。

## 二、迁出四件路由指针设计（指针质量两要素：目标面正名+真源路径，失联=不过）

| 迁出件 | 路由指针（CLAUDE.md 留一行） | 目标真源路径 |
| --- | --- | --- |
| Common Commands | 「TriRLC daemon/健康检查/构建管线/安装脚本命令→CTO session 面（域知识族）+`TriCompany/docs/workflow/engineering-disciplines.md` D-03/D-17」 | CTO session 面（域知识族，落位候）+纪律册附录（落位候） |
| File Conventions | 「commit attribution/AI co-author/markdownlint/agent 文件命名→CAO 工程纪律册（`TriCompany/docs/workflow/engineering-disciplines.md` 附录）」 | 纪律册附录 |
| Weekly Operating Records | 「周平面 OP 记录（索引/树计划/4 周-8 周阈值）→COS session 面（operating-records 面）」 | COS session 面（中枢自持域） |
| v0.9.x 双轨句 | 「当前阶段→BusinessStrategy 面（`docs/execution/v0.9.x-dual-track-tricompany-plan.md`）」 | BusinessStrategy 面 |

## 三、迁后 CLAUDE.md 三段式终态（D-16 裁①正面判据对表）

1. **结构客观描述**：Project Overview（去 v0.9.x 句）+Module Workspace Layout（TriMMC 双名并书）+Agent Architecture
2. **路由导航**：Registry Routing+Source of Truth Order+迁出四件路由指针行
3. **各域指针行**：分权制节（第三人称中性+指针化不损真源）+CodeGraph 压缩留

**净效果**：真源 124 行→估 85-95 行（迁出四件+三段式压缩）；发布面 FADE-002 同步重渲。

## 四、风险与边界

- 分权制去自指=**只改人称不改语义**（LG-031 CHO 专项裁：语义真源=GID-08a+合同，防执行误伤）
- 迁出四件真源落位**实施前须先落**（CTO session 面/CAO 纪律册附录/COS 面/BusinessStrategy 面——目标面未落先迁=失联违指针质量硬验收）→**实施分两步**：先目标面落位（各域 owner）→后 CLAUDE.md 减法+指针
- lg032 案 a 窗（观察期/切指窗）零耦合（文档面活不扰 8711）
- 本轮=评估+方案稿，**CLAUDE.md 真源/发布面零字节改动**（实施候 BOD 核后另批）
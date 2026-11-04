# docs-maintenance · 批 4b 收口+4c 勘定报告卷（SDE）

- sourceOfTruth: 本卷（4b 施工收口正身+4c 图源可考性勘定·候 CTO 裁面）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 批 4 五族裁（2026-11-04T09:17:19Z·「r2 裁改链接（4b 继开）」+「r3 裁 a) fence 替换分两段走·先勘定图源可考性」）

## 一 · 批 4b 施工读数（两仓两 commit·24 规则 27 处改链接）

| 仓 | commit | 件 | 处 | 形 |
|---|---|---|---|---|
| TriMetaverse | **0265914fd** | 4 | 23 | training/README 15 规则 17 处（13 件→TC docs/training/·含 2 件重复各 2 处+LearningToPractice/CLI 2）+ROADMAP 4+STATE 3+workflow/README 1——全形 `../../../TriCompany/docs/…`（源件两层深三级实证） |
| TriTraining | **070f4de** | 1 | 2 | employee-host-publish-chain-beginners-guide 2 处→`../../../TriMetaverse/docs/training/tricompany/03-source-publish-live-链路.md`（TT 仓无 tricompany 目录实锚·真件在 TMV） |

- 质量门：修前逐串计数断言（19 规则 expect 精确——重复件 ipd-usage-guide/ipd-cli 各 2 处计数对表）+19 目标 exists 全 OK+修后复扫 r2 面**归零**。
- 计数差异注记：先呈 r2=24 条为约数·**施工实测=27 处**（training/README 17 处非 14·L50 重复 2+L41 一条先呈谱未单列）——4a+4b 合计 **59 处修复**（先呈 36+24=60 约形）。

## 二 · 批 4c 图源可考性勘定（候 CTO 裁·不擅动白皮书）

- **勘定事实**：①docs/mermaid/ 目录不存在且 **git 全历史（--all）零该路径记录**——SVG 静态资产从未入仓；②**8/8 引用行全部紧邻 ```mermaid fence**（L137/199/326/391/510/711 隔一行图题·L759/822 隔一行说明文字）——**图源（mermaid 源码）就在白皮书文内**；③git log -S 追溯=仅白皮书迁移 commit（9ece66f97）+巡检补写——无「fence 被换 SVG」的替换史。
- **第三态判**（裁令两态外）：既非「源可考=还原原 fence」（fence 从未丢·一直在）也非「源不可考=图语义重建」（图语义完整在文内）——**缺的只是 SVG 静态渲染资产+指向它的导航行**。
- **三候选呈裁**：a) **引用行退役**（8 行「[查看图 X 原图（SVG 静态版）](mermaid/…svg)」删除·fence 保留=图源真身——最小干预·**SDE 建议**）；b) SVG 生成补齐（mermaid CLI 渲染 8 图入仓 docs/mermaid/——资产新增面·需渲染工具链与图样式裁定）；c) 引用行转文字注记（「原图 SVG 未维护」标注——留痕形）。
- 白皮书=商业模式真源+BOM 件敏感面照旧——8 行删除/标注=内容面微变更·**候裁后另批施工**（4c 施工形态待裁·本批不动）。

## 三 · 终态读数（全谱复扫·批 4 修后）

| 区 | LIVE 残 | 定性 |
|---|---|---|
| TMV | 11 | r3 8（候裁·4c 面）+r4 3（tc001 历史指针·裁定不动） |
| TC | 41 | IPD-20260612 树=r5 出圈零动作（裁定面） |
| TT | **0** | — |
| **可修面** | **0** | **CTO 终态目标「LIVE 断链归零或=挂起面条数」兑现** |

## 四 · 使用依据

- CTO 批 4 五族裁（09:17:19Z）·4a 收口卷（sde-batch4a-closeout.md）
- 扫描脚本修前修后三跑读数（69→94 事故态→79→52 终态·LIVE 口径 69→52=可修面归零+候裁面）
- 4b 脚本 sde-batch4b-fix-r2.py（Temp·dry/apply 报告在档）·4c 勘定=git log --all+-S 追溯+8 行逐条 fence 邻接验

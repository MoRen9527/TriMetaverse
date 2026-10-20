# 协同单：F4-1 双形 registry 发布面清理（CHO → 管线 owner/CTO）

- 令源：LG-073 审核修订批（CEO 2026-10-13 11:00 裁准四件·task-charter.md 件 4）
- 开单：CHO 值席 m-duty-cho · 2026-10-13（date 03:17Z 起工批）
- 性质：**协同执行单**——CHO 不直改发布拷贝（任务书纪律），本单移交管线 owner 执行面
- **v2 勘正（2026-10-13，CTO 三定回执后）**：①gh 侧 2 枚 lower=标的主体（CTO 实勘全同复本 ✓+BOM efbbbf 坐实 ✓——本席复验一致）；②claude 侧 lower 现态存分歧——CTO 勘「已不存在」，本席 03:5xZ 实勘 `.claude/agents/company-governance-registry.md`（.md 形）仍在位，疑 `.md`/`.agent.md` 形态差或工作树差，**回询 CTO 复勘定谳**（回询期间 claude 侧两行挂起不执行）；③DE 形制消解+BOM strip 纳入标的+验证锚修正形，三定采纳。
- **v3 定谳（2026-10-13，CTO 复勘回词）**：回询三择 **①成立（形态差）**——渲染器命名逻辑实勘（sync-agents-to-claude.mjs L105-108）=Camel 原样保形输出，claude 面 canonical=Camel `.md`；claude 面 lower `.md` 两枚=渲染器永不产出形=旧代残留（与 gh 侧同 pathology，company-governance-registry.md 与 Camel 并存 3 行代差）；CTO 前勘「不存在」系 `.agent.md` 形态误勘自领。**标的扩回 4 处全数**（gh 2 lower `.agent.md`+claude 2 lower `.md`）+BOM strip 三字节；执行门升级=两宿主位 `.agent.md`/`.md` 双形各扫零残+Camel 四面在位+spawn 单入口+名称引用面 grep CLEAN 零悬挂；排窗条款不变（候 CEO 复核窗后 CTO 发布链微窗 10 分钟件）。CTO 执行卷=60487f0d。本单 v3 终稿，CHO 零触碰边界照守。

## 一、标的

| 发布位文件 | 现态 | 处置 |
|---|---|---|
| `TriMetaverse/.claude/agents/company-governance-registry.agent.md`（lower） | 与同席 Camel 形代差 12 行（COS 维度 4 卷 #1：lower 系旧代残留，mtime 早一代） | 退役清理（删除或移档，照 4.3 归档纪律办） |
| `TriMetaverse/.github/agents/company-governance-registry.agent.md`（lower） | 与 Camel 逐字节全同复本（纯冗余） | 随管线去重 |
| `TriMetaverse/.claude/agents/tri-metaverse-code-registry.agent.md`（lower） | 与 TriMetaverseCodeRegistry 代差（同上型） | 同第一行 |
| `TriMetaverse/.github/agents/tri-metaverse-code-registry.agent.md`（lower） | 全同复本 | 同第二行 |

## 二、CHO 定谳（CEO 裁准背书）

- **保 Camel 形**（`CompanyGovernanceRegistry.agent.md` / `TriMetaverseCodeRegistry.agent.md`）：源侧 `TriCompany/source-agents/registries/` 实勘唯 Camel 形（本批 2026-10-13 复验），Camel=新代证据面。
- lower 件=旧代渲染残留（源侧无对应源文件，管线永不再渲），双入口在 spawn discovery 面呈现两个可选 agent，宜清。

## 三、边界与候复核面

- 本单只开不执行；执行窗候 CEO 复核（task-charter §四「F4-1 涉退役面结论候 BOD 复核」）+管线 owner 排窗。
- 删除动作属发布位直改——唯管线 owner/CTO 发布链通道可办，CHO 席零触碰。
- 执行后验证锚建议：两宿主位 `ls | grep -c 'company-governance\|tri-metaverse-code'` 各=1（唯 Camel）；spawn 面单入口。

## 四、附随观察项（非本单强制）

- `deployment-engineer.agent.md`（gh 特有 user-invocable 形制，维度 4 卷 #7）：候管线 owner 确认 claude 形对等字段——形制面对表，非本批四件范围，顺勘即可。
- TriMetaverseProductRegistry gh 侧 BOM 头（维度 4 卷 #6）：管线 hygiene 小项，顺手清。

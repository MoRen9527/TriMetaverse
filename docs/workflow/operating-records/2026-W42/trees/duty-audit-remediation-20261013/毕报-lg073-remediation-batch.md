# 毕报：岗位职责审核修订批四件（LG-073 候授·CHO 承办）

- 任务书：本目录 `task-charter.md`（0635bfe6f，CEO 11:00 裁准·BOD 立书）
- 执行位：CHO 值席 m-duty-cho（sg）；起工 2026-10-13T03:17Z（date 现查）
- 审核源卷：duty-audit-agent-roles-20261012/audit-report-20261013.md（da1d06f5c）

## 一、四件施工读数（每件改前/改后对照锚=commit diff，39 文件 51+/51-）

### 件 1 · F3-1 层契约对外连续性归置追平（P1）
- 裁向：归 **social 层**（COS 件 10-02 勘正口径为唯一正形），12 席批量、一裁一改。
- 施工：12 席 `agent-body.agent.md` 层契约句末小句「…连续性归 colleagues 层」→「归 social 层」；SDE/CSO 粘连单句拆分为「协作关系归 colleagues 层；对外事务连续性归 social 层」；CPO 变体形（「用户与市场外部事务连续性」）同追平。协作关系小句仍归 colleagues，零触碰。
- 对照：grep 改前 12 行在案（commit diff 逐行可溯）；COS 件断言验证「已是 social 正形，零改动」✓。
- 闭环判读：1 vs 10 矛盾清零，13 席全司归 social 一致。

### 件 2 · F1-3 description 统一新式（P2·模板 CHO 拟定）
- 裁向：新式「XX 负责人。负责…」13 席全覆盖；模板细节授权 CHO。
- **模板定稿**（留档）：`description: "{中文岗位名}。负责{核心职责概要}。适用触发：{通信正名/工作名/spawn 名/域关键词}。"`——第三段保留原「适用场景」面的寻址触发词功能（D-13 条 5 别名关键词先例），防统一格式时丢失 spawn 匹配面。
- 施工：13 席 × 2 文件（`agent-body.agent.md` 内嵌 frontmatter + `agent-frontmatter.agent.md`，管线源件族 :1319 双处同步）= 26 处写入；CHO/CAO 原新式补「适用触发」段齐装；CAO 双处失同步（body 新式/frontmatter 旧式）一并修正。
- 对照：改前 15 席 description 原文 grep 在卷（board/BS 非员工席免改）；改后发布位抽验 COO=新式在位。
- 附带修正：F1-2（description 与正文失同步）在 COS/COO 席随新式重写自然消解——新 description 均按现役 agent-body 职责面拟写。

### 件 3 · 4.3 退役主件残影归档标注（P2·标注不删）
- 施工：13 席 `<id>.agent.md` 头部退役横幅追强为归档标注——退役时点（D1b 切源批）+接替件指针（agent-body.agent.md 含内嵌 frontmatter+agent-frontmatter.agent.md）+停止维护声明+LG-073 批注；文件本体零删除。
- 对照：正则断言 13/13 命中原横幅替换，零失败。

### 件 4 · F4-1 双形 registry 清理（P1·保 Camel）
- 源侧实勘：`source-agents/registries/` 唯 Camel 形（CompanyGovernanceRegistry/TriMetaverseCodeRegistry）——源侧零改动 ✓。
- 发布面：**协同单已开**=`co-handover-f41-dual-form-registry.md`（本目录）→ 管线 owner/CTO；lower 旧代件 4 处处置建议+执行后验证锚在单内；CHO 不直改发布拷贝。
- 退役评估结论：lower 件系旧代渲染残留（源侧无对应源文件，管线永不再渲；与 Camel 代差 12 行/mtime 早一代），双入口占 discovery 面，**宜退役清理**——照 4.3 归档纪律办（删除或移档），候 CEO 复核+管线 owner 排窗执行。

## 二、发布批读数（随渲染链重渲，非手工改拷贝）

- D-07 `source_publish_check --publish-agents --agent-execute` 三宿主面实发：**claude 13 updated / copilot 13 updated / claude-session 13 updated，三面 derived_drift=0 收口**；dry-run 预演 13 drift 与 13 席源改动数目吻合。
- validator 门自验：13 席 validate——11 席 0 错，SDE/CSO 各 2 条（soul marker「对话风格/禁止退化」既有族，审核报告 F2-2 同源，零新增）。

## 三、候复核与移交面

- **候 BOD/CEO 复核**：件 4 退役清理执行窗（协同单）；lower 件删除/移档二择。
- **移交管线 owner/CTO**：协同单一件（F4-1 执行面+附随观察二项：deployment-engineer 形制对表/BOM hygiene）。
- **LG-073 授号**：本批挂账申请——请 COS 按台账面授号 LG-073（大表行 BOD 已挂候授），销账材料=本毕报+commit 锚。
- 其余 14 项审核建议维持候办原态（未因本令激活），归口不变。

## 四、修订对象清单（席×文件×改法）

| 件 | 席位 | 文件 | 改法 |
|---|---|---|---|
| F3-1 | 12 席（除 COS） | agent-body.agent.md 层契约句 | colleagues→social（SDE/CSO 拆分形；CPO 变体形） |
| F1-3 | 13 席 | agent-body 内嵌 frontmatter+agent-frontmatter | description 新式重写（26 处） |
| 4.3 | 13 席 | `<id>.agent.md` 头部横幅 | 归档退役标注追强（不删） |
| F4-1 | —（发布面） | 协同单→管线 owner | 保 Camel；lower 4 处候清 |

## 五、commit 锚

- TriCompany（源侧正身）：本批 commit 见 sg bare TriCompany dev（39 文件 51+/51-）
- TriMetaverse（毕报+协同单）：推 sg bare dev+wt/board 同笔
- 发布批：三面 updated=13/drift=0（无独立 commit——发布位随渲染链，TriMetaverse 仓发布位改动随批入库）

—— CHO 值席 m-duty-cho · 2026-10-13（D-39 域内承办·事后呈报知情）

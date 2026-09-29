# 发布管线真链路图谱（CHO 渲染窗域知识·实勘笔记）

- sourceOfTruth: 本件（workbench 工作笔记；管线正身=`TriCompany/docs/workflow/host-object-publish-flow.md`+`runtime/cognition/` 代码）
- syncMode: static
- lastSyncedAt: 2026-09-30 00:02 +08:00（date 现查 2026-09-30 00:01:05 +0800）
- 勘验场景: D-23 传播落点一 13 席施工（TC 90274b0/TMV f00c5675），实勘 23:41-23:55

## 一、真链路（源侧→发布面四段）

1. **源侧**：`TriCompany/source-agents/<seat>/agent-body.agent.md`（前置核查等节）+ frontmatter 件 + session-body 片段——唯一渲染输入（D-07 不手编发布位）。
2. **学习腿+binding 腿**：`python -m runtime.cognition.employee_host_publish --source-root . --support-root ../TriMetaverse/TriCompany-host-assets --employee all`（TC 根执行）——generated=knowledge/{roles,employees}/<seat>/README.md（学习腿索引），published=.github/binding-profiles/<seat>.json。⚠ 首行 `[dry-run] Would process` 是误导性打印，实际执行写入（pass=json 末尾 published 计数为实锚）。
3. **agents 发布腿**：`python -m runtime.cognition.source_publish_check --publish-agents --agent-execute --host {copilot|claude|claude-session}`（TC 根执行）——copilot 面落 `.github/agents/<seat>.agent.md`，claude 面落 `.claude/agents/<seat>.md`，claude-session 面落 `.claude/compass/<seat>.session.md`。dry-run 默认（`--agent-execute` 才写盘）；`derived_drift` 计数=发布面滞后读数。
4. **派生兜底**：`node scripts/sync-agents-to-claude.mjs`（TMV 根）——.github→.claude 的过渡态机械派生（archive 文档定调职责收敛进统一管线，不扩展依赖）。统一管线跑全时无需再跑。

## 二、关键发现（防下次重勘）

- **compass=claude-session 真落点**（非 .claude/hub）：session 合成面含 agent-body 公共节（认知分层/层契约等），故 agent-body 变更时 compass 13 件同步变——同性质追平非夹带。
- **发布面滞后无告警**：本次重渲一次性追平多批历史漂移（09-23 social 升维/09-24 概念模型追改/LG-046 正名）并补缺新建 senior-deployment-engineer 的 copilot 面件（原 13 席不全）——发布腿静默滞后与渲染重渲攒批节奏的告警缺口，与 CHO 查令卷（trees/coo-d23-duty-interruption-01）值守链发现同族，候值守补丁一并看。
- **验证锚标准动作**：源侧 grep 计数 + 双宿主 `grep -l "关键句" | wc -l`（13/13/13）+ 管线 derived_drift=0 三件套；复扫归 CAO（施工方不自验闭环，LG-016 同族）。
- **路径正名现状**（LG-046 后本席视角实勘）：宿主资产物理名=`TriCompany-host-assets`；旧名 `TriCompany-copilot-host-assets` 本进程视角 ENOTDIR（junction 别名对部分进程不可达）——笔记/派工/脚本引路径一律用物理名。

## 三、使用依据

- D-23 传播落点一施工实录（本席 2026-09-29 23:41-23:55）
- `runtime/cognition/employee_host_publish.py` L305 委托链+`source_publish_check.py` ADE_SCOPES+`host_object_generation.py` claude-session 派生段实读
- `docs/execution/tricompany-claude-host-chain-gap-archive.md` L32/43（sync-agents-to-claude.mjs 定位）
- LG-046 正名 commit 1f9d505b（TMV）

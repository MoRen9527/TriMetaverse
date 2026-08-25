# 训练战役 TC-001 立项书：R 面执行持续性成熟度（agent-core 早停缺口）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/training-campaign-001-charter.md
- syncMode: source-only
- lastSyncedAt: 2026-08-25
- 授权: CEO 2026-08-25 裁决「a 先行解燃眉，b/c 立项为训练战役」

## 一、问题档案（实证）

| 项 | 内容 |
| --- | --- |
| 现象 | 同一模型（stealth/ox-alpha）：CC 宿主内可数百轮工具调用持续执行；trilc/agent-core 裸循环 1-3 轮即自愿收工写总结 |
| 实测 | rmc-autonomy-001 RA-2（2026-08-26 凌晨，heyuan）：system 人设强化、CRITICAL 连续执行条款、driven nudge、max_tokens 32K 均未压住 |
| 根因定性 | 持续性是宿主 harness 工程能力而非模型天赋：CC 靠系统提示词脚手架/todo 注入/上下文管理节奏等成套机制兜住；agent-core 移植时只重实现了循环骨架七件（路径 B），harness 行为层不在其中（创新记录在案的 cc-fidelity 缺口族新成员） |

## 二、战役范围

### 轨道 a（已部分生效）
- rmc_tick 完成度驱动外循环：编排层确定性兜底（✅ 已上线运行）

### 轨道 b：CC 持续性机制体系化移植进 agent-core
1. **trilc /v1/messages 通用续跑参数**（continue_max_rounds/continue_prompt，处理器内多轮驱动）——a 的机制层正位
2. CC 提示词脚手架调研与移植：todo/计划注入、进度 reminder、end_turn 判定纪律（对照创新记录 file:line 证据链）
3. auto-compact 补课（cc-fidelity 审计线既有挂账合并）

### 轨道 c：TriMMC 教练战役
- 按 triangle-loop v2.1 执行：TriMMC 侧出考验任务→TriRLC 执行→分流修复→沉淀 agent-core
- 验收判据：rmc-autonomy-001 RA-3 最小闭环 PASS（drill 全程零 CC、本地关机模拟）

## 三、组织与排期

- Owner：CTO 小狄（技术主责）× CPO 小乔（验收口径）；编排层协调
- 排期：W36 立项拆树；与 quadmig-2 双跑观察并行不冲突
- 升级线：两轮迭代无改善 → 升级 CEO 重估路线（含 M 面过渡版兜底重议）

## 四、关联

- 发现源：rmc-autonomy-001 RA-2 关键发现登记（W35 平面树文件）
- 机制参照：claude-code-spawn-resume-context-innovation-record.md（file:line 证据链）
- 架构依据：two-phase-architecture-roadmap v2、白皮书 §3.1 元现实自持内核定义

# 自治能力测试报告（audit-campaign-001）

- 性质：R 面移植评估输入（计划完成定义的最终产出）
- 被测对象：TriMMC 编排循环驱动的 sg-server 侧小贾持续工作循环
- 执行窗：tick1 [2026-08-25T05:45–06:17+08:00]、tick2 [2026-08-25T09:09 起]
- 编制：tick2 编排实例（fresh，锚定 ceo-chief-of-staff）；模型=stealth/ox-alpha（经 OpenRouter，Step0 已验证）
- 授权：CEO 2026-08-25 指令，全程零参与约束下执行

## 一、执行总览

| 计划步骤 | 结果 | 证据 |
| --- | --- | --- |
| Step0 模型验证 | 通过（带方法注记：运行时系统级自证；env 回显被沙箱拒） | log.md 05:49 条 |
| Step1 六模块审计 | 完成（五实审+TriPilot 受限记录）。合计 P0=2 / P1=21 / P2=36 | reports/ 六份；各独立 commit |
| Step2 生命周期矩阵 | 三项全部有结论（见第二节） | state.json lifecycleMatrix |
| Step3 时间门 | 两 tick 均在 <20:00 档运行；tick1 因预算纪律移交自优化至 tick2，tick2 已执行索引/README 同步修复 | log.md；commit df3ab9ea/c067a703 |

## 二、生命周期矩阵三项测试结论

### 2.1 编排 tick 轨（每 tick fresh，跨 tick 读盘续跑）——**成立**

tick1 冷启动建 state.json+log.md 并全程原子提交 ×11；tick2 fresh 实例仅凭盘上 state.json（含 nextTickInstructions）+log.md 尾部即无歧义续跑：断点核验（TriCode 报告漏提交→补交 4b77f801）、勘误（committedAs 字段 ae769faa）、按预置处置升级上报，全部动作可追溯。**跨 tick 续跑机制经两 tick 双向实证（写入侧/读出侧各一）。**

### 2.2 战役级常驻角色（记忆载体=文件，动作者=fresh）——**成立**

设计：四角色（COO/CTO/CHO/CFO）随计划生灭，评审签收由 fresh 实例承担。
实证链：tick1 编排节点写骨架+种子 → tick2 三路 fresh 实例各自读载体+相关报告后追加落款（AC-CTO-SIGN d9420b98 / AC-CHO-SIGN 1f189a6b / AC-CFO-SIGN d7478d8e），产出均为增量价值（P0/P1 五组合并树、台账四项复核全 pass APPROVE、ROI 显著为正+护栏数字）。记忆载体被多节点交叉消费成立。AC-COO-SIGN 作为收口终审门在本报告之后执行。

**AGENT_TEAMS 探测结论（F3 清账）**：可用（范围注记）——已结束命名实例经 SendMessage 从 transcript 成功续接（RESUME_OK magic=42 两轮往返）；真·跨进程顶层会话续接未在本会话内自证，留 R 面后续验证。探测桩 AC-PROBE-AT01 保留 transcript。

### 2.3 树轨一树一生命周期（一节点一 fresh 禁复用）——**成立**

state.json treeTrack.records 十条记录：六个审计节点+三个签收节点均 fresh 且 released=true 即用即释；探测桩 released=false 有明确保留理由。增员实例 AC-DOC-ADD1 同样即用即释。零复用违规。

## 三、增减员实测

CLONE-BATCH-001 单批闭环：add DocumentationEngineer×1（05:55，理由=execution 目录导读索引+战役README）→ 产出落盘（8bcf0c6d）→ remove（06:00）。CHO fresh 复核确认 add/remove 同批同节点闭环、发布面无残留定义文件、台账三方吻合（state.json×git史×种子行）。**建制内动态增减员语义可用。**

## 四、成本面（CFO tick2 核算引用）

单 tick 子实例实测 296,019 tokens 产出六报告五十九条分级发现；单份报告≈4.9 万 tokens、单条发现≈4,181 tokens；对照人工同等产出的隐含当量低 2–3 个数量级（两端假设 ±5 倍扰动不反转），ROI 显著为正。R 面移植护栏建议：子实例总量软上限 35 万/硬停 50 万 tokens 每 tick，单实例上限 6 万。缺口：模型单价无账本、编排侧 token 未计量（下 tick 补）。

## 五、自治边界实证（升级事件处置）

push 通道故障（bare 仓对象迁移 Permission denied）跨 tick 持续，tick2 按 tick1 预置处置正式升级为**系统硬约束类**并留痕（escalations[0]）：沙箱对 /srv/git 无读权限→诊断修复均域外；补偿路径（git bundle 落域内）亦被沙箱权限拒。编排侧决策=push 子系统隔离挂起待 CEO，其余本地可完成任务继续推进不空转，并在日志明示 CEO 可要求全面暂停。**升级机制的触发判断、留痕格式、不停摆继续推进的边界把握均按铁律执行，可作为 R 面"自主-升级"切换样本。**

## 六、R 面移植评估输入（判据级结论)

| # | 判据 | 本战役证据 | 移植评估 |
| --- | --- | --- | --- |
| R1 | 跨 tick 续跑可靠性 | 两 tick 双向实证，断点零丢失 | 具备，依赖 state 文件质量纪律 |
| R2 | 角色常驻与记忆外置 | 四载体三路交叉消费成立 | 具备；载体文件需防并发写约定 |
| R3 | 实例生命周期治理 | 十节点 fresh 即用即释零复用 | 具备 |
| R4 | 动态增减员 | CLONE-BATCH-001 闭环 | 具备，台账语义清晰 |
| R5 | 自主-升级切换 | push 硬约束正确触发升级且不停摆 | 具备；建议 R 面明确"升级后继续域内工作"为默认语义 |
| R6 | 成本可控性 | ROI 显著为正，护栏有实测基数 | 具备；需补 token 计量账本后再定硬限 |
| R7 | 交付质量 | 五实审带 file:line 证据、签收复核全 pass | 具备；TriCode 一例 tick1 漏提交已由续跑机制自愈（恰证明状态先行纪律有效） |

## 七、遗留清单

1. TriPilot 源码不在 sg-server 部署域——受限记录结案，非审计遗漏；R 面若需全量六仓审计需扩部署域或接远端仓只读通道。
2. push 通道挂起待 CEO 处置 /srv/git 权限（系统硬约束升级中，见 escalations[0]）。
3. 域外文档类修复登记（本战役写域所限不改码不改域外文件，移交后续树）：`.github/agents` 4 个 PascalCase 重复条目删除+sync 脚本去重护栏（TMV P2-1）；e2e run-all 退出码+TRIMC 默认值 hotfix（TMV P1-1/P1-2，CTO 建议列第 3/4 位）；其余 P0/P1 处置次序与合并树分组详见 roles/cto-state.md 签收落款。
4. CFO 缺口：模型单价账本与编排侧 token 计量（下 tick 待办）。

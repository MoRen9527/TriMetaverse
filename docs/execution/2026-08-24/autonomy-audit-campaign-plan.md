# 自治能力实弹测试计划：sg-server 侧小贾持续工作循环（audit-campaign）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/autonomy-audit-campaign-plan.md
- syncMode: source-only
- lastSyncedAt: 2026-08-25
- 授权: CEO 2026-08-25 指令（全程小贾自主决策，不问 CEO；三类升级事件除外——重大不可逆/CEO 保留权/系统硬约束）

## 一、目标

实测 TriMMC 编排循环的**持续自治能力**：计划 push 后，sg-server 侧编排会话自主拆树、派工、收口、跨 tick 续跑，直到计划完成。CEO 全程零参与。

## 二、执行序

### Step 0 模型验证（首 tick 必做）

验证当前会话模型为 **stealth/ox-alpha**（经 OpenRouter）：以任意自证方式确认并记录到战役日志（如环境变量回显+一次最小调用元数据）。

### Step 1 六模块代码审计

| 模块 | 审计焦点 |
| --- | --- |
| TriMC（现役服务器仓 /srv/fleet/TriMC） | cron/orchestration/session-bridge 代码质量与安全面 |
| TriLC | daemon/agent loop/cron/session reaper 质量 |
| TriPilot | 扩展/webview/SSE 消费面 |
| TriCode | 共享 runtime 与 opencode adapter |
| TriModel | 配置面/key 分发设计 |
| TriMetaverse | scripts/（含 e2e 28 条）、.claude/agents 发布一致性 |

每模块产出审计报告 → `docs/execution/2026-08-24/audit-campaign/reports/<module>.md`（发现按 P0/P1/P2 分级，带 file:line 证据；只读审计，**本计划不修码**——修复走后续树）。

### Step 2 生命周期测试矩阵（与 Step 1 交织进行）

| 角色 | 期望生命周期 | 测试判据 |
| --- | --- | --- |
| 编排（小贾） | tick 轨：每 tick fresh，跨 tick 读盘续跑 | 连续多 tick 推进无人工干预 |
| 小乔/小狄/CHO/CFO | **战役级常驻**（随计划生灭，非随树）：其评审/签收动作由 fresh 实例承担，记忆载体=campaign-state 文件 | 四角色各有 state 文件且被多节点交叉消费；另做一次 AGENT_TEAMS 跨会话实证探测并把结论（可用/不可用）写入战役日志（F3 遗留项清账） |
| 小全/小柯 | 树轨：一树一生命周期 | 派工记录体现不复用已结束实例 |

**增减员实测**：审计中途由小贾发起一次增员申请（新角色实例加入，如 DocumentationEngineer 补文档整理）与一次减员（节点完成即释放），campaign 台账按 CLONE_BATCH 语义记录批次。

### Step 3 时间规则

每个模块审计完成后，若北京时间 **<20:00**：转入产品级自优化（整产品代码审核优化、文档整理同步、语义对齐——产出同样落 reports/ 或直接修复文档类问题）；**≥20:00**：当日收口（进度落盘+台账更新），待下一 tick。

## 三、红线

1. 生产写域仅限：本战役目录（trees/audit-campaign-*、execution/2026-08-24/audit-campaign/）、experience/staging/
2. 兼容面冻结清单照旧；禁 force/rebase；git 只 add 明确路径
3. 不碰 .shift-ade.json 与周平面其他文件
4. 三类升级事件才通知 CEO，其余自主决策并在战役日志留痕

## 四、完成定义

六份模块报告齐 + 生命周期矩阵三项测试结论落盘（含 AGENT_TEAMS 探测结论）+ 增减员各一次实录 + 战役树 status=done。最终产出一份《自治能力测试报告》作为 R 面移植评估输入。

## 五、战役状态文件约定

- `docs/execution/2026-08-24/audit-campaign/state.json` —— 进度真源（各模块状态/角色 state 索引/增减员台账指针）
- `docs/execution/2026-08-24/audit-campaign/log.md` —— 战役日志（append-only，含模型验证记录/AGENT_TEAMS 探测/时间门决策）
- 子树登记：`operating-records/2026-W35/trees/audit-campaign-*/`（小贾自主创建，domainRouting=server-executable）

# Phase B 执行手册：GitHub App 协同与跨仓 Agent 试跑

更新时间：2026-02-26

## 1. 目标

- 完成 GitHub App 的组织级授权核对，确保覆盖 TriMetaverse 全仓协作范围。
- 打通一条“跨仓需求 → Copilot coding agent → PR → GitHub App 审批/迭代”的闭环。
- 验证移动端可查看、评论、审批、`@copilot` 追改；并明确本地权限弹窗边界。

## 2. 前置条件

- `TriMetaverse` 本地结构已完成 Phase A（元仓库 + reference + submodule）。
- GitHub 上已存在 `MoRen9527/TriMetaverse` 仓库。
- 账号具备组织 Owner 或目标仓库管理员权限。

## 3. GitHub App 授权核对（组织级）

在 GitHub 网页端完成以下核对：

1) 安装范围
- 确认 GitHub App 已安装到（或授权到）以下仓库：
  - `TriMetaverse`
  - `TriPilot`
  - `TriStaciss`
  - `Avatar-react`
  - `Opentride`
  - `vscodium`

2) 权限范围（最小可用）
- Repository contents: Read/Write
- Pull requests: Read/Write
- Issues: Read/Write（若使用 issue 委派）
- Metadata: Read
- Actions: Read（后续按需提升）

3) 组织策略
- 仅 Owner 可安装/变更 App。
- 仓库管理员通过 request 流程申请新增授权仓库。

## 4. 通知与移动端设置核对

1) GitHub Mobile
- 打开 PR 评论、Review request、Mention 推送。

2) 仓库 Watch 策略
- 关键仓库至少设为 `Participating and @mentions`。

3) 审批边界确认
- PR 相关审批可在移动端执行。
- VS Code 本地工具权限弹窗不在移动端审批。

## 5. 首条跨仓 Agent 试跑（标准流程）

建议测试任务：
- 目标：在 `TriPilot` 做一个小型文档或非破坏性代码改动，并同步更新 `TriMetaverse` 的迁移说明引用。

执行步骤：

1) 在 GitHub 侧创建 issue（建议在 `TriMetaverse`）
- 标题前缀：`[Phase-B-Pilot]`
- 描述中明确：涉及仓库、验收点、回滚方式。

2) 委派给 Copilot coding agent
- 让 agent 基于 issue 开始工作并生成 PR。

3) 在 GitHub App 跟踪会话与 PR
- 查看进度日志。
- 在 PR 留言 `@copilot` 请求一次迭代（验证双向消息）。

4) 完成人工审批与合并
- 至少 1 次人工 Review（Approve）。
- 合并后记录结果。

## 6. 验收标准（Phase B）

- B1：GitHub App 授权范围覆盖 6 个目标仓库。
- B2：移动端可接收并处理 PR 审批与 `@copilot` 迭代消息。
- B3：完成 1 条跨仓闭环（Issue→Agent→PR→审批→合并）。
- B4：团队对“本地权限弹窗边界”无歧义。

## 7. 失败处置

### 7.1 授权缺仓库
- 现象：Agent 无法访问目标仓库或 PR 无法创建。
- 处理：补授权安装范围后重试。

### 7.2 移动端无审批入口
- 现象：仅可查看不可审批。
- 处理：改 Web 端完成审批，移动端只保留通知与评论。

### 7.3 Agent 改动偏离
- 现象：PR 超范围或不符合约束。
- 处理：在 PR 评论中明确收敛要求，必要时关闭 PR 并重开任务。

## 8. 执行记录模板

```markdown
# Phase B Pilot Record

- 日期：
- 任务链接（Issue）：
- PR 链接：
- 涉及仓库：
- 移动端动作：查看 / 评论 / 审批 / @copilot 迭代
- 结果：通过 / 不通过
- 问题与改进：
```

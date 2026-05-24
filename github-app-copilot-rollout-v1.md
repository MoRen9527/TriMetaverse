# TriMetaverse GitHub App + Copilot 协同落地清单（v1）

更新时间：2026-02-26

## 1. 目标（本期）

- 以 `TriMetaverse` 作为总入口仓库（元仓库），统一打开工作区与参考源码。
- 保持 `Tripilot` / `Tristaciss` / `Avatar-react` / `Tride` / `vscodium` 独立仓库演进。
- 让“需要远程跟进与审批”的开发任务优先走 GitHub Copilot coding agent + PR 流程。
- 在 GitHub App（移动端）实现：查看进度、回复消息、PR 审批、@copilot 迭代。

## 2. 能力边界（必须统一认知）

- 可同步到 GitHub App：
  - Copilot coding agent 会话进度（GitHub 侧）
  - PR 评论、Review、@copilot 迭代
  - 仓库通知与审批（PR 维度）
- 不可直接在 GitHub App 完成：
  - VS Code 本地 Copilot 的本地工具权限弹窗（文件写入 / 终端执行）
- 结论：
  - 需“远程审批与消息同步”的任务，统一走 GitHub 上的 agent + PR。
  - 本地会话继续保留给快速开发与本机调试。

## 3. 仓库角色与边界

- 元仓库：`TriMetaverse`
  - 存放：工作区编排、架构文档、参考源码索引、submodule 指针。
  - 不承载：运行期大工件（视频、渲染产物、归档包）。
- 业务仓库：
  - `Tripilot`：VSCodium 上的自有 Copilot UI / 能力。
  - `Tristaciss`：后端平台（模型 API、用户体系等）。
  - `Avatar-react`：前端入口（与 Tristaciss 分离演进）。
- 上游承载仓库：
  - `vscodium`：编辑器载体，跟随上游兼容。
  - `Tride`：多“轮子”适配平台（先 `opencode`，后续可扩展 `codex` / `claude code` 等）。

## 4. 参考源码策略（Reference）

### 4.1 统一落点

- 参考源码统一放在 `TriMetaverse/reference/`。
- `Tripilot/reference/` 迁移为过渡态，最终清空并只保留必要兼容层。

### 4.2 管理方式

- 每个参考开源项目使用 submodule 管理，不用“目录里嵌套 .git 的裸拷贝方式”。
- 建立登记台账（建议文件：`TriMetaverse/reference/REGISTRY.md`）：
  - 来源仓库 URL
  - 许可证
  - 引入目的
  - 负责人
  - 更新频率
  - 允许 Copilot 常驻参考的目录范围

### 4.3 改造代码归属

- 参考项目只做对照，不直接承载业务改造提交。
- 业务改造代码必须进入业务仓库（Tripilot / Tristaciss / Avatar-react / Tride）。

## 5. GitHub App 安装策略

### 5.1 安装范围

- 推荐：组织级安装并授权到以下全部仓库：
  - `TriMetaverse`
  - `Tripilot`
  - `Tristaciss`
  - `Avatar-react`
  - `Tride`
  - `vscodium`

### 5.2 权限建议（最小可用）

- Repository contents：Read / Write（按实际需要最小化）
- Pull requests：Read / Write
- Issues：Read / Write（如果你用 issue 委派 agent）
- Metadata：Read
- Actions：Read（如需触发 / 观察 workflow 再按需提升）

### 5.3 组织策略

- 仅组织 Owner 可安装 / 变更 GitHub App。
- 仓库管理员通过 request 流程申请新增授权仓库，避免权限漂移。

## 6. VS Code 本地工作区标准化

### 6.1 本地拉取方式

- 以 `TriMetaverse` 为入口 clone（含 submodule）：

```bash
git clone --recursive <TriMetaverse-repo-url>
```

- 后续更新：

```bash
git pull
git submodule update --init --recursive
```

### 6.2 工作区打开规则

- 开发主入口统一使用 `trimetaverse.code-workspace`。
- 只在需要时额外打开超大参考仓库目录，避免 Copilot 上下文噪声。

### 6.3 账号一致性

- VS Code 中 GitHub 登录账号与 GitHub App / Copilot 订阅账号保持一致。
- 每个工作区确认 Copilot 账号指向同一主体，避免消息与权限割裂。

## 7. Copilot 协同操作规范（关键）

### 7.1 两类任务分流

- A 类（需要远程审批 / 移动端同步）：
  - 从 GitHub 侧发起（Issue / Agent）或在 VS Code 委派到 coding agent。
  - 产出 PR，在 GitHub App 审批与 @copilot 追改。
- B 类（本地快速改动 / 调试）：
  - 直接在 VS Code 本地 Copilot 会话完成。
  - 本地权限弹窗在本机处理，不期待移动端同步批准。

### 7.2 合并前统一门禁

- 所有仓库统一走 PR，禁止直接推主分支。
- 需要至少 1 次人工 Review（你或团队成员）。
- 可选：要求 CI 绿灯后允许合并。

## 8. 审批矩阵（v1）

| 场景 | 审批方式 | 推荐端 | 备注 |
| --- | --- | --- | --- |
| Copilot coding agent 产出 PR | PR Review | GitHub App / Web / VS Code | 支持 @copilot 继续迭代 |
| 代码合并 | PR Approve + Merge | GitHub App / Web | 与分支保护一致 |
| Actions 运行环境审批 | Environment Approval | Web 优先 | 移动端能力存在边界 |
| VS Code 本地工具权限 | 本地弹窗批准 | VS Code 本机 | 不在 GitHub App 侧完成 |

## 9. 7 天落地节奏（可执行）

### Day 1：仓库与权限基线

- 完成 6 仓库 Git 远端与分支保护检查。
- 完成 GitHub App 组织级安装与仓库授权。
- 输出《仓库权限矩阵》v1。

### Day 2：Reference 中心化

- 创建 `TriMetaverse/reference/`。
- 迁移 `Tripilot/reference` 到 TriMetaverse。
- 将 `vscode-copilot-chat` 规范成 submodule。
- 建立 `reference/REGISTRY.md`。

### Day 3：工作区与路径收口

- 校正 `trimetaverse.code-workspace` 指向统一入口路径。
- 验证 Tripilot / Tride / vscodium 关键任务与启动配置不回归。

### Day 4：Copilot 协同流程试跑

- 选择一个跨仓任务，使用 coding agent 生成 PR。
- 在 GitHub App 上完成评论、@copilot 迭代、审批。

### Day 5：审批规则固化

- 在各仓配置分支保护（最少 1 审批 + 禁止直推主分支）。
- 定义“哪些任务必须走 A 类流程（可远程审批）”。

### Day 6：团队使用手册

- 产出 2 页简版 SOP：
  - 如何在 VS Code 发起 / 跟踪 coding agent
  - 如何在 GitHub App 做审批与 @copilot 迭代

### Day 7：验收

- 验收项：
  - 本地 TriMetaverse 工作区可见全量代码与 reference
  - GitHub App 可看到本周试跑任务的完整 PR 轨迹
  - 至少 1 条从“提需求 → agent 改码 → 移动端审批 → 合并”的闭环通过

## 10. 验收标准（DoD）

- D1：TriMetaverse 为唯一开发入口仓库（本地工作区层面）。
- D2：Reference 中心化完成，新增参考项目有登记台账。
- D3：GitHub App 能完成 PR 级别查看、评论、审批、@copilot 迭代。
- D4：团队明确本地权限审批边界，不再误解为移动端可批本地工具请求。
- D5：至少 1 条跨仓开发闭环成功并可复盘。

## 11. 风险与缓解

- 风险：把“本地权限弹窗”误认为“GitHub App 可远程批准”。
  - 缓解：SOP 明确 A / B 任务分流。
- 风险：submodule 更新断裂导致本地缺参考源码。
  - 缓解：固定 `--recursive` 拉取与 CI 检查 `.gitmodules`。
- 风险：超大参考仓库污染 Copilot 上下文。
  - 缓解：按需打开目录，限制常驻索引范围。

## 12. 下一版（v2）预留

- 增加“跨仓 issue 路由模板”（将任务自动分派到对应仓库）。
- 增加“Agent 任务标签规范”（`tri:tripilot` / `tri:backend` / `tri:wheel`）。
- 增加“Reference 自动更新机器人”（定期更新 submodule pointer 并开 PR）。

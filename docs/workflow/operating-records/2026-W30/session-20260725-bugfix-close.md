# Session Close: 2026-07-25 trilc chat 四轮同源 bug 修复 + 测试债清理

## Unpushed Commits（全部在 dev 分支）

> ⚠️ 以下 6 个 commit 为本地提交，**尚未 push** 到远程。

| 仓 | commit 内容 | 文件数 |
|---|---|---|
| TriMetaverse | agent 治理（P0 编码 + P1/P2 结构 + sync 脚本 + backlog 归档）| 19 |
| TriModel | deepseek-chat/reasoner 退役适配 — 改名+改路由+fallback 修复 | 10 |
| TriMC | tool_calls 容忍性合并 + FALLBACK_MAP 退役模型名更新 | 3 |
| TriMC | P4.x 共享化后 18 项测试债清理（contract 基准对齐）| 8 |
| TriLC | AgentEvent 双源去重（content + tool_use）— 双端收口 | 6 |
| TriLC | deepseek-chat→v4-pro/v4-flash 默认模型名 + docs 纪律更正 | 2 |

推送: `git push origin dev`（四仓分别执行）

## 修复链路总览

**起点**: TriCade 安装版 `trilc chat` 模型回复两句重复

| Bug | 现象 | 层 | 根因 | 修复 | 验证 |
|---|---|---|---|---|---|
| ① content 重复 | 回复两句重复 | TriLC 消费层 | agentLoop 双发 delta+assistant_message，消费端同时转发两类内容 | 4 处 !deltaContent 防御 | PASS |
| ② tool_calls 累积 | shell_execshell_exec… | agent-core 合并层 | toolCallMap 无脑 +=，DeepSeek 重复发 name+累积串 arguments | 1 处容忍性合并 | PASS（反证）|
| ③ Turn-2 连锁失败 | 第二轮全挂 | trimodel 路由+fallback | deepseek-chat/reasoner 退役，fallback 链全收敛到退役名 | 改名+改路由（10 处/三仓）| PASS（tap 抓包）|
| ④ converter 重复开块 | tool_use block 双份 | TriLC 消费层（双端）| 同 ①，tool 维度未去重 — tool_call 事件也开 block | 按 id 去重（Set<string>）| PASS（真实 HTTP+反证）|

**四个同源**: 都是对 agentLoop 双发事件（聚合+增量）在 content/tool_calls/tool_use 三个维度的错误处理。

## 测试债清理

- TriMC 18 项存量失败（P4.x 共享化重构遗留）→ 455/455 全绿（0 后端修复）
- 8 测试文件按 agent-core 新契约对齐（tier 工具集/reason 文案/import 路径/字段结构）

## 部署注意

- **TriCade MSI 重打包**：安装版（`C:\Program Files\TriCade\`）跑旧 dist。需跑 `scripts/build-desktop.ps1`（需 WiX Toolset + PowerShell + Node.js）。TriLC dist 已 build；打包被 auto mode 挡，需手动执行：`.\scripts\build-desktop.ps1 -Version v0.2.0`
- **TriMC 工作区分案**：`app.ts`（S7 mirror）+ `src/mirror/`（未跟踪）+ `qa-tmp/`（已清理）为先前遗留，不混入本次提交
- **TriLC 工作区遗留**：`app.ts`（S7+Bug3 模型名混合）、`package.json`/`tsconfig.json`/`cli.ts`、`src/tui/`（未跟踪）、`docs/workflow/operating-records/` 为在途改动，不混入本次提交
- **TriMetaverse 工作区遗留**：`.github/instructions/`、`.github/prompts/`、`docs/` 其他文件为会话前既有改动，不混入

## Backlog 归档

已写入 `TriMetaverse/docs/registry/code-state.md` ## Pending Backlog:
- BACKLOG-001: trimetaverse/models 退役模型名遗留（P1）
- BACKLOG-002: DeepSeekAnthropicProvider 消息格式转换（P2）
- BACKLOG-003: Tristaciss 模型名映射审计（P2）
- BACKLOG-004: checkShellPolicy 带空格路径缺陷（P1）
- BACKLOG-005: TriMC 工作区遗留改动分案提交（P2）
- BACKLOG-006: TriMC 18 项测试债已清零（溯源）

## 协作链

本次 4 个 bug 修复 + 测试债清理通过 5 轮 agent 协作链驱动：
小贾(总调度) → 小狄(CTO 复核/方案) → 小全(Dev 执行) → 小柯(QA 验证)

每轮均带反证/抓包/契约溯源等独立验证，非仅信任自测。

## 临时产物清理

- `/tmp/qa-e2e-*` — 已删除（小柯 SSE 抓包证据）
- `/tmp/qa-tap/` — 已删除（tap 代理数据）
- `/tmp/qa-trilc-data/` — 已删除
- `TriMC/qa-tmp/` — 已删除（小柯/小全诊断产物）
- `.claude/agents.bak-*` — 已删除（编码修复备份）

## 后续处理（2026-07-26）

### 已完成
- **push 四仓**：TriMetaverse/TriModel/TriMC/TriLC 全部 push 到 origin/dev（up-to-date）
- **TriCode 仓库恢复**：本地 TriCode 曾损坏（.git 缺 HEAD + 内容空 + 目录被占用 mv 失败），用 robocopy 绕过目录锁从 TriCode-fresh（远程 clone）恢复内容 + .git，npm run build 验证通过；TriCode-fresh 已删
- **v0.2.0 zip 打包**：`scripts/build-desktop.ps1`（TriCode-fresh 变体）产出 `output/TriMetaverse-Desktop-v0.2.0-windows.zip`（46MB），含修复 trilc + 完整 tri-code + tripilot + config

### 热替换方案（线上快速生效，临时）
- 安装版 trilc daemon 由 tricade.exe（PID 38008）拉起，运行 `resources\app\tools\trilc\dist\index.js`，当前为旧版（无修复标志）
- 因 `C:\Program Files\` 需管理员权限，提供一键脚本 **`scripts/hot-swap-trilc-v0.2.0.ps1`**：停 tricade → 备份 → robocopy 热替换含修复 trilc → 验证 3 个修复标志 → 提示重启
- 用法：右键以管理员运行，重启 TriCade 后线上 trilc 即含全部 4 修复

### MSI 立项（独立打包工程，审核评估中）
- TriCade MSI 重做是复杂 Electron 打包工程，非简单 candle 旧 .wxs：
  - 旧 `.wxs`（7/22）引用的 tricade-check 文件不含本次修复
  - Bundle 依赖 Base（`Installed OR APPLICATIONFOLDER` 条件）
  - trilc 深度内嵌 Electron app，node_modules.asar 仅 28 字节空占位
  - 无 heat/candle 自动化脚本（纯手工流程）
- 已启动立项审核评估（CTO），摸底 TriCade Electron 打包体系 + 方案设计，产出后另立 backlog/执行树

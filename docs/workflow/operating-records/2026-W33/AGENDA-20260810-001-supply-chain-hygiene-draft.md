# AGENDA-20260810-001 供应链卫生基线（ChainDrop 复盘）— 周会议题草案

> **提出人**：CEOChiefOfStaff（小贾）｜**日期**：2026-08-10｜**状态**：待周会裁决
> **会议**：W33 周会 ｜ **参与裁决**：CEO / CTO / DeploymentEngineer
> **本文件**：周会前的落地方案草案。周会上逐项过"建议决议"，拍板后回填决议区。

---

## 一、背景（事实摘要）

| 项 | 内容 |
| --- | --- |
| 事件 | 2026-08-04 npm 供应链蠕虫 **ChainDrop**（Shai-Hulud 家族新变种）：4 小时投毒 **444 包 / 2,212 版本**，起点 keyv@6.0.0（周下载 1.5 亿），波及 jaredwray / @nebula.js / @onereach / servicetitan / ornikar / @qlik / @umacloud 等 8+ 命名空间 |
| 攻击模式 | preinstall 脚本下载 Bun 1.3.13 → 执行 710KB 混淆载荷（math_init.js / Math_Symbol.js）→ 窃取 npm/GitHub/云凭据 + **AI agent 凭据（Claude/OpenAI/Codex）** → 写入 Claude Code hooks / VS Code tasks.json 持久化 |
| 关键特点 | 第二波为**窃取凭据 republish 同名同版本**投毒——版本号正常 ≠ 安全，需验 integrity 签名 |
| 本地审计 | **2026-08-10 全工作区审计：未受影响**（43 目录 / 14 个有依赖模块全覆盖：无 umadev/@umacloud 命中、keyv 家族均为合法版本、载荷扫描零命中、12 模块 npm audit 无 ChainDrop 包、无 hooks/tasks.json 后门） |

**结论**：环境未被感染、无需凭据轮换。但事件暴露 3 项可执行改进，本次议题产出决议。

---

## 二、方案①：默认禁用 install 脚本（npm 12 / ignore-scripts）

### 现状

- 全局 npm 10.9.4（nvm4w），各模块 `npm install` 默认执行所有 preinstall/postinstall 脚本——ChainDrop 正是靠 preinstall 进入执行链
- CI（build-tricade.yml）同样默认跑脚本

### 选项

| 选项 | 做法 | 取舍 |
| --- | --- | --- |
| **A. 升级 npm 12（推荐）** | 全局切 npm 12（官方**默认禁用 install 脚本** + 白名单 allow 机制）；本地 + CI 同步 | 官方方向、机制完整；需验证 nvm4w 兼容 + 白名单语法实测（npm 12 文档为准） |
| B. 保持 npm 10 + `.npmrc` 全禁 | 各模块根 `.npmrc` 加 `ignore-scripts=true` | 改动小但**无 per-package 白名单**，需要 scripts 的包只能手动重建，过渡体验差 |
| C. 仅 CI 切换 | 构建流水线先切 npm 12，本地暂缓 | 最小风险、覆盖"交付面"；本地开发面留缺口 |

### 已知需白名单的包（预判，CTO 实测确认）

- **esbuild**（TriLC / TriPilot 构建依赖）：postinstall 下载平台二进制，**必须放行**
- 备查：@swc/core、electron、node-gyp 系（如当前依赖树存在则一并验证）

### 建议决议

1. 全局 + CI 升级 npm 12（选项 A 为主，过渡期 CI 先行）
2. 白名单机制启用：默认禁、仅 allow 实测确认的包
3. 回滚开关：任一模块构建异常 → `.npmrc` 临时 `ignore-scripts=false` 并回滚该模块依赖升级

### 落地动作

| # | 动作 | 负责 | 时限 |
| --- | --- | --- | --- |
| 1 | 验证 npm 12 与 nvm4w 兼容、白名单语法 | CTO | 8/12 |
| 2 | 实测白名单包清单（esbuild 等） | CTO→TestEngineer | 8/12 |
| 3 | CI 切 npm 12 + 禁脚本 + allowlist | DeploymentEngineer | 8/13 |
| 4 | 各模块根 `.npmrc` 生效 | 各模块 owner（小贾协调） | 8/14 |
| 5 | 验收：全新环境 `npm ci` 不跑未白名单脚本 + esbuild 构建正常 + CI 绿 | TestEngineer | 8/14 |

---

## 三、方案②：lockfile 变动 review 纪律

### 现状

- 无正式纪律：lockfile 变更混在业务提交里，无 review 关卡（本次审计靠人工逐项 grep）
- npm 自带 **`npm audit signatures`**（校验 registry 签名，可检出 republish 包）未启用

### 建议纪律（三层）

| 层 | 机制 | 说明 |
| --- | --- | --- |
| L1 提交层 | lockfile 变更**单独 commit** + 提交前 `git diff package-lock.json` 人工过一遍 | 立即生效，零成本 |
| L2 CI 层 | build-tricade.yml 加 job：`npm audit signatures` + lockfile 大变更（>30 行）标记需人工确认 | 工具化门禁，防漏网 |
| L3 周会层 | 周会 checklist 增加"供应链扫描"项（见方案③脚本） | 周期性兜底 |

### 落地动作

| # | 动作 | 负责 | 时限 |
| --- | --- | --- | --- |
| 1 | CI 加 `npm audit signatures` job + lockfile diff 标记 | DeploymentEngineer | 8/14 |
| 2 | 提交规范补进 docs（lockfile 单独 commit） | CEOChiefOfStaff | 8/14 |
| 3 | 周会 checklist 挂供应链扫描项 | CEOChiefOfStaff | 8/14 |

---

## 四、方案③：审计基准归档 + 复检触发条件

### 现状

- 审计结论仅存于会话记忆（memory），非正式可引用资产
- 排查逻辑（grep IoC + 载荷扫描 + npm audit）未固化为可重复脚本

### 落地

| # | 动作 | 产出 | 负责 | 时限 |
| --- | --- | --- | --- | --- |
| 1 | 审计证据链归档 | `docs/security/supply-chain-audit-2026-08-10.md`（新建 docs/security/，基准表 + 证据链） | 小贾 | 8/11 |
| 2 | 排查脚本固化 | `scripts/scan-supply-chain-iocs.ps1`（复用本次逻辑：umadev/@umacloud/载荷文件名扫描 + 全模块 npm audit） | DeploymentEngineer（小贾提供逻辑） | 8/12 |
| 3 | 复检触发条件 + 月度巡检挂周会 | 触发条件写入 `docs/security/` README，月度巡检首周执行 | 小贾 | 8/14 |

### 复检触发条件（建议写死）

1. **lockfile 变动**：任一模块 package-lock.json / pnpm-lock.yaml 有 diff → 提交时按方案② review + 跑扫描脚本
2. **生态事件**：npm 供应链事件公告（StepSecurity / CSA / socket.dev）→ **48h 内**跑扫描脚本 + 全模块 npm audit
3. **工具链变更**：npm / pnpm / bun 版本升级或新增 → 跑一次扫描
4. **月度巡检**：每月第一个工作周跑 `scan-supply-chain-iocs.ps1`，结果挂周会

---

## 五、决议区（周会回填）

| # | 方案 | 建议 | CEO 裁决 | 备注 |
| --- | --- | --- | --- | --- |
| 1 | ① 默认禁脚本 | 升级 npm 12 + 白名单，CI 先行 | 待定 | |
| 2 | ② lockfile review | L1+L2+L3 三层全上 | 待定 | |
| 3 | ③ 审计归档 | 归档 + 脚本 + 4 项触发条件 | 待定 | |

> 决议后：本文件留在 2026-W33 目录备查，落地状态跟踪挂 §6 议题表（OP-202608-W33-001.unresolved-items.md）。

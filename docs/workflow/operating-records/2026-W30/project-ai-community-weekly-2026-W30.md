# 项目级 AI 共学周记 — 2026-W30

> 记录人：小贾（CEOChiefOfStaff）  
> 日期：2026-07-22

---

## 2.3 GPT-5.6-Sol vs DeepSeek：安装态心智模型差距

### 背景

W30 进行了大量 Agent 配置收敛工作：TriCompany 六件套、contract resolver、TriLC `/internal/v1/agents` 端点、TriPilot Phase 2 agent 页。全部代码在源码工作区验证通过后，打包 Bundle MSI 安装到 TriCade，却发现 Settings→Agents 始终显示"No TriCompany agents"。

### GPT-5.6-Sol 的排查路径（与 DeepSeek 对照）

| 步骤 | GPT-5.6-Sol 做了什么 | DeepSeek（Copilot CLI）做了什么 |
|------|---------------------|-------------------------------|
| 1 | **先确认运行环境**——检查进程是 VS Code 还是 TriCade | ❌ 未做。全程假设用户在 TriCade 里测试 |
| 2 | **哈希对比**——比较安装目录文件与源码仓库的 SHA256 | ❌ 未做。只比对了文件大小 |
| 3 | **MSI 元数据查询**——检查 Upgrade 表、ProductCode、注册表残留 | ❌ 未做。不知道有 7 条同版本残留 |
| 4 | **发现 npm symlinks 断裂**——`cp -r node_modules` 丢失了传递依赖（croner/zod/dotenv） | ❌ 未发现。反复重启 TriLC 报 ECONNREFUSED |
| 5 | **用 `npm install --install-links` 重建自包含依赖** | ❌ 未尝试 |
| 6 | **发现合同从未打进 Bundle**——contract resolver 在安装态找不到 `../TriCompany/` | ❌ 完全遗漏。全程在源码工作区测试，contract resolver 能找到 TriCompany |
| 7 | **修复 WiX 路径在 Git Bash 中的兼容性**——发现工具在根目录而非 bin/ | ❌ 未发现。此前使用的是 WiX 的 symlink（`build/windows/msi/bin`） |
| 8 | **同版本升级修复**——WXS 不允许 `1.126.04524` 覆盖 `1.126.04524`，改到 `1.126.04525` | ❌ 未发现。反复安装同一版本而不生效 |
| 9 | **安装态 daemon 端到端验证**——在独立端口 8712 启动，确认 12/12 agent + 12/12 prompt | ❌ 从未在安装态启动 TriLC 验证 |

### 根因分析

两个 AI 的核心差距不在代码能力，在**测试心智模型**：

- **DeepSeek（Copilot CLI）的工作模型**：源码工作区 → 编译 → 验证 API → 打包。所有验证都在开发环境做，"文件在源码里能跑 = 打包也能跑"。
- **GPT-5.6-Sol 的工作模型**：源码编译 → 构建 MSI → **在安装目录里启动 daemon** → 验证 12 agent → 确认后才放行。

DeepSeek 从未切换视角到"一个刚装完 MSI 的用户打开 TriCade 看到什么"。这就是合同资产未打包、npm 依赖断裂、MSI 重复安装不生效三个问题的共同根因。

### 教训

1. **打包后必须在安装态验证**——不能只 curl 源码工作区的 TriLC。应该在 `C:\Program Files\TriCade\resources\app\tools\trilc\` 里启动 daemon 做端到端测试。
2. **npm link 的包不能 `cp -r`**——开发环境里的符号链接在安装环境变成空壳。必须用 `npm install --install-links` 实体化依赖。
3. **MSI 升级规则要自测**——同版本覆盖不生效时，不应反复重装，应该读 WXS Upgrade 表确认版本范围。
4. **比较文件哈希，不只看大小**——大小可能偶然相同。

---

## 变更清单（GPT-5.6-Sol 代码级修改）

### `vscodium/build/windows/msi/build-bundle.sh`（+40 行）

- 新增 `TRICOMPANY_SOURCE_DIR` 等变量
- 新增 `tools/trilc/contracts` 目录 + 12 份合同复制
- `npm install --install-links` 替代 `cp -r node_modules`
- 新增 `node --input-type=module -e "await import(...)"` 门禁
- 合同数量为零时 `exit 1`
- WiX 路径兼容修复（`${WIX}/bin` → 自动检测根目录工具）

### `TriPilot/src/extension.ts`（大幅重构）

- 新增 `resolveTriLCControlCommand()` — 优先从 TriCade 内置路径发现 TriLC
- 新增 `TRICOMPANY_SOURCE_PATH` 自动发现（工作区 TriCompany 或 TriCade bundled contracts）
- 移除 `TOOL_SETS`、`ASK_STUDY_ALLOWED_*` 等旧硬编码
- auto-start 改为使用 `resolveTriLCControlCommand` 的健康检查闭环

---

**记录时间**：2026-07-22 10:23 CST  
**分类**：ai-tooling-comparison-observation  
**跟进**：将"安装态验证门禁"加入 TriCade 构建流程 checklist

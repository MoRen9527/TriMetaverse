# Copilot CLI 仓库钩子事实（@github/copilot 1.0.51·2026-11-28 读包+活体实测）

- **加载**：git 根下 `.github/hooks/**/*.json`（glob·逐个校验）；用户级钩子目录 `~/.copilot/hooks/`（不依赖仓库受信）。形＝`{hooks:{"UserPromptSubmit":[{matcher?,"hooks":[{type:"command",command,timeout}]}]}}`。
- **事件名**：PascalCase（`UserPromptSubmit` 等）会被归一化到 camelCase（`userPromptSubmitted`）并带 VS Code 兼容语义——直接写 PascalCase 可用。
- **执行**：`command` 归一到 bash/powershell；**Windows 下由 PowerShell 执行**（`-nop -nol -c`）；钩子输入 JSON 写入子进程 stdin；`timeout`→`timeoutSec`。
- **输出契约（踩坑实锚）**：stdout 先 `JSON.parse`；`userPromptSubmitted` 只消费 `additionalContext`／`modifiedPrompt`／`suppressOutput`／`handled`／`responseContent`——`{"systemMessage":…}` 不在消费集＝**静默丢弃**（bod-copilot 验收三红：「无系统消息」）。注入器正形＝单行 `{"additionalContext":"…"}`。
- **受信前置**：仓库钩子只在文件夹受信（`trustedFolders`·`~/.copilot/settings.json`）时加载；提示模式（`-p`）另可开关 `GITHUB_COPILOT_PROMPT_MODE_REPO_HOOKS=true`。`~/.copilot/` 只有 config.json 没有 settings.json＝从未受信。**开关只在提示模式分支生效（app.js 仅出现 1 处）**；交互式 TUI 走 `loadDeferredRepoHooks`（受信后延迟加载）——TUI 用法仍须先受信；bod-copilot 的启动壳（`~/.claude/settings.presets/bod-copilot-clean-start.ps1`·SDE·双键重读+开关）走提示模式，故开关管用（11-28 三读数全绿实锚）。
- **实测法**：临时项目 `.github/hooks/probe.json`（输出带标记的 additionalContext）→ `copilot -p "复述标记" --allow-all-tools`（开关开/关各一次）→ 开=复述标记·关=NONE。密钥从注册表读入变量再导出（父链 env 是旧值）。
- **旁证**：仓内 `.github/hooks/ceo-chief-of-staff-workflow-sync.json` 零消费方≠形式不成立（只是没人用）；读包工具＝python 对 app.js 做定点窗口抽取（grep -o 大窗口在 12MB 单行文件上会超时）。
- 正身卷=`docs/workflow/operating-records/2026-W48/trees/fade001-evolve-20261123/cto-copilot-bod-relay-tech-20261127.md` §五。

# PreToolUse 钩子可改写工具入参（updatedInput）·占位符现填（DP-052·2026-11-28 实测）

- **能力事实**（Claude Code 2.1.332·本机活体三轮）：PreToolUse 钩子输出 `{"hookSpecificOutput":{"hookEventName":"PreToolUse","updatedInput":{…}}}` 可**改写 SendMessage 的发信入参**，收件侧实收改写后的文本；**不必带 `permissionDecision:"allow"`**（只回 updatedInput 也生效）→ 不触碰权限面。发端会话记录里留的是**原始入参**（不是改写后值）。
- **占位符教训**：语义化模板（`{{NOW}}`）会被模型**自己填掉**（钩子看到的消息里已无占位符）——占位符必须是非语义记号（如 `⟦SIG⟧`）＋要求逐字复制；闸对「该有而没有」必须拒（模型代填=另一种手写）。
- **实测方法**：临时项目 `%TEMP%\cto-dp052-proto\` 仅该项目 `.claude/settings.json` 挂钩子（零现役配置改动）→ 清 CLAUDE* env → `claude -p --model sonnet --dangerously-skip-permissions --output-format stream-json --verbose` 发信给本席自收 → 对表「流里 tool_use 原始入参／钩子日志／收件侧实收」三面。
- **用途**：D-47 落款纪律的治本形（落款=记号＋钩子现填·倒挂/整十秒/掩码三判据退役）；灰度=钩子内 env 三态 `D47_FILL_MODE=off|fill|enforce`（不动 settings）；全席缺省 enforce 才动配置面。
- 正身卷=`docs/workflow/operating-records/2026-W48/trees/fade001-evolve-20261123/cto-dp052-feasibility-20261128.md`（TMV b5763d37e）。

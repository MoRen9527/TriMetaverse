# TriDev Host Usage Profile - copilot-chat

- displayName: GitHub Copilot Chat
- protocolMode: rules-first
- maturityTier: copilot-first
- primaryTrigger: tridev: <需求描述>
- resumePrompt: tridev: 现在下一步是什么

## Official Surfaces
- Project root `AGENTS.md`
- Project-level `.github/copilot-instructions.md`
- Project-level `.github/skills/tridev-core/SKILL.md`
- Project-level `.github/agents/tridev.agent.md`

## Runtime Artifacts
- `TriDev-copilot-host-assets/docs/runs/*/workflow-state.json`
- `TriDev-copilot-host-assets/docs/runs/*/SESSION_BRIEF.md`
- `TriDev-copilot-host-assets/docs/runs/*/knowledge-bundle.json`
- `TriDev-copilot-host-assets/docs/runs/*/host-prompt-context.json`
- `TriDev-copilot-host-assets/docs/runs/*/coding-task-plan.json`

## First Response Contract
- 明确说明 TriDev pipeline mode 已激活，而不是普通聊天模式。
- 先读取 AGENTS.md、README.md，以及相关 run 的 knowledge-bundle.json / SESSION_BRIEF.md / workflow-state.json。
- 如果没有活动 run，明确当前从 DISCOVERY 开始，并说明十阶段顺序。
- 如果存在活动 run，先复述当前阶段、nextAction 和 gate / review 约束，再继续执行。

## Working Agreement
- 研究、编码、调试、改文件继续使用宿主原生能力。
- run 状态、playbook、role adapter、task-plan、gate、review 和 bundle 通过 `python -m tridev.cli` 落盘。
- 进入 tracked execution 前，先读取 knowledge bundle 和 prompt context，而不是只依赖会话记忆。
- 进入 CODING 及之后阶段时，优先留下真实源码、测试、部署或运行证据，而不是只写叙述文档。

## Recommended Commands
- `python -m tridev.cli status --root . --run-id <run-id>`
- `python -m tridev.cli knowledge-bundle --root . --run-id <run-id>`
- `python -m tridev.cli playbook --root . --run-id <run-id>`
- `python -m tridev.cli role-plan --root . --run-id <run-id>`
- `python -m tridev.cli role-adapters --root . --run-id <run-id>`
- `python -m tridev.cli task-plan --root . --run-id <run-id>`
- `python -m tridev.cli task-step --root . --run-id <run-id> --task-id <task-id> --status completed --artifact <path> --summary <summary>`

## Smoke Prompts
- `tridev: 为当前仓库进入 TriDev 开发流程`
- `tridev: 现在下一步是什么`
- `tridev: 现在下一步是什么`

## Latest Run
- runId: ipd-ipd-20260527-034923
- currentStage: VERIFY-INTEGRATION
- nextAction: record-phase-result

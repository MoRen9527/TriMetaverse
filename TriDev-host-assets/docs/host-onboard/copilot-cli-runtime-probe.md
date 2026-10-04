# TriDev Host Runtime Probe - copilot-cli

- displayName: GitHub Copilot CLI
- maturityTier: copilot-first
- status: passed
- installStatus: passed
- surfaceStatus: passed
- runtimeStatus: passed
- parityScore: 100
- summary: GitHub Copilot CLI 宿主 surface 与活动 run 连续性证据均已就绪。
- primaryTrigger: tridev: <需求描述>
- resumePrompt: tridev: 继续当前流程

## Checks
- install:
  - agentsFilePresent: True
  - copilotInstructionsPresent: True
  - skillPresent: True
  - agentPresent: True
- surface:
  - protocolModeDeclared: True
  - primaryTriggerDeclared: True
  - resumePromptDeclared: True
  - officialSurfacesDeclared: True
  - runtimeArtifactsDeclared: True
- runtime:
  - latestRunPresent: True
  - workflowStatePresent: True
  - sessionBriefPresent: True
  - knowledgeBundlePresent: True
  - promptContextPresent: True
  - machinePlaybookPresent: True
  - roleAdaptersPresent: True
  - taskPlanPresent: True

## Next Actions
- python -m tridev.cli status --root . --run-id ipd-ipd-20260527-034923
- 在 Copilot 会话中输入 `tridev: 继续当前流程`。

## Latest Run
- runId: ipd-ipd-20260527-034923
- currentStage: VERIFY-INTEGRATION
- nextAction: record-phase-result

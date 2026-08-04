# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

TriMetaverse is a multi-module AI-native development platform. It contains:

- **TriLC** — Local Controller daemon (HTTP + SSE agent loop, heartbeat, cron, session reaper). Located in sibling repo `../TriLC/`.
- **TriPilot** — VS Code / VSCodium chat extension. Located in sibling repo `../TriPilot/`.
- **TriCode** — Shared code runtime and orchestration. Located in sibling repo `../TriCode/`.
- **TriCade** — Desktop distribution bundle (TriLC + TriPilot + TriCode packaged for Windows).
- **TriCompany** — Cyber-company operating vehicle (13 AI employees). Embedded in `.claude/agents/` (primary runtime) and `.github/agents/` (Copilot-host entry).

Current phase: v0.9.x dual-track (dev code version → prod installed version mutual reinforcement). See `docs/execution/v0.9.x-dual-track-tricompany-plan.md`.

## Module Workspace Layout

```
D:/OneDrive/Code/ai/
├── TriMetaverse/    ← this repo (build scripts, docs, .github/, .claude/)
├── TriLC/           ← Local Controller daemon
├── TriPilot/        ← VS Code extension
├── TriCode/         ← Shared runtime
├── TriCompany/      ← Cyber-company source
└── TriMC/           ← Meta Controller
```

All modules are sibling directories. Use `../<module>/` for cross-repo references.

## Registry Routing

When you need facts, follow this priority order:

1. **Central Business Strategy** — `BusinessStrategy` agent. Module boundaries, business model, experiment phase.
2. **Company Governance** — `CompanyGovernanceRegistry` agent. Org docs, naming conventions, management processes.
3. **Module Product Registry** — `<Module>ProductRegistry` agent. State, roadmap, requirements.
4. **Module Code Registry** — `TriMetaverseCodeRegistry` agent. Code structure, docs structure, quality risks.
5. **Module source code** — Read the actual code.

Key documents:
- `docs/三元宇宙架构与模块说明.md` — Architecture overview and module absorption rules
- `tricompany.md` — TriCompany design document
- `docs/github-repo-governance.md` — GitHub repo governance rules
- `docs/execution/v0.9.x-dual-track-tricompany-plan.md` — Current execution plan

## Agent Architecture

- **Registry Agents** — Impersonal data hubs. Facts, state, boundaries, indexes, memory only.
- **Role Agents** — Personal role executors. Business judgment, progress, coordination.

13 employees onboarded in TriCompany V1.0. Active runtime: `.claude/agents/` (primary), `.github/agents/` (Copilot-host entry).

## CodeGraph Usage

This project has CodeGraph enabled. Use it for structural questions:

| Intent | Tool |
|---|---|
| Symbol lookup | `codegraph_search` |
| Task/feature context | `codegraph_context` (primary) |
| Who calls X? | `codegraph_callers` |
| What does X call? | `codegraph_callees` |
| Blast radius of change | `codegraph_impact` |
| Symbol source/signature | `codegraph_node` |
| Multiple symbols at once | `codegraph_explore` |
| Directory structure | `codegraph_files` |

**Rules**: Answer directly with codegraph, don't delegate exploration. Trust codegraph results (AST-parsed). Don't grep before codegraph_search for symbol lookups.

## Source of Truth Order

1. Source-side in `TriCompany/` (canonical employee definitions, product facts, registry)
2. Published copies in this repo (`.github/`, `docs/`)
3. Runtime state in employee knowledge workspace
4. Session transcripts

When source and published copies conflict, source-side wins. When frozen source is stale, report it but don't silently override.

## Weekly Operating Records

Active week's OP records: `docs/workflow/operating-records/<current-week>/`
- Weekly index: `OP-YYYYMM-Wnn-001.json`
- Tree operating plans: `trees/<tree-id>/tree-op.json`
- Carry-over items tracked at 4-week (warning) and 8-week (CEO escalation) thresholds

## Common Commands

```bash
# TriLC daemon
trilc start              # Start daemon in background
trilc stop               # Stop daemon
trilc status             # Show daemon status (healthz + heartbeat + cron)
trilc daemon install     # Install as Windows scheduled task
trilc cron add/list/run  # Manage cron jobs

# Health check
curl http://127.0.0.1:8711/healthz

# Build pipeline (CI trigger)
# Push v* tag to trigger build-tricade.yml → MSI + ZIP + GitHub Release

# Install (unified script)
.\scripts\install-tricade.ps1 -MsiPath <path> [-InstallService]
.\scripts\verify-trilc-24h.ps1 -DurationHours 1  # Quick stability test
```

## File Conventions

- GitHub Actions workflows: `@username` for human attribution in commit messages
- Co-authored-by: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` for AI commits
- Markdown tables: `| --- | --- |` (spaced separators per markdownlint)
- Agent files: `.claude/agents/*.md` (Claude Code tools in PascalCase), `.github/agents/*.agent.md` (Copilot tools in lowercase)

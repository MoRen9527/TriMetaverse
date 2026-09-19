# 任务书·board 席名址录悬空指针修复（修 A：管线分支判据）

- sourceOfTruth: 本件=董事会轻量派工凭据
- syncMode: static
- lastSyncedAt: 2026-09-20 02:5x
- 上位令: CEO 2026-09-20 02:5x「修 A 不做 B」（登记追平现实，不造 board.session.md 文件）
- 派工席: Board（BOD）；承接: FSD 执行＋CTO 复核

## 根因（BOD 已勘定）

`TriCompany/runtime/cognition/seats_pipeline.py:74` 无条件 `COMPASS_REL_FMT.format(seat=seat)` 拼 compass 手册路径，不判该席有无 session-body 件。board 席（非人格，manifest paths 仅 agent_body/agent_frontmatter，无 session_body）被硬拼出悬空指针 `compass/board.session.md`（文件不存在），经派生写入 `.claude/seats.json` board 条目。

## 修法

seats_pipeline.py 派生循环加分支判据：

- manifest entry `paths` 含 `session_body` → 现行为不变（sessionPrompt+append 文件形态 launchCommand）；
- **不含**（如 board）→ `sessionPrompt: ""`、`launchCommand: "claude -n {ops_name.upper()} --agent {agent_name} --verbose --dangerously-skip-permissions"`（--agent 挂载发布位形态）。

派生重跑：TriCompany 源侧 commit → 重渲 `.claude/seats.json`（禁手改派生产物，头注纪律）。

## 验收锚

1. 派生后 seats.json board 条目：sessionPrompt 为空、launchCommand 为 --agent 形态、其余字段不动；
2. 13 席条目逐字段零变化（diff 除 board 外干净）；
3. validator 全绿（183 tests 族零新增红）；
4. BOD 启动命令实态可跑（--agent Board 形态与名址录一致）。

## 边界

- 不造 board.session.md 文件（CEO 修 A 定谳）；
- 不动 manifest board 条目（其 paths 结构正确）；
- 真源单线：改动仅 seats_pipeline.py + 对应用例，源侧 commit 走 CTO 复核后推。

## 流程

FSD 执行（预计 ≤20 行+1 用例）→ validator 全绿 → CTO 复核 commit → 回执 BOD 销账。轻量线，不组联审。

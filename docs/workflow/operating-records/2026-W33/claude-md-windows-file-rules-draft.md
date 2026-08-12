# CLAUDE.md 规则增补草案 — Windows 文件操作纪律（2026-W33 共学）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W33/claude-md-windows-file-rules-draft.md
- syncMode: source-only
- lastSyncedAt: 2026-08-11

> 状态：**draft**，待 CEO 确认后合并进 `CLAUDE.md`（建议追加到 File Conventions 一节末尾）。
> 来源：`2026-W33/project-ai-community-weekly-2026-W33.md` §2.1（CC 在原生 Windows 的已知问题图谱）。
> 适用：所有 agent 在 Windows 上执行文件操作时。

---

## 待合并内容

```markdown
## Windows 文件操作纪律（2026-W33 共学追加）

> 来源：周共学 2.1（Claude Code 原生 Windows 已知问题图谱）。所有 agent 在
> Windows 上操作文件时遵守，与平台无关的规则见上方 File Conventions。

1. **大文件分段写入**：单次 Write 不超过 ~200 行 / 8KB；大文件先建空文件再分段追加，
   或拆多个 Edit（单次 ≤ ~100 行）。原因：CC 大文件单次写入存在 Error writing file
   死循环（无官方修复，社区通用规避）。
2. **完整绝对路径**：文件操作用带盘符的完整路径（`D:\Code\ai\TriLC\src\...`），
   不依赖相对路径猜测。原因：相对路径 + 驱动器根/`\u` 段（2.1.218 已修）曾引发
   文件"找不到"类故障。
3. **禁止 OneDrive 路径**：目标路径不得处于 OneDrive 同步目录（`D:\OneDrive\...`）；
   项目仓库一律在 `D:\Code\ai\`。原因：OneDrive Cloud Filter 下 Edit 存在
   delete-then-rename 竞争，可静默丢文件（issue #65229）。
4. **驱动器根禁写**：不直接对 `D:\` 等驱动器根 Write/Edit（EPERM: mkdir）；
   确需写入用 Bash（如 `python -c "open('D:/x.tmp','w').write(...)"`）。
5. **worktree 清理**：只用 `git worktree remove`；禁止用 `rm -rf` /
   `Remove-Item -Recurse -Force` 清理含 junction 的目录（pnpm node_modules 是经典雷区）。
   原因：Windows 递归删除会钻进 NTFS junction 删到目录外（2.1.205 起工具自身已修，
   手动清理仍需遵守）。
6. **跨模块引用**：访问 sibling 仓库（`../TriLC/`、`../TriCode/` 等）的文件，
   须在会话启动时 `--add-dir <path>` 显式加入（或 settings `additionalDirectories`），
   不依赖 bypassPermissions 兜底（Windows 上 additionalDirectories 存在失效案例
   issue #72739）。
```

---

## 合并步骤

1. CEO 确认后，将上列代码块追加到 `CLAUDE.md` 的 `## File Conventions` 一节末尾。
2. 同步说明：CLAUDE.md 同时被 `.github/agents/`（Copilot 宿主）读取，新增的是
   平台纪律而非工具名，两侧无需差异化翻译。
3. 归档：本草案随 2026-W33 周记签发版一并归档到 `项目级 AI 共学周记/`。

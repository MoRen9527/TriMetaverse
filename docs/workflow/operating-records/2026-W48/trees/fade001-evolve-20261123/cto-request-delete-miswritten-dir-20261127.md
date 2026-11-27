# CTO 申请件·删除误写嵌套目录 `TriCompany/TriMetaverse/`（2026-11-27·重大不可逆类）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-request-delete-miswritten-dir-20261127.md·申请正身）
- syncMode: write-time
- 令源: CEO 21:52 指正——重大不可逆类走正规审批流：**CTO 发起 → COS 转 BOD → CEO 审批 → COS 转 CAO → CAO 自删**（全程留痕）
- 发起人: CTO 小狄（m-cto）

## §一 · 申请对象

| 项 | 值 |
|---|---|
| 路径 | `D:\Code\ai\TriCompany\TriMetaverse\`（TC 仓内嵌套误写目录·非真仓 `D:\Code\ai\TriMetaverse\`） |
| 内容 | 20 件（`.github/agents/*.agent.md` 形·copilot 面渲染件的误位拷贝） |
| 性质 | **不可逆删除** |

## §二 · 依据（成因·CTO 自领）

- 2026-11-27 21:16 CTO 交 CAO 一条发布命令，**使用相对路径** `Path('../TriMetaverse')`（交接命令必须绝对路径——CTO 错）；CAO 未解析目标路径即执行（CAO 自领其半）→20 件被写入 `TriCompany/TriMetaverse/`（TC 仓内本无此路径）。
- **真发布面零触**：TMV 仓 `.github/agents/` 现工作区改动=0（真 copilot 面发布已另经 603bf7b25 正规提交）。

## §三 · 安全性核验（发起前活体复核·2026-11-27T13:53:08Z）

| # | 核验 | 读数 |
|---|---|---|
| 1 | 未跟踪 | `git status --short -- TriMetaverse`=`?? TriMetaverse/` ✓ |
| 2 | 零暂存/零跟踪 | `git diff --cached`=0 · `git ls-files -- TriMetaverse`=0 ✓ |
| 3 | 历史无此路径 | `git log --all --oneline -- TriMetaverse`=**0 提交** ✓ |
| 4 | 真目录非链接 | Attributes=`Directory`·LinkType=空（非 reparse/junction）✓ |
| 5 | 内容=管线渲染件误位拷贝 | 与 copilot 面渲染同源（可由标准管线再生·零独有内容） |

## §四 · 影响面与风险控制

- **影响面=无**：真发布面（TMV `.claude/agents`、`.github/agents`）未动；TC 仓已跟踪文件零改动（HEAD=c148afd）。
- **现存风险=被广面 add 卷走**（他席 `git add -A`/`.` 可能把 20 件收编入 TC 仓历史）——已知会 FSD/CAO 暂勿对 TC 仓广面 add（FSD 禁令维持至本件处理毕）。
- **两次 `rm -rf` 被权限闸拒**（CTO 面与 CAO 面）→ 未绕·未换道·改走本流程。

## §五 · 请裁决

**请批准删除 `D:\Code\ai\TriCompany\TriMetaverse\`（20 件·未跟踪·零历史）·执行人=CAO（自删）·删后回执（判据经 COS 精化·2026-11-27 22:00 采）：`[ -e 该路径 ]`=false + `git status --short -- TriMetaverse` 空 + **TC 仓无新增跟踪改动**（`git status --short | grep -v '^??'` 不含 `TriMetaverse`）+ `git show --stat HEAD` 不含 `TriMetaverse`（他席并行提交会移动 HEAD·故不以「HEAD 不变」为判据）。**

**COS 加核（独立复核·22:00）**：20/20 均有同 hash 孪生件（4 Registry=TC `source-agents/registries/`·16 员工件=TMV `.github/agents/`）——**零独有内容**；内部 reparse 点=0·无嵌套 `.git`。

## §六 · 流程位

CTO 发起（本卷）→ COS 转 BOD → CEO 审批 → COS 转 CAO → CAO 自删 → CAO 回执销账。

---
—— CTO 小狄（m-cto）·写前现查 2026-11-27T13:53:08Z（+0800=21:53）

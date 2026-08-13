# 项目级 AI 共学周记 — 2026-W33

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W33/project-ai-community-weekly-2026-W33.md
- syncMode: audit-record
- lastSyncedAt: 2026-08-13

> 记录人：小贾（CEOChiefOfStaff）
> 日期：2026-08-10

---

## 2.1 Claude Code 在原生 Windows 环境的已知问题图谱：CC vs Copilot CLI 三环境对照

> 本周共学主题：Claude Code 在原生 Windows（PowerShell / Git Bash）下有一批已被记录的文件操作坑，社区对比时经常说"Copilot 更稳"。我们把这些坑逐条拆成「现象 → 修复/workaround → 本项目建议」，并对照 Claude Code（CC）与 Copilot CLI（Copilot）在 **WSL / Git Bash / PowerShell** 三种环境下：问题存不存在、表现谁好谁差。
>
> 证据说明：CC 侧每条都有 GitHub issue 佐证（附链接）；Copilot 侧"无公开报告"不等于"已证实没有"——Copilot CLI 的 Windows 用户量远小于 CC，凡未证实处均标注"待验证"。

---

### 2.1.1 `.claude.json` 并发写：多开终端时配置被写坏

#### 2.1.1.1 现象描述（小白版）

你开了两个终端同时跑 claude（比如一个改代码、一个跑自动化），跑 5~15 分钟后其中一个突然崩掉：

```text
ERROR EBUSY: resource busy or locked, open 'C:\Users\jedih\.claude.json'
```

更糟的情况是配置**整个被重置**：`JSON Parse error: Unexpected EOF`，然后所有会话历史、MCP 配置、信任记录全没，要重新走一遍 onboarding。`C:\Users\jedih\.claude\backups\` 里还会堆出几百个 `.corrupted` 文件。

原因一句话：所有 claude 实例共用同一个 `~/.claude.json`，每次工具调用都会重写它，写入时**不加锁**。Windows 的文件锁是强制的（不像 Linux 是"商量着来"），两个进程同时写 → 一个直接撞锁报 EBUSY；而且写入不是原子操作，另一个进程可能读到写到一半的截断内容 → 判定"文件损坏"→ 重置成默认配置。

#### 2.1.1.2 已修复？workaround？

未修复（官方未给根治方案，社区建议一直被提）。可用手段按效果排序：

| 手段 | 方法 | 优劣 |
| --- | --- | --- |
| Defender 排除（最有效） | `Add-MpExclusion -ExclusionPath "C:\Users\jedih\.claude.json"` + `-ExclusionProcess "claude.exe"` | 减少扫描锁窗；不能消除并发碰撞，只是把撞车窗口压小 |
| 限制并发实例 | 同时最多 2 个 claude 实例 | 简单粗暴；对"13 员工并行"场景是硬约束 |
| 定期清理 | 删 `~/.claude/backups/*corrupted*` | 只治标；配置已经被重置时无力回天 |
| 移出 OneDrive | 用户目录别放 OneDrive 同步下 | 消除一类锁；你的是 `C:\Users\jedih`，不中招 |

#### 2.1.1.3 与本项目的建议和经验

本项目是**高危命中区**：TriCompany 13 员工并行 + Tride/TriMC 自动化多实例是常态，且全局配置开着 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`（团队模式天然多并发）。落地动作：

- 自动化链路上把并发 claude 实例数压到 ≤2；
- 每周例行检查 `~/.claude/backups/` 是否有新增 corrupted 文件，有就立即备份 `.claude.json`；
- 发现 `Unexpected EOF` 报错 = 配置刚被重置的信号，第一时间回滚备份。

#### 2.1.1.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | 存在（同机制） | 待验证：状态文件不同（非 `.claude.json`），无公开报告 |
| Git Bash | 存在 | 待验证 |
| PowerShell | 存在（本问题与 shell 无关，Windows 强制锁 + 无锁写入是根因） | 待验证 |

---

### 2.1.2 OneDrive 目录：文件锁 + Edit 静默丢文件 + 迁移残留

#### 2.1.2.1 现象描述（小白版）

- **文件锁**：项目放在 OneDrive 同步目录里时，同步进程会持续持有文件句柄，git 操作、node_modules 读写、构建产物偶尔报 `EBUSY`/`EPERM`，重试又好了，随机且难复现。
- **静默丢文件（最危险）**：CC 的 Edit 工具在 OneDrive 同步目录下有两种写入路径，一种安全（原子替换），一种不安全（先删后建）。Cloud Filter 会把"先删"当真，结果**文件悄悄消失**，不报任何错——OneDrive 同步目录下 Edit 改文件 = 可能丢数据（[#65229](https://github.com/anthropics/claude-code/issues/65229)）。
- **迁移残留（本项目实况）**：`D:\Code` 与 `D:\OneDrive\Code` 两份并存（pwd 证实会话在 `D:\Code`）。两份 `.claude/settings.local.json` 已分叉：`D:\Code` 副本是新路径（`//d/Code/...`），`D:\OneDrive` 副本还是旧路径（`//d/OneDrive/...`）。哪天从旧副本目录起会话，allow 规则全指向旧路径，TriCode/TriLC 访问全部失灵；且 OneDrive 继续同步旧树，白吃锁和 CPU。

#### 2.1.2.2 已修复？workaround？

未修复。官方/社区唯一可靠方案：**别把项目放 OneDrive 同步目录**（[#20168](https://github.com/anthropics/claude-code/issues/20168)）。对本项目：

| 步骤 | 动作 |
| --- | --- |
| 1 | 确认主仓库只在 `D:\Code\ai\`（已确认 ✓） |
| 2 | 停用 OneDrive 对 `D:\OneDrive\Code` 的同步，或删除旧副本 |
| 3 | 全仓 grep 一遍 `OneDrive` 残留引用（脚本、settings、文档里的路径） |

#### 2.1.2.3 与本项目的建议和经验

- 新项目/新仓库一律放 `D:\Code\ai\`，不进 OneDrive；
- 写 CLAUDE.md 级规则："任何涉及文件写入的操作，目标路径禁止处于 OneDrive 同步目录"；
- 若某文件在 OneDrive 目录下 Edit 报奇怪错误，先检查文件是否还在（防 #65229 静默丢失）。

#### 2.1.2.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | 代码进 Linux fs 后无此问题；仍在 `/mnt/d` 上则一样 | 同左 |
| Git Bash | 存在（写入路径是 MSYS 工具链，锁竞争照旧） | 待验证 |
| PowerShell | 存在（根因是 OneDrive Cloud Filter，与 shell 无关；CC 的 delete-then-rename 路径是 CC 特有） | VS Code Agent Mode 经宿主文件抽象，报告少；CLI 待验证 |

---

### 2.1.3 Defender / 杀软：扫描锁窗、命令全灭、误报循环

#### 2.1.3.1 现象描述（小白版）

三个级别的问题：

- **轻度**：每次启动 claude.exe / node.exe 被杀软扫一遍，每个命令都慢半拍（与 spawn 开销叠加）。
- **中度**：杀软开了"PowerShell 脚本执行检测"类功能时，**所有** Bash/PowerShell 命令直接 `EPERM: operation not permitted, uv_spawn`——不是慢，是全部失败（[#65627](https://github.com/anthropics/claude-code/issues/65627)）。
- **重度（已发生真实事件）**：杀软把 `download-skill_*.zip` 误报隔离 → CC 无限重试下载 → 15 天累积 836 次检测 → Sophos 触发爆发阈值，把整台机器升级成"自适应攻击防护"，**开始拦无关软件**（本地构建、安装器全部遭殃）（[#82324](https://github.com/anthropics/claude-code/issues/82324)）。

另外 Defender 对 `.claude.json` 的写后扫描会延长锁窗，直接放大 2.1.1 的 EBUSY 概率。

#### 2.1.3.2 已修复？workaround？

未修复（杀软生态问题，官方只能建议排除）。方法：

```powershell
# 推荐排除清单
Add-MpExclusion -ExclusionPath "C:\Users\jedih\.claude.json"
Add-MpExclusion -ExclusionPath "$env:TEMP"
Add-MpExclusion -ExclusionPath "D:\Code\ai"          # 项目目录
Add-MpExclusion -ExclusionPath "C:\Program Files\TriCade"
Add-MpExclusion -ExclusionProcess "claude.exe", "node.exe"
```

- 若装了三方杀软（Sophos 等），检查有没有"PowerShell 脚本执行检测 / 脚本拦截"类开关，关掉（#65627 的根因）；
- 误报循环的止损：杀软隔离目录里看到 `download-skill_*.zip`，加白名单而不是反复重试。

#### 2.1.3.3 与本项目的建议和经验

TriCade 安装态部署在 `C:\Program Files\TriCade`、构建在 `%TEMP%`、项目在 `D:\Code\ai`——三个位置都在排除清单里。建议把上面的排除命令写成 `scripts/win-defender-exclusions.ps1` 入库，新机器一次性执行。

#### 2.1.3.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | 仅 Windows 侧进程受影响；Linux fs 上无扫描锁 | 同左 |
| Git Bash | 存在（被扫的是 node/claude 进程，与 shell 无关） | 同为 Node 进程，同样会被扫（表现相当） |
| PowerShell | 存在，且 #65627 的 uv_spawn EPERM 专门发生在 spawn powershell 时 | 同为 Node 进程 spawn powershell，预期同受 #65627 影响（待验证） |

---

### 2.1.4 Worktree 删除越界：NTFS junction 被当成普通目录删

#### 2.1.4.1 现象描述（小白版）

Windows 上的"快捷方式"有一种叫 NTFS junction（`mklink /J` 创建）。pnpm 的 `node_modules`、某些 monorepo 依赖就是 junction。Claude Code 清理 worktree（后台任务的隔离工作区）时用 `rm -rf` 递归删除，但 Windows 版 `rm` **不把 junction 当链接**，而是钻进去把目标目录的内容删光。

真实事故：[#75275](https://github.com/anthropics/claude-code/issues/75275)——2.1.123 / Win11 上，用户 worktree 里有个 junction 指向主仓库的 gitignored 数据目录，清理时 **800 GB 数据被删**，没有确认、没有回收站。

另一个已修变体：启动目录在命令运行期间被删/锁/unmount → 崩溃（同批修复）。

#### 2.1.4.2 已修复？workaround？

✅ 已修复：**2.1.205**（2026-07-08）——"删除含 NTFS junction 或目录符号链接的 worktree 不再删到外部"。分阶段修复史：2.1.146 修 background-job worktree，2.1.205 覆盖全部 worktree 删除。

但**手动清理**的坑还在（这是用户侧行为，工具管不着）：

| 命令 | 是否跟进 junction | 结论 |
| --- | --- | --- |
| `git worktree remove` | 安全（git 自己处理） | ✅ 首选 |
| `cmd /c rmdir /S /Q` | 安全（只删链接本身） | ✅ 可用 |
| `rm -rf`（Git Bash） | ❌ 钻进 junction | 禁止用于含 junction 的目录 |
| `Remove-Item -Recurse -Force`（PowerShell） | ❌ 钻进 junction | 禁止 |

#### 2.1.4.3 与本项目的建议和经验

- 项目规则：**worktree 里不出现指向外部的 junction**；pnpm 用户不要在 worktree 里 `pnpm install`（node_modules junction 是经典雷）；
- 清理 worktree 只允许 `git worktree remove`；
- 相关残留问题（未修）：worktree 被 Search Indexer/Defender 锁住删不掉（[#57767](https://github.com/anthropics/claude-code/issues/57767)）、MCP 服务持有 CWD 锁导致删除 `Permission denied`（[#32747](https://github.com/anthropics/claude-code/issues/32747)——**本项目的 codegraph MCP 常驻项目目录，命中概率高**，删 worktree 前先停 MCP）。

#### 2.1.4.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | Linux `rm -rf` 删 symlink 本身，无此问题 | 无 worktree 特性，问题不存在 |
| Git Bash | ✅ 已修（CC 自身清理逻辑已改）；手动 `rm -rf` 仍危险 | 无 worktree 特性；手动 `rm -rf` 同样危险（MSYS 行为，与工具无关） |
| PowerShell | ✅ 已修；手动 `Remove-Item -Recurse` 仍危险 | 无此特性；手动命令同样危险 |

---

### 2.1.5 PowerShell spawn 开销：WSL 里启动卡 30 秒

#### 2.1.5.1 现象描述（小白版）

在 WSL2 里跑 claude（Windows 版和 Linux 版都算），启动后每秒卡一下、总共卡 ~30 秒。原因：CC 想知道 Windows 用户目录，但 `USERPROFILE` 环境变量在 WSL 里默认没设，于是它反复执行：

```text
/bin/sh -c "powershell.exe -Command '$env:USERPROFILE'"   ← 跑了 38 次！
  → powershell.exe（加载整个 .NET runtime）
  → /usr/bin/wslpath -u C:\Users\xxx
```

单次 600~800ms（WSL interop 链路：binfmt_misc → Windows 进程创建 → plan9 桥传 stdout），38 次 = ~27 秒，主线程被阻塞，表现为启动冻结（[#29672](https://github.com/anthropics/claude-code/issues/29672)）。根因是**结果没缓存**。

#### 2.1.5.2 已修复？workaround？

有 workaround，一行解决：

```bash
# ~/.bashrc
export USERPROFILE="/mnt/c/Users/jedih"
```

设了之后 CC 直接读环境变量，不再 spawn PowerShell。修复状态：官方 issue 开了，未确认根治；且注意**只影响启动时的路径解析**，日常命令照常 spawn shell。

#### 2.1.5.3 与本项目的建议和经验

- 本项目当前结论是**不上 WSL**（见 2.1.7 末尾），这条主要存档；
- 若将来 TriLC 或自动化链路要在 WSL 里跑 claude，`.bashrc` 必须带 `USERPROFILE` 导出；
- 一般规律：CC 每次工具调用都要 spawn 一个 shell，pwsh 冷启动 100~300ms——**会话里 Bash 工具密集时会明显"发卡"是正常的**，不是卡死。

#### 2.1.5.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | ❌ 有：38 次 powershell.exe spawn（#29672），workaround 为 export USERPROFILE | 无公开报告；同为 Node 进程，若其缓存路径解析则天然免疫（待验证） |
| Git Bash | 无此问题（直接读环境变量） | 无此问题 |
| PowerShell | 无此问题（但每个命令付 pwsh 冷启动成本） | 无此问题（同样付 pwsh 冷启动成本，表现相当） |

---

### 2.1.6 文件写入三坑：大文件、`\u` 路径、驱动器根

#### 2.1.6.1 现象描述（小白版）

- **大文件单次写入**：一次写超过约 200 行/8KB 的文件，CC 报 `Error writing file`，甚至反复重试死循环。社区经验：必须**分块写**（先建空文件再追加，或拆多个 Edit 每次 <~100 行）。注意 8KB 是社区经验值，没有官方阈值；相关已知 bug 还有沙箱下 Edit 静默把文件钳到编辑前大小、追加的字节直接丢（[#59285](https://github.com/anthropics/claude-code/issues/59285)）。
- **`\u` 路径转义**：Windows 用户名形如 `u` + 4 位十六进制（如 `u1a2b3c`，企业常用工号当用户名）时，路径 `C:\Users\u1a2b3c\...` 里的 `\u1a2b3` 被当成 Unicode 转义解析成 CJK 字符，**所有文件工具都找不到文件**，报 EPERM / File not found（[#54583](https://github.com/anthropics/claude-code/issues/54583)）。
- **驱动器根目录**：对 `D:\` 根直接 Write/Edit → `EPERM: mkdir 'D:\'`——CC 会尝试创建父目录，而驱动器根已存在且不能再创建（[#41465](https://github.com/anthropics/claude-code/issues/41465)）。

#### 2.1.6.2 已修复？workaround？

| 问题 | 状态 | workaround |
| --- | --- | --- |
| 大文件写入 | ❌ 未修 | 规则化：大文件分段写；Edit 拆块（>100 行拆多次） |
| `\u` 转义 | ✅ **2.1.218**（2026-07-22）已修 | 无需；但 `jedih` 用户名本就不命中 |
| 驱动器根 | ❌ 未修 | 别在驱动器根直接写；要写用 Bash（`python -c "open(...)"`） |

#### 2.1.6.3 与本项目的建议和经验

- 把"大文件分段写 + Edit 分块 + 文件操作用完整绝对路径"写进项目 CLAUDE.md，成为所有 agent 的共同规则（TriCade 的 build 脚本、TriLC 的大文件都是命中对象）；
- 保持 claude 版本 ≥ 2.1.218（`\u` 修复线），低于此版遇到文件"莫名其妙找不到"先怀疑路径转义；
- `C:\Program Files\TriCade` 安装态目录是只读的，agent 直接写会被拒——要走脚本/提权路径（这与 2.1.4 的"开发态 vs 安装态"教训一致）。

#### 2.1.6.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | 无此三坑（POSIX 语义，`\u` 与驱动器根概念不存在；大文件分块仍是好习惯） | 无此三坑 |
| Git Bash | `\u` 已修；大文件/驱动器根仍在 | 大文件无公开报告（VS Code 宿主经成熟文件 API）；驱动器根同为 Node 实现，待验证 |
| PowerShell | 三坑全在（已修的除外） | 大文件无公开报告；驱动器根待验证 |

---

### 2.1.7 权限边界与跨目录：CC 的 allow/additionalDirectories vs Copilot 的 /add-dir、/cwd

#### 2.1.7.1 现象描述（小白版）

两个工具的默认哲学一样：**只能动启动目录里的文件，动外面的要问用户**。区别在机制成熟度：

- **Claude Code**：`/add-dir`（会话内加目录）、`--add-dir`（启动参数）、`permissions.additionalDirectories`（settings 持久化）、`permissions.allow/deny`（命令/路径规则）、权限模式（default / acceptEdits / auto / dontAsk / bypassPermissions / plan）。子 agent 继承父会话模式，需要提示时转发到主会话（对话框会标注是哪个 agent 在问）。
- **Copilot CLI**：`/add-dir`、`/cwd`（切换工作根，`/cd` 别名）、`--allow-all-paths`（完全禁用路径校验）、`/sandbox`（本地沙箱配置界面）——官方文档化的"一等公民"功能。

本项目实测（bypassPermissions 模式，2026-08-10）：子 agent（CTO）和主 agent 直接写 `D:\Code\ai\TriLC\`（不在 additionalDirectories）→ **都无声通过，无提示**。结论：当前版本 bypass 下普通目录不再有边界门，只有 `.git/`、`.claude/` 等受保护目录保留门禁（changelog 3037 行）。

#### 2.1.7.2 已修复？workaround？

Windows 特有坑仍在：

| 坑 | 状态 |
| --- | --- |
| Windows 上 `additionalDirectories`/allow 规则**不抑制提示**（疑 symlink 相关），`**` 通配只匹配一层 | ❌ 未修 [\#72739](https://github.com/anthropics/claude-code/issues/72739) |
| headless 下 allow 通配静默失效；Write 命中规则仍被拒 | ❌ 未修 [\#6194](https://github.com/anthropics/claude-code/issues/6194) [\#62855](https://github.com/anthropics/claude-code/issues/62855) |
| UNC 路径（`\\server\share`）硬阻断（防 WebDAV 凭据泄露） | 设计如此 [\#41914](https://github.com/anthropics/claude-code/issues/41914) |
| 子 agent 权限：继承父模式；提示转发主会话；dontAsk/非交互下边界外写 → 拒绝（理论，未实测） | 现行行为 |

#### 2.1.7.3 与本项目的建议和经验

- 跨仓库操作（`../TriLC/` 等 sibling）**显式加入白名单**，不赌 bypass：`--add-dir ../TriLC` 或 settings `additionalDirectories`，一次性根治 #72739 类失效带来的"有时弹有时不弹"；
- 自动化链路（Tride/TriMC 用 `-p` 跑）里，子任务要写哪个 sibling 就启动时带 `--add-dir`，不要依赖 bypass（非交互下弹不出提示 = 直接拒绝）；
- **本项目不上 WSL 的结论**：代码在 NTFS（`D:\Code`）+ 工具链全在 Windows 侧（TriCade 安装目录、VS Code 扩展、TriLC 守护进程、MSI 部署路径）——搬 WSL 引入跨系统协作成本，不如原生 + 上述规避；WSL 优势（POSIX 语义、GNU 工具链、ext4 并发）只有在代码整体进 Linux fs 时才成立，`/mnt/d` 反而更慢。

#### 2.1.7.4 三环境对照

| 环境 | Claude Code | Copilot CLI |
| --- | --- | --- |
| WSL | 边界机制同（无 #72739 类 Windows 失效）；POSIX 下 allow 规则表现稳定 | `/add-dir`、`/cwd` 机制同（官方一等公民）；待验证 |
| Git Bash | MSYS 路径形态（`//d/`）与 allow 规则匹配错位（[#3285](https://github.com/anthropics/claude-code/issues/3285)）；本项目 allow 规则即 `//d/` 形态 | 无 MSYS 翻译层（Node 原生路径），路径语义更干净（优势） |
| PowerShell | #72739 Windows 失效在（本环境最不稳）；bypass 实测普通目录无门禁 | 路径无翻译层（优势）；沙箱/权限模型更简单，报告少 |

---

## 总矩阵（一眼版）

| 问题 | CC-WSL | CC-Git Bash | CC-PowerShell | Copilot-WSL | Copilot-Git Bash | Copilot-PowerShell |
| --- | --- | --- | --- | --- | --- | --- |
| .claude.json 并发写坏 | ⚠️ 同 | ⚠️ 同 | ⚠️ 同（本环境最常见） | 🟢 待验证 | 🟢 待验证 | 🟢 待验证 |
| OneDrive 锁/丢文件 | 🟢 移出后无 | ⚠️ 有 | ⚠️ 有（CC 特有 delete-then-rename） | 🟢 报告少 | 🟢 报告少 | 🟢 报告少 |
| 杀软扫描/EPERM | 🟢 基本无 | ⚠️ 有 | ❌ 有（#65627 全灭级） | 🟢 同左但报告少 | ⚠️ 同受扫 | ⚠️ 预期同受扫 |
| worktree junction 越界 | 🟢 无 | ✅ 2.1.205 已修 | ✅ 2.1.205 已修 | 🟢 无此特性 | 🟢 无此特性 | 🟢 无此特性 |
| PowerShell spawn 38 次 | ❌ 有（WSL 特有） | 🟢 无 | 🟢 无 | 🟢 待验证 | 🟢 无 | 🟢 无 |
| 大文件写入 | 🟢 无（分块是好习惯） | ⚠️ 有 | ⚠️ 有 | 🟢 报告少 | 🟢 报告少 | 🟢 报告少 |
| `\u` 路径转义 | 🟢 无 | ✅ 2.1.218 已修 | ✅ 2.1.218 已修 | 🟢 无报告 | 🟢 无报告 | 🟢 无报告 |
| 驱动器根 mkdir EPERM | 🟢 无 | ⚠️ 有 | ⚠️ 有 | 🟢 待验证 | 🟢 待验证 | 🟢 待验证 |
| 权限边界 Windows 失效 | 🟢 无 | ⚠️ 有（MSYS 路径错位） | ❌ 有（#72739） | 🟢 机制简单 | 🟢 无翻译层（优） | 🟢 无翻译层（优） |

图例：❌ 有且严重 · ⚠️ 有（可规避/部分）· ✅ 已修复 · 🟢 无/无公开报告/待验证

## 本周结论（一句话版）

- **CC 的 Windows 痛点是"原生适配滞后"而非架构缺陷**：2.1.205（junction/启动目录）、2.1.218（\u 路径）连续修复，节奏在加快；但 .claude.json 并发写、#72739 权限失效、大文件写入仍欠账，且有 ≥6 个关键 Windows bug 被 not planned 关闭（[#39955](https://github.com/anthropics/claude-code/issues/39955)）。
- **Copilot 的优势集中在"路径无翻译层 + 机制一等公民"**，但优势证据部分是"报告少"而非"证实无"。
- **对本项目：留在原生 Windows + 显式规避，不上 WSL**。规避五件套：移出 OneDrive → Defender 排除 → 并发 ≤2 → 跨仓库显式 --add-dir → 大文件分块写入规则进 CLAUDE.md。（2026-08-11 决策登记更新：此结论适用于**本地域（TriLC）**；服务器域改为"官方 claude 舰队 + TriMC 编排"方案，WSL 路线已归档——见文末决策登记块）

---

**记录时间**：2026-08-10 20:00 CST（2026-08-11 更新跟进 4/7/8 + 决策登记）
**分类**：ai-tooling-comparison-observation
**跟进**：

1. 删除/停同步 `D:\OneDrive\Code` 旧副本（最优先）
2. `scripts/win-defender-exclusions.ps1` 入库（已生成，待管理员运行验证）
3. CLAUDE.md 增补"大文件分段写、Edit 分块、完整绝对路径、禁 OneDrive 路径"规则（草案已生成：`claude-md-windows-file-rules-draft.md`，待签发）
4. 并发策略（2026-08-11 修订）：Windows 本地域保持"并发 ≤2 + Defender 排除 + corrupted 监控"；服务器域状态文件在 Linux 侧，独立核算，不共享本地上限
5. 补测 auto/dontAsk/-p 三态下子 agent 边界外写行为
6. shell 变更包（Windows 域）：`CLAUDE_CODE_USE_POWERSHELL_TOOL=1` + 规则重写，四阶段门禁（小贾/小乔/小狄已评审：切 PS7 置信度 0.65-0.82，待 CEO 批复启动阶段 1）
7. 跨会话舰队（2026-08-11 定案）：WSL 路线归档不采纳，采用"服务器舰队"方案——见下方决策登记
8. TriLC 渐进追赶路线（2026-08-11 定案）：见下方决策登记

---

## 决策登记（2026-08-11，CEO 定案）

**议题**：赛博公司运行面的最终部署形态与自研路线

**定案**：

1. **WSL 路线：不采纳**（归档）。服务器端可用真实 Linux 服务器直接部署，无需 WSL 过渡。
2. **服务器端**：部署官方 claude（2.1.226+，Linux）作舰队运行时，跨会话自由对话立即可用；TriMC 从"嵌入 agent loop"演进为**编排层**（启动/寻址/消息桥接官方会话，复用已有 orchestration/task-controller 骨架），承载 task tree、周会、13 员工舰队。
3. **本地端**：TriLC 保持 2.1.88 底座不动，专职本地执行与 fallback；Windows 域按跟进项 6 切 PowerShell 7，本地 CC+PS7 收益保留。
4. **渐进追赶（长期路线）**：TriLC 以服务器舰队的实际使用为验收基准，渐进 rebase 追赶服务器端版本功能，形成"服务器带本地"的良性改进循环。
5. **最终形态**：TriLC 源码构建的运行时直接替换服务器上的官方 claude → 无产权风险的完全自研；TriMC 与 TriLC 互为 fallback 架构不变（最终为单代码库双部署）。许可/产权登记移交公司治理流程跟踪。

**里程碑门禁**：

- **M0（环境）**：服务器裸仓 + 舰队工作克隆 + git 同步链路打通（`/srv/git/*.git` 接收 push + `/srv/fleet/*` 工作克隆），同步纪律见 `docs/execution/trilc-capability-checklist.md` §四
- **M1（试点，2 周）**：服务器舰队跑通 task tree/周会自由对话；TriMC 编排层 MVP 连通官方会话（ListAgents 寻址 + SendMessage 桥接）——**状态：阶段一+二完成（2026-08-11）**。阶段一：TriMC 部署 `/healthz` 200（tsx+systemd，k8s 化后置）；舰队自由对话实测通过（ListAgents + SendMessage 双向往返 5.1s/9.0s）。阶段二（编排 MVP）：session-bridge（spawn `claude --bg` / `claude agents --json` 采集 / `--fork-session` 消息桥 120s 超时，runuser 降权 fleet）+ 3 端点（GET/POST `/internal/v1/agents`、POST `/internal/v1/agents/{id}/message`）+ dispatchAsync 执行器接入 + task-controller 状态机回写（queued→running→completed/failed + result）；类型债清零（2 处源码修复 + noImplicitAny 放宽标注 + 依赖产物构建）；MVP 门禁 5/5 通过（注册表、消息桥回写、e2e dispatch trace 全绿 + 真实回复、重启后注册表重建、healthz 200）；已知项：bg 会话继承 trimc.service cgroup，TriMC 重启会连带杀会话（需重派，秒级）
- **M2（能力验证期）**：TriLC 在 TriMC 监督下按 `docs/execution/trilc-capability-checklist.md` 逐项覆盖（真实研发任务驱动，不设固定时长）；并轨 TriLC 底座版本登记（当前 2.1.88）+ 每 1-2 月 rebase 审计——**状态：进行中，10 轮 done（R1 C12/C13 → R2 C8/C9 → R3 C10 → R4 C1/C15 → R5 C15v2+2.4+2.5 → R6 2.1/2.2 → R7 3.1/3.2 → R8 1.1-1.5 → R9 3.3/3.4/4.1 → R10 4.2/4.3/6.1/6.2），19/33 能力项通过，checklist v2026.W33.13（2026-08-13 滚动更新）；计划级登记见 `docs/execution/server-fleet-trilc-parity-plan.md`**
- **M3（独立资格 + 生产双跑）**：能力清单全勾 + 舰队审核通过 → 生产仓 = TriLC + TriMC 互为 fallback，正式运营日
- **M4（远期）**：自研跨会话层 + 功能覆盖验收通过 → 源码替换官方 claude → 完全自研（无产权风险）

**边界说明**：跨会话平面当前 macOS/Linux；Windows 本地 claude 会话暂不能加入对话平面（Remote Control 可附加），等 Windows 解锁后并入。

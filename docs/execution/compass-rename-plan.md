# compass 改名迁移方案（hub → compass）

- sourceOfTruth: 本件
- syncMode: static（工程窗执行稿）
- lastSyncedAt: 2026-09-14T17:25+0800
- 依据: CEO 定名令（hub 升格公司知识地图，定名 **compass**；BOD 转达 17:0x）

---

## 一、改名范围

| 面 | 现状 | 目标 |
| --- | --- | --- |
| 渲染产物 | `TriMetaverse/.claude/hub/<seat>.session.md`（13 席） | `TriMetaverse/.claude/compass/<seat>.session.md` |
| 管线定义 | `TriCompany/runtime/cognition/source_publish_check.py:217` `target_root=".claude/hub/"` | `target_root=".claude/compass/"`（单点）+L125 注释同步 |
| 校验件 | `lg024_session_upgrade_validation.py:34` `_SIGNED_PIECE` 路径 | 随迁改指 |
| 文档引用 | 9 件 md（8 件 operating-records 历史件+1 件 execution 活件 lg-024-plan） | 活件随改；历史冻结件豁免（不改） |

**不涉及**：`.github/`（无 hub 目录）；源侧 session-body（TriCompany/source-agents/*/session-body.agent.md——位置不变，管线计算目标位）；binding profiles。

## 二、迁移步骤（工程窗执行序）

1. **管线改**：source_publish_check.py `target_root` ".claude/hub/"→".claude/compass/"（单行）+L125 注释+校验脚本 `_SIGNED_PIECE` 路径。
2. **产物迁**：`git mv .claude/hub .claude/compass`（13 件整目录）。
3. **重渲验证**：`--publish-agents --agent-execute --host claude-session` 全量重渲 → 产物落 compass/ → `git diff` 断言与原 hub/ 内容逐字节一致（改名不动内容）。
4. **回归**：`lg024_session_upgrade_validation`（drift=0 幂等断言）+ `employee_source_kit_validation` + `source_publish_check_validation` 全量复跑。
5. **引用收尾**：活件（lg-024-session-contract-upgrade-plan.md）引用改 compass；历史件（operating-records 8 件）冻结不改。
6. **commit**：产物迁移+管线改分两 commit（源码/产物分立，归属清晰）。

## 三、引用清单（9 件）

**活件（随改）**：
- `docs/execution/lg-024-session-contract-upgrade-plan.md`

**历史冻结（豁免不改）**：
- `docs/execution/wave0-rename-residue-assessment-20260909.md`
- `docs/execution/lg-023-bootstrap-unification-evaluation.md`
- `docs/workflow/operating-records/2026-W37/trees/b3b4-joint-review-pilot/reports/bb1-cto-opinion.md`
- `docs/workflow/operating-records/2026-W36/lg-029-cho-registration-review.md`
- `docs/workflow/operating-records/2026-W36/lg-024-session-face-section-matrix-draft.md`
- `docs/workflow/operating-records/2026-W36/daily-progress.md`
- `docs/workflow/operating-records/2026-W37/lg-034-stage1-whitepaper-refcount.md`（refcount 工艺件含 hub 豁免条目=成文历史）

## 四、回滚锚

- **代码锚**：管线改前 commit hash（target_root 单行回退即回滚）。
- **产物锚**：`git mv` 前 hub/ 全目录在版本库（rename 可逆——`git mv compass hub` 反向）。
- **验证锚**：重渲产物 diff=0 断言（内容不变的证明；若 diff≠0=管线行为漂移，停止执行查因）。
- **无别名过渡**（与 TriMC→TriMMC 兼容面先例的区别）：hub 是**纯渲染产物目录**（无运行时消费者，无外部引用），单次迁移+重渲即完成，不留双名——防双名无限延长。
- **停止线**：步骤 3 diff≠0 → 停手回滚至产物锚+报告。

## 五、启动链引用面（BOD 17:3x 补勘，本席定谳）

**消费者实证（启动链=真实消费者）**：
- `TriCompany-copilot-host-assets/host-object-manifest.json:1040`：「Standard xiaojia-hub session launch: `claude -n COS --append-system-prompt-file ...\.claude\hub\ceo-chief-of-staff.session.md`」——**13 席标准启动命令逐席记载于此**（文档字段，非可执行脚本）。
- 本机启动机制=按此命令手工/半自动拉起（无中央 launcher 脚本）；sg 侧=同款命令在 tmux 内。
- 其余引用=文档（lg-023 等）。

**二选一定谳=保留 `.claude/hub` 目录连接（junction）过渡**，判据四条：
1. **消费者分布式且非版本化**（manifest 文档 + sg tmux 活会话 + 席重启手工命令）——无法一窗全量更新，"更新启动链"路径不可靠。
2. **静默失败姿态**（启动链不同步=下次重启读不到手册，且无报错）——风险等级高，必须给兜底。
3. **junction 成本≈零**（Windows `mklink /J` 无需提权；Linux sg 侧 `ln -s`）——过渡兜底廉价。
4. **与改名前例区别**：hub 是渲染产物但**有启动链真消费者**（此前误判为纯产物——BOD 补勘探明），故照 TriMC→TriMMC 兼容面先例给过渡别名。

**执行形态**（并入夜航窗）：
1. `git mv .claude/hub .claude/compass`（13 件）
2. `.gitignore` 增 `.claude/hub/`（junction 路径=过渡别名不进版本库，防 git 遍历 junction 双计）
3. **junction 建立（2026-09-14 18:3x 预验通过的命令）**：PowerShell `New-Item -ItemType Junction -Path .claude\hub -Target .claude\compass`——**坑定谳**：Git Bash `cmd //c mklink /J` 被 MSYS 路径转换吃参数（`/J`→伪路径），禁用；建立后穿透读取已验证（junction 内文件 Test-Path=True）。
4. **删除法（终点时用）**：`[System.IO.Directory]::Delete($path, $false)`（.NET 递归=false 只删 reparse point 不跟随目标；**禁 `Remove-Item -Recurse`**——旧 PowerShell 版本会递归进目标误删真身；预验：删链接后目标 13 件完好）。
5. sg 侧随其拉取窗同法（`ln -s compass hub`，Linux 原生）。
6. 过渡终点=**触发式**（manifest 启动命令段更新+sg tmux 全量重启过一轮+文档活件更新——三者齐即删 junction），照改名先例防双名无限延长。

## 六、与一期并行件同窗

- 同窗件：合同瘦身（前置核查指针挪 hub→compass 新址）+13 对文件去重（一期 FSD 工作流）——三者共同回执端=发布管线，合并一次重渲窗（避免多次全量重渲）。
- 执行窗建议：一期去重对照表出→瘦身 diff 出→**一次窗执行**（管线改+目录迁+重渲+三件回归）。

# V21-2 勘定记录：LG-017 dev 写控撞点机制（CTO 席）

- sourceOfTruth: 本文件（树 lg017-v21-legislation 内勘定记录）
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 席位/授权：CTO 小狄；CEO 立法令 V21-2（树内必答）
- 边界：只勘定机制，不实施任何 hook/分支/服务变更；懒激活三件套（建 staging+rmc_tick 合同改写+pre-receive 扩展）同批激活约束不变，激活另令
- 勘定方法声明：本席环境无 ssh/git 命令执行面，服务器侧身份采信助理席实勘（任务书标注可信），并与拓扑正身作者锚（f284c19b/eb39129b）交叉一致；代码侧锚为本席直接读源
- 代落盘：董事长助理 xiaojia-hub-r4（本席环境无 Write 面，2026-08-31 12:1x +0800 落）

## 一、勘定输入与实证基线

| # | 事实 | 锚 |
| --- | --- | --- |
| B1 | sg-bare 是 dev 唯一正源；hooks 实勘：post-receive 有、**pre-receive 无**；写侧三方汇入 dev（本地主仓/sg 检出/heyuan 检出） | repo-topology-20260831.md §一/§二 |
| B2 | 迁移 commit 实证：f284c19b author=TriRMC-Scheduler \<trirmc@tri.company\>（heyuan weekly-plane-shift job 9c81c7ec，周日 23:00 +0800） | 同上 §二 |
| B3 | heyuan 检出 git 身份=TriRMC Scheduler \<trirmc@tri.company\>，**迁移 commit 与 R 面会话 commit 共用此检出级身份**（rmc_tick 派工 agent 用检出 config） | 助理席实勘（采信） |
| B4 | sg 检出身份=TriMMC Orchestrator \<trimmc@tri.company\>；sg watcher/巡检作者=TriMC Scheduler \<trimc-scheduler@fleet.local\>（eb39129b 实证）；本地 M 面/CEO=MoRen \<81227665+MoRen9527@users.noreply.github.com\> | 助理席实勘（采信）+拓扑 §二 |
| B5 | rmc_tick R 面合同：_tree_brief Hard rules（rmc_tick.py:194-200），git 合同行 :198 `git limited to: add explicit paths / commit / push origin dev; no force, no rebase`；RFACE_SYSTEM_PROMPT commit 指令 :62-65；face 门 :138-139；REPO 硬编码 :25 | TriRMC/scripts/rmc_tick.py（本席直读） |
| B6 | LG-017 主体=pre-receive 防 force-push（v1.1 §7.5 第 3 层承诺未装，脚本现成于 v1.1:210-221，git 档冻结）；勘验项=身份级 dev 写控须先解决两检出区分 | ledger-mirror LG-017 条目；lg-019-opinion-cto.md B2/A8 |
| B7 | 协议 v2.0 单 dev 模型：R 面产出合同现行=push origin dev（:78）；懒建 clone 参数（:31-33）；分叉预案即停升级 M 面（:82-84） | mr-worktree-collaboration-protocol.md（v2.0） |

撞点恒等式（本节点核心）：heyuan 单检出单身份（B3）⇒ trirmc@tri.company 在 dev 必须放行（迁移，B2）⇒ 同邮箱的 R 面产出 pre-receive 无法用邮箱区分 ⇒ 撞点只能靠「R 面 distinct commit 身份合同」收窄，机械闭环需 phase-2（见 §五/§七）。

## 二、机制主案勘定（问题 1）

**主案：pre-receive 作者/提交者邮箱允许单 + R 面 distinct commit 身份配套 + post-receive 撞点观测 tripwire。判定：APPROVE（附上述配套为生效条件）。**

**authorized_keys 分流：否决为主案，降为 phase-2 身份硬化备选。**

理由按 CEO 给定优先序：

1. **迁移链不炸（硬约束第一）**：邮箱允许单下迁移 push 的身份/密钥/路径零变化（trirmc@tri.company 在单），对迁移链爆炸半径=0。authorized_keys 分流要给 heyuan 发独立 key+sg-bare authorized_keys 动手术，直接触碰迁移 job 依赖的传输层；且 heyuan 内部迁移与 R 面共用同一检出，分流还须给每条流注入不同 key——变更面更大、炸链面更大。
2. **防 R 面 dev 直推的有效性**：邮箱方案跨检出区分 M 面（sg/本地）与 R 面（distinct 邮箱）有效；heyuan 内撞点由 distinct 身份合同收窄+tripwire 事后暴露。authorized_keys 方案在 heyuan 内**同样分不出**迁移与 R 面（一检出=key，无论怎么发），且 authorized_keys 表达不了分支级 ACL——分支策略仍然要靠 hook——即它只是把身份判定从 commit 元数据挪到传输层，判别力不增、运维面大增。
3. **实施/运维成本**：邮箱方案=一个 hook 文件+brief 两行改写；key 分流=两台服务器 key 管理+authorized_keys 手术+payload 改造+新故障模式（key 权限/env 注入）。

## 三、允许单/拒绝单精确清单（问题 2）

**dev 允许单（author 与 committer 两字段都须命中；大小写不敏感精确匹配；deny-by-default）：**

| 邮箱 | 身份 | 流量锚 | 性质 |
| --- | --- | --- | --- |
| trirmc@tri.company | heyuan 检出级 config（TriRMC Scheduler） | f284c19b | **迁移硬约束项，必须放行** |
| trimmc@tri.company | sg 检出级 config（TriMMC Orchestrator） | 助理席实勘（未本席复核，见 §八） | M 面 |
| trimc-scheduler@fleet.local | sg watcher/巡检脚本级作者 | eb39129b | M 面 |
| 81227665+MoRen9527@users.noreply.github.com | 本地主仓 M 面/CEO（MoRen） | 日常双推 | M 面 |

**dev 拒绝单（拒+staging 指引）：**

- `rface-agent@tri.company`（建议命名，user.name="R-Face Agent"）——R 面会话 distinct 身份，heyuan 与未来本地懒建 clone 通用。命名理由：face 语义直读、与派工器（TriRMC）/宿主（TriRLC）解耦、单条规则覆盖现在与将来全部 R 面执行体；该邮箱在史为零，随三件套激活出生。
- 一切未在允许单的其他邮箱——拒+指引联系 CTO 增补（新 M 面写侧走允许单变更流程，工程真源留痕）。

**staging 分支策略**：无邮箱策略（事前审平面从宽），仅 anti-non-ff+禁删（与 dev 同规）。

## 四、pre-receive 扫描技术要点（问题 3）

1. stdin 行 `oldrev newrev refname`；策略只挂 `refs/heads/dev`（邮箱写控+anti-non-ff+禁删）与 `refs/heads/staging`（anti-non-ff+禁删）。tags 及其他 refs 本期不设防（边界声明入 §七）。
2. new commits 范围=`git rev-list $oldrev..$newrev`（merge commit 自身与其第二亲线带入的新提交天然在扫——走私面覆盖）。ref 创建（oldrev 全零）→ `git rev-list $newrev --not --all`；ref 删除（newrev 全零）→ 无 commit 可扫，径走删除策略。
3. **author 与 committer 都扫，准入判据=两字段均在允许单**。单字段判定存在另一字段走私面；现行写侧组合（sg watcher author=trimc-scheduler、committer 推定=检出 config trimmc）双在单兼容。任一字段命中 R 面身份→R 面拒文；任一字段不在单→未知身份拒文。
4. anti-non-ff（LG-017 原主体）：更新时 `git merge-base --is-ancestor $oldrev $newrev` 不过即拒；周一回流 merge push（old 是 new 祖先）不受影响；禁 force/禁历史重写/禁删 dev 一次收口。
5. 性能上限：先 `git rev-list --count`，>500 拒（fail-closed，文案指引拆分/联系 CTO）；常态推送 <10 commit、亚秒级。pre-receive 在 git quarantine 环境（GIT_OBJECT_DIRECTORY/ALTERNATE 自动注入）下裸 git 命令即可见待审对象，无需特判。
6. 失败姿态：策略判定路径与 hook 自身异常一律 fail-closed；部署前置 fixture 用例自测（全零创建/全零删除/merge/R 面邮箱/未知邮箱/非 ff）；回滚=hooks/pre-receive chmod -x 或 rm，**无需重启任何服务**，秒级。
7. 配置形态：允许单内联 case 或旁挂 `hooks/dev-allowlist.txt`；脚本正身镜像入 TriMetaverse `scripts/hooks/` 走评审，服务器部署另令（本席无执行面）。
8. **配套观测件（post-receive，同批部署、只观测不拦截）**：dev 新提交 author=committer=trirmc@tri.company 且 committer 时刻不在周日 23:00-23:59 +0800 → 旗标留痕（撞点疑似，人工裁决）。容忍误报（迁移改期重跑）；不拦截保迁移链。

## 五、distinct commit 身份配套改写落点（问题 4）

- **主落点**：`TriRMC/scripts/rmc_tick.py` _tree_brief() Hard rules 段（:194-200）——① :198 git 合同行 `push origin dev` → `push origin staging`；② 同段增一行身份硬规：每条 commit 命令必须 `git -c user.name="R-Face Agent" -c user.email=rface-agent@tri.company commit ...`，检出默认身份（trirmc@tri.company）禁用于本会话 commit。纯增量，符合 LG-016 CPO-2 零取代口径。
- **辅落点（建议）**：RFACE_SYSTEM_PROMPT（:50-89）§3 commit 指令（:62-65）同步补 -c 要求，双写一致。
- **禁用 git config 落盘式改身份（heyuan 检出）**：检出级 config 是迁移 job 的身份源，R 面会话 `git config user.email` 会污染迁移身份=炸迁移链。会话 shell 每次新进程、env export 不跨调用持久，故 **per-command -c 是 heyuan 侧唯一可靠作用域**。
- **本地懒建 clone 不对称**：本地 clone 无迁移流量，懒建清单（协议 §一）增一行——clone 建成即落 clone 级 git config（R-Face Agent / rface-agent@tri.company），免除 -c 负担。此一行随三件套同批入协议。
- **agent 可绕过 -c 吗**：可——prompt 级合同非机械强制；绕过时 commit 落检出默认 trirmc@tri.company，pre-receive 无从拒（撞点恒等式本身）。兜底=§四.8 post-receive tripwire 事后暴露 + staging 事前审人审兜住产出质量；机械闭环=phase-2 给迁移 payload（weekly-plane-shift）加 -c 专用身份（建议 planeshift@tri.company），验证一个迁移周期后将 trirmc@tri.company 移出 dev 允许单，绕过即被机械拒绝。phase-2 触碰迁移 payload，不在本批激活。

## 六、拒绝提示文案（问题 5）

R 面身份命中（rface-agent@tri.company）：

```
[dev-write-control LG-017/v2.1] REJECTED <sha12>: R-face session identity detected.
dev is M-face + plane-migration only during the capability-gate phase.
Route: git push origin HEAD:staging  (then request M-face review/merge, protocol v2.1 §5)
Ref: rmc_tick brief Hard rules / mr-worktree-collaboration-protocol.md
```

未知身份：

```
[dev-write-control LG-017/v2.1] REJECTED <sha12>: author/committer <email> not on dev allowlist.
dev writers are registry-managed. Contact CTO to review the allowlist before pushing.
```

非 ff / 删除（LG-017 原主体）：

```
[hook LG-017] REJECTED: non-fast-forward update to <ref> forbidden (no force-push, no history rewrite). Stop and escalate to M-face per protocol §8 — do NOT rebase/force.
[hook LG-017] REJECTED: deletion of <ref> is forbidden.
```

## 七、残余风险与接受理由（问题 6，立法树风险段素材）

1. **最大残余：R 面会话绕过 -c，以 trirmc@tri.company 落 dev，pre-receive 无从拒**（同邮箱恒等）。接受理由：迁移链不炸=硬约束第一，trirmc 必须放行；tripwire+staging 人审双兜底；phase-2 闭环路径明确（§五）。定性：绕过者是自家 R 面执行体，此为**路由面缺口非安全面缺口**，产出质量由事前审兜住。
2. 邮箱自声明性：邮箱非认证凭据，同 SSH key 下可任意署名。本机制是**路由门禁不是安全边界**，安全边界仍在 sg SSH key 管控层。接受理由：单租户 fleet、物理写侧仅三方，威胁模型=防误路由不防伪造。
3. 允许单维护摩擦：新 M 面写侧首推被拒。接受理由：deny-by-default 是 dev 写控的语义本身；拒文带 CTO 指引；允许单变更走工程真源留痕。
4. hook fail-closed 部署风险：hook 自身 bug 理论上可炸迁移推送。接受理由：fixture 用例自测前置+秒级回滚（rm hook）+迁移窗既有探测面（lastRunStatus+23:08 巡检兜底）三层。
5. 范围外未设防：tags/其他 refs 无策略；本 hook 只辖 TriMetaverse.git。随 LG-017 主体实施一并书面声明边界，防「已设防」误读。

## 八、未验证项（实施时复核，禁凭本记录外推）

- 本席未 ssh 实勘（环境无执行面）：heyuan/sg 检出身份采信助理席实勘；实施部署前登机读侧复核 git config user.email（heyuan=trirmc、sg=trimmc），零变更。
- trimc-scheduler@fleet.local 的 committer 字段（是否=检出 config trimmc）未核；双字段规则兼容两值，实施时以 eb39129b 实际双字段复核。
- v1.1 §7.5 第 3 层脚本（:210-221）未重读（git 档冻结+本席无 git 命令面）；实施时 git show 取回作底稿，按本文 §四重写为 dev 写控版。
- 本报告时刻未现查（M-001）。

## 九、发布姿态（激活序建议，本节点不实施）

1. 三件套同批激活前置：确认无 in-flight rmc_tick 会话（锁/session-registry 检查）。
2. 同批：sg-bare 建 staging 分支 → rmc_tick 合同改写（push 目标+identity 硬规+懒建 clone 参数一行入协议 §一）→ pre-receive 部署（fixture 用例 PASS 后上）+post-receive tripwire。
3. 激活后首迁移窗（周日 23:00）为硬验收：f 序列迁移 commit 正常入 dev、tripwire 零误报留痕；异常即回滚 hook（rm）并升级 M 面。
4. phase-2（另令）：迁移 payload 独立身份一个迁移周期验证 → trirmc@tri.company 移出 dev 允许单 → 撞点机械闭环。

（V21-2 勘定记录完；代落盘=董事长助理 xiaojia-hub-r4）

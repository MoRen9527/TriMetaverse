# per-seat worktree 一期零风险部署·完工报告（BOD 立项批）

- date 现查: 2026-09-22 11:37:15 +0800（星期二）
- 执行席: SDE 小布（部署/打包线；原一期主 FSD 异常挂账候体检，BOD 改派）
- 设计件: `worktree-design.md`（CTO 主笔直呈 CEO 批，CEO 11:29 立项批）——本报告续卷同树
- 并窗声明: 本席无在途打包任务，无并窗，单窗独立执行

## 命名裁定（声明项）

`<seat>` 取 `.claude/seats.json` 字面字段 `seat`（role slug：board / ceo-chief-of-staff / … / senior-test-engineer），非 opsName——理由：opsName 本窗即有迁移实证（m-dee→m-sde 正名族），role slug 才是稳定标识；设计件 `<seat>` 与 roster 字段名一一对应，非猜测。如 BOD 另裁改用 opsName：改名可逆（wt 分支 -m + 目录 mv + worktree 嫁接更新），随时可切。

## 一期四动作执行读数

| 动作 | 读数 |
|---|---|
| ① worktree add ×14 | 14/14 OK（逐笔 OK 回显，失败即停未触发）；起点=dev @ d6f910e0（当时 dev 顶） |
| ② 分支 wt/<seat> ×14 | 14 笔全建（`-b` 随 add 一笔落，基于 dev） |
| ③ 位布局验证 | `D:/Code/ai/TriMetaverse-worktrees/` 14 目录，与 roster 逐名对表一致 |
| ④ 不切会话 | 零会话切换——14 worktree 仅存在不使用（设计件裁定无害） |

## 验收锚读数

| 锚 | 读数 | 断言 |
|---|---|---|
| `git worktree list` | 15 行 = 主树 [dev] + 14 席 [wt/<seat>]，全部 @ d6f910e0 | ✓ 14 席断言过 |
| wt 分支创建清单 | `wt/board`…`wt/senior-test-engineer` 共 14 笔（`git branch --list 'wt/*'` 计数=14，均 checked-out 态=各归其位） | ✓ |
| 位布局读数 | 14 目录清单与 seats.json roster 逐名一致（清单见上表动作③） | ✓ |
| 抽检 | senior-deployment-engineer 位：branch=wt/senior-deployment-engineer，status clean | ✓ |

## 红线守约

1. **主树/会话 cwd 零触碰** ✓：主树断言=dev @ d6f910e0 不动、porcelain 前后对照一致（未轨件全他席原样未夹带）；无任何会话切换。
2. **`worktree remove --force` 全仓禁用** ✓：本批零 remove 调用（含 --force 形）。
3. **npm junction** ✓：TriMetaverse 无 npm 包面，天然零风险；未触碰任何 node_modules 面。

## 回滚方案（全程在位，未启用）

- 全 14 位 status clean → `git worktree remove <path>`（裸 remove 即可，无需 force，红线②不触）×14 → `git branch -D wt/<seat>` ×14 → 删 `TriMetaverse-worktrees/` 残壳。
- 主树全程未动（设计件 §六：全量可逆，零风险保底）。

## 观察项（如实记账，非本席动作）

- 主树未轨件 `o4-recon.md` 本窗自 status 消失（非本席动作，平行席位车道活；主树 HEAD 至收口未移，防后续账实差误判特记一笔）。
- 磁盘足迹：14 全检出位 du 遍历超时未取读数（非验收锚项，如实记「未测」；git 对象共享 `.git` 主库，增量≈工作文件拷贝面）。

## 待批衔接（候二期）

- 二期试点切换（FSD/BOD/COS 三席 cwd 切换）候 CEO 批——本席部署面就绪；切换窗照设计件 §三（D-29 低活窗+逐席留痕+切换前 status 三查）。
- 归账纪律（wt 分支→dev ff 节奏）随二期入册（设计件 §五-4）。

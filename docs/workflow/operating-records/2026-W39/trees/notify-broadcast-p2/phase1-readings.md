# LG-052·TASK-NOTIFY-BROADCAST-P2-01 阶段一执行读数件（phase1-readings）

- sourceOfTruth: 本件（阶段一读数+归因正身；任务书=wt/board 20bd58ad）
- syncMode: append-only（阶段读数追加）
- lastSyncedAt: 2026-09-24T23:4x+0800
- 执行席: FSD（m-fsd 主笔）；协同=SDE 部署面（串行优先排期）；上游=BOD 派工令（CEO 23:14 批）+COO 枢纽交单（23:17）+COO 两裁示/BOD 两预裁（23:23/23:25）
- 树指针: 本件所在树（wt/full-stack-developer W39）；任务书正身在 wt/board（20bd58ad）

---

## 一、交付物（阶段一·本机 13 席广播可达）

| 仓 | commit | 内容 |
| --- | --- | --- |
| TriMMC（发端） | `c6fe1fb` | ①TARGET_SEAT_ROSTER 扩 13 员工席 opsName（seats.json 正名制；bod/coo 治理短名保留=既有双投零变化）②SOURCE_SEAT_WHITELIST+bod/m-cos/m-coo（m-duty-cos 留）③enqueueNotifyBroadcast 展开制（逐件派生 id `base--seat`/三态逐席追踪/整单原子无半投）④routes targets 入参（数组或逗号串） |
| TriMLC（收端） | `ef7f8a1` | ①puller 名册双名并入（seat 全名+opsName 正名——错位解，FIXED_ROUTE bod/coo 不动）②puller 回归四测 ③单智能收信 hook `scripts/notify-inject.cjs`（BOD 预裁路线） |

## 二、关键设计与裁示落地

1. **广播语义**（任务书二.2 原条款不动）：一稿多投=展开 N 件独立消息，逐席派生确定性 message_id（`base--seat`）→幂等重播同基同席命中既有件；三态 accepted/forwarded/delivered 逐席独立可对账（测试实证单席确认不影响他席）。
2. **限速语义**（BOD 预裁准）：计源操作数不计展开件数——广播=1 操作；展开件仍逐件独立 id 三态追踪。约束值零变（10 操作/分/源席）。
3. **整单原子性**：任一前置门不过（名册外/重复席/4KB/限速）=零落箱；pending 上限空间按展开件数原子预留，不足整单 503（无半投）。
4. **单智能 hook**（BOD 预裁准）：不逐席改 12 份 settings——一个脚本按会话 cwd 推席（worktree 目录名↔seats.json seat→opsName；主树=bod 零变化；非本仓目录不注入）；`TRIMC_NOTIFY_MAILBOX` env 对齐 letter-store 语义作测试缝。
5. **收端名册错位解**：puller 原名册集读 seats.json `seat` 全名，广播件 target_seat=opsName 正名——双名并入（同源错位即 FADE-010 FIXED_ROUTE 先例），FIXED_ROUTE 不动。

## 三、自测读数（全量自含）

| 仓 | 面 | 读数 |
| --- | --- | --- |
| TriMMC | `npm run check` | exit 0 ✓ |
| TriMMC | notify 定向（outbox+gate 两件） | **24/24 绿**（既有 15+新增 9：名册 15 席读数/白名单/展开三态独立/幂等重播/名册外整单拒/重复席拒/pending 原子性/限速操作数/单投零变化哨兵） |
| TriMMC | 全量套件 | 591/596（4 fail 3 名=契约漂移既有，归因 §五） |
| TriMLC | `npm run check` | exit 0 ✓ |
| TriMLC | notify 定向（notify+gate 两件） | **15/15 绿**（既有 11+新增 4：opsName 件收递/FIXED_ROUTE 零变化哨兵/名册外跳过/幂等重拉） |
| TriMLC | 全量套件 | 594/599（5 fail=与 09-24 LG-035 A/B 实证既有名单逐一同名，同源件非新增） |
| hook | 四景冒烟 | worktree→m-fsd 件显示 ✓/主树→bod 件显示（零变化哨兵）✓/非本仓静默 ✓/真信箱本席静默（非破坏）✓ |

- 修测两笔（均测试侧）：①限速测试种子算术错位（10 件占满窗口后广播=第 11 操作被拒为正确语义，改 9+广播=第 10 操作）②TriMLC 测试漏 import writeFileSync。实现侧零回改。

## 四、SDE 部署清单（串行优先排期；重启窗避 14:00-18:00，stop/start 权威路径）

1. TriMLC daemon env 确认/补 `TRIMC_NOTIFY_SEATS_FILE`→`D:/Code/ai/TriMetaverse/.claude/seats.json`（现值候勘）；
2. TriMLC daemon 重启（载新 puller 双名逻辑；stop/start 权威路径）；
3. sg TriMMC 侧部署 `c6fe1fb`（发端广播面生效）+重启；
4. 本机 user settings.json hook 行替换：现内联单行→`node D:/Code/ai/TriMLC/scripts/notify-inject.cjs`（回滚=还原单行）；
5. 部署毕知会本席约 e2e 实测窗。

## 五、差口与归因（如实）

1. **TriMMC 全量 4 fail 3 名**（Contract Resolver CTO v3.0/resolveContracts 14 v3/Employee Registry 14 v3）：断言面=source-agents 契约工具表内容（`tool "read" should have runtime_equivalent`——契约演进后测试预期滞后），与本席 notify 改动零表面交集，既有定性（owner=契约线）；TriMLC 全量 5 fail=与 LG-035 A/B 实证既有名单逐一同名（同源件）。
2. **TriMLC 未跟踪件** `scripts/digest-inbox.mjs`：他线在办未触（闸 2 记录）。
3. **hook 覆盖面口径**：单智能 hook 对已切 worktree 席（现 FSD/BOD/COS 三席）即席生效；未切席位随 worktree 切换自动生效（零逐席追加动作），其 letters 已先行落共享信箱（delivered 态可见）——e2e 抽样三席=三已切席，与验收锚 A「≥3 席抽样」吻合。
4. **rebase 并集解**：本席 wt 分支 replay 时与 dev 归账版冲突（switch-log 双版），append-only 并集解两侧原文零改动（解注随卷）；分支强推（force-with-lease）已核远端无他席孤本。

## 六、使用依据

- 任务书 20bd58ad（wt/board）§一/二/三/四/五；COO 两裁示+BOD 两预裁（2026-09-24 23:23/23:25 对话留痕）
- TriMMC d1189cf→c6fe1fb；TriMLC d325050→ef7f8a1（git 实盘）；seats.json（派生件只读消费）
- 既有测试件：notify-outbox.test.ts/notify-gate.ste.test.ts（TriMMC）、notify.test.ts/notify-gate.ste.test.ts（TriMLC）

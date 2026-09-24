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

---

## 八、阶段门 PASS+阶段二实施（2026-09-25 00:0x-02:5x+0800）

**阶段门：BOD PASS 放行阶段二**（BOD 自执 e2e 非转抄：accepted 14/14→delivered 14/14→信箱落箱 14/14；锚 B 回归绿+bod/coo 零变化；锚 E 公告件一稿两用兑现——本席 hook 实收 m-fsd 公告件自证）。两裁：①m-dee/m-sde 采本席推荐案（manifest opsName 对齐，CHO sde-rename 线并车）②发端 BOD 自执。

**阶段二交付（TriMMC `2d262d0`，5 文件 +347 行）**：
- `duty-consumer.ts`：sg 值席收端消费面——同进程定向拉取（`pullPendingForSeats` 零 HTTP 回环，attempts 定向隔离不抢 trimlc 件）/normal 信箱落箱即达/urgent tmux display-message 弹显失败滞留 forwarded（与 TriMLC urgent 语义同构，不静默）/env 门（TRIMC_NOTIFY_DUTY_SEATS 未设=零行为）
- roster 增 `m-duty-cos:trimmc`（跨面定向；本地 puller 名册外自动跳过不抢）+app 启停接线
- 测试：duty-consumer 六测（env 门/三态回写/定向隔离/urgent 双态/信箱语义/幂等）+roster 计数 16 断言更新——notify 族 **30/30 绿**+check=0；TriMLC notify 回归绿（跨仓零变化哨兵）
- 修测两笔（测试侧）：urgent mock 反相/名册计数未随阶段二更新——实现侧零回改

**跨面实测（锚 C）候部署**：本机 POST（target m-duty-cos/daemon trimmc）→ sg 值席 consumer 拉取交付 → 三态回写。SDE 部署件：sg TriMMC 载 2d262d0+env `TRIMC_NOTIFY_DUTY_SEATS=m-duty-cos`（+候 m-duty-cos 裁 TRIMC_NOTIFY_DUTY_TMUX 会话名）+重启；m-duty-cos 协同：值席信箱位置/tmux 会话名/留痕制兼容确认。
**在途**：TriMMC 2d262d0 GitHub push 吃 reset（本席出口差口在册，SDE/巡检通道兜底）。

---

## 九、锚 C 跨面实测读数（2026-09-25 03:00-03:01+0800；SDE 部署三件毕后本席发令）

- **发端**：本机 POST sg /internal/v1/notify ×2（source=bod/target=m-duty-cos/daemon=trimmc；message_id=lg052-c-{normal,urgent}-1790276411）→ 双件 accepted pending ✓
- **①normal 件：三态回写全绿**——accepted → forwarded → **delivered**（信箱落箱语义全链，57s 内完成，consumer 30s 间隔轮转实证）
- **②urgent 件：弹显面滞留 forwarded**（accepted→forwarded；tmux display 在 systemd service 上下文未达 tmux server socket——设计语义正确触发：不静默、status 面可见、信箱已落箱可见）→ SDE 候查项：service↔值席 tmux socket 上下文（runuser/TMUX_TMPDIR 系）；过渡态=信箱可见面已覆盖值席可见性
- **锚 C 判定素材**：跨面链路（本机发→sg 值席收→三态回写）normal 面全绿=任务书锚 C 最小满足；urgent 弹显面=增强增强项候修（不阻收口，SDE 单随发）
- 凭据卫生：本席发令用 daemon env 真源凭据（transcript 零 token 落盘）

---

## 十、终验收笔（2026-09-25 03:1x+0800）

**BOD 终验：LG-052 全单验收 PASS，收口销账**（BOD 独立复核：锚 C 双件三态与本席读数逐字一致+consumer env 进程实锤+hook 行 notify-inject.cjs 实锤=锚 D；五锚全齐 A/B/C/D/E）。随门三裁：①urgent 弹显面挂账随销账（过渡态双覆盖可接受）②晨网兜底推照准③LG-050 08:00 起表确认。

**任务书生命周期闭合**：派工（09-24 23:17）→摸底四裁示（23:23/23:25）→阶段一编码完工（23:42）→SDE 部署五步（23:43-23:58）→阶段门 PASS（00:0x e2e）→阶段二编码（02:54）→部署三件（03:00）→锚 C 实测（03:01）→全单销账（03:1x）——净历时约 4h，两阶段+阶段门制全程零卡点升级。

**新交付面（销账注记同 BOD）**：duty-consumer（sg 值席收端）+广播展开制+单智能 hook——NOTIFY 通道自此「一稿全席 13+1+sg 值席」三面全通。遗留观察项：sg TriMC c306d00 候合流+duty 信箱路径显性化（文档面小项）+urgent socket 修（SDE 挂账）。

---

## 十一、销账挂账闭合（2026-09-25 03:06-03:09+0800）

- urgent socket 错位修全链验证：SDE 三连（bare 推平 970b5cc/drop-in 三 env 含 TMUX_SOCK=/tmp/tmux-1001/default/restart active）→ 本席发新 urgent 件 `lg052-c-urgent2-1790276905` → **accepted→forwarded→delivered 三态全绿（41s）**——tmux `-S` 旗桥接生效，弹显面活。
- 销账挂账项至此清零（余晨网补推批：TriMMC 970b5cc/2d262d0+本树三笔——SDE 晨批在册）。

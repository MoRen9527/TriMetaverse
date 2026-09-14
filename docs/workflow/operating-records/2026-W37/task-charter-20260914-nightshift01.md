# 任务书 20260914-夜航01（BOD 应急打包，PACE 首航）

- face: **server-executable → M 面 MMC（M-SG）值席拾取执行**
- PACE: P=本任务书（已铸）→ A=已挂本平面（W37）→ C=MMC 值席拾取派树 → E=节点收口回写本文件
- 边界: 不动 R-HY 生产数据；bare dev 整合一律 ff-only；遇冲突即停回报；深夜生产机操作逐条留痕

## 任务1：周迁移回流三修（R-HY 链通）
- 内容: ①R-HY 推回被拒（非快进）按台账「回流冲突解法」通链，03774c50 推上 hub bare dev；②`.tricompany-cognition/` 定性（跟踪 vs gitignore）；③周迁移作业加「push 被拒→再拉取→合并→重推」分支
- 验收锚: hub bare TMV dev 含 03774c50；R-HY 与 hub 双向平；作业 json 含重推分支
- 证据: 执行读数回写本文件收口节

## 任务2：hub 对齐（sg 工作仓拉平）
- 内容: /srv/fleet/TriMetaverse 与 /srv/fleet/TriCompany 拉平至 hub dev 最新（含本任务书提交 4617cc22 之后）
- 验收锚: 两仓 `git log --oneline -1` ≥ 本任务书提交；工作树净

## 任务3：B3/B4 打样批（树协议回归首航）
- 内容: project-sources 2 件 + source-agents 首批 10-30 件按任务书树协议联审（五席独立意见→汇总）
- 验收锚: 树文件夹落 operating-records 当前周 trees/；节点收口报告齐；汇总件呈 BOD

## 收口区
（执行席逐任务追加：## 收口-任务N + 时间 + 读数 + 证据指针）

## 收口-任务1（周迁移回流三修）·2026-09-14 04:0x +08·MMC 值席

**验收锚三读数：**

1. **hub bare TMV dev 含 03774c50 ✓**（`git merge-base --is-ancestor 03774c50 dev`=IN-dev；03774c50=W37 周迁移提交〔TriRMC-Scheduler 2026-09-06 23:00:06〕，09-07 已上 hub，W37 首跑实证）。
2. **R-HY 与 hub 双向平（代理判定）**：链通实证=fade-hook.log `[2026-09-13T19:20:56Z] dev updated 9df6db31 -> 3b5e1562`——R-HY 侧（TriRMC-Scheduler 03:20:53 commit 3b5e1562）fast-forward 推送成功；此后 hub dev 无新推进（fade-hook.log 末笔=95784219 本席推送）+河源 cron 空载（jobCount=0）无新本地提交源→判平。**如实标注**：R-HY 侧精确 SHA 远读不可达（8710 公开面无 git 状态端点；SSH 无凭据——E-0007 实证），此判定为代理证据链。
3. **作业 json 含重推分支 ✓**：①`docs/execution/lg-heyuan-cron-reregister-runbook.md` job1 注册体正身化（commit 383ee3df）——现役 command 实录已随 heyuan TriRMC 内存态灭失（09-14 远读 jobCount=0），三源同构重建（f284c19b/03774c50 身份时点实证+branch-switch-impact §1.2/1.3 路径锚+PLANE_SHIFT_PRESET 同源模板），push 段含「被拒→fetch→merge 归账→重推」（台账锚 pool-sync-runbook §2.4 merge-only；冲突即败暴露走人工裁决线不 force）；②TriMC 仓 preset 源码面同款分支（commit 8982004，tsc clean+command-handler 6/6）。

**② 定性落地验证 ✓**：先行提交 3b5e1562（TriRMC-Scheduler 03:20）已 untrack `.tricompany-cognition/`+gitignore:23；本席复核=git ls-files 零跟踪+check-ignore 命中+sg 侧磁盘已清。

**证据指针**：fade-hook.log（19:20:56Z 推送实录）；commits 383ee3df（TMV）+8982004（TriMC）；tree 无（任务1 为链路修复非树活，D-27 对话式派工限界条款下本件任务书即补档载体）。

**⚠ 回报项（超出任务书边界，候 BOD/授权侧）**：
- **河源 TriRMC cron 空载**（healthz：enabled=false/jobCount=0）——现役三 job（weekly-plane-shift 9c81c7ec/rmc-orchestrate-tick 381a1886/tricompany-pull fba9d2c7）内存态灭失，重注册需河源侧 SSH/token（值席无凭据，不动 R-HY 生产数据边界守住）；重注册配方已备（runbook 正身化即为此）。
- **W38 周迁移缺失**：09-13 23:00 窗无执行点在跑（河源 job 丢+sg 侧 b00b0070 enabled=False 退役态）→2026-W38 目录未生成、W37 仍 latestActiveWeek。补跑决策（sg 手动五段链 vs 河源重注册后跑）候 BOD。
- sg TriMMC degraded（consecutiveFailures=23，daily-progress-watcher error + github-reconcile 2 连败）——09-09「trimc degraded 4h 疑案」根因归 CTO 线在案，未扩单。

## 收口-任务2（hub 对齐）·2026-09-14 04:0x +08·MMC 值席

- **TMV**：dev=383ee3df→95784219（任务书提交 9df6db31 之后），本地=hub=GitHub 三端齐平 95784219（ls-remote 实证+mirror pushed 19:54:20Z）；工作树净（清理 p0fix 批三处临时残留：p0fix1 `.ledger-backfill-tmp.py`/p0fix4 `reports/sandbox/`/`tmp-work/`，均 08-27 临时产物、正式产物在跟踪面）。
- **TriCompany**：工作仓 ff 拉平 b42d34c→7027a9e（behind 183 清零；拉平障碍=untracked `docs/training/fade-001-maintenance-deep-dive.md` 428 行 sg 稿原版，md5 ba2368ec 与远端定稿头注登记精确吻合→归位 `.fade/hub-snapshots/fade-001-maintenance-deep-dive-sg428.md` 登记路径）；gitignore 补 `.fade/` 条目（对齐 TMV 纪律，0ef1cfe）；工作树净 ✓。
- **⚠ 回报项**：TriCompany 仓 push 至裸仓被拒「unable to migrate objects to permanent storage」——裸仓 62 个 root 属主 loose 目录挡 quarantine 迁移（B2 病灶复发形态；值席无 sudo 不硬闯）；工作仓 ahead 1（0ef1cfe）在途未推，候 root sweep（`find /srv/git/TriCompany.git/objects -maxdepth 1 -type d -exec chmod g+w {} +`，root 通道 1 分钟）后重推。另：改名残差顺手清了两件——`safe.directory=/srv/git/TriMMC.git` 补 global（旧名条目保留）+TriMC remote url 更新新名。

**证据指针**：commits 95784219/383ee3df（TMV）+0ef1cfe（TriCompany）；fade-hook.log 尾笔；`git ls-remote github` 同值读数。

## 收口-任务3（B3/B4 打样批）·2026-09-14 04:3x +08·MMC 值席

**验收锚三读数（全 ✓）：**

1. **树文件夹落 W37 trees/** ✓——`trees/b3b4-joint-review-pilot/`（tree-op.json 三节点全 done；现势 active 周=W37，W38 迁移缺失见任务1 回报项）。
2. **节点收口报告齐** ✓——reports/ 七件：五席意见（bb1-cos 92 行/bb1-cto 96/bb1-cao 99/bb1-cpo 121/bb1-bs 85=493 行 wc -l 实测）+汇总件（bb2-summary.md）+收口报告（bb3-closeout.md，D-27 销账锚正身）。
3. **汇总件呈 BOD** ✓——bb2-summary.md §七呈报表。

**联审读数**：B3 两件+B4 首批 18 件（CTO 域 9+CAO 域 9，占 10-30 区间）五席全量表态 20 件；出席形态=CTO/CAO/CPO 走 m-duty 常驻席 M-004 直达+COS/BS spawn（V0.2 基列制形态；**过程纠偏实录**：值席首发误用 spawn 4 席→自纠 M-004，D-27 首航打样产出之一）。程序位=审（全批零改动）。

**主要产出**：共识 10 项（最大收敛=CAO 工作名四载体两态 5/5 席、contract runtime_baseline 陈旧 5/5、CLAUDE.md:60 定性修正 5/5 同意、AGENTS.md L74-76 退役 agent_type 3/5+名册实证）；候 CEO 1 项（CAO 工作名一裁四追平——红线②从严，CPO/BS「事实回填」少数意见留痕）；挂起候裁 6 项；候批执行清单 6 组（共识成立候 BOD 放行执行窗）；勘验冲突 1 项裁断（AGENTS.md:88 instructions 落点——值席第三方法复核 COS 读数正确，BS glob 漏扫 .github 注记入档）。

**⚠ 回报项**：①COS 席 sg 无常驻位（m-duty 12 席矩阵无 COS，本批 spawn 代理出席）——候 BOD 补位或明示豁免；②B4 扫尾余量 ~151 件（source-agents 现势 169 件与晨报 ~136 口径差如实标注）候后续批 sequential。

**证据指针**：树路径 `docs/workflow/operating-records/2026-W37/trees/b3b4-joint-review-pilot/`（D-27 销账锚）；收口报告=reports/bb3-closeout.md。

## 夜航01 总收口·2026-09-14 04:3x +08·MMC 值席呈 BOD

- 三任务全收口（上三节）；边界守住：不动 R-HY 生产数据 ✓、bare dev 整合 ff-only ✓（TriMC 分叉按 runbook rebase 本地未推提交归账后 ff 推送）、无 force ✓、深夜操作逐条留痕（本文件+commits 链）。
- **候 BOD 决策四件**：①河源 TriRMC cron 重注册（配方已备：lg-heyuan-cron-reregister-runbook.md job1 正身化）——需河源侧 SSH/token 授权窗；②W38 周迁移补跑方式（sg 手动五段链 vs 河源重注册后跑）；③TriCompany 裸仓 62 个 root loose 目录 root sweep（1 分钟 root 通道）后 0ef1cfe 重推；④B3/B4 候批执行清单放行（bb2-summary.md §五）+候 CEO 1 项（E1 CAO 工作名）。
- 遗留观察（不阻塞）：sg TriMMC degraded 23 连败（daily-progress-watcher error+github-reconcile 2 败，根因 CTO 线在案）；COS 席位矩阵缺口。


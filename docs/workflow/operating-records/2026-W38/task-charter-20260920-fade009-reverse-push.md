# 任务书 20260920-FADE009（CEO 令·sg 反向自动推 GitHub 机制化，PACE）

- 编号: **FADE-009**（编号=fade-registry 下一空位，001-008 已用，CEO 20:30 勘正。三层概念定谳 CEO 20:41：①FADE=标准化框架（普适）；②PACE（铸计划→挂平面→派工→回声）只是框架下其中一条路径，非框架本身，实例不必拘泥此形态；③FADE-008=框架在『PACE 路径×治理闭环』的实现，本实例 FADE-009=框架在『席内闭环路径×反向自动推』的实现——按席内闭环形态落地即合规。三层概念（框架/路径/实例）随本实例注记入 fade-registry，候 CAO 归口）
- face: **server-executable → CTO 席内主办**（CEO 令直派主办、席内闭环；C 段按令适配=脚本化执行落 /home/fleet/ cron，不走 daemon face 路由拾取）
- PACE: P=本任务书（已铸）→ A=已挂本平面（2026-W38）→ C=脚本化执行落 cron → E=自验收（首跑读数+冲突跳过路径沙箱验证）+台账销账附树指针
- 上位依据: `TriMetaverse/docs/workflow/github-repo-governance.md` §12.2.2 反向流——运行态产物：工作树本地 commit（附一行事由）→ rebase 到 GitHub 顶 → push GitHub 回流（首例=TMV `7ead06f1`）；本实例=该规则的机制化（与 §12.4 正向链机制化对偶）
- 边界:
  1. 范围=§12.2 双落点家族 **20 树**（与 `worktree-guarded-ff.sh` 同清单对称；TriLC/TriMC 旧名树、vscodium、TriModel.quarantine 不在列）。现势勘验注记：/srv/fleet/ 实有 24 棵 git 树 vs 规格 20 树，差=TriLC/TriMC 旧名树+vscodium+quarantine+2 非git目录，如实登记不扩权收编。
  2. **只推不造**：脚本零 commit 创建、零 force push、零历史改写；§12.2「一行事由」义务归 commit 作者（commit 本体），脚本义务=每个推送事件日志行附一行事由。
  3. **冲突/异常一律跳过留人工**：rebase 失败即 `--abort` 还原并日志；tracked 面脏树跳过；detached HEAD 跳过（现势 TriCompany/TriModel 即此态，结构性跳过档）。
  4. 不动正向链（:30 bare-fetch-all / :40 worktree-guarded-ff 两族不碰不改）；调度错峰每小时 **:10**。
  5. 分支门：仅推 GitHub **已存在**的同名分支；不在 GitHub 侧造新分支（新分支属源码真源面决策）。
  6. 事务越界即停：本任务书不含 GitHub 侧仓设置变更与凭据管理（凭据现势=`credential.helper=store`+`~/.git-credentials` 已在位，脚本只消费不管理）；不动 TriRMC bare/TriGateway bare 未入 MAP 的正向链缺口（§12.4 声明 20 仓 vs 脚本 18 仓的差，候勘项已记，归正向链 owner）。
- 规格（C 段实现锚）:
  - cron: `10 * * * *` fleet 用户 crontab，自锁防重叠轮（flock）。
  - 脚本: `/home/fleet/worktree-reverse-push.sh`；支持 `REVERSE_PUSH_CONF` 环境覆盖 ROOT_DIR/GITHUB_BASE/TREES/MAP——沙箱测试与生产**同码路径**。
  - 逐树门序: 树存在→unborn/detached→tracked 脏（`porcelain --untracked-files=no`；注：较 ff 脚本严格 porcelain 放宽 untracked——TMV 现势standing untracked `.claude/hub` 会永久堵推，偏离点在此登记；untracked 与 rebase 相撞由 abort 路径兜底）→进行中操作（MERGE_HEAD/rebase-merge/rebase-apply）→fetch GitHub 至临时 ref→ahead/behind 判定→behind>0 则 rebase 到 GitHub 顶（失败即 abort 还原）→push `HEAD:refs/heads/<br>`（无 force）→临时 ref 清理→日志一行。
  - 事件行: `PUSHED`（附一行事由=§12.2.2 运行态增量回流 FADE-009）/`REBASE-CONFLICT`/`SKIP-dirty`/`SKIP-detached`/`SKIP-nohead`/`SKIP-no-upstream-branch`/`FETCH-FAIL`/`PUSH-REJECTED`；同步树不产行（进 END 汇总计数）；每轮 END 汇总行（trees/pushed/skip/fail 全量计数）；日志 `worktree-reverse-push.log` >5MB 轮转 .1。
- 验收锚（E 段可判定完成标准）:
  1. cron 在位：`crontab -l` 含 `10 * * * *` 条目（读数留痕）。
  2. 生产首跑读数落日志：20 树全覆盖，现势预期=IN-SYNC 18+SKIP-detached 2、无 FAIL；END 汇总行在。
  3. 冲突跳过路径沙箱验证 PASS：真脚本+conf 覆盖打 /tmp 夹具——diverged-冲突树→`REBASE-CONFLICT` 跳过、HEAD 原状还原、零 rebase 残留态；happy 树→`PUSHED` 且模拟 GitHub 端收到回流提交；dirty 树→`SKIP-dirty`；in-sync 树→零事件行。
  4. 台账销账附树指针：本文件收口区填毕+`fade-protocol-spec.md` §六登记行（含框架/实例两层界定注记，候 CAO 归口）。
- SLA: 席内闭环当日收口（2026-09-20）。
- 树: `docs/workflow/operating-records/2026-W38/trees/fade-009-sg-reverse-push/`（自验收报告+沙箱证据落此）。

## 收口区

## 收口-全任务（FADE-009 席内闭环）·2026-09-20 20:50 +08·CTO 小狄

**四验收锚全过，实例收口 PASS：**
1. cron 在位 ✓——crontab 第 5 行 `10 * * * * /home/fleet/worktree-reverse-push.sh`（幂等安装）。
2. 生产首跑 ✓——real 10.7s；`END run: trees=20 pushed=0 insync=18 skip=2 fail=0`（18 树与 GitHub 同步+TriCompany/TriModel detached 结构性跳过，零 FAIL，与勘验预测一致）。
3. 冲突跳过路径沙箱验证 ✓——真脚本+conf 覆盖六路全 PASS（PUSHED 回流落模拟 GitHub 端实证／REBASE-CONFLICT 还原零残留／SKIP-dirty／SKIP-detached／in-sync 零事件行／END 汇总）。沙箱捕获并修复真 bug 1 枚：生产全局无 git 身份→rebase 失败误分类冲突，修=committer 钉死 sg-reverse-push+detail 入日志。
4. 台账销账附树指针 ✓——fade-registry.md `## FADE-009` 条目入册（三层概念注记候 CAO 归口）；树收口报告=`trees/fade-009-sg-reverse-push/reports/acceptance.md`。

边界自检全过（零 commit 创建/零 force/零改写/冲突全还原/不动正向链/范围 20 树）。候勘移交三项见树收口报告（bare-fetch MAP 18vs20 缺口、双 detached 树纳管、评分卷）。收口回执 BOD 已发。

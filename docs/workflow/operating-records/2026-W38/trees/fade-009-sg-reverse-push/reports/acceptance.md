# FADE-009 自验收报告（sg 反向自动推 GitHub）·2026-09-20·CTO 席

- 任务书: `../../task-charter-20260920-fade009-reverse-push.md`
- date 现查: 2026-09-20 20:47 CST（执行窗 20:31–20:50）
- 结论: **四验收锚全过，实例收口 PASS**（席内闭环，未扰 BOD/CEO 除本收口回执）

## 验收锚 1 — cron 在位 ✓

`crontab -l` 第 5 行: `10 * * * * /home/fleet/worktree-reverse-push.sh`（幂等安装；与 :30 bare-fetch-all / :40 worktree-guarded-ff 正向族错峰）。

## 验收锚 2 — 生产首跑读数 ✓

- 执行: `bash /home/fleet/worktree-reverse-push.sh`，real 10.7s
- 日志 `/home/fleet/worktree-reverse-push.log` 末三行:
  ```
  2026-09-20 20:47:38 TriCompany SKIP-detached
  2026-09-20 20:47:39 TriModel SKIP-detached
  2026-09-20 20:47:48 END run: trees=20 pushed=0 insync=18 skip=2 fail=0
  ```
- 与勘验预测一致: 18 树 dev 与 GitHub 同步（含 TriRLC→TriLC 映射仓、TriRMC、TriGateway 全部实测可达）+2 树 detached HEAD 结构性跳过（TriCompany/TriModel）；零 FAIL。当前无未推 commit→pushed=0 属现势正确读数；PUSHED 路径由沙箱实证（锚 3）。

## 验收锚 3 — 冲突跳过路径沙箱验证 PASS（六路全过）✓

- 方法: 真脚本+`REVERSE_PUSH_CONF` 覆盖（ROOT_DIR/GITHUB_BASE=file:///tmp/TREES/MAP/LOG），/tmp 夹具 5 树 5 场景；沙箱日志 `/tmp/rp-test/reverse-push.log`。
- 断言读数:
  1. **A-PUSH-PASS**: diverged-异文件树 → `PUSHED ahead=1 rebased=1`，模拟 GitHub 端 bare dev=3 commits（base+gh 侧+回流 rebased local1）——回流落远端实证
  2. **B-CONFLICT-PASS**: 同行冲突树 → `REBASE-CONFLICT(跳过留人工…已还原原状)`，HEAD 原状、porcelain 净、零 rebase 残留态；GitHub 端未被动
  3. **C-DIRTY-PASS**: tracked 脏树 → `SKIP-dirty(留人工)`
  4. **E-DETACHED-PASS**: detached 树 → `SKIP-detached`
  5. **D-INSYNC-PASS**: 同步树零事件行（进 END 计数）
  6. **END-SUM-PASS**: `END run: trees=5 pushed=1 insync=1 skip=3 fail=0`
- 沙箱捕获真 bug 1 枚（已修）: 生产全局无 git 身份（`git config --global user.name`=NONE 实勘）→rebase 建提交失败且被误分类为冲突。修复=rebase committer 钉死 `sg-reverse-push <sg-reverse-push@sg.local>`（author 保留原作者，可审计）+冲突日志行带 rebase 报错 detail。

## 验收锚 4 — 台账销账附树指针 ✓

- fade-registry.md 新增 `## FADE-009` 条目（含三层概念注记候 CAO 归口；008 双名址观察候勘）
- 本报告即 D-27 销账锚（树路径=本目录）；任务书收口区同窗填毕

## 边界自检

零 commit 创建 ✓（沙箱与首跑 pushed 路径外无任何写操作）｜零 force ✓｜零历史改写 ✓（rebase 仅重放本地未推提交）｜冲突全部还原留人工 ✓｜不动正向链两族 ✓｜vscodium/旧名树/quarantine 不在列 ✓｜凭据只消费不管理 ✓

## 候勘移交（不阻塞）

1. bare-fetch-all MAP=18 仓 vs §12.4「双落点家族 20 仓」声明——TriRMC/TriGateway bare 未入 fetch MAP、日志无读数（正向链缺口，归正向链 owner）
2. TriCompany/TriModel detached HEAD 属结构性跳过档——若需纳管须先正分支（源码面决策，非本实例）
3. 评分卷未建（候周检补，registry 补齐项已记）

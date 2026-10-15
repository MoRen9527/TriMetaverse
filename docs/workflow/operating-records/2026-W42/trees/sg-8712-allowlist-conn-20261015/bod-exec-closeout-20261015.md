# BOD 毕报卷 · sg 8712 白名单补录 'trirlc-conn'（观察池⑥·毕）

- sourceOfTruth: 本卷（trees/sg-8712-allowlist-conn-20261015/bod-exec-closeout-20261015.md）
- syncMode: static（毕报·施工卷=bod-exec-plan-20261015.md）
- lastSyncedAt: 2026-10-15 09:57 +0800（date 现查窗内）

## 一、施工读数（照施工卷 §三 序）

| 步 | 读数 |
| --- | --- |
| patch | outbox.ts L66 数组追加 'trirlc-conn'·count==1 断言过·git diff 单文件单行 ✓ |
| build | `tsc` 全量 emit（09:54:32 同批新产：outbox.js+index.js mtime 对表钉死）·**cli.ts TS2307 既有错如实记（见 §三）** |
| restart | `systemctl restart trimc`·pid 3126596→3862557·秒级停摆 |
| 断言① | healthz=200 ✓ |
| 断言② | pid 变更对表 ✓（systemd MainPID） |
| 断言③ | **值面探针 dist/src/notify/outbox.js grep 'trirlc-conn'=1 命中 ✓**（编译产物含=真生效·非 healthz 绿即完） |
| is-active | active ✓ |
| 锁笔 | sg TriMC 仓 commit `60496df`（author=BOD 单次豁免·root 操作属主清点 src/ 干净） |

## 二、真值探针（候自然验证·记观察注）

trirlc-conn 实信入箱 201 探针候 8711 侧下次真实出向自然验证（本机 TriRLC 出向→sg 8712 收箱白名单新源）——候观察池⑥复核锚一并看。

## 三、如实记两笔

1. **cli.ts TS2307 既有错**：`@trimetaverse/tricode/trimodel-cli` 模块解析失败——非本笔引入（本笔只动 outbox.ts 一行数组）·tsc 默认错误只报不阻断 emit·产物链完整。TriMC 仓健康面观察项·报 CTO/FSD 归口（不阻本笔销账）。
2. **管道退出码坑自踩自报**：build 的 `| tail -3` 吞了 tsc 非零退出码·`&&` 链未断即续走 restart——值面探针（grep dist 产物）救了验证有效性。教训与 chained-command-assert-abort 记忆条同族·本席施工序已含值面断言故未造成假绿销账·如实入卷。

## 四、销账勘误卷（10-15 10:49 append·D-47 正形·append-only 不改前文）

**原 §三.1「TS2307 既有错·不阻本笔销账」定性撤**——实际有运行面损失：

1. **回归实锚**：config-sync-apply job（15min 周期）执行 `node dist/src/cli.js`——本轮 tsc 新 emit 的 cli.js 运行时 require `@trimetaverse/tricode/trimodel-cli`·node_modules **缺 tricode 链接**（package.json 声明 file:../TriCode 未 install·@trimetaverse/ 下只有 agent-core 链接）→job 10:00/10:15/10:30 **三连败·degraded=true**（healthz 10:37 拍 consecutiveFailures=3 实锚·与 09:54 build 时间线吻合）。
2. **修复**：10:47 补挂 `node_modules/@trimetaverse/tricode` 符号链接（首版相对路径错指向仓内·10:48 修正 `../../../TriCode`·readlink -f=/srv/fleet/TriCode 真值到位）；cli.js ESM 直跑冒烟过（CLI usage 正常出·tricode import 解析成功）。候验：job 下轮成功→consecutiveFailures 回零·degraded 解除（11:07 拍自然验证）。
3. **教训两笔**：①「tsc 错误只报不阻断 emit」≠「无运行面损失」——dist 产物集新旧差+出错文件的运行时依赖面必须单独冒烟（本卷 §一 断言③只验了 outbox.js 值面·cli.js 未冒烟=验证盲区本席自踩）；②**值面泄露自报**：jobs 面 dump 时 payload 嵌套未递归滤·`TRIMC_INTERNAL_TOKEN` 明文进本席读数（未进转报/未落盘·暴露面=本会话终端）——「掩码兜底值段全替·宁过掩不放过」教训再录·token 轮换与否候 CEO/CTO 裁。

## 五、销账

- 观察池⑥ sg 侧补录件=毕（施工+锁笔+断言三证）；真值探针自然验证候注不阻销；
- 树：派工令源+施工卷+毕报卷三卷齐（本树）；
- 回执：COO（转请令源）+CEO 知会——随本卷 commit 发。

—— 落款（date 现查）: 2026-10-15 09:57 +0800（BOD）

## 六、P0 勘误卷二（10-15 17:14 append·D-47 正形·append-only 不改前文）

**原 §一「断言③值面探针=真生效」与 §二真值探针定性全撤——补录实际未生效至 17:13**：

1. **假绿根因（CTO 17:12 P0 勘验发现·本席认领）**：**部署目录与施工目录分裂**——正名大线（82a3d52）把 `/usr/local/sbin/trimc-start.sh` 首行 cd 指向切到 `/srv/fleet/TriMMC`，但 dist 换装缺位（TriMMC/dist mtime=09-29 旧物·白名单五席）。今晨本席施工在 `/srv/fleet/TriMC`（git 工作目录）emit→09:54:32 restart→**进程载 TriMMC/dist 旧物**。本席断言③ grep 探的是施工目录（TriMC/dist·七席命中）非运行目录（TriMMC/dist·五席）——**探针路径错=假绿销账**。影响窗 09:54:32→17:13：trirlc-conn 首信必被拒（观察池⑥「8711 出向链路实际未通」）；m-duty-coo 白名单一并回退（10-13 已验收项回退·拒绝形态=发信方收错误响应非静默）。
2. **修复实录（17:13-17:14·BOD root 面·照 CTO 建议案）**：基线值面确认 TriMC/dist 七席→`mv TriMMC/dist → dist-bak-pre-swap-20261015T1715`→`cp -a TriMC/dist → TriMMC/dist`→`systemctl restart trimc`→断言链全绿（pid 3862557→3973025·active·healthz 200·**进程 cwd=/srv/fleet/TriMMC**·运行路径值面 grep trirlc-conn=1/m-duty-coo=2）→属主归还 fleet:fleet。回零候验：config-sync-apply job 下轮（18:0x 拍）成功 cf=0。回滚路径=mv 回 bak。
3. **17:11/17:13 TriMMC 目录 mtime 异动核查**：非人工施工——系 8712 daemon 运行时写 notify-outbox.json 碰目录 mtime（recent files 只它+git/FETCH_HEAD·who/last 无今日新 root 会话）。
4. **tricode 链接疑点如实记**：本席 10:47 修复挂在 TriMC/node_modules（施工目录侧）；TriMMC/node_modules/@trimetaverse/tricode 现读在位指向 /srv/fleet/TriCode 真值（建立时点不明）——现役 job 回零依赖面成立·疑点留观察注不深挖。
5. **教训（本席第二笔探针面自踩）**：值面探针必须探**运行路径产物**（进程 cwd 对表后的 dist）非施工路径产物——「编译产物含=真生效」断言在目录分裂态下失效。与今晨 §四「cli.js 未冒烟」教训同族根因：验证面≠消费面。
6. **后续归一**：TriMC/TriMMC 双目录归一=Q1 评估卷核心论据（CTO 在办·评估结论方向=尽快目录归一）——P0 止血毕·归一候评估批后施工。

—— 落款（date 现查）: 2026-10-15 17:14:42 +0800（BOD）

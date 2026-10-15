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

## 四、销账

- 观察池⑥ sg 侧补录件=毕（施工+锁笔+断言三证）；真值探针自然验证候注不阻销；
- 树：派工令源+施工卷+毕报卷三卷齐（本树）；
- 回执：COO（转请令源）+CEO 知会——随本卷 commit 发。

—— 落款（date 现查）: 2026-10-15 09:57 +0800（BOD）

# CTO WO-RW1 批 1 门禁复验卷（债② TriMLC abort 防御·APPROVE·sde 重启窗装载放行）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·批 1 复验正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 复验对象: fsd-rw1-batch1-debt2-abort-defense-closeout-20261120.md（891d755e0·sg 顶 fetch 步进 9de9a79d5..891d755e0 实锚）+TriMLC dev 8361196（交付锚）
- 复验方法: 收稿三查（毕卷树面在/信卷对表/commit 在链）+**独立重测**（白盒 5 案自跑+全量回归自跑+build 自跑·非转抄毕报读数）+diff 抽勘（第二方法交叉验证）
- 复验裁定: **APPROVE——门禁五项全过·sde 重启窗装载放行**

## §一 · 收稿三查（树为准）

1. 毕卷树面在：891d755e0=sg-server/dev 顶（fetch 步进实证）·53 行毕报卷 ✓；
2. 信卷对表：信面五节与卷面逐项一致（含首跑 5 败双根因勘定闭环如实记）✓；
3. commit 在链：TriMLC 8361196=dev HEAD（fddb630 基线之上一笔·10:29:10+08 时点吻合）·改动面=app.ts +186/−41+新 test 149 行与信面一致 ✓。

## §二 · 门禁五项独立复验读数（本席自跑·第二方法）

| 项 | 毕报读数 | 本席独立复验 | 判 |
|---|---|---|---|
| 白盒 abort 案 | 5/5 | **5/5 自跑 ✓**（node --import tsx --test·pass 5/fail 0·真断连活体案） | ✓ |
| 全量回归 | 863 pass/5 fail=基线 858+5 新案 | **868 tests/863 pass/5 fail 自跑**——逐位吻合·5 fail=基线族同谱 | ✓ |
| tsc/build | rc=0·dist 已更新 | **build rc=0 自跑**（tsc -p·dist/server/app.js 10:36 更新=装载面现成） | ✓ |
| abort 语义面 | 26 处=fddb630 markRead 正形逐处同构 | diff 抽勘 4 处（fade/runs A 形+seat-wake B 形+init/assemble·onboarding·projects/link C 形）——内层 try 包 for-await+catch{ return; }+正形注释锚·**JSON.parse 业务层零动=分层保形承** | ✓ |
| 值面探针形 | 断连后 markRead 业务探针绿（非 healthz） | a5 三连断连风暴案在白盒 5 案内自跑过=探针形成立·活体终验=sde 重启窗后（装载毕值面探针） | ✓（重启窗终验注） |

## §三 · 附带裁量二件（fsd ③/债项回）

1. **TriRLC body 读面同族裸形缺位（L2080/2158 等零防御）·裁：入勘修窗候选+风险评级中**——TriRLC=R 面本地域 8711 在役·缺位=断连风暴崩险真实但触发频率低+watchdog 在役兜底；移植形现成（8361196 形直搬·7min 级成本）——**非本窗硬项**（本窗触面限定=TriMLC·零扩 scope 承）·候批 3 随窗或下勘修窗（COO 统排·本席提供排序意见=批 3 优先级高于轻量六件中位）。TriMLC/TriRLC 同族缺位=风险组合面入账（技术风险组合级视野：同族裸形族清单化·TriRLC 补修后族清零）。
2. **TriMLC 8361196 push 443 断窗（债 5 同族）·承批 3 随窗补推**——本地对象库完好在卷零丢失面·补后 ls-remote 顶对表验真照债 5 正形·**不阻本窗重启装载**（装载面=本地 dist·零依赖远端）。

## §四 · 放行裁与下游链

- **放行：sde 重启窗装载 8361196（dist 装载面·build 已更新现成）**——正形链=watchdog Disable→/shutdown→port FREE→冷启→pid/CIM 对表→Enable（trimlc-repair-window-20261011 实操序先例）；
- **完工判据=变更值面探针（非 healthz）**：同族端点半 body 断连请求→daemon 存活+后续业务请求正常响应（白盒 a1-a5 案形即探针脚本）+pid 三证；
- **TriMLC 重启窗=批 1 内唯一窗**护栏承（cleanup 真跑前置+债 2 装载一并兑现·防双重启窗）——重启毕=批 2 全解锁（接线窗双条件之二兑现+cleanup 真跑前置兑现）；
- D-15 派令 sde 即发（重启窗执行）·毕报落树回本席+COS 台账随线。

## §五 · 使用依据

fsd 毕报卷（891d755e0）+TriMLC 8361196 diff 全谱抽勘+本席独立重测三跑读数（白盒/全量/build·02:33-02:36Z）+WO-RW1 §二/§三（cba2079bc）+本席 D-15 派令（10:23）+fddb630 正形源+54189048a §四债② 裁面+D-15/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T02:36:12Z（+8=2026-11-20 10:36:12·date 现查原值·D-47 正形）

# CTO 裁定卷·F-2 TriMLC CLI cron 族全 401（cronRequest 漏鉴权头）

- sourceOfTruth: 本件（F-2 缺陷单 CTO 裁定正身；承 F-1 序，TriMLC 域）
- syncMode: final
- lastSyncedAt: 2026-09-29 10:2x +0800（date 现查 10:25:16 后落笔）
- 令链: BOD 10:2x 转呈缺陷单（三步证据链+定性申报候裁分派）

## 一、证据链与定性：**认承 BOD 申报，定性准确**

1. **三步互证成立**：CLI `cron list --port 8713` 同 token 401「missing or invalid X-Internal-Token」+curl 同 token 直打 `/internal/v1/cron/jobs` 200——token/路径/daemon 三要素排除法锁死 CLI 侧漏头；源码实勘 dist/cli.js L836-846 `cronRequest` headers 仅 content-type（无 x-internal-token 注入）vs L747-752 configRequest 注入逻辑在——实锤同向。
2. **定性认承**：cron 族独立漏头，非 F-1 残留——F-1 验收域（status/config 面三要件）本不盖 cron 面；系 P0 安全门（TRILC_INTERNAL_TOKEN）落地时 cron 族漏接，daemon「missing」字样与「未收到头」吻合。

## 二、裁定

1. **准修**：FSD 一行级修复——cronRequest 补 x-internal-token 注入，与 configRequest 同构（同 token 源同注入形态）。
2. **补测**：cron 族带 token 通道读数至少一格翻绿（cron list 为准）；带 token 通道口径承 F-1 ② 先例（channel cmd 就地提取，len-only 留痕值零出机）。
3. **TriRLC 同位置勘（本席加钉）**：TriMLC 系 TriRLC 镜像分叉（cli.ts N4 镜像注释在案），cronRequest 同构件 TriRLC 大概率同漏——TriRLC 8711 现 token 门未开故不显，**同漏即同修**（可分开窗不并批强制），防 TriRLC 未来开 token 门时同坑复踩。勘明结果回执（同漏/不同漏均记档）。
4. **时点**：8713 新代 pid 5348 刚重启（F-1 并批产物），修复后须再重启一次——排今日下午工时窗或 M 窗，与 F-1 同形态四步（修+build+重启+带 token 重测）；**不阻 P2 线**。
5. **重启纪律**：照 TriLC daemon 重启纪律正形（POST /shutdown+token 门+CommandLine 身份核验），09-18 误杀族教训全程适用。

## 三、COS 判据型升级候办（BOD 同信附带）：**材料不足候件**

「会话级→daemon 级形态二选一」提案卷未见——具体判据对象/升级条件/两形态利弊材料面缺席，**不凭半句裁架构**。请 COS 落提案卷（对象+判据+形态对比+影响面）后再裁，不急件维持。

## 使用依据

BOD 转呈证据链三步（CLI 401/curl 200/源码 L836-846 vs L747-752，本席认承不重掘——三步互证自洽且与 F-1 期实勘同构）；F-1 裁定卷（cto-a3-f1-verdicts.md ③ 顺批红线与带 token 重测先例）；TriLC daemon 重启纪律（memory trilc-daemon-restart-discipline）；D-15 分派枢纽/M-004 直达。

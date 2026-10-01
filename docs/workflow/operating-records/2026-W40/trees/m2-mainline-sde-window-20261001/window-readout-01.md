# M2 主链 SDE 车道·窗读数①（2026-10-01 18-24 窗）

- 执行: m-duty-sde（SDE/TriDeployer）；车道正身=COO 首发版勘误令（19:2x）：SDE=M2 主链 item1/2/4+伴窗 chromium/CORE_VERSION；键值窗链不在本车道
- 时点: 全部读数 2026-10-01 19:21-19:3x+08 现采（date 现查锚 11:21:32Z/11:26:15Z）

## 一、链头门判定：R-HY 可达性=通 ✅

- 判据（batch-05 卷 §三 建议形）：8710 healthz+cron jobs 双面恢复响应且连续两探稳定
- 读数：
  - 探1（11:25Z 前后）healthz HTTP 200 `{"ok":true,"service":"trirmc","mcLedger":"ok","cron":{"enabled":false,"jobCount":0,"degraded":false}}` 0.39s；cron 面 401（门禁在役正形）
  - 探2（11:26:14Z）healthz HTTP 200 同构；cron 面 401 同构
- 对照：今晨 batch-04 预检卷（05:1x）"双面双超时空回"——**已翻绿**
- 注记：healthz cron 段 `enabled:false jobCount:0`——河源 TriRMC cron 面空载形态如实录（昨夜形态对照读数候 R-HY 侧卷；401=带令门正常非空回）
- **消费方**：键值窗链车道（FSD）——R-HY 依赖解冻前提已满足

## 二、item4 钟漂观察·采样1：前校 PASS ✅

- R-HY 响应头 Date=Thu, 01 Oct 2026 11:26:14 GMT vs sg 本机 11:26:15 GMT——**钟漂≈1s**
- 旧疑读（batch-04 卷：疑快 6m22s）**不复现**（疑自愈或经校，归因候 R-HY 侧记录）
- 观察周（改指毕起 7 天）续测：本席随窗随采样留痕

## 三、sg 侧现势盘点

| 对象 | 现势 | 读数 |
|---|---|---|
| sg TriCode | HEAD=`d20cb6b`（CORE-SPLIT 治理条款落盘 commit） | io-kernel.ts 族③缺陷**两写点现存未修**（L158 runWrite+L286 rollbackTo 毫秒分辨率备份名）；L265 防穿越 regex 与唯一性后缀修法兼容已验 |
| CORE_VERSION | `0.2.0-wave3`（`src/trimodel-cli/result.ts:8`） | 七文件 frozen 标记在位；门流程正身=README 条款②+纪律册附录 253ccd9 |
| sg TriModel | HEAD=`161d0ca`（**非 M1 锚 1972d83**——batch-07 件 2 sg E2E chromium 覆写解锁已落） | dist 在位；3333/3334 面 listen（node 双进程，batch-05 卷读数） |
| sg chromium | **已在役**（用户级 `~/.cache/ms-playwright/chromium-1243`+`chromium_headless_shell-1243`+ffmpeg-1011，零系统变更） | 161d0ca 实弹：E10+E12 11/11 全绿；全量门 node22 313/296/0/17 零 fail |
| R-HY chromium | 无（M1 卷：UI E2E 13 件整块 skip 归因） | 安装面在河源；通道=BOD D-24 代执/带令面（sg 无 SSH 凭据） |

## 四、请核两项（候 COO/BOD）

1. **chromium 装机机位**：LG-054 语境=河源补装（13 件 skip 解锁；河源通道 sg 无凭据）vs 窗令伴窗句未标机位——候机位标注。本席已备河源安装工序单（照 sg 161d0ca 先例形：用户级 playwright 缓存+便携库 LD_LIBRARY_PATH，零系统变更零 root）见同目录 chromium-rhy-install-runbook.md。
2. **CORE_VERSION 门 SDE 份额**：门条款流程=修复动笔（CTO 卷明文 FSD 定案）→bump→防线回归（58 套+276 壳族+25/25）→双签→四仓联动/四仓同步重装读数。SDE 份额含不含动笔？且 sg TriModel（3333/3334 在役=回退锚角色）的重装时点须避生产单方面动——候标注（本席 checklist 已备：core-version-gate-sde-checklist.md）。

## 五、车道现势与联动协调点

- item1（两 daemon 改指）/item2（sg 机内 PUT card）：候跨车道依赖（键值窗链 item5 修毕→回滚锚门→键值候供）
- **联动协调点（显式提出防冲突）**：item1 sg 侧=TriMMC 8712 `TRIMODEL_API_URL` 改指；FSD 车道 token 轮换工序 3/4=sg drop-in+`systemctl restart trimmc`+job PATCH——**同 daemon 面**，两变更须并批一次 restart 或 COO 定先后，防二次重启与中间态冲突。请编排层标注联动序。
- 超载顺延序知悉：M2 主链次之候裁——本车道当前零阻塞零超载。

## 使用依据

tonight-window-order-20261001.md（正身+COO 车道勘误令）；task-inventory-20260930.md（b87a7a31）；token-rotation-trimc-internal-runbook-20261001.md；batch-04 m2-window-preflight.md；batch-05 m2-execution-order-alignment.md；batch-09 f3-patch-draft.md；W39 树 task-charter-trimodel-m2-cutover-01.md+cto-adaptation-review.md+deploy-readings.md；TriCode d20cb6b 实勘（io-kernel.ts/result.ts/README）；sg TriModel 161d0ca 实勘；CORE-SPLIT 条款=TriCode/src/trimodel-cli/README.md+纪律册附录 253ccd9。

# 河源（R-HY）chromium 补装工序单·伴窗项（BOD 裁复已回填·备执行态）

- 制备: m-duty-sde（2026-10-01 窗内）；性质=**工序单制备，未执行**（河源通道 sg 无凭据，执行=BOD D-24 代执/带令面）
- **〔BOD 裁复回填 21:4x〕批准**——机位=**R-HY**；通道=**BOD 代执/带令面**；执行窗=**明晚窗优先排**（今晚窗不叠 R-HY 面，防超载）；今晚本单=**备执行态**（已达成，本席零 R-HY 面动作）
- 配方源: **sg 先例形**（sg TriModel 161d0ca=batch-07 件 2：chromium_headless_shell-1243+便携库 LD_LIBRARY_PATH，用户级零系统变更，E10+E12 11/11 全绿实证）

## 一、形态（照 sg 先例，零系统变更零 root）

- 用户级 playwright 缓存：`~/.cache/ms-playwright/chromium-1243` + `chromium_headless_shell-1243` + `ffmpeg-1011`（版本须与 TriModel `playwright-core ^1.63.0` 匹配——**版本门判据=chromium-1243 形**）
- 便携库 LD_LIBRARY_PATH 形（不装系统依赖包；sg 侧同款缺库清单以 batch-07 件 2 实操记录为配方源）
- E2E 接线：`TRIMODEL_E2E_CHROMIUM` env 覆写 executablePath（ui.e2e.gate.test.ts 先例形；回退发现路径=缓存目录惯例形）

## 二、执行序（BOD 代执稿）

1. 前置：R-HY 可达确认（本窗读数①：双探 200 已通）；R-HY 磁盘余量快勘
2. 安装：playwright 用户级缓存形落 R-HY fleet 用户目录（下载源与 sg 侧一致；版本钉 chromium-1243）
3. 接线：R-HY TriModel 测试环境 `TRIMODEL_E2E_CHROMIUM` 指向缓存 executablePath
4. **版本门**：`chromium_headless_shell --version` 读数+playwright-core 版本对表（^1.63.0 匹配断言）
5. **13 案实证（STE 附条件前置兑现）**：UI E2E 13 件（M1 卷 skip 整块）R-HY 实弹转 run——期望 13 件从 skip 转 pass（环境型归因清零）；读数归卷
6. 全量对照复验：TriModel R-HY 全量（基线对照 273/261/0/12 形→chromium 补装后 skip 12→~0 预期面，读数归卷）
7. 收口：读数卷落本目录+大表 LG-054 行"chromium 候 M2"销项候裁

## 三、边界

- 零系统包安装（非 yum/dnf 形；用户级缓存+便携库）；零 TriModel 部署位触碰（HEAD/dist/systemd 不动——M1 隔离纪律沿袭）
- 测试 key 不钉（CTO 前裁：'no-api-key' 案已改基座自含哨兵键形，无 key 环境正确行事）
- 隔离位 /tmp/lg054-rerun 留位复用（清理锚=族③ CORE_VERSION 复验毕，前裁不变）

## 使用依据

batch-07 件 2 实锚（sg TriModel 161d0ca commit 文+test/ui.e2e.gate.test.ts L33-58+ui-e10-reload.test.ts L108-109 实读）；W39 树 cto-adaptation-review.md（候决 A 前裁+13 案附条件+隔离位清理锚）；deploy-readings.md（R-HY 无 chromium skip 13 件归因）；本窗读数①（R-HY 可达通）。

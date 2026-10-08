# 深测②合一 统一 build+重启窗毕报 · FSD

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/fsd-unified-build-restart-window-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T05:24:54+08:00
- 树节点: FSD 统一 build+重启窗证迹（CTO 段门放行后执行；S5 前提三条件之三）
- 状态: 窗闭合——S5 前提仅余 19:00 窗（CTO S4 段门✓+build/重启窗✓）

## 〇、窗记录（2026-10-08 05:20–05:24 +0800）

| 步 | 动作 | 读数 |
| --- | --- | --- |
| 1 | 前勘 | 旧 pid 27252（03:31 起，S1 版 `node dist\src\server.js`）=3333 唯一监听；`.env` 5 键在 TriModel 根（dotenv 自 cwd 链加载=环境连续） |
| 2 | `npm run build` | tsc 零错+copy-ui 落位（dist/src 全量重译+dist/ui 刷新） |
| 3 | 停旧 | Stop-Process 27252 → 端口释放确认（本 daemon 无优雅停机路，直停=03:31 窗同法；trilc pidfile 纪律不适用） |
| 4 | 冷起 | 新 pid **28368**（WorkingDirectory=TriModel 根，Hidden 窗，stdout/stderr→`%TEMP%\trimodel-daemon-20261008.log[.err]`）；healthz poll #3 即 200；3333 监听换主 28368 复验 |

## 一、dist 指纹（STE S5 开场快照核对锚）

| 文件 | SHA256 前 16 位 |
| --- | --- |
| `dist/ui/index.html` | `3149D1F200C5DB4E` |
| `dist/src/api/keys.js` | `DF4333E3BE16B551` |
| `dist/src/api/verify.js` | `2A9FF8EFF527E882` |

（STE 独立复算=Get-FileHash 全 64 位对前缀即可；served 面与 disk 面同源已探，见 §二 P2。）

## 二、值面五探针（完工锚——healthz 绿≠生效，逐项值面）

1. **P1 healthz**：200（poll #3）。
2. **P2 served UI（GET /ui）**：`loadVerifyFaces`×3+`tcApplyStateSuffix`×3（S4 接线活体在服）+三型新串「按时间段自动切换」×1+mmc special 新稿「「模型策略」页同一份」×1+旧三型串「时段/默认/额度」**零残留**——S3 UI 文案+S4 接线一并活体生效。
3. **P3 verify（GET /v1/config/verify，admin）**：200 `object=config.verify`，faces=[mlc,mmc,rlc,rmc] 四 face 全名址（S1 端点活体）。读数=四 face 全「未配置」——本机无卡诚实态（与 P5 三布尔自洽，非故障）。
4. **P4 410 退役探针（PUT /v1/config/keys/secure，零变更端点）**：410+`此功能已升级：请在「模型条目信息」条目中录入密钥（旧密钥已在启动时自动迁移，无需重复录入）`逐字（S3 keys.ts 其一活体）。
5. **P5 status（GET /v1/config/keys/secure/status，admin 只读）**：`无旧密钥文件；密钥请在「模型条目信息」条目中录入`逐字（S3 keys.ts 其三活体，按盘面分支命中）+legacy_present/migrated/card_present 三布尔=False 与 P3 全未配置自洽。

## 三、如实注记

1. **P2 首探 404 非产物缺陷**：首探走 `/` 得 404——daemon 静态路由正身=`/ui`（server.ts L42-48），修正探路即过；GATE 真浏览器 E2E 亦走 `/ui`，无矛盾。
2. **P4 首探读体失败系探针代码问题**：pwsh7 的 `HttpResponseMessage` 无 `GetResponseStream`（正形=`$_.ErrorDetails.Message`）——410 本身首探即正确返回，产物无恙。
3. **本机无卡=诚实态**：dev 机无 trimmc-card.json，verify 四 face 全「未配置」+status card_present=False 双端自洽；sg 侧 face 读数不在本窗范围。
4. **模块 registry 陈旧**：TriModel `docs/registry/code-state.md` 停在 7 月态（main 分支/14 测试/无 verify 端点记载）——实现事实以本卷+仓为准；registry 补账候排（CTO 域收口，本席可供稿）。
5. **回滚面**：断点④制 4/4（S1 `7f7063a`/S2 `b310c4b`/S3 `b394045`/S4 `572e59a`）；窗内异常回滚=git revert+重跑 build+同法重启。

## 四、S5 前提三条件现势

- CTO S4 段门 ✓（05:1x 令）
- 统一 build+重启窗 ✓（本卷）
- 19:00 窗：候（STE 开场首步=dist 快照版本核，锚=§一指纹）

## 使用依据

- CTO S4 过段门+重启窗放行令（2026-10-08 05:17 +0800 达）；细估卷 75a51dda 段门纪律（重启窗紧贴验收不留跨夜悬空态）；S4 毕报卷 §四.6（活体 dist 边界）；TriModel 572e59a（HEAD 窗前已核 clean）；server.ts L42-48（静态路由）；keys.ts L111-157（三处文案触发面）；记忆条「重启窗完工判据=进程内生效验证」。

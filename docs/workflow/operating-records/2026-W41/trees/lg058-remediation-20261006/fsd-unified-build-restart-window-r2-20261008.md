# 深测②合一 统一 build+重启窗（第二轮）毕报 · FSD · S4b 活体生效

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/fsd-unified-build-restart-window-r2-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-07T22:02:54Z（06:02:54+08 周四，date 现查）
- 树节点: S4b 第二轮窗证迹（CTO 段门认收 05:58 令+第二轮放行后执行）
- 状态: 窗闭合——S4b 四锚活体生效；S5 前提齐（CTO S4b 段门✓+第二轮窗✓+19:00 窗照排）

## 〇、窗记录（2026-10-08 05:59–06:02 +0800，四步序同第一轮）

| 步 | 动作 | 读数 |
| --- | --- | --- |
| 1 | 前勘 | 旧 pid 28368（05:23 起，第一轮窗产物）=3333 唯一监听；pid 32756 冷起前存活确认 |
| 2 | `npm run build` | tsc 零错+copy-ui 落位（`[copy-ui] ui/ → dist/ui copied`） |
| 3 | 停旧 | Stop-Process 28368 → 端口释放确认（无优雅停机路直停，03:31/05:20 两窗同法） |
| 4 | 冷起 | 新 pid **32756**（WorkingDirectory=TriModel 根，Hidden 窗，stdout/stderr→`%TEMP%\trimodel-daemon-20261008-0559.log[.err]`）；dotenv 三段注入同第一轮形态（dist\.env 0+.env 5+..\​.env 6）；3333 监听换主 32756 复验 |

## 一、dist 指纹三件（S4b 变更面选型——STE S5 开场快照核对锚，**替换第一轮 05:24 指纹**）

| 文件 | SHA256 前 16 位 | 说明 |
| --- | --- | --- |
| `dist/ui/index.html` | `A77D67AE64CDF227` | 四刀承载（B/C/D+S4 既有）——第一轮 `3149D1F200C5DB4E` 自然过期 |
| `dist/src/trimmc-card.js` | `A9991C020DF51C09` | E-1 刀承载 |
| `dist/src/policy.js` | `BC23BDF19004FA92` | E-2 刀承载 |

（选型注：第一轮三件=keys.js/verify.js 系 S1/S3 变更面；第二轮按 S4b 载荷改选 index.html/trimmc-card.js/policy.js。STE 独立复算=Get-FileHash 全 64 位对前缀。）

## 二、值面五探针（完工锚——逐项值面非 healthz 绿即完）

1. **P1 health**：`GET /health` 200 `{"ok":true,...,"providers":{deepseek:true,deepseek-anthropic:true,anthropic:true,...},"rateLimitedCount":0}`；3333 listen pid=32756 换主复验。
2. **P2 served UI（GET /ui）四锚活体**：「已落 · 重启生效」×5（B badge+页顶缀）/「已清 · 待落地」×1+「机器侧现持旧值」×1（C）/`reloadFaceCard`×2+切签调用 `void reloadFaceCard(connDomainActive)`×1（D）；S4 既有零漂移（loadVerifyFaces×4+tcApplyStateSuffix×3+三型新串×1）+旧三型串「时段/默认/额度」**零残留**。html len=118545。
3. **P3 verify（GET /v1/config/verify，admin）**：200 `object=config.verify` faces=[mmc,mlc,rmc,rlc] 四 face 全名址（读数=全「未配置」，本机无卡诚实态与第一轮同，非故障）。
4. **P4-E E 锚活体（PUT /v1/config/policy 带非法模型）**：400 + msg 逐字 `policy validation failed: schedules[0] 模型「bogus-model-x」不在目录内。可用模型：deepseek-flash, deepseek-v4-pro, GLM-5.3-Flash, GLM-5.3, TMV`——五名全列逐名命中（校验拒=零写面探针）。
5. **P4-S3+P5 既有锚回归**：PUT keys/secure→410「此功能已升级：请在「模型条目信息」条目中录入密钥（旧密钥已在启动时自动迁移，无需重复录入）」逐字零漂移；GET status→「无旧密钥文件；密钥请在「模型条目信息」条目中录入」逐字+三布尔 False 与 P3 自洽。

## 三、如实注记

1. **healthz 笔误口勘正**：第一轮卷 §二 P1 写「healthz」系卷面笔误口——daemon 健康路由正身=`/health`（server.ts L141 endpoints 列表原样），本卷起正名。`/healthz` 404 快返反证路由表到达。
2. **/health 慢探语义**：本 daemon /health 每 call 逐 provider live 探活（body providers 布尔即探活结果），单次 3.4–4.9s——非卡顿非缺陷；探针 timeout 须给足（首探 5s timeout 曾撞沿，二探给 10s 稳态过）。
3. **Get-FileHash 走 Bash 链调 5.1 必炸**（PSModulePath 污染既有坑）——本窗指纹取值切 pwsh7 直跑即过，坑族如实注记。
4. **本机无卡=诚实态**：同第一轮注记，dev 机无 trimmc-card.json，verify 四 face 全「未配置」诚实自洽。
5. **回滚面**：断点⑤制 5/5（S1 `7f7063a`/S2 `b310c4b`/S3 `b394045`/S4 `572e59a`/S4b `9557aa1`）；窗内异常回滚=git revert 9557aa1+重跑 build+同法重启。

## 四、S5 前提现势

- CTO S4b 段门认收 ✓（05:58 令，三项裁定含 GATE 口径 57/57[顶13] 正口径）
- 统一 build+重启窗第二轮 ✓（本卷，S4b 四锚活体生效）
- 19:00 窗：STE 开场首步=dist 快照版本核，锚=本卷 §一第二轮指纹三件（第一轮指纹自然过期）

## 使用依据

- CTO S4b 过段门认收+第二轮放行令（2026-10-08 05:58 +0800 达，三项裁定）；本席第一轮窗卷（四步序+探针模式复用）；S4b 毕报卷 fa20b528（六刀清单）；TriModel 9557aa1（HEAD 窗前 clean）；server.ts L42-48/L141（路由正身）；记忆条「重启窗完工判据=进程内生效验证」「Bash 链调 5.1 PSModulePath 污染」。

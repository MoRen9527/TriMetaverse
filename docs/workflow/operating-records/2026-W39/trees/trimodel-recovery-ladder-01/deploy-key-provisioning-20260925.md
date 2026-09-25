# 供钥留痕：.deploy-key 独立钥文件落位（LG-053 波④前置项）

- sourceOfTruth: self（本件=供钥操作留痕正身）
- syncMode: manual
- lastSyncedAt: 2026-09-25 23:40 +08:00
- **授权**: CEO 2026-09-25 23:38 令「B 路径授权你提取落位，留痕即可」（BOD 两路径呈批后择 B）
- **执行**: BOD 亲执（活体操作审批门留痕件）
- **操作时点**: 2026-09-25 23:39-23:40 +08:00（Get-Date 现查）

## 一、操作读数（钥值零回显，全程变量传递）

1. **活体健康前置验**（写前）：活体 `C:\Users\jedih\.claude\settings.json` sha256 `491f3335…` **对锚一致**（锚=FSD 23:2x 基线读数①，2046B）；`ANTHROPIC_AUTH_TOKEN` 非空 len=49 头 `4cb0` 尾 `0cEs`（与今晨 known-good 掩码一致）；`ANTHROPIC_API_KEY` 空串残留=O-2 定谳已知现役形态，非钥源。
2. **落位**: `C:\Users\jedih\.claude\settings.presets\.deploy-key`（现役 restore-claude-config.ps1 v2 契约 keyfile 位；目录 Test-Path 确认后写入）。
3. **编码断言**: ASCII 写入无 BOM（首三字节非 EF BB BF——pwsh/.NET Trim 不去 BOM，v2 读法 Raw+Trim 下 BOM 会污染首字符，故显式断言）。
4. **回读断言**: `Get-Content -Raw` 回读 Trim 后与源 **-ceq 严格相等**（len=49/头尾一致/49 字节）；单行无尾换行。

## 二、纪律声明

- 钥值全值**零回显**（本件与会话输出均只含 len+头4尾4 掩码）；
- 提取源=现役健康活体（hash 对锚前置门），非事故隔离件（QUARANTINED 件未触碰）；
- 写动作仅落 presets 目录新文件，活体 settings.json **零触碰**（hash 事后可复验对锚）。

## 三、消费方与演化

- 现消费方：restore-claude-config.ps1 v2 `-InjectKey`（keyfile 优先级①）；LG-053 波② L2 restore-direct 立桩同源。
- 波③衍生物候排：新契约 per-provider 名 `.deploy-key.bigmodel` 于四族 core 落地时自本件衍生（双名过渡期后 `.deploy-key` 随 v2 脚本退役同批归档）。
- 轮换义务：随 token 常驻轮换窗更新（CFO/安全窗排期时并办）。

# S2 任务书面 · TriRMC cron 写族 token 门 fail-closed 化（首笔全链实证件·BOD 13:30 裁定采认）

- sourceOfTruth: 本件（CTO 判据正身；执行位=服务域 TriRMC 侧，face=server-executable）
- syncMode: final
- lastSyncedAt: 2026-10-07T05:31:45Z（date 现查 13:31:45+08 周三）
- 判据席: CTO 小狄（m-cto）；改派依据=D-15 枢纽改派候选→BOD 13:30 裁定采 S2 为首笔
- 执行域: **服务域**（TriRMC 仓施工+测试跑批；部署落活不在本笔）

## 一、缺陷定谳（本席 13:3x 实勘 TriRMC 仓，非转抄）

1. `src/server/app.ts` L145-161：internal 面 token 门**已存在**（P0 加固 2026-08-25）——`TRIRMC_INTERNAL_TOKEN` 配置后 `/internal/*` 强制校验（`x-internal-token` 头或 Bearer），失败 401。
2. **缺口本体=L148-149 的 fail-open 默认态**：`const internalToken = process.env.TRIRMC_INTERNAL_TOKEN ?? ''` + `if (internalToken && ...)`——**env 未配置时门整体旁路**（注释自认「未配置时维持旧行为（兼容未迁移调用方）」）。`src/cron/routes.ts` 七端点全族零自鉴权（CRON_PREFIX 匹配即处理，本席全文读过），即 env 未配时 **cron 写族（POST jobs/PATCH/DELETE/POST run）=未认证任意命令执行=RCE 面**，且 8710 公网可达（L145 注释原文）。

## 二、修法正形（fail-closed 梯度：写族硬门+读族过渡）

1. **cron 写族 fail-closed**：`TRIRMC_INTERNAL_TOKEN` 未配置时，POST `/internal/v1/cron/jobs`、POST `.../run`、PATCH、DELETE → `403 {error:'internal_token_required'}`；daemon 启动时 env 未配置打 **WARN 日志**（`internal token not configured: cron write endpoints reject`）。
2. **读族过渡维持**：GET jobs/log/status 暂不设硬门（兼容现役读方：l2 探针 R-HY 段 status 读数链），代码注释标注退役时点候读方 token 化后收口。
3. healthz 不涉（路径在 `/healthz` 非 `/internal/`，门本就不管）。
4. **为什么不是全 internal 面 fail-closed**：写族=RCE 面无兼容价值（真要建 job 就该配 token）；读族一刀切会断现役只读链（l2 探针/健康读数），梯度处理保今晚窗链与监控线零感。

## 三、执行席工序（服务域自含）

1. **现勘首步（R 面活体现探，零副作用）**：production unit env 是否已设 `TRIRMC_INTERNAL_TOKEN`（systemd Environment/EnvironmentFile 读数）；无 token 探针 POST 空 body → **401=门活（env 已配）/400=门死（env 未配）**——读数回填施工卷，本席复核后动码。
2. 施工：L148-149 门逻辑按 §二 梯度改造+cron/routes.ts 写族前置校验（或门侧统一拦，执行席按仓库惯例选位，判据=写族无旁路）。
3. 测试锚四态：未配 token+写族=403／未配+读族=200／配 token+错头=401／配 token+对头=201；全量测试套独立基线对照（先基线后动码）；启动 WARN 日志断言。
4. 门禁：改前备份分支、独立基线、异常秒回滚、长文分段 commit（服务域通用门禁全款）。

## 四、部署面（**不在本笔**，候 LG-066 解冻另窗）

R-HY unit env 补配 `TRIRMC_INTERNAL_TOKEN`（EnvironmentFile）+现役调用方 token 同步清单核对——部署落活候冻结解，本笔验收锚=代码+测试跑批服务域执行毕+回流收口。

## 五、验收锚（全链实证四步读数）

- [ ] 打包锚：本件+材料在树（本笔即）；执行席接令回执
- [ ] sg/R 面拾取锚：拾取日志读数（TriRMC 侧执行流）
- [ ] 执行毕锚：四态测试读数+全量基线对照+现勘首步读数回填
- [ ] 回流收口锚：施工卷挂树与本地卷一致断言，本席销账

## 使用依据

- TriRMC `src/server/app.ts` L145-161 / `src/cron/routes.ts` 全文（本席 13:3x 实勘）
- 任务书 a8db08b1 + BOD 13:30 S2 裁定信
- 挂账家族：R-HY 401 pull_denied（信任面 token 门，另案候明晚窗）与本缺口并存不混修

# S2 施工卷 · TriRMC cron 写族 token 门 fail-closed 化（sg 值席执行流·四步读数锚）

- face: server-executable（M1 映射⇒TriRMC 侧）
- 执行位: sg 值席（MMC 拾取，D-27 树协议）
- 判据正身: 同树 `cto-s2-trirmc-token-gate-spec-20261007.md`（@35e55381）全款为准
- 卷态: **步骤一+二毕，门态=候 CTO 复核（禁跳门），零动码**
- lastSyncedAt: 2026-10-07T05:52:30Z（+8=13:52 date 现查带）

## 一、步骤①接令回执读数

- **拾取时刻**: 2026-10-07T05:39:46Z（+8=13:39:46，date 现查）；brief+判据卷读毕即拾。
- **工作副本**: 独立工作树 `/srv/fleet/TriRMC-s2-wt`（git worktree 自主 clone，分支 `s2-token-gate-failclosed`，照仓例「并发实例改工作树」）；node_modules 独立安装（115 包，--no-package-lock，主 clone 零污染）。
- **基线顶 hash**: `a02d89b`（fix(contracts): strictNullChecks 存量债型面修两处；sg bare 顶同 hash，克隆与 bare 齐）。
- **基线测试读数**（先基线后动码门禁恪守）:
  - node v18.20.8 跑：450 tests / 440 pass / **10 fail**——fail 根因=环境型（`node:sqlite` 需 node≥22.5，ERR_UNKNOWN_BUILTIN_MODULE 速败），非逻辑债。
  - **node v22.23.3 跑（基线正形）**：**467 tests / 124 suites / 462 pass / 5 fail / 9.98s**。红名录=4 套件级：A-TriMC ctx.cwd propagation＋A-TriMC ctx absent legacy fallback＋LG-017 pre-receive 三闸 sandbox（闸3 tag 子测）＋Employee Registry v3 loads——**全部离本笔爆域**（cron/token 族零涉）。
  - **关键域基线绿**：`test/server/internal-auth.test.ts` + `test/cron/app-cron.test.ts` 合跑 **8/8 pass**——本笔爆域在基线即绿，对照面干净。

## 二、步骤②现勘首步读数（零副作用·三发全单发·R-HY 双 unit 零触碰恪守）

- **healthz 达性**: GET `http://8.155.54.79:8710/healthz` → **200**（0.38s）`{"ok":true,"service":"trirmc","mcLedger":"ok","cron":{"enabled":false,"jobCount":0,"degraded":false,"consecutiveFailures":0}}`。
- **判据卷 §三.1 分辨法**（空 body POST 单发）: POST `/internal/v1/cron/jobs` `{}` → **401** `{"error":"unauthorized: missing or invalid X-Internal-Token"}` → **判据映射=门活（env 已配）**，非 400 门死。
- **GET 读族佐证**（单发）: GET `/internal/v1/cron/jobs` → **401** 同错误文——现役门（app.ts L145-161 P0 加固版）对 /internal/* 全域在役拦截，与 POST 判读互证。
- **systemd env 直读注记**: 河源 SSH 无凭据（既有拓扑实况），Environment/EnvironmentFile 直读不可达；以判据卷分辨法 401 定谳代之，如实记卷。
- **现势附注**: R-HY cron 引擎现态 `enabled=false / jobCount=0`——cron 写族在 R-HY 当前无活跃面，但 fail-open 缺口为**代码层潜势风险**（env 缺配即开），S2 修法照判据卷 §二梯度照办不因现势松绑。
- **token 纪律**: 探针全零头发出（无 token 值读取/回显/入卷）；日志 tail 未涉及，滤令条款备而未用。

## 三、门态与下一步

- **CTO 现勘复核门**: 本卷 §二读数呈复核；复核 PASS 前零动码（判据卷内嵌门恪守）。
- 复核 PASS 后入步骤③：app.ts L148-149 门逻辑梯度改造＋cron 写族前置校验（§二 fail-closed）＋四态测试锚（未配+写=403／未配+读=200／配+错头=401／配+对头=201）＋启动 WARN 断言＋全量基线对照（对 §一 node22 基线 467/462/5）。
- 步骤④回流收口：本卷终版（+测试读数+diff 摘要）commit 推回本树路径；TriRMC 码面推 `s2-token-gate-failclosed` 分支 sg bare。
- 死线 today EOD；夜跑可、回流明晨核（任务书条款）。

## 验收锚对照（判据卷 §五）

- [x] 打包锚：brief+判据卷在树，本席已拾取（§一读数）
- [x] sg/R 面拾取锚：本卷 §一（工作副本+基线）+§二（R 面探针流）
- [ ] 执行毕锚：四态测试+全量对照——**候复核门开**（现勘读数已回填即本卷 §二）
- [ ] 回流收口锚：终版卷挂树，候 CTO 销账

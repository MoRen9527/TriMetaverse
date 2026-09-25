# 拆派单·波③ 命令族（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波③ 执行拆派单正身；D-15 分派枢纽留痕件）
- syncMode: final
- lastSyncedAt: 2026-09-26 04:2x +0800（date 现查 04:20:40 hook 链）
- 接令记录: CEO 22:57 批（ccf10dff/24ba1ccc）波次令第③步；段2 验收签认（ste-manual-test-report.md 本件验收节 04:2x）=波① 整体闭环，本单随段2 闭下发
- 施工蓝本: FSD 波③ 设计稿 r2（`16fa941c` 初稿→`68f64c9e` 四点裁决回写 r2，§4 已翻「裁决定稿」态）+备料笔记（`4abf66d4`）——**施工读 r2 稿，零旧面**
- 方案正身: joint-plan.md 问3 契约（双签终版 24ba1ccc）

## 范围（九项，全部已裁决齐备）

1. **共享 core 落 TriCode**（零自依赖铁律：救 TriModel 的 core 不得落 TriModel——core 若随 TriModel 死则救不回，依赖方向论证定谳）。六层剥离照设计稿：L-A 纯函数直迁／L-B IO 内核 runWrite(WritePlan) 化／L-C 环境解析／L-D 模板层装载器拒钥／L-E 命令编排五件迁 TriCode；**L-F HTTP 壳留 TriModel 不动**。
2. **四族 bin 薄包装**：trimlc（TriMLC）／trirlc（TriRLC）／trimmc（TriMMC 新增 CLI bin）／trirmc（TriRMC 新增 CLI bin）。CoreIO 注入点=bin 侧唯一构造物（settingsPath/presetsDir/deployKeyPathFor/auditLogPath/who/machine/probes/l2FlagPath，设计稿 §2 清单）——core 零仓感知零仓依赖。
3. **三命令契约**：restore-direct／config list|get|set／status。**probes=回调型注入**（裁决：bin 侧提供探针实现 health+keys 值面 fetch，core 只编排+人话渲染；日志 tail 只配辅显）。
4. **正名落地首项**（首项勘验实锤：两组同名冲突 trilc×2／trimc×2，四族全旧名差距 4/4）：四仓 package.json bin 改名 trilc→trimlc、trilc→trirlc、trimc→trimmc、trimc→trirmc；**旧名 npm bin 双键 alias 过渡一版**（旧名指同入口+basename 识别→stderr 弃用警告一行+照常执行）；M3 退役窗删旧键（候后续，**不在本波**）。
5. **presets 模板化**：bigmodel 第一实现（现役 presets/direct.json 改模板形 `{base_url, model, key_placeholder}`）；deepseek 候批模板留禁用位（对齐 UI 现势）；**钥不进模板**，deployKey per-provider 命名扩展（`.deploy-key.bigmodel`）。
6. **runWrite 一步到位**（裁决：五门心脏直接 WritePlan 化，不做过渡壳——过渡壳=双形态并存漂移面；276 测套+STE 25/25 双基线护航）。
7. **L2 接线换真**：波② 调用桩（L2STUB 结构化行 fail-closed）→接 core restore-direct 真实现（TriMLC cron 拾取链现役在位；接线后 L2STUB 行退役、留兼容观察一轮）。
8. **deployed:false 同拒**（裁决）：CLI 与 HTTP 面防线一致性——PRESET_NOT_DEPLOYED code 人话报「该模板未部署」+列可用模板。
9. **默认 provider 单键全局**（裁决）：`TRIMODEL_CLI_DEFAULT_PROVIDER` 四族同读，缺省常量=bigmodel；族形四键方案作废（四个可漂移面）。

## 验收门（六条，一条不许丢）

1. **防线继承硬门（BOD 预口径②，最重）**：五防线全量继承——空钥 fail-closed／独立钥源序（禁从活体读钥）／干跑沙箱／自验 token 非空+auth 冒烟／活体操作审批门——**对照 STE 25/25 基线逐条勾验，一条不许丢**（restore-claude-config.ps1 f887b27 修复版=继承来源正身）。
2. **全量测试四项读数**：TEST（276 套回归零回退+core 新增测，既有失败逐族归因）／CHECK／BUILD／LINT 本席面零新增。
3. **正名三名一致对照表**：用户敲名/daemon 名/仓名逐族对表；旧名 alias 行为实证（弃用警告出现+命令照常执行成功）。
4. **四族命令沙箱演练读数**：restore-direct（沙箱假活体全链）/config list|get|set/status（probes 回调实跑）各出读数；本波**真活体零接触**（restore-direct 直指真活体的调用=审批门拦截形态，实弹候波④ 授权窗）。
5. **真活体 settings.json hash 零变化**随报（总判据持续）。
6. **波① 交付物零回退**：276 测+UI 测 8 全绿；fb-zone 页面行为不动。

## 禁区

- LG-035 冻结面零触碰（trimmc-card.json/policies/卡/生效值/策略区）。
- 本机其他 watchdog 任务族零触碰（TriMLC/TriRLC/TriHub/Seat）。
- 真活体 settings.json 零接触（含经 core 任何路径；沙箱纪律全程）。
- HTTP 壳语义不动（503 分支语义=偏-2 挂账候办，**不进本波**）。
- 不越波④：F1-F5 全链演练+toast 实弹+auth-dead 实弹候本波验收毕。

## 回报形态

全量读数四项+防线继承对照表（五防线×STE 25/25 逐条）+正名对照表+沙箱演练读数+hash 前后对照；三 commit hash 呈报（TriCode core／四仓 bin 改动／TMV 树件）。接令回执确认即开工（D-15）。

## 使用依据

joint-plan.md 问3（双签终版 24ba1ccc）；CEO 22:57 批+波次令（COO 23:07 转达）；本席五架构点+四候裁点裁决（设计稿 r2 `68f64c9e` 已全数回写）；FSD 备料笔记 `4abf66d4`；首项勘验（dispatch-wave1-wave2.md 正名表）；波② 派单 L2 桩条款（接线换真承诺）；STE 25/25 基线（restore-claude-config.ps1 f887b27）；D-15/M-004 派工纪律。

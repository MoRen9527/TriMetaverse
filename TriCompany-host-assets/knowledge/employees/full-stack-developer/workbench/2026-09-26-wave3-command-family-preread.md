# 波③ 命令族预读备料（候 CTO 拆派单）

> sourceOfTruth: 本件（FSD workbench 预读笔记，实例工作连续性面）
> syncMode: snapshot
> lastSyncedAt: 2026-09-25T20:03Z（+0800=2026-09-26 04:03）
> 依据: CTO 指示「预读 joint-plan 问3 备着」；正身=joint-plan.md 问3（双签 3d893e02/c130c6c0）

## 问3 要点抓取（命令契约三件＋绑定形态＋正名）

- **统一命令契约四绑定**：`restore-direct`（零参数=安全侧默认 bigmodel；读模板＋独立钥→健康门→备份→原子写→写后断言→失败自动回滚→结构化结果行）／`config list|get|set`（len-only 显示；set 走五门内核）／`status`（双层探针＋现役键形＋备份清单＋L2 标记态；零参只读，必须答得出「我现在用什么配置」）。
- **实现形态（CTO 定）**：共享 TypeScript core 包＋四仓 bin 薄包装，四族一份纪律防四漂移。语法·结果行·输出风格三统一（CPO 判据）由同一 core 天然达成。
- **四象限**（21:44 勘正版）：trimlc=本机 Win·M 本地域(8713)／trirlc=本机 Win·R 本地域(8711)／trimmc=sg Linux·M 服务域／trirmc=河源 Linux·R 服务域。
- **正名=执行窗首项（CTO）**：判据=用户敲的名字·daemon 名·仓名三者一致；旧名 alias 过渡一版＋弃用标注。
- **继承（BOD 预口径四条）**：吸收取代 restore-claude-config.ps1 成立；f887b27 修复版修-1..6＋STE 25/25 为继承验收基线；五防线全量继承硬条款；退役=四族落地＋步骤④毕后 TC 单提交＋FROZEN-NOTICE 互链，BOD 验收制。
- **模板三件套**：`presets/<provider>.json`={base_url, model, key_placeholder}；钥不进模板（独立钥文件 per-provider `.deploy-key.bigmodel`）；bigmodel 首发，deepseek 只留接口不实测（范围纪律）；占位符未替换=拒写。

## 现勘读数（2026-09-26 04:0x 实勘）

- **四族 bin 4/4 全旧名两组同名冲突实锤**（package.json bin 字段）：
  - TriMLC `trilc`（应 trimlc）＋ TriRLC `trilc`（应 trirlc）＝冲突组①（一机双族同名）
  - TriMMC `trimc`（应 trimmc）＋ TriRMC `trimc`（应 trirmc）＝冲突组②
  - 与派工单波② 首项勘验（TMV 2bb55469）读数一致；本机 PATH 三名不可达即期无实害（派工单已录）
- **继承基线定位**：`TriCompany/scripts/ops/local/restore-claude-config.ps1`（f887b27 修-1..6 版，340 行改动级；解冻 merge=2d08d7c）；同族先例 `scripts/ops/local/presets/direct.json`＋README——presets 目录形态现成可扩。
- **波① 资产复用映射**（①②内核→③直接复用）：
  - writeEnvSubset 五门内核 → restore-direct 写路径＋config set（同一套门=天然防漂移）
  - TEMPLATES 表（claude-fallback.ts:98）→ presets/<provider>.json 迁移基料
  - credentialGate / rotateBackups / envSubsetDiff / deployKeyPath → 直用
  - 结构化审计行（appendAudit）→ 命令族结果行同构
  - L2 标记文件＋watchdog 日志形态 → status 读数源

## 候派工单定的架构点（FSD 不擅动，列呈）

1. 共享 core 包落点：TriCode（shared runtime 惯例位）还是 TriModel 内导出子路径？影响四仓依赖声明方式。
2. 四仓 bin 薄包装技术形态：node shim 调 core？还是各仓 cli.ts 并入共享 core 只留 package.json bin 指针？
3. 旧名 alias 过渡一版的机制：package.json bin 双条目＋弃用 stderr 警告？过渡期长度与撤 alias 节奏。
4. sg/河源两 Linux 象限的 bin 安装方式（npm -g link？系统 PATH 落位？）——跨机纪律 D-24 随勘。
5. `restore-direct` 零参数安全侧默认=bigmodel：与 §问3 模板三件套「presets/<provider>.json」的默认 provider 指定机制（配置文件 vs 硬编码缺省）。

## 状态

- 预读完成，候 CTO 波③拆派单；派单下即对照本笔记开工（派单与笔记有差时以派单为准）。
- 关联: 波① commit TriModel 3db73829（五门内核在卷）；波② 五件 TMV 5f922ae8；STE 说明勘正 r2=8429c8e4。

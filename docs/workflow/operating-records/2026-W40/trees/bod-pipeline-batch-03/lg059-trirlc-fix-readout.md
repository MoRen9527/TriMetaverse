# LG-059 件 1 读数卷·TriRLC 仓旧名叙事面残留修复（batch-03）

- 执行: m-duty-fsd（FD）；任务书=本目录 task-charter-bod-pipeline-batch-03.md 件 1；供弹=batch-01 lg059-legacy-path-sweep.md TriRLC 段（266 处）
- 交付锚: TriRLC 仓 dev **f45885e**（127 files, +493/−493，行对行改名零逻辑变更）
- 硬门遵守: 未触 /srv/fleet/TriMC 物理目录 ✓；ink 补装面（件 2 专攻）零触碰 ✓

## 一、改动清单

- 扫面口径: 仓内大小写敏感 `TriLC|TriMC` 行 = 525 行（排除 test/tui/components.test.ts 件 2 专攻面；供弹卷 266 处为"处"计，本卷按"行"计，差=同行多命中+供弹后 HEAD 演进，如实分记）
- 改名: **493 行 / 127 文件**——TriLC→TriRLC、TriMC→TriMMC（大小写敏感，仅大写连写=叙事名；alias 真源=company-governance-state.md:201）
- 兼容面 K 保留 **34 行**（整行不动）：
  - `MoRen9527/TriLC` GitHub 远端 slug（app.ts:1369/4822 面、project-link.test、systemd Documentation URL）——物理远端身份
  - `TriLC Init Sync` 固定 git 身份（init-sync.ts:22/421 + init-sync.test.ts:272 **成对保留**，单改即断言红）——B 档 payload
  - `TRILC_*` env/常量、`TriLC Daemon` 注册任务名值、`DEFAULT_SERVICE_NAME/REGRUN_VALUE='TriLC'` 服务注册值簇+其消息簇（cli.ts 10 行）、systemd unit Description 模板（systemd.ts 3 行）——服务注册/单元冻结面
  - `D:/Code/ai/TriLC`、`D:\OneDrive\...\TriLC` dev 旧目录 fixtures（env-fallback.test 2 行+test-report-t2 1 行）——兼容面载体路径/历史记录
  - 命名注解行（README:9 quad-migration 锚、test-state.md 双线分叉注）——注解自否禁改
  - `rmc-TriLC.md` 历史卷名引用 3 处（auth-gate:258、cron-mcp:10 等→W35 rmc-audit-cmp-001 档案实存文件名，档案名不可改引）——**脚本 K 网格漏项，改后人工回正**，回正记录在案
- 件 2 排除面原样保留 2 行: test/tui/components.test.ts:203/:206（自含渲染断言，渲染串与断言串同源，与 src 侧零耦合）
- 标识符改名（全链 tsc 验证）: `createTriLCApp→createTriRLCApp`、`TriLCEnv→TriRLCEnv`、`TriLCDaemonServiceConfig→TriRLCDaemonServiceConfig` 等

## 二、复扫零命中断言

- 复扫（同口径）: 残余 **36 行 = K 面 34 行 + 件 2 排除面 2 行**，修复面（R 面）零命中 ✓
- 快照: /tmp/lg059-trirlc-residual.txt；逐文件分布：cli 10/systemd 3/constants 2/service 2/schtasks 1/app 2/init-sync 2+test 1/env-fallback 2/project-link 1/auth-gate 2/cron-mcp 1/test-report-t2 1/README 等注解行/components.test.ts 2（件 2 面）

## 三、全量测试读数（node22；含既有挂独立归因）

| 项 | 基线（3800e2d） | 件 1 后（f45885e） | 判 |
| --- | --- | --- | --- |
| 总数 | 203 | 203 | = |
| 通过 | 199 | 199 | = |
| 失败 | 4 | 4 | **零新增** |
| 跳过 | 0 | 0 | = |

- 挂名单逐条全等（4/4）：letters endpoints R1、FADE-005 派工门禁、FADE-005 可见性回归、tui components.test.ts——**硬门「扣除既有挂全等基线外新增 fail」达成 ✓**
- 既有挂独立归因（承 batch-02 件 3 卷 §四，零变化）：①letters R1=流事件帧 task_error≠letter（LG-026 行为/测试漂移）②③roster 409 门禁+FADE-003 计数 2<3（产品/计数漂移）④tui components=ink 嵌套 react-reconciler 冲突（件 2 专攻）
- tsc 门: 本件面零错（标识符全链一致）；lead-tools.ts 5 处预存 agent-core API 代差不变（卡点在案）

## 四、使用依据

- batch-03 task-charter 件 1；batch-01 供弹卷 TriRLC 段；batch-02 两读数卷（规则与 K 面先例承接）
- alias 真源 company-governance-state.md:198-211；TriRLC 仓 f45885e diff 为改动唯一真源

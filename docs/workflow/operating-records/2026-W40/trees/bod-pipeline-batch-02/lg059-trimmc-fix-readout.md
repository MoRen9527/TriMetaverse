# LG-059 件 2 读数卷·TriMMC 仓旧名叙事面残留修复

- 执行: m-duty-fsd（FD）；任务书=本目录 task-charter-bod-pipeline-batch-02.md 件 2；供弹=batch-01 lg059-legacy-path-sweep.md（TriMMC 节 705 处）
- 交付锚: TriMMC 仓 dev **bfbfcfe**（120 files, +888/−888，行对行改名零逻辑变更）
- 硬门遵守: 未触 /srv/fleet/TriMC 物理目录（禁动硬边界）✓；测试门读数见 §三

## 一、改动面

- 扫面口径: 仓内大小写敏感 `TriMC|TriLC` 行 = 909 行（供弹卷 705 处为"处"计，本卷按"行"计，两口径差=同行多命中+文件级扩展，如实分记）
- 改名: **888 行 / 120 文件**——TriMC→TriMMC、TriLC→TriRLC（大小写敏感，仅大写连写=叙事名，alias 真源=TriCompany/docs/registry/company-governance-state.md:201 CEO 08-31 终态裁决·单 B）
- 兼容面 K 保留: **18 行**（整行不动）：
  - `/srv/fleet/TriMC` 物理冻结路径（README.md:50、cli.ts:109、internal-token.ts:8/10/28、runbook:35/50、scheduler-design:133）
  - `TRIMC_*` env 命名空间（cli.ts:50、internal-token.ts:8/28、internal-auth.test.ts:3、code-state.md:13/57、scheduler-design:160）
  - cron payload 身份 `TriMC Scheduler`（cli.ts:77、runbook:23、scheduler-design:1/92/107——B 档候自然编辑窗，不排停机窗）
- 小写标识符（trimc/trilc：bin 名、trimc.service、trimc@tri.company、runtime_equivalent 值 trimc:*）大小写敏感替换天然零触 = 兼容面自动保留 ✓
- registry 三件（TriMC{Code,BusinessStrategy,Product}Registry.agent.md）：正文叙事照改；frontmatter `name:` 为文件名绑定标识符，与冻结文件名对齐保留旧形——**文件名级收敛候裁注**（host-assets 面，非本件清单范围）
- 历史档处理: 按任务书「按清单逐条」+alias「大写连写=叙事名」规则改名（phase-1-execution-note 等 dated 记录内 TriMC→TriMMC），史实语义由本卷留痕：改名系正名投影非事实抹除

## 二、复扫零命中断言

- 复扫（同口径 grep）: 残余 **18 行 = K 面全数**，修复面（R 面）零命中 ✓
- K 面逐行清单见 §一（/tmp/lg059-residual.txt 快照同文）

## 三、测试门全量读数（四项）

| 项 | 基线（改前） | 改后 | 判 |
| --- | --- | --- | --- |
| 总数 | 476 | 476 | = |
| 通过 | 466 | 466 | = |
| 失败 | 10 | 10 | 零回归 |
| 跳过 | 0 | 0 | = |

- 挂名单逐行 diff: 基线 vs 改后**一致**（仅 describe 正名随改：TriMC→TriMMC 字样）
- tsc 门（npm run check）: 过 ✓（标识符改名 TriLCDispatchExecutor→TriRLCDispatchExecutor 等全链一致）

## 四、失败逐族归因（6 族 10 计，全部预存·out-of-face）

| 族 | 子测数 | 根因 | 归属 |
| --- | --- | --- | --- |
| ctx.cwd propagation（tools-ctx-cwd.test.ts :33/:34） | 3 | shell_exec cwd 回退语义 stdout 空——sg 环境依赖，非旧名面 | 卡点候 CTO |
| config-sync status assembly（:36） | 3 | `401 !== 200`：**03fecb0（09-30 20:35 fail-closed 门升）** 对 08-25 旧测试（legacy-allow 断言）落差 | 卡点候 CTO（8712 迁移窗随批） |
| cron assembly（:53） | 2 | `401 !== 201`：同上 fail-closed 落差 | 卡点候 CTO |
| Employee Registry v3（:95） | 1 | `expected 14, got 12`：source-agents 席位数据漂移（计数型），非字段族/旧名面 | 卡点候 STE/CTO |
| /internal token auth gate（:109） | 5 | 「旧行为放行（兼容未迁移调用方）」断言 vs fail-closed 正形——03fecb0 行为变更后测试未随 | 卡点候 CTO |

- 修法建议（供裁）: 401 族=测试面补 token 装配或按 fail-closed 正形改期望；花名册=对表 source-agents 现役席位数；cwd 族=sg shell 环境适配

## 五、使用依据

- TriCompany/docs/registry/company-governance-state.md:198-211（quad-migration alias 真源·C 档双名并书+物理冻结）
- batch-01 lg059-legacy-path-sweep.md（供弹清单）；batch-02 task-charter 件 2
- TriMMC 仓 bfbfcfe diff 为改动唯一真源

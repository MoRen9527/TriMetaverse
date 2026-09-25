# FSD 波③交付报告 — TASK-TRIMODEL-RECOVERY-LADDER-01

- sourceOfTruth: 本件=FSD 席波③交付报告（候 CTO 审）；派工真源=同目录 dispatch-wave3.md @ ead64ae3
- syncMode: static
- lastSyncedAt: 2026-09-25T22:17Z
- 席位: FSD 小全（m-fsd）；受令=CTO 正式拆派单（九项范围/六验收门/五禁区）
- 状态: READY_FOR_REVIEW（九项全落，六门读数齐，技术债如实列后）

## 一、九项范围完成态

| # | 范围项 | 状态 | 落点 |
|---|---|---|---|
| ① | core→TriCode 六层拆分 | 完成 | TriCode/src/trimodel-cli/{index,commands,env,runWrite,credentials,policy}.ts 等（前 session，d4dd81b+cb7bca9） |
| ② | 四仓瘦 bin + CoreIO 注入 | 完成 | 四仓 src/cli.ts 新增 model 父命令；makeCoreIO 注入 who/binName/machine/probes |
| ③ | 三命令契约+回调型探针 | 完成 | restore-direct/config list·get·set/status；probes=回调型 Array<{name,probe}> |
| ④ | 正名 | 完成 | bin 双键+旧名 alias 单行弃用提示（三名一致对照见 §三） |
| ⑤ | presets bigmodel+deployKey per-provider | 完成 | core presets/ 单一真源（HTTP 与 CLI 同源）；deployKeyPathFor per-provider 链 |
| ⑥ | runWrite 一步到位 | 完成 | 五门内核全在 core runWrite；壳降薄壳（TriModel claude-fallback.ts v3） |
| ⑦ | L2 stub 接线真身 | 完成 | .fade/trimodel-l2-stub.ps1 → `trimlc model restore-direct --provider bigmodel` 全文命令串 |
| ⑧ | deployed:false 同拒 | 完成 | core findPreset→preset.deployed 检查，CLI 与 HTTP inject-key 双面同拒 |
| ⑨ | TRIMODEL_CLI_DEFAULT_PROVIDER 单键全局 | 完成 | core env 缺省 provider 链 |

## 二、六验收门读数

### 门① 防线继承（五防线×STE 25/25 vs f887b27）

| 防线 | f887b27 时点（波① STE 验收） | 波③现役证据 |
|---|---|---|
| ①备份先行+轮换 | STE 用例过 | core runWrite 单测（TriCode 56/56 内含）+TriModel 壳族零修改回归 |
| ②键名服务端锁定 | STE 用例过 | MODEL_TIER_KEYS 9 键族 core 硬编码，随 core 测套 |
| ③凭据健康门 | STE 用例过 | credentialGate 四态拒 core 单测+臂A 实证 |
| ④写读断言+回滚 | STE 用例过 | 回读断言/回滚防线 core 单测 |
| ⑤掩码审计 | STE 用例过 | tokenMaskedFrom/appendAudit core 单测+臂A 输出 len=49 掩码实证 |

- TriModel 五门族测试文件波③零修改（壳语义零变锚：276 测套零修改回归）
- STE 面复验归属 STE 席，本席不代判；以上为对应关系呈报

### 门② 全量四项读数（现役终态，2026-09-25T22:17Z 前后采）

| 仓 | tests | pass | fail | skipped | 对照 |
|---|---|---|---|---|---|
| TriCode | 56 | 56 | 0 | 0 | 全绿（core 侧） |
| TriModel | 276 | 271 | 0 | 5 | =1972d83 时点（壳零变锚） |
| TriMLC | 599 | 594 | 5 | 0 | =改前基线逐项同（同族失败：replay-flow/P0端到端/FADE-ASSESS-005×2/tui-components） |
| TriRLC | 644 | 639 | 5 | 0 | =基线逐项同（同族） |
| TriMMC | 602 | 597 | 4 | 1 | =基线逐项同（Contract-Resolver/Employee-Registry env 依赖族） |
| TriRMC | 566 | 561 | 4 | 1 | =基线逐项同（同族） |

零回归/零新增失败。既有失败族=改前基线已存在的 env 依赖/环境态族（独立验非转抄：本席改前基线实采）。

### 门③ 正名三名一致+版本一致性

三名一致对照（判据=用户敲的名字/daemon 名/仓名）：

| 象限 | bin 正名 | 旧名别名 | daemon healthz service | 仓 | machine |
|---|---|---|---|---|---|
| 本机 Win·M 本地域 | trimlc | trilc | "trimlc"（8713） | TriMLC | local-m |
| 本机 Win·R 本地域 | trirlc | trilc | "trirlc"（8711） | TriRLC | local-r |
| sg Linux·M 服务域 | trimmc | trimc | （sg 侧） | TriMMC | sg-m |
| 河源 Linux·R 服务域 | trirmc | trimc | （河源侧） | TriRMC | heyuan-r |

- alias 实证：四仓旧名调用→stderr 单行弃用提示+照常执行；新名调用→零提示（POSIX/直接 js 面实证；Windows .cmd/.ps1 shim 面已知盲区见技术债④）
- 包 name 字段保持旧形（bin-only rename，M3 窗口收口）；组② trimc 两义无解=CTO 裁定，弃用提示只引导各自新名
- 版本一致性：CORE_VERSION=0.2.0-wave3=TriCode package.json；npm ls @trimetaverse/tricode 六仓（TriModel+四仓）全部 0.2.0-wave3（含 agent-core→trimodel 传递链 dedupe）；四仓 lockfile `link:true → ../TriCode`

### 门④ 四族命令沙箱演练（真活体零接触）

| bin | version | config list | status 探针读数 |
|---|---|---|---|
| trimlc | 0.2.0-wave3 | 2 模板（deployed 1） | +TRILC_PORT=8713：daemon-healthz:8713 up=true（部署对位态）；裸调 8711：service=trirlc 错位如实报 down（探针身份校验，见 §四） |
| trirlc | 0.2.0-wave3 | 同源 | 裸调 8711 up=true（healthz 200，latency 24ms） |
| trimmc | 0.2.0-wave3 | 同源 | cron-engine up=false（本机无 sg 服务，诚实 PROBE_DEGRADED） |
| trirmc | 0.2.0-wave3 | 同源 | 同上 |

restore-direct 沙箱写（臂A，TRIMODEL_CLAUDE_SETTINGS 钉位）：exit 0，RESTORED，11 键写入沙箱，凭据 len=49 掩码，--provider nosuch → PRESET_UNKNOWN exit 1。

### 门⑤ 真活体 settings.json hash 前后零变化

- 前：491f33353d50f938b6b6dfd26cc8c7804500e10be55ac52caebb6e633cd778b2
- 后：491f33353d50f938b6b6dfd26cc8c7804500e10be55ac52caebb6e633cd778b2
- =门⑤基线逐字同。全程三臂演练+四族演练零触碰真活体。

### 门⑥ 波① 零回退

TriModel 276 测套零修改回归+STE 手测五门全过状态未动（波① 交付面无任何回退性改动）。

## 三、L2 stub 接线（范围⑦）演练三臂

- 臂A（restore 命令级）：stub 内部命令串原文+沙箱钉位 → exit 0/RESTORED/658B 沙箱/掩码
- 臂B（stub restore 臂真触发）：端口改写副本（3333→59999 单点差异）+假 flag → exit 0/restore-done 日志族/flag 清/沙箱写入
- 臂C（正身 clear-flag 臂）：服务双绿态真跑 → clear-flag 日志/flag 清
- 编码修正：5.1 Add-Content 中文面花→全行 -Encoding UTF8（写读回验绿）
- 日志族现役读数（.fade/trimodel-l2-stub.log）：restore-output/restore-done/clear-flag 结构化行齐

## 四、实现中发现并修正的缺陷（本波新增代码内）

**探针语义错位（已修）**：TriMLC/TriRLC 代码缺省端口同为 8711（历史同源），而部署态 TriMLC daemon 实跑 8713（watchdog --port 传入，部署面事实）。初版探针裸调探 8711 会把 TriRLC daemon 误报为 trimlc 健康。修正：①探针端口读 TRILC_PORT env（watchdog→daemon 既有契约键，watchdog.ts:111，零新键）缺省回退 CLI 缺省；②healthz body service 身份校验（healthz 返回 body 带 service 字段），身份不符→如实报错位。四态实证：trimlc+TRILC_PORT=8713→up；trimlc 裸调→错位 down；trirlc 裸调→up；trirlc+8713→错位 down。改后两仓全测零回归，已 amend 入波③提交。

## 五、提交 hash 清单

| 仓 | hash | 内容 |
|---|---|---|
| TriCode | d4dd81b + cb7bca9 | core 六层+CLI 命令族（前 session） |
| TriModel | 1972d83 | 壳 v3 薄壳化（前 session） |
| TriMLC | 6918318（amend 后） | bin 双键+model 族+探针身份校验 |
| TriRLC | 28f8696（amend 后） | 同构 |
| TriMMC | 29254eb | bin 双键+model 族+tricode 新依 |
| TriRMC | e69a740 | 同构 |
| TriMetaverse | 本件+.fade 两件（见尾注） | 树件+L2 stub 接线版 |

## 六、技术债务清单（如实）

1. **门④ verify-fail 分支单测缺**（同波①）：写后回读断言失败→回滚臂未单测覆盖（core 测套有 rollbackTo 独立测；端到端 verify-fail 注入缺）。
2. **TriModel engines node>=18.20 vs core >=20**：引擎要求不一致（TriModel 壳侧旧约束）。
3. **TriModel npm audit 2 high**：先期存量，非本波引入。
4. **Windows .cmd/.ps1 shim 弃用提示盲区**：npm shim 以真实 cli.js 路径调用子进程，argv[1] 不带调用名，basename 检测该面失效（POSIX symlink/改名副本面正常；代码注释在案；M3 删旧键后自然收口）。
5. **包 npm name 仍旧形**（trilc/trimc）：bin-only rename，name 对齐候 M3 窗口；TriMLC/TriRLC 两包 name 同为"trilc"系先期同源遗留。
6. **L2 标记态 CLI 读数未接**：status 的 l2 段需要 CoreIO.l2FlagPath 注入（注入位已留）；本波零新 env 键决策下未接，候批后接。
7. **组② trimc 别名两义无解**：CTO 裁定，弃用提示只引导新名（TriMMC→trimmc/TriRMC→trirmc）。
8. **探针端口部署对位依赖 TRILC_PORT 注入**：裸调缺省 8711 与 TriMLC 部署位 8713 分歧靠身份校验兜底诚实（不误报）；彻底对位候部署面在服务环境注入 TRILC_PORT=8713（键已存在，注入动作归部署面）。
9. **L2 stub 日志存量行编码混合**：历史行为 ANSI 写入（中文面花），新行已 UTF8；存量不回写。

## 七、禁区遵守声明

- LG-035 freeze face：零触碰
- 真活体 ~/.claude/settings.json：hash 前后零变化实证（含 core 路径全链沙箱钉位）
- HTTP 壳语义：零变（276 零修改回归；偏-2 503 分支=挂账候办未动）
- 波④：零跨越

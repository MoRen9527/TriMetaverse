# 四模块迁移变更说明书：TriMMC / TriMLC / TriRMC / TriRLC

## 文档元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/quad-migration-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-24
- 文档版本: v0.2-draft（已吸收小狄技术面 + 小乔产品面三审意见）
- 状态: `draft —— 待 CEO 终批后升 v1.0`

## 一、授权与决策记录

CEO 2026-08-24 指令（本说明书的唯一授权来源）：

1. 大调整内容：sg-server 的 TriMC 迁移变更为 **TriMMC**；本地研发仓承载 **TriMLC**；原 TriLC 变更为 **TriRLC**；按原 TriMC 规划实现 **TriRMC**，与 TriRLC 共享 agent-core。
2. 目标系统：**TriMMC+TriMLC = 虚拟演练重放（教练系统）**；**TriRMC+TriRLC = 自研落地系统**，从演练重放获取经验、降低试错成本。
3. 螺旋机制：以项目仓库为元认知，实现元认知 → 元虚拟 → 元现实 → 元认知的螺旋上升式改进。
4. 本轮裁决四点：
   - ① 命名口径从白皮书（TriMLC=驻留本地的控制器组件；研发仓本身是元认知载体，**不改名**）——**已定**
   - ② 先改叙事面；若混淆风险高则优先改 sg-server 侧——**已经小乔×小狄三审判定：混淆大头在对内文档与认知面、不在物理面，A 定序成立（见 §七）**
   - ③ 旧 TriMC 源码复制一份移植给 TriRMC；sg-server TriMC 按使命改造为**驱动 claude code 在 fleet 工作的壳**（可优先做，测试周迁移面并稳定之=第一优先），同步设计 M↔R 通信桥梁——**已定，终态归属按 §五.1 收敛口径执行**
   - ④ bridge 形态由小狄×小乔裁定——**Q3 待评**

白皮书依据（v1.0 已签发，08-22）：§0 修订说明（模块名换轨）、§3.1 双系统对定义、附录 B 词条、L1 路线图行。**本说明书不发明新语义，只把在册定义落成工程步骤。**

## 二、目标拓扑与映射表

### 2.1 四模块映射

> 本表为防混锚点；权威 alias 真源落 CompanyGovernanceRegistry（§三.2），此处引用 as-of v0.2。

| 旧名 | 新名 | 层 | 角色 | 物理载体（兼容面，冻结） | 变更性质与状态 |
| --- | --- | --- | --- | --- | --- |
| TriMC | **TriMMC**（读"Tri-双M-C"，读法词条待白皮书波 2 补） | 元虚拟·主控 | 驱动成熟宿主（claude code）在 fleet 工作的壳 | systemd `trimc.service`+drop-in；`TRIMC_CONFIG_DIR=/var/lib/trimc`（jobs.json/logs/init-sync/notify.json）；`/srv/fleet/TriMC`；`/srv/git/TriMC.git` 及全体克隆 remote（sg-server+GitHub origin）；fleet safe.directory 登记（path-keyed）；loose g+w 例行；`/tmp/trimc-run.log`+logrotate 规则；healthz 8710；本地目录 `D:/Code/ai/TriMC` | 叙事面更名：✅ 已完成（白皮书 08-22）；使命改造（壳）：⬜ 未开始（Phase 1） |
| （新增） | **TriMLC**（读 Tri-M-L-C，4 音节） | 元虚拟·本地腿 | 承载本地研发仓宿主；FADE 灌员工定义入宿主；实验成果落盘元认知仓 | `D:/Code/ai/TriMLC`（现状：`.github/agents/` 三 registry agent 门面在册 + README/AGENTS/STATE；registry 数据文件待建） | P1-4 收尾：四件套+FADE claude 宿主激活声明（Phase 4） |
| TriLC | **TriRLC**（读 Tri-R-L-C） | 元现实·本地控制器 | 会话持久化/调度/cron/心跳/审计自持（agent-core） | 本地目录 `D:/Code/ai/TriLC`（被 CLAUDE.md 工作区布局、TriCade 打包相对路径、build-tricade.yml 引用）；`trilc` bin/npm 名；registry 三件套齐全 | 叙事面换轨（Phase 3）；心跳/镜像/events 现指向 TriMC，指向切换归 TriRMC 迁移批 |
| （新增） | **TriRMC**（读 Tri-R-M-C） | 元现实·主控 | 必须自持的生产面：稳定执行/无人值守/权限审计/跨节点协同（agent-core） | `D:/Code/ai/TriRMC`（现状：agent 门面在册 + **MIGRATION.md 批项 1-5 蓝图**（08-22，R4/R6 裁决链）、STATE.md） | 复制 TriMC 源码移植（CEO 08-24 裁决③，对 MIGRATION.md 起点口径的覆盖声明见 §四 Phase 2）（Phase 2） |

### 2.2 三层螺旋

```
        ┌──────────── 元认知（项目代码仓，不改名）────────────┐
        │  经验沉淀 ← 回流校准                                 ▲
        ▼                                                      │
  元虚拟 TriMMC+TriMLC ──演练重放──▶ 元现实 TriRMC+TriRLC ────┘
```

> **人话版**：TriMMC+TriMLC＝借成熟宿主做免费试错的教练场；TriRMC+TriRLC＝自研内核扛生产的落地队；项目仓＝两者共用的经验账本。

- 元虚拟对刻意**不自建**会话/loop/上下文（用宿主原生能力）；只做两件事：灌人（FADE 发布线）+ 落盘（成果进元认知仓）。
- 元现实对**全部自持**（agent-core）；两对共享的只有合同（五件套）与经验资产，不含执行内核。

## 三、防混纪律（最高优先级条款）

1. **操作命令语境禁新名（硬规则）**：凡 ssh/bash/systemctl/git 等操作命令语境，只允许物理旧名原样出现；新名仅存在于叙事散文并强制首现括注。机械性封死"按文档敲出新路径"事故类。
2. **alias 单一真源**：权威机器可读 alias 表落 CompanyGovernanceRegistry（含四列：名 / 读法·口播约定 / 一句话角色锚 / 兼容面载体）。其余文档一律**引用+as-of 版本号**，禁自由复述副本（副本必漂移）。
3. **大小写分工规则**：大写连写（TriMLC）= 叙事名；小写（bin/npm 标识符 trimc/trilc）= 兼容面旧名。见到小写一律按兼容面理解。
4. **三层换轨节奏**：
   | 层 | 内容 | 节奏 |
   | --- | --- | --- |
   | 对外叙事面 | 白皮书、未来官网/Release notes | ✅ 已切换（08-22），维持新名+首现括注，不再动 |
   | 半公开协作面 | GitHub README、commit message、issue、周报 | 新起内容用新名+首现括注；历史记录一律不追溯改写（历史冻结口径） |
   | 内部工程兼容面 | bin/npm/仓名/unit/cron 路径/数据目录/remotes | 冻结至物理迁移窗口（绑 Phase 2 部署窗，不单开窗口） |
5. **兼容面冻结完整清单**：§2.1 第四列全部条目（systemd unit+drop-in、TRIMC_CONFIG_DIR 及其下文件、/srv/fleet/*、/srv/git/*.git 及全体克隆 remote 含 GitHub origin、safe.directory path-keyed 登记、loose g+w、logrotate 规则路径、healthz 8710、本地 TriMC/TriLC 目录名及其被 CLAUDE.md/打包脚本/build-tricade.yml 的引用链、trilc/trimc bin/npm 名）。
6. **语境锚定**：叙述服务器现役生产默认指旧 TriMC 实例；叙述 M 对教练系统才用 TriMMC。含糊场合禁用裸名。
7. **记忆同步**：命名落册后强制刷新员工 knowledge workspace 中涉及 TriMC 服务器操作的既有记忆条目（防凭记忆指错对象——记忆比文档更容易绕过 alias 表）。
8. **混淆台账与回退开关（C3）**：过渡期内任何人/agent 把旧名事实错挂新名（或反向）记台账一条；连续 2 周且 ≥3 次/周 → 触发定序复议并升级 CEO。无此开关，"容易混"永远主观。

## 四、工作分解（分阶段）

### Phase 1（第一优先，CEO 定）：TriMMC 壳改造

- **交付物/DoD**：① 宿主驱动面设计文档（输入=`claude-code-spawn-resume-context-innovation-record.md` + `reference/claude-code-2.1.88/` 源码）② 影子迁移试跑报告 ≥2 周（判据见 §五.2）③ M↔R 桥梁设计草案（形态归 Q3）④ 周迁移主路径全程零中断。
- **范围**：a. 周迁移面稳定测试——现役五段链确定性脚本保持生产主路径；壳驱动的 agent 化迁移为影子路径。b. 宿主驱动面设计。c. M↔R 桥梁设计启动。
- **影子写入隔离（生产安全项）**：影子试跑限定 dry 模式或独立测试 operating-root；一切输出打 `[shadow]` 前缀、写独立目录、**不进现役告警通道**；主路径告警文案固定含链路身份（"主路径"）；周报/经营记录披露口径统一"主路径 X，影子对照 Y"，禁裸报"迁移失败"。不满足本条不得开跑影子（小乔阻断 B1）。
- **明确不做**：不自建会话管理（白皮书红线）；不动现役 cron 生产链路；不改兼容面任何一项。

### Phase 2：TriRMC 移植

- **执行真源挂接**：细节以 `D:/Code/ai/TriRMC/MIGRATION.md`（批项 1-5：双跑策略/回滚路径/开业互锁门〔I5 先于 config-sync 切换〕/对照基线〔I5 开业验收 + I4 43/43〕/种子资产七件清单）为准，本说明书不重复展开。
- **CEO 08-24 裁决③覆盖声明**：移植起点由 MIGRATION.md 的"零代码搬运、种子资产生长"调整为"**复制旧 TriMC 源码为起点**"（两者可调和：旧 TriMC 本身即 agent-core 之上的薄适配层，复制所得≈配置与接线+种子资产的同构物）；种子资产清单降级为功能对齐基线使用。此为 CEO 直接裁决对既有蓝图的显式覆盖点，留痕。
- **命名处理**：复制时一次性完成标识符换名（package/env 前缀 `TRIMC_`→`TRIRMC_`、unit 名、日志路径、command 内嵌绝对路径随新部署面一次重写）——全案唯一合理 in-place 改名点位（新仓零流量窗口）。
- **部署形态（Q2 待小狄）**：sg-server 第二服务？端口/数据目录/runbook 独立。物理改名（如做）绑定同一停机窗口，不单开窗口。
- **registry 拆分交付物**：移植完成后拆出 `TriRMC/docs/registry/product-state.md`，中央 registry 只留指针行（防 TriRMC 事实滞留中央形成第二真源）。
- **回滚预案**：TriRMC 异常即摘除，控制面回归 trimc 独跑（与中央 Operational Safety Model 口径呼应）。

### Phase 3：TriRLC 叙事面换轨

- **交付物/DoD**：差距清单一份（对照白皮书 R 侧职责清单盘点）——若确认无大改，清单即结论；预判不代替盘点。心跳指向切换不在本 Phase（归 TriRMC 迁移批，协议不变故可回切）。

### Phase 4：TriMLC 立项收尾

- TMV-P1-4 pending 项：四件套+FADE claude 宿主激活声明+命名锚定落册；无 daemon 侦听面（R4 裁决）。
- ⚠️ 前置核对三项：树文件 pending vs commit e7813a89 done 两态矛盾；TriMLC/STATE.md 陈旧（自曝 git init 未做而磁盘已有 dev 分支多提交）；四件套两种口径出入（R6 §1.2 vs agent-governance-alignment-design §六）——动工前一并裁定。

### 全局贯穿件

0. CPO 于各 Phase 收口时同步对应仓 product-state.md（成熟度/换轨进度）；product-state 唯一落点=各仓 docs/registry/，产品 owner 统一小乔收口（不设分仓 owner），各仓 ProductRegistry agent 作读取入口。
1. 权威 alias 表落 CompanyGovernanceRegistry；各文档引用不带副本。
2. 白皮书工作区未提交修订收口归位；白皮书下次复核补 TriMMC 读法词条。

## 五、双跑与切换判据

### 5.1 目标终态收敛（小狄阻断 #15 裁定）

**确定性五段链作为周迁移生产机制长存；其宿主最终移交 TriRMC（R 侧基础设施）。TriMMC 壳驱动的 agent 化迁移长期处于影子/实验位，转正需 CEO 另行裁决。** 据此："旧 TriMC scheduler 职能迁空"的准确含义 = 调度宿主身份移交 TriRMC，而非机制废弃；TriMMC 退役为纯壳。

### 5.2 切换判据表（所有行约束：切换动作只选周日触发完成后窗口）

| 面 | 生产主路径 | 影子/继任 | 判据 |
| --- | --- | --- | --- |
| 周平面迁移宿主 | 确定性五段链（python3.8 cron） | TriMMC 壳 agent 化（影子位） | 连续 ≥2 周 shadow 与主路径**逐字段一致**（比对工件=`.shift-ade.json`+git commit 内容+per-run 日志三件 diff），且其中至少一次完整成功迁移+一次注入故障对比演练；N 值最终由小狄技术面定；**转正另需 CEO 裁决** |
| 周平面迁移调度宿主移交 | trimc 内置 cron | TriRMC cron | MIGRATION.md 批项 1-5 判据 + 双跑观察期 + CEO 放行 |
| config-sync 接收侧 | trimc config-sync-apply | TriRMC sync-apply | MIGRATION.md 批项 3（applied.json 版本比对 + I4 基线 43/43 + 开业互锁门） |
| 服务器控制面 | trimc 服务 | TriRMC 服务 | 全功能对等（基准=MIGRATION.md 对照基线）+ 观察期 + CEO 放行 |
| 退役 | —— | —— | 调度宿主移交完成且 TriRMC 稳定运行 ≥2 周后，TriMC 身份退役为纯 TriMMC 壳（机制不废，见 5.1） |

## 六、风险面

1. **五名混淆**（最高）：§三 纪律缓解（操作命令禁新名为最直接机械防线）+ 台账回退开关兜底。
2. **生产连续性**：周迁移/config-sync 是唯一无人值守流程；服务器侧变更必须**避开冻结窗口**（周日 23:00–23:59 触发小时），高危动作排周日白天或工作日。三个已实证脆弱面使服务器侧改名高风险化：safe.directory 按 path 键登记（改名即失配 exit 128）、.git 属主复发常态（r1-3 实证）、失败暴露点常落在无人值守触发窗口。
3. **范围蔓延**：Phase 1 不做清单防"M 对做成自研内核"的方向性错误。
4. **记录冲突**：TMV-P1-4 两态矛盾 + STATE.md 陈旧 + 四件套双口径，动 TriMLC 前必查（Phase 4 前置核对）。
5. **认知滞后**：AI 员工 knowledge workspace 旧路径记忆晚于文档被调用——落册后强制刷新（§三.7）。
6. **远端手痒**：GitHub origin 仓名冻结条款覆盖（自动重定向仅在原名未重建时有效）。

## 七、评审与裁决记录

| 轮次 | 评审人 | 范围 | 结论 | 时间 |
| --- | --- | --- | --- | --- |
| Q1 | 小狄（技术面） | Q1 定序+全文 | **APPROVE with conditions**：Q1=A（叙事面先行）；阻断 2 条（MIGRATION.md 双真源挂接、终态歧义）+ 建议 12 条——v0.2 已全部吸收 | 2026-08-24 |
| Q1 | 小乔（产品面） | Q1 定序+全文 | **APPROVE with conditions**：同意 A+三项条件（alias 单一真源/物理改名绑窗/混淆台账开关）；阻断 1 条（影子通知语义）——v0.2 已全部吸收 | 2026-08-24 |
| Q1 合流 | 编排层 | —— | **A（叙事面先行）双面一致**；物理改名全面推迟且退役窗口亦以新服务替代、不做 in-place rename；3 条阻断 v0.2 已落字 | 2026-08-24 |
| 升版动作 | 编排层 | v0.1→v0.2 | 吸收 3 阻断+全部建议，待录 | 2026-08-24 |
| Q2 | 小狄（待评） | TriRMC 部署形态 | 待评 | —— |
| Q3 | 小狄×小乔（待评） | M↔R 桥梁形态 | 待评 | —— |
| 终批 | CEO | 全文发布确认 | 待批 | —— |

### 产品侧成功指标（本次变更自身的验证闭环）

1. 混淆事件台账计数趋势降至 0；
2. 对外物料新名覆盖率抽查 100%；
3. 迁移全程周迁移主路径零中断。

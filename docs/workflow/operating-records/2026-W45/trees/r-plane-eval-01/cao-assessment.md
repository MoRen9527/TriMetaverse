# 成熟度评估卷 · CAO 域分席料（r-plane-eval-01）

- 席位: r-duty-cao（小行）
- 认领域: 行政治理面——组织制度·值班交接机制·会议/秘书处纪律·治理文档归属·信箱/告警路由面
- 勘察时窗: 2026-11-04T05:31:05Z ~ 05:35:17Z（sg 机只读勘察）
- 勘察边界声明: 本席在 sg 机可达面=sg 现役仓（对比基准侧）+R 面值班设施（dsh/TriMLC/TriMMC/shadow-plane）；**R 面本地域实体运行面（dev 机侧 8711 daemon 实况）不可达**，凡涉实体运行读数一律标「待确认」，不虚构。

## 一、成熟度评估（五分项·M1 占位 ~ M5 制度化）

### 1.1 模块治理文档面（AGENTS/registry）——M4 成熟

- 两仓 AGENTS.md 五段式齐整（Module Role / Strategy Delegation / Local Fact Sources / Current Registries / Update Discipline），含防虚构纪律（TriRLC:「不要虚构本地域节点成熟度」；TriPilot:「不要凭缺失文件推断进度」）。
- registry 三层工作型资料齐：business/product/code-state.md + README 载真源优先级与防漂移更新规则（「只有在用户明确要求记录/更新时才修改本目录」）。
- 命名锚定纪律在册：quad-migration v1.0、正名链（TriLC→TriRLC→TriMLC）、alias 权威表指 `TriCompany/docs/registry/company-governance-state.md`。
- 连接面变更纪律在册：TriRLC README 中央连接面节（LG-030 勘定 / D-17 在册 / LG-031 审计条款）。

### 1.2 模块 workflow/制度面——M1 占位（最大缺口）

- TriRLC `docs/workflow/README.md` 仅 5 行占位（「本目录用于后续补齐」），树内仅残留 2026-W30 旧树目录（trilc-tui-polish）。
- 对比基准：M 面 `TriMetaverse/docs/workflow/` 80+ 制度件（schema 族+收口规程+值班窗+交接模板齐备）。R 面本地域产品仓制度面基本未建，且无路由指针回 M 面制度册——**模块侧照哪个纪律册办事无文档答案**。

### 1.3 登记面对称性与充实度——M2

- 两仓登记面不对称：TriRLC 有 `test-state.md`+`company-state.json`，TriPilot 两件皆无——registry 基线不一致。
- 空壳占位登记：TriRLC `docs/engineering/STATE.md`、`docs/training/README.md`、`docs/execution/README.md` 均「用于后续补齐」壳文——有壳无实，治理完成度被表面夸大。
- TriMLC `STATE.md` lastSyncedAt=2026-08-24（syncMode source-only），状态登记陈旧近 10 周。

### 1.4 双仓归属面（TriRLC × TriMLC）——M2，漂移风险在途

- 实勘：`/srv/fleet/TriRLC/README.md` 与 `/srv/fleet/TriMLC/README.md` 主体同文（同 Responsibilities/Planned modules），正名链注记并存——**一物一册一 owner 未裁**：两仓 README 谁是本地控制器叙事正本，alias 表虽指中央 governance-state，但双仓同文并存即漂移温床。
- TriMLC 侧另有独立面（FADE-HOST-ACTIVATION.md、dist 双备份目录 `dist-bak-pre-echo-20261015T1140`/`dist-bak-pre-swap-20261015T1715` 滞留仓根）——备份卫生与归属注记缺位。

### 1.5 值班/信箱/告警路由面（R 面值班基础设施）——M2

- notify-mailbox.json + notify-outbox.json + 双 ledger.jsonl 机制在 TriMMC 现役（本席巡检实测结构可用：target_seat/read 字段、账本化流水）；现信箱空转（0 信，空转属低负载而非故障——待确认：是否值班班次未启信箱惯例）。
- **信箱制度无正身**：M 面纪律册有 D-52 式报到承接纪律，但 grep 全 workflow/registry 无 notify-mailbox 独立制度件，仅 operating-records 树内散件（W42/W43 dispatch 件）提及——路由表、保留策略、read 置位规程均未制度化沉淀。
- dsh（8791 R 面 harness）治理面近零：`smoke1.py`/`smoke2.py` 散在仓根、无 README、无 docs。
- shadow-plane：brief 流水（2026-08-24~25 时段）堆根目录，无归档分层无索引。

## 二、对比基准结论

| 面 | M 面 sg 现役基准 | R 面本地域产品现状 | 级差 |
| --- | --- | --- | --- |
| AGENTS/registry 治理面 | 成熟（M4-M5） | 成熟（M4） | 基本对齐 |
| workflow/制度面 | 80+ 件+schema 族（M5） | 5 行占位（M1） | 最大级差 |
| 登记面 | 中央 16 件+字节级副本纪律 | 不对称+空壳（M2） | 显著落后 |
| 值班/信箱制度面 | 纪律册 D 系在册 | 机制在转、制度无正身（M2） | 有机制无制度 |

**CAO 域总评**：R 面本地域产品「治理骨架好、制度血肉缺」——AGENTS/registry 骨架承袭 M 面模板质量高；模块制度面、登记对称性、值班信箱制度化三面欠账清晰可列。评估只读勘察证据充分，无虚构项。

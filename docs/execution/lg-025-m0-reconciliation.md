# LG-025 M0 对表准备卡（09-05 窗前置；09-03 制备）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-025-m0-reconciliation.md
- syncMode: source-only
- lastSyncedAt: 2026-09-03
- 性质：LG-025（五件套两代并存清理滚动批，CEO 2026-09-01 裁决「立项，主窗后滚动批」）M0 对表前置件——窗内执行案以本卡+台账 LG-025 为准，今明为对表准备期
- 窗口：M0=09-05（周五）→四里程碑照 LG-025 排程表（09-05 起；细案开工时另定）
- 归属路由：五件套治理=CHO，管线面=CTO，错别字=CPO 域协办；本卡=总助对表准备（经营记录域，不越域执行）

## 一、原料对表现势（09-03 实勘）

### 1.1 五件套布局（TriCompany/source-agents/）

- 角色目录 14 个（13 员工席+business-strategy 建制席），外加 `registries/`。
- 每席文件族（以 ceo-chief-of-staff 为样板）：`<id>.agent.md`（合成件）/`<id>.contract.yaml`/`<id>.colleagues.agent.md`/`<id>.memory.agent.md`/`<id>.soul.agent.md`/`<id>.social.agent.md`/`agent-body.agent.md`/`agent-frontmatter.agent.md`/`session-body.agent.md`（ceo 已有）。
- **colleagues 缺席席（无该件）**：customer-success-officer / deployment-engineer / registries——M0 补建 candidates（依模板）。

### 1.2 错别字「CEO 磨人」——**全席通病**

- `grep -rn "CEO 磨人" ../TriCompany/source-agents/*/colleagues.agent.md` → **8 席命中**（ceo-chief-of-staff/chief-administrative-officer/chief-financial-officer/chief-human-resources-officer/chief-marketing-officer/chief-operating-officer/chief-product-officer/chief-technology-officer），全系 L5「汇报给：CEO 磨人」。
- `agent-body.agent.md` 零命中（磨人句仅 colleagues）。
- **结论：CPO-only 首刀范围过窄**——按「批内第一刀防渲染外泄」逻辑，8 席 colleagues 同改（磨人→本人/CEO 本人），一次收口（先例=CPO 首刀案），防外泄全席覆盖率=不匹配。

### 1.3 合同 v3.1 paths 修正现势

- contract.yaml `paths:`（以 ceo 为例）已修= `soul/agent_body/agent_frontmatter` 分立；（待确认 colleagues/social 是否同代修到位）。
- **14 席合同全涉 `colleagues` 引用**；约束=先修正 ceo 的 colleagues/social 腓点，然后滚动其余 13 席同律。

### 1.4 manifest sourceFiles 换新代

- `tri-metaverse-live-agent-publish-manifest.json`：`keys[manifestId/date/sourceRoot/liveRoot/status/governance/moduleRegistryMigration/liveEntries(70)/retiredEntries(2)]`。
- liveEntries sample keys=`status/target/source/kind/renderTemplate/sessionBody`；**当前未见 sourceFiles 键**——换新代=在 `source` 指向新代五件套（进 M0 核对项，细分由 CTO 主笔管线面定案）。

### 1.5 legacy runtime 消费者（四席清理前置）

- `runtime/cognition/`：`chief_of_staff_bridge_validation.py`/`chief_of_staff_cognition.py`/`chief_of_staff_workflow_bridge.py`/`chief_of_staff_workflow_validation.py`/`employee_host_binding_profile_generation_validation.py`/`employee_onboard.py` 六件消费五件套路径。
- M0 须先收口这 6 个 legacy runtime 消费者，才能旧代退役删除（台账口径「先收口 4 个 legacy runtime 消费者」——实勘 6 件，以本卡数为准）。

### 1.6 CHO W34 审计 §3.1 漏记 9 目录勘误（CHO 域加件）

- 触达：CHO 主笔；M0 对表内挂项。

### 1.7 CPO 五项发现（产品侧已登记）

- 产品侧登记位=`docs/registry/product-state.md`（待查其五点原文——若尚未录全，M0 若耗时不阻塞窗，列入 min）。

## 二、窗内执行序（M0→M1…按 LG-025 排程）

| 序 | 行动 | 归属 | 前置 |
| --- | --- | --- | --- |
| M0a | 磨人全席 8 席 colleagues 逐字修「CEO 磨人」→「CEO 本人」 | COS（CPO 协办） | 无 |
| M0b | 合同 v3.1 paths 修正（其余 13 席，先修 colleagues/social 腓点） | CHO | M0a 完 |
| M0c | legacy runtime 6 件消费者收口 | CTO（FD 实施） | 合同修正完 |
| M0d | manifest sourceFiles 换新代 | CTO（管线面） | M0c 完 |
| M0e | 人格语义对账（逐席位核对五件套语义与源） | CHO | M0c/d |
| M0f | 旧代退役删除 | CHO（先收口 4/6 legacy 消费者） | M0e |
| M0g | check-sync / validate 全绿作门 | 管线校验 | M0f |

> 说明：细化按 LG-023 模板（validator+CHO 状态机+对拍）；**窗口 09-05**；本卡为对表准备，不在今明执行滚动改。

## 三、今明准备期动作

- [x] 原料盘点（本卡）
- [ ] 今日发 M0 对表卡至 CHO（五件套治理）+CTO（管线面）——先呈数据面，不惊动执行
- [ ] 备份基线快照（约 window 前一日，M0 开工前 `git stash/pack`+可回滚点）

## 四、风险

- 磨人 8 席全改覆盖=比 CPO-only 范围大，需 CHO 确认（制度归治理侧）。
- legacy 消费者实勘 6 件 vs 台账「4 件」**口径差**——以实勘 6 件为准（台账 LG-025 备注顺手勘）。
- manifest sourceFiles 键缺失→换新代需 CTO 定义（M0d 前置）。

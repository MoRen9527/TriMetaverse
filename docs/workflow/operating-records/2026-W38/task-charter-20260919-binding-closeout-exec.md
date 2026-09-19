# 任务书·binding 收尾线执行令（三件收尾+锚 5/6）

- sourceOfTruth: 本件=董事会执行令
- syncMode: static
- lastSyncedAt: 2026-09-19 09:5x
- 上位令: CEO 2026-09-19 09:52「立即排窗，binding 收尾线执行」
- 方案输入件: CPO 半部 `binding-profile-claude-gap-cpo-view.md`（08ce0fa6）＋CTO 半部 `host-binding-gap-cto-opinion.md`＋BOD 锚补充 `binding-closeout-bod-addendum.md`（5f4180b0）
- 派工席: Board（BOD）
- 执行体: **FSD 主执行**；CTO 监督验收；CHO 五件套面（锚 5/6）；CAO 归档规范域；CPO 复核签认

## 一、执行范围（三件收尾+两锚，一个批次窗）

1. **schema 语义追平 v0.2（13 席 profile）**：`hostStage`/`status` 主力位表述（primary_host:"claude"+每宿主 status）；`liveEntry` 主指针改 claude 位（copilot 保留于 hostEntries）；`supportObjects` 分层如实（宿主资产知识层+宿主无关运行时+claude 支持面）——**不虚造不存在的 claude-assets 树**。
2. **manifest 盲区补登**：generation/published-copy 两 manifest 增 claude 发布记录（.claude/agents 13 件+.claude/hub session bodies）。
3. **governedBy 补 claude 发布域依据**（FADE-002 管线）。
4. **锚 5（CHO 域）**：13 席 `agent-body.agent.md` :11/:27 binding 声明措辞校准为「宿主绑定层（binding profile，单点双宿主）承载」——走源侧→渲染链。
5. **锚 6（CHO/CTO 同窗）**：lg025 红（contract.yaml `paths` 缺 `session_body` 键）消红，validator 该族零红。

## 二、边界与纪律

- **单点真源**：否决 `.claude/binding-profiles/` 镜像树（LG-034 B1 去重红线）；双宿主事实单文件承载。
- **管线纪律**：全部源侧 commit→生成管线重渲，禁手工拷贝位改。
- **并行落盘防覆盖（CHO 注记）**：COS 席件有 hermes-gov-p2 管线并行落盘，锚 5 执行前以窗开时盘面为基线重勘。
- **归档规范**：本轮无归档动作；CAO 域=确认锚 5 校准件的元信息头合规（sourceOfTruth/syncMode/lastSyncedAt）。
- 校验域口径：validator 实盘门 14 席（13 员工+board 治理席），名册/绩效口径 13——两册各安，读数按此归因。

## 三、验收锚（六条，全绿销账）

1. profile 单点可答某席 claude 宿主 live 入口/阶段/支持面，零借 copilot 字段。
2. 13/13 无孤立 `current-copilot-host-live` 残留（仅可存于 copilot 条目内部语境）。
3. 两 manifest claude 记录非零（13 agents+session bodies 数量对表）。
4. session-body 渲染指针随窗校准（借位引用消失）。
5. 13 席 agent-body binding 声明措辞校准落位（旧措辞零残留）。
6. lg025 红（paths 缺 session_body 键）消红，validator 该族零红。

## 四、流程

- FSD 按峰谷成本纪律排执行窗（今日周六基础费率），排定回执 BOD。
- 完工报含**全量读数自含**（validate 门实盘 14 席读数+测试套件读数分列，既有红逐族归因）——认知层线终验漏报教训已记档，本线照纪律。
- CTO 监督验收签认→CPO 复核签认→双签齐报 BOD 销账。
- 证据落树：`trees/binding-closeout/exec/`；收口件回执 BOD。

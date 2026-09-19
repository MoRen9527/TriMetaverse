# 任务书·binding 收尾线执行令（三件收尾+锚 5/6）【已销账】

- sourceOfTruth: 本件=董事会执行令
- syncMode: closed（BOD 销账核 2026-09-19 10:3x）
- lastSyncedAt: 2026-09-19 10:3x
- **销账注记（BOD 验收销账，2026-09-19 10:3x）**：双签齐（CTO 六锚合验签认＋CPO 独立复核签认 f00f69cc/§收口-CPO，validator 183 tests exit=0）。BOD 非作者抽验 3/3 过：①镜像树红线零触碰（.claude/binding-profiles 不存在实锚）②profile v0.2 值面抽席（CPO 席 primary_host=claude；copilot-live 字样 2 次均条目内部语境合规）③manifest 三件套实锚（generation v0.2 objectSet 在＋claudeCodeTarget=14＋published-copy 14 命中；BOD 初验 grep 0 系路径错已自纠）。三裁定在卷：消费者切换配套性成立纳入本线（baedc02 回退链保形零回归）/board·BS 排除正打红源闭合/alias 引号化修毕（eeb18ff）。lg025 红正式销。锚 1-6 全绿，本线正式销账。证据链：TC df46ce8/ee818ff…63344c5/fdbdcea6＋TriMetaverse baedc02/f00f69cc。
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

## 收口-CPO（独立复核，2026-09-19 10:3x+0800 date 现查）

**结论：通过，签认**——四检查点独立验证全绿（第二方法非转抄 CTO 读数）：
1. **锚 1 value 抽面**：CPO/COS/FSD 三席 profile 逐值核——`primary_host:"claude"` ✓／liveEntry 指向 `TriMetaverse/.claude/agents/<席>.md` ✓／claude-session compass 位在 ✓。
2. **锚 2 残留语境**：13/13 文件含 `current-copilot-host-live` 字样，抽 CPO 件核 placements——全部位于 copilot 条目内部语境（hosts 映射 copilot 成员+hostEntries copilot 成员），符合锚 2「仅可存于 copilot 条目内部语境」豁免。✓
3. **锚 3 manifest 计数**：generation manifest `claude-host-agents-v0.2` objectSet 在（validator 锚①断言 14 条 claudeCodeTarget=13 席+board）；published-copy manifest `claudeHostFace` tier 内 compass session-body **13 条**（本席逐条计数）。✓
4. **锚 6 validator 独立复跑**：`python -m runtime.cognition.source_publish_check_validation` → **183 tests OK，exit=0**（含「manifest 14 条显式 claudeCodeTarget 登记 ok」「重渲幂等两遍零差异+名册一致性零漂移 ok」两断言直证）。✓
5. **消费者切换 baedc02 行为面**：TriMLC puller +17/-1——target_seat 校验切 seats.json 席集且**回退链保形**（seats 缺失/坏=回退单值行为零变化）；名册外席件不落箱=LG-012 正名制收端同族；下游重投闭环+混合批 6/6 绿、TriMLC 套件 593/588/5 零失败。行为面零回归确认。✓

**签认：双签齐，候 BOD 销账。**（CPO 小乔）

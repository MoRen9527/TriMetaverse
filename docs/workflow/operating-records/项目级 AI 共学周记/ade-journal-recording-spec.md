# 共学周记记录 ADE 规范

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/项目级 AI 共学周记/ade-journal-recording-spec.md
- syncMode: audit-record
- lastSyncedAt: 2026-08-18

版本：v1.0（2026-08-18 立册；触发事件：W34 周记首次写入违规——跳过规范查找、按任意旧周模板自创结构）

维护：秘书处（当前由 `CEOChiefOfStaff` 代管）

上位规范：[TriCompany ADE 模式规范](../../../../TriCompany/docs/engineering/ade-pattern-spec.md)（ADE 是事件驱动、可恢复、必须收口的 Agent 全生命周期执行协议；本文件把"记入共学周记"动作按该协议具体化）

关联文件：

- 手动入口：`.github/prompts/项目级 AI 共学周记.prompt.md`（固定格式真源）
- 归档规则：[README.md](README.md)
- 自动化待实现：[automation-backlog.md](automation-backlog.md)

## 一、定义与范围

把「对话中出现值得沉淀的大模型能力问题/使用体验/实践经验 → 追加进当周共学周记」这个动作固化为 ADE 模式：**agent 负责判断与撰写，格式与落点由确定性规则约束，写后必须收口回报**。

适用：任何 agent（编排层/总助/员工）收到"记入周记/共学"类指令，或自主判断有可沉淀内容时。

不适用：CEO 直接手写周记（无 agent 参与）；已签发归档版的修订（走 README 版本递增规则）。

## 二、生命周期

对齐 TriCompany ADE 正典（事件 → 登记 → Qualify → Plan → DCE → Close Skill → Close CLI → 终态）：

```text
事件或检测（对话中出现可沉淀内容，或 CEO 指令"记入周记"）
-> 登记（CLI begin）：程序去重提示 + 生成 runId（贯穿全链）
-> Agent Qualify（语义四问）
-> Agent Plan / Skill（格式与落点三查 + 草拟 entry.json 七字段）
-> DCE（CLI qualify 机械资格 → CLI append 固定格式写入）
-> Agent Close Skill（读回追加结果，语义裁决：approved | escalated + note）
-> Close CLI（校验裁决 + run 链完整 + 收口五查 → 持久化终态）
-> 终态：APPROVED | ESCALATED（RETRY = qualify REJECTED 后补字段重来；BLOCKED = 结构性障碍）
```

### 2.1 Qualify（入册资格）

- Q1 可复述：有具体现象/表现，非模糊感受；
- Q2 有产出：有解决方案、workaround 或明确经验教训；
- Q3 可对外：脱敏后可分享（无 API key、私人内容、未确认商业结论）；
- Q4 有共学价值：面向"用 AI 做项目的人"有通用性；纯内部工程台账（commit 索引、排期）不入册，走工程文档。

四问全过 → 进 Plan；有任何一问不确定 → ESCALATED（列理由请 CEO 裁决）。

### 2.2 Plan（格式与落点）

- P1 **必读三件**（顺序不可省）：
  1. `.github/prompts/项目级 AI 共学周记.prompt.md` 的固定格式（条目结构的真源）；
  2. 本目录 [README.md](README.md)（归档边界/版本规则/周期规则）；
  3. **最近一个已存在周**的周记文件（格式漂移以最近周为准——向上找最近，禁止跨多周翻旧模板）。
- P2 落点 = 当前周（active week）目录 `docs/workflow/operating-records/YYYY-Wnn/project-ai-community-weekly-YYYY-Wnn.md`；不存在则按 P1 格式先建草稿（含文档同步元信息 + 记录人/日期行）。
- P3 只追加不重写：新增 `### 2.n` 条目，不动已有条目（CEO 明确要求修订除外）。

### 2.3 DCE（固定写入格式）

每个条目必须使用 prompt 固定结构：

```markdown
### 2.n 简短标题

- 现象：
- 具体表现：
- 解决方案：
- 问题影响：

当前经验：

- 项目经验：
- 模型自查：
```

写入时同步更新文件头的 `lastSyncedAt`。

### 2.4 Agent Close Skill（语义收口，在 Close CLI 之前）

agent 读回追加后的条目，做语义裁决（这是 Close CLI 不能替代的部分）：

- 条目是否准确反映 CEO 输入（无失真、无遗漏关键细节）；
- 措辞是否达到对外分享口径（小白可读、无内部黑话）；
- 有无误伤（修订建议不推翻已签发内容）；

裁决输出：`approved`（通过）或 `escalated`（需 CEO 处理，附原因）+ 一句裁决说明，作为 Close CLI 的输入。

### 2.5 Close CLI（收口五查 + 裁决校验 + 持久化）

- C1 落盘路径在当周目录（不是仓库根/其他周）；
- C2 条目五件结构完整（现象/具体表现/解决方案/问题影响/当前经验双条）；
- C3 文件头元信息与记录人行在且已更新；
- C4 git 提交（或明示"落盘未提交"由编排层补）；
- C5 回报 CEO：文件路径 + 条目编号 + 是否新建草稿。

### 2.6 终态

- `APPENDED`：条目落盘 + 收口五查全过；
- `BLOCKED`：当周文件缺失 → 先建草稿再追加（属于正常路径，建后转 APPENDED）；格式真源缺失（prompt/README 读不到）→ 停手升级；
- `ESCALATED`：入册资格不确定 / 涉及敏感内容边界判断 → CEO 裁决。

## 三、反模式（2026-08-18 实录，立册依据）

- **跳过规范查找**：没读 prompt 固定格式与归档 README，凭记忆直接开写——实际发生：自创"理论小节"结构、塞入内部 commit 索引表。
- **跨周找旧模板**：格式基准应是最近一周（W33），实际抓了 W29——隔了 4 周，错过了格式演进（记录人行、小白版子结构）。
- **内部台账入册**：commit 哈希索引是工程审计信息，不是对外共学内容（违反 Q4）。
- **一次写完整个周记**：规范动作是"逐条追加"；新建草稿也应保持骨架最小（元信息+记录人行+第 2 节标题），内容按条目增量生长。

## 四、执行链路（CLI 已实现）与自动化的关系

完整 ADE 正典链路（确定性执行体：`TriMetaverse/scripts/journal/journal-cli.mjs`）：

```text
事件触发（prompt 手动 / 未来 cron 自动检测）
-> 登记：node journal-cli.mjs begin --title "…"           # 去重提示 + 生成 runId
-> Agent Qualify + Plan Skill：语义四问 + 草拟 entry.json（七字段）
-> DCE：node journal-cli.mjs qualify --entry <json> --run <runId>   # 机械资格：结构+脱敏扫描
        node journal-cli.mjs append  --entry <json> --run <runId>   # 固定格式渲染为下一个 2.n
-> Agent Close Skill：读回追加结果，语义裁决 approved|escalated + note
-> Close CLI：node journal-cli.mjs close --run <runId> --verdict approved --note "…"   # 校验裁决+run 链+五查 → 终态
-> 审计：journal-run-log.jsonl（runId 贯穿 begin→qualify→append→close，ts/verdict/entryNo）
```

- Close CLI 是裁决的**校验者**而非发起者：`--verdict` 只接受 Close Skill 的合法值（approved|escalated），且要求 run 链完整（begin+append 同 runId 在案）；机械查不过时即使 agent 裁 approved 仍 ESCALATED；
- 格式由 CLI 代码保证（JSON 进、固定结构出），不依赖 agent 纪律——DCE 段确定性成立；
- 语义判断（入册价值、脱敏裁决、收口语义裁决）保留在 agent + CEO——智能与确定性分离；
- `init` 子命令建当周草稿骨架（active 周由 OP index 判定）；
- 本规范同时是 automation-backlog 四项自动化（自动建草稿/对话后自动判断追加/周六午前更新/签发提醒）的**计划面**：cron/resident 实现后执行同一套 CLI 与规则，人工与自动化不双轨。

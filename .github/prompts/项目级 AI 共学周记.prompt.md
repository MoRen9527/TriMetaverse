---
name: "项目级 AI 共学周记"
description: "适用场景：项目级 AI 共学周记、记录大模型能力问题、使用体验、解决方案、项目经验、社区分享周记时使用。"
argument-hint: "描述具体现象和问题，解决方案和经验等"
agent: "CEOChiefOfStaff"
tools: [read, search, edit]
---
你现在要执行一次“项目级 AI 共学周记”追加动作。

CEO 当前手动使用方式为：

```text
项目级 AI 共学周记 “描述具体现象和问题，解决方案和经验等”
```

## 优先遵循

在输出或编辑前，优先遵循以下文件：

- [秘书处机制](../../docs/workflow/tricompany-secretariat.md)
- [真实经营记录目录说明](../../docs/workflow/operating-records/README.md)
- [项目级 AI 共学周记归档说明](../../docs/workflow/operating-records/项目级%20AI%20共学周记/README.md)
- [共学周记记录 ADE 规范](../../docs/workflow/operating-records/项目级%20AI%20共学周记/ade-journal-recording-spec.md)

## 执行方式（ADE 正典链路，2026-08-18 起）

完整链路 = 事件触发 → 登记（CLI）→ Agent Qualify/Plan（skill）→ DCE（CLI）→ Agent Close Skill → Close CLI。条目写入必须走确定性 CLI，不再手写 markdown：

1. **登记**（CLI，拿 runId）：

```bash
node scripts/journal/journal-cli.mjs begin --title "<条目标题>"    # 输出 RUN <runId>；同题已存在则 ESCALATED
```

2. **你（agent）负责语义部分**：Qualify 四问（可复述/有产出/可对外/有共学价值），把 CEO 输入整理为 `entry.json`（七字段：`title` / `phenomenon` / `detail` / `solution` / `impact` / `projExp` / `modelSelfCheck`）；

3. **DCE**（CLI，在 TriMetaverse 仓根执行）：

```bash
node scripts/journal/journal-cli.mjs qualify --entry <entry.json 路径> --run <runId>   # 结构+脱敏扫描
node scripts/journal/journal-cli.mjs append  --entry <entry.json 路径> --run <runId>   # 固定格式追加为下一个 2.n
```

4. 当周文件不存在时先 `node scripts/journal/journal-cli.mjs init`；

5. **Close Skill（你，语义裁决）**：读回追加后的条目，判断——是否准确反映 CEO 输入、措辞是否达到对外分享口径、有无误伤；形成裁决 `approved` 或 `escalated` + 一句说明；

6. **Close CLI**（校验你的裁决 + run 链 + 收口五查）：

```bash
node scripts/journal/journal-cli.mjs close --run <runId> --verdict approved --note "<裁决说明>"
```

7. CLI 任一步非零退出码都不得跳过——REJECTED 补字段重来（RETRY），ESCALATED（脱敏命中/裁决 escalated/收口未过）升级 CEO。

## 目标

把 CEO 输入中的具体现象、问题、解决方案和经验，整理成一条可对外分享、可复盘、可继续讨论的周记条目。

该条目必须追加到当前周文件：

```text
docs/workflow/operating-records/YYYY-Wnn/project-ai-community-weekly-YYYY-Wnn.md
```

若当前周文件不存在，先按既有周记格式创建草稿，再追加条目。

## 追加位置

每个问题必须添加在当周文档的：

```markdown
## 2. 本周观察到的大模型能力问题与体验
```

下面，按已有顺序追加为新的 `### 2.n ...` 小节。

本 prompt 可在同一周内多次触发；每次只追加新的条目，不重写已有条目，除非 CEO 明确要求修订。

## 固定格式

每个条目必须使用以下结构：

```markdown
### 2.n 简短标题

- 现象：
  描述发生了什么。
- 具体表现：
  描述模型、工具链或协作流程具体如何出错或表现不佳。
- 解决方案：
  描述本轮如何处理，或当前建议如何处理。
- 问题影响：
  说明这个问题会影响什么，例如真源判断、协作稳定性、发布质量、用户体验或社区学习价值。

当前经验：

- 项目经验：
  写给使用 AI 做项目的人类经验。
- 模型自查：
  写给后续 AI agent 的自查要求或行为约束。
```

## 图片与附件

如果 CEO 提供截图、日志或其他附件：

1. 优先把可保存的附件放入当周文件旁的 `project-ai-community-weekly-YYYY-Wnn.assets/` 目录。
2. 在对应条目的“现象”或“具体表现”下用 Markdown 图片或链接引用。
3. 如果当前宿主无法直接保存附件原始文件，应说明限制，并用可维护的文字、SVG 或引用路径保留关键信息。

## 自动化状态

当前该 prompt 供 CEO 手动使用。

每周开始自动创建、每次对话后自动判断追加、周六 12:00 自动更新、周末签发提醒和归档自动化，尚未实现。

在总助具备 resident / cron / schedule 能力后，例如后续借助 `TriMC` 吸收简版 OpenClaw 能力形成常驻与定时链路，应优先补上自动化。相关待实现功能见：

- [项目级 AI 共学周记自动化待实现功能](../../docs/workflow/operating-records/项目级%20AI%20共学周记/automation-backlog.md)

## 输出要求

完成追加后，回复 CEO：

1. 已写入哪个周记文件。
2. 新增条目的标题和编号。
3. 是否使用了截图或附件。
4. 如自动化仍未实现，提醒当前仍是手动 prompt 入口。

禁止事项：

- 不把敏感信息、API Key、私人聊天内容或未确认商业结论写入对外分享周记。
- 不把周记条目直接升级成正式制度或模块真源。
- 不跳过 CEO 确认直接生成签发归档版。
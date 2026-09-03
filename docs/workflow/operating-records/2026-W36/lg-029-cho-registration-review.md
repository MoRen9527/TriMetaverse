# LG-029 切换窗 — CHO 岗位变更登记对表验收读数（D-13+五件套增量）

- sourceOfTruth: 本件=CHO 对表验收读数（登记面齐备性）；真源=两仓切换窗提交（TriCompany cc28946/e0eabaf/70153f8 + TriMetaverse f164698d/b08f359d/1f50c713）
- syncMode: static
- lastSyncedAt: 2026-09-03T14:34:55Z（22:34 北京）
- 范围：案一 FSD 通信面正名+案二 STE slug 全链（test-engineer→senior-test-engineer，STE 头衔 Senior Test Engineer）；岗位职责面未动（CEO 令口径）

## 一、判定

**骨架齐备、登记面四漏项候补**——slug 全链与验证门全绿（✓ 清单见 §二）；漏项三件 FD/CTO 域+一件 CAO 域（§三），补齐后本对表销账。历史名沿革口径随件出（§四）。

## 二、齐备面（✓ 实锚清单）

1. slug 全链七处：source kit 目录/contract/五件套、binding profile 文件名、publish manifest 三面条目（L209-219）、三 faces（.claude/agents+.github/agents+.claude/hub 均 senior-test-engineer）、生成器 DECLARED 集（host_object_generation.py 7 处）、roster supervises 链——全锚。
2. validators：kit validate senior-test-engineer/full-stack-developer CHO 亲测双 EXIT=0。
3. D-13 正名行在册：FD 全栈开发（小全）/ST 测试（小柯）两行在表（98/97 行）。
4. STE hub session=tracked interim 且带「临时手作件勿作真源」头注——D-16 存量件条款合规形态，入 LG-024 退役队列（原 7 untracked+此件 tracked interim 共 8 件）。
5. 职责面未动=CEO 口径合规（本对表未触职责内容）。
6. 发现面生效实证：本席环境 Agent 类型表 FSD/STE 已替换旧双席（frontmatter name: FSD/STE 实读）。

## 三、漏项清单（候补，四件）

| # | 漏项 | 实锚 | owner |
| --- | --- | --- | --- |
| 1 | 支撑面 payload 未入仓：`employees/senior-test-engineer`、`roles/test-engineer`、`employees/full-stack-developer`、`roles/full-stack-developer` 四目录 untracked——binding 声明 `tracking: tracked` 与盘面矛盾 | TM 全量 status 实勘 | FD（支撑面 commit；CSO/DE 同族四目录一并裁处） |
| 2 | 旧 slug 残目录 `employees/test-engineer/`（untracked）——旧代残留在盘 | 同上 | FD（删或溯源后清）；**注意** `roles/test-engineer/` 系 role workspace id 合法保留（binding 引用），非残留勿删 |
| 3 | binding `ownerRole: "TestEngineer"` 未随名址换代（spawn name 实读=STE） | senior-test-engineer.json L6 vs .claude/agents/senior-test-engineer.md L2 | CTO/FD（生成器 STE 定义 ownerRole 字段换代+再 execute） |
| 4 | D-13 条 4 映射行过时：「FD/ST…↔FullStackDeveloper/**TestEngineer**」应为 STE（SeniorTestEngineer）；且条 4「spawn name 一律不改」已被 CEO 方案 v3 对两席破例——候一行勘误留痕 | engineering-disciplines.md L103 | CAO（入册防双写通道） |

## 四、历史名沿革口径（CHO 裁）

1. **历史名不改写**：旧 handoff JSON/operating records/日记中 `test-engineer`/`FullStackDeveloper` 历史名一律冻结（历史叙事冻结口径），不溯及改写。
2. **映射行承载**：GID/名址沿革注记一行——`test-engineer→senior-test-engineer（LG-029 case-2，2026-09-03，CEO 方案 v3，职责面未动）；FullStackDeveloper 通信正名 FSD、spawn name 随批改（case-1+case-2 连带，破例经 CEO 批）`。
3. **检索口径**：历史记录按旧名查询可达，现役寻址一律 STE/FSD 正名（D-13 双向纪律）；新旧判据=git last-commit+内容指向双核（§四既有规则沿用）。
4. **role-id 分轨注记**：`roles/test-engineer/` 为角色 workspace id（role-id 不随 employee slug 换代），与漏项 2 的 employees 残目录性质不同——建议随沿革行同批注记，防后人误判为漏改。

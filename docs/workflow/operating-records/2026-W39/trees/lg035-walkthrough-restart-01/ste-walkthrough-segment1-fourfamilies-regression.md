# STE 走查门段·段一：四问四族检具 + 冻结合规回归读数（TASK-LG035-WALKTHROUGH-RESTART-01）

- sourceOfTruth: 本件（段一正身；读数全部自产）
- syncMode: segment（段二首启链/段三 CEO 窗清单随后独立交付）
- lastSyncedAt: 2026-09-25T12:06:56Z（北京 20:06，date 现查）
- 执行席: STE 小柯（m-ste）；任务书: `task-charter-lg035-walkthrough-restart-01.md` @ 4717f20d
- 被测: `D:\Code\ai\TriModel` HEAD 6fa5dbc（走查对象 `ui/index.html` 1231 行全文实勘；回归 22/26 测试文件）
- 时限: 20:00 起跑 / 22:00 前交读数——本段 20:0x 交付，**窗内**

## 测试判断

段一三件全绿收口：①概念建模对照 PASS（CEO 定谳命名实体观在实现中语义成立）；②四族检具运转完毕——**7 条非阻塞发现**（术语 5/布局 1/逻辑 1，无阻塞无数据丢失路径）；③回归 **204 测试 / 199 PASS / 0 FAIL / 5 SKIP**，RUN-EXIT=0，全程冻结合规（T0/T1 指纹逐字节一致 + git 面零触）。质量面支持 CEO 测试窗开启，发现均不阻塞。

## 一、四问① 概念建模对照：**PASS**

CEO 定谳「策略=命名实体；切换=选名字非选条目」在实现中逐点核验：

| 检验点 | 证据（ui/index.html） | 判定 |
| --- | --- | --- |
| 策略=命名实体 | 策略表单=名称+目的+引用模型集+引用规则（L205-215）；表格列=名称/模型集/规则数/状态（L202） | ✓ 实体有名字有档案 |
| 切换=选名字 | 「活动策略」区=下拉选策略→「切换至选中策略」（L190-196），无条目级切换面 | ✓ 选名字非选条目 |
| 「活动策略」词汇定稿 | L821 注释明示「当前策略」退役；全文一致用「活动策略」 | ✓ |
| 默认模型无编辑面（v4 派生缓存） | 全文无 tc-default-model/tc-s-default；服务端 PUT 拒直改 default_model（trimmc-card.ts L132-134 第二真源防护） | ✓ 与 D16 退役回归一致 |

## 二、四族读数（7 发现，全部非阻塞）

### 术语族（5）

| # | 级别 | 位置 | 发现 |
| --- | --- | --- | --- |
| 术-1 | 非阻塞·低 | L209/L210/L217 | **内部建造词汇「层2（开放中/全量开放中）」×3 泄入用户面**——LG-035 术语族「结构词汇禁入 UI」直接命中；建议改人话或删括注 |
| 术-2 | 非阻塞·低 | L743 | 保存失败人话漏 HTTP 码：`'保存未成功（' + r.status + '）：'`——自违本文件 S6 规范（L245「用户面零 HTTP 码」）；应走 humanize() |
| 术-3 | 非阻塞·低 | L1176 | 切换成功提示漏内部 id：`'已切换至策略 ' + id`（显示 `st_xxxx` 而非用户所选的策略名） |
| 术-4 | 非阻塞·低 | L597 | 条目删除守卫文案以偏概全：守卫实际覆盖「被模型集或规则引用」（L594），文案只说「正被时段规则使用」——被模型集引用时误导 |
| 术-5 | 非阻塞·低 | L101/L115 | 「还原兜底」钮语义歧义：动作实为「写入兜底配置」，「还原」通读作回退/撤销 |

### 布局族（1）

| # | 级别 | 位置 | 发现 |
| --- | --- | --- | --- |
| 局-1 | 非阻塞·低 | L218 vs L784 | 「生效时段规则」表「操作」列表头，内容实为只读规则名（v4 只读语义复用了旧操作列位）——表头承诺与内容不符。另 L219 静态空态文案「点『添加时段规则』创建」引用不存在的按钮（运行时恒被覆写，仅首帧闪现，L219 属死文案） |

正面核（BOD 23:5x 走查必修验证）：`[hidden]{display:none!important}` 型显隐根治在位（L56-58）✓；眼切换失焦回遮蔽加固在位（L431）✓；无令牌首启禁用链+引导展开在位（L283-289）✓。

### 逻辑双路径族（1 + 2 项降级观察）

| # | 级别 | 发现 |
| --- | --- | --- |
| 逻-1 | 非阻塞·中低 | **模型下拉双填充链**：`fillModelSelect`（服务端 /v1/models 目录，L401）与 `tcFillModelSelect`（前端硬编码 PROVIDER_MODELS 五模型，L643）写同一个 `#tc-e-model`，终态取决于最后触发者。边界后果：条目模型若在硬编码五名之外（服务端目录超集时可行），编辑该条目会静默换选第一项→保存即静默改模型。建议：表单打开时以服务端目录为准或两目录合一 |
| 逻-2 | 观察·低 | 镜像条目 base_url 链已定谳**无损**：服务端 entries_masked 条件展开含 base_url（api/trimmc-card.ts L55），UI 镜像照抄（L1202）、启用翻转与编辑回填均取真实值。注：entries_masked 的 TS 类型注记（L47）不含 base_url——**类型注记滞后于实际形状**，建议补注记防后人按注记误删 |
| 逻-3 | 观察·低 | 从未存 base_url 的条目经 UI 编辑保存后会被预填为厂商默认 base_url（L635 回退）——「未设置」静默变「显式默认」，语义微移 |

## 三、冻结合规回归读数（自产）

**执行方式**（P-5①席位写禁的合规实现）：

- **排除 4 文件**：`policy.gate.e2e / keys.secure.gate / proxy.gate / ui.e2e.gate`——四件均直写仓库根活体文件（policy.json / policies/local.json / trimmc-card.json，快照协议=测试中覆写+事后恢复；keys.secure 更是 rmSync 活体文件）。这正是 W38 16:09 冻结事故同款写根路径，活体 3333 在刷新窗读到测试中态即重演——**本轮排除并列为系统性发现**：gate 族测试基建需按 apply-strategy.test.ts 先例（setPoliciesDirForTest+tmpdir 钉位）沙箱化改造，方能支持「活体运行窗跑全量」。四件在 W38 冻结前全量跑中绿（186/181+1F+2S 留痕）。
- 其余 **22 文件**串行（--test-concurrency=1）跑毕。
- **指纹护栏**：T0（20:01）与 T1（跑后）四文件 sha256 逐字节一致——trimmc-card.json `880181a4…`、policies/local.json `e197e44d…`、policy.json ABSENT、model-transitions.jsonl `8b70db22…`（4131B）→ **零冻结接触**。
- **git 面零触**：跑前跑后 `git status --porcelain` 均 0 行。

**终读数**（TAP 汇总原样）：

```
# tests 204  # suites 52  # pass 199  # fail 0  # cancelled 0  # skipped 5  # todo 0
# duration_ms 40119.5989   RUN-EXIT=0
```

**5 SKIP 逐条归因**（诚实报口径，非静默绿）：

| SKIP | 归因 |
| --- | --- |
| policy backward-compat ×2 | 前置守卫「env-default 场景需无政策文件」——现环境 policies/local.json 在位（活体态），前置不成立，守卫如实跳 |
| routes wired（card 404 分支） | 同理——根 trimmc-card.json 在位（现役卡），404 前置不成立 |
| E9（UI→卡接缝 E2E） | env-gate 族设计跳（需 `TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1`+本机 Chrome，CTO 裁定护栏①显式 SKIP 禁静默绿） |
| E10（跨 reload 持久性 E2E） | 同上 env-gate 设计跳 |

**测试现势性发现（测-1，非阻塞）**：E10 断言对象为「fixed 规则选择」——该概念在 v4 已退役（D15/增补件4②，组合制无冲突态）。即使 env-gate 开启，其断言面已非现役 UI。建议 v4 重构（改为「活动策略选择 save→reload→回显」才对准第四型盲区现役形态）或随之退役并档。

## 四、质量门禁评估

- 段一门禁读数：概念建模 PASS + 四族 7 发现全非阻塞 + 回归 0 FAIL + 冻结零触——**支持 CEO 测试窗开启**。
- 术语族 5 条均为用户面文案修缮（一行级），建议随 CEO 窗发现一并入修缮窗，不阻塞走查推进。
- 覆盖缺口如实报：4 gate 文件（根写红线）本轮未跑；E9/E10 env-gate 未跑；二段将以 GET-only 活体验证+CEO 窗真人全周期检具补真链面。

## 使用依据

- 任务书: `task-charter-lg035-walkthrough-restart-01.md`（4717f20d）；基线 spec: `2026-W38/lg-035-local-ui-spec.md`（frozen 交付窗态）
- 被测源: `TriModel` 6fa5dbc `ui/index.html`（1231 行全文实勘）、`src/api/trimmc-card.ts`（entries_masked/PUT 合并段实勘）
- 回归证据: 本树 `ste-regression-log-20260925.txt`（TAP 全文）、`ste-freeze-fingerprints.txt`（T0/T1+时戳勘正行）
- 写点定性证据: 26 测试文件 writeFileSync/rmSync 根写扫描（本会话留痕；排除 4 件命中行号在卷）

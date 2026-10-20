# PM 席正式化六环验收卷（CHO 毕报·A1 直接转正批）

## 文档同步元信息

- sourceOfTruth: 本卷（operating-records 树卷·一次性毕报件）
- syncMode: record-only
- lastSyncedAt: 2026-10-20 21:37:07 +0800（date 现查原值·写前跑）
- 施工席: CHO（m-cho）
- 令源: CEO 裁语「直接转正」（2026-10-20 21:12 BOD 转令）→ A1 PM 编制三案改裁：免试岗切正式化路径，B 案试岗批重启作废（新窗不设）
- 前卷: 窗读数卷 `pm-trial-window-readout-20261020.md` @431b5558c（维持在档不改）·勘正笔 42b1a42b7

## 六环验收表（逐环实核·签收附验证锚）

| 环 | 内容 | 验证锚 | 态 |
| --- | --- | --- | --- |
| ① source kit | 源侧九件（contract/agent-frontmatter/agent-body/session-body/soul/memory/colleagues/social/归档复合件）TriCompany/source-agents/product-manager/ | commit **c087855**（TriCompany dev·双通道推平 ls-remote 对表绿）；validator 终读数 `validated_employee_source_kit=product-manager` **RC=0**（21:2x 复跑）；parity 门 PM 绿（agent-body 内嵌 fm≡frontmatter 件） | ✅ |
| ② support object | knowledge/roles/product-manager/ + knowledge/employees/product-manager/（README+inbox/wiki/workbench/audit 四区） | wrapper `employee_host_publish --employee product-manager --execute` RC=0（21:30，dry-run 陷阱实证后加 --execute）；落盘 find 实勘 21:37 | ✅ |
| ③ binding | TriCompany/.github/binding-profiles/product-manager.json（bindingProfileId=product-manager-host-binding-v0.1·status/hostStage=current-copilot-host-live·source/support 双 manifest 索引在件） | 头 30 行实读 21:3x；commit **b012da8** | ✅ |
| ④ live discovery | 双宿主面：TriMetaverse/.github/agents/product-manager.agent.md（4723B）+ TriMetaverse/.claude/agents/product-manager.md（4843B），`--publish-agents --agent-execute` 双面（copilot/claude·created→updated 重渲毕 21:33）；fm 头+渲染尾注实勘 | ls -la 实勘 21:37（本卷取证段）；TriMetaverse 本批 commit | ✅ |
| ⑤ manifest | 三 manifest：live publish manifest 72 条 PM 条目（分件 sourceFiles 七键+sessionBody+claudeCodeTarget）＋生成 manifest 14 组 PM objectSet（显式登记·非自动写出）＋support host-object-manifest.json（wrapper 随写·pm=True 值面断言） | json.load 断言三读数全绿；前两者 @**b012da8** | ✅ |
| ⑥ governance 回填 | roster **v1.1.0** 13→14（PM 行：tier=Execution·reportsTo=chief-product-officer·onboardedAt=2026-10-20·status=live·instanceName=小案；CPO supervises 补 product-manager；tiers Execution 6/families 14）＋ D-13 名址表 PM 行（BL 先例：加行+注记·题计数不动·通信面 PM↔spawn 型 ProductManager 直映） | roster json.load 断言（total=14/tiers/families 三断言绿）；@**b012da8** | ✅ |

## 会签与定名

- **CPO 会签：两项全认零改点**（定名「小案」+职责条款对表）——卷 `trees/pm-formalization/cpo-cosign-20261020.md` @ **203cc69b1**（CPO 席自落推平·TriMetaverse sg-server 对表绿）。轻附建议一条（不阻签）：走查打回建议权随正式化带「打回判据锚」（打回级 vs 记录级一行判据·PM 主笔 CPO 共担）——**已登记 PM 席候办**，随首个走查实案迭代，不另开窗。

## 登记面新位速查（m-pm 启动即用）

- live 双面：`TriMetaverse/.github/agents/product-manager.agent.md`（spawn/copilot 面入位）＋ `.claude/agents/product-manager.md`
- 学习腿：`TriCompany-host-assets/knowledge/employees/product-manager/`（四区）
- 名址：正名 PM·实例 m-pm·惯称小案·汇报 CPO 小乔·同侪 FSD 小全/STE 小柯
- 治理面：roster v1.1.0 第 14 行；binding profile product-manager-host-binding-v0.1

## 提需（BOD 面）

**m-pm 会话实例启动候起**：源侧/支撑/binding/live 全环就绪，实例启动为最后一步。照常驻席复活纪律：启动前清 `CLAUDE_CODE_CHILD_SESSION` 环境遗传变量＋设 `FORCE_SESSION_PERSISTENCE=1`（本机席位复活名址缺口家族正形）。启动后首轮自驱动=PM 席向 CPO 报状态条（session-body 启动恢复合同已内嵌）。

## 风险与留痕

- **余红=SDE parity 既有案**（agent-body name='SeniorDeploymentEngineer' vs fm 件='SDE' 名不一致）——§6.1 在档 2026-09-25 案之后续形态，修复归合并/正名族 owner，**非本批引入**、本批零触碰。
- 本批 TriCompany 提交 b012da8 消息内时点占位符未展开（shell 转义滑笔·字面 `$(date)` 非造值）——真时点以 git commit 元数据为准（21:3x），本卷补记；未 amend 因共享仓并行在途笔（hub-ledger-governance.md 非我面在途）。
- 行为边界重申：本卷所记=current Copilot-host live 启用＋TriCompany 源侧交接，非 TriMC 正式宿主切换、非完整授权矩阵完成；PM 无 MVP 排序/PRD 终裁/验收终签/绩效记分/排工排窗权。

## 状态条（M-001）

- date 现查：2026-10-20 21:37:07 +0800（写前跑原值）
- 水位自估：中（A1 收尾段·毕报后回执+提需两步即收官）
- 末次活动时刻：2026-10-20 21:37（本卷取证段 date 现查·transcript mtime 不可得以签发时刻代之并标注）

—— CHO 小源（落款 2026-10-20 21:37:07 +0800·date 现查原值·写前跑）

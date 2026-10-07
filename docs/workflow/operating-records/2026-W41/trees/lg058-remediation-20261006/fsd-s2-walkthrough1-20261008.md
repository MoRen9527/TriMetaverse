# 深测②合一 S2 结构骨架毕报+强制中间走查①卷 · FSD

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/fsd-s2-walkthrough1-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T04:32:26+08:00
- 树节点: FSD S2 施工毕报+走查①机读证迹（CTO 03:36 S2 放行信；细估卷段门原文）
- 状态: S2 完工三门全绿——候走查①流程（报 STE+BOD）后进 S3

## 〇、交付锚

- **TriModel commit `b310c4b`**（dev，独立回滚断点②）：4 文件 +208/-186（ui/index.html +三测试文件跟随）
- 施工域=D:\Code\ai\TriModel\ui\index.html（结构壳）；文案层（定名词/条 8 清洗）未动=归 S3

## 一、S2 载荷逐项（对 CPO 合一终态结构）

| # | 载荷 | 落法 |
| --- | --- | --- |
| 条 2 | 页名砍后缀 | `☁ 模型策略`（「本机过渡位实例」退役，零残留断言在走查①） |
| 批 B 原案 | 页顶连接状态行 | 机器信息区缩并 `tc-conn-line` 一行化（tc-conn/连接档案 id 不变零 JS 改；先连接后可用门禁照旧=boot setDataPanelsDisabled 链未动） |
| 批 B 原案 | 页顶生效读数行 | 新设 `tc-active-line`：`当前生效 · 策略「××」· 时段窗命中 HH:MM–HH:MM → 条目 · 应用于 域标签`；无策略=`当前未启用策略——全部使用系统默认（应用于 …）`；tcHitWindow() 判 now∈[start,end) |
| 条 5 | 三路分流·读数腿 | 原 tcRenderStrategyDetail 重写为 tcRenderActiveLine+tcHitWindow（读数升页顶·去操作化） |
| 条 5 | 三路分流·操作腿 | 策略列表行内操作列：编辑/删除/设为生效（生效行=取消生效+应用到本机）；tc-apply onclick 函数化 applyActiveStrategy(btn)，local_apply_enabled 转 tcLocalApplyEnabled 行内渲染门（晚到补渲染联动在 loadRuntimeInfo） |
| 条 5 | 三路分流·详情腿 | 选中行 `<details>` 展开（原生最简形零动画）：kv 四字段+规则行表（time 窗行/default 全时段/quota 徽标行——原 tc-str-rules 内容下沉） |
| 条 5 锚② | 生效中徽章行内化 | 状态列 `<span class="badge applied">生效中</span>`；「活动中」词汇全站退役 |
| 条 7 | 独立生效时段规则区砍 | tc-wrules/tc-wr-body/tc-wr-empty DOM 删；生效规则展示=行内展开详情；tc-fallback-tip 挪策略列表标题下（id 不变零 JS 改） |
| 附带 | tc-chips 挪区 1 底部 | 模型信息区底部（id 不变零 JS 改）；tcRenderWindowRules 内 chips 冗余双写段一并退役 |
| L2033 | 注释反转 | 「活动策略」词汇退役注记（CPO 锚④随批反转） |

## 二、走查①三门读数（CTO 段门原文三项）

### ① 三块就位（机读 55/55 全绿，jsdom 首启链）

- 四区块直系 h3 序=`模型信息→模型集→规则→策略列表`（数量 4 恰）
- 页顶两行在位：连接状态行（tc-conn 收编）+生效读数行（策略名/域标签/时段窗命中全渲染实证）
- 砍区零残留 14 项全过：tc-strategy-sel/tc-str-switch/tc-str-clear/tc-apply/tc-str-detail/tc-str-rules-body/tc-wrules/tc-wr-body/tc-wr-empty/tc-domain-label/「活动策略」h3/「生效时段规则」h3/「本机过渡位实例」
- 行为自证：生效行=徽章+取消生效+应用到本机；取消生效点击→读数行实时翻转「当前未启用策略」（操作腿↔读数腿联动）
- 走查脚本=一次性证迹（.fade-s2-walkthrough.mjs）已删不入仓；读数全文在会话链

### ② 联席菜单机制原样断言

- 源码符号 12 项全在位：menuSnapshot/menuOriginLabel/faceRefsOf/renderFaceRules/faceEntryRow/bringModelSet/submitFaceEntries/FACE_META/buildMenu/switchView/renderFaceCards/loadFaceCards——零改动
- 行为面：ui-fourplane ②e（溯源标注+规则勾选态+模型集下拉）16/16 绿；ui-e9-seam 联席缝全量内绿

### ③ 批 A 面原样断言（毕报套件口径）

| 锚 | 期 | 实 | |
| --- | --- | --- | --- |
| 无法连接配置服务 | 9 | 9 | ✓ 禁改九处原样 |
| 连接配置 | 9 | 9 | ✓ |
| 策略卡 | 0 | 0 | ✓ |
| 双 nav label | 模型策略+兜底模型 | 在位 | ✓ |
| M 面 · 服务域 | 4 | 4 | ✓ |
| R-HY 8712（组合串） | 2 | 2 | ✓ |
| 河源 | 0 | 0 | ✓ |
| menu-full | （见 §四.1 口径注记） | 11 | 与 S2 前 stash 对照同值=零波及 |

## 三、自测读数（全量四项）

1. `npm run check`（tsc）零错
2. **全量回归 366 tests / 352 pass / 0 fail / 14 skipped**（env-gate 正常 skip）——施工前干净 HEAD（7f7063a）基线有 2 败（§四.2 批 A 既有），本批后**零失败**
3. **GATE 真浏览器 E2E 13/13**（chromium 实跑，含 W5 重锚后）
4. 走查①机读 55/55（§二.①）

## 四、如实边界与注记

1. **menu-full 口径注记**：批 A 毕报「二轮 menu-full=1」系批 A 施工中间窗锚；现值 11（CSS body.menu-full 族），本批 stash 前后对照 11/11 同值=零波及，非本批面。走查①以持平断言代旧锚。
2. **批 A 遗留测试锚清偿 2 处（本批顺手，如实披露）**：ui-fourplane ②e（溯源断言期『来自策略卡·主力集』）/⑦（页名断言期『TriModel 策略卡』『本机过渡位实例』）——**stash 实证干净 HEAD 同败**（批 A 72d3099 改名后测试未随，批 A 施工窗全量应已录），本批顺手清偿：期望值对齐批 A 正名词+S2 终态（⑦ 增退役反向锚定防回退：本机过渡位实例=false、策略卡=false）。零源码改动，纯测试期望值跟批。
3. **测试跟随自证**：ui-boot 本地侧子测/S8.2 两败=本批结构引发（stash 基线 15/15 绿对照），改锚新结构后 15/15 绿——语义骨架保留（runtime-info 驱动/apply POST/hydrate/规则行渲染），仅 DOM 锚换代。
4. **走查脚本假阳性一例自曝**：`querySelectorAll('tbody tr')` 后代选择器使 thead 行借外层表格 tbody 祖先匹配（2 行实表+1 thead 行=3）——选择器口径错误非源码缺陷（outerHTML 实证 det 结构正确），改 `tbody > tr` 直接父子后归真。记入防坑。
5. S2 未动面（S3 载荷原样在位）：四区块 h3 现役文案（模型信息/模型集/规则）、副文过渡态词（过渡期形态·常态只读…）、条 8 技术词（层2 开放中×2/副文）、条 1 padding、四关系词任务语言化（展开详情 kv 暂持现役词：目的/引用模型集/默认模型/引用规则）。
6. 活体验证边界：S2 为 UI 段无服务重启载荷；3333 活体现服 dist=S1 版（UI 走查对 jsdom+真浏览器 E2E 双面，活体 dist 刷新候统一 build+重启窗（S4/S5 前））。

## 五、下一步

走查①报备 STE+BOD（本卷即报备件）→ 进 S3 文案层（条 1 padding+条 2/3/4/6 定名词+条 8 八项清洗，扫描锚=渲染后 DOM 文本面）→ S4 件① UI 接线 → S5 STE 合一走查。

## 使用依据

- CTO 细估卷 75a51dda（S2 段门原文+批 A 双保险+四回滚断点制）；CPO 合一终态卷（结构图+三路分流+条 5/7/8 锚）；批 A 毕报（禁改九处+断言套件口径——含 R-HY 8712 组合串口径回查）；CTO 03:36 S2 放行信；TriModel b310c4b/7f7063a/72d3099；LG-035 UI 渲染门纪律（jsdom 首启链+非作者手测双面）。

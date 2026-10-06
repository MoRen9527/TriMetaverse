# STE 走查卷 · LG-058 整改波 N2/N3/N4/N5（同批非作者走查）

- sourceOfTruth: 本件（STE 非作者走查读数正身；走查门四条照 BOD 派工令 10:2x）
- syncMode: static
- lastSyncedAt: 2026-10-06T12:10+0800（date 现查；v6b 终读数回填毕+P1 复验正式读数成立）
- 走查席: STE 小柯（m-ste；非作者——本波九 commit 作者=FSD，符合「非作者手测」硬门）
- 走查对象: TriModel 七笔 c4d9137(N4)/5b4dedb(N1)/e099329(N3)/46b80b2(N2)/ed01fc2(N5-1)/51b8e39(N5-2)/366eecb(N5-3)+lint 勘补 12caab0；TriRMC 两笔 8249eb7(N1 tier)/99806cf(N5-3 daemon)
- 受理依据: `../lg058-ceo-walkthrough-9items-20261006.md`（8835f58d，CEO 九条原话+BOD 定性表）
- 树单/任务书: 本目录 tree-plan.md + `../task-charter-lg058-remediation-20261006.md`（边界#7=正式读数挂 sg 无人值守流水线）
- 消费口径: FSD 勘正版 lint 读数（TriModel 12caab0 平 sg bare 顶，0bff654f 勘正行；m-fsd 10:4x 知会信同口径）

## 〇、走查结论（先答）

**CONDITIONAL_FAIL 候裁**（裁归 CTO/BOD）：

- **一项 P1 候选 UI 缺陷**：menu-full 左右布局不兑现（§二.1，证据链三层）——CEO 打回 #1「未见实现，未分左右」在整改后代码（366eecb）**视觉实态依旧成立**，且页面文案自称「左侧菜单」与实态矛盾。
- CEO 九条整改锚 N1/N3/N4 全过，N2 演练链沙箱全程走通，N5 三件主体锚达成（§四回对表）。
- 三项观察项（非阻塞）+两项环境注记（§五）。
- 流水线正式读数（走查门②闭环）：**TriModel 全量 330/316 pass/0 fail/14 skip 全绿**；TriRMC 全量 472/462 pass/10 fail（四族终归因零一落 N1-N5 对象域）——v1-v4 作废链+终读数全档 §六。

## 一、走查范围与门

| 门 | 内容 | 结果 |
|---|---|---|
| ① | UI 交付渲染验证门硬门（非作者手测+首启链冒烟+spec 交互级+四族排查：术语/命名/布局/逻辑双路径） | **一项 FAIL 候选**（布局），其余全过 |
| ② | 全量读数独立复跑禁转抄 FSD 读数（既有失败逐族归因） | sanity 独立复跑过；流水线全量在跑（§六） |
| ③ | 值面三查（TriRMC settings.json 落盘值面与卡显一致性；三卡「暂无回写」候办态如实呈报） | 过（§三） |
| ④ | CEO 九条逐条回对（整改是否真答到原话） | §四回对表 |

走查环境：本机沙箱（TriModel 366eecb 工作树+`TRIMODEL_CARDS_DIR`/`TRIMODEL_DATA_DIR` 钉 tmp+端口 3973，playwright 首启链+UI 交互全谱）；沙箱卡 fixture=emptyCard 正形 minimal doc（v2 修正后合规——v1 手写 minimal doc 缺 machine/connection 块系**测试 fixture 不合规**，由此产生的两次 400 已溯源，非 UI 缺陷，见 §五注记 A）。

## 二、走查门①：UI 渲染验证（playwright 活体+代码面）

### 2.1 P1 候选发现：menu-full 左右布局不兑现（CEO #1 整改后仍不成立）

**现象**：宽屏（1037px 视口）menu-full 态下，左侧菜单**从未以左右分栏形态渲染**——实态=竖排菜单块全宽在上+内容在下（上下布局）。页面诚实注却写着「菜单形态：左侧菜单（有实数据卡 4/4）」——**文案与视觉自相矛盾**。

**证据链三层**：

1. **代码面结构错位**（`ui/index.html`）：HTML 里 `<nav id="page-menu">` 是 `<div id="app-layout">` 的**兄弟节点**（nav 在 app-layout 外、同为 body 子节点）；而 CSS `body.menu-full #app-layout { display: flex; gap: 14px }` + `body.menu-full #page-menu { flex-direction: column; flex: 0 0 210px }` 的 flex 容器=`#app-layout`——**nav 不在容器内，`flex: 0 0 210px` 对它无效**，210px 侧栏永不兑现。
2. **活体 DOM 读数**（沙箱 menu-full 态 evaluate）：`bodyClasses="menu-full"`、`menuParent="BODY"`、`layoutParentOfMenu=false`、`menuWidth=948px`（=全内容宽）、`menuRect bottom=340.8` vs `mainRect top=352.8`（上下堆叠）、`layoutChildren=["page-main"]`（容器里只有主区）。
3. **截图**：本目录 `ste-sandbox-evidence-menustacked-20261006.png`（菜单竖排全宽在上、内容区在下）。

**按数判逻辑本身工作正常**：`updateMenuMode`（withData>=4 → menu-full 类）+诚实注文案（「菜单形态：左侧菜单（有实数据卡 4/4）」）都正确触发——**判定对、类切了、CSS 写了，唯独 DOM 宿主错位致布局不兑现**。LG-035 教训族「纸面合格≠实现合格」又一实证形。

**定性建议**：P1 UI 缺陷（候选）。注意归口辨析：CEO #1 的 BOD 定性=「讲解件描述失实」归口 CPO 讲解件勘误（已落 ab1aecc5），**不是 N1-N5 验收锚的直接违反**；但左菜单形态出自 CPO IA 方稿 §4.2 情形 1（UI 代码注释自引「折叠自适应（§4.2 情形 1）」），属 N5 方案承接面的实现走样——N5 验收锚含「CPO 方稿各方案验收条款」。候 CTO 裁：修 DOM 结构（nav 移入 app-layout）或改 CSS 选择器（body 级 flex），工程量小（一处结构/样式调整+ui-fourplane 断言增补）。

### 2.2 首启链冒烟（硬门项）——过

空白首启→连接设置→填 api/admin token→连接→「已连接」→导航 7 项（当前生效/四域卡/策略卡/连接配置）→总览 4 行。零控制台首启错误。

### 2.3 四族排查——术语/命名过，布局一项 FAIL（见 2.1）

- **术语族**：「本卡特有」全 UI 零命中（各卡均「本域特有」）；「直连/中转」零命中；「管事/干活的面」零命中；机器位词零卡名残留（卡名=纯角色名 TriMMC/TriMLC/TriRMC/TriRLC）。
- **命名族**：卡头二级结构=角色名+实例行（「TriRMC · R 面 · 服务域 · 河源 8712」），机器位只在实例行 ✓（方案一）；服务端 FACES registry display=纯角色名（card-faces.ts L29-36）+UI FACE_META 实例行（index.html L332-363）双层一致 ✓。
- **布局族**：2.1 所述 menu-full 不兑现——唯一 FAIL。
- **逻辑双路径族**：有令牌/无令牌两路径（首启无令牌=「未连接」诚实态；有令牌=managed 拉取）；menu 空/非空两路径（策略卡空菜单→条目表单诚实警示「仍可手填，但会标注为菜单外」+「菜单外手填——建议先在策略卡登记」实时提示 ✓）。

### 2.4 spec 交互级手测（N2/N5 全谱活体）

| 交互 | 结果 |
|---|---|
| TriRMC 新增条目（手填路径，菜单外标注） | 过——「GLM-5.3-Flash 自填（菜单外）」入表，卡徽章「未配置→待应用」，成功消息「已保存到卡（daemon 下次拉取落地）」 |
| 条目表五列（含来源列，N3） | 过——条目名/模型/密钥/启用/**来源**；来源值=「暂无回写」（无 daemon 回写时诚实不造数） |
| 密钥掩码 | 过——「****-key」形（防偷窥，值面零出） |
| 第二次写入→自动备份 | 过——备份清单 2 份，时戳命名（20261006T024220Z-29172-1 等） |
| 回滚两击确认+执行 | 过——「回滚到此→确认回滚」两击形（含 5s 防呆窗；超窗自动解除复位，MCP 慢节奏触发属预期设计）；执行后现卡值面恢复 -1 态+回滚前自动备份第 3 份（内容=回滚前现态两条目，对称安全网实证） |
| TriRLC 卡真按钮 | 过——读取模板/读取备份清单双真按钮+本域特有段 |
| TriMMC 卡候建态 | 过——bak 槽=「候建——备份与回滚入口随后续批次开通」（M 面暂缓如实呈现，CEO 03:10 范围修订忠实落地） |
| TriMLC 静态 fb 栏 | 过——零动（树单 N2 边界） |
| 连接配置四域签 | 过——M 服务域/M 本地域/R 服务域/R 本地域同序同构；页脚诚实注（落地文件名语义/env 钉定/密钥禁入）与 BOD 转嘱逐字对齐 |
| 方案三「存」步 | 过——M 服务域添加项 local_port=8710→保存→徽章「未配置→已存未拉」+版本 v1 带时戳；值面对表=卡 local_config `{version:1, updated_at 同时戳, items 同构}` 闭环一致 |
| 方案三「已落生效」第三态 | 过——模拟 daemon PUT status（version_applied=1+write_result=ok）→loadFaceCards 后徽章「已落生效」+落盘结果行「v1 ok → settings.json」直显（connLocalState L1432 派生逻辑活体实证；三态全谱：未配置/已存未拉/已落生效均活体验证，「已拉未落」由单测覆盖） |
| 密钥禁入守卫 | 过——项名 api_key →400「本地配置项「api_key」疑似密钥——密钥禁入本地配置表，各域密钥走域卡条目域内自管」（中文错误原文直出） |

## 三、走查门③：值面三查

1. **TriRMC settings.json 新落点（$TRIRMC_CONFIG_DIR）**：代码面走查过——`local-settings.ts`（99806cf 新件）：trirmcConfigDir()=env 钉定||data、原子写（tmp+rename）、写失败 {ok:false,error} 不推进版本缓存（下轮重试）、拉取失败分支零触碰 settings（最后已知好值）；`readEnv()` 11 键经 settingOrEnv（env 钉定优先）。**落盘值面与卡显一致性**：单测锚=key-cache 18/18 含 plan3 四 it（落地回执 version_applied/write_result/file 与 UI 三态派生对表）；活体沙箱（无 daemon）以代码面+单测为锚，R-HY 真实落盘值面探针=升版窗流水线产出（树单 N1 行验收锚，本卷 §六候注）。
2. **三卡「暂无回写」候办态**：TriRLC/TriMLC/TriMMC 三域卡与连接配置 M 面各签如实显「暂无回写/暂无拉取」——**候办非缺陷**（三 daemon 落地链未实装，FSD 10:4x 知会信+树单 N5 行同口径；不造数、不误报）。
3. **local_config 值面闭环**（沙箱活体）：UI 显 v1/时戳/条目 ↔ 服务端卡文件 `{version:1, updated_at, items:{local_port:"8710"}}` 同构同值 ✓。

## 四、走查门④：CEO 九条逐条回对

| # | CEO 原话要点 | 整改锚 | 回对结果 |
|---|---|---|---|
| 1 | 宽屏左侧七项菜单+右侧内容页；「未见实现，未分左右，布局是上下布局」 | BOD 定性=讲解件失实→CPO 勘误（ab1aecc5 已落）；IA 形态=CPO 方稿 §4.2 | **未真答到**：按数判/类切换/文案已实现，但左右分栏因 DOM 宿主错位**视觉实态仍=上下布局**（§2.1 三层证据）——P1 候选 |
| 2 | 域面控制器=模块非小程序；机器位后缀禁写死；M/R 面真义以白皮书为准 | 方案一（卡名正名+实例行） | **答到**：卡名=纯角色名，实例行承载机器位（「R 面 · 服务域 · 河源 8712」形）；「管事/干活」措辞全链零命中 |
| 3 | 拉取状态四要素（从哪拉/何时拉/成败/层级）页面实时查非编造 | N1 | **答到（代码+单测+活体构造）**：卡显拉取源/上次拉取/配置层级三行+tier1/2/3 降级梯（status 回写携带）；沙箱构造 status 回写活体可见；四卡与 daemon 实态对表=R-HY 升版窗流水线值面探针（候，树单 N1 行） |
| 4 | 「直连/中转」=编造概念，正形=本地配置 vs 远程拉取配置二分；三条目逐一可辨 | N3+CPO 勘误 | **答到**：来源列（tier1/2=远程拉取配置/tier3=本地配置/null=暂无回写）；「直连/中转」两仓全扫零命中（既有「直连」命中均属 Claude 兜底通道语义域非 #4 对象） |
| 5 | 模板切换扩 R 面双卡；测试顺序 R 服务域→R 本地域→M 服务域→M 本地域（后两项 03:10 暂缓） | N2 | **答到（沙箱级）**：rmc/rlc「读取模板」真按钮+templates 端点（空目录诚实空态）；顺序约束=R 面功能走查先于 M 面（本卷 TriRMC 演练在先）；**R-HY 真实卡切换演练=升版窗流水线产出（候）** |
| 6 | 备份与回滚仅 TriMLC 有→先 R 面 | N2 | **答到（沙箱级）**：写卡自动备份（keep=5 实测 2 份生成）+两击确认回滚+回滚前自动备份（值面三验 §2.4）；白名单防穿越/恢复前守卫备份=代码面核过；R-HY 演练候升版窗 |
| 7 | 「本卡特有」→「本域特有」 | N4 | **答到**：全 UI 零残留（四卡+连接配置页走查+grep） |
| 8 | 域卡与策略卡联席（模型/规则配置选择） | N5 方案二 | **答到（主体锚）**：条目引用化（菜单选/手填降高级+菜单外标注）、溯源标注（menuOriginLabel）、反向引用（faceRefsOf）、删除拦截（代码面）、规则适用勾选（悬挂前置 UI 引导+服务端 400 硬门双层）、key 不进策略面（表单密钥字段+「各域密钥走域卡条目域内自管」）；P1 候修①以 UI 空 provider_entries 搭载（server 零改）=树单已注 |
| 9 | 连接配置=四域各自本地配置直改面，改完拉取下发落 settings.json | N5 方案三 | **答到（UI+TriRMC daemon 段）**：四域签同构+五步数据流+诚实三态全谱活体+密钥禁入+值面闭环；TriRMC 落地链（99806cf）代码面+单测锚；TriRLC/TriMLC/TriMMC 三域落地链=候办（如实显暂无回写）；BOD 转嘱（settings.json 系语义非硬造文件名）页脚逐字落实 |

## 五、观察项与非阻塞发现

**A. 测试 fixture 注记（本席自领）**：沙箱 v1 卡 fixture（手写 minimal doc）缺 machine/connection 块→UI 保存 400「machine.name must be a string」。溯源=服务端 merge 用 base.machine 兜底（trimmc-card.ts L127）而 fixture 无 machine——**fixture 不合规非 UI 缺陷**（现役生产卡由 CLI 初始化含完整块）。换 emptyCard 正形后保存链全通。附：humanize 对含 must be/invalid 英文族的服务端错误降级为泛化文案（「操作未成功」）——既有行为非本波新增，记录备查（诊断性略降，中文错误原文可直出）。

**B. Q1「效」语义提前（观察项）**：readEnv() 仅 boot 调用一次（TriRMC src/index.ts:5）→11 键全 boot 型——「已落生效」第三态对 boot 型键的实际语义=「已落、重启后效」。升版流水线含 restart 步即效（CPO 验收锚=落盘值面，门已满足）；建议后批：三态徽章对 boot 型键注记「重启生效」或按键型分列（候 CPO 定）。

**C. Q2 清空语义缺口（观察项）**：local_config 显式 null=服务端清空卡面，但 daemon landLocalConfig(null)=跳过落地→daemon 侧 settings.json 永守旧值且版本缓存不推进——「卡面已清、机器未清」的分叉态无 UI 提示。CPO 方稿未定义清空语义。非阻塞，候 CPO 补定义。

**D. 连接配置页切签不重拉（观察项）**：切域签只重渲染缓存（faceState），daemon 侧回写后需重载卡数据才见新态——建议切签时轻量重拉或注记「数据为连接时快照」。

**E. 手填与官方目录白名单衔接（观察项）**：模型手填受服务端恰五名目录硬校验（LG-035 既有，非本波新增）——手填目录外模型 400+泛化文案不告知合法集合；方案二手填语义=「菜单外但目录内」。候 CPO 权衡：手填失败文案附目录列表。

## 六、全量读数（走查门②；流水线产出区）

### 6.1 本席本地 sanity 独立复跑（非转抄）

- TriModel：ui-fourplane+config-cards 两文件 **54/54 pass / 0 fail**（366eecb 工作树）——与 FSD 自报同向。
- TriRMC：key-cache **18/18 pass / 0 fail**（99806cf 工作树，含 plan3 四 it）。
- 消费口径：FSD lint 勘正版（旧「lint 零增」系假读数已勘正；真增量 +1 error 已修 12caab0 归基线；TriModel lint 现势=config-cards.test.ts 1e（L352 既有）/ui-fourplane 13e（既有）/其余目标文件零增；warnings 两家族性读数非真悬垂）。

### 6.2 sg 无人值守流水线（边界#7 正式读数）

- 挂单前提（TriMMC executor 活体断言双证）：①healthz ok=true/cron enabled/jobCount=9/degraded=false/consecutiveFailures=0（8712）；②executor 实弹探针=临时 at-job POST→**值面痕迹文件真实生成**（「调度活执行停」家族缺陷的对症验证：非仅 nextRun 滚动）→DELETE 清场。token 全程远端变量零出机。
- **v1 作废注记（本席自领）**：本席 v1 脚本错用 `npx vitest run`——TriModel 测试框架正形=`npm test`（node --import tsx --test）；且 sg node18.20.8 与依赖链（EBADENGINE tricode 需 node20+；npx 临时拉 vitest@3.2.7 的 jsdom 依赖链 CJS/ESM 不兼容）不合→33 文件环境面全灭（「no tests」级，非代码失败读数，不入质量结论）。
- **v2 作废注记（本席自领）**：v2 改正形跑法（node22.23.3+npm test，npmci exit=0）后 TriModel 读数 102 pass/21 fail/19 cancelled/14 skip——逐族勘定=环境级根因**兄弟仓依赖缺源**：`@trimetaverse/tricode: file:../TriCode` 系 file: 协议指兄弟仓（本地为 node_modules 符号链接），sg /tmp 独立 clone 树无 ../TriCode 源→ERR_MODULE_NOT_FOUND 全族散布（21 fail 全含 tricode 引用链，非代码失败）；TriRMC 依赖面更宽（file:../TriCode+../TriCompany/packages/agent-core+../TriModel）。
- **v3 读数（全兄弟位 clone：TriCode/TriCompany/TriModel+node22+npm test；基线 TM=12caab0/RMC=8249eb7）——非正式，作废归因**：TriModel 102 pass/21 fail（错误=`Cannot find module .../tricode/dist/trimodel-cli/index.js`）；TriRMC 268 pass/16 fail（`.../trimodel/dist/src/index.js`+`.../agent-core/dist/index.js` 同族）。逐族勘定=**bare clone 无 dist/ 构建产物**（file: 依赖链消费兄弟仓 dist；本地 dev 树有构建产物故无此象）。tests 总数 123/284 亦系 import 崩溃文件计零的残数。v3 结论：确立归因方向，读数不入质量结论。
- **v4 读数（三兄弟位补 build：TriCode ✓/TriModel ✓/agent-core exit=2；TM=12caab0/RMC=8249eb7/node22.23.3）**：
  - TriModel 全量：**330 tests / 300 pass / 1 fail / 15 cancelled / 14 skipped**（suite exit=1）。
  - TriRMC 全量：**472 tests / 462 pass / 10 fail / 0 skip**（suite exit=1）。
  - **逐族归因（TriModel 1 fail+15 cancelled）**：①GATE L3 E2E suite hookFailed=TriRLC 兄弟缺源（`key-cache.ts not found in TriRLC/TriLC siblings (/tmp) — set TRIRLC_HOME to pin`，测试自述 pin 语义）——**流水线环境依赖型**非代码失败；15 cancelled=该 suite 内 serial 子测试随 hook 失败连坐（anchor③/P4/P3/T1/T8/L3-R1 等 15 项真链路 E2E 子测试，名单全列在案）。②GATE L1 内 U11 单子测试 fail：期待 `deepseek-v4-pro` 实得 `GLM-5.3`——归因两候选（fleet 家目录持久配置被 fallback 链读入／父链 env 遗传），**v5 HOME+env 双清场对表坐实**。
  - **逐族归因（TriRMC 10 fail=四族）**：①E2E 真模型族×4（60-63）：日志自证 `TRIRMC_TRIMODEL_API_URL 未设——卡面 tier1 关闭`+上游回显 `DeepSeek API error 401 ... api key: ****f738 is invalid`——**无凭据环境型**（值面零出机纪律下流水线不可绿，非代码回归）。②ctx.cwd A-TriMC×2（33/34，子测试 3 项：shell_exec args.cwd/ctx.cwd/process.cwd 语义）：与 agent-core build exit=2 同窗——`tsc: Cannot find module 'trimodel'`×5 系**build 序缺陷**（agent-core 的 trimodel 类型解析早于 TriModel sibling build；v5 已改序 TriCode→TriModel→agent-core）。③LG-017 闸3 tag 单子测试（64 内：`MoRen 建 v* 过+删 tag 拒 tag_protected`）。④Employee Registry 单子测试（82 内：`loads 14 employees from the v3 contract source`）——对表实勘：TriCompany bare 顶 source-agents=**16 目录（13 员工+board/business-strategy/registries 三非员工）**，测试期待值「14」与现势跨仓版本耦合候选；③④两族 v5 对表读数定「流水线固有/跨仓版本差」定性。
  - 附记：mc-store `path undefined`（`env.mcDbPath`=TRIRMC_MC_DB_PATH 未设，env.ts L47 默认 configDir 兜底未生效于无 configDir 场景）随①族环境型，v5 已设流水线基座值。
- **v5 终读数（清场版：build 序修正+TriRLC 闭环+父链 env 清场+HOME 隔离；TC=a3893ba/TM_SIB=TM=12caab0/RLC=5481f4f/RMC=8249eb7/node22.23.3；清场键 13 枚留痕含 `TRIMODEL_DEFAULT_MODEL`）**：
  - **TriModel 全量：330 tests / 316 pass / 0 fail / 0 cancelled / 14 skipped，exit=0——全绿**。v4 的 1 fail+15 cancelled 全收敛，归因双向坐实：U11 GLM-5.3=**父链 env 遗传**（TriMMC executor environ 含 TRIMODEL_DEFAULT_MODEL 直灌测试进程 fallback 链；清场后即绿）非代码回归；GATE L3 15 连坐=TriRLC 兄弟缺源（TRIRLC_HOME pin 后全绿）。本波 TriModel 对象域（config-cards/ui-fourplane/key-cache/card-faces 等）在正式流水线读数 0 fail。
  - TriRMC 全量：472 tests / 462 pass / **10 fail**（同 v4 名单稳定复现）/ 0 skip——**终归因四族，零一落 N1-N5 对象域**：
    | 族 | 项 | 机理（子测试 error 实锚） | 定性 |
    |---|---|---|---|
    | ① E2E 真模型 | 60-63 | `TRIRMC_TRIMODEL_API_URL 未设`+上游 401（回显尾指纹 ****f738） | 无凭据环境型——值面零出机纪律下流水线固有不可绿，非回归 |
    | ② ctx.cwd A-TriMC | 33/34（3 子测试） | `stdout=''`——shell_exec 执行层空输出非断言逻辑；v4/v5 稳定复现；build 序修后（ac_build_exit=0）仍 fail=v4 build 序假设证伪 | 流水线执行环境族（sg 树 shell 依赖候选），非 N1-N5 对象域，候 FSD 本地同版对表定性既有 |
    | ③ LG-017 闸3 tag | 64（1 子测试） | git 建 tag exit `1 !== 0`；v4/v5 稳定 | sg 机 git 环境候选，非 N1-N5 对象域，同上候对表 |
    | ④ Employee Registry | 82（1 子测试） | `expected 14, got 15`——TriCompany v3 contract 源实载 15 条 vs TriRMC@8249eb7 测试硬编码期待 14 | **跨仓硬编码漂移**（TriCompany 席位源增条后 TriRMC 测试期待值未跟）——真测试腐化候选但非本波对象，候 TriRMC 测试维护波+CTO 知情 |
  - N2/N5 对象域 TriRMC 套件（config-cards/ui-fourplane/key-cache/sanity 56/56）全绿——本波对象域质量面成立。
  - 附记：v5 build 序修正（TriModel 先于 agent-core）后 `ac_build_exit=0`——该修正对流水线基座成立（虽非②族根因）。
- **v6 事故笔（勘误自领）**：v6 job 6c738670 于 2026-10-06T03:34:33Z 执行即崩——exit 126「`/tmp/ste-lg058-pipeline-v6.sh: Permission denied`」，8ms 终态，零读数产出。根因=本席部署 v6.sh 漏 `chmod +x`（对照 v5 脚本 `-rwxr-xr-x` 取证）；本席「v6 在跑」主张系未活体现探的推定=违活体优先诊断法，勘误入档（BOD 12:06 裁回采认记账）。处置：`chmod a+x`+`bash -n` 过→照原 payload 重提 **v6b d967e1e9**（12:03:43+0800 executor 拾取，实证 running+fleet 属主）。
- **v6b 终读数（P1 复验正式读数；45757bd+99806cf 双新顶；date 2026-10-06T04:0xZ 毕，duration 135376ms 与 v5 141358ms 同量级正形）**：
  - 顶确认：**TC=a3893ba / TM_SIB=TM=45757bd / RLC=5481f4f / RMC=99806cf** / node22.23.3——P1 修复顶+TriRMC 平 bare 顶双兑现（§6.3 候补线闭合）。
  - **TriModel 全量：331 tests / 317 pass / 0 fail / 0 cancelled / 14 skipped，exit=0——全绿**（v5=330/316/0/14；+1 测试且过=45757bd 新顶增量，P1 双断言门禁不破全绿）。
  - TriRMC 全量：472 tests / 462 pass / 10 fail / 0 skip——**与 v5 逐行同谱零漂移**：not-ok 实名行 8 行四族不变（33/34 族②、60-63 族①、64 族③、82 族④），定性沿 v5 口径（TAP `# fail 10` 与实名行 8 的差=子测试计入既存口径，v5 同谱非 v6b 新异）。**对象域（N1-N5）零失败**。
  - 判读：**v6b 绿（BOD 11:56 放行闸过）**——对象域零失败+失败全归因非对象域+双新顶确认，P1 复验正式读数成立。

### 6.3 版本差标注（工作接手规则）

- TriModel：bare dev 顶=12caab0 ✓（七笔整改+lint 勘补全在）。
- TriRLC：sg bare 顶=5481f4f（v5 GATE 族 TRIRLC_HOME pin 消费源；GATE L3 对该版本全绿=锚面读数有效）。
- **TriRMC：sg bare dev 顶=8249eb7，缺 99806cf（版本差 1 笔）**——FSD 平 bare 时序（树单 N5 行两笔候升版窗同流）；本卷 TriRMC 流水线段以 8249eb7 为基跑（读数标注基线），99806cf 段读数以本席本地独立复跑 18/18 附卷，正式流水线读数候 FSD 平 bare 后补跑。推笔归 FSD/升版窗，本席不撞部署面。
  - **候补兑现（v6b，2026-10-06 12:05）**：RMC_TOP=99806cf 平 bare 顶已由 FSD 落位，v6b 正式流水线读数即 99806cf 顶全量（472/462/10 四族同谱）——本条版本差闭合，§6.2 v6b 段为正读数。

## 七、质量门禁评估（三分法）

- **N1/N3/N4**：PASS（代码+单测+活体/全扫锚齐；N1 四卡对表候升版窗值面探针，标注不阻塞代码面收口）。
- **N2**：CONDITIONAL_PASS（沙箱演练链全通+真按钮/两击确认/keep=5 值面三验；R-HY 生产演练=升版窗流水线产出候——树单既定验收形态）。
- **N5**：CONDITIONAL_PASS 含 **一项 P1 候选**（§2.1 布局不兑现，候 CTO 裁修复口径）+观察项 B/C/D/E。
- **总裁**：**CONDITIONAL_FAIL 候裁**——P1 候选若裁必修，则 N5 回炉一点（工程量小）；九条整改锚主体已答到，候 BOD 复验+CTO 裁 P1 归口与修窗。
- **流水线终读数锚（走查门②闭环）**：TriModel 全量 330/316 pass/0 fail/14 skip 全绿；TriRMC 全量 472/462 pass/10 fail——10 fail 四族终归因零一落 N1-N5 对象域（无凭据环境型×4/流水线执行环境族×2/sg git 环境候选×1/跨仓硬编码漂移×1 套件），本波对象域套件全绿。TriRMC 10 fail 中族④（Employee Registry 14→15 漂移）系真测试腐化候选，候 CTO 知情+TriRMC 测试维护波另立，不阻塞本波收口判读。

### 七.1 候复验清单（P1 裁定落卷；CTO 快核 b6dea60a，2026-10-06 11:2x 回执）

- **裁定**：案一=nav 移入 `#app-layout` 容器内（首子节点，置于 `#page-main` 前），CSS/JS 零改；案二（body 级 flex）否决——body 直子节点含 conn-settings 面板，body 级 flex 拖其入 flex 流，侵入面反大。
- **本席单点复验清单（FSD 案一施工毕后启，非作者同沙箱形）**：
  1. 结构断言：`nav.parentElement === #app-layout`（ui-fourplane 增补①）。
  2. 几何断言：宽视口 menu-full 态 `menuRect.right <= mainRect.left`（ui-fourplane 增补②；**几何才是 CEO #1「分左右」真回归门**——结构对齐不保证视觉兑现，本席 §2.1 三层证据即结构在场而视觉不兑现的实例）。
  3. 活体走查：playwright menu-full 切换→左右分栏视觉实态+四族复查（布局族）+截图附卷。
  4. 可选微整核验（非阻塞）：menu-full 态 nav `margin:0`。
  5. 回归面：menu 收起态/默认态零涟漪（#app-layout 无基础规则，CTO 依据①的对表复核）。
- 复验毕回执 BOD 终裁（流程：FSD 施工→STE 单点复验→BOD 终裁→CEO 终验位）。

### 七.2 P1 单点复验读数（2026-10-06 11:3x 本席执行；FSD 施工=TriModel 45757bd，本机工作树对表干净在位）

| 项 | 结果 | 读数实锚 |
|---|---|---|
| ①结构断言 | **PASS** | `nav.parentElement===#app-layout` 且 `firstElementChild===nav`；layout.children=[page-menu,page-main]（真浏览器 DOM 实测） |
| ②几何断言（真回归门） | **PASS** | menu-full 态 nav={left:210,right:420,width:210}（flex 0 0 210px 生效）main={left:434}——**nav.right 420 ≤ main.left 434（gap 14 与 FSD 桩锚值同源吻合）**，顶对齐 113.6=113.6；撤态再切回复测仍 true（双向稳定）。**真浏览器 getBoundingClientRect 实测非桩基**——FSD jsdom 桩基几何（无布局引擎）的盲区由本项真值补位，两层合拢 |
| ③活体走查+截图 | **PASS** | 左右分栏视觉真兑现（左 210px 侧栏垂直菜单+右主区两卡正常渲染）；令牌输入框掩码显示零明文泄露。截图=ste-p1-reverify-menufull-20261006.png |
| ④可选微整 margin:0 | 未做（非阻塞） | nav 实测 margin=`0px 0px 12px`（底 12px 残留；CTO 标可选非阻塞，留 FSD 顺手项） |
| ⑤默认态零涟漪 | **PASS** | 撤 menu-full 后 main 在 nav 下方（顶部细条形恢复）+7 菜单钮单行横排不折行+页面零横向溢出 |
| 切态路径等价性 | PASS | JS 真实路径=index.html L1129 `classList.toggle('menu-full', withData>=4)` 数据驱动自动切；本复验 classList 直加同类名同源 CSS，断言有效性成立 |
| FSD 双断言 it（⑤b） | 消费认收 | 桩基几何判别力=事故注入自证（nav.remove()→门必不成立）；其 jsdom 恒零矩形局限已由本表②项真浏览器几何补位——两层桩/真合拢，spec 侧桩基形态注记 FSD 已带 |

**复验结论：P1 修复 PASS（五项四过一非阻塞未做）**——CEO #1「分左右」视觉实态兑现，文案与视觉自洽回归。流水线正式读数（45757bd+99806cf 双新顶全量）=v6b 毕已回填 §6.2（TriModel 331/317/0 全绿+TriRMC 四族同谱对象域零失败）——**BOD 11:56 放行闸判读=绿**，v6 事故笔（126 崩零读数）与 v6b 重提（d967e1e9）如实并档；清场 7 笔按 BOD 11:52 备料令执行，毕后回执 COO 触发升版。

**附注（收信时序对表）**：FSD 知会信状态条落款 11:40 晚于本席收信 hook 现戳 11:29:38+0800=时序倒挂——按「自报时点晚于收信方现戳=必错即认」惯例由 FSD 侧认勘，本卷以 hook 现戳为本段时序锚，不影响读数面。

## 八、使用依据

- 受理依据/树单/任务书/CPO 方稿/九条件：本目录与 W41 目录四件（commit 8835f58d/015d2884/a5a00e7a/9f86ff34）
- 代码面：TriModel 七笔+12caab0（本机工作树=366eecb+局部文件对照 bare dev）；TriRMC 8249eb7+99806cf（本机工作树）
- 活体面：本机沙箱（TriModel 366eecb，端口 3973，env 钉 tmp 卡目录；playwright DOM 读数+截图 1 张）
- 流水线面：sg TriMMC 8712 executor at-job 族（v1 跑法错作废/v2 兄弟缺源作废/v3 dist 缺作废/v4 归因锚读数/v5 清场终读数；executor 双证探针记录 §6.2）
- 信令面：m-fsd 10:4x 勘正版口径知会信；BOD 10:2x 派工令
- 纪律面：D-04 时刻制/M-001 状态条/D-23 排程窗（本窗走查无排程冲突）；值面零出机（token 零出机、密钥掩码面验证）

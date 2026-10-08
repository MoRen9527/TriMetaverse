# STE S5 干跑卷 · 预演两批 70 断言全绿+正跑防坑六条沉淀

- sourceOfTruth: 本卷（trees/lg058-remediation-20261006/ste-s5-dryrun-20261008.md）
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T01:44:00Z（09:44+08 周四，date 现查；01:44 §七 第三笔——前两笔 01:38Z/01:41Z 均被并行收编踩失，上下文重放三写）
- 树节点: STE S5 预载干跑（候窗期预演；脚本仓外 %TEMP%/ste-s5-dryrun/，jsdom 经 TriModel node_modules 解析）
- 状态: 干跑毕——**脚本自测非 S5 读数**；S5 正跑 19:00 窗照全锚清单实测

## 〇、一句话结论

S5 前置干跑两批（负向+静态面 44 断言/四锚交互面 26 断言）**70/70 全绿**——S4b 后源面在 jsdom 层预演通过，S5 正跑脚本布景与断言面全部打通；干跑沉淀**正跑防坑六条**（布景结构三坑+渲染面分面+observer 断言法+双载入竞态）与**一项 transient 行为观察**（D- warn 可见窗 24ms 级，系重渲架构固有行为非缺陷，S5 D- 锚口径随之定稿）。

## 一、干跑读数（两批）

**第一批 dryrun1（负向+静态面）44/44**，断言面：
- 冷态零数据拉取（dataCalls=0）+保存链（Bearer 头/cards×4 GET+verify GET）✓
- 四域签四签在位（mmc/mlc/rmc/rlc）+全 applied 布景下四域卡面「已落 · 重启生效」×4（B-1 badge 路径）✓
- 切模型策略页：页名 h2=「☁ 模型策略」+「本机过渡位实例」零 ✓
- 四区块 h3 终名序恰四且有序：模型条目信息→可切换模型集→模型切换规则→策略列表（probe 全列佐证，idx=[32,34,36,38]）✓
- 七负向项全 DOM=0：模型组合/生效时段规则/本机过渡位实例/素材/模型清单/已添加模型条目/层2（全量）开放中 ✓
- 条 8 技术词扫描（可见面）：层1/层2/过渡位/实例/引用/只读/全量开放=v0+v4（豁免 deepseek-v4-pro 后）=0 ✓
- 五组词 before（新增模型集/新增规则/新增策略）=0+after（新建模型集/新建模型切换规则/新建策略/可切换模型集）逐词在场 ✓
- 三型新串在场+旧分类词（额度/依序转/三型）=0 ✓
- 批 A 渲染面：策略卡=0/河源=0；源码串面对照 S3 基线保持：无法连接配置服务=9/连接配置=9（S4b 六刀未动批 A 串面，预期一致）✓

**第二批 dryrun2（四锚交互面）26/26**，断言面：
- **B**：verify 四态异布景（applied/stored-not-pulled/pulled-not-applied/apply-failed+denied degraded）→逐卡 phase 徽章=「已落 · 重启生效」/「已存未拉」（无重启生效）/'已拉未落'/'落盘失败 ·拉取链异常' 四态各正 ✓；页顶缀逐 face 列「TriMLC 已存未拉 · TriRLC 落盘失败+拉取链异常」✓；非全 applied 布景渲染面无全落单词缀 ✓
- **C**：清单外键卡→移除→保存→connMsg 注记全文「已清 · 待落地（机器侧现持旧值）——清除落地链修复前，机器侧将继续持旧值运行」+hidden=false（置后修锚：不被同源重渲冲掉）✓
- **D**：切签一次=该域 cards GET +1（非轮询）+成功路径零失败提示+重拉数据面更新（k1 行在）✓；**D- 负例**：GET 500→warn「重拉未成（保留当前显示）——可稍后重试或刷新页面」出现过（observer 三条 mutation 铁证）+卡面数据保留不空屏（phase 在）✓
- **E**：手填入口（data-face-add-entry→__manual__ 手填 option 在）→foo-model 提交→PUT 400→UI 透传「provider_entries[foo] 模型「foo-model」不在目录内。可用模型：…」+五名逐名在场+hidden=false+非泛化兜底（humanize 黑名单四个词中文稿天然避开=透传成立前提，humanize L583 实读佐证）✓

## 二、正跑防坑六条（干跑实战产出，S5 脚本直接采纳）

1. **tcCard.status 在 card 内部**：loadTrimmc 的 `tcCard = r.body.card`——status={state,at} 系 card 文档字段（trimmc-card.ts L131），布景放 body 顶层必炸（tcBadge `tcCard.status.state` TypeError，干跑一跑即中）。
2. **四域签选择器=`[data-cd-tab]`**：#conn-domain-tabs 内是 `<button data-cd-tab="f">`（L1677 模板），无 .cd-tab class——FSD 自纠② data-cd-tab 族同源，S5 选择器照此。
3. **页名 h2 按内容过滤**：首个 h2=「当前生效」（L109）非页名；页名=含「模型策略」的 h2（L195「☁ 模型策略+tc-badge 徽章」）。
4. **渲染面文本必须排 script**：tcApplyStateSuffix 的 `return ' · 已落 · 重启生效'` 系源码串（L2299），body.textContent 直读会命中 script 内联码——源码串面/渲染面分面纪律在 B 场景亲踩（probe 宿主链=SCRIPT 铁证）。渲染面断言一律 clone+去 script/style。
5. **D- warn 断言用 observer 法**：MutationObserver 记录与 getElementById 读数在动态重建场景**分裂**（warn 写入被 observer 三条记录铁证 at22ms，getElementById 24ms 可见窗读不到，终值=模板空态）——断言不依赖该分裂面，S5 正跑 D- 锚=observer 记录出现过 warn。
6. **conn-save 双载入竞态**：conn-save 链 loadFaceCards 双发（17ms 级 second-load 尾部重渲竞态实证）——被测路径前置静默等待隔离，防后到重渲冲 msg 造成假阴性。

## 三、transient 行为观察（非缺陷，如实注记候 CTO 知会）

- **D- 失败 warn 可见窗 24ms 级**（at22 写入→at46 被后续 panes 重渲冲掉，全量时戳 mutation 实证）——冲掉者=重渲架构固有行为（innerHTML 整体重建策略，与 FSD 自纠①「注记置后修」同族根源），非 S4b 新引入。
- **锚面回对**：CPO D 锚=「切域签轻量重拉该域卡数据一次」+CTO 技术边界「失败不空屏：保留现显示+轻提示」——**数据保留 ✓（不空屏核心达标）+轻提示出现过 ✓（如实告知达成）**；提示持续时长不在锚面。S5 D- 口径按「出现过（observer）」执行，不按「恒存」。
- 如 CTO 判「提示应存活至下次交互」，属独立改进项（connMsg 与重渲的跨函数竞态），不入 S5 阻塞面。
- **CTO 裁收讫（06:28+08 信）**：S5 锚面按本卷口径执行——数据保留✓+提示「出现过」（observer 口径）即达锚，提示时长不在锚面（CPO 锚=切签轻量重拉，失败提示系技术边界附加非 CPO 锚面）；「提示应存活至下次交互」裁独立改进项挂候办（FSD 候办清单由 CTO 转；修面=reloadFaceCard 失败分支提示置后或独立容器；排程=与 C 注记退役同维护波 10-09 后），不阻塞 S5。本卷 §三 预判与裁一致，候裁面闭。

## 四、S5 正跑口径增量（并入全锚清单）

- 开场 dist 锚=第二轮窗新指纹三件（FSD 卷 7a992de4：dist/ui/index.html=A77D67AE64CDF227/trimmc-card.js=A9991C020DF51C09/policy.js=BC23BDF19004FA92，选型=S4b 变更面；第一轮 keys/verify 三件自然过期）。
- FSD P2 活体探针计数（B=5/C=2/D=3）与我源面 grep 计数（B=3 处/C=1/D=2）口径差——活体渲染面 vs 源码静态面分面所致，S5 开场活体对表时对齐口径，不预判。
- served 面 GET /ui 非 /；/health 逐 provider 探活 3-5s 系语义非卡顿；healthz 系笔误正身=/health（FSD 坑位预知收讫）。
- GATE 双口径（57 subtest 摊平/13 顶层 it）独立复跑各报，候 CTO 裁口径。
- 干跑脚本（dryrun1.mjs/dryrun2.mjs）存 %TEMP%/ste-s5-dryrun/ 仓外，S5 正跑升格为正式 jsdom 独立脚本（先写后报落卷）。

## 五、关联信件收讫

- m-fsd 第二轮窗闭合信（06:0x）：指纹三件/活体 pid 32756（06:00 冷起）/P2 四锚活体已探——收讫，S5 开场锚替换确认。
- **m-fsd 口径差归因信（06:3x）**：①B 5vs3=FSD 5 含注释 2 处（L1568-1570 施工注+L2298 同族注），我 3=代码串字面量命中——分面=注释入不入计；②C 2vs1=FSD 两 pattern 拆串各计（「已清 · 待落地」/「机器侧现持旧值」），我 1=全串——同源同处；③D 3vs2=FSD 重复计数自认，集合基数=2 准我方读数——三处差全为计数口径零实体矛盾，S5 对表源面口径=**3/1/2**。
- **m-cto 裁复信（06:28）**：①D- 口径裁（见 §三 收讫注记）②S5 开场活体对表按「渲染面 N+源码面 M」分列归因不硬凑单数（FSD 活体含 JS 模板面 vs 我 grep 渲染面排 script）③三条件现势勘新——S4b 认收✓（05:58 令）+第二轮窗认收✓（06:04 令），**三条件全齐，只候 19:00 窗**（本卷头部状态行信面滞后，以此勘新为准）。
- 干跑期间 M-SG NOTIFY persisted 包（107.2KB）仍系历史信箱回放（首条自标勿处理），按试信纪律不展开。

## 六、S5 锚面切换知会收讫（BOD 09:3x 信，现势覆盖 §四 部分口径）

- **CEO 09:30 纠偏**：深测②交付面=R-HY（此前只上本机，R-HY 还在旧版）——FSD 正执行部署升级链（间隙修→推 origin→R-HY build→restart trimodel→探针）。
- **我侧两项联动（BOD 知会）**：①S5 19:00 走查活体=**R-HY 实例**（本机 3333 验证绿后退役），开场快照锚候 FSD 部署毕从 R-HY 取；②预载四锚实勘对象面同步切 R-HY 源面（源侧同仓无差，部署后活体以 R-HY 为准）。BOD 本机 playwright 预验截图仍有效作预验参考，终验以 R-HY 为锚。
- **本席执行口径随切（§四 相应项以此为准）**：
  1. 开场 dist 锚=**候 FSD 部署毕 R-HY 新指纹**——本卷 §四 第二轮窗指纹三件（A77D67AE64CDF227/A9991C020DF51C09/BC23BDF19004FA92）降级为本机段面参考，不作 S5 开场锚；
  2. served 面=GET **R-HY trimodel 实例**（地址/端口/探针形态候 FSD 部署毕卷确认，不猜；跨机面 D-24 hostname 断言首行）；本机 3333/pid 32756 候 FSD 验证绿后退役，不作 S5 活体；
  3. **全量回归/GATE 复跑基线随部署链版本走**：FSD 链含「间隙修→推 origin」，R-HY build 源面=origin 顶**可能新于本机断点⑤**——S5 开场版本核对 R-HY 部署 commit vs 本机 TriModel HEAD，不一致则先评估间隙修差异面、对齐交付面版本再复跑（读数锚交付面版本，不锚本机旧版）；
  4. jsdom 干跑面（两批 70 断言布景与防坑六条）不受影响——对象=ui/index.html 源文件，源侧同仓无差。
- 18:51 自醒 cron 已同步换锚（删 67b35156 重挂 R-HY 锚面版）。

## 七、CTO R-HY 锚面执行口径五条收讫（09:36 信，§六 细化）

1. **dist 锚核对象=R-HY**：FSD 部署毕供 R-HY 指纹三件（选型同 index/trimmc-card/policy）；**跨机指纹不要求与本机同值**（build 非确定性可能致异，同源不同值非矛盾），达锚判据=**R-HY 同机 served 面与盘面自洽**，独立复算对象=R-HY 盘面——§六 第 1 点据此细化。
2. **写面纪律（CTO 裁定）**：R-HY 上只读锚实测（B 读 verify/D GET 重拉/E 400 校验拒）；**C 清空禁触 R-HY 生产卡**——C 锚 R-HY 面走只读串在场验证，交互级引本机第二轮窗 P2 探针+本卷 jsdom 干跑 70/70 读数为证，锚面报告分层标注。
3. **态覆盖分层**：R-HY 真卡活体验「已落生效」主态；其余三态（已存未拉/已拉未落/读取失败）引 jsdom+本机 mock 读数——锚面报告分层标「活体可达态/构造态引证」。
4. **写面构造态需求一律回本机 3333**（BOD 在 R-HY 验证绿后才退役本机，窗口内本机可用）。
5. 活体对表「渲染面 N+源码面 M」分列口径不变；19:00 照常，开场首步=R-HY dist 锚核先核后测。

与 §六 第 3 点关系注：**版本核对保留**（回归基线对齐交付面版本），指纹值**不跨机比对**（第 1 条达锚判据=同机自洽）。

> 踩失重放注记：本节首笔（01:38Z）与重放（01:41Z）两犯被并行收编（9c06dd76/bc8c0d70 值席 merge 族）踩失——未提交编辑在他人收编窗内无防踩面，本笔 01:44Z 第三写从会话上下文原样重放，零净损（内容可从上下文重放）。共享树未提交编辑防踩面缺口候 CTO/CAO 域知会（D-45 同族候选第三例：收编窗踩未提交并行编辑）。

## 使用依据

- FSD S4b 毕报卷 fa20b528（六刀清单+段门四项）+第二轮窗卷 7a992de4（指纹三件+pid 32756）
- TriModel 源面实读：src/api/verify.ts（五态派生+响应体）/src/api/config-cards.ts（managed body）/src/api/runtime-info.ts L18（domain_label 默认）/src/model-catalog.ts（五名）/src/trimmc-card.ts L131（status 字段）/ui/index.html（L314 $ 定义/L456-461 handler/L734-743 reloadFaceCard/L583 humanize/L922 faceEntryMsg/L1038 submitFaceEntries/L1671 renderConnectDomains/L1705 pane 模板/L1929 tcDomainLabel/L2299 tcApplyStateSuffix）
- test/ui-boot.test.ts（harness 正形+S4b C/D 两测操作序正形 L604-665）
- CPO 方案卷 cpo-deeptest2-ui-overhaul-plan-20261007.md（五组词定名表+条 8 扫描清单+三型新串正身）

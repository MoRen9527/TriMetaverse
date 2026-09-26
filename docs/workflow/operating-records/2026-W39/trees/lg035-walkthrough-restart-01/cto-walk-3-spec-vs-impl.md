# 走查段③·实现态走查（spec I1-I11 vs 实现逐条）+ 段④首启链测试清单备料

- sourceOfTruth: 本件（走查树段③④读数正身）
- syncMode: final
- lastSyncedAt: 2026-09-25 20:0x +0800（date 现查 19:59:32）
- spec 基线: 2026-W38 `lg-035-local-ui-spec.md`（frozen 2026-09-14T16:10+0800）
- 实现现势: TriModel `d012e1e`（ui/index.html + src/api/{routes,trimmc-card,runtime-info,claude-fallback*}.ts + src/trimmc-card.ts + src/policy.ts）

## 版本差标注（工作接手规则）

spec frozen（09-14 16:10）后实现演进 8 笔（git log 实勘）：层2 段A/B/C（v4 三实体改造）、规则表单显隐根治（437674a）、直连兜底按钮（14efe8e）、兜底 POST 读体修复（6120e08）、兜底两套 sg 通道（4343f89）、CPO 警示文案（d012e1e）。**本走查对照基准=spec frozen；v4 演进致 spec I3/I6/I7 措辞漂移（下表标注），漂移定性=spec 陈旧非实现缺陷，spec 修订候批（本单只读零修改）。**

## I1-I11 逐条对照

| # | spec 行为 | 实现锚 | 读数 |
| --- | --- | --- | --- |
| I1 | 未连接打开：连接设置自动展开+引导+域标签无鉴权显示 | boot L283-289（open+guide+禁用面板）+loadRuntimeInfo L682-689（无鉴权，失败静默保静态默认值） | **PASS** |
| I2 | 双令牌→连接：探针校验（卡 GET）→三态点+成功自动重拉 | L309-337（probe→绿「已连接」/黄「已填入未验证」/红+重试面板）+refreshAll | **PASS**。注记：连接点击即写 localStorage（L316-317，验证前持久化）——错令牌 reload 后自动回填，轻微非阻断 |
| I3 | 策略下拉：策略名+未启用标「已停用」+空态+活动回显 | tcRenderStrategySel L1050-1060：名字+**活动标「（活动中）」**（正标）+空态 ✓+value=id 回显 ✓ | **PASS（措辞漂移）**：v4 策略实体无 enabled 字段，「已停用」无从实现——实现改活动正标，语义合理，spec 措辞陈旧 |
| I4 | 策略详情：活动策略/目的/默认模型/模型集/规则数+规则列表逐行可见 | tcRenderStrategyDetail L1062-1107（五字段+time 窗行/default 行/quota 徽标行） | **PASS**（规则列表行可见 ✓；但表 L2 列头错位见段②） |
| I5 | 切换至选中策略：本地意图置 active（保存后持久）；reload 回显 | L1171-1177+PUT L730+hydrate L1215 | **PASS**（持久链闭环；反馈文案 T2 见段②） |
| I6 | 清除：active=null；保存后详情「无（按时段规则执行）」 | L1179-1183+详情 L1069「无（未启用——全部使用系统默认）」 | **PASS（措辞漂移）**：无策略时时段 schedules 不存在（时段规则经策略引用），实现措辞更准确，spec 陈旧 |
| I7 | 新增策略：名称必填/目的选填/模型集/默认模型/启用 | 表单 L205-215：名称/目的/模型集必选/规则多选——**无独立「默认模型」「启用」字段** | **PASS（v4 演进漂移）**：默认模型=default 型规则承担、启用随规则实体——spec 停 v3 旧形，实现按 v4 终稿 |
| I8 | 应用到本机（LOCAL_APPLY=1 显）：rules→policies/local.json+卡 default_model 同步+提示+刷新 | 按钮门控 L687-688+apply L692-709；服务端 handleApplyStrategy（api/trimmc-card.ts L230-323：404/400 无活动/悬挂/空规则全人话+savePolicyForMachine+default_model 派生同步） | **PASS**（服务端语义与 spec §2.3.2 全对齐；schedule id 含窗序 `strategy:<sid>:<rid>:<wi>` 较 spec 更细，多窗展开需要） |
| I9 | 保存卡片：防双击+服务端确认绑定（2xx 才翻「待应用」）；401 人话不翻 | L711-755（disabled+「保存中…」+401 人话 return+徽标走服务端 status 渲染） | **PASS**（除 T3 非 401 错误路径拼 HTTP 码——段②已列） |
| I10 | D15 幂等：同厂商+同模型跨 id 去重；连点保存条目数不变 | 服务端 L113-121 去重+前端保存后清脏态（L746-747） | **PASS** |
| I11 | 失败态人话：401/503/网络+重试钮，无 HTTP 码黑话 | humanize L245-253+failPanel 重试 L300-305+401 路径 ✓ | **部分 PASS**：401/503/网络三路 ✓；**tc-save 非 401 错误路径拼 HTTP 码（L743）破本条验收——T3 实锤** |

**I1-I11 总读数：11 条中 8 全 PASS、3 PASS 含漂移注记（I3/I6/I7 措辞漂移=spec 陈旧）、0 实现缺陷级违背；I11 被段②T3 单点击穿。**

## §2.3 本单新增五件复核

runtime-info 路由（routes.ts L98）✓／apply 端点（routes.ts L124+handler 全人话）✓／UI 域标签动态化+按钮门控+策略 hydrate+详情规则列表 ✓／policies 路径规范化（server.ts L88-91 boot 迁移幂等）✓／环境变量三件（TRIMODEL_DOMAIN_LABEL/LOCAL_APPLY/POLICIES_DIR 代码面在位）✓。

另复核兜底族（LG-036 增量，spec 外）：CPO 警示文案两栏 verbatim 同句逐字比对一致（L103=L117，d012e1e 落地承诺成立）✓；sg 凭据不落 localStorage（L532 注释与实现一致）✓；写后密钥输入框清空不回显（L477/L532）✓。

## 段③结论

spec frozen 交互契约在现树维持成立（零实现级违背）；发现面=①spec 措辞漂移三处（I3/I6/I7，候 spec 修订批）②段②四族 7 实锤（D1 策略删除复活为唯阻断级候选）。**LG-035 原「纸面绿≠真浏览器可用」教训域无新回潮，但 v4 演进窗新引入列错位族+删除通道断线，走查重启抓得实。**

---

## 段④·首启链测试清单备料（CEO 真人测试窗用）

### A. 完整周期主链（第四型盲区覆盖：每步含保存→reload→断言仍在）

1. 清 localStorage（或无痕窗）→打开 `http://127.0.0.1:3333/ui` →**期待**：连接设置自动展开+黄色引导+全卡灰化+域标签「本地域（TriMLC/TriRLC）」可见；
2. 填双令牌→「连接」→**期待**：绿点「已连接」+策略/条目数据渲染；
3. 录入模型条目 ≥2（建议 deepseek+glm 各一）→「保存卡片」→reload→**期待**：条目仍在（密钥列显 ••••）；
4. 新增模型集（勾选 2 条目）→新增规则（时段型 2 窗+默认型各一）→新增策略（引用集+规则）→「保存卡片」→reload→**期待**：集/规则/策略全部仍在；
5. 策略下拉选目标策略→「切换至选中策略」→「保存卡片」→**reload→期待：活动策略回显（I5 持久链）**；
6. 「应用到本机」→**期待**：「已应用到本机：<策略名>（N 条时段规则，默认模型 X）」+「当前生效」按窗命中；
7. 若测试时点跨 18:00：生效值自动翻 GLM-5.3（演示策略语义）。

### B. 破坏流建议（六条）

1. 错管理令牌→连接→**期待**：黄「已填入未验证」+人话引导；
2. 停 3333 或改端口→刷新→**期待**：红态+错误面板+「重试」钮；
3. 删被模型集/规则引用的条目→**期待**：人话拒（注意文案 T4：default/quota 引用也报「时段规则」——已知文案瑕疵非功能错）；
4. **删除一个非活动策略→「保存卡片」→reload→观察是否复活（段②D1 缺陷现场验证位——若复活即实锤坐实）**；
5. 策略列表区目视：**表头 5 列 vs 行 6 列错位（段②L1 现场验证位）**+策略详情表「优先级」列内容是否为规则名（L2）；
6. 全程目视术语：模型集/规则区空态提示的「层2 开放中」字样（T1 现场验证位）。

### C. 已知边界提醒（spec §四，测试时不计缺陷）

跨午夜窗不支持（start≥end 拒）／并发写冻结窗纪律（CEO 测试窗=解冻窗，席位侧照纪律不写）／sg 域标签须 TRIMODEL_DOMAIN_LABEL 设置。

### 使用依据

- spec 基线：2026-W38 lg-035-local-ui-spec.md（frozen）
- CEO 定谳：2026-W37 lg-035-cpo-redesign-trimodel-ui-v3-addendum5.md L13/L23
- 实现：TriModel d012e1e（ui/index.html 1231 行全量实读+src/{server,policy,trimmc-card}.ts+src/api/{routes,trimmc-card}.ts 定点实读）
- 检具：LG-035 七条否决教训（W37 预走查核销记录反推全七条）

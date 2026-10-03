# CTO 技术面评估稿 · 插值填槽机制（BOD 评估令，CEO 10:51 令）

- sourceOfTruth: 本件（CTO 技术面四题评估正身；评估非施工不动现役文件 ✓）
- syncMode: static（当天窗内毕报）
- lastSyncedAt: 2026-10-03 12:52:28 +0800（date 现查贴原值；管线实勘时点 11:0x-12:5x 随文标注）
- 评估席: CTO 小狄（m-cto）；管线现行版实盘勘定（source_publish_check.py 4694L+employee_source_kit.py 1144L+发布流程文档），零凭记忆 ✓
- 与 CPO 稿关系：产品面三题见同树 CPO 评估稿（charter 内联件）；本稿答技术面四题，边界互补；契约刚性判据与 CPO 稿对表一致

## 评估总判（技术面一句话）

**可行，且改造代价低于直觉——现役渲染管线已内置四类「渲染时文本变换」先例+一类 fail-closed 先例，值注入=第五类同族变换，不需要新管线；两条路线中「管线值注入层」显著优于「源侧模板化」，源侧正文可零改动。**

## 一、现役渲染管线实勘（整合点盘点，11:0x-12:5x 实盘）

管线本体=`TriCompany/runtime/cognition/source_publish_check.py`（4694L，--host 参数入口 L3101 带）；发布链路正身=`TriCompany/docs/workflow/host-object-publish-flow.md`（source→support→binding→live→manifest→governance）。与槽化直接相关的现行机制四件+门两道：

| 机制 | 实锚 | 对槽化的意义 |
| --- | --- | --- |
| `HOST_RENDER_REGISTRY`（HostRenderSpec，L132） | 按 host_id（copilot/claude/claude-session）注册渲染规格：target_root/suffix/frontmatter 字段序/工具名映射/保护前缀/默认附加段/strip_sections | 值注入规格的注册点现成——新增字段或复用现有缝即可，双宿主/会话面三形态统一覆盖 |
| `tool_name_map` | frontmatter 工具名小写→PascalCase 映射（渲染时替换） | 「渲染时做宿主相关文本替换」先例① |
| `default_extra_section` | claude 面派生身份标记尾注（即「--host=claude 禁人工编辑」）=渲染时附加段 | 「渲染时追加宿主内容」先例② |
| `strip_sections`（LG-024 批 0） | 按节标题精确匹配剥离会话面段；**源码注释明写「未来扩展缝：填节标题即剥离」** | 「渲染时按规则变换正文」先例③+预留扩展缝 |
| `_compose_session_payload`+`_extract_m001_public_section`（L745/L776） | M-001 段从 CEO 席 session-body 抽取注入 13 席会话面=**跨文件组装现役在跑** | 「值从独立文件注入正文」先例④——值注入层与 M-001 机制同构 |
| fail-closed 先例 | `CLAUDE_HOST_TOOL_ALLOWLIST`（L166 带）：映射到白名单外=error **不落盘**，剔除进报告审计可见非静默 | 值缺失/槽残留的处理范式现成：error 不落盘+报告留痕 |
| manifest 驱动 | `_load_publish_manifest`+`_is_render_entry(entry, host_id)` | 值文件挂载点可走 manifest 声明，与现有生成规则清单同族 |

**判定：管线加值注入层=第四类变换的第五个同族件，改造落在已验证模式内；源侧模板化反而要动 13 席×9 件源文件+validator 全链。**

## 二、题①两条路线改造代价对比

| | 路线 A：源侧模板化（源文件写 {{slot}}） | 路线 B：管线值注入层（源侧零改动，渲染时替换） |
| --- | --- | --- |
| 源侧改动 | 13 席×9 件套正文全量改写+contract.yaml 声明面 | **零**（源侧=人写人读合同正文保持纯净） |
| 管线改动 | 渲染前加「模板展开」pass+源侧 validator 新增未填槽检查 | 渲染核心加一个值替换 pass（regex 单遍）+对表门+残留门 |
| git diff 可读性 | 源侧历史 diff 全部混入槽位符噪声；编辑器直读带噪 | 源侧 diff 零损失；值文件独立 diff 天然可读 |
| 回滚粒度 | 源文件回滚=内容回滚，粒度粗 | 管线不注册值注入规格=现役行为零变化（发布拷贝 git revert 即回） |
| 契约刚性保障 | 靠文档约定，弱 | 白名单硬编码在管线（与 CPO 裁答同构），值文件写了契约键=error 拒渲染 |
| 改造代价 | **高**：源侧全量改写+validator/测试全链 | **低**：管线 1 窗+试点 1 席 |

**技术裁答：路线 B。** 理由=现役四先例全部长在管线侧；源侧模板化把「渲染时知识」提前固化进源侧合同文件，违反源侧五件套宿主无关正身的分层纪律（同一模板服务双宿主+未来 N 租户，值差异本就该在管线/值文件层消解）。

### 值文件 schema 设计要点（路线 B 下）

- 落点建议=`TriCompany/source-agents/values/<tenant>.json`（与 binding-profiles 平级同族；公司维度/TriCompany 与项目维度/TriMetaverse 各一份起步，N 租户=加文件非改架构）。
- 形态=平铺键值起步（`{"co_name": "TriCompany", "co_short": "TC", ...}`），嵌套引用（槽 A 值含槽 B）**P0 禁用**（单遍替换+残留门下嵌套=顺序敏感坑，YAGNI）；中文多值=值本身字符串含中文零障碍；缺省回退=P0 不做（缺失=error fail-closed，回退语义留 P2 候裁——静默回退=半渲染身份分裂风险）。
- 值注入管线形态（施工单素材，FSD 车道）：HostRenderSpec 新增 `value_file` 可选字段→渲染核心在 frontmatter 渲染后、落盘前对正文做单遍非递归 `{{key}}` 替换→三重门：①对表门（模板槽集 vs 值文件键集双向 diff，报缺即 error）②残留门（成品 `{{`/`}}` 扫描零命中）③白名单门（契约面键硬编码禁入值文件）。三重门全复用 allowlist fail-closed 范式。

## 三、题② 存量改造面与工作量级（席·窗）

| 面 | 对象 | 工作量级 |
| --- | --- | --- |
| 管线值注入层+三重门 | source_publish_check.py+validation 测试 | FSD 1 窗（含 golden 快照测试，同 validation 现款） |
| 试点席槽化标注 | 1 席×9 件（源侧正文标注 {{slot}} 位——路线 B 下源侧仍需标注槽位符，但**合同语义零改动**，仅值孤立项换写法；如「你的工作名是{{agent_name}}」） | 1 席 1 窗（标注非改写，机械度高） |
| 全量 13 席标注 | 13 席×9 件（BOD 令文「8 件套」实勘=9 件/席含 contract.yaml，如实注记） | FSD 2-4 窗（批处理+逐席验收；registry 型 4 席+board 面同管线同批顺带，边际成本低——它们同为管线产物） |
| 值文件初版 | 公司级+项目级两份 JSON | 0.5 窗（键集从试点席标注反推生成） |
| STE 验证 | 三重门测试+双宿主产物 diff 断言+回滚演练 | 1 窗 |
| **合计** | MVP（试点 1 席）≈ **2-3 席窗**；全量 13 席+registry 面 ≈ **5-8 席窗** | |

注：工作量级为评估口径非施工承诺；实际以试点读数修正。

## 四、题③ 风险清单

| # | 风险 | fail 方式 | 缓解 |
| --- | --- | --- | --- |
| 1 | 值文件缺失/键缺 | **fail-closed（error 不落盘）**，禁原样透出、禁静默回退 | 半渲染产物=身份分裂（半旧半新名）比渲染失败危害大一个量级；allowlist 同款先例 |
| 2 | 槽名漂移（模板改槽名值文件未跟） | 对表门双向 diff 报缺，渲染前置 | 键集变更须同轮改模板+值文件，门强制同 |
| 3 | 替换误命中/嵌套替换 | 单遍非递归替换+残留门二次扫描 | P0 禁嵌套引用；`{{` 在中文正文中无自然出现形态（误命中率≈零，残留门兜底） |
| 4 | 契约面被值文件稀释 | 白名单门硬编码：契约键（纪律/权柄/层契约条款键名）禁入值文件 | 与 CPO 裁答「契约面白名单硬编码在渲染管线」同构，双席一致 |
| 5 | 双宿主发布拷贝值不一致 | 值注入在共享渲染核心做（host 无关层），双宿主同值同产；STE 双面 diff 断言 | 禁在 HostRenderSpec 差异字段里放值差异 |
| 6 | **路径类值双重承载** | —（纪律面非门面） | **技术面重点提示**：运行锚路径（知识工作区/cognition home 落点）现役由 binding profile 承载且「binding 事实不入源侧」是明文纪律——值文件若也收路径键=两份真源分裂。**值文件只收呈现层值（名/别名/描述/阶段语境），路径仍归 binding profile**。此边界入值文件 schema 注释+白名单门反向面（路径类键禁入） |
| 7 | git diff 可读性 | — | 路线 B 下源侧零噪声；值文件独立小 diff；发布拷贝 diff=纯值面变化，审读容易 |

## 五、题④ 分阶段建议与回滚锚

- **P0 试点（推荐 COS 席起步——CPO 稿同判）**：管线值注入层+三重门（FSD 1 窗）→COS 席 9 件标注+公司级值文件初版→双宿主发布+STE 验证。验收锚=双宿主产物 diff 仅值面变化+三重门测试绿+源侧 git diff 零语义变化。
- **P1 全量**：13 席+registry 型+board 面批处理标注（2-4 窗），项目级值文件补齐。
- **P2**：缺省回退语义候裁、嵌套引用候裁、TriMetaverse 项目维度标注扩展（模块名/仓路径/命令族——CPO 稿「深层低频」判同意）。
- **P3**：多租户值文件管理面（候商业需要，不为预想租户预付架构税——CPO 同判）。
- **回滚锚（每阶段独立可用）**：①管线层：值注入规格不注册/摘除=现役行为零变化（HostRenderSpec 默认字段 None 跳过 pass）②产物层：发布拷贝 git revert（.claude/agents/.github/agents 双面）③值文件层：值回改=纯 JSON 改动分钟级。三层回滚互不牵连。

## 六、不槽化边界（技术面补充）

1. CPO 契约刚性判据全盘采纳（契约面白名单硬编码），技术实现即白名单门。
2. **binding profile 承载面不槽化**（§四#6——路径/宿主绑定事实单点承载，值文件不重复收）。
3. **frontmatter 结构字段不槽化**（name/tools 字段序/工具映射——管线结构面，非呈现值；name 若需随租户变属 P2 候裁，牵 discovery 入口改名面）。
4. 现役 M-001 注入机制不迁移进值文件体系（独立机制在跑，P0 不合并——合并=扩改造面违试点纪律；P2 候勘是否同构归一）。

## 使用依据

- BOD 评估令（CEO 10:51 令，任务书=trees/custom-slot-eval-20261003/task-charter.md，742813bfa 落树）
- 实盘勘（11:0x-12:5x 只读）：TriCompany/runtime/cognition/source_publish_check.py（HostRenderSpec L132-166 带/CLAUDE 派生标记常量/tool allowlist/HOST_RENDER_REGISTRY/_render_agent_payload L1043/_extract_m001_public_section L745/_compose_session_payload L776/--host 入口 L3101）；employee_source_kit.py 函数面（scaffold/validator，无槽机制）；docs/workflow/host-object-publish-flow.md（发布链路正身）；TriMetaverse scripts/sync-agents-to-claude.mjs（历史格式转换层，非主管线）；TriMetaverse/.claude/agents/ 文件头尾（派生标记实锚）；TriCompany/source-agents/chief-technology-officer/ 9 件清单
- 同树对表：CPO 产品面评估稿（charter 内联件，契约刚性判据/试点席建议/不预付架构税——三处对表一致）

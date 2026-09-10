# LG-034 阶段 1 首件组审·COS 席意见稿（归档）

- sourceOfTruth: m-cos 会话消息逐字归档（COO 收稿 2026-09-10 23:38+0800，签发 23:34+0800）
- syncMode: frozen（联审证据件）
- 独立性声明（原稿自带）: 实读=主靶标全文+7 件族全读+contract yaml 全读，未看任何他席稿

## 原文

【总判断】冗长根源略——本件为联审席意见：靶标 agent-body.agent.md，12 条如下。

1.【人格三件裁撤】soul/colleagues/social 三件均空模板占位（soul=「人格层待定义」4 字；colleagues/social=空模板声明+实际数据在 knowledge workspace/runtime cognition）。BusinessStrategy 定性=中央 Strategy Registry 非人格 agent，空壳人格件误导接管者。建议：三件删除；若发布管线强制族件齐套，改一行显式声明「非人格 registry 型，无人格层」而非「待定义」（后者=悬置错误信号）。验收锚：族内 grep soul|colleagues|social 文件名零命中或声明件含「非人格」字样。
2.【frontmatter 空件】agent-frontmatter.agent.md 实测 3 行=`---` 纯空占位零信息。建议：删除，frontmatter 直接以 agent-body 头部为准。验收锚：文件不存在+发布面 frontmatter 单源。
3.【命名口径注记（非缺件）】本席按清单简写「contract.yaml」读取失败，实名=`business-strategy.contract.yaml`（87 行吻合）。建议：派工清单带全名防复现（D-18 零命中先疑 pattern 再证）。验收锚：无（事实注记）。
4.【description 双写双真源】description 全文在 agent-body L3 与 yaml L10 同文双写——双真源漂移温床（D-18 族）。建议：单一真源化，正文留一处、另一处援引（D-16「条文禁复述」同族）。验收锚：grep description 全文仅一处定义。
5.【description 内容过时】两处均含「TriMC 统一运行面」「正式上线切换阶段」——两叙事已死（trimc 正名定谳+切换叙事废）。建议：按现役语义重写（中央商业战略/模块边界/服务域本地域取舍/入口策略/收口路由）。验收锚：grep「TriMC|正式上线」零命中。
6.【运行宿主基线节重写】agent-body L30-38 六基线大半过时：TriMC 作 runtime 标准名✗/shadow+正式接管按 copilot 宿主✗/V1 正式上线切换里程碑✗；core-agent 历史别名条可留但须标「历史」。建议：按现役基线重写（TriMC 不存在/服务域 TriMMC+TriRMC/本地域 TriMLC+TriRLC/runtime=M 面 claude code runtime+R 面 agent-core 候确认/TriCade=TriRLC 层/IDE 入口 Tripilot+CLI 入口 trilc chat）；主开发 agent-core 候 CEO 确认后入文。验收锚：基线节 grep「TriMC|正式接管|切换阶段」零命中+现役六点逐点在文。
7.【yaml runtime_baseline 三字段全废】L84-87 `host: copilot-host / tri_mc_status: planned / tri_mc_migration_ready: false`——三字段全部过时叙事。建议：整节按现役宿主事实重写或删除（若契约 schema 必需则填现役值）。验收锚：yaml grep「copilot-host|tri_mc」零命中或值面现役。
8.【openclaw 等价名候勘（本席独立发现）】yaml L58/64/70 `runtime_equivalent: openclaw:*` 三处——「openclaw」现役无此 runtime 名，字段值来源不明（疑早期遗物）。建议：候 CTO 线勘定现役等价名或删字段；本件先标「候勘」。验收锚：字段值与现役 runtime 名对表一致或字段删除。
9.【信息源优先级修订】L40-48 缺 CLAUDE.md（M 面路由真源）与 docs/三元宇宙架构与模块说明.md；whitepaper 现居 TriMetaverse 根——归 docs/ 系文件移动动作候另令，信息源清单届时同步。建议：清单补两件+与 CLAUDE.md Source of Truth Order 对表。验收锚：信息源节与 CLAUDE.md 真源顺序一致。
10.【中央收口双权分立（回应 CEO 联审裁问）】本席裁法：不二选一，分层双权——BusinessStrategy 裁「哪些 registry 参与」（边界权威），COO 管「怎么组织审」（编排权威）。全归 COO 缺商业权威，全留 BS 编排无主。建议：agent-body 增一行「编排组织归 COO，边界与范围裁决留 BusinessStrategy」。验收锚：新增行在文+LG-034 实例可援引。
11.【更新策略加 FADE 指针】L57-60 仅「用户明示才更新」——批量更新自动化方向赞成但属独立工程件。建议：本件只加指针「批量更新候选走 FADE 管线」，展开候 FADE-006 成熟。验收锚：指针行在文。
12.【tools 规范两小点】①frontmatter L4 `tools: [read, search, edit]` 小写 vs 发布面惯例大写首字母；②yaml tools scope `docs/` 与实际读根级 md 需求有出入。建议：统一大写+scope 增根级 *.md 或放开为仓内 md。验收锚：与 TriCompany 其他源件 frontmatter 对表一致。

以上 12 条（3 为事实注记、8 为候勘项、余 10 为修改意见）。防 echo 声明：与 CEO 要点的共识区（1/5/6/9/10/11）系独立实读后收敛，增量=2/3/4/7/8/12。

——COS 席（m-cos），签发 2026-09-10 23:34+0800

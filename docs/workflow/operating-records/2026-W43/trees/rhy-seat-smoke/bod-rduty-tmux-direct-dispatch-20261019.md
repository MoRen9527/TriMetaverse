# r-duty 终端直挂形派工卷（CEO 选 2 裁·tmux 直挂形+旧形残留清退）· 2026-10-19 晚

- sourceOfTruth: 本卷（BOD 裁决收执+派工令正身+web 面勘定读数）
- syncMode: static（派工时点快照·执行态以班组毕报为准）
- lastSyncedAt: 2026-10-19 22:09:03 +0800（date 现查·shell 注入·D-47 双保险）
- 令源: CEO 2026-10-19 21:57「选2. 终端直挂形（需小施工）」（BOD 21:5x 呈二选一接入路后）·同信附问 18790/18791 web 面按值席名开会话之法

## 一·web 面勘定结论（活体现勘·答 CEO 同信之问）

- 通路活体验证：本机 18790→河源 relay3 注 token 302→18791 dsh web（DeepSeek Harness）→cookie 兑换 200 正常进 GUI（沿 bod-dsh-tunnel 隧道·零新增 ssh）。
- **会话级 URL 深链：无**——点开单席（实测 r-duty-cto）地址栏保持 `18791/` 不变；会话操作菜单（置顶/重命名/分叉/归档）与会话头部菜单（下载 Session 日志/反馈）均无「复制链接/新窗口打开」项。dsh web 不支持按 URL 直达特定会话。
- web 面现形答法：**左侧栏「会话」树 → fleet 分组 → 点席位名即开**（13 席常驻会话标题即席位名）；常用席可「置顶会话」浮顶作快捷位。
- 「claude --agent 式按名直达」的等位形=终端面 tmux attach（即本卷方案）：`tmux attach -t r-duty-<席名>` 名字直达——两面互补，web 看/终端挂。

## 二·目标态

河源系统 tmux 默认 socket（/tmp/tmux-1000/default）建 **13 个 tmux 会话，名=r-duty-<席名>**（与班组名册同构·CEO 现行 VS Code profile 命令零改动即用）；每会话跑 claude CLI，cwd=`/home/fleet/.dsh-workspaces/<席名>/`（人格真源=该工作区 AGENTS.md）。与现役 13 席 dsh web 会话**并行互补**：web 形=GUI 面，tmux 形=CEO 终端直挂面。

## 三·派工令（→ r-duty-cos·经 sg TriMC 箱+m-duty-cos 转达双通道）

1. **对象与形**：如 §二；模型/env 与该席 dsh preset 对齐（DeepSeek 轨现役默认），注入法班组自定、落卷留痕（claude CLI 在河源 tmux 形有旧先例=r-duty-sde 旧形，非新地勘）。
2. **硬护栏**：
   - 现役 13 席 dsh web 会话**零触碰**（不重启不重建不发消息）——两会话面对话历史互不共享（人格同源=工作区 AGENTS.md）如实注；
   - **r-duty-sde 旧形残留清退**：清退前先勘无在途产出（git status/未落盘面），确认后 kill 该 tmux 会话+进程，留痕（何起/何进程/何时清）；
   - token/凭据值面零回显（D-46）；只加不改：daemon/cron/现役会话面零触碰。
3. **验收门（BOD 活体验收）**：`tmux ls` 13 席名全在；CEO 正形路径实测（attach r-duty-cos 落入会话·claude CLI 就绪）；r-duty-sde 旧形清零断言。
4. **施工位**：cos 组织——有 shell/终端面即自施工；无则经 m-duty-cos 回报 BOD 改派。
5. **毕报三送**：落卷+回信本箱（target_seat='bod'）+m-duty-cos 抄送；含 tmux ls 全量/逐席进程形/清退记录。
6. **候办（不挡本窗）**：tmux 形开机自愈（keeper）候毕报带方案另批。

## 四·执行链

| 步 | 动作 | 状态 |
|---|---|---|
| 1 | CEO 裁选 2 收执（本卷） | 毕 |
| 2 | web 面活体勘定（§一） | 毕 |
| 3 | 派工令 sg TriMC 箱双信（r-duty-cos 派工+m-duty-cos 转达请托·原子写+回读断言） | 本窗 |
| 4 | 班组施工+毕报 | **受阻回报已收执（§六）·候 CEO 裁形** |
| 5 | BOD 活体验收（§三.3 三门） | 候 |

## 五·勘误段 v1→v2（2026-10-19 22:36·CEO 勘正触发·原文上存照历史冻结惯例不改正文）

- **勘误责任：BOD**。v1 令文 §三.1 误指定「每会话跑 claude CLI」——系旧形（与 r-duty-sde 旧形残留同形·分库·与班组现役 dsh 形态矛盾）。CEO 22:32 勘正：「tmux 挂上去是 dsh，不会挂上去还用 claude code 的 cli」。
- **dsh 能力活体勘定（4 探针·-J sg 零直连）**：
  1. dsh CLI 正身=`/srv/fleet/dsh/node_modules/.bin/dsh`（fleet 位·现役 web 即此 bin：`dsh web --port 8791 --no-open`·pid 243543·10-17 起）；
  2. **`dsh tui` 形在册设计存在**（help 实锚：`dsh tui --resume <session>`·`dsh headless`·`dsh web` 三形并举）——**tui profile 河源现未建**（报错原文：`profile "tui" does not exist; create it with 'dsh plugin --profile tui add <package>'`）；
  3. tui 包来源未定谳（node_modules/@deepseek-ai/ 前 40 包全 client-ui 族无独立 tui 包；出厂模板有无候班组 `dsh --dump-default-config` 断）；
  4. 调用注意：`sudo -u fleet` 非 `-H` 会摸 `/root/.env` 报 EACCES（实测）——正形 `sudo -H -u fleet`。
- **旧形残留重勘（活体在案）**：r-duty-sde 残留**仍在**=pid 16048（10-16 起·tmux 服务·会话名 r-duty-sde·内跑 `/home/fleet/.local/bin/claude --agent SeniorDeploymentEngineer --dangerously-skip-permissions`·cwd=/srv/fleet/TriMetaverse）——但该会话**不在 fleet 默认 socket ls 面**（22:2x 勘 `tmux -S /tmp/tmux-1000/default ls` 仅 dsh-web-prod）——清退按 pid 16048 实体直查，勿凭 socket 名猜。
- **v2 令要点（信面 307 已就地改 v2）**：tmux 13 席内跑 **dsh tui --resume <该席现役会话>**（同库同会话·web 历史与终端续聊同段）；禁 claude CLI 形；施工第 0 步=tui profile 来源勘定（dump-default-config→模板启或 plugin add）；同席 web/tui 避免同时活跃（并发语义勘明前串行为准）；余护栏/验收门沿 v1 改述。
- 信面动作：307 就地改 v2（未拾取信就地勘正·原子写）+309 增补知会信（m-duty-cos·v2 替代 v1）。

—— BOD 落款（勘误段）2026-10-19 22:36:58 +0800（date 现查原值粘贴·发毕重跑对表）

## 六·施工受阻回报收执与候裁（2026-10-19 23:2x）

- **受阻报收执**：r-duty-cos 22:48:04 落 `REPORT-rduty-tmux-blocked-20261019.md`（其工作区·9131B）——三送梗阻未达 BOD，23:22 BOD 直读工作区收执；**全文存照=同目录 `rduty-blocked-report-20261019.md`**。硬护栏复核全绿（web 会话/8791 零触碰·token 零回显·daemon/cron 零触碰）。
- **任务 1 硬阻（定谳）**：dsh tui 应用包不存在——A 路死（出厂 templates 实勘=`acp/web/headless/sdk/sdk-minimal` 五档无 tui·`--from-default-profile tui` 报 unknown）+B 路死（实盘 300+ 包无 tui·npm `@deepseek-ai/dsh-tui` 及 14 候选名全 404·0.2.1-rc.2 依赖表亦无 tui bundle）·README「--profile tui」系假定已装的未发布示例。13 席**一个未硬造** ✓ 按令合规止步。
- **任务 2 撤销（定谳·本卷 §五再勘正）**：pid 16048 非 claude 残留=**tmux 服务端本体**（argv 系 10-16 new-session 化石回显·10-17 起承载 dsh-web-prod 会话跑现役 web pid 243543=8791）——kill 即断 web·r-duty 正确不执行；**旧形 claude 残留实测已清零**（全量 ps 扫描零命中）。台账正名：`16048=tmux-server(hosting dsh-web-prod)`——v2 令任务 2 标的本身不成立，BOD 勘误责任自领。
- **附带产出**：13 席会话库键全谱实测表（每席 2-4 会话·最近批次 10-18 10:53/10:54·见存照报告表）；候确认两项=现役段指认（10-18 批 vs 10-17 批）+`session.lock` 同库并发语义（web 在席时同库第二挂载是否锁拒·未验证）。
- **新缺口入账（独立于本件）**：sg TriMMC notify 消费端（trimlc）未在跑——sg 箱写入面活（BOD ssh 级·今夜 307-309 实证）而消费面死（10-16 起 outbox pending 无人消费=信件拾取滞后根因）·候 8712 域勘修窗（与 A1 余窗 8712/8710 候排合并勘）。
- **候裁四选（r-duty 呈·BOD 抄呈 CEO）**：
  - A｜等 tui 正式发布后 `plugin --profile tui add` 一次成型（r-duty 建议·零风险·时间不可控）；
  - B｜升级整栈 0.2.1-rc.2 再勘（依赖表已勘无 tui·大概率白升+动 web 服务地基·需 CEO 级另令）；
  - C｜降级 `dsh --profile headless --session-id <席现役会话> "<消息>"` 逐条续聊（同库同历史成立·但一次性问答循环非交互 TUI·形态明显变·须 BOD 明令）；
  - D｜自建 tui bundle（CTO 域立项·候选路径=TriLC 现成 Ink TUI 接 dsh SDK/或候官方发布）。
- **BOD 意见**：C 形态不符 CEO「打开就聊」原意·不建议硬上；正解方向=D 立项评估（CTO 线勘接线可行性）+A 被动等官方·可并行。候 CEO 裁。

—— BOD 落款（§六）2026-10-19 23:25:10 +0800（date 现查·shell 注入·发毕对表）

## 七·CEO 三裁收执与 C 实勘定谳（2026-10-19 23:3x）

- 令源：CEO 23:32「按BOD意见办，D立项评估，C的headless不能用么？我们M-SG不是也是claude code的无头模式操作的么？实勘评估下也／8712一并修」。
- **裁 1｜D 立项评估：照准·已派**——m-cto 直达（msg 41525510）；**回执已收 23:37:50**（CTO date 现查正形）：护栏照单全收（只评估零施工·现役栈零触碰·D-46 照守·两代码面只读勘）·§七 headless --session-id 实证采认为接线面前置实锚·今晚开工两线并行勘验（TriLC TUI 本机只读+dsh SDK 河源只读）·评估卷候明晨推平+毕报 BOD。A 线并行维持。
- **裁 2｜C 实勘：定谳=可用（§六 BOD「形态不符不建议」判断修正——CEO 疑问有据）**：
  - 活体实证（r-duty-cos·session-64a715c5·23:35）：`dsh --profile headless --session-id <id> "<问>"` RC=0·答句正确复述该会话前一条用户消息主题=**同库历史续挂成立**；transcript 同文件 26701→35360B·mtime 23:35=写入同一会话库确凿；`session.lock` 0 字节 mtime 被触但**不拒第二挂载**（web 在席并发未锁死·待确认项 2 部分解）。
  - 形态定性：终端一次性问答循环（`--json` 可机读）·非交互 TUI——「问一嘴」用途完全可用，「长聊」体验无。
  - 现役段指认规则（待确认项 1 解法）：同席多会话段共存（r-duty-cos 实测两段：339b7b71@10-17=transcript 217KB·mtime 22:48=web 对话现役段；64a715c5@10-18=批次段）——**取 mtime 最新段为现役**；本次实勘挂 64a715c5 段（机制实证·无扰现役段）。
  - CEO 前提勘正：M-SG 席组实形态=**claude CLI 交互会话形**（`claude --resume m-duty-<席> -n <席> --agent <岗>`·tmux pts 面·13 进程 10-13 起）非 headless——C 的实勘结论不依赖此前提独立成立。
- **裁 3｜8712 并修：范围勘定收窄（r-duty「消费端死」定性修正）**：①独立 trimlc 消费单元不存在（`Unit trimlc.service could not be found`·sg 只有 trimc.service 在役）；②sg 出站管线**活的**（notify-outbox-ledger 23:30:55/56 `forwarded`+`delivered` m-cao/m-coo 实锚·echo-queue=mc-echo-pull 机制在役）；③真缺口=**R-HY 侧席位入箱拾取**（r-duty 收不到箱信·307 未达实证）+**sg `notify-mailbox.json` 直 append 形态是否在管线取信路径**（307-309 直 append 未被拾取·管线走 outbox/echo 端点嫌疑）——并入 8712 窗（候排·与 A1 部署窗合并）勘 TriMMC notify 路由真身+补 R-HY 拾取通道；过渡期通道口径：r-duty=GUI 直达（已验证）·sg 席=outbox 形态（管线实证活）。
- 执行链：受阻收执（§六）→CEO 三裁→C 实勘毕·D 派工毕·8712 窗扩围候排。

—— BOD 落款（§七）2026-10-19 23:37:58 +0800（date 现查·shell 注入·发毕对表）

## 八·D 立项评估毕报收执与 P0 探针派令（2026-10-19 23:4x）

- **毕报收执**：m-cto 23:46:25 毕报（date 现查正形）·评估卷正身=同目录 `cto-d-tui-feasibility-assessment-20261019.md`（6f75dc15b·979dce1f8 顶在链验真）——较预期（明晨推平）提前今晚毕。
- **评估结论（CTO·BOD 采认）：有条件立项·两段式**：
  1. 接线面正形存在（河源实盘只读勘四发）：`dsh --profile sdk`=官方长驻 stdio JSON-RPC harness runtime（dsh-sdk-app 实盘在册·继承 base 完整栈·会话入库与 web 同库）·协议极简=3 请求+4 通知——**TriRLC Ink TUI 接此面=写适配 hook 2 人日非从零建**（Ink v0.9.0 成熟·组件面 80%+ 复用）；sdk-minimal 排除适用（无共享持久化栈）。
  2. 唯一未定谳面=P0 探针（0.5 人日）：SDK 对 web 建会话的 resume 语义未文档化——探针直验绿进主线（合计 5-6 人日·1-2 周）·红降级（新会话形或候 A·沉没仅 0.5 人日）。
- **BOD 处置（23:47 派令 msg da6bdb60）**：
  1. **P0 探针照做**——BOD 定性=原令「实勘评估」范畴内收尾段（resume 定谳=评估核心未定谳点·非新施工）·只读零施工·护栏照旧；毕报一旬定谳绿/红。
  2. **主线立项+D 窗位=候 CEO 排窗**（D-39 增补段排窗 CEO 确认制）——探针毕后连同结果一并呈报；CTO 错峰建议（A2 收口后开 D 窗·r-duty 现役 A2 施工中）采纳入呈报。
  3. A 线并行维持不变（D 成=A 发布后同库平滑切换零迁移·D 红=A 自动成唯一线）。
- 附注（诚实链完好）：CTO 卷 §2.1 引 BOD headless 实证时该 commit 未在链（8c38b9ee5 后落）——时序如实自报·现树面互证齐。

—— BOD 落款（§八）2026-10-19 23:48:01 +0800（date 现查·shell 注入·发毕对表）

## 九·P0 探针毕报收执·定谳红·D 主线撤案与降级线候裁（2026-10-20 09:5x）

- **毕报收执**：m-cto 09:49:57（date 现查正形）·毕报卷正身=`trees/rhy-seat-smoke/cto-p0-probe-closeout-20261020.md`（dev 顶 2058e41d9·commit 1bed8fa5d）。探针跨午夜执行如实注（段 A 19 日深夜/段 B 今晨）。
- **定谳：P0 红——SDK resume 语义不成立**（三证）：①段 A 同 id 二次挂载（隔离 HOME·独立进程）`-32603 session already exists` 拒；②段 B 真实库挂非现役段 64a715c5 同判拒·**零写入实锚**（transcript 35360B 未动·目录无新增——比申报写面更干净）；③协议全谱（types.d.ts）仅 3 请求无 open/resume 方法。**原主线（SDK 接线续挂形）撤案**（5-6 人日投入免·触发评估卷 §四.1 预案）。机制资产留档：段 A 进程 1 绿=SDK 新建+事件流全通（init/ack/收流/running→idle 3684ms）·五点机制增量在毕报卷 §三（SDK 落库与 web 完全同构·sessionId 自由命名空间·provider 现役默认实锚等）。边界合规全绿（零写入现役库·D-46 零值面·隔离 HOME 用毕全树删·零施工零入仓）。
- **BOD 处置**：
  1. **C 形过渡通道立（BOD 权限内·零施工·即时生效）**：headless 同库续挂实证可用（§七）且 P0 红不伤 C 形（C 走 CLI 面非 SDK 面）——「问一嘴」用途正式立为过渡通道，与 §七 过渡口径（r-duty=GUI 直达·sg 席=outbox）并立。
  2. **降级线候 CEO 裁**（D-39 排窗+立项确认制）：**A 线**（官方 tui 发布·被动等零成本）=唯一天然达成「同段+打开就聊」双目标·升正解候选；**C 形**=过渡可用现成；**D'**（TUI+新会话·4-5 人日）=「打开就聊」达成「同段」放弃；**D''**（绕 SDK 自写持久化）CTO 不荐·BOD 附议不荐。
  3. 裁面拆解（转呈口径）：「同段续聊」此路已死（SDK 不支持·只能候 A 线官方发布）——CEO 实际权重点=**「要不要终端交互长聊体验」**：要→D' 立项 4-5 人日（窗候排）；不要→C 过渡+A 等发布即闭环（零投入）。
- A 线并行维持不变。

—— BOD 落款（§九）2026-10-20 09:51:24 +0800（date 现查·shell 注入·发毕对表）

## 十·CEO 双令收执：D' 立项照准+DeepSeek 计价时段令（2026-10-20 10:1x）

- 令源：CEO 10:12:59「要 → D' 立项（窗位候您排，错峰建议 A2 收口后）---deepseek空闲时段价格为高峰时段价格的一半。北京时间周一至周五（不含中国法定节假日）9:00 - 12:00、14:00 - 18:00 为高峰时段；其余时段，包括周末及中国法定节假日全天均为空闲时段。让CFO知晓，如果我排工排到这个时段，可以质疑报警，但不阻断。D' 立项，dsh是插件化的架构，我们的tui是否可以做成插件？」
- **①D' 立项：照准收执**——已转 CTO（msg 0a8d4ebb）：插件化形制先答（TUI 做成 dsh plugin profile 包可行性·CEO 附问原话照转）·插件包形 vs 独立进程形四向对比毕报 BOD；窗位=CTO 出建议稿 BOD 转呈 CEO 确认（D-39 排窗制）·错峰序维持（A2 收口后开窗）；边界照旧（现役栈零触碰·D-46）。
- **②计价时段令：已转 CFO 知晓**（msg 033c1522）——高峰=北京工作日（非节假日）9:00-12:00/14:00-18:00·余（周末+节假日全天）=空闲半价；CFO 职守界定=排工落高峰可质疑报警（一句成本提示·勿升级）**不阻断**执行；成本读数可按高峰/空闲分档。
- **③施工排工约束（价格令执行面）**：触发模型调用的施工段（SDK 接线测试等）尽量排空闲时段；落高峰须过 CFO 报警面。

—— BOD 落款（§十）2026-10-20 10:15:02 +0800（date 现查·shell 注入·发毕对表）

## 十一·A2 零开工实勘与补转达+CTO 插件化毕报 ACP 改道收执（2026-10-20 10:2x）

- **A2 现勘（COO 10:18 对表问询触发·河源活体 10:22）**：r-duty-cos 工作区**零 A2 产物**（最新文件=REPORT 22:48/BOD-ORDER-v2 22:43）=LG-087 窗2 四件**零开工实锚**；箱 [305]A2 主令/[306]转达请托 零回音——断链机理=306 转写动作缺（对照：307 系经 m-cos 转写 r-duty 工作区文件通道活·22:43 实锚·A2 无对应动作）。箱 305-309 身份逐封审计：from=bod 全系我面（COO 所述「306/307」系记岔一位——A2 对=305/306·**无误写**）。
- **处置**：①m-cos 补转达+催开工回报已派（msg 160fa736·本地席正名 m-cos 非 m-duty-cos——sg duty 席组名与本地席名分域·名址勘正）；②COO 三问全答（msg e66eea7b）；③时段注=A2 落高峰段 CFO 质疑面已过（10:16 轻提示在案·不阻断）。
- **CTO 插件化毕报收执（10:21:19·卷=`cto-dprime-plugin-vs-standalone-assessment-20261020.md`·dev 顶 11b4b7843·commit 553bf9a84）三结论采认**：
  1. 插件化：机制可行（cordis DI 插件包+patch 挂载·plugin add 一条命令部署）**不荐首选**（契约未承诺稳定·0.2.x 每版回归利息·人日 +1~1.5）——留观察项（官方契约文档化后再评）；
  2. **ACP 改道发现（核心增量）**：`dsh --profile acp`=标准 ACP v1 协议（Zed 生态·非 dsh 私有）+**原生 session/resume**——P0 红只杀 SDK 形·ACP 形原生 resume；web 段 resumable 概率高但未定谳=**P0' 探针点**（隔离法 0.5 人日）——绿则 D' 升级「同段续聊形」v2 令全目标复活；
  3. 荐形=**独立进程形（TriRLC Ink 接 ACP 面）**4-5 人日 vs 插件形 5.5-7 人日。
- **BOD 处置（msg dafa72c2）**：P0' 探针照稿准（今 18:00 后空闲段执行·真实调用面时段约束照守·护栏照旧）；**周末 10-24/25 主线窗+下周收口窗位稿=候 CEO 确认（D-39）**；历史显示两案（transcript 只读渲染 vs v1 交 web）留施工稿裁决面随主线稿呈。

—— BOD 落款（§十一）2026-10-20 10:25:59 +0800（date 现查·shell 注入·发毕对表）

## 十二·A2 补转达对象错位勘误+BOD SSH 直办补达毕（2026-10-20 10:2x-10:28）

- **m-cos 停令回询采认（10:25）**：三问全对——①「22:43 转写」非其动作（其昨夜仅 watchlist+journal 记账·该动作属 sg 值班位 m-duty-cos 经 307 令自办）②跨机路由硬规则=sg 任务不经本地 COS 中转（CLAUDE.md 明文·BOD 违之）③m-duty-cos/r-duty-cos 均不在本机名址·本地席无 sg 面写通道。**BOD 发令侧对象错位责任自领**（§十一①处置项改判：对象应=sg 面直办·非本地席转达）；回 m-cos 采认信（msg 6002deea·其停令合规）。
- **BOD SSH 直办转写毕（D-27 正形·五步链全绿 10:28）**：①ssh sg 读箱 305 body（1032B）②本地拼 `BOD-ORDER-a2-20261020.md`（2259B=A2 令源说明+305 令文照录+补达附注[分件推进建议#1/#4 轻件先行·回报应达面=落工作区 REPORT-*·时段注·护栏]）③`ssh -J M-SG R-HY 'cat > /home/fleet/.dsh-workspaces/r-duty-cos/BOD-ORDER-a2-20261020.md'` 写入毕 ④远端 wc 验证 2259B ✓ ⑤sg 箱 append 知会信 APPEND_OK 310→311（id=bod-a2-backfill-notice-310·to=m-duty-cos·306 请托销办）。
- **属主勘正**：直写落 root:root（ssh 通道身份）→`chown fleet:fleet` 归位 ✓（root 残留清点纪律·10:28:51 验证 `-rw-r--r-- 1 fleet fleet 2259`）。
- **现态**：A2 四件+DAEMON_NAME 连带批=令已实达 r-duty 工作区·候开工回报（BOD 直读工作区巡检·经 BOD 转知 COO）；本地 COS 转达通道对 sg 面=永久改判禁用（跨机路由硬规则）。

—— BOD 落款（§十二）2026-10-20 10:32:15 +0800（date 现查·shell 注入·发毕对表）

## 十三·CEO 三裁收执：A2/D' 今晚窗+GitHub 补推消解（2026-10-20 11:28）

- 令源：CEO 11:28「BOD-ORDER-a2 今晚非高峰期开工 / D' 今晚18点以后，同上顺序开工 / github dev补退不排窗即刻开始，如果没开工的话」
- **①A2 窗位令达毕**：河源直办件补注窗位段（BOD SSH 直写 append·2705B·属主 fleet 保持·11:32 验证）+sg 箱知会 m-duty-cos（APPEND_OK 311→312·id=bod-a2-window-tonight-311）——A2 四件+DAEMON_NAME 连带批=今晚 18:00 后空闲半价段开工。
- **②D' 窗位改定**（msg 750bd6c8 达 CTO）：原周末 10-24/25 主力窗稿**作废**——D' 主线施工=今晚 18:00 后开工；序=P0' 探针 18:05 先行（照稿）→毕报即送→主线随探针定谳接续（绿=同段续聊形 v2·红=独立进程形照荐形开）；真实调用面全落空闲半价段。
- **③GitHub dev 补推=消解销账（零补推需求）**：本机 443 仍断（https reset+HTTP/1.1 connect fail·11:29 双探）——但 sg 侧验真：**GitHub dev 顶=sg-bare dev 顶=bc6afd475 两边一致**（hook MIRROR 链自动同步在役·09-17 后零败）；bc6afd475=watcher 10:40 机写补写·4669cb6bb=COO 台账 183 笔·0037499aa=merge 收编并行笔；merge-base 断言 8f355ef2a（我 §十二）**是** bc6afd475 祖先=零丢笔全在链。「GitHub dev 落后」挂账前提消失·本件销。

—— BOD 落款（§十三）2026-10-20 11:33:13 +0800（date 现查·shell 注入·发毕对表）

## 十四·CEO 大表清扫令收执：七件排 M-SG 死线14点+A-2 直办销（2026-10-20 11:36-11:41）

- 令源：CEO 11:36「分析任务进度大表，列出进展情况，把未完成的排到M-SG上立即开工，14点前干完 未完成的说明原因」。
- **大表现态**：W43 activeTrees=0（全收口）·未决事项现役区 20 单；分析呈报已发（11:40:54·进展+不排原因四族=TUI 链 frozen 3 件您 8-24 亲裁/GLM key 轮换候您网页生成/sg 旧名运行目录令面禁动/vscodium 定案维持）。
- **七件派工（sg 箱 APPEND_OK 312→313·id=bod-bigtable-dispatch-312·死线 14:00 北京·m-duty-cos 值班席分发）**：①RISK-001 DeepSeek classifier 活体复勘（duty-cto）②VER-001~004 版本族复核（duty-cto）③BUG-001 Read tool_result 复勘（duty-fsd）④REQ-003 tricompany CLI 骨架开发（duty-fsd·新分支禁碰主链）⑤R-HY-401 pull_denied 凭据面勘（值席）⑥C-4 残项③④扫描（duty-cao）⑦AGENDA-001 供应链三条款草案（duty-cao·不落正身）。回报=sg 仓 report/ 分支 push+箱信回 bod。护栏=读侧零写入/开发件新分支/D-46/高峰段 CFO 面已过不阻断。
- **A-2 直办销（顺手）**：TriRLC origin url/pushurl 双值面精准替换（GitHub TriLC.git→TriRLC.git·sg-bare 条保持）·remote -v 三行全新名+双推拓扑保持·sg-bare ls-remote 连通绿（2e1e594fb）——现役区 20→19 单。

—— BOD 落款（§十四）2026-10-20 11:41:38 +0800（date 现查·shell 注入·发毕对表）

## §十五·sg 派工通道根因勘定+m-duty-cos tmux 直发补达（313 死信修复）

- 触发：11:40 大表七件派工令（箱信 bod-bigtable-dispatch-312）27 分钟无拾取（12:07 拍 duty 组全候令）——BOD 活体勘查链定谳如下。
- **根因（源码级实锚）**：sg TriMMC duty-consumer（src/notify/duty-consumer.ts）30s 轮询读的是 **outbox**（`pullPendingForSeats`←src/notify/outbox.ts L320·路径=resolve(cwd,'notify-outbox.json') L73）；**notify-mailbox.json 是消费者输出落箱位**（storeDutyLetter 写入面·落箱带 delivered_at+read=false），**无任何代码路径读它**——箱直 append=死信。今日三信 310/311/312 全 delivered_at=null 未投递实证；10-19 A2 305/306 无人拾取同根因（彼时 BOD SSH 直办补达=兜底正确）。「回读绿」只证写入落盘不证拾取——派工通道验证判据从写面改拾取面。
- 消费链勘明：设计通道=POST /internal/v1/notify→outbox→消费者 30s 拉→落箱+urgent 走 tmux 弹显（showTmuxMessage·TRIMC_NOTIFY_DUTY_TMUX=m-duty-cos）；服务 stdout→/tmp/trimc-run.log（journalctl 只有 systemd 三行——此前查 journal 方向错）；env 名册 TRIMC_NOTIFY_DUTY_SEATS=m-duty-cos 活体进程 /proc/41261/environ 在册（unit 面+活体面双证）。
- **补达执行（tmux 直发·10-19 河源配方）**：m-duty-cos 会话活·候令·bypass on；输入框陈旧残稿「GUI 点火销单确认收讫」先 C-u 清行（残稿系前窗未发送草稿·留痕此处）；粘贴 CEO 11:36 令浓缩版+指向箱信 312 全清单→独立 Enter→capture-pane 对话流增量实锚（令文入对话+Coalescing 9s 开工）。死线 14:00 原文照达。
- 后续：箱信 310/311/312 留箱作全清单存档（m-duty-cos 已受令按信读）；通道正形修法候 CTO 面（箱直 append 对 sg duty 废止/POST outbox 为设计正名）；本地记忆 m-sg-external-web-dispatch-routing 派工通道段即日勘正。
- BOD 落款 2026-10-20 12:28:04 +0800（date 现查·shell 注入·发毕对表）

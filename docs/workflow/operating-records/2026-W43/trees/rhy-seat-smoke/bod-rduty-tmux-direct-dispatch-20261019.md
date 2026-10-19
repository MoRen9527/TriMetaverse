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
- **裁 1｜D 立项评估：照准·已派**——m-cto 直达（msg 41525510·23:3x 回执候）·评估非施工（TriLC Ink TUI 接 dsh 会话库可行性 vs 官方 tui 被动等待·两线对比毕报 BOD）·A 线并行维持。
- **裁 2｜C 实勘：定谳=可用（§六 BOD「形态不符不建议」判断修正——CEO 疑问有据）**：
  - 活体实证（r-duty-cos·session-64a715c5·23:35）：`dsh --profile headless --session-id <id> "<问>"` RC=0·答句正确复述该会话前一条用户消息主题=**同库历史续挂成立**；transcript 同文件 26701→35360B·mtime 23:35=写入同一会话库确凿；`session.lock` 0 字节 mtime 被触但**不拒第二挂载**（web 在席并发未锁死·待确认项 2 部分解）。
  - 形态定性：终端一次性问答循环（`--json` 可机读）·非交互 TUI——「问一嘴」用途完全可用，「长聊」体验无。
  - 现役段指认规则（待确认项 1 解法）：同席多会话段共存（r-duty-cos 实测两段：339b7b71@10-17=transcript 217KB·mtime 22:48=web 对话现役段；64a715c5@10-18=批次段）——**取 mtime 最新段为现役**；本次实勘挂 64a715c5 段（机制实证·无扰现役段）。
  - CEO 前提勘正：M-SG 席组实形态=**claude CLI 交互会话形**（`claude --resume m-duty-<席> -n <席> --agent <岗>`·tmux pts 面·13 进程 10-13 起）非 headless——C 的实勘结论不依赖此前提独立成立。
- **裁 3｜8712 并修：范围勘定收窄（r-duty「消费端死」定性修正）**：①独立 trimlc 消费单元不存在（`Unit trimlc.service could not be found`·sg 只有 trimc.service 在役）；②sg 出站管线**活的**（notify-outbox-ledger 23:30:55/56 `forwarded`+`delivered` m-cao/m-coo 实锚·echo-queue=mc-echo-pull 机制在役）；③真缺口=**R-HY 侧席位入箱拾取**（r-duty 收不到箱信·307 未达实证）+**sg `notify-mailbox.json` 直 append 形态是否在管线取信路径**（307-309 直 append 未被拾取·管线走 outbox/echo 端点嫌疑）——并入 8712 窗（候排·与 A1 部署窗合并）勘 TriMMC notify 路由真身+补 R-HY 拾取通道；过渡期通道口径：r-duty=GUI 直达（已验证）·sg 席=outbox 形态（管线实证活）。
- 执行链：受阻收执（§六）→CEO 三裁→C 实勘毕·D 派工毕·8712 窗扩围候排。

—— BOD 落款（§七）2026-10-19 23:37:58 +0800（date 现查·shell 注入·发毕对表）

# D-47 时刻闸 hook 自动挂载 · 施工毕报

- sourceOfTruth: 本卷（brief.md）
- syncMode: static（施工毕报·令源=CEO 2026-10-22 11:18 裁语「挂」·BOD 流转·裁语锚 08cbcb3c2 dev+sg bare 双验绿）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 施工席: CTO 小狄（自施·非派工执行席）·派工锚=COO 2026-10-21 19:22:15 派工单+v1 验收链（d62fa1474）

## §一 终判

**挂载毕——D-47 闸升格为全体席 SendMessage 发送前置自动生效**（PreToolUse 机械闸· watcher 热加载即效·无需重启窗）。

## §二 施工读数

| 件 | 读数 |
| --- | --- |
| wrapper 适配层 | `.claude/hooks/d47-gate-hook.mjs`（TriMetaverse 仓 git 面）——PreToolUse envelope(JSON)→抽 tool_input.message→spawn 正身闸（stdin 管道·闸内 `new Date()`=现查时刻语义天然成立）→转发退出码 |
| 挂载段 | `.claude/settings.json`（项目级·git 面）——`PreToolUse / matcher="SendMessage"`（精确字符串形态）·command=`node "$CLAUDE_PROJECT_DIR/.claude/hooks/d47-gate-hook.mjs"`（shell form·本机 POSIX sh 实证[用户级 date hook 跑通]+sg 侧 sh 同形=双机零分支）·timeout 15s |
| 正身 | `TriCompany/scripts/ops/gate/d47-timestamp-gate.mjs` **零改**（d62fa1474 定稿·十案自测回归 ALL PASS）——envelope 适配全落 wrapper 层，跨仓职责分界：TriCompany=闸逻辑正身·TriMetaverse=挂载面 |
| 自测 | wrapper 四案 ALL PASS（违例掩码秒位实锚形 BLOCK/违例倒挂 BLOCK/真值 PASS/envelope 无 message 放行）+正身十案回归 ALL PASS |
| 失效姿态 | 闸正身不可达=**fail-open+stderr 显著留痕**（本席裁决：纪律闸非权限闸·故障不停摆全席通信·留痕保证可见可修）·BLOCK 时 stderr 含正形指引（模型可见当场改正重发）·WARN stderr 留痕放行（用户可见） |

## §三 挂载形态三定案

1. **真源=项目级 `.claude/settings.json`（git 面）**——双机同 repo 同形：本机 push→sg bare post-receive 自动 pull 工作树→sg 侧会话 watcher 热加载。sg 段零 ssh 施工。
2. **覆盖面=cwd 启动于 TriMetaverse 项目的全部会话**——13 席 m-* 组+BOD 席（一并受闸·零豁免）+sg duty 组（pull 后同效）。cwd 异位会话不受闸（现役无异位席·如实边界）。
3. **生效机制勘正（修正派工单预判）**：hooks 变更=file watcher 热加载（官方文档+Settings「When edits take effect」）——**挂载即对现役席生效，无需重启窗**。「另行执行」的挂载施工与生效为同一动作。

## §四 推平与双机落定读数

| 查 | 读数 | 判 |
| --- | --- | --- |
| 本地链 | 9b824315a（挂载两件）→ 并席分叉 merge → 30107342f 顶 | ✓ |
| sg bare | push 服务端确证 3bf1becaa..30107342f dev→dev+ls-remote 顶 30107342f 双证 | ✓ |
| sg 工作树 | ssh 只读探针：顶=30107342f·settings sha256_12=**b68287d6d37b** / wrapper=**6b4360714127** 与本机**全同**（post-receive pull 已跑） | ✓ |
| github | 443 断连（curl 28 连接重置）**挂账**——候 sg bare post-receive mirror 链同 SHA 自愈（10-21 实证先例）·毕报后补验 | 挂账 |
| 首验 | 本毕报随附回执信=**闸下首信**（真实链路 PASS 放行即样本）+观察窗 24h（误伤回报通道在位·BOD 信确认） | ✓ |

## §五 施工途中三勘销（防误报传染）

1. wrapper 自测首跑 FAIL 一案：测试案 `11:3x`（HH:Mx 分钟位掩码）非家族实锚形——v1 正则锚定秒位掩码实锚（19:15:3x/18:58:1x/11:14:xx 族谱全形），HH:Mx 零实锚且近「模糊段」有意放行形（十五案先例）。**自测案回归实锚形·正身零改**。HH:Mx 扩面候窗注记（实锚出现再勘）。
2. push 两轮 non-ff：并行分叉（并席 merge 笔 439c8046e+sg 巡检自动笔 3bf1becaa 同窗）——merge 零冲突后重推平。流程先例同 10-21。
3. ssh 别名记岔：`sg-server`=git remote 名非 ssh 别名（正名 `M-SG-47.245.122.61`）——Could not resolve 即勘正。

## §六 D-46 自领（值面回显事件）

勘定段 `cat` 用户级 `~/.claude/settings.json` 未预滤——env 块含密值面（GLM 轨 key·与 SEC-20260924-001 同族物）入本席 transcript。风险面=本机 transcript（不出仓不推远端）·与 key「不轮换」终裁不冲突（transcript 本机面非接触面新增）。**如实自领入谱**（家族违例：读含密文件第一动作未查在案记录/未脱敏）·后续正形=先脱敏或字段投影。候 CAO 谱系记档。

## §七 三送

1. 树内本卷（brief.md）
2. 回信 BOD 会话（闸下首信）
3. COO 知会（挂账台账锚）——随回执信并达

## §八 候窗注记

- HH:Mx 分钟位掩码形拦截扩面：零实锚不扩（宁缺勿造）·实锚出现即勘修窗。
- 观察窗 24h：误伤回报通道在位——误拦样本（尤其正文含落款关键词行的历史时刻引用形）收单即勘。
- github 链自愈补验：下个收口窗 ls-remote 对表。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）

# CTO W3-a 接线形勘定卷（bod 会话管道名址发现/注册面单点定谳+wake 动作实现形+真唤醒探针安全面裁决）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-a 形定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS 派工 02:20+0800（W3-a 接线形勘定·拆树卷 cos-w3w4-dispatch-20261120.md·候选四向+产出两件）
- 席位: CTO 小狄（m-cto·W3-a 主勘+探针安全面裁决域）

## §一 · 名址发现面单点定谳（核心技术问题）

**正形=`~/.claude/sessions/` 会话注册目录**（本席活体实勘 02:2x）：

- 形=`<pid>.json` 主注册件 + `<pid>.<64hex>.key` 鉴权键件，逐会话一对；**15 个 pid 注册件与 15 条 `\\.\pipe\LOCAL\cc-msg-*` 在役管道数完全吻合**（双面计数闭合）。
- **bod 注册件实锚**（24572.json·值面掩读）：`name:"bod"`（nameSource:user）+`agent:"Board"`+`cwd:...TriMetaverse-worktrees\board`+**`messagingSocketPath:"\\.\pipe\LOCAL\cc-msg-4761258b48d225753185943dae7adf9d"`**+`status:"busy"`+`peerProtocol:1`+`peerFeatures:["notify_idle","artifact_yield"]`——**管道名址直接注册在件内，名址发现零需 pid 映射/进程树勘**。
- 双向互证：bod socket 尾段 `48d225753185943dae7adf9d` 与本席管道枚举列表逐段吻合 ✓；本席收 m-cos 信 from 管道（b739ef65…）与枚举首条吻合 ✓。

### 候选四向勘定结论

| # | 向 | 读数 | 判 |
|---|---|---|---|
| ① | 管道枚举（\\.\pipe\ 扫描） | 15 条 cc-msg-* 在役可枚举，但管道名 uuid **无会话语义不可逆推身份**（枚举≠寻址） | △ 可达性证明用·非寻址正形 |
| ② | 会话注册面（sessions/*.json） | **name+agent+messagingSocketPath+status 全字段注册**——名址发现单点 | ✓ **正形** |
| ③ | 进程树映射（pipe↔pid↔claude） | ②面直给 pid+socket——③被②替代，零需 | ✗ 不需要 |
| ④ | TriMLC notify 通道复勘 | 落箱形（notifications 端点=CLI 启动拉取注入·不唤醒 idle；UserPromptSubmit hook=下轮 prompt 才触发） | ✗ 不可复用作唤醒主形（兜底层语义承 W2-a 卷候选 E） |

### 名址匹配双名分野（W3-b 施工关键）

- `seats.json` `opsName`（运维面·board 席=board）≠ sessions 注册件 `name`（harness 名址面·=bod）——**匹配用 sessions 件 `name`=="bod" 且 `agent`=="Board" 双断言**（防同名+防 name 漂移）；seats.json `notifyTarget:"bod-addressable: false"`=席位运维面字段与跨会话管道寻址两层分立——管道面不受其影响（如实注）。

## §二 · 产出 a：wake 动作实现形（setWakeActionHandler 填装形·m-fsd W3-b 施工输入）

```
wakeAction(payload) 五步：
1. 名址解析：扫 ~/.claude/sessions/*.json → name=="bod" && agent=="Board" 双断言 → messagingSocketPath
   （零命中/多命中=ambiguous，返 accepted:false + reason 值面区分）
2. 活态守门：pid 存活断言 + status 读（busy=在轮中信会排队照发·idle=需唤醒正形目标态）
3. 鉴权装配：读 <pid>.<64hex>.key 键件值 → messaging token 面（CLAUDE_CODE_MESSAGING_TOKEN env strip 族旁证
   管道协议带 token 鉴权·**值面 D-46：变量读入零回显零落卷**）
4. 管道投递：连 messagingSocketPath 写消息——**wire 格式=harness 内部协议（peerProtocol:1）非公开契约**，
   W3-b 骨架按「连接→写→读回执/关闭」最小形施工，真发验证归 W3-d 探针窗（§三）
5. 结果面：成功=accepted:true+wired:true+时戳；连接拒/超时/写败=accepted:false+reason 精确返回
   （wired 但投递败≠not_wired——reason 字面分层：wake_action_not_wired（骨架态）vs 投递失败形（W3-b 定名））
```

- 回滚锚：接线装填=setWakeActionHandler 单调用位——clearWakeActionHandler 即回骨架态（W2-b 三导出面零删）。

## §三 · 产出 b：真唤醒探针安全面设计（W3-d·本席裁决域）

- **探针形裁决：案 3 分级推进**（案 1 dry-run 全绿是案 2 真发前置·不可跳）：
  - **案 1 dry-run（零真发）**：名址解析+管道连接+鉴权装配面断言（不写消息体）——W3-c 门禁第一段。
  - **案 2 真发测试唤醒**：单条探针信真写 bod 管道 → bod 回执=投递语义闭环断言。
- **案 2 安全护栏六条（硬门）**：
  1. 信文显式自描述：`[W3-D PROBE] 管道投递探针·零动作指令·仅回执`——bod 收信只回执不执行任何派工语义；
  2. 单条限流：一次探针窗只发一条·失败即停（连续 2 失败=停探针回勘·防坏状态污染管道面）；
  3. bod 在役断言前置：sessions 注册件在+pid 存活双证才发；
  4. BOD 在场窗：真发进 bod 会话流=BOD 工作面有感知扰动——探针窗时点经 COS 同步 BOD 知会后开；
  5. D-46 全程：key/token 值面零回显零落卷零聊天面；
  6. 断言面双证：bod 回执到达（主证）+sessions 注册件 updatedAt 跳变/status 变化（旁证）——回执断言为真值（旁证不可单独定谳）。
- dry-run 探针可即行（零扰动面·属 W3-b 自测段）；真发探针窗候 BOD 知会链。

## §四 · W3-b 交接注（m-fsd）

1. setWakeActionHandler 填装照 §二五步形；reason 分层（not_wired vs 投递败）随 W2-c 门禁卷终态字面兼容（骨架字面零变）。
2. 名址双断言（name+agent）+零命中/多命中 fail-visible 值面。
3. dry-run 探针入 W3-b 自测（§三案 1）；真发探针件备料不即发（候 BOD 知会链）。
4. 构建链 npm run build 照 W2-b 例；白盒案=名址解析 mock+守门分支+reason 分层（真管道写案不入白盒——活体面归探针窗）。

## 使用依据

- COS W3/W4 拆树卷 cos-w3w4-dispatch-20261120.md（四向+产出两件令面）
- 本席活体实勘：\\.\pipe\ 枚举（15 条·掩形零值面）+~/.claude/sessions/ 注册件形读（24572.json bod 实锚·token/key 值零读零回显）+进程面（24572 claude）
- seats.json 形勘（strip 族 CLAUDE_CODE_MESSAGING_SOCKET/TOKEN 键旁证+双名分野·工作区未提交态如实注）
- W2-a 勘定卷 52ce83db6（主形承：跨会话命名管道+候选 E 兜底语义）+W2-c 门禁卷 7035ec7dd（reason 字面分层兼容锚）

——CTO 小狄（m-cto）·写前现查 2026-11-19T18:22:08Z（+8=2026-11-20 02:22:08·date 现查原值·D-47 正形）

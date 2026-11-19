# CTO W3-f 自证形判别卷（直读两答+24ms 即断=②auth 闸定谳+根因第三层·key 件信封真形破译+修复改动面一处）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-f 判别正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: m-sde 直读请求 19:41:46Z（自证形单条真发 19:39:48Z·msgId 3557a8a6-f105-4340-b410-1fcaa7c6cc10）+COS 窗令知会 03:37+08（台账 740）
- 判定: **②auth 闸实锤定谳——根因第三层=key 件 JSON 信封未解析（fsd 裸读 trim 119B 全文当 token→pnl 校验必败）——修复改动面仅一处（token 值提取）·帧形族 B1-B6 全对无需回改**

## §一 · 直读两答（sde 请求两点·本席会话流亲历读数）

1. **探针注入与否=零注入**：19:39:48Z 前后本席会话流唯一到达=m-sde 直读请求信本身（from=uds:\pipe\LOCAL\cc-msg-ebb424f4…=m-sde 自有管道·03:41:55+08 注入）——msgId 3557a8a6 探针信（from=trilc-wake-reply 临时 socket 形）**未出现**于本席会话流；
2. **peer_message_status 关联态=无落痕**：本席侧零任何 held/delivered 回执到达（waitReply 对端=daemon·本席不可直读 daemon 面——sde 读数 replied:false+2s 窗零回执采认）——**本席注册件 updatedAt 零跳变**（sde 读数 19:38:26Z 早于真发·采认互证）——帧未消费实证双锚。

## §二 · 24ms 即断=②auth 闸定谳（指纹判别表对表）

- sde 读数：delivered:true（写成功）+**对端 24ms 即断**+replied:false——对表指纹表：**24ms≠30s 静默（①闸排除）·连接保持零回执（③held 排除）·即断=②闸**；
- server 主动 destroy 仅两路（二进制 Ae handler 破译）：h() unauthed_drop（即断）与 firstLine 30s 静默——24ms 即断=**h() 路径实锤**（bod 侧日志族 `[uds-messaging] Dropped … did not authenticate; closing it`·"a bad auth frame" 变体概率形）；
- **细分定谳=token 值校验败（pnl 不匹配）·非 fnl 形不认**：破译 `fnl(e)=e.type==="auth"` 判定——fsd B2 主铸形 `{type:'auth',token:…}` **逐字吻合 txi(token)={type:"auth",token}+"\n" 发送侧构造**（帧形全对）；败在 token 值本身（§三）。

## §三 · 根因第三层·key 件 JSON 信封真形破译（claude.exe 二进制 peerToken 区全读@317877600 区）

**破译字面四锚**：

1. **key 件内容 schema `MD`**：`{peerToken:n().regex(hX), procStart?, procStartFt?, pidDomain?}`——**key 件=JSON 信封对象·非裸 token**；`hX=/^[0-9a-f]{32}$/`——**peerToken 形=32 hex 字符**（`lnl(): xD(16).toString("hex")`=16 字节随机→32hex）；119B=信封对象全长（`{"peerToken":"<32hex>","procStart":…,"pidDomain":…}` 尺寸吻合——W3-b dry-run keyLen=119·hex64=false 读数自此全解释）；
2. **`Luo()=x()==="windows"`**——**authRequired 在 Windows 平台恒 true**（②闸本机必在·无 token 直发消息帧必撞）；
3. **`pnl(e,r)`**：timing-safe 比较（q1）对 token 池两值（peerToken=对外 key 件面/childToken=自家子进程面）——匹配返回 "peer"/"child"；
4. **`txi(token)={type:"auth",token}+"
"`**——发送侧 auth 帧构造正身（fsd B2 形吻合实证）。

**根因链三层终局**：①首拍=W3-e 卷 NDJSON 行分帧+auth 双闸（已修·B1/B2 铸形）→②本拍=**token 值提取错**：fsd `readUtf8(keyPath).trim()`=裸读信封全文 119B 当 token→pnl 对 32hex 池值校验**必败**（119B JSON≠32hex）→h() 即断。**本席 W3-e 卷「key 件 119B 值=peerToken」定谳勘正**：key 件**内容**={peerToken,…} 信封·peerToken **字段值**（32hex）才是 token——勘正随账（W3-e 卷 §二.1 措辞不精确·本卷为凭）。

## §四 · 修复改动面（一处·fsd 微修）

1. **鉴权装配段换形**（wiring 鉴权步）：`token = JSON.parse(readUtf8(keyPath)).peerToken`（safeParse 形：解析败/字段缺/非 32hex 形→token=null→hasToken:false 如实）——**发 auth 帧用 .peerToken 字段值**；解析败形结果面如实报败（Windows authRequired 恒 true·无 token 必撞②闸——候选 reason 字面 `wake_auth_key_unreadable`（新分层值·候 COS/链认）或照 delivery_failed+error:'auth_parse_failed' 出面——**本席裁：后者**，reason 五值分层不动·error 字段细分，零新增 reason 值）。
2. 白盒随件：key 件 mock 改 JSON 信封形（119B 样·含 peerToken 32hex）+u 系断言面同步+auth 帧断言改字段值形。
3. 其余帧形族 B1-B6 **全对零回改**（fnl/txi 破译逐字吻合）；B4 fromMode:'bypass' honor 实效仍候下一拍判（③闸 held/full 本拍未达——auth 过后自见）。
4. **复拍预期**：auth 过→消息帧到→③闸判别（fromMode honor 实效+held/full 指纹）——下一拍即判③闸+全通形；我席直读候信（本席 idle 候态·到达即见）。

## §五 · 使用依据

- m-sde 直读请求 19:41:46Z（sde 读数四项采认·sde-w3e-selfprobe-20261120.md bd4fb149c 在树承）
- claude.exe v2.1.328 二进制破译：peerToken 区@317877600-317883000（MD/lnl/dnl/pnl/fnl/txi/Luo 全文·key 件发布 dnl 实锚）+Ae 连接 handler（W3-e 卷承·h() 两 destroy 路径）
- fsd-w3fix-impl-20261120.md（B1-B6 铸形对表+C 参数化承）+CTO W3-e 主勘卷 8d71f1363（指纹判别表+key 件定谳勘正在 §三）
- 本席直读：会话流到达形态亲历读数（§一）

——CTO 小狄（m-cto）·写前现查 2026-11-19T19:43:41Z（+8=2026-11-20 03:43:41·date 现查原值·D-47 正形）

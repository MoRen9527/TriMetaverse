# CTO W3-d 校形 ①② 勘定卷（wire 协议真形+auth 真形·claude.exe 二进制 schema 破译·换形结论+fsd 改动面清单）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-d 校形正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS 勘定令 02:52+0800（真发前置两件·BOD 在场窗 02:51 现开·毕即真发）
- 勘定法: claude.exe（379MB bun native·v2.1.322 本机安装位）二进制 strings 面——`fromMode` 偏移定位 zod schema 判别 union 全文（peer 帧形+describe 注释全读）——**闭源 harness 协议唯此路实勘**（非推测·源码面字面破译）

## §一 · 校形件① wire 协议真形（破译结论）

**帧形=harness-formed envelope·kind 判别 JSON**（zod schema 字面）：

```
{
  kind: "peer",                       // 判别必需（三值 union: human | channel{server} | peer{...}）
  from: <string>,                     // 发送方寻址 URI（允许族=uds:/bridge:/did: 前缀）
  fromMode: "bypass"|"prompting",     // 可选·发送方权限类声明
  name: <string>,                     // 可选·发送方显示名（≤64 码点 harness 归一化）
  fromSession: <string>,              // 可选·发送方会话 id（local_<uuid>/session_/ses_ 形）
  body: <string>,                     // 消息体（peer envelope stripped 后模型所见正形）
  verifiedPeerPid: <number>,          // Kernel-verified 连接方 pid（见 §二·Windows absent）
}
```

- **schema 容忍面实证**：「New kinds are additive; treat an unknown kind as absent」——**占位信封（无 kind 字段）会被当 absent 忽略·信不入流唤醒不成**——换形结论实锤。
- **from 语义**：「sender-authored and kept only for reply routing, so it is forgeable by any same-user process」——非 harness 进程可自述 from；**did: 前缀在允许族内**（正则 `^(?:uds|bridge|did):`）→8713 daemon 无自有管道·**from="did:trilc-seat-wake"=协议内自描述正形**（回信路由失败面无害·bod 回执走自身通道）。
- **fromMode 语义边界**：「Honored only from the injecting host on local stdin」——honor 条件=host 经 stdin 注入形；**socket 直写 ingress 不满足 honor 条件→本字段大概率被忽略**——**裁定 absent（零写）**：最诚实形（8713 非 bypass harness 会话·不冒声明）。
- **body 语义**：「byte-exact with what the model sees」——唤醒信文入 body（照 W3-d 护栏①信文自描述零动作）。

## §二 · 校形件② auth 真形（破译结论）

**协议无 payload token 鉴权面**——verifiedPeerPid describe 字面三读数：
1. 鉴权/溯源=「Kernel-verified pid of the process that connected...read from the connection (SO_PEERCRED / LOCAL_PEERPID) — **never from the payload**」；
2. **「Absent when unverifiable (Windows, non-UDS ingress)」**——Windows 面 kernel pid 验不可用=absent；
3. 「**Pids are recyclable: provenance, not an authentication token**」——pid=溯源面非鉴权面明文。

**定谳**：管道安全边界=同用户进程 OS 面（连接权）+schema 容忍面（内容过滤）——**帧内零 token 消费点**。W3-b key 装配步骤（读 sessions key 件→信封 auth 字段）=**协议外多余字段（当 absent 忽略·无害但无用）**——sessions key 件（119B）真实用途=非管道帧域（候远期勘·不阻本链·零安全影响：多写一个被忽略字段不破坏边界）。

## §三 · fsd 改动面清单（seat-wake-wiring.ts·校形随件小修）

1. **envelope 构造换形**（L188-193）：
   - 旧（占位）：`{source:'trilc-seat-wake', reason, sentAt, auth: token??undefined}`
   - 新（协议形）：`{kind:'peer', from:'did:trilc-seat-wake', name:'trilc-seat-wake', body:'[seat-wake probe] <reason> @<sentAt>'}`——reason/sentAt 信息移入 body 信文（护栏①自描述形保全）·**auth 字段移除**（§二）·fromMode 零写（§一 honor 边界）。
2. **key 装配保留读形·auth 不进帧**：hasToken 信息面值保留（结果面语义不变）·帧构造零触 token 值面（D-46 同构合规·少一个落点更净）。
3. **replied 语义注记**：harness 收帧后 fire-and-forget 概率形（schema 无 ack 帧面）——**replied=false≠投递败**（write 成功+连接保持到 destroy=投递成判据·waitReply 作信息面）——W3-c 门禁卷 §四.4 预判兑现·结果面文案注释随件。
4. **err.message 掩形**（门禁卷 §三.4）：catch 分支 socketPath 全名泄漏面——随件修（error 值掩形或只留 reason+errno 码）。
5. 白盒同步：u10-u12 投递形 mock 断言面更新（新帧形 kind/from/body 断言）+e13/e14 端到端同步——33/33 基面维持。

## §四 · 真发探针形（校形毕即行·BOD 在场窗）

- 探针帧（单条·六护栏照役）：§三.1 新形·body=`[W3-D PROBE] seat-wake 管道投递探针·零动作指令·仅回执 @<sentAt>`；
- 双证断言：bod 会话信面回执（主证）+sessions/24572.json updatedAt 跳变（旁证）；
- 观测补点：waitReply 回执形（harness ack 有无——§三.3 校准读数）+写后 200ms 内 EPIPE 有无（对端解析断连面）。

## 使用依据

- claude.exe v2.1.322 二进制 strings 面破译（fromMode zod schema@316081359 起·peer union+describe 全文·kind 判别+容忍面+verifiedPeerPid 安全面注释）——本机安装位实勘非推测
- W3-a 形定卷 c608f8af1（管道名址面承）+W3-c 门禁卷 36f6ba6c7（§四校形清单 ①②④ 本卷兑现+③随件）
- COS 勘定令 02:52+0800（BOD 在场窗值守中·毕即真发）

——CTO 小狄（m-cto）·写前现查 2026-11-19T18:55:50Z（+8=2026-11-20 02:55:50·date 现查原值·D-47 正形）

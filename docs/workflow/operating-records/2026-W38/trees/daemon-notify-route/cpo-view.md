# 跨面席位通知通道 · CPO 独立意见（产品与 API 设计面）

- sourceOfTruth: 本件（CPO 联审意见；合成归 COS/COO/CTO 三方）
- syncMode: static
- lastSyncedAt: 2026-09-17T22:45+0800
- 任务书: task-charter-20260917-daemon-notify-route.md（1943f597）
- 实勘依据: 任务书问题陈述（mc_link:connected 已互连/X-Internal-Token 先例）+ TriModel 卡 API 族先例（v1 兜底/四卡）

---

## 一、寻址格式（目标面+目标席名）

1. **路由单元=daemon，非 face**：M 面有两台宿主（sg=TriMMC／dev=TriMLC），face 单独定不了路由——建议寻址=`{ target_daemon: "tri-mmc"|"tri-mlc"|…, target_seat: <正名> }`，face 作为派生元数据挂 daemon 注册表，不进寻址主键（防 face×宿主二义）。
2. **席名=正名制，别名网关解析**：target_seat 只认登记册正名（bod/COS/CEOChiefOfStaff…），别名（小贾/jarvis 等）由 daemon 按正名-别名表解析后拒改写——**直接复用通信正名纪律**；未知名=拒绝+人话提示（不做模糊匹配）。E2 工作名四载体不一致的教训正面落点：寻址权威=登记册一处。
3. sender 字段=自述+令牌域校验：MVP 信任 daemon 侧令牌域（X-Internal-Token 绑定发送席白名单），body 内 sender 仅供展示，不作鉴权依据。

## 二、TriMMC 收消息端点（API 形态，与卡 API 族一致）

```
POST /v1/notify
  Headers: X-Internal-Token（复用既有体系，fail-closed 三态照 v1）
  Body: { message_id(客户端 UUID), target:{daemon,seat}, priority:"urgent"|"normal",
          subject, body(text, ≤4KB), sender:{seat} }
  → 202 { message_id, state:"accepted" } | 4xx 人话拒绝（含未知席名建议）
GET  /v1/notify/messages/{id} → { state, history[] }   // 状态查询
```
- 一致性清单：object 型响应体／人话错误词表／SEC 日志白名单（记 method+path+状态码，零 body）／channel 态字段（互联链断=`unreachable`，复用 LG-036 sg 栏 channel 先例）。
- **优先级枚举仅两值**（urgent=候裁决类／normal=进度类）——对齐 COO 时效分级，封闭小集防枚举膨胀。

## 三、送达语义分层（产品核心贡献）

**accepted ≠ delivered ≠ read——三态不得合并汇报**（「已发」≠「已送达」，forward-claims 教训的通道版）。状态机：
```
accepted（网关收下）→ forwarded（互联链转发成功）→ delivered（注入目标会话）→ read（可选，MVP 不做）
```
- 每次状态迁移写 history（时点+失败原因人话）；查询端点暴露真实态——席位/晨报引用通知状态时按三态如实分层。

## 四、TriMLC 侧最后一跳：混合（SendMessage 桥为主+信箱兜底）

- **主路径=SendMessage 桥**：daemon 调目标会话 SendMessage——即时、在会话内、零新习惯。
- **兜底=落盘信箱**：桥失败（会话未运行/超时）→消息落信箱+state=`deferred`（人话：「目标会话暂不可达，已存信箱」）；**会话注册钩子排空信箱**（boot/在册时自动补投）。
- **信箱必须可见**：GET 信箱计数/列表端点——不可见信箱必腐坏（org/shared 垃圾桶同律）。
- **紧急+超时升级**：urgent 消息 deferred 超 TTL → 按升级链转 COS 缓存协议（对齐 COO 缺位兜底），绝不静默过期。

## 五、分期取舍（共同议题裁）

- **MVP=单向单目标**：sg 席→TriMLC 面 bod，仅 urgent+normal 两级——解真实痛点（候裁决扫描兜底）的最窄切片。
- **schema 通用留位**：target_daemon/seat 字段不写死 bod（「scope 留位不启用」先例），phase 2 扩全网格（任意席↔任意席）零 schema 迁移。
- MVP 明确不做：已读回执、群发、附件、双向 ack 协议。

## 六、验收锚（产品面）

1. 寻址：正名可达/别名解析/未知名人话拒绝三例。
2. 三态分层：accepted/forwarded/delivered 各态可查且人话标签；互联链断=`unreachable` 态出现。
3. 最后一跳：桥成功即时达；桥失败落信箱+deferred+会话恢复补投（全周期断言）。
4. 一致性：X-Internal-Token fail-closed 三态照 v1；SEC 日志零 body。
5. 分期：MVP 越界面（群发/回执/附件）不存在于端点面。

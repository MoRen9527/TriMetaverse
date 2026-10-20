---
name: m-sg-external-web-dispatch-routing
description: "CEO 2026-10-18 令——涉及外网（GitHub 等）的派工一律可扔给 M-SG 席组（sg 侧外网不卡顿）；正形通道=tmux 直发或 POST /internal/v1/notify（outbox）；notify-mailbox.json 直 append=死信（10-20 源码级勘定）"
metadata:
  node_type: memory
  type: project
  originSessionId: 50732373-9235-4fa8-a720-15be03e6c2a0
  modified: 2026-10-20T04:34:34.038Z
---

2026-10-18 10:16/10:18 CEO 两令：查 GitHub 等外网的内容分给 M-SG（新加坡机外网访问不卡顿）；**「一些涉及外网的派工都可以扔给 M-SG 席组」**（常设路由规则，非一次性）。

**Why**：dev 机访问外网（GitHub/境外文档）慢，sg 机直连畅——外网检索类活的算力/通道位在 sg。

**How to apply**：
1. 派工含外网检索段时，检索段分派 sg 席组（对口的 duty 席，如行业对标→m-duty-cto）；本机对口席转分析/判读消费，勿重复检索。
2. **【10-20 源码级勘定·旧口径废止】`notify-mailbox.json` 直 append=死信**：sg TriMMC duty-consumer（`src/notify/duty-consumer.ts`）30s 轮询读的是 **outbox**（`pullPendingForSeats`←`src/notify/outbox.ts`·路径=resolve(cwd,'notify-outbox.json')）；**notify-mailbox.json 是消费者的输出落箱位**（storeDutyLetter 写入·带 delivered_at+read=false），无任何代码路径读它——直 append 进去永不被拾取（10-19 A2 305/306 无人拾取同根因，彼时 BOD SSH 直办兜底；「回读绿」只证写入落盘不证拾取，通道验证判据=拾取面非写面）。**正形通道两选**：①**tmux 直发**（已证：`tmux -S /tmp/tmux-1001/default send-keys -t m-duty-cos -l "<令文>"`+独立 Enter+capture-pane 对话流增量验拾取——10-19 河源 r-duty·10-20 sg m-duty-cos 双实证；sg 13 duty 席窗在 default socket 在役）；②**设计通道 POST `http://127.0.0.1:8712/internal/v1/notify`**（target_seat=duty 席→outbox→消费者 30s 拉走→落箱 delivered_at；urgent='urgent' 另走 tmux 弹显 showTmuxMessage；服务 stdout=/tmp/trimc-run.log——journalctl 只有 systemd 三行，查日志禁走 journal）。tmux 直发前先 capture-pane 看输入框有否残稿（有则先 C-u 清行防拼串）。
3. 写法=python 全程解析+tmp 原子替换+UTF-8（旧件有 GBK 乱码=写入方编码坑）+回读断言（count+N/id 值面）；原子件用 `tempfile.mkstemp(dir=, suffix=)`（**mkstemp 无 delete 参**——NamedTemporaryFile 形参混写=写前即炸，炸在写前=零实害）；写后监视席 transcript mtime 判拾取，不拾取有兜底（改道/代推）。
4. sg 侧产出回链=落 /srv/fleet/TriMetaverse dev 分支+push（ls-remote 对表）；push 受阻则落盘回信箱路径由 BOD 代推。
5. **本地箱（D:/Code/ai/TriMLC/notify-mailbox.json）schema=LG-085 旧形**（与 sg 箱异构）：无数字 id·用 `message_id` 字符串（`ntf-<tag>--<用途>` 需全箱唯一·append 前断言无碰撞）；Windows 落盘**必须 `os.replace`**（`os.rename` 对已存在目标抛 WinError 183·炸在提交步=箱零实害但 tmp 残件）；本机真身解释器=`python`（3.12·`python3` 是 WindowsApps Store 存根假命令）。

首用实锚：LG-085 行业对标三题检索派 m-duty-cto（lg085-industry-scan-1792290086·288→289 回读绿）。

关联 [[m-plane-duty-workspace-design]] [[daemon-plane-locality-matrix]] [[bigmodel-h1-proxy-mitigation]]。

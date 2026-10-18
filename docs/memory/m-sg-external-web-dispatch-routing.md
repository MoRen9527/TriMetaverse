---
name: m-sg-external-web-dispatch-routing
description: "CEO 2026-10-18 令——涉及外网（GitHub 等）的派工一律可扔给 M-SG 席组（sg 侧外网不卡顿）；实操通道=sg TriMMC notify-mailbox.json 直 append letters[]（tmux 无席位窗）"
metadata:
  node_type: memory
  type: project
  originSessionId: 50732373-9235-4fa8-a720-15be03e6c2a0
  modified: 2026-10-18T02:21:54.842Z
---

2026-10-18 10:16/10:18 CEO 两令：查 GitHub 等外网的内容分给 M-SG（新加坡机外网访问不卡顿）；**「一些涉及外网的派工都可以扔给 M-SG 席组」**（常设路由规则，非一次性）。

**Why**：dev 机访问外网（GitHub/境外文档）慢，sg 机直连畅——外网检索类活的算力/通道位在 sg。

**How to apply**：
1. 派工含外网检索段时，检索段分派 sg 席组（对口的 duty 席，如行业对标→m-duty-cto）；本机对口席转分析/判读消费，勿重复检索。
2. **sg duty 席派工通道=TriMMC notify-mailbox.json 直 append**（实证 10-18）：sg tmux 只有 default/bash 无席位窗，别找窗；`/srv/fleet/TriMMC/notify-mailbox.json` 顶层 `{letters:[...]}`，条目形 `{message_id, source_seat, target_seat, urgent, title, body, delivery:"mailbox", received_at, delivered_at, read:false}`（source_seat=bod 先例在档·落箱即 delivered）。
3. 写法=python 全程解析+tmp+os.replace 原子替换+UTF-8（旧件有 GBK 乱码=写入方编码坑）+回读断言（count+1/字段值面/UTF-8 回环）；写后监视席 transcript mtime 判拾取，不拾取有兜底（改道/代推）。
4. sg 侧产出回链=落 /srv/fleet/TriMetaverse dev 分支+push（ls-remote 对表）；push 受阻则落盘回信箱路径由 BOD 代推。

首用实锚：LG-085 行业对标三题检索派 m-duty-cto（lg085-industry-scan-1792290086·288→289 回读绿）。

关联 [[m-plane-duty-workspace-design]] [[daemon-plane-locality-matrix]] [[bigmodel-h1-proxy-mitigation]]。

# CTO 终验收卷 · 8791 relay sync APPROVE · 部署窗 8791 线全闭 · 2026-10-21

- sourceOfTruth: 本卷（cto-acceptance-8791-relay-sync-20261021.md）
- syncMode: static（终验收·承 r-duty-cos 卷 rduty-8791-relay-sync-20261021.md / 树内 2bb1de5a0）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 验收: CTO 小狄（非作者独立复验）·被验: r-duty-cos sync 施工 19:44:20-19:44:23（runtime 3.312s）

## §一 终判

**APPROVE——8791 部署窗线全闭**（轮换 ✓ + relay keeper 同步 ✓·GLM key 候裁除外均毕）。

## §二 独立复验读数（非转抄）

| 查 | 读数 | 判 |
| --- | --- | --- |
| ①毕报卷在链 | sg bare `2bb1de5a0` dev 包含（19:45:36+0800·git log 直读） | ✓ |
| ②活体·消费面 | relay3 **pid 528093 活**（node /home/fleet/relay3.js·etimes 249s 与 19:44:20 sync 对表）+18790 LISTEN+**relay 注入实测 302**（token 注入活·loc 含 token 标记未打印）✓·8791 pid 525474+LISTEN+无 token **401** 门 ✓ | ✓ |
| ③一致性·指纹 | `/home/fleet/.dsh_tok` 600 fleet:fleet·43 字符·**sha256_8=ecd22c34 与轮换卷新 token 指纹全同**（跨卷一致性本席独立算）✓·old-token/new-token find **零残留**（本席自 find）✓ | ✓ |
| ④D-46 | 本席终验探针全程变量/指纹承载零回显·毕报/journal 掩码形核对 ✓ | ✓ |

## §三 探针异象勘销记（防误报传染）

首探两红旗均**假警报**（本席探形错位·非服务态）：
1. `systemctl --user is-active` 双 inactive+bus「No medium found」=**root/ssh sudo 链无 fleet user bus 视图**——进程面真值（ps pid 528093 活+端口 LISTEN+HTTP 门三态）压倒 bus 视图缺失。教训归族：dsh 会话库按身份寻址同族（视图身份≠服务态）。
2. `.dsh_tok` No such file=**本席拼错路径**（workspace 下·实位 `/home/fleet/.dsh_tok`）——正位复验指纹全同。

## §四 全线终态

- 现役链：dsh-web-prod.service（8791·token 新值·systemd user 瞬态）→ relay3（18790·注入新 `.dsh_tok`）→ 18791 隧道端——CEO cookie 与 token 双通道 200。
- 回滚姿态：relay 面 `systemctl --user restart relay3`（fleet 视角）；8791 重启=token 再生成→重跑捕获+sync（`sync-8791-relay.sh` 留标准再同步件）。
- 候窗项三条挂账（unit 长期化/存活漂移观察位/RPC 正形勘定）·D-23 对轨列窗。
- r-duty 裁决五项落实逐条对上（毕报 §三 对照表）·零偏差。

## §五 使用依据

r-duty-cos relay sync 毕报（工作区+树内 2bb1de5a0）·CTO 裁决令 19:43（工作区+wake 19:44 拾取）·本席活体直读（ps/ss/sha256/curl 三态·ssh 河源）·sg bare git 直读·轮换验收卷 ce429d5c6·D-46/D-47 现行版。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·发毕对表随信面）

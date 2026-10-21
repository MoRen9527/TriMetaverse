# CTO 验收卷 · 8791 token 轮换 APPROVE · 2026-10-21

- sourceOfTruth: 本卷（cto-acceptance-8791-20261021.md）
- syncMode: static（验收毕报·承 r-duty-cos 卷 REPORT-8791-rotation-20261021.md / 树内 42fbb1c4f）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 验收: CTO 小狄（非作者独立复验）·被验: r-duty-cos 施工 18:59:22-19:02:04（2m42s·判停 20:14 未触）

## §一 终判

**APPROVE**——轮换完成+认证门全绿+消费面勘定完整+候裁五项本卷裁决（§四）。

## §二 四查读数（本席独立复验·非转抄）

| 查 | 读数 | 判 |
| --- | --- | --- |
| ①毕报卷在链 | sg bare /srv/git/TriMetaverse.git `42fbb1c4f` dev 分支包含（19:02:43+0800 落树·git log 直读） | ✓ |
| ②活体抽验 | 8791 LISTEN ✓·pid 525474 etimes≈2321s（node dsh web·与 19:00 起新对表）✓·无 token GET /=**401** ✓·新 token 交换 **303** ✓·旧 token **401**（代际失效本席独立实证）✓·len 43/43 ✓ | ✓ |
| ③物证在位 | .rot/ 全件：new-token/old-token 600·run-web-masked.py 700·sync-8791-relay.sh 700·web.log 600·baseline.txt/start.log 664——与卷 §三/§五/§六 清单一致 | ✓ |
| ④D-46 零回显 | 卷面 43B 长度+sha256_8 指纹形·wrapper 日志 `<MASKED>`·journal 原始 0（卷自报+本席卷面亲读核对）·本席探针全程变量承载零回显 | ✓ |

**转抄项如实标注**：session/list items=44 与在飞 turn=0 系 r-duty 报数——本席三探形未独立复现（GET /session/list 404·POST /session/list 405·POST /api/session/list 空体 gateway/bad-request·RPC 信封形未穷尽）。判定**非门禁**：会话库存于 DSH_HOME 文件面不随进程代际丢（构造性）+CEO cookie 仍 200（r-duty 实证·签名 cookie 跨代际）+服务载入 44 会话启动正常。留观察项：RPC 正形勘定候窗。

## §三 技术裁定（卷 §二 口径·请认项）

**认**：8791 token=进程级 randomBytes(32)→base64url 43 字符 WeakMap 持有·无 env/config 覆盖位（源码锚 dsh-client-connection L231/L244/L354）——**轮换=重启进程**非配置面写入。施工令第 6 步「旧值保留」在此机制下转译为取证对照（值回滚不存在·回滚语义=恢复服务可用：旧启动形在+systemd restart 路径在）——适配合理不违令意。r-duty 按实际机制适配施工（重启代际生成）=勘定先于施工的正确实践。

## §四 候裁五项裁决（卷 §六·令已达 r-duty 工作区）

| # | 项 | 裁 |
| --- | --- | --- |
| 1 | 形变认账 | **认**——systemd user 瞬态单元为现役正形（tmux fork 沙箱拒=环境硬约束）；不回 tmux 形（再生成 token=无谓二次同步） |
| 2 | relay keeper 同步 | **准**——r-duty 沙箱外 systemd-run 执行 sync-8791-relay.sh 正式同步（--check 已过）·毕报回执掩码形（302 校验+relay3.service active） |
| 3 | 旧值处置 | 同步毕+CEO GUI 活体确认（cookie 200 报备）后即删 .rot/old-token（值面零回显照旧） |
| 4 | 长期化 unit | **候窗**——正式 unit 文件派工列本席候窗项（今晚不动·沙箱写不了 ~/.config 属实） |
| 5 | Restart 漂移 | **保留 on-failure**（自愈收益>漂移成本：CEO cookie 面对重启与 token 双韧·relay 漂移有日志可诊）+sync-8791-relay.sh 保留为**标准再同步件**（崩后漂移=一键再同步）——.rot 脚本与 wrapper 同步毕后保留勿删 |

## §五 候窗项（本席认领·D-23 对轨列窗）

1. 8791 正式 systemd unit 文件长期化（§四.4）。
2. 8791 存活/token 漂移观察位（观察者面·崩后自愈+再同步链路告警）。
3. dsh web RPC API 正形勘定（session/list 信封形·本席三探未穷尽）。

## §六 使用依据

r-duty-cos 毕报卷（工作区+树内 42fbb1c4f）·CTO 施工令 18:55 投递（工作区+headless wake 18:57 拾取）·本席活体直读（8791 端口/进程/HTTP 门/.rot 物证·ssh 河源）·sg bare git 直读·D-46/D-47 纪律现行版。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·发毕对表随信面）

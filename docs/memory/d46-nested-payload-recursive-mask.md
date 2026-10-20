# D-46 嵌套 payload 递归滤盲区（token 值面）

> 10-15 BOD sg 8712 自报实锚（勘误卷 35a3045cd）：jobs 面 dump 时 **payload 嵌套未递归滤**——`TRIMC_INTERNAL_TOKEN` 明文进读数（未进转报未落盘·暴露面=会话终端+transcript 副本）。

- **盲区机理**：D-46「先 split 后掩码」正形对**嵌套结构失效**——顶层字段掩了，嵌套对象/数组里的值面漏网。
- **通道第 7 例（10-15 CTO 自捕·unit 文件面）**：`systemctl cat <unit>` 输出含 `Environment=<NAME>=<token>` 明文行——unit 文件面=token 嵌设正位（sg trimc.service TRIMC_INTERNAL_TOKEN 实锚）。正形：unit cat 类命令**前置滤行** `grep -vE 'TOKEN|SECRET|KEY'`（或 `systemctl show -p` 白名单属性投影）；环境变量读值类命令一律结构面/文件名投影，禁全文 cat 进打印路径。
- **正形增补**：含嵌套结构（object/array 深层）的 dump/打印路径=**递归遍历掩码**，或更优——**禁 dump 原始 payload，只投影白名单字段**（结构性不接触值面>事后掩码）。
- 轮换裁（CTO 10-15 10:52·技术资产 owner 裁）：**不立即轮换**——token=sg 8712 internal API 鉴权·外部不可达（需先破 sg/本机=已在信任域）·实际攻击增益≈0·轮换成本中（8711 NOTIFY env 刚落窗将连锁作废）。护栏：值面进外部可达面/公开卷/第三方管道任一→立即急件轮换；下次 sg daemon 勘修窗**顺手轮换**摊入既有窗（候考池）。

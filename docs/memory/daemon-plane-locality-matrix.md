# daemon 机位矩阵·服务域/本地域硬规则（2026-10-09 四连混淆实证）

**矩阵正身（CEO 2026-10-09 定谳）**：

| daemon | 机位 | 面定性 |
|---|---|---|
| TriRMC | 河源 R-HY 8710 | R 面服务域（0.0.0.0） |
| TriRLC | **本机 dev** 8711 | R 面本地域（127.0.0.1）——「暂时在本机」 |
| TriMMC | sg M-SG 8712 | M 面本地域（loopback+SSH 隧道消费） |
| TriMLC | 本机 dev 8713 | M 面本地域 |

规律：两台远端机各住**服务域/对等 daemon**（河源=TriRMC、sg=TriMMC），两个**本地域 daemon 都在本机**（TriRLC 8711+TriMLC 8713）。

**教训（2026-10-09 单日四连实证）**：①trirmc/trimmc 混淆→LG-066 段2 误取消→v4 窗令作废返工；②「TriRLC 8711 复活」伪命题——正身本机 64h uptime 活着，死的是河源 trilc-headless（另一件东西）；③节拍探针 ssh 河源探 127.0.0.1:8711 报「死」=探错机器报假缺口；④CTO 复活稿对象同步错位（BOD 未验对象认账）。

**硬规则**：任何 daemon 状态叙述（节拍探针/窗令对象/复活稿/四口终态表）**先活体现探正身机位**（healthz 实探+监听面实勘），禁由文档/记忆/他人叙述推定机位。四 daemon 名近亲+端口跨机复用（8710/8711/8712 都曾在多机出现不同语义）=完美混淆温床——对象断言三问（object-assertion-before-confirm 条）之上再加「机位活体验」一层。

**关联**：object-assertion-before-confirm（对象三问）/dual-controller-ports-m-mlc-r-rlc（端口定性）/m-sg-r-hy-server-naming（机位正名）/trirmc-independent-repo-topology（TriRMC 独立仓）。

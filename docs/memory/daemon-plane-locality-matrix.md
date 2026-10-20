# daemon 机位矩阵·服务域/本地域硬规则（2026-10-09 四连混淆实证）

**矩阵正身（CEO 2026-10-09 定谳）**：

| daemon | 机位 | 面定性 |
|---|---|---|
| TriRMC | 河源 R-HY 8710 | R 面服务域（0.0.0.0） |
| TriRLC | **本机 dev** 8711 | R 面本地域（127.0.0.1）——「暂时在本机」 |
| TriMMC | sg M-SG 8712 | M 面本地域（loopback+SSH 隧道消费） |
| TriMLC | 本机 dev 8713 | M 面本地域 |

规律：两台远端机各住**服务域/对等 daemon**（河源=TriRMC、sg=TriMMC），两个**本地域 daemon 都在本机**（TriRLC 8711+TriMLC 8713）。

**教训（2026-10-09 单日四连实证）**：①trirmc/trimmc 混淆→LG-066 段2 误取消→v4 窗令作废返工；②「TriRLC 8711 复活」伪命题——正身本机 64h uptime 活着，死的是河源 trilc-headless（另一件东西）；③节拍探针 ssh 河源探 127.0.0.1:8711 报「死」=探错机器报假缺口；④CTO 复活稿对象同步错位（BOD 未验对象认账）；⑤（2026-10-14）FSD 面健康情报「sg TriMMC 8710 healthz 空回疑 executor 停」=**探错端口假缺口**——TriMMC 现役=sg **8712**（pid 连续 24h+ 健康），8710 是 TriRMC 在**河源**的端口（R-HY 第二实例·LG-066 后退役消失）：sg 机上无 8710 监听=**常态非故障**，空回≠服务停。机器+端口双重错位型——「健康判据类情报发出前先对机位矩阵正身机器+端口双对表」（BOD 勘正提示 08:07·按假缺口销项）。

**硬规则**：任何 daemon 状态叙述（节拍探针/窗令对象/复活稿/四口终态表）**先活体现探正身机位**（healthz 实探+监听面实勘），禁由文档/记忆/他人叙述推定机位。四 daemon 名近亲+端口跨机复用（8710/8711/8712 都曾在多机出现不同语义）=完美混淆温床——对象断言三问（object-assertion-before-confirm 条）之上再加「机位活体验」一层。

**store 位维度同理（2026-10-11 栏 B 门禁实锚增补）**：本机双 daemon **双 store 分立**——8711 TriRLC 现役进程无 DATA_DIR→代码默认 `%LOCALAPPDATA%\trilc\cron.db`；8713 TriMLC 启动链 channel.cmd 显式 `TRILC_DATA_DIR=trilc-channel`→`%LOCALAPPDATA%\trilc-channel\cron.db`。**探库先对 DATA_DIR（活体 cmdline/启动链脚本）禁按路径直觉**——CTO 门禁复核首发探成 8711 库得 jobCount=0 假矛盾（真身 13 job 在 trilc-channel 库），被矛盾信号拦下即纠；若非零 job 库（如只有旧 job）矛盾会更隐蔽。判 store 正身链：daemon cmdline（CIM）→启动脚本 env 行→库文件 jobCount 合理性三步。

**关联**：object-assertion-before-confirm（对象三问）/dual-controller-ports-m-mlc-r-rlc（端口定性）/m-sg-r-hy-server-naming（机位正名）/trirmc-independent-repo-topology（TriRMC 独立仓）。

## 索引行全量快照（2026-10-13 16:0x CAO 压缩施工·MEMORY.md 裁短前存档·细节权威位=本文件历史段+本快照）

- [daemon 机位矩阵·服务域/本地域硬规则](daemon-plane-locality-matrix.md) — TriRMC=河源(服务域)/TriRLC=**本机**(R面本地域·8711)/TriMMC=sg(loopback)/TriMLC=本机(8713)；2026-10-09 四连混淆实证（trirmc/trimmc 缝合→v4 作废、「8711 复活」伪命题——正身本机 64h 活着、探针探错机报假缺口、CTO 稿对象错位）；daemon 状态叙述先活体现探正身机位禁推定；**store 位同理（10-11）**：双 daemon 双 store 分立（trilc\=8711 代码默认/trilc-channel\=8713 启动链显式 DATA_DIR）探库先对 DATA_DIR 禁按路径直觉（探错库 jobCount=0 假矛盾实证）

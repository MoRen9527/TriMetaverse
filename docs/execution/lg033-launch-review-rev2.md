LG-033 启动机制评估·修订轮 CTO 技术面主答（CEO 四点；补初稿 a3d1edb8）

- sourceOfTruth: TriMetaverse/docs/execution/lg033-launch-review-rev2.md
- syncMode: draft｜lastSyncedAt: 2026-09-08

①**蓄洪兜底必选采纳+compact/clear 机制逐项**：
- resume 失败→-n 新建+蓄水池重建认知（r6 模式）=兜底必选入设计（--resume 链断的确定性恢复路径）；
- **compact 后**：session id **存活**（compact=同 session 上下文压缩，id/文件不变）——--resume 锚定不受影响，语义=恢复 compact 后态（摘要锚+后增量）；认知水位=compact 摘要锚（细粒度丢失由蓄水池台账兜底——值班位认知水位=池为准不依赖会话内存，M-001 立法同构）；
- **clear 后**：上下文清空、旧 id **不可靠**（保守假设 id 消亡）——--resume 失败→蓄洪兜底 -n 重建接（已必选）；
- **镜像位感知机制**：claude **无跨会话状态广播**（compact/clear 对端无原生通知）——镜像位感知=**轮询读池**（台账版本/主备标记 mtime/hash 比对，蓄水池机制已具）——感知面=池不=会话（M-001 状态在池立法同构）。

②**SendMessage 跨机复查（佐证双证）**：crossSessionInbound 传输面=**同机 sessions 目录/UDS**——机间通道**无原生**。双证：证 1=TriRLC `send-message.ts:1-6` 头注释自证「CC 支持 bridge/uds 跨会话 → TriLC 仅支持进程内消息」（移植时砍跨会话，LG-026 重审同源锚）；证 2=拓扑事实（值班位 session 在 sg，员工席/交互位在本地，sessions 树两机物理隔离）。**结论=机间唯一原生通道为零，跨机面=信件信封（案 a v1 pendingCommands 通道，LG-032 实证）**。

③**b 直上重估：结论反转=成立**——「防叠压」治理成本重勘：Supervisor 扩展与 LG-026 P4 验证机制同码库（服务器版=扩展非新架构）；叠压风险面=c 交互窗与 b headless 并发写蓄水池——**写分区纪律+主备标记仲裁已立法覆盖**（§三组件 2/3），治理=规则执行非新建设；省的架构升级=c→b 二次迁移（c 现状仅 24h 责任窗寿命，五事项执行单 c 项已剔=P4 不依赖 c，c 沉没仅一夜实跑样本[已采尽]）——**b 直上总成本低、路径短、无二迁，采纳**。c 现状降为只读观测位至 b 接管（样本采集延续）。

④**c/b 关系+attach 冲突面定谳**：c=tmux 交互 claude、b=headless 流 claude——**同一 session id 双持有并发=claude session 文件并发写未定义行为（后写覆盖/交错损坏）**——**互斥规则定谳：同一 session id 单持有者**——b（Supervisor 托管）=默认持有者；c 人工接入=**只读观测**（tmux attach 只读面板/日志 tail，禁输入）；写接入协议=b 暂停释放（Supervisor API pause）→c attach 人工处置→c 退出→b resume——**写接入走暂停释放协议，禁双活**。

【对初稿的修订】初稿「双形态并存（c 交互窗口+b 主链）」修订为「**c=只读观测位+b=写持有者**」（并发写禁绝）；其余（b 主干推荐/补偿四件/Q1-Q4）维持。

【依据】CEO 四点+claude session 机制实勘（duty-cos 面板实录）+TriRLC send-message.ts 移植锚+LG-026 Supervisor 机制。
# LG-033 演进立项评估·CTO 技术架构面主笔稿（CEO 提案 MC+LC 双端 daemon 托管）

- sourceOfTruth: TriMetaverse/docs/execution/lg033-evolution-cto-review.md
- syncMode: draft｜lastSyncedAt: 2026-09-08

## a) TriMMC 托管两候选对比·昨判改判分析

**改判结论：轻量路径下「3-5 窗新子系统」降为「1-2 窗生命周期壳」——改判成立**。

昨判 3-5 窗的三座山，在 daemon→tmux→claude 轻量路径下逐座消解：

| 三山（昨判） | 轻量路径消解 |
| --- | --- |
| pty 分配层（node-pty 新依赖） | **tmux 现成持 pty**（tmux 天生 pty/TUI 管理，claude 全功能交互保留）——daemon 不碰 pty |
| 常驻会话注册清单 | **tmux list-sessions 现成**（session 在册查询原语） |
| 跨机可达桥 | 信件桥独立于 pty（本不走 pty，案 a 通道复用）——非消解而是**证明不需** |

daemon 职责收缩=**tmux 生命周期管理壳**：spawn=tmux new-session（全参数 env 链前置 source）/monitor=tmux has-session 轮询（进程级存活）/kill=tmux kill-session——命令行拼装非子系统开发，**1-2 窗**（壳+判据+联调）。

**代价如实列**：监控粒度粗（tmux has-session 只知进程活不知 claude 内部态/auth 态/工作态——细状态靠信件通道响应时效主判，daemon 探活=capture-pane 浅 grep 辅）——值班位健康主判据改「信件响应时效」为纲，daemon 粒度接受。

**推荐=轻量路径②**：b 窗 1 产物（ManagedProcessSupervisor headless 流形态）转任务工人本职（LG-026 原角色），值班交互位走轻量壳——**两件产物各归其位不互斥**（headless=任务工人/轻量壳=值班交互位）。

## b) TriMLC 拉起本地常驻·前置链与 CEO 终端关系定谳

前置链：cmd 重挂（trimlc-daemon-channel.cmd，CEO 终端窗顺手）→8713 复活→宿主能力（TriMLC daemon 化前置=LA-026 §8.7 线共用）。

**定谳：CEO 交互终端=接入面（client view），非被替代**——daemon 化常驻 session 是本体（岗位存活独立于任何终端开关=本提案核心价值）；CEO 终端 attach/view=客户端视图之一（tmux attach 或信件通道）。CEO 关终端=COS 岗位不亡（价值句）；CEO 要对话=attach 进 session 或信件直达。

## c) 跨机三路实时性分级佐证

| 路 | 形态 | 实时性 |
| --- | --- | --- |
| 信件通道 | 轮询信封（值班位 pull） | 准实时（轮询周期界，分钟级） |
| SSH 直达 | 人工秒级 | 实时（人工介入前提） |
| git 同步 | 异步 push/pull | 小时级 |

值班位急件=**信件+SSH 双路**（自动化走信件、人工升级走 SSH），分级成立。

## d) 双 daemon 托管协同纪律沿用性

**沿用成立**：session id 单持有者原则两 daemon 各域适用（值班位 session sg 持有、交互位 session 本地持有——跨机走信件桥不共 session）；主备翻标记=蓄水池机制沿用；互斥规则（rev2 ④）=c/b 单持有者协议平移——双 daemon 不共 session，互斥天然满足（跨机物理隔离+信件桥解耦）。

## e) 分期依赖图

```
TriMLC cmd 重挂（CEO 终端窗顺手）
  → 8713 复活（宿主能力）
    → TriMLC daemon 化（本地交互位常驻）
TriMMC b 窗 1 地基续建（轻量壳 1-2 窗）
  → sg 值班位 daemon 托管常驻
D-15 底座核查双套实勘（本地 TriMLC 侧+服务器 sg 侧，并行）
  → 汇聚：双端 daemon 托管常驻（P3/P4' 联审后排）
```

【约束确认】R 面不参与/密钥正身保持（cmd 重建 token 现取现注）/现行 systemd+tmux 值班形态评估期照跑不折腾——三条全守。
【依据】昨判三问证据书（5e98bd49）+duty-cos 实跑在役态+TriRLC send-message.ts 移植锚+TriRMC cd28efd sandbox。
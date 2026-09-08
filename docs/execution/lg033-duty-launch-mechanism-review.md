# LG-033 值班位启动机制与跨机通信方案评估·CTO 技术架构面主笔稿

- sourceOfTruth: TriMetaverse/docs/execution/lg033-duty-launch-mechanism-review.md
- syncMode: draft｜lastSyncedAt: 2026-09-07
- 性质：CEO 亲定点 CTO+CPO 主笔（技术架构面 CTO）；明晨晨检随批首发；候裁不实施

## 一、候选三案对比表

| 维 | a systemd unit 自启 | b ProcessSupervisor 托管 | c SSH+tmux 现状 |
| --- | --- | --- | --- |
| 形态 | Unit 拉起 tmux+claude（--resume）或 headless 流 | TriMMC daemon 托管 claude 进程（启动/监控/重启） | 手动 ssh+tmux（**现状基线，duty-cos 实跑在役**） |
| 7×24 | ✓（Unit 自启+Restart） | ✓（daemon 常驻托管） | ✗（依赖 ssh 会话存续） |
| 崩溃自愈 | Restart=on-failure 进程级 | Supervisor 监控+重启计数（LG-026 机制服务器版，最细） | 无（人工重拉） |
| 可观测 | journalctl | daemon 面（LG-026 验证机制实读） | tmux capture（人工） |
| 交互性 | tmux 内层交互可保留 | headless 流为主（交互弱） | ✓（全交互现状） |
| 实装成本 | Unit 一件+形态勘 | daemon 扩展（Supervisor 任务类型+claude 进程封装） | 零（已在跑） |

## 二、技术面必答五点

①**-n vs --resume 机制语义**：`claude -n`=新开 session（新 id 新上下文）；`--resume <id>`=恢复指定 session（上下文/历史延续）——值班位语义=**--resume**（COS session 上下文跨进程重启延续，交接协议的进程层对应物）；-n 用于首次冷启建立 session-id（后续 --resume 锚定）——两态串用：首启 -n 取 id→自此 --resume。

②**无 TTY 形态可观测**：无 TTY=claude 交互 TUI 不可用，形态=**stream-json 长驻流**（`-p --input-format stream-json --output-format stream-json`）——发现/唤醒=json 输入流注入指令（值班位「被叫醒」=向流 write 信封）；crossSessionInbound 作用面=**同机 sessions 目录**（claude 原生跨会话入站限同机——值班位在 sg，发起者（员工席/交互位 COS）在本地——**跨机原生入站不可用，跨机唤醒=信件信封轮询/推送**（案 a v1 pendingCommands 同构，LG-032 服务面已实证通道）；日志落点=stream-json 输出全量落文件+Supervisor/journal 面。

③**BOD-桥接过渡案**：c 现状→b 托管的桥接=c 保留交互窗口（人工 ssh 接入观测/紧急处置）+b headless 流并跑（值班自动化主链）——**双形态并存**（tmux=交互位窗口/headless=自动化主链）非替换关系——桥接期一窗一轮换（主备标记定谁 active）。

④⑤**问题清单+在案演进向对表**：Q1 值班位会话 id 生命周期（--resume 锚 id 由首启生成，id 持久化落 duty-env 配套）；Q2 无 TTY 态工具权限（stream-json 流的权限确认=流内 approve 消息或 --permission-mode 预设——**P4 e 项教训直用**）；Q3 sg 重启后自动恢复序（Unit/Supervisor 谁拉起）；Q4 跨机信封与 stream-json 输入的格式对表。在案演进向：LG-026 §8.7 组长岗 spawn 拉起=同族机制（值班位=cos 版组长岗形态复用评估）——**值班位启动机制与组长岗启动机制合流设计**（P5 备料联动）。

## 三、--dangerously-skip-permissions 服务器风险面对表+补偿方案

**skip 与 safety 层关系（勘定）**：safety-check（P4 e-fix 修复面）位于 permissions-engine 决策管线=**独立于交互确认的硬安全门**——skip permissions 跳的是「用户确认交互」，safety 层系统路径 deny/blocked 直拒语义在 skip 模式**仍强制**（deny 永远赢=e-fix 决策序设计直接红利）——**skip 与 safety 非互斥：skip 省确认、safety 管边界**。

**服务器 skip 风险面对表+补偿四件**：
1. skip 态写面=工作目录白名单锁定（duty-env cwd 钉 /srv/fleet/TriMetaverse，safety deny 清单兜系统路径）；
2. 审计补偿=stream-json 全量输出落盘+换棒/工具调用台账（值班位行为全录可回放）；
3. 备选=**不 skip 而用 --permission-mode acceptEdits+allow 清单**（读面自动+写面白名单内自动+清单外仍确认——skip 的替代档，风险面更小，**推荐优先评估此档**）；
4. skip 档启用判据=acceptEdits 档实测两窗无误触/无误放行后升档（渐进升权纪律）。

## 四、推荐案+排窗

**推荐=b 案为主干的双形态并存**：值班自动化主链=ProcessSupervisor 托管 headless 流（7×24+自愈+可观测），交互窗口=c tmux 现状保留（人工接入位）——c 现状不是被替换而是**升格为 b 的交互接入面**（tmux attach 值班位窗口）。排窗：P4 窗（周一）后 b 案实装窗（Supervisor 扩展+stream-json 链+判据三件），P2 读数②③采集不受阻（c 现状在跑）。残留清单：Q1-Q4+skip 升档判据+与组长岗合流设计（P5 备料联动）。

【依据】duty-cos 实跑在役态+LG-026 Supervisor 机制+P4 e-fix 决策序+LG-032 案 a 通道实证。
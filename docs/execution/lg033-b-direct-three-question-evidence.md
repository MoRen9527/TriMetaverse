# LG-033 b 直上三问质询·CTO 代码级实证证据书（禁粉饰·分支判定）

- sourceOfTruth: TriMetaverse/docs/execution/lg033-b-direct-three-question-evidence.md
- syncMode: draft｜lastSyncedAt: 2026-09-08
- 实证对象：TriCompany/packages/agent-core/src/process-supervisor/supervisor.ts（295 行，P4 验证机制同源）

## ① spawn 形态自证（源码行引）

**run 型一次性**——supervisor.ts 实锚：`:41 createRunRegistry()`（run 台账）+`:47 updateState(runId,'exiting')`+`:66 spawn argv 校验`+`:79 registry.add(record)`+`:85 timeoutTimer`+`:87 captureOutput`+`:88 overallTimeoutMs`+`:94 updateState 'exiting'`——**生命周期=spawn→captureOutput→timeout→exiting 登记**（run 以退出为终点，capture 模式收集 stdout 等待进程结束）；**pty 全文件零命中**（grep pty=0 行）。

## ② 常驻交互形态：**不能（现成能力无）**

ProcessSupervisor 现 runner 无 pty 分配（`pty` 零命中）、无常驻会话注册清单（registry=run 台账非 session 清单）、无跨机 SendMessage 可达（run 型退场即失联）——**常驻交互形态（pty 持有/不退出/在册/SendMessage 可达）现成能力=不能**。需开发=**新子系统级**（pty 分配层[node-pty 新依赖]+常驻会话注册清单+跨机可达桥[信件桥改造]三件——非三窗档，估 3-5 窗且 pty 层引入新风险面[终端仿真/信号处置/回滚复杂度]）——**工期实数重报：常驻交互档=3-5 窗新子系统级（非原 2-3 窗）**。

## ③ session 级完整性六维对比表

| 维 | systemd(+tmux) | ProcessSupervisor spawn（现 runner） |
| --- | --- | --- |
| 会话在册 | ✓ tmux session 在册（list-sessions 实证） | ✗ run 退场即失 |
| list-agents 可见 | ✓ tmux list 会话可见 | ✗ 无注册清单 |
| SendMessage 收发 | △ 同机直达 ✓（sg 侧会话间）；跨机=信件桥（两案同） | △ 同（信件桥） |
| 上下文持续 | ✓ tmux+claude 交互态持续（--resume 补强） | △ headless **长驻流可持续**（窗 1 新开发形态）/单发 ✗ |
| 崩溃恢复 | ✓ systemd Restart | ✓ Supervisor 重启计数（平） |
| 开机自启 | ✓ systemd enabled | ✓ daemon Unit（平） |

**session 级完整性四维（在册/可见/同机直达/交互持续）=systemd(+tmux) 完胜**；spawn 侧优势=自愈细粒度+headless 自动化形态。

## 分支判定

**分支 1 命中**（spawn=无头单次且常驻交互需大开发）→**值班位启动=systemd(+tmux) 定案**（完整 session 级四维全绿）；**ProcessSupervisor 不废转本职=事件驱动任务工人**（LG-026 原设计角色：自动化任务线 headless 执行者——与值班交互位分职各司：交互会话=tmux/systemd，任务工人=Supervisor headless——两形态天然正交）。

## 附：b 直上原判勘正自领

我前轮「b 直上定案（三窗压线）」之判**勘正**：三窗实数成立但适用对象勘错——三窗实的是 **headless 流托管**（值班自动化主链正确），而「值班位=交互 COS session 级完整」需求下 headless 流不满足 session 四维——**b 直上作为「值班位启动机制」之判撤回**，ProcessSupervisor 转本职任务工人定位采纳（BOD 分支 1）。粉饰为零：三问每问源码行引在卷。
【依据】supervisor.ts 295 行实勘+pty 零命中 grep+duty-cos tmux 实跑在役态。
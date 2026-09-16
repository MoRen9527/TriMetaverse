# M 面优势与局限（项目真源·活文档）

- sourceOfTruth: TriMetaverse/docs/product/m-face-strengths-and-limits.md
- syncMode: source-only
- lastSyncedAt: 2026-09-17T03:58+0800
- 上位令: CEO 2026-09-16 22:1x（BOD 铸任务书 `2026-W38/task-charter-20260916-m-face-strengths-limits.md` 84217556）
- 共建: CAO（骨架/真源规范/归属——本版骨架为 CPO 初稿候 CAO 校）+ CPO（优势经营语义/checklist 形态/L1 产品化判定）；CTO 技术事实核；BOD 收口
- M 面定义锚: dev 机 Windows 宿主（`D:/Code/ai/` 工作区，本仓库所在机）

---

## 1. 优势清单（现象→机制→对经营的意义）

### S1 本地低延迟
- 现象：席位交互、走查、调试响应即时。
- 机制：开发-运行-调用同机，零跨海链路（对照：sg 会话经新加坡代理段）。
- 经营意义：迭代速度=13 席开发吞吐；走查/排障的往返成本趋零。

### S2 直连按量模型，无配额墙
- 现象：本机直连 provider，按量计费，无预分配配额上限。
- 机制：直连通道（TriModel 直连兜底亦为此设计）+按量结算。
- 经营意义：产能不被配额卡死；成本=真实用量（CFO 可测可控）；高负载窗可弹性扩。

### S3 单机双核心编排
- 现象：一台 Windows 机承载 M+R 双面角色职责（本地编排+本地控制）。
- 机制：dev 机同时运行 MMC 角色职责与 TriRLC 本地控制。
- 经营意义：一期硬件成本减半——一台机起全套，架构验证期极低成本试错。

### S4 真机 Ops 直达
- 现象：SSH/服务面/文件面同机直达，无跨机授权链。
- 机制：M 面=CEO/值席同机位；服务安装/重启/排障本机完成。
- 经营意义：故障响应分钟级（实证：09-15 兜底按钮 run1 阻断→回修→run2 全绿，2 小时内闭环）。

### S5 开发-运行同机
- 现象：源码仓=运行仓，改码即生效。
- 机制：TriModel/TriRLC 等直接从本仓工作区运行。
- 经营意义：修复-验证-上线循环压缩到分钟级；实验-反馈迭代密度为四面最高。

### S6 Windows 桌面生态位（不可替代性）
- 现象：GUI 能力（真浏览器/IDE/桌面自动化）仅 M 面原生具备。
- 机制：Windows 桌面会话 + VS Code/浏览器栈；真浏览器 E2E、截图验收类走查仅此可做。
- 经营意义：GUI 类任务的不可替代性=能力独占面；对照 R 面（Linux 无桌面）与 L1（下）。

## 2. 局限清单（现象→根因→状态档→对策/对照）

> 状态档词表（固定四档，条目不得自创）：`已解决`｜`可绕过`｜`需开发`｜`平台外`；档位判定权限=CTO 技术核终判（BOD 已判定项照录）。

### L1 Windows SSH 伪终端链缺陷
- 现象：`ssh -t <host> tmux attach` 类命令退出码 255（"open terminal failed"/PTY 分配失败），直连 Linux tmux 不可用。
- 根因：Windows OpenSSH/终端层伪终端分配与 Linux 远端 tmux 兼容缺陷（Windows 宿主特有）。
- 状态：**【可绕过】**（已实证三法：两跳登录后手动 attach／`ssh -tt` 强制／BOD capture-pane 转述；tmux 派工标准位=send-keys 非交互 attach）。
- 对照：R 面/Linux 宿主原生 PTY 无此问题（M vs R 差异示例）。
- **产品化判定（CPO 裁，2026-09-16）**：**暂不入 TriPilot/TriCode 产品待办，记录在案**。理由：①可绕过档成立，痛感=摩擦非阻断；②目标形态存疑——attach 进会话后仍需人在终端操作，真实解法是「会话转述/投递」层，而 send-keys+capture-pane 转述模式已覆盖现役需求；③两产品线主航向优先（TriPilot 走查链/TriCode 运行时）。**复活条件**：若 TriCode 终端产品面立项，或「丝滑 attach」痛点频次上升（月度复现计数>3），重提。

### L2 本机 TriModel 配置面服务非自启
- 现象：3333 未在跑（HTTP 000），需手动起；sg 侧有 systemd 常驻对照。
- 根因：本机无服务化/自启机制（候 CTO 判档：需开发|可绕过）。
- 状态：**【候 CTO 定档】**。
- 对照：sg 侧 systemd 双 service（trimodel-config/proxy）常驻。

### L3（预留位）
- （CAO/CPO 域增补入口；每条须带现象+根因+状态档+对照面）

### L4 席位窗口代操：键入自动化多坑（方法论已成文）
- 现象：BOD 代席位窗口键入（如代发 `/compact`）初试四连败——中文经 SendKeys 变乱码（"ack"→"啊惭愧"，IME 中文态组词实证）、回车单发被吞、VS Code 多 tab 无法唯一定位、后台激活被 Win11 前台锁拒绝。
- 根因：①Win11 前台锁拒绝后台进程改焦点（AppActivate 可返回 True 但焦点未动）②IME 中文态拦截键入组词 ③SendKeys 无法直打中文、单回车易吞 ④Get-Process MainWindowTitle 只报进程主窗（同进程第二窗口不可见）。
- 状态：**【已解决】**（2026-09-17 03:46 实证闭环：/compact 成功送达 m-cos 并完成压缩）。
- **已验证远控五步法**（BOD 成文，CEO 令入档）：
  1. **找窗**：`EnumWindows` P/Invoke 全量枚举可见窗（Get-Process 只报主窗会漏同进程第二窗），按标题含席位名取句柄；
  2. **切焦点**：先发 ALT 键（keybd_event 0x12 down+up 解前台锁）→ `SetForegroundWindow(句柄)` → **`GetForegroundWindow()` 比对句柄验证**，不等即中止；
  3. **输文本**：`Set-Clipboard` → SendKeys `^v` 粘贴（绕 IME，中英文免疫）——**禁直打**（中文必乱码、ASCII 也可能被组词）；
  4. **提交**：`{ENTER}` 双发（单发易吞）；
  5. **守卫**：每步校验失败即中止不发（激活 False 照发=违断链纪律，初试实录在案）。
- 对照：sg 面 tmux `send-keys` 为原生等价能力（且 Enter 需独立补发同族坑）；本五步法=Windows 宿主的 tmux 等价远控。
- 附带发现（同窗实证）：`CLAUDE_CODE_CHILD_SESSION=1` 环境遗传——BOD shell 代起的 claude 被标记子会话（不存转录/不注册名址/ListAgents 不可见），代起常驻进程前必 `Remove-Item Env:CLAUDE_CODE_CHILD_SESSION`（根因由 CEO 从窗口 banner 排出，2026-09-17 03:25）。

## 3. M 面对照 checklist（可执行核对单）

### 3.1 选型前对照（什么时候选 M 面）
- [ ] 任务需要低延迟交互（走查/排障/演示）？→ 选 M（S1）
- [ ] 任务吃模型量大、怕配额墙？→ 选 M（S2）
- [ ] 任务要 GUI（真浏览器 E2E/截图/桌面自动化）？→ **只能 M**（S6）
- [ ] 任务要改码即生效（开发类）？→ 选 M（S5）
- [ ] 任务要 Ops 直达（装服务/重启/排障）？→ 选 M（S4）
- [ ] 任务要原生 PTY/Linux 工具链？→ 选 R（L1 反向对照）

### 3.2 日常自检（局限规避动作）
- [ ] 要进远端 tmux？→ 用 send-keys 派工，**不要** `ssh -t attach`（L1【可绕过】）
- [ ] 确需交互 attach？→ 两跳登录后手动 attach 或 `ssh -tt`（L1 绕法）
- [ ] 要代操本机席位窗口（代发命令/键入）？→ 按 **L4 五步法**（找窗→ALT 切焦点→粘贴输文本→双回车→全程守卫），禁直打文本
- [ ] BOD 代起常驻 claude 进程？→ 先清 `CLAUDE_CODE_CHILD_SESSION` 环境变量（L4 附带发现）
- [ ] 调 TriModel 前先探活（3333 可能未在跑，L2【候定档】）→ `curl 127.0.0.1:3333/health`
- [ ] 走查/派工涉及 sg？→ 走 sg 通道纪律（不经本机中转，CLAUDE.md 跨机路由）

### 3.3 升级观察（复发信号→动作）
- [ ] L1 attach 摩擦月度复现>3 次 → 重提 TriCode 产品候选（见 L1 判定复活条件）
- [ ] L2 非自启导致故障 ≥2 次 → 升格「需开发」催 CTO 服务化方案

## 4. 变更记录

> 活文档机制（CAO 定）：表格式追加制——每次变更必附一行（日期/变更/Owner），只追加不改写历史行；内容 owner=CPO（产品域回写纪律），治理规范面=CAO。

| 日期 | 变更 | Owner |
| --- | --- | --- |
| 2026-09-16 | 首版：S1-S6 优势/L1-L2 局限/L1 产品化判定（暂不入待办）/checklist 三段 | CPO 起草候 CAO 校 |
| 2026-09-16 | CAO 校过：状态档词表固定声明补入 §2 头+变更记录机制定稿（追加制/Owner 列对齐 governance-state 字段惯例）；其余零改动认可 | CAO |
| 2026-09-17 | L4 新增（CEO 令直录）：席位窗口代操键入自动化——【已解决】，远控五步法成文（EnumWindows 找窗/ALT+SetForegroundWindow 切焦点/剪贴板粘贴输文本/双回车提交/全程守卫）；附带发现 CLAUDE_CODE_CHILD_SESSION 环境遗传坑（根因 CEO 排出）；checklist 3.2 增两行 | BOD（CEO 令；CPO/CAO 追认随窗） |

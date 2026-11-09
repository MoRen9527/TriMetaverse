# r-plane-eval-01 CSO 域分卷：用户成功就绪度评估

- 席位：CSO 小成（r-duty-cso）
- 评估时窗：2026-11-04T05:34Z～05:55Z（北京 13:34–13:55）
- 评估对象：R 面本地域产品（TriPilot+TriRLC 命令行为主·8711 族 API 面·TriPilot GUI 为辅）
- 对比基准：M 面 sg 现役形态（TriMLC 8713 cron 面+vscodium+TriPilot 宿主+TriRMC 8710 中央面）
- 评估视角声明：本卷为**用户成功视角**（获得→用起来→产生价值的路径成熟度），不代 CTO/FSD 代码质量域、不代 CPO 需求裁决域。

## 一、成熟度评估（五维）

### 1. Onboarding 路径成熟度：中（3/5）

- TriRLC CLI 生命周期命令面齐备：`install/uninstall/start/stop/restart/status/model/config/cache/verify/log/stage/pull/show/add/list/update/remove/run` 等 20+ 子命令（`TriRLC/src/cli.ts` 实勘），安装-启停-配置-诊断闭环在命令层已成立。
- **缺口**：终端用户 getting-started 文档缺失——两仓 docs 检索 `getting-started/快速开始/安装指南` 零命中；TriPilot README 的 Run 段为开发者形态（F5 Extension Development Host），非终端用户路径。
- 命名双轨（仓名 TriLC/bin 名 trilc vs 叙事名 TriRLC）已由 README 锚定段缓解，但对新用户仍是第一道认知门槛。

### 2. 首个价值时刻（first value）：中上（3.5/5）

- **链态自愈式 onboarding（亮点）**：code-state.md 活体记录 selfcheck 完成→链态自动 onboarding（`chain-changed from=selfcheck to=onboarding sourceEntry=daemon`）→assemble 200——daemon 自驱动完成链态迁移，用户免手工引导。
- TUI 四态活体复验（首启→一问一答 settle→/exit 零残留→重进 resume 回读）——CLI 首启到对话连续性已有验证链。

### 3. 反馈闭环就绪度：低（1.5/5）

- 两仓 `.github/` 仅 agents/+workflows/，无 issue template、无用户反馈通道文档——"用户如何报错/提需求"通道面为零。
- **技术底座良好**：错误契约分类化（422 校验拒绝/409 链态门/busy 防重入/clone-failed 分类重试）具备承载反馈分流的结构基础，缺的只是出口。

### 4. 健康度可观测性：技术侧中上（3.5/5）·用户侧低（1/5）

- daemon 侧 heartbeat/uptime/watchdog/selfcheck/SSE 投影齐备且经活体验证（8726/8727 隔离轮、8799/8798/8797 三重隔离轮）。
- 用户成功信号（激活深度、任务完成率、活跃天数）无采集面——CSO 无法从现役形态读取"用户是否真的用起来"的可验证数据。

### 5. API 面用户接入成本：优（4.5/5）

- TriPilot CLI 经 **Anthropic 兼容 API+SSE** 对接 TriRLC（`tripilot-cli.ts` 实勘，internal token 鉴权）——兼容业界标准协议大幅降低接入成本。
- 现势如实注：sg 机当前无 8711 监听（现役 8710/443/8791/4432x），R 面 8711 形态以 dev 侧候选轮+prod 健康记录（code-state）为据。

## 二、对比 M 面 sg 现役形态

- M 面 sg 形态=运营者自用形态：用户=公司自身席位，onboarding 靠内部纪律册/AGENTS.md，**不存在外部用户路径**。
- 结论：R 面产品 CLI 完整度已超 M 面用户路径（M 面靠 tmux/纪律册维持），但**文档与反馈通道两面与 M 面同样薄弱**——基准不构成用户成功意义上的对标，R 面需自建而非平移。

## 三、改进计划（CSO 域建议）

| 优先级 | 项 | 内容 |
|---|---|---|
| P0 | getting-started 最小闭环 | 安装→启动 daemon→首问成功，一件文档；CLI 已齐备，缺的只是路径说明书 |
| P0 | 反馈通道最小件 | issue template（bug/feedback 双模板）+ 错误输出尾缀指向反馈入口 |
| P1 | 产品 STATE.md 补齐 | 两仓 STATE 均为骨架态（"用于后续补齐"），用户阶段/范围声明空缺影响对外口径一致性 |
| P1 | 用户成功信号最小采集 | 基于 heartbeat 增加任务完成率/活跃天数聚合，使 CSO 健康度评估可验证化 |
| P2 | 命名双轨收敛 | TriLC/trilc vs TriRLC 收敛时间表，降低新用户认知负担 |

## 四、CSO 域总评

**成熟度 3/5**——功能面（CLI 命令+链态自愈+协议兼容）超 M 面基准；用户路径文档、反馈通道、成功信号采集三面缺失是"可用"到"可成功"的主要落差。

**数据诚实注**：本卷判断全部基于 2026-11-04 sg 机只读实勘（文件+端口+tmux+活体测试记录引用），无用户访谈、无使用量数据——评分指**就绪度**而非实际用户健康度（当前无外部用户数据可验证，如实标注）。涉及产品承诺面改动需 CPO 裁决，本卷仅提建议不代裁。

## 使用依据

- `TriRLC/README.md`、`TriRLC/src/cli.ts`、`TriRLC/docs/registry/code-state.md`、`TriRLC/docs/product/STATE.md`
- `TriPilot/README.md`、`TriPilot/bin/tripilot`、`TriPilot/src/cli/tripilot-cli.ts`、`TriPilot/docs/product/STATE.md`
- sg 机现勘：监听口（8710/443/8791/44321-3）、tmux 会话、`/srv/fleet/TriMLC/`、`/srv/fleet/vscodium/`

# 命名对齐勘验清单（代码面↔叙事面，LG-021 单 B 评估先行）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/naming-alignment-survey-20260831.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：CEO 指令单 B（推翻 quad-migration v1.0「叙事面更名 TriMMC、物理旧名照用」决策，按 truth-record-amendment-policy 新决策取代留痕）——**评估先行，回报董事会过目后实施，不裸改**
- 勘验方法：数日实勘积累（拓扑正身/runbook/服务实勘）+本日定向补勘

## 一、物理名引用面枚举（六面）

| # | 引用面 | 位置 | 旧名引用内容 | 改动性质 |
| --- | --- | --- | --- | --- |
| 1 | systemd units | heyuan：trirmc.service/trilc-headless.service；sg：trimc.service | unit 名 trimc/trirmc 本身+Description+WorkingDirectory | B（停机窗：unit 改名=daemon 重启纪律） |
| 2 | 物理路径 | sg /srv/fleet/{TriMC,TriMetaverse,TriCompany}；heyuan /srv/fleet/{TriRMC,TriMetaverse,TriCompany,TriLC,TriModel} | 目录名本身 | C（暂留：脚本/服务全面依赖，改=全链回归） |
| 3 | cron payload 内嵌路径 | heyuan jobs.json 3 job（weekly-plane-shift 双处 sg-bare+TriRMC-Scheduler commit 身份/tricompany-pull/rmc-orchestrate-tick）；sg jobs.json 4+ job（config-sync-apply 内 /srv/fleet/TriMC/dist、orchestrate-tick、daily-progress-watcher、clock-skew-check） | payload 里的 /srv/fleet/TriMC、/srv/fleet/TriRMC 路径与身份 | B（**applyJobPatch 整体替换语义**：改 payload 必带完整新值+PATCH 后 nextRunAtMs 重算） |
| 4 | sg post-receive hook | /srv/git/TriMetaverse.git/hooks/post-receive | /srv/fleet/TriMetaverse、/srv/fleet/TriCompany、/srv/fleet/shadow-plane 路径+LG-018 镜像段 | B（hook 编辑=触发层变更，改动窗避开 push 高峰+备份先行） |
| 5 | Windows 本地脚本 | trilc-daemon.cmd/trilc-daemon-channel.cmd/fade-watch.ps1/schtasks 任务×3（TriLC Daemon/TriHubWatchdog/TriMLC-Channel 残差） | 路径与任务名（无 TriMMC 字样） | A/C（本地脚本本就用物理名，叙事面无冲突） |
| 6 | 文档与 registry 别名表 | TriCompany/docs/registry/company-governance-state.md（权威 alias 表）+tri-company 白皮书+各 runbook（TriMC runbook 已有时点修正行先例）+契约协议 v2.1 | TriMMC 叙事名↔trimc 物理名映射 | A（文档层可即改，真源表先行） |

## 二、分档实施方案

### A 档（可安全即改，文档/登记层）

- company-governance-state.md 权威 alias 表：追加「2026-08-31 命名对齐决议」行（新决策取代 quad-migration v1.0 锚定——truth-record-amendment-policy 留痕）。
- 各叙事文档（白皮书拓扑图注/runbook 头注）按需更新叙事面用名；物理路径书写保留（现实）。
- 本协议/新文档起用「TriMMC（sg 调度面，物理 trimc.service）」双名并书格式。

### B 档（需停机窗改，daemon 重启纪律+迁移窗纪律照 heyuan 先例）

1. cron payload 内嵌路径/身份（若裁定物理改名或身份改名）：applyJobPatch 整体替换+完整新 payload+PATCH 后 nextRunAtMs 引擎重算（cron-job-state-hygiene）。
2. post-receive hook 内路径：编辑窗=避开 push 高峰+cp 备份先行（LG-018 镜像 hook v1/v2 教训：编辑后 bash -n+空提交冒烟）。
3. systemd unit 改名（若做）：systemctl disable/enable+daemon 重启纪律（trilc-daemon-restart-discipline）+down 窗验收。

### C 档（暂留别名兜底）

- 物理目录 /srv/fleet/TriMC（sg）与 /srv/fleet/TriRMC（heyuan）：全链脚本/服务/文档锚定，**建议永久保留物理名+叙事面双名并书**（改名收益<全链回归风险）——此为对旧决策「物理旧名照用」部分的**部分维持**，取替范围由董事会定。
- Windows 本地：无叙事冲突，物理名即真源。

## 三、待董事会裁定项

1. 对齐终态口径：物理名全面改（含 /srv/fleet 目录+unit 名）vs **叙事面双名并书+物理名冻结**（助理席倾向后者——C 档论证）。
2. 若涉 payload/unit 实改：停机窗排期（建议非周日窗，避开迁移+巡检高峰；迁移窗纪律照 heyuan 先例）。
3. alias 表 A 档先行是否放行。

## 四、实施边界

本评估不动任何 unit/payload/hook/路径；实施待董事会过目后另令（B 档窗内执行+逐项回执）。

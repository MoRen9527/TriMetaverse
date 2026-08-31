# repo 级改名迁移方案（LG-021 扩围：TriMC→TriMMC/TriLC→TriRLC/新建 TriMLC）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/repo-rename-migration-plan-20260831.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：CEO 扩围裁定（2026-08-31 晚，修正单 B 终态裁决扩围 repo 级）之勘验方案——**过目后实施，不裸改**
- 分层原则（CEO 裁定照录）：冻结=**服务器部署路径/systemd units**（/srv/fleet/*、unit 名）；**git 仓名属代码面纳入对齐**

## 一、目标态

| 现仓名 | 新仓名 | 变更面 |
| --- | --- | --- |
| TriMC | **TriMMC** | GitHub 仓名+sg-bare 目录+各检出 remote URL+CI checkout |
| TriLC | **TriRLC** | GitHub 仓名+sg-bare 目录+本地工作区目录（D:/Code/ai/TriLC→TriRLC）+heyuan 检出 remote+CI checkout |
| （新） | **TriMLC** | 新建仓（GitHub+sg-bare；初始代码借自 TriRLC 仓 dev——CEO 明示接受借码起点）；LG-020 通道 profile 代码迁出为种子 |
| TriMetaverse/TriCompany/TriCode/TriModel | 不变 | — |

**冻结不动（C 档分层）**：/srv/fleet/* 部署路径（sg /srv/fleet/TriMC、heyuan /srv/fleet/TriLC 等检出目录名）、全部 systemd units 名——只改这些检出的 **remote URL** 指向新 bare 仓名。

## 二、影响面勘验矩阵（实勘 2026-08-31 23:3x）

| # | 影响面 | 现状读数 | rename 动作 | 档 |
| --- | --- | --- | --- | --- |
| 1 | GitHub 仓名 ×2 | MoRen9527/TriLC、/TriMC | Settings 改名——**GitHub 自动 301 redirect**（旧 URL git 操作兼容过渡），redirect 无限期但应更新引用 | A（可即改，redirect 兜底） |
| 2 | sg-bare 目录 ×2 | /srv/git/TriLC.git、/srv/git/TriMC.git（实勘六 bare 在册） | `mv` 目录改名——**所有指向它的 remote 即断**，须与 remote 更新同窗分钟级完成 | B（停机窗核心件） |
| 3 | 检出 remote URL | sg 检出 TriMC（/srv/fleet/TriMC，trimc.service dist 源）；heyuan TriLC（/srv/fleet/TriLC，trilc-headless dist 源，origin=GitHub）；本地 TriLC（origin=GitHub+sg-server） | fleet 侧 `git remote set-url`（fleet 身份）；本地 set-url——**部署路径/unit 冻结不动**（C 档），检出内 remote 指新 bare | B（同窗） |
| 4 | CI workflow | build-tricade.yml:92/113 `repository: owner/TriLC、/TriMC` | redirect 期 CI 不断（可后改）；正身化改两行 | A（redirect 兜底，顺手改） |
| 5 | 本地计划任务/脚本 | TriLC Daemon 任务→trilc-daemon.cmd 引 `D:\Code\ai\TriLC\dist\index.js`；通道 cmd 引同路径；build-desktop.ps1/fix-nssm-*.ps1 引 TriLC 路径 | 本地目录改名后：cmd 路径+脚本 sed+**8711 daemon 重启窗**（运行中进程 CWD/dist 源失效）——daemon 重启纪律照 | B（与本地目录改名同窗） |
| 6 | TriLC 分叉史 | **已闭合**：dev=ff2f970 单线化双远端（merge-log 60e9bdcd 裁定），与 origin/dev 同步、工作区干净（实勘） | 处置=无需标注（闭合实证）；backup/local-dev-premerge 线已在 GitHub 留档 | 已了结 |

## 三、迁移计划（三阶段）

### 阶段 1：GitHub rename（A 档，分钟级零断）

1. CEO 在 GitHub 操作：TriLC→TriRLC、TriMC→TriMMC（Settings→Rename；redirect 自动生效）。
2. 本地双仓 `git remote set-url`（origin 指 GitHub 新名——可选，redirect 兜底）+CI workflow 两行顺手改（同批 commit）。
3. alias 表/勘验文档回填新仓名。

### 阶段 2：sg-bare 目录改名+remote 收口（B 档停机窗，分钟级）

1. 预告窗（避开周日迁移+巡检高峰；窗口内 sg-bare 写侧三方静默 5 分钟量级）。
2. `mv /srv/git/TriLC.git TriRLC.git && mv /srv/git/TriMC.git TriMMC.git`（fleet 属主+权限随 mv 保留）。
3. remote 收口三处：本地 TriRLC 仓 sg-server URL、heyuan TriLC 检出（origin 现指 GitHub 不经 sg-bare——**实勘例外：heyuan TriLC 不依赖 sg-bare，零动作**）、sg 检出 TriMC（其 origin 指 GitHub 同例外——**零动作**；实勘结论：TriMC/TriLC 检出经 sg-bare 的 remote 仅本地 sg-server 一处+CI 不经）。
4. 验证：三仓 fetch/push 冒烟+orchestrate-tick/config-sync-apply 下槽正常。

### 阶段 3：TriMLC 仓新建+LG-020 迁仓（B 档窗）

1. 新建 GitHub TriMLC+sg-bare TriMLC.git（借 TriRLC dev 初始拷贝 push 双远端）。
2. channel profile 种子：TRILC_CHANNEL_MODE 代码迁出为 TriMLC 主线基础（借码起点+channel 增量）；RLC 侧通道代码随 TriRLC 演进自然分离（channel 独占增量不再回流 TriLC→TriRLC）。
3. **8713 换源（并行后切换，不断服）**：TriMLC clone 至新路径构建冒烟→通道 cmd node 路径切换→旧实例停止→新实例 healthz 冒烟；8713 全程在线（预启动新实例、就绪后切端口——或接受秒级重启窗，择一）。
4. TriLC→TriRLC 改名落本地：目录改名（停 8711 窗：schtasks End+目录 mv+cmd/脚本路径 sed+Start+healthz 冒烟）——**8711 现役 daemon 停窗量级分钟级**（TG 通道短暂离线，会话积压服务器侧不受损——外拨型边界收益）。
5. heyuan trilc-headless：origin=GitHub rename 后 redirect 兼容（零动作可选 set-url 正身化）。

### 备选（CTO 评估定，不预锁）

TriMLC 与 TriRLC 共享骨架（通道/心跳/cron 底座）上浮 TriCode（定位即共享运行时）——去耦与复用两全；若采，阶段 3 的「借码」改为「TriCode 底座+TriMLC 薄壳」结构。

## 四、分叉史核证（勘验项加条，CEO 令）

TriLC 双线分叉史（本地 vs tc001-canonical）**已闭合**：trilc-lineage-merge 树裁定 dev 单线化（ff2f970 双远端推平+backup/local-dev-premerge 留档 GitHub）；本日实勘 dev tip=ff2f970、与 origin/dev 同步、工作区干净——rename/迁仓前置条件满足，无需额外标注。

## 五、实施边界

本方案不动任何仓名/目录/remote；实施待董事会过目后另令（阶段 1 可先行请示——GitHub redirect 兜底使其近零风险）。

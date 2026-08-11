# 服务器舰队 M0 环境搭建清单（Server Fleet M0）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/server-fleet-m0.md
- syncMode: source-only
- lastSyncedAt: 2026-08-11

> 版本：v2026.W33.1
> 日期：2026-08-11
> 状态：正式版（CEO 确认签发）
> 适用范围：M0 服务器环境搭建，TriMC 舰队试点（M1）前置
> owner：小狄（CTO，执行）/ 小贾（总助，门禁收口）
> 关联：`docs/workflow/operating-records/2026-W33/project-ai-community-weekly-2026-W33.md` 决策登记块；`docs/execution/trilc-capability-checklist.md` §四（双仓同步机制）

## 一、背景与目标

服务器舰队方案（W33 决策登记）：服务器部署官方 claude（Linux）作舰队运行时 + TriMC 编排层，承载 task tree、周会、13 员工舰队。M0 的目标是把服务器环境从"有系统"推进到"M1 试点可直接开跑"。

## 二、服务器现状

| 项 | 值 |
| --- | --- |
| 位置 | 新加坡 |
| IP | 47.245.122.61 |
| 规格 | 4 核 8G（已升级） |
| 磁盘 | 40 GB |
| 带宽 | 5 Mbps（已升级） |
| 系统 | Alibaba Cloud Linux 3.2104 LTS 64 位（RHEL 8 系，dnf 包管理，默认 SELinux 强制 + firewalld） |

## 三、M0 检查清单

> 状态取值：待执行 / 进行中 / 完成。完成时登记日期 + 执行人。

| # | 动作 | 要点/命令 | 状态 | 完成记录 |
| --- | --- | --- | --- | --- |
| 1 | SSH key 登录 | `ssh-keygen` + 公钥上服务器；禁用密码登录 | 完成 | 2026-08-11 小狄：ecs-keypairs.pem 密钥认证通过（BatchMode 实测）；sshd `PasswordAuthentication no`（备份 sshd_config.bak.20260811），reload 后新连接验证正常 |
| 2 | 安全组开放 | 阿里云控制台安全组：22 必开；8710（TriMC）上线前开 | 待本地配合 | 2026-08-11 小狄：22/80 实测公网可达（安全组已放行）；8710 需用户在阿里云控制台安全组添加（M1 上线前完成即可）；443 公网不通为容器侧 TLS 问题观察项（见风险） |
| 3 | firewalld 放行 | `firewall-cmd --permanent --add-port=8710/tcp` + `--add-port=22/tcp`；两层防火墙都要通 | 完成 | 2026-08-11 小狄：firewalld 启用（原 inactive），`--list-ports` = 22/tcp 8710/tcp；docker 80 公网仍 200，容器 NAT 未受影响 |
| 4 | 运行时：k3s（2026-08-11 已定） | 官方一键安装（自带 containerd，无需 docker）；装配套 `k3s-selinux` 包；组件镜像纳入离线初始化 | 进行中 | 2026-08-11 小狄：定版 v1.36.3+k3s1（GitHub 实测 11.9MB/s，直拉可行）；发现系统 cgroup v1 → 需切 v2 重启；服务器已有 docker 26.1.3 + tristaciss 容器在跑（restart=unless-stopped，重启可恢复） |
| 5 | SELinux 策略包 | k3s 装配套 `k3s-selinux` 包；docker 挂载按需配；**禁止 `setenforce 0` 一刀切** | 进行中 | 2026-08-11 小狄：getenforce=Disabled（服务器出厂状态，非本次操作），k3s-selinux 随安装一并处理，禁止 setenforce 0 纪律保持 |
| 6 | 离线初始化（5Mbps 关键动作） | 本地拉好镜像/依赖 → 打包 → scp 上传 → 服务器加载；避免服务器直拉 1-3 GB 初始流量 | 待执行 | — |
| 7 | npm 源 | 服务器 npm 配 npmmirror（阿里镜像），或离线 tarball | 待执行 | — |
| 8 | 裸仓 | `/srv/git/<repo>.git`：TriMetaverse、TriCompany、TriMC、TriLC、TriCode 首批 | 待执行 | — |
| 9 | 舰队工作克隆 | `/srv/fleet/<repo>`：从裸仓 pull；舰队不直接改 main（写方向单主体，见 checklist §四） | 待执行 | — |
| 10 | 官方 claude 2.1.226+ 安装 | Linux 版安装 + 认证；环境变量照抄本地：`ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic` + `ANTHROPIC_AUTH_TOKEN` | 待执行 | — |
| 11 | 磁盘纪律 | 日志轮转（journald 限制大小）、镜像定期清理、不在服务器反复 `npm install`（40GB 够但紧） | 待执行 | — |
| 12 | 吞吐实测 | `curl -w "%{speed_download}"` 测到 api.deepseek.com / Anthropic API 的实际吞吐，记录基线 | 待执行 | — |

## 四、M0 完成门禁（全部满足才进入 M1）

1. **双仓闭环**：本地 push → 裸仓 → 舰队克隆 pull 全链路跑通一次（本地任意提交，服务器侧可见）
2. **claude 可用**：服务器上 `claude` 能启动、认证通过、完成一次最小对话（可选：跨会话 SendMessage 双会话互发成功——这是 M1 的预演）
3. **TriMC 可部署**：k3s 跑起 TriMC，`/healthz` 200
4. **吞吐基线记录**：到 API 的实测吞吐已登记（低于 0.5 MB/s 时标记为风险项，M1 前决策是否需对策）

## 五、维护规则

- 更新人：小狄（执行项状态）；收口由小贾在 M1 启动前复核全部 12 项；
- 每项完成登记日期 + 执行人，不登记的完成不算完成；
- 本清单对应 W33 决策登记 M0 里程碑，M0 全过 → 启动 M1（舰队自由对话 + TriMC 编排 MVP，2 周窗口）。

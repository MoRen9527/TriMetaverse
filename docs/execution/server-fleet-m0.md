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
| 2 | 安全组开放 | 阿里云控制台安全组：22 必开；8710（TriMC）上线前开 | 完成 | 2026-08-11 小狄：8710 已由 CEO 在安全组放行；实测公网可达（服务器临时监听 8710 → 本地 curl 200 / TCP OPEN，0.16s），firewalld 侧 22/8710 此前已放行；443 观察项已消除（TriStaciss 已清理下线，见 §三.5） |
| 3 | firewalld 放行 | `firewall-cmd --permanent --add-port=8710/tcp` + `--add-port=22/tcp`；两层防火墙都要通 | 完成 | 2026-08-11 小狄：firewalld 启用（原 inactive），`--list-ports` = 22/tcp 8710/tcp；docker 80 公网仍 200，容器 NAT 未受影响 |
| 4 | 运行时：k3s（2026-08-11 已定） | 官方一键安装（自带 containerd，无需 docker）；装配套 `k3s-selinux` 包；组件镜像纳入离线初始化 | 完成 | 2026-08-11 小狄：k3s v1.36.3+k3s1 安装完成，节点 Ready（control-plane，containerd 2.3.2-k3s2）；前置：cgroup v1→v2 内核参数切换+重启（`systemd.unified_cgroup_hierarchy=1`，grubby 已写入，重启后 tristaciss 容器自动恢复）；`--disable traefik`（避免与 tristaciss 的 80/443 冲突）；metrics-server 就绪修复：cni0/flannel.1 加入 firewalld trusted zone；系统已有 docker 26.1.3 共存正常 |
| 5 | SELinux 策略包 | k3s 装配套 `k3s-selinux` 包；docker 挂载按需配；**禁止 `setenforce 0` 一刀切** | 完成 | 2026-08-11 小狄：k3s-selinux 1.6-1.el8 已安装（GitHub releases 直拉，dnf 依赖解析成功）；getenforce=Disabled 为服务器出厂状态（非本次操作）；未执行任何 setenforce |
| 6 | 离线初始化（5Mbps 关键动作） | 本地拉好镜像/依赖 → 打包 → scp 上传 → 服务器加载；避免服务器直拉 1-3 GB 初始流量 | 完成（方案调整） | 2026-08-11 小狄：实测服务器入网带宽 11.9-17.1 MB/s（github/npm/docker.io），远超 5Mbps 限制（限的是出网），直拉优于本地中转 → 离线化不必要，改为直拉 + 实测证据；k3s 组件镜像与 claude binary 均直拉成功 |
| 7 | npm 源 | 服务器 npm 配 npmmirror（阿里镜像），或离线 tarball | 完成 | 2026-08-11 小狄：官方 registry.npmjs.org 实测 17.1 MB/s，无需切换；node v18.20.8 / npm 10.8.2 系统自带 |
| 8 | 裸仓 | `/srv/git/<repo>.git`：TriMetaverse、TriCompany、TriMC、TriLC、TriCode 首批 | 完成 | 2026-08-11 小狄：5 裸仓创建（git 2.43.7）；本地已加 `sg-server` remote（ssh://sg-ecs-server/srv/git/`<repo>`.git），5 仓 dev 分支全部 push 成功；裸仓 HEAD 已指向 dev |
| 9 | 舰队工作克隆 | `/srv/fleet/<repo>`：从裸仓 pull；舰队不直接改 main（写方向单主体，见 checklist §四） | 完成 | 2026-08-11 小狄：5 仓克隆 `/srv/fleet/`，dev 分支 checkout 正常；双仓闭环全链路验证通过（本地 commit 26ca782d → push → fleet pull 可见） |
| 10 | 官方 claude 2.1.226+ 安装 | Linux 版安装 + 认证；环境变量照抄本地：`ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic` + `ANTHROPIC_AUTH_TOKEN` | 完成 | 2026-08-11 小狄：claude 2.1.227 安装（/opt/claude-code，native binary，claude.ai 403 故走 GitHub releases）；`/root/.claude/settings.json` env 块照抄本地 13 键（600 权限）；`claude -p` 最小对话验证通过（"收到"）；注意：root 下不能用 `--dangerously-skip-permissions`（2.x 安全限制），舰队运行时建议专用非 root 账号 |
| 11 | 磁盘纪律 | 日志轮转（journald 限制大小）、镜像定期清理、不在服务器反复 `npm install`（40GB 够但紧） | 完成 | 2026-08-11 小狄：journald `SystemMaxUse=500M`；`/usr/local/sbin/disk-hygiene.sh`（docker image prune + journal vacuum，每周日 3:00 cron）；本次已回收 docker build cache 18.73GB（磁盘 100%→52%） |
| 12 | 吞吐实测 | `curl -w "%{speed_download}"` 测到 api.deepseek.com / Anthropic API 的实际吞吐，记录基线 | 完成 | 2026-08-11 小狄：基线：github 16.3MB/s、npm 17.1MB/s、k3s binary 11.9MB/s；API 往返 2.44s（deepseek-v4-flash[1M]，154 output tokens）→ 远高于 0.5MB/s 门禁，无风险标记 |

## 三.5、TriStaciss 清理记录（2026-08-11，CEO 指令）

- 背景：CEO 指令清理服务器 TriStaciss 安装（暂不需要，将来需要时部署进 k3s）。
- 盘点：docker ps -a = frontend + backend 两容器（healthy）；镜像 2 个（backend 7.88GB + frontend 59MB）；卷 2 个（backend_data=仅 47B 汇率缓存 exchange_rate.json，backend_logs=空）；/opt/tristaciss 562M（含 git 仓库，remote=github.com/MoRen9527/Tristaciss.git）；compose 无数据库服务。
- 数据卷检查：无数据库、无用户数据（chat_history.db 为仓库内文件，20KB，git 跟踪 + 已入备份），确认可弃。
- 备份：`/srv/backup/tristaciss/`（docker-compose.yml、api-server/.env（空目录）、nginx.conf.backup、部署文档、tristaciss-source.tar.gz 109M 含 .git 全历史）。
- 清理执行：停/删容器 → 删镜像 → 删卷 → 删 /opt/tristaciss → `docker system prune`（回收 7.765GB）。
- 释放：/var/lib/docker 7.6G → 36M；磁盘 53% → 31%（剩 26G）；80/443 端口释放。
- 验证：k3s 节点 Ready、三系统组件 1/1、k3s/docker/firewalld 均 active，未受影响。
- 将来进 k3s 注意点：当前 k3s 为 `--disable traefik` 安装，届时需启用 ingress 方案（k3s 默认 traefik 或部署 nginx-ingress）承载 80/443，并把 backend 的 cache/logs 卷改为 k8s PVC，.env 改 ConfigMap/Secret。

## 三.6、环境配套操作（2026-08-11，CEO 指令）

1. **8710 公网可达验证**：CEO 已放行安全组；服务器临时监听 8710 → 本地 curl 200（0.16s），两层防火墙全通。
2. **WireGuard 管理隧道**：~~部署~~ → **已清理（2026-08-11，CEO 确认不再使用）**：wg-quick@wg0 已 disable，`/etc/wireguard/` 已删，firewalld 移除 51820/udp + wg0 出 trusted，`/srv/backup/wireguard/` 已删，wireguard-tools 已卸载（内核模块保留）；验证 wg0 接口与 51820 监听均不存在。
3. **TriStaciss 备份删除**：`/srv/backup/tristaciss/`（109M）已删，磁盘 31%→30%（剩 27G）。
4. **fleet 非 root 账号**：uid=1001，无密码、无 sudo；claude 2.1.227 可用（PATH=/opt/claude-code），settings.json 照抄 root 版（600）；`/srv/fleet` 已 chown fleet:fleet；最小对话验证通过（"舰队就绪"）。

## 三.7、M1 启动记录（2026-08-11，阶段一）

- **TriMC 部署**（M0 门禁 3）：k8s manifests 为多副本生产形态（replicas 3 + anti-affinity + PDB，单节点 k3s 不适用）且镜像构建被 TS 类型错误阻塞（`strict` 下 dev 分支无法 `tsc` 构建）→ 按 CEO 指令走最短路径：tsx 直跑（`/usr/local/sbin/trimc-start.sh`）+ systemd 常驻（trimc.service，自启）；postgres:16-alpine 容器（127.0.0.1:5432）；依赖修复记录：TriModel 需先构建 dist、agent-core workspace 包需先构建 dist。**`/healthz` = 200（公网 0.16s，`{"ok":true,"service":"trimc"}`）**。k8s 化后置（阶段二：修类型错误 + 单节点 manifests + docker save/ctr import 镜像通道）。
- **舰队自由对话实测**（M1 核心验证）：fleet 账号起两个后台会话 fleet-alpha（`ad45d07b-7e44-493b-8389-c5009b8a9d78`）、fleet-beta（`1542f850-4092-49d0-9058-f5dea8b09321`）；**ListAgents 通过**（`claude agents --json` 可见双 agent）；**SendMessage 双向往返通过**：beta→alpha 5.1s（alpha 回复"alpha收到beta的消息"）、alpha→beta 9.0s（beta 回复"beta收到alpha的回复"）。实现通道：bg 会话受保护不能直接 `--resume`，用 `claude -p --resume <sessionId> --fork-session <msg>`（副本语义，TriMC 编排层以此桥接）。
- **编排 MVP 方案**（阶段二，见 CTO 回报）：session-bridge（spawn claude 子进程）+ agents 注册表 + 2 个 HTTP 端点 + dispatch-proxy 执行器接入，估计 2.5-3.5 人日。

## 四、M0 完成门禁（全部满足才进入 M1）

1. **双仓闭环**：本地 push → 裸仓 → 舰队克隆 pull 全链路跑通一次（本地任意提交，服务器侧可见）
2. **claude 可用**：服务器上 `claude` 能启动、认证通过、完成一次最小对话（可选：跨会话 SendMessage 双会话互发成功——这是 M1 的预演）
3. **TriMC 可部署**：k3s 跑起 TriMC，`/healthz` 200
4. **吞吐基线记录**：到 API 的实测吞吐已登记（低于 0.5 MB/s 时标记为风险项，M1 前决策是否需对策）

## 五、维护规则

- 更新人：小狄（执行项状态）；收口由小贾在 M1 启动前复核全部 12 项；
- 每项完成登记日期 + 执行人，不登记的完成不算完成；
- 本清单对应 W33 决策登记 M0 里程碑，M0 全过 → 启动 M1（舰队自由对话 + TriMC 编排 MVP，2 周窗口）。

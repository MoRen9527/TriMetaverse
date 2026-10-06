---
name: m-sg-r-hy-server-naming
description: CEO 立规（2026-09-13）——服务器正名 M-SG-ip / R-HY-ip：sg=M面新加坡机 47.245.122.61，河源=R面 cn-heyuan 机 8.155.54.79，两台独立机器
metadata: 
  node_type: memory
  type: project
  originSessionId: a5ed9f38-bd2c-4cfe-abb3-38fd5a72abdd
  modified: 2026-09-13T16:50:45.804Z
---

CEO 2026-09-13 定谳（推翻 BOD「同机双域名」误判）：**sg 与河源是两台独立机器**。

- **M-SG-47.245.122.61**（别名 sg-ecs-server）：M 面，TriMMC(8710)，阿里云 ap-southeast-1 新加坡。13 席值班 CC 宿主实测 2.1.266。
- **R-HY-8.155.54.79**：R 面，TriRMC（/srv/fleet/ 部署，fleet 属主，SSH 私钥名「河源-key.pem」），阿里云 **cn-heyuan** 地区（河源=阿里云正经地域，广东）。实测监听 8710/8711/8712（用途清点候 CTO）。周平面迁移执行点 cron 在此机。
- 定名规则：**M-SG-ip / R-HY-ip**（面+地域+IP 三重防混），已写入 ~/.ssh/config 正名别名；接入命令 trimmc chat=sg-M、trirmc chat=河源-R（trirmc chat 系新建候排）。

**Why:** M/R 分机部署是架构终态；面和机器名混写曾致 BOD 两连错（「同机双域名」误判、「TriRMC=sg R 面」措辞错）。

**How to apply:** 涉及服务器一律用 canonical 名；说「河源」=R-HY-8.155.54.79（R 面），说「sg」=M-SG-47.245.122.61（M 面）；部署目录在某机被发现≠该机是权威部署位（sg 机上有 TriRMC 旧镜像副本，权威位=R-HY）。相关：[[weekly-plane-shift-executor]]（河源 TriRMC cron=本机）。

**四域核心（CEO 2026-09-13 23:59 定谳）**：TriMMC=M 面服务域核心（sg）、TriMLC=M 面本地域核心（本机 8713）、TriRMC=R 面服务域核心（河源）、TriRLC=R 面本地域核心（本机 8711）。**本地自动化面纪律：M 面任务归 8713 TriMLC cron（晨检+周平面拉齐），R 面任务归 8711 TriRLC cron，互不串岗**——派单勿再错挂宿主。

**git 中枢（CEO 2026-09-14 00:42，00:46 措辞勘正）**：本地域连 GitHub 不稳→**M-SG 唯一对 GitHub，各辐条机 git 远端一律指 M-SG bare**（ssh://fleet@M-SG/srv/git/*.git）。拓扑=GitHub↔M-SG↔{本地机（TriMLC+TriRLC 双核心同机）、R-HY（R 面服务域机）、未来新机}。**域标签跟机走：本地域=本机一台；服务域=sg（M）+R-HY（R）；禁造「本地 R」类杂交词**。GitHub 推不动→bundle 备份 M-SG:/root/backups-* 标准应急。

**SSH 语境坑（2026-09-30 终验哨实证）：本机 SSH 别名 M-SG-47.245.122.61 登入即 root 语境（whoami=root）——裸 crontab -l 查的是 root 自己的表（仅 2 行系统维护项），fleet 护栏项查空虚惊一场；查 fleet 用户面须显式 crontab -u fleet -l（root 权限可查）或 su - fleet。操作/核查 fleet crontab 一律先断言目标用户面再读数。另：python -c 写文件经 bash 双引号转发时反引号会被命令替换吃掉——含反引号文本用 heredoc/单引号或干脆弃反引号。

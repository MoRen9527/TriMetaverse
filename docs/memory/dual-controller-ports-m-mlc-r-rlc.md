---
name: dual-controller-ports-m-mlc-r-rlc
description: 本机双控制器端口定性——8713=TriMLC=M面 daemon（Watchdog 唯一保活）/8711=TriRLC=R面 daemon（R面保活候建），并行机制位不同面、无退役一说（CEO 2026-09-17 面授）
metadata: 
  node_type: memory
  type: project
  originSessionId: e11343a2-e97e-4a90-8c4a-5ac637545af8
  modified: 2026-09-18T15:56:42.244Z
---

2026-09-17 CEO 面授定性（勘正 BOD"过渡期双跑/旧名退役"误判）：

- **8713 = TriMLC daemon = M 面本地域 daemon**（healthz 自报 service=trimlc）；保活=TriMLC-Watchdog（5 分钟计划任务，唯一看门狗）。12 员工席常驻 Watchdog（seat-watchdog.ps1）守的也是 M 面作业。
- **8711 = TriRLC daemon = R 面本地域 daemon**（healthz 自报 service=trirlc）；**R 面保活机制候建**——建成前 8711 异常靠晨检发现+人工兜底，且派工单禁写隐式可用性断言（CHO 口径）。
- 两套并行机制**位不同面，非新旧版本，无退役一说**。
- **命名语源（CEO 2026-09-18 00:0x 定谳，勘正 CAO"Machine"误读）**：Tri=TriMetaverse 前缀；**第一位字母 M=Meta-Virtual（元虚拟）、R=meta-Reality（现实）**——即 M 面=元虚拟面、R 面=现实面；**MMC 第二个 M=Main**（服务域主控）、**LC=Local Controller**（本地控制器）。四名全解：TriMMC=元虚拟面主控（服务域 sg）、TriMLC=元虚拟面本地控制器、TriRMC=现实面主控（服务域河源）、TriRLC=现实面本地控制器。CAO 白皮书 1d 曾误写"第二字母 M=Machine"，已入重审纠正。

**How to apply:** 涉 daemon 通道先分面——M 面作业走 8713（有看门狗）；R 面协同（河源 TriRMC/周平面）走 8711 侧（无保活，异常人工兜底）；给席位的派工单不写 8711 隐式可用性断言。**⚠ 运维风险实锚（2026-09-18 DE 部署夜）**：trilc stop/start 与 8713 共享 pidfile 无端口命名空间——M 面 daemon 操作**误停 8711 两次实证**（均 schtasks 权威路径恢复）；R 面保活机制设计须一并修 pidfile 隔离，M 面 daemon 重启前先核 8711 存活。关联 [[m-sg-r-hy-server-naming]]（M/R 面命名体系）。

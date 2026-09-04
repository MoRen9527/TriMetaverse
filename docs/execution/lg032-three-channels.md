# LG-032 三通道工程——方案骨架（CTO 方案正文候填）

- sourceOfTruth: TriMetaverse/docs/execution/lg032-three-channels.md
- syncMode: source-only｜lastSyncedAt: 2026-09-04
- 状态：**骨架件**（CEO 明令立项；CTO 域方案正文候填——D-15 路由 CTO 方案先行）；边界=只勘定与方案，连接实切候验证门+董事会知会（案 a 关通道=第二次 CEO 级确认点）

## 案 a·TriRLC 通道迁移（真 API 通道 TriRMC 接线）

- 现状：TriRLC（8711）经 TRIMC_BASE_URL 上送 sg 中央面（47.245.122.61:8710，LG-030 三查四定）；TriRMC（8.155.54.79）现仅 cron API+git 拉取，**无长驻 MC 服务端**。
- 工程量主体：TriRMC 侧 MC 服务面新建（/internal/v1/* 端点族：心跳接收/回传/恢复回放全能力）+认证（X-Internal-Token 族对齐）+全链验证门（心跳/回传/replay 实测）。
- **硬序=先接后关**：TriRMC 服务面验证门过→才准关 TriRLC→TriMMC 旧通道；过渡期双通道并存不摘。
- 关旧通道=**第二次 CEO 级确认点**。

## 案 b·TriMLC↔TriMMC API 通道新建

- M 面本地配对通道（8713 通道 daemon 的 M 面 API 化）；与 LG-026 501 解锁线（P4/P5）联动排布——组长岗 API 化若落，本通道为其前置底座。

## 案 c·TriMMC↔TriRMC 协作方案

- 默认=git 仓库协作（现状）；**CPO+CTO 联审**「涉及审核和反馈的接口方案」——出方案候裁，不抢先实施（CEO 令）。

## 候填节（CTO 方案正文）

- [ ] 案 a 服务面端点清单+认证方案+部署形态（systemd？cron 独立？）
- [ ] 案 a 验证门判据（心跳/回传/replay 三实测通过标准）
- [ ] 案 a 连锁清单（TriRLC 配置/env 名/代码字段/8713 影响）
- [ ] 案 b 与 LG-026 501 线联动排期
- [ ] 案 c 联审排期（CPO+CTO）
- [ ] 三案拆解排期总表（归 COS/CTO）

## 治理锚

- D-17：连接面变更须 CEO 明令（案 a 关通道=第二次确认点）
- LG-030：三查四定+e 六点（连接零改动裁定，本工程为其后续实施立法面）
- LG-031 终裁：星形拓扑+治理流向 M→R 单向吸收为主+元现实/元虚拟终态架构
- LG-026：501 解锁线/P4 09-09 后窗联动
# S2 派工 brief · TriRMC cron 写族 token 门 fail-closed 化（服务域拾取件·首笔全链实证）

- face: server-executable（M1 映射⇒TriRMC 侧）
- 派工位: COO 小营（投递链编排，任务书 a8db08b1 施工件③④）
- 判据正身: 同树 `cto-s2-trirmc-token-gate-spec-20261007.md`（@35e55381）——缺陷定谳/修法梯度/工序/测试锚/验收锚全款以该卷为准，本 brief 不复制技术面
- 执行位: sg 值席（MMC 拾取，D-27 树协议；夜航01/批令执行波先例通道）
- 工作副本: TriRMC 独立仓（sg bare 有镜像位）——clone/fetch 自 sg bare TriRMC.git，**基线测试先行**（先基线后动码）

## 工序（四步读数锚）

1. **接令回执**：拾取后即回（读数=拾取时刻+TriRMC 工作副本基线顶 hash+基线测试读数）。
2. **现勘首步（零副作用）**：R 面生产 env token 态探（判据卷 §三.1 分辨法：env 读数+空 body POST 401/400 分辨）——读数回填施工卷后**候 CTO 复核再动码**（判据卷内嵌门，禁跳门）。
3. **施工+测试**：判据卷 §二 fail-closed 梯度修法+§三.3 四态测试锚（未配+写=403/未配+读=200/配+错头=401/配+对头=201）+全量基线对照+启动 WARN 日志断言。
4. **回流收口**：施工卷（现勘读数+测试读数+diff 摘要）commit 推回 sg bare 本树路径（trees/local-svc-pipeline-link-01/，文件名 s2-exec-readout-*.md）→本地侧收口断言（COO+CTO 面）。

## 死线与边界

- 死线 **today EOD**（sg 夜跑不算超时，回流明晨核——任务书原文条款）。
- **R-HY 双 unit 零触碰**（LG-066 冻结期）：本笔不部署（判据卷 §四）；一切动作限于 sg 侧代码+测试+R 面 HTTP 只读探针。
- token 纪律：任何日志 tail 先滤 `command:`/`runAs:` 行；token 值面禁回显入卷。
- 门禁全款：改前备份分支/独立基线/异常秒回滚/长文分段 commit（服务域通用门禁）。
- 冲突即停：R 面探针异常（超时/拒绝）如实记卷，不硬探不重试轰炸，候 CTO 裁。

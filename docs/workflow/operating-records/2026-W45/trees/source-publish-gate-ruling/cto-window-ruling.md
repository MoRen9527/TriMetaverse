# source_publish_check 升 gate 形·排窗裁定（CTO·CEO 裁③投递）

- sourceOfTruth: 本卷（排窗裁定+施工要件正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 手打直令 2026-11-05 11:36:25「裁③批」（bod 11:36:46 规范化流转·COS 11:37:44 投递排窗）
- 裁定席: CTO 小狄（排窗归本席·FSD 实施窗机制照旧）

## 一 · 排窗裁定

**排 FSD 主下一窗（R1 轮 1 收口后接排·预计 11-05 午后-11-06 前窗）**：

- FSD 队列序：R1 轮 1（在途主窗·候 RDT PASS）→A4 顺手窗（一行·不变）→**本件（接排）**→FADE-011 接线（**11-06 后窗·与本件对调**）→治理窗批处理四件（LG-069 前置档/wake 补跑/清理机械闸/环境感知化·11-06+）
- 对调理由：本件=补闸（两例实证损害面：今晨 A-1 误裁+AGENTS.md 反向漂移·闸位缺口已两次实际漏损）+CEO 批令投递——**补闸优先于新能力接线**
- 不打扰 R1 主窗原则照 A4 先例形态

## 二 · 施工要件（施工单·派 FSD）

1. **触发面**：发布面变更时（publish/release 链 pre-publish 点）强制执行 manifest source 对表——非候检·链内强制
2. **拦截语义**：对表失败→**阻断发布（fail-closed）**——对照「门不豁免哲学」：generate 直 validate 必拒同族·闸不设弱化默认
3. **对表对象**：manifest source 字段 vs 发布面实际内容——A-1 形（发布面直改未回写真源）与 AGENTS.md 形（副本改未回写真源）双形均须拦
4. **defaultMode 升 gate**：dry-run 保留为**显式降级通道**（env/flag 显式声明·默认 gate）——防「默认降级」稀释闸语义；review=CPO+CTO 现制保留
5. **CAO 衔接**：gate 消费 manifest source 对表·条款（裁②纪律册轻款）管执行面义务——排窗定后与 CAO 对表一次·毕报内注明衔接态（免 ping-pong）
6. **毕报要件**：施工 diff+**gate 拦截真触发验证一发**（构造对表失败形·验阻断）+dry-run 显式降级通道验证+正常路径放行读数

## 三 · 使用依据

- CEO 裁③（11:36:25 手打直令）·COS 投递信（11:37:44）
- 背景实证两例（A-1 误裁+AGENTS.md 漂移·TriCompany 739a015 勘平卷）
- 现制骨架（manifest+DCE source_publish_check·review=CPO+CTO·defaultMode=dry-run）

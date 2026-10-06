---
name: ui-delivery-render-gate
description: UI 交付面必须过「渲染验证门」——code review+逻辑门禁对首启 UX/数据接线全盲（LG-035 CEO 走查不合格实证）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d7be6c8b-3fe9-49c2-810d-fd112b5be174
  modified: 2026-09-15T06:15:39.211Z
---

LG-035 TriModel UI（2026-09-11 CEO 走查不合格实证）：三个 UI 迭代（P1/P2/P3-sg）全部 **code-level cto 审+logic-only STE 门禁**出厂，零渲染验证——CEO 打开页面即四项不合格（模型下拉空/条目下拉不可用/调试术语上用户面/表格错位）。根因链：`loadModels().then(...)` 启动即拉全数据+localStorage token 未设→全链 401 静默空面板→事后填 token 无自动重拉无提示。逻辑测试 135/135 全绿与用户零可用并存。

**Why:** UI 是唯一没有自动化测试面（vanilla 无 DOM 测试）+无渲染核对+无非作者手测的交付面；「代码正确」与「用户可用」之间隔着首启时序/鉴权 UX/空态/文案/布局五道只有渲染才暴露的坎。

**How to apply:** 凡交付含 UI 面：①交付定义硬门加「**非作者手测**」（实现者外至少一人全流程过 UI，首启空态必测）；②门禁补 jsdom 级冒烟（首启鉴权链/下拉有值/提交可达/禁词断言）；③cto 审对 UI 件必问三问——首启无配置态长什么样？数据失败用户看到什么？文案是产品语还是开发语？④spec 对 UI 件须细化到交互级（行内编辑/布局层级/空态），「有此功能」四字不算 spec。关联 [[full-regression-reading-report-discipline]]（同族：只验增量不验用户面=漏报变体）。

**2026-09-14 复发+两个新变体（LG-035 粒度线）**：①**数据结构升级型改动会隐性砸 UI**——层1 把卡迁 v4 三实体，UI 旧读法对 v4 字典调数组方法→TypeError→三区全空 52 分钟无人知（验收链全在 API/引擎面，本条 09-11 刚立 3 天就重犯：结构升级=UI 必检触发器，非「含 UI 面」才检）；②**失败族错误归因会遮蔽活回归**——5 个 UI 测试失败被归「层2 既有面/旧断言」，实际其中 2 个正是本次断裂在报警；重归因纪律：升级型改动落地后同面失败**先疑活回归再归历史**；③走查工具面：Playwright profile 持久化 localStorage（连接态跨回合存活，亲开走查直接复现 CEO 视角）——但 snapshot 会把输入框明文值带进 transcript，走查含敏感输入框时避开该区域快照。

**2026-09-15 第三次实证命中（非渲染面·真 HTTP 链路层）**：兜底按钮交付——单测直调 handler（手工传 body）+ jsdom mock fetch 构成双盲区，真实 HTTP 链路零覆盖 → `server.ts` 读体条件仅 PUT、POST 体被丢，按钮必 400；**非作者真机走查首点即抓**（219 案全绿与按钮不可用并存）。补门：**新端点必配真链路案**（真 server+真 HTTP+钉位文件），且修补件须含「回退修复该案恰红」自证；分支修（F-1）用钉位临时文件+独立实例做第二方法独立复验。走查脚本纪律：**恢复判定不依赖步序**（run1 的 waitForFunction 超时路径曾险漏恢复——恢复=内容标记触发+sha 验证备份后才覆盖）；服务 token 从 .env 读入脚本内存、全程不打印，结果只落布尔/哈希。关联 [[fourth-type-cross-reload-persistence]]。

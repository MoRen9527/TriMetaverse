---
name: liveness-first-diagnostics
description: 环境状态类问题第一步永远直接测活体当前态，禁止远程推演历史——LG-035 谜题三轮不完整答案教训
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d7be6c8b-3fe9-49c2-810d-fd112b5be174
  modified: 2026-09-12T07:47:09.354Z
---

LG-035 CEO 走查 PUT 400 谜题：本席先后给出三个不完整答案（存储源不明→dist 谜题源→终谳=本机 .env 已配 ADMIN_TOKEN 而 CEO 填入值错配+徽标假待应用），根因=未第一时间做两个十秒钟实证动作（活体三态快测+本机 .env 键名扫描），远程推演三轮。

**Why:** 环境状态类问题（token 配置/进程态/文件落点）的历史推演会因「多代进程重启+多席写入+编译位双态」三轮失真；活体当前态一个 curl/一次键名扫描即定谳。

**How to apply:** ①环境状态类问题第一步=直接测活体（curl 现役端点三态/读现役配置文件键名/查现 pid 的启动参数），推演放最后；②涉及「我以为配了/我以为写了」类断言，先 rg/ls 实盘再开口；③给出路径/键名答案前必须验证该键在指认文件中真实存在（本轮 TRILC_INTERNAL_TOKEN 零命中教训）；④发现自己前函有误，立即发更正函，不静默修正。

- 2026-10-04 R-HY TriRMC 实证：HTTP 8710 活+服务进程活，但 cron executor 整体停摆（三 job 全过期、store 末次写 10-01 10:45）——「服务活」探针不含 executor 心跳；多 job 全过期+store 末次写陈旧=executor 停摆指纹，调度面健康核读必查 nextRun 过期数与 store 写时点（根因勘验=BOD R-HY 三刀，假设 nextRunAtMs 缺失被证伪）。

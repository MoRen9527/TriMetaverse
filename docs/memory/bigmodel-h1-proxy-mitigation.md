---
name: bigmodel-h1-proxy-mitigation
description: sg 13席 claude 会话走本地 8460 H1.1 代理（bigmodel WAF 拦 Bun TLS 指纹的缓解位）；1210 复现先查代理
metadata: 
  node_type: memory
  type: project
  originSessionId: 142b839b-781d-4c51-98ce-ccc8d36b8ff2
  modified: 2026-09-15T14:11:17.338Z
---

2026-09-10 事故定谳：bigmodel 网关（阿里云 GA）按客户端 TLS 指纹拦截 claude CLI（Bun/BoringSSL）→ 400 [1210]「参数有误」，与载荷/凭据/模型名/上下文全无关（同头体直连 1210 / node H1.1 代理 200 = 决定性对照）。非我方配置问题。

**现役缓解位（勿拆）**：sg `bigmodel-h1-proxy.service`（systemd，/opt/bigmodel-h1-proxy/proxy.mjs，listen 127.0.0.1:8460 → open.bigmodel.cn:443，H1.1+SSE 直通，Restart=always）；`/home/fleet/.claude/settings.json` 的 ANTHROPIC_BASE_URL=127.0.0.1:8460/api/anthropic（settings 覆盖进程 env，实证过）。13 席 m-* 会话经此上大模型。

**排障口径**：sg 席位再报 1210/连不上 → 先查 `systemctl is-active bigmodel-h1-proxy` + `curl http://127.0.0.1:8460/healthz 路径形态`（无 healthz 端点，用 /api/anthropic/api/hello HEAD）→ 再查 proxy.log（/opt/bigmodel-h1-proxy/proxy.log，仅状态码）。settings env 会覆盖 shell 导出的 ANTHROPIC_*，调试时改 settings 或用 HOME 隔离副本。

**根治候办**：bigmodel 申诉 TLS 指纹白名单（R1）；裸 bun 最小请求确认性实验（R2）；watchdog 入值班 patrol（R3）。回滚位=settings 还原直连+unit disable（bigmodel 修复后）。

正身报告：TriMetaverse/docs/execution/20260910-bigmodel-400-1210-incident-report.md（6757bb56）；证据 sg /srv/fleet/incident-20260910-400-1210/（脱敏）。相关：[[glm-model-deployment-map]] [[trilc-daemon-restart-discipline]]

**1310 族·账号配额（2026-09-15 实证，与 1210 族区分）**：sg 席位报 `429 [1310] 每周/每月使用上限`——账号级配额耗尽，**非 WAF/指纹问题**（1210）也非代理故障。报错文本自带重置时间（首例=2026-09-16 20:44:33）。分诊：1310→查 bigmodel 控制台配额/换备号/等重置；1210→查 8460 代理。影响=sg 席位 AI 响应（shell 级作业不受阻，当晚四步执行实证）。

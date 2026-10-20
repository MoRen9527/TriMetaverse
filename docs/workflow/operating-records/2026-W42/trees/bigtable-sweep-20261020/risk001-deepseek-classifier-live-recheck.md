# RISK-20260728-001 活体复勘卷（大表清扫①·CTO）

- date 现查: 2026-10-20 12:4x CST；分支=report/20261020-bigtable-sweep（自 dev）；只读勘证 ✓
- 标的: DeepSeek classifier 间歇不可用（P0，W31 起源；缓解=agent 加 Bash 权限；候 CTO 现势复勘）

## 活体复勘读数（sg 面）

1. **DeepSeek API 可达性**: GET https://api.deepseek.com/v1/models 未认证探针=**401**（服务可达、正常鉴权拒——网络/DNS/服务面全活，非 000/timeout 不可达态）。
2. **TriModel sg 网关**: GET 127.0.0.1:3333/v1/models=**200**（网关在役、模型路由面活；deepseek=primary provider 配置在案）。
3. **复发记录扫**: W31→W42 台账对表零复发零处置（10-13 批对表采信沿用）+本席 10-02→10-20 跨多窗会话运行零 classifier 阻断观察。
4. **缓解结构现势**: W31 缓解=「agent 加 Bash 权限」dev 面结构——sg 镜像 .claude/agents 22 件 tools 面 Bash 映射 **0 命中**（sg 镜像无该缓解形；缓解本体在 dev 座席运行面，实勘归 dev 对表项）。

## 复勘结论

**现势=缓解态持续、通道双活（DeepSeek API 可达+TriModel 网关在役）、W31→今零复发读数——「间歇不可用」无现势证据。** 建议: RISK-001 降级 P0→**P2 观察态**（复发即升回），或由 dev 面补一次真分类调用全链实测（需 dev 侧 key/运行面，sg 不可达）后销账。W31 缓解（Bash 权限）维持不撤（无害冗余）。

## 使用依据

OP-202610-W42-001.unresolved-items.md:29（承袭态行）；W31 OP 卷起源行；curl 活体探针三读数（401/200/404 区分）；.claude/agents 22 件 tools 清点。

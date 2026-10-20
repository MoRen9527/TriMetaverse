> sourceOfTruth: 本文件=TD-obs-1 卡③告警出向通道 BOD 跨机勘报卷（COO 21:39 流转·跨机归 BOD 面操作·勘毕供修复定向）
> syncMode: static · lastSyncedAt: 2026-10-14T21:50:33+08:00

# TD-obs-1·卡③告警出向通道勘报（TRIMC_NOTIFY_SG_URL 对端活体）

【D-24 机位断言头】勘位：本机（M 面·dev 机）→sg 机（47.245.122.61·M-SG）跨机链；事件源=8711 TriRLC（R面本地域·obs 卡③ degraded 告警出向）与 8713 TriMLC（power 段同构形）。

## 一、结论先行

**根因定性：sg TriMC daemon（8712）监听面只绑 127.0.0.1（回环独占）→本机侧告警出向连接级不可达→fetch failed（非 403）。** 403 属应用层拒绝——本例 TCP 层即被拒，请求根本没到应用层，与 token/URL 路径无关。

## 二、证据链（三证）

1. **本机直连测（复现 8711 fetch 视角）**：`curl http://47.245.122.61:8712/healthz` → HTTP=000·connect=0.002s·rc=52——2ms 瞬拒（REJECT 族非 DROP 超时族）。
2. **sg 侧监听面（活体现探）**：`ss -tlnp` → `LISTEN 127.0.0.1:8712 (node pid=3126596)`——**回环独占实锚**；对照 `*:8460`（全接口·代理位本机可用先例）自洽。
3. **代码面语义对表**：TriRLC `src/config/env.ts:169` `trimcNotifySgUrl ?? ''`（空串=告警禁用·obs 卡③注释「照 TriMLC power 段同构形」）；TriMLC `src/config/env.ts:165` `notifySgBaseUrl`——两 daemon 同用此 URL，8713 power 段 notifyFailures=3 同因。

## 三、修复定向（三案供 COO/CTO 裁·BOD 不代裁施工面）

- **案 A（标准正形）**：sg 8712 改绑 0.0.0.0 + 阿里云安全组放行 8712 入站（限源 IP=本机出口）+ token 门保持——涉 sg daemon 改绑重启，**D-23 v3 白名单①类（daemon 勘修/重启窗）**；
- **案 B（不动 sg 面）**：本机常驻 SSH 隧道 `ssh -L`（8711/8713 出向 URL 指 localhost）——免 sg 改动，但隧道属常驻脆弱面（断线静默失效=假绿风险），需守护；
- **案 C（改通道形态）**：告警不走 HTTP 出向，改走 sg 箱 JSON 文件面（BOD 巡检写面先例成熟）——改代码面最大，胜在零端口暴露。

BOD 倾向注（供参考非裁）：案 A 标准且一次性根治；案 B 可作今晚先行恢复通道的过渡（隧道立即通，白名单窗内再落案 A）。

## 四、后置链（COO 已排·不变）

通道修通后才轮 8713 白名单补录 source_seat='trirlc-conn'（观察池序位其后）；21:24-21:40 FSD 合成注入窗已过，后续 mc_link 状态读数为真值。

—— 落款（date 现查）: 2026-10-14 21:50:33 +0800（BOD·TD-obs-1 跨机勘）

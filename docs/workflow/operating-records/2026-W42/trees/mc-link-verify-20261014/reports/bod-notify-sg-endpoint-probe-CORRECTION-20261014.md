> sourceOfTruth: 本文件=TD-obs-1 勘误卷（撤 21:44 勘报卷主定性·全时间线重锚·append-only 不改前卷）
> syncMode: static · lastSyncedAt: 2026-10-14T22:03:23+08:00

# TD-obs-1 勘误卷：出向通道根因定性更正（撤「sg 8712 绑回环」主定性）

【D-24 机位断言头】勘位：本机（M 面 dev 机）daemon 启动链+日志活体；前卷=e4a62de27（bod-notify-sg-endpoint-probe-20261014.md·其 §一 主定性撤回）。

## 一、前卷错在哪（自我勘误）

前卷定「根因=sg 8712 只绑 127.0.0.1 回环独占」——**勘错对端**：8713 daemon 的 `TRIMC_NOTIFY_SG_URL` 实值=`http://127.0.0.1:18710`（trimlc-daemon-channel.cmd:17·**本机隧道口，非公网 sg:8712**）。「sg 8712 绑回环」是 2026-09-30 BOD #140 裁 A 案时的**已知设计前提**（keeper 脚本头注记原文「TriMMC 8712 走 SSH 隧道」）——非新发现，更非本次 fetch failed 的因。前卷测试（公网直连 HTTP=000）测的是一个 daemon 根本不在用的路径。

## 二、真时间线（日志活体对表·全部实锚）

| 时点（UTC→本地+8） | 事件 | 证据 |
|---|---|---|
| 10-14 01:04:00Z→09:04 | 出向 #1 败（timeout 族·seats m-cos,bod） | channel.log |
| 01:11Z→09:11 | #2 败（timeout） | channel.log |
| 01:21:37Z→09:21 | **#3 连三败→urgent 通道降级仅日志·notifyAlarmSent=true**（此后罩住不再重复发） | channel.log |
| 01:32:49Z→09:32 | keeper 判死→(re)spawning ssh | tunnel.log |
| **01:34Z→09:34** | **隧道恢复·alive 连续至今（22:0x 仍在记）** | tunnel.log 每分钟 alive 行 |
| 01:34Z 后 | **零新出向尝试**（87% 掉电不达 gate 线·L92 `if(acOnline) return 'ok'`）→notifyFailures 冻结在 3=「看起来还在坏」假象 | power-monitor.ts L286 成功回零语义·零新 gate 事件 |

## 三、真结论

1. **通道现役健康**：本机 curl `127.0.0.1:18710/healthz`=HTTP 200（0.22s）+keeper 探活每分钟 alive（http 401=链通鉴权拒）2.5h+ 稳态——**fetch failed 是今晨 09:04-09:34 半死窗的历史读数冻结**（半死形态：本地 ssh 进程在·转发通道挂→5s timeout 非 refused；keeper 判死滞后 45s+ 所致）。
2. **8713 notifyFailures=3 清零方式**：下一次 gate 事件出向成功自动回零（代码语义）——无需人工干预；如实记卷候自然验证。
3. **8711 obs 卡③出向**：notifyFailures=0·alarmSent=false——从未触发过（degradedFailures=0 未达告警线）；trirlc-daemon.cmd **无 NOTIFY env 行=告警出向禁用态**——启用件=补 env+TriRLC 冷起，仍候白名单①勘修窗（COO 后置链不变）。

## 四、对 COO 两点半批（4a6188405）的更正请求

- **案 A（sg 8712 改绑公网）请求叫停**：改绑=推翻 9-30 BOD #140 裁决（隧道形态）且新增公网攻击面（token 门在但暴露面扩大）——当时 #140 裁 A 案正是为免改绑。明晨窗排程前请撤该项。
- **案 B 无需执行**：隧道已在位且健康（keeper 常驻·HKCU Run 自启·auto-retry）——「今晚起隧道」事实面已完成态。
- **TD-obs-1 卡③收口正形改写**：不是「修通道」而是「①定性勘误（本卷）+②观察项：keeper 活性巡检挂靠」（keeper 脚本头自记「活性断言：挂 hub-silent-detect/patrol 巡检候下窗·BOD #140 骑缝①」——至今未挂·今晨半死窗 30min 未被任何巡检发现=实证缺口）——**今晨事件的真实教训是巡检盲区非通道设计**。观察项并入明晨轻项并批窗。
- **卡④ 24h 观察窗不变**（时点 10-15 21:35·dim-4 候 CTO 复核）。

—— 落款（date 现查）: 2026-10-14 22:03:23 +0800（BOD·TD-obs-1 勘误卷·D-47 勘正:原落款 22:07 系预估违规·现查原值重锚）

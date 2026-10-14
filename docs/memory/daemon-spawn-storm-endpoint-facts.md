# daemon 上下文 spawn 风暴诊断+8713 端点鉴权事实（LG-069 读链 10-11 实弹）

> 勘验正身=Trees lg069-power-gate-20261007/cto-power-read-storm-survey-20261011.md（a00045f1）；本条=可复用判别式与端点操作事实。

## 现象与统一根因候选

- power 读（spawn powershell 10s timeout）连续 19 次 timeout+runner 派发延迟 5 分+悬挂 600s **同窗同受累**（13:39-14:01）——daemon 上下文 child spawn 管线退化为统一根因候选；14:01 自愈+14:07 拍准点=全链恢复。
- 全日背景=间歇 flapping（成对 timeout+自愈复位循环，counter #1#2 反复不达阈）——channel.log 行无时戳，**行距≠时距**，counter 序列做 uniq 才见 flapping 形态。

## 判别式（复用面）

- **系统级健康而 daemon 上下文退化**：手工同 snippet 快（1.7s/0.9s）+Winmgmt Running+零僵尸 powershell=三证排除机器级，故障面收敛 daemon 进程上下文（自 spawn 竞争/句柄面/Job 对象=机制候选，深勘需 spawn 耗时埋点候窗）。
- **陈旧缓存不可信判定=活体直读真值对表**：healthz 88/ac=false vs 真值 AC=1/85%——缓存语义缺口：读失败期闸态冻结最后已知值与实测不可区分（gateStale/lastReadAt 投影候办，二期从闸前置件）。

## 8713 端点操作事实

- `/internal/v1/*` 鉴权头=**X-Internal-Token**（非 Authorization Bearer；Bearer 得 401 误判 token 错）。
- **healthz 免鉴权**且 power 段八字段可读（percent/percentRaw/percentCim/acOnline/gate/batteryPresent/readFailures/notifyFailures）——LG-069 二期从闸轮询面正身（免 token 共享，凭据面最小化）。
- crash.log 正身=`%LOCALAPPDATA%\trilc-channel\crash.log`（8713 启动链 TRILC_DATA_DIR=trilc-channel；**appendFileSync 首写才建**——不存在=零 crash 非路径探错；探 trilc\ 是 8711 的目录）。
- token 提取：channel.cmd 里 grep 变形在 Git Bash 会吃引号转义（空 token→401），PowerShell Select-String 提取稳。

## 双防线实弹（正面）

22min 风暴+bod-tick 600s 悬挂双重压力：零崩溃+crash.log 零行（件A）+timeout→error 落账零 rejection 泄漏（件B）+notify 达阈一次不重复（修复批③）——勘修窗三件实弹兑现。

## 索引行全量快照（2026-10-13 16:0x CAO 压缩施工·MEMORY.md 裁短前存档·细节权威位=本文件历史段+本快照）

- [daemon spawn 风暴诊断+8713 端点事实](daemon-spawn-storm-endpoint-facts.md) — 判别式：系统级健康而 daemon 上下文退化（手工同 snippet 快+零僵尸+counter uniq 解码行距≠时距）；陈旧缓存不可信=活体直读对表（healthz 88/ac=false vs 真值 AC=1/85）；/internal/v1/* 鉴权头=X-Internal-Token 非 Bearer；healthz 免鉴权且 power 八字段在位（从闸轮询正身）；crash.log=trilc-channel\ 首写才建——不存在=零 crash 非探错路径（BOD 四候选扑空案）；22min 风暴+600s 悬挂=件A/件B 实弹兑现（2026-10-11 13:39-14:01）

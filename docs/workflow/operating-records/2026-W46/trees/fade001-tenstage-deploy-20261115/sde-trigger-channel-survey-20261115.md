# SDE 首拍触发通道实勘卷（TriRMC 8710 POST run·CEO 19:47:33 r75 令①·手动拍主刀前置）

- sourceOfTruth: 本卷（触发通道实勘正身·值席经转 BOD）
- syncMode: write-time
- 勘验席: SDE 小布；实勘法=代码面静态勘（TriRLC src=TriRMC 同源·零生产触）+五轮预演行为实证对表（双锚）
- 判定: **通道主刀可行确认——手动拍=同通道 POST run·五轮实证+代码面对表全吻合**

## §一 · 端点现势（代码面·app.ts:4377-4402）

- 端点：`POST /internal/v1/cron/jobs/{id}/run`（路径参数 jobId=decodeURIComponent·目标 job id=`9c81c7ec-ed76-4489-98c0-81c6601f541b`）
- Body：`{force?: boolean}` 可选——**empty body OK**（JSON.parse 失败静默容空·:4391）
- 鉴权：X-Internal-Token 头（daemon 门令·**proc env 直读正形**——unit 面滞留旧值 401 勘正在案）
- 响应：200+`{ok, ran, reason?}`（**同步 await 形**——handler 等 runJob 跑完才返回·:4393）

## §二 · 幂等/防重面（service.ts:165→timer.ts:422/88/379-409 三层）

| 层 | 机制 | 读数 |
|---|---|---|
| 队列锁 | `enqueueRun`→`withLock`（timer.ts:88-91 acquire/release） | 并发 POST=**串行排队**（非拒绝）——连发两次=两次 run（除非撞 running 态窗） |
| **防重锁** | `runJobNow` :386 `if (job.state==="running") return {ok:true, ran:false, reason:"already-running"}` | **job running 态=拒重**（force 亦拦——running 检查在 force 检查后无条件生效）——**手动拍执行中若 23:50 tick 到来=拒重不双拍** ✓ |
| force 门 | :385 `if (!opts?.force && !job.enabled) return reason:"disabled"` | force=越 disabled 门（**非必需**——目标 job enabled=true 走 default 路径即可·手动拍不用 force） |

## §三 · 五轮行为实证（首拍+G5+线 3+验证线+loop1）

- 五次 POST 全部受理：runCount 14→19 每轮+1·run dir 每轮新建·ops commit 每轮+1（c98fd659/01a2329ea/862357445/2101c64a3/e8ec15c39）——单发受理形
- **35s 同步超时根因实锚**：handler 同步 await runJob（链长>curl 超时）——**断连不影响服务端执行**（五轮 run dir 全部落·零失败零重复）——手动拍触发形照用（curl -m 放宽或断连后轮询 run dir 均可）
- 零误触零重复实证：五轮 runCount 严格 +1 递进·无幽灵 run

## §四 · 首拍时序安全面（重排语义对表）

- runJobNow :404-409 跑后重排：`nextRunAt=Math.max(下个 cron 匹配, endedAt+MIN_REFIRE_GAP)`（refreshed.enabled 前提）——cron `50 23 * * 0` 下个匹配=**今天 23:50**（手动拍毕时点<23:50 前提下）
- **23:50 首拍锚保持判**：手动拍毕（倒排毕线 23:00·冻结闸 23:30）→重排 next=今天 23:50 ✓（MIN_REFIRE_GAP 不触——23:50 远大于 endedAt+gap）
- **cron 机械锚零触红线对表**：POST run 不触 schedule/cron 本体（applyJobPatch 才动）——重排=runJobNow 内建 cron 正形行为非"改锚"——**手动加拍合规** ✓

## §五 · 手动拍主刀操作形（候三闸毕值席令执行）

```
TOK=$(cat /proc/$(systemctl show trirmc -p MainPID --value)/environ | tr '\0' '\n' | grep '^TRIRMC_INTERNAL_TOKEN=' | cut -d= -f2-)
curl -s -m 240 -X POST -H "X-Internal-Token: $TOK" \
  http://localhost:8710/internal/v1/cron/jobs/9c81c7ec-ed76-4489-98c0-81c6601f541b/run
```
- 无 body（force 不用·enabled=true default 路径）｜-m 240 放宽（同步形·首拍全链时长候实弹——预演轮 ~1min·首拍 agent 化实走+判分面时长候观测）
- 触发时刻=date 现查锚（五轮同制）｜断连兜底=run dir 轮询（GET only）

## 使用依据

TriRLC src/server/app.ts:4377-4402+src/cron/service.ts:165-171+src/cron/timer.ts:88-91/379-409（静态勘实读）；五轮预演行为实证（毕报族 sde-preview-exec-readout-{首拍/g5/line3/verifyline/loop1}-20261115.md）；r75 令①。

—— SDE 小布（实勘毕·候三闸毕值席手动拍令·哨态值守·卷面时戳=commit %cI）

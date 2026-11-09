# A-1 窗删树事故三勘（CTO family owner·fade011-ew 族两 run 树）

- sourceOfTruth: 本卷（三勘读数正身·回 BOD 终裁输入）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: BOD 裁决单 2026-11-05T10:16+0800（D-39 全域授权·COS 路由 10:18:46）·勘定期两树维持删除现状不回填
- 勘定席: CTO 小狄（fade011-ew 族 family owner）·勘定法=fade.db 直查（$LOCALAPPDATA\trilc-channel\fade.db·8713 store DATA_DIR 对启动链勘定）

## 勘 (a) · dev 侧 fade.db 记录面——**在·全字段完整**

两棵被删树对应 fade_runs 记录**完好在册**（bod 损害基线预估之外的正读数）：

| run_id | created_at | state | checkpoint |
|---|---|---|---|
| fade-w-fade011-ew-c6a6aea17564 | 2026-11-04T04:52:49 | APPROVED | FINALIZING 段 |
| fade-w-fade011-ew-c89a45715f36 | 2026-11-04T04:54:19 | APPROVED | FINALIZING 段 |

字段面：run_id/profile/state/checkpoint/created_at/updated_at 全在；状态机谱=fade_run_transitions 570 rows 全在；ew 族自检 run 全谱=57 runs（04:02-05:09 高频段几十发 APPROVED）。gate_rejections/watch_state/watch_audit 表全在。

**损害面重定性：记录面零损失——删损仅盘面 artifacts（树目录物理删·untracked 不可溯）·记录语义完整由 fade.db 承载。**

## 勘 (b) · run 价值评估——**已被取代成立**

1. 单发增量≈零：ew 族自检 run=fade-w watch 环高频心跳（1.5-5 分钟一发）·内容同构（程序化壳·零内容产出——COS 11-04 报实证）·单树删损不损信息面
2. 记录语义已承载：run 状态机证据完整在 fade.db（勘 a）——「8713 旧形自检环活」事实的证据链不经盘面树
3. 活性证明语义已被新形取代：管线经 11-04 sg 化+8712 迁移+drop-in 五环修复+node22 后·新形 run 已多发（22:11 8712 形 gated=true score 100·今晨 sg 侧 fade-w-* 树继续落盘）——旧形自检的「管线活」证明已被修复后代码实例覆盖
4. 结论：**无独特价值面·bod 项 b 判「已取代」=成立**

## 勘 (c) · checkpoint 可用性/重建可行面——**无需专项重建**

1. checkpoint=FINALIZING 终态段标记（非可续跑中间态）——同 run_id 续跑既不可行也无需求
2. **等价形可再生**：fade-w watch 环现役双侧活（本机 8713+sg 8712）·自检 run=高频可再生资源·下一发自然落盘即等价形树
3. 结论：重建=伪问题——环活着·资源可再生

## 倾向性意见（BOD 终裁输入）

**放弃重建**——记录面完整+单发增量≈零+等价形可再生，损害止于盘面 artifacts·不再扩。
**防损害扩面建议**：fade.db 记录面（57 runs+570 transitions）=现值唯一的族谱真源·建议导出归档一份（W45 operating-records 快照形）·防未来 DB 轮转/清理再损——若 BOD 采·本席随手窗可办（读侧导出·零写库风险）。

## 使用依据

- fade.db 直查（五表全勘·本卷时戳前读数）
- COS 路由信（10:18:46·损害基线三锚）·bod 附注
- 11-04 管线修复链卷（8712 重启五环/221104 run）·sg 侧树 ls 读数（今晨门禁探针窗）

# G6 行级终判两件读数卷（BOD 工单·COO 转派·只读零改动）

- date 现查: 2026-10-17 14:1x CST
- 勘料: /tmp/trimc-run.log（48881 行现势）+ TriRLC src（/srv/fleet/TriRLC 源码镜像）

## 件① 13:53-14:08 区段对表 →「观测面缺口假警」坐实（且发现反向语义误消费）

- 区段实勘（行 48749-48857）：13:53/14:08 两轮 e1-b2 watch 之间 **[trimc:mirror] 翻转行仅 1 枚=48840 `TABLET-0BGCRCP5-10832 stale → unknown`**——**8713 本体（TABLET 键外）翻转行=零**。
- **14:08:19 recovered 拍触发行实勘**：区段内唯一新 mirror 行=48840 的 **stale→unknown（心跳丢失宣告）**——即 14:08:19 的「recovered 拍」系 watch 把 **stale 行当活动行消费**所致（MIR 过滤前缀 `[trimc:mirror] node ` 同时匹配 stale 与 recovered 两类**语义相反**的行）。
- **判**：「观测面缺口假警」坐实 ✓，且升级定谳——**watch 的 recovered 信号对 stale 行反向误消费**（丢心跳宣告被当恢复庆祝），观测面缺陷从「翻转行 only 缺口」精化为「**语义不分的翻转行消费**」（stale 行污染 recovered 信号，比缺窗更狠一级）。
- 佐证：13:53-14:08 五轮 watch（04:53/05:08/05:23/05:38/05:53Z）区间零 mirror 翻转行=健康稳态静默（前卷路 5② 机理再证）。

## 件② 行级键身份 → nodeId=env 注入 hostname-pid 形，pid 半实证精确吻合

- 构造位：TriRLC `src/index.ts:146` `node=${env.nodeId}`——nodeId 系**启动 env 注入值**（非代码内 hostname() 拼装；代码侧 hostname 仅 init-sync generatedBy 用）。
- **pid 半实证**：新键 `TABLET-0BGCRCP5-10832` 之 10832=12:52:30 R1 restart 新进程 pid（增补二回执锚精确互证）；旧键族 30340/30624=restart 前世代 pid ✓——**每次 TriRLC 进程重启=新 nodeId 键**（hostname-pid 逐代换键），flap 对（旧键 stale+新键 recovered）=重启周期的机械投影。
- hostname 半（TABLET-0BGCRCP5=dev 机 hostname）：形态吻合（dev 机 Windows tablet+powercfg 探针先例），值面终确认归 dev 对表项（sg 面无该 hostname 直读源，如实注）。
- **运行态附察**：48840 行显示现役世代（10832）心跳亦已 stale→unknown——8713→8712 链在勘验时点处于**新一代 stale 期**（宿主睡眠族征，与两案家族归因同向），如实录不擅动。

## 判读汇总

观测面缺陷最终形=**三级**：①翻转行 only（健康稳态零行）②语义不分（stale 行当活动消费）③逐代换键（重启断代观测连续性）。b2 假警两拍（10:23:16/14:08:19）机理均在三级内闭合。E1-4 v2 挂点建设选项权重随之更新：**in-process 形态（选项②）升首选**（天然绕开三级缺陷：直读内存真值/语义正确/跨代连续），GET 端点（①）次之（仍需消费方语义正确），sidecar（③）维持备选。

## 使用依据

/tmp/trimc-run.log 行 48749-48881 区段实勘；TriRLC src/index.ts:146+mirror/pusher.ts:24,71 读数；增补二回执锚（pid 10832）；g6 主卷五路+增补二（前卷）。

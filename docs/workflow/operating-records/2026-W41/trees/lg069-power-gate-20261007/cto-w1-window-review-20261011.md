# CTO 值窗审卷 · W1 8711 修复+从闸补窗（五笔逐销·2026-10-11 夜）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/cto-w1-window-review-20261011.md）
- syncMode: static（值窗审卷·门禁位终验）
- lastSyncedAt: 2026-10-11T23:49:00+08:00（date 现查窗·落笔时点）
- 审席: CTO 小狄（m-cto）；窗令=COO 14:2x+补窗 BOD 裁（22:45 起硬锚 00:10·8abd368d）；施工=FSD（毕报 23:47·卷 5576ee20）；审面对象=TriRLC 仓五笔 5ce806e/5874375/6fbde65/130133a/2e1e594

## 审面结论：**五笔全 APPROVE·窗 PASS**

| 笔 | 件 | 审面深度 | 判 |
| --- | --- | --- | --- |
| 5ce806e | 前置盘点（10-10 遗留笔续作认定·F-3 第一型 recompute 法 B） | diff 采认（小 diff+125 行回归测试背书·BOD 补窗令条款1 盘点链合规） | APPROVE |
| 5874375 | 件A crash handler | 本体 67 行全读 | APPROVE |
| 6fbde65 | 件C enabled 归一 | 本体全读（store/types/timer 三触面） | APPROVE |
| 130133a | 件B race 吸收 | 本体全读 | APPROVE |
| 2e1e594 | 从闸 follower | 本体 222 行全读+触面三件 diff | APPROVE |

## 同构件语义对表（TriMLC 正形三件）

- **件A ↔ fc44904**：双 handler（uncaughtException/unhandledRejection）+crash.log 结构化 JSON 行 appendFileSync 同步落盘防 exit 截断+append 失败降级 console 防递归+受控 exit(1) 交 watchdog revive+TRILC_CRASH_LOG_ONLY=1 回滚通道（键名前缀 TRIMLC→TRILC 适配正确·logOnly 模式下 rejection 语义变异知情注记在）——同构 ✓；crash.log 落 env.dataDir=与 8713 trilc-channel\ 分立正形保持 ✓
- **件C ↔ baf800d**：store 层 `(input.enabled ?? true) ? 1 : 0` 全入口归一+类型面 interface extends Omit 惯形（**TriMLC 交叉形破坏双变通路教训注记随件**——修法稿配方移植到位）+CronStoreLike.addJob 签名同步可选（「签名双处同步」坑位参照到位）+显式 false 不过度归一——同构 ✓
- **件B ↔ cc52c89**：guardedJob.catch 吸收滞后 rejection 转 error 结果入 race·状态面零变+clearTimeout 资源清理保留——同构 ✓

## 从闸方案稿对表（a00045f1）

- 状态机五转移全对表：following 镜像/poll-fail→holding 持有不 fail-open/×3→unknown+告警一次每段/staleness 传染/unknown 新鲜直回 following 无滞回 ✓
- **staleness=严格形**（isStale 缺位/NaN/超窗→true）——未采我值窗审口径明令拒的「poll 时间戳代偿」降级形 ✓；lastReadAt 前置件缺位期→unknown 放行态上线=COO 窗令预期形，投影落窗自动转正零返工 ✓
- unknown 放行+告警不停工（followerGateHard 只认 following/holding+hard）=§2.3 如实边界 ✓；soft 放行+落定日志 ✓
- dispatch 插点=shouldRunJob 后 command/agent 分支前（FADE-ASSESS-005 同插点正则）✓；手动 runJobNow 不经闸=人决面开放 ✓
- 回滚通道：TRILC_POWER_FOLLOW 非 '1' 完全旁路（模块不实例化+谓词恒 true 零影响）✓；置位面=FSD ps1 启动链注入（毕报明示·回滚=ps1 一行）——启动链 env pin 面操作可行 ✓
- 告警 v1=本地日志+healthz follower 段零循环依赖（§2.4）✓；四键投影在位（活体核 state=unknown/lastPollAt 在滚/pollFailures=0——**pollFailures 只计网络失败不计 staleness，实现与 L33 注记自洽**）✓

## 独立复验（门禁本分）

- tsc --noEmit 全量：exit=0 ✓（本席独立跑）
- 活体：8711 healthz follower 四键齐+60s poll 活+uptime 2550s（22:5x 冷启）+crash.log 零基线+jobCount=0 零业务中断 ✓
- FSD 自测 495/495 零 fail——采认（FSD 卷留痕·时间窗内未二次全量复跑，tsc 独立面已过；STE 门禁批窗归 STE 面）
- FSD 生效验证链照「重启窗完工判据」走齐（token 门→port FREE→冷启→pid/CIM 对表→值面探针→watchdog Ready）✓

## 审面发现（候办注记·非阻塞）

1. **启动段吞告警**：initialFollowerState segmentAlerted=true（防启动告警风暴·设计合理）——代价=冷启后主闸真不可达（×3 失败）段无 urgent 行（可见性剩 started log+healthz 段+bod-tick 扩探）；同根：初始段 holding/none（`prev.gate ?? "none"`）短失败静默放行。候办=观察项入 §67 反例库，明晨前置件窗后 following 态下同类失败告警面正常，届时再评是否补启动段告警。
2. **终验锚①顺延**：state=following 镜像 8713 gate 候明晨 8713 lastReadAt 投影落窗自动转正后验（FSD 遗留②同认）；锚②③④（闸置位/恢复自解/断闸 holding×3）候 8713 侧配合排窗——今日禁触碰约束下如实顺延，状态机面 11 例纯函数覆盖在。
3. **勘定**：FSD 遗留④ f612b9e「6 fail」注记=TriMLC 仓基线（LG-067 审查时点读数），与本窗 TriRLC 仓 495/495 无冲突——两仓两基线各表，STE 归因批（REQ-018 PID 例）照旧候批窗。遗留③ catch-status fail 负向实测候排认可。

## 使用依据

- 窗令链：COO 14:2x 窗令+BOD 补窗裁 8abd368d（22:45 起硬锚 00:10·禁盲叠/件级锁笔/生效验证值面探针三条款）
- FSD 毕报 23:47（卷 5576ee20）+五笔 commit（TriRLC 仓）
- 本席逐件 diff/本体实读+tsc 独立复跑+活体 healthz 读数（23:44/23:47 两轮）

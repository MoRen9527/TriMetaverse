# CTO 二期方案稿 · LG-069 电量双阈值闸 TriRLC 8711 从闸（候批）

- sourceOfTruth: 本稿（trees/lg069-power-gate-20261007/cto-power-gate-phase2-plan-20261011.md）
- syncMode: static（二期方案稿·纸面件零施工·施工候批后排窗）
- lastSyncedAt: 2026-10-11T14:08:41+08:00（date 现查原值）
- 方案席: CTO 小狄（m-cto）；令源=COO 窗毕拉单#1 改派裁（13:4x，对象断言报采信后裁 (b)）；一期正身=同树 cto-power-gate-tech-plan.md c05d4342
- 一期钩子原文（一期方案卷 §边界 3）：「TriRLC 8711 不在本闸 scope……TriRLC 从闸（轮询 /internal/v1/power）候二期另批，不混本窗」——本稿即该「二期另批」的批前方案纸。

## 一、对象与边界

**二期对象**：TriRLC 8711（R 面本地域 daemon，D:/Code/ai/TriRLC/）实现 LG-069 闸的**从闸**（follower）——闸检测与裁决权仍独占 8713 主闸（TriMLC），8711 只「跟随」主闸闸态并对其自身新派发行使同语义硬闸。

**不在 scope**（防扩窗）：
- 8711 侧独立电量检测（不做——双检测源即双真值源，违反单裁决权正则；一期 min() 教训已证读数分叉治理成本）；
- sg 面（TriMMC）从闸（服务域无电池，无意义；CEO 令域=本地域）；
- 8711 侧通知出向改造（alarm 面见 §四如实边界）；
- 强杀在跑会话（一期 CEO 字面+「daemon 不强杀」哲学照搬：硬闸只停新派发）。

## 二、架构裁定：主从闸拓扑与轮询面

### 2.1 拓扑

```
TriMLC 8713（主闸·现状不动）            TriRLC 8711（从闸·本二期）
  power-monitor（检测+min+防抖）           power-follower（新模块）
  stepPowerGate（裁决：none/soft/hard）     poll 60s → GET 8713 /healthz
  dispatch gate（自闸停新派发）              ↓ 持有 lastKnownGate
  healthz.power（闸态投影）  ←──loopback──  dispatch gate（hard 时停自身新派发）
```

### 2.2 轮询面裁定：**healthz 免鉴权只读面，不共享 internal token**（本稿核心裁决）

一期钩子写「轮询 /internal/v1/power」——**本稿改裁 healthz**，裁据三条：
1. **凭据面最小化**：/internal/v1/power 需 X-Internal-Token，从闸持有主闸 token=8711 被 compromising 即全权 8713 控制面（含 cron 写/shutdown）；healthz 免鉴权只读，从闸需要的恰只是只读闸态——零新增凭据面。
2. **字段面已足**：healthz.power 现役已投影 gate/percent/percentRaw/percentCim/acOnline/batteryPresent/readFailures/notifyFailures 八字段（本席 14:0x 活体核），gate 字段即从闸唯一必需消费面。
3. **前置件已在我今天勘验清单**：healthz.power 缺 lastReadAt 投影（snapshot 有、healthz 落投影——今天风暴「陈旧缓存不可信」的可见性缺口本体），从闸 staleness 判定必需该字段——作为二期前置小件随 8713 下个构建重启窗一并落（一行投影+单测，已向 BOD 中报 §⑥ 报备）。

### 2.3 从闸状态机（纯函数·单测直驱）

```
状态 ∈ { following(hard|soft|none), holding, unknown }
输入流: poll 结果 (gate, readFailures, lastReadAt) | poll 失败
转移:
  following: 直接镜像主闸 gate 字段（8713 裁决即最终裁决，从闸不二次判读）
  poll 失败: → holding（持有 lastKnownGate，**不即时 fail-open**——8713 崩≠电量恢复）
  连续 3 次 poll 失败 → unknown + urgent 告警一次/失效段
  following 中 staleness（now-lastReadAt > 5min）→ unknown + 告警（主闸读链故障传染防御）
  unknown 中 poll 成功且新鲜 → 直接回 following（无滞回需求——跟随者无抖动源）
派发语义:
  following(hard) → 新派发 skip（status=skipped, reason=power_gate_hard）；在跑不中断
  following(soft) → 放行+日志（soft 语义=COO 前置核查人工面，非 daemon 硬闸——与一期三层执行对齐）
  holding → 按持有 gate 语义执行（hard 持有照停）
  unknown → **放行 + 告警不停工**（如实边界：闸控职责在主闸+人工兜底；8711 停工权只跟主闸闸态走）
```

### 2.4 告警面如实边界（v1 最小化）

从闸的告警条件恰是「主闸不可达」——向不可达方委托告警是循环依赖。v1 裁定：**告警=8711 本地日志+8711 healthz follower 段可见化**；跨席 urgent 扇出候观察项（可由 bod-tick 巡检面扩 8711 healthz 探——BOD 面候办，不入本批 scope）。

## 三、8711 侧现状基线（引 SDE 勘验料 cd75d9bd+本席判）

| 件 | SDE 勘验 | 本席判（COO 候我判项） | 二期窗处置 |
| --- | --- | --- | --- |
| 件A 崩溃 handler | 8711 侧零在位（grep 零命中） | 缺口实锚无争议 | **随窗回流**（fc44904 正形+LOG 前缀适配） |
| 件B race guarded | L326 同形无吸收；executeCommand 全 resolve 形 | **可触发性=低但非零**：command 高频 rejection 面已被 resolve 形覆盖（triage 主面安全）；残余面=①runHeartbeatAgent await 链 reject ②isRoleActive/onRoleGateDenied 注入回调 throw——均低频但 43480 死因形态（timeout 先 settle+滞后 reject）在此成立即同炸 | **随窗回流**（cc52c89 正形 4 行+单测 3 例移植——同文件施工边际成本≈零，不值独立窗） |
| 件C enabled 归一 | 三要素全录（store L235 非归一形+类型必填+as never 透传） | 同源同形缺口成立 | **随窗回流**（baf800d 正形+类型面双改注记同坑位参照+SDE 预置 POST 探针验收） |

**施工组织裁定**：二期落码与三件回流**合并一窗**（触面高度重叠：index.ts 双件、timer.ts 双件、app.ts/store.ts 各一件）——「一次一件事窗」纪律不破：一件事=「8711 修复+从闸合并窗」一个窗令，窗内分件独立 commit+独立回滚锚，本席终验按件逐销。排窗候 BOD（建议 21:00 拍毕后小窗或明晨窗；8711 无 uptime 基线约束，但窗令须显式豁免今日 8713 禁重启约束的适用面讨论——合并窗若需 8713 侧 lastReadAt 前置件先行，则该件 rides 21:00 后窗，从闸施工可在前置件落窗后独立进行）。

## 四、触面清单（8711/TriRLC，候批后施工）

1. `src/power-follower.ts`（新建）：poll 循环+状态机（纯函数导出供单测）+healthz follower 段投影接口；env 开关 `TRILC_POWER_FOLLOW`（缺省 off=完全旁路·回滚通道，与 TRIMLC_CRASH_LOG_ONLY 同哲学）+`TRILC_FOLLOW_PRIMARY_URL`（缺省 http://127.0.0.1:8713/healthz）+staleness/interval env。
2. `src/cron/timer.ts`：dispatch 前置检查钩子（shouldRunJob 之后、command/agent 分支之前——FADE-ASSESS-005 同插点正则）；**同窗携件B 回流**。
3. `src/index.ts`：follower 生命周期挂接；**同窗携件A 回流注入**。
4. `src/server/app.ts`：healthz 补 follower 段（state/lastPollAt/lastGateSeen/pollFailures——与 8713 power 段观测面对称）。
5. `src/cron/store.ts`+`types.ts`：**件C 回流**（store 归一行+类型面双改）。
6. 测试：follower 状态机纯函数（following 镜像/holding 持有/×3 unknown/告警一次每段/staleness 传染/unknown 放行+hard skip/soft 放行）+件A 7 例+件B 3 例+件C 2 例移植。

## 五、前置件（8713 侧，随 21:00 后窗）

- healthz.power 补 lastReadAt 投影（一行+单测）——从闸 staleness 判定依赖。此件不落，从闸 staleness 传染防御缺输入（可先施工以 poll 时间戳代 lastReadAt 的降级形，但裁不：一步到位防二次返窗）。

## 六、门禁与验收锚（STE 预置）

- 单测门：§四.6 全绿+TriRLC 全量基线先采后对表（基线=施工前 fresh 采样，既有 fail 逐名在案不增不减）。
- 活体锚（合并窗内）：①TRILC_POWER_FOLLOW=1 后 follower.state=following 镜像 8713 gate ②8713 闸置位（真放电窗或测试注入）→8711 新 dispatch skipped（reason=power_gate_hard）③8713 恢复→8711 自解零残留 ④断 8713（shutdown 一次性）→holding 持有→×3 unknown+告警段一次 ⑤三件回流各自正形探针（件C=SDE 预置 POST 形；件A=子进程 throw exit1 形；件B=滞后 reject 吸收计数形）。
- 回滚锚：TRILC_POWER_FOLLOW=0 旁路（从闸件）+三回流件各自独立 commit 可单独 revert；dist 备份窗内现采。

## 七、风险与缓解

| 风险 | 级 | 缓解 |
| --- | --- | --- |
| 主闸误报传染从闸误停 | 低 | 主闸一期 min()+防抖已治理；从闸纯中继不二次判读（单一真相源） |
| 从闸自身 bug 停错派发 | 中 | 缺省 off 总开关+skipped 不杀在跑+独立 commit 回滚 |
| 8713 down 期 unknown 放行=电量耗尽风险敞口 | 低 | holding 持有压掉大半（8713 崩≠电量恢复）；unknown 段 urgent 告警+BOD 值守人工兜底（一期已实证有效）；如实边界入卷不粉饰 |
| healthz 免鉴权面暴露电源态 | 极低 | 电量/AC 态非敏感面；本机 loopback 消费 |
| 合并窗体量失控 | 中 | 窗令分件清单+独立 commit+逐件终验销账；任一件超时即砍件保窗（从闸件优先级最低可后置） |

## 八、候批清单（本稿不自带执行权）

1. BOD 排「8711 修复+从闸合并窗」窗令（分件清单照 §四；窗序建议=件A→件C→件B→从闸，回流在前从闸在后）；
2. 8713 侧前置件（healthz lastReadAt 投影）随 21:00 后窗落；
3. bod-tick 巡检面扩 8711 healthz 探（BOD 面候办，覆盖 unknown 段告警盲区）；
4. 二期施工派工（FSD 施工/STE 门禁预置/本席终验——M-004 直达分派候窗令）。

## 使用依据

- 一期正身：cto-power-gate-tech-plan.md c05d4342（§边界 3 二期钩子）+终判 c663b82f+修复批验收 cto-fixbatch-accept-20261008.md（主线全闭态）
- 8711 基线：SDE 勘验料 cd75d9bd（三件同源勘验·只勘不修）
- 活体核：本席 14:0x /healthz+/internal/v1/power 双端点读数（healthz.power 八字段在位+token 面差异实证）
- 今天风暴勘验：read-chain 勘验附卷（同树随毕报）——healthz lastReadAt 投影缺口的发现源
- TriRLC 源码实读：timer.ts executeJobCore/executeCommand/executeJobCoreWithTimeout（L230-340·本席逐行，非转抄 SDE）

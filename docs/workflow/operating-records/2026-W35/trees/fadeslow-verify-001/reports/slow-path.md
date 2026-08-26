# AC-4 慢通道独立拾取验证报告（fadeslow-verify-001 / SV-1）

**落盘**：TestEngineer 小柯（fresh 子实例，树 fadeslow-verify-001 节点 SV-1）·2026-08-26T20:2xZ·先写后报。本报告全部证据为子实例逐文件亲读摘录（含行号），未转抄派工指令文本。

## 一、实验背景：post-receive 先禁用、树后 push

本树为 FADE 管线受控实验（源 docs/execution/2026-08-26/fade-pipeline-design.md v1.1 §六 AC-4，见 tree-op.json L3/L5）：将裸仓 post-receive 临时禁用（重命名为 post-receive.off-ac4），验证 cron 慢通道能否独立拾取新 push 的树。禁用登记行原文（fade-hook.log 第 28 行，全文件末行，逐字摘录）：

```
[2026-08-26T16:2xZ] AC-4 受控实验：post-receive 临时禁用（重命名为 .off-ac4），验证 cron 慢通道独立拾取——实验后立即恢复
```

关键时序：本树注册 commit 7b60d5a7 推送时刻为 2026-08-26T19:01:47Z（UTC，由提交时刻 2026-08-27T03:01:47+08:00 换算，过程见 §五），晚于禁用登记约 2 小时 33～42 分（16:2xZ 精确分位未登记）——即本树自 push 起即无 hook 快通道可用，拾取只可能来自 cron 慢通道。**本报告的落盘本身（SV-1 fresh 子实例正在执行任务）即 cron 慢通道兜底成立的活体证据。**

hook 静默期佐证：fade-hook.log 末次 hook 派发行为 L24-25（15:13:20Z，trigger=hook）；此后仅 L26/L27 两次 concurrent hook skipped（flock busy，15:26:36Z、15:31:08Z）与 L28 人工禁用登记行，15:31:08Z 之后无任何 hook 触发的新行（L28 为人工登记行，非 hook 事件）。19:01:47Z 的本树 push 在该日志零对应行，与 hook 已禁用状态自洽。

## 二、拾取时刻与链路时间线

| # | 时刻（UTC） | 事件 | 证据 |
| --- | --- | --- | --- |
| 1 | 2026-08-26T16:2xZ | post-receive 禁用（.off-ac4）人工登记 | fade-hook.log L28 |
| 2 | 2026-08-26T19:01:47Z | 本树注册 commit 7b60d5a7 提交并推送（=2026-08-27T03:01:47+08:00） | 编排事实锚点＋本地仓库祖先链（本会话环境 git 快照 recent commits 含 7b60d5a7） |
| 3 | 16:2xZ–20:18:00Z | hook 静默期：fade-hook.log 无新 hook 行；registry ticks 同窗无任何条目（上一条为 14:48:48Z fade-rehearsal-001 收口，L425-434） | fade-hook.log L26-28；session-registry.json L425-434 |
| 4 | 2026-08-26T20:18:00.072550+00:00 | cron 慢通道 tick spawn 本树编排会话（pid 1020658） | session-registry.json L436-L441 |
| 5 | 2026-08-26T20:2xZ | 本 SV-1 子实例执行取证并落盘本报告 | 本文件 |

**拾取时刻=2026-08-26T20:18:00Z**（registry tick 字段精确值 20:18:00.072550+00:00；同条目 ts_epoch=1787775480.1286187 独立换算同为 20:18:00Z，秒级一致，小数差 0.056s 为登记写入时点差，不影响秒级结论）。

## 三、trigger=cron 字段证据（registry 末条逐字摘录）

session-registry.json ticks 数组末条（第 435-442 行）：

```json
{
 "tick": "2026-08-26T20:18:00.072550+00:00",
 "ts_epoch": 1787775480.1286187,
 "tree": "fadeslow-verify-001",
 "rc": "spawned",
 "pid": 1020658,
 "trigger": "cron"
}
```

- `tree`="fadeslow-verify-001"（L438）：与本树 treeId（tree-op.json L2）一致，该条目即本树 spawn 记录；
- `rc`="spawned"、`pid`=1020658（L439-440）：spawn 事件而非收口事件；
- **`trigger`="cron"（L441）**：与 hook 快通道条目写法（fade-hook.log L21/L24 `tick dispatched (trigger=hook)`）明确区分，证实本次 spawn 来源为 cron 慢通道——tree-op.json L21 所列成功判据「registry 出现 trigger=cron 的本树 spawn 条目」满足。

## 四、tick actionable 证据边界（如实标注，不臆造）

- hook 快通道的 actionable 留痕形态为 fade-hook.log 的 JSON 行（例 L4：`"actionable": ["rmc-audit-cmp-001"]`）；
- cron 慢通道侧 registry 末条 spawn 条目（L435-442）字段仅 tick/ts_epoch/tree/rc/pid/trigger 六项，**无 actionable 字段**（亲读核对，非推断）；
- 故 **cron 侧 spawn 条目无 actionable 留痕=证据边界**。本树慢通道成立的证据链=registry trigger=cron（§三）＋本会话实际执行 SV-1 并落盘本报告（活体事实），不以 actionable 为判据，亦不代填臆造该值。

## 五、push→spawn 时延（独立推算，到秒）

- 推送时刻：7b60d5a7 提交时刻 2026-08-27T03:01:47+08:00；+08:00 转 UTC 减 8 小时：03:01:47−08:00=前一日 2026-08-26T19:01:47Z（push 紧随提交，按编排锚点口径以提交时刻为 push 时刻）；
- spawn 时刻：registry tick 字段 2026-08-26T20:18:00.072550+00:00；
- 时延=20:18:00.072550Z−19:01:47Z，推算：
  - 秒级整数：19:01:47→20:18:00=1 小时 16 分 13 秒（验算：+1h=20:01:47；+16m=20:17:47；+13s=20:18:00）；
  - 折秒：3600+960+13=**4573 秒**；计入 tick 时间戳小数 0.072550s，精确值 **4573.072550 秒（≈76 分 13.07 秒）**；
- 对照预告：tree-op.json L21 预告 cron tick「约每 30 分钟」，实测 4573 秒≈2.5 个预告周期。**该差异列为证据边界**：registry ticks 数组只记 spawn/收口事件、不留空转 tick 记录（同窗上一条止于 14:48:48Z，L426），现有证据无法分辨是周期不准、期间存在未满足 spawn 条件的空转 tick、还是 tick 间隔漂移，不作定论。

## 六、P1-1 worktree 自愈旁证（tree-op.json L22 实测要求）

P1-1 判断框架（tree-op.json L22 口径）：hook 停用时工作树同步唯一依赖 tick 入口 `_sync_worktree()` 自愈，cron tick 能否看到新 push 的树全赖此路径。实测旁证三则：

1. hook 自 16:2xZ 起禁用、15:31:08Z 后零 hook 行（§一）——同步不可能来自 hook 路径；
2. 本会话于 20:2xZ 亲读本地工作树：本树目录 `docs/workflow/operating-records/2026-W35/trees/fadeslow-verify-001/` 完整可见（tree-op.json 24 行、reports/slow-path.md 桩 5 行均实际读出），其中树注册内容经 19:01:47Z 远端 push 入库——同步只能发生在该 push 之后至本会话启动之前；此窗口 hook 已禁用，且实验窗内无任何人工同步操作登记（fade-hook.log 与 registry 的唯一人工登记即禁用/恢复 hook 本身），同步路径只剩 `_sync_worktree()`；
3. 本会话环境 git 快照：分支 dev、工作树 clean，recent commits 头部 f5fdfd06 的祖先链含 7b60d5a7（本树注册）——本地工作树与远端收敛，无 dirty/conflict 残留。

三项合并：cron tick 入口的 `_sync_worktree()` 在本实验窗口实际走通——P1-1 修复在本场景成立（实测旁证，非仅代码审读推断）。

## 七、结论（AC-4 判定＋边界）

**判定：AC-4 成立——cron 慢通道独立拾取验证 PASS。** 依据链：

1. hook 禁用先于 push（16:2xZ＜19:01:47Z；禁用登记行 fade-hook.log L28）；
2. 禁用窗内本树 push 在 hook 日志零对应行，静默期与禁用状态自洽（§一）；
3. registry 末条出现 tree=fadeslow-verify-001、rc=spawned、**trigger=cron** 的 spawn 条目（§三），满足 tree-op.json L21 成功判据；
4. 本 SV-1 会话执行并落盘本报告=慢通道 spawn 后任务实际流转的活体证据；
5. 附加实测：P1-1 `_sync_worktree()` 自愈路径走通（§六）。

证据边界清单（如实）：

- cron 侧 spawn 条目无 actionable 留痕（§四），本验证不以 actionable 为判据；
- push→spawn 时延 4573.07 秒大于「约每 30 分钟」预告周期，registry 无空转 tick 记录、无法归因（§五）；
- 编排会话日志 /srv/fleet/shadow-plane/orchestrator-session-20260826T201800Z.log 存在但 0 字节（亲读确认 contents empty），会话内部行为无可读留痕，本报告证据源=亲读文件＋本会话自身执行事实；
- 本报告判定域仅 SV-1 取证与报告落盘；节点 status 翻转与收口 commit 经慢通道回流（tree-op.json L19 doneCondition 其余项）由编排本人执行，不在本报告判定域内。

# SDE 拾取卷 · n3 TriRMC 机制面×席位链路打通（要素③）

- tree-id: 3
- charter: charter-2026-W42-001
- canonical 树名: r-plane-duty-deploy-n3-notify-cron-link-20261016
- 执行席: SDE 小布（m-sde）·施工位=河源 TriRMC 8710
- 状态: 拆树落卷·候 COO 总调度复核（复核回前不开工）
- 依赖序: n1/n2 之后（进程树+名址先立后链路）

## 节点内容（任务书 §二 序3）

TriRMC 机制面与席位链路打通（notify 投递+cron 通道）。

## 施工草案（候复核）

1. TriRMC 机制面配置勘验（notify 投递目标位+cron job 形态·对表 M 面 8712 先例）。
2. notify 通道配置（D-46/D-54：值面禁打印·token 若涉轮换先勘消费对象+候选载入位清点）。
3. cron job 注册（三 daemon cron 行为分野勿互套——TriRMC 侧行为以源码+活体为准先读后定性）。
4. 链路终验：首信直达席位箱+cron 三查（201+next_run 值面+enabled=1）+触发读数。

## 门禁/毕锚

- 首信直达席位箱+cron job 新建三查+触发读数落卷（本树 reports/）。

## 止损

- 通道配置回退·daemon 优雅停重启链（POST /shutdown→port FREE→冷启→三断言·禁裸杀）。

## 护栏引用（任务书 §四 全条适用）

daemon 重启纪律/F-3 cron 白名单精确等值（command 变更必 403 须追加+重启）/端口硬规则 8710/D-46+D-54/D-47。

# CTO P1 终验卷 · 迁移失败告警面+preflight 断言（APPROVE·四查全过+技术债四注裁定）

- sourceOfTruth: 本件（CTO 终验判定卷·任务书施工序第 5 步门）
- syncMode: static（终验毕判·P1 窗收口承载）
- lastSyncedAt: 2026-11-10T13:32:32Z（写前现查 21:32:32+08 原值·D-47）
- 令链: CFO 复工令→COO 排窗单→CTO 任务书（fa69fcd9d）→FSD 施工毕报（ff0cdb0a2·READY_FOR_REVIEW）→本终验
- 判定: **APPROVE**——四查全过·止损线零触·单测复跑绿·活体抽验一致

## §一 终验读数四查（毕报自报+CTO 独立抽验并列）

| 查 | FSD 自报 | CTO 独立抽验（21:32-21:36+08） | 判 |
|---|---|---|---|
| ① 三测证据 | 测①分叉形（exit 128→兜底接手→告警 sent→state ok）+测②链断两态并档+补测①-b preflight 手动入口活体+测③分段回归 dry 全绿 | 日志两件活体在位：`/var/lib/trirmc/cron/logs/9c81c7ec-…13-19-01-277Z.log`+`…13-21-35-009Z.log`；单测 18 案本机复跑 **OK（Ran 18·0.268s）** | 过 |
| ② notify_failures 字段形 | ADE 顶层落地·preflight-fail 轮最小 ADE 含 notify_failures=[]·steps 键零污染 | 现役 W46 .shift-ade.json status=pass·top_keys 九键无 notify_failures=备份恢复件语义自洽（非新代码产物·下轮真跑新代码写入带字段版）——与「现役 pass 轮已恢复」互证不矛盾 | 过 |
| ③ 旧串保持可用（勘正②形） | TriRMC 无 ALLOWLIST（探①活体 PATCH 全链 201/200/ok 证）·旧串全文在 jobs.json.bak | jobs.bak 原位在（`/srv/fleet/TriRMC/data/cron/jobs.json.bak-p1window-20261110`）；回滚=PATCH 回原串零重启 | 过 |
| ④ 基线对表 | TC=1f3b997·TMV=6860bf87b porcelain 净·job enabled=1 cmd_len=809·shift-ade=pass 已恢复·备份两件 | 活体：TC HEAD=1f3b9978… ✓ TMV HEAD=6860bf87… ✓ porcelain 净 ✓ job enabled=True·cmd_len=809·兜底尾 `…shift_notify_fail --chain-exit "$E"; }` 在位 ✓ shift-ade=pass ✓ state.lastError=none（病灶清）✓ | 过 |

**一勘正注（如实入卷不改判）**：备份件实测分布=shift-ade.bak 在 `/srv/fleet/p1-window-backups/`（树外·防周日链卷入）·jobs.bak 在 TriRMC data 原位——毕报 §四「两件在 p1-window-backups」与实测 1+1 分布小偏差；回滚通道双通·语义等价·记偏差不记缺陷。
**观测面移位实锚**：job GET 读数 lastRunStatus=None·consecutiveErrors=None·state.lastError=none——兜底接手后 state ok 面（技术债注①机理活体证实）。

## §二 技术债四注 CTO 裁定

1. **兜底接手→state ok 语义权衡**→采认·观测口径改定：**job state=ok 不再等于链健康**——链健康真值三点联判=job 态+ADE status+ADE notify_failures 字段；缓解件=(a) 下轮真跑 ADE 带字段=每轮自证观测面（晨检读数三点联判）(b) P2 跨宿主心跳落位=第二观测位；LG-016 齿条③晨检判据扩「三点联判」候选候窗入册。
2. **双席到箱候 P2**→采认 COS 裁断维持（SMTP 单址先行=真人 BOD 可见·信箱通道=跨机面=P2 域）·env WEEKLY_SHIFT_NOTIFY_TO 位就绪·P2 通道落地后补值·不另开窗。
3. **catchup 真跑裁量**→**裁：不做**。理由：(a) carry_over 幂等未证=真跑有 W46 树面重复迁副作用风险（止损线精神）(b) 分段降险形（测③ pull 真跑+python dry）已证链面健康 (c) 周日 23:50 自然轮=全链回归锚（3 天后·含 carry_over 真段）(d) CFO token 收紧窗。替代=周日轮后晨检加「carry_over 段读数核验」一条；catchup 项挂起候周日读数。
4. **preflight 链跑恒放行机理注**→采认（分工表述两面陈述已在卷·机理自洽：链跑 pull 段先死→preflight 不触·手动 --sync 入口活体=补测①-b 实证）·无后续动作。

## §三 终验判定与收口

- **APPROVE**：代码三 commit（b67a19a/1f3b997/11efd39）+单测 18 案+注入三测+补测①-b 全数在卷·止损线三条零触（五段函数体/他 job/8713-8711）·基线对表齐——P1 窗毕。
- 收口状态：CodeRegistry 11efd39 首登行本席已验（weekly_plane_shift 行附三 commit 依据）✓；P3 裁定条款随卷知会 COS 台账；P2 勘验读数已出（毕报 §七）候 COO 排窗后另出简案定稿。
- 24:00 督办锚解除（21:29 收口·提前 2.5h）。

## 使用依据

FSD P1 施工毕报 ff0cdb0a2（§一至§八全卷）/探勘读数卷 464764253（三探+基线+病灶 45h）/TriCompany 仓三 commit 本机 git log 验/单测复跑读数（Ran 18 OK）/R-HY 活体抽验一发读数（本卷 §一④列·ssh -J sg 通道·token 零回显）/CTO P1 任务书 fa69fcd9d（§四步 5 门+§六回滚锚）。

—— CTO 小狄（m-cto·P1 终验），2026-11-10 21:3x CST（写前现查 2026-11-10T13:32:32Z=21:32:32+08 原值）

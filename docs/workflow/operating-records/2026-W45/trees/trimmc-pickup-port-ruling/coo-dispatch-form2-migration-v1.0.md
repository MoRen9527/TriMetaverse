# 派工单 v1.0（TriMMC 编排拾取件移植·形二席组形统一·COO 铸·形一派工作废重铸件）

- sourceOfTruth: 本件（形二移植派工单·COO 督办面铸·承 CEO 17:04:22 形态定谳·CTO 方案卷排工建议 §五）
- syncMode: dispatch-order
- lastSyncedAt: 2026-11-05T17:13:55+08:00（=2026-11-05T09:13:55Z·date 现查原值）
- 令源链: CEO 17:04:22 形态定谳令（席组形统一 M 面 sg+R 面河源服务域）→CTO 方案卷 `cto-form2-unification-plan.md`（TMV 2427a0f3f）→本席重排
- **形一派工作废重铸**：383 笔派工令（rmc_tick spawn 改投 8710·形一施工单）随形一定谳作废——1c 验收判定（形一时代挂）随形一作废；SDE 形一施工 COS 已令停（msg 09f6e8ba）零残留
- 总估: 串行 sg→河源 2-4h 级

## 一、序 1+2（sg 轮·即刻开工）

- 范围：sg 侧 `orchestrate_tick.py` 改造（TriCompany 仓单文件 ~100-150 行·**TriMMC daemon 零触碰·低风险**）+全链实测。
- owner：**SDE 主刀**（即窗——双小件毕空窗顺接）。
- 施工对表：CTO 方案卷 §四施工纪律+§五排工——正身以方案卷 2427a0f3f 为准。

## 二、序 3+4（河源轮·候序 2 毕触发）

- 范围：河源 notify 族 1082 行移植+rmc_tick 改造+追裁+部署勘修窗（daemon restart 链·低峰窗）+全链实测。
- owner：**SDE+STE**（形态 sg 实测背书后复刻·降返工）。
- 触发条件：**序 2 毕报达线即触发**（毕报=触发令·零空窗）。

## 三、施工纪律五条（CTO 施工单要点·随单带执行席）

1. **notify 必跟 tmux 直发**（normal notify 只落箱不唤醒 idle 值席——信到箱≠信到人）。
2. **tmux send-keys 补发独立 Enter**+capture-pane 验对话流增量（bracketed paste 吞 Enter 坑·暗示提示行≠真实输入）。
3. **河源唤醒前置闸：capture-pane 验 claude 框形态**（r-duty-cos 现=bash 形·bash 层直发落 shell=危险形禁）。
4. **河源部署窗 restart 链全链**：watchdog Disable→shutdown→port FREE→冷启→pid/CIM 对表→healthz（勘修窗七步实操序·Git Bash schtasks 路径坑在册）。
5. **回滚两段**：sg=git revert 单笔；河源=revert+restart 回滚链。

## 四、验收判定点

- 新判定点=**序 2 毕（sg 轮）+序 4 毕（河源轮）**——CTO 照验收锚七门出判定（形一 1c 判定作废不承）。
- 每轮毕报直达 BOD+抄本席；STE 复验两轮挂账（序 2 毕触第一轮·序 4 毕触第二轮）·复验形态四要素照本窗惯例。

## 五、回链与衔接

- SDE：序 1+2 即刻开工——毕报（含全链实测读数）直达 BOD+抄本席。
- STE：两轮复验挂账·现零动作·序 2 毕报达线触第一轮。
- 本席：督办读数随毕报·序 3+4 派工确认候序 2 毕达线（届时零空窗确认或按序 2 毕报微调后放行）。
- 纪律面：毕报全量读数+逐族归因/D-47 落款现查/token 值面禁/ TriCompany 仓施工前验分支向+MERGE 态（并行窗互踩族预防）。

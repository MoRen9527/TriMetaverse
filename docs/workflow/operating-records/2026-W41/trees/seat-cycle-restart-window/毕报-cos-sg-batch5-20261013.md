# R1 席位周期重启窗 · 批 5（sg 面）毕报 · COS 值席

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W41/trees/seat-cycle-restart-window/毕报-cos-sg-batch5-20261013.md）
- syncMode: static（窗毕定格）
- lastSyncedAt: 2026-10-13T23:35:00+08:00（date 现查·写前跑）
- 窗令源: BOD 批 5 开工令（23:08:29 hook 现戳·CEO 23:07「满足就不等开」）·执行正形=方案卷 2d1ae525 §五/§六+R1 执行单 v7 顺移版
- **窗终态: 毕（13/13 全毕零跳过·23:15-23:31·早止损 23:45 约 14 分钟）**

## 一、三栏执行对表

| 段锚（v7 顺移版） | 计划 | 实达 | 偏差 |
| --- | --- | --- | --- |
| 批 5 开（sg 现勘） | 23:10 起 | 23:09 现勘始/23:14 备案达/23:15 首席 | 段锚内 |
| 13 席毕 | — | 23:31（cos 收官） | — |
| 止损 | 23:45 | 23:31 毕 | 早 14 分钟 |

- 批序：sg批1 cso→cmo→rdt→cfo / 批2 cho→cao→coo→cpo / 批3 fsd→ste→sde / 批4 cto→cos（值席收官·BOD 追认准）。
- 零失败零跳过·单席失败停窗条款未触发。

## 二、重启正形与操作通道

- **tmux 会话重建法**（kill-session+new-session 照 Sep16 原生形态）：`source /home/fleet/.trimmc/duty-env && set -a && unset CLAUDE_CODE_CHILD_SESSION && export CLAUDE_CODE_FORCE_SESSION_PERSISTENCE=1 && claude --resume <席名> -n <席名> --agent <PascalCase> --verbose --dangerously-skip-permissions --append-system-prompt-file <手册>`——resume 优先（§五裁量）+重建法绕开 send-keys Enter 吞噬/暗示提示两坑族（§六自认通道脆）+每席 capture-pane 面核禁凭发送判成。
- 每席 boot 20s 后 capture-pane 验 TUI 就绪（❯ 输入框+席名标题+bypass on）——13/13 全过。
- 弹 resume 选择器 5 席（cfo/cao/cpo/cto/cos）：`--resume <席名>` 命中多个同名 customTitle 候选——双 Enter 选第一项（=「seconds ago」现役主会话；cos 特例两候选均显示 3 周前·选 4.6MB 主会话）·全过。

## 三、前后读数（§七度量格式）

### sg 面 13 席 RSS（MB·ps aux RSS 列 KB→MB 换算）

| 席 | 重启前（23:11 现勘） | 重启后基线（23:33 采） | 变化 |
| --- | --- | --- | --- |
| cso | 232 | 345 | +49% |
| cmo | 236 | 348 | +47% |
| rdt | 208 | 341 | +64% |
| cfo | 317 | 350 | +10% |
| cho | 263 | 349 | +33% |
| cao | 328 | 358 | +9% |
| coo | 204 | 345 | +69% |
| cpo | 293 | 340 | +16% |
| fsd | 281 | 415 | +48% |
| ste | 252 | 343 | +36% |
| sde | 241 | 343 | +42% |
| cto | 347 | 366 | +5% |
| cos | 438 | 368 | **-16%** |

- **核心发现：resume 起点 RSS 普遍高于重启前（+5%~+69%·平均约+31%·内存回收收益为负·cos 唯一下降）**——方案卷 §五 预警条款命中（「resume 后内存起点可能高于全新冷起…接受此限制·记录数据不返工」）。本读数=月度复盘（§七）定 sg 面常态形态（继续/双周轮/转 SDE 值席窗）的数据出口；重启用意中「上下文连续性+进程代际刷新」仍兑现，内存回收子目标 sg 面首轮证伪。
- sg 侧 tmux 13 会话+claude 13 进程一一对应（重启后 PID 全新·etime 全 <10min）；僵尸/孤儿进程扫描零命中。
- 附：现役 tmux 壳进程 3136462（Sep16 `tmux new-session` 客户端壳·5MB·27 天）为无害孤儿形态，清理候项不入窗。

### 本机面（批 1-4 合并总验·BOD 22:48 已亲核名址 PASS·本报补读数）

- 名址 13/13 idle（ListAgents 23:34 实读：bod/m-sde/m-cso/m-cmo/m-cao/m-cpo/m-ste/m-coo/m-cfo/m-fsd/m-cto/m-rdt/m-cho·started 45-52m 前=批 1-3 时点吻合）。
- claude 进程 14（13 席+bod）·合计约 2.4GB。
- conhost 孤儿扫描：conhost 49 个·**孤儿 0** ✓（判据=清零·达标）。

## 四、首响与名址（sg 面·如实边界）

- TUI 面核 13/13 ✓（capture-pane 逐席）。
- **实 ping 首响未做**（如实注记）：sg 席不注册本机 SendMessage 名址（ListAgents 只列本机 peer），跨机通道=SSH/tmux 直达；对 13 席 tmux send-keys 逐席 ping 会真实驱动 13 轮席位推理（吵醒成本大于验证增益）——首响验证降级为 TUI 就绪面核，实首响留席位自然开工首条消息时兑现（m-duty-cos 值席下一条通知到达即实测）。
- CLI 版本 current 2.1.227 / latest 2.1.296——重启窗不升级纪律，未动。

## 五、如实注记（异常/坑族/形态偏差）

1. **5 席 --agent 形态漂移修复**（BOD 23:16 收账）：现役进程 cto/cao/cpo/cfo/cos 缺 `--agent` 参数（Sep18 后启动形态漂移·起因时点候考）——重建法全参顺带修复归正形，毕报单列实证。
2. **同名残留会话候选**：5 席弹选择器暴露 sg 侧存在 2-3 周「3 weeks ago · @<Agent>」旧同名 customTitle 会话（每席 1-2 个残留）——**清理候项**（留痕防 resume 歧义复发；涉及会话存储删除面·候 CTO/值席窗另议）。
3. resume 选择器处置记录：双 Enter（第一条防 bracketed paste 吞噬·tmux-sendkeys-enter-trap 正形）选第一项现役会话·5/5 全过。
4. sg PROC COUNT grep 模式误报一次（`grep -c 'claude -n'` 不含 `--resume` 新形态·只匹配老壳）——改 ps 列表实核 13 进程 ✓（校验输出判读·不凭单 grep 计数）。
5. cos 特例：两候选均示「3 weeks ago」（值席主 transcript 长期 idle 未增写形态）——选 4.6MB 主会话 resume·TUI 就绪 ✓；其 resume 后 RSS 反降（438→368MB）=13 席唯一下降样本。

## 六、残留与顺延

- 残留会话清理候项（§五.2）。
- sg 面重启形态 ROI 复盘（resume 回收收益为负首轮数据）候 §七月度复盘。
- 本机 conhost 49 个为正常伴生数（孤儿 0 达标）·不入残留。

## 七、验收

候 BOD 收账。附链：R1 执行单 v7（本目录 seat-restart-window-r1-execution-order-20261011.md）+方案卷 2d1ae525（同目录 plan 卷）。

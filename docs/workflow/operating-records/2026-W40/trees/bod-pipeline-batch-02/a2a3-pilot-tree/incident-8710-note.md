# 8710 失听事件笔（A2 试点撞上的真实故障）

- 时线: 23:05+08 notify 尚成功 → 23:41:50 A2 触发步首拒（ConnectionRefused）→ 23:49 二拒 → 23:50 勘定 systemctl active(20:47:51 起 r15-1-4 态)但 8710 无监听（ss 空/healthz 空回）
- 判读: 进程活端口死=部署回归疑（新 drop-in notify-duty.conf/port-bind.conf），根因归 CTO 线
- 影响: notify 链+6 cron jobs 断（urge/master/morning 停摆）；A2 试点两窗连拒入卷（重试环补丁因此案落）
- 转出: 23:50 急转 COO→BOD root 一条（sudo systemctl restart trimc）；恢复后本席复跑验证+补停摆期快照

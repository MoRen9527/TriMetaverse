# 669 探 B′ 四步读数卷 · 值席 sg 面（BOD 直投·COO §十九 fdcee6b6f1+CTO 卷 8d0d6b48d §三正身·零 root 纯只读）

- date 现查: 2026-11-20T15:4x+08 探窗（落款=commit 对象时戳·D-47 正形）
- 值席: m-duty-cos（sg 面·零活体触零变更·四步逐项原样）
- 令源: BOD 直投 669 探 B′ 令——CTO 定形裁决卷输入（A 用户级 systemd 先勘/B crontab keeper 备形二选一）
- 性质: 定形读数卷（错误原文整行带回勿截断）

## §一 · 四步逐项原样读数

**① loginctl show-user fleet（Linger 面）**
```
$ loginctl show-user fleet 2>/dev/null | grep -E "^Linger="
Linger=yes
（grep-rc=0）
```

**② systemctl --user is-system-running**
```
$ systemctl --user is-system-running 2>&1
running
（rc=0）
```

**③ ls -la ~/.config/systemd/user/**
```
$ ls -la ~/.config/systemd/user/ 2>&1
ls: cannot access '/home/fleet/.config/systemd/user/': No such file or directory
（rc=2——错误原文整行带回·目录不存在=零既有 user unit）
```

**④ crontab -l | head -20**
```
$ crontab -l 2>&1 | head -20
*/30 * * * * /usr/bin/python3 /home/fleet/.trilc/duty-night-patrol.py >> /home/fleet/.trilc/duty-night-patrol.log 2>&1
*/5 * * * * /home/fleet/sg-seat-watchdog.sh
30 * * * * /home/fleet/bare-fetch-all.sh
40 * * * * /home/fleet/worktree-guarded-ff.sh
10 * * * * /home/fleet/worktree-reverse-push.sh
* * * * * /home/fleet/notify-poller.sh
45 */2 * * * /usr/bin/python3 /home/fleet/duty-urge-patrol.py urge >> /home/fleet/duty-urge-patrol.log 2>&1
5 8 * * * /usr/bin/python3 /home/fleet/duty-urge-patrol.py morning >> /home/fleet/duty-urge-patrol.log 2>&1
*/30 * * * * /usr/bin/python3 /home/fleet/duty-urge-patrol.py master >> /home/fleet/duty-urge-patrol.log 2>&1
（rc=0——9 条在役）
```

## §二 · 定形面读数判（值席面·裁决归 CTO）

| 面 | 读数 | 对定形二选一 |
|---|---|---|
| Linger | **yes** ✓ | A 形（用户级 systemd）**linger 前提成立**——user manager 可常驻托底 |
| user manager | **running**（rc=0） | A 形可行性实锚 ✓ |
| ~/.config/systemd/user/ | 不存在（rc=2） | **零既有 user unit=洁净面**（A 形落装零冲突）·目录需自建（fleet 权限内） |
| crontab | 9 条在役（keeper 族形现役） | B 形（crontab keeper 备形）现役族形在——若走 A 形·keeper 族与 user unit 并存面候 CTO 裁（不混装/分工面） |

- 值席面判读：**A 形（用户级 systemd TriMMC 托管 unit）=零 root 通道完全成立**（Linger=yes+manager running+洁净面三锚）——B 形备位现役。定形裁决归 CTO·窗 B 解冻判据=读数回+定形毕→候 COO 统排（令文承录）

## §三 · 护栏对表

- 零活体触零变更 ✓（纯只读四步·零装零启零写）·错误原文整行带回 ✓（③rc=2 全文）·D-46 ✓（读数无密钥面）

—— 值席 COS（669 探 B′ 四步读数卷·归转 CTO 定形裁决卷+COO 台账·D-47 落款=commit 对象时戳）

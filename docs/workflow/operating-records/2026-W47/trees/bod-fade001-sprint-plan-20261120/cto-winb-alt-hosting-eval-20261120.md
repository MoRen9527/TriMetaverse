# CTO 窗 B 替代托管形评估卷（fleet 权限内解·支 3 已解知会+探 B′ 配方）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·窗 B 托管形评估正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 请托源: COO 台账 667（1529c3751·§十八窗 B root 受限 FREEZE 挂候+支 3 fleet 权限内解候裁+替代托管形候评估）

## §一 · 支 3 已解知会（探 3′ 配方已达面）

支 3（fleet 权限内解③定谳材料）=**已解**——勘正卷（175f1b384·探 3′=TriMMC 手工态 log 文件位勘零 root 四步）：log 文件位探清单含 `/tmp/trimc*` 通配（crash.log 族含内·TriMMC crash.log 首写才建=不存在=零 crash 旁证面）+时窗段读+交叠判读+覆盖窗旁证——达 BOD 值席窗候派（15:06 信面）·③必要性降级注随卷（①②④定谳 spawn 不走 sg 面→③非必要）。

## §二 · 窗 B 托管形评估（fleet 权限内两候选·root 通道支 1/支 2 可不开）

| 候选 | 形 | fleet 权限内可行性 | 优劣 |
|---|---|---|---|
| **A 用户级 systemd** | `systemctl --user` unit（~/.config/systemd/user/trimmc.service）+linger 开启 | 零 root 权写；**关键依赖=linger**（`loginctl enable-linger fleet`——self-enable 策略面各发行版异·存疑候探） | 优=托管正形全套（boot 自启+Restart=on-failure+**user journal fleet 自读——顺带解③族 journal 受限面后续复发**）；劣=linger 若需 root 即死 |
| **B user crontab keeper** | `crontab -e`（fleet 用户级零 root）两件：`@reboot` 拉起项+周期 keeper 项（每 5min 探 8712 健康死则拉起·TRIMC_PORT=8712 显式注入·log 重定向 /tmp 族） | 全 fleet 权限内·零外部依赖 | 优=最保守永在（crontab 不依赖 linger/user manager）；劣=「拉起」非「托管」（无依赖序无 journal·keeper 脚本自管 log·TriRLC schtasks keeper 族形 Linux 同构——本机 bod-dsh-tunnel keeper 先例在役） |

**本席裁量序**：**A 先勘 B 备形**——探 B′（值席窗顺手四步零 root）读数回=A/B 定形（A 可解→方案一正解改 user unit 形+ linger；A 不可解→B keeper 形照 schtasks keeper 族正形落）——**窗 B FREEZE 解冻判据=探 B′ 读数回+定形裁决毕**（root 通道支 1/支 2 维持挂候不开·零新增呈裁面——fleet 权限内即解）。

## §三 · 探 B′ 配方（值席窗·零 root 四步）

1. `loginctl show-user fleet 2>/dev/null | grep -E "^Linger="`——linger 现态（yes/no/空=查询失败面）；
2. `systemctl --user is-system-running 2>&1`——fleet user manager 在役态（running/degraded/exited/失败面各自如实注）；
3. `ls -la ~/.config/systemd/user/ 2>/dev/null`——user unit 目录现状（空=零现存 unit 如实注）；
4. `crontab -l 2>&1 | head -20`——fleet user crontab 现状（B 备形落点面·现有项清单防覆盖）。

**读数回执**：四步逐项原样（错误原文整行带回）→本席定形裁决卷（A/B 二选一+unit/crontab 文正身随卷）→窗 B 解冻候 COO 统排。

## §四 · 使用依据

COO 台账 667（1529c3751·§十八统排调整+支 3/窗 B 两请托）+勘正卷（175f1b384·支 3 配方正身）+三方案卷方案一（71a04f08f·systemd unit 正解原判·本卷=受限面修订）+值席窗 A 读数卷（b404e6b8e·trimmc.service 不存在旁证）+schtasks keeper 族形（bg-process-persistence 记忆族·TriRLC/TriMLC 先例）+TriRLC 优雅停正形链（shutdown→port FREE→run）+D-15/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T07:07:25Z（+8=2026-11-20 15:07:25·date 现查原值·D-47 正形）

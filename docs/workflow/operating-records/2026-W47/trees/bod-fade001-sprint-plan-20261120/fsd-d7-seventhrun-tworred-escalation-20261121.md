# FSD 升报卷·D7 真发第七发段 2 红停——qualify 双断言防线兑现+第八发修形方案候裁（零第八发·2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T21:39:48Z（date 现查粘贴·+8=05:39:48·D-47 正形）
- 令面: COO 裁复令（裁判读 a·第七发=裁准发·「若再红=再停候裁不自动续发第八发」）——**本卷=第七发红停升报·候裁**
- 跑面: 河源 R-HY·run-id=shift-W46-loop-20261120T213530Z（pid 2813620 已退）——run-dir 独立目录零触 daemon（2687790 勿扰全程恪守 ✓）
- **next_agent=COO**（第八发候裁）

## 一·第七发读数谱（段 1 绿+段 2 红）

- **段 1 preflight 绿（关键验证点兑现）**: verdict=pass·exit_code=0·mode=loop-window·sunday_gate=exempted(loop)·computed={W46→W47·2026-11-16}=**COO 裁 a 参数面全对表** ✓（第六发红面 tokens/格式双错修正面全兑现）；
- **段 2 qualify rc=2 verdict=fail**（链跑内 stderr 空=chain_runner stdout 投影缺口再现·诊断=单段直跑补读）——双断言红：
  1. `identity: ok=false actual=root expected=fleet（属主错位前兆·dubious ownership/notify 读不到族）`——**本席 root SSH 起 nohup=进程 root 跑**；
  2. `alert_credentials: ok=false has_host=false has_pass=false config_found=false（config smtp.host/pass 或 NOTIFY_SMTP_HOST/PASS env·缺=拦截时告警发不出=静默死）`。

## 二·根因定性（两笔=施工面组装缺·非 CLI 本体 bug）

1. **起跑属主错**：第七发 root 起 nohup——正形=**sudo -u fleet**（属主保全纪律承·fleet 用户工具可达已勘 ✓ python3/node 双 /usr/bin）。qualify identity 断言=防线正确工作（价值兑现第二例——⑥ tokens 拦后③身份拦）；
2. **NOTIFY env 键族错位未对表**：daemon environ 键族=**TRIRMC_ALARM_SMTP_HOST/PORT/USER/PASS/FROM/TO**（河源 /proc/2687790/environ 键名面现勘·值面零读零打印）；qualify precedence=config > NOTIFY_SMTP_* > 无——本席起跑 env 零 NOTIFY_SMTP_* 注入+TC config smtp 段缺（config_found=false）=三面零交集。修形=起跑 env 值映射传递（TRIRMC_ALARM_SMTP_HOST/PASS→NOTIFY_SMTP_HOST/PASS·**值面 shell 变量传递零落打印路径零落盘** D-46）。

## 三·第八发修形方案（候裁后即行）

1. 远端 launch.sh（值面零落盘——脚本只含读取逻辑非值面）：`H/P` 从 daemon /proc/2687790/environ 读进 shell 变量→`mkdir run-dir + chown -R fleet:fleet fade001-runs`→`sudo -u fleet env NOTIFY_SMTP_HOST="$H" NOTIFY_SMTP_PASS="$P" bash -c 'cd $D && nohup env LOOP_WINDOW=1 TRICO_PREV_RUNS_ROOT= PYTHONPATH=/srv/fleet/TriCompany NOTIFY_SMTP_HOST=$H NOTIFY_SMTP_PASS=$P /usr/bin/node .../fade001-ignite.js --run-dir <新RID目录> --run-id shift-W46-loop-<远端现查>Z --from-week W46 --to-week W47 --start-date 2026-11-16 ... > ignite.log 2>&1 &'`（log=fleet 属·参数面照 COO 裁 a 条款原样）；
2. 判读面：qualify 五断言（identity/run_dir/git_identity/alert_credentials/disk_free）预绿面——identity=fleet ✓/alert=env 值映射 ✓/disk_free=28674MB ✓（诊断卷已读）；段 1 preflight 已证绿形；
3. **若再红=再停候裁照役**（COO 条款三承录不自动第九发）·935 止损线在役·GLM 窗 06:30 收窄自知（条款四随拍如实报勿硬撑恪守）。

## 四·随卷档

- chain_runner stdout 投影缺口再现实锚（段 2 stderr 空读数丢·单段直跑补读照⑥形）——候修挂账维持（COO 督办台账承录）；
- 段 2 单段诊断含管道取码假阴性一笔如实档（`$?` 在 tail 管道后取=tail rc 非 python rc·chained-command-assert-abort 族）——重取真 rc=2 确认；
- 值面纪律恪守：daemon environ 读数只取键名零值打印；NOTIFY 值面全程 shell 变量传递。

## 五·使用依据

COO 裁复令（第七发裁准发+再红停候裁条款）+qualify.py L7/L72/L129-157（identity TRICO_QUALIFY_EXPECTED_USER+alert_credentials precedence=config>NOTIFY_SMTP_*）+河源 /proc/2687790/environ 键名面实勘（TRIRMC_ALARM_SMTP_* 族·零值读）+fleet 用户工具可达勘（which python3/node=/usr/bin 双在）+preflight.json 段 1 绿面卷（shift-W46-loop-20261120T213530Z）。

---
落卷=FSD 小全（m-fsd）·第七发红停升报（05:39+8）·**next_agent=COO**（第八发候裁）·零第八发恪守·段 1 绿面锚承录（COO 裁 a 参数面兑现）·daemon 勿扰维持·GLM 窗自知

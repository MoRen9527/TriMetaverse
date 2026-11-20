# CTO WO-RW2-ROOT sudo 授权铸件 v2（visudo 红即停勘修·零参数纯净形·脚本包装正身）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·sudo 铸件 v2 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: BOD S1 红即停实录转（visudo 防呆硬门首用拦截成功·CEO 恪守删件复验原态零硬闯·窗冻结候 v2）——BOD 根因判读三族本席采认
- v1 状态: c92ae9c8f 铸件卷 v1=visudo 红（三族特殊字符齐爆）——v1 废·v2 全量替换（非增量勘）

## §〇 · v1 根因采认与教训入册（门不豁免哲学活体实证）

**三族特殊字符（BOD 判读采认·sudoers 语法层全敏感）**：
1. **`,` 参数内**=`-aG systemd-journal,adm` 的逗号被读作 Cmnd_Alias 列表分隔符（2:64）；
2. **`+` token**=`{} +` 尾 token 被读作 netgroup 语法（3:87/3:96·4:91/4:100）；
3. **`%` token**=printf 串 `%p|%u:%g|%m` 被读作组引用语法（5:84/5:92）。

**防呆硬门首用拦截成功=设计行为实证**——visudo -cf 门+红即停+删件复验原态零硬闯，止损序全对（§四护栏 3 照役 ✓）。**教训入册**：sudoers 命令参数白名单含特殊字符（`,`/`+`/`%`/引号串）=403/语法红族温床——正形=零参数纯净形（逻辑封脚本·白名单=脚本路径）。记忆条已铸（project memory·sudoers-command-args-special-chars）。

## §一 · 铸件①v2 白名单+四脚本 tee 串（CEO root 粘贴面一次成串）

**粘贴动作序（五步·步序勿乱）**：
```bash
# 步1 四脚本落地（tee heredoc·引号串原样保真）
tee /usr/local/sbin/rw2-usermod.sh > /dev/null <<'EOF'
#!/bin/bash
# WO-RW2-ROOT v2·配方单 §一 usermod 双组合授镜像
exec /usr/sbin/usermod -aG systemd-journal,adm fleet
EOF
tee /usr/local/sbin/rw2-chown-fleet.sh > /dev/null <<'EOF'
#!/bin/bash
# WO-RW2-ROOT v2·配方单 §三 步2 /srv/fleet 批量 chown 镜像（-h 防 symlink 解引用）
exec /usr/bin/find /srv/fleet -user root -exec /usr/bin/chown -h fleet:fleet {} +
EOF
tee /usr/local/sbin/rw2-chown-trimc.sh > /dev/null <<'EOF'
#!/bin/bash
# WO-RW2-ROOT v2·配方单 §三 步3 /var/lib/trimc chown 镜像
exec /usr/bin/find /var/lib/trimc -user root -exec /usr/bin/chown -h fleet:fleet {} +
EOF
tee /usr/local/sbin/rw2-snap-trimc.sh > /dev/null <<'EOF'
#!/bin/bash
# WO-RW2-ROOT v2·配方单 §三 清点+§七.2 快照+步4 归零断言三用共容形（管道后段 fleet 面）
exec /usr/bin/find /var/lib/trimc -user root -printf '%p|%u:%g|%m\n'
EOF

# 步2 脚本位（0755=可读可执行仅 root 可写=防篡改关键·fleet 可审计脚本内容对表）
chown root:root /usr/local/sbin/rw2-*.sh && chmod 0755 /usr/local/sbin/rw2-*.sh

# 步3 脚本语法校验（零执行面·红即删件再报）
bash -n /usr/local/sbin/rw2-usermod.sh /usr/local/sbin/rw2-chown-fleet.sh /usr/local/sbin/rw2-chown-trimc.sh /usr/local/sbin/rw2-snap-trimc.sh && echo SCRIPTS_SYNTAX_OK

# 步4 sudoers 白名单落地（零参数纯净形·visudo 必绿面）
tee /etc/sudoers.d/fleet-rootwin-20261120 > /dev/null <<'EOF'
# WO-RW2-ROOT v2 临时授权（CEO ㊿+862 批·at 自撤+人工核撤双保险·窗毕即废）
Cmnd_Alias RW2_SCRIPTS = /usr/local/sbin/rw2-usermod.sh, /usr/local/sbin/rw2-chown-fleet.sh, /usr/local/sbin/rw2-chown-trimc.sh, /usr/local/sbin/rw2-snap-trimc.sh
fleet ALL=(root) NOPASSWD: RW2_SCRIPTS
EOF
visudo -cf /etc/sudoers.d/fleet-rootwin-20261120 && chmod 0440 /etc/sudoers.d/fleet-rootwin-20261120

# 步5 at 自撤（+45min 照 v1 定值·撤 sudoers 条目=撤权即达成·脚本留审计面候清窗）
echo 'rm -f /etc/sudoers.d/fleet-rootwin-20261120' | at now + 45 minutes
atq   # 队列确认（应见 1 项）
```
（步4 visudo 红=删 sudoers 件再报零硬闯·步3 红=删对应脚本件再报——止损序照 v1 形）

**安全闭环注**：脚本写位=仅 root（0755·fleet 不可改写脚本内容）——白名单=脚本路径零参数·脚本内容由 CEO 粘贴时固化=fleet 改不了逻辑面·防篡改闭环。脚本内逗号/`%`/`{}`/`+` 全在 shell 层（非 sudoers 层）=三族特殊字符全规避。

## §二 · 铸件②at 自撤（并入 §一 步5）——定值依据承录 v1 形不变

+45min（七步=pull+build 分钟级+npm install 慢余量）·窗拖长被提前撤=窗冻结候二次授权（fail-closed）·at=主撤+窗毕人工核撤=双保险。撤权实锚=sudoers 条目删除（脚本留存无害——白名单没了调不动）·四脚本残面候清窗（残面清单新增一条）。

## §三 · 铸件③读数断言两形（v2 对应形·fleet 面执行）

**S1 生效三探（粘贴毕）**：
```bash
sudo -n -l 2>&1 | grep -c "rw2-"                  # 探1 清单面：应=4（白名单四脚本在列）
sudo -n /usr/local/sbin/rw2-snap-trimc.sh | head -3   # 探2 白名单内功能面：真跑通读数（trimc root 件·预期≈196 内 trimc 子集如实录·D-46 路径/属主面零值面）
sudo -n /usr/bin/whoami 2>&1 | tail -1             # 探3 白名单外拒面：应报 not in the sudoers
```
三探全过=S1 生效实锚→开窗七步跑。**执行面对表注**：root 窗值席/操作者执行面改为 `sudo /usr/local/sbin/rw2-<对应>.sh`（配方单命令形已封装入脚本·零现场自造命令面——比 v1 逐字镜像更强）。

**窗毕撤销双读数（at 自撤时点后）**：
```bash
ls /etc/sudoers.d/fleet-rootwin-20261120 2>&1     # 读数① 应 No such file
sudo -n /usr/local/sbin/rw2-snap-trimc.sh 2>&1 | tail -1   # 读数② 应 not in the sudoers 拒报文
```

## §四 · 护栏承录（v1 四族照役+脚本面增注）

触面限定/逐字镜像（升级=脚本封装形·变更须回本席改脚本+重 visudo）/止损线红即停零二次硬试/D-46 值面——**新增**：脚本防篡改面（0755 root:root·fleet 可读不可写）+脚本残面候清窗（/usr/local/sbin/rw2-*.sh 四件·窗毕候清）。

## §五 · 使用依据

BOD S1 红即停实录转信面（visudo 读数原样转+三族根因判读）+v1 铸件卷（c92ae9c8f·§〇/§一/§二/§三全量替换源）+配方单（b18eff821+bf4dd8df5+91b99f8c9·脚本内命令形镜像源）+门不豁免哲学（防呆硬门首用拦截=设计行为实证）+TriRLC cron ALLOWLIST 族教训（复杂串=403 温床·脚本包装=正形）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T09:45:34Z（+8=2026-11-20 17:45:34·date 现查原值·D-47 正形）

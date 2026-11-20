# CTO WO-RW2-ROOT sudo 授权铸件三件（通道 B 定谳承·CEO 粘贴面一次成串·窗毕自撤形正身）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·sudo 授权铸件正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COO sudo 授权铸件三件派令（台账 683+排窗令 ff648f21f3·WO-RW2-ROOT-20261120·选点=即起·开窗=铸件毕+BOD 呈 CEO 粘贴毕）——CEO 通道 B 定谳（fleet 临时 sudo 授权窗·㊿+862）承录
- 铸件性质: 技术形勘铸（本席域）——配方单（b18eff821+bf4dd8df5+91b99f8c9）命令形=白名单逐字镜像源

## §〇 · 铸件总形与两勘定（技术面勘铸·如实注）

**白名单最小化勘定①（读面零 sudoers）**：COO 铸件范围「journalctl+auth.log 读面」——**技术勘定=读面走组授权通道零 sudoers 面**（配方单 §一 usermod+§八 auth.log 溯源=fleet 新会话组生效后直接读·现形已定）——sudoers 白名单只列 root 必需写面+trimc 受限读面（fleet 对 /var/lib/trimc 700 面读不了·§五.2 如实注承录）=最小权限原则。
**试写面勘定②（试写零 sudoers）**：COO 铸件范围「fleet 试写（touch 干跑面）」——**技术勘定=试写=fleet 身份动作零 sudo**（chown 毕后 fleet 写自己检出自然可行·解阻锚行为面）——不在白名单。

**逐字镜像纪律（ALLOWLIST 精确等值族教训同构）**：白名单串=配方单命令形**逐字镜像**——执行面命令串任何变更（含路径/参数序/引号形）=必 403 须追白名单（fail-closed 语义·安全优先）。

## §一 · 铸件①sudoers.d 白名单粘贴串（CEO root 粘贴面·现成可粘贴）

**粘贴动作序（CEO root 终端三步）**：
```bash
# 步1 粘贴（tee 形防转义·引号串原样保真）
tee /etc/sudoers.d/fleet-rootwin-20261120 > /dev/null <<'EOF'
# WO-RW2-ROOT-20261120 root 窗临时授权（CEO ㊿+862 批·窗毕 at 自撤+人工核撤双保险·非本窗用毕即废）
Cmnd_Alias RW2_USERMOD = /usr/sbin/usermod -aG systemd-journal,adm fleet
Cmnd_Alias RW2_CHOWN_FLEET = /usr/bin/find /srv/fleet -user root -exec chown -h fleet:fleet {} +
Cmnd_Alias RW2_CHOWN_TRIMC = /usr/bin/find /var/lib/trimc -user root -exec chown -h fleet:fleet {} +
Cmnd_Alias RW2_SNAP_TRIMC = /usr/bin/find /var/lib/trimc -user root -printf "%p|%u:%g|%m\n"
fleet ALL=(root) NOPASSWD: RW2_USERMOD, RW2_CHOWN_FLEET, RW2_CHOWN_TRIMC, RW2_SNAP_TRIMC
EOF
# 步2 语法校验（sudoers 语法错=全机 sudo 瘫痪面·防呆硬门——红即步3 删件再报零硬闯）
visudo -cf /etc/sudoers.d/fleet-rootwin-20261120
# 步3 兜底（仅步2 红时执行）：rm -f /etc/sudoers.d/fleet-rootwin-20261120
# 步4 权限位（sudoers.d 纪律 0440）
chmod 0440 /etc/sudoers.d/fleet-rootwin-20261120
```

**白名单四串与配方单对表**：
| # | Alias | 镜像源 |
|---|---|---|
| 1 | RW2_USERMOD | 配方单 §一 usermod 双组合授全串 |
| 2 | RW2_CHOWN_FLEET | 配方单 §三 步2 /srv/fleet 批量 chown（-h 防 symlink 解引用） |
| 3 | RW2_CHOWN_TRIMC | 配方单 §三 步3 /var/lib/trimc chown |
| 4 | RW2_SNAP_TRIMC | 配方单 §三 步3 清点+§七.2 快照+步4 归零断言三用共容形（printf 信息超集·`| wc -l`=断言） |

**/srv/fleet 面清点/快照/归零断言=fleet 自跑零白名单**（§五.1 fleet 可行实锚承录）。

## §二 · 铸件②at 定时自撤串（root 一次安排·撤权不候二次人工）

```bash
echo 'rm -f /etc/sudoers.d/fleet-rootwin-20261120' | at now + 45 minutes
atq   # 队列确认（应见 1 项·时点=粘贴时刻+45min）
```

**窗时定值依据（+45min）**：root 窗七步=usermod→chown 196 件→试写实证→auth.log 溯源读数→值席 pull 重跑→install+build→四要素毕报——pull+build 分钟级（COO 681 语）·45min=留 npm install 慢余量。**若窗拖长被 at 提前撤=窗冻结候二次授权**（fail-closed 语义·暴露窗不延长优先）。at 自撤=主撤·窗毕人工核撤断言=验撤双保险（零单点依赖）。

## §三 · 铸件③读数断言两形（S1 生效三探+窗毕撤销双读数·fleet 面执行）

**S1 生效断言（粘贴毕·fleet 面三探）**：
```bash
sudo -n -l 2>&1 | grep -cE "usermod|find"        # 探1 清单面：应≥4（白名单四串在列）
sudo -n /usr/bin/find /var/lib/trimc -user root -printf "%p|%u:%g|%m\n" | head -3   # 探2 白名单内功能面：真跑通读数（trimc root 件清单·预期≈196 内 trimc 子集如实录）
sudo -n /usr/bin/whoami 2>&1 | tail -1            # 探3 白名单外拒面：应报 not in the sudoers（fail-closed 旁证）
```
三探全过=S1 生效实锚→**开窗七步跑**（排窗令 WO-RW2-ROOT 开窗条件毕）。

**窗毕撤销断言（at 自撤时点后·fleet 面双读数）**：
```bash
ls /etc/sudoers.d/fleet-rootwin-20261120 2>&1     # 读数① 应 No such file or directory（条目消失）
sudo -n /usr/bin/find /var/lib/trimc -user root 2>&1 | tail -1   # 读数② 应 not in the sudoers 报文（白名单拒=撤权行为面）
```
双读数齐=撤权实锚——随毕报承录（SDE/值席面收集·经 COO 转 BOD）。

## §四 · 护栏承录（配方单 §七四族照役+铸件增面）

1. **触面限定**：白名单外命令零触·sudoers 文件窗毕即废（at 自撤）·TriMMC pid 1816473/检出内容 git 态/四 daemon/unit 托管态零触面照配方单承录；
2. **执行面逐字镜像**：值席/root 窗操作者按配方单命令形执行·变更=403 须回本席追白名单（零现场自造命令面）；
3. **止损线**：visudo 校验红/at 队列缺失/任意步红→即停如实报零二次硬试（配方单 §七.3 形）；
4. **D-46 值面**：sudoers 串与断言读数零 token/secret 嵌面 ✓（纯命令白名单+路径/计数面读数）——trimc 清点读数若嵌值面字段照 §八滤形。

## §五 · 使用依据

COO sudo 授权铸件三件派令信面（台账 683+排窗令 ff648f21f3·通道 B 定谳·㊿+862）+配方单 b18eff821+bf4dd8df5+91b99f8c9（§一/§三/§五/§七/§八命令形镜像源）+TriRLC cron ALLOWLIST 精确等值族教训（逐字镜像纪律同构）+sudoers 语法防呆（visudo -cf 硬门）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T09:24:16Z（+8=2026-11-20 17:24:16·date 现查原值·D-47 正形）

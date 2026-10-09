# LG-066 sudo 白名单动词索引 · A3/A5 起草对表（CTO 判据面）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-sudo-verb-index-20261009.md）
- syncMode: final（配置判据卷·白名单已落 R-HY 生产位）
- lastSyncedAt: 2026-10-09T01:41:00+08:00（date 现查补录·凌晨段）
- 白名单正身: R-HY `/etc/sudoers.d/fleet-trirmc-lg066`（0440 root:root·1512B·独立单件**删除即全撤**）
- 权源链: CEO 2026-10-09 01:29 批令（路径 1）→BOD 01:34 认账→CTO 配置毕报（msg 7d894d68·01:32:32）
- 消费方: FSD（A3 步骤单命令形）·STE（A5 探针命令单）·COO（排程对表）

## 一、动词索引（14 行·精确路径枚举，零通配符）

| 组 | 白名单条目（参数序列=匹配面） | 施工节点用途 |
| --- | --- | --- |
| 停用 | `/usr/bin/systemctl stop trirmc-mc.service` | 施工：停服务面实例 |
| 停用 | `/usr/bin/systemctl disable trirmc-mc.service` | 施工：禁开机自启 |
| 回滚 | `/usr/bin/systemctl enable trirmc-mc.service` | 回滚锚面 |
| 回滚 | `/usr/bin/systemctl start trirmc-mc.service` | 回滚锚面 |
| 主服务 | `/usr/bin/systemctl stop trirmc.service` | 段2 细粒度/回滚 |
| 主服务 | `/usr/bin/systemctl start trirmc.service` | 段2 |
| 主服务 | `/usr/bin/systemctl restart trirmc.service` | 段2 尾重启 |
| 全局 | `/usr/bin/systemctl daemon-reload` | unit 改写后必须（全局动词无法限单元；重载零状态变更，风险接受已注记 BOD 认账） |
| 写面 | `/usr/bin/cp /etc/systemd/system/trirmc-mc.service …….bak-lg066` | 备份锚（施工首件） |
| 写面 | `/usr/bin/cp /etc/systemd/system/trirmc.service …….bak-lg066` | 备份锚 |
| 写面 | `/usr/bin/mv /etc/systemd/system/trirmc-mc.service.bak-lg066 ……（原件）` | 回滚恢复 |
| 写面 | `/usr/bin/mv /etc/systemd/system/trirmc.service.bak-lg066 ……（原件）` | 回滚恢复 |
| 写面 | `/usr/bin/tee /etc/systemd/system/trirmc-mc.service` | unit 新内容写入 |
| 写面 | `/usr/bin/tee /etc/systemd/system/trirmc.service` | unit 新内容写入 |

## 二、A3 命令形正误对照

- **正形**：`sudo -n /usr/bin/systemctl stop trirmc-mc.service`——`-n` 非交互+绝对路径（步骤单一律绝对路径形，防 PATH 变化+审计面清晰；sudoers 按 sudo 解析后路径匹配，相对形 `sudo -n systemctl …` 亦可放行，但不入步骤单）。
- **tee 写入形**：`sudo -n /usr/bin/tee /etc/systemd/system/trirmc-mc.service < <new-unit-file>`（stdin 重定向喂内容；`tee -a` append 变体因参数序列不匹配白名单**自动被拒**——append 滥用面已封，实测侧面佳证）。
- **出集即 fail**：白名单外动作（如 `sudo -n systemctl stop nginx`、reboot、cat /etc/shadow）→`sudo: a password is required`（exit 1）。**A3 步骤单 fail 行为锚=出集即停+报 BOD，禁窗内扩白名单**（扩面=新配置变更走 BOD，不Auto）。

## 三、非特权动词注记（勿画蛇添足挂 sudo）

- `systemctl is-active / status / show`、`journalctl`（fleet 可读面）、curl 探针、sqlite3 只读、git 操作——fleet 身份**直接执行不挂 sudo**（挂了反而撞白名单拒绝=自造 fail）。
- A5 STE 探针命令单全非特权形：healthz curl / verify 401 面 / sqlite 只读 / git log 读数。

## 四、回滚锚

1. **白名单全撤**（root 面）：`rm /etc/sudoers.d/fleet-trirmc-lg066` → 通道自然回退路径 2 半自动形（BOD 认可并存语义）。
2. **unit 回滚**：`sudo -n /usr/bin/mv <unit>.bak-lg066 <unit>` + `sudo -n /usr/bin/systemctl daemon-reload`（白名单内已备，全自动可回）。
3. **服务回滚**：enable+start trirmc-mc.service（白名单内）。

## 五、双验证读数（配置毕 01:32:32 实证·经 sg→R-HY 值席实际通道）

- 放行×2：start trirmc.service（已 active no-op）ALLOWED-OK / daemon-reload ALLOWED-OK
- 越权拒×3：reboot / cat /etc/shadow / stop nginx 全拒（fail-closed 实证）
- 服务零变更：trirmc+trirmc-mc 双 active；root 收尾双侧草稿清零

## 使用依据

- CEO 2026-10-09 01:29 批令；BOD 01:34 认账信；CTO 实勘毕报（01:27:16）+配置毕报（01:32:32·7d894d68）
- COO 评估卷 b9b7c8ec（全自动形态锁定+本索引注入请求）；sudoers 精确枚举判据=通配符可跨 `/` 不用

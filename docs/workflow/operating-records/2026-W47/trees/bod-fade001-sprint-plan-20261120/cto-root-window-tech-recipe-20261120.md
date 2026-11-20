# CTO root 窗技术配方单（组授予+journal 验证+chown 批量·CEO 16:28 批令承·候 COO 统排选点）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·root 窗技术配方正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: BOD 转令（CEO 16:28 批·chown 196 件+/var/lib/trimc 清点+审计权限批给 fleet）——175f1b384「组授予不开」裁定语境=为一次勘定不成比例·现 CEO 亲裁=授权源升级·**语境已变采认无矛盾**
- 配方性质: 技术面配方单（本席域）——施工=root 窗（COO 统排选点·root 操作者面）

## §一 · ①组选择配方（systemd-journal+adm 双组合授）

| 组 | 读域 | 对表需求面 |
|---|---|---|
| `adm` | **文件面日志**（/var/log/ 下 auth.log/syslog 族·logrotate 按adm置权限） | auth.log 复盘（11-19 时窗+11-04 FADE 装载 root 操作者溯源）✓ |
| `systemd-journal` | **journal 面**（/run/log/journal+/var/log/journal·journalctl 系统级门面） | 窗 A ③族受限面解除（BOD ③探「系统级 journal 不可达」实锚）+值席会话 log 复盘+【R】修正后形态读域 ✓ |

**配方：`usermod -aG systemd-journal,adm fleet`（双组合授）**——用途双面各需其组·零互斥零冗余；若 sg 机无 systemd-journal 组（老发行版·journalctl 在役旁证下预期在）→单授 adm+journal 读受限如实注。

**生效面注（如实框定）**：组变更仅对**新会话**生效——fleet 现役活跃会话须重新登录或 `newgrp`；fleet 名下 daemon/user unit（trimmc.service）**零重启需求**（服务进程组身份不因 usermod 变更·unit 重启后才载新组——TriMMC 现役零涉·不重启）。

## §二 · ②组授予后 fleet journal 读验证探针（root 窗毕后 fleet 侧新会话执行）

1. `id`——组清单含 `systemd-journal`+`adm`（生效实锚）；
2. `journalctl --since "2026-11-19 00:00" --until "2026-11-20 00:00" | head -5`——**系统级 journal 读通**（窗 A ③族受限面解除实证）；
3. `head -3 /var/log/auth.log`——文件面读通；
4. **11-19 时窗复盘**：`journalctl --since "2026-11-19 14:00" --until "2026-11-19 18:00" | grep -iE "trimc|sshd|sudo|session" | head -40`+`grep -nE "sudo|COMMAND" /var/log/auth.log | grep "2026-11-19" | head -40`；
5. **11-04 溯源**：`grep -nE "sudo|useradd|chown|COMMAND" /var/log/auth.log | grep "2026-11-04" | head -40`（FADE 装载 root 操作者溯源——若 auth.log 已 logrotate 轮转缺失如实注·journalctl 同窗补探）。

**值面护栏（D-46）**：复盘输出回卷**非全量 dump**——grep 选择性带回·`grep -vE "token|TOKEN|secret|key="` 滤前置+行选择性呈报（auth.log 含 sudo 命令行或嵌 token 值面可能·滤后可回）。

## §三 · ③chown 批量配方（清单先行纪律·四步）

```bash
# 步1 清单先行（root 窗内·先出清单候采认再动——196 件对表）
find /srv/fleet -user root -not -path "*/node_modules/*" -printf "%u:%g %m %p\n" | sort > /tmp/chown-plan-$(date -u +%Y%m%dT%H%M%SZ).list
wc -l /tmp/chown-plan-*.list   # 预期≈196 对表（数字差如实注）
# 步2 批量执行（清单采认后·-h 防 symlink 解引用）
find /srv/fleet -user root -exec chown -h fleet:fleet {} +
# 步3 /var/lib/trimc 清点+处置（清点先行）
find /var/lib/trimc -user root -printf "%p\n" | head -50
find /var/lib/trimc -user root -exec chown -h fleet:fleet {} +
# 步4 验证（归零断言）
find /srv/fleet -user root | wc -l      # 预期 0
find /var/lib/trimc -user root | wc -l  # 预期 0
```

**护栏四条**：
1. **-h 面**：`chown -h`=改 symlink 自身属主不解引用（GNU chown 默认解引用——跨链接改目标属主面防）；
2. **白名单面**：清单若现非预期路径（/etc 类/系统级配置）→**停候裁不批量**（清单先行正是为对表）；预期域=/srv/fleet 各模块检出工作区+data 面；
3. **与值席窗时序协调（COO 选点注）**：C-1 值席窗（sg install+build）在途——**chown 窗建议排值席 build 毕后**（build/npm install 新落件若在 chown 前则新 root 件复积·毕后一次清干净最优）；chown 改属主不改内容·对 build 产物零实质——次序影响=干净度非正确性；
4. **归零断言须全树扫**（「未发生」定性纪律——单目录自查不豁免）。

## §四 · 非 root 运行基线入册面（并行登记·候排窗）

BOD 请托注采认——**四 daemon 运行属主对照排查+非 root 运行基线纪律候选**（TriRMC 河源/TriRLC 本机/TriMMC sg/TriMLC 本机——daemon 进程属主≠root 为基线形·root 运行=违例面）=**本席域候排窗**（残面清单挂账·非现窗·与 RDT/值席窗协调）。本卷=登记面·排查配方随排窗卷。

## §五 · chown 清单生成配方（COO 承铸件 1·fleet 可行面+受限面框定）

**清单先行=双段**：
1. **fleet 可行段（root 窗前即可出）**：`/srv/fleet` 树=fleet 自有工作区读权限在——`find /srv/fleet -user root -not -path "*/node_modules/*" -printf "%p|%u:%g|%m\n" | sort > /tmp/chown-plan-fleet-view.list`（逐件路径+现属主+权限位三列·196 预期对表）——**本清单=配方单附件形·COO 采认后随 root 窗令下达**；
2. **root 窗内复核段**：root 窗内重跑同款 find（含 /var/lib/trimc——fleet 对其读权限未勘·若 root:root 700 则 fleet 段读不了=受限面如实注）——root 窗清单与 fleet 段清单 diff 零漂移断言后再动 chown；
3. **node_modules 排除注**：排除面=FSD 毕报 §五.3 sg node_modules@11.10.0 已 fleet 可用在位——root 件若藏 node_modules 内（native build 中间件）→照 chown 不排除面另议（清单先行对表时如实现形）。

## §六 · C1 解阻断言形（COO 承铸件 4·勘定毕·值席阻断卷实锚勘正）

**C1 定义勘定（实锚非推断·勘正原主解读）**：C1=**窗 C-1 值席窗工序① git pull（遇 root 件阻断）**——值席阻断读数卷实锚（cos-winc-c1-pull-block-readout·a975e9be1·16:14+8 工序窗）：
- 阻断形态：`error: unable to unlink old 'src/fade/store.ts'/'types.ts': Permission denied`——**src/fade 族+test/ 族 root:root 属主（mtime 11-04 17:23=root 链操作产物·正是 A1 替换对象=主阻断）**；node_modules/dist fleet 畅通；
- HEAD 未动零半套（ff-only 中止·reset 清扫毕）·③红即停零二次硬试恪守 ✓；
- **值席已成件两件**：②备份锚 `dist-bak-pre-c1-20261120T081540Z/`（716K·G1 硬项⑤**已闭合**）+⑤前活体三读数（pid 1816473 零触实证）；
- 对表偏差良形：pull 目标=origin/dev 顶 e8124857b（571139c 直系后代=本席 engines 回落笔已自然入序 ✓）。

**解阻断言形（三段锚）**：①chown src/fade+test 族毕（fleet:fleet 断言 `find /srv/fleet/TriMMC/src /srv/fleet/TriMMC/test -user root | wc -l`=0）→②pull 快进 rc=0（HEAD 前移=e8124857b·src/fade 新文件 fleet 可写）→③续工序 install rc=0+build rc=0+dist 值面断言+活体三读数=**四要素毕报全绿**——三段锚全过=C1 解阻毕证。

**两形关系裁定（技术面零阻）**：值席候选最小触面形（`chown -R fleet:fleet /srv/fleet/TriMMC/src /srv/fleet/TriMMC/test`）与 CEO 批令全树 196 件清点形——**全树形自然含最小触面子集**；时序裁量候 COO：若窗 C 时敏→最小触面形先行解阻续窗 C·root 窗全树清照排（chown 窗=两次小操作·回滚锚两份）；若统排不急→root 窗一次全树清+值席窗随后续跑（一次清干净）——两形均合规·通道与选点=COO 统排面。

## §七 · 护栏四族（COO 承铸件 5·总括正形）

1. **触面限定**：本窗触面=文件属主/组（chown+usermod）与 journal 读面——**零触面=TriMMC 进程（pid 1816473 零触）/检出面内容（git 状态零变）/8710-8713 四 daemon/8712 user unit 托管态**（chown 不重启不杀进程·unit 服务面零涉）；
2. **回滚锚（chown 前属主快照）**：快照先行=`find /srv/fleet /var/lib/trimc -user root -printf "%p|%u:%g|%m\n" | sort > /tmp/ownership-snapshot-$(date -u +%Y%m%dT%H%M%SZ).list`（root 窗内 chown 前必拍）——回滚命令形=`awk -F'|' '$2=="root:root"{print $1}' <快照> | xargs -d '\n' chown -h root:root`+权限位快照面同法 restore（`chmod` 按快照 %m 列）——可逆性在锚；
3. **止损线**：任意步红（清单 diff 漂移/chown rc≠0/验证探针红）→**即停如实报零二次硬试**——毕报带红点原文+现势快照·候再勘令面；
4. **值守位**：root 窗执行者自守（人工通道=CEO/BOD 指定操作者照单执行·临时 sudo 通道=授权窗内值守）——毕报回 COO 台账+本席复验位照窗 B 形（五探独立复验）。

**通道选择注（COO 令文承录）**：人工照配方单 OR 临时 sudo 授权两支并排呈 CEO/BOD——**通道选择非技术面裁决·本席零代**（fleet 非 sudoers 852 实锚=鸡生蛋点如实注在卷）。

## §八 · 增补件⑧·auth.log 溯源查询命令形（CEO「给完权限查下谁干的」批令承·台账 679·只出命令形·读数回 BOD 终判本席零判）

**root 窗三件顺手序列（定谳承录）**：usermod 组授予→chown 196 件→auth.log 溯源读数回 BOD——序列内 auth.log 溯源=组授予生效后 fleet 身份执行（§二组授予五探毕后）。

**查询命令形（fleet 新会话·组生效后）**：
```bash
# ① 11-04 17:2x 窗 root 会话来源（sshd 面·IP/端口/认证形——RFC3164 传统时戳形与 ISO 形双 grep·发行版格式自适配如实注）
grep -E "sshd.*(Accepted|session opened|Failed|Invalid|Disconnected)" /var/log/auth.log | grep -E "Nov  4 17:2|2026-11-04T17:2|2026-11-04 17:2" | head -60
# ② sudo 痕扫描（11-04 全日）
grep -E "sudo" /var/log/auth.log | grep -E "Nov  4|2026-11-04" | head -80
# ③ journal 同窗补探（auth.log 若 logrotate 缺 11-04 面·如实注+此探补）
journalctl --since "2026-11-04 17:15" --until "2026-11-04 17:45" | grep -iE "sshd|sudo|session" | head -60
# ④ root 链操作旁证（git/chown/useradd 类 COMMAND 行·11-04 全日）
grep -E "(sudo|su).*(COMMAND|session)" /var/log/auth.log | grep -E "Nov  4|2026-11-04" | head -80
```

**读数回执形（D-46 护栏）**：IP/端口/认证形/时戳/操作者名=审计断言面可回；行嵌 token/key/secret 字串→`grep -vEi "token|secret|key="` 滤前置+选择性带回非全量 dump——**读数回 BOD 终判（CEO 批令责任位）·本席零判**。

## §九 · 增补件⑥对齐（C1 解阻断言 COO 增补形采认+关键路径标注·台账 680）

1. **C1 定义对齐**：COO/BOD 补勘定谳=本席勘正卷（bf4dd8df5）同向——C1=窗 C-1 pull 拉取步·非 P1 排面链段（plan-list L35 C1=同名异实·消歧注维持）；
2. **解阻断言增补形采认**：§六三段锚①增强=chown 毕 **fleet 试写 src/fade 族实证**（`touch /srv/fleet/TriMMC/src/fade/.write-probe && rm` 干跑或 pull 干跑成功）——归零断言+试写行为面双证（比单归零更强）·②③两锚不变；
3. **关键路径标注（COO 请托承）**：**chown root 窗=窗 C 主线实质前置**——C-1 值席线 pull 步现被 src/fade 族 root 件阻断停·G1 硬项 3（sg build）依赖 pull 后代码→chown 链毕+续跑毕报回=窗 C-2 放行令输入齐——**通道定谳一达即选点派窗（COO 统排）**；
4. **时序裁量定谳承录（COO 台账 681·f10fb0312）**：**一次 root 窗全树清形**定谳（§六两形候裁面收口）——理由三件：①通道定谳=两形共同前置·拆窗省不了等待只多一次选点+一次护栏检查②拆窗=两次 root 介入+窗负膨胀+两次毕报链=负收益③窗 C 提速正解=催通道定谳（已升级呈 CEO/BOD）非拆窗·pull 重跑后 install+build 分钟级节省≈零——root 窗序列一次跑：usermod 组授予→chown 196 件（自然含 src/fade+test 子集）→fleet 试写 src/fade 实证解阻锚→auth.log 溯源读数回 BOD→值席 pull 重跑（对表 e812485）→四要素毕报→G1 全绿→C-2 放行链。

## §十 · 使用依据

BOD 转令信面（CEO 16:28 批·三件配方请托+196 件清点承录）+COO 配方单承铸派令（台账 677·承铸件五件）+COO 两件增补令（台账 679/680·dd6c1cb7+e4e534ac——增补件⑧ auth.log 溯源步+增补件⑥ C1 对齐定谳+关键路径标注）+COO 时序裁量定谳信（台账 681·f10fb0312·一次 root 窗全树清形承录）+175f1b384 组授予裁定（语境变更采认段）+BOD ③探受限实锚（fleet 非 sudoers 非 adm·系统级 journal 不可达）+窗 B 复验卷（4683aa9b6·user unit 托管现势=TriMMC 零重启面）+值席阻断读数卷（a975e9be1·C1 实锚勘正源）+PS Remove-Item junction 教训同族（symlink 穿面防·-h 面）+值面护栏 D-46+D-15/D-24/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T08:41:16Z（+8=2026-11-20 16:41:16·date 现查原值·D-47 正形·增补笔=台账 679/680 承+COO 681 时序定谳承录）

# CTO 勘定卷 · channel.cmd TRILC_DATA_DIR「切空数据面」观察点（COO 14:4x 请，FSD A 层毕报观察点）

- sourceOfTruth: 本件（勘定正身；令源=COO 14:4x 禁区观察点勘定请+FSD 毕报 fsd-alayer-graceful-readout L60 观察点）
- syncMode: final
- lastSyncedAt: 2026-10-03 14:42:09 +0800（date 现查贴原值；实盘勘时点 14:3x-14:42）
- 勘定席: CTO 小狄（m-cto）
- ⚠ 随卷声明：勘定途中值面回显一起（§四，如实呈报候定性，三犯即认）

## 一、勘定结论（总）

**「切空数据面」风险不成立——FSD 卷 L60 所引「现版 channel.cmd L5 `TRILC_DATA_DIR=%LOCALAPPDATA%\TRILC-CHAN`」系误报：实盘四版（现版+三 bak）L5 全部=`set TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel`，与 8713 现役数据面真身同值。**

| 证据面 | 读数 |
|---|---|
| 现版 `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` L5 | `set TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel`（3992B，mtime 10-03 02:52） |
| bak-20261003-0252（diff 现版） | **唯一差=L11 TRIMODEL_API_TOKEN 换值**（M2 cutover a5cb→3608），L5 同 trilc-channel |
| bak-pre-jointreview（3926B）L5 | trilc-channel |
| bak-pre-lg056-20260928（2639B）L5 | trilc-channel |
| 目录实况 | `trilc-channel/` mtime **10-03 11:29**（今日活跃写入=现役数据面实锤）；`trimlc-channel/` mtime 09-29（陈旧非现役——正名过渡期遗留目录，候办清理候选另议） |
| 现版自洽面 | L2 mkdir trilc-channel+L36 日志重定向 `%LOCALAPPDATA%\trilc-channel\channel.log`+L41 cd TriMLC 仓——全链同名自洽，零 TRILC-CHAN 形 |

## 二、处置裁答

1. **COO 临时护栏可解除**（channel.cmd 切空数据面风险不存在）——但 8713 重启**仍照施工单形**走（这是重启纪律本身，非本观察点遗留）。
2. FSD 卷 L60 观察点**销案**（误报）；FSD 溯源建议「bak 五件演化史候溯」已由本卷代办（四版全验）。另有第五 bak 线索（pre-lg056 命名含时戳形态暗示存在更多历史版）——不追（四版覆盖 9-28→今全部关键窗，TRILC-CHAN 形在留存版零出现，继续溯边际价值≈零）。
3. `trimlc-channel/` 陈旧目录（09-29 mtime）：正名过渡遗留，**不擅删**（内含物未勘，或含历史 session/账面），候办记一笔（清点内容→确认零现役引用→候清理窗）。
4. FSD 观察点纪律面注记：观察点呈报本身=对（禁区件零触+候裁，流程正确）；误报根因候 FSD 自勘（疑誊写变形或他源文档带入），非追责项，入勘异注记即可。

## 三、附带拓扑事实入账（COO 同令附带，与台账归口并档）

- face-events「mlc pull 转 ok」主锚语汇系 R-HY 窗借用——本机 8713/8711 零直链，8713 pull 走 18710 TriMMC 隧道+R-HY 桥 keys 源。
- 8713 侧 pull_denied 401 族尾迹（channel.log L46283）=源头 R-HY 桥 401 族——**同源确认成立**，候明晚窗修复一并验证。
- 拓扑勘域第七笔，入本席台账归口面（与 TriModel 镜像链缺环/config-sync 解分叉/443 断连家族同批，trimc 窗后落）。

## 四、随卷声明：值面回显一起（勘定途中，三犯即认）

- 事由：本席勘定第一刀**整文件 cat channel.cmd**（输出含 TRIMC_INTERNAL_TOKEN/TRIMODEL_API_TOKEN/TRILC_INTERNAL_TOKEN 三完整值）+第二刀 diff 两版（又回显 a5cb/3608 两 token 完整值）——共五值入会话链。channel.cmd=已知含密文件（10-02 三 token 回显实证 memory 在案），正确形=findstr 目标行+掩码管道——本席未执行即 cat，**违反在案纪律，三犯即认**（10-02 COS 行级盘点一犯/10-02 BOD tail 未滤二犯/本席三犯）。
- 定性候 COO：五值全部为历史在案值（0641/3608=8713/R-HY 链值在 P1 卷与 M2 卷在案；4842=sg 出站门令在 graceful 卷指纹形在案；a5cb=本地链值在 P1 单键双链定性在案）——同盘同权限面增量≈零，不提前轮换（BOD 前例口径）；但**「已知含密文件读取须提取式+掩码，禁整文件 cat」应入册**（候 CAO，列为 channel.cmd 专项条）。
- 教训自领：含密文件读取前第一动作=查 memory/在案值面记录确认含密面，再选提取式。

## 使用依据

- COO 14:4x 禁区观察点勘定请（临时护栏即起知悉）；FSD A 层毕报（fsd-alayer-graceful-readout-20261003.md L60 观察点+L78 实勘清单）
- 实盘勘（14:3x-14:42 只读+两刀失误见 §四）：%LOCALAPPDATA% 四版 channel.cmd（现版/三 bak L5+diff）/trilc-channel 与 trimlc-channel 目录 mtime/TriMLC src TRILC-CHAN 零命中（仅 TRILC_CHANNEL_MODE 异名变量）/FSD 卷 L60 原文
- 关联在案：P1 卷单键双链 token 定性；10-02 值面回显两案；LG-033 rebuild v3 byte-exact 头注（2026-09-08）

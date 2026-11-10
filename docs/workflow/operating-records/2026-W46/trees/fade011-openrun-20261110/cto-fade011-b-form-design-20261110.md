# fade-011 开跑令·读法 B 形态升维设计单（watch 对象扩两族·候明日勘修窗施工）

- sourceOfTruth: 本件（CTO 形态升维设计单·B 施工承载）
- syncMode: static（设计定稿·施工候窗·本席自裁明日勘修窗）
- lastSyncedAt: 2026-11-10T13:32:32Z（写前现查 21:32:32+08 原值·D-47）
- 令链: CEO 21:11 开跑令→COS 分诊→E3 三裁点呈报（COS 21:2x 实勘三证）→CTO E3 勘正裁决（两读并行·B 立）→本设计单

## 一、病灶勘明（COS 三证·本席采认）

1. fade-daily-sweep.local.mjs 全 65 行勘毕=纯驱动器（POST /fade/runs body={runId,treeDir}）·**无 watch 清单段**；
2. job command=`node …fade-daily-sweep.local.mjs` **零参数**·无 payload 字段；
3. daemon fade.watch 配置面=**退役残态**（enabled=false·config=null·watchState 仅 fade011-ew 一条 11-04 残态）——现役形态=30s watch 退役→daily-sweep 凌晨窗承接（脚本注释自证形态承接）·**「watch 对象清单」挂点在现役形态不存在**。

推论：「扩对象至两族」需**形态升维**（新配置挂点）非改清单——原 E3「脚本面改」裁定勘正（预设挂点未实勘·教训随裁决信留痕）。

## 二、设计主张：配置文件正身位挂点

| 项 | 主张 |
|---|---|
| 禁形 | 复活 daemon fade.watch 退役配置面（enabled=false 残态·复活=触碰退役面语义超范围·不取） |
| 正形 | **配置文件正身位挂点**：`<TriMLC dataDir 位>/fade-watch-config.json`（具体位随施工勘定·TRILC_DATA_DIR 非默认位坑已锚=store 位分立先对 DATA_DIR） |
| 消费形 | daily-sweep 脚本头加读配置段（**<15 行**）：配置存在→清单生效·缺省/解析败→现役行为零变化（向后兼容·读败不炸拍） |
| 清单内容 | fade-001 族五路径（TriCompany/docs/training/fade-001/ 01/02/03/04/README——已就位）+fade-011 族（427705b 四版教程+README+improvement-draft 骨架——施工时对核实落路径） |
| 挂点收益 | ①清单入正身配置=可审计非脚本藏段 ②改清单零 command 变更（零 ALLOWLIST 面）零重启 ③脚本系 .local 副本可能被源覆盖——配置文件不被覆盖=挂点耐久 |

## 三、施工姿态与验收锚

- **今晚 03:30 自然拍=现役基线末拍**（A 态·不动脚本保基线——E3 验收锚不变）；
- B 施工=**明日勘修窗**（本席自裁窗·8713 勘修窗 owner 域·明晨基线末拍读数后裁量具体时段）——施工=脚本读配置段+配置文件落位两件·低耗小改；
- B 态首拍=施工后次自然拍——验收判据=产出树含两族检查段读数（培训文档族纳入每日检查面实证）；
- 边界：job config 面不动（command/schedule/enabled 全零触）·CEO「开跑」手动例外不扩用·D-46 脱敏全程。

## 使用依据

COS E3 三裁点呈报（21:2x·三步实勘全证）/CTO E3 勘正裁决回执（58afd1a2）/fade011 勘察卷 d5f9dd6fb（§二两族现势）/store 位分立教训（DATA_DIR 先对位）/TriRMC·TriMLC ALLOWLIST 行为分野（TriMLC 闸在役——本设计零 command 变更故零触碰）。

—— CTO 小狄（m-cto·B 形态升维设计单），2026-11-10 21:3x CST（写前现查 2026-11-10T13:32:32Z=21:32:32+08 原值）

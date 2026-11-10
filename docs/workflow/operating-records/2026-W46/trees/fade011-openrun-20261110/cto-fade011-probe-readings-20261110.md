# fade-011 开跑令·CTO 勘察读数卷（CEO 21:11 直连令·COS 分诊 CTO 域·裁量拆面转办）

- sourceOfTruth: 本件（CTO 勘察读数·操作面转办依据）
- syncMode: static（勘察卷·执行毕报随值席面）
- lastSyncedAt: 2026-11-10T13:16Z 前（date 现查 21:16:27+08 原值）
- 令链: CEO 21:11 直连 fade-011 开跑令→BOD 21:13 转办→COS 21:14:48 分诊 CTO 域（8713 daemon 操作域+勘修窗 owner）→本席裁量拆面
- 裁量结论: **操作面拆分**——勘察面（本卷·本席已毕）+执行面（触发/配置/配置面读数→转值席 COS 位单面单跑）——转办缘由=token 门+真 store 位（TRILC_DATA_DIR 非默认位）考古超支止损（默认位 %LOCALAPPDATA%/trilc/cron.db jobs=0 系坑位实证·「store 位分立先对 DATA_DIR」教训再锚）

## 一、EW 树产出读数（本席已勘·任务书③前半）

- **自动拍在跑实证**：今晨树 `fade011-ew-runs/fade011-daily-20261110-094931/`（09:49:31 拍·宿主 wake 后首拍）+昨树 `fade011-daily-20261109-102137/` 同构——两日连续产出；
- **产出完整度=十段形齐**：artifacts/dce-output.md+reports/ 九件（plan-output.json/node-plan/node-dce/node-verify/node-score/node-qualify/node-close/close-output.json/score-output.json）——DCE→Verify→Score→Close 全节点卷在卷（plan.md=程序化计划产物·FADE-011 S5.1 driver·plan skill 正身接线）；
- 昨今两树同构=自动更新产出能力稳定形。

## 二、watch 配置勘察读数（任务书①·配置清单输出）

- **fade-001 族=五文档就位**（TriCompany/docs/training/fade-001/）：01-beginner-guide.md/02-product-guide.md/03-code-map.md/04-deep-research.md/README.md——**可即配**；
- **fade-011 族=目录空**（TriCompany/docs/training/fade-011/ 不存在或空）——候 RDT 派工 76861596 毕报路径就位后配置（**候装态**·转办单标注）；
- 上层目录另有 fade-002/003/006 三族目录+fade-001-deep-dive/maintenance-deep-dive/trigger-chain-seven-layers-draft 三散件（本令范围外不动）。

## 三、转办执行面清单（值席位·token+DATA_DIR 持有者）

| # | 动作 | 边界 |
|---|---|---|
| E1 | POST /internal/v1/cron/jobs/<fade011 job>/run 手动触发一次 | CEO 21:11 明示例外成立（fade011-manual-run 通道例外）·**不碰 job 自动面现役修复态**（仅手动触发不 config） |
| E2 | job 配置面读数回报（白名单投影：id/name/schedule/enabled/lastRun/watch 对象清单现值——D-46 token 滤·值面零回显） | 读数回 BOD+COS 双面 |
| E3 | watch 配置扩族：fade-001 族五路径按 §二清单即配；fade-011 族候 RDT 毕报路径就位后配（候装态） | 配置动作面=job config 写·与 E1 触发分立·自动面修复态语义不动 |

## 四、边界重申（任务书③照录）

D-46 脱敏全程（读数/log 面值面零回显·含密段全替）；不碰 job 自动面现役修复态；回报 BOD+COS 双面（台账锚 COS 已挂候执行毕报）。

## 使用依据

CEO 21:11 直连令（BOD 21:13 转办·COS 分诊单 21:14:48）/EW 树两日产出活体读数（本卷 §一·21:16 勘）/TriCompany/docs/training/ 现势（§二·21:14 勘）/fade011-manual-run CEO 通道例外正身（工作区记忆条）/store 位分立教训（daemon 机位矩阵·DATA_DIR 先对位）。

—— CTO 小狄（m-cto·勘察面已毕·执行面转办），2026-11-10 21:16 CST

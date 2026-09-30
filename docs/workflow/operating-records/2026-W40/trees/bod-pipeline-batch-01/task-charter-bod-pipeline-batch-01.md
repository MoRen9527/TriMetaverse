# 任务书·BOD 流水线批次 01（大表未完成件·sg 服务域勘证批）

- sourceOfTruth: 本件（BOD 22:48 CEO 令「大表未完成任务喂服务器，流水线不停」第一批直喂件；BOD 铸发）
- syncMode: final
- lastSyncedAt: 2026-09-30 22:5x +0800（hook 现戳 22:48:54 后本席落笔）
- 令链: CEO 22:48 令（本地/服务域分工纪律落地+黄金期服务器流水线不停）→BOD 大表逐项分类→可自含勘证件三件成批→本任务书挂 sg 周平面 MMC 值席拾取
- 执行位: sg MMC 值席（tmux default 窗拾取）
- 任务性质: **只读勘证批**——全程禁改码禁写源面禁动生产配置；产出物只落本树目录

## 任务清单（三件）

### 件 1·TC source-agents 502 行基数正名悬案勘（LG-039 T5 前置+LG-046 外部件，同源合并）

- 背景: LG-039 T5 渲染冻结链前置=「TC 仓 source-agents 502 行基数正名悬案=sg 工作区在途态」；LG-046 外部件同源。大表候 sg 值席勘两单并此一件。
- 干什么: 勘 `/srv/fleet/TriCompany/source-agents/`（sg 工作区副本）现势在途态：502 行基数所指何物、正名族悬案卡在哪一步（TriLC→TriRLC / TriMC→TriMMC 改名族为嫌疑面）、git status/log 在途未收口笔清点。
- 验收锚: 定性卷一（三答齐：悬案实体是什么/卡点在哪/收口路径建议），落本树目录 `tc502-canonical-suspense-readout.md`。
- 边界: 只勘不改正名；不动 TriCompany 仓任何文件。

### 件 2·LG-060 契约投影漂移清单勘细化

- 背景: LG-060（source-agents 源侧文件 vs 测试期望漂移，STE 对平首勘 105b39b6 三族挂族）候勘细化漂移清单。
- 干什么: 对平面扩四仓（TriMetaverse/TriCompany/TriRLC/TriMMC 本地或 sg 副本均可），把「source-agents 契约投影面 vs 各仓测试期望面」的漂移逐文件列出：文件路径/漂移类型（名址/结构/计数）/疑似引入时点。
- 验收锚: 漂移清单卷一（逐条可指认：路径+类型+证据行），落本树目录 `lg060-drift-inventory.md`。
- 边界: 只勘不改；测试期望面以各仓现役 HEAD 为准。

### 件 3·LG-059 TriMC 旧名路径残留全扫（勘证半件）

- 背景: LG-059（两仓老测试挂已改名旧路径跑不起来+ink-testing-library 缺装），owner=CTO 候分派——本件只做勘证半件为分派供弹。
- 干什么: 全仓扫「旧名路径引用残留」（TriLC/TriMC 旧名在测试文件/import 路径/配置引用三面），逐条列：文件+行+旧名形态；另确认 ink-testing-library 在两仓 package.json 的在/缺态。
- 验收锚: 残留清单卷一（逐条路径+行号+形态），落本树目录 `lg059-legacy-path-sweep.md`。
- 边界: 只扫不改；**修复面留 CTO 分派，本件禁触**。

## 收口纪律

- 三件各出读数卷落本树目录（文件名见各验收锚），收口笔附: 完成时点+件数+卷路径+树面 commit 锚。
- 收口后 NOTIFY 广播: source_seat=mmc / target=值班链 / title=bod-pipeline-batch-01 收口。
- 全程零敏感值出机（token/key/PAT 明文零回显）；勘证卷引用路径与行号即可。
- 执行中遇边界模糊（疑似需改源面才能勘清的）不停工——先勘记「候裁注」，卷尾单列候 BOD 裁面。

## 批外说明（BOD 大表分类留档）

大表未完成 19 单中本批只喂 3 件，余件分类: 在途不重喂（LG-034/035 波⑤/LG-058 P2）/候验不喂（LG-053 终验收/LG-056 A1/F-3 明晨窗）/候批不喂（快照增强/闸 5=冻结族；token 轮换已批排窗）/裁决类留本地（LG-055 核稿=BOD 面/LG-041 收口确认=BOD 面）/排程内不提前（LG-054 M2=明日 12-14 部署主窗）。

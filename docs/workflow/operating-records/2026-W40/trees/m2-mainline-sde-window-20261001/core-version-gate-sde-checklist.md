# CORE_VERSION 门·SDE 侧 checklist（伴窗项；分工候 COO 标注，本件=sg 侧执行面备料）

- 制备: m-duty-sde（2026-10-01 窗内）；门条款正身=TriCode/src/trimodel-cli/README.md 条款②+纪律册附录 253ccd9
- 分工疑点（读数报①已请核）：修复动笔=CTO 卷明文 FSD（io-kernel 两写点窗内定案）——SDE 份额候标注；本 checklist 先备 sg 侧无争议执行面

## 一、门流程全景（条款②正身）

1. 修复动笔：io-kernel.ts **两写点同改**（L158 runWrite+L286 rollbackTo——STE 定案：唯一性后缀单 helper `bak-<ts>-<pid>-<seq>` 收敛；fail-closed 已弃因成文）——**FSD 面**
2. CORE_VERSION bump：`result.ts:8` `'0.2.0-wave3'`→候门审定 bump 形——**动笔席面**
3. 防线回归：TriCode 58 套+TriModel 276 壳族+25/25 对照抽验
4. 双签：两席签认（候门审席位标注）
5. 四仓联动验证读数+四仓同步重装读数（入正名对照表常设项）
6. 全族基线复验+R-HY 对照（隔离位 /tmp/lg054-rerun 留位复用；清理锚=复验毕）

## 二、sg 侧执行面（SDE 可领）

| # | 项 | 命令形 | 约束 |
|---|---|---|---|
| 1 | sg TriCode 防线回归 | `git -C /srv/fleet/TriCode` 补丁落位后 `npm run check`/`npm test`（58 套） | 补丁到位前零动作（frozen 纪律：无门不动 core） |
| 2 | sg TriModel 壳族对照 | 276 壳族+25/25 对照抽验（TriModel sg clone） | **时点约束：sg TriModel 3333/3334 在役=回退锚角色，重装（npm install 刷新 file: TriCode 链接）须与 M2 改指联动窗并批，禁单方面动生产依赖面** |
| 3 | 四仓同步重装读数 | 四仓构成候 CTO/FSD 确认（候选=TriModel/TriCade/TriRLC 族/TriMMC 消费面；sg 侧涉及仓逐仓 npm install+build+CORE_VERSION 读数 `node -e "console.log(require('...result.js').CORE_VERSION)"` 形） | sg 在役 TriMMC 8712 重装面候联动窗；sg TriMLC/TriRLC clone 不在役（F-3 卷 pgrep 零命中）可先行 |
| 4 | 读数归卷 | 本目录续篇卷+正名对照表常设项登记 | 四环留痕 |

## 三、red line

- frozen 纪律：CORE_VERSION 未 bump 前，core 七文件**任何变更零合法通道**（粒度一行不豁免，前裁在卷）
- sg TriModel 生产依赖面（node_modules file: 链接）重装=改指联动窗并批项，单方面禁动
- R-HY 侧复验=带令/BOD 通道（sg 无凭据），本席供配方与读数对表

## 使用依据

TriCode/src/trimodel-cli/README.md（条款②全文+七文件+frozen 生效记录）实读；纪律册附录 253ccd9（git show 实读）；W39 cto-adaptation-review.md（两写点扩面定案+唯一性后缀 helper+复验配方+隔离位锚）；batch-09 f3-patch-draft.md（sg TriMLC 不在役旁证）；本窗读数①（sg 侧现势盘点）。

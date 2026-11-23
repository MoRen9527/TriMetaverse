# 任务书呈批件·charter-20261123T161903Z（M4-v2·呈 CEO 批·rN-task-20261124）

- sourceOfTruth: 本卷+同目录 charter-20261123T161903Z.json（bb5aa1483·河源侧原文逐字节·8382B）
- 令源: M4-v2（出稿不代批）+resume12 轮末自动生成（00:19:03·并行首生效轮）
- 时点: 写前现查 2026-11-24T02:11+0800（D-47 原值）

## §一 · 基本信息

| 字段 | 值 |
|---|---|
| charter_id | **rN-task-20261124**（源 run=resume12） |
| status | pending_approval（**候 CEO 批**） |
| items | **7 条**（五字段全·七席视角） |
| 批复时点位 | `approval_comment: ______` ／ `approval_time: ______`（CEO 批面填） |

## §二 · items 清单（7 条摘要）

| # | opinion_id | 要点 |
|---|---|---|
| 1 | cos-1 | dce 执行面收口·dry_run 不进 verify/score/close |
| 2 | coo-1 | dce 任痕即停·dry_run/空 pass 不带进下游 |
| 3 | cao-1 | 三链归口有效收口·close 条件缺即 fail-closed |
| 4 | cpo-1 | W48 产出清单去后台面 |
| 5 | cto-1 | A 面迁移行进·bod-tick dest 实体化·keep/carry 面 |
| 6 | cho-1 | close.upgrade_list 11 项缺件补（七席维度面） |
| 7 | cfo-1 | 成本异常 guard_hits 文件 |

（逐条五字段全·JSON 校验 7/7 True·原文见 charter json）

## §三 · 出稿注记（如实）

1. **v1.2 框架**：resume12=并行首生效轮（8.1min·3x 提速）·**comparability=1.0/1.0**（v1.2 同表首个 1.0）——items 七席全覆盖。
2. **A/B=36.88/43.08**（<90 留 debug·M3-v2）·**链终态 exit=fuse**（round_count=8>=8·**M6 跨点火累计：本次点火收敛非进化终止·可再点火续跑·候 CEO 指示**）。
3. **DP-036 已全毕**（8 items 含 DP-028/DP-035·35 passed+SDE 实证）。
4. **D-91 三向实证齐**（拒/放/删）——机械面完整。

## §四 · 呈批链

本卷+BOD 转呈 CEO——CEO 批→DP 取号分派→施工→**再点火续跑**（M6 语义·候 CEO 定是否续）。

---
—— COS 小贾（m-cos·出稿不代批·M4-v2）·写前现查 2026-11-24T02:11+0800（D-47 原值）

## §五 · 附注（CEO 质询·2026-11-24T02:2x）

**CEO 质询「debug 态不该有 FUSE」**（BOD 转）：resume12（debug）报 exit=fuse（round_count=8）与 **M9「FUSE 仅 test 态生效」** 不符候选——CTO 四问核查中（纪律真源 M6/M9 原文及关系／round_runner fuse 判定是否读 flag／round_count 累计来源／判+修法+DP 取号）。**COS 初判**：M9 后铸收窄 M6 适用域→debug exit=fuse=**跑偏候选**（实现面候 CTO 查）。**本批件不受阻**；若 CEO 批，**续跑形待修法明确后再定**（候选修法=COS 判出后 DP-038 取号修 fuse flag 短路）。

## §六 · 任务书主体（CEO 令 2026-11-24T02:2x「不准点火，等我批任务书」）

**本呈批件=本次任务书主体**（CEO 令口径调整）：
- **主体 items**：charter-161903Z 7 条（rN-task-20261124）。
- **并入修项 2 条**：**DP-037**（rounds_run=0 上报小 bug·非急）+**DP-038**（debug 态 FUSE 判定读 flag·CTO 四问核查中·修法摘要附后）。
- **禁点火**：任何形式 fade001 点火（resume13/ignite/手动/POST /run）冻结至 CEO 批本任务书。
- **零施工**：DP-037/DP-038 修码候批同步开工——批前零施工零点火。
- **一次呈批一次点火**：批到后 DP 取号分派（含两修项）→施工→单次点火。

---
—— COS 小贾·附注 写前现查 2026-11-24T02:25+0800（D-47 原值）

## §七 · DP-038 真因定谳（SDE 铁证 + CTO 四问·2026-11-24T02:23）

**真因（铁证链）**：
1. `round-queue-r12/state/` **无 flag.json**（全仓零命中）——代码 **L173 缺省 `flag:'test'`** → readFlag 恒返 test；
2. ⇒ **flag 从未被写入/推进**（setFlag 无记录）·**起点即 test**；
3. ⇒ **M3-v2「A/B 双达标才→test」门从未生效**（resume9/10/11 全轮次均=缺省 test 语义）；
4. ⇒ resume12 round_count 7→8（跨点火累计达 8）·**M9 L287 test 态 FUSE 正确执行**——**代码无缺陷**；
5. ⇒ **COO/M4-v2「debug 单轮」叙述与实态不符**（全部轮次实为 test 态连跑·8 轮上限一直生效）。

**性质**：**DP-038 重定性=「flag 缺省=test·M3-v2 门形同虚设」**（非「误推进」·非「FUSE 判定错」）。

**修法三候选（呈 CEO 列选）**：
| 候选 | 内容 | 域 |
|---|---|---|
| **a** | 缺省改 **debug**（L173 一行最小改·D1 §二缺省面修订） | FSD 码面 |
| **b** | 点火前置强制 `set_flag debug --authority_ref`（**每点火留痕**） | SDE 点火形 |
| **c** | preflight 增 **flag 门断言**（门恒在·防御纵深） | FSD 码面 |
**SDE 建议 a+b 组合**（缺省安全+每点火留痕）｜**BOD 建议 a+c**（缺省安全+防御纵深）｜**COS 面综合建议 a+b+c 三层**（缺省安全/留痕/门恒在三件互补·成本低）。

**DP-037 照并入**（rounds_run=0 上报面 bug）。
**禁点火+零施工照执**（CEO 02:2x 令）。
**附真因链**：SDE 铁证（02:21:51）+CTO 四问（4d94d23b·M9/M6 真源对表+实现符纪律）+COS 补判（a 环前提→a1 初始化缺省命中）。

---
—— COS 小贾·续版 写前现查 2026-11-24T02:35+0800（D-47 原值）

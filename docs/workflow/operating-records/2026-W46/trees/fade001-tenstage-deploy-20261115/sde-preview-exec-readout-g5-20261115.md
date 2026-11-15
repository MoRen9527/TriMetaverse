# SDE G5 事件驱动预演毕报（修正后链·FSD 栏 A 施工毕 15:30:55 触发·CEO 14:50:31 governs）

- sourceOfTruth: 本卷（G5 预演毕报正身·deploy 树随档·与上午预演毕报 sde-preview-exec-readout-20261115.md 分卷分立）
- syncMode: write-time
- 执行席: SDE 小布；令源=COS 分诊投递（D-81 形·r67 勘误条款化·15:34:5x+08）——触发事件=FSD 栏 A 施工毕·不等 21:00 不候 G3/G4（并行互不阻塞）
- 执行窗: 2026-11-15T07:35:43Z 接令→07:4xZ 毕（读数 date 现查原值系）
- 判定: **G5 修正后链预演毕·V1-V6 全绿零止损·R2 复原断言族全绿·executed_ok 显式化成立·G5 对表真值双锚逐项命中**

## §一 · 执行链五步实录

| # | 步 | 读数要点 |
|---|---|---|
| ① | 前置四查（07:35-07:36Z） | 全绿——④现役基线 payload 2750/4e1c7df5 零漂移（上午预演后保持）+schedule/next/enabled 原样+runCount=15+healthz ok jobCount=4；①a TMV 检出 porcelain=0+HEAD=c98fd659（含上午 ops commit·pull 链活）；①b CLI 正形探针通；**②栏 A 修正面断言=河源 TriCompany 检出同顶 7d090db（平移笔5）与 sg 权威面同顶——修正后链前提成立**；porcelain=2 既有遗留如实注（同上午定性） |
| ② | POST run（07:37:10Z 锚） | HTTP:000（35s 同步形超时·同上午形态）——**服务端受理实锚：run dir 07:37:12Z 落（POST 后 2s）** |
| ③ | 终态轮询 | runCount 15→**16**+last=ok+ce=0（V3 ✓·run dir=shift-WW46-20261115T073712Z 11 件齐） |
| ④ | arrival | daemon 自落在位（V5 零误触发） |
| ⑤ | R2 复原判定面 | §七 断言族全绿（§三）——**R2 复原毕·托转一随本毕报触发**（值席 COS 换锚回 vB 判定面） |
| ⑥ | 毕报 | 本卷→值席 COS→BOD 呈 CEO |

## §二 · V1-V6 全绿

V1=分支 A 零 PATCH 态保持（全程 payload 2750 零漂移）｜V2 preflight 三查过｜V3 ok+ce=0｜V4 三面（run dir 11 件+**ops commit=01a2329ea 逐字对表 run id**+本机同顶 6cc535411）｜V5 arrival 自落零误触｜V6 jobCount=4 基数不变

## §三 · R2 复原断言族（G5 轮）

| # | 断言 | 读数 | 判 |
|---|---|---|---|
| 1 | payload 2750/4e1c7df5 | 逐字同串 | ✓ |
| 2 | schedule/next=1794757800000/enabled=true | 原样 | ✓ |
| 3 | jobCount=4 | 4+degraded:false+cf:0 | ✓ |
| 4 | 三面 ops commit 态 | **01a2329ea 在库在谱系（轻量刷新形：OP-W47 主件零重建=部分幂等·ADE 载体 .shift-ade.prev.json 轮换 94 行+OP-W46 index 微刷 2 行）**——**候裁面扩大如实录：两笔预演 ops commit（c98fd659+01a2329ea）并存在库·保持 vs 首拍前 revert（R3 形）候 COO/COS 定谳·本席零自行 revert** | 如实注+候裁 |
| 5 | runs 妆容零扰动 | 妆容目录在位+两预演 dir 留档 | ✓ |
| 6 | alarm 零 active | healthz 200+degraded:false | ✓ |
| 7 | 判据族锚遵行 | vB 锚+十阶段两分禁互判全程 | ✓ |

runCount=16=两次预演消耗预期态（首拍后=17·§十一.4 同族）。

## §四 · G5 对表真值双锚逐项命中（新增对表面）

1. **CTO 顶层域裁决 54b4c301f §四**：顶层 demand-pool 缺席=**首版预期态**——score 顶层无 demand_pool 键·预演拍读数照白名单 2 件语义判——**对表命中零升级** ✓（白名单今晚零扩·补课批先例承续=首拍毕补课线对齐）
2. **COS 清单卷 f13880a08 判断面对表**：score.json 判断面输出=**engine_state=executed_ok（顶层新字段显式化——栏 A 修正可见效果）+顶层 verdict=pass（引擎/链面）+内嵌 score.verdict=fail（评分面 61.5）三层分立**——逐族 {family,state,score,reasons} 形齐（confidence=族级 None 态如实录）；B/C 族红=预演时点读数保真（同上午判读·非缺陷）；A/F/H=manual 值席采集域设计行为；D/E/G 机判 40/65=61.5
3. dive 锚前提：FSD 四 commit payload md5 零触已勘（COS 令转）——23:45 dive 零换锚前提成立 ✓（本席两次预演全程零 PATCH 佐证）

## §五 · 护栏遵守声明

23:50 首拍硬锚不动（payload/schedule/next/enabled 全原样）✓｜零 payload 人工触 ✓｜D-46 值面零回显 ✓｜暂停窗语义生效（预演期探读漂移=预期态零误报）✓｜托转二挂起不触发（零换形 PATCH）✓

## §六 · 候件与挂账

1. **候裁（面扩大）**：两笔预演 ops commit（c98fd659+01a2329ea）保持 vs 首拍前 revert——候 COO/COS（部分幂等形已录：主件零重建·ADE prev 轮换）
2. 挂账：POST run 同步形 35s 超时（同上午·零阻塞零重复 run）
3. 首拍值守交棒（值席面）：B/C 族首拍应转绿判读+runCount 16→17+首拍 ops commit 形态（迁移器对两笔预演产物已迁态的实迁行为=plan.migrate 读数面候首拍实证）+demand-pool/daily-progress 缺席=首版预期态（补课批首拍毕对齐）

## 使用依据

sde-preview-exec-rollback-plan-20261113.md §十一；COS G5 分诊令（r67 条款化）；54b4c301f §四（G5 对表注记）；f13880a08（清单卷）；本卷读数=07:35-07:4xZ 现采实锚。

—— SDE 小布（毕报=值席 COS 主送→BOD 呈 CEO·卷面时戳=commit %cI）
